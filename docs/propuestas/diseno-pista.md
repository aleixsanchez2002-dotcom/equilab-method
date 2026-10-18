# Propuesta · Variante «Pista» de la portada

- **Estado:** Propuesta, en la rama `aleix/diseno-pista` (no sustituye a la
  portada actual, que sigue en `main`)
- **Fecha:** 2026-10-19
- **Pedida por:** Aleix Sánchez, a partir de la web de referencia
  https://horse-riding-wcopilot.webflow.io (sobre todo, su portada)
- **ADR:** ADR-0018 (propuesta). Si se adopta, sustituye a ADR-0008 en la
  web pública.

## Qué se toma de la referencia

Solo el lenguaje visual y el movimiento; ni su código, ni sus textos, ni
sus imágenes.

| Referencia | En Equilab |
| --- | --- |
| Portada a pantalla completa con foto, velo negro y texto centrado | Foto de Giovanni a color con velo del 55 % (la foto es muy luminosa), lema y dos botones. Si existe `portada.mp4`, sale el vídeo |
| Barra transparente sobre la foto | Transparente arriba; carbón en cuanto se hace scroll |
| Botones de píldora (uno dorado, otro con contorno) | Cuero `#c08a4e` con texto carbón (el blanco sobre dorado no tiene contraste suficiente) y contorno blanco |
| Tipografía geométrica (Satoshi) | Plus Jakarta Sans (Google Fonts, sin dependencias nuevas) |
| Secciones blanco / negro / crema | Blanco, carbón `#0e0e0f` y crema `#fbf8f3` |
| Entrada al hacer scroll: sube 100 px y aparece en 1 s (curva *outQuart*) | `<Aparecer>`: sube 64 px (32 px en móvil) y aparece en 1 s, escalonado |
| Imágenes que llegan desde 1,25× | Las fotos se asientan desde 1,2× |
| Foto de portada que se acerca al cargar (1 → 1,1 en 2,5 s) | 1 → 1,08 en 2,6 s |
| Tarjetas que suben y acercan su foto al pasar el ratón | Suben 6 px y la foto se acerca a 1,08× |
| Preguntas en acordeón | `<details>` nativo; el + gira y se vuelve × |

Todo el movimiento se desactiva con «reducir movimiento» y el contenido se
ve sin JavaScript.

## Qué cambia frente a ADR-0008

- Fondo oscuro en la portada y en dos secciones (antes, fondo claro).
- Fotografía a color en la portada (el resto sigue en blanco y negro).
- Esquinas redondeadas y botones de píldora (antes, todo recto).
- Una sola tipografía sin serifa (antes, Libre Franklin y Source Serif 4).
- Se mantiene: contenidos y textos aprobados, sin degradados, sin sombras.

## Archivos

- `src/components/pista/`: barra, portada, método, banda, correcciones,
  pasos, equipo, planes, preguntas, llamada final y pie.
- `src/components/motion/aparecer.tsx`: animación de entrada.
- `src/app/globals.css`: tokens `carbon`, `grafito`, `crema`, `arena`,
  `cuero`, `cuero-claro`, `humo` y estilos `.pista`.
- `src/app/page.tsx`: usa la variante. La portada actual
  (`src/components/marketing/`) sigue intacta; sus datos se reutilizan.

## Pendiente si se adopta

- Llevar el estilo a `/acceso` y a la página 404.
- Fotos de Alex y Aleix (`public/media/alex.jpg`, `aleix.jpg`): mientras
  no existan, salen sus iniciales.
- Regenerar la imagen para compartir (Open Graph) con el nuevo estilo.
