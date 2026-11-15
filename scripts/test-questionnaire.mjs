// Validación real con respuestas sintéticas: no usa red ni datos de clientes.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
const mod={exports:{}};
new Function('module','exports',ts.transpileModule(fs.readFileSync('src/lib/questionnaire.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(mod,mod.exports);
const {QUESTIONNAIRE_QUESTIONS:q,QUESTIONNAIRE_VERSION,validarCuestionario:v}=mod.exports;
assert.equal(QUESTIONNAIRE_VERSION,3);
assert(!q.some(p=>p.id==='fortalezas'));
const phone=q.find(p=>p.id==='telefono_contacto');
for(const value of ['+34 600 000 000','0034 600000000','(020) 1234-5678']) assert.deepEqual(v([phone],{telefono_contacto:value}).errores,{});
for(const value of ['', '123', '1234567890123456', 'abcdefghi', '+34 600000000 ext 2', '<script>123456789</script>', ['600000000']]) assert(v([phone],{telefono_contacto:value}).errores.telefono_contacto);
const posture=q.find(p=>p.id==='defecto_postural');
assert(v([posture],{defecto_postural:['Ninguna en particular','Codos abiertos']}).errores.defecto_postural);
assert.deepEqual(v([posture],{defecto_postural:['Ninguna en particular']}).errores,{});
const side=q.find(p=>p.id==='asimetria');
for(const option of side.opciones) assert.deepEqual(v([side],{asimetria:option}).errores,{});
assert(v([side],{asimetria:'Me cuesta más hacia la derecha'}).errores.asimetria);
const oldSql=fs.readFileSync('supabase/migrations/0010_cuestionario_jinete_v2.sql','utf8');
const old=JSON.parse(oldSql.match(/'Perfil inicial del jinete — Equilab', '(.*)'::jsonb/)[1]);
assert.deepEqual(v([old.find(p=>p.id==='asimetria')],{asimetria:'Me cuesta más hacia la derecha'}).errores,{});
const baseline=Object.fromEntries(q.map(p=>[p.id,p.tipo==='multiselect'?[p.opciones[0]]:p.tipo==='select'?p.opciones[0]:p.tipo==='numero'?'30':p.tipo==='telefono'?'+34 600000000':'Respuesta de prueba']));
baseline.lesion='No';baseline.pautas_profesional='No';baseline.competicion='No compito';baseline.sorpresa='No guardar';
const validated=v(q,baseline);assert.deepEqual(validated.errores,{});
for(const id of ['sorpresa','detalle_lesion','detalle_pautas','eventos']) assert(!(id in validated.respuestas));
const migration=fs.readFileSync('supabase/migrations/0012_cuestionario_jinete_v3.sql','utf8');
assert.deepEqual(JSON.parse(migration.match(/'Perfil inicial del jinete — Equilab', '(.*)'::jsonb/)[1]),q);
const en=JSON.parse(fs.readFileSync('src/lib/i18n/en.json','utf8'));
for(const p of q) for(const str of [p.texto,p.ayuda,...(p.opciones??[])].filter(Boolean)) {
 if(!/^\d|^0$/.test(str)) assert(en[str.trim().replace(/\s+/g,' ')],`Falta traducción: ${str}`);
}
console.log('OK: teléfono, exclusivas, lados, compatibilidad v2, condiciones, migración v3 y traducciones.');
