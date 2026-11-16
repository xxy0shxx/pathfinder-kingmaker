import { PF2E_CANTRIPS, searchCantrips } from '../../config/cantrips_catalog.js';
import { PF2E_ITEMS_CATALOG, searchItemsCatalog } from '../../config/items_catalog.js';
import { PF2E_ARMOR_CATALOG, searchArmorCatalog } from '../../config/armor_catalog.js';
import { PF2E_ANCESTRIES, PF2E_CLASSES, searchMetaCatalog } from '../../config/meta_catalog.js';
import { PF2E_BACKGROUNDS } from '../../config/backgrounds_catalog.js';
import { PF2E_SPELLS_LVL1, searchSpellsLvl1 } from '../../config/spells_lvl1_catalog.js';
import { PF2E_SPELLS_LVL2, searchSpellsLvl2 } from '../../config/spells_lvl2_catalog.js';
import { PF2E_FOCUS_SPELLS, searchFocusSpells } from '../../config/focus_spells_catalog.js';
import { searchCompanionAbilities, PF2E_COMPANION_ABILITIES } from '../../config/companions_catalog.js';
import { PF2E_HERITAGES } from '../../config/heritages_catalog.js';
import { PF2E_GENERAL_FEATS } from '../../config/general_feats_catalog.js';
import { PF2E_SKILL_FEATS } from '../../config/skill_feats_catalog.js';
import {
    PF2E_RANGER_FEATS, PF2E_CHAMPION_FEATS, PF2E_MONK_FEATS, PF2E_BARD_FEATS,
    PF2E_BARBARIAN_FEATS, PF2E_CLERIC_FEATS, PF2E_SORCERER_FEATS, PF2E_WIZARD_FEATS
} from '../../config/feats_catalog.js';
import {
    PF2E_MELEE_WEAPONS, searchMeleeWeapons, calcMeleeWeaponRoll,
    PF2E_RANGED_WEAPONS, searchRangedWeapons, calcRangedWeaponRoll
} from '../../config/weapons_catalog.js';

export const normalizeStr = (str) => String(str || '')
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E6}-\u{1F1FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}]/gu, '')
    .trim()
    .toLowerCase()
    .replace(/ё/g, 'е');

function bindAutocomplete(inp, dropEl, { getItems, renderOption, onSelect, width = null, maxHeight = '250px', zIndex = '10000150' }) {
    if (!inp) return;
    if (!dropEl) {
        dropEl = document.createElement('div');
        dropEl.className = 'bst-cantrip-dropdown';
        dropEl.style.display = 'none';
        inp.parentNode.appendChild(dropEl);
    }

    const render = (query) => {
        const list = getItems(query);
        if (!list || !list.length) {
            dropEl.style.display = 'none';
            return;
        }

        dropEl.innerHTML = list.map((item, idx) =>
            `<div class="bst-cantrip-opt" data-opt-idx="${idx}" style="padding: 6px; cursor: pointer;">${renderOption(item)}</div>`
        ).join('');

        const rect = inp.getBoundingClientRect();
        dropEl.style.position = 'fixed';
        dropEl.style.left = `${rect.left}px`;
        dropEl.style.width = width ? `${width}px` : `${Math.max(260, rect.width)}px`;
        dropEl.style.maxHeight = maxHeight;
        dropEl.style.overflowY = 'auto';
        dropEl.style.zIndex = zIndex;
        dropEl.style.display = 'block';

        const dropHeight = dropEl.offsetHeight || 220;
        dropEl.style.top = (rect.bottom + dropHeight + 10 > window.innerHeight)
            ? `${Math.max(8, rect.top - dropHeight - 2)}px`
            : `${rect.bottom + 2}px`;

        dropEl.querySelectorAll('.bst-cantrip-opt').forEach(optEl => {
            optEl.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const picked = list[Number(optEl.dataset.optIdx)];
                if (picked) onSelect(picked);
                dropEl.style.display = 'none';
            });
        });
    };

    inp.addEventListener('focus', () => render(inp.value));
    inp.addEventListener('input', () => render(inp.value));
    inp.addEventListener('blur', () => setTimeout(() => { dropEl.style.display = 'none'; }, 150));
}

function getClassFeatsPool(charClassRaw) {
    const cls = normalizeStr(charClassRaw);
    const allClassMaps = [
        [['следопыт', 'рейнджер', 'ranger'], PF2E_RANGER_FEATS],
        [['поборник', 'паладин', 'champion'], PF2E_CHAMPION_FEATS],
        [['монах', 'monk'], PF2E_MONK_FEATS],
        [['бард', 'bard'], PF2E_BARD_FEATS],
        [['варвар', 'barbarian'], PF2E_BARBARIAN_FEATS],
        [['жрец', 'cleric'], PF2E_CLERIC_FEATS],
        [['чародей', 'сорк', 'sorcerer'], PF2E_SORCERER_FEATS],
        [['волшебник', 'маг', 'wizard'], PF2E_WIZARD_FEATS]
    ];

    const matched = allClassMaps.find(([keys]) => keys.some(k => cls.includes(k)));
    const classFeats = matched
        ? (matched[1] || [])
        : allClassMaps.flatMap(([, list]) => list || []);

    return [
        ...classFeats,
        ...(PF2E_GENERAL_FEATS || []),
        ...(PF2E_SKILL_FEATS || [])
    ];
}

export function initPage1Pickers(overlay, hero, onRecalc) {
    // 1. Народ и Класс
    overlay.querySelectorAll('.bst-meta-picker-inp').forEach(inp => {
        const type = inp.dataset.metaType;
        const catalog = type === 'ancestry' ? PF2E_ANCESTRIES : PF2E_CLASSES;
        bindAutocomplete(inp, overlay.querySelector(`[data-meta-drop="${type}"]`), {
            getItems: (q) => searchMetaCatalog(catalog, q),
            renderOption: (x) => `
                <div class="bst-cantrip-opt-top"><b>${x.name}</b></div>
                <div class="bst-cantrip-opt-trad" style="font-size: 11px; white-space: normal; line-height: 1.3; margin-top: 2px; color: #ebd291;">
                    ${type === 'ancestry' ? x.traits : `Характеристика: ${x.keyStat} • ПЗ: +${x.hp}`}
                </div>`,
            onSelect: (found) => {
                inp.value = found.name;
                hero.stats[type === 'ancestry' ? 'ancestry' : 'charClass'] = found.name;
                if (type === 'class') {
                    const hpMaxInp = overlay.querySelector('[data-sheet-num="hpMax"]');
                    const hpCurInp = overlay.querySelector('[data-sheet-num="hpCurrent"]');
                    const conMod = parseInt(overlay.querySelector('[data-sheet-num="con"]')?.value, 10) || 0;
                    if (hpMaxInp && (!hpMaxInp.value || hpMaxInp.value == '10')) {
                        const hp = found.hp + conMod;
                        hpMaxInp.value = hp;
                        if (hpCurInp) hpCurInp.value = hp;
                        hero.stats.hpMax = hp;
                        hero.stats.hpCurrent = hp;
                    }
                }
            }
        });
    });

    // 2. Происхождение
    const bgInp = overlay.querySelector('.bst-background-picker-inp');
    bindAutocomplete(bgInp, overlay.querySelector('[data-bg-drop="1"]'), {
        maxHeight: '280px',
        getItems: (q) => {
            const norm = normalizeStr(q);
            const list = PF2E_BACKGROUNDS || [];
            return norm ? list.filter(b => normalizeStr(b.name).includes(norm)) : list;
        },
        renderOption: (b) => `
            <div class="bst-cantrip-opt-top"><b>${b.name}</b></div>
            <div class="bst-cantrip-opt-trad" style="font-size: 11px; white-space: normal; line-height: 1.3; color: #ebd291; margin-top: 2px;">
                ${b.desc || ''}<br><span style="color:#74b9ff; font-weight: bold;">✨ Бонусная черта навыка: ${b.feat}</span>
            </div>`,
        onSelect: (found) => {
            bgInp.value = found.name;
            hero.stats.background = found.name;
            const skillInp = overlay.querySelector(`[data-sheet-num="prof_${found.skill}"]`);
            if (skillInp) skillInp.value = 2;
            const featInp = overlay.querySelector('[data-sheet-txt="backgroundFeat"]');
            if (featInp && !featInp.value) {
                featInp.value = `📜 ${found.feat}`;
                hero.stats.backgroundFeat = `📜 ${found.feat}`;
            }
            if (onRecalc) onRecalc();
        }
    });

    // 3. Наследие
    const herInp = overlay.querySelector('[data-sheet-txt="heritage"]');
    bindAutocomplete(herInp, herInp?.nextElementSibling, {
        width: 340,
        getItems: (q) => {
            const normQ = normalizeStr(q);
            const curAnc = normalizeStr(overlay.querySelector('[data-sheet-txt="ancestry"]')?.value);
            let scoped = PF2E_HERITAGES || [];
            if (curAnc) {
                scoped = scoped.filter(h => normalizeStr(h.ancestryName) === curAnc || normalizeStr(h.ancestry) === curAnc);
            }
            return normQ ? scoped.filter(h => normalizeStr(h.name).includes(normQ)) : scoped;
        },
        renderOption: (h) => `
            <div class="bst-cantrip-opt-top"><b>${h.name}</b></div>
            <div class="bst-cantrip-opt-trad" style="font-size: 11px; white-space: normal; line-height: 1.3; color: #ebd291; margin-top: 2px;">
                Нация: ${h.ancestryName || 'Общая'} • Источник: ${h.source}<br>${h.desc}
            </div>`,
        onSelect: (found) => {
            herInp.value = found.name;
            hero.stats.heritage = found.name;
        }
    });

    // 4. Броня
    const armorInp = overlay.querySelector('.bst-armor-picker-inp');
    bindAutocomplete(armorInp, overlay.querySelector('[data-armor-drop="1"]'), {
        width: 280,
        getItems: (q) => searchArmorCatalog(q),
        renderOption: (a) => `
            <div class="bst-cantrip-opt-top"><b>${a.name}</b> <span>КБ: +${a.acBonus}</span></div>
            <div class="bst-cantrip-opt-trad" style="font-size:11px;">Группа: ${a.group} • Тр. Сила: ${a.strReq} • Штраф: ${a.penalty}</div>`,
        onSelect: (found) => {
            armorInp.value = found.name;
            hero.stats.armorName = found.name;
            hero.stats.armorType = found.category;
            hero.stats.acItem = found.acBonus;
            hero.stats.acArmorPenalty = found.penalty;

            const typeSel = overlay.querySelector('[data-sheet-txt="armorType"]');
            const itemInp = overlay.querySelector('[data-sheet-num="acItem"]');
            const penaltyInp = overlay.querySelector('[data-sheet-num="acArmorPenalty"]');
            const totalAcInp = overlay.querySelector('[data-sheet-num="ac"]');

            if (typeSel) typeSel.value = found.category;
            if (itemInp) itemInp.value = found.acBonus;
            if (penaltyInp) penaltyInp.value = found.penalty;
            if (totalAcInp) totalAcInp.dataset.currentStrReq = found.strReq;
            if (onRecalc) onRecalc();
        }
    });
    // 5. Оружие (ближнее и дистанционное)
    const getLiveCombatStats = () => ({
        level: parseInt(overlay.querySelector('[data-sheet-num="level"]')?.value, 10) || hero.stats.level || 1,
        str: parseInt(overlay.querySelector('[data-sheet-num="str"]')?.value, 10) || 0,
        dex: parseInt(overlay.querySelector('[data-sheet-num="dex"]')?.value, 10) || 0
    });

    const applyWeapon = (slot, found, calcFn) => {
        const { atkStr, dmgStr } = calcFn(found, getLiveCombatStats());
        const setField = (suffix, val) => {
            const el = overlay.querySelector(`[data-sheet-txt="${slot}${suffix}"]`);
            if (el) el.value = val;
            hero.stats[`${slot}${suffix}`] = val;
        };
        setField('Name', found.name);
        setField('Atk', atkStr);
        setField('Dmg', dmgStr);
        setField('Traits', found.traits);
    };

    overlay.querySelectorAll('.bst-weapon-picker-inp').forEach(inp => {
        const slot = inp.dataset.weaponSlot;
        bindAutocomplete(inp, overlay.querySelector(`[data-weapon-drop="${slot}"]`), {
            width: 360,
            getItems: (q) => searchMeleeWeapons(q),
            renderOption: (w) => `
                <div class="bst-cantrip-opt-top"><b>${w.name}</b> <span>${w.dmgDice} ${w.dmgType}</span></div>
                <div class="bst-cantrip-opt-trad">${w.category} • ${w.group}</div>`,
            onSelect: (found) => applyWeapon(slot, found, calcMeleeWeaponRoll)
        });
    });

    const rangedInp = overlay.querySelector('.bst-ranged-picker-inp');
    bindAutocomplete(rangedInp, overlay.querySelector('[data-ranged-drop="1"]'), {
        width: 360,
        getItems: (q) => searchRangedWeapons(q),
        renderOption: (w) => `<div class="bst-cantrip-opt-top"><b>${w.name}</b> <span>${w.dmgDice}</span></div>`,
        onSelect: (found) => applyWeapon('ranged', found, calcRangedWeaponRoll)
    });

    // 6. Боевые черты по уровням
    overlay.querySelectorAll('.bst-ranger-feat-picker-inp').forEach(inp => {
        const lvl = parseInt(inp.dataset.featLevel, 10);
        const descInp = overlay.querySelector(`[data-sheet-txt="classFeatLvl${lvl}Desc"]`);
        bindAutocomplete(inp, overlay.querySelector(`[data-feat-drop="${lvl}"]`), {
            width: 420,
            zIndex: '10000160',
            getItems: (q) => {
                const normQ = normalizeStr(q);
                return getClassFeatsPool(hero.stats.charClass).filter(f => f.level <= lvl && normalizeStr(f.name).includes(normQ));
            },
            renderOption: (f) => `
                <div class="bst-cantrip-opt-top"><b>${f.name}</b> <span style="color: #2ecc71;">[Ур. ${f.level}] ${f.actions && f.actions !== '-' ? `(${f.actions})` : ''}</span></div>
                <div class="bst-cantrip-opt-trad" style="font-size: 11px; white-space: normal; line-height: 1.3; color: #ebd291; margin-top: 2px;">Источник: ${f.source}<br>${f.desc}</div>`,
            onSelect: (found) => {
                inp.value = found.name;
                hero.stats[`classFeatLvl${lvl}Name`] = found.name;
                const shortDesc = `${found.actions && found.actions !== '-' ? `[${found.actions}] ` : ''}${found.desc}`;
                if (descInp) descInp.value = shortDesc;
                hero.stats[`classFeatLvl${lvl}Desc`] = shortDesc;
            }
        });
    });
}

export function initPage2Pickers(overlay, hero) {
    // 1. Фокальные заклинания (с фильтром по классу)
    overlay.querySelectorAll('.bst-focus-picker-inp').forEach(inp => {
        const row = inp.dataset.focusRow;
        bindAutocomplete(inp, overlay.querySelector(`[data-focus-drop="${row}"]`), {
            width: 380,
            getItems: (q) => {
                let list = searchFocusSpells(q);
                const cls = normalizeStr(hero.stats.charClass);
                const classKeywords = ['жрец', 'следопыт', 'поборник', 'бард', 'друид', 'монах', 'чародей', 'волшебник', 'ведьма', 'оракул', 'анимист'];
                const matchedKey = classKeywords.find(k => cls.includes(k));
                if (matchedKey) list = list.filter(f => normalizeStr(f.source).includes(matchedKey));
                return list;
            },
            renderOption: (f) => `
                <div class="bst-cantrip-opt-top"><b>${f.name}</b> <span>${f.actions}</span></div>
                <div class="bst-cantrip-opt-trad" style="font-size: 11px; white-space: normal; color: #ebd291; margin-top: 2px;">${f.source}<br>${f.notes}</div>`,
            onSelect: (found) => {
                inp.value = found.name;
                hero.stats[`focusSpell${row}Name`] = found.name;
                const actInp = overlay.querySelector(`[data-sheet-txt="focusSpell${row}Actions"]`);
                const noteInp = overlay.querySelector(`[data-sheet-txt="focusSpell${row}Notes"]`);
                if (actInp) actInp.value = found.actions;
                if (noteInp) noteInp.value = found.notes;
                hero.stats[`focusSpell${row}Actions`] = found.actions;
                hero.stats[`focusSpell${row}Notes`] = found.notes;
            }
        });
    });

    // 2. Фокусы, 1-й круг и 2-й круг
    const spellTiers = [
        { selector: '.bst-cantrip-picker-inp', rowAttr: 'cantripRow', dropAttr: 'data-cantrip-drop', prefix: 'cantrip', searchFn: searchCantrips },
        { selector: '.bst-lvl1-picker-inp', rowAttr: 'lvl1Row', dropAttr: 'data-lvl1-drop', prefix: 'lvl1Spell', searchFn: searchSpellsLvl1 },
        { selector: '.bst-lvl2-picker-inp', rowAttr: 'lvl2Row', dropAttr: 'data-lvl2-drop', prefix: 'lvl2Spell', searchFn: searchSpellsLvl2 }
    ];

    spellTiers.forEach(({ selector, rowAttr, dropAttr, prefix, searchFn }) => {
        overlay.querySelectorAll(selector).forEach(inp => {
            const row = inp.dataset[rowAttr];
            bindAutocomplete(inp, overlay.querySelector(`[${dropAttr}="${row}"]`), {
                width: 340,
                getItems: (q) => searchFn(q),
                renderOption: (s) => `
                    <div class="bst-cantrip-opt-top"><b>${s.name}</b> <span>${s.actions}</span></div>
                    <div class="bst-cantrip-opt-trad">${s.traditions.join(', ')}</div>`,
                onSelect: (found) => {
                    inp.value = found.name;
                    hero.stats[`${prefix}${row}Name`] = found.name;
                    const actInp = overlay.querySelector(`[data-sheet-txt="${prefix}${row}Actions"]`);
                    const noteInp = overlay.querySelector(`[data-sheet-txt="${prefix}${row}Notes"]`);
                    if (actInp) actInp.value = found.actions;
                    if (noteInp) noteInp.value = found.notes;
                    hero.stats[`${prefix}${row}Actions`] = found.actions;
                    hero.stats[`${prefix}${row}Notes`] = found.notes;
                }
            });
        });
    });

    // 3. Предметы и степперы количества
    overlay.querySelectorAll('.bst-item-picker-inp').forEach(inp => {
        const row = inp.dataset.itemRow;
        bindAutocomplete(inp, overlay.querySelector(`[data-item-drop="${row}"]`), {
            width: 360,
            getItems: (q) => searchItemsCatalog(q),
            renderOption: (it) => `<div class="bst-cantrip-opt-top"><b>${it.name}</b> <span>${it.category}</span></div>`,
            onSelect: (found) => {
                inp.value = found.name;
                const qtyInp = overlay.querySelector(`[data-sheet-num="item${row}Qty"]`);
                const noteInp = overlay.querySelector(`[data-sheet-txt="item${row}Notes"]`);
                if (qtyInp && (!qtyInp.value || Number(qtyInp.value) <= 0)) qtyInp.value = 1;
                if (noteInp) noteInp.value = found.notes;
            }
        });
    });

    overlay.querySelectorAll('.bst-qty-stepper').forEach(stepper => {
        const qtyInp = stepper.querySelector('.bst-qty-inp');
        if (!qtyInp) return;
        stepper.querySelectorAll('.bst-qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const delta = parseInt(btn.dataset.qtyDelta, 10) || 0;
                qtyInp.value = Math.max(0, (parseInt(qtyInp.value, 10) || 0) + delta);
            });
        });
    });

    // 4. Способности спутников
    const compInp = overlay.querySelector('.bst-comp-ability-picker');
    const typeSel = overlay.querySelector('.bst-comp-type-selector');
    const textOut = overlay.querySelector('[data-sheet-txt="compAbilitiesText"]');

    bindAutocomplete(compInp, overlay.querySelector('[data-comp-drop="1"]'), {
        width: 400,
        getItems: (q) => searchCompanionAbilities(q, typeSel ? typeSel.value : 'all'),
        renderOption: (a) => `
            <div class="bst-cantrip-opt-top"><b>${a.name}</b></div>
            <div class="bst-cantrip-opt-trad" style="font-size: 11px; white-space: normal; line-height: 1.3; margin-top: 2px; color: #ebd291;">${a.desc}</div>`,
        onSelect: (found) => {
            if (textOut && !textOut.value.includes(found.name)) {
                textOut.value = (textOut.value.trim() ? `${textOut.value.trim()}\n` : '') + `• ${found.name}: ${found.desc}`;
                hero.stats.compAbilitiesText = textOut.value;
            }
            compInp.value = '';
        }
    });

    if (typeSel && compInp) {
        typeSel.addEventListener('change', () => { compInp.value = ''; });
    }
}
