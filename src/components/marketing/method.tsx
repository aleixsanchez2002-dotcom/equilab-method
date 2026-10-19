import { getI18n } from "@/lib/i18n/server";
import { Reveal } from "@/components/motion/reveal";
import { Overline } from "@/components/ui/overline";

const pillars = [
  { title: "Entender cómo montas", text: "Tu postura, tu nivel y tus objetivos en la pista son el punto de partida. El cuestionario nos ayuda a conocer lo que necesitas trabajar." },
  { title: "Construir tu base", text: "Fuerza específica, movilidad y estabilidad de core y cadera. Trabajo fuera de la silla para acompañar mejor el movimiento del caballo." },
  { title: "Entrenar con dirección", text: "Una rutina revisada por el equipo, ejercicios claros y un registro de sesiones para seguir tu evolución. Tú entrenas; nosotros damos estructura." },
];
const foundations = [
  { title: "FUERZA", detail: "Una base que te sostiene.", index: "01", width: "w-12" },
  { title: "MOVILIDAD", detail: "Más libertad de movimiento.", index: "02", width: "w-20" },
  { title: "CONTROL", detail: "Estabilidad sin rigidez.", index: "03", width: "w-28" },
];

export async function Method() {
  const { t } = await getI18n();
  return (
    <section id="metodo" className="light-section scroll-mt-24 bg-ink-950 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <Reveal className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-20">
          <div><Overline accent>{t("El método / Equilab")}</Overline><h2 className="section-heading mt-6 font-display text-sand-50">{t("TU CUERPO.")}<br />{t("TU MEJOR AYUDA.")}</h2></div>
          <p className="max-w-lg text-base leading-relaxed text-sand-500 sm:text-lg">{t("El entrenamiento de un jinete merece un enfoque propio. Conectamos lo que trabajas fuera de la silla con lo que necesitas dentro de la pista.")}</p>
        </Reveal>
        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal className="rounded-2xl border border-edge bg-ink-900 p-6 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cognac-400">{t("EL TRABAJO FUERA DE LA SILLA")}</p>
            <p className="mt-5 max-w-sm font-display text-3xl leading-tight text-sand-50 sm:text-4xl">{t("NO ES ENTRENAR MÁS.")}<br />{t("ES ENTRENAR CON SENTIDO.")}</p>
            <div className="mt-9 space-y-5">
              {foundations.map(({title, detail, index, width}) => (
                <div key={title} className="border-t border-edge pt-5">
                  <div className="flex items-center justify-between gap-4"><h3 className="text-sm font-semibold tracking-wider text-sand-100">{t(title)}</h3><span className="text-xs text-sand-600">{index}</span></div>
                  <p className="mt-2 text-sm text-sand-500">{t(detail)}</p>
                  <span aria-hidden="true" className={`mt-4 block h-1 ${width} rounded-full bg-cognac-400`} />
                </div>
              ))}
            </div>
          </Reveal>
          <div>{pillars.map(({ title, text }, i) => <Reveal key={title} delay={i * 80}><article className="grid grid-cols-[auto_1fr] gap-5 border-t border-edge py-7"><span className="font-display text-xl text-cognac-400">0{i + 1}</span><div><h3 className="text-lg font-semibold text-sand-100">{t(title)}</h3><p className="mt-3 text-[15px] leading-relaxed text-sand-500">{t(text)}</p></div></article></Reveal>)}</div>
        </div>
      </div>
    </section>
  );
}
