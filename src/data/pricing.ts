import type { PricingPlan } from "@/types/learning";

export const pricingPlans: PricingPlan[] = [
  {
    id: "gratis",
    name: "Gratis",
    price: "$0",
    period: "para comenzar",
    description: "Primeras rutas, ejercicios guiados y progreso básico.",
    features: [
      "Acceso a lecciones iniciales",
      "Mini partituras guiadas",
      "Teclado visual",
      "Progreso local ficticio",
    ],
    cta: "Comenzar gratis",
  },
  {
    id: "estudiante",
    name: "Estudiante",
    price: "$8",
    period: "al mes",
    description: "Para estudiar con continuidad, repertorio y rutas completas.",
    features: [
      "Todas las rutas base",
      "Biblioteca por nivel",
      "Ejercicios de lectura y ritmo",
      "Seguimiento de práctica",
    ],
    cta: "Elegir estudiante",
    highlighted: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "$18",
    period: "al mes",
    description: "Incluye una futura capa de revisión humana y feedback avanzado.",
    features: [
      "Todo lo de Estudiante",
      "Revisión humana futura",
      "Feedback MIDI/audio futuro",
      "Plan de estudio personalizado",
    ],
    cta: "Ver premium",
  },
];
