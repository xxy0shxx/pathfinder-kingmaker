// CampingManager.js — Финальная сборка с динамическим checks и радио-кнопками
const CampingManager = {
    state: {
        baseChecks: 2,
        checkMod: 0,
        normalIngredients: 0,
        specialIngredients: 0,
        encounterDc: 11,
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
                // ЗАЩИТА: Если в старом сейве не было этого поля, принудительно задаем 4
                if (this.state.baseChecks === undefined || isNaN(this.state.baseChecks)) {
                    this.state.baseChecks = 2;
                }
            } else {
                this.mapDataRef.camping = this.state;
            }

            window.CampingManager = this;
            this.syncCountersUi();
            this.recalculateCamp();
        } catch (e) { console.error("Ошибка инициализации CampingManager:", e); }
    },

    updateMapData(newMapData) {
        try {
            this.mapDataRef = newMapData || { hexes: {}, kingdom: null, camping: null };
            if (this.mapDataRef.camping) {
                this.state = this.mapDataRef.camping;
                // ЗАЩИТА: Страхуем импортируемый файл от NaN
                if (this.state.baseChecks === undefined || isNaN(this.state.baseChecks)) {
                    this.state.baseChecks = 2;
                }
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
        this.state.checkMod = Math.max(-10, Math.min(10, this.state.checkMod + amount));
        this.syncCountersUi();
        this.recalculateCamp();
    },

    syncCountersUi() {
        const baseEl = document.getElementById('campBaseChecksVal');
        const modEl = document.getElementById('campCheckModVal');
        if (baseEl) baseEl.textContent = this.state.baseChecks;
        if (modEl) modEl.textContent = this.state.checkMod >= 0 ? `+${this.state.checkMod}` : this.state.checkMod;
    },

    getSelectedRadio(name) {
        const checked = document.querySelector(`input[name="${name}"]:checked`);
        return checked ? checked.value : null; // Заменили 'success' на null
    },

    recalculateCamp() {
        try {
            const terrainSelect = document.getElementById('campRegionTerrain');
            if (!terrainSelect) return;

            const baseRegionDc = parseInt(terrainSelect.value, 10);
            const prepareRes = this.getSelectedRadio('res_prepare');

            const camoRow = document.querySelector('input[name="res_camouflage"]').closest('.camp-gm-row');
            const huntRow = document.querySelector('input[name="res_hunt"]').closest('.camp-gm-row');

            const isCampHorrible = (prepareRes === 'crit_failure');

            if (isCampHorrible) {
                if (camoRow) camoRow.style.display = 'none';
                if (huntRow) huntRow.style.display = 'none';
                ['res_camouflage', 'res_hunt'].forEach(name => {
                    const defRadio = document.querySelector(`input[name="${name}"][value="success"]`);
                    if (defRadio) defRadio.checked = true;
                });
            } else {
                if (camoRow) camoRow.style.display = 'flex';
                if (huntRow) huntRow.style.display = 'flex';
            }

            const camoRes = this.getSelectedRadio('res_camouflage');
            const huntRes = this.getSelectedRadio('res_hunt');

            // 1. Расчет динамических СЛ лагеря
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

            // 2. РАСЧЕТ СЛ СЛУЧАЙНОЙ СЦЕНЫ (ОБНОВЛЕННЫЕ ПРАВИЛА МАСКИРОВКИ)
            let finalEncounterDc = baseRegionDc;

            if (!isCampHorrible) {
                // Новые правила маскировки применяются только если она была возможна
                if (camoRes === 'crit_success') finalEncounterDc += 2;
                if (camoRes === 'success') finalEncounterDc += 1;
                if (camoRes === 'failure') finalEncounterDc += 0;
                if (camoRes === 'crit_failure') finalEncounterDc = Math.max(1, finalEncounterDc - 2);
            }

            if (prepareRes === 'crit_success') finalEncounterDc += 2;
            this.state.encounterDc = finalEncounterDc;

            // 3. РАСЧЕТ ИТОГОВОГО ПУЛА ПРОВЕРОК ПРИВАЛА
            let calculatedChecks = this.state.baseChecks;

            // Модификатор проверок от Подготовки лагеря
            if (prepareRes === 'crit_success') calculatedChecks -= 1;
            if (prepareRes === 'crit_failure') calculatedChecks += 1;

            // Новое правило Маскировки: при КУ число проверок дополнительно снижается на 1
            if (!isCampHorrible && camoRes === 'crit_success') calculatedChecks -= 1;

            this.state.totalChecks = Math.max(0, calculatedChecks + this.state.checkMod);

            // 4. Расчет ресурсов
            let normalYield = 0, specialYield = 0;
            if (isCampHorrible) {
                normalYield = 0; specialYield = 0;
            } else {
                if (huntRes === 'success') normalYield = 2;
                if (huntRes === 'crit_success') { normalYield = 4; specialYield = 1; }
            }
            this.state.normalIngredients = normalYield;
            this.state.specialIngredients = specialYield;

            this.renderCalculatedUi(camoRes, prepareRes, huntRes, isCampHorrible);
        } catch (e) { console.error("Ошибка при перерасчете параметров лагеря:", e); }
    },


    renderCalculatedUi(camoRes, prepareRes, huntRes, isCampHorrible) {
        document.getElementById('calcEncounterDc').textContent = this.state.encounterDc;
        document.getElementById('calcTotalChecks').textContent = this.state.totalChecks;
        document.getElementById('campNormalIngredients').textContent = this.state.normalIngredients;
        document.getElementById('campSpecialIngredients').textContent = this.state.specialIngredients;

        const effectsList = document.getElementById('campEffectsList');
        if (!effectsList) return;
        effectsList.innerHTML = '';

        // Логи подготовки лагеря
        if (prepareRes === 'crit_success') {
            this.addLogLine(effectsList, "КУ подготовки: Число проверок снижено на -1, СЛ ночной сцены защищен на +2.", "good");
        } else if (prepareRes === 'failure') {
            this.addLogLine(effectsList, "Провал подготовки: СЛ Маскировки и Охоты увеличены на +2 из-за плохой стоянки.", "bad");
        } else if (isCampHorrible) {
            this.addLogLine(effectsList, "Это ужасное место для лагеря! Маскировка и Охота невозможны. Число проверок увеличено на +1.", "bad");
        }

        // Логи маскировки лагеря (выводятся только если она была возможна)
        if (!isCampHorrible) {
            if (camoRes === 'crit_success') this.addLogLine(effectsList, "КУ маскировки: Число проверок снижено на -1, СЛ сцены увеличен на +2.", "good");
            if (camoRes === 'success') this.addLogLine(effectsList, "Успех маскировки: СЛ случайной сцены увеличен на +1.", "good");
            if (camoRes === 'failure') this.addLogLine(effectsList, "Провал маскировки: Никаких эффектов на скрытность лагеря.", "generic");
            if (camoRes === 'crit_failure') this.addLogLine(effectsList, "КП маскировки: СЛ случайной сцены уменьшен на -2. Критический успех проверки случайной сцены: 19 или 20.", "bad");
        }

        // Логи охоты
        if (!isCampHorrible) {
            if (huntRes === 'crit_success') this.addLogLine(effectsList, "Блестящая охота! Найдено ценное кулинарное сырье (+1 особый ингредиент).", "good");
            if (huntRes === 'failure' || huntRes === 'crit_failure') this.addLogLine(effectsList, "Охотники вернулись ни с чем.", "bad");
        }
    },

    addLogLine(container, text, type) {
        const line = document.createElement('div');
        line.className = `camp-effect-line ${type}`;
        line.textContent = text;
        container.appendChild(line);
    },

    saveFromUi() {
        try {
            if (this.mapDataRef) this.mapDataRef.camping = this.state;
            if (this.onSaveCallback) this.onSaveCallback();
            else localStorage.setItem('hexMapSystemData', JSON.stringify(this.mapDataRef));

            const questLogContainerEl = document.getElementById('questLogContainer');
            if (questLogContainerEl) questLogContainerEl.classList.add('ui-collapsed');

            const saveBtn = document.querySelector('#campingTabletContainer .k-btn-save-small');
            if (saveBtn) {
                saveBtn.style.setProperty('filter', 'brightness(1.5)', 'important');
                saveBtn.textContent = '⚜ Итоги применены!';
                setTimeout(() => {
                    saveBtn.style.removeProperty('filter');
                    saveBtn.textContent = '⚜ Применить итоги';
                    if (window.QuestManager) window.QuestManager.currentFilter = 'active';
                }, 800);
            }
        } catch (error) { console.error("Критическая ошибка при сохранении привала:", error); }
    },


    resetToDefault() {
        try {
            const camoRow = document.querySelector('input[name="res_camouflage"]').closest('.camp-gm-row');
            const huntRow = document.querySelector('input[name="res_hunt"]').closest('.camp-gm-row');
            if (camoRow) camoRow.style.display = 'flex';
            if (huntRow) huntRow.style.display = 'flex';

            this.state.baseChecks = 2;
            this.state.checkMod = 0;

            const terrainSelect = document.getElementById('campRegionTerrain');
            if (terrainSelect) terrainSelect.value = "14";

            // ОБНОВЛЕНО: Вместо включения "success" мы полностью снимаем выделение со всех радио-кнопок
            document.querySelectorAll('input[type="radio"]').forEach(radio => {
                radio.checked = false;
            });

            this.syncCountersUi();
            this.recalculateCamp();

            const resetBtn = document.querySelector('.camp-action-buttons .k-btn-reset-small');
            if (resetBtn) {
                resetBtn.style.setProperty('filter', 'brightness(1.5)', 'important');
                const oldText = resetBtn.textContent;
                resetBtn.textContent = '🔄 Сброшено';
                setTimeout(() => {
                    resetBtn.style.removeProperty('filter');
                    resetBtn.textContent = oldText;
                }, 500);
            }
        } catch (e) { console.error("Ошибка при сбросе параметров привала:", e); }
    },



};

export default CampingManager;
