import { noteFrequencies } from "@/lib/music/notes";
import type { PianoNoteName } from "@/lib/music/notes";

type AudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

type ActiveVoice = {
  oscillators: OscillatorNode[];
  gain: GainNode;
  filter?: BiquadFilterNode;
};

export class PianoAudioEngine {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeVoices = new Set<ActiveVoice>();
  private volume = 0.72;
  private muted = false;

  private getContext() {
    if (typeof window === "undefined") {
      return null;
    }

    const audioWindow = window as AudioWindow;
    const AudioContextConstructor = audioWindow.AudioContext ?? audioWindow.webkitAudioContext;

    if (!AudioContextConstructor) {
      return null;
    }

    if (!this.context) {
      this.context = new AudioContextConstructor();
    }

    return this.context;
  }

  private getMasterGain() {
    const context = this.getContext();

    if (!context) {
      return null;
    }

    if (!this.masterGain) {
      this.masterGain = context.createGain();
      this.masterGain.connect(context.destination);
    }

    this.updateMasterGain();
    return this.masterGain;
  }

  private updateMasterGain() {
    if (!this.context || !this.masterGain) {
      return;
    }

    const targetGain = this.muted ? 0.0001 : this.volume;
    this.masterGain.gain.setTargetAtTime(targetGain, this.context.currentTime, 0.025);
  }

  setVolume(volume: number) {
    this.volume = Math.min(1, Math.max(0, volume));
    this.updateMasterGain();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    this.updateMasterGain();
  }

  async prepare() {
    const context = this.getContext();
    const masterGain = this.getMasterGain();

    if (!context || !masterGain) {
      return false;
    }

    if (context.state === "suspended") {
      await context.resume();
    }

    return true;
  }

  async playNote(note: PianoNoteName, durationMs = 420) {
    await this.playFrequency(noteFrequencies[note], durationMs);
  }

  async playFrequency(frequency: number, durationMs = 420) {
    const isReady = await this.prepare();

    if (!isReady || !this.context || !this.masterGain) {
      return;
    }

    const fundamental = frequency;
    const oscillators = [
      { type: "triangle" as OscillatorType, frequency: fundamental },
      { type: "sine" as OscillatorType, frequency: fundamental * 2 },
      { type: "sine" as OscillatorType, frequency: fundamental * 3 },
    ].map((config) => {
      const oscillator = this.context!.createOscillator();
      oscillator.type = config.type;
      oscillator.frequency.setValueAtTime(config.frequency, this.context!.currentTime);
      return oscillator;
    });
    const filter = this.context.createBiquadFilter();
    const gain = this.context.createGain();
    const now = this.context.currentTime;
    const releaseAt = now + durationMs / 1000;
    const voice = { oscillators, filter, gain };

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2800, now);
    filter.frequency.exponentialRampToValueAtTime(1200, releaseAt);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.1, now + 0.09);
    gain.gain.exponentialRampToValueAtTime(0.0001, releaseAt);

    oscillators.forEach((oscillator) => oscillator.connect(filter));
    filter.connect(gain);
    gain.connect(this.masterGain);

    this.activeVoices.add(voice);
    oscillators.forEach((oscillator) => {
      oscillator.start(now);
      oscillator.stop(releaseAt + 0.04);
    });

    oscillators[0].onended = () => {
      oscillators.forEach((oscillator) => oscillator.disconnect());
      filter.disconnect();
      gain.disconnect();
      this.activeVoices.delete(voice);
    };
  }

  async playMetronomeTick(accent = false) {
    const isReady = await this.prepare();

    if (!isReady || !this.context || !this.masterGain) {
      return;
    }

    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    const now = this.context.currentTime;
    const releaseAt = now + (accent ? 0.07 : 0.045);
    const voice = { oscillators: [oscillator], gain };

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(accent ? 1320 : 920, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(accent ? 0.12 : 0.075, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, releaseAt);

    oscillator.connect(gain);
    gain.connect(this.masterGain);

    this.activeVoices.add(voice);
    oscillator.start(now);
    oscillator.stop(releaseAt + 0.02);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
      this.activeVoices.delete(voice);
    };
  }

  stopAll() {
    this.activeVoices.forEach(({ oscillators, gain, filter }) => {
      try {
        const now = this.context?.currentTime ?? 0;
        gain.gain.cancelScheduledValues(now);
        gain.gain.setTargetAtTime(0.0001, now, 0.015);
        oscillators.forEach((oscillator) => oscillator.stop(now + 0.04));
        filter?.disconnect();
      } catch {
        // A voice can already be stopping when the user presses pause quickly.
      }
    });

    this.activeVoices.clear();
  }

  close() {
    this.stopAll();
    void this.context?.close();
    this.context = null;
  }
}
