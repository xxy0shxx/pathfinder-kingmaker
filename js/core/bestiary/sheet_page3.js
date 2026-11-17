import { esc } from './sheet_helpers.js';
import { initPage3Pickers } from './sheet_pickers.js';
import { bindSheetTooltip } from './bestiary_tooltip_builder.js';
import CatalogService from '../../services/catalog_service.js';

export function buildPage3Html(hero) {
    const stats = hero.stats || {};
    const investedUsed = Math.min(10, Math.max(0, Number(stats.investedUsedToday) || 0));

    const avatarHtml = hero.avatar
        ? `<img src="${hero.avatar}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">`
        : `<div style="font-size:64px; color:#543e0d;">🛡️</div>`;

    const renderBodySlot = (slotKey, icon, label) => {
        const val = esc(stats[`eq_${slotKey}_Name`] || '');
        const isInv = !!stats[`eq_${slotKey}_Invested`];
        return `
            <div class="bst-doll-slot" data-eq-slot="${slotKey}" style="background:rgba(4,9,5,0.85); border:1.5px solid ${isInv ? '#a29bfe' : '#8a6421'}; border-radius:6px; padding:5px 7px; position:relative;">
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:10px; color:#a4b0be; margin-bottom:2px;">
                    <span>${icon} ${label}</span>
                    ${isInv ? `<span title="Вложенный магический предмет" style="color:#a29bfe; font-weight:bold;">✨ Влож.</span>` : ''}
                </div>
                <div style="display:flex; gap:3px; align-items:center;">
                    <input type="text" data-sheet-txt="eq_${slotKey}_Name" data-eq-picker="${slotKey}" class="k-inp bst-txt-inp" placeholder="Пусто..." value="${val}" style="font-size:11px; padding:2px 5px; height:22px;">
                    ${val ? `<button type="button" class="bst-eq-unequip-btn" data-unequip-slot="${slotKey}" title="Снять предмет (дневной лимит вложения сохраняется)" style="background:#3b1717; border:1px solid #9b2c2c; color:#ff7675; border-radius:3px; padding:0 5px; height:22px; cursor:pointer; font-size:11px;">✖</button>` : ''}
                </div>
            </div>
        `;
    };

    const extraInvestedRows = [1, 2, 3, 4, 5].map(idx => {
        const val = esc(stats[`eq_ring_${idx}_Name`] || '');
        const isInv = !!stats[`eq_ring_${idx}_Invested`];
        return `
            <div style="display:flex; gap:4px; align-items:center; margin-bottom:4px;">
                <span style="font-size:11px; color:${isInv ? '#a29bfe' : '#7f8c8d'}; width:18px;">💍${idx}</span>
                <input type="text" data-sheet-txt="eq_ring_${idx}_Name" data-eq-picker="ring_${idx}" class="k-inp bst-txt-inp" placeholder="Кольцо, эонский камень, татуировка..." value="${val}" style="font-size:11px; padding:2px 6px; height:22px;">
                ${val ? `<button type="button" class="bst-eq-unequip-btn" data-unequip-slot="ring_${idx}" title="Снять (дневное вложение не возвращается)" style="background:#3b1717; border:1px solid #9b2c2c; color:#ff7675; border-radius:3px; padding:0 5px; height:22px; cursor:pointer; font-size:11px;">✖</button>` : ''}
            </div>
        `;
    }).join('');

    const beltSlotsHtml = [1, 2, 3, 4, 5].map(idx => `
        <div style="background:rgba(4,9,5,0.85); border:1px solid #8a6421; border-radius:5px; padding:4px 6px;">
            <div style="font-size:10px; color:#ffd875; margin-bottom:2px;">⚡ Пояс #${idx} (1 ◆)</div>
            <input type="text" data-sheet-txt="beltItem${idx}Name" data-belt-picker="${idx}" class="k-inp bst-txt-inp" placeholder="Зелье, свиток, бомба, набор..." value="${esc(stats[`beltItem${idx}Name`] || '')}" style="font-size:11px; padding:2px 5px; height:22px;">
        </div>
    `).join('');

    return `
        <div style="display:grid; grid-template-columns: 1.35fr 1fr; gap:14px; align-items:start;">
            <div class="k-panel" style="padding:12px 14px; border:1px solid #8a6421;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #543e0d; padding-bottom:6px;">
                    <span style="font-size:15px; font-weight:bold; color:#ffd875;">🛡️ Экипировка на теле (Кукла героя)</span>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span id="bstInvestedCounterBadge" style="font-size:12px; font-weight:bold; padding:2px 8px; border-radius:4px; background:rgba(162,155,254,0.15); border:1px solid #a29bfe; color:#a29bfe;">
                            ✨ Вложено сегодня: ${investedUsed} / 10
                        </span>
                        <button type="button" id="btnResetDailyInvested" class="btn cc" style="padding:2px 8px; font-size:11px;" title="Ежедневная подготовка: сбросить счётчик вложенных предметов и заново вложить надетые">🌅 Подготовка</button>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 190px 1fr; gap:8px; align-items:center;">
                    <div style="display:flex; flex-direction:column; gap:7px;">
                        ${renderBodySlot('head', '👑', 'Голова (Шлем/Диадема)')}
                        ${renderBodySlot('cloak', '🧥', 'Плечи (Плащ)')}
                        ${renderBodySlot('hands', '🧤', 'Кисти (Перчатки/Наручи)')}
                        ${renderBodySlot('belt', '🥋', 'Талия (Пояс)')}
                    </div>
                    <div style="height:245px; border:2px solid #d4af37; border-radius:10px; background:radial-gradient(circle, #1e3524 0%, #09120c 100%); display:flex; align-items:center; justify-content:center; overflow:hidden; box-shadow:0 0 18px rgba(212,175,55,0.25);">
                        ${avatarHtml}
                    </div>
                    <div style="display:flex; flex-direction:column; gap:7px;">
                        ${renderBodySlot('neck', '📿', 'Шея (Амулет/Кулон)')}
                        ${renderBodySlot('armor', '🦺', 'Торс (Доспех/Роба)')}
                        ${renderBodySlot('eyes', '🥽', 'Глаза (Очки/Маска)')}
                        ${renderBodySlot('feet', '👢', 'Ноги (Сапоги)')}
                    </div>
                </div>

                <div style="margin-top:12px; padding-top:8px; border-top:1px dashed #543e0d;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <span style="font-size:13px; font-weight:bold; color:#ffd875;">⚡ Пояс и перевязи (Быстрый доступ за 1 ◆ — лимит 2.0 Массы)</span>
                        <span id="bstBeltBulkBadge" style="font-size:12px; font-weight:bold; color:#2ecc71;">0.0 / 2.0 Массы</span>
                    </div>
                    <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap:6px;">
                        ${beltSlotsHtml}
                    </div>
                </div>

                <div style="margin-top:12px; padding-top:8px; border-top:1px dashed #543e0d;">
                    <div style="font-size:13px; font-weight:bold; color:#ffd875; margin-bottom:6px;">⚔️ Предметы в руках (Макс. 2 руки: двуручное или 1р + щит/жезл)</div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
                        ${renderBodySlot('mainHand', '🗡️', 'Правая / Ведущая рука')}
                        ${renderBodySlot('offHand', '🛡️', 'Левая рука (Щит / Второе / Жезл)')}
                    </div>
                </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:12px;">
                <div class="k-panel" style="padding:12px 14px; border:1px solid #8a6421;">
                    <div style="font-size:14px; font-weight:bold; color:#a29bfe; margin-bottom:4px;">💍 Кольца, Эонские камни и Татуировки</div>
                    <div style="font-size:11px; color:#a4b0be; margin-bottom:8px; line-height:1.35;">
                        В PF2e нет лимита «только 2 кольца» — ограничения задаёт только общий дневной лимит <b>10 вложенных предметов</b>. При снятии вложенного предмета лимит возвращается только после 🌅 Ежедневной подготовки.
                    </div>
                    ${extraInvestedRows}
                </div>

                <div class="k-panel" style="padding:12px 14px; border:1px solid #8a6421;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <span style="font-size:14px; font-weight:bold; color:#ffd875;">🎒 Походный рюкзак (4.0 Массы)</span>
                        <span style="font-size:11px; color:#2ecc71;">Первые 2.0 Массы не весят!</span>
                    </div>
                    <div style="font-size:11px; color:#a4b0be; margin-bottom:8px; line-height:1.35;">
                        Доставать вещи из рюкзака в бою неудобно (2 ◆: снять рюкзак и достать), поэтому здесь хранятся спальник, пайки, верёвка и запасные факелы.
                    </div>
                    <div id="bstPage3BackpackSummary" style="font-size:12px; color:#ebd291; background:rgba(0,0,0,0.35); border:1px solid #543e0d; border-radius:5px; padding:8px;"></div>
                </div>
            </div>
        </div>
    `;
}

export function initPage3(overlay, hero) {
    initPage3Pickers(overlay, hero);

    overlay.querySelectorAll('[data-eq-picker], [data-belt-picker]').forEach(inp => {
        const targetBox = inp.closest('.bst-doll-slot') || inp.parentElement;
        bindSheetTooltip(targetBox, () => {
            const val = inp.value.trim();
            if (!val || val.startsWith('🔒')) return null;
            const found = CatalogService.findAnyGear(val);
            const desc = found?.notes || found?.traits || 'Экипированный предмет.';
            return `<div class="init-tip-header"><span class="init-tip-name">${val}</span></div><div style="font-size:13px; color:#ebd291; margin-top:4px;">${desc}</div>`;
        });
    });
}
