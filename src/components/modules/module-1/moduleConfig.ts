export type UnitStatus = "active" | "locked" | "soon";

export type UnitConfig = {
  unitId: string;
  title: string;
  subtitle: string;
  status: UnitStatus;
  estimatedDuration: string;
  isImplemented: boolean;
};

export type ModuleConfig = {
  moduleId: string;
  moduleTitle: string;
  moduleDescription: string;
  units: UnitConfig[];
};

export const module1Config: ModuleConfig = {
  moduleId: "module-1",
  moduleTitle: "Primer contacto con la música",
  moduleDescription: "Aprende qué es la música, sus propiedades, las notas y cómo se escribe.",
  units: [
    {
      unitId: "unit-1",
      title: "Unidad 1: ¿Qué es la música?",
      subtitle: "Diferencia entre sonido musical y ruido",
      status: "active",
      estimatedDuration: "5-7 min",
      isImplemented: true,
    },
    {
      unitId: "unit-2",
      title: "Unidad 2: Detective del sonido",
      subtitle: "Propiedades del sonido: altura, duración, intensidad y timbre",
      status: "active",
      estimatedDuration: "10 min",
      isImplemented: true,
    },
    {
      unitId: "unit-3",
      title: "Unidad 3: Los tres pilares",
      subtitle: "Melodía, armonía y ritmo",
      status: "active",
      estimatedDuration: "8 min",
      isImplemented: true,
    },
    {
      unitId: "unit-4",
      title: "Unidad 4: El mapa donde vive la música",
      subtitle: "Pentagrama, líneas, espacios y líneas adicionales",
      status: "active",
      estimatedDuration: "10 min",
      isImplemented: true,
    },
    {
      unitId: "unit-5",
      title: "Unidad 5: Las notas musicales",
      subtitle: "Do, Re, Mi, Fa, Sol, La, Si",
      status: "active",
      estimatedDuration: "15 min",
      isImplemented: true,
    },
    {
      unitId: "unit-6",
      title: "Unidad 6: La Clave de Sol",
      subtitle: "El punto de partida para leer",
      status: "active",
      estimatedDuration: "10 min",
      isImplemented: true,
    },
    {
      unitId: "unit-7",
      title: "Unidad 7: El tiempo en la música",
      subtitle: "Pulso, figuras rítmicas simples y duración",
      status: "active",
      estimatedDuration: "15 min",
      isImplemented: true,
    },
    {
      unitId: "unit-8",
      title: "Unidad 8: Construyendo compases",
      subtitle: "Compás, barra divisoria y fórmula de compás",
      status: "active",
      estimatedDuration: "10 min",
      isImplemented: true,
    },
    {
      unitId: "unit-9",
      title: "Unidad 9: Ligadura y puntillo",
      subtitle: "Prolongación del sonido y aumento de duración",
      status: "active",
      estimatedDuration: "8 min",
      isImplemented: true,
    },
  ],
};
