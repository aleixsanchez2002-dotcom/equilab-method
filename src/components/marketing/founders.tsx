import { getI18n } from "@/lib/i18n/server";
import { ImageSlot } from "@/components/media/image-slot";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
/* PLACEHOLDER: las bios de Giovanni y Alex están pendientes de validar con cada socio. */
export const equipo = [
    {
        name: "Giovanni Torrens",
        role: "Doma clásica",
        bio: "Jinete profesional de doma. La mirada que conecta cada ejercicio con lo que pasa en la pista.",
    },
    {
        name: "Alex Ricarte",
        role: "Fuerza",
        bio: "Ex culturista natural. Construye la base de fuerza que sostiene un asiento estable.",
    },
    {
        name: "Aleix Sánchez",
        role: "Análisis de rendimiento",
        bio: "Seguimiento del progreso para que cada variable del entrenamiento se traduzca en resultados reales.",
    },
];
export async function Founders() {
    const { t } = await getI18n();
    return (<section id="entrenadores" aria-labelledby="equipo-titulo" className="scroll-mt-20 px-[var(--gutter)] py-28 sm:py-36">
      <Reveal>
        <h2 id="equipo-titulo" className="font-display text-step-head text-night">
          {t("Tres miradas, un objetivo")}
        </h2>
      </Reveal>
      <Reveal delay={80}>
        <p className="mt-6 max-w-[46ch] font-serif text-step-lead text-night">
          {t("Lo que ves en la pista lo corrige quien entiende la pista. Lo que entrenas en el gimnasio lo programa quien vive el gimnasio.")}{" "}
          {t("Y lo que progresas lo analiza quien entiende los datos.")}
        </p>
      </Reveal>

      {/* Foto de Giovanni y, a su lado, el equipo completo en una loseta gris */}
      <div className="mt-16 grid gap-4 lg:mt-20 lg:grid-cols-12">
        <Reveal delay={120} className="lg:col-span-7 xl:col-span-8">
          <figure className="relative aspect-[4/3] h-full overflow-hidden bg-linen lg:aspect-auto lg:min-h-[560px]">
            <Parallax speed={0.1} className="absolute -inset-y-[6%] inset-x-0">
              <ImageSlot src="/media/giovanni.jpg" alt={t("Giovanni Torrens junto a su caballo")} spec="Retrato de Giovanni" sizes="(min-width: 1024px) 66vw, 100vw" imgClassName="photo-mono object-[50%_30%]"/>
            </Parallax>
          </figure>
        </Reveal>

        <Reveal delay={200} className="lg:col-span-5 xl:col-span-4">
          <ul className="flex h-full flex-col justify-between gap-10 bg-linen p-6 text-night sm:p-8">
            {equipo.map(({ name, role, bio }) => (<li key={name}>
                <h3 className="font-display text-step-lead">{name}</h3>
                <p className="mt-1 text-step-small font-semibold text-navy">{t(role)}</p>
                <p className="mt-3 max-w-[40ch] font-serif text-[17px] leading-relaxed text-night">{t(bio)}</p>
              </li>))}
          </ul>
        </Reveal>
      </div>
    </section>);
}
