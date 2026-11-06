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

    recalculateCamp() {
        try {
            const terrainSelect = document.getElementById('campRegionTerrain');
            if (!terrainSelect) return;

            const baseRegionDc = parseInt(terrainSelect.value, 10);
            const prepareRes = this.getSelectedRadio('res_prepare');
            const camoRes = this.getSelectedRadio('res_camouflage');
            const huntRes = this.getSelectedRadio('res_hunt');

            // Обновление СЛ-индикаторов строк
            ['label_dc_prepare', 'label_dc_camouflage', 'label_dc_hunt'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = `(СЛ: ${baseRegionDc})`;
            });

            // Расчет СЛ засады
            let finalEncounterDc = baseRegionDc;
            if (camoRes === 'crit_success') finalEncounterDc += 4;
            if (camoRes === 'failure') finalEncounterDc = Math.max(1, finalEncounterDc - 2);
            if (camoRes === 'crit_failure') finalEncounterDc = Math.max(1, finalEncounterDc - 5);
            this.state.encounterDc = finalEncounterDc;

            // Расчет итогового пула проверок привала на базе динамического baseChecks
            let calculatedChecks = this.state.baseChecks;
            if (prepareRes === 'crit_success') calculatedChecks += 1;
            if (prepareRes === 'failure') calculatedChecks -= 1;
            if (prepareRes === 'crit_failure') calculatedChecks = Math.max(0, calculatedChecks - 2);
            this.state.totalChecks = Math.max(0, calculatedChecks + this.state.checkMod);

            // Расчет ингредиентов
            let normalYield = 0, specialYield = 0;
            if (huntRes === 'success') normalYield = 2;
            if (huntRes === 'crit_success') { normalYield = 4; specialYield = 1; }
            this.state.normalIngredients = normalYield;
            this.state.specialIngredients = specialYield;

            this.renderCalculatedUi(camoRes, prepareRes, huntRes);
        } catch (e) { console.error("Ошибка при перерасчете параметров лагеря:", e); }
    },

    renderCalculatedUi(camoRes, prepareRes, huntRes) {
        document.getElementById('calcEncounterDc').textContent = this.state.encounterDc;
        document.getElementById('calcTotalChecks').textContent = this.state.totalChecks;
        document.getElementById('campNormalIngredients').textContent = this.state.normalIngredients;
        document.getElementById('campSpecialIngredients').textContent = this.state.specialIngredients;

        const effectsList = document.getElementById('campEffectsList');
        if (!effectsList) return;
        effectsList.innerHTML = '';

        if (camoRes === 'crit_success') this.addLogLine(effectsList, "Идеальная маскировка! СЛ случайной сцены поднят на +4.", "good");
        if (camoRes === 'failure') this.addLogLine(effectsList, "Плохая маскировка. СЛ снижен на -2 (шанс засады выше).", "bad");
        if (camoRes === 'crit_failure') this.addLogLine(effectsList, "Катастрофическая маскировка! СЛ снижен на -5. Лагерь полностью выдан.", "bad");

        if (prepareRes === 'crit_success') this.addLogLine(effectsList, "Комфортный лагерь: доступна +1 дополнительная проверка.", "good");
        if (prepareRes === 'failure') this.addLogLine(effectsList, "Ошибки обустройства: доступно на 1 проверку меньше.", "bad");
        if (prepareRes === 'crit_failure') this.addLogLine(effectsList, "Ужасные условия отдыха! Штраф -2 к проверкам лагеря.", "bad");

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
    }
};

export default CampingManager;
