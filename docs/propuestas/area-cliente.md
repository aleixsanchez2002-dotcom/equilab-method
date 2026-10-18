# Propuesta · Área de cliente y siguientes mejoras

- **Estado:** Propuesta, pendiente de aprobación de Aleix
- **Fecha:** 2026-10-18
- **Relacionado:** ADR-0003 (Bunny Stream), ADR-0004 (vídeo solo en Premium),
  ADR-0005 (revisión humana), ADR-0011 (precios), ADR-0012 (Stripe),
  [`ROADMAP.md`](../ROADMAP.md)

Esta propuesta recoge qué falta y qué mejoraría, tanto en la web pública
como en el área a la que entra el jinete al iniciar sesión, y propone un
orden de trabajo por fases. Cada fase se aprueba antes de empezarla y se
entrega como uno o varios pull requests.

---

## 1. Qué hay hoy en el área privada

| Ruta | Contenido |
| --- | --- |
| `/app` | **Una sola página larga:** aviso del cuestionario, rutina (semanas → días → series con registro), gráfico de cargas, peso semanal, historial y resumen del plan |
| `/app/cuestionario` | Cuestionario inicial |
| `/app/bloque` | Explicación del bloque («por qué entrenas así») |
| `/app/cuenta` | Perfil, plan (botones desactivados hasta tener pagos) y contacto (solo Instagram) |
| `/admin` | Directorio de clientes, ficha y constructor de rutinas |

**Lo que funciona bien:** el registro de series con «última: 40 × 8», las
semanas del bloque, la gráfica de progreso, el peso del lunes y la revisión
humana antes de publicar.

**Lo que falta o flojea:**

1. **Sin navegación.** Todo está en una página; en el móvil hay que hacer
   mucho scroll para llegar al progreso o a la cuenta.
2. **Diseño heredado del prototipo.** Tarjetas con borde, líneas
   discontinuas y cursivas. Hereda los colores nuevos, pero no la
   identidad de `DESIGN.md` (campos planos, sin filetes finos).
3. **Registro de series pensado para escritorio.** En el gimnasio, con el
   móvil, son 4 campos por serie en una página larga. No hay temporizador
   de descanso ni modo «un ejercicio cada vez».
4. **Lo prometido en Premium no tiene pantalla:**
   - corrección de técnica por vídeo (no existe);
   - revisión mensual (la tabla `checkins` existe, pero no hay interfaz);
   - valoración 1:1 (no hay agenda);
   - contacto directo (solo Instagram).
5. **Lo prometido en los dos planes:** la «biblioteca de ejercicios en
   vídeo» aún aparece como «Vídeo · próximamente».
6. **Sin avisos:** el jinete no se entera de que su rutina está publicada
   ni de que le han corregido algo si no entra a mirar.
7. **Sin pagos:** el alta del plan es manual (ADR-0012, en propuesta).

---

## 2. Área de cliente propuesta

### 2.1 Navegación

Pensada para el móvil (el jinete entrena con el teléfono en la mano).
**Barra inferior con 5 pestañas** en el móvil y barra superior en el
escritorio.

| Pestaña | Ruta | Para qué |
| --- | --- | --- |
| **Hoy** | `/app` | La sesión que toca hoy y los avisos |
| **Rutina** | `/app/rutina` | El bloque completo, semana a semana, y el modo entreno |
| **Técnica** | `/app/tecnica` | Vídeos de corrección (Premium) |
| **Progreso** | `/app/progreso` | Cargas, peso, constancia y revisiones mensuales |
| **Cuenta** | `/app/cuenta` | Perfil, plan, contacto y privacidad |

### 2.2 Pantallas

**Hoy**
- Saludo y **sesión de hoy**: el siguiente día pendiente de la semana, con
  su enfoque y duración, y el botón «Empezar sesión».
- Constancia de la semana: «2 de 3 sesiones hechas».
- Avisos, solo si los hay: peso del lunes pendiente, corrección de técnica
  respondida, revisión mensual disponible (Premium), rutina nueva
  publicada.
- Estados previos: «Cuéntanos cómo montas» (sin cuestionario) y «El equipo
  está preparando tu rutina» (en revisión). Ya existen; se rediseñan.

**Rutina**
- Bloque, semana y días como hoy, con la explicación del bloque integrada
  (sustituye a `/app/bloque`).
- **Modo entreno** (nuevo), a pantalla completa en el móvil:
  - un ejercicio cada vez, con su vídeo o foto de ejecución, la nota
    técnica y las series objetivo;
  - registro serie a serie con campos grandes, rellenados con la última
    marca para corregir solo lo que cambia;
  - temporizador de descanso automático al marcar una serie;
  - al terminar, resumen y «Guardar sesión».
  - Premium: botón «Enviar vídeo de este ejercicio» que lleva a Técnica
    con el ejercicio ya elegido.

**Técnica** (Premium)
- Botón «Enviar un vídeo»: eliges el ejercicio de tu rutina, grabas o
  subes el vídeo (máx. 60 s), añades una nota opcional («me cuesta
  mantener la rodilla») y envías.
- Subida con barra de progreso que se reanuda si se corta la conexión.
- Lista de envíos con estado: **Enviado → En revisión → Corregido**.
- Corrección: comentario del entrenador, **comentarios en momentos
  concretos del vídeo** (por ejemplo, «0:12 la cadera se adelanta») y, si
  hace falta, un ejercicio correctivo añadido a la rutina.
- Contador: «Te quedan 3 vídeos este mes».
- **En el plan Básico:** la pestaña aparece con una explicación breve y
  sobria de cómo funciona y un botón «Pasar a Premium». Sin presión ni
  avisos repetidos.

**Progreso**
- Cargas por ejercicio (gráfico actual), peso corporal semanal y
  constancia: sesiones por semana de las últimas 8 semanas.
- Historial de sesiones.
- Premium: **revisión mensual**. El día 1 se abre un formulario corto
  (peso, perímetro de cintura, bienestar, molestias y fotos opcionales). El
  equipo responde con notas y aparece aquí (tabla `checkins`, ya creada).

**Cuenta**
- Perfil, idioma, plan y suscripción (con Stripe cuando esté), contacto.
- Premium: contacto directo con el equipo y enlace para reservar la
  valoración 1:1 (ver decisiones).
- **Privacidad:** descargar mis datos y solicitar borrado de cuenta
  (derechos del RGPD).

### 2.3 Qué ve cada plan

| | Básico | Premium |
| --- | --- | --- |
| Hoy, Rutina y modo entreno | ✓ | ✓ |
| Vídeo de ejecución de cada ejercicio | ✓ | ✓ |
| Progreso: cargas, peso, constancia | ✓ | ✓ |
| Técnica: enviar vídeos y recibir correcciones | Vista informativa | ✓ (límite mensual) |
| Revisión mensual con notas del equipo | — | ✓ |
| Valoración 1:1 | — | ✓ (al empezar) |
| Contacto directo | Formulario (48 h) | Directo (24 h) |

Las capacidades de cada plan se definirán **en un solo sitio**
(`src/lib/planes.ts`) y también en la base de datos (RLS). Ocultar un
botón no basta (ADR-0004).

### 2.4 Panel del equipo (lo mínimo para dar servicio)

- **`/admin/tecnica`:** cola de vídeos pendientes, de más antiguo a más
  nuevo, con reproductor, comentarios por segundo, comentario general y
  «Enviar corrección».
- **`/admin/revisiones`:** revisiones mensuales pendientes de responder.
- En la ficha del cliente: pestañas de técnica y revisiones.

### 2.5 Cómo funcionaría el vídeo por dentro

1. El cliente pulsa «Enviar». El servidor comprueba que es Premium con
   cupo disponible, crea el vídeo en **Bunny Stream** y devuelve una firma
   temporal de subida. La clave de Bunny nunca llega al navegador.
2. El navegador sube el archivo directamente a Bunny con TUS (subida
   reanudable), sin pasar por nuestro servidor.
3. Bunny avisa por webhook cuando el vídeo está procesado y el estado pasa
   a «Enviado».
4. El vídeo se reproduce con **URL firmadas que caducan**. Biblioteca en
   la UE.
5. Supabase solo guarda la referencia y el estado:
   - tabla `technique_videos` (cliente, ejercicio, id de Bunny, estado,
     nota del cliente, fechas, quién revisa);
   - tabla `technique_comments` (vídeo, segundo, texto, autor);
   - RLS: el cliente ve los suyos y el equipo ve todos. Solo se puede
     insertar con Premium vigente (función SQL `tiene_premium(uid)`).
6. **Consentimiento específico** al enviar el primer vídeo (imagen y datos
   de salud) y **borrado automático** pasado un plazo.

Los detalles de la API de Bunny (firma TUS, token de reproducción y
webhook) se confirmarán con su documentación al implementar.

### 2.6 Avisos por email

Rutina publicada, corrección lista, revisión mensual disponible y
recordatorio de peso (opcional). Requiere elegir proveedor de email (ADR
nueva; candidato: Resend, con servidor en la UE, o el SMTP de Supabase).

---

## 3. Mejoras en la web pública

**Obligatorio antes de cobrar**
- Páginas legales: aviso legal, privacidad, cookies y condiciones de
  contratación, enlazadas desde el pie. Las redacta o revisa un abogado.
- Si se añade analítica con cookies, banner de consentimiento. Con
  analítica sin cookies (Plausible o Vercel Analytics) no hace falta.

**Visual y contenido**
- Vídeo de portada (`portada.mp4`) y foto de Alex: pendientes del material.
- **Imagen para compartir (Open Graph):** cuando se envía el enlace por
  WhatsApp o Instagram, ahora no sale ninguna imagen. Propuesta: una
  imagen 1200×630 con la foto de Giovanni y «Equilab».
- Favicon e icono de la marca (ahora es el de Next.js). Eliminar los SVG de
  ejemplo de Next que siguen en `public/`.
- Página 404 con la identidad de la web.
- Preguntas frecuentes: añadir «¿Cómo funciona la corrección por vídeo?» y
  «¿Cuántos vídeos puedo enviar?» cuando estén decididos.
- Prueba social **real**: cuando haya jinetes que lo hayan probado, sus
  palabras con permiso. Nunca testimonios inventados.
- Unificar «semi-personalizada» y «personalizada» (cuestión abierta).
- SEO básico: `sitemap.xml`, `robots.txt` y títulos y descripciones por
  idioma.

---

## 4. Plan de trabajo por fases

Cada fase termina con un pull request que pasa la CI. Tú lo revisas
(capturas y, si quieres, `actualizar-web.cmd` y `abrir-web.cmd`) y lo
apruebas. No se empieza la siguiente sin tu visto bueno.

| Fase | Qué se hace | Necesita de ti | Tamaño |
| --- | --- | --- | --- |
| **0 · Arreglos rápidos** | Favicon, imagen para compartir, 404, limpieza de `public/`, sitemap y robots | Nada | Pequeña |
| **1 · Maquetas** | Pantallas nuevas (Hoy, Rutina, modo entreno, Técnica, Progreso, Cuenta) con **datos de ejemplo**, sin conectar. Te envío capturas de móvil y escritorio y las ajustamos. | Aprobar el diseño | Media |
| **2 · Navegación y rediseño** | Barra de pestañas, rutas nuevas y lo que ya existe movido a su sitio con la identidad nueva. **Sin cambiar la lógica.** | Aprobar el PR | Media |
| **3 · Modo entreno y Hoy** | Sesión paso a paso, temporizador, registro móvil y pantalla Hoy | Aprobar el PR | Media |
| **4 · Capacidades por plan** | `planes.ts`, función SQL `tiene_premium`, vista informativa de Técnica en Básico y contacto por plan | Decisiones 2 y 3 | Pequeña |
| **5 · Revisión mensual** | Formulario mensual del cliente, cola en `/admin/revisiones` y vista en Progreso. Migración nueva y bucket privado de fotos. | Aprobar el PR | Media |
| **6 · Corrección por vídeo** | Cuenta de Bunny, migración, subida TUS, webhook, reproducción firmada, cola en `/admin/tecnica` y comentarios por segundo | Decisión 1, cuenta de Bunny y claves (las pones tú en el hosting) | Grande |
| **7 · Avisos por email** | Proveedor, plantillas y envíos | Elegir proveedor | Pequeña |
| **8 · Pagos** | Stripe Checkout, portal de cliente y webhooks (ADR-0012) | Cuenta de Stripe | Grande |
| **Lanzamiento** | Páginas legales, hosting y Supabase de producción | Abogado y dominio | — |

Las fases 0 y 1 pueden empezar ya. Los pagos (8) pueden adelantarse si
queréis cobrar antes de tener la corrección por vídeo: no dependen entre
sí, porque el plan ya se lee de `subscriptions`.

---

## 5. Decisiones que necesito

| # | Decisión | Mi propuesta |
| --- | --- | --- |
| 1 | Vídeos de técnica en Premium: cuántos al mes, duración máxima, plazo de respuesta y cuánto tiempo se guardan | 4 al mes, 60 s cada uno, respuesta en 72 h laborables, borrado a los 6 meses |
| 2 | Contacto directo en Premium | Al principio, un botón de WhatsApp o email del equipo; mensajería dentro de la app más adelante si hace falta |
| 3 | Valoración 1:1 | Enlace a una agenda externa (Cal.com o Calendly) |
| 4 | ¿El Básico ve la pestaña Técnica (informativa, con opción de pasar a Premium)? | Sí, sobria y sin insistir |
| 5 | Proveedor de email | Resend (UE) |
| 6 | Analítica de la web | Sin cookies (Plausible o Vercel Analytics) |

Cuando decidas, cada respuesta se convierte en una ADR en `DECISIONS.md`.
