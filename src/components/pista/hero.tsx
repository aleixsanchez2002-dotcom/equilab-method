import { getI18n } from "@/lib/i18n/server";
import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import type { CSSProperties } from "react";
import { BotonPista } from "./piezas";

const VIDEO = "/media/portada.mp4";
const existe = (rel: string) => fs.existsSync(path.join(process.cwd(), "public", rel));

/**
 * Portada de la variante «Pista»: foto a pantalla completa con un velo
 * oscuro del 45 %, el lema grande en el centro y dos botones de píldora.
 * La foto se acerca muy despacio al cargar y el texto sube escalonado.
 * Si existe public/media/portada.mp4, el vídeo ocupa el lugar de la foto.
 */
export async function HeroPista() {
    const { t } = await getI18n();
    const hayVideo = existe(VIDEO);
    return (<section aria-labelledby="portada" className="relative isolate flex min-h-[640px] h-[100svh] items-center justify-center overflow-hidden bg-carbon text-white">
      <div aria-hidden="true" className="pista-acercar absolute inset-0 -z-20">
        {hayVideo ? (<video className="h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata" poster="/media/hero.jpg">
            <source src={VIDEO} type="video/mp4"/>
          </video>) : (<Image src="/media/hero.jpg" alt="" fill priority sizes="100vw" className="object-cover object-[62%_22%]"/>)}
      </div>
      {/* Velo plano: legibilidad sin degradados (la foto es muy luminosa) */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/55"/>

      <div className="mx-auto flex max-w-[980px] flex-col items-center px-5 pt-16 text-center">
        <h1 id="portada" style={{ "--i": 0 } as CSSProperties} className="pista-entra text-[clamp(2.5rem,6.4vw,5.25rem)] leading-[1.04] font-bold tracking-[-0.025em] text-balance">
          {t("Preparación física para jinetes profesionales")}
        </h1>
        <div style={{ "--i": 1 } as CSSProperties} className="pista-entra mt-10 flex flex-wrap justify-center gap-4">
          <BotonPista href="/acceso/registro">{t("Empezar mi entrenamiento")}</BotonPista>
          <BotonPista href="#metodo" tono="contorno" flecha={false}>{t("Ver el método")}</BotonPista>
        </div>
      </div>

      {/* Instagram en vertical, abajo a la izquierda, como en la referencia */}
      <a href="https://instagram.com/giovannidressage" target="_blank" rel="noopener noreferrer" style={{ "--i": 2 } as CSSProperties} className="pista-entra absolute bottom-10 left-5 hidden items-center gap-3 text-[13px] font-semibold tracking-[0.18em] text-white/70 uppercase transition-colors hover:text-white sm:left-8 md:flex md:flex-col">
        <span className="[writing-mode:vertical-rl] rotate-180">Instagram</span>
        <span aria-hidden="true" className="h-10 w-px bg-white/50"/>
      </a>

      <div aria-hidden="true" className="absolute inset-x-0 bottom-10 hidden justify-center md:flex">
        <span style={{ "--i": 2 } as CSSProperties} className="pista-entra text-[13px] font-semibold tracking-[0.18em] text-white/60 uppercase">
          {t("Desliza")}
        </span>
      </div>
    </section>);
}
