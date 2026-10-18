"use client";
import { useI18n } from "@/components/i18n/provider";
import Link from "next/link";
import { useActionState, useId, useState } from "react";
import { entrar, registrar, type AuthState } from "@/app/acceso/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Divider } from "@/components/ui/divider";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
type Mode = "login" | "register";
const tabs: {
    mode: Mode;
    label: string;
}[] = [
    { mode: "login", label: "Iniciar sesión" },
    { mode: "register", label: "Crear cuenta" },
];
const estadoInicial: AuthState = {};
/** Tarjeta de autenticación conectada a Supabase Auth (fase 2). */
export function AuthCard() {
    const { t } = useI18n();
    const [mode, setMode] = useState<Mode>("login");
    const uid = useId();
    // Controlados a propósito: si el envío falla, lo escrito no se borra
    // (React vacía los formularios no controlados tras cada acción).
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginState, loginAction, loginPending] = useActionState(entrar, estadoInicial);
    const [registerState, registerAction, registerPending] = useActionState(registrar, estadoInicial);
    const state = mode === "login" ? loginState : registerState;
    const pending = mode === "login" ? loginPending : registerPending;
    return (<div className="w-full max-w-sm">
      {/* Selector iniciar sesión / crear cuenta */}
      <div role="tablist" aria-label={t("Acceso")} className="mb-10 flex border-b border-edge">
        {tabs.map(({ mode: tabMode, label }) => {
            const selected = mode === tabMode;
            return (<button key={tabMode} role="tab" aria-selected={selected} onClick={() => setMode(tabMode)} className={cn("relative -mb-px flex-1 cursor-pointer pb-4 font-sans text-xs font-semibold", "transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cognac-400", selected ? "text-sand-100" : "text-sand-600 hover:text-sand-300")}>
              {t(label)}
              <span aria-hidden="true" className={cn("absolute inset-x-0 bottom-0 h-px origin-left bg-cognac-400 transition-transform duration-300 ease-out", selected ? "scale-x-100" : "scale-x-0")}/>
            </button>);
        })}
      </div>

      <form key={mode} action={mode === "login" ? loginAction : registerAction} className="animate-rise flex flex-col gap-6">
        {mode === "register" && (<Field label={t("Nombre")} htmlFor={`${uid}-name`}>
            <Input id={`${uid}-name`} name="name" autoComplete="name" placeholder={t("Tu nombre y apellidos")} value={nombre} onChange={(e) => setNombre(e.target.value)} required/>
          </Field>)}

        <Field label={t("Email")} htmlFor={`${uid}-email`}>
          <Input id={`${uid}-email`} name="email" type="email" autoComplete="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required/>
        </Field>

        <Field label={t("Contrase\u00F1a")} htmlFor={`${uid}-password`} labelAside={mode === "login" ? (<Link href="/acceso/recuperar" className="text-[12px] text-sand-600 transition-colors hover:text-cognac-400">{t("\u00BFLa has olvidado?")}</Link>) : undefined} hint={mode === "register" ? t("M\u00EDnimo 8 caracteres.") : undefined}>
          <Input id={`${uid}-password`} name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="••••••••" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required/>
        </Field>

        {mode === "register" && (<Checkbox id={`${uid}-consent`} name="healthConsent" required label={<>{t("Doy mi ")}<strong className="font-medium text-sand-300">{t("consentimiento expl\u00EDcito")}</strong>{" "}{t("al tratamiento de mis datos de salud y bienestar para el dise\u00F1o y seguimiento de mi entrenamiento.")}{" "}
                <a href="#" className="text-cognac-400 underline-offset-2 hover:underline">{t("C\u00F3mo tratamos tus datos")}</a>
              </>}/>)}

        <Button type="submit" size="lg" fullWidth disabled={pending}>
          {pending
            ? t("Un momento\u2026") : mode === "login"
            ? t("Entrar") : t("Crear cuenta")}
        </Button>

        {state.error && (<p role="alert" className="animate-rise rounded-xs border border-oxblood-500/50 bg-ink-800 px-4 py-3 text-[13px] leading-relaxed text-error">
            {t(state.error)}
          </p>)}
        {state.success && (<p role="status" className="animate-rise rounded-xs border border-cognac-500/40 bg-ink-800 px-4 py-3 text-[13px] leading-relaxed text-sand-300">
            {t(state.success)}
          </p>)}
      </form>

      <Divider label={t("Planes")} className="mt-12 mb-6"/>

      <div className="flex gap-3">
        {[
            { name: t("B\u00E1sico"), price: t("75 \u20AC/mes") },
            { name: "Premium", price: t("150 \u20AC/mes") },
        ].map((plan) => (<div key={plan.name} className="flex flex-1 flex-col gap-1 rounded-xs border border-edge px-4 py-3">
            <span className="text-[13px] font-medium text-sand-500">
              {t(plan.name)}
            </span>
            <span className="font-display text-[15px] text-sand-300">{t(plan.price)}</span>
          </div>))}
      </div>
    </div>);
}
