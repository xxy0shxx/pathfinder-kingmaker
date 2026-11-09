/**
 * МОДУЛЬ: ТРЕКЕР ИНИЦИАТИВЫ С ТВ-СТРЕЛКОЙ ХОДА И ВСПЫШКОЙ НОВОГО РАУНДА
 */
const InitiativeManager = {
    state: {
        combatants: [],
        selectedUnitId: null,
        round: 1,
        viewMode: 'classic',
        phraseSeed: 0
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
            isNat1: !!isNat1
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

        // Гарантированно обновляем сид фразы абсолютно на каждый ход
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
        setTimeout(() => { if (flashOverlay.parentNode) flashOverlay.remove(); }, 600);
    },

    getEpicPhrases(activeName) {
        return [
            `Судьба замерла в ожидании... <span class="gold-unit-focus-name">⚜️ ${activeName} ⚜️</span> готовит сокрушительный удар!`,
            `Внимание на поле боя! Сквозь пламя и хаос вперед рвется <span class="gold-unit-focus-name">⚔️ ${activeName} ⚔️</span>!`,
            `Инициатива переходит в руки мастера. <span class="gold-unit-focus-name">🔮 ${activeName} 🔮</span> диктует свои условия!`,
            `Смертоносная сталь жаждет крови. Секунда триумфа принадлежит <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span>!`,
            `Воздух пропитан яростью. <span class="gold-unit-focus-name">💀 ${activeName} 💀</span> вступает в игру, меняя ход истории!`,
            `Клинок обнажен, заклинание сорвалось с губ! Время замерло для <span class="gold-unit-focus-name">⚡ ${activeName} ⚡</span>!`,
            `Каждый шаг может стать последним. Великий финал или крах — решать только <span class="gold-unit-focus-name">🦅 ${activeName} 🦅</span>!`,
            `Вспышка магии озаряет арену! Исход схватки теперь полностью зависит от <span class="gold-unit-focus-name">🔥 ${activeName} 🔥</span>!`,
            `Тени сгущаются, враги затаили дыхание. На острие атаки оказывается <span class="gold-unit-focus-name">🐺 ${activeName} 🐺</span>!`,
            `Эпическая битва Kingmaker требует героев. Судьба отряда в руках <span class="gold-unit-focus-name">👑 ${activeName} 👑</span>!`,
            `Слышен грохот стали! <span class="gold-unit-focus-name">🔱 ${activeName} 🔱</span> обрушивает ярость на позиции врага!`,
            `Тактический перелом близок. Какое решение примет <span class="gold-unit-focus-name">🎯 ${activeName} 🎯</span> в этот судьбоносный миг?`,
            `В жилах кипит адреналин. <span class="gold-unit-focus-name">🩸 ${activeName} 🩸</span> выходит на идеальную позицию для атаки!`,
            `Земля содрогается от поступи рока. Ход делает непреклонный <span class="gold-unit-focus-name">⛰️ ${activeName} ⛰️</span>!`,
            `Удар из тени неизбежен. <span class="gold-unit-focus-name">🗡️ ${activeName} 🗡️</span> выбирает следующую жертву!`
        ];
    },

    getExtraPhrases(activeName) {
        return [
            `Боги наблюдают за этой схваткой. Оправдает ли их ожидания <span class="gold-unit-focus-name">☀️ ${activeName} ☀️</span>?`,
            `Ни шагу назад! Сквозь плотные ряды врагов прорывается <span class="gold-unit-focus-name">🚩 ${activeName} 🚩</span>!`,
            `Древнее пророчество исполняется здесь. Слово за бесстрашным <span class="gold-unit-focus-name">📜 ${activeName} 📜</span>!`,
            `Холодный расчет побеждает ярость. <span class="gold-unit-focus-name">❄️ ${activeName} ❄️</span> начинает свой безупречный ход!`,
            `Победа близка как никогда. Сможет ли <span class="gold-unit-focus-name">🏆 ${activeName} 🏆</span> поставить финальную точку?`,
            `Пороховой дым и свист стрел! На передовую влетает стремительный <span class="gold-unit-focus-name">🏹 ${activeName} 🏹</span>!`,
            `Жребий брошен, отступать некуда. Вся слава или вечное забвение ждут <span class="gold-unit-focus-name">🎲 ${activeName} 🎲</span>!`,
            `Старые обиды будут смыты кровью. Время расплаты пришло для <span class="gold-unit-focus-name">⛓️ ${activeName} ⛓️</span>!`,
            `Искры сыплются от скрежета доспехов. Свою доблесть доказывает <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span>!`,
            `Смерч разрушения приближается. В самом центре бури оказывается <span class="gold-unit-focus-name">🌪️ ${activeName} 🌪️</span>!`,
            `Магические потоки сплетаются воедино. Смертоносное плетение покорно <span class="gold-unit-focus-name">✨ ${activeName} ✨</span>!`,
            `Сердца бьются в унисон с громом битвы. Команду к действию берет <span class="gold-unit-focus-name">📣 ${activeName} 📣</span>!`,
            `Никто не избежит возмездия. Карающий молот поднимает могучий <span class="gold-unit-focus-name">🔨 ${activeName} 🔨</span>!`,
            `Бездна вглядывается в души смертных. Мрачный и непостижимый ход совершает <span class="gold-unit-focus-name">👁️ ${activeName} 👁️</span>!`,
            `Вендетта достигает своего апогея! Поле боя принадлежит грозному <span class="gold-unit-focus-name">⚔️ ${activeName} ⚔️</span>!`
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
            document.getElementById('initBtnNextTurn').addEventListener('click', () => this.nextTurn());
            document.getElementById('initBtnToggleView').addEventListener('click', () => this.toggleViewMode());
            document.getElementById('initBtnResetRoundOnly').addEventListener('click', (e) => { e.stopPropagation(); this.resetRound(); });

            nat20Inp.addEventListener('change', () => { if (nat20Inp.checked) { scoreInp.value = 20; scoreInp.disabled = true; scoreInp.style.opacity = '0.5'; if (nat1Inp) nat1Inp.checked = false; } else { scoreInp.disabled = false; scoreInp.style.opacity = '1'; } });
            if (nat1Inp) { nat1Inp.addEventListener('change', () => { if (nat1Inp.checked) { scoreInp.value = 1; scoreInp.disabled = true; scoreInp.style.opacity = '0.5'; nat20Inp.checked = false; } else { scoreInp.disabled = false; scoreInp.style.opacity = '1'; } }); }

            document.getElementById('initBtnAdd').addEventListener('click', () => { this.addCombatant(nameInp.value, scoreInp.value, document.getElementById('initInputFaction').value, nat20Inp.checked, nat1Inp ? nat1Inp.checked : false); nameInp.value = ''; nat20Inp.checked = false; if (nat1Inp) nat1Inp.checked = false; scoreInp.disabled = false; scoreInp.style.opacity = '1'; scoreInp.value = '10'; nameInp.focus(); });
            this._isInputsBound = true;
        }

        const listContainer = document.getElementById('initiativeCombatantsList'); if (!listContainer) return; listContainer.innerHTML = '';
        if (this.state.viewMode === 'bg3') { listContainer.classList.add('mode-bg3'); document.getElementById('initBtnToggleView').textContent = '🏹 Режим: Горизонт'; }
        else { listContainer.classList.remove('mode-bg3'); document.getElementById('initBtnToggleView').textContent = '📜 Режим: Список'; }
        const roundNumEl = document.getElementById('initRoundCounterNum'); if (roundNumEl) roundNumEl.textContent = this.state.round;
        const oldShield = container.querySelector('.init-focus-quote-shield'); if (oldShield) oldShield.remove();
        if (this.state.combatants.length === 0) { listContainer.innerHTML = `<div class="quest-log-empty">Бой не начат. Добавьте участников.</div>`; return; }

        const activeUnit = this.state.combatants.find(c => c.id === this.state.selectedUnitId) || this.state.combatants[0];
        const activeName = activeUnit ? activeUnit.name : 'Неизвестно';
        const phrases = [...this.getEpicPhrases(activeName), ...this.getExtraPhrases(activeName)];
        const currentQuoteHTML = phrases[this.state.phraseSeed % phrases.length];

        this.state.combatants.forEach((unit, index) => {
            const card = document.createElement('div'); const isActive = this.state.selectedUnitId === unit.id;
            card.className = `init-combatant-card faction-${unit.faction}`; card.setAttribute('draggable', 'true'); card.setAttribute('data-id', unit.id);
            if (isActive) card.classList.add('selected-turn-gold');
            let statusIcon = ''; if (unit.isNat20) statusIcon = '<span class="init-crown-badge">👑</span>'; if (unit.isNat1) statusIcon = '<span class="init-nat1-skull-badge">💀</span>';

            card.innerHTML = `
                <div class="init-card-left" style="pointer-events: none;"><div class="init-turn-pointer-arrow ${isActive ? 'visible' : ''}">▶</div><div class="init-badge-index">${index + 1}</div><div class="init-card-name-text">${unit.name}</div>${statusIcon}</div>
                <div class="init-card-right"><button type="button" class="init-btn-toggle-d20-inline ${unit.isNat20 || unit.isNat1 ? 'active' : ''}">🎲</button><div class="init-select-wrapper"><select class="init-inline-faction-select" data-id="${unit.id}"><option value="friend" ${unit.faction === 'friend' ? 'selected' : ''}>🟢 Свой</option><option value="neutral" ${unit.faction === 'neutral' ? 'selected' : ''}>💛 Нейтрал</option><option value="enemy" ${unit.faction === 'enemy' ? 'selected' : ''}>🔴 Чужой</option></select></div><div class="init-score-massive-block"><input type="number" class="init-inline-score-input" data-id="${unit.id}" value="${unit.score}"></div><button type="button" class="init-btn-delete-card">×</button></div>
            `;
            card.addEventListener('click', (e) => { if (e.target.tagName !== 'SELECT' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') this.toggleSelectUnit(unit.id); });
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
    }
};

export default InitiativeManager;

