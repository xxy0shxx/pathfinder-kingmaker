import ModalManager from '../../ui/modal_manager.js';
import StorageManager from '../storage_manager.js';
import HeroSyncService from '../../services/hero_sync_service.js';
import CatalogService from '../../services/catalog_service.js';
import { calculateCharacterBulk, getItemLevel } from '../../config/items_catalog.js';
import { esc, numInp, txtInp, txtArea, collectFormData, getMagicTierVisibility } from './sheet_helpers.js';
import { initPage2Pickers } from './sheet_pickers.js';
import { bindSheetTooltip } from './bestiary_tooltip_builder.js';
import CloudSyncService from '../../services/cloud_sync_service.js';

export function buildPage2Html(stats) {
    if (stats.cantripsPrepared && !stats.cantrip1Name) { stats.cantrip1Name = stats.cantripsPrepared; stats.cantripsPrepared = ''; }
    if (stats.lvl1Prepared && !stats.lvl1Spell1Name) { stats.lvl1Spell1Name = stats.lvl1Prepared; stats.lvl1Prepared = ''; }
    if (stats.lvl2Prepared && !stats.lvl2Spell1Name) { stats.lvl2Spell1Name = stats.lvl2Prepared; stats.lvl2Prepared = ''; }
    if (stats.equipmentText && !stats.item1Name) {
        stats.item1Name = 'Снаряжение';
        stats.item1Notes = stats.equipmentText.replace(/\n+/g, '; ');
        stats.equipmentText = '';
    }

    const renderSpellRows = (count, prefix, dataAttr, dropAttr, pickerCls, placeholder, withCheck = false) =>
        Array.from({ length: count }, (_, i) => i + 1).map(idx => `
            <tr>
                <td class="bst-cantrip-num">${withCheck ? `<label style="cursor:pointer;"><input type="checkbox" data-sheet-chk="${prefix}${idx}Ready" ${stats[`${prefix}${idx}Ready`] ? 'checked' : ''}> ${idx}</label>` : idx}</td>
                <td style="position: relative;">
                    <input type="text" data-sheet-txt="${prefix}${idx}Name" ${dataAttr}="${idx}" class="k-inp bst-txt-inp ${pickerCls}" autocomplete="off" placeholder="${placeholder}" value="${esc(stats[`${prefix}${idx}Name`])}">
                    <div class="bst-cantrip-dropdown" ${dropAttr}="${idx}" style="display: none;"></div>
                </td>
                <td>${txtInp(stats, `${prefix}${idx}Actions`, '◆◆ / 30 фт.')}</td>
                <td>${txtInp(stats, `${prefix}${idx}Notes`, 'Эффект...')}</td>
            </tr>`).join('');

    const itemsRows = Array.from({ length: 15 }, (_, i) => i + 1).map(idx => `
        <tr>
            <td class="bst-cantrip-num">${idx}</td>
            <td style="position: relative;">
                <input type="text" data-sheet-txt="item${idx}Name" data-item-row="${idx}" class="k-inp bst-txt-inp bst-item-picker-inp" autocomplete="off" placeholder="🔍 Нажмите для выбора..." value="${esc(stats[`item${idx}Name`])}" style="cursor: pointer;">
                <div class="bst-cantrip-dropdown" data-item-drop="${idx}" style="display: none;"></div>
            </td>
            <td style="text-align: center;">
                <div class="bst-qty-stepper" style="display: inline-flex; align-items: center; gap: 4px; width: 110px;">
                    <button type="button" class="bst-qty-btn" data-qty-delta="-1" style="width:26px; height:26px; background:#292011; border:1px solid #543e0d; color:#ebd291;">−</button>
                    <input type="number" data-sheet-num="item${idx}Qty" class="k-inp bst-tiny-num bst-qty-inp" min="0" value="${stats[`item${idx}Qty`] ?? 1}" style="width:40px; text-align:center; color:#2ecc71; font-weight:900;">
                    <button type="button" class="bst-qty-btn" data-qty-delta="1" style="width:26px; height:26px; background:#292011; border:1px solid #543e0d; color:#ebd291;">+</button>
                </div>
            </td>
            <td>
                <div style="display: flex; align-items: center; gap: 4px;">
                    <input type="text" data-sheet-txt="item${idx}Notes" class="k-inp bst-txt-inp" placeholder="Эффект, вес..." value="${esc(stats[`item${idx}Notes`])}" readonly style="opacity: 0.9; cursor: default;">
                    <button type="button" class="bst-item-give-btn" data-item-give="${idx}" title="Передать предмет другому герою отряда" style="width: 26px; height: 26px; flex-shrink: 0; background: #14283b; border: 1px solid #74b9ff; color: #74b9ff; border-radius: 4px; cursor: pointer; font-size: 12px; display: inline-flex; align-items: center; justify-content: center;">🎁</button>
                    <button type="button" class="bst-item-sell-btn" data-item-sell="${idx}" title="Продать предмет за монеты" style="width: 26px; height: 26px; flex-shrink: 0; background: #1e3c27; border: 1px solid #ffd875; color: #ffd875; border-radius: 4px; cursor: pointer; font-size: 12px; display: inline-flex; align-items: center; justify-content: center;">💰</button>
                    <button type="button" class="bst-item-clear-btn" data-item-clear="${idx}" title="Удалить позицию из рюкзака" style="width: 26px; height: 26px; flex-shrink: 0; background: #3b1717; border: 1px solid #9b2c2c; color: #ff7675; border-radius: 4px; cursor: pointer; font-size: 12px; display: inline-flex; align-items: center; justify-content: center;">🗑️</button>
                </div>
            </td>
        </tr>`).join('');
    const magicInfo = getMagicTierVisibility(stats);
    const renderTierBlock = (show, num, slots, prefix, prefixAttr, placeholder, withCheck) => show ? `
        <div class="bst-spell-tier">
            <div class="bst-spell-tier-head">
                <span>${num}️⃣ ${num} круг</span>
                <label>📅 В день: <input type="number" data-sheet-num="lvl${num}PerDay" class="k-inp bst-tiny-num" value="${slots}" readonly></label>
            </div>
            <table class="k-table bst-cantrips-table">
                <tbody>${renderSpellRows(slots, prefix, `data-${prefixAttr}-row`, `data-${prefixAttr}-drop`, `bst-${prefixAttr}-picker-inp`, placeholder, withCheck)}</tbody>
            </table>
        </div>` : '';

    return `
        <div class="bst-sheet-page2-grid">
            <div class="bst-sheet-col">
                <div class="k-panel">
                    <div class="k-sec-title">✨ Сотворение заклинаний</div>
                    <div class="bst-spell-stats-row">
                        <label>🎯 Атака: ${numInp(stats, 'spellAttack', 'bst-mini-num')}</label>
                        <label>🔮 СЛ: ${numInp(stats, 'spellDc', 'bst-mini-num')}</label>
                    </div>
                    <div class="bst-spell-tier">
                        <div class="bst-spell-tier-head"><span>✨ Фокусы</span><label>📅 В день: ${numInp(stats, 'cantripsPerDay', 'bst-tiny-num')}</label></div>
                        <table class="k-table bst-cantrips-table"><tbody>${renderSpellRows(5, 'cantrip', 'data-cantrip-row', 'data-cantrip-drop', 'bst-cantrip-picker-inp', 'Выберите фокус...')}</tbody></table>
                    </div>
                    <div class="bst-spell-tier">
                        <div class="bst-spell-tier-head"><span>💠 Фокальные</span><label>🔋 Очки: ${numInp(stats, 'focusCurrent', 'bst-tiny-num')} / ${numInp(stats, 'focusMax', 'bst-tiny-num')}</label></div>
                        <table class="k-table bst-cantrips-table"><tbody>${renderSpellRows(3, 'focusSpell', 'data-focus-row', 'data-focus-drop', 'bst-focus-picker-inp', 'Фокальное...', true)}</tbody></table>
                    </div>
                    ${renderTierBlock(magicInfo.showLvl1, 1, magicInfo.lvl1Slots, 'lvl1Spell', 'lvl1', 'Заклинание 1 круга...', false)}
                    ${renderTierBlock(magicInfo.showLvl2, 2, magicInfo.lvl2Slots, 'lvl2Spell', 'lvl2', 'Заклинание 2 круга...', true)}
                    ${renderTierBlock(magicInfo.showLvl3, 3, magicInfo.lvl3Slots, 'lvl3Spell', 'lvl3', 'Заклинание 3 круга...', true)}
                    ${renderTierBlock(magicInfo.showLvl4, 4, magicInfo.lvl4Slots, 'lvl4Spell', 'lvl4', 'Заклинание 4 круга...', true)}
                </div>
            </div>
            <div class="bst-sheet-col">
                <div class="k-panel" style="margin-bottom: 10px;">
                    <div class="k-sec-title">🎒 Снаряжение и Монеты</div>
                    <div class="bst-coins-row" style="justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                        <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                            <span style="font-size: 12px; color: #e17055; font-weight: bold;">🥉 ММ:</span>
                            ${numInp(stats, 'coinsCopper', 'bst-mini-num')}
                            <span style="font-size: 12px; color: #dfe6e9; font-weight: bold;">🥈 СМ:</span>
                            ${numInp(stats, 'coinsSilver', 'bst-mini-num')}
                            <span style="font-size: 12px; color: #ffd875; font-weight: bold;">🥇 ЗМ:</span>
                            ${numInp(stats, 'coinsGold', 'bst-mini-num')}
                            <button type="button" id="btnHeroCoinsConvert" class="btn cc" style="padding: 2px 7px; font-size: 11px;" title="Укрупнить монеты (10 ММ → 1 СМ, 10 СМ → 1 ЗМ)">💱</button>
                            <button type="button" id="btnHeroCoinsTransfer" class="btn ok" style="padding: 2px 8px; font-size: 11px;" title="Передать монеты союзнику, в казну или списать за покупку">💸 Передать / Тратить</button>
                        </div>
                        <div id="bstBulkCounterBadge" style="padding: 4px 10px; border-radius: 5px; border: 1px solid #543e0d; background: rgba(4, 9, 5, 0.85); font-size: 13px; font-weight: bold;"></div>
                    </div>
                    <table class="k-table bst-cantrips-table bst-items-table"><tbody>${itemsRows}</tbody></table>
                </div>

                <div class="k-panel" style="margin-bottom: 10px; border-color: #2ecc71;">
                    <div class="k-sec-title" style="color: #2ecc71;">🐾 Спутники</div>
                    <div style="display: grid; grid-template-columns: 1.5fr repeat(4, 1fr); gap: 6px; margin-bottom: 8px;">
                        ${txtInp(stats, 'compName', 'Имя / Вид...')}
                        <label>❤️ Макс: ${numInp(stats, 'compHpMax', 'bst-mini-num')}</label>
                        <label>🩸 Тек: ${numInp(stats, 'compHpCur', 'bst-mini-num')}</label>
                        <label>🛡️ КБ: ${numInp(stats, 'compAc', 'bst-mini-num')}</label>
                        <label>👟 Скор: ${numInp(stats, 'compSpeed', 'bst-mini-num')}</label>
                    </div>
                    <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                        <select data-sheet-txt="compType" class="k-inp bst-comp-type-selector" style="width: auto; color: #2ecc71;">
                            <option value="none" ${stats.compType === 'none' ? 'selected' : ''}>❌ Нет</option>
                            <option value="companion" ${stats.compType === 'companion' ? 'selected' : ''}>🐅 Верный зверь</option>
                            <option value="familiar" ${stats.compType === 'familiar' ? 'selected' : ''}>🦉 Фамильяр</option>
                        </select>
                        <div style="position: relative; flex-grow: 1;">
                            <input type="text" class="k-inp bst-comp-ability-picker" autocomplete="off" placeholder="🔍 Выберите вид зверя или способность...">
                            <div class="bst-cantrip-dropdown" data-comp-drop="1" style="display: none;"></div>
                        </div>
                    </div>
                    <input type="hidden" data-sheet-txt="compAbilitiesText" value="${esc(stats.compAbilitiesText)}">
                    <div id="bstCompInfoBox" style="background: rgba(4, 9, 5, 0.75); border: 1px solid #2d5a3c; border-radius: 6px; padding: 10px; font-size: 13px; color: #ebd291; line-height: 1.45; white-space: pre-line; min-height: 54px;">
                        ${stats.compAbilitiesText ? esc(stats.compAbilitiesText) : '<span style="color: #7f8c8d;">Спутник не выбран. Выберите тип и найдите зверя или способность в поиске выше.</span>'}
                    </div>
                </div>

                <div class="k-panel" style="margin-bottom: 10px;"><div class="k-sec-title">📖 Журнал приключений</div>${txtArea(stats, 'adventureLogText', 3)}</div>
                <div class="k-panel" style="margin-bottom: 10px;"><div class="k-sec-title">📝 Заметки</div>${txtArea(stats, 'notesText', 3)}</div>
                <div class="k-panel"><div class="k-sec-title">📚 Книга заклинаний</div>${txtArea(stats, 'spellbookText', 3)}</div>
            </div>
        </div>
    `;
}

export function initPage2(overlay, hero) {
    if (CloudSyncService.isPlayerMode) {
        overlay.querySelectorAll('.bst-qty-inp').forEach(inp => {
            inp.readOnly = true;
            inp.title = 'Пополнение предметов доступно через покупку или общий сундук отряда';
        });
    }
    initPage2Pickers(overlay, hero);

    const bulkBadgeEl = overlay.querySelector('#bstBulkCounterBadge');
    if (bulkBadgeEl) {
        bulkBadgeEl.style.cursor = 'help';
        bindSheetTooltip(bulkBadgeEl, () => {
            collectFormData(overlay, hero);
            const b = calculateCharacterBulk(hero.stats);
            const bd = b.breakdown || { armor: '0', weapons: '0', backpack: '0', coins: '0', totalCoins: 0 };
            const bulkStr = `${b.totalBulk}${b.remLight > 0 ? ` и ${b.remLight} Л` : ''}`;
            const strMod = Number(hero.stats.str) || 0;

            return [
                `<div class="init-tip-header"><span class="init-tip-name">🎒 Детализация Массы (Bulk)</span><span class="init-tip-turn-tag" style="border-color:#ffd875; color:#ffd875;">${bulkStr} / ${b.encumberedLimit}</span></div>`,
                `<div class="init-tip-2col" style="font-size:13px; margin-top:6px;">`,
                `<div>🛡️ Доспех: <b>${bd.armor}</b></div>`,
                `<div>⚔️ Оружие: <b>${bd.weapons}</b></div>`,
                `<div>📦 Рюкзак и щит: <b>${bd.backpack}</b></div>`,
                `<div>🪙 Монеты (${bd.totalCoins}): <b>${bd.coins}</b></div>`,
                `</div>`,
                `<div style="margin-top:6px; border-top:1px dashed rgba(235,210,145,0.25); padding-top:4px; font-size:12px; color:#ebd291;">`,
                `<div>📏 Порог перегрузки: <b>5 + ${strMod} (СИЛ)${b.extraLimit > 0 ? ` + ${b.extraLimit} (предмет)` : ''} = ${b.encumberedLimit}</b> (Макс.: <b>${b.maxLimit}</b>)</div>`,
                `<div style="color:#a4b0be; margin-top:2px;">10 Лёгких (Л) = 1 Масса • 1000 монет = 1 Масса</div>`,
                `</div>`
            ].join('');
        });
    }

    const refreshBulkBadge = () => {
        collectFormData(overlay, hero);
        const b = calculateCharacterBulk(hero.stats);
        const badge = overlay.querySelector('#bstBulkCounterBadge');
        if (!badge) return;

        const bulkStr = `${b.totalBulk}${b.remLight > 0 ? ` и ${b.remLight} Л` : ''}`;
        if (b.isOverloaded) {
            badge.style.borderColor = '#e74c3c';
            badge.style.color = '#ff7675';
            badge.innerHTML = `🚫 Масса: <b>${bulkStr}</b> / ${b.encumberedLimit} (Макс. ${b.maxLimit}) — НЕЛЬЗЯ ПОДНЯТЬ!`;
        } else if (b.isEncumbered) {
            badge.style.borderColor = '#f39c12';
            badge.style.color = '#fdcb6e';
            badge.innerHTML = `⚠️ Перегрузка: <b>${bulkStr}</b> / ${b.encumberedLimit} (Неуклюжесть 1, −10 фт. скорости)`;
        } else {
            badge.style.borderColor = '#2ecc71';
            badge.style.color = '#2ecc71';
            badge.innerHTML = `🎒 Масса: <b>${bulkStr}</b> / ${b.encumberedLimit} (Макс. ${b.maxLimit})`;
        }
    };

    const syncCoinsDom = (g, s, c) => {
        const gEl = overlay.querySelector('[data-sheet-num="coinsGold"]');
        const sEl = overlay.querySelector('[data-sheet-num="coinsSilver"]');
        const cEl = overlay.querySelector('[data-sheet-num="coinsCopper"]');
        if (gEl) { gEl.value = String(g); gEl.setAttribute('value', String(g)); }
        if (sEl) { sEl.value = String(s); sEl.setAttribute('value', String(s)); }
        if (cEl) { cEl.value = String(c); cEl.setAttribute('value', String(c)); }
        refreshBulkBadge();
    };

    overlay.querySelector('#btnHeroCoinsConvert')?.addEventListener('click', () => {
        collectFormData(overlay, hero);
        const totalCp = (Number(hero.stats.coinsGold) || 0) * 100 +
            (Number(hero.stats.coinsSilver) || 0) * 10 +
            (Number(hero.stats.coinsCopper) || 0);
        const nextG = Math.floor(totalCp / 100);
        const nextS = Math.floor((totalCp % 100) / 10);
        const nextC = totalCp % 10;
        HeroSyncService.syncCoins(hero, nextG, nextS, nextC, true);
        syncCoinsDom(nextG, nextS, nextC);
    });
    overlay.querySelector('#btnHeroCoinsTransfer')?.addEventListener('click', () => {
        collectFormData(overlay, hero);
        const curG = Math.max(0, Number(hero.stats.coinsGold) || 0);
        const curS = Math.max(0, Number(hero.stats.coinsSilver) || 0);
        const curC = Math.max(0, Number(hero.stats.coinsCopper) || 0);
        const totalAvailableCp = curG * 100 + curS * 10 + curC;

        const partyList = (window.BestiaryManager?.state?.party || []).filter(p => p && p.id !== hero.id && !p.inactive);
        const targetOptionsHtml = [
            `<option value="spend">🛒 Траты / Покупка / Услуги (списать со счёта)</option>`,
            `<option value="treasury">💰 В общую казну отряда</option>`,
            ...partyList.map(p => `<option value="hero:${p.id}">🛡️ Передать герою: ${esc(p.name)}</option>`)
        ].join('');

        const txModal = ModalManager.open({
            id: 'bstHeroCoinTxModal',
            title: `💸 Кошелёк: ${esc(hero.name)}`,
            width: '440px',
            borderColor: '#ffd875',
            bodyHtml: `
                <div style="font-size: 14px; color: #ebd291; line-height: 1.5;">
                    <div style="margin-bottom: 8px; padding: 6px 10px; background: rgba(4,9,5,0.75); border: 1px solid #543e0d; border-radius: 5px;">
                        В кошельке: <b style="color:#ffd875;">${curG} ЗМ</b>, <b style="color:#dfe6e9;">${curS} СМ</b>, <b style="color:#e17055;">${curC} ММ</b>
                        <span style="color:#a4b0be; font-size:12px;">(всего ${(totalAvailableCp / 100).toFixed(2)} ЗМ)</span>
                    </div>
                    <div style="margin-bottom: 8px;">
                        <label style="font-size: 12px; color: #ffd875; font-weight: bold;">Куда направить монеты:</label>
                        <select id="bstTxTargetSel" class="k-inp" style="width: 100%; margin-top: 3px; padding: 6px; background: #040905; border: 1px solid #543e0d; color: #ebd291;">
                            ${targetOptionsHtml}
                        </select>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 8px;">
                        <div><span style="font-size: 12px; color: #ffd875;">🥇 ЗМ:</span><input type="number" id="bstTxGold" class="k-inp" min="0" value="0" style="width: 100%; text-align: center;"></div>
                        <div><span style="font-size: 12px; color: #dfe6e9;">🥈 СМ:</span><input type="number" id="bstTxSilver" class="k-inp" min="0" value="0" style="width: 100%; text-align: center;"></div>
                        <div><span style="font-size: 12px; color: #e17055;">🥉 ММ:</span><input type="number" id="bstTxCopper" class="k-inp" min="0" value="0" style="width: 100%; text-align: center;"></div>
                    </div>
                    <input type="text" id="bstTxNote" class="k-inp" placeholder="Комментарий (напр. Зелье лечения, на доспех)..." style="width: 100%; font-size: 13px; padding: 6px 8px;">
                    <div id="bstTxErr" style="color: #ff7675; font-size: 12px; margin-top: 6px; min-height: 16px;"></div>
                </div>
            `,
            footerButtons: [{
                label: '✅ Выполнить',
                variant: 'ok',
                onClick: () => {
                    const g = Math.max(0, parseInt(document.getElementById('bstTxGold')?.value, 10) || 0);
                    const s = Math.max(0, parseInt(document.getElementById('bstTxSilver')?.value, 10) || 0);
                    const c = Math.max(0, parseInt(document.getElementById('bstTxCopper')?.value, 10) || 0);
                    const sendCp = g * 100 + s * 10 + c;
                    const errEl = document.getElementById('bstTxErr');

                    if (sendCp <= 0) { if (errEl) errEl.textContent = '⚠️ Укажите сумму больше 0.'; return; }
                    if (sendCp > totalAvailableCp) { if (errEl) errEl.textContent = '⚠️ Недостаточно монет в кошельке героя!'; return; }

                    const remCp = totalAvailableCp - sendCp;
                    const nextG = Math.floor(remCp / 100);
                    const nextS = Math.floor((remCp % 100) / 10);
                    const nextC = remCp % 10;

                    HeroSyncService.syncCoins(hero, nextG, nextS, nextC, false);
                    syncCoinsDom(nextG, nextS, nextC);

                    const target = document.getElementById('bstTxTargetSel')?.value || 'spend';
                    const note = String(document.getElementById('bstTxNote')?.value || '').trim();

                    if (target === 'treasury' && window.BestiaryManager?.addTreasuryLoot) {
                        window.BestiaryManager.addTreasuryLoot(g, s, c, `${hero.name}${note ? ': ' + note : ''}`);
                    } else if (target.startsWith('hero:')) {
                        const recipient = HeroSyncService.findBestiaryHero(target.slice(5));
                        if (recipient) {
                            HeroSyncService.syncCoins(
                                recipient,
                                (Number(recipient.stats?.coinsGold) || 0) + g,
                                (Number(recipient.stats?.coinsSilver) || 0) + s,
                                (Number(recipient.stats?.coinsCopper) || 0) + c,
                                false
                            );
                            const coinParts = [g > 0 ? `${g} ЗМ` : '', s > 0 ? `${s} СМ` : '', c > 0 ? `${c} ММ` : ''].filter(Boolean).join(' ');
                            StorageManager.appendTreasuryLog(`💸 ${hero.name} → ${recipient.name}: ${coinParts}${note ? ` (${note})` : ''}`, 'transfer');
                            CloudSyncService.sendHeroTgNotification(
                                recipient.id,
                                `💰 *${hero.name}* перевёл(а) вам *${coinParts}*${note ? ` _(${note})_` : ''}!`
                            );
                        }
                    }

                    if (window.BestiaryManager?._save) window.BestiaryManager._save();
                    txModal.close();
                }
            }]
        });
        if (txModal?.overlay) txModal.overlay.style.zIndex = '10000250';
    });

    overlay.querySelectorAll('.bst-items-table input, [data-sheet-num^="coins"]').forEach(el => {
        el.addEventListener('input', refreshBulkBadge);
        el.addEventListener('change', refreshBulkBadge);
    });
    overlay.querySelectorAll('.bst-qty-btn').forEach(btn => btn.addEventListener('click', () => setTimeout(refreshBulkBadge, 10)));
    refreshBulkBadge();

    const magicGroups = [
        { prefix: 'cantrip', rowAttr: 'cantripRow', icon: '✨' },
        { prefix: 'focusSpell', rowAttr: 'focusRow', icon: '💠' },
        { prefix: 'lvl1Spell', rowAttr: 'lvl1Row', icon: '1️⃣' },
        { prefix: 'lvl2Spell', rowAttr: 'lvl2Row', icon: '2️⃣' },
        { prefix: 'lvl3Spell', rowAttr: 'lvl3Row', icon: '3️⃣' },
        { prefix: 'lvl4Spell', rowAttr: 'lvl4Row', icon: '4️⃣' }
    ];

    overlay.querySelectorAll('.bst-cantrips-table tbody tr').forEach(tr => {
        for (const g of magicGroups) {
            const nameInp = tr.querySelector(`input[data-sheet-txt^="${g.prefix}"]`);
            if (!nameInp) continue;
            bindSheetTooltip(tr, () => {
                const name = nameInp.value.trim();
                if (!name) return null;
                const idx = nameInp.dataset[g.rowAttr];
                const act = overlay.querySelector(`[data-sheet-txt="${g.prefix}${idx}Actions"]`)?.value || '—';
                const notes = overlay.querySelector(`[data-sheet-txt="${g.prefix}${idx}Notes"]`)?.value || 'Описание отсутствует.';
                return `<div class="init-tip-header"><span class="init-tip-name">${g.icon} ${name}</span></div><div class="init-tip-top-row"><span>⏳ Действие: <b>${act}</b></span></div><div style="font-size:13px; margin-top:6px; color:#ebd291;">${notes}</div>`;
            });
            break;
        }
    });

    overlay.querySelectorAll('.bst-items-table tbody tr').forEach(tr => {
        bindSheetTooltip(tr, () => {
            const name = tr.querySelector('input[data-sheet-txt$="Name"]')?.value.trim();
            if (!name) return null;
            const notes = tr.querySelector('input[data-sheet-txt$="Notes"]')?.value.trim() || 'Описание отсутствует.';
            const heroLvl = Math.max(1, parseInt(hero.stats.level, 10) || 1);
            const found = CatalogService.findItem(name);
            const reqLvl = found ? getItemLevel(found) : 0;
            const lvlBadge = reqLvl > 0 ? `<span class="init-tip-turn-tag" style="border-color:${reqLvl > heroLvl ? '#e74c3c' : '#2ecc71'}; color:${reqLvl > heroLvl ? '#ff7675' : '#2ecc71'};">УР. ${reqLvl}</span>` : '';
            const lockWarn = reqLvl > heroLvl ? `<div style="font-size:12px; color:#ff7675; margin-bottom:5px; font-weight:bold;">🔒 Требуется ${reqLvl} уровень персонажа (бонусы предмета заблокированы)</div>` : '';
            return `<div class="init-tip-header"><span class="init-tip-name">🎒 ${name}</span>${lvlBadge}</div>${lockWarn}<div style="font-size:13px; color:#ebd291;">${notes}</div>`;
        });
    });
}
