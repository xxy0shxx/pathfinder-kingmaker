import { MonsterAvatars } from './avatar_monsters.js';
import { NpcAvatars } from './avatar_npc.js';
import { HeroAvatars } from './avatar_heroes.js';

const AVATAR_CATALOG = {
    heroes: [
        { id: 'amiri', label: '🗡️🐻 Амири (Варварша)' },
        { id: 'valerie', label: '🛡️⚔️ Валери (Защитница)' },
        { id: 'harrim', label: '🌑⛏️ Харрим (Жрец Гротуса)' },
        { id: 'tristian', label: '☀️🔥 Тристиан (Жрец Саренрэй)' },
        { id: 'linzi', label: '🪶📖 Линдзи (Бард)' },
        { id: 'jaethal', label: '💀⚔️ Джейтал (Инквизитор)' },
        { id: 'jubilost', label: '🧪💣 Джубилост (Алхимик)' },
        { id: 'nok_nok', label: '🗡️👑 Нок-Нок (Гоблин-герой)' },
        { id: 'ekundayo', label: '🏹🐺 Экандейо (Следопыт)' },
        { id: 'octavia', label: '✨🪄 Октавия (Трикстер)' },
        { id: 'regongar', label: '⚡🗡️ Регонгар (Магус)' },
        { id: 'kalikke', label: '💧😈 Каликке (Кинетик воды)' },
        { id: 'kanerah', label: '🔥😈 Канера (Кинетик огня)' },
        { id: 'bard', label: '🎵 Бард' },
        { id: 'barbarian', label: '🪓 Варвар' },
        { id: 'warrior_female', label: '⚔️ Воительница' },
        { id: 'wizardess', label: '🔮🧝 Волшебница' },
        { id: 'dwarf', label: '🧔 Дварф' },
        { id: 'dwarf_paladin', label: '☀️🧔 Дварф Паладин' },
        { id: 'priestess', label: '🕊️ Жрец-Женщина' },
        { id: 'battle_priestess', label: '🔨🧎 Жрец-Женщина со щитом' },
        { id: 'tabaxi_monk', label: '🐱🥋 Котолюд-Монах' },
        { id: 'archer', label: '🏹 Лучник' },
        { id: 'wizard', label: '🔮 Маг' },
        { id: 'orc', label: '👹 Орк' },
        { id: 'hunter', label: '🪵 Охотник' },
        { id: 'paladin', label: '🛡️ Паладин' },
        { id: 'halfling', label: '🍁 Полурослица' },
        { id: 'halfling_bard', label: '🎶🍁 Полурослица-Бард' },
        { id: 'rogue', label: '🗡️ Разбойник' },
        { id: 'heavy_warrior', label: '🛡️ Тяжелый Воин' },
        { id: 'elf', label: '🧝 Эльф Серебряный' },
        { id: 'elf_archer', label: '🏹🧝 Эльфийка-Лучница' }
    ],
    npc: [
        { id: 'oleg', label: '🍺🏪 Олег (Торговый пост)' },
        { id: 'svetlana', label: '🧣🌼 Светлана (Торговый пост)' },
        { id: 'kesten', label: '🛡️⚔️ Кестен Гаресс (Капитан)' },
        { id: 'jhod', label: '🦌🏹 Джод Кавкен (Жрец Эрастила)' },
        { id: 'nyrissa', label: '🌿🌹 Нирисса (Королева-нимфа)' },
        { id: 'prazil', label: '🔨🦎 Празил (Чёрный Кобольд)' },
        { id: 'grigory', label: '🪶📜 Григорий' },
        { id: 'halfling_male', label: '👺 Тартуччио' },
        { id: 'bandit_queen', label: '🪓🏴‍☠️ Атаманша' },
        { id: 'bandit_captain', label: '🏴‍☠️ Главарь Бандитов' },
        { id: 'townsman', label: '👱 Горожанин' },
        { id: 'townswoman', label: '👩 Горожанка' },
        { id: 'courtesan', label: '🌹 Куртизанка Трактирная' },
        { id: 'elder', label: '👴 Старец' },
        { id: 'guard', label: '💂 Стражник Городской' },
        { id: 'merchant', label: '💰 Торговец' },
        { id: 'farmer', label: '🌾 Фермер' }
    ],
    monsters: [
        { id: 'boggard_priest', label: '🐸🔮 Боггард-Жрец' },
        { id: 'warg', label: '🐺🔥 Варг' },
        { id: 'frost_giant', label: '❄️ Великан Снежный' },
        { id: 'bloom_wyvern', label: '🌿🐉 Виверна Цветения' },
        { id: 'wolf', label: '🐺 Волк' },
        { id: 'raven', label: '🐦 Ворона' },
        { id: 'goblin', label: '👺 Гоблин' },
        { id: 'violet_mushroom', label: '🍄 Гриб Фиолетовый' },
        { id: 'dragon', label: '🐲 Дракон Древний' },
        { id: 'faerie_dragon', label: '🦋🐉 Дракончик Волшебный' },
        { id: 'dryad', label: '🌿 Дриада Лесная' },
        { id: 'satyr_dryad', label: '🐐🌿 Дриада-Сатир' },
        { id: 'toad', label: '🐸 Жаба' },
        { id: 'boggard', label: '🐸🦎 Жаболюд' },
        { id: 'green_ooze', label: '🦠💚 Жижа Зелёная' },
        { id: 'zombie', label: '🧟 Зомби' },
        { id: 'mind_flayer', label: '🐙🧠 Иллитид' },
        { id: 'boar', label: '🐗 Кабан' },
        { id: 'hag', label: '🧙‍♀️ Карга' },
        { id: 'tick', label: '🦟 Клещ' },
        { id: 'kobold', label: '🦎 Кобольд' },
        { id: 'cat', label: '🐱 Кот Рыжий' },
        { id: 'giant_rat', label: '🐀 Крыса Гигантская' },
        { id: 'lizardfolk', label: '🐊🛡️ Людоящер' },
        { id: 'manticore', label: '🦁🦂 Мантикора' },
        { id: 'grey_mammoth', label: '🦣 Мамонт Серый' },
        { id: 'mitflit', label: '🗡️👂 Митфлит' },
        { id: 'bear', label: '🐻 Медведь' },
        { id: 'owlbear', label: '🦉🐻 Медвесыч' },
        { id: 'ogre', label: '🏏👹 Огр с дубиной' },
        { id: 'deer', label: '🦌 Олень' },
        { id: 'orc_warrior', label: '🪓👹 Орк-воин' },
        { id: 'spider', label: '🕷️ Паук' },
        { id: 'ambush_spider', label: '🌿🕷️ Паук-Людоед' },
        { id: 'hunter_spider', label: '🕷️⚡ Паук-Охотник' },
        { id: 'black_roc', label: '🦅🖤 Птица-Рух' },
        { id: 'skeleton', label: '💀 Скелет' },
        { id: 'skeleton_warrior', label: '⚔️💀 Скелет-Воин' },
        { id: 'death_knight', label: '👑💀 Скелет Рыцарь Смерти' },
        { id: 'cyclops_skeleton', label: '👁️💀 Скелет-Циклоп' },
        { id: 'tiger', label: '🐯 Тигр' },
        { id: 'thylacine', label: '🐺🐯 Тилацин' },
        { id: 'troll', label: '👹 Тролль Болотный' },
        { id: 'shambling_mound', label: '🌿🪵 Ходок' },
        { id: 'worm', label: '🐛 Червь' }
    ]
};

const ALL_GENERATORS = {
    ...HeroAvatars,
    ...NpcAvatars,
    ...MonsterAvatars
};

const _avatarCache = {};

const AvatarRegistry = {
    getAvatarDataUrl(avatarType) {
        if (!avatarType || !ALL_GENERATORS[avatarType]) return null;
        if (!_avatarCache[avatarType]) {
            _avatarCache[avatarType] = ALL_GENERATORS[avatarType]();
        }
        return _avatarCache[avatarType];
    },

    buildSelectOptionsHtml(selectedType) {
        const renderGroup = (label, items) => {
            const opts = items.map(item =>
                `<option value="${item.id}" ${selectedType === item.id ? 'selected' : ''}>${item.label}</option>`
            ).join('');
            return `<optgroup label="${label}">${opts}</optgroup>`;
        };

        return [
            `<option value="">👤 Нет фото</option>`,
            renderGroup('👹 Монстры и Бестиарий', AVATAR_CATALOG.monsters),
            renderGroup('📜 Сюжетные NPC и Жители', AVATAR_CATALOG.npc),
            renderGroup('⚔️ Герои и Спутники', AVATAR_CATALOG.heroes)
        ].join('');
    }
};

export default AvatarRegistry;
