-- ═══════════════════════════════════════════════════════════════
-- EQUILAB METHOD · Datos iniciales (fase 2)
-- Planes, biblioteca de ejercicios de arranque y cuestionario v1.
-- PLACEHOLDER: los ejercicios y preguntas son los validados en los
-- mockups; el equipo los revisará/ampliará desde el panel admin.
-- ═══════════════════════════════════════════════════════════════

insert into public.plans (code, name, price_cents, premium_seats) values
  ('basico', 'Básico', 7500, null),
  ('premium', 'Premium', 15000, 20);

insert into public.exercises (name, category, equipment, technique_notes) values
  ('Peso muerto rumano', 'fuerza', 'barra', 'Cadera atrás, espalda larga. La carga baja de serie en serie: la técnica no.'),
  ('Sentadilla copa', 'fuerza', 'mancuerna o kettlebell', 'Rodillas fuera, talones firmes — como pisas el estribo.'),
  ('Hip thrust', 'fuerza', 'barra y banco', 'Pausa de 1 s arriba, sin hiperextender la lumbar.'),
  ('Remo con barra', 'fuerza', 'barra', 'Codos hacia el bolsillo, tronco quieto.'),
  ('Press militar con mancuernas', 'fuerza', 'mancuernas', 'Costillas cerradas, sin arquear lumbar.'),
  ('Farmer carry', 'fuerza', 'mancuernas o kettlebells', 'Hombros abajo y atrás, paso corto.'),
  ('Pallof press', 'postura', 'polea o banda', 'Anti-rotación: el tronco no gira, como en el círculo de 10 m.'),
  ('Face pull', 'postura', 'polea con cuerda', 'El antídoto del hombro adelantado.'),
  ('Band pull-apart', 'postura', 'banda elástica', 'Ritmo lento, aprieta escápulas 1 s.'),
  ('Plancha con arrastre', 'control', 'disco', 'Cadera quieta mientras la mano trabaja — manos independientes.'),
  ('Bird dog', 'control', 'sin material', 'La pelvis ni se entera: disociación pura.'),
  ('Copenhagen plank', 'control', 'banco', 'Aductores: tu pierna interior.'),
  ('90/90 de caderas', 'movilidad', 'sin material', 'Transiciones lentas, sin ayudarte con las manos.'),
  ('Movilidad torácica en cuadrupedia', 'movilidad', 'sin material', 'Gira desde la dorsal, la lumbar no participa.'),
  ('Respiración 360', 'movilidad', 'sin material', 'Costillas que se expanden a los lados — calma antes de montar.');

-- Cuestionario inicial v1 — PLACEHOLDER hasta que el equipo redacte el real.
insert into public.questionnaire_templates (version, title, questions, active) values
  (1, 'Cuestionario inicial Equilab', '[
    {"id": "disciplina", "tipo": "select", "texto": "¿Qué disciplina montas principalmente?",
     "opciones": ["Doma clásica", "Salto", "Completo", "Ocio/otra"]},
    {"id": "nivel_montar", "tipo": "select", "texto": "¿Cuántos días a la semana montas?",
     "opciones": ["1-2", "3-4", "5 o más"]},
    {"id": "experiencia_gym", "tipo": "select", "texto": "¿Cuál es tu experiencia en el gimnasio?",
     "opciones": ["Ninguna", "Algo, sin constancia", "Entreno regularmente"]},
    {"id": "material", "tipo": "select", "texto": "¿Con qué material cuentas para entrenar?",
     "opciones": ["Gimnasio completo", "Material básico en casa", "Solo peso corporal"]},
    {"id": "dias_entreno", "tipo": "select", "texto": "¿Cuántos días puedes entrenar fuera del caballo?",
     "opciones": ["2", "3", "4 o más"]},
    {"id": "molestias", "tipo": "multiselect", "texto": "¿Tienes molestias o lesiones activas?",
     "opciones": ["Lumbar", "Cadera", "Rodilla", "Hombro/cuello", "Ninguna"]},
    {"id": "defecto_postural", "tipo": "multiselect", "texto": "¿Qué te corrigen más a menudo encima del caballo?",
     "opciones": ["Manos inquietas", "Hombros adelantados", "Cadera bloqueada", "Pierna inestable", "Me cuesta mantener el asiento en la reunión"]},
    {"id": "objetivo", "tipo": "texto", "texto": "¿Cuál es tu objetivo principal para los próximos 3 meses?"}
  ]'::jsonb, true);
