import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { RoutineBuilder } from "@/components/admin/routine-builder";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Overline } from "@/components/ui/overline";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { createSupabaseServer } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Nueva rutina — Equilab Method",
};

type EjercicioCatalogo = { id: string; name: string; category: string };

export default async function NuevaRutinaPage({
  searchParams,
}: {
  searchParams: Promise<{ cliente?: string }>;
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

  const { cliente: clienteId } = await searchParams;
  if (!clienteId) redirect("/admin");

  const [{ data: cliente }, { data: catalogo }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name")
      .eq("id", clienteId)
      .single<{ id: string; full_name: string }>(),
    supabase
      .from("exercises")
      .select("id, name, category")
      .order("category")
      .order("name")
      .returns<EjercicioCatalogo[]>(),
  ]);

  if (!cliente) redirect("/admin");

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
        <Overline accent>Constructor de rutinas</Overline>
        <h1 className="mt-4 font-display text-4xl font-medium text-sand-50">
          Rutina para{" "}
          <em className="text-cognac-300">{cliente.full_name}</em>
        </h1>
        <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-sand-500">
          Serie a serie, igual que la verá el jinete: peso objetivo,
          repeticiones y descanso posterior de cada serie.
        </p>

        <div className="mt-10">
          <RoutineBuilder cliente={cliente} catalogo={catalogo ?? []} />
        </div>
      </main>
    </div>
  );
}
