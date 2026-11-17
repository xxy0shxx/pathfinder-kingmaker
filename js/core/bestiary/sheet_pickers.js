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
import ModalManager from '../../ui/modal_manager.js';
import StorageManager from '../storage_manager.js';
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
            optEl.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const targetEl = e.target?.nodeType === 3 ? e.target.parentElement : e.target;
                const isBuyClick = !!(targetEl && typeof targetEl.closest === 'function' && targetEl.closest('.bst-item-buy-btn'));
                const picked = list[Number(optEl.dataset.optIdx)];
                if (picked) onSelect(picked, isBuyClick);
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

    // Извлекает цену предмета в медных монетах (1 ЗМ = 100 ММ, 1 СМ = 10 ММ)
    const parseItemPriceCp = (it) => {
        if (!it) return null;
        const raw = `${it.price || ''} ${it.notes || ''}`;
        const m = raw.match(/(\d+(?:[.,]\d+)?)\s*(зм|см|мм|gp|sp|cp)(?![а-яёa-z])/i);
        if (!m) return null;

        const numStr = String(m.at(1) || '').replace(',', '.');
        const unitRaw = String(m.at(2) || '').toLowerCase();
        const val = parseFloat(numStr) || 0;
        if (val <= 0) return null;

        const mult = (unitRaw === 'зм' || unitRaw === 'gp') ? 100 : ((unitRaw === 'см' || unitRaw === 'sp') ? 10 : 1);
        const totalCp = Math.round(val * mult);
        return {
            totalCp,
            label: `${m.at(1)} ${unitRaw.toUpperCase()}`
        };
    };

    // Списывает сумму в медных монетах из кошелька героя (с авторазменом) и обновляет поля на странице
    const spendHeroCoinsCp = (costCp) => {
        const root = overlay || document;
        const gInp = root.querySelector('[data-sheet-num="coinsGold"]') || document.querySelector('[data-sheet-num="coinsGold"]');
        const sInp = root.querySelector('[data-sheet-num="coinsSilver"]') || document.querySelector('[data-sheet-num="coinsSilver"]');
        const cInp = root.querySelector('[data-sheet-num="coinsCopper"]') || document.querySelector('[data-sheet-num="coinsCopper"]');

        const curG = Math.max(0, parseInt(gInp ? gInp.value : hero.stats.coinsGold, 10) || 0);
        const curS = Math.max(0, parseInt(sInp ? sInp.value : hero.stats.coinsSilver, 10) || 0);
        const curC = Math.max(0, parseInt(cInp ? cInp.value : hero.stats.coinsCopper, 10) || 0);
        const totalCp = curG * 100 + curS * 10 + curC;

        if (totalCp < costCp) return false;

        const remCp = totalCp - costCp;
        const nextG = Math.floor(remCp / 100);
        const nextS = Math.floor((remCp % 100) / 10);
        const nextC = remCp % 10;

        hero.stats.coinsGold = nextG;
        hero.stats.coinsSilver = nextS;
        hero.stats.coinsCopper = nextC;

        if (gInp) {
            gInp.value = String(nextG);
            gInp.setAttribute('value', String(nextG));
        }
        if (sInp) {
            sInp.value = String(nextS);
            sInp.setAttribute('value', String(nextS));
        }
        if (cInp) {
            cInp.value = String(nextC);
            cInp.setAttribute('value', String(nextC));
            cInp.dispatchEvent(new Event('input', { bubbles: true }));
            cInp.dispatchEvent(new Event('change', { bubbles: true }));
        }
        return true;
    };

    const applySelectedItemToRow = (inp, row, found) => {
        const qtyInp = overlay.querySelector(`[data-sheet-num="item${row}Qty"]`);
        const noteInp = overlay.querySelector(`[data-sheet-txt="item${row}Notes"]`);

        // Проверяем дубликаты в других ячейках — если есть, стакаем в них
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
            const nextQty = (Math.max(0, Number(hero.stats[`item${existingRow}Qty`]) || 0)) + 1;
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
                    if (wName && !/^\+\d/.test(wName)) hero.stats[`${slot}Name`] = `+${eff.potency} ${wName}`;
                }
                if (eff.striking) {
                    const curDmg = String(hero.stats[`${slot}Dmg`] || '').trim();
                    if (curDmg) hero.stats[`${slot}Dmg`] = curDmg.replace(/^\d+(d\d+)/i, `${eff.striking}$1`);
                    const wName = String(hero.stats[`${slot}Name`] || '').trim();
                    if (wName && !wName.toLowerCase().includes('разящ')) hero.stats[`${slot}Name`] = `${wName} (Разящее)`;
                }
                if (eff.extraDmg) {
                    const curDmg = String(hero.stats[`${slot}Dmg`] || '').trim();
                    if (curDmg && !curDmg.includes(eff.extraDmg)) hero.stats[`${slot}Dmg`] = `${curDmg} ${eff.extraDmg}`;
                }
                if (eff.extraTrait) {
                    const curTraits = String(hero.stats[`${slot}Traits`] || '').trim();
                    if (!curTraits.includes(eff.extraTrait)) hero.stats[`${slot}Traits`] = curTraits ? `${curTraits}, ${eff.extraTrait}` : eff.extraTrait;
                }
            } else if (eff.target === 'armor') {
                if (eff.potency) {
                    const baseArmor = (PF2E_ARMOR_CATALOG || []).find(a => normalizeStr(a.name) === normalizeStr(hero.stats.armorName));
                    const baseBonus = baseArmor ? (Number(baseArmor.acBonus) || 0) : (Number(hero.stats.acItem) || 0);
                    hero.stats.acItem = baseBonus + eff.potency;
                    const aName = String(hero.stats.armorName || '').trim();
                    if (aName && !/^\+\d/.test(aName)) hero.stats.armorName = `+${eff.potency} ${aName}`;
                }
                if (eff.noteTag) {
                    const aName = String(hero.stats.armorName || '').trim();
                    if (aName && !aName.includes(eff.noteTag)) hero.stats.armorName = `${aName} [${eff.noteTag}]`;
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
    };

    // 3. Предметы, щиты и степперы количества (выбор строго из каталога + диалог покупки)
    overlay.querySelectorAll('.bst-item-picker-inp').forEach(inp => {
        const row = inp.dataset.itemRow;
        inp.dataset.validItem = inp.value || '';

        bindAutocomplete(inp, overlay.querySelector(`[data-item-drop="${row}"]`), {
            width: 390,
            zIndex: '10000180',
            getItems: (q) => searchItemsCatalog(q),
            renderOption: (it) => {
                const priceInfo = parseItemPriceCp(it);
                const priceTagHtml = priceInfo
                    ? `<span style="margin-left: 6px; padding: 2px 7px; font-size: 11px; font-weight: bold; background: #1e3c27; border: 1px solid #ffd875; color: #ffd875; border-radius: 4px; white-space: nowrap;">💰 ${priceInfo.label}</span>`
                    : '';
                return `<div class="bst-cantrip-opt-top" style="display:flex; justify-content:space-between; align-items:center; gap:6px;">
                    <div style="flex:1; min-width:0;"><b>${it.name}</b> <span style="display:block; font-size:11px; color:#a4b0be;">${it.category}</span></div>
                    ${priceTagHtml}
                </div>`;
            },
            onSelect: (found) => {
                const priceInfo = parseItemPriceCp(found);
                if (!priceInfo || priceInfo.totalCp <= 0) {
                    applySelectedItemToRow(inp, row, found);
                    return;
                }

                const gInp = overlay.querySelector('[data-sheet-num="coinsGold"]') || document.querySelector('[data-sheet-num="coinsGold"]');
                const sInp = overlay.querySelector('[data-sheet-num="coinsSilver"]') || document.querySelector('[data-sheet-num="coinsSilver"]');
                const cInp = overlay.querySelector('[data-sheet-num="coinsCopper"]') || document.querySelector('[data-sheet-num="coinsCopper"]');
                const curG = Math.max(0, parseInt(gInp ? gInp.value : hero.stats.coinsGold, 10) || 0);
                const curS = Math.max(0, parseInt(sInp ? sInp.value : hero.stats.coinsSilver, 10) || 0);
                const curC = Math.max(0, parseInt(cInp ? cInp.value : hero.stats.coinsCopper, 10) || 0);
                const totalCp = curG * 100 + curS * 10 + curC;
                const canAfford = totalCp >= priceInfo.totalCp;

                const choiceModal = ModalManager.open({
                    id: 'bstAcquireItemChoiceModal',
                    title: '🎒 Получение предмета',
                    width: '440px',
                    borderColor: '#ffd875',
                    bodyHtml: `
                        <div style="font-size: 14px; color: #ebd291; line-height: 1.5;">
                            Вы выбрали: <b style="color:#fff;">${found.name}</b><br>
                            Стоимость по каталогу: <b style="color:#ffd875;">${priceInfo.label}</b><br>
                            <div style="margin-top: 8px; padding: 6px 10px; background: rgba(4,9,5,0.75); border: 1px solid #543e0d; border-radius: 5px; font-size: 13px;">
                                В кошельке героя: <b>${curG} ЗМ, ${curS} СМ, ${curC} ММ</b>
                                ${!canAfford ? `<div style="color:#ff7675; margin-top:3px;">⚠️ Монет недостаточно для покупки — можно взять только как трофей.</div>` : ''}
                            </div>
                        </div>
                    `,
                    footerButtons: [
                        {
                            label: '✖ Отмена',
                            variant: 'cc',
                            onClick: () => {
                                inp.value = inp.dataset.validItem || '';
                                choiceModal.close();
                            }
                        },
                        {
                            label: '🎁 Взять бесплатно',
                            variant: 'cc',
                            onClick: () => {
                                applySelectedItemToRow(inp, row, found);
                                choiceModal.close();
                            }
                        },
                        ...(canAfford ? [{
                            label: `🛒 Купить (−${priceInfo.label})`,
                            variant: 'ok',
                            onClick: () => {
                                if (spendHeroCoinsCp(priceInfo.totalCp)) {
                                    applySelectedItemToRow(inp, row, found);
                                }
                                choiceModal.close();
                            }
                        }] : [])
                    ]
                });

                if (choiceModal?.overlay) {
                    choiceModal.overlay.style.zIndex = '10000250';
                }
            }
        });

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

    // Кнопка удаления позиции (🗑️) в каждой строке рюкзака с подтверждением
    overlay.querySelectorAll('.bst-item-clear-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const row = btn.dataset.itemClear;

            const nameInp = overlay.querySelector(`[data-sheet-txt="item${row}Name"]`);
            const qtyInp = overlay.querySelector(`[data-sheet-num="item${row}Qty"]`);
            const noteInp = overlay.querySelector(`[data-sheet-txt="item${row}Notes"]`);

            const itemName = String(nameInp?.value || hero.stats[`item${row}Name`] || '').trim();
            const itemQty = Math.max(0, Number(qtyInp?.value ?? hero.stats[`item${row}Qty`]) || 0);

            // Если строка и так пустая — просто сбрасываем без модалки
            if (!itemName && itemQty === 0) {
                if (noteInp) noteInp.value = '';
                hero.stats[`item${row}Notes`] = '';
                return;
            }

            const executeClear = () => {
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
            };

            const confirmModal = ModalManager.open({
                id: 'bstConfirmDeleteItemModal',
                title: '🗑️ Удаление предмета из рюкзака',
                width: '420px',
                borderColor: '#e74c3c',
                bodyHtml: `
                    <div style="font-size: 14px; color: #ebd291; line-height: 1.5; padding: 6px 2px;">
                        Вы действительно хотите удалить позицию из рюкзака?<br>
                        <div style="margin-top: 8px; padding: 8px 10px; background: rgba(59, 23, 23, 0.45); border: 1px solid #9b2c2c; border-radius: 5px; color: #fff;">
                            <b>${itemName || 'Предмет'}</b> ${itemQty > 0 ? `<span style="color: #ffd875;">(×${itemQty} шт.)</span>` : ''}
                        </div>
                    </div>
                `,
                footerButtons: [
                    {
                        label: '✖ Отмена',
                        variant: 'cc',
                        onClick: () => confirmModal.close()
                    },
                    {
                        label: '🗑️ Удалить',
                        variant: 'del',
                        onClick: () => {
                            executeClear();
                            confirmModal.close();
                        }
                    }
                ]
            });

            if (confirmModal?.overlay) {
                confirmModal.overlay.style.zIndex = '10000250';
            }
        });
    });

    // Хелпер начисления монет в кошелёк героя (с автоукрупнением 10 ММ -> 1 СМ -> 1 ЗМ)
    const addHeroCoinsCp = (gainCp) => {
        if (gainCp <= 0) return;
        const root = overlay || document;
        const gInp = root.querySelector('[data-sheet-num="coinsGold"]') || document.querySelector('[data-sheet-num="coinsGold"]');
        const sInp = root.querySelector('[data-sheet-num="coinsSilver"]') || document.querySelector('[data-sheet-num="coinsSilver"]');
        const cInp = root.querySelector('[data-sheet-num="coinsCopper"]') || document.querySelector('[data-sheet-num="coinsCopper"]');

        const curG = Math.max(0, parseInt(gInp ? gInp.value : hero.stats.coinsGold, 10) || 0);
        const curS = Math.max(0, parseInt(sInp ? sInp.value : hero.stats.coinsSilver, 10) || 0);
        const curC = Math.max(0, parseInt(cInp ? cInp.value : hero.stats.coinsCopper, 10) || 0);
        const nextTotalCp = (curG * 100 + curS * 10 + curC) + gainCp;

        const nextG = Math.floor(nextTotalCp / 100);
        const nextS = Math.floor((nextTotalCp % 100) / 10);
        const nextC = nextTotalCp % 10;

        hero.stats.coinsGold = nextG;
        hero.stats.coinsSilver = nextS;
        hero.stats.coinsCopper = nextC;

        if (gInp) { gInp.value = String(nextG); gInp.setAttribute('value', String(nextG)); }
        if (sInp) { sInp.value = String(nextS); sInp.setAttribute('value', String(nextS)); }
        if (cInp) {
            cInp.value = String(nextC);
            cInp.setAttribute('value', String(nextC));
            cInp.dispatchEvent(new Event('input', { bubbles: true }));
            cInp.dispatchEvent(new Event('change', { bubbles: true }));
        }
    };

    const formatCpLabel = (cp) => {
        if (cp <= 0) return '0 ММ';
        const g = Math.floor(cp / 100);
        const s = Math.floor((cp % 100) / 10);
        const c = cp % 10;
        return [
            g > 0 ? `${g} ЗМ` : '',
            s > 0 ? `${s} СМ` : '',
            c > 0 ? `${c} ММ` : ''
        ].filter(Boolean).join(', ');
    };

    // Кнопка продажи позиции (💰) в каждой строке рюкзака
    overlay.querySelectorAll('.bst-item-sell-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const row = btn.dataset.itemSell;

            const nameInp = overlay.querySelector(`[data-sheet-txt="item${row}Name"]`);
            const qtyInp = overlay.querySelector(`[data-sheet-num="item${row}Qty"]`);
            const noteInp = overlay.querySelector(`[data-sheet-txt="item${row}Notes"]`);

            const itemName = String(nameInp?.value || hero.stats[`item${row}Name`] || '').trim();
            const itemQty = Math.max(0, Number(qtyInp?.value ?? hero.stats[`item${row}Qty`]) || 0);

            if (!itemName || itemQty <= 0) return;

            const catObj = (PF2E_ITEMS_CATALOG || []).find(it => normalizeStr(it.name) === normalizeStr(itemName));
            const priceInfo = catObj ? parseItemPriceCp(catObj) : parseItemPriceCp({ price: '', notes: noteInp?.value || '' });
            const baseUnitCp = priceInfo ? priceInfo.totalCp : 0;

            const sellModal = ModalManager.open({
                id: 'bstSellItemModal',
                title: '💰 Продажа предмета из рюкзака',
                width: '440px',
                borderColor: '#ffd875',
                bodyHtml: `
                    <div style="font-size: 14px; color: #ebd291; line-height: 1.5;">
                        <div>Предмет: <b style="color:#fff;">${itemName}</b> <span style="color:#a4b0be;">(в наличии: ${itemQty} шт.)</span></div>
                        <div>Базовая цена (1 шт.): <b style="color:#ffd875;">${baseUnitCp > 0 ? formatCpLabel(baseUnitCp) : 'не указана в каталоге'}</b></div>

                        <div style="display: grid; grid-template-columns: 110px 1fr; gap: 8px; margin-top: 10px; align-items: end;">
                            <div>
                                <label style="font-size: 12px; color: #a4b0be;">Продать (шт.):</label>
                                <input type="number" id="bstSellQtyInp" class="k-inp" min="1" max="${itemQty}" value="1" style="width: 100%; text-align: center; margin-top: 3px;">
                            </div>
                            <div>
                                <label style="font-size: 12px; color: #a4b0be;">Условия сделки:</label>
                                <select id="bstSellRateSel" class="k-inp" style="width: 100%; margin-top: 3px; padding: 6px; background: #040905; border: 1px solid #543e0d; color: #ebd291;">
                                    <option value="0.5" selected>⚖️ Стандарт PF2e (50% цены)</option>
                                    <option value="1">💎 Драгоценности / Торговля (100% цены)</option>
                                </select>
                            </div>
                        </div>

                        <div id="bstSellPreviewBox" style="margin-top: 10px; padding: 8px 10px; background: rgba(30, 60, 39, 0.45); border: 1px solid #2ecc71; border-radius: 5px; color: #2ecc71; font-weight: bold;"></div>
                    </div>
                `,
                footerButtons: [
                    { label: '✖ Отмена', variant: 'cc', onClick: () => sellModal.close() },
                    {
                        label: '💰 Продать и зачислить',
                        variant: 'ok',
                        onClick: () => {
                            const sellCount = Math.max(1, Math.min(itemQty, parseInt(document.getElementById('bstSellQtyInp')?.value, 10) || 1));
                            const rate = parseFloat(document.getElementById('bstSellRateSel')?.value) || 0.5;
                            const totalGainCp = Math.floor(baseUnitCp * sellCount * rate);

                            addHeroCoinsCp(totalGainCp);

                            const remQty = itemQty - sellCount;
                            if (remQty <= 0) {
                                hero.stats[`item${row}Name`] = '';
                                hero.stats[`item${row}Qty`] = 0;
                                hero.stats[`item${row}Notes`] = '';
                                if (nameInp) { nameInp.value = ''; nameInp.dataset.validItem = ''; }
                                if (noteInp) noteInp.value = '';
                                if (qtyInp) {
                                    qtyInp.value = 0;
                                    qtyInp.dispatchEvent(new Event('input', { bubbles: true }));
                                }
                            } else {
                                hero.stats[`item${row}Qty`] = remQty;
                                if (qtyInp) {
                                    qtyInp.value = remQty;
                                    qtyInp.dispatchEvent(new Event('input', { bubbles: true }));
                                }
                            }

                            sellModal.close();
                        }
                    }
                ]
            });

            if (sellModal?.overlay) sellModal.overlay.style.zIndex = '10000250';

            const qEl = document.getElementById('bstSellQtyInp');
            const rEl = document.getElementById('bstSellRateSel');
            const pEl = document.getElementById('bstSellPreviewBox');
            const updateSellPreview = () => {
                const cnt = Math.max(1, Math.min(itemQty, parseInt(qEl?.value, 10) || 1));
                const rt = parseFloat(rEl?.value) || 0.5;
                const gain = Math.floor(baseUnitCp * cnt * rt);
                if (pEl) pEl.textContent = `Выручка в кошелёк: +${formatCpLabel(gain)}`;
            };
            qEl?.addEventListener('input', updateSellPreview);
            rEl?.addEventListener('change', updateSellPreview);
            updateSellPreview();
        });
    });


    // Кнопка передачи предмета (🎁) другому герою отряда
    overlay.querySelectorAll('.bst-item-give-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const row = btn.dataset.itemGive;

            const nameInp = overlay.querySelector(`[data-sheet-txt="item${row}Name"]`);
            const qtyInp = overlay.querySelector(`[data-sheet-num="item${row}Qty"]`);
            const noteInp = overlay.querySelector(`[data-sheet-txt="item${row}Notes"]`);

            const itemName = String(nameInp?.value || hero.stats[`item${row}Name`] || '').trim();
            const itemQty = Math.max(0, Number(qtyInp?.value ?? hero.stats[`item${row}Qty`]) || 0);
            const itemNotes = String(noteInp?.value || hero.stats[`item${row}Notes`] || '').trim();

            if (!itemName || itemQty <= 0) return;

            const allBestiaryHeroes = [
                ...(window.BestiaryManager?.state?.party || []),
                ...(window.BestiaryManager?.state?.inactive || [])
            ];

            const normSender = normalizeStr(hero.name);
            const partyPool = allBestiaryHeroes.filter(p => p && p.id !== hero.id && normalizeStr(p.name) !== normSender);

            if (!partyPool.length) {
                const noTargetModal = ModalManager.open({
                    id: 'bstNoRecipientModal',
                    title: '🎁 Передача предмета',
                    width: '400px',
                    borderColor: '#74b9ff',
                    bodyHtml: `<div style="font-size: 14px; color: #ebd291;">В отряде нет других персонажей, которым можно передать предмет.</div>`,
                    footerButtons: [{ label: 'Понятно', variant: 'ok' }]
                });
                if (noTargetModal?.overlay) noTargetModal.overlay.style.zIndex = '10000250';
                return;
            }

            const giveModal = ModalManager.open({
                id: 'bstGiveItemModal',
                title: '🎁 Передать предмет союзнику',
                width: '440px',
                borderColor: '#74b9ff',
                bodyHtml: `
                    <div style="font-size: 14px; color: #ebd291; line-height: 1.5;">
                        <div>Предмет: <b style="color:#fff;">${itemName}</b> <span style="color:#a4b0be;">(у вас: ${itemQty} шт.)</span></div>
                        <div style="display: grid; grid-template-columns: 1fr 110px; gap: 8px; margin-top: 10px;">
                            <div>
                                <label style="font-size: 12px; color: #74b9ff; font-weight: bold;">Кому передать:</label>
                                <select id="bstGiveTargetSel" class="k-inp" style="width: 100%; margin-top: 3px; padding: 6px; background: #040905; border: 1px solid #543e0d; color: #ebd291;">
                                    ${partyPool.map(p => `<option value="${p.id}">🛡️ ${p.name}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; color: #74b9ff; font-weight: bold;">Количество:</label>
                                <input type="number" id="bstGiveQtyInp" class="k-inp" min="1" max="${itemQty}" value="1" style="width: 100%; text-align: center; margin-top: 3px;">
                            </div>
                        </div>
                        <div id="bstGiveErrBox" style="color: #ff7675; font-size: 12px; margin-top: 6px;"></div>
                    </div>
                `,
                footerButtons: [
                    { label: '✖ Отмена', variant: 'cc', onClick: () => giveModal.close() },
                    {
                        label: '🎁 Передать',
                        variant: 'ok',
                        onClick: () => {
                            const targetId = document.getElementById('bstGiveTargetSel')?.value;
                            const giveCount = Math.max(1, Math.min(itemQty, parseInt(document.getElementById('bstGiveQtyInp')?.value, 10) || 1));
                            const recipient = partyPool.find(p => p.id === targetId);
                            const errBox = document.getElementById('bstGiveErrBox');

                            if (!recipient) return;
                            if (!recipient.stats) recipient.stats = {};

                            // 1. Ищем у получателя такой же предмет для стаканья или первый пустой слот
                            const normName = normalizeStr(itemName);
                            let targetSlot = -1;
                            let emptySlot = -1;

                            for (let sIdx = 1; sIdx <= 15; sIdx++) {
                                const rName = String(recipient.stats[`item${sIdx}Name`] || '').trim();
                                if (!rName && emptySlot === -1) {
                                    emptySlot = sIdx;
                                } else if (rName && normalizeStr(rName) === normName) {
                                    targetSlot = sIdx;
                                    break;
                                }
                            }

                            if (targetSlot === -1 && emptySlot === -1) {
                                if (errBox) errBox.textContent = `⚠️ У героя ${recipient.name} заполнен весь рюкзак (15/15 слотов)!`;
                                return;
                            }

                            const destSlot = targetSlot !== -1 ? targetSlot : emptySlot;
                            const prevDestQty = targetSlot !== -1 ? (Math.max(0, Number(recipient.stats[`item${destSlot}Qty`]) || 0)) : 0;

                            recipient.stats[`item${destSlot}Name`] = recipient.stats[`item${destSlot}Name`] || itemName;
                            recipient.stats[`item${destSlot}Qty`] = prevDestQty + giveCount;
                            if (!recipient.stats[`item${destSlot}Notes`]) {
                                recipient.stats[`item${destSlot}Notes`] = itemNotes;
                            }

                            // Синхронизируем рюкзак получателя с трекером инициативы
                            const normRecName = normalizeStr(recipient.name);
                            (window.InitiativeManager?.state?.combatants || []).forEach(u => {
                                if (u && u.faction === 'friend' && normalizeStr(u.name) === normRecName && u.stats && u.stats !== recipient.stats) {
                                    u.stats[`item${destSlot}Name`] = recipient.stats[`item${destSlot}Name`];
                                    u.stats[`item${destSlot}Qty`] = recipient.stats[`item${destSlot}Qty`];
                                    u.stats[`item${destSlot}Notes`] = recipient.stats[`item${destSlot}Notes`];
                                }
                            });

                            // 2. Списываем переданное количество у отправителя и синхронизируем все его копии
                            const remQty = itemQty - giveCount;
                            const nextSenderName = remQty <= 0 ? '' : itemName;
                            const nextSenderQty = remQty <= 0 ? 0 : remQty;
                            const nextSenderNotes = remQty <= 0 ? '' : itemNotes;

                            const applySenderSlot = (targetObj) => {
                                if (!targetObj) return;
                                if (!targetObj.stats) targetObj.stats = {};
                                targetObj.stats[`item${row}Name`] = nextSenderName;
                                targetObj.stats[`item${row}Qty`] = nextSenderQty;
                                targetObj.stats[`item${row}Notes`] = nextSenderNotes;
                            };

                            applySenderSlot(hero);

                            allBestiaryHeroes.forEach(p => {
                                if (p && p !== hero && (p.id === hero.id || normalizeStr(p.name) === normSender)) {
                                    applySenderSlot(p);
                                }
                            });

                            (window.InitiativeManager?.state?.combatants || []).forEach(u => {
                                if (u && u.faction === 'friend' && normalizeStr(u.name) === normSender && u !== hero) {
                                    applySenderSlot(u);
                                }
                            });

                            // 3. Обновляем поля ввода в открытом бланке отправителя
                            if (nameInp) {
                                nameInp.value = nextSenderName;
                                nameInp.dataset.validItem = nextSenderName;
                            }
                            if (noteInp) {
                                noteInp.value = nextSenderNotes;
                            }
                            if (qtyInp) {
                                qtyInp.value = nextSenderQty;
                                qtyInp.dispatchEvent(new Event('input', { bubbles: true }));
                            }

                            StorageManager.appendTreasuryLog(`🎁 ${hero.name} → ${recipient.name}: ${itemName} (×${giveCount})`, 'transfer');

                            if (window.BestiaryManager?._save) window.BestiaryManager._save();
                            giveModal.close();
                        }
                    }
                ]
            });

            if (giveModal?.overlay) giveModal.overlay.style.zIndex = '10000250';
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

export function initPage3Pickers(overlay, hero) {
    const isInvestedItem = (it) => /настроенность|вкладываем|invested/i.test(`${it?.notes || ''} ${it?.category || ''}`);

    const getBackpackItems = () => {
        const result = [];
        for (let i = 1; i <= 15; i++) {
            const rawName = String(hero.stats[`item${i}Name`] || '').trim();
            const qty = Math.max(0, Number(hero.stats[`item${i}Qty`]) || 0);
            if (!rawName || qty <= 0) continue;

            const norm = normalizeStr(rawName);
            const catItem = [...PF2E_ITEMS_CATALOG, ...PF2E_ARMOR_CATALOG, ...PF2E_MELEE_WEAPONS, ...PF2E_RANGED_WEAPONS]
                .find(x => normalizeStr(x.name) === norm);

            result.push({
                ...(catItem || {}),
                name: rawName,
                category: catItem?.category || catItem?.group || '🎒 В рюкзаке',
                notes: catItem?.notes || hero.stats[`item${i}Notes`] || '',
                fromBackpack: true,
                backpackRow: i,
                qty
            });
        }
        return result;
    };

    const parseSingleItemBulk = (rawName) => {
        const norm = normalizeStr(rawName);
        if (!norm) return 0;
        const catItem = (PF2E_ITEMS_CATALOG || []).find(x => normalizeStr(x.name) === norm);
        const bStr = String(catItem?.bulk || '').trim().toUpperCase();
        if (!bStr || bStr === '—' || bStr === '-' || bStr === '0') return 0;
        if (bStr === 'Л' || bStr === 'L') return 0.1;
        return parseFloat(bStr.replace(',', '.')) || 0;
    };

    const updateBeltBulkBadge = () => {
        const badge = overlay.querySelector('#bstBeltBulkBadge');
        if (!badge) return;
        let total = 0;
        for (let b = 1; b <= 5; b++) {
            total += parseSingleItemBulk(hero.stats[`beltItem${b}Name`]);
        }
        const rounded = Math.round(total * 10) / 10;
        badge.textContent = `${rounded.toFixed(1)} / 2.0 Массы`;
        if (rounded > 2.0) {
            badge.style.color = '#ff7675';
            badge.textContent += ' (Перегруз пояса!)';
        } else {
            badge.style.color = '#2ecc71';
        }
    };

    const syncEquippedSkillBonuses = () => {
        const bonuses = {};
        const allSlotKeys = ['head', 'cloak', 'hands', 'belt', 'neck', 'armor', 'eyes', 'feet', 'mainHand', 'offHand', 'ring_1', 'ring_2', 'ring_3', 'ring_4', 'ring_5'];
        allSlotKeys.forEach(sk => {
            const eqName = normalizeStr(hero.stats[`eq_${sk}_Name`]);
            if (!eqName) return;
            const found = (PF2E_ITEMS_CATALOG || []).find(it => normalizeStr(it.name) === eqName);
            if (!found?.skillBonus?.skill) return;
            if (isInvestedItem(found) && !hero.stats[`eq_${sk}_Invested`]) return;

            const targetSkill = found.skillBonus.skill;
            const val = Number(found.skillBonus.bonus) || 0;
            bonuses[targetSkill] = Math.max(bonuses[targetSkill] || 0, val);
        });
        hero.stats.skillItemBonuses = bonuses;
    };

    const syncDollToPage1Stats = (slot, found) => {
        if (slot === 'armor' && found && found.acBonus !== undefined) {
            hero.stats.armorName = found.name;
            hero.stats.armorType = found.category;
            hero.stats.acItem = found.acBonus;
            hero.stats.acArmorPenalty = found.penalty || 0;
        }
        if (slot === 'mainHand' && found && found.dmgDice) {
            const liveStats = {
                level: Number(hero.stats.level) || 1,
                str: Number(hero.stats.str) || 0,
                dex: Number(hero.stats.dex) || 0
            };
            if (found.range) {
                const { atkStr, dmgStr } = calcRangedWeaponRoll(found, liveStats);
                hero.stats.rangedName = found.name;
                hero.stats.rangedAtk = atkStr;
                hero.stats.rangedDmg = dmgStr;
                hero.stats.rangedTraits = found.traits || '';
            } else {
                const { atkStr, dmgStr } = calcMeleeWeaponRoll(found, liveStats);
                hero.stats.melee1Name = found.name;
                hero.stats.melee1Atk = atkStr;
                hero.stats.melee1Dmg = dmgStr;
                hero.stats.melee1Traits = found.traits || '';
            }
        }
        if (slot === 'offHand' && found?.shieldStats) {
            hero.stats.acShieldBonus = found.shieldStats.bonus;
            hero.stats.acShieldHardness = found.shieldStats.hardness;
            hero.stats.acShieldHp = found.shieldStats.hp;
        }
    };

    const updateInvestedCounterUi = () => {
        const badge = overlay.querySelector('#bstInvestedCounterBadge');
        const used = Math.min(10, Math.max(0, Number(hero.stats.investedUsedToday) || 0));
        if (badge) {
            badge.textContent = `✨ Вложено сегодня: ${used} / 10`;
            badge.style.color = used >= 10 ? '#ff7675' : '#a29bfe';
            badge.style.borderColor = used >= 10 ? '#ff7675' : '#a29bfe';
        }
        syncEquippedSkillBonuses();
    };
    const renderPage3BackpackList = () => {
        const host = overlay.querySelector('#bstPage3BackpackSummary');
        if (!host) return;
        const bpItems = getBackpackItems();
        if (!bpItems.length) {
            host.innerHTML = `<span style="color:#7f8c8d;">Рюкзак пуст. Добавьте или купите снаряжение на Стр. 2.</span>`;
            return;
        }

        host.innerHTML = bpItems.map(it => `
            <div style="display:flex; justify-content:space-between; align-items:center; gap:6px; padding:4px 6px; border-bottom:1px dashed rgba(235,210,145,0.18);">
                <div style="font-size:12px; color:#ebd291; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                    <b>${it.name}</b> <span style="color:#2ecc71;">(×${it.qty})</span>
                </div>
                <button type="button" class="btn cc bst-bp-to-belt" data-bp-row="${it.backpackRow}" style="padding:1px 6px; font-size:10px; flex-shrink:0;" title="Поместить в свободный слот пояса быстрого доступа">⚡ На пояс</button>
            </div>
        `).join('');

        host.querySelectorAll('.bst-bp-to-belt').forEach(btn => {
            btn.addEventListener('click', () => {
                const r = Number(btn.dataset.bpRow);
                const itemName = hero.stats[`item${r}Name`];
                if (!itemName) return;
                for (let b = 1; b <= 5; b++) {
                    if (!String(hero.stats[`beltItem${b}Name`] || '').trim()) {
                        hero.stats[`beltItem${b}Name`] = itemName;
                        const beltInp = overlay.querySelector(`[data-belt-picker="${b}"]`);
                        if (beltInp) beltInp.value = itemName;
                        updateBeltBulkBadge();
                        break;
                    }
                }
            });
        });
    };

    const attachUnequipButton = (slot, inp) => {
        const rowWrap = inp.parentElement;
        if (!rowWrap || rowWrap.querySelector('.bst-eq-unequip-btn')) return;

        const unequipBtn = document.createElement('button');
        unequipBtn.type = 'button';
        unequipBtn.className = 'bst-eq-unequip-btn';
        unequipBtn.dataset.unequipSlot = slot;
        unequipBtn.title = 'Снять предмет (дневной лимит вложения сохраняется)';
        unequipBtn.style.cssText = 'background:#3b1717; border:1px solid #9b2c2c; color:#ff7675; border-radius:3px; padding:0 5px; height:22px; cursor:pointer; font-size:11px;';
        unequipBtn.textContent = '✖';
        unequipBtn.addEventListener('click', () => {
            if (slot === 'mainHand' && hero.stats.eq_offHand_Name === '🔒 Занято (двуручное)') {
                hero.stats.eq_offHand_Name = '';
                const offInp = overlay.querySelector('[data-eq-picker="offHand"]');
                if (offInp) offInp.value = '';
            }
            hero.stats[`eq_${slot}_Name`] = '';
            hero.stats[`eq_${slot}_Invested`] = false;
            inp.value = '';
            unequipBtn.remove();
            updateInvestedCounterUi();
        });
        rowWrap.appendChild(unequipBtn);
    };

    const equipItemToSlot = (slot, inp, found) => {
        const needsInvest = isInvestedItem(found);
        const curUsed = Math.max(0, Number(hero.stats.investedUsedToday) || 0);

        if (needsInvest && curUsed >= 10) {
            const m = ModalManager.open({
                id: 'bstInvestedLimitModal',
                title: '✨ Исчерпан дневной лимит вложения (10/10)',
                width: '420px',
                borderColor: '#a29bfe',
                bodyHtml: `<div style="font-size:14px; color:#ebd291; line-height:1.5;">Вы уже вложили силу в <b>10 магических предметов</b> сегодня. Предмет <b>${found.name}</b> надет, но его пассивные бонусы не работают до <b>🌅 Ежедневной подготовки</b>.</div>`,
                footerButtons: [{ label: 'Понятно', variant: 'ok' }]
            });
            if (m?.overlay) m.overlay.style.zIndex = '10000250';
            hero.stats[`eq_${slot}_Invested`] = false;
        } else if (needsInvest) {
            hero.stats.investedUsedToday = curUsed + 1;
            hero.stats[`eq_${slot}_Invested`] = true;
        } else {
            hero.stats[`eq_${slot}_Invested`] = false;
        }

        if (slot === 'mainHand' && found.hands === 2) {
            const offInp = overlay.querySelector('[data-eq-picker="offHand"]');
            hero.stats.eq_offHand_Name = '🔒 Занято (двуручное)';
            hero.stats.eq_offHand_Invested = false;
            if (offInp) offInp.value = '🔒 Занято (двуручное)';
        }

        inp.value = found.name;
        hero.stats[`eq_${slot}_Name`] = found.name;
        attachUnequipButton(slot, inp);
        syncDollToPage1Stats(slot, found);
        updateInvestedCounterUi();
    };

    overlay.querySelectorAll('[data-eq-picker]').forEach(inp => {
        const slot = inp.dataset.eqPicker;
        const basePool = (slot === 'mainHand' || slot === 'offHand')
            ? [...PF2E_MELEE_WEAPONS, ...PF2E_RANGED_WEAPONS, ...PF2E_ITEMS_CATALOG]
            : (slot === 'armor' ? PF2E_ARMOR_CATALOG : PF2E_ITEMS_CATALOG);

        bindAutocomplete(inp, null, {
            width: 360,
            zIndex: '10000190',
            getItems: (q) => {
                const nq = normalizeStr(q);
                const combined = [...getBackpackItems(), ...basePool];
                return nq ? combined.filter(x => normalizeStr(x.name).includes(nq)) : combined.slice(0, 35);
            },
            renderOption: (it) => {
                const bpTag = it.fromBackpack ? '<span style="color:#2ecc71; font-weight:bold;">[🎒 В рюкзаке]</span> ' : '';
                const invTag = isInvestedItem(it) ? '<span style="color:#a29bfe;">✨ Вкладываемый</span>' : '';
                return `<div class="bst-cantrip-opt-top"><b>${it.name}</b> ${invTag}</div>
                        <div class="bst-cantrip-opt-trad" style="font-size:11px;">${bpTag}${it.category || it.group || ''}</div>`;
            },
            onSelect: (found) => equipItemToSlot(slot, inp, found)
        });
    });

    overlay.querySelectorAll('.bst-eq-unequip-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const slot = btn.dataset.unequipSlot;
            const inp = overlay.querySelector(`[data-eq-picker="${slot}"]`);
            if (slot === 'mainHand' && hero.stats.eq_offHand_Name === '🔒 Занято (двуручное)') {
                hero.stats.eq_offHand_Name = '';
                const offInp = overlay.querySelector('[data-eq-picker="offHand"]');
                if (offInp) offInp.value = '';
            }
            hero.stats[`eq_${slot}_Name`] = '';
            hero.stats[`eq_${slot}_Invested`] = false;
            if (inp) inp.value = '';
            btn.remove();
            updateInvestedCounterUi();
        });
    });

    overlay.querySelector('#btnResetDailyInvested')?.addEventListener('click', () => {
        let activeInvested = 0;
        const allSlotKeys = ['head', 'cloak', 'hands', 'belt', 'neck', 'armor', 'eyes', 'feet', 'mainHand', 'offHand', 'ring_1', 'ring_2', 'ring_3', 'ring_4', 'ring_5'];
        allSlotKeys.forEach(sk => {
            const eqName = normalizeStr(hero.stats[`eq_${sk}_Name`]);
            if (!eqName) { hero.stats[`eq_${sk}_Invested`] = false; return; }
            const found = (PF2E_ITEMS_CATALOG || []).find(it => normalizeStr(it.name) === eqName);
            if (found && isInvestedItem(found) && activeInvested < 10) {
                hero.stats[`eq_${sk}_Invested`] = true;
                activeInvested++;
            } else {
                hero.stats[`eq_${sk}_Invested`] = false;
            }
        });
        hero.stats.investedUsedToday = activeInvested;
        updateInvestedCounterUi();
    });

    overlay.querySelectorAll('[data-belt-picker]').forEach(inp => {
        const idx = inp.dataset.beltPicker;
        bindAutocomplete(inp, null, {
            width: 340,
            zIndex: '10000190',
            getItems: (q) => {
                const nq = normalizeStr(q);
                const combined = [...getBackpackItems(), ...PF2E_ITEMS_CATALOG];
                return nq ? combined.filter(x => normalizeStr(x.name).includes(nq)) : combined.slice(0, 35);
            },
            renderOption: (it) => {
                const bpTag = it.fromBackpack ? '<span style="color:#2ecc71; font-weight:bold;">[🎒 В рюкзаке]</span> ' : '';
                return `<div class="bst-cantrip-opt-top"><b>${it.name}</b></div>
                        <div class="bst-cantrip-opt-trad" style="font-size:11px;">${bpTag}${it.category || ''}</div>`;
            },
            onSelect: (found) => {
                inp.value = found.name;
                hero.stats[`beltItem${idx}Name`] = found.name;
                updateBeltBulkBadge();
            }
        });

        inp.addEventListener('change', () => {
            hero.stats[`beltItem${idx}Name`] = inp.value;
            updateBeltBulkBadge();
        });
    });

    renderPage3BackpackList();
    updateInvestedCounterUi();
    updateBeltBulkBadge();
}
