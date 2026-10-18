-- ═══════════════════════════════════════════════════════════════
-- EQUILAB METHOD · Resumen de actividad por cliente
-- Ejecutar en el SQL Editor. Se puede repetir sin miedo: si ya estaba
-- aplicada, no da error ni duplica nada.
--
-- El panel necesita saber de un vistazo cuándo entrenó cada cliente por
-- última vez. Contar sesiones una por una no escala: esta vista lo resuelve
-- en la base de datos, que es donde toca.
--
-- `security_invoker` hace que la vista respete el RLS de quien pregunta:
-- el equipo ve a todos, cada cliente solo lo suyo.
-- ═══════════════════════════════════════════════════════════════

create or replace view public.client_activity
with (security_invoker = on) as
select
  user_id,
  max(performed_on) as last_session,
  count(*)::integer as total_sessions
from public.workout_sessions
group by user_id;
