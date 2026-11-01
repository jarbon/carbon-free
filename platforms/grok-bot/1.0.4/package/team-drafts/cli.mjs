import {createStore} from './store.mjs';import {serve} from './server.mjs';
try{
 const command=process.argv[2],store=createStore();
 if(command==='status')console.log(JSON.stringify(store.summary()));
 else if(command==='open'||command==='offer'){
  const summary=store.summary();
  if(command==='offer'&&!summary.needsPrompt)console.log(JSON.stringify(summary));
  else{const {url}=await serve({store});console.log(JSON.stringify({url,sharingEnabled:false,expiresInMinutes:15}));}
 }else throw Error();
}catch{console.error('Team draft settings unavailable. No contact data is included in this message.');process.exitCode=1;}
