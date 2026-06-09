import type { ArcadeNote } from "@/components/arcade/ArcadeEngine";

// Mapeo básico de notas a valores MIDI (C4 = 60)
const PITCH_MAP: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

export interface ParseResult {
  notes: ArcadeNote[];
  barlines: number[];
  beats: number[];
  minMidi: number;
  maxMidi: number;
  keySignature?: { fifths: number };
}

/**
 * Lee un archivo MusicXML y lo convierte en un arreglo de notas para el Motor Arcade.
 * Ignora repeticiones complejas y se enfoca en un flujo continuo (ideal para sight-reading básico).
 */
export function parseMusicXMLToArcadeNotes(
  xmlString: string,
  defaultTempo: number = 60,
): ParseResult {
  if (typeof window === "undefined") {
    // Si se llama en el servidor, devolvemos vacío (DOMParser no existe en Node)
    return {
      notes: [],
      barlines: [],
      beats: [],
      minMidi: 36,
      maxMidi: 83,
      keySignature: { fifths: 0 },
    };
  }

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  const notes: ArcadeNote[] = [];
  const barlines: number[] = [];
  const beats: number[] = [];
  let currentTimeMs = 0; // Tiempo actual acumulado en la partitura
  let currentTempo = defaultTempo; // BPM
  let divisions = 1; // Divisiones por negra (quarter note)
  let beatsPerMeasure = 4; // Ej. el "4" de arriba en 4/4

  // Extraer las divisions globales (suponemos que están en el primer measure)
  const divisionsNode = xmlDoc.querySelector("attributes divisions");
  if (divisionsNode?.textContent) {
    divisions = parseInt(divisionsNode.textContent, 10);
  }

  const beatsNode = xmlDoc.querySelector("attributes time beats");
  if (beatsNode?.textContent) {
    beatsPerMeasure = parseInt(beatsNode.textContent, 10);
  }

  // Mapa temporal para llevar el registro de notas ligadas (Ties) por MIDI Pitch
  const pendingTies = new Map<number, ArcadeNote>();

  // Iterar por todos los compases (measures) de la primera voz/parte
  const measures = xmlDoc.querySelectorAll("part measure");

  let minMidi = Infinity;
  let maxMidi = -Infinity;
  let currentFifths = 0;
  let firstKeySignatureSet = false;
  let finalKeySignature = { fifths: 0 };

  measures.forEach((measure) => {
    // Buscar armadura (Key Signature)
    const fifthsNode = measure.querySelector("attributes key fifths");
    if (fifthsNode?.textContent) {
      currentFifths = parseInt(fifthsNode.textContent, 10);
      if (!firstKeySignatureSet) {
        finalKeySignature = { fifths: currentFifths };
        firstKeySignatureSet = true;
      }
    }

    // Mapa de alteraciones activas explícitas en este compás: clave = pitchClass + octave, valor = alter
    const activeAccidentals = new Map<string, number>();

    // Registrar el inicio de este compás
    barlines.push(currentTimeMs);

    // Buscar si hay cambios de tempo en este compás
    const soundNode = measure.querySelector("sound");
    if (soundNode?.getAttribute("tempo")) {
      currentTempo = parseInt(soundNode.getAttribute("tempo")!, 10);
    }

    // Milisegundos que dura una "division" en el tempo actual
    // 1 negra (quarter) = 'divisions' unidades de duration
    // 1 negra dura (60000 / tempo) milisegundos
    // Entonces 1 division dura (60000 / tempo) / divisions
    const msPerQuarter = 60000 / currentTempo;
    const msPerDivision = msPerQuarter / divisions;

    // Calcular y registrar los latidos (beats) de este compás
    // Asumimos que el compás tiene 'beatsPerMeasure' latidos, cada uno separado por msPerQuarter
    for (let b = 0; b < beatsPerMeasure; b++) {
      beats.push(currentTimeMs + b * msPerQuarter);
    }

    const noteNodes = measure.querySelectorAll("note");
    noteNodes.forEach((noteNode, index) => {
      // Es un acorde? (Se toca al mismo tiempo que la nota anterior)
      const isChord = noteNode.querySelector("chord") !== null;

      const durationNode = noteNode.querySelector("duration");
      let durationDivs = 0;
      if (durationNode?.textContent) {
        durationDivs = parseInt(durationNode.textContent, 10);
      }

      const durationMs = durationDivs * msPerDivision;

      // Si es un acorde, esta nota debe comenzar al mismo tiempo que la nota anterior.
      // Así que retrocedemos el cursor de tiempo.
      if (isChord && index > 0) {
        // En MusicXML, la nota 'chord' no avanza el tiempo, así que restamos la duración
        // de la nota anterior (que ya sumó al currentTimeMs)
        // Nota: Asumimos que todas las notas del acorde tienen la misma duración para simplificar
        currentTimeMs -= durationMs;
      }

      const pitchNode = noteNode.querySelector("pitch");
      const restNode = noteNode.querySelector("rest");

      const staffNode = noteNode.querySelector("staff");
      const staff = staffNode?.textContent ? parseInt(staffNode.textContent, 10) : 1;

      const fingeringNode = noteNode.querySelector("notations technical fingering");
      const fingering = fingeringNode?.textContent
        ? parseInt(fingeringNode.textContent, 10)
        : undefined;

      const lyricNode = noteNode.querySelector("lyric text");
      const lyric = lyricNode?.textContent ? lyricNode.textContent : undefined;

      if (pitchNode) {
        const step = pitchNode.querySelector("step")?.textContent || "C";
        const octave = parseInt(pitchNode.querySelector("octave")?.textContent || "4", 10);
        const alter = parseInt(pitchNode.querySelector("alter")?.textContent || "0", 10);

        // Calcular MIDI (C4 = 60, por tanto C0 = 12)
        const baseMidi = 12 + octave * 12 + (PITCH_MAP[step] || 0) + alter;

        if (baseMidi < minMidi) minMidi = baseMidi;
        if (baseMidi > maxMidi) maxMidi = baseMidi;

        const isTieStart =
          noteNode.querySelector('tie[type="start"]') !== null ||
          noteNode.querySelector('tied[type="start"]') !== null;
        const isTieStop =
          noteNode.querySelector('tie[type="stop"]') !== null ||
          noteNode.querySelector('tied[type="stop"]') !== null;

        // --- Lógica de Alteraciones (Accidentals) por Compás y Armadura ---
        const pitchKey = `${step}${octave}`;
        let renderAlter;
        let renderNatural = false;

        // Determinar la alteración por defecto según la armadura (Key Signature)
        let defaultAlter = 0;
        if (currentFifths > 0) {
          const sharps = ["F", "C", "G", "D", "A", "E", "B"].slice(0, currentFifths);
          if (sharps.includes(step)) defaultAlter = 1;
        } else if (currentFifths < 0) {
          const flats = ["B", "E", "A", "D", "G", "C", "F"].slice(0, -currentFifths);
          if (flats.includes(step)) defaultAlter = -1;
        }

        // ¿Qué alteración rige esta nota ahora mismo?
        const currentActiveAlter = activeAccidentals.has(pitchKey)
          ? activeAccidentals.get(pitchKey)!
          : defaultAlter;

        if (alter !== currentActiveAlter) {
          // La alteración difiere de lo que dicta la armadura o la última nota en el compás, hay que pintarla explícitamente
          if (alter === 0) {
            renderNatural = true;
          } else {
            renderAlter = alter;
          }
          activeAccidentals.set(pitchKey, alter); // Guardamos que ahora esta alteración domina este compás
        }
        // --------------------------------------------------------

        if (isTieStop && pendingTies.has(baseMidi)) {
          // Es la continuación de una nota ligada
          const originalNote = pendingTies.get(baseMidi)!;
          originalNote.durationMs = (originalNote.durationMs || 0) + durationMs;

          if (isTieStart) {
            // Sigue estando ligada a otra nota posterior
            pendingTies.set(baseMidi, originalNote);
          } else {
            // Fin de la ligadura
            pendingTies.delete(baseMidi);
          }
        } else {
          // Es una nota nueva
          const newNote: ArcadeNote = {
            id: `note-${notes.length}`,
            midiNote: baseMidi,
            timeMs: currentTimeMs,
            durationMs: durationMs,
            staff: staff,
            fingering: fingering,
            lyric: lyric,
            alter: renderAlter,
            natural: renderNatural,
            status: "pending",
          };
          notes.push(newNote);

          if (isTieStart) {
            pendingTies.set(baseMidi, newNote);
          }
        }
      } else if (restNode) {
        // Es un silencio, no añadimos nota al Arcade, pero sí avanza el tiempo
      }

      // Avanzar el cursor de tiempo para la siguiente nota
      currentTimeMs += durationMs;
    });
  });

  // Para darle un respiro al usuario, agregamos un pequeño retraso a todas las notas
  // para que no empiecen pegadas a la izquierda apenas carga la pantalla (ej. 3 segundos)
  const START_DELAY_MS = 3000;
  return {
    notes: notes.map((n) => ({ ...n, timeMs: n.timeMs + START_DELAY_MS })),
    barlines: barlines.map((b) => b + START_DELAY_MS),
    beats: beats.map((b) => b + START_DELAY_MS),
    minMidi: minMidi === Infinity ? 36 : minMidi,
    maxMidi: maxMidi === -Infinity ? 83 : maxMidi,
    keySignature: finalKeySignature,
  };
}
