import http from 'node:http';import crypto from 'node:crypto';import fs from 'node:fs';import {createStore} from './store.mjs';
export async function serve({store=createStore(),timeout=15*60*1000}={}){
 const token=crypto.randomBytes(32).toString('hex');const page=fs.readFileSync(new URL('./page.html',import.meta.url));let origin;
 const server=http.createServer(async(req,res)=>{
  const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'"};
  const json=(status,value)=>{res.writeHead(status,{...headers,'Content-Type':'application/json'});res.end(JSON.stringify(value));};
  if(req.headers.host!==new URL(origin).host||(req.headers.origin&&req.headers.origin!==origin)||req.headers['sec-fetch-site']==='cross-site')return json(403,{error:'Invalid origin or host'});
  if(req.method==='GET'&&req.url==='/'){res.writeHead(200,{...headers,'Content-Type':'text/html; charset=utf-8'});return res.end(page);}
  if(req.url!=='/draft')return json(404,{error:'Not found'});
  const supplied=String(req.headers['x-carbon-draft-token']||'');
  if(Buffer.byteLength(supplied)!==Buffer.byteLength(token)||!crypto.timingSafeEqual(Buffer.from(supplied),Buffer.from(token)))return json(403,{error:'Invalid session'});
  if(req.method==='GET'){try{return json(200,store.read());}catch{return json(500,{error:'Draft storage unavailable'});}}
  if(req.method!=='POST')return json(405,{error:'Method not allowed'});
  if(req.headers.origin!==origin||req.headers['content-type']!=='application/json')return json(403,{error:'Invalid origin or content type'});
  try{let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>32768)throw Error();}json(200,store.update(JSON.parse(body)));}catch{json(400,{error:'Invalid or stale draft request; reload and check addresses'});}
 });
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});origin='http://127.0.0.1:'+server.address().port;
 const timer=setTimeout(()=>server.close(),timeout);timer.unref();server.on('close',()=>clearTimeout(timer));return {server,url:origin+'/#'+token};
}
