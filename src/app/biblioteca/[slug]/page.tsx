import { notFound } from "next/navigation";

import { LessonLayout } from "@/components/lesson/LessonLayout";
import { contentRepository } from "@/lib/content";

type SongPracticePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return contentRepository.getPlayableSongLessons().map((lesson) => ({
    slug: lesson.slug,
  }));
}

export async function generateMetadata({ params }: SongPracticePageProps) {
  const { slug } = await params;
  const lesson = contentRepository.getPlayableSongLessonBySlug(slug);

  return {
    title: lesson ? `${lesson.title} | Biblioteca | Piano Claro` : "Canción | Piano Claro",
  };
}

export default async function SongPracticePage({ params }: SongPracticePageProps) {
  const { slug } = await params;
  const lesson = contentRepository.getPlayableSongLessonBySlug(slug);
  const song = contentRepository.getSongs().find((currentSong) => currentSong.slug === slug);

  if (!lesson || !song || song.readiness !== "mvp") {
    notFound();
  }

  const playableSongLessons = contentRepository.getPlayableSongLessons();
  const currentIndex = playableSongLessons.findIndex((currentLesson) => currentLesson.slug === slug);
  const previousLesson = playableSongLessons[currentIndex - 1];
  const nextLesson = playableSongLessons[currentIndex + 1];

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <LessonLayout
          lesson={lesson}
          previousLesson={previousLesson}
          nextLesson={nextLesson}
          navigationBasePath="/biblioteca"
          navigationItemLabel="Canción"
          completionReturnHref="/biblioteca"
          completionReturnLabel="Volver a biblioteca"
        />
      </div>
    </main>
  );
}
