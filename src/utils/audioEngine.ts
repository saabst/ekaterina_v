import { VOICE_CLIPS, VoiceClipId } from '../data/voiceAudio';
import { VoiceTone } from '../types/game';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private activeAudio: HTMLAudioElement | null = null;
  private fallbackTimer: ReturnType<typeof setTimeout> | null = null;
  private onSpeakingChange?: (speaking: boolean) => void;

  public setSpeakingListener(cb: (speaking: boolean) => void) {
    this.onSpeakingChange = cb;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopSpeech();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public stopSpeech() {
    if (this.fallbackTimer !== null) {
      globalThis.clearTimeout(this.fallbackTimer);
      this.fallbackTimer = null;
    }
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
        this.activeAudio.onended = null;
        this.activeAudio.onerror = null;
        this.activeAudio.onplay = null;
      } catch {
        // ignore audio teardown errors
      }
      this.activeAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.onSpeakingChange?.(false);
  }

  public playClip(clipId: VoiceClipId, tone: VoiceTone, fallbackText?: string) {
    this.stopSpeech();

    if (this.isMuted) {
      this.onSpeakingChange?.(false);
      return;
    }

    const src = VOICE_CLIPS[clipId]?.[tone];
    if (!src) {
      if (fallbackText) {
        this.speakFallback(fallbackText, tone);
      }
      return;
    }

    try {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audio.volume = 0.95;

      audio.onplay = () => {
        if (this.activeAudio === audio) {
          this.onSpeakingChange?.(true);
        }
      };

      audio.onended = () => {
        if (this.activeAudio === audio) {
          this.activeAudio = null;
          this.onSpeakingChange?.(false);
        }
      };

      audio.onerror = () => {
        if (this.activeAudio === audio) {
          this.activeAudio = null;
          if (fallbackText) {
            this.speakFallback(fallbackText, tone);
          } else {
            this.onSpeakingChange?.(false);
          }
        }
      };

      this.activeAudio = audio;
      this.onSpeakingChange?.(true);

      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          if (this.activeAudio === audio) {
            this.activeAudio = null;
            this.onSpeakingChange?.(false);
          }
        });
      }
    } catch {
      if (fallbackText) {
        this.speakFallback(fallbackText, tone);
      } else {
        this.onSpeakingChange?.(false);
      }
    }
  }

  private speakFallback(text: string, tone: VoiceTone) {
    const cleanText = text.replace(/[«»—]/g, ', ').replace(/\s+/g, ' ').trim();
    if (!cleanText || this.isMuted) return;

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.onSpeakingChange?.(true);
      this.fallbackTimer = globalThis.setTimeout(() => {
        this.onSpeakingChange?.(false);
      }, 2800);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ru-RU';
    utterance.rate = tone === 'official' ? 0.94 : 1.04;
    utterance.pitch = tone === 'official' ? 0.96 : 1.08;
    utterance.onstart = () => this.onSpeakingChange?.(true);
    utterance.onend = () => this.onSpeakingChange?.(false);
    utterance.onerror = () => this.onSpeakingChange?.(false);
    window.speechSynthesis.speak(utterance);
  }

  // Procedural Baroque Harpsichord / Palace Sound Effects
  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'triangle',
    gainVal = 0.06,
    delay = 0
  ) {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const startTime = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(gainVal, startTime + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  }

  public playTimeWarpSound() {
    if (this.isMuted) return;
    const notes = [261.63, 329.63, 392.0, 523.25, 659.25];
    notes.forEach((n, idx) => {
      this.playTone(n, 0.85, 'sine', 0.055, idx * 0.11);
    });
  }

  public playArtifactFoundSound() {
    if (this.isMuted) return;
    this.playTone(587.33, 0.3, 'triangle', 0.06, 0);
    this.playTone(739.99, 0.3, 'triangle', 0.06, 0.08);
    this.playTone(880.0, 0.55, 'triangle', 0.07, 0.16);
  }

  public playToneSwitchSound() {
    if (this.isMuted) return;
    this.playTone(440, 0.1, 'sine', 0.035, 0);
    this.playTone(554.37, 0.14, 'sine', 0.035, 0.05);
  }

  public playAnswerSound(correct: boolean) {
    if (this.isMuted) return;
    if (correct) {
      this.playTone(523.25, 0.22, 'triangle', 0.06, 0);
      this.playTone(659.25, 0.22, 'triangle', 0.06, 0.08);
      this.playTone(783.99, 0.45, 'triangle', 0.07, 0.16);
    } else {
      this.playTone(293.66, 0.25, 'sawtooth', 0.03, 0);
      this.playTone(261.63, 0.4, 'triangle', 0.045, 0.11);
    }
  }

  public playVerdictSound(passed: boolean) {
    if (this.isMuted) return;
    if (passed) {
      const fanfare = [392.0, 493.88, 587.33, 783.99];
      fanfare.forEach((n, i) =>
        this.playTone(n, 0.5, 'triangle', 0.065, i * 0.11)
      );
    } else {
      this.playTone(246.94, 0.35, 'triangle', 0.05, 0);
      this.playTone(220.0, 0.55, 'triangle', 0.05, 0.16);
    }
  }
}

export const audioEngine = new AudioEngine();
