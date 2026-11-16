import { isCombatConsumable } from '../../config/items_catalog.js';
import { ensureCharacterStats } from './bestiary_config.js';

function positionTooltipElement(e, tip, pad = 16) {
    if (!tip) return;
    const rect = tip.getBoundingClientRect();
    let left = e.clientX + pad;
    let top = e.clientY + pad;

    if (left + rect.width > window.innerWidth - 12) {
        left = e.clientX - rect.width - pad;
    }
    if (top + rect.height > window.innerHeight - 12) {
        top = e.clientY - rect.height - pad;
    }

    tip.style.left = `${Math.max(8, left)}px`;
    tip.style.top = `${Math.max(8, top)}px`;
}

export function hidePresetTooltip() {
    const tip = document.getElementById('initUnitHoverTooltip');
    if (tip) tip.style.display = 'none';
}

export function attachPresetTooltip(card, item, isInactive = false) {
    card.addEventListener('mouseenter', (e) => {
        if (card.querySelector('input.init-inline-name-input')) return;
        if (item.faction !== 'friend' && !window.SHOW_ENEMY_TOOLTIPS) return;

        let tip = document.getElementById('initUnitHoverTooltip');
        if (!tip) {
            tip = document.createElement('div');
            tip.id = 'initUnitHoverTooltip';
            tip.className = 'init-unit-hover-tooltip';
            document.body.appendChild(tip);
        }

        tip.innerHTML = buildUnitTooltipHtml(item, {
            isCombat: false,
            isInactive,
            score: item.defaultScore ?? 10
        });
        tip.style.display = 'block';
        positionTooltipElement(e, tip, 16);
    });

    card.addEventListener('mousemove', (e) => {
        const tip = document.getElementById('initUnitHoverTooltip');
        if (tip && tip.style.display === 'block') {
            positionTooltipElement(e, tip, 16);
        }
    });

    card.addEventListener('mouseleave', () => hidePresetTooltip());
}


export function showSheetItemTooltip(e, html) {
    if (!html || !document.getElementById('bstHeroSheetModal')) return;
    let tip = document.getElementById('bstSheetItemTooltip');
    if (!tip) {
        tip = document.createElement('div');
        tip.id = 'bstSheetItemTooltip';
        tip.className = 'init-unit-hover-tooltip';
        tip.style.maxWidth = '380px';
        tip.style.zIndex = '10000090';
        document.body.appendChild(tip);
    }
    tip.innerHTML = html;
    tip.style.display = 'block';
    positionTooltipElement(e, tip, 14);
}


export function hideSheetItemTooltip() {
    const tip = document.getElementById('bstSheetItemTooltip');
    if (tip) tip.style.display = 'none';
}

// Автоматически прячем тултип при нажатии Esc или клике мимо
if (!window._bstSheetTipGlobalBound) {
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') hideSheetItemTooltip();
    }, true);
    window._bstSheetTipGlobalBound = true;
}

export function bindSheetTooltip(targetEl, getHtmlFn) {
    if (!targetEl) return;
    targetEl.addEventListener('mouseenter', (e) => {
        const html = getHtmlFn();
        if (html) showSheetItemTooltip(e, html);
    });
    targetEl.addEventListener('mousemove', (e) => {
        if (!document.getElementById('bstHeroSheetModal')) {
            hideSheetItemTooltip();
            return;
        }
        positionTooltipElement(e, document.getElementById('bstSheetItemTooltip'), 14);
    });
    targetEl.addEventListener('mouseleave', () => hideSheetItemTooltip());
}

export function buildUnitTooltipHtml(item, options = {}) {
    const stats = ensureCharacterStats(item);
    const fmtMod = (val) => {
        const n = Number(val) || 0;
        return n > 0 ? `+${n}` : `${n}`;
    };

    const isCombat = !!options.isCombat;
    const isCurrentTurn = !!options.isCurrentTurn;
    const isInactive = !!options.isInactive;
    const scoreVal = options.score ?? item.defaultScore ?? 10;

    let badgeHtml = '';
    if (isCombat) {
        badgeHtml = isCurrentTurn
            ? '<span class="init-tip-turn-tag">▶ СЕЙЧАС ХОДИТ</span>'
            : `<span class="init-tip-turn-tag" style="border-color:#543e0d; color:#ebd291; background:rgba(0,0,0,0.35);">Ур. ${stats.level ?? 1}</span>`;
    } else if (item.faction === 'friend') {
        badgeHtml = isInactive
            ? '<span class="init-tip-turn-tag" style="border-color:#95a5a6; color:#b2bec3; background:rgba(149,165,166,0.18);">💤 В РЕЗЕРВЕ</span>'
            : '<span class="init-tip-turn-tag">🛡️ В ОТРЯДЕ</span>';
    } else {
        badgeHtml = `<span class="init-tip-turn-tag" style="border-color:#e74c3c; color:#ff7675; background:rgba(231,76,60,0.18);">Ур. ${stats.level ?? 1}</span>`;
    }

    const metaParts = [
        stats.charClass,
        stats.ancestry,
        stats.level ? `Ур. ${stats.level}` : ''
    ].filter(Boolean);

    const attrs = [
        ['Сила', stats.str], ['Ловкость', stats.dex], ['Выносливость', stats.con],
        ['Интеллект', stats.int], ['Мудрость', stats.wis], ['Харизма', stats.cha]
    ];
    const defenses = [
        ['👁️ Внимание', fmtMod(stats.perception ?? stats.perc)],
        ['🛡️ Стойкость', fmtMod(stats.fortitude ?? stats.fort)],
        ['⚡ Реакция', fmtMod(stats.reflex ?? stats.ref)],
        ['🧠 Воля', fmtMod(stats.will)]
    ];

    const armorPenalty = Math.abs(Number(stats.acArmorPenalty) || 0);

    const skills = [
        ['Акробатика', (stats.acrobatics ?? stats.acro) - armorPenalty],
        ['Аркана', stats.arcana ?? stats.arca],
        ['Атлетика', (stats.athletics ?? stats.athl) - armorPenalty],
        ['Ремесло', stats.crafting],
        ['Обман', stats.deception ?? stats.dece],
        ['Дипломатия', stats.diplomacy ?? stats.dipl],
        ['Запугивание', stats.intimidation ?? stats.inti],
        ['Знания (Lore)', stats.lore],
        ['Медицина', stats.medicine ?? stats.medi],
        ['Природа', stats.nature ?? stats.natu],
        ['Оккультизм', stats.occultism ?? stats.occu],
        ['Выступление', stats.performance],
        ['Религия', stats.religion ?? stats.reli],
        ['Общество', stats.society],
        ['Скрытность', (stats.stealth ?? stats.stea) - armorPenalty],
        ['Выживание', stats.survival ?? stats.surv],
        ['Воровство', (stats.thievery ?? 0) - armorPenalty]
    ].filter(([, v]) => v !== undefined);

    const attacks = [
        stats.melee1Name ? `⚔️ ${stats.melee1Name} <b>${stats.melee1Atk || ''}</b> ${stats.melee1Dmg ? `(${stats.melee1Dmg})` : ''}` : '',
        stats.melee2Name ? `🗡️ ${stats.melee2Name} <b>${stats.melee2Atk || ''}</b> ${stats.melee2Dmg ? `(${stats.melee2Dmg})` : ''}` : '',
        stats.rangedName ? `🏹 ${stats.rangedName} <b>${stats.rangedAtk || ''}</b> ${stats.rangedDmg ? `(${stats.rangedDmg})` : ''}` : ''
    ].filter(Boolean);

    const mapSpells = (prefix, max, icon) => Array.from({ length: max }, (_, idx) => idx + 1)
        .map(i => stats[`${prefix}${i}Name`]
            ? `${icon} ${stats[`${prefix}${i}Name`]}${stats[`${prefix}${i}Actions`] ? ` (${stats[`${prefix}${i}Actions`]})` : ''}`
            : '')
        .filter(Boolean);

    const cantrips = mapSpells('cantrip', 5, '✨');
    const focusSpells = mapSpells('focusSpell', 3, '💠');
    const lvl1Spells = mapSpells('lvl1Spell', 7, '1️⃣');
    const lvl2Spells = mapSpells('lvl2Spell', 5, '2️⃣');
    const lvl3Spells = mapSpells('lvl3Spell', 5, '3️⃣');
    const lvl4Spells = mapSpells('lvl4Spell', 5, '4️⃣');

    const combatItems = Array.from({ length: 15 }, (_, idx) => idx + 1)
        .map(i => {
            const name = stats[`item${i}Name`];
            const qty = Number(stats[`item${i}Qty`]) || 0;
            const notes = stats[`item${i}Notes`] || '';
            if (!name || qty <= 0 || !isCombatConsumable(name, notes)) return '';
            return `🧪 ${name} <b>(×${qty})</b>`;
        })
        .filter(Boolean);

    const hasFocusPool = focusSpells.length > 0 || Number(stats.focusMax) > 0;
    const hasAnyMagic = cantrips.length > 0 || focusSpells.length > 0 || lvl1Spells.length > 0 || lvl2Spells.length > 0 || lvl3Spells.length > 0 || lvl4Spells.length > 0;

    return `
        <div class="init-tip-header">
            <span class="init-tip-name">${item.name}</span>
            ${badgeHtml}
        </div>
        <div class="init-tip-top-row">
            <span>🎲 Иниц.: <b>${scoreVal}</b></span>
            <span>❤️ ПЗ: <b>${stats.hpCurrent ?? stats.hpMax ?? 10}/${stats.hpMax ?? 10}</b></span>
            <span>🛡️ КБ: <b>${stats.ac ?? 10}</b></span>
        </div>
        ${metaParts.length ? `<div style="font-size:14px; color:#dfbc6f; margin-top:4px;">${metaParts.join(' • ')}</div>` : ''}
        <div class="init-tip-section">
            <div class="init-tip-sec-title">⚔️ Характеристики</div>
            <div class="init-tip-2col">${attrs.map(([lbl, v]) => `<div>${lbl}: <b>${fmtMod(v)}</b></div>`).join('')}</div>
        </div>
        <div class="init-tip-section">
            <div class="init-tip-sec-title">🛡️ Внимание и Спасброски</div>
            <div class="init-tip-2col">${defenses.map(([lbl, v]) => `<div>${lbl}: <b>${v}</b></div>`).join('')}</div>
        </div>
        ${attacks.length ? `
        <div class="init-tip-section">
            <div class="init-tip-sec-title">🗡️ Оружие и Атаки</div>
            <div style="font-size:14px; display:flex; flex-direction:column; gap:2px;">${attacks.map(a => `<div>${a}</div>`).join('')}</div>
        </div>` : ''}
        ${hasAnyMagic ? `
        <div class="init-tip-section">
            <div class="init-tip-sec-title" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
                <span>✨ Магия и Фокусы (СЛ ${stats.spellDc ?? 10} / Атк ${fmtMod(stats.spellAttack)})</span>
                ${hasFocusPool ? `<span style="color:#3498db;">🔋 Фокус: ${stats.focusCurrent ?? 1}/${stats.focusMax ?? 1}</span>` : ''}
            </div>
            <div style="font-size:14px; display:flex; flex-direction:column; gap:2px;">
                    ${[...focusSpells, ...cantrips, ...lvl1Spells, ...lvl2Spells, ...lvl3Spells, ...lvl4Spells].map(s => `<div>${s}</div>`).join('')}
            </div>
        </div>` : ''}
        ${combatItems.length ? `
        <div class="init-tip-section">
            <div class="init-tip-sec-title">🧪 Боевые расходники</div>
            <div style="font-size:14px; display:flex; flex-direction:column; gap:2px;">${combatItems.map(ci => `<div>${ci}</div>`).join('')}</div>
        </div>` : ''}
        <div class="init-tip-section">
            <div class="init-tip-sec-title">📜 Навыки</div>
            <div class="init-tip-3col">${skills.map(([lbl, v]) => `<div>${lbl}: <b>${fmtMod(v)}</b></div>`).join('')}</div>
        </div>
        ${options.extraFooterHtml || ''}
    `;
}
