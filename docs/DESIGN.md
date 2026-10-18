# Sistema visual · Equilab Method

La fuente de verdad es `src/app/globals.css`. Este documento resume las
reglas para no tener que deducirlas del código. El porqué está en
[ADR-0008](DECISIONS.md#adr-0008--identidad-visual-clara-y-ecuestre).

## Carácter

Una composición de informe impreso: fondo claro, campos de color planos que
ocupan secciones enteras y fotografía en blanco y negro. Sobria, como el
material ecuestre de gama alta. Movimiento moderno pero contenido.

**Nunca:** degradados, sombras en reposo, filetes finos decorativos,
iconos de verificación en tablas («cada fila compara con palabras»),
fotos en color sin el filtro `.photo-mono`.

## Color

| Token | Valor | Uso |
| --- | --- | --- |
| `paper` | `#f3f1ec` | Fondo de página |
| `linen` | `#e7e3da` | Superficie un paso más oscura (losetas, cajas) |
| `linen-deep` | `#dbd5c9` | Segundo paso, para alternar filas |
| `night` | `#141b2b` | Tinta principal y fondo invertido |
| `slate` | `#545b69` | Texto secundario |
| `navy` | `#1d3461` | Marca: acciones y campos de color |
| `navy-deep` | `#152749` | Marino al pulsar o pasar el ratón |
| `navy-soft` | `#c9d3e6` | Texto secundario sobre marino |
| `wine` | `#6b2b33` | Segundo campo de color, con moderación (preguntas frecuentes) |
| `chalk` | `#fbfaf7` | Campos de formulario y fichas sobre lino |

Los tokens heredados (`ink-*`, `sand-*`, `cognac-*`, `oxblood-*`) existen
para el área privada. **En código nuevo, usa los nombres de la tabla.**

## Tipografía

- **Libre Franklin** (`font-display`, `font-sans`): títulos e interfaz.
  Los títulos van en 700 con `letter-spacing: -0.03em`.
- **Source Serif 4** (`font-serif`): párrafos de lectura en la web pública.

Escala de la web pública (cinco tamaños, fluidos):

| Clase | Uso |
| --- | --- |
| `text-step-small` | Notas, etiquetas, texto secundario |
| `text-step-body` | Párrafos |
| `text-step-lead` | Entradillas, nombres, cifras |
| `text-step-head` | Títulos de sección |
| `text-step-display` | «Equilab» en la portada |

El lema de la portada (`.tagline`) se ajusta al ancho de su loseta con
unidades de contenedor para ocupar siempre **una sola línea**. Si cambias
el texto del lema, mide su ancho en `em` y actualiza el divisor en
`globals.css`.

## Composición

- Margen lateral único: `var(--gutter)` (16 a 32 px).
- Portada: tablero de 2×2 (`.board`) con 8 px de separación; en móvil, las
  losetas se apilan.
- Secciones alternas sobre `paper` y `linen`; campos completos en `navy` o
  `wine` para las secciones de énfasis.
- Diseño *mobile-first*: comprueba siempre a 390 px, 1024 px y 1440 px.

## Fotografía y vídeo

- Siempre en blanco y negro (`.photo-mono`: escala de grises y contraste
  ligeramente aumentado).
- Las imágenes se colocan con `ImageSlot` (`src/components/media/`).
- Optimiza antes de subir: JPG de calidad 80 y lado largo máximo de 2400 px.
- **Vídeo de portada:** `public/media/portada.mp4` (y, si se quiere,
  `portada.webm` y `portada-poster.jpg`). Aparece solo, sin tocar código.
  Debe ser corto (6–12 s), en bucle, sin sonido, en H.264 y de menos de
  4 MB.
- Foto de Alex: `public/media/alex.jpg`, vertical 4:5, mínimo 1200×1500 px.

## Movimiento

| Elemento | Animación |
| --- | --- |
| «Equilab» | Sube desde su línea base a través de una máscara, 900 ms (ADR-0010) |
| Lema y piezas de la portada | `data-rise`: suben 18 px y aparecen, escalonados 90 ms |
| Foto principal | Obturador: se abre de arriba abajo (1100 ms) y se asienta |
| Secciones al hacer scroll | `<Reveal>`: suben 24 px y aparecen |
| Loseta de vídeo sin vídeo | Acercamiento muy lento del retrato (22 s, en vaivén) |
| Botones | `.press`: escala 0,97 al pulsar |

Reglas:

- Las curvas están en tokens: `--ease-out-soft`, `--ease-travel` y
  `--ease-settle`.
- El estado oculto solo existe bajo la clase `.js`: sin JavaScript, todo
  se ve.
- Toda animación tiene alternativa con `prefers-reduced-motion: reduce`.
- Anima solo `transform`, `opacity` y `clip-path`. Nada que recalcule el
  diseño en cada fotograma.
- Una sola animación protagonista por pantalla. Si dudas, no animes.

## Icono e imagen para compartir

- Icono: el bocado (`BitMark`) en papel sobre un cuadrado `night`, igual
  que la loseta del logo en la barra. Archivos: `src/app/icon.svg`,
  `apple-icon.png` (180 px) y `favicon.ico` (16, 32 y 48 px).
- Imagen para compartir: `src/app/opengraph-image.jpg` (1200×630), con el
  tablero de la portada (lema, «Equilab» y foto de Giovanni). Si cambia el
  lema o la foto, hay que regenerarla.

## Componentes base

`src/components/ui/`: `button`, `card`, `checkbox`, `divider`, `field`,
`input` y `overline`. Úsalos antes de crear variantes nuevas.
