/**
 * En qué semana del bloque va el cliente, contando desde que se publicó.
 * Se queda dentro del rango del mesociclo: no adelanta más allá del final.
 */
export function semanaDelBloque(
  startedOn: string | null,
  totalSemanas: number,
): number {
  if (!startedOn || totalSemanas <= 0) return 1;
  const inicio = new Date(`${startedOn}T00:00:00`).getTime();
  if (Number.isNaN(inicio)) return 1;
  const dias = Math.floor((Date.now() - inicio) / 86_400_000);
  return Math.min(Math.max(Math.floor(dias / 7) + 1, 1), totalSemanas);
}

/** El lunes de la semana de `fecha`, como ISO yyyy-mm-dd. */
export function lunesDeLaSemana(fecha: Date): string {
  const d = new Date(fecha);
  const dia = d.getDay(); // 0 = domingo … 6 = sábado
  d.setDate(d.getDate() - ((dia + 6) % 7));
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}
