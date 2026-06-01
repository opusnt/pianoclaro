import { readFileSync } from "fs";
import { parseMusicXml } from "./src/lib/music/musicxml-parser";
import { scoreToSong } from "./src/lib/music/song-model";

const xml = readFileSync("twinkle-twinkle.musicxml", "utf-8");
const score = parseMusicXml(xml);
console.log("SCORE:", JSON.stringify(score, null, 2).substring(0, 500));

const song = scoreToSong(score);
console.log("\nSONG EVENTS:", song.events.slice(0, 5));
console.log("\nTIMELINE EVENTS:", song.timelineEvents.slice(0, 5));
