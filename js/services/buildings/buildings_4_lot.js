/**
 * ГЕНЕРАТОРЫ ПОСТРОЕК НА 4 КЛЕТКИ (2x2)
 */
export const Buildings4Lot = {
    university(ctx, w, h) {
        // 1. Фон травянистого кампуса и мощёные булыжником аллеи
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#b2ba7a');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Главная центральная аллея и боковые тропинки к нижним корпусам
        ctx.fillStyle = 'rgba(130, 128, 118, 0.74)';
        for (let y = h * 0.24; y < h - 2; y += 4.6) {
            for (let dx = -12; dx <= 10; dx += 5) {
                const shift = (Math.floor(y / 4.6) % 2) * 2;
                ctx.beginPath();
                ctx.roundRect(w * 0.50 + dx + shift, y, 4.0, 3.4, 1);
                ctx.fill();
            }
        }

        const scatterWalk = (x1, y1, x2, y2, steps) => {
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const px = w * (x1 + (x2 - x1) * t);
                const py = h * (y1 + (y2 - y1) * t);
                ctx.beginPath();
                ctx.roundRect(px - 4 + (i % 2) * 2, py - 2, 3.8, 3.2, 1);
                ctx.roundRect(px + 2 - (i % 2) * 2, py + 2.5, 3.6, 3.0, 1);
                ctx.fill();
            }
        };

        scatterWalk(0.45, 0.50, 0.16, 0.65, 11);
        scatterWalk(0.55, 0.50, 0.80, 0.72, 11);

        // 2. Садовые кусты во внутренних двориках и вдоль аллей
        const drawBush = (bx, by, r) => {
            ctx.fillStyle = 'rgba(15, 22, 10, 0.44)';
            ctx.beginPath();
            ctx.arc(w * bx + 1.5, h * by + 2, r, 0, Math.PI * 2);
            ctx.fill();

            const bGrad = ctx.createRadialGradient(w * bx - 2, h * by - 2, 1, w * bx, h * by, r);
            bGrad.addColorStop(0, '#526b29');
            bGrad.addColorStop(0.7, '#344719');
            bGrad.addColorStop(1, '#1d290d');
            ctx.fillStyle = bGrad;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, r, 0, Math.PI * 2);
            ctx.fill();
        };

        const bushes = [
            // Дворики северного корпуса
            [0.27, 0.21, 7], [0.31, 0.25, 8], [0.35, 0.29, 6.5],
            [0.66, 0.28, 7], [0.71, 0.23, 8], [0.73, 0.29, 6],
            // Аллея вокруг центрального фонтана
            [0.14, 0.48, 5], [0.22, 0.48, 5], [0.29, 0.48, 5.5], [0.37, 0.47, 5],
            [0.15, 0.58, 5.5], [0.38, 0.54, 4.5], [0.40, 0.64, 5],
            [0.57, 0.41, 4.5], [0.60, 0.48, 5], [0.72, 0.50, 5], [0.80, 0.49, 5],
            [0.59, 0.59, 5], [0.64, 0.66, 5.5], [0.64, 0.76, 5]
        ];
        bushes.forEach(([x, y, r]) => drawBush(x, y, r));

        // 3. Круглый каменный фонтан в центре сквера и каменные тумбы
        const fx = w * 0.49;
        const fy = h * 0.49;
        ctx.fillStyle = 'rgba(18, 22, 14, 0.50)';
        ctx.beginPath();
        ctx.arc(fx + 1.5, fy + 2, 9.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#5c5850';
        ctx.strokeStyle = '#171614';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(fx, fy, 9.0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        const waterGrad = ctx.createRadialGradient(fx - 2, fy - 2, 1, fx, fy, 6.5);
        waterGrad.addColorStop(0, '#bae6fd');
        waterGrad.addColorStop(0.55, '#38bdf8');
        waterGrad.addColorStop(1, '#0284c7');
        ctx.fillStyle = waterGrad;
        ctx.beginPath();
        ctx.arc(fx, fy, 6.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#292524';
        ctx.beginPath();
        ctx.arc(fx, fy, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Каменные тумбы-фонари у входов
        [
            [0.41, 0.28], [0.57, 0.28], [0.31, 0.61], [0.77, 0.67]
        ].forEach(([px, py]) => {
            ctx.fillStyle = '#78736a';
            ctx.strokeStyle = '#171512';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(w * px, h * py, 3.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });

        // 4. ГЛАВНЫЙ СЕВЕРНЫЙ КОРПУС (Ш-образное здание в верхней половине участка)
        const nPts = [
            { x: w * 0.03, y: h * 0.04 },
            { x: w * 0.40, y: h * 0.04 },
            { x: w * 0.40, y: h * 0.025 },
            { x: w * 0.59, y: h * 0.025 },
            { x: w * 0.59, y: h * 0.04 },
            { x: w * 0.97, y: h * 0.04 },
            { x: w * 0.97, y: h * 0.44 },
            { x: w * 0.64, y: h * 0.44 },
            { x: w * 0.64, y: h * 0.34 },
            { x: w * 0.78, y: h * 0.34 },
            { x: w * 0.78, y: h * 0.145 },
            { x: w * 0.59, y: h * 0.145 },
            { x: w * 0.59, y: h * 0.24 },
            { x: w * 0.40, y: h * 0.24 },
            { x: w * 0.40, y: h * 0.145 },
            { x: w * 0.22, y: h * 0.145 },
            { x: w * 0.22, y: h * 0.34 },
            { x: w * 0.36, y: h * 0.34 },
            { x: w * 0.36, y: h * 0.44 },
            { x: w * 0.03, y: h * 0.44 }
        ];

        ctx.save();
        ctx.translate(2.5, 3.5);
        ctx.fillStyle = 'rgba(18, 14, 10, 0.55)';
        ctx.beginPath();
        nPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        nPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.clip();

        const lightSlope = '#bd6a36';
        const midSlope = '#944920';
        const darkSlope = '#5c2a10';

        ctx.fillStyle = midSlope;
        ctx.fillRect(0, 0, w, h * 0.46);

        // Внутренние затенённые скаты левого крыла и освещённые скаты правого
        ctx.fillStyle = darkSlope;
        ctx.fillRect(w * 0.125, h * 0.09, w * 0.275, h * 0.30);

        ctx.fillStyle = lightSlope;
        ctx.fillRect(w * 0.59, h * 0.09, w * 0.285, h * 0.30);

        // Внешние боковые скаты
        ctx.fillStyle = lightSlope;
        ctx.fillRect(w * 0.03, h * 0.04, w * 0.095, h * 0.40);
        ctx.fillStyle = darkSlope;
        ctx.fillRect(w * 0.875, h * 0.04, w * 0.095, h * 0.40);

        // Центральный портик
        ctx.fillStyle = lightSlope;
        ctx.fillRect(w * 0.40, h * 0.025, w * 0.095, h * 0.22);
        ctx.fillStyle = '#733716';
        ctx.fillRect(w * 0.495, h * 0.025, w * 0.095, h * 0.22);
        ctx.restore();

        ctx.strokeStyle = '#241206';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        nPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();

        // Коньковые балки северного корпуса и два двойных дымохода
        ctx.strokeStyle = '#2b1407';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(w * 0.36, h * 0.39);
        ctx.lineTo(w * 0.125, h * 0.39);
        ctx.lineTo(w * 0.125, h * 0.09);
        ctx.lineTo(w * 0.45, h * 0.09);

        ctx.moveTo(w * 0.64, h * 0.39);
        ctx.lineTo(w * 0.875, h * 0.39);
        ctx.lineTo(w * 0.875, h * 0.09);
        ctx.lineTo(w * 0.54, h * 0.09);

        ctx.moveTo(w * 0.495, h * 0.025);
        ctx.lineTo(w * 0.495, h * 0.24);

        ctx.moveTo(w * 0.03, h * 0.04);
        ctx.lineTo(w * 0.125, h * 0.09);
        ctx.moveTo(w * 0.03, h * 0.44);
        ctx.lineTo(w * 0.125, h * 0.39);
        ctx.moveTo(w * 0.97, h * 0.04);
        ctx.lineTo(w * 0.875, h * 0.09);
        ctx.moveTo(w * 0.97, h * 0.44);
        ctx.lineTo(w * 0.875, h * 0.39);
        ctx.stroke();

        [0.125, 0.875].forEach(cx => {
            ctx.fillStyle = '#9ca3af';
            ctx.strokeStyle = '#1f2937';
            ctx.lineWidth = 1.2;
            ctx.fillRect(w * cx - 3.5, h * 0.21, 7, 10);
            ctx.strokeRect(w * cx - 3.5, h * 0.21, 7, 10);
        });

        // 5. ЛЕВЫЙ НИЖНИЙ КОРПУС (П-образное здание с серой сланцевой крышей)
        const swPts = [
            { x: w * 0.05, y: h * 0.65 },
            { x: w * 0.16, y: h * 0.65 },
            { x: w * 0.16, y: h * 0.72 },
            { x: w * 0.33, y: h * 0.72 },
            { x: w * 0.33, y: h * 0.65 },
            { x: w * 0.44, y: h * 0.65 },
            { x: w * 0.44, y: h * 0.92 },
            { x: w * 0.05, y: h * 0.92 }
        ];

        ctx.save();
        ctx.translate(2, 3);
        ctx.fillStyle = 'rgba(16, 16, 18, 0.55)';
        ctx.beginPath();
        swPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        swPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        const swGrad = ctx.createLinearGradient(0, h * 0.65, 0, h * 0.92);
        swGrad.addColorStop(0, '#5e5a57');
        swGrad.addColorStop(0.5, '#787370');
        swGrad.addColorStop(1, '#948f8b');
        ctx.fillStyle = swGrad;
        ctx.fill();
        ctx.clip();

        ctx.strokeStyle = 'rgba(22, 20, 20, 0.38)';
        ctx.lineWidth = 0.9;
        for (let y = h * 0.67; y < h * 0.91; y += 4.2) {
            const shift = (Math.floor(y / 4.2) % 2) * 2.2;
            for (let x = w * 0.06; x < w * 0.43; x += 4.6) {
                ctx.strokeRect(x + shift, y, 4.2, 3.6);
            }
        }
        ctx.restore();

        ctx.strokeStyle = '#171514';
        ctx.lineWidth = 1.9;
        ctx.beginPath();
        swPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();

        // Скошенный конёк и двойной дымоход левого нижнего корпуса
        ctx.strokeStyle = '#242120';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(w * 0.105, h * 0.65);
        ctx.lineTo(w * 0.105, h * 0.78);
        ctx.lineTo(w * 0.14, h * 0.82);
        ctx.lineTo(w * 0.35, h * 0.82);
        ctx.lineTo(w * 0.385, h * 0.78);
        ctx.lineTo(w * 0.385, h * 0.65);
        ctx.moveTo(w * 0.05, h * 0.92);
        ctx.lineTo(w * 0.14, h * 0.82);
        ctx.moveTo(w * 0.44, h * 0.92);
        ctx.lineTo(w * 0.35, h * 0.82);
        ctx.stroke();
        ctx.fillStyle = '#5c5854';
        ctx.strokeStyle = '#141210';
        ctx.lineWidth = 1.3;
        ctx.fillRect(w * 0.21, h * 0.84, 11, 6);
        ctx.strokeRect(w * 0.21, h * 0.84, 11, 6);
// 6. ПРАВЫЙ НИЖНИЙ КОРПУС (Г-образное здание с тёмно-медной крышей)
        const sePts = [
            { x: w * 0.82, y: h * 0.63 },
            { x: w * 0.95, y: h * 0.63 },
            { x: w * 0.95, y: h * 0.92 },
            { x: w * 0.61, y: h * 0.92 },
            { x: w * 0.61, y: h * 0.80 },
            { x: w * 0.82, y: h * 0.80 }
        ];
        ctx.save();
        ctx.translate(2, 3);
        ctx.fillStyle = 'rgba(18, 14, 10, 0.55)';
        ctx.beginPath();
        sePts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        ctx.save();
        ctx.beginPath();
        sePts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fillStyle = '#854c24';
        ctx.fill();
        ctx.clip();
        ctx.fillStyle = '#522c12';
        ctx.fillRect(w * 0.885, h * 0.63, w * 0.07, h * 0.29);
        ctx.fillRect(w * 0.61, h * 0.86, w * 0.34, h * 0.06);
        ctx.restore();
        ctx.strokeStyle = '#221308';
        ctx.lineWidth = 1.9;
        ctx.beginPath();
        sePts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();
// Конёк Г-образного корпуса и дымоход
        ctx.strokeStyle = '#29170a';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(w * 0.885, h * 0.63);
        ctx.lineTo(w * 0.885, h * 0.86);
        ctx.lineTo(w * 0.61, h * 0.86);
        ctx.moveTo(w * 0.95, h * 0.92);
        ctx.lineTo(w * 0.885, h * 0.86);
        ctx.stroke();
        ctx.fillStyle = '#47433e';
        ctx.strokeStyle = '#141210';
        ctx.lineWidth = 1.3;
        ctx.fillRect(w * 0.835, h * 0.69, 6, 6);
        ctx.strokeRect(w * 0.835, h * 0.69, 6, 6);
    },

        construction_yard(ctx, w, h) {
        // 1. Фон вытоптанной строительной площадки
        const bgGrad = ctx.createRadialGradient(w * 0.42, h * 0.48, w * 0.12, w * 0.5, h * 0.5, w * 0.72);
        bgGrad.addColorStop(0, '#cfc89b');
        bgGrad.addColorStop(0.55, '#a4ac6e');
        bgGrad.addColorStop(1, '#848d4f');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // 2. Деревянный забор по периметру с опорными столбами и воротами слева
        const fL = w * 0.05;
        const fR = w * 0.94;
        const fT = h * 0.05;
        const fB = h * 0.91;

        ctx.strokeStyle = '#22160c';
        ctx.lineWidth = 3.4;
        ctx.beginPath();
        ctx.moveTo(fL, h * 0.43);
        ctx.lineTo(fL, fT);
        ctx.lineTo(fR, fT);
        ctx.lineTo(fR, fB);
        ctx.lineTo(fL, fB);
        ctx.lineTo(fL, h * 0.55);
        ctx.stroke();

        ctx.strokeStyle = '#755330';
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Опорные столбики забора по периметру
        for (let x = fL; x <= fR; x += w * 0.11) {
            [fT, fB].forEach(y => {
                ctx.fillStyle = '#5c3f22';
                ctx.strokeStyle = '#1a1108';
                ctx.lineWidth = 1.0;
                ctx.fillRect(x - 2, y - 2, 4, 4);
                ctx.strokeRect(x - 2, y - 2, 4, 4);
            });
        }
        for (let y = fT; y <= fB; y += h * 0.11) {
            if (y > h * 0.43 && y < h * 0.55) continue;
            [fL, fR].forEach(x => {
                ctx.fillStyle = '#5c3f22';
                ctx.strokeStyle = '#1a1108';
                ctx.lineWidth = 1.0;
                ctx.fillRect(x - 2, y - 2, 4, 4);
                ctx.strokeRect(x - 2, y - 2, 4, 4);
            });
        }

        // 3. ПОСТРОЙКА 1: Левая верхняя Г-образная сторожка
        const lPts = [
            { x: w * 0.09, y: h * 0.09 },
            { x: w * 0.24, y: h * 0.09 },
            { x: w * 0.24, y: h * 0.15 },
            { x: w * 0.15, y: h * 0.15 },
            { x: w * 0.15, y: h * 0.21 },
            { x: w * 0.09, y: h * 0.21 }
        ];

        ctx.save();
        ctx.translate(2, 2.5);
        ctx.fillStyle = 'rgba(18, 15, 10, 0.50)';
        ctx.beginPath();
        lPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        lPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fillStyle = '#c4ab7e';
        ctx.fill();
        ctx.clip();

        ctx.fillStyle = '#7c5832';
        ctx.fillRect(w * 0.12, h * 0.12, w * 0.13, h * 0.10);
        ctx.restore();

        ctx.strokeStyle = '#22170a';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        lPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(w * 0.12, h * 0.21);
        ctx.lineTo(w * 0.12, h * 0.12);
        ctx.lineTo(w * 0.24, h * 0.12);
        ctx.moveTo(w * 0.09, h * 0.09);
        ctx.lineTo(w * 0.12, h * 0.12);
        ctx.stroke();

        // 4. ПОСТРОЙКА 2: Верхний центральный длинный навес-мастерская
        const s2 = { x: w * 0.36, y: h * 0.08, w: w * 0.24, h: h * 0.10 };
        ctx.fillStyle = 'rgba(18, 16, 14, 0.54)';
        ctx.fillRect(s2.x + 2, s2.y + 3, s2.w, s2.h);

        ctx.fillStyle = '#858078';
        ctx.fillRect(s2.x, s2.y, s2.w, s2.h * 0.45);
        ctx.fillStyle = '#47433e';
        ctx.fillRect(s2.x, s2.y + s2.h * 0.45, s2.w, s2.h * 0.55);

        ctx.strokeStyle = '#171512';
        ctx.lineWidth = 1.8;
        ctx.strokeRect(s2.x, s2.y, s2.w, s2.h);

        ctx.beginPath();
        ctx.moveTo(s2.x - 2, s2.y + s2.h * 0.45);
        ctx.lineTo(s2.x + s2.w + 2, s2.y + s2.h * 0.45);
        ctx.stroke();

        // 5. ПОСТРОЙКА 3: Правый верхний повёрнутый складской павильон
        ctx.save();
        ctx.translate(w * 0.82, h * 0.27);
        ctx.rotate(-0.46);

        ctx.fillStyle = 'rgba(18, 16, 14, 0.50)';
        ctx.fillRect(-10, -14, 22, 30);

        ctx.fillStyle = '#8f8a7d';
        ctx.strokeStyle = '#1c1915';
        ctx.lineWidth = 1.6;
        ctx.fillRect(-11, -15, 18, 28);
        ctx.strokeRect(-11, -15, 18, 28);

        ctx.fillStyle = '#736e63';
        ctx.fillRect(7, -6, 6, 16);
        ctx.strokeRect(7, -6, 6, 16);

        ctx.beginPath();
        ctx.moveTo(-2, -15);
        ctx.lineTo(-2, 13);
        ctx.stroke();
        ctx.restore();

        // 6. Тёсаные серые каменные блоки и стопки брусчатки по двору
        const drawStoneBlock = (bx, by, bw, bh) => {
            ctx.fillStyle = 'rgba(16, 18, 20, 0.48)';
            ctx.fillRect(w * bx + 1.5, h * by + 2, bw, bh);

            ctx.fillStyle = '#7c828a';
            ctx.strokeStyle = '#17191c';
            ctx.lineWidth = 1.1;
            ctx.fillRect(w * bx, h * by, bw, bh);
            ctx.strokeRect(w * bx, h * by, bw, bh);
        };

        const stoneBlocks = [
            // Верхние группы блоков
            [0.52, 0.21, 6, 7], [0.59, 0.21, 5, 6], [0.64, 0.22, 5, 5],
            [0.68, 0.20, 7, 6], [0.68, 0.26, 6, 6], [0.73, 0.22, 5, 6],
            [0.79, 0.08, 7, 6], [0.85, 0.11, 5, 5],
            // Нижние группы блоков
            [0.29, 0.67, 6, 6], [0.34, 0.65, 6, 7], [0.37, 0.72, 6, 5],
            [0.32, 0.79, 6, 7], [0.38, 0.79, 5, 7],
            [0.75, 0.78, 6, 6], [0.80, 0.76, 6, 7], [0.85, 0.79, 6, 5],
            [0.79, 0.84, 7, 5], [0.86, 0.84, 5, 6]
        ];
        stoneBlocks.forEach(b => drawStoneBlock(...b));

        // Две стопки тёмной брусчатки у левого края под воротами
        const drawCobbleStack = (sx, sy) => {
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 4; c++) {
                    const x = w * sx + c * 4.5 + (r % 2) * 1.5;
                    const y = h * sy + r * 3.8;
                    ctx.fillStyle = ((r + c) % 2 === 0) ? '#5c6169' : '#32353b';
                    ctx.strokeStyle = '#121417';
                    ctx.lineWidth = 0.9;
                    ctx.fillRect(x, y, 4.0, 3.4);
                    ctx.strokeRect(x, y, 4.0, 3.4);
                }
            }
        };

        drawCobbleStack(0.10, 0.48);
        drawCobbleStack(0.10, 0.64);

        // 7. Штабель длинных тёсаных досок и балок в нижней центральной части
        const planks = [
            [0.50, 0.56, 36, 3.5], [0.49, 0.60, 42, 3.5], [0.48, 0.64, 48, 3.8],
            [0.50, 0.685, 44, 3.8], [0.47, 0.73, 46, 3.5], [0.51, 0.77, 45, 3.8]
        ];
        planks.forEach(([px, py, pw, ph]) => {
            ctx.fillStyle = 'rgba(18, 14, 10, 0.42)';
            ctx.fillRect(w * px + 1.5, h * py + 1.8, pw, ph);

            ctx.fillStyle = '#a37b4f';
            ctx.strokeStyle = '#24170a';
            ctx.lineWidth = 1.0;
            ctx.fillRect(w * px, h * py, pw, ph);
            ctx.strokeRect(w * px, h * py, pw, ph);
        });

        // Деревянные ящики и связка брёвен рядом с краном
        const crates = [
            [0.52, 0.39, 9, 6, '#855830'],
            [0.52, 0.44, 9, 6, '#754a24'],
            [0.50, 0.48, 9, 8, '#8c5e34'],
            [0.57, 0.51, 10, 9, '#96663a']
        ];
        crates.forEach(([cx, cy, cw, ch, col]) => {
            ctx.fillStyle = col;
            ctx.strokeStyle = '#1f140a';
            ctx.lineWidth = 1.2;
            ctx.fillRect(w * cx, h * cy, cw, ch);
            ctx.strokeRect(w * cx, h * cy, cw, ch);
        });

        // Связка брёвен правее крана
        ctx.strokeStyle = '#24180c';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(w * 0.60, h * 0.46);
        ctx.lineTo(w * 0.71, h * 0.42);
        ctx.moveTo(w * 0.60, h * 0.48);
        ctx.lineTo(w * 0.72, h * 0.48);
        ctx.stroke();

        // 8. Поворотный деревянный строительный кран в центре площадки
        const kX = w * 0.37;
        const kY = h * 0.42;

        // Тень от стрелы и опоры крана
        ctx.strokeStyle = 'rgba(18, 15, 10, 0.46)';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.moveTo(kX - 10, kY + 4);
        ctx.lineTo(kX + 14, kY + 4);
        ctx.moveTo(kX + 2, kY - 10);
        ctx.lineTo(kX + 2, kY + 14);
        ctx.moveTo(kX + 2, kY + 4);
        ctx.lineTo(w * 0.57, h * 0.29);
        ctx.stroke();

        // Крестообразная деревянная станина крана
        ctx.strokeStyle = '#1f140a';
        ctx.lineWidth = 4.2;
        ctx.beginPath();
        ctx.moveTo(kX - 12, kY);
        ctx.lineTo(kX + 12, kY);
        ctx.moveTo(kX, kY - 12);
        ctx.lineTo(kX, kY + 12);
        ctx.stroke();

        ctx.strokeStyle = '#8c6238';
        ctx.lineWidth = 2.0;
        ctx.stroke();

        // Диагональная подъёмная стрела крана с перекладинами
        ctx.strokeStyle = '#1f140a';
        ctx.lineWidth = 5.2;
        ctx.beginPath();
        ctx.moveTo(kX, kY);
        ctx.lineTo(w * 0.56, h * 0.26);
        ctx.stroke();

        ctx.strokeStyle = '#9c6e44';
        ctx.lineWidth = 2.6;
        ctx.stroke();

        // Центральный поворотный узел крана
        ctx.fillStyle = '#5c4328';
        ctx.strokeStyle = '#17120c';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(kX, kY, 3.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 9. Деревянная телега с брёвнами и бочки в левом нижнем углу
        ctx.save();
        ctx.translate(w * 0.21, h * 0.77);
        ctx.rotate(-0.62);

        ctx.fillStyle = 'rgba(18, 15, 10, 0.48)';
        ctx.fillRect(-10, -6, 22, 14);

        ctx.strokeStyle = '#3b2818';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(-10, -4.5);
        ctx.lineTo(-18, -4.5);
        ctx.moveTo(-10, 4.5);
        ctx.lineTo(-18, 4.5);
        ctx.stroke();
        ctx.fillStyle = '#7c5334';
        ctx.strokeStyle = '#1f140a';
        ctx.lineWidth = 1.5;
        ctx.fillRect(-10, -6.5, 20, 13);
        ctx.strokeRect(-10, -6.5, 20, 13);
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(10, 0);
        ctx.stroke();
        ctx.restore();
// Бочки по углам двора
        [
            [0.34, 0.16, '#6e6a62'], [0.68, 0.10, '#7c5334'], [0.71, 0.13, '#1d4ed8'],
            [0.27, 0.85, '#6e3424'], [0.30, 0.84, '#6e3424'], [0.30, 0.88, '#6e3424']
        ].forEach(([bx, by, col]) => {
            ctx.fillStyle = col;
            ctx.strokeStyle = '#141210';
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, 3.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });
    },

        waterfront_side(ctx, w, h) {
        // 1. Травянистая суша слева + песчаный берег и бирюзовая вода справа
        const landGrad = ctx.createLinearGradient(0, 0, w * 0.68, h);
        landGrad.addColorStop(0, '#969e60');
        landGrad.addColorStop(0.5, '#a8b070');
        landGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = landGrad;
        ctx.fillRect(0, 0, w * 0.70, h);

        ctx.fillStyle = '#dcd7b4';
        ctx.fillRect(w * 0.65, 0, w * 0.08, h);

        const waterGrad = ctx.createLinearGradient(w * 0.68, 0, w, h);
        waterGrad.addColorStop(0, '#a5f3fc');
        waterGrad.addColorStop(0.28, '#22b8cf');
        waterGrad.addColorStop(1, '#0e7490');
        ctx.fillStyle = waterGrad;
        ctx.fillRect(w * 0.68, 0, w * 0.32, h);

        // 2. Извилистая мощёная булыжником портовая улочка между зданиями
        ctx.fillStyle = 'rgba(130, 128, 118, 0.72)';
        const scatterPath = (pts) => {
            for (let s = 0; s < pts.length - 1; s++) {
                const [x1, y1] = pts[s];
                const [x2, y2] = pts[s + 1];
                const steps = 8;
                for (let i = 0; i <= steps; i++) {
                    const t = i / steps;
                    const px = w * (x1 + (x2 - x1) * t);
                    const py = h * (y1 + (y2 - y1) * t);
                    ctx.beginPath();
                    ctx.roundRect(px - 3.5 + (i % 2) * 1.5, py - 2, 3.6, 3.0, 1);
                    ctx.roundRect(px + 2 - (i % 2) * 1.5, py + 2, 3.4, 2.8, 1);
                    ctx.fill();
                }
            }
        };

        scatterPath([
            [0.39, 0.14], [0.36, 0.32], [0.38, 0.48], [0.32, 0.68], [0.30, 0.88]
        ]);
        scatterPath([
            [0.45, 0.85], [0.62, 0.85]
        ]);

        // 3. Суда на воде справа от набережной (малая шлюпка и парусная шхуна)
        ctx.save();
        ctx.translate(w * 0.75, h * 0.37);
        ctx.rotate(0.75);
        ctx.fillStyle = 'rgba(10, 25, 30, 0.42)';
        ctx.beginPath();
        ctx.ellipse(1.5, 2, 11, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#6b4c2e';
        ctx.strokeStyle = '#1f160d';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.ellipse(0, 0, 10.5, 4.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Крупная парусная шхуна ниже по течению
        ctx.save();
        ctx.translate(w * 0.78, h * 0.60);
        ctx.rotate(-0.42);

        ctx.fillStyle = 'rgba(10, 25, 30, 0.45)';
        ctx.beginPath();
        ctx.ellipse(2, 3, 12, 27, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#1f160d';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(0, -24);
        ctx.lineTo(0, -34);
        ctx.moveTo(-7, -29);
        ctx.lineTo(7, -29);
        ctx.stroke();

        ctx.fillStyle = '#7c5834';
        ctx.strokeStyle = '#1f160d';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(0, -27);
        ctx.quadraticCurveTo(11, -6, 8, 24);
        ctx.lineTo(-8, 24);
        ctx.quadraticCurveTo(-11, -6, 0, -27);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#a37b4f';
        ctx.fillRect(-4, -12, 8, 28);

        ctx.fillStyle = '#f3f4f6';
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(0, -4, 16, 3.0, -0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 4. Прямой деревянный пирс вдоль всей береговой линии со сваями
        const pierX = w * 0.645;
        const pierW = w * 0.06;

        ctx.fillStyle = 'rgba(12, 22, 26, 0.45)';
        ctx.fillRect(pierX + 1.5, 0, pierW, h);

        ctx.fillStyle = '#5c5346';
        ctx.strokeStyle = '#1a1612';
        ctx.lineWidth = 1.6;
        ctx.fillRect(pierX, 0, pierW, h);
        ctx.strokeRect(pierX, 0, pierW, h);

        ctx.strokeStyle = '#29231c';
        ctx.lineWidth = 1.1;
        for (let py = 4; py < h - 2; py += 5) {
            ctx.beginPath();
            ctx.moveTo(pierX, py);
            ctx.lineTo(pierX + pierW, py);
            ctx.stroke();
        }

        for (let sy = 0.04; sy <= 0.96; sy += 0.075) {
            [0.645, 0.705].forEach((sx, idx) => {
                ctx.fillStyle = '#787166';
                ctx.strokeStyle = '#141210';
                ctx.lineWidth = 1.1;
                ctx.beginPath();
                ctx.arc(w * sx, h * (sy + idx * 0.02), 2.2, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            });
        }

        // 5. Портовый реквизит: бочки и ящики по центру и у стен
        const drawBarrel = (bx, by, r = 3.4) => {
            ctx.fillStyle = '#3b3730';
            ctx.strokeStyle = '#141210';
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        };

        ctx.fillStyle = '#855828';
        ctx.strokeStyle = '#1f140a';
        ctx.lineWidth = 1.2;
        ctx.fillRect(w * 0.41, h * 0.34, 9, 9);
        ctx.strokeRect(w * 0.41, h * 0.34, 9, 9);

        ctx.fillStyle = '#6b6458';
        ctx.fillRect(w * 0.51, h * 0.33, 6, 6);
        ctx.strokeRect(w * 0.51, h * 0.33, 6, 6);

        [
            [0.29, 0.43], [0.33, 0.44], [0.33, 0.57], [0.39, 0.65],
            [0.46, 0.37], [0.55, 0.36], [0.59, 0.37], [0.62, 0.34], [0.61, 0.42]
        ].forEach(([bx, by]) => drawBarrel(bx, by, 3.2));

        // 6. ЗДАНИЕ 1 (Слева сверху — Т-образный дом с охристо-коричневой крышей)
        const tPts = [
            { x: w * 0.11, y: h * 0.06 },
            { x: w * 0.28, y: h * 0.06 },
            { x: w * 0.28, y: h * 0.09 },
            { x: w * 0.35, y: h * 0.09 },
            { x: w * 0.35, y: h * 0.21 },
            { x: w * 0.28, y: h * 0.21 },
            { x: w * 0.28, y: h * 0.32 },
            { x: w * 0.11, y: h * 0.32 },
            { x: w * 0.11, y: h * 0.21 },
            { x: w * 0.05, y: h * 0.21 },
            { x: w * 0.05, y: h * 0.09 },
            { x: w * 0.11, y: h * 0.09 }
        ];

        ctx.save();
        ctx.translate(2, 3);
        ctx.fillStyle = 'rgba(18, 15, 10, 0.50)';
        ctx.beginPath();
        tPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        tPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fillStyle = '#a3824c';
        ctx.fill();
        ctx.clip();

        ctx.fillStyle = '#6e5228';
        ctx.fillRect(w * 0.195, h * 0.06, w * 0.16, h * 0.27);
        ctx.fillStyle = '#4f391a';
        ctx.fillRect(w * 0.05, h * 0.15, w * 0.30, h * 0.07);
        ctx.restore();

        ctx.strokeStyle = '#22170a';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        tPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();

        // Коньки и дымоход Т-образного дома
        const tCx = w * 0.195;
        const tCy = h * 0.15;
        ctx.beginPath();
        ctx.moveTo(tCx, h * 0.05);
        ctx.lineTo(tCx, h * 0.33);
        ctx.moveTo(w * 0.05, tCy);
        ctx.lineTo(w * 0.35, tCy);
        ctx.moveTo(w * 0.11, h * 0.09);
        ctx.lineTo(tCx, tCy);
        ctx.moveTo(w * 0.28, h * 0.09);
        ctx.lineTo(tCx, tCy);
        ctx.moveTo(w * 0.11, h * 0.21);
        ctx.lineTo(tCx, tCy);
        ctx.moveTo(w * 0.28, h * 0.21);
        ctx.lineTo(tCx, tCy);
        ctx.stroke();

        ctx.fillStyle = '#78736a';
        ctx.fillRect(w * 0.07, h * 0.135, 8, 5);
        ctx.strokeRect(w * 0.07, h * 0.135, 8, 5);

        // 7. ЗДАНИЕ 2 (Справа сверху — прямоугольный склад с фронтоном справа)
        const b2 = { x: w * 0.42, y: h * 0.05, w: w * 0.17, h: h * 0.26 };
        ctx.fillStyle = 'rgba(18, 15, 10, 0.50)';
        ctx.fillRect(b2.x + 2, b2.y + 3, b2.w, b2.h);

        ctx.fillStyle = '#b5996e';
        ctx.fillRect(b2.x, b2.y, b2.w * 0.50, b2.h);
        ctx.fillStyle = '#856a44';
        ctx.fillRect(b2.x + b2.w * 0.50, b2.y, b2.w * 0.50, b2.h);

        ctx.strokeStyle = '#22170a';
        ctx.lineWidth = 1.8;
        ctx.strokeRect(b2.x, b2.y, b2.w, b2.h);

        const b2RidgeX = b2.x + b2.w * 0.50;
        ctx.beginPath();
        ctx.moveTo(b2RidgeX, b2.y - 2);
        ctx.lineTo(b2RidgeX, b2.y + b2.h + 2);
        ctx.stroke();

        // Треугольный фронтон справа у верхнего правого склада
        const b2MidY = b2.y + b2.h * 0.48;
        ctx.fillStyle = '#9c8056';
        ctx.beginPath();
        ctx.moveTo(b2RidgeX, b2MidY);
        ctx.lineTo(b2.x + b2.w + 6, b2MidY - 10);
        ctx.lineTo(b2.x + b2.w + 6, b2MidY + 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(b2RidgeX, b2MidY);
        ctx.lineTo(b2.x + b2.w + 6, b2MidY);
        ctx.stroke();

        // 8. ЗДАНИЕ 3 (Слева снизу — красный склад с треугольным фронтоном и трубой)
        const b3 = { x: w * 0.04, y: h * 0.41, w: w * 0.22, h: h * 0.25 };
        ctx.fillStyle = 'rgba(18, 14, 10, 0.52)';
        ctx.fillRect(b3.x + 2.5, b3.y + 3.5, b3.w, b3.h);

        const g3 = ctx.createLinearGradient(b3.x, b3.y, b3.x + b3.w, b3.y + b3.h);
        g3.addColorStop(0, '#8c3b14');
        g3.addColorStop(0.5, '#b5541e');
        g3.addColorStop(1, '#6e2b0c');
        ctx.fillStyle = g3;
        ctx.strokeStyle = '#221006';
        ctx.lineWidth = 1.9;
        ctx.fillRect(b3.x, b3.y, b3.w, b3.h);
        ctx.strokeRect(b3.x, b3.y, b3.w, b3.h);

        const b3RidgeX = b3.x + b3.w * 0.50;
        ctx.beginPath();
        ctx.moveTo(b3RidgeX, b3.y);
        ctx.lineTo(b3RidgeX, b3.y + b3.h);
        ctx.stroke();
        ctx.fillStyle = '#5c5852';
        ctx.strokeStyle = '#171512';
        ctx.lineWidth = 1.3;
        ctx.fillRect(b3RidgeX - 3.5, b3.y - 1, 7, 10);
        ctx.strokeRect(b3RidgeX - 3.5, b3.y - 1, 7, 10);
        const b3MidY = b3.y + b3.h * 0.50;
        ctx.fillStyle = '#9c4618';
        ctx.strokeStyle = '#221006';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(b3RidgeX, b3MidY);
        ctx.lineTo(b3.x + b3.w + 8, b3MidY - 10);
        ctx.lineTo(b3.x + b3.w + 8, b3MidY + 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(b3RidgeX, b3MidY);
        ctx.lineTo(b3.x + b3.w + 8, b3MidY);
        ctx.stroke();
// 9. ЗДАНИЕ 4 (В центре — амбар с соломенной крышей)
        const b4 = { x: w * 0.43, y: h * 0.44, w: w * 0.16, h: h * 0.21 };
        ctx.fillStyle = 'rgba(18, 15, 10, 0.50)';
        ctx.fillRect(b4.x + 2, b4.y + 3, b4.w, b4.h);
        ctx.fillStyle = '#b59258';
        ctx.fillRect(b4.x, b4.y, b4.w * 0.50, b4.h);
        ctx.fillStyle = '#856434';
        ctx.fillRect(b4.x + b4.w * 0.50, b4.y, b4.w * 0.50, b4.h);
        ctx.strokeStyle = 'rgba(38, 24, 10, 0.42)';
        ctx.lineWidth = 1.0;
        for (let sy = b4.y + 4; sy < b4.y + b4.h - 2; sy += 4.5) {
            for (let sx = b4.x + 2; sx < b4.x + b4.w - 3; sx += 4.5) {
                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.lineTo(sx + 2.5, sy);
                ctx.stroke();
            }
        }
        ctx.strokeStyle = '#22170a';
        ctx.lineWidth = 1.8;
        ctx.strokeRect(b4.x, b4.y, b4.w, b4.h);
        ctx.beginPath();
        ctx.moveTo(b4.x + b4.w * 0.50, b4.y - 2);
        ctx.lineTo(b4.x + b4.w * 0.50, b4.y + b4.h + 2);
        ctx.stroke();
// 10. ЗДАНИЕ 5 (Снизу — Г-образная портовая лавка с круглой трубой)
        const lPts = [
            { x: w * 0.33, y: h * 0.69 },
            { x: w * 0.60, y: h * 0.69 },
            { x: w * 0.60, y: h * 0.81 },
            { x: w * 0.44, y: h * 0.81 },
            { x: w * 0.44, y: h * 0.90 },
            { x: w * 0.33, y: h * 0.90 }
        ];
        ctx.save();
        ctx.translate(2, 2.5);
        ctx.fillStyle = 'rgba(18, 15, 10, 0.50)';
        ctx.beginPath();
        lPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        ctx.save();
        ctx.beginPath();
        lPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fillStyle = '#c4b08a';
        ctx.fill();
        ctx.clip();
        ctx.fillStyle = '#6e4e26';
        ctx.fillRect(w * 0.385, h * 0.75, w * 0.22, h * 0.16);
        ctx.restore();
        ctx.strokeStyle = '#22180c';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        lPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();
// Конёк Г-образной лавки и круглая труба слева
        ctx.beginPath();
        ctx.moveTo(w * 0.385, h * 0.90);
        ctx.lineTo(w * 0.385, h * 0.75);
        ctx.lineTo(w * 0.60, h * 0.75);
        ctx.moveTo(w * 0.33, h * 0.69);
        ctx.lineTo(w * 0.385, h * 0.75);
        ctx.stroke();
        ctx.fillStyle = '#6e6a62';
        ctx.beginPath();
        ctx.arc(w * 0.365, h * 0.78, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    },



        waterfront_corner(ctx, w, h) {
        // 1. Бирюзовая акватория сверху и справа + травянистая суша в нижнем левом углу
        const waterGrad = ctx.createLinearGradient(0, 0, w, h);
        waterGrad.addColorStop(0, '#0e7490');
        waterGrad.addColorStop(0.45, '#22b8cf');
        waterGrad.addColorStop(1, '#99e9f2');
        ctx.fillStyle = waterGrad;
        ctx.fillRect(0, 0, w, h);

        // Песчаная отмель вдоль берега и травянистый участок суши
        ctx.fillStyle = '#dcd7b4';
        ctx.fillRect(0, h * 0.33, w * 0.72, h * 0.67);

        const landGrad = ctx.createLinearGradient(0, h * 0.35, w * 0.68, h);
        landGrad.addColorStop(0, '#969e60');
        landGrad.addColorStop(0.5, '#a8b070');
        landGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = landGrad;
        ctx.fillRect(0, h * 0.35, w * 0.68, h * 0.65);

        // Светлые вытоптанные портовые дорожки на суше
        ctx.strokeStyle = 'rgba(220, 214, 180, 0.75)';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(w * 0.38, h * 0.38);
        ctx.quadraticCurveTo(w * 0.39, h * 0.56, w * 0.32, h * 0.72);
        ctx.moveTo(w * 0.14, h * 0.85);
        ctx.lineTo(w * 0.04, h * 0.90);
        ctx.stroke();

        // 2. Суда на воде: парусная шхуна у северного причала и шлюпка у восточного
        ctx.save();
        ctx.translate(w * 0.48, h * 0.19);
        ctx.rotate(-0.42);

        ctx.fillStyle = 'rgba(10, 25, 30, 0.45)';
        ctx.beginPath();
        ctx.ellipse(2, 3, 12, 27, 0, 0, Math.PI * 2);
        ctx.fill();

        // Бушприт и рея на носу корабля
        ctx.strokeStyle = '#1f160d';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(0, -24);
        ctx.lineTo(0, -34);
        ctx.moveTo(-7, -29);
        ctx.lineTo(7, -29);
        ctx.stroke();

        // Корпус шхуны
        ctx.fillStyle = '#7c5834';
        ctx.strokeStyle = '#1f160d';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(0, -27);
        ctx.quadraticCurveTo(11, -6, 8, 24);
        ctx.lineTo(-8, 24);
        ctx.quadraticCurveTo(-11, -6, 0, -27);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Палуба и свёрнутый белый парус на рее
        ctx.fillStyle = '#a37b4f';
        ctx.fillRect(-4, -12, 8, 28);

        ctx.fillStyle = '#f3f4f6';
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(0, -4, 16, 3.0, -0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Малая деревянная шлюпка у восточного причала
        ctx.save();
        ctx.translate(w * 0.85, h * 0.45);
        ctx.rotate(0.75);
        ctx.fillStyle = 'rgba(10, 25, 30, 0.40)';
        ctx.beginPath();
        ctx.ellipse(1.5, 2, 11, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#6b4c2e';
        ctx.strokeStyle = '#1f160d';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.ellipse(0, 0, 10.5, 4.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 3. Г-образный деревянный пирс и два выступающих причала
        const drawDeck = (x, y, dw, dh, isVert) => {
            ctx.fillStyle = 'rgba(12, 22, 26, 0.45)';
            ctx.fillRect(x + 1.5, y + 2, dw, dh);

            ctx.fillStyle = '#5c5346';
            ctx.strokeStyle = '#1a1612';
            ctx.lineWidth = 1.6;
            ctx.fillRect(x, y, dw, dh);
            ctx.strokeRect(x, y, dw, dh);

            ctx.strokeStyle = '#29231c';
            ctx.lineWidth = 1.1;
            if (isVert) {
                for (let py = y + 4; py < y + dh - 2; py += 5) {
                    ctx.beginPath();
                    ctx.moveTo(x, py);
                    ctx.lineTo(x + dw, py);
                    ctx.stroke();
                }
            } else {
                for (let px = x + 4; px < x + dw - 2; px += 5) {
                    ctx.beginPath();
                    ctx.moveTo(px, y);
                    ctx.lineTo(px, y + dh);
                    ctx.stroke();
                }
            }
        };

        // Северный причал в воду и восточный причал в воду
        drawDeck(w * 0.36, h * 0.18, w * 0.055, h * 0.16, true);
        drawDeck(w * 0.70, h * 0.355, w * 0.17, h * 0.05, false);

        // Главная Г-образная набережная
        drawDeck(0, h * 0.325, w * 0.70, h * 0.06, false);
        drawDeck(w * 0.645, h * 0.325, w * 0.06, h * 0.675, true);

        // Опорные сваи по краям пирсов
        const drawPiling = (px, py) => {
            ctx.fillStyle = '#787166';
            ctx.strokeStyle = '#141210';
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.arc(w * px, h * py, 2.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        };

        [
            [0.36, 0.18], [0.415, 0.18], [0.36, 0.25], [0.415, 0.25],
            [0.78, 0.355], [0.87, 0.355], [0.78, 0.405], [0.87, 0.405]
        ].forEach(([x, y]) => drawPiling(x, y));

        for (let sx = 0.04; sx <= 0.68; sx += 0.08) {
            drawPiling(sx, 0.325);
            drawPiling(sx + 0.03, 0.385);
        }
        for (let sy = 0.42; sy <= 0.96; sy += 0.08) {
            drawPiling(0.645, sy);
            drawPiling(0.705, sy + 0.03);
        }

        // 4. Портовый реквизит: ящики и бочки вдоль набережной и у складов
        const drawBarrel = (bx, by, r = 3.5) => {
            ctx.fillStyle = '#3b3730';
            ctx.strokeStyle = '#141210';
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        };

        // Ящик у северного пирса и группы бочек
        ctx.fillStyle = '#855828';
        ctx.strokeStyle = '#1f140a';
        ctx.lineWidth = 1.3;
        ctx.fillRect(w * 0.40, h * 0.39, 10, 10);
        ctx.strokeRect(w * 0.40, h * 0.39, 10, 10);

        [
            [0.32, 0.45], [0.45, 0.42], [0.44, 0.45], [0.49, 0.43],
            [0.56, 0.43], [0.60, 0.44], [0.62, 0.41],
            [0.53, 0.75], [0.56, 0.78], [0.59, 0.78]
        ].forEach(([bx, by]) => drawBarrel(bx, by, 3.3));

        ctx.fillStyle = '#6b6458';
        ctx.fillRect(w * 0.51, h * 0.71, 6, 6);
        ctx.strokeRect(w * 0.51, h * 0.71, 6, 6);

        // 5. ЗДАНИЕ 1 (Слева — красный склад с треугольным фронтоном справа и трубой)
        const b1 = { x: w * 0.04, y: h * 0.46, w: w * 0.22, h: h * 0.27 };
        ctx.fillStyle = 'rgba(18, 14, 10, 0.52)';
        ctx.fillRect(b1.x + 2.5, b1.y + 3.5, b1.w, b1.h);

        const g1 = ctx.createLinearGradient(b1.x, b1.y, b1.x + b1.w, b1.y + b1.h);
        g1.addColorStop(0, '#8c3b14');
        g1.addColorStop(0.5, '#b5541e');
        g1.addColorStop(1, '#6e2b0c');
        ctx.fillStyle = g1;
        ctx.strokeStyle = '#221006';
        ctx.lineWidth = 1.9;
        ctx.fillRect(b1.x, b1.y, b1.w, b1.h);
        ctx.strokeRect(b1.x, b1.y, b1.w, b1.h);

        // Вертикальный конёк и каменный дымоход сверху
        const b1RidgeX = b1.x + b1.w * 0.50;
        ctx.beginPath();
        ctx.moveTo(b1RidgeX, b1.y);
        ctx.lineTo(b1RidgeX, b1.y + b1.h);
        ctx.stroke();

        ctx.fillStyle = '#5c5852';
        ctx.strokeStyle = '#171512';
        ctx.lineWidth = 1.3;
        ctx.fillRect(b1RidgeX - 3.5, b1.y - 1, 7, 10);
        ctx.strokeRect(b1RidgeX - 3.5, b1.y - 1, 7, 10);

        // Выступающий треугольный фронтон справа у красного склада
        const gMidY = b1.y + b1.h * 0.50;
        ctx.fillStyle = '#9c4618';
        ctx.strokeStyle = '#221006';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(b1RidgeX, gMidY);
        ctx.lineTo(b1.x + b1.w + 8, gMidY - 11);
        ctx.lineTo(b1.x + b1.w + 8, gMidY + 11);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(b1RidgeX, gMidY);
        ctx.lineTo(b1.x + b1.w + 8, gMidY);
        ctx.stroke();

        // 6. ЗДАНИЕ 2 (В центре — амбар с соломенной охристой крышей)
        const b2 = { x: w * 0.43, y: h * 0.49, w: w * 0.16, h: h * 0.21 };
        ctx.fillStyle = 'rgba(18, 15, 10, 0.50)';
        ctx.fillRect(b2.x + 2, b2.y + 3, b2.w, b2.h);

        ctx.fillStyle = '#b59258';
        ctx.fillRect(b2.x, b2.y, b2.w * 0.50, b2.h);
        ctx.fillStyle = '#856434';
        ctx.fillRect(b2.x + b2.w * 0.50, b2.y, b2.w * 0.50, b2.h);

        ctx.strokeStyle = 'rgba(38, 24, 10, 0.42)';
        ctx.lineWidth = 1.0;
        for (let sy = b2.y + 4; sy < b2.y + b2.h - 2; sy += 4.5) {
            for (let sx = b2.x + 2; sx < b2.x + b2.w - 3; sx += 4.5) {
                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.lineTo(sx + 2.5, sy);
                ctx.stroke();
            }
        }

        ctx.strokeStyle = '#22170a';
        ctx.lineWidth = 1.8;
        ctx.strokeRect(b2.x, b2.y, b2.w, b2.h);

        ctx.beginPath();
        ctx.moveTo(b2.x + b2.w * 0.50, b2.y - 2);
        ctx.lineTo(b2.x + b2.w * 0.50, b2.y + b2.h + 2);
        ctx.stroke();

        // 7. ЗДАНИЕ 3 (Снизу — широкая портовая контора с треугольным мезонином)
        const b3 = { x: w * 0.19, y: h * 0.80, w: w * 0.30, h: h * 0.18 };
        ctx.fillStyle = 'rgba(18, 15, 10, 0.50)';
        ctx.fillRect(b3.x + 2, b3.y + 2.5, b3.w, b3.h);

        ctx.fillStyle = '#b59b72';
        ctx.fillRect(b3.x, b3.y, b3.w, b3.h * 0.50);
        ctx.fillStyle = '#8c724c';
        ctx.fillRect(b3.x, b3.y + b3.h * 0.50, b3.w, b3.h * 0.50);

        ctx.strokeStyle = '#22180c';
        ctx.lineWidth = 1.8;
        ctx.strokeRect(b3.x, b3.y, b3.w, b3.h);

        const b3RidgeY = b3.y + b3.h * 0.50;
        ctx.beginPath();
        ctx.moveTo(b3.x, b3RidgeY);
        ctx.lineTo(b3.x + b3.w, b3RidgeY);
        ctx.stroke();
// Треугольный мезонин сверху по центру нижней конторы
        const mCx = b3.x + b3.w * 0.44;
        ctx.fillStyle = '#c4ab82';
        ctx.strokeStyle = '#22180c';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(mCx, b3RidgeY);
        ctx.lineTo(mCx - 13, b3.y - 5);
        ctx.lineTo(mCx + 13, b3.y - 5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mCx, b3RidgeY);
        ctx.lineTo(mCx, b3.y - 5);
        ctx.stroke();
    },



        stockyard(ctx, w, h) {
        // 1. Фон травянистого участка скотного двора
        const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, w * 0.1, w * 0.5, h * 0.5, w * 0.72);
        bgGrad.addColorStop(0, '#b5bd7d');
        bgGrad.addColorStop(0.55, '#9ea668');
        bgGrad.addColorStop(1, '#879052');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // 2. X-образные песчаные дорожки, соединяющие все 4 постройки через центр
        ctx.strokeStyle = '#dcd6b0';
        ctx.lineWidth = 9.0;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(w * 0.34, h * 0.27);
        ctx.quadraticCurveTo(w * 0.44, h * 0.42, w * 0.52, h * 0.52);
        ctx.quadraticCurveTo(w * 0.60, h * 0.66, w * 0.72, h * 0.68);

        ctx.moveTo(w * 0.63, h * 0.34);
        ctx.quadraticCurveTo(w * 0.55, h * 0.46, w * 0.48, h * 0.53);
        ctx.quadraticCurveTo(w * 0.38, h * 0.62, w * 0.26, h * 0.62);
        ctx.stroke();

        // Мелкие булыжники вдоль обочин тропинок и на перекрёстке
        ctx.fillStyle = 'rgba(82, 78, 68, 0.62)';
        const scatterCobbles = (x1, y1, x2, y2, steps) => {
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const px = w * (x1 + (x2 - x1) * t);
                const py = h * (y1 + (y2 - y1) * t);
                ctx.beginPath();
                ctx.roundRect(px - 4 + (i % 2), py - 3.5, 2.8, 2.2, 0.8);
                ctx.roundRect(px + 2.5 - (i % 2), py + 2.5, 2.8, 2.2, 0.8);
                ctx.fill();
            }
        };

        scatterCobbles(0.34, 0.27, 0.50, 0.50, 9);
        scatterCobbles(0.50, 0.50, 0.71, 0.68, 9);
        scatterCobbles(0.62, 0.34, 0.48, 0.52, 8);
        scatterCobbles(0.48, 0.52, 0.27, 0.62, 8);

        // Вспомогательные функции для бочек и ящиков
        const drawBarrel = (bx, by, r = 3.5) => {
            ctx.fillStyle = '#3b3730';
            ctx.strokeStyle = '#141210';
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        };

        const drawCrate = (cx, cy, cw, ch, color = '#6b5e4c') => {
            ctx.fillStyle = color;
            ctx.strokeStyle = '#171410';
            ctx.lineWidth = 1.1;
            ctx.fillRect(w * cx, h * cy, cw, ch);
            ctx.strokeRect(w * cx, h * cy, cw, ch);
        };

        // 3. ПОСТРОЙКА 1: Левый верхний сарай (повёрнут против часовой стрелки)
        ctx.save();
        ctx.translate(w * 0.27, h * 0.21);
        ctx.rotate(-0.46);

        ctx.fillStyle = 'rgba(18, 16, 12, 0.48)';
        ctx.fillRect(-26, -11, 54, 24);

        // Основной серо-бежевый корпус сарая
        ctx.fillStyle = '#a39c88';
        ctx.strokeStyle = '#1f1c16';
        ctx.lineWidth = 1.6;
        ctx.fillRect(-28, -13, 38, 21);
        ctx.strokeRect(-28, -13, 38, 21);

        ctx.beginPath();
        ctx.moveTo(-28, -2);
        ctx.lineTo(10, -2);
        ctx.stroke();

        // Правая ступенчатая пристройка сарая
        ctx.fillStyle = '#7c7864';
        ctx.fillRect(10, -10, 16, 22);
        ctx.strokeRect(10, -10, 16, 22);

        ctx.beginPath();
        ctx.moveTo(10, 2);
        ctx.lineTo(26, 2);
        ctx.stroke();
        ctx.restore();

        // Три бочки у входа в левый верхний сарай
        drawBarrel(0.39, 0.25, 3.2);
        drawBarrel(0.41, 0.29, 3.2);
        drawBarrel(0.46, 0.27, 3.4);

        // 4. ПОСТРОЙКА 2: Правый верхний диагональный амбар с боковой пристройкой
        ctx.save();
        ctx.translate(w * 0.72, h * 0.27);
        ctx.rotate(0.84);

        ctx.fillStyle = 'rgba(18, 15, 12, 0.50)';
        ctx.fillRect(-26, -15, 52, 34);

        // Низкая пристройка сзади (справа на экране)
        ctx.fillStyle = '#6b6058';
        ctx.strokeStyle = '#1c1814';
        ctx.lineWidth = 1.5;
        ctx.fillRect(-16, -24, 34, 12);
        ctx.strokeRect(-16, -24, 34, 12);

        // Главный двускатный амбар
        ctx.fillStyle = '#6e6258';
        ctx.fillRect(-27, -14, 52, 14);
        ctx.fillStyle = '#9c9282';
        ctx.fillRect(-27, 0, 52, 16);

        // Штриховка соломы по краю крыши
        ctx.strokeStyle = 'rgba(30, 24, 18, 0.48)';
        ctx.lineWidth = 1.0;
        for (let sx = -24; sx <= 22; sx += 4.5) {
            ctx.beginPath();
            ctx.moveTo(sx, 11);
            ctx.lineTo(sx, 16);
            ctx.stroke();
        }

        ctx.strokeStyle = '#1c1814';
        ctx.lineWidth = 1.8;
        ctx.strokeRect(-27, -14, 52, 30);

        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(-27, 0);
        ctx.lineTo(25, 0);
        ctx.stroke();
        ctx.restore();

        drawBarrel(0.67, 0.37, 3.6);

        // 5. ПОСТРОЙКА 3: Левый нижний длинный хлев с дощатой крышей
        const b3 = { x: w * 0.08, y: h * 0.42, w: w * 0.19, h: h * 0.45 };
        ctx.fillStyle = 'rgba(18, 15, 12, 0.52)';
        ctx.fillRect(b3.x + 2.5, b3.y + 3.5, b3.w, b3.h);

        // Выступы у левой стены хлева
        drawCrate(0.065, 0.50, 4, 8, '#75726a');
        drawCrate(0.065, 0.72, 4, 9, '#75726a');

        // Двускатная крыша хлева (светлый левый скат, тёмный правый скат)
        ctx.fillStyle = '#857d70';
        ctx.fillRect(b3.x, b3.y, b3.w * 0.46, b3.h);
        ctx.fillStyle = '#474038';
        ctx.fillRect(b3.x + b3.w * 0.46, b3.y, b3.w * 0.54, b3.h);

        // Продольные линии досок на крыше
        ctx.strokeStyle = 'rgba(24, 20, 16, 0.42)';
        ctx.lineWidth = 1.0;
        for (let lx = b3.x + 4; lx < b3.x + b3.w - 3; lx += 4.5) {
            ctx.beginPath();
            ctx.moveTo(lx, b3.y + 2);
            ctx.lineTo(lx, b3.y + b3.h - 2);
            ctx.stroke();
        }

        ctx.strokeStyle = '#1a1714';
        ctx.lineWidth = 1.9;
        ctx.strokeRect(b3.x, b3.y, b3.w, b3.h);

        // Выносное коньковое бревно хлева
        const b3RidgeX = b3.x + b3.w * 0.46;
        ctx.fillStyle = '#6e665c';
        ctx.fillRect(b3RidgeX - 1.8, b3.y - 3, 3.6, b3.h + 6);
        ctx.strokeRect(b3RidgeX - 1.8, b3.y - 3, 3.6, b3.h + 6);

        // Стопки досок и ящиков справа от хлева
        drawCrate(0.28, 0.48, 5, 5, '#5c5346');
        drawCrate(0.32, 0.50, 5, 6, '#474036');
        drawCrate(0.27, 0.68, 6, 8, '#754c29');
        drawCrate(0.27, 0.73, 10, 7, '#8c5a32');
        drawCrate(0.27, 0.80, 9, 8, '#9c5424');

        // 6. ПОСТРОЙКА 4: Правый нижний амбар с рыжей соломенной крышей
        const b4 = { x: w * 0.72, y: h * 0.62, w: w * 0.17, h: h * 0.25 };
        ctx.fillStyle = 'rgba(18, 15, 10, 0.52)';
        ctx.fillRect(b4.x + 2, b4.y + 3, b4.w, b4.h);

        ctx.fillStyle = '#b58444';
        ctx.fillRect(b4.x, b4.y, b4.w * 0.52, b4.h);
        ctx.fillStyle = '#855824';
        ctx.fillRect(b4.x + b4.w * 0.52, b4.y, b4.w * 0.48, b4.h);

        // Фактура соломы
        ctx.strokeStyle = 'rgba(38, 22, 8, 0.42)';
        ctx.lineWidth = 1.0;
        for (let sy = b4.y + 4; sy < b4.y + b4.h - 2; sy += 4.5) {
            for (let sx = b4.x + 2; sx < b4.x + b4.w - 3; sx += 4.5) {
                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.lineTo(sx + 2.5, sy);
                ctx.stroke();
            }
        }

        ctx.strokeStyle = '#221508';
        ctx.lineWidth = 1.8;
        ctx.strokeRect(b4.x, b4.y, b4.w, b4.h);

        ctx.beginPath();
        ctx.moveTo(b4.x + b4.w * 0.52, b4.y - 2);
        ctx.lineTo(b4.x + b4.w * 0.52, b4.y + b4.h + 2);
        ctx.stroke();

        // Три ящика слева от нижнего правого амбара
        drawCrate(0.58, 0.76, 7, 7, '#756a5a');
        drawCrate(0.625, 0.76, 6, 7, '#8c857a');
        drawCrate(0.665, 0.78, 7, 6, '#5c5346');

        // 7. Деревянная повозка-телега с оглоблями справа выше амбара
        ctx.save();
        ctx.translate(w * 0.76, h * 0.49);
        ctx.rotate(-0.62);

        ctx.fillStyle = 'rgba(18, 15, 10, 0.48)';
        ctx.fillRect(-10, -6, 22, 14);

        ctx.strokeStyle = '#3b2818';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(-10, -4.5);
        ctx.lineTo(-18, -4.5);
        ctx.moveTo(-10, 4.5);
        ctx.lineTo(-18, 4.5);
        ctx.stroke();

        ctx.fillStyle = '#7c5334';
        ctx.strokeStyle = '#1f140a';
        ctx.lineWidth = 1.5;
        ctx.fillRect(-10, -6.5, 20, 13);
        ctx.strokeRect(-10, -6.5, 20, 13);

        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(10, 0);
        ctx.stroke();
        ctx.restore();
    },

    palace(ctx, w, h) {
        // 1. Фон травянистого участка и парадная тропа снизу по центру
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#b2ba7a');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(218, 212, 174, 0.50)';
        ctx.fillRect(w * 0.45, h * 0.82, w * 0.10, h * 0.18);

        // 2. Крестообразные светлые садовые дорожки во внутреннем дворе
        ctx.fillStyle = 'rgba(218, 214, 186, 0.72)';
        ctx.fillRect(w * 0.485, h * 0.25, w * 0.03, h * 0.50);
        ctx.fillRect(w * 0.23, h * 0.445, w * 0.54, h * 0.03);

        // 3. Четыре группы садовых кустов во дворе вокруг бассейна
        const drawGardenBush = (bx, by, r) => {
            ctx.fillStyle = 'rgba(15, 22, 10, 0.44)';
            ctx.beginPath();
            ctx.arc(w * bx + 1.5, h * by + 2, r, 0, Math.PI * 2);
            ctx.fill();

            const bGrad = ctx.createRadialGradient(w * bx - 2, h * by - 2, 1, w * bx, h * by, r);
            bGrad.addColorStop(0, '#4f6928');
            bGrad.addColorStop(0.7, '#314217');
            bGrad.addColorStop(1, '#1a260b');
            ctx.fillStyle = bGrad;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, r, 0, Math.PI * 2);
            ctx.fill();
        };

        const bushes = [
            // Верхний левый сектор
            [0.34, 0.34, 7.5], [0.38, 0.37, 6.5], [0.35, 0.40, 7.0],
            // Верхний правый сектор
            [0.61, 0.35, 7.5], [0.65, 0.37, 6.5], [0.62, 0.40, 6.5],
            // Нижний левый сектор
            [0.35, 0.55, 7.0], [0.38, 0.59, 6.5], [0.34, 0.62, 7.0],
            // Нижний правый сектор
            [0.62, 0.56, 7.0], [0.65, 0.60, 7.5], [0.61, 0.63, 6.5]
        ];
        bushes.forEach(([x, y, r]) => drawGardenBush(x, y, r));

        // 4. Прямоугольный декоративный бассейн с ярко-голубой водой в центре двора
        const poolW = w * 0.13;
        const poolH = h * 0.21;
        const poolX = w * 0.50 - poolW / 2;
        const poolY = h * 0.46 - poolH / 2;

        // Светлая каменная отмостка вокруг бассейна
        ctx.fillStyle = '#cfcbb8';
        ctx.fillRect(poolX - 3, poolY - 3, poolW + 6, poolH + 6);

        const waterGrad = ctx.createLinearGradient(poolX, poolY, poolX + poolW, poolY + poolH);
        waterGrad.addColorStop(0, '#38bdf8');
        waterGrad.addColorStop(0.5, '#0ea5e9');
        waterGrad.addColorStop(1, '#0284c7');
        ctx.fillStyle = waterGrad;
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2.0;
        ctx.fillRect(poolX, poolY, poolW, poolH);
        ctx.strokeRect(poolX, poolY, poolW, poolH);

        // Хелпер для сплошной каменной булыжной кладки
        const fillStoneMasonry = (drawClipFn, minX = 0, minY = 0, spanW = w, spanH = h) => {
            ctx.save();
            drawClipFn();
            ctx.clip();

            ctx.fillStyle = '#868b94';
            ctx.fillRect(minX, minY, spanW, spanH);

            for (let y = minY; y < minY + spanH; y += 3.6) {
                const shift = (Math.floor(Math.abs(y) / 3.6) % 2) * 2.0;
                for (let x = minX; x < minX + spanW; x += 4.2) {
                    const tone = ((Math.floor(Math.abs(x + y))) % 3 === 0) ? '#adb2ba' : (((Math.floor(Math.abs(x))) % 2 === 0) ? '#686d75' : '#8f949c');
                    ctx.fillStyle = tone;
                    ctx.strokeStyle = '#2a2d33';
                    ctx.lineWidth = 0.6;
                    ctx.fillRect(x + shift, y, 3.6, 3.0);
                    ctx.strokeRect(x + shift, y, 3.6, 3.0);
                }
            }
            ctx.restore();
        };

        // 5. Внешние квадратные каменные стены дворца
        const wL = w * 0.16;
        const wR = w * 0.84;
        const wT = h * 0.11;
        const wB = h * 0.81;
        const wallThick = 11;

        const drawWallBox = (x, y, bw, bh) => {
            ctx.fillStyle = 'rgba(14, 16, 18, 0.54)';
            ctx.fillRect(x + 2, y + 3, bw, bh);

            fillStoneMasonry(() => {
                ctx.beginPath();
                ctx.rect(x, y, bw, bh);
            }, x - 4, y - 4, bw + 8, bh + 8);

            ctx.strokeStyle = '#181a1d';
            ctx.lineWidth = 2.0;
            ctx.strokeRect(x, y, bw, bh);
        };

        // Северная, южная, западная и восточная стены
        drawWallBox(wL, wT - wallThick / 2, wR - wL, wallThick);
        drawWallBox(wL, wB - wallThick / 2, wR - wL, wallThick);
        drawWallBox(wL - wallThick / 2, wT, wallThick, wB - wT);
        drawWallBox(wR - wallThick / 2, wT, wallThick, wB - wT);

        // Боковые внутренние галереи вдоль западной и восточной стен
        drawWallBox(wL + wallThick / 2, h * 0.32, 9, h * 0.28);
        drawWallBox(wR - wallThick / 2 - 9, h * 0.32, 9, h * 0.28);

        // 6. Северный главный дворцовый павильон со скруглёнными краями
        const drawNorthHall = () => {
            ctx.beginPath();
            ctx.roundRect(w * 0.30, wT + wallThick / 2 - 1, w * 0.40, h * 0.13, 12);
        };

        ctx.save();
        ctx.translate(2, 3);
        ctx.fillStyle = 'rgba(14, 16, 18, 0.54)';
        drawNorthHall();
        ctx.fill();
        ctx.restore();

        fillStoneMasonry(drawNorthHall);
        ctx.strokeStyle = '#181a1d';
        ctx.lineWidth = 2.0;
        drawNorthHall();
        ctx.stroke();

        // 7. Южный двухбашенный парадный вход (барбакан)
        const drawSouthGate = () => {
            ctx.beginPath();
            ctx.moveTo(w * 0.38, h * 0.74);
            ctx.lineTo(w * 0.62, h * 0.74);
            ctx.lineTo(w * 0.62, h * 0.84);
            ctx.arc(w * 0.568, h * 0.84, w * 0.052, 0, Math.PI, false);
            ctx.lineTo(w * 0.484, h * 0.84);
            ctx.arc(w * 0.432, h * 0.84, w * 0.052, 0, Math.PI, false);
            ctx.closePath();
        };

        ctx.save();
        ctx.translate(2, 3);
        ctx.fillStyle = 'rgba(14, 16, 18, 0.56)';
        drawSouthGate();
        ctx.fill();
        ctx.restore();

        fillStoneMasonry(drawSouthGate);
        ctx.strokeStyle = '#181a1d';
        ctx.lineWidth = 2.0;
        drawSouthGate();
        ctx.stroke();

        // Деревянный люк в центре парадных ворот
        ctx.fillStyle = '#855e3c';
        ctx.strokeStyle = '#1f160d';
        ctx.lineWidth = 1.2;
        ctx.fillRect(w * 0.485, h * 0.78, 7, 6);
        ctx.strokeRect(w * 0.485, h * 0.78, 7, 6);

        // 8. Круглые башни с медными куполами (4 угловые + 2 северные + 2 южные воротные)
        const drawDomeTower = (tx, ty, outerR, domeR) => {
            ctx.fillStyle = 'rgba(14, 16, 18, 0.58)';
            ctx.beginPath();
            ctx.arc(tx + 2, ty + 3, outerR + 1, 0, Math.PI * 2);
            ctx.fill();

            // Внешнее каменное кольцо башни
            fillStoneMasonry(() => {
                ctx.beginPath();
                ctx.arc(tx, ty, outerR, 0, Math.PI * 2);
            });
            ctx.strokeStyle = '#181a1d';
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.arc(tx, ty, outerR, 0, Math.PI * 2);
            ctx.stroke();

            // Медно-терракотовый конический купол
            const dGrad = ctx.createRadialGradient(tx - domeR * 0.3, ty - domeR * 0.3, 1, tx, ty, domeR);
            dGrad.addColorStop(0, '#c48660');
            dGrad.addColorStop(0.65, '#8c5334');
            dGrad.addColorStop(1, '#4f2b18');

            ctx.fillStyle = dGrad;
            ctx.strokeStyle = '#241308';
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.arc(tx, ty, domeR, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Золотистый шпиль в центре купола
            ctx.fillStyle = '#eab308';
            ctx.beginPath();
            ctx.arc(tx, ty, 1.8, 0, Math.PI * 2);
            ctx.fill();
        };

        // 4 крупные угловые башни
        drawDomeTower(wL, wT, w * 0.068, w * 0.044);
        drawDomeTower(wR, wT, w * 0.068, w * 0.044);
        drawDomeTower(wL, wB, w * 0.068, w * 0.044);
        drawDomeTower(wR, wB, w * 0.068, w * 0.044);

        // 2 башни северного дворцового павильона
        drawDomeTower(w * 0.405, h * 0.285, w * 0.056, w * 0.036);
        drawDomeTower(w * 0.595, h * 0.285, w * 0.056, w * 0.036);

        // 2 малые купольные башенки южных ворот
        drawDomeTower(w * 0.432, h * 0.84, w * 0.044, w * 0.028);
        drawDomeTower(w * 0.568, h * 0.84, w * 0.044, w * 0.028);
    },

    menagerie(ctx, w, h) {
        // 1. Фон травянистого участка зверинца
        const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, w * 0.1, w * 0.5, h * 0.5, w * 0.72);
        bgGrad.addColorStop(0, '#b5bd7d');
        bgGrad.addColorStop(0.55, '#9ea668');
        bgGrad.addColorStop(1, '#879052');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // 2. Светлые песчаные дорожки с петлёй в левом нижнем углу
        ctx.strokeStyle = '#dcd6b0';
        ctx.lineWidth = 8.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        // Главная диагональная тропа из правого верхнего угла в левый нижний с петлёй
        ctx.moveTo(w * 0.76, h * 0.10);
        ctx.quadraticCurveTo(w * 0.72, h * 0.25, w * 0.50, h * 0.45);
        ctx.quadraticCurveTo(w * 0.22, h * 0.58, w * 0.12, h * 0.72);
        ctx.quadraticCurveTo(w * 0.08, h * 0.84, w * 0.22, h * 0.80);
        ctx.quadraticCurveTo(w * 0.36, h * 0.74, w * 0.48, h * 0.50);

        // Ответвления к нижней и правой клеткам
        ctx.moveTo(w * 0.48, h * 0.50);
        ctx.quadraticCurveTo(w * 0.56, h * 0.68, w * 0.65, h * 0.78);
        ctx.moveTo(w * 0.50, h * 0.45);
        ctx.quadraticCurveTo(w * 0.62, h * 0.55, w * 0.72, h * 0.50);
        ctx.stroke();

        // Круглая песчаная площадка в центре вокруг водопоя
        const cx = w * 0.49;
        const cy = h * 0.46;
        ctx.fillStyle = '#dcd6b0';
        ctx.beginPath();
        ctx.arc(cx, cy, 18, 0, Math.PI * 2);
        ctx.fill();

        // Мелкий булыжник вдоль краёв тропинок и вокруг центра
        ctx.fillStyle = 'rgba(82, 78, 68, 0.62)';
        for (let i = 0; i < 42; i++) {
            const ang = (Math.PI * 2 / 42) * i;
            const rad = 11.5 + (i % 3) * 2.5;
            ctx.beginPath();
            ctx.roundRect(cx + Math.cos(ang) * rad - 1.5, cy + Math.sin(ang) * rad - 1.2, 2.8, 2.2, 0.8);
            ctx.fill();
        }

        const drawPathStones = (x1, y1, x2, y2, count) => {
            for (let i = 0; i <= count; i++) {
                const t = i / count;
                const px = w * (x1 + (x2 - x1) * t);
                const py = h * (y1 + (y2 - y1) * t);
                ctx.beginPath();
                ctx.roundRect(px - 4.5 + (i % 2), py - 3, 2.6, 2.0, 0.7);
                ctx.roundRect(px + 2.5 - (i % 2), py + 2.5, 2.6, 2.0, 0.7);
                ctx.fill();
            }
        };

        drawPathStones(0.75, 0.14, 0.53, 0.40, 12);
        drawPathStones(0.42, 0.52, 0.15, 0.68, 11);
        drawPathStones(0.14, 0.78, 0.36, 0.72, 9);
        drawPathStones(0.52, 0.54, 0.64, 0.76, 9);
        drawPathStones(0.56, 0.48, 0.70, 0.50, 6);

        // 3. Круглый каменный пруд-водопой в центре
        ctx.fillStyle = 'rgba(18, 22, 14, 0.48)';
        ctx.beginPath();
        ctx.arc(cx + 1.5, cy + 2, 9.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#5c5850';
        ctx.strokeStyle = '#171614';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(cx, cy, 9.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        const waterGrad = ctx.createRadialGradient(cx - 2, cy - 2, 1, cx, cy, 6.8);
        waterGrad.addColorStop(0, '#bae6fd');
        waterGrad.addColorStop(0.55, '#38bdf8');
        waterGrad.addColorStop(1, '#0284c7');
        ctx.fillStyle = waterGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 6.6, 0, Math.PI * 2);
        ctx.fill();

        // 4. Четыре круглых решётчатых вольеры
        const drawRoundCage = (kx, ky, r) => {
            const x = w * kx;
            const y = h * ky;

            ctx.fillStyle = 'rgba(18, 20, 14, 0.46)';
            ctx.beginPath();
            ctx.arc(x + 1.8, y + 2.2, r + 0.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'rgba(72, 68, 56, 0.55)';
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();

            // Концентрические кольца и радиальные прутья клетки
            ctx.strokeStyle = '#1a1917';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.stroke();

            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.arc(x, y, r * 0.56, 0, Math.PI * 2);
            ctx.stroke();

            for (let i = 0; i < 10; i++) {
                const ang = (Math.PI * 2 / 10) * i;
                ctx.beginPath();
                ctx.moveTo(x + Math.cos(ang) * 2.2, y + Math.sin(ang) * 2.2);
                ctx.lineTo(x + Math.cos(ang) * r, y + Math.sin(ang) * r);
                ctx.stroke();
            }

            ctx.fillStyle = '#262421';
            ctx.beginPath();
            ctx.arc(x, y, 2.2, 0, Math.PI * 2);
            ctx.fill();
        };

        drawRoundCage(0.28, 0.44, 10.5);
        drawRoundCage(0.35, 0.65, 10.0);
        drawRoundCage(0.77, 0.34, 10.5);
        drawRoundCage(0.68, 0.85, 10.0);

        // 5. Две квадратные решётчатые клетки (сверху и справа снизу)
        const drawSquareCage = (kx, ky, size, ang) => {
            ctx.save();
            ctx.translate(w * kx, h * ky);
            ctx.rotate(ang);
            const half = size / 2;

            ctx.fillStyle = 'rgba(18, 20, 14, 0.48)';
            ctx.fillRect(-half + 1.8, -half + 2.2, size, size);

            ctx.fillStyle = '#5c5850';
            ctx.fillRect(-half, -half, size, size);

            // Решётка крыши клетки
            ctx.strokeStyle = '#171614';
            ctx.lineWidth = 1.0;
            for (let p = -half + 3.2; p < half; p += 3.2) {
                ctx.beginPath();
                ctx.moveTo(p, -half);
                ctx.lineTo(p, half);
                ctx.moveTo(-half, p);
                ctx.lineTo(half, p);
                ctx.stroke();
            }

            ctx.lineWidth = 1.8;
            ctx.strokeRect(-half, -half, size, size);
            ctx.restore();
        };

        drawSquareCage(0.52, 0.24, 15, 0.0);
        drawSquareCage(0.74, 0.61, 15, -0.52);

        // 6. Деревянная повозка-фургон с оглоблями справа
        ctx.save();
        ctx.translate(w * 0.77, h * 0.46);
        ctx.rotate(-0.62);

        ctx.fillStyle = 'rgba(18, 15, 10, 0.48)';
        ctx.fillRect(-10, -6, 22, 14);

        // Оглобли повозки слева
        ctx.strokeStyle = '#3b2818';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(-10, -4.5);
        ctx.lineTo(-18, -4.5);
        ctx.moveTo(-10, 4.5);
        ctx.lineTo(-18, 4.5);
        ctx.stroke();

        // Кузов фургона
        ctx.fillStyle = '#7c5334';
        ctx.strokeStyle = '#1f140a';
        ctx.lineWidth = 1.5;
        ctx.fillRect(-10, -6.5, 20, 13);
        ctx.strokeRect(-10, -6.5, 20, 13);

        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(10, 0);
        ctx.stroke();
        ctx.restore();

        // 7. Пышные группы деревьев и кустов по периметру зверинца
        const drawTreeCluster = (tx, ty, r) => {
            ctx.fillStyle = 'rgba(14, 20, 8, 0.45)';
            ctx.beginPath();
            ctx.arc(w * tx + 2, h * ty + 2.5, r, 0, Math.PI * 2);
            ctx.fill();

            const tGrad = ctx.createRadialGradient(w * tx - r * 0.3, h * ty - r * 0.3, 1.5, w * tx, h * ty, r);
            tGrad.addColorStop(0, '#536b29');
            tGrad.addColorStop(0.65, '#334517');
            tGrad.addColorStop(1, '#1b260b');
            ctx.fillStyle = tGrad;
            ctx.beginPath();
            ctx.arc(w * tx, h * ty, r, 0, Math.PI * 2);
            ctx.fill();
        };

        const trees = [
            // Верхний левый массив деревьев
            [0.15, 0.14, 9], [0.22, 0.19, 11], [0.29, 0.14, 10], [0.34, 0.21, 9],
            [0.12, 0.31, 9.5], [0.18, 0.36, 10],
            // Верхний центральный и правый массивы
            [0.48, 0.11, 10], [0.55, 0.10, 11], [0.61, 0.13, 8.5],
            [0.83, 0.14, 9.5], [0.90, 0.19, 10.5], [0.85, 0.24, 8.5],
            // Нижний массив деревьев
            [0.32, 0.87, 10], [0.39, 0.85, 11], [0.46, 0.86, 9], [0.53, 0.83, 9.5],
            [0.57, 0.89, 8.5], [0.82, 0.77, 10], [0.89, 0.75, 10.5], [0.85, 0.84, 9]
        ];

        trees.forEach(([x, y, r]) => drawTreeCluster(x, y, r));
    },

    cathedral(ctx, w, h) {
        // 1. Фон травянистого участка и светлые песчано-каменные дорожки сверху и снизу
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#b2ba7a');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(220, 214, 180, 0.58)';
        ctx.fillRect(w * 0.43, 0, w * 0.14, h * 0.10);
        ctx.fillRect(w * 0.41, h * 0.88, w * 0.18, h * 0.12);

        // 2. Садовые кусты в нижних углах и мелкие валуны сверху
        const drawBush = (bx, by, r) => {
            ctx.fillStyle = 'rgba(15, 22, 10, 0.44)';
            ctx.beginPath();
            ctx.arc(w * bx + 1.5, h * by + 2, r, 0, Math.PI * 2);
            ctx.fill();

            const bGrad = ctx.createRadialGradient(w * bx - 2, h * by - 2, 1, w * bx, h * by, r);
            bGrad.addColorStop(0, '#526b29');
            bGrad.addColorStop(0.7, '#344719');
            bGrad.addColorStop(1, '#1d290d');
            ctx.fillStyle = bGrad;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, r, 0, Math.PI * 2);
            ctx.fill();
        };

        [
            [0.21, 0.67, 6], [0.25, 0.72, 7.5], [0.19, 0.75, 5.5], [0.27, 0.78, 5],
            [0.77, 0.69, 6.5], [0.82, 0.74, 7], [0.75, 0.79, 5.5], [0.83, 0.81, 5]
        ].forEach(([x, y, r]) => drawBush(x, y, r));

        // 3. Южные боковые пристройки (портики у входа) и белая паперть снизу
        const drawSideChapel = (cx, cy, cw, ch) => {
            ctx.fillStyle = 'rgba(14, 16, 18, 0.52)';
            ctx.fillRect(cx + 2, cy + 2.5, cw, ch);

            ctx.fillStyle = '#68737a';
            ctx.strokeStyle = '#14171a';
            ctx.lineWidth = 1.6;
            ctx.fillRect(cx, cy, cw, ch);
            ctx.strokeRect(cx, cy, cw, ch);

            ctx.beginPath();
            ctx.moveTo(cx, cy + ch * 0.5);
            ctx.lineTo(cx + cw, cy + ch * 0.5);
            ctx.stroke();
        };

        drawSideChapel(w * 0.31, h * 0.76, w * 0.08, h * 0.11);
        drawSideChapel(w * 0.61, h * 0.76, w * 0.08, h * 0.11);

        // Светлая каменная ступень главного южного входа
        ctx.fillStyle = '#d6d3c9';
        ctx.strokeStyle = '#1a1c1e';
        ctx.lineWidth = 1.6;
        ctx.fillRect(w * 0.41, h * 0.89, w * 0.18, h * 0.04);
        ctx.strokeRect(w * 0.41, h * 0.89, w * 0.18, h * 0.04);

        // 4. Крестообразный корпус собора (неф + трансепт)
        const nave = { x: w * 0.39, y: h * 0.06, w: w * 0.22, h: h * 0.83 };
        const trans = { x: w * 0.11, y: h * 0.26, w: w * 0.78, h: h * 0.20 };

        // Тень от креста собора
        ctx.fillStyle = 'rgba(14, 16, 18, 0.54)';
        ctx.fillRect(nave.x + 2.5, nave.y + 3.5, nave.w, nave.h);
        ctx.fillRect(trans.x + 2.5, trans.y + 3.5, trans.w, trans.h);

        // Крыша трансепта (светлый верхний скат, тёмный нижний скат)
        ctx.fillStyle = '#758087';
        ctx.fillRect(trans.x, trans.y, trans.w, trans.h * 0.50);
        ctx.fillStyle = '#4e575e';
        ctx.fillRect(trans.x, trans.y + trans.h * 0.50, trans.w, trans.h * 0.50);

        ctx.strokeStyle = '#14171a';
        ctx.lineWidth = 2.0;
        ctx.strokeRect(trans.x, trans.y, trans.w, trans.h);

        // Крыша главного нефа (светлый левый скат, тёмный правый скат)
        ctx.fillStyle = '#7d888f';
        ctx.fillRect(nave.x, nave.y, nave.w * 0.50, nave.h);
        ctx.fillStyle = '#525b61';
        ctx.fillRect(nave.x + nave.w * 0.50, nave.y, nave.w * 0.50, nave.h);

        ctx.strokeStyle = '#14171a';
        ctx.lineWidth = 2.0;
        ctx.strokeRect(nave.x, nave.y, nave.w, nave.h);

        // Текстура кровельного сланца на скатах
        ctx.strokeStyle = 'rgba(18, 22, 26, 0.35)';
        ctx.lineWidth = 0.9;
        for (let y = nave.y + 5; y < nave.y + nave.h - 4; y += 5) {
            ctx.beginPath();
            ctx.moveTo(nave.x + 2, y);
            ctx.lineTo(nave.x + nave.w - 2, y);
            ctx.stroke();
        }
        for (let x = trans.x + 5; x < trans.x + trans.w - 4; x += 5) {
            ctx.beginPath();
            ctx.moveTo(x, trans.y + 2);
            ctx.lineTo(x, trans.y + trans.h - 2);
            ctx.stroke();
        }

        // 5. Коньковые балки нефа и трансепта
        ctx.strokeStyle = '#1f2429';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(w * 0.50, nave.y);
        ctx.lineTo(w * 0.50, nave.y + nave.h);
        ctx.moveTo(trans.x, trans.y + trans.h * 0.50);
        ctx.lineTo(trans.x + trans.w, trans.y + trans.h * 0.50);
        ctx.stroke();

        // 6. Ряды готических контрфорсов (аркбутанов) с пинаклями
        const drawButtress = (x1, y1, x2, y2) => {
            ctx.strokeStyle = '#181c20';
            ctx.lineWidth = 3.2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            ctx.strokeStyle = '#8b949c';
            ctx.lineWidth = 1.4;
            ctx.stroke();

            // Пинакль на внешнем конце контрфорса
            ctx.fillStyle = '#68737a';
            ctx.strokeStyle = '#14171a';
            ctx.lineWidth = 1.1;
            ctx.fillRect(x2 - 2.3, y2 - 2.3, 4.6, 4.6);
            ctx.strokeRect(x2 - 2.3, y2 - 2.3, 4.6, 4.6);
        };

        // Контрфорсы вдоль северного и южного нефа (по 3 пары)
        [0.10, 0.15, 0.20, 0.52, 0.57, 0.62].forEach(ry => {
            drawButtress(nave.x, h * ry, w * 0.33, h * ry);
            drawButtress(nave.x + nave.w, h * ry, w * 0.67, h * ry);
        });

        // Контрфорсы вдоль западного и восточного крыльев трансепта
        [0.17, 0.25, 0.75, 0.83].forEach(rx => {
            drawButtress(w * rx, trans.y, w * rx, h * 0.20);
            drawButtress(w * rx, trans.y + trans.h, w * rx, h * 0.52);
        });

        // Боковые торцевые башенки на концах трансепта
        [0.11, 0.89].forEach(tx => {
            ctx.fillStyle = '#8b949c';
            ctx.strokeStyle = '#14171a';
            ctx.lineWidth = 1.5;
            ctx.fillRect(w * tx - 4, trans.y + trans.h * 0.50 - 4, 8, 8);
            ctx.strokeRect(w * tx - 4, trans.y + trans.h * 0.50 - 4, 8, 8);
        });

        // 7. Четыре круглые башенки у южного фасада (две крупные и две малые)
        const drawSpire = (sx, sy, r) => {
            ctx.fillStyle = 'rgba(14, 16, 18, 0.50)';
            ctx.beginPath();
            ctx.arc(sx + 1.5, sy + 2, r, 0, Math.PI * 2);
            ctx.fill();

            const sGrad = ctx.createRadialGradient(sx - 1.5, sy - 1.5, 1, sx, sy, r);
            sGrad.addColorStop(0, '#c4c2b8');
            sGrad.addColorStop(1, '#6e7378');
            ctx.fillStyle = sGrad;
            ctx.strokeStyle = '#14171a';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(sx, sy, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#1f2429';
            ctx.beginPath();
            ctx.arc(sx, sy, 1.4, 0, Math.PI * 2);
            ctx.fill();
        };

        drawSpire(w * 0.38, h * 0.71, 6.2);
        drawSpire(w * 0.62, h * 0.71, 6.2);
        drawSpire(w * 0.39, h * 0.85, 3.6);
        drawSpire(w * 0.61, h * 0.85, 3.6);

        // 8. Массивная центральная башня средокрестия со шпилем
        const tSize = w * 0.22;
        const tx = w * 0.50 - tSize / 2;
        const ty = h * 0.36 - tSize / 2;

        ctx.fillStyle = 'rgba(14, 16, 18, 0.60)';
        ctx.fillRect(tx + 3, ty + 4, tSize, tSize);

        // Внешний каменный парапет башни
        ctx.fillStyle = '#5c6369';
        ctx.strokeStyle = '#121518';
        ctx.lineWidth = 2.2;
        ctx.fillRect(tx, ty, tSize, tSize);
        ctx.strokeRect(tx, ty, tSize, tSize);

        // Углублённая светло-песочная плоская крыша башни
        const inPad = 4.5;
        ctx.fillStyle = '#c4bea8';
        ctx.strokeStyle = '#24272b';
        ctx.lineWidth = 1.4;
        ctx.fillRect(tx + inPad, ty + inPad, tSize - inPad * 2, tSize - inPad * 2);
        ctx.strokeRect(tx + inPad, ty + inPad, tSize - inPad * 2, tSize - inPad * 2);

        // Центральный пирамидальный шпиль собора
        const spSize = 9;
        const spX = w * 0.50 - spSize / 2;
        const spY = h * 0.36 - spSize / 2;
        ctx.fillStyle = '#757e85';
        ctx.strokeStyle = '#121518';
        ctx.lineWidth = 1.5;
        ctx.fillRect(spX, spY, spSize, spSize);
        ctx.strokeRect(spX, spY, spSize, spSize);

        ctx.beginPath();
        ctx.moveTo(spX, spY);
        ctx.lineTo(spX + spSize, spY + spSize);
        ctx.moveTo(spX + spSize, spY);
        ctx.lineTo(spX, spY + spSize);
        ctx.stroke();
    },


    castle(ctx, w, h) {
        // 1. Внешний травянистый фон участка (полностью виден вокруг рва со всех сторон)
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Шестиугольные опорные вершины крепости (с отступами от краёв, чтобы вместить ров и внешний берег)
        const cTL = {x: w * 0.21, y: h * 0.20};
        const cTR = {x: w * 0.79, y: h * 0.20};
        const cMR = {x: w * 0.84, y: h * 0.48};
        const cBR = {x: w * 0.79, y: h * 0.75};
        const cBL = {x: w * 0.21, y: h * 0.75};
        const cML = {x: w * 0.16, y: h * 0.48};

        const hexPts = [cTL, cTR, cMR, cBR, cBL, cML];
        const tRad = w * 0.060;

        const traceHexCastle = (includeBarbican = false) => {
            ctx.beginPath();
            ctx.moveTo(cTL.x, cTL.y);
            ctx.lineTo(cTR.x, cTR.y);
            ctx.lineTo(cMR.x, cMR.y);
            ctx.lineTo(cBR.x, cBR.y);
            if (includeBarbican) {
                ctx.lineTo(w * 0.57, h * 0.77);
                ctx.lineTo(w * 0.45, h * 0.77);
            }
            ctx.lineTo(cBL.x, cBL.y);
            ctx.lineTo(cML.x, cML.y);
            ctx.closePath();
        };

        // Хелпер для рисования рва как увеличенного силуэта замка и башен
        const strokeMoatLayer = (color, wallStrokeW, towerExtraR) => {
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = wallStrokeW;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';

            traceHexCastle(true);
            ctx.stroke();

            hexPts.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, tRad + towerExtraR, 0, Math.PI * 2);
                ctx.fill();
            });

            [
                [w * 0.45, h * 0.77, w * 0.048 + towerExtraR],
                [w * 0.57, h * 0.77, w * 0.048 + towerExtraR]
            ].forEach(([bx, by, br]) => {
                ctx.beginPath();
                ctx.arc(bx, by, br, 0, Math.PI * 2);
                ctx.fill();
            });
        };

        // 2. Ров из 2 слоёв воды (мелководье у берегов + основная гладь) внутри зелени участка
        ctx.save();
        strokeMoatLayer('#8ce9f2', 32, 12);
        strokeMoatLayer('#22b8cf', 26, 9);
        ctx.restore();

        // 3. Внутренний остров замка с зелёной береговой полосой у стен
        const yardGrad = ctx.createRadialGradient(w * 0.5, h * 0.48, w * 0.08, w * 0.5, h * 0.48, w * 0.40);
        yardGrad.addColorStop(0, '#dcd6b0');
        yardGrad.addColorStop(0.68, '#b8ba82');
        yardGrad.addColorStop(1, '#7c8549');

        traceHexCastle(false);
        ctx.fillStyle = yardGrad;
        ctx.strokeStyle = '#7c8549';
        ctx.lineWidth = 16;
        ctx.lineJoin = 'round';
        ctx.fill();
        ctx.stroke();

        // Зелёные мысы берега вокруг башен и южного барбакана
        const tRadBank = tRad + 2.5;
        ctx.fillStyle = '#7c8549';
        [
            ...hexPts.map(p => [p.x, p.y, tRadBank]),
            [w * 0.45, h * 0.77, w * 0.048 + 2.5],
            [w * 0.57, h * 0.77, w * 0.048 + 2.5]
        ].forEach(([bx, by, br]) => {
            ctx.beginPath();
            ctx.arc(bx, by, br, 0, Math.PI * 2);
            ctx.fill();
        });

        // 4. Деревянный мост через ров снизу по центру
        const bridgeX = w * 0.48;
        const bridgeY = h * 0.79;
        const bridgeW = w * 0.06;
        const bridgeH = h * 0.21;

        ctx.fillStyle = '#5c4328';
        ctx.strokeStyle = '#17120c';
        ctx.lineWidth = 1.6;
        ctx.fillRect(bridgeX, bridgeY, bridgeW, bridgeH);
        ctx.strokeRect(bridgeX, bridgeY, bridgeW, bridgeH);

        // 5. Мощёные булыжником тропинки во дворе и центральный круглый фонтан
        ctx.fillStyle = 'rgba(118, 116, 108, 0.72)';
        const drawCobbleLine = (x1, y1, x2, y2) => {
            const steps = 12;
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const px = w * (x1 + (x2 - x1) * t);
                const py = h * (y1 + (y2 - y1) * t);
                ctx.beginPath();
                ctx.roundRect(px - 2, py - 2, 3.6, 3.0, 1);
                ctx.roundRect(px + 2, py + 1, 3.2, 2.8, 1);
                ctx.fill();
            }
        };

        drawCobbleLine(0.51, 0.38, 0.51, 0.72);
        drawCobbleLine(0.18, 0.44, 0.51, 0.52);
        drawCobbleLine(0.83, 0.44, 0.51, 0.52);

        const fx = w * 0.51;
        const fy = h * 0.51;
        ctx.fillStyle = '#5c5850';
        ctx.strokeStyle = '#171512';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(fx, fy, 7.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(fx, fy, 4.8, 0, Math.PI * 2);
        ctx.fill();

        // 6. Четыре небольших хозяйственных домика в углах двора
        const drawYardHut = (hx, hy, hw, hh, ang, color) => {
            ctx.save();
            ctx.translate(w * hx, h * hy);
            ctx.rotate(ang);
            ctx.fillStyle = 'rgba(18, 15, 10, 0.46)';
            ctx.fillRect(-hw / 2 + 1.5, -hh / 2 + 2, hw, hh);

            ctx.fillStyle = color;
            ctx.strokeStyle = '#1f160d';
            ctx.lineWidth = 1.3;
            ctx.fillRect(-hw / 2, -hh / 2, hw, hh);
            ctx.strokeRect(-hw / 2, -hh / 2, hw, hh);

            ctx.beginPath();
            if (hw >= hh) {
                ctx.moveTo(-hw / 2, 0);
                ctx.lineTo(hw / 2, 0);
            } else {
                ctx.moveTo(0, -hh / 2);
                ctx.lineTo(0, hh / 2);
            }
            ctx.stroke();
            ctx.restore();
        };

        drawYardHut(0.30, 0.25, 11, 15, 0.0, '#9c6e44');
        drawYardHut(0.75, 0.27, 15, 12, -0.25, '#857868');
        drawYardHut(0.29, 0.65, 19, 11, -0.15, '#7c5334');
        drawYardHut(0.72, 0.66, 15, 10, -0.22, '#9c6e44');

        // Хелпер для сплошной каменной булыжной кладки
        const fillStoneMasonry = (drawClipFn, minX = 0, minY = 0, spanW = w, spanH = h) => {
            ctx.save();
            drawClipFn();
            ctx.clip();

            ctx.fillStyle = '#868b94';
            ctx.fillRect(minX, minY, spanW, spanH);

            for (let y = minY; y < minY + spanH; y += 3.6) {
                const shift = (Math.floor(Math.abs(y) / 3.6) % 2) * 2.0;
                for (let x = minX; x < minX + spanW; x += 4.2) {
                    const tone = ((Math.floor(Math.abs(x + y))) % 3 === 0) ? '#adb2ba' : (((Math.floor(Math.abs(x))) % 2 === 0) ? '#686d75' : '#8f949c');
                    ctx.fillStyle = tone;
                    ctx.strokeStyle = '#2a2d33';
                    ctx.lineWidth = 0.6;
                    ctx.fillRect(x + shift, y, 3.6, 3.0);
                    ctx.strokeRect(x + shift, y, 3.6, 3.0);
                }
            }
            ctx.restore();
        };

        // 7. Шесть сегментов каменных крепостных стен
        const wallW = 12;
        const drawWallSegment = (p1, p2) => {
            const ang = Math.atan2(p2.y - p1.y, p2.x - p1.x);
            const len = Math.hypot(p2.x - p1.x, p2.y - p1.y);

            ctx.save();
            ctx.translate(p1.x, p1.y);
            ctx.rotate(ang);

            ctx.fillStyle = 'rgba(12, 16, 20, 0.52)';
            ctx.fillRect(0, -wallW / 2 + 2.5, len, wallW + 1);

            fillStoneMasonry(() => {
                ctx.beginPath();
                ctx.rect(0, -wallW / 2, len, wallW);
            }, -4, -wallW, len + 8, wallW * 2);

            ctx.strokeStyle = '#181a1d';
            ctx.lineWidth = 2.0;
            ctx.strokeRect(0, -wallW / 2, len, wallW);

            ctx.strokeStyle = '#474b52';
            ctx.lineWidth = 1.0;
            ctx.strokeRect(1.5, -wallW / 2 + 1.8, len - 3, wallW - 3.6);
            ctx.restore();
        };

        for (let i = 0; i < hexPts.length; i++) {
            drawWallSegment(hexPts[i], hexPts[(i + 1) % hexPts.length]);
        }

        // 8. Центральный каменный донжон у северной стены
        const drawKeepPolygon = () => {
            ctx.beginPath();
            ctx.moveTo(w * 0.35, h * 0.16);
            ctx.lineTo(w * 0.68, h * 0.16);
            ctx.lineTo(w * 0.68, h * 0.35);
            ctx.lineTo(w * 0.56, h * 0.35);
            ctx.lineTo(w * 0.54, h * 0.39);
            ctx.lineTo(w * 0.49, h * 0.39);
            ctx.lineTo(w * 0.47, h * 0.35);
            ctx.lineTo(w * 0.35, h * 0.35);
            ctx.closePath();
        };

        ctx.save();
        ctx.translate(2, 3);
        ctx.fillStyle = 'rgba(14, 16, 18, 0.55)';
        drawKeepPolygon();
        ctx.fill();
        ctx.restore();

        fillStoneMasonry(drawKeepPolygon);
        ctx.strokeStyle = '#181a1d';
        ctx.lineWidth = 2.2;
        drawKeepPolygon();
        ctx.stroke();

        const topKeep = {x: w * 0.42, y: h * 0.18, w: w * 0.19, h: h * 0.09};
        ctx.fillStyle = 'rgba(14, 16, 18, 0.50)';
        ctx.fillRect(topKeep.x + 1.5, topKeep.y + 2, topKeep.w, topKeep.h);

        fillStoneMasonry(() => {
            ctx.beginPath();
            ctx.rect(topKeep.x, topKeep.y, topKeep.w, topKeep.h);
        });
        ctx.strokeStyle = '#181a1d';
        ctx.lineWidth = 2.0;
        ctx.strokeRect(topKeep.x, topKeep.y, topKeep.w, topKeep.h);

        // 9. Южный двухбашенный барбакан (главные ворота)
        const drawBarbican = () => {
            ctx.beginPath();
            ctx.moveTo(w * 0.39, h * 0.71);
            ctx.lineTo(w * 0.63, h * 0.71);
            ctx.lineTo(w * 0.63, h * 0.80);
            ctx.arc(w * 0.575, h * 0.80, w * 0.055, 0, Math.PI, false);
            ctx.lineTo(w * 0.50, h * 0.80);
            ctx.arc(w * 0.445, h * 0.80, w * 0.055, 0, Math.PI, false);
            ctx.closePath();
        };

        ctx.save();
        ctx.translate(2, 3);
        ctx.fillStyle = 'rgba(14, 16, 18, 0.56)';
        drawBarbican();
        ctx.fill();
        ctx.restore();

        fillStoneMasonry(drawBarbican);
        ctx.strokeStyle = '#181a1d';
        ctx.lineWidth = 2.2;
        drawBarbican();
        ctx.stroke();
        ctx.fillStyle = '#855e3c';
        ctx.strokeStyle = '#1f160d';
        ctx.lineWidth = 1.2;
        ctx.fillRect(w * 0.49, h * 0.74, 8, 6);
        ctx.strokeRect(w * 0.49, h * 0.74, 8, 6);
// 10. Шесть круглых каменных башен в вершинах шестиугольника
        const drawRoundTower = (tx, ty, r) => {
            ctx.fillStyle = 'rgba(14, 16, 18, 0.56)';
            ctx.beginPath();
            ctx.arc(tx + 2, ty + 3, r + 1, 0, Math.PI * 2);
            ctx.fill();
            fillStoneMasonry(() => {
                ctx.beginPath();
                ctx.arc(tx, ty, r, 0, Math.PI * 2);
            });
            ctx.strokeStyle = '#181a1d';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.arc(tx, ty, r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.strokeStyle = '#474b52';
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.arc(tx, ty, r - 2.2, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = '#474b52';
            ctx.beginPath();
            ctx.arc(tx, ty, 2.4, 0, Math.PI * 2);
            ctx.fill();
        };
//        const tRad = w * 0.068;
        hexPts.forEach(p => drawRoundTower(p.x, p.y, tRad));
    },

    arena(ctx, w, h) {
        // 1. Фон травянистого участка
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        const cx = w * 0.50;
        const cy = h * 0.50;
        const outerRx = w * 0.37;
        const outerRy = h * 0.43;

        // 2. Тень от амфитеатра и контрфорсы по внешнему контуру
        ctx.fillStyle = 'rgba(16, 16, 14, 0.52)';
        ctx.beginPath();
        ctx.ellipse(cx + 3, cy + 4, outerRx + 2, outerRy + 2, 0, 0, Math.PI * 2);
        ctx.fill();

        const buttressCount = 28;
        for (let i = 0; i < buttressCount; i++) {
            const ang = (Math.PI * 2 / buttressCount) * i;
            const bx = cx + Math.cos(ang) * (outerRx + 1.5);
            const by = cy + Math.sin(ang) * (outerRy + 1.5);
            ctx.fillStyle = '#333638';
            ctx.strokeStyle = '#141617';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(bx, by, 2.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }

        // 3. Внешняя тёмная стена и концентрические ярусы трибун
        ctx.fillStyle = '#292c2e';
        ctx.strokeStyle = '#121314';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.ellipse(cx, cy, outerRx, outerRy, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        const tiers = [
            {scale: 0.94, fill: '#94917e'},
            {scale: 0.89, fill: '#aba894'},
            {scale: 0.84, fill: '#878472'},
            {scale: 0.79, fill: '#9c9986'},
            {scale: 0.74, fill: '#757262'}
        ];

        tiers.forEach(t => {
            ctx.fillStyle = t.fill;
            ctx.strokeStyle = '#2b2922';
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.ellipse(cx, cy, outerRx * t.scale, outerRy * t.scale, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });

        // 4. Песчаное поле арены в центре с внутренней тенью от бортика
        const sandRx = outerRx * 0.69;
        const sandRy = outerRy * 0.69;

        const sandGrad = ctx.createRadialGradient(cx - 10, cy - 12, 8, cx, cy, Math.max(sandRx, sandRy));
        sandGrad.addColorStop(0, '#cfa96e');
        sandGrad.addColorStop(0.65, '#b58d52');
        sandGrad.addColorStop(1, '#7a592b');

        ctx.fillStyle = sandGrad;
        ctx.strokeStyle = '#1f1912';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.ellipse(cx, cy, sandRx, sandRy, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Россыпь мелких камней вдоль внутреннего бордюра арены
        for (let i = 0; i < 36; i++) {
            const ang = (Math.PI * 2 / 36) * i + 0.15;
            const dist = 0.92 + (i % 3) * 0.025;
            const sx = cx + Math.cos(ang) * sandRx * dist;
            const sy = cy + Math.sin(ang) * sandRy * dist;
            ctx.fillStyle = (i % 2 === 0) ? '#a3a098' : '#5c5952';
            ctx.beginPath();
            ctx.arc(sx, sy, (i % 3 === 0) ? 2.1 : 1.4, 0, Math.PI * 2);
            ctx.fill();
        }

        // 5. Четыре каменных бастиона-ложи по сторонам света (север, юг, запад, восток)
        const drawGateBastion = (angle) => {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angle);

            const distY = outerRy * 0.84;
            const bPts = [
                {x: -16, y: -distY - 12},
                {x: 16, y: -distY - 12},
                {x: 16, y: -distY + 2},
                {x: 11, y: -distY + 14},
                {x: -11, y: -distY + 14},
                {x: -16, y: -distY + 2}
            ];

            // Тень от бастиона
            ctx.fillStyle = 'rgba(14, 16, 18, 0.55)';
            ctx.beginPath();
            bPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x + 2, p.y + 3) : ctx.lineTo(p.x + 2, p.y + 3));
            ctx.closePath();
            ctx.fill();

            // Булыжная каменная кладка бастиона
            ctx.save();
            ctx.beginPath();
            bPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
            ctx.closePath();
            ctx.fillStyle = '#8b9098';
            ctx.fill();
            ctx.clip();

            for (let y = -distY - 14; y < -distY + 16; y += 3.8) {
                const shift = (Math.floor(y / 3.8) % 2) * 2.2;
                for (let x = -18; x < 18; x += 4.4) {
                    ctx.fillStyle = ((Math.floor(x + y)) % 3 === 0) ? '#b4b9c2' : '#6e737b';
                    ctx.fillRect(x + shift, y, 3.6, 3.0);
                }
            }
            ctx.restore();

            // Зубчатый парапет по контуру бастиона
            ctx.strokeStyle = '#141618';
            ctx.lineWidth = 2.6;
            ctx.lineJoin = 'round';
            ctx.beginPath();
            bPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
            ctx.closePath();
            ctx.stroke();

            ctx.setLineDash([2.2, 2.2]);
            ctx.strokeStyle = '#c4c9d1';
            ctx.lineWidth = 1.4;
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.restore();
        };

        [0, Math.PI / 2, Math.PI, -Math.PI / 2].forEach(ang => drawGateBastion(ang));
    },


};
