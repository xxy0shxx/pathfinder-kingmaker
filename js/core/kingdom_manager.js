import KingdomBuildings from '../services/kingdom_buildings.js';
import KingdomSheetRenderer from '../ui/kingdom_sheet_renderer.js';
import { MAP_CONFIG } from '../config/app_config.js';
import EventBus from '../services/event_bus.js';
import ModalManager from '../ui/modal_manager.js';
import KingdomModals from '../ui/kingdom_modals.js';

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
        claimedMilestones: [],
        firstLandmarkClaimed: false,
        isolatedHexesCount: 0,
        siteBonusYield: { lumberCamps: 0, mines: 0, quarries: 0 },
        armies: [],
        diplomacy: [],
        firstDiplomacyXpClaimed: false,
        calendar: { day: 1, month: 2, year: 4710, weatherId: 'clear_mild' }, // 1 Фараста 4710 AR (Весна)
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
            ruler: { name: "", invested: false, actionsUsed: 0 },
            counselor: { name: "", invested: false, actionsUsed: 0 },
            general: { name: "", invested: false, actionsUsed: 0 },
            emissary: { name: "", invested: false, actionsUsed: 0 },
            magister: { name: "", invested: false, actionsUsed: 0 },
            treasurer: { name: "", invested: false, actionsUsed: 0 },
            viceroy: { name: "", invested: false, actionsUsed: 0 },
            warden: { name: "", invested: false, actionsUsed: 0 }
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

    init(mapData) {
        try {
            this.mapDataRef = mapData || { hexes: {}, kingdom: null };

            if (!this.mapDataRef.kingdom) {
                this.mapDataRef.kingdom = JSON.parse(JSON.stringify(this.defaultState));
            } else {
                this.mapDataRef.kingdom = this._mergeWithDefaults(this.mapDataRef.kingdom);
            }

            EventBus.on('data:imported', (newMapData) => this.updateMapData(newMapData));
            EventBus.on('map:hexesChanged', () => this.syncFromHexMap(true));
            EventBus.on('weather:updated', () => {
                this.recalculateModifiers();
                this.renderUi();
            });


            this.state = this.mapDataRef.kingdom;
            this._ensureSettlementsList();
            this.recalculateModifiers();
            window.KingdomManager = this;
        } catch (e) {
            console.error("Ошибка при инициализации KingdomManager:", e);
        }
    },

    _isHexClaimed(h) {
        if (!h || typeof h !== 'object') return false;
        const combined = `${h.title || ''} ${h.text || h.description || ''}`.toLowerCase();
        return !!(h.kingdomClaimed || combined.includes('королевств') || combined.includes('владен'));
    },

    _countIsolatedHexes(hexes) {
        const claimedKeys = new Set(
            Object.entries(hexes).filter(([, h]) => this._isHexClaimed(h)).map(([k]) => k)
        );
        if (claimedKeys.size <= 1) return 0;

        const evenOff = [[0, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0]];
        const oddOff  = [[0, 1], [1, 1], [1, 0], [0, -1], [-1, 0], [-1, 1]];

        const startKey = claimedKeys.has('hex_0_0') ? 'hex_0_0' : Array.from(claimedKeys)[0];
        const visited = new Set([startKey]);
        const queue = [startKey];

        while (queue.length > 0) {
            const curr = queue.shift();
            const [, rStr, cStr] = curr.split('_');
            const r = parseInt(rStr, 10), c = parseInt(cStr, 10);
            const offsets = (r % 2 === 0) ? evenOff : oddOff;

            for (const [dr, dc] of offsets) {
                const nKey = `hex_${r + dr}_${c + dc}`;
                if (claimedKeys.has(nKey) && !visited.has(nKey)) {
                    visited.add(nKey);
                    queue.push(nKey);
                }
            }
        }
        return Math.max(0, claimedKeys.size - visited.size);
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

        merged.settlements = Array.isArray(saved.settlements) ? saved.settlements : null;
        merged.activeSettlementId = saved.activeSettlementId || null;

        for (let role in base.leaders) {
            const val = saved.leaders ? saved.leaders[role] : null;
            if (typeof val === 'string') {
                merged.leaders[role] = { name: val, invested: false, actionsUsed: 0 };
            } else if (val && typeof val === 'object') {
                merged.leaders[role] = {
                    name: val.name || "",
                    invested: !!val.invested,
                    actionsUsed: parseInt(val.actionsUsed, 10) || 0
                };
            }
        }

        if (!Array.isArray(merged.events)) merged.events = [];
        if (!Array.isArray(merged.armies)) merged.armies = [];
        if (!Array.isArray(merged.diplomacy)) merged.diplomacy = [];

        merged.calendar = {
            day: 1,
            month: 2,
            year: MAP_CONFIG.golarionCalendar?.startYear || 4710,
            weatherId: 'clear_mild',
            ...(saved.calendar || {})
        };
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
            this._ensureSettlementsList();
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

    toggleLeaderAction(role, actionIndex) {
        if (!this.state.leaders) this.state.leaders = {};
        let leader = this.state.leaders[role];

        if (typeof leader !== 'object' || leader === null) {
            leader = { name: typeof leader === 'string' ? leader : '', invested: false, actionsUsed: 0 };
            this.state.leaders[role] = leader;
        }

        const current = parseInt(leader.actionsUsed, 10) || 0;
        leader.actionsUsed = (current === actionIndex) ? (actionIndex - 1) : actionIndex;

        this._persist();
        this.renderUi();
    },

    resetAllLeaderActions() {
        if (!this.state?.leaders) return;
        for (let role in this.roleNames) {
            const val = this.state.leaders[role];
            if (typeof val !== 'object' || val === null) {
                this.state.leaders[role] = { name: typeof val === 'string' ? val : '', invested: false, actionsUsed: 0 };
            } else {
                val.actionsUsed = 0;
            }
        }
        this._persist();
        this.renderUi();
    },

    syncFromHexMap(silent = false) {
        const hexes = this.mapDataRef?.hexes || {};
        const s = this.state;
        if (!Array.isArray(s.claimedMilestones)) s.claimedMilestones = [];

        let claimedCount = 0, farmlands = 0, lumberCamps = 0, mines = 0, quarries = 0;
        let bonusLumber = 0, bonusMines = 0, bonusQuarries = 0;
        const notices = [];



        Object.entries(hexes).forEach(([key, h]) => {
            if (!h || typeof h !== 'object') return;
            const combined = `${h.title || ''} ${h.text || h.description || ''}`.toLowerCase();
            const isClaimed = this._isHexClaimed(h);

            // Игнорируем нейтральные/незахваченные гексы для экономики и рабочих участков
            if (!isClaimed) return;

            claimedCount++;
            const isResourceHex = h.type === 'resource';

            // Достопримечательность (Landmark): первая захваченная даёт +40 XP и -1d4 Unrest
            if (h.type === 'landmark' && !h._landmarkRewarded) {
                h._landmarkRewarded = true;
                const unrestDrop = Math.floor(Math.random() * 4) + 1;
                s.unrest = Math.max(0, (parseInt(s.unrest, 10) || 0) - unrestDrop);
                let xpBonus = 0;
                if (!s.firstLandmarkClaimed) {
                    s.firstLandmarkClaimed = true;
                    xpBonus = 40;
                    s.xp = (parseInt(s.xp, 10) || 0) + 40;
                }
                notices.push(`🏛 Достопримечательность (${key}): Беспорядки -${unrestDrop}${xpBonus ? ', +40 XP' : ''}`);
            }

            // Убежище (Refuge): при первом захвате снижает наивысший показатель Краха (Ruin) на 1
            if (/убежищ|refuge/i.test(combined) && !h._refugeRewarded) {
                h._refugeRewarded = true;
                const ruinKeys = ['corruption', 'crime', 'decay', 'strife'];
                const ruinNames = { corruption: 'Коррупция', crime: 'Преступность', decay: 'Упадок', strife: 'Распри' };

                // Ищем показатель Краха с наибольшим количеством очков (> 0)
                let targetRuin = ruinKeys.reduce((best, k) => {
                    const curScore = parseInt(s.ruins?.[k]?.score, 10) || 0;
                    const bestScore = best ? (parseInt(s.ruins?.[best]?.score, 10) || 0) : 0;
                    return curScore > bestScore ? k : best;
                }, null);

                if (targetRuin && s.ruins[targetRuin].score > 0) {
                    s.ruins[targetRuin].score = Math.max(0, s.ruins[targetRuin].score - 1);
                    notices.push(`🛡 Убежище (${key}): показатель «${ruinNames[targetRuin]}» снижен на 1`);
                } else {
                    notices.push(`🛡 Убежище (${key}) захвачено: открыт региональный бонус +2 к Верности/Стабильности`);
                }
            }

            // Рабочие участки учитываются ТОЛЬКО на территории королевства
            const ws = h.workSite || 'none';
            if (ws === 'farmlands' || (ws === 'none' && combined.includes('ферм'))) {
                farmlands++;
            }
            if (ws === 'lumberCamps' || (ws === 'none' && combined.includes('лесопил'))) {
                lumberCamps++;
                if (isResourceHex) bonusLumber++;
            }
            if (ws === 'mines' || (ws === 'none' && combined.includes('шахт'))) {
                mines++;
                if (isResourceHex) bonusMines++;
            }
            if (ws === 'quarries' || (ws === 'none' && combined.includes('каменолом'))) {
                quarries++;
                if (isResourceHex) bonusQuarries++;
            }
        });

        const sizeBefore = s.size;
        s.size = Math.max(1, claimedCount);
        s.isolatedHexesCount = this._countIsolatedHexes(hexes);

        // Проверка пороговых вех размера (Milestone XP: 10, 25, 50, 100 гексов)
        [10, 25, 50, 100].forEach(ms => {
            if (s.size >= ms && !s.claimedMilestones.includes(ms)) {
                s.claimedMilestones.push(ms);
                const rewardXp = ms === 10 ? 40 : (ms === 25 ? 80 : 120);
                s.xp = (parseInt(s.xp, 10) || 0) + rewardXp;
                notices.push(`🏆 Веха развития (${ms} гексов): +${rewardXp} XP!`);
            }
        });

        s.workSites.farmlands = farmlands;
        s.workSites.lumberCamps = lumberCamps;
        s.workSites.mines = mines;
        s.workSites.quarries = quarries;
        s.siteBonusYield = { lumberCamps: bonusLumber, mines: bonusMines, quarries: bonusQuarries };

        this.recalculateModifiers();
        this._persist();
        this.renderUi();

        if (!silent || notices.length > 0) {
            alert(
                `🗺 Синхронизация с картой завершена:\n` +
                `• Размер: ${sizeBefore} → ${s.size} (${this.getNationTierInfo(s.size).name})\n` +
                `• Изолированных (вторичных) гексов: ${s.isolatedHexesCount}\n` +
                `• Добыча/ход: Лес ${lumberCamps + bonusLumber}, Руда ${mines + bonusMines}, Камень ${quarries + bonusQuarries}, Фермы -${farmlands} Потребл.` +
                (notices.length ? `\n\nСобытия:\n${notices.join('\n')}` : '')
            );
        }
    },

    exportCityToPng() {
        this.saveFromUi();

        const ug = this.state.urbanGrid;
        const cellPx = 96;
        const gridPx = cellPx * 6;
        const pad = 28;
        const headerH = 54;

        const canvas = document.createElement('canvas');
        canvas.width = gridPx + pad * 2;
        canvas.height = gridPx + pad * 2 + headerH;
        const ctx = canvas.getContext('2d');

        // 1. Фон карточки поселения
        ctx.fillStyle = '#0d1e13';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Шапка с названием, типом и уровнем города
        const typeLabels = { village: 'Деревня', town: 'Городок', city: 'Город', metropolis: 'Мегаполис' };
        const typeStr = typeLabels[ug.settlementType] || ug.settlementType;

        ctx.fillStyle = '#ffd875';
        ctx.font = 'bold 22px Tinos, Georgia, serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`🏰 ${ug.settlementName || 'Поселение'}`, pad, pad + 16);

        ctx.fillStyle = '#dfbc6f';
        ctx.font = 'bold 14px Montserrat, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`${typeStr} • Уровень ${ug.level} • Потребление: ${ug.consumption}`, canvas.width - pad, pad + 18);

        const boardX = pad;
        const boardY = pad + headerH;

        // 3. Поле сетки 6x6
        ctx.fillStyle = '#2a3322';
        ctx.fillRect(boardX, boardY, gridPx, gridPx);

        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 6; c++) {
                const x = boardX + c * cellPx;
                const y = boardY + r * cellPx;
                ctx.strokeStyle = 'rgba(212, 175, 55, 0.32)';
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, cellPx, cellPx);
            }
        }

        // Разделители 9 городских кварталов (2x2)
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2.5;
        [2, 4].forEach(idx => {
            ctx.beginPath();
            ctx.moveTo(boardX + idx * cellPx, boardY);
            ctx.lineTo(boardX + idx * cellPx, boardY + gridPx);
            ctx.moveTo(boardX, boardY + idx * cellPx);
            ctx.lineTo(boardX + gridPx, boardY + idx * cellPx);
            ctx.stroke();
        });

        // 4. Отрисовка всех размещённых построек с учётом поворота
        const loadImg = (src) => new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = src;
        });

        const tasks = (ug.buildings || []).map(async (bld) => {
            const meta = KingdomBuildings.getBuildingMeta(bld.id);
            const url = KingdomBuildings.getBuildingDataUrl(bld.id);
            if (!meta || !url) return;

            const img = await loadImg(url);
            if (!img) return;

            const rot = bld.rotation || 0;
            const isRotated = (rot % 180) !== 0;
            const spanCols = isRotated ? meta.rows : meta.cols;
            const spanRows = isRotated ? meta.cols : meta.rows;

            const centerX = boardX + (bld.c + spanCols / 2) * cellPx;
            const centerY = boardY + (bld.r + spanRows / 2) * cellPx;

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate((rot * Math.PI) / 180);
            ctx.drawImage(img, (-meta.cols * cellPx) / 2, (-meta.rows * cellPx) / 2, meta.cols * cellPx, meta.rows * cellPx);
            ctx.restore();
        });

        Promise.all(tasks).then(() => {
            // 5. Отрисовка 4 границ поселения (Вода, Мост, Стены)
            const drawBorderSide = (side, x1, y1, x2, y2) => {
                const val = ug.borders?.[side] || 'none';
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);

                if (val === 'water') {
                    ctx.strokeStyle = '#3498db';
                    ctx.lineWidth = 8;
                } else if (val === 'bridge') {
                    ctx.strokeStyle = '#e67e22';
                    ctx.lineWidth = 8;
                    ctx.setLineDash([12, 8]);
                } else if (val === 'wall_wood') {
                    ctx.strokeStyle = '#a0522d';
                    ctx.lineWidth = 8;
                } else if (val === 'wall_stone') {
                    ctx.strokeStyle = '#95a5a6';
                    ctx.lineWidth = 8;
                } else {
                    ctx.strokeStyle = '#d4af37';
                    ctx.lineWidth = 3;
                }
                ctx.stroke();
                ctx.restore();
            };

            drawBorderSide('top', boardX, boardY, boardX + gridPx, boardY);
            drawBorderSide('bottom', boardX, boardY + gridPx, boardX + gridPx, boardY + gridPx);
            drawBorderSide('left', boardX, boardY, boardX, boardY + gridPx);
            drawBorderSide('right', boardX + gridPx, boardY, boardX + gridPx, boardY + gridPx);

            // 6. Скачивание PNG-файла
            const link = document.createElement('a');
            const safeName = (ug.settlementName || 'city').replace(/[^a-zA-Zа-яА-Я0-9_-]/g, '_');
            link.download = `${safeName}_map.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    },


    openSkillCheckModal(skillId) {
        this.saveFromUi();
        KingdomModals.openSkillCheck(this, skillId);
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

    getUnrestPenalty() {
        const u = parseInt(this.state?.unrest, 10) || 0;
        if (u >= 15) return -4;
        if (u >= 10) return -3;
        if (u >= 5) return -2;
        if (u >= 1) return -1;
        return 0;
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

    openUpkeepModal() {
        this.saveFromUi();
        KingdomModals.openUpkeep(this);
    },


    applyUpkeepWithRoll(rolledRp) {
        const s = this.state;
        const changes = [];
        const bonus = s.siteBonusYield || {};

        const harvests = [
            { site: 'farmlands',   comm: 'food',   label: 'Еда',       extra: 0 },
            { site: 'lumberCamps', comm: 'lumber', label: 'Древесина', extra: bonus.lumberCamps || 0 },
            { site: 'mines',       comm: 'ore',    label: 'Руда',      extra: bonus.mines || 0 },
            { site: 'quarries',    comm: 'stone',  label: 'Камень',    extra: bonus.quarries || 0 }
        ];

        harvests.forEach(({ site, comm, label, extra }) => {
            const totalYield = (parseInt(s.workSites[site], 10) || 0) + extra;
            if (totalYield > 0) {
                const before = parseInt(s.commodities[comm].value, 10) || 0;
                const max = parseInt(s.commodities[comm].max, 10) || 4;
                const after = Math.min(max, before + totalYield);
                s.commodities[comm].value = after;
                const resNote = extra > 0 ? ` (в т.ч. +${extra} от залежей)` : '';
                changes.push(`<div>• <b>${label}:</b> ${before} → <b style="color:#2ecc71;">${after}</b> (+${after - before})${resNote}</div>`);
            }
        });

        const cons = parseInt(s.consumption, 10) || 0;
        if (cons > 0) {
            const foodBefore = parseInt(s.commodities.food.value, 10) || 0;
            if (foodBefore >= cons) {
                s.commodities.food.value = foodBefore - cons;
                changes.push(`<div>• <b>Потребление (-${cons} Еды):</b> ${foodBefore} → <b>${s.commodities.food.value}</b></div>`);
            } else {
                const deficit = cons - foodBefore;
                s.commodities.food.value = 0;
                s.unrest = (parseInt(s.unrest, 10) || 0) + deficit;
                changes.push(`<div style="color:#ff7675;">• <b>⚠ Нехватка провизии!</b> Беспорядки +${deficit}</div>`);
            }
        }

        const rpBefore = parseInt(s.rp, 10) || 0;
        s.rp = rpBefore + (parseInt(rolledRp, 10) || 0);
        changes.push(`<div>• <b>Очки ресурсов (RP):</b> ${rpBefore} → <b style="color:#ffd875;">${s.rp}</b></div>`);

        this.recalculateModifiers();
        this._persist();
        this.renderUi();
        this._showUpkeepResultModal(changes);
    },

    _showUpkeepResultModal(changesHtmlList) {
        ModalManager.open({
            id: 'kUpkeepResultOverlay',
            title: '⚜ Итоги фазы содержания',
            borderColor: '#dfbc6f',
            width: '480px',
            bodyHtml: `
            <div style="background:rgba(0,0,0,0.4); border:1px solid #543e0d; border-radius:6px; padding:14px 16px; font-size:16px; line-height:1.65; display:flex; flex-direction:column; gap:6px;">
                ${changesHtmlList.join('')}
            </div>
        `,
            footerButtons: [
                { label: '⚜ Готово', variant: 'ok', style: 'min-width:130px;' }
            ]
        });
    },

    openEndTurnModal() {
        this.saveFromUi();
        KingdomModals.openEndTurn(this, EventBus);
    },

    openLevelUpModal() {
        this.saveFromUi();
        KingdomModals.openLevelUp(this);
    },

    openTradeModal() {
        this.saveFromUi();
        KingdomModals.openTrade(this);
    },

    addEventCard() {
        const kingdomLvl = parseInt(this.state.level, 10) || 1;
        const modVal = parseInt(selectedEvent.dcMod, 10) || 0;

        this.state.events.push({
            id: 'ev_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            name: cleanTitle,
            title: cleanTitle,
            level: kingdomLvl,
            modifier: modVal,
            skill: selectedEvent.skill || 'statecraft',
            skillName: rusSkillName,
            dc: Number(baseCtrlDc + modVal) || 14,
            status: 'active',
            notes: `Навык разрешения: ${rusSkillName} (СЛ ${baseCtrlDc + modVal}).\n${selectedEvent.desc}`
        });
        this._persist();
        this.renderUi();
    },

    removeEventCard(eventId) {
        this.state.events = this.state.events.filter(ev => ev.id !== eventId);
        this._persist();
        this.renderUi();
    },

    openKingdomEventRollModal() {
        this.saveFromUi();
        KingdomModals.openEventRoll(this, MAP_CONFIG.kingdomRandomEventsTable || []);
    },


    addArmyCard() {
        this.saveFromUi();
        if (!Array.isArray(this.state.armies)) this.state.armies = [];
        this.state.armies.push({
            id: 'army_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            name: '',
            unitType: 'infantry', // infantry | cavalry | skirmisher | siege
            level: 1,
            hp: 4,
            maxHp: 4,
            ac: 16,
            attack: 7,
            consumption: 1,
            location: '',
            tactics: '',
            status: 'В строю'
        });
        this.recalculateModifiers();
        this._persist();
        this.renderUi();
    },

    removeArmyCard(armyId) {
        this.saveFromUi();
        this.state.armies = (this.state.armies || []).filter(a => a.id !== armyId);
        this.recalculateModifiers();
        this._persist();
        this.renderUi();
    },

    addFactionCard() {
        this.saveFromUi();
        if (!Array.isArray(this.state.diplomacy)) this.state.diplomacy = [];
        this.state.diplomacy.push({
            id: 'diplo_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            name: '',
            negotiationDc: 15,
            status: 'none',
            tradeAgreement: false,
            circumstanceMod: 0,
            notes: ''
        });
        this._persist();
        this.renderUi();
    },

    loadPresetFactions() {
        this.saveFromUi();
        if (!Array.isArray(this.state.diplomacy)) this.state.diplomacy = [];
        const presets = MAP_CONFIG.kingdomFactionsPreset || [];
        let added = 0;

        presets.forEach(p => {
            const exists = this.state.diplomacy.some(f => f.presetId === p.id || f.name === p.name);
            if (!exists) {
                this.state.diplomacy.push({
                    id: 'diplo_' + p.id + '_' + Math.floor(Math.random() * 1000),
                    presetId: p.id,
                    name: `${p.icon} ${p.name}`,
                    negotiationDc: p.negotiationDc,
                    status: 'none',
                    tradeAgreement: false,
                    circumstanceMod: 0,
                    notes: p.desc || ''
                });
                added++;
            }
        });

        if (added > 0) {
            this._persist();
            this.renderUi();
        }
    },

    removeFactionCard(factionId) {
        this.saveFromUi();
        this.state.diplomacy = (this.state.diplomacy || []).filter(f => f.id !== factionId);
        this._persist();
        this.renderUi();
    },


    openArmyAttackModal(armyId) {
        this.saveFromUi();
        KingdomModals.openArmyAttack(this, armyId);
    },

    _isAreaFree(targetR, targetC, spanRows, spanCols, ignoreUid = null) {
        if (targetR < 0 || targetC < 0 || targetR + spanRows > 6 || targetC + spanCols > 6) {
            return { ok: false, reason: 'Постройка выходит за границы городской сетки (6×6)!' };
        }

        const occupied = new Set();
        (this.state.urbanGrid?.buildings || []).forEach(b => {
            if (ignoreUid && b.uid === ignoreUid) return;
            const m = KingdomBuildings.getBuildingMeta(b.id);
            if (!m) return;
            const isRot = ((b.rotation || 0) % 180) !== 0;
            const bCols = isRot ? m.rows : m.cols;
            const bRows = isRot ? m.cols : m.rows;
            for (let r = b.r; r < b.r + bRows; r++) {
                for (let c = b.c; c < b.c + bCols; c++) {
                    occupied.add(`${r}_${c}`);
                }
            }
        });

        for (let r = targetR; r < targetR + spanRows; r++) {
            for (let c = targetC; c < targetC + spanCols; c++) {
                if (occupied.has(`${r}_${c}`)) {
                    return { ok: false, reason: 'Этот участок уже занят другой постройкой!' };
                }
            }
        }

        return { ok: true };
    },

    _checkWaterRequirement(buildingId) {
        const cost = typeof KingdomBuildings.getBuildingCost === 'function'
            ? KingdomBuildings.getBuildingCost(buildingId)
            : {};
        if (!cost.needWater) return true;

        const borders = this.state.urbanGrid?.borders || {};
        return Object.values(borders).some(val => val === 'water' || val === 'bridge');
    },

    placeBuilding(buildingId, targetR, targetC, existingUid = null) {
        const meta = KingdomBuildings.getBuildingMeta(buildingId);
        if (!meta) return;

        let rotation = 0;
        if (existingUid) {
            const old = this.state.urbanGrid.buildings.find(b => b.uid === existingUid);
            if (old) rotation = old.rotation || 0;
        }

        const isRotated = (rotation % 180) !== 0;
        const spanCols = isRotated ? meta.rows : meta.cols;
        const spanRows = isRotated ? meta.cols : meta.rows;

        // 1. Защита от наложения и выхода за края сетки
        const check = this._isAreaFree(targetR, targetC, spanRows, spanCols, existingUid);
        if (!check.ok) {
            alert(check.reason);
            this.renderUi();
            return;
        }

        // 2. Перемещение уже построенного здания внутри города — бесплатно
        if (existingUid) {
            const existing = this.state.urbanGrid.buildings.find(b => b.uid === existingUid);
            if (existing) {
                existing.r = targetR;
                existing.c = targetC;
            }
            this.syncSettlementStats();
            this._persist();
            this.renderUi();
            return;
        }

        // 3. Проверка наличия водной границы для портовых построек
        if (!this._checkWaterRequirement(buildingId)) {
            alert(`Для постройки «${meta.name}» хотя бы одна из границ поселения должна иметь тип «Вода» или «Мост»!`);
            return;
        }

        // 4. Открываем окно подтверждения строительства со стоимостью в RP и ресурсах
        this._openBuildConfirmModal(buildingId, meta, targetR, targetC);
    },


    _openBuildConfirmModal(buildingId, meta, targetR, targetC) {
        KingdomModals.openBuildConfirm(this, buildingId, meta, targetR, targetC, KingdomBuildings);
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

        const check = this._isAreaFree(bld.r, bld.c, spanRows, spanCols, uid);
        if (!check.ok) {
            alert(check.reason);
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
        if (this.mapDataRef) this.mapDataRef.kingdom = this.state;
        EventBus.emit('data:save');
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
                    if (typeof s.leaders[role] !== 'object' || s.leaders[role] === null) {
                        s.leaders[role] = { name: '', invested: false, actionsUsed: 0 };
                    }
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
            } else if (this.activeSubTab === 'armies') {
                document.querySelectorAll('.k-army-card').forEach(card => {
                    const army = (s.armies || []).find(item => item.id === card.dataset.armyId);
                    if (army) {
                        army.name = card.querySelector('.k-army-name').value;
                        army.unitType = card.querySelector('.k-army-type').value;
                        army.level = parseInt(card.querySelector('.k-army-level').value, 10) || 1;
                        army.ac = parseInt(card.querySelector('.k-army-ac').value, 10) || 16;
                        army.hp = parseInt(card.querySelector('.k-army-hp').value, 10) || 0;
                        army.maxHp = parseInt(card.querySelector('.k-army-maxhp').value, 10) || 4;
                        army.attack = parseInt(card.querySelector('.k-army-atk').value, 10) || 0;
                        army.consumption = parseInt(card.querySelector('.k-army-cons').value, 10) || 0;
                        army.location = card.querySelector('.k-army-loc').value;
                        army.status = card.querySelector('.k-army-status').value;
                        army.tactics = card.querySelector('.k-army-tactics').value;
                    }
                });
            } else if (this.activeSubTab === 'diplomacy') {
                document.querySelectorAll('.k-diplo-card').forEach(card => {
                    const f = (s.diplomacy || []).find(item => item.id === card.dataset.diploId);
                    if (f) {
                        f.name = card.querySelector('.k-diplo-name').value;
                        f.negotiationDc = parseInt(card.querySelector('.k-diplo-dc').value, 10) || 15;
                        f.status = card.querySelector('.k-diplo-status').value;
                        f.tradeAgreement = card.querySelector('.k-diplo-trade').checked;
                        f.circumstanceMod = parseInt(card.querySelector('.k-diplo-mod').value, 10) || 0;
                        f.notes = card.querySelector('.k-diplo-notes').value;
                    }
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

        const btnSyncMap = container.querySelector('#kBtnSyncHexMap');
        if (btnSyncMap) btnSyncMap.addEventListener('click', () => this.syncFromHexMap());

        const btnExportCity = container.querySelector('#kBtnExportCityPng');
        if (btnExportCity) btnExportCity.addEventListener('click', () => this.exportCityToPng());

        const btnRollWeather = container.querySelector('#kBtnRollWeather');
        if (btnRollWeather) btnRollWeather.addEventListener('click', () => this.rollSeasonalWeather(false));


        const btnAddEv = container.querySelector('#kBtnAddEvent');
        if (btnAddEv) btnAddEv.addEventListener('click', () => this.addEventCard());

        const btnRollEvent = container.querySelector('#kBtnRollKingdomEvent');
        if (btnRollEvent) {
            btnRollEvent.addEventListener('click', () => this.openKingdomEventRollModal());
        }

        const btnHintEvent = container.querySelector('#kBtnHintOpenEvent');
        if (btnHintEvent) {
            btnHintEvent.addEventListener('click', () => this.openKingdomEventRollModal());
        }


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

        // Трекер действий лидеров (фаза деятельности)
        container.querySelectorAll('.k-act-pip:not([disabled])').forEach(pip => {
            pip.addEventListener('click', () => {
                this.saveFromUi();
                this.toggleLeaderAction(pip.dataset.leaderRole, parseInt(pip.dataset.actIdx, 10));
            });
        });

        const btnResetAct = container.querySelector('#kBtnResetActions');
        if (btnResetAct) {
            btnResetAct.addEventListener('click', () => {
                this.saveFromUi();
                this.resetAllLeaderActions();
            });
        }

        // Калькулятор проверки навыка по клику на название навыка
        container.querySelectorAll('.k-skill-roll-trigger').forEach(cell => {
            cell.addEventListener('click', () => {
                this.openSkillCheckModal(cell.dataset.rollSkill);
            });
        });

        // Переключение, создание и удаление поселений на вкладке «Постройки и Город»
        const settleSelect = container.querySelector('#kSettlementSelector');
        if (settleSelect) {
            settleSelect.addEventListener('change', () => {
                this.switchSettlement(settleSelect.value);
            });
        }

        const btnAddSettle = container.querySelector('#kBtnAddSettlement');
        if (btnAddSettle) {
            btnAddSettle.addEventListener('click', () => this.addNewSettlement());
        }

        const btnDelSettle = container.querySelector('#kBtnDeleteSettlement');
        if (btnDelSettle) {
            btnDelSettle.addEventListener('click', () => this.deleteCurrentSettlement());
        }

        const btnAddArmy = container.querySelector('#kBtnAddArmy');
        if (btnAddArmy) btnAddArmy.addEventListener('click', () => this.addArmyCard());

        container.querySelectorAll('[data-del-army]').forEach(btn => {
            btn.addEventListener('click', () => this.removeArmyCard(btn.dataset.delArmy));
        });

        container.querySelectorAll('[data-roll-army]').forEach(btn => {
            btn.addEventListener('click', () => this.openArmyAttackModal(btn.dataset.rollArmy));
        });

        // Мгновенный пересчёт ОЗ, статуса (Бегство/Уничтожена) и потребления при изменении полей армии
        container.querySelectorAll('.k-army-card input, .k-army-card select').forEach(el => {
            el.addEventListener('change', () => {
                this.saveFromUi();
            });
        });

        // Кнопки быстрого урона/лечения (-1 ОЗ / +1 ОЗ) прямо на карточке армии
        container.querySelectorAll('[data-army-hp-delta]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.saveFromUi();
                const army = (this.state.armies || []).find(a => a.id === btn.dataset.armyId);
                if (!army) return;
                const delta = parseInt(btn.dataset.armyHpDelta, 10) || 0;
                const maxHp = Math.max(1, parseInt(army.maxHp, 10) || 4);
                army.hp = Math.max(0, Math.min(maxHp, (parseInt(army.hp, 10) || 0) + delta));

                if (army.hp === 0) army.status = 'Уничтожена';
                else if (army.hp <= Math.floor(maxHp / 2)) army.status = 'Бегство (Routed)';
                else if (army.status === 'Уничтожена' || army.status === 'Бегство (Routed)') army.status = 'В строю';

                this._persist();
                this.renderUi();
            });
        });

        // Привязка кнопок общей плашки календаря и погоды в шапке королевства
        if (window.WeatherManager && typeof window.WeatherManager.bindBarEvents === 'function') {
            window.WeatherManager.bindBarEvents(container);
        }

        const btnAddFaction = container.querySelector('#kBtnAddFaction');
        if (btnAddFaction) btnAddFaction.addEventListener('click', () => this.addFactionCard());

        const btnLoadPreset = container.querySelector('#kBtnLoadPresetFactions');
        if (btnLoadPreset) btnLoadPreset.addEventListener('click', () => this.loadPresetFactions());

        container.querySelectorAll('[data-del-diplo]').forEach(btn => {
            btn.addEventListener('click', () => this.removeFactionCard(btn.dataset.delDiplo));
        });

        container.querySelectorAll('[data-clear-diplo-hist]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.saveFromUi();
                const f = (this.state.diplomacy || []).find(item => item.id === btn.dataset.clearDiploHist);
                if (f) {
                    f.history = [];
                    this._persist();
                    this.renderUi();
                }
            });
        });

        container.querySelectorAll('[data-diplo-act]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.saveFromUi();
                KingdomModals.openDiplomacyAction(this, btn.dataset.diploId, btn.dataset.diploAct);
            });
        });

        container.querySelectorAll('.k-diplo-card input, .k-diplo-card select').forEach(el => {
            el.addEventListener('change', () => this.saveFromUi());
        });


    },

    // Таблица ступеней развития нации по Размеру королевства (Pathfinder 2e Kingmaker)
    getNationTierInfo(size) {
        const s = parseInt(size, 10) || 1;
        if (s >= 100) return { name: 'Доминион',    die: 12, dcMod: 4, storage: 20, maxItemBonus: 4 };
        if (s >= 50)  return { name: 'Страна',      die: 10, dcMod: 3, storage: 16, maxItemBonus: 3 };
        if (s >= 25)  return { name: 'Государство', die: 8,  dcMod: 2, storage: 12, maxItemBonus: 2 };
        if (s >= 10)  return { name: 'Провинция',   die: 6,  dcMod: 1, storage: 8,  maxItemBonus: 1 };
        return               { name: 'Территория',  die: 4,  dcMod: 0, storage: 4,  maxItemBonus: 1 };
    },

    /*
    getSizeModifier(size) {
        return this.getNationTierInfo(size).dcMod;
    },

     */

    getResourceDieSides() {
        return this.getNationTierInfo(this.state?.size).die;
    },

    recalculateModifiers() {
        // 1. Модификаторы 4 основных характеристик
        for (let key in this.state.stats) {
            const val = parseInt(this.state.stats[key].value, 10) || 10;
            this.state.stats[key].modifier = Math.floor((val - 10) / 2);
        }

        // 2. Ступень нации: Control DC Modifier и лимит складов Commodities
        const tier = this.getNationTierInfo(this.state.size);
        this.state.controlDcSize = tier.dcMod;

        if (this.state.commodities) {
            ['food', 'lumber', 'luxuries', 'ore', 'stone'].forEach(c => {
                if (this.state.commodities[c]) {
                    this.state.commodities[c].max = tier.storage;
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

        // 4. Синхронизация бонусов построек (с учётом потолка Item-бонуса) и Consumption (с учётом ферм)
        this.syncSettlementStats();
    },



    syncSettlementStats() {
        if (!this.state || typeof KingdomBuildings.calculateSettlementEffects !== 'function') return;

        this._ensureSettlementsList();
        const tier = this.getNationTierInfo(this.state.size);
        const baseByType = { village: 1, town: 2, city: 4, metropolis: 6 };

        let allSettlementsConsumption = 0;
        const globalMaxSkillBonuses = {};

        // Проходим по ВСЕМ поселениям королевства: считаем их потребление и собираем максимальные бонусы
        (this.state.settlements || []).forEach(settle => {
            const buildings = settle.buildings || [];
            const effects = KingdomBuildings.calculateSettlementEffects(buildings);

            settle.overcrowded = !!effects.isOvercrowded;
            const baseCons = baseByType[settle.settlementType] ?? 1;
            const crowdPenalty = settle.overcrowded ? 2 : 0;
            const settleCons = Math.max(0, baseCons + (effects.totalConsumption || 0) + crowdPenalty);

            settle.consumption = settleCons;
            allSettlementsConsumption += settleCons;

            const maxBonuses = effects.maxSkillBonuses || {};
            for (const [skId, val] of Object.entries(maxBonuses)) {
                if ((val || 0) > (globalMaxSkillBonuses[skId] || 0)) {
                    globalMaxSkillBonuses[skId] = val;
                }
            }
        });

        // 1. Синхронизация Item-бонусов в таблицу навыков с учётом потолка размера нации
        if (this.state.skills) {
            this.skillConfig.forEach(cfg => {
                if (!this.state.skills[cfg.id]) {
                    this.state.skills[cfg.id] = { prof: 0, status: 0, circ: 0, item: 0, other: 0 };
                }
                const rawItemBonus = globalMaxSkillBonuses[cfg.id] || 0;
                this.state.skills[cfg.id].item = Math.min(tier.maxItemBonus, rawItemBonus);
            });
        }

        // 2. Итоговое потребление королевства = (города + армии + зима) минус фермы
        const armiesConsumption = (this.state.armies || []).reduce(
            (sum, a) => sum + (parseInt(a.consumption, 10) || 0),
            0
        );

        const cal = window.WeatherManager?.getCalendarInfo?.();
        const winterPenalty = (cal && cal.season === 'winter') ? 1 : 0;
        this.state._winterConsumptionBonus = winterPenalty;

        const farmlandReduction = parseInt(this.state.workSites?.farmlands, 10) || 0;
        this.state.consumption = Math.max(0, allSettlementsConsumption + armiesConsumption + winterPenalty - farmlandReduction);

    },

    /**
     * Сбор активных региональных бонусов от захваченных Достопримечательностей и Убежищ
     */
    getRegionalFeatureBonuses() {
        const hexes = this.mapDataRef?.hexes || {};
        let hasLandmark = false;
        let hasRefuge = false;

        Object.values(hexes).forEach(h => {
            if (!this._isHexClaimed(h)) return;
            const combined = `${h.title || ''} ${h.text || h.description || ''}`;
            if (h.type === 'landmark' || /достопримечательност|landmark/i.test(combined)) {
                hasLandmark = true;
            }
            if (/убежищ|refuge/i.test(combined)) {
                hasRefuge = true;
            }
        });

        return {
            hasLandmark, // +2 обстоятельства к Культуре или Экономике в регионе
            hasRefuge    // +2 обстоятельства к Верности или Стабильности в зоне
        };
    },

    _createDefaultSettlement(name = "Новое поселение", id = null) {
        return {
            id: id || ('settle_' + Date.now() + '_' + Math.floor(Math.random() * 1000)),
            settlementName: name,
            settlementType: "village",
            level: 1,
            consumption: 1,
            overcrowded: false,
            infraStreetlamps: false,
            infraPavedStreets: false,
            infraSewer: false,
            garrisonedArmies: "",
            ongoingEvents: "",
            borders: { top: "none", bottom: "none", left: "none", right: "none" },
            buildings: []
        };
    },

    _ensureSettlementsList() {
        const s = this.state || this.mapDataRef?.kingdom;
        if (!s) return;

        // Миграция старого одиночного urbanGrid в массив settlements
        if (!Array.isArray(s.settlements) || s.settlements.length === 0) {
            const first = s.urbanGrid
                ? { ...JSON.parse(JSON.stringify(s.urbanGrid)), id: s.urbanGrid.id || 'settle_capital' }
                : this._createDefaultSettlement(s.capitalCity || "Столица", 'settle_capital');
            s.settlements = [first];
            s.activeSettlementId = first.id;
        }

        let active = s.settlements.find(item => item.id === s.activeSettlementId);
        if (!active) {
            active = s.settlements[0];
            s.activeSettlementId = active.id;
        }

        // Связываем s.urbanGrid напрямую с активным поселением, чтобы весь существующий код работал без изменений
        s.urbanGrid = active;
    },

    switchSettlement(settlementId) {
        this.saveFromUi();
        const s = this.state;
        const found = s.settlements?.find(item => item.id === settlementId);
        if (!found) return;

        s.activeSettlementId = found.id;
        s.urbanGrid = found;
        this.recalculateModifiers();
        this._persist();
        this.renderUi();
    },

    addNewSettlement() {
        this.saveFromUi();
        const s = this.state;
        this._ensureSettlementsList();

        const nextNum = s.settlements.length + 1;
        const name = prompt("Введите название нового поселения:", `Поселение #${nextNum}`);
        if (name === null) return;

        const cleanName = name.trim() || `Поселение #${nextNum}`;
        const created = this._createDefaultSettlement(cleanName);
        s.settlements.push(created);
        s.activeSettlementId = created.id;
        s.urbanGrid = created;

        this.recalculateModifiers();
        this._persist();
        this.renderUi();
    },

    deleteCurrentSettlement() {
        const s = this.state;
        this._ensureSettlementsList();
        if (s.settlements.length <= 1) {
            alert("Нельзя удалить единственное поселение королевства!");
            return;
        }

        const curName = s.urbanGrid?.settlementName || "Поселение";
        if (!confirm(`Удалить поселение «${curName}» вместе со всеми его постройками?`)) return;

        s.settlements = s.settlements.filter(item => item.id !== s.activeSettlementId);
        s.activeSettlementId = s.settlements[0].id;
        s.urbanGrid = s.settlements[0];

        this.recalculateModifiers();
        this._persist();
        this.renderUi();
    },

    openAnnexFreeholdModal(freeholdName = "Вольное владение", onSuccessCallback = null) {
        this.saveFromUi();
        this._ensureSettlementsList();
        KingdomModals.openAnnexFreehold(this, freeholdName, onSuccessCallback);
    },

    getCalendarInfo() {
        const calCfg = MAP_CONFIG.golarionCalendar;
        const c = this.state?.calendar || { day: 1, month: 2, year: 4710, precip: false, cold: false, hazardId: null, secondHazardNote: false };
        const months = calCfg?.months || [];
        const mObj = months[c.month] || { id: 2, name: 'Фараст', days: 31, season: 'spring', seasonLabel: '🌱 Весна', precipDc: 15, coldDc: null };
        const hazards = calCfg?.weatherHazardsTable || [];
        const hazard = c.hazardId ? (hazards.find(h => h.id === c.hazardId) || null) : null;

        return {
            day: c.day || 1,
            month: mObj.id,
            monthName: mObj.name,
            monthDays: mObj.days,
            year: c.year || 4710,
            season: mObj.season,
            seasonLabel: mObj.seasonLabel,
            precipDc: mObj.precipDc ?? 15,
            coldDc: mObj.coldDc ?? null,
            precip: !!c.precip,
            cold: !!c.cold,
            hazard,
            secondHazardNote: !!c.secondHazardNote
        }
    },

    rollSeasonalWeather(silent = false) {
        const info = this.getCalendarInfo();
        const pool = MAP_CONFIG.golarionCalendar?.weatherBySeason?.[info.season] || [];
        if (pool.length > 0) {
            const picked = pool[Math.floor(Math.random() * pool.length)];
            this.state.calendar.weatherId = picked.id;
        }
        this.recalculateModifiers();
        this._persist();
        this.renderUi();
        if (!silent && window.CampingManager) {
            window.CampingManager.recalculateCamp();
        }
    },

};

export default KingdomManager;
