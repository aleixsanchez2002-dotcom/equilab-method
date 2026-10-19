-- ═══════════════════════════════════════════════════════════════
-- EQUILAB METHOD · Arreglo del motor (fase 4)
--
-- NOTA: este arreglo ya está incorporado en 0004, así que ejecutar esta
-- migración es opcional. Se conserva por historia: si ya la ejecutaste en
-- su día, no hay nada más que hacer.
--
-- Problema que resolvió: las políticas originales de 0004 comprobaban la
-- rutina padre con subconsultas sujetas al RLS del propio cliente (que no
-- puede LEER sus borradores) → siempre denegaban.
-- Solución: funciones SECURITY DEFINER, como is_coach().
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

drop policy if exists "días de rutina: proponer en propia" on public.routine_days;
create policy "días de rutina: proponer en propia" on public.routine_days
  for insert with check (public.es_mi_borrador(routine_id));

drop policy if exists "ejercicios de rutina: proponer en propia" on public.routine_exercises;
create policy "ejercicios de rutina: proponer en propia" on public.routine_exercises
  for insert with check (public.es_dia_de_mi_borrador(routine_day_id));
