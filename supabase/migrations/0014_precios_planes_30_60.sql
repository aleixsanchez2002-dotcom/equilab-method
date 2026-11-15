-- Nuevas tarifas mensuales acordadas (noviembre de 2026): Básico 30 €, Premium 60 €.
-- Mantener sincronizadas con src/lib/plans.ts. Se puede repetir sin efectos.
update public.plans set price_cents = 3000 where code = 'basico';
update public.plans set price_cents = 6000 where code = 'premium';
