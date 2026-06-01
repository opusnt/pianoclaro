import { keyboardNotesLessonSlug } from "@/data/learning-slugs";
import type { LearningExperience } from "@/types/learning-experience";

export const learningExperiences: LearningExperience[] = [
  {
    id: "experience-first-five-notes",
    unitId: "unit-01-keyboard-reading",
    trackId: "piano-lessons",
    status: "active",
    title: "Tus primeras 5 notas como sesión autónoma",
    entryRoute: `/lecciones/${keyboardNotesLessonSlug}`,
    summary:
      "Divide la primera lección en páginas de observación, práctica por compás, unión de frase y autoevaluación.",
    pages: [
      {
        id: "first-five-notes-map",
        order: 1,
        kind: "discover",
        title: "Ubica el mapa antes de tocar",
        goal: "Reconocer DO-RE-MI-FA-SOL en partitura y teclado sin empezar todavía la canción.",
        unlocksNextWhen: ["El usuario puede señalar DO y distinguir si la melodía sube o repite."],
        activities: [
          {
            id: "observe-do-re-mi-fa-sol",
            type: "observe_pattern",
            title: "Mira la dirección",
            prompt: "Observa las cinco notas y decide si la frase sube, baja o repite.",
            userAction: "Comparar la partitura con el teclado resaltado antes de tocar.",
            inputModes: ["none"],
            feedbackModes: ["visual", "hint"],
            successCriteria: [
              "Identifica DO como punto de partida.",
              "Reconoce el movimiento ascendente.",
            ],
            estimatedSeconds: 45,
          },
          {
            id: "tap-five-notes-slow",
            type: "tap_notes",
            title: "Toca una vez cada nota",
            prompt: "Toca DO-RE-MI-FA-SOL lentamente, sin ritmo todavía.",
            userAction: "Tocar cada nota resaltada en el teclado virtual.",
            inputModes: ["virtual-keyboard", "computer-keyboard"],
            feedbackModes: ["visual", "audio", "answer-check"],
            successCriteria: [
              "Toca las cinco notas correctas.",
              "Corrige una nota si aparece error visual.",
            ],
            repairHint: "Si confundes DO, vuelve a mirar el grupo de dos teclas negras.",
            estimatedSeconds: 75,
          },
        ],
      },
      {
        id: "first-five-notes-measure-practice",
        order: 2,
        kind: "guided-practice",
        title: "Practica por compases",
        goal: "Tocar la lección en fragmentos pequeños antes de unirla completa.",
        unlocksNextWhen: [
          "Completa cada compás con notas correctas y sin perder la dirección visual.",
        ],
        activities: [
          {
            id: "play-measure-one",
            type: "play_sequence",
            title: "Compás 1",
            prompt: "Toca solo el primer compás y espera feedback.",
            userAction: "Tocar la secuencia del compás activo.",
            inputModes: ["virtual-keyboard", "computer-keyboard"],
            feedbackModes: ["visual", "audio", "answer-check"],
            successCriteria: ["Completa el compás 1.", "No avanza si una nota queda incorrecta."],
            repairHint: "Repite mirando si la nota escrita sube, baja o queda igual.",
            estimatedSeconds: 90,
          },
          {
            id: "play-measure-two",
            type: "play_sequence",
            title: "Compás 2",
            prompt: "Toca solo el segundo compás y compara el patrón con el anterior.",
            userAction: "Tocar la secuencia del compás activo.",
            inputModes: ["virtual-keyboard", "computer-keyboard"],
            feedbackModes: ["visual", "audio", "answer-check"],
            successCriteria: ["Completa el compás 2.", "Reconoce si el patrón se repite o cambia."],
            repairHint: "Aísla las dos primeras notas del compás antes de tocarlo entero.",
            estimatedSeconds: 90,
          },
        ],
      },
      {
        id: "first-five-notes-application",
        order: 3,
        kind: "application",
        title: "Une la frase",
        goal: "Cerrar la lección tocando la mini frase completa y comprobando autonomía.",
        unlocksNextWhen: ["La frase completa se toca con notas correctas y feedback positivo."],
        activities: [
          {
            id: "play-full-mini-phrase",
            type: "play_sequence",
            title: "Frase completa",
            prompt: "Toca ambos compases seguidos.",
            userAction: "Tocar la frase completa desde la partitura.",
            inputModes: ["virtual-keyboard", "computer-keyboard"],
            feedbackModes: ["visual", "audio", "answer-check"],
            successCriteria: [
              "Completa todos los eventos de la frase.",
              "Mantiene el orden de notas.",
            ],
            estimatedSeconds: 120,
          },
          {
            id: "first-five-notes-self-check",
            type: "self_check",
            title: "Comprueba si puedes avanzar",
            prompt:
              "Responde mentalmente: ¿encontré DO por patrón y no por memoria visual de pantalla?",
            userAction: "Confirmar si puede repetir la frase sin etiquetas constantes.",
            inputModes: ["multiple-choice"],
            feedbackModes: ["reflection", "hint"],
            successCriteria: [
              "Puede explicar cómo encontró DO.",
              "Puede repetir la frase sin guía completa.",
            ],
            repairHint: "Si no, vuelve a la página del mapa y toca las cinco notas sin canción.",
            estimatedSeconds: 45,
          },
        ],
      },
    ],
  },
  {
    id: "experience-chord-construction",
    unitId: "unit-08-chords",
    trackId: "music-theory",
    status: "active",
    title: "Construcción de acordes por actividades",
    entryRoute: "/modulos/chord-construction",
    summary:
      "Convierte el módulo de acordes en páginas de escucha, construcción, comparación y checkpoint.",
    pages: [
      {
        id: "chords-note-vs-chord",
        order: 1,
        kind: "discover",
        title: "Distingue nota sola y acorde",
        goal: "Entender con audio que un acorde son varias notas sonando juntas.",
        unlocksNextWhen: ["El usuario identifica nota sola vs acorde en varias rondas."],
        activities: [
          {
            id: "listen-single-vs-chord",
            type: "listen_compare",
            title: "Escucha A y B",
            prompt: "Escucha una nota sola y luego tres notas juntas.",
            userAction: "Elegir si sonó una nota sola o un acorde.",
            inputModes: ["audio-choice", "multiple-choice"],
            feedbackModes: ["audio", "answer-check"],
            successCriteria: [
              "Distingue nota sola de acorde.",
              "Puede repetir audio antes de responder.",
            ],
            repairHint: "Escucha el ataque: en el acorde aparecen varias alturas al mismo tiempo.",
            estimatedSeconds: 90,
          },
        ],
      },
      {
        id: "chords-build-c-major",
        order: 2,
        kind: "guided-practice",
        title: "Construye DO mayor",
        goal: "Formar una tríada seleccionando tónica, tercera y quinta.",
        unlocksNextWhen: ["Selecciona DO-MI-SOL y confirma el acorde."],
        activities: [
          {
            id: "select-c-major-notes",
            type: "confirm_chord",
            title: "Selecciona tres notas",
            prompt: "Construye DO mayor con DO, MI y SOL.",
            userAction: "Seleccionar tres teclas y confirmar el acorde.",
            inputModes: ["virtual-keyboard"],
            feedbackModes: ["visual", "audio", "answer-check", "hint"],
            successCriteria: [
              "Contiene DO, MI y SOL.",
              "No importa el orden de selección.",
              "No falta la tercera.",
            ],
            repairHint: "Si falta una nota, revisa tónica, tercera y quinta antes de confirmar.",
            estimatedSeconds: 120,
          },
        ],
      },
      {
        id: "chords-major-minor-checkpoint",
        order: 3,
        kind: "checkpoint",
        title: "Compara mayor y menor",
        goal: "Reconocer que la tercera cambia el color del acorde.",
        unlocksNextWhen: ["Completa el checkpoint con accuracy suficiente o entra a reparación."],
        activities: [
          {
            id: "choose-major-or-minor",
            type: "choose_answer",
            title: "Mayor o menor",
            prompt: "Escucha un acorde y decide si es mayor o menor.",
            userAction: "Elegir la opción correcta después de escuchar.",
            inputModes: ["audio-choice", "multiple-choice"],
            feedbackModes: ["audio", "answer-check", "hint"],
            successCriteria: [
              "Reconoce mayor vs menor.",
              "Identifica que la tercera está más cerca o más lejos.",
            ],
            repairHint: "Si confundes el color, escucha DO mayor y DO menor alternados.",
            estimatedSeconds: 120,
          },
          {
            id: "repair-chord-third",
            type: "repair_drill",
            title: "Reparación: encuentra la tercera",
            prompt: "Si fallas mayor/menor, toca solo tónica y tercera antes del acorde completo.",
            userAction: "Tocar la tónica y luego la tercera mayor o menor solicitada.",
            inputModes: ["virtual-keyboard"],
            feedbackModes: ["visual", "audio", "hint"],
            successCriteria: ["Distingue 3 y 4 semitonos desde la tónica."],
            estimatedSeconds: 90,
          },
        ],
      },
      {
        id: "chords-transfer",
        order: 4,
        kind: "application",
        title: "Usa el acorde en una decisión musical",
        goal: "Cerrar conectando fórmula, sonido y uso práctico.",
        unlocksNextWhen: ["Construye DO mayor y DO menor y explica qué nota cambió."],
        activities: [
          {
            id: "build-c-major-c-minor",
            type: "build_pattern",
            title: "Cambia una sola nota",
            prompt: "Construye DO mayor, luego cambia solo MI por MIb para formar DO menor.",
            userAction: "Modificar el acorde manteniendo tónica y quinta.",
            inputModes: ["virtual-keyboard"],
            feedbackModes: ["visual", "audio", "answer-check"],
            successCriteria: [
              "Mantiene DO y SOL.",
              "Cambia solo la tercera.",
              "Reconoce el cambio auditivo.",
            ],
            estimatedSeconds: 120,
          },
        ],
      },
    ],
  },
];

export function getLearningExperienceById(id: string) {
  return learningExperiences.find((experience) => experience.id === id);
}

export function getLearningExperiencesByTrack(trackId: LearningExperience["trackId"]) {
  return learningExperiences.filter((experience) => experience.trackId === trackId);
}

export function getLearningExperienceByUnitId(unitId: string) {
  return learningExperiences.find((experience) => experience.unitId === unitId);
}
