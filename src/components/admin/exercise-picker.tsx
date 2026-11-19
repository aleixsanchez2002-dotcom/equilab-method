"use client";

import { useRef, useState } from "react";
import { useI18n } from "@/components/i18n/provider";

export type CatalogExercise = {
  id: string;
  name: string;
  display_name_en: string | null;
  muscle_group: string | null;
  search_aliases: string | null;
};

function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase()
    .replace(/['’´]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

const label = (exercise: CatalogExercise) => exercise.display_name_en ?? exercise.name;
const group = (exercise: CatalogExercise) => exercise.muscle_group ?? "Otros";

export function ExercisePicker({ id, catalog, value, onChange }: {
  id: string;
  catalog: CatalogExercise[];
  value: string;
  onChange: (id: string) => void;
}) {
  const { t } = useI18n();
  const dialog = useRef<HTMLDialogElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [muscles, setMuscles] = useState("");
  const selected = catalog.find(exercise => exercise.id === value);
  const tokens = normalize(query).split(" ");
  const groups = !open ? [] : [...new Set(catalog.map(group))].sort((a,b) => t(a).localeCompare(t(b)));
  const results = !open ? [] : catalog.filter(exercise => {
    if (muscles && muscles !== group(exercise)) return false;
    const text = normalize([label(exercise), exercise.name, exercise.search_aliases, t(group(exercise))].join(" "));
    return tokens.every(token => text.includes(token));
  }).sort((a,b) => label(a).localeCompare(label(b), "en"));
  const field = "min-h-11 w-full rounded-lg border border-edge-control bg-ink-900 px-3 text-base text-sand-100";

  return <>
    <button id={id} type="button" aria-haspopup="dialog" className={field + " text-left"}
      onClick={() => {
        setOpen(true);
        setQuery("");
        setMuscles("");
        dialog.current?.showModal();
        search.current?.focus();
      }}>
      {selected ? label(selected) : t("Elegir ejercicio")} <span aria-hidden="true">⌄</span>
    </button>
    <dialog ref={dialog} onClose={() => setOpen(false)} aria-labelledby={id + "-title"}
      className="m-auto max-h-[85dvh] w-[min(32rem,94vw)] rounded-2xl border border-edge-control bg-ink-900 p-0 text-sand-100 backdrop:bg-black/70">
      <div className="flex max-h-[85dvh] flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 id={id + "-title"} className="font-display text-lg">{t("Elegir ejercicio")}</h3>
          <button type="button" onClick={() => dialog.current?.close()} className="min-h-11 px-2">{t("Cerrar")}</button>
        </div>
        <label className="grid gap-1 text-sm">{t("Buscar por nombre")}
          <input ref={search} type="search" value={query} className={field}
            onKeyDown={e => { if (e.key === "Enter") e.preventDefault(); }}
            onChange={e => setQuery(e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">{t("Grupo muscular")}
          <select value={muscles} onChange={e => setMuscles(e.target.value)} className={field}>
            <option value="">{t("Todos los grupos")}</option>
            {groups.map(g => <option key={g} value={g}>{t(g)}</option>)}
          </select>
        </label>
        <div className="min-h-0 overflow-y-auto">
          {results.length === 0 && <p role="status" className="py-3 text-sm">{t("No se han encontrado ejercicios.")}</p>}
          {results.map(exercise => <button key={exercise.id} type="button" aria-pressed={exercise.id === value}
            className="flex min-h-11 w-full items-center justify-between gap-3 border-t border-edge px-2 py-2 text-left hover:bg-ink-800 aria-pressed:text-cognac-300"
            onClick={() => { onChange(exercise.id); dialog.current?.close(); }}>
            <span>{label(exercise)}</span><span className="text-right text-xs text-sand-400">{t(group(exercise))}</span>
          </button>)}
        </div>
      </div>
    </dialog>
  </>;
}
