begin;

-- Keep the original name for equipment rules and image filenames, and the ID for logs.
alter table public.exercises
  add column if not exists display_name_en text,
  add column if not exists muscle_group text,
  add column if not exists search_aliases text,
  add column if not exists manual_only boolean not null default false;

update public.exercises e
set display_name_en = v.label, muscle_group = v.muscles, search_aliases = v.aliases
from (values
  ('Peso muerto rumano','Romanian Deadlift','Glúteos e isquios','RDL'),
  ('Sentadilla copa','Goblet Squat','Cuádriceps','sentadilla goblet'),
  ('Hip thrust','Hip Thrust','Glúteos e isquios','empuje de cadera'),
  ('Remo con barra','Barbell Row','Espalda y hombros','bent over row'),
  ('Press militar con mancuernas','Dumbbell Shoulder Press','Espalda y hombros','overhead press'),
  ('Farmer carry','Farmer’s Carry','Cuerpo completo','marcha del pastor paseo del granjero farmers walk'),
  ('Pallof press','Pallof Press','Core','press pallog antirrotación'),
  ('Face pull','Face Pull','Espalda y hombros','tirón a la cara'),
  ('Band pull-apart','Band Pull-Apart','Espalda y hombros','apertura con banda'),
  ('Plancha con arrastre','Plank Drag','Core','plank pull through'),
  ('Bird dog','Bird Dog','Core','perro de muestra'),
  ('Copenhagen plank','Copenhagen Plank','Aductores','plancha copenhague'),
  ('90/90 de caderas','90/90 Hip Switch','Cadera','movilidad de cadera'),
  ('Movilidad torácica en cuadrupedia','Quadruped Thoracic Rotation','Columna','rotación dorsal'),
  ('Respiración 360','360° Breathing','Core','respiración diafragmática')
) as v(original,label,muscles,aliases)
where e.name = v.original;

-- New exercises are for coaches to prescribe manually until the rules cover them.
insert into public.exercises (name, category, muscle_group, search_aliases, equipment, manual_only)
select v.name, v.category, v.muscles, v.aliases, v.equipment, true
from (values
  ('Deadlift','fuerza','Glúteos e isquios','pes mort peso muerto convencional','barra'),
  ('Front Squat','fuerza','Cuádriceps','sentadilla frontal','barra'),
  ('Zercher Squat','fuerza','Cuádriceps','sentadilla zercher','barra'),
  ('Glute Bridge','fuerza','Glúteos e isquios','puente glúteo puente de glúteos','sin material'),
  ('Scapular Mobility','movilidad','Espalda y hombros','movilidad escapular','sin material'),
  ('Cat-Camel','movilidad','Columna','cat cow gato camello','sin material'),
  ('Dead Bug','control','Core','bicho muerto','sin material'),
  ('BOSU Romanian Deadlift','control','Glúteos e isquios','rumano con bosu rdl','BOSU'),
  ('Stability Ball Romanian Deadlift','control','Glúteos e isquios','rumano con pelota balón fitball rdl','pelota'),
  ('Weighted Single-Leg Romanian Deadlift','fuerza','Glúteos e isquios','rumano unilateral con peso rdl','mancuerna o kettlebell'),
  ('Banded Monster Walk','fuerza','Glúteos e isquios','monsterwalk pasos con banda','banda'),
  ('Single-Arm Floor Press','fuerza','Pectorales y tríceps','floor press unilat press de suelo unilateral','mancuerna o kettlebell'),
  ('Hip Mobility + Single-Leg Cable Adduction','movilidad','Aductores','movilidad cadera aducción unilateral polea','polea')
) as v(name,category,muscles,aliases,equipment)
where not exists (select 1 from public.exercises e where lower(e.name) = lower(v.name));

commit;
