import { SHORT_TO_FULL_SKILL_MAP } from './bestiary_config.js';

export const esc = (v) => String(v ?? '').replace(/"/g, '&quot;');

export const numInp = (stats, key, cls = 'bst-stat-inp') =>
    `<input type="number" data-sheet-num="${key}" class="k-inp ${cls}" value="${stats[key] ?? 0}">`;

export const txtInp = (stats, key, placeholder = '') =>
    `<input type="text" data-sheet-txt="${key}" class="k-inp bst-txt-inp" placeholder="${placeholder}" value="${esc(stats[key])}">`;

export const txtArea = (stats, key, rows = 4, placeholder = '') =>
    `<textarea data-sheet-txt="${key}" class="k-inp bst-area-inp" rows="${rows}" placeholder="${placeholder}">${String(stats[key] ?? '')}</textarea>`;

export function collectFormData(overlayEl, hero) {
    overlayEl.querySelectorAll('[data-sheet-num]').forEach(inp => {
        const val = parseInt(inp.value, 10);
        hero.stats[inp.dataset.sheetNum] = isNaN(val) ? 0 : val;
    });
    overlayEl.querySelectorAll('[data-sheet-txt]').forEach(inp => {
        hero.stats[inp.dataset.sheetTxt] = inp.value;
    });
    overlayEl.querySelectorAll('[data-sheet-chk]').forEach(chk => {
        hero.stats[chk.dataset.sheetChk] = chk.checked;
    });

    Object.entries(SHORT_TO_FULL_SKILL_MAP).forEach(([shortKey, fullKey]) => {
        if (hero.stats[fullKey] !== undefined) {
            hero.stats[shortKey] = hero.stats[fullKey];
        }
    });
}

export function getMagicTierVisibility(stats) {
    const cls = String(stats.charClass || '').toLowerCase().replace(/ё/g, 'е').trim();
    const lvl = Math.max(1, parseInt(stats.level, 10) || 1);

    const emptyResult = {
        showLvl1: false, showLvl2: false, showLvl3: false, showLvl4: false, showLvl5: false,
        showLvl6: false, showLvl7: false, showLvl8: false, showLvl9: false, showLvl10: false,
        lvl1Slots: 0, lvl2Slots: 0, lvl3Slots: 0, lvl4Slots: 0, lvl5Slots: 0,
        lvl6Slots: 0, lvl7Slots: 0, lvl8Slots: 0, lvl9Slots: 0, lvl10Slots: 0
    };

    const matchWord = (keywords) =>
        keywords.some(k => new RegExp(`(^|\\s|\\()${k}($|\\s|\\))`, 'i').test(cls));

    const isFourSlotCaster = matchWord(['чародей', 'сорк', 'sorcerer', 'волшебник', 'маг', 'wizard', 'жрец', 'клирик', 'cleric']);
    const isThreeSlotCaster = matchWord(['друид', 'druid', 'бард', 'bard', 'ведьма', 'witch', 'оракул', 'oracle', 'анимист', 'animist', 'некромант', 'necromancer']);
    const isPsychic = matchWord(['экстрасенс', 'псионик', 'psychic']);
    const isBoundedCaster = matchWord(['колдун', 'магус', 'magus', 'призыватель', 'summoner']);

    if (!isFourSlotCaster && !isThreeSlotCaster && !isPsychic && !isBoundedCaster) {
        return emptyResult;
    }

    // Ограниченные заклинатели (Magus / Summoner): по 2 ячейки двух высших доступных кругов
    if (isBoundedCaster) {
        const maxTier = Math.min(9, Math.ceil(lvl / 2));
        const res = { ...emptyResult };
        for (let t = 1; t <= 10; t++) {
            const isActiveTier = (t === maxTier) || (t === maxTier - 1 && maxTier > 1);
            res[`showLvl${t}`] = isActiveTier;
            res[`lvl${t}Slots`] = isActiveTier ? 2 : 0;
        }
        return res;
    }

    const calcSlots = (minLvl, upLvl) => {
        if (lvl < minLvl) return 0;
        const isUpgraded = lvl >= upLvl;
        if (isPsychic) return isUpgraded ? 2 : 1;
        if (isFourSlotCaster) return isUpgraded ? 4 : 3;
        return isUpgraded ? 3 : 2;
    };

    return {
        showLvl1: true,
        showLvl2: lvl >= 3,
        showLvl3: lvl >= 5,
        showLvl4: lvl >= 7,
        showLvl5: lvl >= 9,
        showLvl6: lvl >= 11,
        showLvl7: lvl >= 13,
        showLvl8: lvl >= 15,
        showLvl9: lvl >= 17,
        showLvl10: lvl >= 19,
        lvl1Slots: calcSlots(1, 2),
        lvl2Slots: calcSlots(3, 4),
        lvl3Slots: calcSlots(5, 6),
        lvl4Slots: calcSlots(7, 8),
        lvl5Slots: calcSlots(9, 10),
        lvl6Slots: calcSlots(11, 12),
        lvl7Slots: calcSlots(13, 14),
        lvl8Slots: calcSlots(15, 16),
        lvl9Slots: calcSlots(17, 18),
        lvl10Slots: lvl >= 20 ? 2 : (lvl >= 19 ? 1 : 0)
    };
}
