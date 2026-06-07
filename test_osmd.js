const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><div id="container"></div>`);
global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;

const osmd = require('opensheetmusicdisplay');
const o = new osmd.OpenSheetMusicDisplay(document.getElementById("container"));
const xml = `<?xml version="1.0" encoding="UTF-8"?><score-partwise version="3.1"><part-list><score-part id="P1"><part-name>Piano</part-name></score-part></part-list><part id="P1"><measure number="1"><attributes><divisions>1</divisions><key><fifths>0</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes><note><pitch><step>D</step><octave>4</octave></pitch><duration>1</duration><type>quarter</type></note></measure></part></score-partwise>`;
o.load(xml).then(() => {
  o.cursor.show();
  console.log(Object.keys(o.cursor.NotesUnderCursor()[0].Pitch));
  console.log(o.cursor.NotesUnderCursor()[0].Pitch.FundamentalNote);
  console.log(o.cursor.NotesUnderCursor()[0].Pitch.Step);
  console.log(o.cursor.NotesUnderCursor()[0].Pitch.fundamentalNote);
  console.log(o.cursor.NotesUnderCursor()[0].Pitch.step);
}).catch(console.error);
