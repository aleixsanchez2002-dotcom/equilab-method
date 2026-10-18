import { getI18n } from "@/lib/i18n/server";
import Link from "next/link";
import { ImageSlot } from "@/components/media/image-slot";
import { cn } from "@/lib/cn";
import { IconoFlecha, IconoPlay, IconoSubir } from "./iconos";
import { Boton, BotonEnlace, Loseta, Rotulo } from "./piezas";
import type { EnvioTecnica, EstadoEnvio } from "./tipos";

const foco = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy";

const estilosEstado: Record<EstadoEnvio, string> = {
    enviado: "bg-paper text-slate",
    en_revision: "bg-navy-soft text-navy",
    corregido: "bg-night text-paper",
};

async function EtiquetaEstado({ envio }: { envio: EnvioTecnica }) {
    const { t } = await getI18n();
    const texto = envio.estado === "corregido"
        ? t("Corregido")
        : envio.estado === "en_revision" ? t("En revisión") : t("Enviado");
    return <span className={cn("shrink-0 px-2.5 py-1 text-[13px] font-semibold", estilosEstado[envio.estado])}>{texto}</span>;
}

/** Hueco de vídeo: plano oscuro con el botón de reproducir y un rótulo. */
async function HuecoVideo({ rotulo, tono = "noche", className }: {
    rotulo: string;
    tono?: "noche" | "marino";
    className?: string;
}) {
    const { t } = await getI18n();
    return (<button type="button" aria-label={t("Reproducir: {0}", { "0": rotulo })} className={cn("press group relative flex cursor-pointer items-center justify-center text-paper", tono === "noche" ? "bg-night" : "bg-navy", foco, className)}>
      <span className="flex size-14 items-center justify-center bg-paper text-night transition-transform duration-200 group-hover:scale-105">
        <IconoPlay className="size-6"/>
      </span>
      <span className="absolute bottom-0 left-0 bg-paper px-3.5 py-2 text-[14px] font-semibold text-night">{rotulo}</span>
    </button>);
}

/** Técnica (Premium): los envíos del jinete y su estado. */
export async function PantallaTecnica({ envios, hrefEnviar, hrefEnvio, }: {
    envios: EnvioTecnica[];
    hrefEnviar: string;
    hrefEnvio: (id: string) => string;
}) {
    const { t } = await getI18n();
    return (<div className="grid gap-2 lg:grid-cols-12">
      <Loseta className="pt-8 sm:pt-10 lg:col-span-5 lg:self-start">
        <Rotulo className="text-slate">{t("Técnica")}</Rotulo>
        <h1 className="mt-2 font-display text-step-head">{t("Tus vídeos")}</h1>
        <p className="mt-5 max-w-[40ch] font-serif text-[17px] leading-relaxed">
          {t("Graba un ejercicio y el equipo te responde con otro vídeo: qué corregir, cómo hacerlo y algún truco. En menos de 48 h laborables.")}
        </p>
        <BotonEnlace href={hrefEnviar} className="mt-8 w-full">{t("Enviar un vídeo")}</BotonEnlace>
        <p className="mt-4 text-step-small text-slate">{t("Los vídeos se borran a los 6 meses.")}</p>
      </Loseta>

      <section aria-labelledby="envios" className="grid content-start gap-2 lg:col-span-7">
        <h2 id="envios" className="sr-only">{t("Tus envíos")}</h2>
        {envios.map((envio) => (<Link key={envio.id} href={hrefEnvio(envio.id)} className={cn("press group flex items-center gap-4 bg-linen p-3 pr-5 hover:bg-linen-deep", foco)}>
            <span aria-hidden="true" className={cn("flex aspect-[4/3] w-24 shrink-0 items-center justify-center sm:w-32", envio.estado === "corregido" ? "bg-navy" : "bg-night")}>
              <IconoPlay className="size-6 text-paper"/>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[16px] font-semibold">{t(envio.ejercicio)}</span>
              <span className="mt-1 block text-step-small text-slate">
                {envio.fecha} · {envio.duracion}
                {envio.plazo && <> · {t("respuesta antes del {0}", { "0": envio.plazo })}</>}
              </span>
            </span>
            <EtiquetaEstado envio={envio}/>
          </Link>))}
      </section>
    </div>);
}

/** Enviar un vídeo: elegir ejercicio, grabar o subir, nota y envío. */
export async function PantallaEnviarVideo({ ejercicios, seleccionado, primerVideo, subiendo, hrefVolver, }: {
    ejercicios: string[];
    seleccionado: string;
    /** El primer envío pide el consentimiento específico (imagen y salud). */
    primerVideo: boolean;
    /** Progreso de la subida (0…1) o null si aún no se ha enviado. */
    subiendo: number | null;
    hrefVolver: string;
}) {
    const { t } = await getI18n();
    return (<form className="grid gap-2 lg:grid-cols-12">
      <Loseta className="pt-8 sm:pt-10 lg:col-span-5 lg:self-start">
        <Link href={hrefVolver} className={cn("text-step-small font-semibold text-navy", foco)}>{t("← Tus vídeos")}</Link>
        <h1 className="mt-4 font-display text-step-head">{t("Enviar un vídeo")}</h1>
        <p className="mt-5 max-w-[40ch] font-serif text-[17px] leading-relaxed">
          {t("Grábate de lado y de cuerpo entero, con buena luz. Basta con una o dos series.")}
        </p>
      </Loseta>

      <div className="grid content-start gap-2 lg:col-span-7">
        <fieldset className="bg-linen p-5 sm:p-6">
          <legend className="float-left mb-4 w-full text-[17px] font-semibold">{t("1 · ¿Qué ejercicio?")}</legend>
          <div className="grid clear-both gap-1 sm:grid-cols-2">
            {ejercicios.map((nombre) => (<label key={nombre} className={cn("flex cursor-pointer items-center gap-3 px-4 py-3.5 text-[15px] font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-navy", nombre === seleccionado ? "bg-night text-paper" : "bg-paper hover:bg-linen-deep")}>
                <input type="radio" name="ejercicio" value={nombre} defaultChecked={nombre === seleccionado} className="sr-only"/>
                {t(nombre)}
              </label>))}
          </div>
        </fieldset>

        <div className="bg-linen p-5 sm:p-6">
          <p className="text-[17px] font-semibold">{t("2 · Tu vídeo")}</p>
          <label className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-3 bg-paper px-6 py-10 text-center hover:bg-linen-deep has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-navy">
            <IconoSubir className="size-8"/>
            <span className="text-[16px] font-semibold">{t("Grabar o elegir un vídeo")}</span>
            <span className="text-step-small text-slate">{t("Hasta 2 minutos")}</span>
            <input type="file" accept="video/*" capture="environment" className="sr-only"/>
          </label>
        </div>

        <div className="bg-linen p-5 sm:p-6">
          <label htmlFor="nota" className="text-[17px] font-semibold">{t("3 · ¿Algo que debamos mirar?")} <span className="font-normal text-slate">{t("(opcional)")}</span></label>
          <textarea id="nota" rows={3} placeholder={t("Por ejemplo: noto que la rodilla se me va hacia dentro.")} className="mt-4 w-full resize-y bg-paper p-4 font-serif text-[17px] placeholder:text-slate/70 focus:outline-2 focus:outline-navy"/>
        </div>

        {primerVideo && (<label className="flex cursor-pointer gap-3 bg-linen p-5 text-[15px] leading-relaxed sm:p-6">
            <input type="checkbox" required className="mt-1 size-5 shrink-0 accent-navy"/>
            <span>{t("Acepto que el equipo de Equilab vea mis vídeos para corregir mi técnica. Se guardan de forma privada y se borran a los 6 meses.")}</span>
          </label>)}

        {subiendo === null ? (<Boton className="w-full">{t("Enviar vídeo")}</Boton>) : (<div role="status" className="relative overflow-hidden bg-navy p-5 text-paper sm:p-6">
            <span aria-hidden="true" className="absolute inset-y-0 left-0 bg-navy-deep" style={{ width: `${Math.round(subiendo * 100)}%` }}/>
            <p className="relative flex items-baseline justify-between gap-4">
              <span className="text-[17px] font-semibold">{t("Subiendo tu vídeo…")}</span>
              <span className="font-display text-step-lead tabular-nums">{Math.round(subiendo * 100)} %</span>
            </p>
            <p className="relative mt-2 text-step-small text-navy-soft">{t("Si se corta la conexión, la subida sigue sola al volver.")}</p>
          </div>)}
      </div>
    </form>);
}

/** Detalle de un envío corregido: la respuesta del entrenador manda. */
export async function PantallaCorreccion({ envio, hrefVolver, hrefRutina, }: {
    envio: EnvioTecnica;
    hrefVolver: string;
    hrefRutina: string;
}) {
    const { t } = await getI18n();
    const r = envio.respuesta;
    return (<div className="grid gap-2 lg:grid-cols-12">
      <div className="grid content-start gap-2 lg:col-span-7">
        <Loseta className="pt-8 sm:pt-10">
          <Link href={hrefVolver} className={cn("text-step-small font-semibold text-navy", foco)}>{t("← Tus vídeos")}</Link>
          <div className="mt-4 flex items-start justify-between gap-4">
            <h1 className="font-display text-step-head">{t(envio.ejercicio)}</h1>
            <EtiquetaEstado envio={envio}/>
          </div>
          <p className="mt-2 text-step-small text-slate">{t("Enviado el {0}", { "0": envio.fecha })}</p>
        </Loseta>
        {r && <HuecoVideo tono="marino" rotulo={t("Respuesta de {0} · {1}", { "0": r.autor, "1": r.duracion })} className="aspect-video"/>}
        {r && (<Loseta>
            <Rotulo className="text-slate">{t("En resumen")}</Rotulo>
            <p className="mt-3 max-w-[56ch] font-serif text-[18px] leading-relaxed">{r.resumen}</p>
          </Loseta>)}
      </div>

      <div className="grid content-start gap-2 lg:col-span-5">
        <HuecoVideo rotulo={t("Tu vídeo · {0}", { "0": envio.duracion })} className="aspect-[16/10]"/>
        {r && r.comentarios.length > 0 && (<section aria-labelledby="comentarios" className="bg-linen p-5 sm:p-6">
            <h2 id="comentarios" className="text-[17px] font-semibold">{t("Sobre tu vídeo")}</h2>
            <ol className="mt-4 grid gap-3">
              {r.comentarios.map((c) => (<li key={c.segundo} className="flex gap-3">
                  <button type="button" className={cn("press h-fit shrink-0 cursor-pointer bg-night px-2 py-1 text-[13px] font-semibold text-paper tabular-nums hover:bg-navy", foco)}>
                    <span className="sr-only">{t("Ir al segundo")} </span>{c.segundo}
                  </button>
                  <span className="font-serif text-[17px] leading-snug">{c.texto}</span>
                </li>))}
            </ol>
          </section>)}
        {r?.correctivo && (<Link href={hrefRutina} className={cn("press group flex items-center justify-between gap-4 bg-navy p-5 text-paper hover:bg-navy-deep sm:p-6", foco)}>
            <span>
              <span className="block text-step-small font-semibold text-navy-soft">{t("Añadido a tu rutina")}</span>
              <span className="mt-1 block font-display text-step-lead">{t(r.correctivo)}</span>
            </span>
            <IconoFlecha className="size-6 shrink-0"/>
          </Link>)}
        {envio.nota && (<Loseta>
            <Rotulo className="text-slate">{t("Tu nota")}</Rotulo>
            <p className="mt-2 font-serif text-[17px] leading-relaxed">{envio.nota}</p>
          </Loseta>)}
      </div>
    </div>);
}

/** Técnica en el plan Básico: explica el servicio, sin insistir (ADR-0016). */
export async function PantallaTecnicaBasico({ hrefPremium }: {
    hrefPremium: string;
}) {
    const { t } = await getI18n();
    const pasos = [
        ["Te grabas", "Un ejercicio de tu rutina, de lado y de cuerpo entero."],
        ["Lo revisamos", "El equipo mira tu vídeo con la técnica de la pista en la cabeza."],
        ["Te respondemos en vídeo", "Qué corregir, cómo hacerlo y algún truco. En menos de 48 h laborables."],
    ] as const;
    return (<div className="grid gap-2 lg:grid-cols-12">
      <Loseta className="pt-8 sm:pt-10 lg:col-span-7">
        <Rotulo className="text-slate">{t("Técnica · incluida en Premium")}</Rotulo>
        <h1 className="mt-2 max-w-[16ch] font-display text-step-head">{t("Que te corrijan la técnica, en vídeo")}</h1>
        <ol className="mt-8 grid gap-2 sm:grid-cols-3">
          {pasos.map(([titulo, texto], i) => (<li key={titulo} className="bg-paper p-5">
              <span className="font-display text-step-lead text-navy">{i + 1}</span>
              <p className="mt-3 text-[16px] font-semibold">{t(titulo)}</p>
              <p className="mt-1 text-step-small text-slate">{t(texto)}</p>
            </li>))}
        </ol>
        <BotonEnlace href={hrefPremium} className="mt-8 w-full sm:w-auto sm:min-w-72">{t("Ver el plan Premium")}</BotonEnlace>
        <p className="mt-4 text-step-small text-slate">{t("Plazas limitadas: cada jinete Premium tiene seguimiento directo del equipo.")}</p>
      </Loseta>
      <div className="relative aspect-[4/3] overflow-hidden bg-linen lg:col-span-5 lg:aspect-auto">
        <ImageSlot src="/media/giovanni.jpg" alt={t("Giovanni Torrens junto a su caballo")} spec="" sizes="(min-width: 1024px) 40vw, 100vw" imgClassName="photo-mono object-[50%_30%]"/>
      </div>
    </div>);
}
