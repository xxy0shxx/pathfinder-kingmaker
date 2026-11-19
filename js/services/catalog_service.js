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

const ARMOR_PRICES = {
    gi: '2 СМ', scroll_robes: '1 ЗМ', explorers_clothing: '1 СМ',
    armored_skirt_unarmored: '2 ЗМ', heavy_robes: '5 СМ', martial_artist_garb: '5 СМ',
    padded_armor: '2 СМ', leather_armor: '2 ЗМ', studded_leather: '3 ЗМ', chain_shirt: '5 ЗМ',
    leather_lamellar: '2 ЗМ', leaf_weave: '2 ЗМ', rattan_armor: '2 ЗМ', buckle_armor: '3 ЗМ',
    kilted_breastplate: '4 ЗМ', sankeit: '3 ЗМ', quilted_armor: '3 ЗМ', mantis_shell: '5 ЗМ',
    silk_armor: '3 ЗМ', woven_wood_armor: '4 ЗМ', chitin_armor: '3 ЗМ', do_maru: '4 ЗМ',
    haramaki: '2 ЗМ', lined_cloak: '3 ЗМ', parade_armor: '3 ЗМ', scale_shirt: '4 ЗМ',
    sharkskin_armor: '3 ЗМ', snakeskin_tunic: '3 ЗМ', spider_silk_armor: '6 ЗМ', subterranean_chitin: '5 ЗМ',
    hide_armor: '2 ЗМ', scale_mail: '4 ЗМ', chain_mail: '6 ЗМ', breastplate: '8 ЗМ',
    ceramic_plate: '6 ЗМ', coral_armor: '6 ЗМ', niyahaat: '6 ЗМ', lamellar_breastplate: '8 ЗМ',
    lattice_armor: '8 ЗМ', hellknight_breastplate: '10 ЗМ', wooden_breastplate: '5 ЗМ',
    brigandine: '6 ЗМ', armored_coat: '6 ЗМ', armored_skirt_plate: '9 ЗМ', bone_lamellar: '7 ЗМ',
    carapace_armor: '8 ЗМ', coat_of_plates: '8 ЗМ', four_mirror_armor: '8 ЗМ', horn_lamellar: '6 ЗМ',
    iron_lamellar: '8 ЗМ', kikkorin: '6 ЗМ', ring_mail: '5 ЗМ', shell_armor: '6 ЗМ',
    steel_lamellar: '8 ЗМ', tatami_do: '6 ЗМ',
    splint_mail: '13 ЗМ', half_plate: '18 ЗМ', full_plate: '30 ЗМ',
    hellknight_half_plate: '20 ЗМ', fortress_plate: '35 ЗМ', bastion_plate: '35 ЗМ',
    hellknight_plate: '35 ЗМ', o_yoroi: '35 ЗМ', gray_maiden_plate: '35 ЗМ',
    lorica_segmentata: '15 ЗМ', heavy_chainmail: '14 ЗМ', mountain_pattern_armor: '32 ЗМ',
    banded_mail: '14 ЗМ', coral_plate: '32 ЗМ', field_plate: '30 ЗМ', gothic_plate: '35 ЗМ',
    ironwood_plate: '35 ЗМ', kusari_gusoku: '16 ЗМ', stone_plate: '35 ЗМ', tatami_gusoku: '15 ЗМ'
};

const WEAPON_PRICES = {
    fist: '0 ММ', dagger: '2 СМ', staff: '0 СМ', club: '0 СМ', light_mace: '4 СМ',
    morningstar: '1 ЗМ', mace: '1 ЗМ', sickle: '2 СМ', spear: '1 СМ',
    gauntlet: '2 СМ', spiked_gauntlet: '3 СМ', longspear: '5 СМ',
    clan_dagger: '2 ЗМ', katar: '3 СМ', knuckle_duster: '3 СМ', nightstick: '2 СМ',
    bastard_sword: '4 ЗМ', battle_axe: '1 ЗМ', bo_staff: '2 СМ', falchion: '3 ЗМ',
    flail: '8 СМ', glaive: '2 ЗМ', greataxe: '2 ЗМ', greatclub: '1 ЗМ',
    greatpick: '2 ЗМ', greatsword: '2 ЗМ', guisarme: '2 ЗМ', halberd: '2 ЗМ',
    hatchet: '4 СМ', lance: '1 ЗМ', light_hammer: '3 СМ', light_pick: '4 СМ',
    longsword: '1 ЗМ', main_gauche: '5 СМ', maul: '3 ЗМ', pick: '7 СМ',
    ranseur: '2 ЗМ', rapier: '2 ЗМ', scimitar: '1 ЗМ', scythe: '2 ЗМ',
    shield_boss: '5 СМ', shield_spikes: '5 СМ', shortsword: '9 СМ', starknife: '2 ЗМ',
    trident: '1 ЗМ', war_flail: '2 ЗМ', warhammer: '1 ЗМ', whip: '1 СМ',
    aldori_dueling_sword: '20 ЗМ', dwarven_waraxe: '3 ЗМ', gnome_hooked_hammer: '2 ЗМ',
    katana: '2 ЗМ', kukri: '6 СМ', spiked_chain: '3 ЗМ',
    blowgun: '1 СМ', crossbow: '3 ЗМ', dart: '1 ММ', hand_crossbow: '3 ЗМ',
    heavy_crossbow: '4 ЗМ', javelin: '1 СМ', sling: '0 СМ',
    composite_longbow: '20 ЗМ', composite_shortbow: '14 ЗМ', halfling_sling_staff: '5 ЗМ',
    longbow: '6 ЗМ', shortbow: '3 ЗМ', shuriken: '1 ММ',
    bola: '5 СМ', chakram: '5 СМ', repeating_crossbow: '15 ЗМ', repeating_hand_crossbow: '10 ЗМ',
    flintlock_pistol: '6 ЗМ', flintlock_musket: '7 ЗМ', blunderbuss: '8 ЗМ',
    dueling_pistol: '12 ЗМ', arquebus: '10 ЗМ', double_barreled_pistol: '11 ЗМ',
    double_barreled_musket: '13 ЗМ', sukgung: '12 ЗМ', daikyu: '8 ЗМ', air_repeater: '8 ЗМ'
};

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

        const armorAsGear = (PF2E_ARMOR_CATALOG || []).map(a => {
            const price = ARMOR_PRICES[a.id] || (a.category === 'heavy' ? '15 ЗМ' : (a.category === 'medium' ? '5 ЗМ' : '2 ЗМ'));
            const catLabel = a.category === 'heavy' ? 'Тяжёлая' : (a.category === 'medium' ? 'Средняя' : (a.category === 'light' ? 'Лёгкая' : 'Ткань'));
            return {
                ...a,
                gearKind: 'armor',
                price,
                category: `Броня (${catLabel})`,
                notes: `КБ +${a.acBonus}, макс. ЛВК +${a.dexCap}, штраф ${a.penalty}, группа: ${a.group}${a.traits ? ` (${a.traits})` : ''} (${price}).`
            };
        });

        const weaponsAsGear = [...(PF2E_MELEE_WEAPONS || []), ...(PF2E_RANGED_WEAPONS || [])]
            .filter(w => w.id !== 'fist')
            .map(w => {
                const price = WEAPON_PRICES[w.id] || (w.category === 'Экзотическое' ? '5 ЗМ' : (w.category === 'Воинское' ? '2 ЗМ' : '5 СМ'));
                return {
                    ...w,
                    gearKind: w.range ? 'ranged' : 'melee',
                    price,
                    category: `Оружие (${w.category} • ${w.group})`,
                    notes: `Урон ${w.dmgDice} (${w.dmgType})${w.range ? `, дистанция ${w.range}` : ''}${w.traits ? `, ${w.traits}` : ''} (${price}).`
                };
            });

        this._indexes.allGear = [
            ...PF2E_ITEMS_CATALOG,
            ...armorAsGear,
            ...weaponsAsGear
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
        this.init();
        const norm = this.normalize(nameOrId);
        return this._indexes.allGear.find(it => this.normalize(it.name) === norm)
            || this.findItem(nameOrId)
            || this.findArmor(nameOrId)
            || this.findWeapon(nameOrId);
    },

    searchAllGear(query = '') {
        this.init();
        const q = this.normalize(query);
        if (!q) return this._indexes.allGear;
        return this._indexes.allGear.filter(it =>
            this.normalize(it.name).includes(q) ||
            this.normalize(it.category).includes(q) ||
            this.normalize(it.notes).includes(q)
        );
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

    isItemActiveForHero(itemObj, heroLevel, isSlotInvested = true) {
        if (!itemObj) return false;
        const reqLvl = getItemLevel(itemObj);
        if (reqLvl > Math.max(1, Number(heroLevel) || 1)) return false;

        const isInv = /настроенность|вкладываем|invested/i.test(`${itemObj.notes || ''} ${itemObj.category || ''}`);
        if (isInv && !isSlotInvested) return false;

        return true;
    },

    isAvailableInShop(itemObj, maxLevel) {
        if (!itemObj || maxLevel <= 0) return false;
        if (itemObj.id === 'normal_ingredients' || itemObj.id === 'special_ingredients') return false;
        if (/привал/i.test(itemObj.category || '') && !itemObj.price) return false;

        const lvl = getItemLevel(itemObj);
        if (lvl > maxLevel) return false;

        // В лавках до 10 ур. включительно скрываем «Необычное» и «Экзотическое» снаряжение
        if (maxLevel < 20) {
            const meta = `${itemObj.category || ''} ${itemObj.traits || ''}`.toLowerCase();
            if (meta.includes('необычн') || meta.includes('экзотическ')) {
                return false;
            }
        }
        return true;
    },

    searchShopGear(query = '', maxLevel = 20) {
        this.init();
        const q = this.normalize(query);
        return this._indexes.allGear.filter(it => {
            if (!this.isAvailableInShop(it, maxLevel)) return false;
            if (!q) return true;
            return this.normalize(it.name).includes(q) ||
                this.normalize(it.category).includes(q) ||
                this.normalize(it.notes).includes(q);
        });
    },

};

window.CatalogService = CatalogService;
export default CatalogService;
