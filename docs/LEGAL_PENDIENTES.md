# Borradores legales: preparación y cierre

Estado: **borrador para revisión**, 20 de octubre de 2026. El usuario ha solicitado preparar los textos y completar después los datos. No son políticas definitivas ni acreditan por sí solas cumplimiento normativo.

## Archivos y revisión

- `/legal`: índice, fuentes oficiales y estado visible de borrador.
- `/legal/aviso-legal`, `/legal/privacidad`, `/legal/condiciones`, `/legal/cookies`: textos ES/EN en `src/lib/legal/documents.json`.
- `src/lib/legal/index.ts`: identidad pública pendiente, versión de borrador y precios tomados de `PLAN_PRICES`.
- Cabecera de borrador también al imprimir; rutas con `noindex, nofollow`. El usuario autoriza el 20 de octubre de 2026 desplegar la propuesta con el aviso de borrador visible. No publicar como políticas definitivas hasta cerrar los datos y decisiones descritos aquí. `noindex` no es una barrera de acceso: no incluir secretos en estos textos.

## Identidad y actividad

Completar persona o entidad que presta y factura el servicio, NIF, domicilio de contacto, correo real de atención y derechos y teléfono público de atención. No reutilizar los teléfonos privados Premium. Determinar las obligaciones registrales, profesionales y autonómicas aplicables a la preparación física; incorporar registro, titulación o autorización cuando corresponda. Confirmar tratamiento fiscal, precio final con impuestos, contenido del plan, plazo de entrega y tiempos de atención. No inventar una sociedad, colegiación o actividad sanitaria.

## Privacidad: texto y funcionamiento deben coincidir

Identificar responsable y equipo autorizado; confirmar si existen corresponsables y su acuerdo. Revisar minimización de preguntas y obligatoriedad del teléfono. Documentar finalidades, bases del art. 6 y consentimiento explícito de salud del art. 9 RGPD. Confirmar necesidad y proporcionalidad de exigirlo para registrarse; no confundir lectura de privacidad con consentimiento.

Cerrar plazos concretos de cuenta, respuestas, registros, vídeos y logs, procedimiento de baja/supresión, bloqueo legal y rotación de copias. Habilitar atención de derechos y retirada del consentimiento, verificar identidad de forma proporcionada y evaluar cómo continuar o cerrar el entrenamiento tras retirarlo. No prometer borrado instantáneo de copias ni anonimización sin un proceso real.

Revisar contratos de encargo con Vercel y Supabase, subencargados, ubicaciones y garantías de transferencias. La base principal está en Irlanda, pero eso no demuestra que toda la cadena de tratamiento permanezca en el EEE. Añadir los proveedores de pagos, SMTP o vídeos antes de enviarles datos. Referencias de proveedor: https://supabase.com/legal/customer-resources/data-processing-addendum y https://vercel.com/legal/dpa .

Definir canal privado, acceso, información a las personas grabadas, conservación y borrado de vídeos. El cuestionario no sube vídeos: no describir un almacén de vídeo ya operativo. El uso publicitario requiere autorización distinta. Definir y aplicar admisión de menores y representación contractual; el umbral de consentimiento de datos de 14 años no equivale a capacidad contractual.

## Contratación y cobros

Actualmente no hay pago online ni renovación automática. Antes de cobrar: información precontractual, precio total, duración, cancelación, corrección de errores, aceptación expresa, botón inequívoco de obligación de pago, confirmación en soporte duradero y copia de condiciones aceptadas. Incorporar evidencias/versionado de la aceptación que realmente se implemente.

Preparar baja y desistimiento accesibles, reembolsos, modelo de desistimiento y, cuando resulte exigible, función electrónica de desistimiento. Comprobar normativa consolidada y transposición de la Directiva (UE) 2023/2673 al activar la contratación. Personalizar una rutina no permite excluir automáticamente los 14 días de desistimiento de servicios. Si el cliente pide comenzar antes: petición expresa e información exigida; prorrata solo cuando proceda. La pérdida del derecho por prestación completa requiere los presupuestos legales. No aplicar sin más la excepción de bienes personalizados.

No se ha modificado `POLICY_VERSION`, el registro de consentimientos ni los históricos: estos borradores no sustituyen una política aceptada. Al cerrar la información real, decidir nueva versión, comunicación y nueva autorización cuando proceda; conservar evidencia histórica. La aceptación de condiciones y el consentimiento de salud son distintos; publicidad separada, voluntaria y sin premarcar si algún día se añade. Una frase «al continuar aceptas privacidad» no sustituye estos mecanismos.

## Cookies

Inventario del código: `equilab_locale` (365 días), cookies de sesión Supabase `sb-<proyecto>-auth-token` y fragmentos, y verificador PKCE cuando corresponda. SDK instalado: máximo de cookie 400 días, distinto de la vigencia efectiva de sesión. No se ha detectado analítica ni píxeles o reproductores externos incrustados; los enlaces externos no son embeds.

Contrastar con navegador en dominio definitivo y recorridos de acceso, recuperación y cierre de sesión; revisar también cookies de infraestructura. Registrar nombre, responsable/proveedor, finalidad, duración y transferencias si existen. Las necesarias y preferencias solicitadas no requieren fabricar un «aceptar todo». Si se añade analítica o publicidad no exenta: bloqueo previo, información, aceptar/rechazar igualmente accesibles, opciones por finalidad y retirada sencilla. Revisar también otros almacenamientos y terceros al cambiar integraciones.

## Fuentes de redacción

- LSSI, arts. 10, 22.2, 27 y 28: https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758
- RGPD, especialmente arts. 6, 9, 13, 15–22, 28, 32 y 44–49: https://www.boe.es/doue/2016/119/L00001-00088.pdf
- LOPDGDD: https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673
- Consumo, información y contratación a distancia, desistimiento: https://www.boe.es/buscar/act.php?id=BOE-A-2007-20555
- AEPD, guía de cookies: https://www.aepd.es/guias/guia-cookies.pdf
- AEPD, derechos: https://www.aepd.es/derechos-y-deberes/ejerce-tus-derechos

Revisar con asesoría los datos y procesos efectivos antes de retirar el aviso de borrador. Mantener ambos idiomas sincronizados y volver a verificar cuando cambien proveedores o funciones.
