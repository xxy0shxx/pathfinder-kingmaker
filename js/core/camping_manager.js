const CampingManager = {
    state: {
        baseChecks: 2,
        checkMod: 12, // Сменили дефолтное значение с 0 на 12
        normalIngredients: 0,
        specialIngredients: 0,
        encounterDc: 12,
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
                // ЗАЩИТА: Страхуем и фиксируем новые дефолтные параметры
                if (this.state.baseChecks === undefined || isNaN(this.state.baseChecks)) {
                    this.state.baseChecks = 2;
                }
                if (this.state.checkMod === undefined || isNaN(this.state.checkMod) || this.state.checkMod === 0) {
                    this.state.checkMod = 12; // Переключаем старые нулевые сейвы на 12
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
                if (this.state.baseChecks === undefined || isNaN(this.state.baseChecks)) {
                    this.state.baseChecks = 2;
                }
                if (this.state.checkMod === undefined || isNaN(this.state.checkMod) || this.state.checkMod === 0) {
                    this.state.checkMod = 12;
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

    // Метод теперь напрямую шагает по СЛ случайной сцены (например, 12 -> 13 -> 14)
    changeCheckMod(amount) {
        this.state.checkMod = Math.max(1, Math.min(41, this.state.checkMod + amount));
        this.syncCountersUi();
        this.recalculateCamp();
    },

    syncCountersUi() {
        const baseEl = document.getElementById('campBaseChecksVal');
        const modEl = document.getElementById('campCheckModVal');
        if (baseEl) baseEl.textContent = this.state.baseChecks;
        // Больше не пишем знаки "+" или "-", выводим чистую СЛ (например, 12)
        if (modEl) modEl.textContent = this.state.checkMod;
    },

    getSelectedRadio(name) {
        const checked = document.querySelector(`input[name="${name}"]:checked`);
        return checked ? checked.value : null;
    },


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

            // 2. РАСЧЕТ СЛ СЛУЧАЙНОЙ СЦЕНЫ (ОБНОВЛЕНО: База 12 + Модификатор ГМа)
            let finalEncounterDc = 12 + this.state.checkMod; // checkMod теперь крутит СЛ сцены

            if (!isCampHorrible) {
                if (camoRes === 'crit_success') finalEncounterDc += 2;
                if (camoRes === 'success') finalEncounterDc += 1;
                if (camoRes === 'crit_failure') finalEncounterDc = Math.max(1, finalEncounterDc - 2);
            }
            if (prepareRes === 'crit_success') finalEncounterDc += 2;
            this.state.encounterDc = finalEncounterDc;

            // 3. РАСЧЕТ ИТОГОВОГО ПУЛА ПРОВЕРОК ПРИВАЛА (Чистый расчет без checkMod)
            let calculatedChecks = this.state.baseChecks;
            if (prepareRes === 'crit_success') calculatedChecks -= 1;
            if (prepareRes === 'crit_failure') calculatedChecks += 1;
            if (!isCampHorrible && camoRes === 'crit_success') calculatedChecks -= 1;
            this.state.totalChecks = Math.max(0, calculatedChecks); // Чистый результат бросков кубов

            // 4. Расчет ресурсов
            let normalYield = 0, specialYield = 0;
            if (!isCampHorrible) {
                if (huntRes === 'success') {
                    normalYield = 2;
                } else if (huntRes === 'crit_success') {
                    if (currentRegionLevel < 7) {
                        normalYield = baseRegionDc;
                        specialYield = 4;
                    } else if (currentRegionLevel >= 7 && currentRegionLevel <= 14) {
                        normalYield = baseRegionDc;
                        specialYield = 8;
                    } else if (currentRegionLevel > 14) {
                        normalYield = baseRegionDc;
                        specialYield = 12;
                    }
                }
            }

            this.state.normalIngredients = normalYield;
            this.state.specialIngredients = specialYield;

            this.renderCalculatedUi(camoRes, prepareRes, huntRes, isCampHorrible, currentRegionLevel);
        } catch (e) { console.error("Ошибка при перерасчете параметров лагеря:", e); }
    },


    renderCalculatedUi(camoRes, prepareRes, huntRes, isCampHorrible, lvl) {
        document.getElementById('calcEncounterDc').textContent = this.state.encounterDc;
        document.getElementById('calcTotalChecks').textContent = this.state.totalChecks;
        document.getElementById('campNormalIngredients').textContent = this.state.normalIngredients;
        document.getElementById('campSpecialIngredients').textContent = this.state.specialIngredients;

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
                this.addLogLine(effectsList, "Успех охоты: Добыто базовое количество еды (2 пайка).", "good");
            } else if (huntRes === 'crit_success') {
                let msg = `Блестящая охота (Уровень региона: ${lvl})! `;
                if (lvl < 7) msg += `Добыто обычных ингредиентов в размере СЛ региона + 4 особых специй.`;
                else if (lvl >= 7 && lvl <= 14) msg += `Добыто обычных ингредиентов в размере СЛ региона + 8 особых специй.`;
                else msg += `Добыто обычных ингредиентов в размере СЛ региона + 12 особых специй.`;
                this.addLogLine(effectsList, msg, "good");
            } else if (huntRes === 'failure' || huntRes === 'crit_failure') {
                this.addLogLine(effectsList, "Охотники вернулись ни с чем.", "bad");
            }
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

            document.querySelectorAll('input[type="radio"]').forEach(radio => { radio.checked = false; });
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
    }
};

export default CampingManager;
