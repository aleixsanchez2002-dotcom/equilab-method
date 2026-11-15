-- Un envío por día del mesociclo; corrección transaccional con control de versión.
begin;
alter table public.workout_sessions add column if not exists completed_at timestamptz;
alter table public.workout_sessions add column if not exists revision integer not null default 0;
alter table public.workout_sessions add column if not exists corrected_at timestamptz;
-- Conservar los registros antiguos. El último envío con detalle marca el día;
-- los intentos vacíos y sesiones anteriores siguen intactos en el historial.
with ultimas as (
 select distinct on (s.user_id,s.routine_day_id) s.id
 from public.workout_sessions s
 where s.routine_day_id is not null and exists (
  select 1 from public.workout_logs l where l.session_id=s.id and jsonb_array_length(l.series)>0
 ) order by s.user_id,s.routine_day_id,s.created_at desc,s.id desc
)
update public.workout_sessions s set completed_at=s.created_at,revision=1
from ultimas u where s.id=u.id and s.completed_at is null;
create unique index if not exists workout_day_completed_once on public.workout_sessions(user_id,routine_day_id) where completed_at is not null;

create or replace function public.enviar_dia_entrenamiento(p_dia uuid,p_entradas jsonb,p_revision integer default null)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
 v_uid uuid := auth.uid(); v_session public.workout_sessions%rowtype;
 v_e jsonb; v_s jsonb; v_count integer := 0; v_re public.routine_exercises%rowtype;
 v_rutina uuid; v_status text; v_owner uuid;
begin
 if v_uid is null then raise exception 'Login required' using errcode='42501'; end if;
 if not (public.has_active_access(v_uid) or public.is_coach()) then raise exception 'Access required' using errcode='42501'; end if;
 -- Lock the routine against concurrent coach edits/publication, then the day.
 select r.id into v_rutina from public.routine_days d join public.routines r on r.id=d.routine_id where d.id=p_dia;
 select r.user_id,r.status into v_owner,v_status from public.routines r where r.id=v_rutina for share;
 if v_owner is distinct from v_uid or v_status is distinct from 'publicada' then raise exception 'Own published routine required' using errcode='42501'; end if;
 perform pg_advisory_xact_lock(hashtextextended(v_uid::text || p_dia::text,0));
 if jsonb_typeof(p_entradas) is distinct from 'array' or jsonb_array_length(p_entradas) not between 1 and 40 then raise exception 'Invalid entries'; end if;
 if (select count(distinct e->>'routine_exercise_id') from jsonb_array_elements(p_entradas) e) <> jsonb_array_length(p_entradas) then raise exception 'Duplicate exercise'; end if;
 for v_e in select * from jsonb_array_elements(p_entradas) loop
  select * into v_re from public.routine_exercises where id=(v_e->>'routine_exercise_id')::uuid and routine_day_id=p_dia;
  if not found or v_re.exercise_id is distinct from (v_e->>'exercise_id')::uuid then raise exception 'Exercise outside day' using errcode='42501'; end if;
  if jsonb_typeof(v_e->'series') is distinct from 'array' or jsonb_array_length(v_e->'series') not between 1 and 30 then raise exception 'Invalid sets'; end if;
  for v_s in select * from jsonb_array_elements(v_e->'series') loop
   if jsonb_typeof(v_s) is distinct from 'object' or exists(select 1 from unnest(array['kg','reps','rir','descanso']) k where jsonb_typeof(v_s->k) is distinct from 'string' or length(v_s->>k)>40) then raise exception 'Invalid set fields'; end if;
   if v_s->>'kg' <> '' and ((v_s->>'kg') !~ '^\d+([.,]\d+)?$' or replace(v_s->>'kg',',','.')::numeric>1500) then raise exception 'Invalid kg'; end if;
   if v_s->>'reps' <> '' and ((v_s->>'reps') !~ '^\d+$' or (v_s->>'reps')::numeric>1000) then raise exception 'Invalid reps'; end if;
   if v_s->>'rir' <> '' and ((v_s->>'rir') !~ '^\d+$' or (v_s->>'rir')::numeric>10) then raise exception 'Invalid RIR'; end if;
   if btrim((v_s->>'kg') || (v_s->>'reps') || (v_s->>'rir') || (v_s->>'descanso')) <> '' then v_count:=v_count+1; end if;
  end loop;
 end loop;
 if v_count=0 then raise exception 'Empty workout'; end if;
 select * into v_session from public.workout_sessions where user_id=v_uid and routine_day_id=p_dia and completed_at is not null for update;
 if found then
  if p_revision is null or p_revision<>v_session.revision then raise exception 'Stale submission' using errcode='40001'; end if;
  delete from public.workout_logs where session_id=v_session.id and user_id=v_uid;
  update public.workout_sessions set revision=revision+1,corrected_at=now() where id=v_session.id returning * into v_session;
 else
  if p_revision is not null then raise exception 'Missing original submission' using errcode='40001'; end if;
  insert into public.workout_sessions(user_id,routine_day_id,completed_at,revision) values(v_uid,p_dia,now(),1) returning * into v_session;
 end if;
 insert into public.workout_logs(session_id,user_id,exercise_id,routine_exercise_id,series,performed_on)
 select v_session.id,v_uid,(e->>'exercise_id')::uuid,(e->>'routine_exercise_id')::uuid,e->'series',v_session.performed_on from jsonb_array_elements(p_entradas) e;
 return jsonb_build_object('id',v_session.id,'completed_at',v_session.completed_at,'revision',v_session.revision);
end;
$$;
revoke all on function public.enviar_dia_entrenamiento(uuid,jsonb,integer) from public,anon;
grant execute on function public.enviar_dia_entrenamiento(uuid,jsonb,integer) to authenticated;
-- Los clientes escriben mediante la función validada, nunca por INSERT directo.
revoke insert,update,delete on public.workout_sessions,public.workout_logs from anon,authenticated;
-- El editor no puede borrar/recrear días que ya tienen envíos.
create or replace function public.proteger_bloque_enviado() returns trigger
language plpgsql security definer set search_path = '' as $$
declare v_rutina uuid;
begin
 if tg_table_name='routines' then
  if tg_op='UPDATE' and (new.user_id,new.title,new.type,new.weeks,new.explanation) is not distinct from (old.user_id,old.title,old.type,old.weeks,old.explanation) then return new; end if;
  v_rutina:=old.id;
 elsif tg_table_name='routine_days' then v_rutina:=old.routine_id;
 else select routine_id into v_rutina from public.routine_days where id=old.routine_day_id;
 end if;
 if not exists(select 1 from public.routines r join auth.users u on u.id=r.user_id where r.id=v_rutina) then
  if tg_op='DELETE' then return old; else return new; end if;
 end if;
 if exists(select 1 from public.workout_sessions s join public.routine_days d on d.id=s.routine_day_id where d.routine_id=v_rutina and s.completed_at is not null) then
  raise exception 'Completed block: create a new routine to preserve submissions' using errcode='23514';
 end if;
 if tg_op='DELETE' then return old; end if;
 return new;
end;
$$;
revoke all on function public.proteger_bloque_enviado() from public,anon,authenticated;
create trigger conservar_bloque before update or delete on public.routines for each row execute function public.proteger_bloque_enviado();
create trigger conservar_dias before update or delete on public.routine_days for each row execute function public.proteger_bloque_enviado();
create trigger conservar_ejercicios before update or delete on public.routine_exercises for each row execute function public.proteger_bloque_enviado();
commit;
