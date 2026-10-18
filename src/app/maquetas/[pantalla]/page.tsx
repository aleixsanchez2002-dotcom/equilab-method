import { notFound } from "next/navigation";
import type { Plan } from "@/components/area/tipos";
import { Maqueta, PANTALLAS, type IdPantalla } from "../maqueta";

/** Maqueta de una pantalla. Solo existe en desarrollo (`npm run dev`). */
export default async function PaginaMaqueta({ params, searchParams, }: {
    params: Promise<{ pantalla: string }>;
    searchParams: Promise<{ plan?: string }>;
}) {
    if (process.env.NODE_ENV === "production")
        notFound();
    const { pantalla } = await params;
    const { plan } = await searchParams;
    if (!PANTALLAS.some((p) => p.id === pantalla))
        notFound();
    const elegido: Plan = plan === "basico" ? "basico" : "premium";
    return <Maqueta pantalla={pantalla as IdPantalla} plan={elegido}/>;
}
