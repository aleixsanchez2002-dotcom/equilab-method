# Registro de cambios

Todos los cambios relevantes del proyecto se anotan aquí.

El formato sigue [Keep a Changelog 1.1.0](https://keepachangelog.com/es-ES/1.1.0/)
y el proyecto usa [versionado semántico](https://semver.org/lang/es/). Hasta
el lanzamiento público las versiones son `0.x`.

## Cómo usar este archivo

1. **Cada pull request añade sus líneas en «Sin publicar»**, dentro de la
   categoría que corresponda. Sin línea en el changelog, el PR no se fusiona.
2. **Una línea por cambio visible**, escrita para el equipo y no para la
   máquina: qué cambia y dónde. No hace falta listar cada commit.
3. **Enlaza la decisión** cuando el cambio aplica o sustituye una ADR:
   `(ADR-0008)`. El porqué va en [`docs/DECISIONS.md`](docs/DECISIONS.md);
   aquí solo el qué.
4. **Antes de proponer algo nuevo, busca aquí** si ya se hizo o se
   deshizo. Un cambio que revierte otro anterior debe nombrarlo:
   «Revierte …».
5. **Al publicar una versión**, «Sin publicar» se renombra a
   `[x.y.z] - AAAA-MM-DD` y se abre una sección vacía nueva.

Categorías (en este orden):

| Categoría | Equivale a | Para |
| --- | --- | --- |
| **Añadido** | *Added* | Funcionalidades o secciones nuevas |
| **Cambiado** | *Changed* | Cambios en lo que ya existía (incluidos textos) |
| **Obsoleto** | *Deprecated* | Lo que se eliminará pronto |
| **Eliminado** | *Removed* | Lo que se ha quitado |
| **Corregido** | *Fixed* | Errores arreglados |
| **Seguridad** | *Security* | Vulnerabilidades, datos o accesos |

Versión: **MAYOR** si se rompe algo para los clientes o hay que migrar
datos de forma manual, **MENOR** para funcionalidades nuevas y **PARCHE**
para correcciones y textos.

---

## [Sin publicar]

### Añadido
- Variante «Pista» de la portada (rama `aleix/diseno-pista`, ADR-0018 en
  propuesta): portada fotográfica oscura, botones de píldora, Plus Jakarta
  Sans y animaciones de entrada inspiradas en la referencia de Aleix.
- Estructura documental del repositorio: `docs/CONTEXT.md`,
  `docs/DECISIONS.md` (principios y ADR), `docs/DESIGN.md`,
  `docs/ROADMAP.md`, `CLAUDE.md` y este `CHANGELOG.md`.
- `LICENSE` propietaria y `SECURITY.md` con las normas sobre datos de
  clientes y secretos.
- GitHub: CI con lint y compilación en cada PR, plantillas de PR e
  issues y `CODEOWNERS`.
- Ajustes compartidos de Claude Code (`.claude/settings.json`) y comandos
  `/cerrar-tarea` y `/nueva-decision`.
- `scripts/windows/`: `verificar-web.cmd`, `abrir-web.cmd` y
  `crear-repo-github.cmd`.
- `.gitattributes` y `.editorconfig` para que Windows y macOS usen los
  mismos finales de línea.

### Cambiado
- Logo nuevo (bocado de anillas, «EQUILAB / METHOD») también en la cabecera
  y el pie de la variante «Pista», con el símbolo en cuero (ADR-0019).
- `.gitignore` ampliado: Supabase CLI, Stripe CLI, vídeos en bruto,
  exportaciones de datos, ajustes personales de IA y archivos de Windows.
- La guía del equipo pasa de `README.md` a
  `docs/operaciones/guia-equipo.md`, con flujo de ramas y pull requests
  en lugar de parches por Slack.
- `README.md` reescrito como punto de entrada a la documentación.

### Eliminado
- `VERSION.txt`: la versión se registra ahora en este archivo.

### Corregido
- `Reveal` ya no llama a `setState` directamente dentro del efecto: el
  lint (`react-hooks/set-state-in-effect`) fallaba en la CI.
- `crear-repo-github.cmd`: la ventana ya no se cierra sola si falta Git o
  GitHub CLI.

## [0.2.0] - 2026-10-18

Rediseño visual completo de la web pública sobre el código del prototipo,
conservando contenidos y lógica (ADR-0008).

### Añadido
- Identidad clara: papel y lino, azul marino y vino; Libre Franklin y
  Source Serif 4; fotografía en blanco y negro (ADR-0008).
- Portada en tablero de 2×2: nombre y lema, dos fotografías de Giovanni y
  una loseta de vídeo que lleva a `/acceso`. El vídeo aparece solo al
  añadir `public/media/portada.mp4`; hasta entonces se muestra un retrato
  con acercamiento lento.
- Selector «¿Qué te corrigen en la pista?», que funciona sin JavaScript y
  muestra por qué ejercicios empezaría la rutina.
- Diagrama «Del cuestionario a la pista» con tres pasos.
- Sección de equipo con Giovanni Torrens, Alex Ricarte y Aleix Sánchez.
- Tabla comparativa de planes (bloques apilados en móvil).
- Llamada final con la palabra «Entrena» como botón y pie que se descubre
  al final del scroll.
- Animaciones de entrada contenidas, desactivadas con «reducir
  movimiento».
- Traducciones al inglés de todos los textos nuevos.

### Cambiado
- Lema de portada: «Preparación física para jinetes profesionales», en
  negrita y en una sola línea a cualquier ancho.
- Cifras del método: 10 min · 2–4 días · 3 entrenadores · 75–150 €
  (Básico–Premium, sin permanencia) (ADR-0011).
- Textos de pasos, planes, preguntas frecuentes y equipo según la revisión
  de Aleix (17-10-2026).
- Pantalla de acceso con panel de marca en marino.
- Las pantallas privadas heredan la nueva paleta mediante los tokens
  heredados (`ink`, `sand`, `cognac`, `oxblood`).

### Corregido
- Los enlaces de la barra de navegación se solapaban con «Iniciar sesión»
  a 1024 px.
- El contenido animado al hacer scroll desaparecía tras un nuevo render de
  React.

## [0.1.0] - 2026-10-14

Base compartida del equipo («copia v1»).

### Añadido
- Web pública ES/EN, acceso, recuperación de contraseña y confirmación de
  email.
- Área del cliente: cuestionario, rutina semanal, registro de series,
  peso, progreso y cuenta.
- Panel del equipo: directorio de clientes, constructor de rutinas y
  revisión de propuestas.
- Motor de reglas v1 para el plan Básico, que genera propuestas siempre en
  borrador (ADR-0005).
- Esquema Supabase con RLS, migraciones de la `0001` a la `0009` y
  catálogo inicial de ejercicios.

[Sin publicar]: https://github.com/<organizacion-o-usuario>/equilab-method/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/<organizacion-o-usuario>/equilab-method/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/<organizacion-o-usuario>/equilab-method/releases/tag/v0.1.0
