import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className = "", hoverable = false }: CardProps) {
  return (
    <div
      className={`bg-white rounded-3xl p-6 sm:p-8 lg:p-12 shadow-[0_20px_40px_rgba(18,52,91,0.08)] border border-slate-100 ${hoverable ? "hover:shadow-[0_30px_60px_rgba(18,52,91,0.12)] hover:border-slate-200 transition-all" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 ${className}`}
    >
      {children}
    </div>
  );
}
