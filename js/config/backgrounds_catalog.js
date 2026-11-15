/**
 * Справочник Общих Происхождений Pathfinder 2e Remaster (перевод pf2.ru)
 */
export const PF2E_BACKGROUNDS = [
    {
        id: 'bg_barrister',
        name: '📜 Адвокат (Barrister)',
        skill: 'diplomacy',
        skillName: 'Дипломатия',
        lore: 'Знание (закон)',
        boosts: ['int', 'cha'],
        feat: 'Групповое Впечатление',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_martial_disciple',
        name: '🥋 Адепт боевых искусств (Martial Disciple)',
        skill: 'athletics', // По умолчанию вешаем на Атлетику (или Акробатика)
        skillName: 'Атлетика / Акробатика',
        lore: 'Знание (Военное дело)',
        boosts: ['str', 'dex'],
        feat: 'Кошачье Приземление / Быстрый Прыжок',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_gambler',
        name: '🎲 Азартный игрок (Gambler)',
        skill: 'deception',
        skillName: 'Обман',
        lore: 'Знание (игры)',
        boosts: ['dex', 'cha'],
        feat: 'Обманщик',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_academic_scion',
        name: '🏛️ Академический наследник (Academic Scion)',
        skill: 'arcana',
        skillName: 'Мистицизм',
        lore: 'Знание (академия)',
        boosts: ['int', 'cha'],
        feat: 'Мистическое чутьё',
        source: 'Академии — соперницы'
    },
    {
        id: 'bg_acrobat',
        name: '🤸 Акробат (Acrobat)',
        skill: 'acrobatics',
        skillName: 'Акробатика',
        lore: 'Знание (цирк)',
        boosts: ['str', 'dex'],
        feat: 'Устойчивое Равновесие',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_acupuncturist',
        name: '🪡 Акупунктурист (Acupuncturist)',
        skill: 'medicine',
        skillName: 'Медицина',
        lore: 'Знание (акупунктура)',
        boosts: ['dex', 'wis'],
        feat: 'Медицина в бою',
        source: 'Тянь-Ша. Руководство по персонажам'
    },
    {
        id: 'bg_alkenstar_outlaw',
        name: '⚙️ Алькенстарский преступник (Alkenstar Outlaw)',
        skill: 'thievery',
        skillName: 'Воровство',
        lore: 'Знание (преступный мир)',
        boosts: ['dex', 'con'],
        feat: 'Незаметная Кража',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_anti_tech_activist',
        name: '💥 Антитехнический активист (Anti-Tech Activist)',
        skill: 'intimidation',
        skillName: 'Запугивание',
        lore: 'Знание (Гильдии)',
        boosts: ['con', 'cha'],
        feat: 'Групповая Угроза',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_disciple_gear',
        name: '🔧 Апостол шестерни (Disciple of the Gear)',
        skill: 'crafting',
        skillName: 'Ремесло',
        lore: 'Знание божества шестерен',
        boosts: ['int', 'wis'],
        feat: 'Быстрая Починка',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_entertainer',
        name: '🎭 Артист (Entertainer)',
        skill: 'performance',
        skillName: 'Исполнение',
        lore: 'Знание (театр)',
        boosts: ['dex', 'cha'],
        feat: 'Завораживающее Выступление',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_fireworks_performer',
        name: '🎆 Артист-пиротехник (Fireworks Performer)',
        skill: 'performance',
        skillName: 'Исполнение',
        lore: 'Знание (инженерное дело)',
        boosts: ['int', 'cha'],
        feat: 'Завораживающее Выступление',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_saloon_entertainer',
        name: '🤠 Артист салуна (Saloon Entertainer)',
        skill: 'performance',
        skillName: 'Исполнение',
        lore: 'Знание (по выбору)',
        boosts: ['dex', 'cha'],
        feat: 'Исполнитель-Виртуоз',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_astrologer',
        name: '🌌 Астролог (Astrologer)',
        skill: 'occultism',
        skillName: 'Оккультизм',
        lore: 'Знание (астрология)',
        boosts: ['int', 'wis'],
        feat: 'Опознание странностей',
        source: 'Основная книга игрока 2'
    },
    {
        id: 'bg_bachuan_revolutionary',
        name: '🚩 Бачуаньский революционер (Bachuan Revolutionary)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание (закон)',
        boosts: ['str', 'wis'],
        feat: 'Язык жестов',
        source: 'Тянь-Ша. Руководство по персонажам'
    },
    {
        id: 'bg_runaway_noble',
        name: '👑 Беглый дворянин (Runaway Noble)',
        skill: 'diplomacy',
        skillName: 'Дипломатия',
        lore: 'Знание (геральдика)',
        boosts: ['int', 'cha'],
        feat: 'Подколка',
        source: 'Тянь-Ша. Руководство по персонажам'
    },
    {
        id: 'bg_refugee',
        name: '🏕️ Беженец (Refugee)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание поселения',
        boosts: ['con', 'wis'],
        feat: 'Бывалый',
        source: 'Основная книга игрока 2'
    },
    {
        id: 'bg_noble',
        name: '🏰 Благородный (Noble)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание (генеалогия)',
        boosts: ['int', 'cha'],
        feat: 'Изящные Манеры',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_blessed',
        name: '😇 Благословлённый (Blessed)',
        skill: 'religion',
        skillName: 'Религия',
        lore: 'Знание божества',
        boosts: ['wis', 'cha'],
        feat: 'Религиозный оберег',
        source: 'Основная книга игрока 2'
    },
    {
        id: 'bg_combat_chaplain',
        name: '⚔️ Боевой капеллан (Combat Chaplain)',
        skill: 'religion',
        skillName: 'Религия',
        lore: 'Знание божества',
        boosts: ['wis', 'cha'],
        feat: 'Опознание заклинания',
        source: 'Боевой клич!'
    },
    {
        id: 'bg_battle_mechanic',
        name: '⚙️ Боевой механик (Battle Mechanic)',
        skill: 'crafting',
        skillName: 'Ремесло',
        lore: 'Знание (транспорт)',
        boosts: ['int', 'wis'],
        feat: 'Быстрая починка',
        source: 'Боевой клич!'
    },
    {
        id: 'bg_combat_carpenter',
        name: '🪓 Боевой плотник (Combat Carpenter)',
        skill: 'crafting',
        skillName: 'Ремесло',
        lore: 'Знание (инженерное дело)',
        boosts: ['dex', 'int'],
        feat: 'Ремесленник-специалист',
        source: 'Боевой клич!'
    },
    {
        id: 'bg_warrior',
        name: '⚔️ Боец (Warrior)',
        skill: 'intimidation',
        skillName: 'Запугивание',
        lore: 'Знание (военное дело)',
        boosts: ['str', 'con'],
        feat: 'Устрашающий Взгляд',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_street_urchin',
        name: '🐀 Бродяга (Street Urchin)',
        skill: 'thievery',
        skillName: 'Воровство',
        lore: 'Знание города',
        boosts: ['dex', 'con'],
        feat: 'Карманник',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_waste_walker',
        name: '🌵 Бродящий по пустоши (Waste Walker)',
        skill: 'survival',
        skillName: 'Выживание',
        lore: 'Знание (Пустоши Маны)',
        boosts: ['str', 'wis'],
        feat: 'Собиратель',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_discarded_duplicate',
        name: '👥 Брошенный дубликат (Discarded Duplicate)',
        skill: 'deception',
        skillName: 'Обман',
        lore: 'Знание (алхимия)',
        boosts: ['con', 'int'],
        feat: 'Дубликация воспоминаний',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_veteran',
        name: '🎖️ Ветеран (Veteran)',
        skill: 'athletics',
        skillName: 'Атлетика',
        lore: 'Знание (военное дело)',
        boosts: ['con', 'wis'],
        feat: 'Облачение в броню',
        source: 'Боевой клич!'
    },
    {
        id: 'bg_driver',
        name: '🐎 Водитель (Driver)',
        skill: 'acrobatics',
        skillName: 'Акробатика',
        lore: 'Знание (вождение)',
        boosts: ['str', 'dex'],
        feat: 'Уверенность',
        source: 'Основная книга игрока 2'
    },
    {
        id: 'bg_martial_musician',
        name: '🎺 Военный музыкант (Martial Musician)',
        skill: 'performance',
        skillName: 'Исполнение',
        lore: 'Знание (военное дело)',
        boosts: ['dex', 'cha'],
        feat: 'Впечатляющее исполнение',
        source: 'Боевой клич!'
    },
    {
        id: 'bg_returned',
        name: '🧟 Возвращённый (Returned)',
        skill: 'religion',
        skillName: 'Религия',
        lore: 'Знание (загробный мир)',
        boosts: ['con', 'wis'],
        feat: 'Крепкий орешек',
        source: 'Основная книга игрока 2'
    },
    {
        id: 'bg_aeronaut',
        name: '🎈 Воздухоплаватель (Aeronaut)',
        skill: 'athletics',
        skillName: 'Атлетика',
        lore: 'Знание (пилотирование)',
        boosts: ['str', 'dex'],
        feat: 'Уверенность',
        source: 'Боевой клич!'
    },
    {
        id: 'bg_raised_by_belief',
        name: '⛪ Воспитанный в вере (Raised by Belief)',
        skill: 'religion',
        skillName: 'Религия',
        lore: 'Знание божества',
        boosts: ['str', 'dex'],
        feat: 'Уверенность',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_fortune_teller',
        name: '🔮 Гадатель (Fortune Teller)',
        skill: 'occultism',
        skillName: 'Оккультизм',
        lore: 'Знание (гадание)',
        boosts: ['int', 'cha'],
        feat: 'Опознание Странностей',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_gladiator',
        name: '🛡️ Гладиатор (Gladiator)',
        skill: 'performance',
        skillName: 'Исполнение',
        lore: 'Знание (гладиаторы)',
        boosts: ['str', 'cha'],
        feat: 'Впечатляющее Исполнение',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_report_runner',
        name: '🏃 Гонец (Report Runner)',
        skill: 'nature',
        skillName: 'Природа',
        lore: 'Знание (конюшни)',
        boosts: ['str', 'wis'],
        feat: 'Скоростной наездник',
        source: 'Боевой клич!'
    },
    {
        id: 'bg_undertaker',
        name: '⚰️ Гробовщик (Undertaker)',
        skill: 'medicine',
        skillName: 'Медицина',
        lore: 'Знание (нежить)',
        boosts: ['int', 'wis'],
        feat: 'Проницательная Экспертиза',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_dendrologist',
        name: '🌳 Дендролог (Dendrologist)',
        skill: 'survival',
        skillName: 'Выживание',
        lore: 'Знание (план Дерева)',
        boosts: ['int', 'wis'],
        feat: 'Знаток Местности',
        source: 'Ярость стихий'
    },
    {
        id: 'bg_saboteur',
        name: '💣 Диверсант (Saboteur)',
        skill: 'thievery',
        skillName: 'Воровство',
        lore: 'Знание (инженерное дело)',
        boosts: ['str', 'dex'],
        feat: 'Скрывающая уловка',
        source: 'Основная книга игрока 2'
    },
    {
        id: 'bg_feral_child',
        name: '🐺 Дикое дитя (Feral Child)',
        skill: 'nature', // Или Выживание (по умолчанию вешаем Природу)
        skillName: 'Природа / Выживание',
        lore: 'Знание (дикая местность)',
        boosts: ['str', 'dex'],
        feat: 'Собиратель',
        source: 'Основная книга игрока 2'
    },
    {
        id: 'bg_goldhand_arms_dealer',
        name: '💰 Дилер Золотой Руки (Goldhand Arms Dealer)',
        skill: 'diplomacy',
        skillName: 'Дипломатия',
        lore: 'Знание (торговля)',
        boosts: ['dex', 'cha'],
        feat: 'Групповое Впечатление',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_remittance_agent',
        name: '💼 Доверенный перевозчик (Remittance Agent)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание (рабочие специальности) / (наёмники)',
        boosts: ['con', 'int'],
        feat: 'Опытный профессионал',
        source: 'Тянь-Ша. Руководство по персонажам'
    },
    {
        id: 'bg_back_alley_doctor',
        name: '🩸 Доктор из подворотни (Back-Alley Doctor)',
        skill: 'medicine',
        skillName: 'Медицина',
        lore: 'Знание (преступный мир)',
        boosts: ['con', 'wis'],
        feat: 'Рискованная Операция',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_feybound',
        name: '🧚 Должник фей (Feybound)',
        skill: 'occultism',
        skillName: 'Оккультизм',
        lore: 'Знание (Феи)',
        boosts: ['dex', 'cha'],
        feat: 'Фейская благодать',
        source: 'Основная книга игрока 2'
    },
    {
        id: 'bg_tiffin_box_deliverer',
        name: '🍱 Доставщик еды (Tiffin Box Deliverer)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание (рабочие специальности)',
        boosts: ['dex', 'int'],
        feat: 'Бывалый',
        source: 'Тянь-Ша. Руководство по персонажам'
    },
    {
        id: 'bg_animal_whisperer',
        name: '🦊 Друг животных (Animal Whisperer)',
        skill: 'nature',
        skillName: 'Природа',
        lore: 'Знание местности животных',
        boosts: ['wis', 'cha'],
        feat: 'Дрессировка Животного',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_press_ganged',
        name: '⚓ Завербованный (Press-Ganged)',
        skill: 'athletics',
        skillName: 'Атлетика',
        lore: 'Знание (рабочие специальности)',
        boosts: ['str', 'con'],
        feat: 'Облачение В Броню',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_clockfighter',
        name: '🤖 Заводной гладиатор (Clockfighter)',
        skill: 'crafting',
        skillName: 'Ремесло',
        lore: 'Знание (Гладиаторы)',
        boosts: ['int', 'cha'],
        feat: 'Опытный Профессионал',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_prisoner',
        name: '⛓️ Заключённый (Prisoner)',
        skill: 'stealth',
        skillName: 'Скрытность',
        lore: 'Знание (преступный мир)',
        boosts: ['str', 'con'],
        feat: 'Опытный Контрабандист',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_star_athlete',
        name: '🏆 Звезда спорта (Star Athlete)',
        skill: 'athletics',
        skillName: 'Атлетика',
        lore: 'Знание (игры)',
        boosts: ['str', 'dex'],
        feat: 'Уверенность',
        source: 'Академии — соперницы'
    },
    {
        id: 'bg_farmhand',
        name: '🌾 Землепашец (Farmhand)',
        skill: 'athletics',
        skillName: 'Атлетика',
        lore: 'Знание (фермерство)',
        boosts: ['con', 'wis'],
        feat: 'Уверенность',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_banished_celestial',
        name: '😇 Изгнанный небожитель (Banished Celestial)',
        skill: 'religion',
        skillName: 'Религия',
        lore: 'Знание (небесные планы)',
        boosts: ['wis', 'cha'],
        feat: 'Небесная кара',
        source: 'Тянь-Ша. Руководство по персонажам'
    },
    {
        id: 'bg_quartermaster',
        name: '📦 Интендант (Quartermaster)',
        skill: 'intimidation',
        skillName: 'Запугивание',
        lore: 'Знание (закон)',
        boosts: ['int', 'cha'],
        feat: 'Устрашающий взгляд',
        source: 'Боевой клич!'
    },
    {
        id: 'bg_clockwork_researcher',
        name: '⚙️ Исследователь заводных механизмов (Clockwork Researcher)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание (инженерное дело)',
        boosts: ['dex', 'int'],
        feat: 'Вычислитель',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_concordance_researcher',
        name: '🌌 Исследователь конкорданса (Concordance Researcher)',
        skill: 'nature',
        skillName: 'Природа',
        lore: 'Знание планов',
        boosts: ['int', 'wis'],
        feat: 'Дополнительные знания',
        source: 'Ярость стихий'
    },
    {
        id: 'bg_cannoneer',
        name: '💥 Канонир (Cannoneer)',
        skill: 'athletics',
        skillName: 'Атлетика',
        lore: 'Знание (военное дело)',
        boosts: ['str', 'dex'],
        feat: 'Дюжий Носильщик',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_library_dweller',
        name: '📚 Книжный червь (Library Dweller)',
        skill: 'occultism',
        skillName: 'Оккультизм',
        lore: 'Знание (библиотека)',
        boosts: ['con', 'int'],
        feat: 'Дополнительные знания',
        source: 'Академии — соперницы'
    },
    {
        id: 'bg_outrider',
        name: '🏇 Конный разведчик (Outrider)',
        skill: 'nature',
        skillName: 'Природа',
        lore: 'Знание (равнины)',
        boosts: ['con', 'wis'],
        feat: 'Скоростной наездник',
        source: 'Основная книга игрока 2'
    },
    {
        id: 'bg_royalty',
        name: '👑 Королевская кровь (Royalty)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание (дворянство)',
        boosts: ['int', 'cha'],
        feat: 'Изящные манеры',
        source: 'Основная книга игрока 2'
    },
    {
        id: 'bg_nomad',
        name: '⛺ Кочевник (Nomad)',
        skill: 'survival',
        skillName: 'Выживание',
        lore: 'Знание местности кочевий',
        boosts: ['con', 'wis'],
        feat: 'Уверенность',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_codebreaker',
        name: '🔐 Криптограф (Codebreaker)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание (Криптография)',
        boosts: ['int', 'wis'],
        feat: 'Перлюстрация',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_crystal_healer',
        name: '💎 Кристальный целитель (Crystal Healer)',
        skill: 'nature',
        skillName: 'Природа',
        lore: 'Знание (план Земли)',
        boosts: ['wis', 'cha'],
        feat: 'Природная Медицина',
        source: 'Ярость стихий'
    },
    {
        id: 'bg_cultist',
        name: '👁️ Культист (Cultist)',
        skill: 'occultism',
        skillName: 'Оккультизм',
        lore: 'Знание культа',
        boosts: ['int', 'cha'],
        feat: 'Посвященный В Тайны',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_merchant',
        name: '⚖️ Купец (Merchant)',
        skill: 'diplomacy',
        skillName: 'Дипломатия',
        lore: 'Знание (торговля)',
        boosts: ['int', 'cha'],
        feat: 'Перекупщик',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_battlefield_scrounger',
        name: '⚔️ Мародёр (Battlefield Scrounger)',
        skill: 'crafting',
        skillName: 'Ремесло',
        lore: 'Знание (военное дело)',
        boosts: ['str', 'int'],
        feat: 'Импровизированный инструмент',
        source: 'Боевой клич!'
    },
    {
        id: 'bg_toymaker',
        name: '🧸 Мастер игрушек (Toymaker)',
        skill: 'crafting',
        skillName: 'Ремесло',
        lore: 'Знание (торговля)',
        boosts: ['int', 'cha'],
        feat: 'Ремесленник-Специалист',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_medicinal_clocksmith',
        name: '🕦 Медик-часовщик (Medicinal Clocksmith)',
        skill: 'medicine',
        skillName: 'Медицина',
        lore: 'Знание (инженерное дело)',
        boosts: ['int', 'wis'],
        feat: 'Рискованная Операция',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_alloysmith',
        name: '🔨 Металлург (Alloysmith)',
        skill: 'crafting',
        skillName: 'Ремесло',
        lore: 'Знание (план Металла)',
        boosts: ['str', 'int'],
        feat: 'Ремесленник-Специалист',
        source: 'Ярость стихий'
    },
    {
        id: 'bg_mechanic_gg',
        name: '🛠️ Механик (Mechanic)',
        skill: 'crafting',
        skillName: 'Ремесло',
        lore: 'Знание (инженерное дело)',
        boosts: ['str', 'int'],
        feat: 'Быстрая Починка',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_tinker',
        name: '🔧 Механик (Tinker)',
        skill: 'crafting',
        skillName: 'Ремесло',
        lore: 'Знание (инженерное дело)',
        boosts: ['dex', 'int'],
        feat: 'Ремесленник-Специалист',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_mechanical_symbiosis',
        name: '🔌 Механический симбиоз (Mechanical Symbiosis)',
        skill: 'religion', // Или Оккультизм/Мистицизм, по умолчанию вешаем Религию
        skillName: 'Религия / Мистицизм',
        lore: 'Знание (механика)',
        boosts: ['int', 'wis'],
        feat: 'Опытный профессионал',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_otherworldly_mission',
        name: '🌌 Миссия из Иного Мира (Otherworldly Mission)',
        skill: 'religion',
        skillName: 'Религия',
        lore: 'Знание (иной мир)',
        boosts: ['wis', 'cha'],
        feat: 'Посвященный В Тайны',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_arcane_revolutionary',
        name: '🚩 Мистический революционер (Arcane Revolutionary)',
        skill: 'arcana',
        skillName: 'Мистицизм',
        lore: 'Знание поселения',
        boosts: ['dex', 'int'],
        feat: 'Быстрое опознание магии',
        source: 'Боевой клич!'
    },
    {
        id: 'bg_deep_sea_diver',
        name: '⚓ Морской ныряльщик (Deep-Sea Diver)',
        skill: 'athletics',
        skillName: 'Атлетика',
        lore: 'Знание (план Воды)',
        boosts: ['str', 'wis'],
        feat: 'Подводный Мародёр',
        source: 'Ярость стихий'
    },
    {
        id: 'bg_sailor',
        name: '⛵ Моряк (Sailor)',
        skill: 'athletics',
        skillName: 'Атлетика',
        lore: 'Знание (мореплавание)',
        boosts: ['str', 'dex'],
        feat: 'Подводный Мародёр',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_scavenger',
        name: '🏚️ Мусорщик (Scavenger)',
        skill: 'survival',
        skillName: 'Выживание',
        lore: 'Знание поселения мусорщиков',
        boosts: ['int', 'wis'],
        feat: 'Собиратель',
        source: 'Основная книга игрока 2'
    },
    {
        id: 'bg_junker',
        name: '⚙️ Мусорщик (Junker)',
        skill: 'athletics',
        skillName: 'Атлетика',
        lore: 'Знание местности сбора',
        boosts: ['str', 'wis'],
        feat: 'Дюжий Носильщик',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_spotter',
        name: '👁️ Наводчик (Spotter)',
        skill: 'stealth',
        skillName: 'Скрытность',
        lore: 'Знание (разведка)',
        boosts: ['dex', 'wis'],
        feat: 'Скрытность На Местности',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_hired_killer',
        name: '🩸 Наёмный убийца (Hired Killer)',
        skill: 'stealth',
        skillName: 'Скрытность',
        lore: 'Знание (криминальный мир)',
        boosts: ['str', 'dex'],
        feat: 'Скрытность На Местности',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_elementally_infused',
        name: '🌀 Наполненный стихиями (Elementally Infused)',
        skill: 'nature',
        skillName: 'Природа',
        lore: 'Знание стихийных планов',
        boosts: ['con', 'cha'],
        feat: 'Природная устойчивость',
        source: 'Ярость стихий'
    },
    {
        id: 'bg_sky_rider',
        name: '🦅 Небесный наездник (Sky Rider)',
        skill: 'acrobatics',
        skillName: 'Акробатика',
        lore: 'Знание (план Воздуха)',
        boosts: ['dex', 'wis'],
        feat: 'Кошачье Приземление',
        source: 'Ярость стихий'
    },
    {
        id: 'bg_tall_tale',
        name: '🤥 Небылица (Tall-Tale)',
        skill: 'performance',
        skillName: 'Исполнение',
        lore: 'Знание (фольклор)',
        boosts: ['con', 'cha'],
        feat: 'Впечатляющее Исполнение',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_ocean_diver',
        name: '🌊 Ныряльщик в океан (Ocean Diver)',
        skill: 'athletics',
        skillName: 'Атлетика',
        lore: 'Знание (океан)',
        boosts: ['con', 'wis'],
        feat: 'Подводный мародёр',
        source: 'Тянь-Ша. Руководство по персонажам'
    },
    {
        id: 'bg_warded_by_kami',
        name: '⛩️ Оберегаемый ками (Warded by Kami)',
        skill: 'occultism',
        skillName: 'Оккультизм',
        lore: 'Знание (духи)',
        boosts: ['int', 'wis'],
        feat: 'Духовный оберег',
        source: 'Тянь-Ша. Руководство по персонажам'
    },
    {
        id: 'bg_wished_alive',
        name: '✨ Оживленный желанием (Wished Alive)',
        skill: 'diplomacy',
        skillName: 'Дипломатия',
        lore: 'Знание (магия)',
        boosts: ['con', 'cha'],
        feat: 'Впечатляющее присутствие',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_circuit_judge',
        name: '⚖️ Окружной судья (Circuit Judge)',
        skill: 'deception',
        skillName: 'Обман',
        lore: 'Знание (Юриспруденция)',
        boosts: ['int', 'wis'],
        feat: 'Обманщик',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_gunsmith',
        name: '🔫 Оружейник (Gunsmith)',
        skill: 'crafting',
        skillName: 'Ремесло',
        lore: 'Знание (инженерное дело)',
        boosts: ['dex', 'int'],
        feat: 'Быстрая Починка',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_squire',
        name: '🛡️ Оруженосец (Squire)',
        skill: 'athletics',
        skillName: 'Атлетика',
        lore: 'Знание (военное дело) / (геральдика)',
        boosts: ['str', 'con'],
        feat: 'Облачение в броню',
        source: 'Основная книга игрока 2'
    },
    {
        id: 'bg_hermit',
        name: '🏚️ Отшельник (Hermit)',
        skill: 'nature', // Или Оккультизм (по умолчанию Природа)
        skillName: 'Природа / Оккультизм',
        lore: 'Знание местности',
        boosts: ['con', 'int'],
        feat: 'Сомнительные Знания',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_hunter',
        name: '🏹 Охотник (Hunter)',
        skill: 'survival',
        skillName: 'Выживание',
        lore: 'Знание (кожевенное дело)',
        boosts: ['dex', 'wis'],
        feat: 'Наблюдение За Дикой Природой',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_bounty_hunter',
        name: '⛓️ Охотник за головами (Bounty Hunter)',
        skill: 'survival',
        skillName: 'Выживание',
        lore: 'Знание (закон)',
        boosts: ['str', 'wis'],
        feat: 'Опытный Ловчий',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_eagle_hunter',
        name: '🦅 Охотник с орлом (Eagle Hunter)',
        skill: 'nature',
        skillName: 'Природа',
        lore: 'Знание (охота)',
        boosts: ['str', 'wis'],
        feat: 'Любимец / Дрессировка животного',
        source: 'Тянь-Ша. Руководство по персонажам'
    },
    {
        id: 'bg_pilgrim',
        name: '🧎 Паломник (Pilgrim)',
        skill: 'religion',
        skillName: 'Религия',
        lore: 'Знание божества',
        boosts: ['wis', 'cha'],
        feat: 'Бывалый странник',
        source: 'Основная книга игрока 2'
    },
    {
        id: 'bg_alkenstar_sojourner',
        name: '⚙️ Переехавший в Алькенстар (Alkenstar Sojourner)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание (инженерное дело)',
        boosts: ['int', 'cha'],
        feat: 'Бывалый',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_printer',
        name: '🖨️ Печатник (Printer)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание (каллиграфия)',
        boosts: ['int', 'cha'],
        feat: 'Обучение Языкам',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_ghostwriter',
        name: '🖋️ Писатель-призрак (Ghostwriter)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание (письмо)',
        boosts: ['dex', 'int'],
        feat: 'Опытный профессионал',
        source: 'Академии — соперницы'
    },
    {
        id: 'bg_planar_migrant',
        name: '🌀 Планарный скиталец (Planar Migrant)',
        skill: 'athletics',
        skillName: 'Атлетика',
        lore: 'Знание стихийного плана',
        boosts: ['dex', 'con'],
        feat: 'Адаптация планов',
        source: 'Ярость стихий'
    },
    {
        id: 'bg_cook',
        name: '🍳 Повар (Cook)',
        skill: 'survival',
        skillName: 'Выживание',
        lore: 'Знание (кулинария)',
        boosts: ['con', 'int'],
        feat: 'Опытный повар',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_insurgent',
        name: '🚩 Повстанец (Insurgent)',
        skill: 'deception',
        skillName: 'Обман',
        lore: 'Знание (военное дело)',
        boosts: ['str', 'wis'],
        feat: 'Длительное отвлечение',
        source: 'Основная книга игрока 2'
    },
    {
        id: 'bg_ward',
        name: '🎭 Подопечный (Ward)',
        skill: 'performance',
        skillName: 'Исполнение',
        lore: 'Знание (генеалогия)',
        boosts: ['con', 'cha'],
        feat: 'Завораживающее выступление',
        source: 'Основная книга игрока 2'
    },
    {
        id: 'bg_field_medic',
        name: '🩹 Полевой медик (Field Medic)',
        skill: 'medicine',
        skillName: 'Медицина',
        lore: 'Знание (военное дело)',
        boosts: ['con', 'wis'],
        feat: 'Медицина В Бою',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_deputy',
        name: '🤠 Помощник шерифа (Deputy)',
        skill: 'survival',
        skillName: 'Выживание',
        lore: 'Знание (охота)',
        boosts: ['dex', 'wis'],
        feat: 'Опытный Ловчий',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_emissary',
        name: '🤝 Посланник (Emissary)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание города',
        boosts: ['int', 'cha'],
        feat: 'Обучение Языкам',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_acolyte',
        name: '🙏 Послушник (Acolyte)',
        skill: 'religion',
        skillName: 'Религия',
        lore: 'Знание (каллиграфия)',
        boosts: ['int', 'wis'],
        feat: 'Знаток Канонов',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_courier',
        name: '✉️ Посыльный (Courier)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание города',
        boosts: ['dex', 'int'],
        feat: 'Перлюстрация',
        source: 'Основная книга игрока 2'
    },
    {
        id: 'bg_amnesiac',
        name: '🧠 Потерявший память (Amnesiac)',
        skill: 'lore',
        skillName: 'Знание (на выбор)',
        lore: 'Знание (на выбор)',
        boosts: ['con', 'wis'],
        feat: 'Вспышка воспоминаний',
        source: 'Основная книга игрока 2'
    },
    {
        id: 'bg_kaiju_stalker',
        name: '🦖 Преследователь кайдзю (Kaiju Stalker)',
        skill: 'athletics',
        skillName: 'Атлетика',
        lore: 'Знание (кайдзю)',
        boosts: ['str', 'dex'],
        feat: 'Охотничье чутье',
        source: 'Тянь-Ша. Руководство по персонажам'
    },
    {
        id: 'bg_hounded_thief',
        name: '🥷 Преследуемый вор (Hounded Thief)',
        skill: 'thievery',
        skillName: 'Воровство',
        lore: 'Знание (Преступный мир)',
        boosts: ['dex', 'wis'],
        feat: 'Карманник',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_criminal',
        name: '🕵️ Преступник (Criminal)',
        skill: 'stealth',
        skillName: 'Скрытность',
        lore: 'Знание (преступный мир)',
        boosts: ['dex', 'int'],
        feat: 'Опытный Контрабандист',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_conscript',
        name: '🪖 Призывник (Conscript)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание (военное дело)',
        boosts: ['str', 'con'],
        feat: 'Сомнительные знания',
        source: 'Боевой клич!'
    },
    {
        id: 'bg_streetfood_vendor',
        name: '🍜 Продавец уличной еды (Streetfood Vendor)',
        skill: 'crafting',
        skillName: 'Ремесло',
        lore: 'Знание (Готовка)',
        boosts: ['str', 'dex'],
        feat: 'Опытный повар',
        source: 'Тянь-Ша. Руководство по персонажам'
    },
    {
        id: 'bg_cursed',
        name: '💀 Проклятый (Cursed)',
        skill: 'occultism',
        skillName: 'Оккультизм',
        lore: 'Знание (Проклятие)',
        boosts: ['int', 'cha'],
        feat: 'Опознание странностей',
        source: 'Основная книга игрока 2'
    },
    {
        id: 'bg_professional_letter_writer',
        name: '✍️ Профессиональный писатель писем (Professional Letter Writer)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание (каллиграфия)',
        boosts: ['int', 'cha'],
        feat: 'Ремесленник-специалист / Обучение языкам',
        source: 'Тянь-Ша. Руководство по персонажам'
    },
    {
        id: 'bg_working_student',
        name: '🎒 Работающий студент (Working Student)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание (рабочие специальности)',
        boosts: ['str', 'int'],
        feat: 'Бывалый',
        source: 'Академии — соперницы'
    },
    {
        id: 'bg_bandit',
        name: '🥷 Разбойник (Bandit)',
        skill: 'intimidation',
        skillName: 'Запугивание',
        lore: 'Знание местности',
        boosts: ['dex', 'cha'],
        feat: 'Групповая Угроза',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_scout',
        name: '🏹 Разведчик (Scout)',
        skill: 'survival',
        skillName: 'Выживание',
        lore: 'Знание местности разведки',
        boosts: ['dex', 'wis'],
        feat: 'Собиратель',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_concordance_scout',
        name: '🌪️ Разведчик конкорданса (Concordance Scout)',
        skill: 'diplomacy',
        skillName: 'Дипломатия',
        lore: 'Знание (стихийный план)',
        boosts: ['con', 'cha'],
        feat: 'Неформальное Общение',
        source: 'Ярость стихий'
    },
    {
        id: 'bg_convocation_scout',
        name: '🦅 Разведчик Сбора (Convocation Scout)',
        skill: 'diplomacy',
        skillName: 'Дипломатия',
        lore: 'Знание (политика)',
        boosts: ['wis', 'cha'],
        feat: 'Групповое впечатление',
        source: 'Академии — соперницы'
    },
    {
        id: 'bg_laborer',
        name: '🪵 Разнорабочий (Laborer)',
        skill: 'athletics',
        skillName: 'Атлетика',
        lore: 'Знание (рабочие специальности)',
        boosts: ['str', 'con'],
        feat: 'Дюжий Носильщик',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_revenant',
        name: '💀 Ревенант (Revenant)',
        skill: 'religion',
        skillName: 'Религия',
        lore: 'Знание (Костяной Двор)',
        boosts: ['con', 'cha'],
        feat: 'Упорство смерти',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_artisan',
        name: '🔨 Ремесленник (Artisan)',
        skill: 'crafting',
        skillName: 'Ремесло',
        lore: 'Знание (гильдии)',
        boosts: ['str', 'int'],
        feat: 'Ремесленник-Специалист',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_miner',
        name: '⛏️ Рудокоп (Miner)',
        skill: 'survival',
        skillName: 'Выживание',
        lore: 'Знание (горное дело)',
        boosts: ['str', 'wis'],
        feat: 'Знаток Местности',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_tax_collector',
        name: '💰 Сборщик податей (Tax Collector)',
        skill: 'intimidation',
        skillName: 'Запугивание',
        lore: 'Знание поселения',
        boosts: ['str', 'cha'],
        feat: 'Быстрая угроза',
        source: 'Основная книга игрока 2'
    },
    {
        id: 'bg_zodiac_bound',
        name: '✨ Связанный с зодиаком (Zodiac Bound)',
        skill: 'occultism',
        skillName: 'Оккультизм',
        lore: 'Знание (астрология)',
        boosts: ['int', 'wis'],
        feat: 'Звездное благословение',
        source: 'Тянь-Ша. Руководство по персонажам'
    },
    {
        id: 'bg_war_orphan',
        name: '🏚️ Сирота войны (War Orphan)',
        skill: 'thievery',
        skillName: 'Воровство',
        lore: 'Знание (преступный мир)',
        boosts: ['dex', 'con'],
        feat: 'Грязный приём',
        source: 'Боевой клич!'
    },
    {
        id: 'bg_servant',
        name: '🧹 Слуга (Servant)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание (рабочие специальности)',
        boosts: ['dex', 'cha'],
        feat: 'Чтение по губам',
        source: 'Основная книга игрока 2'
    },
    {
        id: 'bg_root_worker',
        name: '🌱 Собиратель кореньев (Root Worker)',
        skill: 'occultism',
        skillName: 'Оккультизм',
        lore: 'Знание (травничество)',
        boosts: ['int', 'wis'],
        feat: 'Волшебные корешки',
        source: 'Основная книга игрока 2'
    },
    {
        id: 'bg_junk_collector',
        name: '⚙️ Собиратель хлама (Junk Collector)',
        skill: 'crafting',
        skillName: 'Ремесло',
        lore: 'Знание (инженерное дело) / (горное дело)',
        boosts: ['dex', 'int'],
        feat: 'Ремесленная Оценка',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_saved_by_clockwork',
        name: '🦾 Спасенный механизмом (Saved by Clockwork)',
        skill: 'crafting',
        skillName: 'Ремесло',
        lore: 'Знание (инженерное дело)',
        boosts: ['str', 'int'],
        feat: 'Быстрая починка',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_gossip',
        name: '🗣️ Сплетник (Gossip)',
        skill: 'diplomacy',
        skillName: 'Дипломатия',
        lore: 'Знание (по выбору)',
        boosts: ['int', 'cha'],
        feat: 'Неформальное общение',
        source: 'Тянь-Ша. Руководство по персонажам'
    },
    {
        id: 'bg_guard',
        name: '🛡️ Стражник (Guard)',
        skill: 'intimidation',
        skillName: 'Запугивание',
        lore: 'Знание (Военное дело) / (закон)',
        boosts: ['str', 'cha'],
        feat: 'Быстрая Угроза',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_fire_warden',
        name: '🔥 Страж огня (Fire Warden)',
        skill: 'athletics',
        skillName: 'Атлетика',
        lore: 'Знание (план Огня)',
        boosts: ['str', 'con'],
        feat: 'Контроль Дыхания',
        source: 'Ярость стихий'
    },
    {
        id: 'bg_traveling_gourmand',
        name: '🍲 Странствующий гурман (Traveling Gourmand)',
        skill: 'survival',
        skillName: 'Выживание',
        lore: 'Знание (кулинария)',
        boosts: ['dex', 'int'],
        feat: 'Собиратель',
        source: 'Тянь-Ша. Руководство по персонажам'
    },
    {
        id: 'bg_wandering_preacher',
        name: '⛪ Странствующий проповедник (Wandering Preacher)',
        skill: 'religion',
        skillName: 'Религия',
        lore: 'Знание божества',
        boosts: ['con', 'wis'],
        feat: 'Знак паломника',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_fated_rival',
        name: '⚔️ Судьбоносный соперник (Fated Rival)',
        skill: 'intimidation',
        skillName: 'Запугивание',
        lore: 'Знание (история)',
        boosts: ['str', 'wis'],
        feat: 'Крепкий орешек',
        source: 'Тянь-Ша. Руководство по персонажам'
    },
    {
        id: 'bg_bookkeeper',
        name: '📊 Счетовод (Bookkeeper)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание (счетоводство)',
        boosts: ['int', 'wis'],
        feat: 'Вычислитель',
        source: 'Основная книга игрока 2'
    },
    {
        id: 'bg_detective',
        name: '🕵️ Сыщик (Detective)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание (преступный мир)',
        boosts: ['int', 'wis'],
        feat: 'Бывалый',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_haunted',
        name: '👻 Терзаемый призраками (Haunted)',
        skill: 'occultism',
        skillName: 'Оккультизм',
        lore: 'Знание (духи)',
        boosts: ['wis', 'cha'],
        feat: 'Крепкий орешек',
        source: 'Основная книга игрока 2'
    },
    {
        id: 'bg_tech_reliant',
        name: '🛠️ Технозависимый (Tech-Reliant)',
        skill: 'crafting', // Или Медицина
        skillName: 'Ремесло / Медицина',
        lore: 'Знание (инженерное дело)',
        boosts: ['con', 'int'],
        feat: 'Ремесленник-специалист',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_weaver',
        name: '🕸️ Ткач (Weaver)',
        skill: 'crafting',
        skillName: 'Ремесло',
        lore: 'Знание (текстиль)',
        boosts: ['dex', 'wis'],
        feat: 'Ремесленник-специалист',
        source: 'Тянь-Ша. Руководство по персонажам'
    },
    {
        id: 'bg_herbalist',
        name: '🌿 Травник (Herbalist)',
        skill: 'nature',
        skillName: 'Природа',
        lore: 'Знание (trawnichestwo)',
        boosts: ['con', 'wis'],
        feat: 'Природная Медицина',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_barkeep',
        name: '🍺 Трактирщик (Barkeep)',
        skill: 'diplomacy',
        skillName: 'Дипломатия',
        lore: 'Знание (алкоголь)',
        boosts: ['con', 'cha'],
        feat: 'Неформальное Общение',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_respected_mentor',
        name: '🎓 Уважаемый наставник (Respected Mentor)',
        skill: 'performance',
        skillName: 'Исполнение',
        lore: 'Знание (академия)',
        boosts: ['wis', 'cha'],
        feat: 'Завораживающее выступление',
        source: 'Академии — соперницы'
    },
    {
        id: 'bg_scholar',
        name: '🎓 Учёный (Scholar)',
        skill: 'arcana', // По умолчанию подвязываем на Аркану
        skillName: 'Мистицизм / Религия / Оккультизм / Природа',
        lore: 'Знание (Академические науки)',
        boosts: ['int', 'wis'],
        feat: 'Уверенность',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_party_scholar',
        name: '🥳 Учёный-балагур (Party Scholar)',
        skill: 'deception',
        skillName: 'Обман',
        lore: 'Знание (алкоголь)',
        boosts: ['con', 'cha'],
        feat: 'Обаятельный лжец',
        source: 'Академии — соперницы'
    },
    {
        id: 'bg_teacher',
        name: '🧑‍🏫 Учитель (Teacher)',
        skill: 'society',
        skillName: 'Общество / Исполнение',
        lore: 'Знание (академические науки)',
        boosts: ['int', 'wis'],
        feat: 'Опытный Профессионал',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_favored',
        name: '✨ Фаворит (Favored)',
        skill: 'diplomacy',
        skillName: 'Дипломатия',
        lore: 'Знание (политика)',
        boosts: ['int', 'cha'],
        feat: 'Упоминание имени',
        source: 'Тянь-Ша. Руководство по персонажам'
    },
    {
        id: 'bg_farmsteader',
        name: '🚜 Фермер (Farmsteader)',
        skill: 'survival',
        skillName: 'Выживание',
        lore: 'Знание (земледелие)',
        boosts: ['con', 'wis'],
        feat: 'Собиратель',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_artist',
        name: '🎨 Художник (Artist)',
        skill: 'crafting',
        skillName: 'Ремесло',
        lore: 'Знание (искусство)',
        boosts: ['lox', 'cha'],
        feat: 'Ремесленник-Специалист',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_barber',
        name: '💈 Цирюльник (Barber)',
        skill: 'medicine',
        skillName: 'Медицина',
        lore: 'Знание (хирургия)',
        boosts: ['dex', 'wis'],
        feat: 'Рискованная операция',
        source: 'Основная книга игрока 2'
    },
    {
        id: 'bg_plague_doctor',
        name: '🎭 Чумной доктор (Plague Doctor)',
        skill: 'medicine',
        skillName: 'Медицина',
        lore: 'Знание (травничество)',
        boosts: ['con', 'wis'],
        feat: 'Прививка',
        source: 'Боевой клич!'
    },
    {
        id: 'bg_charlatan',
        name: '🃏 Шарлатан (Charlatan)',
        skill: 'deception',
        skillName: 'Обман',
        lore: 'Знание (преступный мир)',
        boosts: ['int', 'cha'],
        feat: 'Обаятельный Лжец',
        source: 'Основная книга игрока'
    },
    {
        id: 'bg_silk_farmer',
        name: '🐛 Шелковод (Silk Farmer)',
        skill: 'crafting',
        skillName: 'Ремесло',
        lore: 'Знание (шелководство)',
        boosts: ['int', 'wis'],
        feat: 'Ремесленник-специалист',
        source: 'Тянь-Ша. Руководство по персонажам'
    },
    {
        id: 'bg_sheriff',
        name: '🤠 Шериф (Sheriff)',
        skill: 'intimidation',
        skillName: 'Запугивание',
        lore: 'Знание (охота)',
        boosts: ['dex', 'cha'],
        feat: 'Групповая Угроза',
        source: 'Пушки и шестерни'
    },
    {
        id: 'bg_school_medic',
        name: '🏥 Школьный медик (School Medic)',
        skill: 'medicine',
        skillName: 'Медицина',
        lore: 'Знание (академия)',
        boosts: ['dex', 'wis'],
        feat: 'Медицина в бою',
        source: 'Академии — соперницы'
    },
    {
        id: 'bg_jeweler',
        name: '💎 Ювелир (Jeweler)',
        skill: 'crafting',
        skillName: 'Ремесло',
        lore: 'Знание (самоцветы)',
        boosts: ['int', 'wis'],
        feat: 'Ремесленная оценка',
        source: 'Тянь-Ша. Руководство по персонажам'
    },
    {
        id: 'bg_starless_one',
        name: '🌑 Беззвездный (Starless One)',
        skill: 'occultism',
        skillName: 'Оккультизм',
        lore: 'Знание (астрология)',
        boosts: ['wis', 'cha'],
        feat: 'Стойкость тьмы',
        source: 'Путеводитель'
    },
    {
        id: 'bg_doomcaller',
        name: '👁️ Глашатай рока (Doomcaller)',
        skill: 'occultism',
        skillName: 'Оккультизм',
        lore: 'Знание (звёзды)',
        boosts: ['int', 'wis'],
        feat: 'Зловещее предзнаменование',
        source: 'Путеводитель'
    },
    {
        id: 'bg_astrological_augur',
        name: '🌌 Звездный предсказатель (Astrological Augur)',
        skill: 'occultism',
        skillName: 'Оккультизм',
        lore: 'Знание (астрология)',
        boosts: ['wis', 'cha'],
        feat: 'Прорицание судьбы',
        source: 'Путеводитель'
    },
    {
        id: 'bg_tide_watcher',
        name: '🌊 Наблюдатель приливов (Tide Watcher)',
        skill: 'nature',
        skillName: 'Природа',
        lore: 'Знание (океан)',
        boosts: ['int', 'cha'],
        feat: 'Подводный мародёр',
        source: 'Путеводитель'
    },
    {
        id: 'bg_sign_bound',
        name: '✨ Отмеченный Созвездием (Sign Bound)',
        skill: 'occultism',
        skillName: 'Оккультизм',
        lore: 'Знание (астрология)',
        boosts: ['int', 'wis'],
        feat: 'Судьбоносный знак',
        source: 'Путеводитель'
    },
    {
        id: 'bg_nocturnal_navigator',
        name: '🧭 Проводник во тьме (Nocturnal Navigator)',
        skill: 'survival',
        skillName: 'Выживание',
        lore: 'Знание (навигация)',
        boosts: ['dex', 'wis'],
        feat: 'Проводник',
        source: 'Путеводитель'
    },
    {
        id: 'bg_eclipseborn',
        name: '🌒 Рожденный в затмении (Eclipseborn)',
        skill: 'occultism',
        skillName: 'Оккультизм',
        lore: 'Знание (затмение)',
        boosts: ['con', 'cha'],
        feat: 'Стойкость тени',
        source: 'Путеводитель'
    },
    {
        id: 'bg_sun_dancer',
        name: '☀️ Танцующий с солнцем (Sun Dancer)',
        skill: 'performance',
        skillName: 'Исполнение',
        lore: 'Знание (ритуалы солнца)',
        boosts: ['dex', 'cha'],
        feat: 'Завораживающее выступление',
        source: 'Путеводитель'
    }
];

// Экспортируемая вспомогательная функция поиска по каталогу происхождений
export function searchBackgroundsCatalog(query) {
    const q = String(query || '').trim().toLowerCase().replace(/ё/g, 'е');
    if (!q) return [];
    return PF2E_BACKGROUNDS.filter(b => b.name.toLowerCase().replace(/ё/g, 'е').includes(q));
}
