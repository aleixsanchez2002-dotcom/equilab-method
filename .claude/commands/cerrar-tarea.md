---
description: Verifica la tarea y deja rastro en CHANGELOG, DECISIONS y CONTEXT
---

Cierra la tarea actual siguiendo `CLAUDE.md`, sección 6:

1. Ejecuta `npm run lint` y `npm run build`. Si alguno falla, arréglalo
   (sin ampliar el alcance de la tarea) y vuelve a ejecutarlo.
2. Revisa `git diff` y resume los cambios visibles.
3. Añade las líneas que correspondan en `CHANGELOG.md` → «[Sin publicar]»,
   en la categoría correcta (Añadido, Cambiado, Eliminado, Corregido,
   Seguridad). Una línea por cambio visible y la ADR entre paréntesis si
   aplica.
4. Comprueba si en la tarea se ha tomado alguna decisión de diseño,
   arquitectura o producto. Si es así, ejecuta los pasos de
   `/nueva-decision`.
5. Si ha cambiado algo de lo que describe `docs/CONTEXT.md` (rutas,
   tablas, tecnologías, planes), actualízalo.
6. Comprueba que no se incluyen `.env*`, claves ni datos de clientes.
7. Termina con un resumen de dos o tres frases: qué cambió, cómo verlo y
   qué queda pendiente.

$ARGUMENTS
