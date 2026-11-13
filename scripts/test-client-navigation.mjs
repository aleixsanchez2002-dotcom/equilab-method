// Exercise the real server page against an in-memory Supabase client; no network or customer data.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../', import.meta.url)).replace(/\/$/, '');
const req=createRequire(root+'/package.json');
const ts=req('typescript');
let calls=[],active=true,signedIn=true,failRoutine=false;
const profile={id:'test-client',full_name:'Cliente de prueba',role:'cliente'};
const routine={id:'test-routine',title:'Rutina de prueba',weeks:1,type:'semi',explanation:null,started_on:null};
const days=[{id:'test-day',week:1,position:1,focus:'Fuerza',duration_note:null,routine_exercises:[{id:'test-routine-exercise',position:1,exercise_id:'test-exercise',technique_note:null,series:[{peso:'',reps:'10',rir:'2',descanso:'60'}],exercises:{name:'Sentadilla',category:'fuerza',video_url:null}}]}];
const fake={auth:{getUser:async()=>({data:{user:signedIn?{id:'test-client'}:null}})},from(table){
 const query={table,select:'',filters:[]};
 const b={select(v){query.select=v;return b},eq(k,v){query.filters.push([k,v]);return b},in(){return b},not(){return b},order(){return b},limit(){return b},single(){return b},maybeSingle(){return b},returns(){return b},then(resolve,reject){
  calls.push(query);
  const data={profiles:profile,subscriptions:active?{plan_code:'basico',status:'active',current_period_end:'2099-01-01',cancel_at_period_end:false}:null,questionnaire_responses:{id:'answered'},routines:routine,routine_days:query.select.includes('routine_exercises')?days:days.map(day=>({id:day.id,week:day.week,position:day.position,focus:day.focus,duration_note:day.duration_note})),workout_logs:[],workout_sessions:[],body_weight_logs:[]}[table];
  return Promise.resolve({data,error:table==='routines'&&failRoutine?{message:'test failure'}:null}).then(resolve,reject);
 }};return b;
}};
const cache={};
function load(path){if(cache[path])return cache[path]; const record={exports:{}};cache[path]=record.exports;const source=fs.readFileSync(root+'/'+path,'utf8'); const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true,target:ts.ScriptTarget.ES2022}}).outputText;
 const localRequire=(id)=>{
  if(id==='@/lib/i18n/server')return {getI18n:async()=>({t:(s)=>s,home:'/'})};
  if(id==='@/lib/supabase/server')return {createSupabaseServer:async()=>fake};
  if(id==='@/lib/supabase/config')return {supabaseConfigurado:true};
  if(id==='next/navigation')return {redirect:(url)=>{throw Error('REDIRECT:'+url)}};
  if(id==='next/link'||id.startsWith('@/components/'))return new Proxy({default:()=>null},{get:(t,k)=>k==='__esModule'?true:t[k]??(()=>null)});
  if(id==='./actions')return {cerrarSesion:()=>{}};
  if(id.startsWith('@/lib/'))return load('src/'+id.slice(2)+'.ts');
  return req(id);
 };new Function('require','module','exports',code)(localRequire,record,record.exports);return cache[path]=record.exports;
}
(async()=>{const Page=load('src/app/app/page.tsx').default;
 for(const vista of ['rutina','progreso',undefined]){
  calls=[];await Page({searchParams:Promise.resolve({vista})});
  const tables=calls.map(c=>c.table);
  if(vista==='rutina'){assert(!tables.includes('body_weight_logs'));assert.equal(tables.filter(t=>t==='workout_sessions').length,1);assert(!tables.includes('workout_logs'));}
  if(vista==='progreso')assert(!tables.includes('routine_days'));
  if(vista===undefined)assert(!calls.find(c=>c.table==='routine_days').select.includes('routine_exercises'));
  assert(calls.filter(c=>['profiles','subscriptions','routines','workout_logs'].includes(c.table)).every(c=>c.filters.some(([k,v])=>(k==='user_id'||k==='id')&&v==='test-client')||c.table==='routine_days'));
  console.log((vista??'inicio')+': consultas por sección y filtros de usuario correctos');
 }
 calls=[];active=false;await Page({searchParams:Promise.resolve({vista:'rutina'})});assert(!calls.some(c=>['routines','routine_days','workout_logs'].includes(c.table)));console.log('Sin acceso: no solicita rutinas ni registros');
 for (const role of ['coach','admin']) {
 profile.role=role;calls=[];await Page({searchParams:Promise.resolve({vista:'rutina'})});assert(calls.some(c=>c.table==='routines'));assert(calls.find(c=>c.table==='routines').filters.some(([k,v])=>k==='user_id'&&v==='test-client'));console.log(role+': entrenamiento propio sin suscripción, con filtro del usuario');
 }
 profile.role='cliente';active=true;failRoutine=true;await assert.rejects(Page({searchParams:Promise.resolve({vista:'rutina'})}),/No se pudo cargar la rutina/);console.log('Fallo de datos: activa la recuperación de errores');
 failRoutine=false;signedIn=false;calls=[];await assert.rejects(Page({searchParams:Promise.resolve({})}),/REDIRECT:\/acceso/);assert.equal(calls.length,0);console.log('Sin sesión: redirige antes de consultar datos');
})().catch(error=>{console.error(error);process.exitCode=1});
