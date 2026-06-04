import type { ElementType, ReactNode } from "react";

export function Heading({
  children,
  className = "",
  level = 2,
}: {
  children: ReactNode;
  className?: string;
  level?: 1 | 2 | 3 | 4;
}) {
  const Tag = `h${level}` as ElementType;
  const sizes = {
    1: "text-4xl sm:text-5xl mb-6",
    2: "text-2xl sm:text-3xl mb-4",
    3: "text-xl sm:text-2xl mb-3",
    4: "text-lg font-bold mb-2",
  };

  return (
    <Tag className={`font-black text-slate-900 tracking-tight ${sizes[level]} ${className}`}>
      {children}
    </Tag>
  );
}

export function Text({
  children,
  className = "",
  variant = "body",
}: {
  children: ReactNode;
  className?: string;
  variant?: "body" | "muted" | "label";
}) {
  const variants = {
    body: "text-lg text-slate-600 leading-relaxed",
    muted: "text-base text-slate-500",
    label: "text-sm font-bold tracking-wider uppercase text-sky-600",
  };

  return <p className={`${variants[variant]} ${className}`}>{children}</p>;
}
