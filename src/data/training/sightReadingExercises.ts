export type SightReadingExercise = {
  id: string;
  title: string;
  description: string;
  xmlData: string;
};

// Helper function to build a simple 4/4 measure XML from an array of note names
function buildSimpleXML(notes: string[]): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <part-list>
    <score-part id="P1">
      <part-name>Piano</part-name>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>1</divisions>
        <key><fifths>0</fifths></key>
        <time><beats>4</beats><beat-type>4</beat-type></time>
        <clef><sign>G</sign><line>2</line></clef>
      </attributes>
`;

  let beatCount = 0;
  let measureNumber = 1;

  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    const step = note.charAt(0);
    const octave = note.length > 1 ? note.charAt(1) : "4";
    
    // Add new measure if needed (except for the first one which is already open)
    if (beatCount > 0 && beatCount % 4 === 0) {
      measureNumber++;
      xml += `    </measure>\n    <measure number="${measureNumber}">\n`;
    }

    xml += `      <note>
        <pitch>
          <step>${step}</step>
          <octave>${octave}</octave>
        </pitch>
        <duration>1</duration>
        <type>quarter</type>
      </note>\n`;
      
    beatCount++;
  }

  // Close the last measure
  xml += `    </measure>\n  </part>\n</score-partwise>`;
  return xml;
}

export const sightReadingExercises: SightReadingExercise[] = [
  {
    id: "escalas-1",
    title: "Escala de Do",
    description: "Sube y baja por la escala básica de Do Mayor (C4 a G4).",
    xmlData: buildSimpleXML(["C4", "D4", "E4", "F4", "G4", "F4", "E4", "D4"]),
  },
  {
    id: "saltos-1",
    title: "Saltos de Tercera",
    description: "Practica leer notas separadas por un espacio (terceras).",
    xmlData: buildSimpleXML(["C4", "E4", "D4", "F4", "E4", "G4", "C4", "C4"]),
  },
  {
    id: "aleatorio-1",
    title: "Notas Aleatorias",
    description: "Lectura rápida de notas sin patrón aparente.",
    xmlData: buildSimpleXML(["G4", "C4", "F4", "D4", "E4", "G4", "D4", "C4"]),
  }
];
