"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { BarChart3, BookOpen, ChevronDown, Keyboard, Layers3, Library, Music2, Route, WalletCards } from "lucide-react";

const navItems = [
  { href: "/biblioteca", label: "Biblioteca", icon: Library },
  { href: "/progreso", label: "Progreso", icon: BarChart3 },
  { href: "/pricing", label: "Planes", icon: WalletCards },
];

const learningMenuSections = [
  {
    title: "Rutas",
    icon: Route,
    items: [
      { href: "/rutas", label: "Todas las rutas", description: "Mapa general de aprendizaje" },
      { href: "/rutas/piano-desde-cero", label: "Piano desde cero", description: "Secuencia inicial guiada" },
      { href: "/rutas/acompanamiento-con-acordes", label: "Acompañamiento", description: "Camino para tocar canciones" },
    ],
  },
  {
    title: "Módulos",
    icon: Layers3,
    items: [
      { href: "/modulos/keyboard-notes", label: "Teclado y notas", description: "Base visual del piano" },
      { href: "/modulos/basic-rhythm", label: "Ritmo básico", description: "Pulso, beat y timing" },
      { href: "/modulos/chord-construction", label: "Construcción de acordes", description: "Tríadas mayores y menores" },
      { href: "/modulos/harmonic-field", label: "Campo armónico", description: "Grados y progresiones" },
    ],
  },
  {
    title: "Práctica",
    icon: Keyboard,
    items: [
      { href: "/lecciones/tus-primeras-5-notas", label: "Primera lección", description: "Lectura + teclado" },
      { href: "/biblioteca/himno-a-la-alegria", label: "Canción guiada", description: "Practicar con repertorio" },
      { href: "/progreso", label: "Ver progreso", description: "Estado local de práctica" },
    ],
  },
];

const placeholderUserInitials = "TU";

export function SiteHeader() {
  const pathname = usePathname();
  const [isLearningMenuOpen, setIsLearningMenuOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLearningActive = pathname.startsWith("/rutas") || pathname.startsWith("/modulos");

  function openLearningMenu() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsLearningMenuOpen(true);
  }

  function scheduleLearningMenuClose() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setIsLearningMenuOpen(false);
      closeTimerRef.current = null;
    }, 180);
  }

  function closeLearningMenu() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsLearningMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-blue-deep/10 bg-ivory/94 shadow-[0_1px_0_rgba(18,52,91,0.04)] backdrop-blur-xl">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-2 sm:px-4 lg:px-6 xl:px-8">
        <Link
          href="/"
          className="focus-ring group inline-flex min-w-0 shrink-0 items-center gap-2 rounded-xl pr-1 sm:gap-3"
          aria-label="Ir al inicio de Piano Claro"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-deep text-white shadow-[0_10px_24px_rgba(18,52,91,0.18)] transition group-hover:bg-[#0d2949]">
            <Music2 aria-hidden="true" className="h-5 w-5" />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="block truncate text-base font-black tracking-normal text-blue-deep">Piano Claro</span>
            <span className="block text-[11px] font-bold uppercase text-muted">Aprende entendiendo</span>
          </span>
        </Link>

        <nav
          aria-label="Navegación principal"
          className="flex min-w-0 items-center justify-end rounded-2xl border border-blue-deep/10 bg-white/62 p-1 shadow-[0_10px_24px_rgba(18,52,91,0.06)]"
        >
          <div
            className="relative"
            onMouseEnter={openLearningMenu}
            onMouseLeave={scheduleLearningMenuClose}
            onFocus={openLearningMenu}
          >
            <button
              type="button"
              aria-label="Abrir menú de aprendizaje"
              aria-expanded={isLearningMenuOpen}
              aria-haspopup="menu"
              onClick={() => setIsLearningMenuOpen((current) => !current)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  closeLearningMenu();
                }
              }}
              className={`focus-ring inline-flex min-h-10 min-w-10 shrink-0 items-center justify-center gap-2 rounded-xl px-2.5 text-sm font-bold transition sm:px-3 md:min-w-0 md:px-4 ${
                isLearningActive || isLearningMenuOpen
                  ? "bg-blue-deep text-white shadow-[0_10px_24px_rgba(18,52,91,0.14)]"
                  : "text-muted hover:bg-blue-soft/45 hover:text-blue-deep"
              }`}
            >
              <BookOpen aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span className="hidden md:inline">Aprender</span>
              <ChevronDown
                aria-hidden="true"
                className={`hidden h-3.5 w-3.5 transition md:block ${isLearningMenuOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`) ||
              (item.href === "/rutas" && pathname.startsWith("/modulos")) ||
              (item.href === "/biblioteca" && pathname.startsWith("/lecciones"));

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                className={`focus-ring inline-flex min-h-10 min-w-10 shrink-0 items-center justify-center gap-2 rounded-xl px-2.5 text-sm font-bold transition sm:px-3 md:min-w-0 md:px-4 ${
                  isActive
                    ? "bg-blue-deep text-white shadow-[0_10px_24px_rgba(18,52,91,0.14)]"
                    : "text-muted hover:bg-blue-soft/45 hover:text-blue-deep"
                }`}
              >
                <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label="Perfil de usuario"
          className="focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-full border border-blue-deep/10 bg-blue-deep text-xs font-black uppercase text-white shadow-[0_10px_24px_rgba(18,52,91,0.16)] transition hover:bg-[#0d2949]"
        >
          {placeholderUserInitials}
        </button>

        {isLearningMenuOpen ? (
          <div
            role="menu"
            onMouseEnter={openLearningMenu}
            onMouseLeave={scheduleLearningMenuClose}
            className="absolute left-3 right-3 top-full z-50 pt-2 sm:left-4 sm:right-4 lg:left-auto lg:right-6 lg:w-[760px] xl:right-8"
          >
            <div className="grid gap-2 rounded-3xl border border-blue-deep/10 bg-white/96 p-3 shadow-[0_24px_70px_rgba(18,52,91,0.18)] backdrop-blur-xl md:grid-cols-3">
              {learningMenuSections.map((section) => {
                const Icon = section.icon;
                return (
                  <section key={section.title} className="rounded-2xl bg-ivory p-3">
                    <div className="flex items-center gap-2 px-1 pb-2">
                      <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-soft text-blue-deep">
                        <Icon aria-hidden="true" className="h-4 w-4" />
                      </span>
                      <h2 className="text-sm font-black text-blue-deep">{section.title}</h2>
                    </div>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          onClick={closeLearningMenu}
                          className="focus-ring block rounded-xl px-3 py-2 transition hover:bg-white"
                        >
                          <span className="block text-sm font-bold text-blue-deep">{item.label}</span>
                          <span className="mt-0.5 block text-xs font-semibold leading-4 text-muted">
                            {item.description}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
