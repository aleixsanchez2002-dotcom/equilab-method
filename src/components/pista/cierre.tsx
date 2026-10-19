import { getI18n } from "@/lib/i18n/server";
import Image from "next/image";
import Link from "next/link";
import { columns } from "@/components/marketing/footer";
import { BitMark } from "@/components/brand/logo";
import { Aparecer } from "@/components/motion/aparecer";
import { BotonPista, Contenedor } from "./piezas";

/** Llamada final: foto con velo y la palabra «Entrena» en grande. */
export async function CtaPista() {
    const { t } = await getI18n();
    return (<section aria-labelledby="cta-titulo" className="relative isolate overflow-hidden bg-carbon py-32 text-center text-white sm:py-44">
      <Image src="/media/pista.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover object-[50%_60%]"/>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/55"/>
      <Contenedor className="flex flex-col items-center">
        <Aparecer>
          <h2 id="cta-titulo" className="text-[clamp(4rem,14vw,11rem)] leading-[0.9] font-bold tracking-[-0.05em]">{t("Entrena")}</h2>
        </Aparecer>
        <Aparecer retraso={150}>
          <p className="mt-6 max-w-[46ch] text-[17px] leading-relaxed text-white/80">
            {t("Cuestionario de 10 minutos sobre tu postura, historial físico, material disponible y objetivos en la pista.")}
          </p>
        </Aparecer>
        <Aparecer retraso={300}>
          <BotonPista href="/acceso" className="mt-10">{t("Crear mi cuenta")}</BotonPista>
        </Aparecer>
      </Contenedor>
    </section>);
}

/** Pie sobre carbón: marca, columnas de enlaces y contacto. */
export async function FooterPista() {
    const { t, home } = await getI18n();
    return (<footer className="bg-carbon pt-20 pb-10 text-white">
      <Contenedor>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href={home} className="inline-flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              <BitMark className="w-12 shrink-0 text-cuero"/>
              <span className="flex flex-col leading-none">
                <span className="font-display text-[26px] font-semibold tracking-[0.04em] text-crema">EQUILAB</span>
                <span className="mt-2 font-display text-[9px] font-semibold tracking-[0.62em] text-cuero">METHOD</span>
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {columns.map(({ title, links }) => (<nav key={title} aria-label={t(title)}>
                <h2 className="text-[15px] font-semibold">{t(title)}</h2>
                <ul className="mt-4 grid gap-2.5">
                  {links.map(({ label, href }) => (<li key={label}>
                      <Link href={href.startsWith("/#") ? home + href.slice(1) : href} className="text-[15px] text-white/60 transition-colors hover:text-cuero">{t(label)}</Link>
                    </li>))}
                </ul>
              </nav>))}
            <div>
              <h2 className="text-[15px] font-semibold">{t("Contacto")}</h2>
              <ul className="mt-4 grid gap-2.5 text-[15px] text-white/60">
                <li>
                  <a href="https://instagram.com/giovannidressage" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-cuero">@giovannidressage</a>
                </li>
                <li>Giovanni Torrens</li>
                <li>Alex Ricarte</li>
                <li>Aleix Sánchez</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-16 border-t border-white/10 pt-8 text-[14px] text-white/45">{t("© 2026 Equilab Method. Todos los derechos reservados.")}</p>
      </Contenedor>
    </footer>);
}
