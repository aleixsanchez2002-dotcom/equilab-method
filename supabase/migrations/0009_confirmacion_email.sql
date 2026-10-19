-- ═══════════════════════════════════════════════════════════════
-- EQUILAB METHOD · Estado de confirmación del email
-- Ejecutar en el SQL Editor. Se puede repetir sin miedo: si ya estaba
-- aplicada, no da error ni duplica nada.
--
-- Al registrarse se crea el perfil al instante, antes de que la persona
-- confirme su email. Sin este dato, el panel mostraba como clientes reales
-- a cuentas que ni siquiera pueden entrar (por ejemplo, alguien que se
-- equivoca al escribir su correo y nunca recibe el enlace).
--
-- De paso, mantiene `profiles.email` al día cuando alguien cambia su
-- dirección desde su cuenta.
-- ═══════════════════════════════════════════════════════════════

alter table public.profiles
  add column if not exists email_confirmed_at timestamptz;

-- Pone al día los perfiles que ya existen
update public.profiles p
set email_confirmed_at = u.email_confirmed_at
from auth.users u
where u.id = p.id
  and p.email_confirmed_at is distinct from u.email_confirmed_at;

-- El alta también guarda el estado inicial (normalmente, sin confirmar)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, email_confirmed_at)
  values (new.id,
          coalesce(new.raw_user_meta_data ->> 'full_name', ''),
          coalesce(new.email, ''),
          new.email_confirmed_at);

  if (new.raw_user_meta_data ->> 'health_consent') = 'true' then
    insert into public.consents (user_id, kind, policy_version)
    values (new.id, 'datos_salud',
            coalesce(new.raw_user_meta_data ->> 'policy_version', 'sin-version'));
  end if;

  return new;
end;
$$;

-- Y se mantiene sincronizado cuando la persona confirma o cambia su email
create or replace function public.sync_estado_email()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.profiles
  set email = coalesce(new.email, email),
      email_confirmed_at = new.email_confirmed_at,
      updated_at = now()
  where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_changed on auth.users;
create trigger on_auth_user_email_changed
  after update on auth.users
  for each row
  when (
    old.email_confirmed_at is distinct from new.email_confirmed_at
    or old.email is distinct from new.email
  )
  execute function public.sync_estado_email();
