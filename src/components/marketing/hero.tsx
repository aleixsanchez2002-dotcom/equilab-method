import { getI18n } from "@/lib/i18n/server";
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ImageSlot } from "@/components/media/image-slot";
/**
 * Vídeo de la loseta principal. Basta con dejar el archivo en public/media/
 * (portada.mp4, y si se quiere también portada.webm y portada-poster.jpg):
 * aparece solo, sin tocar código. Mientras no exista, la loseta muestra el
 * retrato de Giovanni con un acercamiento muy lento.
 */
const VIDEO = "/media/portada.mp4";
const VIDEO_WEBM = "/media/portada.webm";
const POSTER = "/media/portada-poster.jpg";
const existe = (rel: string) => fs.existsSync(path.join(process.cwd(), "public", rel));
async function LosetaVideo() {
    const { t } = await getI18n();
    const hayVideo = existe(VIDEO);
    return (<Link href="/acceso/registro" aria-label={t("Empezar mi entrenamiento")} className="press group relative block aspect-[4/3] overflow-hidden bg-night focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy lg:aspect-auto">
      {hayVideo ? (<>
          {/* Imagen fija debajo: es lo que se ve si el sistema pide menos movimiento */}
          <ImageSlot src={existe(POSTER) ? POSTER : "/media/giovanni.jpg"} alt="" spec="" sizes="(min-width: 1024px) 50vw, 100vw" imgClassName="photo-mono"/>
          <video className="hero-video photo-mono absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata" poster={existe(POSTER) ? POSTER : undefined} aria-hidden="true">
            {existe(VIDEO_WEBM) && <source src={VIDEO_WEBM} type="video/webm"/>}
            <source src={VIDEO} type="video/mp4"/>
          </video>
        </>) : (<div className="slow-zoom absolute inset-0" aria-hidden="true">
          <ImageSlot src="/media/giovanni.jpg" alt="" spec="" sizes="(min-width: 1024px) 50vw, 100vw" imgClassName="photo-mono object-[50%_30%]"/>
        </div>)}

      {/* Única etiqueta de la loseta: abajo a la izquierda, con la flecha */}
      <span className="absolute bottom-0 left-0 flex items-center gap-4 bg-navy px-5 py-4 text-[16px] font-semibold text-paper transition-colors duration-200 group-hover:bg-navy-deep sm:px-6 sm:py-5">
        {t("Empezar mi entrenamiento")}
        <svg viewBox="0 0 32 32" aria-hidden="true" className="size-6 shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1">
          <path d="M8 24 24 8M11 8h13v13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square"/>
        </svg>
      </span>
    </Link>);
}
/**
 * Portada en tablero de dos por dos: el nombre, dos fotografías de Giovanni
 * y una loseta de vídeo que lleva a empezar. Sin degradados ni contornos:
 * cada loseta es un plano de color o de imagen.
 */
export async function Hero() {
    const { t } = await getI18n();
    return (<section aria-labelledby="portada" className="board">
      {/* Nombre: el lema arriba en negrita y «Equilab» un poco por encima del borde */}
      <div className="@container flex min-h-[34svh] flex-col justify-between gap-8 bg-paper p-4 sm:p-6 lg:min-h-0 lg:bg-linen">
        <p data-rise style={{ "--i": 0 } as CSSProperties} className="tagline font-bold whitespace-nowrap text-night">
          {t("Preparación física para jinetes profesionales")}
        </p>
        <h1 id="portada" className="mb-2 font-display text-[clamp(5rem,22vw,8rem)] sm:mb-3 lg:mb-4 leading-[0.86] tracking-[-0.05em] text-night lg:text-step-display">
          <span className="mask-line"><span>Equilab</span></span>
          <span className="sr-only">{t(" Method: preparación física para jinetes profesionales")}</span>
        </h1>
      </div>

      {/* Fotografía principal: se abre como un obturador al cargar */}
      <figure className="shutter relative aspect-[4/3] overflow-hidden bg-linen lg:aspect-auto">
        <ImageSlot src="/media/hero.jpg" alt={t("Giovanni Torrens a caballo en una competición de doma clásica")} spec="Fotografía de Giovanni en pista" sizes="(min-width: 1024px) 50vw, 100vw" priority imgClassName="photo-mono object-[60%_18%]"/>
      </figure>

      {/* Segunda fotografía, mismo tratamiento (en móvil, al final del tablero) */}
      <figure className="relative order-last aspect-[4/3] overflow-hidden bg-linen lg:order-none lg:aspect-auto">
        <ImageSlot src="/media/pista.jpg" alt={t("Jinete y caballo durante una sesión en la pista")} spec="Entrenamiento en pista" sizes="50vw" imgClassName="photo-mono object-[50%_55%]"/>
      </figure>

      <LosetaVideo />
    </section>);
}
