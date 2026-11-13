import KingdomBuildings from '../services/kingdom_buildings.js';

/**
 * МОДУЛЬ: РЕНДЕРИНГ ИНТЕРФЕЙСА КОРОЛЕВСТВА
 */
const KingdomSheetRenderer = {
    _injectIcons(str) {
        if (!str) return '';
        const pairs = [
            [/\b(RP|ОР)\b/g, '🪙 $1'],
            [/(Древесин[аыуе]|Дерев[ао]|Lumber)/gi, '🪵 $1'],
            [/(Кам(?:ен[ьяюе]?|н[ьяюе])|Stone)/gi, '🧱 $1'],
            [/(Руд[аыуе]|Ore)/gi, '⛏️ $1'],
            [/(Роскош[ьи]|Люкс[ау]?|Luxuries)/gi, '💎 $1'],
            [/(Ед[аыуе]|Провизи[ияю]|Food)/gi, '🌾 $1'],
            [/(Военное дело|Warfare)/gi, '⚔️ $1'],
            [/(Дикие земли|Wilderness)/gi, '🌲 $1'],
            [/(Земледелие|Agriculture)/gi, '🌾 $1'],
            [/(Инженерное дело|Инженерия|Engineering)/gi, '⚙️ $1'],
            [/(Интрига|Intrigue)/gi, '🗡️ $1'],
            [/(Искусства|Arts)/gi, '🎭 $1'],
            [/(Исследование|Exploration)/gi, '🧭 $1'],
            [/(Лодочный транспорт|Мореходство|Boating)/gi, '⛵ $1'],
            [/(Магия|Magic)/gi, '🔮 $1'],
            [/(Оборона|Defense)/gi, '🛡️ $1'],
            [/(Образование|Учёность|Scholarship)/gi, '📚 $1'],
            [/(Политика|Politics)/gi, '⚖️ $1'],
            [/(Производство|Промышленность|Industry)/gi, '🏭 $1'],
            [/(Торговля|Trade)/gi, '💰 $1'],
            [/(Традиции|Folklore)/gi, '📜 $1'],
            [/(Управление|Statecraft)/gi, '👑 $1'],
            [/(Коррупция|Corruption)/gi, '🐍 $1'],
            [/(Преступность|Crime)/gi, '🗡️ $1'],
            [/(Разруха|Упадок|Decay)/gi, '🏚️ $1'],
            [/(Раздор|Распри|Strife)/gi, '🔥 $1'],
            [/(Потребл\.?|Consumption)/gi, '🍖 $1']
        ];
        let res = String(str);
        pairs.forEach(([rx, rep]) => { res = res.replace(rx, rep); });
        return res;
    },


    renderMainLayout(state, activeSubTab, helpers) {
        const canLevelUp = (parseInt(state.xp, 10) || 0) >= 1000;
        const levelUpBtn = canLevelUp
            ? `<button type="button" class="btn ok" id="kBtnLevelUp" style="border-color:#ffd875; box-shadow:0 0 12px rgba(255,216,117,0.6);">👑 Повысить уровень!</button>`
            : '';

        const armiesCount = Array.isArray(state.armies) ? state.armies.length : 0;

        const tabButtons = `
            <div class="k-subtabs-bar" style="display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin-bottom:14px; border-bottom:2px solid #543e0d; padding-bottom:10px;">
                <button type="button" class="btn ${activeSubTab === 'sheet' ? 'ok' : ''}" data-k-tab="sheet">📜 Лист и Навыки</button>
                <button type="button" class="btn ${activeSubTab === 'events' ? 'ok' : ''}" data-k-tab="events">⚡ События</button>
                <button type="button" class="btn ${activeSubTab === 'urban' ? 'ok' : ''}" data-k-tab="urban">🏰 Постройки и Город</button>
                <button type="button" class="btn ${activeSubTab === 'armies' ? 'ok' : ''}" data-k-tab="armies">⚔ Армии (${armiesCount})</button>
                <div style="margin-left:auto; display:flex; gap:8px; align-items:center;">
                    ${levelUpBtn}
                    <button type="button" class="btn cc" id="kBtnTradeComm" title="Купить или продать ресурсы за RP">⚖ Обмен</button>
                    <button type="button" class="btn cc" id="kBtnUpkeepTurn" title="Сбор ресурсов (Upkeep)">🎲 Сбор ресурсов</button>
                    <button type="button" class="btn cc" id="kBtnEndTurn" title="Перевести остаток RP в опыт XP (макс. 120)">⏳ Конец хода</button>
                    <button type="button" class="btn ok k-btn-save-small">⚜ Сохранить</button>
                </div>
            </div>
        `;


        const calendarBarHtml = window.WeatherManager
            ? window.WeatherManager.renderCompactBarHtml()
            : '';


        let bodyHtml = '';
        if (activeSubTab === 'sheet') bodyHtml = this.renderSheetTab(state, helpers);
        else if (activeSubTab === 'events') bodyHtml = this.renderEventsTab(state);
        else if (activeSubTab === 'urban') bodyHtml = this.renderUrbanTab(state);
        else if (activeSubTab === 'armies') bodyHtml = this.renderArmiesTab(state);

        return `
            <div class="kingdom-sheet-wrapper" style="padding:14px 20px; color:#ebd291; font-family:'Tinos', serif;">
                ${tabButtons}
                ${calendarBarHtml}
                ${bodyHtml}
            </div>
        `;
    },


    renderSheetTab(s, { roleNames, skillConfig, getSkillTotal }) {
        const ctrlDc = (parseInt(s.controlDcBase, 10) || 14) + (parseInt(s.controlDcSize, 10) || 0);

        const statNamesRu = {
            culture: '🎭 КУЛЬТУРА',
            economy: '💰 ЭКОНОМИКА',
            loyalty: '🤝 ЛОЯЛЬНОСТЬ',
            stability: '🏛️ СТАБИЛЬНОСТЬ'
        };

        const statsHtml = ['culture', 'economy', 'loyalty', 'stability'].map(key => {
            const st = s.stats[key];
            const modStr = st.modifier >= 0 ? `+${st.modifier}` : st.modifier;
            return `
                <div class="k-box-card">
                    <div class="k-box-title">${statNamesRu[key]}</div>
                    <div style="display:flex; align-items:center; justify-content:space-between; gap:6px;">
                        <span id="k_mod_${key}" style="font-size:20px; font-weight:900; color:#ffd875;">${modStr}</span>
                        <input type="number" id="k_stat_val_${key}" class="k-inp" value="${st.value}" style="width:62px;">
                    </div>
                </div>
            `;
        }).join('');


        const ruinNamesRu = {
            corruption: '🐍 Коррупция',
            crime: '🗡️ Преступность',
            decay: '🏚️ Упадок',
            strife: '🔥 Распри'
        };

        const ruinsHtml = ['corruption', 'crime', 'decay', 'strife'].map(key => {
            const r = s.ruins[key];
            const penStyle = r.penalty > 0 ? 'background:#2b1111; border-color:#e74c3c; color:#ff7675; font-weight:bold;' : 'opacity:0.75;';
            return `
                <tr>
                    <td style="font-weight:bold;">${ruinNamesRu[key]}</td>
                    <td><input type="number" id="k_ruin_score_${key}" class="k-inp" value="${r.score}"></td>
                    <td><input type="number" id="k_ruin_pen_${key}" class="k-inp" value="${r.penalty}" readonly title="Авторасчёт: Очки / Порог" style="${penStyle}"></td>
                    <td><input type="number" id="k_ruin_thr_${key}" class="k-inp" value="${r.threshold}" readonly title="Авторасчёт: 10 + модификатор характеристики" style="opacity:0.75;"></td>
                </tr>
            `;
        }).join('');


        const roleIcons = {
            ruler:     '👑',
            counselor: '📜',
            general:   '⚔️',
            emissary:  '🕊️',
            magister:  '🔮',
            treasurer: '💰',
            viceroy:   '🏛️',
            warden:    '🛡️'
        };

        const leadersHtml = Object.keys(roleNames).map(role => {
            const l = s.leaders[role] || { name: '', invested: false, actionsUsed: 0 };
            const used = parseInt(l.actionsUsed, 10) || 0;
            const hasName = (l.name || '').trim().length > 0;
            const maxActions = hasName ? 3 : 2;

            let pipsHtml = '';
            for (let i = 1; i <= 3; i++) {
                const isDisabled = i > maxActions;
                const isSpent = i <= used;
                const title = isDisabled
                    ? 'Недоступно (должность вакантна — максимум 2 действия)'
                    : (isSpent ? `Действие ${i} использовано (нажмите, чтобы вернуть)` : `Отметить действие ${i}`);

                pipsHtml += `
                    <button type="button"
                            class="k-act-pip ${isSpent ? 'spent' : ''} ${isDisabled ? 'disabled' : ''}"
                            data-leader-role="${role}"
                            data-act-idx="${i}"
                            ${isDisabled ? 'disabled' : ''}
                            title="${title}">◆</button>
                `;
            }

            return `
                <div style="display:flex; align-items:center; gap:6px; margin-bottom:6px;">
                    <label title="Вложенная роль (+1 к связанным навыкам)" style="display:flex; align-items:center; gap:3px; font-size:12px; cursor:pointer;">
                        <input type="checkbox" id="k_leader_inv_${role}" ${l.invested ? 'checked' : ''}> ВКЛ
                    </label>
                    <span style="width:130px; font-size:13px; font-weight:bold; color:#dfbc6f;">${roleIcons[role] || '⚜️'} ${roleNames[role]}</span>
                    <span style="width:115px; font-size:13px; font-weight:bold; color:#dfbc6f;">${roleNames[role]}</span>
                    <input type="text" id="k_leader_name_${role}" class="k-inp" value="${l.name}" placeholder="Имя..." style="flex:1; min-width:90px;">
                    <div class="k-leader-pips" style="display:flex; gap:3px; flex-shrink:0;" title="Действия лидера в фазу деятельности (${used}/${maxActions})">
                        ${pipsHtml}
                    </div>
                </div>
            `;
        }).join('');

        const abilityShortRu = {
            culture: 'КУЛЬТУРА',
            economy: 'ЭКОНОМИКА',
            loyalty: 'ЛОЯЛЬНОСТЬ',
            stability: 'СТАБИЛЬНОСТЬ'
        };

        const skillIcons = {
            warfare: '⚔️',
            wilderness: '🌲',
            agriculture: '🌾',
            engineering: '⚙️',
            intrigue: '🗡️',
            arts: '🎭',
            exploration: '🧭',
            boating: '⛵',
            magic: '🔮',
            defense: '🛡️',
            scholarship: '📚',
            politics: '⚖️',
            industry: '🏭',
            trade: '💰',
            folklore: '📜',
            statecraft: '👑'
        };

        const skillsHtml = skillConfig.map(cfg => {
            const sk = s.skills[cfg.id];
            const total = getSkillTotal(cfg.id);
            const totalStr = total >= 0 ? `+${total}` : total;
            const itemVal = parseInt(sk.item, 10) || 0;
            const itemStyle = itemVal > 0
                ? 'background:#0d2415; border-color:#2ecc71; color:#2ecc71; font-weight:bold; cursor:help;'
                : 'opacity:0.65; cursor:help;';

            return `
                <tr>
                    <td class="k-skill-roll-trigger" data-roll-skill="${cfg.id}" title="Нажмите, чтобы проверить навык «${cfg.label}»" style="font-weight:bold; cursor:pointer; color:#ebd291;">
                        ${skillIcons[cfg.id] || '🎲'} ${cfg.label} <span style="font-size:11px; color:#95a5a6;">(${abilityShortRu[cfg.ability] || cfg.ability.slice(0,3).toUpperCase()})</span>
                    </td>
                    <td id="k_skill_total_${cfg.id}" style="font-weight:900; color:#ffd875; text-align:center;">${totalStr}</td>
                    <td>
                        <select id="k_skill_prof_${cfg.id}" class="k-inp">
                            <option value="0" ${sk.prof === 0 ? 'selected' : ''}>Н (0)</option>
                            <option value="2" ${sk.prof === 2 ? 'selected' : ''}>О (+2)</option>
                            <option value="4" ${sk.prof === 4 ? 'selected' : ''}>Э (+4)</option>
                            <option value="6" ${sk.prof === 6 ? 'selected' : ''}>М (+6)</option>
                            <option value="8" ${sk.prof === 8 ? 'selected' : ''}>Л (+8)</option>
                        </select>
                    </td>
                    <td><input type="number" id="k_skill_status_${cfg.id}" class="k-inp" value="${sk.status}"></td>
                    <td><input type="number" id="k_skill_circ_${cfg.id}" class="k-inp" value="${sk.circ}"></td>
                    <td><input type="number" id="k_skill_item_${cfg.id}" class="k-inp" value="${itemVal}" readonly title="Автоматический бонус предмета от построек в поселении" style="${itemStyle}"></td>
                    <td><input type="number" id="k_skill_other_${cfg.id}" class="k-inp" value="${sk.other}"></td>
                </tr>
            `;
        }).join('');

        const sizeVal = parseInt(s.size, 10) || 1;
        const nationInfo = sizeVal >= 100 ? { name: 'Доминион', die: 'd12', cap: 4 }
            : sizeVal >= 50  ? { name: 'Страна', die: 'd10', cap: 3 }
                : sizeVal >= 25  ? { name: 'Государство', die: 'd8', cap: 2 }
                    : sizeVal >= 10  ? { name: 'Провинция', die: 'd6', cap: 1 }
                        :                  { name: 'Территория', die: 'd4', cap: 1 };

        const diceCount = (parseInt(s.level, 10) || 1) + 4;
        const isolatedCount = parseInt(s.isolatedHexesCount, 10) || 0;
        const isolatedBadge = isolatedCount > 0
            ? `<span style="color:#ff7675; font-weight:bold;">⚠ Вторичных гексов: ${isolatedCount} (штраф к управлению)</span>`
            : `<span style="color:#2ecc71;">✔ Вся территория связана</span>`;

        const farmlandCount = parseInt(s.workSites?.farmlands, 10) || 0;
        const bonusYield = s.siteBonusYield || {};
        const totalBonusSites = (bonusYield.lumberCamps || 0) + (bonusYield.mines || 0) + (bonusYield.quarries || 0);

        return `
            <div class="k-grid-2col" style="display:grid; grid-template-columns: 1.1fr 1fr; gap:16px;">
                <div>
                    <div class="k-panel">
                        <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(212,175,55,0.12); border:1px solid #8a6421; border-radius:4px; padding:5px 10px; margin-bottom:8px; font-size:12px;">
                            <span>👑 Этап: <b style="color:#ffd875;">${nationInfo.name}</b> • Кость ОР: <b style="color:#2ecc71;">${diceCount}${nationInfo.die}</b> • Потолок предм.: <b style="color:#ffd875;">+${nationInfo.cap}</b></span>
                            ${isolatedBadge}
                        </div>
                        
                        <div style="display:grid; grid-template-columns: 2fr 1fr 1fr; gap:8px; margin-bottom:8px;">
                            <div><label class="k-lbl">🏰 Название королевства</label><input type="text" id="k_name" class="k-inp" value="${s.name}"></div>
                            <div><label class="k-lbl">⭐ Уровень</label><input type="number" id="k_level" class="k-inp" value="${s.level}"></div>
                            <div><label class="k-lbl">✨ Опыт XP (1000 = Ур.)</label><input type="number" id="k_xp" class="k-inp" value="${s.xp}"></div>
                        </div>
                        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px; margin-bottom:10px;">
                            <div><label class="k-lbl">📜 Хартия</label><input type="text" id="k_charter" class="k-inp" value="${s.charter}"></div>
                            <div><label class="k-lbl">🧭 Центр королевства</label><input type="text" id="k_heartland" class="k-inp" value="${s.heartland}"></div>
                            <div><label class="k-lbl">⚖️ Форма правления</label><input type="text" id="k_government" class="k-inp" value="${s.government}"></div>
                            <div><label class="k-lbl">👑 Столица</label><input type="text" id="k_capital" class="k-inp" value="${s.capitalCity}"></div>
                        </div>
                        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px;">${statsHtml}</div>
                    </div>
                    

                    <div class="k-panel" style="margin-top:12px;">
                        <div style="display:grid; grid-template-columns: repeat(6, 1fr); gap:6px; margin-bottom:10px;">
                            <div><label class="k-lbl">🗺️ Размер</label><input type="number" id="k_size" class="k-inp" value="${s.size}"></div>
                            <div><label class="k-lbl">🪙 Очки (RP)</label><input type="number" id="k_rp" class="k-inp" value="${s.rp}"></div>
                            <div><label class="k-lbl">💢 Беспорядки</label><input type="number" id="k_unrest" class="k-inp" value="${s.unrest}"></div>
                            <div><label class="k-lbl">🍖 Потребл. ${farmlandCount > 0 ? `(-${farmlandCount}🌾)` : ''}</label><input type="number" id="k_consumption" class="k-inp" value="${s.consumption}" readonly title="База поселения + здания + перенаселение − фермы (${farmlandCount})" style="background:#0d2415; border-color:#8a6421; color:#ffd875; font-weight:bold; cursor:help;"></div>
                            <div><label class="k-lbl">🏆 Слава</label><input type="number" id="k_fame" class="k-inp" value="${s.fame}"></div>
                            <div><label class="k-lbl">🎯 СЛ Контроля (${ctrlDc})</label><input type="number" id="k_ctrl_dc_base" class="k-inp" value="${s.controlDcBase}"></div>
                        </div>
                        <table class="k-table">
                            <thead><tr><th>💀 Раздор</th><th>📊 Очки</th><th>⚠️ Штраф</th><th>🚧 Порог</th></tr></thead>
                            <tbody>${ruinsHtml}</tbody>
                        </table>
                    </div>

                    <div class="k-panel" style="margin-top:12px;">
                        <div class="k-sec-title" style="display:flex; justify-content:space-between; align-items:center;">
                            <span>👥 ПРАВИТЕЛИ И СОВЕТНИКИ</span>
                            <button type="button" class="btn cc" id="kBtnResetActions" style="padding:2px 8px; font-size:11px;" title="Сбросить использованные действия всех лидеров">🔄 Сбросить действия</button>
                        </div>
                        ${leadersHtml}
                    </div>
                </div>

                <div>
                    <div class="k-panel">
                        <div class="k-sec-title" style="display:flex; justify-content:space-between; align-items:center;">
                            <span>📦 РЕСУРСЫ И УЧАСТКИ ${totalBonusSites > 0 ? `<span style="color:#2ecc71; font-size:11px;">(+${totalBonusSites} от залежей 💎)</span>` : ''}</span>
                            <button type="button" class="btn cc" id="kBtnSyncHexMap" style="padding:2px 8px; font-size:11px;" title="Подсчитать захваченные гексы и добывающие участки с основной карты">🗺 С карты гексов</button>
                        </div>
                        <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap:6px; margin-bottom:8px;">
                            ${[
                                { id: 'food', label: '🌾 ЕДА' },
                                { id: 'lumber', label: '🪵 ДРЕВЕСИНА' },
                                { id: 'luxuries', label: '💎 РОСКОШЬ' },
                                { id: 'ore', label: '⛏️ РУДА' },
                                { id: 'stone', label: '🧱 КАМЕНЬ' }
                            ].map(c => `
                                <div>
                                    <label class="k-lbl">${c.label} (max ${s.commodities[c.id].max})</label>
                                    <input type="number" id="k_comm_${c.id}" class="k-inp" value="${s.commodities[c.id].value}">
                                </div>
                            `).join('')}
                        </div>
                        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:6px;">
                            <div><label class="k-lbl">🌾 Угодья (-1 Потр.)</label><input type="number" id="k_ws_farmlands" class="k-inp" value="${s.workSites.farmlands}"></div>
                            <div><label class="k-lbl">🪓 Лесорубы ${bonusYield.lumberCamps ? `(+${bonusYield.lumberCamps}💎)` : ''}</label><input type="number" id="k_ws_lumber" class="k-inp" value="${s.workSites.lumberCamps}"></div>
                            <div><label class="k-lbl">⛏️ Шахты ${bonusYield.mines ? `(+${bonusYield.mines}💎)` : ''}</label><input type="number" id="k_ws_mines" class="k-inp" value="${s.workSites.mines}"></div>
                            <div><label class="k-lbl">🪨 Каменоломни ${bonusYield.quarries ? `(+${bonusYield.quarries}💎)` : ''}</label><input type="number" id="k_ws_quarries" class="k-inp" value="${s.workSites.quarries}"></div>
                        </div>
                    </div>

                    <div class="k-panel" style="margin-top:12px;">
                        <div class="k-sec-title">🎲 НАВЫКИ КОРОЛЕВСТВА (Потолок бонуса предмета: +${nationInfo.cap})</div>
                        <table class="k-table">
                            <thead><tr><th>📋 Навык</th><th>∑ Итог</th><th>🎖️ Ранг</th><th>✨ Статус</th><th>🧭 Обст.</th><th>🏛️ Предм.</th><th>➕ Проч.</th></tr></thead>
                            <tbody>${skillsHtml}</tbody>
                        </table>
                    </div>

                    <div class="k-panel" style="margin-top:12px; display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div>
                            <div class="k-sec-title">🌟 ЧЕРТЫ</div>
                            <textarea id="k_feats_text" class="k-inp" rows="4" placeholder="Список черт королевства...">${s.featsText || ''}</textarea>
                        </div>
                        <div>
                            <div class="k-sec-title">⚡ СПОСОБНОСТИ</div>
                            <textarea id="k_abilities_text" class="k-inp" rows="4" placeholder="Особенности королевства...">${s.abilitiesText || ''}</textarea>
                        </div>
                    </div>
                </div>
            </div>
        `;

    },

    renderEventsTab(s) {
        const skillLabelsRu = {
            agriculture: '🌾 Сельское хозяйство',
            arts:        '🎭 Искусства',
            boating:     '⛵ Мореходство',
            defense:     '🛡️ Оборона',
            engineering: '⚙️ Инженерия',
            exploration: '🧭 Исследование',
            folklore:    '📜 Традиции',
            industry:    '🏭 Промышленность',
            intrigue:    '🗡️ Интрига',
            magic:       '🔮 Магия',
            politics:    '⚖️ Политика',
            scholarship: '📚 Учёность',
            statecraft:  '👑 Управление',
            trade:       '💰 Торговля',
            warfare:     '⚔️ Военное дело',
            wilderness:  '🌲 Дикая природа'
        };

        const eventsHtml = s.events.length === 0
            ? `<div style="grid-column: 1 / -1; text-align:center; padding:30px; color:#95a5a6; border:1px dashed #543e0d; border-radius:6px;">📭 Активных событий королевства нет. Нажмите «🎲 Событие хода» или «+ Добавить событие».</div>`
            : s.events.map(ev => {
                const evLevel = ev.level !== undefined && ev.level !== '' ? ev.level : (parseInt(s.level, 10) || 1);
                const evMod = ev.modifier !== undefined && ev.modifier !== '' ? ev.modifier : 0;

                const curStatus = String(ev.status || 'active').toLowerCase();
                const isResolved = curStatus === 'resolved' || curStatus === 'разрешено';
                const isFailed = curStatus === 'failed' || curStatus === 'провалено';
                const isActive = !isResolved && !isFailed;

                const borderCol = isResolved ? '#2ecc71' : (isFailed ? '#e74c3c' : '#543e0d');

                return `
                    <div class="k-panel k-event-card" data-ev-id="${ev.id}" style="position:relative; border-color:${borderCol};">
                        <button type="button" class="k-btn-del-ev" data-del-ev="${ev.id}" title="Удалить событие" style="position:absolute; top:8px; right:8px; background:#5c1e1e; border:1px solid #ff7675; color:#fff; border-radius:4px; cursor:pointer; width:24px; height:24px;">×</button>
                        <div style="display:grid; grid-template-columns: 3fr 1fr; gap:8px; margin-bottom:8px; padding-right:28px;">
                            <div><label class="k-lbl">📌 Название события</label><input type="text" class="k-inp k-ev-name" value="${ev.name || ev.title || ''}" placeholder="Название события..."></div>
                            <div><label class="k-lbl">⭐ Уровень</label><input type="number" class="k-inp k-ev-level" value="${evLevel}"></div>
                        </div>
                        <div style="display:grid; grid-template-columns: 2fr 1fr; gap:8px; margin-bottom:8px;">
                            <div>
                                <label class="k-lbl">🎲 Навык разрешения</label>
                                <select class="k-inp k-ev-skill">
                                    ${Object.entries(skillLabelsRu).map(([key, label]) =>
                    `<option value="${key}" ${(ev.skill || 'statecraft') === key ? 'selected' : ''}>${label}</option>`
                ).join('')}
                                </select>
                            </div>
                            <div><label class="k-lbl">⚖️ Модификатор</label><input type="number" class="k-inp k-ev-mod" value="${evMod}"></div>
                        </div>
                        <div style="margin-bottom:8px;">
                            <label class="k-lbl">📝 Заметки</label>
                            <textarea class="k-inp k-ev-notes" rows="3" placeholder="Описание и последствия...">${ev.notes || ''}</textarea>
                        </div>
                        <div>
                            <label class="k-lbl">🚦 Статус разрешения</label>
                            <select class="k-inp k-ev-status">
                                <option value="active" ${isActive ? 'selected' : ''}>⏳ Активно</option>
                                <option value="resolved" ${isResolved ? 'selected' : ''}>✅ Разрешено</option>
                                <option value="failed" ${isFailed ? 'selected' : ''}>❌ Провалено</option>
                            </select>
                        </div>
                    </div>
                `;
            }).join('');

        return `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <span style="font-size:15px; font-weight:bold; color:#ffd875;">⚡ ЖУРНАЛ СОБЫТИЙ КОРОЛЕВСТВА</span>
                <div style="display:flex; gap:8px; align-items:center;">
                    <button type="button" class="btn cc" id="kBtnRollKingdomEvent" title="Проверить фазу Событий конца хода (СЛ 16 / СЛ 11 + таблица d100)">🎲 Событие хода</button>
                    <button type="button" class="btn ok" id="kBtnAddEvent">+ Добавить событие</button>
                </div>
            </div>
            <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:14px;">
                ${eventsHtml}
            </div>
        `;
    },

    renderArmiesTab(s) {
        const armies = Array.isArray(s.armies) ? s.armies : [];
        const totalArmiesCons = armies.reduce((sum, a) => sum + (parseInt(a.consumption, 10) || 0), 0);

        const unitTypes = {
            infantry:   '🛡️ Пехота',
            cavalry:    '🐎 Кавалерия',
            skirmisher: '🏹 Застрельщики / Разведка',
            siege:      '💣 Осадные орудия'
        };

        const cardsHtml = armies.length === 0
            ? `<div style="grid-column: 1 / -1; text-align:center; padding:35px; color:#95a5a6; border:1px dashed #543e0d; border-radius:6px;">
                   🏕️ У королевства пока нет сформированных армий. Нажмите «+ Нанять армию», чтобы создать отряд.
               </div>`
            : armies.map(a => {
                const hp = parseInt(a.hp, 10) || 0;
                const maxHp = Math.max(1, parseInt(a.maxHp, 10) || 4);
                const isRouted = hp <= Math.floor(maxHp / 2);
                const borderCol = hp <= 0 ? '#e74c3c' : (isRouted ? '#f39c12' : '#543e0d');

                return `
                    <div class="k-panel k-army-card" data-army-id="${a.id}" style="position:relative; border-color:${borderCol};">
                        <button type="button" data-del-army="${a.id}" title="Расформировать армию" style="position:absolute; top:8px; right:8px; background:#5c1e1e; border:1px solid #ff7675; color:#fff; border-radius:4px; cursor:pointer; width:24px; height:24px;">×</button>

                        <div style="display:grid; grid-template-columns: 2fr 1.3fr; gap:8px; margin-bottom:8px; padding-right:28px;">
                            <div>
                                <label class="k-lbl">🚩 Название армии / отряда</label>
                                <input type="text" class="k-inp k-army-name" value="${a.name || ''}" placeholder="Например: Стража Столицы...">
                            </div>
                            <div>
                                <label class="k-lbl">⚔️ Род войск</label>
                                <select class="k-inp k-army-type">
                                    ${Object.entries(unitTypes).map(([val, lbl]) =>
                    `<option value="${val}" ${a.unitType === val ? 'selected' : ''}>${lbl}</option>`
                ).join('')}
                                </select>
                            </div>
                        </div>

                        <div style="display:grid; grid-template-columns: repeat(6, 1fr); gap:6px; margin-bottom:8px;">
                            <div><label class="k-lbl">⭐ Уровень</label><input type="number" class="k-inp k-army-level" value="${a.level || 1}"></div>
                            <div><label class="k-lbl">🛡️ КБ (AC)</label><input type="number" class="k-inp k-army-ac" value="${a.ac || 16}"></div>
                            <div>
                                <label class="k-lbl">❤️ ОЗ (HP)</label>
                                <div style="display:flex; align-items:center; gap:2px;">
                                    <button type="button" data-army-id="${a.id}" data-army-hp-delta="-1" title="Нанести 1 урон ОЗ" style="background:#5c1e1e; border:1px solid #ff7675; color:#fff; border-radius:3px; cursor:pointer; padding:2px 5px; font-weight:bold;">−</button>
                                    <input type="number" class="k-inp k-army-hp" value="${hp}" style="color:${isRouted ? '#ff7675' : '#2ecc71'}; font-weight:bold; text-align:center; padding:4px 2px;">
                                    <button type="button" data-army-id="${a.id}" data-army-hp-delta="1" title="Восстановить 1 ОЗ" style="background:#1e3c27; border:1px solid #2ecc71; color:#2ecc71; border-radius:3px; cursor:pointer; padding:2px 5px; font-weight:bold;">+</button>
                                </div>
                            </div>
                            <div><label class="k-lbl">💚 Макс ОЗ</label><input type="number" class="k-inp k-army-maxhp" value="${maxHp}"></div>
                            <div><label class="k-lbl">🗡️ Атака (+)</label><input type="number" class="k-inp k-army-atk" value="${a.attack || 7}"></div>
                            <div><label class="k-lbl">🍖 Потребл.</label><input type="number" class="k-inp k-army-cons" value="${a.consumption ?? 1}"></div>
                        </div>

                        <div style="display:grid; grid-template-columns: 1.2fr 1fr; gap:8px; margin-bottom:8px;">
                            <div>
                                <label class="k-lbl">📍 Дислокация / Гарнизон</label>
                                <input type="text" class="k-inp k-army-loc" value="${a.location || ''}" placeholder="Город или гекс [r;c]...">
                            </div>
                            <div>
                                <label class="k-lbl">📊 Состояние</label>
                                <input type="text" class="k-inp k-army-status" value="${a.status || 'В строю'}">
                            </div>
                        </div>

                        <div style="display:flex; gap:8px; align-items:flex-end;">
                            <div style="flex:1;">
                                <label class="k-lbl">📜 Тактики и особенности</label>
                                <input type="text" class="k-inp k-army-tactics" value="${a.tactics || ''}" placeholder="Стена щитов, Натиск, Засада...">
                            </div>
                            <button type="button" class="btn ok" data-roll-army="${a.id}" style="padding:5px 12px; font-size:12px; white-space:nowrap;">
                                🎲 Атака (+${a.attack || 0})
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

        return `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; background:rgba(0,0,0,0.3); padding:8px 12px; border:1px solid #543e0d; border-radius:6px;">
                <div>
                    <span style="font-size:15px; font-weight:bold; color:#ffd875;">⚔️ ВООРУЖЁННЫЕ СИЛЫ КОРОЛЕВСТВА</span>
                    <span style="margin-left:14px; font-size:13px; color:#ebd291;">
                        🪖 Отрядов: <b>${armies.length}</b> • Суммарное содержание армий: <b style="color:#ff7675;">+${totalArmiesCons} 🍖 Потребл.</b>
                    </span>
                </div>
                <button type="button" class="btn ok" id="kBtnAddArmy">+ Нанять армию</button>
            </div>
            <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:14px;">
                ${cardsHtml}
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



            const getBuildingIcon = (b) => {
                const key = `${b.id || ''} ${b.name || ''}`.toLowerCase();
                if (/castle|palace|замок|дворец/.test(key)) return '🏰';
                if (/keep|citadel|fort|watchtower|garrison|barracks|цитадел|крепост|башн|гарнизон|казарм/.test(key)) return '🛡️';
                if (/cathedral|temple|shrine|abbey|monastery|храм|собор|святилищ|аббатств|монастыр/.test(key)) return '⛪';
                if (/academy|university|library|school|bardic|академ|университ|библиотек|школ|коллег/.test(key)) return '📚';
                if (/alchemy|magic|arcane|wizard|occult|алхим|маги|волшеб|оккульт/.test(key)) return '🔮';
                if (/market|trade|bank|mint|guildhall|рынок|торгов|банк|монетн|гильд/.test(key)) return '💰';
                if (/tavern|inn|theater|arena|stadium|festival|park|таверн|постоял|театр|арен|парк|фестивал/.test(key)) return '🍺';
                if (/hospital|herbalist|infirmary|госпитал|лечебн|травник/.test(key)) return '⚕️';
                if (/pier|waterfront|shipyard|bridge|пристан|порт|верф|мост/.test(key)) return '⚓';
                if (/smithy|forge|foundry|workshop|mill|sawmill|brewery|granary|stable|stockyard|кузн|мастерск|мельниц|лесопил|пивовар|амбар|конюшн|скотн/.test(key)) return '⚒️';
                if (/town_hall|courthouse|embassy|jail|prison|ратуш|суд|посольств|тюрьм/.test(key)) return '⚖️';
                if (/house|mansion|tenement|orphanage|дом|особняк|жиль|барак|приют/.test(key)) return '🏠';
                return '🏛️';
            };

            const itemsHtml = group.items.map(b => {
                const thumb = KingdomBuildings.getBuildingDataUrl(b.id);
                const infoText = typeof KingdomBuildings.getBuildingInfoText === 'function'
                    ? KingdomBuildings.getBuildingInfoText(b.id)
                    : '';


                const rawInfoHtml = typeof KingdomBuildings.getBuildingInfoHtml === 'function'
                    ? KingdomBuildings.getBuildingInfoHtml(b.id)
                    : infoText;
                const rawCostText = typeof KingdomBuildings.getBuildingCostText === 'function'
                    ? KingdomBuildings.getBuildingCostText(b.id)
                    : '';
                const infoHtml = this._injectIcons(rawInfoHtml);
                const costText = this._injectIcons(rawCostText);
                const bIcon = getBuildingIcon(b);

                return `
                    <div class="k-bld-palette-item" draggable="true" data-bld-id="${b.id}" title="${bIcon} ${b.name}${infoText ? ' — ' + infoText : ''}">
                        <img src="${thumb}" class="k-bld-thumb" alt="${b.name}">
                        <div class="k-bld-info">
                            <div class="k-bld-name">${bIcon} ${b.name}</div>
                            <div class="k-bld-meta">📐 ${b.cols}×${b.rows} • ⭐ Ур. ${b.level}${costText ? ` • <span style="color:#ffd875;">${costText}</span>` : ''}</div>
                            ${infoHtml ? `<div class="k-bld-bonus-tag">${infoHtml}</div>` : ''}
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

        // Расчёт эффектов поселения
        const effects = typeof KingdomBuildings.calculateSettlementEffects === 'function'
            ? KingdomBuildings.calculateSettlementEffects(ug.buildings)
            : { usedLots: 0, totalConsumption: 0, maxSkillBonuses: {}, totalRuins: {}, buildingCount: ug.buildings.length };


        const skillNamesRu = {
            warfare: 'Военное дело',
            wilderness: 'Дикие земли',
            agriculture: 'Земледелие',
            engineering: 'Инженерное дело',
            intrigue: 'Интрига',
            arts: 'Искусства',
            exploration: 'Исследование',
            boating: 'Лодочный транспорт',
            magic: 'Магия',
            defense: 'Оборона',
            scholarship: 'Образование',
            politics: 'Политика',
            industry: 'Производство',
            trade: 'Торговля',
            folklore: 'Традиции',
            statecraft: 'Управление'
        };

        const ruinNamesRu = {
            corruption: 'Коррупция',
            crime: 'Преступность',
            decay: 'Разруха',
            strife: 'Раздор'
        };

        const skillBadgesHtml = Object.keys(effects.maxSkillBonuses).length === 0
            ? `<span style="color:#95a5a6; font-size:12px;">Нет активных бонусов к навыкам</span>`
            : Object.entries(effects.maxSkillBonuses)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([skill, val]) => `<span class="k-eff-badge good">+${val} ${this._injectIcons(skillNamesRu[skill] || skill)}</span>`)
                .join('');

        const ruinBadgesHtml = Object.entries(effects.totalRuins)
            .filter(([, val]) => val > 0)
            .map(([ruin, val]) => `<span class="k-eff-badge bad">+${val} ${this._injectIcons(ruinNamesRu[ruin] || ruin.toUpperCase())}</span>`)
            .join('');

        const consSign = effects.totalConsumption > 0 ? `+${effects.totalConsumption}` : `${effects.totalConsumption}`;
        const consClass = effects.totalConsumption > 0 ? 'bad' : (effects.totalConsumption < 0 ? 'good' : '');


        const housingStatusHtml = effects.activeBlocks === 0
            ? `<span>🏠 Жильё: <b>0 / 0</b> блоков</span>`
            : (effects.isOvercrowded
                ? `<span>🏠 Жильё: <span class="k-eff-badge bad">${effects.residentialCount} / ${effects.activeBlocks} блоков (Перенаселение +2 Потребл.)</span></span>`
                : `<span>🏠 Жильё: <span class="k-eff-badge good">${effects.residentialCount} / ${effects.activeBlocks} блоков (Норма)</span></span>`);

        const summaryHtml = `
            <div class="k-urban-summary-box">
                <div class="k-urban-summary-top">
                    <span>🏘 Построек: <b>${effects.buildingCount}</b> (Участков: <b>${effects.usedLots} / 36</b>)</span>
                    ${housingStatusHtml}
                    <span>🍖 Потребление от зданий: <span class="k-eff-badge ${consClass}">${consSign} Потребл.</span></span>
                    ${ruinBadgesHtml ? `<span>⚠ Упадок от построек: ${ruinBadgesHtml}</span>` : ''}
                </div>
                <div class="k-urban-summary-skills">
                    <span style="color:#dfbc6f; font-size:12px; font-weight:bold; margin-right:6px;">Макс. бонусы предметов:</span>
                    ${skillBadgesHtml}
                </div>
            </div>
        `;


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
                <span style="font-size:12px; color:#dfbc6f;">🧭 ${label}:</span>
                <select id="k_ug_border_${side}" class="k-inp" style="width:165px;">
                    <option value="none" ${ug.borders[side] === 'none' ? 'selected' : ''}>➖ Нет</option>
                    <option value="water" ${ug.borders[side] === 'water' ? 'selected' : ''}>🌊 Вода</option>
                    <option value="bridge" ${ug.borders[side] === 'bridge' ? 'selected' : ''}>🌉 Мост</option>
                    <option value="wall_wood" ${ug.borders[side] === 'wall_wood' ? 'selected' : ''}>🪵 Деревянная стена</option>
                    <option value="wall_stone" ${ug.borders[side] === 'wall_stone' ? 'selected' : ''}>🧱 Каменная стена</option>
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

        const settlementsList = Array.isArray(s.settlements) && s.settlements.length > 0
            ? s.settlements
            : [ug];

        const typeShortRu = {
            village: 'Деревня',
            town: 'Посёлок',
            city: 'Город',
            metropolis: 'Мегаполис'
        };

        const totalCitiesConsumption = settlementsList.reduce(
            (sum, item) => sum + (parseInt(item.consumption, 10) || 0),
            0
        );

        const settlementSwitcherHtml = `
            <div style="display:flex; align-items:center; gap:8px; background:rgba(12, 18, 14, 0.92); border:1px solid #8a6421; border-radius:6px; padding:5px 10px; margin-bottom:8px;">
                <span style="font-size:12px; font-weight:bold; color:#ffd875; white-space:nowrap;">🏰 Поселение (${settlementsList.length}):</span>
                <select id="kSettlementSelector" class="k-inp" style="max-width:340px; font-weight:bold; color:#ffd875; border-color:#dfbc6f; padding:3px 6px; font-size:12px;">
                    ${settlementsList.map(item => {
            const isSelected = item.id === (s.activeSettlementId || ug.id);
            const label = `${item.settlementName || 'Без названия'} (${typeShortRu[item.settlementType] || item.settlementType}, Ур. ${item.level || 1}, Потр. ${item.consumption || 0})`;
            return `<option value="${item.id}" ${isSelected ? 'selected' : ''}>${label}</option>`;
        }).join('')}
                </select>
                <span style="font-size:12px; color:#ebd291; background:#060b07; border:1px solid #543e0d; padding:3px 8px; border-radius:4px; white-space:nowrap;">
                    Σ Потребл. всех городов: <b style="color:#ffd875;">${totalCitiesConsumption}</b>
                </span>
                <button type="button" class="btn ok" id="kBtnAddSettlement" style="padding:3px 10px; font-size:12px; white-space:nowrap;">+ Город</button>
                ${settlementsList.length > 1 ? `<button type="button" class="btn del" id="kBtnDeleteSettlement" style="padding:3px 8px; font-size:12px;">🗑</button>` : ''}
            </div>
        `;



        return `
            <div style="display:flex; align-items:stretch; gap:0; width:100%;">
                <div class="k-panel k-catalog-panel" id="kCatalogPanel" style="width:${initialWidth}px; max-height:760px;">
                    <div class="k-sec-title" style="font-size:15px;">🏗️ ПОСТРОЙКИ (Перетащите на карту)</div>
                    <div class="k-catalog-search-wrap">
                        <input type="text" id="kCatalogSearchInput" class="k-inp k-catalog-search-inp" placeholder="🔍 Поиск постройки (англ / рус)..." autocomplete="off">
                        <button type="button" id="kCatalogSearchClear" class="k-catalog-search-clear" title="Очистить поиск" style="display:none;">×</button>
                    </div>
                    <div class="k-catalog-scroll">${catalogHtml}</div>
                </div>

                <div class="k-catalog-resizer" id="kCatalogResizer" title="Потяните мышью, чтобы изменить ширину списка"></div>

                <div class="k-panel" style="flex:1; min-width:540px;">
                    ${settlementSwitcherHtml}
                    <div style="display:grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap:8px; margin-bottom:10px;">
                        <div><label class="k-lbl">🏛️ Название поселения</label><input type="text" id="k_ug_name" class="k-inp" value="${ug.settlementName}"></div>
                        <div>
                            <label class="k-lbl">🏘️ Тип</label>
                            <select id="k_ug_type" class="k-inp">
                                <option value="village" ${ug.settlementType === 'village' ? 'selected' : ''}>🏡 Деревня</option>
                                <option value="town" ${ug.settlementType === 'town' ? 'selected' : ''}>🏘️ Посёлок</option>
                                <option value="city" ${ug.settlementType === 'city' ? 'selected' : ''}>🏙️ Город</option>
                                <option value="metropolis" ${ug.settlementType === 'metropolis' ? 'selected' : ''}>👑 Мегаполис</option>
                            </select>
                        </div>
                        <div><label class="k-lbl">⭐ Уровень</label><input type="number" id="k_ug_level" class="k-inp" value="${ug.level}"></div>
                        <div><label class="k-lbl">🍖 Потребление</label><input type="number" id="k_ug_cons" class="k-inp" value="${ug.consumption}" readonly title="Автоматический расчёт: база типа поселения + модификатор зданий + перенаселение" style="background:#0d2415; border-color:#8a6421; color:#ffd875; font-weight:bold; cursor:help;"></div>
                    </div>

                    <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:12px; font-size:12px; align-items:center;">
                        <label title="Рассчитывается автоматически: нужно минимум 1 жилое здание на каждый застроенный блок (2×2)" style="cursor:help;">
                            <input type="checkbox" id="k_ug_overcrowded" ${ug.overcrowded ? 'checked' : ''} disabled> ⚠️ Перенаселение (+2 🍖 Потребл.)
                        </label>
                        <label><input type="checkbox" id="k_ug_lamps" ${ug.infraStreetlamps ? 'checked' : ''}> 🏮 Магические фонари</label>
                        <label><input type="checkbox" id="k_ug_paved" ${ug.infraPavedStreets ? 'checked' : ''}> 🛣️ Мощёные улицы</label>
                        <label><input type="checkbox" id="k_ug_sewer" ${ug.infraSewer ? 'checked' : ''}> 🚰 Канализация</label>
                        <button type="button" class="btn cc" id="kBtnExportCityPng" style="margin-left:auto; padding:4px 10px; font-size:12px;" title="Сохранить изображение городской сетки в PNG">📸 Скачать PNG</button>
                    </div>

                    ${summaryHtml}

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
                        <div><label class="k-lbl">⚔️ Гарнизонные армии</label><input type="text" id="k_ug_armies" class="k-inp" value="${ug.garrisonedArmies}"></div>
                        <div><label class="k-lbl">⚡ Текущие события</label><input type="text" id="k_ug_events" class="k-inp" value="${ug.ongoingEvents}"></div>
                    </div>
                </div>
            </div>
        `;



    }
};

export default KingdomSheetRenderer;
