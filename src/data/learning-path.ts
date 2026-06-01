import { firstFiveNotesModuleId, keyboardNotesLessonSlug } from "@/data/learning-slugs";
import type {
  LearningExperienceTrack,
  LearningMasteryRubricLevel,
  LearningPracticeContract,
  LearningUnit,
  PedagogicalMoment,
} from "@/types/learning-path";

type LearningPracticeContractDraft = Omit<
  LearningPracticeContract,
  "diagnosticRules" | "masteryRubric"
>;

export const pedagogicalMoments: PedagogicalMoment[] = [
  {
    id: "observe",
    label: "Observa",
    productRule: "Mostrar patrón musical antes de pedir una respuesta.",
  },
  {
    id: "understand",
    label: "Entiende",
    productRule: "Nombrar una sola idea con lenguaje simple y accionable.",
  },
  {
    id: "practice",
    label: "Toca",
    productRule: "Pedir una acción inmediata en teclado, ritmo, opción auditiva o acorde.",
  },
  {
    id: "listen",
    label: "Escucha",
    productRule: "Reproducir el resultado esperado o comparar acierto/error.",
  },
  {
    id: "apply",
    label: "Usa",
    productRule: "Cerrar con mini canción, progresión, frase o reto creativo.",
  },
];

export const learningExperienceTracks: LearningExperienceTrack[] = [
  {
    id: "music-theory",
    title: "Teoría musical",
    shortLabel: "Teoría",
    description:
      "Módulos interactivos para entender patrones musicales con teclado, audio, feedback y desbloqueos.",
    href: "/modulos",
    primaryActionLabel: "Entrar a teoría musical",
    outcome:
      "Comprender notas, ritmo, intervalos, escalas, tonalidad, acordes e inversiones como habilidades tocables.",
    experienceRules: [
      "La explicación aparece justo antes de una acción.",
      "Cada ejercicio entrega feedback inmediato y progreso.",
      "La teoría se valida cuando puedes tocarla o reconocerla.",
    ],
  },
  {
    id: "piano-lessons",
    title: "Lecciones de piano",
    shortLabel: "Lecciones",
    description:
      "Lecciones guiadas para practicar lectura, coordinación y repertorio paso a paso dentro de una sesión autónoma.",
    href: "/lecciones",
    primaryActionLabel: "Entrar a lecciones de piano",
    outcome:
      "Leer una partitura simple, encontrar las teclas correctas, practicar por compases y tocar mini canciones.",
    experienceRules: [
      "Primero ves la partitura y la dirección musical.",
      "Luego tocas por fragmentos pequeños.",
      "Cierras aplicando lo aprendido en una frase o canción.",
    ],
  },
];

function buildMasteryRubric(
  exploring: string,
  practicing: string,
  ready: string,
): LearningMasteryRubricLevel[] {
  return [
    {
      id: "exploring",
      label: "Explorando",
      observableBehavior: exploring,
    },
    {
      id: "practicing",
      label: "En práctica",
      observableBehavior: practicing,
    },
    {
      id: "ready",
      label: "Listo para avanzar",
      observableBehavior: ready,
    },
  ];
}

function completePracticeContract(
  contract: LearningPracticeContractDraft,
): LearningPracticeContract {
  return {
    ...contract,
    diagnosticRules: [
      {
        symptom: `Tu respuesta todavía no es estable: ${contract.essentialQuestion}`,
        likelyCause:
          "Probablemente estás resolviendo de memoria, sin mirar primero la decisión musical.",
        intervention: contract.practicePlan[0]?.action ?? contract.transferChallenge,
      },
      {
        symptom: "Completas rondas, pero la idea no aparece cuando tocas fuera del ejercicio.",
        likelyCause: "La práctica quedó aislada del contexto musical real.",
        intervention: contract.transferChallenge,
      },
    ],
    masteryRubric: buildMasteryRubric(
      `Necesita ayuda para: ${contract.practicePlan[0]?.action ?? "iniciar la práctica"}`,
      `Puede ejecutar con pausas y autocorrección: ${contract.practicePlan[1]?.action ?? "resolver la consigna"}`,
      `Puede explicar la idea central y transferirla: ${contract.transferChallenge}`,
    ),
  };
}

function definePracticeContracts<T extends Record<string, LearningPracticeContractDraft>>(
  contracts: T,
): Record<keyof T & string, LearningPracticeContract> {
  return Object.fromEntries(
    Object.entries(contracts).map(([id, contract]) => [id, completePracticeContract(contract)]),
  ) as Record<keyof T & string, LearningPracticeContract>;
}

const learningPracticeContracts = definePracticeContracts({
  "unit-01-keyboard-reading": {
    essentialQuestion: "¿Puedo ubicar una nota por patrón visual antes de memorizar su nombre?",
    practicePlan: [
      {
        label: "Orientar",
        action: "Encuentra dos grupos de teclas negras y ubica DO a su izquierda.",
        successSignal: "Puedes encontrar DO en otra octava sin ayuda.",
      },
      {
        label: "Nombrar",
        action: "Toca DO-RE-MI-FA-SOL diciendo el nombre en voz baja.",
        successSignal: "No cambias dirección al pasar de MI a FA.",
      },
      {
        label: "Leer",
        action: "Replica una mini frase mirando dirección antes que etiquetas.",
        successSignal: "Corriges una nota equivocada usando el patrón visual.",
      },
    ],
    selfCheck: [
      "¿Encontré DO por las teclas negras?",
      "¿Sé si la melodía sube, baja o repite?",
      "¿Puedo tocar cinco notas sin mirar todas las etiquetas?",
    ],
    transferChallenge:
      "Crea una frase de cuatro notas usando solo DO-RE-MI-FA-SOL y termínala en DO.",
  },
  "unit-02-rhythm-pulse": {
    essentialQuestion: "¿Estoy tocando dentro del pulso o solo reaccionando al sonido?",
    practicePlan: [
      {
        label: "Escuchar",
        action: "Escucha un ciclo completo sin tocar y marca el pulso con el cuerpo.",
        successSignal: "Puedes anticipar el siguiente beat antes de escucharlo.",
      },
      {
        label: "Tocar",
        action: "Toca solo los beats activos manteniendo silencios reales.",
        successSignal: "Tu combo crece sin convertir silencios en notas.",
      },
      {
        label: "Ajustar",
        action: "Lee el feedback temprano/tarde y repite más lento si hace falta.",
        successSignal: "Tus errores se acercan al centro del beat.",
      },
    ],
    selfCheck: [
      "¿Puedo contar antes de tocar?",
      "¿Respeto los silencios?",
      "¿Sé si mi tendencia es tocar antes o después?",
    ],
    transferChallenge:
      "Toca DO en negras durante ocho beats y deja dos silencios intencionales sin perder el pulso.",
  },
  "unit-03-intervals": {
    essentialQuestion: "¿Puedo describir una distancia musical como dirección y cantidad?",
    practicePlan: [
      {
        label: "Base",
        action: "Nombra la nota inicial antes de responder.",
        successSignal: "No eliges destino sin ubicar el punto de partida.",
      },
      {
        label: "Distancia",
        action: "Cuenta semitonos o teclas hasta la nota objetivo.",
        successSignal: "Diferencias paso corto, salto medio y salto grande.",
      },
      {
        label: "Oído",
        action: "Escucha dos notas y decide si sube, baja o repite.",
        successSignal: "No confundes dirección aunque cambie la distancia.",
      },
    ],
    selfCheck: [
      "¿Sé cuál es la nota base?",
      "¿La segunda nota está a la derecha o izquierda?",
      "¿Puedo repetir el intervalo tocándolo?",
    ],
    transferChallenge:
      "Elige una nota y crea tres movimientos: misma nota, paso corto y salto grande.",
  },
  "unit-04-major-scale": {
    essentialQuestion: "¿Estoy siguiendo la fórmula mayor o recordando una lista?",
    practicePlan: [
      {
        label: "Patrón",
        action: "Di T-T-S-T-T-T-S antes de tocar.",
        successSignal: "Puedes anticipar dónde vienen los semitonos.",
      },
      {
        label: "Construir",
        action: "Avanza desde la tónica siguiendo 2 o 1 semitonos.",
        successSignal: "Completas la octava sin saltarte grados.",
      },
      {
        label: "Escuchar",
        action: "Reproduce la escala y detecta si alguna nota suena fuera.",
        successSignal: "Reconoces una escala mayor alterada.",
      },
    ],
    selfCheck: [
      "¿Sé cuál es la tónica?",
      "¿Puedo explicar por qué MI-FA es semitono?",
      "¿Puedo construir la escala desde SOL o FA?",
    ],
    transferChallenge:
      "Construye una frase ascendente de cuatro notas usando la escala mayor y vuelve a la tónica.",
  },
  "unit-05-minor-scales": {
    essentialQuestion: "¿Qué nota cambia para que el color deje de sonar mayor?",
    practicePlan: [
      {
        label: "Comparar",
        action: "Escucha mayor y menor poniendo atención a la tercera nota.",
        successSignal: "Puedes señalar la diferencia sin ver la respuesta.",
      },
      {
        label: "Natural",
        action: "Toca LA menor natural con el patrón T-S-T-T-S-T-T.",
        successSignal: "No necesitas alteraciones para completar LA menor natural.",
      },
      {
        label: "Variantes",
        action: "Resalta sexto y séptimo grado al comparar armónica y melódica.",
        successSignal: "Identificas qué grado sube en cada variante.",
      },
    ],
    selfCheck: [
      "¿Reconozco la tercera como cambio principal?",
      "¿Sé qué cambia en menor armónica?",
      "¿Sé qué cambia en menor melódica ascendente?",
    ],
    transferChallenge:
      "Toca LA menor natural y cambia solo el séptimo grado para escuchar la menor armónica.",
  },
  "unit-06-key-signatures": {
    essentialQuestion: "¿Estoy aplicando la armadura como regla global durante toda la escala?",
    practicePlan: [
      {
        label: "Regla",
        action: "Lee la tonalidad y nombra sus alteraciones fijas.",
        successSignal: "Puedes decir FA# en SOL mayor antes de tocar.",
      },
      {
        label: "Aplicar",
        action: "Construye la escala respetando cada alteración repetida.",
        successSignal: "No vuelves a tocar la nota natural por costumbre.",
      },
      {
        label: "Relacionar",
        action: "Busca la relativa mayor o menor comparando notas compartidas.",
        successSignal: "Puedes explicar por qué comparten armadura.",
      },
    ],
    selfCheck: [
      "¿Sé si la tonalidad usa sostenidos, bemoles o ninguno?",
      "¿Aplico la alteración cada vez que aparece esa nota?",
      "¿Puedo encontrar la relativa con 3 semitonos?",
    ],
    transferChallenge: "Toca SOL mayor y luego MI menor resaltando que ambas usan FA#.",
  },
  "unit-07-pentatonic": {
    essentialQuestion: "¿Puedo crear una frase musical usando solo cinco notas seguras?",
    practicePlan: [
      {
        label: "Reducir",
        action: "Compara DO mayor con DO pentatónica y detecta las dos notas omitidas.",
        successSignal: "Sabes por qué FA y SI no entran en DO pentatónica mayor.",
      },
      {
        label: "Frasear",
        action: "Toca frases cortas usando tres notas distintas y silencios.",
        successSignal: "No llenas todo el loop con notas seguidas.",
      },
      {
        label: "Resolver",
        action: "Termina algunas frases en la tónica.",
        successSignal: "La frase suena cerrada y estable.",
      },
    ],
    selfCheck: [
      "¿Me mantuve dentro de la pentatónica?",
      "¿Usé al menos tres notas distintas?",
      "¿Dejé espacios entre ideas?",
    ],
    transferChallenge:
      "Improvisa ocho beats con DO pentatónica y termina en DO o LA para comparar sensación.",
  },
  "unit-08-chords": {
    essentialQuestion: "¿Estoy construyendo el acorde por fórmula o por forma visual?",
    practicePlan: [
      {
        label: "Fórmula",
        action: "Nombra tónica, tercera y quinta antes de seleccionar notas.",
        successSignal: "Puedes explicar qué nota define mayor o menor.",
      },
      {
        label: "Construir",
        action: "Selecciona tres notas y confirma el acorde sin importar el orden.",
        successSignal: "No duplicas una nota dejando fuera la tercera.",
      },
      {
        label: "Escuchar",
        action: "Compara acorde mayor y menor desde la misma tónica.",
        successSignal: "Reconoces el cambio de tercera por oído.",
      },
    ],
    selfCheck: [
      "¿El acorde tiene tres nombres de nota distintos?",
      "¿La tercera está a 3 o 4 semitonos?",
      "¿La quinta está presente?",
    ],
    transferChallenge: "Construye DO mayor, DO menor y describe qué nota cambió.",
  },
  "unit-09-inversions": {
    essentialQuestion: "¿El acorde cambió o solo cambió la nota que quedó abajo?",
    practicePlan: [
      {
        label: "Comparar",
        action: "Ordena las mismas notas desde distintas notas graves.",
        successSignal: "Reconoces el acorde aunque cambie la disposición.",
      },
      {
        label: "Bajo",
        action: "Identifica la nota más grave antes de nombrar la inversión.",
        successSignal: "No llamas acorde nuevo a una inversión.",
      },
      {
        label: "Mover",
        action: "Toca una progresión usando posiciones cercanas.",
        successSignal: "Tus manos se desplazan menos entre acordes.",
      },
    ],
    selfCheck: [
      "¿Las pitch classes son las mismas?",
      "¿Sé cuál nota está en el bajo?",
      "¿La inversión reduce movimiento?",
    ],
    transferChallenge: "Toca DO-G-LAm-FA primero en fundamental y luego con inversiones cercanas.",
  },
  "unit-10-harmonic-field": {
    essentialQuestion: "¿Puedo convertir una escala en un mapa de acordes por grados?",
    practicePlan: [
      {
        label: "Derivar",
        action: "Construye una tríada saltando una nota de la escala entre cada nota del acorde.",
        successSignal: "Puedes formar I, ii y V sin mirar la tabla completa.",
      },
      {
        label: "Nombrar",
        action: "Asocia cada grado con su cualidad: M-m-m-M-M-m-dim.",
        successSignal: "No conviertes ii en mayor dentro de DO mayor.",
      },
      {
        label: "Progresar",
        action: "Traduce I-V-vi-IV a acordes en otra tonalidad.",
        successSignal: "Mantienes los grados aunque cambien los nombres.",
      },
    ],
    selfCheck: [
      "¿Sé de qué escala salen los acordes?",
      "¿Puedo decir la cualidad del grado?",
      "¿Puedo tocar la progresión en otra tonalidad?",
    ],
    transferChallenge: "Traduce I-V-vi-IV desde DO mayor a SOL mayor y toca la primera versión.",
  },
  "unit-11-real-songs": {
    essentialQuestion:
      "¿Puedo reconocer en una canción real los patrones que ya practiqué aislados?",
    practicePlan: [
      {
        label: "Detectar",
        action: "Marca frases repetidas y cambios de acorde previsibles.",
        successSignal: "Encuentras patrones antes de tocar todo el tema.",
      },
      {
        label: "Acompañar",
        action: "Toca la progresión lentamente con metrónomo.",
        successSignal: "No pierdes pulso al cambiar acorde.",
      },
      {
        label: "Aplicar",
        action: "Usa inversiones o ritmo simple para hacer el acompañamiento más cómodo.",
        successSignal: "Mantienes continuidad sin saltos innecesarios.",
      },
    ],
    selfCheck: [
      "¿Reconocí la progresión?",
      "¿Mantuve tempo al cambiar acorde?",
      "¿Puedo explicar qué patrón se repite?",
    ],
    transferChallenge:
      "Elige una canción simple y busca si aparece I-V-vi-IV o una variante cercana.",
  },
});

export const learningUnits: LearningUnit[] = [
  {
    id: "unit-01-keyboard-reading",
    order: 1,
    status: "active",
    stageId: "stage-1-foundations",
    title: "Mapa del teclado y primeras notas",
    shortGoal: "Conectar Do-Re-Mi-Fa-Sol entre teclado, partitura y oído.",
    userOutcome: "Puede ubicar las primeras notas y entender si la melodía sube, baja o repite.",
    routeSlug: "piano-desde-cero",
    lessonModuleId: "piano-desde-cero",
    lessonSlugs: [keyboardNotesLessonSlug, "lee-antes-de-tocar", "tu-primera-mini-cancion"],
    playableModuleId: firstFiveNotesModuleId,
    primarySkillIds: ["keyboard", "reading", "ear"],
    prerequisiteUnitIds: [],
    masteryCriteria: [
      "Ubica Do en varias octavas sin depender siempre de etiquetas.",
      "Relaciona una nota escrita con su tecla blanca.",
      "Completa una mini lectura de 5 notas con feedback correcto.",
    ],
    evidence: [
      "Lección guiada completada",
      "Módulo 1 completado",
      "Menos de 2 errores repetidos en Do/Re/Mi",
    ],
    remediation: [
      "Volver a patrones de dos y tres teclas negras.",
      "Mostrar etiquetas solo después del primer intento.",
      "Repetir lectura por dirección antes de leer por nombre.",
    ],
    practiceContract: learningPracticeContracts["unit-01-keyboard-reading"],
    nextUnitId: "unit-02-rhythm-pulse",
  },
  {
    id: "unit-02-rhythm-pulse",
    order: 2,
    status: "active",
    stageId: "stage-1-foundations",
    title: "Pulso y timing básico",
    shortGoal: "Tocar en sincronía con un beat constante.",
    userOutcome: "Puede seguir un pulso, reconocer tempo y tocar patrones simples con silencios.",
    routeSlug: "piano-desde-cero",
    lessonModuleId: "ritmo-y-compas",
    lessonSlugs: [],
    playableModuleId: "basic-rhythm",
    primarySkillIds: ["rhythm", "keyboard", "ear"],
    prerequisiteUnitIds: ["unit-01-keyboard-reading"],
    masteryCriteria: [
      "Alcanza al menos 70% de accuracy en pulso básico.",
      "Distingue temprano/tarde usando feedback de timing.",
      "Completa patrones con beats activos y silencios.",
    ],
    evidence: ["Módulo 2 completado", "Misses controlados en ejercicio final"],
    remediation: [
      "Reducir BPM y ampliar ventana de acierto.",
      "Activar metrónomo visual antes del input.",
      "Repetir solo beats marcados antes de mezclar silencios.",
    ],
    practiceContract: learningPracticeContracts["unit-02-rhythm-pulse"],
    nextUnitId: "unit-03-intervals",
  },
  {
    id: "unit-03-intervals",
    order: 3,
    status: "active",
    stageId: "stage-1-foundations",
    title: "Distancias entre notas",
    shortGoal: "Entender intervalo como distancia visual, táctil y auditiva.",
    userOutcome: "Puede tocar distancias simples y reconocer dirección ascendente o descendente.",
    routeSlug: "lectura-de-partituras",
    lessonModuleId: "lectura-con-patrones",
    lessonSlugs: [],
    playableModuleId: "intervals",
    primarySkillIds: ["ear", "keyboard", "reading"],
    prerequisiteUnitIds: ["unit-02-rhythm-pulse"],
    masteryCriteria: [
      "Calcula semitonos entre dos notas.",
      "Reconoce si un intervalo sube, baja o repite.",
      "Toca intervalos básicos desde una nota base.",
    ],
    evidence: ["Módulo 3 completado", "Errores de dirección bajo control"],
    remediation: [
      "Volver a movimiento izquierda/derecha en teclado.",
      "Mostrar arco visual de distancia.",
      "Repetir segundas antes de saltos mayores.",
    ],
    practiceContract: learningPracticeContracts["unit-03-intervals"],
    nextUnitId: "unit-04-major-scale",
  },
  {
    id: "unit-04-major-scale",
    order: 4,
    status: "active",
    stageId: "stage-2-tonality",
    title: "Escala mayor como patrón",
    shortGoal: "Construir T-T-S-T-T-T-S desde una tónica.",
    userOutcome: "Puede tocar DO mayor y construir escalas mayores simples.",
    routeSlug: "lectura-de-partituras",
    lessonSlugs: [],
    playableModuleId: "major-scale",
    primarySkillIds: ["scales", "keyboard", "ear"],
    prerequisiteUnitIds: ["unit-03-intervals"],
    masteryCriteria: [
      "Completa DO mayor en orden.",
      "Construye SOL, RE o FA mayor usando la fórmula.",
      "Reconoce auditivamente una escala mayor correcta.",
    ],
    evidence: ["Módulo 4 completado"],
    remediation: [
      "Mostrar patrón por bloques T/S.",
      "Reducir a DO mayor si rompe la fórmula.",
      "Resaltar semitonos MI-FA y SI-DO.",
    ],
    practiceContract: learningPracticeContracts["unit-04-major-scale"],
    nextUnitId: "unit-05-minor-scales",
  },
  {
    id: "unit-05-minor-scales",
    order: 5,
    status: "active",
    stageId: "stage-2-tonality",
    title: "Color menor y variantes básicas",
    shortGoal: "Comparar menor natural, armónica y melódica ascendente.",
    userOutcome: "Puede diferenciar mayor/menor y tocar escalas menores simples.",
    routeSlug: "lectura-de-partituras",
    lessonSlugs: [],
    playableModuleId: "minor-scales",
    primarySkillIds: ["scales", "ear", "harmony"],
    prerequisiteUnitIds: ["unit-04-major-scale"],
    masteryCriteria: [
      "Toca LA menor natural.",
      "Reconoce la tercera como cambio clave mayor/menor.",
      "Identifica séptimo grado elevado en menor armónica.",
    ],
    evidence: ["Módulo 5 completado"],
    remediation: [
      "Volver a LA menor natural sin alteraciones.",
      "Comparar escala mayor/menor lado a lado.",
      "Repetir grados 6 y 7 si confunde variantes.",
    ],
    practiceContract: learningPracticeContracts["unit-05-minor-scales"],
    nextUnitId: "unit-06-key-signatures",
  },
  {
    id: "unit-06-key-signatures",
    order: 6,
    status: "active",
    stageId: "stage-2-tonality",
    title: "Tonalidad y armadura",
    shortGoal: "Entender alteraciones fijas como regla global.",
    userOutcome: "Puede aplicar sostenidos/bemoles simples y encontrar relativas.",
    routeSlug: "lectura-de-partituras",
    lessonSlugs: [],
    playableModuleId: "key-signatures",
    primarySkillIds: ["reading", "scales", "harmony"],
    prerequisiteUnitIds: ["unit-05-minor-scales"],
    masteryCriteria: [
      "Identifica armaduras de DO, SOL, RE, FA y SIb.",
      "Construye escalas respetando alteraciones fijas.",
      "Relaciona mayores y menores relativas.",
    ],
    evidence: ["Módulo 6 completado"],
    remediation: [
      "Mostrar alteraciones persistentes en teclado.",
      "Reducir a DO/SOL/FA si confunde familias.",
      "Usar regla de 3 semitonos para relativas.",
    ],
    practiceContract: learningPracticeContracts["unit-06-key-signatures"],
    nextUnitId: "unit-07-pentatonic",
  },
  {
    id: "unit-07-pentatonic",
    order: 7,
    status: "active",
    stageId: "stage-2-tonality",
    title: "Pentatónica e improvisación segura",
    shortGoal: "Crear frases con cinco notas y un loop simple.",
    userOutcome: "Puede improvisar frases cortas dentro de una escala permitida.",
    routeSlug: "canciones-faciles",
    lessonSlugs: [],
    playableModuleId: "pentatonic-scale",
    primarySkillIds: ["scales", "improvisation", "ear"],
    prerequisiteUnitIds: ["unit-06-key-signatures"],
    masteryCriteria: [
      "Toca pentatónica mayor y menor relativa.",
      "Usa al menos 3 notas distintas en improvisación guiada.",
      "Se mantiene dentro de las notas permitidas.",
    ],
    evidence: ["Módulo 7 completado", "Improvisación guiada completada"],
    remediation: [
      "Bloquear notas fuera de escala.",
      "Mostrar notas compartidas de relativas.",
      "Sugerir más espacio si toca demasiadas notas seguidas.",
    ],
    practiceContract: learningPracticeContracts["unit-07-pentatonic"],
    nextUnitId: "unit-08-chords",
  },
  {
    id: "unit-08-chords",
    order: 8,
    status: "active",
    stageId: "stage-3-harmony-chords",
    title: "Tríadas mayores y menores",
    shortGoal: "Construir acordes con tónica, tercera y quinta.",
    userOutcome: "Puede formar y reconocer acordes básicos por notas correctas.",
    routeSlug: "acompanamiento-con-acordes",
    lessonSlugs: [],
    playableModuleId: "chord-construction",
    primarySkillIds: ["chords", "harmony", "ear"],
    prerequisiteUnitIds: ["unit-04-major-scale"],
    masteryCriteria: [
      "Construye acordes mayores y menores.",
      "Reconoce mayor/menor auditivamente.",
      "Completa la nota faltante de una tríada.",
    ],
    evidence: ["Módulo 8 completado"],
    remediation: [
      "Resaltar tercera del acorde.",
      "Usar solo DO mayor y LA menor si accuracy baja.",
      "Permitir arpegio antes de acorde simultáneo.",
    ],
    practiceContract: learningPracticeContracts["unit-08-chords"],
    nextUnitId: "unit-09-inversions",
  },
  {
    id: "unit-09-inversions",
    order: 9,
    status: "active",
    stageId: "stage-3-harmony-chords",
    title: "Inversiones y bajo",
    shortGoal: "Mantener las mismas notas cambiando la nota más grave.",
    userOutcome: "Puede usar inversiones para moverse menos entre acordes.",
    routeSlug: "acompanamiento-con-acordes",
    lessonSlugs: [],
    playableModuleId: "chord-inversions",
    primarySkillIds: ["chords", "keyboard", "harmony"],
    prerequisiteUnitIds: ["unit-08-chords"],
    masteryCriteria: [
      "Construye primera y segunda inversión.",
      "Identifica inversión por bajo.",
      "Toca progresiones con menor movimiento.",
    ],
    evidence: ["Módulo 9 completado"],
    remediation: [
      "Mostrar bajo esperado.",
      "Comparar mismas notas en distinto orden.",
      "Repetir la inversión que acumule errores.",
    ],
    practiceContract: learningPracticeContracts["unit-09-inversions"],
    nextUnitId: "unit-10-harmonic-field",
  },
  {
    id: "unit-10-harmonic-field",
    order: 10,
    status: "active",
    stageId: "stage-3-harmony-chords",
    title: "Campo armónico y progresiones",
    shortGoal: "Construir acordes por grado dentro de una tonalidad.",
    userOutcome: "Puede traducir grados a acordes y tocar I-V-vi-IV en tonalidades simples.",
    routeSlug: "acompanamiento-con-acordes",
    lessonSlugs: [],
    playableModuleId: "harmonic-field",
    primarySkillIds: ["harmony", "chords", "songs"],
    prerequisiteUnitIds: ["unit-09-inversions"],
    masteryCriteria: [
      "Construye el campo armónico mayor.",
      "Reconoce cualidad por grado.",
      "Toca progresiones por grados en más de una tonalidad.",
    ],
    evidence: ["Módulo 10 completado"],
    remediation: [
      "Volver al patrón M-m-m-M-M-m-dim.",
      "Mostrar tabla grado a acorde.",
      "Reducir a DO mayor si falla con alteraciones.",
    ],
    practiceContract: learningPracticeContracts["unit-10-harmonic-field"],
    nextUnitId: "unit-11-real-songs",
  },
  {
    id: "unit-11-real-songs",
    order: 11,
    status: "planned",
    stageId: "stage-4-real-music",
    title: "Progresiones en canciones reales",
    shortGoal: "Aplicar grados, acordes y ritmo dentro de repertorio.",
    userOutcome: "Puede detectar patrones armónicos y acompañar canciones simples.",
    routeSlug: "canciones-faciles",
    lessonSlugs: [],
    primarySkillIds: ["songs", "harmony", "rhythm"],
    prerequisiteUnitIds: ["unit-10-harmonic-field"],
    masteryCriteria: [
      "Mantiene progresión en tempo.",
      "Reconoce patrones repetidos.",
      "Anticipa cambios por frase.",
    ],
    evidence: ["Canción guiada completada"],
    remediation: [
      "Reducir tempo del loop.",
      "Practicar cambios de acorde aislados.",
      "Marcar frases A/B visualmente.",
    ],
    practiceContract: learningPracticeContracts["unit-11-real-songs"],
  },
];

export function getLearningUnitById(id: string) {
  return learningUnits.find((unit) => unit.id === id);
}

export function getLearningUnitByPlayableModuleId(moduleId: string) {
  return learningUnits.find((unit) => unit.playableModuleId === moduleId);
}

export function getLearningUnitByLessonSlug(slug: string) {
  return learningUnits.find((unit) => unit.lessonSlugs.includes(slug));
}
