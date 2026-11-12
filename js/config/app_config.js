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
            { id: 0,  name: 'Абадиус',   days: 31, season: 'winter', seasonLabel: '❄️ Зима',  desc: 'Суровые морозы и метели' },
            { id: 1,  name: 'Калистрил', days: 28, season: 'winter', seasonLabel: '❄️ Зима',  desc: 'Холодные ветра и поздние снегопады' },
            { id: 2,  name: 'Фараст',    days: 31, season: 'spring', seasonLabel: '🌱 Весна', desc: 'Оттепель, распутица и весенние дожди' },
            { id: 3,  name: 'Гозран',    days: 30, season: 'spring', seasonLabel: '🌱 Весна', desc: 'Бурные ливни и цветение' },
            { id: 4,  name: 'Дезнус',    days: 31, season: 'spring', seasonLabel: '🌱 Весна', desc: 'Тёплые ветра и ясные ночи' },
            { id: 5,  name: 'Саренит',   days: 30, season: 'summer', seasonLabel: '☀️ Лето',  desc: 'Долгие солнечные дни и зной' },
            { id: 6,  name: 'Эрастус',   days: 31, season: 'summer', seasonLabel: '☀️ Лето',  desc: 'Разгар лета и грозы' },
            { id: 7,  name: 'Ароднус',   days: 31, season: 'summer', seasonLabel: '☀️ Лето',  desc: 'Жаркий сбор раннего урожая' },
            { id: 8,  name: 'Рова',      days: 30, season: 'autumn', seasonLabel: '🍂 Осень', desc: 'Ветра, листопад и жатва' },
            { id: 9,  name: 'Ламаштан',  days: 31, season: 'autumn', seasonLabel: '🍂 Осень', desc: 'Холодные туманы и сырость' },
            { id: 10, name: 'Нет',       days: 30, season: 'autumn', seasonLabel: '🍂 Осень', desc: 'Первые заморозки и слякоть' },
            { id: 11, name: 'Кутона',    days: 31, season: 'winter', seasonLabel: '❄️ Зима',  desc: 'Самые тёмные ночи и стужа' }
        ],
        weatherBySeason: {
            winter: [
                { id: 'clear_cold', icon: '🌤️', label: 'Морозно и ясно',   huntDcMod: 1,  encDcMod: 0, consMod: 0 },
                { id: 'blizzard',   icon: '🌨️', label: 'Метель и вьюга',   huntDcMod: 3,  encDcMod: 2, consMod: 1 },
                { id: 'deep_frost', icon: '🥶', label: 'Лютая стужа',      huntDcMod: 2,  encDcMod: 1, consMod: 1 }
            ],
            spring: [
                { id: 'clear_mild', icon: '⛅', label: 'Ясно и свежо',     huntDcMod: 0,  encDcMod: 0, consMod: 0 },
                { id: 'heavy_rain', icon: '🌧️', label: 'Проливной дождь',  huntDcMod: 2,  encDcMod: 1, consMod: 0 },
                { id: 'mud_thaw',   icon: '🌫️', label: 'Распутица и туман',huntDcMod: 1,  encDcMod: 1, consMod: 0 }
            ],
            summer: [
                { id: 'sunny',      icon: '☀️', label: 'Ясно и тепло',     huntDcMod: -1, encDcMod: 0, consMod: 0 },
                { id: 'heatwave',   icon: '🔥', label: 'Изнуряющий зной',  huntDcMod: 2,  encDcMod: 0, consMod: 1 },
                { id: 'storm',      icon: '⛈️', label: 'Летняя гроза',     huntDcMod: 2,  encDcMod: 1, consMod: 0 }
            ],
            autumn: [
                { id: 'crisp',      icon: '🍂', label: 'Прохладно и сухо', huntDcMod: -1, encDcMod: 0, consMod: 0 },
                { id: 'thick_fog',  icon: '🌫️', label: 'Густой туман',     huntDcMod: 1,  encDcMod: -1,consMod: 0 },
                { id: 'cold_rain',  icon: '🌧️', label: 'Холодный ливень',  huntDcMod: 2,  encDcMod: 1, consMod: 0 }
            ]
        }
    },

};
