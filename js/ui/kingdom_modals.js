import ModalManager from './modal_manager.js';

const KingdomModals = {
    /**
     * 1. Модальное окно проверки навыка королевства
     */
    openSkillCheck(km, skillId) {
        const cfg = km.skillConfig.find(item => item.id === skillId);
        if (!cfg) return;

        const s = km.state;
        const baseSkillMod = km.getSkillTotal(skillId);
        const defaultDc = (parseInt(s.controlDcBase, 10) || 14) + (parseInt(s.controlDcSize, 10) || 0);

        const features = km.getRegionalFeatureBonuses();
        const isCultureOrEcon = cfg.ability === 'culture' || cfg.ability === 'economy';
        const isLoyaltyOrStab = cfg.ability === 'loyalty' || cfg.ability === 'stability';
        const hasRegionBonus = (isCultureOrEcon && features.hasLandmark) || (isLoyaltyOrStab && features.hasRefuge);
        const regionLabel = isCultureOrEcon
            ? '✨ Регион с Достопримечательностью (+2 обст. к Культуре/Экономике)'
            : '🛡 Зона с Убежищем (+2 обст. к Верности/Стабильности)';

        const hasIsolatedHexes = (parseInt(s.isolatedHexesCount, 10) || 0) > 0;
        const modBadgeHtml = `<span id="kCheckEffectiveModBadge" style="background:#040905; border:1px solid #ffd875; padding:3px 10px; border-radius:4px; font-family:monospace; font-size:18px; font-weight:bold; color:#2ecc71;">${baseSkillMod >= 0 ? '+' + baseSkillMod : baseSkillMod}</span>`;

        const { overlay } = ModalManager.open({
            id: 'kSkillCheckOverlay',
            title: `🎲 Проверка: ${cfg.label}`,
            headerRightHtml: modBadgeHtml,
            width: '490px',
            bodyHtml: `
                <div style="display:flex; flex-direction:column; gap:6px; margin-bottom:12px; font-size:13px;">
                    <label style="display:flex; align-items:center; gap:8px; padding:6px 10px; background:rgba(0,0,0,0.35); border:1px solid ${hasRegionBonus ? '#2ecc71' : '#543e0d'}; border-radius:4px; cursor:pointer; opacity:${hasRegionBonus ? '1' : '0.6'};">
                        <input type="checkbox" id="kCheckRegionBonusCb" ${hasRegionBonus ? 'checked' : ''}>
                        <span>${regionLabel}</span>
                    </label>
                    <label style="display:flex; align-items:center; gap:8px; padding:6px 10px; background:rgba(0,0,0,0.35); border:1px solid ${hasIsolatedHexes ? '#e74c3c' : '#543e0d'}; border-radius:4px; cursor:pointer; opacity:${hasIsolatedHexes ? '1' : '0.6'};">
                        <input type="checkbox" id="kCheckIsolatedPenaltyCb">
                        <span>⚠ Вторичная (изолированная) территория (−2 штраф)</span>
                    </label>
                </div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:14px;">
                    <div>
                        <label class="k-lbl">Сложность проверки (СЛ)</label>
                        <input type="number" id="kCheckDcInp" class="k-inp" value="${defaultDc}" style="font-size:18px; font-weight:bold; text-align:center;">
                    </div>
                    <div>
                        <label class="k-lbl">Бросок d20 (1–20)</label>
                        <div style="display:flex; gap:6px;">
                            <input type="number" id="kCheckRollInp" class="k-inp" min="1" max="20" placeholder="1–20" style="font-size:18px; font-weight:bold; text-align:center; border-color:#ffd875; color:#ffd875;">
                            <button type="button" class="btn cc" id="kCheckAutoRollBtn" style="padding:0 12px; font-size:16px;">🎲</button>
                        </div>
                    </div>
                </div>
                <div id="kCheckResultBox" style="background:rgba(0,0,0,0.45); border:1px solid #543e0d; border-radius:6px; padding:14px; text-align:center; min-height:76px; display:flex; flex-direction:column; justify-content:center; gap:4px;">
                    <span style="color:#95a5a6; font-size:14px;">Введите результат броска d20 или нажмите 🎲</span>
                </div>
            `,
            footerButtons: [{ label: 'Закрыть', variant: 'ok', style: 'min-width:120px;' }]
        });

        const dcInp = overlay.querySelector('#kCheckDcInp');
        const rollInp = overlay.querySelector('#kCheckRollInp');
        const resBox = overlay.querySelector('#kCheckResultBox');
        const regCb = overlay.querySelector('#kCheckRegionBonusCb');
        const isoCb = overlay.querySelector('#kCheckIsolatedPenaltyCb');
        const modBadge = overlay.querySelector('#kCheckEffectiveModBadge');

        const evaluateOutcome = () => {
            const circAlready = parseInt(s.skills?.[skillId]?.circ, 10) || 0;
            const effMod = baseSkillMod + (regCb.checked ? Math.max(0, 2 - circAlready) : 0) + (isoCb.checked ? -2 : 0);
            const modStr = effMod >= 0 ? `+${effMod}` : `${effMod}`;
            modBadge.textContent = modStr;

            const dc = parseInt(dcInp.value, 10) || defaultDc;
            const d20 = parseInt(rollInp.value, 10);
            if (isNaN(d20) || d20 < 1 || d20 > 20) {
                resBox.innerHTML = `<span style="color:#95a5a6; font-size:14px;">Введите число от 1 до 20 (Мод.: ${modStr})</span>`;
                resBox.style.borderColor = '#543e0d';
                return;
            }

            const total = d20 + effMod;
            const diff = total - dc;
            let deg = diff >= 10 ? 3 : (diff >= 0 ? 2 : (diff <= -10 ? 0 : 1));
            if (d20 === 20) deg = Math.min(3, deg + 1);
            else if (d20 === 1) deg = Math.max(0, deg - 1);

            const meta = [
                { label: '💀 КРИТИЧЕСКИЙ ПРОВАЛ', color: '#e74c3c', bg: 'rgba(231, 76, 60, 0.16)' },
                { label: '✖ ПРОВАЛ', color: '#ff7675', bg: 'rgba(255, 118, 117, 0.12)' },
                { label: '✔ УСПЕХ', color: '#2ecc71', bg: 'rgba(46, 204, 113, 0.14)' },
                { label: '👑 КРИТИЧЕСКИЙ УСПЕХ', color: '#ffd875', bg: 'rgba(255, 216, 117, 0.2)' }
            ][deg];

            resBox.style.borderColor = meta.color;
            resBox.style.background = meta.bg;
            resBox.innerHTML = `<div style="font-size:20px; font-weight:900; color:${meta.color};">${meta.label}</div>
                <div style="font-size:15px; color:#ebd291; font-family:monospace;">Бросок: <b>${d20}</b> (${modStr}) = <b style="color:#fff; font-size:18px;">${total}</b> против СЛ <b>${dc}</b></div>`;
        };

        [dcInp, rollInp, regCb, isoCb].forEach(el => el.addEventListener('input', evaluateOutcome));
        [regCb, isoCb].forEach(el => el.addEventListener('change', evaluateOutcome));
        overlay.querySelector('#kCheckAutoRollBtn').addEventListener('click', () => {
            rollInp.value = Math.floor(Math.random() * 20) + 1;
            evaluateOutcome();
        });
        setTimeout(() => rollInp.focus(), 50);
    },

    /**
     * 2. Фаза содержания (Upkeep)
     */
    openUpkeep(km) {
        const s = km.state;
        const diceCount = (parseInt(s.level, 10) || 1) + 4;
        const dieSides = km.getResourceDieSides();

        const { overlay, close } = ModalManager.open({
            id: 'kUpkeepModalOverlay',
            title: '⚜ Фаза содержания',
            width: '460px',
            bodyHtml: `
                <div style="background:rgba(0,0,0,0.35); border:1px solid #543e0d; border-radius:6px; padding:12px; margin-bottom:14px; font-size:15px; line-height:1.45;">
                    <div>• Добыча: <b>+${s.workSites.farmlands} Еды</b>, <b>+${s.workSites.lumberCamps} Древесины</b>, <b>+${s.workSites.mines} Руды</b>, <b>+${s.workSites.quarries} Камня</b></div>
                    <div>• Расход провизии: <b style="color:#ff7675;">-${s.consumption} Еды</b></div>
                </div>
                <label style="display:block; font-size:15px; font-weight:bold; color:#ffd875; margin-bottom:6px;">
                    🎲 Бросьте <span style="color:#2ecc71; font-size:18px; font-family:monospace;">${diceCount}d${dieSides}</span> и введите сумму RP:
                </label>
                <input type="number" id="kUpkeepDiceInput" class="k-inp" min="0" placeholder="Например: ${diceCount * 2}" style="font-size:20px; font-weight:bold; text-align:center; padding:8px; border-color:#d4af37; color:#ffd875;">
            `,
            footerButtons: [
                { label: 'Отмена', variant: 'cc' },
                {
                    label: '⚜ Применить ход',
                    variant: 'ok',
                    onClick: () => {
                        const inputEl = overlay.querySelector('#kUpkeepDiceInput');
                        const val = parseInt(inputEl.value, 10);
                        if (isNaN(val) || val < 0) {
                            inputEl.style.borderColor = '#e74c3c';
                            inputEl.focus();
                            return;
                        }
                        close();
                        km.applyUpkeepWithRoll(val);
                    }
                }
            ]
        });

        const inputEl = overlay.querySelector('#kUpkeepDiceInput');
        setTimeout(() => inputEl.focus(), 50);
        inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') overlay.querySelector('[data-modal-btn-idx="1"]').click();
        });
    },

    /**
     * 3. Завершение хода королевства
     */
    openEndTurn(km, EventBus) {
        const s = km.state;
        const currentRp = parseInt(s.rp, 10) || 0;
        const xpGain = Math.min(120, Math.max(0, currentRp));
        const nextXp = (parseInt(s.xp, 10) || 0) + xpGain;
        const hasUnresolved = Array.isArray(s.events) && s.events.some(ev => ev.status !== 'resolved');
        const eventFlatDc = hasUnresolved ? 11 : 16;

        ModalManager.open({
            id: 'kEndTurnOverlay',
            title: '⏳ Завершение хода королевства',
            width: '540px',
            bodyHtml: `
                <div style="background:rgba(255, 216, 117, 0.08); border:1px solid #8a6421; border-radius:6px; padding:12px 14px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; gap:12px;">
                    <div style="font-size:15px;">
                        <b style="color:#ffd875;">⚡ Фаза Событий:</b> чистая проверка <b>СЛ ${eventFlatDc}</b>
                    </div>
                    <button type="button" class="btn cc" id="kEndTurnGoEventBtn" style="font-size:14px; padding:8px 12px;">🎲 Проверить событие</button>
                </div>
                <div style="background:rgba(0,0,0,0.4); border:1px solid #543e0d; border-radius:6px; padding:14px; font-size:16px; line-height:1.6;">
                    <div>• Остаток RP: <b>${currentRp}</b> → сбрасывается в 0</div>
                    <div>• Конвертация в опыт (макс. 120): <b style="color:#2ecc71;">+${xpGain} XP</b> (Итого: <b>${nextXp} / 1000</b>)</div>
                    <div>• Календарь: сдвиг на <b>+1 месяц</b></div>
                </div>
            `,
            footerButtons: [
                { label: 'Отмена', variant: 'cc' },
                {
                    label: '⚜ Завершить ход',
                    variant: 'ok',
                    onClick: ({ close }) => {
                        s.rp = 0;
                        s.xp = nextXp;
                        close();
                        EventBus.emit('kingdom:turnEnded');
                        km.recalculateModifiers();
                        km.resetAllLeaderActions();
                        km._persist();
                        km.renderUi();
                        if (s.xp >= 1000) km.openLevelUpModal();
                    }
                }
            ]
        });

        document.getElementById('kEndTurnGoEventBtn')?.addEventListener('click', () => {
            ModalManager.close('kEndTurnOverlay');
            km.openKingdomEventRollModal();
        });
    },

    /**
     * 4. Повышение уровня королевства
     */
    openLevelUp(km) {
        const s = km.state;
        const currentXp = parseInt(s.xp, 10) || 0;
        if (currentXp < 1000) return;

        const statLabels = { culture: 'Культура', economy: 'Экономика', loyalty: 'Лояльность', stability: 'Стабильность' };
        const checkboxesHtml = Object.entries(statLabels).map(([key, label]) => {
            const curVal = parseInt(s.stats[key]?.value, 10) || 10;
            const step = curVal >= 18 ? 1 : 2;
            return `<label style="display:flex; justify-content:space-between; padding:8px 12px; background:rgba(0,0,0,0.35); border:1px solid #543e0d; border-radius:5px; cursor:pointer;">
                <span><input type="checkbox" class="k-lvlup-stat-cb" value="${key}"> <b>${label}</b></span>
                <span style="color:#2ecc71; font-family:monospace;">${curVal} → ${curVal + step}</span>
            </label>`;
        }).join('');

        const { overlay } = ModalManager.open({
            id: 'kLevelUpOverlay',
            title: `👑 Повышение уровня (${s.level} → ${(parseInt(s.level, 10) || 1) + 1})`,
            borderColor: '#ffd875',
            width: '460px',
            bodyHtml: `<div style="font-size:14px; color:#dfbc6f; margin-bottom:12px;">Списывается <b>1000 XP</b>, СЛ контроля <b>+1</b>. Выберите <b>2 характеристики</b>:</div>
                <div style="display:flex; flex-direction:column; gap:8px;">${checkboxesHtml}</div>`,
            footerButtons: [
                { label: 'Позже', variant: 'cc' },
                {
                    label: '👑 Повысить уровень',
                    variant: 'ok',
                    id: 'kLvlUpConfirm',
                    disabled: true,
                    style: 'opacity:0.5;',
                    onClick: ({ close }) => {
                        const chosen = Array.from(overlay.querySelectorAll('.k-lvlup-stat-cb:checked')).map(i => i.value);
                        if (chosen.length !== 2) return;
                        s.xp = Math.max(0, currentXp - 1000);
                        s.level = (parseInt(s.level, 10) || 1) + 1;
                        s.controlDcBase = (parseInt(s.controlDcBase, 10) || 14) + 1;
                        chosen.forEach(k => {
                            const cur = parseInt(s.stats[k].value, 10) || 10;
                            s.stats[k].value = cur + (cur >= 18 ? 1 : 2);
                        });
                        close();
                        km.recalculateModifiers();
                        km._persist();
                        km.renderUi();
                    }
                }
            ]
        });

        const cbs = Array.from(overlay.querySelectorAll('.k-lvlup-stat-cb'));
        const btnConfirm = overlay.querySelector('#kLvlUpConfirm');
        cbs.forEach(cb => cb.addEventListener('change', () => {
            const checked = cbs.filter(i => i.checked);
            if (checked.length > 2) { cb.checked = false; return; }
            btnConfirm.disabled = checked.length !== 2;
            btnConfirm.style.opacity = checked.length === 2 ? '1' : '0.5';
        }));
    },

    /**
     * 5. Обмен ресурсов (Товары ↔ RP)
     */
    openTrade(km) {
        const rates = {
            food:     { label: '🌾 Еда',              buy: 2, sell: 1 },
            lumber:   { label: '🪵 Древесина',        buy: 2, sell: 1 },
            ore:      { label: '⛏ Руда',             buy: 2, sell: 1 },
            stone:    { label: '🧱 Камень',           buy: 2, sell: 1 },
            luxuries: { label: '💎 Предметы роскоши', buy: 4, sell: 2 }
        };

        const renderTrade = () => {
            const s = km.state;
            const curRp = parseInt(s.rp, 10) || 0;
            const rowsHtml = Object.entries(rates).map(([key, info]) => {
                const c = s.commodities[key] || { value: 0, max: 4 };
                const canBuy = curRp >= info.buy && c.value < c.max;
                const canSell = c.value > 0;
                return `<tr>
                    <td style="font-weight:bold; padding:8px 6px;">${info.label}</td>
                    <td style="text-align:center; font-family:monospace; font-size:16px; color:#ffd875; font-weight:bold;">${c.value} / ${c.max}</td>
                    <td style="text-align:center;"><button type="button" class="btn ok k-trade-buy" data-comm="${key}" ${canBuy ? '' : 'disabled'} style="padding:5px 10px; font-size:12px; opacity:${canBuy ? '1' : '0.4'};">+1 за ${info.buy} RP</button></td>
                    <td style="text-align:center;"><button type="button" class="btn cc k-trade-sell" data-comm="${key}" ${canSell ? '' : 'disabled'} style="padding:5px 10px; font-size:12px; opacity:${canSell ? '1' : '0.4'};">-1 → +${info.sell} RP</button></td>
                </tr>`;
            }).join('');

            const { overlay } = ModalManager.open({
                id: 'kTradeModalOverlay',
                title: '⚖ Обмен ресурсов (Товары ↔ RP)',
                headerRightHtml: `<span style="background:#040905; border:1px solid #ffd875; padding:4px 12px; border-radius:5px; font-family:monospace; font-size:17px; font-weight:bold; color:#ffd875;">Казна: ${curRp} RP</span>`,
                width: '540px',
                bodyHtml: `<table class="k-table"><thead><tr><th>Ресурс</th><th style="text-align:center;">Склад</th><th style="text-align:center;">Купить</th><th style="text-align:center;">Продать</th></tr></thead><tbody>${rowsHtml}</tbody></table>`,
                footerButtons: [{ label: '⚜ Закрыть', variant: 'ok', style: 'min-width:130px;' }]
            });

            overlay.querySelectorAll('.k-trade-buy').forEach(btn => btn.addEventListener('click', () => {
                const rate = rates[btn.dataset.comm], c = s.commodities[btn.dataset.comm];
                if ((parseInt(s.rp, 10) || 0) >= rate.buy && c.value < c.max) {
                    s.rp -= rate.buy; c.value += 1;
                    km._persist(); km.renderUi(); renderTrade();
                }
            }));
            overlay.querySelectorAll('.k-trade-sell').forEach(btn => btn.addEventListener('click', () => {
                const rate = rates[btn.dataset.comm], c = s.commodities[btn.dataset.comm];
                if (c.value > 0) {
                    c.value -= 1; s.rp = (parseInt(s.rp, 10) || 0) + rate.sell;
                    km._persist(); km.renderUi(); renderTrade();
                }
            }));
        };
        renderTrade();
    },

    /**
     * 6. Атака армии
     */
    openArmyAttack(km, armyId) {
        const army = (km.state.armies || []).find(a => a.id === armyId);
        if (!army) return;

        const atkMod = parseInt(army.attack, 10) || 0;
        const modStr = atkMod >= 0 ? `+${atkMod}` : `${atkMod}`;

        const { overlay } = ModalManager.open({
            id: 'kArmyRollOverlay',
            title: `⚔ Атака: ${army.name || 'Армия'}`,
            headerRightHtml: `<span style="background:#040905; border:1px solid #ffd875; padding:2px 10px; border-radius:4px; font-family:monospace; font-size:17px; color:#2ecc71;">${modStr}</span>`,
            width: '440px',
            bodyHtml: `
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:14px;">
                    <div><label class="k-lbl">КБ вражеской армии</label><input type="number" id="kArmyTargetAc" class="k-inp" value="16" style="font-size:18px; font-weight:bold; text-align:center;"></div>
                    <div><label class="k-lbl">Бросок d20</label><div style="display:flex; gap:6px;"><input type="number" id="kArmyRollInp" class="k-inp" min="1" max="20" placeholder="1-20" style="font-size:18px; font-weight:bold; text-align:center; color:#ffd875;"><button type="button" class="btn cc" id="kArmyAutoRoll" style="padding:0 12px;">🎲</button></div></div>
                </div>
                <div id="kArmyResBox" style="background:rgba(0,0,0,0.45); border:1px solid #543e0d; border-radius:6px; padding:12px; text-align:center; font-size:15px;">Введите бросок d20 или нажмите 🎲</div>
            `,
            footerButtons: [{ label: 'Закрыть', variant: 'ok' }]
        });

        const acInp = overlay.querySelector('#kArmyTargetAc'), rollInp = overlay.querySelector('#kArmyRollInp'), resBox = overlay.querySelector('#kArmyResBox');
        const evaluate = () => {
            const d20 = parseInt(rollInp.value, 10), ac = parseInt(acInp.value, 10) || 16;
            if (isNaN(d20) || d20 < 1 || d20 > 20) return;
            const total = d20 + atkMod, diff = total - ac;
            let deg = diff >= 10 ? 3 : (diff >= 0 ? 2 : (diff <= -10 ? 0 : 1));
            if (d20 === 20) deg = Math.min(3, deg + 1);
            if (d20 === 1) deg = Math.max(0, deg - 1);

            const out = [
                { t: '💀 КРИТИЧЕСКИЙ ПРОВАЛ (Армия получает 1 урон!)', c: '#e74c3c' },
                { t: '✖ ПРОМАХ (0 урона)', c: '#ff7675' },
                { t: '✔ ПОПАДАНИЕ (Враг получает 1 урон ОЗ)', c: '#2ecc71' },
                { t: '👑 КРИТИЧЕСКОЕ ПОПАДАНИЕ (Враг получает 2 урона ОЗ!)', c: '#ffd875' }
            ][deg];

            resBox.style.borderColor = out.c;
            resBox.innerHTML = `<b style="color:${out.c}; font-size:17px;">${out.t}</b><br>Итог: <b>${total}</b> (${d20} ${modStr}) против КБ <b>${ac}</b>`;
        };

        [acInp, rollInp].forEach(el => el.addEventListener('input', evaluate));
        overlay.querySelector('#kArmyAutoRoll').addEventListener('click', () => { rollInp.value = Math.floor(Math.random() * 20) + 1; evaluate(); });
    },

    /**
     * 7. Фаза случайных событий королевства (d100)
     */
    openEventRoll(km, eventsPool) {
        if (!eventsPool || eventsPool.length === 0) return;
        const s = km.state;
        const baseCtrlDc = (parseInt(s.controlDcBase, 10) || 14) + (parseInt(s.controlDcSize, 10) || 0);
        const flatCheckDc = (Array.isArray(s.events) && s.events.some(ev => ev.status !== 'resolved')) ? 11 : 16;
        let selectedEvent = null;

        const { overlay } = ModalManager.open({
            id: 'kRandomEventOverlay',
            title: '⚡ Фаза Событий королевства (Конец хода)',
            width: '1100px',
            bodyHtml: `
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px; margin-bottom:14px;">
                    <div style="background:rgba(0,0,0,0.38); border:1px solid #543e0d; border-radius:6px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center;">
                        <div><div style="font-size:18px; font-weight:bold; color:#ffd875;">1. Чистая проверка: СЛ ${flatCheckDc}</div></div>
                        <input type="number" id="kEvFlatRollInp" class="k-inp" min="1" max="20" placeholder="d20" style="width:90px; font-size:24px; font-weight:bold; text-align:center;">
                    </div>
                    <div id="kEvD100Box" style="background:rgba(0,0,0,0.38); border:1px solid #543e0d; border-radius:6px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; opacity:0.45; pointer-events:none;">
                        <div><div style="font-size:18px; font-weight:bold; color:#ffd875;">2. Бросок по таблице (d100)</div></div>
                        <input type="number" id="kEvD100RollInp" class="k-inp" min="1" max="100" placeholder="1–100" style="width:105px; font-size:24px; font-weight:bold; text-align:center; color:#ffd875;">
                    </div>
                </div>
                <div id="kEvTableGrid" style="display:grid; grid-template-columns: 1fr 1fr; gap:6px 12px; margin-bottom:14px; opacity:0.45; pointer-events:none;">
                    ${eventsPool.map(ev => `<div data-rand-ev-id="${ev.id}" data-min-roll="${ev.minRoll}" style="padding:7px 12px; border:1px solid #543e0d; border-radius:5px; background:rgba(0,0,0,0.32); display:flex; justify-content:space-between; cursor:pointer; font-size:16px;">
                        <span><b style="color:${ev.type === 'boon' ? '#2ecc71' : '#ff7675'};">${ev.minRoll}–${ev.maxRoll}</b> ${ev.icon} ${ev.title}</span>
                        <span style="color:#a4b0be; font-size:14px;">СЛ ${baseCtrlDc + (ev.dcMod || 0)}</span>
                    </div>`).join('')}
                </div>
                <div id="kEvPreviewBox" style="background:#040905; border:1px solid #543e0d; border-radius:6px; padding:12px 16px; font-size:17px;">Введите результат чистой проверки d20 (при &lt; ${flatCheckDc} события нет).</div>
            `,
            footerButtons: [
                { label: 'Закрыть', variant: 'cc' },
                {
                    label: '⚡ Добавить во вкладку События',
                    variant: 'ok',
                    id: 'kEvAddToTabBtn',
                    disabled: true,
                    onClick: ({ close }) => {
                        if (!selectedEvent) return;
                        if (!Array.isArray(s.events)) s.events = [];
                        s.events.push({
                            id: 'ev_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                            name: `${selectedEvent.icon} ${selectedEvent.title}`,
                            title: `${selectedEvent.icon} ${selectedEvent.title}`,
                            skill: selectedEvent.skill || 'statecraft',
                            dc: Number(baseCtrlDc + (selectedEvent.dcMod || 0)) || 14,
                            status: 'active',
                            notes: selectedEvent.desc
                        });
                        close();
                        km.activeSubTab = 'events';
                        km._persist();
                        km.renderUi();
                    }
                }
            ]
        });

        const flatInp = overlay.querySelector('#kEvFlatRollInp'), d100Box = overlay.querySelector('#kEvD100Box'), d100Inp = overlay.querySelector('#kEvD100RollInp');
        const tableGrid = overlay.querySelector('#kEvTableGrid'), previewBox = overlay.querySelector('#kEvPreviewBox'), addBtn = overlay.querySelector('#kEvAddToTabBtn');

        const update = () => {
            const passed = (parseInt(flatInp.value, 10) || 0) >= flatCheckDc;
            d100Box.style.opacity = tableGrid.style.opacity = passed ? '1' : '0.45';
            d100Box.style.pointerEvents = tableGrid.style.pointerEvents = passed ? 'auto' : 'none';
            if (!passed) { selectedEvent = null; addBtn.disabled = true; return; }
            const d100 = parseInt(d100Inp.value, 10);
            selectedEvent = eventsPool.find(e => d100 >= e.minRoll && d100 <= e.maxRoll) || null;
            overlay.querySelectorAll('[data-rand-ev-id]').forEach(el => {
                const hit = selectedEvent && el.dataset.randEvId === selectedEvent.id;
                el.style.borderColor = hit ? '#ffd875' : '#543e0d';
                el.style.background = hit ? 'rgba(255, 216, 117, 0.16)' : 'rgba(0,0,0,0.32)';
            });
            previewBox.innerHTML = selectedEvent ? `<b style="color:#ffd875;">${selectedEvent.icon} ${selectedEvent.title}</b><br>${selectedEvent.desc}` : 'Введите бросок d100 или выберите строку.';
            addBtn.disabled = !selectedEvent;
        };

        flatInp.addEventListener('input', update);
        d100Inp.addEventListener('input', update);
        overlay.querySelectorAll('[data-rand-ev-id]').forEach(r => r.addEventListener('click', () => { d100Inp.value = r.dataset.minRoll; update(); }));
    },

    /**
     * 8. Подтверждение строительства здания в поселении
     */
    openBuildConfirm(km, buildingId, meta, targetR, targetC, KingdomBuildings) {
        const s = km.state;
        const cost = typeof KingdomBuildings.getBuildingCost === 'function'
            ? KingdomBuildings.getBuildingCost(buildingId)
            : { rp: 0 };

        const hasConstructionYard = (s.urbanGrid?.buildings || []).some(b => b.id === 'construction_yard');
        const finalRp = (cost.rp > 0 && hasConstructionYard) ? Math.max(1, cost.rp - 1) : (cost.rp || 0);

        const reqs = [
            { key: 'rp', label: '🪙 Очки ресурсов (RP)', need: finalRp, have: parseInt(s.rp, 10) || 0 },
            { key: 'lumber', label: '🪵 Дерево', need: cost.lumber || 0, have: parseInt(s.commodities.lumber?.value, 10) || 0 },
            { key: 'stone', label: '🧱 Камень', need: cost.stone || 0, have: parseInt(s.commodities.stone?.value, 10) || 0 },
            { key: 'ore', label: '⛏️ Руда', need: cost.ore || 0, have: parseInt(s.commodities.ore?.value, 10) || 0 },
            { key: 'luxuries', label: '💎 Роскошь', need: cost.luxuries || 0, have: parseInt(s.commodities.luxuries?.value, 10) || 0 }
        ].filter(r => r.need > 0);

        const canAfford = reqs.every(r => r.have >= r.need);
        const reqsHtml = reqs.length === 0
            ? `<div style="color:#2ecc71;">Постройка не требует затрат ресурсов.</div>`
            : reqs.map(r => `<div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px dashed rgba(138,100,33,0.25);">
                <span>${r.label}:</span>
                <span style="font-family:monospace; font-weight:bold; color:${r.have >= r.need ? '#2ecc71' : '#ff7675'};">Нужно ${r.need} (На складе: ${r.have})</span>
            </div>`).join('');

        const finishBuild = (deductResources, close) => {
            if (deductResources && canAfford) {
                s.rp = (parseInt(s.rp, 10) || 0) - finalRp;
                if (cost.lumber) s.commodities.lumber.value -= cost.lumber;
                if (cost.stone) s.commodities.stone.value -= cost.stone;
                if (cost.ore) s.commodities.ore.value -= cost.ore;
                if (cost.luxuries) s.commodities.luxuries.value -= cost.luxuries;
            }
            s.urbanGrid.buildings.push({
                uid: 'bld_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                id: buildingId, r: targetR, c: targetC, rotation: 0
            });
            close();
            km.syncSettlementStats();
            km._persist();
            km.renderUi();
        };

        ModalManager.open({
            id: 'kBuildConfirmOverlay',
            title: `🏗 Строительство: ${meta.name}`,
            width: '460px',
            bodyHtml: `
                <div style="font-size:13px; color:#a4b0be; margin-bottom:10px;">
                    Уровень: <b style="color:#ffd875;">${meta.level}</b> • Размер: <b style="color:#ffd875;">${meta.cols}×${meta.rows}</b>
                    ${hasConstructionYard && cost.rp > 0 ? `<div style="color:#2ecc71; margin-top:3px;">✔ Скидка Строительного двора: −1 RP</div>` : ''}
                </div>
                <div style="background:rgba(0,0,0,0.4); border:1px solid #543e0d; border-radius:6px; padding:10px 14px; font-size:15px;">${reqsHtml}</div>
            `,
            footerButtons: [
                { label: 'Отмена', variant: 'cc' },
                { label: 'Бесплатно (Редактор)', variant: 'cc', onClick: ({ close }) => finishBuild(false, close) },
                { label: '⚜ Построить и списать', variant: 'ok', disabled: !canAfford, style: `opacity:${canAfford ? '1' : '0.45'};`, onClick: ({ close }) => canAfford && finishBuild(true, close) }
            ]
        });
    },

    /**
     * 9. Присоединение Вольного владения дипломатией
     */
    openAnnexFreehold(km, freeholdName = 'Вольное владение', onSuccessCallback = null) {
        const s = km.state;
        const baseCtrlDc = (parseInt(s.controlDcBase, 10) || 14) + (parseInt(s.controlDcSize, 10) || 0);
        const cleanName = (freeholdName || '').trim() || `Вольное владение #${s.settlements.length + 1}`;
        const diploSkills = [
            { id: 'statecraft', label: 'Управление (Statecraft)' },
            { id: 'politics',   label: 'Политика (Politics)' },
            { id: 'folklore',   label: 'Традиции (Folklore)' },
            { id: 'intrigue',   label: 'Интрига (Intrigue)' }
        ];

        const { overlay } = ModalManager.open({
            id: 'kFreeholdAnnexOverlay',
            title: '🤝 Присоединение Вольного владения',
            borderColor: '#ffd875',
            width: '490px',
            bodyHtml: `
                <div style="display:grid; grid-template-columns: 2fr 1fr; gap:10px; margin-bottom:10px;">
                    <div><label class="k-lbl">Название поселения</label><input type="text" id="kFhNameInp" class="k-inp" value="${cleanName}"></div>
                    <div><label class="k-lbl">Тип поселения</label><select id="kFhTypeSel" class="k-inp"><option value="village" selected>Деревня</option><option value="town">Посёлок</option><option value="city">Город</option></select></div>
                </div>
                <div style="display:grid; grid-template-columns: 1.5fr 1fr 1fr; gap:10px; margin-bottom:12px;">
                    <div><label class="k-lbl">Навык переговоров</label><select id="kFhSkillSel" class="k-inp">${diploSkills.map(sk => { const mod = km.getSkillTotal(sk.id); return `<option value="${sk.id}">${sk.label} (${mod >= 0 ? '+' + mod : mod})</option>`; }).join('')}</select></div>
                    <div><label class="k-lbl">СЛ (DC)</label><input type="number" id="kFhDcInp" class="k-inp" value="${baseCtrlDc}" style="text-align:center; font-weight:bold;"></div>
                    <div><label class="k-lbl">Бросок d20</label><div style="display:flex; gap:4px;"><input type="number" id="kFhRollInp" class="k-inp" min="1" max="20" placeholder="1-20" style="text-align:center; font-weight:bold; color:#ffd875;"><button type="button" class="btn cc" id="kFhAutoRoll" style="padding:0 8px;">🎲</button></div></div>
                </div>
                <div id="kFhResultBox" style="background:rgba(0,0,0,0.45); border:1px solid #543e0d; border-radius:6px; padding:12px; text-align:center; font-size:14px; color:#95a5a6;">Выполните проверку переговоров (d20) или присоедините напрямую</div>
            `,
            footerButtons: [
                { label: 'Отмена', variant: 'cc' },
                {
                    label: '👑 Присоединить в королевство',
                    variant: 'ok',
                    onClick: ({ close }) => {
                        const finalName = overlay.querySelector('#kFhNameInp').value.trim() || cleanName;
                        const created = km._createDefaultSettlement(finalName);
                        created.settlementType = overlay.querySelector('#kFhTypeSel').value || 'village';
                        s.settlements.push(created);
                        s.activeSettlementId = created.id;
                        s.urbanGrid = created;
                        close();
                        km.recalculateModifiers();
                        km._persist();
                        km.renderUi();
                        if (typeof onSuccessCallback === 'function') onSuccessCallback(finalName);
                    }
                }
            ]
        });

        const skillSel = overlay.querySelector('#kFhSkillSel'), dcInp = overlay.querySelector('#kFhDcInp'), rollInp = overlay.querySelector('#kFhRollInp'), resBox = overlay.querySelector('#kFhResultBox');
        const evaluate = () => {
            const d20 = parseInt(rollInp.value, 10), dc = parseInt(dcInp.value, 10) || baseCtrlDc, mod = km.getSkillTotal(skillSel.value);
            if (isNaN(d20) || d20 < 1 || d20 > 20) return;
            const total = d20 + mod, diff = total - dc;
            let deg = diff >= 10 ? 3 : (diff >= 0 ? 2 : (diff <= -10 ? 0 : 1));
            if (d20 === 20) deg = Math.min(3, deg + 1);
            if (d20 === 1) deg = Math.max(0, deg - 1);
            const labels = [
                { t: '💀 КРИТИЧЕСКИЙ ПРОВАЛ (+1 Беспорядки)', c: '#e74c3c' },
                { t: '✖ ПРОВАЛ (Владение сохраняет независимость)', c: '#ff7675' },
                { t: '✔ УСПЕХ (Готово войти в королевство)', c: '#2ecc71' },
                { t: '👑 КРИТИЧЕСКИЙ УСПЕХ (Присоединяется с энтузиазмом!)', c: '#ffd875' }
            ][deg];
            resBox.style.borderColor = labels.c;
            resBox.innerHTML = `<b style="color:${labels.c}; font-size:16px;">${labels.t}</b><br>Итог: <b>${total}</b> (${d20} ${mod >= 0 ? '+' + mod : mod}) против СЛ <b>${dc}</b>`;
        };
        [skillSel, dcInp, rollInp].forEach(el => el.addEventListener('input', evaluate));
        overlay.querySelector('#kFhAutoRoll').addEventListener('click', () => { rollInp.value = Math.floor(Math.random() * 20) + 1; evaluate(); });
    },

    /**
     * 10. Дипломатические переговоры с соседними государствами и фракциями (PF2e Kingmaker)
     */
    openDiplomacyAction(km, factionId, actionType = 'envoy') {
        const s = km.state;
        const faction = (s.diplomacy || []).find(f => f.id === factionId);
        if (!faction) return;

        const baseCtrlDc = (parseInt(s.controlDcBase, 10) || 14) + (parseInt(s.controlDcSize, 10) || 0);
        const negDc = parseInt(faction.negotiationDc, 10) || 15;
        const dieSides = km.getResourceDieSides();

        const actionsMeta = {
            envoy: {
                title: '🕊️ Отправить дипломатического посла',
                dc: negDc,
                dcNote: `Negotiation DC фракции (${negDc})`,
                skills: [
                    { id: 'statecraft', label: '👑 Управление (Statecraft)' },
                    { id: 'politics',   label: '⚖️ Политика (Politics)' }
                ]
            },
            trade: {
                title: '⚖ Заключить торговое соглашение',
                dc: Math.max(negDc, baseCtrlDc),
                dcNote: `Максимум из Negotiation DC (${negDc}) и Control DC (${baseCtrlDc})`,
                skills: [
                    { id: 'trade',   label: '💰 Торговля (Trade)' },
                    { id: 'boating', label: '⛵ Лодочный транспорт (речной путь)' },
                    { id: 'magic',   label: '🔮 Магия (при ранге Мастер+)' }
                ]
            },
            aid: {
                title: '🎁 Запросить постороннюю помощь',
                dc: negDc,
                dcNote: `Negotiation DC фракции (${negDc})`,
                skills: [
                    { id: 'statecraft', label: '👑 Управление (Statecraft)' },
                    { id: 'politics',   label: '⚖️ Политика (Politics)' },
                    { id: 'trade',      label: '💰 Торговля (Trade)' },
                    { id: 'intrigue',   label: '🗡️ Интрига (Intrigue)' }
                ]
            }
        };

        const cfg = actionsMeta[actionType] || actionsMeta.envoy;
        const circBonus = parseInt(faction.circumstanceMod, 10) || 0;
        let lastDegree = null;

        const { overlay } = ModalManager.open({
            id: 'kDiplomacyActionOverlay',
            title: `${cfg.title}: ${faction.name || 'Фракция'}`,
            borderColor: '#ffd875',
            width: '540px',
            bodyHtml: `
                <div style="font-size:13px; color:#a4b0be; margin-bottom:10px;">
                    Базовая сложность: <b style="color:#ffd875;">${cfg.dcNote}</b>
                    ${circBonus !== 0 ? ` • Модификатор отношений: <b style="color:${circBonus > 0 ? '#2ecc71' : '#ff7675'};">${circBonus > 0 ? '+' + circBonus : circBonus}</b>` : ''}
                </div>
                <div style="display:grid; grid-template-columns: 1.7fr 0.8fr 1fr; gap:10px; margin-bottom:12px;">
                    <div>
                        <label class="k-lbl">Навык лидера</label>
                        <select id="kDiploSkillSel" class="k-inp">
                            ${cfg.skills.map(sk => {
                const mod = km.getSkillTotal(sk.id) + circBonus;
                return `<option value="${sk.id}">${sk.label} (${mod >= 0 ? '+' + mod : mod})</option>`;
            }).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="k-lbl">СЛ (DC)</label>
                        <input type="number" id="kDiploDcInp" class="k-inp" value="${cfg.dc}" style="text-align:center; font-weight:bold;">
                    </div>
                    <div>
                        <label class="k-lbl">Бросок d20</label>
                        <div style="display:flex; gap:4px;">
                            <input type="number" id="kDiploRollInp" class="k-inp" min="1" max="20" placeholder="1-20" style="text-align:center; font-weight:bold; color:#ffd875;">
                            <button type="button" class="btn cc" id="kDiploAutoRoll" style="padding:0 8px;">🎲</button>
                        </div>
                    </div>
                </div>
                <div id="kDiploResultBox" style="background:rgba(0,0,0,0.45); border:1px solid #543e0d; border-radius:6px; padding:12px; font-size:14px; line-height:1.5; color:#ebd291;">
                    Выполните проверку переговоров (d20) со стола или нажмите 🎲.
                </div>
            `,
            footerButtons: [
                { label: 'Отмена', variant: 'cc' },
                {
                    label: '⚜ Применить итог переговоров',
                    variant: 'ok',
                    id: 'kDiploApplyBtn',
                    disabled: true,
                    style: 'opacity:0.45;',
                    onClick: ({ close }) => {
                        if (lastDegree === null) return;
                        this._applyDiplomacyOutcome(km, faction, actionType, lastDegree, dieSides);
                        close();
                    }
                }
            ]
        });

        const skillSel = overlay.querySelector('#kDiploSkillSel');
        const dcInp = overlay.querySelector('#kDiploDcInp');
        const rollInp = overlay.querySelector('#kDiploRollInp');
        const resBox = overlay.querySelector('#kDiploResultBox');
        const applyBtn = overlay.querySelector('#kDiploApplyBtn');

        const evaluate = () => {
            const d20 = parseInt(rollInp.value, 10);
            const dc = parseInt(dcInp.value, 10) || cfg.dc;
            if (isNaN(d20) || d20 < 1 || d20 > 20) {
                lastDegree = null;
                applyBtn.disabled = true;
                applyBtn.style.opacity = '0.45';
                return;
            }

            const mod = km.getSkillTotal(skillSel.value) + circBonus;
            const total = d20 + mod;
            const diff = total - dc;
            let deg = diff >= 10 ? 3 : (diff >= 0 ? 2 : (diff <= -10 ? 0 : 1));
            if (d20 === 20) deg = Math.min(3, deg + 1);
            if (d20 === 1) deg = Math.max(0, deg - 1);
            lastDegree = deg;

            const outcomeTexts = {
                envoy: [
                    `💀 <b>КРИТИЧЕСКИЙ ПРОВАЛ:</b> Посол схвачен или погиб! Статус «Враждебность» (−2 штраф), +1 Беспорядки.`,
                    `✖ <b>ПРОВАЛ:</b> Отношения не установлены, но посол изучил этикет (+1 бонус к следующей попытке).`,
                    `✔ <b>УСПЕХ:</b> Дипломатические отношения установлены!${!s.firstDiplomacyXpClaimed ? ' (+60 XP за первые дипотношения!)' : ''}`,
                    `👑 <b>КРИТИЧЕСКИЙ УСПЕХ:</b> Блестящий приём! Дипотношения установлены + бонус +2 к переговорам с фракцией!`
                ],
                trade: [
                    `💀 <b>КРИТИЧЕСКИЙ ПРОВАЛ:</b> Торговый скандал! +1 Беспорядки и штраф −1 к следующему обмену.`,
                    `✖ <b>ПРОВАЛ:</b> Договор не заключён (без штрафов).`,
                    `✔ <b>УСПЕХ:</b> Торговое соглашение с «${faction.name}» заключено!`,
                    `👑 <b>КРИТИЧЕСКИЙ УСПЕХ:</b> Выгодный контракт! Соглашение заключено + немедленный доход <b>2d${dieSides} RP</b> в казну!`
                ],
                aid: [
                    `💀 <b>КРИТИЧЕСКИЙ ПРОВАЛ:</b> Союзник оскорблён! Сброс бонуса отношений (−2) и +1 Беспорядки.`,
                    `✖ <b>ПРОВАЛ:</b> Союзник не готов помочь прямо сейчас, но пришлёт <b>+1d4 RP</b> в начале следующего хода.`,
                    `✔ <b>УСПЕХ:</b> Помощь получена: <b>+1d${dieSides} RP</b> в казну (или +2 к проверке королевства).`,
                    `👑 <b>КРИТИЧЕСКИЙ УСПЕХ:</b> Щедрая поддержка: <b>+2d${dieSides} RP</b> в казну и бонус +4 к проверке королевства!`
                ]
            };

            const colors = ['#e74c3c', '#ff7675', '#2ecc71', '#ffd875'];
            resBox.style.borderColor = colors[deg];
            resBox.innerHTML = `<div style="margin-bottom:4px; font-family:monospace;">Итог: <b>${total}</b> (${d20} ${mod >= 0 ? '+' + mod : mod}) против СЛ <b>${dc}</b></div>
                <div style="color:${colors[deg]};">${outcomeTexts[actionType][deg]}</div>`;

            applyBtn.disabled = false;
            applyBtn.style.opacity = '1';
        };

        [skillSel, dcInp, rollInp].forEach(el => el.addEventListener('input', evaluate));
        overlay.querySelector('#kDiploAutoRoll').addEventListener('click', () => {
            rollInp.value = Math.floor(Math.random() * 20) + 1;
            evaluate();
        });
    },

    _applyDiplomacyOutcome(km, faction, actionType, deg, dieSides) {
        const s = km.state;
        const rollDice = (count, sides) => Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1).reduce((a, b) => a + b, 0);

        if (actionType === 'envoy') {
            if (deg >= 2) {
                faction.status = 'established';
                faction.circumstanceMod = deg === 3 ? 2 : 0;
                if (!s.firstDiplomacyXpClaimed) {
                    s.firstDiplomacyXpClaimed = true;
                    s.xp = (parseInt(s.xp, 10) || 0) + 60;
                }
            } else if (deg === 1) {
                faction.circumstanceMod = Math.min(2, (parseInt(faction.circumstanceMod, 10) || 0) + 1);
            } else {
                faction.status = 'hostile';
                faction.circumstanceMod = -2;
                s.unrest = (parseInt(s.unrest, 10) || 0) + 1;
            }
        } else if (actionType === 'trade') {
            if (deg >= 2) {
                faction.tradeAgreement = true;
                if (deg === 3) s.rp = (parseInt(s.rp, 10) || 0) + rollDice(2, dieSides);
            } else if (deg === 0) {
                s.unrest = (parseInt(s.unrest, 10) || 0) + 1;
            }
        } else if (actionType === 'aid') {
            if (deg === 3) {
                s.rp = (parseInt(s.rp, 10) || 0) + rollDice(2, dieSides);
            } else if (deg === 2) {
                s.rp = (parseInt(s.rp, 10) || 0) + rollDice(1, dieSides);
            } else if (deg === 0) {
                faction.circumstanceMod = -2;
                s.unrest = (parseInt(s.unrest, 10) || 0) + 1;
            }
        }
        km.recalculateModifiers();
        km._persist();
        km.renderUi();
    }



};

export default KingdomModals;
