/**
 * ГЕНЕРАТОРЫ АВАТАРОК: ИГРОВЫЕ ПЕРСОНАЖИ И СПУТНИКИ
 */
export const HeroAvatars = {

    battle_priestess() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗОЛОТОЙ СВЯЩЕННЫЙ СКИПЕТР ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.save();
        ctx.translate(102, 46);
        ctx.rotate((Math.PI / 180) * 22);

        // Древко скипетра из золота и тёмного дерева
        ctx.strokeStyle = '#b8860b';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(0, 92);
        ctx.stroke();

        // Декоративные золотые кольца-перехваты на древке
        ctx.fillStyle = '#ffd875';
        ctx.fillRect(-3.5, 4, 7, 3);
        ctx.fillRect(-3.5, 22, 7, 3);

        // Ореол святого лазурного сияния вокруг навершия
        ctx.fillStyle = 'rgba(56, 189, 248, 0.28)';
        ctx.beginPath();
        ctx.arc(0, -18, 16, 0, Math.PI * 2);
        ctx.fill();

        // Резная золотая корона-оправа скипетра с крылышками
        ctx.fillStyle = '#ffd875';
        ctx.strokeStyle = '#8a6421';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-4, -10);
        ctx.lineTo(-14, -22);
        ctx.lineTo(-6, -18);
        ctx.lineTo(0, -32);
        ctx.lineTo(6, -18);
        ctx.lineTo(14, -22);
        ctx.lineTo(4, -10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Сияющий лазурный кристалл в сердцевине скипетра
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(0, -25);
        ctx.lineTo(5, -18);
        ctx.lineTo(0, -11);
        ctx.lineTo(-5, -18);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-1.2, -19.5, 1.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 2. ПЫШНЫЕ ПЛАТИНОВЫЕ ВОЛОСЫ И ТЯЖЁЛЫЕ ЛАТЫ ВАЛЬКИРИИ
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(34, 54);
        ctx.quadraticCurveTo(22, 92, 20, 128);
        ctx.lineTo(108, 128);
        ctx.quadraticCurveTo(106, 92, 94, 54);
        ctx.closePath();
        ctx.fill();

        // Стальной нагрудник и латный воротник-горжет
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(34, 96);
        ctx.lineTo(94, 96);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        // Рельефные золотые наплечники
        ctx.fillStyle = '#d4af37';
        ctx.strokeStyle = '#785a14';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(14, 124);
        ctx.quadraticCurveTo(20, 96, 44, 98);
        ctx.lineTo(38, 128);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(114, 124);
        ctx.quadraticCurveTo(108, 96, 84, 98);
        ctx.lineTo(90, 128);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Золотой нагрудный символ солнца по центру лат
        ctx.fillStyle = '#ffd875';
        ctx.beginPath(); ctx.arc(64, 114, 6.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(64, 114, 2.5, 0, Math.PI * 2); ctx.fill();

        // 3. ШЕЯ И ВЫРАЗИТЕЛЬНОЕ ЛИЦО БОЕВОЙ ЖРИЦЫ
        ctx.fillStyle = '#e5b89b';
        ctx.fillRect(55, 86, 18, 16);

        ctx.fillStyle = '#ffedd8';
        ctx.beginPath();
        ctx.moveTo(45, 50);
        ctx.quadraticCurveTo(64, 34, 83, 50);
        ctx.lineTo(81, 79);
        ctx.lineTo(64, 97);
        ctx.lineTo(47, 79);
        ctx.closePath();
        ctx.fill();

        // Тонкий лазурный ритуальный знак под глазами
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(54, 67); ctx.lineTo(54, 72);
        ctx.moveTo(74, 67); ctx.lineTo(74, 72);
        ctx.stroke();

        // Передние платиновые пряди волос, обрамляющие лицо
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(44, 42); ctx.quadraticCurveTo(38, 66, 43, 88); ctx.lineTo(48, 84); ctx.quadraticCurveTo(45, 64, 49, 46);
        ctx.moveTo(84, 42); ctx.quadraticCurveTo(90, 66, 85, 88); ctx.lineTo(80, 84); ctx.quadraticCurveTo(83, 64, 79, 46);
        ctx.fill();

        // 4. БОЕВОЙ ВЕНЕЦ-ТИАРА С ЗОЛОТЫМИ КРЫЛЬЯМИ ВАЛЬКИРИИ
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(42, 46);
        ctx.quadraticCurveTo(46, 24, 64, 22);
        ctx.quadraticCurveTo(82, 24, 86, 46);
        ctx.closePath();
        ctx.fill();

        // Крылья валькирии по бокам венца
        ctx.fillStyle = '#ffd875';
        ctx.strokeStyle = '#8a6421';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(45, 45);
        ctx.lineTo(24, 24);
        ctx.lineTo(34, 38);
        ctx.lineTo(28, 42);
        ctx.lineTo(43, 50);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(83, 45);
        ctx.lineTo(104, 24);
        ctx.lineTo(94, 38);
        ctx.lineTo(100, 42);
        ctx.lineTo(85, 50);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Стальной налобный обруч с золотым центральным гребнем
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.moveTo(43, 46);
        ctx.lineTo(64, 41);
        ctx.lineTo(85, 46);
        ctx.lineTo(84, 51);
        ctx.lineTo(64, 47);
        ctx.lineTo(44, 51);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffd875';
        ctx.beginPath();
        ctx.moveTo(60, 46);
        ctx.lineTo(64, 34);
        ctx.lineTo(68, 46);
        ctx.closePath();
        ctx.fill();

        // 5. ЯСНЫЕ, РЕШИТЕЛЬНЫЕ ГЛАЗА, БРОВИ И ТВЁРДАЯ ПОЛУУЛЫБКА
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(54, 61, 4.8, 2.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 61, 4.8, 2.2, 0, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0ea5e9';
        ctx.beginPath(); ctx.arc(54, 61, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 61, 2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0c4a6e';
        ctx.beginPath(); ctx.arc(54, 61, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 61, 1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(54.8, 60.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74.8, 60.2, 0.7, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(49, 60.5); ctx.quadraticCurveTo(54, 58.2, 59, 60.5);
        ctx.moveTo(69, 60.5); ctx.quadraticCurveTo(74, 58.2, 79, 60.5);
        ctx.stroke();

        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(47, 55.5); ctx.lineTo(59, 57);
        ctx.moveTo(81, 55.5); ctx.lineTo(69, 57);
        ctx.stroke();

        ctx.strokeStyle = '#d9a786';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 58); ctx.lineTo(62.5, 73); ctx.lineTo(65.5, 73); ctx.stroke();

        ctx.fillStyle = '#d96b6b';
        ctx.beginPath();
        ctx.ellipse(64, 82, 4.8, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // 6. СВЯЩЕННЫЙ ЩИТ С ЗОЛОТЫМ КРЕСТОМ НА ПЕРЕДНЕМ ПЛАНЕ (Слева снизу)
        ctx.save();
        ctx.translate(27, 104);
        ctx.rotate((Math.PI / 180) * -8);

        // Внешняя золотая окантовка щита
        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(-17, -20);
        ctx.lineTo(17, -20);
        ctx.lineTo(15, 6);
        ctx.lineTo(0, 24);
        ctx.lineTo(-15, 6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Внутренний лазурный контур поля щита
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-13, -16);
        ctx.lineTo(13, -16);
        ctx.lineTo(11.5, 4.5);
        ctx.lineTo(0, 19);
        ctx.lineTo(-11.5, 4.5);
        ctx.closePath();
        ctx.stroke();

        // Крупный золотой крест по центру щита
        ctx.fillStyle = '#d4af37';
        ctx.fillRect(-2.2, -14, 4.4, 30);
        ctx.fillRect(-11, -5.5, 22, 4.4);

        // Сияющий лазурный самоцвет в перекрестии
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(0, -3.3, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 22);
        ctx.quadraticCurveTo(46, 24, 42, 46);
        ctx.lineTo(47, 79);
        ctx.lineTo(64, 97);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.lineTo(34, 54);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    wizardess() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. АРКАННЫЙ ПОСОХ С ПАРЯЩИМ КРИСТАЛЛОМ ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.save();
        ctx.translate(104, 48);
        ctx.rotate((Math.PI / 180) * 20);

        // Тёмное руническое древко посоха
        ctx.strokeStyle = '#3b2416';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, -4);
        ctx.lineTo(0, 90);
        ctx.stroke();

        // Золотая оправа навершия посоха
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-7, -8);
        ctx.quadraticCurveTo(0, 2, 7, -8);
        ctx.stroke();

        // Ореол тайной магии вокруг парящего кристалла
        ctx.fillStyle = 'rgba(168, 85, 247, 0.3)';
        ctx.beginPath();
        ctx.arc(0, -18, 16, 0, Math.PI * 2);
        ctx.fill();

        // Огранённый аметистовый кристалл
        ctx.fillStyle = '#c084fc';
        ctx.strokeStyle = '#f3e8ff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -29);
        ctx.lineTo(7, -18);
        ctx.lineTo(0, -7);
        ctx.lineTo(-7, -18);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 2. ДЛИННЫЕ ПЛАТИНОВЫЕ ВОЛОСЫ И ТЁМНО-ПУРПУРНАЯ МАНТИЯ ЧАРОДЕЙКИ
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(34, 54);
        ctx.quadraticCurveTo(22, 92, 20, 128);
        ctx.lineTo(108, 128);
        ctx.quadraticCurveTo(106, 92, 94, 54);
        ctx.closePath();
        ctx.fill();

        // Мантия с высоким воротником и золотым шитьём
        ctx.fillStyle = '#2e1042';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(34, 96);
        ctx.lineTo(94, 96);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        // Золотой кант и рунический медальон на груди
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(42, 98); ctx.lineTo(64, 124); ctx.lineTo(86, 98);
        ctx.stroke();

        ctx.fillStyle = '#a855f7';
        ctx.beginPath(); ctx.arc(64, 114, 4.5, 0, Math.PI * 2); ctx.fill();

        // 3. ШЕЯ И ГАРМОНИЧНЫЙ ОВАЛ ЛИЦА
        ctx.fillStyle = '#e6be9e';
        ctx.fillRect(55, 86, 18, 16);

        ctx.fillStyle = '#ffedd8';
        ctx.beginPath();
        ctx.moveTo(45, 50);
        ctx.quadraticCurveTo(64, 34, 83, 50);
        ctx.lineTo(81, 79);
        ctx.lineTo(64, 97);
        ctx.lineTo(47, 79);
        ctx.closePath();
        ctx.fill();

        // Передние платиновые пряди волос по бокам лица
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(44, 44); ctx.quadraticCurveTo(38, 68, 43, 88); ctx.lineTo(48, 84); ctx.quadraticCurveTo(45, 64, 49, 47);
        ctx.moveTo(84, 44); ctx.quadraticCurveTo(90, 68, 85, 88); ctx.lineTo(80, 84); ctx.quadraticCurveTo(83, 64, 79, 47);
        ctx.fill();

        // 4. ШЁЛКОВЫЙ КАПЮШОН ЧАРОДЕЙКИ С ЗОЛОТОЙ КАЙМОЙ (Открытый, не давит на глаза)
        ctx.fillStyle = '#3b1554';
        ctx.beginPath();
        ctx.moveTo(36, 54);
        ctx.quadraticCurveTo(44, 22, 64, 20);
        ctx.quadraticCurveTo(84, 22, 92, 54);
        ctx.lineTo(85, 51);
        ctx.quadraticCurveTo(64, 36, 43, 51);
        ctx.closePath();
        ctx.fill();

        // Золотая вышивка по краю капюшона и капелька-самоцвет на лбу
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(39, 52);
        ctx.quadraticCurveTo(64, 35, 89, 52);
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(64, 44.5, 2.2, 0, Math.PI * 2); ctx.fill();

        // 5. РОВНЫЕ, ЯСНЫЕ И ЗАГАДОЧНЫЕ ГЛАЗА (Без раскосости и грусти)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(54, 61, 4.8, 2.3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 61, 4.8, 2.3, 0, 0, Math.PI * 2); ctx.fill();

        // Яркая аметистово-фиолетовая радужка
        ctx.fillStyle = '#9333ea';
        ctx.beginPath(); ctx.arc(54, 61, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 61, 2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#3b0764';
        ctx.beginPath(); ctx.arc(54, 61, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 61, 1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(54.8, 60.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74.8, 60.2, 0.7, 0, Math.PI * 2); ctx.fill();

        // Выразительные ресницы по верхнему веку
        ctx.strokeStyle = '#1e1b4b';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(49, 60.5); ctx.quadraticCurveTo(54, 58.2, 59, 60.5);
        ctx.moveTo(69, 60.5); ctx.quadraticCurveTo(74, 58.2, 79, 60.5);
        ctx.stroke();

        // Изящные уверенные брови
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(48, 55.5); ctx.quadraticCurveTo(54, 54, 59, 55.5);
        ctx.moveTo(69, 55.5); ctx.quadraticCurveTo(74, 54, 80, 55.5);
        ctx.stroke();

        // Аккуратный носик и спокойная полуулыбка
        ctx.strokeStyle = '#d9a786';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 58); ctx.lineTo(62.5, 73); ctx.lineTo(65.5, 73); ctx.stroke();

        ctx.fillStyle = '#c05682';
        ctx.beginPath();
        ctx.ellipse(64, 82, 4.8, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#701a3c';
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(59, 81.8); ctx.quadraticCurveTo(64, 83.2, 69, 81.8);
        ctx.stroke();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 20);
        ctx.quadraticCurveTo(44, 22, 36, 54);
        ctx.lineTo(47, 79);
        ctx.lineTo(64, 97);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.lineTo(34, 54);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    dwarf_paladin() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. МАССИВНЫЙ ЖЕЛЕЗНЫЙ БОЕВОЙ МОЛОТ ЗА ПРАВЫМ ПЛЕЧОМ
        ctx.save();
        ctx.translate(100, 46);
        ctx.rotate((Math.PI / 180) * 22);

        // Окованная железом рукоять
        ctx.strokeStyle = '#3b2514';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, -14);
        ctx.lineTo(0, 86);
        ctx.stroke();

        // Стальная пика сверху молота
        ctx.fillStyle = '#7f8c8d';
        ctx.beginPath();
        ctx.moveTo(-4, -14);
        ctx.lineTo(0, -27);
        ctx.lineTo(4, -14);
        ctx.closePath();
        ctx.fill();

        // Тяжёлый кованый боёк с фасками и боевыми зазубринами
        ctx.fillStyle = '#4a5568';
        ctx.strokeStyle = '#1a202c';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.roundRect(-16, -14, 32, 18, 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#9aa5b4';
        ctx.fillRect(-14, -12, 28, 4);
        ctx.fillStyle = '#d4af37';
        ctx.fillRect(-1.5, -11, 3, 12);
        ctx.fillRect(-5, -6.5, 10, 3);
        ctx.restore();

        // 2. ТЯЖЁЛЫЕ ЛАТНЫЕ НАПЛЕЧНИКИ И КОЛЬЧУЖНЫЙ ГОРЖЕТ
        ctx.fillStyle = '#374151';
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.lineTo(32, 95);
        ctx.lineTo(96, 95);
        ctx.lineTo(114, 128);
        ctx.closePath();
        ctx.fill();

        // Закалённый золотой кант лат
        ctx.fillStyle = '#9c7832';
        ctx.beginPath();
        ctx.moveTo(40, 98);
        ctx.lineTo(54, 88);
        ctx.lineTo(74, 88);
        ctx.lineTo(88, 98);
        ctx.closePath();
        ctx.fill();

        // 3. СУРОВОЕ ОБВЕТРЕННОЕ ЛИЦО С РУБЛЕНЫМИ СКУЛАМИ
        ctx.fillStyle = '#b87e62'; // Обветренная загорелая кожа
        ctx.beginPath();
        ctx.moveTo(41, 46);
        ctx.lineTo(64, 34);
        ctx.lineTo(87, 46);
        ctx.lineTo(88, 72);
        ctx.lineTo(81, 86);
        ctx.lineTo(64, 102);
        ctx.lineTo(47, 86);
        ctx.lineTo(40, 72);
        ctx.closePath();
        ctx.fill();

        // Тёмно-медные волосы на висках и зачёс назад
        ctx.fillStyle = '#632612';
        ctx.beginPath();
        ctx.moveTo(39, 56);
        ctx.quadraticCurveTo(40, 28, 64, 26);
        ctx.quadraticCurveTo(88, 28, 89, 56);
        ctx.lineTo(85, 48);
        ctx.quadraticCurveTo(64, 38, 43, 48);
        ctx.closePath();
        ctx.fill();

        // Складки морщин на суровом лбу
        ctx.strokeStyle = '#87533b';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(52, 43); ctx.quadraticCurveTo(64, 45, 76, 43);
        ctx.moveTo(55, 47); ctx.quadraticCurveTo(64, 49, 73, 47);
        ctx.stroke();

        // 4. ГЛУБОКИЕ ГЛАЗНИЦЫ, НАХМУРЕННЫЕ БРОВИ И ШРАМ
        // Глубокая тень под тяжёлой надбровной дугой
        ctx.fillStyle = 'rgba(42, 20, 12, 0.45)';
        ctx.beginPath();
        ctx.moveTo(43, 55);
        ctx.lineTo(64, 60);
        ctx.lineTo(85, 55);
        ctx.lineTo(82, 65);
        ctx.lineTo(64, 64);
        ctx.lineTo(46, 65);
        ctx.closePath();
        ctx.fill();

        // Узкий, жёсткий прищур стальных глаз
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(47, 59); ctx.lineTo(58, 61); ctx.lineTo(56, 63); ctx.lineTo(48, 62);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(81, 59); ctx.lineTo(70, 61); ctx.lineTo(72, 63); ctx.lineTo(80, 62);
        ctx.closePath();
        ctx.fill();

        // Ледяные голубовато-серые зрачки паладина
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(53, 61, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 61, 1.5, 0, Math.PI * 2); ctx.fill();

        // Густые, агрессивно сведённые к переносице брови
        ctx.fillStyle = '#521d0c';
        ctx.beginPath();
        ctx.moveTo(42, 52); ctx.lineTo(60, 58); ctx.lineTo(59, 61); ctx.lineTo(42, 56);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(86, 52); ctx.lineTo(68, 58); ctx.lineTo(69, 61); ctx.lineTo(86, 56);
        ctx.closePath();
        ctx.fill();

        // Боевой шрам через правую бровь и скулу
        ctx.strokeStyle = '#7a3326';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(73, 50);
        ctx.lineTo(79, 73);
        ctx.stroke();

        // Рубленый, массивный нос с горбинкой и тенью
        ctx.fillStyle = '#a3694e';
        ctx.beginPath();
        ctx.moveTo(61, 58);
        ctx.lineTo(67, 58);
        ctx.lineTo(70, 73);
        ctx.lineTo(64, 76);
        ctx.lineTo(58, 73);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#c98e71'; // Световая грань спинки носа
        ctx.beginPath();
        ctx.moveTo(63, 59); ctx.lineTo(66, 59); ctx.lineTo(66, 73); ctx.lineTo(63, 73);
        ctx.closePath();
        ctx.fill();

        // 5. ТЯЖЁЛАЯ ТЁМНО-МЕДНАЯ БОРОДА С КОСАМИ И ЖЕЛЕЗНЫМИ ЗАЖИМАМИ
        ctx.fillStyle = '#7c2d12';
        ctx.beginPath();
        ctx.moveTo(41, 74);
        ctx.lineTo(31, 102);
        ctx.lineTo(43, 128);
        ctx.lineTo(85, 128);
        ctx.lineTo(97, 102);
        ctx.lineTo(87, 74);
        ctx.quadraticCurveTo(64, 85, 41, 74);
        ctx.closePath();
        ctx.fill();

        // Рельефные пряди и тени в бороде
        ctx.strokeStyle = '#4a1807';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(52, 86); ctx.lineTo(49, 126);
        ctx.moveTo(64, 88); ctx.lineTo(64, 128);
        ctx.moveTo(76, 86); ctx.lineTo(79, 126);
        ctx.stroke();

        // Угрюмые, опущенные вниз густые усы
        ctx.fillStyle = '#5c1f0b';
        ctx.beginPath();
        ctx.moveTo(47, 78);
        ctx.quadraticCurveTo(64, 73, 81, 78);
        ctx.lineTo(85, 89);
        ctx.quadraticCurveTo(64, 81, 43, 89);
        ctx.closePath();
        ctx.fill();

        // Стальные зажимы на косах бороды
        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.fillRect(45, 117, 9, 5); ctx.strokeRect(45, 117, 9, 5);
        ctx.fillRect(74, 117, 9, 5); ctx.strokeRect(74, 117, 9, 5);

        // Кованый обруч-диадема паладина на лбу
        ctx.fillStyle = '#c89d46';
        ctx.strokeStyle = '#5c4212';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(41, 48);
        ctx.lineTo(64, 41);
        ctx.lineTo(87, 48);
        ctx.lineTo(85, 43);
        ctx.lineTo(64, 36);
        ctx.lineTo(43, 43);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 6. ЖЕЛЕЗНЫЙ ЩИТ В ВИДЕ РОМБОВИДНОЙ КАПЛИ (На переднем плане слева снизу)
        ctx.save();
        ctx.translate(28, 102);
        ctx.rotate((Math.PI / 180) * -10);

        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -28);
        ctx.lineTo(20, -8);
        ctx.lineTo(0, 32);
        ctx.lineTo(-20, -8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(0, -22);
        ctx.lineTo(15, -7);
        ctx.lineTo(0, 25);
        ctx.lineTo(-15, -7);
        ctx.closePath();
        ctx.fill();

        // Золотой крест и стальные заклёпки на щите
        ctx.fillStyle = '#d4af37';
        ctx.fillRect(-1.5, -18, 3, 36);
        ctx.fillRect(-10, -8.5, 20, 3);

        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath(); ctx.arc(0, -24.5, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(17, -7.5, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(-17, -7.5, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(0, 27.5, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Глубокая тень на левую половину лица и бороды)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.moveTo(64, 26);
        ctx.lineTo(41, 46);
        ctx.lineTo(40, 72);
        ctx.lineTo(31, 102);
        ctx.lineTo(43, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    tabaxi_monk() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. БАМБУКОВЫЙ БОЕВОЙ ШЕСТ БО ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.save();
        ctx.translate(98, 64);
        ctx.rotate((Math.PI / 180) * 26);

        // Ствол бамбукового шеста
        ctx.fillStyle = '#c89d46';
        ctx.strokeStyle = '#5c4212';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.roundRect(-3.5, -62, 7, 132, 3);
        ctx.fill();
        ctx.stroke();

        // Узловые кольца бамбука
        ctx.fillStyle = '#785a14';
        ctx.fillRect(-4, -38, 8, 2.5);
        ctx.fillRect(-4, -8, 8, 2.5);
        ctx.fillRect(-4, 22, 8, 2.5);
        ctx.restore();

        // 2. МОНАШЕСКОЕ ОДЕЯНИЕ И КРУПНЫЕ ДЕРЕВЯННЫЕ ЧЁТКИ
        // Шафранно-оранжевая роба монаха
        ctx.fillStyle = '#d35400';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(36, 96);
        ctx.lineTo(92, 96);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        // Тёмно-багровый воротник-запах робы
        ctx.fillStyle = '#7b241c';
        ctx.beginPath();
        ctx.moveTo(38, 96);
        ctx.lineTo(64, 126);
        ctx.lineTo(90, 96);
        ctx.lineTo(82, 94);
        ctx.lineTo(64, 114);
        ctx.lineTo(46, 94);
        ctx.closePath();
        ctx.fill();

        // Крупные деревянные бусины монашеских чёток на шее
        ctx.fillStyle = '#4a2c18';
        ctx.strokeStyle = '#241409';
        ctx.lineWidth = 1;
        [, [48, 109], [55, 114], [64, 116], [73, 114], [80, 109], [85, 102]
        ].forEach(([bx, by]) => {
            ctx.beginPath();
            ctx.arc(bx, by, 4.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });

        // 3. ЗАОСТРЁННЫЕ КОШАЧЬИ УШИ С КИСТОЧКАМИ
        ctx.fillStyle = '#b87333';
        // Левое ухо
        ctx.beginPath();
        ctx.moveTo(41, 48);
        ctx.lineTo(30, 16);
        ctx.lineTo(56, 38);
        ctx.closePath();
        ctx.fill();

        // Правое ухо
        ctx.beginPath();
        ctx.moveTo(87, 48);
        ctx.lineTo(98, 16);
        ctx.lineTo(72, 38);
        ctx.closePath();
        ctx.fill();

        // Тёмные рысьи кисточки на кончиках ушей и розовая раковина внутри
        ctx.strokeStyle = '#3b2414';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(30, 16); ctx.lineTo(27, 9);
        ctx.moveTo(98, 16); ctx.lineTo(101, 9);
        ctx.stroke();

        ctx.fillStyle = '#e6a89c';
        ctx.beginPath(); ctx.moveTo(42, 45); ctx.lineTo(34, 23); ctx.lineTo(52, 39); ctx.fill();
        ctx.beginPath(); ctx.moveTo(86, 45); ctx.lineTo(94, 23); ctx.lineTo(76, 39); ctx.fill();

        // 4. ГОЛОВА ТАБАКСИ С ПЯТНИСТЫМ ОКРАСОМ И БАКЕНБАРДАМИ
        ctx.fillStyle = '#d98a3c'; // Тёплый золотисто-рыжий мех
        ctx.beginPath();
        ctx.moveTo(42, 42);
        ctx.quadraticCurveTo(64, 32, 86, 42);
        ctx.lineTo(96, 68); // Пушистая левая бакенбарда
        ctx.lineTo(82, 88);
        ctx.lineTo(64, 98);
        ctx.lineTo(46, 88);
        ctx.lineTo(32, 68); // Пушистая правая бакенбарда
        ctx.closePath();
        ctx.fill();

        // Леопардовые пятна-розетки на лбу и щеках
        ctx.fillStyle = '#5c3416';
        ctx.beginPath(); ctx.arc(64, 42, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(54, 45, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 45, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(38, 66, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(90, 66, 2.2, 0, Math.PI * 2); ctx.fill();

        // Светлые кремовые подусники и подбородок
        ctx.fillStyle = '#f5e6cc';
        ctx.beginPath(); ctx.arc(55, 79, 7.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(73, 79, 7.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(52, 85); ctx.lineTo(64, 96); ctx.lineTo(76, 85);
        ctx.closePath();
        ctx.fill();

        // 5. СПОКОЙНЫЙ МУДРЫЙ ВЗГЛЯД ЯНТАРНЫХ ГЛАЗ И ТОНКАЯ ПОЛУУЛЫБКА
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath(); ctx.ellipse(51, 59, 6, 3.6, -0.08, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(77, 59, 6, 3.6, 0.08, 0, Math.PI * 2); ctx.fill();

        // Вертикальные кошачьи зрачки
        ctx.fillStyle = '#111111';
        ctx.beginPath(); ctx.ellipse(51, 59, 1.5, 3.4, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(77, 59, 1.5, 3.4, 0, 0, Math.PI * 2); ctx.fill();

        // Блики
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(52.8, 57.5, 1.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75.2, 57.5, 1.1, 0, Math.PI * 2); ctx.fill();

        // Сосредоточенные надбровные линии
        ctx.strokeStyle = '#4a2c18';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(43, 53); ctx.quadraticCurveTo(51, 51, 57, 54);
        ctx.moveTo(85, 53); ctx.quadraticCurveTo(77, 51, 71, 54);
        ctx.stroke();

        // Кошачий носик и спокойная улыбка мастера
        ctx.fillStyle = '#c96f65';
        ctx.beginPath();
        ctx.moveTo(59, 71); ctx.lineTo(69, 71); ctx.lineTo(64, 76);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#4a2c18';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(64, 76); ctx.lineTo(64, 81);
        ctx.moveTo(56, 81); ctx.quadraticCurveTo(64, 85, 72, 81);
        ctx.stroke();

        // Усы-вибриссы
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(48, 78); ctx.lineTo(18, 75);
        ctx.moveTo(48, 81); ctx.lineTo(20, 86);
        ctx.moveTo(80, 78); ctx.lineTo(110, 75);
        ctx.moveTo(80, 81); ctx.lineTo(108, 86);
        ctx.stroke();

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 32);
        ctx.lineTo(42, 42);
        ctx.lineTo(32, 68);
        ctx.lineTo(46, 88);
        ctx.lineTo(64, 98);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.lineTo(36, 96);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    halfling_bard() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ДЕТАЛИЗИРОВАННАЯ ЛЮТНЯ ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.save();
        ctx.translate(98, 76);
        ctx.rotate((Math.PI / 180) * 28);

        // Деревянный гриф и головка с золотыми колками
        ctx.fillStyle = '#4e342e';
        ctx.fillRect(-3.5, -60, 7, 44);

        ctx.fillStyle = '#ffd875';
        ctx.beginPath();
        ctx.arc(-5.5, -54, 1.5, 0, Math.PI * 2);
        ctx.arc(-5.5, -47, 1.5, 0, Math.PI * 2);
        ctx.arc(5.5, -54, 1.5, 0, Math.PI * 2);
        ctx.arc(5.5, -47, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Грушевидный корпус лютни
        ctx.fillStyle = '#a0522d';
        ctx.strokeStyle = '#3e2723';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.ellipse(0, 4, 17, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Светлая еловая дека и резная розетка по центру
        ctx.fillStyle = '#cd853f';
        ctx.beginPath();
        ctx.ellipse(0, 5, 13, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#2c1810';
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(0, 2, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Струнодержатель и серебряные струны
        ctx.fillStyle = '#3e2723';
        ctx.fillRect(-6.5, 14, 13, 2.5);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 0.7;
        [-2, 0, 2].forEach(sx => {
            ctx.beginPath();
            ctx.moveTo(sx, -54);
            ctx.lineTo(sx, 14);
            ctx.stroke();
        });
        ctx.restore();

        // 2. ПЫШНЫЕ КУДРЯВЫЕ ВОЛОСЫ И КОСЫ НА ЗАДНЕМ ПЛАНЕ
        ctx.fillStyle = '#6e3b1e';
        ctx.beginPath();
        ctx.arc(64, 42, 24, 0, Math.PI * 2);
        ctx.arc(44, 44, 15, 0, Math.PI * 2);
        ctx.arc(84, 44, 15, 0, Math.PI * 2);
        ctx.arc(38, 62, 15, 0, Math.PI * 2);
        ctx.arc(90, 62, 15, 0, Math.PI * 2);
        ctx.arc(34, 84, 13, 0, Math.PI * 2);
        ctx.arc(94, 84, 13, 0, Math.PI * 2);
        ctx.fill();

        // Золотые ленты-перехваты на косичках
        ctx.fillStyle = '#ffd875';
        ctx.fillRect(28, 72, 12, 3.5);
        ctx.fillRect(88, 72, 12, 3.5);

        // 3. ОДЕЖДА: Изумрудный жилет менестреля с золотой вышивкой и белая рубаха
        ctx.fillStyle = '#1e5631';
        ctx.beginPath();
        ctx.moveTo(18, 128);
        ctx.lineTo(38, 100);
        ctx.lineTo(90, 100);
        ctx.lineTo(110, 128);
        ctx.closePath();
        ctx.fill();

        // Белая пышная блуза в вырезе жилета
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(48, 100);
        ctx.lineTo(64, 126);
        ctx.lineTo(80, 100);
        ctx.closePath();
        ctx.fill();

        // Золотая окантовка жилета
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(44, 101); ctx.lineTo(59, 128);
        ctx.moveTo(84, 101); ctx.lineTo(69, 128);
        ctx.stroke();

        // 4. АККУРАТНЫЕ ЗАОСТРЁННЫЕ УШКИ ПОЛУРОСЛИЦЫ
        ctx.fillStyle = '#eab696';
        ctx.beginPath(); ctx.moveTo(43, 64); ctx.lineTo(27, 54); ctx.lineTo(42, 72); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(85, 64); ctx.lineTo(101, 54); ctx.lineTo(86, 72); ctx.closePath(); ctx.fill();

        // 5. ШЕЯ И МИЛОВИДНОЕ КРУГЛОЕ ЛИЦО С ВЕСНУШКАМИ
        ctx.fillStyle = '#e5b08f';
        ctx.fillRect(55, 86, 18, 16);

        ctx.fillStyle = '#fbd2b8';
        ctx.beginPath();
        ctx.moveTo(45, 52);
        ctx.quadraticCurveTo(64, 38, 83, 52);
        ctx.lineTo(84, 80);
        ctx.quadraticCurveTo(64, 98, 44, 80);
        ctx.closePath();
        ctx.fill();

        // Здоровый румянец и веснушки на щёчках
        ctx.fillStyle = 'rgba(231, 76, 60, 0.18)';
        ctx.beginPath(); ctx.arc(49, 73, 5.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(79, 73, 5.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#b5744c';
        ctx.fillRect(48, 70, 1.5, 1.5); ctx.fillRect(52, 72, 1.5, 1.5);
        ctx.fillRect(79, 70, 1.5, 1.5); ctx.fillRect(75, 72, 1.5, 1.5);

        // Задорные кудряшки чёлки на лбу и золотая ленточка в волосах
        ctx.fillStyle = '#874926';
        ctx.beginPath();
        ctx.arc(47, 46, 8, 0, Math.PI * 2);
        ctx.arc(58, 42, 7.5, 0, Math.PI * 2);
        ctx.arc(70, 42, 7.5, 0, Math.PI * 2);
        ctx.arc(81, 46, 8, 0, Math.PI * 2);
        ctx.arc(64, 33, 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(42, 42);
        ctx.quadraticCurveTo(64, 33, 86, 42);
        ctx.stroke();

        // 6. БОЛЬШИЕ ЯРКИЕ ЗЕЛЁНЫЕ ГЛАЗА И ОЗОРНАЯ УЛЫБКА
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(53, 63, 5, 2.8, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 63, 5, 2.8, 0, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#10b981';
        ctx.beginPath(); ctx.arc(53, 63, 2.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 63, 2.3, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#064e3b';
        ctx.beginPath(); ctx.arc(53, 63, 1.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 63, 1.1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(54, 62, 0.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 62, 0.8, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#5c3118';
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(47, 57); ctx.quadraticCurveTo(53, 54.5, 58, 57);
        ctx.moveTo(70, 57); ctx.quadraticCurveTo(75, 54.5, 81, 57);
        ctx.stroke();

        ctx.strokeStyle = '#d99e7c';
        ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(64, 61); ctx.lineTo(62.5, 72); ctx.lineTo(66, 72); ctx.stroke();

        ctx.fillStyle = '#e06c6c';
        ctx.beginPath();
        ctx.moveTo(55, 80);
        ctx.quadraticCurveTo(64, 87, 73, 80);
        ctx.quadraticCurveTo(64, 83, 55, 80);
        ctx.closePath();
        ctx.fill();

        // 7. ИЗОГНУТАЯ СТАЛЬНАЯ САБЛЯ НА ПЕРЕДНЕМ ПЛАНЕ (Слева снизу по диагонали)
        ctx.save();
        ctx.translate(27, 108);
        ctx.rotate((Math.PI / 180) * -28);

        // Изогнутый стальной клинок сабли
        ctx.fillStyle = '#94a3b8';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-3.5, 0);
        ctx.quadraticCurveTo(-5, -24, 1, -44); // Изогнутое остриё сабли
        ctx.quadraticCurveTo(5, -22, 3.5, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Светлая режущая кромка клинка
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(1, -44);
        ctx.quadraticCurveTo(5, -22, 3.5, 0);
        ctx.lineTo(0.5, 0);
        ctx.quadraticCurveTo(1.5, -22, 1, -44);
        ctx.closePath();
        ctx.fill();

        // Золотая гарда-эфес с дужкой
        ctx.fillStyle = '#ffd875';
        ctx.strokeStyle = '#8a6421';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.roundRect(-9, -2, 18, 3.5, 1.5);
        ctx.fill();
        ctx.stroke();

        // Защитная золотая дужка эфеса
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(7, 1);
        ctx.quadraticCurveTo(12, 8, 4, 15);
        ctx.stroke();

        // Рукоять и золотое навершие
        ctx.fillStyle = '#1e5631';
        ctx.fillRect(-2.5, 1.5, 5, 12);

        ctx.fillStyle = '#ffd875';
        ctx.beginPath();
        ctx.arc(0, 15, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.beginPath();
        ctx.moveTo(64, 18);
        ctx.arc(64, 42, 24, Math.PI * 1.5, Math.PI, true);
        ctx.lineTo(44, 80);
        ctx.lineTo(64, 96);
        ctx.lineTo(64, 128);
        ctx.lineTo(18, 128);
        ctx.lineTo(38, 100);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    amiri() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ГИГАНТСКИЙ ТРОФЕЙНЫЙ МЕЧ АМИРИ ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.save();
        ctx.translate(101, 52);
        ctx.rotate((Math.PI / 180) * 24);

        // Очень широкий, массивный клинок великана с зазубринами
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(-7.5, 28);
        ctx.lineTo(-7.5, -26);
        ctx.lineTo(-5, -29); // Боевая зазубрина на лезвии
        ctx.lineTo(-7.5, -32);
        ctx.lineTo(-6.5, -46);
        ctx.lineTo(0, -58);   // Остриё гигантского клинка
        ctx.lineTo(6.5, -46);
        ctx.lineTo(7.5, 28);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Светлая полированная правая грань клинка и глубокий дол
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(0, -58);
        ctx.lineTo(6.5, -46);
        ctx.lineTo(7.5, 28);
        ctx.lineTo(0, 28);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-1.5, -40, 3, 62);

        // Грубая кованая гарда с костяными накладками
        ctx.fillStyle = '#785a14';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(-18, 22);
        ctx.lineTo(18, 22);
        ctx.lineTo(15, 29);
        ctx.lineTo(-15, 29);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 2. ДЛИННЫЕ РАСТРЁПАННЫЕ ЧЁРНЫЕ ВОЛОСЫ И КОСИЧКИ С ПЕРЬЯМИ
        ctx.fillStyle = '#14171f';
        ctx.beginPath();
        ctx.moveTo(30, 46);
        ctx.quadraticCurveTo(18, 88, 18, 128);
        ctx.lineTo(110, 128);
        ctx.quadraticCurveTo(110, 88, 98, 46);
        ctx.closePath();
        ctx.fill();

        // Взъерошенные пряди волос по бокам
        ctx.fillStyle = '#222733';
        ctx.beginPath();
        ctx.moveTo(28, 64); ctx.lineTo(16, 76); ctx.lineTo(26, 82);
        ctx.moveTo(100, 64); ctx.lineTo(112, 76); ctx.lineTo(102, 82);
        ctx.closePath();
        ctx.fill();

        // 3. ШКУРА ЛЕДЯНОГО ВЕЛИКАНА, КОЖАНЫЕ РЕМНИ И ОЖЕРЕЛЬЕ ИЗ КЛЫКОВ
        // Загорелые сильные плечи воительницы
        ctx.fillStyle = '#d49a7a';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.quadraticCurveTo(32, 94, 64, 94);
        ctx.quadraticCurveTo(96, 94, 112, 128);
        ctx.closePath();
        ctx.fill();

        // Тяжёлый серо-бурый мех на плечах
        ctx.fillStyle = '#3f3832';
        ctx.beginPath();
        ctx.moveTo(12, 128);
        ctx.quadraticCurveTo(22, 90, 48, 96);
        ctx.lineTo(40, 128);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(116, 128);
        ctx.quadraticCurveTo(106, 90, 80, 96);
        ctx.lineTo(88, 128);
        ctx.closePath();
        ctx.fill();

        // Кожаный лиф-броня и портупея через грудь
        ctx.fillStyle = '#3b2416';
        ctx.beginPath();
        ctx.moveTo(36, 110);
        ctx.quadraticCurveTo(64, 104, 92, 110);
        ctx.lineTo(98, 128);
        ctx.lineTo(30, 128);
        ctx.closePath();
        ctx.fill();

        // Ожерелье из крупных звериных клыков на шее
        ctx.fillStyle = '#f5eedc';
        ctx.beginPath(); ctx.moveTo(48, 98); ctx.lineTo(50, 110); ctx.lineTo(54, 100); ctx.fill();
        ctx.beginPath(); ctx.moveTo(61, 101); ctx.lineTo(64, 115); ctx.lineTo(67, 101); ctx.fill();
        ctx.beginPath(); ctx.moveTo(80, 98); ctx.lineTo(78, 110); ctx.lineTo(74, 100); ctx.fill();

        // 4. ШЕЯ И ВОЛЕВОЕ ЛИЦО АМИРИ С ПЛЕМЕННОЙ БОЕВОЙ РАСКРАСКОЙ
        ctx.fillStyle = '#cf9272';
        ctx.fillRect(55, 84, 18, 16);

        ctx.fillStyle = '#e5ad8e';
        ctx.beginPath();
        ctx.moveTo(44, 48);
        ctx.quadraticCurveTo(64, 34, 84, 48);
        ctx.lineTo(82, 79);
        ctx.lineTo(64, 96);
        ctx.lineTo(46, 79);
        ctx.closePath();
        ctx.fill();

        // Алая боевая раскраска племени Шести Медведей на щеках и переносице
        ctx.fillStyle = 'rgba(185, 28, 28, 0.65)';
        ctx.beginPath();
        ctx.moveTo(45, 65); ctx.lineTo(57, 67); ctx.lineTo(55, 72); ctx.lineTo(45, 70);
        ctx.moveTo(83, 65); ctx.lineTo(71, 67); ctx.lineTo(73, 72); ctx.lineTo(83, 70);
        ctx.closePath();
        ctx.fill();

        // 5. ПЕРЕДНИЕ ПРЯДИ ЧЁРНЫХ ВОЛОС, КОСИЧКИ И КОЖАНЫЙ ОБОДОК
        ctx.fillStyle = '#181c26';
        ctx.beginPath();
        ctx.moveTo(40, 52);
        ctx.quadraticCurveTo(44, 22, 64, 20);
        ctx.quadraticCurveTo(84, 22, 88, 52);
        ctx.lineTo(84, 45);
        ctx.quadraticCurveTo(64, 35, 44, 45);
        ctx.closePath();
        ctx.fill();

        // Косички у висков с красными нитями
        ctx.fillStyle = '#14171f';
        ctx.fillRect(39, 48, 4.5, 36);
        ctx.fillRect(84.5, 48, 4.5, 36);

        ctx.fillStyle = '#dc2626';
        ctx.fillRect(38.5, 76, 5.5, 3);
        ctx.fillRect(84, 76, 5.5, 3);

        // Кожаный ремешок на лбу с бронзовой бляхой
        ctx.fillStyle = '#4a2e1b';
        ctx.fillRect(42, 43, 44, 4.5);
        ctx.fillStyle = '#d97706';
        ctx.fillRect(60, 42, 8, 6.5);

        // 6. ЯРОСТНЫЙ РОВНЫЙ ВЗГЛЯД, НАХМУРЕННЫЕ БРОВИ И БОЕВОЙ ОСКАЛ
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(54, 60, 4.8, 2.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 60, 4.8, 2.2, 0, 0, Math.PI * 2); ctx.fill();

        // Тёмно-янтарная дикая радужка
        ctx.fillStyle = '#78350f';
        ctx.beginPath(); ctx.arc(54, 60, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 60, 2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(54, 60, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 60, 1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(54.8, 59.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74.8, 59.2, 0.7, 0, Math.PI * 2); ctx.fill();

        // Агрессивно сведённые к переносице чёрные брови
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.9;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(47, 54.5); ctx.lineTo(59, 57.5);
        ctx.moveTo(81, 54.5); ctx.lineTo(69, 57.5);
        ctx.stroke();

        // Прямой нос и яростный оскал с зубами
        ctx.strokeStyle = '#b87d5e';
        ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(64, 57); ctx.lineTo(62.5, 71); ctx.lineTo(66, 71); ctx.stroke();

        ctx.fillStyle = '#450a0a';
        ctx.beginPath();
        ctx.moveTo(55, 80);
        ctx.quadraticCurveTo(64, 76, 73, 80);
        ctx.lineTo(71, 85);
        ctx.quadraticCurveTo(64, 83, 57, 85);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(57, 79.5, 14, 2);

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 20);
        ctx.quadraticCurveTo(44, 22, 40, 52);
        ctx.lineTo(46, 79);
        ctx.lineTo(64, 96);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    harrim() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ТЯЖЁЛЫЙ ШИПАСТЫЙ ЦЕП ГРОТУСА ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.save();
        ctx.translate(100, 48);
        ctx.rotate((Math.PI / 180) * 24);

        // Окованное железом древко цепа
        ctx.strokeStyle = '#3b2514';
        ctx.lineWidth = 4.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(0, 88);
        ctx.stroke();

        // Железная цепь, свисающая с навершия
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2.4;
        ctx.setLineDash([3, 2]);
        ctx.beginPath();
        ctx.moveTo(0, -12);
        ctx.quadraticCurveTo(10, -24, 15, -8);
        ctx.stroke();
        ctx.setLineDash([]);

        // Тяжёлый стальной шипастый шар била
        ctx.fillStyle = '#334155';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(15, -3, 8.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Острые шипы на шаре цепа
        ctx.fillStyle = '#94a3b8';
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
            const bx = 15 + 8 * Math.cos(a);
            const by = -3 + 8 * Math.sin(a);
            const tx = 15 + 13 * Math.cos(a);
            const ty = -3 + 13 * Math.sin(a);
            ctx.beginPath();
            ctx.moveTo(bx - 1.5 * Math.sin(a), by + 1.5 * Math.cos(a));
            ctx.lineTo(tx, ty);
            ctx.lineTo(bx + 1.5 * Math.sin(a), by - 1.5 * Math.cos(a));
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();

        // 2. МРАЧНАЯ ЖРЕЧЕСКАЯ РЯСА, ТЁМНЫЕ ЛАТЫ И СИМВОЛ ЛУНЫ ГРОТУСА
        ctx.fillStyle = '#1e242b';
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.lineTo(32, 95);
        ctx.lineTo(96, 95);
        ctx.lineTo(114, 128);
        ctx.closePath();
        ctx.fill();

        // Потёртый стальной наплечник и кожаная портупея
        ctx.fillStyle = '#334155';
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(16, 126);
        ctx.quadraticCurveTo(22, 94, 46, 98);
        ctx.lineTo(40, 128);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(112, 126);
        ctx.quadraticCurveTo(106, 94, 82, 98);
        ctx.lineTo(88, 128);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Серебряный медальон-череп-луна Гротуса на груди
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(64, 114, 6.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1e242b';
        ctx.beginPath();
        ctx.arc(66.5, 112.5, 5, 0, Math.PI * 2);
        ctx.fill();

        // 3. ШИРОКИЙ ЧЕРЕП ДВАРФА С ВЫБРИТОЙ МАКУШКОЙ И КОСМАМИ НА ВИСКАХ
        // Спутанные тёмно-пепельные космы по бокам головы
        ctx.fillStyle = '#27272a';
        ctx.beginPath();
        ctx.moveTo(41, 46);
        ctx.quadraticCurveTo(32, 66, 36, 92);
        ctx.lineTo(44, 88);
        ctx.moveTo(87, 46);
        ctx.quadraticCurveTo(96, 66, 92, 92);
        ctx.lineTo(84, 88);
        ctx.closePath();
        ctx.fill();

        // Бледная, усталая кожа лица дварфа
        ctx.fillStyle = '#c49c85';
        ctx.beginPath();
        ctx.moveTo(42, 46);
        ctx.quadraticCurveTo(44, 24, 64, 23); // Высокий открытый лоб и лысая макушка
        ctx.quadraticCurveTo(84, 24, 86, 46);
        ctx.lineTo(87, 74);
        ctx.lineTo(81, 86);
        ctx.lineTo(64, 102);
        ctx.lineTo(47, 86);
        ctx.lineTo(41, 74);
        ctx.closePath();
        ctx.fill();

        // Световой блик на открытом лбу и глубокие морщины скорби
        ctx.fillStyle = '#d6b09a';
        ctx.beginPath();
        ctx.ellipse(64, 34, 14, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#8f6752';
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(50, 44); ctx.quadraticCurveTo(64, 47, 78, 44);
        ctx.moveTo(53, 48); ctx.quadraticCurveTo(64, 51, 75, 48);
        ctx.stroke();

        // 4. МЕЛАНХОЛИЧНО-СУРОВЫЙ ВЗГЛЯД, ТЁМНЫЕ КРУГИ ПОД ГЛАЗАМИ И НОС
        // Глубокие синяки-тени под глазами
        ctx.fillStyle = 'rgba(39, 39, 42, 0.35)';
        ctx.beginPath(); ctx.ellipse(52, 62, 6.5, 4, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(76, 62, 6.5, 4, 0, 0, Math.PI * 2); ctx.fill();

        // Тяжёлые полуприкрытые веки и белки глаз
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath(); ctx.ellipse(52, 61, 4.8, 2.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(76, 61, 4.8, 2.2, 0, 0, Math.PI * 2); ctx.fill();

        // Тусклая пепельно-голубая радужка
        ctx.fillStyle = '#64748b';
        ctx.beginPath(); ctx.arc(52, 61, 1.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 61, 1.9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(52, 61, 0.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 61, 0.9, 0, Math.PI * 2); ctx.fill();

        // Нависшие верхние веки и скорбно-нахмуренные брови
        ctx.fillStyle = '#b0866f';
        ctx.fillRect(46, 58, 12, 2.4);
        ctx.fillRect(70, 58, 12, 2.4);

        ctx.strokeStyle = '#27272a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(44, 56); ctx.lineTo(59, 58.5);
        ctx.moveTo(84, 56); ctx.lineTo(69, 58.5);
        ctx.stroke();

        // Крупный дварфийский нос с тенью
        ctx.fillStyle = '#b0866f';
        ctx.beginPath();
        ctx.moveTo(61, 58);
        ctx.lineTo(67, 58);
        ctx.lineTo(70, 73);
        ctx.quadraticCurveTo(64, 77, 58, 73);
        ctx.closePath();
        ctx.fill();

        // 5. ДЛИННАЯ ПЕПЕЛЬНО-СЕДАЯ БОРОДА С КОСАМИ И ЖЕЛЕЗНЫМИ ЗАЖИМАМИ
        ctx.fillStyle = '#52525b';
        ctx.beginPath();
        ctx.moveTo(41, 74);
        ctx.lineTo(31, 102);
        ctx.lineTo(43, 128);
        ctx.lineTo(85, 128);
        ctx.lineTo(97, 102);
        ctx.lineTo(87, 74);
        ctx.quadraticCurveTo(64, 85, 41, 74);
        ctx.closePath();
        ctx.fill();

        // Седые рельефные пряди в бороде
        ctx.strokeStyle = '#a1a1aa';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(52, 86); ctx.lineTo(49, 126);
        ctx.moveTo(64, 88); ctx.lineTo(64, 128);
        ctx.moveTo(76, 86); ctx.lineTo(79, 126);
        ctx.stroke();

        // Уныло опущенные вниз густые усы
        ctx.fillStyle = '#3f3f46';
        ctx.beginPath();
        ctx.moveTo(47, 78);
        ctx.quadraticCurveTo(64, 72, 81, 78);
        ctx.lineTo(85, 91);
        ctx.quadraticCurveTo(64, 81, 43, 91);
        ctx.closePath();
        ctx.fill();

        // Стальные кольца-зажимы на косах бороды
        ctx.fillStyle = '#71717a';
        ctx.strokeStyle = '#18181b';
        ctx.lineWidth = 1;
        ctx.fillRect(45, 117, 9, 5); ctx.strokeRect(45, 117, 9, 5);
        ctx.fillRect(74, 117, 9, 5); ctx.strokeRect(74, 117, 9, 5);

        // 6. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 23);
        ctx.quadraticCurveTo(44, 24, 42, 46);
        ctx.lineTo(41, 74);
        ctx.lineTo(31, 102);
        ctx.lineTo(43, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    valerie() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ПОЛУТОРНЫЙ РЫЦАРСКИЙ МЕЧ ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.save();
        ctx.translate(102, 54);
        ctx.rotate((Math.PI / 180) * 24);

        // Строгий стальной клинок меча
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

        // Золотая гарда рыцарского меча
        ctx.fillStyle = '#d4af37';
        ctx.strokeStyle = '#785a14';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(-13, 24, 26, 4.5, 1.5);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 2. ВЫСОКИЙ СТРОГИЙ ПУЧОК СВЕТЛЫХ ВОЛОС (Задний план)
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(64, 20, 14, 0, Math.PI * 2);
        ctx.fill();

        // Золотая заколка-обруч вокруг пучка
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(52, 27);
        ctx.lineTo(76, 27);
        ctx.stroke();

        // 3. ТЯЖЁЛЫЕ ЛАТНЫЕ ДОСПЕХИ И ПЛАЩ НА ПЛЕЧАХ
        ctx.fillStyle = '#1e3a8a';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(32, 94);
        ctx.lineTo(96, 94);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        // Полированная стальная кираса и высокий латный воротник
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.moveTo(24, 128);
        ctx.lineTo(38, 95);
        ctx.lineTo(90, 95);
        ctx.lineTo(104, 128);
        ctx.closePath();
        ctx.fill();

        // Рельефные наплечники с золотой чеканкой
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(18, 126);
        ctx.quadraticCurveTo(24, 92, 46, 97);
        ctx.lineTo(40, 128);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(110, 126);
        ctx.quadraticCurveTo(104, 92, 82, 97);
        ctx.lineTo(88, 128);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Золотой нагрудный кант кирасы
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(46, 97);
        ctx.lineTo(64, 118);
        ctx.lineTo(82, 97);
        ctx.stroke();

        // 4. ШЕЯ И СТРОГОЕ АРИСТОКРАТИЧНОЕ ЛИЦО ВАЛЕРИ
        ctx.fillStyle = '#e6be9e';
        ctx.fillRect(55, 86, 18, 15);

        ctx.fillStyle = '#ffedd8';
        ctx.beginPath();
        ctx.moveTo(45, 48);
        ctx.quadraticCurveTo(64, 34, 83, 48);
        ctx.lineTo(81, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(47, 78);
        ctx.closePath();
        ctx.fill();

        // Уложенные платиново-русые волосы с пробором
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(41, 56);
        ctx.quadraticCurveTo(42, 24, 64, 22);
        ctx.quadraticCurveTo(86, 24, 87, 56);
        ctx.lineTo(83, 48);
        ctx.quadraticCurveTo(72, 38, 64, 42);
        ctx.quadraticCurveTo(56, 38, 45, 48);
        ctx.closePath();
        ctx.fill();

        // Короткие аккуратные пряди у висков
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(43, 48); ctx.quadraticCurveTo(40, 64, 44, 76); ctx.lineTo(47, 72);
        ctx.moveTo(85, 48); ctx.quadraticCurveTo(88, 64, 84, 76); ctx.lineTo(81, 72);
        ctx.fill();

        // 5. РОВНЫЙ, СДЕРЖАННЫЙ ВЗГЛЯД, БРОВИ И ШРАМ НА ПРАВОЙ ЩЕКЕ
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(54, 60, 4.8, 2.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 60, 4.8, 2.2, 0, 0, Math.PI * 2); ctx.fill();

        // Холодная светло-голубая радужка
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(54, 60, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 60, 2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0c4a6e';
        ctx.beginPath(); ctx.arc(54, 60, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 60, 1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(54.8, 59.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74.8, 59.2, 0.7, 0, Math.PI * 2); ctx.fill();

        // Тёмные ресницы и ровные строгие брови
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(49, 59.5); ctx.quadraticCurveTo(54, 57.5, 59, 59.5);
        ctx.moveTo(69, 59.5); ctx.quadraticCurveTo(74, 57.5, 79, 59.5);
        ctx.stroke();

        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(48, 55); ctx.lineTo(59, 56);
        ctx.moveTo(80, 55); ctx.lineTo(69, 56);
        ctx.stroke();

        // Тонкий шрам на правой щеке (узнаваемая деталь из Kingmaker)
        ctx.strokeStyle = '#c97b73';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(72, 66);
        ctx.lineTo(78, 74);
        ctx.stroke();

        // Прямой утончённый нос и сдержанные губы
        ctx.strokeStyle = '#d9a786';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 57); ctx.lineTo(62.5, 72); ctx.lineTo(65.5, 72); ctx.stroke();

        ctx.fillStyle = '#d47474';
        ctx.beginPath();
        ctx.ellipse(64, 81, 4.6, 1.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // 6. ОГРОМНЫЙ БАШЕННЫЙ ЩИТ ВАЛЕРИ НА ПЕРЕДНЕМ ПЛАНЕ (Слева)
        ctx.save();
        ctx.translate(25, 98);
        ctx.rotate((Math.PI / 180) * -5);

        // Высокий арочный башенный щит из закалённой стали в золотой оправе
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(-17, -26);
        ctx.quadraticCurveTo(0, -32, 17, -26);
        ctx.lineTo(17, 28);
        ctx.lineTo(-17, 28);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Внутренняя тёмно-синяя геральдическая вставка и золотой узор
        ctx.fillStyle = '#1e3a8a';
        ctx.beginPath();
        ctx.moveTo(-12, -21);
        ctx.quadraticCurveTo(0, -26, 12, -21);
        ctx.lineTo(12, 23);
        ctx.lineTo(-12, 23);
        ctx.closePath();
        ctx.fill();

        // Золотое вертикальное ребро и ромб по центру башенного щита
        ctx.fillStyle = '#ffd875';
        ctx.fillRect(-1.5, -22, 3, 45);
        ctx.beginPath();
        ctx.moveTo(0, -7);
        ctx.lineTo(6, 0);
        ctx.lineTo(0, 7);
        ctx.lineTo(-6, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.beginPath();
        ctx.moveTo(64, 6);
        ctx.arc(64, 20, 14, Math.PI * 1.5, Math.PI, true);
        ctx.quadraticCurveTo(42, 24, 41, 56);
        ctx.lineTo(47, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    jubilost() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ДОРОЖНЫЙ КОЖАНЫЙ СЮРТУК, ВЫСОКИЙ ВОРОТНИК И ПЕРЕВЯЗЬ С ПРОБИРКАМИ
        ctx.fillStyle = '#3b2618';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(34, 96);
        ctx.lineTo(94, 96);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        // Высокий стоячий воротник плаща путешественника
        ctx.fillStyle = '#523622';
        ctx.beginPath();
        ctx.moveTo(32, 96);
        ctx.lineTo(38, 80);
        ctx.lineTo(54, 96);
        ctx.lineTo(74, 96);
        ctx.lineTo(90, 80);
        ctx.lineTo(96, 96);
        ctx.lineTo(90, 114);
        ctx.lineTo(38, 114);
        ctx.closePath();
        ctx.fill();

        // Светлый жилет и шейный платок
        ctx.fillStyle = '#d6ccc2';
        ctx.beginPath();
        ctx.moveTo(48, 98);
        ctx.lineTo(64, 126);
        ctx.lineTo(80, 98);
        ctx.closePath();
        ctx.fill();

        // Диагональный алхимический патронташ через грудь
        ctx.fillStyle = '#24160d';
        ctx.beginPath();
        ctx.moveTo(86, 96);
        ctx.lineTo(54, 128);
        ctx.lineTo(68, 128);
        ctx.lineTo(96, 100);
        ctx.closePath();
        ctx.fill();

        // Стеклянные пробирки с яркими реагентами в перевязи
        ctx.save();
        ctx.translate(76, 110);
        ctx.rotate((Math.PI / 180) * -42);
        // Пробирка 1 (огненно-оранжевая)
        ctx.fillStyle = '#f97316';
        ctx.fillRect(-7, -6, 3.5, 11);
        // Пробирка 2 (кислотно-изумрудная)
        ctx.fillStyle = '#10b981';
        ctx.fillRect(-1.5, -6, 3.5, 11);
        // Пробирка 3 (лазурная)
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(4, -6, 3.5, 11);
        ctx.restore();

        // 2. ЗАОСТРЁННЫЕ УШИ ГНОМА-ПУТЕШЕСТВЕННИКА
        ctx.fillStyle = '#e5b293';
        ctx.beginPath(); ctx.moveTo(43, 60); ctx.lineTo(22, 46); ctx.lineTo(42, 72); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(85, 60); ctx.lineTo(106, 46); ctx.lineTo(86, 72); ctx.closePath(); ctx.fill();

        // 3. ШЕЯ И ВЫРАЗИТЕЛЬНОЕ ЯЗВИТЕЛЬНОЕ ЛИЦО ДЖУБИЛОСТА
        ctx.fillStyle = '#dba586';
        ctx.fillRect(55, 84, 18, 16);

        ctx.fillStyle = '#f5cbb0';
        ctx.beginPath();
        ctx.moveTo(44, 48);
        ctx.lineTo(84, 48);
        ctx.lineTo(82, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(46, 78);
        ctx.closePath();
        ctx.fill();

        // 4. ВЗЪЕРОШЕННЫЕ РЫЖЕВАТО-КАШТАНОВЫЕ ВОЛОСЫ И ОЧКИ-ГОГГЛЫ НА ЛБУ
        ctx.fillStyle = '#8c3b1e';
        ctx.beginPath();
        ctx.moveTo(40, 56);
        ctx.quadraticCurveTo(38, 22, 64, 18);
        ctx.quadraticCurveTo(90, 22, 88, 56);
        ctx.lineTo(84, 46);
        ctx.quadraticCurveTo(64, 38, 44, 46);
        ctx.closePath();
        ctx.fill();

        // Вихры волос на макушке
        ctx.beginPath();
        ctx.moveTo(52, 22); ctx.lineTo(48, 12); ctx.lineTo(60, 19);
        ctx.moveTo(64, 19); ctx.lineTo(66, 10); ctx.lineTo(72, 19);
        ctx.moveTo(75, 21); ctx.lineTo(82, 13); ctx.lineTo(81, 24);
        ctx.closePath();
        ctx.fill();

        // Кожаный ремешок и латунные алхимические очки-гогглы на лбу
        ctx.fillStyle = '#2b190d';
        ctx.fillRect(41, 36, 46, 5);

        // Левая и правая оправы гогглов
        ctx.fillStyle = '#d4af37';
        ctx.strokeStyle = '#5c4212';
        ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(52, 38.5, 8.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(76, 38.5, 8.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Перемычка гогглов
        ctx.fillRect(60, 37, 8, 3);

        // Синеватые стеклянные линзы с бликами
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(52, 38.5, 6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 38.5, 6, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath(); ctx.ellipse(50, 36.5, 2.5, 1.2, -0.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 36.5, 2.5, 1.2, -0.5, 0, Math.PI * 2); ctx.fill();

        // 5. РОВНЫЙ СКЕПТИЧЕСКИЙ ВЗГЛЯД, БАКЕНБАРДЫ И ЯЗВИТЕЛЬНАЯ УХМЫЛКА
        // Густые бакенбарды учёного
        ctx.fillStyle = '#732e16';
        ctx.beginPath();
        ctx.moveTo(43, 54); ctx.lineTo(47, 54); ctx.lineTo(48, 76); ctx.lineTo(43, 72);
        ctx.moveTo(85, 54); ctx.lineTo(81, 54); ctx.lineTo(80, 76); ctx.lineTo(85, 72);
        ctx.fill();

        // Глаза строго на одной горизонтальной линии
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(53, 61, 4.6, 2.1, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 61, 4.6, 2.1, 0, 0, Math.PI * 2); ctx.fill();

        // Янтарно-каряя проницательная радужка
        ctx.fillStyle = '#92400e';
        ctx.beginPath(); ctx.arc(53, 61, 1.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 61, 1.9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(53, 61, 0.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 61, 0.9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(53.8, 60.2, 0.65, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75.8, 60.2, 0.65, 0, Math.PI * 2); ctx.fill();

        // Скептически приподнятая правая бровь
        ctx.strokeStyle = '#5c2310';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(47, 56.5); ctx.lineTo(59, 57.5);
        ctx.moveTo(69, 56.5); ctx.quadraticCurveTo(75, 52.5, 81, 55.5);
        ctx.stroke();

        // Характерный нос гнома и кривая саркастичная ухмылка
        ctx.fillStyle = '#dba586';
        ctx.beginPath(); ctx.arc(64, 69, 4.2, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#7c3f2c';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(55, 82);
        ctx.quadraticCurveTo(65, 85, 74, 79);
        ctx.stroke();

        // 6. АЛХИМИЧЕСКАЯ БОМБА С ФИТИЛЁМ НА ПЕРЕДНЕМ ПЛАНЕ (Слева снизу)
        ctx.save();
        ctx.translate(27, 108);
        ctx.rotate((Math.PI / 180) * -12);

        // Стеклянная колба-бомба с кислотно-зелёным составом
        ctx.fillStyle = '#15803d';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 4, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Яркий светящийся реагент внутри колбы
        ctx.fillStyle = '#4ade80';
        ctx.beginPath();
        ctx.arc(2, 5, 8, 0, Math.PI * 2);
        ctx.fill();

        // Горлышко колбы и пробка
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(-3.5, -11, 7, 4);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-2.5, -14, 5, 3);

        // Фитиль и яркая искра пламени
        ctx.strokeStyle = '#d6ccc2';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(0, -14);
        ctx.quadraticCurveTo(3, -19, 8, -20);
        ctx.stroke();

        ctx.fillStyle = '#f97316';
        ctx.beginPath(); ctx.arc(9, -20, 3.8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath(); ctx.arc(9, -20, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 18);
        ctx.quadraticCurveTo(38, 22, 40, 56);
        ctx.lineTo(46, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    nok_nok() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ВТОРОЙ ЗАЗУБРЕННЫЙ КУКРИ ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.save();
        ctx.translate(102, 54);
        ctx.rotate((Math.PI / 180) * 28);

        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-4, 34);
        ctx.lineTo(-4, -14);
        ctx.quadraticCurveTo(-7, -30, 5, -42); // Изогнутый клинок кукри
        ctx.quadraticCurveTo(9, -24, 4, 34);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Светлая заточенная кромка и боевая зазубрина
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(5, -42);
        ctx.quadraticCurveTo(9, -24, 4, 34);
        ctx.lineTo(1, 34);
        ctx.quadraticCurveTo(4, -22, 5, -42);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 2. ДЛИННЫЕ ЗАОСТРЁННЫЕ УШИ НОК-НОКА С БОЕВЫМИ ЗАЗУБРИНАМИ
        ctx.fillStyle = '#4d7c36';
        // Левое ухо
        ctx.beginPath();
        ctx.moveTo(39, 54);
        ctx.lineTo(4, 44);
        ctx.lineTo(12, 54);
        ctx.lineTo(8, 59);
        ctx.lineTo(40, 74);
        ctx.closePath();
        ctx.fill();

        // Правое ухо
        ctx.beginPath();
        ctx.moveTo(89, 54);
        ctx.lineTo(124, 44);
        ctx.lineTo(116, 55);
        ctx.lineTo(120, 60);
        ctx.lineTo(88, 74);
        ctx.closePath();
        ctx.fill();

        // Внутренняя ушная раковина
        ctx.fillStyle = '#9e9463';
        ctx.beginPath(); ctx.moveTo(38, 58); ctx.lineTo(12, 50); ctx.lineTo(39, 69); ctx.fill();
        ctx.beginPath(); ctx.moveTo(90, 58); ctx.lineTo(116, 50); ctx.lineTo(89, 69); ctx.fill();

        // 3. САМОДЕЛЬНЫЙ ГЕРОЙСКИЙ ДОСПЕХ ИЗ ТРОФЕЙНОГО ЖЕЛЕЗА И КРАСНЫЙ ПЛАЩ
        ctx.fillStyle = '#7f1d1d'; // Потрёпанный «геройский» алый плащ
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(34, 96);
        ctx.lineTo(94, 96);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        // Кожаный нагрудник с приклёпанными стальными пластинами
        ctx.fillStyle = '#3b2416';
        ctx.beginPath();
        ctx.moveTo(22, 128);
        ctx.lineTo(38, 98);
        ctx.lineTo(90, 98);
        ctx.lineTo(106, 128);
        ctx.closePath();
        ctx.fill();

        // Трофейная стальная пластина с заклёпками на груди
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(46, 108, 36, 18, 3);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath(); ctx.arc(50, 112, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(78, 112, 1.3, 0, Math.PI * 2); ctx.fill();

        // Повязанный на шее красный геройский шарф
        ctx.fillStyle = '#b91c1c';
        ctx.beginPath();
        ctx.moveTo(38, 94);
        ctx.quadraticCurveTo(64, 108, 90, 94);
        ctx.lineTo(86, 104);
        ctx.quadraticCurveTo(64, 115, 42, 104);
        ctx.closePath();
        ctx.fill();

        // 4. БОЛЬШАЯ ГОЛОВА ГОБЛИНА С ШИРОКОЙ БЕЗУМНОЙ УЛЫБКОЙ
        ctx.fillStyle = '#659e47';
        ctx.beginPath();
        ctx.moveTo(40, 38);
        ctx.quadraticCurveTo(64, 24, 88, 38); // Лысая бугристая макушка
        ctx.lineTo(94, 70);
        ctx.lineTo(64, 98);
        ctx.lineTo(34, 70);
        ctx.closePath();
        ctx.fill();

        // Световая зона на высоком лбу и скулах
        ctx.fillStyle = '#78b556';
        ctx.beginPath();
        ctx.ellipse(64, 40, 16, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        // Складки морщин на лбу от восторга
        ctx.strokeStyle = '#3f6b29';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(52, 37); ctx.quadraticCurveTo(64, 39, 76, 37);
        ctx.stroke();

        // 5. ОГРОМНЫЕ ГОРЯЩИЕ РУБИНОВО-КРАСНЫЕ ГЛАЗА И ШИРОКИЙ НОС
        ctx.fillStyle = '#365924';
        ctx.beginPath(); ctx.ellipse(49, 57, 8, 5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(79, 57, 8, 5, 0, 0, Math.PI * 2); ctx.fill();

        // Безумные ярко-красные глаза гоблина (ровно по горизонтали)
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.ellipse(49, 57, 6.5, 4, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(79, 57, 6.5, 4, 0, 0, Math.PI * 2); ctx.fill();

        // Узкие чёрные зрачки и яркие блики
        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.ellipse(49, 57, 1.4, 3.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(79, 57, 1.4, 3.2, 0, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(51, 55.5, 1.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(77, 55.5, 1.1, 0, Math.PI * 2); ctx.fill();

        // Приплюснутый широкий нос гоблина
        ctx.fillStyle = '#4d7c36';
        ctx.beginPath();
        ctx.moveTo(60, 56);
        ctx.lineTo(68, 56);
        ctx.lineTo(71, 68);
        ctx.quadraticCurveTo(64, 71, 57, 68);
        ctx.closePath();
        ctx.fill();

        // 6. ОГРОМНАЯ ЗУБАСТАЯ ПАСТЬ ОТ УХА ДО УХА (Визитная карточка Нок-Нока)
        ctx.fillStyle = '#290a0d';
        ctx.beginPath();
        ctx.moveTo(39, 71);
        ctx.quadraticCurveTo(64, 78, 89, 71);
        ctx.quadraticCurveTo(84, 94, 64, 95);
        ctx.quadraticCurveTo(44, 94, 39, 71);
        ctx.closePath();
        ctx.fill();

        // Язык внутри пасти
        ctx.fillStyle = '#be123c';
        ctx.beginPath();
        ctx.ellipse(64, 89, 8, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Частокол острых белых зубов сверху и снизу
        ctx.fillStyle = '#fef9c3';
        [44, 51, 58, 65, 72, 79].forEach(zx => {
            ctx.beginPath();
            ctx.moveTo(zx, 74);
            ctx.lineTo(zx + 2.5, 80);
            ctx.lineTo(zx + 5, 74.5);
            ctx.closePath();
            ctx.fill();
        });
        [47, 54, 61, 68, 75].forEach(zx => {
            ctx.beginPath();
            ctx.moveTo(zx, 92);
            ctx.lineTo(zx + 2.5, 86);
            ctx.lineTo(zx + 5, 91.5);
            ctx.closePath();
            ctx.fill();
        });

        // 7. ПЕРВЫЙ ЗАЗУБРЕННЫЙ КУКРИ НА ПЕРЕДНЕМ ПЛАНЕ (Слева снизу)
        ctx.save();
        ctx.translate(25, 106);
        ctx.rotate((Math.PI / 180) * -26);

        // Изогнутый клинок гоблинского собакореза
        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-4, 0);
        ctx.lineTo(-4, -18);
        ctx.quadraticCurveTo(-8, -32, 4, -44); // Характерный изгиб кукри вперёд
        ctx.quadraticCurveTo(8, -26, 4, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Светлая острая грань
        ctx.fillStyle = '#f1f5f9';
        ctx.beginPath();
        ctx.moveTo(4, -44);
        ctx.quadraticCurveTo(8, -26, 4, 0);
        ctx.lineTo(0.5, 0);
        ctx.quadraticCurveTo(3.5, -24, 4, -44);
        ctx.closePath();
        ctx.fill();

        // Грубая гарда и перемотанная тряпками рукоять
        ctx.fillStyle = '#334155';
        ctx.fillRect(-9, -2, 18, 3.5);

        ctx.fillStyle = '#4a3219';
        ctx.fillRect(-2.5, 1.5, 5, 14);
        ctx.restore();

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 28);
        ctx.quadraticCurveTo(48, 32, 40, 38);
        ctx.lineTo(34, 70);
        ctx.lineTo(64, 98);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    tristian() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗОЛОТИСТО-МЕДОВЫЕ ЛОКОНЫ ДО ПЛЕЧ НА ЗАДНЕМ ПЛАНЕ
        ctx.fillStyle = '#c88a2e';
        ctx.beginPath();
        ctx.moveTo(34, 52);
        ctx.quadraticCurveTo(22, 88, 22, 128);
        ctx.lineTo(106, 128);
        ctx.quadraticCurveTo(106, 88, 94, 52);
        ctx.closePath();
        ctx.fill();

        // Световые золотые пряди по краям волос
        ctx.fillStyle = '#e5a93c';
        ctx.beginPath();
        ctx.moveTo(36, 54);
        ctx.quadraticCurveTo(28, 88, 28, 124);
        ctx.lineTo(44, 124);
        ctx.lineTo(46, 56);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(92, 54);
        ctx.quadraticCurveTo(100, 88, 100, 124);
        ctx.lineTo(84, 124);
        ctx.lineTo(82, 56);
        ctx.closePath();
        ctx.fill();

        // 2. БЕЛОСНЕЖНОЕ ЖРЕЧЕСКОЕ ОБЛАЧЕНИЕ САРЕНРЭЙ И ЛАЗУРНЫЙ ПЛАЩ
        // Белоснежная туника
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(34, 96);
        ctx.lineTo(94, 96);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        // Ярко-синий с золотом жреческий палантин-плащ на плечах
        ctx.fillStyle = '#1d4ed8';
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.quadraticCurveTo(26, 94, 48, 98);
        ctx.lineTo(64, 126);
        ctx.lineTo(80, 98);
        ctx.quadraticCurveTo(102, 94, 114, 128);
        ctx.closePath();
        ctx.fill();

        // Золотая вышивка по краям жреческого плаща
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(46, 98);
        ctx.lineTo(64, 126);
        ctx.lineTo(82, 98);
        ctx.stroke();

        // Золотой символ солнца-анха Саренрэй на груди
        ctx.fillStyle = '#ffd875';
        ctx.beginPath(); ctx.arc(64, 111, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(62.5, 114, 3, 9);
        ctx.fillRect(58, 116.5, 12, 2.6);

        // 3. ШЕЯ И СВЕТЛОЕ ОДУХОТВОРЁННОЕ ЛИЦО ТРИСТИАНА
        ctx.fillStyle = '#e8be9e';
        ctx.fillRect(55, 84, 18, 16);

        ctx.fillStyle = '#ffedd8';
        ctx.beginPath();
        ctx.moveTo(45, 48);
        ctx.quadraticCurveTo(64, 34, 83, 48);
        ctx.lineTo(81, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(47, 78);
        ctx.closePath();
        ctx.fill();

        // 4. ЗОЛОТИСТЫЕ ВОЛНИСТЫЕ ВОЛОСЫ И ТОНКИЙ ЗОЛОТОЙ ОБРУЧ
        ctx.fillStyle = '#e5a93c';
        ctx.beginPath();
        ctx.moveTo(41, 56);
        ctx.quadraticCurveTo(42, 22, 64, 20);
        ctx.quadraticCurveTo(86, 22, 87, 56);
        ctx.lineTo(83, 47);
        ctx.quadraticCurveTo(72, 36, 64, 41);
        ctx.quadraticCurveTo(56, 36, 45, 47);
        ctx.closePath();
        ctx.fill();

        // Световые блики в золотых волосах
        ctx.fillStyle = '#fcd34d';
        ctx.beginPath();
        ctx.moveTo(50, 36);
        ctx.quadraticCurveTo(64, 23, 78, 36);
        ctx.quadraticCurveTo(64, 31, 50, 36);
        ctx.closePath();
        ctx.fill();

        // Тонкий золотой венец на лбу с солнечным самоцветом
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(44, 45);
        ctx.quadraticCurveTo(64, 49, 84, 45);
        ctx.stroke();

        ctx.fillStyle = '#f97316';
        ctx.beginPath(); ctx.arc(64, 46.5, 2, 0, Math.PI * 2); ctx.fill();

        // 5. РОВНЫЕ, ЯСНЫЕ НЕБЕСНО-ГОЛУБЫЕ ГЛАЗА И ДОБРАЯ ПОЛУУЛЫБКА
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(54, 60, 4.8, 2.3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 60, 4.8, 2.3, 0, 0, Math.PI * 2); ctx.fill();

        // Ясная небесно-лазурная радужка
        ctx.fillStyle = '#0ea5e9';
        ctx.beginPath(); ctx.arc(54, 60, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 60, 2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0c4a6e';
        ctx.beginPath(); ctx.arc(54, 60, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 60, 1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(54.8, 59.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74.8, 59.2, 0.7, 0, Math.PI * 2); ctx.fill();

        // Мягкие золотисто-русые брови
        ctx.strokeStyle = '#a16207';
        ctx.lineWidth = 1.3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(48, 55); ctx.quadraticCurveTo(54, 53.5, 59, 55.5);
        ctx.moveTo(69, 55.5); ctx.quadraticCurveTo(74, 53.5, 80, 55);
        ctx.stroke();

        // Тонкий нос и мягкая сострадательная улыбка
        ctx.strokeStyle = '#d9a786';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 57); ctx.lineTo(62.5, 72); ctx.lineTo(65.5, 72); ctx.stroke();

        ctx.strokeStyle = '#b86b5e';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(58, 81);
        ctx.quadraticCurveTo(64, 84, 70, 81);
        ctx.stroke();

        // 6. СВЯЩЕННОЕ ПЛАМЯ РАССВЕТА САРЕНРЭЙ НА ПЕРЕДНЕМ ПЛАНЕ (Слева снизу)
        // Тёплый солнечный ореол
        ctx.fillStyle = 'rgba(251, 191, 36, 0.35)';
        ctx.beginPath(); ctx.arc(24, 108, 15, 0, Math.PI * 2); ctx.fill();

        // Внешний оранжево-золотой язык пламени
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(24, 90);
        ctx.quadraticCurveTo(35, 103, 30, 116);
        ctx.quadraticCurveTo(24, 121, 18, 116);
        ctx.quadraticCurveTo(13, 103, 24, 90);
        ctx.closePath();
        ctx.fill();

        // Внутреннее сияющее ядро пламени рассвета
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.moveTo(24, 97);
        ctx.quadraticCurveTo(30, 106, 27, 114);
        ctx.quadraticCurveTo(24, 117, 21, 114);
        ctx.quadraticCurveTo(18, 106, 24, 97);
        ctx.closePath();
        ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.beginPath();
        ctx.moveTo(64, 20);
        ctx.quadraticCurveTo(42, 22, 41, 56);
        ctx.lineTo(47, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.lineTo(34, 52);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    ekundayo() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. КОЛЧАН СО СТРЕЛАМИ ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.fillStyle = '#4a2e1b';
        ctx.beginPath();
        ctx.moveTo(84, 96);
        ctx.lineTo(98, 62);
        ctx.lineTo(109, 67);
        ctx.lineTo(96, 102);
        ctx.closePath();
        ctx.fill();

        // Оперение стрел в колчане
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath(); ctx.moveTo(97, 63); ctx.lineTo(103, 51); ctx.lineTo(102, 65); ctx.fill();
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath(); ctx.moveTo(103, 65); ctx.lineTo(111, 54); ctx.lineTo(107, 67); ctx.fill();
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath(); ctx.moveTo(107, 67); ctx.lineTo(116, 58); ctx.lineTo(110, 69); ctx.fill();

        // 2. ПЛАЩ СЛЕДОПЫТА И КОЖАНАЯ БРОНЯ НА ПЛЕЧАХ
        ctx.fillStyle = '#1b3626';
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.lineTo(32, 95);
        ctx.lineTo(96, 95);
        ctx.lineTo(114, 128);
        ctx.closePath();
        ctx.fill();

        // Откинутый капюшон-воротник плаща за шеей
        ctx.fillStyle = '#254a34';
        ctx.beginPath();
        ctx.moveTo(30, 98);
        ctx.quadraticCurveTo(64, 114, 98, 98);
        ctx.lineTo(92, 88);
        ctx.quadraticCurveTo(64, 102, 36, 88);
        ctx.closePath();
        ctx.fill();

        // Кожаный нагрудник и портупея колчана с металлической пряжкой
        ctx.fillStyle = '#3b2416';
        ctx.beginPath();
        ctx.moveTo(28, 128);
        ctx.lineTo(40, 98);
        ctx.lineTo(88, 98);
        ctx.lineTo(100, 128);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#24160d';
        ctx.beginPath();
        ctx.moveTo(86, 98);
        ctx.lineTo(54, 128);
        ctx.lineTo(68, 128);
        ctx.lineTo(96, 102);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.8;
        ctx.strokeRect(72, 111, 8, 7);

        // 3. ШЕЯ И СУРОВОЕ ЛИЦО ЭКАНДЕЙО (Смуглая кожа и волевые скулы)
        ctx.fillStyle = '#6e4733';
        ctx.fillRect(55, 84, 18, 16);

        ctx.fillStyle = '#855840';
        ctx.beginPath();
        ctx.moveTo(44, 48);
        ctx.quadraticCurveTo(64, 34, 84, 48);
        ctx.lineTo(83, 80);
        ctx.lineTo(64, 98);
        ctx.lineTo(45, 80);
        ctx.closePath();
        ctx.fill();

        // Световой блик на лбу и спинке носа для чёткого объёма
        ctx.fillStyle = '#9c6a4f';
        ctx.beginPath();
        ctx.moveTo(54, 42);
        ctx.quadraticCurveTo(64, 38, 74, 42);
        ctx.lineTo(72, 54);
        ctx.lineTo(56, 54);
        ctx.closePath();
        ctx.fill();

        // 4. ЧЁРНЫЕ КОРОТКИЕ ДРЕДЫ-КОСИЧКИ С КОЖАНЫМ ОБОДКОМ
        ctx.fillStyle = '#14171f';
        ctx.beginPath();
        ctx.moveTo(41, 56);
        ctx.quadraticCurveTo(42, 22, 64, 20);
        ctx.quadraticCurveTo(86, 22, 87, 56);
        ctx.lineTo(83, 47);
        ctx.quadraticCurveTo(64, 38, 45, 47);
        ctx.closePath();
        ctx.fill();

        // Рельефные пряди-дреды на макушке и висках
        ctx.strokeStyle = '#262b38';
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(48, 36); ctx.quadraticCurveTo(44, 26, 41, 32);
        ctx.moveTo(56, 32); ctx.quadraticCurveTo(54, 20, 50, 24);
        ctx.moveTo(64, 30); ctx.quadraticCurveTo(64, 18, 64, 22);
        ctx.moveTo(72, 32); ctx.quadraticCurveTo(74, 20, 78, 24);
        ctx.moveTo(80, 36); ctx.quadraticCurveTo(84, 26, 87, 32);
        ctx.stroke();

        // Тёмно-коричневая кожаная лента-повязка на лбу
        ctx.fillStyle = '#3b2416';
        ctx.fillRect(42, 43, 44, 4.5);

        // 5. УХОЖЕННАЯ ЧЁРНАЯ БОРОДКА, УСЫ И СЕРЬЁЗНЫЙ ВЗГЛЯД
        ctx.fillStyle = '#14171f';
        ctx.beginPath();
        ctx.moveTo(44, 74);
        ctx.quadraticCurveTo(44, 94, 64, 100);
        ctx.quadraticCurveTo(84, 94, 84, 74);
        ctx.quadraticCurveTo(64, 84, 44, 74);
        ctx.closePath();
        ctx.fill();

        // Аккуратные усы
        ctx.beginPath();
        ctx.moveTo(50, 78);
        ctx.quadraticCurveTo(64, 73, 78, 78);
        ctx.lineTo(79, 82);
        ctx.quadraticCurveTo(64, 79, 49, 82);
        ctx.closePath();
        ctx.fill();

        // Ровные сосредоточенные глаза следопыта
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(53, 61, 4.6, 2.1, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 61, 4.6, 2.1, 0, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#291a10';
        ctx.beginPath(); ctx.arc(53, 61, 1.9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 61, 1.9, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(53.8, 60.2, 0.65, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75.8, 60.2, 0.65, 0, Math.PI * 2); ctx.fill();

        // Ровные суровые брови
        ctx.strokeStyle = '#14171f';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(47, 56); ctx.lineTo(59, 57);
        ctx.moveTo(81, 56); ctx.lineTo(69, 57);
        ctx.stroke();

        // Прямой нос
        ctx.strokeStyle = '#633e2b';
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(64, 58); ctx.lineTo(62.5, 72); ctx.lineTo(66, 72); ctx.stroke();

        // 6. ДЛИННЫЙ СОСТАВНОЙ ЛУК НА ПЕРЕДНЕМ ПЛАНЕ (Слева)
        ctx.strokeStyle = '#8c5832';
        ctx.lineWidth = 3.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(22, 24);
        ctx.bezierCurveTo(6, 54, 6, 94, 22, 124);
        ctx.stroke();

        // Костяные законцовки и обмотка рукояти лука
        ctx.strokeStyle = '#1e1611';
        ctx.lineWidth = 4.6;
        ctx.beginPath();
        ctx.moveTo(10, 68);
        ctx.lineTo(10, 80);
        ctx.stroke();

        // Натянутая тетива
        ctx.strokeStyle = 'rgba(241, 245, 249, 0.85)';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(22, 25);
        ctx.lineTo(22, 123);
        ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 20);
        ctx.quadraticCurveTo(42, 22, 41, 56);
        ctx.lineTo(45, 80);
        ctx.lineTo(64, 98);
        ctx.lineTo(64, 128);
        ctx.lineTo(14, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    jaethal() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ДВУРУЧНАЯ БОЕВАЯ КОСА УРГАТОА ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.save();
        ctx.translate(100, 52);
        ctx.rotate((Math.PI / 180) * 20);

        // Тёмное древко косы
        ctx.strokeStyle = '#1e1b24';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, -24);
        ctx.lineTo(0, 88);
        ctx.stroke();

        // Стальная втулка и изогнутое серповидное лезвие косы
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(2, -26);
        ctx.quadraticCurveTo(-24, -44, -46, -24); // Широкий изгиб клинка влево
        ctx.quadraticCurveTo(-24, -32, 2, -16);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Острая серебристая режущая кромка лезвия косы
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(-46, -24);
        ctx.quadraticCurveTo(-24, -32, 2, -16);
        ctx.lineTo(2, -19);
        ctx.quadraticCurveTo(-22, -34, -46, -24);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 2. ДЛИННЫЕ ПЛАТИНОВО-СЕРЕБРЯНЫЕ ВОЛОСЫ НА ЗАДНЕМ ПЛАНЕ
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(36, 48);
        ctx.quadraticCurveTo(24, 88, 22, 128);
        ctx.lineTo(106, 128);
        ctx.quadraticCurveTo(104, 88, 92, 48);
        ctx.closePath();
        ctx.fill();

        // Световые серебристые пряди по краям
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(38, 52);
        ctx.quadraticCurveTo(28, 88, 28, 128);
        ctx.lineTo(44, 128);
        ctx.lineTo(46, 56);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(90, 52);
        ctx.quadraticCurveTo(100, 88, 100, 128);
        ctx.lineTo(84, 128);
        ctx.lineTo(82, 56);
        ctx.closePath();
        ctx.fill();

        // 3. ДОСПЕХ ИНКВИЗИТОРА С ВЫСОКИМ ОСТРЫМ ВОРОТНИКОМ
        ctx.fillStyle = '#18181b';
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.lineTo(32, 96);
        ctx.lineTo(96, 96);
        ctx.lineTo(114, 128);
        ctx.closePath();
        ctx.fill();

        // Высокий острый воротник инквизитора с тёмно-багровой подкладкой
        ctx.fillStyle = '#4c0519';
        ctx.beginPath();
        ctx.moveTo(32, 96);
        ctx.lineTo(36, 76);
        ctx.lineTo(54, 96);
        ctx.lineTo(74, 96);
        ctx.lineTo(92, 76);
        ctx.lineTo(96, 96);
        ctx.lineTo(90, 116);
        ctx.lineTo(38, 116);
        ctx.closePath();
        ctx.fill();

        // Серебряная окантовка воротника и брони
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(33, 96);
        ctx.lineTo(36, 76);
        ctx.lineTo(64, 122);
        ctx.lineTo(92, 76);
        ctx.lineTo(95, 96);
        ctx.stroke();

        // Серебряный символ черепа Ургатоа на груди
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath(); ctx.arc(64, 112, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(61.5, 115, 5, 3.5);
        ctx.fillStyle = '#18181b';
        ctx.beginPath(); ctx.arc(62.3, 111.5, 1.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(65.7, 111.5, 1.1, 0, Math.PI * 2); ctx.fill();

        // 4. ДЛИННЫЕ ЗАОСТРЁННЫЕ ЭЛЬФИЙСКИЕ УШИ
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath(); ctx.moveTo(43, 60); ctx.lineTo(18, 44); ctx.lineTo(42, 70); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(85, 60); ctx.lineTo(110, 44); ctx.lineTo(86, 70); ctx.closePath(); ctx.fill();

        // 5. ШЕЯ И БЛЕДНОЕ АРИСТОКРАТИЧНОЕ ЛИЦО НЕЖИТИ
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(55, 84, 18, 16);

        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(45, 48);
        ctx.quadraticCurveTo(64, 34, 83, 48);
        ctx.lineTo(81, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(47, 78);
        ctx.closePath();
        ctx.fill();

        // Холодные скуловые тени нежити
        ctx.fillStyle = 'rgba(71, 85, 105, 0.16)';
        ctx.beginPath();
        ctx.moveTo(47, 66); ctx.lineTo(54, 78); ctx.lineTo(48, 78);
        ctx.moveTo(81, 66); ctx.lineTo(74, 78); ctx.lineTo(80, 78);
        ctx.closePath();
        ctx.fill();

        // 6. ПЛАТИНОВЫЕ ВОЛОСЫ НА МАКУШКЕ С КОСОЙ ЧЁЛКОЙ И СЕРЕБРЯНЫМ ВЕНЦОМ
        ctx.fillStyle = '#f1f5f9';
        ctx.beginPath();
        ctx.moveTo(41, 56);
        ctx.quadraticCurveTo(42, 22, 64, 20);
        ctx.quadraticCurveTo(86, 22, 87, 56);
        ctx.lineTo(83, 47);
        ctx.quadraticCurveTo(64, 35, 45, 47);
        ctx.closePath();
        ctx.fill();

        // Тонкий серебряный венец инквизитора с рубином на лбу
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(44, 45);
        ctx.quadraticCurveTo(64, 49, 84, 45);
        ctx.stroke();

        ctx.fillStyle = '#e11d48';
        ctx.beginPath();
        ctx.moveTo(64, 42);
        ctx.lineTo(67, 46.5);
        ctx.lineTo(64, 51);
        ctx.lineTo(61, 46.5);
        ctx.closePath();
        ctx.fill();

        // 7. ПЫЛАЮЩИЕ РУБИНОВО-КРАСНЫЕ ГЛАЗА НЕЖИТИ И НАДМЕННАЯ УХМЫЛКА
        ctx.fillStyle = '#18181b';
        ctx.beginPath(); ctx.ellipse(54, 60, 5, 2.3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 60, 5, 2.3, 0, 0, Math.PI * 2); ctx.fill();

        // Светящиеся алые глаза нежити (строго на одной горизонтальной линии)
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath(); ctx.arc(54, 60, 2.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 60, 2.1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#fecdd3';
        ctx.beginPath(); ctx.arc(54.7, 59.3, 0.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74.7, 59.3, 0.8, 0, Math.PI * 2); ctx.fill();

        // Высокомерно приподнятые серебристые брови
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(48, 55); ctx.quadraticCurveTo(54, 52.5, 59, 55.5);
        ctx.moveTo(80, 53.5); ctx.quadraticCurveTo(74, 51.5, 69, 55.5);
        ctx.stroke();

        // Тонкий нос и надменная полуулыбка тёмно-вишнёвых губ
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(64, 57); ctx.lineTo(62.5, 72); ctx.lineTo(65.5, 72); ctx.stroke();

        ctx.fillStyle = '#881337';
        ctx.beginPath();
        ctx.moveTo(58, 81);
        ctx.quadraticCurveTo(64, 78.5, 70, 81);
        ctx.quadraticCurveTo(64, 85, 58, 81);
        ctx.closePath();
        ctx.fill();

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 20);
        ctx.quadraticCurveTo(42, 22, 41, 56);
        ctx.lineTo(47, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(64, 128);
        ctx.lineTo(14, 128);
        ctx.lineTo(36, 48);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    kalikke() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ТЁМНО-СИНИЕ ВОЛНИСТЫЕ ВОЛОСЫ НА ЗАДНЕМ ПЛАНЕ
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(34, 52);
        ctx.quadraticCurveTo(22, 88, 22, 128);
        ctx.lineTo(106, 128);
        ctx.quadraticCurveTo(106, 88, 94, 52);
        ctx.closePath();
        ctx.fill();

        // Световые сапфировые пряди по краям волос
        ctx.fillStyle = '#1e3a8a';
        ctx.beginPath();
        ctx.moveTo(36, 54);
        ctx.quadraticCurveTo(28, 88, 28, 124);
        ctx.lineTo(44, 124);
        ctx.lineTo(46, 56);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(92, 54);
        ctx.quadraticCurveTo(100, 88, 100, 124);
        ctx.lineTo(84, 124);
        ctx.lineTo(82, 56);
        ctx.closePath();
        ctx.fill();

        // 2. ОДЕЯНИЕ КИНЕТИКА ВОДЫ С СЕРЕБРЯНОЙ ВЫШИВКОЙ
        ctx.fillStyle = '#172554';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(34, 96);
        ctx.lineTo(94, 96);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        // Лазурные отвороты кафтана и высокий воротник
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.moveTo(36, 96);
        ctx.lineTo(64, 124);
        ctx.lineTo(92, 96);
        ctx.lineTo(84, 92);
        ctx.lineTo(64, 112);
        ctx.lineTo(44, 92);
        ctx.closePath();
        ctx.fill();

        // Серебряная вышивка на груди и каплевидный аквамарин
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(36, 96);
        ctx.lineTo(64, 124);
        ctx.lineTo(92, 96);
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(64, 108);
        ctx.lineTo(68, 114);
        ctx.lineTo(64, 120);
        ctx.lineTo(60, 114);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 3. ЗАОСТРЁННЫЕ УШИ ТИФЛИНГА
        ctx.fillStyle = '#b4a5d6';
        ctx.beginPath(); ctx.moveTo(43, 60); ctx.lineTo(22, 46); ctx.lineTo(42, 70); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(85, 60); ctx.lineTo(106, 46); ctx.lineTo(86, 70); ctx.closePath(); ctx.fill();

        // 4. ШЕЯ И СДЕРЖАННОЕ ЛИЦО КАЛИККЕ (Холодный лавандово-голубой оттенок кожи)
        ctx.fillStyle = '#b4a5d6';
        ctx.fillRect(55, 84, 18, 16);

        ctx.fillStyle = '#cfc2eb';
        ctx.beginPath();
        ctx.moveTo(45, 48);
        ctx.quadraticCurveTo(64, 34, 83, 48);
        ctx.lineTo(81, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(47, 78);
        ctx.closePath();
        ctx.fill();

        // 5. ТЁМНО-СИНЯЯ ПРИЧЁСКА, ИЗОГНУТЫЕ РОЖКИ ТИФЛИНГА И СЕРЕБРЯНАЯ ДИАДЕМА
        // Изогнутые рожки тифлинга
        ctx.fillStyle = '#27272a';
        ctx.strokeStyle = '#09090b';
        ctx.lineWidth = 1.2;
        // Левый рог
        ctx.beginPath();
        ctx.moveTo(46, 36);
        ctx.bezierCurveTo(32, 26, 34, 12, 44, 6);
        ctx.bezierCurveTo(40, 16, 42, 26, 52, 33);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Правый рог
        ctx.beginPath();
        ctx.moveTo(82, 36);
        ctx.bezierCurveTo(96, 26, 94, 12, 84, 6);
        ctx.bezierCurveTo(88, 16, 86, 26, 76, 33);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Серебряные кольца-украшения на рожках
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(37, 23); ctx.lineTo(43, 25);
        ctx.moveTo(91, 23); ctx.lineTo(85, 25);
        ctx.stroke();

        // Передняя часть причёски на макушке
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(41, 56);
        ctx.quadraticCurveTo(42, 22, 64, 20);
        ctx.quadraticCurveTo(86, 22, 87, 56);
        ctx.lineTo(83, 47);
        ctx.quadraticCurveTo(72, 36, 64, 41);
        ctx.quadraticCurveTo(56, 36, 45, 47);
        ctx.closePath();
        ctx.fill();

        // Тонкая серебряная цепочка-ободок на лбу
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(44, 45);
        ctx.quadraticCurveTo(64, 49, 84, 45);
        ctx.stroke();

        // 6. РОВНЫЙ, РАССУДИТЕЛЬНЫЙ ВЗГЛЯД БИРЮЗОВЫХ ГЛАЗ И СПОКОЙНАЯ ПОЛУУЛЫБКА
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(54, 60, 4.8, 2.3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 60, 4.8, 2.3, 0, 0, Math.PI * 2); ctx.fill();

        // Яркая бирюзово-аквамариновая радужка стихии воды
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath(); ctx.arc(54, 60, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 60, 2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#083344';
        ctx.beginPath(); ctx.arc(54, 60, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 60, 1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(54.8, 59.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74.8, 59.2, 0.7, 0, Math.PI * 2); ctx.fill();

        // Тёмные ресницы и спокойные ровные брови
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(49, 59.5); ctx.quadraticCurveTo(54, 57.5, 59, 59.5);
        ctx.moveTo(69, 59.5); ctx.quadraticCurveTo(74, 57.5, 79, 59.5);
        ctx.stroke();

        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(48, 55); ctx.quadraticCurveTo(54, 53.5, 59, 55.5);
        ctx.moveTo(69, 55.5); ctx.quadraticCurveTo(74, 53.5, 80, 55);
        ctx.stroke();

        // Изящный носик и сдержанные сливово-лавандовые губы
        ctx.strokeStyle = '#9f8ec4';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 57); ctx.lineTo(62.5, 72); ctx.lineTo(65.5, 72); ctx.stroke();

        ctx.fillStyle = '#7e5a9b';
        ctx.beginPath();
        ctx.ellipse(64, 81, 4.6, 1.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // 7. КИНЕТИЧЕСКАЯ СФЕРА ВОДЫ И ЛЕДЯНЫЕ БРЫЗГИ НА ПЕРЕДНЕМ ПЛАНЕ (Слева снизу)
        ctx.fillStyle = 'rgba(56, 189, 248, 0.32)';
        ctx.beginPath(); ctx.arc(25, 108, 15, 0, Math.PI * 2); ctx.fill();

        // Водная сфера-вихрь
        ctx.fillStyle = '#0284c7';
        ctx.beginPath(); ctx.arc(25, 108, 10.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(27, 106, 7.5, 0, Math.PI * 2); ctx.fill();

        // Светящаяся волна и брызги внутри кинетического заряда
        ctx.strokeStyle = '#e0f2fe';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(25, 108, 6, Math.PI * 0.2, Math.PI * 1.3);
        ctx.stroke();

        ctx.fillStyle = '#bae6fd';
        ctx.beginPath(); ctx.arc(15, 97, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(36, 96, 1.5, 0, Math.PI * 2); ctx.fill();

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 20);
        ctx.quadraticCurveTo(42, 22, 41, 56);
        ctx.lineTo(47, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.lineTo(34, 52);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    octavia() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ПЫШНЫЕ РЫЖЕВАТО-КАШТАНОВЫЕ ЛОКОНЫ НА ЗАДНЕМ ПЛАНЕ
        ctx.fillStyle = '#7c2d12';
        ctx.beginPath();
        ctx.moveTo(32, 52);
        ctx.quadraticCurveTo(20, 88, 20, 128);
        ctx.lineTo(108, 128);
        ctx.quadraticCurveTo(108, 88, 96, 52);
        ctx.closePath();
        ctx.fill();

        // Световые медно-золотистые волны локонов по бокам
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.arc(35, 62, 16, 0, Math.PI * 2);
        ctx.arc(93, 62, 16, 0, Math.PI * 2);
        ctx.arc(31, 88, 15, 0, Math.PI * 2);
        ctx.arc(97, 88, 15, 0, Math.PI * 2);
        ctx.fill();

        // 2. ИЗЫСКАННЫЙ КАМЗОЛ МИСТИЧЕСКОГО ТРИКСТЕРА С ЗОЛОТОЙ ОТДЕЛКОЙ
        ctx.fillStyle = '#4c1d95';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(34, 96);
        ctx.lineTo(94, 96);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        // Лазурно-бирюзовые отвороты камзола и светлая рубаха
        ctx.fillStyle = '#0369a1';
        ctx.beginPath();
        ctx.moveTo(36, 96);
        ctx.lineTo(64, 124);
        ctx.lineTo(92, 96);
        ctx.lineTo(84, 92);
        ctx.lineTo(64, 112);
        ctx.lineTo(44, 92);
        ctx.closePath();
        ctx.fill();

        // Золотая вышивка по краю воротника и аметистовая брошь
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(36, 96);
        ctx.lineTo(64, 124);
        ctx.lineTo(92, 96);
        ctx.stroke();

        ctx.fillStyle = '#c084fc';
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.arc(64, 112, 4.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 3. АККУРАТНЫЕ ЗАОСТРЁННЫЕ УШКИ ПОЛУЭЛЬФИЙКИ
        ctx.fillStyle = '#e8b89a';
        ctx.beginPath(); ctx.moveTo(43, 60); ctx.lineTo(24, 48); ctx.lineTo(42, 70); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(85, 60); ctx.lineTo(104, 48); ctx.lineTo(86, 70); ctx.closePath(); ctx.fill();

        // 4. ШЕЯ И ПРИВЕТЛИВОЕ, ЖИВОЕ ЛИЦО ОКТАВИИ
        ctx.fillStyle = '#e6b293';
        ctx.fillRect(55, 84, 18, 16);

        ctx.fillStyle = '#ffedd8';
        ctx.beginPath();
        ctx.moveTo(45, 48);
        ctx.quadraticCurveTo(64, 34, 83, 48);
        ctx.lineTo(81, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(47, 78);
        ctx.closePath();
        ctx.fill();

        // Лёгкий тёплый румянец на щеках
        ctx.fillStyle = 'rgba(231, 76, 60, 0.14)';
        ctx.beginPath(); ctx.arc(50, 71, 5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(78, 71, 5, 0, Math.PI * 2); ctx.fill();

        // 5. ВОЛНИСТЫЕ РЫЖЕВАТО-МЕДНЫЕ ВОЛОСЫ И ТОНКИЙ ЗОЛОТОЙ ОБОДОК
        ctx.fillStyle = '#9a3412';
        ctx.beginPath();
        ctx.moveTo(41, 56);
        ctx.quadraticCurveTo(42, 22, 64, 20);
        ctx.quadraticCurveTo(86, 22, 87, 56);
        ctx.lineTo(83, 47);
        ctx.quadraticCurveTo(72, 36, 64, 41);
        ctx.quadraticCurveTo(56, 36, 45, 47);
        ctx.closePath();
        ctx.fill();

        // Передние мягкие пряди, обрамляющие лицо
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.moveTo(44, 44); ctx.quadraticCurveTo(38, 66, 43, 86); ctx.lineTo(48, 82); ctx.quadraticCurveTo(44, 64, 49, 46);
        ctx.moveTo(84, 44); ctx.quadraticCurveTo(90, 66, 85, 86); ctx.lineTo(80, 82); ctx.quadraticCurveTo(84, 64, 79, 46);
        ctx.fill();

        // Золотой ободок-украшение с изумрудом на лбу
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(44, 44);
        ctx.quadraticCurveTo(64, 48, 84, 44);
        ctx.stroke();

        ctx.fillStyle = '#10b981';
        ctx.beginPath(); ctx.arc(64, 45.5, 2, 0, Math.PI * 2); ctx.fill();

        // 6. РОВНЫЕ, СИЯЮЩИЕ ИЗУМРУДНЫЕ ГЛАЗА И ОЧАРОВАТЕЛЬНАЯ УЛЫБКА
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(54, 60, 4.8, 2.3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 60, 4.8, 2.3, 0, 0, Math.PI * 2); ctx.fill();

        // Яркая изумрудно-зелёная радужка
        ctx.fillStyle = '#10b981';
        ctx.beginPath(); ctx.arc(54, 60, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 60, 2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#064e3b';
        ctx.beginPath(); ctx.arc(54, 60, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 60, 1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(54.8, 59.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74.8, 59.2, 0.7, 0, Math.PI * 2); ctx.fill();

        // Аккуратные ресницы и живые изогнутые брови
        ctx.strokeStyle = '#291a10';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(49, 59.5); ctx.quadraticCurveTo(54, 57.5, 59, 59.5);
        ctx.moveTo(69, 59.5); ctx.quadraticCurveTo(74, 57.5, 79, 59.5);
        ctx.stroke();

        ctx.strokeStyle = '#7c2d12';
        ctx.lineWidth = 1.3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(48, 55); ctx.quadraticCurveTo(54, 53, 59, 55.5);
        ctx.moveTo(69, 55.5); ctx.quadraticCurveTo(74, 53, 80, 55);
        ctx.stroke();

        // Аккуратный носик и искренняя улыбка
        ctx.strokeStyle = '#d9a786';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 57); ctx.lineTo(62.5, 72); ctx.lineTo(65.5, 72); ctx.stroke();

        ctx.fillStyle = '#e06c6c';
        ctx.beginPath();
        ctx.moveTo(57, 80);
        ctx.quadraticCurveTo(64, 86.5, 71, 80);
        ctx.quadraticCurveTo(64, 83, 57, 80);
        ctx.closePath();
        ctx.fill();

        // 7. СФЕРА ТАЙНОЙ МАГИИ ТРАНСМУТАЦИИ НА ПЕРЕДНЕМ ПЛАНЕ (Слева снизу)
        ctx.fillStyle = 'rgba(192, 132, 252, 0.35)';
        ctx.beginPath(); ctx.arc(25, 108, 15, 0, Math.PI * 2); ctx.fill();

        // Золотисто-пурпурное магическое ядро
        ctx.fillStyle = '#9333ea';
        ctx.beginPath(); ctx.arc(25, 108, 9.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#fde047';
        ctx.beginPath(); ctx.arc(25, 108, 5.2, 0, Math.PI * 2); ctx.fill();

        // Орбитальное кольцо и магические искры вокруг сферы
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.ellipse(25, 108, 13.5, 4.5, -0.45, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(15, 114, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(35, 102, 1.5, 0, Math.PI * 2); ctx.fill();

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

    regongar() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ИЗОГНУТЫЙ СКИМИТАР МАГУСА ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.save();
        ctx.translate(102, 54);
        ctx.rotate((Math.PI / 180) * 26);

        // Широкий изогнутый клинок скимитара
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-4, 34);
        ctx.lineTo(-4, -16);
        ctx.quadraticCurveTo(-8, -36, 7, -48); // Характерный изогнутый кончик скимитара
        ctx.quadraticCurveTo(10, -24, 4, 34);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Светлая полированная режущая кромка и лазурная руна на клинке
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(7, -48);
        ctx.quadraticCurveTo(10, -24, 4, 34);
        ctx.lineTo(1, 34);
        ctx.quadraticCurveTo(5, -22, 7, -48);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(1, -18, 2, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // 2. ВЫСОКИЙ БОЕВОЙ ХВОСТ-ИРОКЕЗ НА МАКУШКЕ (Задний план)
        ctx.fillStyle = '#18181b';
        ctx.beginPath();
        ctx.moveTo(56, 26);
        ctx.quadraticCurveTo(64, 4, 78, 12);
        ctx.quadraticCurveTo(72, 22, 68, 28);
        ctx.closePath();
        ctx.fill();

        // 3. МОЩНЫЕ ПЛЕЧИ ПОЛУОРКА И КОЖАНО-СТАЛЬНАЯ БРОНЯ МАГУСА
        ctx.fillStyle = '#4f6d52';
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.quadraticCurveTo(30, 94, 64, 94);
        ctx.quadraticCurveTo(98, 94, 114, 128);
        ctx.closePath();
        ctx.fill();

        // Тёмный кожаный колет с железными накладками
        ctx.fillStyle = '#27272a';
        ctx.beginPath();
        ctx.moveTo(24, 128);
        ctx.lineTo(38, 96);
        ctx.lineTo(90, 96);
        ctx.lineTo(104, 128);
        ctx.closePath();
        ctx.fill();

        // Стальной наплечник с шипом на правом плече
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(112, 126);
        ctx.quadraticCurveTo(106, 92, 82, 97);
        ctx.lineTo(88, 128);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Диагональная портупея через грудь с серебряной пряжкой
        ctx.fillStyle = '#3b2416';
        ctx.beginPath();
        ctx.moveTo(36, 98);
        ctx.lineTo(66, 128);
        ctx.lineTo(82, 128);
        ctx.lineTo(50, 96);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.6;
        ctx.strokeRect(48, 109, 9, 8);

        // 4. ЗАОСТРЁННЫЕ УШИ ПОЛУОРКА С КОЛЬЦАМИ
        ctx.fillStyle = '#4f6d52';
        ctx.beginPath(); ctx.moveTo(42, 58); ctx.lineTo(22, 48); ctx.lineTo(41, 70); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(86, 58); ctx.lineTo(106, 48); ctx.lineTo(87, 70); ctx.closePath(); ctx.fill();

        // Серебряное кольцо в правом ухе
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(100, 56, 3.2, 0, Math.PI * 2); ctx.stroke();

        // 5. ВОЛЕВОЕ ЛИЦО РЕГОНГАРА, ИРОКЕЗ И ШРАМ
        ctx.fillStyle = '#628565';
        ctx.beginPath();
        ctx.moveTo(43, 46);
        ctx.quadraticCurveTo(64, 24, 85, 46); // Выбритые виски
        ctx.lineTo(85, 80);
        ctx.lineTo(72, 98);
        ctx.lineTo(56, 98);
        ctx.lineTo(43, 80);
        ctx.closePath();
        ctx.fill();

        // Центральный гребень чёрных волос-ирокеза на макушке
        ctx.fillStyle = '#18181b';
        ctx.beginPath();
        ctx.moveTo(57, 42);
        ctx.quadraticCurveTo(58, 20, 64, 18);
        ctx.quadraticCurveTo(70, 20, 71, 42);
        ctx.closePath();
        ctx.fill();

        // Световая зона на скулах и челюсти
        ctx.fillStyle = '#759c78';
        ctx.beginPath();
        ctx.moveTo(47, 66);
        ctx.lineTo(81, 66);
        ctx.lineTo(78, 90);
        ctx.lineTo(64, 96);
        ctx.lineTo(50, 90);
        ctx.closePath();
        ctx.fill();

        // Косой боевой шрам через левую скулу
        ctx.strokeStyle = '#991b1b';
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(46, 66);
        ctx.lineTo(54, 78);
        ctx.stroke();

        // 6. РОВНЫЙ ДЕРЗКИЙ ВЗГЛЯД, БРОВИ И УХМЫЛКА С КЛЫКАМИ
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(53, 60, 4.8, 2.1, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 60, 4.8, 2.1, 0, 0, Math.PI * 2); ctx.fill();

        // Янтарно-золотая драконья радужка
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.arc(53, 60, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 60, 2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(53, 60, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 60, 1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(53.8, 59.2, 0.65, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75.8, 59.2, 0.65, 0, Math.PI * 2); ctx.fill();

        // Дерзкие густые чёрные брови
        ctx.strokeStyle = '#18181b';
        ctx.lineWidth = 1.9;
        ctx.beginPath();
        ctx.moveTo(46, 55); ctx.lineTo(59, 57);
        ctx.moveTo(82, 54); ctx.lineTo(69, 57);
        ctx.stroke();

        // Прямой нос полуорка
        ctx.fillStyle = '#4f6d52';
        ctx.beginPath();
        ctx.moveTo(61, 58);
        ctx.lineTo(67, 58);
        ctx.lineTo(69, 72);
        ctx.lineTo(64, 74);
        ctx.lineTo(59, 72);
        ctx.closePath();
        ctx.fill();

        // Самодовольная ухмылка и пара нижних клыков
        ctx.strokeStyle = '#18181b';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(52, 83);
        ctx.quadraticCurveTo(64, 87, 76, 81);
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#18181b';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(51, 84); ctx.lineTo(49.5, 76); ctx.lineTo(55, 83.5); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(77, 82.5); ctx.lineTo(78.5, 74.5); ctx.lineTo(73, 82); ctx.closePath(); ctx.fill(); ctx.stroke();

        // 7. РАЗРЯД ЭЛЕКТРИЧЕСКОЙ МАГИИ СИНЕГО ДРАКОНА НА ПЕРЕДНЕМ ПЛАНЕ (Слева снизу)
        ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.beginPath(); ctx.arc(25, 108, 15, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0284c7';
        ctx.beginPath(); ctx.arc(25, 108, 8.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#e0f2fe';
        ctx.beginPath(); ctx.arc(25, 108, 4.5, 0, Math.PI * 2); ctx.fill();

        // Зигзаги молний вокруг сферы
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(25, 99); ctx.lineTo(21, 93); ctx.lineTo(26, 90);
        ctx.moveTo(33, 108); ctx.lineTo(39, 104); ctx.lineTo(41, 109);
        ctx.moveTo(17, 111); ctx.lineTo(11, 115); ctx.lineTo(14, 119);
        ctx.stroke();

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 18);
        ctx.quadraticCurveTo(50, 28, 43, 46);
        ctx.lineTo(43, 80);
        ctx.lineTo(56, 98);
        ctx.lineTo(64, 98);
        ctx.lineTo(64, 128);
        ctx.lineTo(14, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    linzi() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ОДЕЯНИЕ БАРДА: Алый камзол с золотым шитьём и пышное жабо
        ctx.fillStyle = '#991b1b';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(34, 96);
        ctx.lineTo(94, 96);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        // Золотая вышивка по отворотам камзола
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(36, 98);
        ctx.lineTo(64, 126);
        ctx.lineTo(92, 98);
        ctx.stroke();

        // Пышный кремовый шейный платок-жабо барда
        ctx.fillStyle = '#fefce8';
        ctx.beginPath();
        ctx.moveTo(46, 96);
        ctx.lineTo(82, 96);
        ctx.lineTo(76, 118);
        ctx.lineTo(64, 124);
        ctx.lineTo(52, 118);
        ctx.closePath();
        ctx.fill();

        // Золотая брошь-лира на вороте жабо
        ctx.fillStyle = '#ffd875';
        ctx.beginPath(); ctx.arc(64, 104, 3.8, 0, Math.PI * 2); ctx.fill();

        // 2. АККУРАТНЫЕ ОКРУГЛЫЕ УШКИ ПОЛУРОСЛИЦЫ
        ctx.fillStyle = '#e8b598';
        ctx.beginPath(); ctx.ellipse(42, 65, 4.2, 6.5, -0.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(86, 65, 4.2, 6.5, 0.1, 0, Math.PI * 2); ctx.fill();

        // 3. ШЕЯ И ЖИЗНЕРАДОСТНОЕ ЛИЦО ЛИНДЗИ С ВЕСНУШКАМИ
        ctx.fillStyle = '#e5b293';
        ctx.fillRect(55, 84, 18, 16);

        ctx.fillStyle = '#ffedd8';
        ctx.beginPath();
        ctx.moveTo(44, 48);
        ctx.quadraticCurveTo(64, 34, 84, 48);
        ctx.lineTo(82, 78);
        ctx.lineTo(64, 95);
        ctx.lineTo(46, 78);
        ctx.closePath();
        ctx.fill();

        // Мягкий тёплый румянец и задорные веснушки на щеках
        ctx.fillStyle = 'rgba(225, 29, 72, 0.14)';
        ctx.beginPath(); ctx.arc(49, 70, 5.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(79, 70, 5.2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#b45309';
        ctx.fillRect(48, 69, 1.4, 1.4); ctx.fillRect(52, 71, 1.4, 1.4); ctx.fillRect(50, 73, 1.4, 1.4);
        ctx.fillRect(78, 69, 1.4, 1.4); ctx.fillRect(74, 71, 1.4, 1.4); ctx.fillRect(76, 73, 1.4, 1.4);

        // 4. КОРОТКАЯ ЗАДОРНАЯ ЗОЛОТИСТО-РУСАЯ СТРИЖКА С ВИХРАМИ
        ctx.fillStyle = '#ca8a04';
        ctx.beginPath();
        ctx.moveTo(40, 58);
        ctx.quadraticCurveTo(38, 22, 64, 20);
        ctx.quadraticCurveTo(90, 22, 88, 58);
        ctx.lineTo(84, 48);
        ctx.quadraticCurveTo(64, 36, 44, 48);
        ctx.closePath();
        ctx.fill();

        // Световые пшенично-золотые пряди и задорные вихры на макушке
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.moveTo(48, 34);
        ctx.quadraticCurveTo(64, 21, 80, 34);
        ctx.quadraticCurveTo(64, 29, 48, 34);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ca8a04';
        ctx.beginPath();
        ctx.moveTo(56, 22); ctx.lineTo(52, 12); ctx.lineTo(63, 20);
        ctx.moveTo(66, 20); ctx.lineTo(72, 11); ctx.lineTo(74, 22);
        ctx.moveTo(52, 38); ctx.lineTo(48, 49); ctx.lineTo(57, 41);
        ctx.closePath();
        ctx.fill();

        // 5. КРУПНЫЕ ЛЮБОЗНАТЕЛЬНЫЕ ГЛАЗА И ВОСТОРЖЕННАЯ УЛЫБКА
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(53, 60, 5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(75, 60, 5, 2.5, 0, 0, Math.PI * 2); ctx.fill();

        // Яркая изумрудно-медовая радужка летописца
        ctx.fillStyle = '#15803d';
        ctx.beginPath(); ctx.arc(53, 60, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 60, 2.2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(53, 60, 1.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(75, 60, 1.1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(54, 59, 0.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(76, 59, 0.8, 0, Math.PI * 2); ctx.fill();

        // Живые приподнятые брови
        ctx.strokeStyle = '#854d0e';
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(47, 54.5); ctx.quadraticCurveTo(53, 52, 59, 55);
        ctx.moveTo(69, 55); ctx.quadraticCurveTo(75, 52, 81, 54.5);
        ctx.stroke();

        // Аккуратный курносый носик и широкая восторженная улыбка
        ctx.strokeStyle = '#d49d7c';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 57); ctx.lineTo(62.5, 71); ctx.lineTo(65.5, 71); ctx.stroke();

        ctx.fillStyle = '#7f1d1d';
        ctx.beginPath();
        ctx.moveTo(56, 79);
        ctx.quadraticCurveTo(64, 81, 72, 79);
        ctx.quadraticCurveTo(70, 86, 64, 86);
        ctx.quadraticCurveTo(58, 86, 56, 79);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(58, 79.5, 12, 1.8);

        // 6. КНИГА ЛЕТОПИСЦА И БОЛЬШОЕ ГУСИНОЕ ПЕРО НА ПЕРЕДНЕМ ПЛАНЕ (Слева снизу)
        ctx.save();
        ctx.translate(27, 109);
        ctx.rotate((Math.PI / 180) * -10);

        // Кожаный переплёт дневника Линдзи
        ctx.fillStyle = '#78350f';
        ctx.strokeStyle = '#3b1c0a';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(-14, -7, 28, 18, 2);
        ctx.fill();
        ctx.stroke();

        // Раскрытые страницы хроники
        ctx.fillStyle = '#fefce8';
        ctx.beginPath();
        ctx.moveTo(-12, -5);
        ctx.quadraticCurveTo(-6, -7, 0, -4);
        ctx.quadraticCurveTo(6, -7, 12, -5);
        ctx.lineTo(12, 9);
        ctx.quadraticCurveTo(6, 7, 0, 10);
        ctx.quadraticCurveTo(-6, 7, -12, 9);
        ctx.closePath();
        ctx.fill();

        // Строчки текста и переплёт
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -4); ctx.lineTo(0, 10);
        ctx.moveTo(-9, -1); ctx.lineTo(-3, -1);
        ctx.moveTo(-9, 3); ctx.lineTo(-3, 3);
        ctx.moveTo(3, -1); ctx.lineTo(9, -1);
        ctx.stroke();

        // Большое бело-золотое гусиное перо для записей
        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(4, -2);
        ctx.quadraticCurveTo(10, -18, 18, -26);
        ctx.quadraticCurveTo(16, -12, 7, -1);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(3, 1);
        ctx.lineTo(16, -24);
        ctx.stroke();
        ctx.restore();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.beginPath();
        ctx.moveTo(64, 20);
        ctx.quadraticCurveTo(38, 22, 40, 58);
        ctx.lineTo(46, 78);
        ctx.lineTo(64, 95);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    kanerah() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ТЁМНЫЕ С МЕДНЫМ ОТЛИВОМ ВОЛНИСТЫЕ ВОЛОСЫ НА ЗАДНЕМ ПЛАНЕ
        ctx.fillStyle = '#291512';
        ctx.beginPath();
        ctx.moveTo(34, 52);
        ctx.quadraticCurveTo(22, 88, 22, 128);
        ctx.lineTo(106, 128);
        ctx.quadraticCurveTo(106, 88, 94, 52);
        ctx.closePath();
        ctx.fill();

        // Огненно-медные пряди по краям волос
        ctx.fillStyle = '#7c2d12';
        ctx.beginPath();
        ctx.moveTo(36, 54);
        ctx.quadraticCurveTo(28, 88, 28, 124);
        ctx.lineTo(44, 124);
        ctx.lineTo(46, 56);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(92, 54);
        ctx.quadraticCurveTo(100, 88, 100, 124);
        ctx.lineTo(84, 124);
        ctx.lineTo(82, 56);
        ctx.closePath();
        ctx.fill();

        // 2. ОДЕЯНИЕ КИНЕТИКА ОГНЯ С ЗОЛОТОЙ ВЫШИВКОЙ И ОТКРЫТЫМ ВЫРЕЗОМ
        ctx.fillStyle = '#450a0a';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(34, 96);
        ctx.lineTo(94, 96);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        // Алые отвороты кафтана и открытое декольте
        ctx.fillStyle = '#e5a385';
        ctx.beginPath();
        ctx.moveTo(46, 96);
        ctx.lineTo(64, 122);
        ctx.lineTo(82, 96);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#b91c1c';
        ctx.beginPath();
        ctx.moveTo(36, 96);
        ctx.lineTo(64, 124);
        ctx.lineTo(92, 96);
        ctx.lineTo(84, 92);
        ctx.lineTo(64, 114);
        ctx.lineTo(44, 92);
        ctx.closePath();
        ctx.fill();

        // Золотая вышивка по краям выреза и огранённый рубин на шее
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(36, 96);
        ctx.lineTo(64, 124);
        ctx.lineTo(92, 96);
        ctx.stroke();

        ctx.fillStyle = '#f43f5e';
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(64, 98);
        ctx.lineTo(67.5, 103.5);
        ctx.lineTo(64, 109);
        ctx.lineTo(60.5, 103.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 3. ЗАОСТРЁННЫЕ УШИ ТИФЛИНГА
        ctx.fillStyle = '#d99677';
        ctx.beginPath(); ctx.moveTo(43, 60); ctx.lineTo(22, 46); ctx.lineTo(42, 70); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(85, 60); ctx.lineTo(106, 46); ctx.lineTo(86, 70); ctx.closePath(); ctx.fill();

        // 4. ШЕЯ И ВЫРАЗИТЕЛЬНОЕ ЛИЦО КАНЕРЫ (Тёплый медно-персиковый оттенок кожи)
        ctx.fillStyle = '#d99677';
        ctx.fillRect(55, 84, 18, 16);

        ctx.fillStyle = '#f2b89b';
        ctx.beginPath();
        ctx.moveTo(45, 48);
        ctx.quadraticCurveTo(64, 34, 83, 48);
        ctx.lineTo(81, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(47, 78);
        ctx.closePath();
        ctx.fill();

        // Мягкий тёплый румянец на щеках
        ctx.fillStyle = 'rgba(225, 29, 72, 0.14)';
        ctx.beginPath(); ctx.arc(50, 71, 5.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(78, 71, 5.2, 0, Math.PI * 2); ctx.fill();

        // 5. ТЁМНО-МЕДНАЯ ПРИЧЁСКА, ИЗОГНУТЫЕ РОЖКИ ТИФЛИНГА И ЗОЛОТАЯ ДИАДЕМА
        // Изогнутые рожки тифлинга
        ctx.fillStyle = '#27272a';
        ctx.strokeStyle = '#09090b';
        ctx.lineWidth = 1.2;
        // Левый рог
        ctx.beginPath();
        ctx.moveTo(46, 36);
        ctx.bezierCurveTo(32, 26, 34, 12, 44, 6);
        ctx.bezierCurveTo(40, 16, 42, 26, 52, 33);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Правый рог
        ctx.beginPath();
        ctx.moveTo(82, 36);
        ctx.bezierCurveTo(96, 26, 94, 12, 84, 6);
        ctx.bezierCurveTo(88, 16, 86, 26, 76, 33);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Золотые кольца-украшения на рожках
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(37, 23); ctx.lineTo(43, 25);
        ctx.moveTo(91, 23); ctx.lineTo(85, 25);
        ctx.stroke();

        // Передняя часть причёски на макушке
        ctx.fillStyle = '#451a12';
        ctx.beginPath();
        ctx.moveTo(41, 56);
        ctx.quadraticCurveTo(42, 22, 64, 20);
        ctx.quadraticCurveTo(86, 22, 87, 56);
        ctx.lineTo(83, 47);
        ctx.quadraticCurveTo(72, 36, 64, 41);
        ctx.quadraticCurveTo(56, 36, 45, 47);
        ctx.closePath();
        ctx.fill();

        // Тонкая золотая цепочка-ободок на лбу
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(44, 45);
        ctx.quadraticCurveTo(64, 49, 84, 45);
        ctx.stroke();

        // 6. РОВНЫЙ, ДЕРЗКИЙ ВЗГЛЯД ЯНТАРНЫХ ГЛАЗ И ХИТРАЯ УХМЫЛКА
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(54, 60, 4.8, 2.3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(74, 60, 4.8, 2.3, 0, 0, Math.PI * 2); ctx.fill();

        // Пылающая янтарно-золотая радужка стихии огня
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.arc(54, 60, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 60, 2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#451a03';
        ctx.beginPath(); ctx.arc(54, 60, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74, 60, 1, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(54.8, 59.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74.8, 59.2, 0.7, 0, Math.PI * 2); ctx.fill();

        // Выразительные тёмные стрелки и дерзко приподнятая правая бровь
        ctx.strokeStyle = '#1c1917';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(48, 59.5); ctx.quadraticCurveTo(54, 57.5, 59, 60);
        ctx.moveTo(80, 59.5); ctx.quadraticCurveTo(74, 57.5, 69, 60);
        ctx.stroke();

        ctx.strokeStyle = '#291512';
        ctx.lineWidth = 1.3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(48, 55); ctx.quadraticCurveTo(54, 53.5, 59, 55.5);
        ctx.moveTo(69, 55.5); ctx.quadraticCurveTo(74, 52, 80, 54.5);
        ctx.stroke();

        // Изящный носик и хитрая полуулыбка алых губ
        ctx.strokeStyle = '#c27e61';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(64, 57); ctx.lineTo(62.5, 72); ctx.lineTo(65.5, 72); ctx.stroke();

        ctx.fillStyle = '#be123c';
        ctx.beginPath();
        ctx.moveTo(58, 81);
        ctx.quadraticCurveTo(64, 78.5, 70, 81.5);
        ctx.quadraticCurveTo(64, 85, 58, 81);
        ctx.closePath();
        ctx.fill();

        // 7. СГУСТОК КИНЕТИЧЕСКОГО ОГНЯ И ИСКРЫ НА ПЕРЕДНЕМ ПЛАНЕ (Слева снизу)
        ctx.fillStyle = 'rgba(249, 115, 22, 0.35)';
        ctx.beginPath(); ctx.arc(24, 108, 15, 0, Math.PI * 2); ctx.fill();

        // Язык кинетического пламени
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.moveTo(24, 90);
        ctx.quadraticCurveTo(35, 103, 30, 116);
        ctx.quadraticCurveTo(24, 121, 18, 116);
        ctx.quadraticCurveTo(13, 103, 24, 90);
        ctx.closePath();
        ctx.fill();

        // Раскалённое золотое ядро пламени и искры
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.moveTo(24, 97);
        ctx.quadraticCurveTo(30, 106, 27, 114);
        ctx.quadraticCurveTo(24, 117, 21, 114);
        ctx.quadraticCurveTo(18, 106, 24, 97);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fef08a';
        ctx.beginPath(); ctx.arc(15, 95, 1.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(35, 94, 1.4, 0, Math.PI * 2); ctx.fill();

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА (Мягкая тень на левую половину)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 20);
        ctx.quadraticCurveTo(42, 22, 41, 56);
        ctx.lineTo(47, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.lineTo(34, 52);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },
    orc() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ЗАЗУБРЕННЫЙ ОРОЧИЙ ТЕСАК ЗА ПРАВЫМ ПЛЕЧОМ (Задний план)
        ctx.save();
        ctx.translate(102, 54);
        ctx.rotate((Math.PI / 180) * 26);

        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-5, 34);
        ctx.lineTo(-5, -18);
        ctx.lineTo(-3, -21);
        ctx.lineTo(-5, -24);
        ctx.lineTo(-5, -36);
        ctx.lineTo(7, -46);
        ctx.lineTo(7, 34);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(7, -46);
        ctx.lineTo(7, 34);
        ctx.lineTo(3, 34);
        ctx.lineTo(3, -42);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 2. ВЫСОКИЙ БОЕВОЙ ХВОСТ-ИРОКЕЗ НА МАКУШКЕ
        ctx.fillStyle = '#18181b';
        ctx.beginPath();
        ctx.moveTo(56, 26);
        ctx.quadraticCurveTo(64, 4, 78, 12);
        ctx.quadraticCurveTo(72, 22, 68, 28);
        ctx.closePath();
        ctx.fill();

        // 3. МОЩНЫЕ ПЛЕЧИ ОРКА, МЕХ И ГРУБАЯ КОЖАНАЯ БРОНЯ
        ctx.fillStyle = '#2d5a36';
        ctx.beginPath();
        ctx.moveTo(14, 128);
        ctx.quadraticCurveTo(30, 94, 64, 94);
        ctx.quadraticCurveTo(98, 94, 114, 128);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#3b2416';
        ctx.beginPath();
        ctx.moveTo(22, 128);
        ctx.lineTo(36, 96);
        ctx.lineTo(92, 96);
        ctx.lineTo(106, 128);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#57534e';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.quadraticCurveTo(22, 94, 44, 98);
        ctx.lineTo(38, 128);
        ctx.closePath();
        ctx.fill();

        // Ожерелье из костяных клыков
        ctx.strokeStyle = '#1c1917';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(38, 100);
        ctx.quadraticCurveTo(64, 116, 90, 100);
        ctx.stroke();

        ctx.fillStyle = '#f5eedc';
        ctx.beginPath();
        ctx.moveTo(49, 106);
        ctx.lineTo(52, 118);
        ctx.lineTo(56, 108);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(61, 109);
        ctx.lineTo(64, 123);
        ctx.lineTo(67, 109);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(79, 106);
        ctx.lineTo(76, 118);
        ctx.lineTo(72, 108);
        ctx.fill();

        // 4. ЗАОСТРЁННЫЕ УШИ ОРКА С СЕРЬГАМИ-КОЛЬЦАМИ
        ctx.fillStyle = '#2d5a36';
        ctx.beginPath();
        ctx.moveTo(41, 58);
        ctx.lineTo(18, 48);
        ctx.lineTo(40, 72);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(87, 58);
        ctx.lineTo(110, 48);
        ctx.lineTo(88, 72);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(23, 56, 3.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(105, 56, 3.5, 0, Math.PI * 2);
        ctx.stroke();
        // 5. СУРОВОЕ СКУЛАСТОЕ ЛИЦО ОРКА С ИРОКЕЗОМ И ШРАМОМ
        ctx.fillStyle = '#3b7346';
        ctx.beginPath();
        ctx.moveTo(42, 46);
        ctx.quadraticCurveTo(64, 24, 86, 46);
        ctx.lineTo(87, 80);
        ctx.lineTo(74, 100);
        ctx.lineTo(54, 100);
        ctx.lineTo(41, 80);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#18181b';
        ctx.beginPath();
        ctx.moveTo(57, 42);
        ctx.quadraticCurveTo(58, 20, 64, 18);
        ctx.quadraticCurveTo(70, 20, 71, 42);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#4b8c58';
        ctx.beginPath();
        ctx.moveTo(46, 66);
        ctx.lineTo(82, 66);
        ctx.lineTo(79, 92);
        ctx.lineTo(64, 98);
        ctx.lineTo(49, 92);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#991b1b';
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(72, 51);
        ctx.lineTo(80, 74);
        ctx.stroke();

        // 6. РОВНЫЙ, СВИРЕПЫЙ ВЗГЛЯД, ПРИПЛЮСНУТЫЙ НОС И КЛЫКИ
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(53, 60, 4.8, 2.1, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(75, 60, 4.8, 2.1, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.arc(53, 60, 1.9, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(75, 60, 1.9, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(53, 60, 0.9, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(75, 60, 0.9, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#142b19';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(45, 54.5);
        ctx.lineTo(59, 58);
        ctx.moveTo(83, 54.5);
        ctx.lineTo(69, 58);
        ctx.stroke();

        ctx.fillStyle = '#254a2c';
        ctx.beginPath();
        ctx.moveTo(64, 59);
        ctx.lineTo(71, 72);
        ctx.lineTo(57, 72);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#142b19';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(48, 85);
        ctx.quadraticCurveTo(64, 80, 80, 85);
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#142b19';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(47, 86);
        ctx.lineTo(44, 71);
        ctx.lineTo(53, 85);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(81, 86);
        ctx.lineTo(84, 71);
        ctx.lineTo(75, 85);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 18);
        ctx.quadraticCurveTo(50, 28, 42, 46);
        ctx.lineTo(41, 80);
        ctx.lineTo(54, 100);
        ctx.lineTo(64, 100);
        ctx.lineTo(64, 128);
        ctx.lineTo(14, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    elf() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. СТРУЯЩИЕСЯ СЕРЕБРЯНЫЕ ВОЛОСЫ НА ЗАДНЕМ ПЛАНЕ
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(36, 48);
        ctx.quadraticCurveTo(24, 88, 22, 128);
        ctx.lineTo(106, 128);
        ctx.quadraticCurveTo(104, 88, 92, 48);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(38, 52);
        ctx.quadraticCurveTo(28, 88, 28, 128);
        ctx.lineTo(44, 128);
        ctx.lineTo(46, 56);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(90, 52);
        ctx.quadraticCurveTo(100, 88, 100, 128);
        ctx.lineTo(84, 128);
        ctx.lineTo(82, 56);
        ctx.closePath();
        ctx.fill();
        // 2. ИЗЫСКАННЫЙ ЭЛЬФИЙСКИЙ КАФТАН С ВЫСОКИМ ВОРОТНИКОМ
        ctx.fillStyle = '#1e3a8a';
        ctx.beginPath();
        ctx.moveTo(16, 128);
        ctx.lineTo(34, 96);
        ctx.lineTo(94, 96);
        ctx.lineTo(112, 128);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#172554';
        ctx.beginPath();
        ctx.moveTo(34, 96);
        ctx.lineTo(42, 86);
        ctx.lineTo(56, 98);
        ctx.lineTo(72, 98);
        ctx.lineTo(86, 86);
        ctx.lineTo(94, 96);
        ctx.lineTo(88, 114);
        ctx.lineTo(40, 114);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(35, 96);
        ctx.lineTo(42, 86);
        ctx.lineTo(64, 122);
        ctx.lineTo(86, 86);
        ctx.lineTo(93, 96);
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(64, 108);
        ctx.lineTo(68, 114);
        ctx.lineTo(64, 120);
        ctx.lineTo(60, 114);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 3. ДЛИННЫЕ ЗАОСТРЁННЫЕ ЭЛЬФИЙСКИЕ УШИ
        ctx.fillStyle = '#e2c2ad';
        ctx.beginPath();
        ctx.moveTo(43, 60);
        ctx.lineTo(20, 44);
        ctx.lineTo(42, 70);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(85, 60);
        ctx.lineTo(108, 44);
        ctx.lineTo(86, 70);
        ctx.closePath();
        ctx.fill();

        // 4. ШЕЯ И УТОНЧЁННОЕ АРИСТОКРАТИЧНОЕ ЛИЦО
        ctx.fillStyle = '#dfb9a2';
        ctx.fillRect(55, 84, 18, 18);

        ctx.fillStyle = '#f5dfd0';
        ctx.beginPath();
        ctx.moveTo(45, 48);
        ctx.quadraticCurveTo(64, 34, 83, 48);
        ctx.lineTo(81, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(47, 78);
        ctx.closePath();
        ctx.fill();

        // 5. СЕРЕБРЯНЫЕ ВОЛОСЫ НА МАКУШКЕ И ТОНКАЯ ДИАДЕМА С САПФИРОМ
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(42, 54);
        ctx.quadraticCurveTo(42, 22, 64, 20);
        ctx.quadraticCurveTo(86, 22, 86, 54);
        ctx.lineTo(82, 46);
        ctx.quadraticCurveTo(64, 34, 46, 46);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#ffd875';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(44, 45);
        ctx.quadraticCurveTo(64, 49, 84, 45);
        ctx.stroke();

        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.moveTo(64, 42);
        ctx.lineTo(67, 46.5);
        ctx.lineTo(64, 51);
        ctx.lineTo(61, 46.5);
        ctx.closePath();
        ctx.fill();

        // 6. РОВНЫЕ, ЯСНЫЕ И ГОРДЫЕ ГЛАЗА
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(54, 60, 4.8, 2.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(74, 60, 4.8, 2.2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0ea5e9';
        ctx.beginPath();
        ctx.arc(54, 60, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(74, 60, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0c4a6e';
        ctx.beginPath();
        ctx.arc(54, 60, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(74, 60, 1, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(54.8, 59.2, 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(74.8, 59.2, 0.7, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(48, 55);
        ctx.quadraticCurveTo(54, 53.5, 59, 55);
        ctx.moveTo(69, 55);
        ctx.quadraticCurveTo(74, 53.5, 80, 55);
        ctx.stroke();

        ctx.strokeStyle = '#c9a189';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(64, 57);
        ctx.lineTo(62.5, 72);
        ctx.lineTo(65.5, 72);
        ctx.stroke();

        ctx.strokeStyle = '#b06d66';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(58, 81);
        ctx.quadraticCurveTo(64, 83, 70, 81);
        ctx.stroke();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.beginPath();
        ctx.moveTo(64, 20);
        ctx.quadraticCurveTo(42, 22, 42, 54);
        ctx.lineTo(47, 78);
        ctx.lineTo(64, 96);
        ctx.lineTo(64, 128);
        ctx.lineTo(16, 128);
        ctx.lineTo(36, 48);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },
    dwarf() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ДВУРУЧНЫЙ БОЕВОЙ МОЛОТ ДВАРФА ЗА ПРАВЫМ ПЛЕЧОМ
        ctx.save();
        ctx.translate(102, 50);
        ctx.rotate((Math.PI / 180) * 24);

        ctx.strokeStyle = '#4a311d';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, -16);
        ctx.lineTo(0, 88);
        ctx.stroke();

        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(-18, -14, 36, 17, 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(-16, -12, 32, 4);

        ctx.fillStyle = '#ffd875';
        ctx.fillRect(-4, -14, 8, 17);

        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(-3.5, -14);
        ctx.lineTo(0, -23);
        ctx.lineTo(3.5, -14);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 2. ШИРОКИЕ ПЛЕЧИ, КОЛЬЧУГА И СТАЛЬНЫЕ НАПЛЕЧНИКИ
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(12, 128);
        ctx.quadraticCurveTo(28, 92, 64, 92);
        ctx.quadraticCurveTo(100, 92, 116, 128);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(14, 126);
        ctx.quadraticCurveTo(20, 92, 46, 97);
        ctx.lineTo(40, 128);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(114, 126);
        ctx.quadraticCurveTo(108, 92, 82, 97);
        ctx.lineTo(88, 128);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 3. ШИРОКОЕ СКУЛАСТОЕ ЛИЦО ДВАРФА
        ctx.fillStyle = '#e5b293';
        ctx.beginPath();
        ctx.moveTo(41, 48);
        ctx.lineTo(87, 48);
        ctx.lineTo(88, 80);
        ctx.lineTo(64, 102);
        ctx.lineTo(40, 80);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'rgba(220, 38, 38, 0.14)';
        ctx.beginPath();
        ctx.arc(46, 70, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(82, 70, 5.5, 0, Math.PI * 2);
        ctx.fill();

        // 4. ПЫШНАЯ ОГНЕННО-РЫЖАЯ БОРОДА С ДВУМЯ КОСАМИ
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.moveTo(40, 72);
        ctx.lineTo(30, 102);
        ctx.lineTo(42, 128);
        ctx.lineTo(86, 128);
        ctx.lineTo(98, 102);
        ctx.lineTo(88, 72);
        ctx.quadraticCurveTo(64, 84, 40, 72);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(51, 86);
        ctx.lineTo(47, 126);
        ctx.moveTo(64, 88);
        ctx.lineTo(64, 128);
        ctx.moveTo(77, 86);
        ctx.lineTo(81, 126);
        ctx.stroke();

        ctx.fillStyle = '#92400e';
        ctx.beginPath();
        ctx.moveTo(46, 76);
        ctx.quadraticCurveTo(64, 70, 82, 76);
        ctx.lineTo(85, 87);
        ctx.quadraticCurveTo(64, 79, 43, 87);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffd875';
        ctx.strokeStyle = '#785a14';
        ctx.lineWidth = 1.1;
        ctx.fillRect(44, 117, 10, 5.5);
        ctx.strokeRect(44, 117, 10, 5.5);
        ctx.fillRect(74, 117, 10, 5.5);
        ctx.strokeRect(74, 117, 10, 5.5);

        // 5. ГЛАЗА, БРОВИ И КРУПНЫЙ НОС
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(52, 60, 4.8, 2.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(76, 60, 4.8, 2.2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.arc(52, 60, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(76, 60, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(52, 60, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(76, 60, 1, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(52.8, 59.2, 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(76.8, 59.2, 0.7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.moveTo(44, 53.5);
        ctx.lineTo(60, 57);
        ctx.lineTo(59, 60);
        ctx.lineTo(44, 57);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(84, 53.5);
        ctx.lineTo(68, 57);
        ctx.lineTo(69, 60);
        ctx.lineTo(84, 57);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#d49a79';
        ctx.beginPath();
        ctx.moveTo(60, 58);
        ctx.lineTo(68, 58);
        ctx.lineTo(71, 72);
        ctx.quadraticCurveTo(64, 76, 57, 72);
        ctx.closePath();
        ctx.fill();

        // 6. КОВАНЫЙ ДВАРФИЙСКИЙ ШЛЕМ
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(38, 52);
        ctx.quadraticCurveTo(42, 22, 64, 20);
        ctx.quadraticCurveTo(86, 22, 90, 52);
        ctx.lineTo(88, 72);
        ctx.lineTo(83, 72);
        ctx.lineTo(83, 52);
        ctx.lineTo(45, 52);
        ctx.lineTo(45, 72);
        ctx.lineTo(40, 72);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.moveTo(39, 46);
        ctx.lineTo(64, 42);
        ctx.lineTo(89, 46);
        ctx.lineTo(88, 52);
        ctx.lineTo(64, 48);
        ctx.lineTo(40, 52);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(45, 48.5, 1.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(55, 46.5, 1.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(73, 46.5, 1.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(83, 48.5, 1.3, 0, Math.PI * 2);
        ctx.fill();

        // 7. ЭФФЕКТ FLAT-ОБЪЕМА
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(64, 20);
        ctx.quadraticCurveTo(42, 22, 38, 52);
        ctx.lineTo(40, 72);
        ctx.lineTo(30, 102);
        ctx.lineTo(42, 128);
        ctx.lineTo(64, 128);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },
    rogue() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true;

        // 1. ГЛУБОКИЙ ПОТРЁПАННЫЙ КАПЮШОН РАЗБОЙНИКА
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

        ctx.fillStyle = '#4a1c1c';
        ctx.beginPath();
        ctx.moveTo(38, 96);
        ctx.quadraticCurveTo(64, 112, 90, 96);
        ctx.lineTo(86, 110);
        ctx.quadraticCurveTo(64, 122, 42, 110);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(40, 116, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(88, 116, 2, 0, Math.PI * 2);
        ctx.fill();

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

        ctx.fillStyle = '#1f1611';
        ctx.beginPath();
        ctx.moveTo(43, 48);
        ctx.lineTo(48, 57);
        ctx.lineTo(54, 49);
        ctx.moveTo(74, 49);
        ctx.lineTo(80, 56);
        ctx.lineTo(85, 48);
        ctx.fill();

        // 4. ПОВЯЗКА НА ЛЕВОМ ГЛАЗУ И ПРАВЫЙ ГЛАЗ
        ctx.strokeStyle = '#140f0c';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(41, 61);
        ctx.lineTo(86, 54);
        ctx.stroke();

        ctx.fillStyle = '#140f0c';
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(53, 62, 6.5, 4.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(75, 62, 4.8, 2.1, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#854d27';
        ctx.beginPath();
        ctx.arc(74.5, 62, 1.9, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(74.5, 62, 0.9, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(75.3, 61.2, 0.65, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#1f1611';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(69, 57.5);
        ctx.lineTo(81, 56.5);
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

        ctx.strokeStyle = '#523826';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(39, 55);
        ctx.quadraticCurveTo(64, 43, 89, 55);
        ctx.stroke();

        // 6. НОС И УХМЫЛКА
        ctx.fillStyle = '#b87d5e';
        ctx.beginPath();
        ctx.moveTo(64, 60);
        ctx.lineTo(68, 74);
        ctx.quadraticCurveTo(64, 77, 61, 74);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#261a12';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(54, 85);
        ctx.quadraticCurveTo(65, 89, 75, 83);
        ctx.stroke();

        // 7. ОСТРЫЙ СТАЛЬНОЙ КИНЖАЛ НА ПЕРЕДНЕМ ПЛАНЕ
        ctx.save();
        ctx.translate(28, 106);
        ctx.rotate((Math.PI / 180) * -28);

        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-4.5, 0);
        ctx.lineTo(-3.5, -28);
        ctx.lineTo(0, -38);
        ctx.lineTo(3.5, -28);
        ctx.lineTo(4.5, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(0, -38);
        ctx.lineTo(3.5, -28);
        ctx.lineTo(4.5, 0);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#334155';
        ctx.fillRect(-0.8, -24, 1.6, 20);

        ctx.fillStyle = '#b8860b';
        ctx.strokeStyle = '#4a3219';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(-10, -2, 20, 4, 1.5);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#1e1611';
        ctx.fillRect(-2.5, 2, 5, 13);

        ctx.fillStyle = '#b8860b';
        ctx.beginPath();
        ctx.arc(0, 17, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 8. ЭФФЕКТ FLAT-ОБЪЕМА
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



};


