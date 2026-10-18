---
description: Redacta una ADR nueva en docs/DECISIONS.md
argument-hint: [tema de la decisión]
---

Registra una decisión sobre: $ARGUMENTS

1. Lee `docs/DECISIONS.md` completo. Si ya existe una ADR sobre el tema,
   no crees otra: indica cuál es y si la nueva decisión la **sustituye**.
2. Toma el número siguiente al último del índice (cuatro dígitos).
3. Redacta la ADR con la plantilla del documento: Estado, Fecha (hoy),
   Decide, Ámbito, Contexto, Decisión, Alternativas descartadas,
   Consecuencias y Relacionado. Corta: que se lea en un minuto.
4. Estado `Propuesta` salvo que el equipo la haya aprobado de forma
   explícita en esta conversación; en ese caso, `Aceptada`.
5. Si sustituye a otra, cambia el estado de la antigua a
   `Sustituida por ADR-XXXX` (es lo único que se edita de ella).
6. Añádela al final del registro y a la tabla del índice.
7. Si resuelve una fila de «Cuestiones abiertas», bórrala de la tabla.
