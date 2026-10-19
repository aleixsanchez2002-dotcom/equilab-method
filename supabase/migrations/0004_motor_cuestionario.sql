-- ═══════════════════════════════════════════════════════════════
-- EQUILAB METHOD · Fase 4 — cuestionario + motor de reglas
-- Ejecutar en el SQL Editor. Se puede repetir sin miedo: si ya estaba
-- aplicada, no da error ni duplica nada.
--
-- Al enviar el cuestionario, el propio cliente crea su rutina PROPUESTA
-- (estado borrador, tipo semi) generada por el motor. No puede publicarla
-- ni editarla: eso sigue siendo del equipo.
--
-- Las comprobaciones van en funciones SECURITY DEFINER porque una
-- subconsulta normal se ejecutaría bajo el RLS del propio cliente, que no
-- puede leer sus borradores, y entonces siempre denegaría (ver 0005).
-- ═══════════════════════════════════════════════════════════════

create or replace function public.es_mi_borrador(rid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.routines r
    where r.id = rid and r.user_id = auth.uid() and r.status = 'borrador'
  );
$$;

create or replace function public.es_dia_de_mi_borrador(did uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1
    from public.routine_days d
    join public.routines r on r.id = d.routine_id
    where d.id = did and r.user_id = auth.uid() and r.status = 'borrador'
  );
$$;

drop policy if exists "rutinas: proponer propia (motor)" on public.routines;
create policy "rutinas: proponer propia (motor)" on public.routines
  for insert with check (
    auth.uid() = user_id
    and status = 'borrador'
    and type = 'semi'
  );

drop policy if exists "días de rutina: proponer en propia" on public.routine_days;
create policy "días de rutina: proponer en propia" on public.routine_days
  for insert with check (public.es_mi_borrador(routine_id));

drop policy if exists "ejercicios de rutina: proponer en propia" on public.routine_exercises;
create policy "ejercicios de rutina: proponer en propia" on public.routine_exercises
  for insert with check (public.es_dia_de_mi_borrador(routine_day_id));
