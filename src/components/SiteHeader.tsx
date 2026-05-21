import Link from "next/link";
import { BarChart3, BookOpen, CreditCard, Library, Music } from "lucide-react";

import { ButtonLink } from "@/components/ButtonLink";

const navItems = [
  { href: "/rutas", label: "Rutas", icon: BookOpen },
  { href: "/biblioteca", label: "Biblioteca", icon: Library },
  { href: "/progreso", label: "Progreso", icon: BarChart3 },
  { href: "/pricing", label: "Pricing", icon: CreditCard },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-blue-deep/10 bg-ivory/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="focus-ring inline-flex items-center gap-3 rounded-lg">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-deep text-white">
              <Music aria-hidden="true" className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-base font-bold text-blue-deep">Piano Claro</span>
              <span className="block text-xs text-muted">Aprende entendiendo</span>
            </span>
          </Link>
          <div className="hidden sm:block">
            <ButtonLink href="/rutas" variant="primary">
              Comenzar
            </ButtonLink>
          </div>
        </div>
        <nav className="-mx-2 flex gap-1 overflow-x-auto px-2 pb-1 sm:mx-0 sm:justify-end sm:px-0">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-muted transition hover:bg-white/70 hover:text-blue-deep"
            >
              <item.icon aria-hidden="true" className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
