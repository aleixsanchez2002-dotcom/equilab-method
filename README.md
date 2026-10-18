# Equilab Method

Plataforma web de **preparación física personalizada para jinetes de alto
rendimiento**. Rutinas de fuerza, movilidad y control diseñadas a partir de
un cuestionario inicial, con seguimiento del equipo y corrección por vídeo
en el plan Premium.

> Repositorio **privado y confidencial**. Lee [`LICENSE`](LICENSE) y
> [`SECURITY.md`](SECURITY.md) antes de trabajar en él.

## Empieza aquí

| Si quieres… | Lee |
| --- | --- |
| Entender qué es Equilab, para quién y cómo está construido | [`docs/CONTEXT.md`](docs/CONTEXT.md) |
| Saber qué se ha decidido y por qué (y qué **no** hay que deshacer) | [`docs/DECISIONS.md`](docs/DECISIONS.md) |
| Ver qué ha cambiado en cada versión | [`CHANGELOG.md`](CHANGELOG.md) |
| Diseñar o tocar la parte visual | [`docs/DESIGN.md`](docs/DESIGN.md) |
| Saber qué viene después | [`docs/ROADMAP.md`](docs/ROADMAP.md) |
| Abrir la web en tu ordenador y proponer cambios | [`docs/operaciones/guia-equipo.md`](docs/operaciones/guia-equipo.md) |
| Configurar GitHub o crear el repositorio | [`docs/operaciones/github.md`](docs/operaciones/github.md) |
| Trabajar con Claude u otro asistente de IA | [`CLAUDE.md`](CLAUDE.md) |

## Arranque rápido

```sh
npm ci
npm run dev        # http://localhost:3000 (ES) · http://localhost:3000/en (EN)
```

Requiere Node.js 20.9 o superior. La web pública funciona sin claves; las
cuentas y rutinas necesitan un proyecto Supabase de pruebas (ver
[`supabase/README.md`](supabase/README.md)).

Antes de proponer cualquier cambio:

```sh
npm run lint
npm run build
```

## Estructura

```
equilab-method/
├── CLAUDE.md                 Instrucciones para asistentes de IA
├── AGENTS.md                 Avisos de Next.js 16 para agentes (importado por CLAUDE.md)
├── CHANGELOG.md              Registro de cambios (Keep a Changelog)
├── LICENSE                   Licencia propietaria
├── SECURITY.md               Normas de seguridad y datos de clientes
├── .claude/                  Ajustes y comandos compartidos de Claude Code
├── .github/                  CI, plantillas de PR e issues, CODEOWNERS
├── docs/
│   ├── CONTEXT.md            Contexto general: negocio, público, arquitectura
│   ├── DECISIONS.md          Principios y registro de decisiones (ADR)
│   ├── DESIGN.md             Sistema visual: color, tipografía, movimiento
│   ├── ROADMAP.md            Próximas fases y cuestiones abiertas
│   └── operaciones/          Guía del equipo y GitHub
├── public/media/             Fotografías y vídeos de la web (ya optimizados)
├── scripts/windows/          Scripts de doble clic: verificar, abrir, crear repo
├── src/
│   ├── app/                  Rutas (App Router): web, /acceso, /app, /admin
│   ├── components/           marketing · app · admin · auth · ui · motion · i18n
│   ├── lib/                  Motor de rutinas, i18n, Supabase, utilidades
│   └── proxy.ts              Sesión e idioma en cada petición (antes «middleware»)
└── supabase/
    ├── README.md             Puesta en marcha de la base de datos
    └── migrations/           Esquema SQL numerado (solo hacia delante)
```

## Equipo

Giovanni Torrens (doma clásica) · Alex Ricarte (fuerza) · Aleix Sánchez
(análisis de rendimiento y web).
