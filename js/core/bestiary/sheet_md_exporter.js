import { PF2E_SHEET_CONFIG, ensureCharacterStats } from './bestiary_config.js';
import { PF2E_ANCESTRIES, PF2E_CLASSES } from '../../config/meta_catalog.js';
import { PF2E_BACKGROUNDS } from '../../config/backgrounds_catalog.js';

import { PF2E_CANTRIPS } from '../../config/cantrips_catalog.js';
import { PF2E_FOCUS_SPELLS } from '../../config/focus_spells_catalog.js';
import { PF2E_SPELLS_LVL1 } from '../../config/spells_lvl1_catalog.js';
import { PF2E_SPELLS_LVL2 } from '../../config/spells_lvl2_catalog.js';
import { PF2E_ITEMS_CATALOG } from '../../config/items_catalog.js';
import { PF2E_COMPANION_ABILITIES } from '../../config/companions_catalog.js';
import { PF2E_MELEE_WEAPONS, PF2E_RANGED_WEAPONS, getWeaponCritEffect, getWeaponTraitsDetails } from '../../config/weapons_catalog.js';
import { PF2E_ARMOR_CATALOG, getArmorGroupEffect, getArmorTraitsDetails } from '../../config/armor_catalog.js';

import * as FeatsMod from '../../config/feats_catalog.js';
const fmtMod = (val) => {
    const n = Number(val) || 0;
    return n >= 0 ? `+${n}` : `${n}`;
};

const norm = (str) => String(str || '')
    .replace(/^[^\p{L}\p{N}]+/u, '')
    .replace(/\([^)]*\)/g, '')
    .trim()
    .toLowerCase()
    .replace(/ё/g, 'е');

const findInCatalog = (list, queryName) => {
    const q = norm(queryName);
    if (!q || !Array.isArray(list)) return null;
    return list.find(item => {
        const n = norm(item.name);
        return n === q || (q.length > 3 && (n.includes(q) || q.includes(n)));
    }) || null;
};

const safeCell = (val, fallback = '—') => {
    const s = String(val ?? '').trim();
    if (!s) return fallback;
    return s
        .replace(/<br\s*\/?>/gi, ' • ')
        .replace(/\r?\n+/g, ' • ')
        .replace(/\|/g, '\\|')
        .replace(/\s*•\s*(•\s*)+/g, ' • ')
        .trim();
};

const formatObjDetails = (obj, excludeKeys = ['id', 'name']) => {
    if (!obj || typeof obj !== 'object') return [];
    const labels = {
        traits: 'Дескрипторы',
        desc: 'Описание',
        notes: 'Эффект',
        category: 'Категория',
        group: 'Группа',
        hands: 'Рук',
        dmgDice: 'Кость урона',
        dmgType: 'Тип урона',
        range: 'Дистанция',
        reload: 'Перезарядка',
        acBonus: 'Бонус КБ',
        dexCap: 'Макс. ЛВК',
        checkPenalty: 'Штраф проверок',
        speedPenalty: 'Штраф скорости',
        strReq: 'Треб. Сила',
        price: 'Цена',
        bulk: 'Масса',
        level: 'Уровень',
        actions: 'Действия',
        traditions: 'Традиции',
        source: 'Источник',
        skillName: 'Навык',
        lore: 'Знание',
        feat: 'Бонусная черта',
        hp: 'ПЗ за уровень',
        keyStat: 'Ключевая характеристика',
        prerequisites: 'Требования',
        reqAbilities: 'Требует способностей',
        speed: 'Скорость (фт.)',
        grantedAbilities: 'Дарованные способности',
        hpBase: 'Базовые ПЗ',
        size: 'Размер',
        str: 'СИЛ',
        dex: 'ЛВК',
        con: 'ВЫН',
        skill: 'Навык',
        attacks: 'Атаки',
        support: 'Поддержка / Особое'
    };

    const out = [];
    for (const [k, v] of Object.entries(obj)) {
        if (excludeKeys.includes(k) || v === undefined || v === null || v === '') continue;
        if (typeof v === 'boolean' || typeof v === 'function') continue;
        const valStr = Array.isArray(v) ? v.join(', ') : String(v).trim();
        if (!valStr) continue;
        const label = labels[k] || k;
        out.push(`- **${label}:** ${valStr.replace(/\r?\n+/g, ' • ')}`);
    }
    return out;
};


const profRankLabel = (prof) => {
    const p = Number(prof) || 0;
    if (p >= 8) return 'Легенда (+8)';
    if (p >= 6) return 'Мастер (+6)';
    if (p >= 4) return 'Эксперт (+4)';
    if (p >= 2) return 'Изучено (+2)';
    return 'Не изучено (+0)';
};

export function buildCharacterMarkdown(hero) {
    const s = ensureCharacterStats(hero);
    const name = hero.name || 'Безымянный герой';

    const alignMap = {
        'ЗД': 'Законопослушный Добрый (ЗД)', 'НД': 'Нейтральный Добрый (НД)', 'ХД': 'Хаотичный Добрый (ХД)',
        'ЗН': 'Законопослушный Нейтральный (ЗН)', 'ИН': 'Истинный Нейтральный (Н)', 'Н': 'Истинный Нейтральный (Н)',
        'ХН': 'Хаотичный Нейтральный (ХН)', 'ЗЗ': 'Законопослушный Злой (ЗЗ)', 'НЗ': 'Нейтральный Злой (НЗ)', 'ХЗ': 'Хаотичный Злой (ХЗ)'
    };

    const armorTypeMap = {
        unarmored: 'Без брони / Ткань', light: 'Лёгкая броня', medium: 'Средняя броня', heavy: 'Тяжёлая броня'
    };

    const allFeatsPool = [
        ...Object.values(FeatsMod).filter(Array.isArray).flat(),
        ...(PF2E_COMPANION_ABILITIES || [])
    ];
    const ancestryObj = findInCatalog(PF2E_ANCESTRIES, s.ancestry);
    const heritageObj = findInCatalog(allFeatsPool, s.heritage);
    const bgObj = findInCatalog(PF2E_BACKGROUNDS, s.background);
    const bgFeatObj = findInCatalog(allFeatsPool, s.backgroundFeat);
    const classObj = findInCatalog(PF2E_CLASSES, s.charClass);
    const armorObj = findInCatalog(PF2E_ARMOR_CATALOG, s.armorName);

    const lines = [];

    lines.push(`# 🛡️ ${name}`);
    lines.push(`> **Игрок:** ${safeCell(s.playerName)} | **Уровень:** ${s.level ?? 1} | **Опыт (XP):** ${s.xp ?? 0} | **Базовая инициатива:** ${hero.defaultScore ?? 10}`);
    lines.push('');

    lines.push('## 🧬 Биография: Народ, Наследие, Происхождение и Класс');
    lines.push('| Параметр | Значение |');
    lines.push('| :--- | :--- |');
    lines.push(`| **🧬 Народ** | **${safeCell(s.ancestry)}** |`);
    lines.push(`| **🌿 Наследие / Способность народа** | **${safeCell(s.heritage)}** |`);
    lines.push(`| **📜 Происхождение** | **${safeCell(s.background)}** |`);
    lines.push(`| **✨ Черта происхождения** | **${safeCell(s.backgroundFeat)}** |`);
    lines.push(`| **⚔️ Класс** | **${safeCell(s.charClass)}** |`);
    lines.push(`| **⚖️ Мировоззрение** | ${alignMap[s.alignment] || safeCell(s.alignment)} |`);
    lines.push('');

    if (ancestryObj) {
        lines.push(`### 🧬 Полное описание народа: ${ancestryObj.name}`);
        lines.push(...formatObjDetails(ancestryObj), '');
    }
    if (heritageObj) {
        lines.push(`### 🌿 Полное описание наследия / черты народа: ${heritageObj.name}`);
        lines.push(...formatObjDetails(heritageObj), '');
    }
    if (bgObj) {
        lines.push(`### 📜 Полное описание происхождения: ${bgObj.name}`);
        lines.push(...formatObjDetails(bgObj, ['id', 'name', 'skill', 'boosts']), '');
    }
    if (bgFeatObj) {
        lines.push(`### ✨ Полное описание черты происхождения: ${bgFeatObj.name}`);
        lines.push(...formatObjDetails(bgFeatObj), '');
    }
    if (classObj) {
        lines.push(`### ⚔️ Полное описание класса: ${classObj.name}`);
        lines.push(...formatObjDetails(classObj), '');
    }
    // =========================================================================
    // СТРАНИЦА 1: БОЙ, ЗАЩИТА, ХАРАКТЕРИСТИКИ И НАВЫКИ
    // =========================================================================
    lines.push('---');
    lines.push('## 📄 Страница 1: Бой, Защита и Навыки');
    lines.push('');

    lines.push('### ❤️ Здоровье, Скорость, Доспех и Щит');
    lines.push('| ❤️ Макс. ПЗ | 🩸 Текущие ПЗ | 💠 Врем. ПЗ | 👟 Скорость | 🛡️ Итоговый КБ |');
    lines.push('| :---: | :---: | :---: | :---: | :---: |');
    lines.push(`| **${s.hpMax ?? 10}** | ${s.hpCurrent ?? 10} | ${s.hpTemp ?? 0} | ${s.speed ?? 25} фт. | **${s.ac ?? 10}** |`);
    lines.push('');

    lines.push(`- **Доспех:** **${safeCell(s.armorName)}** (${armorTypeMap[s.armorType] || s.armorType})`);
    lines.push(`- **Формула КБ:** 10 + ${s.acDex ?? 0} (Лвк) + ${s.acProf ?? 0} (Умение) + ${s.acItem ?? 0} (Предмет) + ${s.acOther ?? 0} (Прочее) = **${s.ac ?? 10}**`);
    lines.push(`- **Штраф проверки доспеха:** ${s.acArmorPenalty ?? 0}`);
    lines.push(`- **🛡️ Щит:** Бонус при поднятии **+${s.acShieldBonus ?? 0}** | Твёрдость: **${s.acShieldHardness ?? 0}** | Текущие ПЗ щита: **${s.acShieldHp ?? 0}**`);

    if (armorObj) {
        lines.push(`- **Справочные данные доспеха (${armorObj.name}):**`);
        lines.push(...formatObjDetails(armorObj).map(l => `  ${l}`));
        const groupEff = getArmorGroupEffect(armorObj.group);
        if (groupEff) lines.push(`  - **Эффект привычной брони (${armorObj.group}):** ${groupEff}`);
        const armorTraits = getArmorTraitsDetails(armorObj.traits);
        if (armorTraits.length) {
            lines.push(`  - **Расшифровка дескрипторов:** ${armorTraits.map(t => t.desc ? `${t.trait} (${t.desc})` : t.trait).join('; ')}`);
        }
    }
    lines.push('');

    lines.push('### ⚔️ Модификаторы характеристик');
    lines.push('| 💪 СИЛ | 🤸 ЛВК | 🫀 ВЫН | 📘 ИНТ | 🦉 МДР | 🎭 ХАР |');
    lines.push('| :---: | :---: | :---: | :---: | :---: | :---: |');
    lines.push(`| **${fmtMod(s.str)}** | **${fmtMod(s.dex)}** | **${fmtMod(s.con)}** | **${fmtMod(s.int)}** | **${fmtMod(s.wis)}** | **${fmtMod(s.cha)}** |`);
    lines.push('');

    lines.push('### 👁️ Внимание и Испытания (Спасброски)');
    lines.push('| Параметр | Итоговый модификатор | Бонус умения | Ранг владения |');
    lines.push('| :--- | :---: | :---: | :--- |');
    [
        ['👁️ Внимание (Мдр)', s.perception, s.saveProf_perc],
        ['🛡️ Стойкость (Вын)', s.fortitude, s.saveProf_fort],
        ['⚡ Реакция (Лвк)', s.reflex, s.saveProf_ref],
        ['🧠 Воля (Мдр)', s.will, s.saveProf_will]
    ].forEach(([label, total, prof]) => {
        lines.push(`| ${label} | **${fmtMod(total)}** | +${prof ?? 0} | ${profRankLabel(prof)} |`);
    });
    if (String(s.perceptionNotes || '').trim()) {
        lines.push('\n**Чувства и заметки по восприятию:**');
        lines.push(`> ${String(s.perceptionNotes).trim().replace(/\r?\n/g, '\n> ')}`);
    }
    lines.push('');

    lines.push('### 📜 Навыки');
    lines.push('| Навык | Итог | Бонус умения | Ранг | Примечание |');
    lines.push('| :--- | :---: | :---: | :--- | :--- |');
    const penaltySkills = ['acrobatics', 'athletics', 'stealth', 'thievery'];
    const armorPen = Math.abs(Number(s.acArmorPenalty) || 0);

    PF2E_SHEET_CONFIG.skills.forEach(({ key, label }) => {
        const cleanLabel = label.replace(/^[^\p{L}]+/u, '').trim();
        const total = Number(s[key]) || 0;
        const prof = Number(s[`prof_${key}`]) || 0;
        const note = (penaltySkills.includes(key) && armorPen > 0) ? `Учтён штраф брони (-${armorPen})` : '—';
        lines.push(`| ${cleanLabel} | **${fmtMod(total)}** | +${prof} | ${profRankLabel(prof)} | ${note} |`);
    });
    if (String(s.skillOtherNotes || '').trim()) {
        lines.push('\n**Знания (Lore), языки и прочие навыки:**');
        lines.push(`> ${String(s.skillOtherNotes).trim().replace(/\r?\n/g, '\n> ')}`);
    }
    lines.push('');

    lines.push('### 🗡️ Оружие и Атаки');
    const weapons = [
        { type: 'Ближний бой 1', name: s.melee1Name, atk: s.melee1Atk, dmg: s.melee1Dmg, traits: s.melee1Traits, isRanged: false },
        { type: 'Ближний бой 2', name: s.melee2Name, atk: s.melee2Atk, dmg: s.melee2Dmg, traits: s.melee2Traits, isRanged: false },
        { type: 'Дистанционное', name: s.rangedName, atk: s.rangedAtk, dmg: s.rangedDmg, traits: s.rangedTraits, isRanged: true }
    ].filter(w => String(w.name || '').trim() || String(w.atk || '').trim() || String(w.dmg || '').trim());

    if (weapons.length > 0) {
        weapons.forEach(w => {
            const catItem = findInCatalog(w.isRanged ? PF2E_RANGED_WEAPONS : PF2E_MELEE_WEAPONS, w.name);
            lines.push(`#### ⚔️ ${w.type}: ${w.name || 'Оружие'}`);
            lines.push(`- **Атака:** **${safeCell(w.atk)}** | **Урон:** **${safeCell(w.dmg)}**`);
            lines.push(`- **Дескрипторы:** ${safeCell(w.traits || catItem?.traits, 'Нет')}`);
            if (catItem) {
                lines.push(...formatObjDetails(catItem, ['id', 'name', 'finesse', 'dmgMode', 'traits']));
                const critText = getWeaponCritEffect(catItem.group);
                if (critText) lines.push(`- **Критический эффект специализации (${catItem.group}):** ${critText}`);
            }
            const wpnTraits = getWeaponTraitsDetails(w.traits || catItem?.traits || '');
            if (wpnTraits.length) {
                lines.push(`- **Расшифровка дескрипторов:** ${wpnTraits.map(t => t.desc ? `${t.trait} (${t.desc})` : t.trait).join('; ')}`);
            }
            lines.push('');
        });
    } else {
        lines.push('_Оружие не заполнено._\n');
    }
    if (String(s.weaponProfNotes || '').trim()) {
        lines.push('**Умения в оружии и боевые заметки:**');
        lines.push(`> ${String(s.weaponProfNotes).trim().replace(/\r?\n/g, '\n> ')}\n`);
    }

    lines.push('### ⚔️ Боевые черты класса, народа и архетипов');
    const featLevels = [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
    const filledFeats = featLevels
        .map(lvl => ({
            lvl,
            name: String(s[`classFeatLvl${lvl}Name`] || '').trim(),
            desc: String(s[`classFeatLvl${lvl}Desc`] || '').trim()
        }))
        .filter(f => f.name || f.desc);

    if (filledFeats.length > 0) {
        filledFeats.forEach(f => {
            const catFeat = findInCatalog(allFeatsPool, f.name);
            lines.push(`#### 🔹 Уровень ${f.lvl}: ${f.name || 'Без названия'}`);
            if (f.desc) lines.push(f.desc);
            if (catFeat) {
                if (!f.desc && (catFeat.desc || catFeat.notes)) lines.push(catFeat.desc || catFeat.notes);
                lines.push(...formatObjDetails(catFeat, ['id', 'name', 'desc', 'notes']));
            }
            if (!f.desc && !catFeat) lines.push('_Описание не заполнено._');
            lines.push('');
        });
    } else {
        lines.push('_Черты класса не заполнены._\n');
    }
    // =========================================================================
    // СТРАНИЦА 2: МАГИЯ, СНАРЯЖЕНИЕ, СПУТНИКИ И ЗАМЕТКИ
    // =========================================================================
    lines.push('---');
    lines.push('## 📜 Страница 2: Магия, Снаряжение, Спутники и Заметки');
    lines.push('');



    lines.push('### ✨ Сотворение заклинаний');
    lines.push('| 🔮 Атака заклинанием | 🎯 СЛ заклинаний | ✨ Фокусов/день | 💠 Фокальные пункты | 1️⃣ Ячейки 1 круга | 2️⃣ Ячейки 2 круга |');
    lines.push('| :---: | :---: | :---: | :---: | :---: | :---: |');
    lines.push(`| **${fmtMod(s.spellAttack)}** | **${s.spellDc ?? 10}** | ${s.cantripsPerDay ?? 5} | **${s.focusCurrent ?? 1} / ${s.focusMax ?? 1}** | ${s.lvl1PerDay ?? 0} | ${s.lvl2PerDay ?? 0} |`);
    lines.push('');

    const renderSpellSection = (title, prefix, max, catalog, hasReady = false) => {
        const list = [];
        for (let i = 1; i <= max; i++) {
            const spName = String(s[`${prefix}${i}Name`] || '').trim();
            const spAct = String(s[`${prefix}${i}Actions`] || '').trim();
            const spNotes = String(s[`${prefix}${i}Notes`] || '').trim();
            const ready = hasReady ? !!s[`${prefix}${i}Ready`] : null;
            if (spName || spAct || spNotes) {
                const catMatch = findInCatalog(catalog, spName);
                list.push({ idx: i, name: spName, actions: spAct, notes: spNotes, ready, catMatch });
            }
        }
        if (!list.length) return false;

        lines.push(`#### ${title}`);
        if (hasReady) {
            lines.push('| Подг. | Заклинание | Действия / Дист. | Традиции / Источник | Полное описание и эффект |');
            lines.push('| :---: | :--- | :---: | :--- | :--- |');
        } else {
            lines.push('| # | Заклинание | Действия / Дист. | Традиции / Источник | Полное описание и эффект |');
            lines.push('| :---: | :--- | :---: | :--- | :--- |');
        }

        list.forEach(sp => {
            const firstCol = hasReady ? (sp.ready ? '✅' : '⬜') : `${sp.idx}`;
            const actText = sp.actions || sp.catMatch?.actions || '—';

            const metaParts = [];
            if (sp.catMatch?.traditions) metaParts.push(sp.catMatch.traditions.join(', '));
            if (sp.catMatch?.source) metaParts.push(sp.catMatch.source);
            const metaCell = safeCell(metaParts.join(' • '), '—');

            const fullNotes = [sp.notes, sp.catMatch?.notes]
                .filter(Boolean)
                .filter((v, idx, arr) => arr.indexOf(v) === idx)
                .join('\n\n');
            const descCell = safeCell(fullNotes, '—');

            lines.push(`| ${firstCol} | **${safeCell(sp.name, 'Без названия')}** | \`${safeCell(actText)}\` | ${metaCell} | ${descCell} |`);
        });
        lines.push('');
        return true;
    };

    const hasCantrips = renderSpellSection('✨ Фокусы (Заговоры)', 'cantrip', 5, PF2E_CANTRIPS, false);
    const hasFocus = renderSpellSection('💠 Фокальные заклинания', 'focusSpell', 3, PF2E_FOCUS_SPELLS, true);
    const hasLvl1 = renderSpellSection('1️⃣ Заклинания 1 круга', 'lvl1Spell', 7, PF2E_SPELLS_LVL1, false);
    const hasLvl2 = renderSpellSection('2️⃣ Заклинания 2 круга', 'lvl2Spell', 5, PF2E_SPELLS_LVL2, true);

    if (!hasCantrips && !hasFocus && !hasLvl1 && !hasLvl2) {
        lines.push('_Заклинания не заполнены._\n');
    }




    lines.push('### 🎒 Снаряжение и Монеты');
    lines.push('| 🥇 Золотые (ЗМ) | 🥈 Серебряные (СМ) | 🥉 Медные (ММ) |');
    lines.push('| :---: | :---: | :---: |');
    lines.push(`| **${s.coinsGold ?? 0}** | **${s.coinsSilver ?? 0}** | **${s.coinsCopper ?? 0}** |`);
    lines.push('');

    const items = [];
    for (let i = 1; i <= 15; i++) {
        const itName = String(s[`item${i}Name`] || '').trim();
        const itQty = Number(s[`item${i}Qty`]) ?? 1;
        const itNotes = String(s[`item${i}Notes`] || '').trim();
        if (itName || itNotes) {
            const catItem = findInCatalog(PF2E_ITEMS_CATALOG, itName);
            items.push({ idx: i, name: itName, qty: itQty, notes: itNotes, catItem });
        }
    }

    if (items.length > 0) {
        lines.push('| # | Предмет | Кол-во | Характеристики | Полное описание и эффект |');
        lines.push('| :---: | :--- | :---: | :--- | :--- |');

        items.forEach(it => {
            const metaParts = [];
            if (it.catItem?.category) metaParts.push(`Кат.: ${it.catItem.category}`);
            if (it.catItem?.level !== undefined) metaParts.push(`Ур.: ${it.catItem.level}`);
            if (it.catItem?.price) metaParts.push(`Цена: ${it.catItem.price}`);
            if (it.catItem?.bulk) metaParts.push(`Масса: ${it.catItem.bulk}`);
            if (it.catItem?.traits) metaParts.push(`Дескр.: ${it.catItem.traits}`);
            const metaCell = safeCell(metaParts.join(' • '), '—');

            const fullDesc = [it.notes, it.catItem?.notes, it.catItem?.desc]
                .filter(Boolean)
                .filter((v, idx, arr) => arr.indexOf(v) === idx)
                .join('\n\n');
            const descCell = safeCell(fullDesc, '—');

            lines.push(`| ${it.idx} | **${safeCell(it.name, 'Предмет')}** | ×${it.qty} | ${metaCell} | ${descCell} |`);
        });
    } else {
        lines.push('_Рюкзак пуст._');
    }
    lines.push('');



    lines.push('### 🐾 Спутники');
    const compTypeLabels = { none: 'Нет', companion: '🐅 Верный зверь', familiar: '🦉 Фамильяр' };
    if ((s.compType && s.compType !== 'none') || String(s.compName || '').trim() || String(s.compAbilitiesText || '').trim()) {
        lines.push('| Тип спутника | Имя / Вид | ❤️ ПЗ (Тек. / Макс.) | 🛡️ КБ | 👟 Скорость |');
        lines.push('| :---: | :--- | :---: | :---: | :---: |');
        lines.push(`| ${compTypeLabels[s.compType] || safeCell(s.compType)} | **${safeCell(s.compName)}** | **${s.compHpCur ?? 0} / ${s.compHpMax ?? 0}** | **${s.compAc ?? 10}** | ${s.compSpeed ?? 25} фт. |`);
        lines.push('');

        const speciesObj = s.compSpeciesId
            ? (PF2E_COMPANION_ABILITIES || []).find(x => x.id === s.compSpeciesId)
            : findInCatalog(PF2E_COMPANION_ABILITIES, s.compName);

        const compDetails = [];
        if (speciesObj) {
            const specLines = formatObjDetails(speciesObj, ['id', 'name', 'type', 'hasTough', 'desc'])
                .map(l => l.replace(/^- /, ''));
            compDetails.push([`Справочные характеристики вида (${speciesObj.name})`, safeCell(specLines.join(' • '))]);
        }
        if (String(s.compAbilitiesText || '').trim()) {
            compDetails.push(['Активные способности и расчёт параметров', safeCell(s.compAbilitiesText)]);
        }

        if (compDetails.length > 0) {
            lines.push('| Раздел | Полное описание |');
            lines.push('| :--- | :--- |');
            compDetails.forEach(([title, text]) => {
                lines.push(`| **${title}** | ${text} |`);
            });
        }
    } else {
        lines.push('_Спутник отсутствует._');
    }
    lines.push('');



    lines.push('### 📖 Журнал приключений');
    lines.push(String(s.adventureLogText || '').trim() ? String(s.adventureLogText).trim() : '_Записей нет._');
    lines.push('');

    lines.push('### 📝 Заметки персонажа');
    lines.push(String(s.notesText || '').trim() ? String(s.notesText).trim() : '_Заметок нет._');
    lines.push('');

    lines.push('### 📚 Книга заклинаний и формул');
    lines.push(String(s.spellbookText || '').trim() ? String(s.spellbookText).trim() : '_Книга заклинаний пуста._');
    lines.push('');

    return lines.join('\n');
}

export function downloadCharacterMarkdown(hero) {
    if (!hero) return;
    const mdContent = buildCharacterMarkdown(hero);
    const safeFileName = String(hero.name || 'character')
        .replace(/[\\/:*?"<>|]/g, '_')
        .trim() || 'character';

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeFileName}_PF2e.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
