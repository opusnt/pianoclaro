"use client";

import {
  BarChart3,
  BookOpen,
  ChevronDown,
  Keyboard,
  Layers3,
  Library,
  Music2,
  Route,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

import { firstFiveNotesModuleId, keyboardNotesLessonSlug } from "@/data/learning-slugs";

const navItems = [
  { href: "/repertorio", label: "Repertorio", icon: Library },
  { href: "/progreso", label: "Progreso", icon: BarChart3 },
  { href: "/pricing", label: "Planes", icon: WalletCards },
];

const learningMenuSections = [
  {
    title: "Módulos de Aprendizaje",
    icon: Layers3,
    items: [
      {
        href: "/modulos/1",
        label: "Módulo 1: Fundamentos",
        description: "Sonido, ritmo, pentagrama y notas",
      },
      {
        href: "#",
        label: "Módulo 2: Acordes (Próximamente)",
        description: "Armonía y acompañamiento",
      },
      {
        href: "/legacy/modulos",
        label: "Catálogo Legacy",
        description: "Prototipos y conceptos sueltos",
      },
    ],
  },
  {
    title: "Rutas Guiadas",
    icon: Route,
    items: [
      {
        href: "/legacy/rutas",
        label: "Explorar rutas",
        description: "Mapas de aprendizaje sugeridos",
      },
      {
        href: "/legacy/rutas/piano-desde-cero",
        label: "Piano desde cero",
        description: "La ruta ideal para principiantes",
      },
      {
        href: "/legacy/rutas/acompanamiento-con-acordes",
        label: "Acompañamiento",
        description: "Camino para tocar canciones",
      },
    ],
  },
  {
    title: "Práctica y Repertorio",
    icon: Keyboard,
    items: [
      {
        href: "/modulos/1/unidad-9",
        label: "Entrenamiento (Módulo 1)",
        description: "Practica lectura y ritmo",
      },
      {
        href: "/repertorio",
        label: "Repertorio OSMD",
        description: "Partituras y XML",
      },
      {
        href: "/legacy/lecciones",
        label: "Lecciones sueltas (Legacy)",
        description: "Minijuegos antiguos",
      },
    ],
  },
];

const placeholderUserInitials = "PC";

export function SiteHeader() {
  const pathname = usePathname();
  const [isLearningMenuOpen, setIsLearningMenuOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLearningActive =
    pathname.startsWith("/rutas") ||
    pathname.startsWith("/modulos") ||
    pathname.startsWith("/lecciones");

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
    <header className="sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-300 bg-[#070b14]/70 border-white/10">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-2 sm:px-4 lg:px-6 xl:px-8">
        <Link
          href="/"
          className="focus-ring group inline-flex min-w-0 shrink-0 items-center gap-2 rounded-xl pr-1 sm:gap-3"
          aria-label="Ir al inicio de Piano Claro"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white shadow-[0_10px_24px_rgba(18,52,91,0.18)] transition bg-gradient-to-br from-cyan-500 to-blue-600 group-hover:from-cyan-400 group-hover:to-blue-500">
            <Music2 aria-hidden="true" className="h-5 w-5" />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="block truncate text-base font-black tracking-normal transition-colors text-white">
              Piano Claro
            </span>
            <span className="block text-[11px] font-bold uppercase text-cyan-300/80">
              Aprende entendiendo
            </span>
          </span>
        </Link>

        <nav
          aria-label="Navegación principal"
          className="flex min-w-0 items-center justify-end rounded-2xl border p-1 shadow-[0_10px_24px_rgba(18,52,91,0.06)] transition-colors bg-white/10 border-white/10"
        >
          <button
            type="button"
            className="relative"
            onMouseEnter={openLearningMenu}
            onMouseLeave={scheduleLearningMenuClose}
            onFocus={openLearningMenu}
            aria-label="Abrir menú de aprendizaje"
            aria-expanded={isLearningMenuOpen}
            aria-haspopup="menu"
            onClick={openLearningMenu}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                closeLearningMenu();
              }
            }}
          >
            <div
              className={`focus-ring inline-flex min-h-10 min-w-10 shrink-0 items-center justify-center gap-2 rounded-xl px-2.5 text-sm font-bold transition sm:px-3 md:min-w-0 md:px-4 ${
                isLearningActive || isLearningMenuOpen
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <BookOpen aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span className="hidden md:inline">Aprender</span>
              <ChevronDown
                aria-hidden="true"
                className={`hidden h-3.5 w-3.5 transition md:block ${isLearningMenuOpen ? "rotate-180" : ""}`}
              />
            </div>
            
            {isLearningMenuOpen ? (
              <div
                role="menu"
                onMouseEnter={openLearningMenu}
                onMouseLeave={scheduleLearningMenuClose}
                className="absolute left-3 right-3 top-full z-50 pt-2 sm:left-4 sm:right-4 lg:left-auto lg:right-6 lg:w-[760px] xl:right-8"
              >
                <div className="grid gap-2 rounded-3xl border p-3 shadow-[0_24px_70px_rgba(18,52,91,0.18)] backdrop-blur-xl md:grid-cols-3 bg-[#070b14]/90 border-white/10">
                  {learningMenuSections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <section key={section.title} className="rounded-2xl p-3 bg-white/5">
                        <div className="flex items-center gap-2 px-1 pb-2">
                          <span className="grid h-8 w-8 place-items-center rounded-xl bg-cyan-500/20 text-cyan-400">
                            <Icon aria-hidden="true" className="h-4 w-4" />
                          </span>
                          <h2 className="text-sm font-black text-white">{section.title}</h2>
                        </div>
                        <div className="space-y-1">
                          {section.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              role="menuitem"
                              onClick={closeLearningMenu}
                              className="focus-ring block rounded-xl px-3 py-2 transition hover:bg-white/10"
                            >
                              <span className="block text-sm font-bold text-slate-200">
                                {item.label}
                              </span>
                              <span className="mt-0.5 block text-xs font-semibold leading-4 text-slate-400">
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
          </button>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`) ||
              (item.href === "/rutas" && pathname.startsWith("/modulos"));

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                className={`focus-ring inline-flex min-h-10 min-w-10 shrink-0 items-center justify-center gap-2 rounded-xl px-2.5 text-sm font-bold transition sm:px-3 md:min-w-0 md:px-4 ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
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
          className="focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-full border text-xs font-black uppercase text-white shadow-[0_10px_24px_rgba(18,52,91,0.16)] transition bg-fuchsia-600 border-fuchsia-500/30 hover:bg-fuchsia-500 shadow-[0_0_15px_rgba(236,72,153,0.3)]"
        >
          {placeholderUserInitials}
        </button>
      </div>
    </header>
  );
}
