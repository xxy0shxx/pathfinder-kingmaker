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
    { id: 'spiked_chain', name: '⛓️ Шипастая цепь', category: 'Экзотическое', dmgDice: '1d8', dmgType: 'Р', hands: 2, group: 'Цепы', traits: 'Разоружающее, Сбивающее, Фехтовальное', finesse: true },
    // --- Дополнительное простое оружие ближнего боя ---
    { id: 'bayonet', name: '🗡️ Штык (Байонет)', category: 'Простое', dmgDice: '1d4', dmgType: 'Ко', hands: 1, group: 'Ножи', traits: 'Быстрое, Прикрепляемое к арбалету/огнестрельному, Фехтовальное', finesse: true },
    { id: 'cestus', name: '🥊 Цестус', category: 'Простое', dmgDice: '1d4', dmgType: 'Д', hands: 1, group: 'Кулачное', traits: 'Быстрое, Наручное, Скрываемое', finesse: false },
    { id: 'handwrap_strike', name: '🥋 Обмотки могучих ударов (Удар)', category: 'Простое', dmgDice: '1d4', dmgType: 'Д', hands: 0, group: 'Кулачное', traits: 'Безоружное, Быстрое, Несмертельное, Фехтовальное', finesse: true },
    { id: 'poi', name: '🔥 Пои', category: 'Простое', dmgDice: '1d4', dmgType: 'Д', hands: 1, group: 'Цепы', traits: 'Быстрое, Несмертельное, Парное, Фехтовальное', finesse: true },
    { id: 'reinforced_stock', name: '🪵 Усиленный приклад', category: 'Простое', dmgDice: '1d4', dmgType: 'Д', hands: 2, group: 'Дубины', traits: 'Полуторное 1d6, Прикрепляемое к арбалету/огнестрельному, Фехтовальное', finesse: true },
    { id: 'sap', name: '🧦 Дубинка-мешочек (Блэкджек)', category: 'Простое', dmgDice: '1d6', dmgType: 'Д', hands: 1, group: 'Дубины', traits: 'Быстрое, Несмертельное, Скрываемое', finesse: false },
    { id: 'shears', name: '✂️ Садовые ножницы (Боевые)', category: 'Простое', dmgDice: '1d4', dmgType: 'Р', hands: 1, group: 'Ножи', traits: 'Быстрое, Смертоносное d8, Фехтовальное', finesse: true },
    { id: 'spring_loaded_gauntlet', name: '🥊 Пружинная рукавица', category: 'Простое', dmgDice: '1d4', dmgType: 'Ко', hands: 1, group: 'Кулачное', traits: 'Быстрое, Наручное, Скрываемое', finesse: false },
    { id: 'torch', name: '🔥 Факел (Оружие)', category: 'Простое', dmgDice: '1d4', dmgType: 'Д', hands: 1, group: 'Дубины', traits: '+1 огонь урон', finesse: false },
    { id: 'wheel_blades', name: '⚙️ Колёсные лезвия', category: 'Простое', dmgDice: '1d4', dmgType: 'Р', hands: 0, group: 'Ножи', traits: 'Быстрое, Прикрепляемое к коляске, Фехтовальное', finesse: true },

    // --- Дополнительное воинское оружие ближнего боя ---
    { id: 'adarga', name: '🛡️ Адарга (Щит-оружие)', category: 'Воинское', dmgDice: '1d4', dmgType: 'Д', hands: 1, group: 'Щиты', traits: 'Быстрое, Фехтовальное', finesse: true },
    { id: 'asp_coil', name: '🐍 Клинок-гадюка (Меч-хлыст)', category: 'Воинское', dmgDice: '1d6', dmgType: 'Р', hands: 1, group: 'Мечи', traits: 'Длинное, Универсальное Ко, Фехтовальное', finesse: true },
    { id: 'bec_de_corbin', name: '⛏️ Бек-де-корбен (Клюв ворона)', category: 'Воинское', dmgDice: '1d8', dmgType: 'Ко', hands: 2, group: 'Древковое', traits: 'Длинное, Сокрушающее, Универсальное Д', finesse: false },
    { id: 'bill', name: '🪓 Гвизарма-секач (Билл)', category: 'Воинское', dmgDice: '1d8', dmgType: 'Р', hands: 2, group: 'Древковое', traits: 'Длинное, Сбивающее, Смертоносное d8, Хваткое', finesse: false },
    { id: 'bladed_diabolo', name: '🪀 Диаболо с лезвиями', category: 'Воинское', dmgDice: '1d4', dmgType: 'Р', hands: 2, group: 'Цепы', traits: 'Быстрое, Разоружающее, Фехтовальное', finesse: true },
    { id: 'bladed_hoop', name: '⭕ Боевой обруч (Чакрам-кольцо)', category: 'Воинское', dmgDice: '1d6', dmgType: 'Р', hands: 2, group: 'Ножи', traits: 'Быстрое, Размашистое, Фехтовальное', finesse: true },
    { id: 'bladed_scarf', name: '🧣 Шарф с лезвиями', category: 'Воинское', dmgDice: '1d6', dmgType: 'Р', hands: 2, group: 'Цепы', traits: 'Длинное, Разоружающее, Размашистое, Фехтовальное', finesse: true },
    { id: 'bow_staff', name: '🏹 Лук-посох (Ближний бой)', category: 'Воинское', dmgDice: '1d6', dmgType: 'Д', hands: 1, group: 'Дубины', traits: 'Быстрое, Комбинированное, Парирующее, Фехтовальное', finesse: true },
    { id: 'broadsword', name: '⚔️ Палаш', category: 'Воинское', dmgDice: '1d8', dmgType: 'Р', hands: 1, group: 'Мечи', traits: 'Парирующее, Универсальное Ко', finesse: false },
    { id: 'butterfly_sword', name: '🦋 Меч-бабочка', category: 'Воинское', dmgDice: '1d4', dmgType: 'Р', hands: 1, group: 'Мечи', traits: 'Быстрое, Парирующее, Парное, Разоружающее, Фехтовальное', finesse: true },
    { id: 'chain_sword', name: '⛓️ Цепной меч', category: 'Воинское', dmgDice: '1d6', dmgType: 'Р', hands: 1, group: 'Мечи', traits: 'Длинное, Размашистое, Фехтовальное', finesse: true },
    { id: 'claw_blade', name: '🐾 Когтистый клинок', category: 'Воинское', dmgDice: '1d4', dmgType: 'Р', hands: 1, group: 'Ножи', traits: 'Быстрое, Смертоносное d8, Универсальное Ко, Фехтовальное', finesse: true },
    { id: 'combat_grapnel', name: '🪝 Боевой крюк-кошка', category: 'Воинское', dmgDice: '1d6', dmgType: 'Ко', hands: 1, group: 'Ножи', traits: 'Метательное 20 фт., Подвесное, Хваткое', finesse: false },
    { id: 'corset_knife', name: '🗡️ Корсетный нож', category: 'Воинское', dmgDice: '1d4', dmgType: 'Ко', hands: 1, group: 'Ножи', traits: 'Быстрое, Скрываемое, Смертоносное d6, Фехтовальное', finesse: true },
    { id: 'dancer_spear', name: '🔱 Копьё танцора', category: 'Воинское', dmgDice: '1d6', dmgType: 'Ко', hands: 2, group: 'Копья', traits: 'Длинное, Напористое, Размашистое, Универсальное Д, Фехтовальное', finesse: true },
    { id: 'dogslicer_heavy', name: '🔪 Большой собакорез', category: 'Воинское', dmgDice: '1d8', dmgType: 'Р', hands: 2, group: 'Мечи', traits: 'Подлое, Размашистое', finesse: false },
    { id: 'earthbreaker', name: '🔨 Землелом', category: 'Воинское', dmgDice: '1d10', dmgType: 'Д', hands: 2, group: 'Молоты', traits: 'Сокрушающее, Универсальное Ко', finesse: false },
    { id: 'elven_branched_spear', name: '🔱 Эльфийское ветвистое копьё', category: 'Воинское', dmgDice: '1d6', dmgType: 'Ко', hands: 2, group: 'Копья', traits: 'Длинное, Смертоносное d8, Фехтовальное', finesse: true },
    { id: 'exquisite_sword_cane', name: '🦯 Шпага-трость', category: 'Воинское', dmgDice: '1d6', dmgType: 'Ко', hands: 1, group: 'Мечи', traits: 'Быстрое, Парирующее, Скрываемое, Фехтовальное', finesse: true },
    { id: 'falcata', name: '⚔️ Фальката', category: 'Воинское', dmgDice: '1d8', dmgType: 'Р', hands: 1, group: 'Мечи', traits: 'Добивающее d12', finesse: false },
    { id: 'fauchard', name: '🗡️ Фошар', category: 'Воинское', dmgDice: '1d8', dmgType: 'Р', hands: 2, group: 'Древковое', traits: 'Длинное, Размашистое, Сбивающее, Смертоносное d8', finesse: false },
    { id: 'fighting_fan', name: '🪭 Боевой веер', category: 'Воинское', dmgDice: '1d4', dmgType: 'Р', hands: 1, group: 'Ножи', traits: 'Быстрое, Подлое, Скрываемое, Смертоносное d6, Фехтовальное', finesse: true },
    { id: 'filchers_fork', name: '🍴 Вилка воришки', category: 'Воинское', dmgDice: '1d4', dmgType: 'Ко', hands: 1, group: 'Копья', traits: 'Быстрое, Метательное 20 фт., Подлое, Смертоносное d6, Фехтовальное', finesse: true },
    { id: 'gaff', name: '🪝 Багор', category: 'Воинское', dmgDice: '1d6', dmgType: 'Ко', hands: 1, group: 'Дубины', traits: 'Сбивающее, Универсальное Д', finesse: false },
    { id: 'gill_hook', name: '🔱 Жаберный крюк', category: 'Воинское', dmgDice: '1d10', dmgType: 'Ко', hands: 2, group: 'Копья', traits: 'Длинное, Хваткое', finesse: false },
    { id: 'gnome_amalgam_musket_axe', name: '🪓 Мушкет-топор (Ближний бой)', category: 'Воинское', dmgDice: '1d8', dmgType: 'Р', hands: 2, group: 'Топоры', traits: 'Комбинированное, Размашистое', finesse: false },
    { id: 'gun_sword', name: '🔫 Меч-пистоль (Ближний бой)', category: 'Воинское', dmgDice: '1d8', dmgType: 'Р', hands: 2, group: 'Мечи', traits: 'Комбинированное, Универсальное Ко', finesse: false },
    { id: 'halberd_hammer', name: '🔨 Люцернский молот', category: 'Воинское', dmgDice: '1d10', dmgType: 'Д', hands: 2, group: 'Древковое', traits: 'Длинное, Сокрушающее, Универсальное Ко', finesse: false },
    { id: 'hook_sword', name: '⚔️ Меч с крюком (Шуангоу)', category: 'Воинское', dmgDice: '1d6', dmgType: 'Р', hands: 1, group: 'Мечи', traits: 'Парное, Разоружающее, Сбивающее, Фехтовальное', finesse: true },
    { id: 'jian', name: '⚔️ Цзянь (Прямой меч)', category: 'Воинское', dmgDice: '1d6', dmgType: 'Р', hands: 1, group: 'Мечи', traits: 'Парирующее, Универсальное Ко, Фехтовальное', finesse: true },
    { id: 'kalis', name: '⚔️ Калис (Волнистый меч)', category: 'Воинское', dmgDice: '1d8', dmgType: 'Р', hands: 1, group: 'Мечи', traits: 'Смертоносное d8, Универсальное Ко', finesse: false },
    { id: 'kama', name: '🌙 Кама', category: 'Воинское', dmgDice: '1d6', dmgType: 'Р', hands: 1, group: 'Ножи', traits: 'Быстрое, Сбивающее', finesse: false },
    { id: 'karambit', name: '🗡️ Керамбит', category: 'Воинское', dmgDice: '1d4', dmgType: 'Ко', hands: 1, group: 'Ножи', traits: 'Быстрое, Скрываемое, Смертоносное d8, Фехтовальное', finesse: true },
    { id: 'kris', name: '🗡️ Крис (Волнистый кинжал)', category: 'Воинское', dmgDice: '1d4', dmgType: 'Ко', hands: 1, group: 'Ножи', traits: 'Быстрое, Смертоносное d8, Фехтовальное', finesse: true },
    { id: 'leiomano', name: '🦈 Лейомано (Акулий меч)', category: 'Воинское', dmgDice: '1d6', dmgType: 'Д', hands: 1, group: 'Дубины', traits: 'Добивающее d10, Универсальное Р', finesse: false },
    { id: 'long_hammer', name: '🔨 Длинный молот', category: 'Воинское', dmgDice: '1d8', dmgType: 'Д', hands: 2, group: 'Молоты', traits: 'Длинное, Сбивающее, Упираемое', finesse: false },
    { id: 'mambele', name: '🪓 Мамбеле (Метательный топор)', category: 'Воинское', dmgDice: '1d6', dmgType: 'Р', hands: 1, group: 'Топоры', traits: 'Метательное 20 фт., Размашистое, Смертоносное d8', finesse: false },
    { id: 'machete', name: '🔪 Мачете', category: 'Воинское', dmgDice: '1d6', dmgType: 'Р', hands: 1, group: 'Мечи', traits: 'Размашистое, Смертоносное d8', finesse: false },
    { id: 'monkeys_fist', name: '🪢 Обезьяний кулак (Кистень)', category: 'Воинское', dmgDice: '1d6', dmgType: 'Д', hands: 1, group: 'Цепы', traits: 'Несмертельное, Фехтовальное', finesse: true },
    { id: 'nunchaku', name: '🥢 Нунчаки', category: 'Воинское', dmgDice: '1d6', dmgType: 'Д', hands: 1, group: 'Дубины', traits: 'Быстрое, Подлое, Разоружающее, Фехтовальное', finesse: true },
    { id: 'ogre_hook', name: '🪝 Крюк огра', category: 'Воинское', dmgDice: '1d10', dmgType: 'Ко', hands: 2, group: 'Клевцы', traits: 'Сбивающее, Смертоносное d10', finesse: false },
    { id: 'orc_knuckle_dagger', name: '🗡️ Орочий кастет-кинжал', category: 'Воинское', dmgDice: '1d6', dmgType: 'Ко', hands: 1, group: 'Ножи', traits: 'Быстрое, Разоружающее', finesse: false },
    { id: 'panabas', name: '⚔️ Панабас', category: 'Воинское', dmgDice: '1d6', dmgType: 'Р', hands: 1, group: 'Топоры', traits: 'Напористое, Полуторное 1d10, Размашистое', finesse: false },
    { id: 'partisan', name: '🔱 Протазан', category: 'Воинское', dmgDice: '1d8', dmgType: 'Ко', hands: 2, group: 'Копья', traits: 'Длинное, Парирующее, Универсальное Р', finesse: false },
    { id: 'piercing_wind', name: '🔫 Пистолет-клинок (Ближний бой)', category: 'Воинское', dmgDice: '1d6', dmgType: 'Р', hands: 1, group: 'Мечи', traits: 'Комбинированное, Фехтовальное', finesse: true },
    { id: 'pilum', name: '🔱 Пилум', category: 'Воинское', dmgDice: '1d6', dmgType: 'Ко', hands: 1, group: 'Копья', traits: 'Метательное 20 фт., Сокрушающее', finesse: false },
    { id: 'rhoka_sword', name: '⚔️ Меч Рока (Двухлезвийный)', category: 'Воинское', dmgDice: '1d8', dmgType: 'Р', hands: 1, group: 'Мечи', traits: 'Полуторное 1d10, Смертоносное d8', finesse: false },
    { id: 'sai', name: '🔱 Сай', category: 'Воинское', dmgDice: '1d4', dmgType: 'Ко', hands: 1, group: 'Ножи', traits: 'Быстрое, Парирующее, Разоружающее, Универсальное Д, Фехтовальное', finesse: true },
    { id: 'sansetsukon', name: '🥢 Саньцзегунь (Трёхсекционный цеп)', category: 'Воинское', dmgDice: '1d8', dmgType: 'Д', hands: 2, group: 'Цепы', traits: 'Парирующее, Разоружающее, Подлое', finesse: false },
    { id: 'scourge', name: '🪢 Плётка-семихвостка', category: 'Воинское', dmgDice: '1d4', dmgType: 'Р', hands: 1, group: 'Цепы', traits: 'Быстрое, Несмертельное, Размашистое, Фехтовальное', finesse: true },
    { id: 'spade', name: '🪖 Сапёрная лопатка (Боевая)', category: 'Воинское', dmgDice: '1d6', dmgType: 'Д', hands: 1, group: 'Топоры', traits: 'Полуторное 1d8, Универсальное Р', finesse: false },
    { id: 'switchscythe', name: '🎋 Складная боевая коса', category: 'Воинское', dmgDice: '1d8', dmgType: 'Р', hands: 2, group: 'Древковое', traits: 'Сбивающее, Скрываемое, Смертоносное d10', finesse: false },
    { id: 'sword_cane', name: '🦯 Трость-клинок', category: 'Воинское', dmgDice: '1d6', dmgType: 'Ко', hands: 1, group: 'Мечи', traits: 'Быстрое, Скрываемое, Фехтовальное', finesse: true },
    { id: 'tekko_kagi', name: '🐾 Тэкко-каги (Когти ниндзя)', category: 'Воинское', dmgDice: '1d4', dmgType: 'Р', hands: 1, group: 'Кулачное', traits: 'Быстрое, Наручное, Парирующее, Разоружающее, Фехтовальное', finesse: true },
    { id: 'tengu_gale_blade', name: '🪶 Клинок бури тэнгу', category: 'Воинское', dmgDice: '1d6', dmgType: 'Р', hands: 1, group: 'Мечи', traits: 'Быстрое, Разоружающее, Фехтовальное', finesse: true },
    { id: 'three_peaked_tree', name: '🔱 Трезубое дерево (Чан)', category: 'Воинское', dmgDice: '1d8', dmgType: 'Ко', hands: 2, group: 'Копья', traits: 'Длинное, Сбивающее, Упираемое', finesse: false },
    { id: 'tonfa', name: '🪵 Тонфа', category: 'Воинское', dmgDice: '1d4', dmgType: 'Д', hands: 1, group: 'Дубины', traits: 'Быстрое, Парирующее, Парное, Фехтовальное', finesse: true },
    { id: 'tri_bladed_katar', name: '🗡️ Трёхлезвийный катар', category: 'Воинское', dmgDice: '1d4', dmgType: 'Ко', hands: 1, group: 'Ножи', traits: 'Быстрое, Добивающее d8, Разоружающее', finesse: false },
    { id: 'war_lance', name: '🔱 Тяжёлое рыцарское копьё', category: 'Воинское', dmgDice: '1d8', dmgType: 'Ко', hands: 2, group: 'Копья', traits: 'Длинное, Кавалерийское, Смертоносное d8', finesse: false },
    { id: 'war_razor', name: '🪒 Опасная боевая бритва', category: 'Воинское', dmgDice: '1d4', dmgType: 'Р', hands: 1, group: 'Ножи', traits: 'Быстрое, Подлое, Смертоносное d8, Фехтовальное', finesse: true },
    { id: 'wish_blade', name: '⚔️ Клинок желаний', category: 'Воинское', dmgDice: '1d6', dmgType: 'Р', hands: 1, group: 'Мечи', traits: 'Полуторное 1d10, Разоружающее', finesse: false },
    { id: 'wish_knife', name: '🗡️ Нож желаний', category: 'Воинское', dmgDice: '1d4', dmgType: 'Ко', hands: 1, group: 'Ножи', traits: 'Быстрое, Разоружающее, Фехтовальное', finesse: true },
    { id: 'zulfikar', name: '⚔️ Зульфикар (Раздвоенный клинок)', category: 'Воинское', dmgDice: '1d8', dmgType: 'Р', hands: 1, group: 'Мечи', traits: 'Напористое, Разоружающее', finesse: false },
// --- Дополнительное экзотическое оружие ближнего боя ---
    { id: 'aklys', name: '🔨 Аклис (Метательная дубина на шнуре)', category: 'Экзотическое', dmgDice: '1d6', dmgType: 'Д', hands: 1, group: 'Дубины', traits: 'Метательное 20 фт., Подвесное, Сбивающее', finesse: false },
    { id: 'black_powder_knuckle_dusters', name: '💥 Пороховой кастет', category: 'Экзотическое', dmgDice: '1d4', dmgType: 'Д', hands: 1, group: 'Кулачное', traits: 'Быстрое, Добивающее d6, Наручное, Сотрясающее', finesse: false },
    { id: 'butchering_axe', name: '🪓 Топор мясника', category: 'Экзотическое', dmgDice: '1d12', dmgType: 'Р', hands: 2, group: 'Топоры', traits: 'Размашистое, Толкающее', finesse: false },
    { id: 'dorn_dergar', name: '⛓️ Дорн-дергар (Дварфийский цеп)', category: 'Экзотическое', dmgDice: '1d10', dmgType: 'Д', hands: 2, group: 'Цепы', traits: 'Длинное, Сокрушающее', finesse: false },
    { id: 'dwarven_scattergun_melee', name: '🔨 Дварфийский дробовик-булава', category: 'Экзотическое', dmgDice: '1d8', dmgType: 'Д', hands: 2, group: 'Дубины', traits: 'Комбинированное, Сокрушающее', finesse: false },
    { id: 'explosive_dogslicer', name: '💣 Взрывной собакорез', category: 'Экзотическое', dmgDice: '1d6', dmgType: 'Р', hands: 1, group: 'Мечи', traits: 'Комбинированное, Разброс 5 фт., Фехтовальное', finesse: true },
    { id: 'falchion_elven', name: '⚔️ Эльфийский фальшион', category: 'Экзотическое', dmgDice: '1d8', dmgType: 'Р', hands: 1, group: 'Мечи', traits: 'Напористое, Фехтовальное', finesse: true },
    { id: 'flying_talon', name: '🦅 Летящий коготь', category: 'Экзотическое', dmgDice: '1d4', dmgType: 'Ко', hands: 1, group: 'Ножи', traits: 'Быстрое, Метательное 10 фт., Подвесное, Разоружающее, Фехтовальное', finesse: true },
    { id: 'ghoul_blade', name: '🦴 Костяной клинок упыря', category: 'Экзотическое', dmgDice: '1d6', dmgType: 'Р', hands: 1, group: 'Мечи', traits: 'Быстрое, Смертоносное d8, Фехтовальное', finesse: true },
    { id: 'gnome_piston_maul', name: '⚙️ Гномья поршневая кувалда', category: 'Экзотическое', dmgDice: '1d10', dmgType: 'Д', hands: 2, group: 'Молоты', traits: 'Сокрушающее, Толкающее', finesse: false },
    { id: 'gripli_grass_blade', name: '🌿 Травяной клинок трипки', category: 'Экзотическое', dmgDice: '1d6', dmgType: 'Р', hands: 1, group: 'Мечи', traits: 'Быстрое, Подлое, Фехтовальное', finesse: true },
    { id: 'injection_spear', name: '💉 Инъекционное копьё', category: 'Экзотическое', dmgDice: '1d8', dmgType: 'Ко', hands: 2, group: 'Копья', traits: 'Длинное, Инъекционное', finesse: false },
    { id: 'katar_tri', name: '🗡️ Катар (Экзотический)', category: 'Экзотическое', dmgDice: '1d6', dmgType: 'Ко', hands: 1, group: 'Ножи', traits: 'Добивающее d10, Наручное', finesse: false },
    { id: 'khakkara', name: '🥢 Кхаккхара (Посох монаха с кольцами)', category: 'Экзотическое', dmgDice: '1d6', dmgType: 'Д', hands: 1, group: 'Дубины', traits: 'Полуторное 1d10, Толкающее', finesse: false },
    { id: 'mancatcher', name: '🪤 Ухват (Ловец людей)', category: 'Экзотическое', dmgDice: '1d4', dmgType: 'Ко', hands: 2, group: 'Древковое', traits: 'Длинное, Несмертельное, Хваткое', finesse: false },
    { id: 'orc_butchering_axe', name: '🪓 Орочий топор мясника', category: 'Экзотическое', dmgDice: '1d12', dmgType: 'Р', hands: 2, group: 'Топоры', traits: 'Размашистое, Толкающее', finesse: false },
    { id: 'rhoka', name: '⚔️ Рока (Зубчатый клинок)', category: 'Экзотическое', dmgDice: '1d8', dmgType: 'Р', hands: 1, group: 'Мечи', traits: 'Полуторное 1d10, Смертоносное d8', finesse: false },
    { id: 'scorpion_whip', name: '🦂 Хлыст скорпиона', category: 'Экзотическое', dmgDice: '1d4', dmgType: 'Р', hands: 1, group: 'Цепы', traits: 'Длинное, Разоружающее, Сбивающее, Фехтовальное', finesse: true },
    { id: 'tamchal_chakram', name: '💿 Тамчал-чакрам', category: 'Экзотическое', dmgDice: '1d6', dmgType: 'Р', hands: 1, group: 'Ножи', traits: 'Быстрое, Метательное 20 фт., Смертоносное d6, Фехтовальное', finesse: true },
    { id: 'tengu_gale_greatsword', name: '🪶 Двуручный клинок бури тэнгу', category: 'Экзотическое', dmgDice: '1d10', dmgType: 'Р', hands: 2, group: 'Мечи', traits: 'Напористое, Размашистое, Фехтовальное', finesse: true },
    { id: 'thorn_whip', name: '🌹 Шипастый хлыст', category: 'Экзотическое', dmgDice: '1d4', dmgType: 'Р', hands: 1, group: 'Цепы', traits: 'Длинное, Разоружающее, Сбивающее, Фехтовальное', finesse: true },
    { id: 'thunder_mace', name: '⚡ Громовая булава', category: 'Экзотическое', dmgDice: '1d8', dmgType: 'Д', hands: 1, group: 'Дубины', traits: 'Сотрясающее, Толкающее', finesse: false },
    { id: 'tricky_pick', name: '⛏️ Хитрый клевец', category: 'Экзотическое', dmgDice: '1d6', dmgType: 'Ко', hands: 1, group: 'Клевцы', traits: 'Добивающее d10, Подлое, Модульное (Д, Ко или Р)', finesse: false },
    { id: 'wakizashi_dueling', name: '🗡️ Дуэльный вакидзаси', category: 'Экзотическое', dmgDice: '1d4', dmgType: 'Р', hands: 1, group: 'Мечи', traits: 'Быстрое, Парирующее, Смертоносное d8, Фехтовальное', finesse: true },
    { id: 'whip_claw', name: '⛓️ Коготь-хлыст', category: 'Экзотическое', dmgDice: '1d6', dmgType: 'Р', hands: 1, group: 'Цепы', traits: 'Длинное, Разоружающее, Сбивающее, Фехтовальное', finesse: true }

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
    { id: 'air_repeater', name: '💨 Пневматический многозарядник', category: 'Простое', dmgDice: '1d4', dmgType: 'Ко', range: '30 фт.', reload: '0', hands: 1, group: 'Огнестрельное', traits: 'Быстрое, Многозарядное', dmgMode: 'none' },
    // --- Дополнительное дистанционное и огнестрельное оружие ---
    { id: 'gauntlet_bow', name: '🏹 Наручный арбалет-перчатка', category: 'Простое', dmgDice: '1d4', dmgType: 'Ко', range: '60 фт.', reload: '1', hands: 1, group: 'Арбалеты', traits: 'Вместимость 4, Наручное, Парирующее', dmgMode: 'none' },
    { id: 'sling_bullet_bag', name: '🪢 Праща с утяжелённым ремнём', category: 'Простое', dmgDice: '1d6', dmgType: 'Д', range: '60 фт.', reload: '1', hands: 1, group: 'Пращи', traits: 'Убойное', dmgMode: 'propulsive' },
    { id: 'wrist_launcher', name: '🎯 Наручный метатель дротиков', category: 'Простое', dmgDice: '1', dmgType: 'Ко', range: '30 фт.', reload: '1', hands: 1, group: 'Дротики', traits: 'Наручное, Скрываемое', dmgMode: 'none' },
    { id: 'atlatl', name: '🔱 Атлатль (Копьеметалка)', category: 'Воинское', dmgDice: '1d6', dmgType: 'Ко', range: '60 фт.', reload: '1', hands: 1, group: 'Дротики', traits: 'Убойное', dmgMode: 'propulsive' },
    { id: 'bow_staff_ranged', name: '🏹 Лук-посох (Стрельба)', category: 'Воинское', dmgDice: '1d6', dmgType: 'Ко', range: '60 фт.', reload: '0', hands: 2, group: 'Луки', traits: 'Комбинированное, Смертоносное d8', dmgMode: 'none' },
    { id: 'clan_pistol', name: '🔫 Клановый пистолет дварфов', category: 'Воинское', dmgDice: '1d6', dmgType: 'Ко', range: '80 фт.', reload: '1', hands: 1, group: 'Огнестрельное', traits: 'Добивающее d10, Сотрясающее', dmgMode: 'none' },
    { id: 'coat_pistol', name: '🔫 Карманный пистолет', category: 'Воинское', dmgDice: '1d4', dmgType: 'Ко', range: '30 фт.', reload: '1', hands: 1, group: 'Огнестрельное', traits: 'Добивающее d8, Скрываемое, Сотрясающее', dmgMode: 'none' },
    { id: 'dragon_mouth_pistol', name: '🐉 Пистоль «Пасть дракона»', category: 'Воинское', dmgDice: '1d6', dmgType: 'Ко', range: '20 фт.', reload: '1', hands: 1, group: 'Огнестрельное', traits: 'Разброс 5 фт., Сотрясающее', dmgMode: 'none' },
    { id: 'dwarven_scattergun', name: '💥 Дварфийский дробовик', category: 'Воинское', dmgDice: '1d8', dmgType: 'Ко', range: '50 фт.', reload: '1', hands: 2, group: 'Огнестрельное', traits: 'Отдача, Разброс 10 фт., Сотрясающее', dmgMode: 'none' },
    { id: 'flingflenser', name: '🪚 Метательный диск-пила', category: 'Воинское', dmgDice: '1d6', dmgType: 'Р', range: '30 фт.', reload: '—', hands: 1, group: 'Топоры', traits: 'Добивающее d10, Метательное, Размашистое', dmgMode: 'thrown' },
    { id: 'harmona_gun', name: '🔫 Ружье Гармона (Тяжёлое)', category: 'Воинское', dmgDice: '1d10', dmgType: 'Д', range: '150 фт.', reload: '1', hands: 2, group: 'Огнестрельное', traits: 'Отдача', dmgMode: 'none' },
    { id: 'hongali_hornbow', name: '🏹 Роговой лук хонгали', category: 'Воинское', dmgDice: '1d8', dmgType: 'Ко', range: '80 фт.', reload: '0', hands: 2, group: 'Луки', traits: 'Смертоносное d6, Убойное', dmgMode: 'propulsive' },
    { id: 'javelin_heavy', name: '🔱 Тяжёлый дротик', category: 'Воинское', dmgDice: '1d8', dmgType: 'Ко', range: '30 фт.', reload: '—', hands: 1, group: 'Дротики', traits: 'Метательное', dmgMode: 'thrown' },
    { id: 'jezail', name: '🔫 Джезайл (Длинноствольный мушкет)', category: 'Воинское', dmgDice: '1d8', dmgType: 'Ко', range: '90 фт.', reload: '1', hands: 1, group: 'Огнестрельное', traits: 'Добивающий прицел d12, Сотрясающее', dmgMode: 'none' },
    { id: 'lancer_crossbow', name: '🏹 Арбалет-копьё', category: 'Воинское', dmgDice: '1d8', dmgType: 'Ко', range: '100 фт.', reload: '1', hands: 2, group: 'Арбалеты', traits: 'Комбинированное', dmgMode: 'none' },
    { id: 'long_air_repeater', name: '💨 Длинный пневматический многозарядник', category: 'Воинское', dmgDice: '1d4', dmgType: 'Ко', range: '60 фт.', reload: '0', hands: 2, group: 'Огнестрельное', traits: 'Многозарядное', dmgMode: 'none' },
    { id: 'mithral_tree', name: '🔫 Мифриловое дерево (Многоствольное ружьё)', category: 'Воинское', dmgDice: '1d6', dmgType: 'Ко', range: '50 фт.', reload: '1', hands: 2, group: 'Огнестрельное', traits: 'Вместимость 3, Добивающее d10, Сотрясающее', dmgMode: 'none' },
    { id: 'pepperbox', name: '🔫 Пепербокс (Шестиствольный пистоль)', category: 'Воинское', dmgDice: '1d4', dmgType: 'Ко', range: '60 фт.', reload: '1', hands: 1, group: 'Огнестрельное', traits: 'Вместимость 6, Добивающее d8, Сотрясающее', dmgMode: 'none' },
    { id: 'rotary_bow', name: '🏹 Роторный арбалет', category: 'Воинское', dmgDice: '1d8', dmgType: 'Ко', range: '80 фт.', reload: '1', hands: 2, group: 'Арбалеты', traits: 'Вместимость 4', dmgMode: 'none' },
    { id: 'shield_pistol', name: '🛡️ Щитовой пистоль', category: 'Воинское', dmgDice: '1d4', dmgType: 'Ко', range: '30 фт.', reload: '1', hands: 1, group: 'Огнестрельное', traits: 'Добивающее d8, Прикрепляемое к щиту, Сотрясающее', dmgMode: 'none' },
    { id: 'slide_pistol', name: '🔫 Пистолет со скользящей казной', category: 'Воинское', dmgDice: '1d6', dmgType: 'Ко', range: '30 фт.', reload: '1', hands: 1, group: 'Огнестрельное', traits: 'Вместимость 5, Добивающее d10, Сотрясающее', dmgMode: 'none' },
    { id: 'alchemical_crossbow', name: '⚗️ Алхимический арбалет', category: 'Экзотическое', dmgDice: '1d8', dmgType: 'Ко', range: '30 фт.', reload: '1', hands: 2, group: 'Арбалеты', traits: 'Алхимический (+1d6 стихийного урона)', dmgMode: 'none' },
    { id: 'barricade_buster', name: '💥 Разрушитель баррикад (Орочья пушка)', category: 'Экзотическое', dmgDice: '1d10', dmgType: 'Ко', range: '40 фт.', reload: '0', hands: 2, group: 'Огнестрельное', traits: 'Залповое 20 фт., Многозарядное, Отдача, Сокрушающее', dmgMode: 'none' },
    { id: 'big_boom_gun', name: '💣 Пушка «Большой Бум»', category: 'Экзотическое', dmgDice: '1d6', dmgType: 'Ко', range: '20 фт.', reload: '1', hands: 1, group: 'Огнестрельное', traits: 'Добивающее d12, Самопальное, Сотрясающее', dmgMode: 'none' },
    { id: 'boomerang', name: '🪃 Бумеранг', category: 'Экзотическое', dmgDice: '1d6', dmgType: 'Д', range: '60 фт.', reload: '—', hands: 1, group: 'Дубины', traits: 'Возвратное, Метательное', dmgMode: 'thrown' },
    { id: 'chakri', name: '💿 Чакри (Головной обруч-метатель)', category: 'Экзотическое', dmgDice: '1d6', dmgType: 'Р', range: '40 фт.', reload: '—', hands: 1, group: 'Ножи', traits: 'Возвратное, Метательное, Смертоносное d8', dmgMode: 'thrown' },
    { id: 'crescent_crossbow', name: '🌙 Серповидный арбалет', category: 'Экзотическое', dmgDice: '1d6', dmgType: 'Р', range: '60 фт.', reload: '1', hands: 2, group: 'Арбалеты', traits: 'Комбинированное, Парное', dmgMode: 'none' },
    { id: 'repeating_heavy_crossbow', name: '🏹 Многозарядный тяжёлый арбалет', category: 'Экзотическое', dmgDice: '1d10', dmgType: 'Ко', range: '180 фт.', reload: '1', hands: 2, group: 'Арбалеты', traits: 'Многозарядное', dmgMode: 'none' },
    { id: 'shobhad_longrifle', name: '🔫 Длинная винтовка шобхадов', category: 'Экзотическое', dmgDice: '1d10', dmgType: 'Ко', range: '150 фт.', reload: '2', hands: 2, group: 'Огнестрельное', traits: 'Добивающее d12, Отдача, Сотрясающее', dmgMode: 'none' },
    { id: 'spoon_gun', name: '🥄 Ложка-пушка гоблинов', category: 'Экзотическое', dmgDice: '1d4', dmgType: 'Ко', range: '20 фт.', reload: '1', hands: 1, group: 'Огнестрельное', traits: 'Разброс 5 фт., Самопальное, Сотрясающее', dmgMode: 'none' },
    { id: 'sun_sling', name: '☀️ Солнечная праща', category: 'Экзотическое', dmgDice: '1d8', dmgType: 'Д', range: '50 фт.', reload: '1', hands: 1, group: 'Пращи', traits: 'Смертоносное d10, Убойное', dmgMode: 'propulsive' },
    { id: 'thunder_sling', name: '⚡ Громовая праща', category: 'Экзотическое', dmgDice: '1d6', dmgType: 'Д', range: '60 фт.', reload: '1', hands: 1, group: 'Пращи', traits: 'Сотрясающее, Убойное', dmgMode: 'propulsive' }

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

export const PF2E_WEAPON_TRAITS_DESC = {
    'Алхимический': 'Работает за счёт алхимических реакций; не является магическим.',
    'Безоружное': 'Атака частью тела; не занимает руку и на неё не действует Разоружение.',
    'Быстрое': 'Штраф за последовательные атаки снижен до −4 (вторая) и −8 (третья и далее).',
    'Вместимость': 'Несколько стволов/камер; переключение на следующий снаряд за ◆ Взаимодействие.',
    'Возвратное': 'При промахе метательное оружие возвращается обратно в вашу руку после атаки.',
    'Двуствольное': 'Можно выстрелить из обоих стволов одним Ударом, повысив кость урона на 1 ступень.',
    'Дистанционное сбивающее': 'Позволяет Сбивать с ног Атлетикой на дистанции со штрафом −2.',
    'Длинное': 'Увеличивает зону досягаемости атак до 10 футов (+5 фт.).',
    'Добивающее': 'При крит. ударе заменяет кости урона на указанную и добавляет ещё одну такую кость.',
    'Добивающий прицел': 'Стрельба 1 рукой, но при удержании 2 руками получает дескриптор «добивающее».',
    'Залповое': 'Штраф −2 к атакам по целям в пределах указанной ближней дистанции.',
    'Замедляющее': 'При попадании можно за ◆ Взаимодействие наложить штраф −10 фт. ко всем скоростям врага.',
    'Инерционное': 'При промахе вы получаете ситуативный бонус +1 к следующей атаке этим оружием до конца хода.',
    'Инъекционное': 'Позволяет ввести яд или жидкость в цель за ◆ Взаимодействие сразу после попадания.',
    'Кавалерийское': 'Верхом можно держать 1 рукой; после перемещения на 10+ фт. даёт +1 урон за кость оружия.',
    'Комбинированное': 'Имеет форму ближнего и дальнего боя (переключение за ◆ Взаимодействие).',
    'Метательное': 'Можно метать как дистанционное оружие, добавляя модификатор Силы к урону.',
    'Мешающий': 'За ◆ Взаимодействие делает клетку в досягаемости пересечённой местностью.',
    'Многозарядное': 'Использует магазин снарядов, снижая перезарядку до указанного значения.',
    'Модульное': 'Позволяет переключать тип урона (Д, Ко или Р) за ◆ Взаимодействие.',
    'Напористое': 'Вторая атака за ход получает +1 урон за кость оружия, третья и далее — +2 за кость.',
    'Наручное': 'Встроено в броню/перчатку; не занимает руку и не выбивается Разоружением.',
    'Несмертельное': 'Снижает ПЗ цели до 0 без убийства (смертельная атака идёт со штрафом −2).',
    'Отдача': 'Наносит +1 доп. урон, но требует Силу +2 или сошки (иначе штраф −2 к атаке).',
    'Парирующее': 'За ◆ действие даёт ситуативный бонус +1 к КБ до начала вашего следующего хода.',
    'Парное': 'Даёт +1 урон за кость, если в этот ход вы уже атаковали вторым таким же оружием.',
    'Подвесное': 'Можно притянуть обратно в свободную руку за ◆ Взаимодействие после броска.',
    'Подлое': 'Наносит +1 доп. урон за точность по застигнутым врасплох целям (+2 для оружия +3).',
    'Полуторное': 'При удержании двумя руками кость урона заменяется на указанную.',
    'Прикрепляемое': 'Крепится к другому предмету (например, к щиту) и используется вместе с ним.',
    'Разброс': 'Наносит 1 урон брызгами за кость оружия основной цели и всем в указанном радиусе.',
    'Размашистое': 'Даёт ситуативный бонус +1 к атаке, если в этот ход вы уже били этим оружием другую цель.',
    'Разоружающее': 'Позволяет Разоружать врага Атлетикой без свободной руки (+ бонус предмета оружия).',
    'Разрывающее': 'При попадании наносит 1 продолжительного урона кровотечением (2 с улучш. разящей руной).',
    'Самопальное': 'При провале атаки требует чистую проверку СЛ 5, иначе даёт осечку.',
    'Сбивающее': 'Позволяет Сбивать с ног Атлетикой без свободной руки (+ бонус предмета оружия).',
    'Скрываемое': 'Даёт ситуативный бонус +2 к проверкам и СЛ Скрытности при попытке спрятать оружие.',
    'Смертоносное': 'При крит. ударе добавляет указанную кость урона после удвоения (2–3 кости с разящими рунами).',
    'Сокрушающее': 'Наносит удвоенное число костей доп. урона предметам, щитам, строениям и транспорту.',
    'Сотрясающее': 'Использует меньшую из устойчивостей цели к колющему или дробящему урону.',
    'Толкающее': 'Позволяет Толкать врага Атлетикой без свободной руки (+ бонус предмета оружия).',
    'Транспортное': 'Установлено на транспорт или скакуна и управляется водителем/всадником.',
    'Тренировочное': 'Попадание даёт вашему верному зверю ситуативный бонус +1 к следующей атаке по цели.',
    'Убойное': 'Добавляет половину положительного модификатора Силы (или полный отрицательный) к урону.',
    'Универсальное': 'Позволяет при каждой атаке выбирать альтернативный тип урона (Д, Ко или Р).',
    'Упираемое': 'После Подготовки Удара по входящему в досягаемость врагу даёт +2 урона за кость.',
    'Фехтовальное': 'Позволяет использовать Ловкость вместо Силы для бросков атаки ближнего боя.',
    'Хваткое': 'Позволяет Захватывать врага Атлетикой без свободной руки (+ бонус предмета оружия).'
};

export function getWeaponTraitsDetails(traitsStr = '') {
    const raw = String(traitsStr || '').trim();
    if (!raw) return new Array();
    return raw.split(',').map(t => t.trim()).filter(Boolean).map(trait => {
        const baseName = trait.replace(/\s+(?:d\d+|\d+\s*фт\.|\([^)]*\)|[ДКР])\s*$/i, '').trim();
        const desc = PF2E_WEAPON_TRAITS_DESC[baseName] || PF2E_WEAPON_TRAITS_DESC[trait] || '';
        return { trait, desc };
    });
}

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
