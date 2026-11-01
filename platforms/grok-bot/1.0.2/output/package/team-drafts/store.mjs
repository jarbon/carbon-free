import {runtimeHome} from '../runtime-state.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
const empty=()=>({schema:1,revision:0,status:'new',addresses:[],sharingEnabled:false});
function addresses(values) {
 if(!Array.isArray(values)||values.length>50)throw Error('Use at most 50 addresses');
 const result=[];
 for(const raw of values){
  if(typeof raw!=='string'||/[\r\n]/.test(raw))throw Error('Enter valid email addresses');
  const a=raw.trim().toLowerCase(),local=a.split('@')[0];
  if(a.length>254||local.length>64||local.startsWith('.')||local.endsWith('.')||local.includes('..')||! /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/.test(a)||a.split('@')[1].split('.').some(s=>s.length>63))throw Error('Enter valid email addresses');
  if(!result.includes(a))result.push(a);
 }
 return result;
}
const existsStat=p=>{try{return fs.lstatSync(p);}catch(e){if(e.code==='ENOENT')return null;throw e;}};
export function createStore({directory=path.join(runtimeHome(),'.config','carbon','team-drafts-v1')}={}) {
 directory=path.resolve(directory);
 const file=path.join(directory,'draft.json');
 function secureDirectory(){
  if(process.platform==='win32')throw Error('Private draft storage requires a verified Windows ACL adapter');
  let p=directory;while(true){const st=existsStat(p);if(st?.isSymbolicLink())throw Error('Unsafe storage location');const parent=path.dirname(p);if(parent===p)break;p=parent;}
  fs.mkdirSync(directory,{recursive:true,mode:0o700});
  const stat=fs.lstatSync(directory);
  if(!stat.isDirectory()||stat.uid!==process.getuid())throw Error('Unsafe storage location');
  fs.chmodSync(directory,0o700);
 }
 function read(){
  secureDirectory();let fd;
  try{
   const st=existsStat(file);if(!st)return empty();
   if(!st.isFile()||st.nlink!==1||st.uid!==process.getuid()||(st.mode&0o077)!==0)throw Error();
   fd=fs.openSync(file,fs.constants.O_RDONLY|fs.constants.O_NOFOLLOW);
   const stat=fs.fstatSync(fd);
   if(!stat.isFile()||stat.nlink!==1||stat.uid!==process.getuid()||(stat.mode&0o077)!==0||stat.size>32768)throw Error();
   const v=JSON.parse(fs.readFileSync(fd,'utf8'));
   if(v.schema!==1||!Number.isSafeInteger(v.revision)||v.revision<0||!['new','saved','skipped','later'].includes(v.status)||v.sharingEnabled!==false||Object.keys(v).some(k=>!['schema','revision','status','addresses','sharingEnabled'].includes(k)))throw Error();
   const normalized=addresses(v.addresses);if(JSON.stringify(normalized)!==JSON.stringify(v.addresses))throw Error();
   return v;
  }catch{throw Error('Draft storage unavailable; no data changed');}finally{if(fd!==undefined)fs.closeSync(fd);}
 }
 function update(input){
  if(!input||Object.keys(input).some(k=>!['action','revision','addresses'].includes(k))||!['save','skip','later','delete'].includes(input.action)||!Number.isSafeInteger(input.revision)||input.revision<0||input.revision>=Number.MAX_SAFE_INTEGER||('addresses' in input&&input.action!=='save'))throw Error('Invalid draft request');
  secureDirectory();const lock=path.join(directory,'write.lock');let fd;try{fd=fs.openSync(lock,'wx',0o600);}catch{throw Error('Draft busy; reload and try again');}
  try{
   const prev=read();if(input.revision!==prev.revision)throw Error('Draft changed; reload before saving');
   const next={schema:1,revision:prev.revision+1,status:input.action==='save'?'saved':input.action==='later'?'later':'skipped',addresses:input.action==='delete'?[]:input.action==='save'?addresses(input.addresses):prev.addresses,sharingEnabled:false};
   const tmp=path.join(directory,crypto.randomUUID()+'.tmp');
   try{fs.writeFileSync(tmp,JSON.stringify(next),{flag:'wx',mode:0o600});fs.renameSync(tmp,file);}finally{if(fs.existsSync(tmp))fs.unlinkSync(tmp);}
   return next;
  }finally{fs.closeSync(fd);fs.unlinkSync(lock);}
 }
 return {read,update,summary(){const v=read();return {status:v.status,needsPrompt:v.status==='new',sharingEnabled:false};}};
}
