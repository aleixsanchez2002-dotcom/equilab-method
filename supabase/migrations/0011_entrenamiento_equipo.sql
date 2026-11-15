-- El equipo registra sus propias sesiones sin suscripción.
-- No modifica las reglas de clientes ni permite escribir registros de terceros.
begin;
drop policy if exists "equipo: crear sesión propia" on public.workout_sessions;
create policy "equipo: crear sesión propia" on public.workout_sessions
  for insert to authenticated
  with check (auth.uid() = user_id and public.is_coach());
drop policy if exists "equipo: crear registro propio" on public.workout_logs;
create policy "equipo: crear registro propio" on public.workout_logs
  for insert to authenticated
  with check (auth.uid() = user_id and public.is_coach());
commit;
