/**
 * Web Audio API synthesizer for celebratory "Happy Birthday" melody
 * and interactive sound effects (unsealing envelope, confetti burst, balloon chime).
 */

class BirthdayAudioController {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private currentTimeout: number | null = null;
  private gainNode: GainNode | null = null;
  private onStateChangeCallbacks: Set<(isPlaying: boolean) => void> = new Set();

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public subscribe(cb: (isPlaying: boolean) => void) {
    this.onStateChangeCallbacks.add(cb);
    return () => {
      this.onStateChangeCallbacks.delete(cb);
    };
  }

  private notify() {
    this.onStateChangeCallbacks.forEach((cb) => cb(this.isPlaying));
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.currentTimeout !== null) {
      window.clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
    if (this.gainNode && this.ctx) {
      try {
        this.gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
        this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
      } catch {
        // ignore
      }
    }
    this.notify();
  }

  public async play() {
    const ctx = this.initContext();
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.notify();

    // Notes mapping (Frequencies in Hz)
    const notes: Record<string, number> = {
      C4: 261.63,
      D4: 293.66,
      E4: 329.63,
      F4: 349.23,
      G4: 392.0,
      A4: 440.0,
      Bb4: 466.16,
      B4: 493.88,
      C5: 523.25,
      D5: 587.33,
      E5: 659.25,
      F5: 698.46,
      G5: 783.99,
      A5: 880.0,
    };

    // Melody: Note, duration in beats (quarter note = 1 beat, ~112 BPM)
    const bpm = 114;
    const beatDuration = 60 / bpm; // ~0.526s

    // Happy Birthday melody in C major / F major feel
    const score: Array<{ note: string; beats: number; chord?: string[] }> = [
      // Verse 1
      { note: 'G4', beats: 0.75, chord: ['C3', 'G3'] },
      { note: 'G4', beats: 0.25 },
      { note: 'A4', beats: 1.0 },
      { note: 'G4', beats: 1.0 },
      { note: 'C5', beats: 1.0, chord: ['C3', 'E3', 'G3'] },
      { note: 'B4', beats: 2.0 },

      // Verse 2
      { note: 'G4', beats: 0.75, chord: ['G2', 'D3'] },
      { note: 'G4', beats: 0.25 },
      { note: 'A4', beats: 1.0 },
      { note: 'G4', beats: 1.0 },
      { note: 'D5', beats: 1.0, chord: ['G2', 'B2', 'D3'] },
      { note: 'C5', beats: 2.0, chord: ['C3', 'E3'] },

      // Verse 3 (Happy Birthday to dear Mustafa...)
      { note: 'G4', beats: 0.75, chord: ['C3', 'G3'] },
      { note: 'G4', beats: 0.25 },
      { note: 'G5', beats: 1.0, chord: ['C3', 'E3', 'G3', 'C4'] },
      { note: 'E5', beats: 1.0 },
      { note: 'C5', beats: 1.0, chord: ['F2', 'A2', 'C3'] },
      { note: 'B4', beats: 1.0 },
      { note: 'A4', beats: 2.0, chord: ['F2', 'C3', 'F3'] },

      // Verse 4
      { note: 'F5', beats: 0.75, chord: ['F2', 'A2', 'D3'] },
      { note: 'F5', beats: 0.25 },
      { note: 'E5', beats: 1.0, chord: ['C3', 'G3', 'C4'] },
      { note: 'C5', beats: 1.0 },
      { note: 'D5', beats: 1.0, chord: ['G2', 'D3', 'F3', 'B3'] },
      { note: 'C5', beats: 3.0, chord: ['C2', 'G2', 'C3', 'E3', 'G3'] },
    ];

    const playSequence = () => {
      if (!this.isPlaying) return;

      let currentTime = ctx.currentTime + 0.1;

      score.forEach((item) => {
        const freq = notes[item.note];
        const duration = item.beats * beatDuration;

        // Play main melodic chime (rich acoustic bell tone with subtle harmonics)
        this.playChimeNote(ctx, freq, currentTime, duration * 0.95);

        // Play subtle warm background acoustic chord if present
        if (item.chord) {
          item.chord.forEach((chordNote) => {
            const chordFreq = notes[chordNote] || this.getBassFreq(chordNote);
            if (chordFreq) {
              this.playWarmPadNote(ctx, chordFreq, currentTime, duration * 1.5);
            }
          });
        }

        currentTime += duration;
      });

      // Total sequence length
      const totalDuration = score.reduce((sum, item) => sum + item.beats * beatDuration, 0);

      // Loop after a celebratory 2-second pause
      this.currentTimeout = window.setTimeout(() => {
        if (this.isPlaying) {
          playSequence();
        }
      }, (totalDuration + 2.0) * 1000);
    };

    playSequence();
  }

  private getBassFreq(noteName: string): number {
    const bassMap: Record<string, number> = {
      C2: 65.41,
      D2: 73.42,
      E2: 82.41,
      F2: 87.31,
      G2: 98.0,
      A2: 110.0,
      B2: 123.47,
      C3: 130.81,
      D3: 146.83,
      E3: 164.81,
      F3: 174.61,
      G3: 196.0,
      A3: 220.0,
      B3: 246.94,
    };
    return bassMap[noteName] || 130.81;
  }

  /**
   * Generates a warm, music-box / celesta chime bell note
   */
  private playChimeNote(ctx: AudioContext, freq: number, startTime: number, duration: number) {
    if (this.isMuted) return;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, startTime);
    // Smooth attack
    masterGain.gain.exponentialRampToValueAtTime(0.22, startTime + 0.02);
    // Exponential decay like a music box bell
    masterGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    // Fundamental oscillator (triangle for soft warmth)
    const osc1 = ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, startTime);

    // First overtone oscillator (sine at 2x freq for bell glockenspiel sparkle)
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    const overtoneGain = ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.09, startTime);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.6);

    // Gentle lowpass filter for silky analog feel
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 4.5, startTime);
    filter.Q.setValueAtTime(1.2, startTime);

    osc1.connect(masterGain);
    osc2.connect(overtoneGain);
    overtoneGain.connect(masterGain);
    masterGain.connect(filter);
    filter.connect(ctx.destination);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration + 0.1);
    osc2.stop(startTime + duration + 0.1);
  }

  /**
   * Warm acoustic backing pad for harmony
   */
  private playWarmPadNote(ctx: AudioContext, freq: number, startTime: number, duration: number) {
    if (this.isMuted) return;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(0.05, startTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  }

  /**
   * Sound FX: Envelope unseal whoosh and shimmer
   */
  public playUnsealSound() {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;

      // 1. Paper rustle noise
      const bufferSize = ctx.sampleRate * 0.35;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1200, now);
      noiseFilter.Q.setValueAtTime(1.5, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.18, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);

      // 2. Golden ascending harp chime
      const harpNotes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      harpNotes.forEach((freq, idx) => {
        const noteTime = now + 0.08 + idx * 0.06;
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.12, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.9);
      });
    } catch {
      // Audio context might be restricted before gesture
    }
  }

  /**
   * Sound FX: Confetti celebratory burst pop
   */
  public playConfettiPop() {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;

      // Champagne pop effect (quick pitch drop)
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);

      // Subtle chime sparkle
      [880, 1320, 1760].forEach((freq, i) => {
        const chimeOsc = ctx.createOscillator();
        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(freq, now + 0.05 + i * 0.04);

        const chimeGain = ctx.createGain();
        chimeGain.gain.setValueAtTime(0.07, now + 0.05 + i * 0.04);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(ctx.destination);

        chimeOsc.start(now + 0.05 + i * 0.04);
        chimeOsc.stop(now + 0.45);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Sound FX: Balloon tap tone
   */
  public playBalloonPop() {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // ignore
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const birthdayAudio = new BirthdayAudioController();
