import { MonsterAvatars } from './avatar_monsters.js';
import { NpcAvatars } from './avatar_npc.js';
import { HeroAvatars } from './avatar_heroes.js';

const AVATAR_CATALOG = {
    heroes: [
        { id: 'amiri', label: '🗡️🐻 Амири (Варварша)' },
        { id: 'valerie', label: '🛡️⚔️ Валери (Защитница)' },
        { id: 'jaethal', label: '💀⚔️ Джейтал (Инквизитор)' },
        { id: 'jubilost', label: '🧪💣 Джубилост (Алхимик)' },
        { id: 'linzi', label: '🪶📖 Линдзи (Бард)' },
        { id: 'nok_nok', label: '🗡️👑 Нок-Нок (Гоблин-герой)' },
        { id: 'octavia', label: '✨🪄 Октавия (Трикстер)' },
        { id: 'kalikke', label: '💧😈 Каликке (Кинетик воды)' },
        { id: 'kanerah', label: '🔥😈 Канера (Кинетик огня)' },
        { id: 'regongar', label: '⚡🗡️ Регонгар (Магус)' },
        { id: 'tristian', label: '☀️🔥 Тристиан (Жрец Саренрэй)' },
        { id: 'harrim', label: '🌑⛏️ Харрим (Жрец Гротуса)' },
        { id: 'ekundayo', label: '🏹🐺 Экандейо (Следопыт)' },
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
        { id: 'ambush_spider', label: '🕷️🌿 Паук-Людоед' },
        { id: 'hunter_spider', label: '🕷️⚡ Паук-Охотник' },
        { id: 'black_roc', label: '🦅🖤 Птица-Рух' },
        { id: 'skeleton', label: '💀 Скелет' },
        { id: 'skeleton_warrior', label: '💀⚔️ Скелет-Воин' },
        { id: 'death_knight', label: '💀👑 Скелет Рыцарь Смерти' },
        { id: 'cyclops_skeleton', label: '💀👁️ Скелет-Циклоп' },
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
    },

    guessAvatarByName(name) {
        if (!name) return null;
        const clean = String(name).toLowerCase().replace(/ё/g, 'е').trim();
        if (!clean) return null;

        // 1. Собираем все элементы каталога и сортируем по длине названия (от длинных к коротким),
        // чтобы "Скелет-Воин" матчился раньше, чем просто "Скелет"
        const allItems = [
            ...AVATAR_CATALOG.heroes,
            ...AVATAR_CATALOG.npc,
            ...AVATAR_CATALOG.monsters
        ].map(item => {
            // Убираем эмодзи и текст в скобках для чистого сравнения имени
            const title = item.label
                .replace(/^[^\p{L}]+/u, '')
                .replace(/\(.*?\)/g, '')
                .toLowerCase()
                .replace(/ё/g, 'е')
                .trim();
            return { id: item.id, title };
        }).sort((a, b) => b.title.length - a.title.length);

        for (const item of allItems) {
            if (item.title.length >= 3 && clean.includes(item.title)) {
                return item.id;
            }
        }

        // 2. Словарь корней и синонимов для склонений ("Волки", "Лютоволк", "Бурый медведь", "Совомед")
        const keywordMap = [
            // Герои Pathfinder и классы
            { keys: ['амири'], id: 'amiri' },
            { keys: ['валери'], id: 'valerie' },
            { keys: ['харрим'], id: 'harrim' },
            { keys: ['тристиан'], id: 'tristian' },
            { keys: ['линдзи'], id: 'linzi' },
            { keys: ['джейтал'], id: 'jaethal' },
            { keys: ['джубилост'], id: 'jubilost' },
            { keys: ['нок-нок', 'нокнок'], id: 'nok_nok' },
            { keys: ['экандейо', 'экан'], id: 'ekundayo' },
            { keys: ['октавия'], id: 'octavia' },
            { keys: ['регонгар'], id: 'regongar' },
            { keys: ['каликке'], id: 'kalikke' },
            { keys: ['канера'], id: 'kanerah' },
            { keys: ['такси', 'табакси', 'котолюд'], id: 'tabaxi_monk' },
            { keys: ['паладин'], id: 'paladin' },
            { keys: ['варвар'], id: 'barbarian' },
            { keys: ['бард'], id: 'bard' },
            { keys: ['лучник', 'стрелок'], id: 'archer' },
            { keys: ['волшебниц', 'чародейк', 'колдунь'], id: 'wizardess' },
            { keys: ['маг', 'волшебник', 'чародей', 'колдун'], id: 'wizard' },
            { keys: ['жрец', 'клирик'], id: 'priestess' },
            { keys: ['разбойник', 'плут', 'вор', 'убийц'], id: 'rogue' },
            { keys: ['охотник', 'следопыт'], id: 'hunter' },
            { keys: ['дварф', 'гном'], id: 'dwarf' },
            { keys: ['эльф'], id: 'elf' },
            { keys: ['полурослик', 'хоббит'], id: 'halfling' },

            // NPC
            { keys: ['тарт', 'тартуччио'], id: 'halfling_male' },
            { keys: ['кестен'], id: 'kesten' },
            { keys: ['джод'], id: 'jhod' },
            { keys: ['нирисс'], id: 'nyrissa' },
            { keys: ['празил'], id: 'prazil' },
            { keys: ['бандит', 'разбойник', 'грабител'], id: 'bandit_captain' },
            { keys: ['страж', 'охранник'], id: 'guard' },
            { keys: ['торгов', 'купец'], id: 'merchant' },

            // Монстры и звери
            { keys: ['лютоволк', 'варг'], id: 'warg' },
            { keys: ['волк', 'волчиц'], id: 'wolf' },
            { keys: ['медвесыч', 'совомед'], id: 'owlbear' },
            { keys: ['медвед'], id: 'bear' },
            { keys: ['кабан', 'вепр'], id: 'boar' },
            { keys: ['паук-охотник'], id: 'hunter_spider' },
            { keys: ['паук-людоед'], id: 'ambush_spider' },
            { keys: ['паук'], id: 'spider' },
            { keys: ['скелет-воин'], id: 'skeleton_warrior' },
            { keys: ['рыцарь смерти'], id: 'death_knight' },
            { keys: ['циклоп'], id: 'cyclops_skeleton' },
            { keys: ['скелет'], id: 'skeleton' },
            { keys: ['зомби', 'мертвец', 'упыр'], id: 'zombie' },
            { keys: ['гоблин'], id: 'goblin' },
            { keys: ['кобольд'], id: 'kobold' },
            { keys: ['орк'], id: 'orc_warrior' },
            { keys: ['огр'], id: 'ogre' },
            { keys: ['тролл'], id: 'troll' },
            { keys: ['великан', 'гигант'], id: 'frost_giant' },
            { keys: ['виверн'], id: 'bloom_wyvern' },
            { keys: ['дракончик'], id: 'faerie_dragon' },
            { keys: ['дракон'], id: 'dragon' },
            { keys: ['боггард', 'жаболюд'], id: 'boggard' },
            { keys: ['жаб', 'лягушк'], id: 'toad' },
            { keys: ['жиж', 'слиз'], id: 'green_ooze' },
            { keys: ['иллитид', 'свежевател'], id: 'mind_flayer' },
            { keys: ['карг', 'ведьм'], id: 'hag' },
            { keys: ['крыс'], id: 'giant_rat' },
            { keys: ['людоящер', 'ящеролюд'], id: 'lizardfolk' },
            { keys: ['мантикор'], id: 'manticore' },
            { keys: ['мамонт'], id: 'grey_mammoth' },
            { keys: ['митфлит'], id: 'mitflit' },
            { keys: ['олен', 'лос'], id: 'deer' },
            { keys: ['птица-рух', 'рух', 'орел', 'орёл'], id: 'black_roc' },
            { keys: ['ворон'], id: 'raven' },
            { keys: ['тигр'], id: 'tiger' },
            { keys: ['тилацин'], id: 'thylacine' },
            { keys: ['кот', 'кошк'], id: 'cat' },
            { keys: ['гриб'], id: 'violet_mushroom' },
            { keys: ['дриад', 'нимф'], id: 'dryad' },
            { keys: ['сатир'], id: 'satyr_dryad' },
            { keys: ['ходок', 'шамбл'], id: 'shambling_mound' },
            { keys: ['черв'], id: 'worm' },
            { keys: ['клещ'], id: 'tick' }
        ];

        for (const entry of keywordMap) {
            if (entry.keys.some(k => clean.includes(k))) {
                return entry.id;
            }
        }

        return null;
    },

    // Внутри объекта AvatarRegistry (перед закрывающей скобкой)
    searchCatalog(query) {
        const clean = String(query || '').toLowerCase().replace(/ё/g, 'е').trim();
        if (!clean) return [];

        const groups = [
            { list: AVATAR_CATALOG.heroes, defaultFaction: 'friend' },
            { list: AVATAR_CATALOG.npc, defaultFaction: 'neutral' },
            { list: AVATAR_CATALOG.monsters, defaultFaction: 'enemy' }
        ];

        const results = [];
        for (const group of groups) {
            for (const item of group.list) {
                const cleanLabel = item.label.toLowerCase().replace(/ё/g, 'е');
                if (cleanLabel.includes(clean)) {
                    const displayName = item.label
                        .replace(/^[^\p{L}]+/u, '')
                        .replace(/\(.*?\)/g, '')
                        .trim();

                    results.push({
                        id: item.id,
                        label: item.label,
                        displayName,
                        defaultFaction: group.defaultFaction,
                        avatarUrl: this.getAvatarDataUrl(item.id)
                    });
                }
            }
        }
        return results.slice(0, 12);
    }


};

export default AvatarRegistry;
