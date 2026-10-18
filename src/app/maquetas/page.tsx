import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PANTALLAS } from "./maqueta";

export const metadata: Metadata = { title: "Maquetas del área de cliente", robots: { index: false } };

/**
 * Índice de maquetas del área de cliente (fase 1 de
 * docs/propuestas/area-cliente.md). Solo en desarrollo: en producción no
 * existe. Panel interno, solo en español.
 */
export default function IndiceMaquetas() {
    if (process.env.NODE_ENV === "production")
        notFound();
    return (<main className="min-h-dvh bg-paper p-2 text-night">
      <div className="bg-linen p-6 pt-10 sm:p-10">
        <p className="text-step-small font-semibold text-slate">Fase 1 · datos de ejemplo, sin conectar</p>
        <h1 className="mt-2 font-display text-step-head">Maquetas del área de cliente</h1>
        <p className="mt-5 max-w-[60ch] font-serif text-[17px] leading-relaxed">
          Cada pantalla existe en las dos versiones del plan. Mírala también en el móvil (o estrecha la ventana): la barra de pestañas baja al pie de la pantalla.
        </p>
      </div>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {(["premium", "basico"] as const).map((plan) => (<section key={plan} className="bg-linen p-6 sm:p-8">
            <h2 className="font-display text-step-lead">{plan === "premium" ? "Premium" : "Básico"}</h2>
            <ul className="mt-5 grid gap-1">
              {PANTALLAS.map((p) => (<li key={p.id}>
                  <Link href={plan === "basico" ? `/maquetas/${p.id}?plan=basico` : `/maquetas/${p.id}`} className="press flex items-center justify-between bg-paper px-5 py-3.5 text-[16px] font-semibold hover:bg-linen-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy">
                    {p.nombre}
                    <span aria-hidden="true">→</span>
                  </Link>
                </li>))}
            </ul>
          </section>))}
      </div>
    </main>);
}
