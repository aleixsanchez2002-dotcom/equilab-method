# Equilab Method

Web de preparación física para jinetes. Esta es la versión vigente aprobada por el equipo el **19 de octubre de 2026**.

**Referencia única para futuros cambios:** [Criterios vigentes](docs/CRITERIOS_VIGENTES.md). Las versiones y maquetas anteriores no deben usarse como base.

## Ejecutarlo en tu ordenador

Requisitos: Node.js 20.9 o posterior y npm.

```bash
git clone https://github.com/aleixsanchez2002-dotcom/equilab-method.git
cd equilab-method
npm ci
cp .env.example .env.local
```

Completa `.env.local` con la configuración del proyecto Supabase que te facilite el equipo. No compartas claves por un repositorio público. Las variables `PREMIUM_GIOVANNI_PHONE` y `PREMIUM_RICARTE_PHONE` llevan los contactos privados Premium en formato internacional; pídelos al equipo por un canal privado.

```bash
npm run dev
```

Abre `http://localhost:3000`. La portada está en español y en inglés. La zona privada requiere una cuenta confirmada y un acceso de cliente o equipo, según el recorrido.

Para preparar una base de datos nueva, sigue [la guía de Supabase](supabase/README.md) y aplica las migraciones hasta `0010`. No vuelvas a ejecutar la creación inicial sobre una base ya instalada. Si usas la base existente del equipo, comprueba las migraciones pendientes antes de aplicarlas. La versión v2 del cuestionario también se puede activar desde el panel del equipo.

## Qué incluye

- Portada y acceso con identidad grafito, blanco roto y lima; español e inglés.
- Área del cliente: Inicio, Mi rutina, Progreso y Cuenta.
- Panel de equipo, filtros de clientes y editor de rutinas por semanas, días y series.
- Cuestionario inicial v2 por pasos, revisión final y respuestas agrupadas para el equipo.
- Plan Básico 40 €/mes y Premium 80 €/mes; contactos privados para Premium vigente.

Los pagos automáticos y la agenda de videollamadas siguen pendientes. No se necesita conectar Stripe para probar los recorridos actuales.

## Organización del código

| Ruta | Contenido |
| --- | --- |
| `src/app` | Páginas y acciones del servidor |
| `src/components` | Componentes de marketing, clientes y equipo |
| `src/lib/i18n` | Idioma y traducciones |
| `src/lib/plans.ts` | Tarifas públicas |
| `src/lib/questionnaire.ts` | Definición y validación del cuestionario |
| `src/lib/motor-rutinas.ts` | Propuestas del plan Básico, siempre en borrador |
| `src/lib/premium-contacts.ts` | Lectura de contactos privados del servidor |
| `supabase/migrations` | Evolución del esquema y datos de configuración |
| `docs/CRITERIOS_VIGENTES.md` | Decisiones de producto que deben respetarse |

## Probar cambios y ponerlos en común

Trabaja en una rama a partir de `main`:

```bash
git switch main
git pull --ff-only
git switch -c nombre-del-cambio
npm run lint
npm run build
```

Abre una pull request con lo cambiado y cómo lo has probado. No mezcles una propuesta visual nueva con el comportamiento ya aprobado sin acordarlo con el equipo.

Para ver la compilación de producción local:

```bash
npm run build
npm run start
```

## Copias anteriores al reinicio del historial

Esta entrega sustituye las ramas y la base anteriores. Si tienes una copia vieja, guarda tus cambios aparte y clona el repositorio de nuevo en otra carpeta. No mezcles el historial anterior con el nuevo `main` ni uses `git pull --allow-unrelated-histories`.

Giovanni lleva redes y marca; Alex Ricarte, rutinas y preparación física; Aleix Sánchez, web y experiencia digital.
