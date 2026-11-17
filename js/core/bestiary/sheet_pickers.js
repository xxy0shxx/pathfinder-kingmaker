import { PF2E_CANTRIPS, searchCantrips } from '../../config/cantrips_catalog.js';
import { PF2E_ITEMS_CATALOG, searchItemsCatalog, getItemLevel } from '../../config/items_catalog.js';
import { PF2E_ARMOR_CATALOG, searchArmorCatalog } from '../../config/armor_catalog.js';
import { PF2E_ANCESTRIES, PF2E_CLASSES, searchMetaCatalog } from '../../config/meta_catalog.js';
import { PF2E_BACKGROUNDS } from '../../config/backgrounds_catalog.js';
import { PF2E_SPELLS_LVL1, searchSpellsLvl1 } from '../../config/spells_lvl1_catalog.js';
import { PF2E_SPELLS_LVL2, searchSpellsLvl2 } from '../../config/spells_lvl2_catalog.js';
import { PF2E_SPELLS_LVL3, searchSpellsLvl3 } from '../../config/spells_lvl3_catalog.js';
import { PF2E_SPELLS_LVL4, searchSpellsLvl4 } from '../../config/spells_lvl4_catalog.js';
import { PF2E_FOCUS_SPELLS, searchFocusSpells } from '../../config/focus_spells_catalog.js';
import { searchCompanionAbilities, PF2E_COMPANION_ABILITIES, calcCompanionStats } from '../../config/companions_catalog.js';
import { searchActionsCatalog } from '../../config/actions_catalog.js';
import { PF2E_HERITAGES } from '../../config/heritages_catalog.js';
import { PF2E_GENERAL_FEATS } from '../../config/general_feats_catalog.js';
import { PF2E_SKILL_FEATS } from '../../config/skill_feats_catalog.js';
import {
    PF2E_RANGER_FEATS, PF2E_CHAMPION_FEATS, PF2E_MONK_FEATS, PF2E_BARD_FEATS,
    PF2E_BARBARIAN_FEATS, PF2E_CLERIC_FEATS, PF2E_SORCERER_FEATS, PF2E_WIZARD_FEATS,
    PF2E_FIGHTER_FEATS, PF2E_ROGUE_FEATS, PF2E_DRUID_FEATS, PF2E_MAGUS_FEATS,
    PF2E_WITCH_FEATS
} from '../../config/feats_catalog.js';
import {
    PF2E_MELEE_WEAPONS, searchMeleeWeapons, calcMeleeWeaponRoll,
    PF2E_RANGED_WEAPONS, searchRangedWeapons, calcRangedWeaponRoll
} from '../../config/weapons_catalog.js';

export const normalizeStr = (str) => String(str || '')
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\uFE0F\u200D]/gu, '')
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
            const pickItem = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (optEl.dataset.pickedDone) return;
                optEl.dataset.pickedDone = '1';
                const picked = list[Number(optEl.dataset.optIdx)];
                if (picked) onSelect(picked);
                dropEl.style.display = 'none';
            };
            optEl.addEventListener('mousedown', pickItem);
            optEl.addEventListener('click', pickItem);
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
        [['жрец', 'клирик', 'клерик', 'cleric'], PF2E_CLERIC_FEATS],
        [['чародей', 'сорк', 'sorcerer'], PF2E_SORCERER_FEATS],
        [['волшебник', 'маг', 'wizard'], PF2E_WIZARD_FEATS],
        [['воин', 'fighter'], PF2E_FIGHTER_FEATS],
        [['плут', 'rogue'], PF2E_ROGUE_FEATS],
        [['друид', 'druid'], PF2E_DRUID_FEATS],
        [['ведьма', 'witch'], PF2E_WITCH_FEATS]
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


    // 6. Классовые черты по уровням
    overlay.querySelectorAll('.bst-ranger-feat-picker-inp').forEach(inp => {
        const lvl = parseInt(inp.dataset.featLevel, 10);
        const descInp = overlay.querySelector(`[data-sheet-txt="classFeatLvl${lvl}Desc"]`);
        bindAutocomplete(inp, overlay.querySelector(`[data-feat-drop="class_${lvl}"]`), {
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

    // 7. Общие черты, Черты навыков и Черты народа
    overlay.querySelectorAll('.bst-extra-feat-picker-inp').forEach(inp => {
        const lvl = parseInt(inp.dataset.featLevel, 10);
        const kind = inp.dataset.featKind;
        const prefixMap = { general: 'genFeatLvl', skill: 'skillFeatLvl', ancestry: 'ancFeatLvl' };
        const prefix = prefixMap[kind];
        const descInp = overlay.querySelector(`[data-sheet-txt="${prefix}${lvl}Desc"]`);

        bindAutocomplete(inp, overlay.querySelector(`[data-feat-drop="${kind}_${lvl}"]`), {
            width: 420,
            zIndex: '10000160',
            getItems: (q) => {
                const normQ = normalizeStr(q);
                let pool = [];
                if (kind === 'general') {
                    pool = [...(PF2E_GENERAL_FEATS || []), ...(PF2E_SKILL_FEATS || [])];
                } else if (kind === 'skill') {
                    pool = PF2E_SKILL_FEATS || [];
                } else if (kind === 'ancestry') {
                    const curAnc = normalizeStr(overlay.querySelector('[data-sheet-txt="ancestry"]')?.value);
                    pool = (PF2E_HERITAGES || []).filter(h => !curAnc || normalizeStr(h.ancestryName) === curAnc || normalizeStr(h.ancestry) === curAnc || h.ancestry === 'versatile');
                }
                return pool.filter(f => (f.level || 1) <= lvl && normalizeStr(f.name).includes(normQ));
            },
            renderOption: (f) => `
                <div class="bst-cantrip-opt-top"><b>${f.name}</b> <span style="color: #74b9ff;">${f.level ? `[Ур. ${f.level}]` : ''} ${f.skillName ? `[${f.skillName}]` : ''}</span></div>
                <div class="bst-cantrip-opt-trad" style="font-size: 11px; white-space: normal; line-height: 1.3; color: #ebd291; margin-top: 2px;">${f.desc}</div>`,
            onSelect: (found) => {
                inp.value = found.name;
                hero.stats[`${prefix}${lvl}Name`] = found.name;
                const shortDesc = `${found.actions && found.actions !== '-' ? `[${found.actions}] ` : ''}${found.desc}`;
                if (descInp) descInp.value = shortDesc;
                hero.stats[`${prefix}${lvl}Desc`] = shortDesc;
            }
        });
    });



    // Выпадающий список для 3 ячеек действий (с приоритетом действий класса персонажа)
    const getActionClassTag = (charClassRaw) => {
        const cls = normalizeStr(charClassRaw);
        if (!cls) return '';
        const classAliases = [
            { keys: ['монах', 'monk'], tag: 'монах' },
            { keys: ['следопыт', 'рейнджер', 'ranger'], tag: 'следопыт' },
            { keys: ['варвар', 'barbarian'], tag: 'варвар' },
            { keys: ['следователь', 'investigator'], tag: 'следователь' },
            { keys: ['тауматург', 'thaumaturge'], tag: 'тауматург' },
            { keys: ['сорвиголова', 'swashbuckler'], tag: 'сорвиголова' },
            { keys: ['воин', 'fighter'], tag: 'воин' },
            { keys: ['плут', 'rogue'], tag: 'плут' },
            { keys: ['поборник', 'паладин', 'champion'], tag: 'поборник' },
            { keys: ['бард', 'bard'], tag: 'бард' }
        ];
        const matched = classAliases.find(c => c.keys.some(k => cls.includes(k)));
        return matched ? matched.tag : cls;
    };

    overlay.querySelectorAll('.bst-action-picker-inp').forEach(inp => {
        const idx = inp.dataset.actionIdx;
        bindAutocomplete(inp, overlay.querySelector(`[data-action-drop="${idx}"]`), {
            width: 360,
            getItems: (q) => {
                const list = searchActionsCatalog(q);
                const classTag = getActionClassTag(hero.stats.charClass);
                const normQ = normalizeStr(q);

                return [...list].sort((a, b) => {
                    // 1. Приоритет: совпадение запроса в самом названии действия
                    if (normQ) {
                        const aTitle = normalizeStr(a.name).includes(normQ) ? 0 : 1;
                        const bTitle = normalizeStr(b.name).includes(normQ) ? 0 : 1;
                        if (aTitle !== bTitle) return aTitle - bTitle;
                    }

                    // 2. Приоритет: классовые действия текущего персонажа на самом верху
                    const getRank = (item) => {
                        if (classTag && item.className && normalizeStr(item.className).includes(classTag)) return 0;
                        if (item.category === 'skill') return 1;
                        if (item.category === 'basic') return 2;
                        return 3;
                    };

                    return getRank(a) - getRank(b);
                });
            },
            renderOption: (a) => {
                const badge = a.className
                    ? `<span style="color:#ffd875; font-weight:bold;">[${a.className}]</span> `
                    : (a.skillName ? `<span style="color:#74b9ff; font-weight:bold;">[${a.skillName}]</span> ` : '');
                return `
                    <div class="bst-cantrip-opt-top"><b>${a.name}</b> <span>${a.actions}</span></div>
                    <div class="bst-cantrip-opt-trad" style="font-size: 11px; white-space: normal; color: #ebd291; margin-top: 2px;">${badge}${a.traits}<br>${a.desc}</div>`;
            },
            onSelect: (found) => {
                inp.value = found.name;
                hero.stats[`actionSlot${idx}Name`] = found.name;
                const tagInfo = found.className || found.skillName || found.traits;
                const descText = `${found.actions} (${tagInfo}): ${found.desc}`;
                const descInp = overlay.querySelector(`[data-sheet-txt="actionSlot${idx}Desc"]`);
                if (descInp) descInp.value = descText;
                hero.stats[`actionSlot${idx}Desc`] = descText;
            }
        });
    });

}


export function initPage2Pickers(overlay, hero) {

    // 1. Фокальные заклинания (с умным фильтром по классу и сортировкой по релевантности)
    overlay.querySelectorAll('.bst-focus-picker-inp').forEach(inp => {
        const row = inp.dataset.focusRow;
        bindAutocomplete(inp, overlay.querySelector(`[data-focus-drop="${row}"]`), {
            width: 380,
            getItems: (q) => {
                let list = searchFocusSpells(q);
                const cls = normalizeStr(hero.stats.charClass);
                const classAliases = [
                    { keys: ['жрец', 'клирик', 'клерик', 'cleric'], tag: 'жрец' },
                    { keys: ['следопыт', 'рейнджер', 'ranger'], tag: 'следопыт' },
                    { keys: ['поборник', 'паладин', 'champion'], tag: 'поборник' },
                    { keys: ['бард', 'bard'], tag: 'бард' },
                    { keys: ['друид', 'druid'], tag: 'друид' },
                    { keys: ['монах', 'monk'], tag: 'монах' },
                    { keys: ['чародей', 'сорк', 'sorcerer'], tag: 'чародей' },
                    { keys: ['волшебник', 'маг', 'wizard'], tag: 'волшебник' },
                    { keys: ['ведьма', 'witch'], tag: 'ведьма' },
                    { keys: ['оракул', 'oracle'], tag: 'оракул' },
                    { keys: ['анимист', 'animist'], tag: 'анимист' },
                    { keys: ['колдун', 'магус', 'magus'], tag: 'колдун' },
                    { keys: ['призыватель', 'summoner'], tag: 'призыватель' },
                    { keys: ['экстрасенс', 'псионик', 'psychic'], tag: 'экстрасенс' },
                    { keys: ['некромант', 'necromancer'], tag: 'некромант' }
                ];
                const matched = classAliases.find(c => c.keys.some(k => cls.includes(k)));
                if (matched) {
                    list = list.filter(f => normalizeStr(f.source).includes(matched.tag));
                }

                // Сортируем: сначала те, где запрос совпадает с названием заклинания
                const normQ = normalizeStr(q);
                if (normQ) {
                    list = [...list].sort((a, b) => {
                        const aTitle = normalizeStr(a.name).includes(normQ) ? 0 : 1;
                        const bTitle = normalizeStr(b.name).includes(normQ) ? 0 : 1;
                        return aTitle - bTitle;
                    });
                }
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

    // 2. Фокусы, 1-й круг и 2-й круг (с умной фильтрацией по традиции класса)
    const getClassTraditionFilter = (charClassRaw) => {
        const cls = normalizeStr(charClassRaw);
        if (!cls) return null;

        const traditionMap = [
            { keys: ['волшебник', 'маг', 'wizard', 'колдун', 'магус', 'magus'], trad: 'Мистическая' },
            { keys: ['жрец', 'клирик', 'клерик', 'cleric', 'оракул', 'oracle', 'поборник', 'паладин', 'champion'], trad: 'Сакральная' },
            { keys: ['друид', 'druid', 'следопыт', 'рейнджер', 'ranger'], trad: 'Первобытная' },
            { keys: ['бард', 'bard', 'экстрасенс', 'псионик', 'psychic', 'некромант', 'necromancer'], trad: 'Оккультная' }
            // Для Чародея, Ведьмы, Призывателя и Анимиста традиция зависит от наследия/покровителя/эйдолона — показываем все традиции
        ];

        const found = traditionMap.find(item => item.keys.some(k => cls.includes(k)));
        return found ? found.trad : null;
    };

    const spellTiers = [
        { selector: '.bst-cantrip-picker-inp', rowAttr: 'cantripRow', dropAttr: 'data-cantrip-drop', prefix: 'cantrip', searchFn: searchCantrips },
        { selector: '.bst-lvl1-picker-inp', rowAttr: 'lvl1Row', dropAttr: 'data-lvl1-drop', prefix: 'lvl1Spell', searchFn: searchSpellsLvl1 },
        { selector: '.bst-lvl2-picker-inp', rowAttr: 'lvl2Row', dropAttr: 'data-lvl2-drop', prefix: 'lvl2Spell', searchFn: searchSpellsLvl2 },
        { selector: '.bst-lvl3-picker-inp', rowAttr: 'lvl3Row', dropAttr: 'data-lvl3-drop', prefix: 'lvl3Spell', searchFn: searchSpellsLvl3 },
        { selector: '.bst-lvl4-picker-inp', rowAttr: 'lvl4Row', dropAttr: 'data-lvl4-drop', prefix: 'lvl4Spell', searchFn: searchSpellsLvl4 }
    ];

    spellTiers.forEach(({ selector, rowAttr, dropAttr, prefix, searchFn }) => {
        overlay.querySelectorAll(selector).forEach(inp => {
            const row = inp.dataset[rowAttr];
            bindAutocomplete(inp, overlay.querySelector(`[${dropAttr}="${row}"]`), {
                width: 360,
                getItems: (q) => {
                    let list = searchFn(q);
                    const classTrad = getClassTraditionFilter(hero.stats.charClass);

                    // Если у класса фиксированная традиция — фильтруем по ней, но если совпадений нет (например, заклинание из архетипа), показываем общий поиск
                    if (classTrad) {
                        const filtered = list.filter(s =>
                            Array.isArray(s.traditions) &&
                            s.traditions.some(t => normalizeStr(t).includes(normalizeStr(classTrad)))
                        );
                        if (filtered.length > 0) {
                            list = filtered;
                        }
                    }

                    // Поднимаем совпадения по названию наверх списка
                    const normQ = normalizeStr(q);
                    if (normQ) {
                        list = [...list].sort((a, b) => {
                            const aTitle = normalizeStr(a.name).includes(normQ) ? 0 : 1;
                            const bTitle = normalizeStr(b.name).includes(normQ) ? 0 : 1;
                            return aTitle - bTitle;
                        });
                    }
                    return list;
                },
                renderOption: (s) => `
                    <div class="bst-cantrip-opt-top"><b>${s.name}</b> <span>${s.actions}</span></div>
                    <div class="bst-cantrip-opt-trad" style="font-size: 11px; white-space: normal; color: #ebd291; margin-top: 2px;">
                        <span style="color:#74b9ff;">${s.traditions.join(', ')}</span><br>${s.notes}
                    </div>`,
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





    // 3. Предметы, щиты и степперы количества (выбор строго из каталога)
    overlay.querySelectorAll('.bst-item-picker-inp').forEach(inp => {
        const row = inp.dataset.itemRow;
        inp.dataset.validItem = inp.value || '';

        bindAutocomplete(inp, overlay.querySelector(`[data-item-drop="${row}"]`), {
            width: 360,
            zIndex: '10000180',
            getItems: (q) => searchItemsCatalog(q),
            renderOption: (it) => `<div class="bst-cantrip-opt-top"><b>${it.name}</b> <span>${it.category}</span></div>`,
            onSelect: (found) => {
                const qtyInp = overlay.querySelector(`[data-sheet-num="item${row}Qty"]`);
                const noteInp = overlay.querySelector(`[data-sheet-txt="item${row}Notes"]`);

                // Проверяем, есть ли уже такой же предмет в другой ячейке рюкзака — если да, стакаем в него
                const normFoundName = normalizeStr(found.name);
                let existingRow = null;
                for (let r = 1; r <= 15; r++) {
                    if (String(r) === String(row)) continue;
                    const otherName = normalizeStr(hero.stats[`item${r}Name`]);
                    if (otherName && otherName === normFoundName) {
                        existingRow = r;
                        break;
                    }
                }

                if (existingRow !== null) {
                    const prevQty = Math.max(0, Number(hero.stats[`item${existingRow}Qty`]) || 0);
                    const nextQty = prevQty + 1;
                    hero.stats[`item${existingRow}Qty`] = nextQty;

                    const targetQtyInp = overlay.querySelector(`[data-sheet-num="item${existingRow}Qty"]`);
                    if (targetQtyInp) {
                        targetQtyInp.value = nextQty;
                        targetQtyInp.dispatchEvent(new Event('input', { bubbles: true }));
                    }

                    inp.value = '';
                    inp.dataset.validItem = '';
                    hero.stats[`item${row}Name`] = '';
                    if (qtyInp) { qtyInp.value = 0; hero.stats[`item${row}Qty`] = 0; }
                    if (noteInp) { noteInp.value = ''; hero.stats[`item${row}Notes`] = ''; }
                    return;
                }

                // Записываем выбранный предмет в текущую строку
                inp.value = found.name;
                inp.dataset.validItem = found.name;
                hero.stats[`item${row}Name`] = found.name;

                if (qtyInp && (!qtyInp.value || Number(qtyInp.value) <= 0)) {
                    qtyInp.value = 1;
                    hero.stats[`item${row}Qty`] = 1;
                }

                const heroLvl = Math.max(1, parseInt(hero.stats.level, 10) || 1);
                const itemLvl = getItemLevel(found);
                const isLevelLocked = itemLvl > heroLvl;

                if (noteInp) {
                    const finalNote = isLevelLocked
                        ? `⚠️ [Требуется ${itemLvl} ур. — бонусы неактивны] ${found.notes}`
                        : found.notes;
                    noteInp.value = finalNote;
                    hero.stats[`item${row}Notes`] = finalNote;
                }

                if (isLevelLocked) {
                    if (qtyInp) qtyInp.dispatchEvent(new Event('input', { bubbles: true }));
                    return;
                }

                if (found.shieldStats) {
                    hero.stats.acShieldBonus = found.shieldStats.bonus;
                    hero.stats.acShieldHardness = found.shieldStats.hardness;
                    hero.stats.acShieldHp = found.shieldStats.hp;
                }

                if (found.runeEffect) {
                    const eff = found.runeEffect;
                    if (eff.target === 'weapon') {
                        const slot = ['melee1', 'melee2', 'ranged'].find(s => String(hero.stats[`${s}Name`] || '').trim()) || 'melee1';
                        if (eff.potency) {
                            const curAtk = parseInt(String(hero.stats[`${slot}Atk`] || '0').replace(/[^\d+-]/g, ''), 10) || 0;
                            const nextAtk = curAtk + eff.potency;
                            hero.stats[`${slot}Atk`] = nextAtk >= 0 ? `+${nextAtk}` : `${nextAtk}`;
                            const wName = String(hero.stats[`${slot}Name`] || '').trim();
                            if (wName && !/^\+\d/.test(wName)) {
                                hero.stats[`${slot}Name`] = `+${eff.potency} ${wName}`;
                            }
                        }
                        if (eff.striking) {
                            const curDmg = String(hero.stats[`${slot}Dmg`] || '').trim();
                            if (curDmg) {
                                hero.stats[`${slot}Dmg`] = curDmg.replace(/^\d+(d\d+)/i, `${eff.striking}$1`);
                            }
                            const wName = String(hero.stats[`${slot}Name`] || '').trim();
                            if (wName && !wName.toLowerCase().includes('разящ')) {
                                hero.stats[`${slot}Name`] = `${wName} (Разящее)`;
                            }
                        }
                        if (eff.extraDmg) {
                            const curDmg = String(hero.stats[`${slot}Dmg`] || '').trim();
                            if (curDmg && !curDmg.includes(eff.extraDmg)) {
                                hero.stats[`${slot}Dmg`] = `${curDmg} ${eff.extraDmg}`;
                            }
                        }
                        if (eff.extraTrait) {
                            const curTraits = String(hero.stats[`${slot}Traits`] || '').trim();
                            if (!curTraits.includes(eff.extraTrait)) {
                                hero.stats[`${slot}Traits`] = curTraits ? `${curTraits}, ${eff.extraTrait}` : eff.extraTrait;
                            }
                        }
                    } else if (eff.target === 'armor') {
                        if (eff.potency) {
                            const baseArmor = (PF2E_ARMOR_CATALOG || []).find(a => normalizeStr(a.name) === normalizeStr(hero.stats.armorName));
                            const baseBonus = baseArmor ? (Number(baseArmor.acBonus) || 0) : (Number(hero.stats.acItem) || 0);
                            hero.stats.acItem = baseBonus + eff.potency;
                            const aName = String(hero.stats.armorName || '').trim();
                            if (aName && !/^\+\d/.test(aName)) {
                                hero.stats.armorName = `+${eff.potency} ${aName}`;
                            }
                        }
                        if (eff.noteTag) {
                            const aName = String(hero.stats.armorName || '').trim();
                            if (aName && !aName.includes(eff.noteTag)) {
                                hero.stats.armorName = `${aName} [${eff.noteTag}]`;
                            }
                        }
                    } else if (eff.target === 'save' && eff.bonus) {
                        hero.stats.saveItemBonus = eff.bonus;
                    }
                }

                if (found.skillBonus && found.skillBonus.skill) {
                    if (!hero.stats.skillItemBonuses || typeof hero.stats.skillItemBonuses !== 'object') {
                        hero.stats.skillItemBonuses = {};
                    }
                    const sk = found.skillBonus.skill;
                    const curB = Number(hero.stats.skillItemBonuses[sk]) || 0;
                    hero.stats.skillItemBonuses[sk] = Math.max(curB, Number(found.skillBonus.bonus) || 0);
                }

                if (qtyInp) qtyInp.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });

        // При выходе из поля с невалидным (произвольным) текстом возвращаем последнее выбранное значение
        inp.addEventListener('change', () => {
            const cur = String(inp.value || '').trim();
            if (!cur) {
                inp.dataset.validItem = '';
                return;
            }
            const isValid = (PF2E_ITEMS_CATALOG || []).some(it => normalizeStr(it.name) === normalizeStr(cur));
            if (isValid) {
                inp.dataset.validItem = cur;
            } else {
                inp.value = inp.dataset.validItem || '';
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

    // Кнопка удаления позиции (🗑️) в каждой строке рюкзака
    overlay.querySelectorAll('.bst-item-clear-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const row = btn.dataset.itemClear;

            const nameInp = overlay.querySelector(`[data-sheet-txt="item${row}Name"]`);
            const qtyInp = overlay.querySelector(`[data-sheet-num="item${row}Qty"]`);
            const noteInp = overlay.querySelector(`[data-sheet-txt="item${row}Notes"]`);

            hero.stats[`item${row}Name`] = '';
            hero.stats[`item${row}Qty`] = 0;
            hero.stats[`item${row}Notes`] = '';

            if (nameInp) {
                nameInp.value = '';
                nameInp.dataset.validItem = '';
            }
            if (noteInp) noteInp.value = '';
            if (qtyInp) {
                qtyInp.value = 0;
                qtyInp.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
    });


    // 4. Способности и виды спутников (единое поведение для зверей и фамильяров)
    const compInp = overlay.querySelector('.bst-comp-ability-picker');
    const typeSel = overlay.querySelector('.bst-comp-type-selector');
    const hiddenTextInp = overlay.querySelector('[data-sheet-txt="compAbilitiesText"]');
    const infoBox = overlay.querySelector('#bstCompInfoBox');

    const updateCompInfo = (text) => {
        hero.stats.compAbilitiesText = text;
        if (hiddenTextInp) hiddenTextInp.value = text;
        if (infoBox) {
            infoBox.innerHTML = text
                ? text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
                : '<span style="color: #7f8c8d;">Спутник не выбран. Выберите тип и найдите зверя или способность в поиске выше.</span>';
        }
    };

    const setCompNum = (key, val) => {
        const numVal = Number(val) || 0;
        hero.stats[key] = numVal;
        const el = overlay.querySelector(`[data-sheet-num="${key}"]`);
        if (el) {
            el.value = String(numVal);
            el.setAttribute('value', String(numVal));
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        }
    };

    const setCompName = (newName, force = false) => {
        const nameInp = overlay.querySelector('[data-sheet-txt="compName"]');
        const curVal = (nameInp ? nameInp.value : hero.stats.compName || '').trim();
        if (force || !curVal || curVal === 'Фамильяр') {
            if (nameInp) {
                nameInp.value = newName;
                nameInp.setAttribute('value', newName);
            }
            hero.stats.compName = newName;
        }
    };

    // Убирает эмодзи в начале и пометки в скобках вроде "(Фамильяр)" или "(Особ., 5 спос.)"
    const cleanSpeciesName = (str) => String(str || '')
        .replace(/^[^\p{L}\p{N}]+/u, '')
        .replace(/\s*\((?:Фамильяр|Особ\.[^)]*|\d+\+\s*ур\.)\)\s*$/i, '')
        .trim();

    const buildBeastFormulaHint = (species, lvl, totalHp, totalAc, extraHp = 0, extraAc = 0) => {
        const con = species.con || 0;
        const dex = species.dex || 0;
        const hpPerLvl = 6 + con;
        const profVal = species.acProf || 2;
        const hpExtraStr = extraHp > 0 ? ` + ${extraHp} (опция)` : '';
        const acExtraStr = extraAc > 0 ? ` + ${extraAc} (опция)` : '';

        return `📊 Расчёт (${lvl} ур.): ПЗ = ${species.hpBase} (вид) + ${hpPerLvl} (6 + ${con} ВЫН) × ${lvl} ур.${hpExtraStr} = ${totalHp} | КБ = 10 + ${dex} ЛВК + ${lvl} ур. + ${profVal} ум.${acExtraStr} = ${totalAc}`;
    };

    bindAutocomplete(compInp, overlay.querySelector('[data-comp-drop="1"]'), {
        width: 420,
        getItems: (q) => searchCompanionAbilities(q, typeSel ? typeSel.value : 'all'),
        renderOption: (a) => `
            <div class="bst-cantrip-opt-top"><b>${a.name}</b></div>
            <div class="bst-cantrip-opt-trad" style="font-size: 11px; white-space: normal; line-height: 1.3; margin-top: 2px; color: #ebd291;">${a.desc}</div>`,
        onSelect: (found) => {
            const lvl = Math.max(1, parseInt(hero.stats.level, 10) || 1);

            const isBeastSpecies = found.type === 'companion' &&
                !found.id.startsWith('comp_opt_') &&
                !found.id.startsWith('comp_spec_');

            // 1. Выбран вид Верного зверя
            if (isBeastSpecies) {
                hero.stats.compSpeciesId = found.id;
                if (typeSel) {
                    typeSel.value = 'companion';
                    hero.stats.compType = 'companion';
                }

                const calc = calcCompanionStats(found, lvl) || { hpMax: 6 + 7 * lvl, hpCur: 6 + 7 * lvl, ac: 14 + lvl, speed: 25 };

                setCompNum('compHpMax', calc.hpMax);
                setCompNum('compHpCur', calc.hpCur);
                setCompNum('compAc', calc.ac);
                setCompNum('compSpeed', calc.speed);
                setCompName(cleanSpeciesName(found.name), true);

                const formulaHint = found.hpBase !== undefined
                    ? buildBeastFormulaHint(found, lvl, calc.hpMax, calc.ac)
                    : `📊 Расчёт (${lvl} ур.): ПЗ = ${calc.hpMax} | КБ = ${calc.ac}`;

                updateCompInfo(`${found.name}\n${formulaHint}\n${found.desc}`);
                compInp.value = '';
                return;
            }

            // 2. Выбрана продвинутая опция или специализация верного зверя
            if (found.type === 'companion') {
                const baseSpecies = (PF2E_COMPANION_ABILITIES || []).find(x => x.id === hero.stats.compSpeciesId);
                if (baseSpecies) {
                    const calc = calcCompanionStats(baseSpecies, lvl);
                    let extraHp = 0;
                    let extraAc = 0;
                    let spd = calc.speed;

                    if (found.id === 'comp_opt_savage') { extraHp += lvl; extraAc += 1; }
                    if (found.id === 'comp_opt_nimble') { extraHp += lvl; extraAc += 2; }
                    if (found.id === 'comp_opt_indomitable') { extraHp += 2 * lvl; extraAc += 1; }
                    if (found.id === 'comp_spec_racer') { spd += 10; }
                    if (found.id === 'comp_spec_ambusher' || found.id === 'comp_spec_daredevil') {
                        extraAc += (baseSpecies.acProf === 4 ? 0 : 2) + 1;
                    }

                    const totalHp = calc.hpMax + extraHp;
                    const totalAc = calc.ac + extraAc;

                    setCompNum('compHpMax', totalHp);
                    setCompNum('compHpCur', totalHp);
                    setCompNum('compAc', totalAc);
                    setCompNum('compSpeed', spd);

                    const formulaHint = buildBeastFormulaHint(baseSpecies, lvl, totalHp, totalAc, extraHp, extraAc);
                    updateCompInfo(`${baseSpecies.name}\n${formulaHint}\n${baseSpecies.desc}\n\n★ ${found.name}: ${found.desc}`);
                } else {
                    updateCompInfo(`${found.name}\n${found.desc}`);
                }
                compInp.value = '';
                return;
            }

            // 3. Выбран готовый вид Фамильяра (базовый или особенный)
            if (found.type === 'familiar_species') {
                hero.stats.compSpeciesId = found.id;
                if (typeSel) {
                    typeSel.value = 'familiar';
                    hero.stats.compType = 'familiar';
                }

                const calc = calcCompanionStats(found, lvl) || { hpMax: 5 * lvl, hpCur: 5 * lvl, ac: 12 + lvl, speed: 25 };
                const hpPerLvl = found.hasTough ? 7 : 5;

                setCompNum('compHpMax', calc.hpMax);
                setCompNum('compHpCur', calc.hpCur);
                setCompNum('compAc', calc.ac);
                setCompNum('compSpeed', calc.speed);
                setCompName(cleanSpeciesName(found.name), true);

                const famHint = `📊 Расчёт (${lvl} ур.): ПЗ = ${hpPerLvl} (5${found.hasTough ? ' + 2 Живучий/Конструкция' : ''}) × ${lvl} ур. = ${calc.hpMax} | КБ = 10 + ${lvl} ур. + 2 ум. = ${calc.ac}`;
                updateCompInfo(`${found.name}\n${famHint}\n${found.desc}`);
                compInp.value = '';
                return;
            }

            // 4. Выбрана дополнительная способность Фамильяра / Хозяина
            if (found.type === 'familiar' || found.type === 'master') {
                if (typeSel) {
                    typeSel.value = 'familiar';
                    hero.stats.compType = 'familiar';
                }

                const baseFamiliar = (PF2E_COMPANION_ABILITIES || []).find(
                    x => x.id === hero.stats.compSpeciesId && x.type === 'familiar_species'
                );

                setCompName(baseFamiliar ? cleanSpeciesName(baseFamiliar.name) : `Фамильяр (${cleanSpeciesName(found.name)})`, false);

                const prevText = hero.stats.compAbilitiesText || '';
                const existingExtra = prevText.split('\n').filter(line => line.startsWith('★ '));
                const newAbilityLine = `★ ${found.name}: ${found.desc}`;
                if (!existingExtra.includes(newAbilityLine)) {
                    existingExtra.push(newAbilityLine);
                }

                const extraBlock = existingExtra.join('\n');
                const isTough = found.id === 'fam_tough' || baseFamiliar?.hasTough || extraBlock.includes('Живучий');
                const isFast = found.id === 'fam_fast_movement' || extraBlock.includes('Быстрое перемещение');

                const hpPerLvl = isTough ? 7 : 5;
                const finalHp = hpPerLvl * lvl;
                const finalAc = 12 + lvl;
                const finalSpeed = isFast ? 40 : (baseFamiliar?.speed || 25);

                setCompNum('compHpMax', finalHp);
                setCompNum('compHpCur', finalHp);
                setCompNum('compAc', finalAc);
                setCompNum('compSpeed', finalSpeed);

                const famHint = `📊 Расчёт (${lvl} ур.): ПЗ = ${hpPerLvl} (5${isTough ? ' + 2 Живучий' : ''}) × ${lvl} ур. = ${finalHp} | КБ = 10 + ${lvl} ур. + 2 ум. = ${finalAc}`;
                const headerInfo = baseFamiliar
                    ? `${baseFamiliar.name}\n${famHint}\n${baseFamiliar.desc}`
                    : `🦉 Фамильяр\n${famHint}\nКрошечное существо. КБ равен КБ хозяина без бонусов состояния/обстоятельств.`;

                updateCompInfo(`${headerInfo}\n\n${extraBlock}`);
                compInp.value = '';
            }
        }
    });

    if (typeSel && compInp) {
        typeSel.addEventListener('change', () => {
            compInp.value = '';
            const lvl = Math.max(1, parseInt(hero.stats.level, 10) || 1);

            if (typeSel.value === 'familiar') {
                hero.stats.compSpeciesId = '';
                setCompName('Фамильяр', true);
                const famHp = 5 * lvl;
                const famAc = 12 + lvl;
                setCompNum('compHpMax', famHp);
                setCompNum('compHpCur', famHp);
                setCompNum('compAc', famAc);
                setCompNum('compSpeed', 25);
                updateCompInfo(`🦉 Фамильяр\n📊 Расчёт (${lvl} ур.): ПЗ = 5 × ${lvl} ур. = ${famHp} | КБ = 10 + ${lvl} ур. + 2 ум. = ${famAc}\nКрошечное существо. КБ равен КБ хозяина без бонусов состояния/обстоятельств.`);
            } else if (typeSel.value === 'none') {
                hero.stats.compSpeciesId = '';
                setCompName('', true);
                setCompNum('compHpMax', 0);
                setCompNum('compHpCur', 0);
                setCompNum('compAc', 10);
                setCompNum('compSpeed', 25);
                updateCompInfo('');
            }
        });
    }

}
