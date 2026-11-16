import { PF2E_SHEET_CONFIG, ensureCharacterStats } from './bestiary_config.js';
import { PF2E_ANCESTRIES, PF2E_CLASSES } from '../../config/meta_catalog.js';
import { PF2E_BACKGROUNDS } from '../../config/backgrounds_catalog.js';
import { PF2E_MELEE_WEAPONS, PF2E_RANGED_WEAPONS, getWeaponCritEffect } from '../../config/weapons_catalog.js';
import { PF2E_CANTRIPS } from '../../config/cantrips_catalog.js';
import { PF2E_FOCUS_SPELLS } from '../../config/focus_spells_catalog.js';
import { PF2E_SPELLS_LVL1 } from '../../config/spells_lvl1_catalog.js';
import { PF2E_SPELLS_LVL2 } from '../../config/spells_lvl2_catalog.js';
import { PF2E_ITEMS_CATALOG } from '../../config/items_catalog.js';
import { PF2E_COMPANION_ABILITIES } from '../../config/companions_catalog.js';

const fmtMod = (val) => {
    const n = Number(val) || 0;
    return n >= 0 ? `+${n}` : `${n}`;
};

const safeCell = (val, fallback = '—') => {
    const s = String(val ?? '').trim();
    return s ? s.replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>') : fallback;
};

const norm = (str) => String(str || '')
    .replace(/^[^\p{L}\p{N}]+/u, '')
    .trim()
    .toLowerCase()
    .replace(/ё/g, 'е');

const findInCatalog = (list, queryName) => {
    const q = norm(queryName);
    if (!q || !Array.isArray(list)) return null;
    return list.find(item => {
        const n = norm(item.name);
        return n === q || n.includes(q) || q.includes(n);
    }) || null;
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
        'ЗД': 'Законопослушный Добрый (ЗД)',
        'НД': 'Нейтральный Добрый (НД)',
        'ХД': 'Хаотичный Добрый (ХД)',
        'ЗН': 'Законопослушный Нейтральный (ЗН)',
        'ИН': 'Истинный Нейтральный (Н)',
        'Н': 'Истинный Нейтральный (Н)',
        'ХН': 'Хаотичный Нейтральный (ХН)',
        'ЗЗ': 'Законопослушный Злой (ЗЗ)',
        'НЗ': 'Нейтральный Злой (НЗ)',
        'ХЗ': 'Хаотичный Злой (ХЗ)'
    };

    const armorTypeMap = {
        unarmored: 'Без брони / Ткань',
        light: 'Лёгкая броня',
        medium: 'Средняя броня',
        heavy: 'Тяжёлая броня'
    };

    const ancestryObj = findInCatalog(PF2E_ANCESTRIES, s.ancestry);
    const bgObj = findInCatalog(PF2E_BACKGROUNDS, s.background);
    const classObj = findInCatalog(PF2E_CLASSES, s.charClass);

    const lines = [];

    lines.push(`# 🛡️ ${name}`);
    lines.push(`> **Игрок:** ${safeCell(s.playerName)} | **Уровень:** ${s.level ?? 1} | **Опыт (XP):** ${s.xp ?? 0} | **Базовая инициатива:** ${hero.defaultScore ?? 10}`);
    lines.push('');

    lines.push('## 🧬 Происхождение, Народ и Класс');
    lines.push('| Параметр | Значение |');
    lines.push('| :--- | :--- |');
    lines.push(`| **🧬 Народ** | **${safeCell(s.ancestry)}** |`);
    lines.push(`| **🌿 Наследие / Способность народа** | ${safeCell(s.heritage)} |`);
    lines.push(`| **📜 Происхождение** | **${safeCell(s.background)}** |`);
    lines.push(`| **✨ Способность / Черта происхождения** | ${safeCell(s.backgroundFeat)} |`);
    lines.push(`| **⚔️ Класс** | **${safeCell(s.charClass)}** |`);
    lines.push(`| **⚖️ Мировоззрение** | ${alignMap[s.alignment] || safeCell(s.alignment)} |`);
    lines.push('');

    if (ancestryObj) {
        lines.push(`### 🧬 Особенности народа: ${ancestryObj.name}`);
        lines.push(`- **Ключевые черты:** ${ancestryObj.traits}`);
        lines.push('');
    }

    if (bgObj) {
        lines.push(`### 📜 Подробности происхождения: ${bgObj.name}`);
        lines.push(`- **Изученный навык:** ${bgObj.skillName} | **Знание:** ${bgObj.lore}`);
        lines.push(`- **Бонусная черта:** ${bgObj.feat} | **Источник:** ${bgObj.source}`);
        lines.push(`- **Описание:** ${bgObj.desc}`);
        lines.push('');
    }

    if (classObj) {
        lines.push(`### ⚔️ Подробности класса: ${classObj.name}`);
        lines.push(`- **ПЗ за уровень:** ${classObj.hp} | **Ключевая характеристика:** ${classObj.keyStat}`);
        lines.push(`- **Описание:** ${classObj.desc}`);
        lines.push('');
    }
    // =========================================================================
    // СТРАНИЦА 1: БОЙ, ЗАЩИТА, ХАРАКТЕРИСТИКИ И НАВЫКИ
    // =========================================================================
    lines.push('---');
    lines.push('## 📄 Страница 1: Бой, Защита и Навыки');
    lines.push('');

    lines.push('### ❤️ Здоровье, Скорость и Класс Брони');
    lines.push('| ❤️ Макс. ПЗ | 🩸 Текущие ПЗ | 💠 Врем. ПЗ | 👟 Скорость | 🛡️ Итоговый КБ |');
    lines.push('| :---: | :---: | :---: | :---: | :---: |');
    lines.push(`| **${s.hpMax ?? 10}** | ${s.hpCurrent ?? 10} | ${s.hpTemp ?? 0} | ${s.speed ?? 25} фт. | **${s.ac ?? 10}** |`);
    lines.push('');

    lines.push('**Детализация КБ, Доспехов и Щита:**');
    lines.push(`- **Доспех:** ${safeCell(s.armorName)} (${armorTypeMap[s.armorType] || s.armorType})`);
    lines.push(`- **Формула КБ:** 10 + ${s.acDex ?? 0} (Лвк) + ${s.acProf ?? 0} (Умение) + ${s.acItem ?? 0} (Предмет) + ${s.acOther ?? 0} (Прочее) = **${s.ac ?? 10}**`);
    lines.push(`- **Штраф проверки доспеха:** ${s.acArmorPenalty ?? 0}`);
    lines.push(`- **🛡️ Щит:** Бонус при поднятии **+${s.acShieldBonus ?? 0}** | Твёрдость: **${s.acShieldHardness ?? 0}** | Текущие ПЗ щита: **${s.acShieldHp ?? 0}**`);
    lines.push('');

    lines.push('### ⚔️ Модификаторы характеристик');
    lines.push('| 💪 СИЛ | 🤸 ЛВК | 🫀 ВЫН | 📘 ИНТ | 🦉 МДР | 🎭 ХАР |');
    lines.push('| :---: | :---: | :---: | :---: | :---: | :---: |');
    lines.push(`| **${fmtMod(s.str)}** | **${fmtMod(s.dex)}** | **${fmtMod(s.con)}** | **${fmtMod(s.int)}** | **${fmtMod(s.wis)}** | **${fmtMod(s.cha)}** |`);
    lines.push('');

    lines.push('### 👁️ Внимание и Испытания (Спасброски)');
    lines.push('| Параметр | Итоговый модификатор | Бонус умения | Ранг владения |');
    lines.push('| :--- | :---: | :---: | :--- |');
    const savesList = [
        ['👁️ Внимание (Мдр)', s.perception, s.saveProf_perc],
        ['🛡️ Стойкость (Вын)', s.fortitude, s.saveProf_fort],
        ['⚡ Реакция (Лвк)', s.reflex, s.saveProf_ref],
        ['🧠 Воля (Мдр)', s.will, s.saveProf_will]
    ];
    savesList.forEach(([label, total, prof]) => {
        lines.push(`| ${label} | **${fmtMod(total)}** | +${prof ?? 0} | ${profRankLabel(prof)} |`);
    });
    if (String(s.perceptionNotes || '').trim()) {
        lines.push('');
        lines.push('**Чувства и заметки по восприятию:**');
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
        lines.push('');
        lines.push('**Знания (Lore), языки и прочие навыки:**');
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
        lines.push('| Слот | Оружие | Атака | Урон | Дескрипторы |');
        lines.push('| :--- | :--- | :---: | :---: | :--- |');
        weapons.forEach(w => {
            lines.push(`| ${w.type} | **${safeCell(w.name)}** | **${safeCell(w.atk)}** | ${safeCell(w.dmg)} | ${safeCell(w.traits)} |`);
        });
        lines.push('');

        weapons.forEach(w => {
            const catItem = findInCatalog(w.isRanged ? PF2E_RANGED_WEAPONS : PF2E_MELEE_WEAPONS, w.name);
            if (catItem) {
                const critText = getWeaponCritEffect(catItem.group);
                lines.push(`- **${catItem.name}** (${catItem.category}, группа «${catItem.group}», рук: ${catItem.hands}):`);
                lines.push(`  - *Дескрипторы:* ${catItem.traits || 'Нет'}`);
                if (critText) {
                    lines.push(`  - *Критический эффект специализации:* ${critText}`);
                }
            }
        });
    } else {
        lines.push('_Оружие не заполнено._');
    }
    if (String(s.weaponProfNotes || '').trim()) {
        lines.push('');
        lines.push('**Умения в оружии и боевые заметки:**');
        lines.push(`> ${String(s.weaponProfNotes).trim().replace(/\r?\n/g, '\n> ')}`);
    }
    lines.push('');

    lines.push('### ⚔️ Боевые черты класса, народа и архетипов');
    const featLevels =[1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
    const filledFeats = featLevels
        .map(lvl => ({
            lvl,
            name: String(s[`classFeatLvl${lvl}Name`] || '').trim(),
            desc: String(s[`classFeatLvl${lvl}Desc`] || '').trim()
        }))
        .filter(f => f.name || f.desc);

    if (filledFeats.length > 0) {
        filledFeats.forEach(f => {
            lines.push(`#### 🔹 Уровень ${f.lvl}: ${f.name || 'Без названия'}`);
            lines.push(f.desc ? f.desc : '_Описание не заполнено._');
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
    lines.push(`- **Атака заклинанием:** **${fmtMod(s.spellAttack)}** | **СЛ заклинаний:** **${s.spellDc ?? 10}**`);
    lines.push(`- **Фокусов в день:** ${s.cantripsPerDay ?? 5} | **Фокальные пункты (ФП):** ${s.focusCurrent ?? 1} / ${s.focusMax ?? 1}`);
    lines.push(`- **Ячейки заклинаний:** 1 круг — **${s.lvl1PerDay ?? 0}** / день | 2 круг — **${s.lvl2PerDay ?? 0}** / день`);
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
        list.forEach(sp => {
            const readyBadge = hasReady ? (sp.ready ? '✅ Подготовлено | ' : '⬜ Не подготовлено | ') : '';
            const actText = sp.actions || sp.catMatch?.actions || '—';
            const metaText = sp.catMatch?.traditions
                ? `Традиции: ${sp.catMatch.traditions.join(', ')}`
                : (sp.catMatch?.source ? `Источник: ${sp.catMatch.source}` : '');

            lines.push(`- **${sp.idx}. ${sp.name || 'Без названия'}** (${readyBadge}Действия/дист.: \`${actText}\`${metaText ? ` | ${metaText}` : ''})`);
            const fullNotes = sp.notes || sp.catMatch?.notes || '';
            if (fullNotes) {
                lines.push(`  > ${fullNotes.replace(/\r?\n/g, '\n  > ')}`);
            }
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
    lines.push(`- **Кошелёк:** 🥇 **${s.coinsGold ?? 0}** ЗМ | 🥈 **${s.coinsSilver ?? 0}** СМ | 🥉 **${s.coinsCopper ?? 0}** ММ`);
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
        items.forEach(it => {
            const metaParts = [];
            if (it.catItem?.category) metaParts.push(it.catItem.category);
            if (it.catItem?.price) metaParts.push(`Цена: ${it.catItem.price}`);
            if (it.catItem?.bulk) metaParts.push(`Масса: ${it.catItem.bulk}`);
            const metaStr = metaParts.length ? ` — *${metaParts.join(', ')}*` : '';

            lines.push(`- **${it.idx}. ${it.name || 'Предмет'}** (×${it.qty})${metaStr}`);
            const fullDesc = it.notes || it.catItem?.notes || '';
            if (fullDesc) {
                lines.push(`  > ${fullDesc.replace(/\r?\n/g, '\n  > ')}`);
            }
        });
    } else {
        lines.push('_Рюкзак пуст._');
    }
    lines.push('');

    lines.push('### 🐾 Спутники');
    const compTypeLabels = {
        none: 'Нет',
        companion: '🐅 Верный зверь',
        familiar: '🦉 Фамильяр'
    };
    if ((s.compType && s.compType !== 'none') || String(s.compName || '').trim() || String(s.compAbilitiesText || '').trim()) {
        lines.push(`- **Тип спутника:** ${compTypeLabels[s.compType] || s.compType}`);
        lines.push(`- **Имя / Вид:** **${safeCell(s.compName)}**`);
        lines.push(`- **Параметры:** ❤️ ПЗ **${s.compHpCur ?? 0} / ${s.compHpMax ?? 0}** | 🛡️ КБ **${s.compAc ?? 10}** | 👟 Скорость **${s.compSpeed ?? 25} фт.**`);

        const speciesObj = s.compSpeciesId
            ? (PF2E_COMPANION_ABILITIES || []).find(x => x.id === s.compSpeciesId)
            : findInCatalog(PF2E_COMPANION_ABILITIES, s.compName);

        if (speciesObj) {
            lines.push('');
            lines.push(`**Справочные характеристики вида (${speciesObj.name}):**`);
            lines.push(`> ${speciesObj.desc.replace(/\r?\n/g, '\n> ')}`);
        }

        if (String(s.compAbilitiesText || '').trim()) {
            lines.push('');
            lines.push('**Активные способности и расчёт параметров спутника:**');
            lines.push(`> ${String(s.compAbilitiesText).trim().replace(/\r?\n/g, '\n> ')}`);
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
