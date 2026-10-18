# CLAUDE.md · Equilab Method

Plataforma de preparación física personalizada para jinetes de alto
rendimiento. Next.js 16 + Supabase. Repositorio privado: los datos de
clientes son **datos de salud**.

@AGENTS.md

## 1. Antes de proponer o implementar nada

Lee en este orden y **no empieces a cambiar código hasta haberlo hecho**:

1. `docs/CONTEXT.md`: qué es el producto, para quién y cómo está
   construido.
2. `docs/DECISIONS.md`: principios P-01 a P-13, índice de ADR y cuestiones
   abiertas. Busca las ADR relacionadas con tu tarea.
3. `CHANGELOG.md`, sección «Sin publicar» y la última versión: qué se ha
   hecho o deshecho hace poco.
4. Según la tarea: `docs/DESIGN.md` (cualquier cambio visual),
   `supabase/README.md` (base de datos), `SECURITY.md` (datos o claves).

Si tu propuesta **contradice una ADR aceptada** o **vuelve a proponer una
alternativa descartada**, no la apliques: dilo de forma explícita, cita la
ADR y pregunta. Si la tarea toca una **cuestión abierta**, señálalo antes
de decidir por tu cuenta.

## 2. Comandos

```sh
npm ci                 # instalar dependencias (respeta el lockfile)
npm run dev            # desarrollo: http://localhost:3000 (ES) y /en (EN)
npm run lint           # ESLint: debe acabar sin errores
npm run build          # compilación de producción: debe acabar sin errores
npm run start          # servir la compilación
```

- **No hay tests automáticos todavía.** Verificar significa: `lint` y
  `build` sin errores, y revisión visual en escritorio y móvil si el cambio
  se ve.
- La web pública compila y funciona **sin `.env.local`**. Para cuentas y
  rutinas hace falta un Supabase **de pruebas** (`supabase/README.md`).
- En Windows existen `scripts/windows/verificar-web.cmd` (lint y build, con
  el resultado en `verificacion.log`) y `abrir-web.cmd`.

## 3. Arquitectura en 30 segundos

```
src/app/            Rutas (App Router). Públicas: /, /en, /acceso. Cliente: /app. Equipo: /admin
src/components/     marketing/ (portada) · app/ (cliente) · area/ (área de cliente nueva) · admin/ (equipo) · ui/ · motion/ · i18n/
src/lib/            motor-rutinas.ts (función pura) · i18n/ · supabase/ (client, server, config, types)
src/proxy.ts        Sesión Supabase e idioma por petición (Next 16: sustituye a middleware)
supabase/migrations Esquema SQL numerado 0001–0009 con RLS
public/media/       Fotos y vídeos de la web, ya optimizados
```

- Flujo: cuestionario → `motor-rutinas.ts` genera un **borrador** →
  el equipo revisa y publica → el cliente entrena y registra. Nada llega al
  cliente sin revisión humana (ADR-0005).
- Seguridad de datos: **RLS en Postgres**, no en el código de la app.

## 4. Normas de código

- **TypeScript estricto.** Sin `any` ni `@ts-ignore` sin justificar.
- **Componentes de servidor por defecto.** `"use client"` solo para
  interacción real, lo más abajo posible del árbol.
- **Next.js 16:** consulta `node_modules/next/dist/docs/` antes de usar una
  API de Next. No uses `middleware.ts` (es `proxy.ts`).
- **Estilos:** Tailwind v4 con los tokens de `globals.css` (`paper`,
  `linen`, `night`, `slate`, `navy`, `wine`…) y la escala `text-step-*`.
  En código nuevo, no uses colores hexadecimales sueltos ni los tokens
  heredados (`ink`, `sand`, `cognac`, `oxblood`). Une clases con `cn()`
  (`src/lib/cn.ts`).
- **Textos:** se escriben en español dentro de `t("…")` y cada texto nuevo
  o modificado se traduce en `src/lib/i18n/en.json` (la clave es la frase
  española exacta). El panel `/admin` solo está en español.
- **Nombres:** dominio en español (`rutina`, `cuestionario`, `motor`),
  convenciones de librería en inglés. Archivos en `kebab-case`.
- **Animación:** solo `transform`, `opacity` y `clip-path`; estado oculto
  bajo `.js`; alternativa con `prefers-reduced-motion`. Ver `DESIGN.md`.
- **Accesibilidad:** HTML semántico, foco visible, `alt` en las imágenes y
  `aria-*` solo si el HTML no basta.
- **Base de datos:** nunca edites una migración existente. Crea
  `supabase/migrations/00NN_descripcion.sql`, idempotente y con políticas
  RLS para cada tabla nueva (ADR-0006).
- **Dependencias:** no instales paquetes sin una ADR (P-04).
- Comentarios en español, breves, que expliquen el **porqué**.

## 5. Acoplamientos que rompen cosas

- `motor-rutinas.ts` ↔ `components/marketing/correcciones.tsx`: la portada
  copia la prioridad de correcciones del motor. Si cambias uno, cambia el
  otro.
- Valores internos del cuestionario y códigos de plan (`basico`,
  `premium`): **no se traducen ni se renombran**.
- Precios: `0002_datos_iniciales.sql` ↔ `plans.tsx` ↔ `method.tsx`
  (ADR-0011).
- Lema de la portada: el divisor de `.tagline` en `globals.css` depende de
  la longitud del texto en español.
- `public/media/portada.mp4` y `alex.jpg` aparecen solos si existen: no
  hace falta tocar código.

## 6. Cómo trabajar con el equipo

- **Idioma:** responde en español, en un lenguaje claro y sin jerga
  innecesaria.
- **Textos dictados:** si el equipo da una frase exacta, aplícala
  **literalmente** (P-03). Las mejoras de redacción se proponen aparte.
- **Cambios mínimos:** haz solo lo que pide la tarea (P-02). Si ves algo
  mejorable fuera de su alcance, menciónalo al final sin implementarlo.
- **Pregunta antes de** borrar archivos, cambiar el esquema de datos,
  añadir dependencias, tocar autenticación, RLS o pagos, o contradecir una
  ADR.
- **Nunca** leas ni muestres `.env*`, ni uses o inventes datos reales de
  clientes, ni hagas commit de secretos (`SECURITY.md`).
- **Git:** trabaja en una rama (`tu-nombre/tema`), nunca directamente en
  `main`. Commits en español, en presente y concretos («Portada: lema en
  negrita»).
- **Al terminar cada tarea:**
  1. `npm run lint` y `npm run build` sin errores.
  2. Línea en `CHANGELOG.md` → «Sin publicar».
  3. Si has tomado una decisión de diseño, arquitectura o producto, ADR
     nueva en `docs/DECISIONS.md` (estado `Propuesta` si falta la
     aprobación del equipo).
  4. Si ha cambiado algo de lo que describe `docs/CONTEXT.md`, actualízalo.
  5. Resume en dos o tres frases qué has cambiado y cómo verlo.

  El comando `/cerrar-tarea` recorre esta lista y `/nueva-decision`
  redacta una ADR.
