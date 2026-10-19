/** Filas que la app lee con más frecuencia (espejo del esquema SQL). */

export type RolUsuario = "cliente" | "coach" | "admin";

export type EstadoSuscripcion =
  | "incomplete"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled";

export interface Profile {
  id: string;
  full_name: string;
  role: RolUsuario;
}

export interface Plan {
  code: string;
  name: string;
  price_cents: number;
}

export interface Subscription {
  plan_code: string;
  status: EstadoSuscripcion;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

/** Regla de acceso acordada: activa o periodo pagado aún vigente. */
export function tieneAccesoVigente(sub: Subscription | null): boolean {
  if (!sub) return false;
  if (sub.status === "active") return true;
  return sub.current_period_end !== null && new Date(sub.current_period_end) > new Date();
}
