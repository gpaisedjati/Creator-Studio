import { useEffect, useRef } from 'react';
import { Episode, Scene } from '../../types';

class SoundSynth {
  ctx: AudioContext | null = null;
  bgOsc: OscillatorNode | null = null;
  bgGain: GainNode | null = null;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTick() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    
    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playDing() {
    if (!this.ctx) return;
    
    // Play a magical "fairy dust" chime effect
    const numChimes = 6;
    const baseFreq = 800;
    
    for (let i = 0; i < numChimes; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'sine';
      
      // Randomize frequencies for a sparkly effect
      const freq = baseFreq + Math.random() * 1200 + (i * 200);
      const time = this.ctx.currentTime + (i * 0.08);
      const dur = 0.6 + Math.random() * 0.4;
      
      osc.frequency.setValueAtTime(freq, time);
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.15, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
      
      osc.start(time);
      osc.stop(time + dur);
    }
  }

  playSwoosh() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2000, this.ctx.currentTime + 0.2);
    filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.5);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    noise.start(this.ctx.currentTime);
  }

  startAmbience() {
    if (!this.ctx) return;
    if (this.bgOsc) return;

    this.bgOsc = this.ctx.createOscillator();
    this.bgGain = this.ctx.createGain();
    this.bgOsc.connect(this.bgGain);
    this.bgGain.connect(this.ctx.destination);
    
    this.bgOsc.type = 'sine';
    // a low, calming hum
    this.bgOsc.frequency.setValueAtTime(120, this.ctx.currentTime);
    
    this.bgGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.bgGain.gain.linearRampToValueAtTime(0.02, this.ctx.currentTime + 2); // very soft
    
    this.bgOsc.start(this.ctx.currentTime);
  }

  stopAmbience() {
    if (this.bgOsc && this.bgGain && this.ctx) {
      this.bgGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);
      this.bgOsc.stop(this.ctx.currentTime + 1);
      this.bgOsc = null;
      this.bgGain = null;
    }
  }
}

const synth = new SoundSynth();

export function useAudioEngine(episode: Episode | null, currentScene: Scene | null) {
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!episode) {
      synth.stopAmbience();
      return;
    }
    
    synth.init();
    synth.startAmbience();

    return () => {
      synth.stopAmbience();
    };
  }, [episode]);

  useEffect(() => {
    if (!currentScene) return;

    synth.init();
    
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    if (currentScene.type !== 'answer' && currentScene.type !== 'countdown') {
      synth.playSwoosh();
    }

    if (currentScene.type === 'countdown') {
      let ticks = 0;
      synth.playTick();
      countdownIntervalRef.current = setInterval(() => {
        ticks++;
        if (ticks < currentScene.seconds) {
          synth.playTick();
        } else {
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        }
      }, 1000);
    }

    if (currentScene.type === 'answer') {
      synth.playDing();
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [currentScene]);

}
