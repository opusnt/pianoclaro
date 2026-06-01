import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

import type { Lesson } from "@/types/lesson";

type LessonNavItem = Pick<Lesson, "slug" | "title" | "order">;

type LessonNavigationProps = {
  previousLesson?: LessonNavItem;
  nextLesson?: LessonNavItem;
  navigationBasePath: string;
  navigationItemLabel: string;
};

export function LessonNavigation({
  previousLesson,
  nextLesson,
  navigationBasePath,
  navigationItemLabel,
}: LessonNavigationProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {previousLesson ? (
        <Link
          href={`${navigationBasePath}/${previousLesson.slug}`}
          className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-blue-deep/10 bg-white px-4 py-3 text-sm font-bold text-blue-deep transition hover:bg-cream"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          {navigationItemLabel} {previousLesson.order}: {previousLesson.title}
        </Link>
      ) : null}
      {nextLesson ? (
        <Link
          href={`${navigationBasePath}/${nextLesson.slug}`}
          className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-blue-deep/10 bg-white px-4 py-3 text-sm font-bold text-blue-deep transition hover:bg-cream"
        >
          {navigationItemLabel} {nextLesson.order}: {nextLesson.title}
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
