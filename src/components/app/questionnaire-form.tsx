"use client";
import { useI18n } from "@/components/i18n/provider";
import { useActionState } from "react";
import { responderCuestionario, type CuestionarioEstado, } from "@/app/app/cuestionario/actions";
import { Button } from "@/components/ui/button";
export type PreguntaCuestionario = {
    id: string;
    tipo: "select" | "multiselect" | "texto";
    texto: string;
    opciones?: string[];
};
const estadoInicial: CuestionarioEstado = {};
/** Opción tipo chip: input nativo oculto (accesible) + etiqueta estilizada. */
function Opcion({ pregunta, opcion, tipo, }: {
    pregunta: string;
    opcion: string;
    tipo: "radio" | "checkbox";
}) {
    const { t } = useI18n();
    return (<label className="cursor-pointer">
      <input type={tipo} name={pregunta} value={opcion} required={tipo === "radio"} className="peer sr-only"/>
      <span className={"inline-block rounded-xs border border-edge px-4 py-2.5 text-[13.5px] text-sand-300 " +
            "transition-colors duration-150 hover:border-edge-strong hover:text-sand-100 " +
            "peer-checked:border-cognac-500 peer-checked:bg-cognac-500 peer-checked:font-semibold peer-checked:text-ink-950 " +
            "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cognac-400"}>
        {t(opcion)}
      </span>
    </label>);
}
export function QuestionnaireForm({ templateId, preguntas, }: {
    templateId: string;
    preguntas: PreguntaCuestionario[];
}) {
    const { t } = useI18n();
    const [estado, accion, pendiente] = useActionState(responderCuestionario, estadoInicial);
    return (<form action={accion} className="flex flex-col gap-10">
      <input type="hidden" name="template_id" value={templateId}/>

      {preguntas.map((pregunta, i) => (<fieldset key={pregunta.id}>
          <legend className="flex items-baseline gap-4">
            <span className="font-display text-[15px] italic text-cognac-400">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-display text-xl text-sand-50">
              {t(pregunta.texto)}
            </span>
          </legend>
          {pregunta.tipo === "multiselect" && (<p className="mt-1 pl-9 text-[12px] text-sand-600">{t("Puedes elegir varias.")}</p>)}

          <div className="mt-4 pl-9">
            {pregunta.tipo === "texto" ? (<textarea name={pregunta.id} rows={3} placeholder={t("Cu\u00E9ntanoslo con tus palabras\u2026")} className="w-full rounded-xs border border-edge bg-ink-900 px-4 py-3 text-[15px] text-sand-100 placeholder:text-sand-600 focus:border-cognac-500/60 focus:outline-none focus:ring-2 focus:ring-cognac-500/20"/>) : (<div className="flex flex-wrap gap-2.5">
                {(pregunta.opciones ?? []).map((opcion) => (<Opcion key={opcion} pregunta={pregunta.id} opcion={opcion} tipo={pregunta.tipo === "select" ? "radio" : "checkbox"}/>))}
              </div>)}
          </div>
        </fieldset>))}

      {estado.error && (<p role="alert" className="rounded-xs border border-oxblood-500/50 bg-ink-800 px-4 py-3 text-[13px] leading-relaxed text-error">
          {t(estado.error)}
        </p>)}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={pendiente}>
          {pendiente ? t("Enviando\u2026") : t("Enviar cuestionario")}
        </Button>
        <p className="text-[12.5px] text-sand-600 sm:max-w-[34ch]">{t("Con esto el equipo prepara tu rutina. Tus respuestas quedan protegidas como datos de salud.")}</p>
      </div>
    </form>);
}
