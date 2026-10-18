import type { ReactNode } from "react";
import { PantallaAgenda } from "@/components/area/agenda";
import { PantallaCuenta } from "@/components/area/cuenta";
import { PantallaEntreno } from "@/components/area/entreno";
import { PantallaHoy } from "@/components/area/hoy";
import { PantallaMensajes } from "@/components/area/mensajes";
import { PantallaProgreso } from "@/components/area/progreso";
import { PantallaRutina } from "@/components/area/rutina";
import { AreaShell, type RutasArea } from "@/components/area/shell";
import { PantallaCorreccion, PantallaEnviarVideo, PantallaTecnica, PantallaTecnicaBasico, } from "@/components/area/tecnica";
import type { Plan } from "@/components/area/tipos";
import { AGENDA, AVISOS_BASICO, AVISOS_PREMIUM, ENVIOS, MENSAJES, MENSAJES_BASICO, PROGRESO, RUTINA, } from "./datos";

/** Pantallas de la maqueta, en el orden en que se enseñan. */
export const PANTALLAS = [
    { id: "hoy", nombre: "Hoy" },
    { id: "rutina", nombre: "Rutina" },
    { id: "entreno", nombre: "Modo entreno" },
    { id: "tecnica", nombre: "Técnica" },
    { id: "enviar", nombre: "Enviar un vídeo" },
    { id: "correccion", nombre: "Corrección recibida" },
    { id: "progreso", nombre: "Progreso" },
    { id: "mensajes", nombre: "Mensajes" },
    { id: "agenda", nombre: "Agenda 1:1" },
    { id: "cuenta", nombre: "Cuenta" },
] as const;

export type IdPantalla = (typeof PANTALLAS)[number]["id"];

const conPlan = (ruta: string, plan: Plan) => (plan === "basico" ? `${ruta}?plan=basico` : ruta);

function rutasMaqueta(plan: Plan): RutasArea {
    return {
        hoy: conPlan("/maquetas/hoy", plan),
        rutina: conPlan("/maquetas/rutina", plan),
        tecnica: conPlan("/maquetas/tecnica", plan),
        progreso: conPlan("/maquetas/progreso", plan),
        cuenta: conPlan("/maquetas/cuenta", plan),
        mensajes: conPlan("/maquetas/mensajes", plan),
    };
}

/** Una pantalla del área con datos de ejemplo, para revisar el diseño. */
export async function Maqueta({ pantalla, plan, }: {
    pantalla: IdPantalla;
    plan: Plan;
}) {
    const rutas = rutasMaqueta(plan);
    const premium = plan === "premium";
    const dia = RUTINA.dias[1];

    if (pantalla === "entreno") {
        return (<PantallaEntreno dia={RUTINA.dias[0]} indice={0} hechas={[{ kg: "40", reps: "8", rir: "2" }]} descanso={{ restante: "1:24", total: "2 min", progreso: 0.3 }} plan={plan} hrefCerrar={rutas.rutina} hrefAnterior={null} hrefSiguiente={conPlan("/maquetas/entreno", plan)} hrefVideo="/maquetas/enviar"/>);
    }

    const marco = (activa: Parameters<typeof AreaShell>[0]["activa"], titulo: string, contenido: ReactNode) => (<AreaShell activa={activa} titulo={titulo} plan={plan} sinLeer={premium ? 1 : 0} rutas={rutas}>
      {contenido}
    </AreaShell>);

    switch (pantalla) {
        case "hoy":
            return marco("hoy", "Hoy", <PantallaHoy nombre="Laura" fecha="Lunes, 19 de octubre" semanaActual={RUTINA.semanaActual} totalSemanas={RUTINA.totalSemanas} sesion={dia} hechas={1} previstas={3} avisos={premium ? AVISOS_PREMIUM : AVISOS_BASICO} llamada={premium ? { cuando: "Martes 21 de octubre, 18:00", con: "Giovanni y Alex", enlace: "/maquetas/agenda" } : null} hrefEntreno={conPlan("/maquetas/entreno", plan)} hrefRutina={rutas.rutina}/>);
        case "rutina":
            return marco("rutina", "Rutina", <PantallaRutina rutina={RUTINA} semanaVista={RUTINA.semanaActual} hrefSemana={() => rutas.rutina} hrefEntreno={() => conPlan("/maquetas/entreno", plan)}/>);
        case "tecnica":
        case "enviar":
        case "correccion":
            if (!premium)
                return marco("tecnica", "Técnica", <PantallaTecnicaBasico hrefPremium={rutas.cuenta}/>);
            if (pantalla === "enviar")
                return marco("tecnica", "Enviar un vídeo", <PantallaEnviarVideo ejercicios={RUTINA.dias.flatMap((d) => d.ejercicios.filter((e) => e.tieneVideo).map((e) => e.nombre)).slice(0, 8)} seleccionado="Hip thrust" primerVideo={false} subiendo={0.64} hrefVolver={rutas.tecnica}/>);
            if (pantalla === "correccion")
                return marco("tecnica", "Corrección", <PantallaCorreccion envio={ENVIOS[1]} hrefVolver={rutas.tecnica} hrefRutina={rutas.rutina}/>);
            return marco("tecnica", "Técnica", <PantallaTecnica envios={ENVIOS} hrefEnviar="/maquetas/enviar" hrefEnvio={(id) => (id === "v2" ? "/maquetas/correccion" : rutas.tecnica)}/>);
        case "progreso":
            return marco("progreso", "Progreso", <PantallaProgreso progreso={PROGRESO} plan={plan} pesoPendiente hrefRevision={rutas.progreso}/>);
        case "mensajes":
            return marco("mensajes", "Mensajes", <PantallaMensajes mensajes={premium ? MENSAJES : MENSAJES_BASICO} plan={plan}/>);
        case "agenda":
            if (!premium)
                return marco("cuenta", "Cuenta", <PantallaCuenta nombre="Laura Martín" email="laura@ejemplo.com" plan={plan} renovacion="2 de noviembre" hrefAgenda={rutas.cuenta}/>);
            return marco("cuenta", "Valoración 1:1", <PantallaAgenda dias={AGENDA} diaElegido="mar21" horaElegida="18:00" duracion="45 min" hrefDia={() => "/maquetas/agenda"}/>);
        case "cuenta":
            return marco("cuenta", "Cuenta", <PantallaCuenta nombre="Laura Martín" email="laura@ejemplo.com" plan={plan} renovacion="2 de noviembre" hrefAgenda="/maquetas/agenda"/>);
    }
}
