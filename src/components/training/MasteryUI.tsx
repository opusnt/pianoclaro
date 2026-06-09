"use client";

import { Clock, Flame, Lock, Medal, Play, Star, Target } from "lucide-react";
import type { UserStats } from "@/lib/masteryStore";

export function SkillProgressBar({
  name,
  value,
  icon: Icon,
}: {
  name: string;
  value: number;
  icon: any;
}) {
  const colorClass = value >= 80 ? "bg-emerald-500" : value >= 50 ? "bg-amber-400" : "bg-rose-400";

  return (
    <div className="flex flex-col gap-2 w-full mb-4">
      <div className="flex justify-between items-center text-sm font-bold text-slate-600">
        <span className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-slate-400" />
          {name}
        </span>
        <span className={value >= 80 ? "text-emerald-500" : "text-slate-500"}>{value}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClass} transition-all duration-1000 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function PracticeStats({ stats }: { stats: UserStats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8">
      <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 flex flex-col items-center justify-center text-center">
        <Flame
          className={`w-8 h-8 mb-2 ${stats.currentStreak > 0 ? "text-orange-500" : "text-slate-300"}`}
          fill="currentColor"
        />
        <span className="text-2xl font-black text-slate-800">{stats.currentStreak}</span>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Racha Actual
        </span>
      </div>
      <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 flex flex-col items-center justify-center text-center">
        <Star className="w-8 h-8 mb-2 text-fuchsia-500" fill="currentColor" />
        <span className="text-2xl font-black text-slate-800">{stats.totalXP}</span>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">XP Total</span>
      </div>
      <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 flex flex-col items-center justify-center text-center">
        <Target className="w-8 h-8 mb-2 text-emerald-500" />
        <span className="text-2xl font-black text-slate-800">{stats.sessionsCompleted}</span>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sesiones</span>
      </div>
      <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 flex flex-col items-center justify-center text-center">
        <Clock className="w-8 h-8 mb-2 text-sky-500" />
        <span className="text-2xl font-black text-slate-800">
          {Math.floor(stats.practiceTimeSecs / 60)}m
        </span>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tiempo</span>
      </div>
    </div>
  );
}

const BADGES_DB = [
  { id: "streak-7", name: "Practicante Constante", desc: "7 días de racha" },
  { id: "sessions-10", name: "Entrenador", desc: "10 sesiones" },
  { id: "xp-1000", name: "Dedicación", desc: "1000 XP" },
  { id: "mastery-all", name: "Maestro Módulo 1", desc: "90% en todo" },
];

export function BadgeGallery({ earnedBadges }: { earnedBadges: string[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
      {BADGES_DB.map((badge) => {
        const isEarned = earnedBadges.includes(badge.id);
        return (
          <div
            key={badge.id}
            className={`flex flex-col items-center p-4 rounded-2xl border-2 text-center transition-all ${
              isEarned
                ? "bg-amber-50 border-amber-200"
                : "bg-slate-50 border-slate-100 opacity-60 grayscale"
            }`}
          >
            {isEarned ? (
              <Medal className="w-10 h-10 text-amber-500 mb-2" fill="currentColor" />
            ) : (
              <Lock className="w-8 h-8 text-slate-400 mb-3" />
            )}
            <span className={`text-sm font-bold ${isEarned ? "text-amber-700" : "text-slate-500"}`}>
              {badge.name}
            </span>
            <span className="text-xs text-slate-400 mt-1">{badge.desc}</span>
          </div>
        );
      })}
    </div>
  );
}

export function TrainingModeCard({
  title,
  subtitle,
  icon: Icon,
  colorClass,
  onClick,
}: {
  title: string;
  subtitle: string;
  icon: any;
  colorClass: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-start p-6 rounded-3xl border-2 border-slate-100 bg-white hover:border-transparent hover:shadow-xl transition-all hover:-translate-y-1 text-left w-full group relative overflow-hidden`}
    >
      <div
        className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full -translate-y-1/2 translate-x-1/3 ${colorClass.replace("text-", "bg-")}`}
      />

      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${colorClass.replace("text-", "bg-").replace("500", "100")}`}
      >
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>

      <h3 className="text-xl font-black text-slate-800 mb-1">{title}</h3>
      <p className="text-sm font-medium text-slate-500 mb-6">{subtitle}</p>

      <div
        className={`mt-auto flex items-center gap-2 text-sm font-bold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all ${colorClass}`}
      >
        <Play className="w-4 h-4" fill="currentColor" />
        Entrenar ahora
      </div>
    </button>
  );
}
