import fs from 'node:fs';
import { PF2E_ACTIONS_CATALOG } from '../js/config/actions_catalog.js';
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
import { PF2E_ANCESTRIES, PF2E_CLASSES } from '../js/config/meta_catalog.js';
import { PF2E_HERITAGES } from '../js/config/heritages_catalog.js';

const entries = [];
const seenIds = new Set();

function pushEntry(item) {
    if (!item || !item.name) return;
    if (item.id && seenIds.has(item.id)) return;
    if (item.id) seenIds.add(item.id);
    entries.push(item);
}

// 1. Действия
for (const a of (PF2E_ACTIONS_CATALOG || [])) {
    const catMap = { basic: 'Базовое действие', class: `Классовое (${a.className || ''})`, skill: `Навык (${a.skillName || ''})` };
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

// 3. Черты (Общие, Навыков, Классовые)
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
// Сортируем родословные так, чтобы записи с описанием шли первыми (убирает пустые заглушки котолюдов)
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

fs.mkdirSync('./data', { recursive: true });
fs.writeFileSync('./data/compendium.json', JSON.stringify({
    generatedAt: new Date().toISOString(),
    totalCount: entries.length,
    entries
}, null, 2), 'utf8');

console.log(`✅ Сгенерировано записей в data/compendium.json: ${entries.length}`);
