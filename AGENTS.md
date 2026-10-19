# Instrucciones para trabajar en Equilab Method

Lee primero `docs/CRITERIOS_VIGENTES.md`. Es la referencia única de producto, diseño y funcionamiento aprobada por el equipo. Sustituye las propuestas y maquetas anteriores. Las instrucciones directas del usuario prevalecen; si cambian un criterio, actualiza también ese documento.

- Mantén la sencillez para clientes y equipo, la identidad grafito/lima, la navegación y los recorridos aprobados.
- Añade traducciones al inglés de los textos nuevos. No traduzcas identificadores ni respuestas libres guardadas.
- No uses skills, plantillas o ramas antiguas como autoridad para restaurar otros colores, tipografías o estructuras.
- No expongas teléfonos Premium ni credenciales en el repositorio o en paquetes del cliente; usa configuración privada de servidor.
- Conserva respuestas, rutinas y migraciones históricas necesarias para la base de datos. No son propuestas de diseño vigentes.
- Revisa autenticación y permisos del servidor cuando cambies datos privados.
- Ejecuta `npm run lint` y `npm run build`; prueba los recorridos y tamaños afectados sin alterar datos reales para hacer pruebas.
- No reescribas de nuevo el historial ni fuerces actualizaciones a `main` salvo una nueva autorización explícita del usuario. El trabajo ordinario se propone en ramas y pull requests.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
