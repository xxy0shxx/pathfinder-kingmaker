/**
 * МОДУЛЬ: ТРЕКЕР ИНИЦИАТИВЫ С ТВ-СТРЕЛКОЙ ХОДА И ВСПЫШКОЙ НОВОГО РАУНДА
 */
const InitiativeManager = {
    state: {
        combatants: [],
        selectedUnitId: null,
        round: 1,
        viewMode: 'classic' // Добавляем поддержку режимов: 'classic' или 'bg3'
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

    addCombatant(name, score, faction, isNat20) {
        const cleanName = String(name).trim();
        let parsedScore = isNat20 ? 20 : parseInt(score, 10);

        if (!cleanName) { alert("Введите имя или название существа!"); return; }
        if (isNaN(parsedScore) || parsedScore < 1 || parsedScore > 100) { alert("Инициатива должна быть от 1 до 100!"); return; }

        const newUnit = {
            id: 'unit_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            name: cleanName,
            score: parsedScore,
            faction: faction || 'neutral',
            isNat20: !!isNat20
        };

        this.state.combatants.push(newUnit);
        if (this.state.combatants.length === 1) {
            this.state.selectedUnitId = newUnit.id;
        }
        this._sortAndSave();
    },

    nextTurn() {
        if (this.state.combatants.length === 0) return;

        const currentIndex = this.state.combatants.findIndex(c => c.id === this.state.selectedUnitId);

        if (currentIndex === -1 || currentIndex === this.state.combatants.length - 1) {
            this.state.selectedUnitId = this.state.combatants[0].id;
            this.state.round += 1;
            this.triggerRoundFlashEffect();
        } else {
            this.state.selectedUnitId = this.state.combatants[currentIndex + 1].id;
        }

        this._saveWithoutSort();
    },

    triggerRoundFlashEffect() {
        const oldFlash = document.getElementById('initTvRoundFlashOverlay');
        if (oldFlash) oldFlash.remove();

        const flashOverlay = document.createElement('div');
        flashOverlay.id = 'initTvRoundFlashOverlay';

        flashOverlay.style.cssText = `
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            pointer-events: none !important;
            z-index: 299999999 !important;
            box-shadow: inset 0 0 200px 50px rgba(255, 216, 117, 0.6) !important;
            background-color: rgba(255, 216, 117, 0.12) !important;
            opacity: 1 !important;
            transition: opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
        `;

        document.body.appendChild(flashOverlay);

        requestAnimationFrame(() => {
            flashOverlay.style.opacity = '0';
        });

        setTimeout(() => {
            if (flashOverlay.parentNode) flashOverlay.remove();
        }, 600);
    },
    toggleNat20(id) {
        const unit = this.state.combatants.find(c => c.id === id);
        if (unit) {
            unit.isNat20 = !unit.isNat20;
            if (unit.isNat20) unit.score = 20;
            this._sortAndSave();
        }
    },

    updateScore(id, newScore) {
        const val = parseInt(newScore, 10);
        if (isNaN(val) || val < 1 || val > 100) return;

        const unit = this.state.combatants.find(c => c.id === id);
        if (unit) {
            unit.score = val;
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
            this._saveWithoutSort();

            const badge = document.querySelector('.init-round-counter-badge');
            if (badge) {
                badge.style.setProperty('filter', 'brightness(1.5)', 'important');
                setTimeout(() => badge.style.removeProperty('filter'), 300);
            }
        }
    },

    clearAll() {
        if (confirm("Полностью очистить боевой трекер инициативы?")) {
            this.state.combatants = [];
            this.state.selectedUnitId = null;
            this.state.round = 1;
            this._saveWithoutSort();
        }
    },

    toggleSelectUnit(id) {
        this.state.selectedUnitId = (this.state.selectedUnitId === id) ? null : id;
        this._saveWithoutSort();
    },

    _sortAndSave() {
        this.state.combatants.sort((a, b) => {
            if (a.isNat20 && !b.isNat20) return -1;
            if (!a.isNat20 && b.isNat20) return 1;
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
                            
                            <button type="button" id="initBtnToggleView" class="init-btn-view-toggle" title="Сменить стиль отображения">⚔️ Режим: Списки / BG3</button>
                            
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

                            <label class="init-nat20-checkbox-label" title="Натуральная 20 на кубике d20">
                                <input type="checkbox" id="initInputNat20">
                                <span>D20</span>
                            </label>

                            <select id="initInputFaction" style="width: 140px; background: #090f0b; border: 1px solid #543e0d; color: #ebd291; padding: 4px;">
                                <option value="friend">🟢 Союзник</option>
                                <option value="neutral" selected>⚪ Нейтрал</option>
                                <option value="enemy">🔴 Враг</option>
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
            const nameInp = document.getElementById('initInputName');
            const scoreInp = document.getElementById('initInputScore');
            const factInp = document.getElementById('initInputFaction');
            const nat20Inp = document.getElementById('initInputNat20');

            document.getElementById('initBtnNextTurn').addEventListener('click', () => this.nextTurn());
            document.getElementById('initBtnToggleView').addEventListener('click', () => this.toggleViewMode());

            document.getElementById('initBtnResetRoundOnly').addEventListener('click', (e) => {
                e.stopPropagation();
                this.resetRound();
            });

            nat20Inp.addEventListener('change', () => {
                if (nat20Inp.checked) {
                    scoreInp.value = 20; scoreInp.disabled = true; scoreInp.style.opacity = '0.5';
                } else {
                    scoreInp.disabled = false; scoreInp.style.opacity = '1';
                }
            });

            document.getElementById('initBtnAdd').addEventListener('click', () => {
                this.addCombatant(nameInp.value, scoreInp.value, factInp.value, nat20Inp.checked);
                nameInp.value = ''; nat20Inp.checked = false; scoreInp.disabled = false; scoreInp.style.opacity = '1';
                nameInp.focus();
            });

            this._isInputsBound = true;
        }

        const listContainer = document.getElementById('initiativeCombatantsList');
        if (!listContainer) return;
        listContainer.innerHTML = '';

        if (this.state.viewMode === 'bg3') {
            listContainer.classList.add('mode-bg3');
            document.getElementById('initBtnToggleView').textContent = '🏹 Режим: BG3 (Горизонт)';
        } else {
            listContainer.classList.remove('mode-bg3');
            document.getElementById('initBtnToggleView').textContent = '📜 Режим: Списки (Вертикаль)';
        }

        const roundNumEl = document.getElementById('initRoundCounterNum');
        if (roundNumEl) roundNumEl.textContent = this.state.round;

        if (this.state.combatants.length === 0) {
            listContainer.innerHTML = `<div class="quest-log-empty">Бой не начат. Добавьте участников.</div>`;
            return;
        }

        this.state.combatants.forEach((unit, index) => {
            const card = document.createElement('div');
            const isActive = this.state.selectedUnitId === unit.id;
            card.className = `init-combatant-card faction-${unit.faction}`;
            card.setAttribute('draggable', 'true');
            card.setAttribute('data-id', unit.id);
            if (isActive) card.classList.add('selected-turn-gold');

            card.innerHTML = `
                <div class="init-card-left" style="pointer-events: none;">
                    <div class="init-turn-pointer-arrow ${isActive ? 'visible' : ''}">▶</div>
                    <div class="init-badge-index">${index + 1}</div>
                    <div class="init-card-name-text">${unit.name}</div>
                    ${unit.isNat20 ? '<span class="init-crown-badge" title="Натуральная 20! Крит успех">👑</span>' : ''}
                </div>
                <div class="init-card-right">
                    <button type="button" class="init-btn-toggle-d20-inline ${unit.isNat20 ? 'active' : ''}" data-id="${unit.id}">🎲</button>
                    <div class="init-select-wrapper">
                        <select class="init-inline-faction-select" data-id="${unit.id}">
                            <option value="friend" ${unit.faction === 'friend' ? 'selected' : ''}>🟢 Свой</option>
                            <option value="neutral" ${unit.faction === 'neutral' ? 'selected' : ''}>⚪ Нейтрал</option>
                            <option value="enemy" ${unit.faction === 'enemy' ? 'selected' : ''}>🔴 Чужой</option>
                        </select>
                    </div>
                    <div class="init-score-massive-block">
                        <input type="number" class="init-inline-score-input" data-id="${unit.id}" value="${unit.score}" min="1" max="100">
                    </div>
                    <button type="button" class="init-btn-delete-card" data-id="${unit.id}">×</button>
                </div>
            `;

            card.addEventListener('click', (e) => {
                if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
                this.toggleSelectUnit(unit.id);
            });

            card.querySelector('.init-btn-toggle-d20-inline').addEventListener('click', (e) => {
                e.stopPropagation(); this.toggleNat20(e.target.dataset.id);
            });

            const scoreInp = card.querySelector('.init-inline-score-input');
            scoreInp.addEventListener('wheel', (e) => {
                e.preventDefault();
                const direction = e.deltaY < 0 ? 1 : -1;
                const newVal = Math.max(1, Math.min(100, (parseInt(scoreInp.value, 10) || 0) + direction));
                scoreInp.value = newVal; this.updateScore(unit.id, newVal);
            });

            scoreInp.addEventListener('change', (e) => this.updateScore(e.target.dataset.id, e.target.value));

            card.querySelector('.init-inline-faction-select').addEventListener('change', (e) => {
                this.updateFaction(e.target.dataset.id, e.target.value); this._sortAndSave();
            });

            card.querySelector('.init-btn-delete-card').addEventListener('click', (e) => {
                this.removeCombatant(e.target.dataset.id); this._sortAndSave();
            });

            card.addEventListener('dragstart', (e) => {
                card.classList.add('init-card-dragging');
                e.dataTransfer.setData('text/plain', unit.id); e.dataTransfer.effectAllowed = 'move';
            });
            card.addEventListener('dragend', () => {
                card.classList.remove('init-card-dragging');
                document.querySelectorAll('.init-combatant-card').forEach(c => c.classList.remove('init-drag-over'));
            });
            card.addEventListener('dragover', (e) => { e.preventDefault(); card.classList.add('init-drag-over'); });
            card.addEventListener('dragleave', () => card.classList.remove('init-drag-over'));
            card.addEventListener('drop', (e) => {
                e.preventDefault(); const draggedId = e.dataTransfer.setData('text/plain'); if (draggedId === unit.id) return;
                const draggedIdx = this.state.combatants.findIndex(c => c.id === draggedId);
                const targetIdx = this.state.combatants.findIndex(c => c.id === unit.id);
                if (draggedIdx !== -1 && targetIdx !== -1) {
                    const [draggedItem] = this.state.combatants.splice(draggedIdx, 1);
                    this.state.combatants.splice(targetIdx, 0, draggedItem); this._saveWithoutSort();
                }
            });

            listContainer.appendChild(card);
        });
    }
};

export default InitiativeManager;
