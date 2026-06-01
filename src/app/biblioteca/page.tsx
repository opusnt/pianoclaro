import { ArrowRight, Clock, FileMusic, Library, ShieldCheck, Tags } from "lucide-react";
import Link from "next/link";

import { repertoireReadinessLabels, sourceTypeLabels } from "@/data/songs";
import { contentRepository } from "@/lib/content";
import type { SongReadiness, SongTag } from "@/types/learning";

export const metadata = {
  title: "Biblioteca | Piano Claro",
};

const tagStyles: Record<SongTag, string> = {
  lectura: "bg-blue-soft text-blue-deep",
  acordes: "bg-teal-soft/20 text-[#235f55]",
  ritmo: "bg-gold-soft/25 text-[#77561a]",
  melodia: "bg-rose-muted/18 text-[#834533]",
};

const readinessStyles: Record<SongReadiness, string> = {
  mvp: "border-teal-soft/35 bg-teal-soft/15 text-[#235f55]",
  proxima: "border-gold-soft/35 bg-gold-soft/20 text-[#77561a]",
  "midi-futuro": "border-blue-deep/15 bg-blue-soft/45 text-blue-deep",
};

export default function LibraryPage() {
  const songs = contentRepository.getSongs();
  const mvpSongs = songs.filter((song) => song.readiness === "mvp");
  const publicDomainSongs = songs.filter((song) => song.sourceType === "dominio-publico");
  const midiReadySongs = songs.filter((song) => song.midiFileHint);

  return (
    <main className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-lg border border-blue-deep/10 bg-white/78 p-6 shadow-soft sm:p-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-soft text-blue-deep">
            <Library aria-hidden="true" className="h-6 w-6" />
          </span>
          <p className="mt-5 text-sm font-bold uppercase text-gold-soft">Biblioteca</p>
          <h1 className="mt-3 text-4xl font-bold text-blue-deep sm:text-5xl">
            Canciones para leer y entender
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
            Repertorio organizado por nivel, concepto, fuente y preparación técnica. Cada canción
            debe enseñar algo musical, no solo una secuencia de teclas.
          </p>
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-blue-deep/10 bg-white/80 p-5 shadow-[0_12px_30px_rgba(18,52,91,0.08)]">
            <p className="text-sm font-bold text-blue-deep">Listas para MVP</p>
            <p className="mt-2 text-3xl font-bold text-gold-soft">{mvpSongs.length}</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Piezas o ejercicios que podemos convertir primero.
            </p>
          </article>
          <article className="rounded-2xl border border-blue-deep/10 bg-white/80 p-5 shadow-[0_12px_30px_rgba(18,52,91,0.08)]">
            <p className="text-sm font-bold text-blue-deep">Dominio público</p>
            <p className="mt-2 text-3xl font-bold text-gold-soft">{publicDomainSongs.length}</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Buenas candidatas para arreglos propios trazables.
            </p>
          </article>
          <article className="rounded-2xl border border-blue-deep/10 bg-white/80 p-5 shadow-[0_12px_30px_rgba(18,52,91,0.08)]">
            <p className="text-sm font-bold text-blue-deep">MIDI futuro</p>
            <p className="mt-2 text-3xl font-bold text-gold-soft">{midiReadySongs.length}</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Tienen referencia externa para una integración posterior.
            </p>
          </article>
        </section>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {songs.map((song) => (
            <article
              key={song.slug}
              className="flex h-full flex-col rounded-2xl border border-blue-deep/10 bg-white/78 p-5 shadow-[0_12px_30px_rgba(18,52,91,0.08)]"
            >
              <div className="flex items-start justify-between gap-4">
                <span className={`rounded-lg px-3 py-2 text-xs font-bold ${tagStyles[song.tag]}`}>
                  {song.tag}
                </span>
                <span className="text-sm font-semibold text-muted">{song.level}</span>
              </div>
              <h2 className="mt-5 text-xl font-bold text-blue-deep">{song.title}</h2>
              {song.composer ? (
                <p className="mt-1 text-sm font-semibold text-muted">{song.composer}</p>
              ) : null}
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-muted">
                <Clock aria-hidden="true" className="h-4 w-4 text-gold-soft" />
                {song.duration}
              </div>
              <p className="mt-4 text-sm leading-6 text-blue-deep">{song.pedagogicalUse}</p>
              <div className="mt-5">
                <p className="flex items-center gap-2 text-xs font-bold uppercase text-muted">
                  <Tags aria-hidden="true" className="h-4 w-4" />
                  Conceptos
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {song.concepts.map((concept) => (
                    <span
                      key={concept}
                      className="rounded-lg border border-blue-deep/10 bg-cream/60 px-3 py-2 text-xs font-semibold text-blue-deep"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-5 space-y-3 border-t border-blue-deep/10 pt-4 text-sm">
                <p className="flex items-start gap-2 text-muted">
                  <ShieldCheck
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-teal-soft"
                  />
                  <span>
                    <span className="font-bold text-blue-deep">
                      {sourceTypeLabels[song.sourceType]}
                    </span>
                    {": "}
                    {song.licenseLabel}
                  </span>
                </p>
                {song.midiFileHint ? (
                  <p className="flex items-start gap-2 text-muted">
                    <FileMusic
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft"
                    />
                    <span>{song.midiFileHint}</span>
                  </p>
                ) : null}
              </div>
              <div className="mt-auto pt-5">
                <div className="flex flex-col gap-3">
                  <span
                    className={`inline-flex w-fit rounded-xl border px-3 py-2 text-xs font-bold ${readinessStyles[song.readiness]}`}
                  >
                    {repertoireReadinessLabels[song.readiness]}
                  </span>
                  {song.readiness === "mvp" && song.practiceSlug ? (
                    <Link
                      href={`/biblioteca/${song.practiceSlug}`}
                      className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-deep px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0d2949]"
                    >
                      Practicar canción
                      <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </Link>
                  ) : (
                    <span className="text-sm font-semibold text-muted">
                      Disponible en una próxima ronda.
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
