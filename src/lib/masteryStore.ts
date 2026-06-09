"use client";

import { useEffect, useState } from "react";
import { SupabaseProgressProvider } from "./progress/SupabaseProgressProvider";
import { ModuleMastery, UserStats, ProgressState } from "./progress/types";

export type { ModuleMastery, UserStats };

const DEFAULT_MASTERY: ModuleMastery = {
  notes: 0,
  trebleClef: 0,
  rhythm: 0,
  measures: 0,
  ties: 0,
  dottedNotes: 0,
  chords: 0,
  earTraining: 0,
  scales: 0,
};

const DEFAULT_STATS: UserStats = {
  totalXP: 0,
  practiceTimeSecs: 0,
  sessionsCompleted: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastPracticeDate: null,
  practiceHistory: [],
  unlockedSongs: [],
};

const DEFAULT_STATE: ProgressState = {
  mastery: DEFAULT_MASTERY,
  stats: DEFAULT_STATS,
  badges: [],
  completedLessons: [],
};

// Instancia del proveedor
const provider = new SupabaseProgressProvider();

// Singleton local
let globalState: ProgressState = { ...DEFAULT_STATE };
let isLoaded = false;

// Sistema de suscripción
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

// Inicialización asíncrona
if (typeof window !== "undefined") {
  provider.loadState().then((saved) => {
    if (saved) {
      globalState = saved;
      // Asegurar que existan todos los campos (migración)
      if (!globalState.mastery) globalState.mastery = { ...DEFAULT_MASTERY };
      if (!globalState.stats) globalState.stats = { ...DEFAULT_STATS };
      if (!globalState.badges) globalState.badges = [];
      if (!globalState.completedLessons) globalState.completedLessons = [];
    }
    isLoaded = true;
    emit();
  });
}

const saveState = () => {
  if (typeof window !== "undefined") {
    provider.saveState(globalState);
    emit();
  }
};

export function useMastery() {
  const [state, setState] = useState<ProgressState>(globalState);
  const [loaded, setLoaded] = useState(isLoaded);

  useEffect(() => {
    const update = () => {
      setState({ ...globalState });
      setLoaded(isLoaded);
    };
    listeners.add(update);
    // Para forzar el renderizado inicial en caso de que isLoaded cambiara justo antes de montar
    update();
    return () => {
      listeners.delete(update);
    };
  }, []);

  const updateMastery = (skill: keyof ModuleMastery, amount: number) => {
    globalState.mastery[skill] = Math.max(0, Math.min(100, globalState.mastery[skill] + amount));
    saveState();
  };

  const addXP = (amount: number) => {
    globalState.stats.totalXP += amount;
    saveState();
  };

  const completeSession = (durationSecs: number) => {
    globalState.stats.sessionsCompleted += 1;
    globalState.stats.practiceTimeSecs += durationSecs;

    const today = new Date().toISOString().split("T")[0];
    if (globalState.stats.lastPracticeDate !== today) {
      if (globalState.stats.lastPracticeDate) {
        const last = new Date(globalState.stats.lastPracticeDate);
        const curr = new Date(today);
        const diffDays = Math.floor((curr.getTime() - last.getTime()) / (1000 * 3600 * 24));

        if (diffDays === 1) {
          globalState.stats.currentStreak += 1;
        } else if (diffDays > 1) {
          globalState.stats.currentStreak = 1;
        }
      } else {
        globalState.stats.currentStreak = 1;
      }
      globalState.stats.lastPracticeDate = today;
      globalState.stats.bestStreak = Math.max(globalState.stats.bestStreak, globalState.stats.currentStreak);
      
      if (!globalState.stats.practiceHistory) {
        globalState.stats.practiceHistory = [];
      }
      if (!globalState.stats.practiceHistory.includes(today)) {
        globalState.stats.practiceHistory.push(today);
      }
    }

    checkBadges();
    saveState();
  };

  const checkBadges = () => {
    const addBadge = (id: string) => {
      if (!globalState.badges.includes(id)) {
        globalState.badges.push(id);
      }
    };

    if (globalState.stats.currentStreak >= 7) addBadge("streak-7");
    if (globalState.stats.sessionsCompleted >= 10) addBadge("sessions-10");
    if (globalState.stats.totalXP >= 1000) addBadge("xp-1000");

    const allMastered = Object.values(globalState.mastery).every((v) => v >= 90);
    if (allMastered) addBadge("mastery-all");
  };

  const markLessonCompleted = (lessonId: string) => {
    if (!globalState.completedLessons.includes(lessonId)) {
      globalState.completedLessons.push(lessonId);
      saveState();
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return globalState.completedLessons.includes(lessonId);
  };

  const unlockSong = (songId: string, cost: number) => {
    if (globalState.stats.totalXP >= cost) {
      if (!globalState.stats.unlockedSongs) {
        globalState.stats.unlockedSongs = [];
      }
      if (!globalState.stats.unlockedSongs.includes(songId)) {
        globalState.stats.unlockedSongs.push(songId);
        globalState.stats.totalXP -= cost; // Restar el costo de XP
        saveState();
        return true;
      }
    }
    return false;
  };

  return {
    mastery: state.mastery,
    stats: state.stats,
    badges: state.badges,
    completedLessons: state.completedLessons,
    isLoaded: loaded,
    updateMastery,
    addXP,
    completeSession,
    markLessonCompleted,
    isLessonCompleted,
    unlockSong,
  };
}
