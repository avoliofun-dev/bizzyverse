/**
 * BizVerse Audio Engine using Web Audio API
 * Generates futuristic sci-fi sound effects and ambient sound synthesis
 * No external audio files needed!
 */

class BizAudio {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.ambientGain = null;
        this.ambientOsc1 = null;
        this.ambientOsc2 = null;
        this.isAmbientPlaying = false;
        
        // Load mute preference
        const saved = localStorage.getItem('bizverse_audio_muted');
        if (saved !== null) {
            this.muted = saved === 'true';
        }
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('bizverse_audio_muted', this.muted);
        if (this.muted && this.ambientGain) {
            this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
        } else if (!this.muted && this.isAmbientPlaying && this.ambientGain) {
            this.ambientGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        }
        return this.muted;
    }

    playClick() {
        if (this.muted) return;
        this.init();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.05);

            gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.05);
        } catch (e) {
            // Audio policy fallback
        }
    }

    playCash() {
        if (this.muted) return;
        this.init();
        try {
            const now = this.ctx.currentTime;
            [987.77, 1318.51].forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + i * 0.08);

                gain.gain.setValueAtTime(0.12, now + i * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + i * 0.08);
                osc.stop(now + i * 0.08 + 0.25);
            });
        } catch (e) {}
    }

    playUpgrade() {
        if (this.muted) return;
        this.init();
        try {
            const now = this.ctx.currentTime;
            const chords = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, High C
            chords.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + idx * 0.06);

                gain.gain.setValueAtTime(0.15, now + idx * 0.06);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.4);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + idx * 0.06);
                osc.stop(now + idx * 0.06 + 0.4);
            });
        } catch (e) {}
    }

    playAlert() {
        if (this.muted) return;
        this.init();
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.setValueAtTime(554.37, now + 0.1);

            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.3);
        } catch (e) {}
    }

    playTrade(isProfit = true) {
        if (this.muted) return;
        this.init();
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            if (isProfit) {
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(1000, now + 0.15);
            } else {
                osc.frequency.setValueAtTime(500, now);
                osc.frequency.exponentialRampToValueAtTime(300, now + 0.15);
            }

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.2);
        } catch (e) {}
    }

    startAmbient() {
        if (this.isAmbientPlaying) return;
        this.init();
        try {
            this.ambientGain = this.ctx.createGain();
            this.ambientGain.gain.setValueAtTime(this.muted ? 0 : 0.03, this.ctx.currentTime);

            // Low frequency cyber drone
            this.ambientOsc1 = this.ctx.createOscillator();
            this.ambientOsc1.type = 'sine';
            this.ambientOsc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note

            // Soft detuned harmonic
            this.ambientOsc2 = this.ctx.createOscillator();
            this.ambientOsc2.type = 'sine';
            this.ambientOsc2.frequency.setValueAtTime(110.5, this.ctx.currentTime);

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(180, this.ctx.currentTime);

            this.ambientOsc1.connect(filter);
            this.ambientOsc2.connect(filter);
            filter.connect(this.ambientGain);
            this.ambientGain.connect(this.ctx.destination);

            this.ambientOsc1.start();
            this.ambientOsc2.start();
            this.isAmbientPlaying = true;
        } catch (e) {}
    }
}

window.bizAudio = new BizAudio();
