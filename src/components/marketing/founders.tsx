import { getI18n } from "@/lib/i18n/server";
import { ImageSlot } from "@/components/media/image-slot";
import { Reveal } from "@/components/motion/reveal";
import { Overline } from "@/components/ui/overline";
/* PLACEHOLDER: bios de una línea pendientes de validar con cada socio. */
const founders = [
    {
        name: "Giovanni Torrens",
        instagram: "giovannidressage",
        role: "Doma clásica",
        bio: "Jinete profesional de doma. La mirada que conecta cada ejercicio con lo que pasa en la pista.",
        photo: "/media/giovanni.jpg",
        spec: "FOTO GIOVANNI — retrato o montando. Vertical 4:5, mínimo 1200×1500 px.",
    },
    {
        name: "Alex Ricarte",
        instagram: "alex_ricarte.fit",
        role: "Fuerza",
        bio: "Ex culturista natural. Construye la base de fuerza que sostiene un asiento estable.",
        photo: "/media/alex.jpg",
        spec: "FOTO ALEX — retrato o entrenando. Vertical 4:5, mínimo 1200×1500 px.",
    },
    {
        name: "Aleix Sánchez",
        instagram: "aleix.sanchezz",
        role: "Desarrollo y experiencia digital",
        bio: "Da forma a la web para que el método sea fácil de seguir, dentro y fuera del gimnasio.",
        photo: "/media/aleix.jpg",
        spec: "Retrato de Aleix Sánchez.",
    },
];
export async function Founders() {
    const { t } = await getI18n();
    return (<section id="entrenadores" className="scroll-mt-24 bg-ink-950 py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Overline accent>{t("El equipo")}</Overline>
              <h2 className="section-heading mt-6 font-display text-sand-50">{t("TRES MIRADAS.")}<em className="block text-cognac-300">{t("UN MISMO OBJETIVO.")}</em>
              </h2>
            </div>
            <p className="max-w-sm text-[15px] leading-relaxed text-sand-500">{t("Equitación, preparación física y tecnología. Tres formas de aportar a un entrenamiento que puedes llevar contigo.")}</p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-10 md:grid-cols-3 sm:gap-6 lg:gap-10">
          {founders.map(({ name, role, bio, photo, spec, instagram }, i) => (<Reveal key={name} delay={i * 110}>
              <article className="group">
                <div className="overflow-hidden rounded-sm">
                  <div className="transition-transform duration-700 ease-out group-hover:scale-[1.03]">
                    <ImageSlot src={photo} alt={`${name} — ${t(role)}`} spec={spec} fallbackText={name.split(" ").map((part) => part[0]).join("")} aspect="1 / 1" sizes="(min-width: 768px) 30vw, 90vw"/>
                  </div>
                </div>
                <div className="mt-6 flex items-baseline justify-between gap-4 border-t border-edge pt-5 transition-colors duration-300 group-hover:border-cognac-500/40">
                  <div>
                    <h3 className="font-display text-xl text-sand-50">{t(name)}</h3>
                    <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.2em] text-cognac-400">{t(role)}</p>
                  </div>
                  <span className="font-display text-sm italic text-sand-600">
                    0{i + 1}
                  </span>
                </div>
                <p className="mt-4 text-[14px] leading-relaxed text-sand-500">{t(bio)}</p>
                <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-cognac-400 underline-offset-4 transition-colors hover:text-cognac-300 hover:underline">
                  @{instagram}<span aria-hidden="true">↗</span>
                </a>
              </article>
            </Reveal>))}
        </div>
      </div>
    </section>);
}
