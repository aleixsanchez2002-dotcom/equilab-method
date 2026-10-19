-- ═══════════════════════════════════════════════════════════════
-- EQUILAB METHOD · Peso corporal semanal, cuenta y explicación
-- Ejecutar en el SQL Editor. Se puede repetir sin miedo: si ya estaba
-- aplicada, no da error ni duplica nada.
-- ═══════════════════════════════════════════════════════════════

-- 1. Peso corporal semanal: una fila por cliente y semana (el lunes).
--    El cliente puede corregir el dato de la semana en curso.
create table if not exists public.body_weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  measured_on date not null,            -- siempre el lunes de esa semana
  weight_kg numeric(5, 2) not null check (weight_kg between 25 and 250),
  created_at timestamptz not null default now(),
  unique (user_id, measured_on)
);

alter table public.body_weight_logs enable row level security;

drop policy if exists "peso: registrar propio" on public.body_weight_logs;
create policy "peso: registrar propio" on public.body_weight_logs
  for insert with check (auth.uid() = user_id);
drop policy if exists "peso: corregir propio" on public.body_weight_logs;
create policy "peso: corregir propio" on public.body_weight_logs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "peso: leer" on public.body_weight_logs;
create policy "peso: leer" on public.body_weight_logs
  for select using (auth.uid() = user_id or public.is_coach());

-- 2. Explicación de la rutina para el cliente (separada de `notes`,
--    que es la nota interna del motor/equipo).
alter table public.routines add column if not exists explanation text;

-- 3. Arreglo de permisos del perfil: la política antigua solo dejaba
--    editar el perfil a quien tuviera rol 'cliente' (bloqueaba a los
--    admins cambiar su propio nombre). Regla nueva: cada uno edita su
--    perfil pero NUNCA puede cambiarse el rol.
create or replace function public.rol_actual()
returns public.rol_usuario
language sql stable security definer set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

drop policy if exists "propio perfil: editar" on public.profiles;
create policy "propio perfil: editar" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id and role = public.rol_actual());
