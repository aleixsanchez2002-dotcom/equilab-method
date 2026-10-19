import { getI18n } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { PantallaAcceso } from "@/components/auth/pantalla-acceso";
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getI18n();
    return {
        title: t("Crear cuenta — Equilab Method"),
        description: t("Crea tu cuenta en Equilab Method.")
    };
}
/** Alta de cuentas nuevas: aquí llevan todos los botones de «Empezar». */
export default function RegistroPage() {
    return <PantallaAcceso mode="register"/>;
}
