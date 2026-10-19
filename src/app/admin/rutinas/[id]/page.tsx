import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { DiaInput, SemanaInput } from "@/app/admin/actions";
import { RoutineBuilder } from "@/components/admin/routine-builder";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Overline } from "@/components/ui/overline";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { createSupabaseServer } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Revisar rutina — Equilab Method",
};

type EjercicioCatalogo = { id: string; name: string; category: string };

type RutinaRow = {
  id: string;
  user_id: string;
  title: string;
  type: "semi" | "personalizada";
  status: string;
  weeks: number | null;
  notes: string | null;
  explanation: string | null;
  coach_id: string | null;
};

type DiaRow = {
  id: string;
  week: number;
  position: number;
  focus: string;
  duration_note: string | null;
  routine_exercises: {
    position: number;
    exercise_id: string;
    technique_note: string | null;
    // `rir` es opcional: las rutinas creadas antes de añadirlo no lo tienen.
    series: { peso: string; reps: string; rir?: string; descanso: string }[];
  }[];
};

export default async function RevisarRutinaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!supabaseConfigurado) redirect("/app");

  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/acceso");

  const { data: perfil } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .single<Profile>();
  if (perfil?.role !== "coach" && perfil?.role !== "admin") redirect("/app");

  const { id } = await params;

  const { data: rutina } = await supabase
    .from("routines")
    .select("id, user_id, title, type, status, weeks, notes, explanation, coach_id")
    .eq("id", id)
    .maybeSingle<RutinaRow>();
  if (!rutina) redirect("/admin");

  const [{ data: cliente }, { data: catalogo }, { data: diasRaw }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name")
        .eq("id", rutina.user_id)
        .single<{ id: string; full_name: string }>(),
      supabase
        .from("exercises")
        .select("id, name, category")
        .order("category")
        .order("name")
        .returns<EjercicioCatalogo[]>(),
      supabase
        .from("routine_days")
        .select(
          "id, week, position, focus, duration_note, routine_exercises(position, exercise_id, technique_note, series)",
        )
        .eq("routine_id", rutina.id)
        .returns<DiaRow[]>(),
    ]);

  if (!cliente) redirect("/admin");

  const comoDia = (dia: DiaRow): DiaInput => ({
    focus: dia.focus,
    duration_note: dia.duration_note ?? "",
    ejercicios: dia.routine_exercises
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((ej) => ({
        exercise_id: ej.exercise_id,
        technique_note: ej.technique_note ?? "",
        series: ej.series.map((s) => ({ ...s, rir: s.rir ?? "" })),
      })),
  });

  // Los días llegan planos: se agrupan por semana para el constructor
  const porSemana = new Map<number, DiaRow[]>();
  for (const dia of diasRaw ?? []) {
    const lista = porSemana.get(dia.week) ?? [];
    lista.push(dia);
    porSemana.set(dia.week, lista);
  }
  const semanas: SemanaInput[] = [...porSemana.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, dias]) => ({
      dias: dias
        .slice()
        .sort((a, b) => a.position - b.position)
        .map(comoDia),
    }));

  const esPropuestaMotor = rutina.coach_id === null;

  return (
    <div className="min-h-dvh bg-ink-950">
      <header className="sticky top-0 z-40 border-b border-edge bg-ink-950/95">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Logo size="sm" />
          <Link href="/admin">
            <Button variant="ghost" size="sm" tabIndex={-1}>
              ← Volver al panel
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <Overline accent>
          {esPropuestaMotor ? "Propuesta del motor · por revisar" : "Revisar rutina"}
        </Overline>
        <h1 className="mt-4 font-display text-4xl font-medium text-sand-50">
          Rutina de <em className="text-cognac-300">{cliente.full_name}</em>
        </h1>
        <p className="mt-3 text-[13px] uppercase tracking-[0.14em] text-sand-600">
          Estado: {rutina.status}
        </p>

        {rutina.notes && (
          <div className="mt-6 max-w-2xl rounded-xs border border-cognac-500/40 bg-ink-900 px-5 py-4">
            <p className="text-[13px] leading-relaxed text-sand-300">
              {rutina.notes}
            </p>
          </div>
        )}

        <div className="mt-10">
          <RoutineBuilder
            cliente={cliente}
            catalogo={catalogo ?? []}
            rutinaId={rutina.id}
            inicial={{
              title: rutina.title,
              type: rutina.type,
              explanation: rutina.explanation,
              semanas,
            }}
          />
        </div>
      </main>
    </div>
  );
}
