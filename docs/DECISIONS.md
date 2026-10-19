# Decisiones y criterio técnico

Este documento es la **memoria de decisiones** de Equilab Method. Tiene
tres partes:

1. **Principios permanentes:** el criterio técnico del equipo. Se aplica
   siempre, salvo que una ADR diga lo contrario.
2. **Registro de decisiones (ADR):** cada decisión de arquitectura, de
   producto o de diseño, con su contexto, las alternativas y las
   consecuencias.
3. **Cuestiones abiertas:** lo que está pendiente de decidir.

> **Regla para personas y asistentes de IA.** Antes de proponer o
> implementar un cambio, busca aquí si ya hay una decisión sobre ese tema.
> Una ADR **Aceptada** no se revierte ni se contradice en silencio. Si
> crees que hay que cambiarla, dilo de forma explícita, explica el motivo y
> propón una ADR nueva que la **sustituya**. Las alternativas
> **Descartadas** no se vuelven a proponer salvo que alguien lo pida o haya
> un dato nuevo.

---

## 1. Principios permanentes

Mantenidos por Aleix Sánchez. Para cambiar uno, abre un PR que lo modifique.

| # | Principio | En la práctica |
| --- | --- | --- |
| P-01 | **Simple antes que ingenioso.** | Primero la solución más pequeña que funcione. No añadas abstracciones «por si acaso». |
| P-02 | **Cambios acotados.** | Toca solo lo necesario para la tarea. Nada de refactors, renombrados o cambios de formato de paso. |
| P-03 | **Los textos del equipo se aplican tal cual.** | Si el equipo da una frase exacta, va literal (con su traducción en `en.json`). Las mejoras de redacción se proponen aparte, sin aplicarlas. |
| P-04 | **Sin dependencias nuevas sin ADR.** | Antes de `npm install`, comprueba si React, Next, Tailwind o el propio código ya lo resuelven. |
| P-05 | **Servidor por defecto.** | Componentes de servidor. `"use client"` solo para interacción real, y lo más abajo posible del árbol. |
| P-06 | **La web funciona sin JavaScript y sin backend.** | Contenido visible sin JS (animaciones bajo la clase `.js`). La web pública compila y se ve sin Supabase configurado. |
| P-07 | **Accesible y respetuosa con el movimiento.** | HTML semántico, foco visible, textos alternativos y `prefers-reduced-motion` en toda animación. |
| P-08 | **Los datos de clientes son datos de salud.** | RLS en toda tabla nueva, región UE, nada de datos reales fuera de producción (ver `SECURITY.md`). |
| P-09 | **Revisión humana antes que automatización.** | Nada que genere el sistema (rutinas, mensajes) llega al cliente sin que lo revise el equipo. |
| P-10 | **Español como idioma fuente.** | Código de dominio, comentarios y textos en español; inglés vía `t()` y `en.json`. Identificadores técnicos en inglés si son de librería. |
| P-11 | **Migraciones solo hacia delante.** | Ver ADR-0006. |
| P-12 | **Verificar antes de dar por terminado.** | `npm run lint` y `npm run build` sin errores, y revisión visual en escritorio y móvil si el cambio se ve. |
| P-13 | **Todo cambio deja rastro.** | Línea en `CHANGELOG.md` y, si es una decisión, ADR aquí. |

---

## 2. Registro de decisiones (ADR)

### Cómo escribir una ADR

- Numeración correlativa de cuatro dígitos; los números no se reutilizan.
- **Estados:** `Propuesta` → `Aceptada` | `Rechazada`. Más tarde puede pasar
  a `Sustituida por ADR-XXXX` u `Obsoleta`. Una ADR aceptada **no se
  edita**, salvo para cambiar su estado o corregir erratas: si cambia la
  decisión, se escribe una nueva.
- Se añaden **al final** del registro y a la tabla del índice.
- Corta: debe leerse en un minuto.
- Cuando el registro supere unas 30 ADR, se moverán a `docs/decisions/`, un
  archivo por ADR, y aquí quedará solo el índice.

Plantilla:

```markdown
### ADR-XXXX · Título en imperativo o afirmativo

- **Estado:** Propuesta | Aceptada | Rechazada | Sustituida por ADR-XXXX | Obsoleta
- **Fecha:** AAAA-MM-DD
- **Decide:** quién
- **Ámbito:** arquitectura | producto | diseño | datos | operaciones

**Contexto.** Qué problema o fuerza obliga a decidir.

**Decisión.** Qué se hace, en una o dos frases claras.

**Alternativas descartadas.**
- Opción A: por qué no.

**Consecuencias.** Qué ganamos, qué cuesta y qué queda prohibido o
obligatorio a partir de ahora.

**Relacionado:** ADR-XXXX, PR #N, CHANGELOG [x.y.z]
```

### Índice

| ADR | Título | Estado | Ámbito |
| --- | --- | --- | --- |
| [0001](#adr-0001--nextjs-y-supabase-como-base) | Next.js y Supabase como base | Aceptada | arquitectura |
| [0002](#adr-0002--datos-en-la-ue-y-tratados-como-datos-de-salud) | Datos en la UE y tratados como datos de salud | Aceptada | datos |
| [0003](#adr-0003--bunny-stream-para-los-vídeos-de-clientes) | Bunny Stream para los vídeos de clientes | Aceptada | arquitectura |
| [0004](#adr-0004--corrección-de-técnica-por-vídeo-solo-en-premium) | Corrección de técnica por vídeo solo en Premium | Aceptada | producto |
| [0005](#adr-0005--motor-de-reglas-con-revisión-humana-obligatoria) | Motor de reglas con revisión humana obligatoria | Aceptada | producto |
| [0006](#adr-0006--migraciones-sql-solo-hacia-delante) | Migraciones SQL solo hacia delante | Aceptada | datos |
| [0007](#adr-0007--sistema-de-idiomas-propio-con-el-español-como-fuente) | Sistema de idiomas propio con el español como fuente | Aceptada | arquitectura |
| [0008](#adr-0008--identidad-visual-clara-y-ecuestre) | Identidad visual clara y ecuestre | Aceptada | diseño |
| [0009](#adr-0009--diseñar-directamente-en-código-sin-figma) | Diseñar directamente en código, sin Figma | Aceptada | diseño |
| [0010](#adr-0010--animación-de-equilab-subida-de-la-palabra-entera) | Animación de «Equilab»: subida de la palabra entera | Aceptada | diseño |
| [0011](#adr-0011--precios-75-y-150--al-mes-sin-permanencia) | Precios: 75 y 150 € al mes, sin permanencia | Aceptada | producto |
| [0012](#adr-0012--pagos-con-stripe-checkout-y-portal-de-cliente) | Pagos con Stripe Checkout y portal de cliente | Propuesta | arquitectura |
| [0019](#adr-0019--logo-bocado-de-anillas-con-trazo-grueso) | Logo: bocado de anillas con trazo grueso | Aceptada | diseño |

---

### ADR-0001 · Next.js y Supabase como base

- **Estado:** Aceptada
- **Fecha:** 2026-10-14
- **Decide:** equipo (heredado del prototipo)
- **Ámbito:** arquitectura

**Contexto.** El prototipo ya funcionaba con este stack: web pública,
autenticación, área del cliente y panel del equipo. El equipo es pequeño y
sin dedicación completa.

**Decisión.** Next.js 16 (App Router) con React 19, TypeScript estricto y
Tailwind v4 en el front. Supabase (Postgres, Auth y RLS) como backend, sin
servidor propio.

**Alternativas descartadas.**
- Rehacer el proyecto desde cero: se perdería un prototipo funcional sin
  ganancia clara.
- Backend propio (Node o Django): más mantenimiento para un equipo de tres.

**Consecuencias.** La lógica de acceso vive en RLS, no en el código de la
app. Next 16 tiene cambios incompatibles con versiones anteriores (`proxy.ts`
en lugar de `middleware`): hay que consultar `node_modules/next/dist/docs/`
antes de usar sus APIs.

### ADR-0002 · Datos en la UE y tratados como datos de salud

- **Estado:** Aceptada
- **Fecha:** 2026-10-14
- **Decide:** equipo
- **Ámbito:** datos

**Contexto.** El cuestionario recoge lesiones, historial físico, peso,
medidas y fotos. El RGPD los considera una categoría especial.

**Decisión.** Supabase en la región UE (Frankfurt, `eu-central-1`). RLS en
todas las tablas. Consentimiento explícito al registrarse (`consents`).
Fotos en un bucket privado de Storage. Proveedores nuevos con datos de
clientes, preferiblemente con alojamiento en la UE.

**Consecuencias.** Toda tabla nueva necesita políticas RLS en su
migración. Nunca se usan datos reales fuera de producción (ver
`SECURITY.md`).

### ADR-0003 · Bunny Stream para los vídeos de clientes

- **Estado:** Aceptada
- **Fecha:** 2026-10-17
- **Decide:** Aleix Sánchez
- **Ámbito:** arquitectura

**Contexto.** Los clientes Premium enviarán vídeos entrenando para que el
equipo los corrija. Los vídeos de móvil pesan mucho y, servidos tal cual,
son lentos y caros en transferencia.

**Decisión.** Usar **Bunny Stream**: subida directa desde el navegador,
transcodificación automática, reproducción adaptativa, URL firmadas y
biblioteca privada. En Supabase solo se guarda la referencia al vídeo.

**Alternativas descartadas.**
- Supabase Storage: no transcodifica y el coste de transferencia crece con
  vídeos grandes.
- Otros servicios de vídeo gestionado (Mux, Cloudflare Stream): válidos;
  se eligió Bunny por precio y sencillez. Revisar si cambian las
  necesidades.

**Consecuencias.** Hace falta una clave de API de Bunny (solo en el
servidor) y comprobar en qué región se almacenan los vídeos (ADR-0002).
Pendiente de implementar junto con ADR-0004.

### ADR-0004 · Corrección de técnica por vídeo solo en Premium

- **Estado:** Aceptada
- **Fecha:** 2026-10-17
- **Decide:** Aleix Sánchez
- **Ámbito:** producto

**Contexto.** La corrección por vídeo es la funcionalidad que más tiempo
del equipo consume y la que más valor diferencial aporta.

**Decisión.** Es una funcionalidad **nueva** (no existía en el prototipo) y
**exclusiva del plan Premium**.

**Consecuencias.** La subida de vídeos debe comprobar el plan en el
servidor y en RLS, no solo ocultar el botón. Las plazas limitadas de
Premium (ADR-0011) protegen la capacidad del equipo. Estado: sin
implementar (ver `ROADMAP.md`).

### ADR-0005 · Motor de reglas con revisión humana obligatoria

- **Estado:** Aceptada
- **Fecha:** 2026-10-14
- **Decide:** equipo
- **Ámbito:** producto

**Contexto.** El plan Básico tiene que escalar sin que el equipo diseñe cada
rutina desde cero, pero sin perder calidad ni seguridad.

**Decisión.** `src/lib/motor-rutinas.ts` es una **función pura y
determinista** que convierte el cuestionario en una propuesta. La
propuesta se guarda **siempre en borrador**; el equipo ajusta las cargas y
la publica. En Premium, la rutina se hace a mano.

**Alternativas descartadas.**
- Generación con IA sin revisión: riesgo de lesión y de pérdida de
  confianza; no es auditable.
- Publicación automática: incumple el principio P-09.

**Consecuencias.** No se añaden caminos que publiquen rutinas sin
revisión. `correcciones.tsx` (portada) copia la prioridad del motor: si
cambia una, se actualiza la otra. Los valores internos del cuestionario no
se traducen.

### ADR-0006 · Migraciones SQL solo hacia delante

- **Estado:** Aceptada
- **Fecha:** 2026-10-14
- **Decide:** equipo
- **Ámbito:** datos

**Decisión.** Una migración aplicada no se edita. Los cambios van en un
archivo nuevo con el número siguiente (`0010_…sql`). Desde la `0003`, las
migraciones son idempotentes (`if not exists`, `create or replace`). Se
aplican primero en pruebas y después en producción, siempre antes de
desplegar el código que las necesita.

**Consecuencias.** El historial del esquema es reproducible. Corregir un
error de una migración antigua exige una migración nueva.

### ADR-0007 · Sistema de idiomas propio con el español como fuente

- **Estado:** Aceptada
- **Fecha:** 2026-10-14
- **Decide:** equipo
- **Ámbito:** arquitectura

**Decisión.** Los textos se escriben en español dentro de `t("…")`. La clave
es la propia frase y la traducción está en `src/lib/i18n/en.json`. El idioma
viaja en una cookie que fija `proxy.ts` (`/` en español y `/en` en inglés).
El panel del equipo solo está en español. Los contenidos que escriben los
entrenadores se muestran en su idioma original.

**Alternativas descartadas.** `next-intl` u otras librerías: una dependencia
más para dos idiomas y sin ventaja clara (P-04).

**Consecuencias.** Si cambias una frase en español, cambia también su clave
en `en.json`; si no, se mostrará sin traducir. Las claves viejas que ya no
se usan se pueden borrar.

### ADR-0008 · Identidad visual clara y ecuestre

- **Estado:** Aceptada
- **Fecha:** 2026-10-17
- **Decide:** Aleix Sánchez
- **Ámbito:** diseño

**Contexto.** El prototipo era oscuro y se veía demasiado simple. El
público son jinetes de alto rendimiento de entre 20 y 45 años.

**Decisión.** Fondo claro (papel `#f3f1ec` y lino `#e7e3da`), azul marino
`#1d3461` como color de marca y vino `#6b2b33` con moderación. Inspiración:
la estética de los **productos** de PS of Sweden, no su web. Fotografía de
Giovanni en blanco y negro como protagonista. Libre Franklin para títulos e
interfaz y Source Serif 4 para lectura. Movimiento moderno pero contenido:
que nadie se pierda. Sin degradados, sin sombras en reposo y sin filetes
finos. Se rediseña **sobre el código existente**, conservando contenidos y
lógica. Básico es el plan de entrada; Premium, el siguiente nivel.

**Alternativas descartadas.**
- Mantener el tema oscuro del prototipo.
- Rehacer la web desde cero.

**Consecuencias.** Los tokens heredados (`ink`, `sand`, `cognac`, `oxblood`)
se han remapeado para que el área privada herede la paleta sin tocar cada
pantalla. El código nuevo usa los nombres nuevos. Detalle completo en
`DESIGN.md`.

### ADR-0009 · Diseñar directamente en código, sin Figma

- **Estado:** Aceptada
- **Fecha:** 2026-10-17
- **Decide:** Aleix Sánchez
- **Ámbito:** diseño

**Decisión.** No se usa Figma. Las propuestas visuales se hacen en el código
y se revisan con capturas o vídeos cortos.

**Consecuencias.** `DESIGN.md` y `globals.css` son la fuente de verdad del
sistema visual.

### ADR-0010 · Animación de «Equilab»: subida de la palabra entera

- **Estado:** Aceptada
- **Fecha:** 2026-10-18
- **Decide:** Aleix Sánchez
- **Ámbito:** diseño

**Contexto.** Se exploraron alternativas para animar el nombre grande de la
portada.

**Decisión.** Se mantiene la animación original: la palabra entera sube
desde su línea base a través de una máscara (`.mask-line`, 900 ms). Además,
«Equilab» queda algo separado del borde inferior de su loseta y el lema va
en negrita.

**Alternativas descartadas** (probadas el 17-10-2026):
- Letra a letra, ganando grosor de fino a negrita: no gustó.
- «Cortinilla» con una barra marino que barre el nombre.
- «Se asienta»: entra desenfocada y con las letras separadas.
- «Trote»: las letras entran alternando desde arriba y desde abajo.

**Consecuencias.** No se vuelven a proponer estas variantes salvo que se
pida.

### ADR-0011 · Precios: 75 y 150 € al mes, sin permanencia

- **Estado:** Aceptada
- **Fecha:** 2026-10-17
- **Decide:** equipo
- **Ámbito:** producto

**Decisión.** Básico a 75 €/mes y Premium a 150 €/mes, sin permanencia.
Premium con plazas limitadas (20, en `plans.premium_seats`). La portada
muestra el rango «75–150 €».

**Consecuencias.** Los precios aparecen en `plans` (migración `0002`), en
`plans.tsx` y en `method.tsx`. Si cambian, se actualizan los tres sitios y
se registra una ADR nueva.

### ADR-0012 · Pagos con Stripe Checkout y portal de cliente

- **Estado:** Propuesta
- **Fecha:** 2026-10-18
- **Decide:** pendiente
- **Ámbito:** arquitectura

**Contexto.** El esquema ya prevé `subscriptions`, `payments` y
`webhook_events` (idempotencia). La web promete «cancela cuando quieras
desde tu portal de cliente».

**Decisión propuesta.** Suscripciones con **Stripe Checkout** (página
alojada por Stripe) y **Customer Portal** para cambiar de plan o cancelar.
Los webhooks se verifican con firma y se registran en `webhook_events`
antes de actualizar `subscriptions`. Las claves secretas solo existen en el
servidor.

**Alternativas.** Payment Element integrado: más control visual, pero más
código y más superficie de cumplimiento normativo.

**Consecuencias si se acepta.** Aceptar la ADR desbloquea la fase de pagos
del `ROADMAP.md`.

### ADR-0019 · Logo: bocado de anillas con trazo grueso

- **Estado:** Aceptada
- **Fecha:** 2026-10-19
- **Decide:** Aleix Sánchez
- **Ámbito:** diseño

**Contexto.** El símbolo del bocado venía del prototipo y nunca se había
decidido de forma explícita. Con trazo fino se perdía en tamaños pequeños.
Se exploraron cuatro direcciones de logo en un lienzo de diseño.

**Decisión.** Se adopta la dirección «01 · Bocado»: dos anillas,
embocadura articulada y una anilla pequeña en el centro, con trazo grueso
(`viewBox 0 0 64 28`). Logotipo «EQUILAB» en Libre Franklin seminegrita con
espaciado `0.04em` y «METHOD» debajo con espaciado `0.62em`. Sobre fondo
claro: símbolo y «METHOD» en marino, nombre en noche. Sobre fondo oscuro:
símbolo y «METHOD» en cuero, nombre en crema.

**Alternativas descartadas** (lienzo del 19-10-2026):
- «02 · Marcador E»: la letra E de la pista de doma en un cartel.
- «03 · Línea de asiento»: jinete con hombro, cadera y talón alineados.
- «04 · Eje»: solo el nombre, con la «I» alargada como eje central.

**Consecuencias.** `BitMark` y `Logo` (`src/components/brand/logo.tsx`)
cambian en toda la web. El favicon y los iconos de app se actualizan
aparte.

---

## 3. Cuestiones abiertas

Temas sin decidir. Cuando se resuelva uno, se convierte en ADR (o en un
cambio en el changelog si no es una decisión de diseño) y se borra de esta
lista.

| Tema | Detalle | Responsable |
| --- | --- | --- |
| Redacción de la rutina Básica | La tabla de planes dice «Semi-personalizada y revisada por el equipo» y el paso 2 dice «Personalizada y revisada por el equipo». Unificar. | Aleix |
| Cuenta de Instagram | ¿La startup tendrá cuenta propia o se usa @giovannidressage? | Giovanni |
| Hosting de producción | Candidato: Vercel con región UE. Requiere ADR. | Aleix |
| Pruebas automáticas | Empezar por tests unitarios de `motor-rutinas.ts` (es una función pura). Herramienta por decidir. | Aleix |
| Páginas legales | Aviso legal, privacidad, cookies y condiciones de contratación. | Equipo y abogado |
| Vídeo de portada | Falta el clip original de Giovanni (`public/media/portada.mp4`). | Giovanni |
