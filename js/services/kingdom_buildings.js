import { Buildings1Lot } from './buildings/buildings_1_lot.js';
import { Buildings2Lot } from './buildings/buildings_2_lot.js';
import { Buildings4Lot } from './buildings/buildings_4_lot.js';

/**
 * ЕДИНЫЙ РЕЕСТР ПОСТРОЕК КОРОЛЕВСТВА И КЭШ CANVAS-ТЕКСТУР
 */
const KingdomBuildings = {
    catalog: [
        // Постройки на 1 клетку (1x1)
        { id: 'alchemy_lab', name: 'Алхимическая лаборатория', cols: 1, rows: 1, level: 3 },
        { id: 'arcanist_tower', name: 'Башня мага', cols: 1, rows: 1, level: 5 },
        { id: 'bank', name: 'Банк', cols: 1, rows: 1, level: 5 },
        { id: 'barracks', name: 'Казармы', cols: 1, rows: 1, level: 3 },
        { id: 'brewery', name: 'Пивоварня', cols: 1, rows: 1, level: 1 },
        { id: 'cemetery', name: 'Кладбище', cols: 1, rows: 1, level: 1 },
        { id: 'dump', name: 'Свалка', cols: 1, rows: 1, level: 2 },
        { id: 'festival_hall', name: 'Фестивальный зал', cols: 1, rows: 1, level: 7 },
        { id: 'general_store', name: 'Лавка', cols: 1, rows: 1, level: 1 },
        { id: 'granary', name: 'Амбар', cols: 1, rows: 1, level: 1 },
        { id: 'herbalist', name: 'Дом травника', cols: 1, rows: 1, level: 1 },
        { id: 'houses', name: 'Дома', cols: 1, rows: 1, level: 1 },
        { id: 'illicit_market', name: 'Чёрный рынок', cols: 1, rows: 1, level: 6 },
        { id: 'inn', name: 'Гостиница', cols: 1, rows: 1, level: 1 },
        { id: 'jail', name: 'Тюрьма', cols: 1, rows: 1, level: 1 },
        { id: 'library', name: 'Библиотека', cols: 1, rows: 1, level: 2 },
        { id: 'luxury_store', name: 'Лавка роскоши', cols: 1, rows: 1, level: 6 },
        { id: 'magic_shop', name: 'Лавка магических предметов', cols: 1, rows: 1, level: 8 },
        { id: 'mansion', name: 'Особняк', cols: 1, rows: 1, level: 6 },
        { id: 'mill', name: 'Мельница', cols: 1, rows: 1, level: 2 },
        { id: 'mint', name: 'Монетный двор', cols: 1, rows: 1, level: 7 },
        { id: 'monument', name: 'Монумент', cols: 1, rows: 1, level: 3 },
        { id: 'occult_shop', name: 'Оккультная лавка', cols: 1, rows: 1, level: 13 },
        { id: 'orphanage', name: 'Приют', cols: 1, rows: 1, level: 2 },
        { id: 'park', name: 'Парк', cols: 1, rows: 1, level: 1 },
        { id: 'pier', name: 'Причал', cols: 1, rows: 1, level: 3 },
        { id: 'rubble', name: 'Развалины', cols: 1, rows: 1, level: 0 },
        { id: 'sacred_grove', name: 'Священная роща', cols: 1, rows: 1, level: 4 },
        { id: 'shrine', name: 'Святилище', cols: 1, rows: 1, level: 1 },
        { id: 'smithy', name: 'Кузница', cols: 1, rows: 1, level: 3 },
        { id: 'special_artisan', name: 'Мастерские', cols: 1, rows: 1, level: 4 },
        { id: 'stable', name: 'Конюшни', cols: 1, rows: 1, level: 2 },
        { id: 'tannery', name: 'Дубильня', cols: 1, rows: 1, level: 1 },
        { id: 'tavern_dive', name: 'Таверна, пивнушка', cols: 1, rows: 1, level: 1 },
        { id: 'tavern_popular', name: 'Таверна популярная', cols: 1, rows: 1, level: 3 },
        { id: 'tenement', name: 'Трущобы', cols: 1, rows: 1, level: 1 },
        { id: 'thieves_guild', name: 'Гильдия воров', cols: 1, rows: 1, level: 5 },
        { id: 'trade_shop', name: 'Торговая лавка', cols: 1, rows: 1, level: 1 },
        { id: 'watchtower', name: 'Сторожевая башня', cols: 1, rows: 1, level: 3 },

        // Постройки на 2 клетки (2x1)
        { id: 'academy', name: 'Академия', cols: 2, rows: 1, level: 10 },
        { id: 'embassy', name: 'Посольство', cols: 2, rows: 1, level: 8 },
        { id: 'foundry', name: 'Литейный цех', cols: 2, rows: 1, level: 3 },
        { id: 'garrison', name: 'Гарнизон', cols: 2, rows: 1, level: 5 },
        { id: 'guildhall', name: 'Дом гильдии', cols: 2, rows: 1, level: 5 },
        { id: 'hospital', name: 'Лечебница', cols: 2, rows: 1, level: 9 },
        { id: 'keep', name: 'Крепость', cols: 2, rows: 1, level: 3 },
        { id: 'lumberyard', name: 'Лесопилка', cols: 2, rows: 1, level: 3 },
        { id: 'marketplace', name: 'Рынок', cols: 2, rows: 1, level: 4 },
        { id: 'military_academy', name: 'Военная академия', cols: 2, rows: 1, level: 12 },
        { id: 'museum', name: 'Музей', cols: 2, rows: 1, level: 6 },
        { id: 'noble_villa', name: 'Вилла', cols: 2, rows: 1, level: 8 },
        { id: 'opera_house', name: 'Оперный театр', cols: 2, rows: 1, level: 10 },
        { id: 'secure_warehouse', name: 'Надёжный склад', cols: 2, rows: 1, level: 6 },
        { id: 'stonemason', name: 'Дом каменщика', cols: 2, rows: 1, level: 2 },
        { id: 'tavern_luxury', name: 'Таверна, роскошная', cols: 2, rows: 1, level: 7 },
        { id: 'tavern_world_class', name: 'Таверна мирового уровня', cols: 2, rows: 1, level: 13 },
        { id: 'temple', name: 'Храм', cols: 2, rows: 1, level: 5 },
        { id: 'theater', name: 'Театр', cols: 2, rows: 1, level: 4 },
        { id: 'town_hall', name: 'Ратуша', cols: 2, rows: 1, level: 2 },

        // Постройки на 4 клетки (2x2)
        { id: 'arena', name: 'Арена', cols: 2, rows: 2, level: 9 },
        { id: 'castle', name: 'Замок', cols: 2, rows: 2, level: 9 },
        { id: 'cathedral', name: 'Собор', cols: 2, rows: 2, level: 13 },
        { id: 'construction_yard', name: 'Строительная площадка', cols: 2, rows: 2, level: 1 },
        { id: 'menagerie', name: 'Зверинец', cols: 2, rows: 2, level: 12 },
        { id: 'palace', name: 'Дворец', cols: 2, rows: 2, level: 14 },
        { id: 'stockyard', name: 'Скотный двор', cols: 2, rows: 2, level: 3 },
        { id: 'university', name: 'Университет', cols: 2, rows: 2, level: 12 },
        { id: 'waterfront_corner', name: 'Порт (две границы)', cols: 2, rows: 2, level: 4 },
        { id: 'waterfront_side', name: 'Порт (одна граница)', cols: 2, rows: 2, level: 4 }
    ],

    statsData: {
        // Постройки на 1 клетку (1x1)
        alchemy_lab:       { bonuses: { engineering: 1, magic: 1 }, ruins: { corruption: 1 }, note: '+1 Инженерное дело/Магия (алхимия); +1 Коррупция' },
        arcanist_tower:    { bonuses: { magic: 1, scholarship: 1 }, note: '+1 Магия/Образование (тайная магия)' },
        bank:              { bonuses: { trade: 1 }, ruins: { corruption: 1 }, note: '+1 Торговля; +1 Коррупция' },
        barracks:          { bonuses: { warfare: 1 }, consumption: 1, note: '+1 Военное дело (гарнизон); +1 Потребление' },
        brewery:           { bonuses: { agriculture: 1, trade: 1 }, ruins: { corruption: 1 }, note: '+1 Земледелие/Торговля (напитки); +1 Коррупция' },
        cemetery:          { bonuses: { folklore: 1, magic: 1 }, note: '+1 Традиции/Магия (религия/некромантия); снижает Беспокойство' },
        dump:              { bonuses: { industry: 1 }, ruins: { decay: 1 }, note: '+1 Производство (утилизация); +1 Разруха' },
        festival_hall:     { bonuses: { arts: 2, folklore: 2 }, consumption: 1, note: '+2 Искусства/Традиции (праздники); +1 Потребление' },
        general_store:     { bonuses: { trade: 1 }, note: '+1 Торговля' },
        granary:           { bonuses: { agriculture: 1 }, consumption: -1, note: '+1 Земледелие; -1 Потребление' },
        herbalist:         { bonuses: { wilderness: 1 }, note: '+1 Дикие земли (лечение/яды)' },
        houses:            { note: 'Жилой квартал (снижает перенаселение)' },
        illicit_market:    { bonuses: { intrigue: 1, trade: 1 }, ruins: { crime: 1 }, note: '+1 Интрига/Торговля; +1 Преступность' },
        inn:               { bonuses: { folklore: 1, trade: 1 }, ruins: { crime: 1 }, note: '+1 Традиции/Торговля; +1 Преступность' },
        jail:              { bonuses: { intrigue: 1, warfare: 1 }, ruins: { strife: 1 }, note: '+1 Интрига/Военное дело; +1 Раздор' },
        library:           { bonuses: { scholarship: 1 }, note: '+1 Образование' },
        luxury_store:      { bonuses: { trade: 2 }, ruins: { corruption: 1 }, note: '+2 Торговля (роскошь); +1 Коррупция' },
        magic_shop:        { bonuses: { magic: 2, trade: 2 }, note: '+2 Магия/Торговля (маг. предметы)' },
        mansion:           { bonuses: { politics: 1, statecraft: 1 }, ruins: { corruption: 1 }, note: '+1 Политика/Управление; +1 Коррупция' },
        mill:              { bonuses: { agriculture: 1, industry: 1 }, consumption: -1, note: '+1 Земледелие/Производство; -1 Потребление' },
        mint:              { bonuses: { industry: 2, trade: 2 }, ruins: { corruption: 1 }, note: '+2 Производство/Торговля; +1 Коррупция' },
        monument:          { bonuses: { arts: 1, folklore: 1 }, note: '+1 Искусства/Традиции; снижает Беспокойство' },
        occult_shop:       { bonuses: { folklore: 3, magic: 3 }, ruins: { strife: 1 }, note: '+3 Традиции/Магия (оккультизм); +1 Раздор' },
        orphanage:         { bonuses: { folklore: 1 }, note: '+1 Традиции; снижает Беспокойство' },
        park:              { bonuses: { wilderness: 1 }, note: '+1 Дикие земли; снижает Беспокойство' },
        pier:              { bonuses: { boating: 1, trade: 1 }, ruins: { crime: 1 }, note: '+1 Лодочный транспорт/Торговля; +1 Преступность' },
        rubble:            { ruins: { decay: 1 }, note: 'Руины (занимают участок; +1 Разруха)' },
        sacred_grove:      { bonuses: { magic: 1, wilderness: 1 }, note: '+1 Магия/Дикие земли (природная магия)' },
        shrine:            { bonuses: { folklore: 1 }, note: '+1 Традиции (религия)' },
        smithy:            { bonuses: { industry: 1, warfare: 1 }, note: '+1 Производство/Военное дело (оружие/броня)' },
        special_artisan:   { bonuses: { arts: 1, industry: 1 }, note: '+1 Искусства/Производство' },
        stable:            { bonuses: { exploration: 1, warfare: 1 }, note: '+1 Исследование/Военное дело (верховые)' },
        tannery:           { bonuses: { industry: 1 }, ruins: { decay: 1 }, note: '+1 Производство; +1 Разруха' },
        tavern_dive:       { bonuses: { intrigue: 1 }, ruins: { crime: 1 }, note: '+1 Интрига; +1 Преступность' },
        tavern_popular:    { bonuses: { intrigue: 1, trade: 1 }, ruins: { crime: 1 }, note: '+1 Интрига/Торговля; +1 Преступность' },
        tenement:          { ruins: { decay: 1 }, note: 'Дешёвое жильё; +1 Разруха' },
        thieves_guild:     { bonuses: { intrigue: 2 }, ruins: { crime: 2 }, note: '+2 Интрига; +2 Преступность' },
        trade_shop:        { bonuses: { trade: 1 }, note: '+1 Торговля' },
        watchtower:        { bonuses: { defense: 1 }, note: '+1 Оборона' },

        // Постройки на 2 клетки (2x1)
        academy:           { bonuses: { scholarship: 2 }, note: '+2 Образование (все знания)' },
        embassy:           { bonuses: { politics: 2, statecraft: 2 }, note: '+2 Политика/Управление' },
        foundry:           { bonuses: { engineering: 1, industry: 1 }, ruins: { decay: 1 }, note: '+1 Инженерное дело/Производство; +1 Разруха' },
        garrison:          { bonuses: { warfare: 2 }, consumption: 1, note: '+2 Военное дело; +1 Потребление' },
        guildhall:         { bonuses: { industry: 2, trade: 2 }, note: '+2 Производство/Торговля' },
        hospital:          { bonuses: { wilderness: 2 }, consumption: 1, note: '+2 Дикие земли (лечение болезней); +1 Потребление' },
        keep:              { bonuses: { defense: 1, warfare: 1 }, consumption: 1, note: '+1 Оборона/Военное дело; +1 Потребление' },
        lumberyard:        { bonuses: { engineering: 1, industry: 1 }, note: '+1 Инженерное дело/Производство (дерево)' },
        marketplace:       { bonuses: { trade: 2 }, ruins: { crime: 1 }, note: '+2 Торговля; +1 Преступность' },
        military_academy:  { bonuses: { warfare: 3 }, consumption: 2, note: '+3 Военное дело; +2 Потребление' },
        museum:            { bonuses: { arts: 2, scholarship: 2 }, note: '+2 Искусства/Образование' },
        noble_villa:       { bonuses: { politics: 2, statecraft: 2 }, ruins: { corruption: 1 }, note: '+2 Политика/Управление; +1 Коррупция' },
        opera_house:       { bonuses: { arts: 3, folklore: 3 }, consumption: 1, note: '+3 Искусства/Традиции; +1 Потребление' },
        secure_warehouse:  { bonuses: { industry: 2, trade: 2 }, note: '+2 Производство/Торговля (защита товаров)' },
        stonemason:        { bonuses: { engineering: 1, industry: 1 }, note: '+1 Инженерное дело/Производство (камень)' },
        tavern_luxury:     { bonuses: { politics: 2, trade: 2 }, ruins: { corruption: 1 }, note: '+2 Политика/Торговля; +1 Коррупция' },
        tavern_world_class:{ bonuses: { politics: 3, trade: 3 }, ruins: { corruption: 1 }, note: '+3 Политика/Торговля; +1 Коррупция' },
        temple:            { bonuses: { folklore: 2 }, note: '+2 Традиции (религия); снижает Беспокойство' },
        theater:           { bonuses: { arts: 1, folklore: 1 }, note: '+1 Искусства/Традиции' },
        town_hall:         { bonuses: { politics: 1, statecraft: 1 }, note: '+1 Политика/Управление' },

        // Постройки на 4 клетки (2x2)
        arena:             { bonuses: { arts: 2, warfare: 2 }, consumption: 1, note: '+2 Искусства/Военное дело; +1 Потребление' },
        castle:            { bonuses: { defense: 2, politics: 2, warfare: 2 }, consumption: 2, note: '+2 Оборона/Политика/Военное дело; +2 Потребление' },
        cathedral:         { bonuses: { folklore: 3 }, note: '+3 Традиции (религия); снижает Беспокойство' },
        construction_yard: { bonuses: { engineering: 1, industry: 1 }, note: '+1 Инженерное дело/Производство (удешевляет стройку)' },
        menagerie:         { bonuses: { wilderness: 3 }, consumption: 1, note: '+3 Дикие земли; +1 Потребление' },
        palace:            { bonuses: { politics: 3, statecraft: 3 }, consumption: 2, note: '+3 Политика/Управление; +2 Потребление' },
        stockyard:         { bonuses: { agriculture: 1, industry: 1 }, consumption: -1, note: '+1 Земледелие/Производство; -1 Потребление' },
        university:        { bonuses: { scholarship: 3 }, note: '+3 Образование (все знания)' },
        waterfront_corner: { bonuses: { boating: 2, industry: 2, trade: 2 }, ruins: { crime: 1 }, note: '+2 Лодочный транспорт/Производство/Торговля; +1 Преступность' },
        waterfront_side:   { bonuses: { boating: 2, industry: 2, trade: 2 }, ruins: { crime: 1 }, note: '+2 Лодочный транспорт/Производство/Торговля; +1 Преступность' }
    },

    _cache: {},

    // Стоимость строительства в RP и материалах (Pathfinder 2e Kingmaker)
    buildCosts: {
        // 1 клетка (1x1)
        alchemy_lab:       { rp: 18, lumber: 2, stone: 1 },
        arcanist_tower:    { rp: 30, stone: 4 },
        bank:              { rp: 28, stone: 4, ore: 2 },
        barracks:          { rp: 6,  lumber: 2, stone: 1 },
        brewery:           { rp: 6,  lumber: 2 },
        cemetery:          { rp: 4,  stone: 1 },
        dump:              { rp: 4 },
        festival_hall:     { rp: 7,  lumber: 3 },
        general_store:     { rp: 8,  lumber: 2 },
        granary:           { rp: 12, lumber: 2 },
        herbalist:         { rp: 10, lumber: 1 },
        houses:            { rp: 3,  lumber: 1 },
        illicit_market:    { rp: 12, lumber: 2 },
        inn:               { rp: 10, lumber: 2 },
        jail:              { rp: 14, lumber: 2, stone: 2 },
        library:           { rp: 6,  lumber: 2 },
        luxury_store:      { rp: 28, lumber: 4, luxuries: 2 },
        magic_shop:        { rp: 44, stone: 4, luxuries: 2 },
        mansion:           { rp: 10, lumber: 2, stone: 2, luxuries: 1 },
        mill:              { rp: 6,  lumber: 2, stone: 1 },
        mint:              { rp: 30, stone: 5, ore: 3 },
        monument:          { rp: 6,  stone: 1 },
        occult_shop:       { rp: 48, lumber: 4, luxuries: 2 },
        orphanage:         { rp: 6,  lumber: 2 },
        park:              { rp: 5 },
        pier:              { rp: 16, lumber: 2, needWater: true },
        rubble:            { rp: 0 },
        sacred_grove:      { rp: 12 },
        shrine:            { rp: 8,  lumber: 2, stone: 1 },
        smithy:            { rp: 8,  lumber: 2, stone: 1, ore: 1 },
        special_artisan:   { rp: 12, lumber: 2, stone: 1 },
        stable:            { rp: 10, lumber: 2 },
        tannery:           { rp: 6,  lumber: 1 },
        tavern_dive:       { rp: 6,  lumber: 1 },
        tavern_popular:    { rp: 24, lumber: 4, stone: 1 },
        tenement:          { rp: 1,  lumber: 1 },
        thieves_guild:     { rp: 24, lumber: 2, stone: 2 },
        trade_shop:        { rp: 10, lumber: 2 },
        watchtower:        { rp: 12, lumber: 2, stone: 2 },

        // 2 клетки (2x1)
        academy:           { rp: 52, lumber: 6, stone: 6 },
        embassy:           { rp: 26, lumber: 4, stone: 4, luxuries: 2 },
        foundry:           { rp: 16, lumber: 2, stone: 3, ore: 2 },
        garrison:          { rp: 28, lumber: 4, stone: 3 },
        guildhall:         { rp: 34, lumber: 4, stone: 2 },
        hospital:          { rp: 30, lumber: 4, stone: 3 },
        keep:              { rp: 32, lumber: 4, stone: 4 },
        lumberyard:        { rp: 16, lumber: 3, stone: 1 },
        marketplace:       { rp: 48, lumber: 4 },
        military_academy:  { rp: 36, lumber: 4, stone: 4 },
        museum:            { rp: 30, lumber: 4, stone: 4 },
        noble_villa:       { rp: 24, lumber: 4, stone: 4, luxuries: 2 },
        opera_house:       { rp: 40, lumber: 6, stone: 4, luxuries: 2 },
        secure_warehouse:  { rp: 24, lumber: 3, stone: 3 },
        stonemason:        { rp: 16, lumber: 2, stone: 3 },
        tavern_luxury:     { rp: 48, lumber: 6, stone: 4, luxuries: 2 },
        tavern_world_class:{ rp: 64, lumber: 8, stone: 6, luxuries: 4 },
        temple:            { rp: 32, lumber: 4, stone: 4 },
        theater:           { rp: 24, lumber: 4, stone: 2 },
        town_hall:         { rp: 22, lumber: 4, stone: 2 },

        // 4 клетки (2x2)
        arena:             { rp: 40, lumber: 6, stone: 6 },
        castle:            { rp: 54, lumber: 6, stone: 8 },
        cathedral:         { rp: 58, lumber: 6, stone: 8 },
        construction_yard: { rp: 20, lumber: 4, stone: 2 },
        menagerie:         { rp: 26, lumber: 6, stone: 2 },
        palace:            { rp: 108, lumber: 8, stone: 10, luxuries: 6 },
        stockyard:         { rp: 20, lumber: 4 },
        university:        { rp: 78, lumber: 8, stone: 8 },
        waterfront_corner: { rp: 90, lumber: 8, stone: 4, needWater: true },
        waterfront_side:   { rp: 90, lumber: 8, stone: 4, needWater: true }
    },

    getBuildingCost(id) {
        return this.buildCosts[id] || { rp: 0 };
    },

    getBuildingCostText(id) {
        const c = this.getBuildingCost(id);
        const parts = [`${c.rp || 0} RP`];
        if (c.lumber) parts.push(`${c.lumber} Дерева`);
        if (c.stone) parts.push(`${c.stone} Камня`);
        if (c.ore) parts.push(`${c.ore} Руды`);
        if (c.luxuries) parts.push(`${c.luxuries} Роскоши`);
        if (c.needWater) parts.push('нужна Вода/Мост');
        return parts.join(' • ');
    },


    getBuildingInfoText(id) {
        const st = this.statsData[id];
        return st ? st.note : 'Особая постройка';
    },

    getBuildingInfoHtml(id) {
        const text = this.getBuildingInfoText(id);
        if (!text) return '';

        const negativeKeywords = ['потребление', 'коррупция', 'преступность', 'разруха', 'раздор'];

        return text.split(';').map(part => {
            const trimmed = part.trim();
            if (!trimmed) return '';

            const lower = trimmed.toLowerCase();
            const isNegativeStat = negativeKeywords.some(kw => lower.includes(kw));

            let color = '#ffd875'; // Жёлтый по умолчанию (без + и -)

            if (lower.includes('снижает беспокойство')) {
                color = '#2ecc71'; // Зелёный
            } else if (trimmed.startsWith('+')) {
                color = isNegativeStat ? '#ff7675' : '#2ecc71'; // Красный для роста потребления/упадка, зелёный для навыков
            } else if (trimmed.startsWith('-')) {
                color = isNegativeStat ? '#2ecc71' : '#ff7675'; // Зелёный для снижения потребления (-1 Потребление)
            }

            return `<span style="color:${color}; font-weight:600;">${trimmed}</span>`;
        }).join('<span style="color:#8a6421;">; </span>');
    },


    // Расчёт суммарных эффектов, жилых кварталов и перенаселения по правилам Pathfinder 2e
    calculateSettlementEffects(placedBuildings = []) {
        const maxSkillBonuses = {};
        const totalRuins = { corruption: 0, crime: 0, decay: 0, strife: 0 };
        let totalConsumption = 0;
        let usedLots = 0;
        let residentialCount = 0;
        const occupiedBlocks = new Set();

        const residentialIds = new Set(['houses', 'tenement', 'mansion', 'noble_villa']);

        placedBuildings.forEach(bld => {
            const meta = this.getBuildingMeta(bld.id);
            const st = this.statsData[bld.id];

            if (residentialIds.has(bld.id)) {
                residentialCount++;
            }

            if (meta) {
                const rot = bld.rotation || 0;
                const isRotated = (rot % 180) !== 0;
                const spanCols = isRotated ? meta.rows : meta.cols;
                const spanRows = isRotated ? meta.cols : meta.rows;
                usedLots += (spanCols * spanRows);

                // Определяем, какие из 9 городских блоков (2x2) задеты постройкой
                for (let dr = 0; dr < spanRows; dr++) {
                    for (let dc = 0; dc < spanCols; dc++) {
                        const blockR = Math.floor((bld.r + dr) / 2);
                        const blockC = Math.floor((bld.c + dc) / 2);
                        occupiedBlocks.add(`${blockR}_${blockC}`);
                    }
                }
            }

            if (!st) return;

            if (st.consumption) {
                totalConsumption += st.consumption;
            }
            if (st.bonuses) {
                for (const [skill, val] of Object.entries(st.bonuses)) {
                    if (!maxSkillBonuses[skill] || val > maxSkillBonuses[skill]) {
                        maxSkillBonuses[skill] = val;
                    }
                }
            }
            if (st.ruins) {
                for (const [ruinKey, val] of Object.entries(st.ruins)) {
                    totalRuins[ruinKey] = (totalRuins[ruinKey] || 0) + val;
                }
            }
        });

        const activeBlocks = occupiedBlocks.size;
        const isOvercrowded = activeBlocks > 0 && residentialCount < activeBlocks;

        return {
            usedLots,
            totalConsumption,
            maxSkillBonuses,
            totalRuins,
            buildingCount: placedBuildings.length,
            residentialCount,
            activeBlocks,
            isOvercrowded
        };
    },




    getBuildingMeta(id) {
        return this.catalog.find(b => b.id === id) || null;
    },

    getBuildingDataUrl(id) {
        if (this._cache[id]) return this._cache[id];

        const meta = this.getBuildingMeta(id);
        if (!meta) return null;

        const cellPx = 96;
        const canvas = document.createElement('canvas');
        canvas.width = meta.cols * cellPx;
        canvas.height = meta.rows * cellPx;
        const ctx = canvas.getContext('2d');

        const generators = {
            ...Buildings1Lot,
            ...Buildings2Lot,
            ...Buildings4Lot
        };

        if (generators[id]) {
            generators[id](ctx, canvas.width, canvas.height);
        } else {
            this._drawPlaceholder(ctx, canvas.width, canvas.height, meta);
        }

        const url = canvas.toDataURL();
        this._cache[id] = url;
        return url;
    },

    _drawPlaceholder(ctx, w, h, meta) {
        ctx.fillStyle = '#3f382c';
        ctx.fillRect(2, 2, w - 4, h - 4);
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2;
        ctx.strokeRect(4, 4, w - 8, h - 8);

        ctx.fillStyle = '#ebd291';
        ctx.font = 'bold 12px Montserrat, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(meta.name.split(' (')[0], w / 2, h / 2);
    }
};

export default KingdomBuildings;
