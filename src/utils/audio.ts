/**
 * Web Audio API synthesizer for futuristic sci-fi scanner sounds and comedy effects
 */

let audioCtx: AudioContext | null = null;
let scannerOsc: OscillatorNode | null = null;
let scannerGain: GainNode | null = null;
let isMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function toggleAudioMute(): boolean {
  isMuted = !isMuted;
  if (isMuted && scannerOsc) {
    stopScannerSound();
  }
  return isMuted;
}

export function getAudioMuted(): boolean {
  return isMuted;
}

export function playBlip(freq: number = 880, type: OscillatorType = 'sine', duration: number = 0.08) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Ignore audio autoplay restrictions
  }
}

export function startScannerSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    stopScannerSound();

    scannerOsc = ctx.createOscillator();
    scannerGain = ctx.createGain();

    scannerOsc.type = 'sawtooth';
    scannerOsc.frequency.setValueAtTime(220, ctx.currentTime);

    // Filter to give high-tech MRI/laser hum
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(440, ctx.currentTime);
    filter.Q.setValueAtTime(3, ctx.currentTime);

    scannerGain.gain.setValueAtTime(0.04, ctx.currentTime);

    scannerOsc.connect(filter);
    filter.connect(scannerGain);
    scannerGain.connect(ctx.destination);

    scannerOsc.start();
  } catch {
    // Audio context may not be allowed until user gesture
  }
}

export function stopScannerSound() {
  try {
    if (scannerOsc) {
      scannerOsc.stop();
      scannerOsc.disconnect();
      scannerOsc = null;
    }
  } catch {
    // Ignore cleanup error
  }
}

export function playEmergencyAlarm() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // Two-tone warning klaxon
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';

      const startTime = now + i * 0.35;
      osc.frequency.setValueAtTime(650, startTime);
      osc.frequency.linearRampToValueAtTime(320, startTime + 0.28);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.linearRampToValueAtTime(0.001, startTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    }
  } catch {
    // Ignore
  }
}

export function playGlitchZap() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.setValueAtTime(940, now + 0.05);
    osc.frequency.setValueAtTime(60, now + 0.1);
    osc.frequency.setValueAtTime(1400, now + 0.15);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  } catch {
    // Ignore
  }
}

export function playSadHorn() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const notes = [293.66, 277.18, 261.63, 246.94]; // D4, C#4, C4, B3 (wah wah wah waaaah)
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';

      const start = now + idx * 0.22;
      const duration = idx === 3 ? 0.6 : 0.2;

      osc.frequency.setValueAtTime(freq, start);
      if (idx === 3) {
        osc.frequency.linearRampToValueAtTime(freq - 20, start + duration);
      }

      gain.gain.setValueAtTime(0.16, start);
      gain.gain.linearRampToValueAtTime(0.001, start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + duration);
    });
  } catch {
    // Ignore
  }
}

export function playSuccessDing() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.setValueAtTime(880, now + 0.1); // A5

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  } catch {
    // Ignore
  }
}
