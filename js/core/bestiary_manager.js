import AvatarRegistry from '../services/avatars/avatar_registry.js';
import EventBus from '../services/event_bus.js';
import ModalManager from '../ui/modal_manager.js';
import { PF2E_CANTRIPS, searchCantrips } from '../config/cantrips_catalog.js';
import { PF2E_ITEMS_CATALOG, searchItemsCatalog, isCombatConsumable } from '../config/items_catalog.js';
import { PF2E_ARMOR_CATALOG, searchArmorCatalog, getArmorGroupEffect } from '../config/armor_catalog.js';

import {
    PF2E_SPELLS_LVL1,
    searchSpellsLvl1,
    PF2E_SPELLS_LVL2,
    searchSpellsLvl2
} from '../config/spells_catalog.js';
import { PF2E_FOCUS_SPELLS, searchFocusSpells } from '../config/focus_spells_catalog.js';

import {
    PF2E_MELEE_WEAPONS,
    searchMeleeWeapons,
    calcMeleeWeaponRoll,
    PF2E_RANGED_WEAPONS,
    searchRangedWeapons,
    calcRangedWeaponRoll,
    getWeaponCritEffect
} from '../config/weapons_catalog.js';


// Добавьте в начало bestiary_manager.js (после импортов)
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

export function createDefaultStats() {
    const stats = {};
    STAT_CATEGORIES.forEach(cat => {
        cat.items.forEach(item => {
            stats[item.key] = item.def;
        });
    });
    return stats;
}

const PF2E_SHEET_CONFIG = {
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


const BestiaryManager = {
    state: {
        party: [],     // Текущий отряд Герои / Союзники
        monsters: [],  // Подготовленные монстры / NPC / Враги
        inactive: []   // Неактивные герои в резерве
    },
    mapDataRef: null,
    _pendingAvatarType: null,
    _isBound: false,

    init(mapData) {
        this.mapDataRef = mapData || { hexes: {}, kingdom: null, bestiary: null };
        if (this.mapDataRef.bestiary) {
            this.state = this.mapDataRef.bestiary;
            if (!Array.isArray(this.state.party)) this.state.party = [];
            if (!Array.isArray(this.state.monsters)) this.state.monsters = [];
            if (!Array.isArray(this.state.inactive)) this.state.inactive = [];
        } else {
            this.mapDataRef.bestiary = this.state;
        }

        EventBus.on('data:imported', (newData) => {
            this.mapDataRef = newData || {};
            if (this.mapDataRef.bestiary) {
                this.state = this.mapDataRef.bestiary;
                if (!Array.isArray(this.state.party)) this.state.party = [];
                if (!Array.isArray(this.state.monsters)) this.state.monsters = [];
                if (!Array.isArray(this.state.inactive)) this.state.inactive = [];
            }
            this.renderUi();
        });

        window.BestiaryManager = this;
        this.renderUi();
    },


    moveHeroReserve(fromGroup, toGroup, id) {
        if (!Array.isArray(this.state.party)) this.state.party = [];
        if (!Array.isArray(this.state.inactive)) this.state.inactive = [];

        const sourceList = this.state[fromGroup];
        const targetList = this.state[toGroup];
        if (!Array.isArray(sourceList) || !Array.isArray(targetList)) return;

        const idx = sourceList.findIndex(x => x.id === id);
        if (idx === -1) return;

        const [hero] = sourceList.splice(idx, 1);
        targetList.push(hero);
        this._save();
    },


    _save() {
        if (this.mapDataRef) this.mapDataRef.bestiary = this.state;
        EventBus.emit('data:save');
        this.renderUi();
        if (window.InitiativeManager) {
            window.InitiativeManager.renderUi();
        }
    },


    _ensureCharacterStats(item) {
        if (!item.stats || typeof item.stats !== 'object') {
            item.stats = {};
        }

        const numDefaults = {
            level: 1, xp: 0, speed: 25,
            hpMax: 10, hpCurrent: 10, hpTemp: 0,
            ac: 10, acDex: 0, acProf: 0, acItem: 0, acOther: 0,
            acShieldBonus: 0, acShieldHardness: 0, acShieldHp: 0, acArmorPenalty: 0,
            spellAttack: 0, spellDc: 10,
            cantripsPerDay: 5, lvl1PerDay: 0, lvl2PerDay: 0,
            coinsCopper: 0, coinsSilver: 0, coinsGold: 0,
            focusMax: 1, focusCurrent: 1,
            item1Qty: 1, item2Qty: 1, item3Qty: 1, item4Qty: 1,
            item5Qty: 1, item6Qty: 1, item7Qty: 1, item8Qty: 1,
            item9Qty: 1, item10Qty: 1, item11Qty: 1, item12Qty: 1,
            item13Qty: 1, item14Qty: 1, item15Qty: 1,
        };

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
            perceptionNotes: '', armorType: 'unarmored', armorNotes: '',
            weaponProfNotes: '',
            melee1Name: '', melee1Atk: '', melee1Dmg: '', melee1Traits: '',
            melee2Name: '', melee2Atk: '', melee2Dmg: '', melee2Traits: '',
            rangedName: '', rangedAtk: '', rangedDmg: '', rangedTraits: '',
            skillOtherNotes: '',

            equipmentText: '',
            item1Name: '', item1Notes: '',
            item2Name: '', item2Notes: '',
            item3Name: '', item3Notes: '',
            item4Name: '', item4Notes: '',
            item5Name: '', item5Notes: '',
            item6Name: '', item6Notes: '',
            item7Name: '', item7Notes: '',
            item8Name: '', item8Notes: '',
            item9Name: '', item9Notes: '',
            item10Name: '', item10Notes: '',
            item11Name: '', item11Notes: '',
            item12Name: '', item12Notes: '',
            item13Name: '', item13Notes: '',
            item14Name: '', item14Notes: '',
            item15Name: '', item15Notes: '',

            cantripsPrepared: '',
            cantrip1Name: '', cantrip1Actions: '', cantrip1Notes: '', cantrip1Ready: false,
            cantrip2Name: '', cantrip2Actions: '', cantrip2Notes: '', cantrip2Ready: false,
            cantrip3Name: '', cantrip3Actions: '', cantrip3Notes: '', cantrip3Ready: false,
            cantrip4Name: '', cantrip4Actions: '', cantrip4Notes: '', cantrip4Ready: false,
            cantrip5Name: '', cantrip5Actions: '', cantrip5Notes: '', cantrip5Ready: false,

            focusSpell1Name: '', focusSpell1Actions: '', focusSpell1Notes: '', focusSpell1Ready: false,
            focusSpell2Name: '', focusSpell2Actions: '', focusSpell2Notes: '', focusSpell2Ready: false,
            focusSpell3Name: '', focusSpell3Actions: '', focusSpell3Notes: '', focusSpell3Ready: false,

            lvl1Prepared: '',
            lvl1Spell1Name: '', lvl1Spell1Actions: '', lvl1Spell1Notes: '', lvl1Spell1Ready: false,
            lvl1Spell2Name: '', lvl1Spell2Actions: '', lvl1Spell2Notes: '', lvl1Spell2Ready: false,
            lvl1Spell3Name: '', lvl1Spell3Actions: '', lvl1Spell3Notes: '', lvl1Spell3Ready: false,
            lvl1Spell4Name: '', lvl1Spell4Actions: '', lvl1Spell4Notes: '', lvl1Spell4Ready: false,
            lvl1Spell5Name: '', lvl1Spell5Actions: '', lvl1Spell5Notes: '', lvl1Spell5Ready: false,
            lvl1Spell6Name: '', lvl1Spell6Actions: '', lvl1Spell6Notes: '', lvl1Spell6Ready: false,
            lvl1Spell7Name: '', lvl1Spell7Actions: '', lvl1Spell7Notes: '', lvl1Spell7Ready: false,

            lvl2Prepared: '',
            lvl2Spell1Name: '', lvl2Spell1Actions: '', lvl2Spell1Notes: '', lvl2Spell1Ready: false,
            lvl2Spell2Name: '', lvl2Spell2Actions: '', lvl2Spell2Notes: '', lvl2Spell2Ready: false,
            lvl2Spell3Name: '', lvl2Spell3Actions: '', lvl2Spell3Notes: '', lvl2Spell3Ready: false,
            lvl2Spell4Name: '', lvl2Spell4Actions: '', lvl2Spell4Notes: '', lvl2Spell4Ready: false,
            lvl2Spell5Name: '', lvl2Spell5Actions: '', lvl2Spell5Notes: '', lvl2Spell5Ready: false,

            spellbookText: '',
            adventureLogText: '',
            notesText: ''
        };

        Object.entries(textDefaults).forEach(([k, def]) => {
            if (item.stats[k] === undefined || item.stats[k] === null) {
                item.stats[k] = def;
            }
        });

        for (let i = 1; i <= 15; i++) {
            if (item.stats[`item${i}Qty`] === undefined || item.stats[`item${i}Qty`] === null) {
                item.stats[`item${i}Qty`] = 1;
            }
            if (item.stats[`item${i}Name`] === undefined || item.stats[`item${i}Name`] === null) {
                item.stats[`item${i}Name`] = '';
            }
            if (item.stats[`item${i}Notes`] === undefined || item.stats[`item${i}Notes`] === null) {
                item.stats[`item${i}Notes`] = '';
            }
        }

        return item.stats;
    },

    addPreset(name, faction = 'enemy', defaultScore = 10) {
        const cleanName = String(name || '').trim();
        if (!cleanName) {
            alert('Введите имя персонажа или монстра!');
            return;
        }

        const avatarType = this._pendingAvatarType || AvatarRegistry.guessAvatarByName(cleanName);
        const avatar = avatarType ? AvatarRegistry.getAvatarDataUrl(avatarType) : null;
        this._pendingAvatarType = null;


        const entry = {
            id: 'bst_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            name: cleanName,
            faction: faction || 'enemy',
            defaultScore: Math.max(1, Math.min(100, parseInt(defaultScore, 10) || 10)),
            avatarType,
            avatar,
            stats: createDefaultStats() // <-- Новое поле со всеми параметрами
        };


        this._ensureCharacterStats(entry);
        if (faction === 'friend') {
            this.state.party.push(entry);
        } else {
            this.state.monsters.push(entry);
        }
        this._save();
    },

    confirmRemoveHero(groupKey, id) {
        const list = this._getGroupList(groupKey);
        const hero = list.find(x => x.id === id);
        if (!hero) return;

        const locationLabel = groupKey === 'inactive' ? 'резерва' : 'текущего отряда';

        ModalManager.open({
            id: 'bstConfirmDeleteHeroModal',
            title: '⚠️ Удаление персонажа',
            width: '460px',
            borderColor: '#e74c3c',
            bodyHtml: `
                <div style="font-size: 16px; line-height: 1.5; color: #ebd291;">
                    Вы действительно хотите навсегда удалить героя <b style="color: #ffd875;">${hero.name}</b> из ${locationLabel}?
                    <div style="margin-top: 8px; font-size: 14px; color: #ff7675;">
                        Все заполненные характеристики, навыки, снаряжение и заметки в бланке будут потеряны.
                    </div>
                </div>
            `,
            footerButtons: [
                {
                    label: '✖ Отмена',
                    variant: 'cc'
                },
                {
                    label: '🗑️ Удалить навсегда',
                    variant: 'del',
                    onClick: ({ close }) => {
                        this.removePreset(groupKey, id);
                        close();
                    }
                }
            ]
        });
    },


    removePreset(groupKey, id) {
        if (groupKey === 'party') {
            this.state.party = this.state.party.filter(x => x.id !== id);
        } else if (groupKey === 'inactive') {
            this.state.inactive = (this.state.inactive || []).filter(x => x.id !== id);
        } else {
            this.state.monsters = this.state.monsters.filter(x => x.id !== id);
        }
        this._save();
    },

    updatePresetScore(groupKey, id, val) {
        const num = Math.max(1, Math.min(100, parseInt(val, 10) || 10));
        const item = this._getGroupList(groupKey).find(x => x.id === id);
        if (item) {
            item.defaultScore = num;
            this._save();
        }
    },

    _getGroupList(groupKey) {
        if (groupKey === 'party') return this.state.party;
        if (groupKey === 'inactive') {
            if (!Array.isArray(this.state.inactive)) this.state.inactive = [];
            return this.state.inactive;
        }
        return this.state.monsters;
    },


    updatePresetName(groupKey, id, newName) {
        const cleanName = String(newName || '').trim();
        if (!cleanName) return;

        const list = groupKey === 'party' ? this.state.party : this.state.monsters;
        const item = list.find(x => x.id === id);
        if (!item || item.name === cleanName) return;

        const oldName = item.name;
        item.name = cleanName;

        // Если аватар не был задан жёстко, пробуем обновить по новому имени
        if (!item.avatarType) {
            const guessed = AvatarRegistry.guessAvatarByName(cleanName);
            if (guessed) {
                item.avatarType = guessed;
                item.avatar = AvatarRegistry.getAvatarDataUrl(guessed);
            }
        }

        // Синхронизируем имя с бойцом в трекере инициативы (если он уже в бою)
        if (window.InitiativeManager?.state?.combatants) {
            let initChanged = false;
            window.InitiativeManager.state.combatants.forEach(u => {
                if (u.name === oldName && u.faction === item.faction) {
                    u.name = cleanName;
                    initChanged = true;
                }
            });
            if (initChanged) {
                window.InitiativeManager.renderUi();
            }
        }

        this._save();
    },


    openCharacterSheetModal(heroId, pageNum = 1) {
        const hero = this.state.party.find(x => x.id === heroId)
            || (this.state.inactive || []).find(x => x.id === heroId)
            || (this.state.monsters || []).find(x => x.id === heroId);
        if (!hero) return;

        const stats = this._ensureCharacterStats(hero);

        const esc = (v) => String(v ?? '').replace(/"/g, '&quot;');
        const numInp = (key, cls = 'bst-stat-inp') =>
            `<input type="number" data-sheet-num="${key}" class="k-inp ${cls}" value="${stats[key] ?? 0}">`;
        const txtInp = (key, placeholder = '') =>
            `<input type="text" data-sheet-txt="${key}" class="k-inp bst-txt-inp" placeholder="${placeholder}" value="${esc(stats[key])}">`;
        const txtArea = (key, rows = 4, placeholder = '') =>
            `<textarea data-sheet-txt="${key}" class="k-inp bst-area-inp" rows="${rows}" placeholder="${placeholder}">${String(stats[key] ?? '')}</textarea>`;



        const collectFormData = (overlayEl) => {
            overlayEl.querySelectorAll('[data-sheet-num]').forEach(inp => {
                const k = inp.dataset.sheetNum;
                const val = parseInt(inp.value, 10);
                hero.stats[k] = isNaN(val) ? 0 : val;
            });
            overlayEl.querySelectorAll('[data-sheet-txt]').forEach(inp => {
                const k = inp.dataset.sheetTxt;
                hero.stats[k] = inp.value;
            });
            overlayEl.querySelectorAll('[data-sheet-chk]').forEach(chk => {
                const k = chk.dataset.sheetChk;
                hero.stats[k] = chk.checked;
            });


            // Синхронизируем полные ключи бланка с короткими ключами трекера инициативы
            const syncMap = {
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

            Object.entries(syncMap).forEach(([shortKey, fullKey]) => {
                if (hero.stats[fullKey] !== undefined) {
                    hero.stats[shortKey] = hero.stats[fullKey];
                }
            });
        };


        const page1Html = `
            <div class="bst-sheet-top-bar">
                <div class="bst-top-field"><span>🧬 Народ</span>${txtInp('ancestry', 'Человек, Эльф...')}</div>
                <div class="bst-top-field"><span>📜 Происхождение</span>${txtInp('background', 'Воин, Учёный...')}</div>
                <div class="bst-top-field"><span>⚔️ Класс</span>${txtInp('charClass', 'Воин, Жрец...')}</div>
                <div class="bst-top-field"><span>⚖️ Мировоззрение</span>${txtInp('alignment', 'НД, ПЗ...')}</div>
                <div class="bst-top-field bst-narrow"><span>⭐ Уровень</span>${numInp('level', 'bst-mini-num')}</div>
                <div class="bst-top-field bst-narrow"><span>✨ Опыт</span>${numInp('xp', 'bst-mini-num')}</div>
                <div class="bst-top-field"><span>👤 Игрок</span>${txtInp('playerName', 'Имя игрока')}</div>
            </div>

            <div class="bst-sheet-page1-grid">
                <div class="bst-sheet-col">
                    <div class="k-panel" style="margin-bottom: 10px;">
                        <div class="k-sec-title">⚔️ Модификаторы характеристик</div>
                        <div class="bst-stats-2col">
                            ${PF2E_SHEET_CONFIG.attributes.map(a => `
                                <div class="bst-stat-row">
                                    <label class="bst-stat-label">${a.label}</label>
                                    ${numInp(a.key)}
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="k-panel">
                        <div class="k-sec-title">📜 Навыки Pathfinder</div>
                        <div class="bst-skills-2col">
                            ${PF2E_SHEET_CONFIG.skills.map(s => `
                                <div class="bst-stat-row">
                                    <label class="bst-stat-label">${s.label}</label>
                                    ${numInp(s.key)}
                                </div>
                            `).join('')}
                        </div>
                        <div style="margin-top: 8px;">
                            ${txtInp('skillOtherNotes', '📝 Прочие навыки / заметки...')}
                        </div>
                    </div>
                </div>

                <div class="bst-sheet-col">
                
                
                    <div class="k-panel" style="margin-bottom: 10px;">
                        <div class="k-sec-title">🛡️ Защита, Доспехи и Щит (Калькулятор КБ)</div>
                        <div class="bst-vitals-row" style="margin-bottom: 12px;">
                            <div class="bst-vital-box"><span>❤️ Макс. ПЗ</span>${numInp('hpMax', 'bst-vital-num')}</div>
                            <div class="bst-vital-box"><span>🩸 Текущие ПЗ</span>${numInp('hpCurrent', 'bst-vital-num')}</div>
                            <div class="bst-vital-box"><span>💠 Врем. ПЗ</span>${numInp('hpTemp', 'bst-vital-num')}</div>
                            <div class="bst-vital-box"><span>👟 Скорость</span>${numInp('speed', 'bst-vital-num')}</div>
                            <div class="bst-vital-box bst-ac-highlight" style="background: rgba(138, 100, 33, 0.25) !important; border-color: #ffd875 !important;">
                                <span style="color:#ffd875; font-weight:900;">🛡️ ИТОГ КБ</span>
                                <input type="number" data-sheet-num="ac" class="k-inp bst-vital-num" style="color:#ffd875 !important; font-weight:900 !important;" value="${stats.ac ?? 10}" readonly title="Рассчитывается автоматически: 10 + Мод + Умение + Предмет + Прочее">
                            </div>
                        </div>
                        
                        <!-- Полный калькулятор доспеха как на фото -->
                        <div class="bst-ac-breakdown" style="background: rgba(4, 9, 5, 0.85); padding: 12px; border-radius: 6px; border: 2px solid #543e0d; margin-bottom: 12px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom: 1px dashed rgba(138,100,33,0.3); padding-bottom:6px;">
                                <select data-sheet-txt="armorType" class="k-inp bst-armor-calc-trigger" style="width: auto; font-size: 14px; font-weight: bold;">
                                    <option value="unarmored" ${stats.armorType === 'unarmored' ? 'selected' : ''}>👕 Ткань / Без брони (Макс Лвк: +5)</option>
                                    <option value="light" ${stats.armorType === 'light' ? 'selected' : ''}>🧥 Лёгкая броня (Макс Лвк: +3)</option>
                                    <option value="medium" ${stats.armorType === 'medium' ? 'selected' : ''}>🦺 Средняя броня (Макс Лвк: +2)</option>
                                    <option value="heavy" ${stats.armorType === 'heavy' ? 'selected' : ''}>🛡️ Тяжёлая броня (Макс Лвк: +1)</option>
                                </select>
                                
                                <div style="position: relative; display: inline-block; margin-left: 8px;">
                                    <input type="text" data-sheet-txt="armorName" class="k-inp bst-armor-picker-inp" autocomplete="off" placeholder="📦 Выберите доспех..." style="width: 220px;" value="${esc(stats.armorName ?? '')}">
                                    <div class="bst-cantrip-dropdown" data-armor-drop="1" style="display: none; z-index: 10000100;"></div>
                                </div>
                                
                                <label style="color:#ff7675; font-weight:bold; font-size:13px;">
                                    ⚠️ Штраф брони (Check Penalty): 
                                    <input type="number" data-sheet-num="acArmorPenalty" class="k-inp bst-tiny-num bst-armor-calc-trigger" style="color:#ff7675 !important; border-color:#e74c3c !important; width:55px !important;" value="${stats.acArmorPenalty ?? 0}">
                                </label>
                            </div>
                            <div style="display:grid; grid-template-columns: auto repeat(4, 1fr); gap: 6px; width:100%; align-items: center; font-size:13px; color:#ebd291;">
                                <span style="font-weight:bold; color:#dfbc6f; font-size:15px; margin-right:4px;">10 ➕</span>
                                <label title="Модификатор Ловкости (с учетом ограничений доспеха)">🤸 Лвк:<input type="number" data-sheet-num="acDex" class="k-inp bst-tiny-num bst-armor-calc-trigger" value="${stats.acDex ?? 0}"></label>
                                <label title="Бонус умения (Уровень + Проф)">🎓 Умение:<input type="number" data-sheet-num="acProf" class="k-inp bst-tiny-num bst-armor-calc-trigger" value="${stats.acProf ?? 0}"></label>
                                <label title="Бонус предмета от самой брони">🧥 Предмет:<input type="number" data-sheet-num="acItem" class="k-inp bst-tiny-num bst-armor-calc-trigger" value="${stats.acItem ?? 0}"></label>
                                <label title="Прочие бонусы/штрафы состояния или обстоятельств">➕ Прочее:<input type="number" data-sheet-num="acOther" class="k-inp bst-tiny-num bst-armor-calc-trigger" value="${stats.acOther ?? 0}"></label>
                            </div>
                        </div>

                        <!-- Профессиональный блок управления Щитом (Shield Block) -->
                        <div style="background: rgba(20, 31, 41, 0.9); padding: 12px; border-radius: 6px; border: 2px solid #3498db; display: grid; grid-template-columns: 1.1fr repeat(3, 1fr); gap: 10px; align-items: center;">
                            <div style="display:flex; flex-direction:column; gap:2px;">
                                <span style="font-size:13px; font-weight:900; color:#74b9ff; text-transform:uppercase; letter-spacing:0.5px;">🛡️ Настройки щита</span>
                                <span style="font-size:11px; color:#a4b0be; font-style:italic;">(Shield Raise)</span>
                            </div>
                            <label title="Бонус КБ при поднятии щита (Raise Shield)">➕ Бонус КБ:<input type="number" data-sheet-num="acShieldBonus" class="k-inp bst-tiny-num" style="color:#74b9ff !important; font-weight:bold;" value="${stats.acShieldBonus ?? 0}"></label>
                            <label title="Твердость щита (Hardness) — поглощает урон">💎 Твердость:<input type="number" data-sheet-num="acShieldHardness" class="k-inp bst-tiny-num" style="color:#74b9ff !important; font-weight:bold;" value="${stats.acShieldHardness ?? 0}"></label>
                            <label title="Текущая прочность щита. Порог поломки (BT) равен половине макс ПЗ">❤️ Тек. ПЗ:<input type="number" data-sheet-num="acShieldHp" class="k-inp bst-tiny-num" style="color:#74b9ff !important; font-weight:bold;" value="${stats.acShieldHp ?? 0}"></label>
                        </div>
                    </div>


                    

                    <div class="k-panel" style="margin-bottom: 10px;">
                        <div class="k-sec-title">👁️ Внимание и Испытания</div>
                        <div class="bst-stats-2col">
                            ${PF2E_SHEET_CONFIG.defenses.map(d => `
                                <div class="bst-stat-row">
                                    <label class="bst-stat-label">${d.label}</label>
                                    ${numInp(d.key)}
                                </div>
                            `).join('')}
                        </div>
                        <div style="margin-top: 6px;">
                            ${txtInp('perceptionNotes', '👀 Восприятие и прочее (сумеречное зрение и т.д.)...')}
                        </div>
                    </div>



                    <div class="k-panel" style="margin-bottom: 10px;">
                        <div class="k-sec-title">🗡️ Оружие и Атаки</div>
                        ${['melee1', 'melee2'].map((prefix, idx) => `
                            <div class="bst-weapon-row">
                                <div style="position: relative;">
                                    <input type="text"
                                           data-sheet-txt="${prefix}Name"
                                           data-weapon-slot="${prefix}"
                                           class="k-inp bst-txt-inp bst-weapon-picker-inp"
                                           autocomplete="off"
                                           placeholder="⚔️ Ближний бой ${idx + 1} (выбор...)"
                                           value="${esc(stats[`${prefix}Name`])}">
                                    <div class="bst-cantrip-dropdown" data-weapon-drop="${prefix}" style="display: none;"></div>
                                </div>
                                ${txtInp(`${prefix}Atk`, '🎯 Атака (+)')}
                                ${txtInp(`${prefix}Dmg`, '💥 Урон (1d8+3)')}
                                ${txtInp(`${prefix}Traits`, '🏷️ Дескрипторы')}
                            </div>
                        `).join('')}
                        <div class="bst-weapon-row">
                            <div style="position: relative;">
                                <input type="text"
                                       data-sheet-txt="rangedName"
                                       data-ranged-picker="1"
                                       class="k-inp bst-txt-inp bst-ranged-picker-inp"
                                       autocomplete="off"
                                       placeholder="🏹 Дистанционное (выбор...)"
                                       value="${esc(stats.rangedName)}">
                                <div class="bst-cantrip-dropdown" data-ranged-drop="1" style="display: none;"></div>
                            </div>
                            ${txtInp('rangedAtk', '🎯 Атака (+)')}
                            ${txtInp('rangedDmg', '💥 Урон / Дист.')}
                            ${txtInp('rangedTraits', '🏷️ Дескрипторы')}
                        </div>
                        <div style="margin-top: 6px;">
                            ${txtInp('weaponProfNotes', '🥋 Умения в оружии (Простое, Особое, Кулак)...')}
                        </div>
                    </div>


                    

                    <div class="k-panel">
                        <div class="k-sec-title">🌟 Способности народа, происхождения и класса</div>
                        <div class="bst-feats-grid">
                            ${txtInp('heritage', '🧬 Родословная и способность народа')}
                            ${txtInp('backgroundFeat', '📜 Способность происхождения')}
                            ${txtInp('classFeatsLvl1', '⚔️ Классовые способности (1 ур.)')}
                            ${txtInp('classFeatsLvl2', '🔥 Классовые способности (2-3 ур.)')}
                        </div>
                    </div>
                </div>
            </div>
        `;


        if (stats.cantripsPrepared && !stats.cantrip1Name && !stats.cantrip1Notes) {
            stats.cantrip1Name = stats.cantripsPrepared;
            stats.cantripsPrepared = '';
        }

//        const cantripIndices =;
        const cantripsRowsHtml = Array.from({ length: 5 }, (_, i) => i + 1).map(idx => `
            <tr>
                <td class="bst-cantrip-num">${idx}</td>
                <td style="position: relative;">
                    <input type="text"
                           data-sheet-txt="cantrip${idx}Name"
                           data-cantrip-row="${idx}"
                           class="k-inp bst-txt-inp bst-cantrip-picker-inp"
                           autocomplete="off"
                           placeholder="Выберите или введите фокус..."
                           value="${esc(stats[`cantrip${idx}Name`])}">
                    <div class="bst-cantrip-dropdown" data-cantrip-drop="${idx}" style="display: none;"></div>
                </td>
                <td>${txtInp(`cantrip${idx}Actions`, '◆ / 30 фт.')}</td>
                <td>${txtInp(`cantrip${idx}Notes`, 'Урон, спасбросок, эффект...')}</td>
            </tr>
        `).join('');


        if (stats.lvl1Prepared && !stats.lvl1Spell1Name && !stats.lvl1Spell1Notes) {
            stats.lvl1Spell1Name = stats.lvl1Prepared;
            stats.lvl1Prepared = '';
        }

        const lvl1SpellsRowsHtml = Array.from({ length: 5 }, (_, i) => i + 1).map(idx => `
            <tr>
                <td class="bst-cantrip-num">${idx}</td>
                <td style="position: relative;">
                    <input type="text"
                           data-sheet-txt="lvl1Spell${idx}Name"
                           data-lvl1-row="${idx}"
                           class="k-inp bst-txt-inp bst-lvl1-picker-inp"
                           autocomplete="off"
                           placeholder="Выберите или введите заклинание..."
                           value="${esc(stats[`lvl1Spell${idx}Name`])}">
                    <div class="bst-cantrip-dropdown" data-lvl1-drop="${idx}" style="display: none;"></div>
                </td>
                <td>${txtInp(`lvl1Spell${idx}Actions`, '◆◆ / 30 фт.')}</td>
                <td>${txtInp(`lvl1Spell${idx}Notes`, 'Урон, спасбросок, эффект...')}</td>
            </tr>
        `).join('');

        if (stats.lvl2Prepared && !stats.lvl2Spell1Name && !stats.lvl2Spell1Notes) {
            stats.lvl2Spell1Name = stats.lvl2Prepared;
            stats.lvl2Prepared = '';
        }

        const lvl2SpellsRowsHtml = Array.from({ length: 5 }, (_, i) => i + 1).map(idx => `
            <tr>
                <td class="bst-cantrip-num">
                    <label title="Подготовлено / Использовано" style="cursor:pointer; display:flex; align-items:center; justify-content:center; gap:3px;">
                        <input type="checkbox" data-sheet-chk="lvl2Spell${idx}Ready" ${stats[`lvl2Spell${idx}Ready`] ? 'checked' : ''}>
                        <span>${idx}</span>
                    </label>
                </td>
                <td style="position: relative;">
                    <input type="text"
                           data-sheet-txt="lvl2Spell${idx}Name"
                           data-lvl2-row="${idx}"
                           class="k-inp bst-txt-inp bst-lvl2-picker-inp"
                           autocomplete="off"
                           placeholder="Выберите заклинание 2 круга..."
                           value="${esc(stats[`lvl2Spell${idx}Name`])}">
                    <div class="bst-cantrip-dropdown" data-lvl2-drop="${idx}" style="display: none;"></div>
                </td>
                <td>${txtInp(`lvl2Spell${idx}Actions`, '◆◆ / 30 фт.')}</td>
                <td>${txtInp(`lvl2Spell${idx}Notes`, 'Эффект заклинания...')}</td>
            </tr>
        `).join('');

        const focusSpellsRowsHtml = Array.from({ length: 3 }, (_, i) => i + 1).map(idx => `
            <tr>
                <td class="bst-cantrip-num">
                    <label title="Изучено / Активно" style="cursor:pointer; display:flex; align-items:center; justify-content:center; gap:3px;">
                        <input type="checkbox" data-sheet-chk="focusSpell${idx}Ready" ${stats[`focusSpell${idx}Ready`] ? 'checked' : ''}>
                        <span>${idx}</span>
                    </label>
                </td>
                <td style="position: relative;">
                    <input type="text"
                           data-sheet-txt="focusSpell${idx}Name"
                           data-focus-row="${idx}"
                           class="k-inp bst-txt-inp bst-focus-picker-inp"
                           autocomplete="off"
                           placeholder="Выберите фокальное заклинание..."
                           value="${esc(stats[`focusSpell${idx}Name`])}">
                    <div class="bst-cantrip-dropdown" data-focus-drop="${idx}" style="display: none;"></div>
                </td>
                <td>${txtInp(`focusSpell${idx}Actions`, '◆ / касание')}</td>
                <td>${txtInp(`focusSpell${idx}Notes`, 'Эффект фокального заклинания...')}</td>
            </tr>
        `).join('');

        if (stats.equipmentText && !stats.item1Name && !stats.item1Notes) {
            stats.item1Name = 'Снаряжение';
            stats.item1Notes = stats.equipmentText.replace(/\n+/g, '; ');
            stats.equipmentText = '';
        }



        const itemsRowsHtml = Array.from({ length: 15 }, (_, i) => i + 1).map(idx => `
            <tr>
                <td class="bst-cantrip-num">${idx}</td>
                <td style="position: relative;">
                    <input type="text"
                           data-sheet-txt="item${idx}Name"
                           data-item-row="${idx}"
                           class="k-inp bst-txt-inp bst-item-picker-inp"
                           autocomplete="off"
                           placeholder="Выберите или введите предмет..."
                           value="${esc(stats[`item${idx}Name`])}">
                    <div class="bst-cantrip-dropdown" data-item-drop="${idx}" style="display: none;"></div>
                </td>
                <td style="text-align: center;">
                    <div class="bst-qty-stepper" style="display: inline-flex !important; flex-direction: row !important; flex-wrap: nowrap !important; align-items: center !important; justify-content: center !important; gap: 4px !important; width: 110px !important; min-width: 110px !important;">
                        <button type="button" class="bst-qty-btn" data-qty-delta="-1" title="Уменьшить на 1" style="width: 26px !important; height: 26px !important; flex-shrink: 0 !important; cursor: pointer !important; padding: 0 !important; line-height: 24px !important; display: inline-block !important; vertical-align: middle !important; background: linear-gradient(to bottom, #42351f 0%, #292011 100%) !important; border: 1px solid #543e0d !important; color: #ebd291 !important; border-radius: 4px !important; font-weight: bold !important; box-shadow: inset 1px 1px 0px rgba(138, 100, 33, 0.4) !important;">−</button>
                        <input type="number"
                               data-sheet-num="item${idx}Qty"
                               class="k-inp bst-tiny-num bst-qty-inp"
                               min="0"
                               value="${stats[`item${idx}Qty`] ?? 1}"
                               style="width: 40px !important; min-width: 40px !important; text-align: center !important; margin: 0 2px !important; padding: 2px !important; flex-shrink: 0 !important; display: inline-block !important; vertical-align: middle !important; -moz-appearance: textfield !important; background: #040905 !important; border: 1px solid #543e0d !important; color: #2ecc71 !important; font-weight: 900 !important;">
                        <button type="button" class="bst-qty-btn" data-qty-delta="1" title="Увеличить на 1" style="width: 26px !important; height: 26px !important; flex-shrink: 0 !important; cursor: pointer !important; padding: 0 !important; line-height: 24px !important; display: inline-block !important; vertical-align: middle !important; background: linear-gradient(to bottom, #42351f 0%, #292011 100%) !important; border: 1px solid #543e0d !important; color: #ebd291 !important; border-radius: 4px !important; font-weight: bold !important; box-shadow: inset 1px 1px 0px rgba(138, 100, 33, 0.4) !important;">+</button>
                    </div>
                </td>
                <td>${txtInp(`item${idx}Notes`, 'Эффект, вес, заметка...')}</td>
            </tr>
        `).join('');







        const page2Html = `
            <div class="bst-sheet-page2-grid">
                <div class="bst-sheet-col">
                    <div class="k-panel">
                        <div class="k-sec-title">✨ Сотворение заклинаний</div>
                        <div class="bst-spell-stats-row">
                            <label>🎯 Проверка атаки: ${numInp('spellAttack', 'bst-mini-num')}</label>
                            <label>🔮 СЛ заклинаний: ${numInp('spellDc', 'bst-mini-num')}</label>
                        </div>

                        <div class="bst-spell-tier">
                            <div class="bst-spell-tier-head">
                                <span>✨ Фокусы</span>
                                <label>📅 Подготовленных в день: ${numInp('cantripsPerDay', 'bst-tiny-num')}</label>
                            </div>
                            <table class="k-table bst-cantrips-table">
                                <thead>
                                    <tr>
                                        <th style="width: 38px; text-align: center;" title="Подготовлено">Подг.</th>
                                        <th style="width: 34%;">Фокус</th>
                                        <th style="width: 22%;">Действ. / Дист.</th>
                                        <th>Эффект / Описание</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${cantripsRowsHtml}
                                </tbody>
                            </table>
                        </div>
                        
                        <div class="bst-spell-tier">
                            <div class="bst-spell-tier-head">
                                <span>💠 Фокальные заклинания</span>
                                <label>🔋 Очки фокусировки: ${numInp('focusCurrent', 'bst-tiny-num')} / ${numInp('focusMax', 'bst-tiny-num')}</label>
                            </div>
                            <table class="k-table bst-cantrips-table">
                                <thead>
                                    <tr>
                                        <th style="width: 38px; text-align: center;" title="Активно">#</th>
                                        <th style="width: 34%;">Фокальное заклинание</th>
                                        <th style="width: 22%;">Действ. / Дист.</th>
                                        <th>Эффект / Описание</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${focusSpellsRowsHtml}
                                </tbody>
                            </table>
                        </div>

                        <div class="bst-spell-tier">
                            <div class="bst-spell-tier-head">
                                <span>1️⃣ Заклинания 1 круга</span>
                                <label>📅 Подготовленных в день: ${numInp('lvl1PerDay', 'bst-tiny-num')}</label>
                            </div>
                            <table class="k-table bst-cantrips-table">
                                <thead>
                                    <tr>
                                        <th style="width: 38px; text-align: center;" title="Подготовлено">Подг.</th>
                                        <th style="width: 34%;">Заклинание</th>
                                        <th style="width: 22%;">Действ. / Дист.</th>
                                        <th>Эффект / Описание</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${lvl1SpellsRowsHtml}
                                </tbody>
                            </table>
                        </div>

                        <div class="bst-spell-tier">
                            <div class="bst-spell-tier-head">
                                <span>2️⃣ Заклинания 2 круга</span>
                                <label>📅 Подготовленных в день: ${numInp('lvl2PerDay', 'bst-tiny-num')}</label>
                            </div>
                            <table class="k-table bst-cantrips-table">
                                <thead>
                                    <tr>
                                        <th style="width: 38px; text-align: center;" title="Подготовлено">Подг.</th>
                                        <th style="width: 34%;">Заклинание</th>
                                        <th style="width: 22%;">Действ. / Дист.</th>
                                        <th>Эффект / Описание</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${lvl2SpellsRowsHtml}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="bst-sheet-col">
                    <div class="k-panel" style="margin-bottom: 10px;">
                        <div class="k-sec-title">🎒 Снаряжение, Зелья и Провизия</div>
                        <div class="bst-coins-row">
                            <label>🥉 ММ: ${numInp('coinsCopper', 'bst-mini-num')}</label>
                            <label>🥈 СМ: ${numInp('coinsSilver', 'bst-mini-num')}</label>
                            <label>🥇 ЗМ: ${numInp('coinsGold', 'bst-mini-num')}</label>
                        </div>
                        <table class="k-table bst-cantrips-table bst-items-table">
                            <thead>
                                <tr>
                                    <th style="width: 28px; text-align: center;">#</th>
                                    <th style="width: 36%;">Предмет / Расходник</th>
                                    <th style="width: 96px; text-align: center;">Кол-во</th>
                                    <th>Эффект / Описание</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsRowsHtml}
                            </tbody>
                        </table>
                    </div>

                    <div class="k-panel" style="margin-bottom: 10px;">
                        <div class="k-sec-title">📖 Журнал приключений</div>
                        ${txtArea('adventureLogText', 4, '📅 Дата — Описание события — Опыт...')}
                    </div>

                    <div class="k-panel" style="margin-bottom: 10px;">
                        <div class="k-sec-title">📝 Заметки персонажа</div>
                        ${txtArea('notesText', 4, '🗒️ Личные заметки, клятвы, связи, особенности...')}
                    </div>

                    <div class="k-panel">
                        <div class="k-sec-title">📚 Книга заклинаний / Репертуар</div>
                        ${txtArea('spellbookText', 4, '📖 Все изученные заклинания...')}
                    </div>
                </div>
            </div>
        `;



        const isPage1 = pageNum === 1;

        const { overlay, close } = ModalManager.open({
            id: 'bstHeroSheetModal',
            title: isPage1
                ? `🛡️ Бланк персонажа: ${hero.name} — Стр. 1 (Бой и Навыки)`
                : `📜 Бланк персонажа: ${hero.name} — Стр. 2 (Снаряжение и Магия)`,
            width: '1420px',
            borderColor: '#dfbc6f',
            bodyHtml: isPage1 ? page1Html : page2Html,
            footerButtons: [
                {
                    label: isPage1 ? '📜 Стр. 2: Снаряжение и Магия ➔' : '⬅ 🛡️ Стр. 1: Бой и Навыки',
                    variant: 'cc',
                    onClick: () => {
                        collectFormData(overlay);
                        this._save();
                        close();
                        this.openCharacterSheetModal(heroId, isPage1 ? 2 : 1);
                    }
                },
                {
                    label: '✖ Отмена',
                    variant: 'cc'
                },
                {
                    label: '⚜ Сохранить бланк',
                    variant: 'ok',
                    onClick: () => {
                        collectFormData(overlay);
                        this._save();
                        close();
                    }
                }
            ]
        });


        if (isPage1) {
            // 1. Поиск и выбор оружия ближнего боя (melee1, melee2)
            overlay.querySelectorAll('.bst-weapon-picker-inp').forEach(inp => {
                const slot = inp.dataset.weaponSlot;
                const dropEl = overlay.querySelector(`[data-weapon-drop="${slot}"]`);
                const atkInp = overlay.querySelector(`[data-sheet-txt="${slot}Atk"]`);
                const dmgInp = overlay.querySelector(`[data-sheet-txt="${slot}Dmg"]`);
                const traitsInp = overlay.querySelector(`[data-sheet-txt="${slot}Traits"]`);

                const renderWeapons = (query) => {
                    const list = searchMeleeWeapons(query);
                    if (!list.length) {
                        dropEl.style.display = 'none';
                        return;
                    }
                    dropEl.innerHTML = list.map(w => {
                        const critText = getWeaponCritEffect(w.group);
                        return `
                            <div class="bst-cantrip-opt" data-wid="${w.id}">
                                <div class="bst-cantrip-opt-top">
                                    <b>${w.name}</b>
                                    <span>${w.dmgDice} ${w.dmgType} (${w.hands}р.)</span>
                                </div>
                                <div class="bst-cantrip-opt-trad">${w.category} • ${w.group}${w.traits ? ' • ' + w.traits : ''}</div>
                                ${critText ? `<div style="font-size: 11px; color: #ebd291; margin-top: 2px;">💥 <b>Крит (${w.group}):</b> ${critText}</div>` : ''}
                            </div>
                        `;
                    }).join('');

                    const rect = inp.getBoundingClientRect();
                    dropEl.style.position = 'fixed';
                    dropEl.style.left = `${rect.left}px`;
                    dropEl.style.top = `${rect.bottom + 2}px`;
                    dropEl.style.width = '360px';
                    dropEl.style.display = 'block';

                    dropEl.querySelectorAll('.bst-cantrip-opt').forEach(optEl => {
                        optEl.addEventListener('mousedown', (e) => {
                            e.preventDefault();
                            const found = PF2E_MELEE_WEAPONS.find(x => x.id === optEl.dataset.wid);
                            if (found) {
                                const liveStats = {
                                    level: parseInt(overlay.querySelector('[data-sheet-num="level"]')?.value, 10) || stats.level || 1,
                                    str: parseInt(overlay.querySelector('[data-sheet-num="str"]')?.value, 10) || 0,
                                    dex: parseInt(overlay.querySelector('[data-sheet-num="dex"]')?.value, 10) || 0
                                };
                                const { atkStr, dmgStr } = calcMeleeWeaponRoll(found, liveStats);
                                const critText = getWeaponCritEffect(found.group);
                                const fullTraits = [
                                    found.traits,
                                    critText ? `Крит: ${critText}` : ''
                                ].filter(Boolean).join(' | ');

                                inp.value = found.name;
                                if (atkInp) atkInp.value = atkStr;
                                if (dmgInp) dmgInp.value = dmgStr;
                                if (traitsInp) traitsInp.value = fullTraits;
                            }
                            dropEl.style.display = 'none';
                        });
                    });
                };

                inp.addEventListener('focus', () => renderWeapons(inp.value));
                inp.addEventListener('input', () => renderWeapons(inp.value));
                inp.addEventListener('blur', () => {
                    setTimeout(() => { dropEl.style.display = 'none'; }, 150);
                });
            });

            // 2. Поиск и выбор дистанционного оружия (ranged)
            const rangedInp = overlay.querySelector('.bst-ranged-picker-inp');
            if (rangedInp) {
                const dropEl = overlay.querySelector('[data-ranged-drop="1"]');
                const atkInp = overlay.querySelector('[data-sheet-txt="rangedAtk"]');
                const dmgInp = overlay.querySelector('[data-sheet-txt="rangedDmg"]');
                const traitsInp = overlay.querySelector('[data-sheet-txt="rangedTraits"]');

                const renderRanged = (query) => {
                    const list = searchRangedWeapons(query);
                    if (!list.length) {
                        dropEl.style.display = 'none';
                        return;
                    }
                    dropEl.innerHTML = list.map(w => {
                        const critText = getWeaponCritEffect(w.group);
                        return `
                            <div class="bst-cantrip-opt" data-rid="${w.id}">
                                <div class="bst-cantrip-opt-top">
                                    <b>${w.name}</b>
                                    <span>${w.dmgDice} ${w.dmgType} • ${w.range}</span>
                                </div>
                                <div class="bst-cantrip-opt-trad">${w.category} • ${w.group}${w.traits ? ' • ' + w.traits : ''}</div>
                                ${critText ? `<div style="font-size: 11px; color: #ebd291; margin-top: 2px;">💥 <b>Крит (${w.group}):</b> ${critText}</div>` : ''}
                            </div>
                        `;
                    }).join('');

                    const rect = rangedInp.getBoundingClientRect();
                    dropEl.style.position = 'fixed';
                    dropEl.style.left = `${rect.left}px`;
                    dropEl.style.top = `${rect.bottom + 2}px`;
                    dropEl.style.width = '360px';
                    dropEl.style.display = 'block';

                    dropEl.querySelectorAll('.bst-cantrip-opt').forEach(optEl => {
                        optEl.addEventListener('mousedown', (e) => {
                            e.preventDefault();
                            const found = PF2E_RANGED_WEAPONS.find(x => x.id === optEl.dataset.rid);
                            if (found) {
                                const liveStats = {
                                    level: parseInt(overlay.querySelector('[data-sheet-num="level"]')?.value, 10) || stats.level || 1,
                                    str: parseInt(overlay.querySelector('[data-sheet-num="str"]')?.value, 10) || 0,
                                    dex: parseInt(overlay.querySelector('[data-sheet-num="dex"]')?.value, 10) || 0
                                };
                                const { atkStr, dmgStr } = calcRangedWeaponRoll(found, liveStats);
                                const critText = getWeaponCritEffect(found.group);
                                const fullTraits = [
                                    found.traits,
                                    critText ? `Крит: ${critText}` : ''
                                ].filter(Boolean).join(' | ');

                                rangedInp.value = found.name;
                                if (atkInp) atkInp.value = atkStr;
                                if (dmgInp) dmgInp.value = dmgStr;
                                if (traitsInp) traitsInp.value = fullTraits;
                            }
                            dropEl.style.display = 'none';
                        });
                    });
                };

                rangedInp.addEventListener('focus', () => renderRanged(rangedInp.value));
                rangedInp.addEventListener('input', () => renderRanged(rangedInp.value));
                rangedInp.addEventListener('blur', () => {
                    setTimeout(() => { dropEl.style.display = 'none'; }, 150);
                });
            }

            // 3. Подробный тултип при наведении на строку оружия (ближний и дальний бой)
            const weaponRows = overlay.querySelectorAll('.bst-weapon-row');
            weaponRows.forEach((row, rIdx) => {
                const slot = rIdx === 0 ? 'melee1' : (rIdx === 1 ? 'melee2' : 'ranged');

                const showWeaponTip = (e) => {
                    // Не показываем тултип, если сейчас открыт выпадающий список выбора оружия
                    const anyDropOpen = Array.from(overlay.querySelectorAll('.bst-cantrip-dropdown'))
                        .some(d => d.style.display === 'block');
                    if (anyDropOpen) {
                        this._hideSheetItemTooltip();
                        return;
                    }

                    const name = overlay.querySelector(`[data-sheet-txt="${slot}Name"]`)?.value.trim();
                    if (!name) return;

                    const atk = overlay.querySelector(`[data-sheet-txt="${slot}Atk"]`)?.value.trim() || '—';
                    const dmg = overlay.querySelector(`[data-sheet-txt="${slot}Dmg"]`)?.value.trim() || '—';
                    const traits = overlay.querySelector(`[data-sheet-txt="${slot}Traits"]`)?.value.trim() || '';

                    const allWeapons = [
                        ...(Array.isArray(PF2E_MELEE_WEAPONS) ? PF2E_MELEE_WEAPONS : []),
                        ...(Array.isArray(PF2E_RANGED_WEAPONS) ? PF2E_RANGED_WEAPONS : [])
                    ];
                    const catalogItem = allWeapons.find(w => w.name.toLowerCase() === name.toLowerCase());
                    const critText = catalogItem ? getWeaponCritEffect(catalogItem.group) : '';

                    const html = `
                        <div class="init-tip-header">
                            <span class="init-tip-name">${slot === 'ranged' ? '🏹' : '⚔️'} ${name}</span>
                            ${catalogItem ? `<span class="init-tip-turn-tag">${catalogItem.category}</span>` : ''}
                        </div>
                        <div class="init-tip-top-row">
                            <span>🎯 Атака: <b>${atk}</b></span>
                            <span>💥 Урон: <b>${dmg}</b></span>
                        </div>
                        ${catalogItem ? `
                            <div style="font-size: 13px; color: #dfbc6f; margin-top: 6px;">
                                Группа: <b>${catalogItem.group}</b> • Рук: <b>${catalogItem.hands}</b>
                                ${catalogItem.range ? ` • Дистанция: <b>${catalogItem.range}</b>` : ''}
                                ${catalogItem.reload ? ` • Перезарядка: <b>${catalogItem.reload}</b>` : ''}
                            </div>
                        ` : ''}
                        ${traits ? `
                            <div class="init-tip-section">
                                <div class="init-tip-sec-title">🏷️ Дескрипторы и свойства</div>
                                <div style="font-size: 13px; line-height: 1.4; color: #ebd291;">${traits}</div>
                            </div>
                        ` : ''}
                        ${critText && !traits.includes('Крит:') ? `
                            <div class="init-tip-section">
                                <div class="init-tip-sec-title">💥 Критическая специализация (${catalogItem.group})</div>
                                <div style="font-size: 13px; line-height: 1.4; color: #ff7675;">${critText}</div>
                            </div>
                        ` : ''}
                    `;
                    this._showSheetItemTooltip(e, html);
                };

                row.addEventListener('mouseenter', showWeaponTip);
                row.addEventListener('mousemove', (e) => {
                    const tip = document.getElementById('bstSheetItemTooltip');
                    if (tip && tip.style.display === 'block') {
                        this._positionSheetItemTooltip(e, tip);
                    } else {
                        showWeaponTip(e);
                    }
                });
                row.addEventListener('mouseleave', () => this._hideSheetItemTooltip());
            });



        } else {
            // Тултип при наведении на строку предмета в рюкзаке
            overlay.querySelectorAll('.bst-items-table tbody tr').forEach(tr => {
                tr.addEventListener('mouseenter', (e) => {
                    const anyDropOpen = Array.from(overlay.querySelectorAll('.bst-cantrip-dropdown'))
                        .some(d => d.style.display === 'block');
                    if (anyDropOpen) return;

                    const nameInp = tr.querySelector('input[data-sheet-txt$="Name"]');
                    const name = nameInp?.value.trim();
                    if (!name) return;

                    const qtyInp = tr.querySelector('input[data-sheet-num$="Qty"]');
                    const noteInp = tr.querySelector('input[data-sheet-txt$="Notes"]');
                    const qty = qtyInp?.value ?? 1;
                    const notes = noteInp?.value.trim() || 'Описание не указано.';

                    const catalogItem = PF2E_ITEMS_CATALOG.find(it => it.name.toLowerCase() === name.toLowerCase());

                    const html = `
                        <div class="init-tip-header">
                            <span class="init-tip-name">🎒 ${name}</span>
                            <span class="init-tip-turn-tag">× ${qty} шт.</span>
                        </div>
                        ${catalogItem?.category ? `
                            <div style="font-size: 13px; color: #2ecc71; margin-top: 4px;">
                                🏷️ Категория: <b>${catalogItem.category}</b>
                            </div>
                        ` : ''}
                        <div class="init-tip-section">
                            <div class="init-tip-sec-title">📜 Описание и применение</div>
                            <div style="font-size: 13.5px; line-height: 1.45; color: #ebd291;">${notes}</div>
                        </div>
                    `;
                    this._showSheetItemTooltip(e, html);
                });

                tr.addEventListener('mousemove', (e) => {
                    const tip = document.getElementById('bstSheetItemTooltip');
                    if (tip && tip.style.display === 'block') {
                        this._positionSheetItemTooltip(e, tip);
                    }
                });

                tr.addEventListener('mouseleave', () => this._hideSheetItemTooltip());
            });

            // Подробный тултип при наведении на строку фокуса или заклинания 1 круга
                overlay.querySelectorAll('.bst-cantrips-table:not(.bst-items-table) tbody tr').forEach(tr => {
                    tr.addEventListener('mouseenter', (e) => {
                    const nameInp = tr.querySelector('input[data-sheet-txt$="Name"]');
                    const name = nameInp?.value.trim();
                    if (!name) return;

                    const actInp = tr.querySelector('input[data-sheet-txt$="Actions"]');
                    const noteInp = tr.querySelector('input[data-sheet-txt$="Notes"]');
                    const actions = actInp?.value.trim() || '—';
                    const notes = noteInp?.value.trim() || 'Описание не заполнено.';

                    // Ищем в справочниках для отображения традиций и круга
                    const fieldName = nameInp.dataset.sheetTxt;
                    const isCantrip = fieldName.startsWith('cantrip');
                    const isFocus = fieldName.startsWith('focusSpell');
                    const rankLabel = isFocus ? 'Фокальное' : (isCantrip ? 'Фокус' : (fieldName.startsWith('lvl2') ? '2 круг' : '1 круг'));

                    const catalogSpell = [...PF2E_CANTRIPS, ...PF2E_FOCUS_SPELLS, ...PF2E_SPELLS_LVL1, ...PF2E_SPELLS_LVL2]
                        .find(s => s.name.toLowerCase() === name.toLowerCase());


                    const spellAtk = overlay.querySelector('[data-sheet-num="spellAttack"]')?.value ?? stats.spellAttack ?? 0;
                    const spellDc = overlay.querySelector('[data-sheet-num="spellDc"]')?.value ?? stats.spellDc ?? 10;
                    const fmtMod = (v) => (Number(v) >= 0 ? `+${Number(v)}` : `${Number(v)}`);


                    const html = `
                        <div class="init-tip-header">
                            <span class="init-tip-name">${isFocus ? '💠' : (isCantrip ? '✨' : '🔮')} ${name}</span>
                            <span class="init-tip-turn-tag">${rankLabel}</span>
                        </div>
                        <div class="init-tip-top-row">
                            <span>⚡ <b>${actions}</b></span>
                            <span>🎯 Атака: <b>${fmtMod(spellAtk)}</b></span>
                            <span>🛡️ СЛ: <b>${spellDc}</b></span>
                        </div>
                        ${catalogSpell?.traditions?.length ? `
                            <div style="font-size: 13px; color: #2ecc71; margin-top: 6px;">
                                📚 Традиции: <b>${catalogSpell.traditions.join(', ')}</b>
                            </div>
                        ` : ''}
                        ${catalogSpell?.source ? `
                            <div style="font-size: 13px; color: #3498db; margin-top: 6px;">
                                💠 Источник: <b>${catalogSpell.source}</b>
                            </div>
                        ` : ''}
                        <div class="init-tip-section">
                            <div class="init-tip-sec-title">📜 Эффект и описание</div>
                            <div style="font-size: 13.5px; line-height: 1.45; color: #ebd291;">${notes}</div>
                        </div>
                    `;


                    this._showSheetItemTooltip(e, html);
                });

                tr.addEventListener('mousemove', (e) => {
                    const tip = document.getElementById('bstSheetItemTooltip');
                    if (tip && tip.style.display === 'block') {
                        this._positionSheetItemTooltip(e, tip);
                    }
                });

                tr.addEventListener('mouseleave', () => this._hideSheetItemTooltip());
            });

            // 1. Выбор фокусов
            overlay.querySelectorAll('.bst-cantrip-picker-inp').forEach(inp => {
                const rowIdx = inp.dataset.cantripRow;
                const dropEl = overlay.querySelector(`[data-cantrip-drop="${rowIdx}"]`);
                const actInp = overlay.querySelector(`[data-sheet-txt="cantrip${rowIdx}Actions"]`);
                const noteInp = overlay.querySelector(`[data-sheet-txt="cantrip${rowIdx}Notes"]`);

                const renderOptions = (query) => {
                    const list = searchCantrips(query);
                    if (!list.length) {
                        dropEl.style.display = 'none';
                        return;
                    }
                    dropEl.innerHTML = list.map(c => `
                        <div class="bst-cantrip-opt" data-cid="${c.id}">
                            <div class="bst-cantrip-opt-top">
                                <b>${c.name}</b>
                                <span>${c.actions}</span>
                            </div>
                            <div class="bst-cantrip-opt-trad">${c.traditions.join(', ')}</div>
                        </div>
                    `).join('');

                    const rect = inp.getBoundingClientRect();
                    dropEl.style.position = 'fixed';
                    dropEl.style.left = `${rect.left}px`;
                    dropEl.style.top = `${rect.bottom + 2}px`;
                    dropEl.style.display = 'block';

                    dropEl.querySelectorAll('.bst-cantrip-opt').forEach(optEl => {
                        optEl.addEventListener('mousedown', (e) => {
                            e.preventDefault();
                            const found = PF2E_CANTRIPS.find(x => x.id === optEl.dataset.cid);
                            if (found) {
                                inp.value = found.name;
                                if (actInp) actInp.value = found.actions;
                                if (noteInp) noteInp.value = found.notes;
                            }
                            dropEl.style.display = 'none';
                        });
                    });
                };

                inp.addEventListener('focus', () => renderOptions(inp.value));
                inp.addEventListener('input', () => renderOptions(inp.value));
                inp.addEventListener('blur', () => {
                    setTimeout(() => { dropEl.style.display = 'none'; }, 150);
                });
            });

            // 4. Выбор фокальных заклинаний
            overlay.querySelectorAll('.bst-focus-picker-inp').forEach(inp => {
                const rowIdx = inp.dataset.focusRow;
                const dropEl = overlay.querySelector(`[data-focus-drop="${rowIdx}"]`);
                const actInp = overlay.querySelector(`[data-sheet-txt="focusSpell${rowIdx}Actions"]`);
                const noteInp = overlay.querySelector(`[data-sheet-txt="focusSpell${rowIdx}Notes"]`);

                const renderFocusOptions = (query) => {
                    const list = searchFocusSpells(query);
                    if (!list.length) {
                        dropEl.style.display = 'none';
                        return;
                    }
                    dropEl.innerHTML = list.map(f => `
                        <div class="bst-cantrip-opt" data-fid="${f.id}">
                            <div class="bst-cantrip-opt-top">
                                <b>${f.name}</b>
                                <span>${f.actions}</span>
                            </div>
                            <div class="bst-cantrip-opt-trad">${f.source}</div>
                        </div>
                    `).join('');

                    const rect = inp.getBoundingClientRect();
                    dropEl.style.position = 'fixed';
                    dropEl.style.left = `${rect.left}px`;
                    dropEl.style.width = '340px';
                    dropEl.style.display = 'block';

                    const dropHeight = dropEl.offsetHeight || 220;
                    if (rect.bottom + dropHeight + 10 > window.innerHeight) {
                        dropEl.style.top = `${Math.max(8, rect.top - dropHeight - 2)}px`;
                    } else {
                        dropEl.style.top = `${rect.bottom + 2}px`;
                    }

                    dropEl.querySelectorAll('.bst-cantrip-opt').forEach(optEl => {
                        optEl.addEventListener('mousedown', (e) => {
                            e.preventDefault();
                            const found = PF2E_FOCUS_SPELLS.find(x => x.id === optEl.dataset.fid);
                            if (found) {
                                inp.value = found.name;
                                if (actInp) actInp.value = found.actions;
                                if (noteInp) noteInp.value = found.notes;
                            }
                            dropEl.style.display = 'none';
                        });
                    });
                };

                inp.addEventListener('focus', () => renderFocusOptions(inp.value));
                inp.addEventListener('input', () => renderFocusOptions(inp.value));
                inp.addEventListener('blur', () => {
                    setTimeout(() => { dropEl.style.display = 'none'; }, 150);
                });
            });


            // 2. Выбор заклинаний 1 круга
            overlay.querySelectorAll('.bst-lvl1-picker-inp').forEach(inp => {
                const rowIdx = inp.dataset.lvl1Row;
                const dropEl = overlay.querySelector(`[data-lvl1-drop="${rowIdx}"]`);
                const actInp = overlay.querySelector(`[data-sheet-txt="lvl1Spell${rowIdx}Actions"]`);
                const noteInp = overlay.querySelector(`[data-sheet-txt="lvl1Spell${rowIdx}Notes"]`);

                const renderLvl1Options = (query) => {
                    const list = searchSpellsLvl1(query);
                    if (!list.length) {
                        dropEl.style.display = 'none';
                        return;
                    }
                    dropEl.innerHTML = list.map(s => `
                        <div class="bst-cantrip-opt" data-sid="${s.id}">
                            <div class="bst-cantrip-opt-top">
                                <b>${s.name}</b>
                                <span>${s.actions}</span>
                            </div>
                            <div class="bst-cantrip-opt-trad">${s.traditions.join(', ')}</div>
                        </div>
                    `).join('');

                    const rect = inp.getBoundingClientRect();
                    dropEl.style.position = 'fixed';
                    dropEl.style.left = `${rect.left}px`;
                    dropEl.style.width = '340px';
                    dropEl.style.display = 'block';

                    const dropHeight = dropEl.offsetHeight || 220;
                    if (rect.bottom + dropHeight + 10 > window.innerHeight) {
                        dropEl.style.top = `${Math.max(8, rect.top - dropHeight - 2)}px`;
                    } else {
                        dropEl.style.top = `${rect.bottom + 2}px`;
                    }

                    dropEl.querySelectorAll('.bst-cantrip-opt').forEach(optEl => {
                        optEl.addEventListener('mousedown', (e) => {
                            e.preventDefault();
                            const found = PF2E_SPELLS_LVL1.find(x => x.id === optEl.dataset.sid);
                            if (found) {
                                inp.value = found.name;
                                if (actInp) actInp.value = found.actions;
                                if (noteInp) noteInp.value = found.notes;
                            }
                            dropEl.style.display = 'none';
                        });
                    });
                };

                inp.addEventListener('focus', () => renderLvl1Options(inp.value));
                inp.addEventListener('input', () => renderLvl1Options(inp.value));
                inp.addEventListener('blur', () => {
                    setTimeout(() => { dropEl.style.display = 'none'; }, 150);
                });
            });

            // 3. Выбор заклинаний 2 круга
            overlay.querySelectorAll('.bst-lvl2-picker-inp').forEach(inp => {
                const rowIdx = inp.dataset.lvl2Row;
                const dropEl = overlay.querySelector(`[data-lvl2-drop="${rowIdx}"]`);
                const actInp = overlay.querySelector(`[data-sheet-txt="lvl2Spell${rowIdx}Actions"]`);
                const noteInp = overlay.querySelector(`[data-sheet-txt="lvl2Spell${rowIdx}Notes"]`);

                const renderLvl2Options = (query) => {
                    const list = searchSpellsLvl2(query);
                    if (!list.length) {
                        dropEl.style.display = 'none';
                        return;
                    }
                    dropEl.innerHTML = list.map(s => `
                        <div class="bst-cantrip-opt" data-s2id="${s.id}">
                            <div class="bst-cantrip-opt-top">
                                <b>${s.name}</b>
                                <span>${s.actions}</span>
                            </div>
                            <div class="bst-cantrip-opt-trad">${s.traditions.join(', ')}</div>
                        </div>
                    `).join('');

                    const rect = inp.getBoundingClientRect();
                    dropEl.style.position = 'fixed';
                    dropEl.style.left = `${rect.left}px`;
                    dropEl.style.width = '340px';
                    dropEl.style.display = 'block';

                    const dropHeight = dropEl.offsetHeight || 220;
                    if (rect.bottom + dropHeight + 10 > window.innerHeight) {
                        dropEl.style.top = `${Math.max(8, rect.top - dropHeight - 2)}px`;
                    } else {
                        dropEl.style.top = `${rect.bottom + 2}px`;
                    }

                    dropEl.querySelectorAll('.bst-cantrip-opt').forEach(optEl => {
                        optEl.addEventListener('mousedown', (e) => {
                            e.preventDefault();
                            const found = PF2E_SPELLS_LVL2.find(x => x.id === optEl.dataset.s2id);
                            if (found) {
                                inp.value = found.name;
                                if (actInp) actInp.value = found.actions;
                                if (noteInp) noteInp.value = found.notes;
                            }
                            dropEl.style.display = 'none';
                        });
                    });
                };

                inp.addEventListener('focus', () => renderLvl2Options(inp.value));
                inp.addEventListener('input', () => renderLvl2Options(inp.value));
                inp.addEventListener('blur', () => {
                    setTimeout(() => { dropEl.style.display = 'none'; }, 150);
                });
            });

            // Выбор предметов, зелий и провизии
            overlay.querySelectorAll('.bst-item-picker-inp').forEach(inp => {
                const rowIdx = inp.dataset.itemRow;
                const dropEl = overlay.querySelector(`[data-item-drop="${rowIdx}"]`);
                const qtyInp = overlay.querySelector(`[data-sheet-num="item${rowIdx}Qty"]`);
                const noteInp = overlay.querySelector(`[data-sheet-txt="item${rowIdx}Notes"]`);

                const renderItemOptions = (query) => {
                    const list = searchItemsCatalog(query);
                    if (!list.length) {
                        dropEl.style.display = 'none';
                        return;
                    }
                    dropEl.innerHTML = list.map(it => `
                        <div class="bst-cantrip-opt" data-itemid="${it.id}">
                            <div class="bst-cantrip-opt-top">
                                <b>${it.name}</b>
                                <span>${it.category}</span>
                            </div>
                            <div class="bst-cantrip-opt-trad">${it.notes}</div>
                        </div>
                    `).join('');

                    const rect = inp.getBoundingClientRect();
                    dropEl.style.position = 'fixed';
                    dropEl.style.left = `${rect.left}px`;
                    dropEl.style.top = `${rect.bottom + 2}px`;
                    dropEl.style.width = '360px';
                    dropEl.style.display = 'block';

                    dropEl.querySelectorAll('.bst-cantrip-opt').forEach(optEl => {
                        optEl.addEventListener('mousedown', (e) => {
                            e.preventDefault();
                            const found = PF2E_ITEMS_CATALOG.find(x => x.id === optEl.dataset.itemid);
                            if (found) {
                                inp.value = found.name;
                                if (qtyInp && (!qtyInp.value || Number(qtyInp.value) <= 0)) qtyInp.value = 1;
                                if (noteInp) noteInp.value = found.notes;
                            }
                            dropEl.style.display = 'none';
                        });
                    });
                };

                inp.addEventListener('focus', () => renderItemOptions(inp.value));
                inp.addEventListener('input', () => renderItemOptions(inp.value));
                inp.addEventListener('blur', () => {
                    setTimeout(() => { dropEl.style.display = 'none'; }, 150);
                });
            });

            // Кнопки - / + и колесо мыши для количества предметов/расходников
            overlay.querySelectorAll('.bst-qty-stepper').forEach(stepper => {
                const qtyInp = stepper.querySelector('.bst-qty-inp');
                if (!qtyInp) return;

                const changeQty = (delta) => {
                    const cur = parseInt(qtyInp.value, 10) || 0;
                    qtyInp.value = Math.max(0, cur + delta);
                };

                stepper.querySelectorAll('.bst-qty-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        changeQty(parseInt(btn.dataset.qtyDelta, 10) || 0);
                    });
                });

                qtyInp.addEventListener('wheel', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    changeQty(e.deltaY < 0 ? 1 : -1);
                }, { passive: false });
            });



        }


        // Умный калькулятор брони и ограничений по правилам Pathfinder 2e
        const calculateArmorClass = () => {
            const armorType = overlay.querySelector('[data-sheet-txt="armorType"]')?.value || 'unarmored';
            const dexInp = overlay.querySelector('[data-sheet-num="acDex"]');
            const profInp = overlay.querySelector('[data-sheet-num="acProf"]');
            const itemInp = overlay.querySelector('[data-sheet-num="acItem"]');
            const otherInp = overlay.querySelector('[data-sheet-num="acOther"]');
            const penaltyInp = overlay.querySelector('[data-sheet-num="acArmorPenalty"]');
            const speedInp = overlay.querySelector('[data-sheet-num="speed"]');
            const totalAcInp = overlay.querySelector('[data-sheet-num="ac"]');

            if (!totalAcInp) return;

            let rawDex = parseInt(dexInp?.value, 10) || 0;
            const prof = parseInt(profInp?.value, 10) || 0;
            const item = parseInt(itemInp?.value, 10) || 0;
            const other = parseInt(otherInp?.value, 10) || 0;

            // Проверяем Силу для штрафов (берём значение из вкладки характеристик)
            const charStr = parseInt(overlay.querySelector('[data-sheet-num="str"]')?.value, 10) || 0;
            const armorStrReq = parseInt(totalAcInp.dataset.currentStrReq, 10) || 0;

            let dexCap = 5;
            if (armorType === 'light') dexCap = 3;
            else if (armorType === 'medium') dexCap = 2;
            else if (armorType === 'heavy') dexCap = 1;

            if (rawDex > dexCap) rawDex = dexCap;

            // Если силы недостаточно — штраф доспеха применяется в полную силу
            if (charStr < armorStrReq && penaltyInp) {
                penaltyInp.title = `Сила меньше требуемой (${armorStrReq})! Применяется штраф к навыкам и скорости.`;
            }

            const totalAc = 10 + rawDex + prof + item + other;
            totalAcInp.value = totalAc;
            hero.stats.ac = totalAc;
        };

        // Инициализация автокомплита для выбора брони
        overlay.querySelectorAll('.bst-armor-picker-inp').forEach(inp => {
            const dropEl = overlay.querySelector('[data-armor-drop="1"]');
            const typeSel = overlay.querySelector('[data-sheet-txt="armorType"]');
            const itemInp = overlay.querySelector('[data-sheet-num="acItem"]');
            const penaltyInp = overlay.querySelector('[data-sheet-num="acArmorPenalty"]');
            const totalAcInp = overlay.querySelector('[data-sheet-num="ac"]');

            const renderArmorMatches = (query) => {
                const list = searchArmorCatalog(query);
                if (!list.length) { dropEl.style.display = 'none'; return; }

                dropEl.innerHTML = list.map(a => `
                        <div class="bst-cantrip-opt" data-aid="${a.id}" style="padding: 6px; cursor: pointer;">
                            <div class="bst-cantrip-opt-top"><b>${a.name}</b> <span>КБ: +${a.acBonus}</span></div>
                            <div class="bst-cantrip-opt-trad" style="font-size:11px;">Группа: ${a.group} • Тр. Сила: ${a.strReq} • Макс.Лвк: +${a.dexCap}</div>
                        </div>
                    `).join('');

                const rect = inp.getBoundingClientRect();
                dropEl.style.position = 'fixed';
                dropEl.style.left = `${rect.left}px`;
                dropEl.style.top = `${rect.bottom + 2}px`;
                dropEl.style.width = '260px';
                dropEl.style.display = 'block';

                dropEl.querySelectorAll('.bst-cantrip-opt').forEach(optEl => {
                    optEl.addEventListener('mousedown', (e) => {
                        e.preventDefault();
                        const found = PF2E_ARMOR_CATALOG.find(x => x.id === optEl.dataset.aid);
                        if (found) {
                            inp.value = found.name;
                            if (typeSel) typeSel.value = found.category;
                            if (itemInp) itemInp.value = found.acBonus;
                            if (penaltyInp) penaltyInp.value = found.penalty;
                            if (totalAcInp) totalAcInp.dataset.currentStrReq = found.strReq;
                            calculateArmorClass();
                        }
                        dropEl.style.display = 'none';
                    });
                });
            };

            inp.addEventListener('focus', () => renderArmorMatches(inp.value));
            inp.addEventListener('input', () => renderArmorMatches(inp.value));
            inp.addEventListener('blur', () => setTimeout(() => { dropEl.style.display = 'none'; }, 150));
        });

        overlay.querySelectorAll('.bst-armor-calc-trigger').forEach(el => {
            el.addEventListener('input', calculateArmorClass);
            el.addEventListener('change', calculateArmorClass);
        });

        calculateArmorClass();



    },

    deployToInitiative(item, customScore = null) {
        if (!window.InitiativeManager) return;
        const score = customScore !== null ? customScore : (item.defaultScore || 10);
        window.InitiativeManager._pendingAvatarType = item.avatarType || null;
        window.InitiativeManager._pendingStats = item.stats ? { ...item.stats } : createDefaultStats();
        window.InitiativeManager.addCombatant(item.name, score, item.faction, false, false);
    },

    deployWholeParty() {
        if (!window.InitiativeManager || this.state.party.length === 0) return;
        this.state.party.forEach(hero => {
            this.deployToInitiative(hero);
        });
    },



    renderUi() {
        this._hidePresetTooltip();
        const container = document.getElementById('bestiaryTabletContainer');
        if (!container) return;

        if (!container.querySelector('.bestiary-tablet-root')) {
            container.innerHTML = `
                <div class="bestiary-tablet-root">
                    <div class="init-quick-input-bar" style="margin-bottom: 14px;">
                        <div class="init-name-autocomplete-wrap" style="position: relative; flex-grow: 1; display: flex;">
                            <input type="text" id="bstInputName" autocomplete="off" placeholder="Поиск героя, NPC или монстра для заготовки..." style="width: 100%;">
                            <div id="bstNameSuggestions" class="init-name-suggestions" style="display: none;"></div>
                        </div>
                        <div class="camp-count-controls" style="padding: 2px 8px;">
                            <span class="camp-param-label" style="font-size: 16px; margin-right: 4px;">Баз. иниц:</span>
                            <button type="button" onclick="const inp = document.getElementById('bstInputScore'); inp.value = Math.max(1, (parseInt(inp.value, 10) || 10) - 1)">-</button>
                            <input type="text" id="bstInputScore" value="10" style="width: 50px; text-align: center; background: #000; border: 1px solid #543e0d; color: #fff; font-weight: bold;">
                            <button type="button" onclick="const inp = document.getElementById('bstInputScore'); inp.value = Math.min(100, (parseInt(inp.value, 10) || 10) + 1)">+</button>
                        </div>
                        <select id="bstInputFaction" style="width: 175px; background: #090f0b; border: 1px solid #543e0d; color: #ebd291; padding: 6px;">
                            <option value="friend">🟢 Текущий отряд</option>
                            <option value="enemy" selected>🔴 Монстр / Враг</option>
                            <option value="neutral">🟡 Нейтрал / NPC</option>
                        </select>
                        <button type="button" class="btn ok" id="bstBtnAdd" style="padding: 6px 20px; font-size: 14px; height: 38px;">⚜ В заготовки</button>
                    </div>

                    <div class="bst-workspace-layout">
                        <aside class="bst-catalog-sidebar">
                            <div class="bst-catalog-sidebar-header">
                                <span>📖 Справочник существ</span>
                                <span id="bstCatalogTotalCount" class="bst-catalog-badge">0</span>
                            </div>
                            <input type="text" id="bstSidebarFilter" class="bst-sidebar-filter-inp" autocomplete="off" placeholder="Фильтр по каталогу...">
                            <div id="bstFullCatalogList" class="bst-full-catalog-list"></div>
                        </aside>

                        <div class="bst-zones-main">
                            <div id="bstZoneParty" class="init-out-combatants-zone bestiary-zone-party"></div>
                            <div id="bstZoneMonsters" class="init-out-combatants-zone bestiary-zone-monsters" style="margin-top: 16px;"></div>
                            <div id="bstZoneInactive" class="init-out-combatants-zone bestiary-zone-inactive" style="margin-top: 16px;"></div>
                        </div>
                        
                    </div>
                </div>
            `;
            this._isBound = false;
        }

        if (!this._isBound) {
            const nameInp = document.getElementById('bstInputName');
            const scoreInp = document.getElementById('bstInputScore');
            const factionSel = document.getElementById('bstInputFaction');
            const suggestBox = document.getElementById('bstNameSuggestions');
            const sidebarFilter = document.getElementById('bstSidebarFilter');
            let activeIdx = -1;

            const hideSuggest = () => {
                suggestBox.style.display = 'none';
                suggestBox.innerHTML = '';
                activeIdx = -1;
            };

            const applySuggest = (item) => {
                nameInp.value = item.displayName + ' ';
                this._pendingAvatarType = item.id;
                if (item.defaultFaction) factionSel.value = item.defaultFaction;
                hideSuggest();
                nameInp.focus();
            };

            nameInp.addEventListener('input', () => {
                const val = nameInp.value;
                if (!val.trim()) { this._pendingAvatarType = null; hideSuggest(); return; }
                if (this._pendingAvatarType && val.endsWith(' ')) { hideSuggest(); return; }

                const matches = AvatarRegistry.searchCatalog(val);
                if (!matches.length) { hideSuggest(); return; }

                activeIdx = -1;
                suggestBox.innerHTML = matches.map((m, i) => `
                    <div class="init-suggest-item" data-idx="${i}">
                        ${m.avatarUrl ? `<img src="${m.avatarUrl}" class="init-suggest-thumb">` : ''}
                        <span class="init-suggest-label">${m.label}</span>
                    </div>
                `).join('');
                suggestBox.style.display = 'block';

                suggestBox.querySelectorAll('.init-suggest-item').forEach((el, i) => {
                    el.addEventListener('mousedown', (e) => {
                        e.preventDefault();
                        applySuggest(matches[i]);
                    });
                });
            });

            nameInp.addEventListener('keydown', (e) => {
                const items = suggestBox.querySelectorAll('.init-suggest-item');
                if (suggestBox.style.display === 'none' || !items.length) {
                    if (e.key === 'Enter') document.getElementById('bstBtnAdd').click();
                    return;
                }
                if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = (activeIdx + 1) % items.length; }
                else if (e.key === 'ArrowUp') { e.preventDefault(); activeIdx = (activeIdx - 1 + items.length) % items.length; }
                else if (e.key === 'Enter' && activeIdx >= 0) {
                    e.preventDefault();
                    items[activeIdx].dispatchEvent(new MouseEvent('mousedown'));
                    return;
                } else if (e.key === 'Escape') { hideSuggest(); return; }

                items.forEach((el, i) => el.classList.toggle('active', i === activeIdx));
            });

            nameInp.addEventListener('blur', () => setTimeout(hideSuggest, 150));

            document.getElementById('bstBtnAdd').addEventListener('click', () => {
                this.addPreset(nameInp.value, factionSel.value, scoreInp.value);
                nameInp.value = '';
                scoreInp.value = '10';
                hideSuggest();
                nameInp.focus();
            });

            if (sidebarFilter) {
                sidebarFilter.addEventListener('input', () => {
                    this._renderCatalogSidebar(sidebarFilter.value);
                });
            }

            this._isBound = true;
        }

        const filterVal = document.getElementById('bstSidebarFilter')?.value || '';
        this._renderCatalogSidebar(filterVal);
        this._renderZone('bstZoneParty', '🛡️ Текущий отряд (Герои)', 'party', this.state.party, true);
        this._renderZone('bstZoneMonsters', '👹 Заготовленные монстры и NPC', 'monsters', this.state.monsters, false);
        this._renderZone('bstZoneInactive', '💤 Неактивные персонажи (Резерв)', 'inactive', this.state.inactive || [], false);

        this._renderZone(
            'bstZoneInactive',
            '💤 Неактивные персонажи (Резерв)',
            'inactive',
            this.state.inactive || [],
            false
        );


    },

    _renderZone(elId, title, groupKey, items, isParty) {
        const zone = document.getElementById(elId);
        if (!zone) return;



        const isInactive = groupKey === 'inactive';
        const isHeroGroup = isParty || isInactive;
        const headerColor = isParty ? '#2ecc71' : (isInactive ? '#a4b0be' : '#ff7675');
        const emptyHint = isInactive
            ? 'Резерв пуст. Нажмите 💤 на карточке героя в отряде, чтобы убрать его сюда без потери параметров.'
            : 'Список пуст. Добавьте персонажей через строку поиска выше или справочник слева.';

        zone.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <div class="init-out-zone-title" style="margin:0; font-size:16px; color:${headerColor};">
                    ${title} (${items.length})
                </div>
                ${isParty && items.length > 0 ? `<button type="button" class="btn ok" id="bstBtnDeployAllParty" style="padding:4px 12px; font-size:13px;">⚔️ Весь отряд в бой</button>` : ''}
            </div>
            <div class="init-cards-scroll-list mode-bg3 init-out-zone-grid">
                ${items.length === 0 ? `<div style="color:#7f8c8d; font-size:15px; padding:12px;">${emptyHint}</div>` : ''}
            </div>
        `;

        const deployAllBtn = zone.querySelector('#bstBtnDeployAllParty');
        if (deployAllBtn) {
            deployAllBtn.addEventListener('click', () => this.deployWholeParty());
        }

        const grid = zone.querySelector('.init-out-zone-grid');
        items.forEach((item, idx) => {
            const card = document.createElement('div');
            card.className = `init-combatant-card faction-${item.faction} ${isInactive ? 'bst-card-inactive' : ''}`;

            const reserveActionBtn = isParty
                ? `<button type="button" class="bst-reserve-move-btn to-reserve" title="Отправить в неактивные (сохранить статы)">💤</button>`
                : (isInactive
                    ? `<button type="button" class="bst-reserve-move-btn to-party" title="Вернуть в текущий отряд">🛡️</button>`
                    : '');

            card.innerHTML = `
                ${reserveActionBtn}
                <button type="button" class="init-btn-delete-card" title="Удалить навсегда">×</button>
                <div class="init-card-left">
                    <div class="init-card-name-text" title="${item.name}">${item.name}</div>
                    <div class="init-avatar-shield-circle active">${item.avatar ? `<img src="${item.avatar}">` : (idx + 1)}</div>
                </div>
                <div class="init-card-right">
                    <button type="button" class="bst-quick-send-btn" title="Добавить сразу в трекер инициативы">⚔️</button>
                    <div class="init-score-massive-block">
                        <input type="number" class="init-inline-score-input" value="${item.defaultScore}" title="Базовая инициатива">
                    </div>
                </div>
            `;

            const moveBtn = card.querySelector('.bst-reserve-move-btn');
            if (moveBtn) {
                moveBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (isParty) {
                        this.moveHeroReserve('party', 'inactive', item.id);
                    } else if (isInactive) {
                        this.moveHeroReserve('inactive', 'party', item.id);
                    }
                });
            }

            card.querySelector('.bst-quick-send-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.deployToInitiative(item);
            });

            card.querySelector('.init-inline-score-input').addEventListener('change', (e) => {
                this.updatePresetScore(groupKey, item.id, e.target.value);
            });

            card.querySelector('.init-btn-delete-card').addEventListener('click', (e) => {
                e.stopPropagation();
                if (isHeroGroup) {
                    this.confirmRemoveHero(groupKey, item.id);
                } else {
                    this.removePreset(groupKey, item.id);
                }
            });

            const nameEl = card.querySelector('.init-card-name-text');
            if (nameEl) {
                nameEl.title = isHeroGroup
                    ? 'Клик — переименовать | Двойной клик — лист персонажа (статы и навыки)'
                    : 'Нажмите, чтобы переименовать';

                let clickTimer = null;

                nameEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (nameEl.querySelector('input')) return;

                    clearTimeout(clickTimer);
                    clickTimer = setTimeout(() => {
                        const currentName = item.name;
                        const input = document.createElement('input');
                        input.type = 'text';
                        input.className = 'init-inline-name-input';
                        input.value = currentName;

                        let isFinished = false;
                        const finishEdit = (save) => {
                            if (isFinished) return;
                            isFinished = true;
                            const val = input.value.trim();
                            if (save && val && val !== currentName) {
                                this.updatePresetName(groupKey, item.id, val);
                            } else {
                                nameEl.textContent = currentName;
                            }
                        };

                        input.addEventListener('click', (ev) => ev.stopPropagation());
                        input.addEventListener('keydown', (ev) => {
                            ev.stopPropagation();
                            if (ev.key === 'Enter') {
                                ev.preventDefault();
                                finishEdit(true);
                            } else if (ev.key === 'Escape') {
                                ev.preventDefault();
                                finishEdit(false);
                            }
                        });
                        input.addEventListener('blur', () => finishEdit(true));

                        nameEl.textContent = '';
                        nameEl.appendChild(input);
                        input.focus();
                        input.select();
                    }, 220);
                });

                if (isHeroGroup) {
                    const canShowTooltip = isHeroGroup || !!window.SHOW_ENEMY_TOOLTIPS;
                    if (nameEl) {
                        nameEl.title = 'Клик — переименовать | Двойной клик — бланк существа (статы и навыки)';
                        // ... существующий обработчик click ...
                        nameEl.addEventListener('dblclick', (e) => {
                            e.stopPropagation();
                            clearTimeout(clickTimer);
                            this.openCharacterSheetModal(item.id);
                        });
                    }

                    if (canShowTooltip) {
                        this._attachPresetTooltip(card, item, isInactive);
                    }
                }
            }

            grid.appendChild(card);
        });
    },

    _hidePresetTooltip() {
        const tip = document.getElementById('initUnitHoverTooltip');
        if (tip) tip.style.display = 'none';
    },

    _positionPresetTooltip(e, tip) {
        const pad = 16;
        const rect = tip.getBoundingClientRect();
        let left = e.clientX + pad;
        let top = e.clientY + pad;

        if (left + rect.width > window.innerWidth - 12) {
            left = e.clientX - rect.width - pad;
        }
        if (top + rect.height > window.innerHeight - 12) {
            top = e.clientY - rect.height - pad;
        }
        tip.style.left = `${Math.max(8, left)}px`;
        tip.style.top = `${Math.max(8, top)}px`;
    },



    _attachPresetTooltip(card, item, isInactive = false) {
        card.addEventListener('mouseenter', (e) => {
            if (card.querySelector('input.init-inline-name-input')) return;
            if (item.faction !== 'friend' && !window.SHOW_ENEMY_TOOLTIPS) return;

            let tip = document.getElementById('initUnitHoverTooltip');
            if (!tip) {
                tip = document.createElement('div');
                tip.id = 'initUnitHoverTooltip';
                tip.className = 'init-unit-hover-tooltip';
                document.body.appendChild(tip);
            }

            tip.innerHTML = this.buildUnitTooltipHtml(item, {
                isCombat: false,
                isInactive,
                score: item.defaultScore ?? 10
            });
            tip.style.display = 'block';
            this._positionPresetTooltip(e, tip);
        });

        card.addEventListener('mousemove', (e) => {
            const tip = document.getElementById('initUnitHoverTooltip');
            if (tip && tip.style.display === 'block') {
                this._positionPresetTooltip(e, tip);
            }
        });

        card.addEventListener('mouseleave', () => this._hidePresetTooltip());
    },




    _hideSheetItemTooltip() {
        const tip = document.getElementById('bstSheetItemTooltip');
        if (tip) tip.style.display = 'none';
    },

    _positionSheetItemTooltip(e, tip) {
        const pad = 14;
        const rect = tip.getBoundingClientRect();
        let left = e.clientX + pad;
        let top = e.clientY + pad;

        if (left + rect.width > window.innerWidth - 12) {
            left = e.clientX - rect.width - pad;
        }
        if (top + rect.height > window.innerHeight - 12) {
            top = e.clientY - rect.height - pad;
        }

        tip.style.left = `${Math.max(8, left)}px`;
        tip.style.top = `${Math.max(8, top)}px`;
    },

    _showSheetItemTooltip(e, html) {
        if (!html) return;
        let tip = document.getElementById('bstSheetItemTooltip');
        if (!tip) {
            tip = document.createElement('div');
            tip.id = 'bstSheetItemTooltip';
            tip.className = 'init-unit-hover-tooltip';
            tip.style.maxWidth = '380px';
            tip.style.zIndex = '10000090';
            document.body.appendChild(tip);
        }
        tip.innerHTML = html;
        tip.style.display = 'block';
        this._positionSheetItemTooltip(e, tip);
    },


    _hideHeroTooltip() {
        const tip = document.getElementById('bstHeroHoverTooltip');
        if (tip) tip.style.display = 'none';
    },

    _positionHeroTooltip(e, tip) {
        const pad = 16;
        const rect = tip.getBoundingClientRect();
        let left = e.clientX + pad;
        let top = e.clientY + pad;

        if (left + rect.width > window.innerWidth - 12) {
            left = e.clientX - rect.width - pad;
        }
        if (top + rect.height > window.innerHeight - 12) {
            top = e.clientY - rect.height - pad;
        }

        tip.style.left = `${Math.max(8, left)}px`;
        tip.style.top = `${Math.max(8, top)}px`;
    },



    _attachHeroTooltip(card, hero, isInactive) {
        card.addEventListener('mouseenter', (e) => {
            if (card.querySelector('input.init-inline-name-input')) return;

            let tip = document.getElementById('bstHeroHoverTooltip');
            if (!tip) {
                tip = document.createElement('div');
                tip.id = 'bstHeroHoverTooltip';
                tip.className = 'init-unit-hover-tooltip';
                document.body.appendChild(tip);
            }

            const stats = hero.stats || {};
            const fmtMod = (val) => {
                const n = Number(val) || 0;
                return n > 0 ? `+${n}` : `${n}`;
            };

            const metaParts = [
                stats.charClass,
                stats.ancestry,
                stats.level ? `Ур. ${stats.level}` : ''
            ].filter(Boolean);

            const attrs = [
                ['Сила', stats.str], ['Ловкость', stats.dex], ['Выносливость', stats.con],
                ['Интеллект', stats.int], ['Мудрость', stats.wis], ['Харизма', stats.cha]
            ];

            const defenses = [
                ['👁️ Внимание', stats.perception ?? stats.perc],
                ['🛡️ Стойкость', stats.fortitude ?? stats.fort],
                ['⚡ Реакция', stats.reflex ?? stats.ref],
                ['🧠 Воля', stats.will]
            ];

            const skills = [
                ['Акробатика', stats.acrobatics ?? stats.acro],
                ['Аркана', stats.arcana ?? stats.arca],
                ['Атлетика', stats.athletics ?? stats.athl],
                ['Ремесло', stats.crafting],
                ['Обман', stats.deception ?? stats.dece],
                ['Дипломатия', stats.diplomacy ?? stats.dipl],
                ['Запугивание', stats.intimidation ?? stats.inti],
                ['Знания (Lore)', stats.lore],
                ['Медицина', stats.medicine ?? stats.medi],
                ['Природа', stats.nature ?? stats.natu],
                ['Оккультизм', stats.occultism ?? stats.occu],
                ['Выступление', stats.performance],
                ['Религия', stats.religion ?? stats.reli],
                ['Общество', stats.society],
                ['Скрытность', stats.stealth ?? stats.stea],
                ['Выживание', stats.survival ?? stats.surv],
                ['Воровство', stats.thievery]
            ].filter(([, v]) => v !== undefined);

            const statusTag = isInactive
                ? '<span class="init-tip-turn-tag" style="border-color:#95a5a6; color:#b2bec3; background:rgba(149,165,166,0.18);">💤 В РЕЗЕРВЕ</span>'
                : '<span class="init-tip-turn-tag">🛡️ В ОТРЯДЕ</span>';

            tip.innerHTML = `
                <div class="init-tip-header">
                    <span class="init-tip-name">${hero.name}</span>
                    ${statusTag}
                </div>
                <div class="init-tip-top-row">
                    <span>🎲 Иниц.: <b>${hero.defaultScore || 10}</b></span>
                    <span>❤️ ПЗ: <b>${stats.hpCurrent ?? 10}/${stats.hpMax ?? 10}</b></span>
                    <span>🛡️ КБ: <b>${stats.ac ?? 10}</b></span>
                </div>
                ${metaParts.length ? `<div style="font-size:14px; color:#dfbc6f; margin-top:4px;">${metaParts.join(' • ')}</div>` : ''}
                <div class="init-tip-section">
                    <div class="init-tip-sec-title">⚔️ Характеристики</div>
                    <div class="init-tip-2col">
                        ${attrs.map(([lbl, v]) => `<div>${lbl}: <b>${fmtMod(v)}</b></div>`).join('')}
                    </div>
                </div>
                <div class="init-tip-section">
                    <div class="init-tip-sec-title">🛡️ Внимание и Спасброски</div>
                    <div class="init-tip-2col">
                        ${defenses.map(([lbl, v]) => `<div>${lbl}: <b>${fmtMod(v)}</b></div>`).join('')}
                    </div>
                </div>
                <div class="init-tip-section">
                    <div class="init-tip-sec-title">📜 Навыки</div>
                    <div class="init-tip-3col">
                        ${skills.map(([lbl, v]) => `<div>${lbl}: <b>${fmtMod(v)}</b></div>`).join('')}
                    </div>
                </div>
            `;

            tip.style.display = 'block';
            this._positionHeroTooltip(e, tip);
        });

        card.addEventListener('mousemove', (e) => {
            const tip = document.getElementById('bstHeroHoverTooltip');
            if (tip && tip.style.display === 'block') {
                this._positionHeroTooltip(e, tip);
            }
        });

        card.addEventListener('mouseleave', () => this._hideHeroTooltip());
    },




    _renderCatalogSidebar(filterQuery = '') {
        const listEl = document.getElementById('bstFullCatalogList');
        const countEl = document.getElementById('bstCatalogTotalCount');
        if (!listEl) return;

        const allItems = typeof AvatarRegistry.getAllCatalogItems === 'function'
            ? AvatarRegistry.getAllCatalogItems()
            : [];

        const q = String(filterQuery || '').trim().toLowerCase().replace(/ё/g, 'е');
        const filtered = q
            ? allItems.filter(item =>
                String(item.label || item.displayName || '')
                    .toLowerCase()
                    .replace(/ё/g, 'е')
                    .includes(q)
            )
            : allItems;

        if (countEl) countEl.textContent = filtered.length;

        if (!filtered.length) {
            listEl.innerHTML = `<div class="bst-catalog-empty">Ничего не найдено</div>`;
            return;
        }

        listEl.innerHTML = filtered.map(item => {
            const name = item.displayName || item.label || item.id;
            const avatarUrl = item.avatarUrl || (item.id ? AvatarRegistry.getAvatarDataUrl(item.id) : null);
            const faction = item.defaultFaction || 'enemy';
            const factionDot = faction === 'friend' ? '🟢' : (faction === 'neutral' ? '🟡' : '🔴');

            return `
                <div class="bst-catalog-row" data-cat-id="${item.id || ''}" data-cat-name="${name}" data-cat-faction="${faction}">
                    <div class="bst-catalog-row-main" title="Нажмите, чтобы подставить в форму, или выберите кнопку справа">
                        ${avatarUrl
                ? `<img src="${avatarUrl}" class="bst-catalog-thumb">`
                : `<div class="bst-catalog-thumb bst-catalog-thumb-empty">⚔️</div>`
            }
                        <span class="bst-catalog-name">${factionDot} ${name}</span>
                    </div>
                    <div class="bst-catalog-actions">
                        <button type="button" class="bst-cat-btn-party" title="Добавить в Текущий отряд">🛡️</button>
                        <button type="button" class="bst-cat-btn-monster" title="Добавить в Заготовки монстров/NPC">👹</button>
                    </div>
                </div>
            `;
        }).join('');

        listEl.querySelectorAll('.bst-catalog-row').forEach(row => {
            const catId = row.dataset.catId || null;
            const catName = row.dataset.catName;
            const catFaction = row.dataset.catFaction;

            row.querySelector('.bst-catalog-row-main').addEventListener('click', () => {
                const nameInp = document.getElementById('bstInputName');
                const factionSel = document.getElementById('bstInputFaction');
                this._pendingAvatarType = catId;
                if (nameInp) {
                    nameInp.value = catName;
                    nameInp.focus();
                }
                if (factionSel && catFaction) {
                    factionSel.value = catFaction;
                }
            });

            row.querySelector('.bst-cat-btn-party').addEventListener('click', (e) => {
                e.stopPropagation();
                this._pendingAvatarType = catId;
                this.addPreset(catName, 'friend', 10);
            });

            row.querySelector('.bst-cat-btn-monster').addEventListener('click', (e) => {
                e.stopPropagation();
                this._pendingAvatarType = catId;
                this.addPreset(catName, catFaction === 'friend' ? 'neutral' : catFaction, 10);
            });
        });
    },


    buildUnitTooltipHtml(item, options = {}) {
        const stats = this._ensureCharacterStats(item);
        const fmtMod = (val) => {
            const n = Number(val) || 0;
            return n > 0 ? `+${n}` : `${n}`;
        };

        const isCombat = !!options.isCombat;
        const isCurrentTurn = !!options.isCurrentTurn;
        const isInactive = !!options.isInactive;
        const scoreVal = options.score ?? item.defaultScore ?? 10;

        let badgeHtml = '';
        if (isCombat) {
            badgeHtml = isCurrentTurn
                ? '<span class="init-tip-turn-tag">▶ СЕЙЧАС ХОДИТ</span>'
                : `<span class="init-tip-turn-tag" style="border-color:#543e0d; color:#ebd291; background:rgba(0,0,0,0.35);">Ур. ${stats.level ?? 1}</span>`;
        } else if (item.faction === 'friend') {
            badgeHtml = isInactive
                ? '<span class="init-tip-turn-tag" style="border-color:#95a5a6; color:#b2bec3; background:rgba(149,165,166,0.18);">💤 В РЕЗЕРВЕ</span>'
                : '<span class="init-tip-turn-tag">🛡️ В ОТРЯДЕ</span>';
        } else {
            badgeHtml = `<span class="init-tip-turn-tag" style="border-color:#e74c3c; color:#ff7675; background:rgba(231,76,60,0.18);">Ур. ${stats.level ?? 1}</span>`;
        }

        const metaParts = [
            stats.charClass,
            stats.ancestry,
            stats.level ? `Ур. ${stats.level}` : ''
        ].filter(Boolean);

        const attrs = [
            ['Сила', stats.str], ['Ловкость', stats.dex], ['Выносливость', stats.con],
            ['Интеллект', stats.int], ['Мудрость', stats.wis], ['Харизма', stats.cha]
        ];
        const defenses = [
            ['👁️ Внимание', fmtMod(stats.perception ?? stats.perc)],
            ['🛡️ Стойкость', fmtMod(stats.fortitude ?? stats.fort)],
            ['⚡ Реакция', fmtMod(stats.reflex ?? stats.ref)],
            ['🧠 Воля', fmtMod(stats.will)]
        ];

        const armorPenalty = Math.abs(Number(stats.acArmorPenalty) || 0);

        const skills = [
            ['Акробатика', (stats.acrobatics ?? stats.acro) - armorPenalty], // Авто-вычитание штрафа
            ['Аркана', stats.arcana ?? stats.arca],
            ['Атлетика', (stats.athletics ?? stats.athl) - armorPenalty],    // Авто-вычитание штрафа
            ['Ремесло', stats.crafting],
            ['Обман', stats.deception ?? stats.dece],
            ['Дипломатия', stats.diplomacy ?? stats.dipl],
            ['Запугивание', stats.intimidation ?? stats.inti],
            ['Знания (Lore)', stats.lore],
            ['Медицина', stats.medicine ?? stats.medi],
            ['Природа', stats.nature ?? stats.natu],
            ['Оккультизм', stats.occultism ?? stats.occu],
            ['Выступление', stats.performance],
            ['Религия', stats.religion ?? stats.reli],
            ['Общество', stats.society],
            ['Скрытность', (stats.stealth ?? stats.stea) - armorPenalty],    // Авто-вычитание штрафа
            ['Выживание', stats.survival ?? stats.surv],
            ['Воровство', (stats.thievery ?? stats.thievery) - armorPenalty] // Авто-вычитание штрафа
        ].filter(([, v]) => v !== undefined);



        const attacks = [
            stats.melee1Name ? `⚔️ ${stats.melee1Name} <b>${stats.melee1Atk || ''}</b> ${stats.melee1Dmg ? `(${stats.melee1Dmg})` : ''}` : '',
            stats.melee2Name ? `🗡️ ${stats.melee2Name} <b>${stats.melee2Atk || ''}</b> ${stats.melee2Dmg ? `(${stats.melee2Dmg})` : ''}` : '',
            stats.rangedName ? `🏹 ${stats.rangedName} <b>${stats.rangedAtk || ''}</b> ${stats.rangedDmg ? `(${stats.rangedDmg})` : ''}` : ''
        ].filter(Boolean);

        const cantrips = [1, 2, 3, 4, 5]
            .map(i => stats[`cantrip${i}Name`]
                ? `✨ ${stats[`cantrip${i}Name`]}${stats[`cantrip${i}Actions`] ? ` (${stats[`cantrip${i}Actions`]})` : ''}`
                : '')
            .filter(Boolean);

        const focusSpells = [1, 2, 3]
            .map(i => stats[`focusSpell${i}Name`]
                ? `💠 ${stats[`focusSpell${i}Name`]}${stats[`focusSpell${i}Actions`] ? ` (${stats[`focusSpell${i}Actions`]})` : ''}`
                : '')
            .filter(Boolean);

        const lvl1Spells = [1, 2, 3, 4, 5, 6, 7]
            .map(i => stats[`lvl1Spell${i}Name`]
                ? `1️⃣ ${stats[`lvl1Spell${i}Name`]}${stats[`lvl1Spell${i}Actions`] ? ` (${stats[`lvl1Spell${i}Actions`]})` : ''}`
                : '')
            .filter(Boolean);

        const lvl2Spells = [1, 2, 3, 4, 5]
            .map(i => stats[`lvl2Spell${i}Name`]
                ? `2️⃣ ${stats[`lvl2Spell${i}Name`]}${stats[`lvl2Spell${i}Actions`] ? ` (${stats[`lvl2Spell${i}Actions`]})` : ''}`
                : '')
            .filter(Boolean);

        const combatItems = Array.from({ length: 15 }, (_, idx) => idx + 1)
            .map(i => {
                const name = stats[`item${i}Name`];
                const qty = Number(stats[`item${i}Qty`]) || 0;
                const notes = stats[`item${i}Notes`] || '';
                if (!name || qty <= 0 || !isCombatConsumable(name, notes)) return '';
                return `🧪 ${name} <b>(×${qty})</b>`;
            })
            .filter(Boolean);

        const hasFocusPool = focusSpells.length > 0 || Number(stats.focusMax) > 0;
        const hasAnyMagic = cantrips.length > 0 || focusSpells.length > 0 || lvl1Spells.length > 0 || lvl2Spells.length > 0;

        return `
            <div class="init-tip-header">
                <span class="init-tip-name">${item.name}</span>
                ${badgeHtml}
            </div>
            <div class="init-tip-top-row">
                <span>🎲 Иниц.: <b>${scoreVal}</b></span>
                <span>❤️ ПЗ: <b>${stats.hpCurrent ?? stats.hpMax ?? 10}/${stats.hpMax ?? 10}</b></span>
                <span>🛡️ КБ: <b>${stats.ac ?? 10}</b></span>
            </div>
            ${metaParts.length ? `<div style="font-size:14px; color:#dfbc6f; margin-top:4px;">${metaParts.join(' • ')}</div>` : ''}
            <div class="init-tip-section">
                <div class="init-tip-sec-title">⚔️ Характеристики</div>
                <div class="init-tip-2col">
                    ${attrs.map(([lbl, v]) => `<div>${lbl}: <b>${fmtMod(v)}</b></div>`).join('')}
                </div>
            </div>
            <div class="init-tip-section">
                <div class="init-tip-sec-title">🛡️ Внимание и Спасброски</div>
                <div class="init-tip-2col">
                    ${defenses.map(([lbl, v]) => `<div>${lbl}: <b>${v}</b></div>`).join('')}
                </div>
            </div>
            ${attacks.length ? `
            <div class="init-tip-section">
                <div class="init-tip-sec-title">🗡️ Оружие и Атаки</div>
                <div style="font-size:14px; display:flex; flex-direction:column; gap:2px;">
                    ${attacks.map(a => `<div>${a}</div>`).join('')}
                </div>
            </div>` : ''}
            ${hasAnyMagic ? `
            <div class="init-tip-section">
                <div class="init-tip-sec-title" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
                    <span>✨ Магия и Фокусы (СЛ ${stats.spellDc ?? 10} / Атк ${fmtMod(stats.spellAttack)})</span>
                    ${hasFocusPool ? `<span style="color:#3498db;">🔋 Фокус: ${stats.focusCurrent ?? 1}/${stats.focusMax ?? 1}</span>` : ''}
                </div>
                <div style="font-size:14px; display:flex; flex-direction:column; gap:2px;">
                    ${focusSpells.map(s => `<div>${s}</div>`).join('')}
                    ${cantrips.map(s => `<div>${s}</div>`).join('')}
                    ${lvl1Spells.map(s => `<div>${s}</div>`).join('')}
                    ${lvl2Spells.map(s => `<div>${s}</div>`).join('')}
                </div>
            </div>` : ''}
            ${combatItems.length ? `
            <div class="init-tip-section">
                <div class="init-tip-sec-title">🧪 Боевые расходники</div>
                <div style="font-size:14px; display:flex; flex-direction:column; gap:2px;">
                    ${combatItems.map(ci => `<div>${ci}</div>`).join('')}
                </div>
            </div>` : ''}
            <div class="init-tip-section">
                <div class="init-tip-sec-title">📜 Навыки</div>
                <div class="init-tip-3col">
                    ${skills.map(([lbl, v]) => `<div>${lbl}: <b>${fmtMod(v)}</b></div>`).join('')}
                </div>
            </div>
            ${options.extraFooterHtml || ''}
        `;
    },



};

export default BestiaryManager;
