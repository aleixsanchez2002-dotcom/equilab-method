import { getI18n } from "@/lib/i18n/server";
import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { BitMark } from "@/components/brand/logo";
import { cn } from "@/lib/cn";
type ImageSlotProps = {
    /** Ruta dentro de /public, p. ej. "/media/hero.jpg". */
    src: string;
    alt: string;
    /** Descripción del contenido esperado mientras no exista el archivo. */
    spec: string;
    /** Relación de aspecto CSS, p. ej. "4 / 5". Sin ella, la imagen llena su contenedor. */
    aspect?: string;
    sizes: string;
    priority?: boolean;
    className?: string;
    /** Clases para la propia <img> (tratamiento, encuadre…). */
    imgClassName?: string;
    fallbackText?: string;
    /** Si el archivo no existe, no se pinta nada (en lugar del hueco señalizado). */
    optional?: boolean;
};
/**
 * Hueco de imagen autodocumentado: si el archivo existe en /public, renderiza
 * la foto con next/image; si no, muestra un marco que indica qué foto falta.
 * Así el equipo puede ir dejando el material real en public/media/ sin tocar código.
 */
export async function ImageSlot({ src, alt, aspect, sizes, priority = false, className, imgClassName, fallbackText, optional = false, }: ImageSlotProps) {
    const { t } = await getI18n();
    const exists = fs.existsSync(path.join(process.cwd(), "public", src));
    const style = aspect ? { aspectRatio: aspect } : undefined;
    if (exists) {
        return (<div className={cn("relative overflow-hidden", !aspect && "h-full w-full", className)} style={style}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={cn("object-cover", imgClassName)}/>
      </div>);
    }
    if (optional)
        return null;
    return (<div role="img" aria-label={t("{0} (imagen pendiente)", { "0": alt })} className={cn("relative flex flex-col items-center justify-center gap-4 overflow-hidden bg-ink-800 p-8 text-center", !aspect && "h-full w-full", className)} style={style}>
      {fallbackText ? (<span aria-hidden="true" className="relative font-display text-[clamp(4rem,12vw,10rem)] leading-none text-cognac-500">{fallbackText}</span>) : (<BitMark className="relative w-14 text-sand-500/40"/>)}
      <p className="relative max-w-[26ch] text-[13px] leading-relaxed text-sand-500">
        {alt}
      </p>
    </div>);
}
