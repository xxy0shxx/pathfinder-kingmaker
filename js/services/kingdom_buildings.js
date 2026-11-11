import { Buildings1Lot } from './buildings/buildings_1_lot.js';
import { Buildings2Lot } from './buildings/buildings_2_lot.js';
import { Buildings4Lot } from './buildings/buildings_4_lot.js';

/**
 * ЕДИНЫЙ РЕЕСТР ПОСТРОЕК КОРОЛЕВСТВА И КЭШ CANVAS-ТЕКСТУР
 */
const KingdomBuildings = {
    catalog: [
        // 1-Lot Buildings (1x1)
        { id: 'occult_shop', name: 'Occult Shop (Оккультная лавка)', cols: 1, rows: 1, level: 13 },
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

        { id: 'shrine', name: 'Shrine (Святилище)', cols: 1, rows: 1, level: 1 },
        { id: 'smithy', name: 'Smithy (Кузница)', cols: 1, rows: 1, level: 3 },
        { id: 'tavern_popular', name: 'Tavern (Таверна)', cols: 1, rows: 1, level: 3 },
        { id: 'watchtower', name: 'Watchtower (Сторожевая башня)', cols: 1, rows: 1, level: 3 },
        // 2-Lot Buildings (2x1)
        { id: 'garrison', name: 'Garrison (Гарнизон)', cols: 2, rows: 1, level: 5 },
        { id: 'marketplace', name: 'Marketplace (Рыночная площадь)', cols: 2, rows: 1, level: 4 },
        { id: 'town_hall', name: 'Town Hall (Ратуша)', cols: 2, rows: 1, level: 2 },
        // 4-Lot Buildings (2x2)
        { id: 'castle', name: 'Castle (Замок)', cols: 2, rows: 2, level: 9 }
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
