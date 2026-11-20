import fs from 'node:fs';
import { PF2E_ACTIONS_CATALOG } from '../js/config/actions_catalog.js';
import { PF2E_ANCESTRY_FEATS } from '../js/config/ancestry_feats_catalog.js';
import { PF2E_BACKGROUNDS } from '../js/config/backgrounds_catalog.js';
import { PF2E_CANTRIPS } from '../js/config/cantrips_catalog.js';
import { PF2E_COMPANION_ABILITIES } from '../js/config/companions_catalog.js';
import {
    PF2E_BARD_FEATS, PF2E_BARBARIAN_FEATS, PF2E_CHAMPION_FEATS,
    PF2E_RANGER_FEATS, PF2E_MONK_FEATS, PF2E_CLERIC_FEATS,
    PF2E_SORCERER_FEATS, PF2E_WIZARD_FEATS, PF2E_FIGHTER_FEATS,
    PF2E_ROGUE_FEATS, PF2E_DRUID_FEATS, PF2E_MAGUS_FEATS, PF2E_WITCH_FEATS
} from '../js/config/feats_catalog.js';
import { PF2E_FOCUS_SPELLS } from '../js/config/focus_spells_catalog.js';
import { PF2E_GENERAL_FEATS } from '../js/config/general_feats_catalog.js';
import { PF2E_SKILL_FEATS } from '../js/config/skill_feats_catalog.js';
import { PF2E_SPELLS_LVL1 } from '../js/config/spells_lvl1_catalog.js';
import { PF2E_SPELLS_LVL2 } from '../js/config/spells_lvl2_catalog.js';
import { PF2E_SPELLS_LVL3 } from '../js/config/spells_lvl3_catalog.js';
import { PF2E_SPELLS_LVL4 } from '../js/config/spells_lvl4_catalog.js';
import { PF2E_SPELLS_LVL5 } from '../js/config/spells_lvl5_catalog.js';
import { PF2E_SPELLS_LVL6 } from '../js/config/spells_lvl6_catalog.js';
import { PF2E_SPELLS_LVL7 } from '../js/config/spells_lvl7_catalog.js';
import { PF2E_SPELLS_LVL8 } from '../js/config/spells_lvl8_catalog.js';
import { PF2E_SPELLS_LVL9 } from '../js/config/spells_lvl9_catalog.js';
import { PF2E_SPELLS_LVL10 } from '../js/config/spells_lvl10_catalog.js';
import { PF2E_ANCESTRIES, PF2E_CLASSES } from '../js/config/meta_catalog.js';
import { PF2E_HERITAGES } from '../js/config/heritages_catalog.js';
import { PF2E_DEITIES } from '../js/config/deities_catalog.js';
import { PF2E_RITUALS } from '../js/config/rituals_catalog.js';

const entries = [];
const seenKeys = new Set();
const usedIds = new Set();

function pushEntry(item) {
    if (!item || !item.name) return;

    const normName = String(item.name).toLowerCase().replace(/\s+/g, ' ').trim();
    const dedupKey = `${item.kind}|${item.category}|${normName}`;
    if (seenKeys.has(dedupKey)) return;
    seenKeys.add(dedupKey);

    let finalId = item.id || `${item.kind}_${entries.length + 1}`;
    if (usedIds.has(finalId)) {
        let n = 2;
        while (usedIds.has(`${finalId}_${n}`)) n++;
        finalId = `${finalId}_${n}`;
    }
    usedIds.add(finalId);

    entries.push({ ...item, id: finalId });
}

// 1. Действия
for (const a of (PF2E_ACTIONS_CATALOG || [])) {
    const catMap = {
        basic: 'Базовое действие',
        class: `Классовое (${a.className || ''})`,
        skill: `Навык (${a.skillName || ''})`
    };
    pushEntry({
        id: a.id,
        name: a.name,
        kind: 'action',
        category: catMap[a.category] || 'Действие',
        actions: a.actions || '',
        traits: a.traits || '',
        source: a.source || '',
        desc: a.desc || ''
    });
}

// 2. Заклинания и фокусы
const addSpells = (list, level, kindLabel) => {
    for (const s of (list || [])) {
        pushEntry({
            id: s.id,
            name: s.name,
            kind: 'spell',
            category: kindLabel,
            level,
            actions: s.actions || '',
            traditions: Array.isArray(s.traditions) ? s.traditions : [],
            source: s.source || '',
            desc: s.notes || ''
        });
    }
};
addSpells(PF2E_CANTRIPS, 0, 'Фокус (Заговор)');
addSpells(PF2E_FOCUS_SPELLS, 1, 'Фокальное заклинание');
addSpells(PF2E_SPELLS_LVL1, 1, 'Заклинание 1-го круга');
addSpells(PF2E_SPELLS_LVL2, 2, 'Заклинание 2-го круга');
addSpells(PF2E_SPELLS_LVL3, 3, 'Заклинание 3-го круга');
addSpells(PF2E_SPELLS_LVL4, 4, 'Заклинание 4-го круга');
addSpells(PF2E_SPELLS_LVL5, 5, 'Заклинание 5-го круга');
addSpells(PF2E_SPELLS_LVL6, 6, 'Заклинание 6-го круга');
addSpells(PF2E_SPELLS_LVL7, 7, 'Заклинание 7-го круга');
addSpells(PF2E_SPELLS_LVL8, 8, 'Заклинание 8-го круга');
addSpells(PF2E_SPELLS_LVL9, 9, 'Заклинание 9-го круга');
addSpells(PF2E_SPELLS_LVL10, 10, 'Заклинание 10-го круга');

// 3. Черты (Народов, Общие, Навыков, Классовые)
for (const af of (PF2E_ANCESTRY_FEATS || [])) {
    pushEntry({
        id: af.id,
        name: af.name,
        kind: 'feat',
        category: `Черта народа (${af.ancestryName})`,
        level: af.level || 1,
        actions: af.actions && af.actions !== '-' ? af.actions : '',
        prerequisites: af.prerequisites && af.prerequisites !== '-' ? af.prerequisites : '',
        source: af.source || '',
        desc: af.desc || ''
    });
}

const addFeats = (list, categoryLabel) => {
    for (const f of (list || [])) {
        pushEntry({
            id: f.id,
            name: f.name,
            kind: 'feat',
            category: categoryLabel,
            level: f.level || 1,
            actions: f.actions && f.actions !== '-' ? f.actions : '',
            prerequisites: f.prerequisites && f.prerequisites !== '-' ? f.prerequisites : '',
            source: f.source || '',
            desc: f.desc || ''
        });
    }
};
addFeats(PF2E_GENERAL_FEATS, 'Общая черта');
addFeats(PF2E_SKILL_FEATS, 'Черта навыка');
addFeats(PF2E_BARD_FEATS, 'Черта Барда');
addFeats(PF2E_BARBARIAN_FEATS, 'Черта Варвара');
addFeats(PF2E_CHAMPION_FEATS, 'Черта Поборника');
addFeats(PF2E_RANGER_FEATS, 'Черта Следопыта');
addFeats(PF2E_MONK_FEATS, 'Черта Монаха');
addFeats(PF2E_CLERIC_FEATS, 'Черта Жреца');
addFeats(PF2E_SORCERER_FEATS, 'Черта Чародея');
addFeats(PF2E_WIZARD_FEATS, 'Черта Волшебника');
addFeats(PF2E_FIGHTER_FEATS, 'Черта Воина');
addFeats(PF2E_ROGUE_FEATS, 'Черта Плута');
addFeats(PF2E_DRUID_FEATS, 'Черта Друида');
addFeats(PF2E_MAGUS_FEATS, 'Черта Колдуна (Magus)');
addFeats(PF2E_WITCH_FEATS, 'Черта Ведьмы');

// 4. Происхождения
for (const b of (PF2E_BACKGROUNDS || [])) {
    pushEntry({
        id: b.id,
        name: b.name,
        kind: 'background',
        category: 'Происхождение',
        source: b.source || '',
        meta: `Навыки: ${b.skillName}, ${b.lore} | Черта: ${b.feat}`,
        desc: b.desc || ''
    });
}

// 5. Народы, Классы, Родословные
for (const anc of (PF2E_ANCESTRIES || [])) {
    pushEntry({ id: `anc_${anc.id}`, name: anc.name, kind: 'ancestry', category: 'Народ', desc: anc.traits || '' });
}
for (const cls of (PF2E_CLASSES || [])) {
    pushEntry({
        id: `cls_${cls.id}`,
        name: cls.name,
        kind: 'class',
        category: 'Класс',
        meta: `ПЗ: ${cls.hp} | Ключевая хар-ка: ${cls.keyStat}`,
        desc: cls.desc || ''
    });
}
const sortedHeritages = [...(PF2E_HERITAGES || [])].sort((a, b) => (b.desc ? 1 : 0) - (a.desc ? 1 : 0));
for (const h of sortedHeritages) {
    const ancName = h.id === 'her_surki_crusher' ? 'Сурки' : (h.ancestryName || '');
    pushEntry({
        id: h.id,
        name: h.name,
        kind: 'heritage',
        category: ancName ? `Родословная (${ancName})` : 'Родословная',
        source: h.source || '',
        desc: h.desc || ''
    });
}

// 6. Верные звери и фамильяры
for (const c of (PF2E_COMPANION_ABILITIES || [])) {
    const typeMap = {
        companion: 'Верный зверь / Специализация',
        familiar_species: 'Вид фамильяра',
        familiar: 'Способность фамильяра',
        master: 'Способность хозяина фамильяра'
    };
    pushEntry({
        id: c.id,
        name: c.name,
        kind: 'companion',
        category: typeMap[c.type] || 'Спутник',
        level: c.minLevel || 0,
        desc: c.desc || ''
    });
}

// 7. Божества Голариона
for (const d of (PF2E_DEITIES || [])) {
    pushEntry({
        id: d.id,
        name: d.name,
        kind: 'deity',
        category: `Божество • ${d.title}`,
        traits: `Домены: ${d.domains.join(', ')}`,
        meta: `Источник: ${d.font} | Оружие: ${d.weapon} | Навык: ${d.skill}`,
        desc: `Освящение: ${d.sanctification}\nЗаклинания: ${d.spells}\nЭдикты: ${d.edicts}\nАнафема: ${d.anathema}`
    });
}

// 8. Ритуалы
for (const r of (PF2E_RITUALS || [])) {
    pushEntry({
        id: r.id,
        name: r.name,
        kind: 'ritual',
        category: `Ритуал ${r.level}-го круга`,
        level: r.level || 1,
        traits: `Время: ${r.castTime} | Вторичные заклинатели: ${r.secondaryCasters}`,
        meta: `Основная проверка: ${r.primaryCheck} | Стоимость: ${r.cost}`,
        desc: r.desc || ''
    });
}

fs.mkdirSync('../data', { recursive: true });
fs.writeFileSync('../data/compendium.json', JSON.stringify({
    generatedAt: new Date().toISOString(),
    totalCount: entries.length,
    entries
}, null, 2), 'utf8');

const byKind = entries.reduce((acc, e) => {
    acc[e.kind] = (acc[e.kind] || 0) + 1;
    return acc;
}, {});
console.log(`✅ Сгенерировано записей в data/compendium.json: ${entries.length}`, byKind);
