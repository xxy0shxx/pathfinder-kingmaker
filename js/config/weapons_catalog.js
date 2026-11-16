/**
 * Справочник оружия ближнего боя Pathfinder 2e (перевод pf2.ru)
 */
export const PF2E_MELEE_WEAPONS = [
    // --- Дополнения ближнего боя (Player Core 1 & 2, Тянь-Ша) ---
    { id: 'fist', name: '👊 Кулак (Безоружная атака)', category: 'Простое', dmgDice: '1d4', dmgType: 'Д', hands: 0, group: 'Кулачное', traits: 'Безоружное, Быстрое, Несмертельное, Фехтовальное', finesse: true },
    { id: 'knuckle_duster', name: '🥊 Кастет', category: 'Простое', dmgDice: '1d4', dmgType: 'Д', hands: 1, group: 'Кулачное', traits: 'Быстрое, Наручное', finesse: false },
    { id: 'clan_dagger', name: '🗡️ Клановый кинжал', category: 'Простое', dmgDice: '1d4', dmgType: 'Ко', hands: 1, group: 'Ножи', traits: 'Быстрое, Парирующее, Универсальное Р', finesse: false },
    { id: 'katar', name: '🗡️ Катар (Тычковый кинжал)', category: 'Простое', dmgDice: '1d4', dmgType: 'Ко', hands: 1, group: 'Ножи', traits: 'Быстрое, Добивающее d6, Наручное', finesse: false },
    { id: 'nightstick', name: '🪵 Полицейская дубинка (Тонфа)', category: 'Простое', dmgDice: '1d4', dmgType: 'Д', hands: 1, group: 'Дубины', traits: 'Быстрое, Несмертельное, Парирующее, Фехтовальное', finesse: true },
    { id: 'dogslicer', name: '🔪 Собакорез', category: 'Воинское', dmgDice: '1d6', dmgType: 'Р', hands: 1, group: 'Мечи', traits: 'Быстрое, Подлое, Фехтовальное', finesse: true },
    { id: 'horsechopper', name: '🪓 Конеруб', category: 'Воинское', dmgDice: '1d8', dmgType: 'Р', hands: 2, group: 'Древковое', traits: 'Длинное, Сбивающее, Универсальное Ко', finesse: false },
    { id: 'boarding_axe', name: '🪓 Абордажный топор', category: 'Воинское', dmgDice: '1d6', dmgType: 'Р', hands: 1, group: 'Топоры', traits: 'Быстрое, Универсальное Ко, Хваткое', finesse: false },
    { id: 'khopesh', name: '⚔️ Хопеш', category: 'Воинское', dmgDice: '1d8', dmgType: 'Р', hands: 1, group: 'Мечи', traits: 'Сбивающее', finesse: false },
    { id: 'naginata', name: '🗡️ Нагината', category: 'Воинское', dmgDice: '1d8', dmgType: 'Р', hands: 2, group: 'Древковое', traits: 'Длинное, Смертоносное d8, Универсальное Ко', finesse: false },
    { id: 'nodachi', name: '⚔️ Нодати', category: 'Воинское', dmgDice: '1d8', dmgType: 'Р', hands: 2, group: 'Мечи', traits: 'Длинное, Смертоносное d12, Упираемое', finesse: false },
    { id: 'wakizashi', name: '🗡️ Вакидзаси', category: 'Воинское', dmgDice: '1d4', dmgType: 'Р', hands: 1, group: 'Мечи', traits: 'Быстрое, Смертоносное d8, Универсальное Ко, Фехтовальное', finesse: true },
    { id: 'temple_sword', name: '⚔️ Храмовый меч', category: 'Воинское', dmgDice: '1d8', dmgType: 'Р', hands: 1, group: 'Мечи', traits: 'Сбивающее', finesse: false },
    { id: 'meteor_hammer', name: '☄️ Метеоритный молот', category: 'Воинское', dmgDice: '1d8', dmgType: 'Д', hands: 2, group: 'Цепы', traits: 'Длинное, Подлое, Разоружающее, Сбивающее', finesse: false },
    { id: 'kusarigama', name: '⛓️ Кусаригама', category: 'Воинское', dmgDice: '1d8', dmgType: 'Р', hands: 2, group: 'Ножи', traits: 'Длинное, Разоружающее, Сбивающее, Универсальное Д', finesse: false },
    { id: 'elven_curve_blade', name: '⚔️ Эльфийский изогнутый клинок', category: 'Экзотическое', dmgDice: '1d8', dmgType: 'Р', hands: 2, group: 'Мечи', traits: 'Напористое, Фехтовальное', finesse: true },
    { id: 'gnome_flickmace', name: '⛓️ Гномий хлыст-булава', category: 'Экзотическое', dmgDice: '1d6', dmgType: 'Д', hands: 1, group: 'Цепы', traits: 'Длинное, Размашистое', finesse: false },
    { id: 'orc_necksplitter', name: '🪓 Орочий шеелом', category: 'Экзотическое', dmgDice: '1d8', dmgType: 'Р', hands: 1, group: 'Топоры', traits: 'Напористое, Размашистое', finesse: false },
    { id: 'sawtooth_saber', name: '🪚 Зубчатая сабля', category: 'Экзотическое', dmgDice: '1d6', dmgType: 'Р', hands: 1, group: 'Мечи', traits: 'Быстрое, Парное, Фехтовальное', finesse: true },
    { id: 'urumi', name: '🪢 Уруми (Меч-хлыст)', category: 'Экзотическое', dmgDice: '1d6', dmgType: 'Р', hands: 1, group: 'Цепы', traits: 'Размашистое, Смертоносное d10', finesse: false },

    // --- Простое оружие ближнего боя ---
    { id: 'gauntlet', name: '🥊 Латная рукавица', category: 'Простое', dmgDice: '1d4', dmgType: 'Д', hands: 1, group: 'Кулачное', traits: 'Безоружное, Быстрое, Наручное', finesse: false },
    { id: 'dagger', name: '🗡️ Кинжал', category: 'Простое', dmgDice: '1d4', dmgType: 'Ко', hands: 1, group: 'Ножи', traits: 'Быстрое, Метательное 10 фт., Универсальное Р, Фехтовальное', finesse: true },
    { id: 'staff', name: '🥢 Посох', category: 'Простое', dmgDice: '1d4', dmgType: 'Д', hands: 1, group: 'Дубины', traits: 'Полуторное 1d8', finesse: false },
    { id: 'club', name: '🪵 Дубинка', category: 'Простое', dmgDice: '1d6', dmgType: 'Д', hands: 1, group: 'Дубины', traits: 'Метательное 10 фт.', finesse: false },
    { id: 'light_mace', name: '🔱 Лёгкая булава', category: 'Простое', dmgDice: '1d4', dmgType: 'Д', hands: 1, group: 'Дубины', traits: 'Быстрое, Толкающее, Фехтовальное', finesse: true },
    { id: 'morningstar', name: '💥 Моргенштерн', category: 'Простое', dmgDice: '1d6', dmgType: 'Д', hands: 1, group: 'Дубины', traits: 'Универсальное Ко', finesse: false },
    { id: 'mace', name: '🧌 Булава', category: 'Простое', dmgDice: '1d6', dmgType: 'Д', hands: 1, group: 'Дубины', traits: 'Толкающее', finesse: false },
    { id: 'sickle', name: '🌙 Серп', category: 'Простое', dmgDice: '1d4', dmgType: 'Р', hands: 1, group: 'Ножи', traits: 'Быстрое, Сбивающее, Фехтовальное', finesse: true },
    { id: 'spear', name: '🔱 Копьё', category: 'Простое', dmgDice: '1d6', dmgType: 'Ко', hands: 1, group: 'Копья', traits: 'Метательное 20 фт.', finesse: false },
    { id: 'spiked_gauntlet', name: '🥊 Шипастая рукавица', category: 'Простое', dmgDice: '1d4', dmgType: 'Ко', hands: 1, group: 'Кулачное', traits: 'Безоружное, Быстрое, Наручное', finesse: false },
    { id: 'longspear', name: '🔱 Длинное копьё', category: 'Простое', dmgDice: '1d8', dmgType: 'Ко', hands: 2, group: 'Копья', traits: 'Длинное', finesse: false },

    // --- Воинское оружие ближнего боя (Часть 1) ---
    { id: 'bastard_sword', name: '⚔️ Бастард', category: 'Воинское', dmgDice: '1d8', dmgType: 'Р', hands: 1, group: 'Мечи', traits: 'Полуторное 1d12', finesse: false },
    { id: 'battle_axe', name: '🪓 Боевой топор', category: 'Воинское', dmgDice: '1d8', dmgType: 'Р', hands: 1, group: 'Топоры', traits: 'Размашистое', finesse: false },
    { id: 'bo_staff', name: '🥢 Боевой посох (Бо)', category: 'Воинское', dmgDice: '1d8', dmgType: 'Д', hands: 2, group: 'Дубины', traits: 'Длинное, Парирующее, Сбивающее', finesse: false },
    { id: 'falchion', name: '⚔️ Фальшион', category: 'Воинское', dmgDice: '1d10', dmgType: 'Р', hands: 2, group: 'Мечи', traits: 'Напористое, Размашистое', finesse: false },
    { id: 'flail', name: '⛓️ Цеп', category: 'Воинское', dmgDice: '1d6', dmgType: 'Д', hands: 1, group: 'Цепы', traits: 'Размашистое, Разоружающее, Сбивающее', finesse: false },
    { id: 'glaive', name: '🗡️ Глефа', category: 'Воинское', dmgDice: '1d8', dmgType: 'Р', hands: 2, group: 'Древковое', traits: 'Длинное, Напористое, Смертоносное d8', finesse: false },
    { id: 'greataxe', name: '🪓 Двуручный топор', category: 'Воинское', dmgDice: '1d12', dmgType: 'Р', hands: 2, group: 'Топоры', traits: 'Размашистое', finesse: false },
    { id: 'greatclub', name: '🪵 Палица', category: 'Воинское', dmgDice: '1d10', dmgType: 'Д', hands: 2, group: 'Дубины', traits: 'Инерционное, Толкающее', finesse: false },
    { id: 'greatpick', name: '⛏️ Двуручный клевец', category: 'Воинское', dmgDice: '1d10', dmgType: 'Ко', hands: 2, group: 'Клевцы', traits: 'Добивающее d12', finesse: false },
    { id: 'greatsword', name: '⚔️ Двуручный меч', category: 'Воинское', dmgDice: '1d12', dmgType: 'Р', hands: 2, group: 'Мечи', traits: 'Универсальное Ко', finesse: false },
    // --- Воинское оружие ближнего боя (Часть 2) ---
    { id: 'guisarme', name: '🗡️ Гвизарма', category: 'Воинское', dmgDice: '1d10', dmgType: 'Р', hands: 2, group: 'Древковое', traits: 'Длинное, Сбивающее', finesse: false },
    { id: 'halberd', name: '🪓 Алебарда', category: 'Воинское', dmgDice: '1d10', dmgType: 'Ко', hands: 2, group: 'Древковое', traits: 'Длинное, Универсальное Р', finesse: false },
    { id: 'hatchet', name: '🪓 Топорик', category: 'Воинское', dmgDice: '1d6', dmgType: 'Р', hands: 1, group: 'Топоры', traits: 'Быстрое, Метательное 10 фт., Размашистое', finesse: false },
    { id: 'lance', name: '🔱 Рыцарское копьё', category: 'Воинское', dmgDice: '1d8', dmgType: 'Ко', hands: 2, group: 'Копья', traits: 'Длинное, Кавалерийское, Смертоносное d8', finesse: false },
    { id: 'light_hammer', name: '🔨 Лёгкий молот', category: 'Воинское', dmgDice: '1d6', dmgType: 'Д', hands: 1, group: 'Молоты', traits: 'Быстрое, Метательное 20 фт.', finesse: false },
    { id: 'light_pick', name: '⛏️ Лёгкий клевец', category: 'Воинское', dmgDice: '1d4', dmgType: 'Ко', hands: 1, group: 'Клевцы', traits: 'Быстрое, Добивающее d8', finesse: false },
    { id: 'longsword', name: '⚔️ Длинный меч', category: 'Воинское', dmgDice: '1d8', dmgType: 'Р', hands: 1, group: 'Мечи', traits: 'Универсальное Ко', finesse: false },
    { id: 'main_gauche', name: '🗡️ Дага', category: 'Воинское', dmgDice: '1d4', dmgType: 'Ко', hands: 1, group: 'Ножи', traits: 'Быстрое, Парирующее, Разоружающее, Универсальное Р, Фехтовальное', finesse: true },
    { id: 'maul', name: '🔨 Кувалда', category: 'Воинское', dmgDice: '1d12', dmgType: 'Д', hands: 2, group: 'Молоты', traits: 'Толкающее', finesse: false },
    { id: 'pick', name: '⛏️ Клевец', category: 'Воинское', dmgDice: '1d6', dmgType: 'Ко', hands: 1, group: 'Клевцы', traits: 'Добивающее d10', finesse: false },
    { id: 'ranseur', name: '🔱 Рунка', category: 'Воинское', dmgDice: '1d10', dmgType: 'Ко', hands: 2, group: 'Древковое', traits: 'Длинное, Разоружающее', finesse: false },
    { id: 'rapier', name: '🗡️ Рапира', category: 'Воинское', dmgDice: '1d6', dmgType: 'Ко', hands: 1, group: 'Мечи', traits: 'Разоружающее, Смертоносное d8, Фехтовальное', finesse: true },
    { id: 'scimitar', name: '⚔️ Скимитар', category: 'Воинское', dmgDice: '1d6', dmgType: 'Р', hands: 1, group: 'Мечи', traits: 'Напористое, Размашистое', finesse: false },
    { id: 'scythe', name: '🎋 Боевая коса', category: 'Воинское', dmgDice: '1d10', dmgType: 'Р', hands: 2, group: 'Древковое', traits: 'Сбивающее, Смертоносное d10', finesse: false },
    { id: 'shield_boss', name: '🛡️ Умбон щита', category: 'Воинское', dmgDice: '1d6', dmgType: 'Д', hands: 1, group: 'Щиты', traits: 'Прикрепляемое к щиту', finesse: false },
    { id: 'shield_spikes', name: '🛡️ Шипы для щита', category: 'Воинское', dmgDice: '1d6', dmgType: 'Ко', hands: 1, group: 'Щиты', traits: 'Прикрепляемое к щиту', finesse: false },
    { id: 'shortsword', name: '🗡️ Короткий меч', category: 'Воинское', dmgDice: '1d6', dmgType: 'Ко', hands: 1, group: 'Мечи', traits: 'Быстрое, Универсальное Р, Фехтовальное', finesse: true },
    { id: 'starknife', name: '⭐ Звёздный нож', category: 'Воинское', dmgDice: '1d4', dmgType: 'Ко', hands: 1, group: 'Ножи', traits: 'Быстрое, Метательное 20 фт., Смертоносное d6, Универсальное Р, Фехтовальное', finesse: true },
    { id: 'trident', name: '🔱 Трезубец', category: 'Воинское', dmgDice: '1d8', dmgType: 'Ко', hands: 1, group: 'Копья', traits: 'Метательное 20 фт.', finesse: false },
    { id: 'war_flail', name: '⛓️ Боевой цеп', category: 'Воинское', dmgDice: '1d10', dmgType: 'Д', hands: 2, group: 'Цепы', traits: 'Размашистое, Разоружающее, Сбивающее', finesse: false },
    { id: 'warhammer', name: '🔨 Боевой молот', category: 'Воинское', dmgDice: '1d8', dmgType: 'Д', hands: 1, group: 'Молоты', traits: 'Толкающее', finesse: false },
    { id: 'whip', name: '🪢 Кнут', category: 'Воинское', dmgDice: '1d4', dmgType: 'Р', hands: 1, group: 'Цепы', traits: 'Длинное, Несмертельное, Разоружающее, Сбивающее, Фехтовальное', finesse: true },

    // --- Экзотическое оружие ближнего боя ---
    { id: 'aldori_dueling_sword', name: '⚔️ Дуэльный меч Алдори', category: 'Экзотическое', dmgDice: '1d8', dmgType: 'Р', hands: 1, group: 'Мечи', traits: 'Универсальное Ко, Фехтовальное', finesse: true },
    { id: 'dwarven_waraxe', name: '🪓 Дварфийский боевой топор', category: 'Экзотическое', dmgDice: '1d8', dmgType: 'Р', hands: 1, group: 'Топоры', traits: 'Полуторное 1d12, Размашистое', finesse: false },
    { id: 'gnome_hooked_hammer', name: '⛏️ Гномий чекан', category: 'Экзотическое', dmgDice: '1d6', dmgType: 'Д', hands: 1, group: 'Молоты', traits: 'Полуторное 1d10, Сбивающее, Универсальное Ко', finesse: false },
    { id: 'katana', name: '⚔️ Катана', category: 'Экзотическое', dmgDice: '1d6', dmgType: 'Р', hands: 1, group: 'Мечи', traits: 'Полуторное 1d10, Смертоносное d8, Универсальное Ко', finesse: false },
    { id: 'kukri', name: '🗡️ Кукри', category: 'Экзотическое', dmgDice: '1d6', dmgType: 'Р', hands: 1, group: 'Ножи', traits: 'Быстрое, Сбивающее, Фехтовальное', finesse: true },
    { id: 'spiked_chain', name: '⛓️ Шипастая цепь', category: 'Экзотическое', dmgDice: '1d8', dmgType: 'Р', hands: 2, group: 'Цепы', traits: 'Разоружающее, Сбивающее, Фехтовальное', finesse: true }
];

export const PF2E_RANGED_WEAPONS = [
    // --- Простое дистанционное оружие ---
    { id: 'blowgun', name: '🍃 Духовая трубка', category: 'Простое', dmgDice: '1', dmgType: 'Ко', range: '20 фт.', reload: '1', hands: 1, group: 'Дротики', traits: 'Быстрое, Несмертельное', dmgMode: 'none' },
    { id: 'crossbow', name: '🏹 Арбалет', category: 'Простое', dmgDice: '1d8', dmgType: 'Ко', range: '120 фт.', reload: '1', hands: 2, group: 'Арбалеты', traits: '', dmgMode: 'none' },
    { id: 'dart', name: '🎯 Дротик', category: 'Простое', dmgDice: '1d4', dmgType: 'Ко', range: '20 фт.', reload: '—', hands: 1, group: 'Дротики', traits: 'Быстрое, Метательное', dmgMode: 'thrown' },
    { id: 'hand_crossbow', name: '🏹 Ручной арбалет', category: 'Простое', dmgDice: '1d6', dmgType: 'Ко', range: '60 фт.', reload: '1', hands: 1, group: 'Арбалеты', traits: '', dmgMode: 'none' },
    { id: 'heavy_crossbow', name: '🏹 Тяжёлый арбалет', category: 'Простое', dmgDice: '1d10', dmgType: 'Ко', range: '120 фт.', reload: '2', hands: 2, group: 'Арбалеты', traits: '', dmgMode: 'none' },
    { id: 'javelin', name: '🔱 Метательное копьё (Дротик)', category: 'Простое', dmgDice: '1d6', dmgType: 'Ко', range: '30 фт.', reload: '—', hands: 1, group: 'Дротики', traits: 'Метательное', dmgMode: 'thrown' },
    { id: 'sling', name: '🪢 Праща', category: 'Простое', dmgDice: '1d6', dmgType: 'Д', range: '50 фт.', reload: '1', hands: 1, group: 'Пращи', traits: 'Убойное', dmgMode: 'propulsive' },

    // --- Воинское дистанционное оружие ---
    { id: 'composite_longbow', name: '🏹 Составной длинный лук', category: 'Воинское', dmgDice: '1d8', dmgType: 'Ко', range: '100 фт.', reload: '0', hands: 1, group: 'Луки', traits: 'Залповое 30 фт., Смертоносное d10, Убойное', dmgMode: 'propulsive' },
    { id: 'composite_shortbow', name: '🏹 Составной короткий лук', category: 'Воинское', dmgDice: '1d6', dmgType: 'Ко', range: '60 фт.', reload: '0', hands: 1, group: 'Луки', traits: 'Смертоносное d10, Убойное', dmgMode: 'propulsive' },
    { id: 'halfling_sling_staff', name: '🪢 Праща-посох полуросликов', category: 'Воинское', dmgDice: '1d10', dmgType: 'Д', range: '80 фт.', reload: '1', hands: 2, group: 'Пращи', traits: 'Убойное', dmgMode: 'propulsive' },
    { id: 'longbow', name: '🏹 Длинный лук', category: 'Воинское', dmgDice: '1d8', dmgType: 'Ко', range: '100 фт.', reload: '0', hands: 1, group: 'Луки', traits: 'Залповое 30 фт., Смертоносное d10', dmgMode: 'none' },
    { id: 'shortbow', name: '🏹 Короткий лук', category: 'Воинское', dmgDice: '1d6', dmgType: 'Ко', range: '60 фт.', reload: '0', hands: 1, group: 'Луки', traits: 'Смертоносное d10', dmgMode: 'none' },
    { id: 'shuriken', name: '⭐ Сюрикен', category: 'Воинское', dmgDice: '1d4', dmgType: 'Ко', range: '20 фт.', reload: '0', hands: 1, group: 'Дротики', traits: 'Быстрое, Метательное', dmgMode: 'thrown' },

    // --- Экзотическое дистанционное оружие ---
    { id: 'bola', name: '🪢 Болас', category: 'Экзотическое', dmgDice: '1d6', dmgType: 'Д', range: '20 фт.', reload: '—', hands: 1, group: 'Пращи', traits: 'Дистанционное сбивающее, Метательное, Несмертельное', dmgMode: 'thrown' },
    { id: 'chakram', name: '💿 Чакрам', category: 'Экзотическое', dmgDice: '1d8', dmgType: 'Р', range: '20 фт.', reload: '—', hands: 1, group: 'Ножи', traits: 'Метательное', dmgMode: 'thrown' },
    { id: 'repeating_crossbow', name: '🏹 Многозарядный арбалет', category: 'Экзотическое', dmgDice: '1d8', dmgType: 'Ко', range: '120 фт.', reload: '0', hands: 2, group: 'Арбалеты', traits: 'Многозарядное', dmgMode: 'none' },
    { id: 'repeating_hand_crossbow', name: '🏹 Многозарядный ручной арбалет', category: 'Экзотическое', dmgDice: '1d6', dmgType: 'Ко', range: '60 фт.', reload: '0', hands: 1, group: 'Арбалеты', traits: 'Многозарядное', dmgMode: 'none' },
    { id: 'taw_launcher', name: '🏹 Стреломёт Тау', category: 'Экзотическое', dmgDice: '1d10', dmgType: 'Ко', range: '100 фт.', reload: '1', hands: 2, group: 'Арбалеты', traits: 'Модульное (Д, Ко или Р), Смертоносное d10', dmgMode: 'none' },

    // --- Огнестрельное и дополнительное дистанционное оружие ---
    { id: 'flintlock_pistol', name: '🔫 Кремнёвый пистолет', category: 'Простое', dmgDice: '1d4', dmgType: 'Ко', range: '40 фт.', reload: '1', hands: 1, group: 'Огнестрельное', traits: 'Добивающее d8, Скрываемое, Сотрясающее', dmgMode: 'none' },
    { id: 'flintlock_musket', name: '🔫 Кремнёвый мушкет', category: 'Простое', dmgDice: '1d6', dmgType: 'Ко', range: '70 фт.', reload: '1', hands: 2, group: 'Огнестрельное', traits: 'Добивающее d10, Сотрясающее', dmgMode: 'none' },
    { id: 'blunderbuss', name: '💥 Мушкетон', category: 'Простое', dmgDice: '1d8', dmgType: 'Ко', range: '40 фт.', reload: '1', hands: 2, group: 'Огнестрельное', traits: 'Разброс 10 фт., Сотрясающее', dmgMode: 'none' },
    { id: 'dueling_pistol', name: '🔫 Дуэльный пистолет', category: 'Воинское', dmgDice: '1d6', dmgType: 'Ко', range: '60 фт.', reload: '1', hands: 1, group: 'Огнестрельное', traits: 'Добивающее d10, Скрываемое, Сотрясающее', dmgMode: 'none' },
    { id: 'arquebus', name: '🔫 Аркебуза', category: 'Воинское', dmgDice: '1d8', dmgType: 'Ко', range: '150 фт.', reload: '1', hands: 2, group: 'Огнестрельное', traits: 'Добивающее d12, Отдача, Сотрясающее', dmgMode: 'none' },
    { id: 'double_barreled_pistol', name: '🔫 Двуствольный пистолет', category: 'Воинское', dmgDice: '1d4', dmgType: 'Ко', range: '30 фт.', reload: '1', hands: 1, group: 'Огнестрельное', traits: 'Двуствольное, Добивающее d8, Сотрясающее', dmgMode: 'none' },
    { id: 'double_barreled_musket', name: '🔫 Двуствольный мушкет', category: 'Воинское', dmgDice: '1d6', dmgType: 'Ко', range: '60 фт.', reload: '1', hands: 2, group: 'Огнестрельное', traits: 'Двуствольное, Добивающее d10, Сотрясающее', dmgMode: 'none' },
    { id: 'sukgung', name: '🏹 Сукгун (Арбалет-пистолет)', category: 'Воинское', dmgDice: '1d8', dmgType: 'Ко', range: '200 фт.', reload: '1', hands: 1, group: 'Арбалеты', traits: 'Добивающий прицел d12', dmgMode: 'none' },
    { id: 'daikyu', name: '🏹 Дайкю (Асимметричный лук)', category: 'Экзотическое', dmgDice: '1d8', dmgType: 'Ко', range: '80 фт.', reload: '0', hands: 1, group: 'Луки', traits: 'Убойное', dmgMode: 'propulsive' },
    { id: 'air_repeater', name: '💨 Пневматический многозарядник', category: 'Простое', dmgDice: '1d4', dmgType: 'Ко', range: '30 фт.', reload: '0', hands: 1, group: 'Огнестрельное', traits: 'Быстрое, Многозарядное', dmgMode: 'none' }

];
/**
 * Критические эффекты специализации групп оружия Pathfinder 2e (перевод pf2.ru)
 */
export const WEAPON_CRIT_SPECIALIZATIONS = {
    'Арбалеты': 'Цель получает 1d8 продолжительного урона от кровотечения (+ бонус предмета оружия).',
    'Бомбы': 'Радиус урона брызгами (если есть) увеличивается до 10 футов.',
    'Древковое': 'Цель перемещается на 5 футов в выбранном направлении (принудительное перемещение).',
    'Дротики': 'Цель получает 1d6 продолжительного урона от кровотечения (+ бонус предмета оружия).',
    'Дубины': 'Отталкиваете цель от себя на расстояние до 10 футов (принудительное перемещение).',
    'Клевцы': 'Клевец вонзается в цель: +2 дополнительного урона за каждую кость урона оружия.',
    'Копья': 'Копьё пронзает цель: она получает неуклюжесть 1 до начала вашего следующего хода.',
    'Кулачное': 'Спасбросок Стойкости против классовой СЛ или замедление 1 до конца следующего хода.',
    'Луки': 'Стрела пригвождает цель к поверхности (неподвижность; вытащить: Взаимодействие + Атлетика СЛ 10).',
    'Мечи': 'Цель теряет равновесие и становится застигнутой врасплох до начала вашего следующего хода.',
    'Молоты': 'Спасбросок Стойкости против классовой СЛ или цель распластывается.',
    'Ножи': 'Цель получает 1d6 продолжительного урона кровотечением (+ бонус предмета оружия).',
    'Огнестрельное': 'Спасбросок Стойкости против классовой СЛ или shock 1.',
    'Пращи': 'Спасбросок Стойкости против классовой СЛ или shock 1.',
    'Топоры': 'Урон костей оружия (без бонусов) соседнему существу в досягаемости, если его КБ ниже броска атаки.',
    'Цепы': 'Спасбросок Реакции против классовой СЛ или цель распластывается.',
    'Щиты': 'Отталкиваете цель от себя на 5 футов (принудительное перемещение).',

};

export function getWeaponCritEffect(group) {
    return WEAPON_CRIT_SPECIALIZATIONS[group] || '';
}

export function searchMeleeWeapons(query = '') {
    const q = String(query || '').trim().toLowerCase().replace(/ё/g, 'е');
    if (!q) return PF2E_MELEE_WEAPONS;
    return PF2E_MELEE_WEAPONS.filter(w =>
        w.name.toLowerCase().replace(/ё/g, 'е').includes(q) ||
        w.category.toLowerCase().includes(q) ||
        w.group.toLowerCase().includes(q) ||
        w.traits.toLowerCase().replace(/ё/g, 'е').includes(q)
    );
}

export function searchRangedWeapons(query = '') {
    const q = String(query || '').trim().toLowerCase().replace(/ё/g, 'е');
    if (!q) return PF2E_RANGED_WEAPONS;
    return PF2E_RANGED_WEAPONS.filter(w =>
        w.name.toLowerCase().replace(/ё/g, 'е').includes(q) ||
        w.category.toLowerCase().includes(q) ||
        w.group.toLowerCase().includes(q) ||
        w.traits.toLowerCase().replace(/ё/g, 'е').includes(q)
    );
}

export function calcMeleeWeaponRoll(weapon, stats = {}) {
    const lvl = Number(stats.level) || 1;
    const str = Number(stats.str) || 0;
    const dex = Number(stats.dex) || 0;
    const atkStat = weapon.finesse ? Math.max(str, dex) : str;
    const atkBonus = lvl + 2 + atkStat;

    const atkStr = atkBonus >= 0 ? `+${atkBonus}` : `${atkBonus}`;
    const dmgModStr = str > 0 ? `+${str}` : (str < 0 ? `${str}` : '');
    const dmgStr = `${weapon.dmgDice}${dmgModStr} (${weapon.dmgType})`;

    return { atkStr, dmgStr };
}

/**
 * Авторасчёт строки атаки и урона на основе уровня и характеристик героя (Изучен = Уровень + 2)
 */
export function calcRangedWeaponRoll(weapon, stats = {}) {
    const lvl = Number(stats.level) || 1;
    const str = Number(stats.str) || 0;
    const dex = Number(stats.dex) || 0;
    const atkBonus = lvl + 2 + dex;
    const atkStr = atkBonus >= 0 ? `+${atkBonus}` : `${atkBonus}`;

    let dmgBonus = 0;
    if (weapon.dmgMode === 'thrown') {
        dmgBonus = str;
    } else if (weapon.dmgMode === 'propulsive') {
        dmgBonus = str >= 0 ? Math.floor(str / 2) : str;
    }

    const dmgModStr = dmgBonus > 0 ? `+${dmgBonus}` : (dmgBonus < 0 ? `${dmgBonus}` : '');
    const reloadSuffix = (weapon.reload && weapon.reload !== '0' && weapon.reload !== '—') ? `, пер. ${weapon.reload}` : '';
    const dmgStr = `${weapon.dmgDice}${dmgModStr} (${weapon.dmgType}) • ${weapon.range}${reloadSuffix}`;

    return { atkStr, dmgStr };
}
