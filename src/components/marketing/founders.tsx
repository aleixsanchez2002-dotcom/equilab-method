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
        bio: "Exculturista natural. Construye la base de fuerza que sostiene un asiento estable.",
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
    return (<section id="entrenadores" className="scroll-mt-24 bg-ink-950 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Overline>{t("El equipo")}</Overline>
              <h2 className="section-heading mt-6 font-display text-sand-50">{t("QUIÉN ESTÁ DETRÁS")}<em className="block text-cognac-300">{t("DEL MÉTODO.")}</em>
              </h2>
            </div>
            <p className="max-w-sm text-base leading-relaxed text-sand-500">{t("Equitación, preparación física y tecnología. Tres formas de aportar a un entrenamiento que puedes llevar contigo.")}</p>
          </div>
        </Reveal>

        {/* Hasta 1024 px, filas con la foto pequeña; desde ahí, tres columnas
            con la foto grande. Tres columnas a 768 px dejaban 208 px por persona. */}
        <div className="mt-10 grid gap-8 sm:mt-14 lg:grid-cols-3 lg:gap-10">
          {founders.map(({ name, role, bio, photo, spec, instagram }, i) => (<Reveal key={name} delay={i * 70}>
              <article className="group flex items-start gap-5 lg:block">
                <div className="w-24 shrink-0 overflow-hidden rounded-2xl sm:w-32 lg:w-auto">
                  <div className="transition-transform duration-500 ease-out group-hover:scale-[1.03]">
                    <ImageSlot src={photo} alt={`${name} — ${t(role)}`} spec={spec} fallbackText={name.split(" ").map((part) => part[0]).join("")} aspect="1 / 1" sizes="(min-width: 1024px) 30vw, 128px"/>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="lg:mt-6 lg:border-t lg:border-edge lg:pt-5 lg:transition-colors lg:duration-250 lg:group-hover:border-cognac-500/40">
                    <h3 className="font-display text-xl text-sand-50">{t(name)}</h3>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-sand-500">{t(role)}</p>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-sand-500 lg:mt-4">{t(bio)}</p>
                  <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-sand-300 underline-offset-4 transition-colors hover:text-cognac-300 hover:underline lg:mt-4">
                    @{instagram}<span aria-hidden="true">↗</span>
                  </a>
                </div>
              </article>
            </Reveal>))}
        </div>
      </div>
    </section>);
}
