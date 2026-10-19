import { CorreccionesPista } from "@/components/pista/correcciones";
import { BandaPista } from "@/components/pista/banda";
import { CtaPista, FooterPista } from "@/components/pista/cierre";
import { EquipoPista } from "@/components/pista/equipo";
import { FaqPista } from "@/components/pista/faq";
import { HeroPista } from "@/components/pista/hero";
import { MetodoPista } from "@/components/pista/metodo";
import { NavPista } from "@/components/pista/nav";
import { PasosPista } from "@/components/pista/pasos";
import { PlanesPista } from "@/components/pista/planes";
import { getI18n } from "@/lib/i18n/server";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { createSupabaseServer } from "@/lib/supabase/server";
export default async function Home() {
    // La portada reconoce a quien ya ha entrado y le ofrece su área.
    // (Los CTA de alta apuntan a /acceso/registro y «Iniciar sesión» a
    // /acceso; ambas redirigen a /app si ya hay sesión.)
    let sesion = false;
    if (supabaseConfigurado) {
        const supabase = await createSupabaseServer();
        const { data: { user }, } = await supabase.auth.getUser();
        sesion = user !== null;
    }
    // Variante «Pista» de la portada (docs/propuestas/diseno-pista.md). La
    // portada actual sigue en src/components/marketing/ y en la rama main.
    return (<div className="pista">
      <NavPista sesion={sesion}/>
      <main>
        <HeroPista />
        <MetodoPista />
        <BandaPista />
        <CorreccionesPista />
        <PasosPista />
        <EquipoPista />
        <PlanesPista />
        <FaqPista />
        <CtaPista />
      </main>
      <FooterPista />
    </div>);
}
export async function generateMetadata() {
    const { locale } = await getI18n();
    return { alternates: { canonical: locale === "en" ? "/en" : "/", languages: { es: "/", en: "/en", "x-default": "/" } } };
}
