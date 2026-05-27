import { notFound } from "next/navigation";

import { LessonLayout } from "@/components/lesson/LessonLayout";
import { contentRepository } from "@/lib/content";

type LessonPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return contentRepository.getLessons().map((lesson) => ({
    slug: lesson.slug,
  }));
}

export async function generateMetadata({ params }: LessonPageProps) {
  const { slug } = await params;
  const lesson = contentRepository.getLessonBySlug(slug);

  return {
    title: lesson ? `${lesson.title} | Piano Claro` : "Lección | Piano Claro",
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const lesson = contentRepository.getLessonBySlug(slug);

  if (!lesson) {
    notFound();
  }

  const orderedLessons = [...contentRepository.getLessons()].sort((a, b) => a.order - b.order);
  const currentLessonIndex = orderedLessons.findIndex((currentLesson) => currentLesson.slug === slug);
  const previousLesson = orderedLessons[currentLessonIndex - 1];
  const nextLesson = orderedLessons[currentLessonIndex + 1];

  return (
    <main className="px-3 py-5 sm:px-4 md:px-5 xl:px-8 xl:py-8">
      <div className="mx-auto max-w-7xl">
        <LessonLayout lesson={lesson} previousLesson={previousLesson} nextLesson={nextLesson} />
      </div>
    </main>
  );
}
