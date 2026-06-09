"use client";

import { BarChart3, BookOpen, Keyboard, Layers3, Library, Music2, Route } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

const navItems = [
  { href: "/teoria", label: "Teoría", icon: BookOpen },
  { href: "/cursos", label: "Curso Piano", icon: Keyboard },
  { href: "/repertorio", label: "Canciones", icon: Library },
  { href: "/progreso", label: "Progreso", icon: BarChart3 },
];

const _learningMenuSections = [
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
  const [_isLearningMenuOpen, setIsLearningMenuOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const _isLearningActive =
    pathname.startsWith("/rutas") ||
    pathname.startsWith("/modulos") ||
    pathname.startsWith("/lecciones");

  function _openLearningMenu() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsLearningMenuOpen(true);
  }

  function _scheduleLearningMenuClose() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setIsLearningMenuOpen(false);
      closeTimerRef.current = null;
    }, 180);
  }

  function _closeLearningMenu() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsLearningMenuOpen(false);
  }

  return (
    <header className="hidden md:block sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-300 bg-[#070b14]/70 border-white/10">
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
