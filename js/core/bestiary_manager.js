import AvatarRegistry from '../services/avatars/avatar_registry.js';
import EventBus from '../services/event_bus.js';
import ModalManager from '../ui/modal_manager.js';

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
        { key: 'acrobatics', label: '🤸 Акробатика (Лвк)' },
        { key: 'athletics', label: '🏋️ Атлетика (Сил)' },
        { key: 'thievery', label: '🗝️ Воровство (Лвк)' },
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
        { key: 'stealth', label: '🥷 Скрытность (Лвк)' }
    ]
};

const BestiaryManager = {
    state: {
        party: [],     // Текущий отряд (Герои / Союзники)
        monsters: []   // Подготовленные монстры / NPC / Враги
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
        } else {
            this.mapDataRef.bestiary = this.state;
        }

        EventBus.on('data:imported', (newData) => {
            this.mapDataRef = newData || {};
            if (this.mapDataRef.bestiary) {
                this.state = this.mapDataRef.bestiary;
                if (!Array.isArray(this.state.party)) this.state.party = [];
                if (!Array.isArray(this.state.monsters)) this.state.monsters = [];
            }
            this.renderUi();
        });

        window.BestiaryManager = this;
        this.renderUi();
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
            spellAttack: 0, spellDc: 10,
            cantripsPerDay: 5, lvl1PerDay: 0, lvl2PerDay: 0,
            coinsCopper: 0, coinsSilver: 0, coinsGold: 0
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
            cantripsPrepared: '',
            lvl1Prepared: '',
            lvl2Prepared: '',
            spellbookText: '',
            adventureLogText: '',
            notesText: ''
        };

        Object.entries(textDefaults).forEach(([k, def]) => {
            if (item.stats[k] === undefined || item.stats[k] === null) {
                item.stats[k] = def;
            }
        });

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


        if (faction === 'friend') {
            this._ensureCharacterStats(entry);
            this.state.party.push(entry);
        } else {
            this.state.monsters.push(entry);
        }
        this._save();
    },

    removePreset(groupKey, id) {
        if (groupKey === 'party') {
            this.state.party = this.state.party.filter(x => x.id !== id);
        } else {
            this.state.monsters = this.state.monsters.filter(x => x.id !== id);
        }
        this._save();
    },

    updatePresetScore(groupKey, id, val) {
        const num = Math.max(1, Math.min(100, parseInt(val, 10) || 10));
        const list = groupKey === 'party' ? this.state.party : this.state.monsters;
        const item = list.find(x => x.id === id);
        if (item) {
            item.defaultScore = num;
            this._save();
        }
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
        const hero = this.state.party.find(x => x.id === heroId);
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
                        <div class="k-sec-title">❤️ Пункты здоровья, Скорость и Защита</div>
                        <div class="bst-vitals-row">
                            <div class="bst-vital-box"><span>❤️ Макс. ПЗ</span>${numInp('hpMax', 'bst-vital-num')}</div>
                            <div class="bst-vital-box"><span>🩸 Текущие ПЗ</span>${numInp('hpCurrent', 'bst-vital-num')}</div>
                            <div class="bst-vital-box"><span>💠 Врем. ПЗ</span>${numInp('hpTemp', 'bst-vital-num')}</div>
                            <div class="bst-vital-box"><span>👟 Скорость</span>${numInp('speed', 'bst-vital-num')}</div>
                            <div class="bst-vital-box bst-ac-highlight"><span>🛡️ КБ (AC)</span>${numInp('ac', 'bst-vital-num')}</div>
                        </div>
                        <div class="bst-ac-breakdown">
                            <select data-sheet-txt="armorType" class="k-inp" style="width: auto; font-size: 13px;">
                                <option value="unarmored" ${stats.armorType === 'unarmored' ? 'selected' : ''}>👕 Без брони</option>
                                <option value="light" ${stats.armorType === 'light' ? 'selected' : ''}>🧥 Лёгкая броня</option>
                                <option value="medium" ${stats.armorType === 'medium' ? 'selected' : ''}>🦺 Средняя броня</option>
                                <option value="heavy" ${stats.armorType === 'heavy' ? 'selected' : ''}>🛡️ Тяжёлая броня</option>
                            </select>
                            <label>🤸 Лвк: ${numInp('acDex', 'bst-tiny-num')}</label>
                            <label>🎓 Умение: ${numInp('acProf', 'bst-tiny-num')}</label>
                            <label>💍 Предмет: ${numInp('acItem', 'bst-tiny-num')}</label>
                            <label>➕ Прочее: ${numInp('acOther', 'bst-tiny-num')}</label>
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
                        <div class="bst-weapon-row">
                            ${txtInp('melee1Name', '⚔️ Ближний бой 1')}
                            ${txtInp('melee1Atk', '🎯 Атака (+)')}
                            ${txtInp('melee1Dmg', '💥 Урон (1d8+3)')}
                            ${txtInp('melee1Traits', '🏷️ Дескрипторы')}
                        </div>
                        <div class="bst-weapon-row">
                            ${txtInp('melee2Name', '🗡️ Ближний бой 2')}
                            ${txtInp('melee2Atk', '🎯 Атака (+)')}
                            ${txtInp('melee2Dmg', '💥 Урон')}
                            ${txtInp('melee2Traits', '🏷️ Дескрипторы')}
                        </div>
                        <div class="bst-weapon-row">
                            ${txtInp('rangedName', '🏹 Дистанционное')}
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
        const page2Html = `
            <div class="bst-sheet-page2-grid">
                <div class="bst-sheet-col">
                    <div class="k-panel" style="margin-bottom: 10px;">
                        <div class="k-sec-title">🎒 Снаряжение и Деньги</div>
                        <div class="bst-coins-row">
                            <label>🥉 ММ: ${numInp('coinsCopper', 'bst-mini-num')}</label>
                            <label>🥈 СМ: ${numInp('coinsSilver', 'bst-mini-num')}</label>
                            <label>🥇 ЗМ: ${numInp('coinsGold', 'bst-mini-num')}</label>
                        </div>
                        ${txtArea('equipmentText', 6, '🎒 Список снаряжения, зелий, свитков и предметов...')}
                    </div>

                    <div class="k-panel">
                        <div class="k-sec-title">✨ Сотворение заклинаний</div>
                        <div class="bst-spell-stats-row">
                            <label>🎯 Проверка атаки: ${numInp('spellAttack', 'bst-mini-num')}</label>
                            <label>🔮 СЛ заклинаний: ${numInp('spellDc', 'bst-mini-num')}</label>
                        </div>

                        <div class="bst-spell-tier">
                            <div class="bst-spell-tier-head">
                                <span>✨ Фокусы (подготовлено)</span>
                                <label>📅 В день: ${numInp('cantripsPerDay', 'bst-tiny-num')}</label>
                            </div>
                            ${txtArea('cantripsPrepared', 2, 'Список подготовленных фокусов...')}
                        </div>

                        <div class="bst-spell-tier">
                            <div class="bst-spell-tier-head">
                                <span>1️⃣ Заклинания 1 круга</span>
                                <label>📅 В день: ${numInp('lvl1PerDay', 'bst-tiny-num')}</label>
                            </div>
                            ${txtArea('lvl1Prepared', 3, 'Заклинания 1 круга...')}
                        </div>

                        <div class="bst-spell-tier">
                            <div class="bst-spell-tier-head">
                                <span>2️⃣ Заклинания 2 круга</span>
                                <label>📅 В день: ${numInp('lvl2PerDay', 'bst-tiny-num')}</label>
                            </div>
                            ${txtArea('lvl2Prepared', 3, 'Заклинания 2 круга...')}
                        </div>
                    </div>
                </div>

                <div class="bst-sheet-col">
                    <div class="k-panel" style="margin-bottom: 10px;">
                        <div class="k-sec-title">📖 Журнал приключений</div>
                        ${txtArea('adventureLogText', 5, '📅 Дата — Описание события — Опыт...')}
                    </div>

                    <div class="k-panel" style="margin-bottom: 10px;">
                        <div class="k-sec-title">📝 Заметки персонажа</div>
                        ${txtArea('notesText', 5, '🗒️ Личные заметки, клятвы, связи, особенности...')}
                    </div>

                    <div class="k-panel">
                        <div class="k-sec-title">📚 Книга заклинаний / Репертуар</div>
                        ${txtArea('spellbookText', 5, '📖 Все изученные заклинания...')}
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
            width: '1120px',
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
    },





    _renderZone(elId, title, groupKey, items, isParty) {
        const zone = document.getElementById(elId);
        if (!zone) return;

        zone.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <div class="init-out-zone-title" style="margin:0; font-size:16px; color:${isParty ? '#2ecc71' : '#ff7675'};">
                    ${title} (${items.length})
                </div>
                ${isParty && items.length > 0 ? `<button type="button" class="btn ok" id="bstBtnDeployAllParty" style="padding:4px 12px; font-size:13px;">⚔️ Весь отряд в бой</button>` : ''}
            </div>
            <div class="init-cards-scroll-list mode-bg3 init-out-zone-grid">
                ${items.length === 0 ? `<div style="color:#7f8c8d; font-size:15px; padding:12px;">Список пуст. Добавьте персонажей через строку поиска выше.</div>` : ''}
            </div>
        `;

        const deployAllBtn = zone.querySelector('#bstBtnDeployAllParty');
        if (deployAllBtn) {
            deployAllBtn.addEventListener('click', () => this.deployWholeParty());
        }

        const grid = zone.querySelector('.init-out-zone-grid');
        items.forEach((item, idx) => {




            const card = document.createElement('div');
            card.className = `init-combatant-card faction-${item.faction}`;
            card.innerHTML = `
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
                <button type="button" class="init-btn-delete-card" title="Удалить из заготовок">×</button>
            `;

            card.querySelector('.bst-quick-send-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.deployToInitiative(item);
            });

            card.querySelector('.init-inline-score-input').addEventListener('change', (e) => {
                this.updatePresetScore(groupKey, item.id, e.target.value);
            });

            card.querySelector('.init-btn-delete-card').addEventListener('click', (e) => {
                e.stopPropagation();
                this.removePreset(groupKey, item.id);
            });


            const nameEl = card.querySelector('.init-card-name-text');
            if (nameEl) {
                nameEl.title = isParty
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

                if (isParty) {
                    nameEl.addEventListener('dblclick', (e) => {
                        e.stopPropagation();
                        clearTimeout(clickTimer);
                        this.openCharacterSheetModal(item.id);
                    });
                }
            }


            grid.appendChild(card);
        });


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

};

export default BestiaryManager;
