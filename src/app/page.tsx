import { Correcciones } from "@/components/marketing/correcciones";
import { Faq } from "@/components/marketing/faq";
import { FinalCta } from "@/components/marketing/final-cta";
import { Footer } from "@/components/marketing/footer";
import { Founders } from "@/components/marketing/founders";
import { Hero } from "@/components/marketing/hero";
import { Method } from "@/components/marketing/method";
import { Nav } from "@/components/marketing/nav";
import { Plans } from "@/components/marketing/plans";
import { Steps } from "@/components/marketing/steps";
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
    return (<div className="marketing">
      <Nav sesion={sesion}/>
      <main className="marketing-main">
        <Hero />
        <Method />
        <Correcciones />
        <Steps />
        <Founders />
        <Plans />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>);
}
export async function generateMetadata() {
    const { locale } = await getI18n();
    return { alternates: { canonical: locale === "en" ? "/en" : "/", languages: { es: "/", en: "/en", "x-default": "/" } } };
}
