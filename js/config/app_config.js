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
        maxDcLevel: 40 // Максимальный уровень сложности и монстров в селекторах
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

    // Справочник ландшафтов: привязка иконки, названия и СЛ проверки по умолчанию
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
            { id: 'fog',          minRoll: 1,  maxRoll: 3,  icon: '🌫️', label: 'Туман',                 levelText: 'Ур. 0',        minLevel: 0 },
            { id: 'downpour',     minRoll: 4,  maxRoll: 7,  icon: '🌧️', label: 'Ливень',                levelText: 'Ур. 0',        minLevel: 0 },
            { id: 'cold_snap',    minRoll: 8,  maxRoll: 9,  icon: '🥶', label: 'Резкое похолодание',    levelText: 'Ур. 1',        minLevel: 1 },
            { id: 'windstorm',    minRoll: 10, maxRoll: 12, icon: '💨', label: 'Ураган',                levelText: 'Ур. 1',        minLevel: 1 },
            { id: 'hail',         minRoll: 13, maxRoll: 13, icon: '🧊', label: 'Град, сильный',         levelText: 'Ур. 2',        minLevel: 2 },
            { id: 'blizzard',     minRoll: 14, maxRoll: 14, icon: '🌨️', label: 'Метель',                levelText: 'Ур. 6',        minLevel: 6 },
            { id: 'supernatural', minRoll: 15, maxRoll: 15, icon: '🔮', label: 'Сверхъестественная буря',levelText: 'Ур. 6+',       minLevel: 6 },
            { id: 'flash_flood',  minRoll: 16, maxRoll: 16, icon: '🌊', label: 'Ливневый паводок',      levelText: 'Ур. 7',        minLevel: 7 },
            { id: 'wildfire',     minRoll: 17, maxRoll: 17, icon: '🔥', label: 'Пожар',                 levelText: 'Ур. 4 или 10', minLevel: 4 },
            { id: 'sinkhole',     minRoll: 18, maxRoll: 18, icon: '🕳️', label: 'Проседание грунта',     levelText: 'Ур. 5 или 12', minLevel: 5 },
            { id: 'thunderstorm', minRoll: 19, maxRoll: 19, icon: '⛈️', label: 'Гроза',                 levelText: 'Ур. 7 или 13', minLevel: 7 },
            { id: 'tornado',      minRoll: 20, maxRoll: 20, icon: '🌪️', label: 'Торнадо',               levelText: 'Ур. 12 или 17',minLevel: 12 }
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



};
