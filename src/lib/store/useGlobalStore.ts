import { create } from "zustand";

interface GlobalState {
  score: number;
  addScore: (points: number) => void;
  resetSession: () => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  score: 0,
  addScore: (points) => set((state) => ({ score: state.score + points })),
  resetSession: () => set({ score: 0 }),
}));
