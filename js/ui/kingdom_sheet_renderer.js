import KingdomBuildings from '../services/kingdom_buildings.js';

/**
 * МОДУЛЬ: РЕНДЕРИНГ ИНТЕРФЕЙСА КОРОЛЕВСТВА
 */
const KingdomSheetRenderer = {
    renderMainLayout(state, activeSubTab, helpers) {
        const tabButtons = `
            <div class="k-subtabs-bar" style="display:flex; gap:10px; align-items:center; margin-bottom:14px; border-bottom:2px solid #543e0d; padding-bottom:10px;">
                <button type="button" class="btn ${activeSubTab === 'sheet' ? 'ok' : ''}" data-k-tab="sheet">📜 Лист и Навыки</button>
                <button type="button" class="btn ${activeSubTab === 'events' ? 'ok' : ''}" data-k-tab="events">⚡ События</button>
                <button type="button" class="btn ${activeSubTab === 'urban' ? 'ok' : ''}" data-k-tab="urban">🏰 Постройки и Город</button>
                <button type="button" class="btn ok k-btn-save-small" style="margin-left:auto;">⚜ Сохранить</button>
            </div>
        `;

        let bodyHtml = '';
        if (activeSubTab === 'sheet') bodyHtml = this.renderSheetTab(state, helpers);
        else if (activeSubTab === 'events') bodyHtml = this.renderEventsTab(state);
        else if (activeSubTab === 'urban') bodyHtml = this.renderUrbanTab(state);

        return `<div class="kingdom-sheet-wrapper" style="color:#ebd291;">${tabButtons}${bodyHtml}</div>`;
    },

    renderSheetTab(s, { roleNames, skillConfig, getSkillTotal }) {
        const ctrlDc = (parseInt(s.controlDcBase, 10) || 14) + (parseInt(s.controlDcSize, 10) || 0);

        const statsHtml = ['culture', 'economy', 'loyalty', 'stability'].map(key => {
            const st = s.stats[key];
            const modStr = st.modifier >= 0 ? `+${st.modifier}` : st.modifier;
            return `
                <div class="k-box-card">
                    <div class="k-box-title">${key.toUpperCase()}</div>
                    <div style="display:flex; align-items:center; justify-content:space-between; gap:6px;">
                        <span id="k_mod_${key}" style="font-size:20px; font-weight:900; color:#ffd875;">${modStr}</span>
                        <input type="number" id="k_stat_val_${key}" class="k-inp" value="${st.value}" style="width:62px;">
                    </div>
                </div>
            `;
        }).join('');

        const ruinsHtml = ['corruption', 'crime', 'decay', 'strife'].map(key => {
            const r = s.ruins[key];
            return `
                <tr>
                    <td style="text-transform:uppercase; font-weight:bold;">${key}</td>
                    <td><input type="number" id="k_ruin_score_${key}" class="k-inp" value="${r.score}"></td>
                    <td><input type="number" id="k_ruin_pen_${key}" class="k-inp" value="${r.penalty}"></td>
                    <td><input type="number" id="k_ruin_thr_${key}" class="k-inp" value="${r.threshold}"></td>
                </tr>
            `;
        }).join('');

        const leadersHtml = Object.keys(roleNames).map(role => {
            const l = s.leaders[role] || { name: '', invested: false };
            return `
                <div style="display:flex; align-items:center; gap:6px; margin-bottom:6px;">
                    <label title="Invested (+1)" style="display:flex; align-items:center; gap:3px; font-size:12px;">
                        <input type="checkbox" id="k_leader_inv_${role}" ${l.invested ? 'checked' : ''}> INV
                    </label>
                    <span style="width:155px; font-size:13px; font-weight:bold; color:#dfbc6f;">${roleNames[role]}</span>
                    <input type="text" id="k_leader_name_${role}" class="k-inp" value="${l.name}" placeholder="Имя персонажа..." style="flex:1;">
                </div>
            `;
        }).join('');
        const skillsHtml = skillConfig.map(cfg => {
            const sk = s.skills[cfg.id];
            const total = getSkillTotal(cfg.id);
            const totalStr = total >= 0 ? `+${total}` : total;
            return `
                <tr>
                    <td style="font-weight:bold;">${cfg.label} <span style="font-size:11px; color:#95a5a6;">(${cfg.ability.slice(0,3).toUpperCase()})</span></td>
                    <td id="k_skill_total_${cfg.id}" style="font-weight:900; color:#ffd875; text-align:center;">${totalStr}</td>
                    <td>
                        <select id="k_skill_prof_${cfg.id}" class="k-inp">
                            <option value="0" ${sk.prof === 0 ? 'selected' : ''}>U (0)</option>
                            <option value="2" ${sk.prof === 2 ? 'selected' : ''}>T (+2)</option>
                            <option value="4" ${sk.prof === 4 ? 'selected' : ''}>E (+4)</option>
                            <option value="6" ${sk.prof === 6 ? 'selected' : ''}>M (+6)</option>
                            <option value="8" ${sk.prof === 8 ? 'selected' : ''}>L (+8)</option>
                        </select>
                    </td>
                    <td><input type="number" id="k_skill_status_${cfg.id}" class="k-inp" value="${sk.status}"></td>
                    <td><input type="number" id="k_skill_circ_${cfg.id}" class="k-inp" value="${sk.circ}"></td>
                    <td><input type="number" id="k_skill_item_${cfg.id}" class="k-inp" value="${sk.item}"></td>
                    <td><input type="number" id="k_skill_other_${cfg.id}" class="k-inp" value="${sk.other}"></td>
                </tr>
            `;
        }).join('');

        return `
            <div class="k-grid-2col" style="display:grid; grid-template-columns: 1.1fr 1fr; gap:16px;">
                <div>
                    <div class="k-panel">
                        <div style="display:grid; grid-template-columns: 2fr 1fr 1fr; gap:8px; margin-bottom:8px;">
                            <div><label class="k-lbl">Kingdom Name</label><input type="text" id="k_name" class="k-inp" value="${s.name}"></div>
                            <div><label class="k-lbl">Level</label><input type="number" id="k_level" class="k-inp" value="${s.level}"></div>
                            <div><label class="k-lbl">XP (1000 = Lvl)</label><input type="number" id="k_xp" class="k-inp" value="${s.xp}"></div>
                        </div>
                        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px; margin-bottom:10px;">
                            <div><label class="k-lbl">Charter</label><input type="text" id="k_charter" class="k-inp" value="${s.charter}"></div>
                            <div><label class="k-lbl">Heartland</label><input type="text" id="k_heartland" class="k-inp" value="${s.heartland}"></div>
                            <div><label class="k-lbl">Government</label><input type="text" id="k_government" class="k-inp" value="${s.government}"></div>
                            <div><label class="k-lbl">Capital City</label><input type="text" id="k_capital" class="k-inp" value="${s.capitalCity}"></div>
                        </div>
                        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px;">${statsHtml}</div>
                    </div>

                    <div class="k-panel" style="margin-top:12px;">
                        <div style="display:grid; grid-template-columns: repeat(6, 1fr); gap:6px; margin-bottom:10px;">
                            <div><label class="k-lbl">Size</label><input type="number" id="k_size" class="k-inp" value="${s.size}"></div>
                            <div><label class="k-lbl">RP</label><input type="number" id="k_rp" class="k-inp" value="${s.rp}"></div>
                            <div><label class="k-lbl">Unrest</label><input type="number" id="k_unrest" class="k-inp" value="${s.unrest}"></div>
                            <div><label class="k-lbl">Consumption</label><input type="number" id="k_consumption" class="k-inp" value="${s.consumption}"></div>
                            <div><label class="k-lbl">Fame</label><input type="number" id="k_fame" class="k-inp" value="${s.fame}"></div>
                            <div><label class="k-lbl">Control DC (${ctrlDc})</label><input type="number" id="k_ctrl_dc_base" class="k-inp" value="${s.controlDcBase}"></div>
                        </div>
                        <table class="k-table">
                            <thead><tr><th>Ruin Type</th><th>Score</th><th>Penalty</th><th>Threshold</th></tr></thead>
                            <tbody>${ruinsHtml}</tbody>
                        </table>
                    </div>

                    <div class="k-panel" style="margin-top:12px;">
                        <div class="k-sec-title">LEADERS</div>
                        ${leadersHtml}
                    </div>
                </div>

                <div>
                    <div class="k-panel">
                        <div class="k-sec-title">COMMODITIES & WORK SITES</div>
                        <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap:6px; margin-bottom:8px;">
                            ${['food', 'lumber', 'luxuries', 'ore', 'stone'].map(c => `
                                <div>
                                    <label class="k-lbl">${c.toUpperCase()} (Max ${s.commodities[c].max})</label>
                                    <input type="number" id="k_comm_${c}" class="k-inp" value="${s.commodities[c].value}">
                                </div>
                            `).join('')}
                        </div>
                        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:6px;">
                            <div><label class="k-lbl">Farmlands</label><input type="number" id="k_ws_farmlands" class="k-inp" value="${s.workSites.farmlands}"></div>
                            <div><label class="k-lbl">Lumber Camps</label><input type="number" id="k_ws_lumber" class="k-inp" value="${s.workSites.lumberCamps}"></div>
                            <div><label class="k-lbl">Mines</label><input type="number" id="k_ws_mines" class="k-inp" value="${s.workSites.mines}"></div>
                            <div><label class="k-lbl">Quarries</label><input type="number" id="k_ws_quarries" class="k-inp" value="${s.workSites.quarries}"></div>
                        </div>
                    </div>

                    <div class="k-panel" style="margin-top:12px;">
                        <div class="k-sec-title">KINGDOM SKILLS</div>
                        <table class="k-table">
                            <thead><tr><th>Skill</th><th>Total</th><th>Prof</th><th>Status</th><th>Circ</th><th>Item</th><th>Other</th></tr></thead>
                            <tbody>${skillsHtml}</tbody>
                        </table>
                    </div>

                    <div class="k-panel" style="margin-top:12px; display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div>
                            <div class="k-sec-title">FEATS</div>
                            <textarea id="k_feats_text" class="k-inp" rows="4" placeholder="Список черт королевства...">${s.featsText || ''}</textarea>
                        </div>
                        <div>
                            <div class="k-sec-title">ABILITIES</div>
                            <textarea id="k_abilities_text" class="k-inp" rows="4" placeholder="Особенности королевства...">${s.abilitiesText || ''}</textarea>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderEventsTab(s) {
        const eventsHtml = s.events.length === 0
            ? `<div style="grid-column: 1 / -1; text-align:center; padding:30px; color:#95a5a6; border:1px dashed #543e0d; border-radius:6px;">Активных событий королевства нет. Нажмите «+ Добавить событие».</div>`
            : s.events.map(ev => `
                <div class="k-panel k-event-card" data-ev-id="${ev.id}" style="position:relative;">
                    <button type="button" class="k-btn-del-ev" data-del-ev="${ev.id}" title="Удалить событие" style="position:absolute; top:8px; right:8px; background:#5c1e1e; border:1px solid #ff7675; color:#fff; border-radius:4px; cursor:pointer; width:24px; height:24px;">×</button>
                    <div style="display:grid; grid-template-columns: 3fr 1fr; gap:8px; margin-bottom:8px; padding-right:28px;">
                        <div><label class="k-lbl">Event Name</label><input type="text" class="k-inp k-ev-name" value="${ev.name}" placeholder="Название события..."></div>
                        <div><label class="k-lbl">Level</label><input type="number" class="k-inp k-ev-level" value="${ev.level}"></div>
                    </div>
                    <div style="display:grid; grid-template-columns: 2fr 1fr; gap:8px; margin-bottom:8px;">
                        <div><label class="k-lbl">Skill to Resolve</label><input type="text" class="k-inp k-ev-skill" value="${ev.skill}"></div>
                        <div><label class="k-lbl">Modifier</label><input type="number" class="k-inp k-ev-mod" value="${ev.modifier}"></div>
                    </div>
                    <div style="margin-bottom:8px;">
                        <label class="k-lbl">Notes</label>
                        <textarea class="k-inp k-ev-notes" rows="3" placeholder="Описание и последствия...">${ev.notes}</textarea>
                    </div>
                    <div>
                        <label class="k-lbl">Resolution Status</label>
                        <input type="text" class="k-inp k-ev-status" value="${ev.status}" placeholder="В процессе / Успех / Провал...">
                    </div>
                </div>
            `).join('');

        return `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <span style="font-size:15px; font-weight:bold; color:#ffd875;">ЖУРНАЛ СОБЫТИЙ КОРОЛЕВСТВА (Стр. 7)</span>
                <button type="button" class="btn ok" id="kBtnAddEvent">+ Добавить событие</button>
            </div>
            <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:14px;">
                ${eventsHtml}
            </div>
        `;
    },



    renderUrbanTab(s) {
        const ug = s.urbanGrid;

        let collapsedState = {};
        try {
            collapsedState = JSON.parse(localStorage.getItem('pf_km_catalog_collapsed') || '{}');
        } catch (e) {}

        const savedWidth = parseInt(localStorage.getItem('pf_km_catalog_width'), 10);
        const initialWidth = (savedWidth && savedWidth >= 240 && savedWidth <= 750) ? savedWidth : 380;

        const groups = [
            { key: 'lot_1', title: '1 клетка (1×1)', items: KingdomBuildings.catalog.filter(b => b.cols * b.rows === 1) },
            { key: 'lot_2', title: '2 клетки (2×1)', items: KingdomBuildings.catalog.filter(b => b.cols * b.rows === 2) },
            { key: 'lot_4', title: '4 клетки (2×2)', items: KingdomBuildings.catalog.filter(b => b.cols * b.rows === 4) }
        ];

        const catalogHtml = groups.map(group => {
            const isCollapsed = !!collapsedState[group.key];

            const itemsHtml = group.items.map(b => {
                const thumb = KingdomBuildings.getBuildingDataUrl(b.id);
                const infoText = KingdomBuildings.getBuildingInfoText(b.id);
                return `
                    <div class="k-bld-palette-item" draggable="true" data-bld-id="${b.id}" title="${b.name} — ${infoText}">
                        <img src="${thumb}" class="k-bld-thumb" alt="${b.name}">
                        <div class="k-bld-info">
                            <div class="k-bld-name">${b.name}</div>
                            <div class="k-bld-meta">Размер: ${b.cols}×${b.rows} • Ур. ${b.level}</div>
                            <div class="k-bld-bonus-tag">${infoText}</div>
                        </div>
                    </div>
                `;
            }).join('');


            return `
                <div class="k-catalog-group ${isCollapsed ? 'collapsed' : ''}" data-group-key="${group.key}">
                    <button type="button" class="k-catalog-group-header">
                        <span class="k-group-arrow">${isCollapsed ? '▸' : '▾'}</span>
                        <span class="k-group-title">${group.title}</span>
                        <span class="k-group-count">${group.items.length}</span>
                    </button>
                    <div class="k-catalog-group-body">
                        ${itemsHtml}
                    </div>
                </div>
            `;
        }).join('');

        let cellsHtml = '';
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 6; c++) {
                const blockDividerR = (r === 1 || r === 3) ? 'border-bottom: 2px solid #d4af37;' : '';
                const blockDividerC = (c === 1 || c === 3) ? 'border-right: 2px solid #d4af37;' : '';
                cellsHtml += `<div class="k-urban-cell" data-r="${r}" data-c="${c}" style="width:84px; height:84px; border:1px dashed rgba(212,175,55,0.35); ${blockDividerR} ${blockDividerC} box-sizing:border-box;"></div>`;
            }
        }

        const placedHtml = ug.buildings.map(bld => {
            const meta = KingdomBuildings.getBuildingMeta(bld.id);
            if (!meta) return '';
            const thumb = KingdomBuildings.getBuildingDataUrl(bld.id);
            const rot = bld.rotation || 0;
            const isRotated = (rot % 180) !== 0;
            const spanCols = isRotated ? meta.rows : meta.cols;
            const spanRows = isRotated ? meta.cols : meta.rows;

            return `
                <div class="k-placed-bld" draggable="true" data-placed-uid="${bld.uid}" data-bld-id="${bld.id}"
                     style="position:absolute; left:${bld.c * 84}px; top:${bld.r * 84}px; width:${spanCols * 84}px; height:${spanRows * 84}px; z-index:10; cursor:grab; box-sizing:border-box; border:1px solid #ffd875;">
                    <img src="${thumb}" style="width:${meta.cols * 84}px; height:${meta.rows * 84}px; position:absolute; left:50%; top:50%; transform:translate(-50%, -50%) rotate(${rot}deg); pointer-events:none;">
                    <button type="button" data-rot-uid="${bld.uid}" title="Повернуть на 90°" style="position:absolute; bottom:2px; left:2px; width:22px; height:22px; background:rgba(0,0,0,0.85); border:1px solid #ffd875; color:#ffd875; border-radius:4px; cursor:pointer; font-size:12px; z-index:15;">↻</button>
                    <button type="button" data-del-uid="${bld.uid}" title="Снести постройку" style="position:absolute; top:2px; right:2px; width:20px; height:20px; background:rgba(92,30,30,0.9); border:1px solid #ff7675; color:#fff; border-radius:4px; cursor:pointer; font-size:12px; z-index:15;">×</button>
                </div>
            `;
        }).join('');

        const borderSelect = (side, label) => `
            <div style="display:flex; align-items:center; gap:6px;">
                <span style="font-size:12px; color:#dfbc6f;">${label}:</span>
                <select id="k_ug_border_${side}" class="k-inp" style="width:130px;">
                    <option value="none" ${ug.borders[side] === 'none' ? 'selected' : ''}>Нет</option>
                    <option value="water" ${ug.borders[side] === 'water' ? 'selected' : ''}>🌊 Water</option>
                    <option value="bridge" ${ug.borders[side] === 'bridge' ? 'selected' : ''}>🌉 Bridge</option>
                    <option value="wall_wood" ${ug.borders[side] === 'wall_wood' ? 'selected' : ''}>🪵 Wall (wood)</option>
                    <option value="wall_stone" ${ug.borders[side] === 'wall_stone' ? 'selected' : ''}>🧱 Wall (stone)</option>
                </select>
            </div>
        `;

        const borderColor = (val) => {
            if (val === 'water') return '4px solid #3498db';
            if (val === 'bridge') return '4px dashed #e67e22';
            if (val === 'wall_wood') return '4px solid #a0522d';
            if (val === 'wall_stone') return '4px solid #95a5a6';
            return '2px solid #d4af37';
        };

        // Подсчёт бонусов и занятых клеток поселения
        const effects = KingdomBuildings.calculateSettlementEffects(ug.buildings);
        const skillBadgesHtml = Object.keys(effects.maxSkillBonuses).length === 0
            ? `<span style="color:#95a5a6; font-size:12px;">Нет активных бонусов к навыкам</span>`
            : Object.entries(effects.maxSkillBonuses)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([skill, val]) => `<span class="k-eff-badge good">+${val} ${skill.charAt(0).toUpperCase() + skill.slice(1)}</span>`)
                .join('');

        const ruinBadgesHtml = Object.entries(effects.totalRuins)
            .filter(([, val]) => val > 0)
            .map(([ruin, val]) => `<span class="k-eff-badge bad">+${val} ${ruin.toUpperCase()}</span>`)
            .join('');

        const consSign = effects.totalConsumption > 0 ? `+${effects.totalConsumption}` : `${effects.totalConsumption}`;
        const consClass = effects.totalConsumption > 0 ? 'bad' : (effects.totalConsumption < 0 ? 'good' : '');

        const summaryHtml = `
            <div class="k-urban-summary-box">
                <div class="k-urban-summary-top">
                    <span>🏘 Построек: <b>${effects.buildingCount}</b> (Участков: <b>${effects.usedLots} / 36</b>)</span>
                    <span>🍖 Потребление от зданий: <span class="k-eff-badge ${consClass}">${consSign} Consumption</span></span>
                    ${ruinBadgesHtml ? `<span>⚠ Упадок от построек: ${ruinBadgesHtml}</span>` : ''}
                </div>
                <div class="k-urban-summary-skills">
                    <span style="color:#dfbc6f; font-size:12px; font-weight:bold; margin-right:6px;">Макс. Item-бонусы:</span>
                    ${skillBadgesHtml}
                </div>
            </div>
        `;

        return `
            <div style="display:flex; align-items:stretch; gap:0; width:100%;">
            
                <div class="k-panel k-catalog-panel" id="kCatalogPanel" style="width:${initialWidth}px; max-height:760px;">
                    <div class="k-sec-title" style="font-size:15px;">ПОСТРОЙКИ (Перетащите на карту)</div>
                    <div class="k-catalog-search-wrap">
                        <input type="text" id="kCatalogSearchInput" class="k-inp k-catalog-search-inp" placeholder="🔍 Поиск постройки (англ / рус)..." autocomplete="off">
                        <button type="button" id="kCatalogSearchClear" class="k-catalog-search-clear" title="Очистить поиск" style="display:none;">×</button>
                    </div>
                    <div class="k-catalog-scroll">${catalogHtml}</div>
                </div>
                
                <div class="k-catalog-resizer" id="kCatalogResizer" title="Потяните мышью, чтобы изменить ширину списка"></div>

                <div class="k-panel" style="flex:1; min-width:540px;">
                    <div style="display:grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap:8px; margin-bottom:10px;">
                        <div><label class="k-lbl">Settlement</label><input type="text" id="k_ug_name" class="k-inp" value="${ug.settlementName}"></div>
                        <div>
                            <label class="k-lbl">Type</label>
                            <select id="k_ug_type" class="k-inp">
                                <option value="village" ${ug.settlementType === 'village' ? 'selected' : ''}>Village</option>
                                <option value="town" ${ug.settlementType === 'town' ? 'selected' : ''}>Town</option>
                                <option value="city" ${ug.settlementType === 'city' ? 'selected' : ''}>City</option>
                                <option value="metropolis" ${ug.settlementType === 'metropolis' ? 'selected' : ''}>Metropolis</option>
                            </select>
                        </div>
                        <div><label class="k-lbl">Level</label><input type="number" id="k_ug_level" class="k-inp" value="${ug.level}"></div>
                        <div><label class="k-lbl">Consumption</label><input type="number" id="k_ug_cons" class="k-inp" value="${ug.consumption}"></div>
                    </div>

                    <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:12px; font-size:12px;">
                        <label><input type="checkbox" id="k_ug_overcrowded" ${ug.overcrowded ? 'checked' : ''}> Overcrowded</label>
                        <label><input type="checkbox" id="k_ug_lamps" ${ug.infraStreetlamps ? 'checked' : ''}> Magical Streetlamps</label>
                        <label><input type="checkbox" id="k_ug_paved" ${ug.infraPavedStreets ? 'checked' : ''}> Paved Streets</label>
                        <label><input type="checkbox" id="k_ug_sewer" ${ug.infraSewer ? 'checked' : ''}> Sewer System</label>
                    </div>

                    <div style="display:flex; flex-direction:column; align-items:center; gap:8px; margin:10px 0;">
                        ${borderSelect('top', 'Север')}
                        <div style="display:flex; align-items:center; gap:10px;">
                            ${borderSelect('left', 'Запад')}
                            <div id="kUrbanBoard" style="position:relative; width:504px; height:504px; display:grid; grid-template-columns:repeat(6, 84px); grid-template-rows:repeat(6, 84px); background:#2a3322; border-top:${borderColor(ug.borders.top)}; border-bottom:${borderColor(ug.borders.bottom)}; border-left:${borderColor(ug.borders.left)}; border-right:${borderColor(ug.borders.right)}; box-shadow:0 8px 25px rgba(0,0,0,0.8);">
                                ${cellsHtml}
                                ${placedHtml}
                            </div>
                            ${borderSelect('right', 'Восток')}
                        </div>
                        ${borderSelect('bottom', 'Юг')}
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:10px;">
                        <div><label class="k-lbl">Garrisoned Armies</label><input type="text" id="k_ug_armies" class="k-inp" value="${ug.garrisonedArmies}"></div>
                        <div><label class="k-lbl">Ongoing Events</label><input type="text" id="k_ug_events" class="k-inp" value="${ug.ongoingEvents}"></div>
                    </div>
                </div>
            </div>
        `;
    }



};

export default KingdomSheetRenderer;
