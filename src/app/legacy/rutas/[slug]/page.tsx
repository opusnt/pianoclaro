import { ArrowRight, BookOpen, Clock, GraduationCap } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { contentRepository } from "@/lib/content";

type RoutePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return contentRepository.getRoutes().map((route) => ({
    slug: route.slug,
  }));
}

export async function generateMetadata({ params }: RoutePageProps) {
  const { slug } = await params;
  const route = contentRepository.getRouteBySlug(slug);

  return {
    title: route ? `${route.title} | Piano Claro` : "Ruta | Piano Claro",
  };
}

export default async function RoutePage({ params }: RoutePageProps) {
  const { slug } = await params;
  const route = contentRepository.getRouteBySlug(slug);

  if (!route) {
    notFound();
  }

  const firstLesson = route.lessonSlugs[0]
    ? contentRepository.getLessonBySlug(route.lessonSlugs[0])
    : undefined;

  return (
    <main className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-lg border border-blue-deep/10 bg-white/78 p-6 shadow-soft sm:p-8">
          <p className="text-sm font-bold uppercase text-gold-soft">Ruta de aprendizaje</p>
          <h1 className="mt-3 text-4xl font-bold text-blue-deep sm:text-5xl">{route.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">{route.description}</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-blue-soft/55 p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-blue-deep">
                <GraduationCap aria-hidden="true" className="h-4 w-4" />
                Nivel
              </p>
              <p className="mt-2 text-sm text-muted">{route.level}</p>
            </div>
            <div className="rounded-lg bg-cream/70 p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-blue-deep">
                <Clock aria-hidden="true" className="h-4 w-4" />
                Duración
              </p>
              <p className="mt-2 text-sm text-muted">{route.estimatedDuration}</p>
            </div>
            <div className="rounded-lg bg-teal-soft/15 p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-blue-deep">
                <BookOpen aria-hidden="true" className="h-4 w-4" />
                Lecciones
              </p>
              <p className="mt-2 text-sm text-muted">{route.lessonCount} lecciones</p>
            </div>
          </div>
          <div className="mt-7 h-2 overflow-hidden rounded-full bg-blue-deep/10">
            <div
              className="h-full rounded-full bg-blue-deep"
              style={{ width: `${route.progress}%` }}
            />
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-blue-deep/10 bg-blue-deep p-6 text-white shadow-soft sm:p-8">
          <p className="text-sm font-bold uppercase text-gold-soft">Primer paso sugerido</p>
          <h2 className="mt-3 text-2xl font-bold">
            {firstLesson ? firstLesson.title : "Explora canciones para esta ruta"}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
            {firstLesson
              ? firstLesson.objective
              : "Esta ruta todavía no tiene una lección propia en el MVP, pero puedes practicar con la biblioteca mock."}
          </p>
          <Link
            href={firstLesson ? `/lecciones/${firstLesson.slug}` : "/biblioteca"}
            className="focus-ring mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-blue-deep transition hover:bg-cream"
          >
            {firstLesson ? "Comenzar lección" : "Ir a biblioteca"}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </main>
  );
}
