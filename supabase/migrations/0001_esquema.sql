-- ═══════════════════════════════════════════════════════════════
-- EQUILAB METHOD · Esquema inicial (fase 2)
-- Ejecutar en el SQL Editor de Supabase (o via supabase db push).
-- Región del proyecto: eu-central-1 (Frankfurt) — requisito RGPD.
-- ═══════════════════════════════════════════════════════════════

-- ————— Tipos —————
create type public.rol_usuario as enum ('cliente', 'coach', 'admin');
create type public.tipo_rutina as enum ('semi', 'personalizada');
create type public.estado_rutina as enum ('borrador', 'publicada', 'archivada');
create type public.estado_suscripcion as enum
  ('incomplete', 'trialing', 'active', 'past_due', 'canceled');

-- ═══════════════ PERFILES ═══════════════
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role public.rol_usuario not null default 'cliente',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Perfil + consentimiento se crean automáticamente al registrarse
-- (los datos llegan en raw_user_meta_data desde el formulario de alta).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));

  -- Consentimiento explícito de datos de salud (art. 9 RGPD): el alta
  -- exige la casilla marcada; se registra versión de política y momento.
  if (new.raw_user_meta_data ->> 'health_consent') = 'true' then
    insert into public.consents (user_id, kind, policy_version)
    values (new.id, 'datos_salud',
            coalesce(new.raw_user_meta_data ->> 'policy_version', 'sin-version'));
  end if;

  return new;
end;
$$;

-- ═══════════════ CONSENTIMIENTOS (registro RGPD, inmutable) ═══════════════
create table public.consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('datos_salud', 'comunicaciones')),
  policy_version text not null,
  granted_at timestamptz not null default now()
);

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ═══════════════ PLANES Y SUSCRIPCIONES ═══════════════
create table public.plans (
  code text primary key,                -- 'basico' | 'premium'
  name text not null,
  price_cents integer not null,
  stripe_price_id text,                 -- se rellena en la fase 3 (Stripe)
  premium_seats integer                 -- cupo de plazas (null = sin cupo)
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  plan_code text not null references public.plans (code),
  status public.estado_suscripcion not null default 'incomplete',
  stripe_customer_id text,
  stripe_subscription_id text unique,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Regla de acceso acordada: activa O periodo pagado aún vigente.
create or replace function public.has_active_access(uid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.subscriptions s
    where s.user_id = uid
      and (s.status = 'active' or s.current_period_end > now())
  );
$$;

-- ¿El usuario actual es del equipo? (coach o admin)
create or replace function public.is_coach()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('coach', 'admin')
  );
$$;

-- ═══════════════ CUESTIONARIOS (versionados) ═══════════════
create table public.questionnaire_templates (
  id uuid primary key default gen_random_uuid(),
  version integer not null unique,
  title text not null,
  questions jsonb not null,             -- [{id, tipo, texto, opciones…}]
  active boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.questionnaire_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  template_id uuid not null references public.questionnaire_templates (id),
  answers jsonb not null,               -- {pregunta_id: respuesta}
  created_at timestamptz not null default now()
);

-- ═══════════════ BIBLIOTECA DE EJERCICIOS ═══════════════
create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check
    (category in ('fuerza', 'movilidad', 'postura', 'control')),
  equipment text,                       -- material necesario
  video_url text,                       -- enlace de Vimeo
  video_duration_seconds integer,
  technique_notes text,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

-- ═══════════════ RUTINAS ═══════════════
create table public.routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  coach_id uuid references auth.users (id),   -- null = generada por el motor
  title text not null,
  type public.tipo_rutina not null,
  status public.estado_rutina not null default 'borrador',
  weeks integer,                         -- duración del bloque (p. ej. 8)
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.routine_days (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid not null references public.routines (id) on delete cascade,
  position integer not null,             -- 1, 2, 3…
  focus text not null,                   -- "Fuerza + cadera"
  duration_note text,                    -- "±50 min"
  unique (routine_id, position)
);

create table public.routine_exercises (
  id uuid primary key default gen_random_uuid(),
  routine_day_id uuid not null references public.routine_days (id) on delete cascade,
  exercise_id uuid not null references public.exercises (id),
  position integer not null,
  technique_note text,
  -- Series prescritas UNA A UNA (decisión validada en el mockup):
  -- [{"peso": "62,5 kg", "reps": "8", "descanso": "2:30"}, …]
  series jsonb not null default '[]',
  unique (routine_day_id, position)
);

-- ═══════════════ REGISTRO DE ENTRENAMIENTOS ═══════════════
create table public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  routine_day_id uuid references public.routine_days (id) on delete set null,
  performed_on date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

create table public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workout_sessions (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  exercise_id uuid not null references public.exercises (id),
  routine_exercise_id uuid references public.routine_exercises (id) on delete set null,
  -- Registro real por serie: [{"kg": "62,5", "reps": "8", "descanso": "2:30"}, …]
  series jsonb not null default '[]',
  performed_on date not null default current_date
);

create index workout_logs_progresion
  on public.workout_logs (user_id, exercise_id, performed_on);

-- ═══════════════ CHECK-INS MENSUALES (datos sensibles) ═══════════════
create table public.checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  month date not null,                   -- primer día del mes
  weight_kg numeric(5, 2),
  waist_cm numeric(5, 2),
  measurements jsonb,                    -- otras medidas
  wellbeing jsonb,                       -- bloque de bienestar/motivación
  photo_paths text[],                    -- rutas en Storage (bucket privado)
  coach_notes text,
  reviewed_by uuid references auth.users (id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, month)
);

-- ═══════════════ PAGOS (espejo de Stripe, fase 3) ═══════════════
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  stripe_invoice_id text unique,
  amount_cents integer not null,
  status text not null,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.webhook_events (
  id text primary key,                   -- id del evento de Stripe (idempotencia)
  type text not null,
  processed_at timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- Principio: cada jinete solo ve lo suyo; el equipo (coach/admin) ve
-- todo; las tablas que escribe Stripe solo las toca el service role.
-- El acceso del cliente a rutinas/ejercicios exige suscripción vigente
-- (has_active_access) — el candado del mockup, aplicado en la base.
-- ═══════════════════════════════════════════════════════════════

alter table public.profiles enable row level security;
alter table public.consents enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.questionnaire_templates enable row level security;
alter table public.questionnaire_responses enable row level security;
alter table public.exercises enable row level security;
alter table public.routines enable row level security;
alter table public.routine_days enable row level security;
alter table public.routine_exercises enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.workout_logs enable row level security;
alter table public.checkins enable row level security;
alter table public.payments enable row level security;
alter table public.webhook_events enable row level security;

-- profiles
create policy "propio perfil: leer" on public.profiles
  for select using (auth.uid() = id or public.is_coach());
create policy "propio perfil: editar" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id and role = 'cliente');

-- consents: registro inmutable; solo lectura propia (y equipo)
create policy "consentimientos: leer" on public.consents
  for select using (auth.uid() = user_id or public.is_coach());

-- plans: catálogo público para usuarios autenticados
create policy "planes: leer" on public.plans
  for select to authenticated using (true);

-- subscriptions: el cliente ve la suya; escribe solo el service role (webhooks)
create policy "suscripción: leer" on public.subscriptions
  for select using (auth.uid() = user_id or public.is_coach());

-- questionnaire_templates
create policy "cuestionarios: leer" on public.questionnaire_templates
  for select to authenticated using (active or public.is_coach());
create policy "cuestionarios: gestionar" on public.questionnaire_templates
  for all using (public.is_coach()) with check (public.is_coach());

-- questionnaire_responses
create policy "respuestas: crear" on public.questionnaire_responses
  for insert with check (auth.uid() = user_id);
create policy "respuestas: leer" on public.questionnaire_responses
  for select using (auth.uid() = user_id or public.is_coach());

-- exercises: la biblioteca exige suscripción vigente (o ser del equipo)
create policy "ejercicios: leer" on public.exercises
  for select using (public.is_coach() or public.has_active_access(auth.uid()));
create policy "ejercicios: gestionar" on public.exercises
  for all using (public.is_coach()) with check (public.is_coach());

-- routines: el cliente solo ve las publicadas y con acceso vigente
create policy "rutinas: leer propias" on public.routines
  for select using (
    public.is_coach()
    or (auth.uid() = user_id and status = 'publicada'
        and public.has_active_access(auth.uid()))
  );
create policy "rutinas: gestionar" on public.routines
  for all using (public.is_coach()) with check (public.is_coach());

create policy "días de rutina: leer" on public.routine_days
  for select using (
    public.is_coach()
    or exists (
      select 1 from public.routines r
      where r.id = routine_id and r.user_id = auth.uid()
        and r.status = 'publicada' and public.has_active_access(auth.uid())
    )
  );
create policy "días de rutina: gestionar" on public.routine_days
  for all using (public.is_coach()) with check (public.is_coach());

create policy "ejercicios de rutina: leer" on public.routine_exercises
  for select using (
    public.is_coach()
    or exists (
      select 1
      from public.routine_days d
      join public.routines r on r.id = d.routine_id
      where d.id = routine_day_id and r.user_id = auth.uid()
        and r.status = 'publicada' and public.has_active_access(auth.uid())
    )
  );
create policy "ejercicios de rutina: gestionar" on public.routine_exercises
  for all using (public.is_coach()) with check (public.is_coach());

-- workout_sessions / workout_logs: el cliente registra lo suyo
create policy "sesiones: crear" on public.workout_sessions
  for insert with check (auth.uid() = user_id and public.has_active_access(auth.uid()));
create policy "sesiones: leer" on public.workout_sessions
  for select using (auth.uid() = user_id or public.is_coach());

create policy "registros: crear" on public.workout_logs
  for insert with check (auth.uid() = user_id and public.has_active_access(auth.uid()));
create policy "registros: leer" on public.workout_logs
  for select using (auth.uid() = user_id or public.is_coach());

-- checkins: lo más sensible — el cliente crea/lee lo suyo; el equipo revisa
create policy "checkins: crear" on public.checkins
  for insert with check (auth.uid() = user_id);
create policy "checkins: leer" on public.checkins
  for select using (auth.uid() = user_id or public.is_coach());
create policy "checkins: revisar" on public.checkins
  for update using (public.is_coach()) with check (public.is_coach());

-- payments: el cliente ve su historial; escribe el service role
create policy "pagos: leer" on public.payments
  for select using (auth.uid() = user_id or public.is_coach());

-- webhook_events: sin políticas → solo service role. (RLS activado arriba.)
