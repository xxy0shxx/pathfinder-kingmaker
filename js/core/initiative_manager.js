/**
 * МОДУЛЬ: ТРЕКЕР ИНИЦИАТИВЫ С ТВ-СТРЕЛКОЙ ХОДА И ВСПЫШКОЙ НОВОГО РАУНДА
 */
const InitiativeManager = {
    state: {
        combatants: [],
        selectedUnitId: null,
        round: 1,
        viewMode: 'classic', // Режимы: 'classic' (список) или 'bg3' (горизонт)
        phraseSeed: 0,       // Сид для случайного выбора фраз на каждый ход
        audioPreset: 'gong'  // Пресеты звука раунда — 'gong', 'bell', 'drum'
    },
    mapDataRef: null,
    onSaveCallback: null,
    _isInputsBound: false,
    _isGlobalKeyBound: false,

    init(mapData, onSave) {
        try {
            this.mapDataRef = mapData || { hexes: {}, kingdom: null, initiative: null };
            this.onSaveCallback = onSave;

            if (this.mapDataRef.initiative) {
                this.state = this.mapDataRef.initiative;
                if (!Array.isArray(this.state.combatants)) this.state.combatants = [];
                if (this.state.round === undefined || isNaN(this.state.round)) this.state.round = 1;
                if (this.state.viewMode === undefined) this.state.viewMode = 'classic';
                if (this.state.phraseSeed === undefined) this.state.phraseSeed = 0;
                if (this.state.audioPreset === undefined) this.state.audioPreset = 'gong';
            } else {
                this.mapDataRef.initiative = this.state;
            }

            window.InitiativeManager = this;
            this.renderUi();
            this.bindGlobalHotkeys();
        } catch (e) { console.error("Ошибка инициализации InitiativeManager:", e); }
    },

    bindGlobalHotkeys() {
        if (this._isGlobalKeyBound) return;
        window.addEventListener('keydown', (e) => {
            const container = document.getElementById('initiativeTabletContainer');
            if (!container || container.style.display === 'none') return;
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;

            if (e.code === 'Space') {
                e.preventDefault();
                this.nextTurn();
            }
        });
        this._isGlobalKeyBound = true;
    },

    updateMapData(newMapData) {
        this.mapDataRef = newMapData || { hexes: {}, kingdom: null, initiative: null };
        if (this.mapDataRef.initiative && Array.isArray(this.mapDataRef.initiative.combatants)) {
            this.state = this.mapDataRef.initiative;
        }
        this.renderUi();
    },

    toggleViewMode() {
        this.state.viewMode = this.state.viewMode === 'classic' ? 'bg3' : 'classic';
        this._saveWithoutSort();
    },

    setAudioPreset(presetName) {
        this.state.audioPreset = presetName;
        this._saveWithoutSort();
    },

    addCombatant(name, score, faction, isNat20, isNat1 = false) {
        const cleanName = String(name).trim();
        let parsedScore = parseInt(score, 10);

        if (isNat20) parsedScore = 20;
        if (isNat1) parsedScore = 1;

        if (!cleanName) { alert("Введите имя или название существа!"); return; }
        if (isNaN(parsedScore) || parsedScore < 1 || parsedScore > 100) { alert("Инициатива должна быть от 1 до 100!"); return; }

        const newUnit = {
            id: 'unit_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            name: cleanName,
            score: parsedScore,
            faction: faction || 'neutral',
            isNat20: !!isNat20,
            isNat1: !!isNat1,
            avatar: null // НОВОЕ: Поле для хранения Data-URL или типа аватарки персонажа
        };

        this.state.combatants.push(newUnit);
        if (this.state.combatants.length === 1) {
            this.state.selectedUnitId = newUnit.id;
        }
        this._sortAndSave();
    },

    /**
     * Назначение аватарки персонажу по его ID с фиксацией строкового типа
     */
    setCombatantAvatar(id, avatarType) {
        const unit = this.state.combatants.find(c => c.id === id);
        if (!unit) return;

        unit.avatarType = avatarType || null;

        if (avatarType === 'orc') {
            unit.avatar = this.generateOrcAvatarDataUrl();
        } else if (avatarType === 'elf') {
            unit.avatar = this.generateElfAvatarDataUrl();
        } else if (avatarType === 'dwarf') {
            unit.avatar = this.generateDwarfAvatarDataUrl();
        } else if (avatarType === 'goblin') {
            unit.avatar = this.generateGoblinAvatarDataUrl();
        } else if (avatarType === 'wolf') {
            unit.avatar = this.generateWolfAvatarDataUrl();
        } else if (avatarType === 'spider') {
            unit.avatar = this.generateSpiderAvatarDataUrl();
        } else if (avatarType === 'rogue') {
            unit.avatar = this.generateRogueAvatarDataUrl();
        } else if (avatarType === 'paladin') {
            unit.avatar = this.generatePaladinAvatarDataUrl();
        } else if (avatarType === 'archer') {
            unit.avatar = this.generateArcherAvatarDataUrl();
        } else if (avatarType === 'wizard') {
            unit.avatar = this.generateWizardAvatarDataUrl();
        } else if (avatarType === 'bard') {
            unit.avatar = this.generateBardAvatarDataUrl();
        } else if (avatarType === 'cat') {
            unit.avatar = this.generateCatAvatarDataUrl();
        } else if (avatarType === 'deer') {
            unit.avatar = this.generateDeerAvatarDataUrl();
        } else if (avatarType === 'boar') {
            unit.avatar = this.generateBoarAvatarDataUrl();
        } else if (avatarType === 'bear') {
            unit.avatar = this.generateBearAvatarDataUrl();
        } else if (avatarType === 'elf_archer') {
            unit.avatar = this.generateElfArcherAvatarDataUrl();
        } else if (avatarType === 'priestess') {
            unit.avatar = this.generatePriestessAvatarDataUrl();
        } else if (avatarType === 'halfling') {
            unit.avatar = this.generateHalflingAvatarDataUrl();
        } else if (avatarType === 'halfling_male') {
            unit.avatar = this.generateHalflingMaleAvatarDataUrl();
        } else if (avatarType === 'kobold') {
            unit.avatar = this.generateKoboldAvatarDataUrl();
        } else if (avatarType === 'tiger') {
            unit.avatar = this.generateTigerAvatarDataUrl();
        } else if (avatarType === 'dryad') {
            unit.avatar = this.generateDryadAvatarDataUrl();
        } else if (avatarType === 'barbarian') {
            unit.avatar = this.generateBarbarianAvatarDataUrl();
        } else if (avatarType === 'raven') {
            unit.avatar = this.generateRavenAvatarDataUrl();
        } else if (avatarType === 'toad') {
            unit.avatar = this.generateToadAvatarDataUrl();
        } else if (avatarType === 'worm') {
            unit.avatar = this.generateWormAvatarDataUrl();
        } else if (avatarType === 'warrior_female') {
            unit.avatar = this.generateWarriorFemaleAvatarDataUrl();
        } else if (avatarType === 'bandit_captain') {
            unit.avatar = this.generateBanditCaptainAvatarDataUrl();
        } else if (avatarType === 'tick') {
            unit.avatar = this.generateTickAvatarDataUrl();
        } else if (avatarType === 'dragon') {
            unit.avatar = this.generateDragonAvatarDataUrl();
        } else if (avatarType === 'troll') {
            unit.avatar = this.generateTrollAvatarDataUrl();
        } else if (avatarType === 'frost_giant') {
            unit.avatar = this.generateFrostGiantAvatarDataUrl();
        } else if (avatarType === 'farmer') {
            unit.avatar = this.generateFarmerAvatarDataUrl();
        } else if (avatarType === 'merchant') {
            unit.avatar = this.generateMerchantAvatarDataUrl();
        } else if (avatarType === 'courtesan') {
            unit.avatar = this.generateCourtesanAvatarDataUrl();
        } else if (avatarType === 'hunter') {
            unit.avatar = this.generateHunterAvatarDataUrl();
        } else if (avatarType === 'heavy_warrior') {
            unit.avatar = this.generateHeavyWarriorAvatarDataUrl();
        } else if (avatarType === 'battle_priestess') {
            unit.avatar = this.generateBattlePriestessAvatarDataUrl();
        } else if (avatarType === 'wizardess') {
            unit.avatar = this.generateWizardessAvatarDataUrl();
        } else if (avatarType === 'dwarf_paladin') {
            unit.avatar = this.generateDwarfPaladinAvatarDataUrl();
        } else if (avatarType === 'orc_warrior') {
            unit.avatar = this.generateOrcWarriorAvatarDataUrl(); // Ссылка на новый генератор орка
        } else {
            unit.avatar = null;
        }

        this._saveWithoutSort();
    },




    nextTurn() {
        if (this.state.combatants.length === 0) return;

        const currentIndex = this.state.combatants.findIndex(c => c.id === this.state.selectedUnitId);
        this.state.phraseSeed = Math.floor(Math.random() * 1000);

        if (currentIndex === -1 || currentIndex === this.state.combatants.length - 1) {
            if (this.state.combatants.length > 0) {
                this.state.selectedUnitId = this.state.combatants[0].id;
            }
            this.state.round += 1;
            this.triggerRoundFlashEffect();
        } else {
            this.state.selectedUnitId = this.state.combatants[currentIndex + 1].id;
        }

        this._saveWithoutSort();
    },

    _sortAndSave() {
        this.state.combatants.sort((a, b) => {
            if (a.isNat20 && !b.isNat20) return -1;
            if (!a.isNat20 && b.isNat20) return 1;
            if (a.isNat1 && !b.isNat1) return 1;
            if (!a.isNat1 && b.isNat1) return -1;
            return b.score - a.score;
        });
        this._saveWithoutSort();
    },

    _saveWithoutSort() {
        if (this.mapDataRef) this.mapDataRef.initiative = this.state;
        if (this.onSaveCallback) this.onSaveCallback();
        else localStorage.setItem('hexMapSystemData', JSON.stringify(this.mapDataRef));

        this.renderUi();
        this.scrollToActiveCombatant();
    },

    scrollToActiveCombatant() {
        if (!this.state.selectedUnitId) return;
        const activeCard = document.querySelector(`.init-combatant-card.selected-turn-gold`);
        if (activeCard) {
            activeCard.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        }
    },




    triggerRoundFlashEffect() {
        const oldFlash = document.getElementById('initTvRoundFlashOverlay');
        if (oldFlash) oldFlash.remove();

        const flashOverlay = document.createElement('div');
        flashOverlay.id = 'initTvRoundFlashOverlay';
        flashOverlay.style.cssText = `
            position: fixed !important; left: 0 !important; top: 0 !important;
            width: 100vw !important; height: 100vh !important; pointer-events: none !important;
            z-index: 299999999 !important;
            box-shadow: inset 0 0 200px 50px rgba(255, 216, 117, 0.6) !important;
            background-color: rgba(255, 216, 117, 0.12) !important;
            opacity: 1 !important; transition: opacity 0.6s ease-out !important;
        `;
        document.body.appendChild(flashOverlay);
        requestAnimationFrame(() => { flashOverlay.style.opacity = '0'; });

        try {
            const audioCtx = window.AudioContext || window.webkitAudioContext;
            const ctx = (window.AnimationManager && window.AnimationManager._audioCtx) || new audioCtx();

            if (ctx && ctx.state !== 'suspended') {
                const now = ctx.currentTime;
                const mode = this.state.audioPreset || 'gong';

                // РЕЖИМ ТИШИНЫ
                if (mode === 'none') {
                    setTimeout(() => { if (flashOverlay.parentNode) flashOverlay.remove(); }, 600);
                    return;
                }

                if (mode === 'bell') {
                    // 💎 ПРЕСЕТ: DnB Bell Breakbeat (16 резких ломаных звонов в темпе 174 BPM)
                    const totalBells = 16;

                    // Скорость dnb: 174 BPM. Один шаг сетки (шестнадцатая нота) равен ~0.086 секунды
                    const step = 0.086;

                    // Синкопированная сетка шагов (ломаный DnB брейкбит паттерн на 16 долей)
                    const dnbPatternSteps = [0, 1, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 14.5, 15, 15.5];

                    // Мажорный восходящий и прыгающий звукоряд для качающего перелива
                    const dnbPitchScale = [1.0, 1.2, 1.5, 1.0, 1.8, 1.5, 2.0, 2.4, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 2.0, 4.5];

                    for (let i = 0; i < totalBells; i++) {
                        // Рассчитываем точное время старта по ломаной dnb-сетке
                        const t = now + (dnbPatternSteps[i] * step);

                        const osc = ctx.createOscillator();
                        const osc2 = ctx.createOscillator();
                        const gainNode = ctx.createGain();

                        // Базовая частота 587.33 Гц (Нота Ре 2-й октавы) для пробивного, яркого тона
                        const freq = 587.33 * dnbPitchScale[i];

                        // Используем прямоугольную волну (square) с фильтром для металлического, электронного щелчка
                        osc.type = 'square';
                        osc.frequency.setValueAtTime(freq, t);

                        // Добавляем синусоиду на октаву выше для пронзительного хрусталя
                        osc2.type = 'sine';
                        osc2.frequency.setValueAtTime(freq * 2.0, t);

                        // ЭКСТРЕМАЛЬНО РЕЗКАЯ АТАКА И КОРОТКИЙ СРЕЗ (Стиль стаккато/электронного триггера)
                        gainNode.gain.setValueAtTime(0.18, t); // Мгновенный взрывной старт звука
                        gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.14); // Ультра-короткий резкий хвост

                        // Срезаем лишнюю грязь полосовым фильтром, оставляя только сочный «днб-звон»
                        const filter = ctx.createBiquadFilter();
                        filter.type = 'bandpass';
                        filter.frequency.setValueAtTime(2500, t);

                        // Сборка аудио-графа
                        osc.connect(filter);
                        osc2.connect(filter);
                        filter.connect(gainNode);
                        gainNode.connect(ctx.destination);

                        // Старт и стоп в микро-кванты времени
                        osc.start(t);
                        osc2.start(t);
                        osc.stop(t + 0.15);
                        osc2.stop(t + 0.15);
                    }

                } else if (mode === 'drum') {
                    const totalSteps = 32;
                    const stepTime = 0.086;

                    const dnbMatrix = [
                        4, 0, 3, 0, 2, 0, 3, 1, // Такт 1
                        3, 0, 4, 0, 2, 0, 3, 0, // Такт 2
                        4, 1, 3, 0, 2, 0, 3, 0, // Такт 3
                        3, 0, 4, 1, 2, 3, 2, 3  // Такт 4
                    ];

                    for (let i = 0; i < totalSteps; i++) {
                        const trigger = dnbMatrix[i];
                        if (trigger === 0) continue;

                        const t = now + (i * stepTime);

                        // --- 1. СИНТЕЗ КИКА (БОЧКИ) ---
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

                        // --- 2. СИНТЕЗ СНЕЙРА (РАБОЧЕГО БАРАБАНА С ШУМОВОЙ ПРУЖИНОЙ) ---
                        if (trigger === 2) {
                            // Низкочастотный тон пластика снейра
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

                            const bufferSize = Math.floor(ctx.sampleRate * 0.12);
                            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                            const data = buffer.getChannelData(0);
                            for (let j = 0; j < bufferSize; j++) {
                                data[j] = Math.random() * 2 - 1;
                            }

                            const snareNoise = ctx.createBufferSource();
                            snareNoise.buffer = buffer;

                            const snareFilter = ctx.createBiquadFilter();
                            snareFilter.type = 'bandpass';
                            snareFilter.frequency.setValueAtTime(1200, t);

                            const noiseGain = ctx.createGain();
                            noiseGain.gain.setValueAtTime(0.25, t);
                            noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

                            snareNoise.connect(snareFilter);
                            snareFilter.connect(noiseGain);
                            noiseGain.connect(ctx.destination);
                            snareNoise.start(t);
                            snareNoise.stop(t + 0.13);
                        }

                        // --- 3. СИНТЕЗ ХЭТА (ОСТРОЕ ЦЫКАНЬЕ ТАРЕЛОК) ---
                        if (trigger === 3 || trigger === 4) {
                            const bufferSize = Math.floor(ctx.sampleRate * 0.03);
                            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                            const data = buffer.getChannelData(0);
                            for (let j = 0; j < bufferSize; j++) {
                                data[j] = Math.random() * 2 - 1;
                            }

                            const hatNoise = ctx.createBufferSource();
                            hatNoise.buffer = buffer;

                            const hatFilter = ctx.createBiquadFilter();
                            hatFilter.type = 'highpass';
                            hatFilter.frequency.setValueAtTime(7500, t);

                            const hatGain = ctx.createGain();
                            hatGain.gain.setValueAtTime(0.10, t);
                            hatGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

                            hatNoise.connect(hatFilter);
                            hatFilter.connect(hatGain);
                            hatGain.connect(ctx.destination);
                            hatNoise.start(t);
                            hatNoise.stop(t + 0.04);
                        }
                    }

                } else if (mode === 'magic') {
                    // ⚡ ПРЕСЕТ: Industrial Straight Techno (Прямой жесткий берлинский кач, 160 BPM)
                    const totalSteps = 32;
                    // Идеальный темп 160 BPM: один шаг 16-й ноты равен ровно 0.093 секунды
                    const stepTime = 0.093;

                    // Матрица паттерна (1 - Прямой Кик, 2 - Off-Beat Бас, 3 - Кик + Бас, 4 - Гидравлический Хлопок)
                    const technoMatrix = [
                        3, 0, 2, 0, 4, 0, 2, 0, // Такт 1 (Строгий, гипнотический прямой ритм)
                        3, 0, 2, 1, 4, 0, 2, 0, // Такт 2
                        3, 0, 2, 0, 4, 0, 2, 1, // Такт 3
                        3, 2, 4, 2, 4, 4, 4, 0  // Такт 4 (Индустриальная пулеметная сбивка в конце)
                    ];

                    for (let i = 0; i < totalSteps; i++) {
                        const trigger = technoMatrix[i];
                        if (trigger === 0) continue;

                        const t = now + (i * stepTime);

                        // --- 1. INDUSTRIAL HEAVY KICK (ПЛОТНАЯ БОЧКА С МОЩНЫМ КЛИППИНГОМ) ---
                        if (trigger === 1 || trigger === 3 || trigger === 4) {
                            const kickOsc = ctx.createOscillator();
                            const kickGain = ctx.createGain();
                            const waveShaper = ctx.createWaveShaper();

                            // Фирменное плотное насыщение низов для тяжелого, грязного удара
                            const makeTechnoDistortion = (amount) => {
                                const k = typeof amount === 'number' ? amount : 50;
                                const n_samples = 44100;
                                const curve = new Float32Array(n_samples);
                                const deg = Math.PI / 180;
                                for (let j = 0; j < n_samples; ++j) {
                                    const x = (j * 2) / n_samples - 1;
                                    curve[j] = ((3 + k) * x * 15 * deg) / (Math.PI + k * Math.abs(x));
                                }
                                return curve;
                            };
                            waveShaper.curve = makeTechnoDistortion(50);

                            kickOsc.type = 'triangle';
                            kickOsc.frequency.setValueAtTime(140, t); // Ударный пинок
                            kickOsc.frequency.exponentialRampToValueAtTime(35, t + 0.08); // Мрачный суббас

                            kickGain.gain.setValueAtTime(0.6, t);
                            kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

                            kickOsc.connect(waveShaper);
                            waveShaper.connect(kickGain);
                            kickGain.connect(ctx.destination);

                            kickOsc.start(t);
                            kickOsc.stop(t + 0.15);
                        }

                        // --- 2. OFF-BEAT TECHNO BASS (КАЧАЮЩИЙ СИНКОПИРОВАННЫЙ БАС) ---
                        if (trigger === 2 || trigger === 3) {
                            const bassOsc = ctx.createOscillator();
                            const bassFilter = ctx.createBiquadFilter();
                            const bassGain = ctx.createGain();

                            // Мягкий синус для раскатистого подвального баса, бьющего между ударами бочки
                            bassOsc.type = 'sine';
                            bassOsc.frequency.setValueAtTime(65.41, t); // Глубокая нота До большой октавы

                            // Лоу-пасс фильтр намертво зажимает свист, оставляя чистый кач (всего 450 Гц)
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

                        // --- 3. HYDRAULIC PRESS CLAP (ГЛУХОЙ ХЛОПОК-ЗАВОДСКОЙ ПРЕСС) ---
                        if (trigger === 4) {
                            const bufferSize = Math.floor(ctx.sampleRate * 0.12);
                            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                            const data = buffer.getChannelData(0);
                            for (let j = 0; j < bufferSize; j++) { data[j] = Math.random() * 2 - 1; }

                            const clapNoise = ctx.createBufferSource();
                            clapNoise.buffer = buffer;

                            // Фильтр низких частот убирает песок, делая хлопок глухим и тяжелым
                            const lowPassFilter = ctx.createBiquadFilter();
                            lowPassFilter.type = 'lowpass';
                            lowPassFilter.frequency.setValueAtTime(950, t);

                            const clapGain = ctx.createGain();
                            clapGain.gain.setValueAtTime(0.22, t);
                            clapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);

                            clapNoise.connect(lowPassFilter);
                            lowPassFilter.connect(clapGain);
                            clapGain.connect(ctx.destination);

                            clapNoise.start(t);
                            clapNoise.stop(t + 0.12);
                        }
                    }

                } else if (mode === 'horn') {
                    // 2. ПРЕСЕТ: Сигнальный боевой рог (Благородный, плотный и протяжный мажорный призыв)
                    const duration = 4.0; // Протяжное парящее звучание (4 секунды)
                    const now = ctx.currentTime;

                    const osc = ctx.createOscillator();
                    const osc2 = ctx.createOscillator();
                    const osc3 = ctx.createOscillator();
                    const gainNode = ctx.createGain();

                    // ИДЕАЛЬНАЯ СРЕДНЯЯ ВЫСОТА: Плотный, но чистый медный регистр
                    // Базовый тон — мягкая треугольная волна для тела звука (Ре большой октавы, 73.42 Гц)
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(73.42, now);

                    // Второй тон — чистая синусоида на октаву выше для раскрытия тембра (Ре малой октавы, 146.83 Гц)
                    osc2.type = 'sine';
                    osc2.frequency.setValueAtTime(146.83, now);

                    // Третий тон — идеальная мажорная квинта для создания светлого, триумфального созвучия (Ля малой октавы, 220.00 Гц)
                    osc3.type = 'sine';
                    osc3.frequency.setValueAtTime(220.00, now);

                    // Имитируем естественное затихание дыхания: частота к концу выдоха плавно и едва заметно опускается
                    osc.frequency.linearRampToValueAtTime(71.5, now + duration);
                    osc2.frequency.linearRampToValueAtTime(143.0, now + duration);
                    osc3.frequency.linearRampToValueAtTime(215.0, now + duration);

                    // Плавное нарастание и долгое раскатистое эхо
                    gainNode.gain.setValueAtTime(0.001, now);
                    gainNode.gain.linearRampToValueAtTime(0.28, now + 0.32); // Величественный, мягкий старт выдоха
                    gainNode.gain.setValueAtTime(0.28, now + 1.4);          // Удержание плотности
                    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration); // Воздушное затухание в тишину

                    // Сборка аудио-графа
                    osc.connect(gainNode);
                    osc2.connect(gainNode);
                    osc3.connect(gainNode);
                    gainNode.connect(ctx.destination);

                    // Синхронный запуск всех гармоник
                    osc.start(now);
                    osc2.start(now);
                    osc3.start(now);

                    // Автоматическая остановка узлов
                    osc.stop(now + duration);
                    osc2.stop(now + duration);
                    osc3.stop(now + duration);



                } else if (mode === 'thunder') {
                    // ⚡ ПРЕСЕТ: Mortal Kombat Theme (64 шага, Точная тональность A-Minor + Питч-детюн, 120 BPM)
                    const totalSteps = 64;
                    const stepTime = 0.125; // 120 BPM (0.125 сек на 16-ю ноту)

                    // СЕТКА ЧАСТОТ: Ля-минор в высокой 3-й октаве
                    // Паттерн: Ля -> Ля -> До -> Ля -> Ре -> Ля -> Ми -> Ре...
                    const mkThemeScale = [
                        // КВАДРАТ 1: Главная тема в оригинальном высоком регистре
                        880.00, 880.00, 1046.50, 880.00, 1174.66, 880.00, 1318.51, 1174.66, // Ля-Ля-До-Ля-Ре-Ля-Ми-Ре
                        1046.50, 1046.50, 1244.51, 1046.50, 1396.91, 1046.50, 1567.98, 1396.91, // До-До-Ре#-До-Фа-До-Соль-Фа
                        1174.66, 1174.66, 1396.91, 1174.66, 1567.98, 1174.66, 1760.00, 1567.98, // Ре-Ре-Фа-Ре-Соль-Ре-Ля-Соль
                        1046.50, 1046.50, 1244.51, 1046.50, 987.77,  987.77,  783.99,  880.00,  // До-До-Ре#-До-Си-Си-Соль-Ля

                        // КВАДРАТ 2: Развитие и разгон частот
                        880.00, 880.00, 1046.50, 880.00, 1174.66, 880.00, 1318.51, 1174.66,
                        1046.50, 1046.50, 1244.51, 1046.50, 1396.91, 1046.50, 1567.98, 1396.91,
                        1318.51, 1318.51, 1567.98, 1318.51, 1760.00, 1318.51, 1975.53, 1760.00, // Подъем в Ми-регистр
                        1567.98, 1567.98, 1760.00, 1975.53, 2093.00, 2349.32, 2637.02, 3520.00  // Финальный взрывной взлет вверх!
                    ];

                    // Упругая танцевальная брейкбит-сетка
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

                        // --- 1. СИНТЕЗ КУЛЬТОВОГО СИНТ-РИФФА (РЕЗКИЙ HIGH-PITCH С ДЕТЮНОМ) ---
                        if (noteFreq > 0) {
                            const synthOsc = ctx.createOscillator();
                            const synthOsc2 = ctx.createOscillator();
                            const synthFilter = ctx.createBiquadFilter();
                            const synthGain = ctx.createGain();

                            synthOsc.type = 'square';
                            synthOsc.frequency.setValueAtTime(noteFreq, t);
                            // ИСПРАВЛЕНО: Добавляем +45 центов микро-детюна для эмуляции питча оригинальной записи
                            synthOsc.detune.setValueAtTime(45, t);

                            synthOsc2.type = 'sine';
                            synthOsc2.frequency.setValueAtTime(noteFreq * 2.0, t);
                            synthOsc2.detune.setValueAtTime(45, t);

                            // Полосовой фильтр (Bandpass на 1.9 кГц) делает высокий синт чистым и пробивным
                            synthFilter.type = 'bandpass';
                            synthFilter.frequency.setValueAtTime(1900, t);
                            synthFilter.Q.setValueAtTime(1.8, t);

                            // Хлесткое, собранное стаккато
                            synthGain.gain.setValueAtTime(0.13, t);
                            synthGain.gain.exponentialRampToValueAtTime(0.001, t + stepTime * 0.75);

                            synthOsc.connect(synthFilter);
                            synthOsc2.connect(synthFilter);
                            synthFilter.connect(synthGain);
                            synthGain.connect(ctx.destination);

                            synthOsc.start(t); synthOsc2.start(t);
                            synthOsc.stop(t + stepTime * 0.8); synthOsc2.stop(t + stepTime * 0.8);
                        }

                        // --- 2. ELECTRONIC DANCE KICK ---
                        if (drumTrigger === 1 || drumTrigger === 3 || drumTrigger === 4) {
                            const kickOsc = ctx.createOscillator();
                            const kickGain = ctx.createGain();
                            kickOsc.type = 'triangle';
                            kickOsc.frequency.setValueAtTime(145, t);
                            kickOsc.frequency.exponentialRampToValueAtTime(46, t + 0.08);

                            kickGain.gain.setValueAtTime(0.48, t);
                            kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.13);

                            kickOsc.connect(kickGain); kickGain.connect(ctx.destination);
                            kickOsc.start(t); kickOsc.stop(t + 0.14);
                        }

                        // --- 3. SYNTH-WAVE SNARE ---
                        if (drumTrigger === 2 || drumTrigger === 3 || drumTrigger === 4) {
                            const snareOsc = ctx.createOscillator();
                            const snareGain = ctx.createGain();
                            snareOsc.type = 'triangle';
                            snareOsc.frequency.setValueAtTime(205, t);
                            snareOsc.frequency.linearRampToValueAtTime(105, t + 0.05);

                            snareGain.gain.setValueAtTime(0.33, t);
                            snareGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

                            snareOsc.connect(snareGain); snareGain.connect(ctx.destination);
                            snareOsc.start(t); snareOsc.stop(t + 0.10);

                            const bufSize = Math.floor(ctx.sampleRate * 0.11);
                            const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
                            const data = buf.getChannelData(0);
                            for (let j = 0; j < bufSize; j++) { data[j] = Math.random() * 2 - 1; }
                            const noise = ctx.createBufferSource(); noise.buffer = buf;
                            const filter = ctx.createBiquadFilter();
                            filter.type = 'bandpass'; filter.frequency.setValueAtTime(1250, t);
                            const noiseGain = ctx.createGain();
                            noiseGain.gain.setValueAtTime(0.18, t);
                            noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
                            noise.connect(filter); filter.connect(noiseGain);
                            noiseGain.connect(ctx.destination);
                            noise.start(t); noise.stop(t + 0.13);
                        }

                        // --- 4. ELECTRONIC OPEN HAT ---
                        if (drumTrigger === 4 || i % 2 === 1) {
                            const bufSize = Math.floor(ctx.sampleRate * 0.04);
                            const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
                            const data = buf.getChannelData(0);
                            for (let j = 0; j < bufSize; j++) { data[j] = Math.random() * 2 - 1; }
                            const hatNoise = ctx.createBufferSource(); hatNoise.buffer = buf;
                            const highPass = ctx.createBiquadFilter();
                            highPass.type = 'highpass'; highPass.frequency.setValueAtTime(7000, t);
                            const hatGain = ctx.createGain();
                            hatGain.gain.setValueAtTime(0.07, t);
                            hatGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

                            hatNoise.connect(highPass);
                            highPass.connect(hatGain);
                            hatGain.connect(ctx.destination);

                            hatNoise.start(t); hatNoise.stop(t + 0.04);
                        }
                    }


                } else if (mode === 'blade') {
                    // 4. ПРЕСЕТ: Звон клинков (Высокочастотный металлический лязг)
                    const osc = ctx.createOscillator();
                    const gainNode = ctx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(2400, now);
                    osc.frequency.linearRampToValueAtTime(1800, now + 0.05);
                    gainNode.gain.setValueAtTime(0.18, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                    const filter = ctx.createBiquadFilter();
                    filter.type = 'bandpass'; filter.frequency.value = 2000;
                    osc.connect(filter); filter.connect(gainNode);
                    gainNode.connect(ctx.destination);
                    osc.start(now); osc.stop(now + 0.35);

                } else if (mode === 'anvil') {
                    // 5. ПРЕСЕТ: Удар по наковальне (Тяжелый щелчок + яркий шлейф)
                    const osc = ctx.createOscillator();
                    const gainNode = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(620, now);
                    gainNode.gain.setValueAtTime(0.4, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                    osc.connect(gainNode); gainNode.connect(ctx.destination);
                    osc.start(now); osc.stop(now + 0.5);

                } else {
                    // Дефолтный Гонг
                    const osc = ctx.createOscillator(); const subOsc = ctx.createOscillator();
                    const gainNode = ctx.createGain(); const subGain = ctx.createGain();
                    osc.type = 'triangle'; osc.frequency.setValueAtTime(90, now);
                    osc.frequency.exponentialRampToValueAtTime(45, now + 1.2);
                    gainNode.gain.setValueAtTime(0.35, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
                    subOsc.type = 'sine'; subOsc.frequency.setValueAtTime(180, now);
                    subGain.gain.setValueAtTime(0.08, now);
                    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
                    osc.connect(gainNode); subOsc.connect(subGain);
                    gainNode.connect(ctx.destination); subGain.connect(ctx.destination);
                    osc.start(now); subOsc.start(now);
                    osc.stop(now + 1.4); subOsc.stop(now + 1.4);
                }
            }
        } catch (audioError) { console.warn("Аудио-движок заблокирован до клика:", audioError); }

        setTimeout(() => { if (flashOverlay.parentNode) flashOverlay.remove(); }, 600);
    },


    toggleNat20(id) {
        const unit = this.state.combatants.find(c => c.id === id);
        if (unit) {
            unit.isNat20 = !unit.isNat20;
            unit.isNat1 = false;
            if (unit.isNat20) unit.score = 20;
            this._sortAndSave();
        }
    },

    toggleNat1(id) {
        const unit = this.state.combatants.find(c => c.id === id);
        if (unit) {
            unit.isNat1 = !unit.isNat1;
            unit.isNat20 = false;
            if (unit.isNat1) unit.score = 1;
            this._sortAndSave();
        }
    },

    updateScore(id, newScore) {
        const val = parseInt(newScore, 10);
        if (isNaN(val) || val < 1 || val > 100) return;

        const unit = this.state.combatants.find(c => c.id === id);
        if (unit) {
            unit.score = val;
            if (val !== 20) unit.isNat20 = false;
            if (val !== 1) unit.isNat1 = false;
            this._sortAndSave();
        }
    },

    updateFaction(id, newFaction) {
        const unit = this.state.combatants.find(c => c.id === id);
        if (unit) {
            unit.faction = newFaction;
            this._saveWithoutSort();
        }
    },

    removeCombatant(id) {
        this.state.combatants = this.state.combatants.filter(c => c.id !== id);
        if (this.state.selectedUnitId === id) {
            this.state.selectedUnitId = this.state.combatants.length > 0 ? this.state.combatants.id : null;
        }
        this._saveWithoutSort();
    },

    resetRound() {
        if (this.state.round === 1) return;
        if (confirm("Сбросить счетчик текущих раундов боя до 1?")) {
            this.state.round = 1;
            this.state.phraseSeed = Math.floor(Math.random() * 1000);
            this._saveWithoutSort();
        }
    },

    clearAll() {
        if (confirm("Полностью очистить боевой трекер инициативы?")) {
            this.state.combatants = [];
            this.state.selectedUnitId = null;
            this.state.round = 1;
            this.state.phraseSeed = 0;
            this._saveWithoutSort();
        }
    },

    toggleSelectUnit(id) {
        this.state.selectedUnitId = (this.state.selectedUnitId === id) ? null : id;
        this.state.phraseSeed = Math.floor(Math.random() * 1000);
        this._saveWithoutSort();
    },

    getEpicPhrases(activeUnit) {
        const activeName = activeUnit ? activeUnit.name : 'Неизвестно';
        const faction = activeUnit ? activeUnit.faction : 'neutral';

        // 🟢 КАТЕГОРИЯ: СОЮЗНИКИ / ИГРОКИ (Фразы 1–35)
        if (faction === 'friend') {
            return [
                `Судьба отряда в надежных руках! Отважный воин <span class="gold-unit-focus-name">🟢 ${activeName} 🟢</span> планирует гениальный ход!`,
                `Время совершать подвиги! Сквозь хаос боя на передовую вырывается <span class="gold-unit-focus-name">⚔️ ${activeName} ⚔️</span>!`,
                `Клинок обнажен, заклинание готово! Герой <span class="gold-unit-focus-name">⚡ ${activeName} ⚡</span> берет инициативу!`,
                `Эпическая битва требует решимости! Бесстрашный боец <span class="gold-unit-focus-name">👑 ${activeName} 👑</span> начинает ход!`,
                `Слышен яростный клич доблести! На острие атаки оказывается легендарный <span class="gold-unit-focus-name">🔥 ${activeName} 🔥</span>!`,
                `Ни шагу назад перед лицом опасности! Защитник <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span> держит оборону!`,
                `Магические потоки сплетаются воедино! Опытный заклинатель <span class="gold-unit-focus-name">✨ ${activeName} ✨</span> шепчет слова силы!`,
                `Каждый шаг приближает победу! Настоящий лидер <span class="gold-unit-focus-name">⚜️ ${activeName} ⚜️</span> координирует удар!`,
                `Сталь звенит, возвещая начало триумфа! Могучий витязь <span class="gold-unit-focus-name">🔱 ${activeName} 🔱</span> готов сокрушить врага!`,
                `Чистый разум и холодный расчет! Тактик <span class="gold-unit-focus-name">🎯 ${activeName} 🎯</span> ищет брешь в чужой защите!`,
                `Древние пророчества сбываются на глазах! Гордый искатель приключений <span class="gold-unit-focus-name">📜 ${activeName} 📜</span> начинает атаку!`,
                `В жилах кипит благородная кровь! Отважное сердце <span class="gold-unit-focus-name">🩸 ${activeName} 🩸</span> ведет вперед!`,
                `Вспышка праведного огня озаряет арену схватки! Герой <span class="gold-unit-focus-name">☀️ ${activeName} ☀️</span> диктует правила!`,
                `Враги трепещут перед этой решимостью! Непоколебимый союзник <span class="gold-unit-focus-name">🦅 ${activeName} 🦅</span> наносит удар!`,
                `Сила духа ломает любые оковы! Неудержимый борец <span class="gold-unit-focus-name">⛓️ ${activeName} ⛓️</span> врывается в гущу событий!`,
                `Каждый взмах оружия дышит величием! Прекрасный боец <span class="gold-unit-focus-name">🏆 ${activeName} 🏆</span> рвется к славе!`,
                `Сквозь стрелы и преграды к верной цели! Меткий стрелок <span class="gold-unit-focus-name">🏹 ${activeName} 🏹</span> спускает тетиву!`,
                `Слава ждет тех, кто не знает страха! Отважный авантюрист <span class="gold-unit-focus-name">🐺 ${activeName} 🐺</span> делает решающий шаг!`,
                `Гром битвы разносится по округе! Великий воитель <span class="gold-unit-focus-name">🔨 ${activeName} 🔨</span> поднимает свой молот!`,
                `Ветры удачи дуют в паруса нашей партии! Гордый лидер <span class="gold-unit-focus-name">🚩 ${activeName} 🚩</span> начинает штурм!`,
                `Каждое действие наполнено отвагой! Неутомимый следопыт <span class="gold-unit-focus-name">🌿 ${activeName} 🌿</span> начинает ход!`,
                `Яростный вихрь возмездия готов сокрушить преграды! Сильный атлет <span class="gold-unit-focus-name">🌪️ ${activeName} 🌪️</span> идет напролом!`,
                `Священный обет зовет к новым свершениям! Гордый паладин <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span> обнажает меч!`,
                `Голос разума звучит громче приказов! Мудрый волшебник <span class="gold-unit-focus-name">🔮 ${activeName} 🔮</span> просчитывает последствия!`,
                `Боги рандома смотрят на это с нервной улыбкой! Игрок <span class="gold-unit-focus-name">🎲 ${activeName} 🎲</span> судорожно ищет кубы!`,
                `Паника в рядах отряда отменяется (но это неточно)! Наш верный <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span> забыл свои заклинания!`,
                `Главная задача — не выкинуть критический провал на урон! Паникующий <span class="gold-unit-focus-name">🏹 ${activeName} 🏹</span> закрывает глаза!`,
                `«У меня есть тактический план, я читал правила!» — уверенно заявляет <span class="gold-unit-focus-name">📜 ${activeName} 📜</span>!`,
                `Когда вся командная стратегия летит в бездну, в бой вступает великий рандом и <span class="gold-unit-focus-name">💥 ${activeName} 💥</span>!`,
                `Пожелаем этим кубикам d20 не споткнуться о край коврика! Наш азартный <span class="gold-unit-focus-name">🎲 ${activeName} 🎲</span> делает бросок!`,
                `Плут уже ворует кошельки у собственной партии... Вся надежда команды — спящий <span class="gold-unit-focus-name">💤 ${activeName} 💤</span>!`,
                `Главное в бою — вовремя вспомнить, где лежат лечебные зелья! Рассеянный <span class="gold-unit-focus-name">🧪 ${activeName} 🧪</span> роется в сумке!`,
                `Бросок на скрытность провален, но бой уже начался! Наш неосторожный <span class="gold-unit-focus-name">👣 ${activeName} 👣</span> привлекает всё внимание!`,
                `«Если я выкину единицу, я ухожу жить в таверну!» — торжественно обещает <span class="gold-unit-focus-name">🍺 ${activeName} 🍺</span>!`,
                `Лист персонажа перечеркан до дыр, но боевой дух силен! Наш отчаянный <span class="gold-unit-focus-name">⚔️ ${activeName} ⚔️</span> начинает ходить!`
            ];
        }
        // 🔴 КАТЕГОРИЯ: ВРАГИ / МОНСТРЫ (Фразы 1–35)
        if (faction === 'enemy') {
            return [
                // Пафосные / Зловещие фразы (Именительный падеж)
                `Тени сгущаются, предвещая скорую гибель! Грозный противник <span class="gold-unit-focus-name">🔴 ${activeName} 🔴</span> натачивает свои клыки!`,
                `Защита нашего отряда трещит по швам! Свирепый монстр <span class="gold-unit-focus-name">💀 ${activeName} 💀</span> выбирает следующую жертву!`,
                `Приготовьтесь к жестокому испытанию стойкости! Яростный палач <span class="gold-unit-focus-name">🩸 ${activeName} 🩸</span> заносит карающий клинок!`,
                `Земля содрогается от поступи первобытного зла! Жуткий исполин <span class="gold-unit-focus-name">⛰️ ${activeName} ⛰️</span> начинает сокрушительный штурм!`,
                `Удар из коварной засады неотвратим! Опасный убийца <span class="gold-unit-focus-name">🗡️ ${activeName} 🗡️</span> бесшумно выходит из невидимости!`,
                `Древнее проклятие Бет-Майри обретает плоть! Безумный чернокнижник <span class="gold-unit-focus-name">🔮 ${activeName} 🔮</span> шепчет слова погибели!`,
                `Ядовитый оскал и леденящий блеск мертвых глаз! Смертоносный хищник <span class="gold-unit-focus-name">🐺 ${activeName} 🐺</span> бросается вперед!`,
                `Сталь и магия Бездны готовы выжечь эту землю! Темный лорд <span class="gold-unit-focus-name">🚩 ${activeName} 🚩</span> диктеут свои условия!`,
                `Никакой пощады и никаких переговоров! Бескомпромиссный крушитель <span class="gold-unit-focus-name">🔨 ${activeName} 🔨</span> рвется крушить черепа!`,
                `Магический вихрь разрушения окутывает поле боя! Вестник апокалипсиса <span class="gold-unit-focus-name">🌪️ ${activeName} 🌪️</span> начинает сокрушать ряды!`,
                `Мрачное предзнаменование зависло над героями! Безжалостный каратель <span class="gold-unit-focus-name">⛓️ ${activeName} ⛓️</span> выходит на идеальную позицию!`,
                `Ужас пронизывает сердца до самого основания! Инфернальный страж <span class="gold-unit-focus-name">👁️ ${activeName} 👁️</span> открывает свои смертоносные очи!`,
                `Жажда крови ведет это отродье сквозь пламя битвы! Дикий берсерк <span class="gold-unit-focus-name">🔥 ${activeName} 🔥</span> размахивает тяжелым топором!`,
                `Каждое движение этого чудовища дышит чистой яростью! Древний кошмар <span class="gold-unit-focus-name">👹 ${activeName} 👹</span> готов разорвать дистанцию!`,
                `Тяжелый доспех осквернен темными рунами упадка! Проклятый рыцарь <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span> начинает безжалостную атаку!`,
                `Свист оперяемых стрел предвещает скорые спас-броски! Меткий засадный стрелок <span class="gold-unit-focus-name">🏹 ${activeName} 🏹</span> берет нас на мушку!`,
                `Голод Бездны невозможно утолить золотом или мольбами! Прожорливая тварь-людоед <span class="gold-unit-focus-name">🔱 ${activeName} 🔱</span> начинает ход!`,
                `Ледяной ветер смерти сковывает движения наших героев! Хладнокровный убийца <span class="gold-unit-focus-name">❄️ ${activeName} ❄️</span> обнажает оружие!`,
                `Смертельный приговор уже вынесен и скреплен кровью! Безжалостный вожак стаи <span class="gold-unit-focus-name">👑 ${activeName} 👑</span> отдает приказ!`,
                `Скрежет когтей по камню заставляет содрогнуться! Скрытный подземный охотник <span class="gold-unit-focus-name">🐾 ${activeName} 🐾</span> готовит прыжок!`,
                `Иллюзия безопасности рассыпается прахом! Коварный гипнотизер <span class="gold-unit-focus-name">🔮 ${activeName} 🔮</span> плетет паутину лжи!`,
                `Жуткое эхо раскатывается по коридорам подземелья! Разъяренный страж гробницы <span class="gold-unit-focus-name">🔱 ${activeName} 🔱</span> идет на таран!`,
                `Тьма забирает свет, не оставляя шанса на спасение! Могущественный предводитель орды <span class="gold-unit-focus-name">🚩 ${activeName} 🚩</span> начинает ход!`,
                `Вся ярость дикой природы ополчилась против нас! Разъяренный лесной монстр <span class="gold-unit-focus-name">🌿 ${activeName} 🌿</span> ломает строй!`,
                // Шуточные фразы RPG-стиля
                `«Кажется, у этого парня класс доспеха под тридцать...» — паникует лекарь. Ход делает непобедимый <span class="gold-unit-focus-name">⛓️ ${activeName} ⛓️</span>!`,
                `Этот монстр явно прочитал бестиарий и знает наши слабые места! Коварный бестия-тактик <span class="gold-unit-focus-name">🎯 ${activeName} 🎯</span> начинает ход!`,
                `Кубики d20 у этой вражины явно заговорены на постоянные двадцатки! Наглый везунчик <span class="gold-unit-focus-name">🎲 ${activeName} 🎲</span> готовится бить!`,
                `«Я же говорил, что проверять тот подозрительный сундук было плохой идеей!» — кричит плут. На нас прет <span class="gold-unit-focus-name">👹 ${activeName} 👹</span>!`,
                `Кто-нибудь из нашей команды сейчас гарантированно отправится на спас-броски от смерти! Свирепый <span class="gold-unit-focus-name">💀 ${activeName} 💀</span> заносит топор!`,
                `У него очков здоровья больше, чем у всей нашей партии вместе взятой! Огромный губчатый босс <span class="gold-unit-focus-name">⛰️ ${activeName} ⛰️</span> идет в атаку!`,
                `«У кого из вас самый низкий показатель пассивного восприятия?» — зловеще намекает ситуация. Нападает скрытный <span class="gold-unit-focus-name">🗡️ ${activeName} 🗡️</span>!`,
                `Этот парень пришел не за диалогом, он пришел за полным вайпом нашей команды! Жестокий <span class="gold-unit-focus-name">💥 ${activeName} 💥</span> тратит ход!`,
                `Лекарь партии уже приготовил свитки воскрешения на случай худшего сценария! Смертоносный враг <span class="gold-unit-focus-name">🔱 ${activeName} 🔱</span> начинает комбо!`,
                `«Его показатель КД слишком высок, мы не пробьем!» — кричит воин в панике. Наглый противник <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span> ухмыляется!`,
                `Бросок на инициативу у этого чудовища идеален, готовьтесь страдать! Коварный монстр <span class="gold-unit-focus-name">⚡ ${activeName} ⚡</span> ходит первым!`
            ];
        }

    },

    getExtraFriendPhrases(activeName) {
        return [
            // Пафосные / Героические фразы (36-56)
            `Сквозь бурю клинков и стрел пробивается доблестный союзник <span class="gold-unit-focus-name">🟢 ${activeName} 🟢</span>!`,
            `Каждый удар этого воина приближает долгожданный триумф! Силен и опасен <span class="gold-unit-focus-name">⚔️ ${activeName} ⚔️</span>!`,
            `Небесный свет озаряет путь нашей команды! Благородный защитник <span class="gold-unit-focus-name">☀️ ${activeName} ☀️</span> начинает маневр!`,
            `Ярость праведного гнева сокрушит любые преграды! Сильный атлет <span class="gold-unit-focus-name">💪 ${activeName} 💪</span> рвется вперед!`,
            `Ни капли сомнения, только чистая воля к победе! Храбрый следопыт <span class="gold-unit-focus-name">🏹 ${activeName} 🏹</span> наготове!`,
            `Искры сыплются от тяжелых шагов по каменным плитам! Наш танк <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span> держит строй!`,
            `Старые клятвы верности зовут к великим свершениям! Благородный паладин <span class="gold-unit-focus-name">⚜️ ${activeName} ⚜️</span> начинает ход!`,
            `Смертоносная сталь поет в руках искусного мастера! Фехтовальщик <span class="gold-unit-focus-name">🗡️ ${activeName} 🗡️</span> выбирает позицию!`,
            `Энергия стихий покорна этому призыву! Величественный маг <span class="gold-unit-focus-name">✨ ${activeName} ✨</span> готов сотворить чудо!`,
            `Тактическое преимущество полностью на нашей стороне, пока в бою <span class="gold-unit-focus-name">🎯 ${activeName} 🎯</span>!`,
            `Гром аплодисментов и крики боевой ярости! Отважное сердце <span class="gold-unit-focus-name">❤️ ${activeName} ❤️</span> бьется в такт войне!`,
            `Ни шагу назад перед превосходящими силами врага! Бесстрашный боец <span class="gold-unit-focus-name">🔱 ${activeName} 🔱</span> наступает!`,
            `Легенды о сегодняшнем дне будут жить в веках! Гордый авантюрист <span class="gold-unit-focus-name">👑 ${activeName} 👑</span> начинает штурм!`,
            `Каждый маневр просчитан до мельчайших деталей! Наш главный стратег <span class="gold-unit-focus-name">📊 ${activeName} 📊</span> ходит!`,
            `Сквозь пламя битвы к бессмертной славе! Отважный соратник <span class="gold-unit-focus-name">🔥 ${activeName} 🔥</span> рвется в бой!`,
            `Знак геральдической лилии сияет на доспехах! На острие атаки оказывается <span class="gold-unit-focus-name">⚜️ ${activeName} ⚜️</span>!`,
            `Священное оружие готово обрушить кару на силы зла! Сильный крушитель <span class="gold-unit-focus-name">🔨 ${activeName} 🔨</span> наготове!`,
            `Никакой паники, строй остается монолитным и крепким! Наш защитник <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span> начинает ход!`,
            `Ветры перемен несут победу нашей доблестной партии! Храбрый боец <span class="gold-unit-focus-name">🌪️ ${activeName} 🌪️</span> наступает!`,
            `Чистый разум ведет клинок сквозь любую защиту! Бесстрашный витязь <span class="gold-unit-focus-name">⚔️ ${activeName} ⚔️</span> ходит!`,
            `Древняя магия крови пробуждается в этот судьбоносный миг! Колдун <span class="gold-unit-focus-name">🔮 ${activeName} 🔮</span> начинает ход!`,
            // Шуточные фразы RPG-стиля
            `«Так, у кого есть свободные ячейки заклинаний третьего уровня?» — паникует <span class="gold-unit-focus-name">🧙 ${activeName} 🧙</span>!`,
            `Бросок кубика на спас-бросок провален, но мы делаем вид, что так и задумывалось! Ходит <span class="gold-unit-focus-name">🎲 ${activeName} 🎲</span>!`,
            `«Если мы выживем, я скуплю всю выпивку в этой локации!» — мечтает <span class="gold-unit-focus-name">🍻 ${activeName} 🍺</span>!`,
            `Молитва великому двадцатиграннику d20 сработала, пришло время тратить очки действия! Ходит <span class="gold-unit-focus-name">⚜️ ${activeName} ⚜️</span>!`,
            `«Мой персонаж просто стоит в глухой обороне и молится!» — заявляет испуганный <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span>!`,
            `Тактика лобовой атаки провалилась, переходим к плану Б — паническому бегу в исполнении <span class="gold-unit-focus-name">🏃 ${activeName} 🏃</span>!`,
            `«Я забыл прибавить свой модификатор атаки к этому броску!» — внезапно вспоминает <span class="gold-unit-focus-name">📜 ${activeName} 📜</span>!`,
            `Эффект неожиданности утерян, зато у нас есть тяжелый двуручный топор и отчаянный <span class="gold-unit-focus-name">🪓 ${activeName} 🪓</span>!`,
            `«Кто-нибудь, разбудите нашего мага, его очередь наступила!» — кричит команда ушам <span class="gold-unit-focus-name">💤 ${activeName} 💤</span>!`,
            `Лист персонажа залит чаем, но боевой задор dnd-партии не сломить! Ход начинает <span class="gold-unit-focus-name">⚔️ ${activeName} ⚔️</span>!`
        ];
    },

    getExtraEnemyPhrases(activeName) {
        return [
            // Пафосные / Нагнетающие фразы (36-56)
            `Жажда разрушения движет этим созданием! Беспощадный <span class="gold-unit-focus-name">🔴 ${activeName} 🔴</span> наступает на позиции!`,
            `Древнее зло не знает усталости и жалости! Свирепый палач <span class="gold-unit-focus-name">💀 ${activeName} 💀</span> начинает свой ход!`,
            `Свист багровой стали рассекает воздух! Смертоносный противник <span class="gold-unit-focus-name">🩸 ${activeName} 🩸</span> рвется вперед!`,
            `Тьма наступает, поглощая остатки надежды! Жуткий монстр <span class="gold-unit-focus-name">👹 ${activeName} 👹</span> готов разорвать строй!`,
            `Доспехи этого чудовища покрыты кровью былых жертв! Проклятый рыцарь <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span> идет на таран!`,
            `Запах гари и мертвой плоти предвещает атаку! Свирепый берсерк <span class="gold-unit-focus-name">🔥 ${activeName} 🔥</span> поднимает топор!`,
            `Никто не спасется от этого яростного натиска! Бескомпромиссный крушитель <span class="gold-unit-focus-name">🔨 ${activeName} 🔨</span> наготове!`,
            `Смертоносное плетение магии упадка готово сорваться с пальцев! Колдун <span class="gold-unit-focus-name">🔮 ${activeName} 🔮</span> шепчет порчу!`,
            `Ужас сковывает движения, заставляя партию паниковать! Инфернальный страж <span class="gold-unit-focus-name">👁️ ${activeName} 👁️</span> ходит!`,
            `Каждое действие врага наполнено первобытной жестокостью! Дикий хищник <span class="gold-unit-focus-name">🐺 ${activeName} 🐺</span> оскалил клыки!`,
            `Стрелы коварного врага уже летят в сторону наших магов! Меткий засадник <span class="gold-unit-focus-name">🏹 ${activeName} 🏹</span> натягивает лук!`,
            `Тяжелый молот готов обрушить всю ярость на наши доспехи! Жестокий тиран <span class="gold-unit-focus-name">🔱 ${activeName} 🔱</span> начинает штурм!`,
            `Возмездие или вечное забвение ждет тех, кто встал на его пути! Грозный вожак <span class="gold-unit-focus-name">👑 ${activeName} 👑</span> атакует!`,
            `Скрежет когтей по металлу разносится во тьме подземелья! Скрытный охотник <span class="gold-unit-focus-name">🐾 ${activeName} 🐾</span> делает шаг!`,
            `Проклятое оружие жаждет новых душ для подпитки! Смертоносный паладин зла <span class="gold-unit-focus-name">🚩 ${activeName} 🚩</span> ходит!`,
            `Ледяное дыхание смерти сковывает волю наших защитников! Безжалостный убийца <span class="gold-unit-focus-name">❄️ ${activeName} ❄️</span> наступает!`,
            `Аура увядания исходит от каждого шага этого существа! Жуткий вестник рока <span class="gold-unit-focus-name">🔮 ${activeName} 🔮</span> начинает ход!`,
            `Иллюзия спасения рассыпается под тяжелыми ударами! Могучий крушитель строя <span class="gold-unit-focus-name">⛰️ ${activeName} ⛰️</span> прет вперед!`,
            `Вражеский авангард прорывает рубежи нашей обороны! Свирепый штурмовик <span class="gold-unit-focus-name">🚩 ${activeName} 🚩</span> начинает маневр!`,
            `Вся злоба диких пустошей сконцентрирована в этом ударе! Опасный воитель орды <span class="gold-unit-focus-name">🔱 ${activeName} 🔱</span> наготове!`,
            `Траектория этой атаки сулит тяжелые ранения! Неудержимый противник <span class="gold-unit-focus-name">⚡ ${activeName} ⚡</span> начинает ход!`,
            // Шуточные фразы RPG-стиля
            `«Этот монстр совершает уже третью атаку за один свой ход, это легально?!» — кричит бард в сторону <span class="gold-unit-focus-name">⚔️ ${activeName} ⚔️</span>!`,
            `Показатель здоровья этого босса не влезает в экран планшета! Огромная губка для урона <span class="gold-unit-focus-name">⛰️ ${activeName} ⛰️</span> делает шаг!`,
            `«Я уверен, у него d20 под столом заряжен только на криты!» — жалуется плут на <span class="gold-unit-focus-name">🎲 ${activeName} 🎲</span>!`,
            `Спас-бросок по КД провален, готовьтесь собирать выбитые зубы! Свирепый <span class="gold-unit-focus-name">🔨 ${activeName} 🔨</span> начинает комбо!`,
            `«Если он сейчас ударит по мне, мой персонаж умрет навсегда!» — бледнеет маг при виде <span class="gold-unit-focus-name">💀 ${activeName} 💀</span>!`,
            `Этот противник явно плевать хотел на наши хваленые классы защиты доспехов! Наглый крушитель <span class="gold-unit-focus-name">💥 ${activeName} 💥</span> бьет!`,
            `«У него иммунитет вообще ко всем моим типам стихийного урона!» — плачет чародей перед <span class="gold-unit-focus-name">✨ ${activeName} ✨</span>!`,
            `Боевой d20 этого монстра выдает двадцатку за двадцаткой, ломая наши щиты! Жестокий везунчик <span class="gold-unit-focus-name">⚡ ${activeName} ⚡</span> ходит!`,
            `«Кто-нибудь, свяжите этого гада дипломатией, иначе нам конец!» — паникует лекарь от <span class="gold-unit-focus-name">👹 ${activeName} 👹</span>!`,
            `Инициатива врага безупречна, готовьтесь принимать урон на первом же раунде! Опасный монстр <span class="gold-unit-focus-name">🎯 ${activeName} 🎯</span> атакует!`
        ];
    },

    getExtraNeutralPhrases(activeName) {
        return [
            // Пафосные / Загадочные фразы (36-56)
            `Новое действующее лицо на арене этой смертоносной схватки! Осторожный странник <span class="gold-unit-focus-name">💛 ${activeName} 💛</span> замер!`,
            `В жилах этого воина кипит ярость, но цели до сих пор туманны! Загадочный наемник <span class="gold-unit-focus-name">⚔️ ${activeName} ⚔️</span> наготове!`,
            `Никто не знает, куда повернет клинок этой непредсказуемой третьей силы! Гордый искатель <span class="gold-unit-focus-name">🔮 ${activeName} 🔮</span> ходит!`,
            `Баланс сил колеблется, готовый рухнуть от любого неловкого маневра! Одинокий волк <span class="gold-unit-focus-name">🐺 ${activeName} 🐺</span> оглядывает поле!`,
            `Каждое решение этого персонажа окутано завесой мистической тайны! Древний хранитель <span class="gold-unit-focus-name">📜 ${activeName} 📜</span> начинает ход!`,
            `Свидетель этой эпической бойни решает, чью сторону занять выгоднее! Суровый страж <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span> начеку!`,
            `Сквозь густую пелену тумана проступает силуэт незваного гостя! Таинственный незнакомец <span class="gold-unit-focus-name">⚡ ${activeName} ⚡</span> делает шаг!`,
            `Суровый закон дикой природы призывает атаковать любого нарушителя покоя! Лесной хищник <span class="gold-unit-focus-name">🌿 ${activeName} 🌿</span> рычит!`,
            `Холодный расчет заставляет эту фигуру выжидать идеальный момент для удара! Охотник за головами <span class="gold-unit-focus-name">🗡️ ${activeName} 🗡️</span> замер!`,
            `Новая грозовая туча рока нависает над позициями обеих фракций! Свободный элементаль <span class="gold-unit-focus-name">🌪️ ${activeName} 🌪️</span> влетает в бой!`,
            `Голос разума призывает прекратить это безумное кровопролитие! Уважаемый дипломат <span class="gold-unit-focus-name">☀️ ${activeName} ☀️</span> просит слова!`,
            `Тяжелый молот правосудия готов опуститься на головы бунтовщиков! Суровый судья <span class="gold-unit-focus-name">🔨 ${activeName} 🔨</span> берет инициативу!`,
            `Скрытые следы ведут в самую глубь непролазной дикой чащи! Осторожный следопыт <span class="gold-unit-focus-name">🐾 ${activeName} 🐾</span> оценивает ситуацию!`,
            `Новая фигура на шахматной доске этой затянувшейся смертоносной сессии! Тайный агент <span class="gold-unit-focus-name">🎯 ${activeName} 🎯</span> ходит!`,
            `Вспышка стихийной магии путает карты обоим противоборствующим лагерям! Дикий маг <span class="gold-unit-focus-name">🔥 ${activeName} 🔥</span> наготове!`,
            `Слово ветерана весит гораздо больше, чем угрозы необстрелянных юнцов! За закаленный боец <span class="gold-unit-focus-name">👑 ${activeName} 👑</span> начинает ход!`,
            `Холодная острая сталь не выбирает фракций, идеалов или ложных союзов! Профессиональный киллер <span class="gold-unit-focus-name">🔱 ${activeName} 🔱</span> замер!`,
            `Каждое движение этого загадочного существа дышит вековой мудростью! Старейшина руин <span class="gold-unit-focus-name">🔱 ${activeName} 🔱</span> начинает ход!`,
            `Невинная жертва обстоятельств или скрытый хитрый кукловод? Подозрительный путник <span class="gold-unit-focus-name">🚩 ${activeName} 🚩</span> делает маневр!`,
            `Знак древней геральдической лилии сияет на старых помятых доспехах! Рыцарь-бродяга <span class="gold-unit-focus-name">⚜️ ${activeName} ⚜️</span> наготове!`,
            `Судьба замерла в точке хрупкого и пугающего равновесия! Осторожный наблюдатель <span class="gold-unit-focus-name">❄️ ${activeName} ❄️</span> начинает ход!`,
            // Шуточные фразы RPG-стиля
            `«Он за нас или пришел украсть наши кошельки с заработанным золотом?» — паникует бард при виде <span class="gold-unit-focus-name">💰 ${activeName} 💰</span>!`,
            `«Я просто мимо проходил, у меня лавка в соседнем селе, не бейте!» — вопит испуганный торговец <span class="gold-unit-focus-name">💰 ${activeName} 💰</span>!`,
            `Местный стражник спросонья вообще пытается сообразить, в кого надо стрелять! Медлительный <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span> тупит!`,
            `Дикий лесной кабанчик случайно выбежал на арену и полностью сломал нам тактику! Ошалевший <span class="gold-unit-focus-name">🐗 ${activeName} 🐗</span> бежит!`,
            `Пока все вокруг бьются не на жизнь, а на смерть, этот парень просто заснул! Меланхоличный <span class="gold-unit-focus-name">💤 ${activeName} 💤</span> спит!`,
            `«Если мы его не тронем, это чучело нас тоже не укусит?» — с надеждой шепчет лекарь про бродячего <span class="gold-unit-focus-name">🐺 ${activeName} 🐺</span>!`,
            `Случайное событие из таблицы встреч сработало в самый неподходящий момент! На поле боя топчется <span class="gold-unit-focus-name">🎲 ${activeName} 🎲</span>!`,
            `«Эй, не бейте меня, я важный квестовый NPC, я сюжетно бессмертный!» — истошно орет испуганный <span class="gold-unit-focus-name">⚜️ ${activeName} ⚜️</span>!`,
            `Этот участник потасовки вообще забыл, зачем пришел, и просто наслаждается хаосом! Рассеянный <span class="gold-unit-focus-name">💥 ${activeName} 💥</span> тратит ход!`,
            `Лекарь партии пытается наложить на него дипломатию, пока воин заносит топор! Непонятливый <span class="gold-unit-focus-name">🔮 ${activeName} 🔮</span> моргает!`,
            `Бросок d20 на дружелюбие этого существа показал средний результат, ждем подвоха! Нерешительный <span class="gold-unit-focus-name">🎲 ${activeName} 🎲</span> думает!`
        ];
    },
    renderUi() {
        const container = document.getElementById('initiativeTabletContainer');
        if (!container) return;

        if (!container.querySelector('.init-header-zone')) {
            container.innerHTML = `
                <div class="initiative-tablet-content" style="width: 100%;">
                    <div class="init-header-zone">
                        <div class="init-master-battle-control-bar">
                            <div class="init-round-counter-badge">
                                РАУНД <span id="initRoundCounterNum">1</span>
                                <button type="button" id="initBtnResetRoundOnly" class="init-btn-reset-round-inline" title="Сбросить раунды до 1">🔄</button>
                            </div>
                            
                            <select id="initSelectAudioPreset" style="background: #090f0b; border: 1px solid #543e0d; color: #ebd291; height: 50px; padding: 4px 10px; font-weight: bold; font-size: 14px; border-radius: 4px; cursor: pointer;">
                                <option value="bell">💎 Звук: Колокольчик</option>
                                <option value="drum">🥁 Звук: Drum&Bass</option>
                                <option value="magic">🔮 Звук: Techno</option>
                                <option value="horn">📯 Звук: Боевой Рог</option>
                                <option value="thunder">⚡ Звук: Combat</option>
                                <option value="none">🔇 Без звука (Только вспышка)</option>
                            </select>

                            <button type="button" id="initBtnToggleView" class="init-btn-view-toggle" title="Сменить стиль отображения">⚔️ Режим: Список / Горизонт</button>
                            <button type="button" class="btn ok" id="initBtnNextTurn" style="flex-grow: 1; height: 50px; font-size: 18px; font-weight: 900; letter-spacing: 1px;">🛡️ СЛЕДУЮЩИЙ ХОД</button>
                        </div>
                        <div class="init-quick-input-bar" style="margin-top: 14px;">
                            <input type="text" id="initInputName" placeholder="Имя персонажа / Название монстра...">
                            <div class="camp-count-controls" style="padding: 2px 8px;">
                                <span class="camp-param-label" style="font-size: 16px; margin-right: 4px;">Иниц:</span>
                                <button type="button" onclick="document.getElementById('initInputScore').value = Math.max(1, parseInt(document.getElementById('initInputScore').value, 10) - 1)">-</button>
                                <input type="text" id="initInputScore" value="10" style="width: 50px; text-align: center; background: #000; border: 1px solid #543e0d; color: #fff; font-weight: bold;">
                                <button type="button" onclick="document.getElementById('initInputScore').value = Math.min(100, parseInt(document.getElementById('initInputScore').value, 10) + 1)">+</button>
                            </div>
                            <label class="init-nat20-checkbox-label" title="Натуральная 20" style="margin-right: 4px !important;"><input type="checkbox" id="initInputNat20"><span>D20</span></label>
                            <label class="init-nat20-checkbox-label" title="Натуральная 1" style="border-color: #823030 !important;"><input type="checkbox" id="initInputNat1"><span style="color: #ff7675 !important;">D1</span></label>
                            <select id="initInputFaction" style="width: 140px; background: #090f0b; border: 1px solid #543e0d; color: #ebd291; padding: 4px;">
                                <option value="friend">🟢 Союзник</option><option value="neutral" selected>💛 Нейтрал</option><option value="enemy">🔴 Враг</option>
                            </select>
                            <button type="button" class="btn ok" id="initBtnAdd" style="padding: 6px 20px; font-size: 14px; min-width: auto; height: 38px;">⚜ Добавить</button>
                        </div>
                    </div>
                    <div id="initiativeCombatantsList" class="init-cards-scroll-list"></div>
                </div>
            `;
            this._isInputsBound = false;
        }

        if (!this._isInputsBound) {
            const nameInp = document.getElementById('initInputName'); const scoreInp = document.getElementById('initInputScore');
            const nat20Inp = document.getElementById('initInputNat20'); const nat1Inp = document.getElementById('initInputNat1');
            const audioSel = document.getElementById('initSelectAudioPreset');

            document.getElementById('initBtnNextTurn').addEventListener('click', () => this.nextTurn());
            document.getElementById('initBtnToggleView').addEventListener('click', () => this.toggleViewMode());
            document.getElementById('initBtnResetRoundOnly').addEventListener('click', (e) => { e.stopPropagation(); this.resetRound(); });

            if (audioSel) {
                audioSel.value = this.state.audioPreset || 'gong';
                audioSel.addEventListener('change', (e) => this.setAudioPreset(e.target.value));
            }

            nat20Inp.addEventListener('change', () => { if (nat20Inp.checked) { scoreInp.value = 20; scoreInp.disabled = true; scoreInp.style.opacity = '0.5'; if (nat1Inp) nat1Inp.checked = false; } else { scoreInp.disabled = false; scoreInp.style.opacity = '1'; } });
            if (nat1Inp) { nat1Inp.addEventListener('change', () => { if (nat1Inp.checked) { scoreInp.value = 1; scoreInp.disabled = true; scoreInp.style.opacity = '0.5'; nat20Inp.checked = false; } else { scoreInp.disabled = false; scoreInp.style.opacity = '1'; } }); }

            document.getElementById('initBtnAdd').addEventListener('click', () => { this.addCombatant(nameInp.value, scoreInp.value, document.getElementById('initInputFaction').value, nat20Inp.checked, nat1Inp ? nat1Inp.checked : false); nameInp.value = ''; nat20Inp.checked = false; if (nat1Inp) nat1Inp.checked = false; scoreInp.disabled = false; scoreInp.style.opacity = '1'; scoreInp.value = '10'; nameInp.focus(); });
            this._isInputsBound = true;
        }
        const listContainer = document.getElementById('initiativeCombatantsList');
        if (!listContainer) return;
        listContainer.innerHTML = '';

        if (this.state.viewMode === 'bg3') {
            listContainer.classList.add('mode-bg3');
            document.getElementById('initBtnToggleView').textContent = '🏹 Режим: Горизонт';
        } else {
            listContainer.classList.remove('mode-bg3');
            document.getElementById('initBtnToggleView').textContent = '📜 Режим: Список';
        }

        const roundNumEl = document.getElementById('initRoundCounterNum');
        if (roundNumEl) roundNumEl.textContent = this.state.round;

        const oldShield = container.querySelector('.init-focus-quote-shield');
        if (oldShield) oldShield.remove();

        if (this.state.combatants.length === 0) {
            listContainer.innerHTML = `<div class="quest-log-empty">Бой не начат. Добавьте участников.</div>`;
            return;
        }

        const activeUnit = this.state.combatants.find(c => c.id === this.state.selectedUnitId) || this.state.combatants[0];
        const activeName = activeUnit ? activeUnit.name : 'Неизвестно';
        const faction = activeUnit ? activeUnit.faction : 'neutral';

        // ЧИСТЫЙ И НЕУБИВАЕМЫЙ МЕТОД ОБЪЕДИНЕНИЯ МАССИВОВ .concat() ВМЕСТО РИСКОВАННОЙ ДЕСТРУКТУРИЗАЦИИ
        let basePhrases = (typeof this.getEpicPhrases === 'function') ? this.getEpicPhrases(activeUnit) : [];
        if (!Array.isArray(basePhrases)) basePhrases = [];

        let phrases = [];
        if (faction === 'friend' && typeof this.getExtraFriendPhrases === 'function') {
            const extra = this.getExtraFriendPhrases(activeName);
            phrases = basePhrases.concat(Array.isArray(extra) ? extra : []);
        } else if (faction === 'enemy' && typeof this.getExtraEnemyPhrases === 'function') {
            const extra = this.getExtraEnemyPhrases(activeName);
            phrases = basePhrases.concat(Array.isArray(extra) ? extra : []);
        } else if (typeof this.getExtraNeutralPhrases === 'function') {
            const extra = this.getExtraNeutralPhrases(activeName);
            phrases = basePhrases.concat(Array.isArray(extra) ? extra : []);
        } else {
            phrases = basePhrases;
        }

        // Жесткая сквозная страховка от пустоты
        if (phrases.length === 0) {
            phrases = [`Судьба замерла в ожидании... Сейчас действует <span class="gold-unit-focus-name">⚜️ ${activeName} ⚜️</span>!`];
        }

        const currentQuoteHTML = phrases[this.state.phraseSeed % phrases.length];


        this.state.combatants.forEach((unit, index) => {
            const card = document.createElement('div');
            const isActive = this.state.selectedUnitId === unit.id;
            card.className = `init-combatant-card faction-${unit.faction}`;
            card.setAttribute('draggable', 'true');
            card.setAttribute('data-id', unit.id);
            if (isActive) card.classList.add('selected-turn-gold');

            let statusIcon = '';
            if (unit.isNat20) statusIcon = '<span class="init-crown-badge">👑</span>';
            if (unit.isNat1) statusIcon = '<span class="init-nat1-skull-badge">💀</span>';

            // НОВОЕ: Отрисовка аватарки (если установлена — выводим Canvas-картинку, иначе — пустой щит с номером)
            let avatarHtml = '';
            if (unit.avatar) {
                avatarHtml = `<div class="init-avatar-shield-circle active"><img src="${unit.avatar}"></div>`;
            } else {
                avatarHtml = `<div class="init-avatar-shield-circle">${index + 1}</div>`;
            }

            card.innerHTML = `
                <div class="init-card-left" style="pointer-events: none;">
                    <div class="init-turn-pointer-arrow ${isActive ? 'visible' : ''}">▶</div>
                    ${avatarHtml}
                    <div class="init-card-name-text">${unit.name}</div>
                    ${statusIcon}
                </div>
                <div class="init-card-right">
                    <!-- НОВОЕ: Инлайн селектор выбора аватарки -->
                    <div class="init-select-wrapper avatar-picker-wrapper" style="margin-right: 4px;">
                        <select class="init-inline-avatar-select" data-id="${unit.id}" style="background: #040905; border: 1px solid #543e0d; color: #dfbc6f; padding: 4px 6px; font-size: 14px; border-radius: 4px; cursor: pointer;">
                            <option value="">👤 Нет фото</option>
                            <option value="raven" ${unit.avatarType === 'raven' ? 'selected' : ''}>🐦Ворона</option>
                            <option value="spider" ${unit.avatarType === 'spider' ? 'selected' : ''}>🕷️Паук</option>
                            <option value="tick" ${unit.avatarType === 'tick' ? 'selected' : ''}>🦟Клещ</option>
                            <option value="wolf" ${unit.avatarType === 'wolf' ? 'selected' : ''}>🐺Волк</option>
                            <option value="boar" ${unit.avatarType === 'boar' ? 'selected' : ''}>🐗Кабан</option>
                            <option value="toad" ${unit.avatarType === 'toad' ? 'selected' : ''}>🐸Жаба</option>
                            <option value="worm" ${unit.avatarType === 'worm' ? 'selected' : ''}>🐛Червь</option>
                            <option value="deer" ${unit.avatarType === 'deer' ? 'selected' : ''}>🦌Олень</option>
                            <option value="tiger" ${unit.avatarType === 'tiger' ? 'selected' : ''}>🐯Тигр</option>
                            <option value="bear" ${unit.avatarType === 'bear' ? 'selected' : ''}>🐻Медведь</option>
                            <option value="goblin" ${unit.avatarType === 'goblin' ? 'selected' : ''}>👺Гоблин</option>
                            <option value="kobold" ${unit.avatarType === 'kobold' ? 'selected' : ''}>🦎Кобольд</option>
                            <option value="cat" ${unit.avatarType === 'cat' ? 'selected' : ''}>🐱Рыжий Кот</option>
                            <option value="rogue" ${unit.avatarType === 'rogue' ? 'selected' : ''}>🗡️Разбойник</option>
                            <option value="bandit_captain" ${unit.avatarType === 'bandit_captain' ? 'selected' : ''}>🏴‍☠️Главарь Бандитов</option>
                            <option value="hunter" ${unit.avatarType === 'hunter' ? 'selected' : ''}>🪵Таежный Охотник</option>
                            <option value="courtesan" ${unit.avatarType === 'courtesan' ? 'selected' : ''}>🌹Трактирная Куртизанка</option>
                            <option value="orc_warrior" ${unit.avatarType === 'orc_warrior' ? 'selected' : ''}>🪓👹 Орк воин</option>
                            <option value="elf" ${unit.avatarType === 'elf' ? 'selected' : ''}>🧝Серебряный Эльф</option>
                            <option value="dwarf" ${unit.avatarType === 'dwarf' ? 'selected' : ''}>🧔Дварф</option>     
                            <option value="dwarf_paladin" ${unit.avatarType === 'dwarf_paladin' ? 'selected' : ''}>☀️🧔 Дварф Паладин</option>
                            <option value="paladin" ${unit.avatarType === 'paladin' ? 'selected' : ''}>🛡️Паладин</option>
                            <option value="archer" ${unit.avatarType === 'archer' ? 'selected' : ''}>🏹Лучник</option>
                            <option value="elf_archer" ${unit.avatarType === 'elf_archer' ? 'selected' : ''}>🏹🧝 Эльфийка-Лучница</option>
                            <option value="wizard" ${unit.avatarType === 'wizard' ? 'selected' : ''}>🔮Маг</option>
                            <option value="wizardess" ${unit.avatarType === 'wizardess' ? 'selected' : ''}>🔮🧝 Волшебница</option>
                            <option value="bard" ${unit.avatarType === 'bard' ? 'selected' : ''}>🎵Бард</option>
                            <option value="priestess" ${unit.avatarType === 'priestess' ? 'selected' : ''}>🕊️Женщина-Прист</option>
                            <option value="battle_priestess" ${unit.avatarType === 'battle_priestess' ? 'selected' : ''}>🔨🧎 Боевая Жрица</option>
                            <option value="halfling" ${unit.avatarType === 'halfling' ? 'selected' : ''}>🍁Полурослица</option>
                            <option value="halfling_male" ${unit.avatarType === 'halfling_male' ? 'selected' : ''}>👺Злой Полурослик</option>
                            <option value="dryad" ${unit.avatarType === 'dryad' ? 'selected' : ''}>🌿Лесная Дриада</option>
                            <option value="warrior_female" ${unit.avatarType === 'warrior_female' ? 'selected' : ''}>⚔️ Воительница</option>
                            <option value="heavy_warrior" ${unit.avatarType === 'heavy_warrior' ? 'selected' : ''}>🛡️Тяжелый Воин</option>
                            <option value="barbarian" ${unit.avatarType === 'barbarian' ? 'selected' : ''}>🪓Варвар</option>
                            <option value="frost_giant" ${unit.avatarType === 'frost_giant' ? 'selected' : ''}>❄️Снежный Великан</option>
                            <option value="farmer" ${unit.avatarType === 'farmer' ? 'selected' : ''}>🌾Фермер</option>
                            <option value="merchant" ${unit.avatarType === 'merchant' ? 'selected' : ''}>💰Торговец</option>
                            <option value="orc" ${unit.avatarType === 'orc' ? 'selected' : ''}>👹Орк</option>
                            <option value="troll" ${unit.avatarType === 'troll' ? 'selected' : ''}>👹Болотный Тролль</option>
                            <option value="dragon" ${unit.avatarType === 'dragon' ? 'selected' : ''}>🐲Древний Дракон</option>
                        </select>
                    </div>

                    <button type="button" class="init-btn-toggle-d20-inline ${unit.isNat20 || unit.isNat1 ? 'active' : ''}">🎲</button>
                    <div class="init-select-wrapper">
                        <select class="init-inline-faction-select" data-id="${unit.id}">
                            <option value="friend" ${unit.faction === 'friend' ? 'selected' : ''}>🟢 Свой</option>
                            <option value="neutral" ${unit.faction === 'neutral' ? 'selected' : ''}>💛 Нейтрал</option>
                            <option value="enemy" ${unit.faction === 'enemy' ? 'selected' : ''}>🔴 Чужой</option>
                        </select>
                    </div>
                    <div class="init-score-massive-block">
                        <input type="number" class="init-inline-score-input" data-id="${unit.id}" value="${unit.score}">
                    </div>
                    <button type="button" class="init-btn-delete-card">×</button>
                </div>
            `;

            // Навешивание стандартных и новых обработчиков событий
            card.addEventListener('click', (e) => {
                if (e.target.tagName !== 'SELECT' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
                    this.toggleSelectUnit(unit.id);
                }
            });

            // НОВОЕ: Слушатель смены выпадающего списка аватарки персонажа
            card.querySelector('.init-inline-avatar-select').addEventListener('change', (e) => {
                this.setCombatantAvatar(unit.id, e.target.value);
            });

            card.querySelector('.init-btn-toggle-d20-inline').addEventListener('click', (e) => { e.stopPropagation(); if (!unit.isNat20 && !unit.isNat1) this.toggleNat20(unit.id); else if (unit.isNat20) this.toggleNat1(unit.id); else { unit.isNat1 = false; this._sortAndSave(); } });

            const scoreInp = card.querySelector('.init-inline-score-input');
            scoreInp.addEventListener('wheel', (e) => { e.preventDefault(); const direction = e.deltaY < 0 ? 1 : -1; const newVal = Math.max(1, Math.min(100, (parseInt(scoreInp.value, 10) || 0) + direction)); this.updateScore(unit.id, newVal); });
            scoreInp.addEventListener('change', (e) => this.updateScore(unit.id, e.target.value));

            card.querySelector('.init-inline-faction-select').addEventListener('change', (e) => { this.updateFaction(unit.id, e.target.value); this._sortAndSave(); });
            card.querySelector('.init-btn-delete-card').addEventListener('click', (e) => { e.stopPropagation(); this.removeCombatant(unit.id); });

            card.addEventListener('dragstart', (e) => { card.classList.add('init-card-dragging'); e.dataTransfer.setData('text/plain', unit.id); });
            card.addEventListener('dragend', () => card.classList.remove('init-card-dragging'));
            card.addEventListener('dragover', (e) => e.preventDefault());
            card.addEventListener('drop', (e) => { e.preventDefault(); const draggedId = e.dataTransfer.getData('text/plain'); const draggedIdx = this.state.combatants.findIndex(c => c.id === draggedId); const targetIdx = this.state.combatants.findIndex(c => c.id === unit.id); if (draggedIdx !== -1 && targetIdx !== -1) { const [draggedItem] = this.state.combatants.splice(draggedIdx, 1); this.state.combatants.splice(targetIdx, 0, draggedItem); this._saveWithoutSort(); } });

            listContainer.appendChild(card);
        });



        const quoteShield = document.createElement('div'); quoteShield.className = 'init-focus-quote-shield';
        quoteShield.innerHTML = `<div class="init-focus-phrase-text">${currentQuoteHTML}</div>`;
        listContainer.parentNode.appendChild(quoteShield);
    },
    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ОРКА НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга в тег img
     */
    generateOrcAvatarDataUrl() {
        const size = 128; // Оптимальный HD-размер для мини-карточек
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. УШИ ОРКА
        ctx.fillStyle = '#1e3d24';
        ctx.beginPath(); ctx.moveTo(35, 60); ctx.lineTo(10, 48); ctx.lineTo(38, 72); ctx.fill(); // Левое
        ctx.beginPath(); ctx.moveTo(93, 60); ctx.lineTo(118, 48); ctx.lineTo(90, 72); ctx.fill(); // Правое

        // 3. ШЕЯ И ГОЛОВА
        ctx.fillStyle = '#22472a';
        ctx.beginPath(); ctx.moveTo(45, 90); ctx.lineTo(30, 128); ctx.lineTo(98, 128); ctx.lineTo(83, 90); ctx.fill(); // Шея

        ctx.fillStyle = '#2d5a37'; // Лицо
        ctx.beginPath();
        ctx.moveTo(40, 55); ctx.lineTo(64, 38); ctx.lineTo(88, 55); ctx.lineTo(90, 85);
        ctx.lineTo(72, 100); ctx.lineTo(56, 100); ctx.lineTo(38, 85); ctx.closePath(); ctx.fill();

        // 4. НАДБРОВНЫЕ ДУГИ И ГЛАЗА
        ctx.fillStyle = '#22472a';
        ctx.beginPath(); ctx.moveTo(42, 58); ctx.lineTo(64, 63); ctx.lineTo(86, 58); ctx.lineTo(84, 52); ctx.lineTo(64, 56); ctx.lineTo(44, 52); ctx.fill();

        ctx.fillStyle = '#e74c3c'; // Красный неон глаз
        ctx.beginPath(); ctx.ellipse(54, 63, 4, 2, Math.PI / 12, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 63, 4, 2, -Math.PI / 12, 0, Math.PI * 2); ctx.fill();

        // 5. БОЕВОЙ ШРАМ
        ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(51, 55); ctx.lineTo(56, 70); ctx.stroke();

        // 6. ПРИПЛЮСНУТЫЙ НОС
        ctx.fillStyle = '#1e3d24';
        ctx.beginPath(); ctx.moveTo(59, 67); ctx.lineTo(69, 67); ctx.lineTo(71, 74); ctx.lineTo(57, 74); ctx.fill();

        // 7. РОТ И КЛЫКИ
        ctx.strokeStyle = '#162b1a'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(50, 84); ctx.quadraticCurveTo(64, 89, 78, 84); ctx.stroke();

        ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#162b1a'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(52, 86); ctx.lineTo(55, 74); ctx.lineTo(59, 87); ctx.closePath(); ctx.fill(); ctx.stroke(); // Левый клык
        ctx.beginPath(); ctx.moveTo(76, 86); ctx.lineTo(73, 74); ctx.lineTo(69, 87); ctx.closePath(); ctx.fill(); ctx.stroke(); // Правый клык

        // 8. ТЕНЕВАЯ ПОЛОВИНА ФЛЭТ-ОБЪЕМА
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath(); ctx.moveTo(64, 38); ctx.lineTo(40, 55); ctx.lineTo(38, 85); ctx.lineTo(56, 100); ctx.lineTo(64, 100); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },


    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ЭЛЬФА НА CANVAS (ВЕРСИЯ 3.0 — КАНOНИЧНЫЙ СЕРЕБРЯНЫЙ ЭЛЬФ)
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateElfAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Прямые серебряные волосы (спадение за плечи)
        ctx.fillStyle = '#dcdde1';
        ctx.beginPath();
        ctx.moveTo(35, 50);
        ctx.lineTo(25, 128);
        ctx.lineTo(103, 128);
        ctx.lineTo(93, 50);
        ctx.closePath(); ctx.fill();

        // 3. АКУРАТНЫЕ ЭЛЬФИЙСКИЕ УШИ (Тонкие, не очень длинные, направлены строго ВВЕРХ-НАЗАД)
        ctx.fillStyle = '#ebd6be'; // Теневой цвет ушей
        ctx.beginPath();
        ctx.moveTo(48, 60);
        ctx.lineTo(34, 32); // Изящный, короткий и аккуратный пик вверх-влево
        ctx.lineTo(46, 70);
        ctx.closePath(); ctx.fill();

        ctx.beginPath();
        ctx.moveTo(80, 60);
        ctx.lineTo(94, 32); // Изящный, короткий и аккуратный пик вверх-вправо
        ctx.lineTo(82, 70);
        ctx.closePath(); ctx.fill();

        // Внутреннее розовое основание ушной раковины
        ctx.fillStyle = '#dfbeab';
        ctx.beginPath(); ctx.moveTo(46, 61); ctx.lineTo(38, 42); ctx.lineTo(44, 68); ctx.fill();
        ctx.beginPath(); ctx.moveTo(82, 61); ctx.lineTo(90, 42); ctx.lineTo(80, 68); ctx.fill();

        // 4. ИЗЯЩНАЯ ШЕЯ (Чистая, без бороды)
        ctx.fillStyle = '#f3dec2';
        ctx.beginPath(); ctx.moveTo(52, 85); ctx.lineTo(48, 128); ctx.lineTo(80, 128); ctx.lineTo(76, 85); ctx.fill();

        ctx.fillStyle = '#1b3a4b'; // Аккуратный воротник мантии
        ctx.beginPath(); ctx.moveTo(42, 128); ctx.lineTo(54, 112); ctx.lineTo(64, 118); ctx.lineTo(74, 112); ctx.lineTo(86, 128); ctx.closePath(); ctx.fill();

        // 5. ЛИЦО (Утонченный овал, гладкая кожа без бороды и усов)
        ctx.fillStyle = '#fff0d9'; // Благородный кремовый тон
        ctx.beginPath();
        ctx.moveTo(46, 50); // Левая скула
        ctx.lineTo(64, 34); // Лоб
        ctx.lineTo(82, 50); // Правая скула
        ctx.lineTo(80, 78); // Правая челюсть
        ctx.lineTo(64, 96); // Заостренный гладкий подбородок
        ctx.lineTo(48, 78); // Левая челюсть
        ctx.closePath(); ctx.fill();

        // ПЕРЕДНИЕ СЕРЕБРЯНЫЕ ПРЯДИ ВОЛОС (Ровное каре, обрамляющее лицо)
        ctx.fillStyle = '#f5f6fa'; // Светлое сияющее серебро
        ctx.beginPath(); ctx.moveTo(46, 34); ctx.quadraticCurveTo(42, 60, 44, 80); ctx.lineTo(49, 78); ctx.quadraticCurveTo(47, 56, 51, 37); ctx.fill();
        ctx.beginPath(); ctx.moveTo(82, 34); ctx.quadraticCurveTo(86, 60, 84, 80); ctx.lineTo(79, 78); ctx.quadraticCurveTo(81, 56, 77, 37); ctx.fill();

        // 6. МИНДАЛЕВИДНЫЕ ГЛАЗА (Магический золотой разрез глаз)
        ctx.fillStyle = '#d4af37';
        ctx.beginPath(); ctx.ellipse(55, 58, 4.5, 1.8, -Math.PI / 14, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(73, 58, 4.5, 1.8, Math.PI / 14, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff'; // Блики зрачков
        ctx.beginPath(); ctx.arc(56, 57.5, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(72, 57.5, 1, 0, Math.PI * 2); ctx.fill();

        // Изящные тонкие ниточки бровей
        ctx.strokeStyle = '#8a6421'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(48, 52); ctx.quadraticCurveTo(54, 51, 59, 54); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(80, 52); ctx.quadraticCurveTo(74, 51, 69, 54); ctx.stroke();

        // 7. СЛУЖЕБНЫЕ ЛИНИИ НОСА И УТОНЧЕННЫЕ РОЗОВЫЕ ГУБЫ
        ctx.strokeStyle = '#e0cbba'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 54); ctx.lineTo(62, 73); ctx.lineTo(66, 73); ctx.stroke();

        ctx.fillStyle = '#e07a7a';
        ctx.beginPath(); ctx.ellipse(64, 83, 4.5, 1.5, 0, 0, Math.PI * 2); ctx.fill();

        // 8. СЕРЕБРЯНАЯ ДИАДЕМА (Тонкий ровный ободок без выступов)
        ctx.strokeStyle = '#dcdde1'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(49, 44); ctx.lineTo(64, 47); ctx.lineTo(79, 44); ctx.stroke();

        // 9. МЯГКАЯ ТЕНЬ FLAT-СТИЛЯ (Для эффекта объема лица)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.beginPath();
        ctx.moveTo(64, 34);
        ctx.lineTo(45, 50); ctx.lineTo(48, 78); ctx.lineTo(64, 96);
        ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },



    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ДВАРФА НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateDwarfAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ДВАРФИЙСКИЙ РОГАТЫЙ ШЛЕМ И СТАЛЬНЫЕ НАПЛЕЧНИКИ
        ctx.fillStyle = '#1e272c'; // Наплечники
        ctx.beginPath(); ctx.moveTo(25, 128); ctx.lineTo(40, 105); ctx.lineTo(88, 105); ctx.lineTo(103, 128); ctx.fill();

        ctx.fillStyle = '#7f8c8d'; // База шлема
        ctx.beginPath();
        ctx.moveTo(38, 48); ctx.lineTo(64, 25); ctx.lineTo(90, 48); ctx.lineTo(86, 62); ctx.lineTo(42, 62);
        ctx.closePath(); ctx.fill();

        // Рога шлема (угловатые, брутальные)
        ctx.fillStyle = '#dcdde1';
        ctx.beginPath(); ctx.moveTo(38, 44); ctx.lineTo(18, 30); ctx.lineTo(34, 52); ctx.fill(); // Левый рог
        ctx.beginPath(); ctx.moveTo(90, 44); ctx.lineTo(110, 30); ctx.lineTo(94, 52); ctx.fill(); // Правый рог

        // 3. ЛИЦО (Широкое, загорелое, суровое)
        ctx.fillStyle = '#d39e82';
        ctx.beginPath();
        ctx.moveTo(42, 60); ctx.lineTo(86, 60); ctx.lineTo(84, 88);
        ctx.lineTo(64, 105); ctx.lineTo(44, 88); ctx.closePath(); ctx.fill();

        // 4. ГУСТЫЕ ДВАРФИЙСКИЕ БРОВИ И МАЛЕНЬКИЕ ГЛАЗА
        ctx.fillStyle = '#d65d11'; // Рыжие брови
        ctx.fillRect(43, 62, 18, 5);
        ctx.fillRect(67, 62, 18, 5);

        ctx.fillStyle = '#2f3542'; // Хитрые темные глаза
        ctx.beginPath(); ctx.arc(52, 72, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 72, 2.5, 0, Math.PI * 2); ctx.fill();

        // 5. ОГРОМНЫЙ КНОПОЧНЫЙ КАРТОФЕЛЬНЫЙ НОС
        ctx.fillStyle = '#c2856a';
        ctx.beginPath(); ctx.arc(64, 76, 7, 0, Math.PI * 2); ctx.fill();

        // 6. КАНOНИЧНАЯ МАССИВНАЯ РЫЖАЯ БОРОДА (Перекрывает всё лицо снизу)
        ctx.fillStyle = '#e67e22'; // Яркий рыжий цвет бороды
        ctx.beginPath();
        ctx.moveTo(42, 80);
        ctx.lineTo(32, 105);
        ctx.lineTo(46, 128);
        ctx.lineTo(82, 128);
        ctx.lineTo(96, 105);
        ctx.lineTo(86, 80);
        ctx.quadraticCurveTo(64, 94, 42, 80); // Вырез под рот и нос
        ctx.closePath(); ctx.fill();

        // Усы (Тяжелые накладные плашки)
        ctx.fillStyle = '#d65d11'; // Более темный рыжий для усов
        ctx.beginPath();
        ctx.moveTo(50, 81); ctx.lineTo(64, 86); ctx.lineTo(78, 81);
        ctx.lineTo(84, 95); ctx.lineTo(64, 91); ctx.lineTo(44, 95);
        ctx.closePath(); ctx.fill();

        // 7. ЖЕЛЕЗНЫЕ КОЛЬЦА-ЗАЖИМЫ НА КОСАХ БОРОДЫ (В самом низу)
        ctx.fillStyle = '#718093'; // Стальной цвет колец
        ctx.fillRect(44, 118, 10, 6);
        ctx.fillRect(74, 118, 10, 6);

        // 8. ТЕНЕВАЯ ПОЛОВИНА FLAT-ОБЪЕМА
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath(); ctx.moveTo(64, 25); ctx.lineTo(18, 30); ctx.lineTo(32, 105); ctx.lineTo(46, 128); ctx.lineTo(64, 128); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ГОБЛИНА НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateGoblinAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ОГРОМНЫЕ ГОБЛИНСКИЕ УШИ (Широкие, направленные в стороны и слегка вниз)
        ctx.fillStyle = '#4c6e35'; // Болотный зеленый (цвет ушей в тени)
        ctx.beginPath(); ctx.moveTo(42, 65); ctx.lineTo(6, 75); ctx.lineTo(44, 90); ctx.fill(); // Левое ухо
        ctx.beginPath(); ctx.moveTo(86, 65); ctx.lineTo(122, 75); ctx.lineTo(84, 90); ctx.fill(); // Правое ухо

        // Внутреннее уродливое розовато-желтое ушное пространство
        ctx.fillStyle = '#9c8d62';
        ctx.beginPath(); ctx.moveTo(40, 68); ctx.lineTo(14, 76); ctx.lineTo(42, 85); ctx.fill();
        ctx.beginPath(); ctx.moveTo(88, 68); ctx.lineTo(114, 76); ctx.lineTo(86, 85); ctx.fill();

        // Серьга-кольцо в левом ухе (фирменный штрих мародера)
        ctx.fillStyle = '#d4af37';
        ctx.beginPath(); ctx.arc(12, 77, 2.5, 0, Math.PI * 2); ctx.fill();

        // 3. ТОНКАЯ ХУДАЯ ШЕЯ
        ctx.fillStyle = '#5c8a47';
        ctx.fillRect(54, 85, 20, 30);

        // Грязные кожаные обноски на плечах
        ctx.fillStyle = '#4a2f13';
        ctx.beginPath(); ctx.moveTo(25, 128); ctx.lineTo(42, 105); ctx.lineTo(86, 105); ctx.lineTo(103, 128); ctx.fill();

        // 4. ЛИЦО (Широкое, с острым подбородком и огромными скулами)
        ctx.fillStyle = '#6ba650'; // Яркая гоблинская кожа
        ctx.beginPath();
        ctx.moveTo(42, 60); ctx.lineTo(86, 60); ctx.lineTo(92, 85);
        ctx.lineTo(64, 105); ctx.lineTo(36, 85); ctx.closePath(); ctx.fill();

        // 5. ГРУБЫЙ РЖАВЫЙ СТАЛЬНОЙ ШЛЕМ (Низко надвинут, закрывает лоб и брови)
        ctx.fillStyle = '#57606f'; // Темный металл
        ctx.beginPath();
        ctx.moveTo(38, 52); ctx.lineTo(64, 22); ctx.lineTo(90, 52);
        ctx.lineTo(88, 62); ctx.lineTo(64, 65); ctx.lineTo(40, 62); // Острый носовой козырек
        ctx.closePath(); ctx.fill();

        // Заклепки и ржавые пятна на шлеме
        ctx.fillStyle = '#3f4754'; ctx.beginPath(); ctx.arc(64, 30, 2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#8c5319'; ctx.fillRect(44, 40, 4, 3); // Пятно ржавчины

        // 6. ХИТРЫЕ СВЕТЯЩИЕСЯ ЖЕЛТЫЕ ГЛАЗА
        ctx.fillStyle = '#f1c40f'; // Неоново-желтый
        ctx.beginPath(); ctx.ellipse(50, 72, 6, 2.5, -Math.PI * 0.08, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(78, 72, 6, 2.5, Math.PI * 0.08, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#000000'; // Хищный вертикальный зрачок щелью
        ctx.fillRect(49, 70, 1.5, 4);
        ctx.fillRect(77, 70, 1.5, 4);

        // 7. ОСТРЫЙ ДЛИННЫЙ НОС КРЮЧКОМ
        ctx.fillStyle = '#5c8a47';
        ctx.beginPath(); ctx.moveTo(60, 70); ctx.lineTo(68, 70); ctx.lineTo(65, 84); ctx.closePath(); ctx.fill();

        // 8. ЗУБАСТАЯ УХМЫЛКА ДО УШЕЙ
        ctx.strokeStyle = '#2c401c'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(44, 90); ctx.quadraticCurveTo(64, 98, 84, 90); ctx.stroke();

        // Мелкие острые желтые гнилые зубы
        ctx.fillStyle = '#fff9db';
        ctx.beginPath(); ctx.moveTo(52, 92); ctx.lineTo(54, 87); ctx.lineTo(56, 92); ctx.fill();
        ctx.beginPath(); ctx.moveTo(60, 93); ctx.lineTo(62, 88); ctx.lineTo(64, 93); ctx.fill();
        ctx.beginPath(); ctx.moveTo(68, 93); ctx.lineTo(70, 88); ctx.lineTo(72, 93); ctx.fill();
        ctx.beginPath(); ctx.moveTo(76, 92); ctx.lineTo(78, 87); ctx.lineTo(80, 92); ctx.fill();

        // 9. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная тень на левую сторону)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath(); ctx.moveTo(64, 22); ctx.lineTo(6, 75); ctx.lineTo(25, 128); ctx.lineTo(64, 128); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ВОЛКА НА CANVAS (ВЕРСИЯ 2.0 — ХИЩНЫЙ ПРОФИЛЬ ВЛЕВО)
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateWolfAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Мощный наклонный загривок (Шерсть дыбом)
        ctx.fillStyle = '#1a202c'; // Ультра-темный мех спины
        ctx.beginPath();
        ctx.moveTo(60, 60);
        ctx.lineTo(128, 90);
        ctx.lineTo(128, 128);
        ctx.lineTo(45, 128);
        ctx.closePath(); ctx.fill();

        // 3. УХО (Прижато назад-вверх в агрессивном оскале)
        ctx.fillStyle = '#2d3748'; // Внешний мех уха
        ctx.beginPath();
        ctx.moveTo(75, 45);
        ctx.lineTo(98, 20); // Острый кончик уха, уходящий назад-вверх
        ctx.lineTo(88, 55);
        ctx.closePath(); ctx.fill();

        ctx.fillStyle = '#101419'; // Внутренняя тень ушной раковины
        ctx.beginPath();
        ctx.moveTo(78, 43); ctx.lineTo(94, 24); ctx.lineTo(86, 50);
        ctx.closePath(); ctx.fill();

        // 4. МОРДА В ПРОФИЛЬ (Клиновидный вытянутый силуэт влево)
        ctx.fillStyle = '#4a5568'; // Базовый стальной серый мех головы
        ctx.beginPath();
        ctx.moveTo(85, 50);   // Затылок
        ctx.lineTo(65, 42);   // Лоб
        ctx.lineTo(20, 72);   // Кончик носа (вытянут далеко влево)
        ctx.lineTo(26, 84);   // Верхняя губа
        ctx.lineTo(55, 94);   // Нижняя челюсть
        ctx.lineTo(88, 85);   // Скула
        ctx.closePath(); ctx.fill();

        // 5. ДЕТАЛИЗАЦИЯ И МОРЩИНЫ ОСКАЛА
        ctx.strokeStyle = '#1a202c'; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
        // Складки на носу от яростного рычания
        ctx.beginPath(); ctx.moveTo(35, 66); ctx.lineTo(38, 72); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(41, 64); ctx.lineTo(44, 70); ctx.stroke();

        // 6. ХИЩНЫЙ РАСКОСЫЙ ГЛАЗ (Янтарный огонь)
        ctx.fillStyle = '#ed8936'; // Огненно-оранжевый
        ctx.beginPath();
        ctx.moveTo(56, 56); ctx.lineTo(68, 52); ctx.lineTo(64, 59);
        ctx.closePath(); ctx.fill();

        ctx.fillStyle = '#000000'; // Злой черный зрачок-точка
        ctx.beginPath(); ctx.arc(61, 55.5, 1.5, 0, Math.PI * 2); ctx.fill();

        // 7. МОЧКА НОСА (Строго на левом кончике профиля)
        ctx.fillStyle = '#1a202c';
        ctx.beginPath();
        ctx.moveTo(20, 72);
        ctx.quadraticCurveTo(17, 75, 21, 78);
        ctx.lineTo(25, 75);
        ctx.closePath(); ctx.fill();

        // 8. ОСКАЛЕННАЯ ПАСТЬ С БЕЛЫМИ КЛЫКАМИ
        ctx.fillStyle = '#101419'; // Темная глубина приоткрытой пасти
        ctx.beginPath();
        ctx.moveTo(26, 78);
        ctx.lineTo(54, 85); // Линия разреза рта
        ctx.lineTo(52, 89);
        ctx.lineTo(32, 84);
        ctx.closePath(); ctx.fill();

        // Белоснежные клыки (Верхний и нижний, рвущие профиль)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.moveTo(29, 78); ctx.lineTo(32, 84); ctx.lineTo(34, 79); ctx.fill(); // Верхний клык
        ctx.beginPath(); ctx.moveTo(33, 84); ctx.lineTo(36, 79); ctx.lineTo(38, 84); ctx.fill(); // Нижний клык

        // 9. СВЕТЛЫЙ ПОДШЕРСТОК И ЩЕКА (Светло-серый flat-акцент для объема)
        ctx.fillStyle = '#718096';
        ctx.beginPath();
        ctx.moveTo(55, 94);
        ctx.lineTo(88, 85);
        ctx.lineTo(75, 68);
        ctx.quadraticCurveTo(55, 78, 55, 94);
        ctx.closePath(); ctx.fill();

        // Теневая маска нижней челюсти
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.beginPath();
        ctx.moveTo(32, 84); ctx.lineTo(52, 89); ctx.lineTo(55, 94); ctx.lineTo(38, 87);
        ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ПАУКА НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateSpiderAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ИЗОГНУТЫЕ ЖЕСТКИЕ ЛАПЫ (Угрожающе обрамляют круг по бокам)
        ctx.strokeStyle = '#1e252b'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'miter';

        // Левые лапы (3 верхних сустава)
        ctx.beginPath(); ctx.moveTo(40, 50); ctx.lineTo(12, 35); ctx.lineTo(10, 70); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(38, 65); ctx.lineTo(8, 60); ctx.lineTo(12, 95); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(42, 80); ctx.lineTo(14, 85); ctx.lineTo(22, 115); ctx.stroke();

        // Правые лапы (3 верхних сустава)
        ctx.strokeStyle = '#2c353d'; // Чуть светлее для flat-контраста
        ctx.beginPath(); ctx.moveTo(88, 50); ctx.lineTo(116, 35); ctx.lineTo(118, 70); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(90, 65); ctx.lineTo(120, 60); ctx.lineTo(116, 95); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(86, 80); ctx.lineTo(114, 85); ctx.lineTo(106, 115); ctx.stroke();

        // 3. ГОЛОВОГРУДЬ И БРЮШКО (Массивные хитиновые сегменты по центру)
        ctx.fillStyle = '#14191f'; // Задний сегмент (брюшко сверху)
        ctx.beginPath(); ctx.ellipse(64, 95, 24, 20, 0, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#212930'; // Передний сегмент (головогрудь)
        ctx.beginPath(); ctx.arc(64, 60, 20, 0, Math.PI * 2); ctx.fill();

        // 4. ГРОЗДЬ ИЗ 8 СВЕТЯЩИХСЯ НЕОНОВЫХ ГЛАЗ (Ядовито-зеленый неон)
        ctx.fillStyle = '#2ecc71';

        // Два главных центральных глаза
        ctx.beginPath(); ctx.arc(59, 54, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(69, 54, 3.5, 0, Math.PI * 2); ctx.fill();

        // Боковые и верхние пары мелких глаз
        ctx.beginPath(); ctx.arc(51, 52, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(77, 52, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(55, 46, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(73, 46, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(60, 43, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(68, 43, 1.5, 0, Math.PI * 2); ctx.fill();

        // 5. ОСТРЫЕ ЯДОВИТЫЕ ЖВАЛА (ХЕЛИЦЕРЫ С КАПЛЯМИ КИСЛОТЫ)
        ctx.fillStyle = '#14191f'; // Основание жвал
        ctx.beginPath(); ctx.moveTo(50, 72); ctx.lineTo(60, 88); ctx.lineTo(54, 88); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(78, 72); ctx.lineTo(68, 88); ctx.lineTo(74, 88); ctx.closePath(); ctx.fill();

        ctx.fillStyle = '#2ecc71'; // Пронзительные ядовитые кончики клыков
        ctx.beginPath(); ctx.moveTo(54, 84); ctx.lineTo(58, 96); ctx.lineTo(60, 84); ctx.fill();
        ctx.beginPath(); ctx.moveTo(74, 84); ctx.lineTo(70, 96); ctx.lineTo(68, 84); ctx.fill();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная тень на всю левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        ctx.beginPath();
        ctx.moveTo(64, 30);
        ctx.lineTo(10, 35);
        ctx.lineTo(25, 128);
        ctx.lineTo(64, 128);
        ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ РАЗБОЙНИКА НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateRogueAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Плечи и кожаный воротник плаща
        ctx.fillStyle = '#1c1612';
        ctx.beginPath(); ctx.moveTo(25, 128); ctx.lineTo(40, 105); ctx.lineTo(88, 105); ctx.lineTo(103, 128); ctx.fill();

        // 3. ЛИЦО (Смуглое, обветренное, с суровой щетиной)
        ctx.fillStyle = '#c48f72'; // Базовая кожа
        ctx.beginPath();
        ctx.moveTo(44, 55); ctx.lineTo(84, 55); ctx.lineTo(86, 85);
        ctx.lineTo(64, 104); ctx.lineTo(42, 85); ctx.closePath(); ctx.fill();

        // Теневая щетина на подбородке (Flat-напыление)
        ctx.fillStyle = 'rgba(40, 30, 20, 0.25)';
        ctx.beginPath(); ctx.moveTo(42, 80); ctx.lineTo(64, 104); ctx.lineTo(86, 80); ctx.lineTo(84, 88); ctx.lineTo(64, 104); ctx.lineTo(44, 88); ctx.fill();

        // 4. КОЖАНАЯ ШАПКА-КАПЮШОН (Затягивает лоб и виски, плотный темно-коричневый материал)
        ctx.fillStyle = '#3e2a1c'; // Темная кожа шапки
        ctx.beginPath();
        ctx.moveTo(40, 52); ctx.lineTo(64, 28); ctx.lineTo(88, 52);
        ctx.lineTo(86, 64); ctx.lineTo(64, 60); ctx.lineTo(42, 64);
        ctx.closePath(); ctx.fill();

        // Отворот/кант кожаной шапки (светлый акцент)
        ctx.fillStyle = '#5c3e26';
        ctx.beginPath(); ctx.moveTo(42, 60); ctx.lineTo(64, 56); ctx.lineTo(86, 60); ctx.lineTo(84, 64); ctx.lineTo(64, 60); ctx.lineTo(44, 64); ctx.fill();

        // 5. ПОБИТЫЙ ЖИЗНЬЮ ВЗГЛЯД (Хитрый правый глаз и черная повязка на левом)
        ctx.fillStyle = '#ffffff'; // Правый глаз
        ctx.beginPath(); ctx.ellipse(74, 72, 4.5, 2, Math.PI / 12, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#4a2f13'; // Зрачок купеческого вора
        ctx.beginPath(); ctx.arc(73, 72, 1.5, 0, Math.PI * 2); ctx.fill();

        // Черная пиратская повязка на левом глазу
        ctx.fillStyle = '#1c1612';
        ctx.beginPath(); ctx.ellipse(54, 72, 6, 5, -Math.PI / 12, 0, Math.PI * 2); ctx.fill(); // Сам патч
        ctx.strokeStyle = '#1c1612'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(38, 66); ctx.lineTo(86, 76); ctx.stroke(); // Ремешок повязки

        // Злой бандитский шрам через повязку и бровь
        ctx.strokeStyle = '#9e3a2b'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(70, 62); ctx.lineTo(76, 78); ctx.stroke();

        // 6. ХИЩНЫЙ НОС С ГОРБИНКОЙ
        ctx.fillStyle = '#af795c';
        ctx.beginPath(); ctx.moveTo(64, 68); ctx.lineTo(69, 78); ctx.lineTo(63, 83); ctx.closePath(); ctx.fill();

        // 7. ЕХИДНАЯ УХМЫЛКА (Линия рта скошена вбок)
        ctx.strokeStyle = '#1c1612'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(52, 90); ctx.quadraticCurveTo(66, 94, 76, 87); ctx.stroke();

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная тень на левую половину лица)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath(); ctx.moveTo(64, 28); ctx.lineTo(40, 52); ctx.lineTo(42, 85); ctx.lineTo(64, 104); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ПАЛАДИНА НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generatePaladinAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Тяжелые стальные наплечники
        ctx.fillStyle = '#57606f';
        ctx.beginPath(); ctx.moveTo(20, 128); ctx.lineTo(35, 95); ctx.lineTo(93, 95); ctx.lineTo(108, 128); ctx.fill();

        // Золотые элементы латного воротника (горжет)
        ctx.fillStyle = '#b89445';
        ctx.beginPath(); ctx.moveTo(42, 100); ctx.lineTo(54, 88); ctx.lineTo(74, 88); ctx.lineTo(86, 100); ctx.closePath(); ctx.fill();

        // 3. ЗОЛОТОЙ ГРЕБЕНЬ ШЛЕМА (Пафосный рыцарский плюс)
        ctx.fillStyle = '#ffd875';
        ctx.beginPath();
        ctx.moveTo(60, 40); ctx.lineTo(64, 15); ctx.lineTo(74, 12); ctx.lineTo(68, 40);
        ctx.closePath(); ctx.fill();

        // 4. СВЕТЛО-СТАЛЬНОЙ РЫЦАРСКИЙ ШЛЕМ (Монолитное глухое забрало ведра)
        ctx.fillStyle = '#dcdde1'; // Базовый металл
        ctx.beginPath();
        ctx.moveTo(42, 45); ctx.lineTo(64, 32); ctx.lineTo(86, 45);
        ctx.lineTo(84, 80); ctx.lineTo(64, 96); ctx.lineTo(44, 80);
        ctx.closePath(); ctx.fill();

        // Центральное ребро жесткости шлема (вертикальная грань)
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(64, 32); ctx.lineTo(64, 96); ctx.stroke();

        // 5. ПРОРЕЗИ ЗАБРАЛА (ТЕМНЫЕ ОКОШКИ) С НЕБЕСНО-ГОЛУБЫМ НЕОНОМ СВЯТОСТИ
        ctx.fillStyle = '#2f3542'; // Фон прорези
        ctx.beginPath(); ctx.ellipse(54, 52, 8, 2.5, -Math.PI / 18, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 52, 8, 2.5, Math.PI / 18, 0, Math.PI * 2); ctx.fill();

        // Неоновые искры святой магии в глазах
        ctx.fillStyle = '#00cef7';
        ctx.beginPath(); ctx.arc(54, 52, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 52, 2, 0, Math.PI * 2); ctx.fill();

        // 6. ДЫХАТЕЛЬНЫЕОТВЕРСТИЯ НА ЗАБРАЛЕ (Перфорация стальными точками)
        ctx.fillStyle = '#2f3542';
        ctx.beginPath(); ctx.arc(52, 70, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(56, 74, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 70, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(72, 74, 1.5, 0, Math.PI * 2); ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Накладываем теневую маску строго на левую половину шлема)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 12);
        ctx.lineTo(64, 32);
        ctx.lineTo(42, 45); ctx.lineTo(44, 80); ctx.lineTo(64, 96);
        ctx.lineTo(64, 128); ctx.lineTo(20, 128); ctx.lineTo(38, 45);
        ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ЛУЧНИКА НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateArcherAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Плечи и кожаный ремень колчана со стрелами
        ctx.fillStyle = '#1c2d22';
        ctx.beginPath(); ctx.moveTo(20, 128); ctx.lineTo(38, 95); ctx.lineTo(90, 95); ctx.lineTo(108, 128); ctx.fill();

        // Перья стрел, торчащие за плечом ГМа (из колчана)
        ctx.fillStyle = '#f1c40f'; // Оперение стрел
        ctx.beginPath(); ctx.moveTo(85, 95); ctx.lineTo(98, 70); ctx.lineTo(92, 70); ctx.fill();
        ctx.beginPath(); ctx.moveTo(90, 95); ctx.lineTo(103, 73); ctx.lineTo(97, 73); ctx.fill();

        // 3. ЛИЦО (Сосредоточенный, прищуренный взгляд охотника)
        ctx.fillStyle = '#dfa685';
        ctx.beginPath();
        ctx.moveTo(44, 58); ctx.lineTo(84, 58); ctx.lineTo(86, 86);
        ctx.lineTo(64, 105); ctx.lineTo(42, 86); ctx.closePath(); ctx.fill();

        // Сфокусированные глаза (Прищур левого глаза)
        ctx.fillStyle = '#ffffff'; // Правый глаз
        ctx.beginPath(); ctx.ellipse(72, 70, 4, 1.5, Math.PI / 16, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#27ae60'; // Бирюзовый зрачок следопыта
        ctx.beginPath(); ctx.arc(72, 70, 1.2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff'; // Левый глаз (сильно прищурен в прицеливании)
        ctx.beginPath(); ctx.ellipse(54, 70, 3.5, 0.8, -Math.PI / 16, 0, Math.PI * 2); ctx.fill();

        // Тонкие, напряженные брови струной
        ctx.strokeStyle = '#4a2f13'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(46, 64); ctx.lineTo(58, 65); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(82, 64); ctx.lineTo(68, 65); ctx.stroke();

        // Тонкий нос и поджатые губы
        ctx.strokeStyle = '#c48565';
        ctx.beginPath(); ctx.moveTo(64, 66); ctx.lineTo(62, 82); ctx.lineTo(66, 82); ctx.stroke();

        // 4. ЗЕЛЕНЫЙ ОХОТНИЧИЙ КАПЮШОН (Глубоко нависает над лицом, создавая тень)
        ctx.fillStyle = '#1b4d22'; // Темно-зеленое сукно капюшона
        ctx.beginPath();
        ctx.moveTo(40, 54); ctx.lineTo(64, 26); ctx.lineTo(88, 54);
        ctx.lineTo(86, 68); ctx.lineTo(64, 62); ctx.lineTo(42, 68);
        ctx.closePath(); ctx.fill();

        ctx.fillStyle = '#0f3315'; // Внутренняя глубокая тень капюшона вокруг лба
        ctx.beginPath(); ctx.moveTo(42, 68); ctx.lineTo(64, 62); ctx.lineTo(86, 68); ctx.lineTo(64, 52); ctx.closePath(); ctx.fill();

        // 5. ДИНАМИЧНЫЙ ИЗЯЩНЫЙ ЛУК СО СТРЕЛОЙ (Перекрывает картинку по диагонали слева направо)
        ctx.strokeStyle = '#b89445'; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; // Деревянное плечо лука
        ctx.beginPath();
        ctx.moveTo(15, 30);
        ctx.quadraticCurveTo(35, 80, 15, 120); // Изогнутый деревянный дуговой контур лука слева
        ctx.stroke();

        // Натянутая тетива (тонкая стальная нить)
        ctx.strokeStyle = '#dcdde1'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(15, 31); ctx.lineTo(44, 76); ctx.lineTo(15, 119); ctx.stroke();

        // Боевая древесная стрела, готовая сорваться (из центра в левый верхний угол)
        ctx.strokeStyle = '#5c3e26'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(44, 76); ctx.lineTo(18, 50); ctx.stroke(); // Древко стрелы
        ctx.fillStyle = '#718093'; // Стальной наконечник стрелы
        ctx.beginPath(); ctx.moveTo(18, 50); ctx.lineTo(14, 46); ctx.lineTo(22, 46); ctx.closePath(); ctx.fill();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная тень на левую половину лица под капюшоном)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath(); ctx.moveTo(64, 26); ctx.lineTo(40, 54); ctx.lineTo(42, 86); ctx.lineTo(64, 105); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ МАГА НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateWizardAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Длинная, клиновидная серебряная борода и воротник мантии
        ctx.fillStyle = '#090d16'; // Мантия
        ctx.beginPath(); ctx.moveTo(20, 128); ctx.lineTo(40, 100); ctx.lineTo(88, 100); ctx.lineTo(103, 128); ctx.fill();

        ctx.fillStyle = '#dcdde1'; // Мудрая длинная борода (спускается вниз)
        ctx.beginPath();
        ctx.moveTo(48, 85); ctx.lineTo(64, 128); ctx.lineTo(80, 85);
        ctx.quadraticCurveTo(64, 95, 48, 85); ctx.fill();

        // 3. ЛИЦО (Мудрое, утонченное, со скрытой улыбкой)
        ctx.fillStyle = '#fbc5a4';
        ctx.beginPath();
        ctx.moveTo(46, 55); ctx.lineTo(82, 55); ctx.lineTo(84, 82);
        ctx.lineTo(64, 100); ctx.lineTo(44, 82); ctx.closePath(); ctx.fill();

        // Тонкие усы, вплетенные в бороду
        ctx.fillStyle = '#b5b8be';
        ctx.beginPath(); ctx.moveTo(50, 82); ctx.lineTo(64, 87); ctx.lineTo(78, 82); ctx.lineTo(64, 94); ctx.closePath(); ctx.fill();

        // 4. СВЕТЯЩИЕСЯ ГЛАЗА ТАЙНОЙ МАГИИ (Пронзительный фиолетово-розовый неон)
        ctx.fillStyle = '#9b59b6';
        ctx.beginPath(); ctx.ellipse(54, 66, 4.5, 1.8, -Math.PI / 16, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 66, 4.5, 1.8, Math.PI / 16, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff'; // Хрустальные искры силы
        ctx.beginPath(); ctx.arc(54, 66, 1.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 66, 1.2, 0, Math.PI * 2); ctx.fill();

        // 5. ОСТРОКОНЕЧНАЯ ШЛЯПА ЧАРОДЕЯ (Массивная, с большими полями)
        ctx.fillStyle = '#2c2252'; // Базовый цвет шляпы
        ctx.beginPath();
        ctx.moveTo(42, 50);
        ctx.quadraticCurveTo(45, 25, 60, 10); // Изогнутый шпиль шляпы вверх
        ctx.lineTo(72, 10);
        ctx.quadraticCurveTo(80, 25, 86, 50);
        ctx.lineTo(112, 54); // Широкие поля шляпы (правый край)
        ctx.lineTo(64, 48);
        ctx.lineTo(16, 54); // Широкие поля шляпы (левый край)
        ctx.closePath(); ctx.fill();

        // Пряжка на шляпе с золотым руническим камнем
        ctx.fillStyle = '#ffd875';
        ctx.fillRect(59, 45, 10, 5);
        ctx.fillStyle = '#9b59b6';
        ctx.beginPath(); ctx.arc(64, 47.5, 2, 0, Math.PI * 2); ctx.fill();

        // 6. ПАРИРУЮЩАЯ СФЕРА СВЕТА / РУНА (Справа внизу, заливает лицо неоном)
        ctx.fillStyle = 'rgba(155, 89, 182, 0.25)'; // Мягкий внешний ореол магии
        ctx.beginPath(); ctx.arc(88, 96, 16, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#e0b3ff'; // Ядро парящей сферы
        ctx.beginPath(); ctx.arc(88, 96, 7, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(86, 94, 1.5, 0, Math.PI * 2); ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная тень на левую половину мага)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 10); ctx.lineTo(16, 54); ctx.lineTo(25, 128); ctx.lineTo(64, 128);
        ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ БАРДА НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateBardAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Щегольской воротник и длинные ухоженные каштановые волосы
        ctx.fillStyle = '#4a2f13'; // Волосы
        ctx.beginPath(); ctx.moveTo(35, 60); ctx.quadraticCurveTo(20, 95, 26, 128); ctx.lineTo(102, 128); ctx.quadraticCurveTo(108, 95, 93, 60); ctx.fill();

        ctx.fillStyle = '#1e1124'; // Фиолетовый камзол
        ctx.beginPath(); ctx.moveTo(25, 128); ctx.lineTo(44, 102); ctx.lineTo(84, 102); ctx.lineTo(103, 128); ctx.fill();

        // 3. ЛИЦО (Плутовское, с аккуратной эспаньолкой и ухмылкой)
        ctx.fillStyle = '#fbc5a4';
        ctx.beginPath();
        ctx.moveTo(46, 55); ctx.lineTo(82, 55); ctx.lineTo(84, 82);
        ctx.lineTo(64, 102); ctx.lineTo(44, 82); ctx.closePath(); ctx.fill();

        // Элегантные тонкие усы и бородка-испаньолка
        ctx.fillStyle = '#2d1f10';
        ctx.beginPath(); ctx.moveTo(52, 80); ctx.lineTo(64, 84); ctx.lineTo(76, 80); ctx.lineTo(64, 89); ctx.closePath(); ctx.fill(); // Усы
        ctx.beginPath(); ctx.moveTo(58, 94); ctx.lineTo(64, 102); ctx.lineTo(70, 94); ctx.closePath(); ctx.fill(); // Бородка

        // 4. ПЛУТОВСКИЕ ГЛАЗА (Левый подмигивает, правый с хитрым прищуром)
        ctx.fillStyle = '#ffffff'; // Правый открытый глаз
        ctx.beginPath(); ctx.ellipse(72, 66, 4, 1.8, Math.PI / 16, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#10ac84'; // Изумрудный харизматичный зрачок
        ctx.beginPath(); ctx.arc(72, 66, 1.3, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#2d1f10'; ctx.lineWidth = 1.5; ctx.lineCap = 'round'; // Левый зажмуренный подмигивающий глаз
        ctx.beginPath(); ctx.moveTo(48, 67); ctx.quadraticCurveTo(54, 64, 58, 67); ctx.stroke();

        // Тонкие приподнятые брови домиком
        ctx.beginPath(); ctx.moveTo(46, 59); ctx.lineTo(58, 57); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(82, 57); ctx.lineTo(70, 59); ctx.stroke();

        // Изящный нос и плутовская улыбка
        ctx.strokeStyle = '#e2a282'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 54); ctx.lineTo(62, 74); ctx.lineTo(66, 74); ctx.stroke();

        ctx.strokeStyle = '#2d1f10'; ctx.lineWidth = 2; // Улыбка набок
        ctx.beginPath(); ctx.moveTo(54, 88); ctx.quadraticCurveTo(64, 94, 76, 86); ctx.stroke();

        // 5. РОСКОШНАЯ ШЛЯПА МУЗЫКАНТА С ПЕРОМ (Сдвинута франтовато набок)
        ctx.fillStyle = '#8e1c3c'; // Багровое сукно шляпы
        ctx.getTransform(); ctx.save();
        ctx.translate(64, 46); ctx.rotate((Math.PI / 180) * -6); ctx.translate(-64, -46); // Легкий наклон шляпы

        ctx.beginPath();
        ctx.moveTo(36, 48); ctx.lineTo(64, 22); ctx.lineTo(92, 48);
        ctx.lineTo(116, 51); ctx.lineTo(64, 46); ctx.lineTo(12, 51);
        ctx.closePath(); ctx.fill();

        // Большое золотое перо, парящее из тульи шляпы
        ctx.fillStyle = '#fed330';
        ctx.beginPath();
        ctx.moveTo(82, 44); ctx.quadraticCurveTo(98, 20, 112, 8);
        ctx.quadraticCurveTo(102, 28, 86, 45);
        ctx.closePath(); ctx.fill();
        ctx.restore();

        // 6. ДИНАМИЧНЫЙ ГРИФ ЛЮТНИ (Пересекает картинку по диагонали из левого нижнего угла)
        ctx.fillStyle = '#5c3e26'; // Деревянная дека инструмента
        ctx.save();
        ctx.beginPath(); ctx.moveTo(10, 120); ctx.lineTo(44, 86); ctx.lineTo(52, 94); ctx.lineTo(18, 128); ctx.closePath(); ctx.fill();

        // Золотые колки лютни
        ctx.fillStyle = '#ffd875';
        ctx.beginPath(); ctx.arc(42, 88, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(46, 84, 2, 0, Math.PI * 2); ctx.fill();

        // Тонкие натянутые серебряные струны
        ctx.strokeStyle = '#b2bec3'; ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(14, 122); ctx.lineTo(44, 92); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(16, 125); ctx.lineTo(46, 95); ctx.stroke();
        ctx.restore();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная тень на левую половину лица)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 22); ctx.lineTo(12, 51); ctx.lineTo(26, 128); ctx.lineTo(64, 128);
        ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ КОТА НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateCatAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. БОЛЬШИЕ КОШАЧЬИ УШИ (Заостренные треугольники, направленные строго вверх)
        ctx.fillStyle = '#d35400'; // Теневой рыжий мех ушей
        ctx.beginPath(); ctx.moveTo(42, 50); ctx.lineTo(32, 12); ctx.lineTo(58, 42); ctx.fill(); // Левое
        ctx.beginPath(); ctx.moveTo(86, 50); ctx.lineTo(96, 12); ctx.lineTo(70, 42); ctx.fill(); // Правое

        // Внутреннее нежно-розовое пространство ушек
        ctx.fillStyle = '#f5b7b1';
        ctx.beginPath(); ctx.moveTo(43, 46); ctx.lineTo(36, 18); ctx.lineTo(53, 41); ctx.fill();
        ctx.beginPath(); ctx.moveTo(85, 46); ctx.lineTo(92, 18); ctx.lineTo(75, 41); ctx.fill();

        // 3. МОРДОЧКА И ЩЕЧКИ (Округлый пушистый силуэт)
        ctx.fillStyle = '#e67e22'; // Плотный базовый рыжий мех лица
        ctx.beginPath();
        ctx.moveTo(44, 45); ctx.lineTo(84, 45); // Лоб
        ctx.lineTo(98, 76); // Правая пушистая щека
        ctx.lineTo(64, 106); // Подбородок
        ctx.lineTo(30, 76); // Левая пушистая щека
        ctx.closePath(); ctx.fill();

        // 4. ТИГРОВЫЕ ПОЛОСКИ (Культовый окрас рыжих котов)
        ctx.fillStyle = '#d35400'; // Темно-рыжие полосы
        // Полосы на лбу (М-образный узор)
        ctx.fillRect(62, 45, 4, 12);
        ctx.beginPath(); ctx.moveTo(54, 45); ctx.lineTo(58, 54); ctx.lineTo(55, 54); ctx.fill();
        ctx.beginPath(); ctx.moveTo(74, 45); ctx.lineTo(70, 54); ctx.lineTo(73, 54); ctx.fill();
        // Полоски на щеках
        ctx.fillRect(32, 70, 10, 3); ctx.fillRect(34, 76, 8, 3);
        ctx.fillRect(86, 70, 10, 3); ctx.fillRect(86, 76, 8, 3);

        // Белая грудка и подусники (Flat-акцент для объема пасти)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(55, 87, 8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(73, 87, 8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(50, 93); ctx.lineTo(64, 106); ctx.lineTo(78, 93); ctx.closePath(); ctx.fill(); // Белый подбородок

        // 5. ОГРОМНЫЕ ГИПНОТИЧЕСКИЕ ГЛАЗА (Яркий неоново-зеленый цвет)
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath(); ctx.arc(50, 68, 9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(78, 68, 9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#000000'; // Тонкие вертикальные зрачки хищника
        ctx.fillRect(49, 61, 2, 14);
        ctx.fillRect(77, 61, 2, 14);

        ctx.fillStyle = '#ffffff'; // Хрустальные белые блики
        ctx.beginPath(); ctx.arc(53, 65, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 65, 1.8, 0, Math.PI * 2); ctx.fill();

        // 6. РОЗОВЫЙ НОС КНОПКОЙ И ЛИНИЯ РТА
        ctx.fillStyle = '#f5b7b1'; // Маленький розовый носик
        ctx.beginPath(); ctx.moveTo(60, 80); ctx.lineTo(68, 80); ctx.lineTo(64, 85); ctx.closePath(); ctx.fill();

        ctx.strokeStyle = '#2c3e50'; ctx.lineWidth = 1.5; ctx.lineCap = 'round'; // Скромная кошачья улыбка
        ctx.beginPath(); ctx.moveTo(64, 85); ctx.lineTo(64, 91); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(56, 90); ctx.quadraticCurveTo(64, 95, 72, 90); ctx.stroke();

        // 7. ТОНКИЕ БЕЛЫЕ УСЫ (Вибриссы, вылетающие за пределы мордочки)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(48, 88); ctx.lineTo(16, 86); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(48, 91); ctx.lineTo(18, 96); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(80, 88); ctx.lineTo(112, 86); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(80, 91); ctx.lineTo(110, 96); ctx.stroke();

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная тень на левую половину кота)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.beginPath();
        ctx.moveTo(64, 12); ctx.lineTo(32, 12); ctx.lineTo(30, 76); ctx.lineTo(64, 106);
        ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },
    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ОЛЕНЯ НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateDeerAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. МАССИВНЫЕ ВЕТВИСТЫЕ РОГА (Королевская лесная крона на заднем плане)
        ctx.strokeStyle = '#5c4033'; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';

        // Левый рог (Основание и 3 раскидистых ответвления)
        ctx.beginPath();
        ctx.moveTo(56, 38); ctx.lineTo(44, 14); // Главный ствол
        ctx.moveTo(52, 28); ctx.lineTo(32, 22); // Нижний отросток
        ctx.moveTo(48, 20); ctx.lineTo(34, 10); // Верхний отросток
        ctx.stroke();

        // Правый рог (Основание и 3 раскидистых ответвления)
        ctx.strokeStyle = '#705346'; // Чуть светлее для flat-объема
        ctx.beginPath();
        ctx.moveTo(72, 38); ctx.lineTo(84, 14); // Главный ствол
        ctx.moveTo(76, 28); ctx.lineTo(96, 22); // Нижний отросток
        ctx.moveTo(80, 20); ctx.lineTo(94, 10); // Верхний отросток
        ctx.stroke();

        // 3. СТРОЙНАЯ ГОРДАЯ ШЕЯ И УШИ
        ctx.fillStyle = '#8b5a2b'; // Темный каштановый мех шеи
        ctx.beginPath(); ctx.moveTo(48, 80); ctx.lineTo(40, 128); ctx.lineTo(88, 128); ctx.lineTo(80, 80); ctx.closePath(); ctx.fill();

        // Большие чуткие уши, расправленные в стороны
        ctx.fillStyle = '#a06d3b';
        ctx.beginPath(); ctx.ellipse(36, 48, 14, 5, -Math.PI / 8, 0, Math.PI * 2); ctx.fill(); // Левое ухо
        ctx.beginPath(); ctx.ellipse(92, 48, 14, 5, Math.PI / 8, 0, Math.PI * 2); ctx.fill(); // Правое ухо
        ctx.fillStyle = '#e8c4c4'; // Розовая сердцевина ушей
        ctx.beginPath(); ctx.ellipse(36, 48, 10, 2.5, -Math.PI / 8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(92, 48, 10, 2.5, Math.PI / 8, 0, Math.PI * 2); ctx.fill();

        // 4. МОРДА И ЛОБНАЯ ЧАСТЬ (Изящный вытянутый клиновидный профиль анфас)
        ctx.fillStyle = '#b8860b'; // Базовый благородный охристо-ореховый тон
        ctx.beginPath();
        ctx.moveTo(52, 40); ctx.lineTo(76, 40); // Лоб
        ctx.lineTo(80, 68); // Правая скула
        ctx.lineTo(69, 96);  // Правый край носа
        ctx.lineTo(59, 96);  // Левый край носа
        ctx.lineTo(48, 68); // Левая скула
        ctx.closePath(); ctx.fill();

        // Белый подшерсток на челюсти (Характерный flat-маркер оленя)
        ctx.fillStyle = '#f5f6fa';
        ctx.beginPath(); ctx.moveTo(58, 96); ctx.lineTo(64, 104); ctx.lineTo(70, 96); ctx.closePath(); ctx.fill();

        // 5. ГЛУБОКИЕ МУДРЫЕ ГЛАЗА (Большие, темные, с точеными ресницами)
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath(); ctx.ellipse(53, 56, 4.5, 2.5, -Math.PI / 12, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 56, 4.5, 2.5, Math.PI / 12, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff'; // Хрустальные блики
        ctx.beginPath(); ctx.arc(54.5, 55, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(73.5, 55, 1, 0, Math.PI * 2); ctx.fill();

        // 6. НЕБОЛЬШАЯ ЧЕРНАЯ МОЧКА НОСА И МЯГКИЕ ГУБЫ
        ctx.fillStyle = '#1e272c';
        ctx.beginPath(); ctx.moveTo(58, 92); ctx.lineTo(70, 92); ctx.lineTo(64, 97); ctx.closePath(); ctx.fill();

        ctx.strokeStyle = '#8b5a2b'; ctx.lineWidth = 1; // Линия рта
        ctx.beginPath(); ctx.moveTo(60, 99); ctx.lineTo(68, 99); ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная тень на левую половину оленя)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.beginPath();
        ctx.moveTo(64, 10); ctx.lineTo(36, 48); ctx.lineTo(40, 128); ctx.lineTo(64, 128);
        ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ КАБАНА НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateBoarAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Массивная шерстяная холка (Грубый загривок вепря)
        ctx.fillStyle = '#2c221e'; // Темно-бурый мех холки
        ctx.beginPath();
        ctx.moveTo(35, 60); ctx.lineTo(15, 128); ctx.lineTo(113, 128); ctx.lineTo(93, 60);
        ctx.closePath(); ctx.fill();

        // Маленькие прижатые уши вепря
        ctx.fillStyle = '#3a2d29';
        ctx.beginPath(); ctx.moveTo(42, 48); ctx.lineTo(32, 34); ctx.lineTo(48, 42); ctx.fill(); // Левое
        ctx.beginPath(); ctx.moveTo(86, 48); ctx.lineTo(96, 34); ctx.lineTo(80, 42); ctx.fill(); // Правое

        // 3. МОРДА СЕКАЧА (Массивная, трапециевидная, расширяющаяся к пятачку)
        ctx.fillStyle = '#4a3b32'; // Базовый земляной цвет кожи
        ctx.beginPath();
        ctx.moveTo(44, 45); ctx.lineTo(84, 45); // Лоб
        ctx.lineTo(92, 75); // Правая брыля
        ctx.lineTo(76, 102); // Правый край пятачка
        ctx.lineTo(52, 102); // Левый край пятачка
        ctx.lineTo(36, 75); // Левая брыля
        ctx.closePath(); ctx.fill();

        // 4. ОГРОМНЫЕ ИЗОГНУТЫЕ БИВНИ (Чистый белый цвет кости, рвущий контур)
        ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#1c1410'; ctx.lineWidth = 1.5;

        // Левый клык (Торчит снизу вверх-наружу)
        ctx.beginPath();
        ctx.moveTo(42, 85); ctx.quadraticCurveTo(24, 82, 28, 62); ctx.quadraticCurveTo(34, 76, 48, 86);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Правый клык
        ctx.beginPath();
        ctx.moveTo(86, 85); ctx.quadraticCurveTo(104, 82, 100, 62); ctx.quadraticCurveTo(94, 76, 80, 86);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // 5. МАЛЕНЬКИЕ НАЛИТЫЕ КРОВЬЮ ГЛАЗА (Яростный багровый неон)
        ctx.fillStyle = '#c0392b';
        ctx.beginPath(); ctx.arc(52, 58, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 58, 2.5, 0, Math.PI * 2); ctx.fill();

        // Грозные складки над бровями
        ctx.strokeStyle = '#2c221e'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(46, 53); ctx.lineTo(58, 55); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(82, 53); ctx.lineTo(70, 55); ctx.stroke();

        // 6. МАССИВНЫЙ ГРЯЗНЫЙ ПЯТАЧОК (Свиной нос-плуг в самом низу)
        ctx.fillStyle = '#30251e';
        ctx.beginPath(); ctx.roundRect(52, 92, 24, 11, 4); ctx.fill();

        // Ноздри (Темные точки)
        ctx.fillStyle = '#100c08';
        ctx.beginPath(); ctx.arc(58, 97.5, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(70, 97.5, 2, 0, Math.PI * 2); ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная тень на левую половину кабана)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 22); ctx.lineTo(15, 128); ctx.lineTo(64, 128);
        ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ МЕДВЕДЯ НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateBearAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Мощный загривок и пушистые уши
        ctx.fillStyle = '#3a271d'; // Темно-бурый мех холки
        ctx.beginPath();
        ctx.moveTo(30, 70); ctx.lineTo(12, 128); ctx.lineTo(116, 128); ctx.lineTo(98, 70);
        ctx.closePath(); ctx.fill();

        // Маленькие полукруглые медвежьи уши
        ctx.fillStyle = '#4a3329';
        ctx.beginPath(); ctx.arc(42, 44, 9, 0, Math.PI * 2); ctx.fill(); // Левое
        ctx.beginPath(); ctx.arc(86, 44, 9, 0, Math.PI * 2); ctx.fill(); // Правое
        ctx.fillStyle = '#2d1f18'; // Внутреннее ухо в тени
        ctx.beginPath(); ctx.arc(42, 45, 5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(86, 45, 5, 0, Math.PI * 2); ctx.fill();

        // 3. МАССИВНАЯ ГОЛОВА (Круглый, тяжелый силуэт)
        ctx.fillStyle = '#5c4033'; // Базовый каштановый мех лица
        ctx.beginPath();
        ctx.moveTo(46, 46); ctx.lineTo(82, 46); // Лоб
        ctx.lineTo(100, 75); // Правая мощная щека
        ctx.lineTo(82, 106); // Правый край челюсти
        ctx.lineTo(46, 106); // Левый край челюсти
        ctx.lineTo(28, 75); // Левая мощная щека
        ctx.closePath(); ctx.fill();

        // 4. СУРОВЫЙ ВЗГЛЯД ОХОТНИКА (Светящиеся янтарно-карие глаза)
        ctx.fillStyle = '#d58012';
        ctx.beginPath(); ctx.arc(50, 62, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(78, 62, 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; // Микро-блики
        ctx.beginPath(); ctx.arc(50.8, 61.2, 0.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(78.8, 61.2, 0.8, 0, Math.PI * 2); ctx.fill();

        // Тяжелые нависшие складки на лбу
        ctx.strokeStyle = '#2d1f18'; ctx.lineWidth = 2; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(44, 55); ctx.lineTo(56, 56); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(84, 55); ctx.lineTo(72, 56); ctx.stroke();

        // 5. КРУПНАЯ ЧЕРНАЯ МОРДОЧКА И НОС (Медвежий плуг)
        ctx.fillStyle = '#3a271d'; // Выступ морды
        ctx.beginPath(); ctx.ellipse(64, 82, 14, 11, 0, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#11161b'; // Массивный черный нос
        ctx.beginPath(); ctx.moveTo(56, 78); ctx.lineTo(72, 78); ctx.lineTo(64, 85); ctx.closePath(); ctx.fill();

        // 6. ОСКАЛЕННАЯ ПАСТЬ И СМЕРТОНОСНЫЕ КЛЫКИ
        ctx.strokeStyle = '#11161b'; ctx.lineWidth = 2; // Линия рта
        ctx.beginPath(); ctx.moveTo(52, 90); ctx.quadraticCurveTo(64, 96, 76, 90); ctx.stroke();

        // Белоснежные клыки (Выходят за контур пасти)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.moveTo(54, 91); ctx.lineTo(57, 98); ctx.lineTo(60, 91); ctx.fill(); // Левый клык
        ctx.beginPath(); ctx.moveTo(74, 91); ctx.lineTo(71, 98); ctx.lineTo(68, 91); ctx.fill(); // Правый клык

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная тень на левую половину медведя)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 22); ctx.lineTo(12, 128); ctx.lineTo(64, 128);
        ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ЭЛЬФИЙКИ-ЛУЧНИЦЫ НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateElfArcherAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Плечи и прямые длинные серебряные волосы
        ctx.fillStyle = '#1c2d22'; // Одежда
        ctx.beginPath(); ctx.moveTo(20, 128); ctx.lineTo(38, 95); ctx.lineTo(90, 95); ctx.lineTo(108, 128); ctx.fill();

        ctx.fillStyle = '#dcdde1'; // Шлейф серебряных волос сзади
        ctx.beginPath(); ctx.moveTo(38, 65); ctx.lineTo(24, 128); ctx.lineTo(104, 128); ctx.lineTo(90, 65); ctx.fill();

        // 3. АКУРАТНЫЕ ЭЛЬФИЙСКИЕ УШИ (Тонкие, направлены строго ВВЕРХ-НАЗАД, не торчат вбок)
        ctx.fillStyle = '#ebd6be';
        ctx.beginPath(); ctx.moveTo(48, 62); ctx.lineTo(34, 34); ctx.lineTo(46, 70); ctx.closePath(); ctx.fill(); // Левое
        ctx.beginPath(); ctx.moveTo(80, 62); ctx.lineTo(94, 34); ctx.lineTo(82, 70); ctx.closePath(); ctx.fill(); // Правое
        ctx.fillStyle = '#dfbeab'; // Внутреннее ушко
        ctx.beginPath(); ctx.moveTo(46, 63); ctx.lineTo(38, 44); ctx.lineTo(44, 68); ctx.fill();
        ctx.beginPath(); ctx.moveTo(82, 63); ctx.lineTo(90, 44); ctx.lineTo(80, 68); ctx.fill();

        // 4. ЛИЦО (Изящный, утонченный овал без бороды с нежной кремовой кожей)
        ctx.fillStyle = '#fff0d9';
        ctx.beginPath();
        ctx.moveTo(46, 50); ctx.lineTo(64, 34); ctx.lineTo(82, 50);
        ctx.lineTo(80, 78); ctx.lineTo(64, 96); ctx.lineTo(48, 78);
        ctx.closePath(); ctx.fill();

        // Передние серебряные пряди каре, обрамляющие изящное лицо
        ctx.fillStyle = '#f5f6fa';
        ctx.beginPath(); ctx.moveTo(46, 34); ctx.quadraticCurveTo(42, 60, 44, 82); ctx.lineTo(49, 80); ctx.quadraticCurveTo(47, 56, 51, 37); ctx.fill();
        ctx.beginPath(); ctx.moveTo(82, 34); ctx.quadraticCurveTo(86, 60, 84, 82); ctx.lineTo(79, 80); ctx.quadraticCurveTo(81, 56, 77, 37); ctx.fill();

        // 5. МИНДАЛЕВИДНЫЕ ЗОЛОТЫЕ ГЛАЗА (Сосредоточенный прищур лазутчика)
        ctx.fillStyle = '#d4af37'; // Золотая радужка
        ctx.beginPath(); ctx.ellipse(55, 58, 4.5, 1.8, -Math.PI / 14, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(73, 58, 4.5, 1.8, Math.PI / 14, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; // Микро-блики
        ctx.beginPath(); ctx.arc(56, 57.5, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(72, 57.5, 1, 0, Math.PI * 2); ctx.fill();

        // Изящный тонкий носик и аккуратные розовые губы
        ctx.strokeStyle = '#e0cbba'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 54); ctx.lineTo(62, 73); ctx.lineTo(66, 73); ctx.stroke();
        ctx.fillStyle = '#e07a7a';
        ctx.beginPath(); ctx.ellipse(64, 83, 4.5, 1.5, 0, 0, Math.PI * 2); ctx.fill();

        // Тонкая серебряная диадема на лбу эльфийки
        ctx.strokeStyle = '#dcdde1'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(49, 44); ctx.lineTo(64, 47); ctx.lineTo(79, 44); ctx.stroke();

        // 6. ИЗУМРУДНЫЙ КАПЮШОН (Откинут назад, виден по бокам шеи)
        ctx.fillStyle = '#1b4d22';
        ctx.beginPath(); ctx.moveTo(35, 90); ctx.lineTo(46, 78); ctx.lineTo(52, 92); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(93, 90); ctx.lineTo(82, 78); ctx.lineTo(76, 92); ctx.closePath(); ctx.fill();

        // 7. ДИНАМИЧНЫЙ ИЗЯЩНЫЙ ЛУК СО СТРЕЛОЙ ПО ДИАГОНАЛИ
        ctx.strokeStyle = '#b89445'; ctx.lineWidth = 3; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(16, 32); ctx.quadraticCurveTo(34, 80, 16, 118); ctx.stroke(); // Плечо лука

        ctx.strokeStyle = '#dcdde1'; ctx.lineWidth = 0.7; // Тонкая тетива
        ctx.beginPath(); ctx.moveTo(16, 33); ctx.lineTo(44, 76); ctx.lineTo(16, 117); ctx.stroke();

        ctx.strokeStyle = '#5c3e26'; ctx.lineWidth = 1.5; // Древко стрелы, целящееся влево-вверх
        ctx.beginPath(); ctx.moveTo(44, 76); ctx.lineTo(18, 52); ctx.stroke();
        ctx.fillStyle = '#718093'; // Наконечник стрелы
        ctx.beginPath(); ctx.moveTo(18, 52); ctx.lineTo(14, 48); ctx.lineTo(22, 48); ctx.closePath(); ctx.fill();

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная тень на левую половину лица)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.beginPath(); ctx.moveTo(64, 34); ctx.lineTo(45, 50); ctx.lineTo(48, 78); ctx.lineTo(64, 96); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ЖРИЦЫ НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generatePriestessAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Плечи и мягкие платиновые локоны волос
        ctx.fillStyle = '#112233'; // Мантия
        ctx.beginPath(); ctx.moveTo(20, 128); ctx.lineTo(38, 102); ctx.lineTo(90, 102); ctx.lineTo(108, 128); ctx.fill();

        ctx.fillStyle = '#eaf2f8'; // Платиновые волосы, спадающие на плечи
        ctx.beginPath(); ctx.moveTo(35, 75); ctx.lineTo(24, 128); ctx.lineTo(104, 128); ctx.lineTo(93, 75); ctx.fill();

        // 3. ЛИЦО (Нежная кремовая кожа, утонченные женственные пропорции)
        ctx.fillStyle = '#fff3e3';
        ctx.beginPath();
        ctx.moveTo(46, 54); ctx.lineTo(64, 38); ctx.lineTo(82, 54);
        ctx.lineTo(80, 82); ctx.lineTo(64, 100); ctx.lineTo(48, 82);
        ctx.closePath(); ctx.fill();

        // Передние пряди волос, аккуратно обрамляющие лицо по бокам
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.moveTo(46, 38); ctx.quadraticCurveTo(42, 65, 45, 84); ctx.lineTo(49, 82); ctx.quadraticCurveTo(47, 62, 50, 42); ctx.fill();
        ctx.beginPath(); ctx.moveTo(82, 38); ctx.quadraticCurveTo(86, 65, 83, 84); ctx.lineTo(79, 82); ctx.quadraticCurveTo(81, 62, 78, 42); ctx.fill();

        // 4. МИРНЫЙ СВЕТЛЫЙ ВЗГЛЯД (Светящийся лазурный неон святости)
        ctx.fillStyle = '#00cef7';
        ctx.beginPath(); ctx.ellipse(54, 64, 4.5, 2, -Math.PI / 16, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 64, 4.5, 2, Math.PI / 16, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; // Блики веры
        ctx.beginPath(); ctx.arc(55, 63.5, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(73, 63.5, 1, 0, Math.PI * 2); ctx.fill();

        // Аккуратные тонкие брови и нежные розовые губы
        ctx.strokeStyle = '#c49a6c'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(48, 58); ctx.lineTo(58, 59); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(80, 58); ctx.lineTo(70, 59); ctx.stroke();
        ctx.fillStyle = '#f19292';
        ctx.beginPath(); ctx.ellipse(64, 84, 4.5, 1.5, 0, 0, Math.PI * 2); ctx.fill();

        // Изящная линия носа
        ctx.strokeStyle = '#ebd2b7'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 60); ctx.lineTo(62, 76); ctx.lineTo(66, 76); ctx.stroke();

        // 5. БЕЛОСНЕЖНЫЙ КАПЮШОН-КАПОР (С золотой геральдической каймой)
        ctx.fillStyle = '#f5f6fa'; // Внешняя сторона капюшона
        ctx.beginPath();
        ctx.moveTo(38, 52); ctx.lineTo(64, 24); ctx.lineTo(90, 52);
        ctx.lineTo(86, 68); ctx.lineTo(64, 61); ctx.lineTo(42, 68);
        ctx.closePath(); ctx.fill();

        ctx.fillStyle = '#dcdde1'; // Внутренняя тень ткани вокруг лба
        ctx.beginPath(); ctx.moveTo(42, 68); ctx.lineTo(64, 61); ctx.lineTo(86, 68); ctx.lineTo(64, 48); ctx.closePath(); ctx.fill();

        // Золотая вышивка-кайма на капюшоне
        ctx.strokeStyle = '#b89445'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(40, 56); ctx.lineTo(64, 28); ctx.lineTo(88, 56); ctx.stroke();

        // 6. СВЯТОЙ ПОЗОЛОЧЕННЫЙ КРЕСТ (Парит по центру внизу, заливая воротник светом)
        ctx.fillStyle = '#ffd875'; ctx.strokeStyle = '#b89445'; ctx.lineWidth = 1;
        // Вертикальная перекладина креста
        ctx.beginPath(); ctx.roundRect(61, 90, 6, 28, 1.5); ctx.fill(); ctx.stroke();
        // Горизонтальная перекладина креста
        ctx.beginPath(); ctx.roundRect(53, 96, 22, 6, 1.5); ctx.fill(); ctx.stroke();

        // Маленький сияющий лазурный самоцвет в центре распятия
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(64, 99, 1.5, 0, Math.PI * 2); ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная тень на левую половину лица)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.beginPath(); ctx.moveTo(64, 24); ctx.lineTo(38, 52); ctx.lineTo(42, 82); ctx.lineTo(64, 100); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ЖЕНЩИНЫ-ХАЛФЛИНГА НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateHalflingAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Пышные каштановые кудрявые волосы
        ctx.fillStyle = '#4a2f13'; // Базовый цвет кудрей
        ctx.beginPath();
        ctx.arc(42, 50, 22, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(86, 50, 22, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(64, 38, 20, 0, Math.PI * 2); ctx.fill();

        // Низ прически
        ctx.fillRect(24, 50, 80, 50);

        // Походный зеленый плащ
        ctx.fillStyle = '#1e3d24';
        ctx.beginPath(); ctx.moveTo(25, 128); ctx.lineTo(44, 105); ctx.lineTo(84, 105); ctx.lineTo(103, 128); ctx.fill();

        // Золотая круглая фибула-застежка плаща
        ctx.fillStyle = '#ffd875'; ctx.strokeStyle = '#b89445'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(64, 112, 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // 3. АККУРАТНЫЕ ПОЛУРОСЛИКОВЫЕ УШКИ (Маленькие, изящные, слегка заострены вбок-вверх)
        ctx.fillStyle = '#e8b89d';
        ctx.beginPath(); ctx.moveTo(42, 64); ctx.lineTo(26, 54); ctx.lineTo(40, 72); ctx.fill(); // Левое
        ctx.beginPath(); ctx.moveTo(86, 64); ctx.lineTo(102, 54); ctx.lineTo(88, 72); ctx.fill(); // Правое

        // 4. ЛИЦО (Миловидное, круглое, с легким flat-напылением веснушек)
        ctx.fillStyle = '#fbc5a4';
        ctx.beginPath();
        ctx.moveTo(46, 54); ctx.lineTo(64, 40); ctx.lineTo(82, 54);
        ctx.lineTo(84, 82); ctx.lineTo(64, 98); ctx.lineTo(44, 82);
        ctx.closePath(); ctx.fill();

        // Задорные передние кудряшки-челка на лбу
        ctx.fillStyle = '#5c3a1a';
        ctx.beginPath(); ctx.arc(48, 44, 8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(80, 44, 8, 0, Math.PI * 2); ctx.fill();

        // 5. БОЛЬШИЕ ХИТРЫЕ ИЗУМРУДНЫЕ ГЛАЗА
        ctx.fillStyle = '#2ecc71'; // Изумрудный огонек ловкача
        ctx.beginPath(); ctx.arc(52, 64, 5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 64, 5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#000000'; // Зрачки
        ctx.beginPath(); ctx.arc(52, 64, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 64, 1.8, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff'; // Искры бликов
        ctx.beginPath(); ctx.arc(54, 62.5, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 62.5, 1, 0, Math.PI * 2); ctx.fill();

        // Аккуратные брови ниточками
        ctx.strokeStyle = '#4a2f13'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(46, 56); ctx.quadraticCurveTo(52, 54, 58, 57); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(82, 56); ctx.quadraticCurveTo(76, 54, 70, 57); ctx.stroke();

        // Легкие flat-веснушки на щеках (симметричные коричневые точки)
        ctx.fillStyle = '#b87c53';
        ctx.fillRect(48, 72, 1.5, 1.5); ctx.fillRect(52, 74, 1.5, 1.5);
        ctx.fillRect(80, 72, 1.5, 1.5); ctx.fillRect(76, 74, 1.5, 1.5);

        // 6. АККУРАТНЫЙ НОС И ВЕСЕЛАЯ УЛЫБКА ДО УШЕЙ
        ctx.strokeStyle = '#d39270';
        ctx.beginPath(); ctx.moveTo(64, 58); ctx.lineTo(62, 74); ctx.lineTo(66, 74); ctx.stroke();

        ctx.strokeStyle = '#4a2f13'; ctx.lineWidth = 1.8; ctx.lineCap = 'round'; // Очаровательная улыбка
        ctx.beginPath(); ctx.moveTo(52, 83); ctx.quadraticCurveTo(64, 91, 76, 83); ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная тень на левую половину лица)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.beginPath(); ctx.moveTo(64, 38); ctx.lineTo(46, 54); ctx.lineTo(44, 82); ctx.lineTo(64, 98); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ МУЖЧИНЫ-ХАЛФЛИНГА НА CANVAS (ВЕРСИЯ 2.0 — ЗЛОЙ НАЕМНИК)
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateHalflingMaleAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Короткий рубленый каштановый ежик (Волосы сильно уменьшены)
        ctx.fillStyle = '#3a2512';
        ctx.beginPath();
        ctx.moveTo(42, 44); ctx.lineTo(64, 34); ctx.lineTo(86, 44);
        ctx.lineTo(84, 55); ctx.lineTo(44, 55);
        ctx.closePath(); ctx.fill();

        // Мрачный кожаный доспех с металлическими заклепками
        ctx.fillStyle = '#1c1c1c'; // Черная поддоспешная рубаха
        ctx.beginPath(); ctx.moveTo(48, 105); ctx.lineTo(64, 122); ctx.lineTo(80, 105); ctx.fill();

        ctx.fillStyle = '#2c221e'; // Кожаный нагрудник
        ctx.beginPath(); ctx.moveTo(25, 128); ctx.lineTo(44, 105); ctx.lineTo(84, 105); ctx.lineTo(103, 128); ctx.fill();

        // Стальные заклепки на броне
        ctx.fillStyle = '#7f8c8d';
        ctx.beginPath(); ctx.arc(48, 114, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(80, 114, 1.5, 0, Math.PI * 2); ctx.fill();

        // 3. ХАРАКТЕРНЫЕ УШКИ ПОЛУРОСЛИКА (Компактные, заостренные вбок)
        ctx.fillStyle = '#d39b7c';
        ctx.beginPath(); ctx.moveTo(43, 66); ctx.lineTo(29, 58); ctx.lineTo(43, 74); ctx.fill(); // Левое
        ctx.beginPath(); ctx.moveTo(85, 66); ctx.lineTo(99, 58); ctx.lineTo(85, 74); ctx.fill(); // Правое

        // 4. ЛИЦО (Обветренное, злое, с резкими flat-тенями)
        ctx.fillStyle = '#e2b391'; // Базовая кожа
        ctx.beginPath();
        ctx.moveTo(46, 54); ctx.lineTo(64, 40); ctx.lineTo(82, 54);
        ctx.lineTo(84, 82); ctx.lineTo(64, 98); ctx.lineTo(44, 82);
        ctx.closePath(); ctx.fill();

        // Небольшие рваные пряди челки на лбу
        ctx.fillStyle = '#4a321a';
        ctx.beginPath(); ctx.moveTo(46, 42); ctx.lineTo(54, 50); ctx.lineTo(60, 44); ctx.lineTo(68, 52); ctx.lineTo(76, 44); ctx.lineTo(82, 50); ctx.lineTo(80, 42); ctx.closePath(); ctx.fill();

        // 5. АГРЕССИВНЫЙ ЗЛОЙ ПРИЩУР (Глаза сужены, наклон внутрь)
        ctx.fillStyle = '#ffffff'; // Белки глаз
        ctx.beginPath(); ctx.ellipse(53, 64, 4.5, 1.2, -Math.PI / 12, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 64, 4.5, 1.2, Math.PI / 12, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#e67e22'; // Злые янтарные зрачки
        ctx.beginPath(); ctx.arc(54, 64, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 64, 1.5, 0, Math.PI * 2); ctx.fill();

        // Тяжелые брови, сурово сведенные к переносице
        ctx.strokeStyle = '#2d1f10'; ctx.lineWidth = 1.8; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(45, 57); ctx.lineTo(57, 62); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(83, 57); ctx.lineTo(71, 62); ctx.stroke();

        // Боевой шрам, проходящий через правый глаз
        ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(70, 52); ctx.lineTo(76, 72); ctx.stroke();

        // 6. ОСТРЫЙ НОС И ЖЕСТКАЯ ЛИНИЯ РТА (Уголки опущены вниз)
        ctx.strokeStyle = '#ca9273'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 58); ctx.lineTo(62, 75); ctx.lineTo(66, 75); ctx.stroke();

        ctx.strokeStyle = '#2d1f10'; ctx.lineWidth = 2.2; // Суровый, злой рот
        ctx.beginPath(); ctx.moveTo(54, 86); ctx.quadraticCurveTo(64, 82, 74, 86); ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная глубокая тень на левую половину лица)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath(); ctx.moveTo(64, 40); ctx.lineTo(46, 54); ctx.lineTo(44, 82); ctx.lineTo(64, 98); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ КОБОЛЬДА НА CANVAS (ВЕРСИЯ 2.0 — ЗЕЛЕНЫЙ ПРОФИЛЬ ВЛЕВО)
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateKoboldAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Острые рожки рептилии (Загнуты назад вдоль черепа)
        ctx.fillStyle = '#1e331c'; // Темный роговой цвет в тени
        ctx.beginPath();
        ctx.moveTo(85, 45);
        ctx.quadraticCurveTo(105, 30, 115, 15); // Верхний рог уходит назад
        ctx.lineTo(100, 48);
        ctx.closePath(); ctx.fill();

        ctx.fillStyle = '#142113'; // Нижний маленький рог
        ctx.beginPath();
        ctx.moveTo(88, 56);
        ctx.quadraticCurveTo(102, 48, 110, 38);
        ctx.lineTo(95, 58);
        ctx.closePath(); ctx.fill();

        // Худая шея кобольда с воротником из грязных шкур
        ctx.fillStyle = '#325232';
        ctx.beginPath(); ctx.moveTo(70, 85); ctx.lineTo(82, 128); ctx.lineTo(46, 128); ctx.lineTo(54, 85); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#3a2618'; // Обноски
        ctx.beginPath(); ctx.moveTo(35, 128); ctx.lineTo(52, 105); ctx.lineTo(92, 105); ctx.lineTo(105, 128); ctx.closePath(); ctx.fill();

        // 3. МОРДА В ПРОФИЛЬ (Вытянутый клиновидный силуэт влево, как у ящерицы)
        ctx.fillStyle = '#3d6e3d'; // Базовая болотная чешуя
        ctx.beginPath();
        ctx.moveTo(88, 52);   // Затылок
        ctx.lineTo(68, 42);   // Лоб
        ctx.lineTo(22, 68);   // Кончик носа / вытянутой морды (влево)
        ctx.lineTo(26, 78);   // Верхняя губа
        ctx.lineTo(58, 88);   // Нижняя челюсть
        ctx.lineTo(86, 78);   // Скула
        ctx.closePath(); ctx.fill();

        // Чешуйчатые гребни/бугорки на затылке для текстуры
        ctx.fillStyle = '#2d542d';
        ctx.beginPath(); ctx.arc(82, 58, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(85, 68, 4, 0, Math.PI * 2); ctx.fill();

        // 4. ХИТРЫЙ ЗМЕИНЫЙ ГЛАЗ (Яркий неоново-желтый огонек)
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.moveTo(58, 54); ctx.lineTo(70, 50); ctx.lineTo(65, 58);
        ctx.closePath(); ctx.fill();

        ctx.fillStyle = '#000000'; // Тонкий вертикальный зрачок щелью
        ctx.fillRect(62, 51, 1.2, 5);

        // Нависшая хмурая надбровная дуга
        ctx.strokeStyle = '#1e3c1e'; ctx.lineWidth = 1.8; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(56, 50); ctx.lineTo(68, 48); ctx.stroke();

        // 5. ПРИОТКРЫТАЯ ЗУБАСТАЯ ПАСТЬ С ИГЛАМИ КЛЫКОВ
        ctx.fillStyle = '#142113'; // Темная глубина пасти в разрезе профиля
        ctx.beginPath();
        ctx.moveTo(26, 74);
        ctx.lineTo(54, 80); // Линия рта
        ctx.lineTo(50, 84);
        ctx.lineTo(32, 80);
        ctx.closePath(); ctx.fill();

        // Мелкие острые зубы-иглы (перекрывают разрез рта)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.moveTo(29, 74); ctx.lineTo(32, 79); ctx.lineTo(34, 75); ctx.fill(); // Верхний передний
        ctx.beginPath(); ctx.moveTo(38, 75); ctx.lineTo(40, 80); ctx.lineTo(43, 76); ctx.fill(); // Верхний средний
        ctx.beginPath(); ctx.moveTo(33, 81); ctx.lineTo(36, 77); ctx.lineTo(38, 81); ctx.fill(); // Нижний клык

        // 6. СВЕТЛАЯ НИЖНЯЯ ЧЕЛЮСТЬ (Рептилоидный flat-акцент для объема)
        ctx.fillStyle = '#528a52';
        ctx.beginPath();
        ctx.moveTo(58, 88);
        ctx.lineTo(86, 78);
        ctx.lineTo(72, 64);
        ctx.quadraticCurveTo(55, 74, 58, 88);
        ctx.closePath(); ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная маска тени на левую половину токена)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.beginPath(); ctx.moveTo(64, 22); ctx.lineTo(22, 68); ctx.lineTo(46, 128); ctx.lineTo(64, 128); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ТИГРА НА CANVAS (СВИРЕПЫЙ АНФАС)
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateTigerAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Округлые пушистые уши тигра
        ctx.fillStyle = '#11161b'; // Тыльная сторона ушей (черная с белым пятном по канону)
        ctx.beginPath(); ctx.arc(40, 46, 10, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(88, 46, 10, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; // Белые сигнальные маркеры на ушах
        ctx.beginPath(); ctx.arc(40, 46, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(88, 46, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f5b7b1'; // Внутренний розовый пушок
        ctx.beginPath(); ctx.arc(42, 48, 5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(86, 48, 5, 0, Math.PI * 2); ctx.fill();

        // 3. МОРДА ТИГРА (Мощный, круглый кошачий силуэт)
        ctx.fillStyle = '#e67e22'; // Сочный базовый рыжий мех
        ctx.beginPath();
        ctx.moveTo(44, 45); ctx.lineTo(84, 45); // Лоб
        ctx.lineTo(102, 76); // Правая мощная щека
        ctx.lineTo(64, 108); // Подбородок
        ctx.lineTo(26, 76); // Левая мощная щека
        ctx.closePath(); ctx.fill();

        // 4. МАССИВНЫЕ БЕЛЫЕ БАКЕНБАРДЫ И ПОДУСНИКИ (Симметричный flat-объем)
        ctx.fillStyle = '#f5f6fa';
        // Левая бакенбарда
        ctx.beginPath(); ctx.moveTo(26, 76); ctx.lineTo(40, 92); ctx.lineTo(34, 60); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(32, 84); ctx.lineTo(22, 102); ctx.lineTo(44, 94); ctx.fill();
        // Правая бакенбарда
        ctx.beginPath(); ctx.moveTo(102, 76); ctx.lineTo(88, 92); ctx.lineTo(94, 60); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(96, 84); ctx.lineTo(106, 102); ctx.lineTo(84, 94); ctx.fill();

        // Белые зоны вокруг глаз («очки» тигра)
        ctx.beginPath(); ctx.ellipse(50, 64, 10, 6, -Math.PI / 12, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(78, 64, 10, 6, Math.PI / 12, 0, Math.PI * 2); ctx.fill();

        // Белые подусники пасти
        ctx.beginPath(); ctx.arc(55, 87, 8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(73, 87, 8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(52, 93); ctx.lineTo(64, 106); ctx.lineTo(76, 93); ctx.closePath(); ctx.fill(); // Подбородок

        // 5. КАНOНИЧНЫЕ ЧЕРНЫЕ ПОЛОСЫ (Симметричные ломаные клинья)
        ctx.fillStyle = '#11161b';
        // Полосы на лбу (Симметричный узор)
        ctx.fillRect(62, 45, 4, 12); // Центральная
        ctx.beginPath(); ctx.moveTo(50, 45); ctx.lineTo(56, 54); ctx.lineTo(53, 54); ctx.fill();
        ctx.beginPath(); ctx.moveTo(78, 45); ctx.lineTo(72, 54); ctx.lineTo(75, 54); ctx.fill();
        // Полосы на щеках (Идут снаружи к центру)
        ctx.beginPath(); ctx.moveTo(28, 72); ctx.lineTo(42, 75); ctx.lineTo(30, 78); ctx.fill();
        ctx.beginPath(); ctx.moveTo(100, 72); ctx.lineTo(86, 75); ctx.lineTo(98, 78); ctx.fill();

        // 6. ОГРОМНЫЕ СВЕТЯЩИЕСЯ ЯНТАРНЫЕ ГЛАЗА (Взгляд в упор)
        ctx.fillStyle = '#f1c40f'; // Неоново-желтый
        ctx.beginPath(); ctx.arc(50, 66, 7.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(78, 66, 7.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#000000'; // Хищные круглые кошачьи зрачки
        ctx.beginPath(); ctx.arc(50, 66, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(78, 66, 2.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff'; // Кристальные белые блики
        ctx.beginPath(); ctx.arc(52, 64, 1.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 64, 1.2, 0, Math.PI * 2); ctx.fill();

        // Суровые надбровные складки
        ctx.strokeStyle = '#11161b'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(40, 56); ctx.lineTo(56, 59); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(88, 56); ctx.lineTo(72, 59); ctx.stroke();

        // 7. РОЗОВЫЙ НОС И ПРИОТКРЫТАЯ ОСКАЛЕННАЯ ПАСТЬ С КЛЫКАМИ
        ctx.fillStyle = '#f5b7b1'; // Розовый нос трапецией
        ctx.beginPath(); ctx.moveTo(59, 78); ctx.lineTo(69, 78); ctx.lineTo(64, 84); ctx.closePath(); ctx.fill();

        ctx.strokeStyle = '#11161b'; ctx.lineWidth = 1.8; // Линия замыкания пасти
        ctx.beginPath(); ctx.moveTo(64, 84); ctx.lineTo(64, 90); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(54, 89); ctx.quadraticCurveTo(64, 94, 74, 89); ctx.stroke();

        // Белоснежные острые клыки, торчащие вниз из верхней челюсти
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.moveTo(54, 90); ctx.lineTo(57, 97); ctx.lineTo(60, 90); ctx.fill(); // Левый клык
        ctx.beginPath(); ctx.moveTo(74, 90); ctx.lineTo(71, 97); ctx.lineTo(68, 90); ctx.fill(); // Правый клык

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная тень на всю левую половину тигра)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.beginPath(); ctx.moveTo(64, 12); ctx.lineTo(26, 76); ctx.lineTo(34, 108); ctx.lineTo(64, 108); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ДРИАДЫ НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateDryadAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Пышная копна волос из переплетенных лоз и дубовой листвы
        ctx.fillStyle = '#1e4620'; // Темно-зеленый лиственный объем волос
        ctx.beginPath();
        ctx.arc(38, 52, 20, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(90, 52, 20, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(64, 40, 22, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(25, 50, 78, 50); // Шлейф волос сзади

        // Травяная мантийная накидка на плечах
        ctx.fillStyle = '#27ae60';
        ctx.beginPath(); ctx.moveTo(25, 128); ctx.lineTo(44, 105); ctx.lineTo(84, 105); ctx.lineTo(103, 128); ctx.fill();

        // 3. АКУРАТНЫЕ УШКИ (Тонкие, эльфийского типа, направлены строго вверх-назад)
        ctx.fillStyle = '#659c68'; // Цвет кожи в тени волос
        ctx.beginPath(); ctx.moveTo(46, 62); ctx.lineTo(26, 40); ctx.lineTo(44, 70); ctx.fill(); // Левое
        ctx.beginPath(); ctx.moveTo(82, 62); ctx.lineTo(102, 40); ctx.lineTo(84, 70); ctx.fill(); // Правое

        // 4. ЛИЦО (Изящный женственный овал с нежной древесно-салатовой кожей)
        ctx.fillStyle = '#7bc67f'; // Уникальный лиственный цвет кожи дриады
        ctx.beginPath();
        ctx.moveTo(46, 50); ctx.lineTo(64, 34); ctx.lineTo(82, 50);
        ctx.lineTo(80, 78); ctx.lineTo(64, 96); ctx.lineTo(48, 78);
        ctx.closePath(); ctx.fill();

        // Передние локоны-лианы, спускающиеся по бокам лица
        ctx.fillStyle = '#3b7a3e';
        ctx.beginPath(); ctx.moveTo(46, 34); ctx.quadraticCurveTo(40, 60, 44, 82); ctx.lineTo(49, 80); ctx.quadraticCurveTo(46, 56, 50, 38); ctx.fill();
        ctx.beginPath(); ctx.moveTo(82, 34); ctx.quadraticCurveTo(88, 60, 84, 82); ctx.lineTo(79, 80); ctx.quadraticCurveTo(82, 56, 78, 38); ctx.fill();

        // 5. ГЛУБОКИЕ ИЗУМРУДНЫЕ ГЛАЗА ТАЙНОЙ ПРИРОДЫ (Светящийся неон)
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath(); ctx.ellipse(55, 58, 4.5, 1.8, -Math.PI / 14, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(73, 58, 4.5, 1.8, Math.PI / 14, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; // Волшебные блики
        ctx.beginPath(); ctx.arc(56, 57.5, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(72, 57.5, 1, 0, Math.PI * 2); ctx.fill();

        // Изящные тонкие брови и сочные ягодные губы
        ctx.strokeStyle = '#1e4620'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(47, 52); ctx.lineTo(58, 54); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(81, 52); ctx.lineTo(70, 54); ctx.stroke();
        ctx.fillStyle = '#e74c3c'; // Насыщенный брусничный рот
        ctx.beginPath(); ctx.ellipse(64, 83, 4.5, 1.5, 0, 0, Math.PI * 2); ctx.fill();

        // Аккуратный носик
        ctx.strokeStyle = '#539c57'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 54); ctx.lineTo(62, 73); ctx.lineTo(66, 73); ctx.stroke();

        // 6. КОРОНА ИЗ ДРЕВЕСНОЙ КОРЫ С ЯНТАРНЫМ ЦВЕТКОМ (На лбу)
        ctx.fillStyle = '#5c4033'; ctx.strokeStyle = '#3d2b22'; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(49, 44); ctx.lineTo(64, 48); ctx.lineTo(79, 44); ctx.lineTo(74, 38); ctx.lineTo(64, 42); ctx.lineTo(54, 38);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Магический распускающийся янтарный бутон по центру
        ctx.fillStyle = '#e67e22';
        ctx.beginPath(); ctx.arc(64, 43, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffd875'; ctx.beginPath(); ctx.arc(64, 43, 1, 0, Math.PI * 2); ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная глубокая тень на левую половину лица)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.beginPath(); ctx.moveTo(64, 34); ctx.lineTo(45, 50); ctx.lineTo(48, 78); ctx.lineTo(64, 96); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ВАРВАРА НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateBarbarianAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Дикие растрепанные волосы и меховой воротник
        ctx.fillStyle = '#2d1f18'; // Дикие каштановые волосы
        ctx.beginPath();
        ctx.arc(38, 55, 18, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(90, 55, 18, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(24, 52, 80, 55); // Затылок

        ctx.fillStyle = '#4a3b32'; // Меховой воротник на плечах
        ctx.beginPath(); ctx.moveTo(18, 128); ctx.lineTo(34, 100); ctx.lineTo(94, 100); ctx.lineTo(110, 128); ctx.fill();

        // 3. ЛИЦО (Загорелое, суровое, с недельной щетиной и шрамом)
        ctx.fillStyle = '#d39e82'; // Базовая кожа
        ctx.beginPath();
        ctx.moveTo(44, 56); ctx.lineTo(84, 56); ctx.lineTo(86, 85);
        ctx.lineTo(64, 105); ctx.lineTo(42, 85); ctx.closePath(); ctx.fill();

        // Напыление грубой щетины
        ctx.fillStyle = 'rgba(40, 30, 20, 0.22)';
        ctx.beginPath(); ctx.moveTo(42, 82); ctx.lineTo(64, 105); ctx.lineTo(86, 82); ctx.lineTo(84, 90); ctx.lineTo(64, 105); ctx.lineTo(44, 90); ctx.fill();

        // 4. КОЖАНАЯ ПОВЯЗКА НА ЛОБ И СУРОВЫЙ ПРИЩУР
        ctx.fillStyle = '#3a2116'; // Кожаный ремешок на лбу
        ctx.fillRect(43, 50, 42, 7);

        ctx.fillStyle = '#ffffff'; // Белки злых суженных глаз
        ctx.beginPath(); ctx.ellipse(53, 66, 4.5, 1.2, -Math.PI / 16, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 66, 4.5, 1.2, Math.PI / 16, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#d35400'; // Янтарные зрачки ярости
        ctx.beginPath(); ctx.arc(54, 66, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 66, 1.5, 0, Math.PI * 2); ctx.fill();

        // Сведенные к переносице брови
        ctx.strokeStyle = '#1e120b'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(45, 60); ctx.lineTo(57, 63); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(83, 60); ctx.lineTo(71, 63); ctx.stroke();

        // Ритуальный красный татуаж на лице (полоса ярости через глаз)
        ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(50, 56); ctx.lineTo(56, 78); ctx.stroke();

        // Плотный нос и яростный опущенный рот
        ctx.strokeStyle = '#b88368'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 61); ctx.lineTo(62, 78); ctx.lineTo(66, 78); ctx.stroke();
        ctx.strokeStyle = '#1e120b'; ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.moveTo(54, 88); ctx.quadraticCurveTo(64, 85, 74, 88); ctx.stroke();

        // 5. ДИНАМИЧНЫЙ БOЕВОЙ ТОПОР (Парит по диагонали на переднем плане справа налево)
        ctx.fillStyle = '#57606f'; // Стальное лезвие секиры
        ctx.save();
        ctx.beginPath(); ctx.moveTo(112, 115); ctx.lineTo(92, 85); ctx.lineTo(84, 92); ctx.lineTo(104, 122); ctx.closePath(); ctx.fill();
        // Острая режущая кромка топора (серебро)
        ctx.fillStyle = '#dcdde1';
        ctx.beginPath(); ctx.moveTo(84, 92); ctx.quadraticCurveTo(80, 104, 104, 122); ctx.lineTo(100, 118); ctx.quadraticCurveTo(78, 102, 84, 92); ctx.closePath(); ctx.fill();

        // Рукоять топора (дерево)
        ctx.strokeStyle = '#5c3e26'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(120, 128); ctx.lineTo(76, 78); ctx.stroke();
        ctx.restore();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная тень на всю левую половину токена)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath(); ctx.moveTo(64, 12); ctx.lineTo(24, 52); ctx.lineTo(18, 128); ctx.lineTo(64, 128); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ВОРОНЫ НА CANVAS (ВЕРСИЯ 4.0 — ИСТИННАЯ АНАТОМИЯ ПТИЦЫ)
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateRavenAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Изящный, изогнутый силуэт птичьей шеи
        ctx.fillStyle = '#090d16'; // Ультра-черный
        ctx.beginPath();
        ctx.moveTo(68, 60);
        ctx.quadraticCurveTo(90, 80, 115, 110); // Изгиб шеи сзади
        ctx.lineTo(100, 128);
        ctx.lineTo(45, 128);
        ctx.quadraticCurveTo(55, 95, 58, 80);  // Горловая часть
        ctx.closePath(); ctx.fill();

        // 3. ГОЛОВА ПТИЦЫ (Четкий округлый птичий череп)
        ctx.fillStyle = '#111622';
        ctx.beginPath();
        ctx.moveTo(82, 54);   // Затылок
        ctx.quadraticCurveTo(72, 38, 54, 44); // Округлое темя птицы (не плоское)
        ctx.lineTo(36, 52);   // Переносица (начало клюва)
        ctx.lineTo(12, 64);   // Острый кончик клюва
        ctx.lineTo(38, 76);   // Основание нижней челюсти
        ctx.lineTo(52, 82);   // «Бородка» из перьев под клювом
        ctx.quadraticCurveTo(72, 80, 82, 68); // Скула
        ctx.closePath(); ctx.fill();

        // Взъерошенные перья на затылке (Характерные птичьи зубцы вместо уха животного)
        ctx.fillStyle = '#1c2331';
        ctx.beginPath(); ctx.moveTo(80, 48); ctx.lineTo(92, 46); ctx.lineTo(84, 56); ctx.fill();
        ctx.beginPath(); ctx.moveTo(82, 56); ctx.lineTo(94, 58); ctx.lineTo(83, 66); ctx.fill();

        // Перьевая «бородка» под клювом
        ctx.beginPath(); ctx.moveTo(42, 75); ctx.lineTo(46, 86); ctx.lineTo(54, 78); ctx.fill();

        // Световой текстурный отблик по верху головы
        ctx.strokeStyle = '#57606f'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(56, 42); ctx.quadraticCurveTo(68, 44, 76, 50); ctx.stroke();

        // 4. АНАТОМИЧЕСКИЙ КЛЮВ ВОРОНЫ (Длинный, мощный, конусовидный, вытянут вперед)
        ctx.fillStyle = '#05070a'; // Глухой черный
        ctx.beginPath();
        ctx.moveTo(42, 49);   // Верхнее основание на лбу
        ctx.lineTo(12, 64);   // Острый, слегка закругленный на конце кончик
        ctx.lineTo(38, 76);   // Нижнее основание
        ctx.lineTo(40, 68);   // Линия разреза у рта
        ctx.closePath(); ctx.fill();

        // Аккуратный серебряный блик, подчеркивающий ровную верхнюю грань клюва
        ctx.strokeStyle = '#f1f2f6'; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(38, 51); ctx.lineTo(16, 61); ctx.stroke();

        // Четкая линия разреза клюва (Птица держит его строго закрытым)
        ctx.strokeStyle = '#2f3542'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(38, 65); ctx.lineTo(13, 64); ctx.stroke();

        // 5. МИСТИЧЕСКИЙ КРУГЛЫЙ ГЛАЗ ВОРОНЫ (Фиолетовое неоновое свечение)
        ctx.fillStyle = '#8c52ff';
        ctx.beginPath(); ctx.arc(56, 56, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; // Хрустальный блик
        ctx.beginPath(); ctx.arc(56.5, 55, 1, 0, Math.PI * 2); ctx.fill();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная маска тени на левую половину круга)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.beginPath(); ctx.moveTo(64, 20); ctx.lineTo(12, 64); ctx.lineTo(45, 128); ctx.lineTo(64, 128); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ЖАБЫ НА CANVAS (БРУТАЛЬНЫЙ АНФАС)
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateToadAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Массивное, расплывчатое тело амфибии (Плечи и горб)
        ctx.fillStyle = '#1e331e'; // Болотный темно-зеленый
        ctx.beginPath();
        ctx.moveTo(16, 128); ctx.lineTo(34, 85); ctx.lineTo(94, 85); ctx.lineTo(112, 128);
        ctx.closePath(); ctx.fill();

        // 3. ТЕЛО И ГОЛОВА ЖАБЫ (Единый, приплюснутый, невероятно широкий пласт)
        ctx.fillStyle = '#3b5e2b'; // Базовая оливковая кожа
        ctx.beginPath();
        ctx.moveTo(34, 55); ctx.quadraticCurveTo(64, 46, 94, 55); // Лобная дуга между глаз
        ctx.lineTo(106, 82);  // Правая раздутая щека / горловой мешок
        ctx.lineTo(90, 110);  // Правый край брюшка
        ctx.lineTo(38, 110);  // Левый край брюшка
        ctx.lineTo(22, 82);   // Левая раздутая щека
        ctx.closePath(); ctx.fill();

        // Светлое грязно-желтое брюшко и раздутый горловой мешок
        ctx.fillStyle = '#999460';
        ctx.beginPath();
        ctx.moveTo(36, 82); ctx.quadraticCurveTo(64, 76, 92, 82);
        ctx.lineTo(84, 108); ctx.quadraticCurveTo(64, 112, 44, 108);
        ctx.closePath(); ctx.fill();

        // 4. КРУПНЫЕ БОРОДАВКИ И БУГОРКИ (Текстура кожи flat-кружками)
        ctx.fillStyle = '#223d18';
        ctx.beginPath(); ctx.arc(42, 64, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(86, 64, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(32, 78, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(96, 78, 4, 0, Math.PI * 2); ctx.fill();

        // 5. ОГРОМНЫЕ ВЫПУКЛЫЕ ЗОЛОТЫЕ ГЛАЗА-ЛУКОВИЦЫ (Парят на вершине головы)
        ctx.fillStyle = '#f1c40f'; // Ослепительное золото радужки
        ctx.beginPath(); ctx.arc(36, 50, 9, 0, Math.PI * 2); ctx.fill(); // Левый глаз
        ctx.beginPath(); ctx.arc(92, 50, 9, 0, Math.PI * 2); ctx.fill(); // Правый глаз

        ctx.fillStyle = '#000000'; // Амфибийные горизонтальные зрачки-щели
        ctx.fillRect(28, 49, 16, 2.5);
        ctx.fillRect(84, 49, 16, 2.5);

        ctx.fillStyle = '#ffffff'; // Хрустальные белые блики на вершинах луковиц
        ctx.beginPath(); ctx.arc(39, 46, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(89, 46, 1.5, 0, Math.PI * 2); ctx.fill();

        // Кожаные веки, прижимающие глаза по бокам
        ctx.strokeStyle = '#1e331e'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.arc(36, 50, 9, Math.PI, Math.PI * 1.8); ctx.stroke();
        ctx.beginPath(); ctx.arc(92, 50, 9, Math.PI * 1.2, Math.PI * 2); ctx.stroke();

        // 6. ОГРОМНЫЙ ЕХИДНЫЙ РОТ-ЩЕЛЬ ДО САМЫХ ЩЕК
        ctx.strokeStyle = '#1a2e13'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(28, 76); ctx.quadraticCurveTo(64, 88, 100, 76); ctx.stroke();

        // Маленькие точки ноздрей на плоском лбу
        ctx.fillStyle = '#1a2e13';
        ctx.beginPath(); ctx.arc(58, 60, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(70, 60, 1.5, 0, Math.PI * 2); ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная маска тени строго на левую половину жабы)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.beginPath(); ctx.moveTo(64, 15); ctx.lineTo(16, 128); ctx.lineTo(64, 128); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ЧЕРВЯ НА CANVAS (ПОДЗЕМНЫЙ МОНСТР АНФАС)
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateWormAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Мощные кольца кольчатого тела (Вздымается снизу вверх)
        ctx.fillStyle = '#2c1a4d'; // Теневой фиолетовый сегмент тела
        ctx.beginPath();
        ctx.moveTo(20, 128); ctx.quadraticCurveTo(64, 90, 108, 128);
        ctx.closePath(); ctx.fill();

        // Хитиновые шипы на спине червя, торчащие по бокам
        ctx.fillStyle = '#1a0f30';
        ctx.beginPath(); ctx.moveTo(34, 100); ctx.lineTo(15, 95); ctx.lineTo(32, 112); ctx.fill();
        ctx.beginPath(); ctx.moveTo(94, 100); ctx.lineTo(113, 95); ctx.lineTo(96, 112); ctx.fill();

        // 3. ГОЛОВА И ТЕЛО ЧЕРВЯ (Массивный, цилиндрический сегмент по центру)
        ctx.fillStyle = '#4a277a'; // Плотный базовый пурпурный хитин
        ctx.beginPath();
        ctx.moveTo(36, 128);
        ctx.lineTo(36, 75);
        ctx.quadraticCurveTo(64, 46, 92, 75); // Округлая слепая голова сверху (без глаз)
        ctx.lineTo(92, 128);
        ctx.closePath(); ctx.fill();

        // Поперечные кольцевые складки кожи (Текстура плоского червя)
        ctx.strokeStyle = '#34195c'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(37, 96); ctx.quadraticCurveTo(64, 106, 91, 96); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(37, 114); ctx.quadraticCurveTo(64, 124, 91, 114); ctx.stroke();

        // 4. ОГРОМНАЯ КРУГЛАЯ РАСКРЫТАЯ ПАСТЬ-ВОРОНКА (По центру головы)
        ctx.fillStyle = '#11051c'; // Бездонная черная глотка пожирателя
        ctx.beginPath(); ctx.arc(64, 72, 19, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#34195c'; ctx.lineWidth = 2.5; ctx.stroke();

        // Ряды концентрических острых зубов-игл внутри пасти
        ctx.fillStyle = '#f5f6fa'; // Белоснежные зубы
        // Внешнее кольцо зубов (8 треугольников по кругу)
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
            ctx.save();
            ctx.translate(64, 72);
            ctx.rotate(a);
            ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(-3, -13); ctx.lineTo(3, -13); ctx.closePath(); ctx.fill();
            // Внутреннее мелкое кольцо зубов
            ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(-2, -7); ctx.lineTo(2, -7); ctx.closePath(); ctx.fill();
            ctx.restore();
        }

        // 5. ВНЕШНИЕ ХИТИНОВЫЕ ЖВАЛА-КЛЫКИ (Окружают пасть по бокам, разрывая контур)
        ctx.fillStyle = '#11051c'; // Основание жвал
        ctx.save();
        // Левое жвало
        ctx.beginPath(); ctx.moveTo(42, 72); ctx.quadraticCurveTo(28, 72, 32, 60); ctx.quadraticCurveTo(38, 68, 44, 70); ctx.fill();
        // Правое жвало
        ctx.beginPath(); ctx.moveTo(86, 72); ctx.quadraticCurveTo(100, 72, 96, 60); ctx.quadraticCurveTo(90, 68, 84, 70); ctx.fill();

        // Острые позолоченные кончики клыков
        ctx.fillStyle = '#ffd875';
        ctx.beginPath(); ctx.moveTo(32, 60); ctx.lineTo(26, 52); ctx.lineTo(36, 58); ctx.fill();
        ctx.beginPath(); ctx.moveTo(96, 60); ctx.lineTo(102, 52); ctx.lineTo(92, 58); ctx.fill();
        ctx.restore();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная маска глубокой тени на левую половину червя)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        ctx.beginPath(); ctx.moveTo(64, 49); ctx.lineTo(36, 75); ctx.lineTo(36, 128); ctx.lineTo(64, 128); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },
    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ВОИТЕЛЬНИЦЫ НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateWarriorFemaleAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Собранные темные волосы и чешуйчатые наплечники
        ctx.fillStyle = '#1c1613'; // Волосы
        ctx.beginPath(); ctx.arc(42, 54, 16, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(86, 54, 16, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(26, 52, 76, 50);

        ctx.fillStyle = '#4b5563'; // Стальной доспех (горжет)
        ctx.beginPath(); ctx.moveTo(20, 128); ctx.lineTo(38, 102); ctx.lineTo(90, 102); ctx.lineTo(108, 128); ctx.fill();

        // 3. ПАФОСНЫЙ АЛЫЙ ГРЕБЕНЬ ШЛЕМА (Плюмаж)
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath(); ctx.moveTo(60, 42); ctx.lineTo(64, 14); ctx.lineTo(76, 12); ctx.lineTo(68, 42); ctx.closePath(); ctx.fill();

        // 4. ЛИЦО (Изящный, но твердый овал, обветренная кожа со шрамом)
        ctx.fillStyle = '#fbc5a4';
        ctx.beginPath();
        ctx.moveTo(46, 54); ctx.lineTo(64, 38); ctx.lineTo(82, 54);
        ctx.lineTo(80, 82); ctx.lineTo(64, 100); ctx.lineTo(48, 82);
        ctx.closePath(); ctx.fill();

        // Стальной полуоткрытый шлем-обруч, защищающий виски и лоб
        ctx.fillStyle = '#718093';
        ctx.beginPath();
        ctx.moveTo(43, 50); ctx.lineTo(64, 36); ctx.lineTo(85, 50);
        ctx.lineTo(81, 60); ctx.lineTo(64, 52); ctx.lineTo(47, 60);
        ctx.closePath(); ctx.fill();

        // 5. РЕШИТЕЛЬНЫЙ ВЗГЛЯД (Контрастные стальные глаза и боевой шрам)
        ctx.fillStyle = '#ffffff'; // Белки
        ctx.beginPath(); ctx.ellipse(54, 66, 4, 1.5, -Math.PI / 16, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 66, 4, 1.5, Math.PI / 16, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#2980b9'; // Синие глаза воительницы
        ctx.beginPath(); ctx.arc(54, 66, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 66, 1.5, 0, Math.PI * 2); ctx.fill();

        // Суровые собранные брови
        ctx.strokeStyle = '#1c1613'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(47, 60); ctx.lineTo(58, 62); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(81, 60); ctx.lineTo(70, 62); ctx.stroke();

        // Тонкий боевой шрам на левой щеке
        ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(49, 72); ctx.lineTo(54, 84); ctx.stroke();

        // Нос и твердая, решительная прямая линия губ
        ctx.strokeStyle = '#df9f7e'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 62); ctx.lineTo(62, 78); ctx.lineTo(66, 78); ctx.stroke();
        ctx.strokeStyle = '#1c1613'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(55, 87); ctx.lineTo(73, 87); ctx.stroke();

        // 6. МОНУМЕНТАЛЬНЫЙ ДВУРУЧНЫЙ МЕЧ (Парит строго вертикально на переднем плане)
        ctx.fillStyle = '#dcdde1'; // Стальное лезвие клинка
        ctx.fillRect(62, 70, 4, 35);
        ctx.fillStyle = '#7f8c8d'; // Задняя кромка лезвия для flat-тени
        ctx.fillRect(62, 70, 2, 35);

        // Золотая гарда-перекрестие и рукоять меча
        ctx.fillStyle = '#ffd875'; ctx.strokeStyle = '#b89445'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.roundRect(52, 105, 24, 4, 1); ctx.fill(); ctx.stroke(); // Гарда
        ctx.fillStyle = '#2c3e50'; ctx.fillRect(62, 109, 4, 14); // Рукоять
        ctx.fillStyle = '#ffd875'; ctx.beginPath(); ctx.arc(64, 125, 3.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); // Навершие

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная тень на левую половину лица)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.beginPath(); ctx.moveTo(64, 14); ctx.lineTo(26, 52); ctx.lineTo(20, 128); ctx.lineTo(64, 128); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ГЛАВАРЯ БАНДИТОВ НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateBanditCaptainAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Густой загривок и меховой воротник на плечах
        ctx.fillStyle = '#3a2d29'; // Тяжелый мех на плечах атамана
        ctx.beginPath(); ctx.moveTo(18, 128); ctx.lineTo(34, 100); ctx.lineTo(94, 100); ctx.lineTo(110, 128); ctx.fill();

        ctx.fillStyle = '#111622'; // Стальной нагрудник
        ctx.beginPath(); ctx.moveTo(42, 102); ctx.lineTo(54, 92); ctx.lineTo(74, 92); ctx.lineTo(86, 102); ctx.closePath(); ctx.fill();

        // 3. ЛИЦО (Обветренное, с брутальной окладистой черной бородой)
        ctx.fillStyle = '#c48a6c'; // Базовый тон кожи
        ctx.beginPath();
        ctx.moveTo(46, 54); ctx.lineTo(64, 38); ctx.lineTo(82, 54);
        ctx.lineTo(80, 82); ctx.lineTo(64, 102); ctx.lineTo(48, 82);
        ctx.closePath(); ctx.fill();

        // Массивная окладистая черная борода и усы, закрывающие челюсть
        ctx.fillStyle = '#0f141d';
        ctx.beginPath(); ctx.moveTo(44, 78); ctx.lineTo(30, 96); ctx.lineTo(46, 124); ctx.lineTo(82, 124); ctx.lineTo(98, 96); ctx.lineTo(84, 78); ctx.quadraticCurveTo(64, 90, 44, 78); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(48, 76); ctx.lineTo(64, 82); ctx.lineTo(80, 76); ctx.lineTo(64, 88); ctx.closePath(); ctx.fill(); // Усы

        // 4. ТЯЖЕЛЫЙ СТАЛЬНОЙ ШЛЕМ С ЗОЛОТЫМ КАНТОМ
        ctx.fillStyle = '#57606f'; // Корпус шлема
        ctx.beginPath();
        ctx.moveTo(40, 52); ctx.lineTo(64, 26); ctx.lineTo(88, 52);
        ctx.lineTo(84, 62); ctx.lineTo(64, 58); ctx.lineTo(44, 62);
        ctx.closePath(); ctx.fill();

        ctx.strokeStyle = '#ffd875'; ctx.lineWidth = 1.2; // Золотая чеканка по краю шлема
        ctx.beginPath(); ctx.moveTo(42, 53); ctx.lineTo(64, 29); ctx.lineTo(86, 53); ctx.stroke();

        // 5. ЗЛОЙ ПРИЩУР ГЛАЗ И ШРАМ БОССА
        ctx.fillStyle = '#ffffff'; // Белки
        ctx.beginPath(); ctx.ellipse(54, 65, 4.5, 1.2, -Math.PI / 16, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 65, 4.5, 1.2, Math.PI / 16, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#e67e22'; // Янтарные глаза главаря
        ctx.beginPath(); ctx.arc(54, 65, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 65, 1.5, 0, Math.PI * 2); ctx.fill();

        // Сведенные брови и рваный шрам через левый висок
        ctx.strokeStyle = '#0f141d'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(44, 59); ctx.lineTo(56, 61); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(84, 59); ctx.lineTo(72, 61); ctx.stroke();
        ctx.strokeStyle = '#a62b2b'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(42, 45); ctx.lineTo(49, 68); ctx.stroke();

        // Крупный нос
        ctx.strokeStyle = '#af755a'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 60); ctx.lineTo(62, 75); ctx.lineTo(66, 75); ctx.stroke();

        // 6. СКРЕЩЕННЫЕ СТАЛЬНЫЕ САБЛИ НА ПЕРЕДНЕМ ПЛАНЕ
        ctx.strokeStyle = '#dcdde1'; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; // Лезвия палашей
        ctx.beginPath(); ctx.moveTo(18, 124); ctx.lineTo(54, 94); ctx.stroke(); // Левая сабля
        ctx.strokeStyle = '#b2bec3'; // Теневая правая сабля
        ctx.beginPath(); ctx.moveTo(110, 124); ctx.lineTo(74, 94); ctx.stroke();

        // Золотые перекрестия рукоятей в самом низу токена
        ctx.fillStyle = '#ffd875'; ctx.strokeStyle = '#b89445'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.arc(20, 122, 3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(108, 122, 3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная глубокая тень на левую половину токена)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath(); ctx.moveTo(64, 26); ctx.lineTo(40, 52); ctx.lineTo(30, 96); ctx.lineTo(46, 128); ctx.lineTo(64, 128); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ КЛЕЩА-ПЕРЕРОСТКА НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateTickAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЧЛЕНИСТЫЕ ЖЕСТКИЕ ЛАПЫ (Угловые суставы цепляются по бокам)
        ctx.strokeStyle = '#1a110b'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'miter';

        // Левые лапы (3 массивных загнутых сустава)
        ctx.beginPath(); ctx.moveTo(44, 60); ctx.lineTo(14, 45); ctx.lineTo(10, 75); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(42, 75); ctx.lineTo(8, 75); ctx.lineTo(12, 105); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(46, 90); ctx.lineTo(16, 100); ctx.lineTo(24, 122); ctx.stroke();

        // Правые лапы (3 массивных загнутых сустава)
        ctx.strokeStyle = '#261b12'; // Flat-контраст для глубины
        ctx.beginPath(); ctx.moveTo(84, 60); ctx.lineTo(114, 45); ctx.lineTo(118, 75); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(86, 75); ctx.lineTo(120, 75); ctx.lineTo(116, 105); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(82, 90); ctx.lineTo(112, 100); ctx.lineTo(104, 122); ctx.stroke();

        // 3. РАЗДУТОЕ ТЕЛО ПАРАЗИТА (Огромное каплевидное кольчатое брюшко)
        ctx.fillStyle = '#5c251e'; // Напитавшийся кровью багрово-бурый хитин
        ctx.beginPath();
        ctx.moveTo(64, 46);
        ctx.bezierCurveTo(34, 46, 28, 92, 38, 114);
        ctx.quadraticCurveTo(64, 125, 90, 114);
        ctx.bezierCurveTo(100, 92, 94, 46, 64, 46);
        ctx.closePath(); ctx.fill();

        // Поперечные складки раздутого брюшка (Кольца паразита)
        ctx.strokeStyle = '#3d1612'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(34, 76); ctx.quadraticCurveTo(64, 84, 94, 76); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(32, 92); ctx.quadraticCurveTo(64, 101, 96, 92); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(37, 106); ctx.quadraticCurveTo(64, 115, 91, 106); ctx.stroke();

        // 4. ГОЛОВОГРУДЬ И СТРАШНЫЙ КОЛЮЩИЙ ХОБОТОК (Гипостом)
        ctx.fillStyle = '#21120b'; // Маленький щиток головы сверху
        ctx.beginPath(); ctx.ellipse(64, 48, 12, 8, 0, 0, Math.PI * 2); ctx.fill();

        // Длинный, едкий колющий насос-жало по центру (направлен вверх-вперед)
        ctx.fillStyle = '#110906';
        ctx.fillRect(62, 28, 4, 14);
        // Острые боковые жвала-резцы, фиксирующие жертву
        ctx.fillStyle = '#7f8c8d'; // Стальные лезвия клыков
        ctx.beginPath(); ctx.moveTo(59, 36); ctx.lineTo(54, 25); ctx.lineTo(62, 34); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(69, 36); ctx.lineTo(74, 25); ctx.lineTo(66, 34); ctx.closePath(); ctx.fill();

        // Светящиеся капли ядовитой слюны на конце хоботка (Кислотный неон)
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath(); ctx.arc(64, 24, 1.5, 0, Math.PI * 2); ctx.fill();

        // 5. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная глубокая маска тени на левую половину клеща)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        ctx.beginPath(); ctx.moveTo(64, 24); ctx.lineTo(10, 45); ctx.lineTo(24, 122); ctx.lineTo(64, 128); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ДРАКОНА НА CANVAS (КОРОЛЕВСКИЙ ПРОФИЛЬ ВЛЕВО)
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateDragonAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Мощные золотые рога (Идут вдоль черепа назад-вверх)
        ctx.fillStyle = '#d4af37'; // Базовое золото
        ctx.beginPath();
        ctx.moveTo(85, 42);
        ctx.quadraticCurveTo(110, 24, 122, 10); // Главный массивный рог
        ctx.lineTo(104, 46);
        ctx.closePath(); ctx.fill();

        ctx.fillStyle = '#aa851c'; // Нижний малый рог в тени
        ctx.beginPath();
        ctx.moveTo(88, 54);
        ctx.quadraticCurveTo(106, 44, 114, 30);
        ctx.lineTo(96, 56);
        ctx.closePath(); ctx.fill();

        // Массивная бронированная шея с чешуйчатыми пластинами
        ctx.fillStyle = '#962d2d';
        ctx.beginPath(); ctx.moveTo(70, 85); ctx.lineTo(95, 128); ctx.lineTo(35, 128); ctx.lineTo(50, 85); ctx.closePath(); ctx.fill();

        // Шипы на шее сзади
        ctx.fillStyle = '#5c1d1d';
        ctx.beginPath(); ctx.moveTo(82, 94); ctx.lineTo(96, 102); ctx.lineTo(86, 110); ctx.fill();
        ctx.beginPath(); ctx.moveTo(88, 110); ctx.lineTo(102, 118); ctx.lineTo(92, 126); ctx.fill();

        // 3. МОРДА ДРАКОНА В ПРОФИЛЬ (Брутальный клиновидный силуэт влево)
        ctx.fillStyle = '#c0392b'; // Насыщенная огненно-красная чешуя
        ctx.beginPath();
        ctx.moveTo(88, 50);   // Затылок
        ctx.lineTo(66, 38);   // Лоб с наростом
        ctx.lineTo(18, 64);   // Кончик верхней челюсти
        ctx.lineTo(24, 76);   // Верхняя губа
        ctx.lineTo(56, 88);   // Нижняя челюсть
        ctx.lineTo(84, 78);   // Скула
        ctx.closePath(); ctx.fill();

        // Чешуйчатые надбровные бугры
        ctx.fillStyle = '#962d2d';
        ctx.beginPath(); ctx.arc(60, 44, 4, 0, Math.PI * 2); ctx.fill();

        // 4. СВЕТЯЩИЙСЯ РЕПТИЛОИДНЫЕ ГЛАЗ (Яркий неоново-желтый огонь)
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.moveTo(56, 52); ctx.lineTo(68, 47); ctx.lineTo(63, 56);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#000000'; // Вертикальный зрачок-щель
        ctx.fillRect(60, 49, 1.5, 5);

        // 5. ИЗВЕРГАЮЩЕЕСЯ ПЛАМЯ ИЗ ПРИОТКРЫТОЙ ПАСТИ
        // Электронное неоновое пламя (Заливает левый край токена)
        ctx.fillStyle = 'rgba(230, 126, 34, 0.4)'; // Мягкий внешний шлейф огня
        ctx.beginPath(); ctx.moveTo(22, 68); ctx.lineTo(2, 45); ctx.lineTo(4, 115); ctx.lineTo(48, 84); ctx.fill();

        ctx.fillStyle = '#f1c40f'; // Внутреннее жаркое ядро выдоха
        ctx.beginPath(); ctx.moveTo(24, 70); ctx.lineTo(4, 60); ctx.lineTo(6, 95); ctx.lineTo(44, 82); ctx.fill();

        // 6. ТЕМНАЯ ГЛУБИНА ПАСТИ И БЕЛОСНЕЖНЫЕ КЛЫКИ
        ctx.fillStyle = '#1c0d0d';
        ctx.beginPath();
        ctx.moveTo(24, 72); ctx.lineTo(50, 78); ctx.lineTo(46, 83); ctx.lineTo(28, 79);
        ctx.closePath(); ctx.fill();

        // Острые драконьи клыки, рвущие профиль
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.moveTo(26, 72); ctx.lineTo(29, 78); ctx.lineTo(31, 73); ctx.fill(); // Верхний передний
        ctx.beginPath(); ctx.moveTo(35, 73); ctx.lineTo(38, 79); ctx.lineTo(41, 74); ctx.fill(); // Верхний дальний
        ctx.beginPath(); ctx.moveTo(30, 80); ctx.lineTo(33, 75); ctx.lineTo(35, 80); ctx.fill(); // Нижний клык

        // 7. СВЕТЛАЯ НИЖНЯЯ ПЛАСТИНА ЧЕЛЮСТИ (Flat-акцент для объема)
        ctx.fillStyle = '#d94d3d';
        ctx.beginPath();
        ctx.moveTo(56, 88); ctx.lineTo(84, 78); ctx.lineTo(72, 64);
        ctx.quadraticCurveTo(53, 74, 56, 88);
        ctx.closePath(); ctx.fill();

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная маска тени на левую половину дракона)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.beginPath(); ctx.moveTo(64, 15); ctx.lineTo(18, 64); ctx.lineTo(42, 128); ctx.lineTo(64, 128); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ТРОЛЛЯ НА CANVAS (СУРОВЫЙ АНФАС)
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateTrollAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Спутанный моховой загривок и сгорбленные плечи
        ctx.fillStyle = '#222d19'; // Моховые грязные волосы
        ctx.beginPath();
        ctx.moveTo(30, 60); ctx.lineTo(15, 128); ctx.lineTo(113, 128); ctx.lineTo(98, 60);
        ctx.closePath(); ctx.fill();

        // Уродливые, рваные и заостренные уши тролля, торчащие горизонтально
        ctx.fillStyle = '#3a4f25';
        ctx.beginPath(); ctx.moveTo(42, 64); ctx.lineTo(10, 60); ctx.lineTo(44, 82); ctx.fill(); // Левое ухо
        ctx.beginPath(); ctx.moveTo(86, 64); ctx.lineTo(118, 60); ctx.lineTo(84, 82); ctx.fill(); // Правое ухо

        // Ржавая серьга в левом ухе мародера
        ctx.fillStyle = '#7f8c8d';
        ctx.beginPath(); ctx.arc(14, 63, 2, 0, Math.PI * 2); ctx.fill();

        // 3. МОРДА И ЧЕЛЮСТЬ (Массивный, деформированный flat-череп)
        ctx.fillStyle = '#557a39'; // Мшистая зеленая кожа тролля
        ctx.beginPath();
        ctx.moveTo(46, 46); ctx.lineTo(82, 46); // Лоб
        ctx.lineTo(92, 75);  // Правая скула
        ctx.lineTo(84, 102); // Правый угол массивной квадратной челюсти
        ctx.lineTo(44, 102); // Левый угол челюсти
        ctx.lineTo(36, 75);  // Левая скула
        ctx.closePath(); ctx.fill();

        // 4. ДЛИННЫЙ УРОДЛИВЫЙ НОС КРЮЧКОМ (Визитная карточка троллей)
        ctx.fillStyle = '#3a5425';
        ctx.beginPath();
        ctx.moveTo(60, 60); ctx.lineTo(68, 60);
        ctx.lineTo(66, 88); // Нос вытянут далеко вниз
        ctx.lineTo(58, 85);
        ctx.closePath(); ctx.fill();

        // 5. КРОВОЖАДНЫЙ ПРИЩУР МАЛЕНЬКИХ ГЛАЗ (Светящийся неоново-красный огонь)
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath(); ctx.arc(52, 56, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 56, 2.2, 0, Math.PI * 2); ctx.fill();

        // Тяжелый, нависающий костный валик над бровями
        ctx.strokeStyle = '#223013'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(43, 50); ctx.lineTo(85, 50); ctx.stroke();

        // 6. ОГРОМНЫЙ ЗУБАСТЫЙ ОСКАЛ (Нижний прикус с торчащими гнилыми бивнями)
        ctx.strokeStyle = '#223013'; ctx.lineWidth = 2; // Линия рта
        ctx.beginPath(); ctx.moveTo(44, 88); ctx.quadraticCurveTo(64, 95, 84, 88); ctx.stroke();

        // Безобразные желто-грязные клыки нижней челюсти (Торчат снизу вверх)
        ctx.fillStyle = '#e9ebc4'; ctx.strokeStyle = '#223013'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(46, 92); ctx.lineTo(49, 78); ctx.lineTo(53, 93); ctx.closePath(); ctx.fill(); ctx.stroke(); // Левый клык
        ctx.beginPath(); ctx.moveTo(82, 92); ctx.lineTo(79, 78); ctx.lineTo(75, 93); ctx.closePath(); ctx.fill(); ctx.stroke(); // Правый клык

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная маска глубокой тени на левую половину лица)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
        ctx.beginPath(); ctx.moveTo(64, 25); ctx.lineTo(10, 60); ctx.lineTo(15, 128); ctx.lineTo(64, 128); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ СНЕЖНОГО ВЕЛИКАНА НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateFrostGiantAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Могучие плечи в шкурах полярного медведя
        ctx.fillStyle = '#f1f2f6'; // Белый пушистый мех
        ctx.beginPath(); ctx.moveTo(18, 128); ctx.lineTo(34, 100); ctx.lineTo(94, 100); ctx.lineTo(110, 128); ctx.fill();

        // 3. МОРДА И ЧЕРЕП (Массивный, квадратный, ледяной блок)
        ctx.fillStyle = '#7ed6df'; // Льдисто-голубая кожа титана
        ctx.beginPath();
        ctx.moveTo(44, 46); ctx.lineTo(84, 46); // Лоб
        ctx.lineTo(94, 75);  // Правая скула
        ctx.lineTo(84, 104); // Правый угол челюсти
        ctx.lineTo(44, 104); // Левый угол челюсти
        ctx.lineTo(34, 75);  // Левая скула
        ctx.closePath(); ctx.fill();

        // Каноничная заснеженная морозная борода (спускается вниз сосульками)
        ctx.fillStyle = '#dff9fb'; // Светло-бирюзовый лед
        ctx.beginPath();
        ctx.moveTo(42, 85); ctx.lineTo(32, 105); ctx.lineTo(46, 128); ctx.lineTo(82, 128); ctx.lineTo(96, 105); ctx.lineTo(86, 85);
        ctx.quadraticCurveTo(64, 96, 42, 85); ctx.closePath(); ctx.fill();

        // Морозные усы сверху
        ctx.fillStyle = '#c7ecee';
        ctx.beginPath(); ctx.moveTo(48, 83); ctx.lineTo(64, 88); ctx.lineTo(80, 83); ctx.lineTo(64, 94); ctx.closePath(); ctx.fill();

        // 4. СУРОВЫЕ СВЕТЯЩИЕСЯ ГЛАЗА (Яркий неоново-голубой морозный огонь)
        ctx.fillStyle = '#00cef7';
        ctx.beginPath(); ctx.arc(52, 60, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 60, 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; // Искры бликов
        ctx.beginPath(); ctx.arc(52.5, 59.5, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76.5, 59.5, 1, 0, Math.PI * 2); ctx.fill();

        // Тяжелые заснеженные надбровные дуги
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(43, 53); ctx.lineTo(57, 55); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(85, 53); ctx.lineTo(71, 55); ctx.stroke();

        // 5. ШЛЕМ-КОРОНА ИЗ ОСТРЫХ СОСУЛЕК (На вершине лба)
        ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#00cef7'; ctx.lineWidth = 1;
        // Левая, центральная и правая ледяные пики
        ctx.beginPath(); ctx.moveTo(44, 46); ctx.lineTo(52, 22); ctx.lineTo(58, 47); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(58, 47); ctx.lineTo(64, 14); ctx.lineTo(70, 47); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(70, 47); ctx.lineTo(76, 22); ctx.lineTo(84, 46); ctx.fill(); ctx.stroke();

        // Крупный приплюснутый нос
        ctx.strokeStyle = '#22a6b3'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(64, 60); ctx.lineTo(61, 76); ctx.lineTo(67, 76); ctx.stroke();

        // Нижний суровый оскал рта с торчащими нижними клыками
        ctx.strokeStyle = '#130f24'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(48, 88); ctx.quadraticCurveTo(64, 94, 80, 88); ctx.stroke();
        ctx.fillStyle = '#ffffff'; // Нижние белые клыки
        ctx.beginPath(); ctx.moveTo(50, 90); ctx.lineTo(53, 80); ctx.lineTo(57, 91); ctx.fill();
        ctx.beginPath(); ctx.moveTo(78, 90); ctx.lineTo(75, 80); ctx.lineTo(71, 91); ctx.fill();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная маска тени на левую половину лица великана)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath(); ctx.moveTo(64, 14); ctx.lineTo(34, 75); ctx.lineTo(46, 128); ctx.lineTo(64, 128); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ФЕРМЕРА НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateFarmerAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Плечи в простой холщовой рубахе и жилете
        ctx.fillStyle = '#f5f6fa'; // Белая рубаха
        ctx.beginPath(); ctx.moveTo(46, 105); ctx.lineTo(64, 124); ctx.lineTo(82, 105); ctx.fill();

        ctx.fillStyle = '#4a2f13'; // Простая рабочая жилетка
        ctx.beginPath(); ctx.moveTo(25, 128); ctx.lineTo(44, 105); ctx.lineTo(84, 105); ctx.lineTo(103, 128); ctx.fill();

        // 3. ЛИЦО (Загорелое, с добрыми крестьянскими усами и румянцем)
        ctx.fillStyle = '#e2a282'; // Обветренная под солнцем кожа
        ctx.beginPath();
        ctx.moveTo(46, 56); ctx.lineTo(64, 42); ctx.lineTo(82, 56);
        ctx.lineTo(84, 84); ctx.lineTo(64, 102); ctx.lineTo(44, 84);
        ctx.closePath(); ctx.fill();

        // Крестьянские густые усы под носом
        ctx.fillStyle = '#2d1f10';
        ctx.beginPath(); ctx.moveTo(50, 80); ctx.lineTo(64, 85); ctx.lineTo(78, 80); ctx.lineTo(64, 92); ctx.closePath(); ctx.fill();

        // Легкий здоровый румянец на щеках
        ctx.fillStyle = 'rgba(192, 57, 43, 0.15)';
        ctx.beginPath(); ctx.arc(48, 76, 5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(80, 76, 5, 0, Math.PI * 2); ctx.fill();

        // 4. ДОБРЫЕ КАРЫЕ ГЛАЗА И ШИРОКОПОЛАЯ СОЛОМЕННАЯ ШЛЯПА
        ctx.fillStyle = '#5c3a21'; // Карие глаза
        ctx.beginPath(); ctx.arc(53, 66, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 66, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; // Микро-блики
        ctx.beginPath(); ctx.arc(54, 65, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 65, 1, 0, Math.PI * 2); ctx.fill();

        // Аккуратные спокойные брови и нос картошкой
        ctx.strokeStyle = '#2d1f10'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(47, 59); ctx.lineTo(57, 60); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(81, 59); ctx.lineTo(71, 60); ctx.stroke();
        ctx.strokeStyle = '#c48565';
        ctx.beginPath(); ctx.moveTo(64, 58); ctx.lineTo(61, 74); ctx.lineTo(67, 74); ctx.stroke();

        // ШИРОКАЯ СОЛОМЕННАЯ ШЛЯПА (франтовато прикрывает лоб)
        ctx.fillStyle = '#f5cd79'; // Соломенный цвет
        ctx.beginPath();
        ctx.moveTo(38, 50); ctx.lineTo(64, 24); ctx.lineTo(90, 50);
        ctx.lineTo(116, 54); // Левое поле
        ctx.lineTo(64, 49);
        ctx.lineTo(12, 54); // Правое поле
        ctx.closePath(); ctx.fill();

        // Темная лента на тулье шляпы
        ctx.fillStyle = '#e67e22';
        ctx.beginPath(); ctx.moveTo(40, 48); ctx.lineTo(64, 45); ctx.lineTo(88, 48); ctx.lineTo(86, 52); ctx.lineTo(64, 49); ctx.lineTo(42, 52); ctx.closePath(); ctx.fill();

        // 5. ЗУБЬЯ СЕЛЬСКОХОЗЯЙСТВЕННЫХ ВИЛ (Парят по диагонали на переднем плане)
        ctx.strokeStyle = '#7f8c8d'; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; // Стальные острия
        ctx.beginPath(); ctx.moveTo(14, 122); ctx.lineTo(44, 92); ctx.stroke(); // Зубец 1
        ctx.beginPath(); ctx.moveTo(20, 126); ctx.lineTo(50, 96); ctx.stroke(); // Зубец 2
        ctx.beginPath(); ctx.moveTo(26, 128); ctx.lineTo(56, 98); ctx.stroke(); // Зубец 3

        // Поперечная стальная база вил
        ctx.strokeStyle = '#111622'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(12, 124); ctx.lineTo(28, 128); ctx.stroke();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная маска тени строго на левую половину лица)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.beginPath(); ctx.moveTo(64, 24); ctx.lineTo(12, 54); ctx.lineTo(26, 128); ctx.lineTo(64, 128); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ТОРГОВЦА НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateMerchantAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Плечи в дорогом парчовом камзоле
        ctx.fillStyle = '#4b1528'; // Бордовый шелк
        ctx.beginPath(); ctx.moveTo(20, 128); ctx.lineTo(38, 102); ctx.lineTo(90, 102); ctx.lineTo(108, 128); ctx.fill();

        // Золотая вышивка воротника камзола
        ctx.fillStyle = '#b89445';
        ctx.beginPath(); ctx.moveTo(46, 102); ctx.lineTo(64, 114); ctx.lineTo(82, 102); ctx.closePath(); ctx.fill();

        // 3. ЛИЦО (Зажиточное, упитанное, с ухоженной черной бородкой)
        ctx.fillStyle = '#fbc5a4';
        ctx.beginPath();
        ctx.moveTo(46, 56); ctx.lineTo(64, 42); ctx.lineTo(82, 56);
        ctx.lineTo(84, 84); ctx.lineTo(64, 102); ctx.lineTo(44, 84);
        ctx.closePath(); ctx.fill();

        // Аккуратные усы и клиновидная купеческая бородка
        ctx.fillStyle = '#1c1613';
        ctx.beginPath(); ctx.moveTo(50, 80); ctx.lineTo(64, 85); ctx.lineTo(78, 80); ctx.lineTo(64, 91); ctx.closePath(); ctx.fill(); // Усы
        ctx.beginPath(); ctx.moveTo(56, 94); ctx.lineTo(64, 102); ctx.lineTo(72, 94); ctx.closePath(); ctx.fill(); // Бородка

        // 4. ХИТРЫЕ ПРИЩУРЕННЫЕ ГЛАЗА И ДОРОГАЯ ШЕЛКОВАЯ ЧАЛМА
        ctx.fillStyle = '#10ac84'; // Изумрудные глаза с огоньком жадности
        ctx.beginPath(); ctx.ellipse(54, 66, 4.5, 1.5, -Math.PI / 16, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 66, 4.5, 1.5, Math.PI / 16, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; // Блики
        ctx.beginPath(); ctx.arc(55, 65, 0.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(73, 65, 0.8, 0, Math.PI * 2); ctx.fill();

        // Тонкие, хитро приподнятые брови и изящный нос
        ctx.strokeStyle = '#1c1613'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(46, 58); ctx.lineTo(56, 59); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(82, 58); ctx.lineTo(72, 59); ctx.stroke();

        // РОСКОШНЫЙ ТЮРБАН (ЧАЛМА)
        ctx.fillStyle = '#8e1c3c'; // Пурпурная ткань
        ctx.beginPath();
        ctx.ellipse(64, 40, 24, 15, 0, 0, Math.PI * 2); ctx.fill();
        // Складки чалмы перекрестными овалами
        ctx.fillStyle = '#a52649';
        ctx.beginPath(); ctx.ellipse(52, 40, 12, 14, Math.PI / 6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(76, 40, 12, 14, -Math.PI / 6, 0, Math.PI * 2); ctx.fill();

        // Крупный сияющий изумруд в золотой оправе по центру чалмы
        ctx.fillStyle = '#ffd875'; ctx.beginPath(); ctx.arc(64, 46, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#2ecc71'; ctx.beginPath(); ctx.arc(64, 46, 3, 0, Math.PI * 2); ctx.fill();

        // 5. ПАРИРУЮЩИЙ МЕШОК С ЗОЛОТОМ (На переднем плане справа внизу)
        ctx.fillStyle = '#af7a53'; ctx.strokeStyle = '#5c3e26'; ctx.lineWidth = 1.5; // Кожаный мешок
        ctx.beginPath();
        ctx.moveTo(90, 128);
        ctx.bezierCurveTo(72, 128, 70, 100, 84, 94);
        ctx.quadraticCurveTo(90, 88, 96, 92);
        ctx.bezierCurveTo(110, 100, 108, 128, 90, 128);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Золотые монеты, торчащие из горловины мешка
        ctx.fillStyle = '#ffd875'; ctx.strokeStyle = '#b89445'; ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.arc(84, 92, 3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(90, 90, 3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(96, 93, 3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Верёвочная завязка мешка
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(82, 96); ctx.quadraticCurveTo(88, 98, 94, 95); ctx.stroke();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная маска тени строго на левую половину лица)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.beginPath(); ctx.moveTo(64, 25); ctx.lineTo(40, 40); ctx.lineTo(44, 84); ctx.lineTo(64, 102); ctx.lineTo(64, 128); ctx.lineTo(20, 128); ctx.lineTo(38, 40); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },
    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ КУРТИЗАНКИ НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateCourtesanAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Пышная копна черных кудрявых волос
        ctx.fillStyle = '#11141a';
        ctx.beginPath();
        ctx.arc(36, 52, 22, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(92, 52, 22, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(64, 40, 20, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(24, 52, 80, 50); // Пряди сзади

        // Роскошное рубиновое платье со спущенными плечами
        ctx.fillStyle = '#b71540';
        ctx.beginPath(); ctx.moveTo(22, 128); ctx.lineTo(38, 110); ctx.lineTo(90, 110); ctx.lineTo(106, 128); ctx.fill();

        // Черное кружево на корсаже
        ctx.fillStyle = '#11141a';
        ctx.beginPath(); ctx.moveTo(46, 110); ctx.lineTo(64, 124); ctx.lineTo(82, 110); ctx.closePath(); ctx.fill();

        // Алая роза, вплетенная в локоны (справа)
        ctx.fillStyle = '#e2224c';
        ctx.beginPath(); ctx.arc(96, 42, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ff4757';
        ctx.beginPath(); ctx.arc(94, 40, 3, 0, Math.PI * 2); ctx.fill();

        // 3. ЛИЦО (Изящные женственные пропорции, томный взгляд)
        ctx.fillStyle = '#fff3e3'; // Бледная пудровая кожа
        ctx.beginPath();
        ctx.moveTo(46, 56); ctx.lineTo(64, 42); ctx.lineTo(82, 56);
        ctx.lineTo(84, 84); ctx.lineTo(64, 102); ctx.lineTo(44, 84);
        ctx.closePath(); ctx.fill();

        // Хитрый прищур фиолетовых глаз со стрелками макияжа
        ctx.fillStyle = '#8c52ff'; // Фиолетовые глаза
        ctx.beginPath(); ctx.ellipse(54, 66, 4.5, 1.8, -Math.PI / 16, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 66, 4.5, 1.8, Math.PI / 16, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; // Блики
        ctx.beginPath(); ctx.arc(55, 65, 0.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(73, 65, 0.8, 0, Math.PI * 2); ctx.fill();

        // Черные стрелки и подведенные ресницы
        ctx.strokeStyle = '#11141a'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(46, 64); ctx.lineTo(60, 67); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(82, 64); ctx.lineTo(68, 67); ctx.stroke();

        // Изящная родинка (мушка) на правой скуле
        ctx.fillStyle = '#11141a';
        ctx.beginPath(); ctx.arc(78, 74, 1.2, 0, Math.PI * 2); ctx.fill();

        // Утонченные брови и яркие пухлые алые губы
        ctx.fillStyle = '#ff4757';
        ctx.beginPath(); ctx.ellipse(64, 86, 5, 2, 0, 0, Math.PI * 2); ctx.fill();

        // Аккуратный носик
        ctx.strokeStyle = '#e2b391'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 58); ctx.lineTo(62, 76); ctx.lineTo(66, 76); ctx.stroke();

        // 4. РАСКРЫТЫЙ КРУЖЕВНОЙ ВЕЕР НА ПЕРЕДНЕМ ПЛАНЕ (Слева внизу, кокетливо прикрывает шею)
        ctx.fillStyle = '#2c1e3d'; ctx.strokeStyle = '#e84393'; ctx.lineWidth = 1; // Остов веера
        ctx.save();
        ctx.beginPath(); ctx.moveTo(12, 128); ctx.lineTo(48, 92); ctx.lineTo(58, 102); ctx.lineTo(16, 128); ctx.closePath(); ctx.fill(); ctx.stroke();

        // Тонкое кружевное плетение на веере
        ctx.strokeStyle = '#f78fb3'; ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.moveTo(14, 115); ctx.lineTo(46, 98); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(15, 105); ctx.lineTo(38, 93); ctx.stroke();
        ctx.restore();

        // 5. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная маска тени строго на левую половину лица)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.beginPath(); ctx.moveTo(64, 24); ctx.lineTo(40, 52); ctx.lineTo(42, 84); ctx.lineTo(64, 102); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ОХОТНИКА НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateHunterAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Плечи в плотной кожаной куртке с ремнями портупеи
        ctx.fillStyle = '#2c221e'; // Кожаная куртка
        ctx.beginPath(); ctx.moveTo(25, 128); ctx.lineTo(44, 105); ctx.lineTo(84, 105); ctx.lineTo(103, 128); ctx.fill();

        // Разгрузочный ремень через плечо
        ctx.fillStyle = '#1c1410';
        ctx.beginPath(); ctx.moveTo(38, 105); ctx.lineTo(54, 128); ctx.lineTo(62, 128); ctx.lineTo(44, 105); ctx.closePath(); ctx.fill();

        // 3. ЛИЦО (Загорелое, со шрамом и суровой густой охотничьей бородой)
        ctx.fillStyle = '#ca8f6c'; // Лицо
        ctx.beginPath();
        ctx.moveTo(46, 56); ctx.lineTo(64, 42); ctx.lineTo(82, 56);
        ctx.lineTo(84, 84); ctx.lineTo(64, 102); ctx.lineTo(44, 84);
        ctx.closePath(); ctx.fill();

        // Массивная окладистая темно-каштановая борода и усы
        ctx.fillStyle = '#1c130e';
        ctx.beginPath(); ctx.moveTo(44, 78); ctx.lineTo(32, 98); ctx.lineTo(48, 124); ctx.lineTo(80, 124); ctx.lineTo(96, 98); ctx.lineTo(84, 78); ctx.quadraticCurveTo(64, 88, 44, 78); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(48, 76); ctx.lineTo(64, 81); ctx.lineTo(80, 76); ctx.lineTo(64, 87); ctx.closePath(); ctx.fill(); // Усы

        // 4. СУРОВЫЙ ПРИЩУР И ТЯЖЕЛАЯ МЕХОВАЯ ШАПКА
        ctx.fillStyle = '#ffffff'; // Правый сфокусированный глаз
        ctx.beginPath(); ctx.ellipse(72, 66, 4, 1.3, Math.PI / 16, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#d35400'; // Янтарный зрачок следопыта
        ctx.beginPath(); ctx.arc(72, 66, 1.2, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#1c130e'; ctx.lineWidth = 1.5; // Левый глаз сильно прищурен
        ctx.beginPath(); ctx.moveTo(48, 67); ctx.quadraticCurveTo(54, 64, 58, 67); ctx.stroke();

        // Тонкий шрам, пересекающий бровь
        ctx.strokeStyle = '#a62b2b'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(44, 52); ctx.lineTo(50, 70); ctx.stroke();

        // МАССИВНАЯ ТАЕЖНАЯ ШАПКА-УШАНКА (Низко надвинута на лоб)
        ctx.fillStyle = '#4a3b32'; // Базовый мех шапки
        ctx.beginPath();
        ctx.moveTo(38, 52); ctx.lineTo(64, 26); ctx.lineTo(90, 52);
        ctx.lineTo(86, 62); ctx.lineTo(64, 57); ctx.lineTo(44, 62);
        ctx.closePath(); ctx.fill();

        // Опущенные меховые уши ушанки по бокам
        ctx.fillRect(36, 52, 8, 20);
        ctx.fillRect(84, 52, 8, 20);

        // Крупный нос
        ctx.strokeStyle = '#af755a'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 60); ctx.lineTo(62, 75); ctx.lineTo(66, 75); ctx.stroke();

        // 5. ЗУБАСТЫЙ СТАЛЬНОЙ КАПКАН (Парит на переднем плане слева внизу)
        ctx.strokeStyle = '#7f8c8d'; ctx.lineWidth = 3; ctx.lineCap = 'round'; // Дуги капкана
        ctx.save();
        ctx.beginPath(); ctx.arc(32, 108, 14, Math.PI * 0.2, Math.PI * 1.3); ctx.stroke();

        // Острые flat-зубья ловушки
        ctx.fillStyle = '#57606f';
        ctx.beginPath(); ctx.moveTo(22, 98); ctx.lineTo(26, 92); ctx.lineTo(28, 100); ctx.fill();
        ctx.beginPath(); ctx.moveTo(34, 95); ctx.lineTo(38, 89); ctx.lineTo(40, 97); ctx.fill();

        // Мощная центральная пружина капкана
        ctx.strokeStyle = '#2f3542'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(14, 116); ctx.lineTo(44, 112); ctx.stroke();
        ctx.restore();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная тень на левую половину лица)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath(); ctx.moveTo(64, 26); ctx.lineTo(38, 52); ctx.lineTo(32, 98); ctx.lineTo(46, 128); ctx.lineTo(64, 128); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },
    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ТЯЖЕЛОГО ВОИНА НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateHeavyWarriorAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Мощные латные наплечники
        ctx.fillStyle = '#2f3542'; // Базовая сталь лат
        ctx.beginPath(); ctx.moveTo(20, 128); ctx.lineTo(36, 96); ctx.lineTo(92, 96); ctx.lineTo(108, 128); ctx.fill();

        // Геральдический воротник (горжет) с золотыми заклепками
        ctx.fillStyle = '#b89445';
        ctx.beginPath(); ctx.moveTo(44, 98); ctx.lineTo(54, 88); ctx.lineTo(74, 88); ctx.lineTo(84, 98); ctx.closePath(); ctx.fill();

        // 3. СТАЛЬНОЙ ШЛЕМ-БАЦИНЕТ С НАНОСНИКОМ
        ctx.fillStyle = '#718093'; // Очищенный благородный металл
        ctx.beginPath();
        ctx.moveTo(42, 46); ctx.lineTo(64, 30); ctx.lineTo(86, 46);
        ctx.lineTo(84, 82); ctx.lineTo(64, 98); ctx.lineTo(44, 82);
        ctx.closePath(); ctx.fill();

        // Центральная вертикальная грань шлема (световое ребро)
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(64, 30); ctx.lineTo(64, 98); ctx.stroke();

        // 4. ТЕМНЫЕ ГЛАЗНЫЕ ПРОРЕЗИ И СТАЛЬНОЙ УГРЮМЫЙ ВЗГЛЯД
        ctx.fillStyle = '#1c2025'; // Внутренность шлема
        ctx.beginPath(); ctx.ellipse(54, 54, 7, 2, -Math.PI / 18, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 54, 7, 2, Math.PI / 18, 0, Math.PI * 2); ctx.fill();

        // Светящиеся серые/холодные зрачки опытного бойца
        ctx.fillStyle = '#ced6e0';
        ctx.beginPath(); ctx.arc(54, 54, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 54, 1.5, 0, Math.PI * 2); ctx.fill();

        // Поперечные дыхательные прорези на забрале (перфорация стали)
        ctx.fillStyle = '#1c2025';
        ctx.fillRect(49, 72, 10, 1.5);
        ctx.fillRect(69, 72, 10, 1.5);
        ctx.fillRect(52, 78, 7, 1.5);
        ctx.fillRect(69, 78, 7, 1.5);

        // 5. КРУГЛЫЙ СТАЛЬНОЙ ЩИТ С УМБОНОМ (Парит по центру снизу, перекрывая латы)
        ctx.fillStyle = '#57606f'; ctx.strokeStyle = '#2f3542'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(64, 118, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Центральная выпуклая бляха щита (Умбон)
        ctx.fillStyle = '#718093'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(64, 118, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Стальные заклепки по окружности обода щита
        ctx.fillStyle = '#ffffff';
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
            const zx = 64 + 16 * Math.cos(a);
            const zy = 118 + 16 * Math.sin(a);
            ctx.beginPath(); ctx.arc(zx, zy, 1.2, 0, Math.PI * 2); ctx.fill();
        }

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная маска тени строго на левую половину токена)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 30); ctx.lineTo(42, 46); ctx.lineTo(44, 82); ctx.lineTo(64, 98);
        ctx.lineTo(64, 128); ctx.lineTo(20, 128); ctx.lineTo(36, 46);
        ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },
    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ БОЕВОЙ ЖРИЦЫ НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateBattlePriestessAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Длинные белые волосы и тяжелые стальные наплечники
        ctx.fillStyle = '#cbd5e1'; // Серебряно-белые волосы на фоне
        ctx.beginPath(); ctx.moveTo(35, 75); ctx.lineTo(22, 128); ctx.lineTo(106, 128); ctx.lineTo(93, 75); ctx.fill();

        ctx.fillStyle = '#4b5563'; // Монолитный стальной доспех
        ctx.beginPath(); ctx.moveTo(20, 128); ctx.lineTo(38, 100); ctx.lineTo(92, 100); ctx.lineTo(108, 128); ctx.fill();

        // Позолоченные латные наплечники
        ctx.fillStyle = '#d4af37';
        ctx.beginPath(); ctx.arc(32, 115, 12, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(96, 115, 12, 0, Math.PI * 2); ctx.fill();

        // 3. ЛИЦО (Изящные, но суровые женственные пропорции и боевой раскрас)
        ctx.fillStyle = '#fff3e3'; // Светлая кожа
        ctx.beginPath();
        ctx.moveTo(46, 54); ctx.lineTo(64, 38); ctx.lineTo(82, 54);
        ctx.lineTo(80, 82); ctx.lineTo(64, 100); ctx.lineTo(48, 82);
        ctx.closePath(); ctx.fill();

        // Синий ритуальный раскрас инквизитора (крест/полосы на щеках)
        ctx.strokeStyle = '#2980b9'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(50, 72); ctx.lineTo(46, 82); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(78, 72); ctx.lineTo(82, 82); ctx.stroke();

        // Пряди волос у лица
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.moveTo(46, 38); ctx.quadraticCurveTo(42, 60, 44, 80); ctx.lineTo(48, 78); ctx.quadraticCurveTo(46, 58, 49, 42); ctx.fill();
        ctx.beginPath(); ctx.moveTo(82, 38); ctx.quadraticCurveTo(86, 60, 84, 80); ctx.lineTo(80, 78); ctx.quadraticCurveTo(82, 58, 79, 42); ctx.fill();

        // 4. СТАЛЬНОЙ ВЗГЛЯД И РЫЦАРСКИЙ КАНТ-ОБОДОК НА ЛОБ
        ctx.fillStyle = '#ffffff'; // Белки
        ctx.beginPath(); ctx.ellipse(54, 64, 4, 1.5, -Math.PI / 16, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 64, 4, 1.5, Math.PI / 16, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#00cef7'; // Светящаяся небесная радужка
        ctx.beginPath(); ctx.arc(54, 64, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 64, 1.3, 0, Math.PI * 2); ctx.fill();

        // Тонкие брови и решительные губы
        ctx.strokeStyle = '#4b5563'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(47, 58); ctx.lineTo(57, 59); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(81, 58); ctx.lineTo(71, 59); ctx.stroke();
        ctx.fillStyle = '#e77f7f'; ctx.beginPath(); ctx.ellipse(64, 84, 4.5, 1.2, 0, 0, Math.PI * 2); ctx.fill();

        // Стальная диадема шлема с золотыми крылышками по бокам
        ctx.fillStyle = '#718093'; ctx.beginPath(); ctx.fillRect(47, 42, 34, 5);
        ctx.fillStyle = '#ffd875'; // Крылья веры на висках шлема
        ctx.beginPath(); ctx.moveTo(47, 42); ctx.lineTo(34, 30); ctx.lineTo(44, 45); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(81, 42); ctx.lineTo(94, 30); ctx.lineTo(84, 45); ctx.closePath(); ctx.fill();

        // Нос
        ctx.strokeStyle = '#ebd2b7'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 60); ctx.lineTo(62, 76); ctx.lineTo(66, 76);
        ctx.stroke();

        // 5. МАССИВНЫЙ СВЯЩЕННЫЙ БОЕВОЙ МОЛОТ (Парит на переднем плане по диагонали слева направо)
        ctx.save();
        ctx.fillStyle = '#718093'; ctx.strokeStyle = '#2f3542'; ctx.lineWidth = 1.5; // Индстрал сталь бойка
        // Прямоугольное массивное ковано-рубленое навершие молота
        ctx.beginPath(); ctx.roundRect(14, 86, 26, 16, 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ffd875'; // Золотой выгравированный крест на молоте
        ctx.fillRect(24, 88, 6, 12); ctx.fillRect(20, 91, 14, 6);

        // Длинная стальная рукоять боевого чекана
        ctx.strokeStyle = '#dcdde1'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(27, 98); ctx.lineTo(56, 128); ctx.stroke();
        ctx.restore();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная маска тени строго на левую половину лица)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.beginPath(); ctx.moveTo(64, 24); ctx.lineTo(38, 54); ctx.lineTo(42, 82); ctx.lineTo(64, 100); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ВОЛШЕБНИЦЫ НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateWizardessAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Плечи в мантии и длинные платиновые волосы
        ctx.fillStyle = '#1e1135'; // Темно-фиолетовая мантия
        ctx.beginPath(); ctx.moveTo(20, 128); ctx.lineTo(38, 102); ctx.lineTo(90, 102); ctx.lineTo(108, 128); ctx.fill();

        ctx.fillStyle = '#f1f2f6'; // Шлейф платиновых волос сзади
        ctx.beginPath(); ctx.moveTo(35, 75); ctx.lineTo(24, 128); ctx.lineTo(104, 128); ctx.lineTo(93, 75); ctx.fill();

        // 3. ЛИЦО (Утонченные, изящные пропорции, мистический макияж)
        ctx.fillStyle = '#fff3e3'; // Светлая кожа
        ctx.beginPath();
        ctx.moveTo(46, 54); ctx.lineTo(64, 38); ctx.lineTo(82, 54);
        ctx.lineTo(80, 82); ctx.lineTo(64, 100); ctx.lineTo(48, 82);
        ctx.closePath(); ctx.fill();

        // Передние локоны волос, обрамляющие лицо
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.moveTo(46, 38); ctx.quadraticCurveTo(42, 65, 45, 84); ctx.lineTo(49, 82); ctx.quadraticCurveTo(47, 62, 50, 42); ctx.fill();
        ctx.beginPath(); ctx.moveTo(82, 38); ctx.quadraticCurveTo(86, 65, 83, 84); ctx.lineTo(79, 82); ctx.quadraticCurveTo(81, 62, 78, 42); ctx.fill();

        // 4. ТАИНСТВЕННЫЙ ВЗГЛЯД И ШЕЛКОВЫЙ КАПЮШОН ЧАРОДЕЙКИ
        ctx.fillStyle = '#a55eea'; // Светящийся неоново-фиолетовый взгляд магии
        ctx.beginPath(); ctx.ellipse(54, 64, 4.5, 1.8, -Math.PI / 16, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 64, 4.5, 1.8, Math.PI / 16, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; // Блики силы
        ctx.beginPath(); ctx.arc(55, 63.5, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(73, 63.5, 1, 0, Math.PI * 2); ctx.fill();

        // Тонкие брови и аккуратные фиолетовые губы
        ctx.strokeStyle = '#4a2f13'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(48, 58); ctx.lineTo(58, 59); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(80, 58); ctx.lineTo(70, 59); ctx.stroke();
        ctx.fillStyle = '#9b59b6'; ctx.beginPath(); ctx.ellipse(64, 84, 4.5, 1.5, 0, 0, Math.PI * 2); ctx.fill();

        // Нос
        ctx.strokeStyle = '#ebd2b7'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 60); ctx.lineTo(62, 76); ctx.lineTo(66, 76); ctx.stroke();

        // ГЛУБОКИЙ КАПЮШОН-КАПОР (С золотой каймой)
        ctx.fillStyle = '#31144c'; // Внешняя ткань капюшона
        ctx.beginPath();
        ctx.moveTo(38, 52); ctx.lineTo(64, 24); ctx.lineTo(90, 52);
        ctx.lineTo(86, 68); ctx.lineTo(64, 61); ctx.lineTo(42, 68);
        ctx.closePath(); ctx.fill();

        ctx.fillStyle = '#210c36'; // Внутренняя тень ткани вокруг лба
        ctx.beginPath(); ctx.moveTo(42, 68); ctx.lineTo(64, 61); ctx.lineTo(86, 68); ctx.lineTo(64, 48); ctx.closePath(); ctx.fill();

        // Золотая вышивка-кайма на капюшоне
        ctx.strokeStyle = '#ffd875'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(40, 56); ctx.lineTo(64, 28); ctx.lineTo(88, 56); ctx.stroke();

        // 5. ПАРИРУЮЩИЙ МАГИЧЕСКИЙ КРИСТАЛЛ (Парит по центру внизу, заливая воротник лазурным светом)
        ctx.fillStyle = 'rgba(0, 206, 247, 0.25)'; // Внешний ореол свечения
        ctx.beginPath(); ctx.arc(64, 102, 12, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#00cef7'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1;
        // Ограненный ромб кристалла
        ctx.beginPath();
        ctx.moveTo(64, 90);  // Верхний пик
        ctx.lineTo(72, 102); // Правый угол
        ctx.lineTo(64, 114); // Нижний пик
        ctx.lineTo(56, 102); // Левый угол
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Внутренние грани кристалла для эффекта огранки
        ctx.beginPath(); ctx.moveTo(64, 90); ctx.lineTo(64, 114); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(56, 102); ctx.lineTo(72, 102); ctx.stroke();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная маска тени строго на левую половину лица)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.beginPath(); ctx.moveTo(64, 24); ctx.lineTo(38, 52); ctx.lineTo(42, 82); ctx.lineTo(64, 100); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ДВАРФА-ПАЛАДИНА БЕЗ ШЛЕМA НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateDwarfPaladinAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Мощные стальные латные наплечники
        ctx.fillStyle = '#57606f';
        ctx.beginPath(); ctx.moveTo(20, 128); ctx.lineTo(36, 100); ctx.lineTo(92, 100); ctx.lineTo(108, 128); ctx.fill();

        // Золотой рыцарский горжет (воротник лат)
        ctx.fillStyle = '#b89445';
        ctx.beginPath(); ctx.moveTo(42, 98); ctx.lineTo(54, 88); ctx.lineTo(74, 88); ctx.lineTo(84, 98); ctx.closePath(); ctx.fill();

        // 3. ЛИЦО (Широкое, суровое, дварфийской квадратной формы)
        ctx.fillStyle = '#d39e82';
        ctx.beginPath();
        ctx.moveTo(42, 54); ctx.lineTo(86, 54); ctx.lineTo(84, 86);
        ctx.lineTo(64, 104); ctx.lineTo(44, 86); ctx.closePath(); ctx.fill();

        // 4. ДВАРФИЙСКАЯ ОСКЛАДИСТАЯ РЫЖАЯ БОРОДА (Перекрывает нижнюю часть лица)
        ctx.fillStyle = '#e67e22'; // Пышный рыжий мех бороды паладина
        ctx.beginPath();
        ctx.moveTo(42, 78); ctx.lineTo(32, 102); ctx.lineTo(44, 128); ctx.lineTo(84, 128); ctx.lineTo(96, 102); ctx.lineTo(84, 78);
        ctx.quadraticCurveTo(64, 90, 42, 78); ctx.closePath(); ctx.fill();

        // Усы (Тяжелые накладные плашки)
        ctx.fillStyle = '#d65d11';
        ctx.beginPath(); ctx.moveTo(48, 79); ctx.lineTo(64, 84); ctx.lineTo(80, 79); ctx.lineTo(64, 91); ctx.closePath(); ctx.fill();

        // Серебряные зажимы-кольца на косах бороды внизу
        ctx.fillStyle = '#718093';
        ctx.fillRect(44, 118, 8, 5); ctx.fillRect(76, 118, 8, 5);

        // 5. СВЕТЯЩИЕСЯ ГЛАЗА ВЕРЫ И ЗОЛОТАЯ ДИДЕМA ТАНА (БЕЗ ШЛЕМA)
        ctx.fillStyle = '#00cef7'; // Небесно-голубой праведный взгляд
        ctx.beginPath(); ctx.arc(52, 66, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 66, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(52.8, 65.2, 0.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76.8, 65.2, 0.8, 0, Math.PI * 2); ctx.fill();

        // Густые суровые рыжие брови, сдвинутые к носу
        ctx.fillStyle = '#d65d11';
        ctx.fillRect(44, 58, 16, 4); ctx.fillRect(68, 58, 16, 4);

        // Крупный дварфийский нос картошкой
        ctx.fillStyle = '#c2856a';
        ctx.beginPath(); ctx.arc(64, 72, 6, 0, Math.PI * 2); ctx.fill();

        // ЗОЛОТАЯ РЫЦАРСКАЯ ДИАДЕМА (Венец веры прямо на лбу вместо шлема)
        ctx.fillStyle = '#ffd875'; ctx.strokeStyle = '#b89445'; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(42, 54); ctx.lineTo(64, 46); ctx.lineTo(86, 54); ctx.lineTo(82, 50); ctx.lineTo(64, 42); ctx.lineTo(46, 50);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Сияющий рубин в центре венца паладина
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath(); ctx.arc(64, 44, 2, 0, Math.PI * 2); ctx.fill();

        // 6. СВЯТОЙ МАЛЕНЬКИЙ ЩИТ ИЛИ СИМВОЛ СОЛНЦА (Парит по центру внизу, перекрывая бороду)
        ctx.fillStyle = '#ffd875'; ctx.strokeStyle = '#b89445'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(64, 110, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Икона сияющего солнца внутри священного символа ордена
        ctx.fillStyle = '#e67e22';
        ctx.beginPath(); ctx.arc(64, 110, 5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#e67e22'; ctx.lineWidth = 1.5;
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
            ctx.beginPath(); ctx.moveTo(64, 110); ctx.lineTo(64 + 9 * Math.cos(a), 110 + 9 * Math.sin(a)); ctx.stroke();
        }

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная тень на левую половину токена)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.beginPath(); ctx.moveTo(64, 42); ctx.lineTo(42, 54); ctx.lineTo(32, 102); ctx.lineTo(44, 128); ctx.lineTo(64, 128); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ОРКА-ВОИНА НА CANVAS (ОТКРЫТЫЙ ШЛЕМ И ТОПОР НАИСКОСОК)
     * Возвращает строку Data-URL для мгновенного рендеринга
     */
    generateOrcWarriorAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЗАДНИЙ ПЛАН: Мощная шея и тяжелые стальные наплечники
        ctx.fillStyle = '#1e3d24'; // Зеленая шея в тени
        ctx.beginPath(); ctx.moveTo(45, 90); ctx.lineTo(30, 128); ctx.lineTo(98, 128); ctx.lineTo(83, 90); ctx.fill();

        ctx.fillStyle = '#2f3542'; // Грубый кованый доспех
        ctx.beginPath(); ctx.moveTo(18, 128); ctx.lineTo(36, 100); ctx.lineTo(92, 100); ctx.lineTo(110, 128); ctx.fill();

        // 3. ОТКРЫТОЕ СВИРЕПОЕ ЛИЦО ОРКА (Смугло-зеленая кожа, боевой раскрас и шрамы)
        ctx.fillStyle = '#2d5a37'; // Базовый зеленый цвет лица
        ctx.beginPath();
        ctx.moveTo(42, 54); ctx.lineTo(64, 38); ctx.lineTo(86, 54);
        ctx.lineTo(84, 86); ctx.lineTo(64, 104); ctx.lineTo(44, 86);
        ctx.closePath(); ctx.fill();

        // Огромные торчащие клыки нижней челюсти
        ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#162b1a'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(44, 88); ctx.lineTo(40, 70); ctx.lineTo(50, 89); ctx.closePath(); ctx.fill(); ctx.stroke(); // Левый
        ctx.beginPath(); ctx.moveTo(84, 88); ctx.lineTo(88, 70); ctx.lineTo(78, 89); ctx.closePath(); ctx.fill(); ctx.stroke(); // Правый

        // Линия рта в яростном оскале
        ctx.strokeStyle = '#162b1a'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(48, 86); ctx.quadraticCurveTo(64, 92, 80, 86); ctx.stroke();

        // Яростный багровый прищур глаз (Взгляд орка)
        ctx.fillStyle = '#ffffff'; // Белки
        ctx.beginPath(); ctx.ellipse(54, 64, 4.5, 1.5, -Math.PI / 16, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 64, 4.5, 1.5, Math.PI / 16, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#e74c3c'; // Багровые зрачки
        ctx.beginPath(); ctx.arc(54, 64, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 64, 1.5, 0, Math.PI * 2); ctx.fill();

        // Тяжелые, надменные брови дугами
        ctx.strokeStyle = '#162b1a'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(46, 57); ctx.lineTo(58, 60); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(82, 57); ctx.lineTo(70, 60); ctx.stroke();

        // Ритуальный шрам на щеке орка
        ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(46, 72); ctx.lineTo(52, 82); ctx.stroke();

        // Широкий приплюснутый нос
        ctx.strokeStyle = '#1d3d23'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(64, 60); ctx.lineTo(61, 75); ctx.lineTo(67, 75); ctx.stroke();

        // 4. ТЯЖЁЛЫЙ СТАЛЬНОЙ ОТКРЫТЫЙ ШЛЕМ С НАНОСНИКОМ И РОГАМИ
        ctx.fillStyle = '#57606f'; // Обруч открытого шлема
        ctx.beginPath();
        ctx.moveTo(40, 52); ctx.lineTo(64, 34); ctx.lineTo(88, 52);
        ctx.lineTo(84, 58); ctx.lineTo(64, 54); ctx.lineTo(44, 58); // Стрела наносника
        ctx.closePath(); ctx.fill();

        // Тонкий стальной носовой козырек, спускающийся по центру вниз
        ctx.fillRect(62.5, 54, 3, 16);

        // Грубые рога, прикрученные к бокам шлема (загнуты вверх)
        ctx.fillStyle = '#dcdde1'; ctx.strokeStyle = '#2f3542'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(40, 48); ctx.lineTo(24, 32); ctx.lineTo(38, 50); ctx.closePath(); ctx.fill(); ctx.stroke(); // Левый рог
        ctx.beginPath(); ctx.moveTo(88, 48); ctx.lineTo(104, 32); ctx.lineTo(90, 50); ctx.closePath(); ctx.fill(); ctx.stroke(); // Правый рог

        // 5. МАССИВНЫЙ БОЕВОЙ ТОПОР СЕКИРА НАИСКОСОК (Пересекает картинку по диагонали)
        ctx.save();
        // Разворачиваем холст, чтобы отрисовать топор под идеальным углом
        ctx.translate(64, 96);
        ctx.rotate((Math.PI / 180) * -25); // Завал топора наискосок влево-вверх
        ctx.translate(-64, -96);

        // Деревянное толстое древко топора
        ctx.strokeStyle = '#5c3e26'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(64, 60); ctx.lineTo(64, 128); ctx.stroke();

        // Тяжелое стальное лезвие кованой секиры орды (двухлезвийный топор)
        ctx.fillStyle = '#718093'; ctx.strokeStyle = '#2f3542'; ctx.lineWidth = 1.5;
        // Левое полукруглое лезвие
        ctx.beginPath(); ctx.moveTo(61, 74); ctx.quadraticCurveTo(34, 68, 30, 88); ctx.quadraticCurveTo(46, 98, 61, 92); ctx.closePath(); ctx.fill(); ctx.stroke();
        // Правое полукруглое лезвие
        ctx.beginPath(); ctx.moveTo(67, 74); ctx.quadraticCurveTo(94, 68, 98, 88); ctx.quadraticCurveTo(82, 98, 67, 92); ctx.closePath(); ctx.fill(); ctx.stroke();

        // Серебряная режущая кромка-заточка топора
        ctx.fillStyle = '#dcdde1';
        ctx.beginPath(); ctx.moveTo(30, 88); ctx.quadraticCurveTo(46, 98, 61, 92); ctx.lineTo(61, 88); ctx.quadraticCurveTo(44, 93, 32, 85); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(98, 88); ctx.quadraticCurveTo(82, 98, 67, 92); ctx.lineTo(67, 88); ctx.quadraticCurveTo(84, 93, 96, 85); ctx.closePath(); ctx.fill();

        // Стальное острие-навершие
        ctx.fillStyle = '#718093';
        ctx.beginPath(); ctx.moveTo(61, 74); ctx.lineTo(64, 62); ctx.lineTo(67, 74); ctx.closePath(); ctx.fill();
        ctx.restore();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная маска глубокой тени на левую половину токена)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
        ctx.beginPath(); ctx.moveTo(64, 12); ctx.lineTo(24, 32); ctx.lineTo(18, 128); ctx.lineTo(64, 128); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },


};

export default InitiativeManager;
