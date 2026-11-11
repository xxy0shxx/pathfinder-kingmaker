/**
* ГЕНЕРАТОРЫ ПОСТРОЕК НА 2 КЛЕТКИ (2x1)
*/
export const Buildings2Lot = {
    town_hall(ctx, w, h) {
        // 1. Фон травянистого участка и парадная мощёная дорога из внутреннего двора вниз
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(218, 212, 174, 0.55)';
        ctx.fillRect(w * 0.43, h * 0.52, w * 0.14, h * 0.48);

        ctx.fillStyle = 'rgba(118, 116, 108, 0.76)';
        for (let y = h * 0.54; y < h - 1; y += 4.6) {
            for (let dx = -8; dx <= 6; dx += 4.5) {
                const shift = (Math.floor(y / 4.6) % 2) * 2;
                ctx.beginPath();
                ctx.roundRect(w * 0.50 + dx + shift, y, 3.8, 3.2, 1);
                ctx.fill();
            }
        }

        // 2. Прямоугольный каменный дымоход у северной (верхней) стены по центру
        ctx.fillStyle = '#9ca3af';
        ctx.strokeStyle = '#1f2937';
        ctx.lineWidth = 1.5;
        ctx.fillRect(w * 0.46, h * 0.05, w * 0.08, h * 0.09);
        ctx.strokeRect(w * 0.46, h * 0.05, w * 0.08, h * 0.09);

        ctx.beginPath();
        ctx.moveTo(w * 0.50, h * 0.05);
        ctx.lineTo(w * 0.50, h * 0.14);
        ctx.stroke();

        // 3. Боковые низкие пристройки слева и справа
        const drawSideAnnex = (wx, wy, ww, wh) => {
            ctx.fillStyle = 'rgba(18, 15, 10, 0.48)';
            ctx.fillRect(wx + 2, wy + 2.5, ww, wh);

            ctx.fillStyle = '#c4ab78';
            ctx.fillRect(wx, wy, ww, wh * 0.48);
            ctx.fillStyle = '#85663a';
            ctx.fillRect(wx, wy + wh * 0.48, ww, wh * 0.52);

            ctx.strokeStyle = '#1f1810';
            ctx.lineWidth = 1.7;
            ctx.strokeRect(wx, wy, ww, wh);

            ctx.beginPath();
            ctx.moveTo(wx, wy + wh * 0.48);
            ctx.lineTo(wx + ww, wy + wh * 0.48);
            ctx.stroke();
        };

        drawSideAnnex(w * 0.125, h * 0.25, w * 0.115, h * 0.46);
        drawSideAnnex(w * 0.76, h * 0.25, w * 0.115, h * 0.46);

        // 4. Бочки у левой пристройки и две круглые колонны у входа во дворе
        const drawBarrel = (bx, by, r = 4.0) => {
            ctx.fillStyle = '#3b3732';
            ctx.strokeStyle = '#141210';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        };

        drawBarrel(0.19, 0.19, 4.4);
        drawBarrel(0.11, 0.47, 3.6);
        drawBarrel(0.085, 0.57, 4.2);

        // Две круглые каменные тумбы-фонари в углах внутреннего двора
        [0.405, 0.595].forEach(cx => {
            ctx.fillStyle = '#5c5852';
            ctx.strokeStyle = '#171512';
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.arc(w * cx, h * 0.57, 3.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });

        // 5. Главный П-образный корпус ратуши (открыт вниз)
        const pts = [
            { x: w * 0.24, y: h * 0.13 },
            { x: w * 0.76, y: h * 0.13 },
            { x: w * 0.76, y: h * 0.85 },
            { x: w * 0.62, y: h * 0.85 },
            { x: w * 0.62, y: h * 0.54 },
            { x: w * 0.38, y: h * 0.54 },
            { x: w * 0.38, y: h * 0.85 },
            { x: w * 0.24, y: h * 0.85 }
        ];

        ctx.save();
        ctx.translate(2.5, 3.5);
        ctx.fillStyle = 'rgba(18, 15, 10, 0.55)';
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Объёмная двухцветная песочно-коричневая крыша
        ctx.save();
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();

        ctx.fillStyle = '#c4aa74';
        ctx.fill();
        ctx.clip();

        // Тёмные внутренние и правые скаты
        ctx.fillStyle = '#7c5d32';
        ctx.fillRect(w * 0.31, h * 0.31, w * 0.45, h * 0.55);

        // Светлый внешний скат правого крыла
        ctx.fillStyle = '#b59962';
        ctx.fillRect(w * 0.69, h * 0.13, w * 0.08, h * 0.73);

        // Мелкая фактура черепицы на скатах
        ctx.strokeStyle = 'rgba(34, 22, 10, 0.36)';
        ctx.lineWidth = 0.9;
        for (let y = h * 0.15; y < h * 0.84; y += 4.5) {
            const shift = (Math.floor(y / 4.5) % 2) * 2.5;
            for (let x = w * 0.25; x < w * 0.75; x += 5) {
                ctx.strokeRect(x + shift, y, 4.5, 4);
            }
        }
        ctx.restore();

        ctx.strokeStyle = '#22170a';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();

        // 6. Скошенный П-образный гребень конька и диагональные стыки
        ctx.strokeStyle = '#2b1c0c';
        ctx.lineWidth = 2.2;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(w * 0.31, h * 0.85);
        ctx.lineTo(w * 0.31, h * 0.36);
        ctx.lineTo(w * 0.345, h * 0.31);
        ctx.lineTo(w * 0.655, h * 0.31);
        ctx.lineTo(w * 0.69, h * 0.36);
        ctx.lineTo(w * 0.69, h * 0.85);

        ctx.moveTo(w * 0.24, h * 0.13);
        ctx.lineTo(w * 0.345, h * 0.31);
        ctx.moveTo(w * 0.76, h * 0.13);
        ctx.lineTo(w * 0.655, h * 0.31);
        ctx.moveTo(w * 0.38, h * 0.54);
        ctx.lineTo(w * 0.31, h * 0.36);
        ctx.moveTo(w * 0.62, h * 0.54);
        ctx.lineTo(w * 0.69, h * 0.36);
        ctx.stroke();

        // 7. Три треугольных слуховых окна на внутреннем нижнем скате
        [0.415, 0.50, 0.585].forEach(dx => {
            ctx.fillStyle = '#c9a654';
            ctx.strokeStyle = '#22170a';
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.moveTo(w * dx, h * 0.34);
            ctx.lineTo(w * (dx - 0.035), h * 0.46);
            ctx.lineTo(w * (dx + 0.035), h * 0.46);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(w * dx, h * 0.34);
            ctx.lineTo(w * dx, h * 0.46);
            ctx.stroke();
        });
    },

    temple(ctx, w, h) {
        // 1. Фон травянистого участка
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#b2ba7a');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // 2. Гравийные тропинки слева, справа и снизу вокруг платформы храма
        ctx.fillStyle = 'rgba(110, 106, 92, 0.58)';
        const scatterGravel = (x1, y1, x2, y2, spread = 8) => {
            const steps = 16;
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const px = w * (x1 + (x2 - x1) * t);
                const py = h * (y1 + (y2 - y1) * t);
                for (let k = -2; k <= 2; k++) {
                    const ox = ((i * 7 + k * 5) % spread) - spread / 2;
                    const oy = ((i * 3 + k * 9) % spread) - spread / 2;
                    ctx.fillRect(px + ox, py + oy, 2.2, 2.0);
                }
            }
        };

        scatterGravel(0.06, 0.04, 0.22, 0.50, 9);
        scatterGravel(0.22, 0.50, 0.05, 0.96, 9);
        scatterGravel(0.95, 0.06, 0.78, 0.52, 9);
        scatterGravel(0.78, 0.52, 0.96, 0.96, 9);
        scatterGravel(0.32, 0.92, 0.68, 0.92, 7);

        // 3. Зелёные садовые кусты по краям поляны
        const drawBush = (bx, by, rx, ry) => {
            ctx.fillStyle = 'rgba(15, 22, 10, 0.42)';
            ctx.beginPath();
            ctx.ellipse(w * bx + 1.5, h * by + 2, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();

            const bGrad = ctx.createRadialGradient(w * bx - 2, h * by - 2, 1, w * bx, h * by, Math.max(rx, ry));
            bGrad.addColorStop(0, '#4d6629');
            bGrad.addColorStop(0.7, '#324519');
            bGrad.addColorStop(1, '#1d290e');
            ctx.fillStyle = bGrad;
            ctx.beginPath();
            ctx.ellipse(w * bx, h * by, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();
        };

        drawBush(0.04, 0.34, 4, 12);
        drawBush(0.18, 0.87, 7, 7);
        drawBush(0.84, 0.09, 10, 6);
        drawBush(0.86, 0.88, 9, 5);

        // 4. Основная прямоугольная каменная платформа храма
        const px = w * 0.22;
        const py = h * 0.12;
        const pw = w * 0.56;
        const ph = h * 0.76;

        ctx.fillStyle = 'rgba(18, 18, 18, 0.55)';
        ctx.fillRect(px + 2.5, py + 3.5, pw, ph);

        const stoneGrad = ctx.createLinearGradient(px, py, px + pw, py + ph);
        stoneGrad.addColorStop(0, '#969694');
        stoneGrad.addColorStop(0.5, '#828280');
        stoneGrad.addColorStop(1, '#686866');
        ctx.fillStyle = stoneGrad;
        ctx.strokeStyle = '#222220';
        ctx.lineWidth = 2.0;
        ctx.fillRect(px, py, pw, ph);
        ctx.strokeRect(px, py, pw, ph);

        // Горизонтальная текстура каменных плит и верхний/нижний ступенчатые уступы
        ctx.strokeStyle = 'rgba(30, 30, 28, 0.36)';
        ctx.lineWidth = 1.0;
        for (let y = py + 8; y < py + ph - 6; y += 6) {
            ctx.beginPath();
            ctx.moveTo(px + 4, y);
            ctx.lineTo(px + pw - 4, y);
            ctx.stroke();
        }

        // Верхняя и нижняя бордюрные полосы платформы
        ctx.strokeStyle = '#383836';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(px, py + 7);
        ctx.lineTo(px + pw, py + 7);
        ctx.moveTo(px, py + ph - 7);
        ctx.lineTo(px + pw, py + ph - 7);
        ctx.stroke();

        // 5. Два вертикальных ряда круглых каменных колонн/тумб по краям платформы
        const drawColumn = (cx, cy, r = 2.3) => {
            ctx.fillStyle = '#2b2b29';
            ctx.beginPath();
            ctx.arc(cx + 1, cy + 1.2, r + 0.3, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#a6a6a4';
            ctx.strokeStyle = '#1c1c1a';
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        };

        for (let i = 0; i < 5; i++) {
            const cy = py + 11 + (ph - 22) * (i / 4);
            drawColumn(px + 9, cy, 2.3);
            drawColumn(px + pw - 9, cy, 2.3);
        }

        // 6. Квадратный каменный алтарь-постамент сверху по центру
        const altSize = h * 0.31;
        const altX = w * 0.50 - altSize / 2;
        const altY = py + 5;

        ctx.fillStyle = 'rgba(18, 18, 18, 0.52)';
        ctx.fillRect(altX + 2, altY + 3, altSize, altSize);

        ctx.fillStyle = '#8c8c8a';
        ctx.strokeStyle = '#222220';
        ctx.lineWidth = 1.6;
        ctx.fillRect(altX, altY, altSize, altSize);
        ctx.strokeRect(altX, altY, altSize, altSize);

        // Четыре угловые тумбы на алтаре
        drawColumn(altX + 1.5, altY + 1.5, 2.0);
        drawColumn(altX + altSize - 1.5, altY + 1.5, 2.0);
        drawColumn(altX + 1.5, altY + altSize - 1.5, 2.0);
        drawColumn(altX + altSize - 1.5, altY + altSize - 1.5, 2.0);

        // 7. Прямоугольный бассейн для омовений с ярко-голубой водой под алтарём
        const poolW = w * 0.19;
        const poolH = h * 0.19;
        const poolX = w * 0.50 - poolW / 2;
        const poolY = py + ph - poolH - 11;

        const waterGrad = ctx.createLinearGradient(poolX, poolY, poolX + poolW, poolY + poolH);
        waterGrad.addColorStop(0, '#38bdf8');
        waterGrad.addColorStop(0.5, '#0ea5e9');
        waterGrad.addColorStop(1, '#0284c7');

        ctx.fillStyle = waterGrad;
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2.0;
        ctx.fillRect(poolX, poolY, poolW, poolH);
        ctx.strokeRect(poolX, poolY, poolW, poolH);

        ctx.strokeStyle = '#1f1e1b';
        ctx.lineWidth = 1.0;
        ctx.strokeRect(poolX - 1, poolY - 1, poolW + 2, poolH + 2);
    },

    tavern_world_class(ctx, w, h) {
        // 1. Фон травянистого участка и центральная мощёная аллея
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(130, 128, 118, 0.74)';
        for (let y = h * 0.44; y < h - 1; y += 4.8) {
            for (let dx = -12; dx <= 10; dx += 5) {
                const shift = (Math.floor(y / 4.8) % 2) * 2;
                ctx.beginPath();
                ctx.roundRect(w * 0.50 + dx + shift, y, 4.0, 3.4, 1);
                ctx.fill();
            }
        }

        // 2. Садовые кусты во внутренних двориках слева и справа
        const drawBush = (bx, by, rx, ry) => {
            ctx.fillStyle = 'rgba(15, 22, 10, 0.45)';
            ctx.beginPath();
            ctx.ellipse(w * bx + 1.5, h * by + 2, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();

            const bGrad = ctx.createRadialGradient(w * bx - 2, h * by - 2, 1, w * bx, h * by, Math.max(rx, ry));
            bGrad.addColorStop(0, '#5a752e');
            bGrad.addColorStop(0.7, '#384d1b');
            bGrad.addColorStop(1, '#1e2b0d');
            ctx.fillStyle = bGrad;
            ctx.beginPath();
            ctx.ellipse(w * bx, h * by, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();
        };

        [
            [0.29, 0.41, 7, 7], [0.33, 0.53, 8, 8], [0.28, 0.62, 6, 6], [0.36, 0.64, 5, 5],
            [0.71, 0.41, 7, 7], [0.67, 0.54, 8, 8], [0.72, 0.63, 6, 6], [0.64, 0.61, 5, 5]
        ].forEach(([x, y, r1, r2]) => drawBush(x, y, r1, r2));

        // 3. Крупный круглый каменный фонтан с голубой водой внизу по центру
        const fx = w * 0.50;
        const fy = h * 0.74;
        ctx.fillStyle = 'rgba(18, 22, 14, 0.52)';
        ctx.beginPath();
        ctx.arc(fx + 2, fy + 2.5, 13.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#5c5850';
        ctx.strokeStyle = '#1f1e1b';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(fx, fy, 13.0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        const waterGrad = ctx.createRadialGradient(fx - 3, fy - 3, 1, fx, fy, 9.8);
        waterGrad.addColorStop(0, '#bae6fd');
        waterGrad.addColorStop(0.55, '#38bdf8');
        waterGrad.addColorStop(1, '#0284c7');
        ctx.fillStyle = waterGrad;
        ctx.beginPath();
        ctx.arc(fx, fy, 9.6, 0, Math.PI * 2);
        ctx.fill();

        // Центральный каменный постамент фонтана
        ctx.fillStyle = '#78736a';
        ctx.strokeStyle = '#1f1e1b';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(fx, fy, 3.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 4. Каменные боковые лестницы во внутренних двориках
        const drawSideStairs = (sx, sy) => {
            const sw = w * 0.045;
            const sh = h * 0.24;
            ctx.fillStyle = '#9e9a90';
            ctx.strokeStyle = '#1f1d1a';
            ctx.lineWidth = 1.4;
            ctx.fillRect(sx, sy, sw, sh);
            ctx.strokeRect(sx, sy, sw, sh);

            for (let py = sy + 4; py < sy + sh - 2; py += 4) {
                ctx.beginPath();
                ctx.moveTo(sx, py);
                ctx.lineTo(sx + sw, py);
                ctx.stroke();
            }
        };

        drawSideStairs(w * 0.215, h * 0.37);
        drawSideStairs(w * 0.74, h * 0.37);

        // 5. Внешний контур здания таверны
        const pts = [
            { x: w * 0.03, y: h * 0.08 },
            { x: w * 0.40, y: h * 0.08 },
            { x: w * 0.40, y: h * 0.05 },
            { x: w * 0.59, y: h * 0.05 },
            { x: w * 0.59, y: h * 0.08 },
            { x: w * 0.97, y: h * 0.08 },
            { x: w * 0.97, y: h * 0.91 },
            { x: w * 0.64, y: h * 0.91 },
            { x: w * 0.64, y: h * 0.69 },
            { x: w * 0.78, y: h * 0.69 },
            { x: w * 0.78, y: h * 0.29 },
            { x: w * 0.59, y: h * 0.29 },
            { x: w * 0.59, y: h * 0.47 },
            { x: w * 0.40, y: h * 0.47 },
            { x: w * 0.40, y: h * 0.29 },
            { x: w * 0.22, y: h * 0.29 },
            { x: w * 0.22, y: h * 0.69 },
            { x: w * 0.36, y: h * 0.69 },
            { x: w * 0.36, y: h * 0.91 },
            { x: w * 0.03, y: h * 0.91 }
        ];

        ctx.save();
        ctx.translate(2.5, 3.5);
        ctx.fillStyle = 'rgba(18, 14, 10, 0.55)';
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 6. Объёмная многоскатная крыша в тёплых бордово-песочных тонах
        ctx.save();
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.clip();

        const lightSlope = '#b09068';
        const midSlope = '#855844';
        const darkSlope = '#6e362e';

        ctx.fillStyle = midSlope;
        ctx.fillRect(0, 0, w, h);

        // Внутренние бордовые скаты левого крыла
        ctx.fillStyle = darkSlope;
        ctx.beginPath();
        ctx.moveTo(w * 0.125, h * 0.185);
        ctx.lineTo(w * 0.40, h * 0.185);
        ctx.lineTo(w * 0.40, h * 0.29);
        ctx.lineTo(w * 0.22, h * 0.29);
        ctx.lineTo(w * 0.22, h * 0.69);
        ctx.lineTo(w * 0.36, h * 0.69);
        ctx.lineTo(w * 0.36, h * 0.80);
        ctx.lineTo(w * 0.125, h * 0.80);
        ctx.closePath();
        ctx.fill();

        // Внутренние песочные скаты правого крыла
        ctx.fillStyle = lightSlope;
        ctx.beginPath();
        ctx.moveTo(w * 0.875, h * 0.185);
        ctx.lineTo(w * 0.59, h * 0.185);
        ctx.lineTo(w * 0.59, h * 0.29);
        ctx.lineTo(w * 0.78, h * 0.29);
        ctx.lineTo(w * 0.78, h * 0.69);
        ctx.lineTo(w * 0.64, h * 0.69);
        ctx.lineTo(w * 0.64, h * 0.80);
        ctx.lineTo(w * 0.875, h * 0.80);
        ctx.closePath();
        ctx.fill();

        // Внешний левый песочный скат и внешний правый бордовый скат
        ctx.fillStyle = lightSlope;
        ctx.beginPath();
        ctx.moveTo(w * 0.03, h * 0.08);
        ctx.lineTo(w * 0.125, h * 0.185);
        ctx.lineTo(w * 0.125, h * 0.80);
        ctx.lineTo(w * 0.03, h * 0.91);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = darkSlope;
        ctx.beginPath();
        ctx.moveTo(w * 0.97, h * 0.08);
        ctx.lineTo(w * 0.875, h * 0.185);
        ctx.lineTo(w * 0.875, h * 0.80);
        ctx.lineTo(w * 0.97, h * 0.91);
        ctx.closePath();
        ctx.fill();

        // Центральный портик: левый светлый скат, правый более тёмный скат
        ctx.fillStyle = '#b59268';
        ctx.beginPath();
        ctx.moveTo(w * 0.40, h * 0.05);
        ctx.lineTo(w * 0.495, h * 0.05);
        ctx.lineTo(w * 0.495, h * 0.47);
        ctx.lineTo(w * 0.40, h * 0.47);
        ctx.lineTo(w * 0.40, h * 0.29);
        ctx.lineTo(w * 0.45, h * 0.185);
        ctx.lineTo(w * 0.40, h * 0.08);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#856242';
        ctx.beginPath();
        ctx.moveTo(w * 0.59, h * 0.05);
        ctx.lineTo(w * 0.495, h * 0.05);
        ctx.lineTo(w * 0.495, h * 0.47);
        ctx.lineTo(w * 0.59, h * 0.47);
        ctx.lineTo(w * 0.59, h * 0.29);
        ctx.lineTo(w * 0.54, h * 0.185);
        ctx.lineTo(w * 0.59, h * 0.08);
        ctx.closePath();
        ctx.fill();

        // Штриховка черепицы по периметру
        ctx.strokeStyle = 'rgba(28, 12, 8, 0.45)';
        ctx.lineWidth = 1.1;
        for (let x = w * 0.04; x < w * 0.96; x += 5) {
            ctx.beginPath();
            ctx.moveTo(x, h * 0.08);
            ctx.lineTo(x, h * 0.12);
            ctx.moveTo(x, h * 0.87);
            ctx.lineTo(x, h * 0.91);
            ctx.stroke();
        }
        ctx.restore();

        // Внешний контур крыши
        ctx.strokeStyle = '#24120c';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();

        // 7. Коньковые балки и диагональные стыки скатов
        ctx.strokeStyle = '#2b140c';
        ctx.lineWidth = 2.2;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(w * 0.36, h * 0.80);
        ctx.lineTo(w * 0.125, h * 0.80);
        ctx.lineTo(w * 0.125, h * 0.185);
        ctx.lineTo(w * 0.45, h * 0.185);

        ctx.moveTo(w * 0.64, h * 0.80);
        ctx.lineTo(w * 0.875, h * 0.80);
        ctx.lineTo(w * 0.875, h * 0.185);
        ctx.lineTo(w * 0.54, h * 0.185);

        ctx.moveTo(w * 0.495, h * 0.05);
        ctx.lineTo(w * 0.495, h * 0.47);

        ctx.moveTo(w * 0.03, h * 0.08);
        ctx.lineTo(w * 0.125, h * 0.185);
        ctx.moveTo(w * 0.03, h * 0.91);
        ctx.lineTo(w * 0.125, h * 0.80);
        ctx.moveTo(w * 0.22, h * 0.29);
        ctx.lineTo(w * 0.125, h * 0.185);
        ctx.moveTo(w * 0.22, h * 0.69);
        ctx.lineTo(w * 0.125, h * 0.80);

        ctx.moveTo(w * 0.97, h * 0.08);
        ctx.lineTo(w * 0.875, h * 0.185);
        ctx.moveTo(w * 0.97, h * 0.91);
        ctx.lineTo(w * 0.875, h * 0.80);
        ctx.moveTo(w * 0.78, h * 0.29);
        ctx.lineTo(w * 0.875, h * 0.185);
        ctx.moveTo(w * 0.78, h * 0.69);
        ctx.lineTo(w * 0.875, h * 0.80);

        ctx.moveTo(w * 0.40, h * 0.08);
        ctx.lineTo(w * 0.45, h * 0.185);
        ctx.lineTo(w * 0.40, h * 0.29);
        ctx.moveTo(w * 0.59, h * 0.08);
        ctx.lineTo(w * 0.54, h * 0.185);
        ctx.lineTo(w * 0.59, h * 0.29);
        ctx.stroke();

        // 8. Треугольные островерхие козырьки над боковыми лестницами и дымоходы
        const drawGableCanopy = (tipX, baseX, midY) => {
            ctx.fillStyle = '#5c4b44';
            ctx.strokeStyle = '#1c1410';
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(tipX, midY);
            ctx.lineTo(baseX, midY - 8);
            ctx.lineTo(baseX, midY + 8);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(tipX, midY);
            ctx.lineTo(baseX, midY);
            ctx.stroke();
        };
        drawGableCanopy(w * 0.15, w * 0.22, h * 0.49);
        drawGableCanopy(w * 0.85, w * 0.78, h * 0.49);
        [0.125, 0.875].forEach(cx => {
            ctx.fillStyle = '#8c8580';
            ctx.strokeStyle = '#1f1917';
            ctx.lineWidth = 1.3;
            ctx.fillRect(w * cx - 3.5, h * 0.43, 7, 12);
            ctx.strokeRect(w * cx - 3.5, h * 0.43, 7, 12);
        });
// 9. Гирлянды праздничных фонариков вдоль внутренних верхних карнизов
        const lanterns = [
            [0.24, '#991b1b'], [0.29, '#ca8a04'], [0.34, '#ca8a04'], [0.39, '#991b1b'],
            [0.61, '#991b1b'], [0.66, '#ca8a04'], [0.71, '#ca8a04'], [0.76, '#991b1b']
        ];
        lanterns.forEach(([lx, color]) => {
            ctx.fillStyle = color;
            ctx.strokeStyle = '#1c1208';
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.ellipse(w * lx, h * 0.30, 2.2, 3.0, 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });
    },


        tavern_luxury(ctx, w, h) {
        // 1. Фон травянистого участка и парадная мощёная дорожка снизу по центру
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(130, 128, 118, 0.76)';
        for (let y = h * 0.68; y < h - 1; y += 4.6) {
            for (let dx = -10; dx <= 8; dx += 5) {
                const shift = (Math.floor(y / 4.6) % 2) * 2;
                ctx.beginPath();
                ctx.roundRect(w * 0.50 + dx + shift, y, 4.0, 3.4, 1);
                ctx.fill();
            }
        }

        // 2. Прямоугольный бассейн с ярко-голубой водой в верхней центральной нише
        const poolW = w * 0.27;
        const poolH = h * 0.18;
        const poolX = w * 0.50 - poolW / 2;
        const poolY = h * 0.11;

        const waterGrad = ctx.createLinearGradient(poolX, poolY, poolX + poolW, poolY + poolH);
        waterGrad.addColorStop(0, '#38bdf8');
        waterGrad.addColorStop(0.5, '#0ea5e9');
        waterGrad.addColorStop(1, '#0284c7');
        ctx.fillStyle = waterGrad;
        ctx.strokeStyle = '#5c5850';
        ctx.lineWidth = 2.0;
        ctx.fillRect(poolX, poolY, poolW, poolH);
        ctx.strokeRect(poolX, poolY, poolW, poolH);

        ctx.strokeStyle = '#1f1e1b';
        ctx.lineWidth = 1.0;
        ctx.strokeRect(poolX - 1, poolY - 1, poolW + 2, poolH + 2);

        // 3. Два садовых куста по бокам от парадного входа снизу
        const drawBush = (bx, by, rx, ry) => {
            ctx.fillStyle = 'rgba(15, 22, 10, 0.45)';
            ctx.beginPath();
            ctx.ellipse(w * bx + 1.5, h * by + 2, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();

            const bGrad = ctx.createRadialGradient(w * bx - 2, h * by - 2, 1, w * bx, h * by, Math.max(rx, ry));
            bGrad.addColorStop(0, '#4d6629');
            bGrad.addColorStop(0.7, '#324519');
            bGrad.addColorStop(1, '#1d290e');
            ctx.fillStyle = bGrad;
            ctx.beginPath();
            ctx.ellipse(w * bx, h * by, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();
        };

        drawBush(0.39, 0.78, 8, 7);
        drawBush(0.61, 0.78, 8, 7);

        // 4. Внешний двухкрестовый контур роскошной таверны
        const pts = [
            { x: w * 0.06, y: h * 0.25 },
            { x: w * 0.11, y: h * 0.25 },
            { x: w * 0.11, y: h * 0.07 },
            { x: w * 0.34, y: h * 0.07 },
            { x: w * 0.34, y: h * 0.25 },
            { x: w * 0.66, y: h * 0.25 },
            { x: w * 0.66, y: h * 0.07 },
            { x: w * 0.89, y: h * 0.07 },
            { x: w * 0.89, y: h * 0.25 },
            { x: w * 0.94, y: h * 0.25 },
            { x: w * 0.94, y: h * 0.70 },
            { x: w * 0.89, y: h * 0.70 },
            { x: w * 0.89, y: h * 0.88 },
            { x: w * 0.66, y: h * 0.88 },
            { x: w * 0.66, y: h * 0.70 },
            { x: w * 0.34, y: h * 0.70 },
            { x: w * 0.34, y: h * 0.88 },
            { x: w * 0.11, y: h * 0.88 },
            { x: w * 0.11, y: h * 0.70 },
            { x: w * 0.06, y: h * 0.70 }
        ];

        ctx.save();
        ctx.translate(2.5, 3.5);
        ctx.fillStyle = 'rgba(18, 14, 10, 0.55)';
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 5. Многоскатная двухцветная черепичная крыша
        const midY = h * 0.475;
        const lWingX = w * 0.225;
        const rWingX = w * 0.775;

        ctx.save();
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.clip();

        ctx.fillStyle = '#8c4a20';
        ctx.fillRect(0, 0, w, h);

        // Светло-песочные верхние и левые скаты
        ctx.fillStyle = '#c4a984';
        ctx.fillRect(w * 0.11, h * 0.07, w * 0.115, h * 0.81);
        ctx.fillRect(w * 0.66, h * 0.07, w * 0.115, h * 0.81);
        ctx.fillRect(w * 0.06, h * 0.25, w * 0.88, h * 0.225);

        // Тёмные медно-коричневые правые и нижние скаты
        ctx.fillStyle = '#965124';
        ctx.fillRect(lWingX, h * 0.07, w * 0.115, h * 0.81);
        ctx.fillRect(rWingX, h * 0.07, w * 0.115, h * 0.81);

        ctx.fillStyle = '#6b3614';
        ctx.fillRect(w * 0.06, midY, w * 0.88, h * 0.225);

        // Мелкая фактура черепицы
        ctx.strokeStyle = 'rgba(28, 14, 6, 0.36)';
        ctx.lineWidth = 0.9;
        for (let y = h * 0.09; y < h * 0.87; y += 4.5) {
            const shift = (Math.floor(y / 4.5) % 2) * 2.5;
            for (let x = w * 0.07; x < w * 0.93; x += 5) {
                ctx.strokeRect(x + shift, y, 4.5, 4);
            }
        }
        ctx.restore();

        ctx.strokeStyle = '#221308';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();

        // 6. Коньки крыльев и диагональные стыки скатов
        ctx.strokeStyle = '#241408';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(lWingX, h * 0.05);
        ctx.lineTo(lWingX, h * 0.90);
        ctx.moveTo(rWingX, h * 0.05);
        ctx.lineTo(rWingX, h * 0.90);

        ctx.moveTo(w * 0.11, h * 0.25);
        ctx.lineTo(lWingX, midY);
        ctx.moveTo(w * 0.34, h * 0.25);
        ctx.lineTo(lWingX, midY);
        ctx.moveTo(w * 0.11, h * 0.70);
        ctx.lineTo(lWingX, midY);
        ctx.moveTo(w * 0.34, h * 0.70);
        ctx.lineTo(lWingX, midY);

        ctx.moveTo(w * 0.66, h * 0.25);
        ctx.lineTo(rWingX, midY);
        ctx.moveTo(w * 0.89, h * 0.25);
        ctx.lineTo(rWingX, midY);
        ctx.moveTo(w * 0.66, h * 0.70);
        ctx.lineTo(rWingX, midY);
        ctx.moveTo(w * 0.89, h * 0.70);
        ctx.lineTo(rWingX, midY);
        ctx.stroke();

        // Сквозной горизонтальный конёк
        ctx.fillStyle = '#7c5334';
        ctx.strokeStyle = '#1f1208';
        ctx.lineWidth = 1.4;
        ctx.fillRect(w * 0.05, midY - 2.0, w * 0.90, 4.0);
        ctx.strokeRect(w * 0.05, midY - 2.0, w * 0.90, 4.0);

        // 7. Две круглые каменные башни-ротонды с булыжником и зубчатым парапетом
        const drawRoundTurret = (cx, cy, r) => {
            ctx.fillStyle = 'rgba(16, 16, 18, 0.56)';
            ctx.beginPath();
            ctx.arc(cx + 2, cy + 3, r + 1, 0, Math.PI * 2);
            ctx.fill();

            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fillStyle = '#8b9098';
            ctx.fill();
            ctx.clip();

            for (let y = cy - r; y < cy + r; y += 4.2) {
                const shift = (Math.floor(y / 4.2) % 2) * 2.4;
                for (let x = cx - r; x < cx + r; x += 4.8) {
                    ctx.fillStyle = ((Math.floor(x + y)) % 3 === 0) ? '#b4b9c2' : '#737880';
                    ctx.strokeStyle = '#24272c';
                    ctx.lineWidth = 0.7;
                    ctx.beginPath();
                    ctx.roundRect(x + shift, y, 4.0, 3.4, 1);
                    ctx.fill();
                    ctx.stroke();
                }
            }
            ctx.restore();

            ctx.strokeStyle = '#181a1d';
            ctx.lineWidth = 3.2;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.stroke();

            ctx.setLineDash([2.2, 2.2]);
            ctx.strokeStyle = '#c4c9d1';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        };

        drawRoundTurret(lWingX, midY, h * 0.165);
        drawRoundTurret(rWingX, midY, h * 0.165);
    },

    stonemason(ctx, w, h) {
        // 1. Фон травянистого участка и песчано-булыжная дорога от мастерской вправо
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(218, 212, 174, 0.52)';
        ctx.fillRect(w * 0.36, h * 0.42, w * 0.64, h * 0.13);

        ctx.fillStyle = 'rgba(118, 116, 108, 0.74)';
        for (let x = w * 0.38; x < w - 2; x += 4.8) {
            for (let dy = -4; dy <= 4; dy += 4) {
                const shift = (Math.floor(x / 4.8) % 2) * 2;
                ctx.beginPath();
                ctx.roundRect(x, h * 0.48 + dy + shift, 3.8, 3.2, 1);
                ctx.fill();
            }
        }

        // 2. Штабеля брусчатки и крупные тёсаные каменные блоки на дворе
        const drawCobblePile = (px, py, cols, rows) => {
            for (let r = 0; r < rows; r++) {
                const rowCols = cols - (r === rows - 1 ? 1 : 0);
                for (let c = 0; c < rowCols; c++) {
                    const bx = w * px + c * 4.2 + (r % 2) * 1.5;
                    const by = h * py + r * 3.8;
                    ctx.fillStyle = ((r + c) % 2 === 0) ? '#6e737b' : '#4a4e54';
                    ctx.strokeStyle = '#17191c';
                    ctx.lineWidth = 0.9;
                    ctx.fillRect(bx, by, 3.8, 3.4);
                    ctx.strokeRect(bx, by, 3.8, 3.4);
                }
            }
        };

        // Две плотные кучи брусчатки рядом с мастерской
        drawCobblePile(0.425, 0.15, 5, 5);
        drawCobblePile(0.425, 0.66, 5, 4);

        // Крупные тёсаные каменные блоки по двору
        const drawAshlarBlock = (bx, by, bw, bh) => {
            const x = w * bx;
            const y = h * by;
            ctx.fillStyle = 'rgba(16, 18, 20, 0.52)';
            ctx.fillRect(x + 1.8, y + 2.2, bw, bh);

            const bGrad = ctx.createLinearGradient(x, y, x + bw, y + bh);
            bGrad.addColorStop(0, '#8b9098');
            bGrad.addColorStop(1, '#54585e');
            ctx.fillStyle = bGrad;
            ctx.strokeStyle = '#17191c';
            ctx.lineWidth = 1.2;
            ctx.fillRect(x, y, bw, bh);
            ctx.strokeRect(x, y, bw, bh);
        };

        const blocks = [
            // Верхние группы блоков
            [0.59, 0.17, 6, 8], [0.625, 0.14, 7, 11], [0.625, 0.27, 7, 7],
            [0.75, 0.16, 8, 6], [0.77, 0.22, 6, 8],
            [0.87, 0.09, 10, 6],
            // Нижние группы блоков
            [0.58, 0.67, 7, 11], [0.64, 0.63, 7, 7], [0.66, 0.74, 7, 7],
            [0.75, 0.67, 7, 10], [0.73, 0.77, 8, 6], [0.785, 0.72, 6, 7],
            [0.84, 0.73, 9, 6]
        ];
        blocks.forEach(b => drawAshlarBlock(...b));

        // 3. Три тёмные бочки в нижнем внутреннем углу у мастерской
        [
            [0.375, 0.69], [0.395, 0.77], [0.365, 0.84]
        ].forEach(([bx, by]) => {
            ctx.fillStyle = '#3b342c';
            ctx.strokeStyle = '#141210';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, 3.6, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });

        // 4. Крестообразный корпус мастерской каменотёса слева
        const pts = [
            { x: w * 0.08, y: h * 0.08 },
            { x: w * 0.35, y: h * 0.08 },
            { x: w * 0.35, y: h * 0.30 },
            { x: w * 0.39, y: h * 0.30 },
            { x: w * 0.39, y: h * 0.65 },
            { x: w * 0.35, y: h * 0.65 },
            { x: w * 0.35, y: h * 0.89 },
            { x: w * 0.08, y: h * 0.89 },
            { x: w * 0.08, y: h * 0.65 },
            { x: w * 0.04, y: h * 0.65 },
            { x: w * 0.04, y: h * 0.30 },
            { x: w * 0.08, y: h * 0.30 }
        ];

        ctx.save();
        ctx.translate(2.5, 3.5);
        ctx.fillStyle = 'rgba(18, 15, 10, 0.54)';
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Многоскатная охристо-коричневая крыша
        const cx = w * 0.215;
        const cy = h * 0.475;

        ctx.save();
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();

        ctx.fillStyle = '#a8844c';
        ctx.fill();
        ctx.clip();

        // Тёмный правый скат основного корпуса
        ctx.fillStyle = '#6e5026';
        ctx.fillRect(cx, h * 0.08, w * 0.18, h * 0.82);

        // Тёмные нижние скаты боковых выступов
        ctx.fillStyle = '#4a3518';
        ctx.fillRect(w * 0.04, cy, w * 0.35, h * 0.18);

        // Мелкая фактура черепицы
        ctx.strokeStyle = 'rgba(32, 22, 10, 0.34)';
        ctx.lineWidth = 0.9;
        for (let y = h * 0.10; y < h * 0.88; y += 4.5) {
            for (let x = w * 0.05; x < w * 0.38; x += 5) {
                ctx.strokeRect(x, y, 4.5, 4);
            }
        }
        ctx.restore();

        ctx.strokeStyle = '#22170a';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();

        // 5. Пересекающиеся коньки и диагональные стыки скатов
        ctx.strokeStyle = '#2b1c0c';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(cx, h * 0.06);
        ctx.lineTo(cx, h * 0.91);
        ctx.moveTo(w * 0.04, cy);
        ctx.lineTo(w * 0.39, cy);

        ctx.moveTo(w * 0.08, h * 0.30);
        ctx.lineTo(cx, cy);
        ctx.moveTo(w * 0.35, h * 0.30);
        ctx.lineTo(cx, cy);
        ctx.moveTo(w * 0.08, h * 0.65);
        ctx.lineTo(cx, cy);
        ctx.moveTo(w * 0.35, h * 0.65);
        ctx.lineTo(cx, cy);
        ctx.stroke();

        // 6. Квадратный каменный дымоход в нижней левой части крыши
        ctx.fillStyle = '#8c8880';
        ctx.strokeStyle = '#171512';
        ctx.lineWidth = 1.4;
        ctx.fillRect(w * 0.12, h * 0.74, 8, 9);
        ctx.strokeRect(w * 0.12, h * 0.74, 8, 9);

        ctx.fillStyle = '#171512';
        ctx.fillRect(w * 0.14, h * 0.76, 4, 5);
    },

    secure_warehouse(ctx, w, h) {
        // 1. Фон травянистого участка и лёгкая вытоптанная дорожка снизу по центру
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(130, 125, 102, 0.42)';
        ctx.fillRect(w * 0.43, h * 0.85, w * 0.14, h * 0.15);

        // 2. Основной прямоугольный корпус защищённого склада
        const rx = w * 0.055;
        const ry = h * 0.11;
        const rw = w * 0.89;
        const rh = h * 0.78;

        // Тень от здания
        ctx.fillStyle = 'rgba(16, 16, 18, 0.56)';
        ctx.fillRect(rx + 2.5, ry + 3.5, rw, rh);

        // Плоская серо-бежевая каменная крыша с пятнами выветривания
        const roofGrad = ctx.createLinearGradient(rx, ry, rx + rw, ry + rh);
        roofGrad.addColorStop(0, '#9c968b');
        roofGrad.addColorStop(0.5, '#8c867c');
        roofGrad.addColorStop(1, '#706b62');
        ctx.fillStyle = roofGrad;
        ctx.fillRect(rx, ry, rw, rh);

        // Текстура каменных плит и потёртостей на крыше
        ctx.fillStyle = 'rgba(42, 38, 34, 0.14)';
        for (let i = 0; i < 28; i++) {
            const px = rx + 12 + ((i * 37) % (rw - 24));
            const py = ry + 10 + ((i * 23) % (rh - 20));
            ctx.beginPath();
            ctx.ellipse(px, py, 8 + (i % 5), 4 + (i % 3), (i % 4) * 0.4, 0, Math.PI * 2);
            ctx.fill();
        }

        // 3. Внешний и внутренний контуры толстого каменного парапета
        const wallThick = 6;
        ctx.strokeStyle = '#1c1d1f';
        ctx.lineWidth = 2.2;
        ctx.strokeRect(rx, ry, rw, rh);

        ctx.strokeStyle = '#5c5a55';
        ctx.lineWidth = wallThick;
        ctx.strokeRect(rx + wallThick / 2, ry + wallThick / 2, rw - wallThick, rh - wallThick);

        // Внутренняя граница парапета и насечки каменных блоков
        ctx.strokeStyle = '#242528';
        ctx.lineWidth = 1.4;
        ctx.strokeRect(rx + wallThick, ry + wallThick, rw - wallThick * 2, rh - wallThick * 2);

        ctx.setLineDash([2.5, 4.5]);
        ctx.strokeStyle = '#9e9b93';
        ctx.lineWidth = 2.0;
        ctx.strokeRect(rx + wallThick / 2, ry + wallThick / 2, rw - wallThick, rh - wallThick);
        ctx.setLineDash([]);

        // 4. Угловая квадратная сторожевая башня в левом верхнем углу
        const tSize = 16;
        const tx = rx - 2.5;
        const ty = ry - 2.5;

        ctx.fillStyle = 'rgba(16, 16, 18, 0.56)';
        ctx.fillRect(tx + 2, ty + 2.5, tSize, tSize);

        ctx.fillStyle = '#9e988e';
        ctx.strokeStyle = '#181a1d';
        ctx.lineWidth = 2.2;
        ctx.fillRect(tx, ty, tSize, tSize);
        ctx.strokeRect(tx, ty, tSize, tSize);

        // Зубчатый парапет на угловой башне
        ctx.setLineDash([2.0, 2.0]);
        ctx.strokeStyle = '#c4bfb6';
        ctx.lineWidth = 1.3;
        ctx.strokeRect(tx + 1.5, ty + 1.5, tSize - 3, tSize - 3);
        ctx.setLineDash([]);

        // Деревянный люк в центре башни
        const tCx = tx + tSize / 2;
        const tCy = ty + tSize / 2;
        ctx.fillStyle = '#85623d';
        ctx.strokeStyle = '#1f160d';
        ctx.lineWidth = 1.1;
        ctx.fillRect(tCx - 3, tCy - 3, 6, 6);
        ctx.strokeRect(tCx - 3, tCy - 3, 6, 6);
    },



    theater(ctx, w, h) {
        this._drawTheaterBase(ctx, w, h, false);
    },

    opera_house(ctx, w, h) {
        this._drawTheaterBase(ctx, w, h, true);
    },

    _drawTheaterBase(ctx, w, h, hasDome) {
        // 1. Фон травянистого участка и парадная мощёная площадь снизу по центру
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(218, 212, 174, 0.55)';
        ctx.fillRect(w * 0.40, h * 0.65, w * 0.20, h * 0.35);

        ctx.fillStyle = 'rgba(118, 116, 108, 0.76)';
        for (let y = h * 0.68; y < h - 1; y += 4.5) {
            for (let dx = -15; dx <= 13; dx += 5) {
                const shift = (Math.floor(y / 4.5) % 2) * 2;
                ctx.beginPath();
                ctx.roundRect(w * 0.50 + dx + shift, y, 4.0, 3.4, 1);
                ctx.fill();
            }
        }

        // 2. Реквизит и ящики у северной стены
        const drawCrate = (x, y, cw, ch, color = '#6b5e4c') => {
            ctx.fillStyle = color;
            ctx.strokeStyle = '#1c1812';
            ctx.lineWidth = 1.2;
            ctx.fillRect(w * x, h * y, cw, ch);
            ctx.strokeRect(w * x, h * y, cw, ch);
        };
        drawCrate(0.39, 0.13, 8, 8, '#5c5346');
        drawCrate(0.45, 0.08, 6, 7, '#756a5a');
        drawCrate(0.57, 0.12, 8, 8, '#856e4c');
        drawCrate(0.62, 0.12, 5, 7, '#5c5346');

        // 3. Два треугольных козырька-портала снизу по бокам от парадного входа
        ctx.fillStyle = '#47433e';
        ctx.strokeStyle = '#171512';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(w * 0.355, h * 0.69);
        ctx.lineTo(w * 0.455, h * 0.69);
        ctx.lineTo(w * 0.355, h * 0.87);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(w * 0.645, h * 0.69);
        ctx.lineTo(w * 0.545, h * 0.69);
        ctx.lineTo(w * 0.645, h * 0.87);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 4. Внешний двухкрестовый контур здания
        const pts = [
            { x: w * 0.07, y: h * 0.25 },
            { x: w * 0.13, y: h * 0.25 },
            { x: w * 0.13, y: h * 0.07 },
            { x: w * 0.355, y: h * 0.07 },
            { x: w * 0.355, y: h * 0.25 },
            { x: w * 0.645, y: h * 0.25 },
            { x: w * 0.645, y: h * 0.07 },
            { x: w * 0.87, y: h * 0.07 },
            { x: w * 0.87, y: h * 0.25 },
            { x: w * 0.93, y: h * 0.25 },
            { x: w * 0.93, y: h * 0.69 },
            { x: w * 0.87, y: h * 0.69 },
            { x: w * 0.87, y: h * 0.88 },
            { x: w * 0.645, y: h * 0.88 },
            { x: w * 0.645, y: h * 0.69 },
            { x: w * 0.355, y: h * 0.69 },
            { x: w * 0.355, y: h * 0.88 },
            { x: w * 0.13, y: h * 0.88 },
            { x: w * 0.13, y: h * 0.69 },
            { x: w * 0.07, y: h * 0.69 }
        ];

        ctx.save();
        ctx.translate(2.5, 3.5);
        ctx.fillStyle = 'rgba(18, 14, 10, 0.55)';
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 5. Многоскатная двухцветная черепичная крыша
        const midY = h * 0.47;
        const lWingX = w * 0.242;
        const rWingX = w * 0.758;

        ctx.save();
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.clip();

        ctx.fillStyle = '#8c4e24';
        ctx.fillRect(0, 0, w, h);

        // Светло-песочные верхние и левые скаты
        ctx.fillStyle = '#cbb996';
        ctx.fillRect(w * 0.13, h * 0.07, w * 0.112, h * 0.81);
        ctx.fillRect(w * 0.645, h * 0.07, w * 0.113, h * 0.81);
        ctx.fillRect(w * 0.07, h * 0.25, w * 0.86, h * 0.22);

        // Тёмные медно-коричневые правые и нижние скаты
        ctx.fillStyle = '#995526';
        ctx.fillRect(lWingX, h * 0.07, w * 0.113, h * 0.81);
        ctx.fillRect(rWingX, h * 0.07, w * 0.112, h * 0.81);

        ctx.fillStyle = '#6e3916';
        ctx.fillRect(w * 0.07, midY, w * 0.86, h * 0.22);

        // Мелкая фактура черепицы
        ctx.strokeStyle = 'rgba(28, 14, 6, 0.34)';
        ctx.lineWidth = 0.9;
        for (let y = h * 0.09; y < h * 0.87; y += 4.5) {
            const shift = (Math.floor(y / 4.5) % 2) * 2.5;
            for (let x = w * 0.08; x < w * 0.92; x += 5) {
                ctx.strokeRect(x + shift, y, 4.5, 4);
            }
        }
        ctx.restore();

        // Внешний контур крыши
        ctx.strokeStyle = '#221308';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();

        // 6. Коньки крыльев, диагональные стыки и два каменных дымохода
        ctx.strokeStyle = '#241408';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(lWingX, h * 0.05);
        ctx.lineTo(lWingX, h * 0.90);
        ctx.moveTo(rWingX, h * 0.05);
        ctx.lineTo(rWingX, h * 0.90);

        ctx.moveTo(w * 0.13, h * 0.25);
        ctx.lineTo(lWingX, midY);
        ctx.moveTo(w * 0.355, h * 0.25);
        ctx.lineTo(lWingX, midY);
        ctx.moveTo(w * 0.13, h * 0.69);
        ctx.lineTo(lWingX, midY);
        ctx.moveTo(w * 0.355, h * 0.69);
        ctx.lineTo(lWingX, midY);

        ctx.moveTo(w * 0.645, h * 0.25);
        ctx.lineTo(rWingX, midY);
        ctx.moveTo(w * 0.87, h * 0.25);
        ctx.lineTo(rWingX, midY);
        ctx.moveTo(w * 0.645, h * 0.69);
        ctx.lineTo(rWingX, midY);
        ctx.moveTo(w * 0.87, h * 0.69);
        ctx.lineTo(rWingX, midY);
        ctx.stroke();

        // Главный сквозной горизонтальный конёк
        ctx.fillStyle = '#7c5334';
        ctx.strokeStyle = '#1f1208';
        ctx.lineWidth = 1.4;
        ctx.fillRect(w * 0.06, midY - 2.0, w * 0.88, 4.0);
        ctx.strokeRect(w * 0.06, midY - 2.0, w * 0.88, 4.0);

        // Два каменных дымохода на горизонтальном коньке
        [0.242, 0.758].forEach(cx => {
            ctx.fillStyle = '#8c8881';
            ctx.strokeStyle = '#171512';
            ctx.lineWidth = 1.4;
            ctx.fillRect(w * cx - 5, midY - 3.5, 10, 7);
            ctx.strokeRect(w * cx - 5, midY - 3.5, 10, 7);

            ctx.fillStyle = '#171512';
            ctx.fillRect(w * cx - 3, midY - 1.8, 6, 3.6);
        });

        // 7. Круглый купол (только для Opera House)
        if (hasDome) {
            const domeX = w * 0.50;
            const domeY = h * 0.47;
            const domeR = h * 0.31;

            ctx.fillStyle = 'rgba(18, 16, 14, 0.55)';
            ctx.beginPath();
            ctx.arc(domeX + 2.5, domeY + 3.5, domeR + 1, 0, Math.PI * 2);
            ctx.fill();

            const domeGrad = ctx.createRadialGradient(domeX - 6, domeY - 8, 3, domeX, domeY, domeR);
            domeGrad.addColorStop(0, '#c4bdb2');
            domeGrad.addColorStop(0.65, '#8f887d');
            domeGrad.addColorStop(1, '#5c564e');

            ctx.fillStyle = domeGrad;
            ctx.strokeStyle = '#1f1c18';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.arc(domeX, domeY, domeR, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.strokeStyle = 'rgba(34, 30, 26, 0.52)';
            ctx.lineWidth = 1.1;
            for (let i = 0; i < 16; i++) {
                const ang = (Math.PI * 2 / 16) * i;
                ctx.beginPath();
                ctx.moveTo(domeX, domeY);
                ctx.lineTo(domeX + Math.cos(ang) * domeR, domeY + Math.sin(ang) * domeR);
                ctx.stroke();
            }

            ctx.fillStyle = '#eab308';
            ctx.strokeStyle = '#1f1608';
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.arc(domeX, domeY, 3.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
    },




    noble_villa(ctx, w, h) {
        // 1. Фон травянистого участка, внутреннего сада и южного проезда
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#b2ba7a');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(218, 212, 174, 0.45)';
        ctx.fillRect(w * 0.43, h * 0.65, w * 0.14, h * 0.35);

        // 2. Пышные садовые деревья и кусты в левом и правом двориках
        const drawGardenCluster = (cx, cy, r) => {
            ctx.fillStyle = 'rgba(15, 22, 10, 0.42)';
            ctx.beginPath();
            ctx.arc(w * cx + 1.5, h * cy + 2, r, 0, Math.PI * 2);
            ctx.fill();

            const g = ctx.createRadialGradient(w * cx - 2, h * cy - 2, 1, w * cx, h * cy, r);
            g.addColorStop(0, '#5a752e');
            g.addColorStop(0.7, '#384d1b');
            g.addColorStop(1, '#1e2b0d');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(w * cx, h * cy, r, 0, Math.PI * 2);
            ctx.fill();
        };

        [
            [0.19, 0.45, 7], [0.24, 0.56, 8], [0.30, 0.48, 7.5], [0.34, 0.60, 6.5],
            [0.68, 0.58, 7], [0.73, 0.47, 8], [0.79, 0.55, 7.5], [0.83, 0.44, 6]
        ].forEach(([x, y, r]) => drawGardenCluster(x, y, r));

        // 3. Круглый каменный фонтан с голубой водой в центре двора
        const fx = w * 0.50;
        const fy = h * 0.66;
        ctx.fillStyle = 'rgba(18, 22, 14, 0.48)';
        ctx.beginPath();
        ctx.arc(fx + 1.2, fy + 1.5, 6.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#474642';
        ctx.strokeStyle = '#171614';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(fx, fy, 6.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(fx, fy, 3.8, 0, Math.PI * 2);
        ctx.fill();

        // 4. Крытые галереи по периметру виллы (с зубчатым каменным обрамлением)
        const gL = w * 0.085;
        const gR = w * 0.915;
        const gT = h * 0.16;
        const gB = h * 0.84;
        const gThick = 11;

        ctx.strokeStyle = 'rgba(18, 15, 10, 0.50)';
        ctx.lineWidth = gThick + 3;
        ctx.strokeRect(gL + 2, gT + 3, gR - gL, gB - gT);

        // Внешний каменный парапет галерей
        ctx.strokeStyle = '#222426';
        ctx.lineWidth = gThick + 2;
        ctx.strokeRect(gL, gT, gR - gL, gB - gT);

        ctx.setLineDash([2.2, 2.2]);
        ctx.strokeStyle = '#8b9098';
        ctx.lineWidth = gThick;
        ctx.strokeRect(gL, gT, gR - gL, gB - gT);
        ctx.setLineDash([]);

        // Внутренняя черепичная крыша галерей и гребень конька
        ctx.strokeStyle = '#8c6238';
        ctx.lineWidth = gThick - 4;
        ctx.strokeRect(gL, gT, gR - gL, gB - gT);

        ctx.strokeStyle = '#2b1b0c';
        ctx.lineWidth = 1.4;
        ctx.strokeRect(gL, gT, gR - gL, gB - gT);

        // Булыжный проезд снизу по центру между надвратными башнями
        ctx.fillStyle = '#73767d';
        ctx.fillRect(w * 0.42, gB - gThick / 2, w * 0.16, gThick);

        // 5. Главный северный каменный корпус с двумя полукруглыми бастионами
        const drawNorthManor = () => {
            ctx.beginPath();
            ctx.moveTo(w * 0.34, h * 0.10);
            ctx.lineTo(w * 0.66, h * 0.10);
            ctx.lineTo(w * 0.66, h * 0.46);
            ctx.arc(w * 0.595, h * 0.46, w * 0.065, 0, Math.PI, false);
            ctx.lineTo(w * 0.47, h * 0.42);
            ctx.arc(w * 0.405, h * 0.46, w * 0.065, 0, Math.PI, false);
            ctx.closePath();
        };

        ctx.save();
        ctx.translate(2, 3);
        ctx.fillStyle = 'rgba(16, 16, 18, 0.55)';
        drawNorthManor();
        ctx.fill();
        ctx.restore();

        // Булыжная кладка на крыше северного корпуса
        ctx.save();
        drawNorthManor();
        ctx.fillStyle = '#8b9098';
        ctx.fill();
        ctx.clip();

        for (let y = h * 0.10; y < h * 0.62; y += 4.2) {
            const shift = (Math.floor(y / 4.2) % 2) * 2.4;
            for (let x = w * 0.33; x < w * 0.67; x += 4.8) {
                ctx.fillStyle = ((Math.floor(x + y)) % 3 === 0) ? '#b4b9c2' : '#737880';
                ctx.strokeStyle = '#24272c';
                ctx.lineWidth = 0.7;
                ctx.beginPath();
                ctx.roundRect(x + shift, y, 4.0, 3.4, 1);
                ctx.fill();
                ctx.stroke();
            }
        }
        ctx.restore();

        ctx.strokeStyle = '#181a1d';
        ctx.lineWidth = 2.6;
        drawNorthManor();
        ctx.stroke();

        ctx.setLineDash([2.2, 2.2]);
        ctx.strokeStyle = '#a3a8b0';
        ctx.lineWidth = 1.4;
        drawNorthManor();
        ctx.stroke();
        ctx.setLineDash([]);

        // 6. Семь квадратных шатровых башенок с пирамидальной крышей и шпилем
        const drawPavilionTower = (cx, cy, size) => {
            const tx = cx - size / 2;
            const ty = cy - size / 2;

            ctx.fillStyle = 'rgba(18, 14, 10, 0.56)';
            ctx.fillRect(tx + 2, ty + 2.5, size, size);

            // Четыре треугольных ската шатровой крыши
            const topC = '#c99e63';
            const leftC = '#ab7d44';
            const rightC = '#755024';
            const botC = '#543714';

            const drawTri = (x1, y1, x2, y2, fill) => {
                ctx.fillStyle = fill;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.closePath();
                ctx.fill();
            };

            drawTri(tx, ty, tx + size, ty, topC);
            drawTri(tx, ty, tx, ty + size, leftC);
            drawTri(tx + size, ty, tx + size, ty + size, rightC);
            drawTri(tx, ty + size, tx + size, ty + size, botC);

            // Контур и диагональные рёбра пирамиды
            ctx.strokeStyle = '#1f1408';
            ctx.lineWidth = 1.6;
            ctx.strokeRect(tx, ty, size, size);

            ctx.strokeStyle = 'rgba(31, 20, 8, 0.55)';
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(tx + size, ty + size);
            ctx.moveTo(tx + size, ty);
            ctx.lineTo(tx, ty + size);
            ctx.stroke();

            // Тёмный шпиль на вершине
            ctx.fillStyle = '#1f1408';
            ctx.beginPath();
            ctx.arc(cx, cy, 2.2, 0, Math.PI * 2);
            ctx.fill();
        };

        // 4 угловые башни, 2 нижние надвратные и 1 центральная северная башня
        drawPavilionTower(gL, gT, 18);
        drawPavilionTower(gR, gT, 18);
        drawPavilionTower(gL, gB, 18);
        drawPavilionTower(gR, gB, 18);
        drawPavilionTower(w * 0.36, gB, 18);
        drawPavilionTower(w * 0.64, gB, 18);
        drawPavilionTower(w * 0.50, h * 0.25, 17);
    },

    military_academy(ctx, w, h) {
        // 1. Фон травянистого участка и открытого плаца внизу
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // 2. Мощёная булыжником дорога по центру открытого двора
        ctx.fillStyle = 'rgba(118, 116, 108, 0.78)';
        for (let y = h * 0.54; y < h - 1; y += 4.6) {
            for (let dx = -10; dx <= 8; dx += 5) {
                const shift = (Math.floor(y / 4.6) % 2) * 2;
                ctx.beginPath();
                ctx.roundRect(w * 0.49 + dx + shift, y, 4.0, 3.4, 1);
                ctx.fill();
            }
        }

        // 3. Левый и правый боковые корпуса военной академии (серо-голубой сланец)
        const drawSideWing = (x, y, bw, bh, ridgeX) => {
            ctx.fillStyle = 'rgba(14, 18, 22, 0.56)';
            ctx.fillRect(x + 2.5, y + 3.5, bw, bh);

            const grad = ctx.createLinearGradient(x, 0, x + bw, 0);
            grad.addColorStop(0, '#6e7c85');
            grad.addColorStop(0.48, '#8a99a3');
            grad.addColorStop(0.52, '#47535c');
            grad.addColorStop(1, '#2b343b');
            ctx.fillStyle = grad;
            ctx.fillRect(x, y, bw, bh);

            // Текстура сланцевой черепицы
            ctx.strokeStyle = 'rgba(16, 22, 28, 0.34)';
            ctx.lineWidth = 0.9;
            for (let ty = y + 3; ty < y + bh - 2; ty += 4.5) {
                const shift = (Math.floor(ty / 4.5) % 2) * 2.5;
                for (let tx = x + 2; tx < x + bw - 3; tx += 5) {
                    ctx.strokeRect(tx + shift, ty, 4.5, 4);
                }
            }

            ctx.strokeStyle = '#14191d';
            ctx.lineWidth = 2.0;
            ctx.strokeRect(x, y, bw, bh);

            // Вертикальный конёк и каменный дымоход
            ctx.strokeStyle = '#1b2228';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(ridgeX, y - 2);
            ctx.lineTo(ridgeX, y + bh + 2);
            ctx.stroke();

            ctx.fillStyle = '#5c6369';
            ctx.strokeStyle = '#121518';
            ctx.lineWidth = 1.4;
            ctx.fillRect(ridgeX - 3.5, h * 0.31, 7, 11);
            ctx.strokeRect(ridgeX - 3.5, h * 0.31, 7, 11);

            ctx.fillStyle = '#121518';
            ctx.fillRect(ridgeX - 1.5, h * 0.34, 3, 5);
        };

        drawSideWing(w * 0.04, h * 0.08, w * 0.27, h * 0.83, w * 0.175);
        drawSideWing(w * 0.69, h * 0.08, w * 0.27, h * 0.83, w * 0.825);

        // 4. Центральный П-образный корпус над зелёным плацем
        const midPts = [
            { x: w * 0.31, y: h * 0.08 },
            { x: w * 0.69, y: h * 0.08 },
            { x: w * 0.69, y: h * 0.77 },
            { x: w * 0.58, y: h * 0.77 },
            { x: w * 0.58, y: h * 0.54 },
            { x: w * 0.42, y: h * 0.54 },
            { x: w * 0.42, y: h * 0.77 },
            { x: w * 0.31, y: h * 0.77 }
        ];

        ctx.save();
        ctx.translate(2, 3);
        ctx.fillStyle = 'rgba(14, 18, 22, 0.55)';
        ctx.beginPath();
        midPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        midPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();

        const midGrad = ctx.createLinearGradient(0, h * 0.08, 0, h * 0.77);
        midGrad.addColorStop(0, '#788791');
        midGrad.addColorStop(0.42, '#53616b');
        midGrad.addColorStop(1, '#313b42');
        ctx.fillStyle = midGrad;
        ctx.fill();
        ctx.clip();

        ctx.strokeStyle = 'rgba(16, 22, 28, 0.34)';
        ctx.lineWidth = 0.9;
        for (let y = h * 0.10; y < h * 0.76; y += 4.5) {
            const shift = (Math.floor(y / 4.5) % 2) * 2.5;
            for (let x = w * 0.32; x < w * 0.68; x += 5) {
                ctx.strokeRect(x + shift, y, 4.5, 4);
            }
        }
        ctx.restore();

        ctx.strokeStyle = '#14191d';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        midPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();

        // Скошенный П-образный гребень конька в центре
        ctx.strokeStyle = '#1b2228';
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(w * 0.365, h * 0.77);
        ctx.lineTo(w * 0.365, h * 0.36);
        ctx.lineTo(w * 0.40, h * 0.30);
        ctx.lineTo(w * 0.60, h * 0.30);
        ctx.lineTo(w * 0.635, h * 0.36);
        ctx.lineTo(w * 0.635, h * 0.77);

        ctx.moveTo(w * 0.31, h * 0.08);
        ctx.lineTo(w * 0.40, h * 0.30);
        ctx.moveTo(w * 0.69, h * 0.08);
        ctx.lineTo(w * 0.60, h * 0.30);
        ctx.moveTo(w * 0.42, h * 0.54);
        ctx.lineTo(w * 0.365, h * 0.36);
        ctx.moveTo(w * 0.58, h * 0.54);
        ctx.lineTo(w * 0.635, h * 0.36);
        ctx.stroke();
    },

    marketplace(ctx, w, h) {
        // 1. Фон рыночной площади с вытоптанной землёй в центре
        const bgGrad = ctx.createRadialGradient(w * 0.45, h * 0.5, w * 0.1, w * 0.5, h * 0.5, w * 0.65);
        bgGrad.addColorStop(0, '#c7c29b');
        bgGrad.addColorStop(0.6, '#a4ac6e');
        bgGrad.addColorStop(1, '#878f52');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // 2. Сходящиеся в центре мощёные булыжником дорожки
        ctx.fillStyle = 'rgba(118, 116, 108, 0.72)';
        const drawCobblePath = (x1, y1, x2, y2, spread = 6) => {
            const steps = 14;
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const px = w * (x1 + (x2 - x1) * t);
                const py = h * (y1 + (y2 - y1) * t);
                for (let k = -1; k <= 1; k++) {
                    const ox = ((i * 7 + k * 5) % spread) - spread / 2;
                    const oy = ((i * 3 + k * 9) % spread) - spread / 2;
                    ctx.beginPath();
                    ctx.roundRect(px + ox, py + oy, 3.6, 3.0, 1);
                    ctx.fill();
                }
            }
        };

        drawCobblePath(0.35, 0.02, 0.50, 0.48, 8);
        drawCobblePath(0.50, 0.48, 0.38, 0.98, 8);
        drawCobblePath(0.50, 0.48, 0.68, 0.18, 7);
        drawCobblePath(0.50, 0.48, 0.78, 0.52, 9);

        // 3. Центральный круглый каменный фонтан/колодец с голубой водой
        const fx = w * 0.50;
        const fy = h * 0.48;
        ctx.fillStyle = 'rgba(18, 22, 14, 0.48)';
        ctx.beginPath();
        ctx.arc(fx + 1.5, fy + 2, 7.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#5c5850';
        ctx.strokeStyle = '#1f1e1b';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(fx, fy, 6.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(fx, fy, 4.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#bae6fd';
        ctx.beginPath();
        ctx.arc(fx - 1, fy - 1, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // 4. Торговые прилавки, палатки и навесы вокруг рыночной площади
        const drawStall = (x, y, sw, sh, angle, color) => {
            ctx.save();
            ctx.translate(w * x, h * y);
            ctx.rotate(angle);

            ctx.fillStyle = 'rgba(18, 15, 10, 0.46)';
            ctx.fillRect(-sw / 2 + 1.8, -sh / 2 + 2.2, sw, sh);

            ctx.fillStyle = color;
            ctx.strokeStyle = '#1f1810';
            ctx.lineWidth = 1.3;
            ctx.fillRect(-sw / 2, -sh / 2, sw, sh);
            ctx.strokeRect(-sw / 2, -sh / 2, sw, sh);

            // Конёк или поперечная балка навеса
            ctx.strokeStyle = 'rgba(28, 20, 12, 0.55)';
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            if (sw >= sh) {
                ctx.moveTo(-sw / 2, 0);
                ctx.lineTo(sw / 2, 0);
            } else {
                ctx.moveTo(0, -sh / 2);
                ctx.lineTo(0, sh / 2);
            }
            ctx.stroke();
            ctx.restore();
        };

        const stalls = [
            // Левая дуга лавок
            [0.24, 0.14, 15, 9, 0.05, '#9c6e44'],
            [0.14, 0.25, 14, 7, -0.68, '#b56528'],
            [0.08, 0.37, 9, 13, 0.15, '#8c623d'],
            [0.06, 0.52, 7, 13, -0.05, '#78736a'],
            [0.07, 0.67, 8, 13, -0.15, '#a8a296'],
            [0.10, 0.80, 11, 10, 0.65, '#8c623d'],
            [0.20, 0.88, 15, 9, 0.08, '#9c6e44'],
            // Нижняя центральная дуга
            [0.30, 0.86, 17, 11, 0.0, '#b5ada0'],
            [0.45, 0.83, 14, 9, -0.52, '#755334'],
            [0.54, 0.78, 13, 9, 0.28, '#9c7854'],
            // Верхняя центральная группа
            [0.45, 0.09, 10, 7, 0.05, '#78736a'],
            [0.49, 0.21, 16, 10, 0.0, '#969186'],
            // Правая дуга лавок и шатров
            [0.75, 0.11, 13, 8, 0.35, '#6b5e4c'],
            [0.86, 0.15, 11, 9, 0.45, '#5c5346'],
            [0.92, 0.28, 12, 9, 0.62, '#7c5334'],
            [0.82, 0.30, 12, 9, 0.05, '#9a3412'],
            [0.91, 0.43, 11, 9, 0.25, '#855834'],
            [0.88, 0.57, 13, 9, -0.45, '#755334'],
            [0.84, 0.71, 14, 11, -0.52, '#8c623d'],
            [0.74, 0.77, 16, 12, -0.48, '#9c6e44'],
            [0.68, 0.29, 9, 8, 0.1, '#78736a']
        ];

        stalls.forEach(s => drawStall(...s));

        // 5. Кучки бочек и тюков возле шатров
        const barrels = [
            [0.14, 0.74], [0.16, 0.78], [0.64, 0.78], [0.67, 0.82], [0.63, 0.84], [0.66, 0.87]
        ];
        barrels.forEach(([bx, by]) => {
            ctx.fillStyle = '#47423b';
            ctx.strokeStyle = '#171512';
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, 3.0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });
    },

    lumberyard(ctx, w, h) {
        // 1. Фон травянистого участка и сквозная мощёная дорога во дворе
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(118, 116, 108, 0.72)';
        for (let x = w * 0.28; x < w - 1; x += 4.8) {
            for (let dy = -6; dy <= 5; dy += 4.5) {
                const shift = (Math.floor(x / 4.8) % 2) * 2;
                ctx.beginPath();
                ctx.roundRect(x, h * 0.49 + dy + shift, 3.8, 3.2, 1);
                ctx.fill();
            }
        }

        // 2. Деревянный забор вокруг правого складского двора со столбами и воротами справа
        const fL = w * 0.37;
        const fR = w * 0.96;
        const fT = h * 0.12;
        const fB = h * 0.87;

        ctx.strokeStyle = '#24180c';
        ctx.lineWidth = 3.4;
        ctx.beginPath();
        ctx.moveTo(fL, fT);
        ctx.lineTo(fR, fT);
        ctx.lineTo(fR, h * 0.42);
        ctx.moveTo(fR, h * 0.56);
        ctx.lineTo(fR, fB);
        ctx.lineTo(fL, fB);
        ctx.stroke();

        ctx.strokeStyle = '#755330';
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Опорные столбики забора
        const posts = [
            [0.49, 0.12], [0.61, 0.12], [0.73, 0.12], [0.85, 0.12], [0.96, 0.12],
            [0.96, 0.42], [0.96, 0.56], [0.96, 0.87],
            [0.49, 0.87], [0.61, 0.87], [0.73, 0.87], [0.85, 0.87]
        ];
        posts.forEach(([px, py]) => {
            ctx.fillStyle = '#5c3f22';
            ctx.strokeStyle = '#1f140a';
            ctx.lineWidth = 1.1;
            ctx.fillRect(w * px - 2.3, h * py - 2.3, 4.6, 4.6);
            ctx.strokeRect(w * px - 2.3, h * py - 2.3, 4.6, 4.6);
        });

        // 3. Штабеля досок (светлые) и поленницы брёвен (тёмно-рыжие) во дворе
        const drawPlankStack = (sx, sy) => {
            const planks = [
                [0, 0, 26, 3.5], [2, 4.5, 29, 3.5], [-1, 9, 24, 3.5], [3, 13.5, 28, 3.5]
            ];
            planks.forEach(([dx, dy, pw, ph]) => {
                ctx.fillStyle = '#b59c72';
                ctx.strokeStyle = '#291e12';
                ctx.lineWidth = 1.0;
                ctx.fillRect(w * sx + dx, h * sy + dy, pw, ph);
                ctx.strokeRect(w * sx + dx, h * sy + dy, pw, ph);
            });
        };

        drawPlankStack(0.45, 0.16);
        drawPlankStack(0.45, 0.65);

        const drawLogPile = (lx, ly) => {
            const logs = [
                [2, 0, 32, 4.2], [-2, 4.5, 36, 4.5], [1, 9.5, 34, 4.5], [-1, 14.5, 31, 4.2]
            ];
            logs.forEach(([dx, dy, lw, lh]) => {
                const x = w * lx + dx;
                const y = h * ly + dy;
                ctx.fillStyle = '#7c2d12';
                ctx.strokeStyle = '#1f0d06';
                ctx.lineWidth = 1.1;
                ctx.beginPath();
                ctx.moveTo(x + 3, y);
                ctx.lineTo(x + lw - 3, y);
                ctx.lineTo(x + lw, y + lh / 2);
                ctx.lineTo(x + lw - 3, y + lh);
                ctx.lineTo(x + 3, y + lh);
                ctx.lineTo(x, y + lh / 2);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Светлые заострённые спилы на концах брёвен
                ctx.fillStyle = '#d6c7a9';
                ctx.fillRect(x + 1, y + 1, 2.5, lh - 2);
                ctx.fillRect(x + lw - 3.5, y + 1, 2.5, lh - 2);
            });
        };

        drawLogPile(0.69, 0.17);
        drawLogPile(0.69, 0.64);

        // 4. Бочки и ящик у внутренних стен лесопилки
        [
            [0.395, 0.21], [0.395, 0.72], [0.395, 0.82]
        ].forEach(([bx, by]) => {
            ctx.fillStyle = '#3b3730';
            ctx.strokeStyle = '#141210';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, 3.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });

        ctx.save();
        ctx.translate(w * 0.31, h * 0.36);
        ctx.rotate(0.28);
        ctx.fillStyle = '#635644';
        ctx.strokeStyle = '#1c1812';
        ctx.lineWidth = 1.2;
        ctx.fillRect(-4, -5, 8, 10);
        ctx.strokeRect(-4, -5, 8, 10);
        ctx.restore();

        // 5. П-образное здание лесопилки в левой части участка
        const pts = [
            { x: w * 0.06, y: h * 0.08 },
            { x: w * 0.37, y: h * 0.08 },
            { x: w * 0.37, y: h * 0.29 },
            { x: w * 0.27, y: h * 0.29 },
            { x: w * 0.27, y: h * 0.70 },
            { x: w * 0.37, y: h * 0.70 },
            { x: w * 0.37, y: h * 0.90 },
            { x: w * 0.06, y: h * 0.90 }
        ];

        ctx.save();
        ctx.translate(2.5, 3.5);
        ctx.fillStyle = 'rgba(18, 14, 10, 0.55)';
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        const roofGrad = ctx.createLinearGradient(w * 0.06, h * 0.08, w * 0.37, h * 0.90);
        roofGrad.addColorStop(0, '#9e663d');
        roofGrad.addColorStop(0.5, '#784826');
        roofGrad.addColorStop(1, '#4f2c14');
        ctx.fillStyle = roofGrad;
        ctx.strokeStyle = '#1f1208';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Конёк крыши со скошенными углами и каменный дымоход
        ctx.strokeStyle = '#261509';
        ctx.lineWidth = 2.2;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(w * 0.37, h * 0.185);
        ctx.lineTo(w * 0.195, h * 0.185);
        ctx.lineTo(w * 0.165, h * 0.24);
        ctx.lineTo(w * 0.165, h * 0.75);
        ctx.lineTo(w * 0.195, h * 0.80);
        ctx.lineTo(w * 0.37, h * 0.80);

        ctx.moveTo(w * 0.06, h * 0.08);
        ctx.lineTo(w * 0.165, h * 0.24);
        ctx.moveTo(w * 0.06, h * 0.90);
        ctx.lineTo(w * 0.165, h * 0.75);
        ctx.moveTo(w * 0.27, h * 0.29);
        ctx.lineTo(w * 0.195, h * 0.185);
        ctx.moveTo(w * 0.27, h * 0.70);
        ctx.lineTo(w * 0.195, h * 0.80);
        ctx.stroke();

        ctx.fillStyle = '#6e6a64';
        ctx.strokeStyle = '#171512';
        ctx.lineWidth = 1.4;
        ctx.fillRect(w * 0.125, h * 0.43, 6, 11);
        ctx.strokeRect(w * 0.125, h * 0.43, 6, 11);
    },

    keep(ctx, w, h) {
        // 1. Фон травянистого участка и внутреннего двора
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Мощёная площадка перед донжоном в центре двора
        ctx.fillStyle = 'rgba(118, 116, 108, 0.72)';
        for (let y = h * 0.62; y < h * 0.82; y += 4.5) {
            for (let dx = -16; dx <= 14; dx += 5) {
                const shift = (Math.floor(y / 4.5) % 2) * 2;
                ctx.beginPath();
                ctx.roundRect(w * 0.50 + dx + shift, y, 3.8, 3.2, 1);
                ctx.fill();
            }
        }

        // Хелпер для заливки булыжной кладки внутри прямоугольника
        const fillCobbleRect = (rx, ry, rw, rh) => {
            ctx.save();
            ctx.beginPath();
            ctx.rect(rx, ry, rw, rh);
            ctx.clip();

            ctx.fillStyle = '#8b9098';
            ctx.fillRect(rx, ry, rw, rh);

            for (let y = ry - 2; y < ry + rh + 2; y += 4.2) {
                const shift = (Math.floor(y / 4.2) % 2) * 2.4;
                for (let x = rx - 2; x < rx + rw + 2; x += 4.8) {
                    const tone = ((Math.floor(x + y)) % 3 === 0) ? '#b4b9c2' : (((Math.floor(x)) % 2 === 0) ? '#6e737b' : '#9499a1');
                    ctx.fillStyle = tone;
                    ctx.strokeStyle = '#24272c';
                    ctx.lineWidth = 0.7;
                    ctx.beginPath();
                    ctx.roundRect(x + shift, y, 4.0, 3.4, 1);
                    ctx.fill();
                    ctx.stroke();
                }
            }
            ctx.restore();
        };

        // 2. Внешние крепостные стены с зубчатым парапетом
        const wallL = w * 0.04;
        const wallR = w * 0.96;
        const wallT = h * 0.11;
        const wallB = h * 0.89;
        const thick = 9;

        // Тень от крепостных стен
        ctx.strokeStyle = 'rgba(16, 16, 18, 0.52)';
        ctx.lineWidth = thick + 2;
        ctx.strokeRect(wallL + 2, wallT + 3, wallR - wallL, wallB - wallT);

        // Булыжное полотно стен
        fillCobbleRect(wallL - thick / 2, wallT - thick / 2, wallR - wallL + thick, thick);
        fillCobbleRect(wallL - thick / 2, wallB - thick / 2, wallR - wallL + thick, thick);
        fillCobbleRect(wallL - thick / 2, wallT, thick, wallB - wallT);
        fillCobbleRect(wallR - thick / 2, wallT, thick, wallB - wallT);

        // Зубчатые края стен
        const drawBattlementBox = (bx, by, bw, bh) => {
            ctx.strokeStyle = '#181a1d';
            ctx.lineWidth = 2.6;
            ctx.strokeRect(bx, by, bw, bh);

            ctx.setLineDash([2.2, 2.2]);
            ctx.strokeStyle = '#a3a8b0';
            ctx.lineWidth = 1.4;
            ctx.strokeRect(bx, by, bw, bh);
            ctx.setLineDash([]);
        };

        drawBattlementBox(wallL - thick / 2, wallT - thick / 2, wallR - wallL + thick, thick);
        drawBattlementBox(wallL - thick / 2, wallB - thick / 2, wallR - wallL + thick, thick);
        drawBattlementBox(wallL - thick / 2, wallT, thick, wallB - wallT);
        drawBattlementBox(wallR - thick / 2, wallT, thick, wallB - wallT);

        // 3. Четыре угловые башни и центральная надвратная башня снизу
        const drawTower = (cx, cy, size) => {
            const tx = cx - size / 2;
            const ty = cy - size / 2;

            ctx.fillStyle = 'rgba(16, 16, 18, 0.56)';
            ctx.fillRect(tx + 2, ty + 2.5, size, size);

            fillCobbleRect(tx, ty, size, size);
            drawBattlementBox(tx, ty, size, size);

            // Деревянный люк в центре башни
            ctx.fillStyle = '#855e3c';
            ctx.strokeStyle = '#1f160d';
            ctx.lineWidth = 1.1;
            ctx.fillRect(cx - 2.8, cy - 2.8, 5.6, 5.6);
            ctx.strokeRect(cx - 2.8, cy - 2.8, 5.6, 5.6);
        };

        drawTower(wallL, wallT, 14);
        drawTower(wallR, wallT, 14);
        drawTower(wallL, wallB, 14);
        drawTower(wallR, wallB, 14);
        drawTower(w * 0.50, wallB, 15);

        // 4. Центральный квадратный донжон во дворе
        const kSize = h * 0.36;
        const kx = w * 0.50 - kSize / 2;
        const ky = h * 0.45 - kSize / 2;

        ctx.fillStyle = 'rgba(16, 16, 18, 0.58)';
        ctx.fillRect(kx + 2.5, ky + 3.5, kSize, kSize);

        fillCobbleRect(kx, ky, kSize, kSize);
        drawBattlementBox(kx, ky, kSize, kSize);

        // Центральный деревянный люк и две малые крышки по бокам на крыше донжона
        const kMidY = ky + kSize / 2;
        ctx.fillStyle = '#855e3c';
        ctx.strokeStyle = '#1f160d';
        ctx.lineWidth = 1.3;
        ctx.fillRect(w * 0.50 - 5, kMidY - 5, 10, 10);
        ctx.strokeRect(w * 0.50 - 5, kMidY - 5, 10, 10);

        ctx.beginPath();
        ctx.moveTo(w * 0.50 - 5, kMidY);
        ctx.lineTo(w * 0.50 + 5, kMidY);
        ctx.stroke();

        [-10, 10].forEach(dx => {
            ctx.fillRect(w * 0.50 + dx - 2.2, kMidY - 2.2, 4.4, 4.4);
            ctx.strokeRect(w * 0.50 + dx - 2.2, kMidY - 2.2, 4.4, 4.4);
        });
    },

    hospital(ctx, w, h) {
        // 1. Фон травянистого участка и открытого внутреннего двора
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // 2. Мощёная булыжником дорога по центру открытого двора
        ctx.fillStyle = 'rgba(118, 116, 108, 0.78)';
        for (let y = h * 0.54; y < h - 1; y += 4.6) {
            for (let dx = -10; dx <= 8; dx += 5) {
                const shift = (Math.floor(y / 4.6) % 2) * 2;
                ctx.beginPath();
                ctx.roundRect(w * 0.49 + dx + shift, y, 4.0, 3.4, 1);
                ctx.fill();
            }
        }

        // 3. Левый и правый боковые корпуса госпиталя
        const drawSideWing = (x, y, bw, bh, ridgeX) => {
            ctx.fillStyle = 'rgba(18, 14, 10, 0.56)';
            ctx.fillRect(x + 2.5, y + 3.5, bw, bh);

            const grad = ctx.createLinearGradient(x, 0, x + bw, 0);
            grad.addColorStop(0, '#9e6238');
            grad.addColorStop(0.48, '#ba7949');
            grad.addColorStop(0.52, '#6b3e20');
            grad.addColorStop(1, '#472812');
            ctx.fillStyle = grad;
            ctx.fillRect(x, y, bw, bh);

            // Текстура черепичных плит
            ctx.strokeStyle = 'rgba(28, 14, 6, 0.34)';
            ctx.lineWidth = 0.9;
            for (let ty = y + 3; ty < y + bh - 2; ty += 4.5) {
                const shift = (Math.floor(ty / 4.5) % 2) * 2.5;
                for (let tx = x + 2; tx < x + bw - 3; tx += 5) {
                    ctx.strokeRect(tx + shift, ty, 4.5, 4);
                }
            }

            ctx.strokeStyle = '#1f1208';
            ctx.lineWidth = 2.0;
            ctx.strokeRect(x, y, bw, bh);

            // Вертикальный конёк и каменный дымоход
            ctx.strokeStyle = '#29170a';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(ridgeX, y - 2);
            ctx.lineTo(ridgeX, y + bh + 2);
            ctx.stroke();

            ctx.fillStyle = '#6e6a66';
            ctx.strokeStyle = '#141210';
            ctx.lineWidth = 1.4;
            ctx.fillRect(ridgeX - 3.5, h * 0.31, 7, 11);
            ctx.strokeRect(ridgeX - 3.5, h * 0.31, 7, 11);

            ctx.fillStyle = '#141210';
            ctx.fillRect(ridgeX - 1.5, h * 0.34, 3, 5);
        };

        drawSideWing(w * 0.04, h * 0.08, w * 0.27, h * 0.83, w * 0.175);
        drawSideWing(w * 0.69, h * 0.08, w * 0.27, h * 0.83, w * 0.825);

        // 4. Центральный П-образный корпус над зелёным двором
        const midPts = [
            { x: w * 0.31, y: h * 0.08 },
            { x: w * 0.69, y: h * 0.08 },
            { x: w * 0.69, y: h * 0.77 },
            { x: w * 0.58, y: h * 0.77 },
            { x: w * 0.58, y: h * 0.54 },
            { x: w * 0.42, y: h * 0.54 },
            { x: w * 0.42, y: h * 0.77 },
            { x: w * 0.31, y: h * 0.77 }
        ];

        ctx.save();
        ctx.translate(2, 3);
        ctx.fillStyle = 'rgba(18, 14, 10, 0.55)';
        ctx.beginPath();
        midPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        midPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();

        const midGrad = ctx.createLinearGradient(0, h * 0.08, 0, h * 0.77);
        midGrad.addColorStop(0, '#a86b3e');
        midGrad.addColorStop(0.42, '#7d4a26');
        midGrad.addColorStop(1, '#4f2c14');
        ctx.fillStyle = midGrad;
        ctx.fill();
        ctx.clip();

        ctx.strokeStyle = 'rgba(28, 14, 6, 0.34)';
        ctx.lineWidth = 0.9;
        for (let y = h * 0.10; y < h * 0.76; y += 4.5) {
            const shift = (Math.floor(y / 4.5) % 2) * 2.5;
            for (let x = w * 0.32; x < w * 0.68; x += 5) {
                ctx.strokeRect(x + shift, y, 4.5, 4);
            }
        }
        ctx.restore();

        ctx.strokeStyle = '#1f1208';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        midPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();

        // Скошенный П-образный гребень конька в центре
        ctx.strokeStyle = '#29170a';
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(w * 0.365, h * 0.77);
        ctx.lineTo(w * 0.365, h * 0.36);
        ctx.lineTo(w * 0.40, h * 0.30);
        ctx.lineTo(w * 0.60, h * 0.30);
        ctx.lineTo(w * 0.635, h * 0.36);
        ctx.lineTo(w * 0.635, h * 0.77);

        ctx.moveTo(w * 0.31, h * 0.08);
        ctx.lineTo(w * 0.40, h * 0.30);
        ctx.moveTo(w * 0.69, h * 0.08);
        ctx.lineTo(w * 0.60, h * 0.30);
        ctx.moveTo(w * 0.42, h * 0.54);
        ctx.lineTo(w * 0.365, h * 0.36);
        ctx.moveTo(w * 0.58, h * 0.54);
        ctx.lineTo(w * 0.635, h * 0.36);
        ctx.stroke();
    },

    guildhall(ctx, w, h) {
        // 1. Фон травянистого участка и мощёная тропинка сверху по центру
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(122, 120, 112, 0.74)';
        for (let y = 2; y < h * 0.24; y += 4.6) {
            for (let dx = -12; dx <= 10; dx += 5) {
                const shift = (Math.floor(y / 4.6) % 2) * 2;
                ctx.beginPath();
                ctx.roundRect(w * 0.52 + dx + shift, y, 4.0, 3.4, 1);
                ctx.fill();
            }
        }

        // 2. Внешний реквизит: бочки и ящики по углам и вдоль нижней стены
        const drawBarrel = (bx, by, r = 4.0, fill = '#3b3732') => {
            ctx.fillStyle = fill;
            ctx.strokeStyle = '#141210';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        };

        // Слева сверху и слева снизу
        drawBarrel(0.11, 0.20, 4.0);
        drawBarrel(0.13, 0.78, 3.8);
        drawBarrel(0.11, 0.88, 4.2);

        // Ящик у левого верхнего края
        ctx.fillStyle = '#5c4e3c';
        ctx.strokeStyle = '#171410';
        ctx.lineWidth = 1.2;
        ctx.fillRect(w * 0.11, h * 0.34, 6, 9);
        ctx.strokeRect(w * 0.11, h * 0.34, 6, 9);

        // Группа бочек снизу по центру и справа
        drawBarrel(0.59, 0.90, 4.2);
        drawBarrel(0.76, 0.87, 3.6);
        drawBarrel(0.80, 0.90, 3.2, '#7c4d2b');
        drawBarrel(0.85, 0.88, 4.2);
        drawBarrel(0.90, 0.86, 4.2);
        drawBarrel(0.91, 0.75, 4.0);

        // 3. Два выступающих слуховых люка у верхнего карниза
        [0.27, 0.68].forEach(dx => {
            ctx.fillStyle = '#9ca3af';
            ctx.strokeStyle = '#1c1e21';
            ctx.lineWidth = 1.5;
            ctx.fillRect(w * dx, h * 0.13, w * 0.08, h * 0.09);
            ctx.strokeRect(w * dx, h * 0.13, w * 0.08, h * 0.09);
        });

        // 4. Основной прямоугольный корпус дома гильдии
        const rx = w * 0.14;
        const ry = h * 0.20;
        const rw = w * 0.74;
        const rh = h * 0.64;

        // Тень от здания
        ctx.fillStyle = 'rgba(18, 16, 14, 0.56)';
        ctx.fillRect(rx + 2.5, ry + 3.5, rw, rh);

        // Светлый верхний скат и тёмный нижний скат крыши
        const topGrad = ctx.createLinearGradient(rx, ry, rx + rw, ry);
        topGrad.addColorStop(0, '#857d73');
        topGrad.addColorStop(0.5, '#a39b90');
        topGrad.addColorStop(1, '#787066');
        ctx.fillStyle = topGrad;
        ctx.fillRect(rx, ry, rw, rh * 0.44);

        const botGrad = ctx.createLinearGradient(rx, ry + rh * 0.44, rx + rw, ry + rh);
        botGrad.addColorStop(0, '#4a433d');
        botGrad.addColorStop(0.5, '#59514a');
        botGrad.addColorStop(1, '#3b3530');
        ctx.fillStyle = botGrad;
        ctx.fillRect(rx, ry + rh * 0.44, rw, rh * 0.56);

        // Штриховка досок/черепицы по краям и скатам
        ctx.strokeStyle = 'rgba(24, 20, 18, 0.42)';
        ctx.lineWidth = 1.1;
        for (let y = ry + 4; y < ry + rh - 3; y += 5) {
            ctx.beginPath();
            ctx.moveTo(rx, y);
            ctx.lineTo(rx + 7, y + 0.5);
            ctx.moveTo(rx + rw - 7, y);
            ctx.lineTo(rx + rw, y + 0.5);
            ctx.stroke();
        }

        // Внешний контур крыши
        ctx.strokeStyle = '#1a1715';
        ctx.lineWidth = 2.0;
        ctx.strokeRect(rx, ry, rw, rh);

        // 5. Длинное горизонтальное коньковое бревно посередине
        const ridgeY = ry + rh * 0.44;
        ctx.fillStyle = '#7c756c';
        ctx.strokeStyle = '#141210';
        ctx.lineWidth = 1.5;
        ctx.fillRect(rx - 4, ridgeY - 2.6, rw + 12, 5.2);
        ctx.strokeRect(rx - 4, ridgeY - 2.6, rw + 12, 5.2);

        // 6. Два прямоугольных каменных дымохода на коньке
        [0.21, 0.78].forEach(cx => {
            ctx.fillStyle = '#5c5854';
            ctx.strokeStyle = '#12100e';
            ctx.lineWidth = 1.5;
            ctx.fillRect(w * cx - 4, ridgeY - 6, 8, 12);
            ctx.strokeRect(w * cx - 4, ridgeY - 6, 8, 12);

            ctx.fillStyle = '#12100e';
            ctx.fillRect(w * cx - 2, ridgeY - 3.5, 4, 7);
        });
    },



    academy(ctx, w, h) {
        this._drawAcademyBase(ctx, w, h, 'round');
    },

    museum(ctx, w, h) {
        this._drawAcademyBase(ctx, w, h, 'rect');
    },

    _drawAcademyBase(ctx, w, h, waterType) {
        // 1. Фон травянистого участка и центральная мощёная аллея
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(130, 128, 118, 0.74)';
        for (let y = h * 0.44; y < h - 1; y += 4.8) {
            for (let dx = -12; dx <= 10; dx += 5) {
                const shift = (Math.floor(y / 4.8) % 2) * 2;
                ctx.beginPath();
                ctx.roundRect(w * 0.50 + dx + shift, y, 4.0, 3.4, 1);
                ctx.fill();
            }
        }

        // 2. Садовые кусты во внутренних двориках слева и справа
        const drawBush = (bx, by, rx, ry) => {
            ctx.fillStyle = 'rgba(15, 22, 10, 0.45)';
            ctx.beginPath();
            ctx.ellipse(w * bx + 1.5, h * by + 2, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();

            const bGrad = ctx.createRadialGradient(w * bx - 2, h * by - 2, 1, w * bx, h * by, Math.max(rx, ry));
            bGrad.addColorStop(0, '#4d6629');
            bGrad.addColorStop(0.7, '#324519');
            bGrad.addColorStop(1, '#1d290e');
            ctx.fillStyle = bGrad;
            ctx.beginPath();
            ctx.ellipse(w * bx, h * by, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();
        };

        drawBush(0.28, 0.42, 9, 7);
        drawBush(0.34, 0.55, 8, 9);
        drawBush(0.66, 0.56, 10, 8);
        drawBush(0.73, 0.45, 7, 7);

        // 3. Водный объект в нижней части аллеи (круглый фонтан для Academy, прямоугольный бассейн для Museum)
        if (waterType === 'round') {
            const fx = w * 0.50;
            const fy = h * 0.77;
            ctx.fillStyle = 'rgba(18, 22, 14, 0.48)';
            ctx.beginPath();
            ctx.arc(fx + 1.5, fy + 2, 10.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#5c5850';
            ctx.strokeStyle = '#1f1e1b';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.arc(fx, fy, 10.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            const waterGrad = ctx.createRadialGradient(fx - 2, fy - 2, 1, fx, fy, 7.5);
            waterGrad.addColorStop(0, '#bae6fd');
            waterGrad.addColorStop(0.55, '#38bdf8');
            waterGrad.addColorStop(1, '#0284c7');
            ctx.fillStyle = waterGrad;
            ctx.beginPath();
            ctx.arc(fx, fy, 7.2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#292524';
            ctx.beginPath();
            ctx.arc(fx, fy, 2.0, 0, Math.PI * 2);
            ctx.fill();
        } else {
            const poolW = w * 0.19;
            const poolH = h * 0.24;
            const poolX = w * 0.50 - poolW / 2;
            const poolY = h * 0.65;

            ctx.fillStyle = 'rgba(18, 22, 14, 0.48)';
            ctx.fillRect(poolX + 2, poolY + 2.5, poolW, poolH);

            const waterGrad = ctx.createLinearGradient(poolX, poolY, poolX + poolW, poolY + poolH);
            waterGrad.addColorStop(0, '#38bdf8');
            waterGrad.addColorStop(0.5, '#0ea5e9');
            waterGrad.addColorStop(1, '#0284c7');
            ctx.fillStyle = waterGrad;
            ctx.strokeStyle = '#5c5850';
            ctx.lineWidth = 2.0;
            ctx.fillRect(poolX, poolY, poolW, poolH);
            ctx.strokeRect(poolX, poolY, poolW, poolH);
        }

        // 4. Внешний контур здания
        const pts = [
            { x: w * 0.03, y: h * 0.08 },
            { x: w * 0.40, y: h * 0.08 },
            { x: w * 0.40, y: h * 0.05 },
            { x: w * 0.59, y: h * 0.05 },
            { x: w * 0.59, y: h * 0.08 },
            { x: w * 0.97, y: h * 0.08 },
            { x: w * 0.97, y: h * 0.91 },
            { x: w * 0.64, y: h * 0.91 },
            { x: w * 0.64, y: h * 0.69 },
            { x: w * 0.78, y: h * 0.69 },
            { x: w * 0.78, y: h * 0.29 },
            { x: w * 0.59, y: h * 0.29 },
            { x: w * 0.59, y: h * 0.47 },
            { x: w * 0.40, y: h * 0.47 },
            { x: w * 0.40, y: h * 0.29 },
            { x: w * 0.22, y: h * 0.29 },
            { x: w * 0.22, y: h * 0.69 },
            { x: w * 0.36, y: h * 0.69 },
            { x: w * 0.36, y: h * 0.91 },
            { x: w * 0.03, y: h * 0.91 }
        ];

        ctx.save();
        ctx.translate(2.5, 3.5);
        ctx.fillStyle = 'rgba(18, 14, 10, 0.55)';
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 5. Объёмная многоскатная крыша с отдельными тонами скатов
        ctx.save();
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.clip();

        const lightSlope = '#bd6a36';
        const midSlope = '#944920';
        const darkSlope = '#5c2a10';

        ctx.fillStyle = midSlope;
        ctx.fillRect(0, 0, w, h);

        // Внутренние затенённые скаты левого крыла
        ctx.fillStyle = darkSlope;
        ctx.beginPath();
        ctx.moveTo(w * 0.125, h * 0.185);
        ctx.lineTo(w * 0.40, h * 0.185);
        ctx.lineTo(w * 0.40, h * 0.29);
        ctx.lineTo(w * 0.22, h * 0.29);
        ctx.lineTo(w * 0.22, h * 0.69);
        ctx.lineTo(w * 0.36, h * 0.69);
        ctx.lineTo(w * 0.36, h * 0.80);
        ctx.lineTo(w * 0.125, h * 0.80);
        ctx.closePath();
        ctx.fill();

        // Внутренние освещённые скаты правого крыла
        ctx.fillStyle = lightSlope;
        ctx.beginPath();
        ctx.moveTo(w * 0.875, h * 0.185);
        ctx.lineTo(w * 0.59, h * 0.185);
        ctx.lineTo(w * 0.59, h * 0.29);
        ctx.lineTo(w * 0.78, h * 0.29);
        ctx.lineTo(w * 0.78, h * 0.69);
        ctx.lineTo(w * 0.64, h * 0.69);
        ctx.lineTo(w * 0.64, h * 0.80);
        ctx.lineTo(w * 0.875, h * 0.80);
        ctx.closePath();
        ctx.fill();

        // Внешний левый освещённый скат и внешний правый затенённый скат
        ctx.fillStyle = lightSlope;
        ctx.beginPath();
        ctx.moveTo(w * 0.03, h * 0.08);
        ctx.lineTo(w * 0.125, h * 0.185);
        ctx.lineTo(w * 0.125, h * 0.80);
        ctx.lineTo(w * 0.03, h * 0.91);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = darkSlope;
        ctx.beginPath();
        ctx.moveTo(w * 0.97, h * 0.08);
        ctx.lineTo(w * 0.875, h * 0.185);
        ctx.lineTo(w * 0.875, h * 0.80);
        ctx.lineTo(w * 0.97, h * 0.91);
        ctx.closePath();
        ctx.fill();

        // Центральный портик: левый светлый скат, правый тёмный скат
        ctx.fillStyle = lightSlope;
        ctx.beginPath();
        ctx.moveTo(w * 0.40, h * 0.05);
        ctx.lineTo(w * 0.495, h * 0.05);
        ctx.lineTo(w * 0.495, h * 0.47);
        ctx.lineTo(w * 0.40, h * 0.47);
        ctx.lineTo(w * 0.40, h * 0.29);
        ctx.lineTo(w * 0.45, h * 0.185);
        ctx.lineTo(w * 0.40, h * 0.08);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#733716';
        ctx.beginPath();
        ctx.moveTo(w * 0.59, h * 0.05);
        ctx.lineTo(w * 0.495, h * 0.05);
        ctx.lineTo(w * 0.495, h * 0.47);
        ctx.lineTo(w * 0.59, h * 0.47);
        ctx.lineTo(w * 0.59, h * 0.29);
        ctx.lineTo(w * 0.54, h * 0.185);
        ctx.lineTo(w * 0.59, h * 0.08);
        ctx.closePath();
        ctx.fill();

        // Штриховка черепицы вдоль карнизов
        ctx.strokeStyle = 'rgba(28, 12, 4, 0.48)';
        ctx.lineWidth = 1.1;
        for (let x = w * 0.04; x < w * 0.96; x += 5) {
            ctx.beginPath();
            ctx.moveTo(x, h * 0.08);
            ctx.lineTo(x, h * 0.12);
            ctx.moveTo(x, h * 0.87);
            ctx.lineTo(x, h * 0.91);
            ctx.stroke();
        }
        for (let y = h * 0.10; y < h * 0.89; y += 5) {
            ctx.beginPath();
            ctx.moveTo(w * 0.03, y);
            ctx.lineTo(w * 0.06, y);
            ctx.moveTo(w * 0.94, y);
            ctx.lineTo(w * 0.97, y);
            ctx.stroke();
        }
        ctx.restore();

        // Внешний контур крыши
        ctx.strokeStyle = '#241206';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();

        // 6. Объёмные коньковые балки и все диагональные стыки скатов
        ctx.strokeStyle = '#2b1407';
        ctx.lineWidth = 2.2;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(w * 0.36, h * 0.80);
        ctx.lineTo(w * 0.125, h * 0.80);
        ctx.lineTo(w * 0.125, h * 0.185);
        ctx.lineTo(w * 0.45, h * 0.185);

        ctx.moveTo(w * 0.64, h * 0.80);
        ctx.lineTo(w * 0.875, h * 0.80);
        ctx.lineTo(w * 0.875, h * 0.185);
        ctx.lineTo(w * 0.54, h * 0.185);

        ctx.moveTo(w * 0.495, h * 0.05);
        ctx.lineTo(w * 0.495, h * 0.47);

        ctx.moveTo(w * 0.03, h * 0.08);
        ctx.lineTo(w * 0.125, h * 0.185);
        ctx.moveTo(w * 0.03, h * 0.91);
        ctx.lineTo(w * 0.125, h * 0.80);
        ctx.moveTo(w * 0.22, h * 0.29);
        ctx.lineTo(w * 0.125, h * 0.185);
        ctx.moveTo(w * 0.22, h * 0.69);
        ctx.lineTo(w * 0.125, h * 0.80);

        ctx.moveTo(w * 0.97, h * 0.08);
        ctx.lineTo(w * 0.875, h * 0.185);
        ctx.moveTo(w * 0.97, h * 0.91);
        ctx.lineTo(w * 0.875, h * 0.80);
        ctx.moveTo(w * 0.78, h * 0.29);
        ctx.lineTo(w * 0.875, h * 0.185);
        ctx.moveTo(w * 0.78, h * 0.69);
        ctx.lineTo(w * 0.875, h * 0.80);
        ctx.moveTo(w * 0.40, h * 0.08);
        ctx.lineTo(w * 0.45, h * 0.185);
        ctx.lineTo(w * 0.40, h * 0.29);
        ctx.moveTo(w * 0.59, h * 0.08);
        ctx.lineTo(w * 0.54, h * 0.185);
        ctx.lineTo(w * 0.59, h * 0.29);
        ctx.stroke();
// 7. Два двойных каменных дымохода на левом и правом крыльях
        [0.125, 0.875].forEach(cx => {
            ctx.fillStyle = '#9ca3af';
            ctx.strokeStyle = '#1f2937';
            ctx.lineWidth = 1.3;
            ctx.fillRect(w * cx - 3.5, h * 0.43, 7, 13);
            ctx.strokeRect(w * cx - 3.5, h * 0.43, 7, 13);
            ctx.fillStyle = '#1f2937';
            ctx.beginPath();
            ctx.arc(w * cx, h * 0.465, 1.6, 0, Math.PI * 2);
            ctx.arc(w * cx, h * 0.525, 1.6, 0, Math.PI * 2);
            ctx.fill();
        });
    },




        embassy(ctx, w, h) {
        // 1. Фон травянистого участка и парадная мощёная дорожка снизу по центру
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(218, 212, 174, 0.38)';
        ctx.fillRect(w * 0.85, h * 0.15, w * 0.15, h * 0.72);

        // Мощёный подход к парадному входу снизу по центру
        ctx.fillStyle = 'rgba(118, 116, 108, 0.74)';
        for (let y = h * 0.78; y < h - 1; y += 4.6) {
            for (let dx = -12; dx <= 10; dx += 5) {
                const shift = (Math.floor(y / 4.6) % 2) * 2;
                ctx.beginPath();
                ctx.roundRect(w * 0.45 + dx + shift, y, 4.0, 3.4, 1);
                ctx.fill();
            }
        }

        // 2. Двухкрестовый контур здания посольства
        const pts = [
            { x: w * 0.07, y: h * 0.19 },
            { x: w * 0.20, y: h * 0.19 },
            { x: w * 0.20, y: h * 0.12 },
            { x: w * 0.36, y: h * 0.12 },
            { x: w * 0.36, y: h * 0.19 },
            { x: w * 0.62, y: h * 0.19 },
            { x: w * 0.62, y: h * 0.12 },
            { x: w * 0.78, y: h * 0.12 },
            { x: w * 0.78, y: h * 0.19 },
            { x: w * 0.91, y: h * 0.19 },
            { x: w * 0.91, y: h * 0.78 },
            { x: w * 0.78, y: h * 0.78 },
            { x: w * 0.78, y: h * 0.85 },
            { x: w * 0.62, y: h * 0.85 },
            { x: w * 0.62, y: h * 0.78 },
            { x: w * 0.36, y: h * 0.78 },
            { x: w * 0.36, y: h * 0.85 },
            { x: w * 0.20, y: h * 0.85 },
            { x: w * 0.20, y: h * 0.78 },
            { x: w * 0.07, y: h * 0.78 }
        ];

        // Тень от здания
        ctx.save();
        ctx.translate(2.5, 3.5);
        ctx.fillStyle = 'rgba(18, 14, 10, 0.55)';
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 3. Заливка медно-коричневой черепичной крыши
        ctx.save();
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();

        const roofGrad = ctx.createLinearGradient(w * 0.07, h * 0.12, w * 0.91, h * 0.85);
        roofGrad.addColorStop(0, '#a66b3a');
        roofGrad.addColorStop(0.55, '#8c562b');
        roofGrad.addColorStop(1, '#4f2e16');
        ctx.fillStyle = roofGrad;
        ctx.fill();
        ctx.clip();

        // Затемнение правого крыла и правых скатов трансептов
        ctx.fillStyle = 'rgba(28, 16, 8, 0.38)';
        ctx.fillRect(w * 0.70, h * 0.12, w * 0.22, h * 0.74);
        ctx.fillRect(w * 0.28, h * 0.12, w * 0.08, h * 0.74);

        // Мелкая фактура черепицы
        ctx.strokeStyle = 'rgba(30, 16, 8, 0.35)';
        ctx.lineWidth = 1;
        for (let y = h * 0.13; y < h * 0.84; y += 4.5) {
            const shift = (Math.floor(y / 4.5) % 2) * 2.5;
            for (let x = w * 0.08; x < w * 0.90; x += 5) {
                ctx.strokeRect(x + shift, y, 4.5, 4);
            }
        }
        ctx.restore();

        // Внешний контур крыши
        ctx.strokeStyle = '#221308';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();

        // 4. Коньковые балки и восемь диагональных стыков скатов
        const midY = h * 0.485;
        const leftRidgeX = w * 0.28;
        const rightRidgeX = w * 0.70;

        ctx.strokeStyle = '#241408';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        // Вертикальные коньки обоих трансептов
        ctx.moveTo(leftRidgeX, h * 0.12);
        ctx.lineTo(leftRidgeX, h * 0.85);
        ctx.moveTo(rightRidgeX, h * 0.12);
        ctx.lineTo(rightRidgeX, h * 0.85);

        // Диагонали левой крестовины
        ctx.moveTo(w * 0.20, h * 0.19);
        ctx.lineTo(leftRidgeX, midY);
        ctx.moveTo(w * 0.36, h * 0.19);
        ctx.lineTo(leftRidgeX, midY);
        ctx.moveTo(w * 0.20, h * 0.78);
        ctx.lineTo(leftRidgeX, midY);
        ctx.moveTo(w * 0.36, h * 0.78);
        ctx.lineTo(leftRidgeX, midY);

        // Диагонали правой крестовины
        ctx.moveTo(w * 0.62, h * 0.19);
        ctx.lineTo(rightRidgeX, midY);
        ctx.moveTo(w * 0.78, h * 0.19);
        ctx.lineTo(rightRidgeX, midY);
        ctx.moveTo(w * 0.62, h * 0.78);
        ctx.lineTo(rightRidgeX, midY);
        ctx.moveTo(w * 0.78, h * 0.78);
        ctx.lineTo(rightRidgeX, midY);
        ctx.stroke();

        // Главный сквозной горизонтальный конёк с выделенным гребнем
        ctx.fillStyle = '#9c6e44';
        ctx.strokeStyle = '#1f1208';
        ctx.lineWidth = 1.4;
        ctx.fillRect(w * 0.06, midY - 2.0, w * 0.86, 4.0);
        ctx.strokeRect(w * 0.06, midY - 2.0, w * 0.86, 4.0);

        // 5. Квадратный каменный дымоход в правом нижнем углу крыши
        ctx.fillStyle = '#5c5852';
        ctx.strokeStyle = '#171512';
        ctx.lineWidth = 1.4;
        ctx.fillRect(w * 0.83, h * 0.63, 9, 9);
        ctx.strokeRect(w * 0.83, h * 0.63, 9, 9);

        ctx.fillStyle = '#171512';
        ctx.fillRect(w * 0.855, h * 0.655, 4, 4);
    },

    foundry(ctx, w, h) {
        // 1. Фон травянистого участка и мощёная дорожка из внутреннего двора вниз
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(122, 120, 112, 0.74)';
        for (let y = h * 0.52; y < h - 1; y += 4.6) {
            for (let dx = -10; dx <= 8; dx += 5) {
                const shift = (Math.floor(y / 4.6) % 2) * 2;
                ctx.beginPath();
                ctx.roundRect(w * 0.49 + dx + shift, y, 4.0, 3.4, 1);
                ctx.fill();
            }
        }

        // 2. Три каменных дымохода вдоль северной (верхней) стены
        [0.31, 0.47, 0.63].forEach(cx => {
            ctx.fillStyle = '#8b8e91';
            ctx.strokeStyle = '#1c1e21';
            ctx.lineWidth = 1.5;
            ctx.fillRect(w * cx, h * 0.05, w * 0.09, h * 0.08);
            ctx.strokeRect(w * cx, h * 0.05, w * 0.09, h * 0.08);

            ctx.fillStyle = '#1c1e21';
            ctx.fillRect(w * (cx + 0.02), h * 0.07, w * 0.05, h * 0.04);
        });

        // 3. Боковые низкие пристройки слева и справа
        const drawWing = (wx, wy, ww, wh) => {
            ctx.fillStyle = 'rgba(18, 15, 10, 0.48)';
            ctx.fillRect(wx + 2, wy + 2.5, ww, wh);

            ctx.fillStyle = '#9c8666';
            ctx.fillRect(wx, wy, ww, wh * 0.46);
            ctx.fillStyle = '#6b583e';
            ctx.fillRect(wx, wy + wh * 0.46, ww, wh * 0.54);

            ctx.strokeStyle = '#1f1810';
            ctx.lineWidth = 1.7;
            ctx.strokeRect(wx, wy, ww, wh);

            ctx.beginPath();
            ctx.moveTo(wx, wy + wh * 0.46);
            ctx.lineTo(wx + ww, wy + wh * 0.46);
            ctx.stroke();
        };

        drawWing(w * 0.115, h * 0.27, w * 0.115, h * 0.43);
        drawWing(w * 0.77, h * 0.27, w * 0.115, h * 0.43);

        // 4. Внешний реквизит: бочки слева и деревянный помост с ящиком справа
        const drawBarrel = (bx, by, r = 3.8, fill = '#3b3732') => {
            ctx.fillStyle = fill;
            ctx.strokeStyle = '#171512';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        };

        drawBarrel(0.20, 0.19, 4.2);
        drawBarrel(0.08, 0.51, 3.6);
        drawBarrel(0.08, 0.65, 4.2);

        // Чан с ярко-синей водой у левой пристройки
        drawBarrel(0.08, 0.36, 4.5, '#1d4ed8');
        ctx.fillStyle = '#7dd3fc';
        ctx.beginPath();
        ctx.arc(w * 0.08, h * 0.36, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Ящик и деревянный настил справа
        ctx.fillStyle = '#855834';
        ctx.strokeStyle = '#1f160d';
        ctx.lineWidth = 1.3;
        ctx.fillRect(w * 0.90, h * 0.24, 9, 10);
        ctx.strokeRect(w * 0.90, h * 0.24, 9, 10);

        ctx.fillStyle = '#a37648';
        ctx.fillRect(w * 0.885, h * 0.38, w * 0.08, h * 0.22);
        ctx.strokeRect(w * 0.885, h * 0.38, w * 0.08, h * 0.22);
        for (let py = h * 0.43; py < h * 0.58; py += 5) {
            ctx.beginPath();
            ctx.moveTo(w * 0.885, py);
            ctx.lineTo(w * 0.965, py);
            ctx.stroke();
        }

        // 5. Главный П-образный корпус литейной (открыт вниз)
        const pts = [
            { x: w * 0.23, y: h * 0.13 },
            { x: w * 0.77, y: h * 0.13 },
            { x: w * 0.77, y: h * 0.84 },
            { x: w * 0.64, y: h * 0.84 },
            { x: w * 0.64, y: h * 0.53 },
            { x: w * 0.36, y: h * 0.53 },
            { x: w * 0.36, y: h * 0.84 },
            { x: w * 0.23, y: h * 0.84 }
        ];

        // Тень от главного здания
        ctx.save();
        ctx.translate(2.5, 3.5);
        ctx.fillStyle = 'rgba(18, 15, 10, 0.55)';
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Заливка серо-коричневой черепичной крыши
        ctx.save();
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();

        const roofGrad = ctx.createLinearGradient(w * 0.23, h * 0.13, w * 0.77, h * 0.84);
        roofGrad.addColorStop(0, '#968266');
        roofGrad.addColorStop(0.5, '#7a664c');
        roofGrad.addColorStop(1, '#544430');
        ctx.fillStyle = roofGrad;
        ctx.fill();
        ctx.clip();

        // Текстура черепичных плит на скатах
        ctx.strokeStyle = 'rgba(26, 20, 14, 0.42)';
        ctx.lineWidth = 1;
        for (let y = h * 0.15; y < h * 0.83; y += 4.5) {
            const shift = (Math.floor(y / 4.5) % 2) * 2.5;
            for (let x = w * 0.24; x < w * 0.76; x += 5) {
                ctx.strokeRect(x + shift, y, 4.5, 4);
            }
        }
        ctx.restore();

        // Внешний контур главного корпуса
        ctx.strokeStyle = '#1f1810';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();

        // 6. Коньковые балки и диагональные стыки скатов
        ctx.strokeStyle = '#261d12';
        ctx.lineWidth = 2.2;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(w * 0.295, h * 0.84);
        ctx.lineTo(w * 0.295, h * 0.33);
        ctx.lineTo(w * 0.705, h * 0.33);
        ctx.lineTo(w * 0.705, h * 0.84);

        ctx.moveTo(w * 0.23, h * 0.13);
        ctx.lineTo(w * 0.295, h * 0.33);
        ctx.moveTo(w * 0.77, h * 0.13);
        ctx.lineTo(w * 0.705, h * 0.33);
        ctx.moveTo(w * 0.36, h * 0.53);
        ctx.lineTo(w * 0.295, h * 0.33);
        ctx.moveTo(w * 0.64, h * 0.53);
        ctx.lineTo(w * 0.705, h * 0.33);
        ctx.stroke();
    },
    garrison(ctx, w, h) {
        // 1. Фон травянистого участка и внутреннего двора
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // 2. Мощёная булыжником дорога по центру открытого зеленого двора
        ctx.fillStyle = 'rgba(118, 116, 108, 0.78)';
        for (let y = h * 0.54; y < h - 1; y += 4.6) {
            for (let dx = -10; dx <= 8; dx += 5) {
                const shift = (Math.floor(y / 4.6) % 2) * 2;
                ctx.beginPath();
                ctx.roundRect(w * 0.49 + dx + shift, y, 4.0, 3.4, 1);
                ctx.fill();
            }
        }

        // 3. Бочки в зелёном дворе у стен боковых корпусов
        const drawBarrel = (bx, by, r = 3.8) => {
            ctx.fillStyle = '#33302c';
            ctx.strokeStyle = '#141210';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        };

        drawBarrel(0.355, 0.81, 3.8);
        drawBarrel(0.33, 0.90, 4.0);
        drawBarrel(0.665, 0.84, 3.8);

        // 4. Вспомогательная отрисовка боковых корпусов (левого и правого)
        const drawSideBarrack = (x, y, bw, bh, ridgeX) => {
            ctx.fillStyle = 'rgba(16, 16, 18, 0.56)';
            ctx.fillRect(x + 2.5, y + 3.5, bw, bh);

            const grad = ctx.createLinearGradient(x, 0, x + bw, 0);
            grad.addColorStop(0, '#85807c');
            grad.addColorStop(0.48, '#9e9995');
            grad.addColorStop(0.52, '#5e5956');
            grad.addColorStop(1, '#3d3937');
            ctx.fillStyle = grad;
            ctx.fillRect(x, y, bw, bh);

            // Текстура сланцевой черепицы
            ctx.strokeStyle = 'rgba(20, 18, 18, 0.34)';
            ctx.lineWidth = 0.9;
            for (let ty = y + 3; ty < y + bh - 2; ty += 4.5) {
                const shift = (Math.floor(ty / 4.5) % 2) * 2.5;
                for (let tx = x + 2; tx < x + bw - 3; tx += 5) {
                    ctx.strokeRect(tx + shift, ty, 4.5, 4);
                }
            }

            ctx.strokeStyle = '#171514';
            ctx.lineWidth = 2.0;
            ctx.strokeRect(x, y, bw, bh);

            // Вертикальный конёк и дымоход
            ctx.strokeStyle = '#1f1c1b';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(ridgeX, y - 2);
            ctx.lineTo(ridgeX, y + bh + 2);
            ctx.stroke();

            ctx.fillStyle = '#635f5c';
            ctx.strokeStyle = '#141210';
            ctx.lineWidth = 1.4;
            ctx.fillRect(ridgeX - 3.5, h * 0.31, 7, 11);
            ctx.strokeRect(ridgeX - 3.5, h * 0.31, 7, 11);

            ctx.fillStyle = '#141210';
            ctx.fillRect(ridgeX - 1.5, h * 0.34, 3, 5);
        };

        drawSideBarrack(w * 0.04, h * 0.08, w * 0.27, h * 0.83, w * 0.175);
        drawSideBarrack(w * 0.69, h * 0.08, w * 0.27, h * 0.83, w * 0.825);

        // 5. Центральный П-образный корпус над зелёным двором
        const midPts = [
            { x: w * 0.31, y: h * 0.08 },
            { x: w * 0.69, y: h * 0.08 },
            { x: w * 0.69, y: h * 0.77 },
            { x: w * 0.58, y: h * 0.77 },
            { x: w * 0.58, y: h * 0.54 },
            { x: w * 0.42, y: h * 0.54 },
            { x: w * 0.42, y: h * 0.77 },
            { x: w * 0.31, y: h * 0.77 }
        ];

        ctx.save();
        ctx.translate(2, 3);
        ctx.fillStyle = 'rgba(16, 16, 18, 0.55)';
        ctx.beginPath();
        midPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        midPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();

        const midGrad = ctx.createLinearGradient(0, h * 0.08, 0, h * 0.77);
        midGrad.addColorStop(0, '#8f8a86');
        midGrad.addColorStop(0.42, '#6e6966');
        midGrad.addColorStop(1, '#4a4644');
        ctx.fillStyle = midGrad;
        ctx.fill();
        ctx.clip();

        ctx.strokeStyle = 'rgba(20, 18, 18, 0.34)';
        ctx.lineWidth = 0.9;
        for (let y = h * 0.10; y < h * 0.76; y += 4.5) {
            const shift = (Math.floor(y / 4.5) % 2) * 2.5;
            for (let x = w * 0.32; x < w * 0.68; x += 5) {
                ctx.strokeRect(x + shift, y, 4.5, 4);
            }
        }
        ctx.restore();

        ctx.strokeStyle = '#171514';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        midPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();

        // Конёк центральной П-образной крыши со скошенными углами
        ctx.strokeStyle = '#1f1c1b';
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(w * 0.365, h * 0.77);
        ctx.lineTo(w * 0.365, h * 0.36);
        ctx.lineTo(w * 0.40, h * 0.30);
        ctx.lineTo(w * 0.60, h * 0.30);
        ctx.lineTo(w * 0.635, h * 0.36);
        ctx.lineTo(w * 0.635, h * 0.77);

        ctx.moveTo(w * 0.31, h * 0.08);
        ctx.lineTo(w * 0.40, h * 0.30);
        ctx.moveTo(w * 0.69, h * 0.08);
        ctx.lineTo(w * 0.60, h * 0.30);
        ctx.moveTo(w * 0.42, h * 0.54);
        ctx.lineTo(w * 0.365, h * 0.36);
        ctx.moveTo(w * 0.58, h * 0.54);
        ctx.lineTo(w * 0.635, h * 0.36);
        ctx.stroke();
    },

};
