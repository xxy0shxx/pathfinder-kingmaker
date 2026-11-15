/**
 * Справочник способностей Фамильяров и Специализаций Верных Зверей Pathfinder 2e (перевод pf2.ru)
 */
export const PF2E_COMPANION_ABILITIES = [
    // --- Способности Фамильяров ---
    { id: 'fam_accompanist', name: '🎵 Аккомпаниатор', type: 'familiar', desc: 'Situational bonus +1 or +2 to your Performance checks if familiar is nearby.' },
    { id: 'fam_stomach', name: '🧪 Алхимический желудок', type: 'familiar', desc: 'Can act as a distilling vessel to condense bombs inside its stomach.' },
    { id: 'fam_opinion', name: '🧠 Альтернативное мнение', type: 'familiar', desc: 'Familiar gains 1 reaction to Assist you in Recall Knowledge skill checks.' },
    { id: 'fam_amphibious', name: '🐟 Амфибия', type: 'familiar', desc: 'Gains the amphibious trait; can breathe underwater and in the air.' },
    { id: 'fam_fast_movement', name: '🏃 Быстрое перемещение', type: 'familiar', desc: 'One of the companion’s speeds increases from 25 to 40 feet.' },
    { id: 'fam_delivery', name: '📦 Доставка предмета', type: 'familiar', desc: 'Interacts to take light item, moves, and delivers or applies it to an ally.' },
    { id: 'fam_independent', name: '🦉 Независимый', type: 'familiar', desc: 'Gains 1 action each round during encounters even if you don\'t Command it.' },
    { id: 'fam_motor_skills', name: '🪶 Мелкая моторика', type: 'familiar', desc: 'Can use up to two limbs for actions with the manipulate trait as hands.' },
    { id: 'fam_speech', name: '🗣️ Речь', type: 'familiar', desc: 'Familiar understands and can speak one language you know.' },
    { id: 'fam_telepathic', name: '🔗 Телепатическое касание', type: 'familiar', desc: 'Can communicate telepathically with you or others via touch.' },
    { id: 'fam_master_delivery', name: '✨ Доставка заклинаний', type: 'master', desc: 'Owner can cast a touch spell and have the familiar move and deliver it.' },
    { id: 'fam_master_heal', name: '🩹 Исцеляющий фамильяр', type: 'master', desc: 'Once per day, familiar can spend 2 actions to heal you for 1d8 per 2 levels.' },
    { id: 'fam_master_life_link', name: '❤️ Узы жизни', type: 'master', desc: 'Reaction: take damage on yourself if your familiar falls to 0 HP.' },

    // --- Продвинутые Опции и Специализации Верных Зверей ---
    // --- Верные звери: Виды животных, Часть 1 (А - З) ---
    { id: 'an_badger', name: '🦡 Барсук (Верный зверь)', type: 'companion', desc: 'Скорость 25 фт., копание 10 фт. Атака: Укус (1d6 К) / Когти (1d4 Р, быстрое). Манёвр: Впадает в ярость при получении урона.' },
    { id: 'an_bird', name: '🦅 Птица (Орёл/Ястреб)', type: 'companion', desc: 'Скорость 10 фт., полет 60 фт. Атака: Клюв (1d6 К, кровотечение). Манёвр: Ослепляет врага когтями при атаке хозяина.' },
    { id: 'an_bear', name: '🐻 Медведь (Верный зверь)', type: 'companion', desc: 'Скорость 25 фт., ПЗ за уровень: +8. Атака: Челюсти (1d8 К) / Когти (1d6 Р). Манёвр: Наносит дополнительно 1d6 режущего урона.' },
    { id: 'an_boar', name: '🐗 Кабан (Верный зверь)', type: 'companion', desc: 'Скорость 35 фт. Атака: Клыки (1d8 К, раздирание). Манёвр: Кабан сбивает врага с ног при разбеге и Ударе.' },
    { id: 'an_cat', name: '🐆 Кот (Леопард/Пантера)', type: 'companion', desc: 'Скорость 35 фт., лазание 20 фт. Атака: Челюсти (1d6 К) / Когти (1d4 Р, скрытная атака). Манёвр: Делает врага застигнутым врасплох.' },
    { id: 'an_croc', name: '🐊 Крокодил (Верный зверь)', type: 'companion', desc: 'Скорость 20 фт., плавание 25 фт. Атака: Челюсти (1d8 К, захват) / Хвост (1d6 Б). Манёвр: Затягивает захваченную цель под воду.' },
    { id: 'an_dino_raptor', name: '🦖 Динозавр (Дромеозавр)', type: 'companion', desc: 'Скорость 40 фт. Атака: Когти (1d8 Р, фехтовальное) / Челюсти (1d6 К). Манёвр: Позволяет хозяину брать цель во фланг на расстоянии.' },
    { id: 'an_ape', name: '🦍 Обезьяна (Горилла)', type: 'companion', desc: 'Скорость 25 фт., лазание 20 фт. Атака: Кулак (1d8 Б). Манёвр: Пугает врагов грозным рыком и ударами в грудь (Запугивание).' },
    { id: 'an_camel', name: '🐪 Верблюд (Верный зверь)', type: 'companion', desc: 'Скорость 35 фт. Особое: Скакун. Атака: Плевок (дистанционная, ослепление) / Укус (1d6 К). Манёвр: Плюет в глаза врагу, снижая его КБ.' },
    { id: 'an_bat', name: '🦇 Летучая мышь (Большая)', type: 'companion', desc: 'Скорость 15 фт., полет 40 фт. Особое: Эхолокация. Атака: Укус (1d6 К). Манёвр: Издает ультразвук, заставляющий врагов промахиваться.' },
    { id: 'an_wolf', name: '🐺 Волк (Верный зверь)', type: 'companion', desc: 'Скорость 40 фт. Атака: Челюсти (1d6 К, сбивание с ног). Манёвр: Автоматически валит врага на землю, если тот ранен хозяином.' },
    { id: 'an_beetle', name: '🪲 Жук (Рогач)', type: 'companion', desc: 'Скорость 20 фт., КБ: эксперт по умолчанию. Атака: Рога (1d8 Б, сдавливание). Манёвр: Зажимает врага жвалами, обездвиживая его.' },
    { id: 'an_shark', name: '🦈 Акула (Верный зверь)', type: 'companion', desc: 'Плавание 40 фт. (нет наземной). Атака: Челюсти (1d8 К, разрывание). Манёвр: Чует кровь, нанося дополнительный урон раненым целям.' },
    { id: 'an_vulture', name: '🦅 Стервятник (Гриф)', type: 'companion', desc: 'Скорость 10 фт., полет 45 фт. Иммунитет к болезням. Атака: Клюв (1d8 К). Манёвр: Кружит над раненым врагом, накладывая штраф состояния.' },
    // --- Верные звери: Виды животных, Часть 2 (И - П) ---
    { id: 'an_hyena', name: '🐆 Гиена (Верный зверь)', type: 'companion', desc: 'Скорость 35 фт. Атака: Челюсти (1d6 К). Манёвр: Перекусывает сухожилия, сбивая раненого врага с ног.' },
    { id: 'an_horse', name: '🐎 Лошадь (Верный зверь)', type: 'companion', desc: 'Скорость 40 фт. Особое: Скакун. Атака: Копыта (1d8 Б). Манёвр: Позволяет хозяину наносить дополнительный урон при разгоне.' },
    { id: 'an_kangaroo', name: '🦘 Кенгуру (Верный зверь)', type: 'companion', desc: 'Скорость 30 фт., прыжок в длину 25 фт. Атака: Удар ногой (1d8 Б). Манёвр: Отталкивает цель назад.' },
    { id: 'an_lizard', name: '🦎 Ящерица (Геккон)', type: 'companion', desc: 'Скорость 30 фт., лазание 30 фт. Атака: Челюсти (1d6 К). Манёвр: Опутывает врага липким языком.' },
    { id: 'an_mantis', name: '🦗 Богомол (Гигантский)', type: 'companion', desc: 'Скорость 35 фт., лазание 25 фт. Атака: Клешни (1d6 Р, захват). Манёвр: Обездвиживает и режет врага.' },
    { id: 'an_monitor_lizard', name: '🐊 Варан (Варан Комодо)', type: 'companion', desc: 'Скорость 30 фт., плавание 20 фт. Атака: Челюсти (1d6 К, яд). Манёвр: Заражает цель трупным ядом.' },
    { id: 'an_owl', name: '🦉 Сова (Гигантская)', type: 'companion', desc: 'Скорость 10 фт., полет 50 фт. Скрытность: эксперт. Атака: Когти (1d6 Р). Манёвр: Атакует бесшумно, пугая врагов тенью.' },
    { id: 'an_peacock', name: '🦚 Павлин (Королевский)', type: 'companion', desc: 'Скорость 30 фт. Атака: Клюв (1d6 К). Манёвр: Распускает хвост, ослепляя и дезориентируя врагов ярким узором.' },
    { id: 'an_pterosaur', name: '🦖 Птеродактиль', type: 'companion', desc: 'Скорость 10 фт., полет 50 фт. Атака: Клюв (1d6 К). Манёвр: Пикирует сверху, нанося рваные раны и кровотечение.' },
    { id: 'an_scorpion', name: '🦂 Скорпион (Гигантский)', type: 'companion', desc: 'Скорость 30 фт., КБ: эксперт. Атака: Жало (1d6 Ко, яд) / Клешни (1d4 Р). Манёвр: Травит врага парализующим токсином.' },
    { id: 'an_snake', name: '🐍 Змея (Удав/Кобра)', type: 'companion', desc: 'Скорость 20 фт., плавание 20 фт. Атака: Челюсти (1d4 К, яд) / Сдавливание (1d6 Б). Манёвр: Задушает врага кольцами.' },
    { id: 'an_spider', name: '🕷️ Паук (Гигантский)', type: 'companion', desc: 'Скорость 30 фт., лазание 30 фт. Атака: Челюсти (1d6 К, яд). Манёвр: Плюет липкой паутиной, накладывая замедление.' },
    { id: 'an_stegosaurus', name: '🦕 Стегозавр (Мегафауна)', type: 'companion', desc: 'Скорость 30 фт., ПЗ: +8. Атака: Хвост (1d8 Б, шипы). Манёвр: Сбивает с ног и оглушает врага ударом тяжелого хвоста.' },
    { id: 'an_wolverine', name: '🦡 Росомаха (Верный зверь)', type: 'companion', desc: 'Скорость 25 фт., лазание 10 фт. Атака: Челюсти (1d6 К) / Когти (1d4 Р). Манёвр: При ранении выделяет мускус, тошнящий врагов.' },
    // --- Верные звери: Виды животных, Часть 3 (Р - Я) ---
    { id: 'an_rat', name: '🐀 Крыса (Гигантская)', type: 'companion', desc: 'Скорость 30 фт., плавание 15 фт. Атака: Челюсти (1d6 К). Манёвр: Прокусывает доспехи, нанося продолжительный урон болезнью при атаке хозяина.' },
    { id: 'an_rhino', name: '🦏 Носорог (Мегафауна)', type: 'companion', desc: 'Скорость 35 фт., ПЗ: +8. Атака: Рог (1d8 Ко, пробивание). Манёвр: Наносит сокрушительный урон с разбега, пробивая Твердость предметов.' },
    { id: 'an_scorpion_cave', name: '🦂 Пещерный скорпион', type: 'companion', desc: 'Скорость 30 фт., ночное зрение. Атака: Жало (1d6 Ко, яд). Манёвр: Хватает врага клешнями, лишая возможности уклоняться.' },
    { id: 'an_elephant', name: '🐘 Слон (Мамонт)', type: 'companion', desc: 'Скорость 30 фт., Особое: Скакун, ПЗ: +8. Атака: Бивни (1d8 Ко) / Топот (1d6 Б). Манёвр: Сминает ряды врагов, затаптывая их ниц.' },
    { id: 'an_stag', name: '🦌 Олень (Осьминог/Лось)', type: 'companion', desc: 'Скорость 40 фт. Особое: Скакун. Атака: Рога (1d6 Ко) / Копыта (1d4 Б). Манёвр: Таранит цель рогами, отбрасывая её на 5 футов.' },
    { id: 'an_toad', name: '🐸 Жаба (Гигантская)', type: 'companion', desc: 'Скорость 20 фт., плавание 20 фт. Атака: Челюсти (1d6 Б) / Язык (10 фт., захват). Манёвр: Притягивает цель к себе липким языком.' },
    { id: 'an_turtle', name: '🐢 Черепаха (Гигантская)', type: 'companion', desc: 'Скорость 10 фт., плавание 20 фт. КБ: эксперт. Атака: Челюсти (1d8 К). Манёвр: Прячется в панцирь, временно увеличивая свой КБ на +4.' },
    { id: 'an_unicorn', name: '🦄 Единорог (Редкое)', type: 'companion', desc: 'Скорость 45 фт. Особое: Скакун. Атака: Рог (1d8 Ко, магическое). Манёвр: Наносит урон светлой энергией, ошеломляя нечестивых существ.' },
    { id: 'an_ram', name: '🐏 Баран (Таран)', type: 'companion', desc: 'Скорость 35 фт. Атака: Рога (1d8 Б). Манёвр: Наносит сильный оглушающий удар с разбега (проверка Стойкости врага).' },
    { id: 'an_seal', name: '🦭 Тюлень (Морской лев)', type: 'companion', desc: 'Скорость 10 фт., плавание 35 фт. Атака: Укус (1d6 К). Манёвр: Увлекает цель на дно, накладывая штрафы за ведение боя под водой.' },
    { id: 'an_slug', name: '🐌 Слизень (Гигантский)', type: 'companion', desc: 'Скорость 15 фт., иммунитет к кислоте. Атака: Язык (1d6 К + 1d4 кислоты). Манёвр: Плюет слизью, разъедающей доспехи врага.' },
    { id: 'an_pterodactyl_mega', name: '🦖 Кетцалькоатль (Мегафауна)', type: 'companion', desc: 'Скорость 10 фт., полет 55 фт. Атака: Клюв (1d8 К). Манёвр: Хватает цель когтями на лету и сбрасывает с высоты.' },
    { id: 'an_hippo', name: '🦛 Бегемот (Гигантский)', type: 'companion', desc: 'Скорость 25 фт., плавание 25 фт., ПЗ: +8. Атака: Челюсти (1d10 К). Манёвр: Наносит огромный урон укусом, игнорируя устойчивость цели.' },
];

export function searchCompanionAbilities(query = '', selectedType = 'all') {
    const q = String(query || '').trim().toLowerCase().replace(/ё/g, 'е');
    let list = PF2E_COMPANION_ABILITIES;

    if (selectedType === 'familiar') {
        list = list.filter(x => x.type === 'familiar' || x.type === 'master');
    } else if (selectedType === 'companion') {
        list = list.filter(x => x.type === 'companion');
    }

    if (!q) return list;
    return list.filter(x => x.name.toLowerCase().replace(/ё/g, 'е').includes(q) || x.desc.toLowerCase().includes(q));
}
