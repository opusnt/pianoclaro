"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

type LessonCompleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  returnHref?: string;
  returnLabel?: string;
  title?: string;
};

export function LessonCompleteModal({
  isOpen,
  onClose,
  returnHref = "/rutas",
  returnLabel = "Volver a rutas",
  title = "Lección completada",
}: LessonCompleteModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 px-4 backdrop-blur-sm">
      <section className="w-full max-w-md rounded-2xl border border-blue-deep/10 bg-white p-6 text-center shadow-soft">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-soft/20 text-blue-deep">
          <CheckCircle2 aria-hidden="true" className="h-7 w-7" />
        </span>
        <h2 className="mt-5 text-3xl font-bold text-blue-deep">{title}</h2>
        <p className="mt-3 text-base leading-7 text-muted">
          Acabas de avanzar en lectura musical y práctica de piano.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href={returnHref}
            className="focus-ring inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-deep px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0d2949]"
          >
            {returnLabel}
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="focus-ring inline-flex min-h-11 items-center justify-center rounded-xl border border-blue-deep/15 bg-white px-4 py-3 text-sm font-bold text-blue-deep transition hover:bg-blue-soft/45"
          >
            Seguir practicando
          </button>
        </div>
      </section>
    </div>
  );
}
