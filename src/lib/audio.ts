let ctx: AudioContext | null = null;
let droneGain: GainNode | null = null;
let droneOsc: OscillatorNode | null = null;
let tickInterval: ReturnType<typeof setInterval> | null = null;
let started = false;

export function initAudio() {
  if (started) return;
  ctx = new AudioContext();
  started = true;
}

export function startDrone() {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 55;
  gain.gain.value = 0.04;
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  droneOsc = osc;
  droneGain = gain;
}

export function startTicking(urgent: boolean = false) {
  if (!ctx) return;
  stopTicking();
  tickInterval = setInterval(() => {
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = urgent ? 1200 : 800;
    gain.gain.value = urgent ? 0.06 : 0.03;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }, urgent ? 500 : 1000);
}

export function stopTicking() {
  if (tickInterval) { clearInterval(tickInterval); tickInterval = null; }
}

export function playPin() {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = 600;
  gain.gain.value = 0.08;
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.15);
}

export function playAccuse() {
  if (!ctx) return;
  [200, 250, 150].forEach((freq, i) => {
    const osc = ctx!.createOscillator();
    const gain = ctx!.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = freq;
    gain.gain.value = 0.06;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx!.currentTime + 0.3 + i * 0.15);
    osc.connect(gain).connect(ctx!.destination);
    osc.start(ctx!.currentTime + i * 0.15);
    osc.stop(ctx!.currentTime + 0.3 + i * 0.15);
  });
}

export function playReceive() {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 440;
  osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.08);
  gain.gain.value = 0.04;
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.12);
}

export function stopAll() {
  stopTicking();
  if (droneOsc) { try { droneOsc.stop(); } catch {} droneOsc = null; }
  if (droneGain) droneGain = null;
}
