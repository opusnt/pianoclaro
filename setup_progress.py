import os

os.makedirs('src/lib/progress', exist_ok=True)

with open('src/lib/progress/types.ts', 'w') as f:
    f.write("""export type ModuleMastery = {
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

export type ProgressState = {
  mastery: ModuleMastery;
  stats: UserStats;
  badges: string[];
  completedLessons: string[];
};

export interface IProgressProvider {
  loadState(): Promise<ProgressState | null>;
  saveState(state: ProgressState): Promise<void>;
}
""")

with open('src/lib/progress/LocalStorageProvider.ts', 'w') as f:
    f.write("""import { IProgressProvider, ProgressState } from "./types";

export class LocalStorageProgressProvider implements IProgressProvider {
  async loadState(): Promise<ProgressState | null> {
    if (typeof window === "undefined") return null;
    
    try {
      // First try to load the unified state
      const unifiedState = localStorage.getItem("piano_claro_global_state");
      if (unifiedState) {
        return JSON.parse(unifiedState) as ProgressState;
      }
      
      // Fallback: try to load from legacy split keys to migrate them
      const m = localStorage.getItem("mastery.module1");
      const s = localStorage.getItem("mastery.stats");
      const b = localStorage.getItem("mastery.badges");
      const c = localStorage.getItem("piano_claro_progress");
      
      if (m || s || b || c) {
        const legacyState: ProgressState = {
          mastery: m ? JSON.parse(m) : undefined,
          stats: s ? JSON.parse(s) : undefined,
          badges: b ? JSON.parse(b) : [],
          completedLessons: c ? JSON.parse(c) : []
        };
        
        // Save the unified state for next time
        await this.saveState(legacyState);
        return legacyState;
      }
      
      return null;
    } catch (error) {
      console.error("Error loading progress from localStorage", error);
      return null;
    }
  }

  async saveState(state: ProgressState): Promise<void> {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.setItem("piano_claro_global_state", JSON.stringify(state));
    } catch (error) {
      console.error("Error saving progress to localStorage", error);
    }
  }
}
""")

print("Created types.ts and LocalStorageProvider.ts")
