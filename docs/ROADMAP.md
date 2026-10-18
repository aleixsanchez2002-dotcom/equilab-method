# Hoja de ruta

Estado a 2026-10-18. Cada fase se cierra cuando su criterio de terminado se
cumple en producción. Las decisiones que surjan van a `DECISIONS.md`.

> Propuesta detallada del área de cliente, mejoras de la web y orden de
> trabajo: [`propuestas/area-cliente.md`](propuestas/area-cliente.md)
> (pendiente de aprobación).

| Fase | Contenido | Estado | Decisiones |
| --- | --- | --- | --- |
| 0 · Prototipo | Web, acceso, área cliente, panel, motor v1, esquema | Hecho (v0.1.0) | ADR-0001, 0005 a 0007 |
| 1 · Rediseño | Identidad clara, portada en tablero, ES/EN | Hecho (v0.2.0) | ADR-0008 a 0011 |
| 2 · Repositorio | GitHub privado, CI, documentación y contexto para IA | En curso | — |
| 3 · Lanzamiento | Hosting, dominio, Supabase de producción, páginas legales, vídeo de portada | Pendiente | Hosting (abierta) |
| 4 · Pagos | Stripe Checkout, portal de cliente, webhooks, plazas Premium | Pendiente | ADR-0012 (propuesta) |
| 5 · Corrección por vídeo | Subida a Bunny Stream, revisión y comentarios del equipo (Premium) | Pendiente | ADR-0003, 0004 |
| 6 · Calidad | Tests del motor de rutinas, pruebas E2E del flujo de alta | Pendiente | Herramienta (abierta) |

## Fase 3 · Lanzamiento: criterio de terminado

- [ ] Hosting elegido y ADR aceptada
- [ ] Dominio y HTTPS
- [ ] Supabase de producción en la UE con migraciones `0001` a `000N`
- [ ] Aviso legal, privacidad, cookies y condiciones revisados por un
      abogado
- [ ] `public/media/portada.mp4` con el clip de Giovanni
- [ ] Foto de Alex (`public/media/alex.jpg`)
- [ ] Prueba completa con una cuenta ficticia: alta → cuestionario →
      propuesta → revisión → rutina publicada → registro de sesión
