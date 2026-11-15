/**
 * Справочник брони и доспехов Pathfinder 2e (перевод pf2.ru)
 */
export const PF2E_ARMOR_CATALOG = [
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
    { id: 'full_plate', name: '🛡️ Полные латы', category: 'heavy', acBonus: 6, dexCap: 0, penalty: -3, speedPenalty: -5, strReq: 18, group: 'Латная', traits: 'Шумная, Закрытая' }
];

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
