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
        ruler: "Ruler (Правитель)",
        counselor: "Counselor (Канцлер)",
        general: "General (Генерал)",
        emissary: "Emissary (Эмиссар)",
        magister: "Magister (Магистр)",
        treasurer: "Treasurer (Казначей)",
        viceroy: "Viceroy (Наместник)",
        warden: "Warden (Маршал)"
    },

    skillConfig: [
        { id: 'agriculture', label: 'Agriculture', ability: 'stability' },
        { id: 'arts', label: 'Arts', ability: 'culture' },
        { id: 'boating', label: 'Boating', ability: 'economy' },
        { id: 'defense', label: 'Defense', ability: 'stability' },
        { id: 'engineering', label: 'Engineering', ability: 'stability' },
        { id: 'exploration', label: 'Exploration', ability: 'economy' },
        { id: 'folklore', label: 'Folklore', ability: 'culture' },
        { id: 'industry', label: 'Industry', ability: 'economy' },
        { id: 'intrigue', label: 'Intrigue', ability: 'loyalty' },
        { id: 'magic', label: 'Magic', ability: 'culture' },
        { id: 'politics', label: 'Politics', ability: 'loyalty' },
        { id: 'scholarship', label: 'Scholarship', ability: 'culture' },
        { id: 'statecraft', label: 'Statecraft', ability: 'loyalty' },
        { id: 'trade', label: 'Trade', ability: 'economy' },
        { id: 'warfare', label: 'Warfare', ability: 'loyalty' },
        { id: 'wilderness', label: 'Wilderness', ability: 'stability' }
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

    recalculateModifiers() {
        for (let key in this.state.stats) {
            const val = parseInt(this.state.stats[key].value, 10) || 10;
            this.state.stats[key].modifier = Math.floor((val - 10) / 2);
        }
        this.syncBuildingItemBonuses();
    },

    syncBuildingItemBonuses() {
        if (!this.state || !this.state.skills || typeof KingdomBuildings.calculateSettlementEffects !== 'function') return;
        const buildings = this.state.urbanGrid?.buildings || [];
        const effects = KingdomBuildings.calculateSettlementEffects(buildings);
        const maxBonuses = effects.maxSkillBonuses || {};

        this.skillConfig.forEach(cfg => {
            if (!this.state.skills[cfg.id]) {
                this.state.skills[cfg.id] = { prof: 0, status: 0, circ: 0, item: 0, other: 0 };
            }
            this.state.skills[cfg.id].item = maxBonuses[cfg.id] || 0;
        });
    },

    getSkillTotal(skillId) {
        const cfg = this.skillConfig.find(s => s.id === skillId);
        if (!cfg) return 0;
        const abilityMod = this.state.stats[cfg.ability]?.modifier || 0;
        const sk = this.state.skills[skillId] || { prof: 0, status: 0, circ: 0, item: 0, other: 0 };
        const profBonus = sk.prof > 0 ? (sk.prof + (parseInt(this.state.level, 10) || 1)) : 0;
        return abilityMod + profBonus + (sk.status || 0) + (sk.circ || 0) + (sk.item || 0) + (sk.other || 0);
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

        this.syncBuildingItemBonuses();

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

        this.syncBuildingItemBonuses();
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


    }
};

export default KingdomManager;
