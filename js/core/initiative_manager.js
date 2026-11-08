/**
 * МОДУЛЬ: ТРЕКЕР ИНИЦИАТИВЫ И БОЕВОЙ МЕНЕДЖЕР С ПОДДЕРЖКОЙ DRAG-AND-DROP И SCROLL-ИЗМЕНЕНИЙ
 */
const InitiativeManager = {
    state: {
        combatants: [],
        selectedUnitId: null // Запоминаем персонажа, чей сейчас ход
    },
    mapDataRef: null,
    onSaveCallback: null,

    init(mapData, onSave) {
        try {
            this.mapDataRef = mapData || { hexes: {}, kingdom: null, initiative: null };
            this.onSaveCallback = onSave;

            if (this.mapDataRef.initiative) {
                this.state = this.mapDataRef.initiative;
                if (!Array.isArray(this.state.combatants)) this.state.combatants = [];
            } else {
                this.mapDataRef.initiative = this.state;
            }

            window.InitiativeManager = this;
            this.renderUi();
        } catch (e) { console.error("Ошибка инициализации InitiativeManager:", e); }
    },

    updateMapData(newMapData) {
        this.mapDataRef = newMapData || { hexes: {}, kingdom: null, initiative: null };
        if (this.mapDataRef.initiative && Array.isArray(this.mapDataRef.initiative.combatants)) {
            this.state = this.mapDataRef.initiative;
        }
        this.renderUi();
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
        if (this.state.selectedUnitId === id) this.state.selectedUnitId = null;
        this._saveWithoutSort();
    },

    clearAll() {
        if (confirm("Полностью очистить боевой трекер инициативы?")) {
            this.state.combatants = [];
            this.state.selectedUnitId = null;
            this._saveWithoutSort();
        }
    },

    toggleSelectUnit(id) {
        // Если кликнули по уже выбранному — снимаем выделение, иначе активируем золотой круг ходов
        this.state.selectedUnitId = (this.state.selectedUnitId === id) ? null : id;
        this._saveWithoutSort();
    },

    /**
     * Двухфакторная сортировка боевой сцены: Натуральная 20 ВСЕГДА идет первой,
     * а внутри групп участники выстраиваются по убыванию инициативы
     */
    _sortAndSave() {
        this.state.combatants.sort((a, b) => {
            // 1. Проверяем приоритет Натуральной 20
            if (a.isNat20 && !b.isNat20) return -1;  // 'a' идет выше
            if (!a.isNat20 && b.isNat20) return 1;   // 'b' идет выше

            // 2. Если у обоих есть (или нет) Натуральная 20, сортируем по числовому значению
            return b.score - a.score;
        });

        this._saveWithoutSort();
    },

    _saveWithoutSort() {
        if (this.mapDataRef) this.mapDataRef.initiative = this.state;
        if (this.onSaveCallback) this.onSaveCallback();
        else localStorage.setItem('hexMapSystemData', JSON.stringify(this.mapDataRef));
        this.renderUi();
    },
    /**
     * Динамическая генерация HTML-панели трекера инициативы с поддержкой скролла и Drag-and-Drop
     */


    /**
     * Добавление бойца (Автоматическое выставление 20 при Натуральной 20)
     */
    addCombatant(name, score, faction, isNat20) {
        const cleanName = String(name).trim();

        // Если выставлена Натуральная 20, жестко перезаписываем значение инициативы на 20
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
        this._sortAndSave();
    },

    /**
     * Переключение статуса D20 на карточке с авто-коррекцией значения на 20
     */
    toggleNat20(id) {
        const unit = this.state.combatants.find(c => c.id === id);
        if (unit) {
            unit.isNat20 = !unit.isNat20;
            // Если ГМ включил маркер крита — выставляем инициативу ровно 20
            if (unit.isNat20) {
                unit.score = 20;
            }
            this._sortAndSave(); // Пересортировываем список, так как значение изменилось
        }
    },


    renderUi() {
        const container = document.getElementById('initiativeTabletContainer');
        if (!container) return;

        // 1. Встраиваем чекбокс [ ] D20 в быструю панель ввода ГМа
        if (!container.querySelector('.init-header-zone')) {
            container.innerHTML = `
                <div class="initiative-tablet-content" style="width: 100%;">
                    <div class="init-header-zone">
                        <div class="init-quick-input-bar">
                            <input type="text" id="initInputName" placeholder="Имя персонажа / Название монстра...">
                            
                            <div class="camp-count-controls" style="padding: 2px 8px;">
                                <span class="camp-param-label" style="font-size: 16px; margin-right: 4px;">Иниц:</span>
                                <button type="button" onclick="document.getElementById('initInputScore').value = Math.max(1, parseInt(document.getElementById('initInputScore').value, 10) - 1)">-</button>
                                <input type="text" id="initInputScore" value="10" style="width: 50px; text-align: center; background: #000; border: 1px solid #543e0d; color: #fff; font-weight: bold;">
                                <button type="button" onclick="document.getElementById('initInputScore').value = Math.min(100, parseInt(document.getElementById('initInputScore').value, 10) + 1)">+</button>
                            </div>

                            <!-- НОВЫЙ ЧЕКБОКС НАТУРАЛЬНОЙ 20 -->
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
                            <button type="button" class="btn del" id="initBtnClearAll" style="padding: 6px 14px; font-size: 14px; min-width: auto; height: 38px;" title="Очистить весь бой">🔄 Сброс</button>
                        </div>
                    </div>
                    <div id="initiativeCombatantsList" class="init-cards-scroll-list"></div>
                </div>
            `;

            document.getElementById('initBtnAdd').addEventListener('click', () => {
                const nameInp = document.getElementById('initInputName');
                const scoreInp = document.getElementById('initInputScore');
                const factInp = document.getElementById('initInputFaction');
                const nat20Inp = document.getElementById('initInputNat20');

                // РЕАКТИВНАЯ ПОДСТАНОВКА: Изменяем значение инпута при клике на чекбокс D20
                nat20Inp.addEventListener('change', () => {
                    if (nat20Inp.checked) {
                        scoreInp.value = 20;
                        scoreInp.disabled = true; // Блокируем ручной ввод, пока активен крит
                        scoreInp.style.opacity = '0.5';
                    } else {
                        scoreInp.disabled = false;
                        scoreInp.style.opacity = '1';
                    }
                });

                document.getElementById('initBtnAdd').addEventListener('click', () => {
                    this.addCombatant(nameInp.value, scoreInp.value, factInp.value, nat20Inp.checked);

                    nameInp.value = '';
                    nat20Inp.checked = false;
                    scoreInp.disabled = false; // Разблокируем инпут для следующего броска
                    scoreInp.style.opacity = '1';
                    nameInp.focus();
                });


                this.addCombatant(nameInp.value, scoreInp.value, factInp.value, nat20Inp.checked);

                nameInp.value = '';
                nat20Inp.checked = false; // Сбрасываем чекбокс для следующего бойца
                nameInp.focus();
            });

            document.getElementById('initBtnClearAll').addEventListener('click', () => this.clearAll());
        }

        const listContainer = document.getElementById('initiativeCombatantsList');
        if (!listContainer) return;
        listContainer.innerHTML = '';

        if (this.state.combatants.length === 0) {
            listContainer.innerHTML = `<div class="quest-log-empty">Бой не начат. Добавьте участников или монстров через верхнюю панель.</div>`;
            return;
        }

        this.state.combatants.forEach((unit, index) => {
            const card = document.createElement('div');
            card.className = `init-combatant-card faction-${unit.faction}`;
            card.setAttribute('draggable', 'true');
            card.setAttribute('data-id', unit.id);
            if (this.state.selectedUnitId === unit.id) card.classList.add('selected-turn-gold');

            // 2. ВСТРАИВАЕМ ИНДИКАТОР КОРОНЫ "👑" НА КАРТОЧКУ, ЕСЛИ ОНА АКТИВИРОВАНА
            card.innerHTML = `
                <div class="init-card-left" style="pointer-events: none;">
                    <div class="init-badge-index">${index + 1}</div>
                    <div class="init-card-name-text">
                        ${unit.name} 
                        ${unit.isNat20 ? '<span class="init-crown-badge" title="Натуральная 20! Крит успех">👑</span>' : ''}
                    </div>
                </div>
                <div class="init-card-right">
                    <!-- Быстрое переключение статуса D20 кликом на иконку в карточке -->
                    <button type="button" class="init-btn-toggle-d20-inline ${unit.isNat20 ? 'active' : ''}" data-id="${unit.id}" title="Переключить маркер крита D20">🎲</button>
                    
                    <div class="init-select-wrapper">
                        <select class="init-inline-faction-select" data-id="${unit.id}">
                            <option value="friend" ${unit.faction === 'friend' ? 'selected' : ''}>🟢 Свой</option>
                            <option value="neutral" ${unit.faction === 'neutral' ? 'selected' : ''}>⚪ Нейтрал</option>
                            <option value="enemy" ${unit.faction === 'enemy' ? 'selected' : ''}>🔴 Чужой</option>
                        </select>
                    </div>
                    <div class="init-score-massive-block" title="Прокрутите колесико мыши для изменения">
                        <input type="number" class="init-inline-score-input" data-id="${unit.id}" value="${unit.score}" min="1" max="100">
                    </div>
                    <button type="button" class="init-btn-delete-card" data-id="${unit.id}">×</button>
                </div>
            `;

            card.addEventListener('click', (e) => {
                if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
                this.toggleSelectUnit(unit.id);
            });

            // Переключатель D20 инлайн (кнопка с кубиком 🎲)
            card.querySelector('.init-btn-toggle-d20-inline').addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleNat20(e.target.dataset.id); // Метод toggleNat20 уже сам вызывает _sortAndSave()
            });

            // ИНТЕГРАЦИЯ КОЛЕСИКА МЫШИ (Изменение инициативы при наведении)
            const scoreInp = card.querySelector('.init-inline-score-input');
            scoreInp.addEventListener('wheel', (e) => {
                e.preventDefault(); // Блокируем скролл всей страницы
                const direction = e.deltaY < 0 ? 1 : -1;
                const currentVal = parseInt(scoreInp.value, 10) || 0;
                const newVal = Math.max(1, Math.min(100, currentVal + direction));
                scoreInp.value = newVal;
                this.updateScore(unit.id, newVal);
            });

            scoreInp.addEventListener('change', (e) => {
                this.updateScore(e.target.dataset.id, e.target.value);
            });

            // Изменение фракции: теперь тоже вызывает пересортировку, чтобы обновить списки на ТВ
            card.querySelector('.init-inline-faction-select').addEventListener('change', (e) => {
                this.updateFaction(e.target.dataset.id, e.target.value);
                this._sortAndSave(); // Форсируем обновление приоритетов
            });

            card.querySelector('.init-btn-delete-card').addEventListener('click', (e) => {
                this.removeCombatant(e.target.dataset.id);
                this._sortAndSave();
            });

            // ============================================================================
            // РЕАЛИЗАЦИЯ DRAG AND DROP (МЕНЯЕМ ЭЛЕМЕНТЫ МЕСТАМИ)
            // ============================================================================
            card.addEventListener('dragstart', (e) => {
                card.classList.add('init-card-dragging');
                e.dataTransfer.setData('text/plain', unit.id);
                e.dataTransfer.effectAllowed = 'move';
            });

            card.addEventListener('dragend', () => {
                card.classList.remove('init-card-dragging');
                document.querySelectorAll('.init-combatant-card').forEach(c => c.classList.remove('init-drag-over'));
            });

            card.addEventListener('dragover', (e) => {
                e.preventDefault(); // Разрешаем drop
                card.classList.add('init-drag-over');
            });

            card.addEventListener('dragleave', () => {
                card.classList.remove('init-drag-over');
            });

            card.addEventListener('drop', (e) => {
                e.preventDefault();
                const draggedId = e.dataTransfer.getData('text/plain');
                if (draggedId === unit.id) return;

                const draggedIdx = this.state.combatants.findIndex(c => c.id === draggedId);
                const targetIdx = this.state.combatants.findIndex(c => c.id === unit.id);

                if (draggedIdx !== -1 && targetIdx !== -1) {
                    // Извлекаем перетаскиваемый объект и вставляем его на новое место
                    const [draggedItem] = this.state.combatants.splice(draggedIdx, 1);
                    this.state.combatants.splice(targetIdx, 0, draggedItem);
                    this._saveWithoutSort(); // Сохраняем пользовательский порядок ГМа
                }
            });

            listContainer.appendChild(card);
        });
    }
};

export default InitiativeManager;
