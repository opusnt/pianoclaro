"use client";

import { BarChart3, BookOpen, Home, Keyboard, Library } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const pathname = usePathname();
  const navItems = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/teoria", label: "Teoría", icon: BookOpen },
    { href: "/cursos", label: "Curso Piano", icon: Keyboard },
    { href: "/repertorio", label: "Canciones", icon: Library },
    { href: "/progreso", label: "Progreso", icon: BarChart3 },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 bg-[#070b14]/90 backdrop-blur-xl border-t border-white/10 pb-safe">
      <div className="flex justify-around items-center px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                isActive ? "text-cyan-400" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Icon
                className={`w-6 h-6 ${isActive ? "drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" : ""}`}
              />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
