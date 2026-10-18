# Seguridad y privacidad del repositorio

Equilab Method trata **datos de salud** de sus clientes: historial físico,
lesiones, peso corporal y vídeos entrenando. El RGPD los considera una
categoría especial de datos personales. Este repositorio es privado, pero
privado no significa seguro. Estas normas son obligatorias para cualquier
persona o asistente de IA que trabaje en él.

## Lo que nunca entra en Git

| Prohibido | Dónde vive en su lugar |
| --- | --- |
| Claves y secretos (`.env.local`, `service_role`, claves de Stripe o Bunny) | Gestor de contraseñas del equipo y variables de entorno del hosting |
| Datos de clientes reales (respuestas, registros, pesos, emails) | Supabase de producción (región UE) |
| Exportaciones o copias de la base de datos | No se guardan en local salvo para una tarea concreta, y se borran al acabarla |
| Vídeos de clientes | Bunny Stream (biblioteca privada) |
| Capturas de pantalla con datos de clientes | En ningún sitio: anonimiza antes de compartir |

El `.gitignore` bloquea la mayoría de estos archivos, pero no los detecta
todos. Revisa siempre `git status` antes de hacer un commit.

## Si se sube un secreto por error

1. **Rota la clave en ese mismo momento** en el panel del servicio
   (Supabase, Stripe o Bunny). Borrar el commit no sirve: la clave ya ha
   quedado expuesta en el historial.
2. Avisa al equipo en el canal `#01-web`.
3. Limpia el historial solo después de rotar la clave, y con el equipo
   avisado, porque reescribirlo afecta a todas las copias.

## Acceso

- Repositorio **privado**. Los colaboradores se añaden uno a uno, nunca con
  enlaces públicos.
- Activa la verificación en dos pasos (2FA) en GitHub, Supabase, Stripe y
  Bunny.
- Da a cada persona el mínimo acceso que necesite. Quien solo revisa
  contenido no necesita permiso de escritura.
- Quien deja el proyecto pierde el acceso el mismo día (ver `LICENSE`).

## Datos de prueba

- Para desarrollar se usa un **proyecto Supabase de pruebas**, nunca el de
  producción.
- Los usuarios de prueba usan nombres ficticios y emails del tipo
  `prueba+1@…`.
- Las migraciones (`supabase/migrations/`) contienen esquema y catálogo,
  nunca datos de clientes.

## Asistentes de IA

- Los asistentes (Claude y otros) pueden leer el código y la documentación,
  pero no los archivos `.env*` (bloqueado en `.claude/settings.json`).
- No pegues en un chat de IA datos reales de clientes ni claves.
- El historial de una conversación con IA cuenta como un sitio más donde
  pueden quedar datos: aplícale las mismas normas.

## Cómo informar de un problema

Si encuentras una vulnerabilidad o un posible acceso indebido a datos, no
abras una *issue*: escribe directamente a Aleix Sánchez, responsable de la
web, y al resto de socios.
