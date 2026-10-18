import { getI18n } from "@/lib/i18n/server";
import { cn } from "@/lib/cn";
import { Boton, Loseta, Rotulo } from "./piezas";
import type { Mensaje, Plan } from "./tipos";

/**
 * Mensajes con el equipo (ADR-0014). Premium habla de su entrenamiento;
 * Básico, de su cuenta, su plan o problemas técnicos. Cada mensaje nuevo
 * avisa al equipo en Slack (#04-clientes), sin copiar el contenido.
 */
export async function PantallaMensajes({ mensajes, plan }: {
    mensajes: Mensaje[];
    plan: Plan;
}) {
    const { t } = await getI18n();
    return (<div className="grid gap-2 lg:grid-cols-12">
      <Loseta className="pt-8 sm:pt-10 lg:col-span-4 lg:self-start">
        <Rotulo className="text-slate">{t("Mensajes")}</Rotulo>
        <h1 className="mt-2 font-display text-step-head">{t("El equipo")}</h1>
        <p className="mt-5 max-w-[40ch] font-serif text-[17px] leading-relaxed">
          {plan === "premium"
            ? t("Escríbenos lo que necesites sobre tu entrenamiento. Te respondemos en menos de 24 h laborables.")
            : t("Escríbenos sobre tu cuenta, tu plan o cualquier problema con la web. Te respondemos en menos de 48 h laborables.")}
        </p>
        {plan === "basico" && (<p className="mt-4 text-step-small text-slate">{t("Las dudas sobre tu entrenamiento forman parte del plan Premium.")}</p>)}
      </Loseta>

      <section aria-labelledby="conversacion" className="flex flex-col gap-2 lg:col-span-8">
        <h2 id="conversacion" className="sr-only">{t("Conversación")}</h2>
        <ol className="grid gap-2">
          {mensajes.map((m) => (<li key={m.id} className={cn("max-w-[85%] p-4 sm:p-5", m.deEquipo ? "justify-self-start bg-linen" : "justify-self-end bg-night text-paper")}>
              <p className={cn("text-step-small font-semibold", m.deEquipo ? "text-slate" : "text-navy-soft")}>
                {m.autor} · {m.hora}
              </p>
              <p className="mt-1.5 font-serif text-[17px] leading-relaxed">{m.texto}</p>
            </li>))}
        </ol>
        <form className="sticky bottom-[5.5rem] flex gap-2 bg-paper pt-2 lg:bottom-2">
          <label htmlFor="mensaje" className="sr-only">{t("Tu mensaje")}</label>
          <textarea id="mensaje" rows={2} placeholder={t("Escribe tu mensaje…")} className="min-h-14 min-w-0 flex-1 resize-none bg-linen p-4 font-serif text-[17px] placeholder:text-slate/70 focus:outline-2 focus:outline-navy"/>
          <Boton className="shrink-0 self-stretch">{t("Enviar")}</Boton>
        </form>
      </section>
    </div>);
}
