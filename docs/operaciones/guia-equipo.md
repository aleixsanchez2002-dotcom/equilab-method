# Guía del equipo

Cómo abrir la web en tu ordenador, probarla y proponer cambios. Para el
contexto del proyecto, lee primero [`../CONTEXT.md`](../CONTEXT.md).

Reparto: **Giovanni** (redes, marca y doma), **Alex** (rutinas y fuerza),
**Aleix** (web, datos y análisis de rendimiento).

## 1. Abrir la web en tu ordenador

Necesitas **Node.js 20.9 o superior** (recomendado: la versión LTS de
https://nodejs.org/) y **Git**.

```sh
git clone https://github.com/<organizacion-o-usuario>/equilab-method.git
cd equilab-method
npm ci
npm run dev
```

Abre http://localhost:3000/ para español o http://localhost:3000/en para
inglés. El selector ES/EN recuerda el idioma. Para parar el servidor, pulsa
Ctrl+C en la terminal.

**En Windows, sin terminal:** en `scripts/windows/` hay dos archivos para
abrir con doble clic:

| Archivo | Qué hace |
| --- | --- |
| `verificar-web.cmd` | Instala dependencias, pasa el lint y compila. Deja el resultado en `verificacion.log`. |
| `abrir-web.cmd` | Arranca la web en http://localhost:3000. |

No hace falta `.env.local` para revisar la portada, el diseño, los idiomas
o las pantallas de acceso.

Si el puerto 3000 está ocupado, usa `npm run dev -- --port 3001`. Si
`next dev` da errores de vigilancia de archivos, prueba la versión de
producción con `npm run build` y luego `npm run start`.

## 2. Probar cuentas, cuestionario y rutinas

Estas funciones necesitan Supabase. Usa **siempre un proyecto de pruebas**,
nunca el de producción:

1. Crea el proyecto siguiendo [`supabase/README.md`](../../supabase/README.md)
   (región UE, Frankfurt).
2. Aplica en orden las migraciones de `supabase/migrations/`.
3. Copia `.env.example` como `.env.local` y rellena la URL y la clave
   pública (anon). La aplicación no usa la clave `service_role`.
4. Reinicia `npm run dev`.

Registra cuentas de prueba, márcalas como equipo y concede accesos desde el
panel `/admin`. Nunca uses datos reales de clientes (ver
[`SECURITY.md`](../../SECURITY.md)).

## 3. Proponer un cambio

Trabajamos con **ramas y pull requests** en GitHub. Nadie sube cambios
directamente a `main`.

```sh
git switch main
git pull
git switch -c aleix/portada-video        # tu-nombre/tema
# … cambios …
npm run lint
npm run build
git add .
git commit -m "Portada: vídeo de Giovanni en la loseta"
git push -u origin aleix/portada-video
gh pr create --fill                       # o desde la web de GitHub
```

En el pull request, rellena la plantilla: captura, qué cambia, por qué y
qué has comprobado. GitHub pasa el lint y la compilación de forma
automática (CI). Si la comprobación falla, el PR no se fusiona.

Antes de abrir el PR:

- Añade una línea en `CHANGELOG.md`, en «Sin publicar».
- Si has tomado una decisión de diseño o de arquitectura, regístrala en
  `docs/DECISIONS.md`.

Conversación en Slack: código en **#01-web**, contenido de entrenamiento en
**#02-rutinas**, redes en **#03-redes**. Las decisiones que afectan a
varias áreas se resumen en **#00-equilab** y, si son técnicas o de diseño,
acaban como ADR.

## 4. Dónde tocar cada cosa

| Trabajo | Ubicación |
| --- | --- |
| Portada y secciones | `src/components/marketing/` |
| Colores, tipografía y animaciones | `src/app/globals.css` (ver `docs/DESIGN.md`) |
| Traducciones al inglés | `src/lib/i18n/en.json` |
| Selector de idioma | `src/components/i18n/` |
| Motor de propuestas de rutina | `src/lib/motor-rutinas.ts` |
| Ejemplo de correcciones en la portada | `src/components/marketing/correcciones.tsx` (copia las reglas del motor) |
| Catálogo inicial y cuestionario | `supabase/migrations/0002_datos_iniciales.sql` |
| Área del cliente | `src/app/app/`, `src/components/app/` |
| Panel del equipo | `src/app/admin/`, `src/components/admin/` |
| Fotos y vídeos de la web | `public/media/` |

Reglas que evitan roturas:

- No traduzcas los valores internos del cuestionario ni los códigos de plan
  (`basico`, `premium`): el motor depende de esos identificadores.
- No edites una migración ya aplicada. Cualquier cambio de esquema o de
  datos va en una migración nueva con el número siguiente.
- Si cambian las reglas de `motor-rutinas.ts`, actualiza también
  `correcciones.tsx`.
- La foto de Alex aparece sola en cuanto exista `public/media/alex.jpg`
  (vertical 4:5, mínimo 1200×1500 px).
- El vídeo de la portada aparece solo en cuanto exista
  `public/media/portada.mp4` (ver `docs/DESIGN.md`).
