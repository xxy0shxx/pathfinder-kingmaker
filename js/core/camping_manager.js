import AnimationManager from '../services/animation_manager.js';
import { MAP_CONFIG } from '../config/app_config.js';

// ============================================================================
// МОДУЛЬ: МЕНЕДЖЕР ПРИВАЛА (CAMPING MANAGER) — ЧАСТЬ 1 ИЗ 3
// ============================================================================

const CampingManager = {
    state: {
        baseChecks: 2,
        checkMod: 12,
        normalIngredients: 0,
        specialIngredients: 0,
        encounterDc: 0,
        totalChecks: 2,
        currentHexRegionLevel: 1
    },
    mapDataRef: null,
    onSaveCallback: null,

    init(mapData, onSave) {
        try {
            this.mapDataRef = mapData || { hexes: {}, kingdom: null, camping: null };
            this.onSaveCallback = onSave;

            if (this.mapDataRef.camping) {
                this.state = this.mapDataRef.camping;
                if (this.state.baseChecks === undefined || isNaN(this.state.baseChecks)) this.state.baseChecks = 2;
                if (this.state.checkMod === undefined || isNaN(this.state.checkMod) || this.state.checkMod === 0) this.state.checkMod = 12;
            } else {
                this.mapDataRef.camping = this.state;
            }

            window.CampingManager = this;
            this.syncCountersUi();
            this.recalculateCamp();
            this.attachInputListeners();
        } catch (e) { console.error("Ошибка инициализации CampingManager:", e); }
    },

    updateMapData(newMapData) {
        try {
            this.mapDataRef = newMapData || { hexes: {}, kingdom: null, camping: null };
            if (this.mapDataRef.camping) {
                this.state = this.mapDataRef.camping;
                if (this.state.baseChecks === undefined || isNaN(this.state.baseChecks)) this.state.baseChecks = 2;
                if (this.state.checkMod === undefined || isNaN(this.state.checkMod) || this.state.checkMod === 0) this.state.checkMod = 12;
            }
            this.syncCountersUi();
            this.recalculateCamp();
        } catch (e) { console.error("Ошибка обновления CampingManager:", e); }
    },

    changeBaseChecks(amount) {
        this.state.baseChecks = Math.max(0, Math.min(20, this.state.baseChecks + amount));
        this.syncCountersUi();
        this.recalculateCamp();
    },

    changeCheckMod(amount) {
        this.state.checkMod = Math.max(1, Math.min(41, this.state.checkMod + amount));
        this.syncCountersUi();
        this.recalculateCamp();
    },

    syncCountersUi() {
        const baseEl = document.getElementById('campBaseChecksVal');
        const modEl = document.getElementById('campCheckModVal');
        if (baseEl) baseEl.textContent = this.state.baseChecks;
        if (modEl) modEl.textContent = this.state.checkMod;
    },

    getSelectedRadio(name) {
        const checked = document.querySelector(`input[name="${name}"]:checked`);
        return checked ? checked.value : null;
    },
    // ============================================================================
    // МЕНЕДЖЕР ПРИВАЛА (CAMPING MANAGER) — ЧАСТЬ 2 ИЗ 3
    // ============================================================================


    // ============================================================================
    // МЕНЕДЖЕР ПРИВАЛА (CAMPING MANAGER) — ЧАСТЬ 2 ИЗ 3
    // ============================================================================

    recalculateCamp() {
        try {
            if (!this.mapDataRef || !this.mapDataRef.hexes) return;

            let squadHex = null;
            for (let id in this.mapDataRef.hexes) {
                if (this.mapDataRef.hexes[id].squadHere === true) {
                    squadHex = this.mapDataRef.hexes[id];
                    break;
                }
            }

            let baseRegionDc = 14;
            let currentRegionLevel = 1;
            let terrainBaseDc = 12;
            let terrainLabel = "Равнины";
            let terrainIcon = "🌾";

            if (squadHex) {
                if (squadHex.difficulty) baseRegionDc = parseInt(squadHex.difficulty, 10);
                if (squadHex.regionLevel) currentRegionLevel = parseInt(squadHex.regionLevel, 10);

                if (squadHex.terrain && MAP_CONFIG.terrains[squadHex.terrain]) {
                    const terrainConfig = MAP_CONFIG.terrains[squadHex.terrain];
                    terrainBaseDc = parseInt(terrainConfig.dc, 10);
                    terrainLabel = terrainConfig.label;
                    terrainIcon = terrainConfig.icon;
                }
            }

            const dcTextEl = document.getElementById('campRegionDcText');
            if (dcTextEl) dcTextEl.textContent = `СЛ ${baseRegionDc} (уровень региона: ${currentRegionLevel})`;

            this.state.checkMod = terrainBaseDc;

            const customTerrainLabelEl = document.getElementById('campEncounterTerrainLabel');
            if (customTerrainLabelEl) {
                customTerrainLabelEl.textContent = `${terrainIcon} ${terrainLabel} (СЛ ${terrainBaseDc})`;
            }

            const prepareRes = this.getSelectedRadio('res_prepare');
            const camoRow = document.getElementById('row_camouflage');
            const huntRow = document.getElementById('row_hunt');
            const isCampHorrible = (prepareRes === 'crit_failure');

            if (isCampHorrible) {
                if (camoRow) camoRow.style.display = 'none';
                if (huntRow) huntRow.style.display = 'none';
                document.querySelectorAll('input[name="res_camouflage"], input[name="res_hunt"]').forEach(r => r.checked = false);
            } else {
                if (camoRow) camoRow.style.display = 'table-row';
                if (huntRow) huntRow.style.display = 'table-row';
            }

            const camoRes = this.getSelectedRadio('res_camouflage');
            const huntRes = this.getSelectedRadio('res_hunt');

            let prepareDcModifier = 0;
            if (prepareRes === 'failure') prepareDcModifier = 2;

            const finalPrepareDc = baseRegionDc;
            const finalCamoDc = baseRegionDc + prepareDcModifier;
            const finalHuntDc = baseRegionDc + prepareDcModifier;

            const updateSkillDcLabel = (id, skillName, dcValue) => {
                const el = document.getElementById(id);
                if (el) {
                    const lowerSkill = skillName.toLowerCase();
                    el.innerHTML = `<span class="skill-name-large" style="margin-top: 4px; display: inline-block;">${lowerSkill} СЛ ${dcValue}</span>`;
                }
            };

            updateSkillDcLabel('label_dc_prepare', 'Выживание', finalPrepareDc);
            updateSkillDcLabel('label_dc_camouflage', 'Скрытность', finalCamoDc);
            updateSkillDcLabel('label_dc_hunt', 'Выживание', finalHuntDc);

            let finalEncounterDc = this.state.checkMod;
            if (!isCampHorrible) {
                if (camoRes === 'crit_success') finalEncounterDc += 2;
                if (camoRes === 'success') finalEncounterDc += 1;
                if (camoRes === 'crit_failure') finalEncounterDc = Math.max(1, finalEncounterDc - 2);
            }
            if (prepareRes === 'crit_success') finalEncounterDc += 2;
            this.state.encounterDc = finalEncounterDc;

            let calculatedChecks = this.state.baseChecks;
            if (prepareRes === 'crit_success') calculatedChecks -= 1;
            if (prepareRes === 'crit_failure') calculatedChecks += 1;
            if (!isCampHorrible && camoRes === 'crit_success') calculatedChecks -= 1;
            if (!isCampHorrible && huntRes === 'crit_failure') calculatedChecks += 1;

            this.state.totalChecks = Math.max(0, calculatedChecks);

            let normalYield = 0;
            let specialYieldText = "0";

            if (!isCampHorrible) {
                if (huntRes === 'success') {
                    normalYield = baseRegionDc;
                    if (currentRegionLevel < 7) specialYieldText = "1d4";
                    else if (currentRegionLevel >= 7 && currentRegionLevel <= 14) specialYieldText = "2d4";
                    else if (currentRegionLevel > 14) specialYieldText = "3d4";
                }
                // ИСПРАВЛЕНО: Теперь при критическом успехе охоты количество обычных ингредиентов удваивается (baseRegionDc * 2)
                else if (huntRes === 'crit_success') {
                    normalYield = baseRegionDc * 2;
                    if (currentRegionLevel < 7) specialYieldText = "4";
                    else if (currentRegionLevel >= 7 && currentRegionLevel <= 14) specialYieldText = "8";
                    else if (currentRegionLevel > 14) specialYieldText = "12";
                }
                else if (huntRes === 'failure') {
                    normalYield = baseRegionDc;
                    specialYieldText = "0";
                }
                else if (huntRes === 'crit_failure') {
                    normalYield = "1d4";
                    specialYieldText = "0";
                }
            }

            this.state.normalIngredients = normalYield;
            this.state.specialIngredients = specialYieldText;

            this.renderCalculatedUi(camoRes, prepareRes, huntRes, isCampHorrible, currentRegionLevel, specialYieldText);
        } catch (e) { console.error("Ошибка при перерасчете параметров лагеря:", e); }
    },


    renderCalculatedUi(camoRes, prepareRes, huntRes, isCampHorrible, lvl, specialYieldText) {
        const normEl = document.getElementById('campNormalIngredients');
        const specEl = document.getElementById('campSpecialIngredients');
        const encEl = document.getElementById('calcEncounterDc');
        const totEl = document.getElementById('calcTotalChecks');
        const modEl = document.getElementById('campCheckModVal');

        if (normEl) normEl.textContent = this.state.normalIngredients;
        if (specEl) specEl.textContent = this.state.specialIngredients;
        if (encEl) encEl.textContent = this.state.encounterDc;
        if (totEl) totEl.textContent = this.state.totalChecks;
        if (modEl) modEl.textContent = this.state.checkMod;

        const appendSkillLabel = (rowId, skillText) => {
            const row = document.getElementById(rowId);
            if (!row) return;
            const nameCell = row.querySelector('.camp-act-cell') || row.querySelector('td');
            if (nameCell && !nameCell.querySelector('.skill-name-large')) {
                const skillLabel = document.createElement('span');
                skillLabel.className = 'skill-name-large';
                skillLabel.textContent = skillText;
                nameCell.appendChild(skillLabel);
            }
        };

        appendSkillLabel('row_prepare', 'Выживание');
        appendSkillLabel('row_camouflage', 'Скрытность');
        appendSkillLabel('row_hunt', 'Выживание');

        const effectsList = document.getElementById('campEffectsList');
        if (!effectsList) return;
        effectsList.innerHTML = '';

        if (prepareRes === 'crit_success') {
            this.addLogLine(effectsList, "Подготовка: Критический успех: вы нашли идеальное место для лагеря. Чистые проверки для сцен во время стоянки в течении следующих 24 часов проводятся со СЛ +2, а первый час, проведённый в лагере, не влечёт за собой обычную проверку на случайную сцену.", "good");
        } else if (prepareRes === 'success') {
            this.addLogLine(effectsList, "Подготовка: Успех: вы нашли подходящее место для лагеря и занятий в лагере.", "good");
        } else if (prepareRes === 'failure') {
            this.addLogLine(effectsList, "Подготовка: Провал: место для лагеря не самое лучшее. Занятия в лагере требующие проверки, получают штраф -2.", "bad");
        } else if (isCampHorrible) {
            this.addLogLine(effectsList, `Подготовка: Критический провал: Это ужасное место для лагеря. Вы можете в нём отдохнуть и провести ежедневную подготовку, но вы не можете совершать в нём занятия. Более того, ваша попытка защитить лагерь, возможно, привлекла нежелательное внимание - пройдите чистую проверку со СЛ сцены региона ${this.state.encounterDc}. В случае успеха произойдет случайная сцена.`, "bad");
        }

        if (!isCampHorrible) {
            if (camoRes === 'crit_success') {
                this.addLogLine(effectsList, "Маскировка: Критический успех: вы превзошли все ожидания. В первый раз, когда чистая проверка приведёт к сцене во время этой стоянки, сцена не произойдёт. Сложность случайной сцены увеличена на +2.", "good");
            } else if (camoRes === 'success') {
                this.addLogLine(effectsList, "Маскировка: Успех: ваша работа помогает скрыть ваш лагерь от чужих глаз. Сложность случайной сцены увеличена на +1.", "good");
            } else if (camoRes === 'crit_failure') {
                this.addLogLine(effectsList, "Маскировка: Критический провал: вы считаете, что хорошо справились, но забыли что-то важное или на самом деле нечаянно сделали лагерь более заметным. Сложность обнаружения лагеря снижена на -2. Проверки для случайных сцен приводят к критическому успеху при 19 или 20.", "bad");
            }
        }

        if (!isCampHorrible) {
            if (huntRes === 'success') {
                this.addLogLine(effectsList, `Охота: Успех: охота (Уровень региона: ${lvl}): вы находите обычные ингредиенты в количесте, равном СЛ региона ${this.state.normalIngredients} шт., плюс ${specialYieldText} особых ингредиента.`, "good");
            } else if (huntRes === 'crit_success') {
                this.addLogLine(effectsList, `Охота: Критический успех (Уровень региона: ${lvl}): вы находите обычные ингредиенты в количесте, равном удвоенной СЛ региона ${this.state.normalIngredients} шт., плюс ${specialYieldText} особых ингредиента. Если охота в регионе уровнем не ниже 7, то особых ингредиентов 8; если in регионе уровнем не ниже 14, то особых ингредиентов 12.`, "good");
            } else if (huntRes === 'failure') {
                this.addLogLine(effectsList, `Охота: Провал: вы находите обычные ингредиенты в количесте, равном СЛ региона ${this.state.normalIngredients} шт.`, "generic");
            } else if (huntRes === 'crit_failure') {
                this.addLogLine(effectsList, `Охота: Критический провал: вы находите ${this.state.normalIngredients} обычных ингредиента, максимум ${this.state.encounterDc}. Кроме того вы привлекли внимание. Пройдите дополнительную чистую проверку со СЛ сцены региона ${this.state.encounterDc}, чтобы определить, произойдет ли случайная сцена в вашем лагере после этого занятия.`, "bad");
            }
        }
    },

    // Интеллектуальный парсер: красит в красный при минусах ИЛИ если тип лога "bad" (провал/крит)
    addLogLine(container, text, type) {
        const line = document.createElement('div');
        line.className = `camp-effect-line ${type}`;

        // Оборачиваем все числа, кости и текстовые маркеры в span
        const formattedText = text.replace(/([+-]?\d+d\d+|[+-]?\d+\s*(?:шт\.)?|[+-]\d+|девятнадцать|двадцать)/g, '<span>$1</span>');
        line.innerHTML = formattedText;

        // Обработка цвета плашек внутри созданной строки
        line.querySelectorAll('span').forEach(span => {
            // Если в самом числе есть минус, помечаем как negative
            if (span.textContent.includes('-')) {
                span.classList.add('negative');
            }
        });

        container.appendChild(line);
    },


    attachInputListeners() {
        const grid = document.querySelector('.camp-gm-inputs-grid');
        if (!grid) return;
        grid.removeEventListener('change', this._handleGridChange);
        grid.removeEventListener('mousedown', this._handleGridMouseDown);

        this._handleGridChange = () => {
            this.recalculateCamp();
            this.checkCampPhaseCompletion();
        };
        this._handleGridMouseDown = () => {
            if (window.AnimationManager) window.AnimationManager.warmUpAudioContext();
        };

        grid.addEventListener('change', this._handleGridChange);
        grid.addEventListener('mousedown', this._handleGridMouseDown);
    },

    checkCampPhaseCompletion() {
        this.recalculateCamp();
        const prepareRes = this.getSelectedRadio('res_prepare');
        const camoRes = this.getSelectedRadio('res_camouflage');
        const huntRes = this.getSelectedRadio('res_hunt');
        let isFinished = false;

        if (prepareRes === 'crit_failure' || (prepareRes && camoRes && huntRes)) {
            isFinished = true;
        }
        if (isFinished) this.triggerDiceAndResultModal();
    },



    triggerDiceAndResultModal() {
        const resultModal = document.getElementById('campResultModal');
        const modalBody = document.getElementById('campResultModalBody');
        const effectsList = document.getElementById('campEffectsList');
        if (!resultModal || !modalBody || !effectsList) return;

        modalBody.innerHTML = '';

        // Находим базовые параметры региона для сравнения
        const squadHex = Object.values(this.mapDataRef.hexes).find(h => h.squadHere === true);
        const baseRegionDc = squadHex && squadHex.difficulty ? parseInt(squadHex.difficulty, 10) : 14;

        // 1. СЛ Сцены: если итоговая СЛ стала МЕНЬШЕ базовой (из-за крит. провала маскировки) — красим в красный
        const isDcBad = this.state.encounterDc < this.state.checkMod;
        const dcSpanClass = isDcBad ? 'class="negative"' : '';

        // 2. Проверок: если итоговых проверок БОЛЬШЕ базовой ставки игрока — штраф (красный)
        const isChecksBad = this.state.totalChecks > this.state.baseChecks;
        const checksSpanClass = isChecksBad ? 'class="negative"' : '';

        // 3. Ингредиенты: если выпало "1d4" (строка) или число меньше базовой СЛ — провал (красный)
        const isIngredientsBad = String(this.state.specialIngredients).includes('d') ||
            isNaN(this.state.normalIngredients) ||
            this.state.normalIngredients < baseRegionDc;
        const ingredientsSpanClass = isIngredientsBad ? 'class="negative"' : '';

        // Блок 1: Крупные цифры-статы с точечным внедрением классов в теги span
        const summaryStats = document.createElement('div');
        summaryStats.innerHTML = `
            <div>🎲 СЛ Сцены: <span ${dcSpanClass}>${this.state.encounterDc}</span></div>
            <div>⏱ Проверок: <span ${checksSpanClass}>${this.state.totalChecks}</span></div>
            <div>🥩 Ингредиенты: <span ${ingredientsSpanClass}>${this.state.normalIngredients}</span></div>
            <div>🌿 Особые: <span>${this.state.specialIngredients}</span></div>
        `;
        modalBody.appendChild(summaryStats);

        // Блок 2: Изолирующий контейнер для литературного текста
        const textContainer = document.createElement('div');
        textContainer.className = 'camp-result-text-container';

        Array.from(effectsList.children).forEach(child => {
            const clone = child.cloneNode(true);
            textContainer.appendChild(clone);
        });

        modalBody.appendChild(textContainer);

        if (window.AnimationManager) {
            window.AnimationManager.playCampDiceAnimation(this.state.encounterDc, () => {
                resultModal.classList.add('open');
            });
        } else {
            resultModal.classList.add('open');
        }
    },



    saveFromUi() {
        try {
            const resultModal = document.getElementById('campResultModal');
            if (resultModal && !resultModal.classList.contains('open')) {
                this.triggerDiceAndResultModal();
                return;
            }
            if (this.mapDataRef) this.mapDataRef.camping = this.state;
            if (this.onSaveCallback) this.onSaveCallback();
            else localStorage.setItem('hexMapSystemData', JSON.stringify(this.mapDataRef));

            const questLogContainerEl = document.getElementById('questLogContainer');
            if (questLogContainerEl) questLogContainerEl.classList.add('ui-collapsed');

            const saveBtn = document.querySelector('.kingdom-save-wrapper .btn.ok');
            if (saveBtn) {
                const oldText = saveBtn.textContent;
                saveBtn.style.setProperty('transform', 'scale(0.96)', 'important');
                saveBtn.textContent = '⚜ Итоги применены!';

                const flash = document.createElement('div');
                flash.className = 'button-flash-overlay';
                flash.style.left = saveBtn.offsetLeft + 'px';
                flash.style.top = saveBtn.offsetTop + 'px';
                flash.style.width = saveBtn.offsetWidth + 'px';
                flash.style.height = saveBtn.offsetHeight + 'px';
                saveBtn.parentNode.appendChild(flash);

                setTimeout(() => {
                    saveBtn.style.removeProperty('transform');
                    flash.style.opacity = '0';
                }, 40);

                setTimeout(() => {
                    flash.remove();
                    saveBtn.textContent = oldText;
                    if (window.QuestManager) window.QuestManager.currentFilter = 'active';
                }, 450);
            }
        } catch (error) { console.error("Критическая ошибка сохранения привала:", error); }
    },

    resetToDefault() {
        try {
            const camoRow = document.getElementById('row_camouflage');
            const huntRow = document.getElementById('row_hunt');
            if (camoRow) camoRow.style.display = 'table-row';
            if (huntRow) huntRow.style.display = 'table-row';
            this.state.baseChecks = 2;
            this.state.checkMod = 12;
            document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
            this.syncCountersUi();
            this.recalculateCamp();
            const resetBtn = document.querySelector('.kingdom-save-wrapper .btn.del');
            if (resetBtn) {
                const oldText = resetBtn.textContent;
                resetBtn.style.setProperty('transform', 'scale(0.96)', 'important');
                resetBtn.textContent = '🔄 Сброшено';
                const flash = document.createElement('div');
                flash.className = 'button-flash-overlay';
                flash.style.left = resetBtn.offsetLeft + 'px';
                flash.style.top = resetBtn.offsetTop + 'px';
                flash.style.width = resetBtn.offsetWidth + 'px';
                flash.style.height = resetBtn.offsetHeight + 'px';
                resetBtn.parentNode.appendChild(flash);
                setTimeout(() => {
                    resetBtn.style.removeProperty('transform');
                    flash.style.opacity = '0';
                }, 40);
                setTimeout(() => {
                    flash.remove();
                    resetBtn.textContent = oldText;
                }, 450);
            }
        } catch (e) { console.error("Ошибка при сбросе параметров привала:", e); }
    }
};
export default CampingManager;