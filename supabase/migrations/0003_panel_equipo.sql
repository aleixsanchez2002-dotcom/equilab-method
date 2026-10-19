-- ═══════════════════════════════════════════════════════════════
-- EQUILAB METHOD · Fase 5 — panel del equipo
-- Ejecutar en el SQL Editor. Se puede repetir sin miedo: si ya estaba
-- aplicada, no da error ni duplica nada.
-- ═══════════════════════════════════════════════════════════════

-- 1. El email en el perfil, para la lista de clientes del panel
--    (auth.users no es legible desde la app; lo copiamos al registrarse).
alter table public.profiles add column if not exists email text not null default '';

update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id and p.email = '';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id,
          coalesce(new.raw_user_meta_data ->> 'full_name', ''),
          coalesce(new.email, ''));

  if (new.raw_user_meta_data ->> 'health_consent') = 'true' then
    insert into public.consents (user_id, kind, policy_version)
    values (new.id, 'datos_salud',
            coalesce(new.raw_user_meta_data ->> 'policy_version', 'sin-version'));
  end if;

  return new;
end;
$$;

-- 2. Alta manual de acceso: mientras Stripe (fase 3) no está conectado,
--    el equipo puede conceder/retirar suscripciones desde el panel.
--    Cuando Stripe llegue, los webhooks pasarán a ser la fuente de verdad.
drop policy if exists "suscripciones: gestionar (equipo)" on public.subscriptions;
create policy "suscripciones: gestionar (equipo)" on public.subscriptions
  for all using (public.is_coach()) with check (public.is_coach());
