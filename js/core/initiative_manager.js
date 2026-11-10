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
        } else if (avatarType === 'halfling_bard') {
            unit.avatar = this.generateHalflingBardAvatarDataUrl();
        } else if (avatarType === 'mitflit') {
            unit.avatar = this.generateMitflitAvatarDataUrl();
        } else if (avatarType === 'shambling_mound') {
            unit.avatar = this.generateShamblingMoundAvatarDataUrl();
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
                            <option value="wolf" ${unit.avatarType === 'wolf' ? 'selected' : ''}>🐺Волк</option>
                            <option value="raven" ${unit.avatarType === 'raven' ? 'selected' : ''}>🐦Ворона</option>
                            <option value="toad" ${unit.avatarType === 'toad' ? 'selected' : ''}>🐸Жаба</option>
                            <option value="boar" ${unit.avatarType === 'boar' ? 'selected' : ''}>🐗Кабан</option>
                            <option value="spider" ${unit.avatarType === 'spider' ? 'selected' : ''}>🕷️Паук</option>
                            <option value="tick" ${unit.avatarType === 'tick' ? 'selected' : ''}>🦟Клещ</option>
                            <option value="thylacine" ${unit.avatarType === 'thylacine' ? 'selected' : ''}>🐺🐯Тилацин</option>
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
                            <option value="halfling_bard" ${unit.avatarType === 'halfling_bard' ? 'selected' : ''}>🎶🍁Полурослица-Бард</option>
                            <option value="mitflit" ${unit.avatarType === 'mitflit' ? 'selected' : ''}>🗡️👂Митфлит</option>
                            <option value="shambling_mound" ${unit.avatarType === 'shambling_mound' ? 'selected' : ''}>🌿🪵Ходок</option>

                                                        
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
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ СЕРЕБРЯНОГО ЭЛЬФА (РОВНЫЙ ВЗГЛЯД, ВЕНЕЦ И КАФТАН)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateElfAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. СТРУЯЩИЕСЯ СЕРЕБРЯНЫЕ ВОЛОСЫ НА ЗАДНЕМ ПЛАНЕ
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(36, 48);
        ctx.quadraticCurveTo(24, 88, 22, 128);
        ctx.lineTo(106, 128);
        ctx.quadraticCurveTo(104, 88, 92, 48);
        ctx.closePath();
        ctx.fill();

        // Световые серебристо-белые пряди волос по краям
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(38, 52);
        ctx.quadraticCurveTo(28, 88, 28, 128);
        ctx.lineTo(44, 128);
        ctx.lineTo(46, 56);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(90, 52);
        ctx.quadraticCurveTo(100, 88, 100, 128);
        ctx.lineTo(84, 128);
        ctx.lineTo(82, 56);
        ctx.closePath();
        ctx.fill();

        // 2. ИЗЫСКАННЫЙ ЭЛЬФИЙСКИЙ КАФТАН С ВЫСОКИМ ВОРОТНИКОМ
        ctx.fillStyle = '#1e3a8a';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(34, 96);
        ctx.lineTo(94, 96);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        // Высокий стоячий воротник с серебряной и золотой отделкой
        ctx.fillStyle = '#172554';
        ctx.beginPath();
        ctx.moveTo(34, 96);
        ctx.lineTo(42, 86);
        ctx.lineTo(56, 98);
        ctx.lineTo(72, 98);
        ctx.lineTo(86, 86);
        ctx.lineTo(94, 96);
        ctx.lineTo(88, 114);
        ctx.lineTo(40, 114);
        ctx.closePath();
        ctx.fill();

        // Золотая вышивка по краю воротника и груди
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(35, 96);
        ctx.lineTo(42, 86);
        ctx.lineTo(64, 122);
        ctx.lineTo(86, 86);
        ctx.lineTo(93, 96);
        ctx.stroke();

        // Сапфировая брошь-звезда на груди
        ctx.fillStyle = '#38bdf8';
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(64, 108);
        ctx.lineTo(68, 114);
        ctx.lineTo(64, 120);
        ctx.lineTo(60, 114);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 3. ДЛИННЫЕ ЗАОСТРЁННЫЕ ЭЛЬФИЙСКИЕ УШИ (Симметричные)
        ctx.fillStyle = '#e2c2ad';
        ctx.beginPath(); ctx.moveTo(43, 60); ctx.lineTo(20, 44); ctx.lineTo(42, 70); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(85, 60); ctx.lineTo(108, 44); ctx.lineTo(86, 70); ctx.closePath(); ctx.fill();

        // 4. ШЕЯ И УТОНЧЁННОЕ АРИСТОКРАТИЧНОЕ ЛИЦО
        ctx.fillStyle = '#dfb9a2';
        ctx.fillRect(55, 84, 18, 18);

        ctx.fillStyle = '#f5dfd0';
        ctx.beginPath();
        ctx.moveTo(45, 48);
        ctx.quadraticCurveTo(64, 34, 83, 48);
        ctx.lineTo(81, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(47, 78);
        ctx.closePath();
        ctx.fill();

        // 5. СЕРЕБРЯНЫЕ ВОЛОСЫ НА МАКУШКЕ И ТОНКАЯ ДИАДЕМА С САПФИРОМ
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(42, 54);
        ctx.quadraticCurveTo(42, 22, 64, 20);
        ctx.quadraticCurveTo(86, 22, 86, 54);
        ctx.lineTo(82, 46);
        ctx.quadraticCurveTo(64, 34, 46, 46);
        ctx.closePath();
        ctx.fill();

        // Тонкий серебряно-золотой венец на лбу
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(44, 45);
        ctx.quadraticCurveTo(64, 49, 84, 45);
        ctx.stroke();

        // Огранённый синий сапфир в центре диадемы
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.moveTo(64, 42);
        ctx.lineTo(67, 46.5);
        ctx.lineTo(64, 51);
        ctx.lineTo(61, 46.5);
        ctx.closePath();
        ctx.fill();

        // 6. РОВНЫЕ, ЯСНЫЕ И ГОРДЫЕ ГЛАЗА (Без раскосости и печали)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(54, 60, 4.8, 2.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 60, 4.8, 2.2, 0, 0, Math.PI * 2); ctx.fill();

        // Сияющая сапфирово-лазурная радужка
        ctx.fillStyle = '#0ea5e9';
        ctx.beginPath(); ctx.arc(54, 60, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 60, 2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0c4a6e';
        ctx.beginPath(); ctx.arc(54, 60, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 60, 1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(54.8, 59.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74.8, 59.2, 0.7, 0, Math.PI * 2); ctx.fill();

        // Ровные благородные брови (лёгкий уверенный подъём к вискам)
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(48, 55); ctx.quadraticCurveTo(54, 53.5, 59, 55);
        ctx.moveTo(69, 55); ctx.quadraticCurveTo(74, 53.5, 80, 55);
        ctx.stroke();

        // Тонкий прямой нос и спокойная уверенная полуулыбка
        ctx.strokeStyle = '#c9a189';
        ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(64, 57); ctx.lineTo(62.5, 72); ctx.lineTo(65.5, 72); ctx.stroke();

        ctx.strokeStyle = '#b06d66';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(58, 81);
        ctx.quadraticCurveTo(64, 83, 70, 81);
        ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 20);
        ctx.quadraticCurveTo(42, 22, 42, 54);
        ctx.lineTo(47, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.lineTo(36, 48);
        ctx.closePath();
        ctx.fill();

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
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ГОБЛИНА (РОВНЫЙ ХИТРЫЙ ВЗГЛЯД, РЖАВЫЙ ШЛЕМ И ТЕСАК)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateGoblinAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. РЖАВЫЙ ЗАЗУБРЕННЫЙ ТЕСАК ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.save();
        ctx.translate(102, 54);
        ctx.rotate((Math.PI / 180) * 26);

        // Широкий грубый клинок гоблинского ятагана
        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-5, 36);
        ctx.lineTo(-6, -24);
        ctx.quadraticCurveTo(-2, -38, 7, -42); // Загнутое остриё
        ctx.lineTo(6, 36);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Пятно ржавчины и зазубрина на клинке
        ctx.fillStyle = '#854d27';
        ctx.beginPath(); ctx.arc(0, -10, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(3, -30, 2.5, 64);
        ctx.restore();

        // 2. ДЛИННЫЕ ЗАОСТРЁННЫЕ УШИ ГОБЛИНА С ЗАЗУБРИНОЙ И СЕРЬГОЙ
        // Левое ухо
        ctx.fillStyle = '#4d7c36';
        ctx.beginPath();
        ctx.moveTo(41, 62);
        ctx.lineTo(6, 54);
        ctx.lineTo(14, 64);
        ctx.lineTo(10, 68);
        ctx.lineTo(42, 82);
        ctx.closePath();
        ctx.fill();

        // Правое ухо
        ctx.beginPath();
        ctx.moveTo(87, 62);
        ctx.lineTo(122, 54);
        ctx.lineTo(86, 82);
        ctx.closePath();
        ctx.fill();

        // Внутренняя желтовато-розовая ушная раковина
        ctx.fillStyle = '#a39865';
        ctx.beginPath(); ctx.moveTo(39, 66); ctx.lineTo(14, 60); ctx.lineTo(40, 77); ctx.fill();
        ctx.beginPath(); ctx.moveTo(89, 66); ctx.lineTo(114, 60); ctx.lineTo(88, 77); ctx.fill();

        // Золотая серьга-кольцо в левом ухе
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(14, 73, 3.8, 0, Math.PI * 2);
        ctx.stroke();

        // 3. ШЕЯ И РВАНЫЕ КОЖАНЫЕ ОБНОСКИ МАРОДЁРА
        ctx.fillStyle = '#4d7c36';
        ctx.fillRect(54, 88, 20, 22);

        ctx.fillStyle = '#3b2416';
        ctx.beginPath();
        ctx.moveTo(18, 128);
        ctx.lineTo(36, 100);
        ctx.lineTo(92, 100);
        ctx.lineTo(110, 128);
        ctx.closePath();
        ctx.fill();

        // Рваный шейный платок и железная пряжка
        ctx.fillStyle = '#6e1919';
        ctx.beginPath();
        ctx.moveTo(42, 98);
        ctx.quadraticCurveTo(64, 112, 86, 98);
        ctx.lineTo(82, 110);
        ctx.quadraticCurveTo(64, 120, 46, 110);
        ctx.closePath();
        ctx.fill();

        // 4. ШИРОКОЕ СКУЛАСТОЕ ЛИЦО ГОБЛИНА С ОСТРЫМ ПОДБОРОДКОМ
        ctx.fillStyle = '#659e47';
        ctx.beginPath();
        ctx.moveTo(40, 54);
        ctx.lineTo(88, 54);
        ctx.lineTo(92, 78);
        ctx.lineTo(64, 104);
        ctx.lineTo(36, 78);
        ctx.closePath();
        ctx.fill();

        // Светлая зона на скулах и переносице (flat-объём)
        ctx.fillStyle = '#78b556';
        ctx.beginPath();
        ctx.moveTo(45, 66);
        ctx.lineTo(83, 66);
        ctx.lineTo(80, 84);
        ctx.lineTo(64, 98);
        ctx.lineTo(48, 84);
        ctx.closePath();
        ctx.fill();

        // 5. РОВНЫЕ, КРУПНЫЕ И ХИТРЫЕ ЖЁЛТЫЕ ГЛАЗА (Без раскосости)
        // Тёмные круги-впадины вокруг глаз
        ctx.fillStyle = '#365924';
        ctx.beginPath(); ctx.ellipse(50, 68, 7.5, 4.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(78, 68, 7.5, 4.2, 0, 0, Math.PI * 2); ctx.fill();

        // Яркие янтарно-жёлтые глаза строго на одной горизонтальной линии
        ctx.fillStyle = '#facc15';
        ctx.beginPath(); ctx.ellipse(50, 68, 6, 3.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(78, 68, 6, 3.2, 0, 0, Math.PI * 2); ctx.fill();

        // Вертикальные хитрые зрачки и блики
        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.ellipse(50, 68, 1.4, 2.8, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(78, 68, 1.4, 2.8, 0, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(51.5, 67, 0.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76.5, 67, 0.9, 0, Math.PI * 2); ctx.fill();

        // 6. ДЛИННЫЙ НОС КРЮЧКОМ И ЕХИДНАЯ ЗУБАСТАЯ УХМЫЛКА
        ctx.fillStyle = '#4d7c36';
        ctx.beginPath();
        ctx.moveTo(60, 66);
        ctx.lineTo(68, 66);
        ctx.lineTo(66, 83);
        ctx.quadraticCurveTo(62, 85, 59, 81);
        ctx.closePath();
        ctx.fill();

        // Широкая ехидная ухмылка
        ctx.fillStyle = '#1f3314';
        ctx.beginPath();
        ctx.moveTo(45, 86);
        ctx.quadraticCurveTo(64, 94, 83, 86);
        ctx.quadraticCurveTo(64, 98, 45, 86);
        ctx.closePath();
        ctx.fill();

        // Острые мелкие зубы
        ctx.fillStyle = '#fef9c3';
        [50, 56, 62, 68, 74].forEach(zx => {
            ctx.beginPath();
            ctx.moveTo(zx, 88);
            ctx.lineTo(zx + 2, 92.5);
            ctx.lineTo(zx + 4, 88.5);
            ctx.closePath();
            ctx.fill();
        });

        // 7. ПОМЯТЫЙ РЖАВЫЙ ШЛЕМ МАРОДЁРА С НАНОСНИКОМ И ЗАКЛЁПКАМИ
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(36, 54);
        ctx.quadraticCurveTo(42, 22, 64, 18);
        ctx.quadraticCurveTo(86, 22, 92, 54);
        ctx.lineTo(88, 60);
        ctx.lineTo(64, 57);
        ctx.lineTo(40, 60);
        ctx.closePath();
        ctx.fill();

        // Пятно ржавчины и вмятина на шлеме
        ctx.fillStyle = '#854d27';
        ctx.beginPath(); ctx.ellipse(49, 38, 6, 4, -0.3, 0, Math.PI * 2); ctx.fill();

        // Стальной обод и короткий наносник над бровями
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.moveTo(37, 52);
        ctx.lineTo(64, 50);
        ctx.lineTo(91, 52);
        ctx.lineTo(90, 58);
        ctx.lineTo(64, 56);
        ctx.lineTo(38, 58);
        ctx.closePath();
        ctx.fill();

        ctx.fillRect(62, 55, 4, 9);

        // Заклёпки по краю шлема
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath(); ctx.arc(43, 55, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(54, 54, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 54, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(85, 55, 1.3, 0, Math.PI * 2); ctx.fill();

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 18);
        ctx.quadraticCurveTo(42, 22, 36, 54);
        ctx.lineTo(36, 78);
        ctx.lineTo(64, 104);
        ctx.lineTo(64, 128);
        ctx.lineTo(18, 128);
        ctx.lineTo(36, 100);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },





    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ВОЛКА НА CANVAS (ДЕТАЛИЗИРОВАННЫЙ ХИЩНИК В ПОЛУОБОРОТ)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateWolfAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАДНИЙ ПЛАН: Мощная пушистая холка и грива на шее
        ctx.fillStyle = '#2d3748';
        ctx.beginPath();
        ctx.moveTo(64, 56);
        ctx.quadraticCurveTo(106, 68, 122, 128);
        ctx.lineTo(38, 128);
        ctx.quadraticCurveTo(46, 94, 54, 80);
        ctx.closePath();
        ctx.fill();

        // Взъерошенные клочья меха на загривке
        ctx.fillStyle = '#1a202c';
        ctx.beginPath();
        ctx.moveTo(86, 66); ctx.lineTo(102, 58); ctx.lineTo(96, 74);
        ctx.moveTo(98, 84); ctx.lineTo(116, 80); ctx.lineTo(106, 96);
        ctx.closePath();
        ctx.fill();

        // 2. ОСТРЫЕ СТОЯЧИЕ ВОЛЧЬИ УШИ (Дальнее и ближнее в перспективе)
        // Дальнее левое ухо
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(62, 42);
        ctx.lineTo(54, 14);
        ctx.lineTo(74, 36);
        ctx.closePath();
        ctx.fill();

        // Ближнее правое ухо
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(78, 44);
        ctx.lineTo(94, 14);
        ctx.lineTo(94, 52);
        ctx.closePath();
        ctx.fill();

        // Внутренняя тёмная раковина ближнего уха
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(81, 43);
        ctx.lineTo(91, 21);
        ctx.lineTo(91, 48);
        ctx.closePath();
        ctx.fill();

        // 3. ВЕРХНЯЯ ЧЕЛЮСТЬ И ЧЕРЕП ВОЛКА (Вытянутый хищный силуэт влево)
        ctx.fillStyle = '#4a5568';
        ctx.beginPath();
        ctx.moveTo(92, 48); // Затылок
        ctx.lineTo(68, 36); // Лоб
        ctx.lineTo(18, 60); // Кончик морды влево
        ctx.lineTo(22, 72); // Верхняя губа
        ctx.lineTo(58, 78); // Угол пасти
        ctx.lineTo(90, 78); // Скула
        ctx.closePath();
        ctx.fill();

        // Тёмная волчья «маска» вдоль спинки носа и лба
        ctx.fillStyle = '#2d3748';
        ctx.beginPath();
        ctx.moveTo(22, 58);
        ctx.lineTo(66, 38);
        ctx.lineTo(72, 45);
        ctx.lineTo(26, 63);
        ctx.closePath();
        ctx.fill();

        // Светлый пепельно-серебристый подшёрсток на щеке и шее
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(56, 84);
        ctx.lineTo(90, 78);
        ctx.quadraticCurveTo(96, 104, 88, 128);
        ctx.lineTo(44, 128);
        ctx.quadraticCurveTo(48, 100, 56, 84);
        ctx.closePath();
        ctx.fill();

        // Пушистые бакенбарды по краю щеки
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.moveTo(86, 62);
        ctx.lineTo(100, 68);
        ctx.lineTo(92, 75);
        ctx.lineTo(102, 82);
        ctx.lineTo(86, 86);
        ctx.closePath();
        ctx.fill();

        // 4. ЧЁРНАЯ МОЧКА НОСА И МОРЩИНЫ ОСКАЛА НА ПЕРЕНОСИЦЕ
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(18, 60);
        ctx.quadraticCurveTo(14, 64, 19, 68);
        ctx.lineTo(24, 63);
        ctx.closePath();
        ctx.fill();

        // Складки яростного рычания
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(33, 57); ctx.lineTo(36, 63);
        ctx.moveTo(39, 55); ctx.lineTo(42, 61);
        ctx.stroke();

        // 5. ОСКАЛЕННАЯ ПАСТЬ, ЯЗЫК И ОСТРЫЕ БЕЛЫЕ КЛЫКИ
        ctx.fillStyle = '#1e0b0e';
        ctx.beginPath();
        ctx.moveTo(22, 71);
        ctx.lineTo(60, 78);
        ctx.lineTo(30, 91);
        ctx.lineTo(25, 84);
        ctx.lineTo(48, 77);
        ctx.closePath();
        ctx.fill();

        // Нижняя челюсть
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(58, 77);
        ctx.lineTo(25, 85);
        ctx.lineTo(31, 93);
        ctx.lineTo(64, 90);
        ctx.lineTo(90, 78);
        ctx.closePath();
        ctx.fill();

        // Белоснежные клыки и мелкие резцы
        ctx.fillStyle = '#ffffff';
        // Верхний длинный клык
        ctx.beginPath(); ctx.moveTo(25, 71); ctx.lineTo(28, 79); ctx.lineTo(31, 72); ctx.fill();
        // Задние верхние зубы
        ctx.beginPath(); ctx.moveTo(36, 73); ctx.lineTo(39, 78); ctx.lineTo(42, 74); ctx.fill();
        ctx.beginPath(); ctx.moveTo(45, 75); ctx.lineTo(48, 79); ctx.lineTo(51, 76); ctx.fill();
        // Нижний длинный клык
        ctx.beginPath(); ctx.moveTo(29, 85); ctx.lineTo(32, 78); ctx.lineTo(35, 84); ctx.fill();
        ctx.beginPath(); ctx.moveTo(38, 82); ctx.lineTo(41, 77); ctx.lineTo(44, 81); ctx.fill();

        // 6. ПРОНЗИТЕЛЬНЫЙ ЯНТАРНЫЙ ГЛАЗ ХИЩНИКА
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(55, 51);
        ctx.lineTo(69, 46);
        ctx.lineTo(65, 56);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(61.5, 51, 1.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(60.5, 50, 0.8, 0, Math.PI * 2);
        ctx.fill();

        // Грозная надбровная складка
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(52, 48);
        ctx.lineTo(69, 44);
        ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень вдоль нижней челюсти и загривка)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(25, 85);
        ctx.lineTo(64, 90);
        ctx.lineTo(90, 78);
        ctx.lineTo(122, 128);
        ctx.lineTo(38, 128);
        ctx.lineTo(54, 86);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ГИГАНТСКОГО ПАУКА (ДЕТАЛИЗИРОВАННЫЙ ХИЩНИК ПОДЗЕМЬЯ)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateSpiderAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. МАССИВНОЕ БРЮШКО С БАГРОВЫМ УЗОРОМ «ПЕСОЧНЫХ ЧАСОВ» (Задний план сверху)
        ctx.fillStyle = '#141821';
        ctx.beginPath();
        ctx.ellipse(64, 38, 28, 22, 0, 0, Math.PI * 2);
        ctx.fill();

        // Световой контур на правой половине брюшка
        ctx.fillStyle = '#1f2633';
        ctx.beginPath();
        ctx.ellipse(68, 38, 22, 18, 0, -Math.PI * 0.5, Math.PI * 0.5);
        ctx.fill();

        // Алый знак «песочных часов» на спине паука
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.moveTo(57, 25);
        ctx.lineTo(71, 25);
        ctx.lineTo(64, 34);
        ctx.lineTo(71, 43);
        ctx.lineTo(57, 43);
        ctx.lineTo(64, 34);
        ctx.closePath();
        ctx.fill();

        // 2. ВОСЕМЬ ТОЛСТЫХ СУСТАВЧАТЫХ ХИТИНОВЫХ ЛАП
        const drawSpiderLeg = (x1, y1, x2, y2, x3, y3, isRight) => {
            // Основной толстый сегмент бедра и голени
            ctx.strokeStyle = isRight ? '#262f3d' : '#181e29';
            ctx.lineWidth = 6.5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.stroke();

            // Тонкая лапка-коготок на конце
            ctx.strokeStyle = isRight ? '#3b485c' : '#262f3d';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.stroke();

            // Суставчатое утолщение на сгибе лапы
            ctx.fillStyle = isRight ? '#3b485c' : '#262f3d';
            ctx.beginPath();
            ctx.arc(x2, y2, 3.6, 0, Math.PI * 2);
            ctx.fill();
        };

        // Левые 4 лапы
        drawSpiderLeg(44, 52, 16, 26, 6, 56, false);
        drawSpiderLeg(40, 62, 10, 50, 4, 86, false);
        drawSpiderLeg(40, 74, 12, 78, 12, 114, false);
        drawSpiderLeg(45, 84, 22, 98, 26, 126, false);

        // Правые 4 лапы
        drawSpiderLeg(84, 52, 112, 26, 122, 56, true);
        drawSpiderLeg(88, 62, 118, 50, 124, 86, true);
        drawSpiderLeg(88, 74, 116, 78, 116, 114, true);
        drawSpiderLeg(83, 84, 106, 98, 102, 126, true);

        // 3. РЕЛЬЕФНАЯ ГОЛОВОГРУДЬ ПАУКА (На переднем плане по центру)
        ctx.fillStyle = '#1e2430';
        ctx.beginPath();
        ctx.moveTo(44, 52);
        ctx.quadraticCurveTo(64, 42, 84, 52);
        ctx.lineTo(88, 78);
        ctx.lineTo(74, 92);
        ctx.lineTo(54, 92);
        ctx.lineTo(40, 78);
        ctx.closePath();
        ctx.fill();

        // Хитиновый гребень и световой блик на панцире головогруди
        ctx.fillStyle = '#2c3547';
        ctx.beginPath();
        ctx.moveTo(52, 48);
        ctx.quadraticCurveTo(64, 44, 76, 48);
        ctx.lineTo(72, 64);
        ctx.lineTo(56, 64);
        ctx.closePath();
        ctx.fill();

        // 4. ГРОЗДЬ ИЗ 8 СВЕТЯЩИХСЯ ИЗУМРУДНЫХ ГЛАЗ С БЛИКАМИ
        // Тёмная надбровная маска вокруг глаз
        ctx.fillStyle = '#0d1017';
        ctx.beginPath();
        ctx.roundRect(44, 62, 40, 18, 7);
        ctx.fill();

        // Два крупных главных центральных глаза
        ctx.fillStyle = '#10b981';
        ctx.beginPath(); ctx.arc(57, 71, 4.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(71, 71, 4.8, 0, Math.PI * 2); ctx.fill();

        // Боковая пара средних глаз
        ctx.fillStyle = '#34d399';
        ctx.beginPath(); ctx.arc(48, 69, 2.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(80, 69, 2.6, 0, Math.PI * 2); ctx.fill();

        // Верхний ряд из 4 малых глаз
        ctx.beginPath(); ctx.arc(53, 64.5, 1.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(60, 64, 1.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(68, 64, 1.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 64.5, 1.6, 0, Math.PI * 2); ctx.fill();

        // Живые белые блики в главных глазах
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(58.5, 69.5, 1.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(69.5, 69.5, 1.4, 0, Math.PI * 2); ctx.fill();

        // 5. ПЕДИПАЛЬПЫ, МОЩНЫЕ ХЕЛИЦЕРЫ И КАПЛИ ЯДА
        // Короткие щупальца-педипальпы по бокам от челюстей
        ctx.strokeStyle = '#262f3d';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(45, 84); ctx.lineTo(36, 98); ctx.lineTo(42, 112); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(83, 84); ctx.lineTo(92, 98); ctx.lineTo(86, 112); ctx.stroke();

        // Хитиновые основания жвал (хелицер)
        ctx.fillStyle = '#12161f';
        ctx.beginPath(); ctx.moveTo(50, 86); ctx.lineTo(61, 104); ctx.lineTo(52, 106); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(78, 86); ctx.lineTo(67, 104); ctx.lineTo(76, 106); ctx.closePath(); ctx.fill();

        // Острые ядовитые клыки
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath(); ctx.moveTo(53, 102); ctx.quadraticCurveTo(58, 114, 61, 116); ctx.lineTo(60, 102); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(75, 102); ctx.quadraticCurveTo(70, 114, 67, 116); ctx.lineTo(68, 102); ctx.closePath(); ctx.fill();

        // Ядовитые изумрудные капли, стекающие с кончиков клыков
        ctx.fillStyle = '#10b981';
        ctx.beginPath(); ctx.arc(60.5, 120, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(67.5, 122, 1.7, 0, Math.PI * 2); ctx.fill();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.moveTo(64, 16);
        ctx.lineTo(16, 26);
        ctx.lineTo(4, 86);
        ctx.lineTo(26, 126);
        ctx.lineTo(64, 116);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ РАЗБОЙНИКА (РОВНЫЙ ВЗГЛЯД, КАПЮШОН, ПОВЯЗКА И КИНЖАЛ)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateRogueAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ГЛУБОКИЙ ПОТРЁПАННЫЙ КАПЮШОН РАЗБОЙНИКА (Задний контур)
        ctx.fillStyle = '#261a12';
        ctx.beginPath();
        ctx.moveTo(32, 66);
        ctx.quadraticCurveTo(36, 22, 64, 18);
        ctx.quadraticCurveTo(92, 22, 96, 66);
        ctx.lineTo(90, 96);
        ctx.lineTo(38, 96);
        ctx.closePath();
        ctx.fill();

        // 2. КОЖАНАЯ БРОНЯ И ШЕЙНЫЙ ПЛАТОК НА ПЛЕЧАХ
        ctx.fillStyle = '#3b2618';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(34, 98);
        ctx.lineTo(94, 98);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        // Тёмный разбойничий платок-шарф на шее со складками
        ctx.fillStyle = '#4a1c1c';
        ctx.beginPath();
        ctx.moveTo(38, 96);
        ctx.quadraticCurveTo(64, 112, 90, 96);
        ctx.lineTo(86, 110);
        ctx.quadraticCurveTo(64, 122, 42, 110);
        ctx.closePath();
        ctx.fill();

        // Стальные заклёпки на кожаной броне
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath(); ctx.arc(40, 116, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(88, 116, 2, 0, Math.PI * 2); ctx.fill();

        // 3. ОБВЕТРЕННОЕ ЛИЦО СО ЩЕТИНОЙ И ШРАМОМ
        ctx.fillStyle = '#cf9778';
        ctx.beginPath();
        ctx.moveTo(43, 50);
        ctx.lineTo(85, 50);
        ctx.lineTo(84, 82);
        ctx.lineTo(64, 100);
        ctx.lineTo(44, 82);
        ctx.closePath();
        ctx.fill();

        // Густая тёмная щетина на подбородке и челюсти
        ctx.fillStyle = 'rgba(30, 22, 18, 0.28)';
        ctx.beginPath();
        ctx.moveTo(44, 76);
        ctx.lineTo(64, 100);
        ctx.lineTo(84, 76);
        ctx.lineTo(83, 83);
        ctx.lineTo(64, 100);
        ctx.lineTo(45, 83);
        ctx.closePath();
        ctx.fill();

        // Небрежные тёмные пряди волос, выбивающиеся из-под капюшона
        ctx.fillStyle = '#1f1611';
        ctx.beginPath();
        ctx.moveTo(43, 48); ctx.lineTo(48, 57); ctx.lineTo(54, 49);
        ctx.moveTo(74, 49); ctx.lineTo(80, 56); ctx.lineTo(85, 48);
        ctx.fill();

        // 4. РОВНЫЙ ХИТРЫЙ ВЗГЛЯД И ПИРАТСКАЯ ПОВЯЗКА НА ЛЕВОМ ГЛАЗУ
        // Ремешок повязки (аккуратно уходит под края капюшона)
        ctx.strokeStyle = '#140f0c';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(41, 61);
        ctx.lineTo(86, 54);
        ctx.stroke();

        // Чёрная кожаная повязка на левом глазу (строго по оси глаза)
        ctx.fillStyle = '#140f0c';
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(53, 62, 6.5, 4.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Правый глаз — ровный, сфокусированный и прищуренный
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(75, 62, 4.8, 2.1, 0, 0, Math.PI * 2);
        ctx.fill();

        // Янтарно-карий зрачок и блик
        ctx.fillStyle = '#854d27';
        ctx.beginPath(); ctx.arc(74.5, 62, 1.9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(74.5, 62, 0.9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(75.3, 61.2, 0.65, 0, Math.PI * 2); ctx.fill();

        // Нахмуренная правая бровь и косой боевой шрам
        ctx.strokeStyle = '#1f1611';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(69, 57.5); ctx.lineTo(81, 56.5);
        ctx.stroke();

        ctx.strokeStyle = '#8f2d2d';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(71, 53);
        ctx.lineTo(77, 72);
        ctx.stroke();

        // 5. ПЕРЕДНИЙ КРАЙ КАПЮШОНА СО СКЛАДКАМИ
        ctx.fillStyle = '#362418';
        ctx.beginPath();
        ctx.moveTo(35, 58);
        ctx.quadraticCurveTo(44, 22, 64, 18);
        ctx.quadraticCurveTo(84, 22, 93, 58);
        ctx.lineTo(86, 54);
        ctx.quadraticCurveTo(64, 44, 42, 54);
        ctx.closePath();
        ctx.fill();

        // Световая складка по краю капюшона
        ctx.strokeStyle = '#523826';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(39, 55);
        ctx.quadraticCurveTo(64, 43, 89, 55);
        ctx.stroke();

        // 6. ХИЩНЫЙ НОС С ГОРБИНКОЙ И ЕХИДНАЯ УХМЫЛКА
        ctx.fillStyle = '#b87d5e';
        ctx.beginPath();
        ctx.moveTo(64, 60);
        ctx.lineTo(68, 74);
        ctx.quadraticCurveTo(64, 77, 61, 74);
        ctx.closePath();
        ctx.fill();

        // Самодовольная ухмылка набок
        ctx.strokeStyle = '#261a12';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(54, 85);
        ctx.quadraticCurveTo(65, 89, 75, 83);
        ctx.stroke();

        // 7. ОСТРЫЙ СТАЛЬНОЙ КИНЖАЛ НА ПЕРЕДНЕМ ПЛАНЕ (Слева внизу по диагонали)
        ctx.save();
        ctx.translate(28, 106);
        ctx.rotate((Math.PI / 180) * -28);

        // Стальное клиновидное лезвие с кровостоком
        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-4.5, 0);
        ctx.lineTo(-3.5, -28);
        ctx.lineTo(0, -38); // Острый кончик кинжала
        ctx.lineTo(3.5, -28);
        ctx.lineTo(4.5, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Светлая заточенная грань клинка
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(0, -38);
        ctx.lineTo(3.5, -28);
        ctx.lineTo(4.5, 0);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();

        // Тёмный кровосток по центру
        ctx.fillStyle = '#334155';
        ctx.fillRect(-0.8, -24, 1.6, 20);

        // Кованая бронзовая гарда-перекрестие
        ctx.fillStyle = '#b8860b';
        ctx.strokeStyle = '#4a3219';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(-10, -2, 20, 4, 1.5);
        ctx.fill();
        ctx.stroke();

        // Обтянутая чёрной кожей рукоять и навершие
        ctx.fillStyle = '#1e1611';
        ctx.fillRect(-2.5, 2, 5, 13);

        ctx.fillStyle = '#b8860b';
        ctx.beginPath();
        ctx.arc(0, 17, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 18);
        ctx.quadraticCurveTo(44, 22, 35, 58);
        ctx.lineTo(44, 82);
        ctx.lineTo(64, 100);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.lineTo(34, 98);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },












    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ПАЛАДИНА (ДЕТАЛИЗИРОВАННЫЙ РЫЦАРЬ СВЕТА С МЕЧОМ И ЩИТОМ)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generatePaladinAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. СИЯЮЩИЙ ДВУРУЧНЫЙ МЕЧ ПАЛАДИНА ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.save();
        ctx.translate(100, 56);
        ctx.rotate((Math.PI / 180) * 24);

        // Ореол святого золотисто-лазурного сияния вокруг клинка
        ctx.fillStyle = 'rgba(255, 216, 117, 0.25)';
        ctx.beginPath();
        ctx.ellipse(0, -18, 12, 36, 0, 0, Math.PI * 2);
        ctx.fill();

        // Широкий стальной клинок меча
        ctx.fillStyle = '#94a3b8';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-4.5, 26);
        ctx.lineTo(-4.5, -42);
        ctx.lineTo(0, -54);
        ctx.lineTo(4.5, -42);
        ctx.lineTo(4.5, 26);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Светлая полированная грань и золотой дол по центру
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(0, -54);
        ctx.lineTo(4.5, -42);
        ctx.lineTo(4.5, 26);
        ctx.lineTo(0, 26);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffd875';
        ctx.fillRect(-1, -38, 2, 58);

        // Золотая крылатая гарда меча
        ctx.fillStyle = '#ffd875';
        ctx.strokeStyle = '#8a6421';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(-14, 22);
        ctx.quadraticCurveTo(0, 29, 14, 22);
        ctx.lineTo(12, 27);
        ctx.quadraticCurveTo(0, 33, -12, 27);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 2. БЕЛОСНЕЖНЫЙ ПЛАЩ И ТЯЖЁЛЫЕ ЛАТНЫЕ ДОСПЕХИ
        // Плечи рыцарского плаща
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.lineTo(30, 94);
        ctx.lineTo(98, 94);
        ctx.lineTo(114, 128);
        ctx.closePath();
        ctx.fill();

        // Полированный стальной нагрудник
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.moveTo(22, 128);
        ctx.lineTo(38, 96);
        ctx.lineTo(90, 96);
        ctx.lineTo(106, 128);
        ctx.closePath();
        ctx.fill();

        // Рельефные наплечники с золотой окантовкой
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(16, 126);
        ctx.quadraticCurveTo(22, 94, 46, 98);
        ctx.lineTo(40, 128);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(112, 126);
        ctx.quadraticCurveTo(106, 94, 82, 98);
        ctx.lineTo(88, 128);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Золотой нагрудный символ солнца по центру кирасы
        ctx.fillStyle = '#ffd875';
        ctx.beginPath(); ctx.arc(64, 114, 7, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(64, 114, 2.8, 0, Math.PI * 2); ctx.fill();

        // 3. ШЕЯ, УШИ И ВОЛЕВОЕ ЛИЦО ПАЛАДИНА
        ctx.fillStyle = '#e0ad8e';
        ctx.fillRect(55, 86, 18, 16);

        ctx.fillStyle = '#f8ceb4';
        ctx.beginPath();
        ctx.moveTo(44, 48);
        ctx.lineTo(84, 48);
        ctx.lineTo(83, 80);
        ctx.lineTo(64, 98);
        ctx.lineTo(45, 80);
        ctx.closePath();
        ctx.fill();

        // Лёгкая благородная щетина на подбородке и скулах
        ctx.fillStyle = 'rgba(120, 82, 56, 0.22)';
        ctx.beginPath();
        ctx.moveTo(45, 74);
        ctx.lineTo(64, 98);
        ctx.lineTo(83, 74);
        ctx.lineTo(82, 81);
        ctx.lineTo(64, 98);
        ctx.lineTo(46, 81);
        ctx.closePath();
        ctx.fill();

        // 4. УЛОЖЕННЫЕ ЗОЛОТИСТО-РУСЫЕ ВОЛОСЫ И ЗОЛОТОЙ ВЕНЕЦ
        ctx.fillStyle = '#b8863b';
        ctx.beginPath();
        ctx.moveTo(41, 56);
        ctx.quadraticCurveTo(40, 24, 64, 22);
        ctx.quadraticCurveTo(88, 24, 87, 56);
        ctx.lineTo(83, 48);
        ctx.quadraticCurveTo(64, 38, 45, 48);
        ctx.closePath();
        ctx.fill();

        // Световые пряди волос на макушке
        ctx.fillStyle = '#d9a752';
        ctx.beginPath();
        ctx.moveTo(50, 38);
        ctx.quadraticCurveTo(64, 24, 78, 38);
        ctx.quadraticCurveTo(64, 32, 50, 38);
        ctx.closePath();
        ctx.fill();

        // Тонкий золотой рыцарский обруч на лбу
        ctx.fillStyle = '#ffd875';
        ctx.strokeStyle = '#8a6421';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(43, 47);
        ctx.lineTo(64, 42);
        ctx.lineTo(85, 47);
        ctx.lineTo(84, 51);
        ctx.lineTo(64, 46);
        ctx.lineTo(44, 51);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 5. РОВНЫЙ, РЕШИТЕЛЬНЫЙ ВЗГЛЯД, БРОВИ И ВОЛЕВОЙ ПОДБОРОДОК
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(53, 61, 4.8, 2.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 61, 4.8, 2.2, 0, 0, Math.PI * 2); ctx.fill();

        // Ясная небесно-лазурная радужка
        ctx.fillStyle = '#0284c7';
        ctx.beginPath(); ctx.arc(53, 61, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 61, 2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0c4a6e';
        ctx.beginPath(); ctx.arc(53, 61, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 61, 1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(53.8, 60.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75.8, 60.2, 0.7, 0, Math.PI * 2); ctx.fill();

        // Ровные уверенные брови
        ctx.strokeStyle = '#785224';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(47, 56); ctx.lineTo(59, 57);
        ctx.moveTo(81, 56); ctx.lineTo(69, 57);
        ctx.stroke();

        // Прямой благородный нос и твёрдая линия губ
        ctx.strokeStyle = '#c99071';
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(64, 58); ctx.lineTo(62.5, 73); ctx.lineTo(66, 73); ctx.stroke();

        ctx.strokeStyle = '#9c5a44';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(57, 83);
        ctx.quadraticCurveTo(64, 84.5, 71, 83);
        ctx.stroke();

        // 6. ГЕРАЛЬДИЧЕСКИЙ ЩИТ С СИМВОЛОМ СОЛНЦА НА ПЕРЕДНЕМ ПЛАНЕ (Слева снизу)
        ctx.save();
        ctx.translate(27, 104);
        ctx.rotate((Math.PI / 180) * -8);

        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#ffd875';
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

        // Золотая эмблема солнца и лучи на щите
        ctx.fillStyle = '#ffd875';
        ctx.beginPath(); ctx.arc(0, -2, 5.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(-1.5, -14, 3, 26);
        ctx.fillRect(-11, -3.5, 22, 3);

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(0, -2, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 22);
        ctx.quadraticCurveTo(40, 24, 41, 56);
        ctx.lineTo(45, 80);
        ctx.lineTo(64, 98);
        ctx.lineTo(64, 128);
        ctx.lineTo(14, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },






    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ЛУЧНИКА (РОВНЫЙ ЗОРКИЙ ВЗГЛЯД, ШЛЯПА С ПЕРОМ И ЛУК)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateArcherAvatarDataUrl() {
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
        ctx.moveTo(84, 96);
        ctx.lineTo(98, 62);
        ctx.lineTo(109, 67);
        ctx.lineTo(96, 102);
        ctx.closePath();
        ctx.fill();

        // Красно-белое оперение стрел в колчане
        ctx.fillStyle = '#dc2626';
        ctx.beginPath(); ctx.moveTo(97, 63); ctx.lineTo(103, 51); ctx.lineTo(102, 65); ctx.fill();
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath(); ctx.moveTo(103, 65); ctx.lineTo(111, 54); ctx.lineTo(107, 67); ctx.fill();
        ctx.fillStyle = '#dc2626';
        ctx.beginPath(); ctx.moveTo(107, 67); ctx.lineTo(116, 58); ctx.lineTo(110, 69); ctx.fill();

        // 2. КОЖАНЫЙ КОЛЕТ СТРЕЛКА, НАПЛЕЧНИК И ПОРТУПЕЯ
        ctx.fillStyle = '#3b522a';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(36, 98);
        ctx.lineTo(92, 98);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        // Кожаный наплечник стрелка на правом плече
        ctx.fillStyle = '#4a3219';
        ctx.beginPath();
        ctx.moveTo(80, 98);
        ctx.quadraticCurveTo(104, 96, 112, 124);
        ctx.lineTo(86, 128);
        ctx.closePath();
        ctx.fill();

        // Ремень колчана через грудь с латунной пряжкой
        ctx.fillStyle = '#2b190d';
        ctx.beginPath();
        ctx.moveTo(86, 98);
        ctx.lineTo(54, 128);
        ctx.lineTo(68, 128);
        ctx.lineTo(96, 102);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.8;
        ctx.strokeRect(72, 111, 8, 7);

        // 3. ШЕЯ, УШИ И ВОЛЕВОЕ ЛИЦО ЛУЧНИКА
        ctx.fillStyle = '#e0ac8b';
        ctx.fillRect(55, 86, 18, 16);

        ctx.fillStyle = '#f8ceb4';
        ctx.beginPath();
        ctx.moveTo(44, 48);
        ctx.lineTo(84, 48);
        ctx.lineTo(82, 80);
        ctx.lineTo(64, 98);
        ctx.lineTo(46, 80);
        ctx.closePath();
        ctx.fill();

        // Каштановые пряди волос на висках
        ctx.fillStyle = '#5c3a21';
        ctx.beginPath();
        ctx.moveTo(43, 46); ctx.lineTo(47, 62); ctx.lineTo(51, 48);
        ctx.moveTo(85, 46); ctx.lineTo(81, 62); ctx.lineTo(77, 48);
        ctx.fill();

        // Аккуратная козлиная бородка и усы
        ctx.fillStyle = '#4a2e1b';
        ctx.beginPath();
        ctx.moveTo(57, 89);
        ctx.lineTo(64, 99);
        ctx.lineTo(71, 89);
        ctx.quadraticCurveTo(64, 91, 57, 89);
        ctx.closePath();
        ctx.fill();

        // 4. РОВНЫЙ, ЗОРКИЙ ВЗГЛЯД И УВЕРЕННАЯ УХМЫЛКА (Без раскосости)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(53, 61, 4.6, 2.1, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 61, 4.6, 2.1, 0, 0, Math.PI * 2); ctx.fill();

        // Ясная янтарно-зелёная радужка
        ctx.fillStyle = '#15803d';
        ctx.beginPath(); ctx.arc(53, 61, 1.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 61, 1.9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(53, 61, 0.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 61, 0.9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(53.8, 60.2, 0.65, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75.8, 60.2, 0.65, 0, Math.PI * 2); ctx.fill();

        // Ровные собранные брови
        ctx.strokeStyle = '#3b2414';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(47, 56.5); ctx.lineTo(59, 57);
        ctx.moveTo(81, 56.5); ctx.lineTo(69, 57);
        ctx.stroke();

        // Прямой нос и лёгкая уверенная полуулыбка
        ctx.strokeStyle = '#c99071';
        ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(64, 58); ctx.lineTo(62.5, 73); ctx.lineTo(66, 73); ctx.stroke();

        ctx.strokeStyle = '#8f4738';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(56, 82);
        ctx.quadraticCurveTo(64, 85, 72, 81);
        ctx.stroke();

        // 5. ОХОТНИЧЬЯ ШЛЯПА СТРЕЛКА С ЗОЛОТОЙ ПРЯЖКОЙ И ПЕРОМ
        ctx.save();
        ctx.translate(64, 45);
        ctx.rotate((Math.PI / 180) * -5);
        ctx.translate(-64, -45);

        // Поля шляпы
        ctx.fillStyle = '#2d4a22';
        ctx.beginPath();
        ctx.ellipse(64, 47, 42, 9.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Конусная тулья шляпы стрелка
        ctx.fillStyle = '#3f6630';
        ctx.beginPath();
        ctx.moveTo(41, 46);
        ctx.lineTo(54, 18);
        ctx.lineTo(74, 18);
        ctx.lineTo(87, 46);
        ctx.closePath();
        ctx.fill();

        // Кожаный ремешок и золотая пряжка на шляпе
        ctx.fillStyle = '#3b2416';
        ctx.fillRect(42, 41, 44, 4.5);
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(59, 40, 10, 6.5);

        // Яркое ало-золотое перо сбоку шляпы
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.moveTo(82, 42);
        ctx.quadraticCurveTo(102, 16, 114, 6);
        ctx.quadraticCurveTo(106, 26, 86, 44);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 6. ИЗОГНУТЫЙ ДЕРЕВЯННЫЙ ЛУК НА ПЕРЕДНЕМ ПЛАНЕ (Слева)
        ctx.strokeStyle = '#854d27';
        ctx.lineWidth = 3.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(22, 24);
        ctx.bezierCurveTo(6, 54, 6, 94, 22, 124);
        ctx.stroke();

        // Натянутая тетива
        ctx.strokeStyle = 'rgba(241, 245, 249, 0.85)';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(22, 25);
        ctx.lineTo(22, 123);
        ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 18);
        ctx.lineTo(54, 18);
        ctx.lineTo(41, 46);
        ctx.lineTo(22, 47);
        ctx.lineTo(46, 80);
        ctx.lineTo(64, 98);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },







    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ МАГА (РОВНЫЙ ПРОНИЦАТЕЛЬНЫЙ ВЗГЛЯД, ШЛЯПА И ПОСОХ)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateWizardAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. МАГИЧЕСКИЙ ПОСОХ С ПАРЯЩИМ КРИСТАЛЛОМ ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.save();
        ctx.translate(104, 52);
        ctx.rotate((Math.PI / 180) * 20);

        // Деревянное древко посоха с золотой оковкой
        ctx.strokeStyle = '#4a311d';
        ctx.lineWidth = 4.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(0, 86);
        ctx.stroke();

        // Золотая вилка-оправа навершия
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-7, -10);
        ctx.quadraticCurveTo(0, 1, 7, -10);
        ctx.stroke();

        // Ореол тайной лазурной магии вокруг кристалла
        ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.beginPath();
        ctx.arc(0, -20, 15, 0, Math.PI * 2);
        ctx.fill();

        // Огранённый сияющий кристалл
        ctx.fillStyle = '#38bdf8';
        ctx.strokeStyle = '#e0f2fe';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -30);
        ctx.lineTo(6.5, -20);
        ctx.lineTo(0, -10);
        ctx.lineTo(-6.5, -20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 2. ДЛИННЫЕ СЕДЫЕ ВОЛОСЫ И АРКАННАЯ МАНТИЯ АРХИМАГА
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(34, 54);
        ctx.quadraticCurveTo(24, 92, 24, 128);
        ctx.lineTo(104, 128);
        ctx.quadraticCurveTo(104, 92, 94, 54);
        ctx.closePath();
        ctx.fill();

        // Тёмно-синяя мантия волшебника
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(34, 96);
        ctx.lineTo(94, 96);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        // Золотая вышивка и воротник мантии
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(36, 98);
        ctx.lineTo(64, 124);
        ctx.lineTo(92, 98);
        ctx.stroke();

        // 3. ЛИЦО МУДРОГО ЧАРОДЕЯ И ДЛИННАЯ СЕДАЯ БОРОДА
        ctx.fillStyle = '#e8be9e';
        ctx.beginPath();
        ctx.moveTo(43, 50);
        ctx.lineTo(85, 50);
        ctx.lineTo(83, 82);
        ctx.lineTo(64, 100);
        ctx.lineTo(45, 82);
        ctx.closePath();
        ctx.fill();

        // Лёгкие морщинки мудрости у глаз
        ctx.strokeStyle = '#c49676';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(45, 63); ctx.lineTo(48, 64);
        ctx.moveTo(83, 63); ctx.lineTo(80, 64);
        ctx.stroke();

        // Пышная длинная седая борода
        ctx.fillStyle = '#f1f5f9';
        ctx.beginPath();
        ctx.moveTo(43, 74);
        ctx.quadraticCurveTo(38, 102, 64, 126);
        ctx.quadraticCurveTo(90, 102, 85, 74);
        ctx.quadraticCurveTo(64, 86, 43, 74);
        ctx.closePath();
        ctx.fill();

        // Теневые пряди в бороде для объёма
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(54, 88); ctx.quadraticCurveTo(53, 106, 58, 118);
        ctx.moveTo(74, 88); ctx.quadraticCurveTo(75, 106, 70, 118);
        ctx.stroke();

        // Пышные серебристые усы
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(48, 78);
        ctx.quadraticCurveTo(64, 72, 80, 78);
        ctx.lineTo(83, 85);
        ctx.quadraticCurveTo(64, 80, 45, 85);
        ctx.closePath();
        ctx.fill();

        // 4. РОВНЫЙ, ПРОНИЦАТЕЛЬНЫЙ ВЗГЛЯД И ГУСТЫЕ СЕДЫЕ БРОВИ (Без раскосости)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(53, 61, 4.8, 2.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 61, 4.8, 2.2, 0, 0, Math.PI * 2); ctx.fill();

        // Светящаяся арканно-лазурная радужка мага
        ctx.fillStyle = '#0ea5e9';
        ctx.beginPath(); ctx.arc(53, 61, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 61, 2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0c4a6e';
        ctx.beginPath(); ctx.arc(53, 61, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 61, 1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(53.8, 60.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75.8, 60.2, 0.7, 0, Math.PI * 2); ctx.fill();

        // Густые, ровные серебристые брови
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(46, 56); ctx.quadraticCurveTo(53, 53.5, 60, 56.5); ctx.lineTo(59, 58.5); ctx.quadraticCurveTo(53, 56, 46, 58);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(82, 56); ctx.quadraticCurveTo(75, 53.5, 68, 56.5); ctx.lineTo(69, 58.5); ctx.quadraticCurveTo(75, 56, 82, 58);
        ctx.closePath();
        ctx.fill();

        // Благородный прямой нос
        ctx.strokeStyle = '#c49676';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(64, 58); ctx.lineTo(62.5, 73); ctx.lineTo(66, 73);
        ctx.stroke();

        // 5. ОСТРОКОНЕЧНАЯ ШЛЯПА ВОЛШЕБНИКА С ЗОЛОТОЙ ЛЕНТОЙ И ЗВЕЗДОЙ
        // Широкие поля шляпы
        ctx.fillStyle = '#1d2b53';
        ctx.beginPath();
        ctx.ellipse(64, 48, 44, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Высокий изогнутый конус шляпы
        ctx.fillStyle = '#26396e';
        ctx.beginPath();
        ctx.moveTo(41, 47);
        ctx.quadraticCurveTo(50, 22, 74, 6); // Загнутый кончик колпака вправо
        ctx.quadraticCurveTo(78, 26, 87, 47);
        ctx.closePath();
        ctx.fill();

        // Золотая лента-повязка и пряжка на шляпе
        ctx.fillStyle = '#ffd875';
        ctx.beginPath();
        ctx.moveTo(42, 42);
        ctx.quadraticCurveTo(64, 45, 86, 42);
        ctx.lineTo(87, 46);
        ctx.quadraticCurveTo(64, 49, 41, 46);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#8a6421';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(59, 42.5, 10, 5.5);

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(74, 6);
        ctx.quadraticCurveTo(50, 22, 41, 47);
        ctx.lineTo(20, 48);
        ctx.lineTo(45, 82);
        ctx.lineTo(64, 126);
        ctx.lineTo(16, 128);
        ctx.lineTo(34, 54);
        ctx.closePath();
        ctx.fill();

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
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ БЛАГОРОДНОГО ОЛЕНЯ (РОВНЫЙ ВЗГЛЯД И ВЕТВИСТЫЕ РОГА)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateDeerAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ВЕТВИСТЫЕ КОРОЛЕВСКИЕ РОГА (Задний план)
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Левый рог (светлая кость с теневым основанием)
        ctx.strokeStyle = '#d7ccb8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(54, 42);
        ctx.quadraticCurveTo(38, 28, 36, 10); // Главный ствол
        ctx.moveTo(47, 34);
        ctx.lineTo(26, 26); // Нижний отросток
        ctx.moveTo(41, 24);
        ctx.lineTo(24, 14); // Средний отросток
        ctx.moveTo(37, 17);
        ctx.lineTo(44, 8);  // Верхний зубец короны
        ctx.stroke();

        // Правый рог
        ctx.strokeStyle = '#e8e0cf';
        ctx.beginPath();
        ctx.moveTo(74, 42);
        ctx.quadraticCurveTo(90, 28, 92, 10); // Главный ствол
        ctx.moveTo(81, 34);
        ctx.lineTo(102, 26); // Нижний отросток
        ctx.moveTo(87, 24);
        ctx.lineTo(104, 14); // Средний отросток
        ctx.moveTo(91, 17);
        ctx.lineTo(84, 8);  // Верхний зубец короны
        ctx.stroke();

        // 2. МОЩНАЯ ШЕЯ И БЕЛАЯ ПУШИСТАЯ ГРУДКА ВОЖАКА
        ctx.fillStyle = '#7c4d2b';
        ctx.beginPath();
        ctx.moveTo(32, 128);
        ctx.lineTo(44, 78);
        ctx.lineTo(84, 78);
        ctx.lineTo(96, 128);
        ctx.closePath();
        ctx.fill();

        // Светло-кремовый мех на груди
        ctx.fillStyle = '#efe6d5';
        ctx.beginPath();
        ctx.moveTo(48, 94);
        ctx.quadraticCurveTo(64, 102, 80, 94);
        ctx.lineTo(84, 128);
        ctx.lineTo(44, 128);
        ctx.closePath();
        ctx.fill();

        // 3. ЧУТКИЕ УШИ ОЛЕНЯ (Симметрично разведены в стороны)
        ctx.fillStyle = '#9c663b';
        // Левое ухо
        ctx.beginPath();
        ctx.moveTo(46, 48);
        ctx.quadraticCurveTo(24, 38, 18, 48);
        ctx.quadraticCurveTo(26, 58, 45, 56);
        ctx.closePath();
        ctx.fill();

        // Правое ухо
        ctx.beginPath();
        ctx.moveTo(82, 48);
        ctx.quadraticCurveTo(104, 38, 110, 48);
        ctx.quadraticCurveTo(102, 58, 83, 56);
        ctx.closePath();
        ctx.fill();

        // Светлая внутренняя раковина ушей
        ctx.fillStyle = '#e6ccb2';
        ctx.beginPath(); ctx.ellipse(32, 48, 9, 3, -0.15, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(96, 48, 9, 3, 0.15, 0, Math.PI * 2); ctx.fill();

        // 4. ГОЛОВА И БЛАГОРОДНАЯ МОРДА ОЛЕНЯ (Тёплый ореховый мех)
        ctx.fillStyle = '#b07848';
        ctx.beginPath();
        ctx.moveTo(48, 42);
        ctx.quadraticCurveTo(64, 34, 80, 42);
        ctx.lineTo(84, 66);
        ctx.lineTo(72, 92);
        ctx.lineTo(56, 92);
        ctx.lineTo(44, 66);
        ctx.closePath();
        ctx.fill();

        // Светлая спинка носа и переносица для чёткого объёма
        ctx.fillStyle = '#c99363';
        ctx.beginPath();
        ctx.moveTo(57, 46);
        ctx.lineTo(71, 46);
        ctx.lineTo(69, 86);
        ctx.lineTo(59, 86);
        ctx.closePath();
        ctx.fill();

        // Белый подшёрсток вокруг носа и подбородка
        ctx.fillStyle = '#f8f5ee';
        ctx.beginPath();
        ctx.moveTo(54, 84);
        ctx.quadraticCurveTo(64, 80, 74, 84);
        ctx.lineTo(71, 98);
        ctx.quadraticCurveTo(64, 102, 57, 98);
        ctx.closePath();
        ctx.fill();

        // 5. РОВНЫЕ, ЯСНЫЕ И БЛАГОРОДНЫЕ ГЛАЗА (Без раскосости и печали)
        // Светлая меховая окантовка век
        ctx.fillStyle = '#e6ccb2';
        ctx.beginPath(); ctx.ellipse(51, 58, 5.5, 3.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(77, 58, 5.5, 3.2, 0, 0, Math.PI * 2); ctx.fill();

        // Тёмные янтарно-карие глаза
        ctx.fillStyle = '#2c1e16';
        ctx.beginPath(); ctx.ellipse(51, 58, 4.2, 2.4, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(77, 58, 4.2, 2.4, 0, 0, Math.PI * 2); ctx.fill();

        // Живые белые блики
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(52.2, 57.2, 1.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(78.2, 57.2, 1.1, 0, Math.PI * 2); ctx.fill();

        // 6. ЧЁРНАЯ МОЧКА НОСА И СПОКОЙНАЯ ЛИНИЯ РТА
        ctx.fillStyle = '#1e1916';
        ctx.beginPath();
        ctx.moveTo(58, 86);
        ctx.quadraticCurveTo(64, 84, 70, 86);
        ctx.lineTo(66, 92);
        ctx.lineTo(62, 92);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#5c3d28';
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(64, 92); ctx.lineTo(64, 95);
        ctx.moveTo(59, 95); ctx.quadraticCurveTo(64, 96.5, 69, 95);
        ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 34);
        ctx.quadraticCurveTo(54, 38, 48, 42);
        ctx.lineTo(44, 66);
        ctx.lineTo(56, 92);
        ctx.lineTo(44, 78);
        ctx.lineTo(32, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ СВИРЕПОГО КАБАНА (ДЕТАЛИЗИРОВАННЫЙ СЕКАЧ)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateBoarAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАДНИЙ ПЛАН: Мощная щетинистая холка и плечи вепря
        ctx.fillStyle = '#261c17';
        ctx.beginPath();
        ctx.moveTo(10, 128);
        ctx.quadraticCurveTo(22, 62, 64, 56);
        ctx.quadraticCurveTo(106, 62, 118, 128);
        ctx.closePath();
        ctx.fill();

        // Острые гребни жёсткой щетины дыбом на макушке и холке
        ctx.fillStyle = '#17100d';
        ctx.beginPath();
        ctx.moveTo(46, 42); ctx.lineTo(52, 22); ctx.lineTo(58, 36);
        ctx.lineTo(64, 16); ctx.lineTo(70, 36); ctx.lineTo(76, 22); ctx.lineTo(82, 42);
        ctx.closePath();
        ctx.fill();

        // Взъерошенные клочья шерсти по бокам плеч
        ctx.fillStyle = '#362720';
        ctx.beginPath();
        ctx.moveTo(20, 92); ctx.lineTo(8, 82); ctx.lineTo(24, 78);
        ctx.moveTo(16, 110); ctx.lineTo(6, 106); ctx.lineTo(20, 100);
        ctx.moveTo(108, 92); ctx.lineTo(120, 82); ctx.lineTo(104, 78);
        ctx.moveTo(112, 110); ctx.lineTo(122, 106); ctx.lineTo(108, 100);
        ctx.closePath();
        ctx.fill();

        // 2. ЗАОСТРЁННЫЕ МОХНАТЫЕ УШИ ВЕПРЯ (Одно с боевой зазубриной)
        ctx.fillStyle = '#3b2b23';
        // Левое ухо
        ctx.beginPath();
        ctx.moveTo(40, 48);
        ctx.lineTo(24, 26);
        ctx.lineTo(48, 38);
        ctx.closePath();
        ctx.fill();

        // Правое рваное ухо
        ctx.beginPath();
        ctx.moveTo(88, 48);
        ctx.lineTo(104, 26);
        ctx.lineTo(96, 36);
        ctx.lineTo(100, 40);
        ctx.lineTo(80, 38);
        ctx.closePath();
        ctx.fill();

        // Внутренняя тёмная раковина ушей
        ctx.fillStyle = '#1f1510';
        ctx.beginPath(); ctx.moveTo(41, 45); ctx.lineTo(29, 31); ctx.lineTo(46, 39); ctx.fill();
        ctx.beginPath(); ctx.moveTo(87, 45); ctx.lineTo(99, 31); ctx.lineTo(82, 39); ctx.fill();

        // 3. МАССИВНАЯ КЛИНОВИДНАЯ ГОЛОВА И БРЫЛИ СЕКАЧА
        ctx.fillStyle = '#4a372d';
        ctx.beginPath();
        ctx.moveTo(42, 42);
        ctx.quadraticCurveTo(64, 32, 86, 42);
        ctx.lineTo(98, 72); // Правая мощная скула-брыля
        ctx.lineTo(84, 98);
        ctx.lineTo(64, 108);
        ctx.lineTo(44, 98);
        ctx.lineTo(30, 72); // Левая мощная скула-брыля
        ctx.closePath();
        ctx.fill();

        // Более светлая спинка рыла и скулы (световой объём)
        ctx.fillStyle = '#61483b';
        ctx.beginPath();
        ctx.moveTo(50, 46);
        ctx.lineTo(78, 46);
        ctx.lineTo(82, 92);
        ctx.lineTo(64, 102);
        ctx.lineTo(46, 92);
        ctx.closePath();
        ctx.fill();

        // Складки ярости на переносице
        ctx.strokeStyle = '#291d17';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(56, 64); ctx.quadraticCurveTo(64, 61, 72, 64);
        ctx.moveTo(55, 69); ctx.quadraticCurveTo(64, 66, 73, 69);
        ctx.stroke();

        // 4. СВИРЕПЫЕ НАЛИТЫЕ КРОВЬЮ ГЛАЗА И ТЯЖЁЛЫЕ НАДБРОВНЫЕ ВАЛИКИ
        ctx.fillStyle = '#1f1510';
        ctx.beginPath(); ctx.ellipse(47, 56, 5, 2.8, 0.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(81, 56, 5, 2.8, -0.2, 0, Math.PI * 2); ctx.fill();

        // Огненно-багровая радужка
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath(); ctx.arc(47.5, 56, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(80.5, 56, 2.2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffd875';
        ctx.beginPath(); ctx.arc(48, 55.5, 0.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(80, 55.5, 0.9, 0, Math.PI * 2); ctx.fill();

        // Нахмуренные надбровные складки
        ctx.strokeStyle = '#1f1510';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(39, 49); ctx.lineTo(54, 55);
        ctx.moveTo(89, 49); ctx.lineTo(74, 55);
        ctx.stroke();

        // 5. ОСКАЛЕННАЯ ПАСТЬ, ПЯТАЧОК И ОГРОМНЫЕ ИЗОГНУТЫЕ БИВНИ
        // Тёмная глубина пасти под пятачком
        ctx.fillStyle = '#1c0a0a';
        ctx.beginPath();
        ctx.moveTo(46, 86);
        ctx.quadraticCurveTo(64, 82, 82, 86);
        ctx.lineTo(76, 98);
        ctx.quadraticCurveTo(64, 104, 52, 98);
        ctx.closePath();
        ctx.fill();

        // Верхние загнутые вбок клыки
        ctx.fillStyle = '#e8e0cf';
        ctx.strokeStyle = '#291d17';
        ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(46, 86); ctx.quadraticCurveTo(36, 84, 34, 76); ctx.quadraticCurveTo(40, 81, 49, 84); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(82, 86); ctx.quadraticCurveTo(92, 84, 94, 76); ctx.quadraticCurveTo(88, 81, 79, 84); ctx.closePath(); ctx.fill(); ctx.stroke();

        // Огромные нижние боевые бивни (рвут силуэт вверх по бокам)
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#1f1510';
        ctx.lineWidth = 1.4;
        // Левый гигантский бивень
        ctx.beginPath();
        ctx.moveTo(44, 92);
        ctx.bezierCurveTo(22, 92, 14, 72, 22, 52);
        ctx.bezierCurveTo(24, 70, 32, 82, 50, 88);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Правый гигантский бивень
        ctx.beginPath();
        ctx.moveTo(84, 92);
        ctx.bezierCurveTo(106, 92, 114, 72, 106, 52);
        ctx.bezierCurveTo(104, 70, 96, 82, 78, 88);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Крупный влажный пятачок вепря по центру
        ctx.fillStyle = '#2b1e19';
        ctx.strokeStyle = '#17100d';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.roundRect(51, 74, 26, 15, 6);
        ctx.fill();
        ctx.stroke();

        // Светлый ободок пятачка и ноздри
        ctx.fillStyle = '#47342c';
        ctx.beginPath();
        ctx.roundRect(53, 76, 22, 11, 5);
        ctx.fill();

        ctx.fillStyle = '#0f0a08';
        ctx.beginPath(); ctx.ellipse(59, 81.5, 2.4, 3.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(69, 81.5, 2.4, 3.2, 0, 0, Math.PI * 2); ctx.fill();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 16);
        ctx.lineTo(46, 42);
        ctx.lineTo(30, 72);
        ctx.lineTo(44, 98);
        ctx.lineTo(64, 108);
        ctx.lineTo(64, 128);
        ctx.lineTo(10, 128);
        ctx.quadraticCurveTo(22, 62, 64, 56);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },






    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ СВИРЕПОГО МЕДВЕДЯ (ДЕТАЛИЗИРОВАННЫЙ ГРИЗЛИ)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateBearAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАДНИЙ ПЛАН: Огромная лохматая холка и плечи гризли
        ctx.fillStyle = '#2c1b12';
        ctx.beginPath();
        ctx.moveTo(8, 128);
        ctx.quadraticCurveTo(18, 66, 64, 62);
        ctx.quadraticCurveTo(110, 66, 120, 128);
        ctx.closePath();
        ctx.fill();

        // Взъерошенные клочья густого меха на плечах
        ctx.fillStyle = '#3e271a';
        ctx.beginPath();
        ctx.moveTo(18, 92); ctx.lineTo(6, 82); ctx.lineTo(22, 78);
        ctx.moveTo(14, 110); ctx.lineTo(4, 106); ctx.lineTo(18, 100);
        ctx.moveTo(110, 92); ctx.lineTo(122, 82); ctx.lineTo(106, 78);
        ctx.moveTo(114, 110); ctx.lineTo(124, 106); ctx.lineTo(110, 100);
        ctx.closePath();
        ctx.fill();

        // 2. ОКРУГЛЫЕ МЕДВЕЖЬИ УШИ С ВНУТРЕННЕЙ ТЕНЬЮ
        ctx.fillStyle = '#4a2f1d';
        ctx.beginPath(); ctx.arc(36, 40, 11, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(92, 40, 11, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#24140b';
        ctx.beginPath(); ctx.arc(37, 41, 6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(91, 41, 6, 0, Math.PI * 2); ctx.fill();

        // 3. МАССИВНАЯ ГОЛОВА И ПУШИСТЫЕ ЩЁКИ МЕДВЕДЯ
        ctx.fillStyle = '#543622';
        ctx.beginPath();
        ctx.moveTo(40, 42);
        ctx.quadraticCurveTo(64, 28, 88, 42);
        ctx.lineTo(104, 72); // Правая пушистая щека
        ctx.lineTo(88, 102);
        ctx.lineTo(64, 112);
        ctx.lineTo(40, 102);
        ctx.lineTo(24, 72);  // Левая пушистая щека
        ctx.closePath();
        ctx.fill();

        // Охристо-ореховый мех на лбу и скулах (световой объём)
        ctx.fillStyle = '#6e472d';
        ctx.beginPath();
        ctx.moveTo(44, 46);
        ctx.quadraticCurveTo(64, 36, 84, 46);
        ctx.lineTo(94, 72);
        ctx.lineTo(80, 94);
        ctx.lineTo(48, 94);
        ctx.lineTo(34, 72);
        ctx.closePath();
        ctx.fill();

        // Вытянутая светло-песочная морда по центру
        ctx.fillStyle = '#9c6e49';
        ctx.beginPath();
        ctx.moveTo(52, 62);
        ctx.lineTo(76, 62);
        ctx.lineTo(80, 88);
        ctx.lineTo(64, 104);
        ctx.lineTo(48, 88);
        ctx.closePath();
        ctx.fill();

        // Складки яростного рычания на переносице
        ctx.strokeStyle = '#3b2314';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(57, 65); ctx.quadraticCurveTo(64, 62, 71, 65);
        ctx.moveTo(56, 69); ctx.quadraticCurveTo(64, 66, 72, 69);
        ctx.stroke();

        // 4. СВИРЕПЫЙ ВЗГЛЯД ЯНТАРНЫХ ГЛАЗ И НАХМУРЕННЫЕ НАДБРОВНЫЕ ДУГИ
        ctx.fillStyle = '#24140b';
        ctx.beginPath(); ctx.ellipse(47, 57, 5.2, 3.2, 0.15, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(81, 57, 5.2, 3.2, -0.15, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#f39c12'; // Янтарно-оранжевые глаза хищника
        ctx.beginPath(); ctx.arc(47.5, 57, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(80.5, 57, 2.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#110a06';
        ctx.beginPath(); ctx.arc(47.5, 57, 1.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(80.5, 57, 1.1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(48.3, 56.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(79.7, 56.2, 0.7, 0, Math.PI * 2); ctx.fill();

        // Нависшие меховые надбровные складки
        ctx.strokeStyle = '#24140b';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(39, 50); ctx.lineTo(54, 56);
        ctx.moveTo(89, 50); ctx.lineTo(74, 56);
        ctx.stroke();

        // 5. МАССИВНЫЙ ВЛАЖНЫЙ ЧЁРНЫЙ НОС И ОСКАЛЕННАЯ ПАСТЬ С КЛЫКАМИ
        // Тёмная глубина пасти
        ctx.fillStyle = '#1c090b';
        ctx.beginPath();
        ctx.moveTo(50, 82);
        ctx.quadraticCurveTo(64, 77, 78, 82);
        ctx.lineTo(75, 96);
        ctx.quadraticCurveTo(64, 102, 53, 96);
        ctx.closePath();
        ctx.fill();

        // Мясистый алый язык внутри пасти
        ctx.fillStyle = '#b8323f';
        ctx.beginPath();
        ctx.ellipse(64, 94, 6.5, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Четыре крупных белоснежных клыка и мелкие резцы
        ctx.fillStyle = '#ffffff';
        // Верхние клыки
        ctx.beginPath(); ctx.moveTo(52, 82); ctx.lineTo(55, 91); ctx.lineTo(58, 82); ctx.fill();
        ctx.beginPath(); ctx.moveTo(76, 82); ctx.lineTo(73, 91); ctx.lineTo(70, 82); ctx.fill();
        // Мелкие верхние резцы
        ctx.fillRect(59.5, 81, 2.2, 3.5);
        ctx.fillRect(63, 81, 2.2, 3.5);
        ctx.fillRect(66.5, 81, 2.2, 3.5);

        // Нижние клыки
        ctx.beginPath(); ctx.moveTo(54, 96); ctx.lineTo(56.5, 88); ctx.lineTo(59, 96); ctx.fill();
        ctx.beginPath(); ctx.moveTo(74, 96); ctx.lineTo(71.5, 88); ctx.lineTo(69, 96); ctx.fill();

        // Крупный чёрный нос гризли с ноздрями и бликом
        ctx.fillStyle = '#120d0a';
        ctx.beginPath();
        ctx.moveTo(55, 72);
        ctx.quadraticCurveTo(64, 69, 73, 72);
        ctx.lineTo(69, 79);
        ctx.lineTo(59, 79);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.beginPath(); ctx.ellipse(67, 73, 3, 1.2, 0.2, 0, Math.PI * 2); ctx.fill();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 28);
        ctx.quadraticCurveTo(50, 34, 40, 42);
        ctx.lineTo(24, 72);
        ctx.lineTo(40, 102);
        ctx.lineTo(64, 112);
        ctx.lineTo(64, 128);
        ctx.lineTo(8, 128);
        ctx.quadraticCurveTo(18, 66, 64, 62);
        ctx.closePath();
        ctx.fill();

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
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ЖЕНЩИНЫ-ЖРИЦЫ (ПРИСТА) НА CANVAS
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generatePriestessAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. БЕЛОСНЕЖНОЕ ПОКРЫВАЛО-АПОСТОЛЬНИК (Задний контур)
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(30, 56);
        ctx.quadraticCurveTo(36, 20, 64, 18);
        ctx.quadraticCurveTo(92, 20, 98, 56);
        ctx.lineTo(106, 128);
        ctx.lineTo(22, 128);
        ctx.closePath();
        ctx.fill();

        // 2. ЖРЕЧЕСКАЯ РИЗА И ЗОЛОТОЕ ОПЛЕЧЬЕ-ОРАРЬ
        ctx.fillStyle = '#1e3a8a';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(34, 96);
        ctx.lineTo(94, 96);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        // Белоснежная епитрахиль с золотой каймой на плечах
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(32, 96);
        ctx.lineTo(64, 124);
        ctx.lineTo(96, 96);
        ctx.lineTo(88, 92);
        ctx.lineTo(64, 112);
        ctx.lineTo(40, 92);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(32, 96);
        ctx.lineTo(64, 124);
        ctx.lineTo(96, 96);
        ctx.stroke();

        // Священный символ солнца на груди
        ctx.fillStyle = '#ffd875';
        ctx.beginPath(); ctx.arc(64, 114, 5.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(64, 114, 2.2, 0, Math.PI * 2); ctx.fill();

        // 3. ШЕЯ И НЕЖНОЕ ОДУХОТВОРЁННОЕ ЛИЦО ЖРИЦЫ
        ctx.fillStyle = '#e5b89b';
        ctx.fillRect(55, 86, 18, 16);

        ctx.fillStyle = '#ffedd8';
        ctx.beginPath();
        ctx.moveTo(45, 48);
        ctx.quadraticCurveTo(64, 34, 83, 48);
        ctx.lineTo(81, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(47, 78);
        ctx.closePath();
        ctx.fill();

        // Мягкие золотисто-русые пряди волос у висков
        ctx.fillStyle = '#c89d46';
        ctx.beginPath();
        ctx.moveTo(44, 46); ctx.quadraticCurveTo(40, 64, 45, 78); ctx.lineTo(48, 74);
        ctx.moveTo(84, 46); ctx.quadraticCurveTo(88, 64, 83, 78); ctx.lineTo(80, 74);
        ctx.fill();

        // 4. ПЕРЕДНИЙ КРАЙ ЖРЕЧЕСКОГО ПОКРЫВАЛА С ЗОЛОТОЙ ВЫШИВКОЙ И ВЕНЦОМ
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(33, 56);
        ctx.quadraticCurveTo(42, 20, 64, 18);
        ctx.quadraticCurveTo(86, 20, 95, 56);
        ctx.lineTo(87, 52);
        ctx.quadraticCurveTo(64, 38, 41, 52);
        ctx.closePath();
        ctx.fill();

        // Золотая вышивка по краю апостольника
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(35, 55);
        ctx.quadraticCurveTo(64, 37, 93, 55);
        ctx.stroke();

        // Золотая капелька-знак на лбу
        ctx.fillStyle = '#ffd875';
        ctx.beginPath(); ctx.arc(64, 46, 2.2, 0, Math.PI * 2); ctx.fill();

        // 5. РОВНЫЕ, ЯСНЫЕ И ДОБРЫЕ ГЛАЗА (Без раскосости)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(54, 60, 4.8, 2.3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 60, 4.8, 2.3, 0, 0, Math.PI * 2); ctx.fill();

        // Светлая небесно-голубая радужка
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(54, 60, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 60, 2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0c4a6e';
        ctx.beginPath(); ctx.arc(54, 60, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 60, 1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(54.8, 59.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74.8, 59.2, 0.7, 0, Math.PI * 2); ctx.fill();

        // Аккуратные ресницы и спокойные брови
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(49, 59.5); ctx.quadraticCurveTo(54, 57.5, 59, 59.5);
        ctx.moveTo(69, 59.5); ctx.quadraticCurveTo(74, 57.5, 79, 59.5);
        ctx.stroke();

        ctx.strokeStyle = '#8a6421';
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(48, 55); ctx.quadraticCurveTo(54, 53.5, 59, 55);
        ctx.moveTo(69, 55); ctx.quadraticCurveTo(74, 53.5, 80, 55);
        ctx.stroke();

        // Аккуратный носик и светлая полуулыбка
        ctx.strokeStyle = '#d9a786';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 57); ctx.lineTo(62.5, 72); ctx.lineTo(65.5, 72); ctx.stroke();

        ctx.fillStyle = '#e07a7a';
        ctx.beginPath();
        ctx.ellipse(64, 81, 4.8, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // 6. СВЯЩЕННЫЙ МОЛИТВЕННИК С ЗОЛОТЫМ СВЕЧЕНИЕМ НА ПЕРЕДНЕМ ПЛАНЕ (Слева снизу)
        ctx.save();
        ctx.translate(27, 108);
        ctx.rotate((Math.PI / 180) * -10);

        // Ореол тёплого исцеляющего света над книгой
        ctx.fillStyle = 'rgba(255, 216, 117, 0.35)';
        ctx.beginPath(); ctx.arc(0, -4, 15, 0, Math.PI * 2); ctx.fill();

        // Золотая обложка фолианта
        ctx.fillStyle = '#b8860b';
        ctx.strokeStyle = '#5c4212';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(-14, -8, 28, 19, 2);
        ctx.fill();
        ctx.stroke();

        // Раскрытые белоснежные страницы
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(-12, -6);
        ctx.quadraticCurveTo(-6, -8, 0, -5);
        ctx.quadraticCurveTo(6, -8, 12, -6);
        ctx.lineTo(12, 9);
        ctx.quadraticCurveTo(6, 7, 0, 10);
        ctx.quadraticCurveTo(-6, 7, -12, 9);
        ctx.closePath();
        ctx.fill();

        // Линия переплёта и золотые руны на страницах
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -5); ctx.lineTo(0, 10);
        ctx.moveTo(-9, -1); ctx.lineTo(-3, -1);
        ctx.moveTo(-9, 3); ctx.lineTo(-3, 3);
        ctx.moveTo(3, -1); ctx.lineTo(9, -1);
        ctx.moveTo(3, 3); ctx.lineTo(9, 3);
        ctx.stroke();
        ctx.restore();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.beginPath();
        ctx.moveTo(64, 18);
        ctx.quadraticCurveTo(42, 20, 33, 56);
        ctx.lineTo(47, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.lineTo(30, 56);
        ctx.closePath();
        ctx.fill();

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
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ЗЛОГО ПОЛУРОСЛИКА (БЕЗ ШАПКИ, С ЧЁРНЫМИ ВОЛОСАМИ)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateHalflingMaleAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ОДЕЖДА: Роскошный фиолетовый камзол чародея с высоким стоячим воротником
        ctx.fillStyle = '#3b0764';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(34, 96);
        ctx.lineTo(94, 96);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        // Высокий стоячий воротник с пурпурной подкладкой
        ctx.fillStyle = '#581c87';
        ctx.beginPath();
        ctx.moveTo(32, 96);
        ctx.lineTo(38, 78);
        ctx.lineTo(54, 96);
        ctx.lineTo(74, 96);
        ctx.lineTo(90, 78);
        ctx.lineTo(96, 96);
        ctx.lineTo(90, 114);
        ctx.lineTo(38, 114);
        ctx.closePath();
        ctx.fill();

        // Золотая вышивка на воротнике и жабо
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(33, 96);
        ctx.lineTo(38, 78);
        ctx.lineTo(64, 124);
        ctx.lineTo(90, 78);
        ctx.lineTo(95, 96);
        ctx.stroke();

        // Аметистовый медальон на груди
        ctx.fillStyle = '#c084fc';
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(64, 112, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 2. КРУПНЫЕ ЗАОСТРЁННЫЕ УШИ (Характерная черта гнома/полурослика)
        ctx.fillStyle = '#e5b8a1';
        ctx.beginPath(); ctx.moveTo(43, 60); ctx.lineTo(22, 46); ctx.lineTo(42, 72); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(85, 60); ctx.lineTo(106, 46); ctx.lineTo(86, 72); ctx.closePath(); ctx.fill();

        // 3. ШЕЯ И ВЫРАЗИТЕЛЬНОЕ ЕХИДНОЕ ЛИЦО
        ctx.fillStyle = '#dfb098';
        ctx.fillRect(55, 84, 18, 16);

        ctx.fillStyle = '#f5d2be';
        ctx.beginPath();
        ctx.moveTo(44, 48);
        ctx.lineTo(84, 48);
        ctx.lineTo(82, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(46, 78);
        ctx.closePath();
        ctx.fill();

        // Лёгкие тёмные круги под глазами
        ctx.fillStyle = 'rgba(30, 27, 75, 0.14)';
        ctx.beginPath(); ctx.ellipse(53, 63, 5.5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 63, 5.5, 2.5, 0, 0, Math.PI * 2); ctx.fill();

        // 4. ЧЁРНЫЕ ВОЛОСЫ БЕЗ ШАПКИ (Зачёсанные назад с острым мысом на лбу и графитовым бликом)
        ctx.fillStyle = '#14171f';
        ctx.beginPath();
        ctx.moveTo(41, 56);
        ctx.quadraticCurveTo(40, 22, 64, 18);
        ctx.quadraticCurveTo(88, 22, 87, 56);
        ctx.lineTo(84, 46);
        ctx.lineTo(74, 40);
        ctx.lineTo(64, 48); // Острый «мыс вдовы» на лбу
        ctx.lineTo(54, 40);
        ctx.lineTo(44, 46);
        ctx.closePath();
        ctx.fill();

        // Холодный стальной блик на чёрных волосах (чтобы причёска не сливалась с тёмным фоном)
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(48, 36); ctx.quadraticCurveTo(54, 24, 62, 22);
        ctx.moveTo(80, 36); ctx.quadraticCurveTo(74, 24, 66, 22);
        ctx.stroke();

        // Тонкие чёрные щегольские усы и заострённая бородка-клинышек
        ctx.fillStyle = '#14171f';
        ctx.beginPath();
        ctx.moveTo(53, 77);
        ctx.quadraticCurveTo(64, 73, 75, 77);
        ctx.lineTo(73, 79);
        ctx.quadraticCurveTo(64, 76, 55, 79);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(58, 88);
        ctx.lineTo(64, 100);
        ctx.lineTo(70, 88);
        ctx.quadraticCurveTo(64, 90, 58, 88);
        ctx.closePath();
        ctx.fill();

        // 5. РОВНЫЙ, НАДМЕННЫЙ ВЗГЛЯД И ГАДЕНЬКАЯ УХМЫЛКА
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(53, 60, 4.6, 2.1, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 60, 4.6, 2.1, 0, 0, Math.PI * 2); ctx.fill();

        // Пронзительная изумрудно-зелёная радужка
        ctx.fillStyle = '#10b981';
        ctx.beginPath(); ctx.arc(53, 60, 1.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 60, 1.9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(53, 60, 0.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 60, 0.9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(53.8, 59.2, 0.65, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75.8, 59.2, 0.65, 0, Math.PI * 2); ctx.fill();

        // Высокомерно изогнутые чёрные брови
        ctx.strokeStyle = '#14171f';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(47, 55); ctx.quadraticCurveTo(53, 52.5, 59, 56);
        ctx.moveTo(81, 53.5); ctx.quadraticCurveTo(75, 51.5, 69, 55.5);
        ctx.stroke();

        // Острый хищный нос и самодовольная ухмылка набок
        ctx.strokeStyle = '#c48d72';
        ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(64, 57); ctx.lineTo(62.5, 72); ctx.lineTo(66.5, 72); ctx.stroke();

        ctx.strokeStyle = '#7e22ce';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(55, 82);
        ctx.quadraticCurveTo(65, 86, 74, 80);
        ctx.stroke();

        // 6. СГУСТОК АРКАННОГО ПЛАМЕНИ НА ПЕРЕДНЕМ ПЛАНЕ (Слева снизу)
        ctx.fillStyle = 'rgba(192, 132, 252, 0.32)';
        ctx.beginPath(); ctx.arc(24, 108, 14, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.moveTo(24, 92);
        ctx.quadraticCurveTo(34, 104, 29, 116);
        ctx.quadraticCurveTo(24, 120, 19, 116);
        ctx.quadraticCurveTo(14, 104, 24, 92);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#f3e8ff';
        ctx.beginPath();
        ctx.moveTo(24, 99);
        ctx.quadraticCurveTo(29, 106, 26, 114);
        ctx.quadraticCurveTo(24, 116, 22, 114);
        ctx.quadraticCurveTo(19, 106, 24, 99);
        ctx.closePath();
        ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 18);
        ctx.quadraticCurveTo(40, 22, 41, 56);
        ctx.lineTo(46, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.lineTo(34, 96);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },







    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ЗЕЛЁНОГО КОБОЛЬДА (ДЕТАЛИЗИРОВАННЫЙ КОПЕЙЩИК В ПРОФИЛЬ)
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

        // 1. ДЕТАЛИЗИРОВАННОЕ КОПЬЁ С ОБМОТКОЙ И ГРАНЁНЫМ НАКОНЕЧНИКОМ (По диагонали)
        ctx.save();
        // Деревянное древко копья
        ctx.strokeStyle = '#5c3e26';
        ctx.lineWidth = 4.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(118, 124);
        ctx.lineTo(22, 28);
        ctx.stroke();

        // Кожаная обмотка-перехват у наконечника
        ctx.strokeStyle = '#2b190d';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(28, 34);
        ctx.lineTo(23, 29);
        ctx.stroke();

        // Листовидный стальной наконечник копья
        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(6, 12);
        ctx.lineTo(27, 21);
        ctx.lineTo(22, 28);
        ctx.lineTo(15, 33);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Светлая заточенная грань наконечника
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(6, 12);
        ctx.lineTo(27, 21);
        ctx.lineTo(22, 28);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 2. ЗАГНУТЫЕ РЕБРИСТЫЕ РОГА И ПЕРЕПОНЧАТЫЙ УШНОЙ ПЛАВНИК (Задний план)
        ctx.fillStyle = '#3d352e';
        // Верхний массивный рог
        ctx.beginPath();
        ctx.moveTo(82, 42);
        ctx.bezierCurveTo(96, 22, 114, 16, 122, 10);
        ctx.bezierCurveTo(110, 26, 98, 36, 90, 48);
        ctx.closePath();
        ctx.fill();

        // Нижний малый рог
        ctx.fillStyle = '#2b2520';
        ctx.beginPath();
        ctx.moveTo(88, 54);
        ctx.quadraticCurveTo(106, 46, 116, 36);
        ctx.lineTo(96, 58);
        ctx.closePath();
        ctx.fill();

        // Рельефные насечки на верхнем роге
        ctx.strokeStyle = '#6b5e52';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(91, 34); ctx.lineTo(95, 39);
        ctx.moveTo(99, 27); ctx.lineTo(103, 32);
        ctx.moveTo(107, 20); ctx.lineTo(110, 24);
        ctx.stroke();

        // 3. ЧЕШУЙЧАТАЯ ШЕЯ, КОЖАНЫЙ ДОСПЕХ И ПОТРЁПАННЫЙ БАГРОВЫЙ ШАРФ
        ctx.fillStyle = '#21592d';
        ctx.beginPath();
        ctx.moveTo(72, 78);
        ctx.quadraticCurveTo(96, 82, 112, 128);
        ctx.lineTo(42, 128);
        ctx.quadraticCurveTo(50, 98, 58, 82);
        ctx.closePath();
        ctx.fill();

        // Светло-салатовые горловые пластины на передней части шеи
        ctx.fillStyle = '#52a357';
        ctx.beginPath();
        ctx.moveTo(56, 84);
        ctx.quadraticCurveTo(50, 106, 48, 128);
        ctx.lineTo(74, 128);
        ctx.quadraticCurveTo(70, 104, 66, 84);
        ctx.closePath();
        ctx.fill();

        // Кожаный нагрудник-безрукавка с железной заклёпкой
        ctx.fillStyle = '#3b2416';
        ctx.beginPath();
        ctx.moveTo(38, 128);
        ctx.lineTo(52, 106);
        ctx.lineTo(98, 106);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#94a3b8';
        ctx.beginPath(); ctx.arc(62, 116, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(86, 116, 2.2, 0, Math.PI * 2); ctx.fill();

        // Развевающийся багровый шарф со складками
        ctx.fillStyle = '#8e2424';
        ctx.beginPath();
        ctx.moveTo(50, 90);
        ctx.quadraticCurveTo(72, 95, 92, 88);
        ctx.lineTo(120, 94);
        ctx.lineTo(112, 102);
        ctx.lineTo(118, 108);
        ctx.lineTo(88, 102);
        ctx.quadraticCurveTo(68, 108, 48, 101);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#591212';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(56, 96); ctx.quadraticCurveTo(76, 100, 106, 97);
        ctx.stroke();

        // 4. ГОЛОВА И ВЫТЯНУТАЯ ЯЩЕРИНАЯ МОРДА В ПРОФИЛЬ ВЛЕВО
        ctx.fillStyle = '#2d7a3e';
        ctx.beginPath();
        ctx.moveTo(90, 48); // Затылок
        ctx.lineTo(68, 34); // Надбровный гребень
        ctx.lineTo(18, 52); // Вытянутый кончик носа влево
        ctx.lineTo(22, 64); // Верхняя губа
        ctx.lineTo(58, 72); // Угол пасти
        ctx.lineTo(88, 74); // Скула
        ctx.closePath();
        ctx.fill();

        // Световая чешуйчатая полоса вдоль спинки носа
        ctx.fillStyle = '#479c59';
        ctx.beginPath();
        ctx.moveTo(22, 52);
        ctx.lineTo(56, 41);
        ctx.lineTo(52, 46);
        ctx.lineTo(24, 56);
        ctx.closePath();
        ctx.fill();

        // Зазубренный гребень на макушке и перепончатое ухо на скуле
        ctx.fillStyle = '#164222';
        ctx.beginPath();
        ctx.moveTo(66, 36); ctx.lineTo(74, 24); ctx.lineTo(79, 38);
        ctx.lineTo(86, 28); ctx.lineTo(88, 44);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#3d914f';
        ctx.beginPath();
        ctx.moveTo(82, 58); ctx.lineTo(96, 54); ctx.lineTo(86, 68);
        ctx.closePath();
        ctx.fill();

        // Ноздря на кончике морды
        ctx.fillStyle = '#103018';
        ctx.beginPath(); ctx.arc(24, 53, 1.8, 0, Math.PI * 2); ctx.fill();

        // 5. ПРИОТКРЫТАЯ ОСКАЛЕННАЯ ПАСТЬ, ЯЗЫК И ОСТРЫЕ КЛЫКИ
        ctx.fillStyle = '#1f0d10';
        ctx.beginPath();
        ctx.moveTo(22, 63);
        ctx.lineTo(60, 71);
        ctx.lineTo(28, 86);
        ctx.lineTo(25, 79);
        ctx.lineTo(48, 71);
        ctx.closePath();
        ctx.fill();

        // Алый язык внутри пасти
        ctx.fillStyle = '#c0392b';
        ctx.beginPath();
        ctx.moveTo(52, 72);
        ctx.quadraticCurveTo(38, 76, 29, 76);
        ctx.quadraticCurveTo(37, 81, 54, 75);
        ctx.closePath();
        ctx.fill();

        // Нижняя челюсть
        ctx.fillStyle = '#3d914f';
        ctx.beginPath();
        ctx.moveTo(58, 70);
        ctx.lineTo(25, 80);
        ctx.lineTo(31, 88);
        ctx.lineTo(66, 86);
        ctx.lineTo(88, 74);
        ctx.closePath();
        ctx.fill();

        // Острые белые зубы-иглы сверху и снизу
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.moveTo(24, 63); ctx.lineTo(27, 70); ctx.lineTo(30, 64); ctx.fill();
        ctx.beginPath(); ctx.moveTo(33, 65); ctx.lineTo(36, 71); ctx.lineTo(39, 66); ctx.fill();
        ctx.beginPath(); ctx.moveTo(42, 67); ctx.lineTo(45, 72); ctx.lineTo(48, 68); ctx.fill();

        ctx.beginPath(); ctx.moveTo(27, 80); ctx.lineTo(30, 74); ctx.lineTo(33, 79); ctx.fill();
        ctx.beginPath(); ctx.moveTo(36, 78); ctx.lineTo(39, 72); ctx.lineTo(42, 76); ctx.fill();
        ctx.beginPath(); ctx.moveTo(45, 75); ctx.lineTo(48, 70); ctx.lineTo(51, 73); ctx.fill();

        // 6. ХИЩНЫЙ ЯНТАРНЫЙ ЗМЕИНЫЙ ГЛАЗ
        ctx.fillStyle = '#103018';
        ctx.beginPath();
        ctx.moveTo(55, 49);
        ctx.lineTo(71, 43);
        ctx.lineTo(66, 55);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.moveTo(57, 49);
        ctx.lineTo(69, 44.5);
        ctx.lineTo(65, 53.5);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(62.5, 45.5, 1.5, 6.5);

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(61.5, 47.5, 1, 0, Math.PI * 2); ctx.fill();

        // Надбровная дуга
        ctx.strokeStyle = '#103018';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(53, 46);
        ctx.lineTo(71, 41);
        ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень вдоль нижней челюсти и спины)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(25, 80);
        ctx.lineTo(66, 86);
        ctx.lineTo(88, 74);
        ctx.lineTo(112, 128);
        ctx.lineTo(42, 128);
        ctx.lineTo(56, 84);
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
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ЛЕСНОЙ ДРИАДЫ (ДЕТАЛИЗИРОВАННЫЙ ОБРАЗ ХРАНИТЕЛЬНИЦЫ РОЩИ)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateDryadAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ВЕТВИ И ПЫШНАЯ КРОНА ЛИСТВЕННЫХ ВОЛОС НА ЗАДНЕМ ПЛАНЕ
        // Изящные древесные ветви, растущие из причёски вверх
        ctx.strokeStyle = '#5c3a21';
        ctx.lineWidth = 3.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(46, 36);
        ctx.quadraticCurveTo(32, 20, 26, 8);
        ctx.moveTo(35, 22);
        ctx.lineTo(20, 20);
        ctx.moveTo(82, 36);
        ctx.quadraticCurveTo(96, 20, 102, 8);
        ctx.moveTo(93, 22);
        ctx.lineTo(108, 20);
        ctx.stroke();

        // Пышный каскад изумрудных волос-листвы
        ctx.fillStyle = '#1b4332';
        ctx.beginPath();
        ctx.moveTo(32, 54);
        ctx.quadraticCurveTo(20, 92, 20, 128);
        ctx.lineTo(108, 128);
        ctx.quadraticCurveTo(108, 92, 96, 54);
        ctx.closePath();
        ctx.fill();

        // Световые салатово-изумрудные пряди по бокам причёски
        ctx.fillStyle = '#2d6a4f';
        ctx.beginPath();
        ctx.arc(36, 58, 15, 0, Math.PI * 2);
        ctx.arc(92, 58, 15, 0, Math.PI * 2);
        ctx.arc(32, 84, 14, 0, Math.PI * 2);
        ctx.arc(96, 84, 14, 0, Math.PI * 2);
        ctx.fill();

        // 2. ОДЕЯНИЕ ИЗ ЖИВОГО МХА, КОРЫ И ЛИСТЬЕВ ПАПОРОТНИКА
        ctx.fillStyle = '#244f38';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.quadraticCurveTo(32, 96, 64, 96);
        ctx.quadraticCurveTo(96, 96, 112, 128);
        ctx.closePath();
        ctx.fill();

        // Ожерелье-воротник из молодых салатовых листьев
        ctx.fillStyle = '#52b788';
        ctx.beginPath();
        ctx.ellipse(42, 104, 8, 4, 0.45, 0, Math.PI * 2);
        ctx.ellipse(54, 110, 8, 4, 0.25, 0, Math.PI * 2);
        ctx.ellipse(74, 110, 8, 4, -0.25, 0, Math.PI * 2);
        ctx.ellipse(86, 104, 8, 4, -0.45, 0, Math.PI * 2);
        ctx.fill();

        // Сияющий янтарно-изумрудный лесной кристалл на груди
        ctx.fillStyle = '#ffd166';
        ctx.strokeStyle = '#1b4332';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(64, 108);
        ctx.lineTo(69, 115);
        ctx.lineTo(64, 122);
        ctx.lineTo(59, 115);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 3. ЗАОСТРЁННЫЕ ЛЕСНЫЕ УШКИ
        ctx.fillStyle = '#c4a47c';
        ctx.beginPath(); ctx.moveTo(43, 60); ctx.lineTo(22, 46); ctx.lineTo(42, 70); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(85, 60); ctx.lineTo(106, 46); ctx.lineTo(86, 70); ctx.closePath(); ctx.fill();

        // 4. ШЕЯ И НЕЖНОЕ ЛИЦО С ЛЕСНОЙ ПЫЛЬЦОЙ-ВЕСНУШКАМИ
        ctx.fillStyle = '#c9a982';
        ctx.fillRect(55, 84, 18, 16);

        ctx.fillStyle = '#e6c9a5';
        ctx.beginPath();
        ctx.moveTo(45, 48);
        ctx.quadraticCurveTo(64, 34, 83, 48);
        ctx.lineTo(81, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(47, 78);
        ctx.closePath();
        ctx.fill();

        // Золотистые веснушки-пыльца на щеках
        ctx.fillStyle = '#b0895a';
        ctx.fillRect(49, 68, 1.5, 1.5); ctx.fillRect(53, 70, 1.5, 1.5);
        ctx.fillRect(79, 68, 1.5, 1.5); ctx.fillRect(75, 70, 1.5, 1.5);

        // 5. ПЕРЕДНИЕ ПРЯДИ ЛИСТВЫ И ВЕНОК ИЗ ЛЕСНЫХ ЦВЕТОВ НА ЛБУ
        ctx.fillStyle = '#40916c';
        ctx.beginPath();
        ctx.moveTo(41, 52);
        ctx.quadraticCurveTo(44, 24, 64, 22);
        ctx.quadraticCurveTo(84, 24, 87, 52);
        ctx.quadraticCurveTo(75, 40, 64, 42);
        ctx.quadraticCurveTo(53, 40, 41, 52);
        ctx.closePath();
        ctx.fill();

        // Венок из нежных лесных бутонов и листочков на лбу
        ctx.fillStyle = '#74c69d';
        ctx.beginPath();
        ctx.ellipse(50, 40, 6, 2.8, -0.3, 0, Math.PI * 2);
        ctx.ellipse(78, 40, 6, 2.8, 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Цветы в венке
        [
            [47, 41, '#f48fb1'],
            [64, 37, '#ffd166'],
            [81, 41, '#f48fb1']
        ].forEach(([fx, fy, color]) => {
            ctx.fillStyle = color;
            ctx.beginPath(); ctx.arc(fx, fy, 3.8, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath(); ctx.arc(fx, fy, 1.3, 0, Math.PI * 2); ctx.fill();
        });

        // 6. РОВНЫЕ, СИЯЮЩИЕ ИЗУМРУДНЫЕ ГЛАЗА И ЗАГАДОЧНАЯ ПОЛУУЛЫБКА
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(54, 60, 4.8, 2.3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 60, 4.8, 2.3, 0, 0, Math.PI * 2); ctx.fill();

        // Яркая изумрудно-золотая радужка духа природы
        ctx.fillStyle = '#10b981';
        ctx.beginPath(); ctx.arc(54, 60, 2.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 60, 2.1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#064e3b';
        ctx.beginPath(); ctx.arc(54, 60, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 60, 1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(54.8, 59.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74.8, 59.2, 0.7, 0, Math.PI * 2); ctx.fill();

        // Изящные лесные брови
        ctx.strokeStyle = '#1b4332';
        ctx.lineWidth = 1.3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(48, 55); ctx.quadraticCurveTo(54, 53.5, 59, 55.5);
        ctx.moveTo(69, 55.5); ctx.quadraticCurveTo(74, 53.5, 80, 55);
        ctx.stroke();

        // Аккуратный носик и спокойная полуулыбка
        ctx.strokeStyle = '#b5936b';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 57); ctx.lineTo(62.5, 72); ctx.lineTo(65.5, 72); ctx.stroke();

        ctx.fillStyle = '#c86d6d';
        ctx.beginPath();
        ctx.ellipse(64, 81, 4.8, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // 7. СВЕТЯЩИЕСЯ ЛЕСНЫЕ СВЕТЛЯЧКИ ВОКРУГ ДРИАДЫ
        ctx.fillStyle = 'rgba(255, 209, 102, 0.45)';
        ctx.beginPath(); ctx.arc(20, 34, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(108, 36, 4.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#fff3b0';
        ctx.beginPath(); ctx.arc(20, 34, 1.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(108, 36, 1.8, 0, Math.PI * 2); ctx.fill();

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 22);
        ctx.quadraticCurveTo(44, 24, 41, 52);
        ctx.lineTo(47, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.lineTo(32, 54);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },





    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ВАРВАРА (РОВНЫЙ ЯРОСТНЫЙ ВЗГЛЯД, МЕХА И СЕКИРА)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateBarbarianAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. МАССИВНАЯ ДВУРУЧНАЯ СЕКИРА ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.save();
        ctx.translate(100, 44);
        ctx.rotate((Math.PI / 180) * 26);

        // Деревянное древко секиры
        ctx.strokeStyle = '#4a311d';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, -14);
        ctx.lineTo(0, 92);
        ctx.stroke();

        // Стальная пика навершия
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.moveTo(-4, -14);
        ctx.lineTo(0, -25);
        ctx.lineTo(4, -14);
        ctx.closePath();
        ctx.fill();

        // Широкие кованые лезвия секиры
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.moveTo(-3, -12);
        ctx.quadraticCurveTo(-24, -18, -26, 2);
        ctx.quadraticCurveTo(-14, 10, -3, 4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(3, -12);
        ctx.quadraticCurveTo(24, -18, 26, 2);
        ctx.quadraticCurveTo(14, 10, 3, 4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Светлая заточенная кромка
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

        // 2. ДЛИННАЯ ГРИВА ВОЛОС И МОЩНЫЕ ПЛЕЧИ В МЕХАХ
        ctx.fillStyle = '#362013';
        ctx.beginPath();
        ctx.moveTo(32, 48);
        ctx.quadraticCurveTo(20, 88, 20, 128);
        ctx.lineTo(108, 128);
        ctx.quadraticCurveTo(108, 88, 96, 48);
        ctx.closePath();
        ctx.fill();

        // Могучие загорелые плечи и грудь берсерка
        ctx.fillStyle = '#c48b6c';
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.quadraticCurveTo(30, 94, 64, 94);
        ctx.quadraticCurveTo(98, 94, 114, 128);
        ctx.closePath();
        ctx.fill();

        // Тяжёлая волчья шкура на плечах
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(12, 128);
        ctx.quadraticCurveTo(22, 92, 46, 96);
        ctx.lineTo(38, 128);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(116, 128);
        ctx.quadraticCurveTo(106, 92, 82, 96);
        ctx.lineTo(90, 128);
        ctx.closePath();
        ctx.fill();

        // Кожаная портупея через грудь с костяными клыками
        ctx.fillStyle = '#2b190d';
        ctx.beginPath();
        ctx.moveTo(36, 98);
        ctx.lineTo(68, 128);
        ctx.lineTo(84, 128);
        ctx.lineTo(50, 96);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#f5eedc';
        ctx.beginPath(); ctx.moveTo(46, 106); ctx.lineTo(44, 118); ctx.lineTo(52, 110); ctx.fill();
        ctx.beginPath(); ctx.moveTo(58, 115); ctx.lineTo(58, 127); ctx.lineTo(65, 119); ctx.fill();

        // 3. СУРОВОЕ ОБВЕТРЕННОЕ ЛИЦО И ПЛЕМЕННАЯ БОЕВАЯ РАСКРАСКА
        ctx.fillStyle = '#d99e7c';
        ctx.beginPath();
        ctx.moveTo(42, 48);
        ctx.quadraticCurveTo(64, 34, 86, 48);
        ctx.lineTo(85, 82);
        ctx.lineTo(64, 100);
        ctx.lineTo(43, 82);
        ctx.closePath();
        ctx.fill();

        // Тёмно-синяя боевая раскраска северянина на щеках
        ctx.fillStyle = 'rgba(30, 58, 138, 0.55)';
        ctx.beginPath();
        ctx.moveTo(44, 66); ctx.lineTo(57, 68); ctx.lineTo(55, 73); ctx.lineTo(44, 71);
        ctx.moveTo(84, 66); ctx.lineTo(71, 68); ctx.lineTo(73, 73); ctx.lineTo(84, 71);
        ctx.closePath();
        ctx.fill();

        // 4. ГУСТАЯ БОРОДА С КОСАМИ И ВЗЪЕРОШЕННАЯ ШЕВЕЛЮРА
        ctx.fillStyle = '#4a2c1a';
        ctx.beginPath();
        ctx.moveTo(42, 74);
        ctx.lineTo(34, 102);
        ctx.lineTo(46, 126);
        ctx.lineTo(82, 126);
        ctx.lineTo(94, 102);
        ctx.lineTo(86, 74);
        ctx.quadraticCurveTo(64, 86, 42, 74);
        ctx.closePath();
        ctx.fill();

        // Суровые опущенные усы
        ctx.fillStyle = '#362013';
        ctx.beginPath();
        ctx.moveTo(48, 78);
        ctx.quadraticCurveTo(64, 72, 80, 78);
        ctx.lineTo(83, 87);
        ctx.quadraticCurveTo(64, 80, 45, 87);
        ctx.closePath();
        ctx.fill();

        // Стальные кольца на косах бороды
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(46, 116, 8, 5);
        ctx.fillRect(74, 116, 8, 5);

        // Взъерошенные волосы на макушке и кожаная повязка на лбу
        ctx.fillStyle = '#4a2c1a';
        ctx.beginPath();
        ctx.moveTo(39, 54);
        ctx.quadraticCurveTo(42, 22, 64, 20);
        ctx.quadraticCurveTo(86, 22, 89, 54);
        ctx.lineTo(85, 46);
        ctx.quadraticCurveTo(64, 36, 43, 46);
        ctx.closePath();
        ctx.fill();

        // Кожаный налобный ремень с металлической бляхой
        ctx.fillStyle = '#2b190d';
        ctx.fillRect(41, 44, 46, 5);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(60, 43, 8, 7);

        // 5. РОВНЫЙ, ЯРОСТНЫЙ ВЗГЛЯД И НАХМУРЕННЫЕ БРОВИ (Без раскосости)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(53, 61, 4.8, 2.1, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 61, 4.8, 2.1, 0, 0, Math.PI * 2); ctx.fill();

        // Ледяная голубая радужка берсерка
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(53, 61, 1.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 61, 1.9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(53, 61, 0.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 61, 0.9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(53.8, 60.2, 0.65, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75.8, 60.2, 0.65, 0, Math.PI * 2); ctx.fill();

        // Густые, сурово сведённые к переносице брови
        ctx.strokeStyle = '#2b190d';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(46, 54.5); ctx.lineTo(59, 58);
        ctx.moveTo(82, 54.5); ctx.lineTo(69, 58);
        ctx.stroke();

        // Крупный прямой нос
        ctx.fillStyle = '#be8263';
        ctx.beginPath();
        ctx.moveTo(61, 58);
        ctx.lineTo(67, 58);
        ctx.lineTo(69, 73);
        ctx.lineTo(64, 76);
        ctx.lineTo(59, 73);
        ctx.closePath();
        ctx.fill();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 20);
        ctx.quadraticCurveTo(42, 22, 39, 54);
        ctx.lineTo(43, 82);
        ctx.lineTo(34, 102);
        ctx.lineTo(46, 126);
        ctx.lineTo(64, 126);
        ctx.lineTo(64, 128);
        ctx.lineTo(14, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },



    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ВОРОНЫ (ДЕТАЛИЗИРОВАННЫЙ ЧЁРНЫЙ ВОРОН В ПОЛУОБОРОТ)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateRavenAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАДНИЙ ПЛАН: Мощная пернатая шея и грудь ворона с иссиня-графитовым отливом
        ctx.fillStyle = '#0f131c';
        ctx.beginPath();
        ctx.moveTo(64, 52);
        ctx.quadraticCurveTo(98, 66, 116, 128);
        ctx.lineTo(36, 128);
        ctx.quadraticCurveTo(44, 92, 52, 76);
        ctx.closePath();
        ctx.fill();

        // Ярусные перья на груди и загривке (flat-переливы)
        ctx.fillStyle = '#1e2536';
        ctx.beginPath();
        ctx.moveTo(46, 94);
        ctx.lineTo(58, 106);
        ctx.lineTo(70, 94);
        ctx.lineTo(82, 108);
        ctx.lineTo(94, 94);
        ctx.lineTo(104, 128);
        ctx.lineTo(40, 128);
        ctx.closePath();
        ctx.fill();

        // Взъерошенные перья на затылке ворона
        ctx.fillStyle = '#181e2c';
        ctx.beginPath();
        ctx.moveTo(82, 42); ctx.lineTo(98, 36); ctx.lineTo(88, 50);
        ctx.moveTo(86, 52); ctx.lineTo(102, 52); ctx.lineTo(90, 62);
        ctx.moveTo(88, 64); ctx.lineTo(104, 68); ctx.lineTo(90, 74);
        ctx.closePath();
        ctx.fill();

        // 2. ГОЛОВА И ПЕРЬЕВАЯ «БОРОДКА» ПОД КЛЮВОМ
        ctx.fillStyle = '#141924';
        ctx.beginPath();
        ctx.moveTo(88, 48); // Затылок
        ctx.quadraticCurveTo(72, 28, 48, 38); // Округлое темя ворона
        ctx.lineTo(36, 48); // Переносица
        ctx.lineTo(38, 76); // Основание нижней челюсти
        ctx.quadraticCurveTo(64, 86, 88, 68); // Скула
        ctx.closePath();
        ctx.fill();

        // Световой стальной отлив на макушке головы
        ctx.fillStyle = '#2a3347';
        ctx.beginPath();
        ctx.moveTo(48, 40);
        ctx.quadraticCurveTo(68, 32, 84, 46);
        ctx.quadraticCurveTo(68, 42, 50, 46);
        ctx.closePath();
        ctx.fill();

        // Взъерошенные перья-бородка под подклювьем
        ctx.fillStyle = '#1e2536';
        ctx.beginPath();
        ctx.moveTo(38, 72);
        ctx.lineTo(44, 88);
        ctx.lineTo(52, 78);
        ctx.lineTo(58, 90);
        ctx.lineTo(66, 78);
        ctx.closePath();
        ctx.fill();

        // 3. МОЩНЫЙ АНАТОМИЧЕСКИЙ КЛЮВ ВОРОНА (Вытянут влево)
        // Верхнее надклювье (массивное, слегка загнутое на кончике)
        ctx.fillStyle = '#1c222e';
        ctx.beginPath();
        ctx.moveTo(44, 44);
        ctx.quadraticCurveTo(24, 46, 10, 61); // Изогнутый кончик клюва
        ctx.lineTo(14, 64);
        ctx.lineTo(42, 64);
        ctx.closePath();
        ctx.fill();

        // Светлая костяно-графитовая грань по верху клюва
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(43, 45);
        ctx.quadraticCurveTo(25, 47, 12, 60);
        ctx.lineTo(15, 61);
        ctx.quadraticCurveTo(27, 51, 42, 50);
        ctx.closePath();
        ctx.fill();

        // Нижнее подклювье
        ctx.fillStyle = '#0d1017';
        ctx.beginPath();
        ctx.moveTo(42, 64);
        ctx.lineTo(15, 64);
        ctx.quadraticCurveTo(26, 74, 41, 74);
        ctx.closePath();
        ctx.fill();

        // Щетинки-перья у основания клюва (визитная карточка ворона)
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(44, 47); ctx.lineTo(31, 51);
        ctx.moveTo(43, 51); ctx.lineTo(29, 55);
        ctx.stroke();

        // 4. ПРОНЗИТЕЛЬНЫЙ ГЛАЗ ВОРОНА С ЯНТАРНО-АМЕТИСТОВОЙ ОКАНТОВКОЙ
        // Тёмная окантовка века
        ctx.fillStyle = '#090b10';
        ctx.beginPath();
        ctx.arc(57, 53, 6.2, 0, Math.PI * 2);
        ctx.fill();

        // Светящаяся радужка
        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.arc(57, 53, 4.6, 0, Math.PI * 2);
        ctx.fill();

        // Глубокий чёрный птичий зрачок
        ctx.fillStyle = '#05070a';
        ctx.beginPath();
        ctx.arc(57, 53, 2.8, 0, Math.PI * 2);
        ctx.fill();

        // Яркий хрустальный блик
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(55.6, 51.6, 1.3, 0, Math.PI * 2);
        ctx.fill();

        // Грозная надбровная складка перьев
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(50, 47);
        ctx.quadraticCurveTo(58, 45, 65, 49);
        ctx.stroke();

        // 5. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень вдоль нижней части клюва и груди)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        ctx.beginPath();
        ctx.moveTo(15, 64);
        ctx.quadraticCurveTo(26, 74, 41, 74);
        ctx.lineTo(36, 128);
        ctx.lineTo(116, 128);
        ctx.lineTo(96, 86);
        ctx.lineTo(52, 76);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },





    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ГИГАНТСКОЙ ЖАБЫ (ДЕТАЛИЗИРОВАННАЯ БОЛОТНАЯ ЖАБА)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateToadAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАДНИЙ ПЛАН: Широкая бугристая спина и мощные плечи амфибии
        ctx.fillStyle = '#243b1c';
        ctx.beginPath();
        ctx.moveTo(10, 128);
        ctx.quadraticCurveTo(22, 74, 64, 68);
        ctx.quadraticCurveTo(106, 74, 118, 128);
        ctx.closePath();
        ctx.fill();

        // Тёмные пятна и крупные бородавки на спине
        ctx.fillStyle = '#182912';
        ctx.beginPath(); ctx.arc(26, 94, 6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(102, 94, 6.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(19, 112, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(109, 112, 5, 0, Math.PI * 2); ctx.fill();

        // 2. МАССИВНАЯ ПРИПЛЮСНУТАЯ ГОЛОВА И РАЗДУТЫЕ ЩЁКИ ЖАБЫ
        ctx.fillStyle = '#3f632c'; // Насыщенная болотно-оливковая кожа
        ctx.beginPath();
        ctx.moveTo(32, 50);
        ctx.quadraticCurveTo(64, 42, 96, 50);
        ctx.lineTo(110, 80); // Широкая правая щека
        ctx.lineTo(94, 112);
        ctx.quadraticCurveTo(64, 122, 34, 112);
        ctx.lineTo(18, 80);  // Широкая левая щека
        ctx.closePath();
        ctx.fill();

        // Более светлая оливково-салатовая зона на морде и скулах (световой объём)
        ctx.fillStyle = '#537d3b';
        ctx.beginPath();
        ctx.moveTo(38, 54);
        ctx.quadraticCurveTo(64, 48, 90, 54);
        ctx.lineTo(100, 78);
        ctx.lineTo(28, 78);
        ctx.closePath();
        ctx.fill();

        // Раздутый охристо-кремовый горловой мешок снизу со складками
        ctx.fillStyle = '#b5a86b';
        ctx.beginPath();
        ctx.moveTo(30, 82);
        ctx.quadraticCurveTo(64, 75, 98, 82);
        ctx.lineTo(90, 112);
        ctx.quadraticCurveTo(64, 122, 38, 112);
        ctx.closePath();
        ctx.fill();

        // Рельефные складки раздутого зоба
        ctx.strokeStyle = '#8c7f49';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(46, 92); ctx.quadraticCurveTo(44, 104, 48, 113);
        ctx.moveTo(64, 91); ctx.quadraticCurveTo(64, 105, 64, 116);
        ctx.moveTo(82, 92); ctx.quadraticCurveTo(84, 104, 80, 113);
        ctx.stroke();

        // 3. БУГРИСТАЯ ТЕКСТУРА КОЖИ И ОКОЛОУШНЫЕ ЖЕЛЕЗЫ
        ctx.fillStyle = '#29421c';
        // Околоушные железы по бокам
        ctx.beginPath(); ctx.ellipse(26, 68, 5, 9, -0.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(102, 68, 5, 9, 0.3, 0, Math.PI * 2); ctx.fill();

        // Бородавки на щеках и переносице
        ctx.beginPath(); ctx.arc(46, 66, 2.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(82, 66, 3.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(64, 54, 2.5, 0, Math.PI * 2); ctx.fill();

        // 4. ВЫПУКЛЫЕ ЯНТАРНО-ЗОЛОТЫЕ ГЛАЗА С ТЯЖЁЛЫМИ НАДБРОВНЫМИ ДУГАМИ
        // Кожные бугристые веки-надбровья
        ctx.fillStyle = '#2c471f';
        ctx.beginPath(); ctx.arc(38, 46, 12.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(90, 46, 12.5, 0, Math.PI * 2); ctx.fill();

        // Огненно-золотая радужка жабы
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.arc(38, 48, 9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(90, 48, 9, 0, Math.PI * 2); ctx.fill();

        // Медно-оранжевый внутренний ободок радужки
        ctx.fillStyle = '#d97706';
        ctx.beginPath(); ctx.ellipse(38, 48, 7.5, 5.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(90, 48, 7.5, 5.5, 0, 0, Math.PI * 2); ctx.fill();

        // Горизонтальные амфибийные зрачки
        ctx.fillStyle = '#0f170a';
        ctx.beginPath(); ctx.roundRect(30, 46.5, 16, 3.2, 1.5); ctx.fill();
        ctx.beginPath(); ctx.roundRect(82, 46.5, 16, 3.2, 1.5); ctx.fill();

        // Живые белые блики на глазах
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(41, 44, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(87, 44, 1.8, 0, Math.PI * 2); ctx.fill();

        // Нависшие верхние веки
        ctx.fillStyle = '#3f632c';
        ctx.beginPath();
        ctx.arc(38, 46, 11.5, Math.PI * 1.05, Math.PI * 1.95);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.arc(90, 46, 11.5, Math.PI * 1.05, Math.PI * 1.95);
        ctx.closePath();
        ctx.fill();

        // 5. НОЗДРИ И ШИРОКАЯ УГРЮМАЯ ПАСТЬ
        ctx.fillStyle = '#182912';
        ctx.beginPath(); ctx.arc(57, 61, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(71, 61, 2, 0, Math.PI * 2); ctx.fill();

        // Широкий рот от щеки до щеки с опущенными уголками
        ctx.strokeStyle = '#182912';
        ctx.lineWidth = 2.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(23, 81);
        ctx.quadraticCurveTo(64, 73, 105, 81);
        ctx.stroke();

        // Складки в уголках пасти
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(22, 78); ctx.lineTo(25, 84);
        ctx.moveTo(106, 78); ctx.lineTo(103, 84);
        ctx.stroke();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 34);
        ctx.lineTo(38, 34);
        ctx.lineTo(18, 80);
        ctx.lineTo(10, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },





    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ПУРПУРНОГО ПОДЗЕМНОГО ЧЕРВЯ (ДЕТАЛИЗИРОВАННЫЙ МОНСТР)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateWormAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАДНИЙ ПЛАН: Мощные изгибающиеся кольца тела подземного червя
        ctx.fillStyle = '#24123d';
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.bezierCurveTo(10, 92, 34, 76, 64, 76);
        ctx.bezierCurveTo(94, 76, 118, 92, 114, 128);
        ctx.closePath();
        ctx.fill();

        // Острые хитиновые спинные шипы по бокам сегментов тела
        ctx.fillStyle = '#160926';
        ctx.beginPath();
        ctx.moveTo(22, 96); ctx.lineTo(6, 86); ctx.lineTo(18, 108);
        ctx.moveTo(16, 112); ctx.lineTo(4, 108); ctx.lineTo(14, 124);
        ctx.moveTo(106, 96); ctx.lineTo(122, 86); ctx.lineTo(110, 108);
        ctx.moveTo(112, 112); ctx.lineTo(124, 108); ctx.lineTo(114, 124);
        ctx.closePath();
        ctx.fill();

        // 2. МАССИВНЫЙ СЕГМЕНТИРОВАННЫЙ ГОЛОВНОЙ ПАНЦИРЬ
        ctx.fillStyle = '#4a237a';
        ctx.beginPath();
        ctx.moveTo(24, 128);
        ctx.lineTo(28, 66);
        ctx.quadraticCurveTo(64, 28, 100, 66);
        ctx.lineTo(104, 128);
        ctx.closePath();
        ctx.fill();

        // Световая зона на правой стороне хитинового панциря
        ctx.fillStyle = '#62319e';
        ctx.beginPath();
        ctx.moveTo(64, 44);
        ctx.quadraticCurveTo(88, 50, 100, 66);
        ctx.lineTo(104, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        // Рельефные кольцевые складки панциря (в перспективе дугами)
        ctx.strokeStyle = '#281147';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(27, 94); ctx.quadraticCurveTo(64, 112, 101, 94);
        ctx.moveTo(25, 112); ctx.quadraticCurveTo(64, 128, 103, 112);
        ctx.stroke();

        // Костяные наросты-пластины по бокам головы
        ctx.fillStyle = '#331757';
        ctx.beginPath(); ctx.ellipse(29, 76, 4.5, 9, -0.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(99, 76, 4.5, 9, 0.2, 0, Math.PI * 2); ctx.fill();

        // 3. ОГРОМНАЯ РАСПАХНУТАЯ ПАСТЬ-ВОРОНКА ПОЖИРАТЕЛЯ
        // Мясистый багрово-фиолетовый обод губ
        ctx.fillStyle = '#6e2354';
        ctx.beginPath();
        ctx.arc(64, 68, 28, 0, Math.PI * 2);
        ctx.fill();

        // Бездонная чёрная глотка
        ctx.fillStyle = '#11041a';
        ctx.beginPath();
        ctx.arc(64, 68, 23, 0, Math.PI * 2);
        ctx.fill();

        // Внутреннее кольцо-сфинктер глотки
        ctx.strokeStyle = '#3b1240';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(64, 68, 13, 0, Math.PI * 2);
        ctx.stroke();

        // 4. ТРИ КОНЦЕНТРИЧЕСКИХ РЯДА ЗАГНУТЫХ ВНУТРЬ ОСТРЫХ ЗУБОВ
        ctx.fillStyle = '#f8f5e6';
        // Внешний ряд из 12 крупных клыков
        for (let i = 0; i < 12; i++) {
            const angle = (i * Math.PI * 2) / 12;
            ctx.save();
            ctx.translate(64, 68);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(-3.2, -24);
            ctx.lineTo(0, -15.5);
            ctx.lineTo(3.2, -24);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        // Внутренний ряд из 8 острых зубов-игл (со сдвигом угла)
        ctx.fillStyle = '#e2dcc5';
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI * 2) / 8 + Math.PI / 8;
            ctx.save();
            ctx.translate(64, 68);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(-2.2, -14);
            ctx.lineTo(0, -8);
            ctx.lineTo(2.2, -14);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        // 5. ЧЕТЫРЕ МАССИВНЫХ ХИТИНОВЫХ ЖВАЛА-КРЮКА ВОКРУГ ПАСТИ
        const drawMandible = (angleDeg) => {
            ctx.save();
            ctx.translate(64, 68);
            ctx.rotate((Math.PI / 180) * angleDeg);

            // Мощное тёмное хитиновое основание жвала
            ctx.fillStyle = '#1c0b2e';
            ctx.beginPath();
            ctx.moveTo(-7, -26);
            ctx.quadraticCurveTo(-12, -40, 0, -48);
            ctx.quadraticCurveTo(4, -36, 5, -26);
            ctx.closePath();
            ctx.fill();

            // Острый костяной коготь на кончике жвала
            ctx.fillStyle = '#ffd875';
            ctx.beginPath();
            ctx.moveTo(-5, -38);
            ctx.quadraticCurveTo(-6, -46, 2, -52);
            ctx.quadraticCurveTo(3, -43, 1, -37);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        };

        drawMandible(-48);  // Верхнее левое жвало
        drawMandible(48);   // Верхнее правое жвало
        drawMandible(-132); // Нижнее левое жвало
        drawMandible(132);  // Нижнее правое жвало

        // 6. СВЕТЯЩИЕСЯ БРЫЗГИ ЯДОВИТОЙ СЛЮНЫ ВОКРУГ ПАСТИ
        ctx.fillStyle = '#d946ef';
        ctx.beginPath(); ctx.arc(20, 42, 2.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(108, 42, 2.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(16, 66, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(112, 66, 1.8, 0, Math.PI * 2); ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину тела)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.moveTo(64, 44);
        ctx.quadraticCurveTo(40, 50, 28, 66);
        ctx.lineTo(14, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },





    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ВОИТЕЛЬНИЦЫ (РОВНЫЙ РЕШИТЕЛЬНЫЙ ВЗГЛЯД, МЕЧ И ЩИТ)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateWarriorFemaleAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ДВУРУЧНЫЙ СТАЛЬНОЙ МЕЧ ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.save();
        ctx.translate(102, 54);
        ctx.rotate((Math.PI / 180) * 24);

        // Широкий стальной клинок меча
        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-4.5, 28);
        ctx.lineTo(-4.5, -40);
        ctx.lineTo(0, -52);
        ctx.lineTo(4.5, -40);
        ctx.lineTo(4.5, 28);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Светлая полированная грань клинка
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(0, -52);
        ctx.lineTo(4.5, -40);
        ctx.lineTo(4.5, 28);
        ctx.lineTo(0, 28);
        ctx.closePath();
        ctx.fill();

        // Прямая золотая гарда меча
        ctx.fillStyle = '#d4af37';
        ctx.strokeStyle = '#785a14';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(-13, 24, 26, 4.5, 1.5);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 2. ВЫСОКИЙ БОЕВОЙ ХВОСТ КАШТАНОВЫХ ВОЛОС НА МАКУШКЕ (Задний план)
        ctx.fillStyle = '#4a2511';
        ctx.beginPath();
        ctx.moveTo(56, 26);
        ctx.quadraticCurveTo(46, 10, 34, 16);
        ctx.quadraticCurveTo(42, 24, 48, 30);
        ctx.moveTo(72, 26);
        ctx.quadraticCurveTo(82, 10, 94, 16);
        ctx.quadraticCurveTo(86, 24, 80, 30);
        ctx.closePath();
        ctx.fill();

        // 3. СТАЛЬНЫЕ ЛАТНЫЕ ДОСПЕХИ И АЛЫЙ ПЛАЩ НА ПЛЕЧАХ
        ctx.fillStyle = '#7f1d1d';
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.lineTo(30, 94);
        ctx.lineTo(98, 94);
        ctx.lineTo(114, 128);
        ctx.closePath();
        ctx.fill();

        // Стальная кираса
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(22, 128);
        ctx.lineTo(38, 96);
        ctx.lineTo(90, 96);
        ctx.lineTo(106, 128);
        ctx.closePath();
        ctx.fill();

        // Рельефные латные наплечники с золотой окантовкой
        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(16, 126);
        ctx.quadraticCurveTo(22, 94, 46, 98);
        ctx.lineTo(40, 128);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(112, 126);
        ctx.quadraticCurveTo(106, 94, 82, 98);
        ctx.lineTo(88, 128);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Золотая пряжка-застёжка на груди
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(46, 98);
        ctx.lineTo(64, 120);
        ctx.lineTo(82, 98);
        ctx.stroke();

        // 4. ШЕЯ И ВОЛЕВОЕ ЛИЦО ВОИТЕЛЬНИЦЫ
        ctx.fillStyle = '#e5b89b';
        ctx.fillRect(55, 86, 18, 16);

        ctx.fillStyle = '#fbd2b8';
        ctx.beginPath();
        ctx.moveTo(45, 50);
        ctx.quadraticCurveTo(64, 34, 83, 50);
        ctx.lineTo(81, 79);
        ctx.lineTo(64, 97);
        ctx.lineTo(47, 79);
        ctx.closePath();
        ctx.fill();

        // Короткие боевые пряди каштановых волос по бокам лица
        ctx.fillStyle = '#5c2e16';
        ctx.beginPath();
        ctx.moveTo(44, 44); ctx.quadraticCurveTo(39, 64, 43, 82); ctx.lineTo(48, 78); ctx.quadraticCurveTo(45, 62, 49, 47);
        ctx.moveTo(84, 44); ctx.quadraticCurveTo(89, 64, 85, 82); ctx.lineTo(80, 78); ctx.quadraticCurveTo(83, 62, 79, 47);
        ctx.fill();

        // 5. ПРИЧЁСКА НА МАКУШКЕ И СТАЛЬНОЙ НАЛОБНЫЙ ВЕНЕЦ
        ctx.fillStyle = '#5c2e16';
        ctx.beginPath();
        ctx.moveTo(41, 52);
        ctx.quadraticCurveTo(44, 24, 64, 22);
        ctx.quadraticCurveTo(84, 24, 87, 52);
        ctx.lineTo(83, 47);
        ctx.quadraticCurveTo(64, 36, 45, 47);
        ctx.closePath();
        ctx.fill();

        // Стальной боевой обруч с золотой заклёпкой на лбу
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.moveTo(43, 46);
        ctx.lineTo(64, 42);
        ctx.lineTo(85, 46);
        ctx.lineTo(84, 51);
        ctx.lineTo(64, 47);
        ctx.lineTo(44, 51);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffd875';
        ctx.beginPath(); ctx.arc(64, 45, 2.2, 0, Math.PI * 2); ctx.fill();

        // 6. РОВНЫЙ, РЕШИТЕЛЬНЫЙ ВЗГЛЯД, БРОВИ И ШРАМ НА СКУЛЕ (Без раскосости)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(54, 61, 4.8, 2.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 61, 4.8, 2.2, 0, 0, Math.PI * 2); ctx.fill();

        // Холодная стальная радужка
        ctx.fillStyle = '#475569';
        ctx.beginPath(); ctx.arc(54, 61, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 61, 2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(54, 61, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 61, 1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(54.8, 60.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74.8, 60.2, 0.7, 0, Math.PI * 2); ctx.fill();

        // Тёмные ресницы по верхнему веку
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(49, 60.5); ctx.quadraticCurveTo(54, 58.2, 59, 60.5);
        ctx.moveTo(69, 60.5); ctx.quadraticCurveTo(74, 58.2, 79, 60.5);
        ctx.stroke();

        // Ровные собранные брови воительницы
        ctx.strokeStyle = '#3b1c0c';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(48, 56); ctx.lineTo(59, 57);
        ctx.moveTo(80, 56); ctx.lineTo(69, 57);
        ctx.stroke();

        // Тонкий боевой шрам на правой скуле
        ctx.strokeStyle = '#b91c1c';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(73, 66);
        ctx.lineTo(79, 73);
        ctx.stroke();

        // Прямой нос и твёрдая полуулыбка
        ctx.strokeStyle = '#d49d7c';
        ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(64, 58); ctx.lineTo(62.5, 73); ctx.lineTo(66, 73); ctx.stroke();

        ctx.fillStyle = '#c86464';
        ctx.beginPath();
        ctx.ellipse(64, 82, 4.8, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // 7. СТАЛЬНОЙ ГЕРАЛЬДИЧЕСКИЙ ЩИТ НА ПЕРЕДНЕМ ПЛАНЕ (Слева снизу)
        ctx.save();
        ctx.translate(27, 104);
        ctx.rotate((Math.PI / 180) * -8);

        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(-16, -20);
        ctx.lineTo(16, -20);
        ctx.lineTo(14, 6);
        ctx.lineTo(0, 24);
        ctx.lineTo(-14, 6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Багровая полоса и стальной умбон по центру щита
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(-2.5, -18, 5, 39);

        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath(); ctx.arc(0, -1, 4, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 22);
        ctx.quadraticCurveTo(44, 24, 41, 52);
        ctx.lineTo(47, 79);
        ctx.lineTo(64, 97);
        ctx.lineTo(64, 128);
        ctx.lineTo(14, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },



    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ГЛАВАРЯ БАНДИТОВ
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateBanditCaptainAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ВЕТВИСТЫЕ РОГА ОЛЕНЕГО ЧЕРЕПА И ДЛИННЫЙ ЛУК ЗА СПИНОЙ (Задний план)
        // Изогнутый композитный лук за правым плечом
        ctx.strokeStyle = '#5c3a21';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(96, 20);
        ctx.bezierCurveTo(122, 48, 122, 92, 98, 124);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(226, 232, 240, 0.65)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(96, 22);
        ctx.lineTo(98, 122);
        ctx.stroke();

        // Мощные костяные рога маска-шлема Рогача
        ctx.strokeStyle = '#d6ceb8';
        ctx.lineWidth = 4.2;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        // Левый рог
        ctx.moveTo(46, 36);
        ctx.quadraticCurveTo(28, 24, 24, 6);
        ctx.moveTo(37, 27);
        ctx.lineTo(18, 22);
        ctx.moveTo(31, 18);
        ctx.lineTo(16, 10);
        ctx.moveTo(27, 12);
        ctx.lineTo(34, 4);
        // Правый рог
        ctx.moveTo(82, 36);
        ctx.quadraticCurveTo(100, 24, 104, 6);
        ctx.moveTo(91, 27);
        ctx.lineTo(110, 22);
        ctx.moveTo(97, 18);
        ctx.lineTo(112, 10);
        ctx.moveTo(101, 12);
        ctx.lineTo(94, 4);
        ctx.stroke();

        // 2. ТЯЖЁЛАЯ МЕХОВАЯ ШКУРА И КОЖАНАЯ БРОНЯ НА ПЛЕЧАХ
        ctx.fillStyle = '#29221e';
        ctx.beginPath();
        ctx.moveTo(12, 128);
        ctx.quadraticCurveTo(24, 88, 64, 88);
        ctx.quadraticCurveTo(104, 88, 116, 128);
        ctx.closePath();
        ctx.fill();

        // Взъерошенные клочья серо-бурого меха на плечах
        ctx.fillStyle = '#473c35';
        ctx.beginPath();
        ctx.moveTo(20, 96); ctx.lineTo(10, 86); ctx.lineTo(28, 86);
        ctx.lineTo(42, 94); ctx.lineTo(86, 94); ctx.lineTo(100, 86);
        ctx.lineTo(118, 86); ctx.lineTo(108, 96);
        ctx.lineTo(114, 114); ctx.lineTo(14, 114);
        ctx.closePath();
        ctx.fill();

        // Костяные пряжки-клыки на меховом плаще
        ctx.fillStyle = '#e8e0cf';
        ctx.beginPath(); ctx.moveTo(36, 102); ctx.lineTo(42, 114); ctx.lineTo(44, 101); ctx.fill();
        ctx.beginPath(); ctx.moveTo(92, 102); ctx.lineTo(86, 114); ctx.lineTo(84, 101); ctx.fill();

        // 3. НИЖНЯЯ ПОЛОВИНА ЛИЦА И ВЗЪЕРОШЕННАЯ БОРОДА СО ШРАМАМИ
        ctx.fillStyle = '#cf9778';
        ctx.beginPath();
        ctx.moveTo(42, 52);
        ctx.lineTo(86, 52);
        ctx.lineTo(84, 84);
        ctx.lineTo(64, 102);
        ctx.lineTo(44, 84);
        ctx.closePath();
        ctx.fill();

        // Длинные спутанные пряди тёмных волос из-под шлема
        ctx.fillStyle = '#1f1814';
        ctx.beginPath();
        ctx.moveTo(41, 48); ctx.quadraticCurveTo(34, 72, 38, 98); ctx.lineTo(44, 92);
        ctx.moveTo(87, 48); ctx.quadraticCurveTo(94, 72, 90, 98); ctx.lineTo(84, 92);
        ctx.fill();

        // Густая, грубая, нечёсаная борода и усы
        ctx.fillStyle = '#2b211b';
        ctx.beginPath();
        ctx.moveTo(42, 74);
        ctx.lineTo(36, 98);
        ctx.lineTo(48, 122);
        ctx.lineTo(64, 126);
        ctx.lineTo(80, 122);
        ctx.lineTo(92, 98);
        ctx.lineTo(86, 74);
        ctx.quadraticCurveTo(64, 86, 42, 74);
        ctx.closePath();
        ctx.fill();

        // Суровые опущенные усы и угрюмый рот
        ctx.fillStyle = '#1c1511';
        ctx.beginPath();
        ctx.moveTo(48, 78);
        ctx.quadraticCurveTo(64, 73, 80, 78);
        ctx.lineTo(82, 87);
        ctx.quadraticCurveTo(64, 81, 46, 87);
        ctx.closePath();
        ctx.fill();

        // 4. РОВНЫЙ, ТЯЖЁЛЫЙ И МРАЧНЫЙ ВЗГЛЯД (Без раскосости)
        // Тёмные круги-тени под глазами
        ctx.fillStyle = 'rgba(28, 20, 16, 0.42)';
        ctx.beginPath(); ctx.ellipse(52, 62, 6.5, 3.8, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(76, 62, 6.5, 3.8, 0, 0, Math.PI * 2); ctx.fill();

        // Глаза строго на одной горизонтальной оси
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath(); ctx.ellipse(52, 61, 4.6, 2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(76, 61, 4.6, 2, 0, 0, Math.PI * 2); ctx.fill();

        // Холодная стальная радужка
        ctx.fillStyle = '#64748b';
        ctx.beginPath(); ctx.arc(52, 61, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 61, 1.8, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(52, 61, 0.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 61, 0.9, 0, Math.PI * 2); ctx.fill();

        // Боевой шрам через левую щеку
        ctx.strokeStyle = '#8f2d2d';
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(47, 64);
        ctx.lineTo(54, 76);
        ctx.stroke();

        // Обветренный нос
        ctx.fillStyle = '#b57b5c';
        ctx.beginPath();
        ctx.moveTo(64, 58);
        ctx.lineTo(68, 73);
        ctx.quadraticCurveTo(64, 76, 60, 73);
        ctx.closePath();
        ctx.fill();

        // 5. КОСТЯНОЙ ОЛЕНИЙ ЧЕРЕП-ШЛЕМ РОГАЧА (На верхней половине головы)
        ctx.fillStyle = '#ede6d6';
        ctx.strokeStyle = '#5c5343';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(39, 54);
        ctx.quadraticCurveTo(42, 26, 64, 24); // Купол черепа
        ctx.quadraticCurveTo(86, 26, 89, 54);
        ctx.lineTo(83, 58);
        ctx.lineTo(72, 53);
        ctx.lineTo(64, 62); // Костяной наносник черепа между глаз
        ctx.lineTo(56, 53);
        ctx.lineTo(45, 58);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Чёрные глазницы оленьего черепа на лбу шлема и трещина кости
        ctx.fillStyle = '#1c1713';
        ctx.beginPath(); ctx.ellipse(52, 43, 5, 3.6, -0.25, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(76, 43, 5, 3.6, 0.25, 0, Math.PI * 2); ctx.fill();

        // Черепной шов по центру лба
        ctx.strokeStyle = '#786e5c';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(64, 25);
        ctx.lineTo(63, 34);
        ctx.lineTo(65, 42);
        ctx.lineTo(64, 58);
        ctx.stroke();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 24);
        ctx.quadraticCurveTo(42, 26, 39, 54);
        ctx.lineTo(44, 84);
        ctx.lineTo(36, 98);
        ctx.lineTo(48, 122);
        ctx.lineTo(64, 126);
        ctx.lineTo(64, 128);
        ctx.lineTo(12, 128);
        ctx.closePath();
        ctx.fill();

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
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ДРЕВНЕГО ДРАКОНА (С РАСПАХНУТЫМИ КРЫЛЬЯМИ И ОГНЁМ)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateDragonAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. РАСПАХНУТЫЕ ПЕРЕПОНЧАТЫЕ КРЫЛЬЯ ДРЕВНЕГО ДРАКОНА (Задний план справа и сверху)
        // Дальнее левое крыло (выглядывает сверху из-за гребня)
        ctx.fillStyle = '#5c1414';
        ctx.beginPath();
        ctx.moveTo(62, 46);
        ctx.lineTo(48, 10);
        ctx.quadraticCurveTo(64, 18, 76, 12);
        ctx.quadraticCurveTo(84, 22, 94, 20);
        ctx.lineTo(80, 52);
        ctx.closePath();
        ctx.fill();

        // Костяной луч и коготь дальнего крыла
        ctx.strokeStyle = '#2b0909';
        ctx.lineWidth = 2.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(62, 46);
        ctx.lineTo(48, 10);
        ctx.moveTo(48, 10);
        ctx.lineTo(44, 6);
        ctx.stroke();

        // Ближнее правое крыло (широко раскрыто в правую сторону)
        ctx.fillStyle = '#7a1c1c';
        ctx.beginPath();
        ctx.moveTo(80, 72);
        ctx.lineTo(108, 18); // Верхний сгиб крыла
        ctx.quadraticCurveTo(116, 38, 125, 42);
        ctx.quadraticCurveTo(116, 56, 124, 68);
        ctx.quadraticCurveTo(112, 78, 118, 94);
        ctx.quadraticCurveTo(102, 94, 92, 104);
        ctx.closePath();
        ctx.fill();

        // Огненно-оранжевый отблеск на перепонке крыла
        ctx.fillStyle = '#a82828';
        ctx.beginPath();
        ctx.moveTo(84, 72);
        ctx.lineTo(108, 26);
        ctx.lineTo(116, 54);
        ctx.lineTo(94, 86);
        ctx.closePath();
        ctx.fill();

        // Костяные лучи-пальцы правого крыла
        ctx.strokeStyle = '#2b0909';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(80, 72);
        ctx.lineTo(108, 18); // Главная крыльевая кость
        ctx.moveTo(108, 18);
        ctx.lineTo(124, 42); // Верхний луч
        ctx.moveTo(100, 36);
        ctx.lineTo(123, 68); // Средний луч
        ctx.moveTo(92, 52);
        ctx.lineTo(117, 93); // Нижний луч
        ctx.stroke();

        // Острый костяной коготь на сгибе крыла
        ctx.fillStyle = '#f5eedc';
        ctx.beginPath();
        ctx.moveTo(106, 18);
        ctx.lineTo(106, 9);
        ctx.lineTo(111, 17);
        ctx.closePath();
        ctx.fill();

        // 2. КОРОНА ИЗ ДРЕВНИХ РОГОВ И СПИННЫЕ ШИПЫ (Задний план головы)
        ctx.fillStyle = '#29221e';
        // Верхний массивный загнутый рог
        ctx.beginPath();
        ctx.moveTo(66, 40);
        ctx.bezierCurveTo(78, 16, 98, 12, 106, 22);
        ctx.bezierCurveTo(94, 20, 84, 28, 76, 46);
        ctx.closePath();
        ctx.fill();

        // Нижний скуловой рог
        ctx.fillStyle = '#1f1916';
        ctx.beginPath();
        ctx.moveTo(76, 52);
        ctx.quadraticCurveTo(96, 44, 108, 38);
        ctx.lineTo(82, 62);
        ctx.closePath();
        ctx.fill();

        // Ребристые насечки на главном роге
        ctx.strokeStyle = '#5c4f46';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(77, 32); ctx.lineTo(81, 37);
        ctx.moveTo(85, 25); ctx.lineTo(89, 30);
        ctx.moveTo(93, 19); ctx.lineTo(96, 24);
        ctx.stroke();

        // 3. МОЩНАЯ БРОНИРОВАННАЯ ШЕЯ И ЗОЛОТИСТЫЕ ГРУДНЫЕ ПЛАСТИНЫ
        ctx.fillStyle = '#6e1414';
        ctx.beginPath();
        ctx.moveTo(56, 74);
        ctx.quadraticCurveTo(88, 78, 102, 128);
        ctx.lineTo(30, 128);
        ctx.quadraticCurveTo(40, 98, 48, 84);
        ctx.closePath();
        ctx.fill();

        // Ребристые охристо-золотые пластины на груди и горле
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.moveTo(44, 88);
        ctx.quadraticCurveTo(36, 108, 34, 128);
        ctx.lineTo(66, 128);
        ctx.quadraticCurveTo(62, 106, 58, 88);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(41, 100); ctx.quadraticCurveTo(50, 103, 60, 100);
        ctx.moveTo(38, 112); ctx.quadraticCurveTo(50, 115, 63, 112);
        ctx.moveTo(36, 123); ctx.quadraticCurveTo(50, 126, 65, 123);
        ctx.stroke();

        // 4. ВЕРХНЯЯ ЧЕЛЮСТЬ И ЧЕРЕП ДРЕВНЕГО ДРАКОНА В ПРОФИЛЬ ВЛЕВО
        ctx.fillStyle = '#991b1b';
        ctx.beginPath();
        ctx.moveTo(82, 48); // Затылок
        ctx.lineTo(60, 34); // Надбровный гребень
        ctx.lineTo(10, 50); // Мощная морда влево
        ctx.lineTo(14, 62); // Верхняя губа
        ctx.lineTo(54, 70); // Угол пасти
        ctx.lineTo(80, 72); // Скула
        ctx.closePath();
        ctx.fill();

        // Огненно-алые щитки вдоль спинки носа и носовой рог
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.moveTo(16, 51);
        ctx.lineTo(48, 42);
        ctx.lineTo(44, 47);
        ctx.lineTo(18, 55);
        ctx.closePath();
        ctx.fill();

        // Костяной рог на кончике носа
        ctx.fillStyle = '#e8e0cf';
        ctx.beginPath();
        ctx.moveTo(14, 50);
        ctx.lineTo(8, 41);
        ctx.lineTo(20, 48);
        ctx.closePath();
        ctx.fill();

        // 5. РАСПАХНУТАЯ ПАСТЬ, ВЫРЫВАЮЩЕЕСЯ ПЛАМЯ И НИЖНЯЯ ЧЕЛЮСТЬ
        // Раскалённая глотка дракона
        ctx.fillStyle = '#450a0a';
        ctx.beginPath();
        ctx.moveTo(14, 61);
        ctx.lineTo(58, 70);
        ctx.lineTo(22, 88);
        ctx.lineTo(18, 81);
        ctx.lineTo(42, 71);
        ctx.closePath();
        ctx.fill();

        // Язык пламени, вырывающийся из глубины пасти
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(46, 71);
        ctx.quadraticCurveTo(28, 71, 8, 73);
        ctx.quadraticCurveTo(24, 78, 48, 76);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.moveTo(44, 72);
        ctx.quadraticCurveTo(30, 72, 16, 73);
        ctx.quadraticCurveTo(28, 76, 45, 74);
        ctx.closePath();
        ctx.fill();

        // Нижняя челюсть
        ctx.fillStyle = '#7f1d1d';
        ctx.beginPath();
        ctx.moveTo(54, 69);
        ctx.lineTo(18, 82);
        ctx.lineTo(24, 91);
        ctx.lineTo(62, 88);
        ctx.lineTo(80, 72);
        ctx.closePath();
        ctx.fill();

        // 6. ОСТРЫЕ БЕЛЫЕ КЛЫКИ В ПАСТИ
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.moveTo(16, 61); ctx.lineTo(19, 69); ctx.lineTo(22, 62); ctx.fill();
        ctx.beginPath(); ctx.moveTo(25, 63); ctx.lineTo(28, 70); ctx.lineTo(31, 64); ctx.fill();
        ctx.beginPath(); ctx.moveTo(34, 65); ctx.lineTo(37, 71); ctx.lineTo(40, 66); ctx.fill();
        ctx.beginPath(); ctx.moveTo(43, 67); ctx.lineTo(46, 72); ctx.lineTo(49, 68); ctx.fill();

        ctx.beginPath(); ctx.moveTo(20, 82); ctx.lineTo(23, 75); ctx.lineTo(26, 80); ctx.fill();
        ctx.beginPath(); ctx.moveTo(29, 79); ctx.lineTo(32, 73); ctx.lineTo(35, 77); ctx.fill();
        ctx.beginPath(); ctx.moveTo(38, 76); ctx.lineTo(41, 71); ctx.lineTo(44, 74); ctx.fill();

        // 7. ПЫЛАЮЩИЙ ЗОЛОТОЙ ГЛАЗ ДРЕВНЕГО ДРАКОНА
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.moveTo(48, 49);
        ctx.lineTo(62, 44);
        ctx.lineTo(57, 54);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(54, 46, 1.5, 6);

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(53, 48, 1, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#450a0a';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(45, 46);
        ctx.lineTo(63, 42);
        ctx.stroke();

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень вдоль нижней челюсти и шеи)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(18, 82);
        ctx.lineTo(62, 88);
        ctx.lineTo(80, 72);
        ctx.lineTo(102, 128);
        ctx.lineTo(30, 128);
        ctx.lineTo(48, 86);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },





    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ БОЛОТНОГО ТРОЛЛЯ (ДЕТАЛИЗИРОВАННЫЙ РЕГЕНЕРАТОР)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateTrollAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. СПУТАННАЯ ГРИВА ИЗ ВОЛОС И БОЛОТНОЙ ТИНЫ НА ЗАДНЕМ ПЛАНЕ
        ctx.fillStyle = '#182419';
        ctx.beginPath();
        ctx.moveTo(32, 46);
        ctx.quadraticCurveTo(18, 86, 20, 128);
        ctx.lineTo(108, 128);
        ctx.quadraticCurveTo(110, 86, 96, 46);
        ctx.closePath();
        ctx.fill();

        // Взъерошенные космы на макушке с пучками болотного мха
        ctx.fillStyle = '#223324';
        ctx.beginPath();
        ctx.moveTo(42, 36); ctx.lineTo(34, 16); ctx.lineTo(52, 28);
        ctx.lineTo(62, 12); ctx.lineTo(70, 28); ctx.lineTo(84, 14);
        ctx.lineTo(82, 34); ctx.lineTo(96, 26); ctx.lineTo(88, 44);
        ctx.closePath();
        ctx.fill();

        // 2. ЖИЛИСТЫЕ ПЛЕЧИ ТРОЛЛЯ И ОЖЕРЕЛЬЕ ИЗ КОСТЕЙ
        ctx.fillStyle = '#2e4d32';
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.quadraticCurveTo(28, 92, 64, 92);
        ctx.quadraticCurveTo(100, 92, 114, 128);
        ctx.closePath();
        ctx.fill();

        // Грубый кожаный ремень и костяные клыки на груди
        ctx.strokeStyle = '#3b2416';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(34, 102);
        ctx.quadraticCurveTo(64, 118, 94, 102);
        ctx.stroke();

        ctx.fillStyle = '#e8e0cf';
        ctx.beginPath(); ctx.moveTo(46, 107); ctx.lineTo(49, 120); ctx.lineTo(53, 109); ctx.fill();
        ctx.beginPath(); ctx.moveTo(61, 111); ctx.lineTo(64, 125); ctx.lineTo(67, 111); ctx.fill();
        ctx.beginPath(); ctx.moveTo(82, 107); ctx.lineTo(79, 120); ctx.lineTo(75, 109); ctx.fill();

        // 3. ДЛИННЫЕ ЗАОСТРЁННЫЕ УШИ ТРОЛЛЯ С ЗАЗУБРИНАМИ
        ctx.fillStyle = '#385e3d';
        ctx.beginPath();
        ctx.moveTo(41, 56);
        ctx.lineTo(8, 44);
        ctx.lineTo(16, 56);
        ctx.lineTo(11, 61);
        ctx.lineTo(41, 74);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(87, 56);
        ctx.lineTo(120, 44);
        ctx.lineTo(87, 74);
        ctx.closePath();
        ctx.fill();

        // 4. ВЫТЯНУТАЯ КОСТЛЯВАЯ ГОЛОВА И МАССИВНАЯ ЧЕЛЮСТЬ
        ctx.fillStyle = '#437049';
        ctx.beginPath();
        ctx.moveTo(42, 42);
        ctx.quadraticCurveTo(64, 28, 86, 42);
        ctx.lineTo(92, 72);
        ctx.lineTo(82, 98);
        ctx.lineTo(64, 108);
        ctx.lineTo(46, 98);
        ctx.lineTo(36, 72);
        ctx.closePath();
        ctx.fill();

        // Световая рельефная зона на скулах и подбородке
        ctx.fillStyle = '#558a5c';
        ctx.beginPath();
        ctx.moveTo(47, 64);
        ctx.lineTo(81, 64);
        ctx.lineTo(78, 94);
        ctx.lineTo(64, 104);
        ctx.lineTo(50, 94);
        ctx.closePath();
        ctx.fill();

        // Кожные наросты-бородавки и шрамы регенерации на щеке
        ctx.fillStyle = '#29472d';
        ctx.beginPath(); ctx.arc(44, 72, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(84, 76, 3, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#75a87c';
        ctx.lineWidth = 1.3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(74, 66); ctx.lineTo(82, 74);
        ctx.stroke();

        // 5. ГЛУБОКО ПОСАЖЕННЫЕ СВИРЕПЫЕ ГЛАЗА И ТЯЖЁЛЫЙ НАДБРОВНЫЙ ВАЛИК
        ctx.fillStyle = '#233b26';
        ctx.beginPath();
        ctx.moveTo(40, 49);
        ctx.quadraticCurveTo(64, 55, 88, 49);
        ctx.lineTo(86, 56);
        ctx.quadraticCurveTo(64, 60, 42, 56);
        ctx.closePath();
        ctx.fill();

        // Налитые кровью янтарно-алые глаза
        ctx.fillStyle = '#facc15';
        ctx.beginPath(); ctx.ellipse(51, 58, 5, 2.6, 0.14, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(77, 58, 5, 2.6, -0.14, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#dc2626';
        ctx.beginPath(); ctx.arc(51.5, 58, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76.5, 58, 1.8, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(51.5, 58, 0.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76.5, 58, 0.9, 0, Math.PI * 2); ctx.fill();

        // 6. ОСКАЛЕННАЯ ПАСТЬ С КРИВЫМИ КЛЫКАМИ И ДЛИННЫЙ НОС ТРОЛЛЯ
        // Тёмная глубина пасти
        ctx.fillStyle = '#1f0b0e';
        ctx.beginPath();
        ctx.moveTo(46, 82);
        ctx.quadraticCurveTo(64, 76, 82, 82);
        ctx.lineTo(78, 96);
        ctx.quadraticCurveTo(64, 102, 50, 96);
        ctx.closePath();
        ctx.fill();

        // Частокол кривых острых клыков сверху и снизу
        ctx.fillStyle = '#fef9c3';
        ctx.strokeStyle = '#233b26';
        ctx.lineWidth = 0.9;
        // Верхние зубы
        ctx.beginPath(); ctx.moveTo(49, 82); ctx.lineTo(52, 91); ctx.lineTo(55, 81); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(58, 80); ctx.lineTo(60, 87); ctx.lineTo(62, 80); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(66, 80); ctx.lineTo(68, 87); ctx.lineTo(70, 80); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(79, 82); ctx.lineTo(76, 91); ctx.lineTo(73, 81); ctx.closePath(); ctx.fill(); ctx.stroke();

        // Нижние крупные клыки
        ctx.beginPath(); ctx.moveTo(51, 96); ctx.lineTo(54, 86); ctx.lineTo(57, 96); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(61, 98); ctx.lineTo(64, 90); ctx.lineTo(67, 98); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(77, 96); ctx.lineTo(74, 86); ctx.lineTo(71, 96); ctx.closePath(); ctx.fill(); ctx.stroke();

        // Длинный висячий нос тролля (свисает по центру поверх верхней губы)
        ctx.fillStyle = '#385e3d';
        ctx.strokeStyle = '#1f3622';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(60, 56);
        ctx.lineTo(68, 56);
        ctx.lineTo(71, 79);
        ctx.quadraticCurveTo(64, 86, 57, 79);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Ноздри на кончике длинного носа
        ctx.fillStyle = '#142416';
        ctx.beginPath(); ctx.arc(61, 79, 1.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(67, 79, 1.6, 0, Math.PI * 2); ctx.fill();

        // 7. КОГТИСТАЯ ЛАПА ТРОЛЛЯ НА ПЕРЕДНЕМ ПЛАНЕ (Слева снизу)
        ctx.fillStyle = '#437049';
        ctx.strokeStyle = '#1f3622';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.lineTo(18, 106);
        ctx.lineTo(38, 108);
        ctx.lineTo(36, 128);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Острые тёмно-костяные когти на пальцах
        ctx.fillStyle = '#1c1917';
        [19, 25, 31, 36].forEach((cx, idx) => {
            const topY = 95 - (idx === 1 || idx === 2 ? 3 : 0);
            ctx.beginPath();
            ctx.moveTo(cx - 2, 107);
            ctx.lineTo(cx, topY);
            ctx.lineTo(cx + 2, 107);
            ctx.closePath();
            ctx.fill();
        });

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 12);
        ctx.lineTo(42, 36);
        ctx.lineTo(36, 72);
        ctx.lineTo(46, 98);
        ctx.lineTo(64, 108);
        ctx.lineTo(64, 128);
        ctx.lineTo(14, 128);
        ctx.closePath();
        ctx.fill();

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
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ФЕРМЕРА (СОЛОМЕННАЯ ШЛЯПА, КОЛОСОК И ВИЛЫ)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateFarmerAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. КРЕСТЬЯНСКИЕ ВИЛЫ ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.save();
        ctx.translate(102, 46);
        ctx.rotate((Math.PI / 180) * 24);

        // Деревянный черенок вил
        ctx.strokeStyle = '#6e472b';
        ctx.lineWidth = 4.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, 2);
        ctx.lineTo(0, 92);
        ctx.stroke();

        // Стальная втулка крепления
        ctx.fillStyle = '#475569';
        ctx.fillRect(-3, -2, 6, 7);

        // Изогнутая перекладина и 3 острых зубца вил
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2.4;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(-9, -22);
        ctx.lineTo(-9, -6);
        ctx.quadraticCurveTo(-9, 0, 0, 0);
        ctx.quadraticCurveTo(9, 0, 9, -6);
        ctx.lineTo(9, -22);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -23);
        ctx.stroke();

        // Светлые заточенные кончики зубцов
        ctx.fillStyle = '#e2e8f0';
        [-9, 0, 9].forEach(px => {
            const tipY = px === 0 ? -25 : -24;
            ctx.beginPath();
            ctx.moveTo(px - 1.5, tipY + 4.5);
            ctx.lineTo(px, tipY);
            ctx.lineTo(px + 1.5, tipY + 4.5);
            ctx.closePath();
            ctx.fill();
        });
        ctx.restore();

        // 2. РАБОЧАЯ ЛЬНЯНАЯ РУБАХА И КОМБИНЕЗОН НА МЕДНЫХ ПУГОВИЦАХ
        ctx.fillStyle = '#d6ccc2';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(36, 98);
        ctx.lineTo(92, 98);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        // Отложной воротник рубахи
        ctx.fillStyle = '#ede0d4';
        ctx.beginPath();
        ctx.moveTo(42, 98);
        ctx.lineTo(54, 112);
        ctx.lineTo(64, 102);
        ctx.lineTo(74, 112);
        ctx.lineTo(86, 98);
        ctx.closePath();
        ctx.fill();

        // Грубый рабочий комбинезон-фартук с лямками
        ctx.fillStyle = '#3b5266';
        ctx.beginPath();
        ctx.moveTo(32, 128);
        ctx.lineTo(38, 100);
        ctx.lineTo(48, 100);
        ctx.lineTo(50, 114);
        ctx.lineTo(78, 114);
        ctx.lineTo(80, 100);
        ctx.lineTo(90, 100);
        ctx.lineTo(96, 128);
        ctx.closePath();
        ctx.fill();

        // Медные пуговицы на лямках комбинезона
        ctx.fillStyle = '#d97706';
        ctx.beginPath(); ctx.arc(44, 115, 2.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(84, 115, 2.3, 0, Math.PI * 2); ctx.fill();

        // 3. ШЕЯ, УШИ И ОБВЕТРЕННОЕ ДОБРОДУШНОЕ ЛИЦО ФЕРМЕРА
        ctx.fillStyle = '#d99e7c';
        ctx.fillRect(55, 86, 18, 16);

        ctx.fillStyle = '#e8b496';
        ctx.beginPath();
        ctx.moveTo(44, 50);
        ctx.lineTo(84, 50);
        ctx.lineTo(82, 81);
        ctx.lineTo(64, 98);
        ctx.lineTo(46, 81);
        ctx.closePath();
        ctx.fill();

        // Лёгкая русая щетина на подбородке и щеках
        ctx.fillStyle = 'rgba(120, 75, 42, 0.22)';
        ctx.beginPath();
        ctx.moveTo(46, 75);
        ctx.lineTo(64, 98);
        ctx.lineTo(82, 75);
        ctx.lineTo(81, 82);
        ctx.lineTo(64, 98);
        ctx.lineTo(47, 82);
        ctx.closePath();
        ctx.fill();

        // Непослушные пшенично-русые пряди волос на висках из-под шляпы
        ctx.fillStyle = '#854d27';
        ctx.beginPath();
        ctx.moveTo(43, 48); ctx.lineTo(46, 62); ctx.lineTo(50, 50);
        ctx.moveTo(85, 48); ctx.lineTo(82, 62); ctx.lineTo(78, 50);
        ctx.fill();

        // 4. РОВНЫЙ, ПРИВЕТЛИВЫЙ ВЗГЛЯД И УЛЫБКА С КОЛОСКОМ ПШЕНИЦЫ
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(53, 62, 4.6, 2.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 62, 4.6, 2.2, 0, 0, Math.PI * 2); ctx.fill();

        // Ясные голубые глаза
        ctx.fillStyle = '#0284c7';
        ctx.beginPath(); ctx.arc(53, 62, 1.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 62, 1.9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(53, 62, 0.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 62, 0.9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(53.8, 61.2, 0.65, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75.8, 61.2, 0.65, 0, Math.PI * 2); ctx.fill();

        // Ровные добродушные брови
        ctx.strokeStyle = '#5c3416';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(47, 56.5); ctx.quadraticCurveTo(53, 55, 59, 57);
        ctx.moveTo(81, 56.5); ctx.quadraticCurveTo(75, 55, 69, 57);
        ctx.stroke();

        // Крупный обветренный нос
        ctx.fillStyle = '#d49674';
        ctx.beginPath(); ctx.arc(64, 70, 4.5, 0, Math.PI * 2); ctx.fill();

        // Широкая тёплая улыбка
        ctx.strokeStyle = '#7c3f2c';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(55, 82);
        ctx.quadraticCurveTo(64, 87, 73, 82);
        ctx.stroke();

        // Золотистый колосок пшеницы, зажатый в левом уголке рта
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(56, 83);
        ctx.lineTo(36, 92);
        ctx.stroke();

        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.ellipse(39, 90.5, 4.5, 2.2, -0.4, 0, Math.PI * 2);
        ctx.fill();

        // 5. ПЛЕТЁНАЯ СОЛОМЕННАЯ ШЛЯПА С СИНЕЙ ЛЕНТОЙ И ЗАЗУБРИНОЙ
        ctx.save();
        ctx.translate(64, 46);
        ctx.rotate((Math.PI / 180) * -4);
        ctx.translate(-64, -46);

        // Широкие поля соломенной шляпы (с небольшой крестьянской выемкой справа)
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.ellipse(64, 48, 46, 11, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.ellipse(64, 47, 44, 9.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Округлая тулья шляпы
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(41, 46);
        ctx.quadraticCurveTo(44, 22, 64, 21);
        ctx.quadraticCurveTo(84, 22, 87, 46);
        ctx.closePath();
        ctx.fill();

        // Текстура соломенного плетения (штрихи)
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(48, 32); ctx.lineTo(54, 32);
        ctx.moveTo(68, 28); ctx.lineTo(75, 28);
        ctx.moveTo(56, 37); ctx.lineTo(63, 37);
        ctx.stroke();

        // Синяя тканевая лента вокруг тульи
        ctx.fillStyle = '#1d4ed8';
        ctx.fillRect(41.5, 41, 45, 4.5);
        ctx.restore();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 21);
        ctx.quadraticCurveTo(44, 22, 41, 46);
        ctx.lineTo(18, 48);
        ctx.lineTo(46, 81);
        ctx.lineTo(64, 98);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },





    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ТОРГОВЦА (ДЕТАЛИЗИРОВАННЫЙ КУПЕЦ С КОШЕЛЕМ ЗОЛОТА)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateMerchantAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. БОГАТЫЙ КУПЕЧЕСКИЙ КАФТАН С МЕХОВОЙ ОТОРОЧКОЙ И ЗОЛОТОЙ ЦЕПЬЮ
        ctx.fillStyle = '#1e4620';
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.quadraticCurveTo(30, 96, 64, 96);
        ctx.quadraticCurveTo(98, 96, 114, 128);
        ctx.closePath();
        ctx.fill();

        // Тёплый соболиный меховой воротник кафтана
        ctx.fillStyle = '#4a3219';
        ctx.beginPath();
        ctx.moveTo(28, 102);
        ctx.quadraticCurveTo(64, 118, 100, 102);
        ctx.lineTo(94, 92);
        ctx.quadraticCurveTo(64, 106, 34, 92);
        ctx.closePath();
        ctx.fill();

        // Светлая льняная рубаха в вырезе и массивная золотая купеческая цепь
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(48, 100);
        ctx.lineTo(64, 126);
        ctx.lineTo(80, 100);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(42, 102);
        ctx.quadraticCurveTo(64, 122, 86, 102);
        ctx.stroke();

        // 2. УШИ И КРУГЛОЕ РУМЯНОЕ ЛИЦО КУПЦА
        ctx.fillStyle = '#e5b293';
        ctx.beginPath(); ctx.ellipse(41, 66, 4.5, 7, -0.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(87, 66, 4.5, 7, 0.1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#fbd2b8';
        ctx.beginPath();
        ctx.moveTo(43, 48);
        ctx.lineTo(85, 48);
        ctx.bezierCurveTo(92, 62, 90, 84, 78, 92);
        ctx.quadraticCurveTo(64, 102, 50, 92);
        ctx.bezierCurveTo(38, 84, 36, 62, 43, 48);
        ctx.closePath();
        ctx.fill();

        // Лёгкий румянец на щеках
        ctx.fillStyle = 'rgba(225, 29, 72, 0.14)';
        ctx.beginPath(); ctx.arc(47, 72, 5.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(81, 72, 5.5, 0, Math.PI * 2); ctx.fill();

        // 3. УХОЖЕННАЯ КАШТАНОВАЯ БОРОДКА И ЩЕГОЛЬСКИЕ УСЫ
        ctx.fillStyle = '#5c3a21';
        ctx.beginPath();
        ctx.moveTo(44, 75);
        ctx.quadraticCurveTo(44, 96, 64, 103);
        ctx.quadraticCurveTo(84, 96, 84, 75);
        ctx.quadraticCurveTo(64, 85, 44, 75);
        ctx.closePath();
        ctx.fill();

        // Пышные закрученные усы
        ctx.fillStyle = '#422816';
        ctx.beginPath();
        ctx.moveTo(48, 78);
        ctx.quadraticCurveTo(64, 72, 80, 78);
        ctx.quadraticCurveTo(85, 75, 83, 81);
        ctx.quadraticCurveTo(64, 79, 45, 81);
        ctx.quadraticCurveTo(43, 75, 48, 78);
        ctx.closePath();
        ctx.fill();

        // Хитрая добродушная улыбка под усами
        ctx.strokeStyle = '#8f4738';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(56, 84);
        ctx.quadraticCurveTo(64, 88, 72, 84);
        ctx.stroke();

        // 4. РОВНЫЙ, ЛУКАВЫЙ ВЗГЛЯД И ПРИПОДНЯТАЯ БРОВЬ
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(53, 61, 4.6, 2.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 61, 4.6, 2.2, 0, 0, Math.PI * 2); ctx.fill();

        // Тёплая орехово-каряя радужка
        ctx.fillStyle = '#78350f';
        ctx.beginPath(); ctx.arc(53, 61, 1.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 61, 1.9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(53, 61, 0.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 61, 0.9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(53.8, 60.2, 0.65, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75.8, 60.2, 0.65, 0, Math.PI * 2); ctx.fill();

        // Ровные брови (правая лукаво приподнята)
        ctx.strokeStyle = '#422816';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(47, 56); ctx.quadraticCurveTo(53, 54.5, 59, 56.5);
        ctx.moveTo(69, 56); ctx.quadraticCurveTo(75, 52, 81, 55);
        ctx.stroke();

        // Округлый нос купца
        ctx.fillStyle = '#e5ad8c';
        ctx.beginPath(); ctx.arc(64, 69, 4.8, 0, Math.PI * 2); ctx.fill();

        // 5. БАРХАТНЫЙ КУПЕЧЕСКИЙ БЕРЕТ С ЗОЛОТОЙ БРОШЬЮ
        ctx.save();
        ctx.translate(64, 44);
        ctx.rotate((Math.PI / 180) * -6);
        ctx.translate(-64, -44);

        // Пышный тёмно-багровый берет
        ctx.fillStyle = '#7f1d1d';
        ctx.beginPath();
        ctx.ellipse(64, 34, 33, 15, 0, 0, Math.PI * 2);
        ctx.fill();

        // Световая складка сверху берета
        ctx.fillStyle = '#991b1b';
        ctx.beginPath();
        ctx.ellipse(68, 32, 24, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Золотой ободок-околыш и драгоценная брошь
        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.moveTo(39, 44);
        ctx.quadraticCurveTo(64, 39, 89, 44);
        ctx.lineTo(87, 49);
        ctx.quadraticCurveTo(64, 44, 41, 49);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#10b981';
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(80, 44, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 6. ТУГОЙ КОЖАНЫЙ КОШЕЛЬ С ЗОЛОТЫМИ МОНЕТАМИ НА ПЕРЕДНЕМ ПЛАНЕ (Слева снизу)
        ctx.save();
        ctx.translate(27, 108);
        ctx.rotate((Math.PI / 180) * -10);

        // Тело кожаного мешочка-кошеля
        ctx.fillStyle = '#78350f';
        ctx.strokeStyle = '#3b1c0a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-7, -10);
        ctx.bezierCurveTo(-16, -2, -16, 16, 0, 17);
        ctx.bezierCurveTo(16, 16, 16, -2, 7, -10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Стянутая горловина и золотой шнурок
        ctx.fillStyle = '#92400e';
        ctx.beginPath();
        ctx.moveTo(-6, -10);
        ctx.lineTo(-10, -18);
        ctx.lineTo(0, -15);
        ctx.lineTo(10, -18);
        ctx.lineTo(6, -10);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-7.5, -10);
        ctx.lineTo(7.5, -10);
        ctx.stroke();

        // Выглядывающие золотые монеты сбоку
        ctx.fillStyle = '#ffd875';
        ctx.strokeStyle = '#8a6421';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(11, 12, 4.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(14, 15, 4.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.restore();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 19);
        ctx.lineTo(31, 34);
        ctx.lineTo(38, 76);
        ctx.lineTo(50, 96);
        ctx.lineTo(14, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },







    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ТРАКТИРНОЙ КУРТИЗАНКИ
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateCourtesanAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЯРКИЕ МЕДНО-РЫЖИЕ ЛОКОНЫ НА ЗАДНЕМ ПЛАНЕ (Хорошо читаются на тёмном фоне)
        ctx.fillStyle = '#a8431b';
        ctx.beginPath();
        ctx.arc(64, 26, 22, 0, Math.PI * 2); // Высокий пучок на макушке
        ctx.arc(34, 54, 17, 0, Math.PI * 2);
        ctx.arc(94, 54, 17, 0, Math.PI * 2);
        ctx.arc(30, 80, 16, 0, Math.PI * 2);
        ctx.arc(98, 80, 16, 0, Math.PI * 2);
        ctx.fill();

        // Золотисто-рыжий контурный отблеск на правой стороне локонов (чтобы не сливались с фоном)
        ctx.fillStyle = '#c95626';
        ctx.beginPath();
        ctx.arc(96, 54, 14, 0, Math.PI * 2);
        ctx.arc(100, 80, 13, 0, Math.PI * 2);
        ctx.fill();

        // 2. ОДЕЖДА: Выдвинута выше в кадр, с глубоким открытым декольте
        // Открытые плечи, грудь и глубокий вырез декольте
        ctx.fillStyle = '#fbd2b8';
        ctx.beginPath();
        ctx.moveTo(18, 128);
        ctx.quadraticCurveTo(28, 88, 64, 88);
        ctx.quadraticCurveTo(100, 88, 110, 128);
        ctx.closePath();
        ctx.fill();

        // Мягкие тени контура декольте (аккуратный flat-объём)
        ctx.strokeStyle = 'rgba(181, 116, 82, 0.45)';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(52, 108);
        ctx.quadraticCurveTo(60, 116, 62, 124);
        ctx.moveTo(76, 108);
        ctx.quadraticCurveTo(68, 116, 66, 124);
        ctx.stroke();

        // Пышные белые рукава-фонарики на спущенных плечах
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.ellipse(23, 106, 16, 11, -0.35, 0, Math.PI * 2);
        ctx.ellipse(105, 106, 16, 11, 0.35, 0, Math.PI * 2);
        ctx.fill();

        // Бордово-алый бархатный корсет с глубоким V-образным вырезом
        ctx.fillStyle = '#881337';
        ctx.beginPath();
        ctx.moveTo(32, 104);
        ctx.quadraticCurveTo(46, 100, 56, 116); // Левая чашка корсета
        ctx.lineTo(64, 124);                    // Глубокая точка выреза по центру
        ctx.lineTo(72, 116);                    // Правая чашка корсета
        ctx.quadraticCurveTo(82, 100, 96, 104);
        ctx.lineTo(104, 128);
        ctx.lineTo(24, 128);
        ctx.closePath();
        ctx.fill();

        // Золотая окантовка глубокого выреза корсета
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(32, 104);
        ctx.quadraticCurveTo(46, 100, 56, 116);
        ctx.lineTo(64, 124);
        ctx.lineTo(72, 116);
        ctx.quadraticCurveTo(82, 100, 96, 104);
        ctx.stroke();

        // 3. ШЕЯ, ЧОКЕР С РУБИНОМ И ЗОЛОТЫЕ СЕРЬГИ-ПОДВЕСКИ
        ctx.fillStyle = '#e8b598';
        ctx.fillRect(55, 76, 18, 16);

        // Тонкий бархатный чокер с золотой оправой и рубином
        ctx.fillStyle = '#4c0519';
        ctx.fillRect(54, 82, 20, 3);
        ctx.fillStyle = '#e11d48';
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(64, 83.5, 2.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Золотые серьги-капли у мочек ушей
        ctx.fillStyle = '#ffd875';
        ctx.beginPath();
        ctx.arc(43, 66, 2.3, 0, Math.PI * 2);
        ctx.arc(85, 66, 2.3, 0, Math.PI * 2);
        ctx.fill();

        // 4. МИЛОВИДНОЕ ЛИЦО С РУМЯНЦЕМ И ЯРКИМИ ПРЯДЯМИ ВОЛОС
        ctx.fillStyle = '#ffedd8';
        ctx.beginPath();
        ctx.moveTo(45, 40);
        ctx.quadraticCurveTo(64, 26, 83, 40);
        ctx.lineTo(81, 70);
        ctx.lineTo(64, 87);
        ctx.lineTo(47, 70);
        ctx.closePath();
        ctx.fill();

        // Мягкий персиково-розовый румянец на щеках
        ctx.fillStyle = 'rgba(225, 29, 72, 0.16)';
        ctx.beginPath(); ctx.arc(50, 63, 5.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(78, 63, 5.5, 0, Math.PI * 2); ctx.fill();

        // Кокетливая маленькая родинка (мушка) на правой щеке
        ctx.fillStyle = '#3b1c14';
        ctx.beginPath(); ctx.arc(76, 68, 1.1, 0, Math.PI * 2); ctx.fill();

        // Передние волны медно-рыжих волос и чёлка на пробор
        ctx.fillStyle = '#b84a1e';
        ctx.beginPath();
        ctx.moveTo(42, 44);
        ctx.quadraticCurveTo(46, 24, 64, 30);
        ctx.quadraticCurveTo(82, 24, 86, 44);
        ctx.quadraticCurveTo(84, 22, 64, 20);
        ctx.quadraticCurveTo(44, 22, 42, 44);
        ctx.closePath();
        ctx.fill();

        // Ниспадающие яркие локоны по бокам лица
        ctx.fillStyle = '#c95626';
        ctx.beginPath();
        ctx.moveTo(44, 38); ctx.quadraticCurveTo(37, 60, 42, 84); ctx.lineTo(48, 79); ctx.quadraticCurveTo(44, 58, 49, 40);
        ctx.moveTo(84, 38); ctx.quadraticCurveTo(91, 60, 86, 84); ctx.lineTo(80, 79); ctx.quadraticCurveTo(84, 58, 79, 40);
        ctx.fill();

        // 5. АЛАЯ РОЗА В ПРИЧЁСКЕ (Справа на виске)
        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.ellipse(81, 27, 6, 3, -0.5, 0, Math.PI * 2);
        ctx.ellipse(89, 35, 6, 3, 0.7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#be123c';
        ctx.beginPath(); ctx.arc(85, 31, 6.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath(); ctx.arc(84.5, 30.5, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#881337';
        ctx.beginPath(); ctx.arc(85, 31, 1.8, 0, Math.PI * 2); ctx.fill();

        // 6. РОВНЫЕ, ВЫРАЗИТЕЛЬНЫЕ ГЛАЗА С РЕСНИЦАМИ И ОЧАРОВАТЕЛЬНАЯ УЛЫБКА
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(54, 53, 4.8, 2.3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 53, 4.8, 2.3, 0, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#92400e';
        ctx.beginPath(); ctx.arc(54, 53, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 53, 2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#1c1917';
        ctx.beginPath(); ctx.arc(54, 53, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 53, 1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(54.8, 52.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74.8, 52.2, 0.7, 0, Math.PI * 2); ctx.fill();

        // Выразительные тёмные стрелки и ресницы
        ctx.strokeStyle = '#1c1917';
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(47.5, 51.5); ctx.quadraticCurveTo(54, 50, 59, 52.5);
        ctx.moveTo(80.5, 51.5); ctx.quadraticCurveTo(74, 50, 69, 52.5);
        ctx.stroke();

        // Изящные приподнятые брови
        ctx.strokeStyle = '#5c2314';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(48, 47.5); ctx.quadraticCurveTo(54, 45.5, 59, 47.5);
        ctx.moveTo(69, 47.5); ctx.quadraticCurveTo(74, 45.5, 80, 47.5);
        ctx.stroke();

        // Изящный носик и алые пухлые губы в улыбке
        ctx.strokeStyle = '#d9a786';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 50); ctx.lineTo(62.5, 64); ctx.lineTo(65.5, 64); ctx.stroke();

        ctx.fillStyle = '#e11d48';
        ctx.beginPath();
        ctx.moveTo(58, 73);
        ctx.quadraticCurveTo(64, 70, 70, 73);
        ctx.quadraticCurveTo(64, 78.5, 58, 73);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#881337';
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(58.5, 73); ctx.quadraticCurveTo(64, 74.5, 69.5, 73);
        ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.beginPath();
        ctx.moveTo(64, 4);
        ctx.arc(64, 26, 22, Math.PI * 1.5, Math.PI, true);
        ctx.lineTo(47, 70);
        ctx.lineTo(64, 87);
        ctx.lineTo(64, 128);
        ctx.lineTo(18, 128);
        ctx.lineTo(34, 54);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },






    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ЛЕСНОГО ОХОТНИКА (РОВНЫЙ ЗОРКИЙ ВЗГЛЯД, КАПЮШОН И ЛУК)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateHunterAvatarDataUrl() {
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
        ctx.moveTo(84, 96);
        ctx.lineTo(98, 62);
        ctx.lineTo(109, 67);
        ctx.lineTo(96, 102);
        ctx.closePath();
        ctx.fill();

        // Оперение стрел в колчане
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath(); ctx.moveTo(97, 63); ctx.lineTo(103, 51); ctx.lineTo(102, 65); ctx.fill();
        ctx.beginPath(); ctx.moveTo(103, 65); ctx.lineTo(111, 54); ctx.lineTo(107, 67); ctx.fill();
        ctx.beginPath(); ctx.moveTo(107, 67); ctx.lineTo(116, 58); ctx.lineTo(110, 69); ctx.fill();

        // 2. ЗАДНИЙ КОНТУР ЛЕСНОГО КАПЮШОНА И ПЛАЩА С МЕХОМ
        ctx.fillStyle = '#143020';
        ctx.beginPath();
        ctx.moveTo(32, 66);
        ctx.quadraticCurveTo(36, 22, 64, 18);
        ctx.quadraticCurveTo(92, 22, 96, 66);
        ctx.lineTo(90, 96);
        ctx.lineTo(38, 96);
        ctx.closePath();
        ctx.fill();

        // Хвойный плащ следопыта
        ctx.fillStyle = '#1e462f';
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.lineTo(34, 96);
        ctx.lineTo(94, 96);
        ctx.lineTo(114, 128);
        ctx.closePath();
        ctx.fill();

        // Тёплая меховая оторочка на плечах
        ctx.fillStyle = '#4a3525';
        ctx.beginPath();
        ctx.moveTo(28, 102);
        ctx.quadraticCurveTo(64, 114, 100, 102);
        ctx.lineTo(94, 92);
        ctx.quadraticCurveTo(64, 102, 34, 92);
        ctx.closePath();
        ctx.fill();

        // Кожаный ремень колчана и латунная пряжка на груди
        ctx.fillStyle = '#3b2416';
        ctx.beginPath();
        ctx.moveTo(86, 98);
        ctx.lineTo(54, 128);
        ctx.lineTo(68, 128);
        ctx.lineTo(96, 102);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.8;
        ctx.strokeRect(72, 111, 8, 7);

        // 3. ОБВЕТРЕННОЕ ЛИЦО ОХОТНИКА С РУСОЙ БОРОДКОЙ
        ctx.fillStyle = '#e0ac8b';
        ctx.beginPath();
        ctx.moveTo(43, 50);
        ctx.lineTo(85, 50);
        ctx.lineTo(83, 82);
        ctx.lineTo(64, 100);
        ctx.lineTo(45, 82);
        ctx.closePath();
        ctx.fill();

        // Тёмно-русые пряди волос на висках из-под капюшона
        ctx.fillStyle = '#4a321f';
        ctx.beginPath();
        ctx.moveTo(43, 48); ctx.lineTo(47, 62); ctx.lineTo(51, 50);
        ctx.moveTo(85, 48); ctx.lineTo(81, 62); ctx.lineTo(77, 50);
        ctx.fill();

        // Короткая ухоженная борода и усы следопыта
        ctx.fillStyle = '#5c3d26';
        ctx.beginPath();
        ctx.moveTo(44, 74);
        ctx.quadraticCurveTo(44, 94, 64, 102);
        ctx.quadraticCurveTo(84, 94, 84, 74);
        ctx.quadraticCurveTo(64, 84, 44, 74);
        ctx.closePath();
        ctx.fill();

        // Аккуратные усы
        ctx.fillStyle = '#422b1a';
        ctx.beginPath();
        ctx.moveTo(50, 78);
        ctx.quadraticCurveTo(64, 73, 78, 78);
        ctx.lineTo(79, 82);
        ctx.quadraticCurveTo(64, 79, 49, 82);
        ctx.closePath();
        ctx.fill();

        // 4. РОВНЫЙ, ЗОРКИЙ ВЗГЛЯД СЛЕДОПЫТА (Без раскосости)
        // Глаза строго на одной горизонтальной оси
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(53, 61, 4.6, 2.1, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 61, 4.6, 2.1, 0, 0, Math.PI * 2); ctx.fill();

        // Ясная лесная зелёно-каряя радужка
        ctx.fillStyle = '#2e7d32';
        ctx.beginPath(); ctx.arc(53, 61, 1.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 61, 1.9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(53, 61, 0.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 61, 0.9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(53.8, 60.2, 0.65, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75.8, 60.2, 0.65, 0, Math.PI * 2); ctx.fill();

        // Ровные сосредоточенные брови
        ctx.strokeStyle = '#3b2616';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(47, 56.5); ctx.lineTo(59, 57);
        ctx.moveTo(81, 56.5); ctx.lineTo(69, 57);
        ctx.stroke();

        // Прямой нос охотника
        ctx.strokeStyle = '#bd8564';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(64, 58); ctx.lineTo(62.5, 72); ctx.lineTo(66, 72);
        ctx.stroke();

        // 5. ПЕРЕДНИЙ КРАЙ ЛЕСНОГО КАПЮШОНА СО СКЛАДКАМИ
        ctx.fillStyle = '#25573a';
        ctx.beginPath();
        ctx.moveTo(35, 58);
        ctx.quadraticCurveTo(44, 22, 64, 18);
        ctx.quadraticCurveTo(84, 22, 93, 58);
        ctx.lineTo(86, 53);
        ctx.quadraticCurveTo(64, 42, 42, 53);
        ctx.closePath();
        ctx.fill();

        // Световая кромка капюшона
        ctx.strokeStyle = '#3b7d56';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(39, 54);
        ctx.quadraticCurveTo(64, 41, 89, 54);
        ctx.stroke();

        // 6. ДЛИННЫЙ ОХОТНИЧИЙ ЛУК НА ПЕРЕДНЕМ ПЛАНЕ (Слева)
        ctx.strokeStyle = '#784b2a';
        ctx.lineWidth = 3.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(22, 24);
        ctx.bezierCurveTo(6, 54, 6, 94, 22, 124);
        ctx.stroke();

        // Кожаная обмотка рукояти лука
        ctx.strokeStyle = '#2b190d';
        ctx.lineWidth = 4.6;
        ctx.beginPath();
        ctx.moveTo(10, 68);
        ctx.lineTo(10, 80);
        ctx.stroke();

        // Натянутая тетива лука
        ctx.strokeStyle = 'rgba(241, 245, 249, 0.85)';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(22, 25);
        ctx.lineTo(22, 123);
        ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 18);
        ctx.quadraticCurveTo(44, 22, 35, 58);
        ctx.lineTo(45, 82);
        ctx.lineTo(64, 100);
        ctx.lineTo(64, 128);
        ctx.lineTo(14, 128);
        ctx.lineTo(34, 96);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ТЯЖЁЛОГО ВОИНА (ЛАТНЫЙ ШЛЕМ, КЛЕЙМОР И БАШЕННЫЙ ЩИТ)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateHeavyWarriorAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. МАССИВНЫЙ ДВУРУЧНЫЙ КЛЕЙМОР ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.save();
        ctx.translate(102, 54);
        ctx.rotate((Math.PI / 180) * 24);

        // Широкий тяжёлый клинок клеймора
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-5.5, 28);
        ctx.lineTo(-5.5, -42);
        ctx.lineTo(0, -55);
        ctx.lineTo(5.5, -42);
        ctx.lineTo(5.5, 28);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Светлая полированная грань и кровосток
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(0, -55);
        ctx.lineTo(5.5, -42);
        ctx.lineTo(5.5, 28);
        ctx.lineTo(0, 28);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-1, -36, 2, 58);

        // Мощная кованая гарда клеймора
        ctx.fillStyle = '#94a3b8';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-16, 22);
        ctx.lineTo(16, 22);
        ctx.lineTo(14, 28);
        ctx.lineTo(-14, 28);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 2. ТЁМНО-БАГРОВЫЙ ПЛАЩ И ТЯЖЁЛЫЕ МНОГОСЛОЙНЫЕ ЛАТЫ
        ctx.fillStyle = '#5c1414';
        ctx.beginPath();
        ctx.moveTo(10, 128);
        ctx.lineTo(28, 92);
        ctx.lineTo(100, 92);
        ctx.lineTo(118, 128);
        ctx.closePath();
        ctx.fill();

        // Стальная кираса с центральным ребром жёсткости
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(20, 128);
        ctx.lineTo(36, 94);
        ctx.lineTo(92, 94);
        ctx.lineTo(108, 128);
        ctx.closePath();
        ctx.fill();

        // Световой отблеск на правой половине кирасы
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(64, 94);
        ctx.lineTo(92, 94);
        ctx.lineTo(108, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        // Массивные многослойные латные наплечники с золотым кантом и заклёпками
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(12, 126);
        ctx.quadraticCurveTo(18, 90, 46, 95);
        ctx.lineTo(40, 128);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(116, 126);
        ctx.quadraticCurveTo(110, 90, 82, 95);
        ctx.lineTo(88, 128);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Стальной воротник-горжет под шлемом
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.moveTo(40, 96);
        ctx.lineTo(52, 86);
        ctx.lineTo(76, 86);
        ctx.lineTo(88, 96);
        ctx.closePath();
        ctx.fill();

        // 3. МОЩНЫЙ ЗАКРЫТЫЙ РЫЦАРСКИЙ ШЛЕМ-БАРБЮТ С ГРЕБНЕМ И ЗАКЛЁПКАМИ
        // Купол шлема
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(38, 52);
        ctx.quadraticCurveTo(42, 20, 64, 18);
        ctx.quadraticCurveTo(86, 20, 90, 52);
        ctx.lineTo(86, 86);
        ctx.lineTo(64, 98);
        ctx.lineTo(42, 86);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Световая грань на правой стороне шлема
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.moveTo(64, 19);
        ctx.quadraticCurveTo(85, 21, 89, 52);
        ctx.lineTo(85, 85);
        ctx.lineTo(64, 97);
        ctx.closePath();
        ctx.fill();

        // Центральный кованый гребень на макушке шлема
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(61, 46);
        ctx.lineTo(61, 14);
        ctx.lineTo(67, 14);
        ctx.lineTo(67, 46);
        ctx.closePath();
        ctx.fill();

        // Т-образная смотровая щель забрала
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(43, 52);
        ctx.lineTo(85, 52);
        ctx.lineTo(83, 60);
        ctx.lineTo(68, 60);
        ctx.lineTo(68, 86);
        ctx.lineTo(60, 86);
        ctx.lineTo(60, 60);
        ctx.lineTo(45, 60);
        ctx.closePath();
        ctx.fill();

        // Суровый прищуренный взгляд из глубины забрала
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(48, 55, 8, 2.5);
        ctx.fillRect(72, 55, 8, 2.5);

        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(51, 55, 2.5, 2.5);
        ctx.fillRect(74, 55, 2.5, 2.5);

        // Латунная окантовка забрала и стальные заклёпки на нащёчниках
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(43, 52); ctx.lineTo(85, 52);
        ctx.stroke();

        ctx.fillStyle = '#cbd5e1';
        [, [47, 77], [53, 84],
            , [81, 77], [75, 84]
        ].forEach(([rx, ry]) => {
            ctx.beginPath();
            ctx.arc(rx, ry, 1.4, 0, Math.PI * 2);
            ctx.fill();
        });

        // 4. МАССИВНЫЙ БАШЕННЫЙ ЩИТ НА ПЕРЕДНЕМ ПЛАНЕ (Слева снизу)
        ctx.save();
        ctx.translate(26, 105);
        ctx.rotate((Math.PI / 180) * -6);

        // Стальная окантовка башенного щита
        ctx.fillStyle = '#334155';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.roundRect(-16, -22, 32, 44, 3);
        ctx.fill();
        ctx.stroke();

        // Внутренняя багровая панель щита и золотая крестовая оковка
        ctx.fillStyle = '#7f1d1d';
        ctx.fillRect(-12, -18, 24, 36);

        ctx.fillStyle = '#d4af37';
        ctx.fillRect(-2, -18, 4, 36);
        ctx.fillRect(-12, -2, 24, 4);

        // Выпуклый стальной умбон по центру
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath(); ctx.arc(0, 0, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // 5. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 14);
        ctx.lineTo(61, 14);
        ctx.quadraticCurveTo(42, 20, 38, 52);
        ctx.lineTo(42, 86);
        ctx.lineTo(64, 98);
        ctx.lineTo(64, 128);
        ctx.lineTo(10, 128);
        ctx.closePath();
        ctx.fill();

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
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ОГРА С ДУБИНОЙ (ДЕТАЛИЗИРОВАННЫЙ ВЕЛИКАН)
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

        // 1. МАССИВНАЯ ШИПАСТАЯ ДУБИНА ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.save();
        ctx.translate(102, 54);
        ctx.rotate((Math.PI / 180) * 24);

        // Толстая суковатая дубина, расширяющаяся кверху
        ctx.fillStyle = '#5c3a21';
        ctx.strokeStyle = '#2b190d';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(-4, 48);
        ctx.lineTo(-10, -34);
        ctx.quadraticCurveTo(0, -42, 10, -34);
        ctx.lineTo(4, 48);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Световая древесная грань и трещины коры
        ctx.fillStyle = '#784b2a';
        ctx.beginPath();
        ctx.moveTo(0, 46);
        ctx.lineTo(0, -37);
        ctx.quadraticCurveTo(6, -37, 9, -33);
        ctx.lineTo(3, 46);
        ctx.closePath();
        ctx.fill();

        // Железные обручи и грубые стальные шипы на дубине
        ctx.fillStyle = '#475569';
        ctx.fillRect(-9.5, -24, 19, 4.5);
        ctx.fillRect(-8, -6, 16, 4.5);

        ctx.fillStyle = '#94a3b8';
        ctx.beginPath(); ctx.moveTo(-9.5, -24); ctx.lineTo(-17, -22); ctx.lineTo(-9.5, -19.5); ctx.fill();
        ctx.beginPath(); ctx.moveTo(9.5, -24); ctx.lineTo(17, -22); ctx.lineTo(9.5, -19.5); ctx.fill();
        ctx.beginPath(); ctx.moveTo(-8, -6); ctx.lineTo(-15, -4); ctx.lineTo(-8, -1.5); ctx.fill();
        ctx.beginPath(); ctx.moveTo(8, -6); ctx.lineTo(15, -4); ctx.lineTo(8, -1.5); ctx.fill();
        ctx.restore();

        // 2. МОГУЧИЕ ПЛЕЧИ ОГРА, МЕХОВАЯ ШКУРА И КОЖАНЫЙ РЕМЕНЬ
        ctx.fillStyle = '#8c7258';
        ctx.beginPath();
        ctx.moveTo(10, 128);
        ctx.quadraticCurveTo(26, 88, 64, 88);
        ctx.quadraticCurveTo(102, 88, 118, 128);
        ctx.closePath();
        ctx.fill();

        // Лохматая медвежья шкура, перекинутая через левое плечо
        ctx.fillStyle = '#3b2416';
        ctx.beginPath();
        ctx.moveTo(12, 128);
        ctx.quadraticCurveTo(22, 92, 48, 94);
        ctx.lineTo(66, 128);
        ctx.closePath();
        ctx.fill();

        // Толстый кожаный ремень-портупея с медной пряжкой
        ctx.fillStyle = '#291a10';
        ctx.beginPath();
        ctx.moveTo(32, 98);
        ctx.lineTo(66, 128);
        ctx.lineTo(84, 128);
        ctx.lineTo(46, 94);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2.2;
        ctx.strokeRect(48, 110, 10, 9);

        // 3. ОКРУГЛЫЕ ОТТОПЫРЕННЫЕ УШИ ОГРА
        ctx.fillStyle = '#8c7258';
        ctx.beginPath(); ctx.ellipse(38, 66, 6, 9, -0.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(90, 66, 6, 9, 0.2, 0, Math.PI * 2); ctx.fill();

        // 4. МАССИВНАЯ ГРУША-ГОЛОВА И ТЯЖЁЛАЯ НИЖНЯЯ ЧЕЛЮСТЬ
        ctx.fillStyle = '#a3876a';
        ctx.beginPath();
        ctx.moveTo(44, 42);
        ctx.quadraticCurveTo(64, 30, 84, 42);
        ctx.lineTo(92, 74);
        ctx.lineTo(84, 98);
        ctx.quadraticCurveTo(64, 108, 44, 98);
        ctx.lineTo(36, 74);
        ctx.closePath();
        ctx.fill();

        // Световая зона на массивных щеках и подбородке (flat-объём)
        ctx.fillStyle = '#b89b7d';
        ctx.beginPath();
        ctx.moveTo(46, 68);
        ctx.lineTo(82, 68);
        ctx.lineTo(80, 94);
        ctx.quadraticCurveTo(64, 104, 48, 94);
        ctx.closePath();
        ctx.fill();

        // Редкие сальные космы тёмных волос на макушке
        ctx.strokeStyle = '#1f1712';
        ctx.lineWidth = 2.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(54, 36); ctx.quadraticCurveTo(48, 22, 42, 26);
        ctx.moveTo(64, 34); ctx.quadraticCurveTo(64, 18, 68, 16);
        ctx.moveTo(74, 36); ctx.quadraticCurveTo(80, 22, 86, 26);
        ctx.stroke();

        // 5. ТЯЖЁЛЫЙ НАДБРОВНЫЙ ВАЛИК И СВИРЕПЫЙ РОВНЫЙ ВЗГЛЯД
        ctx.fillStyle = '#755d45';
        ctx.beginPath();
        ctx.moveTo(41, 50);
        ctx.quadraticCurveTo(64, 56, 87, 50);
        ctx.lineTo(85, 57);
        ctx.quadraticCurveTo(64, 61, 43, 57);
        ctx.closePath();
        ctx.fill();

        // Маленькие глубоко посаженные злобные глаза
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(51, 59, 4.2, 2.1, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(77, 59, 4.2, 2.1, 0, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#b91c1c';
        ctx.beginPath(); ctx.arc(51.5, 59, 1.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76.5, 59, 1.7, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(51.5, 59, 0.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76.5, 59, 0.8, 0, Math.PI * 2); ctx.fill();

        // 6. ШИРОКИЙ НОС КАРТОШКОЙ И ПАСТЬ С ВЫСТУПАЮЩИМИ НИЖНИМИ КЛЫКАМИ
        ctx.fillStyle = '#856b50';
        ctx.beginPath();
        ctx.moveTo(60, 58);
        ctx.lineTo(68, 58);
        ctx.lineTo(73, 73);
        ctx.quadraticCurveTo(64, 78, 55, 73);
        ctx.closePath();
        ctx.fill();

        // Ноздри
        ctx.fillStyle = '#3b2c1e';
        ctx.beginPath(); ctx.arc(59, 73, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(69, 73, 1.8, 0, Math.PI * 2); ctx.fill();

        // Угрюмая складка рта
        ctx.strokeStyle = '#3b2c1e';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(47, 86);
        ctx.quadraticCurveTo(64, 81, 81, 86);
        ctx.stroke();

        // Два мощных тупых клыка, торчащих из нижней челюсти вверх
        ctx.fillStyle = '#fef3c7';
        ctx.strokeStyle = '#3b2c1e';
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(48, 86); ctx.lineTo(46, 74); ctx.lineTo(54, 85); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(80, 86); ctx.lineTo(82, 74); ctx.lineTo(74, 85); ctx.closePath(); ctx.fill(); ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 34);
        ctx.quadraticCurveTo(50, 38, 44, 42);
        ctx.lineTo(36, 74);
        ctx.lineTo(44, 98);
        ctx.lineTo(64, 104);
        ctx.lineTo(64, 128);
        ctx.lineTo(10, 128);
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
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ВИВЕРНЫ ЦВЕТЕНИЯ (С РАСПАХНУТЫМИ КРЫЛЬЯМИ)
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

        // 1. РАСПАХНУТЫЕ ПЕРЕПОНЧАТЫЕ КРЫЛЬЯ ВИВЕРНЫ (На заднем плане справа и сверху)
        // Дальнее левое крыло (выглядывает сверху из-за гребня)
        ctx.fillStyle = '#2d6a4f';
        ctx.beginPath();
        ctx.moveTo(64, 48);
        ctx.lineTo(52, 12);
        ctx.quadraticCurveTo(66, 20, 78, 14);
        ctx.quadraticCurveTo(84, 24, 94, 22);
        ctx.lineTo(82, 54);
        ctx.closePath();
        ctx.fill();

        // Костяной луч и коготь дальнего крыла
        ctx.strokeStyle = '#1b4332';
        ctx.lineWidth = 2.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(64, 48);
        ctx.lineTo(52, 12);
        ctx.moveTo(52, 12);
        ctx.lineTo(48, 8);
        ctx.stroke();

        // Ближнее правое крыло (широко раскрыто в правую сторону)
        // Перепонка крыла с фестончатым краем
        ctx.fillStyle = '#40916c';
        ctx.beginPath();
        ctx.moveTo(82, 72);
        ctx.lineTo(108, 22); // Верхний шип-сгиб крыла
        ctx.quadraticCurveTo(116, 40, 125, 44);
        ctx.quadraticCurveTo(116, 58, 124, 68);
        ctx.quadraticCurveTo(112, 78, 118, 92);
        ctx.quadraticCurveTo(102, 92, 94, 102);
        ctx.closePath();
        ctx.fill();

        // Светлая прожилка-лист на перепонке крыла
        ctx.fillStyle = '#52b788';
        ctx.beginPath();
        ctx.moveTo(86, 72);
        ctx.lineTo(108, 30);
        ctx.lineTo(116, 56);
        ctx.lineTo(94, 86);
        ctx.closePath();
        ctx.fill();

        // Костяные лучи-пальцы и коготь на сгибе правого крыла
        ctx.strokeStyle = '#1b4332';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(82, 72);
        ctx.lineTo(108, 22); // Главная крыльевая кость
        ctx.moveTo(108, 22);
        ctx.lineTo(124, 44); // Верхний луч перепонки
        ctx.moveTo(100, 38);
        ctx.lineTo(123, 68); // Средний луч перепонки
        ctx.moveTo(93, 52);
        ctx.lineTo(117, 91); // Нижний луч перепонки
        ctx.stroke();

        // Острый костяной коготь на сгибе крыла
        ctx.fillStyle = '#f5eedc';
        ctx.beginPath();
        ctx.moveTo(106, 22);
        ctx.lineTo(106, 13);
        ctx.lineTo(111, 21);
        ctx.closePath();
        ctx.fill();

        // 2. ЗАГНУТЫЕ НАЗАД РОГА И ЛИСТОВИДНЫЙ ГРЕБЕНЬ-УХО
        ctx.fillStyle = '#3b4a2b';
        ctx.beginPath();
        ctx.moveTo(68, 42);
        ctx.bezierCurveTo(78, 20, 96, 16, 102, 26);
        ctx.bezierCurveTo(92, 24, 82, 32, 76, 48);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#4e7a34';
        ctx.beginPath();
        ctx.moveTo(78, 54);
        ctx.quadraticCurveTo(96, 46, 106, 40);
        ctx.quadraticCurveTo(96, 56, 82, 64);
        ctx.closePath();
        ctx.fill();

        // 3. МОЩНАЯ ИЗОГНУТАЯ ШЕЯ И ЛЕСНОЙ ВЕНОК ЦВЕТЕНИЯ
        ctx.fillStyle = '#2d5a27';
        ctx.beginPath();
        ctx.moveTo(58, 74);
        ctx.quadraticCurveTo(88, 78, 102, 128);
        ctx.lineTo(32, 128);
        ctx.quadraticCurveTo(42, 98, 50, 84);
        ctx.closePath();
        ctx.fill();

        // Светло-салатовые грудные пластины шеи
        ctx.fillStyle = '#74a844';
        ctx.beginPath();
        ctx.moveTo(46, 88);
        ctx.quadraticCurveTo(38, 108, 36, 128);
        ctx.lineTo(66, 128);
        ctx.quadraticCurveTo(62, 106, 58, 88);
        ctx.closePath();
        ctx.fill();

        // Пышный венок из лесных листьев и розовых бутонов на шее
        ctx.fillStyle = '#1e4620';
        ctx.beginPath();
        ctx.ellipse(68, 100, 27, 11, 0.22, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#52b788';
        ctx.beginPath();
        ctx.ellipse(48, 94, 8, 4, -0.4, 0, Math.PI * 2);
        ctx.ellipse(68, 100, 9, 4.5, 0.2, 0, Math.PI * 2);
        ctx.ellipse(88, 106, 8, 4, 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Цветущие розовато-персиковые бутоны в гриве
        ctx.fillStyle = '#f48fb1';
        ctx.beginPath(); ctx.arc(56, 97, 4.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(79, 103, 4.6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffd875';
        ctx.beginPath(); ctx.arc(56, 97, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(79, 103, 1.7, 0, Math.PI * 2); ctx.fill();

        // 4. ВЕРХНЯЯ ЧЕЛЮСТЬ И ЧЕРЕП ВИВЕРНЫ В ПРОФИЛЬ ВЛЕВО
        ctx.fillStyle = '#3a7d34';
        ctx.beginPath();
        ctx.moveTo(82, 50); // Затылок
        ctx.lineTo(62, 36); // Надбровный гребень
        ctx.lineTo(10, 52); // Вытянутая хищная морда влево
        ctx.lineTo(14, 63); // Верхняя губа
        ctx.lineTo(54, 71); // Угол пасти
        ctx.lineTo(80, 73); // Скула
        ctx.closePath();
        ctx.fill();

        // Салатовые чешуйки вдоль гребня носа
        ctx.fillStyle = '#8ac926';
        ctx.beginPath();
        ctx.moveTo(16, 53);
        ctx.lineTo(48, 44);
        ctx.lineTo(44, 49);
        ctx.lineTo(18, 57);
        ctx.closePath();
        ctx.fill();

        // Ноздря на кончике морды
        ctx.fillStyle = '#143312';
        ctx.beginPath(); ctx.arc(17, 54, 1.9, 0, Math.PI * 2); ctx.fill();

        // 5. ШИРОКО РАСПАХНУТАЯ ПАСТЬ, ЯЗЫК И НИЖНЯЯ ЧЕЛЮСТЬ
        ctx.fillStyle = '#2b0d14';
        ctx.beginPath();
        ctx.moveTo(14, 62);
        ctx.lineTo(58, 71);
        ctx.lineTo(22, 88);
        ctx.lineTo(18, 81);
        ctx.lineTo(42, 72);
        ctx.closePath();
        ctx.fill();

        // Мясистый алый язык
        ctx.fillStyle = '#c93b4b';
        ctx.beginPath();
        ctx.moveTo(48, 73);
        ctx.quadraticCurveTo(33, 77, 22, 77);
        ctx.quadraticCurveTo(32, 83, 50, 77);
        ctx.closePath();
        ctx.fill();

        // Нижняя челюсть (опущена вниз в рёве)
        ctx.fillStyle = '#559e42';
        ctx.beginPath();
        ctx.moveTo(54, 70);
        ctx.lineTo(18, 82);
        ctx.lineTo(24, 91);
        ctx.lineTo(62, 88);
        ctx.lineTo(80, 73);
        ctx.closePath();
        ctx.fill();

        // 6. ОСТРЫЕ БЕЛЫЕ КЛЫКИ В РАСКРЫТОЙ ПАСТИ
        ctx.fillStyle = '#ffffff';
        // Верхний ряд зубов
        ctx.beginPath(); ctx.moveTo(16, 62); ctx.lineTo(19, 70); ctx.lineTo(22, 63); ctx.fill();
        ctx.beginPath(); ctx.moveTo(25, 64); ctx.lineTo(28, 71); ctx.lineTo(31, 65); ctx.fill();
        ctx.beginPath(); ctx.moveTo(34, 66); ctx.lineTo(37, 72); ctx.lineTo(40, 67); ctx.fill();
        ctx.beginPath(); ctx.moveTo(43, 68); ctx.lineTo(46, 73); ctx.lineTo(49, 69); ctx.fill();

        // Нижний ряд зубов
        ctx.beginPath(); ctx.moveTo(20, 82); ctx.lineTo(23, 75); ctx.lineTo(26, 80); ctx.fill();
        ctx.beginPath(); ctx.moveTo(29, 79); ctx.lineTo(32, 73); ctx.lineTo(35, 77); ctx.fill();
        ctx.beginPath(); ctx.moveTo(38, 76); ctx.lineTo(41, 71); ctx.lineTo(44, 74); ctx.fill();

        // 7. ХИЩНЫЙ ЯНТАРНО-ЗОЛОТОЙ ГЛАЗ ВИВЕРНЫ
        ctx.fillStyle = '#ffd166';
        ctx.beginPath();
        ctx.moveTo(50, 50);
        ctx.lineTo(64, 46);
        ctx.lineTo(59, 55);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#111a0f';
        ctx.fillRect(56, 47.5, 1.5, 6);

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(55, 49.5, 1, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#1b4318';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(47, 47);
        ctx.lineTo(65, 44);
        ctx.stroke();

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень вдоль нижней челюсти и шеи)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(18, 82);
        ctx.lineTo(62, 88);
        ctx.lineTo(80, 73);
        ctx.lineTo(102, 128);
        ctx.lineTo(32, 128);
        ctx.lineTo(50, 86);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },






    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ТИЛАЦИНА (ДЕТАЛИЗИРОВАННЫЙ СУМЧАТЫЙ ВОЛК)
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

        // 1. ЗАДНИЙ ПЛАН: Мощная шея, загривок и грудь тилацина
        ctx.fillStyle = '#a8763e';
        ctx.beginPath();
        ctx.moveTo(64, 58);
        ctx.quadraticCurveTo(104, 68, 120, 128);
        ctx.lineTo(38, 128);
        ctx.quadraticCurveTo(46, 94, 56, 80);
        ctx.closePath();
        ctx.fill();

        // Светлый кремово-песочный подшёрсток на груди и передней части шеи
        ctx.fillStyle = '#e8cfa6';
        ctx.beginPath();
        ctx.moveTo(52, 88);
        ctx.quadraticCurveTo(72, 92, 82, 128);
        ctx.lineTo(42, 128);
        ctx.quadraticCurveTo(46, 104, 52, 88);
        ctx.closePath();
        ctx.fill();

        // Фирменные тёмно-бурые тигровые полосы на загривке и спине
        ctx.fillStyle = '#3b2313';
        ctx.beginPath();
        // Полоса 1 (верхняя на шее)
        ctx.moveTo(86, 70); ctx.lineTo(103, 76); ctx.lineTo(100, 83); ctx.lineTo(82, 76);
        // Полоса 2
        ctx.moveTo(83, 86); ctx.lineTo(109, 94); ctx.lineTo(107, 102); ctx.lineTo(79, 93);
        // Полоса 3
        ctx.moveTo(80, 102); ctx.lineTo(115, 112); ctx.lineTo(113, 120); ctx.lineTo(76, 109);
        // Полоса 4 (нижняя)
        ctx.moveTo(77, 118); ctx.lineTo(119, 126); ctx.lineTo(118, 128); ctx.lineTo(74, 125);
        ctx.closePath();
        ctx.fill();

        // 2. ОКРУГЛЫЕ СТОЯЧИЕ УШИ СУМЧАТОГО ВОЛКА (Дальнее и ближнее)
        // Дальнее ухо
        ctx.fillStyle = '#946330';
        ctx.beginPath();
        ctx.ellipse(65, 36, 7.5, 12, -0.22, 0, Math.PI * 2);
        ctx.fill();

        // Ближнее ухо
        ctx.fillStyle = '#c48f52';
        ctx.beginPath();
        ctx.ellipse(83, 39, 9, 14, 0.22, 0, Math.PI * 2);
        ctx.fill();

        // Внутренняя тёмная раковина ближнего уха
        ctx.fillStyle = '#4a2e18';
        ctx.beginPath();
        ctx.ellipse(82, 40, 4.8, 8.5, 0.22, 0, Math.PI * 2);
        ctx.fill();

        // 3. ВЫТЯНУТАЯ ВЕРХНЯЯ ЧЕЛЮСТЬ И ЧЕРЕП В ПОЛУОБОРОТ ВЛЕВО
        ctx.fillStyle = '#c99355';
        ctx.beginPath();
        ctx.moveTo(92, 48); // Затылок
        ctx.quadraticCurveTo(72, 34, 52, 42); // Лоб
        ctx.lineTo(15, 56); // Длинная вытянутая морда влево
        ctx.lineTo(17, 67); // Верхняя губа
        ctx.lineTo(68, 74); // Глубокий разрез пасти (знаменитый широкий зев тилацина)
        ctx.lineTo(90, 76); // Скула
        ctx.closePath();
        ctx.fill();

        // Световая зона на спинке носа и скуле
        ctx.fillStyle = '#dead72';
        ctx.beginPath();
        ctx.moveTo(20, 56);
        ctx.lineTo(54, 44);
        ctx.lineTo(60, 50);
        ctx.lineTo(24, 61);
        ctx.closePath();
        ctx.fill();

        // Пушистый светлый подшёрсток на щеке
        ctx.fillStyle = '#e8cfa6';
        ctx.beginPath();
        ctx.moveTo(68, 72);
        ctx.lineTo(92, 74);
        ctx.lineTo(86, 56);
        ctx.quadraticCurveTo(68, 60, 68, 72);
        ctx.closePath();
        ctx.fill();

        // Чёрная мочка носа и складки рычания на переносице
        ctx.fillStyle = '#1a110b';
        ctx.beginPath();
        ctx.moveTo(15, 56);
        ctx.quadraticCurveTo(11, 60, 16, 65);
        ctx.lineTo(22, 60);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#5c381c';
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(31, 54); ctx.lineTo(34, 60);
        ctx.moveTo(37, 52); ctx.lineTo(40, 58);
        ctx.stroke();

        // 4. ШИРОКО РАСПАХНУТАЯ ПАСТЬ ТИЛАЦИНА И НИЖНЯЯ ЧЕЛЮСТЬ
        // Тёмная глубина пасти
        ctx.fillStyle = '#24090d';
        ctx.beginPath();
        ctx.moveTo(17, 66);
        ctx.lineTo(72, 74);
        ctx.lineTo(25, 96);
        ctx.lineTo(21, 88);
        ctx.lineTo(54, 75);
        ctx.closePath();
        ctx.fill();

        // Мясистый алый язык внутри пасти
        ctx.fillStyle = '#b8323f';
        ctx.beginPath();
        ctx.moveTo(60, 77);
        ctx.quadraticCurveTo(40, 82, 27, 83);
        ctx.quadraticCurveTo(38, 88, 62, 80);
        ctx.closePath();
        ctx.fill();

        // Нижняя челюсть (широко отведена вниз)
        ctx.fillStyle = '#b07b42';
        ctx.beginPath();
        ctx.moveTo(68, 73);
        ctx.lineTo(21, 89);
        ctx.lineTo(27, 98);
        ctx.lineTo(70, 92);
        ctx.lineTo(90, 76);
        ctx.closePath();
        ctx.fill();

        // 5. ОСТРЫЕ КЛЫКИ И ЧАСТОКОЛ ХИЩНЫХ ЗУБОВ
        ctx.fillStyle = '#ffffff';
        // Верхние клыки и премоляры
        ctx.beginPath(); ctx.moveTo(20, 66); ctx.lineTo(23, 75); ctx.lineTo(26, 67); ctx.fill();
        ctx.beginPath(); ctx.moveTo(30, 68); ctx.lineTo(33, 75); ctx.lineTo(36, 69); ctx.fill();
        ctx.beginPath(); ctx.moveTo(40, 70); ctx.lineTo(43, 76); ctx.lineTo(46, 71); ctx.fill();
        ctx.beginPath(); ctx.moveTo(50, 71); ctx.lineTo(53, 76); ctx.lineTo(56, 72); ctx.fill();

        // Нижние клыки и премоляры
        ctx.beginPath(); ctx.moveTo(23, 88); ctx.lineTo(26, 80); ctx.lineTo(29, 86); ctx.fill();
        ctx.beginPath(); ctx.moveTo(33, 85); ctx.lineTo(36, 78); ctx.lineTo(39, 83); ctx.fill();
        ctx.beginPath(); ctx.moveTo(43, 81); ctx.lineTo(46, 75); ctx.lineTo(49, 79); ctx.fill();
        ctx.beginPath(); ctx.moveTo(53, 78); ctx.lineTo(56, 73); ctx.lineTo(59, 76); ctx.fill();

        // 6. ХИЩНЫЙ ЯНТАРНЫЙ ГЛАЗ С ТЁМНОЙ ОКАНТОВКОЙ
        ctx.fillStyle = '#2b190d';
        ctx.beginPath();
        ctx.ellipse(57, 51, 6.2, 3.6, -0.15, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(56.5, 51, 2.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#110a06';
        ctx.beginPath();
        ctx.arc(56.5, 51, 1.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(55.5, 50, 0.85, 0, Math.PI * 2);
        ctx.fill();

        // Грозная надбровная складка
        ctx.strokeStyle = '#3b2313';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(50, 47);
        ctx.lineTo(65, 45);
        ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень вдоль нижней челюсти и спины)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(21, 89);
        ctx.lineTo(70, 92);
        ctx.lineTo(90, 76);
        ctx.lineTo(120, 128);
        ctx.lineTo(38, 128);
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

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ПОЛУРОСЛИЦЫ-БАРДА (БЕЗ ШЛЯПЫ, С ЛЮТНЕЙ И САБЛЕЙ)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateHalflingBardAvatarDataUrl() {
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

        // Деревянный гриф и головка с золотыми колками
        ctx.fillStyle = '#4e342e';
        ctx.fillRect(-3.5, -60, 7, 44);

        ctx.fillStyle = '#ffd875';
        ctx.beginPath();
        ctx.arc(-5.5, -54, 1.5, 0, Math.PI * 2);
        ctx.arc(-5.5, -47, 1.5, 0, Math.PI * 2);
        ctx.arc(5.5, -54, 1.5, 0, Math.PI * 2);
        ctx.arc(5.5, -47, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Грушевидный корпус лютни
        ctx.fillStyle = '#a0522d';
        ctx.strokeStyle = '#3e2723';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.ellipse(0, 4, 17, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Светлая еловая дека и резная розетка по центру
        ctx.fillStyle = '#cd853f';
        ctx.beginPath();
        ctx.ellipse(0, 5, 13, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#2c1810';
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(0, 2, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Струнодержатель и серебряные струны
        ctx.fillStyle = '#3e2723';
        ctx.fillRect(-6.5, 14, 13, 2.5);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 0.7;
        [-2, 0, 2].forEach(sx => {
            ctx.beginPath();
            ctx.moveTo(sx, -54);
            ctx.lineTo(sx, 14);
            ctx.stroke();
        });
        ctx.restore();

        // 2. ПЫШНЫЕ КУДРЯВЫЕ ВОЛОСЫ И КОСЫ НА ЗАДНЕМ ПЛАНЕ
        ctx.fillStyle = '#6e3b1e';
        ctx.beginPath();
        ctx.arc(64, 42, 24, 0, Math.PI * 2);
        ctx.arc(44, 44, 15, 0, Math.PI * 2);
        ctx.arc(84, 44, 15, 0, Math.PI * 2);
        ctx.arc(38, 62, 15, 0, Math.PI * 2);
        ctx.arc(90, 62, 15, 0, Math.PI * 2);
        ctx.arc(34, 84, 13, 0, Math.PI * 2);
        ctx.arc(94, 84, 13, 0, Math.PI * 2);
        ctx.fill();

        // Золотые ленты-перехваты на косичках
        ctx.fillStyle = '#ffd875';
        ctx.fillRect(28, 72, 12, 3.5);
        ctx.fillRect(88, 72, 12, 3.5);

        // 3. ОДЕЖДА: Изумрудный жилет менестреля с золотой вышивкой и белая рубаха
        ctx.fillStyle = '#1e5631';
        ctx.beginPath();
        ctx.moveTo(18, 128);
        ctx.lineTo(38, 100);
        ctx.lineTo(90, 100);
        ctx.lineTo(110, 128);
        ctx.closePath();
        ctx.fill();

        // Белая пышная блуза в вырезе жилета
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(48, 100);
        ctx.lineTo(64, 126);
        ctx.lineTo(80, 100);
        ctx.closePath();
        ctx.fill();

        // Золотая окантовка жилета
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(44, 101); ctx.lineTo(59, 128);
        ctx.moveTo(84, 101); ctx.lineTo(69, 128);
        ctx.stroke();

        // 4. АККУРАТНЫЕ ЗАОСТРЁННЫЕ УШКИ ПОЛУРОСЛИЦЫ
        ctx.fillStyle = '#eab696';
        ctx.beginPath(); ctx.moveTo(43, 64); ctx.lineTo(27, 54); ctx.lineTo(42, 72); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(85, 64); ctx.lineTo(101, 54); ctx.lineTo(86, 72); ctx.closePath(); ctx.fill();

        // 5. ШЕЯ И МИЛОВИДНОЕ КРУГЛОЕ ЛИЦО С ВЕСНУШКАМИ
        ctx.fillStyle = '#e5b08f';
        ctx.fillRect(55, 86, 18, 16);

        ctx.fillStyle = '#fbd2b8';
        ctx.beginPath();
        ctx.moveTo(45, 52);
        ctx.quadraticCurveTo(64, 38, 83, 52);
        ctx.lineTo(84, 80);
        ctx.quadraticCurveTo(64, 98, 44, 80);
        ctx.closePath();
        ctx.fill();

        // Здоровый румянец и веснушки на щёчках
        ctx.fillStyle = 'rgba(231, 76, 60, 0.18)';
        ctx.beginPath(); ctx.arc(49, 73, 5.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(79, 73, 5.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#b5744c';
        ctx.fillRect(48, 70, 1.5, 1.5); ctx.fillRect(52, 72, 1.5, 1.5);
        ctx.fillRect(79, 70, 1.5, 1.5); ctx.fillRect(75, 72, 1.5, 1.5);

        // Задорные кудряшки чёлки на лбу и золотая ленточка в волосах
        ctx.fillStyle = '#874926';
        ctx.beginPath();
        ctx.arc(47, 46, 8, 0, Math.PI * 2);
        ctx.arc(58, 42, 7.5, 0, Math.PI * 2);
        ctx.arc(70, 42, 7.5, 0, Math.PI * 2);
        ctx.arc(81, 46, 8, 0, Math.PI * 2);
        ctx.arc(64, 33, 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(42, 42);
        ctx.quadraticCurveTo(64, 33, 86, 42);
        ctx.stroke();

        // 6. БОЛЬШИЕ ЯРКИЕ ЗЕЛЁНЫЕ ГЛАЗА И ОЗОРНАЯ УЛЫБКА
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(53, 63, 5, 2.8, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 63, 5, 2.8, 0, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#10b981';
        ctx.beginPath(); ctx.arc(53, 63, 2.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 63, 2.3, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#064e3b';
        ctx.beginPath(); ctx.arc(53, 63, 1.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 63, 1.1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(54, 62, 0.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 62, 0.8, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#5c3118';
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(47, 57); ctx.quadraticCurveTo(53, 54.5, 58, 57);
        ctx.moveTo(70, 57); ctx.quadraticCurveTo(75, 54.5, 81, 57);
        ctx.stroke();

        ctx.strokeStyle = '#d99e7c';
        ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(64, 61); ctx.lineTo(62.5, 72); ctx.lineTo(66, 72); ctx.stroke();

        ctx.fillStyle = '#e06c6c';
        ctx.beginPath();
        ctx.moveTo(55, 80);
        ctx.quadraticCurveTo(64, 87, 73, 80);
        ctx.quadraticCurveTo(64, 83, 55, 80);
        ctx.closePath();
        ctx.fill();

        // 7. ИЗОГНУТАЯ СТАЛЬНАЯ САБЛЯ НА ПЕРЕДНЕМ ПЛАНЕ (Слева снизу по диагонали)
        ctx.save();
        ctx.translate(27, 108);
        ctx.rotate((Math.PI / 180) * -28);

        // Изогнутый стальной клинок сабли
        ctx.fillStyle = '#94a3b8';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-3.5, 0);
        ctx.quadraticCurveTo(-5, -24, 1, -44); // Изогнутое остриё сабли
        ctx.quadraticCurveTo(5, -22, 3.5, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Светлая режущая кромка клинка
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(1, -44);
        ctx.quadraticCurveTo(5, -22, 3.5, 0);
        ctx.lineTo(0.5, 0);
        ctx.quadraticCurveTo(1.5, -22, 1, -44);
        ctx.closePath();
        ctx.fill();

        // Золотая гарда-эфес с дужкой
        ctx.fillStyle = '#ffd875';
        ctx.strokeStyle = '#8a6421';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.roundRect(-9, -2, 18, 3.5, 1.5);
        ctx.fill();
        ctx.stroke();

        // Защитная золотая дужка эфеса
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(7, 1);
        ctx.quadraticCurveTo(12, 8, 4, 15);
        ctx.stroke();

        // Рукоять и золотое навершие
        ctx.fillStyle = '#1e5631';
        ctx.fillRect(-2.5, 1.5, 5, 12);

        ctx.fillStyle = '#ffd875';
        ctx.beginPath();
        ctx.arc(0, 15, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.beginPath();
        ctx.moveTo(64, 18);
        ctx.arc(64, 42, 24, Math.PI * 1.5, Math.PI, true);
        ctx.lineTo(44, 80);
        ctx.lineTo(64, 96);
        ctx.lineTo(64, 128);
        ctx.lineTo(18, 128);
        ctx.lineTo(38, 100);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ МИТФЛИТА (СИНЕКОЖИЙ ГРЕМЛИН-ФЕЯ С КОРОТКИМ МЕЧОМ)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateMitflitAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ОГРОМНЫЕ ОТТОПЫРЕННЫЕ УШИ ГРЕМЛИНА (Задний план)
        ctx.fillStyle = '#476985';
        // Левое огромное ухо
        ctx.beginPath();
        ctx.moveTo(38, 48);
        ctx.quadraticCurveTo(14, 38, 4, 46);
        ctx.quadraticCurveTo(16, 62, 36, 68);
        ctx.closePath();
        ctx.fill();

        // Правое огромное ухо
        ctx.beginPath();
        ctx.moveTo(90, 48);
        ctx.quadraticCurveTo(114, 38, 124, 46);
        ctx.quadraticCurveTo(112, 62, 92, 68);
        ctx.closePath();
        ctx.fill();

        // Внутренняя тёмная раковина ушей
        ctx.fillStyle = '#2d465c';
        ctx.beginPath(); ctx.moveTo(36, 53); ctx.quadraticCurveTo(18, 47, 10, 49); ctx.quadraticCurveTo(20, 58, 35, 62); ctx.fill();
        ctx.beginPath(); ctx.moveTo(92, 53); ctx.quadraticCurveTo(110, 47, 118, 49); ctx.quadraticCurveTo(108, 58, 93, 62); ctx.fill();

        // 2. ТЩЕДУШНЫЕ ПЛЕЧИ, РВАНАЯ ТУНИКА И КОЖАНАЯ ПЕРЕВЯЗЬ С КОЛЬЯМИ
        ctx.fillStyle = '#384726'; // Рваная болотно-зелёная тряпка
        ctx.beginPath();
        ctx.moveTo(22, 128);
        ctx.lineTo(38, 96);
        ctx.lineTo(90, 96);
        ctx.lineTo(106, 128);
        ctx.closePath();
        ctx.fill();

        // Кожаный наплечник справа и перевязь через грудь
        ctx.fillStyle = '#4a3525';
        ctx.beginPath();
        ctx.moveTo(82, 96);
        ctx.quadraticCurveTo(102, 96, 108, 122);
        ctx.lineTo(86, 126);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(92, 107, 4.5, 0, Math.PI * 2); ctx.stroke();

        // Диагональный ремень с деревянными кольями-дротиками
        ctx.fillStyle = '#3b2416';
        ctx.beginPath();
        ctx.moveTo(84, 96);
        ctx.lineTo(52, 128);
        ctx.lineTo(66, 128);
        ctx.lineTo(94, 100);
        ctx.closePath();
        ctx.fill();

        // Маленькие деревянные колья заткнутые за перевязь
        ctx.fillStyle = '#c49a6c';
        ctx.save();
        ctx.translate(76, 110);
        ctx.rotate((Math.PI / 180) * -42);
        ctx.fillRect(-7, -6, 2.5, 12);
        ctx.fillRect(-1.5, -6, 2.5, 12);
        ctx.fillRect(4, -6, 2.5, 12);
        ctx.restore();

        // 3. ГОЛОВА МИТФЛИТА (Широкий бугристый лоб и скуластая челюсть)
        ctx.fillStyle = '#5c82a1'; // Серо-голубая кожа феи-гремлина
        ctx.beginPath();
        ctx.moveTo(36, 44);
        ctx.quadraticCurveTo(64, 24, 92, 44);
        ctx.lineTo(94, 68);
        ctx.lineTo(82, 92);
        ctx.quadraticCurveTo(64, 102, 46, 92);
        ctx.lineTo(34, 68);
        ctx.closePath();
        ctx.fill();

        // Рельефные надбровные бугры и скулы (световой объём)
        ctx.fillStyle = '#7ba3c4';
        ctx.beginPath();
        ctx.arc(50, 44, 11, 0, Math.PI * 2);
        ctx.arc(78, 44, 11, 0, Math.PI * 2);
        ctx.fill();

        // Характерные кожные бородавки на лбу и щеках
        ctx.fillStyle = '#3b5870';
        ctx.beginPath(); ctx.arc(64, 34, 2.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(41, 66, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(87, 68, 2.2, 0, Math.PI * 2); ctx.fill();

        // 4. ГЛУБОКО ПОСАЖЕННЫЕ ЖЁЛТО-ЯНТАРНЫЕ ГЛАЗА И ШИРОКИЙ НОС
        // Тёмные глазницы под нахмуренными бровями
        ctx.fillStyle = '#243a4d';
        ctx.beginPath(); ctx.ellipse(50, 56, 7.5, 4.2, 0.14, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(78, 56, 7.5, 4.2, -0.14, 0, Math.PI * 2); ctx.fill();

        // Жёлтые глаза гремлина
        ctx.fillStyle = '#facc15';
        ctx.beginPath(); ctx.ellipse(50, 56, 5.5, 3, 0.14, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(78, 56, 5.5, 3, -0.14, 0, Math.PI * 2); ctx.fill();

        // Тёмные зрачки и блики
        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(50.5, 56, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(77.5, 56, 1.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(51.5, 55, 0.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76.5, 55, 0.8, 0, Math.PI * 2); ctx.fill();

        // Нависшие складки лба над глазами
        ctx.strokeStyle = '#243a4d';
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(39, 49); ctx.lineTo(58, 54);
        ctx.moveTo(89, 49); ctx.lineTo(70, 54);
        ctx.stroke();

        // Широкий приплюснутый нос картошкой
        ctx.fillStyle = '#476985';
        ctx.beginPath();
        ctx.moveTo(64, 54);
        ctx.lineTo(74, 68);
        ctx.quadraticCurveTo(64, 73, 54, 68);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#1e3040';
        ctx.beginPath(); ctx.arc(59, 68, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(69, 68, 1.8, 0, Math.PI * 2); ctx.fill();

        // 5. ШИРОКАЯ ВРЕДНАЯ УХМЫЛКА С МЕЛКИМИ ОСТРЫМИ ЗУБАМИ
        ctx.fillStyle = '#182430';
        ctx.beginPath();
        ctx.moveTo(43, 77);
        ctx.quadraticCurveTo(64, 83, 85, 77);
        ctx.quadraticCurveTo(80, 90, 64, 91);
        ctx.quadraticCurveTo(48, 90, 43, 77);
        ctx.closePath();
        ctx.fill();

        // Мелкие острые зубы сверху и снизу
        ctx.fillStyle = '#fef9c3';
        [48, 55, 62, 69, 76].forEach(zx => {
            ctx.beginPath();
            ctx.moveTo(zx, 79);
            ctx.lineTo(zx + 2, 83.5);
            ctx.lineTo(zx + 4, 79.5);
            ctx.closePath();
            ctx.fill();
        });
        [51, 59, 67, 74].forEach(zx => {
            ctx.beginPath();
            ctx.moveTo(zx, 89);
            ctx.lineTo(zx + 2, 85);
            ctx.lineTo(zx + 4, 88.5);
            ctx.closePath();
            ctx.fill();
        });

        // 6. МАЛЕНЬКИЙ ЗАЗУБРЕННЫЙ КОРОТКИЙ МЕЧ НА ПЕРЕДНЕМ ПЛАНЕ (Слева снизу)
        ctx.save();
        ctx.translate(25, 102);
        ctx.rotate((Math.PI / 180) * -26);

        // Короткий стальной клинок с зазубриной
        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(-4.5, 0);
        ctx.lineTo(-4.5, -24);
        ctx.lineTo(-2.5, -26); // Небольшая зазубрина на лезвии
        ctx.lineTo(-4.5, -28);
        ctx.lineTo(-4, -36);
        ctx.lineTo(0, -44); // Остриё короткого меча
        ctx.lineTo(4, -36);
        ctx.lineTo(4.5, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Светлая заточенная грань клинка
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(0, -44);
        ctx.lineTo(4, -36);
        ctx.lineTo(4.5, 0);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();

        // Грубая кованая гарда и обмотанная рукоять
        ctx.fillStyle = '#334155';
        ctx.fillRect(-10, -2, 20, 4);

        ctx.fillStyle = '#4a3219';
        ctx.fillRect(-2.5, 2, 5, 13);

        ctx.fillStyle = '#64748b';
        ctx.beginPath(); ctx.arc(0, 17, 3.2, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // Синекожая когтистая кисть митфлита, сжимающая рукоять меча
        ctx.fillStyle = '#476985';
        ctx.strokeStyle = '#1e3040';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(29, 111, 6, 4.5, -0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 30);
        ctx.quadraticCurveTo(48, 34, 36, 44);
        ctx.lineTo(34, 68);
        ctx.lineTo(46, 92);
        ctx.lineTo(64, 97);
        ctx.lineTo(64, 128);
        ctx.lineTo(22, 128);
        ctx.lineTo(38, 96);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ХОДОКА (ХОДЯЧИЕ ЛИАНЫ / ПЕРЕПЛЕТЁННЫЕ ЛОЗЫ)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateShamblingMoundAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ВНЕШНИЕ ИЗВИВАЮЩИЕСЯ ЩУПАЛЬЦА-ЛИАНЫ И ПОБЕГИ (Задний план и силуэт)
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Тёмные древесные плети-лозы, тянущиеся вверх и в стороны
        ctx.strokeStyle = '#2d471e';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(48, 36); ctx.bezierCurveTo(32, 22, 42, 10, 26, 6);
        ctx.moveTo(64, 30); ctx.bezierCurveTo(68, 16, 56, 10, 64, 3);
        ctx.moveTo(80, 36); ctx.bezierCurveTo(96, 22, 86, 10, 102, 6);
        // Боковые лианы-руки
        ctx.moveTo(32, 60); ctx.bezierCurveTo(14, 52, 16, 36, 6, 30);
        ctx.moveTo(26, 86); ctx.bezierCurveTo(10, 86, 12, 104, 4, 114);
        ctx.moveTo(96, 60); ctx.bezierCurveTo(114, 52, 112, 36, 122, 30);
        ctx.moveTo(102, 86); ctx.bezierCurveTo(118, 86, 116, 104, 124, 114);
        ctx.stroke();

        // Более тонкие салатово-зелёные побеги, обвивающие внешние плети
        ctx.strokeStyle = '#5c9134';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(46, 34); ctx.bezierCurveTo(40, 20, 30, 18, 22, 12);
        ctx.moveTo(82, 34); ctx.bezierCurveTo(88, 20, 98, 18, 106, 12);
        ctx.moveTo(28, 62); ctx.bezierCurveTo(18, 48, 10, 46, 8, 36);
        ctx.moveTo(100, 62); ctx.bezierCurveTo(110, 48, 118, 46, 120, 36);
        ctx.stroke();

        // 2. ТЁМНОЕ ВНУТРЕННЕЕ ЯДРО СПЛЕТЕНИЯ (Чтобы между лианами читалась глубина)
        ctx.fillStyle = '#14210c';
        ctx.beginPath();
        ctx.moveTo(26, 128);
        ctx.bezierCurveTo(22, 86, 32, 42, 64, 34);
        ctx.bezierCurveTo(96, 42, 106, 86, 102, 128);
        ctx.closePath();
        ctx.fill();

        // 3. ТОЛСТЫЕ ПЕРЕПЛЕТЁННЫЕ СТВОЛЫ-ЛИАНЫ, ФОРМИРУЮЩИЕ ТЕЛО И ГОЛОВУ
        // Задний слой густых оливковых лоз
        ctx.strokeStyle = '#385923';
        ctx.lineWidth = 7.5;
        ctx.beginPath();
        ctx.moveTo(22, 128); ctx.bezierCurveTo(18, 86, 34, 46, 64, 32);
        ctx.moveTo(106, 128); ctx.bezierCurveTo(110, 86, 94, 46, 64, 32);
        ctx.moveTo(36, 128); ctx.bezierCurveTo(44, 96, 26, 66, 52, 36);
        ctx.moveTo(92, 128); ctx.bezierCurveTo(84, 96, 102, 66, 76, 36);
        ctx.stroke();

        // Средний слой переплетённых древесно-зелёных лиан
        ctx.strokeStyle = '#4c782e';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(28, 128); ctx.bezierCurveTo(48, 106, 24, 72, 46, 42);
        ctx.moveTo(100, 128); ctx.bezierCurveTo(80, 106, 104, 72, 82, 42);
        ctx.moveTo(46, 128); ctx.bezierCurveTo(56, 102, 72, 102, 82, 128);
        ctx.moveTo(32, 92); ctx.quadraticCurveTo(64, 112, 96, 92);
        ctx.stroke();

        // Передние рельефные стебли с ярким световым оттенком (объём)
        ctx.strokeStyle = '#6da642';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(34, 126); ctx.bezierCurveTo(42, 96, 28, 70, 48, 44);
        ctx.moveTo(94, 126); ctx.bezierCurveTo(86, 96, 100, 70, 80, 44);
        ctx.moveTo(36, 94); ctx.quadraticCurveTo(64, 110, 92, 94);
        ctx.moveTo(44, 42); ctx.quadraticCurveTo(64, 32, 84, 42);
        ctx.stroke();

        // 4. ЛИСТЬЯ ПЛЮЩА И ПАПОРОТНИКА НА ЛИАНАХ
        const drawLeaf = (lx, ly, angleDeg, color) => {
            ctx.save();
            ctx.translate(lx, ly);
            ctx.rotate((Math.PI / 180) * angleDeg);
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(6, -5, 13, 0);
            ctx.quadraticCurveTo(6, 5, 0, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        };

        drawLeaf(36, 46, -145, '#7cb84b');
        drawLeaf(92, 46, -35, '#7cb84b');
        drawLeaf(24, 74, -165, '#5c9134');
        drawLeaf(104, 74, -15, '#5c9134');
        drawLeaf(32, 106, 155, '#7cb84b');
        drawLeaf(96, 106, 25, '#7cb84b');
        drawLeaf(64, 112, 90, '#6da642');

        // 5. ТЁМНЫЙ ПРОСВЕТ-ЛИЦО МЕЖДУ ЛИАНАМИ И СВЕТЯЩИЕСЯ ГЛАЗА
        ctx.fillStyle = '#0d1408';
        ctx.beginPath();
        ctx.moveTo(44, 52);
        ctx.quadraticCurveTo(64, 46, 84, 52);
        ctx.lineTo(80, 82);
        ctx.quadraticCurveTo(64, 90, 48, 82);
        ctx.closePath();
        ctx.fill();

        // Пересекающие лицо тонкие стебли-усики
        ctx.strokeStyle = '#385923';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(43, 52); ctx.quadraticCurveTo(64, 56, 85, 52);
        ctx.moveTo(46, 82); ctx.quadraticCurveTo(64, 86, 82, 82);
        ctx.stroke();

        // Светящиеся янтарно-золотые глаза в глубине лиан
        ctx.fillStyle = 'rgba(250, 204, 21, 0.35)';
        ctx.beginPath(); ctx.arc(53, 61, 6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 61, 6, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#facc15';
        ctx.beginPath(); ctx.ellipse(53, 61, 4, 2.3, 0.18, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 61, 4, 2.3, -0.18, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(53, 61, 1.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 61, 1.1, 0, Math.PI * 2); ctx.fill();

        // Острые шипы-колючки в пасти из лиан
        ctx.fillStyle = '#82bd51';
        ctx.beginPath(); ctx.moveTo(50, 70); ctx.lineTo(53, 77); ctx.lineTo(56, 70); ctx.fill();
        ctx.beginPath(); ctx.moveTo(61, 69); ctx.lineTo(64, 77); ctx.lineTo(67, 69); ctx.fill();
        ctx.beginPath(); ctx.moveTo(78, 70); ctx.lineTo(75, 77); ctx.lineTo(72, 70); ctx.fill();

        ctx.beginPath(); ctx.moveTo(54, 82); ctx.lineTo(57, 75); ctx.lineTo(60, 82); ctx.fill();
        ctx.beginPath(); ctx.moveTo(74, 82); ctx.lineTo(71, 75); ctx.lineTo(68, 82); ctx.fill();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 32);
        ctx.bezierCurveTo(32, 42, 22, 86, 22, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * ПРОЦЕДУРНЫЙ ГЕНЕРАТОР АВАТАРКИ ПАУКА-ОХОТНИКА (ДЕТАЛИЗИРОВАННЫЙ ХИЩНИК-ТАРАНТУЛ)
     * Возвращает строку Data-URL для мгновенного рендеринга (прозрачный фон)
     */
    generateHunterSpiderAvatarDataUrl() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. МАССИВНОЕ БРЮШКО С ТИГРОВЫМ УЗОРОМ ШЕВРОНОВ (Задний план сверху)
        ctx.fillStyle = '#4a2c18';
        ctx.beginPath();
        ctx.ellipse(64, 38, 27, 21, 0, 0, Math.PI * 2);
        ctx.fill();

        // Световой контур на правой половине брюшка
        ctx.fillStyle = '#633c22';
        ctx.beginPath();
        ctx.ellipse(68, 38, 21, 17, 0, -Math.PI * 0.5, Math.PI * 0.5);
        ctx.fill();

        // Охристо-рыжие хитиновые шевроны на спине охотника
        ctx.fillStyle = '#d9822b';
        ctx.beginPath();
        ctx.moveTo(49, 32); ctx.lineTo(64, 23); ctx.lineTo(79, 32); ctx.lineTo(75, 36); ctx.lineTo(64, 29); ctx.lineTo(53, 36);
        ctx.moveTo(45, 42); ctx.lineTo(64, 33); ctx.lineTo(83, 42); ctx.lineTo(79, 46); ctx.lineTo(64, 39); ctx.lineTo(49, 46);
        ctx.closePath();
        ctx.fill();

        // 2. ВОСЕМЬ ТОЛСТЫХ СУСТАВЧАТЫХ ПОЛОСАТЫХ ЛАП (В стойке перед прыжком)
        const drawHunterLeg = (x1, y1, x2, y2, x3, y3, isRight) => {
            // Основной толстый сегмент бедра и голени
            ctx.strokeStyle = isRight ? '#7a4924' : '#593418';
            ctx.lineWidth = 6.5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.stroke();

            // Заострённый сегмент лапки-коготка
            ctx.strokeStyle = isRight ? '#9c5f30' : '#7a4924';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.stroke();

            // Янтарно-рыжее суставчатое кольцо на сгибе лапы
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(x2, y2, 3.6, 0, Math.PI * 2);
            ctx.fill();
        };

        // Левые 4 лапы
        drawHunterLeg(44, 52, 16, 26, 6, 56, false);
        drawHunterLeg(40, 62, 10, 50, 4, 86, false);
        drawHunterLeg(40, 74, 12, 78, 12, 114, false);
        drawHunterLeg(45, 84, 20, 96, 24, 125, false);

        // Правые 4 лапы
        drawHunterLeg(84, 52, 112, 26, 122, 56, true);
        drawHunterLeg(88, 62, 118, 50, 124, 86, true);
        drawHunterLeg(88, 74, 116, 78, 116, 114, true);
        drawHunterLeg(83, 84, 108, 96, 104, 125, true);

        // 3. РЕЛЬЕФНАЯ ГОЛОВОГРУДЬ ПАУКА-ВОЛКА (На переднем плане по центру)
        ctx.fillStyle = '#6e401e';
        ctx.beginPath();
        ctx.moveTo(44, 52);
        ctx.quadraticCurveTo(64, 42, 84, 52);
        ctx.lineTo(88, 78);
        ctx.lineTo(74, 92);
        ctx.lineTo(54, 92);
        ctx.lineTo(40, 78);
        ctx.closePath();
        ctx.fill();

        // Светлая продольная полоса охотника на панцире головогруди
        ctx.fillStyle = '#e08e38';
        ctx.beginPath();
        ctx.moveTo(57, 47);
        ctx.lineTo(71, 47);
        ctx.lineTo(69, 64);
        ctx.lineTo(59, 64);
        ctx.closePath();
        ctx.fill();

        // 4. ГЛАЗА ПАУКА-ОХОТНИКА (Два гигантских фронтальных + 6 вспомогательных)
        ctx.fillStyle = '#2b170a';
        ctx.beginPath();
        ctx.roundRect(44, 62, 40, 18, 7);
        ctx.fill();

        // Два огромных центральных глаза-прожектора
        ctx.fillStyle = '#ff9f1a';
        ctx.beginPath(); ctx.arc(56, 71, 5.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(72, 71, 5.4, 0, Math.PI * 2); ctx.fill();

        // Боковая пара средних глаз
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.arc(47.5, 69, 2.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(80.5, 69, 2.8, 0, Math.PI * 2); ctx.fill();

        // Нижний ряд из 4 малых глаз
        ctx.beginPath(); ctx.arc(53, 77.5, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(60, 77.5, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(68, 77.5, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 77.5, 1.5, 0, Math.PI * 2); ctx.fill();

        // Живые белые блики в главных глазах
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(57.8, 69.2, 1.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(70.2, 69.2, 1.6, 0, Math.PI * 2); ctx.fill();

        // 5. МОЩНЫЕ ПЕДИПАЛЬПЫ И ХИЩНЫЕ ХЕЛИЦЕРЫ-КЛЫКИ
        // Толстые ловчие щупальца-педипальпы по бокам пасти
        ctx.strokeStyle = '#7a4924';
        ctx.lineWidth = 4.2;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(45, 84); ctx.lineTo(36, 98); ctx.lineTo(42, 112); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(83, 84); ctx.lineTo(92, 98); ctx.lineTo(86, 112); ctx.stroke();

        // Массивные хелицеры
        ctx.fillStyle = '#3b200d';
        ctx.beginPath(); ctx.moveTo(50, 86); ctx.lineTo(61, 104); ctx.lineTo(52, 106); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(78, 86); ctx.lineTo(67, 104); ctx.lineTo(76, 106); ctx.closePath(); ctx.fill();

        // Острые янтарно-алые жала клыков
        ctx.fillStyle = '#ea580c';
        ctx.beginPath(); ctx.moveTo(53, 102); ctx.quadraticCurveTo(58, 114, 61, 117); ctx.lineTo(60, 102); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(75, 102); ctx.quadraticCurveTo(70, 114, 67, 117); ctx.lineTo(68, 102); ctx.closePath(); ctx.fill();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 17);
        ctx.lineTo(16, 26);
        ctx.lineTo(4, 86);
        ctx.lineTo(24, 125);
        ctx.lineTo(64, 117);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },





};

export default InitiativeManager;
