import { Buildings1Lot } from './buildings/buildings_1_lot.js';
import { Buildings2Lot } from './buildings/buildings_2_lot.js';
import { Buildings4Lot } from './buildings/buildings_4_lot.js';

/**
 * ЕДИНЫЙ РЕЕСТР ПОСТРОЕК КОРОЛЕВСТВА И КЭШ CANVAS-ТЕКСТУР
 */
const KingdomBuildings = {
    catalog: [
        // 1-Lot Buildings (1x1)
        { id: 'alchemy_lab', name: 'Alchemy Lab (Алхимическая лаб.)', cols: 1, rows: 1, level: 3 },
        { id: 'arcanist_tower', name: 'Arcanist Tower (Башня арканиста)', cols: 1, rows: 1, level: 5 },
        { id: 'bank', name: 'Bank (Банк)', cols: 1, rows: 1, level: 5 },
        { id: 'barracks', name: 'Barracks (Казармы)', cols: 1, rows: 1, level: 3 },
        { id: 'brewery', name: 'Brewery (Пивоварня)', cols: 1, rows: 1, level: 1 },
        { id: 'cemetery', name: 'Cemetery (Кладбище)', cols: 1, rows: 1, level: 1 },
        { id: 'dump', name: 'Dump (Свалка)', cols: 1, rows: 1, level: 2 },
        { id: 'festival_hall', name: 'Festival Hall (Зал празднеств)', cols: 1, rows: 1, level: 7 },
        { id: 'general_store', name: 'General Store (Лавка товаров)', cols: 1, rows: 1, level: 1 },
        { id: 'granary', name: 'Granary (Амбар)', cols: 1, rows: 1, level: 1 },
        { id: 'herbalist', name: 'Herbalist (Травник)', cols: 1, rows: 1, level: 1 },
        { id: 'houses', name: 'Houses (Жилые дома)', cols: 1, rows: 1, level: 1 },
        { id: 'illicit_market', name: 'Illicit Market (Подпольный рынок)', cols: 1, rows: 1, level: 6 },
        { id: 'inn', name: 'Inn (Постоялый двор)', cols: 1, rows: 1, level: 1 },
        { id: 'jail', name: 'Jail (Тюрьма)', cols: 1, rows: 1, level: 1 },
        { id: 'library', name: 'Library (Библиотека)', cols: 1, rows: 1, level: 2 },
        { id: 'luxury_store', name: 'Luxury Store (Лавка роскоши)', cols: 1, rows: 1, level: 6 },
        { id: 'magic_shop', name: 'Magic Shop (Магическая лавка)', cols: 1, rows: 1, level: 8 },
        { id: 'mansion', name: 'Mansion (Особняк)', cols: 1, rows: 1, level: 6 },
        { id: 'mill', name: 'Mill (Мельница)', cols: 1, rows: 1, level: 2 },
        { id: 'mint', name: 'Mint (Монетный двор)', cols: 1, rows: 1, level: 7 },
        { id: 'monument', name: 'Monument (Монумент)', cols: 1, rows: 1, level: 3 },
        { id: 'occult_shop', name: 'Occult Shop (Оккультная лавка)', cols: 1, rows: 1, level: 13 },
        { id: 'orphanage', name: 'Orphanage (Приют)', cols: 1, rows: 1, level: 2 },
        { id: 'park', name: 'Park (Парк)', cols: 1, rows: 1, level: 1 },
        { id: 'pier', name: 'Pier (Пирс)', cols: 1, rows: 1, level: 3 },
        { id: 'rubble', name: 'Rubble (Руины)', cols: 1, rows: 1, level: 0 },
        { id: 'sacred_grove', name: 'Sacred Grove (Священная роща)', cols: 1, rows: 1, level: 4 },
        { id: 'shrine', name: 'Shrine (Святилище)', cols: 1, rows: 1, level: 1 },
        { id: 'smithy', name: 'Smithy (Кузница)', cols: 1, rows: 1, level: 3 },
        { id: 'special_artisan', name: 'Special Artisan (Мастерская ремесленника)', cols: 1, rows: 1, level: 4 },
        { id: 'stable', name: 'Stable (Конюшня)', cols: 1, rows: 1, level: 2 },
        { id: 'tannery', name: 'Tannery (Кожевня)', cols: 1, rows: 1, level: 1 },
        { id: 'tavern_dive', name: 'Tavern, Dive (Забегаловка)', cols: 1, rows: 1, level: 1 },
        { id: 'tavern_popular', name: 'Tavern, Popular (Популярная таверна)', cols: 1, rows: 1, level: 3 },
        { id: 'tenement', name: 'Tenement (Доходный дом)', cols: 1, rows: 1, level: 1 },
        { id: 'thieves_guild', name: "Thieves' Guild (Гильдия воров)", cols: 1, rows: 1, level: 5 },
        { id: 'trade_shop', name: 'Trade Shop (Торговая лавка)', cols: 1, rows: 1, level: 1 },
        { id: 'watchtower', name: 'Watchtower (Сторожевая башня)', cols: 1, rows: 1, level: 3 },

        // 2-Lot Buildings (2x1)
        { id: 'academy', name: 'Academy (Академия)', cols: 2, rows: 1, level: 10 },
        { id: 'embassy', name: 'Embassy (Посольство)', cols: 2, rows: 1, level: 8 },
        { id: 'foundry', name: 'Foundry (Литейная)', cols: 2, rows: 1, level: 3 },
        { id: 'garrison', name: 'Garrison (Гарнизон)', cols: 2, rows: 1, level: 5 },
        { id: 'guildhall', name: 'Guildhall (Дом гильдии)', cols: 2, rows: 1, level: 5 },
        { id: 'hospital', name: 'Hospital (Госпиталь)', cols: 2, rows: 1, level: 9 },
        { id: 'keep', name: 'Keep (Цитадель)', cols: 2, rows: 1, level: 3 },
        { id: 'lumberyard', name: 'Lumberyard (Лесопилка)', cols: 2, rows: 1, level: 3 },
        { id: 'marketplace', name: 'Marketplace (Рыночная площадь)', cols: 2, rows: 1, level: 4 },
        { id: 'military_academy', name: 'Military Academy (Военная академия)', cols: 2, rows: 1, level: 12 },
        { id: 'museum', name: 'Museum (Музей)', cols: 2, rows: 1, level: 6 },
        { id: 'noble_villa', name: 'Noble Villa (Дворянская вилла)', cols: 2, rows: 1, level: 8 },
        { id: 'opera_house', name: 'Opera House (Оперный театр)', cols: 2, rows: 1, level: 10 },
        { id: 'secure_warehouse', name: 'Secure Warehouse (Защищённый склад)', cols: 2, rows: 1, level: 6 },
        { id: 'stonemason', name: 'Stonemason (Гильдия каменщиков)', cols: 2, rows: 1, level: 2 },
        { id: 'tavern_luxury', name: 'Tavern, Luxury (Роскошная таверна)', cols: 2, rows: 1, level: 7 },
        { id: 'tavern_world_class', name: 'Tavern, World-Class (Первоклассная таверна)', cols: 2, rows: 1, level: 13 },
        { id: 'temple', name: 'Temple (Храм)', cols: 2, rows: 1, level: 5 },
        { id: 'theater', name: 'Theater (Театр)', cols: 2, rows: 1, level: 4 },
        { id: 'town_hall', name: 'Town Hall (Ратуша)', cols: 2, rows: 1, level: 2 },

        // 4-Lot Buildings (2x2)
        { id: 'arena', name: 'Arena (Арена)', cols: 2, rows: 2, level: 9 },
        { id: 'castle', name: 'Castle (Замок)', cols: 2, rows: 2, level: 9 },
        { id: 'cathedral', name: 'Cathedral (Собор)', cols: 2, rows: 2, level: 13 },
        { id: 'construction_yard', name: 'Construction Yard (Строительный двор)', cols: 2, rows: 2, level: 1 },
        { id: 'menagerie', name: 'Menagerie (Зверинец)', cols: 2, rows: 2, level: 12 },
        { id: 'palace', name: 'Palace (Дворец)', cols: 2, rows: 2, level: 14 },
        { id: 'stockyard', name: 'Stockyard (Скотный двор)', cols: 2, rows: 2, level: 3 },
        { id: 'university', name: 'University (Университет)', cols: 2, rows: 2, level: 12 },
        { id: 'waterfront_corner', name: 'Waterfront (corner) (Набережная угловая)', cols: 2, rows: 2, level: 4 },
        { id: 'waterfront_side', name: 'Waterfront (side) (Набережная боковая)', cols: 2, rows: 2, level: 4 },
    ],

    _cache: {},

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
