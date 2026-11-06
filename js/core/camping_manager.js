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
        totalChecks: 2
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

            if (squadHex) {
                if (squadHex.difficulty) baseRegionDc = parseInt(squadHex.difficulty, 10);
                if (squadHex.regionLevel) currentRegionLevel = parseInt(squadHex.regionLevel, 10);
            }

            const dcTextEl = document.getElementById('campRegionDcText');
            if (dcTextEl) dcTextEl.textContent = `СЛ ${baseRegionDc} (уровень региона: ${currentRegionLevel})`;

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

            ['label_dc_prepare', 'label_dc_camouflage', 'label_dc_hunt'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    if (id === 'label_dc_prepare') el.textContent = `(СЛ: ${finalPrepareDc})`;
                    if (id === 'label_dc_camouflage') el.textContent = `(СЛ: ${finalCamoDc})`;
                    if (id === 'label_dc_hunt') el.textContent = `(СЛ: ${finalHuntDc})`;
                }
            });

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

        if (normEl) normEl.textContent = this.state.normalIngredients;
        if (specEl) specEl.textContent = this.state.specialIngredients;
        if (encEl) encEl.textContent = this.state.encounterDc;
        if (totEl) totEl.textContent = this.state.totalChecks;

        const effectsList = document.getElementById('campEffectsList');
        if (!effectsList) return;
        effectsList.innerHTML = '';

        if (prepareRes === 'crit_success') this.addLogLine(effectsList, "КУ подготовки: Число проверок снижено на -1, СЛ ночной сцены защищен на +2.", "good");
        else if (prepareRes === 'failure') this.addLogLine(effectsList, "Провал подготовки: СЛ Маскировки и Охоты увеличены на +2 из-за плохой стоянки.", "bad");
        else if (isCampHorrible) this.addLogLine(effectsList, "Это ужасное место для лагеря! Маскировка и Охота невозможны. Число проверок увеличено на +1.", "bad");

        if (!isCampHorrible) {
            if (camoRes === 'crit_success') this.addLogLine(effectsList, "КУ маскировки: Число проверок снижено на -1, СЛ сцены увеличен на +2.", "good");
            if (camoRes === 'success') this.addLogLine(effectsList, "Успех маскировки: СЛ случайной сцены увеличен на +1.", "good");
            if (camoRes === 'crit_failure') this.addLogLine(effectsList, "КП маскировки: СЛ случайной сцены уменьшен на -2. Критический успех проверки случайной сцены: 19 или 20.", "bad");
        }

        if (!isCampHorrible) {
            if (huntRes === 'success') {
                this.addLogLine(effectsList, `Успех охоты (Уровень региона: ${lvl}): Получено пайков в размере СЛ региона (${this.state.normalIngredients}). Бросьте за столом ${specialYieldText} на особые специи.`, "good");
            } else if (huntRes === 'crit_success') {
                this.addLogLine(effectsList, `КУ охоты (Уровень региона: ${lvl}): Получено пайков в размере СЛ региона (${this.state.normalIngredients}) + ${specialYieldText} особых специй.`, "good");
            } else if (huntRes === 'failure') {
                this.addLogLine(effectsList, `Провал охоты: Найдено лишь базовое пропитание в размере СЛ региона (${this.state.normalIngredients}). Особых специй нет.`, "generic");
            } else if (huntRes === 'crit_failure') {
                this.addLogLine(effectsList, `КП охоты: Охота обернулась катастрофой! Число проверок привала (дежурств) увеличено на +1. Бросьте за столом ${this.state.normalIngredients} на количество добытых пайков. Специй нет.`, "bad");
            }
        }
    },

    addLogLine(container, text, type) {
        const line = document.createElement('div');
        line.className = `camp-effect-line ${type}`;
        line.textContent = text;
        container.appendChild(line);
    },
// ============================================================================
// МЕНЕДЖЕР ПРИВАЛА (CAMPING MANAGER) — ЧАСТЬ 3 ИЗ 3
// ============================================================================

    attachInputListeners() {
        const grid = document.querySelector('.camp-gm-inputs-grid');
        if (!grid) return;

        grid.removeEventListener('change', this._handleGridChange);

        this._handleGridChange = () => {
            this.recalculateCamp();
            this.checkCampPhaseCompletion();
        };

        grid.addEventListener('change', this._handleGridChange);
    },

    checkCampPhaseCompletion() {
        const prepareRes = this.getSelectedRadio('res_prepare');
        const camoRes = this.getSelectedRadio('res_camouflage');
        const huntRes = this.getSelectedRadio('res_hunt');

        let isFinished = false;

        // Если КП подготовки — это мгновенный финал лагеря (1 действие)
        if (prepareRes === 'crit_failure') {
            isFinished = true;
        }
        // В штатном режиме ждем заполнения всех трех строк (3 действия)
        else if (prepareRes && camoRes && huntRes) {
            isFinished = true;
        }

        if (isFinished) {
            this.triggerDiceAndResultModal();
        }
    },


    triggerDiceAndResultModal() {
        const overlay = document.getElementById('campDiceOverlay');
        const resultModal = document.getElementById('campResultModal');
        const modalBody = document.getElementById('campResultModalBody');
        const effectsList = document.getElementById('campEffectsList');

        if (!overlay || !resultModal || !modalBody || !effectsList) return;

        overlay.classList.add('open');

        const dodeca = overlay.querySelector('.dodecahedron');

        if (dodeca) {
            dodeca.style.animation = 'none';
            dodeca.offsetHeight;
            dodeca.style.animation = 'dodecaSpin 3.5s cubic-bezier(0.22, 1, 0.36, 1) forwards';
        }

        modalBody.innerHTML = '';

        const summaryStats = document.createElement('div');
        summaryStats.style.cssText = 'background: rgba(0,0,0,0.4); padding: 12px; border: 1px solid #543e0d; border-radius: 4px; margin-bottom: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; text-align: center; color: #ffd875; font-weight: bold;';
        summaryStats.innerHTML = `
            <div>🎲 СЛ Сцены: <span style="color:#fff;">${this.state.encounterDc}</span></div>
            <div>⏱ Проверок: <span style="color:#2ecc71;">${this.state.totalChecks}</span></div>
            <div>🥩 Пайки: <span style="color:#fff;">${this.state.normalIngredients}</span></div>
            <div>🌿 Специи: <span style="color:#2ecc71;">${this.state.specialIngredients}</span></div>
        `;
        modalBody.appendChild(summaryStats);

        Array.from(effectsList.children).forEach(child => {
            const clone = child.cloneNode(true);
            clone.style.fontSize = '20px';
            modalBody.appendChild(clone);
        });

        setTimeout(() => {
            overlay.classList.remove('open');
            resultModal.classList.add('open');
        }, 3500);
    },


    saveFromUi() {
        try {
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
        } catch (error) { console.error("Критическая ошибка при сохранении привала:", error); }
    },

    resetToDefault() {
        try {
            const camoRow = document.getElementById('row_camouflage');
            const huntRow = document.getElementById('row_hunt');

            if (camoRow) camoRow.style.display = 'table-row';
            if (huntRow) huntRow.style.display = 'table-row';

            this.state.baseChecks = 2;
            this.state.checkMod = 12;

            document.querySelectorAll('input[type="radio"]').forEach(radio => {
                radio.checked = false;
            });

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
