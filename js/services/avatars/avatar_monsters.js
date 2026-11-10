/**
 * ГЕНЕРАТОРЫ АВАТАРОК: МОНСТРЫ, БЕСТИАРИЙ И НЕЖИТЬ
 */
export const MonsterAvatars = {


    rogue() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ГЛУБОКИЙ ПОТРЁПАННЫЙ КАПЮШОН РАЗБОЙНИКА (Задний контур)
        ctx.fillStyle = '#261a12';
        ctx.beginPath();
        ctx.moveTo(32, 66);
        ctx.quadraticCurveTo(36, 22, 64, 18);
        ctx.quadraticCurveTo(92, 22, 96, 66);
        ctx.lineTo(90, 96);
        ctx.lineTo(38, 96);
        ctx.closePath();
        ctx.fill();

        // 2. КОЖАНАЯ БРОНЯ И ШЕЙНЫЙ ПЛАТОК НА ПЛЕЧАХ
        ctx.fillStyle = '#3b2618';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(34, 98);
        ctx.lineTo(94, 98);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        // Тёмный разбойничий платок-шарф на шее со складками
        ctx.fillStyle = '#4a1c1c';
        ctx.beginPath();
        ctx.moveTo(38, 96);
        ctx.quadraticCurveTo(64, 112, 90, 96);
        ctx.lineTo(86, 110);
        ctx.quadraticCurveTo(64, 122, 42, 110);
        ctx.closePath();
        ctx.fill();

        // Стальные заклёпки на кожаной броне
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath(); ctx.arc(40, 116, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(88, 116, 2, 0, Math.PI * 2); ctx.fill();

        // 3. ОБВЕТРЕННОЕ ЛИЦО СО ЩЕТИНОЙ И ШРАМОМ
        ctx.fillStyle = '#cf9778';
        ctx.beginPath();
        ctx.moveTo(43, 50);
        ctx.lineTo(85, 50);
        ctx.lineTo(84, 82);
        ctx.lineTo(64, 100);
        ctx.lineTo(44, 82);
        ctx.closePath();
        ctx.fill();

        // Густая тёмная щетина на подбородке и челюсти
        ctx.fillStyle = 'rgba(30, 22, 18, 0.28)';
        ctx.beginPath();
        ctx.moveTo(44, 76);
        ctx.lineTo(64, 100);
        ctx.lineTo(84, 76);
        ctx.lineTo(83, 83);
        ctx.lineTo(64, 100);
        ctx.lineTo(45, 83);
        ctx.closePath();
        ctx.fill();

        // Небрежные тёмные пряди волос, выбивающиеся из-под капюшона
        ctx.fillStyle = '#1f1611';
        ctx.beginPath();
        ctx.moveTo(43, 48); ctx.lineTo(48, 57); ctx.lineTo(54, 49);
        ctx.moveTo(74, 49); ctx.lineTo(80, 56); ctx.lineTo(85, 48);
        ctx.fill();

        // 4. РОВНЫЙ ХИТРЫЙ ВЗГЛЯД И ПИРАТСКАЯ ПОВЯЗКА НА ЛЕВОМ ГЛАЗУ
        // Ремешок повязки (аккуратно уходит под края капюшона)
        ctx.strokeStyle = '#140f0c';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(41, 61);
        ctx.lineTo(86, 54);
        ctx.stroke();

        // Чёрная кожаная повязка на левом глазу (строго по оси глаза)
        ctx.fillStyle = '#140f0c';
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(53, 62, 6.5, 4.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Правый глаз — ровный, сфокусированный и прищуренный
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(75, 62, 4.8, 2.1, 0, 0, Math.PI * 2);
        ctx.fill();

        // Янтарно-карий зрачок и блик
        ctx.fillStyle = '#854d27';
        ctx.beginPath(); ctx.arc(74.5, 62, 1.9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(74.5, 62, 0.9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(75.3, 61.2, 0.65, 0, Math.PI * 2); ctx.fill();

        // Нахмуренная правая бровь и косой боевой шрам
        ctx.strokeStyle = '#1f1611';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(69, 57.5); ctx.lineTo(81, 56.5);
        ctx.stroke();

        ctx.strokeStyle = '#8f2d2d';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(71, 53);
        ctx.lineTo(77, 72);
        ctx.stroke();

        // 5. ПЕРЕДНИЙ КРАЙ КАПЮШОНА СО СКЛАДКАМИ
        ctx.fillStyle = '#362418';
        ctx.beginPath();
        ctx.moveTo(35, 58);
        ctx.quadraticCurveTo(44, 22, 64, 18);
        ctx.quadraticCurveTo(84, 22, 93, 58);
        ctx.lineTo(86, 54);
        ctx.quadraticCurveTo(64, 44, 42, 54);
        ctx.closePath();
        ctx.fill();

        // Световая складка по краю капюшона
        ctx.strokeStyle = '#523826';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(39, 55);
        ctx.quadraticCurveTo(64, 43, 89, 55);
        ctx.stroke();

        // 6. ХИЩНЫЙ НОС С ГОРБИНКОЙ И ЕХИДНАЯ УХМЫЛКА
        ctx.fillStyle = '#b87d5e';
        ctx.beginPath();
        ctx.moveTo(64, 60);
        ctx.lineTo(68, 74);
        ctx.quadraticCurveTo(64, 77, 61, 74);
        ctx.closePath();
        ctx.fill();

        // Самодовольная ухмылка набок
        ctx.strokeStyle = '#261a12';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(54, 85);
        ctx.quadraticCurveTo(65, 89, 75, 83);
        ctx.stroke();

        // 7. ОСТРЫЙ СТАЛЬНОЙ КИНЖАЛ НА ПЕРЕДНЕМ ПЛАНЕ (Слева внизу по диагонали)
        ctx.save();
        ctx.translate(28, 106);
        ctx.rotate((Math.PI / 180) * -28);

        // Стальное клиновидное лезвие с кровостоком
        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-4.5, 0);
        ctx.lineTo(-3.5, -28);
        ctx.lineTo(0, -38); // Острый кончик кинжала
        ctx.lineTo(3.5, -28);
        ctx.lineTo(4.5, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Светлая заточенная грань клинка
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(0, -38);
        ctx.lineTo(3.5, -28);
        ctx.lineTo(4.5, 0);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();

        // Тёмный кровосток по центру
        ctx.fillStyle = '#334155';
        ctx.fillRect(-0.8, -24, 1.6, 20);

        // Кованая бронзовая гарда-перекрестие
        ctx.fillStyle = '#b8860b';
        ctx.strokeStyle = '#4a3219';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(-10, -2, 20, 4, 1.5);
        ctx.fill();
        ctx.stroke();

        // Обтянутая чёрной кожей рукоять и навершие
        ctx.fillStyle = '#1e1611';
        ctx.fillRect(-2.5, 2, 5, 13);

        ctx.fillStyle = '#b8860b';
        ctx.beginPath();
        ctx.arc(0, 17, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 18);
        ctx.quadraticCurveTo(44, 22, 35, 58);
        ctx.lineTo(44, 82);
        ctx.lineTo(64, 100);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.lineTo(34, 98);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    deer() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ВЕТВИСТЫЕ КОРОЛЕВСКИЕ РОГА (Задний план)
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Левый рог (светлая кость с теневым основанием)
        ctx.strokeStyle = '#d7ccb8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(54, 42);
        ctx.quadraticCurveTo(38, 28, 36, 10); // Главный ствол
        ctx.moveTo(47, 34);
        ctx.lineTo(26, 26); // Нижний отросток
        ctx.moveTo(41, 24);
        ctx.lineTo(24, 14); // Средний отросток
        ctx.moveTo(37, 17);
        ctx.lineTo(44, 8);  // Верхний зубец короны
        ctx.stroke();

        // Правый рог
        ctx.strokeStyle = '#e8e0cf';
        ctx.beginPath();
        ctx.moveTo(74, 42);
        ctx.quadraticCurveTo(90, 28, 92, 10); // Главный ствол
        ctx.moveTo(81, 34);
        ctx.lineTo(102, 26); // Нижний отросток
        ctx.moveTo(87, 24);
        ctx.lineTo(104, 14); // Средний отросток
        ctx.moveTo(91, 17);
        ctx.lineTo(84, 8);  // Верхний зубец короны
        ctx.stroke();

        // 2. МОЩНАЯ ШЕЯ И БЕЛАЯ ПУШИСТАЯ ГРУДКА ВОЖАКА
        ctx.fillStyle = '#7c4d2b';
        ctx.beginPath();
        ctx.moveTo(32, 128);
        ctx.lineTo(44, 78);
        ctx.lineTo(84, 78);
        ctx.lineTo(96, 128);
        ctx.closePath();
        ctx.fill();

        // Светло-кремовый мех на груди
        ctx.fillStyle = '#efe6d5';
        ctx.beginPath();
        ctx.moveTo(48, 94);
        ctx.quadraticCurveTo(64, 102, 80, 94);
        ctx.lineTo(84, 128);
        ctx.lineTo(44, 128);
        ctx.closePath();
        ctx.fill();

        // 3. ЧУТКИЕ УШИ ОЛЕНЯ (Симметрично разведены в стороны)
        ctx.fillStyle = '#9c663b';
        // Левое ухо
        ctx.beginPath();
        ctx.moveTo(46, 48);
        ctx.quadraticCurveTo(24, 38, 18, 48);
        ctx.quadraticCurveTo(26, 58, 45, 56);
        ctx.closePath();
        ctx.fill();

        // Правое ухо
        ctx.beginPath();
        ctx.moveTo(82, 48);
        ctx.quadraticCurveTo(104, 38, 110, 48);
        ctx.quadraticCurveTo(102, 58, 83, 56);
        ctx.closePath();
        ctx.fill();

        // Светлая внутренняя раковина ушей
        ctx.fillStyle = '#e6ccb2';
        ctx.beginPath(); ctx.ellipse(32, 48, 9, 3, -0.15, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(96, 48, 9, 3, 0.15, 0, Math.PI * 2); ctx.fill();

        // 4. ГОЛОВА И БЛАГОРОДНАЯ МОРДА ОЛЕНЯ (Тёплый ореховый мех)
        ctx.fillStyle = '#b07848';
        ctx.beginPath();
        ctx.moveTo(48, 42);
        ctx.quadraticCurveTo(64, 34, 80, 42);
        ctx.lineTo(84, 66);
        ctx.lineTo(72, 92);
        ctx.lineTo(56, 92);
        ctx.lineTo(44, 66);
        ctx.closePath();
        ctx.fill();

        // Светлая спинка носа и переносица для чёткого объёма
        ctx.fillStyle = '#c99363';
        ctx.beginPath();
        ctx.moveTo(57, 46);
        ctx.lineTo(71, 46);
        ctx.lineTo(69, 86);
        ctx.lineTo(59, 86);
        ctx.closePath();
        ctx.fill();

        // Белый подшёрсток вокруг носа и подбородка
        ctx.fillStyle = '#f8f5ee';
        ctx.beginPath();
        ctx.moveTo(54, 84);
        ctx.quadraticCurveTo(64, 80, 74, 84);
        ctx.lineTo(71, 98);
        ctx.quadraticCurveTo(64, 102, 57, 98);
        ctx.closePath();
        ctx.fill();

        // 5. РОВНЫЕ, ЯСНЫЕ И БЛАГОРОДНЫЕ ГЛАЗА (Без раскосости и печали)
        // Светлая меховая окантовка век
        ctx.fillStyle = '#e6ccb2';
        ctx.beginPath(); ctx.ellipse(51, 58, 5.5, 3.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(77, 58, 5.5, 3.2, 0, 0, Math.PI * 2); ctx.fill();

        // Тёмные янтарно-карие глаза
        ctx.fillStyle = '#2c1e16';
        ctx.beginPath(); ctx.ellipse(51, 58, 4.2, 2.4, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(77, 58, 4.2, 2.4, 0, 0, Math.PI * 2); ctx.fill();

        // Живые белые блики
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(52.2, 57.2, 1.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(78.2, 57.2, 1.1, 0, Math.PI * 2); ctx.fill();

        // 6. ЧЁРНАЯ МОЧКА НОСА И СПОКОЙНАЯ ЛИНИЯ РТА
        ctx.fillStyle = '#1e1916';
        ctx.beginPath();
        ctx.moveTo(58, 86);
        ctx.quadraticCurveTo(64, 84, 70, 86);
        ctx.lineTo(66, 92);
        ctx.lineTo(62, 92);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#5c3d28';
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(64, 92); ctx.lineTo(64, 95);
        ctx.moveTo(59, 95); ctx.quadraticCurveTo(64, 96.5, 69, 95);
        ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 34);
        ctx.quadraticCurveTo(54, 38, 48, 42);
        ctx.lineTo(44, 66);
        ctx.lineTo(56, 92);
        ctx.lineTo(44, 78);
        ctx.lineTo(32, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    boar() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАДНИЙ ПЛАН: Мощная щетинистая холка и плечи вепря
        ctx.fillStyle = '#261c17';
        ctx.beginPath();
        ctx.moveTo(10, 128);
        ctx.quadraticCurveTo(22, 62, 64, 56);
        ctx.quadraticCurveTo(106, 62, 118, 128);
        ctx.closePath();
        ctx.fill();

        // Острые гребни жёсткой щетины дыбом на макушке и холке
        ctx.fillStyle = '#17100d';
        ctx.beginPath();
        ctx.moveTo(46, 42); ctx.lineTo(52, 22); ctx.lineTo(58, 36);
        ctx.lineTo(64, 16); ctx.lineTo(70, 36); ctx.lineTo(76, 22); ctx.lineTo(82, 42);
        ctx.closePath();
        ctx.fill();

        // Взъерошенные клочья шерсти по бокам плеч
        ctx.fillStyle = '#362720';
        ctx.beginPath();
        ctx.moveTo(20, 92); ctx.lineTo(8, 82); ctx.lineTo(24, 78);
        ctx.moveTo(16, 110); ctx.lineTo(6, 106); ctx.lineTo(20, 100);
        ctx.moveTo(108, 92); ctx.lineTo(120, 82); ctx.lineTo(104, 78);
        ctx.moveTo(112, 110); ctx.lineTo(122, 106); ctx.lineTo(108, 100);
        ctx.closePath();
        ctx.fill();

        // 2. ЗАОСТРЁННЫЕ МОХНАТЫЕ УШИ ВЕПРЯ (Одно с боевой зазубриной)
        ctx.fillStyle = '#3b2b23';
        // Левое ухо
        ctx.beginPath();
        ctx.moveTo(40, 48);
        ctx.lineTo(24, 26);
        ctx.lineTo(48, 38);
        ctx.closePath();
        ctx.fill();

        // Правое рваное ухо
        ctx.beginPath();
        ctx.moveTo(88, 48);
        ctx.lineTo(104, 26);
        ctx.lineTo(96, 36);
        ctx.lineTo(100, 40);
        ctx.lineTo(80, 38);
        ctx.closePath();
        ctx.fill();

        // Внутренняя тёмная раковина ушей
        ctx.fillStyle = '#1f1510';
        ctx.beginPath(); ctx.moveTo(41, 45); ctx.lineTo(29, 31); ctx.lineTo(46, 39); ctx.fill();
        ctx.beginPath(); ctx.moveTo(87, 45); ctx.lineTo(99, 31); ctx.lineTo(82, 39); ctx.fill();

        // 3. МАССИВНАЯ КЛИНОВИДНАЯ ГОЛОВА И БРЫЛИ СЕКАЧА
        ctx.fillStyle = '#4a372d';
        ctx.beginPath();
        ctx.moveTo(42, 42);
        ctx.quadraticCurveTo(64, 32, 86, 42);
        ctx.lineTo(98, 72); // Правая мощная скула-брыля
        ctx.lineTo(84, 98);
        ctx.lineTo(64, 108);
        ctx.lineTo(44, 98);
        ctx.lineTo(30, 72); // Левая мощная скула-брыля
        ctx.closePath();
        ctx.fill();

        // Более светлая спинка рыла и скулы (световой объём)
        ctx.fillStyle = '#61483b';
        ctx.beginPath();
        ctx.moveTo(50, 46);
        ctx.lineTo(78, 46);
        ctx.lineTo(82, 92);
        ctx.lineTo(64, 102);
        ctx.lineTo(46, 92);
        ctx.closePath();
        ctx.fill();

        // Складки ярости на переносице
        ctx.strokeStyle = '#291d17';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(56, 64); ctx.quadraticCurveTo(64, 61, 72, 64);
        ctx.moveTo(55, 69); ctx.quadraticCurveTo(64, 66, 73, 69);
        ctx.stroke();

        // 4. СВИРЕПЫЕ НАЛИТЫЕ КРОВЬЮ ГЛАЗА И ТЯЖЁЛЫЕ НАДБРОВНЫЕ ВАЛИКИ
        ctx.fillStyle = '#1f1510';
        ctx.beginPath(); ctx.ellipse(47, 56, 5, 2.8, 0.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(81, 56, 5, 2.8, -0.2, 0, Math.PI * 2); ctx.fill();

        // Огненно-багровая радужка
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath(); ctx.arc(47.5, 56, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(80.5, 56, 2.2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffd875';
        ctx.beginPath(); ctx.arc(48, 55.5, 0.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(80, 55.5, 0.9, 0, Math.PI * 2); ctx.fill();

        // Нахмуренные надбровные складки
        ctx.strokeStyle = '#1f1510';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(39, 49); ctx.lineTo(54, 55);
        ctx.moveTo(89, 49); ctx.lineTo(74, 55);
        ctx.stroke();

        // 5. ОСКАЛЕННАЯ ПАСТЬ, ПЯТАЧОК И ОГРОМНЫЕ ИЗОГНУТЫЕ БИВНИ
        // Тёмная глубина пасти под пятачком
        ctx.fillStyle = '#1c0a0a';
        ctx.beginPath();
        ctx.moveTo(46, 86);
        ctx.quadraticCurveTo(64, 82, 82, 86);
        ctx.lineTo(76, 98);
        ctx.quadraticCurveTo(64, 104, 52, 98);
        ctx.closePath();
        ctx.fill();

        // Верхние загнутые вбок клыки
        ctx.fillStyle = '#e8e0cf';
        ctx.strokeStyle = '#291d17';
        ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(46, 86); ctx.quadraticCurveTo(36, 84, 34, 76); ctx.quadraticCurveTo(40, 81, 49, 84); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(82, 86); ctx.quadraticCurveTo(92, 84, 94, 76); ctx.quadraticCurveTo(88, 81, 79, 84); ctx.closePath(); ctx.fill(); ctx.stroke();

        // Огромные нижние боевые бивни (рвут силуэт вверх по бокам)
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#1f1510';
        ctx.lineWidth = 1.4;
        // Левый гигантский бивень
        ctx.beginPath();
        ctx.moveTo(44, 92);
        ctx.bezierCurveTo(22, 92, 14, 72, 22, 52);
        ctx.bezierCurveTo(24, 70, 32, 82, 50, 88);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Правый гигантский бивень
        ctx.beginPath();
        ctx.moveTo(84, 92);
        ctx.bezierCurveTo(106, 92, 114, 72, 106, 52);
        ctx.bezierCurveTo(104, 70, 96, 82, 78, 88);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Крупный влажный пятачок вепря по центру
        ctx.fillStyle = '#2b1e19';
        ctx.strokeStyle = '#17100d';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.roundRect(51, 74, 26, 15, 6);
        ctx.fill();
        ctx.stroke();

        // Светлый ободок пятачка и ноздри
        ctx.fillStyle = '#47342c';
        ctx.beginPath();
        ctx.roundRect(53, 76, 22, 11, 5);
        ctx.fill();

        ctx.fillStyle = '#0f0a08';
        ctx.beginPath(); ctx.ellipse(59, 81.5, 2.4, 3.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(69, 81.5, 2.4, 3.2, 0, 0, Math.PI * 2); ctx.fill();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 16);
        ctx.lineTo(46, 42);
        ctx.lineTo(30, 72);
        ctx.lineTo(44, 98);
        ctx.lineTo(64, 108);
        ctx.lineTo(64, 128);
        ctx.lineTo(10, 128);
        ctx.quadraticCurveTo(22, 62, 64, 56);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    bear() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАДНИЙ ПЛАН: Огромная лохматая холка и плечи гризли
        ctx.fillStyle = '#2c1b12';
        ctx.beginPath();
        ctx.moveTo(8, 128);
        ctx.quadraticCurveTo(18, 66, 64, 62);
        ctx.quadraticCurveTo(110, 66, 120, 128);
        ctx.closePath();
        ctx.fill();

        // Взъерошенные клочья густого меха на плечах
        ctx.fillStyle = '#3e271a';
        ctx.beginPath();
        ctx.moveTo(18, 92); ctx.lineTo(6, 82); ctx.lineTo(22, 78);
        ctx.moveTo(14, 110); ctx.lineTo(4, 106); ctx.lineTo(18, 100);
        ctx.moveTo(110, 92); ctx.lineTo(122, 82); ctx.lineTo(106, 78);
        ctx.moveTo(114, 110); ctx.lineTo(124, 106); ctx.lineTo(110, 100);
        ctx.closePath();
        ctx.fill();

        // 2. ОКРУГЛЫЕ МЕДВЕЖЬИ УШИ С ВНУТРЕННЕЙ ТЕНЬЮ
        ctx.fillStyle = '#4a2f1d';
        ctx.beginPath(); ctx.arc(36, 40, 11, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(92, 40, 11, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#24140b';
        ctx.beginPath(); ctx.arc(37, 41, 6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(91, 41, 6, 0, Math.PI * 2); ctx.fill();

        // 3. МАССИВНАЯ ГОЛОВА И ПУШИСТЫЕ ЩЁКИ МЕДВЕДЯ
        ctx.fillStyle = '#543622';
        ctx.beginPath();
        ctx.moveTo(40, 42);
        ctx.quadraticCurveTo(64, 28, 88, 42);
        ctx.lineTo(104, 72); // Правая пушистая щека
        ctx.lineTo(88, 102);
        ctx.lineTo(64, 112);
        ctx.lineTo(40, 102);
        ctx.lineTo(24, 72);  // Левая пушистая щека
        ctx.closePath();
        ctx.fill();

        // Охристо-ореховый мех на лбу и скулах (световой объём)
        ctx.fillStyle = '#6e472d';
        ctx.beginPath();
        ctx.moveTo(44, 46);
        ctx.quadraticCurveTo(64, 36, 84, 46);
        ctx.lineTo(94, 72);
        ctx.lineTo(80, 94);
        ctx.lineTo(48, 94);
        ctx.lineTo(34, 72);
        ctx.closePath();
        ctx.fill();

        // Вытянутая светло-песочная морда по центру
        ctx.fillStyle = '#9c6e49';
        ctx.beginPath();
        ctx.moveTo(52, 62);
        ctx.lineTo(76, 62);
        ctx.lineTo(80, 88);
        ctx.lineTo(64, 104);
        ctx.lineTo(48, 88);
        ctx.closePath();
        ctx.fill();

        // Складки яростного рычания на переносице
        ctx.strokeStyle = '#3b2314';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(57, 65); ctx.quadraticCurveTo(64, 62, 71, 65);
        ctx.moveTo(56, 69); ctx.quadraticCurveTo(64, 66, 72, 69);
        ctx.stroke();

        // 4. СВИРЕПЫЙ ВЗГЛЯД ЯНТАРНЫХ ГЛАЗ И НАХМУРЕННЫЕ НАДБРОВНЫЕ ДУГИ
        ctx.fillStyle = '#24140b';
        ctx.beginPath(); ctx.ellipse(47, 57, 5.2, 3.2, 0.15, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(81, 57, 5.2, 3.2, -0.15, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#f39c12'; // Янтарно-оранжевые глаза хищника
        ctx.beginPath(); ctx.arc(47.5, 57, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(80.5, 57, 2.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#110a06';
        ctx.beginPath(); ctx.arc(47.5, 57, 1.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(80.5, 57, 1.1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(48.3, 56.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(79.7, 56.2, 0.7, 0, Math.PI * 2); ctx.fill();

        // Нависшие меховые надбровные складки
        ctx.strokeStyle = '#24140b';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(39, 50); ctx.lineTo(54, 56);
        ctx.moveTo(89, 50); ctx.lineTo(74, 56);
        ctx.stroke();

        // 5. МАССИВНЫЙ ВЛАЖНЫЙ ЧЁРНЫЙ НОС И ОСКАЛЕННАЯ ПАСТЬ С КЛЫКАМИ
        // Тёмная глубина пасти
        ctx.fillStyle = '#1c090b';
        ctx.beginPath();
        ctx.moveTo(50, 82);
        ctx.quadraticCurveTo(64, 77, 78, 82);
        ctx.lineTo(75, 96);
        ctx.quadraticCurveTo(64, 102, 53, 96);
        ctx.closePath();
        ctx.fill();

        // Мясистый алый язык внутри пасти
        ctx.fillStyle = '#b8323f';
        ctx.beginPath();
        ctx.ellipse(64, 94, 6.5, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Четыре крупных белоснежных клыка и мелкие резцы
        ctx.fillStyle = '#ffffff';
        // Верхние клыки
        ctx.beginPath(); ctx.moveTo(52, 82); ctx.lineTo(55, 91); ctx.lineTo(58, 82); ctx.fill();
        ctx.beginPath(); ctx.moveTo(76, 82); ctx.lineTo(73, 91); ctx.lineTo(70, 82); ctx.fill();
        // Мелкие верхние резцы
        ctx.fillRect(59.5, 81, 2.2, 3.5);
        ctx.fillRect(63, 81, 2.2, 3.5);
        ctx.fillRect(66.5, 81, 2.2, 3.5);

        // Нижние клыки
        ctx.beginPath(); ctx.moveTo(54, 96); ctx.lineTo(56.5, 88); ctx.lineTo(59, 96); ctx.fill();
        ctx.beginPath(); ctx.moveTo(74, 96); ctx.lineTo(71.5, 88); ctx.lineTo(69, 96); ctx.fill();

        // Крупный чёрный нос гризли с ноздрями и бликом
        ctx.fillStyle = '#120d0a';
        ctx.beginPath();
        ctx.moveTo(55, 72);
        ctx.quadraticCurveTo(64, 69, 73, 72);
        ctx.lineTo(69, 79);
        ctx.lineTo(59, 79);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.beginPath(); ctx.ellipse(67, 73, 3, 1.2, 0.2, 0, Math.PI * 2); ctx.fill();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 28);
        ctx.quadraticCurveTo(50, 34, 40, 42);
        ctx.lineTo(24, 72);
        ctx.lineTo(40, 102);
        ctx.lineTo(64, 112);
        ctx.lineTo(64, 128);
        ctx.lineTo(8, 128);
        ctx.quadraticCurveTo(18, 66, 64, 62);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    kobold() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ДЕТАЛИЗИРОВАННОЕ КОПЬЁ С ОБМОТКОЙ И ГРАНЁНЫМ НАКОНЕЧНИКОМ (По диагонали)
        ctx.save();
        // Деревянное древко копья
        ctx.strokeStyle = '#5c3e26';
        ctx.lineWidth = 4.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(118, 124);
        ctx.lineTo(22, 28);
        ctx.stroke();

        // Кожаная обмотка-перехват у наконечника
        ctx.strokeStyle = '#2b190d';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(28, 34);
        ctx.lineTo(23, 29);
        ctx.stroke();

        // Листовидный стальной наконечник копья
        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(6, 12);
        ctx.lineTo(27, 21);
        ctx.lineTo(22, 28);
        ctx.lineTo(15, 33);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Светлая заточенная грань наконечника
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(6, 12);
        ctx.lineTo(27, 21);
        ctx.lineTo(22, 28);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 2. ЗАГНУТЫЕ РЕБРИСТЫЕ РОГА И ПЕРЕПОНЧАТЫЙ УШНОЙ ПЛАВНИК (Задний план)
        ctx.fillStyle = '#3d352e';
        // Верхний массивный рог
        ctx.beginPath();
        ctx.moveTo(82, 42);
        ctx.bezierCurveTo(96, 22, 114, 16, 122, 10);
        ctx.bezierCurveTo(110, 26, 98, 36, 90, 48);
        ctx.closePath();
        ctx.fill();

        // Нижний малый рог
        ctx.fillStyle = '#2b2520';
        ctx.beginPath();
        ctx.moveTo(88, 54);
        ctx.quadraticCurveTo(106, 46, 116, 36);
        ctx.lineTo(96, 58);
        ctx.closePath();
        ctx.fill();

        // Рельефные насечки на верхнем роге
        ctx.strokeStyle = '#6b5e52';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(91, 34); ctx.lineTo(95, 39);
        ctx.moveTo(99, 27); ctx.lineTo(103, 32);
        ctx.moveTo(107, 20); ctx.lineTo(110, 24);
        ctx.stroke();

        // 3. ЧЕШУЙЧАТАЯ ШЕЯ, КОЖАНЫЙ ДОСПЕХ И ПОТРЁПАННЫЙ БАГРОВЫЙ ШАРФ
        ctx.fillStyle = '#21592d';
        ctx.beginPath();
        ctx.moveTo(72, 78);
        ctx.quadraticCurveTo(96, 82, 112, 128);
        ctx.lineTo(42, 128);
        ctx.quadraticCurveTo(50, 98, 58, 82);
        ctx.closePath();
        ctx.fill();

        // Светло-салатовые горловые пластины на передней части шеи
        ctx.fillStyle = '#52a357';
        ctx.beginPath();
        ctx.moveTo(56, 84);
        ctx.quadraticCurveTo(50, 106, 48, 128);
        ctx.lineTo(74, 128);
        ctx.quadraticCurveTo(70, 104, 66, 84);
        ctx.closePath();
        ctx.fill();

        // Кожаный нагрудник-безрукавка с железной заклёпкой
        ctx.fillStyle = '#3b2416';
        ctx.beginPath();
        ctx.moveTo(38, 128);
        ctx.lineTo(52, 106);
        ctx.lineTo(98, 106);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#94a3b8';
        ctx.beginPath(); ctx.arc(62, 116, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(86, 116, 2.2, 0, Math.PI * 2); ctx.fill();

        // Развевающийся багровый шарф со складками
        ctx.fillStyle = '#8e2424';
        ctx.beginPath();
        ctx.moveTo(50, 90);
        ctx.quadraticCurveTo(72, 95, 92, 88);
        ctx.lineTo(120, 94);
        ctx.lineTo(112, 102);
        ctx.lineTo(118, 108);
        ctx.lineTo(88, 102);
        ctx.quadraticCurveTo(68, 108, 48, 101);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#591212';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(56, 96); ctx.quadraticCurveTo(76, 100, 106, 97);
        ctx.stroke();

        // 4. ГОЛОВА И ВЫТЯНУТАЯ ЯЩЕРИНАЯ МОРДА В ПРОФИЛЬ ВЛЕВО
        ctx.fillStyle = '#2d7a3e';
        ctx.beginPath();
        ctx.moveTo(90, 48); // Затылок
        ctx.lineTo(68, 34); // Надбровный гребень
        ctx.lineTo(18, 52); // Вытянутый кончик носа влево
        ctx.lineTo(22, 64); // Верхняя губа
        ctx.lineTo(58, 72); // Угол пасти
        ctx.lineTo(88, 74); // Скула
        ctx.closePath();
        ctx.fill();

        // Световая чешуйчатая полоса вдоль спинки носа
        ctx.fillStyle = '#479c59';
        ctx.beginPath();
        ctx.moveTo(22, 52);
        ctx.lineTo(56, 41);
        ctx.lineTo(52, 46);
        ctx.lineTo(24, 56);
        ctx.closePath();
        ctx.fill();

        // Зазубренный гребень на макушке и перепончатое ухо на скуле
        ctx.fillStyle = '#164222';
        ctx.beginPath();
        ctx.moveTo(66, 36); ctx.lineTo(74, 24); ctx.lineTo(79, 38);
        ctx.lineTo(86, 28); ctx.lineTo(88, 44);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#3d914f';
        ctx.beginPath();
        ctx.moveTo(82, 58); ctx.lineTo(96, 54); ctx.lineTo(86, 68);
        ctx.closePath();
        ctx.fill();

        // Ноздря на кончике морды
        ctx.fillStyle = '#103018';
        ctx.beginPath(); ctx.arc(24, 53, 1.8, 0, Math.PI * 2); ctx.fill();

        // 5. ПРИОТКРЫТАЯ ОСКАЛЕННАЯ ПАСТЬ, ЯЗЫК И ОСТРЫЕ КЛЫКИ
        ctx.fillStyle = '#1f0d10';
        ctx.beginPath();
        ctx.moveTo(22, 63);
        ctx.lineTo(60, 71);
        ctx.lineTo(28, 86);
        ctx.lineTo(25, 79);
        ctx.lineTo(48, 71);
        ctx.closePath();
        ctx.fill();

        // Алый язык внутри пасти
        ctx.fillStyle = '#c0392b';
        ctx.beginPath();
        ctx.moveTo(52, 72);
        ctx.quadraticCurveTo(38, 76, 29, 76);
        ctx.quadraticCurveTo(37, 81, 54, 75);
        ctx.closePath();
        ctx.fill();

        // Нижняя челюсть
        ctx.fillStyle = '#3d914f';
        ctx.beginPath();
        ctx.moveTo(58, 70);
        ctx.lineTo(25, 80);
        ctx.lineTo(31, 88);
        ctx.lineTo(66, 86);
        ctx.lineTo(88, 74);
        ctx.closePath();
        ctx.fill();

        // Острые белые зубы-иглы сверху и снизу
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.moveTo(24, 63); ctx.lineTo(27, 70); ctx.lineTo(30, 64); ctx.fill();
        ctx.beginPath(); ctx.moveTo(33, 65); ctx.lineTo(36, 71); ctx.lineTo(39, 66); ctx.fill();
        ctx.beginPath(); ctx.moveTo(42, 67); ctx.lineTo(45, 72); ctx.lineTo(48, 68); ctx.fill();

        ctx.beginPath(); ctx.moveTo(27, 80); ctx.lineTo(30, 74); ctx.lineTo(33, 79); ctx.fill();
        ctx.beginPath(); ctx.moveTo(36, 78); ctx.lineTo(39, 72); ctx.lineTo(42, 76); ctx.fill();
        ctx.beginPath(); ctx.moveTo(45, 75); ctx.lineTo(48, 70); ctx.lineTo(51, 73); ctx.fill();

        // 6. ХИЩНЫЙ ЯНТАРНЫЙ ЗМЕИНЫЙ ГЛАЗ
        ctx.fillStyle = '#103018';
        ctx.beginPath();
        ctx.moveTo(55, 49);
        ctx.lineTo(71, 43);
        ctx.lineTo(66, 55);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.moveTo(57, 49);
        ctx.lineTo(69, 44.5);
        ctx.lineTo(65, 53.5);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(62.5, 45.5, 1.5, 6.5);

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(61.5, 47.5, 1, 0, Math.PI * 2); ctx.fill();

        // Надбровная дуга
        ctx.strokeStyle = '#103018';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(53, 46);
        ctx.lineTo(71, 41);
        ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень вдоль нижней челюсти и спины)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(25, 80);
        ctx.lineTo(66, 86);
        ctx.lineTo(88, 74);
        ctx.lineTo(112, 128);
        ctx.lineTo(42, 128);
        ctx.lineTo(56, 84);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    tiger() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. МОЩНАЯ ШЕЯ, ПЛЕЧИ И БЕЛАЯ ПУШИСТАЯ ГРУДКА ТИГРА (Задний план)
        ctx.fillStyle = '#c2591b';
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.quadraticCurveTo(28, 76, 64, 72);
        ctx.quadraticCurveTo(100, 76, 114, 128);
        ctx.closePath();
        ctx.fill();

        // Белоснежный пушистый мех на груди и шее
        ctx.fillStyle = '#f8f5ee';
        ctx.beginPath();
        ctx.moveTo(42, 96);
        ctx.quadraticCurveTo(64, 106, 86, 96);
        ctx.lineTo(92, 128);
        ctx.lineTo(36, 128);
        ctx.closePath();
        ctx.fill();

        // Чёрные тигровые полосы на плечах
        ctx.fillStyle = '#18181b';
        ctx.beginPath();
        ctx.moveTo(18, 106); ctx.lineTo(34, 112); ctx.lineTo(20, 116);
        ctx.moveTo(110, 106); ctx.lineTo(94, 112); ctx.lineTo(108, 116);
        ctx.closePath();
        ctx.fill();

        // 2. ОКРУГЛЫЕ ТИГРИНЫЕ УШИ С ЧЁРНОЙ СПИНКОЙ И БЕЛЫМ ПЯТНОМ
        ctx.fillStyle = '#18181b';
        ctx.beginPath(); ctx.arc(36, 40, 10.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(92, 40, 10.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#f8f5ee';
        ctx.beginPath(); ctx.arc(36, 40, 5.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(92, 40, 5.5, 0, Math.PI * 2); ctx.fill();

        // 3. ШИРОКАЯ ГОЛОВА ТИГРА И ПУШИСТЫЕ БАКЕНБАРДЫ ПО БОКАМ ЩЁК
        ctx.fillStyle = '#ea7b30';
        ctx.beginPath();
        ctx.moveTo(38, 42);
        ctx.quadraticCurveTo(64, 30, 90, 42);
        ctx.lineTo(104, 72); // Правая пушистая бакенбарда
        ctx.lineTo(88, 96);
        ctx.lineTo(64, 108);
        ctx.lineTo(40, 96);
        ctx.lineTo(24, 72);  // Левая пушистая бакенбарда
        ctx.closePath();
        ctx.fill();

        // Светло-кремовые пушистые бакенбарды и дуги над глазами
        ctx.fillStyle = '#f8f5ee';
        ctx.beginPath();
        ctx.moveTo(26, 72);
        ctx.lineTo(38, 66);
        ctx.lineTo(44, 86);
        ctx.lineTo(36, 92);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(102, 72);
        ctx.lineTo(90, 66);
        ctx.lineTo(84, 86);
        ctx.lineTo(92, 92);
        ctx.closePath();
        ctx.fill();

        // Светлые меховые пятна над бровями
        ctx.beginPath(); ctx.ellipse(49, 49, 6, 2.8, -0.15, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(79, 49, 6, 2.8, 0.15, 0, Math.PI * 2); ctx.fill();

        // 4. КОНТРАСТНЫЕ ЧЁРНЫЕ ТИГРОВЫЕ ПОЛОСЫ НА ЛБУ И СКУЛАХ
        ctx.fillStyle = '#18181b';
        // Иероглиф «Ван» (Король зверей) на лбу тигра
        ctx.beginPath();
        ctx.moveTo(52, 39); ctx.lineTo(76, 39); ctx.lineTo(74, 42); ctx.lineTo(54, 42);
        ctx.moveTo(50, 45); ctx.lineTo(78, 45); ctx.lineTo(76, 48); ctx.lineTo(52, 48);
        ctx.moveTo(62, 37); ctx.lineTo(66, 37); ctx.lineTo(66, 51); ctx.lineTo(62, 51);
        ctx.closePath();
        ctx.fill();

        // Боковые полосы на щеках и бакенбардах
        ctx.beginPath();
        ctx.moveTo(31, 61); ctx.lineTo(43, 64); ctx.lineTo(30, 67);
        ctx.moveTo(27, 73); ctx.lineTo(41, 74); ctx.lineTo(29, 79);
        ctx.moveTo(97, 61); ctx.lineTo(85, 64); ctx.lineTo(98, 67);
        ctx.moveTo(101, 73); ctx.lineTo(87, 74); ctx.lineTo(99, 79);
        ctx.closePath();
        ctx.fill();

        // Складки яростного рычания на переносице
        ctx.strokeStyle = '#7c2d12';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(57, 62); ctx.quadraticCurveTo(64, 59, 71, 62);
        ctx.moveTo(56, 66); ctx.quadraticCurveTo(64, 63, 72, 66);
        ctx.stroke();

        // 5. СВИРЕПЫЙ ВЗГЛЯД ЯНТАРНО-ЗОЛОТЫХ ГЛАЗ ХИЩНИКА
        ctx.fillStyle = '#18181b';
        ctx.beginPath(); ctx.ellipse(48, 56, 5.8, 3.4, 0.12, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(80, 56, 5.8, 3.4, -0.12, 0, Math.PI * 2); ctx.fill();

        // Яркая золотисто-янтарная радужка
        ctx.fillStyle = '#facc15';
        ctx.beginPath(); ctx.arc(48.5, 56, 2.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(79.5, 56, 2.8, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#09090b';
        ctx.beginPath(); ctx.arc(48.5, 56, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(79.5, 56, 1.3, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(49.5, 55, 0.85, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(78.5, 55, 0.85, 0, Math.PI * 2); ctx.fill();

        // Нависшие грозные надбровные дуги
        ctx.strokeStyle = '#18181b';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(40, 50); ctx.lineTo(56, 55);
        ctx.moveTo(88, 50); ctx.lineTo(72, 55);
        ctx.stroke();

        // 6. БЕЛЫЕ ПОДУСНИКИ, РОЗОВЫЙ НОС И РЫЧАЩАЯ ПАСТЬ С КЛЫКАМИ
        // Белые подусники и нижняя челюсть
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(54, 78, 8.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 78, 8.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(50, 92);
        ctx.quadraticCurveTo(64, 106, 78, 92);
        ctx.closePath();
        ctx.fill();

        // Тёмная глубина пасти
        ctx.fillStyle = '#290a0d';
        ctx.beginPath();
        ctx.moveTo(50, 81);
        ctx.quadraticCurveTo(64, 77, 78, 81);
        ctx.lineTo(75, 95);
        ctx.quadraticCurveTo(64, 100, 53, 95);
        ctx.closePath();
        ctx.fill();

        // Алый язык внутри пасти
        ctx.fillStyle = '#e11d48';
        ctx.beginPath();
        ctx.ellipse(64, 93, 6.5, 3.2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Четыре крупных белоснежных клыка и мелкие резцы
        ctx.fillStyle = '#ffffff';
        // Верхние клыки
        ctx.beginPath(); ctx.moveTo(52, 81); ctx.lineTo(54.8, 90); ctx.lineTo(57.5, 81); ctx.fill();
        ctx.beginPath(); ctx.moveTo(76, 81); ctx.lineTo(73.2, 90); ctx.lineTo(70.5, 81); ctx.fill();
        // Мелкие верхние резцы
        ctx.fillRect(59.2, 80, 2.2, 3.2);
        ctx.fillRect(62.9, 80, 2.2, 3.2);
        ctx.fillRect(66.6, 80, 2.2, 3.2);

        // Нижние клыки
        ctx.beginPath(); ctx.moveTo(54, 95); ctx.lineTo(56.5, 87); ctx.lineTo(59, 95); ctx.fill();
        ctx.beginPath(); ctx.moveTo(74, 95); ctx.lineTo(71.5, 87); ctx.lineTo(69, 95); ctx.fill();

        // Влажный розовый тигриный нос с чёрным кантом
        ctx.fillStyle = '#f472b6';
        ctx.strokeStyle = '#18181b';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(56, 70);
        ctx.quadraticCurveTo(64, 67, 72, 70);
        ctx.lineTo(68, 76.5);
        ctx.lineTo(60, 76.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
        ctx.beginPath();
        ctx.moveTo(64, 30);
        ctx.quadraticCurveTo(50, 35, 38, 42);
        ctx.lineTo(24, 72);
        ctx.lineTo(40, 96);
        ctx.lineTo(64, 108);
        ctx.lineTo(64, 128);
        ctx.lineTo(14, 128);
        ctx.quadraticCurveTo(28, 76, 64, 72);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    dryad() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ВЕТВИ И ПЫШНАЯ КРОНА ЛИСТВЕННЫХ ВОЛОС НА ЗАДНЕМ ПЛАНЕ
        // Изящные древесные ветви, растущие из причёски вверх
        ctx.strokeStyle = '#5c3a21';
        ctx.lineWidth = 3.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(46, 36);
        ctx.quadraticCurveTo(32, 20, 26, 8);
        ctx.moveTo(35, 22);
        ctx.lineTo(20, 20);
        ctx.moveTo(82, 36);
        ctx.quadraticCurveTo(96, 20, 102, 8);
        ctx.moveTo(93, 22);
        ctx.lineTo(108, 20);
        ctx.stroke();

        // Пышный каскад изумрудных волос-листвы
        ctx.fillStyle = '#1b4332';
        ctx.beginPath();
        ctx.moveTo(32, 54);
        ctx.quadraticCurveTo(20, 92, 20, 128);
        ctx.lineTo(108, 128);
        ctx.quadraticCurveTo(108, 92, 96, 54);
        ctx.closePath();
        ctx.fill();

        // Световые салатово-изумрудные пряди по бокам причёски
        ctx.fillStyle = '#2d6a4f';
        ctx.beginPath();
        ctx.arc(36, 58, 15, 0, Math.PI * 2);
        ctx.arc(92, 58, 15, 0, Math.PI * 2);
        ctx.arc(32, 84, 14, 0, Math.PI * 2);
        ctx.arc(96, 84, 14, 0, Math.PI * 2);
        ctx.fill();

        // 2. ОДЕЯНИЕ ИЗ ЖИВОГО МХА, КОРЫ И ЛИСТЬЕВ ПАПОРОТНИКА
        ctx.fillStyle = '#244f38';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.quadraticCurveTo(32, 96, 64, 96);
        ctx.quadraticCurveTo(96, 96, 112, 128);
        ctx.closePath();
        ctx.fill();

        // Ожерелье-воротник из молодых салатовых листьев
        ctx.fillStyle = '#52b788';
        ctx.beginPath();
        ctx.ellipse(42, 104, 8, 4, 0.45, 0, Math.PI * 2);
        ctx.ellipse(54, 110, 8, 4, 0.25, 0, Math.PI * 2);
        ctx.ellipse(74, 110, 8, 4, -0.25, 0, Math.PI * 2);
        ctx.ellipse(86, 104, 8, 4, -0.45, 0, Math.PI * 2);
        ctx.fill();

        // Сияющий янтарно-изумрудный лесной кристалл на груди
        ctx.fillStyle = '#ffd166';
        ctx.strokeStyle = '#1b4332';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(64, 108);
        ctx.lineTo(69, 115);
        ctx.lineTo(64, 122);
        ctx.lineTo(59, 115);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 3. ЗАОСТРЁННЫЕ ЛЕСНЫЕ УШКИ
        ctx.fillStyle = '#c4a47c';
        ctx.beginPath(); ctx.moveTo(43, 60); ctx.lineTo(22, 46); ctx.lineTo(42, 70); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(85, 60); ctx.lineTo(106, 46); ctx.lineTo(86, 70); ctx.closePath(); ctx.fill();

        // 4. ШЕЯ И НЕЖНОЕ ЛИЦО С ЛЕСНОЙ ПЫЛЬЦОЙ-ВЕСНУШКАМИ
        ctx.fillStyle = '#c9a982';
        ctx.fillRect(55, 84, 18, 16);

        ctx.fillStyle = '#e6c9a5';
        ctx.beginPath();
        ctx.moveTo(45, 48);
        ctx.quadraticCurveTo(64, 34, 83, 48);
        ctx.lineTo(81, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(47, 78);
        ctx.closePath();
        ctx.fill();

        // Золотистые веснушки-пыльца на щеках
        ctx.fillStyle = '#b0895a';
        ctx.fillRect(49, 68, 1.5, 1.5); ctx.fillRect(53, 70, 1.5, 1.5);
        ctx.fillRect(79, 68, 1.5, 1.5); ctx.fillRect(75, 70, 1.5, 1.5);

        // 5. ПЕРЕДНИЕ ПРЯДИ ЛИСТВЫ И ВЕНОК ИЗ ЛЕСНЫХ ЦВЕТОВ НА ЛБУ
        ctx.fillStyle = '#40916c';
        ctx.beginPath();
        ctx.moveTo(41, 52);
        ctx.quadraticCurveTo(44, 24, 64, 22);
        ctx.quadraticCurveTo(84, 24, 87, 52);
        ctx.quadraticCurveTo(75, 40, 64, 42);
        ctx.quadraticCurveTo(53, 40, 41, 52);
        ctx.closePath();
        ctx.fill();

        // Венок из нежных лесных бутонов и листочков на лбу
        ctx.fillStyle = '#74c69d';
        ctx.beginPath();
        ctx.ellipse(50, 40, 6, 2.8, -0.3, 0, Math.PI * 2);
        ctx.ellipse(78, 40, 6, 2.8, 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Цветы в венке
        [
            [47, 41, '#f48fb1'],
            [64, 37, '#ffd166'],
            [81, 41, '#f48fb1']
        ].forEach(([fx, fy, color]) => {
            ctx.fillStyle = color;
            ctx.beginPath(); ctx.arc(fx, fy, 3.8, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath(); ctx.arc(fx, fy, 1.3, 0, Math.PI * 2); ctx.fill();
        });

        // 6. РОВНЫЕ, СИЯЮЩИЕ ИЗУМРУДНЫЕ ГЛАЗА И ЗАГАДОЧНАЯ ПОЛУУЛЫБКА
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(54, 60, 4.8, 2.3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 60, 4.8, 2.3, 0, 0, Math.PI * 2); ctx.fill();

        // Яркая изумрудно-золотая радужка духа природы
        ctx.fillStyle = '#10b981';
        ctx.beginPath(); ctx.arc(54, 60, 2.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 60, 2.1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#064e3b';
        ctx.beginPath(); ctx.arc(54, 60, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 60, 1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(54.8, 59.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74.8, 59.2, 0.7, 0, Math.PI * 2); ctx.fill();

        // Изящные лесные брови
        ctx.strokeStyle = '#1b4332';
        ctx.lineWidth = 1.3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(48, 55); ctx.quadraticCurveTo(54, 53.5, 59, 55.5);
        ctx.moveTo(69, 55.5); ctx.quadraticCurveTo(74, 53.5, 80, 55);
        ctx.stroke();

        // Аккуратный носик и спокойная полуулыбка
        ctx.strokeStyle = '#b5936b';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 57); ctx.lineTo(62.5, 72); ctx.lineTo(65.5, 72); ctx.stroke();

        ctx.fillStyle = '#c86d6d';
        ctx.beginPath();
        ctx.ellipse(64, 81, 4.8, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // 7. СВЕТЯЩИЕСЯ ЛЕСНЫЕ СВЕТЛЯЧКИ ВОКРУГ ДРИАДЫ
        ctx.fillStyle = 'rgba(255, 209, 102, 0.45)';
        ctx.beginPath(); ctx.arc(20, 34, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(108, 36, 4.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#fff3b0';
        ctx.beginPath(); ctx.arc(20, 34, 1.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(108, 36, 1.8, 0, Math.PI * 2); ctx.fill();

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 22);
        ctx.quadraticCurveTo(44, 24, 41, 52);
        ctx.lineTo(47, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.lineTo(32, 54);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    raven() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАДНИЙ ПЛАН: Мощная пернатая шея и грудь ворона с иссиня-графитовым отливом
        ctx.fillStyle = '#0f131c';
        ctx.beginPath();
        ctx.moveTo(64, 52);
        ctx.quadraticCurveTo(98, 66, 116, 128);
        ctx.lineTo(36, 128);
        ctx.quadraticCurveTo(44, 92, 52, 76);
        ctx.closePath();
        ctx.fill();

        // Ярусные перья на груди и загривке (flat-переливы)
        ctx.fillStyle = '#1e2536';
        ctx.beginPath();
        ctx.moveTo(46, 94);
        ctx.lineTo(58, 106);
        ctx.lineTo(70, 94);
        ctx.lineTo(82, 108);
        ctx.lineTo(94, 94);
        ctx.lineTo(104, 128);
        ctx.lineTo(40, 128);
        ctx.closePath();
        ctx.fill();

        // Взъерошенные перья на затылке ворона
        ctx.fillStyle = '#181e2c';
        ctx.beginPath();
        ctx.moveTo(82, 42); ctx.lineTo(98, 36); ctx.lineTo(88, 50);
        ctx.moveTo(86, 52); ctx.lineTo(102, 52); ctx.lineTo(90, 62);
        ctx.moveTo(88, 64); ctx.lineTo(104, 68); ctx.lineTo(90, 74);
        ctx.closePath();
        ctx.fill();

        // 2. ГОЛОВА И ПЕРЬЕВАЯ «БОРОДКА» ПОД КЛЮВОМ
        ctx.fillStyle = '#141924';
        ctx.beginPath();
        ctx.moveTo(88, 48); // Затылок
        ctx.quadraticCurveTo(72, 28, 48, 38); // Округлое темя ворона
        ctx.lineTo(36, 48); // Переносица
        ctx.lineTo(38, 76); // Основание нижней челюсти
        ctx.quadraticCurveTo(64, 86, 88, 68); // Скула
        ctx.closePath();
        ctx.fill();

        // Световой стальной отлив на макушке головы
        ctx.fillStyle = '#2a3347';
        ctx.beginPath();
        ctx.moveTo(48, 40);
        ctx.quadraticCurveTo(68, 32, 84, 46);
        ctx.quadraticCurveTo(68, 42, 50, 46);
        ctx.closePath();
        ctx.fill();

        // Взъерошенные перья-бородка под подклювьем
        ctx.fillStyle = '#1e2536';
        ctx.beginPath();
        ctx.moveTo(38, 72);
        ctx.lineTo(44, 88);
        ctx.lineTo(52, 78);
        ctx.lineTo(58, 90);
        ctx.lineTo(66, 78);
        ctx.closePath();
        ctx.fill();

        // 3. МОЩНЫЙ АНАТОМИЧЕСКИЙ КЛЮВ ВОРОНА (Вытянут влево)
        // Верхнее надклювье (массивное, слегка загнутое на кончике)
        ctx.fillStyle = '#1c222e';
        ctx.beginPath();
        ctx.moveTo(44, 44);
        ctx.quadraticCurveTo(24, 46, 10, 61); // Изогнутый кончик клюва
        ctx.lineTo(14, 64);
        ctx.lineTo(42, 64);
        ctx.closePath();
        ctx.fill();

        // Светлая костяно-графитовая грань по верху клюва
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(43, 45);
        ctx.quadraticCurveTo(25, 47, 12, 60);
        ctx.lineTo(15, 61);
        ctx.quadraticCurveTo(27, 51, 42, 50);
        ctx.closePath();
        ctx.fill();

        // Нижнее подклювье
        ctx.fillStyle = '#0d1017';
        ctx.beginPath();
        ctx.moveTo(42, 64);
        ctx.lineTo(15, 64);
        ctx.quadraticCurveTo(26, 74, 41, 74);
        ctx.closePath();
        ctx.fill();

        // Щетинки-перья у основания клюва (визитная карточка ворона)
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(44, 47); ctx.lineTo(31, 51);
        ctx.moveTo(43, 51); ctx.lineTo(29, 55);
        ctx.stroke();

        // 4. ПРОНЗИТЕЛЬНЫЙ ГЛАЗ ВОРОНА С ЯНТАРНО-АМЕТИСТОВОЙ ОКАНТОВКОЙ
        // Тёмная окантовка века
        ctx.fillStyle = '#090b10';
        ctx.beginPath();
        ctx.arc(57, 53, 6.2, 0, Math.PI * 2);
        ctx.fill();

        // Светящаяся радужка
        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.arc(57, 53, 4.6, 0, Math.PI * 2);
        ctx.fill();

        // Глубокий чёрный птичий зрачок
        ctx.fillStyle = '#05070a';
        ctx.beginPath();
        ctx.arc(57, 53, 2.8, 0, Math.PI * 2);
        ctx.fill();

        // Яркий хрустальный блик
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(55.6, 51.6, 1.3, 0, Math.PI * 2);
        ctx.fill();

        // Грозная надбровная складка перьев
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(50, 47);
        ctx.quadraticCurveTo(58, 45, 65, 49);
        ctx.stroke();

        // 5. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень вдоль нижней части клюва и груди)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        ctx.beginPath();
        ctx.moveTo(15, 64);
        ctx.quadraticCurveTo(26, 74, 41, 74);
        ctx.lineTo(36, 128);
        ctx.lineTo(116, 128);
        ctx.lineTo(96, 86);
        ctx.lineTo(52, 76);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    toad() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАДНИЙ ПЛАН: Широкая бугристая спина и мощные плечи амфибии
        ctx.fillStyle = '#243b1c';
        ctx.beginPath();
        ctx.moveTo(10, 128);
        ctx.quadraticCurveTo(22, 74, 64, 68);
        ctx.quadraticCurveTo(106, 74, 118, 128);
        ctx.closePath();
        ctx.fill();

        // Тёмные пятна и крупные бородавки на спине
        ctx.fillStyle = '#182912';
        ctx.beginPath(); ctx.arc(26, 94, 6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(102, 94, 6.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(19, 112, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(109, 112, 5, 0, Math.PI * 2); ctx.fill();

        // 2. МАССИВНАЯ ПРИПЛЮСНУТАЯ ГОЛОВА И РАЗДУТЫЕ ЩЁКИ ЖАБЫ
        ctx.fillStyle = '#3f632c'; // Насыщенная болотно-оливковая кожа
        ctx.beginPath();
        ctx.moveTo(32, 50);
        ctx.quadraticCurveTo(64, 42, 96, 50);
        ctx.lineTo(110, 80); // Широкая правая щека
        ctx.lineTo(94, 112);
        ctx.quadraticCurveTo(64, 122, 34, 112);
        ctx.lineTo(18, 80);  // Широкая левая щека
        ctx.closePath();
        ctx.fill();

        // Более светлая оливково-салатовая зона на морде и скулах (световой объём)
        ctx.fillStyle = '#537d3b';
        ctx.beginPath();
        ctx.moveTo(38, 54);
        ctx.quadraticCurveTo(64, 48, 90, 54);
        ctx.lineTo(100, 78);
        ctx.lineTo(28, 78);
        ctx.closePath();
        ctx.fill();

        // Раздутый охристо-кремовый горловой мешок снизу со складками
        ctx.fillStyle = '#b5a86b';
        ctx.beginPath();
        ctx.moveTo(30, 82);
        ctx.quadraticCurveTo(64, 75, 98, 82);
        ctx.lineTo(90, 112);
        ctx.quadraticCurveTo(64, 122, 38, 112);
        ctx.closePath();
        ctx.fill();

        // Рельефные складки раздутого зоба
        ctx.strokeStyle = '#8c7f49';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(46, 92); ctx.quadraticCurveTo(44, 104, 48, 113);
        ctx.moveTo(64, 91); ctx.quadraticCurveTo(64, 105, 64, 116);
        ctx.moveTo(82, 92); ctx.quadraticCurveTo(84, 104, 80, 113);
        ctx.stroke();

        // 3. БУГРИСТАЯ ТЕКСТУРА КОЖИ И ОКОЛОУШНЫЕ ЖЕЛЕЗЫ
        ctx.fillStyle = '#29421c';
        // Околоушные железы по бокам
        ctx.beginPath(); ctx.ellipse(26, 68, 5, 9, -0.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(102, 68, 5, 9, 0.3, 0, Math.PI * 2); ctx.fill();

        // Бородавки на щеках и переносице
        ctx.beginPath(); ctx.arc(46, 66, 2.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(82, 66, 3.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(64, 54, 2.5, 0, Math.PI * 2); ctx.fill();

        // 4. ВЫПУКЛЫЕ ЯНТАРНО-ЗОЛОТЫЕ ГЛАЗА С ТЯЖЁЛЫМИ НАДБРОВНЫМИ ДУГАМИ
        // Кожные бугристые веки-надбровья
        ctx.fillStyle = '#2c471f';
        ctx.beginPath(); ctx.arc(38, 46, 12.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(90, 46, 12.5, 0, Math.PI * 2); ctx.fill();

        // Огненно-золотая радужка жабы
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.arc(38, 48, 9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(90, 48, 9, 0, Math.PI * 2); ctx.fill();

        // Медно-оранжевый внутренний ободок радужки
        ctx.fillStyle = '#d97706';
        ctx.beginPath(); ctx.ellipse(38, 48, 7.5, 5.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(90, 48, 7.5, 5.5, 0, 0, Math.PI * 2); ctx.fill();

        // Горизонтальные амфибийные зрачки
        ctx.fillStyle = '#0f170a';
        ctx.beginPath(); ctx.roundRect(30, 46.5, 16, 3.2, 1.5); ctx.fill();
        ctx.beginPath(); ctx.roundRect(82, 46.5, 16, 3.2, 1.5); ctx.fill();

        // Живые белые блики на глазах
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(41, 44, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(87, 44, 1.8, 0, Math.PI * 2); ctx.fill();

        // Нависшие верхние веки
        ctx.fillStyle = '#3f632c';
        ctx.beginPath();
        ctx.arc(38, 46, 11.5, Math.PI * 1.05, Math.PI * 1.95);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.arc(90, 46, 11.5, Math.PI * 1.05, Math.PI * 1.95);
        ctx.closePath();
        ctx.fill();

        // 5. НОЗДРИ И ШИРОКАЯ УГРЮМАЯ ПАСТЬ
        ctx.fillStyle = '#182912';
        ctx.beginPath(); ctx.arc(57, 61, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(71, 61, 2, 0, Math.PI * 2); ctx.fill();

        // Широкий рот от щеки до щеки с опущенными уголками
        ctx.strokeStyle = '#182912';
        ctx.lineWidth = 2.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(23, 81);
        ctx.quadraticCurveTo(64, 73, 105, 81);
        ctx.stroke();

        // Складки в уголках пасти
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(22, 78); ctx.lineTo(25, 84);
        ctx.moveTo(106, 78); ctx.lineTo(103, 84);
        ctx.stroke();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 34);
        ctx.lineTo(38, 34);
        ctx.lineTo(18, 80);
        ctx.lineTo(10, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    worm() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАДНИЙ ПЛАН: Мощные изгибающиеся кольца тела подземного червя
        ctx.fillStyle = '#24123d';
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.bezierCurveTo(10, 92, 34, 76, 64, 76);
        ctx.bezierCurveTo(94, 76, 118, 92, 114, 128);
        ctx.closePath();
        ctx.fill();

        // Острые хитиновые спинные шипы по бокам сегментов тела
        ctx.fillStyle = '#160926';
        ctx.beginPath();
        ctx.moveTo(22, 96); ctx.lineTo(6, 86); ctx.lineTo(18, 108);
        ctx.moveTo(16, 112); ctx.lineTo(4, 108); ctx.lineTo(14, 124);
        ctx.moveTo(106, 96); ctx.lineTo(122, 86); ctx.lineTo(110, 108);
        ctx.moveTo(112, 112); ctx.lineTo(124, 108); ctx.lineTo(114, 124);
        ctx.closePath();
        ctx.fill();

        // 2. МАССИВНЫЙ СЕГМЕНТИРОВАННЫЙ ГОЛОВНОЙ ПАНЦИРЬ
        ctx.fillStyle = '#4a237a';
        ctx.beginPath();
        ctx.moveTo(24, 128);
        ctx.lineTo(28, 66);
        ctx.quadraticCurveTo(64, 28, 100, 66);
        ctx.lineTo(104, 128);
        ctx.closePath();
        ctx.fill();

        // Световая зона на правой стороне хитинового панциря
        ctx.fillStyle = '#62319e';
        ctx.beginPath();
        ctx.moveTo(64, 44);
        ctx.quadraticCurveTo(88, 50, 100, 66);
        ctx.lineTo(104, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        // Рельефные кольцевые складки панциря (в перспективе дугами)
        ctx.strokeStyle = '#281147';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(27, 94); ctx.quadraticCurveTo(64, 112, 101, 94);
        ctx.moveTo(25, 112); ctx.quadraticCurveTo(64, 128, 103, 112);
        ctx.stroke();

        // Костяные наросты-пластины по бокам головы
        ctx.fillStyle = '#331757';
        ctx.beginPath(); ctx.ellipse(29, 76, 4.5, 9, -0.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(99, 76, 4.5, 9, 0.2, 0, Math.PI * 2); ctx.fill();

        // 3. ОГРОМНАЯ РАСПАХНУТАЯ ПАСТЬ-ВОРОНКА ПОЖИРАТЕЛЯ
        // Мясистый багрово-фиолетовый обод губ
        ctx.fillStyle = '#6e2354';
        ctx.beginPath();
        ctx.arc(64, 68, 28, 0, Math.PI * 2);
        ctx.fill();

        // Бездонная чёрная глотка
        ctx.fillStyle = '#11041a';
        ctx.beginPath();
        ctx.arc(64, 68, 23, 0, Math.PI * 2);
        ctx.fill();

        // Внутреннее кольцо-сфинктер глотки
        ctx.strokeStyle = '#3b1240';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(64, 68, 13, 0, Math.PI * 2);
        ctx.stroke();

        // 4. ТРИ КОНЦЕНТРИЧЕСКИХ РЯДА ЗАГНУТЫХ ВНУТРЬ ОСТРЫХ ЗУБОВ
        ctx.fillStyle = '#f8f5e6';
        // Внешний ряд из 12 крупных клыков
        for (let i = 0; i < 12; i++) {
            const angle = (i * Math.PI * 2) / 12;
            ctx.save();
            ctx.translate(64, 68);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(-3.2, -24);
            ctx.lineTo(0, -15.5);
            ctx.lineTo(3.2, -24);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        // Внутренний ряд из 8 острых зубов-игл (со сдвигом угла)
        ctx.fillStyle = '#e2dcc5';
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI * 2) / 8 + Math.PI / 8;
            ctx.save();
            ctx.translate(64, 68);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(-2.2, -14);
            ctx.lineTo(0, -8);
            ctx.lineTo(2.2, -14);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        // 5. ЧЕТЫРЕ МАССИВНЫХ ХИТИНОВЫХ ЖВАЛА-КРЮКА ВОКРУГ ПАСТИ
        const drawMandible = (angleDeg) => {
            ctx.save();
            ctx.translate(64, 68);
            ctx.rotate((Math.PI / 180) * angleDeg);

            // Мощное тёмное хитиновое основание жвала
            ctx.fillStyle = '#1c0b2e';
            ctx.beginPath();
            ctx.moveTo(-7, -26);
            ctx.quadraticCurveTo(-12, -40, 0, -48);
            ctx.quadraticCurveTo(4, -36, 5, -26);
            ctx.closePath();
            ctx.fill();

            // Острый костяной коготь на кончике жвала
            ctx.fillStyle = '#ffd875';
            ctx.beginPath();
            ctx.moveTo(-5, -38);
            ctx.quadraticCurveTo(-6, -46, 2, -52);
            ctx.quadraticCurveTo(3, -43, 1, -37);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        };

        drawMandible(-48);  // Верхнее левое жвало
        drawMandible(48);   // Верхнее правое жвало
        drawMandible(-132); // Нижнее левое жвало
        drawMandible(132);  // Нижнее правое жвало

        // 6. СВЕТЯЩИЕСЯ БРЫЗГИ ЯДОВИТОЙ СЛЮНЫ ВОКРУГ ПАСТИ
        ctx.fillStyle = '#d946ef';
        ctx.beginPath(); ctx.arc(20, 42, 2.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(108, 42, 2.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(16, 66, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(112, 66, 1.8, 0, Math.PI * 2); ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину тела)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.moveTo(64, 44);
        ctx.quadraticCurveTo(40, 50, 28, 66);
        ctx.lineTo(14, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    tick() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 2. ЧЛЕНИСТЫЕ ЖЕСТКИЕ ЛАПЫ (Угловые суставы цепляются по бокам)
        ctx.strokeStyle = '#1a110b'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'miter';

        // Левые лапы (3 массивных загнутых сустава)
        ctx.beginPath(); ctx.moveTo(44, 60); ctx.lineTo(14, 45); ctx.lineTo(10, 75); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(42, 75); ctx.lineTo(8, 75); ctx.lineTo(12, 105); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(46, 90); ctx.lineTo(16, 100); ctx.lineTo(24, 122); ctx.stroke();

        // Правые лапы (3 массивных загнутых сустава)
        ctx.strokeStyle = '#261b12'; // Flat-контраст для глубины
        ctx.beginPath(); ctx.moveTo(84, 60); ctx.lineTo(114, 45); ctx.lineTo(118, 75); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(86, 75); ctx.lineTo(120, 75); ctx.lineTo(116, 105); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(82, 90); ctx.lineTo(112, 100); ctx.lineTo(104, 122); ctx.stroke();

        // 3. РАЗДУТОЕ ТЕЛО ПАРАЗИТА (Огромное каплевидное кольчатое брюшко)
        ctx.fillStyle = '#5c251e'; // Напитавшийся кровью багрово-бурый хитин
        ctx.beginPath();
        ctx.moveTo(64, 46);
        ctx.bezierCurveTo(34, 46, 28, 92, 38, 114);
        ctx.quadraticCurveTo(64, 125, 90, 114);
        ctx.bezierCurveTo(100, 92, 94, 46, 64, 46);
        ctx.closePath(); ctx.fill();

        // Поперечные складки раздутого брюшка (Кольца паразита)
        ctx.strokeStyle = '#3d1612'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(34, 76); ctx.quadraticCurveTo(64, 84, 94, 76); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(32, 92); ctx.quadraticCurveTo(64, 101, 96, 92); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(37, 106); ctx.quadraticCurveTo(64, 115, 91, 106); ctx.stroke();

        // 4. ГОЛОВОГРУДЬ И СТРАШНЫЙ КОЛЮЩИЙ ХОБОТОК (Гипостом)
        ctx.fillStyle = '#21120b'; // Маленький щиток головы сверху
        ctx.beginPath(); ctx.ellipse(64, 48, 12, 8, 0, 0, Math.PI * 2); ctx.fill();

        // Длинный, едкий колющий насос-жало по центру (направлен вверх-вперед)
        ctx.fillStyle = '#110906';
        ctx.fillRect(62, 28, 4, 14);
        // Острые боковые жвала-резцы, фиксирующие жертву
        ctx.fillStyle = '#7f8c8d'; // Стальные лезвия клыков
        ctx.beginPath(); ctx.moveTo(59, 36); ctx.lineTo(54, 25); ctx.lineTo(62, 34); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(69, 36); ctx.lineTo(74, 25); ctx.lineTo(66, 34); ctx.closePath(); ctx.fill();

        // Светящиеся капли ядовитой слюны на конце хоботка (Кислотный неон)
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath(); ctx.arc(64, 24, 1.5, 0, Math.PI * 2); ctx.fill();

        // 5. ЭФФЕКТ FLAT-ОБЪЕМА (Полупрозрачная глубокая маска тени на левую половину клеща)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        ctx.beginPath(); ctx.moveTo(64, 24); ctx.lineTo(10, 45); ctx.lineTo(24, 122); ctx.lineTo(64, 128); ctx.closePath(); ctx.fill();

        return canvas.toDataURL();
    },

    dragon() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. РАСПАХНУТЫЕ ПЕРЕПОНЧАТЫЕ КРЫЛЬЯ ДРЕВНЕГО ДРАКОНА (Задний план справа и сверху)
        // Дальнее левое крыло (выглядывает сверху из-за гребня)
        ctx.fillStyle = '#5c1414';
        ctx.beginPath();
        ctx.moveTo(62, 46);
        ctx.lineTo(48, 10);
        ctx.quadraticCurveTo(64, 18, 76, 12);
        ctx.quadraticCurveTo(84, 22, 94, 20);
        ctx.lineTo(80, 52);
        ctx.closePath();
        ctx.fill();

        // Костяной луч и коготь дальнего крыла
        ctx.strokeStyle = '#2b0909';
        ctx.lineWidth = 2.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(62, 46);
        ctx.lineTo(48, 10);
        ctx.moveTo(48, 10);
        ctx.lineTo(44, 6);
        ctx.stroke();

        // Ближнее правое крыло (широко раскрыто в правую сторону)
        ctx.fillStyle = '#7a1c1c';
        ctx.beginPath();
        ctx.moveTo(80, 72);
        ctx.lineTo(108, 18); // Верхний сгиб крыла
        ctx.quadraticCurveTo(116, 38, 125, 42);
        ctx.quadraticCurveTo(116, 56, 124, 68);
        ctx.quadraticCurveTo(112, 78, 118, 94);
        ctx.quadraticCurveTo(102, 94, 92, 104);
        ctx.closePath();
        ctx.fill();

        // Огненно-оранжевый отблеск на перепонке крыла
        ctx.fillStyle = '#a82828';
        ctx.beginPath();
        ctx.moveTo(84, 72);
        ctx.lineTo(108, 26);
        ctx.lineTo(116, 54);
        ctx.lineTo(94, 86);
        ctx.closePath();
        ctx.fill();

        // Костяные лучи-пальцы правого крыла
        ctx.strokeStyle = '#2b0909';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(80, 72);
        ctx.lineTo(108, 18); // Главная крыльевая кость
        ctx.moveTo(108, 18);
        ctx.lineTo(124, 42); // Верхний луч
        ctx.moveTo(100, 36);
        ctx.lineTo(123, 68); // Средний луч
        ctx.moveTo(92, 52);
        ctx.lineTo(117, 93); // Нижний луч
        ctx.stroke();

        // Острый костяной коготь на сгибе крыла
        ctx.fillStyle = '#f5eedc';
        ctx.beginPath();
        ctx.moveTo(106, 18);
        ctx.lineTo(106, 9);
        ctx.lineTo(111, 17);
        ctx.closePath();
        ctx.fill();

        // 2. КОРОНА ИЗ ДРЕВНИХ РОГОВ И СПИННЫЕ ШИПЫ (Задний план головы)
        ctx.fillStyle = '#29221e';
        // Верхний массивный загнутый рог
        ctx.beginPath();
        ctx.moveTo(66, 40);
        ctx.bezierCurveTo(78, 16, 98, 12, 106, 22);
        ctx.bezierCurveTo(94, 20, 84, 28, 76, 46);
        ctx.closePath();
        ctx.fill();

        // Нижний скуловой рог
        ctx.fillStyle = '#1f1916';
        ctx.beginPath();
        ctx.moveTo(76, 52);
        ctx.quadraticCurveTo(96, 44, 108, 38);
        ctx.lineTo(82, 62);
        ctx.closePath();
        ctx.fill();

        // Ребристые насечки на главном роге
        ctx.strokeStyle = '#5c4f46';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(77, 32); ctx.lineTo(81, 37);
        ctx.moveTo(85, 25); ctx.lineTo(89, 30);
        ctx.moveTo(93, 19); ctx.lineTo(96, 24);
        ctx.stroke();

        // 3. МОЩНАЯ БРОНИРОВАННАЯ ШЕЯ И ЗОЛОТИСТЫЕ ГРУДНЫЕ ПЛАСТИНЫ
        ctx.fillStyle = '#6e1414';
        ctx.beginPath();
        ctx.moveTo(56, 74);
        ctx.quadraticCurveTo(88, 78, 102, 128);
        ctx.lineTo(30, 128);
        ctx.quadraticCurveTo(40, 98, 48, 84);
        ctx.closePath();
        ctx.fill();

        // Ребристые охристо-золотые пластины на груди и горле
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.moveTo(44, 88);
        ctx.quadraticCurveTo(36, 108, 34, 128);
        ctx.lineTo(66, 128);
        ctx.quadraticCurveTo(62, 106, 58, 88);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(41, 100); ctx.quadraticCurveTo(50, 103, 60, 100);
        ctx.moveTo(38, 112); ctx.quadraticCurveTo(50, 115, 63, 112);
        ctx.moveTo(36, 123); ctx.quadraticCurveTo(50, 126, 65, 123);
        ctx.stroke();

        // 4. ВЕРХНЯЯ ЧЕЛЮСТЬ И ЧЕРЕП ДРЕВНЕГО ДРАКОНА В ПРОФИЛЬ ВЛЕВО
        ctx.fillStyle = '#991b1b';
        ctx.beginPath();
        ctx.moveTo(82, 48); // Затылок
        ctx.lineTo(60, 34); // Надбровный гребень
        ctx.lineTo(10, 50); // Мощная морда влево
        ctx.lineTo(14, 62); // Верхняя губа
        ctx.lineTo(54, 70); // Угол пасти
        ctx.lineTo(80, 72); // Скула
        ctx.closePath();
        ctx.fill();

        // Огненно-алые щитки вдоль спинки носа и носовой рог
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.moveTo(16, 51);
        ctx.lineTo(48, 42);
        ctx.lineTo(44, 47);
        ctx.lineTo(18, 55);
        ctx.closePath();
        ctx.fill();

        // Костяной рог на кончике носа
        ctx.fillStyle = '#e8e0cf';
        ctx.beginPath();
        ctx.moveTo(14, 50);
        ctx.lineTo(8, 41);
        ctx.lineTo(20, 48);
        ctx.closePath();
        ctx.fill();

        // 5. РАСПАХНУТАЯ ПАСТЬ, ВЫРЫВАЮЩЕЕСЯ ПЛАМЯ И НИЖНЯЯ ЧЕЛЮСТЬ
        // Раскалённая глотка дракона
        ctx.fillStyle = '#450a0a';
        ctx.beginPath();
        ctx.moveTo(14, 61);
        ctx.lineTo(58, 70);
        ctx.lineTo(22, 88);
        ctx.lineTo(18, 81);
        ctx.lineTo(42, 71);
        ctx.closePath();
        ctx.fill();

        // Язык пламени, вырывающийся из глубины пасти
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(46, 71);
        ctx.quadraticCurveTo(28, 71, 8, 73);
        ctx.quadraticCurveTo(24, 78, 48, 76);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.moveTo(44, 72);
        ctx.quadraticCurveTo(30, 72, 16, 73);
        ctx.quadraticCurveTo(28, 76, 45, 74);
        ctx.closePath();
        ctx.fill();

        // Нижняя челюсть
        ctx.fillStyle = '#7f1d1d';
        ctx.beginPath();
        ctx.moveTo(54, 69);
        ctx.lineTo(18, 82);
        ctx.lineTo(24, 91);
        ctx.lineTo(62, 88);
        ctx.lineTo(80, 72);
        ctx.closePath();
        ctx.fill();

        // 6. ОСТРЫЕ БЕЛЫЕ КЛЫКИ В ПАСТИ
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.moveTo(16, 61); ctx.lineTo(19, 69); ctx.lineTo(22, 62); ctx.fill();
        ctx.beginPath(); ctx.moveTo(25, 63); ctx.lineTo(28, 70); ctx.lineTo(31, 64); ctx.fill();
        ctx.beginPath(); ctx.moveTo(34, 65); ctx.lineTo(37, 71); ctx.lineTo(40, 66); ctx.fill();
        ctx.beginPath(); ctx.moveTo(43, 67); ctx.lineTo(46, 72); ctx.lineTo(49, 68); ctx.fill();

        ctx.beginPath(); ctx.moveTo(20, 82); ctx.lineTo(23, 75); ctx.lineTo(26, 80); ctx.fill();
        ctx.beginPath(); ctx.moveTo(29, 79); ctx.lineTo(32, 73); ctx.lineTo(35, 77); ctx.fill();
        ctx.beginPath(); ctx.moveTo(38, 76); ctx.lineTo(41, 71); ctx.lineTo(44, 74); ctx.fill();

        // 7. ПЫЛАЮЩИЙ ЗОЛОТОЙ ГЛАЗ ДРЕВНЕГО ДРАКОНА
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.moveTo(48, 49);
        ctx.lineTo(62, 44);
        ctx.lineTo(57, 54);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(54, 46, 1.5, 6);

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(53, 48, 1, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#450a0a';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(45, 46);
        ctx.lineTo(63, 42);
        ctx.stroke();

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень вдоль нижней челюсти и шеи)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(18, 82);
        ctx.lineTo(62, 88);
        ctx.lineTo(80, 72);
        ctx.lineTo(102, 128);
        ctx.lineTo(30, 128);
        ctx.lineTo(48, 86);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    troll() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. СПУТАННАЯ ГРИВА ИЗ ВОЛОС И БОЛОТНОЙ ТИНЫ НА ЗАДНЕМ ПЛАНЕ
        ctx.fillStyle = '#182419';
        ctx.beginPath();
        ctx.moveTo(32, 46);
        ctx.quadraticCurveTo(18, 86, 20, 128);
        ctx.lineTo(108, 128);
        ctx.quadraticCurveTo(110, 86, 96, 46);
        ctx.closePath();
        ctx.fill();

        // Взъерошенные космы на макушке с пучками болотного мха
        ctx.fillStyle = '#223324';
        ctx.beginPath();
        ctx.moveTo(42, 36); ctx.lineTo(34, 16); ctx.lineTo(52, 28);
        ctx.lineTo(62, 12); ctx.lineTo(70, 28); ctx.lineTo(84, 14);
        ctx.lineTo(82, 34); ctx.lineTo(96, 26); ctx.lineTo(88, 44);
        ctx.closePath();
        ctx.fill();

        // 2. ЖИЛИСТЫЕ ПЛЕЧИ ТРОЛЛЯ И ОЖЕРЕЛЬЕ ИЗ КОСТЕЙ
        ctx.fillStyle = '#2e4d32';
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.quadraticCurveTo(28, 92, 64, 92);
        ctx.quadraticCurveTo(100, 92, 114, 128);
        ctx.closePath();
        ctx.fill();

        // Грубый кожаный ремень и костяные клыки на груди
        ctx.strokeStyle = '#3b2416';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(34, 102);
        ctx.quadraticCurveTo(64, 118, 94, 102);
        ctx.stroke();

        ctx.fillStyle = '#e8e0cf';
        ctx.beginPath(); ctx.moveTo(46, 107); ctx.lineTo(49, 120); ctx.lineTo(53, 109); ctx.fill();
        ctx.beginPath(); ctx.moveTo(61, 111); ctx.lineTo(64, 125); ctx.lineTo(67, 111); ctx.fill();
        ctx.beginPath(); ctx.moveTo(82, 107); ctx.lineTo(79, 120); ctx.lineTo(75, 109); ctx.fill();

        // 3. ДЛИННЫЕ ЗАОСТРЁННЫЕ УШИ ТРОЛЛЯ С ЗАЗУБРИНАМИ
        ctx.fillStyle = '#385e3d';
        ctx.beginPath();
        ctx.moveTo(41, 56);
        ctx.lineTo(8, 44);
        ctx.lineTo(16, 56);
        ctx.lineTo(11, 61);
        ctx.lineTo(41, 74);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(87, 56);
        ctx.lineTo(120, 44);
        ctx.lineTo(87, 74);
        ctx.closePath();
        ctx.fill();

        // 4. ВЫТЯНУТАЯ КОСТЛЯВАЯ ГОЛОВА И МАССИВНАЯ ЧЕЛЮСТЬ
        ctx.fillStyle = '#437049';
        ctx.beginPath();
        ctx.moveTo(42, 42);
        ctx.quadraticCurveTo(64, 28, 86, 42);
        ctx.lineTo(92, 72);
        ctx.lineTo(82, 98);
        ctx.lineTo(64, 108);
        ctx.lineTo(46, 98);
        ctx.lineTo(36, 72);
        ctx.closePath();
        ctx.fill();

        // Световая рельефная зона на скулах и подбородке
        ctx.fillStyle = '#558a5c';
        ctx.beginPath();
        ctx.moveTo(47, 64);
        ctx.lineTo(81, 64);
        ctx.lineTo(78, 94);
        ctx.lineTo(64, 104);
        ctx.lineTo(50, 94);
        ctx.closePath();
        ctx.fill();

        // Кожные наросты-бородавки и шрамы регенерации на щеке
        ctx.fillStyle = '#29472d';
        ctx.beginPath(); ctx.arc(44, 72, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(84, 76, 3, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#75a87c';
        ctx.lineWidth = 1.3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(74, 66); ctx.lineTo(82, 74);
        ctx.stroke();

        // 5. ГЛУБОКО ПОСАЖЕННЫЕ СВИРЕПЫЕ ГЛАЗА И ТЯЖЁЛЫЙ НАДБРОВНЫЙ ВАЛИК
        ctx.fillStyle = '#233b26';
        ctx.beginPath();
        ctx.moveTo(40, 49);
        ctx.quadraticCurveTo(64, 55, 88, 49);
        ctx.lineTo(86, 56);
        ctx.quadraticCurveTo(64, 60, 42, 56);
        ctx.closePath();
        ctx.fill();

        // Налитые кровью янтарно-алые глаза
        ctx.fillStyle = '#facc15';
        ctx.beginPath(); ctx.ellipse(51, 58, 5, 2.6, 0.14, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(77, 58, 5, 2.6, -0.14, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#dc2626';
        ctx.beginPath(); ctx.arc(51.5, 58, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76.5, 58, 1.8, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(51.5, 58, 0.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76.5, 58, 0.9, 0, Math.PI * 2); ctx.fill();

        // 6. ОСКАЛЕННАЯ ПАСТЬ С КРИВЫМИ КЛЫКАМИ И ДЛИННЫЙ НОС ТРОЛЛЯ
        // Тёмная глубина пасти
        ctx.fillStyle = '#1f0b0e';
        ctx.beginPath();
        ctx.moveTo(46, 82);
        ctx.quadraticCurveTo(64, 76, 82, 82);
        ctx.lineTo(78, 96);
        ctx.quadraticCurveTo(64, 102, 50, 96);
        ctx.closePath();
        ctx.fill();

        // Частокол кривых острых клыков сверху и снизу
        ctx.fillStyle = '#fef9c3';
        ctx.strokeStyle = '#233b26';
        ctx.lineWidth = 0.9;
        // Верхние зубы
        ctx.beginPath(); ctx.moveTo(49, 82); ctx.lineTo(52, 91); ctx.lineTo(55, 81); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(58, 80); ctx.lineTo(60, 87); ctx.lineTo(62, 80); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(66, 80); ctx.lineTo(68, 87); ctx.lineTo(70, 80); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(79, 82); ctx.lineTo(76, 91); ctx.lineTo(73, 81); ctx.closePath(); ctx.fill(); ctx.stroke();

        // Нижние крупные клыки
        ctx.beginPath(); ctx.moveTo(51, 96); ctx.lineTo(54, 86); ctx.lineTo(57, 96); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(61, 98); ctx.lineTo(64, 90); ctx.lineTo(67, 98); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(77, 96); ctx.lineTo(74, 86); ctx.lineTo(71, 96); ctx.closePath(); ctx.fill(); ctx.stroke();

        // Длинный висячий нос тролля (свисает по центру поверх верхней губы)
        ctx.fillStyle = '#385e3d';
        ctx.strokeStyle = '#1f3622';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(60, 56);
        ctx.lineTo(68, 56);
        ctx.lineTo(71, 79);
        ctx.quadraticCurveTo(64, 86, 57, 79);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Ноздри на кончике длинного носа
        ctx.fillStyle = '#142416';
        ctx.beginPath(); ctx.arc(61, 79, 1.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(67, 79, 1.6, 0, Math.PI * 2); ctx.fill();

        // 7. КОГТИСТАЯ ЛАПА ТРОЛЛЯ НА ПЕРЕДНЕМ ПЛАНЕ (Слева снизу)
        ctx.fillStyle = '#437049';
        ctx.strokeStyle = '#1f3622';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.lineTo(18, 106);
        ctx.lineTo(38, 108);
        ctx.lineTo(36, 128);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Острые тёмно-костяные когти на пальцах
        ctx.fillStyle = '#1c1917';
        [19, 25, 31, 36].forEach((cx, idx) => {
            const topY = 95 - (idx === 1 || idx === 2 ? 3 : 0);
            ctx.beginPath();
            ctx.moveTo(cx - 2, 107);
            ctx.lineTo(cx, topY);
            ctx.lineTo(cx + 2, 107);
            ctx.closePath();
            ctx.fill();
        });

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 12);
        ctx.lineTo(42, 36);
        ctx.lineTo(36, 72);
        ctx.lineTo(46, 98);
        ctx.lineTo(64, 108);
        ctx.lineTo(64, 128);
        ctx.lineTo(14, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    frost_giant() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. МАССИВНАЯ СКАНДИНАВСКАЯ СЕКИРА С ЛЕДЯНЫМИ РУНАМИ ЗА ПРАВЫМ ПЛЕЧОМ
        ctx.save();
        ctx.translate(102, 48);
        ctx.rotate((Math.PI / 180) * 24);

        // Толстое древко из мореного дуба с железной обмоткой
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, -14);
        ctx.lineTo(0, 90);
        ctx.stroke();

        // Широкое бородатое скандинавское лезвие топора
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(2, -16);
        ctx.quadraticCurveTo(26, -24, 28, 6);
        ctx.quadraticCurveTo(16, 16, 10, 4);
        ctx.lineTo(2, 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Светлая ледяная заточенная кромка и светящаяся руна на обухе
        ctx.fillStyle = '#e0f2fe';
        ctx.beginPath();
        ctx.moveTo(24, -14);
        ctx.quadraticCurveTo(28, 6, 14, 12);
        ctx.lineTo(12, 8);
        ctx.quadraticCurveTo(23, 3, 21, -12);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(11, -5, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // 2. ДЛИННЫЕ ЗАИНДЕВЕЛЫЕ ВОЛОСЫ И ШКУРА ПОЛЯРНОГО ВОЛКА НА ПЛЕЧАХ
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(32, 48);
        ctx.quadraticCurveTo(20, 88, 20, 128);
        ctx.lineTo(108, 128);
        ctx.quadraticCurveTo(108, 88, 96, 48);
        ctx.closePath();
        ctx.fill();

        // Тяжёлый мех белого полярного волка на плечах
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(10, 128);
        ctx.quadraticCurveTo(26, 90, 64, 90);
        ctx.quadraticCurveTo(102, 90, 118, 128);
        ctx.closePath();
        ctx.fill();

        // Теневые клочья меха и кожаная перевязь с рунной пряжкой
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(22, 102); ctx.lineTo(14, 114); ctx.lineTo(30, 112);
        ctx.moveTo(106, 102); ctx.lineTo(114, 114); ctx.lineTo(98, 112);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(34, 96);
        ctx.lineTo(66, 128);
        ctx.lineTo(84, 128);
        ctx.lineTo(48, 94);
        ctx.closePath();
        ctx.fill();

        // Круглая скандинавская фибула-пряжка со светящейся руной
        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(54, 112, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 3. МОРОЗНАЯ СИНЯЯ КОЖА ЛИЦА И СКАНДИНАВСКИЕ ТАТУИРОВКИ
        ctx.fillStyle = '#5b8fb9';
        ctx.beginPath();
        ctx.moveTo(42, 48);
        ctx.quadraticCurveTo(64, 34, 86, 48);
        ctx.lineTo(86, 82);
        ctx.lineTo(64, 100);
        ctx.lineTo(42, 82);
        ctx.closePath();
        ctx.fill();

        // Ледяной отблеск на скулах и племенные рунические узоры
        ctx.fillStyle = '#7bb0db';
        ctx.beginPath();
        ctx.moveTo(45, 64);
        ctx.lineTo(83, 64);
        ctx.lineTo(80, 84);
        ctx.lineTo(64, 96);
        ctx.lineTo(48, 84);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#1e3a8a';
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(46, 68); ctx.lineTo(54, 72); ctx.lineTo(48, 76);
        ctx.moveTo(82, 68); ctx.lineTo(74, 72); ctx.lineTo(80, 76);
        ctx.stroke();

        // 4. ПЫШНАЯ ЗАИНДЕВЕЛАЯ БОРОДА С КОСАМИ И РУННЫМИ ЗАЖИМАМИ
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(42, 74);
        ctx.lineTo(32, 104);
        ctx.lineTo(44, 128);
        ctx.lineTo(84, 128);
        ctx.lineTo(96, 104);
        ctx.lineTo(86, 74);
        ctx.quadraticCurveTo(64, 86, 42, 74);
        ctx.closePath();
        ctx.fill();

        // Теневые линии прядей и ледяные сосульки в бороде
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(52, 88); ctx.lineTo(48, 126);
        ctx.moveTo(64, 90); ctx.lineTo(64, 128);
        ctx.moveTo(76, 88); ctx.lineTo(80, 126);
        ctx.stroke();

        // Суровые опущенные белые усы
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(47, 78);
        ctx.quadraticCurveTo(64, 72, 81, 78);
        ctx.lineTo(84, 88);
        ctx.quadraticCurveTo(64, 81, 44, 88);
        ctx.closePath();
        ctx.fill();

        // Стальные рунические зажимы на косах бороды
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.1;
        ctx.fillRect(45, 117, 9, 5); ctx.strokeRect(45, 117, 9, 5);
        ctx.fillRect(74, 117, 9, 5); ctx.strokeRect(74, 117, 9, 5);

        // 5. СВЕТЯЩИЕСЯ ЛЕДЯНЫЕ ГЛАЗА И СУРОВЫЕ БРОВИ
        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.ellipse(52, 61, 5.2, 2.4, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(76, 61, 5.2, 2.4, 0, 0, Math.PI * 2); ctx.fill();

        // Ярко-голубое свечение глаз йотуна
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(52, 61, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 61, 2.2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(52.8, 60.2, 0.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76.8, 60.2, 0.8, 0, Math.PI * 2); ctx.fill();

        // Густые заиндевелые брови
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(44, 54); ctx.lineTo(60, 58); ctx.lineTo(59, 61); ctx.lineTo(44, 58);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(84, 54); ctx.lineTo(68, 58); ctx.lineTo(69, 61); ctx.lineTo(84, 58);
        ctx.closePath();
        ctx.fill();

        // Массивный обветренный нос
        ctx.fillStyle = '#4778a1';
        ctx.beginPath();
        ctx.moveTo(61, 58);
        ctx.lineTo(67, 58);
        ctx.lineTo(69, 73);
        ctx.lineTo(64, 76);
        ctx.lineTo(59, 73);
        ctx.closePath();
        ctx.fill();

        // 6. КОВАНЫЙ СКАНДИНАВСКИЙ ШЛЕМ-ВЕНДЕЛЬ С РОГАМИ И НАНОСНИКОМ
        // Мощные изогнутые рога с железными ободами
        ctx.fillStyle = '#e8e0cf';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.2;
        // Левый рог
        ctx.beginPath();
        ctx.moveTo(41, 44);
        ctx.bezierCurveTo(22, 42, 16, 26, 22, 12);
        ctx.bezierCurveTo(24, 24, 30, 34, 42, 36);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Правый рог
        ctx.beginPath();
        ctx.moveTo(87, 44);
        ctx.bezierCurveTo(106, 42, 112, 26, 106, 12);
        ctx.bezierCurveTo(104, 24, 98, 34, 86, 36);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Купол скандинавского шлема
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(39, 52);
        ctx.quadraticCurveTo(44, 20, 64, 18);
        ctx.quadraticCurveTo(84, 20, 89, 52);
        ctx.lineTo(85, 55);
        ctx.lineTo(64, 50);
        ctx.lineTo(43, 55);
        ctx.closePath();
        ctx.fill();

        // Стальная пластина-обод с наносником и заклёпками
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.moveTo(40, 47);
        ctx.lineTo(64, 43);
        ctx.lineTo(88, 47);
        ctx.lineTo(87, 53);
        ctx.lineTo(64, 49);
        ctx.lineTo(41, 53);
        ctx.closePath();
        ctx.fill();

        // Кованый наносник
        ctx.fillRect(62, 48, 4, 16);

        // Заклёпки на ободе шлема
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath(); ctx.arc(46, 49, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(55, 47, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(73, 47, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(82, 49, 1.3, 0, Math.PI * 2); ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 18);
        ctx.quadraticCurveTo(44, 20, 39, 52);
        ctx.lineTo(42, 82);
        ctx.lineTo(32, 104);
        ctx.lineTo(44, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    orc_warrior() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. МАССИВНАЯ ДВУРУЧНАЯ СЕКИРА ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.save();
        ctx.translate(98, 44);
        ctx.rotate((Math.PI / 180) * 26);

        // Деревянное толстое древко с обмоткой
        ctx.strokeStyle = '#4a311d';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, -14);
        ctx.lineTo(0, 92);
        ctx.stroke();

        // Острое стальное навершие-пика топора
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.moveTo(-4, -14);
        ctx.lineTo(0, -25);
        ctx.lineTo(4, -14);
        ctx.closePath();
        ctx.fill();

        // Тяжёлые кованые лезвия двусторонней секиры
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.5;

        // Левое лезвие
        ctx.beginPath();
        ctx.moveTo(-3, -12);
        ctx.quadraticCurveTo(-24, -18, -26, 2);
        ctx.quadraticCurveTo(-14, 10, -3, 4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Правое лезвие
        ctx.beginPath();
        ctx.moveTo(3, -12);
        ctx.quadraticCurveTo(24, -18, 26, 2);
        ctx.quadraticCurveTo(14, 10, 3, 4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Светлая заточенная кромка лезвий
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(-24, -10);
        ctx.quadraticCurveTo(-26, 2, -16, 6);
        ctx.lineTo(-14, 3);
        ctx.quadraticCurveTo(-22, 0, -21, -9);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(24, -10);
        ctx.quadraticCurveTo(26, 2, 16, 6);
        ctx.lineTo(14, 3);
        ctx.quadraticCurveTo(22, 0, 21, -9);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 2. МОЩНАЯ ШЕЯ, КОВАНЫЕ НАПЛЕЧНИКИ С ШИПАМИ И КОЖАНАЯ ПЕРЕВЯЗЬ
        ctx.fillStyle = '#1e3d24';
        ctx.beginPath();
        ctx.moveTo(44, 88);
        ctx.lineTo(28, 128);
        ctx.lineTo(100, 128);
        ctx.lineTo(84, 88);
        ctx.closePath();
        ctx.fill();

        // Грубый железный нагрудник и наплечники
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.lineTo(32, 96);
        ctx.lineTo(96, 96);
        ctx.lineTo(114, 128);
        ctx.closePath();
        ctx.fill();

        // Шипы на стальных наплечниках
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath(); ctx.moveTo(26, 102); ctx.lineTo(12, 86); ctx.lineTo(34, 96); ctx.fill();
        ctx.beginPath(); ctx.moveTo(102, 102); ctx.lineTo(116, 86); ctx.lineTo(94, 96); ctx.fill();

        // Толстый кожаный ремень-портупея через грудь с железной пряжкой
        ctx.fillStyle = '#3b2416';
        ctx.beginPath();
        ctx.moveTo(34, 98);
        ctx.lineTo(62, 128);
        ctx.lineTo(78, 128);
        ctx.lineTo(48, 96);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.strokeRect(47, 109, 9, 8);

        // 3. ЗАОСТРЁННЫЕ УШИ ОРКА С СЕРЬГОЙ
        ctx.fillStyle = '#254a2c';
        ctx.beginPath(); ctx.moveTo(40, 58); ctx.lineTo(16, 48); ctx.lineTo(39, 72); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(88, 58); ctx.lineTo(112, 48); ctx.lineTo(89, 72); ctx.closePath(); ctx.fill();

        // Железное кольцо в левом ухе
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(21, 56, 3.5, 0, Math.PI * 2);
        ctx.stroke();

        // 4. СУРОВОЕ ЛИЦО ОРКА С РУБЛЕНЫМИ СКУЛАМИ И ТЯЖЁЛОЙ ЧЕЛЮСТЬЮ
        ctx.fillStyle = '#2e5e38';
        ctx.beginPath();
        ctx.moveTo(41, 50);
        ctx.lineTo(64, 34);
        ctx.lineTo(87, 50);
        ctx.lineTo(88, 82);
        ctx.lineTo(74, 102);
        ctx.lineTo(54, 102);
        ctx.lineTo(40, 82);
        ctx.closePath();
        ctx.fill();

        // Световая зона на скулах и подбородке
        ctx.fillStyle = '#3b7547';
        ctx.beginPath();
        ctx.moveTo(46, 66);
        ctx.lineTo(82, 66);
        ctx.lineTo(79, 92);
        ctx.lineTo(64, 100);
        ctx.lineTo(49, 92);
        ctx.closePath();
        ctx.fill();

        // Боевой шрам через левую щеку
        ctx.strokeStyle = '#8f2d2d';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(45, 68);
        ctx.lineTo(53, 82);
        ctx.stroke();

        // 5. ЯРОСТНЫЙ ВЗГЛЯД, ПРИПЛЮСНУТЫЙ НОС И КРУПНЫЕ КЛЫКИ
        // Глубокие глазницы и багровый прищур
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(53, 62, 4.8, 1.8, 0.14, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 62, 4.8, 1.8, -0.14, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#dc2626';
        ctx.beginPath(); ctx.arc(54, 62, 1.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 62, 1.6, 0, Math.PI * 2); ctx.fill();

        // Нависшие надбровные дуги
        ctx.strokeStyle = '#142b19';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(44, 55); ctx.lineTo(59, 60);
        ctx.moveTo(84, 55); ctx.lineTo(69, 60);
        ctx.stroke();

        // Приплюснутый нос с широкими ноздрями
        ctx.fillStyle = '#1e3d24';
        ctx.beginPath();
        ctx.moveTo(64, 61);
        ctx.lineTo(71, 74);
        ctx.lineTo(57, 74);
        ctx.closePath();
        ctx.fill();

        // Свирепый оскал и мощные нижние клыки
        ctx.strokeStyle = '#142b19';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(47, 86);
        ctx.quadraticCurveTo(64, 81, 81, 86);
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#142b19';
        ctx.lineWidth = 1.1;
        // Левый клык
        ctx.beginPath(); ctx.moveTo(46, 87); ctx.lineTo(43, 71); ctx.lineTo(52, 86); ctx.closePath(); ctx.fill(); ctx.stroke();
        // Правый клык
        ctx.beginPath(); ctx.moveTo(82, 87); ctx.lineTo(85, 71); ctx.lineTo(76, 86); ctx.closePath(); ctx.fill(); ctx.stroke();

        // 6. КОВАНЫЙ ОТКРЫТЫЙ ШЛЕМ С ЗАКЛЁПКАМИ, НАНОСНИКОМ И ОБЛОМАННЫМ РОГОМ
        // Правый целый рог и левый сколотый рог на шлеме
        ctx.fillStyle = '#e2e8f0';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        // Левый сколотый рог
        ctx.beginPath(); ctx.moveTo(41, 46); ctx.lineTo(29, 36); ctx.lineTo(35, 34); ctx.lineTo(39, 48); ctx.closePath(); ctx.fill(); ctx.stroke();
        // Правый целый рог
        ctx.beginPath(); ctx.moveTo(87, 46); ctx.quadraticCurveTo(100, 36, 105, 24); ctx.lineTo(89, 48); ctx.closePath(); ctx.fill(); ctx.stroke();

        // Купол шлема
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(39, 52);
        ctx.quadraticCurveTo(44, 24, 64, 22);
        ctx.quadraticCurveTo(84, 24, 89, 52);
        ctx.lineTo(85, 56);
        ctx.lineTo(64, 51);
        ctx.lineTo(43, 56);
        ctx.closePath();
        ctx.fill();

        // Стальная пластина-обод с заклёпками и наносником
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.moveTo(40, 48);
        ctx.lineTo(64, 44);
        ctx.lineTo(88, 48);
        ctx.lineTo(87, 54);
        ctx.lineTo(64, 50);
        ctx.lineTo(41, 54);
        ctx.closePath();
        ctx.fill();

        // Стальной наносник
        ctx.fillRect(62, 49, 4, 17);

        // Заклёпки на ободе шлема
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath(); ctx.arc(46, 50, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(55, 48, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(73, 48, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(82, 50, 1.3, 0, Math.PI * 2); ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 22);
        ctx.quadraticCurveTo(44, 24, 39, 52);
        ctx.lineTo(40, 82);
        ctx.lineTo(54, 102);
        ctx.lineTo(64, 102);
        ctx.lineTo(64, 128);
        ctx.lineTo(14, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    violet_mushroom() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ОБЛАКО РАСПЫЛЯЕМОГО ГАЗА И СПОР ИЗ ГОРЛЫШКА (Задний и верхний слой)
        ctx.fillStyle = 'rgba(165, 94, 234, 0.35)'; // Фиолетовый туман
        ctx.beginPath(); ctx.arc(64, 22, 18, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(46, 16, 13, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(82, 16, 13, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = 'rgba(0, 242, 254, 0.3)'; // Неоново-бирюзовый газ
        ctx.beginPath(); ctx.arc(64, 15, 11, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(36, 22, 8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(92, 22, 8, 0, Math.PI * 2); ctx.fill();

        // 2. КОРЕШКИ-МИЦЕЛИЙ В САМОМ НИЗУ
        ctx.fillStyle = '#2c163d';
        ctx.beginPath();
        ctx.moveTo(42, 114);
        ctx.lineTo(30, 128);
        ctx.lineTo(50, 124);
        ctx.lineTo(64, 128);
        ctx.lineTo(78, 124);
        ctx.lineTo(98, 128);
        ctx.lineTo(86, 114);
        ctx.closePath();
        ctx.fill();

        // 3. ТЕЛО ГРИБА В ВИДЕ КОЛБЫ (Широкое брюшко + узкое горлышко сверху)
        ctx.fillStyle = '#6c3483'; // Основной глубокий фиолетовый цвет
        ctx.beginPath();
        ctx.moveTo(54, 36); // Левый край горлышка
        ctx.lineTo(74, 36); // Правый край горлышка
        ctx.lineTo(76, 54); // Переход горлышка в плечи
        ctx.bezierCurveTo(104, 62, 108, 106, 86, 118); // Правый округлый бок колбы
        ctx.lineTo(42, 118); // Плоское устойчивое дно
        ctx.bezierCurveTo(20, 106, 24, 62, 52, 54); // Левый округлый бок колбы
        ctx.closePath();
        ctx.fill();

        // Рельефные ребра и световой объем на правой стороне колбы
        ctx.fillStyle = '#8e44ad';
        ctx.beginPath();
        ctx.moveTo(64, 36);
        ctx.lineTo(74, 36);
        ctx.lineTo(76, 54);
        ctx.bezierCurveTo(104, 62, 108, 106, 86, 118);
        ctx.lineTo(64, 118);
        ctx.closePath();
        ctx.fill();

        // 4. ОТВЕРСТИЕ-СОПЛО ГОРЛЫШКА СВЕРХУ (Откуда бьет газ)
        ctx.fillStyle = '#1b0a26'; // Темное жерло
        ctx.beginPath();
        ctx.ellipse(64, 36, 11, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#d2b4de'; // Утолщенный ободок горлышка
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(64, 36, 11, 4, 0, 0, Math.PI * 2);
        ctx.stroke();

        // 5. СВЕТЯЩИЕСЯ СПОРОВЫЕ ПУЗЫРИ НА ТЕЛЕ КОЛБЫ (Без глаз и зубов)
        ctx.fillStyle = '#00f2fe';
        ctx.beginPath(); ctx.arc(46, 84, 5.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(82, 88, 6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(64, 72, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(54, 102, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 66, 3, 0, Math.PI * 2); ctx.fill();

        // Белые блики внутри биолюминесцентных пятен
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(45, 82, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(81, 86, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(63, 71, 1.3, 0, Math.PI * 2); ctx.fill();

        // 6. ЯРКИЕ ИСКРЫ-СПОРЫ, ВЫЛЕТАЮЩИЕ СТРУЕЙ ВВЕРХ ИЗ ГОРЛЫШКА
        ctx.fillStyle = '#00f2fe';
        ctx.beginPath(); ctx.arc(64, 26, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(56, 18, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(73, 19, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(62, 10, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(42, 14, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(86, 12, 1.6, 0, Math.PI * 2); ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину колбы)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';
        ctx.beginPath();
        ctx.moveTo(64, 36);
        ctx.lineTo(54, 36);
        ctx.lineTo(52, 54);
        ctx.bezierCurveTo(24, 62, 20, 106, 42, 118);
        ctx.lineTo(64, 118);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    faerie_dragon() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАДНИЙ ПЛАН: Полупрозрачные радужные крылья стрекозы / феи
        ctx.fillStyle = 'rgba(0, 242, 254, 0.28)';
        ctx.strokeStyle = '#70e1f5';
        ctx.lineWidth = 1.4;

        // Верхнее левое крыло
        ctx.beginPath();
        ctx.moveTo(46, 72);
        ctx.bezierCurveTo(12, 34, 4, 62, 36, 82);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Нижнее левое крыло
        ctx.beginPath();
        ctx.moveTo(46, 82);
        ctx.bezierCurveTo(16, 80, 14, 102, 42, 96);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Верхнее правое крыло
        ctx.beginPath();
        ctx.moveTo(82, 72);
        ctx.bezierCurveTo(116, 34, 124, 62, 92, 82);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Нижнее правое крыло
        ctx.beginPath();
        ctx.moveTo(82, 82);
        ctx.bezierCurveTo(112, 80, 114, 102, 86, 96);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 2. ИЗЯЩНАЯ ШЕЯ И ЛАЗУРНЫЕ ГРУДНЫЕ ПЛАСТИНЫ
        ctx.fillStyle = '#5b2c6f'; // Глубокая фиолетовая чешуя шеи
        ctx.beginPath();
        ctx.moveTo(50, 86);
        ctx.quadraticCurveTo(44, 108, 42, 128);
        ctx.lineTo(86, 128);
        ctx.quadraticCurveTo(84, 108, 78, 86);
        ctx.closePath();
        ctx.fill();

        // Светло-бирюзовые чешуйки-щитки на груди (как у волшебного дракона в HoMM3)
        ctx.fillStyle = '#48c9b0';
        ctx.beginPath();
        ctx.moveTo(55, 92);
        ctx.lineTo(73, 92);
        ctx.lineTo(76, 128);
        ctx.lineTo(52, 128);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#1b4f72';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(54, 104); ctx.quadraticCurveTo(64, 108, 74, 104);
        ctx.moveTo(53, 116); ctx.quadraticCurveTo(64, 120, 75, 116);
        ctx.stroke();

        // 3. ИЗЯЩНЫЕ ЗАГНУТЫЕ РОЖКИ И ОСТРЫЕ УШКИ-ПЛАВНИКИ
        ctx.fillStyle = '#f7dc6f'; // Золотисто-жемчужные рожки
        ctx.beginPath();
        ctx.moveTo(48, 44);
        ctx.quadraticCurveTo(32, 24, 38, 12);
        ctx.quadraticCurveTo(46, 26, 55, 42);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(80, 44);
        ctx.quadraticCurveTo(96, 24, 90, 12);
        ctx.quadraticCurveTo(82, 26, 73, 42);
        ctx.closePath();
        ctx.fill();

        // Перепончатые ушки-гребни по бокам головы
        ctx.fillStyle = '#a569bd';
        ctx.beginPath(); ctx.moveTo(42, 54); ctx.lineTo(22, 44); ctx.lineTo(40, 68); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(86, 54); ctx.lineTo(106, 44); ctx.lineTo(88, 68); ctx.closePath(); ctx.fill();

        // 4. ГОЛОВА И МОРДОЧКА ДРАКОНЧИКА (Изящная, озорная, пурпурно-лазурная)
        ctx.fillStyle = '#7d3c98'; // Насыщенный пурпурный окрас
        ctx.beginPath();
        ctx.moveTo(46, 44);
        ctx.quadraticCurveTo(64, 32, 82, 44);
        ctx.lineTo(88, 66);
        ctx.lineTo(74, 88);
        ctx.lineTo(64, 94);
        ctx.lineTo(54, 88);
        ctx.lineTo(40, 66);
        ctx.closePath();
        ctx.fill();

        // Бирюзовый лобный гребень и щечки (радужный перелив)
        ctx.fillStyle = '#45b39d';
        ctx.beginPath();
        ctx.moveTo(58, 38);
        ctx.lineTo(64, 26);
        ctx.lineTo(70, 38);
        ctx.lineTo(64, 54);
        ctx.closePath();
        ctx.fill();

        // 5. БОЛЬШИЕ ВЫРАЗИТЕЛЬНЫЕ ГЛАЗА И ОЗОРНАЯ УЛЫБКА С КЛЫЧКАМИ
        ctx.fillStyle = '#f4d03f'; // Сияющая золотая радужка
        ctx.beginPath(); ctx.ellipse(51, 60, 6.5, 4.5, -0.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(77, 60, 6.5, 4.5, 0.2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#111111'; // Вертикальные драконьи зрачки
        ctx.beginPath(); ctx.ellipse(51, 60, 1.8, 4, -0.15, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(77, 60, 1.8, 4, 0.15, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff'; // Крупные живые блики
        ctx.beginPath(); ctx.arc(53, 58, 1.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 58, 1.4, 0, Math.PI * 2); ctx.fill();

        // Ноздри на кончике мордочки
        ctx.fillStyle = '#2e1138';
        ctx.beginPath(); ctx.arc(60, 72, 1.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(68, 72, 1.4, 0, Math.PI * 2); ctx.fill();

        // Хитрая ухмылка и крошечные острые клычки
        ctx.strokeStyle = '#2e1138';
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(49, 77);
        ctx.quadraticCurveTo(64, 86, 79, 77);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.moveTo(53, 79); ctx.lineTo(55, 84); ctx.lineTo(57, 80); ctx.fill(); // Левый клычок
        ctx.beginPath(); ctx.moveTo(75, 79); ctx.lineTo(73, 84); ctx.lineTo(71, 80); ctx.fill(); // Правый клычок

        // 6. ВОЛШЕБНЫЕ ИСКРЫ-ЗВЕЗДОЧКИ ВОКРУГ ДРАКОНЧИКА
        ctx.fillStyle = '#ffd875';
        ctx.beginPath(); ctx.arc(24, 28, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(104, 26, 2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#00f2fe';
        ctx.beginPath(); ctx.arc(16, 62, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(112, 64, 2.2, 0, Math.PI * 2); ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 26);
        ctx.lineTo(46, 44);
        ctx.lineTo(40, 66);
        ctx.lineTo(54, 88);
        ctx.lineTo(64, 94);
        ctx.lineTo(64, 128);
        ctx.lineTo(42, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    zombie() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. РВАНАЯ ОДЕЖДА: Грязные лохмотья на перекошенных плечах
        ctx.fillStyle = '#3e3832';
        ctx.beginPath();
        ctx.moveTo(18, 128);
        ctx.lineTo(36, 100);
        ctx.lineTo(52, 104);
        ctx.lineTo(64, 118);
        ctx.lineTo(78, 102);
        ctx.lineTo(94, 98);
        ctx.lineTo(110, 128);
        ctx.closePath();
        ctx.fill();

        // Рваные зубцы ткани на вороте
        ctx.fillStyle = '#26221e';
        ctx.beginPath();
        ctx.moveTo(46, 102); ctx.lineTo(54, 116); ctx.lineTo(60, 105); ctx.lineTo(68, 120); ctx.lineTo(78, 102);
        ctx.closePath();
        ctx.fill();

        // 2. ХУДАЯ ШЕЯ С ТРУПНЫМИ ПЯТНАМИ И РВАНОЕ УХО
        ctx.fillStyle = '#6b7d64';
        ctx.fillRect(54, 86, 20, 18);

        ctx.fillStyle = '#758a6d'; // Левое ухо
        ctx.beginPath(); ctx.ellipse(41, 66, 4.5, 7.5, -0.15, 0, Math.PI * 2); ctx.fill();
        // Надкусанное правое ухо
        ctx.beginPath(); ctx.moveTo(85, 60); ctx.lineTo(91, 63); ctx.lineTo(87, 68); ctx.lineTo(90, 72); ctx.lineTo(84, 74); ctx.closePath(); ctx.fill();

        // 3. ЧЕРЕП И ВПАЛЫЕ ЩЁКИ МЕРТВЕЦА
        ctx.fillStyle = '#7d9474'; // Трупно-зеленовато-серый оттенок кожи
        ctx.beginPath();
        ctx.moveTo(44, 50);
        ctx.quadraticCurveTo(44, 28, 64, 28);
        ctx.quadraticCurveTo(84, 28, 84, 50);
        ctx.lineTo(86, 68);
        ctx.lineTo(79, 82); // Впалая правая щека
        ctx.lineTo(66, 98);
        ctx.lineTo(49, 82); // Впалая левая щека
        ctx.lineTo(42, 68);
        ctx.closePath();
        ctx.fill();

        // Фиолетовые трупные пятна и синяки на лбу и скуле
        ctx.fillStyle = 'rgba(88, 44, 102, 0.35)';
        ctx.beginPath(); ctx.arc(54, 40, 7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(78, 74, 5.5, 0, Math.PI * 2); ctx.fill();

        // Обнажённая кость черепа на виске (маленькая царапина)
        ctx.fillStyle = '#dcd6c8';
        ctx.beginPath(); ctx.ellipse(76, 42, 4, 2.5, 0.4, 0, Math.PI * 2); ctx.fill();

        // 4. РЕДКИЕ КЛОЧЬЯ СПУТАННЫХ ВОЛОС
        ctx.strokeStyle = '#2c2825';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(48, 34); ctx.quadraticCurveTo(42, 24, 38, 30);
        ctx.moveTo(58, 29); ctx.quadraticCurveTo(56, 18, 51, 21);
        ctx.moveTo(67, 29); ctx.quadraticCurveTo(72, 17, 77, 22);
        ctx.moveTo(78, 34); ctx.quadraticCurveTo(86, 25, 89, 32);
        ctx.stroke();

        // 5. АСИММЕТРИЧНЫЕ ГЛАЗА ЗОМБИ (Один мутный белый, второй тёмный провал)
        // Тёмные круги под глазами
        ctx.fillStyle = 'rgba(42, 26, 48, 0.5)';
        ctx.beginPath(); ctx.arc(53, 62, 7.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 63, 7, 0, Math.PI * 2); ctx.fill();

        // Левый глаз — крупный, вытаращенный, мутно-молочный с крошечным зрачком
        ctx.fillStyle = '#ecf0f1';
        ctx.beginPath(); ctx.arc(53, 62, 5.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#95a5a6';
        ctx.beginPath(); ctx.arc(52, 61, 1.5, 0, Math.PI * 2); ctx.fill();

        // Правый глаз — прищуренный, тёмный с жёлтой точкой
        ctx.fillStyle = '#1e1624';
        ctx.beginPath(); ctx.ellipse(75, 63, 4.5, 2.5, 0.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath(); ctx.arc(75, 63, 1.1, 0, Math.PI * 2); ctx.fill();

        // 6. ПРОВАЛ НОСА И ПЕРЕКОШЕННАЯ ПАСТЬ С КРИВЫМИ ЗУБАМИ
        ctx.fillStyle = '#2d3629'; // Тёмные ноздри
        ctx.beginPath(); ctx.moveTo(64, 67); ctx.lineTo(61, 74); ctx.lineTo(63, 74); ctx.fill();
        ctx.beginPath(); ctx.moveTo(65, 67); ctx.lineTo(68, 74); ctx.lineTo(66, 74); ctx.fill();

        // Раскрытая перекошенная пасть
        ctx.fillStyle = '#1f121b';
        ctx.beginPath();
        ctx.moveTo(50, 82);
        ctx.quadraticCurveTo(64, 79, 78, 84);
        ctx.lineTo(75, 91);
        ctx.quadraticCurveTo(63, 89, 52, 88);
        ctx.closePath();
        ctx.fill();

        // Кривые гнилые зубы
        ctx.fillStyle = '#d4cba8';
        ctx.fillRect(54, 81, 3, 3.5);
        ctx.fillRect(63, 81, 2.5, 3);
        ctx.fillRect(71, 82, 3, 3.5);
        ctx.fillRect(58, 86, 3, 3);
        ctx.fillRect(67, 87, 2.5, 3);

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 28);
        ctx.quadraticCurveTo(44, 28, 44, 50);
        ctx.lineTo(42, 68);
        ctx.lineTo(49, 82);
        ctx.lineTo(66, 98);
        ctx.lineTo(64, 128);
        ctx.lineTo(18, 128);
        ctx.lineTo(36, 100);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },


    skeleton() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. РЖАВЫЙ ЗАЗУБРЕННЫЙ МЕЧ ЗА СПИНОЙ (По диагонали справа налево)
        ctx.save();
        ctx.translate(64, 64);
        ctx.rotate((Math.PI / 180) * 32);
        ctx.translate(-64, -64);

        // Клинок меча с зазубринами
        ctx.fillStyle = '#7f8c8d';
        ctx.beginPath();
        ctx.moveTo(60, 8);
        ctx.lineTo(64, 2);
        ctx.lineTo(68, 8);
        ctx.lineTo(68, 95);
        ctx.lineTo(60, 95);
        ctx.closePath();
        ctx.fill();

        // Светлая грань лезвия
        ctx.fillStyle = '#bdc3c7';
        ctx.fillRect(64, 8, 4, 87);

        // Ржавая гарда
        ctx.fillStyle = '#5d4037';
        ctx.fillRect(50, 95, 28, 5);
        ctx.restore();

        // 2. КОСТЯНОЙ ПОЗВОНОЧНИК, КЛЮЧИЦЫ И РЁБРА (Внизу)
        ctx.fillStyle = '#cfc9b8';
        // Позвонки шеи
        ctx.fillRect(58, 88, 12, 6);
        ctx.fillRect(57, 96, 14, 6);
        ctx.fillRect(56, 104, 16, 24);

        // Ключицы и верхние дуги рёбер
        ctx.strokeStyle = '#e5e0d0';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        // Ключицы
        ctx.moveTo(64, 102); ctx.quadraticCurveTo(44, 98, 28, 110);
        ctx.moveTo(64, 102); ctx.quadraticCurveTo(84, 98, 100, 110);
        // Первая пара рёбер
        ctx.moveTo(64, 112); ctx.quadraticCurveTo(42, 110, 32, 124);
        ctx.moveTo(64, 112); ctx.quadraticCurveTo(86, 110, 96, 124);
        // Вторая пара рёбер
        ctx.moveTo(64, 122); ctx.quadraticCurveTo(46, 121, 40, 128);
        ctx.moveTo(64, 122); ctx.quadraticCurveTo(82, 121, 88, 128);
        ctx.stroke();

        // 3. ЧЕРЕП СКЕЛЕТА (Анатомический купол, скулы и челюсть)
        ctx.fillStyle = '#e8e4d5'; // Старая пожелтевшая кость
        ctx.beginPath();
        ctx.moveTo(42, 54);
        ctx.quadraticCurveTo(41, 24, 64, 24); // Купол черепа
        ctx.quadraticCurveTo(87, 24, 86, 54);
        ctx.lineTo(89, 68); // Правая скула
        ctx.lineTo(79, 77);
        ctx.lineTo(76, 92); // Правый угол нижней челюсти
        ctx.lineTo(52, 92); // Левый угол нижней челюсти
        ctx.lineTo(49, 77);
        ctx.lineTo(39, 68); // Левая скула
        ctx.closePath();
        ctx.fill();

        // Тёмные височные впадины и скуловые тени
        ctx.fillStyle = '#c9c3b0';
        ctx.beginPath(); ctx.ellipse(44, 54, 3.5, 9, 0.15, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(84, 54, 3.5, 9, -0.15, 0, Math.PI * 2); ctx.fill();

        // Трещина на лобной кости
        ctx.strokeStyle = '#5c5649';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(55, 27);
        ctx.lineTo(58, 36);
        ctx.lineTo(54, 42);
        ctx.lineTo(57, 47);
        ctx.stroke();

        // 4. ГЛУБОКИЕ ЧЁРНЫЕ ГЛАЗНИЦЫ И ТЛЕЮЩИЕ ОГОНЬКИ НЕЖИТИ
        ctx.fillStyle = '#141118';
        ctx.beginPath(); ctx.ellipse(52, 60, 7.5, 6.5, -0.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(76, 60, 7.5, 6.5, 0.1, 0, Math.PI * 2); ctx.fill();

        // Зловещие неоново-оранжевые огоньки в центре глазниц
        ctx.fillStyle = '#ff5722';
        ctx.beginPath(); ctx.arc(52, 60, 2.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 60, 2.6, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffd875'; // Яркие ядра искр
        ctx.beginPath(); ctx.arc(52, 60, 1.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 60, 1.1, 0, Math.PI * 2); ctx.fill();

        // 5. ТРЕУГОЛЬНЫЙ НОСОВОЙ ПРОВАЛ И ОСКАЛ ЗУБОВ
        ctx.fillStyle = '#141118';
        ctx.beginPath();
        ctx.moveTo(64, 65);
        ctx.lineTo(68, 74);
        ctx.lineTo(64, 72);
        ctx.lineTo(60, 74);
        ctx.closePath();
        ctx.fill();

        // Тёмная щель приоткрытых челюстей
        ctx.fillStyle = '#24201c';
        ctx.fillRect(52, 81, 24, 6);

        // Костяные зубы (верхний и нижний ряд)
        ctx.fillStyle = '#f5f2e6';
        for (let x = 53; x <= 73; x += 4) {
            ctx.fillRect(x, 79, 3, 4);   // Верхний зуб
            ctx.fillRect(x, 84.5, 3, 4); // Нижний зуб
        }

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину черепа)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 24);
        ctx.quadraticCurveTo(41, 24, 42, 54);
        ctx.lineTo(39, 68);
        ctx.lineTo(49, 77);
        ctx.lineTo(52, 92);
        ctx.lineTo(64, 92);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    boggard() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ПЛЕЧИ И БОЛОТНАЯ ПЕРЕВЯЗЬ ИЗ КОЖИ И КОСТЕЙ
        ctx.fillStyle = '#4a472a'; // Болотно-коричневая кожа плеч
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(34, 92);
        ctx.lineTo(94, 92);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        // Грубый кожаный ремень через плечо
        ctx.fillStyle = '#3b2818';
        ctx.beginPath();
        ctx.moveTo(32, 95);
        ctx.lineTo(54, 128);
        ctx.lineTo(66, 128);
        ctx.lineTo(42, 92);
        ctx.closePath();
        ctx.fill();

        // Костяная пряжка-амулет на ремне
        ctx.fillStyle = '#dcd6c8';
        ctx.beginPath();
        ctx.arc(46, 108, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // 2. НЕБОЛЬШИЕ КОСТЯНЫЕ КОЛЮЧКИ НА ГОЛОВЕ (Среднее количество: 7 шипов веером)
        ctx.fillStyle = '#cfc5ad';
        ctx.strokeStyle = '#2d2918';
        ctx.lineWidth = 1;

        const spikes = [
            { x1: 42, y1: 48, tx: 33, ty: 37, x2: 47, y2: 43 },
            { x1: 48, y1: 42, tx: 42, ty: 29, x2: 54, y2: 39 },
            { x1: 55, y1: 38, tx: 52, ty: 24, x2: 60, y2: 37 },
            { x1: 61, y1: 37, tx: 64, ty: 22, x2: 67, y2: 37 }, // Центральный шип
            { x1: 68, y1: 37, tx: 76, ty: 24, x2: 73, y2: 38 },
            { x1: 74, y1: 39, tx: 86, ty: 29, x2: 80, y2: 42 },
            { x1: 81, y1: 43, tx: 95, ty: 37, x2: 86, y2: 48 }
        ];

        spikes.forEach(s => {
            ctx.beginPath();
            ctx.moveTo(s.x1, s.y1);
            ctx.lineTo(s.tx, s.ty);
            ctx.lineTo(s.x2, s.y2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        });

        // 3. ГОЛОВА И ГОРЛОВОЙ МЕШОК ЖАБОЛЮДА (Зелено-коричневый окрас)
        ctx.fillStyle = '#5c5832'; // Основной оливково-коричневый тон кожи
        ctx.beginPath();
        ctx.moveTo(38, 52);
        ctx.quadraticCurveTo(64, 34, 90, 52);
        ctx.lineTo(102, 78); // Широкие жабьи скулы
        ctx.lineTo(88, 102);
        ctx.quadraticCurveTo(64, 110, 40, 102);
        ctx.lineTo(26, 78);
        ctx.closePath();
        ctx.fill();

        // Охристо-коричневый горловой мешок снизу
        ctx.fillStyle = '#827345';
        ctx.beginPath();
        ctx.moveTo(38, 78);
        ctx.quadraticCurveTo(64, 72, 90, 78);
        ctx.lineTo(84, 100);
        ctx.quadraticCurveTo(64, 106, 44, 100);
        ctx.closePath();
        ctx.fill();

        // Бугорки и коричнево-зелёные пятна по бокам морды
        ctx.fillStyle = '#3f3d21';
        ctx.beginPath(); ctx.arc(36, 68, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(92, 68, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(46, 56, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(82, 56, 2.5, 0, Math.PI * 2); ctx.fill();

        // 4. ВЫПУКЛЫЕ ЖАБЬИ ГЛАЗА (Надбровные дуги с парой мелких шипиков)
        // Кожные веки
        ctx.fillStyle = '#484526';
        ctx.beginPath(); ctx.arc(42, 48, 10.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(86, 48, 10.5, 0, Math.PI * 2); ctx.fill();

        // Золотисто-янтарная радужка
        ctx.fillStyle = '#e67e22';
        ctx.beginPath(); ctx.arc(42, 49, 7.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(86, 49, 7.5, 0, Math.PI * 2); ctx.fill();

        // Горизонтальные амфибийные зрачки
        ctx.fillStyle = '#111111';
        ctx.fillRect(35, 48, 14, 2.4);
        ctx.fillRect(79, 48, 14, 2.4);

        // Яркие белые блики
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(44, 46, 1.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(84, 46, 1.4, 0, Math.PI * 2); ctx.fill();

        // 5. НОЗДРИ И ШИРОКИЙ ХИЩНЫЙ РОТ ЖАБОЛЮДА
        ctx.fillStyle = '#292714';
        ctx.beginPath(); ctx.arc(58, 60, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(70, 60, 1.8, 0, Math.PI * 2); ctx.fill();

        // Широкая пасть от щеки до щеки
        ctx.strokeStyle = '#242211';
        ctx.lineWidth = 2.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(31, 75);
        ctx.quadraticCurveTo(64, 86, 97, 75);
        ctx.stroke();

        // Пара мелких костяных зубцов по краям нижней губы
        ctx.fillStyle = '#e8e4d5';
        ctx.beginPath(); ctx.moveTo(43, 79); ctx.lineTo(45, 74); ctx.lineTo(47, 80); ctx.fill();
        ctx.beginPath(); ctx.moveTo(85, 79); ctx.lineTo(83, 74); ctx.lineTo(81, 80); ctx.fill();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 22);
        ctx.lineTo(38, 52);
        ctx.lineTo(26, 78);
        ctx.lineTo(34, 92);
        ctx.lineTo(16, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    skeleton_warrior() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ДОСПЕХИ И КОСТИ ГРУДНОЙ КЛЕТКИ (Задний план)
        // Потрёпанные ржавые наплечники
        ctx.fillStyle = '#3d4552';
        ctx.beginPath();
        ctx.moveTo(20, 128);
        ctx.lineTo(36, 98);
        ctx.lineTo(92, 98);
        ctx.lineTo(108, 128);
        ctx.closePath();
        ctx.fill();

        // Пятно ржавчины на наплечнике
        ctx.fillStyle = '#6e3b23';
        ctx.beginPath();
        ctx.arc(86, 114, 7, 0, Math.PI * 2);
        ctx.fill();

        // Костяные позвонки и ключицы по центру выреза
        ctx.fillStyle = '#cfc9b8';
        ctx.fillRect(58, 90, 12, 38);

        ctx.strokeStyle = '#e5e0d0';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(64, 102); ctx.quadraticCurveTo(46, 98, 34, 108);
        ctx.moveTo(64, 102); ctx.quadraticCurveTo(82, 98, 94, 108);
        ctx.stroke();

        // 2. ЧЕРЕП СКЕЛЕТА (Выглядывает из-под полей шлема-котелка)
        ctx.fillStyle = '#e8e4d5';
        ctx.beginPath();
        ctx.moveTo(42, 52);
        ctx.lineTo(86, 52);
        ctx.lineTo(88, 68);
        ctx.lineTo(79, 77);
        ctx.lineTo(76, 92);
        ctx.lineTo(52, 92);
        ctx.lineTo(49, 77);
        ctx.lineTo(40, 68);
        ctx.closePath();
        ctx.fill();

        // Тёмные скуловые впадины
        ctx.fillStyle = '#c9c3b0';
        ctx.beginPath(); ctx.ellipse(45, 58, 3.5, 7, 0.15, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(83, 58, 3.5, 7, -0.15, 0, Math.PI * 2); ctx.fill();

        // 3. ГЛУБОКИЕ ГЛАЗНИЦЫ И ТЛЕЮЩИЕ ЗЛОВЕЩИЕ ОГОНЬКИ
        ctx.fillStyle = '#141118';
        ctx.beginPath(); ctx.ellipse(52, 62, 7.2, 6, -0.08, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(76, 62, 7.2, 6, 0.08, 0, Math.PI * 2); ctx.fill();

        // Неоново-алые зрачки нежити
        ctx.fillStyle = '#ff5722';
        ctx.beginPath(); ctx.arc(52, 62, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 62, 2.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffd875';
        ctx.beginPath(); ctx.arc(52, 62, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 62, 1, 0, Math.PI * 2); ctx.fill();

        // Носовой провал и оскал костяных зубов
        ctx.fillStyle = '#141118';
        ctx.beginPath();
        ctx.moveTo(64, 67);
        ctx.lineTo(68, 75);
        ctx.lineTo(64, 73);
        ctx.lineTo(60, 75);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#24201c';
        ctx.fillRect(52, 81, 24, 6);

        ctx.fillStyle = '#f5f2e6';
        for (let x = 53; x <= 73; x += 4) {
            ctx.fillRect(x, 79, 3, 4);
            ctx.fillRect(x, 84.5, 3, 4);
        }

        // 4. СТАЛЬНОЙ ШЛЕМ-КОТЕЛОК С ШИРОКИМИ ПОЛЯМИ И ВМЯТИНОЙ
        // Полукруглый купол котелка
        ctx.fillStyle = '#636e72';
        ctx.beginPath();
        ctx.arc(64, 48, 25, Math.PI, Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        // Ржавое пятно и боевая зарубка на куполе шлема
        ctx.fillStyle = '#794628';
        ctx.beginPath(); ctx.ellipse(53, 35, 6, 3.5, -0.3, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#2d3436';
        ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(72, 27); ctx.lineTo(76, 36); ctx.stroke();

        // Широкие округлые поля котелка
        ctx.fillStyle = '#7f8c8d';
        ctx.beginPath();
        ctx.moveTo(24, 51);
        ctx.quadraticCurveTo(64, 43, 104, 51);
        ctx.lineTo(100, 56);
        ctx.quadraticCurveTo(64, 49, 28, 56);
        ctx.closePath();
        ctx.fill();

        // Заклёпки по ободу котелка
        ctx.fillStyle = '#dcdde1';
        ctx.beginPath(); ctx.arc(44, 47, 1.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(64, 45, 1.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(84, 47, 1.4, 0, Math.PI * 2); ctx.fill();

        // 5. БОЕВОЙ МЕЧ НА ПЕРЕДНЕМ ПЛАНЕ (По диагонали слева вверх)
        ctx.save();
        ctx.translate(32, 92);
        ctx.rotate((Math.PI / 180) * -28);
        ctx.translate(-32, -92);

        // Клинок меча
        ctx.fillStyle = '#b2bec3';
        ctx.beginPath();
        ctx.moveTo(29, 32);
        ctx.lineTo(32, 22);
        ctx.lineTo(35, 32);
        ctx.lineTo(35, 96);
        ctx.lineTo(29, 96);
        ctx.closePath();
        ctx.fill();

        // Светлая острая грань лезвия
        ctx.fillStyle = '#dfe6e9';
        ctx.beginPath();
        ctx.moveTo(32, 22);
        ctx.lineTo(35, 32);
        ctx.lineTo(35, 96);
        ctx.lineTo(32, 96);
        ctx.closePath();
        ctx.fill();

        // Зазубрина на клинке
        ctx.fillStyle = '#2d3436';
        ctx.beginPath(); ctx.moveTo(29, 54); ctx.lineTo(31.5, 56); ctx.lineTo(29, 58); ctx.fill();

        // Стальная гарда, рукоять и навершие
        ctx.fillStyle = '#57606f';
        ctx.fillRect(21, 96, 22, 4);
        ctx.fillStyle = '#3e2723';
        ctx.fillRect(30, 100, 4, 16);
        ctx.fillStyle = '#7f8c8d';
        ctx.beginPath(); ctx.arc(32, 118, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 23);
        ctx.arc(64, 48, 25, Math.PI * 1.5, Math.PI, true);
        ctx.lineTo(24, 51);
        ctx.lineTo(40, 68);
        ctx.lineTo(52, 92);
        ctx.lineTo(20, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    hag() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. РВАНЫЕ ЛОХМОТЬЯ И ШАЛЬ НА СГОРБЛЕННЫХ ПЛЕЧАХ
        ctx.fillStyle = '#1e241b';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(34, 94);
        ctx.lineTo(94, 94);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        // Ожерелье из мелких костей и клыков на шее
        ctx.fillStyle = '#dcd6c8';
        ctx.beginPath(); ctx.moveTo(50, 102); ctx.lineTo(52, 111); ctx.lineTo(55, 103); ctx.fill();
        ctx.beginPath(); ctx.moveTo(62, 105); ctx.lineTo(64, 115); ctx.lineTo(66, 105); ctx.fill();
        ctx.beginPath(); ctx.moveTo(78, 102); ctx.lineTo(76, 111); ctx.lineTo(73, 103); ctx.fill();

        // 2. ДЛИННЫЕ СПУТАННЫЕ СЕДЫЕ ВОЛОСЫ НА ЗАДНЕМ ПЛАНЕ
        ctx.fillStyle = '#8395a7';
        ctx.beginPath();
        ctx.moveTo(34, 52);
        ctx.lineTo(22, 122);
        ctx.lineTo(42, 114);
        ctx.lineTo(86, 114);
        ctx.lineTo(106, 122);
        ctx.lineTo(94, 52);
        ctx.closePath();
        ctx.fill();

        // 3. КОСТЛЯВОЕ МОРЩИНИСТОЕ ЛИЦО КАРГИ (Болотно-серо-зелёный тон)
        ctx.fillStyle = '#6c7a5e';
        ctx.beginPath();
        ctx.moveTo(44, 50);
        ctx.lineTo(84, 50);
        ctx.lineTo(86, 72);
        ctx.lineTo(75, 86);
        ctx.lineTo(64, 102); // Острый выдающийся подбородок ведьмы
        ctx.lineTo(53, 86);
        ctx.lineTo(42, 72);
        ctx.closePath();
        ctx.fill();

        // Глубокие морщины на лбу и у скул
        ctx.strokeStyle = '#3d4734';
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(52, 52); ctx.quadraticCurveTo(64, 49, 76, 52);
        ctx.moveTo(47, 74); ctx.lineTo(54, 83);
        ctx.moveTo(81, 74); ctx.lineTo(74, 83);
        ctx.stroke();

        // 4. АСИММЕТРИЧНЫЕ ВЕДЬМИНСКИЕ ГЛАЗА (Один слепой с бельмом, второй горящий жёлтый)
        // Тёмные впадины глазниц
        ctx.fillStyle = '#2d3326';
        ctx.beginPath(); ctx.ellipse(53, 63, 6, 3.2, -0.15, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 63, 6, 3.2, 0.15, 0, Math.PI * 2); ctx.fill();

        // Левый глаз — мутно-белый слепой
        ctx.fillStyle = '#dfe6e9';
        ctx.beginPath(); ctx.arc(53, 63, 3, 0, Math.PI * 2); ctx.fill();

        // Правый глаз — пронзительный жёлтый огонёк с узким зрачком
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath(); ctx.arc(75, 63, 3.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#111111';
        ctx.fillRect(74.4, 60.5, 1.3, 5);

        // Нависшие косматые седые брови
        ctx.strokeStyle = '#cfd8dc';
        ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.moveTo(45, 57); ctx.lineTo(59, 60); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(83, 57); ctx.lineTo(69, 60); ctx.stroke();

        // 5. ДЛИННЫЙ НОС КРЮЧКОМ С БОРОДАВКОЙ И ЗЛОВЕЩАЯ УХМЫЛКА
        ctx.fillStyle = '#556149';
        ctx.beginPath();
        ctx.moveTo(62, 61);
        ctx.lineTo(67, 61);
        ctx.lineTo(70, 79); // Длинный крючковатый кончик носа
        ctx.quadraticCurveTo(63, 83, 59, 77);
        ctx.closePath();
        ctx.fill();

        // Бородавка на носу
        ctx.fillStyle = '#3b4232';
        ctx.beginPath(); ctx.arc(68, 73, 2, 0, Math.PI * 2); ctx.fill();

        // Кривая ухмылка с парой жёлтых клычков
        ctx.strokeStyle = '#1e241b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(51, 87);
        ctx.quadraticCurveTo(64, 93, 77, 86);
        ctx.stroke();

        ctx.fillStyle = '#e6d8a8';
        ctx.beginPath(); ctx.moveTo(56, 88); ctx.lineTo(58, 93); ctx.lineTo(60, 89); ctx.fill();
        ctx.beginPath(); ctx.moveTo(72, 88); ctx.lineTo(70, 93); ctx.lineTo(68, 89); ctx.fill();

        // 6. РВАНЫЙ ТЁМНЫЙ ВЕДЬМИНСКИЙ КАПЮШОН
        ctx.fillStyle = '#262e21';
        ctx.beginPath();
        ctx.moveTo(36, 56);
        ctx.quadraticCurveTo(44, 22, 64, 18); // Острый загнутый верх капюшона
        ctx.quadraticCurveTo(84, 22, 92, 56);
        ctx.lineTo(86, 60);
        ctx.quadraticCurveTo(64, 44, 42, 60);
        ctx.closePath();
        ctx.fill();

        // Выбивающиеся пряди седых волос из-под капюшона
        ctx.strokeStyle = '#b2bec3';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(43, 54); ctx.quadraticCurveTo(37, 74, 41, 92);
        ctx.moveTo(85, 54); ctx.quadraticCurveTo(91, 74, 87, 92);
        ctx.stroke();

        // 7. КОРЯВЫЙ ПОСОХ С ЗЕЛЁНЫМ ЧЕРЕПОМ / КАМНЕМ (Справа)
        ctx.strokeStyle = '#4a3525';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(106, 36);
        ctx.quadraticCurveTo(102, 78, 108, 128);
        ctx.stroke();

        // Светящийся болотный кристалл-амулет на навершии посоха
        ctx.fillStyle = 'rgba(46, 204, 113, 0.35)';
        ctx.beginPath(); ctx.arc(106, 32, 10, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#2ecc71';
        ctx.beginPath();
        ctx.moveTo(106, 22);
        ctx.lineTo(112, 32);
        ctx.lineTo(106, 42);
        ctx.lineTo(100, 32);
        ctx.closePath();
        ctx.fill();

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 18);
        ctx.quadraticCurveTo(44, 22, 36, 56);
        ctx.lineTo(42, 72);
        ctx.lineTo(53, 86);
        ctx.lineTo(64, 102);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.lineTo(34, 94);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    giant_rat() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАДНИЙ ПЛАН: Лохматый загривок и плечи гигантской крысы
        ctx.fillStyle = '#3b332e';
        ctx.beginPath();
        ctx.moveTo(18, 128);
        ctx.lineTo(36, 86);
        ctx.lineTo(92, 86);
        ctx.lineTo(110, 128);
        ctx.closePath();
        ctx.fill();

        // Взъерошенные клочья шерсти по бокам загривка
        ctx.fillStyle = '#4f453f';
        ctx.beginPath();
        ctx.moveTo(28, 106); ctx.lineTo(18, 98); ctx.lineTo(32, 94);
        ctx.moveTo(100, 106); ctx.lineTo(110, 98); ctx.lineTo(96, 94);
        ctx.fill();

        // 2. БОЛЬШИЕ ОКРУГЛЫЕ КРЫСИНЫЕ УШИ
        // Внешний серый контур ушей
        ctx.fillStyle = '#5c524b';
        ctx.beginPath(); ctx.arc(34, 46, 17, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(94, 46, 17, 0, Math.PI * 2); ctx.fill();

        // Внутренняя розово-телесная ушная раковина
        ctx.fillStyle = '#d99b9b';
        ctx.beginPath(); ctx.arc(36, 48, 11.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(92, 48, 11.5, 0, Math.PI * 2); ctx.fill();

        // Маленькая зазубрина на левом ухе
        ctx.fillStyle = '#3b332e';
        ctx.beginPath(); ctx.moveTo(18, 42); ctx.lineTo(25, 45); ctx.lineTo(19, 49); ctx.closePath(); ctx.fill();

        // 3. ВЫТЯНУТАЯ ОСТРАЯ МОРДА (Анфас с акцентом на вытянутый нос)
        ctx.fillStyle = '#635850'; // Грубый серо-бурый мех головы
        ctx.beginPath();
        ctx.moveTo(42, 44);
        ctx.quadraticCurveTo(64, 34, 86, 44);
        ctx.lineTo(94, 72);
        ctx.lineTo(74, 96);
        ctx.lineTo(64, 102);
        ctx.lineTo(54, 96);
        ctx.lineTo(34, 72);
        ctx.closePath();
        ctx.fill();

        // Более светлый мех на переносице и щеках
        ctx.fillStyle = '#7d7067';
        ctx.beginPath();
        ctx.moveTo(52, 54);
        ctx.lineTo(76, 54);
        ctx.lineTo(72, 92);
        ctx.lineTo(64, 98);
        ctx.lineTo(56, 92);
        ctx.closePath();
        ctx.fill();

        // 4. ЗЛОБНЫЕ РУБИНОВО-КРАСНЫЕ ГЛАЗА-БУСИНЫ
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath(); ctx.arc(47, 62, 4.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(81, 62, 4.8, 0, Math.PI * 2); ctx.fill();

        // Тёмные зрачки и блики
        ctx.fillStyle = '#1a0505';
        ctx.beginPath(); ctx.arc(47, 62, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(81, 62, 2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(48.5, 60.5, 1.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(79.5, 60.5, 1.1, 0, Math.PI * 2); ctx.fill();

        // Нахмуренные меховые складки над глазами
        ctx.strokeStyle = '#2e2723';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(40, 54); ctx.lineTo(53, 59); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(88, 54); ctx.lineTo(75, 59); ctx.stroke();

        // 5. РОЗОВЫЙ НОС, ОСКАЛ И ДЛИННЫЕ ЖЁЛТЫЕ РЕЗЦЫ
        // Тёмная пасть под носом
        ctx.fillStyle = '#241414';
        ctx.beginPath();
        ctx.moveTo(53, 86);
        ctx.quadraticCurveTo(64, 82, 75, 86);
        ctx.lineTo(71, 95);
        ctx.lineTo(57, 95);
        ctx.closePath();
        ctx.fill();

        // Два огромных жёлто-костяных крысиных резца
        ctx.fillStyle = '#f5e6a3';
        ctx.strokeStyle = '#5c4d26';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.rect(58.5, 85, 4.8, 12); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.rect(64.7, 85, 4.8, 12); ctx.fill(); ctx.stroke();

        // Крупный розовый нос треугольником
        ctx.fillStyle = '#e89b9b';
        ctx.beginPath();
        ctx.moveTo(57, 78);
        ctx.lineTo(71, 78);
        ctx.lineTo(64, 86);
        ctx.closePath();
        ctx.fill();

        // 6. ДЛИННЫЕ УСЫ-ВИБРИССЫ
        ctx.strokeStyle = 'rgba(235, 235, 235, 0.75)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(54, 81); ctx.lineTo(16, 75);
        ctx.moveTo(54, 84); ctx.lineTo(14, 86);
        ctx.moveTo(55, 87); ctx.lineTo(20, 96);
        ctx.moveTo(74, 81); ctx.lineTo(112, 75);
        ctx.moveTo(74, 84); ctx.lineTo(114, 86);
        ctx.moveTo(73, 87); ctx.lineTo(108, 96);
        ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 34);
        ctx.lineTo(42, 44);
        ctx.lineTo(34, 72);
        ctx.lineTo(54, 96);
        ctx.lineTo(64, 102);
        ctx.lineTo(64, 128);
        ctx.lineTo(18, 128);
        ctx.lineTo(36, 86);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    satyr_dryad() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАДНИЙ ПЛАН: Зачёсанная назад густая грива волос, уходящая за плечи
        ctx.fillStyle = '#1b4332'; // Тёмно-изумрудная глубина волос
        ctx.beginPath();
        ctx.moveTo(36, 48);
        ctx.quadraticCurveTo(22, 86, 20, 128);
        ctx.lineTo(108, 128);
        ctx.quadraticCurveTo(106, 86, 92, 48);
        ctx.closePath();
        ctx.fill();

        // Плечи и накидка из лесных листьев и лоз
        ctx.fillStyle = '#2d6a4f';
        ctx.beginPath();
        ctx.moveTo(22, 128);
        ctx.lineTo(40, 102);
        ctx.lineTo(88, 102);
        ctx.lineTo(106, 128);
        ctx.closePath();
        ctx.fill();

        // Ожерелье из золотисто-зелёных листьев на шее
        ctx.fillStyle = '#74c69d';
        ctx.beginPath();
        ctx.ellipse(50, 108, 6, 3, 0.4, 0, Math.PI * 2);
        ctx.ellipse(64, 112, 7, 3.2, 0, 0, Math.PI * 2);
        ctx.ellipse(78, 108, 6, 3, -0.4, 0, Math.PI * 2);
        ctx.fill();

        // 2. ИЗОГНУТЫЕ ВИТЫЕ РОГА САТИРА (Растут из висков вверх и загибаются назад-вбок)
        ctx.fillStyle = '#6e472b'; // Тёмное дерево-кость рогов
        // Левый рог
        ctx.beginPath();
        ctx.moveTo(46, 44);
        ctx.bezierCurveTo(22, 34, 14, 14, 34, 8);
        ctx.bezierCurveTo(28, 18, 34, 30, 52, 38);
        ctx.closePath();
        ctx.fill();

        // Правый рог
        ctx.beginPath();
        ctx.moveTo(82, 44);
        ctx.bezierCurveTo(106, 34, 114, 14, 94, 8);
        ctx.bezierCurveTo(100, 18, 94, 30, 76, 38);
        ctx.closePath();
        ctx.fill();

        // Рельефные насечки-кольца на рогах сатира
        ctx.strokeStyle = '#a67c52';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(39, 38); ctx.lineTo(44, 33);
        ctx.moveTo(31, 30); ctx.lineTo(37, 26);
        ctx.moveTo(27, 20); ctx.lineTo(33, 18);
        ctx.moveTo(89, 38); ctx.lineTo(84, 33);
        ctx.moveTo(97, 30); ctx.lineTo(91, 26);
        ctx.moveTo(101, 20); ctx.lineTo(95, 18);
        ctx.stroke();

        // 3. ЗАОСТРЁННЫЕ УШИ САТИРА С ЛЕСНЫМИ КИСТОЧКАМИ
        ctx.fillStyle = '#c9a679';
        ctx.beginPath(); ctx.moveTo(43, 62); ctx.lineTo(22, 52); ctx.lineTo(42, 71); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(85, 62); ctx.lineTo(106, 52); ctx.lineTo(86, 71); ctx.closePath(); ctx.fill();

        // 4. ШЕЯ И ОТКРЫТОЕ ЛИЦО (Волосы полностью зачёсаны назад, лоб открыт)
        ctx.fillStyle = '#c49d6c';
        ctx.fillRect(55, 86, 18, 18);

        ctx.fillStyle = '#dbb686'; // Тёплый оливково-золотистый тон кожи фейри
        ctx.beginPath();
        ctx.moveTo(45, 48);
        ctx.quadraticCurveTo(64, 34, 83, 48);
        ctx.lineTo(81, 78);
        ctx.lineTo(64, 96); // Изящный заострённый подбородок
        ctx.lineTo(47, 78);
        ctx.closePath();
        ctx.fill();

        // 5. ЗАЧЁСАННЫЕ НАЗАД ВОЛОСЫ (Пышный объём на макушке с прядями назад)
        ctx.fillStyle = '#2d6a4f';
        ctx.beginPath();
        ctx.moveTo(44, 52);
        ctx.quadraticCurveTo(42, 24, 64, 22); // Пышный начёс вверх-назад
        ctx.quadraticCurveTo(86, 24, 84, 52);
        ctx.quadraticCurveTo(74, 40, 64, 40); // Открытая линия роста волос на лбу
        ctx.quadraticCurveTo(54, 40, 44, 52);
        ctx.closePath();
        ctx.fill();

        // Световые пряди-штрихи зачёса назад
        ctx.strokeStyle = '#52b788';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(54, 41); ctx.quadraticCurveTo(52, 30, 56, 24);
        ctx.moveTo(64, 40); ctx.quadraticCurveTo(64, 29, 64, 22);
        ctx.moveTo(74, 41); ctx.quadraticCurveTo(76, 30, 72, 24);
        ctx.stroke();

        // 6. ОЗОРНЫЕ ЯНТАРНО-ЗОЛОТЫЕ ГЛАЗА, ВЕСНУШКИ И ЛУКАВАЯ УЛЫБКА
        ctx.fillStyle = '#ffd166'; // Яркие глаза лесного духа
        ctx.beginPath(); ctx.ellipse(54, 61, 4.8, 2.2, -0.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 61, 4.8, 2.2, 0.1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#1b1b1b'; // Горизонтальные зрачки сатира
        ctx.fillRect(51.5, 60.3, 5, 1.4);
        ctx.fillRect(71.5, 60.3, 5, 1.4);

        ctx.fillStyle = '#ffffff'; // Блики
        ctx.beginPath(); ctx.arc(55.5, 59.8, 0.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(72.5, 59.8, 0.8, 0, Math.PI * 2); ctx.fill();

        // Изящные приподнятые брови
        ctx.strokeStyle = '#1b4332';
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(47, 55); ctx.quadraticCurveTo(54, 52, 59, 56); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(81, 55); ctx.quadraticCurveTo(74, 52, 69, 56); ctx.stroke();

        // Золотистые лесные веснушки на щеках
        ctx.fillStyle = '#a47148';
        ctx.fillRect(49, 68, 1.4, 1.4); ctx.fillRect(52, 70, 1.4, 1.4);
        ctx.fillRect(79, 68, 1.4, 1.4); ctx.fillRect(76, 70, 1.4, 1.4);

        // Изящный носик и лукавая ухмылка
        ctx.strokeStyle = '#b0895a';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 58); ctx.lineTo(62, 72); ctx.lineTo(66, 72); ctx.stroke();

        ctx.fillStyle = '#c85a53';
        ctx.beginPath(); ctx.ellipse(64, 82, 4.8, 1.6, 0, 0, Math.PI * 2); ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 22);
        ctx.quadraticCurveTo(42, 24, 44, 52);
        ctx.lineTo(47, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(64, 128);
        ctx.lineTo(20, 128);
        ctx.lineTo(36, 48);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    warg() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАДНИЙ ПЛАН: Мощный взъерошенный загривок и плечи зверя
        ctx.fillStyle = '#1c1917'; // Угольно-бурый мех спины
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.lineTo(28, 76);
        ctx.lineTo(44, 58);
        ctx.lineTo(84, 58);
        ctx.lineTo(100, 76);
        ctx.lineTo(114, 128);
        ctx.closePath();
        ctx.fill();

        // Острые клочья шерсти дыбом по бокам загривка
        ctx.fillStyle = '#292524';
        ctx.beginPath();
        ctx.moveTo(26, 86); ctx.lineTo(12, 74); ctx.lineTo(30, 70);
        ctx.moveTo(22, 104); ctx.lineTo(10, 98); ctx.lineTo(25, 92);
        ctx.moveTo(102, 86); ctx.lineTo(116, 74); ctx.lineTo(98, 70);
        ctx.moveTo(106, 104); ctx.lineTo(118, 98); ctx.lineTo(103, 92);
        ctx.fill();

        // 2. ОСТРЫЕ ВОЛЧЬИ УШИ (Левое целое, правое с боевой зазубриной)
        ctx.fillStyle = '#292524';
        // Левое ухо
        ctx.beginPath();
        ctx.moveTo(38, 52);
        ctx.lineTo(26, 18);
        ctx.lineTo(52, 42);
        ctx.closePath();
        ctx.fill();

        // Правое рваное ухо
        ctx.beginPath();
        ctx.moveTo(90, 52);
        ctx.lineTo(102, 18);
        ctx.lineTo(94, 30);
        ctx.lineTo(98, 34);
        ctx.lineTo(91, 38);
        ctx.lineTo(76, 42);
        ctx.closePath();
        ctx.fill();

        // Внутренняя тёмная раковина ушей
        ctx.fillStyle = '#120f0e';
        ctx.beginPath(); ctx.moveTo(40, 48); ctx.lineTo(31, 25); ctx.lineTo(49, 43); ctx.fill();
        ctx.beginPath(); ctx.moveTo(88, 48); ctx.lineTo(97, 25); ctx.lineTo(79, 43); ctx.fill();

        // 3. ШИПАСТЫЙ БОЕВОЙ ОШЕЙНИК НА ШЕЕ
        ctx.fillStyle = '#3e2723';
        ctx.beginPath();
        ctx.moveTo(34, 98);
        ctx.quadraticCurveTo(64, 112, 94, 98);
        ctx.lineTo(98, 110);
        ctx.quadraticCurveTo(64, 124, 30, 110);
        ctx.closePath();
        ctx.fill();

        // Стальные шипы на ошейнике
        ctx.fillStyle = '#95a5a6';
        ctx.beginPath(); ctx.moveTo(42, 104); ctx.lineTo(36, 116); ctx.lineTo(48, 107); ctx.fill();
        ctx.beginPath(); ctx.moveTo(60, 108); ctx.lineTo(64, 122); ctx.lineTo(68, 108); ctx.fill();
        ctx.beginPath(); ctx.moveTo(86, 104); ctx.lineTo(92, 116); ctx.lineTo(80, 107); ctx.fill();

        // 4. МАССИВНАЯ ГОЛОВА И СКУЛЫ ВАРГА
        ctx.fillStyle = '#3b332f'; // Тёмный волчий мех
        ctx.beginPath();
        ctx.moveTo(42, 42);
        ctx.lineTo(64, 34);
        ctx.lineTo(86, 42);
        ctx.lineTo(96, 68);
        ctx.lineTo(82, 94);
        ctx.lineTo(64, 102);
        ctx.lineTo(46, 94);
        ctx.lineTo(32, 68);
        ctx.closePath();
        ctx.fill();

        // Более светлая морда и надбровные дуги (flat-объём)
        ctx.fillStyle = '#524742';
        ctx.beginPath();
        ctx.moveTo(48, 56);
        ctx.lineTo(80, 56);
        ctx.lineTo(82, 88);
        ctx.lineTo(64, 96);
        ctx.lineTo(46, 88);
        ctx.closePath();
        ctx.fill();

        // Складки яростного рычания на переносице
        ctx.strokeStyle = '#1c1917';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(57, 63); ctx.quadraticCurveTo(64, 60, 71, 63);
        ctx.moveTo(58, 67); ctx.quadraticCurveTo(64, 64, 70, 67);
        ctx.stroke();

        // 5. ПЫЛАЮЩИЕ РУБИНОВО-КРАСНЫЕ ГЛАЗА И БОЕВОЙ ШРАМ
        ctx.fillStyle = '#ff2a2a';
        ctx.beginPath(); ctx.ellipse(49, 54, 5.5, 2.4, 0.22, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(79, 54, 5.5, 2.4, -0.22, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffd875'; // Яркие хищные зрачки
        ctx.beginPath(); ctx.arc(50, 54, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(78, 54, 1.3, 0, Math.PI * 2); ctx.fill();

        // Нависшие злые брови
        ctx.strokeStyle = '#120f0e';
        ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(41, 47); ctx.lineTo(56, 53); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(87, 47); ctx.lineTo(72, 53); ctx.stroke();

        // Багровый боевой шрам через левую скулу и глаз
        ctx.strokeStyle = '#b71c1c';
        ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(45, 44); ctx.lineTo(54, 68); ctx.stroke();

        // 6. КРУПНЫЙ НОС И ОСКАЛЕННАЯ ПАСТЬ С КЛЫКАМИ
        // Тёмная глубина пасти
        ctx.fillStyle = '#140909';
        ctx.beginPath();
        ctx.moveTo(48, 80);
        ctx.quadraticCurveTo(64, 75, 80, 80);
        ctx.lineTo(76, 92);
        ctx.quadraticCurveTo(64, 96, 52, 92);
        ctx.closePath();
        ctx.fill();

        // Верхние крупные клыки
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.moveTo(51, 80); ctx.lineTo(54, 90); ctx.lineTo(57, 80); ctx.fill();
        ctx.beginPath(); ctx.moveTo(77, 80); ctx.lineTo(74, 90); ctx.lineTo(71, 80); ctx.fill();

        // Нижние острые клыки
        ctx.fillStyle = '#e0dcd3';
        ctx.beginPath(); ctx.moveTo(56, 92); ctx.lineTo(58, 84); ctx.lineTo(60, 92); ctx.fill();
        ctx.beginPath(); ctx.moveTo(72, 92); ctx.lineTo(70, 84); ctx.lineTo(68, 92); ctx.fill();

        // Чёрная мочка носа
        ctx.fillStyle = '#120f0e';
        ctx.beginPath();
        ctx.moveTo(57, 71);
        ctx.lineTo(71, 71);
        ctx.lineTo(64, 78);
        ctx.closePath();
        ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 34);
        ctx.lineTo(42, 42);
        ctx.lineTo(32, 68);
        ctx.lineTo(46, 94);
        ctx.lineTo(64, 102);
        ctx.lineTo(64, 128);
        ctx.lineTo(14, 128);
        ctx.lineTo(28, 76);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    ogre() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. МАССИВНАЯ ШИПАСТАЯ ДУБИНА ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.save();
        ctx.translate(102, 54);
        ctx.rotate((Math.PI / 180) * 24);

        // Толстая суковатая дубина, расширяющаяся кверху
        ctx.fillStyle = '#5c3a21';
        ctx.strokeStyle = '#2b190d';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(-4, 48);
        ctx.lineTo(-10, -34);
        ctx.quadraticCurveTo(0, -42, 10, -34);
        ctx.lineTo(4, 48);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Световая древесная грань и трещины коры
        ctx.fillStyle = '#784b2a';
        ctx.beginPath();
        ctx.moveTo(0, 46);
        ctx.lineTo(0, -37);
        ctx.quadraticCurveTo(6, -37, 9, -33);
        ctx.lineTo(3, 46);
        ctx.closePath();
        ctx.fill();

        // Железные обручи и грубые стальные шипы на дубине
        ctx.fillStyle = '#475569';
        ctx.fillRect(-9.5, -24, 19, 4.5);
        ctx.fillRect(-8, -6, 16, 4.5);

        ctx.fillStyle = '#94a3b8';
        ctx.beginPath(); ctx.moveTo(-9.5, -24); ctx.lineTo(-17, -22); ctx.lineTo(-9.5, -19.5); ctx.fill();
        ctx.beginPath(); ctx.moveTo(9.5, -24); ctx.lineTo(17, -22); ctx.lineTo(9.5, -19.5); ctx.fill();
        ctx.beginPath(); ctx.moveTo(-8, -6); ctx.lineTo(-15, -4); ctx.lineTo(-8, -1.5); ctx.fill();
        ctx.beginPath(); ctx.moveTo(8, -6); ctx.lineTo(15, -4); ctx.lineTo(8, -1.5); ctx.fill();
        ctx.restore();

        // 2. МОГУЧИЕ ПЛЕЧИ ОГРА, МЕХОВАЯ ШКУРА И КОЖАНЫЙ РЕМЕНЬ
        ctx.fillStyle = '#8c7258';
        ctx.beginPath();
        ctx.moveTo(10, 128);
        ctx.quadraticCurveTo(26, 88, 64, 88);
        ctx.quadraticCurveTo(102, 88, 118, 128);
        ctx.closePath();
        ctx.fill();

        // Лохматая медвежья шкура, перекинутая через левое плечо
        ctx.fillStyle = '#3b2416';
        ctx.beginPath();
        ctx.moveTo(12, 128);
        ctx.quadraticCurveTo(22, 92, 48, 94);
        ctx.lineTo(66, 128);
        ctx.closePath();
        ctx.fill();

        // Толстый кожаный ремень-портупея с медной пряжкой
        ctx.fillStyle = '#291a10';
        ctx.beginPath();
        ctx.moveTo(32, 98);
        ctx.lineTo(66, 128);
        ctx.lineTo(84, 128);
        ctx.lineTo(46, 94);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2.2;
        ctx.strokeRect(48, 110, 10, 9);

        // 3. ОКРУГЛЫЕ ОТТОПЫРЕННЫЕ УШИ ОГРА
        ctx.fillStyle = '#8c7258';
        ctx.beginPath(); ctx.ellipse(38, 66, 6, 9, -0.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(90, 66, 6, 9, 0.2, 0, Math.PI * 2); ctx.fill();

        // 4. МАССИВНАЯ ГРУША-ГОЛОВА И ТЯЖЁЛАЯ НИЖНЯЯ ЧЕЛЮСТЬ
        ctx.fillStyle = '#a3876a';
        ctx.beginPath();
        ctx.moveTo(44, 42);
        ctx.quadraticCurveTo(64, 30, 84, 42);
        ctx.lineTo(92, 74);
        ctx.lineTo(84, 98);
        ctx.quadraticCurveTo(64, 108, 44, 98);
        ctx.lineTo(36, 74);
        ctx.closePath();
        ctx.fill();

        // Световая зона на массивных щеках и подбородке (flat-объём)
        ctx.fillStyle = '#b89b7d';
        ctx.beginPath();
        ctx.moveTo(46, 68);
        ctx.lineTo(82, 68);
        ctx.lineTo(80, 94);
        ctx.quadraticCurveTo(64, 104, 48, 94);
        ctx.closePath();
        ctx.fill();

        // Редкие сальные космы тёмных волос на макушке
        ctx.strokeStyle = '#1f1712';
        ctx.lineWidth = 2.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(54, 36); ctx.quadraticCurveTo(48, 22, 42, 26);
        ctx.moveTo(64, 34); ctx.quadraticCurveTo(64, 18, 68, 16);
        ctx.moveTo(74, 36); ctx.quadraticCurveTo(80, 22, 86, 26);
        ctx.stroke();

        // 5. ТЯЖЁЛЫЙ НАДБРОВНЫЙ ВАЛИК И СВИРЕПЫЙ РОВНЫЙ ВЗГЛЯД
        ctx.fillStyle = '#755d45';
        ctx.beginPath();
        ctx.moveTo(41, 50);
        ctx.quadraticCurveTo(64, 56, 87, 50);
        ctx.lineTo(85, 57);
        ctx.quadraticCurveTo(64, 61, 43, 57);
        ctx.closePath();
        ctx.fill();

        // Маленькие глубоко посаженные злобные глаза
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(51, 59, 4.2, 2.1, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(77, 59, 4.2, 2.1, 0, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#b91c1c';
        ctx.beginPath(); ctx.arc(51.5, 59, 1.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76.5, 59, 1.7, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(51.5, 59, 0.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76.5, 59, 0.8, 0, Math.PI * 2); ctx.fill();

        // 6. ШИРОКИЙ НОС КАРТОШКОЙ И ПАСТЬ С ВЫСТУПАЮЩИМИ НИЖНИМИ КЛЫКАМИ
        ctx.fillStyle = '#856b50';
        ctx.beginPath();
        ctx.moveTo(60, 58);
        ctx.lineTo(68, 58);
        ctx.lineTo(73, 73);
        ctx.quadraticCurveTo(64, 78, 55, 73);
        ctx.closePath();
        ctx.fill();

        // Ноздри
        ctx.fillStyle = '#3b2c1e';
        ctx.beginPath(); ctx.arc(59, 73, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(69, 73, 1.8, 0, Math.PI * 2); ctx.fill();

        // Угрюмая складка рта
        ctx.strokeStyle = '#3b2c1e';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(47, 86);
        ctx.quadraticCurveTo(64, 81, 81, 86);
        ctx.stroke();

        // Два мощных тупых клыка, торчащих из нижней челюсти вверх
        ctx.fillStyle = '#fef3c7';
        ctx.strokeStyle = '#3b2c1e';
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(48, 86); ctx.lineTo(46, 74); ctx.lineTo(54, 85); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(80, 86); ctx.lineTo(82, 74); ctx.lineTo(74, 85); ctx.closePath(); ctx.fill(); ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 34);
        ctx.quadraticCurveTo(50, 38, 44, 42);
        ctx.lineTo(36, 74);
        ctx.lineTo(44, 98);
        ctx.lineTo(64, 104);
        ctx.lineTo(64, 128);
        ctx.lineTo(10, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    manticore() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. БОЛЬШИЕ РАСПАХНУТЫЕ ПЕРЕПОНЧАТЫЕ КРЫЛЬЯ (На весь верхний и боковой размах)
        const drawLargeWing = (isRight) => {
            ctx.save();
            if (isRight) {
                ctx.translate(size, 0);
                ctx.scale(-1, 1);
            }

            // Основная широкая перепонка крыла летучей мыши
            ctx.fillStyle = '#5c2124';
            ctx.beginPath();
            ctx.moveTo(46, 74);
            ctx.lineTo(10, 8);   // Высокий верхний сгиб крыла
            ctx.quadraticCurveTo(6, 26, 2, 34);
            ctx.quadraticCurveTo(10, 48, 2, 62);
            ctx.quadraticCurveTo(12, 74, 6, 88);
            ctx.quadraticCurveTo(22, 88, 36, 98);
            ctx.closePath();
            ctx.fill();

            // Внутренний более светлый слой перепонки для глубины
            ctx.fillStyle = '#782c30';
            ctx.beginPath();
            ctx.moveTo(44, 72);
            ctx.lineTo(13, 18);
            ctx.lineTo(10, 56);
            ctx.lineTo(34, 86);
            ctx.closePath();
            ctx.fill();

            // Костяные лучи-пальцы перепонки крыла
            ctx.strokeStyle = '#290d0e';
            ctx.lineWidth = 2.6;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(46, 74);
            ctx.lineTo(10, 8);  // Главная плечевая/предплечная кость крыла
            ctx.moveTo(10, 8);
            ctx.lineTo(2, 34);  // Первый луч перепонки
            ctx.moveTo(18, 24);
            ctx.lineTo(2, 62);  // Второй луч перепонки
            ctx.moveTo(26, 40);
            ctx.lineTo(6, 88);  // Третий луч перепонки
            ctx.stroke();

            // Острый костяной коготь на верхнем сгибе крыла
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath();
            ctx.moveTo(8, 9);
            ctx.lineTo(6, 2);
            ctx.lineTo(13, 8);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        };

        drawLargeWing(false); // Левое большое крыло
        drawLargeWing(true);  // Правое большое крыло

        // 2. ЗАГНУТЫЙ НАД ГОЛОВОЙ СЕГМЕНТИРОВАННЫЙ ХВОСТ СКОРПИОНА
        ctx.strokeStyle = '#7c2d12';
        ctx.lineWidth = 7.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(86, 86);
        ctx.bezierCurveTo(122, 68, 118, 16, 74, 10);
        ctx.stroke();

        ctx.strokeStyle = '#ea580c';
        ctx.lineWidth = 3.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(86, 86);
        ctx.bezierCurveTo(122, 68, 118, 16, 74, 10);
        ctx.stroke();
        ctx.setLineDash([]);

        // Булава с шипами-дротиками и ядовитым жалом на конце хвоста
        ctx.fillStyle = '#451a03';
        ctx.beginPath();
        ctx.arc(72, 10, 6.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(68, 8); ctx.lineTo(54, 6); ctx.lineTo(67, 13);
        ctx.moveTo(69, 5); ctx.lineTo(58, 1); ctx.lineTo(72, 8);
        ctx.moveTo(69, 13); ctx.lineTo(58, 17); ctx.lineTo(72, 12);
        ctx.closePath();
        ctx.fill();

        // 3. ПЫШНАЯ ТЁМНО-БУРАЯ ГРИВА МАНТИКОРЫ
        ctx.fillStyle = '#3b1c0e';
        ctx.beginPath();
        ctx.moveTo(22, 128);
        ctx.bezierCurveTo(14, 84, 24, 34, 64, 30);
        ctx.bezierCurveTo(104, 34, 114, 84, 106, 128);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#5c2d16';
        ctx.beginPath();
        ctx.arc(64, 42, 26, 0, Math.PI * 2);
        ctx.arc(36, 66, 18, 0, Math.PI * 2);
        ctx.arc(92, 66, 18, 0, Math.PI * 2);
        ctx.fill();

        // 4. СВИРЕПАЯ МОРДА ХИЩНИКА С ЧЕЛОВЕЧЕСКИМИ ЧЕРТАМИ И КЛЫКАМИ
        ctx.fillStyle = '#d97724';
        ctx.beginPath();
        ctx.moveTo(42, 48);
        ctx.quadraticCurveTo(64, 36, 86, 48);
        ctx.lineTo(88, 76);
        ctx.lineTo(76, 96);
        ctx.lineTo(52, 96);
        ctx.lineTo(40, 76);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(46, 52);
        ctx.lineTo(82, 52);
        ctx.lineTo(80, 76);
        ctx.lineTo(64, 92);
        ctx.lineTo(48, 76);
        ctx.closePath();
        ctx.fill();

        // Грозные горящие янтарно-алые глаза
        ctx.fillStyle = '#1c1008';
        ctx.beginPath(); ctx.ellipse(51, 58, 5.5, 3, 0.15, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(77, 58, 5.5, 3, -0.15, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#facc15';
        ctx.beginPath(); ctx.arc(51.5, 58, 2.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76.5, 58, 2.4, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(51.5, 58, 1.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76.5, 58, 1.1, 0, Math.PI * 2); ctx.fill();

        // Нависшие складки надбровных дуг
        ctx.strokeStyle = '#3b1c0e';
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(43, 52); ctx.lineTo(58, 57);
        ctx.moveTo(85, 52); ctx.lineTo(70, 57);
        ctx.stroke();

        // Приплюснутый хищный нос
        ctx.fillStyle = '#9a3412';
        ctx.beginPath();
        ctx.moveTo(64, 58);
        ctx.lineTo(70, 69);
        ctx.lineTo(58, 69);
        ctx.closePath();
        ctx.fill();

        // Широко оскаленная пасть со множеством острых зубов
        ctx.fillStyle = '#290a0d';
        ctx.beginPath();
        ctx.moveTo(46, 75);
        ctx.quadraticCurveTo(64, 71, 82, 75);
        ctx.lineTo(78, 91);
        ctx.quadraticCurveTo(64, 96, 50, 91);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        [49, 55, 61.5, 68, 74].forEach((zx, idx) => {
            const len = (idx === 0 || idx === 4) ? 7 : 4.5;
            ctx.beginPath();
            ctx.moveTo(zx, 75);
            ctx.lineTo(zx + 2.5, 75 + len);
            ctx.lineTo(zx + 5, 75);
            ctx.closePath();
            ctx.fill();
        });
        [51, 57, 62, 67, 72.5].forEach((zx, idx) => {
            const len = (idx === 0 || idx === 4) ? 6.5 : 4;
            ctx.beginPath();
            ctx.moveTo(zx, 91);
            ctx.lineTo(zx + 2.2, 91 - len);
            ctx.lineTo(zx + 4.4, 91);
            ctx.closePath();
            ctx.fill();
        });

        // 5. МОЩНЫЕ ПЕРЕДНИЕ ЛЬВИНЫЕ ЛАПЫ С КОГТЯМИ НА ПЕРЕДНЕМ ПЛАНЕ
        const drawFrontPaw = (isRight) => {
            ctx.save();
            if (isRight) {
                ctx.translate(size, 0);
                ctx.scale(-1, 1);
            }

            ctx.fillStyle = '#d97724';
            ctx.strokeStyle = '#3b1c0e';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(12, 128);
            ctx.quadraticCurveTo(10, 104, 24, 102);
            ctx.quadraticCurveTo(42, 102, 44, 124);
            ctx.lineTo(42, 128);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.ellipse(22, 118, 4.5, 7, 0, 0, Math.PI * 2);
            ctx.ellipse(30, 119, 4.5, 7.5, 0, 0, Math.PI * 2);
            ctx.ellipse(38, 118, 4.5, 7, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#f8fafc';
            ctx.strokeStyle = '#1c1008';
            ctx.lineWidth = 1.1;
            [22, 30, 38].forEach((cx) => {
                ctx.beginPath();
                ctx.moveTo(cx - 2, 122);
                ctx.lineTo(cx, 128);
                ctx.lineTo(cx + 2.5, 122);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            });

            ctx.restore();
        };

        drawFrontPaw(false);
        drawFrontPaw(true);

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 30);
        ctx.bezierCurveTo(24, 34, 14, 84, 12, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },




    ambush_spider() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. МАССИВНЫЕ ДРЕВЕСНО-ХИТИНОВЫЕ ЛАПЫ ПАУКА (8 суставчатых лап по бокам)
        ctx.lineCap = 'round';
        ctx.lineJoin = 'miter';

        // Левые лапы
        ctx.strokeStyle = '#3b2d22';
        ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(42, 62); ctx.lineTo(14, 38); ctx.lineTo(6, 74); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(38, 74); ctx.lineTo(8, 66); ctx.lineTo(8, 104); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(40, 86); ctx.lineTo(12, 92); ctx.lineTo(20, 124); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(46, 96); ctx.lineTo(26, 108); ctx.lineTo(34, 128); ctx.stroke();

        // Правые лапы (чуть светлее для flat-объёма)
        ctx.strokeStyle = '#4e3b2c';
        ctx.beginPath(); ctx.moveTo(86, 62); ctx.lineTo(114, 38); ctx.lineTo(122, 74); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(90, 74); ctx.lineTo(120, 66); ctx.lineTo(120, 104); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(88, 86); ctx.lineTo(116, 92); ctx.lineTo(108, 124); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(82, 96); ctx.lineTo(102, 108); ctx.lineTo(94, 128); ctx.stroke();

        // Пучки зелёного мха на суставах лап для маскировки
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath(); ctx.arc(14, 38, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(114, 38, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#27ae60';
        ctx.beginPath(); ctx.arc(8, 66, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(120, 66, 4, 0, Math.PI * 2); ctx.fill();

        // 2. ОГРОМНОЕ БРЮШКО-ПАНЦИРЬ НА ЗАДНЕМ ПЛАНЕ (Покрыто кустами и листьями)
        ctx.fillStyle = '#36281e';
        ctx.beginPath();
        ctx.ellipse(64, 52, 34, 28, 0, 0, Math.PI * 2);
        ctx.fill();

        // 3. ГУСТЫЕ КУСТЫ, ПАПОРОТНИК И МОХ НА СПИНЕ ПАУКА
        // Тёмно-изумрудная основа кустарника
        ctx.fillStyle = '#1e5631';
        ctx.beginPath(); ctx.arc(42, 36, 15, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(86, 36, 15, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(64, 26, 18, 0, Math.PI * 2); ctx.fill();

        // Яркая листва и крона кустов сверху
        ctx.fillStyle = '#2d8a4e';
        ctx.beginPath(); ctx.arc(48, 30, 11, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(80, 30, 11, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(64, 20, 13, 0, Math.PI * 2); ctx.fill();

        // Острые листья папоротника, торчащие в стороны из кустов
        ctx.fillStyle = '#4cd137';
        ctx.beginPath(); ctx.moveTo(34, 32); ctx.lineTo(14, 22); ctx.lineTo(30, 42); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(94, 32); ctx.lineTo(114, 22); ctx.lineTo(98, 42); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(60, 16); ctx.lineTo(64, 4); ctx.lineTo(68, 16); ctx.closePath(); ctx.fill();

        // Несколько лесных ягод в кустах (маскировка-приманка)
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath(); ctx.arc(44, 28, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(82, 26, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(66, 18, 2.2, 0, Math.PI * 2); ctx.fill();

        // 4. МАССИВНАЯ ГОЛОВОГРУДЬ ПАУКА-ЛЮДОЕДА (Спереди снизу)
        ctx.fillStyle = '#4a3728';
        ctx.beginPath();
        ctx.ellipse(64, 80, 26, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        // Костяные наросты-щитки на лбу
        ctx.fillStyle = '#2c2017';
        ctx.beginPath();
        ctx.moveTo(46, 68);
        ctx.quadraticCurveTo(64, 62, 82, 68);
        ctx.lineTo(78, 74);
        ctx.quadraticCurveTo(64, 69, 50, 74);
        ctx.closePath();
        ctx.fill();

        // 5. ВОСЕМЬ ГОРЯЩИХ ЯНТАРНО-ОРАНЖЕВЫХ ГЛАЗ
        ctx.fillStyle = '#ff9f1a';
        // Два огромных главных глаза
        ctx.beginPath(); ctx.arc(56, 78, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(72, 78, 4.5, 0, Math.PI * 2); ctx.fill();
        // Боковые глаза
        ctx.beginPath(); ctx.arc(46, 76, 2.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(82, 76, 2.6, 0, Math.PI * 2); ctx.fill();
        // Верхний ряд мелких глаз
        ctx.beginPath(); ctx.arc(52, 70, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(60, 69, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(68, 69, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 70, 1.8, 0, Math.PI * 2); ctx.fill();

        // Хищные блики в главных глазах
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(57.5, 76.5, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(70.5, 76.5, 1.3, 0, Math.PI * 2); ctx.fill();

        // 6. ТЯЖЁЛЫЕ ХЕЛИЦЕРЫ И ОГРОМНЫЕ КЛЫКИ-ЖВАЛА
        ctx.fillStyle = '#241a12';
        ctx.beginPath(); ctx.moveTo(46, 88); ctx.lineTo(58, 106); ctx.lineTo(50, 108); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(82, 88); ctx.lineTo(70, 106); ctx.lineTo(78, 108); ctx.closePath(); ctx.fill();

        // Изогнутые костяные клыки с каплями яда
        ctx.fillStyle = '#f5f0dc';
        ctx.beginPath(); ctx.moveTo(51, 102); ctx.quadraticCurveTo(56, 118, 61, 114); ctx.lineTo(57, 102); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(77, 102); ctx.quadraticCurveTo(72, 118, 67, 114); ctx.lineTo(71, 102); ctx.closePath(); ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.moveTo(64, 4);
        ctx.lineTo(14, 22);
        ctx.lineTo(6, 74);
        ctx.lineTo(20, 124);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

black_roc() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАДНИЙ ПЛАН: Исполинские расправленные крылья птицы-рух
        ctx.fillStyle = '#14171f';
        // Левое крыло с маховыми перьями
        ctx.beginPath();
        ctx.moveTo(46, 74);
        ctx.lineTo(4, 24);
        ctx.lineTo(14, 48);
        ctx.lineTo(4, 54);
        ctx.lineTo(18, 72);
        ctx.lineTo(10, 82);
        ctx.lineTo(44, 98);
        ctx.closePath();
        ctx.fill();

        // Правое крыло с маховыми перьями
        ctx.beginPath();
        ctx.moveTo(82, 74);
        ctx.lineTo(124, 24);
        ctx.lineTo(114, 48);
        ctx.lineTo(124, 54);
        ctx.lineTo(110, 72);
        ctx.lineTo(118, 82);
        ctx.lineTo(84, 98);
        ctx.closePath();
        ctx.fill();

        // Графитовые прожилки-перья на крыльях
        ctx.strokeStyle = '#2c3342';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(42, 76); ctx.lineTo(12, 34);
        ctx.moveTo(42, 82); ctx.lineTo(14, 58);
        ctx.moveTo(86, 76); ctx.lineTo(116, 34);
        ctx.moveTo(86, 82); ctx.lineTo(114, 58);
        ctx.stroke();

        // 2. МОЩНАЯ ПЕРНАТАЯ ГРУДЬ И ШЕЯ (Внизу по центру)
        ctx.fillStyle = '#1b1f29';
        ctx.beginPath();
        ctx.moveTo(28, 128);
        ctx.lineTo(40, 86);
        ctx.lineTo(88, 86);
        ctx.lineTo(100, 128);
        ctx.closePath();
        ctx.fill();

        // Ярусные перья на груди (flat-текстура оперения)
        ctx.fillStyle = '#282e3d';
        ctx.beginPath();
        ctx.moveTo(44, 98); ctx.lineTo(54, 110); ctx.lineTo(64, 98); ctx.lineTo(74, 110); ctx.lineTo(84, 98);
        ctx.lineTo(78, 118); ctx.lineTo(64, 108); ctx.lineTo(50, 118);
        ctx.closePath();
        ctx.fill();

        // 3. ГОЛОВА И ПЕРЬЕВОЙ ХОХОЛОК-КОРОНА ПТИЦЫ-РУХ
        ctx.fillStyle = '#11141c';
        ctx.beginPath();
        ctx.moveTo(44, 46);
        ctx.lineTo(50, 26); // Левое перо-гребень
        ctx.lineTo(58, 36);
        ctx.lineTo(64, 20); // Центральный перьевой пик
        ctx.lineTo(70, 36);
        ctx.lineTo(78, 26); // Правое перо-гребень
        ctx.lineTo(84, 46);
        ctx.lineTo(88, 70);
        ctx.lineTo(64, 88);
        ctx.lineTo(40, 70);
        ctx.closePath();
        ctx.fill();

        // Световой графитовый контур на голове
        ctx.fillStyle = '#232836';
        ctx.beginPath();
        ctx.moveTo(64, 20);
        ctx.lineTo(70, 36);
        ctx.lineTo(78, 26);
        ctx.lineTo(84, 46);
        ctx.lineTo(88, 70);
        ctx.lineTo(64, 88);
        ctx.closePath();
        ctx.fill();

        // 4. ГРОЗНЫЕ НАДБРОВНЫЕ ДУГИ И ПЫЛАЮЩИЕ ЯНТАРНЫЕ ГЛАЗА
        // Светящиеся золотисто-огненные глаза орла-гиганта
        ctx.fillStyle = '#ff9f1a';
        ctx.beginPath(); ctx.ellipse(51, 56, 5.5, 2.8, 0.25, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(77, 56, 5.5, 2.8, -0.25, 0, Math.PI * 2); ctx.fill();

        // Чёрные зрачки и блики
        ctx.fillStyle = '#0a0a0a';
        ctx.beginPath(); ctx.arc(52, 56, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 56, 1.8, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(53, 55, 0.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 55, 0.9, 0, Math.PI * 2); ctx.fill();

        // Нахмуренные орлиные брови из перьев
        ctx.strokeStyle = '#4b5563';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(42, 48); ctx.lineTo(58, 55);
        ctx.moveTo(86, 48); ctx.lineTo(70, 55);
        ctx.stroke();

        // 5. МАССИВНЫЙ КРЮЧКОВАТЫЙ КЛЮВ (Золотисто-костяной)
        // Восковица (основание клюва)
        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.moveTo(54, 62);
        ctx.quadraticCurveTo(64, 57, 74, 62);
        ctx.lineTo(71, 69);
        ctx.lineTo(57, 69);
        ctx.closePath();
        ctx.fill();

        // Нижняя челюсть клюва
        ctx.fillStyle = '#8c7853';
        ctx.beginPath();
        ctx.moveTo(57, 75);
        ctx.lineTo(71, 75);
        ctx.lineTo(64, 84);
        ctx.closePath();
        ctx.fill();

        // Острый загнутый вниз хищный крюк клюва
        ctx.fillStyle = '#e5dcc5';
        ctx.beginPath();
        ctx.moveTo(55, 65);
        ctx.lineTo(73, 65);
        ctx.lineTo(71, 78);
        ctx.lineTo(64, 88); // Острый загнутый вниз кончик клюва
        ctx.lineTo(57, 78);
        ctx.closePath();
        ctx.fill();

        // Тёмная полость приоткрытого клюва по краям
        ctx.strokeStyle = '#11141c';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(56, 74); ctx.lineTo(64, 78); ctx.lineTo(72, 74);
        ctx.stroke();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        ctx.beginPath();
        ctx.moveTo(64, 20);
        ctx.lineTo(44, 46);
        ctx.lineTo(4, 24);
        ctx.lineTo(10, 82);
        ctx.lineTo(28, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

cyclops_skeleton() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАДНИЙ ПЛАН: Костяные плечи, позвоночник и рваные лохмотья
        ctx.fillStyle = '#cfc9b8';
        ctx.fillRect(54, 92, 20, 36); // Мощный позвоночник великана

        // Костяные ключицы и рёбра под лохмотьями
        ctx.strokeStyle = '#e5e0d0';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(64, 102); ctx.quadraticCurveTo(36, 96, 18, 114);
        ctx.moveTo(64, 102); ctx.quadraticCurveTo(92, 96, 110, 114);
        ctx.stroke();

        // Рваные тёмно-бурые лохмотья на плечах (с рваными краями)
        ctx.fillStyle = '#2b241f';
        ctx.beginPath();
        ctx.moveTo(12, 128);
        ctx.lineTo(24, 96);
        ctx.lineTo(44, 102);
        ctx.lineTo(50, 118);
        ctx.lineTo(42, 128);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(116, 128);
        ctx.lineTo(104, 96);
        ctx.lineTo(84, 102);
        ctx.lineTo(78, 118);
        ctx.lineTo(86, 128);
        ctx.closePath();
        ctx.fill();

        // Свисающие рваные лоскуты ткани по бокам
        ctx.fillStyle = '#3d332c';
        ctx.beginPath();
        ctx.moveTo(22, 104); ctx.lineTo(14, 124); ctx.lineTo(28, 118); ctx.lineTo(32, 128); ctx.lineTo(40, 108);
        ctx.moveTo(106, 104); ctx.lineTo(114, 124); ctx.lineTo(100, 118); ctx.lineTo(96, 128); ctx.lineTo(88, 108);
        ctx.fill();

        // 2. МАССИВНЫЙ ЧЕРЕП ЦИКЛОПА (Широкие скулы и тяжёлая челюсть)
        ctx.fillStyle = '#e8e4d5';
        ctx.beginPath();
        ctx.moveTo(40, 50);
        ctx.quadraticCurveTo(40, 26, 64, 26); // Купол черепа
        ctx.quadraticCurveTo(88, 26, 88, 50);
        ctx.lineTo(93, 68); // Массивная правая скула
        ctx.lineTo(82, 79);
        ctx.lineTo(79, 96); // Правый угол нижней челюсти
        ctx.lineTo(49, 96); // Левый угол нижней челюсти
        ctx.lineTo(46, 79);
        ctx.lineTo(35, 68); // Массивная левая скула
        ctx.closePath();
        ctx.fill();

        // Височные впадины и трещина на черепе
        ctx.fillStyle = '#c9c3b0';
        ctx.beginPath(); ctx.ellipse(42, 54, 4, 9, 0.15, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(86, 54, 4, 9, -0.15, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#5c5649';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(78, 32); ctx.lineTo(74, 42); ctx.lineTo(79, 48);
        ctx.stroke();

        // 3. ОДНА ОГРОМНАЯ ЦЕНТРАЛЬНАЯ ГЛАЗНИЦА ЦИКЛОПА
        ctx.fillStyle = '#141118';
        ctx.beginPath();
        ctx.ellipse(64, 58, 13, 10.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Грозная костяная надбровная дуга над единственной глазницей
        ctx.strokeStyle = '#b8b19c';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(48, 49);
        ctx.quadraticCurveTo(64, 43, 80, 49);
        ctx.stroke();

        // Тлеющий багрово-оранжевый огонёк нежити в центре глазницы
        ctx.fillStyle = 'rgba(255, 87, 34, 0.35)';
        ctx.beginPath(); ctx.arc(64, 58, 7.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ff5722';
        ctx.beginPath(); ctx.arc(64, 58, 4.2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffd875';
        ctx.beginPath(); ctx.arc(64, 58, 1.8, 0, Math.PI * 2); ctx.fill();

        // 4. КРУПНЫЙ РЕБРИСТЫЙ РОГ НА ЛБУ (Над глазницей)
        ctx.fillStyle = '#d6ceb8';
        ctx.strokeStyle = '#5c5649';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(54, 42);
        ctx.quadraticCurveTo(56, 18, 64, 6); // Остриё рога вверх
        ctx.quadraticCurveTo(72, 18, 74, 42);
        ctx.quadraticCurveTo(64, 45, 54, 42);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Поперечные рёбра-насечки на роге
        ctx.strokeStyle = '#7a7261';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(56, 35); ctx.quadraticCurveTo(64, 38, 72, 35);
        ctx.moveTo(58, 28); ctx.quadraticCurveTo(64, 31, 70, 28);
        ctx.moveTo(60, 21); ctx.quadraticCurveTo(64, 23, 68, 21);
        ctx.moveTo(62, 14); ctx.quadraticCurveTo(64, 16, 66, 14);
        ctx.stroke();

        // 5. НОСОВОЙ ПРОВАЛ И МАССИВНЫЕ ЧЕЛЮСТИ С КРУПНЫМИ ЗУБАМИ
        ctx.fillStyle = '#141118';
        ctx.beginPath();
        ctx.moveTo(64, 70);
        ctx.lineTo(68, 77);
        ctx.lineTo(64, 75);
        ctx.lineTo(60, 77);
        ctx.closePath();
        ctx.fill();

        // Щель челюсти и крупные зубы великана
        ctx.fillStyle = '#24201c';
        ctx.fillRect(50, 83, 28, 7);

        ctx.fillStyle = '#f5f2e6';
        for (let x = 51; x <= 74; x += 4.5) {
            ctx.fillRect(x, 81, 3.4, 4.5);   // Верхний зуб
            ctx.fillRect(x, 87, 3.4, 4.5);   // Нижний зуб
        }

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 6);
        ctx.quadraticCurveTo(56, 18, 54, 42);
        ctx.lineTo(40, 50);
        ctx.lineTo(35, 68);
        ctx.lineTo(49, 96);
        ctx.lineTo(12, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

grey_mammoth() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАДНИЙ ПЛАН: Огромный мохнатый горб и широкие плечи мамонта
        ctx.fillStyle = '#3b4048'; // Тёмно-серый густой подшёрсток
        ctx.beginPath();
        ctx.moveTo(10, 128);
        ctx.quadraticCurveTo(18, 68, 64, 58);
        ctx.quadraticCurveTo(110, 68, 118, 128);
        ctx.closePath();
        ctx.fill();

        // Клочья густой шерсти по краям плеч
        ctx.fillStyle = '#4f5661';
        ctx.beginPath();
        ctx.moveTo(18, 96); ctx.lineTo(8, 108); ctx.lineTo(22, 112);
        ctx.moveTo(110, 96); ctx.lineTo(120, 108); ctx.lineTo(106, 112);
        ctx.fill();

        // 2. НЕБОЛЬШИЕ МОХНАТЫЕ УШИ (Прижаты по бокам головы)
        ctx.fillStyle = '#474d57';
        ctx.beginPath(); ctx.ellipse(32, 58, 9, 15, -0.25, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(96, 58, 9, 15, 0.25, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#2d3138'; // Внутренняя тень ушей
        ctx.beginPath(); ctx.ellipse(34, 59, 5, 10, -0.25, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(94, 59, 5, 10, 0.25, 0, Math.PI * 2); ctx.fill();

        // 3. ВЫСОКИЙ ЛОБ-КУПОЛ И ГОЛОВА МАМОНТА
        ctx.fillStyle = '#5c6370'; // Основной пепельно-серый мех
        ctx.beginPath();
        ctx.moveTo(38, 52);
        ctx.bezierCurveTo(36, 18, 92, 18, 90, 52); // Высокий характерный купол мамонта
        ctx.lineTo(94, 78);
        ctx.lineTo(78, 94);
        ctx.lineTo(50, 94);
        ctx.lineTo(34, 78);
        ctx.closePath();
        ctx.fill();

        // Лохматая чёлка-хохолок на вершине купола
        ctx.fillStyle = '#747d8c';
        ctx.beginPath();
        ctx.moveTo(52, 24);
        ctx.lineTo(58, 14);
        ctx.lineTo(64, 21);
        ctx.lineTo(70, 13);
        ctx.lineTo(76, 24);
        ctx.closePath();
        ctx.fill();

        // 4. ГЛАЗА И ГУСТЫЕ МОХНАТЫЕ НАДБРОВНЫЕ ДУГИ
        ctx.fillStyle = '#f5f6fa';
        ctx.beginPath(); ctx.ellipse(45, 58, 4.8, 2.6, 0.15, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(83, 58, 4.8, 2.6, -0.15, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#2f3542'; // Тёмные зрачки
        ctx.beginPath(); ctx.arc(46, 58, 1.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(82, 58, 1.9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff'; // Блики
        ctx.beginPath(); ctx.arc(46.8, 57.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(81.2, 57.2, 0.7, 0, Math.PI * 2); ctx.fill();

        // Тяжёлые мохнатые брови
        ctx.strokeStyle = '#2f3542';
        ctx.lineWidth = 2.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(37, 51); ctx.quadraticCurveTo(46, 53, 53, 57);
        ctx.moveTo(91, 51); ctx.quadraticCurveTo(82, 53, 75, 57);
        ctx.stroke();

        // 5. МАССИВНЫЙ МОХНАТЫЙ ХОБОТ (Спускается по центру с загибом вбок)
        ctx.fillStyle = '#6c7582';
        ctx.beginPath();
        ctx.moveTo(52, 64);
        ctx.lineTo(76, 64);
        ctx.bezierCurveTo(78, 92, 74, 114, 86, 118); // Изогнутый кончик хобота вправо
        ctx.quadraticCurveTo(92, 124, 82, 126);
        ctx.bezierCurveTo(60, 126, 52, 98, 52, 64);
        ctx.closePath();
        ctx.fill();

        // Поперечные складки на хоботе
        ctx.strokeStyle = '#3b4048';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(55, 76); ctx.quadraticCurveTo(64, 79, 73, 76);
        ctx.moveTo(56, 88); ctx.quadraticCurveTo(64, 91, 72, 88);
        ctx.moveTo(58, 100); ctx.quadraticCurveTo(65, 103, 73, 100);
        ctx.moveTo(63, 112); ctx.quadraticCurveTo(70, 114, 77, 111);
        ctx.stroke();

        // 6. ОГРОМНЫЕ ИЗОГНУТЫЕ КОСТЯНЫЕ БИВНИ (На переднем плане по бокам от хобота)
        ctx.fillStyle = '#f5f0dc';
        ctx.strokeStyle = '#4a4335';
        ctx.lineWidth = 1.4;

        // Левый бивень (выходит из-под щеки вниз и загибается дугой вверх-наружу)
        ctx.beginPath();
        ctx.moveTo(46, 78);
        ctx.bezierCurveTo(22, 84, 6, 66, 12, 36);
        ctx.bezierCurveTo(18, 60, 32, 72, 50, 70);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Правый бивень
        ctx.beginPath();
        ctx.moveTo(82, 78);
        ctx.bezierCurveTo(106, 84, 122, 66, 116, 36);
        ctx.bezierCurveTo(110, 60, 96, 72, 78, 70);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 18);
        ctx.bezierCurveTo(44, 20, 38, 38, 38, 52);
        ctx.lineTo(34, 78);
        ctx.lineTo(50, 94);
        ctx.lineTo(64, 126);
        ctx.lineTo(10, 128);
        ctx.quadraticCurveTo(18, 68, 64, 58);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

death_knight() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ДВУРУЧНЫЙ РУНИЧЕСКИЙ МЕЧ ЗА ПРАВЫМ ПЛЕЧОМ (По диагонали вверх)
        ctx.save();
        ctx.translate(98, 66);
        ctx.rotate((Math.PI / 180) * 24);
        ctx.translate(-98, -66);

        ctx.fillStyle = '#7f8c8d';
        ctx.beginPath();
        ctx.moveTo(93, 14);
        ctx.lineTo(98, 2);
        ctx.lineTo(103, 14);
        ctx.lineTo(103, 96);
        ctx.lineTo(93, 96);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#bdc3c7';
        ctx.fillRect(98, 14, 5, 82);
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(97, 26, 2, 46);

        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.moveTo(84, 94);
        ctx.quadraticCurveTo(98, 100, 112, 94);
        ctx.lineTo(110, 100);
        ctx.quadraticCurveTo(98, 104, 86, 100);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 2. МАССИВНЫЕ ШИПАСТЫЕ ЛАТНЫЕ НАПЛЕЧНИКИ ПОЛКОВОДЦА
        ctx.fillStyle = '#1e222b';
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.lineTo(32, 92);
        ctx.lineTo(96, 92);
        ctx.lineTo(114, 128);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(32, 92); ctx.lineTo(96, 92);
        ctx.stroke();

        ctx.fillStyle = '#57606f';
        ctx.beginPath(); ctx.moveTo(26, 98); ctx.lineTo(10, 82); ctx.lineTo(34, 92); ctx.fill();
        ctx.beginPath(); ctx.moveTo(102, 98); ctx.lineTo(118, 82); ctx.lineTo(94, 92); ctx.fill();

        // 3. ЗЛОВЕЩИЙ ЧЕРЕП ЛОРДА-НЕЖИТИ (Внутри Т-образного выреза шлема)
        ctx.fillStyle = '#e5e0d0';
        ctx.beginPath();
        ctx.moveTo(42, 48);
        ctx.lineTo(86, 48);
        ctx.lineTo(85, 84);
        ctx.lineTo(64, 98);
        ctx.lineTo(43, 84);
        ctx.closePath();
        ctx.fill();

        // Глубокие глазницы и пылающий багровый огонь
        ctx.fillStyle = '#0f0c14';
        ctx.beginPath(); ctx.ellipse(52, 60, 7, 5, -0.15, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(76, 60, 7, 5, 0.15, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ff2a2a';
        ctx.beginPath(); ctx.arc(52, 60, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 60, 3, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffd875';
        ctx.beginPath(); ctx.arc(52, 60, 1.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 60, 1.2, 0, Math.PI * 2); ctx.fill();

        // Носовой провал и оскал костяных челюстей в вертикальной прорези буквы Т
        ctx.fillStyle = '#0f0c14';
        ctx.beginPath();
        ctx.moveTo(64, 66); ctx.lineTo(67, 74); ctx.lineTo(64, 72); ctx.lineTo(61, 74);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#1f1b18';
        ctx.fillRect(55, 80, 18, 7);

        ctx.fillStyle = '#f5f2e6';
        for (let x = 56; x <= 70; x += 3.5) {
            ctx.fillRect(x, 78, 2.5, 4);
            ctx.fillRect(x, 84.5, 2.5, 4);
        }

        // 4. ТЯЖЁЛЫЙ РОГАТЫЙ ШЛЕМ С Т-ОБРАЗНЫМ ВЫРЕЗОМ (БАРБЮТ)
        // Боевые рога шлема
        ctx.fillStyle = '#4b5563';
        ctx.beginPath();
        ctx.moveTo(40, 44);
        ctx.bezierCurveTo(16, 36, 12, 14, 28, 6);
        ctx.bezierCurveTo(24, 18, 30, 30, 46, 36);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(88, 44);
        ctx.bezierCurveTo(112, 36, 116, 14, 100, 6);
        ctx.bezierCurveTo(104, 18, 98, 30, 82, 36);
        ctx.closePath();
        ctx.fill();

        // Корпус шлема с нащёчниками, оставляющий открытой букву «Т» (глаза + вертикаль носа/рта)
        ctx.fillStyle = '#2c3340';
        ctx.beginPath();
        ctx.moveTo(38, 52);
        ctx.quadraticCurveTo(42, 18, 64, 16); // Купол шлема
        ctx.quadraticCurveTo(86, 18, 90, 52);
        ctx.lineTo(88, 86); // Правый нижний край нащёчника
        ctx.lineTo(72, 96); // Правый внутренний край вертикальной прорези Т
        ctx.lineTo(72, 65); // Правый угол горизонтальной прорези глаз
        ctx.lineTo(84, 65); // Правый край прорези глаз
        ctx.lineTo(84, 54); // Верхний правый угол прорези глаз
        ctx.lineTo(64, 56); // Переносица над вырезом
        ctx.lineTo(44, 54); // Верхний левый угол прорези глаз
        ctx.lineTo(44, 65); // Левый край прорези глаз
        ctx.lineTo(56, 65); // Левый угол горизонтальной прорези глаз
        ctx.lineTo(56, 96); // Левый внутренний край вертикальной прорези Т
        ctx.lineTo(40, 86); // Левый нижний край нащёчника
        ctx.closePath();
        ctx.fill();

        // Золотая окантовка Т-образного выреза и центральное ребро на лбу шлема
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(56, 96);
        ctx.lineTo(56, 65);
        ctx.lineTo(44, 65);
        ctx.lineTo(44, 54);
        ctx.lineTo(64, 56);
        ctx.lineTo(84, 54);
        ctx.lineTo(84, 65);
        ctx.lineTo(72, 65);
        ctx.lineTo(72, 96);
        ctx.stroke();

        // Центральный гребень-ребро на лбу шлема
        ctx.strokeStyle = '#57606f';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(64, 16);
        ctx.lineTo(64, 56);
        ctx.stroke();

        // 5. ТЯЖЁЛЫЙ ГЕРАЛЬДИЧЕСКИЙ ЩИТ НА ПЕРЕДНЕМ ПЛАНЕ (Слева снизу)
        ctx.fillStyle = '#181c24';
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(14, 86);
        ctx.lineTo(46, 86);
        ctx.lineTo(44, 112);
        ctx.lineTo(30, 126);
        ctx.lineTo(16, 112);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#962d2d';
        ctx.fillRect(28, 88, 4, 34);
        ctx.fillRect(17, 101, 26, 4);

        ctx.fillStyle = '#ffd875';
        ctx.beginPath(); ctx.arc(30, 103, 4, 0, Math.PI * 2); ctx.fill();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 16);
        ctx.quadraticCurveTo(42, 18, 38, 52);
        ctx.lineTo(40, 86);
        ctx.lineTo(56, 96);
        ctx.lineTo(64, 98);
        ctx.lineTo(64, 128);
        ctx.lineTo(14, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },


    lizardfolk() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ПЛЕМЕННОЕ КОПЬЁ-ГАРПУН С ПЕРЬЯМИ ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.save();
        ctx.translate(106, 54);
        ctx.rotate((Math.PI / 180) * 26);

        ctx.strokeStyle = '#5c3a21';
        ctx.lineWidth = 4.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, -14);
        ctx.lineTo(0, 90);
        ctx.stroke();

        ctx.fillStyle = '#dc2626';
        ctx.beginPath(); ctx.ellipse(-7, -10, 6, 2.4, -0.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.ellipse(7, -8, 6, 2.4, 0.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#e2e8f0';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(0, -38);
        ctx.lineTo(8, -22);
        ctx.lineTo(4, -24);
        ctx.lineTo(7, -14);
        ctx.lineTo(-7, -14);
        ctx.lineTo(-4, -24);
        ctx.lineTo(-8, -22);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 2. ВЫСОКИЙ, ЯРКИЙ ПАРУСОВИДНЫЙ ГРЕБЕНЬ ОТ ЛБА ДО ПЛЕЧ (Хорошо виден на тёмном фоне)
        // Яркая салатово-янтарная перепонка гребня с фестончатым краем
        ctx.fillStyle = '#84cc16';
        ctx.strokeStyle = '#1a2e05';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(54, 36);
        ctx.lineTo(66, 10);  // Первый высокий шип на макушке
        ctx.quadraticCurveTo(75, 18, 84, 12); // Второй высокий шип
        ctx.quadraticCurveTo(92, 22, 102, 20); // Третий шип затылка
        ctx.quadraticCurveTo(106, 32, 114, 34); // Четвёртый шип шеи
        ctx.quadraticCurveTo(114, 48, 120, 54); // Нижний шип у плеча
        ctx.lineTo(94, 84);
        ctx.lineTo(62, 42);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Охристо-золотая внутренняя полоса на перепонке гребня для контраста
        ctx.fillStyle = '#bef264';
        ctx.beginPath();
        ctx.moveTo(60, 36);
        ctx.lineTo(67, 15);
        ctx.lineTo(83, 17);
        ctx.lineTo(100, 25);
        ctx.lineTo(112, 48);
        ctx.lineTo(88, 68);
        ctx.closePath();
        ctx.fill();

        // Тёмные костяные лучи-шипы, пронизывающие гребень
        ctx.strokeStyle = '#1e3f20';
        ctx.lineWidth = 2.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(62, 36); ctx.lineTo(66, 10);
        ctx.moveTo(74, 40); ctx.lineTo(84, 12);
        ctx.moveTo(82, 48); ctx.lineTo(102, 20);
        ctx.moveTo(88, 58); ctx.lineTo(114, 34);
        ctx.moveTo(92, 70); ctx.lineTo(120, 54);
        ctx.stroke();

        // 3. МОЩНАЯ ЧЕШУЙЧАТАЯ ШЕЯ, ГРУДНЫЕ ПЛАСТИНЫ И КОЖАНАЯ ПОРТУПЕЯ
        ctx.fillStyle = '#2d5a27';
        ctx.beginPath();
        ctx.moveTo(66, 74);
        ctx.quadraticCurveTo(96, 78, 114, 128);
        ctx.lineTo(32, 128);
        ctx.quadraticCurveTo(42, 98, 52, 82);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#84a955';
        ctx.beginPath();
        ctx.moveTo(50, 84);
        ctx.quadraticCurveTo(42, 106, 40, 128);
        ctx.lineTo(72, 128);
        ctx.quadraticCurveTo(68, 104, 62, 84);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#3f6212';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(46, 98); ctx.quadraticCurveTo(56, 101, 65, 98);
        ctx.moveTo(43, 110); ctx.quadraticCurveTo(56, 113, 68, 110);
        ctx.moveTo(41, 121); ctx.quadraticCurveTo(56, 124, 70, 121);
        ctx.stroke();

        ctx.fillStyle = '#3b2416';
        ctx.beginPath();
        ctx.moveTo(82, 88);
        ctx.lineTo(48, 128);
        ctx.lineTo(66, 128);
        ctx.lineTo(96, 94);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#f5eedc';
        ctx.beginPath(); ctx.moveTo(74, 102); ctx.lineTo(68, 112); ctx.lineTo(78, 106); ctx.fill();
        ctx.beginPath(); ctx.moveTo(64, 113); ctx.lineTo(58, 123); ctx.lineTo(68, 117); ctx.fill();

        // 4. МАССИВНАЯ ВЕРХНЯЯ ЧЕЛЮСТЬ И ЧЕРЕП ЛЮДОЯЩЕРА В ПОЛУОБОРОТ ВЛЕВО
        ctx.fillStyle = '#3f7d32';
        ctx.beginPath();
        ctx.moveTo(88, 46);
        ctx.lineTo(64, 32);
        ctx.lineTo(14, 48);
        ctx.lineTo(18, 61);
        ctx.lineTo(58, 70);
        ctx.lineTo(86, 72);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#65a30d';
        ctx.beginPath();
        ctx.moveTo(18, 49);
        ctx.lineTo(52, 39);
        ctx.lineTo(48, 45);
        ctx.lineTo(20, 54);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#143312';
        ctx.beginPath(); ctx.arc(21, 50, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(80, 58, 3, 0, Math.PI * 2); ctx.fill();

        // 5. ОСКАЛЕННАЯ ПАСТЬ, РАЗДВОЕННЫЙ ЯЗЫК И ОСТРЫЕ КЛЫКИ
        ctx.fillStyle = '#290d12';
        ctx.beginPath();
        ctx.moveTo(18, 60);
        ctx.lineTo(60, 70);
        ctx.lineTo(24, 86);
        ctx.lineTo(21, 79);
        ctx.lineTo(46, 70);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#e11d48';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(46, 73);
        ctx.lineTo(24, 75);
        ctx.lineTo(17, 72);
        ctx.moveTo(24, 75);
        ctx.lineTo(18, 79);
        ctx.stroke();

        ctx.fillStyle = '#4d8c3b';
        ctx.beginPath();
        ctx.moveTo(58, 69);
        ctx.lineTo(21, 80);
        ctx.lineTo(27, 89);
        ctx.lineTo(66, 86);
        ctx.lineTo(86, 72);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.moveTo(20, 60); ctx.lineTo(23, 68); ctx.lineTo(26, 61); ctx.fill();
        ctx.beginPath(); ctx.moveTo(29, 62); ctx.lineTo(32, 69); ctx.lineTo(35, 63); ctx.fill();
        ctx.beginPath(); ctx.moveTo(38, 64); ctx.lineTo(41, 70); ctx.lineTo(44, 65); ctx.fill();
        ctx.beginPath(); ctx.moveTo(47, 66); ctx.lineTo(50, 71); ctx.lineTo(53, 67); ctx.fill();

        ctx.beginPath(); ctx.moveTo(23, 80); ctx.lineTo(26, 73); ctx.lineTo(29, 78); ctx.fill();
        ctx.beginPath(); ctx.moveTo(32, 78); ctx.lineTo(35, 71); ctx.lineTo(38, 76); ctx.fill();
        ctx.beginPath(); ctx.moveTo(41, 75); ctx.lineTo(44, 69); ctx.lineTo(47, 73); ctx.fill();

        // 6. ХИЩНЫЙ ЯНТАРНЫЙ ГЛАЗ РЕПТИЛИИ С ВЕРТИКАЛЬНЫМ ЗРАЧКОМ
        ctx.fillStyle = '#143312';
        ctx.beginPath();
        ctx.moveTo(52, 47);
        ctx.lineTo(68, 41);
        ctx.lineTo(63, 53);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.moveTo(54, 47);
        ctx.lineTo(66, 42.5);
        ctx.lineTo(62, 51.5);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(59.5, 43.5, 1.5, 6.5);

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(58.5, 45.5, 1, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#143312';
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(49, 44);
        ctx.lineTo(69, 39);
        ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень вдоль нижней челюсти и шеи)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(21, 80);
        ctx.lineTo(66, 86);
        ctx.lineTo(86, 72);
        ctx.lineTo(114, 128);
        ctx.lineTo(32, 128);
        ctx.lineTo(52, 84);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },


    green_ooze() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ВНЕШНИЙ КОНТУР БЕСФОРМЕННОЙ МАССЫ ЖИЖИ И ПСЕВДОПОДИЙ
        ctx.fillStyle = '#1e824c'; // Глубокий изумрудно-слизистый тон
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.bezierCurveTo(10, 96, 22, 86, 16, 68); // Левая псевдоподия
        ctx.bezierCurveTo(12, 54, 28, 48, 34, 38);
        ctx.bezierCurveTo(42, 20, 56, 16, 64, 24);
        ctx.bezierCurveTo(74, 12, 92, 18, 96, 38);
        ctx.bezierCurveTo(104, 48, 118, 56, 112, 72); // Правая псевдоподия
        ctx.bezierCurveTo(106, 88, 120, 98, 114, 128);
        ctx.closePath();
        ctx.fill();

        // 2. ВНУТРЕННЕЕ КИСЛОТНО-ЯРКОЕ ЯДРО ЖИЖИ (Объём и свечение)
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath();
        ctx.moveTo(22, 128);
        ctx.bezierCurveTo(20, 98, 30, 88, 26, 70);
        ctx.bezierCurveTo(24, 56, 38, 46, 44, 34);
        ctx.bezierCurveTo(54, 24, 76, 24, 86, 36);
        ctx.bezierCurveTo(94, 48, 106, 58, 102, 74);
        ctx.bezierCurveTo(98, 90, 108, 102, 106, 128);
        ctx.closePath();
        ctx.fill();

        // 3. ЛЕТЯЩИЕ И СТЕКАЮЩИЕ КАПЛИ СЛИЗИ ВОКРУГ ТЕЛА
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath(); ctx.arc(14, 44, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(114, 42, 5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(24, 24, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(104, 22, 3.5, 0, Math.PI * 2); ctx.fill();

        // Стекающая капля справа
        ctx.beginPath();
        ctx.moveTo(108, 76);
        ctx.quadraticCurveTo(116, 92, 112, 98);
        ctx.arc(110, 98, 3, 0, Math.PI);
        ctx.closePath();
        ctx.fill();

        // 4. ВНУТРЕННИЕ ПУЗЫРЬКИ ГАЗА И ПОЛУПЕРЕВАРЕННЫЙ ЧЕРЕПОК В ГЛУБИНЕ
        // Маленький растворённый череп внутри слизи сверху
        ctx.fillStyle = 'rgba(236, 240, 241, 0.32)';
        ctx.beginPath(); ctx.arc(66, 42, 7, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(62, 47, 8, 4);

        // Пузырьки кислоты внутри массы
        ctx.fillStyle = '#a3e4d7';
        ctx.beginPath(); ctx.arc(42, 52, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(88, 54, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(36, 108, 5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(92, 112, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(64, 118, 3.5, 0, Math.PI * 2); ctx.fill();

        // 5. РАСКРЫТАЯ ПАСТЬ С ЗУБАМИ ИЗ САМОЙ ТЯГУЧЕЙ ЖИЖИ
        // Тёмно-изумрудная глубина пасти
        ctx.fillStyle = '#0b3820';
        ctx.beginPath();
        ctx.moveTo(34, 78);
        ctx.quadraticCurveTo(64, 62, 94, 78);
        ctx.quadraticCurveTo(64, 104, 34, 78);
        ctx.closePath();
        ctx.fill();

        // Верхние тягучие зубы-сталактиты из самой салатово-кислотной жижи
        ctx.fillStyle = '#7bed9f';
        ctx.beginPath();
        // Левый клык из жижи
        ctx.moveTo(40, 75); ctx.lineTo(44, 87); ctx.lineTo(49, 73);
        // Средне-левый клык
        ctx.moveTo(52, 72); ctx.lineTo(56, 89); ctx.lineTo(61, 71);
        // Центральный длинный клык-нить
        ctx.moveTo(61, 71); ctx.lineTo(64, 91); ctx.lineTo(67, 71);
        // Средне-правый клык
        ctx.moveTo(67, 71); ctx.lineTo(72, 89); ctx.lineTo(76, 72);
        // Правый клык
        ctx.moveTo(79, 73); ctx.lineTo(84, 87); ctx.lineTo(88, 75);
        ctx.closePath();
        ctx.fill();

        // Нижние вытянутые зубы-сталагмиты из самой жижи
        ctx.fillStyle = '#55efc4';
        ctx.beginPath();
        ctx.moveTo(43, 84); ctx.lineTo(47, 75); ctx.lineTo(51, 86);
        ctx.moveTo(55, 88); ctx.lineTo(59, 76); ctx.lineTo(63, 89);
        ctx.moveTo(65, 89); ctx.lineTo(69, 76); ctx.lineTo(73, 88);
        ctx.moveTo(77, 86); ctx.lineTo(81, 75); ctx.lineTo(85, 84);
        ctx.closePath();
        ctx.fill();

        // 6. ГЛЯНЦЕВЫЕ ВЛАЖНЫЕ БЛИКИ НА СЛИЗИ
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(46, 30);
        ctx.quadraticCurveTo(60, 22, 78, 28);
        ctx.moveTo(94, 52);
        ctx.quadraticCurveTo(100, 62, 96, 72);
        ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 24);
        ctx.bezierCurveTo(56, 16, 42, 20, 34, 38);
        ctx.bezierCurveTo(28, 48, 12, 54, 16, 68);
        ctx.bezierCurveTo(22, 86, 10, 96, 14, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

boggard_priest() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ШАМАНСКИЙ ПОСОХ С ЧЕРЕПОМ И БОЛОТНОЙ СФЕРОЙ (Справа на заднем плане)
        ctx.strokeStyle = '#4a3219';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(108, 30);
        ctx.quadraticCurveTo(104, 78, 110, 128);
        ctx.stroke();

        // Магическое бирюзовое свечение на навершии посоха
        ctx.fillStyle = 'rgba(0, 242, 254, 0.3)';
        ctx.beginPath(); ctx.arc(108, 22, 13, 0, Math.PI * 2); ctx.fill();

        // Маленький ритуальный череп-навершие на посохе
        ctx.fillStyle = '#e8e4d5';
        ctx.beginPath(); ctx.arc(108, 22, 6.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(104.5, 26, 7, 4);

        ctx.fillStyle = '#00f2fe'; // Светящиеся глазницы черепа
        ctx.beginPath(); ctx.arc(105.5, 22, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(110.5, 22, 1.5, 0, Math.PI * 2); ctx.fill();

        // 2. ЖРЕЧЕСКАЯ МАНТИЯ И ОЖЕРЕЛЬЕ ИЗ КОСТЕЙ
        ctx.fillStyle = '#2d1e3e'; // Тёмно-фиолетовая болотная ряса
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.lineTo(32, 92);
        ctx.lineTo(96, 92);
        ctx.lineTo(114, 128);
        ctx.closePath();
        ctx.fill();

        // Охристо-золотая ритуальная кайма на вороте мантии
        ctx.strokeStyle = '#c89d54';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(34, 94);
        ctx.quadraticCurveTo(64, 116, 94, 94);
        ctx.stroke();

        // Ожерелье из костяных клыков и бусин на груди
        ctx.fillStyle = '#f5f0dc';
        ctx.beginPath(); ctx.moveTo(46, 102); ctx.lineTo(49, 114); ctx.lineTo(53, 105); ctx.fill();
        ctx.beginPath(); ctx.moveTo(61, 107); ctx.lineTo(64, 121); ctx.lineTo(67, 107); ctx.fill();
        ctx.beginPath(); ctx.moveTo(82, 102); ctx.lineTo(79, 114); ctx.lineTo(75, 105); ctx.fill();

        // 3. ЦЕРЕМОНИАЛЬНЫЙ ГОЛОВНОЙ УБОР ИЗ ПЕРЬЕВ И КОСТЕЙ
        // Болотные перья веером за головой
        ctx.fillStyle = '#1e8449';
        ctx.beginPath(); ctx.moveTo(46, 44); ctx.lineTo(28, 16); ctx.lineTo(54, 38); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(82, 44); ctx.lineTo(100, 16); ctx.lineTo(74, 38); ctx.closePath(); ctx.fill();

        ctx.fillStyle = '#00b894';
        ctx.beginPath(); ctx.moveTo(56, 38); ctx.lineTo(50, 10); ctx.lineTo(63, 35); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(72, 38); ctx.lineTo(78, 10); ctx.lineTo(65, 35); ctx.closePath(); ctx.fill();

        // Костяной гребень-корона на макушке
        ctx.fillStyle = '#dcd6c8';
        ctx.beginPath();
        ctx.moveTo(48, 42);
        ctx.lineTo(64, 18);
        ctx.lineTo(80, 42);
        ctx.closePath();
        ctx.fill();

        // 4. ГОЛОВА И РАЗДУТЫЙ ГОРЛОВОЙ МЕШОК БОГГАРДА-ЖРЕЦА
        ctx.fillStyle = '#4e6e3a'; // Болотно-зелёная кожа
        ctx.beginPath();
        ctx.moveTo(38, 52);
        ctx.quadraticCurveTo(64, 36, 90, 52);
        ctx.lineTo(102, 78);
        ctx.lineTo(88, 102);
        ctx.quadraticCurveTo(64, 110, 40, 102);
        ctx.lineTo(26, 78);
        ctx.closePath();
        ctx.fill();

        // Светлый оливково-жёлтый горловой мешок
        ctx.fillStyle = '#8fa868';
        ctx.beginPath();
        ctx.moveTo(38, 78);
        ctx.quadraticCurveTo(64, 72, 90, 78);
        ctx.lineTo(84, 100);
        ctx.quadraticCurveTo(64, 106, 44, 100);
        ctx.closePath();
        ctx.fill();

        // Ритуальная белая шаманская раскраска на щеках и лбу
        ctx.strokeStyle = 'rgba(245, 240, 220, 0.8)';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(58, 44); ctx.lineTo(64, 52); ctx.lineTo(70, 44); // Знак на лбу
        ctx.moveTo(33, 66); ctx.lineTo(43, 69); // Полоски на левой щеке
        ctx.moveTo(32, 71); ctx.lineTo(42, 73);
        ctx.moveTo(95, 66); ctx.lineTo(85, 69); // Полоски на правой щеке
        ctx.moveTo(96, 71); ctx.lineTo(86, 73);
        ctx.stroke();

        // 5. ВЫПУКЛЫЕ ЖАБЬИ ГЛАЗА, СВЕТЯЩИЕСЯ БИРЮЗОВОЙ МАГИЕЙ
        ctx.fillStyle = '#3b542b';
        ctx.beginPath(); ctx.arc(42, 48, 10.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(86, 48, 10.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#00f2fe'; // Магическое бирюзовое свечение глаз жреца
        ctx.beginPath(); ctx.arc(42, 49, 7.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(86, 49, 7.2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0b191e'; // Горизонтальные амфибийные зрачки
        ctx.fillRect(35, 48, 14, 2.3);
        ctx.fillRect(79, 48, 14, 2.3);

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(44, 46, 1.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(84, 46, 1.4, 0, Math.PI * 2); ctx.fill();

        // 6. НОЗДРИ И ШИРОКИЙ РОТ, БОРМОЧУЩИЙ ЗАКЛИНАНИЕ
        ctx.fillStyle = '#243619';
        ctx.beginPath(); ctx.arc(58, 60, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(70, 60, 1.8, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#1f2e16';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(32, 76);
        ctx.quadraticCurveTo(64, 86, 96, 76);
        ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 18);
        ctx.lineTo(48, 42);
        ctx.lineTo(38, 52);
        ctx.lineTo(26, 78);
        ctx.lineTo(32, 92);
        ctx.lineTo(14, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },


owlbear() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. РАСПАХНУТЫЕ ОПЕРЕННЫЕ КРЫЛЬЯ МЕДВЕСЫЧА (Задний план слева и справа)
        const drawOwlbearWing = (isRight) => {
            ctx.save();
            if (isRight) {
                ctx.translate(size, 0);
                ctx.scale(-1, 1);
            }

            // Верхний кроющий ярус крыла (тёмно-бурый мех-перо)
            ctx.fillStyle = '#3b2416';
            ctx.beginPath();
            ctx.moveTo(46, 74);
            ctx.quadraticCurveTo(22, 34, 6, 22);
            ctx.quadraticCurveTo(10, 48, 22, 68);
            ctx.lineTo(42, 86);
            ctx.closePath();
            ctx.fill();

            // Длинные маховые перья крыла (веером вниз-вбок)
            const feathers = [,
                ,
                ,
                [22, 65, 13, 92]
            ];
            feathers.forEach(([sx, sy, tx, ty], idx) => {
                ctx.fillStyle = idx % 2 === 0 ? '#5c3a21' : '#784b2a';
                ctx.beginPath();
                ctx.moveTo(sx + 8, sy - 4);
                ctx.quadraticCurveTo(tx - 2, ty - 6, tx, ty);
                ctx.quadraticCurveTo(tx + 8, ty + 2, sx + 14, sy + 6);
                ctx.closePath();
                ctx.fill();
            });

            // Светлая охристая окантовка сгиба крыла
            ctx.strokeStyle = '#9c663b';
            ctx.lineWidth = 2.2;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(44, 70);
            ctx.quadraticCurveTo(22, 34, 7, 23);
            ctx.stroke();

            ctx.restore();
        };

        drawOwlbearWing(false); // Левое распахнутое крыло
        drawOwlbearWing(true);  // Правое распахнутое крыло

        // 2. МОГУЧИЕ МОХНАТЫЕ ПЛЕЧИ И ПЕРЬЕВАЯ ГРУДЬ ЗВЕРЯ
        ctx.fillStyle = '#362013';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.quadraticCurveTo(30, 74, 64, 70);
        ctx.quadraticCurveTo(98, 74, 112, 128);
        ctx.closePath();
        ctx.fill();

        // Светлый песочно-охристый перьевой нагрудник совы
        ctx.fillStyle = '#c49a6c';
        ctx.beginPath();
        ctx.moveTo(36, 92);
        ctx.quadraticCurveTo(64, 102, 92, 92);
        ctx.lineTo(98, 128);
        ctx.lineTo(30, 128);
        ctx.closePath();
        ctx.fill();

        // Ярусные совиные пестрины-перья на груди
        ctx.fillStyle = '#4a2e1b';
        [, [64, 107], [80, 105],
            , [56, 119], [72, 119], [86, 117]
        ].forEach(([fx, fy]) => {
            ctx.beginPath();
            ctx.moveTo(fx - 4, fy);
            ctx.lineTo(fx, fy + 6);
            ctx.lineTo(fx + 4, fy);
            ctx.closePath();
            ctx.fill();
        });

        // 3. ПЕРЬЕВЫЕ «УШКИ» СОВЫ И ШИРОКАЯ ГОЛОВА МЕДВЕСЫЧА
        ctx.fillStyle = '#4a2e1b';
        // Левый перьевой пучок-ухо
        ctx.beginPath();
        ctx.moveTo(40, 48);
        ctx.lineTo(24, 24);
        ctx.lineTo(52, 38);
        ctx.closePath();
        ctx.fill();

        // Правый перьевой пучок-ухо
        ctx.beginPath();
        ctx.moveTo(88, 48);
        ctx.lineTo(104, 24);
        ctx.lineTo(76, 38);
        ctx.closePath();
        ctx.fill();

        // Основной контур головы медвесыча
        ctx.fillStyle = '#5c3a21';
        ctx.beginPath();
        ctx.moveTo(36, 52);
        ctx.quadraticCurveTo(64, 28, 92, 52);
        ctx.lineTo(96, 78);
        ctx.quadraticCurveTo(64, 100, 32, 78);
        ctx.closePath();
        ctx.fill();

        // Характерный лицевой диск совы (двухдольный светлый контур вокруг глаз)
        ctx.fillStyle = '#dfc39d';
        ctx.beginPath();
        ctx.arc(50, 62, 14, 0, Math.PI * 2);
        ctx.arc(78, 62, 14, 0, Math.PI * 2);
        ctx.fill();

        // Рыжевато-медные тени внутри лицевого диска
        ctx.fillStyle = '#b57b45';
        ctx.beginPath();
        ctx.arc(50, 63, 10.5, 0, Math.PI * 2);
        ctx.arc(78, 63, 10.5, 0, Math.PI * 2);
        ctx.fill();

        // 4. ГРОЗНЫЕ ЗОЛОТИСТО-ОРАНЖЕВЫЕ ГЛАЗА ХИЩНИКА И НАХМУРЕННЫЕ ПЕРЬЯ
        ctx.fillStyle = '#1c1008';
        ctx.beginPath(); ctx.arc(49, 62, 7.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(79, 62, 7.2, 0, Math.PI * 2); ctx.fill();

        // Пылающая янтарная радужка совы
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.arc(49, 62, 5.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(79, 62, 5.8, 0, Math.PI * 2); ctx.fill();

        // Крупные чёрные зрачки и живые блики
        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(49, 62, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(79, 62, 3, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(51, 60, 1.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(77, 60, 1.4, 0, Math.PI * 2); ctx.fill();

        // Грозные перьевые брови, сведённые к клюву
        ctx.strokeStyle = '#2b190d';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(35, 51); ctx.lineTo(59, 60);
        ctx.moveTo(93, 51); ctx.lineTo(69, 60);
        ctx.stroke();

        // 5. ОСТРЫЙ ЗАГНУТЫЙ КЛЮВ СОВЫ (На переднем плане по центру морды)
        ctx.fillStyle = '#f59e0b';
        ctx.strokeStyle = '#3b2414';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(57, 64);
        ctx.quadraticCurveTo(64, 60, 71, 64);
        ctx.lineTo(64, 84); // Острый загнутый кончик клюва
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Световая грань и ноздри на клюве
        ctx.fillStyle = '#fcd34d';
        ctx.beginPath();
        ctx.moveTo(64, 61);
        ctx.lineTo(70, 64);
        ctx.lineTo(64, 82);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#3b2414';
        ctx.beginPath(); ctx.arc(61, 66, 1.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(67, 66, 1.1, 0, Math.PI * 2); ctx.fill();

        // 6. КОГТИСТАЯ МЕДВЕЖЬЯ ЛАПА НА ПЕРЕДНЕМ ПЛАНЕ (Слева снизу)
        ctx.fillStyle = '#4a2e1b';
        ctx.strokeStyle = '#1c1008';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.lineTo(18, 106);
        ctx.lineTo(38, 108);
        ctx.lineTo(36, 128);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Острые светло-костяные когти медвесыча
        ctx.fillStyle = '#f8f5e6';
        [20, 26, 31, 36].forEach((cx, idx) => {
            const topY = 95 - (idx === 1 || idx === 2 ? 3 : 0);
            ctx.beginPath();
            ctx.moveTo(cx - 2, 107);
            ctx.lineTo(cx, topY);
            ctx.lineTo(cx + 2, 107);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        });

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 38);
        ctx.quadraticCurveTo(48, 42, 36, 52);
        ctx.lineTo(32, 78);
        ctx.lineTo(16, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    bloom_wyvern() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. РАСПАХНУТЫЕ ПЕРЕПОНЧАТЫЕ КРЫЛЬЯ ВИВЕРНЫ (На заднем плане справа и сверху)
        // Дальнее левое крыло (выглядывает сверху из-за гребня)
        ctx.fillStyle = '#2d6a4f';
        ctx.beginPath();
        ctx.moveTo(64, 48);
        ctx.lineTo(52, 12);
        ctx.quadraticCurveTo(66, 20, 78, 14);
        ctx.quadraticCurveTo(84, 24, 94, 22);
        ctx.lineTo(82, 54);
        ctx.closePath();
        ctx.fill();

        // Костяной луч и коготь дальнего крыла
        ctx.strokeStyle = '#1b4332';
        ctx.lineWidth = 2.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(64, 48);
        ctx.lineTo(52, 12);
        ctx.moveTo(52, 12);
        ctx.lineTo(48, 8);
        ctx.stroke();

        // Ближнее правое крыло (широко раскрыто в правую сторону)
        // Перепонка крыла с фестончатым краем
        ctx.fillStyle = '#40916c';
        ctx.beginPath();
        ctx.moveTo(82, 72);
        ctx.lineTo(108, 22); // Верхний шип-сгиб крыла
        ctx.quadraticCurveTo(116, 40, 125, 44);
        ctx.quadraticCurveTo(116, 58, 124, 68);
        ctx.quadraticCurveTo(112, 78, 118, 92);
        ctx.quadraticCurveTo(102, 92, 94, 102);
        ctx.closePath();
        ctx.fill();

        // Светлая прожилка-лист на перепонке крыла
        ctx.fillStyle = '#52b788';
        ctx.beginPath();
        ctx.moveTo(86, 72);
        ctx.lineTo(108, 30);
        ctx.lineTo(116, 56);
        ctx.lineTo(94, 86);
        ctx.closePath();
        ctx.fill();

        // Костяные лучи-пальцы и коготь на сгибе правого крыла
        ctx.strokeStyle = '#1b4332';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(82, 72);
        ctx.lineTo(108, 22); // Главная крыльевая кость
        ctx.moveTo(108, 22);
        ctx.lineTo(124, 44); // Верхний луч перепонки
        ctx.moveTo(100, 38);
        ctx.lineTo(123, 68); // Средний луч перепонки
        ctx.moveTo(93, 52);
        ctx.lineTo(117, 91); // Нижний луч перепонки
        ctx.stroke();

        // Острый костяной коготь на сгибе крыла
        ctx.fillStyle = '#f5eedc';
        ctx.beginPath();
        ctx.moveTo(106, 22);
        ctx.lineTo(106, 13);
        ctx.lineTo(111, 21);
        ctx.closePath();
        ctx.fill();

        // 2. ЗАГНУТЫЕ НАЗАД РОГА И ЛИСТОВИДНЫЙ ГРЕБЕНЬ-УХО
        ctx.fillStyle = '#3b4a2b';
        ctx.beginPath();
        ctx.moveTo(68, 42);
        ctx.bezierCurveTo(78, 20, 96, 16, 102, 26);
        ctx.bezierCurveTo(92, 24, 82, 32, 76, 48);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#4e7a34';
        ctx.beginPath();
        ctx.moveTo(78, 54);
        ctx.quadraticCurveTo(96, 46, 106, 40);
        ctx.quadraticCurveTo(96, 56, 82, 64);
        ctx.closePath();
        ctx.fill();

        // 3. МОЩНАЯ ИЗОГНУТАЯ ШЕЯ И ЛЕСНОЙ ВЕНОК ЦВЕТЕНИЯ
        ctx.fillStyle = '#2d5a27';
        ctx.beginPath();
        ctx.moveTo(58, 74);
        ctx.quadraticCurveTo(88, 78, 102, 128);
        ctx.lineTo(32, 128);
        ctx.quadraticCurveTo(42, 98, 50, 84);
        ctx.closePath();
        ctx.fill();

        // Светло-салатовые грудные пластины шеи
        ctx.fillStyle = '#74a844';
        ctx.beginPath();
        ctx.moveTo(46, 88);
        ctx.quadraticCurveTo(38, 108, 36, 128);
        ctx.lineTo(66, 128);
        ctx.quadraticCurveTo(62, 106, 58, 88);
        ctx.closePath();
        ctx.fill();

        // Пышный венок из лесных листьев и розовых бутонов на шее
        ctx.fillStyle = '#1e4620';
        ctx.beginPath();
        ctx.ellipse(68, 100, 27, 11, 0.22, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#52b788';
        ctx.beginPath();
        ctx.ellipse(48, 94, 8, 4, -0.4, 0, Math.PI * 2);
        ctx.ellipse(68, 100, 9, 4.5, 0.2, 0, Math.PI * 2);
        ctx.ellipse(88, 106, 8, 4, 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Цветущие розовато-персиковые бутоны в гриве
        ctx.fillStyle = '#f48fb1';
        ctx.beginPath(); ctx.arc(56, 97, 4.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(79, 103, 4.6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffd875';
        ctx.beginPath(); ctx.arc(56, 97, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(79, 103, 1.7, 0, Math.PI * 2); ctx.fill();

        // 4. ВЕРХНЯЯ ЧЕЛЮСТЬ И ЧЕРЕП ВИВЕРНЫ В ПРОФИЛЬ ВЛЕВО
        ctx.fillStyle = '#3a7d34';
        ctx.beginPath();
        ctx.moveTo(82, 50); // Затылок
        ctx.lineTo(62, 36); // Надбровный гребень
        ctx.lineTo(10, 52); // Вытянутая хищная морда влево
        ctx.lineTo(14, 63); // Верхняя губа
        ctx.lineTo(54, 71); // Угол пасти
        ctx.lineTo(80, 73); // Скула
        ctx.closePath();
        ctx.fill();

        // Салатовые чешуйки вдоль гребня носа
        ctx.fillStyle = '#8ac926';
        ctx.beginPath();
        ctx.moveTo(16, 53);
        ctx.lineTo(48, 44);
        ctx.lineTo(44, 49);
        ctx.lineTo(18, 57);
        ctx.closePath();
        ctx.fill();

        // Ноздря на кончике морды
        ctx.fillStyle = '#143312';
        ctx.beginPath(); ctx.arc(17, 54, 1.9, 0, Math.PI * 2); ctx.fill();

        // 5. ШИРОКО РАСПАХНУТАЯ ПАСТЬ, ЯЗЫК И НИЖНЯЯ ЧЕЛЮСТЬ
        ctx.fillStyle = '#2b0d14';
        ctx.beginPath();
        ctx.moveTo(14, 62);
        ctx.lineTo(58, 71);
        ctx.lineTo(22, 88);
        ctx.lineTo(18, 81);
        ctx.lineTo(42, 72);
        ctx.closePath();
        ctx.fill();

        // Мясистый алый язык
        ctx.fillStyle = '#c93b4b';
        ctx.beginPath();
        ctx.moveTo(48, 73);
        ctx.quadraticCurveTo(33, 77, 22, 77);
        ctx.quadraticCurveTo(32, 83, 50, 77);
        ctx.closePath();
        ctx.fill();

        // Нижняя челюсть (опущена вниз в рёве)
        ctx.fillStyle = '#559e42';
        ctx.beginPath();
        ctx.moveTo(54, 70);
        ctx.lineTo(18, 82);
        ctx.lineTo(24, 91);
        ctx.lineTo(62, 88);
        ctx.lineTo(80, 73);
        ctx.closePath();
        ctx.fill();

        // 6. ОСТРЫЕ БЕЛЫЕ КЛЫКИ В РАСКРЫТОЙ ПАСТИ
        ctx.fillStyle = '#ffffff';
        // Верхний ряд зубов
        ctx.beginPath(); ctx.moveTo(16, 62); ctx.lineTo(19, 70); ctx.lineTo(22, 63); ctx.fill();
        ctx.beginPath(); ctx.moveTo(25, 64); ctx.lineTo(28, 71); ctx.lineTo(31, 65); ctx.fill();
        ctx.beginPath(); ctx.moveTo(34, 66); ctx.lineTo(37, 72); ctx.lineTo(40, 67); ctx.fill();
        ctx.beginPath(); ctx.moveTo(43, 68); ctx.lineTo(46, 73); ctx.lineTo(49, 69); ctx.fill();

        // Нижний ряд зубов
        ctx.beginPath(); ctx.moveTo(20, 82); ctx.lineTo(23, 75); ctx.lineTo(26, 80); ctx.fill();
        ctx.beginPath(); ctx.moveTo(29, 79); ctx.lineTo(32, 73); ctx.lineTo(35, 77); ctx.fill();
        ctx.beginPath(); ctx.moveTo(38, 76); ctx.lineTo(41, 71); ctx.lineTo(44, 74); ctx.fill();

        // 7. ХИЩНЫЙ ЯНТАРНО-ЗОЛОТОЙ ГЛАЗ ВИВЕРНЫ
        ctx.fillStyle = '#ffd166';
        ctx.beginPath();
        ctx.moveTo(50, 50);
        ctx.lineTo(64, 46);
        ctx.lineTo(59, 55);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#111a0f';
        ctx.fillRect(56, 47.5, 1.5, 6);

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(55, 49.5, 1, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#1b4318';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(47, 47);
        ctx.lineTo(65, 44);
        ctx.stroke();

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень вдоль нижней челюсти и шеи)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(18, 82);
        ctx.lineTo(62, 88);
        ctx.lineTo(80, 73);
        ctx.lineTo(102, 128);
        ctx.lineTo(32, 128);
        ctx.lineTo(50, 86);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    thylacine() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАДНИЙ ПЛАН: Мощная шея, загривок и грудь тилацина
        ctx.fillStyle = '#a8763e';
        ctx.beginPath();
        ctx.moveTo(64, 58);
        ctx.quadraticCurveTo(104, 68, 120, 128);
        ctx.lineTo(38, 128);
        ctx.quadraticCurveTo(46, 94, 56, 80);
        ctx.closePath();
        ctx.fill();

        // Светлый кремово-песочный подшёрсток на груди и передней части шеи
        ctx.fillStyle = '#e8cfa6';
        ctx.beginPath();
        ctx.moveTo(52, 88);
        ctx.quadraticCurveTo(72, 92, 82, 128);
        ctx.lineTo(42, 128);
        ctx.quadraticCurveTo(46, 104, 52, 88);
        ctx.closePath();
        ctx.fill();

        // Фирменные тёмно-бурые тигровые полосы на загривке и спине
        ctx.fillStyle = '#3b2313';
        ctx.beginPath();
        // Полоса 1 (верхняя на шее)
        ctx.moveTo(86, 70); ctx.lineTo(103, 76); ctx.lineTo(100, 83); ctx.lineTo(82, 76);
        // Полоса 2
        ctx.moveTo(83, 86); ctx.lineTo(109, 94); ctx.lineTo(107, 102); ctx.lineTo(79, 93);
        // Полоса 3
        ctx.moveTo(80, 102); ctx.lineTo(115, 112); ctx.lineTo(113, 120); ctx.lineTo(76, 109);
        // Полоса 4 (нижняя)
        ctx.moveTo(77, 118); ctx.lineTo(119, 126); ctx.lineTo(118, 128); ctx.lineTo(74, 125);
        ctx.closePath();
        ctx.fill();

        // 2. ОКРУГЛЫЕ СТОЯЧИЕ УШИ СУМЧАТОГО ВОЛКА (Дальнее и ближнее)
        // Дальнее ухо
        ctx.fillStyle = '#946330';
        ctx.beginPath();
        ctx.ellipse(65, 36, 7.5, 12, -0.22, 0, Math.PI * 2);
        ctx.fill();

        // Ближнее ухо
        ctx.fillStyle = '#c48f52';
        ctx.beginPath();
        ctx.ellipse(83, 39, 9, 14, 0.22, 0, Math.PI * 2);
        ctx.fill();

        // Внутренняя тёмная раковина ближнего уха
        ctx.fillStyle = '#4a2e18';
        ctx.beginPath();
        ctx.ellipse(82, 40, 4.8, 8.5, 0.22, 0, Math.PI * 2);
        ctx.fill();

        // 3. ВЫТЯНУТАЯ ВЕРХНЯЯ ЧЕЛЮСТЬ И ЧЕРЕП В ПОЛУОБОРОТ ВЛЕВО
        ctx.fillStyle = '#c99355';
        ctx.beginPath();
        ctx.moveTo(92, 48); // Затылок
        ctx.quadraticCurveTo(72, 34, 52, 42); // Лоб
        ctx.lineTo(15, 56); // Длинная вытянутая морда влево
        ctx.lineTo(17, 67); // Верхняя губа
        ctx.lineTo(68, 74); // Глубокий разрез пасти (знаменитый широкий зев тилацина)
        ctx.lineTo(90, 76); // Скула
        ctx.closePath();
        ctx.fill();

        // Световая зона на спинке носа и скуле
        ctx.fillStyle = '#dead72';
        ctx.beginPath();
        ctx.moveTo(20, 56);
        ctx.lineTo(54, 44);
        ctx.lineTo(60, 50);
        ctx.lineTo(24, 61);
        ctx.closePath();
        ctx.fill();

        // Пушистый светлый подшёрсток на щеке
        ctx.fillStyle = '#e8cfa6';
        ctx.beginPath();
        ctx.moveTo(68, 72);
        ctx.lineTo(92, 74);
        ctx.lineTo(86, 56);
        ctx.quadraticCurveTo(68, 60, 68, 72);
        ctx.closePath();
        ctx.fill();

        // Чёрная мочка носа и складки рычания на переносице
        ctx.fillStyle = '#1a110b';
        ctx.beginPath();
        ctx.moveTo(15, 56);
        ctx.quadraticCurveTo(11, 60, 16, 65);
        ctx.lineTo(22, 60);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#5c381c';
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(31, 54); ctx.lineTo(34, 60);
        ctx.moveTo(37, 52); ctx.lineTo(40, 58);
        ctx.stroke();

        // 4. ШИРОКО РАСПАХНУТАЯ ПАСТЬ ТИЛАЦИНА И НИЖНЯЯ ЧЕЛЮСТЬ
        // Тёмная глубина пасти
        ctx.fillStyle = '#24090d';
        ctx.beginPath();
        ctx.moveTo(17, 66);
        ctx.lineTo(72, 74);
        ctx.lineTo(25, 96);
        ctx.lineTo(21, 88);
        ctx.lineTo(54, 75);
        ctx.closePath();
        ctx.fill();

        // Мясистый алый язык внутри пасти
        ctx.fillStyle = '#b8323f';
        ctx.beginPath();
        ctx.moveTo(60, 77);
        ctx.quadraticCurveTo(40, 82, 27, 83);
        ctx.quadraticCurveTo(38, 88, 62, 80);
        ctx.closePath();
        ctx.fill();

        // Нижняя челюсть (широко отведена вниз)
        ctx.fillStyle = '#b07b42';
        ctx.beginPath();
        ctx.moveTo(68, 73);
        ctx.lineTo(21, 89);
        ctx.lineTo(27, 98);
        ctx.lineTo(70, 92);
        ctx.lineTo(90, 76);
        ctx.closePath();
        ctx.fill();

        // 5. ОСТРЫЕ КЛЫКИ И ЧАСТОКОЛ ХИЩНЫХ ЗУБОВ
        ctx.fillStyle = '#ffffff';
        // Верхние клыки и премоляры
        ctx.beginPath(); ctx.moveTo(20, 66); ctx.lineTo(23, 75); ctx.lineTo(26, 67); ctx.fill();
        ctx.beginPath(); ctx.moveTo(30, 68); ctx.lineTo(33, 75); ctx.lineTo(36, 69); ctx.fill();
        ctx.beginPath(); ctx.moveTo(40, 70); ctx.lineTo(43, 76); ctx.lineTo(46, 71); ctx.fill();
        ctx.beginPath(); ctx.moveTo(50, 71); ctx.lineTo(53, 76); ctx.lineTo(56, 72); ctx.fill();

        // Нижние клыки и премоляры
        ctx.beginPath(); ctx.moveTo(23, 88); ctx.lineTo(26, 80); ctx.lineTo(29, 86); ctx.fill();
        ctx.beginPath(); ctx.moveTo(33, 85); ctx.lineTo(36, 78); ctx.lineTo(39, 83); ctx.fill();
        ctx.beginPath(); ctx.moveTo(43, 81); ctx.lineTo(46, 75); ctx.lineTo(49, 79); ctx.fill();
        ctx.beginPath(); ctx.moveTo(53, 78); ctx.lineTo(56, 73); ctx.lineTo(59, 76); ctx.fill();

        // 6. ХИЩНЫЙ ЯНТАРНЫЙ ГЛАЗ С ТЁМНОЙ ОКАНТОВКОЙ
        ctx.fillStyle = '#2b190d';
        ctx.beginPath();
        ctx.ellipse(57, 51, 6.2, 3.6, -0.15, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(56.5, 51, 2.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#110a06';
        ctx.beginPath();
        ctx.arc(56.5, 51, 1.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(55.5, 50, 0.85, 0, Math.PI * 2);
        ctx.fill();

        // Грозная надбровная складка
        ctx.strokeStyle = '#3b2313';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(50, 47);
        ctx.lineTo(65, 45);
        ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень вдоль нижней челюсти и спины)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(21, 89);
        ctx.lineTo(70, 92);
        ctx.lineTo(90, 76);
        ctx.lineTo(120, 128);
        ctx.lineTo(38, 128);
        ctx.lineTo(56, 86);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },





    mind_flayer() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ВЫСОКИЙ СТОЯЧИЙ ВОРОТНИК АРКАННОЙ МАНТИИ (Задний план)
        ctx.fillStyle = '#241030';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(24, 68);
        ctx.lineTo(44, 84);
        ctx.lineTo(84, 84);
        ctx.lineTo(104, 68);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        // Багровая подкладка и золотой кант высокого воротника
        ctx.fillStyle = '#5e1938';
        ctx.beginPath();
        ctx.moveTo(27, 74);
        ctx.lineTo(44, 86);
        ctx.lineTo(84, 86);
        ctx.lineTo(101, 74);
        ctx.lineTo(96, 108);
        ctx.lineTo(32, 108);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(24, 68);
        ctx.lineTo(44, 84);
        ctx.moveTo(84, 84);
        ctx.lineTo(104, 68);
        ctx.lineTo(112, 128);
        ctx.stroke();

        // 2. ШЕЯ И ВЫТЯНУТЫЙ ЛУКОВИЦЕОБРАЗНЫЙ ЧЕРЕП ИЛЛИТИДА
        ctx.fillStyle = '#65407d';
        ctx.fillRect(54, 78, 20, 26);

        // Массивный вытянутый череп с узкой нижней частью лица
        ctx.fillStyle = '#7d5296';
        ctx.beginPath();
        ctx.moveTo(40, 48);
        ctx.bezierCurveTo(34, 16, 94, 16, 88, 48); // Широкий купол черепа
        ctx.lineTo(83, 72);
        ctx.lineTo(74, 86);
        ctx.lineTo(54, 86);
        ctx.lineTo(45, 72);
        ctx.closePath();
        ctx.fill();

        // Световая зона на высоком лбу и рельефные псионические вены
        ctx.fillStyle = '#9264ad';
        ctx.beginPath();
        ctx.ellipse(64, 34, 16, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#523069';
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(44, 38); ctx.quadraticCurveTo(49, 44, 46, 52);
        ctx.moveTo(84, 38); ctx.quadraticCurveTo(79, 44, 82, 52);
        ctx.stroke();

        // 3. СВЕТЯЩИЕСЯ БЕЛЁСО-ЛАЗУРНЫЕ ГЛАЗА БЕЗ ЗРАЧКОВ И НАДБРОВНЫЕ ДУГИ
        // Тёмные глазницы
        ctx.fillStyle = '#3b1f4d';
        ctx.beginPath(); ctx.ellipse(52, 56, 6.5, 3.2, 0.18, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(76, 56, 6.5, 3.2, -0.18, 0, Math.PI * 2); ctx.fill();

        // Светящиеся белые глаза иллитида
        ctx.fillStyle = '#e0f7fa';
        ctx.beginPath(); ctx.ellipse(52, 56, 5, 2.2, 0.18, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(76, 56, 5, 2.2, -0.18, 0, Math.PI * 2); ctx.fill();

        // Тяжёлые нахмуренные надбровные складки
        ctx.strokeStyle = '#47265c';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(43, 50); ctx.lineTo(58, 55);
        ctx.moveTo(85, 50); ctx.lineTo(70, 55);
        ctx.stroke();

        // 4. ЧЕТЫРЕ ИЗВИВАЮЩИХСЯ ЛИЦЕВЫХ ЩУПАЛЬЦА (На переднем плане)
        ctx.lineCap = 'round';

        // Внешнее левое щупальце
        ctx.strokeStyle = '#6c4385';
        ctx.lineWidth = 6.5;
        ctx.beginPath();
        ctx.moveTo(54, 78);
        ctx.bezierCurveTo(36, 84, 30, 104, 38, 122);
        ctx.stroke();

        // Внешнее правое щупальце
        ctx.beginPath();
        ctx.moveTo(74, 78);
        ctx.bezierCurveTo(92, 84, 98, 104, 90, 122);
        ctx.stroke();

        // Внутреннее левое щупальце
        ctx.strokeStyle = '#8557a1';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(59, 80);
        ctx.bezierCurveTo(50, 94, 58, 110, 48, 126);
        ctx.stroke();

        // Внутреннее правое щупальце
        ctx.beginPath();
        ctx.moveTo(69, 80);
        ctx.bezierCurveTo(78, 94, 70, 110, 80, 126);
        ctx.stroke();

        // Светлые лиловые присоски вдоль щупалец
        ctx.fillStyle = '#c39bd3';
        [, [36, 108], [88, 94], [92, 108],
            , [52, 114], [74, 98], [76, 114]
        ].forEach(([px, py]) => {
            ctx.beginPath();
            ctx.arc(px, py, 1.5, 0, Math.PI * 2);
            ctx.fill();
        });

        // 5. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 24);
        ctx.bezierCurveTo(44, 24, 38, 36, 40, 48);
        ctx.lineTo(45, 72);
        ctx.lineTo(54, 86);
        ctx.lineTo(64, 86);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.lineTo(24, 68);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    mitflit() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ОГРОМНЫЕ ОТТОПЫРЕННЫЕ УШИ ГРЕМЛИНА (Задний план)
        ctx.fillStyle = '#476985';
        // Левое огромное ухо
        ctx.beginPath();
        ctx.moveTo(38, 48);
        ctx.quadraticCurveTo(14, 38, 4, 46);
        ctx.quadraticCurveTo(16, 62, 36, 68);
        ctx.closePath();
        ctx.fill();

        // Правое огромное ухо
        ctx.beginPath();
        ctx.moveTo(90, 48);
        ctx.quadraticCurveTo(114, 38, 124, 46);
        ctx.quadraticCurveTo(112, 62, 92, 68);
        ctx.closePath();
        ctx.fill();

        // Внутренняя тёмная раковина ушей
        ctx.fillStyle = '#2d465c';
        ctx.beginPath(); ctx.moveTo(36, 53); ctx.quadraticCurveTo(18, 47, 10, 49); ctx.quadraticCurveTo(20, 58, 35, 62); ctx.fill();
        ctx.beginPath(); ctx.moveTo(92, 53); ctx.quadraticCurveTo(110, 47, 118, 49); ctx.quadraticCurveTo(108, 58, 93, 62); ctx.fill();

        // 2. ТЩЕДУШНЫЕ ПЛЕЧИ, РВАНАЯ ТУНИКА И КОЖАНАЯ ПЕРЕВЯЗЬ С КОЛЬЯМИ
        ctx.fillStyle = '#384726'; // Рваная болотно-зелёная тряпка
        ctx.beginPath();
        ctx.moveTo(22, 128);
        ctx.lineTo(38, 96);
        ctx.lineTo(90, 96);
        ctx.lineTo(106, 128);
        ctx.closePath();
        ctx.fill();

        // Кожаный наплечник справа и перевязь через грудь
        ctx.fillStyle = '#4a3525';
        ctx.beginPath();
        ctx.moveTo(82, 96);
        ctx.quadraticCurveTo(102, 96, 108, 122);
        ctx.lineTo(86, 126);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(92, 107, 4.5, 0, Math.PI * 2); ctx.stroke();

        // Диагональный ремень с деревянными кольями-дротиками
        ctx.fillStyle = '#3b2416';
        ctx.beginPath();
        ctx.moveTo(84, 96);
        ctx.lineTo(52, 128);
        ctx.lineTo(66, 128);
        ctx.lineTo(94, 100);
        ctx.closePath();
        ctx.fill();

        // Маленькие деревянные колья заткнутые за перевязь
        ctx.fillStyle = '#c49a6c';
        ctx.save();
        ctx.translate(76, 110);
        ctx.rotate((Math.PI / 180) * -42);
        ctx.fillRect(-7, -6, 2.5, 12);
        ctx.fillRect(-1.5, -6, 2.5, 12);
        ctx.fillRect(4, -6, 2.5, 12);
        ctx.restore();

        // 3. ГОЛОВА МИТФЛИТА (Широкий бугристый лоб и скуластая челюсть)
        ctx.fillStyle = '#5c82a1'; // Серо-голубая кожа феи-гремлина
        ctx.beginPath();
        ctx.moveTo(36, 44);
        ctx.quadraticCurveTo(64, 24, 92, 44);
        ctx.lineTo(94, 68);
        ctx.lineTo(82, 92);
        ctx.quadraticCurveTo(64, 102, 46, 92);
        ctx.lineTo(34, 68);
        ctx.closePath();
        ctx.fill();

        // Рельефные надбровные бугры и скулы (световой объём)
        ctx.fillStyle = '#7ba3c4';
        ctx.beginPath();
        ctx.arc(50, 44, 11, 0, Math.PI * 2);
        ctx.arc(78, 44, 11, 0, Math.PI * 2);
        ctx.fill();

        // Характерные кожные бородавки на лбу и щеках
        ctx.fillStyle = '#3b5870';
        ctx.beginPath(); ctx.arc(64, 34, 2.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(41, 66, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(87, 68, 2.2, 0, Math.PI * 2); ctx.fill();

        // 4. ГЛУБОКО ПОСАЖЕННЫЕ ЖЁЛТО-ЯНТАРНЫЕ ГЛАЗА И ШИРОКИЙ НОС
        // Тёмные глазницы под нахмуренными бровями
        ctx.fillStyle = '#243a4d';
        ctx.beginPath(); ctx.ellipse(50, 56, 7.5, 4.2, 0.14, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(78, 56, 7.5, 4.2, -0.14, 0, Math.PI * 2); ctx.fill();

        // Жёлтые глаза гремлина
        ctx.fillStyle = '#facc15';
        ctx.beginPath(); ctx.ellipse(50, 56, 5.5, 3, 0.14, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(78, 56, 5.5, 3, -0.14, 0, Math.PI * 2); ctx.fill();

        // Тёмные зрачки и блики
        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(50.5, 56, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(77.5, 56, 1.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(51.5, 55, 0.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76.5, 55, 0.8, 0, Math.PI * 2); ctx.fill();

        // Нависшие складки лба над глазами
        ctx.strokeStyle = '#243a4d';
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(39, 49); ctx.lineTo(58, 54);
        ctx.moveTo(89, 49); ctx.lineTo(70, 54);
        ctx.stroke();

        // Широкий приплюснутый нос картошкой
        ctx.fillStyle = '#476985';
        ctx.beginPath();
        ctx.moveTo(64, 54);
        ctx.lineTo(74, 68);
        ctx.quadraticCurveTo(64, 73, 54, 68);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#1e3040';
        ctx.beginPath(); ctx.arc(59, 68, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(69, 68, 1.8, 0, Math.PI * 2); ctx.fill();

        // 5. ШИРОКАЯ ВРЕДНАЯ УХМЫЛКА С МЕЛКИМИ ОСТРЫМИ ЗУБАМИ
        ctx.fillStyle = '#182430';
        ctx.beginPath();
        ctx.moveTo(43, 77);
        ctx.quadraticCurveTo(64, 83, 85, 77);
        ctx.quadraticCurveTo(80, 90, 64, 91);
        ctx.quadraticCurveTo(48, 90, 43, 77);
        ctx.closePath();
        ctx.fill();

        // Мелкие острые зубы сверху и снизу
        ctx.fillStyle = '#fef9c3';
        [48, 55, 62, 69, 76].forEach(zx => {
            ctx.beginPath();
            ctx.moveTo(zx, 79);
            ctx.lineTo(zx + 2, 83.5);
            ctx.lineTo(zx + 4, 79.5);
            ctx.closePath();
            ctx.fill();
        });
        [51, 59, 67, 74].forEach(zx => {
            ctx.beginPath();
            ctx.moveTo(zx, 89);
            ctx.lineTo(zx + 2, 85);
            ctx.lineTo(zx + 4, 88.5);
            ctx.closePath();
            ctx.fill();
        });

        // 6. МАЛЕНЬКИЙ ЗАЗУБРЕННЫЙ КОРОТКИЙ МЕЧ НА ПЕРЕДНЕМ ПЛАНЕ (Слева снизу)
        ctx.save();
        ctx.translate(25, 102);
        ctx.rotate((Math.PI / 180) * -26);

        // Короткий стальной клинок с зазубриной
        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(-4.5, 0);
        ctx.lineTo(-4.5, -24);
        ctx.lineTo(-2.5, -26); // Небольшая зазубрина на лезвии
        ctx.lineTo(-4.5, -28);
        ctx.lineTo(-4, -36);
        ctx.lineTo(0, -44); // Остриё короткого меча
        ctx.lineTo(4, -36);
        ctx.lineTo(4.5, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Светлая заточенная грань клинка
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(0, -44);
        ctx.lineTo(4, -36);
        ctx.lineTo(4.5, 0);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();

        // Грубая кованая гарда и обмотанная рукоять
        ctx.fillStyle = '#334155';
        ctx.fillRect(-10, -2, 20, 4);

        ctx.fillStyle = '#4a3219';
        ctx.fillRect(-2.5, 2, 5, 13);

        ctx.fillStyle = '#64748b';
        ctx.beginPath(); ctx.arc(0, 17, 3.2, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // Синекожая когтистая кисть митфлита, сжимающая рукоять меча
        ctx.fillStyle = '#476985';
        ctx.strokeStyle = '#1e3040';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(29, 111, 6, 4.5, -0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 30);
        ctx.quadraticCurveTo(48, 34, 36, 44);
        ctx.lineTo(34, 68);
        ctx.lineTo(46, 92);
        ctx.lineTo(64, 97);
        ctx.lineTo(64, 128);
        ctx.lineTo(22, 128);
        ctx.lineTo(38, 96);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    shambling_mound() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ВНЕШНИЕ ИЗВИВАЮЩИЕСЯ ЩУПАЛЬЦА-ЛИАНЫ И ПОБЕГИ (Задний план и силуэт)
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Тёмные древесные плети-лозы, тянущиеся вверх и в стороны
        ctx.strokeStyle = '#2d471e';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(48, 36); ctx.bezierCurveTo(32, 22, 42, 10, 26, 6);
        ctx.moveTo(64, 30); ctx.bezierCurveTo(68, 16, 56, 10, 64, 3);
        ctx.moveTo(80, 36); ctx.bezierCurveTo(96, 22, 86, 10, 102, 6);
        // Боковые лианы-руки
        ctx.moveTo(32, 60); ctx.bezierCurveTo(14, 52, 16, 36, 6, 30);
        ctx.moveTo(26, 86); ctx.bezierCurveTo(10, 86, 12, 104, 4, 114);
        ctx.moveTo(96, 60); ctx.bezierCurveTo(114, 52, 112, 36, 122, 30);
        ctx.moveTo(102, 86); ctx.bezierCurveTo(118, 86, 116, 104, 124, 114);
        ctx.stroke();

        // Более тонкие салатово-зелёные побеги, обвивающие внешние плети
        ctx.strokeStyle = '#5c9134';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(46, 34); ctx.bezierCurveTo(40, 20, 30, 18, 22, 12);
        ctx.moveTo(82, 34); ctx.bezierCurveTo(88, 20, 98, 18, 106, 12);
        ctx.moveTo(28, 62); ctx.bezierCurveTo(18, 48, 10, 46, 8, 36);
        ctx.moveTo(100, 62); ctx.bezierCurveTo(110, 48, 118, 46, 120, 36);
        ctx.stroke();

        // 2. ТЁМНОЕ ВНУТРЕННЕЕ ЯДРО СПЛЕТЕНИЯ (Чтобы между лианами читалась глубина)
        ctx.fillStyle = '#14210c';
        ctx.beginPath();
        ctx.moveTo(26, 128);
        ctx.bezierCurveTo(22, 86, 32, 42, 64, 34);
        ctx.bezierCurveTo(96, 42, 106, 86, 102, 128);
        ctx.closePath();
        ctx.fill();

        // 3. ТОЛСТЫЕ ПЕРЕПЛЕТЁННЫЕ СТВОЛЫ-ЛИАНЫ, ФОРМИРУЮЩИЕ ТЕЛО И ГОЛОВУ
        // Задний слой густых оливковых лоз
        ctx.strokeStyle = '#385923';
        ctx.lineWidth = 7.5;
        ctx.beginPath();
        ctx.moveTo(22, 128); ctx.bezierCurveTo(18, 86, 34, 46, 64, 32);
        ctx.moveTo(106, 128); ctx.bezierCurveTo(110, 86, 94, 46, 64, 32);
        ctx.moveTo(36, 128); ctx.bezierCurveTo(44, 96, 26, 66, 52, 36);
        ctx.moveTo(92, 128); ctx.bezierCurveTo(84, 96, 102, 66, 76, 36);
        ctx.stroke();

        // Средний слой переплетённых древесно-зелёных лиан
        ctx.strokeStyle = '#4c782e';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(28, 128); ctx.bezierCurveTo(48, 106, 24, 72, 46, 42);
        ctx.moveTo(100, 128); ctx.bezierCurveTo(80, 106, 104, 72, 82, 42);
        ctx.moveTo(46, 128); ctx.bezierCurveTo(56, 102, 72, 102, 82, 128);
        ctx.moveTo(32, 92); ctx.quadraticCurveTo(64, 112, 96, 92);
        ctx.stroke();

        // Передние рельефные стебли с ярким световым оттенком (объём)
        ctx.strokeStyle = '#6da642';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(34, 126); ctx.bezierCurveTo(42, 96, 28, 70, 48, 44);
        ctx.moveTo(94, 126); ctx.bezierCurveTo(86, 96, 100, 70, 80, 44);
        ctx.moveTo(36, 94); ctx.quadraticCurveTo(64, 110, 92, 94);
        ctx.moveTo(44, 42); ctx.quadraticCurveTo(64, 32, 84, 42);
        ctx.stroke();

        // 4. ЛИСТЬЯ ПЛЮЩА И ПАПОРОТНИКА НА ЛИАНАХ
        const drawLeaf = (lx, ly, angleDeg, color) => {
            ctx.save();
            ctx.translate(lx, ly);
            ctx.rotate((Math.PI / 180) * angleDeg);
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(6, -5, 13, 0);
            ctx.quadraticCurveTo(6, 5, 0, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        };

        drawLeaf(36, 46, -145, '#7cb84b');
        drawLeaf(92, 46, -35, '#7cb84b');
        drawLeaf(24, 74, -165, '#5c9134');
        drawLeaf(104, 74, -15, '#5c9134');
        drawLeaf(32, 106, 155, '#7cb84b');
        drawLeaf(96, 106, 25, '#7cb84b');
        drawLeaf(64, 112, 90, '#6da642');

        // 5. ТЁМНЫЙ ПРОСВЕТ-ЛИЦО МЕЖДУ ЛИАНАМИ И СВЕТЯЩИЕСЯ ГЛАЗА
        ctx.fillStyle = '#0d1408';
        ctx.beginPath();
        ctx.moveTo(44, 52);
        ctx.quadraticCurveTo(64, 46, 84, 52);
        ctx.lineTo(80, 82);
        ctx.quadraticCurveTo(64, 90, 48, 82);
        ctx.closePath();
        ctx.fill();

        // Пересекающие лицо тонкие стебли-усики
        ctx.strokeStyle = '#385923';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(43, 52); ctx.quadraticCurveTo(64, 56, 85, 52);
        ctx.moveTo(46, 82); ctx.quadraticCurveTo(64, 86, 82, 82);
        ctx.stroke();

        // Светящиеся янтарно-золотые глаза в глубине лиан
        ctx.fillStyle = 'rgba(250, 204, 21, 0.35)';
        ctx.beginPath(); ctx.arc(53, 61, 6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 61, 6, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#facc15';
        ctx.beginPath(); ctx.ellipse(53, 61, 4, 2.3, 0.18, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 61, 4, 2.3, -0.18, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(53, 61, 1.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 61, 1.1, 0, Math.PI * 2); ctx.fill();

        // Острые шипы-колючки в пасти из лиан
        ctx.fillStyle = '#82bd51';
        ctx.beginPath(); ctx.moveTo(50, 70); ctx.lineTo(53, 77); ctx.lineTo(56, 70); ctx.fill();
        ctx.beginPath(); ctx.moveTo(61, 69); ctx.lineTo(64, 77); ctx.lineTo(67, 69); ctx.fill();
        ctx.beginPath(); ctx.moveTo(78, 70); ctx.lineTo(75, 77); ctx.lineTo(72, 70); ctx.fill();

        ctx.beginPath(); ctx.moveTo(54, 82); ctx.lineTo(57, 75); ctx.lineTo(60, 82); ctx.fill();
        ctx.beginPath(); ctx.moveTo(74, 82); ctx.lineTo(71, 75); ctx.lineTo(68, 82); ctx.fill();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 32);
        ctx.bezierCurveTo(32, 42, 22, 86, 22, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    hunter_spider() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. МАССИВНОЕ БРЮШКО С ТИГРОВЫМ УЗОРОМ ШЕВРОНОВ (Задний план сверху)
        ctx.fillStyle = '#4a2c18';
        ctx.beginPath();
        ctx.ellipse(64, 38, 27, 21, 0, 0, Math.PI * 2);
        ctx.fill();

        // Световой контур на правой половине брюшка
        ctx.fillStyle = '#633c22';
        ctx.beginPath();
        ctx.ellipse(68, 38, 21, 17, 0, -Math.PI * 0.5, Math.PI * 0.5);
        ctx.fill();

        // Охристо-рыжие хитиновые шевроны на спине охотника
        ctx.fillStyle = '#d9822b';
        ctx.beginPath();
        ctx.moveTo(49, 32); ctx.lineTo(64, 23); ctx.lineTo(79, 32); ctx.lineTo(75, 36); ctx.lineTo(64, 29); ctx.lineTo(53, 36);
        ctx.moveTo(45, 42); ctx.lineTo(64, 33); ctx.lineTo(83, 42); ctx.lineTo(79, 46); ctx.lineTo(64, 39); ctx.lineTo(49, 46);
        ctx.closePath();
        ctx.fill();

        // 2. ВОСЕМЬ ТОЛСТЫХ СУСТАВЧАТЫХ ПОЛОСАТЫХ ЛАП (В стойке перед прыжком)
        const drawHunterLeg = (x1, y1, x2, y2, x3, y3, isRight) => {
            // Основной толстый сегмент бедра и голени
            ctx.strokeStyle = isRight ? '#7a4924' : '#593418';
            ctx.lineWidth = 6.5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.stroke();

            // Заострённый сегмент лапки-коготка
            ctx.strokeStyle = isRight ? '#9c5f30' : '#7a4924';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.stroke();

            // Янтарно-рыжее суставчатое кольцо на сгибе лапы
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(x2, y2, 3.6, 0, Math.PI * 2);
            ctx.fill();
        };

        // Левые 4 лапы
        drawHunterLeg(44, 52, 16, 26, 6, 56, false);
        drawHunterLeg(40, 62, 10, 50, 4, 86, false);
        drawHunterLeg(40, 74, 12, 78, 12, 114, false);
        drawHunterLeg(45, 84, 20, 96, 24, 125, false);

        // Правые 4 лапы
        drawHunterLeg(84, 52, 112, 26, 122, 56, true);
        drawHunterLeg(88, 62, 118, 50, 124, 86, true);
        drawHunterLeg(88, 74, 116, 78, 116, 114, true);
        drawHunterLeg(83, 84, 108, 96, 104, 125, true);

        // 3. РЕЛЬЕФНАЯ ГОЛОВОГРУДЬ ПАУКА-ВОЛКА (На переднем плане по центру)
        ctx.fillStyle = '#6e401e';
        ctx.beginPath();
        ctx.moveTo(44, 52);
        ctx.quadraticCurveTo(64, 42, 84, 52);
        ctx.lineTo(88, 78);
        ctx.lineTo(74, 92);
        ctx.lineTo(54, 92);
        ctx.lineTo(40, 78);
        ctx.closePath();
        ctx.fill();

        // Светлая продольная полоса охотника на панцире головогруди
        ctx.fillStyle = '#e08e38';
        ctx.beginPath();
        ctx.moveTo(57, 47);
        ctx.lineTo(71, 47);
        ctx.lineTo(69, 64);
        ctx.lineTo(59, 64);
        ctx.closePath();
        ctx.fill();

        // 4. ГЛАЗА ПАУКА-ОХОТНИКА (Два гигантских фронтальных + 6 вспомогательных)
        ctx.fillStyle = '#2b170a';
        ctx.beginPath();
        ctx.roundRect(44, 62, 40, 18, 7);
        ctx.fill();

        // Два огромных центральных глаза-прожектора
        ctx.fillStyle = '#ff9f1a';
        ctx.beginPath(); ctx.arc(56, 71, 5.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(72, 71, 5.4, 0, Math.PI * 2); ctx.fill();

        // Боковая пара средних глаз
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.arc(47.5, 69, 2.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(80.5, 69, 2.8, 0, Math.PI * 2); ctx.fill();

        // Нижний ряд из 4 малых глаз
        ctx.beginPath(); ctx.arc(53, 77.5, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(60, 77.5, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(68, 77.5, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 77.5, 1.5, 0, Math.PI * 2); ctx.fill();

        // Живые белые блики в главных глазах
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(57.8, 69.2, 1.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(70.2, 69.2, 1.6, 0, Math.PI * 2); ctx.fill();

        // 5. МОЩНЫЕ ПЕДИПАЛЬПЫ И ХИЩНЫЕ ХЕЛИЦЕРЫ-КЛЫКИ
        // Толстые ловчие щупальца-педипальпы по бокам пасти
        ctx.strokeStyle = '#7a4924';
        ctx.lineWidth = 4.2;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(45, 84); ctx.lineTo(36, 98); ctx.lineTo(42, 112); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(83, 84); ctx.lineTo(92, 98); ctx.lineTo(86, 112); ctx.stroke();

        // Массивные хелицеры
        ctx.fillStyle = '#3b200d';
        ctx.beginPath(); ctx.moveTo(50, 86); ctx.lineTo(61, 104); ctx.lineTo(52, 106); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(78, 86); ctx.lineTo(67, 104); ctx.lineTo(76, 106); ctx.closePath(); ctx.fill();

        // Острые янтарно-алые жала клыков
        ctx.fillStyle = '#ea580c';
        ctx.beginPath(); ctx.moveTo(53, 102); ctx.quadraticCurveTo(58, 114, 61, 117); ctx.lineTo(60, 102); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(75, 102); ctx.quadraticCurveTo(70, 114, 67, 117); ctx.lineTo(68, 102); ctx.closePath(); ctx.fill();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 17);
        ctx.lineTo(16, 26);
        ctx.lineTo(4, 86);
        ctx.lineTo(24, 125);
        ctx.lineTo(64, 117);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    goblin() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. РЖАВЫЙ ЗАЗУБРЕННЫЙ ТЕСАК ЗА ПРАВЫМ ПЛЕЧОМ
        ctx.save();
        ctx.translate(102, 54);
        ctx.rotate((Math.PI / 180) * 26);

        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-5, 36);
        ctx.lineTo(-6, -24);
        ctx.quadraticCurveTo(-2, -38, 7, -42);
        ctx.lineTo(6, 36);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#854d27';
        ctx.beginPath();
        ctx.arc(0, -10, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(3, -30, 2.5, 64);
        ctx.restore();

        // 2. ДЛИННЫЕ ЗАОСТРЁННЫЕ УШИ ГОБЛИНА С ЗАЗУБРИНОЙ И СЕРЬГОЙ
        ctx.fillStyle = '#4d7c36';
        ctx.beginPath();
        ctx.moveTo(41, 62);
        ctx.lineTo(6, 54);
        ctx.lineTo(14, 64);
        ctx.lineTo(10, 68);
        ctx.lineTo(42, 82);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(87, 62);
        ctx.lineTo(122, 54);
        ctx.lineTo(86, 82);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#a39865';
        ctx.beginPath();
        ctx.moveTo(39, 66);
        ctx.lineTo(14, 60);
        ctx.lineTo(40, 77);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(89, 66);
        ctx.lineTo(114, 60);
        ctx.lineTo(88, 77);
        ctx.fill();

        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(14, 73, 3.8, 0, Math.PI * 2);
        ctx.stroke();

        // 3. ШЕЯ И РВАНЫЕ КОЖАНЫЕ ОБНОСКИ МАРОДЁРА
        ctx.fillStyle = '#4d7c36';
        ctx.fillRect(54, 88, 20, 22);

        ctx.fillStyle = '#3b2416';
        ctx.beginPath();
        ctx.moveTo(18, 128);
        ctx.lineTo(36, 100);
        ctx.lineTo(92, 100);
        ctx.lineTo(110, 128);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#6e1919';
        ctx.beginPath();
        ctx.moveTo(42, 98);
        ctx.quadraticCurveTo(64, 112, 86, 98);
        ctx.lineTo(82, 110);
        ctx.quadraticCurveTo(64, 120, 46, 110);
        ctx.closePath();
        ctx.fill();

        // 4. ШИРОКОЕ СКУЛАСТОЕ ЛИЦО ГОБЛИНА
        ctx.fillStyle = '#659e47';
        ctx.beginPath();
        ctx.moveTo(40, 54);
        ctx.lineTo(88, 54);
        ctx.lineTo(92, 78);
        ctx.lineTo(64, 104);
        ctx.lineTo(36, 78);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#78b556';
        ctx.beginPath();
        ctx.moveTo(45, 66);
        ctx.lineTo(83, 66);
        ctx.lineTo(80, 84);
        ctx.lineTo(64, 98);
        ctx.lineTo(48, 84);
        ctx.closePath();
        ctx.fill();

        // 5. КРУПНЫЕ ЖЁЛТЫЕ ГЛАЗА
        ctx.fillStyle = '#365924';
        ctx.beginPath();
        ctx.ellipse(50, 68, 7.5, 4.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(78, 68, 7.5, 4.2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.ellipse(50, 68, 6, 3.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(78, 68, 6, 3.2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.ellipse(50, 68, 1.4, 2.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(78, 68, 1.4, 2.8, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(51.5, 67, 0.9, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(76.5, 67, 0.9, 0, Math.PI * 2);
        ctx.fill();
        // 6. ДЛИННЫЙ НОС КРЮЧКОМ И ЕХИДНАЯ ЗУБАСТАЯ УХМЫЛКА
        ctx.fillStyle = '#4d7c36';
        ctx.beginPath();
        ctx.moveTo(60, 66);
        ctx.lineTo(68, 66);
        ctx.lineTo(66, 83);
        ctx.quadraticCurveTo(62, 85, 59, 81);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#1f3314';
        ctx.beginPath();
        ctx.moveTo(45, 86);
        ctx.quadraticCurveTo(64, 94, 83, 86);
        ctx.quadraticCurveTo(64, 98, 45, 86);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fef9c3';
        [50, 56, 62, 68, 74].forEach(zx => {
            ctx.beginPath();
            ctx.moveTo(zx, 88);
            ctx.lineTo(zx + 2, 92.5);
            ctx.lineTo(zx + 4, 88.5);
            ctx.closePath();
            ctx.fill();
        });

        // 7. ПОМЯТЫЙ РЖАВЫЙ ШЛЕМ МАРОДЁРА
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(36, 54);
        ctx.quadraticCurveTo(42, 22, 64, 18);
        ctx.quadraticCurveTo(86, 22, 92, 54);
        ctx.lineTo(88, 60);
        ctx.lineTo(64, 57);
        ctx.lineTo(40, 60);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#854d27';
        ctx.beginPath();
        ctx.ellipse(49, 38, 6, 4, -0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.moveTo(37, 52);
        ctx.lineTo(64, 50);
        ctx.lineTo(91, 52);
        ctx.lineTo(90, 58);
        ctx.lineTo(64, 56);
        ctx.lineTo(38, 58);
        ctx.closePath();
        ctx.fill();

        ctx.fillRect(62, 55, 4, 9);

        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(43, 55, 1.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(54, 54, 1.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(74, 54, 1.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(85, 55, 1.3, 0, Math.PI * 2);
        ctx.fill();

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 18);
        ctx.quadraticCurveTo(42, 22, 36, 54);
        ctx.lineTo(36, 78);
        ctx.lineTo(64, 104);
        ctx.lineTo(64, 128);
        ctx.lineTo(18, 128);
        ctx.lineTo(36, 100);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    wolf() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАДНИЙ ПЛАН: Мощная пушистая холка и грива на шее
        ctx.fillStyle = '#2d3748';
        ctx.beginPath();
        ctx.moveTo(64, 56);
        ctx.quadraticCurveTo(106, 68, 122, 128);
        ctx.lineTo(38, 128);
        ctx.quadraticCurveTo(46, 94, 54, 80);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#1a202c';
        ctx.beginPath();
        ctx.moveTo(86, 66);
        ctx.lineTo(102, 58);
        ctx.lineTo(96, 74);
        ctx.moveTo(98, 84);
        ctx.lineTo(116, 80);
        ctx.lineTo(106, 96);
        ctx.closePath();
        ctx.fill();

        // 2. ОСТРЫЕ СТОЯЧИЕ ВОЛЧЬИ УШИ
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(62, 42);
        ctx.lineTo(54, 14);
        ctx.lineTo(74, 36);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(78, 44);
        ctx.lineTo(94, 14);
        ctx.lineTo(94, 52);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(81, 43);
        ctx.lineTo(91, 21);
        ctx.lineTo(91, 48);
        ctx.closePath();
        ctx.fill();

        // 3. ВЕРХНЯЯ ЧЕЛЮСТЬ И ЧЕРЕП ВОЛКА
        ctx.fillStyle = '#4a5568';
        ctx.beginPath();
        ctx.moveTo(92, 48);
        ctx.lineTo(68, 36);
        ctx.lineTo(18, 60);
        ctx.lineTo(22, 72);
        ctx.lineTo(58, 78);
        ctx.lineTo(90, 78);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#2d3748';
        ctx.beginPath();
        ctx.moveTo(22, 58);
        ctx.lineTo(66, 38);
        ctx.lineTo(72, 45);
        ctx.lineTo(26, 63);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(56, 84);
        ctx.lineTo(90, 78);
        ctx.quadraticCurveTo(96, 104, 88, 128);
        ctx.lineTo(44, 128);
        ctx.quadraticCurveTo(48, 100, 56, 84);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.moveTo(86, 62);
        ctx.lineTo(100, 68);
        ctx.lineTo(92, 75);
        ctx.lineTo(102, 82);
        ctx.lineTo(86, 86);
        ctx.closePath();
        ctx.fill();

        // 4. ЧЁРНАЯ МОЧКА НОСА И МОРЩИНЫ ОСКАЛА
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(18, 60);
        ctx.quadraticCurveTo(14, 64, 19, 68);
        ctx.lineTo(24, 63);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(33, 57);
        ctx.lineTo(36, 63);
        ctx.moveTo(39, 55);
        ctx.lineTo(42, 61);
        ctx.stroke();

        // 5. ОСКАЛЕННАЯ ПАСТЬ И БЕЛЫЕ КЛЫКИ
        ctx.fillStyle = '#1e0b0e';
        ctx.beginPath();
        ctx.moveTo(22, 71);
        ctx.lineTo(60, 78);
        ctx.lineTo(30, 91);
        ctx.lineTo(25, 84);
        ctx.lineTo(48, 77);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(58, 77);
        ctx.lineTo(25, 85);
        ctx.lineTo(31, 93);
        ctx.lineTo(64, 90);
        ctx.lineTo(90, 78);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(25, 71);
        ctx.lineTo(28, 79);
        ctx.lineTo(31, 72);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(36, 73);
        ctx.lineTo(39, 78);
        ctx.lineTo(42, 74);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(45, 75);
        ctx.lineTo(48, 79);
        ctx.lineTo(51, 76);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(29, 85);
        ctx.lineTo(32, 78);
        ctx.lineTo(35, 84);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(38, 82);
        ctx.lineTo(41, 77);
        ctx.lineTo(44, 81);
        ctx.fill();

        // 6. ЯНТАРНЫЙ ГЛАЗ ХИЩНИКА
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(55, 51);
        ctx.lineTo(69, 46);
        ctx.lineTo(65, 56);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(61.5, 51, 1.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(60.5, 50, 0.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(52, 48);
        ctx.lineTo(69, 44);
        ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(25, 85);
        ctx.lineTo(64, 90);
        ctx.lineTo(90, 78);
        ctx.lineTo(122, 128);
        ctx.lineTo(38, 128);
        ctx.lineTo(54, 86);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },
    spider() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. МАССИВНОЕ БРЮШКО С БАГРОВЫМ УЗОРОМ «ПЕСОЧНЫХ ЧАСОВ»
        ctx.fillStyle = '#141821';
        ctx.beginPath();
        ctx.ellipse(64, 38, 28, 22, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1f2633';
        ctx.beginPath();
        ctx.ellipse(68, 38, 22, 18, 0, -Math.PI * 0.5, Math.PI * 0.5);
        ctx.fill();

        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.moveTo(57, 25);
        ctx.lineTo(71, 25);
        ctx.lineTo(64, 34);
        ctx.lineTo(71, 43);
        ctx.lineTo(57, 43);
        ctx.lineTo(64, 34);
        ctx.closePath();
        ctx.fill();

        // 2. ВОСЕМЬ ТОЛСТЫХ СУСТАВЧАТЫХ ХИТИНОВЫХ ЛАП
        const drawSpiderLeg = (x1, y1, x2, y2, x3, y3, isRight) => {
            ctx.strokeStyle = isRight ? '#262f3d' : '#181e29';
            ctx.lineWidth = 6.5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.stroke();

            ctx.strokeStyle = isRight ? '#3b485c' : '#262f3d';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.stroke();

            ctx.fillStyle = isRight ? '#3b485c' : '#262f3d';
            ctx.beginPath();
            ctx.arc(x2, y2, 3.6, 0, Math.PI * 2);
            ctx.fill();
        };

        drawSpiderLeg(44, 52, 16, 26, 6, 56, false);
        drawSpiderLeg(40, 62, 10, 50, 4, 86, false);
        drawSpiderLeg(40, 74, 12, 78, 12, 114, false);
        drawSpiderLeg(45, 84, 22, 98, 26, 126, false);

        drawSpiderLeg(84, 52, 112, 26, 122, 56, true);
        drawSpiderLeg(88, 62, 118, 50, 124, 86, true);
        drawSpiderLeg(88, 74, 116, 78, 116, 114, true);
        drawSpiderLeg(83, 84, 106, 98, 102, 126, true);

        // 3. РЕЛЬЕФНАЯ ГОЛОВОГРУДЬ ПАУКА
        ctx.fillStyle = '#1e2430';
        ctx.beginPath();
        ctx.moveTo(44, 52);
        ctx.quadraticCurveTo(64, 42, 84, 52);
        ctx.lineTo(88, 78);
        ctx.lineTo(74, 92);
        ctx.lineTo(54, 92);
        ctx.lineTo(40, 78);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#2c3547';
        ctx.beginPath();
        ctx.moveTo(52, 48);
        ctx.quadraticCurveTo(64, 44, 76, 48);
        ctx.lineTo(72, 64);
        ctx.lineTo(56, 64);
        ctx.closePath();
        ctx.fill();

        // 4. ГРОЗДЬ ИЗ 8 СВЕТЯЩИХСЯ ИЗУМРУДНЫХ ГЛАЗ
        ctx.fillStyle = '#0d1017';
        ctx.beginPath();
        ctx.roundRect(44, 62, 40, 18, 7);
        ctx.fill();

        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(57, 71, 4.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(71, 71, 4.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#34d399';
        ctx.beginPath();
        ctx.arc(48, 69, 2.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(80, 69, 2.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(53, 64.5, 1.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(60, 64, 1.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(68, 64, 1.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(75, 64.5, 1.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(58.5, 69.5, 1.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(69.5, 69.5, 1.4, 0, Math.PI * 2);
        ctx.fill();

        // 5. ПЕДИПАЛЬПЫ, ХЕЛИЦЕРЫ И КАПЛИ ЯДА
        ctx.strokeStyle = '#262f3d';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(45, 84);
        ctx.lineTo(36, 98);
        ctx.lineTo(42, 112);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(83, 84);
        ctx.lineTo(92, 98);
        ctx.lineTo(86, 112);
        ctx.stroke();

        ctx.fillStyle = '#12161f';
        ctx.beginPath();
        ctx.moveTo(50, 86);
        ctx.lineTo(61, 104);
        ctx.lineTo(52, 106);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(78, 86);
        ctx.lineTo(67, 104);
        ctx.lineTo(76, 106);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(53, 102);
        ctx.quadraticCurveTo(58, 114, 61, 116);
        ctx.lineTo(60, 102);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(75, 102);
        ctx.quadraticCurveTo(70, 114, 67, 116);
        ctx.lineTo(68, 102);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(60.5, 120, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(67.5, 122, 1.7, 0, Math.PI * 2);
        ctx.fill();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.moveTo(64, 16);
        ctx.lineTo(16, 26);
        ctx.lineTo(4, 86);
        ctx.lineTo(26, 126);
        ctx.lineTo(64, 116);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    }
};

