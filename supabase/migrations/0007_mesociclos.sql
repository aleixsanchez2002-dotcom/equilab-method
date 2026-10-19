-- ═══════════════════════════════════════════════════════════════
-- EQUILAB METHOD · Mesociclos (semanas dentro de la rutina)
-- Ejecutar en el SQL Editor. Se puede repetir sin miedo: si ya estaba
-- aplicada, no da error ni duplica nada.
--
-- Hasta ahora una rutina tenía días que se repetían todas las semanas.
-- Ahora cada día pertenece a una semana concreta, así que el equipo puede
-- programar la progresión semana a semana (cargas, ejercicios, series).
-- ═══════════════════════════════════════════════════════════════

-- 1. La semana a la que pertenece cada día (lo existente pasa a la semana 1)
alter table public.routine_days
  add column if not exists week integer not null default 1;

alter table public.routine_days
  drop constraint if exists routine_days_routine_id_position_key;

-- Se quita y se vuelve a poner para que repetir la migración no falle
alter table public.routine_days
  drop constraint if exists routine_days_routine_week_position_key;

alter table public.routine_days
  add constraint routine_days_routine_week_position_key
  unique (routine_id, week, position);

-- 2. Fecha de arranque: sirve para saber en qué semana va el cliente
alter table public.routines
  add column if not exists started_on date;

update public.routines
set started_on = created_at::date
where started_on is null and status = 'publicada';
