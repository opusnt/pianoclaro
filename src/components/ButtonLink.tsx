import type { LucideIcon } from "lucide-react";
import Link from "next/link";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

const variants = {
  primary: "bg-blue-deep text-white shadow-soft hover:bg-[#0d2949] focus-visible:outline-blue-deep",
  secondary:
    "border border-blue-deep/20 bg-white/72 text-blue-deep hover:border-blue-deep/45 hover:bg-white",
  ghost: "text-blue-deep hover:bg-blue-soft/50",
};

export function ButtonLink({
  href,
  children,
  icon: Icon,
  variant = "primary",
  className = "",
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition ${variants[variant]} ${className}`}
    >
      {Icon ? <Icon aria-hidden="true" className="h-4 w-4" /> : null}
      {children}
    </Link>
  );
}
