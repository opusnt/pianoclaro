export type RouteAccent = "blue" | "gold" | "teal" | "rose";

export type Route = {
  slug: string;
  title: string;
  description: string;
  level: string;
  estimatedDuration: string;
  lessonCount: number;
  progress: number;
  accent: RouteAccent;
  lessonSlugs: string[];
};

export type SongTag = "lectura" | "acordes" | "ritmo" | "melodia";

export type SongSourceType = "propia" | "dominio-publico" | "creative-commons" | "inspiracion";

export type SongReadiness = "mvp" | "proxima" | "midi-futuro";

export type Song = {
  slug: string;
  title: string;
  composer?: string;
  level: string;
  concepts: string[];
  duration: string;
  tag: SongTag;
  sourceType: SongSourceType;
  sourceLabel: string;
  licenseLabel: string;
  readiness: SongReadiness;
  recommendedModule: string;
  pedagogicalUse: string;
  midiFileHint?: string;
  practiceSlug?: string;
};

export type PricingPlan = {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};
