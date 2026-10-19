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
    /** Descripción visible del contenido esperado mientras no exista el archivo. */
    spec: string;
    /** Relación de aspecto CSS, p. ej. "4 / 5". */
    aspect: string;
    sizes: string;
    priority?: boolean;
    className?: string;
    fallbackText?: string;
};
/**
 * Hueco de imagen autodocumentado: si el archivo existe en /public, renderiza
 * la foto con next/image; si no, muestra un marco elegante indicando qué foto
 * hay que dejar ahí y con qué nombre. Así el equipo puede ir soltando el
 * material real en public/media/ sin tocar código.
 */
export async function ImageSlot({ src, alt, aspect, sizes, priority = false, className, fallbackText, }: ImageSlotProps) {
    const { t } = await getI18n();
    const exists = fs.existsSync(path.join(process.cwd(), "public", src));
    if (exists) {
        return (<div className={cn("relative overflow-hidden rounded-sm", className)} style={{ aspectRatio: aspect }}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover"/>
      </div>);
    }
    return (<div role="img" aria-label={t("{0} (imagen pendiente)", { "0": alt })} className={cn("relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-sm", "border border-edge bg-ink-800 p-8 text-center", className)} style={{
            aspectRatio: aspect,
            background: "radial-gradient(100% 80% at 30% 100%, rgba(185,232,91,0.12) 0%, transparent 60%), var(--color-ink-800)",
        }}>
      <div aria-hidden="true" className="texture-grain absolute inset-0 opacity-50"/>
      {fallbackText ? (<span aria-hidden="true" className="relative font-display text-[clamp(4rem,12vw,10rem)] leading-none text-cognac-400">{fallbackText}</span>) : (<BitMark className="relative w-14 text-sand-100/15"/>)}
      <p className="relative max-w-[26ch] text-[12px] leading-relaxed text-sand-500">
        {alt}
      </p>

    </div>);
}
