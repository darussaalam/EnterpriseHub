/**
 * EA FC 27 Web Edition - Web Audio API Sound Engine
 * Procedurally generates realistic crowd ambience, whistles, kicks, post dings, and goal roars
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.isMuted = false;
        this.crowdNode = null;
        this.crowdGain = null;
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);
            this.isInitialized = true;
            this.startCrowdAmbience();
        } catch (e) {
            console.warn('Web Audio API not supported or blocked by browser policy:', e);
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setMuted(muted) {
        this.isMuted = muted;
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(muted ? 0 : 0.7, this.ctx.currentTime);
        }
    }

    // Generate brown/pink noise for stadium crowd
    startCrowdAmbience() {
        if (!this.ctx || this.crowdNode) return;

        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;

        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(380, this.ctx.currentTime);

        this.crowdGain = this.ctx.createGain();
        this.crowdGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(this.crowdGain);
        this.crowdGain.connect(this.masterGain);

        whiteNoise.start(0);
        this.crowdNode = whiteNoise;
    }

    // Ball kick thump sound
    playKick(power = 0.7) {
        if (!this.ctx || this.isMuted) return;
        this.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        const startFreq = 140 * (0.8 + power * 0.5);
        osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.6 * power, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.13);
    }

    // Referee whistle sound
    playWhistle(isDouble = false) {
        if (!this.ctx || this.isMuted) return;
        this.resume();

        const playBlast = (startTime, duration) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const modOsc = this.ctx.createOscillator();
            const modGain = this.ctx.createGain();

            modOsc.frequency.value = 24;
            modGain.gain.value = 200;
            modOsc.connect(osc.frequency);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(2400, startTime);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.35, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

            osc.connect(gain);
            gain.connect(this.masterGain);

            modOsc.start(startTime);
            osc.start(startTime);
            modOsc.stop(startTime + duration);
            osc.stop(startTime + duration);
        };

        const now = this.ctx.currentTime;
        if (isDouble) {
            playBlast(now, 0.18);
            playBlast(now + 0.22, 0.45);
        } else {
            playBlast(now, 0.35);
        }
    }

    // Goal Post Ding sound
    playPostHit() {
        if (!this.ctx || this.isMuted) return;
        this.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, this.ctx.currentTime); // B5 note metallic ring

        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.7);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.75);
    }

    // Massive Stadium Cheer for Goals
    playGoalCheer() {
        if (!this.ctx || this.isMuted) return;
        this.resume();

        // Boost crowd volume dynamically
        if (this.crowdGain) {
            const now = this.ctx.currentTime;
            this.crowdGain.gain.cancelScheduledValues(now);
            this.crowdGain.gain.setValueAtTime(0.18, now);
            this.crowdGain.gain.linearRampToValueAtTime(0.85, now + 0.4);
            this.crowdGain.gain.exponentialRampToValueAtTime(0.2, now + 4.5);
        }

        // Add a horn & brass blast effect
        const horn = this.ctx.createOscillator();
        const hornGain = this.ctx.createGain();
        horn.type = 'sawtooth';
        horn.frequency.setValueAtTime(220, this.ctx.currentTime);
        horn.frequency.setValueAtTime(293.66, this.ctx.currentTime + 0.3); // D4

        hornGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        hornGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.0);

        horn.connect(hornGain);
        hornGain.connect(this.masterGain);

        horn.start();
        horn.stop(this.ctx.currentTime + 2.1);
    }

    // UI Click feedback
    playUIClick() {
        if (!this.ctx || this.isMuted) return;
        this.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.06);
    }
}

export const soundEngine = new SoundEngine();
