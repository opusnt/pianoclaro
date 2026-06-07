import { ArcadeNote } from "@/components/arcade/ArcadeEngine";

// Mapeo básico de notas a valores MIDI (C4 = 60)
const PITCH_MAP: Record<string, number> = {
  "C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11
};

/**
 * Lee un archivo MusicXML y lo convierte en un arreglo de notas para el Motor Arcade.
 * Ignora repeticiones complejas y se enfoca en un flujo continuo (ideal para sight-reading básico).
 */
export function parseMusicXMLToArcadeNotes(xmlString: string, defaultTempo: number = 60): ArcadeNote[] {
  if (typeof window === "undefined") {
    // Si se llama en el servidor, devolvemos vacío (DOMParser no existe en Node)
    return [];
  }

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  const notes: ArcadeNote[] = [];
  let currentTimeMs = 0; // Tiempo actual acumulado en la partitura
  let currentTempo = defaultTempo; // BPM
  let divisions = 1; // Divisiones por negra (quarter note)

  // Extraer las divisions globales (suponemos que están en el primer measure)
  const divisionsNode = xmlDoc.querySelector("attributes divisions");
  if (divisionsNode && divisionsNode.textContent) {
    divisions = parseInt(divisionsNode.textContent, 10);
  }

  // Iterar por todos los compases (measures) de la primera voz/parte
  const measures = xmlDoc.querySelectorAll("part measure");
  
  measures.forEach((measure) => {
    // Buscar si hay cambios de tempo en este compás
    const soundNode = measure.querySelector("sound");
    if (soundNode && soundNode.getAttribute("tempo")) {
      currentTempo = parseInt(soundNode.getAttribute("tempo")!, 10);
    }

    // Milisegundos que dura una "division" en el tempo actual
    // 1 negra (quarter) = 'divisions' unidades de duration
    // 1 negra dura (60000 / tempo) milisegundos
    // Entonces 1 division dura (60000 / tempo) / divisions
    const msPerDivision = (60000 / currentTempo) / divisions;

    const noteNodes = measure.querySelectorAll("note");
    noteNodes.forEach((noteNode, index) => {
      // Es un acorde? (Se toca al mismo tiempo que la nota anterior)
      const isChord = noteNode.querySelector("chord") !== null;
      
      const durationNode = noteNode.querySelector("duration");
      let durationDivs = 0;
      if (durationNode && durationNode.textContent) {
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
      const staff = staffNode && staffNode.textContent ? parseInt(staffNode.textContent, 10) : 1;

      const fingeringNode = noteNode.querySelector("notations technical fingering");
      const fingering = fingeringNode && fingeringNode.textContent ? parseInt(fingeringNode.textContent, 10) : undefined;

      const lyricNode = noteNode.querySelector("lyric text");
      const lyric = lyricNode && lyricNode.textContent ? lyricNode.textContent : undefined;

      if (pitchNode) {
        const step = pitchNode.querySelector("step")?.textContent || "C";
        const octave = parseInt(pitchNode.querySelector("octave")?.textContent || "4", 10);
        const alter = parseInt(pitchNode.querySelector("alter")?.textContent || "0", 10);

        // Calcular MIDI (C4 = 60, por tanto C0 = 12)
        const baseMidi = 12 + (octave * 12) + (PITCH_MAP[step] || 0) + alter;

        notes.push({
          id: `note-${notes.length}`,
          midiNote: baseMidi,
          timeMs: currentTimeMs,
          durationMs: durationMs,
          staff: staff,
          fingering: fingering,
          lyric: lyric,
          alter: alter !== 0 ? alter : undefined,
          status: "pending"
        });
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
  return notes.map(n => ({
    ...n,
    timeMs: n.timeMs + START_DELAY_MS
  }));
}
