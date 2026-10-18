import { getI18n } from "@/lib/i18n/server";
import Image from "next/image";
import { Parallax } from "@/components/motion/parallax";

/** Banda de imagen a sangre entre secciones, con un parallax suave. */
export async function BandaPista() {
    const { t } = await getI18n();
    return (<section aria-label={t("Giovanni Torrens junto a su caballo")} className="relative h-[56svh] min-h-[380px] overflow-hidden bg-carbon">
      <Parallax speed={0.18} className="absolute -inset-y-[14%] inset-x-0">
        <Image src="/media/giovanni.jpg" alt={t("Giovanni Torrens junto a su caballo")} fill sizes="100vw" className="object-cover object-[50%_52%]"/>
      </Parallax>
      <div aria-hidden="true" className="absolute inset-0 bg-black/20"/>
      <p className="absolute bottom-6 left-5 text-[13px] font-semibold tracking-[0.18em] text-white/80 uppercase sm:left-8">
        Giovanni Torrens · {t("Doma clásica")}
      </p>
    </section>);
}
