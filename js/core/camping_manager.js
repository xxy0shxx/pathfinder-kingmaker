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
                else if (huntRes === 'crit_success') {
                    normalYield = baseRegionDc;
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
            this.addLogLine(effectsList, "Критический успех в подготовке: Лагерь обустроен безупречно. Общее число проверок привала снижено на 1, а сложность ночной сцены защищена и увеличена на +2.", "good");
        } else if (prepareRes === 'success') {
            this.addLogLine(effectsList, "Успех в подготовке: Укрытие организовано надежно и по правилам, стоянка безопасна для отдыха.", "good");
        } else if (prepareRes === 'failure') {
            this.addLogLine(effectsList, "Провал в подготовке: Место для стоянки выбрано неудачно. Сложность проверок Маскировки и Охоты принудительно увеличена на +2.", "bad");
        } else if (isCampHorrible) {
            this.addLogLine(effectsList, "Критический провал в подготовке: Это ужасное место для лагеря! Маскировка лагеря и Охота физически невозможны. Общее число ночных проверок привала увеличено на +1.", "bad");
        }

        if (!isCampHorrible) {
            if (camoRes === 'crit_success') {
                this.addLogLine(effectsList, "Критический успех в маскировке: Лагерь скрыт гениально. Общее число проверок привала снижено на 1, а сложность обнаружения лагеря случайной ночной сценой увеличена на +2.", "good");
            } else if (camoRes === 'success') {
                this.addLogLine(effectsList, "Успешная маскировка: Следы стоянки тщательно запутаны. Сложность обнаружения лагеря случайной ночной сценой увеличена на +1.", "good");
            } else if (camoRes === 'crit_failure') {
                this.addLogLine(effectsList, "Критический провал в маскировке: Вы оставили лагерь на виду у всех чудовищ. Сложность обнаружения лагеря снижена на -2. Любой критический успех проверки случайной ночной сцены теперь наступает при значении девятнадцать или двадцать.", "bad");
            }
        }

        if (!isCampHorrible) {
            if (huntRes === 'success') {
                this.addLogLine(effectsList, `Успешная охота (Уровень региона: ${lvl}): Егеря добыли базовое пропитание. Получено походных пайков в количестве, равном сложности региона (${this.state.normalIngredients} шт.). Бросьте кубики за столом на ${specialYieldText} для сбора особых специй.`, "good");
            } else if (huntRes === 'crit_success') {
                this.addLogLine(effectsList, `Критический успех в охоте (Уровень regiona: ${lvl}): Потрясающая добыча! Получено походных пайков в количестве, равном сложности региона (${this.state.normalIngredients} шт.), а также гарантированно найдено ${specialYieldText} редких специй и ингредиентов.`, "good");
            } else if (huntRes === 'failure') {
                this.addLogLine(effectsList, `Провал на охоте: Дичь упущена. Найдено лишь скромное базовое пропитание в размере сложности региона (${this.state.normalIngredients} шт.). Редкие специи отсутствуют.`, "generic");
            } else if (huntRes === 'crit_failure') {
                this.addLogLine(effectsList, `Критический провал на охоте: Экспедиция обернулась катастрофой! Группа привлекла внимание хищников, общее число проверок привала (дежурств) увеличено на +1. Бросьте кубики за столом на ${this.state.normalIngredients} для определения случайного количества уцелевших пайков. Специй нет.`, "bad");
            }
        }
    },

    // Парсер регулярных выражений для оборачивания цифр и костей в текстовые плашки
    addLogLine(container, text, type) {
        const line = document.createElement('div');
        line.className = `camp-effect-line ${type}`;
        const formattedText = text.replace(/([+-]?\d+d\d+|[+-]?\d+\s*(?:шт\.)?|[+-]\d+|девятнадцать|двадцать)/g, '<span>$1</span>');
        line.innerHTML = formattedText;
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
        const summaryStats = document.createElement('div');
        summaryStats.innerHTML = `
            <div>🎲 СЛ Сцены: <span>${this.state.encounterDc}</span></div>
            <div>⏱ Проверок: <span>${this.state.totalChecks}</span></div>
            <div>🥩 Пайки: <span>${this.state.normalIngredients}</span></div>
            <div>🌿 Специи: <span>${this.state.specialIngredients}</span></div>
        `;
        modalBody.appendChild(summaryStats);

        Array.from(effectsList.children).forEach(child => {
            const clone = child.cloneNode(true);
            modalBody.appendChild(clone);
        });

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