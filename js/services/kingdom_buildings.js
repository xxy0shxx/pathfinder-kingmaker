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

    // Игровые бонусы и эффекты построек (Pathfinder 2e Kingmaker)
    statsData: {
        // 1-Lot Buildings (1x1)
        alchemy_lab:       { bonuses: { engineering: 1, magic: 1 }, ruins: { corruption: 1 }, note: '+1 Engineering/Magic (алхимия); +1 Corruption' },
        arcanist_tower:    { bonuses: { magic: 1, scholarship: 1 }, note: '+1 Magic/Scholarship (тайная магия)' },
        bank:              { bonuses: { trade: 1 }, ruins: { corruption: 1 }, note: '+1 Trade; +1 Corruption' },
        barracks:          { bonuses: { warfare: 1 }, consumption: 1, note: '+1 Warfare (гарнизон); +1 Consumption' },
        brewery:           { bonuses: { agriculture: 1, trade: 1 }, ruins: { corruption: 1 }, note: '+1 Agriculture/Trade (напитки); +1 Corruption' },
        cemetery:          { bonuses: { folklore: 1, magic: 1 }, note: '+1 Folklore/Magic (религия/некромантия); снижает Unrest' },
        dump:              { bonuses: { industry: 1 }, ruins: { decay: 1 }, note: '+1 Industry (утилизация); +1 Decay' },
        festival_hall:     { bonuses: { arts: 2, folklore: 2 }, consumption: 1, note: '+2 Arts/Folklore (праздники); +1 Consumption' },
        general_store:     { bonuses: { trade: 1 }, note: '+1 Trade' },
        granary:           { bonuses: { agriculture: 1 }, consumption: -1, note: '+1 Agriculture; -1 Consumption' },
        herbalist:         { bonuses: { wilderness: 1 }, note: '+1 Wilderness (лечение/яды)' },
        houses:            { note: 'Жилой квартал (снижает перенаселение)' },
        illicit_market:    { bonuses: { intrigue: 1, trade: 1 }, ruins: { crime: 1 }, note: '+1 Intrigue/Trade; +1 Crime' },
        inn:               { bonuses: { folklore: 1, trade: 1 }, ruins: { crime: 1 }, note: '+1 Folklore/Trade; +1 Crime' },
        jail:              { bonuses: { intrigue: 1, warfare: 1 }, ruins: { strife: 1 }, note: '+1 Intrigue/Warfare; +1 Strife' },
        library:           { bonuses: { scholarship: 1 }, note: '+1 Scholarship' },
        luxury_store:      { bonuses: { trade: 2 }, ruins: { corruption: 1 }, note: '+2 Trade (роскошь); +1 Corruption' },
        magic_shop:        { bonuses: { magic: 2, trade: 2 }, note: '+2 Magic/Trade (маг. предметы)' },
        mansion:           { bonuses: { politics: 1, statecraft: 1 }, ruins: { corruption: 1 }, note: '+1 Politics/Statecraft; +1 Corruption' },
        mill:              { bonuses: { agriculture: 1, industry: 1 }, consumption: -1, note: '+1 Agriculture/Industry; -1 Consumption' },
        mint:              { bonuses: { industry: 2, trade: 2 }, ruins: { corruption: 1 }, note: '+2 Industry/Trade; +1 Corruption' },
        monument:          { bonuses: { arts: 1, folklore: 1 }, note: '+1 Arts/Folklore; снижает Unrest' },
        occult_shop:       { bonuses: { folklore: 3, magic: 3 }, ruins: { strife: 1 }, note: '+3 Folklore/Magic (оккультизм); +1 Strife' },
        orphanage:         { bonuses: { folklore: 1 }, note: '+1 Folklore; снижает Unrest' },
        park:              { bonuses: { wilderness: 1 }, note: '+1 Wilderness; снижает Unrest' },
        pier:              { bonuses: { boating: 1, trade: 1 }, ruins: { crime: 1 }, note: '+1 Boating/Trade; +1 Crime' },
        rubble:            { ruins: { decay: 1 }, note: 'Руины (занимают участок; +1 Decay)' },
        sacred_grove:      { bonuses: { magic: 1, wilderness: 1 }, note: '+1 Magic/Wilderness (природная магия)' },
        shrine:            { bonuses: { folklore: 1 }, note: '+1 Folklore (религия)' },
        smithy:            { bonuses: { industry: 1, warfare: 1 }, note: '+1 Industry/Warfare (оружие/броня)' },
        special_artisan:   { bonuses: { arts: 1, industry: 1 }, note: '+1 Arts/Industry (ремесло)' },
        stable:            { bonuses: { exploration: 1, warfare: 1 }, note: '+1 Exploration/Warfare (верховые)' },
        tannery:           { bonuses: { industry: 1 }, ruins: { decay: 1 }, note: '+1 Industry; +1 Decay' },
        tavern_dive:       { bonuses: { intrigue: 1 }, ruins: { crime: 1 }, note: '+1 Intrigue; +1 Crime' },
        tavern_popular:    { bonuses: { intrigue: 1, trade: 1 }, ruins: { crime: 1 }, note: '+1 Intrigue/Trade; +1 Crime' },
        tenement:          { ruins: { decay: 1 }, note: 'Дешёвое жильё; +1 Decay' },
        thieves_guild:     { bonuses: { intrigue: 2 }, ruins: { crime: 2 }, note: '+2 Intrigue; +2 Crime' },
        trade_shop:        { bonuses: { trade: 1 }, note: '+1 Trade' },
        watchtower:        { bonuses: { defense: 1 }, note: '+1 Defense' },

        // 2-Lot Buildings (2x1)
        academy:           { bonuses: { scholarship: 2 }, note: '+2 Scholarship (все знания)' },
        embassy:           { bonuses: { politics: 2, statecraft: 2 }, note: '+2 Politics/Statecraft' },
        foundry:           { bonuses: { engineering: 1, industry: 1 }, ruins: { decay: 1 }, note: '+1 Engineering/Industry; +1 Decay' },
        garrison:          { bonuses: { warfare: 2 }, consumption: 1, note: '+2 Warfare; +1 Consumption' },
        guildhall:         { bonuses: { industry: 2, trade: 2 }, note: '+2 Industry/Trade' },
        hospital:          { bonuses: { wilderness: 2 }, consumption: 1, note: '+2 Wilderness (лечение болезней); +1 Consumption' },
        keep:              { bonuses: { defense: 1, warfare: 1 }, consumption: 1, note: '+1 Defense/Warfare; +1 Consumption' },
        lumberyard:        { bonuses: { engineering: 1, industry: 1 }, note: '+1 Engineering/Industry (дерево)' },
        marketplace:       { bonuses: { trade: 2 }, ruins: { crime: 1 }, note: '+2 Trade; +1 Crime' },
        military_academy:  { bonuses: { warfare: 3 }, consumption: 2, note: '+3 Warfare; +2 Consumption' },
        museum:            { bonuses: { arts: 2, scholarship: 2 }, note: '+2 Arts/Scholarship' },
        noble_villa:       { bonuses: { politics: 2, statecraft: 2 }, ruins: { corruption: 1 }, note: '+2 Politics/Statecraft; +1 Corruption' },
        opera_house:       { bonuses: { arts: 3, folklore: 3 }, consumption: 1, note: '+3 Arts/Folklore; +1 Consumption' },
        secure_warehouse:  { bonuses: { industry: 2, trade: 2 }, note: '+2 Industry/Trade (защита товаров)' },
        stonemason:        { bonuses: { engineering: 1, industry: 1 }, note: '+1 Engineering/Industry (камень)' },
        tavern_luxury:     { bonuses: { politics: 2, trade: 2 }, ruins: { corruption: 1 }, note: '+2 Politics/Trade; +1 Corruption' },
        tavern_world_class:{ bonuses: { politics: 3, trade: 3 }, ruins: { corruption: 1 }, note: '+3 Politics/Trade; +1 Corruption' },
        temple:            { bonuses: { folklore: 2 }, note: '+2 Folklore (религия); снижает Unrest' },
        theater:           { bonuses: { arts: 1, folklore: 1 }, note: '+1 Arts/Folklore' },
        town_hall:         { bonuses: { politics: 1, statecraft: 1 }, note: '+1 Politics/Statecraft' },

        // 4-Lot Buildings (2x2)
        arena:             { bonuses: { arts: 2, warfare: 2 }, consumption: 1, note: '+2 Arts/Warfare; +1 Consumption' },
        castle:            { bonuses: { defense: 2, politics: 2, warfare: 2 }, consumption: 2, note: '+2 Defense/Politics/Warfare; +2 Consumption' },
        cathedral:         { bonuses: { folklore: 3 }, note: '+3 Folklore (религия); снижает Unrest' },
        construction_yard: { bonuses: { engineering: 1, industry: 1 }, note: '+1 Engineering/Industry (удешевляет стройку)' },
        menagerie:         { bonuses: { wilderness: 3 }, consumption: 1, note: '+3 Wilderness; +1 Consumption' },
        palace:            { bonuses: { politics: 3, statecraft: 3 }, consumption: 2, note: '+3 Politics/Statecraft; +2 Consumption' },
        stockyard:         { bonuses: { agriculture: 1, industry: 1 }, consumption: -1, note: '+1 Agriculture/Industry; -1 Consumption' },
        university:        { bonuses: { scholarship: 3 }, note: '+3 Scholarship (все знания)' },
        waterfront_corner: { bonuses: { boating: 2, industry: 2, trade: 2 }, ruins: { crime: 1 }, note: '+2 Boating/Industry/Trade; +1 Crime' },
        waterfront_side:   { bonuses: { boating: 2, industry: 2, trade: 2 }, ruins: { crime: 1 }, note: '+2 Boating/Industry/Trade; +1 Crime' }
    },

    _cache: {},

    getBuildingInfoText(id) {
        const st = this.statsData[id];
        return st ? st.note : 'Особая постройка';
    },

    // Расчёт суммарных эффектов и максимальных Item-бонусов по всем постройкам на сетке
    calculateSettlementEffects(placedBuildings = []) {
        const maxSkillBonuses = {};
        const totalRuins = { corruption: 0, crime: 0, decay: 0, strife: 0 };
        let totalConsumption = 0;
        let usedLots = 0;

        placedBuildings.forEach(bld => {
            const meta = this.getBuildingMeta(bld.id);
            const st = this.statsData[bld.id];
            if (meta) {
                usedLots += (meta.cols * meta.rows);
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

        return {
            usedLots,
            totalConsumption,
            maxSkillBonuses,
            totalRuins,
            buildingCount: placedBuildings.length
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
