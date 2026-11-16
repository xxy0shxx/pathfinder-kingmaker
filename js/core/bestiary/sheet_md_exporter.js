import { PF2E_SHEET_CONFIG, ensureCharacterStats } from './bestiary_config.js';

const fmtMod = (val) => {
    const n = Number(val) || 0;
    return n >= 0 ? `+${n}` : `${n}`;
};

const safeText = (val, fallback = '—') => {
    const s = String(val ?? '').trim();
    return s ? s.replace(/\|/g, '\\|') : fallback;
};

const profRankLabel = (prof) => {
    const p = Number(prof) || 0;
    if (p >= 8) return 'Легенда';
    if (p >= 6) return 'Мастер';
    if (p >= 4) return 'Эксперт';
    if (p >= 2) return 'Изучено';
    return 'Не изучено';
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

    const lines = [];

    // =========================================================================
    // ЗАГОЛОВОК И ОБЩАЯ ИНФОРМАЦИЯ
    // =========================================================================
    lines.push(`# 🛡️ ${name}`);
    lines.push(`> **Игрок:** ${safeText(s.playerName)} | **Уровень:** ${s.level ?? 1} | **Опыт (XP):** ${s.xp ?? 0} | **Базовая инициатива:** ${hero.defaultScore ?? 10}`);
    lines.push('');
    lines.push('| Параметр | Значение |');
    lines.push('| :--- | :--- |');
    lines.push(`| **🧬 Народ** | ${safeText(s.ancestry)} |`);
    lines.push(`| **🌿 Наследие / Способность народа** | ${safeText(s.heritage)} |`);
    lines.push(`| **📜 Происхождение** | ${safeText(s.background)} |`);
    lines.push(`| **✨ Способность происхождения** | ${safeText(s.backgroundFeat)} |`);
    lines.push(`| **⚔️ Класс** | ${safeText(s.charClass)} |`);
    lines.push(`| **⚖️ Мировоззрение** | ${alignMap[s.alignment] || safeText(s.alignment)} |`);
    lines.push('');

    // =========================================================================
    // СТРАНИЦА 1: БОЙ, ЗАЩИТА, ХАРАКТЕРИСТИКИ И НАВЫКИ
    // =========================================================================
    lines.push('---');
    lines.push('## 📄 Страница 1: Бой, Защита и Навыки');
    lines.push('');

    // 1. Здоровье, скорость и КБ
    lines.push('### ❤️ Здоровье, Скорость и Класс Брони');
    lines.push('| ❤️ Макс. ПЗ | 🩸 Текущие ПЗ | 💠 Врем. ПЗ | 👟 Скорость | 🛡️ Итоговый КБ |');
    lines.push('| :---: | :---: | :---: | :---: | :---: |');
    lines.push(`| **${s.hpMax ?? 10}** | ${s.hpCurrent ?? 10} | ${s.hpTemp ?? 0} | ${s.speed ?? 25} фт. | **${s.ac ?? 10}** |`);
    lines.push('');

    lines.push('**Детализация КБ и Доспехов:**');
    lines.push(`- **Доспех:** ${safeText(s.armorName)} (${armorTypeMap[s.armorType] || s.armorType})`);
    lines.push(`- **Формула КБ:** 10 + ${s.acDex ?? 0} (Лвк) + ${s.acProf ?? 0} (Умение) + ${s.acItem ?? 0} (Предмет) + ${s.acOther ?? 0} (Прочее) = **${s.ac ?? 10}**`);
    lines.push(`- **Штраф проверки доспеха:** ${s.acArmorPenalty ?? 0}`);
    if (Number(s.acShieldBonus) > 0 || Number(s.acShieldHp) > 0 || Number(s.acShieldHardness) > 0) {
        lines.push(`- **🛡️ Щит:** Бонус при поднятии **+${s.acShieldBonus ?? 0}** | Твёрдость: **${s.acShieldHardness ?? 0}** | Текущие ПЗ щита: **${s.acShieldHp ?? 0}**`);
    }
    lines.push('');

    // 2. Характеристики
    lines.push('### ⚔️ Модификаторы характеристик');
    lines.push('| 💪 СИЛ | 🤸 ЛВК | 🫀 ВЫН | 📘 ИНТ | 🦉 МДР | 🎭 ХАР |');
    lines.push('| :---: | :---: | :---: | :---: | :---: | :---: |');
    lines.push(`| **${fmtMod(s.str)}** | **${fmtMod(s.dex)}** | **${fmtMod(s.con)}** | **${fmtMod(s.int)}** | **${fmtMod(s.wis)}** | **${fmtMod(s.cha)}** |`);
    lines.push('');

    // 3. Внимание и Спасброски
    lines.push('### 👁️ Внимание и Испытания (Спасброски)');
    lines.push('| Параметр | Итоговый модификатор | Бонус умения | Ранг |');
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
        lines.push(`\n> **Заметки по восприятию:** ${safeText(s.perceptionNotes)}`);
    }
    lines.push('');

    // 4. Навыки
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
        lines.push(`\n> **Прочие навыки и заметки:** ${safeText(s.skillOtherNotes)}`);
    }
    lines.push('');

    // 5. Оружие и Атаки
    lines.push('### 🗡️ Оружие и Атаки');
    const weapons = [
        { type: 'Ближний бой 1', name: s.melee1Name, atk: s.melee1Atk, dmg: s.melee1Dmg, traits: s.melee1Traits },
        { type: 'Ближний бой 2', name: s.melee2Name, atk: s.melee2Atk, dmg: s.melee2Dmg, traits: s.melee2Traits },
        { type: 'Дистанционное', name: s.rangedName, atk: s.rangedAtk, dmg: s.rangedDmg, traits: s.rangedTraits }
    ].filter(w => String(w.name || '').trim() || String(w.atk || '').trim() || String(w.dmg || '').trim());

    if (weapons.length > 0) {
        lines.push('| Слот | Оружие | Атака | Урон | Дескрипторы |');
        lines.push('| :--- | :--- | :---: | :---: | :--- |');
        weapons.forEach(w => {
            lines.push(`| ${w.type} | **${safeText(w.name)}** | **${safeText(w.atk)}** | ${safeText(w.dmg)} | ${safeText(w.traits)} |`);
        });
    } else {
        lines.push('_Оружие не заполнено._');
    }
    if (String(s.weaponProfNotes || '').trim()) {
        lines.push(`\n> **Умения в оружии:** ${safeText(s.weaponProfNotes)}`);
    }
    lines.push('');

    // 6. Боевые черты класса и архетипов
    lines.push('### ⚔️ Боевые черты класса и архетипов');
    const featLevels = [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
    const filledFeats = featLevels
        .map(lvl => ({
            lvl,
            name: String(s[`classFeatLvl${lvl}Name`] || '').trim(),
            desc: String(s[`classFeatLvl${lvl}Desc`] || '').trim()
        }))
        .filter(f => f.name || f.desc);

    if (filledFeats.length > 0) {
        lines.push('| Ур. | Название черты | Действие и Эффект |');
        lines.push('| :---: | :--- | :--- |');
        filledFeats.forEach(f => {
            lines.push(`| **${f.lvl}** | **${safeText(f.name)}** | ${safeText(f.desc)} |`);
        });
    } else {
        lines.push('_Черты класса не заполнены._');
    }
    lines.push('');
    // =========================================================================
    // СТРАНИЦА 2: МАГИЯ, СНАРЯЖЕНИЕ, СПУТНИКИ И ЗАМЕТКИ
    // =========================================================================
    lines.push('---');
    lines.push('## 📜 Страница 2: Магия, Снаряжение, Спутники и Заметки');
    lines.push('');

    // 1. Заклинания
    lines.push('### ✨ Сотворение заклинаний');
    lines.push(`- **Атака заклинанием:** **${fmtMod(s.spellAttack)}** | **СЛ заклинаний:** **${s.spellDc ?? 10}**`);
    lines.push(`- **Фокусов в день:** ${s.cantripsPerDay ?? 5} | **Фокальные пункты (ФП):** ${s.focusCurrent ?? 1} / ${s.focusMax ?? 1}`);
    if (Number(s.lvl1PerDay) > 0 || Number(s.lvl2PerDay) > 0) {
        lines.push(`- **Ячейки заклинаний:** 1 круг — **${s.lvl1PerDay ?? 0}** / день | 2 круг — **${s.lvl2PerDay ?? 0}** / день`);
    }
    lines.push('');

    const collectSpells = (prefix, max, hasReady = false) => {
        const res = [];
        for (let i = 1; i <= max; i++) {
            const spName = String(s[`${prefix}${i}Name`] || '').trim();
            const spAct = String(s[`${prefix}${i}Actions`] || '').trim();
            const spNotes = String(s[`${prefix}${i}Notes`] || '').trim();
            const ready = hasReady ? (s[`${prefix}${i}Ready`] ? '✅' : '⬜') : null;
            if (spName || spAct || spNotes) {
                res.push({ idx: i, name: spName, actions: spAct, notes: spNotes, ready });
            }
        }
        return res;
    };

    const cantrips = collectSpells('cantrip', 5, false);
    const focusSpells = collectSpells('focusSpell', 3, true);
    const lvl1Spells = collectSpells('lvl1Spell', 7, false);
    const lvl2Spells = collectSpells('lvl2Spell', 5, true);

    if (cantrips.length > 0) {
        lines.push('#### ✨ Фокусы');
        lines.push('| # | Название | Действия / Дист. | Эффект |');
        lines.push('| :---: | :--- | :---: | :--- |');
        cantrips.forEach(sp => lines.push(`| ${sp.idx} | **${safeText(sp.name)}** | ${safeText(sp.actions)} | ${safeText(sp.notes)} |`));
        lines.push('');
    }

    if (focusSpells.length > 0) {
        lines.push('#### 💠 Фокальные заклинания');
        lines.push('| Подг. | Название | Действия / Дист. | Эффект |');
        lines.push('| :---: | :--- | :---: | :--- |');
        focusSpells.forEach(sp => lines.push(`| ${sp.ready} | **${safeText(sp.name)}** | ${safeText(sp.actions)} | ${safeText(sp.notes)} |`));
        lines.push('');
    }

    if (lvl1Spells.length > 0) {
        lines.push('#### 1️⃣ Заклинания 1 круга');
        lines.push('| # | Название | Действия / Дист. | Эффект |');
        lines.push('| :---: | :--- | :---: | :--- |');
        lvl1Spells.forEach(sp => lines.push(`| ${sp.idx} | **${safeText(sp.name)}** | ${safeText(sp.actions)} | ${safeText(sp.notes)} |`));
        lines.push('');
    }

    if (lvl2Spells.length > 0) {
        lines.push('#### 2️⃣ Заклинания 2 круга');
        lines.push('| Подг. | Название | Действия / Дист. | Эффект |');
        lines.push('| :---: | :--- | :---: | :--- |');
        lvl2Spells.forEach(sp => lines.push(`| ${sp.ready} | **${safeText(sp.name)}** | ${safeText(sp.actions)} | ${safeText(sp.notes)} |`));
        lines.push('');
    }

    if (!cantrips.length && !focusSpells.length && !lvl1Spells.length && !lvl2Spells.length) {
        lines.push('_Заклинания не заполнены._\n');
    }

    // 2. Снаряжение и Монеты
    lines.push('### 🎒 Снаряжение и Монеты');
    lines.push(`- **Кошелёк:** 🥇 **${s.coinsGold ?? 0}** ЗМ | 🥈 **${s.coinsSilver ?? 0}** СМ | 🥉 **${s.coinsCopper ?? 0}** ММ`);
    lines.push('');

    const items = [];
    for (let i = 1; i <= 15; i++) {
        const itName = String(s[`item${i}Name`] || '').trim();
        const itQty = Number(s[`item${i}Qty`]) ?? 1;
        const itNotes = String(s[`item${i}Notes`] || '').trim();
        if (itName || itNotes) {
            items.push({ idx: i, name: itName, qty: itQty, notes: itNotes });
        }
    }

    if (items.length > 0) {
        lines.push('| # | Предмет | Кол-во | Эффект, вес, заметки |');
        lines.push('| :---: | :--- | :---: | :--- |');
        items.forEach(it => lines.push(`| ${it.idx} | **${safeText(it.name)}** | ×${it.qty} | ${safeText(it.notes)} |`));
    } else {
        lines.push('_Рюкзак пуст._');
    }
    lines.push('');

    // 3. Спутники (Верный зверь / Фамильяр)
    lines.push('### 🐾 Спутники');
    const compTypeLabels = {
        none: 'Нет',
        companion: '🐅 Верный зверь',
        familiar: '🦉 Фамильяр'
    };
    if ((s.compType && s.compType !== 'none') || String(s.compName || '').trim() || String(s.compAbilitiesText || '').trim()) {
        lines.push(`- **Тип:** ${compTypeLabels[s.compType] || s.compType} | **Имя / Вид:** **${safeText(s.compName)}**`);
        lines.push(`- **Параметры:** ❤️ ПЗ **${s.compHpCur ?? 0} / ${s.compHpMax ?? 0}** | 🛡️ КБ **${s.compAc ?? 10}** | 👟 Скорость **${s.compSpeed ?? 25} фт.**`);
        if (String(s.compAbilitiesText || '').trim()) {
            lines.push('');
            lines.push('**Способности и описание спутника:**');
            String(s.compAbilitiesText).trim().split('\n').forEach(line => {
                lines.push(`> ${line}`);
            });
        }
    } else {
        lines.push('_Спутник отсутствует._');
    }
    lines.push('');

    // 4. Журнал приключений, Заметки и Книга заклинаний
    lines.push('### 📖 Журнал приключений');
    lines.push(String(s.adventureLogText || '').trim() ? String(s.adventureLogText).trim() : '_Записей нет._');
    lines.push('');

    lines.push('### 📝 Заметки');
    lines.push(String(s.notesText || '').trim() ? String(s.notesText).trim() : '_Заметок нет._');
    lines.push('');

    lines.push('### 📚 Книга заклинаний');
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
