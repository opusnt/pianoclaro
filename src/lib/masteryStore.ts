"use client";

import { useEffect, useState } from "react";

export type ModuleMastery = {
  notes: number;
  trebleClef: number;
  rhythm: number;
  measures: number;
  ties: number;
  dottedNotes: number;
};

export type UserStats = {
  totalXP: number;
  practiceTimeSecs: number;
  sessionsCompleted: number;
  currentStreak: number;
  bestStreak: number;
  lastPracticeDate: string | null;
};

const DEFAULT_MASTERY: ModuleMastery = {
  notes: 0,
  trebleClef: 0,
  rhythm: 0,
  measures: 0,
  ties: 0,
  dottedNotes: 0,
};

const DEFAULT_STATS: UserStats = {
  totalXP: 0,
  practiceTimeSecs: 0,
  sessionsCompleted: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastPracticeDate: null,
};

// Singleton para sincronización entre componentes si fuera necesario
let globalMastery = { ...DEFAULT_MASTERY };
let globalStats = { ...DEFAULT_STATS };
let globalBadges: string[] = [];

// Eventos para actualizar componentes suscritos
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

// Cargar estado inicial
if (typeof window !== "undefined") {
  try {
    const m = localStorage.getItem("mastery.module1");
    if (m) globalMastery = JSON.parse(m);

    const s = localStorage.getItem("mastery.stats");
    if (s) globalStats = JSON.parse(s);

    const b = localStorage.getItem("mastery.badges");
    if (b) globalBadges = JSON.parse(b);
  } catch (_e) {}
}

const saveState = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("mastery.module1", JSON.stringify(globalMastery));
    localStorage.setItem("mastery.stats", JSON.stringify(globalStats));
    localStorage.setItem("mastery.badges", JSON.stringify(globalBadges));
    emit();
  }
};

export function useMastery() {
  const [mastery, setMastery] = useState<ModuleMastery>(globalMastery);
  const [stats, setStats] = useState<UserStats>(globalStats);
  const [badges, setBadges] = useState<string[]>(globalBadges);

  useEffect(() => {
    const update = () => {
      setMastery({ ...globalMastery });
      setStats({ ...globalStats });
      setBadges([...globalBadges]);
    };
    listeners.add(update);
    return () => {
      listeners.delete(update);
    };
  }, []);

  const updateMastery = (skill: keyof ModuleMastery, amount: number) => {
    globalMastery[skill] = Math.max(0, Math.min(100, globalMastery[skill] + amount));
    saveState();
  };

  const addXP = (amount: number) => {
    globalStats.totalXP += amount;
    saveState();
  };

  const completeSession = (durationSecs: number) => {
    globalStats.sessionsCompleted += 1;
    globalStats.practiceTimeSecs += durationSecs;

    const today = new Date().toISOString().split("T")[0];
    if (globalStats.lastPracticeDate !== today) {
      if (globalStats.lastPracticeDate) {
        const last = new Date(globalStats.lastPracticeDate);
        const curr = new Date(today);
        const diffDays = Math.floor((curr.getTime() - last.getTime()) / (1000 * 3600 * 24));

        if (diffDays === 1) {
          globalStats.currentStreak += 1;
        } else if (diffDays > 1) {
          globalStats.currentStreak = 1;
        }
      } else {
        globalStats.currentStreak = 1;
      }
      globalStats.lastPracticeDate = today;
      globalStats.bestStreak = Math.max(globalStats.bestStreak, globalStats.currentStreak);
    }

    // Check badges
    checkBadges();

    saveState();
  };

  const checkBadges = () => {
    const addBadge = (id: string) => {
      if (!globalBadges.includes(id)) {
        globalBadges.push(id);
      }
    };

    if (globalStats.currentStreak >= 7) addBadge("streak-7");
    if (globalStats.sessionsCompleted >= 10) addBadge("sessions-10");
    if (globalStats.totalXP >= 1000) addBadge("xp-1000");

    const allMastered = Object.values(globalMastery).every((v) => v >= 90);
    if (allMastered) addBadge("mastery-all");
  };

  return {
    mastery,
    stats,
    badges,
    updateMastery,
    addXP,
    completeSession,
  };
}
