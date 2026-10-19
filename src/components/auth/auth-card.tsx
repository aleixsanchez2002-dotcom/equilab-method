"use client";
import { useI18n } from "@/components/i18n/provider";
import Link from "next/link";
import { useActionState, useId, useState } from "react";
import { entrar, registrar, type AuthState } from "@/app/acceso/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
    const [showPassword, setShowPassword] = useState(false);
    // Controlados a propósito: si el envío falla, lo escrito no se borra
    // (React vacía los formularios no controlados tras cada acción).
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginState, loginAction, loginPending] = useActionState(entrar, estadoInicial);
    const [registerState, registerAction, registerPending] = useActionState(registrar, estadoInicial);
    const state = mode === "login" ? loginState : registerState;
    const pending = mode === "login" ? loginPending : registerPending;
    return (<div className="w-full">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cognac-400">{t("TU ESPACIO EQUILAB")}</p>
      <h2 className="mt-4 font-display text-3xl leading-tight text-sand-50 sm:text-4xl">{t(mode === "login" ? "DE VUELTA A TU ENTRENO." : "EMPIEZA POR TI.")}</h2>
      <p className="mb-8 mt-4 text-sm leading-relaxed text-sand-500">{t(mode === "login" ? "Entra para continuar con tu entrenamiento." : "Crea tu cuenta. Después te conoceremos a través del cuestionario.")}</p>
      {/* Selector iniciar sesión / crear cuenta */}
      <div role="tablist" aria-label={t("Acceso")} className="mb-8 grid grid-cols-2 gap-1 rounded-xl bg-ink-950 p-1">
        {tabs.map(({ mode: tabMode, label }) => {
            const selected = mode === tabMode;
            return (<button key={tabMode} role="tab" aria-selected={selected} id={`${uid}-tab-${tabMode}`} aria-controls={`${uid}-panel`} type="button" onClick={() => setMode(tabMode)} className={cn("relative inline-flex min-h-12 cursor-pointer items-center justify-center rounded-lg px-2 text-xs font-semibold uppercase tracking-[0.08em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cognac-400", selected ? "bg-ink-800 text-sand-50 shadow-sm" : "text-sand-500 hover:text-sand-100")}>
              {t(label)}

            </button>);
        })}
      </div>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${mode}`}><form key={mode} action={mode === "login" ? loginAction : registerAction} className="animate-rise flex flex-col gap-6">
        {mode === "register" && (<Field label={t("Nombre")} htmlFor={`${uid}-name`}>
            <Input className="h-12 rounded-lg" id={`${uid}-name`} name="name" autoComplete="name" placeholder={t("Tu nombre y apellidos")} value={nombre} onChange={(e) => setNombre(e.target.value)} required/>
          </Field>)}

        <Field label={t("Email")} htmlFor={`${uid}-email`}>
          <Input className="h-12 rounded-lg" id={`${uid}-email`} name="email" type="email" autoComplete="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required/>
        </Field>

        <Field label={t("Contrase\u00F1a")} htmlFor={`${uid}-password`} labelAside={mode === "login" ? (<Link href="/acceso/recuperar" className="text-[12px] text-sand-600 transition-colors hover:text-cognac-400">{t("\u00BFLa has olvidado?")}</Link>) : undefined} hint={mode === "register" ? t("M\u00EDnimo 8 caracteres.") : undefined}>
          <div className="relative"><Input id={`${uid}-password`} name="password" type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="••••••••" className="h-12 rounded-lg pr-24" minLength={mode === "register" ? 8 : undefined} value={password} onChange={(e) => setPassword(e.target.value)} required/>
            <button type="button" onClick={() => setShowPassword((shown) => !shown)} aria-pressed={showPassword} aria-label={t(showPassword ? "Ocultar contraseña" : "Mostrar contraseña")} className="absolute inset-y-0 right-0 min-w-20 rounded-r-lg px-3 text-xs font-semibold text-cognac-400 focus-visible:outline-2 focus-visible:outline-cognac-400">{t(showPassword ? "Ocultar" : "Mostrar")}</button>
          </div>
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
      </form></div>

      <p className="mt-7 border-t border-edge pt-5 text-xs leading-relaxed text-sand-600">{t("Tu rutina y tus registros, siempre en el mismo lugar.")}</p>
    </div>);
}
