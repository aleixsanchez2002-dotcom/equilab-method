/** Texto editorial de partida: no modifica la prescripción de los ejercicios. */
export const EXPLICACION_BASE = `CÓMO TRABAJAMOS ESTE BLOQUE
Estas son nuestras pautas generales de fuerza. Sigue las series, repeticiones, RIR y descansos indicados en cada ejercicio: si difieren de esta guía, manda tu rutina. El equipo adapta el trabajo a tu nivel, material, recuperación y sesiones a caballo.

1. DESCANSOS
En las series exigentes de fuerza usamos unos 3 minutos como referencia para recuperar el rendimiento. Si sigues fatigado, descansa más. Si vas justo de tiempo, podemos acortarlos en ejercicios menos exigentes, vigilando que no caigan las repeticiones ni la técnica. Los descansos largos pueden ayudar a mantener el trabajo; no existe una recuperación máxima de las fibras garantizada a los 3 minutos.
PubMed — PMID: 39205815; PMID: 26605807.

2. SERIES Y FRECUENCIA
Como punto de partida, podemos programar 4–10 series de trabajo por grupo muscular a la semana, repartidas en dos sesiones cuando tu disponibilidad lo permita. No son 4–10 series por sesión ni un máximo universal: ajustamos el volumen según tu respuesta y contamos también el trabajo indirecto. Dos sesiones facilitan el reparto; con el mismo volumen, no son necesariamente superiores para ganar músculo.
PubMed — PMID: 41343037; PMID: 30558493.

3. REPETICIONES
En muchos ejercicios de fuerza utilizamos 6–12 repeticiones por serie como rango práctico. No es el único rango eficaz: las cargas y repeticiones cambian según el objetivo, el ejercicio y tu experiencia. La movilidad, el equilibrio y los ejercicios por tiempo siguen su propia prescripción.
PubMed — PMID: 28834797.

4. ESFUERZO Y RIR
RIR significa repeticiones en reserva: las que podrías completar todavía con buena técnica. Habitualmente buscamos 1–2 RIR; 0 RIR significa que no podrías hacer otra repetición completa. Acercarse al fallo puede favorecer la hipertrofia, pero no hace falta llegar siempre a él. Reservamos el 0 RIR para situaciones seleccionadas y personas con experiencia; al empezar o aprender un movimiento dejamos más margen.
PubMed — PMID: 38970765; PMID: 36334240.

5. ELECCIÓN DE EJERCICIOS
Cuando el material y el objetivo lo permiten, podemos priorizar máquinas por su estabilidad y facilidad para ajustar la carga. También usamos pesos libres, poleas y autocargas según tus necesidades. Los estudios no muestran una superioridad general de las máquinas para ganar músculo; la fuerza mejora especialmente en los movimientos que practicas.
PubMed — PMID: 37582807.

6. CALENTAMIENTO
Antes de las series de trabajo, practica el movimiento con cargas ligeras y sube gradualmente. Las series de aproximación no cuentan como series de trabajo.

7. SOBRECARGA PROGRESIVA: CÓMO AVANZAR ENTRE SEMANAS
Buscamos aumentar poco a poco las repeticiones o los kilos a medida que te adaptas, manteniendo la técnica y el RIR indicado. Registra cada sesión y compárala con las anteriores. Con la misma carga, avanza hacia el límite superior del rango; cuando lo completes en todas las series con el RIR previsto, prioriza subir los kilos en un pequeño paso disponible. Es normal que al subir el peso bajen las repeticiones, siempre dentro del rango pautado. Ambas formas de progresar pueden favorecer el desarrollo muscular: más kilos no son automáticamente mejores que más repeticiones.
Ejemplo orientativo para 8–12 repeticiones: empiezas con 40 kg × 10; después consigues 40 kg × 11–12; cuando completas todas las series a 12 con el RIR indicado, pruebas 42 kg × 8–10, si ese incremento está disponible y puedes mantener el control. No son semanas obligatorias: repetir una carga o reducirla por fatiga también puede ser lo adecuado. No fuerces una subida cada semana ni la interpretes como garantía de ganar músculo.
PubMed — PMID: 36199287; PMID: 19204579.

8. ADAPTADO A TU VIDA COMO JINETE
Organiza el trabajo junto con la montura y las competiciones. Si acumulas fatiga, empeora tu técnica o aparece dolor, avisa al equipo para ajustar la sesión. Esta base se apoya en estudios generales de fuerza e hipertrofia: no demuestra por sí sola una mejora específica sobre el caballo.`;

/** Una revisión conserva incluso una explicación vacía intencionadamente. */
export function explicacionInicial(esRevision: boolean, guardada?: string | null): string {
  return esRevision ? (guardada ?? "") : EXPLICACION_BASE;
}
