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
        return checked ? checked.value : 'success';
    },


// CampingManager.js — Обновленная тактическая математика Подготовки лагеря
    recalculateCamp() {
        try {
            const terrainSelect = document.getElementById('campRegionTerrain');
            if (!terrainSelect) return;

            // Изначально берем чистую СЛ региона из выпадающего списка
            const baseRegionDc = parseInt(terrainSelect.value, 10);

            // Считываем радио-кнопки исходов бросков со стола
            const prepareRes = this.getSelectedRadio('res_prepare');
            const camoRes = this.getSelectedRadio('res_camouflage');
            const huntRes = this.getSelectedRadio('res_hunt');

            // 1. РАСЧЕТ ДИНАМИЧЕСКИХ МОДИФИКАТОРОВ СЛ ИЗ-ЗА ПОДГОТОВКИ ЛАГЕРЯ
            // По вашему правилу: при Провале подготовки лагеря — СЛ для Маскировки и Охоты увеличивается на +2
            let prepareDcModifier = 0;
            if (prepareRes === 'failure') {
                prepareDcModifier = 2;
            }

            const finalPrepareDc = baseRegionDc;
            const finalCamoDc = baseRegionDc + prepareDcModifier;
            const finalHuntDc = baseRegionDc + prepareDcModifier;

            // Динамически обновляем текстовые индикаторы сложности в интерфейсе (СЛ: X)
            const lblPrepare = document.getElementById('label_dc_prepare');
            const lblCamo = document.getElementById('label_dc_camouflage');
            const lblHunt = document.getElementById('label_dc_hunt');

            if (lblPrepare) lblPrepare.textContent = `(СЛ: ${finalPrepareDc})`;
            if (lblCamo) lblCamo.textContent = `(СЛ: ${finalCamoDc})`;
            if (lblHunt) lblHunt.textContent = `(СЛ: ${finalHuntDc})`;

            // 2. РАСЧЕТ СЛ СЛУЧАЙНОЙ СЦЕНЫ
            // База равна СЛ региона. Модифицируется броском Маскировки (Скрытности)
            let finalEncounterDc = baseRegionDc;
            if (camoRes === 'crit_success') finalEncounterDc += 4;
            if (camoRes === 'failure') finalEncounterDc = Math.max(1, finalEncounterDc - 2);
            if (camoRes === 'crit_failure') finalEncounterDc = Math.max(1, finalEncounterDc - 5);

            // ВАШЕ НОВОЕ ПРАВИЛО: При КУ подготовки лагеря — СЛ случайной сцены дополнительно увеличивается на +2
            if (prepareRes === 'crit_success') {
                finalEncounterDc += 2;
            }
            this.state.encounterDc = finalEncounterDc;

            // 3. РАСЧЕТ ИТОГОВОГО ПУЛА ПРОВЕРОК ПРИВАЛА
            let calculatedChecks = this.state.baseChecks;

            // ВАШИ НОВЫЕ ПРАВИЛА:
            // При КУ — число проверок уменьшается на 1 (минус 1)
            // При Успехе и Провале — ничего не меняется (0)
            // При КП — число проверок увеличивается на 1 (плюс 1)
            if (prepareRes === 'crit_success') calculatedChecks -= 1;
            if (prepareRes === 'crit_failure') calculatedChecks += 1;

            this.state.totalChecks = Math.max(0, calculatedChecks + this.state.checkMod);

            // 4. РАСЧЕТ ДОБЫТЫХ РЕСУРСОВ ПРИВАЛА
            let normalYield = 0;
            let specialYield = 0;
            if (huntRes === 'success') normalYield = 2;
            if (huntRes === 'crit_success') { normalYield = 4; specialYield = 1; }

            this.state.normalIngredients = normalYield;
            this.state.specialIngredients = specialYield;

            // Вывод логов для ГМа
            this.renderCalculatedUi(camoRes, prepareRes, huntRes);
        } catch (e) {
            console.error("Ошибка при перерасчете параметров лагеря:", e);
        }
    },


    renderCalculatedUi(camoRes, prepareRes, huntRes) {
        document.getElementById('calcEncounterDc').textContent = this.state.encounterDc;
        document.getElementById('calcTotalChecks').textContent = this.state.totalChecks;
        document.getElementById('campNormalIngredients').textContent = this.state.normalIngredients;
        document.getElementById('campSpecialIngredients').textContent = this.state.specialIngredients;

        const effectsList = document.getElementById('campEffectsList');
        if (!effectsList) return;
        effectsList.innerHTML = '';

        // 1. Логи маскировки лагеря
        if (camoRes === 'crit_success') this.addLogLine(effectsList, "Идеальная маскировка! СЛ случайной сцены поднят на +4.", "good");
        if (camoRes === 'failure') this.addLogLine(effectsList, "Плохая маскировка. СЛ снижен на -2 (шанс засады выше).", "bad");
        if (camoRes === 'crit_failure') this.addLogLine(effectsList, "Катастрофическая маскировка! СЛ снижен на -5. Лагерь полностью выдан.", "bad");

        // 2. Логи подготовки лагеря (ОБНОВЛЕНО ПОД НОВЫЕ ПРАВИЛА)
        if (prepareRes === 'crit_success') {
            this.addLogLine(effectsList, "КУ подготовки: Число проверок снижено на -1, но СЛ ночной сцены защищен на +2.", "good");
        }
        if (prepareRes === 'failure') {
            this.addLogLine(effectsList, "Провал подготовки: Из-за плохой стоянки СЛ Маскировки и Охоты выросли на +2!", "bad");
        }
        if (prepareRes === 'crit_failure') {
            this.addLogLine(effectsList, "КП подготовки: Лагерь разбит хаотично. Число проверок привала увеличено на +1.", "bad");
        }

        // 3. Логи охоты
        if (huntRes === 'crit_success') this.addLogLine(effectsList, "Блестящая охота! Найдено кулинарное сырье (+1 особый ингредиент).", "good");
        if (huntRes === 'failure' || huntRes === 'crit_failure') this.addLogLine(effectsList, "Охотники вернулись ни с чем.", "bad");
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
            // 1. Возвращаем дефолтные значения в стейт менеджера
            this.state.baseChecks = 2;
            this.state.checkMod = 0;

            // 2. Сбрасываем верхние селекторы в интерфейсе
            const terrainSelect = document.getElementById('campRegionTerrain');
            if (terrainSelect) terrainSelect.value = "14"; // Лес / Болото по умолчанию

            // 3. Сбрасываем радио-кнопки бросков обратно на значение "success" (Успех)
            ['res_prepare', 'res_camouflage', 'res_hunt'].forEach(name => {
                const radioToCheck = document.querySelector(`input[name="${name}"][value="success"]`);
                if (radioToCheck) radioToCheck.checked = true;
            });

            // 4. Синхронизируем счетчики на панели и перезапускаем математику
            this.syncCountersUi();
            this.recalculateCamp();

            // Эффект кратковременной вспышки на кнопке сброса для отклика интерфейса
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
        } catch (e) {
            console.error("Ошибка при сбросе параметров привала:", e);
        }
    },

};

export default CampingManager;
