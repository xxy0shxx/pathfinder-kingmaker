import InitiativeAudio from '../services/initiative_audio.js';
import AvatarRegistry from '../services/avatars/avatar_registry.js';
import { InitiativePhrases } from '../config/initiative_phrases.js';
import EventBus from '../services/event_bus.js';

/**
 * МОДУЛЬ: ТРЕКЕР ИНИЦИАТИВЫ С ТВ-СТРЕЛКОЙ ХОДА И ВСПЫШКОЙ НОВОГО РАУНДА
 */
const InitiativeManager = {
    state: {
        combatants: [],
        selectedUnitId: null,
        round: 1,
        viewMode: 'classic',
        phraseSeed: 0,
        audioPreset: 'horn',
        weatherFxEnabled: true
    },
    mapDataRef: null,
    onSaveCallback: null,
    _isInputsBound: false,
    _isGlobalKeyBound: false,
    _isDrawerOpen: false,

    init(mapData) {
        try {
            this.mapDataRef = mapData || {hexes: {}, kingdom: null, initiative: null};

            if (this.mapDataRef.initiative) {
                this.state = this.mapDataRef.initiative;
                if (!Array.isArray(this.state.combatants)) this.state.combatants = [];
                if (this.state.round === undefined || isNaN(this.state.round)) this.state.round = 1;
                if (this.state.viewMode === undefined) this.state.viewMode = 'classic';
                if (this.state.phraseSeed === undefined) this.state.phraseSeed = 0;
                if (this.state.audioPreset === undefined) this.state.audioPreset = 'horn';
                if (this.state.weatherFxEnabled === undefined) this.state.weatherFxEnabled = true;
            } else {
                this.mapDataRef.initiative = this.state;
            }

            EventBus.on('data:imported', (newMapData) => this.updateMapData(newMapData));
            EventBus.on('weather:updated', () => this.renderUi());

            window.InitiativeManager = this;
            this.renderUi();
            this.bindGlobalHotkeys();
        } catch (e) {
            console.error("Ошибка инициализации InitiativeManager:", e);
        }
    },

    toggleWeatherFx() {
        this.state.weatherFxEnabled = !this.state.weatherFxEnabled;
        this._saveWithoutSort();
    },

    bindGlobalHotkeys() {
        if (this._isGlobalKeyBound) return;
        window.addEventListener('keydown', (e) => {
            const container = document.getElementById('initiativeTabletContainer');
            if (!container || container.style.display === 'none') return;
            if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

            if (e.code === 'Space') {
                e.preventDefault();
                this.nextTurn();
            }
        });
        this._isGlobalKeyBound = true;
    },

    updateMapData(newMapData) {
        this.mapDataRef = newMapData || {hexes: {}, kingdom: null, initiative: null};
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

        if (!cleanName) {
            alert("Введите имя или название существа!");
            return;
        }
        if (isNaN(parsedScore) || parsedScore < 1 || parsedScore > 100) {
            alert("Инициатива должна быть от 1 до 100!");
            return;
        }

        const autoAvatarType = this._pendingAvatarType || AvatarRegistry.guessAvatarByName(cleanName);
        const autoAvatarUrl = autoAvatarType ? AvatarRegistry.getAvatarDataUrl(autoAvatarType) : null;
        this._pendingAvatarType = null;

        const newUnit = {
            id: 'unit_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            name: cleanName,
            score: parsedScore,
            faction: faction || 'neutral',
            isNat20: !!isNat20,
            isNat1: !!isNat1,
            status: 'active', // 'active' | 'dying' | 'prone' | 'out'
            avatarType: autoAvatarType,
            avatar: autoAvatarUrl
        };

        this.state.combatants.push(newUnit);
        if (this.state.combatants.length === 1) {
            this.state.selectedUnitId = newUnit.id;
        }
        this._sortAndSave();
    },

    updateStatus(id, newStatus) {
        const unit = this.state.combatants.find(c => c.id === id);
        if (!unit) return;
        unit.status = newStatus || 'active';

        if (this.state.audioPreset !== 'none') {
            if (unit.status === 'dying') InitiativeAudio.playEventSound('dying');
            if (unit.status === 'prone') InitiativeAudio.playEventSound('prone');
        }

        // Если текущий активный боец выбыл, передаем ход следующему активному
        if (unit.status === 'out' && this.state.selectedUnitId === id) {
            const activeUnits = this.state.combatants.filter(c => c.status !== 'out');
            this.state.selectedUnitId = activeUnits.length > 0 ? activeUnits[0].id : null;
        }
        this._sortAndSave();
    },

    setCombatantAvatar(id, avatarType) {
        const unit = this.state.combatants.find(c => c.id === id);
        if (!unit) return;

        unit.avatarType = avatarType || null;
        unit.avatar = AvatarRegistry.getAvatarDataUrl(unit.avatarType);

        this._saveWithoutSort();
    },

    nextTurn() {
        const activeUnits = this.state.combatants.filter(c => c.status !== 'out');
        if (activeUnits.length === 0) return;

        const currentIndex = activeUnits.findIndex(c => c.id === this.state.selectedUnitId);
        this.state.phraseSeed = Math.floor(Math.random() * 1000);

        let isNewRound = false;
        if (currentIndex === -1 || currentIndex === activeUnits.length - 1) {
            this.state.selectedUnitId = activeUnits[0].id;
            this.state.round += 1;
            isNewRound = true;
            this.triggerRoundFlashEffect();
        } else {
            this.state.selectedUnitId = activeUnits[currentIndex + 1].id;
        }

        if (this.state.audioPreset !== 'none') {
            const nextUnit = activeUnits.find(c => c.id === this.state.selectedUnitId);
            const triggerUnitSound = () => {
                if (nextUnit?.status === 'dying') InitiativeAudio.playEventSound('dying');
                else if (nextUnit?.status === 'prone') InitiativeAudio.playEventSound('prone');
                else if (nextUnit?.isNat20) InitiativeAudio.playEventSound('nat20');
                else if (nextUnit?.isNat1) InitiativeAudio.playEventSound('nat1');
            };

            if (isNewRound) {
                setTimeout(triggerUnitSound, 650);
            } else {
                triggerUnitSound();
            }
        }

        this._saveWithoutSort();
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
        requestAnimationFrame(() => {
            flashOverlay.style.opacity = '0';
        });

        InitiativeAudio.playRoundSound(this.state.audioPreset);

        setTimeout(() => {
            if (flashOverlay.parentNode) flashOverlay.remove();
        }, 600);
    },

    _sortAndSave() {
        this.state.combatants.sort((a, b) => {
            const aOut = a.status === 'out';
            const bOut = b.status === 'out';
            if (aOut && !bOut) return 1;
            if (!aOut && bOut) return -1;

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
        EventBus.emit('data:save');

        this.renderUi();
        this.scrollToActiveCombatant();
    },

    scrollToActiveCombatant() {
        if (!this.state.selectedUnitId) return;
        const activeCard = document.querySelector(`.init-combatant-card.selected-turn-gold`);
        if (activeCard) {
            activeCard.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'});
        }
    },

    toggleNat20(id) {
        const unit = this.state.combatants.find(c => c.id === id);
        if (unit) {
            unit.isNat20 = !unit.isNat20;
            unit.isNat1 = false;
            if (unit.isNat20) {
                unit.score = 20;
                if (this.state.audioPreset !== 'none') InitiativeAudio.playEventSound('nat20');
            }
            this._sortAndSave();
        }
    },

    toggleNat1(id) {
        const unit = this.state.combatants.find(c => c.id === id);
        if (unit) {
            unit.isNat1 = !unit.isNat1;
            unit.isNat20 = false;
            if (unit.isNat1) {
                unit.score = 1;
                if (this.state.audioPreset !== 'none') InitiativeAudio.playEventSound('nat1');
            }
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
            this.state.selectedUnitId = this.state.combatants.length > 0 ? this.state.combatants[0].id : null;
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

    advanceRounds(deltaRounds) {
        const prevRound = this.state.round || 1;
        this.state.round = prevRound + deltaRounds;
        this.triggerRoundFlashEffect();
        this._saveWithoutSort();
    },

    _formatBattleTime(roundNum) {
        const totalSec = Math.max(1, roundNum) * 6;
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    },


    _syncWeatherVisualEffects(container) {
        let fxLayer = container.querySelector('.init-weather-fx-layer');
        const cal = window.WeatherManager?.getCalendarInfo?.();

        // Если эффекты выключены кнопкой или погоды нет — убираем слой
        if (this.state.weatherFxEnabled === false || !cal || (!cal.precip && !cal.hazard)) {
            if (fxLayer) fxLayer.remove();
            return;
        }

        if (!cal || (!cal.precip && !cal.hazard)) {
            if (fxLayer) fxLayer.remove();
            return;
        }

        if (!fxLayer) {
            fxLayer = document.createElement('div');
            fxLayer.className = 'init-weather-fx-layer';
            container.appendChild(fxLayer);
        }

        fxLayer.className = 'init-weather-fx-layer';
        const hzId = cal.hazard?.id || '';

        if (hzId === 'blizzard' || hzId === 'tornado') {
            fxLayer.classList.add('fx-blizzard');
        } else if (hzId === 'fog') {
            fxLayer.classList.add('fx-fog');
        } else if (hzId === 'thunderstorm' || hzId === 'downpour' || hzId === 'hail') {
            fxLayer.classList.add('fx-rain');
        } else if (cal.precip && cal.cold) {
            fxLayer.classList.add('fx-snow');
        } else if (cal.precip) {
            fxLayer.classList.add('fx-rain');
        }

        // При грозе каждый 100-й раунд (каждые 10 минут) запускаем вспышку молнии
        if (hzId === 'thunderstorm' && this.state.round > 1 && (this.state.round - 1) % 100 === 0) {
            fxLayer.classList.remove('init-lightning-active');
            void fxLayer.offsetWidth;
            fxLayer.classList.add('init-lightning-active');
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

    renderUi() {
        const container = document.getElementById('initiativeTabletContainer');
        if (!container) return;

        if (!container.querySelector('.init-header-zone')) {
            container.innerHTML = `
                <div class="initiative-tablet-content" style="width: 100%;">
                    <div class="init-header-zone">
                        <div id="initWeatherHost"></div>
                        <div class="init-master-battle-control-bar">
                        
                            <div class="init-round-counter-badge" style="gap: 8px; padding: 0 14px;">
                                <span>РАУНД <span id="initRoundCounterNum">1</span></span>
                                <span id="initBattleTimeBadge" style="font-size: 14px; color: #a4b0be; font-family: monospace; background: rgba(0,0,0,0.45); padding: 2px 7px; border-radius: 4px; border: 1px solid #543e0d;" title="Время с начала сцены (1 раунд = 6 сек)">00:00</span>
                                <button type="button" id="initBtnAdd1Min" class="init-btn-reset-round-inline" title="Промотать +1 минуту (+10 раундов)" style="font-size: 12px; border: 1px solid #543e0d !important; border-radius: 3px; padding: 2px 5px !important;">+1м</button>
                                <button type="button" id="initBtnAdd10Min" class="init-btn-reset-round-inline" title="Промотать +10 минут (+100 раундов)" style="font-size: 12px; border: 1px solid #543e0d !important; border-radius: 3px; padding: 2px 5px !important;">+10м</button>
                                <button type="button" id="initBtnResetRoundOnly" class="init-btn-reset-round-inline" title="Сбросить раунды до 1">🔄</button>
                                </div>

                            
                            <select id="initSelectAudioPreset" style="background: #090f0b; border: 1px solid #543e0d; color: #ebd291; height: 50px; padding: 4px 6px; font-weight: bold; font-size: 13px; border-radius: 4px; cursor: pointer; max-width: 175px;">
                                <option value="bell">💎 Колокольчик</option>
                                <option value="drum">🥁 Drum&Bass</option>
                                <option value="magic">🔮 Techno</option>
                                <option value="horn">📯 Боевой Рог</option>
                                <option value="thunder">⚡ Combat</option>
                                <option value="blade">⚔️ Клинки</option>
                                <option value="anvil">🔨 Наковальня</option>
                                <option value="gong">🔔 Гонг</option>
                                <option value="none">🔇 Без звука</option>
                            </select>
                            <button type="button" id="initBtnToggleWeatherFx" class="init-btn-view-toggle" title="Включить/выключить анимацию погоды (снег, дождь, туман)" style="padding: 0 12px !important; font-size: 18px !important;">🌧️</button>
                            <button type="button" id="initBtnToggleView" class="init-btn-view-toggle" title="Сменить стиль отображения">⚔️ Режим: Список / Горизонт</button>
                            <button type="button" id="initBtnToggleBestiaryDrawer" class="init-btn-view-toggle" title="Открыть панель заготовок героев и монстров">🐉 Заготовки</button>
                            <button type="button" class="btn ok" id="initBtnNextTurn" style="flex-grow: 1; height: 50px; font-size: 18px; font-weight: 900; letter-spacing: 1px;">🛡️ СЛЕДУЮЩИЙ ХОД</button>

                        </div>
                        <div class="init-quick-input-bar" style="margin-top: 14px;">
                        
                            <div class="init-name-autocomplete-wrap" style="position: relative; flex-grow: 1; display: flex;">
                                <input type="text" id="initInputName" autocomplete="off" placeholder="Имя персонажа / Название монстра...">
                                <div id="initNameSuggestions" class="init-name-suggestions" style="display: none;"></div>
                            </div>

                            <div class="camp-count-controls" style="padding: 2px 8px;">
                                <span class="camp-param-label" style="font-size: 16px; margin-right: 4px;">Иниц:</span>
                                <button type="button" onclick="document.getElementById('initInputScore').value = Math.max(1, parseInt(document.getElementById('initInputScore').value, 10) - 1)">-</button>
                                <input type="text" id="initInputScore" value="10" style="width: 50px; text-align: center; background: #000; border: 1px solid #543e0d; color: #fff; font-weight: bold;">
                                <button type="button" onclick="document.getElementById('initInputScore').value = Math.min(100, parseInt(document.getElementById('initInputScore').value, 10) + 1)">+</button>
                            </div>
                            <label class="init-nat20-checkbox-label" title="Натуральная 20" style="margin-right: 4px !important;"><input type="checkbox" id="initInputNat20"><span>D20</span></label>
                            <label class="init-nat20-checkbox-label" title="Натуральная 1" style="border-color: #823030 !important;"><input type="checkbox" id="initInputNat1"><span style="color: #ff7675 !important;">D1</span></label>
                            <select id="initInputFaction" style="width: 140px; background: #090f0b; border: 1px solid #543e0d; color: #ebd291; padding: 4px;">
                                <option value="friend">🟢 Союзник</option>
                                <option value="neutral" selected>🟡 Нейтрал</option>
                                <option value="enemy">🔴 Враг</option>
                            </select>
                            <button type="button" class="btn ok" id="initBtnAdd" style="padding: 6px 20px; font-size: 14px; min-width: auto; height: 38px;">⚜ Добавить</button>
                        </div>
                    </div>
                    
                    <div class="init-battle-workspace">
                        <aside id="initBestiaryDrawer" class="init-bestiary-drawer" style="display: none;"></aside>
                        <div id="initBattleMainArea" class="init-battle-main-area">
                            <div id="initiativeCombatantsList" class="init-cards-scroll-list"></div>
                        </div>
                    </div>
                    
                </div>
            `;
            this._isInputsBound = false;
        }

        if (!this._isInputsBound) {
            const nameInp = document.getElementById('initInputName');
            const scoreInp = document.getElementById('initInputScore');
            const nat20Inp = document.getElementById('initInputNat20');
            const nat1Inp = document.getElementById('initInputNat1');
            const audioSel = document.getElementById('initSelectAudioPreset');

            document.getElementById('initBtnNextTurn').addEventListener('click', () => this.nextTurn());
            document.getElementById('initBtnToggleView').addEventListener('click', () => this.toggleViewMode());
            document.getElementById('initBtnResetRoundOnly').addEventListener('click', (e) => {
                e.stopPropagation();
                this.resetRound();
            });
            document.getElementById('initBtnAdd1Min')?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.advanceRounds(10);
            });
            document.getElementById('initBtnAdd10Min')?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.advanceRounds(100);
            });

            document.getElementById('initBtnToggleWeatherFx')?.addEventListener('click', () => this.toggleWeatherFx());

            document.getElementById('initBtnToggleBestiaryDrawer')?.addEventListener('click', () => {
                this._isDrawerOpen = !this._isDrawerOpen;
                this.renderUi();
            });

            const mainArea = document.getElementById('initBattleMainArea');
            if (mainArea) {
                mainArea.addEventListener('dragover', (e) => {
                    if (e.dataTransfer.types.includes('application/x-bestiary-item')) {
                        e.preventDefault();
                        mainArea.classList.add('init-drop-target-active');
                    }
                });
                mainArea.addEventListener('dragleave', () => {
                    mainArea.classList.remove('init-drop-target-active');
                });
                mainArea.addEventListener('drop', (e) => {
                    const raw = e.dataTransfer.getData('application/x-bestiary-item');
                    mainArea.classList.remove('init-drop-target-active');
                    if (!raw) return;
                    e.preventDefault();
                    try {
                        const preset = JSON.parse(raw);
                        if (window.BestiaryManager) {
                            window.BestiaryManager.deployToInitiative(preset);
                        }
                    } catch (err) {
                        console.error('Ошибка перетаскивания из бестиария:', err);
                    }
                });
            }

            if (audioSel) {
                audioSel.value = this.state.audioPreset || 'gong';
                audioSel.addEventListener('change', (e) => this.setAudioPreset(e.target.value));
            }

            nat20Inp.addEventListener('change', () => {
                if (nat20Inp.checked) {
                    scoreInp.value = 20;
                    scoreInp.disabled = true;
                    scoreInp.style.opacity = '0.5';
                    if (nat1Inp) nat1Inp.checked = false;
                } else {
                    scoreInp.disabled = false;
                    scoreInp.style.opacity = '1';
                }
            });
            if (nat1Inp) {
                nat1Inp.addEventListener('change', () => {
                    if (nat1Inp.checked) {
                        scoreInp.value = 1;
                        scoreInp.disabled = true;
                        scoreInp.style.opacity = '0.5';
                        nat20Inp.checked = false;
                    } else {
                        scoreInp.disabled = false;
                        scoreInp.style.opacity = '1';
                    }
                });
            }

            document.getElementById('initBtnAdd').addEventListener('click', () => {
                this.addCombatant(
                    nameInp.value,
                    scoreInp.value,
                    document.getElementById('initInputFaction').value,
                    nat20Inp.checked,
                    nat1Inp ? nat1Inp.checked : false
                );
                nameInp.value = '';
                nat20Inp.checked = false;
                if (nat1Inp) nat1Inp.checked = false;
                scoreInp.disabled = false;
                scoreInp.style.opacity = '1';
                scoreInp.value = '10';
                nameInp.focus();
            });

            const suggestBox = document.getElementById('initNameSuggestions');
            const factionSel = document.getElementById('initInputFaction');
            let activeSuggestIdx = -1;

            const hideSuggestions = () => {
                if (suggestBox) {
                    suggestBox.style.display = 'none';
                    suggestBox.innerHTML = '';
                    activeSuggestIdx = -1;
                }
            };


            const applySuggestion = (item) => {
                nameInp.value = item.displayName + ' ';
                this._pendingAvatarType = item.id;
                if (factionSel && item.defaultFaction) {
                    factionSel.value = item.defaultFaction;
                }
                hideSuggestions();

                nameInp.focus();
                const len = nameInp.value.length;
                nameInp.setSelectionRange(len, len);
            };



            nameInp.addEventListener('input', () => {
                const rawVal = nameInp.value;
                if (!rawVal.trim()) {
                    this._pendingAvatarType = null;
                    hideSuggestions();
                    return;
                }

                if (this._pendingAvatarType && rawVal.endsWith(' ')) {
                    hideSuggestions();
                    return;
                }

                const matches = AvatarRegistry.searchCatalog(rawVal);
                if (matches.length === 0) {
                    hideSuggestions();
                    return;
                }

                activeSuggestIdx = -1;
                suggestBox.innerHTML = matches.map((m, idx) => `
                    <div class="init-suggest-item" data-idx="${idx}">
                        ${m.avatarUrl ? `<img src="${m.avatarUrl}" class="init-suggest-thumb">` : ''}
                        <span class="init-suggest-label">${m.label}</span>
                    </div>
                `).join('');
                suggestBox.style.display = 'block';

                suggestBox.querySelectorAll('.init-suggest-item').forEach((el, idx) => {
                    el.addEventListener('mousedown', (e) => {
                        e.preventDefault();
                        applySuggestion(matches[idx]);
                    });
                });
            });

            nameInp.addEventListener('keydown', (e) => {
                const items = suggestBox.querySelectorAll('.init-suggest-item');
                if (suggestBox.style.display === 'none' || items.length === 0) {
                    if (e.key === 'Enter') document.getElementById('initBtnAdd').click();
                    return;
                }

                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    activeSuggestIdx = (activeSuggestIdx + 1) % items.length;
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    activeSuggestIdx = (activeSuggestIdx - 1 + items.length) % items.length;
                } else if (e.key === 'Enter' && activeSuggestIdx >= 0) {
                    e.preventDefault();
                    items[activeSuggestIdx].dispatchEvent(new MouseEvent('mousedown'));
                    return;
                } else if (e.key === 'Escape') {
                    hideSuggestions();
                    return;
                }

                items.forEach((el, idx) => el.classList.toggle('active', idx === activeSuggestIdx));
                if (activeSuggestIdx >= 0) items[activeSuggestIdx].scrollIntoView({ block: 'nearest' });
            });

            nameInp.addEventListener('blur', () => setTimeout(hideSuggestions, 150));

            this._isInputsBound = true;
        }

        const weatherHost = document.getElementById('initWeatherHost');
        if (weatherHost && window.WeatherManager) {
            weatherHost.innerHTML =
                window.WeatherManager.renderCompactBarHtml() +
                window.WeatherManager.renderCombatWeatherAlertHtml();
            window.WeatherManager.bindBarEvents(weatherHost);
        }

        const listContainer = document.getElementById('initiativeCombatantsList');
        if (!listContainer) return;
        listContainer.innerHTML = '';

        const isBg3 = this.state.viewMode === 'bg3';
        listContainer.classList.toggle('mode-bg3', isBg3);
        document.getElementById('initBtnToggleView').textContent = isBg3 ? '🏹 Режим: Горизонт' : '📜 Режим: Список';

        const fxBtn = document.getElementById('initBtnToggleWeatherFx');
        if (fxBtn) {
            const isFxOn = this.state.weatherFxEnabled !== false;
            fxBtn.textContent = isFxOn ? '🌧️' : '🚫';
            fxBtn.classList.toggle('fx-disabled', !isFxOn);
            fxBtn.title = isFxOn ? 'Анимация погоды: ВКЛ (нажмите, чтобы отключить)' : 'Анимация погоды: ВЫКЛ (нажмите, чтобы включить)';
        }

        const roundNumEl = document.getElementById('initRoundCounterNum');
        if (roundNumEl) roundNumEl.textContent = this.state.round;

        const timeBadgeEl = document.getElementById('initBattleTimeBadge');
        if (timeBadgeEl) timeBadgeEl.textContent = this._formatBattleTime(this.state.round);

        this._syncWeatherVisualEffects(container);

        const oldShield = container.querySelector('.init-focus-quote-shield');
        if (oldShield) oldShield.remove();
        const oldOutZone = container.querySelector('.init-out-combatants-zone');
        if (oldOutZone) oldOutZone.remove();

        if (this.state.combatants.length === 0) {
            listContainer.innerHTML = `<div class="quest-log-empty">Бой не начат. Добавьте участников.</div>`;
            return;
        }

        const activeUnits = this.state.combatants.filter(c => c.status !== 'out');
        const outUnits = this.state.combatants.filter(c => c.status === 'out');

        const activeUnit = activeUnits.find(c => c.id === this.state.selectedUnitId) || activeUnits[0];
        const phrases = activeUnit ? InitiativePhrases.getPhrasesForUnit(activeUnit) : ['Все бойцы выбыли из схватки!'];
        const currentQuoteHTML = phrases[this.state.phraseSeed % phrases.length];

        const createCardElement = (unit, index) => {
            const card = document.createElement('div');
            const isOut = unit.status === 'out';
            const isActive = !isOut && this.state.selectedUnitId === unit.id;

            card.className = `init-combatant-card faction-${unit.faction}`;
            card.className = `init-combatant-card faction-${unit.faction} state-${unit.status || 'active'}`;


            if (isOut) card.classList.add('status-out');
            if (isActive) card.classList.add('selected-turn-gold');
            card.setAttribute('draggable', 'true');
            card.setAttribute('data-id', unit.id);

            const avatarHtml = unit.avatar
                ? `<div class="init-avatar-shield-circle active"><img src="${unit.avatar}"></div>`
                : `<div class="init-avatar-shield-circle">${index + 1}</div>`;

            let scoreClass = 'init-inline-score-input';
            if (unit.isNat20) scoreClass += ' nat-20';
            if (unit.isNat1) scoreClass += ' nat-1';


            const statusSelectHtml = `
                <select class="init-inline-status-select status-${unit.status || 'active'}" data-id="${unit.id}" title="Состояние бойца">
                    <option value="active" ${(!unit.status || unit.status === 'active') ? 'selected' : ''}>${isBg3 ? '⚔' : '⚔ В строю'}</option>
                    <option value="dying" ${unit.status === 'dying' ? 'selected' : ''}>${isBg3 ? '🩸' : '🩸 При смерти'}</option>
                    <option value="prone" ${unit.status === 'prone' ? 'selected' : ''}>${isBg3 ? '💫' : '💫 Распластан'}</option>
                    <option value="out" ${unit.status === 'out' ? 'selected' : ''}>${isBg3 ? '💀' : '💀 Выбыл'}</option>
                </select>
            `;



            card.innerHTML = `
                <div class="init-card-left">
                    <div class="init-turn-pointer-arrow ${isActive ? 'visible' : ''}">▶</div>
                    ${avatarHtml}
                    <div class="init-card-name-text" title="Двойной клик для переименования">${unit.name}</div>
                </div>
                <div class="init-card-right">
                    <select class="init-inline-status-select status-${unit.status || 'active'}" data-id="${unit.id}" title="Состояние бойца">
                        <option value="active" ${(!unit.status || unit.status === 'active') ? 'selected' : ''}>⚔️ В строю</option>
                        <option value="dying" ${unit.status === 'dying' ? 'selected' : ''}>🩸 При смерти</option>
                        <option value="prone" ${unit.status === 'prone' ? 'selected' : ''}>💫 Распластан</option>
                        <option value="out" ${unit.status === 'out' ? 'selected' : ''}>💀 Выбыл</option>
                    </select>
                    <div class="init-select-wrapper avatar-picker-wrapper" style="margin-right: 4px;">
                        <select class="init-inline-avatar-select" data-id="${unit.id}" style="background: #040905; border: 1px solid #543e0d; color: #dfbc6f; padding: 4px 6px; font-size: 14px; border-radius: 4px; cursor: pointer;">
                            ${AvatarRegistry.buildSelectOptionsHtml(unit.avatarType)}
                        </select>
                    </div>
                    <button type="button" class="init-btn-toggle-d20-inline ${unit.isNat20 || unit.isNat1 ? 'active' : ''}">🎲</button>
                    <div class="init-select-wrapper">
                        <select class="init-inline-faction-select" data-id="${unit.id}">
                            <option value="friend" ${unit.faction === 'friend' ? 'selected' : ''}>🟢 Свой</option>
                            <option value="neutral" ${unit.faction === 'neutral' ? 'selected' : ''}>🟡 Нейтрал</option>
                            <option value="enemy" ${unit.faction === 'enemy' ? 'selected' : ''}>🔴 Чужой</option>
                        </select>
                    </div>
                    <div class="init-score-massive-block">
                        <input type="number" class="${scoreClass}" data-id="${unit.id}" value="${unit.score}">
                    </div>
                    <button type="button" class="init-btn-delete-card">×</button>
                </div>
            `;

            this._bindCardEvents(card, unit);
            return card;
        };

        // В режиме списка выбывшие идут в конце общего списка, в горизонте — уходят под цитату
        const mainListUnits = isBg3 ? activeUnits : this.state.combatants;
        mainListUnits.forEach((unit, idx) => listContainer.appendChild(createCardElement(unit, idx)));


        const quoteShield = document.createElement('div');
        quoteShield.className = 'init-focus-quote-shield';

        if (activeUnit) {
            if (activeUnit.status === 'dying') {
                quoteShield.classList.add('quote-state-dying');
            } else if (activeUnit.status === 'prone') {
                quoteShield.classList.add('quote-state-prone');
            } else if (activeUnit.isNat20) {
                quoteShield.classList.add('quote-state-nat20');
            } else if (activeUnit.isNat1) {
                quoteShield.classList.add('quote-state-nat1');
            }
        }

        quoteShield.innerHTML = `<div class="init-focus-phrase-text">${currentQuoteHTML}</div>`;
        listContainer.parentNode.appendChild(quoteShield);


        // Зона выбывших бойцов строго под рамкой с цитатами
        if (isBg3 && outUnits.length > 0) {
            const outZone = document.createElement('div');
            outZone.className = 'init-out-combatants-zone';
            outZone.innerHTML = `
                <div class="init-out-zone-title">💀 Выбыли из боя (${outUnits.length})</div>
                <div class="init-cards-scroll-list mode-bg3 init-out-zone-grid"></div>
            `;
            const outGrid = outZone.querySelector('.init-out-zone-grid');
            outUnits.forEach((unit, idx) => outGrid.appendChild(createCardElement(unit, idx)));
            listContainer.parentNode.appendChild(outZone);
        }

        this._renderBestiaryDrawer();

    },








    _bindCardEvents(card, unit) {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.init-card-name-text')) return;

            if (!['SELECT', 'INPUT', 'BUTTON'].includes(e.target.tagName) && unit.status !== 'out') {
                this.toggleSelectUnit(unit.id);
            }
        });


        const nameEl = card.querySelector('.init-card-name-text');
        if (nameEl) {
            // Отключаем перетаскивание карточки, когда курсор наведён на имя
            nameEl.addEventListener('mouseenter', () => card.setAttribute('draggable', 'false'));
            nameEl.addEventListener('mouseleave', () => {
                if (!nameEl.querySelector('input')) card.setAttribute('draggable', 'true');
            });

            nameEl.addEventListener('click', (e) => {
                e.stopPropagation();
                if (nameEl.querySelector('input')) return;

                card.setAttribute('draggable', 'false');
                const currentName = unit.name;
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'init-inline-name-input';
                input.value = currentName;

                let isFinished = false;
                const finishEdit = (save) => {
                    if (isFinished) return;
                    isFinished = true;
                    card.setAttribute('draggable', 'true');

                    const val = input.value.trim();
                    if (save && val && val !== currentName) {
                        this.updateName(unit.id, val);
                    } else {
                        nameEl.textContent = currentName;
                    }
                };

                input.addEventListener('click', (ev) => ev.stopPropagation());
                input.addEventListener('keydown', (ev) => {
                    ev.stopPropagation();
                    if (ev.key === 'Enter') {
                        ev.preventDefault();
                        finishEdit(true);
                    } else if (ev.key === 'Escape') {
                        ev.preventDefault();
                        finishEdit(false);
                    }
                });
                input.addEventListener('blur', () => finishEdit(true));

                nameEl.textContent = '';
                nameEl.appendChild(input);
                input.focus();
                input.select();
            });
        }



        card.querySelector('.init-inline-status-select').addEventListener('change', (e) => {
            this.updateStatus(unit.id, e.target.value);
        });

        card.querySelector('.init-inline-avatar-select').addEventListener('change', (e) => {
            this.setCombatantAvatar(unit.id, e.target.value);
        });

        card.querySelector('.init-btn-toggle-d20-inline').addEventListener('click', (e) => {
            e.stopPropagation();
            if (!unit.isNat20 && !unit.isNat1) this.toggleNat20(unit.id);
            else if (unit.isNat20) this.toggleNat1(unit.id);
            else {
                unit.isNat1 = false;
                this._sortAndSave();
            }
        });

        const scoreInp = card.querySelector('.init-inline-score-input');
        scoreInp.addEventListener('wheel', (e) => {
            e.preventDefault();
            const direction = e.deltaY < 0 ? 1 : -1;
            const newVal = Math.max(1, Math.min(100, (parseInt(scoreInp.value, 10) || 0) + direction));
            this.updateScore(unit.id, newVal);
        });
        scoreInp.addEventListener('change', (e) => this.updateScore(unit.id, e.target.value));

        card.querySelector('.init-inline-faction-select').addEventListener('change', (e) => {
            this.updateFaction(unit.id, e.target.value);
            this._sortAndSave();
        });

        card.querySelector('.init-btn-delete-card').addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeCombatant(unit.id);
        });

        card.addEventListener('dragstart', (e) => {
            card.classList.add('init-card-dragging');
            e.dataTransfer.setData('text/plain', unit.id);
        });
        card.addEventListener('dragend', () => card.classList.remove('init-card-dragging'));
        card.addEventListener('dragover', (e) => e.preventDefault());
        card.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedId = e.dataTransfer.getData('text/plain');
            const draggedIdx = this.state.combatants.findIndex(c => c.id === draggedId);
            const targetIdx = this.state.combatants.findIndex(c => c.id === unit.id);
            if (draggedIdx !== -1 && targetIdx !== -1) {
                const [draggedItem] = this.state.combatants.splice(draggedIdx, 1);
                this.state.combatants.splice(targetIdx, 0, draggedItem);
                this._saveWithoutSort();
            }
        });
    },





    updateName(id, newName) {
        const cleanName = String(newName || '').trim();
        if (!cleanName) return;

        const unit = this.state.combatants.find(c => c.id === id);
        if (unit && unit.name !== cleanName) {
            unit.name = cleanName;
            if (!unit.avatarType) {
                const guessed = AvatarRegistry.guessAvatarByName(cleanName);
                if (guessed) {
                    unit.avatarType = guessed;
                    unit.avatar = AvatarRegistry.getAvatarDataUrl(guessed);
                }
            }
            this._saveWithoutSort();
        }
    },



    _renderBestiaryDrawer() {
        const drawer = document.getElementById('initBestiaryDrawer');
        const toggleBtn = document.getElementById('initBtnToggleBestiaryDrawer');
        if (!drawer) return;

        if (toggleBtn) {
            toggleBtn.classList.toggle('active-drawer-btn', this._isDrawerOpen);
        }

        if (!this._isDrawerOpen) {
            drawer.style.display = 'none';
            return;
        }

        drawer.style.display = 'flex';
        const party = window.BestiaryManager?.state?.party || [];
        const monsters = window.BestiaryManager?.state?.monsters || [];

        const renderMiniGroup = (title, items, badgeColor) => `
            <div class="init-drawer-section">
                <div class="init-drawer-sec-title" style="color:${badgeColor};">${title} (${items.length})</div>
                <div class="init-drawer-cards-grid">
                    ${items.length === 0 ? `<div class="init-drawer-empty">Пусто (настройте во вкладке 🐉)</div>` : ''}
                    ${items.map(item => `
                        <div class="init-drawer-card faction-${item.faction}" draggable="true" data-preset='${JSON.stringify(item).replace(/'/g, "&apos;")}' title="Перетащите на ленту инициативы или нажмите +">
                            <div class="init-drawer-card-top">${item.name}</div>
                            <div class="init-drawer-card-img">
                                ${item.avatar ? `<img src="${item.avatar}">` : `<span>⚔️</span>`}
                            </div>
                            <div class="init-drawer-card-bot">
                                <span class="init-drawer-score">${item.defaultScore}</span>
                                <button type="button" class="init-drawer-add-one" title="Добавить в бой">+</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        drawer.innerHTML = `
            <div class="init-drawer-header">
                <span>🐉 Заготовки боя</span>
                <button type="button" id="initDrawerGoTab" class="btn cc" style="padding:2px 8px; font-size:12px;">Настроить</button>
            </div>
            <div class="init-drawer-scroll">
                ${renderMiniGroup('🛡️ Отряд', party, '#2ecc71')}
                ${renderMiniGroup('👹 Монстры', monsters, '#ff7675')}
            </div>
        `;

        drawer.querySelector('#initDrawerGoTab')?.addEventListener('click', () => {
            if (window.HudWindowManager) window.HudWindowManager.open('bestiary');
        });

        drawer.querySelectorAll('.init-drawer-card').forEach(cardEl => {
            const preset = JSON.parse(cardEl.dataset.preset);

            cardEl.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('application/x-bestiary-item', cardEl.dataset.preset);
                cardEl.classList.add('dragging');
            });
            cardEl.addEventListener('dragend', () => cardEl.classList.remove('dragging'));

            cardEl.querySelector('.init-drawer-add-one')?.addEventListener('click', (e) => {
                e.stopPropagation();
                if (window.BestiaryManager) {
                    window.BestiaryManager.deployToInitiative(preset);
                }
            });
        });
    },


};

export default InitiativeManager;

