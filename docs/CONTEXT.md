# Contexto general · Equilab Method

> **Para qué sirve este documento.** Es la fuente única de contexto sobre la
> startup: qué hacemos, para quién, con qué objetivos y cómo está construido
> el sistema. Lo leen las personas que se incorporan y los asistentes de IA
> antes de proponer cambios.
>
> **Cómo mantenerlo.** Cuando cambie algo de lo que aquí se describe, se
> actualiza en el mismo pull request. Las decisiones y su porqué van en
> [`DECISIONS.md`](DECISIONS.md); aquí solo se describe el estado actual.
> Los campos marcados con `[PENDIENTE]` están por definir: rellénalos en
> cuanto el equipo los decida.

**Última revisión:** 2026-10-18 · **Responsable:** Aleix Sánchez

---

## 1. Visión y misión

**Visión.** Que la preparación física fuera de la silla forme parte del
entrenamiento de cualquier jinete que compite, igual que ya lo forma en
otros deportes de alto rendimiento.

**Misión.** Dar a cada jinete un programa de fuerza, movilidad y control
diseñado para lo que pasa en la pista: un asiento estable, unas manos
independientes y una cadera que acompaña. El programa lo diseñan quien
entiende la pista, quien entiende el gimnasio y quien entiende los datos.

**Lema público:** «Preparación física para jinetes profesionales» /
*«Fitness training for professional riders»*.

`[PENDIENTE]` Validar la redacción de visión y misión con los tres socios.

## 2. Propuesta de valor

**El problema.** El juez mira al caballo, pero lo que ve empieza en el
jinete. Las asimetrías, la falta de estabilidad del core y la cadera rígida
se notan en la pista. Casi ningún jinete entrena fuera de la silla con un
plan específico, y los planes genéricos de gimnasio no están pensados para
montar.

**La solución.**

- **Cuestionario inicial de 10 minutos** sobre postura, historial físico,
  material disponible y objetivos en la pista.
- **Rutina personalizada** con 2 a 4 días de dedicación semanal, que se
  sigue desde el móvil, con vídeo demostrativo y la técnica explicada en
  cada ejercicio.
- **Tres especialistas:** doma clásica (Giovanni Torrens), fuerza (Alex
  Ricarte) y análisis de rendimiento (Aleix Sánchez).
- **Sin permanencia:** se cancela desde el portal de cliente.

**Diferenciación.** Especialización ecuestre real (Giovanni compite en doma
clásica) frente a apps de fitness genéricas. Las rutinas parten de las
correcciones que el jinete recibe en la pista, no de objetivos estéticos.

### Planes

| | **Básico** · 75 €/mes | **Premium** · 150 €/mes |
| --- | --- | --- |
| Rutina | Semi-personalizada: la genera el motor de reglas a partir del cuestionario y la revisa el equipo | 100 % personalizada, hecha a mano |
| Valoración inicial 1:1 | No | Sí, por videollamada |
| Progresiones | Periódicas | Ajustes continuos |
| Seguimiento | Registro propio de sesiones y progreso | Revisión mensual de progreso y bienestar |
| Contacto con el equipo | No | Directo |
| Corrección de técnica por vídeo | No | Sí (en desarrollo, ver ADR-0004) |
| Plazas | Sin límite | Limitadas (20, en `plans.premium_seats`) |

Los códigos internos de plan son `basico` y `premium`, y no se traducen.

## 3. Objetivos de negocio

`[PENDIENTE]` Fijar las cifras con los socios. Plantilla:

| Horizonte | Objetivo | Indicador (KPI) | Valor objetivo |
| --- | --- | --- | --- |
| Lanzamiento | Web pública con pagos operativos | Fecha de lanzamiento | `[PENDIENTE]` |
| 6 meses | Primeros clientes de pago | Clientes activos Básico / Premium | `[PENDIENTE]` |
| 6 meses | Validar el plan Premium | Ocupación de plazas Premium (de 20) | `[PENDIENTE]` |
| 12 meses | Ingresos recurrentes | Ingresos mensuales recurrentes (MRR) | `[PENDIENTE]` |
| Continuo | Retención | Bajas mensuales (*churn*), % | `[PENDIENTE]` |
| Continuo | Adherencia | Sesiones registradas por cliente y semana | `[PENDIENTE]` |
| Continuo | Captación | Conversión de visita a registro y de registro a pago | `[PENDIENTE]` |

Canal principal de captación: Instagram de Giovanni
([@giovannidressage](https://www.instagram.com/giovannidressage)).
`[PENDIENTE]` Decidir si la startup tendrá cuenta propia.

## 4. Público objetivo

**Cliente principal.** Jinetes de alto rendimiento que **compiten o se
preparan para competir**. La mayoría tiene entre 20 y 45 años, aunque
también hay jinetes más jóvenes y mayores.

- **Disciplina de origen:** doma clásica. La base del método (asiento,
  simetría, estabilidad de core y cadera) sirve a cualquier disciplina.
- **Qué buscan:** mejorar la nota y la posición, prevenir lesiones y
  entrenar con un plan concreto en poco tiempo.
- **Cómo nos usan:** desde el móvil, en el gimnasio o en casa con material
  mínimo.
- **Idiomas:** español (principal) e inglés.

**Prescriptores.** Entrenadores ecuestres y clubes. `[PENDIENTE]` Definir
si habrá programa de entrenadores o clubes.

**Lo que no somos.** Ni una app de fitness genérica, ni un servicio de
fisioterapia o tratamiento de lesiones.

## 5. Arquitectura del sistema

### 5.1 Tecnologías

| Capa | Tecnología | Notas |
| --- | --- | --- |
| Framework web | **Next.js 16.2** (App Router, Turbopack) | `src/proxy.ts` sustituye al antiguo `middleware`. Antes de tocar APIs de Next, lee `node_modules/next/dist/docs/` (ver `AGENTS.md`). |
| UI | **React 19.2**, **TypeScript 5** (estricto) | Componentes de servidor por defecto; `"use client"` solo si hace falta. |
| Estilos | **Tailwind CSS v4** (`@theme` en `globals.css`) | Tokens de color y escala tipográfica propios (ver `DESIGN.md`). |
| Tipografía | Libre Franklin y Source Serif 4 (`next/font/google`) | Ambas variables. |
| Base de datos y autenticación | **Supabase** (Postgres, Auth, RLS), `@supabase/ssr` | Región UE (Frankfurt) por RGPD y datos de salud. |
| Idiomas | Sistema propio: `t("texto en español")` → `src/lib/i18n/en.json` | La cookie de idioma la gestiona `proxy.ts`. |
| Pagos | **Stripe** | Previsto, sin integrar. Las tablas `payments`, `subscriptions` y `webhook_events` ya existen. |
| Vídeo de clientes | **Bunny Stream** | Previsto, sin integrar (ADR-0003). |
| Calidad | ESLint 9 (`eslint-config-next`) | Aún no hay tests automáticos (ver `ROADMAP.md`). |
| CI | GitHub Actions: lint y compilación en cada PR | `.github/workflows/ci.yml`. |
| Hosting | `[PENDIENTE]` | Candidato: Vercel (región UE). Requiere ADR. |

### 5.2 Mapa de la aplicación

```
Web pública (sin sesión)
  /                 Portada en español
  /en               Portada en inglés
  /acceso           Iniciar sesión y crear cuenta
  /acceso/recuperar, /acceso/nueva-contrasena
  /auth/confirm     Confirmación de email (route handler)
  /language         Cambio de idioma (route handler)

Área del cliente (con sesión) · src/app/app/
  /app              Rutina de la semana y registro de sesiones
  /app/cuestionario Cuestionario inicial
  /app/bloque       Información del bloque o mesociclo actual
  /app/cuenta       Cuenta, plan y contacto

Panel del equipo (rol de equipo) · src/app/admin/
  /admin                      Directorio de clientes
  /admin/clientes/[id]        Ficha del cliente
  /admin/rutinas/nueva, /admin/rutinas/[id]   Constructor y revisión de rutinas
```

`proxy.ts` refresca la sesión de Supabase en cada petición a rutas privadas
y redirige a `/acceso` si no hay usuario. Sin Supabase configurado, la web
pública funciona y las rutas privadas muestran un aviso.

### 5.3 Flujo principal

1. El jinete crea una cuenta y acepta los consentimientos (`consents`).
2. Rellena el cuestionario (`questionnaire_responses`, plantilla versionada
   en `questionnaire_templates`).
3. **Plan Básico:** `src/lib/motor-rutinas.ts` (función pura y
   determinista) genera una **propuesta en borrador** con el catálogo de
   `exercises`. **Plan Premium:** el equipo construye la rutina a mano.
4. El equipo revisa, ajusta cargas y **publica** la rutina (`routines`,
   `routine_days`, `routine_exercises`). Nada llega al cliente sin revisión
   humana.
5. El cliente entrena y registra series, peso y sensaciones
   (`workout_sessions`, `workout_logs`, `body_weight_logs`, `checkins`).
6. El equipo sigue el progreso desde el panel. En Premium también corrige
   la técnica por vídeo (Bunny Stream, previsto).

### 5.4 Modelo de datos (resumen)

| Tabla | Contenido |
| --- | --- |
| `profiles` | Perfil, rol (cliente o equipo) y email |
| `consents` | Consentimientos RGPD aceptados |
| `plans`, `subscriptions` | Planes (`basico`, `premium`) y suscripciones |
| `questionnaire_templates`, `questionnaire_responses` | Cuestionario versionado y respuestas |
| `exercises` | Biblioteca de ejercicios: categoría, material y notas técnicas |
| `routines`, `routine_days`, `routine_exercises` | Rutinas, días y ejercicios con sus series |
| `workout_sessions`, `workout_logs` | Sesiones y series registradas |
| `body_weight_logs` | Peso corporal semanal |
| `checkins` | Revisión mensual: medidas, bienestar, notas del entrenador y fotos (Supabase Storage, bucket privado) |
| `payments`, `webhook_events` | Pagos e idempotencia de webhooks (para Stripe) |

Toda la seguridad de acceso se aplica con **RLS** en Postgres. El esquema
completo está en `supabase/migrations/` (de la `0001` a la `0009`).

### 5.5 Entornos

| Entorno | Base de datos | Uso |
| --- | --- | --- |
| Local | Ninguna o Supabase **de pruebas** | Desarrollo |
| Pruebas | Supabase de pruebas | Revisar flujos con cuentas ficticias |
| Producción | Supabase de producción (UE) | Clientes reales. `[PENDIENTE]` |

Variables de entorno (plantilla en `.env.example`):

| Variable | Pública | Uso |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Sí | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sí | Clave pública (anon); RLS protege los datos |
| `NEXT_PUBLIC_SITE_URL` | Sí | Dirección pública de la web (imagen para compartir, sitemap). Vacía en local |
| *(futuras)* `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `BUNNY_*` | No | Solo en el hosting, nunca en Git |

## 6. Instalación y despliegue rápido

### 6.1 Local

```sh
git clone https://github.com/<organizacion-o-usuario>/equilab-method.git
cd equilab-method
npm ci
npm run dev            # http://localhost:3000
```

Para cuentas y rutinas, sigue `supabase/README.md` con un proyecto de
pruebas y crea `.env.local` a partir de `.env.example`.

En Windows, sin terminal: `scripts/windows/verificar-web.cmd` y
`scripts/windows/abrir-web.cmd`.

### 6.2 Verificación antes de integrar

```sh
npm run lint
npm run build
```

La CI de GitHub ejecuta lo mismo en cada pull request.

### 6.3 Despliegue a producción

`[PENDIENTE]` El proveedor de hosting está por decidir y necesita ADR. Si
se elige Vercel, el procedimiento previsto es:

1. Importar el repositorio en Vercel, con la región de funciones en la UE
   (`fra1`).
2. Configurar las variables de entorno de producción en el panel de Vercel.
3. En Supabase de producción, aplicar las migraciones pendientes **antes**
   de desplegar el código que las necesita.
4. En Supabase → Authentication → URL Configuration, añadir el dominio de
   producción.
5. Fusionar en `main` despliega automáticamente. Cada PR genera una vista
   previa.

### 6.4 Migraciones de base de datos

- Son **solo hacia delante**: una migración aplicada no se edita. Los
  cambios van en un archivo nuevo con el número siguiente
  (`0010_…sql`).
- Se aplican primero en pruebas y después en producción.

## 7. Equipo y responsabilidades

| Persona | Rol | Áreas |
| --- | --- | --- |
| Giovanni Torrens | Doma clásica, marca y redes | Contenido ecuestre, fotografía y vídeo, Instagram |
| Alex Ricarte | Fuerza | Rutinas, catálogo de ejercicios, progresiones |
| Aleix Sánchez | Análisis de rendimiento y web | Producto, código, datos, seguimiento del progreso |

Comunicación: Slack (`#00-equilab`, `#01-web`, `#02-rutinas`,
`#03-redes`). Las decisiones técnicas y de diseño se registran en
`DECISIONS.md`.

## 8. Glosario

| Término | Significado |
| --- | --- |
| **Rutina** | Plan de entrenamiento de un cliente: días, ejercicios y series |
| **Bloque / mesociclo** | Conjunto de semanas con una progresión común |
| **Motor de rutinas** | `motor-rutinas.ts`: reglas que convierten el cuestionario en una propuesta (plan Básico) |
| **Corrección** | Fallo que el jinete recibe en la pista (p. ej. «hombros adelantados»); orienta la prioridad de los ejercicios |
| **RIR** | Repeticiones en reserva al terminar una serie |
| **Equipo** | Rol de usuario con acceso al panel `/admin` |
