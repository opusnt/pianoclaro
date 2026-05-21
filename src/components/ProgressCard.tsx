type ProgressCardProps = {
  title: string;
  value: string;
  detail: string;
  tone?: "blue" | "gold" | "teal";
};

const toneStyles = {
  blue: "border-blue-deep/12 bg-blue-soft/45",
  gold: "border-gold-soft/30 bg-gold-soft/14",
  teal: "border-teal-soft/30 bg-teal-soft/14",
};

export function ProgressCard({ title, value, detail, tone = "blue" }: ProgressCardProps) {
  return (
    <article className={`rounded-lg border p-5 ${toneStyles[tone]}`}>
      <p className="text-sm font-semibold text-muted">{title}</p>
      <p className="mt-3 text-3xl font-bold text-blue-deep">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{detail}</p>
    </article>
  );
}
