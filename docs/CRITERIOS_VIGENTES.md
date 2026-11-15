# Criterios vigentes de Equilab Method

Base aprobada por Giovanni el 19 de octubre de 2026. Este documento es la referencia de producto, diseño y funcionamiento para los futuros cambios. Sustituye las maquetas, propuestas y criterios anteriores. Solo una nueva decisión explícita del equipo puede modificar esta base; debe actualizarse aquí en el mismo cambio de código.

## Producto y equipo

Preparación física para jinetes: fuerza, movilidad y control corporal aplicados a la equitación. La web debe ser sencilla e intuitiva para el cliente y para quienes preparan sus rutinas.

- Giovanni Torrens: equitación, redes y marca. Instagram: `giovannidressage`.
- Alex Ricarte: preparación física y rutinas. Instagram: `alex_ricarte.fit`.
- Aleix Sánchez: web y experiencia digital. Instagram: `aleix.sanchezz`.
- Cuenta del proyecto: `equilab_method`. El contacto general apunta a esta cuenta.

## Identidad visual

- Fondo grafito `#141719`, superficies `#1b1f22` / `#252b2e`.
- Blanco roto `#f4f5ef` y acento lima `#b9e85b`.
- Archivo Black para títulos; Archivo para lectura y controles.
- Usar los tokens de `src/app/globals.css`. Los nombres heredados `cognac-*` representan el lima actual: no justifican volver a colores marrones.
- Títulos claros, jerarquía visible, tarjetas sencillas y espacio suficiente. Mantener la identidad aprobada, sin añadir otra plantilla o rediseño general por iniciativa propia.
- Fotografía real y pertinente. No recuperar la antigua imagen de pista como elemento central del método ni las maquetas HTML retiradas.
- Sin desbordamiento horizontal en móvil. Botones cómodos, etiquetas accesibles, buen contraste y estados de carga, error y vacío comprensibles.

## Idiomas y contenidos

La portada existe en español (`/`) e inglés (`/en`). El idioma también se aplica a acceso y zona privada mediante la cookie de idioma y `src/lib/i18n/`. Todo texto nuevo de interfaz debe incluir su traducción.

Cambiar idioma debe conservar ruta, sección y cliente seleccionado. Las respuestas escritas por usuarios y los identificadores almacenados no se traducen ni se modifican. Las opciones conservan sus valores internos para que el motor de rutinas siga funcionando.

La portada conserva método, equipo de tres personas, planes y comparación, preguntas frecuentes y acceso. Evitar repetir el discurso comercial dentro del entrenamiento.

## Planes

Tarifas mensuales públicas: **Básico 40 €** y **Premium 80 €**. Fuente del código: `src/lib/plans.ts`. Mantener sincronizada la tabla `plans` mediante las migraciones de Supabase; no duplicar tarifas en los componentes.

Básico: cuestionario, propuesta semi-personalizada revisada por el equipo, biblioteca de ejercicios y registro/progreso. Premium: valoración individual, rutina personalizada, seguimiento y contacto directo.

Los números de teléfono Premium se configuran en variables de entorno privadas del servidor. Solo se renderizan para quien tenga Premium vigente. No incluirlos en el repositorio, documentación pública, portada, paquetes del navegador ni variables `NEXT_PUBLIC_*`.

## Experiencia del cliente

- Navegación principal: Inicio, Mi rutina, Progreso y Cuenta. En móvil, navegación inferior.
- Inicio indica el siguiente paso: elegir plan, responder cuestionario, esperar preparación o abrir su rutina.
- Rutina presenta semanas, días, ejercicios, técnica, objetivos por serie y registro de kg, repeticiones, RIR y descanso.
- El registro de una sesión no debe confundirse con su prescripción. Cada día de cada semana se completa una sola vez: el envío persiste en solo lectura, con sus valores y fecha, y se corrige mediante Modificar registro. Las correcciones conservan la sesión original y no duplican el historial. El siguiente entrenamiento es el primer día pendiente del mesociclo, no una semana calculada solo por fecha. Al completarlo se espera una nueva rutina del equipo; no se reinicia automáticamente.
- Progreso separa las cargas, el historial y el peso corporal; no convertir el peso en el objetivo principal de todos los clientes.
- Cuenta agrupa perfil, plan y contacto. Los estados sin acceso o sin rutina deben explicarse sin bloquear la página.

## Trabajo del equipo

Las cuentas del equipo acceden al panel sin contratar un plan de cliente. El panel permite buscar y filtrar clientes, identificar rutinas por crear o revisar y abrir la edición directamente.

Cada miembro del equipo puede crear y organizar sus propias rutinas en `/admin/mi-rutina`, y entrenar y registrar su progreso en `/app` sin contratar una suscripción ni cambiar su rol. Se distinguen borradores y rutinas publicadas; las rutinas propias no se incluyen en los recuentos de clientes. Los registros siguen vinculados al usuario autenticado.

El editor permite organizar semanas y días, copiar días y ejercicios, reordenar ejercicios y aplicar la primera serie a las demás. Guardar borrador y publicar son acciones distintas: el cliente solo ve rutinas publicadas. No sustituir una edición existente por datos de ejemplo.

Las rutinas nuevas incluyen una explicación base editable con pautas de fuerza y referencias PubMed verificadas. Es una guía general, no un óptimo universal ni evidencia específica de mejora de la equitación. La sobrecarga progresiva se explica con un ejemplo de repeticiones y carga: aumentar kilos al completar el rango con el RIR y la técnica indicados, sin imponer una subida semanal ni garantizar hipertrofia. La prescripción concreta de cada ejercicio prevalece; el equipo debe ajustar el texto antes de publicar. No modifica series ni descansos automáticamente ni sobrescribe explicaciones de rutinas existentes, aunque estén vacías. La base sin editar dispone de versión inglesa; los textos personalizados se conservan tal como se escriben.

## Cuestionario inicial

Versión vigente: **v3**, definida en `src/lib/questionnaire.ts` y publicada en la tabla versionada `questionnaire_templates`.

Hasta 33 preguntas en cinco bloques: perfil, técnica a caballo, preparación física, salud/antecedentes y objetivos/disponibilidad. Añadir revisión final, opciones rápidas, preguntas abiertas útiles, campos opcionales identificados y preguntas condicionales. Mantener las respuestas al retroceder entre pasos; se guardan al enviar, no durante la vista previa.

La v3 elimina la pregunta de fortalezas, ofrece respuestas explícitas sin problemas, distingue el desequilibrio en el lado derecho o izquierdo y añade ejemplos de correcciones del entrenador. Al final recoge un teléfono de contacto validado y privado, visible en la ficha del cliente. En Básico se contacta si hace falta ampliar información; en Premium el equipo contacta para completar la valoración y solicitar un vídeo compitiendo (o acordar uno entrenando si no compite). El formulario no sube vídeos ni envía mensajes automáticamente.

Validar también en el servidor: sesión, acceso vigente, plantilla activa, campos necesarios, opciones permitidas, números, tamaño y selecciones excluyentes. No guardar respuestas a preguntas que no correspondan por sus condiciones.

Conservar versiones y respuestas anteriores. Nunca cambiar las preguntas de una versión ya respondida. Las futuras versiones deben incrementar su número y publicarse de manera explícita. La ficha del cliente agrupa respuestas por bloque con las etiquetas de su plantilla original.

El motor Básico solo prepara borradores. Respetar disponibilidad y material y señalar al equipo las restricciones que requieren revisión. No generar diagnósticos ni interpretar el cuestionario como una valoración médica. Las rutinas requieren revisión humana antes de publicarse.

## Datos y permisos

- Navegación de cliente: cargar solo los datos necesarios por sección y ejecutar lecturas independientes en paralelo. Mantener estados de carga y recuperación de errores sin compartir cachés de datos privados entre clientes. Vercel se ejecuta en Irlanda (`dub1`), junto a la base Supabase actual.

Mantener Supabase Auth, autorización en el servidor y políticas RLS. No exponer datos de salud o contacto por ocultación visual únicamente. No guardar cuestionarios en almacenamiento local persistente ni registrar sus respuestas en logs.

No versionar `.env.local`, claves, credenciales, sesiones, datos reales de clientes, copias de bases de datos ni artefactos de depuración. Las imágenes públicas aprobadas de marca sí forman parte del proyecto.

## Estado real de las integraciones

- Supabase: perfiles, suscripciones, cuestionarios, rutinas y registros.
- Los pagos con tarjeta y la gestión automática de suscripciones siguen pendientes; la activación de planes es manual.
- Correos de cuenta: plantillas bilingües en `supabase/email-templates/`; pendientes de verificar dominio, conectar SMTP, activarlas y probar la entrega real. La bienvenida forma parte de la confirmación; no activa un plan de pago.
- La agenda de videollamadas aún no está conectada.
- No describir una integración pendiente como si estuviera operativa.

## Cómo cambiar esta base

El repositorio compartido del equipo es `https://github.com/aleixsanchez2002-dotcom/equilab-method`, bajo la cuenta de Aleix. Por indicación de Giovanni, los cambios locales se entregan en la rama `giovanni/cambios-locales`, sin modificar `main` ni hacer `pull`. El repositorio de `JonyQuin` es una copia distinta: subir cambios allí no los incorpora al repositorio de Aleix.

1. Partir de `main` vigente y leer este documento y `AGENTS.md`.
2. Hacer un cambio concreto, conservando las funciones aprobadas y los datos existentes.
3. Actualizar traducciones y migraciones cuando corresponda.
4. Ejecutar `npm run lint` y `npm run build`. Probar los recorridos afectados y la vista móvil; añadir pruebas significativas para validación o permisos.
5. Compartir el cambio en una rama y una pull request; integrar en `main` después de revisarlo.
6. Actualizar este documento si el equipo modifica un criterio. Las antiguas ramas, ZIP o maquetas no son una fuente válida para recuperar criterios descartados.

## Textos legales en preparación

Aviso legal, privacidad, condiciones y cookies se preparan en español e inglés como borradores visibles, con identidad y decisiones operativas pendientes. El usuario autoriza el 20 de octubre de 2026 publicar estos cambios conservando su aviso visible de borrador y los datos pendientes. No presentarlos como definitivos hasta completar esos datos y revisar los procesos de `docs/LEGAL_PENDIENTES.md`. El inventario de cookies debe reflejar el uso real; no añadir consentimiento ficticio para analítica inexistente. Conservar consentimientos históricos y separar información de privacidad, consentimiento de salud y aceptación contractual.
