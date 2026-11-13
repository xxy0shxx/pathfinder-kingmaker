/**
 * СЕРВИС: ПРОЦЕДУРНЫЙ СИНТЕЗ ЗВУКОВ ОКОНЧАНИЯ РАУНДА
 */
const InitiativeAudio = {
    playRoundSound(presetName) {
        const mode = presetName || 'gong';
        if (mode === 'none') return;

        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            const ctx = (window.AnimationManager && window.AnimationManager._sharedAudioCtx) || new AudioCtx();
            if (!ctx) return;
            if (ctx.state === 'suspended') ctx.resume();

            const now = ctx.currentTime;

            if (mode === 'bell') {
                this._playDnbBell(ctx, now);
            } else if (mode === 'drum') {
                this._playDnbDrums(ctx, now);
            } else if (mode === 'magic') {
                this._playIndustrialTechno(ctx, now);
            } else if (mode === 'horn') {
                this._playWarHorn(ctx, now);
            } else if (mode === 'thunder') {
                this._playCombatTheme(ctx, now);
            } else if (mode === 'blade') {
                this._playBladeClash(ctx, now);
            } else if (mode === 'anvil') {
                this._playAnvilStrike(ctx, now);
            } else {
                this._playDefaultGong(ctx, now);
            }
        } catch (audioError) {
            console.warn("Аудио-движок заблокирован до клика:", audioError);
        }
    },

    _playDnbBell(ctx, now) {
        const totalBells = 16;
        const step = 0.086;
        const dnbPatternSteps = [0, 1, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 14.5, 15, 15.5];
        const dnbPitchScale = [1.0, 1.2, 1.5, 1.0, 1.8, 1.5, 2.0, 2.4, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 2.0, 4.5];

        for (let i = 0; i < totalBells; i++) {
            const t = now + (dnbPatternSteps[i] * step);
            const osc = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gainNode = ctx.createGain();
            const freq = 587.33 * dnbPitchScale[i];

            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, t);
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(freq * 2.0, t);

            gainNode.gain.setValueAtTime(0.18, t);
            gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(2500, t);

            osc.connect(filter);
            osc2.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(ctx.destination);

            osc.start(t);
            osc2.start(t);
            osc.stop(t + 0.15);
            osc2.stop(t + 0.15);
        }
    },

    _playDnbDrums(ctx, now) {
        const totalSteps = 32;
        const stepTime = 0.086;
        const dnbMatrix = [
            4, 0, 3, 0, 2, 0, 3, 1,
            3, 0, 4, 0, 2, 0, 3, 0,
            4, 1, 3, 0, 2, 0, 3, 0,
            3, 0, 4, 1, 2, 3, 2, 3
        ];

        for (let i = 0; i < totalSteps; i++) {
            const trigger = dnbMatrix[i];
            if (trigger === 0) continue;
            const t = now + (i * stepTime);

            if (trigger === 1 || trigger === 4) {
                const kickOsc = ctx.createOscillator();
                const kickGain = ctx.createGain();
                kickOsc.type = 'triangle';
                kickOsc.frequency.setValueAtTime(150, t);
                kickOsc.frequency.exponentialRampToValueAtTime(45, t + 0.07);
                kickGain.gain.setValueAtTime(0.45, t);
                kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
                kickOsc.connect(kickGain);
                kickGain.connect(ctx.destination);
                kickOsc.start(t);
                kickOsc.stop(t + 0.13);
            }

            if (trigger === 2) {
                const snareOsc = ctx.createOscillator();
                const snareGain = ctx.createGain();
                snareOsc.type = 'triangle';
                snareOsc.frequency.setValueAtTime(180, t);
                snareOsc.frequency.linearRampToValueAtTime(100, t + 0.06);
                snareGain.gain.setValueAtTime(0.35, t);
                snareGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
                snareOsc.connect(snareGain);
                snareGain.connect(ctx.destination);
                snareOsc.start(t);
                snareOsc.stop(t + 0.09);

                this._triggerNoise(ctx, t, 0.12, 'bandpass', 1200, 0.25);
            }

            if (trigger === 3 || trigger === 4) {
                this._triggerNoise(ctx, t, 0.03, 'highpass', 7500, 0.10);
            }
        }
    },

    _playIndustrialTechno(ctx, now) {
        const totalSteps = 32;
        const stepTime = 0.093;
        const technoMatrix = [
            3, 0, 2, 0, 4, 0, 2, 0,
            3, 0, 2, 1, 4, 0, 2, 0,
            3, 0, 2, 0, 4, 0, 2, 1,
            3, 2, 4, 2, 4, 4, 4, 0
        ];

        for (let i = 0; i < totalSteps; i++) {
            const trigger = technoMatrix[i];
            if (trigger === 0) continue;
            const t = now + (i * stepTime);

            if (trigger === 1 || trigger === 3 || trigger === 4) {
                const kickOsc = ctx.createOscillator();
                const kickGain = ctx.createGain();
                const waveShaper = ctx.createWaveShaper();

                const n_samples = 44100;
                const curve = new Float32Array(n_samples);
                const deg = Math.PI / 180;
                for (let j = 0; j < n_samples; ++j) {
                    const x = (j * 2) / n_samples - 1;
                    curve[j] = (53 * x * 15 * deg) / (Math.PI + 50 * Math.abs(x));
                }
                waveShaper.curve = curve;

                kickOsc.type = 'triangle';
                kickOsc.frequency.setValueAtTime(140, t);
                kickOsc.frequency.exponentialRampToValueAtTime(35, t + 0.08);
                kickGain.gain.setValueAtTime(0.6, t);
                kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

                kickOsc.connect(waveShaper);
                waveShaper.connect(kickGain);
                kickGain.connect(ctx.destination);
                kickOsc.start(t);
                kickOsc.stop(t + 0.15);
            }
            if (trigger === 2 || trigger === 3) {
                const bassOsc = ctx.createOscillator();
                const bassFilter = ctx.createBiquadFilter();
                const bassGain = ctx.createGain();

                bassOsc.type = 'sine';
                bassOsc.frequency.setValueAtTime(65.41, t);
                bassFilter.type = 'lowpass';
                bassFilter.Q.setValueAtTime(5, t);
                bassFilter.frequency.setValueAtTime(180, t);
                bassFilter.frequency.exponentialRampToValueAtTime(450, t + 0.07);

                bassGain.gain.setValueAtTime(0.3, t);
                bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

                bassOsc.connect(bassFilter);
                bassFilter.connect(bassGain);
                bassGain.connect(ctx.destination);
                bassOsc.start(t);
                bassOsc.stop(t + 0.11);
            }

            if (trigger === 4) {
                this._triggerNoise(ctx, t, 0.11, 'lowpass', 950, 0.22);
            }
        }
    },

    _playWarHorn(ctx, now) {
        const duration = 4.0;
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const osc3 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(73.42, now);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(146.83, now);
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(220.00, now);

        osc.frequency.linearRampToValueAtTime(71.5, now + duration);
        osc2.frequency.linearRampToValueAtTime(143.0, now + duration);
        osc3.frequency.linearRampToValueAtTime(215.0, now + duration);

        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.linearRampToValueAtTime(0.28, now + 0.32);
        gainNode.gain.setValueAtTime(0.28, now + 1.4);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(gainNode);
        osc2.connect(gainNode);
        osc3.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now);
        osc2.start(now);
        osc3.start(now);
        osc.stop(now + duration);
        osc2.stop(now + duration);
        osc3.stop(now + duration);
    },

    _playCombatTheme(ctx, now) {
        const totalSteps = 64;
        const stepTime = 0.125;
        const mkThemeScale = [
            880.00, 880.00, 1046.50, 880.00, 1174.66, 880.00, 1318.51, 1174.66,
            1046.50, 1046.50, 1244.51, 1046.50, 1396.91, 1046.50, 1567.98, 1396.91,
            1174.66, 1174.66, 1396.91, 1174.66, 1567.98, 1174.66, 1760.00, 1567.98,
            1046.50, 1046.50, 1244.51, 1046.50, 987.77, 987.77, 783.99, 880.00,
            880.00, 880.00, 1046.50, 880.00, 1174.66, 880.00, 1318.51, 1174.66,
            1046.50, 1046.50, 1244.51, 1046.50, 1396.91, 1046.50, 1567.98, 1396.91,
            1318.51, 1318.51, 1567.98, 1318.51, 1760.00, 1318.51, 1975.53, 1760.00,
            1567.98, 1567.98, 1760.00, 1975.53, 2093.00, 2349.32, 2637.02, 3520.00
        ];
        const drumMatrix = [
            4, 0, 1, 0, 3, 0, 1, 0,
            1, 0, 1, 0, 3, 0, 1, 0,
            4, 0, 1, 0, 3, 0, 1, 0,
            1, 0, 1, 0, 3, 2, 3, 4,
            4, 0, 1, 0, 3, 0, 1, 0,
            1, 0, 1, 0, 3, 0, 1, 0,
            4, 0, 1, 0, 3, 0, 1, 0,
            1, 2, 2, 2, 3, 3, 3, 4
        ];

        for (let i = 0; i < totalSteps; i++) {
            const t = now + (i * stepTime);
            const noteFreq = mkThemeScale[i];
            const drumTrigger = drumMatrix[i];

            if (noteFreq > 0) {
                const synthOsc = ctx.createOscillator();
                const synthOsc2 = ctx.createOscillator();
                const synthFilter = ctx.createBiquadFilter();
                const synthGain = ctx.createGain();

                synthOsc.type = 'square';
                synthOsc.frequency.setValueAtTime(noteFreq, t);
                synthOsc.detune.setValueAtTime(45, t);

                synthOsc2.type = 'sine';
                synthOsc2.frequency.setValueAtTime(noteFreq * 2.0, t);
                synthOsc2.detune.setValueAtTime(45, t);

                synthFilter.type = 'bandpass';
                synthFilter.frequency.setValueAtTime(1900, t);
                synthFilter.Q.setValueAtTime(1.8, t);

                synthGain.gain.setValueAtTime(0.13, t);
                synthGain.gain.exponentialRampToValueAtTime(0.001, t + stepTime * 0.75);

                synthOsc.connect(synthFilter);
                synthOsc2.connect(synthFilter);
                synthFilter.connect(synthGain);
                synthGain.connect(ctx.destination);

                synthOsc.start(t);
                synthOsc2.start(t);
                synthOsc.stop(t + stepTime * 0.8);
                synthOsc2.stop(t + stepTime * 0.8);
            }
            if (drumTrigger === 1 || drumTrigger === 3 || drumTrigger === 4) {
                const kickOsc = ctx.createOscillator();
                const kickGain = ctx.createGain();
                kickOsc.type = 'triangle';
                kickOsc.frequency.setValueAtTime(145, t);
                kickOsc.frequency.exponentialRampToValueAtTime(46, t + 0.08);
                kickGain.gain.setValueAtTime(0.48, t);
                kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
                kickOsc.connect(kickGain);
                kickGain.connect(ctx.destination);
                kickOsc.start(t);
                kickOsc.stop(t + 0.14);
            }

            if (drumTrigger === 2 || drumTrigger === 3 || drumTrigger === 4) {
                const snareOsc = ctx.createOscillator();
                const snareGain = ctx.createGain();
                snareOsc.type = 'triangle';
                snareOsc.frequency.setValueAtTime(205, t);
                snareOsc.frequency.linearRampToValueAtTime(105, t + 0.05);
                snareGain.gain.setValueAtTime(0.33, t);
                snareGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
                snareOsc.connect(snareGain);
                snareGain.connect(ctx.destination);
                snareOsc.start(t);
                snareOsc.stop(t + 0.10);

                this._triggerNoise(ctx, t, 0.11, 'bandpass', 1250, 0.18);
            }

            if (drumTrigger === 4 || i % 2 === 1) {
                this._triggerNoise(ctx, t, 0.03, 'highpass', 7000, 0.07);
            }
        }
    },

    _playBladeClash(ctx, now) {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(2400, now);
        osc.frequency.linearRampToValueAtTime(1800, now + 0.05);
        gainNode.gain.setValueAtTime(0.18, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 2000;
        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
    },

    _playAnvilStrike(ctx, now) {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(620, now);
        gainNode.gain.setValueAtTime(0.4, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
    },

    _playDefaultGong(ctx, now) {
        const osc = ctx.createOscillator();
        const subOsc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const subGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 1.2);
        gainNode.gain.setValueAtTime(0.35, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(180, now);
        subGain.gain.setValueAtTime(0.08, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(gainNode);
        subOsc.connect(subGain);
        gainNode.connect(ctx.destination);
        subGain.connect(ctx.destination);
        osc.start(now);
        subOsc.start(now);
        osc.stop(now + 1.4);
        subOsc.stop(now + 1.4);
    },

    _triggerNoise(ctx, t, duration, filterType, freq, volume) {
        const bufSize = Math.floor(ctx.sampleRate * duration);
        const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let j = 0; j < bufSize; j++) data[j] = Math.random() * 2 - 1;

        const noise = ctx.createBufferSource();
        noise.buffer = buf;

        const filter = ctx.createBiquadFilter();
        filter.type = filterType;
        filter.frequency.setValueAtTime(freq, t);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start(t);
        noise.stop(t + duration + 0.01);
    },

    playEventSound(eventType) {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            const ctx = (window.AnimationManager && window.AnimationManager._sharedAudioCtx) || new AudioCtx();
            if (!ctx) return;
            if (ctx.state === 'suspended') ctx.resume();

            const now = ctx.currentTime;

            if (eventType === 'nat20') {
                this._playNat20Fanfare(ctx, now);
            } else if (eventType === 'nat1') {
                this._playNat1Fail(ctx, now);
            } else if (eventType === 'dying') {
                this._playDyingHeartbeat(ctx, now);
            } else if (eventType === 'prone') {
                this._playProneThud(ctx, now);
            }
        } catch (audioError) {
            console.warn("Аудио-движок заблокирован до клика:", audioError);
        }
    },

    _playNat20Fanfare(ctx, now) {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const t = now + idx * 0.08;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.001, t);
            gain.gain.linearRampToValueAtTime(0.25, t + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + 0.46);
        });
    },

    _playNat1Fail(ctx, now) {
        const notes = [293.66, 277.18, 261.63, 246.94]; // D4 -> C#4 -> C4 -> B3
        notes.forEach((freq, idx) => {
            const t = now + idx * 0.16;
            const dur = idx === 3 ? 0.55 : 0.15;
            const osc = ctx.createOscillator();
            const filter = ctx.createBiquadFilter();
            const gain = ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, t);
            if (idx === 3) {
                osc.frequency.linearRampToValueAtTime(freq - 25, t + dur);
            }

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(900, t);

            gain.gain.setValueAtTime(0.22, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + dur + 0.02);
        });
    },

    _playDyingHeartbeat(ctx, now) {
        // Двойной удар сердца с обертоном, чтобы хорошо читался на любых колонках
        [0, 0.25].forEach((offset, idx) => {
            const t = now + offset;
            const subOsc = ctx.createOscillator();
            const bodyOsc = ctx.createOscillator();
            const gain = ctx.createGain();

            subOsc.type = 'sine';
            subOsc.frequency.setValueAtTime(idx === 0 ? 85 : 75, t);
            subOsc.frequency.exponentialRampToValueAtTime(35, t + 0.18);

            // Второй осциллятор на октаву выше дает плотный "удар в грудь"
            bodyOsc.type = 'triangle';
            bodyOsc.frequency.setValueAtTime(idx === 0 ? 170 : 150, t);
            bodyOsc.frequency.exponentialRampToValueAtTime(55, t + 0.14);

            const peakVol = idx === 0 ? 0.75 : 0.60;
            gain.gain.setValueAtTime(0.001, t);
            gain.gain.linearRampToValueAtTime(peakVol, t + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

            subOsc.connect(gain);
            bodyOsc.connect(gain);
            gain.connect(ctx.destination);

            subOsc.start(t);
            bodyOsc.start(t);
            subOsc.stop(t + 0.23);
            bodyOsc.stop(t + 0.23);
        });
    },

    _playProneThud(ctx, now) {
        // Плотный глухой удар падения + лязг доспехов
        const osc = ctx.createOscillator();
        const midOsc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(42, now + 0.22);

        midOsc.type = 'sawtooth';
        midOsc.frequency.setValueAtTime(220, now);
        midOsc.frequency.exponentialRampToValueAtTime(65, now + 0.14);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.65, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        midOsc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        midOsc.start(now);
        osc.stop(now + 0.26);
        midOsc.stop(now + 0.26);

        // Звук соприкосновения с землей
        this._triggerNoise(ctx, now, 0.16, 'bandpass', 650, 0.42);
    },

};

export default InitiativeAudio;
