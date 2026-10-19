"use client";
import { useI18n } from "@/components/i18n/provider";
import { useActionState, useId, useState } from "react";
import { cambiarContrasena, type AuthState } from "@/app/acceso/actions";
import { actualizarEmail, actualizarNombre, type CuentaEstado, } from "@/app/app/cuenta/actions";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
function Mensajes({ estado }: {
    estado: CuentaEstado | AuthState;
}) {
    const { t } = useI18n();
    return (<>
      {estado.error && (<p role="alert" className="text-[13px] text-error">
          {t(estado.error)}
        </p>)}
      {estado.success && (<p role="status" className="text-[13px] text-sand-300">
          {t(estado.success)}
        </p>)}
    </>);
}
export function NombreForm({ nombreActual }: {
    nombreActual: string;
}) {
    const { t } = useI18n();
    const [estado, accion, pendiente] = useActionState(actualizarNombre, {} as CuentaEstado);
    const [nombre, setNombre] = useState(nombreActual);
    const uid = useId();
    return (<form action={accion} className="flex flex-col gap-4">
      <Field label={t("Nombre")} htmlFor={`${uid}-nombre`}>
        <Input id={`${uid}-nombre`} name="nombre" autoComplete="name" value={nombre} onChange={(e) => setNombre(e.target.value)} required/>
      </Field>
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" variant="outline" disabled={pendiente}>
          {pendiente ? t("Guardando\u2026") : t("Guardar nombre")}
        </Button>
        <Mensajes estado={estado}/>
      </div>
    </form>);
}
export function EmailForm({ emailActual }: {
    emailActual: string;
}) {
    const { t } = useI18n();
    const [estado, accion, pendiente] = useActionState(actualizarEmail, {} as CuentaEstado);
    const [email, setEmail] = useState(emailActual);
    const uid = useId();
    return (<form action={accion} className="flex flex-col gap-4">
      <Field label={t("Email")} htmlFor={`${uid}-email`} hint={t("Al cambiarlo te llegar\u00E1 un correo de confirmaci\u00F3n a la direcci\u00F3n nueva.")}>
        <Input id={`${uid}-email`} name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
      </Field>
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" variant="outline" disabled={pendiente}>
          {pendiente ? t("Enviando\u2026") : t("Cambiar email")}
        </Button>
        <Mensajes estado={estado}/>
      </div>
    </form>);
}
export function PasswordForm() {
    const { t } = useI18n();
    const [estado, accion, pendiente] = useActionState(cambiarContrasena, {} as AuthState);
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const uid = useId();
    return (<form action={accion} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("Contrase\u00F1a nueva")} htmlFor={`${uid}-p1`} hint={t("M\u00EDnimo 8 caracteres.")}>
          <Input id={`${uid}-p1`} name="password" type="password" autoComplete="new-password" placeholder="••••••••" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required/>
        </Field>
        <Field label={t("Rep\u00EDtela")} htmlFor={`${uid}-p2`}>
          <Input id={`${uid}-p2`} name="password2" type="password" autoComplete="new-password" placeholder="••••••••" minLength={8} value={password2} onChange={(e) => setPassword2(e.target.value)} required/>
        </Field>
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" variant="outline" disabled={pendiente}>
          {pendiente ? t("Guardando\u2026") : t("Cambiar contrase\u00F1a")}
        </Button>
        <Mensajes estado={estado}/>
      </div>
    </form>);
}
