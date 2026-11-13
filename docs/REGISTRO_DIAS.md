# Envío de días del mesociclo

Cada `routine_day_id` es un día de una semana concreta, no una plantilla que se vuelve a enviar cada semana. El primer día pendiente determina el entrenamiento sugerido. El cliente puede consultar los anteriores y usar **Modificar registro** si se ha equivocado; al terminar el bloque se espera una nueva rutina del equipo.

La migración `0013_dias_completados.sql` añade finalización, versión y fecha de corrección a `workout_sessions`. Marca como completada la última sesión antigua con detalle de cada día sin borrar duplicados históricos ni intentos vacíos. No intenta reconstruir series antiguas que ya se guardaron sin huecos.

`enviar_dia_entrenamiento` comprueba sesión, acceso, propiedad de la rutina publicada y pertenencia de los ejercicios. Guarda sesión y series en una transacción. Un índice único y un bloqueo por usuario/día evitan duplicados concurrentes; la revisión esperada impide sobrescribir una corrección hecha desde otro dispositivo. Las correcciones mantienen ID, fecha original y estado completado; actualizan el detalle que ven el cliente y el equipo. La función no envía mensajes ni cambia la prescripción.

Se retira la escritura directa de sesiones y series a `anon`/`authenticated`: pasan por la función validada. La lectura mantiene las políticas RLS existentes. El editor informa de que debe crearse una nueva rutina cuando un bloque ya tiene envíos; los triggers también impiden reescribir o borrar ese bloque y romper los enlaces a las sesiones. Archivar un bloque sigue permitido; se conserva el historial. Al publicar uno nuevo se usan sus días nuevos, sin reiniciar el anterior.

## Verificación y despliegue

- `npm run test:workout`: payload malformado, límites, huecos en series, revisión y siguiente día entre semanas y al finalizar.
- `npm run test:navigation`: lectura por sección y filtros del usuario, equipo sin suscripción, errores y sesión caducada.
- `supabase/tests/0013_dias_completados.sql`: ejecutar tras la migración dentro de `BEGIN` / `ROLLBACK`. Crea usuarios y rutinas sintéticos y comprueba envío, duplicados, corrección sin cambiar fecha/ID, versión obsoleta, error atómico, permisos, acceso ajeno y protección del bloque; no deja datos.
- Prueba de interfaz con datos ficticios en entorno local: valores visibles tras enviar, bloqueo, modificar/cancelar, corrección, siguiente semana, fin de bloque y móvil. La ruta temporal de pruebas no forma parte del repositorio ni del despliegue.
- Aplicar la migración antes de publicar el código que consulta las nuevas columnas. La versión anterior deja de poder enviar sesiones al retirarse la escritura directa: coordinar migración y despliegue.
