export const STAT_CATEGORIES = [
    {
        title: '💪 Характеристики',
        items: [
            { key: 'str', label: 'Сил', def: 0 },
            { key: 'dex', label: 'Лов', def: 0 },
            { key: 'con', label: 'Тел', def: 0 },
            { key: 'int', label: 'Инт', def: 0 },
            { key: 'wis', label: 'Мдр', def: 0 },
            { key: 'cha', label: 'Хар', def: 0 }
        ]
    },
    {
        title: '🛡️ Защита и Внимание',
        items: [
            { key: 'ac', label: 'КБ', def: 15 },
            { key: 'perc', label: 'Вним', def: 5 },
            { key: 'fort', label: 'Стойк', def: 5 },
            { key: 'ref', label: 'Реакц', def: 5 },
            { key: 'will', label: 'Воля', def: 5 }
        ]
    },
    {
        title: '🎯 Навыки',
        items: [
            { key: 'acro', label: 'Акробатика', def: 0 },
            { key: 'athl', label: 'Атлетика', def: 0 },
            { key: 'stea', label: 'Скрытность', def: 0 },
            { key: 'surv', label: 'Выживание', def: 0 },
            { key: 'medi', label: 'Медицина', def: 0 },
            { key: 'inti', label: 'Запугивание', def: 0 },
            { key: 'dece', label: 'Обман', def: 0 },
            { key: 'dipl', label: 'Дипломатия', def: 0 },
            { key: 'arca', label: 'Аркана', def: 0 },
            { key: 'natu', label: 'Природа', def: 0 },
            { key: 'occu', label: 'Оккультизм', def: 0 },
            { key: 'reli', label: 'Религия', def: 0 }
        ]
    }
];

export const PF2E_SHEET_CONFIG = {
    attributes: [
        { key: 'str', label: '💪 Сила (СИЛ)' },
        { key: 'dex', label: '🤸 Ловкость (ЛВК)' },
        { key: 'con', label: '🫀 Выносливость (ВЫН)' },
        { key: 'int', label: '📘 Интеллект (ИНТ)' },
        { key: 'wis', label: '🦉 Мудрость (МДР)' },
        { key: 'cha', label: '🎭 Харизма (ХАР)' }
    ],
    defenses: [
        { key: 'perception', label: '👁️ Внимание' },
        { key: 'fortitude', label: '🛡️ Стойкость' },
        { key: 'reflex', label: '⚡ Реакция' },
        { key: 'will', label: '🧠 Воля' }
    ],
    skills: [
        { key: 'acrobatics', label: '🤸 Акробатика (Лвк) (Штр)' },
        { key: 'athletics', label: '🏋️ Атлетика (Сил) (Штр)' },
        { key: 'thievery', label: '🗝️ Воровство (Лвк) (Штр)' },
        { key: 'survival', label: '🏕️ Выживание (Мдр)' },
        { key: 'diplomacy', label: '🤝 Дипломатия (Хар)' },
        { key: 'intimidation', label: '😠 Запугивание (Хар)' },
        { key: 'lore', label: '📚 Знание (Инт)' },
        { key: 'performance', label: '🎵 Исполнение (Хар)' },
        { key: 'medicine', label: '⚕️ Медицина (Мдр)' },
        { key: 'arcana', label: '🔮 Мистицизм (Инт)' },
        { key: 'deception', label: '🎭 Обман (Хар)' },
        { key: 'society', label: '🏛️ Общество (Инт)' },
        { key: 'occultism', label: '🕯️ Оккультизм (Инт)' },
        { key: 'nature', label: '🌿 Природа (Мдр)' },
        { key: 'religion', label: '☀️ Религия (Мдр)' },
        { key: 'crafting', label: '🔨 Ремесло (Инт)' },
        { key: 'stealth', label: '🥷 Скрытность (Лвк) (Штр)' }
    ]
};

export const SHORT_TO_FULL_SKILL_MAP = {
    perc: 'perception',
    fort: 'fortitude',
    ref: 'reflex',
    acro: 'acrobatics',
    athl: 'athletics',
    stea: 'stealth',
    surv: 'survival',
    medi: 'medicine',
    inti: 'intimidation',
    dece: 'deception',
    dipl: 'diplomacy',
    arca: 'arcana',
    natu: 'nature',
    occu: 'occultism',
    reli: 'religion'
};

export function createDefaultStats() {
    const stats = {};
    STAT_CATEGORIES.forEach(cat => {
        cat.items.forEach(item => {
            stats[item.key] = item.def;
        });
    });
    return stats;
}

export function ensureCharacterStats(item) {
    if (!item.stats || typeof item.stats !== 'object') {
        item.stats = {};
    }

    const numDefaults = {
        level: 1, xp: 0, speed: 25,
        hpMax: 10, hpCurrent: 10, hpTemp: 0,
        ac: 10, acDex: 0, acProf: 0, acItem: 0, acOther: 0,
        acShieldBonus: 0, acShieldHardness: 0, acShieldHp: 0, acArmorPenalty: 0,
        saveProf_perc: 2, saveProf_fort: 2, saveProf_ref: 2, saveProf_will: 2,
        saveItemBonus: 0,

        prof_acrobatics: 0, prof_athletics: 0, prof_thievery: 0, prof_survival: 0,
        prof_diplomacy: 0, prof_intimidation: 0, prof_lore: 0, prof_performance: 0,
        prof_medicine: 0, prof_arcana: 0, prof_deception: 0, prof_society: 0,
        prof_occultism: 0, prof_nature: 0, prof_religion: 0, prof_crafting: 0, prof_stealth: 0,

        spellAttack: 0, spellDc: 10,
        cantripsPerDay: 5, lvl1PerDay: 0, lvl2PerDay: 0, lvl3PerDay: 0, lvl4PerDay: 0,
        coinsCopper: 0, coinsSilver: 0, coinsGold: 0,
        focusMax: 1, focusCurrent: 1,

        compHpMax: 0, compHpCur: 0, compAc: 10, compSpeed: 25
    };

    for (let i = 1; i <= 15; i++) {
        numDefaults[`item${i}Qty`] = 1;
    }

    Object.entries(numDefaults).forEach(([k, def]) => {
        if (item.stats[k] === undefined || item.stats[k] === null) {
            item.stats[k] = def;
        }
    });

    const allModKeys = [
        ...PF2E_SHEET_CONFIG.attributes,
        ...PF2E_SHEET_CONFIG.defenses,
        ...PF2E_SHEET_CONFIG.skills
    ];
    allModKeys.forEach(({ key }) => {
        if (item.stats[key] === undefined || item.stats[key] === null) {
            item.stats[key] = 0;
        }
    });

    const textDefaults = {
        pronouns: '', alignment: '', playerName: '',
        ancestry: '', heritage: '', ancestryFeat: '',
        background: '', backgroundFeat: '',
        charClass: '', classFeatsLvl1: '', classFeatsLvl2: '', classFeatsLvl3: '',
        perceptionNotes: '', armorType: 'unarmored', armorName: '', armorNotes: '',
        weaponProfNotes: '',
        melee1Name: '', melee1Atk: '', melee1Dmg: '', melee1Traits: '',
        melee2Name: '', melee2Atk: '', melee2Dmg: '', melee2Traits: '',
        rangedName: '', rangedAtk: '', rangedDmg: '', rangedTraits: '',
        skillOtherNotes: '',
        equipmentText: '',
        cantripsPrepared: '', lvl1Prepared: '', lvl2Prepared: '',
        spellbookText: '', adventureLogText: '', notesText: '',
        compName: '', compType: 'none', compAbilitiesText: '',

        compSpeciesId: '',

        actionSlot1Name: '', actionSlot1Desc: '',
        actionSlot2Name: '', actionSlot2Desc: '',
        actionSlot3Name: '', actionSlot3Desc: ''
    };

    [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20].forEach(lvl => {
        textDefaults[`classFeatLvl${lvl}Name`] = '';
        textDefaults[`classFeatLvl${lvl}Desc`] = '';
    });

    new Array(3, 7, 11, 15, 19).forEach(lvl => {
        textDefaults[`genFeatLvl${lvl}Name`] = '';
        textDefaults[`genFeatLvl${lvl}Desc`] = '';
    });

    new Array(2, 4, 6, 8, 10, 12, 14, 16, 18, 20).forEach(lvl => {
        textDefaults[`skillFeatLvl${lvl}Name`] = '';
        textDefaults[`skillFeatLvl${lvl}Desc`] = '';
    });

    new Array(1, 5, 9, 13, 17).forEach(lvl => {
        textDefaults[`ancFeatLvl${lvl}Name`] = '';
        textDefaults[`ancFeatLvl${lvl}Desc`] = '';
    });

    for (let i = 1; i <= 15; i++) {
        textDefaults[`item${i}Name`] = '';
        textDefaults[`item${i}Notes`] = '';
    }

    for (let i = 1; i <= 5; i++) {
        textDefaults[`cantrip${i}Name`] = '';
        textDefaults[`cantrip${i}Actions`] = '';
        textDefaults[`cantrip${i}Notes`] = '';
        if (item.stats[`cantrip${i}Ready`] === undefined) item.stats[`cantrip${i}Ready`] = false;

        textDefaults[`lvl2Spell${i}Name`] = '';
        textDefaults[`lvl2Spell${i}Actions`] = '';
        textDefaults[`lvl2Spell${i}Notes`] = '';
        if (item.stats[`lvl2Spell${i}Ready`] === undefined) item.stats[`lvl2Spell${i}Ready`] = false;

        textDefaults[`lvl3Spell${i}Name`] = '';
        textDefaults[`lvl3Spell${i}Actions`] = '';
        textDefaults[`lvl3Spell${i}Notes`] = '';
        if (item.stats[`lvl3Spell${i}Ready`] === undefined) item.stats[`lvl3Spell${i}Ready`] = false;

        textDefaults[`lvl4Spell${i}Name`] = '';
        textDefaults[`lvl4Spell${i}Actions`] = '';
        textDefaults[`lvl4Spell${i}Notes`] = '';
        if (item.stats[`lvl4Spell${i}Ready`] === undefined) item.stats[`lvl4Spell${i}Ready`] = false;

    }

    for (let i = 1; i <= 7; i++) {
        textDefaults[`lvl1Spell${i}Name`] = '';
        textDefaults[`lvl1Spell${i}Actions`] = '';
        textDefaults[`lvl1Spell${i}Notes`] = '';
        if (item.stats[`lvl1Spell${i}Ready`] === undefined) item.stats[`lvl1Spell${i}Ready`] = false;
    }

    for (let i = 1; i <= 3; i++) {
        textDefaults[`focusSpell${i}Name`] = '';
        textDefaults[`focusSpell${i}Actions`] = '';
        textDefaults[`focusSpell${i}Notes`] = '';
        if (item.stats[`focusSpell${i}Ready`] === undefined) item.stats[`focusSpell${i}Ready`] = false;
    }

    Object.entries(textDefaults).forEach(([k, def]) => {
        if (item.stats[k] === undefined || item.stats[k] === null) {
            item.stats[k] = def;
        }
    });

    return item.stats;
}
