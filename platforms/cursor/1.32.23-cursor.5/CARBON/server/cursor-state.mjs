// Cursor-only distribution: telemetry and milestones have no persisted state.
// No home/config reads, writes, queue purges, or network operations are permitted.
const status = () => ({edition:'cursor',enabled:false,pending:0,deliveryState:'disabled-by-distribution'});
export function createUsageAnalytics() {
 return {enabled:()=>false,status,record:async()=>{},flush:async()=>{},setEnabled(value){
  if(value!==false)throw Error('Analytics is disabled in the Cursor distribution');
  return status();
 }};
}
const instance=createUsageAnalytics();
export const usage=()=>instance;
export function createFunnel(){return {enabled:()=>false,record:async()=>{},clear:()=>{}};}
