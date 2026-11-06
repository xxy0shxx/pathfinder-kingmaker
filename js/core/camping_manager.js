// CampingManager.js — Часть 1: Структура и Инициализация
const CampingManager = {
    state: {
        checkMod: 0,
        normalIngredients: 0,
        specialIngredients: 0,
        encounterDc: 11,
        totalChecks: 4
    },
    mapDataRef: null,
    onSaveCallback: null,

    init(mapData, onSave) {
        try {
            this.mapDataRef = mapData || { hexes: {}, kingdom: null, camping: null };
            this.onSaveCallback = onSave;

            if (this.mapDataRef.camping) {
                this.state = this.mapDataRef.camping;
            } else {
                this.mapDataRef.camping = this.state;
            }

            window.CampingManager = this;

            this.recalculateCamp();
        } catch (e) {
            console.error("Ошибка инициализации CampingManager:", e);
        }
    },

    updateMapData(newMapData) {
        try {
            this.mapDataRef = newMapData || { hexes: {}, kingdom: null, camping: null };
            if (this.mapDataRef.camping) {
                this.state = this.mapDataRef.camping;
            }
            this.recalculateCamp();
        } catch (e) {
            console.error("Ошибка обновления данных в CampingManager:", e);
        }
    },

    changeCheckMod(amount) {
        this.state.checkMod = Math.max(-10, Math.min(10, this.state.checkMod + amount));
        const modEl = document.getElementById('campCheckModVal');
        if (modEl) {
            modEl.textContent = this.state.checkMod >= 0 ? `+${this.state.checkMod}` : this.state.checkMod;
        }
        this.recalculateCamp();
    },

// CampingManager.js — Обновленное ядро расчетов ГМа
    recalculateCamp() {
        try {
            const terrainSelect = document.getElementById('campRegionTerrain');
            if (!terrainSelect) return;

            // Изначально берем чистую СЛ региона из выпадающего списка
            const baseRegionDc = parseInt(terrainSelect.value, 10);
            const prepareRes = document.getElementById('res_prepare').value;
            const camoRes = document.getElementById('res_camouflage').value;
            const huntRes = document.getElementById('res_hunt').value;

            // Динамически обновляем текстовые индикаторы сложности у каждого действия в интерфейсе
            const lblPrepare = document.getElementById('label_dc_prepare');
            const lblCamo = document.getElementById('label_dc_camouflage');
            const lblHunt = document.getElementById('label_dc_hunt');

            if (lblPrepare) lblPrepare.textContent = `(СЛ: ${baseRegionDc})`;
            if (lblCamo) lblCamo.textContent = `(СЛ: ${baseRegionDc})`;
            if (lblHunt) lblHunt.textContent = `(СЛ: ${baseRegionDc})`;

            // Расчет СЛ ночной случайной сцены. База равна СЛ региона,
            // модифицируется броском живой Скрытности (Маскировки лагеря) по правилам Pathfinder.
            let finalEncounterDc = baseRegionDc;
            if (camoRes === 'crit_success') finalEncounterDc += 4; // Усложняет засаду для монстров
            if (camoRes === 'failure') finalEncounterDc = Math.max(1, finalEncounterDc - 2); // Облегчает засаду
            if (camoRes === 'crit_failure') finalEncounterDc = Math.max(1, finalEncounterDc - 5); // Лагерь полностью выдан

            this.state.encounterDc = finalEncounterDc;

            // Расчет числа проверок (базово 4)
            let checks = 4;
            if (prepareRes === 'crit_success') checks += 1;
            if (prepareRes === 'failure') checks -= 1;
            if (prepareRes === 'crit_failure') checks = Math.max(0, checks - 2);
            this.state.totalChecks = Math.max(0, checks + this.state.checkMod);

            // Расчет добытых ресурсов привала
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

        // Логи маскировки
        if (camoRes === 'crit_success') this.addLogLine(effectsList, "Идеальная маскировка! СЛ случайной сцены поднят до 15.", "good");
        if (camoRes === 'success') this.addLogLine(effectsList, "Лагерь надежно скрыт от чужих глаз.", "generic");
        if (camoRes === 'failure') this.addLogLine(effectsList, "Плохая маскировка. СЛ случайной сцены упал до 9 (шанс засады выше).", "bad");
        if (camoRes === 'crit_failure') this.addLogLine(effectsList, "Катастрофическая маскировка! СЛ упал до 5. Лагерь сияет на весь регион.", "bad");

        // Логи подготовки лагеря
        if (prepareRes === 'crit_success') this.addLogLine(effectsList, "Комфортный лагерь: персонажи получают +1 дополнительную активность привала.", "good");
        if (prepareRes === 'failure') this.addLogLine(effectsList, "Ошибки обустройства: из-за суматохи доступно на 1 проверку меньше.", "bad");
        if (prepareRes === 'crit_failure') this.addLogLine(effectsList, "Ужасные условия отдыха! Штраф -2 к проверкам лагеря, персонажи утомлены.", "bad");

        // Логи охоты
        if (huntRes === 'crit_success') this.addLogLine(effectsList, "Блестящая охота! Найдено ценное кулинарное сырье и специи (+1 особый ингредиент).", "good");
        if (huntRes === 'failure' || huntRes === 'crit_failure') this.addLogLine(effectsList, "Охотники вернулись ни с чем. Группа тратит собственные запасы пайков.", "bad");
    },

    addLogLine(container, text, type) {
        const line = document.createElement('div');
        line.className = `camp-effect-line ${type}`;
        line.textContent = text;
        container.appendChild(line);
    },

    saveFromUi() {
        try {
            const terrainSelect = document.getElementById('campRegionTerrain');
            if (terrainSelect) {
                this.state.currentTerrainDc = parseInt(terrainSelect.value, 10);
            }

            if (this.mapDataRef) {
                this.mapDataRef.camping = this.state;
            }

            if (this.onSaveCallback) {
                this.onSaveCallback();
            } else {
                localStorage.setItem('hexMapSystemData', JSON.stringify(this.mapDataRef));
            }

            // Закрываем общее окно журнала квестов, в котором лежит вкладка привала
            const questLogContainerEl = document.getElementById('questLogContainer');
            if (questLogContainerEl) {
                questLogContainerEl.classList.add('ui-collapsed');

                const btnToggleQuests = document.getElementById('btnToggleQuests');
                if (btnToggleQuests) {
                    btnToggleQuests.removeAttribute('style');
                }
            }

            // Красивая вспышка на кнопке «Применить итоги»
            const saveBtn = document.querySelector('#campingTabletContainer .k-btn-save-small');
            if (saveBtn) {
                saveBtn.style.setProperty('filter', 'brightness(1.5)', 'important');
                saveBtn.textContent = '⚜ Итоги применены!';
                setTimeout(() => {
                    saveBtn.style.removeProperty('filter');
                    saveBtn.textContent = '⚜ Применить итоги';

                    // Необязательно, но удобно: после закрытия возвращаем фокус
                    // фильтра квестов на "активные", чтобы при следующем открытии ГМ видел задачи
                    if (window.QuestManager) window.QuestManager.currentFilter = 'active';
                }, 800);
            }
        } catch (error) {
            console.error("Критическая ошибка при сохранении привала:", error);
        }
    }


};

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btnToggleCamping');
    if (btn) {
        // Радикальное решение: клонируем кнопку, чтобы полностью стереть
        // любые скрытые или дублирующиеся слушатели событий из других менеджеров
        const cleanBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(cleanBtn, btn);

        // Вешаем чистый, изолированный клик на открытие нового окна-близнеца
        cleanBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const campingWindow = document.getElementById('campingLogContainer');
            const questWindow = document.getElementById('questLogContainer');
            if (!campingWindow) return;

            const isCollapsed = campingWindow.classList.contains('ui-collapsed');

            if (isCollapsed) {
                // Жестко закрываем квесты, чтобы они не лезли на экран
                if (questWindow) questWindow.classList.add('ui-collapsed');

                // Открываем наше окно привала
                campingWindow.classList.remove('ui-collapsed');

                // Пересчитываем математику
                if (window.CampingManager) window.CampingManager.recalculateCamp();

                // Красим кнопку в зеленый
                cleanBtn.style.setProperty('background', 'linear-gradient(180deg, #1e3c27 0%, #112417 100%)', 'important');
                cleanBtn.style.setProperty('border-color', '#dfbc6f', 'important');
                cleanBtn.style.setProperty('color', '#dfbc6f', 'important');
            } else {
                campingWindow.classList.add('ui-collapsed');
                cleanBtn.removeAttribute('style');
            }
        });
    }
});


export default CampingManager;
