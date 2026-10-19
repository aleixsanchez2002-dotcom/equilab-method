import { getI18n } from "@/lib/i18n/server";
import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { equipo } from "@/components/marketing/founders";
import { Aparecer } from "@/components/motion/aparecer";
import { Antetitulo, Contenedor, TituloPista } from "./piezas";

/* Foto de cada integrante. Las que aún no existen se sustituyen por sus
   iniciales; basta con dejar el archivo en public/media/ para que salga. */
const FOTOS: Record<string, string> = {
    "Giovanni Torrens": "/media/giovanni.jpg",
    "Alex Ricarte": "/media/alex.jpg",
    "Aleix Sánchez": "/media/aleix.jpg",
};
const existe = (rel: string) => fs.existsSync(path.join(process.cwd(), "public", rel));
const iniciales = (nombre: string) => nombre.split(" ").map((p) => p[0]).join("").slice(0, 2);

/** El equipo: tres tarjetas con foto, rol en cuero y una línea de bio. */
export async function EquipoPista() {
    const { t } = await getI18n();
    return (<section id="entrenadores" aria-labelledby="equipo-titulo" className="scroll-mt-20 bg-white py-24 sm:py-32">
      <Contenedor>
        <div>
          <Aparecer><Antetitulo>{t("El equipo")}</Antetitulo></Aparecer>
          <Aparecer retraso={100}>
            <TituloPista id="equipo-titulo" className="mt-5">{t("Tres miradas, un objetivo")}</TituloPista>
          </Aparecer>
        </div>

        <ul className="mt-16 grid gap-5 md:grid-cols-3">
          {equipo.map(({ name, role, bio }, i) => {
            const foto = FOTOS[name];
            return (<Aparecer as="li" key={name} retraso={i * 140} className="pista-tarjeta">
                <div className="pista-foto relative aspect-[4/5] overflow-hidden rounded-[28px] bg-arena">
                  {foto && existe(foto) ? (<Image src={foto} alt={name} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover object-[50%_25%]"/>) : (<span aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-[96px] font-light tracking-[-0.04em] text-cuero">
                      {iniciales(name)}
                    </span>)}
                </div>
                <h3 className="mt-6 text-[22px] font-semibold tracking-[-0.01em]">{name}</h3>
                <p className="mt-1 text-[15px] font-semibold text-cuero">{t(role)}</p>
                <p className="mt-3 max-w-[40ch] text-[16px] leading-relaxed text-humo">{t(bio)}</p>
              </Aparecer>);
        })}
        </ul>
      </Contenedor>
    </section>);
}
