-- Nuevas tarifas mensuales acordadas: Básico 40 €, Premium 80 €.
update public.plans set price_cents = 4000 where code = 'basico';
update public.plans set price_cents = 8000 where code = 'premium';
