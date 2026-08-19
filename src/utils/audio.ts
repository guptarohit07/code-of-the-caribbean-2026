/**
 * Procedural Pirate Audio Synthesizer (Web Audio API)
 * Zero external asset dependencies - instant, lightweight, works offline
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Global Audio States with localStorage persistence
let sfxEnabled = true;
let ambientEnabled = false;
let masterVolume = 0.7;

if (typeof window !== 'undefined') {
  const savedSfx = localStorage.getItem('cotc_sfx_enabled');
  if (savedSfx !== null) sfxEnabled = savedSfx === 'true';

  const savedAmbient = localStorage.getItem('cotc_ambient_enabled');
  if (savedAmbient !== null) ambientEnabled = savedAmbient === 'true';

  const savedVol = localStorage.getItem('cotc_audio_volume');
  if (savedVol !== null) {
    const parsed = parseFloat(savedVol);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) masterVolume = parsed;
  }
}

export function getSFXState(): boolean {
  return sfxEnabled;
}

export function setSFXState(enabled: boolean): void {
  sfxEnabled = enabled;
  if (typeof window !== 'undefined') {
    localStorage.setItem('cotc_sfx_enabled', String(enabled));
  }
}

export function getAmbientState(): boolean {
  return ambientEnabled;
}

export function setMasterVolume(vol: number): void {
  masterVolume = Math.max(0, Math.min(1, vol));
  if (typeof window !== 'undefined') {
    localStorage.setItem('cotc_audio_volume', String(masterVolume));
  }
  if (ambientGainNode) {
    ambientGainNode.gain.setTargetAtTime(ambientEnabled ? 0.35 * masterVolume : 0, audioCtx?.currentTime || 0, 0.1);
  }
}

export function getMasterVolume(): number {
  return masterVolume;
}

/**
 * Wooden Plank Click Sound
 * Simulates the solid tactile knock of pirate ship wood deck
 */
export function playPlankClick(): void {
  if (!sfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. Resonant wood body knock (pitch drop)
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.exponentialRampToValueAtTime(55, now + 0.05);

  oscGain.gain.setValueAtTime(0.4 * masterVolume, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  osc.connect(oscGain);
  oscGain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.06);

  // 2. High snap click (hollow wood impact)
  const bufferSize = Math.floor(ctx.sampleRate * 0.03);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.005));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1200, now);
  filter.Q.setValueAtTime(3, now);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.25 * masterVolume, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  noise.start(now);
}

/**
 * Cannon Blast SFX
 * Deep explosive blast with sub-bass drop, heavy noise punch, and ship rumble
 */
export function playCannonBlast(): void {
  if (!sfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. Massive Sub-bass boom (Sub-frequency drop)
  const subOsc = ctx.createOscillator();
  const subGain = ctx.createGain();

  subOsc.type = 'sine';
  subOsc.frequency.setValueAtTime(140, now);
  subOsc.frequency.exponentialRampToValueAtTime(28, now + 0.8);

  subGain.gain.setValueAtTime(0.9 * masterVolume, now);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

  subOsc.connect(subGain);
  subGain.connect(ctx.destination);

  subOsc.start(now);
  subOsc.stop(now + 1.2);

  // 2. Explosive Gunpowder Noise Burst with low-pass sweep
  const duration = 2.0;
  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);

  let lastOut = 0.0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    // Brown noise integration for heavier boom
    noiseData[i] = (lastOut + 0.02 * white) / 1.02;
    lastOut = noiseData[i];
    noiseData[i] *= 3.5;
  }

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1200, now);
  filter.frequency.exponentialRampToValueAtTime(60, now + 1.5);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(1.0 * masterVolume, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  noiseSource.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  noiseSource.start(now);

  // 3. High cannon crack / ignition transient
  const crackBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.08), ctx.sampleRate);
  const crackData = crackBuffer.getChannelData(0);
  for (let i = 0; i < crackData.length; i++) {
    crackData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.01));
  }
  const crackSource = ctx.createBufferSource();
  crackSource.buffer = crackBuffer;
  const crackGain = ctx.createGain();
  crackGain.gain.setValueAtTime(0.6 * masterVolume, now);
  crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  crackSource.connect(crackGain);
  crackGain.connect(ctx.destination);
  crackSource.start(now);
}

/**
 * Golden Treasure Doubloon Shimmer SFX
 */
export function playTreasureOpenSFX(): void {
  if (!sfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const frequencies = [587.33, 880, 1174.66, 1760, 2349.32]; // D, A, D, A, D pentatonic chime

  frequencies.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + index * 0.06);

    gain.gain.setValueAtTime(0.001, now + index * 0.06);
    gain.gain.linearRampToValueAtTime(0.2 * masterVolume, now + index * 0.06 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.06 + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + index * 0.06);
    osc.stop(now + index * 0.06 + 0.65);
  });
}

// Ambient Ocean & Ship Creak System
let ambientGainNode: GainNode | null = null;
let ambientNoiseSource: AudioBufferSourceNode | null = null;
let isAmbientRunning = false;
let creakInterval: number | null = null;

function createPinkNoiseBuffer(ctx: AudioContext, seconds = 10): AudioBuffer {
  const bufferSize = ctx.sampleRate * seconds;
  const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
  
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
  }
  return buffer;
}

function playShipTimberCreak(ctx: AudioContext, destination: AudioNode) {
  if (!ambientEnabled) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  const startFreq = 160 + Math.random() * 80;
  const endFreq = startFreq + (Math.random() > 0.5 ? 40 : -40);

  osc.frequency.setValueAtTime(startFreq, now);
  osc.frequency.linearRampToValueAtTime(endFreq, now + 0.7);

  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(320 + Math.random() * 100, now);
  filter.Q.setValueAtTime(8, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.08 * masterVolume, now + 0.2);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(destination);

  osc.start(now);
  osc.stop(now + 0.85);
}

export function startAmbientOceanAudio(): void {
  const ctx = getAudioContext();
  if (!ctx || isAmbientRunning) return;

  try {
    const buffer = createPinkNoiseBuffer(ctx, 10);
    ambientNoiseSource = ctx.createBufferSource();
    ambientNoiseSource.buffer = buffer;
    ambientNoiseSource.loop = true;

    // Resonant wave filter
    const waveFilter = ctx.createBiquadFilter();
    waveFilter.type = 'lowpass';
    waveFilter.Q.setValueAtTime(2.5, ctx.currentTime);

    // LFO for wave surges (waves breaking every 8s)
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // ~8.3 sec period

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(350, ctx.currentTime); // Filter modulation range

    waveFilter.frequency.setValueAtTime(450, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(waveFilter.frequency);

    ambientGainNode = ctx.createGain();
    ambientGainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    ambientGainNode.gain.linearRampToValueAtTime(0.35 * masterVolume, ctx.currentTime + 1.5);

    ambientNoiseSource.connect(waveFilter);
    waveFilter.connect(ambientGainNode);
    ambientGainNode.connect(ctx.destination);

    ambientNoiseSource.start();
    lfo.start();
    isAmbientRunning = true;
    ambientEnabled = true;

    if (typeof window !== 'undefined') {
      localStorage.setItem('cotc_ambient_enabled', 'true');
    }

    // Occasional subtle ship timber creak
    if (creakInterval) window.clearInterval(creakInterval);
    creakInterval = window.setInterval(() => {
      if (isAmbientRunning && ambientGainNode && audioCtx) {
        playShipTimberCreak(audioCtx, ambientGainNode);
      }
    }, 12000 + Math.random() * 8000);
  } catch (err) {
    console.warn('Ambient ocean audio error:', err);
  }
}

export function stopAmbientOceanAudio(): void {
  if (!isAmbientRunning) return;
  const ctx = getAudioContext();
  if (ctx && ambientGainNode) {
    ambientGainNode.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    setTimeout(() => {
      try {
        if (ambientNoiseSource) {
          ambientNoiseSource.stop();
          ambientNoiseSource.disconnect();
          ambientNoiseSource = null;
        }
      } catch {
        // Safe disconnect
      }
      isAmbientRunning = false;
    }, 850);
  } else {
    isAmbientRunning = false;
  }

  if (creakInterval) {
    clearInterval(creakInterval);
    creakInterval = null;
  }

  ambientEnabled = false;
  if (typeof window !== 'undefined') {
    localStorage.setItem('cotc_ambient_enabled', 'false');
  }
}

export function toggleAmbientOceanAudio(): boolean {
  if (ambientEnabled) {
    stopAmbientOceanAudio();
    return false;
  } else {
    startAmbientOceanAudio();
    return true;
  }
}
