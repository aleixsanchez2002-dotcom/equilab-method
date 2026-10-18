# Supabase — puesta en marcha (10 minutos)

Pasos para Giovanni/el equipo. Solo hay que hacerlo una vez.

## 1. Crear el proyecto

1. Entra en [supabase.com](https://supabase.com) y crea una cuenta (con el email del equipo).
2. **New project** → nombre `equilab-method` → contraseña de base de datos
   (guárdala en un gestor de contraseñas) → **Region: Europe (Frankfurt) —
   eu-central-1**. La región es importante: RGPD y datos de salud.

## 2. Ejecutar las migraciones

En el panel de Supabase: **SQL Editor → New query**. Copia el contenido de
cada archivo de `migrations/`, pégalo y pulsa **Run**, en orden:

| Archivo | Qué añade |
| --- | --- |
| `0001_esquema.sql` | Todas las tablas, la seguridad por filas y los consentimientos |
| `0002_datos_iniciales.sql` | Planes, biblioteca de ejercicios y cuestionario v1 |
| `0003_panel_equipo.sql` | Email en el perfil y altas de acceso manuales |
| `0004_motor_cuestionario.sql` | Permisos del motor de rutinas |
| `0005_arreglo_motor.sql` | *(opcional: ya incluido en 0004)* |
| `0006_peso_cuenta_explicacion.sql` | Peso corporal semanal e información del bloque |
| `0007_mesociclos.sql` | Semanas dentro de la rutina |
| `0008_actividad_cliente.sql` | Actividad del cliente |
| `0009_confirmacion_email.sql` | Confirmación de correo |

**De la 0003 en adelante se pueden repetir sin miedo**: si ya estaban
aplicadas, no dan error ni duplican nada. Las dos primeras solo se ejecutan
una vez (al repetirlas dirán que las tablas ya existen, y no pasa nada:
significa que el trabajo ya estaba hecho).

> Un error del tipo `already exists` nunca rompe nada. Solo dice que esa
> parte ya estaba en su sitio.

## 3. Copiar las claves al proyecto

En **Project Settings → API**, localiza la URL y la clave pública (anon). Copia `.env.example` como `.env.local` y completa:

- `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto de pruebas.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: clave pública anon del proyecto de pruebas.

La aplicación actual no utiliza `service_role`. No compartas claves secretas por Slack. La vista pública funciona sin `.env.local`.

## 4. Ajustes de autenticación

En **Authentication → URL Configuration**:
- Site URL: `http://localhost:3000` (cambiará al dominio real al desplegar).

## 5. Marcar a los tres socios como equipo

Cada socio se registra primero en la app (pestaña «Crear cuenta»). Después,
en el SQL Editor:

```sql
update public.profiles set role = 'admin'
where id in (select id from auth.users
             where email in ('email-giovanni@…', 'email-aleix@…', 'email-alex@…'));
```

Con eso los tres tenéis cuenta individual con acceso total al panel.
