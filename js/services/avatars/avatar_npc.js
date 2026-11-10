/**
 * ГЕНЕРАТОРЫ АВАТАРОК: СЮЖЕТНЫЕ NPC, СТРАЖА И МИРНЫЕ ЖИТЕЛИ
 */
export const NpcAvatars = {

    townsman() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ОДЕЖДА: Грубая холщовая рубаха, кожаная жилетка и шейный платок
        ctx.fillStyle = '#5d4037'; // Кожаная потёртая безрукавка
        ctx.beginPath();
        ctx.moveTo(20, 128);
        ctx.lineTo(38, 102);
        ctx.lineTo(90, 102);
        ctx.lineTo(108, 128);
        ctx.closePath();
        ctx.fill();

        // Грубая небелёная льняная рубаха по центру
        ctx.fillStyle = '#d7ccc8';
        ctx.beginPath();
        ctx.moveTo(48, 102);
        ctx.lineTo(64, 128);
        ctx.lineTo(80, 102);
        ctx.closePath();
        ctx.fill();

        // Шнуровка на груди рубахи
        ctx.strokeStyle = '#4e342e';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(64, 108); ctx.lineTo(64, 125);
        ctx.moveTo(60, 112); ctx.lineTo(68, 112);
        ctx.moveTo(60, 118); ctx.lineTo(68, 118);
        ctx.stroke();

        // Простой повязанный шейный платок (охристый)
        ctx.fillStyle = '#a1662f';
        ctx.beginPath();
        ctx.moveTo(46, 98);
        ctx.quadraticCurveTo(64, 108, 82, 98);
        ctx.lineTo(78, 106);
        ctx.quadraticCurveTo(64, 113, 50, 106);
        ctx.closePath();
        ctx.fill();

        // 2. ШЕЯ И ОТТОПЫРЕННЫЕ УШИ
        ctx.fillStyle = '#d69e7e';
        ctx.fillRect(54, 86, 20, 16);

        ctx.fillStyle = '#dfa888';
        ctx.beginPath(); ctx.ellipse(41, 68, 5, 8, -0.15, 0, Math.PI * 2); ctx.fill(); // Левое ухо
        ctx.beginPath(); ctx.ellipse(87, 68, 5, 8, 0.15, 0, Math.PI * 2); ctx.fill(); // Правое ухо

        // 3. ЛИЦО (Простое, кругловатое, обветренное)
        ctx.fillStyle = '#e8b496';
        ctx.beginPath();
        ctx.moveTo(43, 52);
        ctx.lineTo(85, 52);
        ctx.lineTo(84, 82);
        ctx.lineTo(64, 98);
        ctx.lineTo(44, 82);
        ctx.closePath();
        ctx.fill();

        // Лёгкая рыжеватая щетина на подбородке и щеках
        ctx.fillStyle = 'rgba(166, 114, 54, 0.22)';
        ctx.beginPath();
        ctx.moveTo(44, 76);
        ctx.lineTo(64, 98);
        ctx.lineTo(84, 76);
        ctx.lineTo(83, 83);
        ctx.lineTo(64, 98);
        ctx.lineTo(45, 83);
        ctx.closePath();
        ctx.fill();

        // 4. РАСТРЁПАННЫЕ СОЛОМЕННЫЕ ВОЛОСЫ «ПОД ГОРШОК»
        ctx.fillStyle = '#e2be58'; // Соломенный блонд
        ctx.beginPath();
        ctx.moveTo(39, 60);
        ctx.quadraticCurveTo(36, 28, 64, 26);
        ctx.quadraticCurveTo(92, 28, 89, 60);
        // Неровная, грубо подстриженная чёлка по лбу
        ctx.lineTo(83, 52);
        ctx.lineTo(77, 56);
        ctx.lineTo(71, 50);
        ctx.lineTo(64, 55);
        ctx.lineTo(57, 50);
        ctx.lineTo(50, 56);
        ctx.lineTo(45, 52);
        ctx.closePath();
        ctx.fill();

        // Торчащие вихры на макушке
        ctx.fillStyle = '#edd078';
        ctx.beginPath();
        ctx.moveTo(58, 28); ctx.lineTo(54, 19); ctx.lineTo(65, 26);
        ctx.moveTo(66, 27); ctx.lineTo(73, 20); ctx.lineTo(72, 28);
        ctx.fill();

        // 5. ГЛАЗА, ВЕСНУШКИ, НОС КАРТОШКОЙ И ПРОСТОДУШНАЯ УЛЫБКА
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(53, 66, 4.5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 66, 4.5, 2.5, 0, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#5d8aa8'; // Серо-голубые глаза
        ctx.beginPath(); ctx.arc(53, 66, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 66, 2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(53.8, 65.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75.8, 65.2, 0.7, 0, Math.PI * 2); ctx.fill();

        // Лохматые светло-русые брови
        ctx.strokeStyle = '#a8842c';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(47, 60); ctx.lineTo(58, 61); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(70, 61); ctx.lineTo(81, 60); ctx.stroke();

        // Веснушки на переносице и щеках
        ctx.fillStyle = '#b5744c';
        ctx.fillRect(48, 72, 1.5, 1.5); ctx.fillRect(52, 74, 1.5, 1.5); ctx.fillRect(50, 76, 1.5, 1.5);
        ctx.fillRect(79, 72, 1.5, 1.5); ctx.fillRect(75, 74, 1.5, 1.5); ctx.fillRect(77, 76, 1.5, 1.5);

        // Широковатый деревенский нос
        ctx.fillStyle = '#d49876';
        ctx.beginPath();
        ctx.moveTo(64, 63);
        ctx.lineTo(68, 75);
        ctx.quadraticCurveTo(64, 78, 60, 75);
        ctx.closePath();
        ctx.fill();

        // Простая открытая улыбка
        ctx.strokeStyle = '#7c4d36';
        ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(55, 84); ctx.quadraticCurveTo(64, 89, 73, 84); ctx.stroke();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 20);
        ctx.lineTo(39, 52);
        ctx.lineTo(44, 82);
        ctx.lineTo(64, 98);
        ctx.lineTo(64, 128);
        ctx.lineTo(20, 128);
        ctx.lineTo(38, 102);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },


    townswoman() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ОДЕЖДА: Простое шерстяное платье, корсаж на шнуровке и полотняная косынка
        ctx.fillStyle = '#6d4c41'; // Тёплое домотканое платье
        ctx.beginPath();
        ctx.moveTo(22, 128);
        ctx.lineTo(40, 102);
        ctx.lineTo(88, 102);
        ctx.lineTo(106, 128);
        ctx.closePath();
        ctx.fill();

        // Белая полотняная косынка-воротник на плечах
        ctx.fillStyle = '#eceff1';
        ctx.beginPath();
        ctx.moveTo(38, 102);
        ctx.lineTo(64, 122);
        ctx.lineTo(90, 102);
        ctx.lineTo(82, 98);
        ctx.lineTo(64, 112);
        ctx.lineTo(46, 98);
        ctx.closePath();
        ctx.fill();

        // Шнуровка корсажа внизу по центру
        ctx.strokeStyle = '#3e2723';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(60, 121); ctx.lineTo(68, 125);
        ctx.moveTo(68, 121); ctx.lineTo(60, 125);
        ctx.stroke();

        // 2. ЗАДНИЙ ПЛАН: Пышный белый средневековый чепец и пряди волос
        ctx.fillStyle = '#dfe4ea'; // Основной объём чепца
        ctx.beginPath();
        ctx.arc(64, 52, 31, Math.PI * 0.85, Math.PI * 2.15);
        ctx.closePath();
        ctx.fill();

        // Выбивающиеся из-под чепца медово-русые локоны по бокам
        ctx.fillStyle = '#c88a36';
        ctx.beginPath();
        ctx.ellipse(41, 66, 6, 18, 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(87, 66, 6, 18, -0.15, 0, Math.PI * 2);
        ctx.fill();

        // 3. ШЕЯ И ЛИЦО (Мягкий, открытый овал со здоровым румянцем)
        ctx.fillStyle = '#e8b89a';
        ctx.fillRect(55, 86, 18, 16);

        ctx.fillStyle = '#fbd4bc';
        ctx.beginPath();
        ctx.moveTo(45, 52);
        ctx.lineTo(83, 52);
        ctx.lineTo(81, 80);
        ctx.lineTo(64, 96);
        ctx.lineTo(47, 80);
        ctx.closePath();
        ctx.fill();

        // Лёгкий деревенский румянец на щёчках
        ctx.fillStyle = 'rgba(231, 76, 60, 0.16)';
        ctx.beginPath(); ctx.arc(50, 74, 5.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(78, 74, 5.5, 0, Math.PI * 2); ctx.fill();

        // 4. ОБОДОК ЧЕПЦА И ЧЁЛКА НА ЛБУ
        // Тёплая медовая чёлка, разделённая на пробор
        ctx.fillStyle = '#d99b43';
        ctx.beginPath();
        ctx.moveTo(44, 54);
        ctx.quadraticCurveTo(54, 44, 64, 50);
        ctx.quadraticCurveTo(74, 44, 84, 54);
        ctx.lineTo(82, 46);
        ctx.quadraticCurveTo(64, 38, 46, 46);
        ctx.closePath();
        ctx.fill();

        // Белоснежный отворот чепца по верхнему краю
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(36, 54);
        ctx.quadraticCurveTo(64, 24, 92, 54);
        ctx.lineTo(87, 56);
        ctx.quadraticCurveTo(64, 32, 41, 56);
        ctx.closePath();
        ctx.fill();

        // 5. ГЛАЗА, БРОВИ, ВЕСНУШКИ И ПРИВЕТЛИВАЯ УЛЫБКА
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(54, 65, 4.5, 2.3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 65, 4.5, 2.3, 0, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#27ae60'; // Живые зелёные глаза
        ctx.beginPath(); ctx.arc(54, 65, 1.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 65, 1.9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(54.7, 64.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74.7, 64.2, 0.7, 0, Math.PI * 2); ctx.fill();

        // Аккуратные русые брови
        ctx.strokeStyle = '#9c6823';
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(48, 59); ctx.quadraticCurveTo(54, 57, 59, 59); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(69, 59); ctx.quadraticCurveTo(74, 57, 80, 59); ctx.stroke();

        // Пара мелких веснушек
        ctx.fillStyle = '#c4835a';
        ctx.fillRect(50, 71, 1.4, 1.4);
        ctx.fillRect(77, 71, 1.4, 1.4);

        // Небольшой аккуратный носик
        ctx.strokeStyle = '#d99e7c';
        ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(64, 62); ctx.lineTo(62, 74); ctx.lineTo(66, 74); ctx.stroke();

        // Мягкие тёплые губы в доброй улыбке
        ctx.fillStyle = '#d97b74';
        ctx.beginPath();
        ctx.ellipse(64, 83, 5, 1.8, 0, 0, Math.PI * 2);
        ctx.fill();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Лёгкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.beginPath();
        ctx.moveTo(64, 24);
        ctx.lineTo(36, 54);
        ctx.lineTo(47, 80);
        ctx.lineTo(64, 96);
        ctx.lineTo(64, 128);
        ctx.lineTo(22, 128);
        ctx.lineTo(40, 102);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    elder() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ОДЕЖДА: Простая тёмно-коричневая средневековая ряса / туника
        ctx.fillStyle = '#4e342e';
        ctx.beginPath();
        ctx.moveTo(20, 128);
        ctx.lineTo(38, 102);
        ctx.lineTo(90, 102);
        ctx.lineTo(108, 128);
        ctx.closePath();
        ctx.fill();

        // Светлый полотняный воротник и верёвочная завязка
        ctx.fillStyle = '#bcaaa4';
        ctx.beginPath();
        ctx.moveTo(46, 102);
        ctx.lineTo(64, 118);
        ctx.lineTo(82, 102);
        ctx.closePath();
        ctx.fill();

        // 2. ДЕРЕВЯННЫЙ ПОСОХ СТАРЦА (Слева по диагонали)
        ctx.strokeStyle = '#6d4c41';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(26, 44);
        ctx.lineTo(16, 128);
        ctx.stroke();

        // Сучок на верхушке посоха
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(25, 52);
        ctx.lineTo(19, 46);
        ctx.stroke();

        // 3. ОСТАТКИ СЕДЫХ ВОЛОС НА ВИСКАХ И УШИ
        ctx.fillStyle = '#cfd8dc'; // Седые пучки волос по бокам
        ctx.beginPath(); ctx.arc(41, 60, 8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(87, 60, 8, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#d7a184'; // Уши
        ctx.beginPath(); ctx.ellipse(40, 68, 4.5, 7.5, -0.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(88, 68, 4.5, 7.5, 0.1, 0, Math.PI * 2); ctx.fill();

        // 4. ГОЛОВА И ВЫСОКИЙ ЛЫСЫЙ ЧЕРЕП
        ctx.fillStyle = '#e5b296';
        ctx.beginPath();
        ctx.moveTo(43, 52);
        ctx.quadraticCurveTo(43, 24, 64, 24); // Гладкий купол лысой головы
        ctx.quadraticCurveTo(85, 24, 85, 52);
        ctx.lineTo(84, 82);
        ctx.lineTo(64, 98);
        ctx.lineTo(44, 82);
        ctx.closePath();
        ctx.fill();

        // Световой блик на лысой макушке
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.beginPath();
        ctx.ellipse(68, 33, 9, 4, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Морщинки мудрости на высоком лбу
        ctx.strokeStyle = '#c48d70';
        ctx.lineWidth = 1.1;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(52, 43); ctx.quadraticCurveTo(64, 41, 76, 43);
        ctx.moveTo(55, 48); ctx.quadraticCurveTo(64, 46, 73, 48);
        ctx.stroke();

        // 5. ПЫШНАЯ СЕДАЯ БОРОДА И ГУСТЫЕ УСЫ
        ctx.fillStyle = '#eceff1'; // Основная масса седой бороды
        ctx.beginPath();
        ctx.moveTo(44, 76);
        ctx.lineTo(38, 102);
        ctx.quadraticCurveTo(64, 126, 90, 102);
        ctx.lineTo(84, 76);
        ctx.quadraticCurveTo(64, 86, 44, 76);
        ctx.closePath();
        ctx.fill();

        // Седые усы поверх бороды
        ctx.fillStyle = '#cfd8dc';
        ctx.beginPath();
        ctx.moveTo(48, 78);
        ctx.quadraticCurveTo(64, 73, 80, 78);
        ctx.lineTo(82, 85);
        ctx.quadraticCurveTo(64, 81, 46, 85);
        ctx.closePath();
        ctx.fill();

        // 6. ГЛАЗА, ГУСТЫЕ СЕДЫЕ БРОВИ И НОС
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(54, 64, 4.2, 2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 64, 4.2, 2, 0, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#607d8b'; // Мудрые серо-стальные глаза
        ctx.beginPath(); ctx.arc(54, 64, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 64, 1.8, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(54.6, 63.3, 0.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74.6, 63.3, 0.6, 0, Math.PI * 2); ctx.fill();

        // Густые лохматые седые брови
        ctx.fillStyle = '#eceff1';
        ctx.beginPath();
        ctx.moveTo(46, 58); ctx.quadraticCurveTo(54, 54, 60, 59); ctx.lineTo(59, 61); ctx.quadraticCurveTo(53, 57, 46, 60); ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(82, 58); ctx.quadraticCurveTo(74, 54, 68, 59); ctx.lineTo(69, 61); ctx.quadraticCurveTo(75, 57, 82, 60); ctx.closePath(); ctx.fill();

        // Характерный нос старца
        ctx.fillStyle = '#d49876';
        ctx.beginPath();
        ctx.moveTo(64, 61);
        ctx.lineTo(68, 73);
        ctx.quadraticCurveTo(64, 76, 60, 73);
        ctx.closePath();
        ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Лёгкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 24);
        ctx.quadraticCurveTo(43, 24, 43, 52);
        ctx.lineTo(38, 102);
        ctx.lineTo(20, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    guard() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. АЛЕБАРДА / КОПЬЁ СТРАЖНИКА НА ЗАДНЕМ ПЛАНЕ (Справа вертикально)
        ctx.strokeStyle = '#5d4037'; // Деревянное древко
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(106, 28);
        ctx.lineTo(106, 128);
        ctx.stroke();

        // Стальной наконечник копья-алебарды
        ctx.fillStyle = '#bdc3c7';
        ctx.beginPath();
        ctx.moveTo(106, 6);
        ctx.lineTo(114, 26);
        ctx.lineTo(106, 32);
        ctx.lineTo(98, 26);
        ctx.closePath();
        ctx.fill();

        // Боковой топор-лезвие алебарды
        ctx.fillStyle = '#95a5a6';
        ctx.beginPath();
        ctx.moveTo(108, 16);
        ctx.quadraticCurveTo(124, 14, 122, 34);
        ctx.lineTo(108, 28);
        ctx.closePath();
        ctx.fill();

        // 2. ДОСПЕХИ, КОЛЬЧУГА И СИНИЙ ГОРОДСКОЙ ТАБАРД
        // Латные наплечники
        ctx.fillStyle = '#57606f';
        ctx.beginPath();
        ctx.moveTo(18, 128);
        ctx.lineTo(36, 98);
        ctx.lineTo(92, 98);
        ctx.lineTo(110, 128);
        ctx.closePath();
        ctx.fill();

        // Синий геральдический табард стражи по центру
        ctx.fillStyle = '#1e3799';
        ctx.beginPath();
        ctx.moveTo(42, 100);
        ctx.lineTo(36, 128);
        ctx.lineTo(92, 128);
        ctx.lineTo(86, 100);
        ctx.closePath();
        ctx.fill();

        // Золотая окантовка табарда и нагрудная пряжка
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(43, 102); ctx.lineTo(38, 128);
        ctx.moveTo(85, 102); ctx.lineTo(90, 128);
        ctx.stroke();

        // Кольчужная бармица на шее
        ctx.fillStyle = '#3d4552';
        ctx.beginPath();
        ctx.moveTo(44, 82);
        ctx.lineTo(84, 82);
        ctx.lineTo(86, 104);
        ctx.lineTo(64, 114);
        ctx.lineTo(42, 104);
        ctx.closePath();
        ctx.fill();

        // 3. ЛИЦО СТРАЖНИКА (Суровое, бдительное, с усами и щетиной)
        ctx.fillStyle = '#e5b296';
        ctx.beginPath();
        ctx.moveTo(44, 54);
        ctx.lineTo(84, 54);
        ctx.lineTo(82, 82);
        ctx.lineTo(64, 96);
        ctx.lineTo(46, 82);
        ctx.closePath();
        ctx.fill();

        // Лёгкая тёмная щетина на челюсти
        ctx.fillStyle = 'rgba(30, 35, 42, 0.22)';
        ctx.beginPath();
        ctx.moveTo(46, 76);
        ctx.lineTo(64, 96);
        ctx.lineTo(82, 76);
        ctx.lineTo(81, 83);
        ctx.lineTo(64, 96);
        ctx.lineTo(47, 83);
        ctx.closePath();
        ctx.fill();

        // 4. СТАЛЬНОЙ ШЛЕМ-ШАПЕЛЬ С ШИРОКИМИ ПОЛЯМИ И НАНОСНИКОМ
        // Купол шлема
        ctx.fillStyle = '#718093';
        ctx.beginPath();
        ctx.moveTo(38, 48);
        ctx.quadraticCurveTo(42, 22, 64, 20);
        ctx.quadraticCurveTo(86, 22, 90, 48);
        ctx.closePath();
        ctx.fill();

        // Широкие защитные поля шапели
        ctx.fillStyle = '#8395a7';
        ctx.beginPath();
        ctx.moveTo(26, 52);
        ctx.quadraticCurveTo(64, 42, 102, 52);
        ctx.lineTo(96, 57);
        ctx.quadraticCurveTo(64, 49, 32, 57);
        ctx.closePath();
        ctx.fill();

        // Металлические заклёпки на ободе шлема
        ctx.fillStyle = '#dcdde1';
        ctx.beginPath(); ctx.arc(44, 48, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(64, 45, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(84, 48, 1.5, 0, Math.PI * 2); ctx.fill();

        // Короткий стальной наносник
        ctx.fillStyle = '#57606f';
        ctx.fillRect(62, 50, 4, 15);

        // 5. БДИТЕЛЬНЫЙ ВЗГЛЯД, БРОВИ И УСЫ ОФИЦЕРА
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(53, 63, 4.5, 2, -0.08, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 63, 4.5, 2, 0.08, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#2c3e50';
        ctx.beginPath(); ctx.arc(53, 63, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 63, 1.8, 0, Math.PI * 2); ctx.fill();

        // Сдвинутые строгие брови
        ctx.strokeStyle = '#2f241d';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(46, 57); ctx.lineTo(58, 59); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(82, 57); ctx.lineTo(70, 59); ctx.stroke();

        // Аккуратные уставные усы
        ctx.fillStyle = '#3b2c22';
        ctx.beginPath();
        ctx.moveTo(51, 80);
        ctx.quadraticCurveTo(64, 75, 77, 80);
        ctx.lineTo(79, 84);
        ctx.quadraticCurveTo(64, 80, 49, 84);
        ctx.closePath();
        ctx.fill();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
        ctx.beginPath();
        ctx.moveTo(64, 20);
        ctx.quadraticCurveTo(42, 22, 38, 48);
        ctx.lineTo(26, 52);
        ctx.lineTo(46, 82);
        ctx.lineTo(36, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

bandit_queen() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ДВА СКРЕЩЁННЫХ БОЕВЫХ ТОПОРА ЗА СПИНОЙ (На заднем плане)
        const drawBackAxe = (cx, cy, angleDeg, flip) => {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate((Math.PI / 180) * angleDeg);
            if (flip) ctx.scale(-1, 1);

            // Деревянное древко топора
            ctx.strokeStyle = '#5c3e26';
            ctx.lineWidth = 4.5;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(0, -36);
            ctx.lineTo(0, 62);
            ctx.stroke();

            // Стальной обух и полукруглое лезвие топора
            ctx.fillStyle = '#7f8c8d';
            ctx.beginPath();
            ctx.moveTo(-4, -30);
            ctx.lineTo(18, -38);
            ctx.quadraticCurveTo(24, -22, 18, -8);
            ctx.lineTo(-4, -16);
            ctx.closePath();
            ctx.fill();

            // Светлая заточенная кромка лезвия
            ctx.fillStyle = '#dfe6e9';
            ctx.beginPath();
            ctx.moveTo(15, -36);
            ctx.lineTo(18, -38);
            ctx.quadraticCurveTo(24, -22, 18, -8);
            ctx.lineTo(15, -10);
            ctx.quadraticCurveTo(20, -22, 15, -36);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        };

        drawBackAxe(34, 62, -32, true);  // Левый топор
        drawBackAxe(94, 62, 32, false);  // Правый топор

        // 2. ПЫШНЫЕ РАСТРЁПАННЫЕ ОГНЕННО-РЫЖИЕ ВОЛОСЫ (Задний план)
        ctx.fillStyle = '#9c3416';
        ctx.beginPath();
        ctx.moveTo(36, 46);
        ctx.quadraticCurveTo(20, 82, 22, 126);
        ctx.lineTo(106, 126);
        ctx.quadraticCurveTo(108, 82, 92, 46);
        ctx.closePath();
        ctx.fill();

        // 3. КОЖАНАЯ БРОНЯ РАЗБОЙНИЦЫ И МЕХОВОЙ ВОРОТНИК
        ctx.fillStyle = '#3b2618';
        ctx.beginPath();
        ctx.moveTo(20, 128);
        ctx.lineTo(38, 100);
        ctx.lineTo(90, 100);
        ctx.lineTo(108, 128);
        ctx.closePath();
        ctx.fill();

        // Тёмный меховой воротник и золотые заклёпки
        ctx.fillStyle = '#241914';
        ctx.beginPath();
        ctx.moveTo(34, 102);
        ctx.quadraticCurveTo(64, 116, 94, 102);
        ctx.lineTo(88, 94);
        ctx.quadraticCurveTo(64, 106, 40, 94);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#d4af37';
        ctx.beginPath(); ctx.arc(42, 114, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(86, 114, 2, 0, Math.PI * 2); ctx.fill();

        // 4. ШЕЯ И ДЕРЗКОЕ ЛИЦО ПРЕДВОДИТЕЛЬНИЦЫ
        ctx.fillStyle = '#dfb094';
        ctx.fillRect(55, 86, 18, 16);

        ctx.fillStyle = '#f5c7ab';
        ctx.beginPath();
        ctx.moveTo(45, 50);
        ctx.lineTo(83, 50);
        ctx.lineTo(81, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(47, 78);
        ctx.closePath();
        ctx.fill();

        // 5. КОЖАНАЯ БАНДАНА-ПОВЯЗКА НА ЛБУ И РЫЖИЕ ПРЯДИ
        // Верхняя копна рыжих волос
        ctx.fillStyle = '#c4451c';
        ctx.beginPath();
        ctx.moveTo(40, 52);
        ctx.quadraticCurveTo(42, 24, 64, 22);
        ctx.quadraticCurveTo(86, 24, 88, 52);
        ctx.closePath();
        ctx.fill();

        // Тёмно-багровая разбойничья бандана на лбу
        ctx.fillStyle = '#6e1919';
        ctx.beginPath();
        ctx.moveTo(42, 46);
        ctx.quadraticCurveTo(64, 42, 86, 46);
        ctx.lineTo(85, 54);
        ctx.quadraticCurveTo(64, 50, 43, 54);
        ctx.closePath();
        ctx.fill();

        // Развевающийся узел-хвост банданы сбоку
        ctx.fillStyle = '#521111';
        ctx.beginPath();
        ctx.moveTo(85, 48);
        ctx.lineTo(100, 42);
        ctx.lineTo(96, 54);
        ctx.lineTo(102, 60);
        ctx.lineTo(85, 54);
        ctx.closePath();
        ctx.fill();

        // Непослушные рыжие пряди по бокам лица
        ctx.fillStyle = '#d35400';
        ctx.beginPath();
        ctx.moveTo(44, 52); ctx.quadraticCurveTo(38, 70, 43, 86); ctx.lineTo(48, 82); ctx.quadraticCurveTo(44, 66, 48, 53);
        ctx.moveTo(84, 52); ctx.quadraticCurveTo(90, 70, 85, 86); ctx.lineTo(80, 82); ctx.quadraticCurveTo(84, 66, 80, 53);
        ctx.fill();

        // 6. ХИТРЫЙ ПРИЩУР ИЗУМРУДНЫХ ГЛАЗ, ШРАМ И САМОДОВОЛЬНАЯ УХМЫЛКА
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(54, 63, 4.5, 1.8, -0.08, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 63, 4.5, 1.8, 0.08, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#27ae60'; // Острые зелёные глаза
        ctx.beginPath(); ctx.arc(54, 63, 1.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 63, 1.7, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(54.6, 62.3, 0.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74.6, 62.3, 0.6, 0, Math.PI * 2); ctx.fill();

        // Суровые рыжие брови
        ctx.strokeStyle = '#6e230b';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(47, 57); ctx.lineTo(59, 59); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(81, 57); ctx.lineTo(69, 59); ctx.stroke();

        // Косой боевой шрам через переносицу и правую щеку
        ctx.strokeStyle = '#b71c1c';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(60, 65);
        ctx.lineTo(75, 76);
        ctx.stroke();

        // Аккуратный нос и дерзкая кривая ухмылка
        ctx.strokeStyle = '#cf9778';
        ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(64, 60); ctx.lineTo(62, 73); ctx.lineTo(66, 73); ctx.stroke();

        ctx.fillStyle = '#b54949';
        ctx.beginPath();
        ctx.moveTo(56, 82);
        ctx.quadraticCurveTo(65, 86, 73, 80);
        ctx.quadraticCurveTo(64, 88, 56, 82);
        ctx.closePath();
        ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 22);
        ctx.quadraticCurveTo(42, 24, 40, 52);
        ctx.lineTo(47, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(64, 128);
        ctx.lineTo(20, 128);
        ctx.lineTo(38, 100);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    grigory() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ОДЕЖДА: Нарядный синий камзол путешественника с золотой отделкой
        ctx.fillStyle = '#1b4f72';
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.quadraticCurveTo(28, 96, 64, 96);
        ctx.quadraticCurveTo(100, 96, 114, 128);
        ctx.closePath();
        ctx.fill();

        // Пышный белый кружевной воротник-жабо
        ctx.fillStyle = '#f8f9fa';
        ctx.beginPath();
        ctx.moveTo(46, 100);
        ctx.lineTo(64, 126);
        ctx.lineTo(82, 100);
        ctx.closePath();
        ctx.fill();

        // Золотая вышивка и пуговицы на камзоле
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(44, 102); ctx.lineTo(58, 128);
        ctx.moveTo(84, 102); ctx.lineTo(70, 128);
        ctx.stroke();

        // 2. ПЫШНЫЕ КАШТАНОВЫЕ ЛОКОНЫ ПО БОКАМ И УШИ
        ctx.fillStyle = '#5c3a21';
        ctx.beginPath();
        ctx.arc(36, 66, 12, 0, Math.PI * 2);
        ctx.arc(92, 66, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#eebc9e';
        ctx.beginPath(); ctx.ellipse(37, 68, 4.5, 7, -0.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(91, 68, 4.5, 7, 0.1, 0, Math.PI * 2); ctx.fill();

        // 3. КРУГЛОЕ ЩЕКАСТОЕ ЛИЦО ГРИГОРИЯ
        ctx.fillStyle = '#fbd2b8';
        ctx.beginPath();
        ctx.moveTo(42, 48);
        ctx.lineTo(86, 48);
        // Выраженные пухлые щёки по бокам
        ctx.bezierCurveTo(96, 60, 96, 84, 82, 92);
        ctx.quadraticCurveTo(64, 104, 46, 92);
        ctx.bezierCurveTo(32, 84, 32, 60, 42, 48);
        ctx.closePath();
        ctx.fill();

        // Здоровый румянец на пухлых щеках
        ctx.fillStyle = 'rgba(231, 76, 60, 0.22)';
        ctx.beginPath(); ctx.arc(45, 73, 7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(83, 73, 7, 0, Math.PI * 2); ctx.fill();

        // 4. УХОЖЕННАЯ КАШТАНОВАЯ БОРОДА И ЩЕГОЛЬСКИЕ УСЫ
        ctx.fillStyle = '#6e472b';
        ctx.beginPath();
        ctx.moveTo(41, 74);
        ctx.quadraticCurveTo(38, 98, 64, 108);
        ctx.quadraticCurveTo(90, 98, 87, 74);
        ctx.quadraticCurveTo(64, 86, 41, 74);
        ctx.closePath();
        ctx.fill();

        // Пышные закрученные усы
        ctx.fillStyle = '#4e311d';
        ctx.beginPath();
        ctx.moveTo(46, 79);
        ctx.quadraticCurveTo(64, 72, 82, 79);
        ctx.quadraticCurveTo(88, 76, 86, 82);
        ctx.quadraticCurveTo(64, 80, 42, 82);
        ctx.quadraticCurveTo(40, 76, 46, 79);
        ctx.closePath();
        ctx.fill();

        // Приветливая улыбка под усами
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(64, 84, 6, 2.2, 0, 0, Math.PI);
        ctx.fill();

        // 5. ЖИВЫЕ ЛЮБОПЫТНЫЕ ГЛАЗА, БРОВИ И НОС КАРТОШКОЙ
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(52, 61, 4.8, 2.6, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(76, 61, 4.8, 2.6, 0, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#2980b9'; // Ясные синие глаза рассказчика
        ctx.beginPath(); ctx.arc(52, 61, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 61, 2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(52.8, 60.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76.8, 60.2, 0.7, 0, Math.PI * 2); ctx.fill();

        // Выразительные приподнятые брови
        ctx.strokeStyle = '#4e311d';
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(45, 55); ctx.quadraticCurveTo(52, 51, 58, 55); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(70, 55); ctx.quadraticCurveTo(76, 51, 83, 55); ctx.stroke();

        // Округлый мясистый нос
        ctx.fillStyle = '#e0a587';
        ctx.beginPath();
        ctx.arc(64, 69, 5.5, 0, Math.PI * 2);
        ctx.fill();

        // 6. ПЫШНЫЙ БЕРЕТ БАРДА-ЛЕТОПИСЦА С БОЛЬШИМ БЕЛЫМ ПЕРОМ (В духе Воло)
        ctx.save();
        ctx.translate(64, 42);
        ctx.rotate((Math.PI / 180) * -8);
        ctx.translate(-64, -42);

        // Лазурно-синий пышный берет
        ctx.fillStyle = '#2471a3';
        ctx.beginPath();
        ctx.ellipse(64, 34, 32, 16, 0, 0, Math.PI * 2);
        ctx.fill();

        // Золотой ободок-повязка берета
        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.moveTo(38, 44);
        ctx.quadraticCurveTo(64, 39, 90, 44);
        ctx.lineTo(88, 49);
        ctx.quadraticCurveTo(64, 44, 40, 49);
        ctx.closePath();
        ctx.fill();

        // Пышное белое перо, выходящее из золотой пряжки справа
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(82, 42);
        ctx.quadraticCurveTo(104, 18, 118, 6);
        ctx.quadraticCurveTo(110, 26, 86, 44);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffd875';
        ctx.beginPath(); ctx.arc(82, 43, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 18);
        ctx.lineTo(32, 34);
        ctx.lineTo(34, 76);
        ctx.lineTo(46, 98);
        ctx.lineTo(14, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    prazil() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. МАССИВНЫЙ БОЕВОЙ МОЛОТ ЗА СПИНОЙ С ЛАЗУРНЫМ СВЕЧЕНИЕМ (Справа сверху)
        ctx.save();
        ctx.translate(98, 42);
        ctx.rotate((Math.PI / 180) * 28);

        ctx.strokeStyle = '#3d2817';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 96);
        ctx.stroke();

        ctx.fillStyle = 'rgba(0, 210, 255, 0.28)';
        ctx.beginPath();
        ctx.arc(0, -10, 22, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#4a5568';
        ctx.strokeStyle = '#1a202c';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(-16, -20, 32, 18, 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#a0aec0';
        ctx.fillRect(-14, -18, 28, 5);
        ctx.fillStyle = '#70e1f5';
        ctx.fillRect(-2, -17, 4, 12);
        ctx.restore();

        // 2. ЗАГНУТЫЕ НАЗАД РОГА И ШИПЫ НА ЗАТЫЛКЕ (Задний план)
        ctx.fillStyle = '#1c232b';
        ctx.beginPath();
        ctx.moveTo(74, 38);
        ctx.bezierCurveTo(84, 14, 106, 10, 114, 24);
        ctx.bezierCurveTo(102, 20, 90, 26, 84, 44);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(86, 52);
        ctx.quadraticCurveTo(106, 46, 118, 38);
        ctx.lineTo(96, 62);
        ctx.closePath();
        ctx.fill();

        // 3. ЧЕШУЙЧАТАЯ ШЕЯ И ТЁМНО-СТАЛЬНОЙ НАГРУДНИК С РЕМНЁМ
        ctx.fillStyle = '#1a2228';
        ctx.beginPath();
        ctx.moveTo(64, 76);
        ctx.quadraticCurveTo(96, 78, 112, 128);
        ctx.lineTo(36, 128);
        ctx.quadraticCurveTo(46, 98, 54, 84);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#2d3748';
        ctx.beginPath();
        ctx.moveTo(42, 104);
        ctx.lineTo(104, 104);
        ctx.lineTo(114, 128);
        ctx.lineTo(34, 128);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#1f1610';
        ctx.beginPath();
        ctx.moveTo(48, 96);
        ctx.lineTo(78, 128);
        ctx.lineTo(92, 128);
        ctx.lineTo(60, 94);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#a0aec0';
        ctx.beginPath(); ctx.arc(58, 102, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(68, 112, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(78, 122, 1.8, 0, Math.PI * 2); ctx.fill();

        // 4. ВЕРХНЯЯ ЧЕЛЮСТЬ И ЧЕРЕП ЧЁРНОГО КОБОЛЬДА В ПРОФИЛЬ ВЛЕВО
        ctx.fillStyle = '#222b33';
        ctx.beginPath();
        ctx.moveTo(90, 48);
        ctx.lineTo(68, 34);
        ctx.lineTo(16, 48);
        ctx.lineTo(20, 60);
        ctx.lineTo(60, 68);
        ctx.lineTo(88, 72);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#4a5c6b';
        ctx.beginPath();
        ctx.moveTo(22, 49);
        ctx.lineTo(54, 42);
        ctx.lineTo(50, 47);
        ctx.lineTo(24, 53);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#0d1114';
        ctx.beginPath(); ctx.arc(22, 50, 2, 0, Math.PI * 2); ctx.fill();

        // 5. ШИРОКО РАСПАХНУТАЯ ПАСТЬ, АЛЫЙ ЯЗЫК И НИЖНЯЯ ЧЕЛЮСТЬ
        ctx.fillStyle = '#2a0d12';
        ctx.beginPath();
        ctx.moveTo(20, 59);
        ctx.lineTo(64, 68);
        ctx.lineTo(28, 86);
        ctx.lineTo(24, 79);
        ctx.lineTo(48, 69);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#b8323f';
        ctx.beginPath();
        ctx.moveTo(54, 70);
        ctx.quadraticCurveTo(38, 74, 28, 74);
        ctx.quadraticCurveTo(38, 80, 56, 74);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#2e3a44';
        ctx.beginPath();
        ctx.moveTo(60, 67);
        ctx.lineTo(24, 80);
        ctx.lineTo(30, 89);
        ctx.lineTo(68, 86);
        ctx.lineTo(88, 72);
        ctx.closePath();
        ctx.fill();

        // 6. ОСТРЫЕ БЕЛЫЕ КЛЫКИ В РАСКРЫТОЙ ПАСТИ
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.moveTo(22, 59); ctx.lineTo(25, 67); ctx.lineTo(28, 60); ctx.fill();
        ctx.beginPath(); ctx.moveTo(31, 61); ctx.lineTo(34, 68); ctx.lineTo(37, 62); ctx.fill();
        ctx.beginPath(); ctx.moveTo(40, 63); ctx.lineTo(43, 69); ctx.lineTo(46, 64); ctx.fill();
        ctx.beginPath(); ctx.moveTo(49, 65); ctx.lineTo(52, 70); ctx.lineTo(55, 66); ctx.fill();

        ctx.beginPath(); ctx.moveTo(26, 80); ctx.lineTo(29, 73); ctx.lineTo(32, 78); ctx.fill();
        ctx.beginPath(); ctx.moveTo(35, 77); ctx.lineTo(38, 71); ctx.lineTo(41, 75); ctx.fill();
        ctx.beginPath(); ctx.moveTo(44, 74); ctx.lineTo(47, 69); ctx.lineTo(50, 72); ctx.fill();

        // 7. ХИЩНЫЙ СВЕТЯЩИЙСЯ ГОЛУБОЙ ГЛАЗ
        ctx.fillStyle = '#70e1f5';
        ctx.beginPath();
        ctx.moveTo(56, 46);
        ctx.lineTo(70, 42);
        ctx.lineTo(65, 51);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#0d1114';
        ctx.fillRect(62, 43.5, 1.5, 6);

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(61, 45.5, 1, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#0d1114';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(53, 43);
        ctx.lineTo(71, 40);
        ctx.stroke();

        // 8. ФРАГМЕНТ КРУГЛОГО ЩИТА НА ПЕРЕДНЕМ ПЛАНЕ (Слева внизу в перспективе)
        ctx.save();
        ctx.translate(18, 114);
        ctx.rotate((Math.PI / 180) * -18);

        // Внешний бронзово-латунный обод щита
        ctx.fillStyle = '#8c6239';
        ctx.strokeStyle = '#2b190d';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.ellipse(0, 0, 22, 28, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Внутреннее тёмное дерево щита
        ctx.fillStyle = '#4a311d';
        ctx.beginPath();
        ctx.ellipse(0, 0, 17, 23, 0, 0, Math.PI * 2);
        ctx.fill();

        // Вертикальные стыки досок щита
        ctx.strokeStyle = '#2b190d';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-6, -21); ctx.lineTo(-6, 21);
        ctx.moveTo(6, -21); ctx.lineTo(6, 21);
        ctx.stroke();

        // Заклёпки по бронзовому ободу
        ctx.fillStyle = '#d4af37';
        [-1.1, -0.4, 0.3, 1.0].forEach(ang => {
            ctx.beginPath();
            ctx.arc(19.5 * Math.cos(ang), 25.5 * Math.sin(ang), 1.4, 0, Math.PI * 2);
            ctx.fill();
        });

        // Выпуклый стальной умбон в центре щита
        ctx.fillStyle = '#718093';
        ctx.strokeStyle = '#1a202c';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.ellipse(2, 0, 7, 9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Световой блик на умбоне
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.ellipse(3.5, -2.5, 2.5, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 9. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень снизу)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.moveTo(24, 80);
        ctx.lineTo(68, 86);
        ctx.lineTo(88, 72);
        ctx.lineTo(112, 128);
        ctx.lineTo(34, 128);
        ctx.lineTo(54, 85);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    oleg() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. БЕЛАЯ РУБАХА ХОЗЯИНА ТОРГОВОГО ПОСТА И СИНЕ-СЕРАЯ ПЕРЕВЯЗЬ
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(36, 98);
        ctx.lineTo(92, 98);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        // Сине-серая подтяжка/перевязь на правом плече
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(86, 98);
        ctx.lineTo(98, 98);
        ctx.lineTo(112, 128);
        ctx.lineTo(98, 128);
        ctx.closePath();
        ctx.fill();

        // Широкий отложной воротник рубахи
        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(38, 98);
        ctx.lineTo(52, 118);
        ctx.lineTo(64, 106);
        ctx.lineTo(76, 118);
        ctx.lineTo(90, 98);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Зелёная вышивка на уголках воротника (как на оригинальном портрете)
        ctx.strokeStyle = '#3f6212';
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(47, 111); ctx.lineTo(51, 115);
        ctx.moveTo(49, 109); ctx.lineTo(53, 113);
        ctx.moveTo(81, 111); ctx.lineTo(77, 115);
        ctx.moveTo(79, 109); ctx.lineTo(75, 113);
        ctx.stroke();

        // 2. ШЕЯ И УШИ ОЛЕГА
        ctx.fillStyle = '#cfa07e';
        ctx.fillRect(55, 86, 18, 18);

        ctx.fillStyle = '#d9ab89';
        ctx.beginPath(); ctx.ellipse(42, 65, 4.2, 6.8, -0.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(86, 65, 4.2, 6.8, 0.1, 0, Math.PI * 2); ctx.fill();

        // 3. ОБВЕТРЕННОЕ, ДОБРОДУШНОЕ И СЛЕГКА УСТАЛОЕ ЛИЦО ОЛЕГА
        ctx.fillStyle = '#e5b896';
        ctx.beginPath();
        ctx.moveTo(43, 46);
        ctx.lineTo(85, 46);
        ctx.lineTo(83, 81);
        ctx.lineTo(64, 98);
        ctx.lineTo(45, 81);
        ctx.closePath();
        ctx.fill();

        // Световая зона на лбу и спинке носа
        ctx.fillStyle = '#f0c6a8';
        ctx.beginPath();
        ctx.moveTo(50, 42);
        ctx.lineTo(78, 42);
        ctx.lineTo(76, 54);
        ctx.lineTo(52, 54);
        ctx.closePath();
        ctx.fill();

        // Горизонтальные морщины заботы на лбу
        ctx.strokeStyle = '#b58463';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(51, 45); ctx.quadraticCurveTo(64, 46.5, 77, 45);
        ctx.moveTo(54, 49); ctx.quadraticCurveTo(64, 50.5, 74, 49);
        ctx.stroke();

        // 4. ГУСТЫЕ КАШТАНОВЫЕ БАКЕНБАРДЫ-БОРОДКА БЕЗ УСОВ (Главная примета Олега)
        ctx.fillStyle = '#5c3d24';
        ctx.beginPath();
        ctx.moveTo(43, 62);
        ctx.lineTo(47, 64);
        ctx.lineTo(49, 82);
        ctx.quadraticCurveTo(64, 93, 79, 82);
        ctx.lineTo(81, 64);
        ctx.lineTo(85, 62);
        ctx.lineTo(84, 83);
        ctx.lineTo(64, 100);
        ctx.lineTo(44, 83);
        ctx.closePath();
        ctx.fill();

        // 5. КАШТАНОВО-РУСАЯ ПРИЧЁСКА С НЕБРЕЖНОЙ ЧЁЛКОЙ НАБОК
        ctx.fillStyle = '#5c3d24';
        ctx.beginPath();
        ctx.moveTo(40, 56);
        ctx.quadraticCurveTo(40, 22, 64, 20);
        ctx.quadraticCurveTo(88, 22, 88, 56);
        ctx.lineTo(84, 46);
        ctx.quadraticCurveTo(64, 34, 44, 46);
        ctx.closePath();
        ctx.fill();

        // Световые русые пряди и характерная чёлка на левую сторону лба
        ctx.fillStyle = '#785233';
        ctx.beginPath();
        ctx.moveTo(48, 34);
        ctx.quadraticCurveTo(64, 21, 80, 34);
        ctx.quadraticCurveTo(64, 29, 48, 34);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#5c3d24';
        ctx.beginPath();
        ctx.moveTo(50, 36); ctx.lineTo(46, 47); ctx.lineTo(55, 39);
        ctx.moveTo(58, 35); ctx.lineTo(55, 45); ctx.lineTo(64, 38);
        ctx.closePath();
        ctx.fill();

        // 6. РОВНЫЕ, ТЕПЛЫЕ КАРИЕ ГЛАЗА, БРОВИ И СЕРЬЁЗНЫЙ РОТ
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(53, 60, 4.6, 2.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 60, 4.6, 2.2, 0, 0, Math.PI * 2); ctx.fill();

        // Тёплая тёмно-каряя радужка
        ctx.fillStyle = '#5c3416';
        ctx.beginPath(); ctx.arc(53, 60, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 60, 2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#1c1008';
        ctx.beginPath(); ctx.arc(53, 60, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 60, 1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(53.8, 59.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75.8, 59.2, 0.7, 0, Math.PI * 2); ctx.fill();

        // Густые слегка сдвинутые брови
        ctx.strokeStyle = '#3b2414';
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(47, 55.5); ctx.quadraticCurveTo(53, 54, 59, 55.5);
        ctx.moveTo(81, 55.5); ctx.quadraticCurveTo(75, 54, 69, 55.5);
        ctx.stroke();

        // Прямой крупный нос и серьёзный рот
        ctx.fillStyle = '#d49d79';
        ctx.beginPath();
        ctx.moveTo(61, 58);
        ctx.lineTo(67, 58);
        ctx.lineTo(69, 72);
        ctx.quadraticCurveTo(64, 75, 59, 72);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#8f5642';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(56, 82);
        ctx.quadraticCurveTo(64, 80, 72, 82);
        ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 20);
        ctx.quadraticCurveTo(40, 22, 40, 56);
        ctx.lineTo(44, 83);
        ctx.lineTo(64, 100);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.lineTo(36, 98);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    svetlana() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ТЁМНО-СИНЯЯ КОСЫНКА НА ЗАДНЕМ ПЛАНЕ
        ctx.fillStyle = '#243447';
        ctx.beginPath();
        ctx.moveTo(36, 46);
        ctx.quadraticCurveTo(44, 16, 70, 16);
        ctx.quadraticCurveTo(98, 22, 108, 62);
        ctx.lineTo(92, 86);
        ctx.lineTo(36, 74);
        ctx.closePath();
        ctx.fill();

        // Световая складка на верхней части косынки
        ctx.fillStyle = '#334861';
        ctx.beginPath();
        ctx.moveTo(46, 26);
        ctx.quadraticCurveTo(72, 16, 96, 36);
        ctx.quadraticCurveTo(76, 32, 46, 26);
        ctx.closePath();
        ctx.fill();

        // 2. СВЕТЛАЯ ГОЛУБОВАТО-БЕЛАЯ БЛУЗА С ВЫШИВКОЙ НА ВОРОТЕ
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.quadraticCurveTo(32, 98, 64, 98);
        ctx.quadraticCurveTo(96, 98, 112, 128);
        ctx.closePath();
        ctx.fill();

        // Мягкие складки блузы и оборка горловины
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(24, 128);
        ctx.quadraticCurveTo(36, 102, 64, 102);
        ctx.quadraticCurveTo(92, 102, 104, 128);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(36, 103);
        ctx.quadraticCurveTo(64, 112, 92, 103);
        ctx.stroke();

        // Нежная терракотово-золотая вышивка по центру горловины (как на портрете)
        ctx.strokeStyle = '#c2785c';
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(64, 108); ctx.lineTo(64, 124);
        ctx.moveTo(61, 113); ctx.lineTo(67, 113);
        ctx.moveTo(61, 118); ctx.lineTo(67, 118);
        ctx.stroke();

        // 3. ШЕЯ И МИЛОВИДНОЕ ЛИЦО СВЕТЛАНЫ
        ctx.fillStyle = '#e5b296';
        ctx.fillRect(55, 84, 18, 18);

        ctx.fillStyle = '#fbd2bc';
        ctx.beginPath();
        ctx.moveTo(45, 48);
        ctx.quadraticCurveTo(64, 34, 83, 48);
        ctx.lineTo(81, 78);
        ctx.lineTo(64, 95);
        ctx.lineTo(47, 78);
        ctx.closePath();
        ctx.fill();

        // Мягкий персиково-розовый румянец на щеках
        ctx.fillStyle = 'rgba(225, 85, 85, 0.16)';
        ctx.beginPath(); ctx.arc(50, 70, 5.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(78, 70, 5.5, 0, Math.PI * 2); ctx.fill();

        // 4. ПШЕНИЧНО-СВЕТЛЫЕ ВОЛОСЫ, ЧЁЛКА И ПЫШНЫЙ ЛОКОН НА ПРАВОЕ ПЛЕЧО
        // Пышный хвост-локон на правом плече (справа на портрете)
        ctx.fillStyle = '#d4b26a';
        ctx.beginPath();
        ctx.moveTo(84, 78);
        ctx.quadraticCurveTo(104, 88, 98, 114);
        ctx.quadraticCurveTo(92, 126, 78, 124);
        ctx.quadraticCurveTo(86, 112, 82, 92);
        ctx.closePath();
        ctx.fill();

        // Световая прядь на хвосте
        ctx.fillStyle = '#ebd08f';
        ctx.beginPath();
        ctx.moveTo(88, 84);
        ctx.quadraticCurveTo(98, 94, 92, 114);
        ctx.quadraticCurveTo(88, 102, 86, 88);
        ctx.closePath();
        ctx.fill();

        // Чёлка и светлые пшеничные пряди у лица из-под косынки
        ctx.fillStyle = '#e3c37b';
        ctx.beginPath();
        ctx.moveTo(41, 56);
        ctx.quadraticCurveTo(42, 24, 68, 22);
        ctx.quadraticCurveTo(86, 26, 87, 56);
        ctx.lineTo(82, 46);
        ctx.quadraticCurveTo(66, 36, 46, 48);
        ctx.closePath();
        ctx.fill();

        // Мягкие обрамляющие локоны по бокам лица
        ctx.fillStyle = '#d4b26a';
        ctx.beginPath();
        ctx.moveTo(43, 46); ctx.quadraticCurveTo(36, 70, 42, 88); ctx.lineTo(48, 84); ctx.quadraticCurveTo(43, 68, 48, 48);
        ctx.moveTo(85, 46); ctx.quadraticCurveTo(90, 66, 86, 84); ctx.lineTo(81, 80); ctx.quadraticCurveTo(84, 64, 80, 48);
        ctx.fill();

        // 5. УЗЕЛОК И ЛЕНТЫ КОСЫНКИ СПРАВА НА ШЕЕ
        ctx.fillStyle = '#1b2838';
        ctx.beginPath();
        ctx.arc(88, 79, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#243447';
        ctx.beginPath();
        ctx.moveTo(88, 79); ctx.quadraticCurveTo(100, 73, 106, 78); ctx.quadraticCurveTo(98, 83, 88, 80);
        ctx.moveTo(88, 80); ctx.quadraticCurveTo(96, 90, 94, 98); ctx.quadraticCurveTo(88, 91, 87, 81);
        ctx.closePath();
        ctx.fill();

        // 6. РОВНЫЕ, ЯСНЫЕ ГОЛУБЫЕ ГЛАЗА И ДОБРОЖЕЛАТЕЛЬНАЯ УЛЫБКА
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(54, 60, 4.8, 2.3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 60, 4.8, 2.3, 0, 0, Math.PI * 2); ctx.fill();

        // Ясная светло-голубая радужка
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(54, 60, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 60, 2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0c4a6e';
        ctx.beginPath(); ctx.arc(54, 60, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 60, 1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(54.8, 59.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74.8, 59.2, 0.7, 0, Math.PI * 2); ctx.fill();

        // Аккуратные ресницы и мягкие русые брови
        ctx.strokeStyle = '#3b2416';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(49, 59.5); ctx.quadraticCurveTo(54, 57.5, 59, 59.5);
        ctx.moveTo(69, 59.5); ctx.quadraticCurveTo(74, 57.5, 79, 59.5);
        ctx.stroke();

        ctx.strokeStyle = '#8c6d3f';
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(48, 55); ctx.quadraticCurveTo(54, 53.5, 59, 55.5);
        ctx.moveTo(69, 55.5); ctx.quadraticCurveTo(74, 53.5, 80, 55);
        ctx.stroke();

        // Аккуратный носик и мягкая улыбка
        ctx.strokeStyle = '#d49d81';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 57); ctx.lineTo(62.5, 72); ctx.lineTo(65.5, 72); ctx.stroke();

        ctx.fillStyle = '#d97777';
        ctx.beginPath();
        ctx.ellipse(64, 81, 4.8, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.beginPath();
        ctx.moveTo(64, 16);
        ctx.quadraticCurveTo(44, 18, 36, 46);
        ctx.lineTo(47, 78);
        ctx.lineTo(64, 95);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    kesten() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. БОЕВОЙ ПОЛУТОРНЫЙ МЕЧ СТРАЖИ ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.save();
        ctx.translate(102, 54);
        ctx.rotate((Math.PI / 180) * 24);

        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-4, 28);
        ctx.lineTo(-4, -40);
        ctx.lineTo(0, -52);
        ctx.lineTo(4, -40);
        ctx.lineTo(4, 28);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Светлая полированная грань клинка
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(0, -52);
        ctx.lineTo(4, -40);
        ctx.lineTo(4, 28);
        ctx.lineTo(0, 28);
        ctx.closePath();
        ctx.fill();

        // Золотая гарда меча
        ctx.fillStyle = '#d4af37';
        ctx.strokeStyle = '#785a14';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(-13, 24, 26, 4.5, 1.5);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 2. ТЁМНО-СИНИЙ ПЛАЩ СТРАЖИ С МЕХОМ И ЛАТНАЯ КИРАСА
        ctx.fillStyle = '#1e3a8a';
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.lineTo(30, 94);
        ctx.lineTo(98, 94);
        ctx.lineTo(114, 128);
        ctx.closePath();
        ctx.fill();

        // Тёмный меховой воротник плаща на плечах
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(28, 102);
        ctx.quadraticCurveTo(64, 114, 100, 102);
        ctx.lineTo(94, 92);
        ctx.quadraticCurveTo(64, 102, 34, 92);
        ctx.closePath();
        ctx.fill();

        // Стальной нагрудник капитана стражи с золотой окантовкой
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(24, 128);
        ctx.lineTo(38, 96);
        ctx.lineTo(90, 96);
        ctx.lineTo(104, 128);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(44, 98);
        ctx.lineTo(64, 120);
        ctx.lineTo(84, 98);
        ctx.stroke();

        // 3. ШЕЯ, УШИ И ВОЛЕВОЕ ЛИЦО КЕСТЕНА ГАРЕССА
        ctx.fillStyle = '#d9a07c';
        ctx.fillRect(55, 84, 18, 16);

        ctx.fillStyle = '#e8b596';
        ctx.beginPath();
        ctx.moveTo(43, 48);
        ctx.lineTo(85, 48);
        ctx.lineTo(83, 80);
        ctx.lineTo(64, 98);
        ctx.lineTo(45, 80);
        ctx.closePath();
        ctx.fill();

        // Горизонтальные морщины на лбу и боевой шрам на левой щеке
        ctx.strokeStyle = '#ba8261';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(52, 46); ctx.quadraticCurveTo(64, 47.5, 76, 46);
        ctx.stroke();

        ctx.strokeStyle = '#991b1b';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(47, 66);
        ctx.lineTo(53, 75);
        ctx.stroke();

        // 4. ТЁМНО-РУСЫЕ С ПРОСЕДЬЮ ВОЛОСЫ И УХОЖЕННАЯ БОРОДА КАПИТАНА
        ctx.fillStyle = '#4a3525';
        ctx.beginPath();
        ctx.moveTo(40, 56);
        ctx.quadraticCurveTo(40, 22, 64, 20);
        ctx.quadraticCurveTo(88, 22, 88, 56);
        ctx.lineTo(84, 46);
        ctx.quadraticCurveTo(64, 34, 44, 46);
        ctx.closePath();
        ctx.fill();

        // Световые пряди и серебристая проседь на висках
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(41, 46); ctx.lineTo(45, 48); ctx.lineTo(45, 62); ctx.lineTo(41, 60);
        ctx.moveTo(87, 46); ctx.lineTo(83, 48); ctx.lineTo(83, 62); ctx.lineTo(87, 60);
        ctx.closePath();
        ctx.fill();

        // Аккуратная борода и усы с лёгкой сединой
        ctx.fillStyle = '#4a3525';
        ctx.beginPath();
        ctx.moveTo(44, 74);
        ctx.quadraticCurveTo(44, 94, 64, 100);
        ctx.quadraticCurveTo(84, 94, 84, 74);
        ctx.quadraticCurveTo(64, 84, 44, 74);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#36261a';
        ctx.beginPath();
        ctx.moveTo(50, 78);
        ctx.quadraticCurveTo(64, 73, 78, 78);
        ctx.lineTo(79, 82);
        ctx.quadraticCurveTo(64, 79, 49, 82);
        ctx.closePath();
        ctx.fill();

        // 5. РОВНЫЙ, СЕРЬЁЗНЫЙ ВЗГЛЯД И ГУСТЫЕ БРОВИ
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(53, 60, 4.6, 2.1, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 60, 4.6, 2.1, 0, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#5c3416';
        ctx.beginPath(); ctx.arc(53, 60, 1.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 60, 1.9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(53, 60, 0.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 60, 0.9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(53.8, 59.2, 0.65, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75.8, 59.2, 0.65, 0, Math.PI * 2); ctx.fill();

        // Ровные суровые брови
        ctx.strokeStyle = '#36261a';
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(47, 55.5); ctx.lineTo(59, 56.5);
        ctx.moveTo(81, 55.5); ctx.lineTo(69, 56.5);
        ctx.stroke();

        // Прямой нос
        ctx.strokeStyle = '#c48d6c';
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(64, 57); ctx.lineTo(62.5, 72); ctx.lineTo(66, 72); ctx.stroke();

        // 6. КРУГЛЫЙ СТАЛЬНОЙ ЩИТ КАПИТАНА СТРАЖИ НА ПЕРЕДНЕМ ПЛАНЕ (Слева снизу)
        ctx.save();
        ctx.translate(26, 106);

        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(0, 0, 17, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Синее гербовое поле и стальной умбон в центре щита
        ctx.fillStyle = '#1e3a8a';
        ctx.beginPath();
        ctx.arc(0, 0, 12.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#cbd5e1';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 20);
        ctx.quadraticCurveTo(40, 22, 40, 56);
        ctx.lineTo(45, 80);
        ctx.lineTo(64, 98);
        ctx.lineTo(64, 128);
        ctx.lineTo(14, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    jhod() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. СВЯЩЕННЫЙ ЛУК ЭРАСТИЛА ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.save();
        ctx.translate(104, 58);
        ctx.rotate((Math.PI / 180) * 18);

        // Изогнутое деревянное древко лука
        ctx.strokeStyle = '#6e472b';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-6, -42);
        ctx.bezierCurveTo(14, -14, 14, 34, -6, 62);
        ctx.stroke();

        // Натянутая тетива
        ctx.strokeStyle = 'rgba(241, 245, 249, 0.85)';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(-6, -41);
        ctx.lineTo(-6, 61);
        ctx.stroke();
        ctx.restore();

        // 2. ДЛИННЫЕ СЕДЫЕ ВОЛОСЫ И ЛЕСНАЯ ЖРЕЧЕСКАЯ РЯСА С МЕХОМ
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(34, 52);
        ctx.quadraticCurveTo(22, 88, 22, 128);
        ctx.lineTo(106, 128);
        ctx.quadraticCurveTo(106, 88, 94, 52);
        ctx.closePath();
        ctx.fill();

        // Тёмно-лесная жреческая ряса Эрастила
        ctx.fillStyle = '#1b4332';
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.lineTo(32, 94);
        ctx.lineTo(96, 94);
        ctx.lineTo(114, 128);
        ctx.closePath();
        ctx.fill();

        // Тёплый бурый меховой воротник-накидка на плечах
        ctx.fillStyle = '#4a3525';
        ctx.beginPath();
        ctx.moveTo(26, 102);
        ctx.quadraticCurveTo(64, 114, 102, 102);
        ctx.lineTo(94, 90);
        ctx.quadraticCurveTo(64, 102, 34, 90);
        ctx.closePath();
        ctx.fill();

        // Кожаный ремень и золотой символ лука Эрастила на груди
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(64, 115, 7, -Math.PI * 0.8, -Math.PI * 0.2);
        ctx.moveTo(58, 112); ctx.lineTo(70, 112);
        ctx.moveTo(64, 106); ctx.lineTo(64, 120);
        ctx.stroke();

        // 3. ОБВЕТРЕННОЕ ЛИЦО СТАРЦА-ЖРЕЦА С МОРЩИНКАМИ МУДРОСТИ
        ctx.fillStyle = '#d9a482';
        ctx.beginPath();
        ctx.moveTo(43, 48);
        ctx.lineTo(85, 48);
        ctx.lineTo(83, 82);
        ctx.lineTo(64, 100);
        ctx.lineTo(45, 82);
        ctx.closePath();
        ctx.fill();

        // Морщинки на лбу и у уголков глаз
        ctx.strokeStyle = '#b57e5e';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(52, 47); ctx.quadraticCurveTo(64, 48.5, 76, 47);
        ctx.moveTo(45, 62); ctx.lineTo(48, 63);
        ctx.moveTo(83, 62); ctx.lineTo(80, 63);
        ctx.stroke();

        // 4. ГУСТЫЕ СЕДЫЕ ВОЛОСЫ НА МАКУШКЕ И ОКЛАДИСТАЯ БОРОДА
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(40, 56);
        ctx.quadraticCurveTo(40, 22, 64, 20);
        ctx.quadraticCurveTo(88, 22, 88, 56);
        ctx.lineTo(84, 47);
        ctx.quadraticCurveTo(64, 36, 44, 47);
        ctx.closePath();
        ctx.fill();

        // Пышная окладистая седая борода жреца
        ctx.fillStyle = '#f1f5f9';
        ctx.beginPath();
        ctx.moveTo(42, 74);
        ctx.quadraticCurveTo(38, 102, 64, 124);
        ctx.quadraticCurveTo(90, 102, 86, 74);
        ctx.quadraticCurveTo(64, 85, 42, 74);
        ctx.closePath();
        ctx.fill();

        // Рельефные пряди седины в бороде
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(53, 88); ctx.quadraticCurveTo(52, 104, 57, 116);
        ctx.moveTo(75, 88); ctx.quadraticCurveTo(76, 104, 71, 116);
        ctx.stroke();

        // Густые седые усы
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(48, 78);
        ctx.quadraticCurveTo(64, 72, 80, 78);
        ctx.lineTo(83, 85);
        ctx.quadraticCurveTo(64, 80, 45, 85);
        ctx.closePath();
        ctx.fill();

        // 5. РОВНЫЙ, МУДРЫЙ И ДОБРОЖЕЛАТЕЛЬНЫЙ ВЗГЛЯД
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(53, 60, 4.6, 2.1, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 60, 4.6, 2.1, 0, 0, Math.PI * 2); ctx.fill();

        // Тёплая орехово-каряя радужка
        ctx.fillStyle = '#6e472b';
        ctx.beginPath(); ctx.arc(53, 60, 1.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 60, 1.9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#1c1008';
        ctx.beginPath(); ctx.arc(53, 60, 0.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 60, 0.9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(53.8, 59.2, 0.65, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75.8, 59.2, 0.65, 0, Math.PI * 2); ctx.fill();

        // Густые седые брови
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(46, 55.5); ctx.quadraticCurveTo(53, 53.5, 60, 56); ctx.lineTo(59, 58); ctx.quadraticCurveTo(53, 56, 46, 57.5);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(82, 55.5); ctx.quadraticCurveTo(75, 53.5, 68, 56); ctx.lineTo(69, 58); ctx.quadraticCurveTo(75, 56, 82, 57.5);
        ctx.closePath();
        ctx.fill();

        // Прямой благородный нос
        ctx.strokeStyle = '#b57e5e';
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(64, 57); ctx.lineTo(62.5, 72); ctx.lineTo(66, 72); ctx.stroke();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 20);
        ctx.quadraticCurveTo(40, 22, 40, 56);
        ctx.lineTo(45, 82);
        ctx.lineTo(64, 124);
        ctx.lineTo(14, 128);
        ctx.lineTo(34, 52);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    nyrissa() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЦВЕТУЩИЕ ВЕТВИ ПЕРВОГО МИРА И ПЫШНЫЕ ИЗУМРУДНЫЕ ЛОКОНЫ (Задний план)
        ctx.strokeStyle = '#6e472b';
        ctx.lineWidth = 2.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(46, 36);
        ctx.quadraticCurveTo(30, 18, 22, 6);
        ctx.moveTo(82, 36);
        ctx.quadraticCurveTo(98, 18, 106, 6);
        ctx.stroke();

        // Пышный каскад волнистых изумрудно-салатовых волос нимфы
        ctx.fillStyle = '#065f46';
        ctx.beginPath();
        ctx.moveTo(32, 52);
        ctx.quadraticCurveTo(18, 90, 18, 128);
        ctx.lineTo(110, 128);
        ctx.quadraticCurveTo(110, 90, 96, 52);
        ctx.closePath();
        ctx.fill();

        // Световые нефритово-мятные локоны по бокам
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(35, 60, 16, 0, Math.PI * 2);
        ctx.arc(93, 60, 16, 0, Math.PI * 2);
        ctx.arc(31, 86, 15, 0, Math.PI * 2);
        ctx.arc(97, 86, 15, 0, Math.PI * 2);
        ctx.fill();

        // 2. ИЗЫСКАННОЕ ПЛАТЬЕ НИМФЫ ИЗ ЛЕПЕСТКОВ И ЗОЛОТОЙ ВЫШИВКИ
        ctx.fillStyle = '#047857';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.quadraticCurveTo(32, 96, 64, 96);
        ctx.quadraticCurveTo(96, 96, 112, 128);
        ctx.closePath();
        ctx.fill();

        // Открытые плечи и декольте нимфы
        ctx.fillStyle = '#ffedd8';
        ctx.beginPath();
        ctx.moveTo(36, 98);
        ctx.quadraticCurveTo(64, 94, 92, 98);
        ctx.lineTo(84, 116);
        ctx.lineTo(64, 124);
        ctx.lineTo(44, 116);
        ctx.closePath();
        ctx.fill();

        // Ожерелье-воротник из золотых листьев и алых бутонов
        ctx.fillStyle = '#34d399';
        ctx.beginPath();
        ctx.ellipse(42, 108, 8, 4, 0.45, 0, Math.PI * 2);
        ctx.ellipse(54, 114, 8, 4, 0.25, 0, Math.PI * 2);
        ctx.ellipse(74, 114, 8, 4, -0.25, 0, Math.PI * 2);
        ctx.ellipse(86, 108, 8, 4, -0.45, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f43f5e';
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(64, 117, 4.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 3. ДЛИННЫЕ ИЗЯЩНЫЕ УШИ ФЕИ
        ctx.fillStyle = '#f5d2be';
        ctx.beginPath(); ctx.moveTo(43, 60); ctx.lineTo(18, 44); ctx.lineTo(42, 70); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(85, 60); ctx.lineTo(110, 44); ctx.lineTo(86, 70); ctx.closePath(); ctx.fill();

        // 4. ШЕЯ И ЧАРУЮЩЕЕ ЛИЦО НИРИССЫ
        ctx.fillStyle = '#f0c5ad';
        ctx.fillRect(55, 84, 18, 16);

        ctx.fillStyle = '#fff5eb';
        ctx.beginPath();
        ctx.moveTo(45, 48);
        ctx.quadraticCurveTo(64, 34, 83, 48);
        ctx.lineTo(81, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(47, 78);
        ctx.closePath();
        ctx.fill();

        // Нежный розовый румянец на щеках
        ctx.fillStyle = 'rgba(244, 63, 94, 0.14)';
        ctx.beginPath(); ctx.arc(50, 70, 5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(78, 70, 5, 0, Math.PI * 2); ctx.fill();

        // 5. ПЕРЕДНИЕ ПРЯДИ ВОЛОС, ЗОЛОТОЙ ВЕНЕЦ И АЛЫЕ РОЗЫ ПЕРВОГО МИРА
        ctx.fillStyle = '#059669';
        ctx.beginPath();
        ctx.moveTo(41, 56);
        ctx.quadraticCurveTo(42, 22, 64, 20);
        ctx.quadraticCurveTo(86, 22, 87, 56);
        ctx.lineTo(83, 47);
        ctx.quadraticCurveTo(72, 36, 64, 41);
        ctx.quadraticCurveTo(56, 36, 45, 47);
        ctx.closePath();
        ctx.fill();

        // Золотая тиара-венец королевы нимф
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(43, 44);
        ctx.quadraticCurveTo(64, 48, 85, 44);
        ctx.stroke();

        // Цветущие розы Первого Мира в волосах
        [
            [45, 39, '#f43f5e'],
            [64, 38, '#ffd875'],
            [83, 39, '#f43f5e']
        ].forEach(([fx, fy, color]) => {
            ctx.fillStyle = color;
            ctx.beginPath(); ctx.arc(fx, fy, 4.2, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#fff1f2';
            ctx.beginPath(); ctx.arc(fx, fy, 1.5, 0, Math.PI * 2); ctx.fill();
        });

        // 6. РОВНЫЙ, ГИПНОТИЧЕСКИЙ ВЗГЛЯД И ЗАГАДОЧНАЯ ПОЛУУЛЫБКА
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(54, 60, 4.8, 2.3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 60, 4.8, 2.3, 0, 0, Math.PI * 2); ctx.fill();

        // Сияющая изумрудно-золотая радужка Первого Мира
        ctx.fillStyle = '#10b981';
        ctx.beginPath(); ctx.arc(54, 60, 2.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 60, 2.1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#064e3b';
        ctx.beginPath(); ctx.arc(54, 60, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 60, 1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(54.8, 59.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74.8, 59.2, 0.7, 0, Math.PI * 2); ctx.fill();

        // Изящные ресницы и дугообразные брови
        ctx.strokeStyle = '#064e3b';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(48.5, 59.5); ctx.quadraticCurveTo(54, 57.5, 59, 60);
        ctx.moveTo(79.5, 59.5); ctx.quadraticCurveTo(74, 57.5, 69, 60);
        ctx.stroke();

        ctx.strokeStyle = '#047857';
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(48, 55); ctx.quadraticCurveTo(54, 53, 59, 55.5);
        ctx.moveTo(69, 55.5); ctx.quadraticCurveTo(74, 53, 80, 55);
        ctx.stroke();

        // Тонкий носик и загадочная полуулыбка
        ctx.strokeStyle = '#d9a786';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 57); ctx.lineTo(62.5, 72); ctx.lineTo(65.5, 72); ctx.stroke();

        ctx.fillStyle = '#e11d48';
        ctx.beginPath();
        ctx.moveTo(58, 81);
        ctx.quadraticCurveTo(64, 78.5, 70, 81);
        ctx.quadraticCurveTo(64, 85, 58, 81);
        ctx.closePath();
        ctx.fill();

        // 7. МАГИЯ ПЕРВОГО МИРА И СВЕТЛЯЧКИ НА ПЕРЕДНЕМ ПЛАНЕ (Слева снизу)
        ctx.fillStyle = 'rgba(52, 211, 153, 0.32)';
        ctx.beginPath(); ctx.arc(24, 108, 15, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#10b981';
        ctx.beginPath(); ctx.arc(24, 108, 8.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#fef08a';
        ctx.beginPath(); ctx.arc(24, 108, 4.2, 0, Math.PI * 2); ctx.fill();

        // Парящие золотистые искорки и лепестки вокруг
        ctx.fillStyle = '#ffd875';
        ctx.beginPath(); ctx.arc(15, 96, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(36, 98, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(108, 34, 1.8, 0, Math.PI * 2); ctx.fill();

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.beginPath();
        ctx.moveTo(64, 20);
        ctx.quadraticCurveTo(42, 22, 41, 56);
        ctx.lineTo(47, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.lineTo(32, 52);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },
    // prazil() { ... },
    // grigory() { ... },
    // halfling_male() { ... },
    // bandit_queen() { ... },
    // bandit_captain() { ... },
    // townsman() { ... },
    // townswoman() { ... },
    // courtesan() { ... },
    // elder() { ... },
    // guard() { ... },
    // merchant() { ... },
    // farmer() { ... }
};