import { $soundEnabled } from '../stores/settingsStore';

let audioCtx: AudioContext | null = null;
let humOscillator: OscillatorNode | null = null;
let humGain: GainNode | null = null;

function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
}

export function playKeystroke() {
  if (!$soundEnabled.get()) return;
  initAudio();
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'square';
  // random frequency between 1000 and 1500 for clicky variance
  osc.frequency.setValueAtTime(1000 + Math.random() * 500, audioCtx.currentTime);
  
  gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.05);
}

export function playBootChime() {
  if (!$soundEnabled.get()) return;
  initAudio();
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
  osc.frequency.setValueAtTime(554.37, audioCtx.currentTime + 0.2); // C#5
  osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.4); // E5

  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.2);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 2.5);
}

export function toggleCrtHum(enable: boolean) {
  if (!enable || !$soundEnabled.get()) {
    if (humGain && audioCtx) {
      humGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.1);
    }
    return;
  }

  initAudio();
  if (!audioCtx) return;

  if (!humOscillator) {
    humOscillator = audioCtx.createOscillator();
    humGain = audioCtx.createGain();
    
    humOscillator.type = 'sine';
    humOscillator.frequency.value = 60; // 60Hz hum

    humGain.gain.value = 0;
    
    humOscillator.connect(humGain);
    humGain.connect(audioCtx.destination);
    humOscillator.start();
  }

  humGain.gain.setTargetAtTime(0.02, audioCtx.currentTime, 0.5);
}
