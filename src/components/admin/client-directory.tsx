"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { concederAcceso } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export type EstadoCliente =
  | "revisar"
  | "crear"
  | "inactivo"
  | "al-dia"
  | "sin-acceso"
  | "sin-confirmar";

export type ClienteResumen = {
  id: string;
  nombre: string;
  email: string;
  estado: EstadoCliente;
  plan: string | null;
  diasRestantes: number | null;
  /** Rutina publicada vigente, si la hay. */
  rutina: { id: string; title: string } | null;
  /** Borrador o propuesta del motor pendiente de revisar. */
  borrador: { id: string; title: string; delMotor: boolean } | null;
  ultimaSesion: string | null;
  diasSinEntrenar: number | null;
};

const SECCIONES: {
  estado: EstadoCliente;
  titulo: string;
  nota: string;
  acento: boolean;
}[] = [
  {
    estado: "revisar",
    titulo: "Por revisar",
    nota: "Rutinas en borrador esperando tu aprobación.",
    acento: true,
  },
  {
    estado: "crear",
    titulo: "Por crear rutina",
    nota: "Tienen acceso pero aún no tienen entrenamiento.",
    acento: true,
  },
  {
    estado: "inactivo",
    titulo: "Sin entrenar",
    nota: "Llevan más de 10 días sin registrar una sesión.",
    acento: false,
  },
  {
    estado: "al-dia",
    titulo: "Al día",
    nota: "Con su rutina publicada y entrenando.",
    acento: false,
  },
  {
    estado: "sin-acceso",
    titulo: "Sin acceso",
    nota: "Registrados sin plan activo o con la suscripción caducada.",
    acento: false,
  },
  {
    estado: "sin-confirmar",
    titulo: "Registro sin terminar",
    nota: "No han confirmado su email, así que todavía no pueden entrar. Suele ser una errata al escribir el correo.",
    acento: false,
  },
];

/** Cuántos se muestran de cada sección antes de pedir «ver todos». */
const TOPE = 8;

function Etiqueta({
  children,
  tono = "neutro",
}: {
  children: React.ReactNode;
  tono?: "neutro" | "acento" | "apagado";
}) {
  return (
    <span
      className={cn(
        "rounded-xs px-2 py-0.5 text-[12px] font-bold",
        tono === "acento" && "bg-cognac-500 text-ink-950",
        tono === "neutro" && "border border-edge-strong text-sand-300",
        tono === "apagado" && "border border-edge text-sand-600",
      )}
    >
      {children}
    </span>
  );
}

function Fila({ cliente }: { cliente: ClienteResumen }) {
  return (
    <article className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-edge bg-ink-900 px-5 py-4 last:border-b-0">
      <div className="min-w-[190px] flex-1">
        <Link
          href={`/admin/clientes/${cliente.id}`}
          className="text-[14.5px] font-semibold text-sand-100 underline-offset-2 transition-colors hover:text-cognac-300 hover:underline"
        >
          {cliente.nombre || "Sin nombre"}
        </Link>
        <p className="text-[12px] text-sand-600">{cliente.email}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {cliente.plan && cliente.diasRestantes !== null ? (
          <>
            <Etiqueta tono="acento">{cliente.plan === "premium" ? "Premium" : "Básico"}</Etiqueta>
            <span className="text-[12px] text-sand-500">
              {cliente.diasRestantes} d
            </span>
          </>
        ) : (
          <Etiqueta tono="apagado">Sin acceso</Etiqueta>
        )}

        {cliente.estado === "sin-confirmar" && (
          <Etiqueta tono="apagado">Email sin confirmar</Etiqueta>
        )}

        {cliente.borrador && (
          <Etiqueta tono="neutro">
            {cliente.borrador.delMotor ? "Propuesta del motor" : "Borrador"}
          </Etiqueta>
        )}
      </div>

      <span className="min-w-[110px] text-[12px] text-sand-600">
        {cliente.diasSinEntrenar === null
          ? "sin sesiones"
          : cliente.diasSinEntrenar === 0
            ? "entrenó hoy"
            : cliente.diasSinEntrenar === 1
              ? "entrenó ayer"
              : `hace ${cliente.diasSinEntrenar} días`}
      </span>

      <div className="ml-auto flex flex-wrap gap-2">
        {cliente.borrador && (
          <Link href={`/admin/rutinas/${cliente.borrador.id}`}>
            <Button size="sm" tabIndex={-1}>
              Revisar
            </Button>
          </Link>
        )}
        {cliente.estado === "crear" && (
          <Link href={`/admin/rutinas/nueva?cliente=${cliente.id}`}>
            <Button size="sm" tabIndex={-1}>
              Crear rutina
            </Button>
          </Link>
        )}
        {cliente.estado === "sin-acceso" && (
          <>
            <form action={concederAcceso}>
              <input type="hidden" name="userId" value={cliente.id} />
              <input type="hidden" name="planCode" value="basico" />
              <Button variant="outline" size="sm" type="submit">
                Básico 30 d
              </Button>
            </form>
            <form action={concederAcceso}>
              <input type="hidden" name="userId" value={cliente.id} />
              <input type="hidden" name="planCode" value="premium" />
              <Button variant="outline" size="sm" type="submit">
                Premium 30 d
              </Button>
            </form>
          </>
        )}
        <Link href={`/admin/clientes/${cliente.id}`}>
          <Button variant="ghost" size="sm" tabIndex={-1}>
            Ficha
          </Button>
        </Link>
      </div>
    </article>
  );
}

export function ClientDirectory({ clientes }: { clientes: ClienteResumen[] }) {
  const [busqueda, setBusqueda] = useState("");
  const [desplegadas, setDesplegadas] = useState<Set<EstadoCliente>>(new Set());

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return clientes;
    return clientes.filter(
      (c) =>
        c.nombre.toLowerCase().includes(texto) ||
        c.email.toLowerCase().includes(texto),
    );
  }, [busqueda, clientes]);

  const porEstado = useMemo(() => {
    const mapa = new Map<EstadoCliente, ClienteResumen[]>();
    for (const c of filtrados) {
      const lista = mapa.get(c.estado) ?? [];
      lista.push(c);
      mapa.set(c.estado, lista);
    }
    return mapa;
  }, [filtrados]);

  return (
    <div className="mt-4">
      <input
        type="search"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar por nombre o email…"
        aria-label="Buscar cliente"
        className="h-11 w-full max-w-md rounded-xs border border-edge bg-ink-950 px-4 text-[14px] text-sand-100 placeholder:text-sand-600 focus:border-cognac-500/60 focus:outline-none focus:ring-2 focus:ring-cognac-500/20"
      />

      {filtrados.length === 0 && (
        <p className="mt-6 text-[14px] text-sand-500">
          {clientes.length === 0
            ? "Aún no hay clientes registrados."
            : "Ningún cliente coincide con esa búsqueda."}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-8">
        {SECCIONES.map(({ estado, titulo, nota, acento }) => {
          const lista = porEstado.get(estado) ?? [];
          if (lista.length === 0) return null;

          const abierta = desplegadas.has(estado) || busqueda.trim() !== "";
          const visibles = abierta ? lista : lista.slice(0, TOPE);

          return (
            <section key={estado}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3
                  className={cn(
                    "font-display text-xl font-medium",
                    acento ? "text-cognac-300" : "text-sand-50",
                  )}
                >
                  {titulo}
                </h3>
                <span className="font-display text-[15px] text-sand-500 tabular-nums">
                  {lista.length}
                </span>
                <p className="w-full text-[12.5px] text-sand-600 sm:w-auto">
                  {nota}
                </p>
              </div>

              <div className="mt-3 overflow-hidden rounded-sm border border-edge">
                {visibles.map((c) => (
                  <Fila key={c.id} cliente={c} />
                ))}
              </div>

              {lista.length > TOPE && (
                <button
                  type="button"
                  onClick={() =>
                    setDesplegadas((prev) => {
                      const copia = new Set(prev);
                      if (copia.has(estado)) copia.delete(estado);
                      else copia.add(estado);
                      return copia;
                    })
                  }
                  className="mt-3 cursor-pointer text-[13px] font-semibold text-sand-500 transition-colors hover:text-cognac-400"
                >
                  {abierta
                    ? "Mostrar menos"
                    : `Ver los ${lista.length} de esta sección`}
                </button>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
