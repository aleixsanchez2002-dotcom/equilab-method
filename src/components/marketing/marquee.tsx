import { getI18n } from "@/lib/i18n/server";
/* Cinta editorial con vocabulario de doma — movimiento continuo muy lento,
   desactivado con prefers-reduced-motion. */
const words = [
    "Asiento",
    "Simetría",
    "Equilibrio",
    "Fuerza",
    "Movilidad",
    "Contacto",
    "Impulsión",
    "Reunión",
];
async function Sequence() {
    const { t } = await getI18n();
    return (<>
      {words.map((word) => (<span key={word} className="mx-6 inline-flex items-center gap-12 sm:mx-10">
          <span className="font-display text-2xl uppercase text-sand-300 sm:text-3xl">{t(word)}</span>
          <span aria-hidden="true" className="size-1 rounded-full bg-cognac-500/60"/>
        </span>))}
    </>);
}
export async function Marquee() {
    return (<div aria-hidden="true" className="relative overflow-hidden border-y border-edge bg-ink-900 py-5">
      <div className="marquee-track flex w-max whitespace-nowrap">
        <Sequence />
        <Sequence />
      </div>
      {/* Fundido en los bordes */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink-900 to-transparent"/>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink-900 to-transparent"/>
    </div>);
}
