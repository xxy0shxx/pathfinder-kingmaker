/**
 * Глобальная конфигурация системы интерактивной гексагональной карты Kingmaker
 */
export const MAP_CONFIG = {
    ENABLE_FPS_MONITOR: true,  // Включение/выключение счетчика кадров и логов нагрузки
    // Геометрия сетки гексов (соответствует вычислениям на базе радиуса)
    isGlobalFogEnabled: true,
    grid: {
        radius: 77.96,
        rows: 12,
        cols: 30,
        offsetX: -106,
        offsetY: 16,
        maxDcLevel: 41 // Максимальный уровень сложности и монстров в селекторах
    },

    // Параметры вьюпорта: зум и жесткие лимиты перетаскивания canvas
    viewport: {
        minZoom: 0.5,
        maxZoom: 3.0,
        defaultZoom: 1.0,
        step: 20,      // Шаг отрисовки рун на рамке
        padding: 0,   // Отступ для рун от краев
        limits: {
            maxX: 3840 * 1.5,
            minX: -3840 * 1.5,
            maxY: 1280 * 1.1,
            minY: -1280 * 1.1
        }
    },

    // Реестр типов объектов на карте (иконки и названия для тултипов)
    types: {
        landmark: { icon: '🏛️', label: 'Достопримечательность' },
        resource: { icon: '💎', label: 'Ресурс' },
        quest:    { icon: '⚜️', label: 'Стандартное задание' },
        mystery:  { icon: '❓', label: 'Тайна' }
    },

    // Справочник ландшафтов: случайные встречи (dc) + правила освоения королевства (Pathfinder 2e Kingmaker)
    terrains: {
        plains: {
            icon: '🌾',
            label: 'Равнины',
            dc: 12,
            claimDcMod: 0,     // Базовая КС управления +0
            clearCost: 1,      // Расчистка гекса: 1 ОР
            roadCost: 1,       // Прокладка дороги: 1 ОР
            workSiteCost: 2    // Строительство участка: 2 ОР
        },
        forest: {
            icon: '🌲',
            label: 'Лес',
            dc: 14,
            claimDcMod: 1,     // Густой лес: +1 к СЛ расчистки и освоения
            clearCost: 2,      // Расчистка гекса: 2 ОР
            roadCost: 2,       // Прокладка дороги: 2 ОР
            workSiteCost: 4    // Лесопилка: 4 ОР
        },
        swamp: {
            icon: '🐸',
            label: 'Болото',
            dc: 14,
            claimDcMod: 2,     // Топи: +2 к СЛ расчистки и освоения
            clearCost: 4,      // Расчистка гекса: 4 ОР
            roadCost: 4,       // Прокладка дороги (гати): 4 ОР
            workSiteCost: 6    // Осушение / участок: 6 ОР
        },
        mountain: {
            icon: '⛰️',
            label: 'Горы',
            dc: 16,
            claimDcMod: 2,     // Высокогорье: +2 к СЛ расчистки и освоения
            clearCost: 4,      // Расчистка гекса: 4 ОР
            roadCost: 4,       // Прокладка горного тракта: 4 ОР
            workSiteCost: 6    // Шахта / каменоломня: 6 ОР
        },
        arctic: {
            icon: '❄️',
            label: 'Приполярье',
            dc: 17,
            claimDcMod: 2,     // Мерзлота и холмы: +2 к СЛ освоения
            clearCost: 3,      // Расчистка гекса: 3 ОР
            roadCost: 3,       // Прокладка дороги: 3 ОР
            workSiteCost: 6    // Шахта / каменоломня: 6 ОР
        },
        water: {
            icon: '🌊',
            label: 'Вода',
            dc: 17,
            claimDcMod: 3,     // Водная преграда: +3 к СЛ (требуется мост/переправа)
            clearCost: 0,      // Вода не расчищается стандартно
            roadCost: 8,       // Переправа / мост без готового моста: 8 ОР (с мостом — бесплатно)
            workSiteCost: 0
        }
    },


    // Правила совместимости рабочих участков (Work Sites) с рельефом по Pathfinder 2e Kingmaker
    workSiteRules: {
        farmlands: {
            label: '🌾 Угодья (Ферма)',
            allowedTerrains: ['plains', 'swamp'], // Равнины и осушаемые низменности (нельзя в горах, лесу, воде и приполярье)
            reason: 'Фермы можно разбивать только на равнинах (нельзя в горах, густом лесу, воде или приполярье).'
        },
        lumberCamps: {
            label: '🪵 Лагерь лесорубов (Лесопилка)',
            allowedTerrains: ['forest', 'swamp'], // Требуется наличие древесины (лесные или болотно-лесные гексы)
            reason: 'Лесопилки требуют наличия лесного массива (лес или лесистые болота).'
        },
        mines: {
            label: '⛏ Шахта',
            allowedTerrains: ['mountain', 'arctic'], // Привязаны к горам и скалистым предгорьям
            reason: 'Шахты можно закладывать только в горах или скалистом приполярье.'
        },
        quarries: {
            label: '🧱 Каменоломня',
            allowedTerrains: ['mountain', 'plains', 'arctic'], // Привязаны к горам и каменистым возвышенностям
            reason: 'Каменоломни требуют выхода скальных пород (горы, предгорья или каменистые равнины).'
        }
    },


    // Цветовые пресеты для заливки (используются в палитре формы)
    colorPresets: [
        { color: 'transparent', label: '✖' },
        { color: '#2ecc71', label: '' },
        { color: '#3498db', label: '' },
        { color: '#e74c3c', label: '' },
        { color: '#f1c40f', label: '' },
        { color: '#9b59b6', label: '' },
        { color: '#e67e22', label: '' }
    ],

    // Системные тексты дневника для пустых состояний вкладок
    messages: {
        questEmpty: {
            active: 'В вашем дневнике приключений пусто. Кажется, вы просто бездельничаете в таверне и прожигаете стартовое золото.',
            completed: 'Ни одного подвига за душой. Бардам буквально не о чем петь, а местные стражники все еще смотрят на вас с подозрением.',
            rumors: 'Тишина... Слишком подозрительная тишина. Никто не крадет коров, бандиты не грабят крестьян, а древние артефакты не светятся по ночам.'
        }
    },

    // Настройки аудиосистемы Winamp-панели
    audio: {
        playlistUrl: 'audio/playlist.json',
        defaultVolume: 0.25
    },


    // Календарь Голариона (12 месяцев, сезоны и сезонная погода для Pathfinder 2e Kingmaker)
    golarionCalendar: {
        startYear: 4710, // Стандартный год начала кампании Kingmaker (AR)
        weekdays: [
            { id: 0, name: 'День луны',   rus: 'Пн' },
            { id: 1, name: 'День труда',   rus: 'Вт' },
            { id: 2, name: 'День богатств',  rus: 'Ср' },
            { id: 3, name: 'День клятв',     rus: 'Чт' },
            { id: 4, name: 'День огня',  rus: 'Пт' },
            { id: 5, name: 'День звезд',  rus: 'Сб' },
            { id: 6, name: 'День солнца',   rus: 'Вс' }
        ],
        months: [
            { id: 0,  name: 'Абадиус',   days: 31, season: 'winter', seasonLabel: '❄️ Зима',  precipDc: 8,  coldDc: 16 },
            { id: 1,  name: 'Калистрил', days: 28, season: 'winter', seasonLabel: '❄️ Зима',  precipDc: 8,  coldDc: 18 },
            { id: 2,  name: 'Фараст',    days: 31, season: 'spring', seasonLabel: '🌱 Весна', precipDc: 15, coldDc: null },
            { id: 3,  name: 'Гозран',    days: 30, season: 'spring', seasonLabel: '🌱 Весна', precipDc: 15, coldDc: null },
            { id: 4,  name: 'Дезнус',    days: 31, season: 'spring', seasonLabel: '🌱 Весна', precipDc: 15, coldDc: null },
            { id: 5,  name: 'Саренит',   days: 30, season: 'summer', seasonLabel: '☀️ Лето',  precipDc: 20, coldDc: null },
            { id: 6,  name: 'Эрастус',   days: 31, season: 'summer', seasonLabel: '☀️ Лето',  precipDc: 20, coldDc: null },
            { id: 7,  name: 'Ароднус',   days: 31, season: 'summer', seasonLabel: '☀️ Лето',  precipDc: 20, coldDc: null },
            { id: 8,  name: 'Рова',      days: 30, season: 'autumn', seasonLabel: '🍂 Осень', precipDc: 15, coldDc: null },
            { id: 9,  name: 'Ламаштан',  days: 31, season: 'autumn', seasonLabel: '🍂 Осень', precipDc: 15, coldDc: null },
            { id: 10, name: 'Нет',       days: 30, season: 'autumn', seasonLabel: '🍂 Осень', precipDc: 15, coldDc: null },
            { id: 11, name: 'Кутона',    days: 31, season: 'winter', seasonLabel: '❄️ Зима',  precipDc: 8,  coldDc: 18 }
        ],
        weatherHazardsTable: [
            {
                id: 'fog', minRoll: 1, maxRoll: 3, icon: '🌫️', label: 'Туман', levelText: 'Ур. 0', minLevel: 0,
                survivalDc: 'СЛ 14 (Изучен)', duration: '1d4 часа+', req: 'Нет',
                prep: 'Укрытие не защищает от тумана, но позволяет переждать.',
                effect: 'Все существа получают состояние скрытости (concealed) за пределами 5 футов. Скорость передвижения по карте снижена вдвое.'
            },
            {
                id: 'downpour', minRoll: 4, maxRoll: 7, icon: '🌧️', label: 'Ливень', levelText: 'Ур. 0', minLevel: 0,
                survivalDc: 'СЛ 14 (Изучен)', duration: '1d4 часа+', req: 'Нет',
                prep: 'Выживание СЛ 14: найти/соорудить укрытие (полная защита).',
                effect: 'Штраф −2 к Вниманию и дистанционным атакам. Потушены открытые огни. Без укрытия — промокание и утомление через 2 часа.'
            },
            {
                id: 'cold_snap', minRoll: 8, maxRoll: 9, icon: '🥶', label: 'Резкое похолодание', levelText: 'Ур. 1', minLevel: 1,
                survivalDc: 'СЛ 15 (Изучен)', duration: '2d4 часа+', req: 'Не лето',
                prep: 'Выживание СЛ 15: развести защищённый костёр и утеплиться.',
                effect: 'Температура падает до сильного холода: спасбросок Стойкости СЛ 15 каждый час или утомление + 1d6 урона холодом.'
            },
            {
                id: 'windstorm', minRoll: 10, maxRoll: 12, icon: '💨', label: 'Ураган', levelText: 'Ур. 1', minLevel: 1,
                survivalDc: 'СЛ 15 (Изучен)', duration: '1d4 часа+', req: 'Нет',
                prep: 'Выживание СЛ 15: найти укрытие от ветра (полная защита).',
                effect: 'Штраф −2 к дистанционным атакам, полёт невозможен, открытый огонь гаснет, спасбросок Атлетики/Акробатики СЛ 15 против сбивания с ног.'
            },
            {
                id: 'hail', minRoll: 13, maxRoll: 13, icon: '🧊', label: 'Град, сильный', levelText: 'Ур. 2', minLevel: 2,
                survivalDc: 'СЛ 16 (Изучен)', duration: '1d10 минут', req: 'Нет',
                prep: 'Выживание СЛ 16: срочно укрыться (полная защита от градин).',
                effect: '1d6 дробящего урона каждую минуту (простой спасбросок Реакции СЛ 18), штраф −2 к Вниманию и сложная местность.'
            },
            {
                id: 'blizzard', minRoll: 14, maxRoll: 14, icon: '🌨️', label: 'Метель', levelText: 'Ур. 6', minLevel: 6,
                survivalDc: 'СЛ 22 (Эксперт)', duration: '2d4 часа+', req: 'Зима или горы',
                prep: 'Выживание СЛ 22: снежное укрытие (защищает от ветра и видимости).',
                effect: 'Видимость 5 футов, сложная местность, сильный холод (Стойкость СЛ 22 каждый час) и штраф −4 к Вниманию и атакам.'
            },
            {
                id: 'supernatural', minRoll: 15, maxRoll: 15, icon: '🔮', label: 'Сверхъестественная буря', levelText: 'Ур. 6+', minLevel: 6,
                survivalDc: 'СЛ 22 (Эксперт)', duration: '1d4 часа+', req: 'Нет',
                prep: 'Выживание СЛ 22 или Мистицизм/Природа СЛ 22 для защиты.',
                effect: 'Аномальные осадки и всплески магии (дикая магия, спасбросок Воли/Реакции СЛ 22 и энергетический урон 3d6).'
            },
            {
                id: 'flash_flood', minRoll: 16, maxRoll: 16, icon: '🌊', label: 'Ливневый паводок', levelText: 'Ур. 7', minLevel: 7,
                survivalDc: 'СЛ 23 (Эксперт)', duration: '10 минут', req: 'Низина, река или болото',
                prep: 'Выживание СЛ 23: подняться на возвышенность (полное избежание).',
                effect: 'Поток воды сносит существ: Атлетика/Реакция СЛ 25 или 4d6 дробящего урона и унесение течением (риск утопления).'
            },
            {
                id: 'wildfire', minRoll: 17, maxRoll: 17, icon: '🔥', label: 'Пожар', levelText: 'Ур. 4 или 10', minLevel: 4,
                survivalDc: 'СЛ 19 / 27 (Эксперт)', duration: '1d6 часов+', req: 'Лес или равнины (не зима)',
                prep: 'Выживание СЛ 19 (Ур. 4) или СЛ 27 (Ур. 10): встречный пал или водоём.',
                effect: 'Стена огня и едкий дым (состояние тошноты/удушья, 2d6 или 5d6 урона огнём за раунд в зоне пламени).'
            },
            {
                id: 'sinkhole', minRoll: 18, maxRoll: 18, icon: '🕳️', label: 'Проседание грунта', levelText: 'Ур. 5 или 12', minLevel: 5,
                survivalDc: 'СЛ 20 / 30 (Мастер)', duration: 'Мгновенно', req: 'Болото, холмы или пещеры',
                prep: 'Выживание или Внимание СЛ 20/30: обойти нестабильный участок.',
                effect: 'Провал земли глубиной 20–40 футов: Реакция СЛ 22/32 или падение с уроном и завалом (требуется Атлетика для подъёма).'
            },
            {
                id: 'thunderstorm', minRoll: 19, maxRoll: 19, icon: '⛈️', label: 'Гроза', levelText: 'Ур. 7 или 13', minLevel: 7,
                survivalDc: 'СЛ 23 / 31 (Эксперт/Мастер)', duration: '1d4 часа+', req: 'Нет',
                prep: 'Выживание СЛ 23/31: укрыться в низине или здании вдали от деревьев.',
                effect: 'Ливень + ураганный ветер + удары молний каждые 10 мин (Реакция СЛ 25/33 или 4d12 / 8d12 урона электричеством).'
            },
            {
                id: 'tornado', minRoll: 20, maxRoll: 20, icon: '🌪️', label: 'Торнадо', levelText: 'Ур. 12 или 17', minLevel: 12,
                survivalDc: 'СЛ 30 / 36 (Мастер)', duration: '1d10 минут', req: 'Равнины или холмы',
                prep: 'Выживание СЛ 30/36: подземное укрытие (обычные постройки разрушаются).',
                effect: 'Катастрофический вихрь: затягивает существ и объекты, наносит 6d10 / 10d10 дробящего урона (Стойкость СЛ 32/38).'
            }
        ],
        weatherBySeason: {
            winter: [
                { id: 'clear_cold', minRoll: 1,  maxRoll: 12, icon: '🌤️', label: 'Морозно и ясно',    huntDcMod: 1,  encDcMod: 0, consMod: 0 },
                { id: 'deep_frost', minRoll: 13, maxRoll: 17, icon: '🥶', label: 'Лютая стужа',       huntDcMod: 2,  encDcMod: 1, consMod: 1 },
                { id: 'blizzard',   minRoll: 18, maxRoll: 20, icon: '🌨️', label: 'Метель и вьюга',    huntDcMod: 3,  encDcMod: 2, consMod: 1 }
            ],
            spring: [
                { id: 'clear_mild', minRoll: 1,  maxRoll: 12, icon: '⛅', label: 'Ясно и свежо',      huntDcMod: 0,  encDcMod: 0, consMod: 0 },
                { id: 'mud_thaw',   minRoll: 13, maxRoll: 17, icon: '🌫️', label: 'Распутица и туман', huntDcMod: 1,  encDcMod: 1, consMod: 0 },
                { id: 'heavy_rain', minRoll: 18, maxRoll: 20, icon: '🌧️', label: 'Проливной дождь',   huntDcMod: 2,  encDcMod: 1, consMod: 0 }
            ],
            summer: [
                { id: 'sunny',      minRoll: 1,  maxRoll: 12, icon: '☀️', label: 'Ясно и тепло',      huntDcMod: -1, encDcMod: 0, consMod: 0 },
                { id: 'heatwave',   minRoll: 13, maxRoll: 17, icon: '🔥', label: 'Изнуряющий зной',   huntDcMod: 2,  encDcMod: 0, consMod: 1 },
                { id: 'storm',      minRoll: 18, maxRoll: 20, icon: '⛈️', label: 'Летняя гроза',      huntDcMod: 2,  encDcMod: 1, consMod: 0 }
            ],
            autumn: [
                { id: 'crisp',      minRoll: 1,  maxRoll: 12, icon: '🍂', label: 'Прохладно и сухо',  huntDcMod: -1, encDcMod: 0, consMod: 0 },
                { id: 'thick_fog',  minRoll: 13, maxRoll: 17, icon: '🌫️', label: 'Густой туман',      huntDcMod: 1,  encDcMod: -1,consMod: 0 },
                { id: 'cold_rain',  minRoll: 18, maxRoll: 20, icon: '🌧️', label: 'Холодный ливень',   huntDcMod: 2,  encDcMod: 1, consMod: 0 }
            ]
        }
    },
    // Официальная таблица случайных событий королевства (PF2e Kingmaker, d100)
    kingdomRandomEventsTable: [
        { id: 'bandit_activity',   minRoll: 1,   maxRoll: 6,   type: 'danger', icon: '🗡️', title: 'Активность разбойников',     skill: 'warfare',     dcMod: 0, desc: 'Разбойники грабят торговые пути. Провал: −1d4 Товаров или +1 Беспорядки.' },
        { id: 'monster_attack',    minRoll: 7,   maxRoll: 12,  type: 'danger', icon: '🐉', title: 'Нападение чудовищ',          skill: 'defense',     dcMod: 0, desc: 'Опасный зверь или отряд монстров терроризирует пограничный гекс.' },
        { id: 'feud',              minRoll: 13,  maxRoll: 18,  type: 'danger', icon: '⚖️', title: 'Междоусобица знати / кланов', skill: 'politics',    dcMod: 0, desc: 'Влиятельные семьи вступили в спор. Провал: +1 Беспорядки и штраф −1 к Лояльности.' },
        { id: 'crop_failure',      minRoll: 19,  maxRoll: 24,  type: 'danger', icon: '🥀', title: 'Неурожай / Мор скота',       skill: 'agriculture', dcMod: 0, desc: 'Часть урожая погибла. Провал: потеря 1d4 Еды со склада или +2 Беспорядки.' },
        { id: 'plague',            minRoll: 25,  maxRoll: 30,  type: 'danger', icon: '☣️', title: 'Вспышка болезни',            skill: 'wilderness',  dcMod: 2, desc: 'В одном из поселений вспыхнула лихорадка. Требуется карантин и лечение.' },
        { id: 'cult_activity',     minRoll: 31,  maxRoll: 36,  type: 'danger', icon: '🕯️', title: 'Тайный культ / Заговор',     skill: 'intrigue',    dcMod: 2, desc: 'Подпольная секта мутит воду в столице. Провал: +1 Руины Коррупции.' },
        { id: 'squatters',         minRoll: 37,  maxRoll: 42,  type: 'danger', icon: '🏚️', title: 'Самозахват земель',          skill: 'statecraft',  dcMod: 0, desc: 'Переселенцы заняли спорный гекс без разрешения короны.' },
        { id: 'criminal_gang',     minRoll: 43,  maxRoll: 48,  type: 'danger', icon: '🎭', title: 'Воровская гильдия',          skill: 'intrigue',    dcMod: 0, desc: 'Преступники обложили данью ремесленников. Провал: −1d4 Люкса и +1 Коррупция.' },
        { id: 'border_raid',       minRoll: 49,  maxRoll: 54,  type: 'danger', icon: '⚔️', title: 'Пограничный набег',          skill: 'warfare',     dcMod: 2, desc: 'Соседи или племена совершили вылазку на окраину королевства.' },
        { id: 'natural_disaster',  minRoll: 55,  maxRoll: 60,  type: 'danger', icon: '🌪️', title: 'Стихийное бедствие',         skill: 'engineering', dcMod: 2, desc: 'Буря, оползень или паводок повредили постройки и дороги.' },
        { id: 'economic_boom',     minRoll: 61,  maxRoll: 66,  type: 'boon',   icon: '💰', title: 'Экономический подъём',       skill: 'trade',       dcMod: 0, desc: 'Выгодные сделки пополняют казну. Успех: +1d4 ОР в следующем ходу или +1 Люкс.' },
        { id: 'cultural_festival', minRoll: 67,  maxRoll: 72,  type: 'boon',   icon: '🎪', title: 'Культурный расцвет',         skill: 'arts',        dcMod: 0, desc: 'Барды и мастера прославляют королевство. Успех: −1 Беспорядки и +1 Славы.' },
        { id: 'pilgrimage',        minRoll: 73,  maxRoll: 78,  type: 'boon',   icon: '🕊️', title: 'Паломничество / Знамение',   skill: 'folklore',    dcMod: 0, desc: 'Благое знамение укрепляет дух народа. Успех: −1d4 Беспорядков.' },
        { id: 'unexpected_find',   minRoll: 79,  maxRoll: 84,  type: 'boon',   icon: '💎', title: 'Неожиданная находка',        skill: 'exploration', dcMod: 0, desc: 'Разведчики обнаружили залежи или древний тайник. Успех: +1d4 Руды или Камня.' },
        { id: 'diplomatic_envoy',  minRoll: 85,  maxRoll: 90,  type: 'boon',   icon: '📜', title: 'Дипломатическое посольство', skill: 'politics',    dcMod: 0, desc: 'Соседнее владение предлагает обмен опытом и торговое соглашение.' },
        { id: 'bumper_harvest',    minRoll: 91,  maxRoll: 95,  type: 'boon',   icon: '🌾', title: 'Богатый урожай',             skill: 'agriculture', dcMod: 0, desc: 'Поля принесли двойной сбор. Успех: +2 Еды на склад королевства.' },
        { id: 'heroic_volunteer',  minRoll: 96,  maxRoll: 100, type: 'boon',   icon: '🛡️', title: 'Приток добровольцев',        skill: 'defense',     dcMod: 0, desc: 'Опытные воины и ремесленники вступают на службу короне (+30 XP королевства).' }
    ],
    // Официальные фракции и соседние государства PF2e Kingmaker с их СЛ переговоров (Negotiation DC)
    kingdomFactionsPreset: [
        { id: 'sootscale',    name: 'Кобольды Чёрной Чешуи',   icon: '🦎', negotiationDc: 15, desc: 'Племя кобольдов в Зелёном поясе.' },
        { id: 'rostland',     name: 'Ростланд (Рестов)',        icon: '⚔️', negotiationDc: 15, desc: 'Южная провинция Бревоя и покровители экспедиции.' },
        { id: 'varnhold',     name: 'Варнхолд',                 icon: '🏰', negotiationDc: 16, desc: 'Соседнее поселение Маэгара Варна на востоке.' },
        { id: 'lizardfolk',   name: 'Людоящеры Свечного озера', icon: '🐊', negotiationDc: 16, desc: 'Племя ящеролюдов на островах Клыкастого озера.' },
        { id: 'mivon',        name: 'Мивон (Речные королевства)', icon: '🗡️', negotiationDc: 20, desc: 'Вольный город дуэлянтов к югу от Украденных земель.' },
        { id: 'nomen',        name: 'Кентавры Номена',          icon: '🏹', negotiationDc: 26, desc: 'Кочевые племена степей на востоке.' },
        { id: 'fort_drelev',  name: 'Форт Дрелев',              icon: '🛡️', negotiationDc: 30, desc: 'Западное баронство у берегов озера Хук.' },
        { id: 'pitax',        name: 'Королевство Питакc',       icon: '🎭', negotiationDc: 32, desc: 'Богатое и амбициозное государство на западе.' },
        { id: 'brevoy',       name: 'Корона Бревоя (Новый Стетвен)', icon: '👑', negotiationDc: 35, desc: 'Северная держава дома Рогаров и Великих домов.' }
    ],

};
