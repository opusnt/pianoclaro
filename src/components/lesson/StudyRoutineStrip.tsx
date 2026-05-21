type StudyRoutineItem = {
  title: string;
  detail: string;
};

type StudyRoutineStripProps = {
  items: StudyRoutineItem[];
};

export function StudyRoutineStrip({ items }: StudyRoutineStripProps) {
  return (
    <section className="grid gap-3 md:grid-cols-4">
      {items.map((item, index) => (
        <article
          key={item.title}
          className="rounded-2xl border border-blue-deep/10 bg-white/80 p-4 shadow-[0_12px_30px_rgba(18,52,91,0.06)]"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-deep text-xs font-bold text-white">
              {index + 1}
            </span>
            <h2 className="text-sm font-bold text-blue-deep">{item.title}</h2>
          </div>
          <p className="mt-3 text-sm leading-5 text-muted">{item.detail}</p>
        </article>
      ))}
    </section>
  );
}
