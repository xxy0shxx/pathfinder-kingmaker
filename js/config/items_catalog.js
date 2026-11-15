/**
 * Справочник снаряжения, зелий, провизии и ингредиентов Pathfinder 2e Kingmaker (перевод pf2.ru)
 */
export const PF2E_ITEMS_CATALOG = [
    // --- Провизия и ингредиенты для привала Kingmaker ---
    {
        id: 'rations',
        name: '🍞 Сух. паёк (1 день)',
        category: 'Провизия',
        notes: 'Суточный рацион на 1 день пути или привала (7 дней = 4 СМ).'
    },
    {
        id: 'normal_ingredients',
        name: '🏕️ Обычные ингредиенты',
        category: 'Привал',
        notes: 'Базовые припасы для приготовления сытной пищи в лагере.'
    },
    {
        id: 'special_ingredients',
        name: '🌿 Особые ингредиенты',
        category: 'Привал',
        notes: 'Редкие травы, дичь или специи для приготовления особых блюд на привале.'
    },

    // --- Зелья и эликсиры ---
    {
        id: 'minor_healing_potion',
        name: '🧪 Слабое зелье исцеления',
        category: 'Зелье (1 ур.)',
        notes: '◆ (Взаимодействие): восстанавливает 1d8 ПЗ (4 ЗМ).'
    },
    {
        id: 'lesser_healing_potion',
        name: '🧪 Малое зелье исцеления',
        category: 'Зелье (3 ур.)',
        notes: '◆ (Взаимодействие): восстанавливает 2d8+5 ПЗ (12 ЗМ).'
    },
    {
        id: 'moderate_healing_potion',
        name: '🧪 Умеренное зелье исцеления',
        category: 'Зелье (6 ур.)',
        notes: '◆ (Взаимодействие): восстанавливает 3d8+10 ПЗ (50 ЗМ).'
    },
    {
        id: 'minor_elixir_of_life',
        name: '🧪 Слабый эликсир жизни',
        category: 'Эликсир (1 ур.)',
        notes: '◆: восстанавливает 1d6 ПЗ и даёт бонус предмета +1 к спасброскам от болезней и ядов на 10 мин. (3 ЗМ).'
    },
    {
        id: 'lesser_elixir_of_life',
        name: '🧪 Малый эликсир жизни',
        category: 'Эликсир (5 ур.)',
        notes: '◆: восстанавливает 3d6+6 ПЗ и даёт бонус предмета +1 к спасброскам от болезней и ядов на 10 мин. (30 ЗМ).'
    },
    {
        id: 'lesser_antidote',
        name: '🧪 Малое противоядие',
        category: 'Эликсир (1 ур.)',
        notes: '◆: бонус предмета +2 к спасброскам Стойкости против ядов на 6 часов (3 ЗМ).'
    },
    {
        id: 'lesser_antiplague',
        name: '🧪 Малый античум',
        category: 'Эликсир (1 ур.)',
        notes: '◆: бонус предмета +2 к спасброскам Стойкости против болезней на 24 часа (3 ЗМ).'
    },
    {
        id: 'cats_eye_elixir',
        name: '🧪 Эликсир кошачьего глаза',
        category: 'Эликсир (2 ур.)',
        notes: '◆: снижает плоскую проверку при атаке по скрытым существам до СЛ 3 (и до СЛ 9 по невидимым) на 1 мин. (7 ЗМ).'
    },
    {
        id: 'lesser_cheetahs_elixir',
        name: '🧪 Малый эликсир гепарда',
        category: 'Эликсир (1 ур.)',
        notes: '◆: бонус состояния +5 фт. к скорости на 1 минуту (3 ЗМ).'
    },
    {
        id: 'lesser_eagles_eye_elixir',
        name: '🧪 Малый эликсир орлиного глаза',
        category: 'Эликсир (1 ур.)',
        notes: '◆: бонус предмета +1 к проверкам Восприятия (+2 для поиска тайных дверей и ловушек) на 1 час (4 ЗМ).'
    },

    // --- Боевое и походное снаряжение ---
    {
        id: 'healers_tools',
        name: '💼 Набор лекаря',
        category: 'Инструменты',
        notes: 'Необходим для оказания первой помощи, лечения ран и медицины в бою (5 ЗМ).'
    },
    {
        id: 'thieves_tools',
        name: '🛠️ Воровские инструменты',
        category: 'Инструменты',
        notes: 'Необходимы для взлома замков и MacOS/обезвреживания устройств (3 ЗМ).'
    },
    {
        id: 'repair_kit',
        name: '🔨 Ремонтный набор',
        category: 'Инструменты',
        notes: 'Позволяет чинить повреждённые щиты и доспехи с помощью Ремесла (2 ЗМ).'
    },
    {
        id: 'adventurers_pack',
        name: '🎒 Набор искателя приключений',
        category: 'Снаряжение',
        notes: 'Рюкзак, спальник, 10 факелов, огниво, 50 фт. верёвки, мыло, бурдюк, сух. паёк на 14 дней (15 СМ).'
    },
    {
        id: 'torch',
        name: '🕯️ Факел',
        category: 'Свет',
        notes: 'Горит 1 час: яркий свет 20 фт. и тусклый свет ещё 20 фт. (1 ММ).'
    },
    {
        id: 'rope_50ft',
        name: '🪢 Верёвка (50 фт.)',
        category: 'Снаряжение',
        notes: 'Пеньковая верёвка длиной 50 футов (5 СМ).'
    },
    {
        id: 'crowbar',
        name: '🔨 Ломик',
        category: 'Инструменты',
        notes: 'Убирает штраф −2 при попытках взломать или выбить двери и сундуки Атлетикой (5 СМ).'
    },
    {
        id: 'grappling_hook',
        name: '🪢 Кошка с верёвкой',
        category: 'Снаряжение',
        notes: 'Позволяет зацепиться за уступ для подъёма (1 СМ).'
    },
    {
        id: 'alchemists_fire_lesser',
        name: '💥 Малый алхимический огонь',
        category: 'Бомба (1 ур.)',
        notes: '◆ (20 фт.): 1d8 урона огнём + 1 продолжительного огнём + 1 урон огнём брызгами (3 ЗМ).'
    },
    {
        id: 'acid_flask_lesser',
        name: '💥 Малая склянка с кислотой',
        category: 'Бомба (1 ур.)',
        notes: '◆ (20 фт.): 1 урон кислотой + 1d6 продолжительного кислотой + 1 урон кислотой брызгами (3 ЗМ).'
    },
    {
        id: 'scroll_heal_1',
        name: '📜 Свиток Исцеления (1 круг)',
        category: 'Свиток (1 ур.)',
        notes: 'Позволяет сотворить заклинание «Исцеление» 1-го круга (4 ЗМ).'
    },
    {
        id: 'scroll_magic_weapon',
        name: '📜 Свиток Волшебного оружия (1 круг)',
        category: 'Свиток (1 ур.)',
        notes: 'Позволяет сотворить заклинание «Волшебное оружие» 1-го круга (4 ЗМ).'
    }
];

export function searchItemsCatalog(query = '') {
    const q = String(query || '').trim().toLowerCase().replace(/ё/g, 'е');
    if (!q) return PF2E_ITEMS_CATALOG;
    return PF2E_ITEMS_CATALOG.filter(it =>
        it.name.toLowerCase().replace(/ё/g, 'е').includes(q) ||
        it.category.toLowerCase().replace(/ё/g, 'е').includes(q) ||
        it.notes.toLowerCase().replace(/ё/g, 'е').includes(q)
    );
}

/**
 * Проверяет, является ли предмет боевым расходником (зелья, эликсиры, бомбы, свитки и т.д.)
 */
export function isCombatConsumable(itemName, itemNotes = '') {
    const cleanName = String(itemName || '').trim().toLowerCase().replace(/ё/g, 'е');
    if (!cleanName) return false;

    // Поддержка проверки как с иконками, так и без них
    const found = PF2E_ITEMS_CATALOG.find(it => {
        const targetName = it.name.toLowerCase().replace(/ё/g, 'е');
        return targetName === cleanName || targetName.slice(3) === cleanName;
    });

    if (found) {
        return /^(Зелье|Эликсир|Бомба|Свиток|Талисман|Масло)/i.test(found.category);
    }

    // Если предмет вписан игроком вручную — проверяем по ключевым словам
    const text = `${cleanName} ${String(itemNotes || '').toLowerCase().replace(/ё/g, 'е')}`;
    return /(зель|эликсир|бомб|склянк|свиток|масл|талисман|противояд|античум)/i.test(text);
}
