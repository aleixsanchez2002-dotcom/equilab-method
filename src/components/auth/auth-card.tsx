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
export type Mode = "login" | "register";
const estadoInicial: AuthState = {};
/**
 * Tarjeta de autenticación conectada a Supabase Auth (fase 2). Cada modo
 * vive en su propia página: /acceso para clientes con cuenta y
 * /acceso/registro para cuentas nuevas.
 */
export function AuthCard({ mode }: {
    mode: Mode;
}) {
    const { t } = useI18n();
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
      <h2 className="mb-8 font-display text-2xl leading-tight font-medium text-sand-50">
        {mode === "login" ? t("Inicia sesión") : t("Crea tu cuenta")}
      </h2>

      <form action={mode === "login" ? loginAction : registerAction} className="animate-rise flex flex-col gap-6">
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

      <p className="mt-8 text-center text-[14px] text-sand-500">
        {mode === "login" ? t("¿Aún no tienes cuenta?") : t("¿Ya tienes cuenta?")}{" "}
        <Link href={mode === "login" ? "/acceso/registro" : "/acceso"} className="font-semibold text-cognac-400 underline-offset-2 hover:underline">
          {mode === "login" ? t("Regístrate") : t("Inicia sesión")}
        </Link>
      </p>

      {/* Los planes solo interesan a quien todavía no tiene cuenta */}
      {mode === "register" && (<>
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
      </>)}
    </div>);
}
