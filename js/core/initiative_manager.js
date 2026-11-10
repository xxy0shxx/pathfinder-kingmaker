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
        } else if (avatarType === 'violet_mushroom') {
            unit.avatar = this.generateVioletMushroomAvatarDataUrl();
        } else if (avatarType === 'townsman') {
            unit.avatar = this.generateTownsmanAvatarDataUrl();
        } else if (avatarType === 'townswoman') {
            unit.avatar = this.generateTownswomanAvatarDataUrl();
        } else if (avatarType === 'elder') {
            unit.avatar = this.generateElderAvatarDataUrl();
        } else if (avatarType === 'faerie_dragon') {
            unit.avatar = this.generateFaerieDragonAvatarDataUrl();
        } else if (avatarType === 'zombie') {
            unit.avatar = this.generateZombieAvatarDataUrl();
        } else if (avatarType === 'skeleton') {
            unit.avatar = this.generateSkeletonAvatarDataUrl();
        } else if (avatarType === 'guard') {
            unit.avatar = this.generateGuardAvatarDataUrl();
        } else if (avatarType === 'boggard') {
            unit.avatar = this.generateBoggardAvatarDataUrl();
        } else if (avatarType === 'skeleton_warrior') {
            unit.avatar = this.generateSkeletonWarriorAvatarDataUrl();
        } else if (avatarType === 'hag') {
            unit.avatar = this.generateHagAvatarDataUrl();
        } else if (avatarType === 'giant_rat') {
            unit.avatar = this.generateGiantRatAvatarDataUrl();
        } else if (avatarType === 'satyr_dryad') {
            unit.avatar = this.generateSatyrDryadAvatarDataUrl();
        } else if (avatarType === 'warg') {
            unit.avatar = this.generateWargAvatarDataUrl();
        } else if (avatarType === 'ogre') {
            unit.avatar = this.generateOgreAvatarDataUrl();
        } else if (avatarType === 'manticore') {
            unit.avatar = this.generateManticoreAvatarDataUrl();
        } else if (avatarType === 'ambush_spider') {
            unit.avatar = this.generateAmbushSpiderAvatarDataUrl();
        } else if (avatarType === 'black_roc') {
            unit.avatar = this.generateBlackRocAvatarDataUrl();
        } else if (avatarType === 'cyclops_skeleton') {
            unit.avatar = this.generateCyclopsSkeletonAvatarDataUrl();
        } else if (avatarType === 'grey_mammoth') {
            unit.avatar = this.generateGreyMammothAvatarDataUrl();
        } else if (avatarType === 'death_knight') {
            unit.avatar = this.generateDeathKnightAvatarDataUrl();
        } else if (avatarType === 'lizardfolk') {
            unit.avatar = this.generateLizardfolkAvatarDataUrl();
        } else if (avatarType === 'green_ooze') {
            unit.avatar = this.generateGreenOozeAvatarDataUrl();
        } else if (avatarType === 'boggard_priest') {
            unit.avatar = this.generateBoggardPriestAvatarDataUrl();
        } else if (avatarType === 'bandit_queen') {
            unit.avatar = this.generateBanditQueenAvatarDataUrl();
        } else if (avatarType === 'owlbear') {
            unit.avatar = this.generateOwlbearAvatarDataUrl();
        } else if (avatarType === 'grigory') {
            unit.avatar = this.generateGrigoryAvatarDataUrl();
        } else if (avatarType === 'prazil') {
            unit.avatar = this.generatePrazilAvatarDataUrl();
        } else if (avatarType === 'bloom_wyvern') {
            unit.avatar = this.generateBloomWyvernAvatarDataUrl();
        } else if (avatarType === 'thylacine') {
            unit.avatar = this.generateThylacineAvatarDataUrl();
        } else if (avatarType === 'mind_flayer') {
            unit.avatar = this.generateMindFlayerAvatarDataUrl();
        } else if (avatarType === 'hunter_spider') {
            unit.avatar = this.generateHunterSpiderAvatarDataUrl();
        } else if (avatarType === 'tabaxi_monk') {
            unit.avatar = this.generateTabaxiMonkAvatarDataUrl();
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
                            <option value="thylacine" ${unit.avatarType === 'thylacine' ? 'selected' : ''}>🐺🐯Тилацин</option>
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
                            <option value="owlbear" ${unit.avatarType === 'owlbear' ? 'selected' : ''}>🦉🐻Медвесыч</option>
                            <option value="orc" ${unit.avatarType === 'orc' ? 'selected' : ''}>👹Орк</option>
                            <option value="troll" ${unit.avatarType === 'troll' ? 'selected' : ''}>👹Болотный Тролль</option>
                            <option value="dragon" ${unit.avatarType === 'dragon' ? 'selected' : ''}>🐲Древний Дракон</option>
                            <option value="violet_mushroom" ${unit.avatarType === 'violet_mushroom' ? 'selected' : ''}>🍄Фиолетовый Гриб</option>
                            <option value="townsman" ${unit.avatarType === 'townsman' ? 'selected' : ''}>👱Горожанин</option>
                            <option value="townswoman" ${unit.avatarType === 'townswoman' ? 'selected' : ''}>👩Горожанка</option>
                            <option value="elder" ${unit.avatarType === 'elder' ? 'selected' : ''}>👴Старец</option>
                            <option value="faerie_dragon" ${unit.avatarType === 'faerie_dragon' ? 'selected' : ''}>🦋🐉Волшебный Дракончик</option>
                            <option value="zombie" ${unit.avatarType === 'zombie' ? 'selected' : ''}>🧟Зомби</option>
                            <option value="skeleton" ${unit.avatarType === 'skeleton' ? 'selected' : ''}>💀Скелет</option>
                            <option value="guard" ${unit.avatarType === 'guard' ? 'selected' : ''}>💂Городской Стражник</option>
                            <option value="boggard" ${unit.avatarType === 'boggard' ? 'selected' : ''}>🐸🦎Жаболюд</option>
                            <option value="skeleton_warrior" ${unit.avatarType === 'skeleton_warrior' ? 'selected' : ''}>⚔️💀Скелет-Воин</option>
                            <option value="hag" ${unit.avatarType === 'hag' ? 'selected' : ''}>🧙‍♀️Болотная Карга</option>
                            <option value="giant_rat" ${unit.avatarType === 'giant_rat' ? 'selected' : ''}>🐀Гигантская Крыса</option>
                            <option value="satyr_dryad" ${unit.avatarType === 'satyr_dryad' ? 'selected' : ''}>🐐🌿Дриада-Сатир</option>
                            <option value="warg" ${unit.avatarType === 'warg' ? 'selected' : ''}>🐺🔥Варг</option>
                            <option value="ogre" ${unit.avatarType === 'ogre' ? 'selected' : ''}>🏏👹Огр с дубиной</option>
                            <option value="manticore" ${unit.avatarType === 'manticore' ? 'selected' : ''}>🦁🦂Мантикора</option>
                            <option value="ambush_spider" ${unit.avatarType === 'ambush_spider' ? 'selected' : ''}>🌿🕷️Паук-Людоед</option>
                            <option value="black_roc" ${unit.avatarType === 'black_roc' ? 'selected' : ''}>🦅🖤Птица-Рух</option>
                            <option value="cyclops_skeleton" ${unit.avatarType === 'cyclops_skeleton' ? 'selected' : ''}>👁️💀Скелет-Циклоп</option>
                            <option value="grey_mammoth" ${unit.avatarType === 'grey_mammoth' ? 'selected' : ''}>🦣Серый Мамонт</option>
                            <option value="death_knight" ${unit.avatarType === 'death_knight' ? 'selected' : ''}>👑💀Рыцарь Смерти</option>
                            <option value="lizardfolk" ${unit.avatarType === 'lizardfolk' ? 'selected' : ''}>🐊🛡️Людоящер</option>
                            <option value="green_ooze" ${unit.avatarType === 'green_ooze' ? 'selected' : ''}>🦠💚Зелёная Жижа</option>
                            <option value="boggard_priest" ${unit.avatarType === 'boggard_priest' ? 'selected' : ''}>🐸🔮Боггард-Жрец</option>
                            <option value="bandit_queen" ${unit.avatarType === 'bandit_queen' ? 'selected' : ''}>🪓🏴‍☠️Атаманша</option>
                            <option value="grigory" ${unit.avatarType === 'grigory' ? 'selected' : ''}>🪶📜Григорий</option>
                            <option value="prazil" ${unit.avatarType === 'prazil' ? 'selected' : ''}>🔨🦎Празил (Чёрный Кобольд)</option>
                            <option value="bloom_wyvern" ${unit.avatarType === 'bloom_wyvern' ? 'selected' : ''}>🌿🐉Виверна Цветения</option>
                            <option value="mind_flayer" ${unit.avatarType === 'mind_flayer' ? 'selected' : ''}>🐙🧠Иллитид</option>
                            <option value="hunter_spider" ${unit.avatarType === 'hunter_spider' ? 'selected' : ''}>🕷️⚡Паук-Охотник</option>
                            <option value="tabaxi_monk" ${unit.avatarType === 'tabaxi_monk' ? 'selected' : ''}>🐱🥋Котолюд-Монах</option>
                            
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
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ БАРДА (ЛЮТНЯ, ШЛЯПА С ПЕРОМ И КИНЖАЛ)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateBardAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ДЕТАЛИЗИРОВАННАЯ ЛЮТНЯ ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.save();
        ctx.translate(98, 76);
        ctx.rotate((Math.PI / 180) * 28);

        // Длинный деревянный гриф и головка с колками
        ctx.fillStyle = '#4e342e';
        ctx.fillRect(-3.5, -62, 7, 46);

        ctx.fillStyle = '#ffd875';
        ctx.beginPath();
        ctx.arc(-5.5, -56, 1.5, 0, Math.PI * 2);
        ctx.arc(-5.5, -49, 1.5, 0, Math.PI * 2);
        ctx.arc(5.5, -56, 1.5, 0, Math.PI * 2);
        ctx.arc(5.5, -49, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Грушевидный корпус деки лютни
        ctx.fillStyle = '#a0522d';
        ctx.strokeStyle = '#3e2723';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.ellipse(0, 4, 18, 23, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Светлая еловая дека и резная розетка по центру
        ctx.fillStyle = '#cd853f';
        ctx.beginPath();
        ctx.ellipse(0, 5, 14, 19, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#2c1810';
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(0, 2, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Струнодержатель и тонкие серебряные струны
        ctx.fillStyle = '#3e2723';
        ctx.fillRect(-7, 15, 14, 2.5);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 0.7;
        [-2, 0, 2].forEach(sx => {
            ctx.beginPath();
            ctx.moveTo(sx, -56);
            ctx.lineTo(sx, 15);
            ctx.stroke();
        });
        ctx.restore();

        // 2. УЛОЖЕННЫЕ КАШТАНОВЫЕ ВОЛОСЫ И ЩЕГОЛЬСКОЙ КАМЗОЛ
        ctx.fillStyle = '#4a2e1b';
        ctx.beginPath();
        ctx.moveTo(34, 56);
        ctx.quadraticCurveTo(24, 92, 24, 128);
        ctx.lineTo(104, 128);
        ctx.quadraticCurveTo(104, 92, 94, 56);
        ctx.closePath();
        ctx.fill();

        // Бордово-пурпурный бархатный камзол с золотой отделкой
        ctx.fillStyle = '#5b1938';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(36, 98);
        ctx.lineTo(92, 98);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        // Пышный белый воротник-жабо
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(46, 100);
        ctx.lineTo(64, 126);
        ctx.lineTo(82, 100);
        ctx.closePath();
        ctx.fill();

        // Золотая тесьма на отворотах камзола
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(42, 100); ctx.lineTo(58, 128);
        ctx.moveTo(86, 100); ctx.lineTo(70, 128);
        ctx.stroke();

        // 3. ШЕЯ И ХАРИЗМАТИЧНОЕ ЛИЦО БАРДА
        ctx.fillStyle = '#e5b596';
        ctx.fillRect(55, 86, 18, 16);

        ctx.fillStyle = '#fbd2b8';
        ctx.beginPath();
        ctx.moveTo(45, 50);
        ctx.lineTo(83, 50);
        ctx.lineTo(81, 80);
        ctx.lineTo(64, 98);
        ctx.lineTo(47, 80);
        ctx.closePath();
        ctx.fill();

        // Передние локоны у висков
        ctx.fillStyle = '#5c3a21';
        ctx.beginPath();
        ctx.moveTo(44, 48); ctx.quadraticCurveTo(40, 66, 44, 80); ctx.lineTo(48, 76);
        ctx.moveTo(84, 48); ctx.quadraticCurveTo(88, 66, 84, 80); ctx.lineTo(80, 76);
        ctx.fill();

        // 4. ЩЕГОЛЬСКИЕ УСЫ, ЭСПАНЬОЛКА И УВЕРЕННАЯ УХМЫЛКА
        ctx.fillStyle = '#3b2414';
        ctx.beginPath();
        ctx.moveTo(50, 79);
        ctx.quadraticCurveTo(64, 74, 78, 79);
        ctx.quadraticCurveTo(83, 77, 81, 81);
        ctx.quadraticCurveTo(64, 79, 47, 81);
        ctx.quadraticCurveTo(45, 77, 50, 79);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(58, 90);
        ctx.lineTo(64, 99);
        ctx.lineTo(70, 90);
        ctx.quadraticCurveTo(64, 92, 58, 90);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#7c3f2c';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(55, 84);
        ctx.quadraticCurveTo(65, 88, 74, 82);
        ctx.stroke();

        // 5. ЯСНЫЕ ХИТРЫЕ ГЛАЗА И БРОВИ
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(54, 62, 4.6, 2.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 62, 4.6, 2.2, 0, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#10b981';
        ctx.beginPath(); ctx.arc(54, 62, 1.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 62, 1.9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#064e3b';
        ctx.beginPath(); ctx.arc(54, 62, 0.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 62, 0.9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(54.8, 61.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74.8, 61.2, 0.7, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#3b2414';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(48, 56.5); ctx.quadraticCurveTo(54, 55, 59, 57);
        ctx.moveTo(69, 56.5); ctx.quadraticCurveTo(75, 52.5, 81, 55.5);
        ctx.stroke();

        ctx.strokeStyle = '#d99e7c';
        ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(64, 59); ctx.lineTo(62.5, 73); ctx.lineTo(66, 73); ctx.stroke();

        // 6. ШИРОКОПОЛАЯ ШЛЯПА МУЗЫКАНТА С ПРЯЖКОЙ И ЗОЛОТЫМ ПЕРОМ
        ctx.save();
        ctx.translate(64, 44);
        ctx.rotate((Math.PI / 180) * -7);
        ctx.translate(-64, -44);

        ctx.fillStyle = '#6e1938';
        ctx.beginPath();
        ctx.ellipse(64, 46, 46, 11, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#8e244d';
        ctx.beginPath();
        ctx.moveTo(41, 45);
        ctx.quadraticCurveTo(46, 20, 64, 18);
        ctx.quadraticCurveTo(82, 20, 87, 45);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffd875';
        ctx.fillRect(42, 40, 44, 4.5);
        ctx.strokeStyle = '#8a6421';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(59, 39, 10, 6.5);

        ctx.fillStyle = '#ffd875';
        ctx.beginPath();
        ctx.moveTo(82, 41);
        ctx.quadraticCurveTo(102, 16, 116, 6);
        ctx.quadraticCurveTo(106, 26, 86, 43);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 7. ИЗЯЩНЫЙ СТАЛЬНОЙ КИНЖАЛ НА ПЕРЕДНЕМ ПЛАНЕ (Слева внизу по диагонали)
        ctx.save();
        ctx.translate(28, 106);
        ctx.rotate((Math.PI / 180) * -28);

        // Стальное обоюдоострое лезвие кинжала
        ctx.fillStyle = '#94a3b8';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-4, 0);
        ctx.lineTo(-3.5, -26);
        ctx.lineTo(0, -36); // Остриё кинжала
        ctx.lineTo(3.5, -26);
        ctx.lineTo(4, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Светлая заточенная грань лезвия и кровосток
        ctx.fillStyle = '#f1f5f9';
        ctx.beginPath();
        ctx.moveTo(0, -36);
        ctx.lineTo(3.5, -26);
        ctx.lineTo(4, 0);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();

        // Изогнутая золотая гарда-перекрестие
        ctx.fillStyle = '#ffd875';
        ctx.strokeStyle = '#8a6421';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-10, -2);
        ctx.quadraticCurveTo(0, 3, 10, -2);
        ctx.lineTo(9, 2.5);
        ctx.quadraticCurveTo(0, 6, -9, 2.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Обтянутая кожей рукоять и золотое навершие-капля
        ctx.fillStyle = '#3b1530';
        ctx.fillRect(-2.5, 3, 5, 13);

        ctx.fillStyle = '#ffd875';
        ctx.beginPath();
        ctx.arc(0, 18, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 18);
        ctx.lineTo(41, 45);
        ctx.lineTo(18, 46);
        ctx.lineTo(47, 80);
        ctx.lineTo(64, 98);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.lineTo(34, 56);
        ctx.closePath();
        ctx.fill();

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
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ЭЛЬФИЙКИ-ЛУЧНИЦЫ (УВЕРЕННЫЙ ВЗГЛЯД И ЭЛЬФИЙСКИЙ ЛУК)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateElfArcherAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. КОЛЧАН СО СТРЕЛАМИ ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.fillStyle = '#5c3a21';
        ctx.beginPath();
        ctx.moveTo(82, 96);
        ctx.lineTo(96, 66);
        ctx.lineTo(106, 70);
        ctx.lineTo(94, 102);
        ctx.closePath();
        ctx.fill();

        // Оперение стрел в колчане
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath(); ctx.moveTo(95, 67); ctx.lineTo(101, 56); ctx.lineTo(100, 69); ctx.fill();
        ctx.beginPath(); ctx.moveTo(101, 69); ctx.lineTo(108, 59); ctx.lineTo(105, 71); ctx.fill();

        // 2. ДЛИННЫЕ ПЛАТИНОВО-СЕРЕБРЯНЫЕ ВОЛОСЫ И ЛЕСНОЙ ПЛАЩ
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(36, 56);
        ctx.quadraticCurveTo(24, 92, 22, 128);
        ctx.lineTo(106, 128);
        ctx.quadraticCurveTo(104, 92, 92, 56);
        ctx.closePath();
        ctx.fill();

        // Изумрудный следопытский плащ и кожаный ремень на плечах
        ctx.fillStyle = '#1b4332';
        ctx.beginPath();
        ctx.moveTo(18, 128);
        ctx.lineTo(36, 98);
        ctx.lineTo(92, 98);
        ctx.lineTo(110, 128);
        ctx.closePath();
        ctx.fill();

        // Золотая застёжка-лист на груди
        ctx.fillStyle = '#ffd875';
        ctx.beginPath();
        ctx.ellipse(64, 110, 5, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // 3. ИЗЯЩНЫЕ ЭЛЬФИЙСКИЕ УШИ (Симметричные, заострённые вверх-вбок)
        ctx.fillStyle = '#e8c3a5';
        ctx.beginPath(); ctx.moveTo(44, 62); ctx.lineTo(24, 46); ctx.lineTo(43, 71); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(84, 62); ctx.lineTo(104, 46); ctx.lineTo(85, 71); ctx.closePath(); ctx.fill();

        // 4. ШЕЯ И ГАРМОНИЧНЫЙ ОВАЛ ЛИЦА
        ctx.fillStyle = '#e6be9e';
        ctx.fillRect(55, 86, 18, 16);

        ctx.fillStyle = '#ffedd8';
        ctx.beginPath();
        ctx.moveTo(45, 50);
        ctx.quadraticCurveTo(64, 34, 83, 50);
        ctx.lineTo(81, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(47, 78);
        ctx.closePath();
        ctx.fill();

        // 5. ПЛАТИНОВЫЕ ПРЯДИ, СЕРЕБРЯНАЯ ДИАДЕМА И ЛЕСНОЙ КАПЮШОН
        // Передние локоны волос, красиво обрамляющие щёки
        ctx.fillStyle = '#f1f5f9';
        ctx.beginPath();
        ctx.moveTo(45, 42); ctx.quadraticCurveTo(39, 66, 43, 88); ctx.lineTo(48, 84); ctx.quadraticCurveTo(45, 64, 50, 45);
        ctx.moveTo(83, 42); ctx.quadraticCurveTo(89, 66, 85, 88); ctx.lineTo(80, 84); ctx.quadraticCurveTo(83, 64, 78, 45);
        ctx.fill();

        // Изумрудный капюшон на макушке (не давит на глаза)
        ctx.fillStyle = '#2d6a4f';
        ctx.beginPath();
        ctx.moveTo(38, 52);
        ctx.quadraticCurveTo(44, 24, 64, 22);
        ctx.quadraticCurveTo(84, 24, 90, 52);
        ctx.lineTo(84, 48);
        ctx.quadraticCurveTo(64, 36, 44, 48);
        ctx.closePath();
        ctx.fill();

        // Тонкая золотая диадема с изумрудом на лбу
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(46, 46);
        ctx.quadraticCurveTo(64, 49, 82, 46);
        ctx.stroke();

        ctx.fillStyle = '#2ecc71';
        ctx.beginPath(); ctx.arc(64, 47.5, 2, 0, Math.PI * 2); ctx.fill();

        // 6. РОВНЫЕ, ЯСНЫЕ И УВЕРЕННЫЕ ГЛАЗА (Без раскосости и грусти)
        // Белки глаз строго на одной горизонтальной оси
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(54, 61, 4.8, 2.3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 61, 4.8, 2.3, 0, 0, Math.PI * 2); ctx.fill();

        // Яркая изумрудная радужка
        ctx.fillStyle = '#10b981';
        ctx.beginPath(); ctx.arc(54, 61, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 61, 2, 0, Math.PI * 2); ctx.fill();

        // Тёмные зрачки и живые белые блики
        ctx.fillStyle = '#064e3b';
        ctx.beginPath(); ctx.arc(54, 61, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 61, 1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(54.8, 60.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74.8, 60.2, 0.7, 0, Math.PI * 2); ctx.fill();

        // Тёмные реснички по верхнему веку для выразительности
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(49, 60.5); ctx.quadraticCurveTo(54, 58.2, 59, 60.5);
        ctx.moveTo(69, 60.5); ctx.quadraticCurveTo(74, 58.2, 79, 60.5);
        ctx.stroke();

        // Изящные уверенные брови (лёгкий подъём к вискам, без «домика» печали)
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(48, 55.5); ctx.quadraticCurveTo(54, 54, 59, 55.5);
        ctx.moveTo(69, 55.5); ctx.quadraticCurveTo(74, 54, 80, 55.5);
        ctx.stroke();

        // Аккуратный носик и спокойная уверенная полуулыбка
        ctx.strokeStyle = '#d9a786';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 58); ctx.lineTo(62.5, 73); ctx.lineTo(65.5, 73); ctx.stroke();

        ctx.fillStyle = '#e07a7a';
        ctx.beginPath();
        ctx.ellipse(64, 82, 4.8, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#9e4747';
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(59, 81.8); ctx.quadraticCurveTo(64, 83.2, 69, 81.8);
        ctx.stroke();

        // 7. ИЗОГНУТЫЙ ЭЛЬФИЙСКИЙ ЛУК СЛЕВА НА ПЕРЕДНЕМ ПЛАНЕ
        ctx.strokeStyle = '#c89d46';
        ctx.lineWidth = 3.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(22, 26);
        ctx.bezierCurveTo(6, 56, 6, 94, 22, 124);
        ctx.stroke();

        // Тонкая серебряная тетива
        ctx.strokeStyle = 'rgba(241, 245, 249, 0.8)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(22, 27);
        ctx.lineTo(22, 123);
        ctx.stroke();

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.beginPath();
        ctx.moveTo(64, 22);
        ctx.quadraticCurveTo(44, 24, 38, 52);
        ctx.lineTo(47, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(64, 128);
        ctx.lineTo(18, 128);
        ctx.lineTo(36, 56);
        ctx.closePath();
        ctx.fill();

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
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ЗЕЛЁНОГО КОБОЛЬДА С КОПЬЁМ В ПРОФИЛЬ
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateKoboldAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ДЕРЕВЯННОЕ КОПЬЁ СО СТАЛЬНЫМ НАКОНЕЧНИКОМ (По диагонали на переднем плане)
        ctx.save();
        // Древко копья
        ctx.strokeStyle = '#5c3e26';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(118, 124);
        ctx.lineTo(20, 26);
        ctx.stroke();

        // Стальной наконечник копья
        ctx.fillStyle = '#95a5a6';
        ctx.beginPath();
        ctx.moveTo(8, 14);
        ctx.lineTo(28, 22);
        ctx.lineTo(20, 26);
        ctx.lineTo(16, 34);
        ctx.closePath();
        ctx.fill();

        // Светлая грань наконечника
        ctx.fillStyle = '#dfe6e9';
        ctx.beginPath();
        ctx.moveTo(8, 14);
        ctx.lineTo(28, 22);
        ctx.lineTo(20, 26);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 2. ЗАДНИЙ ПЛАН: Острые рога рептилии (Загнуты назад вдоль черепа)
        ctx.fillStyle = '#3d352e';
        ctx.beginPath();
        ctx.moveTo(86, 44);
        ctx.quadraticCurveTo(108, 28, 120, 14);
        ctx.lineTo(102, 48);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#2b2520'; // Нижний малый рог
        ctx.beginPath();
        ctx.moveTo(90, 56);
        ctx.quadraticCurveTo(106, 48, 114, 36);
        ctx.lineTo(98, 58);
        ctx.closePath();
        ctx.fill();

        // 3. ШЕЯ, КОЖАНЫЕ ЛОХМОТЬЯ И БАГРОВЫЙ РАЗБОЙНИЧИЙ ШАРФ
        ctx.fillStyle = '#246332';
        ctx.beginPath();
        ctx.moveTo(74, 82);
        ctx.lineTo(92, 128);
        ctx.lineTo(48, 128);
        ctx.lineTo(58, 82);
        ctx.closePath();
        ctx.fill();

        // Кожаная безрукавка
        ctx.fillStyle = '#3b281c';
        ctx.beginPath();
        ctx.moveTo(38, 128);
        ctx.lineTo(52, 106);
        ctx.lineTo(96, 106);
        ctx.lineTo(110, 128);
        ctx.closePath();
        ctx.fill();

        // Развевающийся багровый шарф на шее
        ctx.fillStyle = '#8e2424';
        ctx.beginPath();
        ctx.moveTo(52, 92);
        ctx.quadraticCurveTo(72, 96, 90, 90);
        ctx.lineTo(116, 96);
        ctx.lineTo(108, 106);
        ctx.lineTo(86, 102);
        ctx.quadraticCurveTo(68, 108, 48, 102);
        ctx.closePath();
        ctx.fill();

        // 4. ГОЛОВА И ВЫТЯНУТАЯ ЯЩЕРИНАЯ МОРДА В ПРОФИЛЬ ВЛЕВО
        ctx.fillStyle = '#2d7a3e'; // Насыщенная зелёная чешуя
        ctx.beginPath();
        ctx.moveTo(90, 50); // Затылок
        ctx.lineTo(70, 38); // Лоб
        ctx.lineTo(22, 64); // Вытянутый кончик носа влево
        ctx.lineTo(26, 75); // Верхняя губа
        ctx.lineTo(60, 88); // Нижняя челюсть
        ctx.lineTo(88, 76); // Скула
        ctx.closePath();
        ctx.fill();

        // Чешуйчатый гребень на макушке
        ctx.fillStyle = '#164222';
        ctx.beginPath();
        ctx.moveTo(68, 40);
        ctx.lineTo(76, 28);
        ctx.lineTo(82, 43);
        ctx.closePath();
        ctx.fill();

        // Светло-салатовая пластина нижней челюсти (flat-акцент для объёма)
        ctx.fillStyle = '#52a357';
        ctx.beginPath();
        ctx.moveTo(60, 88);
        ctx.lineTo(88, 76);
        ctx.lineTo(74, 62);
        ctx.quadraticCurveTo(56, 72, 60, 88);
        ctx.closePath();
        ctx.fill();

        // 5. ХИЩНЫЙ ЗМЕИНЫЙ ГЛАЗ И НАДБРОВНАЯ ДУГА
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.moveTo(58, 52);
        ctx.lineTo(72, 47);
        ctx.lineTo(67, 57);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#111111'; // Вертикальный зрачок
        ctx.fillRect(63.5, 49, 1.5, 6);

        ctx.fillStyle = '#ffffff'; // Блик
        ctx.beginPath();
        ctx.arc(62.5, 51, 1, 0, Math.PI * 2);
        ctx.fill();

        // Нахмуренная чешуйчатая дуга над глазом
        ctx.strokeStyle = '#143d1f';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(55, 48);
        ctx.lineTo(71, 45);
        ctx.stroke();

        // Ноздря на кончике морды
        ctx.fillStyle = '#103018';
        ctx.beginPath();
        ctx.arc(28, 63, 1.6, 0, Math.PI * 2);
        ctx.fill();

        // 6. ПРИОТКРЫТАЯ ОСКАЛЕННАЯ ПАСТЬ С МЕЛКИМИ ЗУБАМИ
        ctx.fillStyle = '#141f16';
        ctx.beginPath();
        ctx.moveTo(26, 72);
        ctx.lineTo(56, 79);
        ctx.lineTo(52, 84);
        ctx.lineTo(31, 79);
        ctx.closePath();
        ctx.fill();

        // Острые белые зубы-иглы
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.moveTo(29, 72); ctx.lineTo(32, 78); ctx.lineTo(35, 73); ctx.fill();
        ctx.beginPath(); ctx.moveTo(39, 74); ctx.lineTo(42, 79.5); ctx.lineTo(45, 75); ctx.fill();
        ctx.beginPath(); ctx.moveTo(33, 80); ctx.lineTo(36, 75.5); ctx.lineTo(39, 80); ctx.fill();
        ctx.beginPath(); ctx.moveTo(43, 82); ctx.lineTo(46, 77.5); ctx.lineTo(49, 82); ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Лёгкая тень снизу)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(31, 79);
        ctx.lineTo(60, 88);
        ctx.lineTo(88, 76);
        ctx.lineTo(110, 128);
        ctx.lineTo(48, 128);
        ctx.lineTo(58, 84);
        ctx.closePath();
        ctx.fill();

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
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ БОЕВОЙ ЖРИЦЫ (ЗОЛОТОЙ СКИПЕТР И ЩИТ С КРЕСТОМ)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateBattlePriestessAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗОЛОТОЙ СВЯЩЕННЫЙ СКИПЕТР ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.save();
        ctx.translate(102, 46);
        ctx.rotate((Math.PI / 180) * 22);

        // Древко скипетра из золота и тёмного дерева
        ctx.strokeStyle = '#b8860b';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(0, 92);
        ctx.stroke();

        // Декоративные золотые кольца-перехваты на древке
        ctx.fillStyle = '#ffd875';
        ctx.fillRect(-3.5, 4, 7, 3);
        ctx.fillRect(-3.5, 22, 7, 3);

        // Ореол святого лазурного сияния вокруг навершия
        ctx.fillStyle = 'rgba(56, 189, 248, 0.28)';
        ctx.beginPath();
        ctx.arc(0, -18, 16, 0, Math.PI * 2);
        ctx.fill();

        // Резная золотая корона-оправа скипетра с крылышками
        ctx.fillStyle = '#ffd875';
        ctx.strokeStyle = '#8a6421';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-4, -10);
        ctx.lineTo(-14, -22);
        ctx.lineTo(-6, -18);
        ctx.lineTo(0, -32);
        ctx.lineTo(6, -18);
        ctx.lineTo(14, -22);
        ctx.lineTo(4, -10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Сияющий лазурный кристалл в сердцевине скипетра
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(0, -25);
        ctx.lineTo(5, -18);
        ctx.lineTo(0, -11);
        ctx.lineTo(-5, -18);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-1.2, -19.5, 1.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 2. ПЫШНЫЕ ПЛАТИНОВЫЕ ВОЛОСЫ И ТЯЖЁЛЫЕ ЛАТЫ ВАЛЬКИРИИ
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(34, 54);
        ctx.quadraticCurveTo(22, 92, 20, 128);
        ctx.lineTo(108, 128);
        ctx.quadraticCurveTo(106, 92, 94, 54);
        ctx.closePath();
        ctx.fill();

        // Стальной нагрудник и латный воротник-горжет
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(34, 96);
        ctx.lineTo(94, 96);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        // Рельефные золотые наплечники
        ctx.fillStyle = '#d4af37';
        ctx.strokeStyle = '#785a14';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(14, 124);
        ctx.quadraticCurveTo(20, 96, 44, 98);
        ctx.lineTo(38, 128);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(114, 124);
        ctx.quadraticCurveTo(108, 96, 84, 98);
        ctx.lineTo(90, 128);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Золотой нагрудный символ солнца по центру лат
        ctx.fillStyle = '#ffd875';
        ctx.beginPath(); ctx.arc(64, 114, 6.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(64, 114, 2.5, 0, Math.PI * 2); ctx.fill();

        // 3. ШЕЯ И ВЫРАЗИТЕЛЬНОЕ ЛИЦО БОЕВОЙ ЖРИЦЫ
        ctx.fillStyle = '#e5b89b';
        ctx.fillRect(55, 86, 18, 16);

        ctx.fillStyle = '#ffedd8';
        ctx.beginPath();
        ctx.moveTo(45, 50);
        ctx.quadraticCurveTo(64, 34, 83, 50);
        ctx.lineTo(81, 79);
        ctx.lineTo(64, 97);
        ctx.lineTo(47, 79);
        ctx.closePath();
        ctx.fill();

        // Тонкий лазурный ритуальный знак под глазами
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(54, 67); ctx.lineTo(54, 72);
        ctx.moveTo(74, 67); ctx.lineTo(74, 72);
        ctx.stroke();

        // Передние платиновые пряди волос, обрамляющие лицо
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(44, 42); ctx.quadraticCurveTo(38, 66, 43, 88); ctx.lineTo(48, 84); ctx.quadraticCurveTo(45, 64, 49, 46);
        ctx.moveTo(84, 42); ctx.quadraticCurveTo(90, 66, 85, 88); ctx.lineTo(80, 84); ctx.quadraticCurveTo(83, 64, 79, 46);
        ctx.fill();

        // 4. БОЕВОЙ ВЕНЕЦ-ТИАРА С ЗОЛОТЫМИ КРЫЛЬЯМИ ВАЛЬКИРИИ
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(42, 46);
        ctx.quadraticCurveTo(46, 24, 64, 22);
        ctx.quadraticCurveTo(82, 24, 86, 46);
        ctx.closePath();
        ctx.fill();

        // Крылья валькирии по бокам венца
        ctx.fillStyle = '#ffd875';
        ctx.strokeStyle = '#8a6421';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(45, 45);
        ctx.lineTo(24, 24);
        ctx.lineTo(34, 38);
        ctx.lineTo(28, 42);
        ctx.lineTo(43, 50);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(83, 45);
        ctx.lineTo(104, 24);
        ctx.lineTo(94, 38);
        ctx.lineTo(100, 42);
        ctx.lineTo(85, 50);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Стальной налобный обруч с золотым центральным гребнем
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.moveTo(43, 46);
        ctx.lineTo(64, 41);
        ctx.lineTo(85, 46);
        ctx.lineTo(84, 51);
        ctx.lineTo(64, 47);
        ctx.lineTo(44, 51);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffd875';
        ctx.beginPath();
        ctx.moveTo(60, 46);
        ctx.lineTo(64, 34);
        ctx.lineTo(68, 46);
        ctx.closePath();
        ctx.fill();

        // 5. ЯСНЫЕ, РЕШИТЕЛЬНЫЕ ГЛАЗА, БРОВИ И ТВЁРДАЯ ПОЛУУЛЫБКА
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(54, 61, 4.8, 2.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 61, 4.8, 2.2, 0, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0ea5e9';
        ctx.beginPath(); ctx.arc(54, 61, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 61, 2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0c4a6e';
        ctx.beginPath(); ctx.arc(54, 61, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 61, 1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(54.8, 60.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74.8, 60.2, 0.7, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(49, 60.5); ctx.quadraticCurveTo(54, 58.2, 59, 60.5);
        ctx.moveTo(69, 60.5); ctx.quadraticCurveTo(74, 58.2, 79, 60.5);
        ctx.stroke();

        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(47, 55.5); ctx.lineTo(59, 57);
        ctx.moveTo(81, 55.5); ctx.lineTo(69, 57);
        ctx.stroke();

        ctx.strokeStyle = '#d9a786';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 58); ctx.lineTo(62.5, 73); ctx.lineTo(65.5, 73); ctx.stroke();

        ctx.fillStyle = '#d96b6b';
        ctx.beginPath();
        ctx.ellipse(64, 82, 4.8, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // 6. СВЯЩЕННЫЙ ЩИТ С ЗОЛОТЫМ КРЕСТОМ НА ПЕРЕДНЕМ ПЛАНЕ (Слева снизу)
        ctx.save();
        ctx.translate(27, 104);
        ctx.rotate((Math.PI / 180) * -8);

        // Внешняя золотая окантовка щита
        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(-17, -20);
        ctx.lineTo(17, -20);
        ctx.lineTo(15, 6);
        ctx.lineTo(0, 24);
        ctx.lineTo(-15, 6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Внутренний лазурный контур поля щита
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-13, -16);
        ctx.lineTo(13, -16);
        ctx.lineTo(11.5, 4.5);
        ctx.lineTo(0, 19);
        ctx.lineTo(-11.5, 4.5);
        ctx.closePath();
        ctx.stroke();

        // Крупный золотой крест по центру щита
        ctx.fillStyle = '#d4af37';
        ctx.fillRect(-2.2, -14, 4.4, 30);
        ctx.fillRect(-11, -5.5, 22, 4.4);

        // Сияющий лазурный самоцвет в перекрестии
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(0, -3.3, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 22);
        ctx.quadraticCurveTo(46, 24, 42, 46);
        ctx.lineTo(47, 79);
        ctx.lineTo(64, 97);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.lineTo(34, 54);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ВОЛШЕБНИЦЫ (УВЕРЕННЫЙ ВЗГЛЯД И АРКАННЫЙ КРИСТАЛЛ)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateWizardessAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. АРКАННЫЙ ПОСОХ С ПАРЯЩИМ КРИСТАЛЛОМ ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.save();
        ctx.translate(104, 48);
        ctx.rotate((Math.PI / 180) * 20);

        // Тёмное руническое древко посоха
        ctx.strokeStyle = '#3b2416';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, -4);
        ctx.lineTo(0, 90);
        ctx.stroke();

        // Золотая оправа навершия посоха
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-7, -8);
        ctx.quadraticCurveTo(0, 2, 7, -8);
        ctx.stroke();

        // Ореол тайной магии вокруг парящего кристалла
        ctx.fillStyle = 'rgba(168, 85, 247, 0.3)';
        ctx.beginPath();
        ctx.arc(0, -18, 16, 0, Math.PI * 2);
        ctx.fill();

        // Огранённый аметистовый кристалл
        ctx.fillStyle = '#c084fc';
        ctx.strokeStyle = '#f3e8ff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -29);
        ctx.lineTo(7, -18);
        ctx.lineTo(0, -7);
        ctx.lineTo(-7, -18);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 2. ДЛИННЫЕ ПЛАТИНОВЫЕ ВОЛОСЫ И ТЁМНО-ПУРПУРНАЯ МАНТИЯ ЧАРОДЕЙКИ
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(34, 54);
        ctx.quadraticCurveTo(22, 92, 20, 128);
        ctx.lineTo(108, 128);
        ctx.quadraticCurveTo(106, 92, 94, 54);
        ctx.closePath();
        ctx.fill();

        // Мантия с высоким воротником и золотым шитьём
        ctx.fillStyle = '#2e1042';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(34, 96);
        ctx.lineTo(94, 96);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        // Золотой кант и рунический медальон на груди
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(42, 98); ctx.lineTo(64, 124); ctx.lineTo(86, 98);
        ctx.stroke();

        ctx.fillStyle = '#a855f7';
        ctx.beginPath(); ctx.arc(64, 114, 4.5, 0, Math.PI * 2); ctx.fill();

        // 3. ШЕЯ И ГАРМОНИЧНЫЙ ОВАЛ ЛИЦА
        ctx.fillStyle = '#e6be9e';
        ctx.fillRect(55, 86, 18, 16);

        ctx.fillStyle = '#ffedd8';
        ctx.beginPath();
        ctx.moveTo(45, 50);
        ctx.quadraticCurveTo(64, 34, 83, 50);
        ctx.lineTo(81, 79);
        ctx.lineTo(64, 97);
        ctx.lineTo(47, 79);
        ctx.closePath();
        ctx.fill();

        // Передние платиновые пряди волос по бокам лица
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(44, 44); ctx.quadraticCurveTo(38, 68, 43, 88); ctx.lineTo(48, 84); ctx.quadraticCurveTo(45, 64, 49, 47);
        ctx.moveTo(84, 44); ctx.quadraticCurveTo(90, 68, 85, 88); ctx.lineTo(80, 84); ctx.quadraticCurveTo(83, 64, 79, 47);
        ctx.fill();

        // 4. ШЁЛКОВЫЙ КАПЮШОН ЧАРОДЕЙКИ С ЗОЛОТОЙ КАЙМОЙ (Открытый, не давит на глаза)
        ctx.fillStyle = '#3b1554';
        ctx.beginPath();
        ctx.moveTo(36, 54);
        ctx.quadraticCurveTo(44, 22, 64, 20);
        ctx.quadraticCurveTo(84, 22, 92, 54);
        ctx.lineTo(85, 51);
        ctx.quadraticCurveTo(64, 36, 43, 51);
        ctx.closePath();
        ctx.fill();

        // Золотая вышивка по краю капюшона и капелька-самоцвет на лбу
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(39, 52);
        ctx.quadraticCurveTo(64, 35, 89, 52);
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(64, 44.5, 2.2, 0, Math.PI * 2); ctx.fill();

        // 5. РОВНЫЕ, ЯСНЫЕ И ЗАГАДОЧНЫЕ ГЛАЗА (Без раскосости и грусти)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(54, 61, 4.8, 2.3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 61, 4.8, 2.3, 0, 0, Math.PI * 2); ctx.fill();

        // Яркая аметистово-фиолетовая радужка
        ctx.fillStyle = '#9333ea';
        ctx.beginPath(); ctx.arc(54, 61, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 61, 2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#3b0764';
        ctx.beginPath(); ctx.arc(54, 61, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 61, 1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(54.8, 60.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74.8, 60.2, 0.7, 0, Math.PI * 2); ctx.fill();

        // Выразительные ресницы по верхнему веку
        ctx.strokeStyle = '#1e1b4b';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(49, 60.5); ctx.quadraticCurveTo(54, 58.2, 59, 60.5);
        ctx.moveTo(69, 60.5); ctx.quadraticCurveTo(74, 58.2, 79, 60.5);
        ctx.stroke();

        // Изящные уверенные брови
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(48, 55.5); ctx.quadraticCurveTo(54, 54, 59, 55.5);
        ctx.moveTo(69, 55.5); ctx.quadraticCurveTo(74, 54, 80, 55.5);
        ctx.stroke();

        // Аккуратный носик и спокойная полуулыбка
        ctx.strokeStyle = '#d9a786';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 58); ctx.lineTo(62.5, 73); ctx.lineTo(65.5, 73); ctx.stroke();

        ctx.fillStyle = '#c05682';
        ctx.beginPath();
        ctx.ellipse(64, 82, 4.8, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#701a3c';
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(59, 81.8); ctx.quadraticCurveTo(64, 83.2, 69, 81.8);
        ctx.stroke();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 20);
        ctx.quadraticCurveTo(44, 22, 36, 54);
        ctx.lineTo(47, 79);
        ctx.lineTo(64, 97);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.lineTo(34, 54);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },








    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ СУРОВОГО ДВАРФА-ПАЛАДИНА (ЖЕЛЕЗНЫЙ МОЛОТ И КАПЛЕВИДНЫЙ ЩИТ)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateDwarfPaladinAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. МАССИВНЫЙ ЖЕЛЕЗНЫЙ БОЕВОЙ МОЛОТ ЗА ПРАВЫМ ПЛЕЧОМ
        ctx.save();
        ctx.translate(100, 46);
        ctx.rotate((Math.PI / 180) * 22);

        // Окованная железом рукоять
        ctx.strokeStyle = '#3b2514';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, -14);
        ctx.lineTo(0, 86);
        ctx.stroke();

        // Стальная пика сверху молота
        ctx.fillStyle = '#7f8c8d';
        ctx.beginPath();
        ctx.moveTo(-4, -14);
        ctx.lineTo(0, -27);
        ctx.lineTo(4, -14);
        ctx.closePath();
        ctx.fill();

        // Тяжёлый кованый боёк с фасками и боевыми зазубринами
        ctx.fillStyle = '#4a5568';
        ctx.strokeStyle = '#1a202c';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.roundRect(-16, -14, 32, 18, 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#9aa5b4';
        ctx.fillRect(-14, -12, 28, 4);
        ctx.fillStyle = '#d4af37';
        ctx.fillRect(-1.5, -11, 3, 12);
        ctx.fillRect(-5, -6.5, 10, 3);
        ctx.restore();

        // 2. ТЯЖЁЛЫЕ ЛАТНЫЕ НАПЛЕЧНИКИ И КОЛЬЧУЖНЫЙ ГОРЖЕТ
        ctx.fillStyle = '#374151';
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.lineTo(32, 95);
        ctx.lineTo(96, 95);
        ctx.lineTo(114, 128);
        ctx.closePath();
        ctx.fill();

        // Закалённый золотой кант лат
        ctx.fillStyle = '#9c7832';
        ctx.beginPath();
        ctx.moveTo(40, 98);
        ctx.lineTo(54, 88);
        ctx.lineTo(74, 88);
        ctx.lineTo(88, 98);
        ctx.closePath();
        ctx.fill();

        // 3. СУРОВОЕ ОБВЕТРЕННОЕ ЛИЦО С РУБЛЕНЫМИ СКУЛАМИ
        ctx.fillStyle = '#b87e62'; // Обветренная загорелая кожа
        ctx.beginPath();
        ctx.moveTo(41, 46);
        ctx.lineTo(64, 34);
        ctx.lineTo(87, 46);
        ctx.lineTo(88, 72);
        ctx.lineTo(81, 86);
        ctx.lineTo(64, 102);
        ctx.lineTo(47, 86);
        ctx.lineTo(40, 72);
        ctx.closePath();
        ctx.fill();

        // Тёмно-медные волосы на висках и зачёс назад
        ctx.fillStyle = '#632612';
        ctx.beginPath();
        ctx.moveTo(39, 56);
        ctx.quadraticCurveTo(40, 28, 64, 26);
        ctx.quadraticCurveTo(88, 28, 89, 56);
        ctx.lineTo(85, 48);
        ctx.quadraticCurveTo(64, 38, 43, 48);
        ctx.closePath();
        ctx.fill();

        // Складки морщин на суровом лбу
        ctx.strokeStyle = '#87533b';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(52, 43); ctx.quadraticCurveTo(64, 45, 76, 43);
        ctx.moveTo(55, 47); ctx.quadraticCurveTo(64, 49, 73, 47);
        ctx.stroke();

        // 4. ГЛУБОКИЕ ГЛАЗНИЦЫ, НАХМУРЕННЫЕ БРОВИ И ШРАМ
        // Глубокая тень под тяжёлой надбровной дугой
        ctx.fillStyle = 'rgba(42, 20, 12, 0.45)';
        ctx.beginPath();
        ctx.moveTo(43, 55);
        ctx.lineTo(64, 60);
        ctx.lineTo(85, 55);
        ctx.lineTo(82, 65);
        ctx.lineTo(64, 64);
        ctx.lineTo(46, 65);
        ctx.closePath();
        ctx.fill();

        // Узкий, жёсткий прищур стальных глаз
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(47, 59); ctx.lineTo(58, 61); ctx.lineTo(56, 63); ctx.lineTo(48, 62);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(81, 59); ctx.lineTo(70, 61); ctx.lineTo(72, 63); ctx.lineTo(80, 62);
        ctx.closePath();
        ctx.fill();

        // Ледяные голубовато-серые зрачки паладина
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(53, 61, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 61, 1.5, 0, Math.PI * 2); ctx.fill();

        // Густые, агрессивно сведённые к переносице брови
        ctx.fillStyle = '#521d0c';
        ctx.beginPath();
        ctx.moveTo(42, 52); ctx.lineTo(60, 58); ctx.lineTo(59, 61); ctx.lineTo(42, 56);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(86, 52); ctx.lineTo(68, 58); ctx.lineTo(69, 61); ctx.lineTo(86, 56);
        ctx.closePath();
        ctx.fill();

        // Боевой шрам через правую бровь и скулу
        ctx.strokeStyle = '#7a3326';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(73, 50);
        ctx.lineTo(79, 73);
        ctx.stroke();

        // Рубленый, массивный нос с горбинкой и тенью
        ctx.fillStyle = '#a3694e';
        ctx.beginPath();
        ctx.moveTo(61, 58);
        ctx.lineTo(67, 58);
        ctx.lineTo(70, 73);
        ctx.lineTo(64, 76);
        ctx.lineTo(58, 73);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#c98e71'; // Световая грань спинки носа
        ctx.beginPath();
        ctx.moveTo(63, 59); ctx.lineTo(66, 59); ctx.lineTo(66, 73); ctx.lineTo(63, 73);
        ctx.closePath();
        ctx.fill();

        // 5. ТЯЖЁЛАЯ ТЁМНО-МЕДНАЯ БОРОДА С КОСАМИ И ЖЕЛЕЗНЫМИ ЗАЖИМАМИ
        ctx.fillStyle = '#7c2d12';
        ctx.beginPath();
        ctx.moveTo(41, 74);
        ctx.lineTo(31, 102);
        ctx.lineTo(43, 128);
        ctx.lineTo(85, 128);
        ctx.lineTo(97, 102);
        ctx.lineTo(87, 74);
        ctx.quadraticCurveTo(64, 85, 41, 74);
        ctx.closePath();
        ctx.fill();

        // Рельефные пряди и тени в бороде
        ctx.strokeStyle = '#4a1807';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(52, 86); ctx.lineTo(49, 126);
        ctx.moveTo(64, 88); ctx.lineTo(64, 128);
        ctx.moveTo(76, 86); ctx.lineTo(79, 126);
        ctx.stroke();

        // Угрюмые, опущенные вниз густые усы
        ctx.fillStyle = '#5c1f0b';
        ctx.beginPath();
        ctx.moveTo(47, 78);
        ctx.quadraticCurveTo(64, 73, 81, 78);
        ctx.lineTo(85, 89);
        ctx.quadraticCurveTo(64, 81, 43, 89);
        ctx.closePath();
        ctx.fill();

        // Стальные зажимы на косах бороды
        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.fillRect(45, 117, 9, 5); ctx.strokeRect(45, 117, 9, 5);
        ctx.fillRect(74, 117, 9, 5); ctx.strokeRect(74, 117, 9, 5);

        // Кованый обруч-диадема паладина на лбу
        ctx.fillStyle = '#c89d46';
        ctx.strokeStyle = '#5c4212';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(41, 48);
        ctx.lineTo(64, 41);
        ctx.lineTo(87, 48);
        ctx.lineTo(85, 43);
        ctx.lineTo(64, 36);
        ctx.lineTo(43, 43);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 6. ЖЕЛЕЗНЫЙ ЩИТ В ВИДЕ РОМБОВИДНОЙ КАПЛИ (На переднем плане слева снизу)
        ctx.save();
        ctx.translate(28, 102);
        ctx.rotate((Math.PI / 180) * -10);

        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -28);
        ctx.lineTo(20, -8);
        ctx.lineTo(0, 32);
        ctx.lineTo(-20, -8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(0, -22);
        ctx.lineTo(15, -7);
        ctx.lineTo(0, 25);
        ctx.lineTo(-15, -7);
        ctx.closePath();
        ctx.fill();

        // Золотой крест и стальные заклёпки на щите
        ctx.fillStyle = '#d4af37';
        ctx.fillRect(-1.5, -18, 3, 36);
        ctx.fillRect(-10, -8.5, 20, 3);

        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath(); ctx.arc(0, -24.5, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(17, -7.5, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(-17, -7.5, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(0, 27.5, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Глубокая тень на левую половину лица и бороды)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.moveTo(64, 26);
        ctx.lineTo(41, 46);
        ctx.lineTo(40, 72);
        ctx.lineTo(31, 102);
        ctx.lineTo(43, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },





    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ОРКА-ВОИНА (ДЕТАЛИЗИРОВАННЫЙ ОБРАЗ С СЕКИРОЙ ЗА СПИНОЙ)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateOrcWarriorAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. МАССИВНАЯ ДВУРУЧНАЯ СЕКИРА ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.save();
        ctx.translate(98, 44);
        ctx.rotate((Math.PI / 180) * 26);

        // Деревянное толстое древко с обмоткой
        ctx.strokeStyle = '#4a311d';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, -14);
        ctx.lineTo(0, 92);
        ctx.stroke();

        // Острое стальное навершие-пика топора
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.moveTo(-4, -14);
        ctx.lineTo(0, -25);
        ctx.lineTo(4, -14);
        ctx.closePath();
        ctx.fill();

        // Тяжёлые кованые лезвия двусторонней секиры
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.5;

        // Левое лезвие
        ctx.beginPath();
        ctx.moveTo(-3, -12);
        ctx.quadraticCurveTo(-24, -18, -26, 2);
        ctx.quadraticCurveTo(-14, 10, -3, 4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Правое лезвие
        ctx.beginPath();
        ctx.moveTo(3, -12);
        ctx.quadraticCurveTo(24, -18, 26, 2);
        ctx.quadraticCurveTo(14, 10, 3, 4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Светлая заточенная кромка лезвий
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(-24, -10);
        ctx.quadraticCurveTo(-26, 2, -16, 6);
        ctx.lineTo(-14, 3);
        ctx.quadraticCurveTo(-22, 0, -21, -9);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(24, -10);
        ctx.quadraticCurveTo(26, 2, 16, 6);
        ctx.lineTo(14, 3);
        ctx.quadraticCurveTo(22, 0, 21, -9);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 2. МОЩНАЯ ШЕЯ, КОВАНЫЕ НАПЛЕЧНИКИ С ШИПАМИ И КОЖАНАЯ ПЕРЕВЯЗЬ
        ctx.fillStyle = '#1e3d24';
        ctx.beginPath();
        ctx.moveTo(44, 88);
        ctx.lineTo(28, 128);
        ctx.lineTo(100, 128);
        ctx.lineTo(84, 88);
        ctx.closePath();
        ctx.fill();

        // Грубый железный нагрудник и наплечники
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.lineTo(32, 96);
        ctx.lineTo(96, 96);
        ctx.lineTo(114, 128);
        ctx.closePath();
        ctx.fill();

        // Шипы на стальных наплечниках
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath(); ctx.moveTo(26, 102); ctx.lineTo(12, 86); ctx.lineTo(34, 96); ctx.fill();
        ctx.beginPath(); ctx.moveTo(102, 102); ctx.lineTo(116, 86); ctx.lineTo(94, 96); ctx.fill();

        // Толстый кожаный ремень-портупея через грудь с железной пряжкой
        ctx.fillStyle = '#3b2416';
        ctx.beginPath();
        ctx.moveTo(34, 98);
        ctx.lineTo(62, 128);
        ctx.lineTo(78, 128);
        ctx.lineTo(48, 96);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.strokeRect(47, 109, 9, 8);

        // 3. ЗАОСТРЁННЫЕ УШИ ОРКА С СЕРЬГОЙ
        ctx.fillStyle = '#254a2c';
        ctx.beginPath(); ctx.moveTo(40, 58); ctx.lineTo(16, 48); ctx.lineTo(39, 72); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(88, 58); ctx.lineTo(112, 48); ctx.lineTo(89, 72); ctx.closePath(); ctx.fill();

        // Железное кольцо в левом ухе
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(21, 56, 3.5, 0, Math.PI * 2);
        ctx.stroke();

        // 4. СУРОВОЕ ЛИЦО ОРКА С РУБЛЕНЫМИ СКУЛАМИ И ТЯЖЁЛОЙ ЧЕЛЮСТЬЮ
        ctx.fillStyle = '#2e5e38';
        ctx.beginPath();
        ctx.moveTo(41, 50);
        ctx.lineTo(64, 34);
        ctx.lineTo(87, 50);
        ctx.lineTo(88, 82);
        ctx.lineTo(74, 102);
        ctx.lineTo(54, 102);
        ctx.lineTo(40, 82);
        ctx.closePath();
        ctx.fill();

        // Световая зона на скулах и подбородке
        ctx.fillStyle = '#3b7547';
        ctx.beginPath();
        ctx.moveTo(46, 66);
        ctx.lineTo(82, 66);
        ctx.lineTo(79, 92);
        ctx.lineTo(64, 100);
        ctx.lineTo(49, 92);
        ctx.closePath();
        ctx.fill();

        // Боевой шрам через левую щеку
        ctx.strokeStyle = '#8f2d2d';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(45, 68);
        ctx.lineTo(53, 82);
        ctx.stroke();

        // 5. ЯРОСТНЫЙ ВЗГЛЯД, ПРИПЛЮСНУТЫЙ НОС И КРУПНЫЕ КЛЫКИ
        // Глубокие глазницы и багровый прищур
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(53, 62, 4.8, 1.8, 0.14, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 62, 4.8, 1.8, -0.14, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#dc2626';
        ctx.beginPath(); ctx.arc(54, 62, 1.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 62, 1.6, 0, Math.PI * 2); ctx.fill();

        // Нависшие надбровные дуги
        ctx.strokeStyle = '#142b19';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(44, 55); ctx.lineTo(59, 60);
        ctx.moveTo(84, 55); ctx.lineTo(69, 60);
        ctx.stroke();

        // Приплюснутый нос с широкими ноздрями
        ctx.fillStyle = '#1e3d24';
        ctx.beginPath();
        ctx.moveTo(64, 61);
        ctx.lineTo(71, 74);
        ctx.lineTo(57, 74);
        ctx.closePath();
        ctx.fill();

        // Свирепый оскал и мощные нижние клыки
        ctx.strokeStyle = '#142b19';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(47, 86);
        ctx.quadraticCurveTo(64, 81, 81, 86);
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#142b19';
        ctx.lineWidth = 1.1;
        // Левый клык
        ctx.beginPath(); ctx.moveTo(46, 87); ctx.lineTo(43, 71); ctx.lineTo(52, 86); ctx.closePath(); ctx.fill(); ctx.stroke();
        // Правый клык
        ctx.beginPath(); ctx.moveTo(82, 87); ctx.lineTo(85, 71); ctx.lineTo(76, 86); ctx.closePath(); ctx.fill(); ctx.stroke();

        // 6. КОВАНЫЙ ОТКРЫТЫЙ ШЛЕМ С ЗАКЛЁПКАМИ, НАНОСНИКОМ И ОБЛОМАННЫМ РОГОМ
        // Правый целый рог и левый сколотый рог на шлеме
        ctx.fillStyle = '#e2e8f0';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        // Левый сколотый рог
        ctx.beginPath(); ctx.moveTo(41, 46); ctx.lineTo(29, 36); ctx.lineTo(35, 34); ctx.lineTo(39, 48); ctx.closePath(); ctx.fill(); ctx.stroke();
        // Правый целый рог
        ctx.beginPath(); ctx.moveTo(87, 46); ctx.quadraticCurveTo(100, 36, 105, 24); ctx.lineTo(89, 48); ctx.closePath(); ctx.fill(); ctx.stroke();

        // Купол шлема
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(39, 52);
        ctx.quadraticCurveTo(44, 24, 64, 22);
        ctx.quadraticCurveTo(84, 24, 89, 52);
        ctx.lineTo(85, 56);
        ctx.lineTo(64, 51);
        ctx.lineTo(43, 56);
        ctx.closePath();
        ctx.fill();

        // Стальная пластина-обод с заклёпками и наносником
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.moveTo(40, 48);
        ctx.lineTo(64, 44);
        ctx.lineTo(88, 48);
        ctx.lineTo(87, 54);
        ctx.lineTo(64, 50);
        ctx.lineTo(41, 54);
        ctx.closePath();
        ctx.fill();

        // Стальной наносник
        ctx.fillRect(62, 49, 4, 17);

        // Заклёпки на ободе шлема
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath(); ctx.arc(46, 50, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(55, 48, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(73, 48, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(82, 50, 1.3, 0, Math.PI * 2); ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 22);
        ctx.quadraticCurveTo(44, 24, 39, 52);
        ctx.lineTo(40, 82);
        ctx.lineTo(54, 102);
        ctx.lineTo(64, 102);
        ctx.lineTo(64, 128);
        ctx.lineTo(14, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },





    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ФИОЛЕТОВОГО ГРИБА-КОЛБЫ (ГАЗОВЫЙ СПОРОВИК)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateVioletMushroomAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ОБЛАКО РАСПЫЛЯЕМОГО ГАЗА И СПОР ИЗ ГОРЛЫШКА (Задний и верхний слой)
        ctx.fillStyle = 'rgba(165, 94, 234, 0.35)'; // Фиолетовый туман
        ctx.beginPath(); ctx.arc(64, 22, 18, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(46, 16, 13, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(82, 16, 13, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = 'rgba(0, 242, 254, 0.3)'; // Неоново-бирюзовый газ
        ctx.beginPath(); ctx.arc(64, 15, 11, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(36, 22, 8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(92, 22, 8, 0, Math.PI * 2); ctx.fill();

        // 2. КОРЕШКИ-МИЦЕЛИЙ В САМОМ НИЗУ
        ctx.fillStyle = '#2c163d';
        ctx.beginPath();
        ctx.moveTo(42, 114);
        ctx.lineTo(30, 128);
        ctx.lineTo(50, 124);
        ctx.lineTo(64, 128);
        ctx.lineTo(78, 124);
        ctx.lineTo(98, 128);
        ctx.lineTo(86, 114);
        ctx.closePath();
        ctx.fill();

        // 3. ТЕЛО ГРИБА В ВИДЕ КОЛБЫ (Широкое брюшко + узкое горлышко сверху)
        ctx.fillStyle = '#6c3483'; // Основной глубокий фиолетовый цвет
        ctx.beginPath();
        ctx.moveTo(54, 36); // Левый край горлышка
        ctx.lineTo(74, 36); // Правый край горлышка
        ctx.lineTo(76, 54); // Переход горлышка в плечи
        ctx.bezierCurveTo(104, 62, 108, 106, 86, 118); // Правый округлый бок колбы
        ctx.lineTo(42, 118); // Плоское устойчивое дно
        ctx.bezierCurveTo(20, 106, 24, 62, 52, 54); // Левый округлый бок колбы
        ctx.closePath();
        ctx.fill();

        // Рельефные ребра и световой объем на правой стороне колбы
        ctx.fillStyle = '#8e44ad';
        ctx.beginPath();
        ctx.moveTo(64, 36);
        ctx.lineTo(74, 36);
        ctx.lineTo(76, 54);
        ctx.bezierCurveTo(104, 62, 108, 106, 86, 118);
        ctx.lineTo(64, 118);
        ctx.closePath();
        ctx.fill();

        // 4. ОТВЕРСТИЕ-СОПЛО ГОРЛЫШКА СВЕРХУ (Откуда бьет газ)
        ctx.fillStyle = '#1b0a26'; // Темное жерло
        ctx.beginPath();
        ctx.ellipse(64, 36, 11, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#d2b4de'; // Утолщенный ободок горлышка
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(64, 36, 11, 4, 0, 0, Math.PI * 2);
        ctx.stroke();

        // 5. СВЕТЯЩИЕСЯ СПОРОВЫЕ ПУЗЫРИ НА ТЕЛЕ КОЛБЫ (Без глаз и зубов)
        ctx.fillStyle = '#00f2fe';
        ctx.beginPath(); ctx.arc(46, 84, 5.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(82, 88, 6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(64, 72, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(54, 102, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 66, 3, 0, Math.PI * 2); ctx.fill();

        // Белые блики внутри биолюминесцентных пятен
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(45, 82, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(81, 86, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(63, 71, 1.3, 0, Math.PI * 2); ctx.fill();

        // 6. ЯРКИЕ ИСКРЫ-СПОРЫ, ВЫЛЕТАЮЩИЕ СТРУЕЙ ВВЕРХ ИЗ ГОРЛЫШКА
        ctx.fillStyle = '#00f2fe';
        ctx.beginPath(); ctx.arc(64, 26, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(56, 18, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(73, 19, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(62, 10, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(42, 14, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(86, 12, 1.6, 0, Math.PI * 2); ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину колбы)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';
        ctx.beginPath();
        ctx.moveTo(64, 36);
        ctx.lineTo(54, 36);
        ctx.lineTo(52, 54);
        ctx.bezierCurveTo(24, 62, 20, 106, 42, 118);
        ctx.lineTo(64, 118);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ СРЕДНЕВЕКОВОГО ПОЛУДЕРЕВЕНСКОГО ГОРОЖАНИНА
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateTownsmanAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ОДЕЖДА: Грубая холщовая рубаха, кожаная жилетка и шейный платок
        ctx.fillStyle = '#5d4037'; // Кожаная потёртая безрукавка
        ctx.beginPath();
        ctx.moveTo(20, 128);
        ctx.lineTo(38, 102);
        ctx.lineTo(90, 102);
        ctx.lineTo(108, 128);
        ctx.closePath();
        ctx.fill();

        // Грубая небелёная льняная рубаха по центру
        ctx.fillStyle = '#d7ccc8';
        ctx.beginPath();
        ctx.moveTo(48, 102);
        ctx.lineTo(64, 128);
        ctx.lineTo(80, 102);
        ctx.closePath();
        ctx.fill();

        // Шнуровка на груди рубахи
        ctx.strokeStyle = '#4e342e';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(64, 108); ctx.lineTo(64, 125);
        ctx.moveTo(60, 112); ctx.lineTo(68, 112);
        ctx.moveTo(60, 118); ctx.lineTo(68, 118);
        ctx.stroke();

        // Простой повязанный шейный платок (охристый)
        ctx.fillStyle = '#a1662f';
        ctx.beginPath();
        ctx.moveTo(46, 98);
        ctx.quadraticCurveTo(64, 108, 82, 98);
        ctx.lineTo(78, 106);
        ctx.quadraticCurveTo(64, 113, 50, 106);
        ctx.closePath();
        ctx.fill();

        // 2. ШЕЯ И ОТТОПЫРЕННЫЕ УШИ
        ctx.fillStyle = '#d69e7e';
        ctx.fillRect(54, 86, 20, 16);

        ctx.fillStyle = '#dfa888';
        ctx.beginPath(); ctx.ellipse(41, 68, 5, 8, -0.15, 0, Math.PI * 2); ctx.fill(); // Левое ухо
        ctx.beginPath(); ctx.ellipse(87, 68, 5, 8, 0.15, 0, Math.PI * 2); ctx.fill(); // Правое ухо

        // 3. ЛИЦО (Простое, кругловатое, обветренное)
        ctx.fillStyle = '#e8b496';
        ctx.beginPath();
        ctx.moveTo(43, 52);
        ctx.lineTo(85, 52);
        ctx.lineTo(84, 82);
        ctx.lineTo(64, 98);
        ctx.lineTo(44, 82);
        ctx.closePath();
        ctx.fill();

        // Лёгкая рыжеватая щетина на подбородке и щеках
        ctx.fillStyle = 'rgba(166, 114, 54, 0.22)';
        ctx.beginPath();
        ctx.moveTo(44, 76);
        ctx.lineTo(64, 98);
        ctx.lineTo(84, 76);
        ctx.lineTo(83, 83);
        ctx.lineTo(64, 98);
        ctx.lineTo(45, 83);
        ctx.closePath();
        ctx.fill();

        // 4. РАСТРЁПАННЫЕ СОЛОМЕННЫЕ ВОЛОСЫ «ПОД ГОРШОК»
        ctx.fillStyle = '#e2be58'; // Соломенный блонд
        ctx.beginPath();
        ctx.moveTo(39, 60);
        ctx.quadraticCurveTo(36, 28, 64, 26);
        ctx.quadraticCurveTo(92, 28, 89, 60);
        // Неровная, грубо подстриженная чёлка по лбу
        ctx.lineTo(83, 52);
        ctx.lineTo(77, 56);
        ctx.lineTo(71, 50);
        ctx.lineTo(64, 55);
        ctx.lineTo(57, 50);
        ctx.lineTo(50, 56);
        ctx.lineTo(45, 52);
        ctx.closePath();
        ctx.fill();

        // Торчащие вихры на макушке
        ctx.fillStyle = '#edd078';
        ctx.beginPath();
        ctx.moveTo(58, 28); ctx.lineTo(54, 19); ctx.lineTo(65, 26);
        ctx.moveTo(66, 27); ctx.lineTo(73, 20); ctx.lineTo(72, 28);
        ctx.fill();

        // 5. ГЛАЗА, ВЕСНУШКИ, НОС КАРТОШКОЙ И ПРОСТОДУШНАЯ УЛЫБКА
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(53, 66, 4.5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 66, 4.5, 2.5, 0, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#5d8aa8'; // Серо-голубые глаза
        ctx.beginPath(); ctx.arc(53, 66, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 66, 2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(53.8, 65.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75.8, 65.2, 0.7, 0, Math.PI * 2); ctx.fill();

        // Лохматые светло-русые брови
        ctx.strokeStyle = '#a8842c';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(47, 60); ctx.lineTo(58, 61); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(70, 61); ctx.lineTo(81, 60); ctx.stroke();

        // Веснушки на переносице и щеках
        ctx.fillStyle = '#b5744c';
        ctx.fillRect(48, 72, 1.5, 1.5); ctx.fillRect(52, 74, 1.5, 1.5); ctx.fillRect(50, 76, 1.5, 1.5);
        ctx.fillRect(79, 72, 1.5, 1.5); ctx.fillRect(75, 74, 1.5, 1.5); ctx.fillRect(77, 76, 1.5, 1.5);

        // Широковатый деревенский нос
        ctx.fillStyle = '#d49876';
        ctx.beginPath();
        ctx.moveTo(64, 63);
        ctx.lineTo(68, 75);
        ctx.quadraticCurveTo(64, 78, 60, 75);
        ctx.closePath();
        ctx.fill();

        // Простая открытая улыбка
        ctx.strokeStyle = '#7c4d36';
        ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(55, 84); ctx.quadraticCurveTo(64, 89, 73, 84); ctx.stroke();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 20);
        ctx.lineTo(39, 52);
        ctx.lineTo(44, 82);
        ctx.lineTo(64, 98);
        ctx.lineTo(64, 128);
        ctx.lineTo(20, 128);
        ctx.lineTo(38, 102);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ СРЕДНЕВЕКОВОЙ ПОЛУДЕРЕВЕНСКОЙ ГОРОЖАНКИ
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateTownswomanAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ОДЕЖДА: Простое шерстяное платье, корсаж на шнуровке и полотняная косынка
        ctx.fillStyle = '#6d4c41'; // Тёплое домотканое платье
        ctx.beginPath();
        ctx.moveTo(22, 128);
        ctx.lineTo(40, 102);
        ctx.lineTo(88, 102);
        ctx.lineTo(106, 128);
        ctx.closePath();
        ctx.fill();

        // Белая полотняная косынка-воротник на плечах
        ctx.fillStyle = '#eceff1';
        ctx.beginPath();
        ctx.moveTo(38, 102);
        ctx.lineTo(64, 122);
        ctx.lineTo(90, 102);
        ctx.lineTo(82, 98);
        ctx.lineTo(64, 112);
        ctx.lineTo(46, 98);
        ctx.closePath();
        ctx.fill();

        // Шнуровка корсажа внизу по центру
        ctx.strokeStyle = '#3e2723';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(60, 121); ctx.lineTo(68, 125);
        ctx.moveTo(68, 121); ctx.lineTo(60, 125);
        ctx.stroke();

        // 2. ЗАДНИЙ ПЛАН: Пышный белый средневековый чепец и пряди волос
        ctx.fillStyle = '#dfe4ea'; // Основной объём чепца
        ctx.beginPath();
        ctx.arc(64, 52, 31, Math.PI * 0.85, Math.PI * 2.15);
        ctx.closePath();
        ctx.fill();

        // Выбивающиеся из-под чепца медово-русые локоны по бокам
        ctx.fillStyle = '#c88a36';
        ctx.beginPath();
        ctx.ellipse(41, 66, 6, 18, 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(87, 66, 6, 18, -0.15, 0, Math.PI * 2);
        ctx.fill();

        // 3. ШЕЯ И ЛИЦО (Мягкий, открытый овал со здоровым румянцем)
        ctx.fillStyle = '#e8b89a';
        ctx.fillRect(55, 86, 18, 16);

        ctx.fillStyle = '#fbd4bc';
        ctx.beginPath();
        ctx.moveTo(45, 52);
        ctx.lineTo(83, 52);
        ctx.lineTo(81, 80);
        ctx.lineTo(64, 96);
        ctx.lineTo(47, 80);
        ctx.closePath();
        ctx.fill();

        // Лёгкий деревенский румянец на щёчках
        ctx.fillStyle = 'rgba(231, 76, 60, 0.16)';
        ctx.beginPath(); ctx.arc(50, 74, 5.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(78, 74, 5.5, 0, Math.PI * 2); ctx.fill();

        // 4. ОБОДОК ЧЕПЦА И ЧЁЛКА НА ЛБУ
        // Тёплая медовая чёлка, разделённая на пробор
        ctx.fillStyle = '#d99b43';
        ctx.beginPath();
        ctx.moveTo(44, 54);
        ctx.quadraticCurveTo(54, 44, 64, 50);
        ctx.quadraticCurveTo(74, 44, 84, 54);
        ctx.lineTo(82, 46);
        ctx.quadraticCurveTo(64, 38, 46, 46);
        ctx.closePath();
        ctx.fill();

        // Белоснежный отворот чепца по верхнему краю
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(36, 54);
        ctx.quadraticCurveTo(64, 24, 92, 54);
        ctx.lineTo(87, 56);
        ctx.quadraticCurveTo(64, 32, 41, 56);
        ctx.closePath();
        ctx.fill();

        // 5. ГЛАЗА, БРОВИ, ВЕСНУШКИ И ПРИВЕТЛИВАЯ УЛЫБКА
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(54, 65, 4.5, 2.3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 65, 4.5, 2.3, 0, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#27ae60'; // Живые зелёные глаза
        ctx.beginPath(); ctx.arc(54, 65, 1.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 65, 1.9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(54.7, 64.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74.7, 64.2, 0.7, 0, Math.PI * 2); ctx.fill();

        // Аккуратные русые брови
        ctx.strokeStyle = '#9c6823';
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(48, 59); ctx.quadraticCurveTo(54, 57, 59, 59); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(69, 59); ctx.quadraticCurveTo(74, 57, 80, 59); ctx.stroke();

        // Пара мелких веснушек
        ctx.fillStyle = '#c4835a';
        ctx.fillRect(50, 71, 1.4, 1.4);
        ctx.fillRect(77, 71, 1.4, 1.4);

        // Небольшой аккуратный носик
        ctx.strokeStyle = '#d99e7c';
        ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(64, 62); ctx.lineTo(62, 74); ctx.lineTo(66, 74); ctx.stroke();

        // Мягкие тёплые губы в доброй улыбке
        ctx.fillStyle = '#d97b74';
        ctx.beginPath();
        ctx.ellipse(64, 83, 5, 1.8, 0, 0, Math.PI * 2);
        ctx.fill();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Лёгкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.beginPath();
        ctx.moveTo(64, 24);
        ctx.lineTo(36, 54);
        ctx.lineTo(47, 80);
        ctx.lineTo(64, 96);
        ctx.lineTo(64, 128);
        ctx.lineTo(22, 128);
        ctx.lineTo(40, 102);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ЛЫСОГО СРЕДНЕВЕКОВОГО СТАРЦА
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateElderAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ОДЕЖДА: Простая тёмно-коричневая средневековая ряса / туника
        ctx.fillStyle = '#4e342e';
        ctx.beginPath();
        ctx.moveTo(20, 128);
        ctx.lineTo(38, 102);
        ctx.lineTo(90, 102);
        ctx.lineTo(108, 128);
        ctx.closePath();
        ctx.fill();

        // Светлый полотняный воротник и верёвочная завязка
        ctx.fillStyle = '#bcaaa4';
        ctx.beginPath();
        ctx.moveTo(46, 102);
        ctx.lineTo(64, 118);
        ctx.lineTo(82, 102);
        ctx.closePath();
        ctx.fill();

        // 2. ДЕРЕВЯННЫЙ ПОСОХ СТАРЦА (Слева по диагонали)
        ctx.strokeStyle = '#6d4c41';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(26, 44);
        ctx.lineTo(16, 128);
        ctx.stroke();

        // Сучок на верхушке посоха
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(25, 52);
        ctx.lineTo(19, 46);
        ctx.stroke();

        // 3. ОСТАТКИ СЕДЫХ ВОЛОС НА ВИСКАХ И УШИ
        ctx.fillStyle = '#cfd8dc'; // Седые пучки волос по бокам
        ctx.beginPath(); ctx.arc(41, 60, 8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(87, 60, 8, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#d7a184'; // Уши
        ctx.beginPath(); ctx.ellipse(40, 68, 4.5, 7.5, -0.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(88, 68, 4.5, 7.5, 0.1, 0, Math.PI * 2); ctx.fill();

        // 4. ГОЛОВА И ВЫСОКИЙ ЛЫСЫЙ ЧЕРЕП
        ctx.fillStyle = '#e5b296';
        ctx.beginPath();
        ctx.moveTo(43, 52);
        ctx.quadraticCurveTo(43, 24, 64, 24); // Гладкий купол лысой головы
        ctx.quadraticCurveTo(85, 24, 85, 52);
        ctx.lineTo(84, 82);
        ctx.lineTo(64, 98);
        ctx.lineTo(44, 82);
        ctx.closePath();
        ctx.fill();

        // Световой блик на лысой макушке
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.beginPath();
        ctx.ellipse(68, 33, 9, 4, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Морщинки мудрости на высоком лбу
        ctx.strokeStyle = '#c48d70';
        ctx.lineWidth = 1.1;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(52, 43); ctx.quadraticCurveTo(64, 41, 76, 43);
        ctx.moveTo(55, 48); ctx.quadraticCurveTo(64, 46, 73, 48);
        ctx.stroke();

        // 5. ПЫШНАЯ СЕДАЯ БОРОДА И ГУСТЫЕ УСЫ
        ctx.fillStyle = '#eceff1'; // Основная масса седой бороды
        ctx.beginPath();
        ctx.moveTo(44, 76);
        ctx.lineTo(38, 102);
        ctx.quadraticCurveTo(64, 126, 90, 102);
        ctx.lineTo(84, 76);
        ctx.quadraticCurveTo(64, 86, 44, 76);
        ctx.closePath();
        ctx.fill();

        // Седые усы поверх бороды
        ctx.fillStyle = '#cfd8dc';
        ctx.beginPath();
        ctx.moveTo(48, 78);
        ctx.quadraticCurveTo(64, 73, 80, 78);
        ctx.lineTo(82, 85);
        ctx.quadraticCurveTo(64, 81, 46, 85);
        ctx.closePath();
        ctx.fill();

        // 6. ГЛАЗА, ГУСТЫЕ СЕДЫЕ БРОВИ И НОС
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(54, 64, 4.2, 2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 64, 4.2, 2, 0, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#607d8b'; // Мудрые серо-стальные глаза
        ctx.beginPath(); ctx.arc(54, 64, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 64, 1.8, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(54.6, 63.3, 0.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74.6, 63.3, 0.6, 0, Math.PI * 2); ctx.fill();

        // Густые лохматые седые брови
        ctx.fillStyle = '#eceff1';
        ctx.beginPath();
        ctx.moveTo(46, 58); ctx.quadraticCurveTo(54, 54, 60, 59); ctx.lineTo(59, 61); ctx.quadraticCurveTo(53, 57, 46, 60); ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(82, 58); ctx.quadraticCurveTo(74, 54, 68, 59); ctx.lineTo(69, 61); ctx.quadraticCurveTo(75, 57, 82, 60); ctx.closePath(); ctx.fill();

        // Характерный нос старца
        ctx.fillStyle = '#d49876';
        ctx.beginPath();
        ctx.moveTo(64, 61);
        ctx.lineTo(68, 73);
        ctx.quadraticCurveTo(64, 76, 60, 73);
        ctx.closePath();
        ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Лёгкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 24);
        ctx.quadraticCurveTo(43, 24, 43, 52);
        ctx.lineTo(38, 102);
        ctx.lineTo(20, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },
    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ВОЛШЕБНОГО ДРАКОНЧИКА (В СТИЛЕ ГЕРОЕВ 3)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateFaerieDragonAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАДНИЙ ПЛАН: Полупрозрачные радужные крылья стрекозы / феи
        ctx.fillStyle = 'rgba(0, 242, 254, 0.28)';
        ctx.strokeStyle = '#70e1f5';
        ctx.lineWidth = 1.4;

        // Верхнее левое крыло
        ctx.beginPath();
        ctx.moveTo(46, 72);
        ctx.bezierCurveTo(12, 34, 4, 62, 36, 82);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Нижнее левое крыло
        ctx.beginPath();
        ctx.moveTo(46, 82);
        ctx.bezierCurveTo(16, 80, 14, 102, 42, 96);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Верхнее правое крыло
        ctx.beginPath();
        ctx.moveTo(82, 72);
        ctx.bezierCurveTo(116, 34, 124, 62, 92, 82);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Нижнее правое крыло
        ctx.beginPath();
        ctx.moveTo(82, 82);
        ctx.bezierCurveTo(112, 80, 114, 102, 86, 96);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 2. ИЗЯЩНАЯ ШЕЯ И ЛАЗУРНЫЕ ГРУДНЫЕ ПЛАСТИНЫ
        ctx.fillStyle = '#5b2c6f'; // Глубокая фиолетовая чешуя шеи
        ctx.beginPath();
        ctx.moveTo(50, 86);
        ctx.quadraticCurveTo(44, 108, 42, 128);
        ctx.lineTo(86, 128);
        ctx.quadraticCurveTo(84, 108, 78, 86);
        ctx.closePath();
        ctx.fill();

        // Светло-бирюзовые чешуйки-щитки на груди (как у волшебного дракона в HoMM3)
        ctx.fillStyle = '#48c9b0';
        ctx.beginPath();
        ctx.moveTo(55, 92);
        ctx.lineTo(73, 92);
        ctx.lineTo(76, 128);
        ctx.lineTo(52, 128);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#1b4f72';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(54, 104); ctx.quadraticCurveTo(64, 108, 74, 104);
        ctx.moveTo(53, 116); ctx.quadraticCurveTo(64, 120, 75, 116);
        ctx.stroke();

        // 3. ИЗЯЩНЫЕ ЗАГНУТЫЕ РОЖКИ И ОСТРЫЕ УШКИ-ПЛАВНИКИ
        ctx.fillStyle = '#f7dc6f'; // Золотисто-жемчужные рожки
        ctx.beginPath();
        ctx.moveTo(48, 44);
        ctx.quadraticCurveTo(32, 24, 38, 12);
        ctx.quadraticCurveTo(46, 26, 55, 42);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(80, 44);
        ctx.quadraticCurveTo(96, 24, 90, 12);
        ctx.quadraticCurveTo(82, 26, 73, 42);
        ctx.closePath();
        ctx.fill();

        // Перепончатые ушки-гребни по бокам головы
        ctx.fillStyle = '#a569bd';
        ctx.beginPath(); ctx.moveTo(42, 54); ctx.lineTo(22, 44); ctx.lineTo(40, 68); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(86, 54); ctx.lineTo(106, 44); ctx.lineTo(88, 68); ctx.closePath(); ctx.fill();

        // 4. ГОЛОВА И МОРДОЧКА ДРАКОНЧИКА (Изящная, озорная, пурпурно-лазурная)
        ctx.fillStyle = '#7d3c98'; // Насыщенный пурпурный окрас
        ctx.beginPath();
        ctx.moveTo(46, 44);
        ctx.quadraticCurveTo(64, 32, 82, 44);
        ctx.lineTo(88, 66);
        ctx.lineTo(74, 88);
        ctx.lineTo(64, 94);
        ctx.lineTo(54, 88);
        ctx.lineTo(40, 66);
        ctx.closePath();
        ctx.fill();

        // Бирюзовый лобный гребень и щечки (радужный перелив)
        ctx.fillStyle = '#45b39d';
        ctx.beginPath();
        ctx.moveTo(58, 38);
        ctx.lineTo(64, 26);
        ctx.lineTo(70, 38);
        ctx.lineTo(64, 54);
        ctx.closePath();
        ctx.fill();

        // 5. БОЛЬШИЕ ВЫРАЗИТЕЛЬНЫЕ ГЛАЗА И ОЗОРНАЯ УЛЫБКА С КЛЫЧКАМИ
        ctx.fillStyle = '#f4d03f'; // Сияющая золотая радужка
        ctx.beginPath(); ctx.ellipse(51, 60, 6.5, 4.5, -0.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(77, 60, 6.5, 4.5, 0.2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#111111'; // Вертикальные драконьи зрачки
        ctx.beginPath(); ctx.ellipse(51, 60, 1.8, 4, -0.15, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(77, 60, 1.8, 4, 0.15, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff'; // Крупные живые блики
        ctx.beginPath(); ctx.arc(53, 58, 1.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 58, 1.4, 0, Math.PI * 2); ctx.fill();

        // Ноздри на кончике мордочки
        ctx.fillStyle = '#2e1138';
        ctx.beginPath(); ctx.arc(60, 72, 1.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(68, 72, 1.4, 0, Math.PI * 2); ctx.fill();

        // Хитрая ухмылка и крошечные острые клычки
        ctx.strokeStyle = '#2e1138';
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(49, 77);
        ctx.quadraticCurveTo(64, 86, 79, 77);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.moveTo(53, 79); ctx.lineTo(55, 84); ctx.lineTo(57, 80); ctx.fill(); // Левый клычок
        ctx.beginPath(); ctx.moveTo(75, 79); ctx.lineTo(73, 84); ctx.lineTo(71, 80); ctx.fill(); // Правый клычок

        // 6. ВОЛШЕБНЫЕ ИСКРЫ-ЗВЕЗДОЧКИ ВОКРУГ ДРАКОНЧИКА
        ctx.fillStyle = '#ffd875';
        ctx.beginPath(); ctx.arc(24, 28, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(104, 26, 2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#00f2fe';
        ctx.beginPath(); ctx.arc(16, 62, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(112, 64, 2.2, 0, Math.PI * 2); ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 26);
        ctx.lineTo(46, 44);
        ctx.lineTo(40, 66);
        ctx.lineTo(54, 88);
        ctx.lineTo(64, 94);
        ctx.lineTo(64, 128);
        ctx.lineTo(42, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },
    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ЗОМБИ НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateZombieAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. РВАНАЯ ОДЕЖДА: Грязные лохмотья на перекошенных плечах
        ctx.fillStyle = '#3e3832';
        ctx.beginPath();
        ctx.moveTo(18, 128);
        ctx.lineTo(36, 100);
        ctx.lineTo(52, 104);
        ctx.lineTo(64, 118);
        ctx.lineTo(78, 102);
        ctx.lineTo(94, 98);
        ctx.lineTo(110, 128);
        ctx.closePath();
        ctx.fill();

        // Рваные зубцы ткани на вороте
        ctx.fillStyle = '#26221e';
        ctx.beginPath();
        ctx.moveTo(46, 102); ctx.lineTo(54, 116); ctx.lineTo(60, 105); ctx.lineTo(68, 120); ctx.lineTo(78, 102);
        ctx.closePath();
        ctx.fill();

        // 2. ХУДАЯ ШЕЯ С ТРУПНЫМИ ПЯТНАМИ И РВАНОЕ УХО
        ctx.fillStyle = '#6b7d64';
        ctx.fillRect(54, 86, 20, 18);

        ctx.fillStyle = '#758a6d'; // Левое ухо
        ctx.beginPath(); ctx.ellipse(41, 66, 4.5, 7.5, -0.15, 0, Math.PI * 2); ctx.fill();
        // Надкусанное правое ухо
        ctx.beginPath(); ctx.moveTo(85, 60); ctx.lineTo(91, 63); ctx.lineTo(87, 68); ctx.lineTo(90, 72); ctx.lineTo(84, 74); ctx.closePath(); ctx.fill();

        // 3. ЧЕРЕП И ВПАЛЫЕ ЩЁКИ МЕРТВЕЦА
        ctx.fillStyle = '#7d9474'; // Трупно-зеленовато-серый оттенок кожи
        ctx.beginPath();
        ctx.moveTo(44, 50);
        ctx.quadraticCurveTo(44, 28, 64, 28);
        ctx.quadraticCurveTo(84, 28, 84, 50);
        ctx.lineTo(86, 68);
        ctx.lineTo(79, 82); // Впалая правая щека
        ctx.lineTo(66, 98);
        ctx.lineTo(49, 82); // Впалая левая щека
        ctx.lineTo(42, 68);
        ctx.closePath();
        ctx.fill();

        // Фиолетовые трупные пятна и синяки на лбу и скуле
        ctx.fillStyle = 'rgba(88, 44, 102, 0.35)';
        ctx.beginPath(); ctx.arc(54, 40, 7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(78, 74, 5.5, 0, Math.PI * 2); ctx.fill();

        // Обнажённая кость черепа на виске (маленькая царапина)
        ctx.fillStyle = '#dcd6c8';
        ctx.beginPath(); ctx.ellipse(76, 42, 4, 2.5, 0.4, 0, Math.PI * 2); ctx.fill();

        // 4. РЕДКИЕ КЛОЧЬЯ СПУТАННЫХ ВОЛОС
        ctx.strokeStyle = '#2c2825';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(48, 34); ctx.quadraticCurveTo(42, 24, 38, 30);
        ctx.moveTo(58, 29); ctx.quadraticCurveTo(56, 18, 51, 21);
        ctx.moveTo(67, 29); ctx.quadraticCurveTo(72, 17, 77, 22);
        ctx.moveTo(78, 34); ctx.quadraticCurveTo(86, 25, 89, 32);
        ctx.stroke();

        // 5. АСИММЕТРИЧНЫЕ ГЛАЗА ЗОМБИ (Один мутный белый, второй тёмный провал)
        // Тёмные круги под глазами
        ctx.fillStyle = 'rgba(42, 26, 48, 0.5)';
        ctx.beginPath(); ctx.arc(53, 62, 7.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 63, 7, 0, Math.PI * 2); ctx.fill();

        // Левый глаз — крупный, вытаращенный, мутно-молочный с крошечным зрачком
        ctx.fillStyle = '#ecf0f1';
        ctx.beginPath(); ctx.arc(53, 62, 5.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#95a5a6';
        ctx.beginPath(); ctx.arc(52, 61, 1.5, 0, Math.PI * 2); ctx.fill();

        // Правый глаз — прищуренный, тёмный с жёлтой точкой
        ctx.fillStyle = '#1e1624';
        ctx.beginPath(); ctx.ellipse(75, 63, 4.5, 2.5, 0.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath(); ctx.arc(75, 63, 1.1, 0, Math.PI * 2); ctx.fill();

        // 6. ПРОВАЛ НОСА И ПЕРЕКОШЕННАЯ ПАСТЬ С КРИВЫМИ ЗУБАМИ
        ctx.fillStyle = '#2d3629'; // Тёмные ноздри
        ctx.beginPath(); ctx.moveTo(64, 67); ctx.lineTo(61, 74); ctx.lineTo(63, 74); ctx.fill();
        ctx.beginPath(); ctx.moveTo(65, 67); ctx.lineTo(68, 74); ctx.lineTo(66, 74); ctx.fill();

        // Раскрытая перекошенная пасть
        ctx.fillStyle = '#1f121b';
        ctx.beginPath();
        ctx.moveTo(50, 82);
        ctx.quadraticCurveTo(64, 79, 78, 84);
        ctx.lineTo(75, 91);
        ctx.quadraticCurveTo(63, 89, 52, 88);
        ctx.closePath();
        ctx.fill();

        // Кривые гнилые зубы
        ctx.fillStyle = '#d4cba8';
        ctx.fillRect(54, 81, 3, 3.5);
        ctx.fillRect(63, 81, 2.5, 3);
        ctx.fillRect(71, 82, 3, 3.5);
        ctx.fillRect(58, 86, 3, 3);
        ctx.fillRect(67, 87, 2.5, 3);

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 28);
        ctx.quadraticCurveTo(44, 28, 44, 50);
        ctx.lineTo(42, 68);
        ctx.lineTo(49, 82);
        ctx.lineTo(66, 98);
        ctx.lineTo(64, 128);
        ctx.lineTo(18, 128);
        ctx.lineTo(36, 100);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },
    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ СКЕЛЕТА НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateSkeletonAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. РЖАВЫЙ ЗАЗУБРЕННЫЙ МЕЧ ЗА СПИНОЙ (По диагонали справа налево)
        ctx.save();
        ctx.translate(64, 64);
        ctx.rotate((Math.PI / 180) * 32);
        ctx.translate(-64, -64);

        // Клинок меча с зазубринами
        ctx.fillStyle = '#7f8c8d';
        ctx.beginPath();
        ctx.moveTo(60, 8);
        ctx.lineTo(64, 2);
        ctx.lineTo(68, 8);
        ctx.lineTo(68, 95);
        ctx.lineTo(60, 95);
        ctx.closePath();
        ctx.fill();

        // Светлая грань лезвия
        ctx.fillStyle = '#bdc3c7';
        ctx.fillRect(64, 8, 4, 87);

        // Ржавая гарда
        ctx.fillStyle = '#5d4037';
        ctx.fillRect(50, 95, 28, 5);
        ctx.restore();

        // 2. КОСТЯНОЙ ПОЗВОНОЧНИК, КЛЮЧИЦЫ И РЁБРА (Внизу)
        ctx.fillStyle = '#cfc9b8';
        // Позвонки шеи
        ctx.fillRect(58, 88, 12, 6);
        ctx.fillRect(57, 96, 14, 6);
        ctx.fillRect(56, 104, 16, 24);

        // Ключицы и верхние дуги рёбер
        ctx.strokeStyle = '#e5e0d0';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        // Ключицы
        ctx.moveTo(64, 102); ctx.quadraticCurveTo(44, 98, 28, 110);
        ctx.moveTo(64, 102); ctx.quadraticCurveTo(84, 98, 100, 110);
        // Первая пара рёбер
        ctx.moveTo(64, 112); ctx.quadraticCurveTo(42, 110, 32, 124);
        ctx.moveTo(64, 112); ctx.quadraticCurveTo(86, 110, 96, 124);
        // Вторая пара рёбер
        ctx.moveTo(64, 122); ctx.quadraticCurveTo(46, 121, 40, 128);
        ctx.moveTo(64, 122); ctx.quadraticCurveTo(82, 121, 88, 128);
        ctx.stroke();

        // 3. ЧЕРЕП СКЕЛЕТА (Анатомический купол, скулы и челюсть)
        ctx.fillStyle = '#e8e4d5'; // Старая пожелтевшая кость
        ctx.beginPath();
        ctx.moveTo(42, 54);
        ctx.quadraticCurveTo(41, 24, 64, 24); // Купол черепа
        ctx.quadraticCurveTo(87, 24, 86, 54);
        ctx.lineTo(89, 68); // Правая скула
        ctx.lineTo(79, 77);
        ctx.lineTo(76, 92); // Правый угол нижней челюсти
        ctx.lineTo(52, 92); // Левый угол нижней челюсти
        ctx.lineTo(49, 77);
        ctx.lineTo(39, 68); // Левая скула
        ctx.closePath();
        ctx.fill();

        // Тёмные височные впадины и скуловые тени
        ctx.fillStyle = '#c9c3b0';
        ctx.beginPath(); ctx.ellipse(44, 54, 3.5, 9, 0.15, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(84, 54, 3.5, 9, -0.15, 0, Math.PI * 2); ctx.fill();

        // Трещина на лобной кости
        ctx.strokeStyle = '#5c5649';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(55, 27);
        ctx.lineTo(58, 36);
        ctx.lineTo(54, 42);
        ctx.lineTo(57, 47);
        ctx.stroke();

        // 4. ГЛУБОКИЕ ЧЁРНЫЕ ГЛАЗНИЦЫ И ТЛЕЮЩИЕ ОГОНЬКИ НЕЖИТИ
        ctx.fillStyle = '#141118';
        ctx.beginPath(); ctx.ellipse(52, 60, 7.5, 6.5, -0.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(76, 60, 7.5, 6.5, 0.1, 0, Math.PI * 2); ctx.fill();

        // Зловещие неоново-оранжевые огоньки в центре глазниц
        ctx.fillStyle = '#ff5722';
        ctx.beginPath(); ctx.arc(52, 60, 2.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 60, 2.6, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffd875'; // Яркие ядра искр
        ctx.beginPath(); ctx.arc(52, 60, 1.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 60, 1.1, 0, Math.PI * 2); ctx.fill();

        // 5. ТРЕУГОЛЬНЫЙ НОСОВОЙ ПРОВАЛ И ОСКАЛ ЗУБОВ
        ctx.fillStyle = '#141118';
        ctx.beginPath();
        ctx.moveTo(64, 65);
        ctx.lineTo(68, 74);
        ctx.lineTo(64, 72);
        ctx.lineTo(60, 74);
        ctx.closePath();
        ctx.fill();

        // Тёмная щель приоткрытых челюстей
        ctx.fillStyle = '#24201c';
        ctx.fillRect(52, 81, 24, 6);

        // Костяные зубы (верхний и нижний ряд)
        ctx.fillStyle = '#f5f2e6';
        for (let x = 53; x <= 73; x += 4) {
            ctx.fillRect(x, 79, 3, 4);   // Верхний зуб
            ctx.fillRect(x, 84.5, 3, 4); // Нижний зуб
        }

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину черепа)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 24);
        ctx.quadraticCurveTo(41, 24, 42, 54);
        ctx.lineTo(39, 68);
        ctx.lineTo(49, 77);
        ctx.lineTo(52, 92);
        ctx.lineTo(64, 92);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ГОРОДСКОГО СТРАЖНИКА НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateGuardAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. АЛЕБАРДА / КОПЬЁ СТРАЖНИКА НА ЗАДНЕМ ПЛАНЕ (Справа вертикально)
        ctx.strokeStyle = '#5d4037'; // Деревянное древко
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(106, 28);
        ctx.lineTo(106, 128);
        ctx.stroke();

        // Стальной наконечник копья-алебарды
        ctx.fillStyle = '#bdc3c7';
        ctx.beginPath();
        ctx.moveTo(106, 6);
        ctx.lineTo(114, 26);
        ctx.lineTo(106, 32);
        ctx.lineTo(98, 26);
        ctx.closePath();
        ctx.fill();

        // Боковой топор-лезвие алебарды
        ctx.fillStyle = '#95a5a6';
        ctx.beginPath();
        ctx.moveTo(108, 16);
        ctx.quadraticCurveTo(124, 14, 122, 34);
        ctx.lineTo(108, 28);
        ctx.closePath();
        ctx.fill();

        // 2. ДОСПЕХИ, КОЛЬЧУГА И СИНИЙ ГОРОДСКОЙ ТАБАРД
        // Латные наплечники
        ctx.fillStyle = '#57606f';
        ctx.beginPath();
        ctx.moveTo(18, 128);
        ctx.lineTo(36, 98);
        ctx.lineTo(92, 98);
        ctx.lineTo(110, 128);
        ctx.closePath();
        ctx.fill();

        // Синий геральдический табард стражи по центру
        ctx.fillStyle = '#1e3799';
        ctx.beginPath();
        ctx.moveTo(42, 100);
        ctx.lineTo(36, 128);
        ctx.lineTo(92, 128);
        ctx.lineTo(86, 100);
        ctx.closePath();
        ctx.fill();

        // Золотая окантовка табарда и нагрудная пряжка
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(43, 102); ctx.lineTo(38, 128);
        ctx.moveTo(85, 102); ctx.lineTo(90, 128);
        ctx.stroke();

        // Кольчужная бармица на шее
        ctx.fillStyle = '#3d4552';
        ctx.beginPath();
        ctx.moveTo(44, 82);
        ctx.lineTo(84, 82);
        ctx.lineTo(86, 104);
        ctx.lineTo(64, 114);
        ctx.lineTo(42, 104);
        ctx.closePath();
        ctx.fill();

        // 3. ЛИЦО СТРАЖНИКА (Суровое, бдительное, с усами и щетиной)
        ctx.fillStyle = '#e5b296';
        ctx.beginPath();
        ctx.moveTo(44, 54);
        ctx.lineTo(84, 54);
        ctx.lineTo(82, 82);
        ctx.lineTo(64, 96);
        ctx.lineTo(46, 82);
        ctx.closePath();
        ctx.fill();

        // Лёгкая тёмная щетина на челюсти
        ctx.fillStyle = 'rgba(30, 35, 42, 0.22)';
        ctx.beginPath();
        ctx.moveTo(46, 76);
        ctx.lineTo(64, 96);
        ctx.lineTo(82, 76);
        ctx.lineTo(81, 83);
        ctx.lineTo(64, 96);
        ctx.lineTo(47, 83);
        ctx.closePath();
        ctx.fill();

        // 4. СТАЛЬНОЙ ШЛЕМ-ШАПЕЛЬ С ШИРОКИМИ ПОЛЯМИ И НАНОСНИКОМ
        // Купол шлема
        ctx.fillStyle = '#718093';
        ctx.beginPath();
        ctx.moveTo(38, 48);
        ctx.quadraticCurveTo(42, 22, 64, 20);
        ctx.quadraticCurveTo(86, 22, 90, 48);
        ctx.closePath();
        ctx.fill();

        // Широкие защитные поля шапели
        ctx.fillStyle = '#8395a7';
        ctx.beginPath();
        ctx.moveTo(26, 52);
        ctx.quadraticCurveTo(64, 42, 102, 52);
        ctx.lineTo(96, 57);
        ctx.quadraticCurveTo(64, 49, 32, 57);
        ctx.closePath();
        ctx.fill();

        // Металлические заклёпки на ободе шлема
        ctx.fillStyle = '#dcdde1';
        ctx.beginPath(); ctx.arc(44, 48, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(64, 45, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(84, 48, 1.5, 0, Math.PI * 2); ctx.fill();

        // Короткий стальной наносник
        ctx.fillStyle = '#57606f';
        ctx.fillRect(62, 50, 4, 15);

        // 5. БДИТЕЛЬНЫЙ ВЗГЛЯД, БРОВИ И УСЫ ОФИЦЕРА
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(53, 63, 4.5, 2, -0.08, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 63, 4.5, 2, 0.08, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#2c3e50';
        ctx.beginPath(); ctx.arc(53, 63, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 63, 1.8, 0, Math.PI * 2); ctx.fill();

        // Сдвинутые строгие брови
        ctx.strokeStyle = '#2f241d';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(46, 57); ctx.lineTo(58, 59); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(82, 57); ctx.lineTo(70, 59); ctx.stroke();

        // Аккуратные уставные усы
        ctx.fillStyle = '#3b2c22';
        ctx.beginPath();
        ctx.moveTo(51, 80);
        ctx.quadraticCurveTo(64, 75, 77, 80);
        ctx.lineTo(79, 84);
        ctx.quadraticCurveTo(64, 80, 49, 84);
        ctx.closePath();
        ctx.fill();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
        ctx.beginPath();
        ctx.moveTo(64, 20);
        ctx.quadraticCurveTo(42, 22, 38, 48);
        ctx.lineTo(26, 52);
        ctx.lineTo(46, 82);
        ctx.lineTo(36, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ЗЕЛЕНО-КОРИЧНЕВОГО ЖАБОЛЮДА С КОЛЮЧКАМИ НА ГОЛОВЕ
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateBoggardAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ПЛЕЧИ И БОЛОТНАЯ ПЕРЕВЯЗЬ ИЗ КОЖИ И КОСТЕЙ
        ctx.fillStyle = '#4a472a'; // Болотно-коричневая кожа плеч
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(34, 92);
        ctx.lineTo(94, 92);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        // Грубый кожаный ремень через плечо
        ctx.fillStyle = '#3b2818';
        ctx.beginPath();
        ctx.moveTo(32, 95);
        ctx.lineTo(54, 128);
        ctx.lineTo(66, 128);
        ctx.lineTo(42, 92);
        ctx.closePath();
        ctx.fill();

        // Костяная пряжка-амулет на ремне
        ctx.fillStyle = '#dcd6c8';
        ctx.beginPath();
        ctx.arc(46, 108, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // 2. НЕБОЛЬШИЕ КОСТЯНЫЕ КОЛЮЧКИ НА ГОЛОВЕ (Среднее количество: 7 шипов веером)
        ctx.fillStyle = '#cfc5ad';
        ctx.strokeStyle = '#2d2918';
        ctx.lineWidth = 1;

        const spikes = [
            { x1: 42, y1: 48, tx: 33, ty: 37, x2: 47, y2: 43 },
            { x1: 48, y1: 42, tx: 42, ty: 29, x2: 54, y2: 39 },
            { x1: 55, y1: 38, tx: 52, ty: 24, x2: 60, y2: 37 },
            { x1: 61, y1: 37, tx: 64, ty: 22, x2: 67, y2: 37 }, // Центральный шип
            { x1: 68, y1: 37, tx: 76, ty: 24, x2: 73, y2: 38 },
            { x1: 74, y1: 39, tx: 86, ty: 29, x2: 80, y2: 42 },
            { x1: 81, y1: 43, tx: 95, ty: 37, x2: 86, y2: 48 }
        ];

        spikes.forEach(s => {
            ctx.beginPath();
            ctx.moveTo(s.x1, s.y1);
            ctx.lineTo(s.tx, s.ty);
            ctx.lineTo(s.x2, s.y2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        });

        // 3. ГОЛОВА И ГОРЛОВОЙ МЕШОК ЖАБОЛЮДА (Зелено-коричневый окрас)
        ctx.fillStyle = '#5c5832'; // Основной оливково-коричневый тон кожи
        ctx.beginPath();
        ctx.moveTo(38, 52);
        ctx.quadraticCurveTo(64, 34, 90, 52);
        ctx.lineTo(102, 78); // Широкие жабьи скулы
        ctx.lineTo(88, 102);
        ctx.quadraticCurveTo(64, 110, 40, 102);
        ctx.lineTo(26, 78);
        ctx.closePath();
        ctx.fill();

        // Охристо-коричневый горловой мешок снизу
        ctx.fillStyle = '#827345';
        ctx.beginPath();
        ctx.moveTo(38, 78);
        ctx.quadraticCurveTo(64, 72, 90, 78);
        ctx.lineTo(84, 100);
        ctx.quadraticCurveTo(64, 106, 44, 100);
        ctx.closePath();
        ctx.fill();

        // Бугорки и коричнево-зелёные пятна по бокам морды
        ctx.fillStyle = '#3f3d21';
        ctx.beginPath(); ctx.arc(36, 68, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(92, 68, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(46, 56, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(82, 56, 2.5, 0, Math.PI * 2); ctx.fill();

        // 4. ВЫПУКЛЫЕ ЖАБЬИ ГЛАЗА (Надбровные дуги с парой мелких шипиков)
        // Кожные веки
        ctx.fillStyle = '#484526';
        ctx.beginPath(); ctx.arc(42, 48, 10.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(86, 48, 10.5, 0, Math.PI * 2); ctx.fill();

        // Золотисто-янтарная радужка
        ctx.fillStyle = '#e67e22';
        ctx.beginPath(); ctx.arc(42, 49, 7.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(86, 49, 7.5, 0, Math.PI * 2); ctx.fill();

        // Горизонтальные амфибийные зрачки
        ctx.fillStyle = '#111111';
        ctx.fillRect(35, 48, 14, 2.4);
        ctx.fillRect(79, 48, 14, 2.4);

        // Яркие белые блики
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(44, 46, 1.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(84, 46, 1.4, 0, Math.PI * 2); ctx.fill();

        // 5. НОЗДРИ И ШИРОКИЙ ХИЩНЫЙ РОТ ЖАБОЛЮДА
        ctx.fillStyle = '#292714';
        ctx.beginPath(); ctx.arc(58, 60, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(70, 60, 1.8, 0, Math.PI * 2); ctx.fill();

        // Широкая пасть от щеки до щеки
        ctx.strokeStyle = '#242211';
        ctx.lineWidth = 2.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(31, 75);
        ctx.quadraticCurveTo(64, 86, 97, 75);
        ctx.stroke();

        // Пара мелких костяных зубцов по краям нижней губы
        ctx.fillStyle = '#e8e4d5';
        ctx.beginPath(); ctx.moveTo(43, 79); ctx.lineTo(45, 74); ctx.lineTo(47, 80); ctx.fill();
        ctx.beginPath(); ctx.moveTo(85, 79); ctx.lineTo(83, 74); ctx.lineTo(81, 80); ctx.fill();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 22);
        ctx.lineTo(38, 52);
        ctx.lineTo(26, 78);
        ctx.lineTo(34, 92);
        ctx.lineTo(16, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ СКЕЛЕТА-ВОИНА В ШЛЕМЕ-КОТЕЛКЕ С МЕЧОМ
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateSkeletonWarriorAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ДОСПЕХИ И КОСТИ ГРУДНОЙ КЛЕТКИ (Задний план)
        // Потрёпанные ржавые наплечники
        ctx.fillStyle = '#3d4552';
        ctx.beginPath();
        ctx.moveTo(20, 128);
        ctx.lineTo(36, 98);
        ctx.lineTo(92, 98);
        ctx.lineTo(108, 128);
        ctx.closePath();
        ctx.fill();

        // Пятно ржавчины на наплечнике
        ctx.fillStyle = '#6e3b23';
        ctx.beginPath();
        ctx.arc(86, 114, 7, 0, Math.PI * 2);
        ctx.fill();

        // Костяные позвонки и ключицы по центру выреза
        ctx.fillStyle = '#cfc9b8';
        ctx.fillRect(58, 90, 12, 38);

        ctx.strokeStyle = '#e5e0d0';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(64, 102); ctx.quadraticCurveTo(46, 98, 34, 108);
        ctx.moveTo(64, 102); ctx.quadraticCurveTo(82, 98, 94, 108);
        ctx.stroke();

        // 2. ЧЕРЕП СКЕЛЕТА (Выглядывает из-под полей шлема-котелка)
        ctx.fillStyle = '#e8e4d5';
        ctx.beginPath();
        ctx.moveTo(42, 52);
        ctx.lineTo(86, 52);
        ctx.lineTo(88, 68);
        ctx.lineTo(79, 77);
        ctx.lineTo(76, 92);
        ctx.lineTo(52, 92);
        ctx.lineTo(49, 77);
        ctx.lineTo(40, 68);
        ctx.closePath();
        ctx.fill();

        // Тёмные скуловые впадины
        ctx.fillStyle = '#c9c3b0';
        ctx.beginPath(); ctx.ellipse(45, 58, 3.5, 7, 0.15, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(83, 58, 3.5, 7, -0.15, 0, Math.PI * 2); ctx.fill();

        // 3. ГЛУБОКИЕ ГЛАЗНИЦЫ И ТЛЕЮЩИЕ ЗЛОВЕЩИЕ ОГОНЬКИ
        ctx.fillStyle = '#141118';
        ctx.beginPath(); ctx.ellipse(52, 62, 7.2, 6, -0.08, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(76, 62, 7.2, 6, 0.08, 0, Math.PI * 2); ctx.fill();

        // Неоново-алые зрачки нежити
        ctx.fillStyle = '#ff5722';
        ctx.beginPath(); ctx.arc(52, 62, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 62, 2.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffd875';
        ctx.beginPath(); ctx.arc(52, 62, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 62, 1, 0, Math.PI * 2); ctx.fill();

        // Носовой провал и оскал костяных зубов
        ctx.fillStyle = '#141118';
        ctx.beginPath();
        ctx.moveTo(64, 67);
        ctx.lineTo(68, 75);
        ctx.lineTo(64, 73);
        ctx.lineTo(60, 75);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#24201c';
        ctx.fillRect(52, 81, 24, 6);

        ctx.fillStyle = '#f5f2e6';
        for (let x = 53; x <= 73; x += 4) {
            ctx.fillRect(x, 79, 3, 4);
            ctx.fillRect(x, 84.5, 3, 4);
        }

        // 4. СТАЛЬНОЙ ШЛЕМ-КОТЕЛОК С ШИРОКИМИ ПОЛЯМИ И ВМЯТИНОЙ
        // Полукруглый купол котелка
        ctx.fillStyle = '#636e72';
        ctx.beginPath();
        ctx.arc(64, 48, 25, Math.PI, Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        // Ржавое пятно и боевая зарубка на куполе шлема
        ctx.fillStyle = '#794628';
        ctx.beginPath(); ctx.ellipse(53, 35, 6, 3.5, -0.3, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#2d3436';
        ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(72, 27); ctx.lineTo(76, 36); ctx.stroke();

        // Широкие округлые поля котелка
        ctx.fillStyle = '#7f8c8d';
        ctx.beginPath();
        ctx.moveTo(24, 51);
        ctx.quadraticCurveTo(64, 43, 104, 51);
        ctx.lineTo(100, 56);
        ctx.quadraticCurveTo(64, 49, 28, 56);
        ctx.closePath();
        ctx.fill();

        // Заклёпки по ободу котелка
        ctx.fillStyle = '#dcdde1';
        ctx.beginPath(); ctx.arc(44, 47, 1.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(64, 45, 1.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(84, 47, 1.4, 0, Math.PI * 2); ctx.fill();

        // 5. БОЕВОЙ МЕЧ НА ПЕРЕДНЕМ ПЛАНЕ (По диагонали слева вверх)
        ctx.save();
        ctx.translate(32, 92);
        ctx.rotate((Math.PI / 180) * -28);
        ctx.translate(-32, -92);

        // Клинок меча
        ctx.fillStyle = '#b2bec3';
        ctx.beginPath();
        ctx.moveTo(29, 32);
        ctx.lineTo(32, 22);
        ctx.lineTo(35, 32);
        ctx.lineTo(35, 96);
        ctx.lineTo(29, 96);
        ctx.closePath();
        ctx.fill();

        // Светлая острая грань лезвия
        ctx.fillStyle = '#dfe6e9';
        ctx.beginPath();
        ctx.moveTo(32, 22);
        ctx.lineTo(35, 32);
        ctx.lineTo(35, 96);
        ctx.lineTo(32, 96);
        ctx.closePath();
        ctx.fill();

        // Зазубрина на клинке
        ctx.fillStyle = '#2d3436';
        ctx.beginPath(); ctx.moveTo(29, 54); ctx.lineTo(31.5, 56); ctx.lineTo(29, 58); ctx.fill();

        // Стальная гарда, рукоять и навершие
        ctx.fillStyle = '#57606f';
        ctx.fillRect(21, 96, 22, 4);
        ctx.fillStyle = '#3e2723';
        ctx.fillRect(30, 100, 4, 16);
        ctx.fillStyle = '#7f8c8d';
        ctx.beginPath(); ctx.arc(32, 118, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 23);
        ctx.arc(64, 48, 25, Math.PI * 1.5, Math.PI, true);
        ctx.lineTo(24, 51);
        ctx.lineTo(40, 68);
        ctx.lineTo(52, 92);
        ctx.lineTo(20, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ БОЛОТНОЙ КАРГИ НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateHagAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. РВАНЫЕ ЛОХМОТЬЯ И ШАЛЬ НА СГОРБЛЕННЫХ ПЛЕЧАХ
        ctx.fillStyle = '#1e241b';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(34, 94);
        ctx.lineTo(94, 94);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        // Ожерелье из мелких костей и клыков на шее
        ctx.fillStyle = '#dcd6c8';
        ctx.beginPath(); ctx.moveTo(50, 102); ctx.lineTo(52, 111); ctx.lineTo(55, 103); ctx.fill();
        ctx.beginPath(); ctx.moveTo(62, 105); ctx.lineTo(64, 115); ctx.lineTo(66, 105); ctx.fill();
        ctx.beginPath(); ctx.moveTo(78, 102); ctx.lineTo(76, 111); ctx.lineTo(73, 103); ctx.fill();

        // 2. ДЛИННЫЕ СПУТАННЫЕ СЕДЫЕ ВОЛОСЫ НА ЗАДНЕМ ПЛАНЕ
        ctx.fillStyle = '#8395a7';
        ctx.beginPath();
        ctx.moveTo(34, 52);
        ctx.lineTo(22, 122);
        ctx.lineTo(42, 114);
        ctx.lineTo(86, 114);
        ctx.lineTo(106, 122);
        ctx.lineTo(94, 52);
        ctx.closePath();
        ctx.fill();

        // 3. КОСТЛЯВОЕ МОРЩИНИСТОЕ ЛИЦО КАРГИ (Болотно-серо-зелёный тон)
        ctx.fillStyle = '#6c7a5e';
        ctx.beginPath();
        ctx.moveTo(44, 50);
        ctx.lineTo(84, 50);
        ctx.lineTo(86, 72);
        ctx.lineTo(75, 86);
        ctx.lineTo(64, 102); // Острый выдающийся подбородок ведьмы
        ctx.lineTo(53, 86);
        ctx.lineTo(42, 72);
        ctx.closePath();
        ctx.fill();

        // Глубокие морщины на лбу и у скул
        ctx.strokeStyle = '#3d4734';
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(52, 52); ctx.quadraticCurveTo(64, 49, 76, 52);
        ctx.moveTo(47, 74); ctx.lineTo(54, 83);
        ctx.moveTo(81, 74); ctx.lineTo(74, 83);
        ctx.stroke();

        // 4. АСИММЕТРИЧНЫЕ ВЕДЬМИНСКИЕ ГЛАЗА (Один слепой с бельмом, второй горящий жёлтый)
        // Тёмные впадины глазниц
        ctx.fillStyle = '#2d3326';
        ctx.beginPath(); ctx.ellipse(53, 63, 6, 3.2, -0.15, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 63, 6, 3.2, 0.15, 0, Math.PI * 2); ctx.fill();

        // Левый глаз — мутно-белый слепой
        ctx.fillStyle = '#dfe6e9';
        ctx.beginPath(); ctx.arc(53, 63, 3, 0, Math.PI * 2); ctx.fill();

        // Правый глаз — пронзительный жёлтый огонёк с узким зрачком
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath(); ctx.arc(75, 63, 3.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#111111';
        ctx.fillRect(74.4, 60.5, 1.3, 5);

        // Нависшие косматые седые брови
        ctx.strokeStyle = '#cfd8dc';
        ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.moveTo(45, 57); ctx.lineTo(59, 60); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(83, 57); ctx.lineTo(69, 60); ctx.stroke();

        // 5. ДЛИННЫЙ НОС КРЮЧКОМ С БОРОДАВКОЙ И ЗЛОВЕЩАЯ УХМЫЛКА
        ctx.fillStyle = '#556149';
        ctx.beginPath();
        ctx.moveTo(62, 61);
        ctx.lineTo(67, 61);
        ctx.lineTo(70, 79); // Длинный крючковатый кончик носа
        ctx.quadraticCurveTo(63, 83, 59, 77);
        ctx.closePath();
        ctx.fill();

        // Бородавка на носу
        ctx.fillStyle = '#3b4232';
        ctx.beginPath(); ctx.arc(68, 73, 2, 0, Math.PI * 2); ctx.fill();

        // Кривая ухмылка с парой жёлтых клычков
        ctx.strokeStyle = '#1e241b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(51, 87);
        ctx.quadraticCurveTo(64, 93, 77, 86);
        ctx.stroke();

        ctx.fillStyle = '#e6d8a8';
        ctx.beginPath(); ctx.moveTo(56, 88); ctx.lineTo(58, 93); ctx.lineTo(60, 89); ctx.fill();
        ctx.beginPath(); ctx.moveTo(72, 88); ctx.lineTo(70, 93); ctx.lineTo(68, 89); ctx.fill();

        // 6. РВАНЫЙ ТЁМНЫЙ ВЕДЬМИНСКИЙ КАПЮШОН
        ctx.fillStyle = '#262e21';
        ctx.beginPath();
        ctx.moveTo(36, 56);
        ctx.quadraticCurveTo(44, 22, 64, 18); // Острый загнутый верх капюшона
        ctx.quadraticCurveTo(84, 22, 92, 56);
        ctx.lineTo(86, 60);
        ctx.quadraticCurveTo(64, 44, 42, 60);
        ctx.closePath();
        ctx.fill();

        // Выбивающиеся пряди седых волос из-под капюшона
        ctx.strokeStyle = '#b2bec3';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(43, 54); ctx.quadraticCurveTo(37, 74, 41, 92);
        ctx.moveTo(85, 54); ctx.quadraticCurveTo(91, 74, 87, 92);
        ctx.stroke();

        // 7. КОРЯВЫЙ ПОСОХ С ЗЕЛЁНЫМ ЧЕРЕПОМ / КАМНЕМ (Справа)
        ctx.strokeStyle = '#4a3525';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(106, 36);
        ctx.quadraticCurveTo(102, 78, 108, 128);
        ctx.stroke();

        // Светящийся болотный кристалл-амулет на навершии посоха
        ctx.fillStyle = 'rgba(46, 204, 113, 0.35)';
        ctx.beginPath(); ctx.arc(106, 32, 10, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#2ecc71';
        ctx.beginPath();
        ctx.moveTo(106, 22);
        ctx.lineTo(112, 32);
        ctx.lineTo(106, 42);
        ctx.lineTo(100, 32);
        ctx.closePath();
        ctx.fill();

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 18);
        ctx.quadraticCurveTo(44, 22, 36, 56);
        ctx.lineTo(42, 72);
        ctx.lineTo(53, 86);
        ctx.lineTo(64, 102);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.lineTo(34, 94);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ГИГАНТСКОЙ КРЫСЫ НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateGiantRatAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАДНИЙ ПЛАН: Лохматый загривок и плечи гигантской крысы
        ctx.fillStyle = '#3b332e';
        ctx.beginPath();
        ctx.moveTo(18, 128);
        ctx.lineTo(36, 86);
        ctx.lineTo(92, 86);
        ctx.lineTo(110, 128);
        ctx.closePath();
        ctx.fill();

        // Взъерошенные клочья шерсти по бокам загривка
        ctx.fillStyle = '#4f453f';
        ctx.beginPath();
        ctx.moveTo(28, 106); ctx.lineTo(18, 98); ctx.lineTo(32, 94);
        ctx.moveTo(100, 106); ctx.lineTo(110, 98); ctx.lineTo(96, 94);
        ctx.fill();

        // 2. БОЛЬШИЕ ОКРУГЛЫЕ КРЫСИНЫЕ УШИ
        // Внешний серый контур ушей
        ctx.fillStyle = '#5c524b';
        ctx.beginPath(); ctx.arc(34, 46, 17, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(94, 46, 17, 0, Math.PI * 2); ctx.fill();

        // Внутренняя розово-телесная ушная раковина
        ctx.fillStyle = '#d99b9b';
        ctx.beginPath(); ctx.arc(36, 48, 11.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(92, 48, 11.5, 0, Math.PI * 2); ctx.fill();

        // Маленькая зазубрина на левом ухе
        ctx.fillStyle = '#3b332e';
        ctx.beginPath(); ctx.moveTo(18, 42); ctx.lineTo(25, 45); ctx.lineTo(19, 49); ctx.closePath(); ctx.fill();

        // 3. ВЫТЯНУТАЯ ОСТРАЯ МОРДА (Анфас с акцентом на вытянутый нос)
        ctx.fillStyle = '#635850'; // Грубый серо-бурый мех головы
        ctx.beginPath();
        ctx.moveTo(42, 44);
        ctx.quadraticCurveTo(64, 34, 86, 44);
        ctx.lineTo(94, 72);
        ctx.lineTo(74, 96);
        ctx.lineTo(64, 102);
        ctx.lineTo(54, 96);
        ctx.lineTo(34, 72);
        ctx.closePath();
        ctx.fill();

        // Более светлый мех на переносице и щеках
        ctx.fillStyle = '#7d7067';
        ctx.beginPath();
        ctx.moveTo(52, 54);
        ctx.lineTo(76, 54);
        ctx.lineTo(72, 92);
        ctx.lineTo(64, 98);
        ctx.lineTo(56, 92);
        ctx.closePath();
        ctx.fill();

        // 4. ЗЛОБНЫЕ РУБИНОВО-КРАСНЫЕ ГЛАЗА-БУСИНЫ
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath(); ctx.arc(47, 62, 4.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(81, 62, 4.8, 0, Math.PI * 2); ctx.fill();

        // Тёмные зрачки и блики
        ctx.fillStyle = '#1a0505';
        ctx.beginPath(); ctx.arc(47, 62, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(81, 62, 2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(48.5, 60.5, 1.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(79.5, 60.5, 1.1, 0, Math.PI * 2); ctx.fill();

        // Нахмуренные меховые складки над глазами
        ctx.strokeStyle = '#2e2723';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(40, 54); ctx.lineTo(53, 59); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(88, 54); ctx.lineTo(75, 59); ctx.stroke();

        // 5. РОЗОВЫЙ НОС, ОСКАЛ И ДЛИННЫЕ ЖЁЛТЫЕ РЕЗЦЫ
        // Тёмная пасть под носом
        ctx.fillStyle = '#241414';
        ctx.beginPath();
        ctx.moveTo(53, 86);
        ctx.quadraticCurveTo(64, 82, 75, 86);
        ctx.lineTo(71, 95);
        ctx.lineTo(57, 95);
        ctx.closePath();
        ctx.fill();

        // Два огромных жёлто-костяных крысиных резца
        ctx.fillStyle = '#f5e6a3';
        ctx.strokeStyle = '#5c4d26';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.rect(58.5, 85, 4.8, 12); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.rect(64.7, 85, 4.8, 12); ctx.fill(); ctx.stroke();

        // Крупный розовый нос треугольником
        ctx.fillStyle = '#e89b9b';
        ctx.beginPath();
        ctx.moveTo(57, 78);
        ctx.lineTo(71, 78);
        ctx.lineTo(64, 86);
        ctx.closePath();
        ctx.fill();

        // 6. ДЛИННЫЕ УСЫ-ВИБРИССЫ
        ctx.strokeStyle = 'rgba(235, 235, 235, 0.75)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(54, 81); ctx.lineTo(16, 75);
        ctx.moveTo(54, 84); ctx.lineTo(14, 86);
        ctx.moveTo(55, 87); ctx.lineTo(20, 96);
        ctx.moveTo(74, 81); ctx.lineTo(112, 75);
        ctx.moveTo(74, 84); ctx.lineTo(114, 86);
        ctx.moveTo(73, 87); ctx.lineTo(108, 96);
        ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 34);
        ctx.lineTo(42, 44);
        ctx.lineTo(34, 72);
        ctx.lineTo(54, 96);
        ctx.lineTo(64, 102);
        ctx.lineTo(64, 128);
        ctx.lineTo(18, 128);
        ctx.lineTo(36, 86);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ РОГАТОЙ ДРИАДЫ-САТИРА С ВОЛОСАМИ НАЗАД
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateSatyrDryadAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАДНИЙ ПЛАН: Зачёсанная назад густая грива волос, уходящая за плечи
        ctx.fillStyle = '#1b4332'; // Тёмно-изумрудная глубина волос
        ctx.beginPath();
        ctx.moveTo(36, 48);
        ctx.quadraticCurveTo(22, 86, 20, 128);
        ctx.lineTo(108, 128);
        ctx.quadraticCurveTo(106, 86, 92, 48);
        ctx.closePath();
        ctx.fill();

        // Плечи и накидка из лесных листьев и лоз
        ctx.fillStyle = '#2d6a4f';
        ctx.beginPath();
        ctx.moveTo(22, 128);
        ctx.lineTo(40, 102);
        ctx.lineTo(88, 102);
        ctx.lineTo(106, 128);
        ctx.closePath();
        ctx.fill();

        // Ожерелье из золотисто-зелёных листьев на шее
        ctx.fillStyle = '#74c69d';
        ctx.beginPath();
        ctx.ellipse(50, 108, 6, 3, 0.4, 0, Math.PI * 2);
        ctx.ellipse(64, 112, 7, 3.2, 0, 0, Math.PI * 2);
        ctx.ellipse(78, 108, 6, 3, -0.4, 0, Math.PI * 2);
        ctx.fill();

        // 2. ИЗОГНУТЫЕ ВИТЫЕ РОГА САТИРА (Растут из висков вверх и загибаются назад-вбок)
        ctx.fillStyle = '#6e472b'; // Тёмное дерево-кость рогов
        // Левый рог
        ctx.beginPath();
        ctx.moveTo(46, 44);
        ctx.bezierCurveTo(22, 34, 14, 14, 34, 8);
        ctx.bezierCurveTo(28, 18, 34, 30, 52, 38);
        ctx.closePath();
        ctx.fill();

        // Правый рог
        ctx.beginPath();
        ctx.moveTo(82, 44);
        ctx.bezierCurveTo(106, 34, 114, 14, 94, 8);
        ctx.bezierCurveTo(100, 18, 94, 30, 76, 38);
        ctx.closePath();
        ctx.fill();

        // Рельефные насечки-кольца на рогах сатира
        ctx.strokeStyle = '#a67c52';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(39, 38); ctx.lineTo(44, 33);
        ctx.moveTo(31, 30); ctx.lineTo(37, 26);
        ctx.moveTo(27, 20); ctx.lineTo(33, 18);
        ctx.moveTo(89, 38); ctx.lineTo(84, 33);
        ctx.moveTo(97, 30); ctx.lineTo(91, 26);
        ctx.moveTo(101, 20); ctx.lineTo(95, 18);
        ctx.stroke();

        // 3. ЗАОСТРЁННЫЕ УШИ САТИРА С ЛЕСНЫМИ КИСТОЧКАМИ
        ctx.fillStyle = '#c9a679';
        ctx.beginPath(); ctx.moveTo(43, 62); ctx.lineTo(22, 52); ctx.lineTo(42, 71); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(85, 62); ctx.lineTo(106, 52); ctx.lineTo(86, 71); ctx.closePath(); ctx.fill();

        // 4. ШЕЯ И ОТКРЫТОЕ ЛИЦО (Волосы полностью зачёсаны назад, лоб открыт)
        ctx.fillStyle = '#c49d6c';
        ctx.fillRect(55, 86, 18, 18);

        ctx.fillStyle = '#dbb686'; // Тёплый оливково-золотистый тон кожи фейри
        ctx.beginPath();
        ctx.moveTo(45, 48);
        ctx.quadraticCurveTo(64, 34, 83, 48);
        ctx.lineTo(81, 78);
        ctx.lineTo(64, 96); // Изящный заострённый подбородок
        ctx.lineTo(47, 78);
        ctx.closePath();
        ctx.fill();

        // 5. ЗАЧЁСАННЫЕ НАЗАД ВОЛОСЫ (Пышный объём на макушке с прядями назад)
        ctx.fillStyle = '#2d6a4f';
        ctx.beginPath();
        ctx.moveTo(44, 52);
        ctx.quadraticCurveTo(42, 24, 64, 22); // Пышный начёс вверх-назад
        ctx.quadraticCurveTo(86, 24, 84, 52);
        ctx.quadraticCurveTo(74, 40, 64, 40); // Открытая линия роста волос на лбу
        ctx.quadraticCurveTo(54, 40, 44, 52);
        ctx.closePath();
        ctx.fill();

        // Световые пряди-штрихи зачёса назад
        ctx.strokeStyle = '#52b788';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(54, 41); ctx.quadraticCurveTo(52, 30, 56, 24);
        ctx.moveTo(64, 40); ctx.quadraticCurveTo(64, 29, 64, 22);
        ctx.moveTo(74, 41); ctx.quadraticCurveTo(76, 30, 72, 24);
        ctx.stroke();

        // 6. ОЗОРНЫЕ ЯНТАРНО-ЗОЛОТЫЕ ГЛАЗА, ВЕСНУШКИ И ЛУКАВАЯ УЛЫБКА
        ctx.fillStyle = '#ffd166'; // Яркие глаза лесного духа
        ctx.beginPath(); ctx.ellipse(54, 61, 4.8, 2.2, -0.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 61, 4.8, 2.2, 0.1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#1b1b1b'; // Горизонтальные зрачки сатира
        ctx.fillRect(51.5, 60.3, 5, 1.4);
        ctx.fillRect(71.5, 60.3, 5, 1.4);

        ctx.fillStyle = '#ffffff'; // Блики
        ctx.beginPath(); ctx.arc(55.5, 59.8, 0.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(72.5, 59.8, 0.8, 0, Math.PI * 2); ctx.fill();

        // Изящные приподнятые брови
        ctx.strokeStyle = '#1b4332';
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(47, 55); ctx.quadraticCurveTo(54, 52, 59, 56); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(81, 55); ctx.quadraticCurveTo(74, 52, 69, 56); ctx.stroke();

        // Золотистые лесные веснушки на щеках
        ctx.fillStyle = '#a47148';
        ctx.fillRect(49, 68, 1.4, 1.4); ctx.fillRect(52, 70, 1.4, 1.4);
        ctx.fillRect(79, 68, 1.4, 1.4); ctx.fillRect(76, 70, 1.4, 1.4);

        // Изящный носик и лукавая ухмылка
        ctx.strokeStyle = '#b0895a';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 58); ctx.lineTo(62, 72); ctx.lineTo(66, 72); ctx.stroke();

        ctx.fillStyle = '#c85a53';
        ctx.beginPath(); ctx.ellipse(64, 82, 4.8, 1.6, 0, 0, Math.PI * 2); ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 22);
        ctx.quadraticCurveTo(42, 24, 44, 52);
        ctx.lineTo(47, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(64, 128);
        ctx.lineTo(20, 128);
        ctx.lineTo(36, 48);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ СВИРЕПОГО ВАРГА НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateWargAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАДНИЙ ПЛАН: Мощный взъерошенный загривок и плечи зверя
        ctx.fillStyle = '#1c1917'; // Угольно-бурый мех спины
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.lineTo(28, 76);
        ctx.lineTo(44, 58);
        ctx.lineTo(84, 58);
        ctx.lineTo(100, 76);
        ctx.lineTo(114, 128);
        ctx.closePath();
        ctx.fill();

        // Острые клочья шерсти дыбом по бокам загривка
        ctx.fillStyle = '#292524';
        ctx.beginPath();
        ctx.moveTo(26, 86); ctx.lineTo(12, 74); ctx.lineTo(30, 70);
        ctx.moveTo(22, 104); ctx.lineTo(10, 98); ctx.lineTo(25, 92);
        ctx.moveTo(102, 86); ctx.lineTo(116, 74); ctx.lineTo(98, 70);
        ctx.moveTo(106, 104); ctx.lineTo(118, 98); ctx.lineTo(103, 92);
        ctx.fill();

        // 2. ОСТРЫЕ ВОЛЧЬИ УШИ (Левое целое, правое с боевой зазубриной)
        ctx.fillStyle = '#292524';
        // Левое ухо
        ctx.beginPath();
        ctx.moveTo(38, 52);
        ctx.lineTo(26, 18);
        ctx.lineTo(52, 42);
        ctx.closePath();
        ctx.fill();

        // Правое рваное ухо
        ctx.beginPath();
        ctx.moveTo(90, 52);
        ctx.lineTo(102, 18);
        ctx.lineTo(94, 30);
        ctx.lineTo(98, 34);
        ctx.lineTo(91, 38);
        ctx.lineTo(76, 42);
        ctx.closePath();
        ctx.fill();

        // Внутренняя тёмная раковина ушей
        ctx.fillStyle = '#120f0e';
        ctx.beginPath(); ctx.moveTo(40, 48); ctx.lineTo(31, 25); ctx.lineTo(49, 43); ctx.fill();
        ctx.beginPath(); ctx.moveTo(88, 48); ctx.lineTo(97, 25); ctx.lineTo(79, 43); ctx.fill();

        // 3. ШИПАСТЫЙ БОЕВОЙ ОШЕЙНИК НА ШЕЕ
        ctx.fillStyle = '#3e2723';
        ctx.beginPath();
        ctx.moveTo(34, 98);
        ctx.quadraticCurveTo(64, 112, 94, 98);
        ctx.lineTo(98, 110);
        ctx.quadraticCurveTo(64, 124, 30, 110);
        ctx.closePath();
        ctx.fill();

        // Стальные шипы на ошейнике
        ctx.fillStyle = '#95a5a6';
        ctx.beginPath(); ctx.moveTo(42, 104); ctx.lineTo(36, 116); ctx.lineTo(48, 107); ctx.fill();
        ctx.beginPath(); ctx.moveTo(60, 108); ctx.lineTo(64, 122); ctx.lineTo(68, 108); ctx.fill();
        ctx.beginPath(); ctx.moveTo(86, 104); ctx.lineTo(92, 116); ctx.lineTo(80, 107); ctx.fill();

        // 4. МАССИВНАЯ ГОЛОВА И СКУЛЫ ВАРГА
        ctx.fillStyle = '#3b332f'; // Тёмный волчий мех
        ctx.beginPath();
        ctx.moveTo(42, 42);
        ctx.lineTo(64, 34);
        ctx.lineTo(86, 42);
        ctx.lineTo(96, 68);
        ctx.lineTo(82, 94);
        ctx.lineTo(64, 102);
        ctx.lineTo(46, 94);
        ctx.lineTo(32, 68);
        ctx.closePath();
        ctx.fill();

        // Более светлая морда и надбровные дуги (flat-объём)
        ctx.fillStyle = '#524742';
        ctx.beginPath();
        ctx.moveTo(48, 56);
        ctx.lineTo(80, 56);
        ctx.lineTo(82, 88);
        ctx.lineTo(64, 96);
        ctx.lineTo(46, 88);
        ctx.closePath();
        ctx.fill();

        // Складки яростного рычания на переносице
        ctx.strokeStyle = '#1c1917';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(57, 63); ctx.quadraticCurveTo(64, 60, 71, 63);
        ctx.moveTo(58, 67); ctx.quadraticCurveTo(64, 64, 70, 67);
        ctx.stroke();

        // 5. ПЫЛАЮЩИЕ РУБИНОВО-КРАСНЫЕ ГЛАЗА И БОЕВОЙ ШРАМ
        ctx.fillStyle = '#ff2a2a';
        ctx.beginPath(); ctx.ellipse(49, 54, 5.5, 2.4, 0.22, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(79, 54, 5.5, 2.4, -0.22, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffd875'; // Яркие хищные зрачки
        ctx.beginPath(); ctx.arc(50, 54, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(78, 54, 1.3, 0, Math.PI * 2); ctx.fill();

        // Нависшие злые брови
        ctx.strokeStyle = '#120f0e';
        ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(41, 47); ctx.lineTo(56, 53); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(87, 47); ctx.lineTo(72, 53); ctx.stroke();

        // Багровый боевой шрам через левую скулу и глаз
        ctx.strokeStyle = '#b71c1c';
        ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(45, 44); ctx.lineTo(54, 68); ctx.stroke();

        // 6. КРУПНЫЙ НОС И ОСКАЛЕННАЯ ПАСТЬ С КЛЫКАМИ
        // Тёмная глубина пасти
        ctx.fillStyle = '#140909';
        ctx.beginPath();
        ctx.moveTo(48, 80);
        ctx.quadraticCurveTo(64, 75, 80, 80);
        ctx.lineTo(76, 92);
        ctx.quadraticCurveTo(64, 96, 52, 92);
        ctx.closePath();
        ctx.fill();

        // Верхние крупные клыки
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.moveTo(51, 80); ctx.lineTo(54, 90); ctx.lineTo(57, 80); ctx.fill();
        ctx.beginPath(); ctx.moveTo(77, 80); ctx.lineTo(74, 90); ctx.lineTo(71, 80); ctx.fill();

        // Нижние острые клыки
        ctx.fillStyle = '#e0dcd3';
        ctx.beginPath(); ctx.moveTo(56, 92); ctx.lineTo(58, 84); ctx.lineTo(60, 92); ctx.fill();
        ctx.beginPath(); ctx.moveTo(72, 92); ctx.lineTo(70, 84); ctx.lineTo(68, 92); ctx.fill();

        // Чёрная мочка носа
        ctx.fillStyle = '#120f0e';
        ctx.beginPath();
        ctx.moveTo(57, 71);
        ctx.lineTo(71, 71);
        ctx.lineTo(64, 78);
        ctx.closePath();
        ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 34);
        ctx.lineTo(42, 42);
        ctx.lineTo(32, 68);
        ctx.lineTo(46, 94);
        ctx.lineTo(64, 102);
        ctx.lineTo(64, 128);
        ctx.lineTo(14, 128);
        ctx.lineTo(28, 76);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ОГРА С ДУБИНОЙ НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateOgreAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. МАССИВНЫЕ ПОКАТЫЕ ПЛЕЧИ И ГРУБЫЕ ШКУРЫ (Задний план)
        ctx.fillStyle = '#9c7544'; // Землисто-охристая кожа тела
        ctx.beginPath();
        ctx.moveTo(10, 128);
        ctx.quadraticCurveTo(22, 82, 64, 82);
        ctx.quadraticCurveTo(106, 82, 118, 128);
        ctx.closePath();
        ctx.fill();

        // Рваная кожаная перевязь и мех через плечо
        ctx.fillStyle = '#4a3222';
        ctx.beginPath();
        ctx.moveTo(22, 96);
        ctx.lineTo(54, 128);
        ctx.lineTo(74, 128);
        ctx.lineTo(36, 88);
        ctx.closePath();
        ctx.fill();

        // Грубая железная бляха на ремне
        ctx.fillStyle = '#57606f';
        ctx.beginPath();
        ctx.arc(44, 108, 5, 0, Math.PI * 2);
        ctx.fill();

        // 2. ПУЧОК САЛЬНЫХ ВОЛОС НА МАКУШКЕ И МАЛЕНЬКИЕ УШИ
        ctx.fillStyle = '#2d241e';
        ctx.beginPath();
        ctx.moveTo(58, 34);
        ctx.lineTo(52, 18);
        ctx.lineTo(62, 26);
        ctx.lineTo(66, 15);
        ctx.lineTo(70, 26);
        ctx.lineTo(76, 20);
        ctx.lineTo(70, 34);
        ctx.closePath();
        ctx.fill();

        // Маленькие оттопыренные уши огра
        ctx.fillStyle = '#8c6638';
        ctx.beginPath(); ctx.ellipse(41, 60, 4.5, 7, -0.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(87, 60, 4.5, 7, 0.2, 0, Math.PI * 2); ctx.fill();

        // 3. ГОЛОВА ОГРА (Узкий лоб и огромная, тяжелая квадратная челюсть)
        ctx.fillStyle = '#b58d58'; // Основной песочно-охристый цвет кожи
        ctx.beginPath();
        ctx.moveTo(48, 36);
        ctx.quadraticCurveTo(64, 30, 80, 36); // Узкий верх черепа
        ctx.lineTo(86, 62);
        ctx.lineTo(90, 84); // Широкая массивная челюсть справа
        ctx.lineTo(76, 102);
        ctx.lineTo(52, 102);
        ctx.lineTo(38, 84); // Широкая массивная челюсть слева
        ctx.lineTo(42, 62);
        ctx.closePath();
        ctx.fill();

        // Вторая складка подбородка
        ctx.strokeStyle = '#7a5830';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(54, 96);
        ctx.quadraticCurveTo(64, 100, 74, 96);
        ctx.stroke();

        // 4. НАВИСШИЙ НАДБРОВНЫЙ ВАЛИК, МАЛЕНЬКИЕ ЗЛЫЕ ГЛАЗА И ШИРОКИЙ НОС
        ctx.fillStyle = '#8c6638';
        ctx.beginPath();
        ctx.moveTo(43, 50);
        ctx.quadraticCurveTo(64, 56, 85, 50);
        ctx.lineTo(83, 56);
        ctx.quadraticCurveTo(64, 60, 45, 56);
        ctx.closePath();
        ctx.fill();

        // Маленькие туповато-свирепые глаза
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath(); ctx.arc(53, 58, 2.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 58, 2.8, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#111111';
        ctx.beginPath(); ctx.arc(53, 58, 1.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 58, 1.2, 0, Math.PI * 2); ctx.fill();

        // Широкий приплюснутый нос картошкой
        ctx.fillStyle = '#9c7544';
        ctx.beginPath();
        ctx.moveTo(64, 58);
        ctx.lineTo(72, 72);
        ctx.quadraticCurveTo(64, 76, 56, 72);
        ctx.closePath();
        ctx.fill();

        // Тёмные ноздри
        ctx.fillStyle = '#3b2816';
        ctx.beginPath(); ctx.arc(60, 71, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(68, 71, 1.8, 0, Math.PI * 2); ctx.fill();

        // 5. ОСКАЛЕННАЯ ПАСТЬ С КРИВЫМИ НИЖНИМИ КЛЫКАМИ
        ctx.strokeStyle = '#3b2816';
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(46, 84);
        ctx.quadraticCurveTo(64, 80, 82, 84);
        ctx.stroke();

        // Крупные нижние клыки огра
        ctx.fillStyle = '#f5f0dc';
        ctx.strokeStyle = '#3b2816';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(49, 84); ctx.lineTo(52, 73); ctx.lineTo(56, 83); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(79, 84); ctx.lineTo(76, 73); ctx.lineTo(72, 83); ctx.closePath(); ctx.fill(); ctx.stroke();

        // 6. ОГРОМНАЯ ОКОВАННАЯ ЖЕЛЕЗОМ ДУБИНА НА ПЕРЕДНЕМ ПЛАНЕ (Справа)
        ctx.save();
        ctx.translate(102, 74);
        ctx.rotate((Math.PI / 180) * 18);
        ctx.translate(-102, -74);

        // Массивное деревянное тело дубины (расширяется кверху)
        ctx.fillStyle = '#5c3a21';
        ctx.strokeStyle = '#2b190d';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(98, 128);
        ctx.lineTo(91, 32);
        ctx.quadraticCurveTo(102, 22, 113, 32);
        ctx.lineTo(106, 128);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Деревянный сучок сбоку дубины
        ctx.fillStyle = '#4a2e19';
        ctx.beginPath();
        ctx.moveTo(111, 52);
        ctx.lineTo(119, 46);
        ctx.lineTo(112, 60);
        ctx.closePath();
        ctx.fill();

        // Железные обручи и шипы на ударной части дубины
        ctx.fillStyle = '#4b5563';
        ctx.fillRect(91, 38, 22, 5);
        ctx.fillRect(92, 64, 20, 5);

        ctx.fillStyle = '#9ca3af';
        ctx.beginPath(); ctx.moveTo(91, 38); ctx.lineTo(85, 40.5); ctx.lineTo(91, 43); ctx.fill();
        ctx.beginPath(); ctx.moveTo(113, 38); ctx.lineTo(119, 40.5); ctx.lineTo(113, 43); ctx.fill();
        ctx.beginPath(); ctx.moveTo(92, 64); ctx.lineTo(86, 66.5); ctx.lineTo(92, 69); ctx.fill();
        ctx.restore();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 30);
        ctx.lineTo(48, 36);
        ctx.lineTo(42, 62);
        ctx.lineTo(38, 84);
        ctx.lineTo(52, 102);
        ctx.lineTo(64, 102);
        ctx.lineTo(64, 128);
        ctx.lineTo(10, 128);
        ctx.quadraticCurveTo(22, 82, 64, 82);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ МАНТИКОРЫ НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateManticoreAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАДНИЙ ПЛАН: Кожаные перепончатые крылья летучей мыши
        ctx.fillStyle = '#3d1c1c';
        ctx.strokeStyle = '#1f0d0d';
        ctx.lineWidth = 1.5;

        // Левое крыло
        ctx.beginPath();
        ctx.moveTo(42, 68);
        ctx.lineTo(8, 34);
        ctx.quadraticCurveTo(18, 56, 12, 74);
        ctx.quadraticCurveTo(26, 72, 24, 88);
        ctx.lineTo(44, 84);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Правое крыло
        ctx.beginPath();
        ctx.moveTo(86, 68);
        ctx.lineTo(120, 34);
        ctx.quadraticCurveTo(110, 56, 116, 74);
        ctx.quadraticCurveTo(102, 72, 104, 88);
        ctx.lineTo(84, 84);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 2. ХВОСТ СКОРПИОНА С ЯДОВИТЫМ ЖАЛОМ И ШИПАМИ (Занесён сверху справа)
        ctx.fillStyle = '#6e2c23';
        ctx.beginPath();
        ctx.moveTo(86, 98);
        ctx.bezierCurveTo(124, 92, 126, 26, 86, 16);
        ctx.bezierCurveTo(110, 32, 110, 78, 80, 88);
        ctx.closePath();
        ctx.fill();

        // Членистые сегменты хвоста
        ctx.strokeStyle = '#3b1510';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(104, 66); ctx.lineTo(114, 68);
        ctx.moveTo(105, 48); ctx.lineTo(115, 46);
        ctx.moveTo(98, 32); ctx.lineTo(106, 26);
        ctx.stroke();

        // Смертоносное изогнутое жало на конце хвоста
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.moveTo(88, 22);
        ctx.quadraticCurveTo(72, 10, 62, 16);
        ctx.quadraticCurveTo(74, 18, 84, 13);
        ctx.closePath();
        ctx.fill();

        // Капля кислотно-зелёного яда на кончике жала
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath();
        ctx.arc(61, 18, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // 3. ПЫШНАЯ ТЁМНО-БАГРОВАЯ ГРИВА ЛЬВА-ЧУДОВИЩА
        ctx.fillStyle = '#4a1c17';
        ctx.beginPath();
        ctx.moveTo(64, 24);
        ctx.lineTo(84, 32);
        ctx.lineTo(98, 52);
        ctx.lineTo(102, 82);
        ctx.lineTo(92, 112);
        ctx.lineTo(64, 126);
        ctx.lineTo(36, 112);
        ctx.lineTo(26, 82);
        ctx.lineTo(30, 52);
        ctx.lineTo(44, 32);
        ctx.closePath();
        ctx.fill();

        // Внутренний более светлый контур гривы
        ctx.fillStyle = '#692922';
        ctx.beginPath();
        ctx.moveTo(64, 30);
        ctx.lineTo(88, 48);
        ctx.lineTo(92, 84);
        ctx.lineTo(64, 114);
        ctx.lineTo(36, 84);
        ctx.lineTo(40, 48);
        ctx.closePath();
        ctx.fill();

        // 4. ЖУТКОЕ ЧЕЛОВЕКОПОДОБНОЕ ЛИЦО ХИЩНИКА (Землисто-рыжий окрас)
        ctx.fillStyle = '#c98a5b';
        ctx.beginPath();
        ctx.moveTo(46, 46);
        ctx.quadraticCurveTo(64, 38, 82, 46);
        ctx.lineTo(84, 74);
        ctx.lineTo(74, 96);
        ctx.lineTo(54, 96);
        ctx.lineTo(44, 74);
        ctx.closePath();
        ctx.fill();

        // Острые звериные уши, торчащие из гривы
        ctx.fillStyle = '#a86b3e';
        ctx.beginPath(); ctx.moveTo(42, 46); ctx.lineTo(32, 30); ctx.lineTo(50, 40); ctx.fill();
        ctx.beginPath(); ctx.moveTo(86, 46); ctx.lineTo(96, 30); ctx.lineTo(78, 40); ctx.fill();

        // 5. ГОРЯЩИЕ ЯНТАРНЫЕ ГЛАЗА И НАХМУРЕННЫЕ БРОВИ
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath(); ctx.ellipse(53, 58, 5.2, 2.5, 0.18, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 58, 5.2, 2.5, -0.18, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#111111';
        ctx.fillRect(52.3, 55.8, 1.4, 4.5);
        ctx.fillRect(74.3, 55.8, 1.4, 4.5);

        // Тяжёлые нависшие складки лба
        ctx.strokeStyle = '#3b1510';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(45, 51); ctx.lineTo(59, 56);
        ctx.moveTo(83, 51); ctx.lineTo(69, 56);
        ctx.stroke();

        // Широкий хищный нос
        ctx.fillStyle = '#9e6238';
        ctx.beginPath();
        ctx.moveTo(64, 57);
        ctx.lineTo(70, 70);
        ctx.lineTo(58, 70);
        ctx.closePath();
        ctx.fill();

        // 6. ПАСТЬ С ДВУМЯ РЯДАМИ ОСТРЫХ КЛЫКОВ (Визитная карточка мантикоры)
        ctx.fillStyle = '#240b0b';
        ctx.beginPath();
        ctx.moveTo(48, 78);
        ctx.quadraticCurveTo(64, 74, 80, 78);
        ctx.lineTo(76, 90);
        ctx.quadraticCurveTo(64, 94, 52, 90);
        ctx.closePath();
        ctx.fill();

        // Частокол острых белых зубов сверху и снизу
        ctx.fillStyle = '#ffffff';
        for (let x = 51; x <= 74; x += 4.5) {
            ctx.beginPath(); ctx.moveTo(x, 78); ctx.lineTo(x + 2, 84); ctx.lineTo(x + 4, 78); ctx.fill();
            ctx.beginPath(); ctx.moveTo(x, 90); ctx.lineTo(x + 2, 84); ctx.lineTo(x + 4, 90); ctx.fill();
        }

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 24);
        ctx.lineTo(44, 32);
        ctx.lineTo(30, 52);
        ctx.lineTo(26, 82);
        ctx.lineTo(36, 112);
        ctx.lineTo(64, 126);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },
    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ОГРОМНОГО ПАУКА-ЛЮДОЕДА С КУСТАМИ НА СПИНЕ
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateAmbushSpiderAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. МАССИВНЫЕ ДРЕВЕСНО-ХИТИНОВЫЕ ЛАПЫ ПАУКА (8 суставчатых лап по бокам)
        ctx.lineCap = 'round';
        ctx.lineJoin = 'miter';

        // Левые лапы
        ctx.strokeStyle = '#3b2d22';
        ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(42, 62); ctx.lineTo(14, 38); ctx.lineTo(6, 74); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(38, 74); ctx.lineTo(8, 66); ctx.lineTo(8, 104); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(40, 86); ctx.lineTo(12, 92); ctx.lineTo(20, 124); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(46, 96); ctx.lineTo(26, 108); ctx.lineTo(34, 128); ctx.stroke();

        // Правые лапы (чуть светлее для flat-объёма)
        ctx.strokeStyle = '#4e3b2c';
        ctx.beginPath(); ctx.moveTo(86, 62); ctx.lineTo(114, 38); ctx.lineTo(122, 74); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(90, 74); ctx.lineTo(120, 66); ctx.lineTo(120, 104); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(88, 86); ctx.lineTo(116, 92); ctx.lineTo(108, 124); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(82, 96); ctx.lineTo(102, 108); ctx.lineTo(94, 128); ctx.stroke();

        // Пучки зелёного мха на суставах лап для маскировки
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath(); ctx.arc(14, 38, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(114, 38, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#27ae60';
        ctx.beginPath(); ctx.arc(8, 66, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(120, 66, 4, 0, Math.PI * 2); ctx.fill();

        // 2. ОГРОМНОЕ БРЮШКО-ПАНЦИРЬ НА ЗАДНЕМ ПЛАНЕ (Покрыто кустами и листьями)
        ctx.fillStyle = '#36281e';
        ctx.beginPath();
        ctx.ellipse(64, 52, 34, 28, 0, 0, Math.PI * 2);
        ctx.fill();

        // 3. ГУСТЫЕ КУСТЫ, ПАПОРОТНИК И МОХ НА СПИНЕ ПАУКА
        // Тёмно-изумрудная основа кустарника
        ctx.fillStyle = '#1e5631';
        ctx.beginPath(); ctx.arc(42, 36, 15, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(86, 36, 15, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(64, 26, 18, 0, Math.PI * 2); ctx.fill();

        // Яркая листва и крона кустов сверху
        ctx.fillStyle = '#2d8a4e';
        ctx.beginPath(); ctx.arc(48, 30, 11, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(80, 30, 11, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(64, 20, 13, 0, Math.PI * 2); ctx.fill();

        // Острые листья папоротника, торчащие в стороны из кустов
        ctx.fillStyle = '#4cd137';
        ctx.beginPath(); ctx.moveTo(34, 32); ctx.lineTo(14, 22); ctx.lineTo(30, 42); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(94, 32); ctx.lineTo(114, 22); ctx.lineTo(98, 42); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(60, 16); ctx.lineTo(64, 4); ctx.lineTo(68, 16); ctx.closePath(); ctx.fill();

        // Несколько лесных ягод в кустах (маскировка-приманка)
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath(); ctx.arc(44, 28, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(82, 26, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(66, 18, 2.2, 0, Math.PI * 2); ctx.fill();

        // 4. МАССИВНАЯ ГОЛОВОГРУДЬ ПАУКА-ЛЮДОЕДА (Спереди снизу)
        ctx.fillStyle = '#4a3728';
        ctx.beginPath();
        ctx.ellipse(64, 80, 26, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        // Костяные наросты-щитки на лбу
        ctx.fillStyle = '#2c2017';
        ctx.beginPath();
        ctx.moveTo(46, 68);
        ctx.quadraticCurveTo(64, 62, 82, 68);
        ctx.lineTo(78, 74);
        ctx.quadraticCurveTo(64, 69, 50, 74);
        ctx.closePath();
        ctx.fill();

        // 5. ВОСЕМЬ ГОРЯЩИХ ЯНТАРНО-ОРАНЖЕВЫХ ГЛАЗ
        ctx.fillStyle = '#ff9f1a';
        // Два огромных главных глаза
        ctx.beginPath(); ctx.arc(56, 78, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(72, 78, 4.5, 0, Math.PI * 2); ctx.fill();
        // Боковые глаза
        ctx.beginPath(); ctx.arc(46, 76, 2.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(82, 76, 2.6, 0, Math.PI * 2); ctx.fill();
        // Верхний ряд мелких глаз
        ctx.beginPath(); ctx.arc(52, 70, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(60, 69, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(68, 69, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 70, 1.8, 0, Math.PI * 2); ctx.fill();

        // Хищные блики в главных глазах
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(57.5, 76.5, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(70.5, 76.5, 1.3, 0, Math.PI * 2); ctx.fill();

        // 6. ТЯЖЁЛЫЕ ХЕЛИЦЕРЫ И ОГРОМНЫЕ КЛЫКИ-ЖВАЛА
        ctx.fillStyle = '#241a12';
        ctx.beginPath(); ctx.moveTo(46, 88); ctx.lineTo(58, 106); ctx.lineTo(50, 108); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(82, 88); ctx.lineTo(70, 106); ctx.lineTo(78, 108); ctx.closePath(); ctx.fill();

        // Изогнутые костяные клыки с каплями яда
        ctx.fillStyle = '#f5f0dc';
        ctx.beginPath(); ctx.moveTo(51, 102); ctx.quadraticCurveTo(56, 118, 61, 114); ctx.lineTo(57, 102); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(77, 102); ctx.quadraticCurveTo(72, 118, 67, 114); ctx.lineTo(71, 102); ctx.closePath(); ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.moveTo(64, 4);
        ctx.lineTo(14, 22);
        ctx.lineTo(6, 74);
        ctx.lineTo(20, 124);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ЧЁРНОЙ ПТИЦЫ-РУХ НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateBlackRocAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАДНИЙ ПЛАН: Исполинские расправленные крылья птицы-рух
        ctx.fillStyle = '#14171f';
        // Левое крыло с маховыми перьями
        ctx.beginPath();
        ctx.moveTo(46, 74);
        ctx.lineTo(4, 24);
        ctx.lineTo(14, 48);
        ctx.lineTo(4, 54);
        ctx.lineTo(18, 72);
        ctx.lineTo(10, 82);
        ctx.lineTo(44, 98);
        ctx.closePath();
        ctx.fill();

        // Правое крыло с маховыми перьями
        ctx.beginPath();
        ctx.moveTo(82, 74);
        ctx.lineTo(124, 24);
        ctx.lineTo(114, 48);
        ctx.lineTo(124, 54);
        ctx.lineTo(110, 72);
        ctx.lineTo(118, 82);
        ctx.lineTo(84, 98);
        ctx.closePath();
        ctx.fill();

        // Графитовые прожилки-перья на крыльях
        ctx.strokeStyle = '#2c3342';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(42, 76); ctx.lineTo(12, 34);
        ctx.moveTo(42, 82); ctx.lineTo(14, 58);
        ctx.moveTo(86, 76); ctx.lineTo(116, 34);
        ctx.moveTo(86, 82); ctx.lineTo(114, 58);
        ctx.stroke();

        // 2. МОЩНАЯ ПЕРНАТАЯ ГРУДЬ И ШЕЯ (Внизу по центру)
        ctx.fillStyle = '#1b1f29';
        ctx.beginPath();
        ctx.moveTo(28, 128);
        ctx.lineTo(40, 86);
        ctx.lineTo(88, 86);
        ctx.lineTo(100, 128);
        ctx.closePath();
        ctx.fill();

        // Ярусные перья на груди (flat-текстура оперения)
        ctx.fillStyle = '#282e3d';
        ctx.beginPath();
        ctx.moveTo(44, 98); ctx.lineTo(54, 110); ctx.lineTo(64, 98); ctx.lineTo(74, 110); ctx.lineTo(84, 98);
        ctx.lineTo(78, 118); ctx.lineTo(64, 108); ctx.lineTo(50, 118);
        ctx.closePath();
        ctx.fill();

        // 3. ГОЛОВА И ПЕРЬЕВОЙ ХОХОЛОК-КОРОНА ПТИЦЫ-РУХ
        ctx.fillStyle = '#11141c';
        ctx.beginPath();
        ctx.moveTo(44, 46);
        ctx.lineTo(50, 26); // Левое перо-гребень
        ctx.lineTo(58, 36);
        ctx.lineTo(64, 20); // Центральный перьевой пик
        ctx.lineTo(70, 36);
        ctx.lineTo(78, 26); // Правое перо-гребень
        ctx.lineTo(84, 46);
        ctx.lineTo(88, 70);
        ctx.lineTo(64, 88);
        ctx.lineTo(40, 70);
        ctx.closePath();
        ctx.fill();

        // Световой графитовый контур на голове
        ctx.fillStyle = '#232836';
        ctx.beginPath();
        ctx.moveTo(64, 20);
        ctx.lineTo(70, 36);
        ctx.lineTo(78, 26);
        ctx.lineTo(84, 46);
        ctx.lineTo(88, 70);
        ctx.lineTo(64, 88);
        ctx.closePath();
        ctx.fill();

        // 4. ГРОЗНЫЕ НАДБРОВНЫЕ ДУГИ И ПЫЛАЮЩИЕ ЯНТАРНЫЕ ГЛАЗА
        // Светящиеся золотисто-огненные глаза орла-гиганта
        ctx.fillStyle = '#ff9f1a';
        ctx.beginPath(); ctx.ellipse(51, 56, 5.5, 2.8, 0.25, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(77, 56, 5.5, 2.8, -0.25, 0, Math.PI * 2); ctx.fill();

        // Чёрные зрачки и блики
        ctx.fillStyle = '#0a0a0a';
        ctx.beginPath(); ctx.arc(52, 56, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 56, 1.8, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(53, 55, 0.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 55, 0.9, 0, Math.PI * 2); ctx.fill();

        // Нахмуренные орлиные брови из перьев
        ctx.strokeStyle = '#4b5563';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(42, 48); ctx.lineTo(58, 55);
        ctx.moveTo(86, 48); ctx.lineTo(70, 55);
        ctx.stroke();

        // 5. МАССИВНЫЙ КРЮЧКОВАТЫЙ КЛЮВ (Золотисто-костяной)
        // Восковица (основание клюва)
        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.moveTo(54, 62);
        ctx.quadraticCurveTo(64, 57, 74, 62);
        ctx.lineTo(71, 69);
        ctx.lineTo(57, 69);
        ctx.closePath();
        ctx.fill();

        // Нижняя челюсть клюва
        ctx.fillStyle = '#8c7853';
        ctx.beginPath();
        ctx.moveTo(57, 75);
        ctx.lineTo(71, 75);
        ctx.lineTo(64, 84);
        ctx.closePath();
        ctx.fill();

        // Острый загнутый вниз хищный крюк клюва
        ctx.fillStyle = '#e5dcc5';
        ctx.beginPath();
        ctx.moveTo(55, 65);
        ctx.lineTo(73, 65);
        ctx.lineTo(71, 78);
        ctx.lineTo(64, 88); // Острый загнутый вниз кончик клюва
        ctx.lineTo(57, 78);
        ctx.closePath();
        ctx.fill();

        // Тёмная полость приоткрытого клюва по краям
        ctx.strokeStyle = '#11141c';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(56, 74); ctx.lineTo(64, 78); ctx.lineTo(72, 74);
        ctx.stroke();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        ctx.beginPath();
        ctx.moveTo(64, 20);
        ctx.lineTo(44, 46);
        ctx.lineTo(4, 24);
        ctx.lineTo(10, 82);
        ctx.lineTo(28, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ СКЕЛЕТА-ЦИКЛОПА С РЕБРИСТЫМ РОГОМ И ЛОХМОТЬЯМИ
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateCyclopsSkeletonAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАДНИЙ ПЛАН: Костяные плечи, позвоночник и рваные лохмотья
        ctx.fillStyle = '#cfc9b8';
        ctx.fillRect(54, 92, 20, 36); // Мощный позвоночник великана

        // Костяные ключицы и рёбра под лохмотьями
        ctx.strokeStyle = '#e5e0d0';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(64, 102); ctx.quadraticCurveTo(36, 96, 18, 114);
        ctx.moveTo(64, 102); ctx.quadraticCurveTo(92, 96, 110, 114);
        ctx.stroke();

        // Рваные тёмно-бурые лохмотья на плечах (с рваными краями)
        ctx.fillStyle = '#2b241f';
        ctx.beginPath();
        ctx.moveTo(12, 128);
        ctx.lineTo(24, 96);
        ctx.lineTo(44, 102);
        ctx.lineTo(50, 118);
        ctx.lineTo(42, 128);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(116, 128);
        ctx.lineTo(104, 96);
        ctx.lineTo(84, 102);
        ctx.lineTo(78, 118);
        ctx.lineTo(86, 128);
        ctx.closePath();
        ctx.fill();

        // Свисающие рваные лоскуты ткани по бокам
        ctx.fillStyle = '#3d332c';
        ctx.beginPath();
        ctx.moveTo(22, 104); ctx.lineTo(14, 124); ctx.lineTo(28, 118); ctx.lineTo(32, 128); ctx.lineTo(40, 108);
        ctx.moveTo(106, 104); ctx.lineTo(114, 124); ctx.lineTo(100, 118); ctx.lineTo(96, 128); ctx.lineTo(88, 108);
        ctx.fill();

        // 2. МАССИВНЫЙ ЧЕРЕП ЦИКЛОПА (Широкие скулы и тяжёлая челюсть)
        ctx.fillStyle = '#e8e4d5';
        ctx.beginPath();
        ctx.moveTo(40, 50);
        ctx.quadraticCurveTo(40, 26, 64, 26); // Купол черепа
        ctx.quadraticCurveTo(88, 26, 88, 50);
        ctx.lineTo(93, 68); // Массивная правая скула
        ctx.lineTo(82, 79);
        ctx.lineTo(79, 96); // Правый угол нижней челюсти
        ctx.lineTo(49, 96); // Левый угол нижней челюсти
        ctx.lineTo(46, 79);
        ctx.lineTo(35, 68); // Массивная левая скула
        ctx.closePath();
        ctx.fill();

        // Височные впадины и трещина на черепе
        ctx.fillStyle = '#c9c3b0';
        ctx.beginPath(); ctx.ellipse(42, 54, 4, 9, 0.15, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(86, 54, 4, 9, -0.15, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#5c5649';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(78, 32); ctx.lineTo(74, 42); ctx.lineTo(79, 48);
        ctx.stroke();

        // 3. ОДНА ОГРОМНАЯ ЦЕНТРАЛЬНАЯ ГЛАЗНИЦА ЦИКЛОПА
        ctx.fillStyle = '#141118';
        ctx.beginPath();
        ctx.ellipse(64, 58, 13, 10.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Грозная костяная надбровная дуга над единственной глазницей
        ctx.strokeStyle = '#b8b19c';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(48, 49);
        ctx.quadraticCurveTo(64, 43, 80, 49);
        ctx.stroke();

        // Тлеющий багрово-оранжевый огонёк нежити в центре глазницы
        ctx.fillStyle = 'rgba(255, 87, 34, 0.35)';
        ctx.beginPath(); ctx.arc(64, 58, 7.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ff5722';
        ctx.beginPath(); ctx.arc(64, 58, 4.2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffd875';
        ctx.beginPath(); ctx.arc(64, 58, 1.8, 0, Math.PI * 2); ctx.fill();

        // 4. КРУПНЫЙ РЕБРИСТЫЙ РОГ НА ЛБУ (Над глазницей)
        ctx.fillStyle = '#d6ceb8';
        ctx.strokeStyle = '#5c5649';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(54, 42);
        ctx.quadraticCurveTo(56, 18, 64, 6); // Остриё рога вверх
        ctx.quadraticCurveTo(72, 18, 74, 42);
        ctx.quadraticCurveTo(64, 45, 54, 42);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Поперечные рёбра-насечки на роге
        ctx.strokeStyle = '#7a7261';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(56, 35); ctx.quadraticCurveTo(64, 38, 72, 35);
        ctx.moveTo(58, 28); ctx.quadraticCurveTo(64, 31, 70, 28);
        ctx.moveTo(60, 21); ctx.quadraticCurveTo(64, 23, 68, 21);
        ctx.moveTo(62, 14); ctx.quadraticCurveTo(64, 16, 66, 14);
        ctx.stroke();

        // 5. НОСОВОЙ ПРОВАЛ И МАССИВНЫЕ ЧЕЛЮСТИ С КРУПНЫМИ ЗУБАМИ
        ctx.fillStyle = '#141118';
        ctx.beginPath();
        ctx.moveTo(64, 70);
        ctx.lineTo(68, 77);
        ctx.lineTo(64, 75);
        ctx.lineTo(60, 77);
        ctx.closePath();
        ctx.fill();

        // Щель челюсти и крупные зубы великана
        ctx.fillStyle = '#24201c';
        ctx.fillRect(50, 83, 28, 7);

        ctx.fillStyle = '#f5f2e6';
        for (let x = 51; x <= 74; x += 4.5) {
            ctx.fillRect(x, 81, 3.4, 4.5);   // Верхний зуб
            ctx.fillRect(x, 87, 3.4, 4.5);   // Нижний зуб
        }

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 6);
        ctx.quadraticCurveTo(56, 18, 54, 42);
        ctx.lineTo(40, 50);
        ctx.lineTo(35, 68);
        ctx.lineTo(49, 96);
        ctx.lineTo(12, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ СЕРОГО МАМОНТА НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateGreyMammothAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАДНИЙ ПЛАН: Огромный мохнатый горб и широкие плечи мамонта
        ctx.fillStyle = '#3b4048'; // Тёмно-серый густой подшёрсток
        ctx.beginPath();
        ctx.moveTo(10, 128);
        ctx.quadraticCurveTo(18, 68, 64, 58);
        ctx.quadraticCurveTo(110, 68, 118, 128);
        ctx.closePath();
        ctx.fill();

        // Клочья густой шерсти по краям плеч
        ctx.fillStyle = '#4f5661';
        ctx.beginPath();
        ctx.moveTo(18, 96); ctx.lineTo(8, 108); ctx.lineTo(22, 112);
        ctx.moveTo(110, 96); ctx.lineTo(120, 108); ctx.lineTo(106, 112);
        ctx.fill();

        // 2. НЕБОЛЬШИЕ МОХНАТЫЕ УШИ (Прижаты по бокам головы)
        ctx.fillStyle = '#474d57';
        ctx.beginPath(); ctx.ellipse(32, 58, 9, 15, -0.25, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(96, 58, 9, 15, 0.25, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#2d3138'; // Внутренняя тень ушей
        ctx.beginPath(); ctx.ellipse(34, 59, 5, 10, -0.25, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(94, 59, 5, 10, 0.25, 0, Math.PI * 2); ctx.fill();

        // 3. ВЫСОКИЙ ЛОБ-КУПОЛ И ГОЛОВА МАМОНТА
        ctx.fillStyle = '#5c6370'; // Основной пепельно-серый мех
        ctx.beginPath();
        ctx.moveTo(38, 52);
        ctx.bezierCurveTo(36, 18, 92, 18, 90, 52); // Высокий характерный купол мамонта
        ctx.lineTo(94, 78);
        ctx.lineTo(78, 94);
        ctx.lineTo(50, 94);
        ctx.lineTo(34, 78);
        ctx.closePath();
        ctx.fill();

        // Лохматая чёлка-хохолок на вершине купола
        ctx.fillStyle = '#747d8c';
        ctx.beginPath();
        ctx.moveTo(52, 24);
        ctx.lineTo(58, 14);
        ctx.lineTo(64, 21);
        ctx.lineTo(70, 13);
        ctx.lineTo(76, 24);
        ctx.closePath();
        ctx.fill();

        // 4. ГЛАЗА И ГУСТЫЕ МОХНАТЫЕ НАДБРОВНЫЕ ДУГИ
        ctx.fillStyle = '#f5f6fa';
        ctx.beginPath(); ctx.ellipse(45, 58, 4.8, 2.6, 0.15, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(83, 58, 4.8, 2.6, -0.15, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#2f3542'; // Тёмные зрачки
        ctx.beginPath(); ctx.arc(46, 58, 1.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(82, 58, 1.9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff'; // Блики
        ctx.beginPath(); ctx.arc(46.8, 57.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(81.2, 57.2, 0.7, 0, Math.PI * 2); ctx.fill();

        // Тяжёлые мохнатые брови
        ctx.strokeStyle = '#2f3542';
        ctx.lineWidth = 2.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(37, 51); ctx.quadraticCurveTo(46, 53, 53, 57);
        ctx.moveTo(91, 51); ctx.quadraticCurveTo(82, 53, 75, 57);
        ctx.stroke();

        // 5. МАССИВНЫЙ МОХНАТЫЙ ХОБОТ (Спускается по центру с загибом вбок)
        ctx.fillStyle = '#6c7582';
        ctx.beginPath();
        ctx.moveTo(52, 64);
        ctx.lineTo(76, 64);
        ctx.bezierCurveTo(78, 92, 74, 114, 86, 118); // Изогнутый кончик хобота вправо
        ctx.quadraticCurveTo(92, 124, 82, 126);
        ctx.bezierCurveTo(60, 126, 52, 98, 52, 64);
        ctx.closePath();
        ctx.fill();

        // Поперечные складки на хоботе
        ctx.strokeStyle = '#3b4048';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(55, 76); ctx.quadraticCurveTo(64, 79, 73, 76);
        ctx.moveTo(56, 88); ctx.quadraticCurveTo(64, 91, 72, 88);
        ctx.moveTo(58, 100); ctx.quadraticCurveTo(65, 103, 73, 100);
        ctx.moveTo(63, 112); ctx.quadraticCurveTo(70, 114, 77, 111);
        ctx.stroke();

        // 6. ОГРОМНЫЕ ИЗОГНУТЫЕ КОСТЯНЫЕ БИВНИ (На переднем плане по бокам от хобота)
        ctx.fillStyle = '#f5f0dc';
        ctx.strokeStyle = '#4a4335';
        ctx.lineWidth = 1.4;

        // Левый бивень (выходит из-под щеки вниз и загибается дугой вверх-наружу)
        ctx.beginPath();
        ctx.moveTo(46, 78);
        ctx.bezierCurveTo(22, 84, 6, 66, 12, 36);
        ctx.bezierCurveTo(18, 60, 32, 72, 50, 70);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Правый бивень
        ctx.beginPath();
        ctx.moveTo(82, 78);
        ctx.bezierCurveTo(106, 84, 122, 66, 116, 36);
        ctx.bezierCurveTo(110, 60, 96, 72, 78, 70);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 18);
        ctx.bezierCurveTo(44, 20, 38, 38, 38, 52);
        ctx.lineTo(34, 78);
        ctx.lineTo(50, 94);
        ctx.lineTo(64, 126);
        ctx.lineTo(10, 128);
        ctx.quadraticCurveTo(18, 68, 64, 58);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ГЛАВНОГО ЗЛОГО СКЕЛЕТА-РЫЦАРЯ (ШЛЕМ С Т-ВЫРЕЗОМ, МЕЧ И ЩИТ)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateDeathKnightAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ДВУРУЧНЫЙ РУНИЧЕСКИЙ МЕЧ ЗА ПРАВЫМ ПЛЕЧОМ (По диагонали вверх)
        ctx.save();
        ctx.translate(98, 66);
        ctx.rotate((Math.PI / 180) * 24);
        ctx.translate(-98, -66);

        ctx.fillStyle = '#7f8c8d';
        ctx.beginPath();
        ctx.moveTo(93, 14);
        ctx.lineTo(98, 2);
        ctx.lineTo(103, 14);
        ctx.lineTo(103, 96);
        ctx.lineTo(93, 96);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#bdc3c7';
        ctx.fillRect(98, 14, 5, 82);
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(97, 26, 2, 46);

        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.moveTo(84, 94);
        ctx.quadraticCurveTo(98, 100, 112, 94);
        ctx.lineTo(110, 100);
        ctx.quadraticCurveTo(98, 104, 86, 100);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 2. МАССИВНЫЕ ШИПАСТЫЕ ЛАТНЫЕ НАПЛЕЧНИКИ ПОЛКОВОДЦА
        ctx.fillStyle = '#1e222b';
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.lineTo(32, 92);
        ctx.lineTo(96, 92);
        ctx.lineTo(114, 128);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(32, 92); ctx.lineTo(96, 92);
        ctx.stroke();

        ctx.fillStyle = '#57606f';
        ctx.beginPath(); ctx.moveTo(26, 98); ctx.lineTo(10, 82); ctx.lineTo(34, 92); ctx.fill();
        ctx.beginPath(); ctx.moveTo(102, 98); ctx.lineTo(118, 82); ctx.lineTo(94, 92); ctx.fill();

        // 3. ЗЛОВЕЩИЙ ЧЕРЕП ЛОРДА-НЕЖИТИ (Внутри Т-образного выреза шлема)
        ctx.fillStyle = '#e5e0d0';
        ctx.beginPath();
        ctx.moveTo(42, 48);
        ctx.lineTo(86, 48);
        ctx.lineTo(85, 84);
        ctx.lineTo(64, 98);
        ctx.lineTo(43, 84);
        ctx.closePath();
        ctx.fill();

        // Глубокие глазницы и пылающий багровый огонь
        ctx.fillStyle = '#0f0c14';
        ctx.beginPath(); ctx.ellipse(52, 60, 7, 5, -0.15, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(76, 60, 7, 5, 0.15, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ff2a2a';
        ctx.beginPath(); ctx.arc(52, 60, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 60, 3, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffd875';
        ctx.beginPath(); ctx.arc(52, 60, 1.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 60, 1.2, 0, Math.PI * 2); ctx.fill();

        // Носовой провал и оскал костяных челюстей в вертикальной прорези буквы Т
        ctx.fillStyle = '#0f0c14';
        ctx.beginPath();
        ctx.moveTo(64, 66); ctx.lineTo(67, 74); ctx.lineTo(64, 72); ctx.lineTo(61, 74);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#1f1b18';
        ctx.fillRect(55, 80, 18, 7);

        ctx.fillStyle = '#f5f2e6';
        for (let x = 56; x <= 70; x += 3.5) {
            ctx.fillRect(x, 78, 2.5, 4);
            ctx.fillRect(x, 84.5, 2.5, 4);
        }

        // 4. ТЯЖЁЛЫЙ РОГАТЫЙ ШЛЕМ С Т-ОБРАЗНЫМ ВЫРЕЗОМ (БАРБЮТ)
        // Боевые рога шлема
        ctx.fillStyle = '#4b5563';
        ctx.beginPath();
        ctx.moveTo(40, 44);
        ctx.bezierCurveTo(16, 36, 12, 14, 28, 6);
        ctx.bezierCurveTo(24, 18, 30, 30, 46, 36);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(88, 44);
        ctx.bezierCurveTo(112, 36, 116, 14, 100, 6);
        ctx.bezierCurveTo(104, 18, 98, 30, 82, 36);
        ctx.closePath();
        ctx.fill();

        // Корпус шлема с нащёчниками, оставляющий открытой букву «Т» (глаза + вертикаль носа/рта)
        ctx.fillStyle = '#2c3340';
        ctx.beginPath();
        ctx.moveTo(38, 52);
        ctx.quadraticCurveTo(42, 18, 64, 16); // Купол шлема
        ctx.quadraticCurveTo(86, 18, 90, 52);
        ctx.lineTo(88, 86); // Правый нижний край нащёчника
        ctx.lineTo(72, 96); // Правый внутренний край вертикальной прорези Т
        ctx.lineTo(72, 65); // Правый угол горизонтальной прорези глаз
        ctx.lineTo(84, 65); // Правый край прорези глаз
        ctx.lineTo(84, 54); // Верхний правый угол прорези глаз
        ctx.lineTo(64, 56); // Переносица над вырезом
        ctx.lineTo(44, 54); // Верхний левый угол прорези глаз
        ctx.lineTo(44, 65); // Левый край прорези глаз
        ctx.lineTo(56, 65); // Левый угол горизонтальной прорези глаз
        ctx.lineTo(56, 96); // Левый внутренний край вертикальной прорези Т
        ctx.lineTo(40, 86); // Левый нижний край нащёчника
        ctx.closePath();
        ctx.fill();

        // Золотая окантовка Т-образного выреза и центральное ребро на лбу шлема
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(56, 96);
        ctx.lineTo(56, 65);
        ctx.lineTo(44, 65);
        ctx.lineTo(44, 54);
        ctx.lineTo(64, 56);
        ctx.lineTo(84, 54);
        ctx.lineTo(84, 65);
        ctx.lineTo(72, 65);
        ctx.lineTo(72, 96);
        ctx.stroke();

        // Центральный гребень-ребро на лбу шлема
        ctx.strokeStyle = '#57606f';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(64, 16);
        ctx.lineTo(64, 56);
        ctx.stroke();

        // 5. ТЯЖЁЛЫЙ ГЕРАЛЬДИЧЕСКИЙ ЩИТ НА ПЕРЕДНЕМ ПЛАНЕ (Слева снизу)
        ctx.fillStyle = '#181c24';
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(14, 86);
        ctx.lineTo(46, 86);
        ctx.lineTo(44, 112);
        ctx.lineTo(30, 126);
        ctx.lineTo(16, 112);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#962d2d';
        ctx.fillRect(28, 88, 4, 34);
        ctx.fillRect(17, 101, 26, 4);

        ctx.fillStyle = '#ffd875';
        ctx.beginPath(); ctx.arc(30, 103, 4, 0, Math.PI * 2); ctx.fill();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 16);
        ctx.quadraticCurveTo(42, 18, 38, 52);
        ctx.lineTo(40, 86);
        ctx.lineTo(56, 96);
        ctx.lineTo(64, 98);
        ctx.lineTo(64, 128);
        ctx.lineTo(14, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ЛЮДОЯЩЕРА В ПРОФИЛЬ С ОТКРЫТОЙ ПАСТЬЮ И ВИЛАМИ
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateLizardfolkAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. КОВАНЫЕ ВИЛЫ ЗА СПИНОЙ (По диагонали справа вверх)
        ctx.save();
        ctx.translate(96, 34);
        ctx.rotate((Math.PI / 180) * 30);

        // Деревянный черенок вил
        ctx.strokeStyle = '#5c3e26';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, 2);
        ctx.lineTo(0, 112);
        ctx.stroke();

        // Стальная втулка крепления
        ctx.fillStyle = '#4b5563';
        ctx.fillRect(-3, -2, 6, 8);

        // Изогнутая перекладина и 3 острых стальных зубца вил
        ctx.strokeStyle = '#7f8c8d';
        ctx.lineWidth = 2.6;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        // Левый зубец и дуга основания
        ctx.moveTo(-10, -24);
        ctx.lineTo(-10, -6);
        ctx.quadraticCurveTo(-10, 0, 0, 0);
        // Правый зубец и дуга основания
        ctx.quadraticCurveTo(10, 0, 10, -6);
        ctx.lineTo(10, -24);
        // Центральный зубец
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -25);
        ctx.stroke();

        // Светлые заточенные кончики зубцов
        ctx.fillStyle = '#dfe6e9';
        [-10, 0, 10].forEach(px => {
            const tipY = px === 0 ? -27 : -26;
            ctx.beginPath();
            ctx.moveTo(px - 1.6, tipY + 5);
            ctx.lineTo(px, tipY);
            ctx.lineTo(px + 1.6, tipY + 5);
            ctx.closePath();
            ctx.fill();
        });
        ctx.restore();

        // 2. ЗАЗУБРЕННЫЙ ГРЕБЕНЬ РЕПТИЛИИ (Идёт по затылку и мощной шее)
        ctx.fillStyle = '#c0392b';
        ctx.beginPath();
        ctx.moveTo(82, 36);
        ctx.lineTo(94, 24);
        ctx.lineTo(92, 42);
        ctx.lineTo(106, 38);
        ctx.lineTo(98, 54);
        ctx.lineTo(112, 56);
        ctx.lineTo(102, 70);
        ctx.lineTo(114, 76);
        ctx.lineTo(104, 88);
        ctx.closePath();
        ctx.fill();

        // 3. МОЩНАЯ ЧЕШУЙЧАТАЯ ШЕЯ И ПЛЕЧИ В ПОЛУОБОРОТ
        ctx.fillStyle = '#1e4d3b';
        ctx.beginPath();
        ctx.moveTo(64, 70);
        ctx.quadraticCurveTo(96, 72, 114, 128);
        ctx.lineTo(42, 128);
        ctx.quadraticCurveTo(50, 96, 56, 82);
        ctx.closePath();
        ctx.fill();

        // Кожаная перевязь и ожерелье из клыков на груди
        ctx.fillStyle = '#4a3222';
        ctx.beginPath();
        ctx.moveTo(52, 94);
        ctx.lineTo(78, 128);
        ctx.lineTo(94, 128);
        ctx.lineTo(64, 90);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#f5f0dc';
        ctx.beginPath(); ctx.moveTo(58, 98); ctx.lineTo(56, 110); ctx.lineTo(64, 102); ctx.fill();
        ctx.beginPath(); ctx.moveTo(68, 104); ctx.lineTo(68, 116); ctx.lineTo(75, 108); ctx.fill();

        // 4. ВЕРХНЯЯ ЧЕЛЮСТЬ И ЧЕРЕП В ПРОФИЛЬ ВЛЕВО (Приподняты в рёве)
        ctx.fillStyle = '#2a6f56';
        ctx.beginPath();
        ctx.moveTo(90, 44); // Затылок
        ctx.lineTo(68, 34); // Надбровный гребень
        ctx.lineTo(14, 48); // Вытянутая верхняя челюсть крокодила
        ctx.lineTo(16, 58); // Передний край верхней губы
        ctx.lineTo(58, 66); // Угол пасти
        ctx.lineTo(88, 68); // Скула
        ctx.closePath();
        ctx.fill();

        // Надбровный щиток и ноздря на кончике морды
        ctx.fillStyle = '#163d2f';
        ctx.beginPath(); ctx.arc(64, 40, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(20, 48, 2, 0, Math.PI * 2); ctx.fill();

        // 5. ШИРОКО РАСПАХНУТАЯ ПАСТЬ, ЯЗЫК И НИЖНЯЯ ЧЕЛЮСТЬ
        // Тёмная глубина глотки
        ctx.fillStyle = '#240b0e';
        ctx.beginPath();
        ctx.moveTo(16, 57);
        ctx.lineTo(62, 66);
        ctx.lineTo(24, 84);
        ctx.lineTo(20, 78);
        ctx.lineTo(44, 67);
        ctx.closePath();
        ctx.fill();

        // Мясистый раздвоенный язык внутри пасти
        ctx.fillStyle = '#a62b38';
        ctx.beginPath();
        ctx.moveTo(52, 68);
        ctx.quadraticCurveTo(36, 72, 24, 71);
        ctx.lineTo(32, 75);
        ctx.lineTo(26, 77);
        ctx.quadraticCurveTo(40, 77, 54, 71);
        ctx.closePath();
        ctx.fill();

        // Нижняя массивная челюсть (опущена вниз в рыке)
        ctx.fillStyle = '#3d9173';
        ctx.beginPath();
        ctx.moveTo(58, 65);
        ctx.lineTo(20, 79); // Кончик нижней челюсти
        ctx.lineTo(26, 88);
        ctx.lineTo(66, 84);
        ctx.lineTo(88, 68);
        ctx.closePath();
        ctx.fill();

        // 6. ЧАСТОКОЛ ОСТРЫХ КРОКОДИЛЬИХ ЗУБОВ В ОТКРЫТОЙ ПАСТИ
        ctx.fillStyle = '#ffffff';
        // Верхний ряд клыков
        ctx.beginPath(); ctx.moveTo(18, 57); ctx.lineTo(21, 65); ctx.lineTo(24, 58); ctx.fill();
        ctx.beginPath(); ctx.moveTo(27, 59); ctx.lineTo(30, 66); ctx.lineTo(33, 60); ctx.fill();
        ctx.beginPath(); ctx.moveTo(36, 61); ctx.lineTo(39, 67); ctx.lineTo(42, 62); ctx.fill();
        ctx.beginPath(); ctx.moveTo(45, 63); ctx.lineTo(48, 68); ctx.lineTo(51, 64); ctx.fill();

        // Нижний ряд клыков
        ctx.beginPath(); ctx.moveTo(22, 79); ctx.lineTo(25, 72); ctx.lineTo(28, 77); ctx.fill();
        ctx.beginPath(); ctx.moveTo(31, 76); ctx.lineTo(34, 70); ctx.lineTo(37, 74); ctx.fill();
        ctx.beginPath(); ctx.moveTo(40, 73); ctx.lineTo(43, 68); ctx.lineTo(46, 71); ctx.fill();

        // 7. ХИЩНЫЙ ЯНТАРНЫЙ ГЛАЗ С ВЕРТИКАЛЬНЫМ ЗРАЧКОМ
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.moveTo(56, 46);
        ctx.lineTo(70, 42);
        ctx.lineTo(65, 51);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#0d1a14'; // Вертикальный зрачок
        ctx.fillRect(62, 43.5, 1.6, 6);

        ctx.fillStyle = '#ffffff'; // Блик
        ctx.beginPath(); ctx.arc(61, 45.5, 1, 0, Math.PI * 2); ctx.fill();

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень вдоль нижней челюсти и груди)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(20, 79);
        ctx.lineTo(66, 84);
        ctx.lineTo(88, 68);
        ctx.lineTo(114, 128);
        ctx.lineTo(42, 128);
        ctx.lineTo(56, 85);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ЗЕЛЁНОЙ ЖИЖИ С ЗУБАМИ ИЗ САМОЙ СЛИЗИ
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateGreenOozeAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ВНЕШНИЙ КОНТУР БЕСФОРМЕННОЙ МАССЫ ЖИЖИ И ПСЕВДОПОДИЙ
        ctx.fillStyle = '#1e824c'; // Глубокий изумрудно-слизистый тон
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.bezierCurveTo(10, 96, 22, 86, 16, 68); // Левая псевдоподия
        ctx.bezierCurveTo(12, 54, 28, 48, 34, 38);
        ctx.bezierCurveTo(42, 20, 56, 16, 64, 24);
        ctx.bezierCurveTo(74, 12, 92, 18, 96, 38);
        ctx.bezierCurveTo(104, 48, 118, 56, 112, 72); // Правая псевдоподия
        ctx.bezierCurveTo(106, 88, 120, 98, 114, 128);
        ctx.closePath();
        ctx.fill();

        // 2. ВНУТРЕННЕЕ КИСЛОТНО-ЯРКОЕ ЯДРО ЖИЖИ (Объём и свечение)
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath();
        ctx.moveTo(22, 128);
        ctx.bezierCurveTo(20, 98, 30, 88, 26, 70);
        ctx.bezierCurveTo(24, 56, 38, 46, 44, 34);
        ctx.bezierCurveTo(54, 24, 76, 24, 86, 36);
        ctx.bezierCurveTo(94, 48, 106, 58, 102, 74);
        ctx.bezierCurveTo(98, 90, 108, 102, 106, 128);
        ctx.closePath();
        ctx.fill();

        // 3. ЛЕТЯЩИЕ И СТЕКАЮЩИЕ КАПЛИ СЛИЗИ ВОКРУГ ТЕЛА
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath(); ctx.arc(14, 44, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(114, 42, 5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(24, 24, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(104, 22, 3.5, 0, Math.PI * 2); ctx.fill();

        // Стекающая капля справа
        ctx.beginPath();
        ctx.moveTo(108, 76);
        ctx.quadraticCurveTo(116, 92, 112, 98);
        ctx.arc(110, 98, 3, 0, Math.PI);
        ctx.closePath();
        ctx.fill();

        // 4. ВНУТРЕННИЕ ПУЗЫРЬКИ ГАЗА И ПОЛУПЕРЕВАРЕННЫЙ ЧЕРЕПОК В ГЛУБИНЕ
        // Маленький растворённый череп внутри слизи сверху
        ctx.fillStyle = 'rgba(236, 240, 241, 0.32)';
        ctx.beginPath(); ctx.arc(66, 42, 7, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(62, 47, 8, 4);

        // Пузырьки кислоты внутри массы
        ctx.fillStyle = '#a3e4d7';
        ctx.beginPath(); ctx.arc(42, 52, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(88, 54, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(36, 108, 5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(92, 112, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(64, 118, 3.5, 0, Math.PI * 2); ctx.fill();

        // 5. РАСКРЫТАЯ ПАСТЬ С ЗУБАМИ ИЗ САМОЙ ТЯГУЧЕЙ ЖИЖИ
        // Тёмно-изумрудная глубина пасти
        ctx.fillStyle = '#0b3820';
        ctx.beginPath();
        ctx.moveTo(34, 78);
        ctx.quadraticCurveTo(64, 62, 94, 78);
        ctx.quadraticCurveTo(64, 104, 34, 78);
        ctx.closePath();
        ctx.fill();

        // Верхние тягучие зубы-сталактиты из самой салатово-кислотной жижи
        ctx.fillStyle = '#7bed9f';
        ctx.beginPath();
        // Левый клык из жижи
        ctx.moveTo(40, 75); ctx.lineTo(44, 87); ctx.lineTo(49, 73);
        // Средне-левый клык
        ctx.moveTo(52, 72); ctx.lineTo(56, 89); ctx.lineTo(61, 71);
        // Центральный длинный клык-нить
        ctx.moveTo(61, 71); ctx.lineTo(64, 91); ctx.lineTo(67, 71);
        // Средне-правый клык
        ctx.moveTo(67, 71); ctx.lineTo(72, 89); ctx.lineTo(76, 72);
        // Правый клык
        ctx.moveTo(79, 73); ctx.lineTo(84, 87); ctx.lineTo(88, 75);
        ctx.closePath();
        ctx.fill();

        // Нижние вытянутые зубы-сталагмиты из самой жижи
        ctx.fillStyle = '#55efc4';
        ctx.beginPath();
        ctx.moveTo(43, 84); ctx.lineTo(47, 75); ctx.lineTo(51, 86);
        ctx.moveTo(55, 88); ctx.lineTo(59, 76); ctx.lineTo(63, 89);
        ctx.moveTo(65, 89); ctx.lineTo(69, 76); ctx.lineTo(73, 88);
        ctx.moveTo(77, 86); ctx.lineTo(81, 75); ctx.lineTo(85, 84);
        ctx.closePath();
        ctx.fill();

        // 6. ГЛЯНЦЕВЫЕ ВЛАЖНЫЕ БЛИКИ НА СЛИЗИ
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(46, 30);
        ctx.quadraticCurveTo(60, 22, 78, 28);
        ctx.moveTo(94, 52);
        ctx.quadraticCurveTo(100, 62, 96, 72);
        ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 24);
        ctx.bezierCurveTo(56, 16, 42, 20, 34, 38);
        ctx.bezierCurveTo(28, 48, 12, 54, 16, 68);
        ctx.bezierCurveTo(22, 86, 10, 96, 14, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },
    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ БОГГАРДА-ЖРЕЦА НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateBoggardPriestAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ШАМАНСКИЙ ПОСОХ С ЧЕРЕПОМ И БОЛОТНОЙ СФЕРОЙ (Справа на заднем плане)
        ctx.strokeStyle = '#4a3219';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(108, 30);
        ctx.quadraticCurveTo(104, 78, 110, 128);
        ctx.stroke();

        // Магическое бирюзовое свечение на навершии посоха
        ctx.fillStyle = 'rgba(0, 242, 254, 0.3)';
        ctx.beginPath(); ctx.arc(108, 22, 13, 0, Math.PI * 2); ctx.fill();

        // Маленький ритуальный череп-навершие на посохе
        ctx.fillStyle = '#e8e4d5';
        ctx.beginPath(); ctx.arc(108, 22, 6.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(104.5, 26, 7, 4);

        ctx.fillStyle = '#00f2fe'; // Светящиеся глазницы черепа
        ctx.beginPath(); ctx.arc(105.5, 22, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(110.5, 22, 1.5, 0, Math.PI * 2); ctx.fill();

        // 2. ЖРЕЧЕСКАЯ МАНТИЯ И ОЖЕРЕЛЬЕ ИЗ КОСТЕЙ
        ctx.fillStyle = '#2d1e3e'; // Тёмно-фиолетовая болотная ряса
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.lineTo(32, 92);
        ctx.lineTo(96, 92);
        ctx.lineTo(114, 128);
        ctx.closePath();
        ctx.fill();

        // Охристо-золотая ритуальная кайма на вороте мантии
        ctx.strokeStyle = '#c89d54';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(34, 94);
        ctx.quadraticCurveTo(64, 116, 94, 94);
        ctx.stroke();

        // Ожерелье из костяных клыков и бусин на груди
        ctx.fillStyle = '#f5f0dc';
        ctx.beginPath(); ctx.moveTo(46, 102); ctx.lineTo(49, 114); ctx.lineTo(53, 105); ctx.fill();
        ctx.beginPath(); ctx.moveTo(61, 107); ctx.lineTo(64, 121); ctx.lineTo(67, 107); ctx.fill();
        ctx.beginPath(); ctx.moveTo(82, 102); ctx.lineTo(79, 114); ctx.lineTo(75, 105); ctx.fill();

        // 3. ЦЕРЕМОНИАЛЬНЫЙ ГОЛОВНОЙ УБОР ИЗ ПЕРЬЕВ И КОСТЕЙ
        // Болотные перья веером за головой
        ctx.fillStyle = '#1e8449';
        ctx.beginPath(); ctx.moveTo(46, 44); ctx.lineTo(28, 16); ctx.lineTo(54, 38); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(82, 44); ctx.lineTo(100, 16); ctx.lineTo(74, 38); ctx.closePath(); ctx.fill();

        ctx.fillStyle = '#00b894';
        ctx.beginPath(); ctx.moveTo(56, 38); ctx.lineTo(50, 10); ctx.lineTo(63, 35); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(72, 38); ctx.lineTo(78, 10); ctx.lineTo(65, 35); ctx.closePath(); ctx.fill();

        // Костяной гребень-корона на макушке
        ctx.fillStyle = '#dcd6c8';
        ctx.beginPath();
        ctx.moveTo(48, 42);
        ctx.lineTo(64, 18);
        ctx.lineTo(80, 42);
        ctx.closePath();
        ctx.fill();

        // 4. ГОЛОВА И РАЗДУТЫЙ ГОРЛОВОЙ МЕШОК БОГГАРДА-ЖРЕЦА
        ctx.fillStyle = '#4e6e3a'; // Болотно-зелёная кожа
        ctx.beginPath();
        ctx.moveTo(38, 52);
        ctx.quadraticCurveTo(64, 36, 90, 52);
        ctx.lineTo(102, 78);
        ctx.lineTo(88, 102);
        ctx.quadraticCurveTo(64, 110, 40, 102);
        ctx.lineTo(26, 78);
        ctx.closePath();
        ctx.fill();

        // Светлый оливково-жёлтый горловой мешок
        ctx.fillStyle = '#8fa868';
        ctx.beginPath();
        ctx.moveTo(38, 78);
        ctx.quadraticCurveTo(64, 72, 90, 78);
        ctx.lineTo(84, 100);
        ctx.quadraticCurveTo(64, 106, 44, 100);
        ctx.closePath();
        ctx.fill();

        // Ритуальная белая шаманская раскраска на щеках и лбу
        ctx.strokeStyle = 'rgba(245, 240, 220, 0.8)';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(58, 44); ctx.lineTo(64, 52); ctx.lineTo(70, 44); // Знак на лбу
        ctx.moveTo(33, 66); ctx.lineTo(43, 69); // Полоски на левой щеке
        ctx.moveTo(32, 71); ctx.lineTo(42, 73);
        ctx.moveTo(95, 66); ctx.lineTo(85, 69); // Полоски на правой щеке
        ctx.moveTo(96, 71); ctx.lineTo(86, 73);
        ctx.stroke();

        // 5. ВЫПУКЛЫЕ ЖАБЬИ ГЛАЗА, СВЕТЯЩИЕСЯ БИРЮЗОВОЙ МАГИЕЙ
        ctx.fillStyle = '#3b542b';
        ctx.beginPath(); ctx.arc(42, 48, 10.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(86, 48, 10.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#00f2fe'; // Магическое бирюзовое свечение глаз жреца
        ctx.beginPath(); ctx.arc(42, 49, 7.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(86, 49, 7.2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0b191e'; // Горизонтальные амфибийные зрачки
        ctx.fillRect(35, 48, 14, 2.3);
        ctx.fillRect(79, 48, 14, 2.3);

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(44, 46, 1.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(84, 46, 1.4, 0, Math.PI * 2); ctx.fill();

        // 6. НОЗДРИ И ШИРОКИЙ РОТ, БОРМОЧУЩИЙ ЗАКЛИНАНИЕ
        ctx.fillStyle = '#243619';
        ctx.beginPath(); ctx.arc(58, 60, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(70, 60, 1.8, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#1f2e16';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(32, 76);
        ctx.quadraticCurveTo(64, 86, 96, 76);
        ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 18);
        ctx.lineTo(48, 42);
        ctx.lineTo(38, 52);
        ctx.lineTo(26, 78);
        ctx.lineTo(32, 92);
        ctx.lineTo(14, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ПРЕДВОДИТЕЛЬНИЦЫ РАЗБОЙНИКОВ С ТОПОРАМИ
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateBanditQueenAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ДВА СКРЕЩЁННЫХ БОЕВЫХ ТОПОРА ЗА СПИНОЙ (На заднем плане)
        const drawBackAxe = (cx, cy, angleDeg, flip) => {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate((Math.PI / 180) * angleDeg);
            if (flip) ctx.scale(-1, 1);

            // Деревянное древко топора
            ctx.strokeStyle = '#5c3e26';
            ctx.lineWidth = 4.5;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(0, -36);
            ctx.lineTo(0, 62);
            ctx.stroke();

            // Стальной обух и полукруглое лезвие топора
            ctx.fillStyle = '#7f8c8d';
            ctx.beginPath();
            ctx.moveTo(-4, -30);
            ctx.lineTo(18, -38);
            ctx.quadraticCurveTo(24, -22, 18, -8);
            ctx.lineTo(-4, -16);
            ctx.closePath();
            ctx.fill();

            // Светлая заточенная кромка лезвия
            ctx.fillStyle = '#dfe6e9';
            ctx.beginPath();
            ctx.moveTo(15, -36);
            ctx.lineTo(18, -38);
            ctx.quadraticCurveTo(24, -22, 18, -8);
            ctx.lineTo(15, -10);
            ctx.quadraticCurveTo(20, -22, 15, -36);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        };

        drawBackAxe(34, 62, -32, true);  // Левый топор
        drawBackAxe(94, 62, 32, false);  // Правый топор

        // 2. ПЫШНЫЕ РАСТРЁПАННЫЕ ОГНЕННО-РЫЖИЕ ВОЛОСЫ (Задний план)
        ctx.fillStyle = '#9c3416';
        ctx.beginPath();
        ctx.moveTo(36, 46);
        ctx.quadraticCurveTo(20, 82, 22, 126);
        ctx.lineTo(106, 126);
        ctx.quadraticCurveTo(108, 82, 92, 46);
        ctx.closePath();
        ctx.fill();

        // 3. КОЖАНАЯ БРОНЯ РАЗБОЙНИЦЫ И МЕХОВОЙ ВОРОТНИК
        ctx.fillStyle = '#3b2618';
        ctx.beginPath();
        ctx.moveTo(20, 128);
        ctx.lineTo(38, 100);
        ctx.lineTo(90, 100);
        ctx.lineTo(108, 128);
        ctx.closePath();
        ctx.fill();

        // Тёмный меховой воротник и золотые заклёпки
        ctx.fillStyle = '#241914';
        ctx.beginPath();
        ctx.moveTo(34, 102);
        ctx.quadraticCurveTo(64, 116, 94, 102);
        ctx.lineTo(88, 94);
        ctx.quadraticCurveTo(64, 106, 40, 94);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#d4af37';
        ctx.beginPath(); ctx.arc(42, 114, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(86, 114, 2, 0, Math.PI * 2); ctx.fill();

        // 4. ШЕЯ И ДЕРЗКОЕ ЛИЦО ПРЕДВОДИТЕЛЬНИЦЫ
        ctx.fillStyle = '#dfb094';
        ctx.fillRect(55, 86, 18, 16);

        ctx.fillStyle = '#f5c7ab';
        ctx.beginPath();
        ctx.moveTo(45, 50);
        ctx.lineTo(83, 50);
        ctx.lineTo(81, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(47, 78);
        ctx.closePath();
        ctx.fill();

        // 5. КОЖАНАЯ БАНДАНА-ПОВЯЗКА НА ЛБУ И РЫЖИЕ ПРЯДИ
        // Верхняя копна рыжих волос
        ctx.fillStyle = '#c4451c';
        ctx.beginPath();
        ctx.moveTo(40, 52);
        ctx.quadraticCurveTo(42, 24, 64, 22);
        ctx.quadraticCurveTo(86, 24, 88, 52);
        ctx.closePath();
        ctx.fill();

        // Тёмно-багровая разбойничья бандана на лбу
        ctx.fillStyle = '#6e1919';
        ctx.beginPath();
        ctx.moveTo(42, 46);
        ctx.quadraticCurveTo(64, 42, 86, 46);
        ctx.lineTo(85, 54);
        ctx.quadraticCurveTo(64, 50, 43, 54);
        ctx.closePath();
        ctx.fill();

        // Развевающийся узел-хвост банданы сбоку
        ctx.fillStyle = '#521111';
        ctx.beginPath();
        ctx.moveTo(85, 48);
        ctx.lineTo(100, 42);
        ctx.lineTo(96, 54);
        ctx.lineTo(102, 60);
        ctx.lineTo(85, 54);
        ctx.closePath();
        ctx.fill();

        // Непослушные рыжие пряди по бокам лица
        ctx.fillStyle = '#d35400';
        ctx.beginPath();
        ctx.moveTo(44, 52); ctx.quadraticCurveTo(38, 70, 43, 86); ctx.lineTo(48, 82); ctx.quadraticCurveTo(44, 66, 48, 53);
        ctx.moveTo(84, 52); ctx.quadraticCurveTo(90, 70, 85, 86); ctx.lineTo(80, 82); ctx.quadraticCurveTo(84, 66, 80, 53);
        ctx.fill();

        // 6. ХИТРЫЙ ПРИЩУР ИЗУМРУДНЫХ ГЛАЗ, ШРАМ И САМОДОВОЛЬНАЯ УХМЫЛКА
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(54, 63, 4.5, 1.8, -0.08, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 63, 4.5, 1.8, 0.08, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#27ae60'; // Острые зелёные глаза
        ctx.beginPath(); ctx.arc(54, 63, 1.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 63, 1.7, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(54.6, 62.3, 0.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74.6, 62.3, 0.6, 0, Math.PI * 2); ctx.fill();

        // Суровые рыжие брови
        ctx.strokeStyle = '#6e230b';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(47, 57); ctx.lineTo(59, 59); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(81, 57); ctx.lineTo(69, 59); ctx.stroke();

        // Косой боевой шрам через переносицу и правую щеку
        ctx.strokeStyle = '#b71c1c';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(60, 65);
        ctx.lineTo(75, 76);
        ctx.stroke();

        // Аккуратный нос и дерзкая кривая ухмылка
        ctx.strokeStyle = '#cf9778';
        ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(64, 60); ctx.lineTo(62, 73); ctx.lineTo(66, 73); ctx.stroke();

        ctx.fillStyle = '#b54949';
        ctx.beginPath();
        ctx.moveTo(56, 82);
        ctx.quadraticCurveTo(65, 86, 73, 80);
        ctx.quadraticCurveTo(64, 88, 56, 82);
        ctx.closePath();
        ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 22);
        ctx.quadraticCurveTo(42, 24, 40, 52);
        ctx.lineTo(47, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(64, 128);
        ctx.lineTo(20, 128);
        ctx.lineTo(38, 100);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ МЕДВЕСЫЧА (OWLBEAR) НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateOwlbearAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАДНИЙ ПЛАН: Огромные лохматые медвежьи плечи и холка
        ctx.fillStyle = '#3b2618'; // Глубокий каштаново-бурый мех
        ctx.beginPath();
        ctx.moveTo(10, 128);
        ctx.quadraticCurveTo(20, 74, 64, 68);
        ctx.quadraticCurveTo(108, 74, 118, 128);
        ctx.closePath();
        ctx.fill();

        // Взъерошенные клочья меха на плечах
        ctx.fillStyle = '#4e3422';
        ctx.beginPath();
        ctx.moveTo(20, 96); ctx.lineTo(8, 86); ctx.lineTo(24, 82);
        ctx.moveTo(16, 112); ctx.lineTo(6, 108); ctx.lineTo(20, 102);
        ctx.moveTo(108, 96); ctx.lineTo(120, 86); ctx.lineTo(104, 82);
        ctx.moveTo(112, 112); ctx.lineTo(122, 108); ctx.lineTo(108, 102);
        ctx.fill();

        // 2. ПЕРЬЕВЫЕ СОВИНЫЕ «УШИ»-ПУЧКИ ПО БОКАМ ГОЛОВЫ
        ctx.fillStyle = '#4a3120';
        // Левый пучок перьев
        ctx.beginPath();
        ctx.moveTo(42, 42);
        ctx.lineTo(16, 18);
        ctx.lineTo(28, 36);
        ctx.lineTo(20, 42);
        ctx.lineTo(38, 54);
        ctx.closePath();
        ctx.fill();

        // Правый пучок перьев
        ctx.beginPath();
        ctx.moveTo(86, 42);
        ctx.lineTo(112, 18);
        ctx.lineTo(100, 36);
        ctx.lineTo(108, 42);
        ctx.lineTo(90, 54);
        ctx.closePath();
        ctx.fill();

        // 3. МАССИВНАЯ ГОЛОВА И ПЕРЬЕВОЙ ЛИЦЕВОЙ ДИСК СОВЫ
        ctx.fillStyle = '#5c3d28'; // Тёмный мех-оперение головы
        ctx.beginPath();
        ctx.moveTo(36, 44);
        ctx.quadraticCurveTo(64, 24, 92, 44);
        ctx.lineTo(100, 74);
        ctx.lineTo(84, 102);
        ctx.lineTo(64, 110);
        ctx.lineTo(44, 102);
        ctx.lineTo(28, 74);
        ctx.closePath();
        ctx.fill();

        // Светлый песочно-охристый совиный лицевой венец (два слитых диска вокруг глаз)
        ctx.fillStyle = '#c49a6c';
        ctx.beginPath();
        ctx.arc(47, 62, 18, 0, Math.PI * 2);
        ctx.arc(81, 62, 18, 0, Math.PI * 2);
        ctx.fill();

        // Нижняя светлая перьевая бородка под клювом
        ctx.fillStyle = '#a87e51';
        ctx.beginPath();
        ctx.moveTo(44, 76);
        ctx.quadraticCurveTo(64, 106, 84, 76);
        ctx.lineTo(64, 104);
        ctx.closePath();
        ctx.fill();

        // 4. ОГРОМНЫЕ СОВИНЫЕ ГЛАЗА И ГРОЗНЫЕ ПЕРЬЕВЫЕ БРОВИ
        // Тёмные обводки глазниц
        ctx.fillStyle = '#2b1b10';
        ctx.beginPath(); ctx.arc(47, 62, 11.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(81, 62, 11.5, 0, Math.PI * 2); ctx.fill();

        // Пылающая янтарно-золотая радужка
        ctx.fillStyle = '#ff9f1a';
        ctx.beginPath(); ctx.arc(47, 62, 9.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(81, 62, 9.2, 0, Math.PI * 2); ctx.fill();

        // Крупные чёрные зрачки
        ctx.fillStyle = '#0d0907';
        ctx.beginPath(); ctx.arc(47, 62, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(81, 62, 4.5, 0, Math.PI * 2); ctx.fill();

        // Яркие белые блики
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(49.5, 59, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(78.5, 59, 1.8, 0, Math.PI * 2); ctx.fill();

        // Суровые нахмуренные перьевые брови V-образным клином
        ctx.fillStyle = '#3b2618';
        ctx.beginPath();
        ctx.moveTo(32, 46);
        ctx.lineTo(64, 58);
        ctx.lineTo(96, 46);
        ctx.lineTo(92, 53);
        ctx.lineTo(64, 64);
        ctx.lineTo(36, 53);
        ctx.closePath();
        ctx.fill();

        // 5. МОЩНЫЙ ИЗОГНУТЫЙ КРЮЧКОВАТЫЙ КЛЮВ МЕДВЕСЫЧА
        // Нижняя челюсть клюва (приоткрыта в рыке)
        ctx.fillStyle = '#7a6845';
        ctx.beginPath();
        ctx.moveTo(56, 78);
        ctx.lineTo(72, 78);
        ctx.lineTo(64, 92);
        ctx.closePath();
        ctx.fill();

        // Тёмная полость пасти между створками клюва
        ctx.fillStyle = '#240c0c';
        ctx.beginPath();
        ctx.moveTo(55, 76);
        ctx.lineTo(73, 76);
        ctx.lineTo(64, 85);
        ctx.closePath();
        ctx.fill();

        // Верхний массивный костяной крюк клюва
        ctx.fillStyle = '#f5eedc';
        ctx.strokeStyle = '#3b2e1e';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(54, 66);
        ctx.quadraticCurveTo(64, 60, 74, 66);
        ctx.lineTo(72, 79);
        ctx.lineTo(64, 90); // Острый загнутый кончик клюва
        ctx.lineTo(56, 79);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 24);
        ctx.quadraticCurveTo(46, 30, 36, 44);
        ctx.lineTo(28, 74);
        ctx.lineTo(44, 102);
        ctx.lineTo(64, 110);
        ctx.lineTo(64, 128);
        ctx.lineTo(10, 128);
        ctx.quadraticCurveTo(20, 74, 64, 68);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ГРИГОРИЯ (ЩЕКАСТЫЙ ЛЕТОПИСЕЦ В СТИЛЕ ВОЛО)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateGrigoryAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ОДЕЖДА: Нарядный синий камзол путешественника с золотой отделкой
        ctx.fillStyle = '#1b4f72';
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.quadraticCurveTo(28, 96, 64, 96);
        ctx.quadraticCurveTo(100, 96, 114, 128);
        ctx.closePath();
        ctx.fill();

        // Пышный белый кружевной воротник-жабо
        ctx.fillStyle = '#f8f9fa';
        ctx.beginPath();
        ctx.moveTo(46, 100);
        ctx.lineTo(64, 126);
        ctx.lineTo(82, 100);
        ctx.closePath();
        ctx.fill();

        // Золотая вышивка и пуговицы на камзоле
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(44, 102); ctx.lineTo(58, 128);
        ctx.moveTo(84, 102); ctx.lineTo(70, 128);
        ctx.stroke();

        // 2. ПЫШНЫЕ КАШТАНОВЫЕ ЛОКОНЫ ПО БОКАМ И УШИ
        ctx.fillStyle = '#5c3a21';
        ctx.beginPath();
        ctx.arc(36, 66, 12, 0, Math.PI * 2);
        ctx.arc(92, 66, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#eebc9e';
        ctx.beginPath(); ctx.ellipse(37, 68, 4.5, 7, -0.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(91, 68, 4.5, 7, 0.1, 0, Math.PI * 2); ctx.fill();

        // 3. КРУГЛОЕ ЩЕКАСТОЕ ЛИЦО ГРИГОРИЯ
        ctx.fillStyle = '#fbd2b8';
        ctx.beginPath();
        ctx.moveTo(42, 48);
        ctx.lineTo(86, 48);
        // Выраженные пухлые щёки по бокам
        ctx.bezierCurveTo(96, 60, 96, 84, 82, 92);
        ctx.quadraticCurveTo(64, 104, 46, 92);
        ctx.bezierCurveTo(32, 84, 32, 60, 42, 48);
        ctx.closePath();
        ctx.fill();

        // Здоровый румянец на пухлых щеках
        ctx.fillStyle = 'rgba(231, 76, 60, 0.22)';
        ctx.beginPath(); ctx.arc(45, 73, 7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(83, 73, 7, 0, Math.PI * 2); ctx.fill();

        // 4. УХОЖЕННАЯ КАШТАНОВАЯ БОРОДА И ЩЕГОЛЬСКИЕ УСЫ
        ctx.fillStyle = '#6e472b';
        ctx.beginPath();
        ctx.moveTo(41, 74);
        ctx.quadraticCurveTo(38, 98, 64, 108);
        ctx.quadraticCurveTo(90, 98, 87, 74);
        ctx.quadraticCurveTo(64, 86, 41, 74);
        ctx.closePath();
        ctx.fill();

        // Пышные закрученные усы
        ctx.fillStyle = '#4e311d';
        ctx.beginPath();
        ctx.moveTo(46, 79);
        ctx.quadraticCurveTo(64, 72, 82, 79);
        ctx.quadraticCurveTo(88, 76, 86, 82);
        ctx.quadraticCurveTo(64, 80, 42, 82);
        ctx.quadraticCurveTo(40, 76, 46, 79);
        ctx.closePath();
        ctx.fill();

        // Приветливая улыбка под усами
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(64, 84, 6, 2.2, 0, 0, Math.PI);
        ctx.fill();

        // 5. ЖИВЫЕ ЛЮБОПЫТНЫЕ ГЛАЗА, БРОВИ И НОС КАРТОШКОЙ
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(52, 61, 4.8, 2.6, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(76, 61, 4.8, 2.6, 0, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#2980b9'; // Ясные синие глаза рассказчика
        ctx.beginPath(); ctx.arc(52, 61, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 61, 2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(52.8, 60.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76.8, 60.2, 0.7, 0, Math.PI * 2); ctx.fill();

        // Выразительные приподнятые брови
        ctx.strokeStyle = '#4e311d';
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(45, 55); ctx.quadraticCurveTo(52, 51, 58, 55); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(70, 55); ctx.quadraticCurveTo(76, 51, 83, 55); ctx.stroke();

        // Округлый мясистый нос
        ctx.fillStyle = '#e0a587';
        ctx.beginPath();
        ctx.arc(64, 69, 5.5, 0, Math.PI * 2);
        ctx.fill();

        // 6. ПЫШНЫЙ БЕРЕТ БАРДА-ЛЕТОПИСЦА С БОЛЬШИМ БЕЛЫМ ПЕРОМ (В духе Воло)
        ctx.save();
        ctx.translate(64, 42);
        ctx.rotate((Math.PI / 180) * -8);
        ctx.translate(-64, -42);

        // Лазурно-синий пышный берет
        ctx.fillStyle = '#2471a3';
        ctx.beginPath();
        ctx.ellipse(64, 34, 32, 16, 0, 0, Math.PI * 2);
        ctx.fill();

        // Золотой ободок-повязка берета
        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.moveTo(38, 44);
        ctx.quadraticCurveTo(64, 39, 90, 44);
        ctx.lineTo(88, 49);
        ctx.quadraticCurveTo(64, 44, 40, 49);
        ctx.closePath();
        ctx.fill();

        // Пышное белое перо, выходящее из золотой пряжки справа
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(82, 42);
        ctx.quadraticCurveTo(104, 18, 118, 6);
        ctx.quadraticCurveTo(110, 26, 86, 44);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffd875';
        ctx.beginPath(); ctx.arc(82, 43, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 18);
        ctx.lineTo(32, 34);
        ctx.lineTo(34, 76);
        ctx.lineTo(46, 98);
        ctx.lineTo(14, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ЧЁРНОГО КОБОЛЬДА-ВОИНА (ПРАЗИЛ) С МОЛОТОМ И КРУГЛЫМ ЩИТОМ
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generatePrazilAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. МАССИВНЫЙ БОЕВОЙ МОЛОТ ЗА СПИНОЙ С ЛАЗУРНЫМ СВЕЧЕНИЕМ (Справа сверху)
        ctx.save();
        ctx.translate(98, 42);
        ctx.rotate((Math.PI / 180) * 28);

        ctx.strokeStyle = '#3d2817';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 96);
        ctx.stroke();

        ctx.fillStyle = 'rgba(0, 210, 255, 0.28)';
        ctx.beginPath();
        ctx.arc(0, -10, 22, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#4a5568';
        ctx.strokeStyle = '#1a202c';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(-16, -20, 32, 18, 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#a0aec0';
        ctx.fillRect(-14, -18, 28, 5);
        ctx.fillStyle = '#70e1f5';
        ctx.fillRect(-2, -17, 4, 12);
        ctx.restore();

        // 2. ЗАГНУТЫЕ НАЗАД РОГА И ШИПЫ НА ЗАТЫЛКЕ (Задний план)
        ctx.fillStyle = '#1c232b';
        ctx.beginPath();
        ctx.moveTo(74, 38);
        ctx.bezierCurveTo(84, 14, 106, 10, 114, 24);
        ctx.bezierCurveTo(102, 20, 90, 26, 84, 44);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(86, 52);
        ctx.quadraticCurveTo(106, 46, 118, 38);
        ctx.lineTo(96, 62);
        ctx.closePath();
        ctx.fill();

        // 3. ЧЕШУЙЧАТАЯ ШЕЯ И ТЁМНО-СТАЛЬНОЙ НАГРУДНИК С РЕМНЁМ
        ctx.fillStyle = '#1a2228';
        ctx.beginPath();
        ctx.moveTo(64, 76);
        ctx.quadraticCurveTo(96, 78, 112, 128);
        ctx.lineTo(36, 128);
        ctx.quadraticCurveTo(46, 98, 54, 84);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#2d3748';
        ctx.beginPath();
        ctx.moveTo(42, 104);
        ctx.lineTo(104, 104);
        ctx.lineTo(114, 128);
        ctx.lineTo(34, 128);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#1f1610';
        ctx.beginPath();
        ctx.moveTo(48, 96);
        ctx.lineTo(78, 128);
        ctx.lineTo(92, 128);
        ctx.lineTo(60, 94);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#a0aec0';
        ctx.beginPath(); ctx.arc(58, 102, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(68, 112, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(78, 122, 1.8, 0, Math.PI * 2); ctx.fill();

        // 4. ВЕРХНЯЯ ЧЕЛЮСТЬ И ЧЕРЕП ЧЁРНОГО КОБОЛЬДА В ПРОФИЛЬ ВЛЕВО
        ctx.fillStyle = '#222b33';
        ctx.beginPath();
        ctx.moveTo(90, 48);
        ctx.lineTo(68, 34);
        ctx.lineTo(16, 48);
        ctx.lineTo(20, 60);
        ctx.lineTo(60, 68);
        ctx.lineTo(88, 72);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#4a5c6b';
        ctx.beginPath();
        ctx.moveTo(22, 49);
        ctx.lineTo(54, 42);
        ctx.lineTo(50, 47);
        ctx.lineTo(24, 53);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#0d1114';
        ctx.beginPath(); ctx.arc(22, 50, 2, 0, Math.PI * 2); ctx.fill();

        // 5. ШИРОКО РАСПАХНУТАЯ ПАСТЬ, АЛЫЙ ЯЗЫК И НИЖНЯЯ ЧЕЛЮСТЬ
        ctx.fillStyle = '#2a0d12';
        ctx.beginPath();
        ctx.moveTo(20, 59);
        ctx.lineTo(64, 68);
        ctx.lineTo(28, 86);
        ctx.lineTo(24, 79);
        ctx.lineTo(48, 69);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#b8323f';
        ctx.beginPath();
        ctx.moveTo(54, 70);
        ctx.quadraticCurveTo(38, 74, 28, 74);
        ctx.quadraticCurveTo(38, 80, 56, 74);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#2e3a44';
        ctx.beginPath();
        ctx.moveTo(60, 67);
        ctx.lineTo(24, 80);
        ctx.lineTo(30, 89);
        ctx.lineTo(68, 86);
        ctx.lineTo(88, 72);
        ctx.closePath();
        ctx.fill();

        // 6. ОСТРЫЕ БЕЛЫЕ КЛЫКИ В РАСКРЫТОЙ ПАСТИ
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.moveTo(22, 59); ctx.lineTo(25, 67); ctx.lineTo(28, 60); ctx.fill();
        ctx.beginPath(); ctx.moveTo(31, 61); ctx.lineTo(34, 68); ctx.lineTo(37, 62); ctx.fill();
        ctx.beginPath(); ctx.moveTo(40, 63); ctx.lineTo(43, 69); ctx.lineTo(46, 64); ctx.fill();
        ctx.beginPath(); ctx.moveTo(49, 65); ctx.lineTo(52, 70); ctx.lineTo(55, 66); ctx.fill();

        ctx.beginPath(); ctx.moveTo(26, 80); ctx.lineTo(29, 73); ctx.lineTo(32, 78); ctx.fill();
        ctx.beginPath(); ctx.moveTo(35, 77); ctx.lineTo(38, 71); ctx.lineTo(41, 75); ctx.fill();
        ctx.beginPath(); ctx.moveTo(44, 74); ctx.lineTo(47, 69); ctx.lineTo(50, 72); ctx.fill();

        // 7. ХИЩНЫЙ СВЕТЯЩИЙСЯ ГОЛУБОЙ ГЛАЗ
        ctx.fillStyle = '#70e1f5';
        ctx.beginPath();
        ctx.moveTo(56, 46);
        ctx.lineTo(70, 42);
        ctx.lineTo(65, 51);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#0d1114';
        ctx.fillRect(62, 43.5, 1.5, 6);

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(61, 45.5, 1, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#0d1114';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(53, 43);
        ctx.lineTo(71, 40);
        ctx.stroke();

        // 8. ФРАГМЕНТ КРУГЛОГО ЩИТА НА ПЕРЕДНЕМ ПЛАНЕ (Слева внизу в перспективе)
        ctx.save();
        ctx.translate(18, 114);
        ctx.rotate((Math.PI / 180) * -18);

        // Внешний бронзово-латунный обод щита
        ctx.fillStyle = '#8c6239';
        ctx.strokeStyle = '#2b190d';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.ellipse(0, 0, 22, 28, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Внутреннее тёмное дерево щита
        ctx.fillStyle = '#4a311d';
        ctx.beginPath();
        ctx.ellipse(0, 0, 17, 23, 0, 0, Math.PI * 2);
        ctx.fill();

        // Вертикальные стыки досок щита
        ctx.strokeStyle = '#2b190d';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-6, -21); ctx.lineTo(-6, 21);
        ctx.moveTo(6, -21); ctx.lineTo(6, 21);
        ctx.stroke();

        // Заклёпки по бронзовому ободу
        ctx.fillStyle = '#d4af37';
        [-1.1, -0.4, 0.3, 1.0].forEach(ang => {
            ctx.beginPath();
            ctx.arc(19.5 * Math.cos(ang), 25.5 * Math.sin(ang), 1.4, 0, Math.PI * 2);
            ctx.fill();
        });

        // Выпуклый стальной умбон в центре щита
        ctx.fillStyle = '#718093';
        ctx.strokeStyle = '#1a202c';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.ellipse(2, 0, 7, 9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Световой блик на умбоне
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.ellipse(3.5, -2.5, 2.5, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 9. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень снизу)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.moveTo(24, 80);
        ctx.lineTo(68, 86);
        ctx.lineTo(88, 72);
        ctx.lineTo(112, 128);
        ctx.lineTo(34, 128);
        ctx.lineTo(54, 85);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ВИВЕРНЫ ЦВЕТЕНИЯ НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateBloomWyvernAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАГНУТЫЕ НАЗАД РОГА И ЛИСТОВИДНЫЕ ГРЕБНИ-ПЛАВНИКИ (Задний план)
        ctx.fillStyle = '#3b4a2b';
        // Верхний массивный рог виверны
        ctx.beginPath();
        ctx.moveTo(74, 38);
        ctx.bezierCurveTo(86, 12, 112, 8, 120, 22);
        ctx.bezierCurveTo(106, 18, 92, 26, 84, 44);
        ctx.closePath();
        ctx.fill();

        // Нижний острый листовидный гребень-ухо
        ctx.fillStyle = '#4e7a34';
        ctx.beginPath();
        ctx.moveTo(86, 50);
        ctx.quadraticCurveTo(108, 42, 122, 34);
        ctx.quadraticCurveTo(108, 54, 92, 62);
        ctx.closePath();
        ctx.fill();

        // 2. МОЩНАЯ ИЗОГНУТАЯ ЧЕШУЙЧАТАЯ ШЕЯ И ЛЕСНОЙ ВЕНОК ЦВЕТЕНИЯ
        ctx.fillStyle = '#2d5a27';
        ctx.beginPath();
        ctx.moveTo(64, 72);
        ctx.quadraticCurveTo(98, 76, 114, 128);
        ctx.lineTo(36, 128);
        ctx.quadraticCurveTo(46, 96, 56, 82);
        ctx.closePath();
        ctx.fill();

        // Светло-салатовые грудные пластины шеи
        ctx.fillStyle = '#74a844';
        ctx.beginPath();
        ctx.moveTo(52, 86);
        ctx.quadraticCurveTo(44, 106, 42, 128);
        ctx.lineTo(74, 128);
        ctx.quadraticCurveTo(70, 104, 66, 86);
        ctx.closePath();
        ctx.fill();

        // Пышный венок из лесных листьев, лоз и розовых бутонов-цветов на шее (как на арте)
        ctx.fillStyle = '#1e4620';
        ctx.beginPath();
        ctx.ellipse(76, 98, 30, 12, 0.22, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#52b788';
        ctx.beginPath();
        ctx.ellipse(54, 92, 9, 4.5, -0.4, 0, Math.PI * 2);
        ctx.ellipse(76, 98, 10, 5, 0.2, 0, Math.PI * 2);
        ctx.ellipse(98, 104, 9, 4.5, 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Цветущие розовато-персиковые бутоны и ягоды в гриве
        ctx.fillStyle = '#f48fb1';
        ctx.beginPath(); ctx.arc(62, 95, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(88, 101, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffd875';
        ctx.beginPath(); ctx.arc(62, 95, 1.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(88, 101, 1.8, 0, Math.PI * 2); ctx.fill();

        // 3. ВЕРХНЯЯ ЧЕЛЮСТЬ И ЧЕРЕП ВИВЕРНЫ В ПРОФИЛЬ ВЛЕВО
        ctx.fillStyle = '#3a7d34'; // Насыщенная изумрудно-зелёная чешуя
        ctx.beginPath();
        ctx.moveTo(90, 46); // Затылок
        ctx.lineTo(68, 32); // Надбровный гребень
        ctx.lineTo(14, 48); // Вытянутая хищная морда влево
        ctx.lineTo(18, 60); // Передний край верхней губы
        ctx.lineTo(60, 68); // Угол пасти
        ctx.lineTo(88, 70); // Скула
        ctx.closePath();
        ctx.fill();

        // Салатовые чешуйки вдоль гребня носа
        ctx.fillStyle = '#8ac926';
        ctx.beginPath();
        ctx.moveTo(20, 49);
        ctx.lineTo(54, 40);
        ctx.lineTo(50, 45);
        ctx.lineTo(22, 53);
        ctx.closePath();
        ctx.fill();

        // Ноздря на кончике морды
        ctx.fillStyle = '#143312';
        ctx.beginPath(); ctx.arc(21, 50, 2, 0, Math.PI * 2); ctx.fill();

        // 4. ШИРОКО РАСПАХНУТАЯ ПАСТЬ, ЯЗЫК И НИЖНЯЯ ЧЕЛЮСТЬ
        ctx.fillStyle = '#2b0d14'; // Тёмная глубина пасти
        ctx.beginPath();
        ctx.moveTo(18, 59);
        ctx.lineTo(64, 68);
        ctx.lineTo(26, 86);
        ctx.lineTo(22, 79);
        ctx.lineTo(48, 69);
        ctx.closePath();
        ctx.fill();

        // Мясистый алый язык
        ctx.fillStyle = '#c93b4b';
        ctx.beginPath();
        ctx.moveTo(54, 70);
        ctx.quadraticCurveTo(38, 74, 26, 74);
        ctx.quadraticCurveTo(36, 80, 56, 74);
        ctx.closePath();
        ctx.fill();

        // Нижняя челюсть (опущена вниз в рёве)
        ctx.fillStyle = '#559e42';
        ctx.beginPath();
        ctx.moveTo(60, 67);
        ctx.lineTo(22, 80);
        ctx.lineTo(28, 89);
        ctx.lineTo(68, 86);
        ctx.lineTo(88, 70);
        ctx.closePath();
        ctx.fill();

        // 5. ОСТРЫЕ БЕЛЫЕ КЛЫКИ В РАСКРЫТОЙ ПАСТИ
        ctx.fillStyle = '#ffffff';
        // Верхний ряд зубов
        ctx.beginPath(); ctx.moveTo(20, 59); ctx.lineTo(23, 67); ctx.lineTo(26, 60); ctx.fill();
        ctx.beginPath(); ctx.moveTo(29, 61); ctx.lineTo(32, 68); ctx.lineTo(35, 62); ctx.fill();
        ctx.beginPath(); ctx.moveTo(38, 63); ctx.lineTo(41, 69); ctx.lineTo(44, 64); ctx.fill();
        ctx.beginPath(); ctx.moveTo(47, 65); ctx.lineTo(50, 70); ctx.lineTo(53, 66); ctx.fill();

        // Нижний ряд зубов
        ctx.beginPath(); ctx.moveTo(24, 80); ctx.lineTo(27, 73); ctx.lineTo(30, 78); ctx.fill();
        ctx.beginPath(); ctx.moveTo(33, 77); ctx.lineTo(36, 71); ctx.lineTo(39, 75); ctx.fill();
        ctx.beginPath(); ctx.moveTo(42, 74); ctx.lineTo(45, 69); ctx.lineTo(48, 72); ctx.fill();

        // 6. ХИЩНЫЙ ЯНТАРНО-ЗОЛОТОЙ ГЛАЗ ВИВЕРНЫ
        ctx.fillStyle = '#ffd166';
        ctx.beginPath();
        ctx.moveTo(56, 46);
        ctx.lineTo(70, 42);
        ctx.lineTo(65, 51);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#111a0f'; // Вертикальный рептилоидный зрачок
        ctx.fillRect(62, 43.5, 1.5, 6);

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(61, 45.5, 1, 0, Math.PI * 2); ctx.fill();

        // Надбровная дуга
        ctx.strokeStyle = '#1b4318';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(53, 43);
        ctx.lineTo(71, 40);
        ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень снизу)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(22, 80);
        ctx.lineTo(68, 86);
        ctx.lineTo(88, 70);
        ctx.lineTo(114, 128);
        ctx.lineTo(36, 128);
        ctx.lineTo(56, 84);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ТИЛАЦИНА (СУМЧАТОГО ВОЛКА) НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateThylacineAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАДНИЙ ПЛАН: Мощная шея и загривок с фирменными тигровыми полосами
        ctx.fillStyle = '#b8864b'; // Песочно-охристый мех тела
        ctx.beginPath();
        ctx.moveTo(68, 66);
        ctx.quadraticCurveTo(100, 74, 116, 128);
        ctx.lineTo(42, 128);
        ctx.quadraticCurveTo(50, 96, 58, 82);
        ctx.closePath();
        ctx.fill();

        // Характерные тёмно-бурые поперечные полосы тилацина на загривке и спине
        ctx.fillStyle = '#3b2616';
        ctx.beginPath();
        // Полоса 1 (верхняя на шее)
        ctx.moveTo(86, 76); ctx.lineTo(100, 82); ctx.lineTo(96, 89); ctx.lineTo(80, 82);
        // Полоса 2
        ctx.moveTo(82, 92); ctx.lineTo(106, 100); ctx.lineTo(103, 108); ctx.lineTo(76, 99);
        // Полоса 3
        ctx.moveTo(78, 108); ctx.lineTo(112, 118); ctx.lineTo(110, 126); ctx.lineTo(72, 116);
        ctx.closePath();
        ctx.fill();

        // 2. ОКРУГЛЫЕ СТОЯЧИЕ УШИ (Характерная черта тилацина)
        ctx.fillStyle = '#9e6d36';
        // Дальнее ухо
        ctx.beginPath();
        ctx.ellipse(66, 36, 7, 11, -0.25, 0, Math.PI * 2);
        ctx.fill();

        // Ближнее ухо
        ctx.fillStyle = '#c49154';
        ctx.beginPath();
        ctx.ellipse(82, 38, 8.5, 13, 0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#5c3d22'; // Внутренняя тень ушной раковины
        ctx.beginPath();
        ctx.ellipse(81, 39, 4.5, 8, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // 3. ВЫТЯНУТАЯ ВЕРХНЯЯ ЧЕЛЮСТЬ И ЧЕРЕП В ПРОФИЛЬ ВЛЕВО
        ctx.fillStyle = '#cfa063'; // Золотисто-песочный окрас морды
        ctx.beginPath();
        ctx.moveTo(92, 46); // Затылок
        ctx.lineTo(68, 38); // Лоб
        ctx.lineTo(16, 54); // Длинная узкая морда влево
        ctx.lineTo(18, 64); // Верхняя губа
        ctx.lineTo(64, 70); // Глубокий разрез пасти (широко открывается)
        ctx.lineTo(90, 72); // Скула
        ctx.closePath();
        ctx.fill();

        // Светлый кремовый подшерсток на щеке
        ctx.fillStyle = '#e6c28a';
        ctx.beginPath();
        ctx.moveTo(64, 70);
        ctx.lineTo(90, 72);
        ctx.lineTo(84, 54);
        ctx.quadraticCurveTo(66, 58, 64, 70);
        ctx.closePath();
        ctx.fill();

        // Чёрная мочка носа на кончике морды
        ctx.fillStyle = '#1c140e';
        ctx.beginPath();
        ctx.moveTo(16, 54);
        ctx.quadraticCurveTo(13, 57, 17, 61);
        ctx.lineTo(22, 57);
        ctx.closePath();
        ctx.fill();

        // 4. ШИРОКО РАСПАХНУТАЯ ПАСТЬ ТИЛАЦИНА И НИЖНЯЯ ЧЕЛЮСТЬ
        ctx.fillStyle = '#2b0d10'; // Тёмная глубина пасти
        ctx.beginPath();
        ctx.moveTo(18, 63);
        ctx.lineTo(68, 70);
        ctx.lineTo(26, 92);
        ctx.lineTo(22, 85);
        ctx.lineTo(50, 72);
        ctx.closePath();
        ctx.fill();

        // Алый язык внутри пасти
        ctx.fillStyle = '#c0392b';
        ctx.beginPath();
        ctx.moveTo(56, 73);
        ctx.quadraticCurveTo(38, 78, 28, 79);
        ctx.quadraticCurveTo(38, 84, 58, 76);
        ctx.closePath();
        ctx.fill();

        // Нижняя челюсть (широко отведена вниз)
        ctx.fillStyle = '#b8864b';
        ctx.beginPath();
        ctx.moveTo(64, 69);
        ctx.lineTo(22, 86);
        ctx.lineTo(28, 94);
        ctx.lineTo(68, 88);
        ctx.lineTo(90, 72);
        ctx.closePath();
        ctx.fill();

        // 5. ОСТРЫЕ КЛЫКИ И ХИЩНЫЕ ЗУБЫ В РАСКРЫТОЙ ПАСТИ
        ctx.fillStyle = '#ffffff';
        // Верхние клыки и резцы
        ctx.beginPath(); ctx.moveTo(21, 63); ctx.lineTo(24, 71); ctx.lineTo(27, 64); ctx.fill();
        ctx.beginPath(); ctx.moveTo(31, 65); ctx.lineTo(34, 71); ctx.lineTo(37, 66); ctx.fill();
        ctx.beginPath(); ctx.moveTo(41, 66); ctx.lineTo(44, 72); ctx.lineTo(47, 67); ctx.fill();

        // Нижние клыки
        ctx.beginPath(); ctx.moveTo(24, 85); ctx.lineTo(27, 78); ctx.lineTo(30, 83); ctx.fill();
        ctx.beginPath(); ctx.moveTo(34, 81); ctx.lineTo(37, 75); ctx.lineTo(40, 79); ctx.fill();
        ctx.beginPath(); ctx.moveTo(44, 77); ctx.lineTo(47, 72); ctx.lineTo(50, 75); ctx.fill();

        // 6. ХИЩНЫЙ ЯНТАРНЫЙ ГЛАЗ С ТЁМНОЙ ПОДВОДКОЙ
        ctx.fillStyle = '#3b2616';
        ctx.beginPath();
        ctx.ellipse(59, 51, 6, 3.5, -0.15, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.arc(58.5, 51, 2.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#111111';
        ctx.beginPath();
        ctx.arc(58.5, 51, 1.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(57.6, 50.2, 0.8, 0, Math.PI * 2);
        ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень вдоль нижней челюсти и груди)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(22, 86);
        ctx.lineTo(68, 88);
        ctx.lineTo(90, 72);
        ctx.lineTo(116, 128);
        ctx.lineTo(42, 128);
        ctx.lineTo(56, 86);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ИЛЛИТИДА (СВЕЖЕВАТЕЛЯ РАЗУМА) НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateMindFlayerAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ВЫСОКИЙ СТОЯЧИЙ ВОРОТНИК АРКАННОЙ МАНТИИ (Задний план)
        ctx.fillStyle = '#241030';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(24, 68);
        ctx.lineTo(44, 84);
        ctx.lineTo(84, 84);
        ctx.lineTo(104, 68);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        // Багровая подкладка и золотой кант высокого воротника
        ctx.fillStyle = '#5e1938';
        ctx.beginPath();
        ctx.moveTo(27, 74);
        ctx.lineTo(44, 86);
        ctx.lineTo(84, 86);
        ctx.lineTo(101, 74);
        ctx.lineTo(96, 108);
        ctx.lineTo(32, 108);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(24, 68);
        ctx.lineTo(44, 84);
        ctx.moveTo(84, 84);
        ctx.lineTo(104, 68);
        ctx.lineTo(112, 128);
        ctx.stroke();

        // 2. ШЕЯ И ВЫТЯНУТЫЙ ЛУКОВИЦЕОБРАЗНЫЙ ЧЕРЕП ИЛЛИТИДА
        ctx.fillStyle = '#65407d';
        ctx.fillRect(54, 78, 20, 26);

        // Массивный вытянутый череп с узкой нижней частью лица
        ctx.fillStyle = '#7d5296';
        ctx.beginPath();
        ctx.moveTo(40, 48);
        ctx.bezierCurveTo(34, 16, 94, 16, 88, 48); // Широкий купол черепа
        ctx.lineTo(83, 72);
        ctx.lineTo(74, 86);
        ctx.lineTo(54, 86);
        ctx.lineTo(45, 72);
        ctx.closePath();
        ctx.fill();

        // Световая зона на высоком лбу и рельефные псионические вены
        ctx.fillStyle = '#9264ad';
        ctx.beginPath();
        ctx.ellipse(64, 34, 16, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#523069';
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(44, 38); ctx.quadraticCurveTo(49, 44, 46, 52);
        ctx.moveTo(84, 38); ctx.quadraticCurveTo(79, 44, 82, 52);
        ctx.stroke();

        // 3. СВЕТЯЩИЕСЯ БЕЛЁСО-ЛАЗУРНЫЕ ГЛАЗА БЕЗ ЗРАЧКОВ И НАДБРОВНЫЕ ДУГИ
        // Тёмные глазницы
        ctx.fillStyle = '#3b1f4d';
        ctx.beginPath(); ctx.ellipse(52, 56, 6.5, 3.2, 0.18, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(76, 56, 6.5, 3.2, -0.18, 0, Math.PI * 2); ctx.fill();

        // Светящиеся белые глаза иллитида
        ctx.fillStyle = '#e0f7fa';
        ctx.beginPath(); ctx.ellipse(52, 56, 5, 2.2, 0.18, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(76, 56, 5, 2.2, -0.18, 0, Math.PI * 2); ctx.fill();

        // Тяжёлые нахмуренные надбровные складки
        ctx.strokeStyle = '#47265c';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(43, 50); ctx.lineTo(58, 55);
        ctx.moveTo(85, 50); ctx.lineTo(70, 55);
        ctx.stroke();

        // 4. ЧЕТЫРЕ ИЗВИВАЮЩИХСЯ ЛИЦЕВЫХ ЩУПАЛЬЦА (На переднем плане)
        ctx.lineCap = 'round';

        // Внешнее левое щупальце
        ctx.strokeStyle = '#6c4385';
        ctx.lineWidth = 6.5;
        ctx.beginPath();
        ctx.moveTo(54, 78);
        ctx.bezierCurveTo(36, 84, 30, 104, 38, 122);
        ctx.stroke();

        // Внешнее правое щупальце
        ctx.beginPath();
        ctx.moveTo(74, 78);
        ctx.bezierCurveTo(92, 84, 98, 104, 90, 122);
        ctx.stroke();

        // Внутреннее левое щупальце
        ctx.strokeStyle = '#8557a1';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(59, 80);
        ctx.bezierCurveTo(50, 94, 58, 110, 48, 126);
        ctx.stroke();

        // Внутреннее правое щупальце
        ctx.beginPath();
        ctx.moveTo(69, 80);
        ctx.bezierCurveTo(78, 94, 70, 110, 80, 126);
        ctx.stroke();

        // Светлые лиловые присоски вдоль щупалец
        ctx.fillStyle = '#c39bd3';
        [, [36, 108], [88, 94], [92, 108],
            , [52, 114], [74, 98], [76, 114]
        ].forEach(([px, py]) => {
            ctx.beginPath();
            ctx.arc(px, py, 1.5, 0, Math.PI * 2);
            ctx.fill();
        });

        // 5. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 24);
        ctx.bezierCurveTo(44, 24, 38, 36, 40, 48);
        ctx.lineTo(45, 72);
        ctx.lineTo(54, 86);
        ctx.lineTo(64, 86);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.lineTo(24, 68);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ КОТОЛЮДА-МОНАХА (ТАБАКСИ) НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateTabaxiMonkAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. БАМБУКОВЫЙ БОЕВОЙ ШЕСТ БО ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.save();
        ctx.translate(98, 64);
        ctx.rotate((Math.PI / 180) * 26);

        // Ствол бамбукового шеста
        ctx.fillStyle = '#c89d46';
        ctx.strokeStyle = '#5c4212';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.roundRect(-3.5, -62, 7, 132, 3);
        ctx.fill();
        ctx.stroke();

        // Узловые кольца бамбука
        ctx.fillStyle = '#785a14';
        ctx.fillRect(-4, -38, 8, 2.5);
        ctx.fillRect(-4, -8, 8, 2.5);
        ctx.fillRect(-4, 22, 8, 2.5);
        ctx.restore();

        // 2. МОНАШЕСКОЕ ОДЕЯНИЕ И КРУПНЫЕ ДЕРЕВЯННЫЕ ЧЁТКИ
        // Шафранно-оранжевая роба монаха
        ctx.fillStyle = '#d35400';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(36, 96);
        ctx.lineTo(92, 96);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        // Тёмно-багровый воротник-запах робы
        ctx.fillStyle = '#7b241c';
        ctx.beginPath();
        ctx.moveTo(38, 96);
        ctx.lineTo(64, 126);
        ctx.lineTo(90, 96);
        ctx.lineTo(82, 94);
        ctx.lineTo(64, 114);
        ctx.lineTo(46, 94);
        ctx.closePath();
        ctx.fill();

        // Крупные деревянные бусины монашеских чёток на шее
        ctx.fillStyle = '#4a2c18';
        ctx.strokeStyle = '#241409';
        ctx.lineWidth = 1;
        [, [48, 109], [55, 114], [64, 116], [73, 114], [80, 109], [85, 102]
        ].forEach(([bx, by]) => {
            ctx.beginPath();
            ctx.arc(bx, by, 4.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });

        // 3. ЗАОСТРЁННЫЕ КОШАЧЬИ УШИ С КИСТОЧКАМИ
        ctx.fillStyle = '#b87333';
        // Левое ухо
        ctx.beginPath();
        ctx.moveTo(41, 48);
        ctx.lineTo(30, 16);
        ctx.lineTo(56, 38);
        ctx.closePath();
        ctx.fill();

        // Правое ухо
        ctx.beginPath();
        ctx.moveTo(87, 48);
        ctx.lineTo(98, 16);
        ctx.lineTo(72, 38);
        ctx.closePath();
        ctx.fill();

        // Тёмные рысьи кисточки на кончиках ушей и розовая раковина внутри
        ctx.strokeStyle = '#3b2414';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(30, 16); ctx.lineTo(27, 9);
        ctx.moveTo(98, 16); ctx.lineTo(101, 9);
        ctx.stroke();

        ctx.fillStyle = '#e6a89c';
        ctx.beginPath(); ctx.moveTo(42, 45); ctx.lineTo(34, 23); ctx.lineTo(52, 39); ctx.fill();
        ctx.beginPath(); ctx.moveTo(86, 45); ctx.lineTo(94, 23); ctx.lineTo(76, 39); ctx.fill();

        // 4. ГОЛОВА ТАБАКСИ С ПЯТНИСТЫМ ОКРАСОМ И БАКЕНБАРДАМИ
        ctx.fillStyle = '#d98a3c'; // Тёплый золотисто-рыжий мех
        ctx.beginPath();
        ctx.moveTo(42, 42);
        ctx.quadraticCurveTo(64, 32, 86, 42);
        ctx.lineTo(96, 68); // Пушистая левая бакенбарда
        ctx.lineTo(82, 88);
        ctx.lineTo(64, 98);
        ctx.lineTo(46, 88);
        ctx.lineTo(32, 68); // Пушистая правая бакенбарда
        ctx.closePath();
        ctx.fill();

        // Леопардовые пятна-розетки на лбу и щеках
        ctx.fillStyle = '#5c3416';
        ctx.beginPath(); ctx.arc(64, 42, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(54, 45, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 45, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(38, 66, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(90, 66, 2.2, 0, Math.PI * 2); ctx.fill();

        // Светлые кремовые подусники и подбородок
        ctx.fillStyle = '#f5e6cc';
        ctx.beginPath(); ctx.arc(55, 79, 7.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(73, 79, 7.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(52, 85); ctx.lineTo(64, 96); ctx.lineTo(76, 85);
        ctx.closePath();
        ctx.fill();

        // 5. СПОКОЙНЫЙ МУДРЫЙ ВЗГЛЯД ЯНТАРНЫХ ГЛАЗ И ТОНКАЯ ПОЛУУЛЫБКА
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath(); ctx.ellipse(51, 59, 6, 3.6, -0.08, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(77, 59, 6, 3.6, 0.08, 0, Math.PI * 2); ctx.fill();

        // Вертикальные кошачьи зрачки
        ctx.fillStyle = '#111111';
        ctx.beginPath(); ctx.ellipse(51, 59, 1.5, 3.4, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(77, 59, 1.5, 3.4, 0, 0, Math.PI * 2); ctx.fill();

        // Блики
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(52.8, 57.5, 1.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75.2, 57.5, 1.1, 0, Math.PI * 2); ctx.fill();

        // Сосредоточенные надбровные линии
        ctx.strokeStyle = '#4a2c18';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(43, 53); ctx.quadraticCurveTo(51, 51, 57, 54);
        ctx.moveTo(85, 53); ctx.quadraticCurveTo(77, 51, 71, 54);
        ctx.stroke();

        // Кошачий носик и спокойная улыбка мастера
        ctx.fillStyle = '#c96f65';
        ctx.beginPath();
        ctx.moveTo(59, 71); ctx.lineTo(69, 71); ctx.lineTo(64, 76);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#4a2c18';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(64, 76); ctx.lineTo(64, 81);
        ctx.moveTo(56, 81); ctx.quadraticCurveTo(64, 85, 72, 81);
        ctx.stroke();

        // Усы-вибриссы
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(48, 78); ctx.lineTo(18, 75);
        ctx.moveTo(48, 81); ctx.lineTo(20, 86);
        ctx.moveTo(80, 78); ctx.lineTo(110, 75);
        ctx.moveTo(80, 81); ctx.lineTo(108, 86);
        ctx.stroke();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 32);
        ctx.lineTo(42, 42);
        ctx.lineTo(32, 68);
        ctx.lineTo(46, 88);
        ctx.lineTo(64, 98);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.lineTo(36, 96);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },



};

export default InitiativeManager;
