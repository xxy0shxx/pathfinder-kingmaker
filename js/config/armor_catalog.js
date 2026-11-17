/**
 * Справочник брони и доспехов Pathfinder 2e (перевод pf2.ru)
 */
export const PF2E_ARMOR_CATALOG = [
    // --- Без брони / Unarmored ---
    { id: 'gi', name: '🥋 Ги', category: 'unarmored', acBonus: 0, dexCap: 5, penalty: 0, speedPenalty: 0, strReq: 0, group: 'Тканевая', traits: 'Удобная' },
    { id: 'scroll_robes', name: '📜 Роба свитков', category: 'unarmored', acBonus: 0, dexCap: 5, penalty: 0, speedPenalty: 0, strReq: 0, group: 'Тканевая', traits: 'Начертанное' },

// --- Лёгкая броня / Light armor ---
    { id: 'leather_lamellar', name: '🧥 Кожаный ламеллярный доспех', category: 'light', acBonus: 1, dexCap: 4, penalty: -1, speedPenalty: 0, strReq: 10, group: 'Композитная', traits: 'Ламинарный' },
    { id: 'leaf_weave', name: '🌿 Лиственная броня', category: 'light', acBonus: 1, dexCap: 4, penalty: -1, speedPenalty: 0, strReq: 10, group: 'Деревянная', traits: 'Ламинарный' },
    { id: 'rattan_armor', name: '🪵 Ротанговый доспех', category: 'light', acBonus: 1, dexCap: 4, penalty: -1, speedPenalty: 0, strReq: 10, group: 'Деревянная', traits: 'Аквадинамика' },
    { id: 'buckle_armor', name: '🧥 Броня с пряжками', category: 'light', acBonus: 2, dexCap: 3, penalty: -1, speedPenalty: 0, strReq: 12, group: 'Кожаная', traits: 'Модифицированное, Шумная' },
    { id: 'kilted_breastplate', name: '🧥 Нагрудник с килтом', category: 'light', acBonus: 2, dexCap: 3, penalty: -1, speedPenalty: 0, strReq: 12, group: 'Латная', traits: 'Гибкая' },
    { id: 'sankeit', name: '🪵 Санкейт', category: 'light', acBonus: 2, dexCap: 3, penalty: -1, speedPenalty: 0, strReq: 12, group: 'Деревянная', traits: 'Ламинарный' },
    { id: 'quilted_armor', name: '🧥 Стёганка', category: 'light', acBonus: 2, dexCap: 2, penalty: -1, speedPenalty: 0, strReq: 12, group: 'Тканевая', traits: 'Удобная' },

// --- Средняя броня / Medium armor ---
    { id: 'ceramic_plate', name: '🦺 Керамические латы', category: 'medium', acBonus: 3, dexCap: 2, penalty: -2, speedPenalty: -5, strReq: 14, group: 'Латная', traits: 'Модифицированное, Шумная' },
    { id: 'coral_armor', name: '🪸 Коралловый доспех', category: 'medium', acBonus: 3, dexCap: 2, penalty: -2, speedPenalty: -5, strReq: 14, group: 'Костяная', traits: 'Аквадинамика' },
    { id: 'niyahaat', name: '🦴 Нийяхаат', category: 'medium', acBonus: 3, dexCap: 2, penalty: -2, speedPenalty: -5, strReq: 14, group: 'Костяная', traits: 'Ламинарный' },

    // Добавленные по аналогии элементы:
    { id: 'lamellar_breastplate', name: '🦺 Ламеллярный нагрудник', category: 'medium', acBonus: 4, dexCap: 1, penalty: -2, speedPenalty: -5, strReq: 16, group: 'Композитная', traits: 'Задерживающее, Ламинарный' },
    { id: 'lattice_armor', name: '🦺 Решётчатый доспех', category: 'medium', acBonus: 4, dexCap: 1, penalty: -2, speedPenalty: -5, strReq: 16, group: 'Кольчужная', traits: '' },
    { id: 'hellknight_breastplate', name: '🦺 Нагрудник рыцарей преисподней', category: 'medium', acBonus: 4, dexCap: 1, penalty: -2, speedPenalty: -5, strReq: 16, group: 'Латная', traits: 'Необычный' },
    { id: 'wooden_breastplate', name: '🦺 Деревянный нагрудник', category: 'medium', acBonus: 3, dexCap: 2, penalty: -2, speedPenalty: -5, strReq: 14, group: 'Деревянная', traits: '' },

// --- Лёгкая броня / Light armor ---
    // Добавленные по аналогии элементы:
    { id: 'mantis_shell', name: '🧥 Панцирь богомола', category: 'light', acBonus: 2, dexCap: 3, penalty: -1, speedPenalty: 0, strReq: 12, group: 'Костяная', traits: 'Необычный, Модифицированное' },

// --- Тяжёлая броня / Heavy armor ---
    // Добавленные по аналогии элементы:
    { id: 'hellknight_half_plate', name: '🛡️ Полулаты рыцарей преисподней', category: 'heavy', acBonus: 5, dexCap: 1, penalty: -3, speedPenalty: -5, strReq: 16, group: 'Латная', traits: 'Необычный' },
    { id: 'fortress_plate', name: '🛡️ Крепостные латы', category: 'heavy', acBonus: 6, dexCap: 0, penalty: -3, speedPenalty: -10, strReq: 18, group: 'Латная', traits: 'Закрытая, Тяжеловесное, Укрепление' },
    { id: 'bastion_plate', name: '🛡️ Латы бастиона', category: 'heavy', acBonus: 6, dexCap: 0, penalty: -3, speedPenalty: -10, strReq: 18, group: 'Латная', traits: 'Задерживающее, Закрытая, Укрепление' },
    { id: 'hellknight_plate', name: '🛡️ Латы рыцарей преисподней', category: 'heavy', acBonus: 6, dexCap: 0, penalty: -3, speedPenalty: -5, strReq: 18, group: 'Латная', traits: 'Необычный, Закрытая' },
    { id: 'o_yoroi', name: '🛡️ О-ёрой', category: 'heavy', acBonus: 6, dexCap: 0, penalty: -3, speedPenalty: -5, strReq: 18, group: 'Композитная', traits: 'Закрытая, Ламинарный' },
    { id: 'gray_maiden_plate', name: '🛡️ Доспех Серых Дев', category: 'heavy', acBonus: 6, dexCap: 0, penalty: -3, speedPenalty: -5, strReq: 18, group: 'Латная', traits: 'Закрытая' },









    // --- Исследовательская и Лёгкая броня ---
    { id: 'explorers_clothing', name: '👕 Одежда исследователя', category: 'unarmored', acBonus: 0, dexCap: 5, penalty: 0, speedPenalty: 0, strReq: 0, group: 'Тканевая', traits: 'Удобная' },
    { id: 'padded_armor', name: '🧥 Стеганый доспех', category: 'light', acBonus: 1, dexCap: 3, penalty: 0, speedPenalty: 0, strReq: 10, group: 'Тканевая', traits: 'Удобная, Гибкая' },
    { id: 'leather_armor', name: '🧥 Кожаный доспех', category: 'light', acBonus: 1, dexCap: 4, penalty: -1, speedPenalty: 0, strReq: 10, group: 'Кожаная', traits: '' },
    { id: 'studded_leather', name: '🧥 Клепаная кожа', category: 'light', acBonus: 2, dexCap: 3, penalty: -1, speedPenalty: 0, strReq: 12, group: 'Кожаная', traits: '' },
    { id: 'chain_shirt', name: '🧥 Кольчужная рубаха', category: 'light', acBonus: 2, dexCap: 3, penalty: -1, speedPenalty: 0, strReq: 12, group: 'Кольчужная', traits: 'Шумная, Гибкая' },

    // --- Средняя броня ---
    { id: 'hide_armor', name: '🦺 Шкурный доспех', category: 'medium', acBonus: 3, dexCap: 2, penalty: -2, speedPenalty: -5, strReq: 14, group: 'Кожаная', traits: '' },
    { id: 'scale_mail', name: '🦺 Чешуйчатый доспех', category: 'medium', acBonus: 3, dexCap: 3, penalty: -2, speedPenalty: -5, strReq: 14, group: 'Композитная', traits: 'Шумная' },
    { id: 'chain_mail', name: '🦺 Кольчужный доспех', category: 'medium', acBonus: 4, dexCap: 1, penalty: -2, speedPenalty: -5, strReq: 16, group: 'Кольчужная', traits: 'Шумная, Гибкая' },
    { id: 'breastplate', name: '🦺 Кираса', category: 'medium', acBonus: 4, dexCap: 2, penalty: -2, speedPenalty: -5, strReq: 16, group: 'Латная', traits: 'Шумная' },
    // --- Тяжёлая броня ---
    { id: 'splint_mail', name: '🛡️ Пластинчатый доспех', category: 'heavy', acBonus: 5, dexCap: 1, penalty: -3, speedPenalty: -5, strReq: 16, group: 'Композитная', traits: 'Шумная' },
    { id: 'half_plate', name: '🛡️ Полулаты', category: 'heavy', acBonus: 5, dexCap: 1, penalty: -3, speedPenalty: -5, strReq: 16, group: 'Латная', traits: 'Шумная' },
    { id: 'full_plate', name: '🛡️ Полные латы', category: 'heavy', acBonus: 6, dexCap: 0, penalty: -3, speedPenalty: -5, strReq: 18, group: 'Латная', traits: 'Шумная, Закрытая' },
    // --- Дополнительные виды брони из Основной книги игрока 2, Хранилища сокровищ и Тянь-Ша ---
    { id: 'silk_armor', name: '👘 Шёлковый доспех', category: 'light', acBonus: 1, dexCap: 4, penalty: 0, speedPenalty: 0, strReq: 10, group: 'Тканевая', traits: 'Удобная, Гибкая' },
    { id: 'woven_wood_armor', name: '🎋 Плетёная древесная броня', category: 'light', acBonus: 2, dexCap: 3, penalty: -1, speedPenalty: 0, strReq: 12, group: 'Деревянная', traits: 'Гибкая' },
    { id: 'brigandine', name: '🦺 Бригантина', category: 'medium', acBonus: 3, dexCap: 2, penalty: -2, speedPenalty: -5, strReq: 14, group: 'Композитная', traits: 'Шумная' },
    { id: 'armored_coat', name: '🧥 Бронированный плащ', category: 'medium', acBonus: 3, dexCap: 2, penalty: -2, speedPenalty: -5, strReq: 14, group: 'Кожаная', traits: 'Удобная' },
    { id: 'armored_skirt_plate', name: '🦺 Нагрудник с латной юбкой', category: 'medium', acBonus: 4, dexCap: 1, penalty: -2, speedPenalty: -5, strReq: 16, group: 'Латная', traits: 'Шумная, Укрепление (ближний бой)' },
    { id: 'lorica_segmentata', name: '🛡️ Сегментный доспех (Лорика)', category: 'heavy', acBonus: 5, dexCap: 1, penalty: -3, speedPenalty: -5, strReq: 16, group: 'Латная', traits: 'Ламинарный, Шумная' },
    { id: 'heavy_chainmail', name: '🛡️ Тяжёлая кольчуга', category: 'heavy', acBonus: 5, dexCap: 1, penalty: -3, speedPenalty: -5, strReq: 16, group: 'Кольчужная', traits: 'Гибкая, Шумная' },
    { id: 'mountain_pattern_armor', name: '🛡️ Горный чешуйчатый доспех', category: 'heavy', acBonus: 6, dexCap: 0, penalty: -3, speedPenalty: -5, strReq: 18, group: 'Композитная', traits: 'Закрытая, Ламинарный' },
    // --- Дополнительная одежда без брони (Unarmored) ---
    { id: 'armored_skirt_unarmored', name: '👘 Церемониальная роба', category: 'unarmored', acBonus: 0, dexCap: 5, penalty: 0, speedPenalty: 0, strReq: 0, group: 'Тканевая', traits: 'Удобная' },
    { id: 'heavy_robes', name: '🧥 Плотная дорожная мантия', category: 'unarmored', acBonus: 0, dexCap: 5, penalty: 0, speedPenalty: 0, strReq: 0, group: 'Тканевая', traits: 'Удобная' },
    { id: 'martial_artist_garb', name: '🥋 Облачение мастера боевых искусств', category: 'unarmored', acBonus: 0, dexCap: 5, penalty: 0, speedPenalty: 0, strReq: 0, group: 'Тканевая', traits: 'Гибкая, Удобная' },

    // --- Дополнительная лёгкая броня (Light armor) ---
    { id: 'chitin_armor', name: '🪲 Хитиновый доспех', category: 'light', acBonus: 1, dexCap: 4, penalty: -1, speedPenalty: 0, strReq: 10, group: 'Костяная', traits: 'Ламинарный' },
    { id: 'do_maru', name: '🥋 До-мару (Лёгкий пластинчатый доспех)', category: 'light', acBonus: 2, dexCap: 3, penalty: -1, speedPenalty: 0, strReq: 12, group: 'Композитная', traits: 'Гибкая, Ламинарный' },
    { id: 'haramaki', name: '👘 Харамаки (Поясной доспех)', category: 'light', acBonus: 1, dexCap: 4, penalty: 0, speedPenalty: 0, strReq: 10, group: 'Латная', traits: 'Удобная' },
    { id: 'lined_cloak', name: '🧥 Подбитый кольчугой плащ', category: 'light', acBonus: 1, dexCap: 4, penalty: -1, speedPenalty: 0, strReq: 10, group: 'Кольчужная', traits: 'Гибкая, Удобная' },
    { id: 'parade_armor', name: '🎖️ Парадный мундир с накладками', category: 'light', acBonus: 1, dexCap: 4, penalty: -1, speedPenalty: 0, strReq: 10, group: 'Композитная', traits: 'Удобная' },
    { id: 'scale_shirt', name: '🐍 Чешуйчатая рубаха', category: 'light', acBonus: 2, dexCap: 3, penalty: -1, speedPenalty: 0, strReq: 12, group: 'Композитная', traits: 'Шумная' },
    { id: 'sharkskin_armor', name: '🦈 Доспех из акульей кожи', category: 'light', acBonus: 1, dexCap: 4, penalty: -1, speedPenalty: 0, strReq: 10, group: 'Кожаная', traits: 'Аквадинамика' },
    { id: 'snakeskin_tunic', name: '🐍 Туника из змеиной кожи', category: 'light', acBonus: 1, dexCap: 4, penalty: 0, speedPenalty: 0, strReq: 10, group: 'Кожаная', traits: 'Гибкая, Удобная' },
    { id: 'spider_silk_armor', name: '🕸️ Доспех из паучьего шёлка', category: 'light', acBonus: 2, dexCap: 3, penalty: 0, speedPenalty: 0, strReq: 12, group: 'Тканевая', traits: 'Гибкая, Удобная' },
    { id: 'subterranean_chitin', name: '🕷️ Подземный хитиновый панцирь', category: 'light', acBonus: 2, dexCap: 3, penalty: -1, speedPenalty: 0, strReq: 12, group: 'Костяная', traits: 'Гибкая' },

    // --- Дополнительная средняя броня (Medium armor) ---
    { id: 'bone_lamellar', name: '🦴 Костяной ламеллярный доспех', category: 'medium', acBonus: 4, dexCap: 1, penalty: -2, speedPenalty: -5, strReq: 16, group: 'Костяная', traits: 'Ламинарный' },
    { id: 'carapace_armor', name: '🦀 Панцирный доспех (Карапакс)', category: 'medium', acBonus: 4, dexCap: 1, penalty: -2, speedPenalty: -5, strReq: 16, group: 'Костяная', traits: 'Аквадинамика, Шумная' },
    { id: 'coat_of_plates', name: '🦺 Пластинчатый кафтан (Куяк)', category: 'medium', acBonus: 4, dexCap: 1, penalty: -2, speedPenalty: -5, strReq: 16, group: 'Композитная', traits: 'Шумная' },
    { id: 'four_mirror_armor', name: '🪞 Четырёхзеркальный доспех (Чар-айна)', category: 'medium', acBonus: 4, dexCap: 1, penalty: -2, speedPenalty: -5, strReq: 16, group: 'Латная', traits: 'Шумная' },
    { id: 'horn_lamellar', name: '📯 Роговой ламеллярный доспех', category: 'medium', acBonus: 3, dexCap: 2, penalty: -2, speedPenalty: -5, strReq: 14, group: 'Костяная', traits: 'Ламинарный' },
    { id: 'iron_lamellar', name: '🦺 Железный ламеллярный доспех', category: 'medium', acBonus: 4, dexCap: 1, penalty: -2, speedPenalty: -5, strReq: 16, group: 'Композитная', traits: 'Ламинарный, Шумная' },
    { id: 'kikkorin', name: '🐢 Кикко (Японский шестиугольный доспех)', category: 'medium', acBonus: 3, dexCap: 2, penalty: -2, speedPenalty: -5, strReq: 14, group: 'Композитная', traits: 'Гибкая' },
    { id: 'ring_mail', name: '⛓️ Кольчатый доспех', category: 'medium', acBonus: 3, dexCap: 2, penalty: -2, speedPenalty: -5, strReq: 14, group: 'Кольчужная', traits: 'Шумная' },
    { id: 'shell_armor', name: '🐚 Ракушечный доспех', category: 'medium', acBonus: 3, dexCap: 2, penalty: -2, speedPenalty: -5, strReq: 14, group: 'Костяная', traits: 'Аквадинамика' },
    { id: 'steel_lamellar', name: '🦺 Стальной ламеллярный доспех', category: 'medium', acBonus: 4, dexCap: 1, penalty: -2, speedPenalty: -5, strReq: 16, group: 'Латная', traits: 'Ламинарный, Шумная' },
    { id: 'tatami_do', name: '🎋 Татами-до (Складной доспех)', category: 'medium', acBonus: 3, dexCap: 2, penalty: -2, speedPenalty: -5, strReq: 14, group: 'Деревянная', traits: 'Гибкая, Удобная' },

    // --- Дополнительная тяжёлая броня (Heavy armor) ---
    { id: 'banded_mail', name: '🛡️ Полосатый доспех', category: 'heavy', acBonus: 5, dexCap: 1, penalty: -3, speedPenalty: -5, strReq: 16, group: 'Композитная', traits: 'Шумная' },
    { id: 'coral_plate', name: '🪸 Коралловые полные латы', category: 'heavy', acBonus: 6, dexCap: 0, penalty: -3, speedPenalty: -5, strReq: 18, group: 'Костяная', traits: 'Аквадинамика, Закрытая' },
    { id: 'field_plate', name: '🛡️ Полевые латы', category: 'heavy', acBonus: 6, dexCap: 0, penalty: -3, speedPenalty: -5, strReq: 18, group: 'Латная', traits: 'Гибкая, Шумная' },
    { id: 'gothic_plate', name: '🛡️ Готические латы', category: 'heavy', acBonus: 6, dexCap: 0, penalty: -3, speedPenalty: -5, strReq: 18, group: 'Латная', traits: 'Закрытая, Шумная' },
    { id: 'ironwood_plate', name: '🌳 Латы из железного дерева', category: 'heavy', acBonus: 6, dexCap: 0, penalty: -3, speedPenalty: -5, strReq: 18, group: 'Деревянная', traits: 'Закрытая' },
    { id: 'kusari_gusoku', name: '⛓️ Кусари-гусоку (Самурайская кольчужная броня)', category: 'heavy', acBonus: 5, dexCap: 1, penalty: -3, speedPenalty: -5, strReq: 16, group: 'Кольчужная', traits: 'Гибкая, Ламинарный' },
    { id: 'stone_plate', name: '🪨 Каменные латы (Дварфийские)', category: 'heavy', acBonus: 6, dexCap: 0, penalty: -3, speedPenalty: -10, strReq: 18, group: 'Костяная', traits: 'Задерживающее, Закрытая, Тяжеловесное' },
    { id: 'tatami_gusoku', name: '🎋 Татами-гусоку (Тяжёлый складной доспех)', category: 'heavy', acBonus: 5, dexCap: 1, penalty: -3, speedPenalty: -5, strReq: 16, group: 'Деревянная', traits: 'Ламинарный, Удобная' }

];

export const PF2E_ARMOR_TRAITS_DESC = {
    'Аквадинамика': 'Штраф брони не применяется к проверкам Акробатики и Атлетики в воде.',
    'Гибкая': 'Штраф брони к навыкам не применяется к проверкам Акробатики и Атлетики.',
    'Задерживающее': 'Постоянный штраф –5 фт. ко всем скоростям, который нельзя снизить высокой Силой.',
    'Закрытая': 'При испытании Реакции против наносящих урон эффектов по области (например, Огненного шара) используйте +3 вместо модификатора ЛВК.',
    'Ламинарный': 'При поломке доспеха штраф к КБ снижается: 0 для лёгкой, –1 для средней, –2 для тяжёлой брони.',
    'Модифицированное': 'Имеет встроенную модификацию; нельзя добавить или заменить на другую.',
    'Начертанное': 'Позволяет начертать на броне 1 свиток и активировать его свободной рукой без выхватывания.',
    'Тяжеловесное': 'Штраф –1 к проверкам инициативы (или полный штраф брони, если не хватает Силы).',
    'Удобная': 'В этой броне можно полноценно отдыхать и спать без штрафа утомления.',
    'Укрепление': 'За 1 действие (◆) даёт ситуативный бонус +1 к КБ против указанного типа атак до начала следующего хода.',
    'Шумная': 'Штраф брони всегда применяется к проверкам Скрытности, даже при высокой Силе.'
};

/**
 * Поиск и фильтрация брони по строке запроса
 */
export function searchArmorCatalog(query = '') {
    const q = String(query || '').trim().toLowerCase().replace(/ё/g, 'е');
    if (!q) return PF2E_ARMOR_CATALOG;
    return PF2E_ARMOR_CATALOG.filter(a =>
        a.name.toLowerCase().replace(/ё/g, 'е').includes(q) ||
        a.group.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
}

/**
 * Возвращает описание эффекта привычной брони в зависимости от её группы существ
 */
export const PF2E_ARMOR_GROUP_EFFECTS = {
    'Кожаная': '💥 Устойчивость к дробящему урону (1 для средн. / 2 для тяж.) + значение руны.',
    'Кольчужная': '⛓️ Урон от критических ударов снижается на 4 (средн.) или 6 (тяж.).',
    'Композитная': '🦔 Устойчивость к колющему урону (1 для средн. / 2 для тяж.) + значение руны.',
    'Латная': '🛡️ Устойчивость к режущему урону (1 для средн. / 2 для тяж.) + значение руны.',
    'Тканевая': '👕 Использует умение без брони, позволяет накладывать базовые руны.',
    'Деревянная': '🪵 При крите ближнего боя атакующий получает 3 или 5 колющего урона.',
    'Костяная': '🦴 Дает устойчивость к урону за точность (3 для средн. / 5 для тяж.).'
};

export function getArmorGroupEffect(group) {
    return PF2E_ARMOR_GROUP_EFFECTS[group] || '';
}

export function getArmorTraitsDetails(traitsStr = '') {
    const raw = String(traitsStr || '').trim();
    if (!raw) return [];
    return raw.split(',').map(t => t.trim()).filter(Boolean).map(trait => {
        const baseName = trait.replace(/\([^)]*\)/g, '').trim();
        const desc = PF2E_ARMOR_TRAITS_DESC[baseName] || PF2E_ARMOR_TRAITS_DESC[trait] || '';
        return { trait, desc };
    });
}
