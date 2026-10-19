"use client";
import { useI18n } from "@/components/i18n/provider";
import { useActionState, useId, useState } from "react";
import { cambiarContrasena, solicitarRecuperacion, type AuthState, } from "@/app/acceso/actions";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
const estadoInicial: AuthState = {};
function Mensajes({ estado }: {
    estado: AuthState;
}) {
    const { t } = useI18n();
    return (<>
      {estado.error && (<p role="alert" className="animate-rise rounded-xs border border-oxblood-500/50 bg-ink-800 px-4 py-3 text-[13px] leading-relaxed text-error">
          {t(estado.error)}
        </p>)}
      {estado.success && (<p role="status" className="animate-rise rounded-xs border border-cognac-500/40 bg-ink-800 px-4 py-3 text-[13px] leading-relaxed text-sand-300">
          {t(estado.success)}
        </p>)}
    </>);
}
/** Paso 1: pedir el enlace de recuperación por email. */
export function RecoveryRequestForm() {
    const { t } = useI18n();
    const [estado, accion, pendiente] = useActionState(solicitarRecuperacion, estadoInicial);
    const [email, setEmail] = useState("");
    const uid = useId();
    return (<form action={accion} className="flex flex-col gap-6">
      <Field label={t("Email")} htmlFor={`${uid}-email`}>
        <Input id={`${uid}-email`} name="email" type="email" autoComplete="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required/>
      </Field>
      <Button type="submit" size="lg" fullWidth disabled={pendiente}>
        {pendiente ? t("Enviando\u2026") : t("Enviarme el enlace")}
      </Button>
      <Mensajes estado={estado}/>
    </form>);
}
/** Paso 2: crear la contraseña nueva (con la sesión del enlace). */
export function NewPasswordForm() {
    const { t } = useI18n();
    const [estado, accion, pendiente] = useActionState(cambiarContrasena, estadoInicial);
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const uid = useId();
    return (<form action={accion} className="flex flex-col gap-6">
      <Field label={t("Contrase\u00F1a nueva")} htmlFor={`${uid}-password`} hint={t("M\u00EDnimo 8 caracteres.")}>
        <Input id={`${uid}-password`} name="password" type="password" autoComplete="new-password" placeholder="••••••••" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required/>
      </Field>
      <Field label={t("Rep\u00EDtela")} htmlFor={`${uid}-password2`}>
        <Input id={`${uid}-password2`} name="password2" type="password" autoComplete="new-password" placeholder="••••••••" minLength={8} value={password2} onChange={(e) => setPassword2(e.target.value)} required/>
      </Field>
      <Button type="submit" size="lg" fullWidth disabled={pendiente}>
        {pendiente ? t("Guardando\u2026") : t("Guardar contrase\u00F1a nueva")}
      </Button>
      <Mensajes estado={estado}/>
    </form>);
}
