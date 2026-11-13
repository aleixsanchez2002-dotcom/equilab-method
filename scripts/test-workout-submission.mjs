import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
const mod={exports:{}};
new Function('module','exports',ts.transpileModule(fs.readFileSync('src/lib/workout-submission.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(mod,mod.exports);
const {validarRegistro:v,siguienteDia:next}=mod.exports;
const id=n=>`00000000-0000-4000-8000-${String(n).padStart(12,'0')}`;
const empty={kg:'',reps:'',rir:'',descanso:''};
const payload={routine_day_id:id(1),revision:null,entradas:[{routine_exercise_id:id(2),exercise_id:id(3),series:[empty,{kg:'40,5',reps:'10',rir:'2',descanso:'3:00'}]}]};
assert.deepEqual(v(payload),payload); // Blank S1 must not shift S2 into its place.
for(const bad of [null,{},[],{...payload,entradas:null},{...payload,revision:-1},{...payload,revision:1.5},{...payload,entradas:[payload.entradas[0],payload.entradas[0]]}]) assert.equal(v(bad),null);
for(const field of ['kg','reps','rir','descanso']) {
 const p=structuredClone(payload);p.entradas[0].series[1][field]=null;assert.equal(v(p),null);
}
for(const [field,value] of [['kg','-1'],['kg','1501'],['kg','12kg'],['reps','1.5'],['rir','11'],['rir','-1']]) {
 const p=structuredClone(payload);p.entradas[0].series[1][field]=value;assert.equal(v(p),null);
}
assert.equal(v({...payload,entradas:[{...payload.entradas[0],series:[empty]}]}),null);
assert.equal(v({...payload,revision:2}).revision,2);
const weeks=[{week:1,dias:[{id:id(1)},{id:id(2)}]},{week:2,dias:[{id:id(3)}]}];
assert.deepEqual(next(weeks,new Set()),{semana:0,dia:0});
assert.deepEqual(next(weeks,new Set([id(1)])),{semana:0,dia:1});
assert.deepEqual(next(weeks,new Set([id(1),id(2)])),{semana:1,dia:0});
assert.deepEqual(next(weeks,new Set([id(2)])),{semana:0,dia:0});
assert.equal(next(weeks,new Set([id(1),id(2),id(3)])),null);
assert.equal(next([],new Set()),null);
console.log('OK: validación de registros, series vacías sin desplazamiento, correcciones y avance entre semanas/fin de mesociclo.');
