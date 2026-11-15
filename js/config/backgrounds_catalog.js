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
    },
    {
        id: 'bg_belkzen_anthropologist',
        name: '🧌 Белкзенский этнограф (Belkzen Anthropologist)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание (пантеон орков)',
        boosts: ['dex', 'int'],
        feat: 'Дополнительные знания',
        source: 'Триумф бивня. Руководство игрока'
    },
    {
        id: 'bg_foreign_diplomat',
        name: '🤝 Дипломат-чужеземец (Foreign Diplomat)',
        skill: 'diplomacy',
        skillName: 'Дипломатия',
        lore: 'Знание (геральдика)',
        boosts: ['con', 'cha'],
        feat: 'Групповое впечатление',
        source: 'Триумф бивня. Руководство игрока'
    },
    {
        id: 'bg_badlands_scout',
        name: '⛰️ Знаток пустоши (Badlands Scout)',
        skill: 'survival',
        skillName: 'Выживание',
        lore: 'Знание (пустоши)',
        boosts: ['con', 'wis'],
        feat: 'Собиратель',
        source: 'Триумф бивня. Руководство игрока'
    },
    {
        id: 'bg_self_made',
        name: '✊ Сам себе голова (Self-Made)',
        skill: 'athletics',
        skillName: 'Атлетика',
        lore: 'Знание (профессия)',
        boosts: ['str', 'wis'],
        feat: 'Дюжий носильщик',
        source: 'Триумф бивня. Руководство игрока'
    },
    {
        id: 'bg_empty_hand_loyalist',
        name: '🫱 Сторонник пустой руки (Empty Hand Loyalist)',
        skill: 'intimidation',
        skillName: 'Запугивание',
        lore: 'Знание (Белкзен)',
        boosts: ['str', 'cha'],
        feat: 'Быстрая угроза',
        source: 'Триумф бивня. Руководство игрока'
    },
    {
        id: 'bg_trade_representative',
        name: '💼 Торговый представитель (Trade Representative)',
        skill: 'crafting',
        skillName: 'Ремесло',
        lore: 'Знание (торговля)',
        boosts: ['dex', 'int'],
        feat: 'Быстрая починка',
        source: 'Триумф бивня. Руководство игрока'
    },
    {
        id: 'bg_refugee_fop',
        name: '🏃 Беглец (Refugee - FoP)',
        skill: 'survival',
        skillName: 'Выживание',
        lore: 'Знание (охота)',
        boosts: ['con', 'wis'],
        feat: 'Собиратель',
        source: 'Падение чумного камня'
    },
    {
        id: 'bg_bibliophile',
        name: '📚 Библиофил (Bibliophile)',
        skill: 'arcana',
        skillName: 'Мистицизм',
        lore: 'Знание (библиотеки)',
        boosts: ['int', 'cha'],
        feat: 'Мистическое Чутьё',
        source: 'Зловещие катакомбы'
    },
    {
        id: 'bg_brevic_noble',
        name: '🏰 Благородный из бревоя (Brevic Noble)',
        skill: 'crafting',
        skillName: 'Ремесло',
        lore: 'Знание (архитектура)',
        boosts: ['con', 'wis'],
        feat: 'Ремесленник-специалист',
        source: 'Серия приключений Kingmaker'
    },
    {
        id: 'bg_brevic_outcast',
        name: '🏹 Бревойский изгой (Brevic Outcast)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание (политика)',
        boosts: ['con', 'cha'],
        feat: 'Горделивое Упрямство',
        source: 'Серия приключений Kingmaker'
    },
    {
        id: 'bg_teamster',
        name: '🐎 Возница (Teamster)',
        skill: 'nature',
        skillName: 'Природа',
        lore: 'Знание (торговля)',
        boosts: ['str', 'wis'],
        feat: 'Дрессировка Животного',
        source: 'Падение чумного камня'
    },
    {
        id: 'bg_fogfen_tale_teller',
        name: '🐊 Выдумщик с болота (Fogfen Tale-Teller)',
        skill: 'athletics',
        skillName: 'Атлетика',
        lore: 'Знание (болота)',
        boosts: ['str', 'cha'],
        feat: 'Борец С Титанами',
        source: 'Зловещие катакомбы'
    },
    {
        id: 'bg_friendly_darkmoon_kobold',
        name: '🦎 Дружелюбный кобольд (Friendly Darkmoon Kobold)',
        skill: 'diplomacy',
        skillName: 'Дипломатия',
        lore: 'Знание (кобольды)',
        boosts: ['wis', 'cha'],
        feat: 'Групповое Впечатление',
        source: 'Корона короля кобольдов'
    },
    {
        id: 'bg_starwatcher',
        name: '🌌 Звездочёт (Starwatcher)',
        skill: 'occultism',
        skillName: 'Оккультизм',
        lore: 'Знание (астрология)',
        boosts: ['con', 'int'],
        feat: 'Сомнительные Знания',
        source: 'Зловещие катакомбы'
    },
    {
        id: 'bg_eldritch_anatomist',
        name: '🧬 Зловещий препаратор (Eldritch Anatomist)',
        skill: 'medicine',
        skillName: 'Медицина',
        lore: 'Знание (искажённые)',
        boosts: ['int', 'wis'],
        feat: 'Уверенность',
        source: 'Зловещие катакомбы'
    },
    {
        id: 'bg_witchlight_follower',
        name: '🕯️ Искатель ведьмовских огней (Witchlight Follower)',
        skill: 'survival',
        skillName: 'Выживание',
        lore: 'Знание (огоньки)',
        boosts: ['dex', 'wis'],
        feat: 'Знаток Местности',
        source: 'Зловещие катакомбы'
    },
    {
        id: 'bg_issian_patriot',
        name: '🛡️ Иссийский патриот (Issian Patriot)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание (закон)',
        boosts: ['dex', 'int'],
        feat: 'Бывалый',
        source: 'Серия приключений Kingmaker'
    },
    {
        id: 'bg_ruin_delver',
        name: '🧗 Исследователь руин (Ruin Delver)',
        skill: 'acrobatics',
        skillName: 'Акробатика',
        lore: 'Знание (Стражи Розы)',
        boosts: ['dex', 'int'],
        feat: 'Кошачье Приземление',
        source: 'Зловещие катакомбы'
    },
    {
        id: 'bg_hookclaw_digger',
        name: '⛏️ Копатель Кривых Когтей (Hookclaw Digger)',
        skill: 'crafting',
        skillName: 'Ремесло',
        lore: 'Знание (горное дело / инженерное дело)',
        boosts: ['str', 'cha'],
        feat: 'Импровизированный Инструмент',
        source: 'Маленький переполох в большом Авессаломе'
    },
    {
        id: 'bg_local_brigand',
        name: '🥷 Местный разбойник (Local Brigand)',
        skill: 'intimidation',
        skillName: 'Запугивание',
        lore: 'Знание (разбой)',
        boosts: ['str', 'con'],
        feat: 'Групповая Угроза',
        source: 'Серия приключений Kingmaker'
    },
    {
        id: 'bg_missionary',
        name: '⛪ Миссионер (Missionary)',
        skill: 'diplomacy',
        skillName: 'Дипломатия',
        lore: 'Знание (каллиграфия)',
        boosts: ['con', 'wis'],
        feat: 'Групповое Впечатление',
        source: 'Падение чумного камня'
    },
    {
        id: 'bg_lesser_scion',
        name: '📜 Младший наследник (Lesser Scion)',
        skill: 'diplomacy',
        skillName: 'Дипломатия',
        lore: 'Знание (геральдика)',
        boosts: ['dex', 'int'],
        feat: 'Неформальное Общение',
        source: 'Падение чумного камня'
    },
    {
        id: 'bg_sword_scion',
        name: '⚔️ Наследник клинка (Sword Scion)',
        skill: 'athletics',
        skillName: 'Атлетика',
        lore: 'Знание (военное дело)',
        boosts: ['dex', 'cha'],
        feat: 'Ремесленник-специалист',
        source: 'Серия приключений Kingmaker'
    },
    {
        id: 'bg_borderlands_pioneer',
        name: '🌲 Первопроходец пограничья (Borderlands Pioneer)',
        skill: 'nature',
        skillName: 'Природа',
        lore: 'Знание дикой местности',
        boosts: ['str', 'wis'],
        feat: 'Дрессировка Животного',
        source: 'Серия приключений Kingmaker'
    },
    {
        id: 'bg_lost_and_alone',
        name: '🏚️ Потерянный и одинокий (Lost and Alone)',
        skill: 'intimidation',
        skillName: 'Запугивание',
        lore: 'Знание (военное дело)',
        boosts: ['str', 'cha'],
        feat: 'Устрашающий Взгляд',
        source: 'Падение чумного камня'
    },
    {
        id: 'bg_rostlander',
        name: '🚜 Ростландец (Rostlander)',
        skill: 'athletics',
        skillName: 'Атлетика',
        lore: 'Знание (фермерство)',
        boosts: ['str', 'con'],
        feat: 'Дюжий Носильщик',
        source: 'Серия приключений Kingmaker'
    },
    {
        id: 'bg_market_runner',
        name: '✉️ Рыночный посыльный (Market Runner)',
        skill: 'diplomacy',
        skillName: 'Дипломатия',
        lore: 'Знание (Отари)',
        boosts: ['con', 'cha'],
        feat: 'Неформальное Общение',
        source: 'Зловещие катакомбы'
    },
    {
        id: 'bg_bellflower_agent',
        name: '🌹 Агент Колокольчика (Bellflower Agent)',
        skill: 'stealth',
        skillName: 'Скрытность',
        lore: 'Знание (преступный мир)',
        boosts: ['dex', 'cha'],
        feat: 'Опытный Контрабандист',
        source: 'Путеводитель по миру • Старая Челия'
    },
    {
        id: 'bg_magaambya_academic',
        name: '📜 Академик Магаамбии (Magaambya Academic)',
        skill: 'nature', // Или Мистицизм (по умолчанию вешаем Природу)
        skillName: 'Природа / Мистицизм',
        lore: 'Знание (академические науки)',
        boosts: ['int', 'cha'],
        feat: 'Опознание Заклинания',
        source: 'Путеводитель по миру • Просторы Мванги'
    },
    {
        id: 'bg_alkenstar_tinker',
        name: '⚙️ Алькенстарский механик (Alkenstar Tinker)',
        skill: 'crafting',
        skillName: 'Ремесло',
        lore: 'Знание (инженерия)',
        boosts: ['dex', 'int'],
        feat: 'Алхимическое Ремесло',
        source: 'Путеводитель по миру • Невозможные земли'
    },
    {
        id: 'bg_atteran_rancher',
        name: '🐎 Аттеранский коневод (Atteran Rancher)',
        skill: 'nature',
        skillName: 'Природа',
        lore: 'Знание (животные)',
        boosts: ['str', 'dex'],
        feat: 'Дрессировка Животного',
        source: 'Путеводитель по миру • Старая Челия'
    },
    {
        id: 'bg_mana_wastes_refugee',
        name: '🌪️ Беженец из Пустошей Маны (Mana Wastes Refugee)',
        skill: 'arcana',
        skillName: 'Мистицизм',
        lore: 'Знание (дикая природа)',
        boosts: ['con', 'int'],
        feat: 'Обман Магического Предмета',
        source: 'Путеводитель по миру • Невозможные земли'
    },
    {
        id: 'bg_bekyar_restorer',
        name: '👺 Бекьярский восстановитель (Bekyar Restorer)',
        skill: 'diplomacy',
        skillName: 'Дипломатия',
        lore: 'Знание (Бездна)',
        boosts: ['wis', 'cha'],
        feat: 'Групповое Впечатление',
        source: 'Путеводитель по миру • Просторы Мванги'
    },
    {
        id: 'bg_geb_crusader',
        name: '🛡️ Борец с Гебом (Geb Crusader)',
        skill: 'religion',
        skillName: 'Религия',
        lore: 'Знание (нежить)',
        boosts: ['con', 'wis'],
        feat: 'Знаток Канонов',
        source: 'Путеводитель по миру • Невозможные земли'
    },
    {
        id: 'bg_grand_council_bureaucrat',
        name: '🏛️ Бюрократ Большого совета (Grand Council Bureaucrat)',
        skill: 'diplomacy',
        skillName: 'Дипломатия',
        lore: 'Знание (правительство)',
        boosts: ['int', 'cha'],
        feat: 'Групповое Впечатление',
        source: 'Путеводитель по миру • Авессалом'
    },
    {
        id: 'bg_varisian_wanderer',
        name: '⛺ Варисийский Скиталец (Varisian Wanderer)',
        skill: 'performance',
        skillName: 'Исполнение',
        lore: 'Знание (цирк)',
        boosts: ['dex', 'cha'],
        feat: 'Завораживающее Выступление',
        source: 'Путеводитель по миру • Земли Сказаний'
    },
    {
        id: 'bg_razmiran_faithful',
        name: '🎭 Верующий Размирана (Razmiran Faithful)',
        skill: 'intimidation',
        skillName: 'Запугивание',
        lore: 'Знание (Размир)',
        boosts: ['str', 'cha'],
        feat: 'Групповая Угроза',
        source: 'Путеводитель по миру • Расколотые земли'
    },
    {
        id: 'bg_vidrian_reformer',
        name: '🤝 Видрианский реформатор (Vidrian Reformer)',
        skill: 'diplomacy',
        skillName: 'Дипломатия',
        lore: 'Знание (политика)',
        boosts: ['dex', 'cha'],
        feat: 'Неформальное Общение',
        source: 'Путеводитель по миру • Просторы Мванги'
    },
    {
        id: 'bg_sarkorian_reclaimer',
        name: '⚔️ Восстановитель Саркориса (Sarkorian Reclaimer)',
        skill: 'medicine',
        skillName: 'Медицина',
        lore: 'Знание (Бездна)',
        boosts: ['con', 'wis'],
        feat: 'Медицина В Бою',
        source: 'Путеводитель по миру • Расколотые земли'
    },
    {
        id: 'bg_lastwall_survivor',
        name: '🛡️ Выживший Последнего Оплота (Lastwall Survivor)',
        skill: 'medicine',
        skillName: 'Медицина',
        lore: 'Знание (нежить)',
        boosts: ['con', 'wis'],
        feat: 'Медицина В Бою',
        source: 'Путеводитель по миру • Око Ужаса'
    },
    {
        id: 'bg_sarkorian_survivor',
        name: '⛺ Выживший Саркориса (Sarkorian Survivor)',
        skill: 'survival',
        skillName: 'Выживание',
        lore: 'Знание (история Саркориса)',
        boosts: ['str', 'con'],
        feat: 'Собиратель',
        source: 'Путеводитель по миру • Расколотые земли'
    },
    {
        id: 'bg_mammoth_speaker',
        name: '🦣 Говорящий с мамонтами (Mammoth Speaker)',
        skill: 'nature',
        skillName: 'Природа',
        lore: 'Знание (животные)',
        boosts: ['con', 'wis'],
        feat: 'Дрессировка Животного',
        source: 'Путеводитель по миру • Земли Сказаний'
    },
    {
        id: 'bg_wonder_taster',
        name: '🧪 Дегустатор Чудес (Wonder Taster)',
        skill: 'crafting',
        skillName: 'Ремесло',
        lore: 'Знание (алхимия)',
        boosts: ['con', 'int'],
        feat: 'Алхимическое Ремесло',
        source: 'Путеводитель по миру • Расколотые земли'
    },
    {
        id: 'bg_diobel_pearl_diver',
        name: '⚓ Диобельский ловец жемчуга (Diobel Pearl Diver)',
        skill: 'athletics',
        skillName: 'Атлетика',
        lore: 'Знание (океан)',
        boosts: ['dex', 'con'],
        feat: 'Подводный Мародёр',
        source: 'Путеводитель по миру • Авессалом'
    },
    {
        id: 'bg_child_of_westcrown',
        name: '🏰 Дитя Весткрауна (Child of Westcrown)',
        skill: 'diplomacy',
        skillName: 'Дипломатия',
        lore: 'Знание (Весткраун)',
        boosts: ['str', 'cha'],
        feat: 'Групповое Впечатление',
        source: 'Путеводитель по миру • Старая Челия'
    },
    {
        id: 'bg_winters_child',
        name: '❄️ Дитя зимы (Winter\'s Child)',
        skill: 'arcana',
        skillName: 'Мистицизм',
        lore: 'Знание (погода)',
        boosts: ['con', 'cha'],
        feat: 'Мистическое Чутьё',
        source: 'Путеводитель по миру • Земли Сказаний'
    },
    {
        id: 'bg_child_of_the_puddles',
        name: '🏚️ Дитя Луж (Child of the Puddles)',
        skill: 'acrobatics',
        skillName: 'Акробатика',
        lore: 'Знание (Авессалом)',
        boosts: ['ash', 'dex'],
        feat: 'Устойчивое Равновесие',
        source: 'Путеводитель по миру • Авессалом'
    },
    {
        id: 'bg_quick',
        name: '🏃 Живчик (Quick)',
        skill: 'deception',
        skillName: 'Обман',
        lore: 'Знание (нежить)',
        boosts: ['con', 'cha'],
        feat: 'Обаятельный Лжец',
        source: 'Путеводитель по миру • Невозможные земли'
    },
    {
        id: 'bg_hermean_expatriate',
        name: '🐉 Изгнанный из Эрмеи (Hermean Expatriate)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание (драконы)',
        boosts: ['int', 'cha'],
        feat: 'Обучение Навыку',
        source: 'Путеводитель по миру • Морские Просторы'
    },
    {
        id: 'bg_issian_partisan_lowg',
        name: '🕵️ Иссийский партизан (Issian Partisan)',
        skill: 'deception',
        skillName: 'Обман',
        lore: 'Знание (преступный мир)',
        boosts: ['int', 'cha'],
        feat: 'Обаятельный Лжец',
        source: 'Путеводитель по миру • Расколотые земли'
    },
    {
        id: 'bg_scholar_of_the_ancients',
        name: '📚 Исследователь древних (Scholar of the Ancients)',
        skill: 'arcana',
        skillName: 'Мистицизм',
        lore: 'Знание (Ацлант)',
        boosts: ['int', 'cha'],
        feat: 'Быстрое Опознание Магии',
        source: 'Путеводитель по миру • Морские Просторы'
    },
    {
        id: 'bg_shory_seeker',
        name: '⚡ Исследователь Шори (Shory Seeker)',
        skill: 'crafting',
        skillName: 'Ремесло',
        lore: 'Знание (Шори)',
        boosts: ['dex', 'int'],
        feat: 'Ремесленник-Специалист',
        source: 'Путеводитель по миру • Просторы Мванги'
    },
    {
        id: 'bg_perfection_seeker',
        name: '🥋 Ищущий Совершенства (Perfection Seeker)',
        skill: 'acrobatics',
        skillName: 'Акробатика',
        lore: 'Знание (военное дело)',
        boosts: ['dex', 'wis'],
        feat: 'Кошачье Приземление',
        source: 'Путеводитель по миру • Невозможные земли'
    },
    {
        id: 'bg_black_market_smuggler',
        name: '⚖️ Контрабандист чёрного рынка (Black Market Smuggler)',
        skill: 'stealth',
        skillName: 'Скрытность',
        lore: 'Знание (преступный мир)',
        boosts: ['dex', 'cha'],
        feat: 'Опытный Контрабандист',
        source: 'Путеводитель по миру • Золотой путь'
    },
    {
        id: 'bg_thrune_loyalist',
        name: '😈 Лоялист Трун (Thrune Loyalist)',
        skill: 'religion',
        skillName: 'Религия',
        lore: 'Знание (Преисподняя)',
        boosts: ['int', 'cha'],
        feat: 'Знаток Канонов',
        source: 'Путеводитель по миру • Старая Челия'
    },
    {
        id: 'bg_undersea_enthusiast',
        name: '🌊 Любитель подводного мира (Undersea Enthusiast)',
        skill: 'athletics',
        skillName: 'Атлетика',
        lore: 'Знание (океан)',
        boosts: ['str', 'con'],
        feat: 'Подводный Мародёр',
        source: 'Путеводитель по миру • Морские Просторы'
    },
    {
        id: 'bg_merabite_prodigy',
        name: '⚗️ Мерабский талант (Merabite Prodigy)',
        skill: 'crafting',
        skillName: 'Ремесло',
        lore: 'Знание (алхимия)',
        boosts: ['dex', 'int'],
        feat: 'Ремесленник-Специалист',
        source: 'Путеводитель по миру • Золотой путь'
    },
    {
        id: 'bg_wildwood_local',
        name: '🌲 Местный из Диколесья (Wildwood Local)',
        skill: 'nature',
        skillName: 'Природа',
        lore: 'Знание (лес)',
        boosts: ['dex', 'wis'],
        feat: 'Природная Медицина',
        source: 'Путеводитель по миру • Сияющие Королевства'
    },
    {
        id: 'bg_aspiring_free_captain',
        name: '🏴‍☠️ Метящий в Вольные капитаны (Aspiring Free Captain)',
        skill: 'intimidation',
        skillName: 'Запугивание',
        lore: 'Знание (мореплавание)',
        boosts: ['wis', 'cha'],
        feat: 'Групповая Угроза',
        source: 'Путеводитель по миру • Морские Просторы'
    },
    {
        id: 'bg_secular_medic',
        name: '🩹 Мирской медик (Secular Medic)',
        skill: 'medicine',
        skillName: 'Медицина',
        lore: 'Знание (анатомия)',
        boosts: ['dex', 'wis'],
        feat: 'Медицина В Бою',
        source: 'Путеводитель по миру • Золотой путь'
    },
    {
        id: 'bg_nexian_mystic',
        name: '🔮 Мистик Некса (Nexian Mystic)',
        skill: 'arcana',
        skillName: 'Мистицизм',
        lore: 'Знание планов',
        boosts: ['int', 'wis'],
        feat: 'Мистическое Чутьё',
        source: 'Путеводитель по миру • Невозможные земли'
    },
    {
        id: 'bg_pathfinder_hopeful',
        name: '🧭 Многообразующий искатель (Pathfinder Hopeful)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание (Общество Искателей)',
        boosts: ['con', 'int'],
        feat: 'Дополнительные Знания',
        source: 'Путеводитель по миру • Авессалом'
    },
    {
        id: 'bg_molthuni_mercenary',
        name: '⚔️ Молтунский наемник (Molthuni Mercenary)',
        skill: 'athletics',
        skillName: 'Атлетика',
        lore: 'Знание (наёмничество)',
        boosts: ['str', 'con'],
        feat: 'Опытный Профессионал',
        source: 'Путеводитель по миру • Око Ужаса'
    },
    {
        id: 'bg_press_ganged_lowg',
        name: '⚓ Насильно завербованный (Press-Ganged)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание (мореплавание)',
        boosts: ['str', 'wis'],
        feat: 'Опытный Профессионал',
        source: 'Путеводитель по миру • Морские Просторы'
    },
    {
        id: 'bg_nirmathi_guerrilla',
        name: '🥷 Нирмафийский партизан (Nirmathi Guerrilla)',
        skill: 'stealth',
        skillName: 'Скрытность',
        lore: 'Знание (лес)',
        boosts: ['dex', 'wis'],
        feat: 'Скрытность На Местности',
        source: 'Путеводитель по миру • Око Ужаса'
    },
    {
        id: 'bg_shoanti_name_bearer',
        name: '🪓 Носитель имени Шоанти (Shoanti Name-Bearer)',
        skill: 'athletics',
        skillName: 'Атлетика',
        lore: 'Знание (куахи)',
        boosts: ['str', 'wis'],
        feat: 'Лазание В Бою',
        source: 'Путеводитель по миру • Земли Сказаний'
    },
    {
        id: 'bg_witch_wary',
        name: '🧙 Опасающийся ведьм (Witch Wary)',
        skill: 'occultism',
        skillName: 'Оккультизм',
        lore: 'Знание (проклятия)',
        boosts: ['dex', 'int'],
        feat: 'Опознание Странностей',
        source: 'Путеводитель по миру • Земли Сказаний'
    },
    {
        id: 'bg_freed_slave_of_absalom',
        name: '⛓️ Освобожденный раб из Авессалома (Freed Slave of Absalom)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание (Авессалом)',
        boosts: ['con', 'int'],
        feat: 'Бывалый',
        source: 'Путеводитель по миру • Авессалом'
    },
    {
        id: 'bg_osirionologist',
        name: '🏛️ Осирионолог (Osirionologist)',
        skill: 'occultism',
        skillName: 'Оккультизм',
        lore: 'Знание (Древний Осирион)',
        boosts: ['con', 'int'],
        feat: 'Опознание Странностей',
        source: 'Путеводитель по миру • Золотой путь'
    },
    {
        id: 'bg_bonuwat_wavetouched',
        name: '🌊 Отмеченный волной бонуват (Bonuwat Wavetouched)',
        skill: 'athletics',
        skillName: 'Атлетика',
        lore: 'Знание (океан)',
        boosts: ['str', 'wis'],
        feat: 'Подводный Мародёр',
        source: 'Путеводитель по миру • Просторы Мванги'
    },
    {
        id: 'bg_final_blade_survivor',
        name: '🪓 Переживший Универсальную бритву (Final Blade Survivor)',
        skill: 'deception',
        skillName: 'Обман',
        lore: 'Знание (революции)',
        boosts: ['wis', 'cha'],
        feat: 'Обаятельный Лжец',
        source: 'Путеводитель по миру • Сияющие Королевства'
    },
    {
        id: 'bg_storm_survivor',
        name: '⚡ Переживший Шторм (Storm Survivor)',
        skill: 'survival',
        skillName: 'Выживание',
        lore: 'Знание (погода)',
        boosts: ['str', 'wis'],
        feat: 'Собиратель',
        source: 'Путеводитель по миру • Морские Просторы'
    },
    {
        id: 'bg_trade_consortium_underling',
        name: '💼 Подчинённый консорциума (Trade Consortium Underling)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание (сделки)',
        boosts: ['int', 'wis'],
        feat: 'Опытный Профессионал',
        source: 'Путеводитель по миру • Авессалом'
    },
    {
        id: 'bg_kyonin_emissary',
        name: '🤝 Посланник Кионина (Kyonin Emissary)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание (политика)',
        boosts: ['int', 'cha'],
        feat: 'Обучение Языкам',
        source: 'Путеводитель по миру • Сияющие Королевства'
    },
    {
        id: 'bg_kalistrade_follower',
        name: '🪙 Последователь Калистрада (Kalistrade Follower)',
        skill: 'diplomacy',
        skillName: 'Дипломатия',
        lore: 'Знание (Калистрад)',
        boosts: ['int', 'id'],
        feat: 'Перекупщик',
        source: 'Путеводитель по миру • Сияющие Королевства'
    },
    {
        id: 'bg_rivethun_adherent',
        name: '🧠 Последователь Риветуна (Rivethun Adherent)',
        skill: 'occultism',
        skillName: 'Оккультизм',
        lore: 'Знание (Духи)',
        boosts: ['con', 'wis'],
        feat: 'Опознание Заклинания',
        source: 'Путеводитель по миру • Сияющие Королевства'
    },
    {
        id: 'bg_mantis_scion',
        name: '🩸 Потомок Богомола (Mantis Scion)',
        skill: 'stealth',
        skillName: 'Скрытность',
        lore: 'Знание (ассасины)',
        boosts: ['dex', 'wis'],
        feat: 'Уверенность',
        source: 'Путеводитель по миру • Морские Просторы'
    },
    {
        id: 'bg_whispering_way_scion',
        name: '🪦 Потомок Пути Шёпота (Whispering Way Scion)',
        skill: 'religion',
        skillName: 'Религия',
        lore: 'Знание (нежить)',
        boosts: ['int', 'wis'],
        feat: 'Знаток Канонов',
        source: 'Путеводитель по миру • Око Ужаса'
    },
    {
        id: 'bg_shadow_haunted',
        name: '👥 Преследуемый тенью (Shadow Haunted)',
        skill: 'intimidation',
        skillName: 'Запугивание',
        lore: 'Знание (Теневой план)',
        boosts: ['int', 'wis'],
        feat: 'Быстрая Угроза',
        source: 'Путеводитель по миру • Старая Челия'
    },
    {
        id: 'bg_aspiring_river_monarch',
        name: '👑 Претендент на речной престол (Aspiring River Monarch)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание (политика)',
        boosts: ['wis', 'cha'],
        feat: 'Изящные Манеры',
        source: 'Путеводитель по миру • Расколотые земли'
    },
    {
        id: 'bg_desert_tracker',
        name: '🌵 Проводник в пустыне (Desert Tracker)',
        skill: 'survival',
        skillName: 'Выживание',
        lore: 'Знание (пустыня)',
        boosts: ['con', 'wis'],
        feat: 'Опытный Ловчий',
        source: 'Путеводитель по миру • Золотой путь'
    },
    {
        id: 'bg_cursed_family',
        name: '💀 Проклятая семья (Cursed Family)',
        skill: 'occultism',
        skillName: 'Оккультизм',
        lore: 'Знание (проклятия)',
        boosts: ['int', 'cha'],
        feat: 'Опознание Странностей',
        source: 'Путеводитель по миру • Око Ужаса'
    },
    {
        id: 'bg_lumber_consortium_laborer',
        name: '🪓 Рабочий Консорциума Лесорубов (Lumber Consortium Laborer)',
        skill: 'athletics',
        skillName: 'Атлетика',
        lore: 'Знание (лес)',
        boosts: ['str', 'dex'],
        feat: 'Уверенность',
        source: 'Путеводитель по миру • Сияющие Королевства'
    },
    {
        id: 'bg_rostland_partisan',
        name: '🚩 Ростландский партизан (Rostland Partisan)',
        skill: 'diplomacy',
        skillName: 'Дипломатия',
        lore: 'Знание (политика)',
        boosts: ['con', 'cha'],
        feat: 'Групповое Впечатление',
        source: 'Путеводитель по миру • Расколотые земли'
    },
    {
        id: 'bg_senghor_sailor',
        name: '⛵ Сенгорский моряк (Senghor Sailor)',
        skill: 'crafting',
        skillName: 'Ремесло',
        lore: 'Знание (мореплавание)',
        boosts: ['int', 'wis'],
        feat: 'Быстрая Починка',
        source: 'Путеводитель по миру • Просторы Мванги'
    },
    {
        id: 'bg_goblinblood_orphan',
        name: '🏚️ Сирота Гоблинских войн (Goblinblood Orphan)',
        skill: 'survival',
        skillName: 'Выживание',
        lore: 'Знание (гоблины)',
        boosts: ['dex', 'con'],
        feat: 'Уверенность',
        source: 'Путеводитель по миру • Старая Челия'
    },
    {
        id: 'bg_sodden_scavenger',
        name: '🐊 Собиратель из Сырых земель (Sodden Scavenger)',
        skill: 'survival',
        skillName: 'Выживание',
        lore: 'Знание (болота)',
        boosts: ['con', 'wis'],
        feat: 'Собиратель',
        source: 'Путеводитель по миру • Просторы Мванги'
    },
    {
        id: 'bg_taldan_schemer',
        name: '🎭 Талдорский интриган (Taldan Schemer)',
        skill: 'diplomacy',
        skillName: 'Дипломатия',
        lore: 'Знание (политика)',
        boosts: ['con', 'cha'],
        feat: 'Неформальное Общение',
        source: 'Путеводитель по миру • Сияющие Королевства'
    },
    {
        id: 'bg_thassilonian_traveler',
        name: '⏳ Тассилонский путешественник (Thassilonian Traveler)',
        skill: 'arcana',
        skillName: 'Мистицизм',
        lore: 'Знание (Тассилон)',
        boosts: ['con', 'int'],
        feat: 'Сомнительные Знания',
        source: 'Путеводитель по миру • Земли Сказаний'
    },
    {
        id: 'bg_purveyor_of_the_bizarre',
        name: '🔮 Торговец диковинками (Purveyor of the Bizarre)',
        skill: 'arcana',
        skillName: 'Мистицизм',
        lore: 'Знание (торговля)',
        boosts: ['int', 'wis'],
        feat: 'Быстрое Опознание Магии',
        source: 'Путеводитель по миру • Золотой путь'
    },
    {
        id: 'bg_onyx_trader',
        name: '🪙 Торговец Оникса (Onyx Trader)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание (торговля)',
        boosts: ['dex', 'cha'],
        feat: 'Обучение Языкам',
        source: 'Путеводитель по миру • Око Ужаса'
    },
    {
        id: 'bg_thuvian_unifier',
        name: '🤝 Тувийский объединитель (Thuvian Unifier)',
        skill: 'intimidation',
        skillName: 'Запугивание',
        lore: 'Знание (политика)',
        boosts: ['str', 'cha'],
        feat: 'Быстрая Угроза',
        source: 'Путеводитель по миру • Золотой путь'
    },
    {
        id: 'bg_belkzen_slayer',
        name: '🪓 Убийца из Белкзена (Belkzen Slayer)',
        skill: 'intimidation',
        skillName: 'Запугивание',
        lore: 'Знание (орки)',
        boosts: ['str', 'cha'],
        feat: 'Устрашающий Взгляд',
        source: 'Путеводитель по миру • Око Ужаса'
    },
    {
        id: 'bg_menagerie_dung_sweeper',
        name: '🧹 Уборщик зверинца (Menagerie Dung Sweeper)',
        skill: 'nature',
        skillName: 'Природа',
        lore: 'Знание (животные)',
        boosts: ['con', 'wis'],
        feat: 'Дрессировка Животного',
        source: 'Путеводитель по миру • Авессалом'
    },
    {
        id: 'bg_ulfen_raider',
        name: '🪓 Ульфенский налётчик (Ulfen Raider)',
        skill: 'intimidation',
        skillName: 'Запугивание',
        lore: 'Знание (мореплавание)',
        boosts: ['str', 'cha'],
        feat: 'Устрашающий Взгляд',
        source: 'Путеводитель по миру • Земли Сказаний'
    },
    {
        id: 'bg_inlander',
        name: '⛰️ Уроженец (Inlander)',
        skill: 'survival',
        skillName: 'Выживание',
        lore: 'Знание местности',
        boosts: ['con', 'wis'],
        feat: 'Наблюдение За Дикой Природой',
        source: 'Путеводитель по миру • Авессалом'
    },
    {
        id: 'bg_ustalavic_academic',
        name: '🎓 Усталавский академик (Ustalavic Academic)',
        skill: 'crafting',
        skillName: 'Ремесло',
        lore: 'Знание (академические науки)',
        boosts: ['int', 'wis'],
        feat: 'Обучение Навыку',
        source: 'Путеводитель по миру • Око Ужаса'
    },
    {
        id: 'bg_chelish_rebel',
        name: '🚩 Челийский мятежник (Chelish Rebel)',
        skill: 'society',
        skillName: 'Общество',
        lore: 'Знание (Кинтарго)',
        boosts: ['dex', 'cha'],
        feat: 'Бывалый',
        source: 'Путеводитель по миру • Старая Челия'
    },
    {
        id: 'bg_oenopion_ooze_tender',
        name: '🧪 Энопионский надсмотрщик за жижами (Oenopion Ooze-Tender)',
        skill: 'crafting',
        skillName: 'Ремесло',
        lore: 'Знание (жижи)',
        boosts: ['con', 'int'],
        feat: 'Сомнительные Знания',
        source: 'Путеводитель по миру • Невозможные земли'
    },
    {
        id: 'bg_bright_lion',
        name: '🦁 Яркий Лев (Bright Lion)',
        skill: 'deception',
        skillName: 'Обман',
        lore: 'Знание (Мзали)',
        boosts: ['str', 'cha'],
        feat: 'Обманщик',
        source: 'Путеводитель по миру • Просторы Мванги'
    }

];

// Экспортируемая вспомогательная функция поиска по каталогу происхождений
export function searchBackgroundsCatalog(query) {
    const q = String(query || '').trim().toLowerCase().replace(/ё/g, 'е');
    if (!q) return [];
    return PF2E_BACKGROUNDS.filter(b => b.name.toLowerCase().replace(/ё/g, 'е').includes(q));
}
