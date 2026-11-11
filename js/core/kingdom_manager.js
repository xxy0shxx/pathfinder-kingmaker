import KingdomBuildings from '../services/kingdom_buildings.js';
import KingdomSheetRenderer from '../ui/kingdom_sheet_renderer.js';

const KingdomManager = {
    state: null,
    mapDataRef: null,
    onSaveCallback: null,
    activeSubTab: 'sheet', // 'sheet' | 'events' | 'urban'

    defaultState: {
        name: "Мое Королевство",
        charter: "",
        heartland: "",
        government: "",
        capitalCity: "",
        level: 1,
        xp: 0,
        size: 1,
        rp: 10,
        unrest: 0,
        consumption: 0,
        fame: 0,
        controlDcBase: 14,
        controlDcSize: 0,
        stats: {
            culture: { value: 10, modifier: 0 },
            economy: { value: 10, modifier: 0 },
            loyalty: { value: 10, modifier: 0 },
            stability: { value: 10, modifier: 0 }
        },
        ruins: {
            corruption: { score: 0, penalty: 0, threshold: 10 },
            crime: { score: 0, penalty: 0, threshold: 10 },
            decay: { score: 0, penalty: 0, threshold: 10 },
            strife: { score: 0, penalty: 0, threshold: 10 }
        },
        commodities: {
            food: { value: 0, max: 4 },
            lumber: { value: 0, max: 4 },
            luxuries: { value: 0, max: 4 },
            ore: { value: 0, max: 4 },
            stone: { value: 0, max: 4 }
        },
        workSites: {
            farmlands: 0,
            lumberCamps: 0,
            mines: 0,
            quarries: 0
        },
        leaders: {
            ruler: { name: "", invested: false },
            counselor: { name: "", invested: false },
            general: { name: "", invested: false },
            emissary: { name: "", invested: false },
            magister: { name: "", invested: false },
            treasurer: { name: "", invested: false },
            viceroy: { name: "", invested: false },
            warden: { name: "", invested: false }
        },
        skills: {
            agriculture: { prof: 0, status: 0, circ: 0, item: 0, other: 0 },
            arts: { prof: 0, status: 0, circ: 0, item: 0, other: 0 },
            boating: { prof: 0, status: 0, circ: 0, item: 0, other: 0 },
            defense: { prof: 0, status: 0, circ: 0, item: 0, other: 0 },
            engineering: { prof: 0, status: 0, circ: 0, item: 0, other: 0 },
            exploration: { prof: 0, status: 0, circ: 0, item: 0, other: 0 },
            folklore: { prof: 0, status: 0, circ: 0, item: 0, other: 0 },
            industry: { prof: 0, status: 0, circ: 0, item: 0, other: 0 },
            intrigue: { prof: 0, status: 0, circ: 0, item: 0, other: 0 },
            magic: { prof: 0, status: 0, circ: 0, item: 0, other: 0 },
            politics: { prof: 0, status: 0, circ: 0, item: 0, other: 0 },
            scholarship: { prof: 0, status: 0, circ: 0, item: 0, other: 0 },
            statecraft: { prof: 0, status: 0, circ: 0, item: 0, other: 0 },
            trade: { prof: 0, status: 0, circ: 0, item: 0, other: 0 },
            warfare: { prof: 0, status: 0, circ: 0, item: 0, other: 0 },
            wilderness: { prof: 0, status: 0, circ: 0, item: 0, other: 0 }
        },
        featsText: "",
        abilitiesText: "",
        events: [],
        urbanGrid: {
            settlementName: "Столица",
            settlementType: "village",
            level: 1,
            consumption: 0,
            overcrowded: false,
            infraStreetlamps: false,
            infraPavedStreets: false,
            infraSewer: false,
            garrisonedArmies: "",
            ongoingEvents: "",
            borders: { top: "none", bottom: "none", left: "none", right: "none" },
            buildings: []
        }
    },

    roleNames: {
        ruler: "Правитель",
        counselor: "Канцлер",
        general: "Генерал",
        emissary: "Дипломат",
        magister: "Магистр",
        treasurer: "Казначей",
        viceroy: "Наместник",
        warden: "Хранитель"
    },

    skillConfig: [
        { id: 'warfare', label: 'Военное дело', ability: 'loyalty' },
        { id: 'wilderness', label: 'Дикие земли', ability: 'stability' },
        { id: 'agriculture', label: 'Земледелие', ability: 'stability' },
        { id: 'engineering', label: 'Инженерное дело', ability: 'stability' },
        { id: 'intrigue', label: 'Интрига', ability: 'loyalty' },
        { id: 'arts', label: 'Искусства', ability: 'culture' },
        { id: 'exploration', label: 'Исследование', ability: 'economy' },
        { id: 'boating', label: 'Лодочный транспорт', ability: 'economy' },
        { id: 'magic', label: 'Магия', ability: 'culture' },
        { id: 'defense', label: 'Оборона', ability: 'stability' },
        { id: 'scholarship', label: 'Образование', ability: 'culture' },
        { id: 'politics', label: 'Политика', ability: 'loyalty' },
        { id: 'industry', label: 'Производство', ability: 'economy' },
        { id: 'trade', label: 'Торговля', ability: 'economy' },
        { id: 'folklore', label: 'Традиции', ability: 'culture' },
        { id: 'statecraft', label: 'Управление', ability: 'loyalty' },
    ],
    init(mapData, onSave) {
        try {
            this.mapDataRef = mapData || { hexes: {}, kingdom: null };
            this.onSaveCallback = onSave;

            if (!this.mapDataRef.kingdom) {
                this.mapDataRef.kingdom = JSON.parse(JSON.stringify(this.defaultState));
            } else {
                this.mapDataRef.kingdom = this._mergeWithDefaults(this.mapDataRef.kingdom);
            }

            this.state = this.mapDataRef.kingdom;
            this.recalculateModifiers();
            window.KingdomManager = this;
        } catch (e) {
            console.error("Ошибка при инициализации KingdomManager:", e);
        }
    },

    _mergeWithDefaults(saved) {
        const base = JSON.parse(JSON.stringify(this.defaultState));
        const merged = { ...base, ...saved };

        if (typeof saved.ruins === 'number') {
            merged.ruins = base.ruins;
            merged.ruins.corruption.score = saved.ruins;
        } else {
            merged.ruins = { ...base.ruins, ...(saved.ruins || {}) };
        }

        merged.stats = { ...base.stats, ...(saved.stats || {}) };
        merged.commodities = { ...base.commodities, ...(saved.commodities || {}) };
        merged.workSites = { ...base.workSites, ...(saved.workSites || {}) };
        merged.skills = { ...base.skills, ...(saved.skills || {}) };
        merged.urbanGrid = {
            ...base.urbanGrid,
            ...(saved.urbanGrid || {}),
            borders: { ...base.urbanGrid.borders, ...((saved.urbanGrid && saved.urbanGrid.borders) || {}) },
            buildings: Array.isArray(saved.urbanGrid?.buildings) ? saved.urbanGrid.buildings : []
        };

        for (let role in base.leaders) {
            const val = saved.leaders ? saved.leaders[role] : null;
            if (typeof val === 'string') {
                merged.leaders[role] = { name: val, invested: false };
            } else if (val && typeof val === 'object') {
                merged.leaders[role] = { name: val.name || "", invested: !!val.invested };
            }
        }

        if (!Array.isArray(merged.events)) merged.events = [];
        return merged;
    },

    updateMapData(newMapData) {
        try {
            this.mapDataRef = newMapData || { hexes: {}, kingdom: null };
            if (!this.mapDataRef.kingdom) {
                this.mapDataRef.kingdom = JSON.parse(JSON.stringify(this.defaultState));
            } else {
                this.mapDataRef.kingdom = this._mergeWithDefaults(this.mapDataRef.kingdom);
            }
            this.state = this.mapDataRef.kingdom;
            this.recalculateModifiers();
            this.renderUi();
        } catch (e) {
            console.error("Ошибка при обновлении данных KingdomManager:", e);
        }
    },

    switchSubTab(tabName) {
        this.activeSubTab = tabName;
        this.renderUi();
    },



    // Связь характеристик с типами упадка (Ruins) и ролями лидеров (Invested +1)
    ruinAbilityMap: {
        corruption: 'culture',
        crime: 'economy',
        decay: 'stability',
        strife: 'loyalty'
    },

    leaderAbilityMap: {
        ruler: 'loyalty',
        counselor: 'culture',
        general: 'stability',
        emissary: 'loyalty',
        magister: 'culture',
        treasurer: 'economy',
        viceroy: 'economy',
        warden: 'stability'
    },

    getSizeModifier(size) {
        const s = parseInt(size, 10) || 1;
        if (s >= 100) return 4;
        if (s >= 50) return 3;
        if (s >= 25) return 2;
        if (s >= 10) return 1;
        return 0;
    },

    getUnrestPenalty() {
        const u = parseInt(this.state?.unrest, 10) || 0;
        if (u >= 15) return -4;
        if (u >= 10) return -3;
        if (u >= 5) return -2;
        if (u >= 1) return -1;
        return 0;
    },

    recalculateModifiers() {
        // 1. Модификаторы 4 основных характеристик
        for (let key in this.state.stats) {
            const val = parseInt(this.state.stats[key].value, 10) || 10;
            this.state.stats[key].modifier = Math.floor((val - 10) / 2);
        }

        // 2. Модификатор Control DC от Size и лимит складов Commodities
        const sizeMod = this.getSizeModifier(this.state.size);
        this.state.controlDcSize = sizeMod;

        const maxComm = 4 + sizeMod * 4;
        if (this.state.commodities) {
            ['food', 'lumber', 'luxuries', 'ore', 'stone'].forEach(c => {
                if (this.state.commodities[c]) {
                    this.state.commodities[c].max = maxComm;
                }
            });
        }

        // 3. Пороги (10 + мод. характеристики) и штрафы Упадка (Ruins)
        if (this.state.ruins) {
            for (let ruinKey in this.ruinAbilityMap) {
                const r = this.state.ruins[ruinKey];
                if (!r) continue;
                const abKey = this.ruinAbilityMap[ruinKey];
                const abMod = this.state.stats[abKey]?.modifier || 0;
                r.threshold = Math.max(1, 10 + abMod);
                r.penalty = Math.floor((parseInt(r.score, 10) || 0) / r.threshold);
            }
        }

        // 4. Синхронизация бонусов построек и Consumption
        this.syncSettlementStats();
    },

    getSkillTotal(skillId) {
        const cfg = this.skillConfig.find(s => s.id === skillId);
        if (!cfg) return 0;

        const abilityMod = this.state.stats[cfg.ability]?.modifier || 0;
        const sk = this.state.skills[skillId] || { prof: 0, status: 0, circ: 0, item: 0, other: 0 };
        const lvl = parseInt(this.state.level, 10) || 1;
        const profBonus = sk.prof > 0 ? (sk.prof + lvl) : 0;

        // Бонус +1, если есть хотя бы один вложенный (Invested) лидер по этой характеристике
        let investedBonus = 0;
        if (this.state.leaders) {
            for (let role in this.leaderAbilityMap) {
                if (this.leaderAbilityMap[role] === cfg.ability && this.state.leaders[role]?.invested && (this.state.leaders[role]?.name || '').trim() !== '') {
                    investedBonus = 1;
                    break;
                }
            }
        }

        // Штраф от соответствующего Упадка (Ruin) и Беспокойства (Unrest)
        const ruinKey = Object.keys(this.ruinAbilityMap).find(k => this.ruinAbilityMap[k] === cfg.ability);
        const ruinPenalty = ruinKey ? (parseInt(this.state.ruins?.[ruinKey]?.penalty, 10) || 0) : 0;
        const unrestPenalty = this.getUnrestPenalty();

        return abilityMod + profBonus + investedBonus + (sk.status || 0) + (sk.circ || 0) + (sk.item || 0) + (sk.other || 0) - ruinPenalty + unrestPenalty;
    },




    syncSettlementStats() {
        if (!this.state || typeof KingdomBuildings.calculateSettlementEffects !== 'function') return;

        const ug = this.state.urbanGrid;
        const buildings = ug?.buildings || [];
        const effects = KingdomBuildings.calculateSettlementEffects(buildings);

        // 1. Синхронизация максимальных Item-бонусов в таблицу навыков
        if (this.state.skills) {
            const maxBonuses = effects.maxSkillBonuses || {};
            this.skillConfig.forEach(cfg => {
                if (!this.state.skills[cfg.id]) {
                    this.state.skills[cfg.id] = { prof: 0, status: 0, circ: 0, item: 0, other: 0 };
                }
                this.state.skills[cfg.id].item = maxBonuses[cfg.id] || 0;
            });
        }

        // 2. Автоматический расчёт перенаселения и Consumption поселения
        if (ug) {
            const autoOvercrowded = !!effects.isOvercrowded;
            ug.overcrowded = autoOvercrowded;

            const baseByType = { village: 1, town: 2, city: 4, metropolis: 6 };
            const baseCons = baseByType[ug.settlementType] ?? 1;
            const crowdPenalty = ug.overcrowded ? 2 : 0;
            const totalSettlementCons = Math.max(0, baseCons + (effects.totalConsumption || 0) + crowdPenalty);

            ug.consumption = totalSettlementCons;
            this.state.consumption = totalSettlementCons;
        }

    },

    getResourceDieSides() {
        const s = parseInt(this.state.size, 10) || 1;
        if (s >= 100) return 12;
        if (s >= 50) return 10;
        if (s >= 25) return 8;
        if (s >= 10) return 6;
        return 4;
    },

    openUpkeepModal() {
        this.saveFromUi();

        const s = this.state;
        const lvl = parseInt(s.level, 10) || 1;
        const diceCount = lvl + 4;
        const dieSides = this.getResourceDieSides();

        const existing = document.getElementById('kUpkeepModalOverlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'kUpkeepModalOverlay';
        overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.82); z-index:9999999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(3px);';

        overlay.innerHTML = `
            <div style="background:linear-gradient(135deg, #112618 0%, #09140d 100%); border:2px solid #b89445; border-radius:8px; padding:22px 26px; width:460px; max-width:92vw; color:#ebd291; box-shadow:0 15px 40px rgba(0,0,0,0.9), 0 0 25px rgba(223,188,111,0.35); font-family:'Tinos', serif;">
                <div style="font-size:20px; font-weight:bold; color:#ffd875; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid #543e0d; padding-bottom:8px; margin-bottom:14px;">
                    ⚜ Фаза содержания
                </div>

                <div style="background:rgba(0,0,0,0.35); border:1px solid #543e0d; border-radius:6px; padding:12px; margin-bottom:14px; font-size:15px; line-height:1.45;">
                    <div>• Добыча со складов: <b>+${s.workSites.farmlands} Еды</b>, <b>+${s.workSites.lumberCamps} Древесины</b>, <b>+${s.workSites.mines} Руды</b>, <b>+${s.workSites.quarries} Камня</b></div>
                    <div>• Расход провизии: <b style="color:#ff7675;">-${s.consumption} Food</b></div>
                </div>

                <div style="margin-bottom:16px;">
                    <label style="display:block; font-size:15px; font-weight:bold; color:#ffd875; margin-bottom:6px;">
                        🎲 Бросьте за столом <span style="color:#2ecc71; font-size:18px; font-family:monospace;">${diceCount}d${dieSides}</span> и введите сумму RP:
                    </label>
                    <input type="number" id="kUpkeepDiceInput" class="k-inp" min="0" placeholder="Например: ${diceCount * 2}" style="font-size:20px; font-weight:bold; text-align:center; padding:8px; border-color:#d4af37; color:#ffd875;">
                </div>

                <div style="display:flex; gap:12px; justify-content:flex-end;">
                    <button type="button" class="btn cc" id="kUpkeepCancelBtn">Отмена</button>
                    <button type="button" class="btn ok" id="kUpkeepConfirmBtn">⚜ Применить ход</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const inputEl = overlay.querySelector('#kUpkeepDiceInput');
        const btnCancel = overlay.querySelector('#kUpkeepCancelBtn');
        const btnConfirm = overlay.querySelector('#kUpkeepConfirmBtn');

        setTimeout(() => inputEl.focus(), 50);

        const submit = () => {
            const val = parseInt(inputEl.value, 10);
            if (isNaN(val) || val < 0) {
                inputEl.style.borderColor = '#e74c3c';
                inputEl.focus();
                return;
            }
            overlay.remove();
            this.applyUpkeepWithRoll(val);
        };

        btnCancel.addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
        btnConfirm.addEventListener('click', submit);
        inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') submit();
            if (e.key === 'Escape') overlay.remove();
        });
    },




    applyUpkeepWithRoll(rolledRp) {
        const s = this.state;
        const changes = [];

        // 1. Сбор ресурсов с рабочих участков (Work Sites)
        const harvests = [
            { site: 'farmlands', comm: 'food', label: 'Еда' },
            { site: 'lumberCamps', comm: 'lumber', label: 'Древесина' },
            { site: 'mines', comm: 'ore', label: 'Руда' },
            { site: 'quarries', comm: 'stone', label: 'Камень' }
        ];

        harvests.forEach(({ site, comm, label }) => {
            const count = parseInt(s.workSites[site], 10) || 0;
            if (count > 0) {
                const before = parseInt(s.commodities[comm].value, 10) || 0;
                const max = parseInt(s.commodities[comm].max, 10) || 4;
                const after = Math.min(max, before + count);
                const gained = after - before;
                s.commodities[comm].value = after;

                const capNote = (before + count > max) ? ` <span style="color:#f39c12;">(лимит склада ${max})</span>` : '';
                changes.push(`<div>• <b>${label}:</b> ${before} → <b style="color:#2ecc71;">${after}</b> (+${gained})${capNote}</div>`);
            }
        });

        // 2. Оплата потребления (Consumption) из запасов Food
        const cons = parseInt(s.consumption, 10) || 0;
        if (cons > 0) {
            const foodBefore = parseInt(s.commodities.food.value, 10) || 0;
            if (foodBefore >= cons) {
                s.commodities.food.value = foodBefore - cons;
                changes.push(`<div>• <b>Потребление (-${cons} Еды):</b> ${foodBefore} → <b style="color:#ebd291;">${s.commodities.food.value}</b></div>`);
            } else {
                const deficit = cons - foodBefore;
                const unrestBefore = parseInt(s.unrest, 10) || 0;
                s.commodities.food.value = 0;
                s.unrest = unrestBefore + deficit;
                changes.push(`<div style="color:#ff7675;">• <b>⚠ Нехватка провизии!</b> Списано ${foodBefore} Еды (остаток 0), <b>Беспорядки:</b> ${unrestBefore} → <b>${s.unrest}</b> (+${deficit})</div>`);
            }
        } else {
            changes.push(`<div>• <b>Потребление:</b> 0 Food</div>`);
        }

        // 3. Начисление RP из введённого значения костей
        const rpBefore = parseInt(s.rp, 10) || 0;
        const addedRp = parseInt(rolledRp, 10) || 0;
        s.rp = rpBefore + addedRp;
        changes.push(`<div>• <b>Очки ресурсов (RP):</b> ${rpBefore} → <b style="color:#ffd875;">${s.rp}</b> (+${addedRp})</div>`);

        this.recalculateModifiers();
        this._persist();
        this.renderUi();

        // Показываем стилизованное окно с результатами хода
        this._showUpkeepResultModal(changes);
    },

    _showUpkeepResultModal(changesHtmlList) {
        const existing = document.getElementById('kUpkeepResultOverlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'kUpkeepResultOverlay';
        overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.82); z-index:9999999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(3px);';

        overlay.innerHTML = `
            <div style="background:linear-gradient(135deg, #112618 0%, #09140d 100%); border:2px solid #dfbc6f; border-radius:8px; padding:22px 26px; width:480px; max-width:92vw; color:#ebd291; box-shadow:0 15px 40px rgba(0,0,0,0.9), 0 0 30px rgba(255,216,117,0.35); font-family:'Tinos', serif;">
                <div style="font-size:20px; font-weight:bold; color:#ffd875; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid #543e0d; padding-bottom:8px; margin-bottom:14px;">
                    ⚜ Итоги фазы содержания
                </div>

                <div style="background:rgba(0,0,0,0.4); border:1px solid #543e0d; border-radius:6px; padding:14px 16px; margin-bottom:18px; font-size:16px; line-height:1.65; display:flex; flex-direction:column; gap:6px;">
                    ${changesHtmlList.join('')}
                </div>

                <div style="display:flex; justify-content:flex-end;">
                    <button type="button" class="btn ok" id="kUpkeepResultCloseBtn" style="min-width:130px;">⚜ Готово</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const closeBtn = overlay.querySelector('#kUpkeepResultCloseBtn');
        const closeModal = () => {
            overlay.remove();
            window.removeEventListener('keydown', onKey);
        };
        const onKey = (e) => {
            if (e.key === 'Enter' || e.key === 'Escape') closeModal();
        };

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
        window.addEventListener('keydown', onKey);
        setTimeout(() => closeBtn.focus(), 50);
    },

    openEndTurnModal() {
        this.saveFromUi();

        const s = this.state;
        const currentRp = parseInt(s.rp, 10) || 0;
        const xpGain = Math.min(120, Math.max(0, currentRp));
        const currentXp = parseInt(s.xp, 10) || 0;
        const nextXp = currentXp + xpGain;

        const existing = document.getElementById('kEndTurnOverlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'kEndTurnOverlay';
        overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.82); z-index:9999999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(3px);';

        overlay.innerHTML = `
            <div style="background:linear-gradient(135deg, #112618 0%, #09140d 100%); border:2px solid #b89445; border-radius:8px; padding:22px 26px; width:460px; max-width:92vw; color:#ebd291; box-shadow:0 15px 40px rgba(0,0,0,0.9), 0 0 25px rgba(223,188,111,0.35); font-family:'Tinos', serif;">
                <div style="font-size:20px; font-weight:bold; color:#ffd875; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid #543e0d; padding-bottom:8px; margin-bottom:14px;">
                    ⏳ Завершение хода королевства
                </div>

                <div style="background:rgba(0,0,0,0.4); border:1px solid #543e0d; border-radius:6px; padding:14px; margin-bottom:16px; font-size:15px; line-height:1.55;">
                    <div>• Неизрасходовано RP: <b>${currentRp}</b> (сбрасываются в 0 в конце хода)</div>
                    <div>• Конвертация в опыт (макс. 120 XP за ход): <b style="color:#2ecc71;">+${xpGain} XP</b></div>
                    <div>• Опыт королевства (XP): <b>${currentXp}</b> → <b style="color:#ffd875;">${nextXp} / 1000</b></div>
                    ${nextXp >= 1000 ? `<div style="margin-top:8px; color:#ffd875; font-weight:bold;">👑 Доступно повышение уровня королевства!</div>` : ''}
                </div>

                <div style="display:flex; gap:12px; justify-content:flex-end;">
                    <button type="button" class="btn cc" id="kEndTurnCancel">Отмена</button>
                    <button type="button" class="btn ok" id="kEndTurnConfirm">⚜ Завершить ход</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        overlay.querySelector('#kEndTurnCancel').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
        overlay.querySelector('#kEndTurnConfirm').addEventListener('click', () => {
            s.rp = 0;
            s.xp = nextXp;
            overlay.remove();
            this.recalculateModifiers();
            this._persist();
            this.renderUi();

            if (s.xp >= 1000) {
                this.openLevelUpModal();
            }
        });
    },



    openLevelUpModal() {
        this.saveFromUi();

        const s = this.state;
        const currentXp = parseInt(s.xp, 10) || 0;
        if (currentXp < 1000) {
            alert(`Для повышения уровня нужно 1000 XP (сейчас ${currentXp} XP).`);
            return;
        }

        const existing = document.getElementById('kLevelUpOverlay');
        if (existing) existing.remove();

        const statLabels = {
            culture: 'Культура',
            economy: 'Экономика',
            loyalty: 'Лояльность',
            stability: 'Стабильность'
        };

        const checkboxesHtml = Object.entries(statLabels).map(([key, label]) => {
            const curVal = parseInt(s.stats[key]?.value, 10) || 10;
            const step = curVal >= 18 ? 1 : 2;
            return `
                <label style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:rgba(0,0,0,0.35); border:1px solid #543e0d; border-radius:5px; cursor:pointer;">
                    <span style="display:flex; align-items:center; gap:8px; font-weight:bold; color:#ebd291;">
                        <input type="checkbox" class="k-lvlup-stat-cb" value="${key}"> ${label}
                    </span>
                    <span style="color:#2ecc71; font-family:monospace; font-weight:bold;">${curVal} → ${curVal + step} (+${step})</span>
                </label>
            `;
        }).join('');

        const overlay = document.createElement('div');
        overlay.id = 'kLevelUpOverlay';
        overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:9999999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(3px);';

        overlay.innerHTML = `
            <div style="background:linear-gradient(135deg, #142b1c 0%, #09140d 100%); border:2px solid #ffd875; border-radius:8px; padding:22px 26px; width:470px; max-width:92vw; color:#ebd291; box-shadow:0 15px 45px rgba(0,0,0,0.95), 0 0 35px rgba(255,216,117,0.45); font-family:'Tinos', serif;">
                <div style="font-size:21px; font-weight:bold; color:#ffd875; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid #8a6421; padding-bottom:8px; margin-bottom:12px;">
                    👑 Повышение уровня королевства (${s.level} → ${(parseInt(s.level, 10) || 1) + 1})
                </div>

                <div style="font-size:14px; color:#dfbc6f; margin-bottom:12px; line-height:1.4;">
                    • Списывается <b>1000 XP</b> (остаток: <b>${currentXp - 1000} XP</b>)<br>
                    • Базовая <b>Control DC</b> увеличивается на <b>+1</b> (${s.controlDcBase} → ${(parseInt(s.controlDcBase, 10) || 14) + 1})<br>
                    • Выберите <b>2 разные характеристики</b> для повышения:
                </div>

                <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px;">
                    ${checkboxesHtml}
                </div>

                <div style="display:flex; gap:12px; justify-content:flex-end;">
                    <button type="button" class="btn cc" id="kLvlUpCancel">Позже</button>
                    <button type="button" class="btn ok" id="kLvlUpConfirm" disabled style="opacity:0.5;">👑 Повысить уровень</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const cbs = Array.from(overlay.querySelectorAll('.k-lvlup-stat-cb'));
        const btnConfirm = overlay.querySelector('#kLvlUpConfirm');

        cbs.forEach(cb => {
            cb.addEventListener('change', () => {
                const checked = cbs.filter(item => item.checked);
                if (checked.length > 2) {
                    cb.checked = false;
                    return;
                }
                const ready = checked.length === 2;
                btnConfirm.disabled = !ready;
                btnConfirm.style.opacity = ready ? '1' : '0.5';
            });
        });

        overlay.querySelector('#kLvlUpCancel').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

        btnConfirm.addEventListener('click', () => {
            const chosen = cbs.filter(item => item.checked).map(item => item.value);
            if (chosen.length !== 2) return;

            s.xp = Math.max(0, (parseInt(s.xp, 10) || 0) - 1000);
            s.level = (parseInt(s.level, 10) || 1) + 1;
            s.controlDcBase = (parseInt(s.controlDcBase, 10) || 14) + 1;

            chosen.forEach(key => {
                const cur = parseInt(s.stats[key].value, 10) || 10;
                s.stats[key].value = cur + (cur >= 18 ? 1 : 2);
            });

            overlay.remove();
            this.recalculateModifiers();
            this._persist();
            this.renderUi();
        });
    },


    openTradeModal() {
        this.saveFromUi();

        const existing = document.getElementById('kTradeModalOverlay');
        if (existing) existing.remove();

        const rates = {
            food:     { label: '🌾 Еда',         buy: 2, sell: 1 },
            lumber:   { label: '🪵 Древесина',    buy: 2, sell: 1 },
            ore:      { label: '⛏ Руда',          buy: 2, sell: 1 },
            stone:    { label: '🧱 Камень',     buy: 2, sell: 1 },
            luxuries: { label: '💎 Предметы роскоши)', buy: 4, sell: 2 }
        };

        const overlay = document.createElement('div');
        overlay.id = 'kTradeModalOverlay';
        overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.84); z-index:9999999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(3px);';

        const renderModalContent = () => {
            const s = this.state;
            const curRp = parseInt(s.rp, 10) || 0;

            const rowsHtml = Object.entries(rates).map(([key, info]) => {
                const c = s.commodities[key] || { value: 0, max: 4 };
                const canBuy = curRp >= info.buy && c.value < c.max;
                const canSell = c.value > 0;

                return `
                    <tr>
                        <td style="font-weight:bold; color:#ebd291; padding:8px 6px;">${info.label}</td>
                        <td style="text-align:center; font-family:monospace; font-size:16px; color:#ffd875; font-weight:bold;">${c.value} / ${c.max}</td>
                        <td style="text-align:center;">
                            <button type="button" class="btn ok k-trade-buy" data-comm="${key}" ${canBuy ? '' : 'disabled'} style="padding:5px 10px; font-size:12px; opacity:${canBuy ? '1' : '0.4'};">
                                +1 за ${info.buy} RP
                            </button>
                        </td>
                        <td style="text-align:center;">
                            <button type="button" class="btn cc k-trade-sell" data-comm="${key}" ${canSell ? '' : 'disabled'} style="padding:5px 10px; font-size:12px; opacity:${canSell ? '1' : '0.4'};">
                                -1 → +${info.sell} RP
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');

            overlay.innerHTML = `
                <div style="background:linear-gradient(135deg, #112618 0%, #09140d 100%); border:2px solid #b89445; border-radius:8px; padding:22px 26px; width:540px; max-width:94vw; color:#ebd291; box-shadow:0 15px 40px rgba(0,0,0,0.9), 0 0 25px rgba(223,188,111,0.35); font-family:'Tinos', serif;">
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #543e0d; padding-bottom:8px; margin-bottom:14px;">
                        <span style="font-size:20px; font-weight:bold; color:#ffd875; text-transform:uppercase; letter-spacing:1px;">⚖ Обмен ресурсов (Товары ↔ RP)</span>
                        <span style="background:#040905; border:1px solid #ffd875; padding:4px 12px; border-radius:5px; font-family:monospace; font-size:17px; font-weight:bold; color:#ffd875;">Казна: ${curRp} RP</span>
                    </div>

                    <table class="k-table" style="margin-bottom:16px;">
                        <thead>
                            <tr>
                                <th>Ресурс</th>
                                <th style="text-align:center;">Склад</th>
                                <th style="text-align:center;">Купить</th>
                                <th style="text-align:center;">Продать</th>
                            </tr>
                        </thead>
                        <tbody>${rowsHtml}</tbody>
                    </table>

                    <div style="display:flex; justify-content:flex-end;">
                        <button type="button" class="btn ok" id="kTradeCloseBtn" style="min-width:130px;">⚜ Закрыть</button>
                    </div>
                </div>
            `;

            overlay.querySelectorAll('.k-trade-buy').forEach(btn => {
                btn.addEventListener('click', () => {
                    const key = btn.dataset.comm;
                    const rate = rates[key];
                    const c = s.commodities[key];
                    if ((parseInt(s.rp, 10) || 0) >= rate.buy && c.value < c.max) {
                        s.rp = (parseInt(s.rp, 10) || 0) - rate.buy;
                        c.value += 1;
                        this._persist();
                        this.renderUi();
                        renderModalContent();
                    }
                });
            });

            overlay.querySelectorAll('.k-trade-sell').forEach(btn => {
                btn.addEventListener('click', () => {
                    const key = btn.dataset.comm;
                    const rate = rates[key];
                    const c = s.commodities[key];
                    if (c.value > 0) {
                        c.value -= 1;
                        s.rp = (parseInt(s.rp, 10) || 0) + rate.sell;
                        this._persist();
                        this.renderUi();
                        renderModalContent();
                    }
                });
            });

            overlay.querySelector('#kTradeCloseBtn').addEventListener('click', () => overlay.remove());
        };

        document.body.appendChild(overlay);
        renderModalContent();

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
    },





    addEventCard() {
        this.state.events.push({
            id: 'ev_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            name: '',
            level: 1,
            skill: 'Society / Politics',
            modifier: 0,
            notes: '',
            status: 'Активно'
        });
        this._persist();
        this.renderUi();
    },

    removeEventCard(eventId) {
        this.state.events = this.state.events.filter(ev => ev.id !== eventId);
        this._persist();
        this.renderUi();
    },

    placeBuilding(buildingId, targetR, targetC, existingUid = null) {
        const meta = KingdomBuildings.getBuildingMeta(buildingId);
        if (!meta) return;

        let rotation = 0;
        if (existingUid) {
            const old = this.state.urbanGrid.buildings.find(b => b.uid === existingUid);
            if (old) rotation = old.rotation || 0;
            this.state.urbanGrid.buildings = this.state.urbanGrid.buildings.filter(b => b.uid !== existingUid);
        }

        const isRotated = (rotation % 180) !== 0;
        const spanCols = isRotated ? meta.rows : meta.cols;
        const spanRows = isRotated ? meta.cols : meta.rows;

        if (targetR + spanRows > 6 || targetC + spanCols > 6) {
            alert("Постройка выходит за границы городской сетки (6×6)!");
            this.renderUi();
            return;
        }

        this.state.urbanGrid.buildings.push({
            uid: existingUid || ('bld_' + Date.now() + '_' + Math.floor(Math.random() * 1000)),
            id: buildingId,
            r: targetR,
            c: targetC,
            rotation
        });

        this.syncSettlementStats();

        this._persist();
        this.renderUi();
    },

    rotateBuilding(uid) {
        const bld = this.state.urbanGrid.buildings.find(b => b.uid === uid);
        if (!bld) return;

        const meta = KingdomBuildings.getBuildingMeta(bld.id);
        if (!meta) return;

        const nextRot = ((bld.rotation || 0) + 90) % 360;
        const isRotated = (nextRot % 180) !== 0;
        const spanCols = isRotated ? meta.rows : meta.cols;
        const spanRows = isRotated ? meta.cols : meta.rows;

        if (bld.r + spanRows > 6 || bld.c + spanCols > 6) {
            alert("Недостаточно места для поворота у края сетки!");
            return;
        }

        bld.rotation = nextRot;
        this._persist();
        this.renderUi();
    },

    removeBuilding(uid) {
        this.state.urbanGrid.buildings = this.state.urbanGrid.buildings.filter(b => b.uid !== uid);

        this.syncSettlementStats();
        this._persist();
        this.renderUi();
    },
    _persist() {
        if (this.mapDataRef) {
            this.mapDataRef.kingdom = this.state;
        }
        if (this.onSaveCallback) {
            this.onSaveCallback();
        } else {
            localStorage.setItem('hexMapSystemData', JSON.stringify(this.mapDataRef));
        }
    },

    _readInt(id, fallback = 0) {
        const el = document.getElementById(id);
        return el ? (parseInt(el.value, 10) || 0) : fallback;
    },

    _readStr(id, fallback = "") {
        const el = document.getElementById(id);
        return el ? el.value : fallback;
    },

    _readBool(id, fallback = false) {
        const el = document.getElementById(id);
        return el ? el.checked : fallback;
    },

    saveFromUi() {
        try {
            const s = this.state;

            if (this.activeSubTab === 'sheet') {
                s.name = this._readStr('k_name', s.name);
                s.level = this._readInt('k_level', s.level);
                s.xp = this._readInt('k_xp', s.xp);
                s.charter = this._readStr('k_charter', s.charter);
                s.heartland = this._readStr('k_heartland', s.heartland);
                s.government = this._readStr('k_government', s.government);
                s.capitalCity = this._readStr('k_capital', s.capitalCity);

                ['culture', 'economy', 'loyalty', 'stability'].forEach(key => {
                    s.stats[key].value = this._readInt(`k_stat_val_${key}`, s.stats[key].value);
                });

                s.size = this._readInt('k_size', s.size);
                s.rp = this._readInt('k_rp', s.rp);
                s.unrest = this._readInt('k_unrest', s.unrest);
                s.consumption = this._readInt('k_consumption', s.consumption);
                s.fame = this._readInt('k_fame', s.fame);
                s.controlDcBase = this._readInt('k_ctrl_dc_base', s.controlDcBase);

                ['corruption', 'crime', 'decay', 'strife'].forEach(key => {
                    s.ruins[key].score = this._readInt(`k_ruin_score_${key}`, s.ruins[key].score);
                    s.ruins[key].penalty = this._readInt(`k_ruin_pen_${key}`, s.ruins[key].penalty);
                    s.ruins[key].threshold = this._readInt(`k_ruin_thr_${key}`, s.ruins[key].threshold);
                });

                Object.keys(this.roleNames).forEach(role => {
                    s.leaders[role].invested = this._readBool(`k_leader_inv_${role}`, s.leaders[role].invested);
                    s.leaders[role].name = this._readStr(`k_leader_name_${role}`, s.leaders[role].name);
                });

                ['food', 'lumber', 'luxuries', 'ore', 'stone'].forEach(c => {
                    s.commodities[c].value = this._readInt(`k_comm_${c}`, s.commodities[c].value);
                });

                s.workSites.farmlands = this._readInt('k_ws_farmlands', s.workSites.farmlands);
                s.workSites.lumberCamps = this._readInt('k_ws_lumber', s.workSites.lumberCamps);
                s.workSites.mines = this._readInt('k_ws_mines', s.workSites.mines);
                s.workSites.quarries = this._readInt('k_ws_quarries', s.workSites.quarries);

                this.skillConfig.forEach(cfg => {
                    const sk = s.skills[cfg.id];
                    sk.prof = this._readInt(`k_skill_prof_${cfg.id}`, sk.prof);
                    sk.status = this._readInt(`k_skill_status_${cfg.id}`, sk.status);
                    sk.circ = this._readInt(`k_skill_circ_${cfg.id}`, sk.circ);
                    sk.item = this._readInt(`k_skill_item_${cfg.id}`, sk.item); // @TODO need to delete
                    sk.other = this._readInt(`k_skill_other_${cfg.id}`, sk.other);
                });

                s.featsText = this._readStr('k_feats_text', s.featsText);
                s.abilitiesText = this._readStr('k_abilities_text', s.abilitiesText);
            } else if (this.activeSubTab === 'events') {
                document.querySelectorAll('.k-event-card').forEach(card => {
                    const ev = s.events.find(item => item.id === card.dataset.evId);
                    if (ev) {
                        ev.name = card.querySelector('.k-ev-name').value;
                        ev.level = parseInt(card.querySelector('.k-ev-level').value, 10) || 1;
                        ev.skill = card.querySelector('.k-ev-skill').value;
                        ev.modifier = parseInt(card.querySelector('.k-ev-mod').value, 10) || 0;
                        ev.notes = card.querySelector('.k-ev-notes').value;
                        ev.status = card.querySelector('.k-ev-status').value;
                    }
                });
            } else if (this.activeSubTab === 'urban') {
                const ug = s.urbanGrid;
                ug.settlementName = this._readStr('k_ug_name', ug.settlementName);
                ug.settlementType = this._readStr('k_ug_type', ug.settlementType);
                ug.level = this._readInt('k_ug_level', ug.level);
                ug.consumption = this._readInt('k_ug_cons', ug.consumption);
                ug.overcrowded = this._readBool('k_ug_overcrowded', ug.overcrowded);
                ug.infraStreetlamps = this._readBool('k_ug_lamps', ug.infraStreetlamps);
                ug.infraPavedStreets = this._readBool('k_ug_paved', ug.infraPavedStreets);
                ug.infraSewer = this._readBool('k_ug_sewer', ug.infraSewer);
                ug.garrisonedArmies = this._readStr('k_ug_armies', ug.garrisonedArmies);
                ug.ongoingEvents = this._readStr('k_ug_events', ug.ongoingEvents);

                ['top', 'bottom', 'left', 'right'].forEach(side => {
                    ug.borders[side] = this._readStr(`k_ug_border_${side}`, ug.borders[side]);
                });
            }

            this.recalculateModifiers();
            this._persist();
            this.renderUi();

            const saveBtn = document.querySelector('.k-btn-save-small');
            if (saveBtn) {
                saveBtn.style.setProperty('filter', 'brightness(1.5)', 'important');
                saveBtn.textContent = '⚜ Сохранено!';
                setTimeout(() => {
                    saveBtn.style.removeProperty('filter');
                    saveBtn.textContent = '⚜ Сохранить';
                }, 800);
            }
        } catch (error) {
            console.error("Критическая ошибка внутри метода saveFromUi:", error);
        }
    },

    renderUi() {
        const container = document.getElementById('kingdomTabletContainer');
        if (!container) return;

        container.innerHTML = KingdomSheetRenderer.renderMainLayout(
            this.state,
            this.activeSubTab,
            {
                roleNames: this.roleNames,
                skillConfig: this.skillConfig,
                getSkillTotal: (id) => this.getSkillTotal(id)
            }
        );

        this._bindEvents(container);
    },



    _bindEvents(container) {
        container.querySelectorAll('[data-k-tab]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.saveFromUi();
                this.switchSubTab(btn.dataset.kTab);
            });
        });

        const btnSave = container.querySelector('.k-btn-save-small');
        if (btnSave) btnSave.addEventListener('click', () => this.saveFromUi());

        const btnUpkeep = container.querySelector('#kBtnUpkeepTurn');
        if (btnUpkeep) btnUpkeep.addEventListener('click', () => this.openUpkeepModal());

        const btnEndTurn = container.querySelector('#kBtnEndTurn');
        if (btnEndTurn) btnEndTurn.addEventListener('click', () => this.openEndTurnModal());

        const btnLevelUp = container.querySelector('#kBtnLevelUp');
        if (btnLevelUp) btnLevelUp.addEventListener('click', () => this.openLevelUpModal());

        const btnTrade = container.querySelector('#kBtnTradeComm');
        if (btnTrade) btnTrade.addEventListener('click', () => this.openTradeModal());


        const btnAddEv = container.querySelector('#kBtnAddEvent');
        if (btnAddEv) btnAddEv.addEventListener('click', () => this.addEventCard());

        container.querySelectorAll('[data-del-ev]').forEach(btn => {
            btn.addEventListener('click', () => this.removeEventCard(btn.dataset.delEv));
        });

        container.querySelectorAll('.k-bld-palette-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({ bldId: item.dataset.bldId, uid: null }));
            });
        });

        container.querySelectorAll('.k-placed-bld').forEach(el => {
            el.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({ bldId: el.dataset.bldId, uid: el.dataset.placedUid }));
            });
        });

        container.querySelectorAll('[data-rot-uid]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.rotateBuilding(btn.dataset.rotUid);
            });
        });

        container.querySelectorAll('[data-del-uid]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeBuilding(btn.dataset.delUid);
            });
        });

        container.querySelectorAll('.k-urban-cell').forEach(cell => {
            cell.addEventListener('dragover', (e) => e.preventDefault());
            cell.addEventListener('drop', (e) => {
                e.preventDefault();
                try {
                    const payload = JSON.parse(e.dataTransfer.getData('text/plain'));
                    const r = parseInt(cell.dataset.r, 10);
                    const c = parseInt(cell.dataset.c, 10);
                    this.placeBuilding(payload.bldId, r, c, payload.uid);
                } catch (err) {
                    console.error("Ошибка размещения постройки:", err);
                }
            });
        });

        // Раскрытие и сворачивание категорий построек (1, 2, 4 клетки)
        container.querySelectorAll('.k-catalog-group-header').forEach(header => {
            header.addEventListener('click', () => {
                const groupEl = header.closest('.k-catalog-group');
                const key = groupEl.dataset.groupKey;
                const nowCollapsed = groupEl.classList.toggle('collapsed');
                header.querySelector('.k-group-arrow').textContent = nowCollapsed ? '▸' : '▾';

                try {
                    const saved = JSON.parse(localStorage.getItem('pf_km_catalog_collapsed') || '{}');
                    saved[key] = nowCollapsed;
                    localStorage.setItem('pf_km_catalog_collapsed', JSON.stringify(saved));
                } catch (e) {}
            });
        });

        // Динамическое изменение ширины списка построек мышью
        const catalogPanel = container.querySelector('#kCatalogPanel');
        const catalogResizer = container.querySelector('#kCatalogResizer');
        if (catalogPanel && catalogResizer) {
            let isResizing = false;

            const onMouseMove = (e) => {
                if (!isResizing) return;
                const rect = catalogPanel.getBoundingClientRect();
                const newWidth = Math.min(750, Math.max(240, Math.round(e.clientX - rect.left)));
                catalogPanel.style.width = `${newWidth}px`;
            };

            const onMouseUp = () => {
                if (!isResizing) return;
                isResizing = false;
                catalogResizer.classList.remove('active');
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
                localStorage.setItem('pf_km_catalog_width', parseInt(catalogPanel.style.width, 10));
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
            };

            catalogResizer.addEventListener('mousedown', (e) => {
                e.preventDefault();
                isResizing = true;
                catalogResizer.classList.add('active');
                document.body.style.cursor = 'col-resize';
                document.body.style.userSelect = 'none';
                window.addEventListener('mousemove', onMouseMove);
                window.addEventListener('mouseup', onMouseUp);
            });
        }

        // Живой поиск построек по названию (английскому или русскому)
        const searchInput = container.querySelector('#kCatalogSearchInput');
        const searchClear = container.querySelector('#kCatalogSearchClear');
        if (searchInput && searchClear) {
            const applyCatalogFilter = () => {
                const query = searchInput.value.trim().toLowerCase();
                searchClear.style.display = query ? 'flex' : 'none';

                let savedCollapsed = {};
                try {
                    savedCollapsed = JSON.parse(localStorage.getItem('pf_km_catalog_collapsed') || '{}');
                } catch (e) {}

                container.querySelectorAll('.k-catalog-group').forEach(groupEl => {
                    const key = groupEl.dataset.groupKey;
                    const items = groupEl.querySelectorAll('.k-bld-palette-item');
                    let visibleCount = 0;

                    items.forEach(item => {
                        const name = (item.getAttribute('title') || '').toLowerCase();
                        const isMatch = !query || name.includes(query);
                        item.style.display = isMatch ? 'flex' : 'none';
                        if (isMatch) visibleCount++;
                    });

                    const countBadge = groupEl.querySelector('.k-group-count');
                    if (countBadge) countBadge.textContent = visibleCount;

                    if (query) {
                        groupEl.style.display = visibleCount > 0 ? 'block' : 'none';
                        groupEl.classList.remove('collapsed');
                        groupEl.querySelector('.k-group-arrow').textContent = '▾';
                    } else {
                        groupEl.style.display = 'block';
                        const wasCollapsed = !!savedCollapsed[key];
                        groupEl.classList.toggle('collapsed', wasCollapsed);
                        groupEl.querySelector('.k-group-arrow').textContent = wasCollapsed ? '▸' : '▾';
                    }
                });
            };

            searchInput.addEventListener('input', applyCatalogFilter);
            searchClear.addEventListener('click', () => {
                searchInput.value = '';
                applyCatalogFilter();
                searchInput.focus();
            });
        }

        // Мгновенный пересчёт Consumption и сохранение при смене Type, Overcrowded или границ
        ['#k_ug_type', '#k_ug_overcrowded', '#k_ug_border_top', '#k_ug_border_bottom', '#k_ug_border_left', '#k_ug_border_right'].forEach(selector => {
            const el = container.querySelector(selector);
            if (el) {
                el.addEventListener('change', () => {
                    this.saveFromUi();
                });
            }
        });

        // Мгновенный автопересчёт на вкладке «Лист и Навыки» при изменении чисел, селектов или чекбоксов
        const sheetGrid = container.querySelector('.k-grid-2col');
        if (sheetGrid) {
            sheetGrid.querySelectorAll('input[type="number"], select, input[type="checkbox"]').forEach(el => {
                el.addEventListener('change', () => {
                    this.saveFromUi();
                });
            });
        }

    }
};

export default KingdomManager;
