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
                if (!this.state.assignments) this.state.assignments = {};
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

            // 1. Проверка: находится ли отряд на территории своего королевства
            const km = window.KingdomManager;
            const isInKingdom = !!(squadHex && km && typeof km._isHexClaimed === 'function' && km._isHexClaimed(squadHex));
            let kEncounterBonus = 0;
            let kFoodBonus = 0;
            let kHexName = squadHex?.title || 'Владения королевства';

            if (isInKingdom) {
                const combined = `${squadHex.title || ''} ${squadHex.text || ''} ${squadHex.description || ''}`;
                const hasFarmland = squadHex.workSite === 'farmlands' || /ферм|угодь/i.test(combined);
                const hasFortOrTown = /убежищ|refuge|город|деревн|посел|посёл|крепост|форт|столиц/i.test(combined);

                kEncounterBonus = hasFortOrTown ? 4 : 2;
                kFoodBonus = hasFarmland ? 2 : 1;
            }

            this.state.kingdomContext = {
                inKingdom: isInKingdom,
                hexTitle: kHexName,
                encounterBonus: kEncounterBonus,
                foodBonus: kFoodBonus
            };



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

            const getHelperBonus = (actionIdx) => {
                const list = this.state.assignments?.[actionIdx];
                if (!Array.isArray(list) || list.length < 2) return 0;
                const val = parseInt(list[1].aidBonus, 10);
                return isNaN(val) ? 1 : Math.max(-1, Math.min(2, val));
            };

            const calWeather = window.KingdomManager?.getCalendarInfo?.()?.weather || { huntDcMod: 0, encDcMod: 0 };
            const weatherHuntMod = parseInt(calWeather.huntDcMod, 10) || 0;
            const weatherEncMod = parseInt(calWeather.encDcMod, 10) || 0;

            const finalPrepareDc = Math.max(1, baseRegionDc - getHelperBonus(0));
            const finalCamoDc = Math.max(1, baseRegionDc + prepareDcModifier - getHelperBonus(1));
            const finalHuntDc = Math.max(1, baseRegionDc + prepareDcModifier + weatherHuntMod - getHelperBonus(2));


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

            finalEncounterDc += kEncounterBonus + weatherEncMod;
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
                    normalYield = baseRegionDc + kFoodBonus;
                    if (currentRegionLevel < 7) specialYieldText = "1d4";
                    else if (currentRegionLevel >= 7 && currentRegionLevel <= 14) specialYieldText = "2d4";
                    else if (currentRegionLevel > 14) specialYieldText = "3d4";
                }
                else if (huntRes === 'crit_success') {
                    normalYield = (baseRegionDc * 2) + kFoodBonus;
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





    formatActionActors(actionIdx) {
        const list = (this.state.assignments && Array.isArray(this.state.assignments[actionIdx]))
            ? this.state.assignments[actionIdx]
            : [];
        if (list.length === 0) return '';

        const leader = `<span class="camp-actor-highlight">${list[0].name}</span>`;
        if (list.length === 1) {
            return ` (${leader})`;
        }
        const rawAid = parseInt(list[1].aidBonus, 10);
        const aidVal = isNaN(rawAid) ? 1 : rawAid;
        const aidStr = aidVal > 0 ? `+${aidVal}` : `${aidVal}`;
        const helper = `<span class="camp-actor-highlight">${list[1].name} [${aidStr}]</span>`;
        return ` (${leader}, помощник: ${helper})`;
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

        const effectsList = document.getElementById('campEffectsList');
        if (!effectsList) return;
        effectsList.innerHTML = '';

        const prepActors = this.formatActionActors(0);
        const camoActors = this.formatActionActors(1);
        const huntActors = this.formatActionActors(2);

        if (prepareRes === 'crit_success') {
            this.addLogLine(effectsList, `Подготовка${prepActors}: <span class='outcome-crit-success'>Критический успех</span>: вы нашли идеальное место для лагеря. Чистые проверки для сцен во время стоянки в течении следующих 24 часов проводятся со СЛ +2, а первый час, проведённый в лагере, не влечёт за собой обычную проверку на случайную сцену.`, "good");
        } else if (prepareRes === 'success') {
            this.addLogLine(effectsList, `Подготовка${prepActors}: <span class='outcome-success'>Успех</span>: вы нашли подходящее место для лагеря и занятий в лагере.`, "good");
        } else if (prepareRes === 'failure') {
            this.addLogLine(effectsList, `Подготовка${prepActors}: <span class='outcome-failure'>Провал</span>: место для лагеря не самое лучшее. Занятия в лагере требующие проверки, получают штраф -2.`, "bad");
        } else if (isCampHorrible) {
            this.addLogLine(effectsList, `Подготовка${prepActors}: <span class='outcome-crit-failure'>Критический провал</span>: Это ужасное место для лагеря. Вы можете в нём отдохнуть и провести ежедневную подготовку, но вы не можете совершать в нём занятия. Более того, ваша попытка защитить лагерь, возможно, привлекла нежелательное внимание - пройдите чистую проверку со СЛ сцены региона ${this.state.encounterDc}. В случае успеха произойдет случайная сцена.`, "bad");
        }

        if (!isCampHorrible) {
            if (camoRes === 'crit_success') {
                this.addLogLine(effectsList, `Маскировка${camoActors}: <span class='outcome-crit-success'>Критический успех</span>: вы превзошли все ожидания. В первый раз, когда чистая проверка приведёт к сцене во время этой стоянки, сцена не произойдёт. Сложность случайной сцены увеличена на +2.`, "good");
            } else if (camoRes === 'success') {
                this.addLogLine(effectsList, `Маскировка${camoActors}: <span class='outcome-success'>Успех</span>: ваша работа помогает скрыть ваш лагерь от чужих глаз. Сложность случайной сцены увеличена на +1.`, "good");
            } else if (camoRes === 'crit_failure') {
                this.addLogLine(effectsList, `Маскировка${camoActors}: <span class='outcome-crit-failure'>Критический провал</span>: вы считаете, что хорошо справились, но забыли что-то важное или на самом деле нечаянно сделали лагерь более заметным. Сложность обнаружения лагеря снижена на -2. Проверки для случайных сцен приводят к критическому успеху при 19 или 20.`, "bad");
            }
        }

        if (!isCampHorrible) {
            if (huntRes === 'success') {
                this.addLogLine(effectsList, `Охота${huntActors}: <span class='outcome-success'>Успех</span>: охота (Уровень региона: ${lvl}): вы находите обычные ингредиенты в количесте, равном СЛ региона ${this.state.normalIngredients} шт., плюс ${specialYieldText} особых ингредиента.`, "good");
            } else if (huntRes === 'crit_success') {
                this.addLogLine(effectsList, `Охота${huntActors}: <span class='outcome-crit-success'>Критический успех</span> (Уровень региона: ${lvl}): вы находите обычные ингредиенты в количесте, равном удвоенной СЛ региона ${this.state.normalIngredients} шт., плюс ${specialYieldText} особых ингредиента. Если охота в регионе уровнем не ниже 7, то особых ингредиентов 8; если в регионе уровнем не ниже 14, то особых ингредиентов 12.`, "good");
            } else if (huntRes === 'failure') {
                this.addLogLine(effectsList, `Охота${huntActors}: <span class='outcome-failure'>Провал</span>: вы находите обычные ингредиенты в количесте, равном СЛ региона ${this.state.normalIngredients} шт.`, "generic");
            } else if (huntRes === 'crit_failure') {
                this.addLogLine(effectsList, `Охота${huntActors}: <span class='outcome-crit-failure'>Критический провал</span>: вы находите ${this.state.normalIngredients} обычных ингредиента, максимум ${this.state.encounterDc}. Кроме того вы привлекли внимание. Пройдите дополнительную чистую проверку со СЛ сцены региона ${this.state.encounterDc}, чтобы определить, произойдет ли случайная сцена в вашем лагере после этого занятия.`, "bad");
            }
        }

        const kCtx = this.state.kingdomContext;

        if (kCtx && kCtx.inKingdom) {
            const unrestDropReady = (prepareRes === 'success' || prepareRes === 'crit_success' || camoRes === 'success' || camoRes === 'crit_success');
            const foodSupplyReady = (huntRes === 'success' || huntRes === 'crit_success');

            let bonusParts = [`Безопасность патрулей: СЛ сцен +${kCtx.encounterBonus}`];
            if (foodSupplyReady) bonusParts.push(`в склад королевства поступит +${kCtx.foodBonus} Еды`);
            if (unrestDropReady) bonusParts.push(`порядок на землях: −1 Беспорядки`);

            this.addLogLine(
                effectsList,
                `Территория королевства (${kCtx.hexTitle}): ${bonusParts.join('; ')}.`,
                "good"
            );
        }

        const cal = window.KingdomManager?.getCalendarInfo?.();
        if (cal) {
            if (cal.precip || cal.cold) {
                const condName = (cal.precip && cal.cold) ? 'Снег и холод' : (cal.precip ? 'Небольшие осадки' : 'Холодный день');
                const penalties = ['утомление наступает через 4 часа перехода вместо 8'];
                if (cal.precip) penalties.push('ситуативный штраф −1 к Вниманию (зрение)');
                this.addLogLine(
                    effectsList,
                    `Погода (${cal.day} ${cal.monthName}, ${condName}): ${penalties.join('; ')}.`,
                    "bad"
                );
            }
            if (cal.hazard) {
                this.addLogLine(
                    effectsList,
                    `Погодное явление: ${cal.hazard.icon} ${cal.hazard.label} (${cal.hazard.levelText}) — проверьте Выживание для предсказания и поиска укрытия.`,
                    "bad"
                );
            }
        }

        this.renderAlliesDock();
    },




    addLogLine(container, text, type) {
        const line = document.createElement('div');
        line.className = `camp-effect-line ${type}`;

        // Разбиваем строку по HTML-тегам, чтобы числа внутри имен и атрибутов не ломали верстку
        const parts = text.split(/(<[^>]+>)/g);
        let insideActorSpan = false;

        const formattedText = parts.map(part => {
            if (part.startsWith('<')) {
                if (part.includes('camp-actor-highlight')) insideActorSpan = true;
                else if (part === '</span>') insideActorSpan = false;
                return part;
            }
            if (insideActorSpan) return part;
            return part.replace(/([+-]?\d+d\d+|[+-]?\d+\s*(?:шт\.)?|[+-]\d+|девятнадцать|двадцать)/g, '<span>$1</span>');
        }).join('');

        line.innerHTML = formattedText;

        line.querySelectorAll('span:not(.camp-actor-highlight)').forEach(span => {
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

            // Применяем награды привала в экономику королевства (если лагерь разбит на своей территории)
            const kCtx = this.state.kingdomContext;
            const km = window.KingdomManager;
            if (kCtx && kCtx.inKingdom && km?.state) {
                const prepareRes = this.getSelectedRadio('res_prepare');
                const camoRes = this.getSelectedRadio('res_camouflage');
                const huntRes = this.getSelectedRadio('res_hunt');

                let kingdomChanged = false;

                // 1. Пополнение склада провизии королевства при успешной охоте
                if ((huntRes === 'success' || huntRes === 'crit_success') && kCtx.foodBonus > 0 && km.state.commodities?.food) {
                    const food = km.state.commodities.food;
                    const maxFood = parseInt(food.max, 10) || 4;
                    food.value = Math.min(maxFood, (parseInt(food.value, 10) || 0) + kCtx.foodBonus);
                    kingdomChanged = true;
                }

                // 2. Снижение Беспорядков королевства на 1 при успешной подготовке или маскировке лагеря
                if (prepareRes === 'success' || prepareRes === 'crit_success' || camoRes === 'success' || camoRes === 'crit_success') {
                    const curUnrest = parseInt(km.state.unrest, 10) || 0;
                    if (curUnrest > 0) {
                        km.state.unrest = curUnrest - 1;
                        kingdomChanged = true;
                    }
                }

                if (kingdomChanged) {
                    if (typeof km._persist === 'function') km._persist();
                    if (typeof km.renderUi === 'function') km.renderUi();
                }
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
            this.state.assignments = {};
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
    },




    renderAlliesDock() {
        const campContainer = document.getElementById('campingTabletContainer');
        if (!campContainer) return;

        const leftCol = campContainer.querySelector('.camping-left-col');
        const actionCells = campContainer.querySelectorAll('.camp-invisible-table td.camp-act-cell');
        if (!leftCol || actionCells.length === 0) return;

        if (!this.state.assignments) this.state.assignments = {};

        // Нормализация формата (если в сохранении был старый одиночный объект, превращаем в массив)
        for (const key in this.state.assignments) {
            const val = this.state.assignments[key];
            if (val && !Array.isArray(val)) {
                this.state.assignments[key] = [val];
            } else if (!val) {
                this.state.assignments[key] = [];
            }
        }

        const allUnits = (window.InitiativeManager && window.InitiativeManager.state && Array.isArray(window.InitiativeManager.state.combatants))
            ? window.InitiativeManager.state.combatants
            : (this.mapDataRef?.initiative?.combatants || []);
        const allies = allUnits.filter(u => u && u.faction === 'friend').slice(0, 6);

        // 1. Зоны сброса и отрисовка портретов (лидер + помощник) внутри блоков действий
        actionCells.forEach((cell, idx) => {
            if (!Array.isArray(this.state.assignments[idx])) {
                this.state.assignments[idx] = [];
            }

            if (!cell.dataset.dropBound) {
                cell.dataset.dropBound = '1';

                cell.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    cell.classList.add('camp-drop-hover');
                });

                cell.addEventListener('dragleave', () => {
                    cell.classList.remove('camp-drop-hover');
                });

                cell.addEventListener('drop', (e) => {
                    e.preventDefault();
                    cell.classList.remove('camp-drop-hover');
                    const allyId = e.dataTransfer.getData('text/plain');
                    const found = allies.find(a => a.id === allyId);
                    if (!found) return;

                    if (!Array.isArray(this.state.assignments[idx])) {
                        this.state.assignments[idx] = [];
                    }

                    // Если герой уже стоит в ЭТОЙ же задаче — ничего не делаем
                    if (this.state.assignments[idx].some(a => a.id === found.id)) return;

                    // Лимит: строго не более 2 героев на одно действие
                    if (this.state.assignments[idx].length >= 2) return;

                    // Если герой был назначен на другое действие — снимаем его оттуда
                    for (const key in this.state.assignments) {
                        if (Array.isArray(this.state.assignments[key])) {
                            this.state.assignments[key] = this.state.assignments[key].filter(a => a.id !== found.id);
                        }
                    }


                    this.state.assignments[idx].push({
                        id: found.id,
                        name: found.name,
                        avatar: found.avatar || null,
                        aidBonus: this.state.assignments[idx].length === 1 ? 1 : 0
                    });

                    this.recalculateCamp();
                });
            }

            // Очищаем старые бейджи в ячейке
            cell.querySelectorAll('.camp-assigned-allies-group, .camp-assigned-ally-badge').forEach(el => el.remove());

            const assignedList = this.state.assignments[idx];
            if (assignedList && assignedList.length > 0) {
                const group = document.createElement('div');
                group.className = 'camp-assigned-allies-group';

                assignedList.forEach((hero, heroIdx) => {
                    const isHelper = heroIdx === 1;
                    if (isHelper && (hero.aidBonus === undefined || isNaN(hero.aidBonus))) {
                        hero.aidBonus = 1;
                    }
                    const aidVal = isHelper ? Math.max(-1, Math.min(2, parseInt(hero.aidBonus, 10) || 0)) : 0;
                    const aidLabel = aidVal > 0 ? `+${aidVal}` : `${aidVal}`;

                    const badge = document.createElement('div');
                    badge.className = isHelper
                        ? 'camp-assigned-ally-badge is-helper'
                        : 'camp-assigned-ally-badge is-leader';
                    badge.title = isHelper
                        ? `Помощник: ${hero.name} (бонус ${aidLabel} | колесо мыши: от -1 до +2 | клик: снять)`
                        : `Основной: ${hero.name} (нажмите, чтобы снять)`;

                    const imgHtml = hero.avatar
                        ? `<img class="camp-assigned-ally-img" src="${hero.avatar}" alt="${hero.name}">`
                        : `<div class="camp-assigned-ally-img">${hero.name.charAt(0).toUpperCase()}</div>`;

                    const aidBadgeHtml = isHelper
                        ? `<span class="camp-aid-value-pill ${aidVal < 0 ? 'is-neg' : (aidVal > 0 ? 'is-pos' : '')}">${aidLabel}</span>`
                        : '';

                    badge.innerHTML = imgHtml + aidBadgeHtml;

                    if (isHelper) {
                        badge.addEventListener('wheel', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const step = e.deltaY < 0 ? 1 : -1;
                            const nextVal = Math.max(-1, Math.min(2, aidVal + step));
                            if (nextVal !== aidVal) {
                                hero.aidBonus = nextVal;
                                this.recalculateCamp();
                            }
                        }, { passive: false });
                    }

                    badge.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.state.assignments[idx] = this.state.assignments[idx].filter(a => a.id !== hero.id);
                        this.recalculateCamp();
                    });

                    group.appendChild(badge);
                });

                cell.appendChild(group);
            }

        });

        // 2. В нижнем доке оставляем только свободных союзников
        const assignedIds = [];
        Object.values(this.state.assignments).forEach(arr => {
            if (Array.isArray(arr)) {
                arr.forEach(a => { if (a && a.id) assignedIds.push(a.id); });
            }
        });
        const availableAllies = allies.filter(a => !assignedIds.includes(a.id));

        let dock = leftCol.querySelector('.camp-allies-dock');
        if (!dock) {
            dock = document.createElement('div');
            dock.className = 'camp-allies-dock';
            leftCol.appendChild(dock);
        }

        let slotsHtml = '';
        for (let i = 0; i < 6; i++) {
            const ally = availableAllies[i];
            if (ally) {
                const visual = ally.avatar
                    ? `<img src="${ally.avatar}" alt="${ally.name}">`
                    : `<div class="camp-ally-slot-fallback">${ally.name.charAt(0).toUpperCase()}</div>`;
                slotsHtml += `
                    <div class="camp-ally-slot" draggable="true" data-ally-id="${ally.id}" title="Перетащите ${ally.name} на действие">
                        ${visual}
                        <div class="camp-ally-slot-name">${ally.name}</div>
                    </div>
                `;
            } else {
                slotsHtml += `<div class="camp-ally-slot empty-slot"></div>`;
            }
        }

        dock.innerHTML = `
            <div class="camp-allies-dock-title">🛡️ Союзники отряда (до 2 на действие)</div>
            <div class="camp-allies-grid">${slotsHtml}</div>
        `;

        dock.querySelectorAll('.camp-ally-slot[draggable="true"]').forEach(slot => {
            slot.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', slot.dataset.allyId);
            });
        });
    }


};
export default CampingManager;