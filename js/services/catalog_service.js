import { PF2E_ITEMS_CATALOG, getItemLevel } from '../config/items_catalog.js';
import { PF2E_ARMOR_CATALOG } from '../config/armor_catalog.js';
import { PF2E_MELEE_WEAPONS, PF2E_RANGED_WEAPONS } from '../config/weapons_catalog.js';
import { PF2E_CANTRIPS } from '../config/cantrips_catalog.js';
import { PF2E_SPELLS_LVL1 } from '../config/spells_lvl1_catalog.js';
import { PF2E_SPELLS_LVL2 } from '../config/spells_lvl2_catalog.js';
import { PF2E_SPELLS_LVL3 } from '../config/spells_lvl3_catalog.js';
import { PF2E_SPELLS_LVL4 } from '../config/spells_lvl4_catalog.js';
import { PF2E_ANCESTRIES, PF2E_CLASSES } from '../config/meta_catalog.js';
import { PF2E_BACKGROUNDS } from '../config/backgrounds_catalog.js';
import { PF2E_HERITAGES } from '../config/heritages_catalog.js';

/**
 * ЕДИНЫЙ КЭШИРОВАННЫЙ СЕРВИС СПРАВОЧНИКОВ PF2e (CatalogService)
 * Индексирует все каталоги по id и очищенному имени для мгновенного поиска O(1).
 */
const CatalogService = {
    _initialized: false,
    _indexes: {
        items: new Map(),
        armor: new Map(),
        weapons: new Map(),
        spells: new Map(),
        ancestries: new Map(),
        classes: new Map(),
        backgrounds: new Map(),
        heritages: new Map(),
        allGear: []
    },

    /**
     * Единая нормализация названия (убирает стартовые эмодзи/знаки, приводит ё -> е и нижний регистр)
     */
    normalize(str) {
        return String(str || '')
            .replace(/^[^\p{L}\p{N}]+/u, '')
            .trim()
            .toLowerCase()
            .replace(/ё/g, 'е');
    },

    _buildMap(list, targetMap) {
        if (!Array.isArray(list)) return;
        list.forEach(entry => {
            if (!entry) return;
            if (entry.id) targetMap.set(entry.id, entry);
            const normName = this.normalize(entry.name);
            if (normName && !targetMap.has(normName)) {
                targetMap.set(normName, entry);
            }
        });
    },

    init() {
        if (this._initialized) return;

        this._buildMap(PF2E_ITEMS_CATALOG, this._indexes.items);
        this._buildMap(PF2E_ARMOR_CATALOG, this._indexes.armor);
        this._buildMap([...PF2E_MELEE_WEAPONS, ...PF2E_RANGED_WEAPONS], this._indexes.weapons);
        this._buildMap([
            ...PF2E_CANTRIPS,
            ...PF2E_SPELLS_LVL1,
            ...PF2E_SPELLS_LVL2,
            ...PF2E_SPELLS_LVL3,
            ...PF2E_SPELLS_LVL4
        ], this._indexes.spells);

        this._buildMap(PF2E_ANCESTRIES, this._indexes.ancestries);
        this._buildMap(PF2E_CLASSES, this._indexes.classes);
        this._buildMap(PF2E_BACKGROUNDS, this._indexes.backgrounds);
        this._buildMap(PF2E_HERITAGES, this._indexes.heritages);

        this._indexes.allGear = [
            ...PF2E_ITEMS_CATALOG,
            ...PF2E_ARMOR_CATALOG,
            ...PF2E_MELEE_WEAPONS,
            ...PF2E_RANGED_WEAPONS
        ];

        this._initialized = true;
    },

    _lookup(mapKey, query, fallbackList = null) {
        this.init();
        if (!query) return null;
        const map = this._indexes[mapKey];
        if (map.has(query)) return map.get(query);

        const norm = this.normalize(query);
        if (!norm) return null;
        if (map.has(norm)) return map.get(norm);

        // Мягкий поиск по подстроке только если точное совпадение не найдено
        if (fallbackList && norm.length > 3) {
            return fallbackList.find(it => this.normalize(it.name).includes(norm)) || null;
        }
        return null;
    },

    findItem(nameOrId) {
        return this._lookup('items', nameOrId, PF2E_ITEMS_CATALOG);
    },

    findArmor(nameOrId) {
        return this._lookup('armor', nameOrId, PF2E_ARMOR_CATALOG);
    },

    findWeapon(nameOrId) {
        return this._lookup('weapons', nameOrId);
    },

    findAnyGear(nameOrId) {
        return this.findItem(nameOrId) || this.findArmor(nameOrId) || this.findWeapon(nameOrId);
    },

    findSpell(nameOrId) {
        return this._lookup('spells', nameOrId);
    },

    findAncestry(nameOrId) {
        return this._lookup('ancestries', nameOrId);
    },

    findClass(nameOrId) {
        return this._lookup('classes', nameOrId);
    },

    findBackground(nameOrId) {
        return this._lookup('backgrounds', nameOrId);
    },

    findHeritage(nameOrId) {
        return this._lookup('heritages', nameOrId);
    },

    getAllGear() {
        this.init();
        return this._indexes.allGear;
    },

    /**
     * Проверяет, доступен ли предмет по уровню героя и вложен ли он (если требует Invested)
     */
    isItemActiveForHero(itemObj, heroLevel, isSlotInvested = true) {
        if (!itemObj) return false;
        const reqLvl = getItemLevel(itemObj);
        if (reqLvl > Math.max(1, Number(heroLevel) || 1)) return false;

        const isInv = /настроенность|вкладываем|invested/i.test(`${itemObj.notes || ''} ${itemObj.category || ''}`);
        if (isInv && !isSlotInvested) return false;

        return true;
    }
};

window.CatalogService = CatalogService;
export default CatalogService;
