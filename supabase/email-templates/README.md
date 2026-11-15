# Correos de cuenta de Equilab Method

Estado: plantillas preparadas; no activadas en el proyecto alojado. Falta verificar un dominio propio y conectar SMTP. No copiar claves SMTP al repositorio.

Cada correo incluye español e inglés para atender también a usuarios antiguos que no tienen idioma en sus metadatos. Los asuntos están en `subjects.json`. La bienvenida está integrada en la confirmación de cuenta: no se envía un segundo correo de bienvenida ni se afirma que el cliente tenga un plan activo.

## Activación en Supabase

1. Verificar el dominio elegido con el proveedor de envío (SPF/DKIM y la política DMARC que corresponda). Configurar un remitente del dominio y un buzón o Reply-To atendido por el equipo.
2. En Authentication → Emails → SMTP Settings, conectar el proveedor. Desactivar el seguimiento de enlaces para los mensajes de autenticación; conservar los enlaces originales y la confirmación de correo.
3. Guardar una copia privada de las plantillas existentes antes de sustituirlas.
4. Copiar asunto y HTML en Confirm sign up (`confirmation.html`), Reset password (`recovery.html`) y Change email address (`email-change.html`). `{{ .ConfirmationURL }}` conserva los enlaces firmados y el flujo PKCE que usa la aplicación.
5. Password changed (`password-changed.html`) es un aviso de seguridad independiente: configurar su plantilla y habilitar esa notificación cuando el servicio de correo esté listo. Su enlace abre la recuperación y no contiene un token.
6. Confirmar Site URL y los Redirect URLs públicos y locales configurados. No cambiar duraciones ni inventar caducidades en el texto de los correos.
7. Probar con cuentas de prueba autorizadas: alta y confirmación, recuperación y contraseña nueva, enlace caducado/usado, cambio de correo y aviso de contraseña cambiada. Abrir los enlaces PKCE en el navegador que inició el proceso. Revisar móvil, Gmail, Outlook y Apple Mail; comprobar entrega y spam. No usar datos reales de clientes para pruebas.
8. Comprobar que los usuarios no pueden acceder a cuentas ajenas ni a contactos Premium sin acceso vigente.

La revisión en navegador solo comprueba el aspecto HTML; no acredita entrega ni compatibilidad real con todos los clientes de correo. No hay envíos de prueba automáticos en este cambio. Los enlaces y capturas de previsualización deben usar datos ficticios.

Documentación oficial: https://supabase.com/docs/guides/auth/auth-email-templates y https://supabase.com/docs/guides/auth/auth-smtp.
