import { getI18n } from "@/lib/i18n/server";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { IconoFlecha } from "./iconos";
import { Loseta, Rotulo } from "./piezas";
import type { Plan } from "./tipos";

const foco = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy";

/** Cuenta: plan, perfil, agenda (Premium), idioma y privacidad. */
export async function PantallaCuenta({ nombre, email, plan, renovacion, hrefAgenda, }: {
    nombre: string;
    email: string;
    plan: Plan;
    renovacion: string;
    hrefAgenda: string;
}) {
    const { t } = await getI18n();
    const filas: { titulo: string; detalle: string; href: string }[] = [
        { titulo: "Perfil", detalle: "Nombre, email y contraseña", href: "/app/cuenta" },
        ...(plan === "premium"
            ? [{ titulo: "Valoración 1:1", detalle: "Reserva o cambia tu videollamada con el equipo", href: hrefAgenda }]
            : []),
        { titulo: "Cuestionario", detalle: "Revisa tus respuestas: material, molestias y objetivos", href: "/app/cuestionario" },
        { titulo: "Idioma", detalle: "Español · English", href: "/app/cuenta" },
        { titulo: "Privacidad", detalle: "Descarga tus datos o pide que borremos tu cuenta", href: "/app/cuenta" },
    ];
    return (<div className="grid gap-2 lg:grid-cols-12">
      <Loseta className="pt-8 sm:pt-10 lg:col-span-5 lg:self-start">
        <Rotulo className="text-slate">{t("Cuenta")}</Rotulo>
        <h1 className="mt-2 font-display text-step-head">{nombre}</h1>
        <p className="mt-2 text-step-small text-slate">{email}</p>
        <div className={cn("mt-8 p-5", plan === "premium" ? "bg-navy text-paper" : "bg-paper")}>
          <p className={cn("text-step-small font-semibold", plan === "premium" ? "text-navy-soft" : "text-slate")}>{t("Tu plan")}</p>
          <p className="mt-1 font-display text-step-lead">
            {plan === "premium" ? "Premium" : t("Básico")}
            <span className="ml-2 text-[16px]">{plan === "premium" ? t("150 € / mes") : t("75 € / mes")}</span>
          </p>
          <p className={cn("mt-1 text-step-small", plan === "premium" ? "text-navy-soft" : "text-slate")}>{t("Se renueva el {0}. Sin permanencia.", { "0": renovacion })}</p>
          <Link href="/app/cuenta/plan" className={cn("mt-4 inline-block text-[15px] font-semibold underline underline-offset-4", foco)}>
            {plan === "premium" ? t("Gestionar el plan") : t("Pasar a Premium o gestionar el plan")}
          </Link>
        </div>
      </Loseta>

      <nav aria-label={t("Ajustes de la cuenta")} className="grid content-start gap-2 lg:col-span-7">
        {filas.map((f) => (<Link key={f.titulo} href={f.href} className={cn("press group flex items-center justify-between gap-4 bg-linen p-5 hover:bg-linen-deep sm:p-6", foco)}>
            <span>
              <span className="block text-[16px] font-semibold">{t(f.titulo)}</span>
              <span className="mt-1 block text-step-small text-slate">{t(f.detalle)}</span>
            </span>
            <IconoFlecha className="size-5 shrink-0"/>
          </Link>))}
        <form>
          <button type="submit" className={cn("press w-full cursor-pointer bg-paper p-5 text-left text-[16px] font-semibold text-wine hover:bg-linen sm:p-6", foco)}>
            {t("Cerrar sesión")}
          </button>
        </form>
      </nav>
    </div>);
}
