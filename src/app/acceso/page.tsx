import { getI18n } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { PantallaAcceso } from "@/components/auth/pantalla-acceso";
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getI18n();
    return {
        title: t("Iniciar sesión — Equilab Method"),
        description: t("Entra en tu cuenta de Equilab Method.")
    };
}
/** Acceso para clientes que ya tienen cuenta. */
export default function AccesoPage() {
    return <PantallaAcceso mode="login"/>;
}
