import * as Tone from "tone";
import type { PianoNoteName } from "@/lib/music/notes";

export class PianoAudioEngine {
  private sampler: Tone.Sampler | null = null;
  private metronomeSynth: Tone.MembraneSynth | null = null;
  private frequencySynth: Tone.PolySynth | null = null;
  private durationSynth: Tone.PolySynth | null = null;
  private volumeNode: Tone.Volume | null = null;

  private volume = 0.72;
  private muted = false;
  private isPrepared = false;

  private updateVolume() {
    if (this.volumeNode) {
      const targetVolume = this.muted ? -Infinity : Tone.gainToDb(this.volume);
      this.volumeNode.volume.rampTo(targetVolume, 0.1);
    }
  }

  setVolume(volume: number) {
    this.volume = Math.min(1, Math.max(0, volume));
    this.updateVolume();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    this.updateVolume();
  }

  async prepare() {
    if (this.isPrepared) return true;

    try {
      if (Tone.getContext().state !== "running") {
        await Tone.start();
      }

      this.volumeNode = new Tone.Volume(Tone.gainToDb(this.volume)).toDestination();

      this.sampler = new Tone.Sampler({
        urls: {
          A0: "A0.mp3",
          C1: "C1.mp3",
          "D#1": "Ds1.mp3",
          "F#1": "Fs1.mp3",
          A1: "A1.mp3",
          C2: "C2.mp3",
          "D#2": "Ds2.mp3",
          "F#2": "Fs2.mp3",
          A2: "A2.mp3",
          C3: "C3.mp3",
          "D#3": "Ds3.mp3",
          "F#3": "Fs3.mp3",
          A3: "A3.mp3",
          C4: "C4.mp3",
          "D#4": "Ds4.mp3",
          "F#4": "Fs4.mp3",
          A4: "A4.mp3",
          C5: "C5.mp3",
          "D#5": "Ds5.mp3",
          "F#5": "Fs5.mp3",
          A5: "A5.mp3",
          C6: "C6.mp3",
          "D#6": "Ds6.mp3",
          "F#6": "Fs6.mp3",
          A6: "A6.mp3",
          C7: "C7.mp3",
          "D#7": "Ds7.mp3",
          "F#7": "Fs7.mp3",
          A7: "A7.mp3",
          C8: "C8.mp3",
        },
        release: 1,
        baseUrl: "https://tonejs.github.io/audio/salamander/",
      }).connect(this.volumeNode);

      this.metronomeSynth = new Tone.MembraneSynth().connect(this.volumeNode);

      this.frequencySynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 1 },
      }).connect(this.volumeNode);

      this.durationSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sine" },
        envelope: { attack: 0.05, decay: 0, sustain: 1, release: 0.5 },
      }).connect(this.volumeNode);

      await Tone.loaded();
      this.isPrepared = true;
      this.updateVolume();
      return true;
    } catch (e) {
      console.error("Failed to prepare Tone.js", e);
      return false;
    }
  }

  async playNote(note: PianoNoteName | string, durationMs = 420) {
    const isReady = await this.prepare();
    if (!this.sampler || !isReady) return;

    // In this app, PianoNoteName implies octave 4 if not provided
    const hasOctave = /\d$/.test(note);
    const toneNote = hasOctave ? note : `${note}4`;
    this.sampler.triggerAttackRelease(toneNote, durationMs / 1000);
  }

  async playSustainedNote(note: PianoNoteName | string, durationMs = 420) {
    const isReady = await this.prepare();
    if (!this.durationSynth || !isReady) return;

    const hasOctave = /\d$/.test(note);
    const toneNote = hasOctave ? note : `${note}4`;
    this.durationSynth.triggerAttackRelease(toneNote, durationMs / 1000);
  }

  async playFrequency(frequency: number, durationMs = 420) {
    const isReady = await this.prepare();
    if (!this.frequencySynth || !isReady) return;

    this.frequencySynth.triggerAttackRelease(frequency, durationMs / 1000);
  }

  async playPianoTone(
    frequency: number,
    options: { durationMs?: number; velocity?: number; brightness?: number } = {},
  ) {
    // Some legacy calls might use playPianoTone directly
    const durationMs = options.durationMs ?? 420;

    const isReady = await this.prepare();
    if (!this.sampler || !isReady) return;

    // Convert frequency to closest note for the sampler to play a real piano tone
    const note = Tone.Frequency(frequency).toNote();
    this.sampler.triggerAttackRelease(note, durationMs / 1000);
  }

  async playMetronomeTick(accent = false) {
    const isReady = await this.prepare();
    if (!this.metronomeSynth || !isReady) return;

    if (accent) {
      this.metronomeSynth.triggerAttackRelease("C5", "32n");
    } else {
      this.metronomeSynth.triggerAttackRelease("C4", "32n", undefined, 0.5);
    }
  }

  async playHeartbeat() {
    const isReady = await this.prepare();
    if (!this.metronomeSynth || !isReady) return;

    // Un latido de corazón es grave y sordo. "C2" o "C1" funciona muy bien en un MembraneSynth
    // Reproducimos dos golpes rápidos para simular el "lub-dub" del latido
    this.metronomeSynth.triggerAttackRelease("C2", "8n", Tone.now(), 0.8);
    this.metronomeSynth.triggerAttackRelease("C2", "8n", Tone.now() + 0.15, 0.5);
  }

  stopAll() {
    this.sampler?.releaseAll();
    this.frequencySynth?.releaseAll();
  }

  close() {
    this.stopAll();
    this.sampler?.dispose();
    this.metronomeSynth?.dispose();
    this.frequencySynth?.dispose();
    this.volumeNode?.dispose();
    this.isPrepared = false;
  }
}
