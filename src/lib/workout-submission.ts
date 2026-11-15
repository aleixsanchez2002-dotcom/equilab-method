export type SerieHecha = { kg: string; reps: string; rir: string; descanso: string };
export type EntradaEjercicio = { routine_exercise_id: string; exercise_id: string; series: SerieHecha[] };
export type RegistroInput = { routine_day_id: string; revision: number | null; entradas: EntradaEjercicio[] };
export type SesionEnviada = { id: string; completed_at: string; revision: number; entradas: EntradaEjercicio[] };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const serieConDatos = (s: SerieHecha) => Object.values(s).some(v => v.trim() !== "");
/** Validación compartida; conserva posiciones de series parcialmente vacías. */
export function validarRegistro(value: unknown): RegistroInput | null {
  if (!value || typeof value !== "object") return null;
  const p = value as RegistroInput;
  if (typeof p.routine_day_id !== "string" || !uuid.test(p.routine_day_id) || !(p.revision === null || Number.isSafeInteger(p.revision) && p.revision >= 1) || !Array.isArray(p.entradas) || p.entradas.length > 40) return null;
  const ids = new Set<string>();
  const entradas: EntradaEjercicio[] = [];
  for (const e of p.entradas) {
    if (!e || !uuid.test(e.routine_exercise_id) || !uuid.test(e.exercise_id) || ids.has(e.routine_exercise_id) || !Array.isArray(e.series) || e.series.length > 30) return null;
    ids.add(e.routine_exercise_id);
    const series: SerieHecha[] = [];
    for (const s of e.series) {
      if (!s || [s.kg,s.reps,s.rir,s.descanso].some(v => typeof v !== "string" || v.length > 40)) return null;
      const n = { kg:s.kg.trim(), reps:s.reps.trim(), rir:s.rir.trim(), descanso:s.descanso.trim() };
      if ((n.kg && (!/^\d+(?:[.,]\d+)?$/.test(n.kg) || Number(n.kg.replace(",",".")) > 1500)) || (n.reps && (!/^\d+$/.test(n.reps) || +n.reps > 1000)) || (n.rir && (!/^\d+$/.test(n.rir) || +n.rir > 10))) return null;
      series.push(n);
    }
    if (series.some(serieConDatos)) entradas.push({routine_exercise_id:e.routine_exercise_id,exercise_id:e.exercise_id,series});
  }
  return entradas.length ? {routine_day_id:p.routine_day_id,revision:p.revision,entradas} : null;
}
export function siguienteDia<T extends { id: string }>(semanas: {week:number;dias:T[]}[], completados: ReadonlySet<string>) {
  for (let semana=0;semana<semanas.length;semana++) for (let dia=0;dia<semanas[semana].dias.length;dia++) if (!completados.has(semanas[semana].dias[dia].id)) return {semana,dia};
  return null;
}
