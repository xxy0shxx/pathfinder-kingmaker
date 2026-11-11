/**
 * ГЕНЕРАТОРЫ ПОСТРОЕК НА 1 КЛЕТКУ (1x1)
 */
export const Buildings1Lot = {
    watchtower(ctx, w, h) {
        // 1. Фон травянистого участка и вертикальная дорога по центру
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Светлая песчаная дорога и булыжники сверху вниз по центру
        ctx.fillStyle = 'rgba(218, 212, 174, 0.55)';
        ctx.fillRect(w * 0.42, 0, w * 0.16, h);

        ctx.fillStyle = 'rgba(118, 116, 108, 0.72)';
        for (let y = 2; y < h - 2; y += 5) {
            if (y > h * 0.30 && y < h * 0.72) continue;
            for (let dx = -5; dx <= 4; dx += 4.5) {
                const shift = (Math.floor(y / 5) % 2) * 1.8;
                ctx.beginPath();
                ctx.roundRect(w * 0.49 + dx + shift, y, 3.6, 3.2, 1);
                ctx.fill();
            }
        }

        // 2. Контур двухбашенной сторожевой заставы
        const drawFortPath = () => {
            ctx.beginPath();
            ctx.moveTo(w * 0.10, h * 0.72);
            ctx.lineTo(w * 0.10, h * 0.41);
            ctx.arc(w * 0.25, h * 0.41, w * 0.15, Math.PI, 0, false);
            ctx.lineTo(w * 0.60, h * 0.41);
            ctx.arc(w * 0.75, h * 0.41, w * 0.15, Math.PI, 0, false);
            ctx.lineTo(w * 0.90, h * 0.72);
            ctx.closePath();
        };

        // Тень от укрепления
        ctx.save();
        ctx.translate(2.5, 3.5);
        ctx.fillStyle = 'rgba(18, 18, 20, 0.56)';
        drawFortPath();
        ctx.fill();
        ctx.restore();

        // 3. Булыжная каменная кладка на крыше башен
        ctx.save();
        drawFortPath();
        ctx.fillStyle = '#8b9098';
        ctx.fill();
        ctx.clip();

        for (let y = h * 0.24; y < h * 0.73; y += 4.6) {
            const shift = (Math.floor(y / 4.6) % 2) * 2.6;
            for (let x = w * 0.09; x < w * 0.91; x += 5.2) {
                const tone = ((Math.floor(x + y)) % 3 === 0) ? '#adb2ba' : (((Math.floor(x)) % 2 === 0) ? '#737880' : '#9499a1');
                ctx.fillStyle = tone;
                ctx.strokeStyle = '#26292e';
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.roundRect(x + shift, y, 4.4, 3.8, 1.1);
                ctx.fill();
                ctx.stroke();
            }
        }
        ctx.restore();

        // 4. Зубчатый каменный парапет по всему периметру башни
        ctx.strokeStyle = '#1c1e21';
        ctx.lineWidth = 3.6;
        ctx.lineJoin = 'round';
        drawFortPath();
        ctx.stroke();

        ctx.setLineDash([2.4, 2.4]);
        ctx.strokeStyle = '#9ea3ab';
        ctx.lineWidth = 1.8;
        drawFortPath();
        ctx.stroke();
        ctx.setLineDash([]);

        // Небольшой парапетный выступ над центральным проездом
        ctx.fillStyle = '#474b52';
        ctx.strokeStyle = '#1c1e21';
        ctx.lineWidth = 1.4;
        ctx.fillRect(w * 0.43, h * 0.37, w * 0.14, h * 0.04);
        ctx.strokeRect(w * 0.43, h * 0.37, w * 0.14, h * 0.04);

        // 5. Центральная деревянная решётка (машикуль) и два боковых люка
        const gx = w * 0.43;
        const gy = h * 0.49;
        const gw = w * 0.14;
        const gh = h * 0.13;

        ctx.fillStyle = '#3b2818';
        ctx.strokeStyle = '#1a1109';
        ctx.lineWidth = 1.4;
        ctx.fillRect(gx, gy, gw, gh);
        ctx.strokeRect(gx, gy, gw, gh);

        ctx.strokeStyle = '#855e3c';
        ctx.lineWidth = 1.1;
        for (let lx = gx + 3.5; lx < gx + gw - 1; lx += 3.5) {
            ctx.beginPath();
            ctx.moveTo(lx, gy);
            ctx.lineTo(lx, gy + gh);
            ctx.stroke();
        }
        for (let ly = gy + 3.5; ly < gy + gh - 1; ly += 3.5) {
            ctx.beginPath();
            ctx.moveTo(gx, ly);
            ctx.lineTo(gx + gw, ly);
            ctx.stroke();
        }

        // Левый и правый деревянные люки в бастионах
        [0.25, 0.75].forEach(bx => {
            ctx.fillStyle = '#735334';
            ctx.strokeStyle = '#1f160d';
            ctx.lineWidth = 1.3;
            ctx.fillRect(w * bx - 4, h * 0.51, 8, 8);
            ctx.strokeRect(w * bx - 4, h * 0.51, 8, 8);

            ctx.beginPath();
            ctx.moveTo(w * bx - 4, h * 0.55);
            ctx.lineTo(w * bx + 4, h * 0.55);
            ctx.stroke();
        });
    },

    trade_shop(ctx, w, h) {
        // 1. Фон травянистого участка и мощёная дорожка справа по центру
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(122, 120, 112, 0.72)';
        for (let x = w * 0.80; x < w - 2; x += 5) {
            for (let dy = -6; dy <= 5; dy += 5) {
                const shift = (Math.floor(x / 5) % 2) * 2;
                ctx.beginPath();
                ctx.roundRect(x, h * 0.48 + dy + shift, 3.8, 3.4, 1);
                ctx.fill();
            }
        }

        // 2. Реквизит у стен: ящики слева сверху и три бочки справа снизу
        ctx.fillStyle = '#5c5346';
        ctx.strokeStyle = '#1c1917';
        ctx.lineWidth = 1.2;
        ctx.fillRect(w * 0.05, h * 0.08, 9, 11);
        ctx.strokeRect(w * 0.05, h * 0.08, 9, 11);
        ctx.fillRect(w * 0.11, h * 0.21, 8, 7);
        ctx.strokeRect(w * 0.11, h * 0.21, 8, 7);

        [
            [0.88, 0.65], [0.81, 0.76], [0.81, 0.88]
        ].forEach(([bx, by]) => {
            ctx.fillStyle = '#3b3730';
            ctx.strokeStyle = '#171512';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, 4.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });

        // 3. Крестообразный контур здания торговой лавки
        const pts = [
            { x: w * 0.21, y: h * 0.08 },
            { x: w * 0.76, y: h * 0.08 },
            { x: w * 0.76, y: h * 0.30 },
            { x: w * 0.83, y: h * 0.30 },
            { x: w * 0.83, y: h * 0.65 },
            { x: w * 0.76, y: h * 0.65 },
            { x: w * 0.76, y: h * 0.89 },
            { x: w * 0.21, y: h * 0.89 },
            { x: w * 0.21, y: h * 0.65 },
            { x: w * 0.14, y: h * 0.65 },
            { x: w * 0.14, y: h * 0.30 },
            { x: w * 0.21, y: h * 0.30 }
        ];

        // Тень от здания
        ctx.save();
        ctx.translate(2.5, 3.5);
        ctx.fillStyle = 'rgba(18, 15, 10, 0.54)';
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Заливка многоскатной охристо-коричневой крыши
        ctx.save();
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();

        // Базовый тёплый охристый цвет левого ската
        ctx.fillStyle = '#a8844c';
        ctx.fill();
        ctx.clip();

        // Более тёмный правый скат основного корпуса
        ctx.fillStyle = '#755628';
        ctx.fillRect(w * 0.485, h * 0.08, w * 0.35, h * 0.82);

        // Тёмные нижние треугольные скаты обоих боковых крыльев
        ctx.fillStyle = '#523b1a';
        ctx.beginPath();
        ctx.moveTo(w * 0.14, h * 0.475);
        ctx.lineTo(w * 0.485, h * 0.475);
        ctx.lineTo(w * 0.21, h * 0.65);
        ctx.lineTo(w * 0.14, h * 0.65);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(w * 0.83, h * 0.475);
        ctx.lineTo(w * 0.485, h * 0.475);
        ctx.lineTo(w * 0.76, h * 0.65);
        ctx.lineTo(w * 0.83, h * 0.65);
        ctx.closePath();
        ctx.fill();

        // Мелкая фактура черепицы
        ctx.strokeStyle = 'rgba(32, 22, 10, 0.34)';
        ctx.lineWidth = 1;
        for (let y = h * 0.10; y < h * 0.88; y += 5) {
            for (let x = w * 0.16; x < w * 0.81; x += 6) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + 3, y);
                ctx.stroke();
            }
        }
        ctx.restore();

        // Внешний контур крыши
        ctx.strokeStyle = '#22170a';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();

        // 4. Пересекающиеся коньковые балки и диагональные стыки скатов
        const cx = w * 0.485;
        const cy = h * 0.475;

        ctx.strokeStyle = '#2b1c0c';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        // Вертикальный и горизонтальный коньки
        ctx.moveTo(cx, h * 0.06);
        ctx.lineTo(cx, h * 0.91);
        ctx.moveTo(w * 0.14, cy);
        ctx.lineTo(w * 0.83, cy);

        // Четыре диагональных ребра к углам боковых крыльев
        ctx.moveTo(w * 0.21, h * 0.30);
        ctx.lineTo(cx, cy);
        ctx.moveTo(w * 0.76, h * 0.30);
        ctx.lineTo(cx, cy);
        ctx.moveTo(w * 0.21, h * 0.65);
        ctx.lineTo(cx, cy);
        ctx.moveTo(w * 0.76, h * 0.65);
        ctx.lineTo(cx, cy);
        ctx.stroke();

        // 5. Квадратный каменный дымоход в нижней левой части крыши
        ctx.fillStyle = '#9c988e';
        ctx.strokeStyle = '#1c1917';
        ctx.lineWidth = 1.4;
        ctx.fillRect(w * 0.29, h * 0.74, 8, 9);
        ctx.strokeRect(w * 0.29, h * 0.74, 8, 9);

        ctx.fillStyle = '#1c1917';
        ctx.fillRect(w * 0.31, h * 0.76, 4, 5);
    },

    thieves_guild(ctx, w, h) {
        // 1. Фон травянистого участка с вытоптанным переулком между зданиями
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(182, 168, 134, 0.45)';
        ctx.fillRect(w * 0.36, h * 0.28, w * 0.22, h * 0.45);

        // 2. ДОМ 1 (Слева сверху — серо-бежевая соломенная крыша с вертикальным коньком)
        const h1 = { x: w * 0.08, y: h * 0.08, w: w * 0.32, h: h * 0.45 };
        ctx.fillStyle = 'rgba(18, 15, 10, 0.50)';
        ctx.fillRect(h1.x + 2.5, h1.y + 3, h1.w, h1.h);

        // Боковой ящик/тамбур справа от левого верхнего дома
        ctx.fillStyle = '#736c66';
        ctx.strokeStyle = '#1c1917';
        ctx.lineWidth = 1.3;
        ctx.fillRect(h1.x + h1.w, h1.y + h1.h * 0.42, 4, 10);
        ctx.strokeRect(h1.x + h1.w, h1.y + h1.h * 0.42, 4, 10);

        const g1 = ctx.createLinearGradient(h1.x, h1.y, h1.x + h1.w, h1.y);
        g1.addColorStop(0, '#857766');
        g1.addColorStop(0.5, '#a89a88');
        g1.addColorStop(1, '#756858');
        ctx.fillStyle = g1;
        ctx.strokeStyle = '#1f1912';
        ctx.lineWidth = 1.7;
        ctx.fillRect(h1.x, h1.y, h1.w, h1.h);
        ctx.strokeRect(h1.x, h1.y, h1.w, h1.h);

        // Вертикальный конёк, бахрома соломы и труба
        ctx.beginPath();
        ctx.moveTo(h1.x + h1.w * 0.5, h1.y);
        ctx.lineTo(h1.x + h1.w * 0.5, h1.y + h1.h);
        ctx.stroke();

        ctx.fillStyle = '#6e6a62';
        ctx.fillRect(h1.x + h1.w * 0.5 - 2, h1.y + h1.h * 0.48, 5, 8);
        ctx.strokeRect(h1.x + h1.w * 0.5 - 2, h1.y + h1.h * 0.48, 5, 8);

        // 3. ДОМ 2 (Справа сверху — янтарно-соломенная крыша с горизонтальным коньком)
        const h2 = { x: w * 0.48, y: h * 0.08, w: w * 0.44, h: h * 0.27 };
        ctx.fillStyle = 'rgba(18, 15, 10, 0.50)';
        ctx.fillRect(h2.x + 2.5, h2.y + 3, h2.w, h2.h);

        ctx.fillStyle = '#b59242';
        ctx.fillRect(h2.x, h2.y, h2.w, h2.h * 0.5);
        ctx.fillStyle = '#73531c';
        ctx.fillRect(h2.x, h2.y + h2.h * 0.5, h2.w, h2.h * 0.5);

        ctx.strokeStyle = '#1f160a';
        ctx.lineWidth = 1.7;
        ctx.strokeRect(h2.x, h2.y, h2.w, h2.h);
        ctx.beginPath();
        ctx.moveTo(h2.x, h2.y + h2.h * 0.5);
        ctx.lineTo(h2.x + h2.w, h2.y + h2.h * 0.5);
        ctx.stroke();

        ctx.fillStyle = '#6e6a62';
        ctx.fillRect(h2.x + h2.w * 0.45, h2.y + h2.h * 0.52, 6, 6);
        ctx.strokeRect(h2.x + h2.w * 0.45, h2.y + h2.h * 0.52, 6, 6);

        // 4. ДОМ 3 (Слева снизу — компактный домик с янтарно-охристой крышей)
        const h3 = { x: w * 0.09, y: h * 0.62, w: w * 0.36, h: h * 0.29 };
        ctx.fillStyle = 'rgba(18, 15, 10, 0.50)';
        ctx.fillRect(h3.x + 2.5, h3.y + 3, h3.w, h3.h);

        ctx.fillStyle = '#ab8a44';
        ctx.fillRect(h3.x, h3.y, h3.w, h3.h * 0.45);
        ctx.fillStyle = '#785a22';
        ctx.fillRect(h3.x, h3.y + h3.h * 0.45, h3.w, h3.h * 0.55);

        ctx.strokeStyle = '#1f160a';
        ctx.lineWidth = 1.7;
        ctx.strokeRect(h3.x, h3.y, h3.w, h3.h);
        ctx.beginPath();
        ctx.moveTo(h3.x, h3.y + h3.h * 0.45);
        ctx.lineTo(h3.x + h3.w, h3.y + h3.h * 0.45);
        ctx.stroke();

        ctx.fillStyle = '#78736a';
        ctx.fillRect(h3.x + h3.w * 0.48, h3.y + h3.h * 0.22, 6, 6);
        ctx.strokeRect(h3.x + h3.w * 0.48, h3.y + h3.h * 0.22, 6, 6);

        // 5. ДОМ 4 (Справа снизу — каменное ступенчатое логово с плоской крышей)
        ctx.fillStyle = '#7c5c38';
        ctx.strokeStyle = '#1f160d';
        ctx.lineWidth = 1.4;
        ctx.fillRect(w * 0.48, h * 0.46, 8, 12);
        ctx.strokeRect(w * 0.48, h * 0.46, 8, 12);
        ctx.beginPath();
        ctx.moveTo(w * 0.48, h * 0.52);
        ctx.lineTo(w * 0.48 + 8, h * 0.52);
        ctx.stroke();

        const stonePts = [
            { x: w * 0.55, y: h * 0.42 },
            { x: w * 0.90, y: h * 0.42 },
            { x: w * 0.90, y: h * 0.91 },
            { x: w * 0.52, y: h * 0.91 },
            { x: w * 0.52, y: h * 0.62 },
            { x: w * 0.55, y: h * 0.62 }
        ];

        ctx.save();
        ctx.translate(2.5, 3);
        ctx.fillStyle = 'rgba(18, 18, 15, 0.54)';
        ctx.beginPath();
        stonePts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Внешние каменные стены
        ctx.fillStyle = '#8b8880';
        ctx.strokeStyle = '#1c1b18';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        stonePts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Углублённая светло-песочная крыша логова
        const innerPts = [
            { x: w * 0.60, y: h * 0.47 },
            { x: w * 0.85, y: h * 0.47 },
            { x: w * 0.85, y: h * 0.86 },
            { x: w * 0.57, y: h * 0.86 },
            { x: w * 0.57, y: h * 0.66 },
            { x: w * 0.60, y: h * 0.66 }
        ];

        ctx.fillStyle = '#b8aa90';
        ctx.strokeStyle = '#33302b';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        innerPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Две круглые трубы/люка в центре плоской крыши
        [
            [0.68, 0.65, 3.4],
            [0.72, 0.72, 3.0]
        ].forEach(([cx, cy, r]) => {
            ctx.fillStyle = '#5c5852';
            ctx.strokeStyle = '#171512';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(w * cx, h * cy, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });
    },

    tenement(ctx, w, h) {
        // 1. Фон травянистого участка и мощёная дорожка справа по центру
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(122, 120, 112, 0.74)';
        for (let x = w * 0.72; x < w - 2; x += 5) {
            for (let dy = -6; dy <= 5; dy += 5) {
                const shift = (Math.floor(x / 5) % 2) * 2;
                ctx.beginPath();
                ctx.roundRect(x, h * 0.50 + dy + shift, 3.8, 3.4, 1);
                ctx.fill();
            }
        }

        // 2. Реквизит у стен: доски справа сверху, бочки справа снизу, ящик и бочка слева
        const drawBeam = (x1, y1, x2, y2) => {
            ctx.strokeStyle = '#1f1912';
            ctx.lineWidth = 3.2;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(w * x1, h * y1);
            ctx.lineTo(w * x2, h * y2);
            ctx.stroke();

            ctx.strokeStyle = '#6e624d';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(w * x1, h * y1);
            ctx.lineTo(w * x2, h * y2);
            ctx.stroke();
        };

        drawBeam(0.75, 0.34, 0.86, 0.19);
        drawBeam(0.83, 0.34, 0.94, 0.19);

        const drawBarrel = (bx, by, r = 4.0) => {
            ctx.fillStyle = '#47423b';
            ctx.strokeStyle = '#171512';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        };

        drawBarrel(0.79, 0.62, 4.4);
        drawBarrel(0.85, 0.74, 3.6);
        drawBarrel(0.11, 0.72, 4.0);

        ctx.fillStyle = '#5c5850';
        ctx.strokeStyle = '#171512';
        ctx.lineWidth = 1.2;
        ctx.fillRect(w * 0.06, h * 0.48, 8, 9);
        ctx.strokeRect(w * 0.06, h * 0.48, 8, 9);

        // 3. Основной прямоугольный корпус доходного дома
        const rx = w * 0.12;
        const ry = h * 0.08;
        const rw = w * 0.59;
        const rh = h * 0.82;

        // Тень от здания
        ctx.fillStyle = 'rgba(18, 16, 14, 0.54)';
        ctx.fillRect(rx + 3, ry + 3.5, rw, rh);

        // Серо-пепельный градиент ветхой соломенной кровли
        const roofGrad = ctx.createLinearGradient(rx, ry, rx + rw, ry);
        roofGrad.addColorStop(0, '#78716a');
        roofGrad.addColorStop(0.46, '#9c948c');
        roofGrad.addColorStop(0.54, '#6b645e');
        roofGrad.addColorStop(1, '#544e49');

        ctx.fillStyle = roofGrad;
        ctx.fillRect(rx, ry, rw, rh);

        // Бахромчатая штриховка соломы по краям крыши
        ctx.strokeStyle = 'rgba(26, 22, 20, 0.52)';
        ctx.lineWidth = 1.1;
        for (let y = ry + 4; y < ry + rh - 3; y += 4.5) {
            ctx.beginPath();
            ctx.moveTo(rx, y);
            ctx.lineTo(rx + 5, y + 0.5);
            ctx.moveTo(rx + rw - 5, y);
            ctx.lineTo(rx + rw, y + 0.5);
            ctx.stroke();
        }

        // Контур крыши
        ctx.strokeStyle = '#1a1715';
        ctx.lineWidth = 2.0;
        ctx.strokeRect(rx, ry, rw, rh);

        // 4. Продольное коньковое бревно посередине
        const ridgeX = rx + rw * 0.48;
        ctx.fillStyle = '#736c66';
        ctx.strokeStyle = '#141210';
        ctx.lineWidth = 1.5;
        ctx.fillRect(ridgeX - 2.4, ry - 2.5, 4.8, rh + 5);
        ctx.strokeRect(ridgeX - 2.4, ry - 2.5, 4.8, rh + 5);

        // 5. Полукруглые слуховые окна на скатах (3 слева, 2 справа)
        const drawDormer = (dx, dy, dir) => {
            ctx.save();
            ctx.translate(w * dx, h * dy);
            ctx.fillStyle = '#a8a296';
            ctx.strokeStyle = '#1c1917';
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            if (dir === 'left') {
                ctx.arc(2, 0, 5.2, Math.PI * 0.5, Math.PI * 1.5);
            } else {
                ctx.arc(-2, 0, 5.2, -Math.PI * 0.5, Math.PI * 0.5);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(dir === 'left' ? -3 : -2, 0);
            ctx.lineTo(dir === 'left' ? 2 : 3, 0);
            ctx.stroke();
            ctx.restore();
        };

        drawDormer(0.28, 0.23, 'left');
        drawDormer(0.28, 0.48, 'left');
        drawDormer(0.28, 0.72, 'left');
        drawDormer(0.55, 0.23, 'right');
        drawDormer(0.55, 0.72, 'right');

        // 6. Крупная тёмная дыра-прореха посередине правого ската
        ctx.fillStyle = '#1f1d1b';
        ctx.strokeStyle = '#12100e';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(w * 0.50, h * 0.46);
        ctx.lineTo(w * 0.62, h * 0.37);
        ctx.lineTo(w * 0.65, h * 0.55);
        ctx.lineTo(w * 0.53, h * 0.56);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    },

    tavern_popular(ctx, w, h) {
        // 1. Фон травянистого участка со светлой дорогой вдоль правой диагонали
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(218, 212, 174, 0.45)';
        ctx.beginPath();
        ctx.moveTo(w * 0.85, 0);
        ctx.lineTo(w, 0);
        ctx.lineTo(w, h);
        ctx.lineTo(w * 0.45, h);
        ctx.closePath();
        ctx.fill();

        // Мелкая галька на дороге справа
        ctx.fillStyle = 'rgba(115, 113, 104, 0.65)';
        [
            [0.84, 0.34], [0.91, 0.44], [0.81, 0.56], [0.89, 0.64], [0.76, 0.78]
        ].forEach(([gx, gy]) => {
            ctx.beginPath();
            ctx.roundRect(w * gx, h * gy, 3.8, 3.2, 1);
            ctx.fill();
        });

        // 2. Входная каменная лестница слева и ящик под ней
        ctx.fillStyle = '#8c8a82';
        ctx.strokeStyle = '#1f1d1a';
        ctx.lineWidth = 1.4;
        ctx.fillRect(w * 0.08, h * 0.31, w * 0.14, h * 0.11);
        ctx.strokeRect(w * 0.08, h * 0.31, w * 0.14, h * 0.11);

        for (let sx = w * 0.11; sx < w * 0.21; sx += 3.5) {
            ctx.beginPath();
            ctx.moveTo(sx, h * 0.31);
            ctx.lineTo(sx, h * 0.42);
            ctx.stroke();
        }

        // Коричневый ящик/бочонок под лестницей
        ctx.fillStyle = '#7c5334';
        ctx.fillRect(w * 0.15, h * 0.50, 7, 10);
        ctx.strokeRect(w * 0.15, h * 0.50, 7, 10);

        // 3. Три тёмные бочки вдоль правой диагональной стены
        [
            [0.81, 0.41], [0.67, 0.68], [0.60, 0.77]
        ].forEach(([bx, by]) => {
            ctx.fillStyle = '#3b3732';
            ctx.strokeStyle = '#171512';
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, 4.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });

        // 4. Внешний треугольный контур терракотовой крыши со скруглёнными углами
        const drawRoundedTri = (pts, rad) => {
            ctx.beginPath();
            for (let i = 0; i < pts.length; i++) {
                const p0 = pts[(i + pts.length - 1) % pts.length];
                const p1 = pts[i];
                const p2 = pts[(i + 1) % pts.length];
                const v1x = p0.x - p1.x;
                const v1y = p0.y - p1.y;
                const v2x = p2.x - p1.x;
                const v2y = p2.y - p1.y;
                const l1 = Math.hypot(v1x, v1y);
                const l2 = Math.hypot(v2x, v2y);
                const s1 = { x: p1.x + (v1x / l1) * rad, y: p1.y + (v1y / l1) * rad };
                const s2 = { x: p1.x + (v2x / l2) * rad, y: p1.y + (v2y / l2) * rad };
                if (i === 0) ctx.moveTo(s1.x, s1.y);
                else ctx.lineTo(s1.x, s1.y);
                ctx.quadraticCurveTo(p1.x, p1.y, s2.x, s2.y);
            }
            ctx.closePath();
        };

        const outerPts = [
            { x: w * 0.19, y: h * 0.08 },
            { x: w * 0.87, y: h * 0.14 },
            { x: w * 0.41, y: h * 0.83 }
        ];

        // Тень от таверны
        ctx.save();
        ctx.translate(2.5, 3.5);
        ctx.fillStyle = 'rgba(18, 14, 10, 0.54)';
        drawRoundedTri(outerPts, 7);
        ctx.fill();
        ctx.restore();

        // Заливка терракотово-коричневых скатов крыши
        const roofGrad = ctx.createLinearGradient(w * 0.19, h * 0.08, w * 0.87, h * 0.83);
        roofGrad.addColorStop(0, '#7c4324');
        roofGrad.addColorStop(0.5, '#9c5a34');
        roofGrad.addColorStop(1, '#542b14');

        ctx.fillStyle = roofGrad;
        ctx.strokeStyle = '#241208';
        ctx.lineWidth = 2.0;
        drawRoundedTri(outerPts, 7);
        ctx.fill();
        ctx.stroke();

        // 5. Углублённая светло-песочная плоская площадка крыши в двойном обрамлении
        const innerPts = [
            { x: w * 0.31, y: h * 0.20 },
            { x: w * 0.72, y: h * 0.24 },
            { x: w * 0.43, y: h * 0.67 }
        ];

        ctx.fillStyle = '#cfc2a3';
        ctx.strokeStyle = '#3b2b1a';
        ctx.lineWidth = 2.8;
        drawRoundedTri(innerPts, 4);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = '#e5dcc5';
        ctx.lineWidth = 1.2;
        drawRoundedTri(innerPts, 4);
        ctx.stroke();

        // 6. Дымоход и ромбовидный люк на внутренней площадке крыши
        ctx.fillStyle = '#5c5852';
        ctx.strokeStyle = '#1c1917';
        ctx.lineWidth = 1.3;
        ctx.fillRect(w * 0.36, h * 0.34, 6, 9);
        ctx.strokeRect(w * 0.36, h * 0.34, 6, 9);

        ctx.save();
        ctx.translate(w * 0.53, h * 0.31);
        ctx.rotate(0.78);
        ctx.fillStyle = '#9c8c72';
        ctx.fillRect(-3.5, -3.5, 7, 7);
        ctx.strokeRect(-3.5, -3.5, 7, 7);
        ctx.restore();
    },

    tavern_dive(ctx, w, h) {
        // 1. Фон травянистого участка с грязными вытоптанными пятнами
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(115, 86, 52, 0.45)';
        const mudSpots = [
            [0.64, 0.08, 7, 5], [0.85, 0.24, 6, 8], [0.16, 0.72, 6, 5],
            [0.44, 0.86, 9, 6], [0.76, 0.80, 8, 6], [0.28, 0.90, 5, 4]
        ];
        mudSpots.forEach(([mx, my, rx, ry]) => {
            ctx.beginPath();
            ctx.ellipse(w * mx, h * my, rx, ry, 0.2, 0, Math.PI * 2);
            ctx.fill();
        });

        // 2. Деревянная пристройка-навес снизу слева и две бочки у входа
        ctx.fillStyle = 'rgba(18, 15, 10, 0.48)';
        ctx.fillRect(w * 0.20, h * 0.69, w * 0.35, h * 0.16);

        const shedGrad = ctx.createLinearGradient(w * 0.19, h * 0.67, w * 0.54, h * 0.83);
        shedGrad.addColorStop(0, '#7c6244');
        shedGrad.addColorStop(1, '#a68b68');
        ctx.fillStyle = shedGrad;
        ctx.strokeStyle = '#1f160d';
        ctx.lineWidth = 1.5;
        ctx.fillRect(w * 0.19, h * 0.67, w * 0.35, h * 0.15);
        ctx.strokeRect(w * 0.19, h * 0.67, w * 0.35, h * 0.15);

        ctx.beginPath();
        ctx.moveTo(w * 0.36, h * 0.67);
        ctx.lineTo(w * 0.36, h * 0.82);
        ctx.stroke();

        // Бочка и серый бочонок справа от пристройки
        ctx.fillStyle = '#6e472b';
        ctx.beginPath();
        ctx.arc(w * 0.63, h * 0.75, 4.0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#5c5850';
        ctx.fillRect(w * 0.56, h * 0.81, 6, 7);
        ctx.strokeRect(w * 0.56, h * 0.81, 6, 7);

        // 3. Основная четырёхскатная соломенная крыша забегаловки
        const rx = w * 0.10;
        const ry = h * 0.12;
        const rw = w * 0.80;
        const rh = h * 0.55;

        // Тень от здания
        ctx.fillStyle = 'rgba(18, 15, 10, 0.54)';
        ctx.fillRect(rx + 2.5, ry + 3.5, rw, rh);

        // Заливка соломенной крыши (верх и право светлее, низ и лево темнее)
        const roofGrad = ctx.createLinearGradient(rx, ry, rx + rw, ry + rh);
        roofGrad.addColorStop(0, '#9c8044');
        roofGrad.addColorStop(0.5, '#b89b58');
        roofGrad.addColorStop(1, '#75561e');
        ctx.fillStyle = roofGrad;
        ctx.fillRect(rx, ry, rw, rh);

        // Тёмный нижний скат крыши
        ctx.fillStyle = 'rgba(82, 54, 16, 0.42)';
        ctx.beginPath();
        ctx.moveTo(rx, ry + rh);
        ctx.lineTo(w * 0.42, h * 0.43);
        ctx.lineTo(w * 0.62, h * 0.43);
        ctx.lineTo(rx + rw, ry + rh);
        ctx.closePath();
        ctx.fill();

        // Бахромчатая фактура соломы по периметру
        ctx.strokeStyle = 'rgba(38, 26, 8, 0.48)';
        ctx.lineWidth = 1.1;
        for (let x = rx + 4; x < rx + rw - 4; x += 5) {
            ctx.beginPath();
            ctx.moveTo(x, ry);
            ctx.lineTo(x, ry + 4.5);
            ctx.moveTo(x, ry + rh - 4.5);
            ctx.lineTo(x, ry + rh);
            ctx.stroke();
        }
        for (let y = ry + 4; y < ry + rh - 4; y += 5) {
            ctx.beginPath();
            ctx.moveTo(rx, y);
            ctx.lineTo(rx + 4.5, y);
            ctx.moveTo(rx + rw - 4.5, y);
            ctx.lineTo(rx + rw, y);
            ctx.stroke();
        }

        // Неровный контур карниза
        ctx.strokeStyle = '#22170a';
        ctx.lineWidth = 2.0;
        ctx.strokeRect(rx, ry, rw, rh);

        // 4. Коньковые балки вальмовой крыши
        const rLeftX = w * 0.42;
        const rRightX = w * 0.62;
        const rY = h * 0.43;

        ctx.strokeStyle = '#2b1c0c';
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(rLeftX, rY);
        ctx.lineTo(rRightX, rY);
        ctx.moveTo(rx, ry);
        ctx.lineTo(rLeftX, rY);
        ctx.moveTo(rx, ry + rh);
        ctx.lineTo(rLeftX, rY);
        ctx.moveTo(rx + rw, ry);
        ctx.lineTo(rRightX, rY);
        ctx.moveTo(rx + rw, ry + rh);
        ctx.lineTo(rRightX, rY);
        ctx.stroke();

        // 5. Три тёмные заплатки (прорехи) на скатах крыши
        const drawPatch = (px, py, pw, ph, ang) => {
            ctx.save();
            ctx.translate(w * px, h * py);
            ctx.rotate(ang);
            ctx.fillStyle = '#1f1d1c';
            ctx.beginPath();
            ctx.roundRect(-pw / 2, -ph / 2, pw, ph, 2.5);
            ctx.fill();
            ctx.restore();
        };

        drawPatch(0.66, 0.23, 12, 6, -0.35);
        drawPatch(0.26, 0.42, 6, 13, 0.25);
        drawPatch(0.61, 0.52, 11, 8, -0.45);

        // 6. Каменный дымоход на верхнем скате левее центра
        ctx.fillStyle = '#7c7870';
        ctx.strokeStyle = '#1c1917';
        ctx.lineWidth = 1.4;
        ctx.fillRect(w * 0.42, h * 0.28, 7, 10);
        ctx.strokeRect(w * 0.42, h * 0.28, 7, 10);

        ctx.fillStyle = '#1c1917';
        ctx.fillRect(w * 0.44, h * 0.30, 3, 6);
    },

    tannery(ctx, w, h) {
        // 1. Фон травянистого участка со светлой тропой в левом верхнем углу
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = 'rgba(218, 212, 174, 0.55)';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(w * 0.14, 0);
        ctx.lineTo(w * 0.28, h * 0.28);
        ctx.stroke();

        // 2. Реквизит у верхней стены: коричневая бочка и серый ящик
        ctx.fillStyle = '#754c33';
        ctx.strokeStyle = '#1f160d';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(w * 0.41, h * 0.09, 4.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#6e6a62';
        ctx.fillRect(w * 0.33, h * 0.17, 6, 7);
        ctx.strokeRect(w * 0.33, h * 0.17, 6, 7);

        // 3. Повёрнутая Г-образная постройка кожевни
        ctx.save();
        ctx.translate(w * 0.48, h * 0.45);
        ctx.rotate(-0.46);

        // Дубильный реквизит во внутреннем дворе справа (ящики и синий чан)
        ctx.fillStyle = '#5c5549';
        ctx.strokeStyle = '#1f1912';
        ctx.lineWidth = 1.2;
        ctx.fillRect(16, -2, 8, 8);
        ctx.strokeRect(16, -2, 8, 8);

        ctx.fillStyle = '#7c5834';
        ctx.fillRect(5, 3, 9, 8);
        ctx.strokeRect(5, 3, 9, 8);

        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.arc(14, 15, 4.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#7dd3fc';
        ctx.beginPath();
        ctx.arc(13, 14, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Контур Г-образной крыши в локальных координатах
        const pts = [
            { x: -34, y: -26 },
            { x: 34, y: -26 },
            { x: 34, y: -3 },
            { x: -7, y: -3 },
            { x: -7, y: 34 },
            { x: -34, y: 34 }
        ];

        // Тень от здания
        ctx.save();
        ctx.translate(2.5, 3.5);
        ctx.fillStyle = 'rgba(18, 15, 10, 0.54)';
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Заливка двухцветной соломенной крыши
        ctx.save();
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();

        // Светлый песочный базовый цвет (внешние скаты)
        ctx.fillStyle = '#c4b488';
        ctx.fill();
        ctx.clip();

        // Тёмно-коричневые внутренние скаты
        ctx.fillStyle = '#6e4e26';
        ctx.fillRect(-20, -14, 56, 50);

        // Бахромчатая штриховка пучков соломы по краям крыши
        ctx.strokeStyle = 'rgba(38, 26, 10, 0.48)';
        ctx.lineWidth = 1.1;
        for (let x = -31; x <= 31; x += 4.5) {
            ctx.beginPath();
            ctx.moveTo(x, -26);
            ctx.lineTo(x, -21);
            ctx.stroke();
        }
        for (let y = -23; y <= 31; y += 4.5) {
            ctx.beginPath();
            ctx.moveTo(-34, y);
            ctx.lineTo(-29, y);
            ctx.stroke();
        }
        ctx.restore();

        // Внешний контур крыши
        ctx.strokeStyle = '#22180c';
        ctx.lineWidth = 1.9;
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();

        // 4. Светлые коньковые брёвна с тёмной окантовкой
        const drawRidgeLine = (x1, y1, x2, y2) => {
            ctx.strokeStyle = '#22180c';
            ctx.lineWidth = 3.2;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            ctx.strokeStyle = '#d4c8a8';
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        };

        drawRidgeLine(-20, 34, -20, -14);
        drawRidgeLine(-20, -14, 34, -14);
        drawRidgeLine(-34, -26, -20, -14);

        // 5. Круглая каменная вытяжная труба в углу крыши
        ctx.fillStyle = '#5c5852';
        ctx.strokeStyle = '#171512';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(-25, -13, 4.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#171512';
        ctx.beginPath();
        ctx.arc(-25, -13, 1.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    },

    stable(ctx, w, h) {
        // 1. Фон травянистого участка со светлой вытоптанной землёй и булыжниками слева
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(218, 212, 174, 0.35)';
        ctx.beginPath();
        ctx.ellipse(w * 0.72, h * 0.42, w * 0.24, h * 0.28, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Мощёные камни у левого края двора
        ctx.fillStyle = 'rgba(122, 120, 112, 0.72)';
        const stones = [
            [0.06, 0.56], [0.12, 0.54], [0.08, 0.62],
            [0.14, 0.60], [0.07, 0.68], [0.13, 0.67]
        ];
        stones.forEach(([sx, sy]) => {
            ctx.beginPath();
            ctx.roundRect(w * sx, h * sy, 3.8, 3.2, 1);
            ctx.fill();
        });

        // 2. Внешний реквизит слева внизу: бочка и ящик с кормом
        ctx.fillStyle = '#7c5334';
        ctx.strokeStyle = '#1f160d';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(w * 0.17, h * 0.77, 4.0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#5c5850';
        ctx.fillRect(w * 0.11, h * 0.85, 6, 8);
        ctx.strokeRect(w * 0.11, h * 0.85, 6, 8);

        // 3. Повёрнутый корпус конюшни с боковым навесом-стойлом
        ctx.save();
        ctx.translate(w * 0.52, h * 0.48);
        ctx.rotate(-0.42);

        // Ящик/тюк у верхнего левого угла пристройки
        ctx.fillStyle = '#855834';
        ctx.strokeStyle = '#1f160d';
        ctx.lineWidth = 1.2;
        ctx.fillRect(-31, -16, 8, 8);
        ctx.strokeRect(-31, -16, 8, 8);

        // Тень от всего комплекса конюшни
        ctx.fillStyle = 'rgba(18, 16, 12, 0.52)';
        ctx.fillRect(-29, -10, 16, 44);
        ctx.fillRect(-15, -31, 41, 67);

        // Левый низкий дощатый навес-стойло
        ctx.fillStyle = '#756e62';
        ctx.strokeStyle = '#1f1c17';
        ctx.lineWidth = 1.6;
        ctx.fillRect(-31, -12, 16, 44);
        ctx.strokeRect(-31, -12, 16, 44);

        // Поперечные доски на боковом навесе
        ctx.strokeStyle = 'rgba(28, 24, 18, 0.52)';
        ctx.lineWidth = 1;
        for (let py = -8; py <= 28; py += 4.2) {
            ctx.beginPath();
            ctx.moveTo(-31, py);
            ctx.lineTo(-15, py);
            ctx.stroke();
        }

        // Основной двускатный корпус конюшни (серо-бежевая соломенная крыша)
        const rw = 40;
        const rh = 66;
        const rx = -16;
        const ry = -33;

        const roofGrad = ctx.createLinearGradient(rx, ry, rx + rw, ry);
        roofGrad.addColorStop(0, '#7c7668');
        roofGrad.addColorStop(0.45, '#968f80');
        roofGrad.addColorStop(0.55, '#aba392');
        roofGrad.addColorStop(1, '#857e6e');

        ctx.fillStyle = roofGrad;
        ctx.strokeStyle = '#1f1c17';
        ctx.lineWidth = 1.9;
        ctx.fillRect(rx, ry, rw, rh);
        ctx.strokeRect(rx, ry, rw, rh);

        // Бахромчатая фактура пучков соломы по краям и скатам
        ctx.strokeStyle = 'rgba(32, 28, 20, 0.52)';
        ctx.lineWidth = 1.1;
        for (let y = ry + 3; y < ry + rh - 2; y += 4.2) {
            ctx.beginPath();
            ctx.moveTo(rx, y);
            ctx.lineTo(rx + 5, y + 0.5);
            ctx.moveTo(rx + rw - 5, y);
            ctx.lineTo(rx + rw, y + 0.5);
            ctx.stroke();
        }

        // 4. Продольное коньковое бревно посередине
        ctx.fillStyle = '#a8a090';
        ctx.strokeStyle = '#1f1c17';
        ctx.lineWidth = 1.4;
        ctx.fillRect(rx + rw * 0.45 - 2, ry - 2, 4.2, rh + 4);
        ctx.strokeRect(rx + rw * 0.45 - 2, ry - 2, 4.2, rh + 4);

        ctx.restore();
    },

    special_artisan(ctx, w, h) {
        // 1. Фон травянистого участка и мощёная дорожка справа по центру
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(122, 120, 112, 0.74)';
        for (let x = w * 0.68; x < w - 2; x += 5) {
            for (let dy = -6; dy <= 5; dy += 5) {
                const shift = (Math.floor(x / 5) % 2) * 2;
                ctx.beginPath();
                ctx.roundRect(x, h * 0.50 + dy + shift, 3.8, 3.4, 1);
                ctx.fill();
            }
        }

        // 2. Реквизит у стен: бочки и ящики
        const drawBarrel = (bx, by, r = 4.0, fill = '#3b3730') => {
            ctx.fillStyle = fill;
            ctx.strokeStyle = '#171512';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        };

        // Две тёмные бочки и малый коричневый бочонок справа сверху
        drawBarrel(0.75, 0.08, 4.4);
        drawBarrel(0.69, 0.17, 4.4);
        drawBarrel(0.65, 0.27, 3.2, '#6b472b');

        // Зеленоватая кадушка справа снизу
        drawBarrel(0.68, 0.76, 4.4, '#59633e');
        ctx.fillStyle = '#859163';
        ctx.beginPath();
        ctx.arc(w * 0.68, h * 0.76, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Ящики у левой внешней стены
        ctx.fillStyle = '#4a4339';
        ctx.strokeStyle = '#171512';
        ctx.lineWidth = 1.2;
        ctx.fillRect(w * 0.03, h * 0.21, 7, 9);
        ctx.strokeRect(w * 0.03, h * 0.21, 7, 9);

        // 3. Основной прямоугольный корпус мастерской
        const rx = w * 0.11;
        const ry = h * 0.08;
        const rw = w * 0.50;
        const rh = h * 0.83;

        // Тень от здания
        ctx.fillStyle = 'rgba(18, 14, 10, 0.54)';
        ctx.fillRect(rx + 3, ry + 3.5, rw, rh);

        // Заливка медно-коричневой крыши
        const roofGrad = ctx.createLinearGradient(rx, ry, rx + rw, ry + rh);
        roofGrad.addColorStop(0, '#7c5334');
        roofGrad.addColorStop(0.5, '#a87c54');
        roofGrad.addColorStop(1, '#633e22');
        ctx.fillStyle = roofGrad;
        ctx.fillRect(rx, ry, rw, rh);

        // Мелкая фактура черепицы на скатах
        ctx.strokeStyle = 'rgba(28, 18, 10, 0.36)';
        ctx.lineWidth = 1;
        for (let y = ry + 4; y < ry + rh - 3; y += 4.5) {
            const shift = (Math.floor(y / 4.5) % 2) * 2.5;
            for (let x = rx + 3; x < rx + rw - 3; x += 5) {
                ctx.strokeRect(x + shift, y, 4.5, 4);
            }
        }

        ctx.strokeStyle = '#1f140b';
        ctx.lineWidth = 2.0;
        ctx.strokeRect(rx, ry, rw, rh);

        // 4. Продольное коньковое бревно посередине
        const ridgeX = rx + rw * 0.50;
        ctx.fillStyle = '#9c7854';
        ctx.strokeStyle = '#1f140b';
        ctx.lineWidth = 1.4;
        ctx.fillRect(ridgeX - 2.0, ry - 2, 4.0, rh + 4);
        ctx.strokeRect(ridgeX - 2.0, ry - 2, 4.0, rh + 4);

        // 5. Выступающий треугольный фронтон (портик) справа по центру
        const gTop = h * 0.33;
        const gBot = h * 0.67;
        const gMid = h * 0.50;
        const gRight = w * 0.67;

        // Тень от фронтона
        ctx.fillStyle = 'rgba(18, 14, 10, 0.45)';
        ctx.beginPath();
        ctx.moveTo(ridgeX + 2, gMid + 2);
        ctx.lineTo(gRight + 2, gTop + 2);
        ctx.lineTo(gRight + 2, gBot + 2);
        ctx.closePath();
        ctx.fill();

        // Верхний светлый скат фронтона
        ctx.fillStyle = '#c49e78';
        ctx.beginPath();
        ctx.moveTo(ridgeX, gMid);
        ctx.lineTo(gRight, gTop);
        ctx.lineTo(gRight, gMid);
        ctx.closePath();
        ctx.fill();

        // Нижний тёмный скат фронтона
        ctx.fillStyle = '#6e4728';
        ctx.beginPath();
        ctx.moveTo(ridgeX, gMid);
        ctx.lineTo(gRight, gMid);
        ctx.lineTo(gRight, gBot);
        ctx.closePath();
        ctx.fill();

        // Контур и горизонтальный конёк фронтона
        ctx.strokeStyle = '#1f140b';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(ridgeX, gMid);
        ctx.lineTo(gRight, gTop);
        ctx.lineTo(gRight, gBot);
        ctx.closePath();
        ctx.stroke();

        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(ridgeX, gMid);
        ctx.lineTo(gRight, gMid);
        ctx.stroke();

        // 6. Тёмный каменный дымоход в нижней левой части крыши
        ctx.fillStyle = '#47433e';
        ctx.strokeStyle = '#141210';
        ctx.lineWidth = 1.4;
        ctx.fillRect(rx + 8, ry + rh - 18, 7, 11);
        ctx.strokeRect(rx + 8, ry + rh - 18, 7, 11);

        ctx.fillStyle = '#141210';
        ctx.fillRect(rx + 10, ry + rh - 15, 3, 5);
    },

    smithy(ctx, w, h) {
        // 1. Фон травянистого участка и вытоптанная земля во внутреннем дворе
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(182, 178, 152, 0.45)';
        ctx.fillRect(w * 0.45, h * 0.16, w * 0.42, h * 0.34);

        // 2. Деревянный навес-дровник слева сверху и тамбур снизу
        ctx.fillStyle = '#9e9788';
        ctx.strokeStyle = '#1f1b14';
        ctx.lineWidth = 1.4;
        ctx.fillRect(w * 0.18, h * 0.08, w * 0.11, h * 0.31);
        ctx.strokeRect(w * 0.18, h * 0.08, w * 0.11, h * 0.31);

        ctx.fillStyle = '#754e29';
        ctx.fillRect(w * 0.14, h * 0.14, 4, 14);
        ctx.strokeRect(w * 0.14, h * 0.14, 4, 14);

        // Нижний тамбур под южной стеной
        ctx.fillStyle = '#6b5e54';
        ctx.fillRect(w * 0.54, h * 0.78, 8, 10);
        ctx.strokeRect(w * 0.54, h * 0.78, 8, 10);

        // 3. Кузнечный реквизит во дворе: горн, точильный круг и синяя бочка для закалки
        ctx.fillStyle = '#78736a';
        ctx.strokeStyle = '#1c1917';
        ctx.lineWidth = 1.3;
        ctx.fillRect(w * 0.52, h * 0.16, 7, 25);
        ctx.strokeRect(w * 0.52, h * 0.16, 7, 25);

        // Тлеющие угли в открытом очаге у стены
        ctx.fillStyle = '#d97706';
        ctx.fillRect(w * 0.535, h * 0.24, 4, 9);

        // Точильный круг / наковальня
        ctx.fillStyle = '#6b6862';
        ctx.beginPath();
        ctx.ellipse(w * 0.72, h * 0.38, 6.5, 4.2, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Бочка с ярко-синей водой для закалки клинков
        ctx.fillStyle = '#1d4ed8';
        ctx.beginPath();
        ctx.arc(w * 0.86, h * 0.38, 5.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#7dd3fc';
        ctx.beginPath();
        ctx.arc(w * 0.85, h * 0.37, 2.4, 0, Math.PI * 2);
        ctx.fill();

        // 4. Г-образный ступенчатый контур здания кузницы
        const pts = [
            { x: w * 0.29, y: h * 0.04 },
            { x: w * 0.51, y: h * 0.04 },
            { x: w * 0.51, y: h * 0.44 },
            { x: w * 0.91, y: h * 0.44 },
            { x: w * 0.91, y: h * 0.78 },
            { x: w * 0.50, y: h * 0.78 },
            { x: w * 0.50, y: h * 0.87 },
            { x: w * 0.11, y: h * 0.87 },
            { x: w * 0.11, y: h * 0.58 },
            { x: w * 0.29, y: h * 0.58 }
        ];

        // Тень от здания
        ctx.save();
        ctx.translate(2.5, 3.5);
        ctx.fillStyle = 'rgba(18, 15, 10, 0.54)';
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Заливка двухцветной крыши (светлый песочный верх и тёмно-коричневый низ)
        ctx.save();
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();

        ctx.fillStyle = '#c4b898';
        ctx.fill();
        ctx.clip();

        // Тёмно-коричневый нижний скат крыши
        ctx.fillStyle = '#6e4e26';
        ctx.fillRect(w * 0.11, h * 0.61, w * 0.81, h * 0.27);

        // Светлый треугольный скат левого нижнего выступа
        ctx.fillStyle = '#c4b898';
        ctx.beginPath();
        ctx.moveTo(w * 0.11, h * 0.58);
        ctx.lineTo(w * 0.29, h * 0.58);
        ctx.lineTo(w * 0.29, h * 0.74);
        ctx.lineTo(w * 0.11, h * 0.87);
        ctx.closePath();
        ctx.fill();

        // Фактура кровельной дранки/черепицы
        ctx.strokeStyle = 'rgba(38, 26, 10, 0.36)';
        ctx.lineWidth = 1;
        for (let y = h * 0.06; y < h * 0.86; y += 5) {
            for (let x = w * 0.13; x < w * 0.90; x += 6) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + 3, y);
                ctx.stroke();
            }
        }
        ctx.restore();

        // Внешний контур крыши
        ctx.strokeStyle = '#22170a';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();

        // 5. Коньковые балки и диагональные стыки скатов
        ctx.strokeStyle = '#2b1c0c';
        ctx.lineWidth = 2.2;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(w * 0.91, h * 0.61);
        ctx.lineTo(w * 0.29, h * 0.61);
        ctx.lineTo(w * 0.51, h * 0.44);
        ctx.moveTo(w * 0.29, h * 0.61);
        ctx.lineTo(w * 0.29, h * 0.74);
        ctx.lineTo(w * 0.11, h * 0.87);
        ctx.moveTo(w * 0.29, h * 0.74);
        ctx.lineTo(w * 0.50, h * 0.74);
        ctx.stroke();

        // 6. Каменный дымоход у внутреннего края вертикального крыла
        ctx.fillStyle = '#47433e';
        ctx.strokeStyle = '#171512';
        ctx.lineWidth = 1.4;
        ctx.fillRect(w * 0.45, h * 0.22, 6, 11);
        ctx.strokeRect(w * 0.45, h * 0.22, 6, 11);
    },

    shrine(ctx, w, h) {
        // 1. Фон травянистого участка и четыре мощёные дорожки к святилищу
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Мощёные булыжником подходы (север, юг, запад, восток)
        ctx.fillStyle = 'rgba(122, 120, 112, 0.74)';
        for (let t = 2; t < w - 2; t += 5) {
            if (t < h * 0.28 || t > h * 0.72) {
                for (let dx = -7; dx <= 5; dx += 5) {
                    const shift = (Math.floor(t / 5) % 2) * 2;
                    ctx.beginPath();
                    ctx.roundRect(w * 0.49 + dx + shift, t, 3.8, 3.4, 1);
                    ctx.fill();
                }
            }
            if (t < w * 0.28 || t > w * 0.72) {
                for (let dy = -7; dy <= 5; dy += 5) {
                    const shift = (Math.floor(t / 5) % 2) * 2;
                    ctx.beginPath();
                    ctx.roundRect(t, h * 0.49 + dy + shift, 3.4, 3.8, 1);
                    ctx.fill();
                }
            }
        }

        // 2. Садовые кусты по краям поляны
        const drawBush = (bx, by, rx, ry) => {
            ctx.fillStyle = 'rgba(15, 22, 10, 0.42)';
            ctx.beginPath();
            ctx.ellipse(w * bx + 1.5, h * by + 2, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();

            const bushGrad = ctx.createRadialGradient(w * bx - 2, h * by - 2, 1, w * bx, h * by, Math.max(rx, ry));
            bushGrad.addColorStop(0, '#4d6629');
            bushGrad.addColorStop(0.7, '#324519');
            bushGrad.addColorStop(1, '#1d290e');
            ctx.fillStyle = bushGrad;
            ctx.beginPath();
            ctx.ellipse(w * bx, h * by, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();
        };

        drawBush(0.06, 0.24, 5, 11);
        drawBush(0.84, 0.20, 7, 5);
        drawBush(0.11, 0.72, 6, 5);
        drawBush(0.88, 0.74, 8, 9);
        drawBush(0.76, 0.80, 6, 7);

        // 3. Четыре угловые каменные тумбы-жаровни
        const drawCornerPillar = (px, py) => {
            const pSize = 9;
            const x = w * px - pSize / 2;
            const y = h * py - pSize / 2;

            ctx.fillStyle = 'rgba(18, 18, 18, 0.48)';
            ctx.fillRect(x + 1.5, y + 2, pSize, pSize);

            ctx.fillStyle = '#8b8b89';
            ctx.strokeStyle = '#222220';
            ctx.lineWidth = 1.4;
            ctx.fillRect(x, y, pSize, pSize);
            ctx.strokeRect(x, y, pSize, pSize);

            ctx.fillStyle = '#5c5c5a';
            ctx.beginPath();
            ctx.arc(w * px, h * py, 2.2, 0, Math.PI * 2);
            ctx.fill();
        };

        [[0.14, 0.11], [0.86, 0.11], [0.12, 0.88], [0.87, 0.88]].forEach(([px, py]) => drawCornerPillar(px, py));

        // 4. Центральный трёхъярусный ступенчатый алтарь святилища
        const drawStep = (inset, color, lineW) => {
            const size = w * (0.42 - inset * 2);
            const x = (w - size) / 2;
            const y = (h - size) / 2;

            if (inset === 0) {
                ctx.fillStyle = 'rgba(18, 18, 18, 0.54)';
                ctx.fillRect(x + 2.5, y + 3.5, size, size);
            }

            ctx.fillStyle = color;
            ctx.strokeStyle = '#242422';
            ctx.lineWidth = lineW;
            ctx.fillRect(x, y, size, size);
            ctx.strokeRect(x, y, size, size);
        };

        drawStep(0, '#858583', 1.8);
        drawStep(0.045, '#969694', 1.4);
        drawStep(0.085, '#7c7c7a', 1.2);

        // 5. Круглый каменный алтарь-чаша на вершине святилища
        const cx = w * 0.5;
        const cy = h * 0.5;
        ctx.fillStyle = '#666664';
        ctx.strokeStyle = '#1f1f1d';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(cx, cy, 8.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#8c8c8a';
        ctx.beginPath();
        ctx.arc(cx, cy, 5.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Небольшой светлый рельефный знак на диске
        ctx.fillStyle = '#c4c4c2';
        ctx.beginPath();
        ctx.arc(cx, cy - 3.2, 1.3, 0, Math.PI * 2);
        ctx.fill();
    },

    sacred_grove(ctx, w, h) {
        // 1. Фон солнечной лесной поляны
        const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, w * 0.08, w * 0.5, h * 0.5, w * 0.72);
        bgGrad.addColorStop(0, '#c2c985');
        bgGrad.addColorStop(0.55, '#9ea864');
        bgGrad.addColorStop(1, '#85904e');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Мягкое затемнение под кронами деревьев
        ctx.fillStyle = 'rgba(42, 48, 22, 0.25)';
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.5, w * 0.44, 0, Math.PI * 2);
        ctx.fill();

        // 2. Внутреннее кольцо из 7 стоячих камней (менгиров)
        const stones = [
            [0.37, 0.30, 5.2, 4.4, -0.3],
            [0.57, 0.26, 4.8, 3.8, 0.2],
            [0.71, 0.41, 4.6, 5.0, 0.4],
            [0.61, 0.67, 5.0, 4.4, -0.4],
            [0.39, 0.68, 4.8, 3.8, 0.1],
            [0.28, 0.48, 4.2, 5.2, -0.1]
        ];

        stones.forEach(([sx, sy, rx, ry, rot]) => {
            ctx.save();
            ctx.translate(w * sx, h * sy);
            ctx.rotate(rot);

            // Тень от менгира
            ctx.fillStyle = 'rgba(20, 22, 14, 0.48)';
            ctx.beginPath();
            ctx.ellipse(1.5, 2.5, rx + 0.5, ry + 0.5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Сам серый камень
            const sGrad = ctx.createRadialGradient(-rx * 0.3, -ry * 0.3, 1, 0, 0, Math.max(rx, ry));
            sGrad.addColorStop(0, '#c7c5be');
            sGrad.addColorStop(0.65, '#94928b');
            sGrad.addColorStop(1, '#5e5c56');

            ctx.fillStyle = sGrad;
            ctx.strokeStyle = '#1f1e1b';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        });

        // 3. Внешнее кольцо из 8 пышных деревьев и кустов по периметру рощи
        const drawFoliageCluster = (cx, cy, r, seed) => {
            const lobes = 7;
            // Тень от кроны дерева на траву
            ctx.fillStyle = 'rgba(15, 20, 8, 0.46)';
            ctx.beginPath();
            for (let i = 0; i <= lobes * 2; i++) {
                const ang = (Math.PI * 2 / (lobes * 2)) * i;
                const wave = (i % 2 === 0) ? 1.08 : 0.86;
                const px = w * cx + 2.2 + Math.cos(ang) * r * wave;
                const py = h * cy + 2.8 + Math.sin(ang) * r * wave;
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();

            // Зелёная листва с градиентом и тёмной обводкой
            const fGrad = ctx.createRadialGradient(w * cx - r * 0.3, h * cy - r * 0.3, 2, w * cx, h * cy, r * 1.1);
            fGrad.addColorStop(0, '#688c2e');
            fGrad.addColorStop(0.65, '#47631d');
            fGrad.addColorStop(1, '#26380e');

            ctx.fillStyle = fGrad;
            ctx.strokeStyle = '#162107';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            for (let i = 0; i <= lobes * 2; i++) {
                const ang = (Math.PI * 2 / (lobes * 2)) * i + seed;
                const wave = (i % 2 === 0) ? 1.1 : 0.85;
                const px = w * cx + Math.cos(ang) * r * wave;
                const py = h * cy + Math.sin(ang) * r * wave;
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Внутренние складки листвы
            ctx.strokeStyle = 'rgba(22, 34, 8, 0.38)';
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.arc(w * cx - r * 0.15, h * cy - r * 0.1, r * 0.45, 0.4, 2.4);
            ctx.stroke();
        };

        const trees = [
            [0.22, 0.15, 11.5, 0.2],  // верхний левый
            [0.52, 0.09, 9.5, 0.8],   // верхний центральный
            [0.82, 0.16, 11.0, 1.4],  // верхний правый
            [0.14, 0.47, 8.2, 0.5],   // средний левый
            [0.88, 0.52, 10.5, 1.1],  // средний правый
            [0.21, 0.81, 13.0, 0.3],  // нижний левый (крупный)
            [0.51, 0.87, 8.8, 1.7],   // нижний центральный
            [0.81, 0.82, 11.5, 0.9]   // нижний правый
        ];

        trees.forEach(([x, y, r, seed]) => drawFoliageCluster(x, y, r, seed));
    },

    rubble(ctx, w, h) {
        // 1. Фон травянистого участка со светлым вытоптанным центром и пятнами гари
        const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, w * 0.1, w * 0.5, h * 0.5, w * 0.72);
        bgGrad.addColorStop(0, '#c7c29b');
        bgGrad.addColorStop(0.55, '#9ea668');
        bgGrad.addColorStop(1, '#848d4f');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Тёмные пятна гари и золы вдоль левой и правой стен
        ctx.fillStyle = 'rgba(28, 24, 18, 0.34)';
        ctx.beginPath();
        ctx.ellipse(w * 0.16, h * 0.50, 9, 24, 0.1, 0, Math.PI * 2);
        ctx.ellipse(w * 0.86, h * 0.48, 8, 18, -0.1, 0, Math.PI * 2);
        ctx.fill();

        // 2. Мелкий щебень и галька в центре развалин
        ctx.fillStyle = 'rgba(110, 108, 98, 0.65)';
        const gravel = [
            [0.34, 0.24], [0.46, 0.22], [0.52, 0.38], [0.44, 0.45],
            [0.54, 0.50], [0.48, 0.58], [0.64, 0.52], [0.36, 0.64],
            [0.62, 0.66], [0.42, 0.72], [0.58, 0.74]
        ];
        gravel.forEach(([gx, gy]) => {
            ctx.beginPath();
            ctx.roundRect(w * gx, h * gy, 3.6, 3.0, 1);
            ctx.fill();
        });

        // 3. Остатки разрушенного каменного фундамента по периметру
        const drawStone = (x, y, sw, sh, angle = 0) => {
            ctx.save();
            ctx.translate(w * x, h * y);
            ctx.rotate(angle);
            ctx.fillStyle = 'rgba(18, 18, 15, 0.45)';
            ctx.fillRect(-sw / 2 + 1.5, -sh / 2 + 2, sw, sh);

            ctx.fillStyle = '#8b8a82';
            ctx.strokeStyle = '#1f1e1b';
            ctx.lineWidth = 1.3;
            ctx.fillRect(-sw / 2, -sh / 2, sw, sh);
            ctx.strokeRect(-sw / 2, -sh / 2, sw, sh);
            ctx.restore();
        };

        // Верхний левый угол фундамента
        [
            [0.12, 0.10, 8, 6, 0], [0.21, 0.09, 7, 5, 0.1], [0.11, 0.18, 6, 8, 0],
            [0.11, 0.27, 6, 7, -0.1], [0.19, 0.20, 5, 5, 0.2], [0.25, 0.18, 6, 5, -0.15],
            [0.35, 0.10, 5, 5, 0]
        ].forEach(s => drawStone(...s));

        // Верхний правый и правый край фундамента
        [
            [0.75, 0.11, 6, 5, 0.1], [0.85, 0.13, 8, 6, 0], [0.87, 0.22, 6, 8, 0],
            [0.78, 0.22, 5, 6, -0.2], [0.88, 0.36, 5, 7, 0.1], [0.88, 0.72, 6, 7, 0]
        ].forEach(s => drawStone(...s));

        // Нижний левый и нижний правый углы фундамента
        [
            [0.11, 0.64, 6, 7, 0], [0.11, 0.74, 6, 8, 0.05], [0.12, 0.85, 7, 7, 0],
            [0.21, 0.87, 8, 5, -0.05], [0.27, 0.64, 5, 5, 0.3],
            [0.76, 0.88, 8, 6, 0], [0.85, 0.87, 7, 6, 0.05], [0.88, 0.80, 6, 7, 0]
        ].forEach(s => drawStone(...s));

        // 4. Обгоревшие деревянные балки перекрытий в центре и у стен
        const drawBeam = (x, y, bw, bh, angle) => {
            ctx.save();
            ctx.translate(w * x, h * y);
            ctx.rotate(angle);

            ctx.fillStyle = 'rgba(16, 14, 10, 0.50)';
            ctx.fillRect(-bw / 2 + 2, -bh / 2 + 2.5, bw, bh);

            const bGrad = ctx.createLinearGradient(-bw / 2, 0, bw / 2, 0);
            bGrad.addColorStop(0, '#594828');
            bGrad.addColorStop(0.5, '#857042');
            bGrad.addColorStop(1, '#4a3b1f');

            ctx.fillStyle = bGrad;
            ctx.strokeStyle = '#1c160b';
            ctx.lineWidth = 1.3;
            ctx.fillRect(-bw / 2, -bh / 2, bw, bh);
            ctx.strokeRect(-bw / 2, -bh / 2, bw, bh);

            // Продольная трещина дерева
            ctx.strokeStyle = 'rgba(26, 20, 10, 0.55)';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(-bw * 0.35, 0);
            ctx.lineTo(bw * 0.35, 0);
            ctx.stroke();
            ctx.restore();
        };

        // Главные крупные балки в центре и снизу (как на иллюстрации)
        drawBeam(0.50, 0.33, 34, 4.5, -0.44);
        drawBeam(0.39, 0.44, 30, 4.2, 1.48);
        drawBeam(0.62, 0.34, 38, 4.5, 1.24);
        drawBeam(0.58, 0.65, 25, 3.6, 0.32);
        drawBeam(0.52, 0.78, 38, 4.8, 0.0);

        // Мелкие обломки досок слева
        drawBeam(0.29, 0.25, 11, 3.2, -0.95);
        drawBeam(0.20, 0.49, 16, 3.2, 0.02);
    },

    pier(ctx, w, h) {
        // 1. Бирюзовая вода сверху и песчано-травянистый берег снизу
        const waterGrad = ctx.createLinearGradient(0, 0, 0, h * 0.42);
        waterGrad.addColorStop(0, '#0e7490');
        waterGrad.addColorStop(0.65, '#22b8cf');
        waterGrad.addColorStop(1, '#99e9f2');
        ctx.fillStyle = waterGrad;
        ctx.fillRect(0, 0, w, h * 0.42);

        const landGrad = ctx.createLinearGradient(0, h * 0.40, 0, h);
        landGrad.addColorStop(0, '#dcd7b4');
        landGrad.addColorStop(0.35, '#a8b070');
        landGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = landGrad;
        ctx.fillRect(0, h * 0.40, w, h * 0.60);

        // 2. Деревянные лодки на воде (большая парусная и малая шлюпка)
        ctx.save();
        ctx.translate(w * 0.54, h * 0.25);
        ctx.rotate(0.58);
        ctx.fillStyle = 'rgba(10, 25, 30, 0.42)';
        ctx.beginPath();
        ctx.ellipse(2, 3, 21, 7.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#7c5834';
        ctx.strokeStyle = '#1f160d';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-21, 0);
        ctx.quadraticCurveTo(-5, -8.5, 21, 0);
        ctx.quadraticCurveTo(-5, 8.5, -21, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Свёрнутый белый парус и рея поперёк лодки
        ctx.fillStyle = '#e5e7eb';
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.ellipse(3, 0, 2.5, 13, 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Малая шлюпка у пирса
        ctx.save();
        ctx.translate(w * 0.41, h * 0.34);
        ctx.rotate(0.55);
        ctx.fillStyle = '#6b4c2e';
        ctx.strokeStyle = '#1f160d';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.ellipse(0, 0, 8, 2.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 3. Деревянный пирс (вертикальный причал слева + горизонтальный настил)
        const drawDeck = (x, y, dw, dh, isVert) => {
            ctx.fillStyle = '#5c5244';
            ctx.strokeStyle = '#1c1814';
            ctx.lineWidth = 1.5;
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

        drawDeck(w * 0.12, h * 0.03, w * 0.12, h * 0.34, true);
        drawDeck(0, h * 0.36, w, h * 0.13, false);

        // Деревянные сваи по краям причала и пирса
        const drawPiling = (px, py) => {
            ctx.fillStyle = '#787166';
            ctx.strokeStyle = '#171512';
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.arc(w * px, h * py, 2.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        };

        [[0.12, 0.04], [0.24, 0.12], [0.12, 0.22], [0.24, 0.28]].forEach(([x, y]) => drawPiling(x, y));
        for (let sx = 0.04; sx <= 0.96; sx += 0.13) {
            drawPiling(sx, 0.36);
            drawPiling(sx + 0.04, 0.49);
        }

        // 4. Левый серый портовый склад с пристройкой и трубой
        ctx.fillStyle = 'rgba(18, 16, 14, 0.48)';
        ctx.fillRect(w * 0.05, h * 0.56, w * 0.31, h * 0.37);

        ctx.fillStyle = '#9e9b93';
        ctx.strokeStyle = '#1f1d1a';
        ctx.lineWidth = 1.6;
        ctx.fillRect(w * 0.04, h * 0.54, w * 0.30, h * 0.37);
        ctx.strokeRect(w * 0.04, h * 0.54, w * 0.30, h * 0.37);

        // Выступающий тамбур справа и конёк с трубой
        ctx.fillStyle = '#7c7972';
        ctx.fillRect(w * 0.34, h * 0.68, w * 0.07, h * 0.11);
        ctx.strokeRect(w * 0.34, h * 0.68, w * 0.07, h * 0.11);

        ctx.beginPath();
        ctx.moveTo(w * 0.19, h * 0.54);
        ctx.lineTo(w * 0.19, h * 0.91);
        ctx.moveTo(w * 0.34, h * 0.735);
        ctx.lineTo(w * 0.41, h * 0.735);
        ctx.stroke();

        ctx.fillStyle = '#5c5952';
        ctx.fillRect(w * 0.165, h * 0.55, 5, 9);
        ctx.strokeRect(w * 0.165, h * 0.55, 5, 9);

        // 5. Правый П-образный охристо-золотистый склад
        const rPts = [
            { x: w * 0.46, y: h * 0.55 },
            { x: w * 0.56, y: h * 0.55 },
            { x: w * 0.56, y: h * 0.66 },
            { x: w * 0.82, y: h * 0.66 },
            { x: w * 0.82, y: h * 0.55 },
            { x: w * 0.92, y: h * 0.55 },
            { x: w * 0.92, y: h * 0.91 },
            { x: w * 0.46, y: h * 0.91 }
        ];

        ctx.fillStyle = 'rgba(18, 15, 10, 0.48)';
        ctx.beginPath();
        rPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x + 2, p.y + 2.5) : ctx.lineTo(p.x + 2, p.y + 2.5));
        ctx.closePath();
        ctx.fill();

        const rGrad = ctx.createLinearGradient(w * 0.46, h * 0.55, w * 0.92, h * 0.91);
        rGrad.addColorStop(0, '#b89654');
        rGrad.addColorStop(1, '#856224');
        ctx.fillStyle = rGrad;
        ctx.strokeStyle = '#24180a';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        rPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Конёк правого склада и дымоход
        ctx.beginPath();
        ctx.moveTo(w * 0.51, h * 0.55);
        ctx.lineTo(w * 0.51, h * 0.78);
        ctx.lineTo(w * 0.87, h * 0.78);
        ctx.lineTo(w * 0.87, h * 0.55);
        ctx.moveTo(w * 0.46, h * 0.91);
        ctx.lineTo(w * 0.51, h * 0.78);
        ctx.moveTo(w * 0.92, h * 0.91);
        ctx.lineTo(w * 0.87, h * 0.78);
        ctx.stroke();

        ctx.fillStyle = '#6e6a62';
        ctx.fillRect(w * 0.67, h * 0.75, 6, 5);
        ctx.strokeRect(w * 0.67, h * 0.75, 6, 5);

        // 6. Ящики и бочки между пирсом и складами
        ctx.fillStyle = '#735334';
        ctx.fillRect(w * 0.37, h * 0.50, 8, 7);
        ctx.strokeRect(w * 0.37, h * 0.50, 8, 7);

        [[0.46, 0.51], [0.42, 0.58], [0.40, 0.64], [0.65, 0.61], [0.71, 0.61]].forEach(([bx, by]) => {
            ctx.fillStyle = '#3f3a32';
            ctx.beginPath();
            ctx.arc(w * bx, h * by, 3.0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });
    },

    park(ctx, w, h) {
        // 1. Фон солнечной парковой лужайки
        const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, w * 0.1, w * 0.5, h * 0.5, w * 0.72);
        bgGrad.addColorStop(0, '#b5bd7d');
        bgGrad.addColorStop(0.55, '#9ea668');
        bgGrad.addColorStop(1, '#879052');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        const cx = w * 0.52;
        const cy = h * 0.48;

        // 2. Три грунтово-гравийные дорожки, расходящиеся от центрального фонтана
        ctx.strokeStyle = '#736c58';
        ctx.lineWidth = 7.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        // Верхняя левая тропа
        ctx.moveTo(w * 0.10, 0);
        ctx.quadraticCurveTo(w * 0.30, h * 0.24, cx, cy);
        // Нижняя левая тропа
        ctx.moveTo(w * 0.13, h);
        ctx.quadraticCurveTo(w * 0.32, h * 0.72, cx, cy);
        // Правая горизонтальная тропа
        ctx.moveTo(cx, cy);
        ctx.quadraticCurveTo(w * 0.76, h * 0.51, w, h * 0.52);
        ctx.stroke();

        // Круглая гравийная площадка вокруг фонтана и текстура гальки
        ctx.fillStyle = '#7d7560';
        ctx.beginPath();
        ctx.arc(cx, cy, 13.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(46, 42, 34, 0.38)';
        for (let i = 0; i < 45; i++) {
            const t = i / 45;
            const px1 = w * (0.10 + t * 0.42) + ((i % 3) - 1) * 1.8;
            const py1 = h * (t * 0.48) + ((i % 2) - 0.5) * 1.8;
            ctx.fillRect(px1, py1, 1.5, 1.5);

            const px2 = w * (0.13 + t * 0.39) + ((i % 2) - 0.5) * 1.8;
            const py2 = h * (1 - t * 0.52) + ((i % 3) - 1) * 1.8;
            ctx.fillRect(px2, py2, 1.5, 1.5);
        }

        // 3. Центральный круглый каменный фонтан с голубой водой
        ctx.fillStyle = 'rgba(18, 22, 14, 0.48)';
        ctx.beginPath();
        ctx.arc(cx + 1.5, cy + 2, 10.2, 0, Math.PI * 2);
        ctx.fill();

        // Каменный бортик фонтана
        ctx.fillStyle = '#5c5850';
        ctx.strokeStyle = '#1f1e1b';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(cx, cy, 9.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Водная гладь фонтана
        const waterGrad = ctx.createRadialGradient(cx - 2, cy - 2, 1, cx, cy, 7.2);
        waterGrad.addColorStop(0, '#bae6fd');
        waterGrad.addColorStop(0.55, '#38bdf8');
        waterGrad.addColorStop(1, '#0284c7');

        ctx.fillStyle = waterGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 7.0, 0, Math.PI * 2);
        ctx.fill();

        // Центральная форсунка фонтана
        ctx.fillStyle = '#33302b';
        ctx.beginPath();
        ctx.arc(cx, cy, 2.0, 0, Math.PI * 2);
        ctx.fill();

        // 4. Группы кустов и деревьев в секторах парка
        const drawShrub = (bx, by, r) => {
            ctx.fillStyle = 'rgba(15, 20, 10, 0.44)';
            ctx.beginPath();
            ctx.arc(w * bx + 1.5, h * by + 1.8, r, 0, Math.PI * 2);
            ctx.fill();

            const sGrad = ctx.createRadialGradient(w * bx - r * 0.3, h * by - r * 0.3, 1, w * bx, h * by, r);
            sGrad.addColorStop(0, '#536b29');
            sGrad.addColorStop(0.65, '#354719');
            sGrad.addColorStop(1, '#1d290d');
            ctx.fillStyle = sGrad;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, r, 0, Math.PI * 2);
            ctx.fill();
        };

        // Левый сектор вдоль дорожек
        [
            [0.06, 0.28, 4.5], [0.14, 0.33, 5.2], [0.22, 0.38, 4.2],
            [0.10, 0.45, 5.0], [0.18, 0.50, 4.0], [0.26, 0.53, 4.5],
            [0.12, 0.72, 4.5]
        ].forEach(([x, y, r]) => drawShrub(x, y, r));

        // Верхний центральный сектор
        [
            [0.38, 0.08, 4.5], [0.47, 0.12, 4.2], [0.43, 0.22, 5.2],
            [0.51, 0.23, 5.0], [0.59, 0.20, 4.0]
        ].forEach(([x, y, r]) => drawShrub(x, y, r));

        // Правый верхний сектор
        [
            [0.74, 0.11, 3.8], [0.85, 0.14, 4.2], [0.76, 0.25, 4.5], [0.87, 0.32, 3.8]
        ].forEach(([x, y, r]) => drawShrub(x, y, r));

        // Правый нижний сектор (крупная куртина кустов)
        [
            [0.64, 0.67, 5.2], [0.73, 0.65, 4.5], [0.83, 0.66, 5.0],
            [0.60, 0.77, 4.0], [0.70, 0.79, 5.5], [0.80, 0.82, 5.2],
            [0.90, 0.79, 4.8], [0.86, 0.90, 4.5]
        ].forEach(([x, y, r]) => drawShrub(x, y, r));
    },

    orphanage(ctx, w, h) {
        // 1. Фон травянистого участка и мощёная дорожка сверху по центру во двор
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(118, 116, 108, 0.75)';
        for (let y = 2; y < h * 0.48; y += 5) {
            for (let dx = -7; dx <= 5; dx += 5) {
                const shift = (Math.floor(y / 5) % 2) * 2;
                ctx.beginPath();
                ctx.roundRect(w * 0.49 + dx + shift, y, 4.0, 3.5, 1.1);
                ctx.fill();
            }
        }

        // 2. Каменная ограда парадного двора сверху со столбами и воротами по центру
        ctx.strokeStyle = '#1f2124';
        ctx.lineWidth = 4.2;
        ctx.beginPath();
        ctx.moveTo(w * 0.11, h * 0.34);
        ctx.lineTo(w * 0.11, h * 0.06);
        ctx.lineTo(w * 0.42, h * 0.06);
        ctx.moveTo(w * 0.58, h * 0.06);
        ctx.lineTo(w * 0.89, h * 0.06);
        ctx.lineTo(w * 0.89, h * 0.34);
        ctx.stroke();

        ctx.strokeStyle = '#8b9096';
        ctx.lineWidth = 2.2;
        ctx.stroke();

        // Опорные столбы ограды (угловые и воротные)
        [
            [0.11, 0.06], [0.42, 0.06], [0.58, 0.06], [0.89, 0.06]
        ].forEach(([px, py]) => {
            ctx.fillStyle = '#73787e';
            ctx.strokeStyle = '#1a1c1e';
            ctx.lineWidth = 1.4;
            ctx.fillRect(w * px - 3.2, h * py - 3.2, 6.4, 6.4);
            ctx.strokeRect(w * px - 3.2, h * py - 3.2, 6.4, 6.4);
        });

        // 3. Два зелёных дерева/куста во внутреннем дворе по бокам от дорожки
        const drawTree = (tx, ty, r) => {
            ctx.fillStyle = 'rgba(15, 22, 10, 0.42)';
            ctx.beginPath();
            ctx.arc(w * tx + 1.5, h * ty + 2, r, 0, Math.PI * 2);
            ctx.fill();

            const tGrad = ctx.createRadialGradient(w * tx - 2, h * ty - 2, 1, w * tx, h * ty, r);
            tGrad.addColorStop(0, '#627d32');
            tGrad.addColorStop(0.7, '#415720');
            tGrad.addColorStop(1, '#263612');
            ctx.fillStyle = tGrad;
            ctx.beginPath();
            ctx.arc(w * tx, h * ty, r, 0, Math.PI * 2);
            ctx.fill();
        };

        drawTree(0.27, 0.21, 8.5);
        drawTree(0.73, 0.21, 8.0);

        // 4. П-образный контур здания приюта (открыт вверх во двор)
        const pts = [
            { x: w * 0.08, y: h * 0.33 },
            { x: w * 0.32, y: h * 0.33 },
            { x: w * 0.32, y: h * 0.47 },
            { x: w * 0.68, y: h * 0.47 },
            { x: w * 0.68, y: h * 0.33 },
            { x: w * 0.92, y: h * 0.33 },
            { x: w * 0.92, y: h * 0.87 },
            { x: w * 0.08, y: h * 0.87 }
        ];

        // Тень от здания
        ctx.save();
        ctx.translate(2.5, 3.5);
        ctx.fillStyle = 'rgba(18, 14, 14, 0.55)';
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Заливка красновато-коричневой черепичной крыши
        ctx.save();
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();

        const roofGrad = ctx.createLinearGradient(w * 0.08, h * 0.33, w * 0.92, h * 0.87);
        roofGrad.addColorStop(0, '#594240');
        roofGrad.addColorStop(0.5, '#785a57');
        roofGrad.addColorStop(1, '#473331');
        ctx.fillStyle = roofGrad;
        ctx.fill();
        ctx.clip();

        // Мелкая текстура черепицы
        ctx.strokeStyle = 'rgba(26, 18, 18, 0.42)';
        ctx.lineWidth = 1;
        for (let y = h * 0.34; y < h * 0.86; y += 4.5) {
            const shift = (Math.floor(y / 4.5) % 2) * 2.5;
            for (let x = w * 0.09; x < w * 0.91; x += 5) {
                ctx.strokeRect(x + shift, y, 4.5, 4);
            }
        }
        ctx.restore();

        // Внешний контур крыши
        ctx.strokeStyle = '#1f1616';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();

        // 5. Коньковые балки крыши (светлые гребни в тёмной окантовке)
        const drawRidge = (drawFn) => {
            ctx.strokeStyle = '#1f1616';
            ctx.lineWidth = 3.2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            drawFn();
            ctx.stroke();

            ctx.strokeStyle = '#9c8a86';
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            drawFn();
            ctx.stroke();
        };

        drawRidge(() => {
            ctx.moveTo(w * 0.20, h * 0.33);
            ctx.lineTo(w * 0.20, h * 0.66);
            ctx.lineTo(w * 0.80, h * 0.66);
            ctx.lineTo(w * 0.80, h * 0.33);

            ctx.moveTo(w * 0.08, h * 0.87);
            ctx.lineTo(w * 0.20, h * 0.66);
            ctx.moveTo(w * 0.92, h * 0.87);
            ctx.lineTo(w * 0.80, h * 0.66);
            ctx.moveTo(w * 0.32, h * 0.47);
            ctx.lineTo(w * 0.20, h * 0.66);
            ctx.moveTo(w * 0.68, h * 0.47);
            ctx.lineTo(w * 0.80, h * 0.66);
        });

        // 6. Три треугольных слуховых окна на внутреннем скате и двойной дымоход снизу
        [0.36, 0.50, 0.64].forEach(dx => {
            ctx.fillStyle = '#8a624a';
            ctx.strokeStyle = '#241610';
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.moveTo(w * dx, h * 0.63);
            ctx.lineTo(w * (dx - 0.055), h * 0.51);
            ctx.lineTo(w * (dx + 0.055), h * 0.51);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(w * dx, h * 0.63);
            ctx.lineTo(w * dx, h * 0.51);
            ctx.stroke();
        });

        // Двойной дымоход на нижнем скате
        ctx.fillStyle = '#4a4342';
        ctx.strokeStyle = '#171414';
        ctx.lineWidth = 1.4;
        ctx.fillRect(w * 0.43, h * 0.72, w * 0.14, h * 0.07);
        ctx.strokeRect(w * 0.43, h * 0.72, w * 0.14, h * 0.07);

        ctx.fillStyle = '#171414';
        ctx.beginPath();
        ctx.arc(w * 0.475, h * 0.755, 1.8, 0, Math.PI * 2);
        ctx.arc(w * 0.525, h * 0.755, 1.8, 0, Math.PI * 2);
        ctx.fill();
    },

    monument(ctx, w, h) {
        // 1. Фон травянистого участка и четыре мощёные дорожки со всех сторон
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Мощёные подходы (север, юг, запад, восток)
        ctx.fillStyle = 'rgba(122, 120, 112, 0.74)';
        for (let t = 2; t < w - 2; t += 5) {
            // Север и юг
            if (t < h * 0.14 || t > h * 0.85) {
                for (let dx = -7; dx <= 5; dx += 5) {
                    const shift = (Math.floor(t / 5) % 2) * 2;
                    ctx.beginPath();
                    ctx.roundRect(w * 0.49 + dx + shift, t, 3.8, 3.4, 1);
                    ctx.fill();
                }
            }
            // Запад и восток
            if (t < w * 0.14 || t > w * 0.85) {
                for (let dy = -7; dy <= 5; dy += 5) {
                    const shift = (Math.floor(t / 5) % 2) * 2;
                    ctx.beginPath();
                    ctx.roundRect(t, h * 0.49 + dy + shift, 3.4, 3.8, 1);
                    ctx.fill();
                }
            }
        }

        // 2. Тёмно-зелёные кусты по четырём углам участка
        const drawBush = (bx, by, rx, ry) => {
            ctx.fillStyle = 'rgba(15, 22, 10, 0.45)';
            ctx.beginPath();
            ctx.ellipse(w * bx + 1.5, h * by + 2, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();

            const bushGrad = ctx.createRadialGradient(w * bx - 2, h * by - 2, 1, w * bx, h * by, Math.max(rx, ry));
            bushGrad.addColorStop(0, '#4d6629');
            bushGrad.addColorStop(0.7, '#324519');
            bushGrad.addColorStop(1, '#1d290e');
            ctx.fillStyle = bushGrad;
            ctx.beginPath();
            ctx.ellipse(w * bx, h * by, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();
        };

        drawBush(0.08, 0.12, 7, 10);
        drawBush(0.16, 0.22, 6, 5);
        drawBush(0.88, 0.14, 9, 8);
        drawBush(0.12, 0.89, 10, 6);
        drawBush(0.89, 0.88, 9, 7);

        // 3. Основная квадратная каменная платформа монумента
        const padX = w * 0.15;
        const padY = h * 0.14;
        const padSize = w * 0.70;

        ctx.fillStyle = 'rgba(18, 18, 18, 0.54)';
        ctx.fillRect(padX + 2.5, padY + 3.5, padSize, padSize);

        const stoneGrad = ctx.createLinearGradient(padX, padY, padX + padSize, padY + padSize);
        stoneGrad.addColorStop(0, '#9a9a98');
        stoneGrad.addColorStop(0.5, '#858583');
        stoneGrad.addColorStop(1, '#6b6b69');
        ctx.fillStyle = stoneGrad;
        ctx.strokeStyle = '#242422';
        ctx.lineWidth = 2.0;
        ctx.fillRect(padX, padY, padSize, padSize);
        ctx.strokeRect(padX, padY, padSize, padSize);

        // Текстура каменных трещин и швов на платформе
        ctx.strokeStyle = 'rgba(32, 32, 30, 0.35)';
        ctx.lineWidth = 1;
        for (let y = padY + 8; y < padY + padSize - 6; y += 9) {
            ctx.beginPath();
            ctx.moveTo(padX + 6, y);
            ctx.lineTo(padX + padSize - 6, y + ((y % 18 === 0) ? 1.5 : -1.5));
            ctx.stroke();
        }

        // 4. Внешний и внутренний ряды круглых каменных тумб (столбиков)
        const drawBollard = (bx, by) => {
            ctx.fillStyle = '#3d3d3b';
            ctx.beginPath();
            ctx.arc(bx + 1, by + 1, 2.2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#a8a8a6';
            ctx.strokeStyle = '#1f1f1d';
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.arc(bx, by, 2.0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        };

        // Внешний периметр столбиков (по 5 на сторону)
        for (let i = 0; i <= 4; i++) {
            const pos = padX + 3 + (padSize - 6) * (i / 4);
            drawBollard(pos, padY + 3);
            drawBollard(pos, padY + padSize - 3);
            if (i > 0 && i < 4) {
                drawBollard(padX + 3, pos);
                drawBollard(padX + padSize - 3, pos);
            }
        }

        // Внутренний квадрат столбиков вокруг пьедестала
        const inRingOffset = 13;
        for (let i = 0; i <= 3; i++) {
            const pos = padX + inRingOffset + (padSize - inRingOffset * 2) * (i / 3);
            drawBollard(pos, padY + inRingOffset);
            drawBollard(pos, padY + padSize - inRingOffset);
            if (i > 0 && i < 3) {
                drawBollard(padX + inRingOffset, pos);
                drawBollard(padX + padSize - inRingOffset, pos);
            }
        }

        // 5. Центральный возвышающийся квадратный пьедестал
        const pedSize = w * 0.31;
        const pedX = (w - pedSize) / 2;
        const pedY = (h - pedSize) / 2;

        ctx.fillStyle = 'rgba(18, 18, 18, 0.50)';
        ctx.fillRect(pedX + 2, pedY + 2.5, pedSize, pedSize);

        ctx.fillStyle = '#7c7c7a';
        ctx.strokeStyle = '#222220';
        ctx.lineWidth = 1.8;
        ctx.fillRect(pedX, pedY, pedSize, pedSize);
        ctx.strokeRect(pedX, pedY, pedSize, pedSize);

        // Внутренний зубчатый уступ обелиска
        const capInset = 4.5;
        ctx.fillStyle = '#8f8f8d';
        ctx.strokeStyle = '#2b2b29';
        ctx.lineWidth = 1.4;
        ctx.fillRect(pedX + capInset, pedY + capInset, pedSize - capInset * 2, pedSize - capInset * 2);
        ctx.strokeRect(pedX + capInset, pedY + capInset, pedSize - capInset * 2, pedSize - capInset * 2);
    },

    mint(ctx, w, h) {
        // 1. Фон травянистого участка со светлой тропой сверху и мощёной дорогой снизу
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(218, 212, 174, 0.35)';
        ctx.fillRect(w * 0.42, 0, w * 0.16, h * 0.15);

        // Мощёная булыжником дорожка от фасада вниз по центру
        ctx.fillStyle = 'rgba(118, 116, 108, 0.75)';
        for (let y = h * 0.74; y < h - 2; y += 5) {
            for (let dx = -8; dx <= 6; dx += 5) {
                const shift = (Math.floor(y / 5) % 2) * 2;
                ctx.beginPath();
                ctx.roundRect(w * 0.49 + dx + shift, y, 4.0, 3.5, 1.1);
                ctx.fill();
            }
        }

        // Хелпер для отрисовки каменной крыши с булыжной текстурой и зубчатым парапетом
        const drawStoneTier = (pts, baseColor) => {
            ctx.save();
            ctx.translate(2.5, 3.5);
            ctx.fillStyle = 'rgba(18, 18, 20, 0.55)';
            ctx.beginPath();
            pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            ctx.save();
            ctx.beginPath();
            pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
            ctx.closePath();
            ctx.fillStyle = baseColor;
            ctx.fill();
            ctx.clip();

            // Мозаика крупного серого камня на крыше
            for (let y = h * 0.10; y < h * 0.74; y += 4.8) {
                const shift = (Math.floor(y / 4.8) % 2) * 2.8;
                for (let x = w * 0.08; x < w * 0.92; x += 5.5) {
                    ctx.fillStyle = ((Math.floor(x + y)) % 3 === 0) ? '#9aa0a8' : '#6e737b';
                    ctx.strokeStyle = '#26292e';
                    ctx.lineWidth = 0.8;
                    ctx.fillRect(x + shift, y, 4.6, 3.8);
                    ctx.strokeRect(x + shift, y, 4.6, 3.8);
                }
            }
            ctx.restore();

            // Зубчатый парапет по контуру яруса
            ctx.strokeStyle = '#1e2024';
            ctx.lineWidth = 3.2;
            ctx.lineJoin = 'round';
            ctx.beginPath();
            pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
            ctx.closePath();
            ctx.stroke();

            ctx.setLineDash([2.2, 2.2]);
            ctx.strokeStyle = '#b4b9c2';
            ctx.lineWidth = 1.6;
            ctx.stroke();
            ctx.setLineDash([]);
        };

        // 2. Нижний прямоугольный ярус (боковые крылья монетного двора)
        const basePts = [
            { x: w * 0.09, y: h * 0.36 },
            { x: w * 0.91, y: h * 0.36 },
            { x: w * 0.91, y: h * 0.72 },
            { x: w * 0.09, y: h * 0.72 }
        ];
        drawStoneTier(basePts, '#7d828a');

        // 3. Верхний шестиугольный центральный бастион
        const topPts = [
            { x: w * 0.39, y: h * 0.11 },
            { x: w * 0.61, y: h * 0.11 },
            { x: w * 0.72, y: h * 0.32 },
            { x: w * 0.72, y: h * 0.62 },
            { x: w * 0.28, y: h * 0.62 },
            { x: w * 0.28, y: h * 0.32 }
        ];
        drawStoneTier(topPts, '#868b94');

        // 4. Деревянные дощатые люки на крыше (центральный и два боковых)
        const drawHatch = (hx, hy, hw, hh) => {
            ctx.fillStyle = '#735334';
            ctx.strokeStyle = '#1f160d';
            ctx.lineWidth = 1.3;
            ctx.fillRect(w * hx, h * hy, hw, hh);
            ctx.strokeRect(w * hx, h * hy, hw, hh);

            ctx.beginPath();
            for (let ly = h * hy + 3.5; ly < h * hy + hh - 1; ly += 3.5) {
                ctx.moveTo(w * hx, ly);
                ctx.lineTo(w * hx + hw, ly);
            }
            ctx.stroke();
        };

        // Центральный большой люк
        drawHatch(0.425, 0.30, w * 0.15, h * 0.14);
        // Боковые малые люки на крыльях
        drawHatch(0.16, 0.51, 7, 7);
        drawHatch(0.77, 0.51, 7, 7);
    },

    mill(ctx, w, h) {
        // 1. Фон травянистого участка и бирюзовая река вдоль левого края
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Светлая песчаная береговая полоса и река слева
        ctx.fillStyle = '#dcd7b4';
        ctx.fillRect(0, 0, w * 0.27, h);

        const waterGrad = ctx.createLinearGradient(0, 0, w * 0.24, 0);
        waterGrad.addColorStop(0, '#0e7490');
        waterGrad.addColorStop(0.65, '#38bdf8');
        waterGrad.addColorStop(1, '#a5f3fc');
        ctx.fillStyle = waterGrad;
        ctx.fillRect(0, 0, w * 0.23, h);

        // 2. Мощёная булыжником дорога из центрального двора вправо
        ctx.fillStyle = 'rgba(130, 128, 118, 0.72)';
        for (let x = w * 0.68; x < w - 2; x += 5) {
            for (let dy = -6; dy <= 4; dy += 5) {
                const shift = (Math.floor(x / 5) % 2) * 2;
                ctx.beginPath();
                ctx.roundRect(x, h * 0.50 + dy + shift, 3.8, 3.4, 1);
                ctx.fill();
            }
        }

        // 3. Водяное колесо в реке у левой стены мельницы
        const wheelX = w * 0.16;
        const wheelY = h * 0.25;
        const wheelW = w * 0.11;
        const wheelH = h * 0.50;

        ctx.fillStyle = 'rgba(12, 24, 28, 0.45)';
        ctx.fillRect(wheelX - 2, wheelY + 2, wheelW + 3, wheelH);

        const wheelGrad = ctx.createLinearGradient(wheelX, 0, wheelX + wheelW, 0);
        wheelGrad.addColorStop(0, '#5c4328');
        wheelGrad.addColorStop(0.5, '#b09160');
        wheelGrad.addColorStop(1, '#4a351e');
        ctx.fillStyle = wheelGrad;
        ctx.strokeStyle = '#1f160d';
        ctx.lineWidth = 1.6;
        ctx.fillRect(wheelX, wheelY, wheelW, wheelH);
        ctx.strokeRect(wheelX, wheelY, wheelW, wheelH);

        // Поперечные лопасти водяного колеса и ось
        ctx.lineWidth = 1.3;
        for (let py = wheelY + 5; py < wheelY + wheelH - 3; py += 6) {
            ctx.beginPath();
            ctx.moveTo(wheelX - 1.5, py);
            ctx.lineTo(wheelX + wheelW + 1.5, py);
            ctx.stroke();
        }
        ctx.fillStyle = '#3b2a18';
        ctx.fillRect(wheelX - 2.5, h * 0.48, 3, 5);

        // 4. Бочки во внутреннем дворе мельницы
        const drawBarrel = (bx, by, r = 3.6) => {
            ctx.fillStyle = '#47423b';
            ctx.strokeStyle = '#171512';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        };
        drawBarrel(0.70, 0.34, 3.6);
        drawBarrel(0.70, 0.66, 3.6);
        drawBarrel(0.77, 0.68, 3.4);

        // 5. П-образный контур здания мельницы (открыт вправо)
        const pts = [
            { x: w * 0.27, y: h * 0.08 },
            { x: w * 0.84, y: h * 0.08 },
            { x: w * 0.84, y: h * 0.31 },
            { x: w * 0.66, y: h * 0.31 },
            { x: w * 0.66, y: h * 0.69 },
            { x: w * 0.84, y: h * 0.69 },
            { x: w * 0.84, y: h * 0.91 },
            { x: w * 0.27, y: h * 0.91 }
        ];

        // Тень от здания
        ctx.save();
        ctx.translate(2.5, 3.5);
        ctx.fillStyle = 'rgba(18, 15, 10, 0.52)';
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Заливка двухцветной охристо-песочной крыши
        ctx.save();
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();

        // Светлый песочный базовый цвет (левый и верхний скаты)
        ctx.fillStyle = '#c4b388';
        ctx.fill();
        ctx.clip();

        // Тёплая янтарно-коричневая заливка правого и нижних скатов
        ctx.fillStyle = '#8f6224';
        ctx.fillRect(w * 0.49, h * 0.19, w * 0.36, h * 0.72);

        // Светлый верхний скат нижнего крыла
        ctx.fillStyle = '#c4b388';
        ctx.fillRect(w * 0.49, h * 0.69, w * 0.36, h * 0.11);

        // Мелкая фактура черепицы
        ctx.strokeStyle = 'rgba(42, 28, 10, 0.38)';
        ctx.lineWidth = 1;
        for (let y = h * 0.10; y < h * 0.90; y += 4.5) {
            const shift = (Math.floor(y / 4.5) % 2) * 2.5;
            for (let x = w * 0.28; x < w * 0.83; x += 5) {
                ctx.strokeRect(x + shift, y, 4.5, 4);
            }
        }
        ctx.restore();

        // Внешний контур крыши
        ctx.strokeStyle = '#24180a';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();

        // 6. Коньковые балки крыши и диагональные стыки крыльев
        ctx.strokeStyle = '#2e1f0d';
        ctx.lineWidth = 2.2;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(w * 0.84, h * 0.19);
        ctx.lineTo(w * 0.49, h * 0.19);
        ctx.lineTo(w * 0.49, h * 0.80);
        ctx.lineTo(w * 0.84, h * 0.80);

        ctx.moveTo(w * 0.27, h * 0.08);
        ctx.lineTo(w * 0.49, h * 0.19);
        ctx.moveTo(w * 0.27, h * 0.91);
        ctx.lineTo(w * 0.49, h * 0.80);
        ctx.moveTo(w * 0.66, h * 0.31);
        ctx.lineTo(w * 0.49, h * 0.19);
        ctx.moveTo(w * 0.66, h * 0.69);
        ctx.lineTo(w * 0.49, h * 0.80);
        ctx.stroke();

        // 7. Каменный дымоход в центре левого ската
        ctx.fillStyle = '#787268';
        ctx.strokeStyle = '#1c1714';
        ctx.lineWidth = 1.4;
        ctx.fillRect(w * 0.42, h * 0.45, 7, 10);
        ctx.strokeRect(w * 0.42, h * 0.45, 7, 10);
    },

    mansion(ctx, w, h) {
        // 1. Фон травянистого сада со светлой мощёной площадкой справа
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(218, 212, 174, 0.45)';
        ctx.fillRect(w * 0.50, h * 0.30, w * 0.48, h * 0.40);

        // 2. Садовые кусты в правом верхнем и правом нижнем углах
        const drawBush = (bx, by, rx, ry) => {
            ctx.fillStyle = 'rgba(15, 22, 10, 0.45)';
            ctx.beginPath();
            ctx.ellipse(w * bx + 1.5, h * by + 2, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();

            const bushGrad = ctx.createRadialGradient(w * bx - 2, h * by - 2, 1, w * bx, h * by, Math.max(rx, ry));
            bushGrad.addColorStop(0, '#4d6629');
            bushGrad.addColorStop(0.7, '#324519');
            bushGrad.addColorStop(1, '#1d290e');
            ctx.fillStyle = bushGrad;
            ctx.beginPath();
            ctx.ellipse(w * bx, h * by, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();
        };

        drawBush(0.78, 0.14, 10, 7);
        drawBush(0.88, 0.22, 8, 9);
        drawBush(0.82, 0.30, 4.5, 4.5);
        drawBush(0.84, 0.72, 11, 8);
        drawBush(0.76, 0.85, 12, 9);
        drawBush(0.92, 0.86, 8, 8);

        // 3. Прямоугольный декоративный бассейн с голубой водой справа
        const poolX = w * 0.64;
        const poolY = h * 0.41;
        const poolW = w * 0.27;
        const poolH = h * 0.17;

        ctx.fillStyle = 'rgba(18, 20, 18, 0.45)';
        ctx.fillRect(poolX + 2, poolY + 2, poolW, poolH);

        const waterGrad = ctx.createLinearGradient(poolX, poolY, poolX + poolW, poolY + poolH);
        waterGrad.addColorStop(0, '#0284c7');
        waterGrad.addColorStop(0.5, '#38bdf8');
        waterGrad.addColorStop(1, '#0369a1');

        ctx.fillStyle = waterGrad;
        ctx.strokeStyle = '#57534e';
        ctx.lineWidth = 2.0;
        ctx.fillRect(poolX, poolY, poolW, poolH);
        ctx.strokeRect(poolX, poolY, poolW, poolH);

        // Каменный фонтан/вазон на правом бортике бассейна
        ctx.fillStyle = '#3f3d38';
        ctx.strokeStyle = '#171614';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(poolX + poolW - 1, poolY + poolH * 0.5, 3.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 4. Выступающее крыльцо-портик в центре внутреннего двора
        ctx.fillStyle = '#75665e';
        ctx.strokeStyle = '#1f1916';
        ctx.lineWidth = 1.5;
        ctx.fillRect(w * 0.48, h * 0.40, w * 0.09, h * 0.19);
        ctx.strokeRect(w * 0.48, h * 0.40, w * 0.09, h * 0.19);
        ctx.beginPath();
        ctx.moveTo(w * 0.48, h * 0.495);
        ctx.lineTo(w * 0.57, h * 0.495);
        ctx.stroke();

        // 5. П-образный контур особняка (открыт вправо)
        const pts = [
            { x: w * 0.11, y: h * 0.08 },
            { x: w * 0.67, y: h * 0.08 },
            { x: w * 0.67, y: h * 0.28 },
            { x: w * 0.48, y: h * 0.28 },
            { x: w * 0.48, y: h * 0.71 },
            { x: w * 0.67, y: h * 0.71 },
            { x: w * 0.67, y: h * 0.91 },
            { x: w * 0.11, y: h * 0.91 }
        ];

        // Тень от здания
        ctx.save();
        ctx.translate(2.5, 3.5);
        ctx.fillStyle = 'rgba(18, 15, 14, 0.54)';
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

        const roofGrad = ctx.createLinearGradient(w * 0.11, h * 0.08, w * 0.67, h * 0.91);
        roofGrad.addColorStop(0, '#7a6b63');
        roofGrad.addColorStop(0.5, '#96877e');
        roofGrad.addColorStop(1, '#5e5049');
        ctx.fillStyle = roofGrad;
        ctx.fill();
        ctx.clip();

        // Мелкая фактура черепицы
        ctx.strokeStyle = 'rgba(28, 22, 20, 0.38)';
        ctx.lineWidth = 1;
        for (let y = h * 0.10; y < h * 0.90; y += 4.5) {
            const shift = (Math.floor(y / 4.5) % 2) * 2.5;
            for (let x = w * 0.12; x < w * 0.66; x += 5) {
                ctx.strokeRect(x + shift, y, 4.5, 4);
            }
        }
        ctx.restore();

        // Внешний контур крыши
        ctx.strokeStyle = '#1f1916';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();

        // 6. Коньковые балки крыши и диагональные стыки крыльев
        ctx.strokeStyle = '#29211d';
        ctx.lineWidth = 2.2;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(w * 0.67, h * 0.18);
        ctx.lineTo(w * 0.29, h * 0.18);
        ctx.lineTo(w * 0.29, h * 0.81);
        ctx.lineTo(w * 0.67, h * 0.81);

        ctx.moveTo(w * 0.11, h * 0.08);
        ctx.lineTo(w * 0.29, h * 0.18);
        ctx.moveTo(w * 0.11, h * 0.91);
        ctx.lineTo(w * 0.29, h * 0.81);
        ctx.moveTo(w * 0.48, h * 0.28);
        ctx.lineTo(w * 0.29, h * 0.18);
        ctx.moveTo(w * 0.48, h * 0.71);
        ctx.lineTo(w * 0.29, h * 0.81);
        ctx.stroke();

        // 7. Двойной каменный дымоход на главном коньке
        ctx.fillStyle = '#8c8580';
        ctx.strokeStyle = '#1c1715';
        ctx.lineWidth = 1.4;
        ctx.fillRect(w * 0.25, h * 0.44, 8, 12);
        ctx.strokeRect(w * 0.25, h * 0.44, 8, 12);

        ctx.fillStyle = '#1c1715';
        ctx.beginPath();
        ctx.arc(w * 0.29, h * 0.475, 1.8, 0, Math.PI * 2);
        ctx.arc(w * 0.29, h * 0.525, 1.8, 0, Math.PI * 2);
        ctx.fill();
    },

    magic_shop(ctx, w, h) {
        // 1. Фон травянистого участка и мощёные дорожки сверху и снизу
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(138, 136, 126, 0.74)';
        const cobbles = [
            [0.36, 0.04], [0.42, 0.07], [0.35, 0.11], [0.41, 0.14], [0.37, 0.19],
            [0.34, 0.86], [0.40, 0.88], [0.36, 0.93], [0.42, 0.94]
        ];
        cobbles.forEach(([cx, cy]) => {
            ctx.beginPath();
            ctx.roundRect(w * cx, h * cy, 4.2, 3.6, 1.1);
            ctx.fill();
        });

        // 2. Внешний реквизит: ящики, бочка и синий магический шар слева
        const drawCrate = (x, y, cw, ch, rot = 0, color = '#6b533b') => {
            ctx.save();
            ctx.translate(w * x, h * y);
            ctx.rotate(rot);
            ctx.fillStyle = color;
            ctx.strokeStyle = '#1c1814';
            ctx.lineWidth = 1.2;
            ctx.fillRect(-cw / 2, -ch / 2, cw, ch);
            ctx.strokeRect(-cw / 2, -ch / 2, cw, ch);
            ctx.restore();
        };

        drawCrate(0.24, 0.21, 8, 8, 0, '#786248');
        drawCrate(0.18, 0.30, 10, 8, -0.45, '#5e4933');
        drawCrate(0.22, 0.87, 6, 8, 0, '#78736a');

        // Синяя сфера/кадушка у левого верхнего края и бочка снизу слева
        ctx.fillStyle = '#1d4ed8';
        ctx.strokeStyle = '#171512';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(w * 0.27, h * 0.37, 4.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#47423b';
        ctx.beginPath();
        ctx.arc(w * 0.27, h * 0.76, 4.0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 3. Деревянная пристройка-навес под нижней гранью и каменная лестница сверху
        ctx.save();
        ctx.translate(w * 0.45, h * 0.77);
        ctx.rotate(0.20);
        ctx.fillStyle = '#735334';
        ctx.strokeStyle = '#1f160d';
        ctx.lineWidth = 1.4;
        ctx.fillRect(-13, -7, 26, 13);
        ctx.strokeRect(-13, -7, 26, 13);
        ctx.beginPath();
        ctx.moveTo(2, -7);
        ctx.lineTo(2, 6);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.translate(w * 0.44, h * 0.23);
        ctx.rotate(-0.42);
        ctx.fillStyle = '#9c9a92';
        ctx.strokeStyle = '#1f201d';
        ctx.lineWidth = 1.4;
        ctx.fillRect(-6, -8, 12, 15);
        ctx.strokeRect(-6, -8, 12, 15);
        for (let sy = -5; sy <= 4; sy += 3) {
            ctx.beginPath();
            ctx.moveTo(-6, sy);
            ctx.lineTo(6, sy);
            ctx.stroke();
        }
        ctx.restore();

        // 4. Треугольный каменный корпус лавки
        const outerPts = [
            { x: w * 0.08, y: h * 0.45 },
            { x: w * 0.10, y: h * 0.62 },
            { x: w * 0.80, y: h * 0.85 },
            { x: w * 0.90, y: h * 0.73 },
            { x: w * 0.76, y: h * 0.16 },
            { x: w * 0.64, y: h * 0.13 }
        ];

        // Тень от здания
        ctx.save();
        ctx.translate(2.5, 3.5);
        ctx.fillStyle = 'rgba(18, 16, 12, 0.54)';
        ctx.beginPath();
        outerPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Внешняя каменная кладка стен (парапет)
        ctx.save();
        ctx.beginPath();
        outerPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fillStyle = '#999488';
        ctx.fill();
        ctx.clip();

        // Текстура булыжной кладки по краям стен
        ctx.strokeStyle = 'rgba(30, 28, 24, 0.45)';
        ctx.lineWidth = 1.1;
        for (let y = h * 0.12; y < h * 0.86; y += 5) {
            const shift = (Math.floor(y / 5) % 2) * 3;
            for (let x = w * 0.08; x < w * 0.90; x += 6) {
                ctx.strokeRect(x + shift, y, 5, 4);
            }
        }
        ctx.restore();

        ctx.strokeStyle = '#1f1d1a';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        outerPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();

        // 5. Внутренняя углублённая песчано-охристая крыша в каменной оправе
        const innerPts = [
            { x: w * 0.21, y: h * 0.48 },
            { x: w * 0.23, y: h * 0.57 },
            { x: w * 0.72, y: h * 0.72 },
            { x: w * 0.77, y: h * 0.66 },
            { x: w * 0.67, y: h * 0.27 },
            { x: w * 0.61, y: h * 0.26 }
        ];

        const roofGrad = ctx.createLinearGradient(w * 0.2, h * 0.3, w * 0.75, h * 0.7);
        roofGrad.addColorStop(0, '#c9a673');
        roofGrad.addColorStop(1, '#a6824e');
        ctx.fillStyle = roofGrad;
        ctx.strokeStyle = '#33302b';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        innerPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 6. Тёмный дымоход и люк на внутренней крыше
        drawCrate(0.51, 0.39, 8, 5, -0.4, '#47433d');
        drawCrate(0.61, 0.54, 7, 7, -0.4, '#7c6244');
    },

    luxury_store(ctx, w, h) {
        // 1. Фон травянистого участка со светлой дорогой снизу
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(218, 212, 174, 0.45)';
        ctx.fillRect(w * 0.08, h * 0.72, w * 0.42, h * 0.28);

        // Мощёные булыжником дорожки снизу слева и справа
        ctx.fillStyle = 'rgba(122, 120, 112, 0.74)';
        const cobbles = [
            [0.14, 0.56], [0.19, 0.62], [0.15, 0.69], [0.21, 0.74], [0.16, 0.81], [0.22, 0.88],
            [0.72, 0.72], [0.78, 0.76], [0.74, 0.83], [0.80, 0.88], [0.73, 0.93]
        ];
        cobbles.forEach(([cx, cy]) => {
            ctx.beginPath();
            ctx.roundRect(w * cx, h * cy, 4.2, 3.6, 1.1);
            ctx.fill();
        });

        // 2. Реквизит у стен: бордовый тюк слева и бочка снизу справа
        ctx.fillStyle = '#7f1d1d';
        ctx.strokeStyle = '#1f1212';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(w * 0.25, h * 0.76, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#47433b';
        ctx.strokeStyle = '#171512';
        ctx.beginPath();
        ctx.arc(w * 0.59, h * 0.92, 4.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Треугольный козырёк-навес в левом внутреннем углу
        ctx.fillStyle = '#85583a';
        ctx.strokeStyle = '#24150c';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(w * 0.29, h * 0.57);
        ctx.lineTo(w * 0.16, h * 0.61);
        ctx.lineTo(w * 0.29, h * 0.71);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 3. Крестообразный контур здания лавки роскоши
        const pts = [
            { x: w * 0.29, y: h * 0.06 },
            { x: w * 0.73, y: h * 0.06 },
            { x: w * 0.73, y: h * 0.14 },
            { x: w * 0.90, y: h * 0.14 },
            { x: w * 0.90, y: h * 0.56 },
            { x: w * 0.73, y: h * 0.56 },
            { x: w * 0.73, y: h * 0.87 },
            { x: w * 0.29, y: h * 0.87 },
            { x: w * 0.29, y: h * 0.56 },
            { x: w * 0.11, y: h * 0.56 },
            { x: w * 0.11, y: h * 0.14 },
            { x: w * 0.29, y: h * 0.14 }
        ];

        // Тень от здания
        ctx.save();
        ctx.translate(2.5, 3.5);
        ctx.fillStyle = 'rgba(20, 14, 10, 0.54)';
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Заливка медно-терракотовой крыши
        ctx.save();
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();

        // Светлая терракотово-кремовая левая часть
        ctx.fillStyle = '#c48f6c';
        ctx.fill();
        ctx.clip();

        // Светлый блик на левом верхнем крыле
        ctx.fillStyle = '#d9b59c';
        ctx.fillRect(w * 0.11, h * 0.14, w * 0.24, h * 0.21);

        // Тёмная медно-коричневая правая половина центрального нефа
        ctx.fillStyle = '#6b4733';
        ctx.fillRect(w * 0.51, h * 0.06, w * 0.40, h * 0.82);

        // Тёмные нижние скаты обоих боковых крыльев
        ctx.fillStyle = '#4d3223';
        ctx.fillRect(w * 0.11, h * 0.35, w * 0.30, h * 0.22);
        ctx.fillRect(w * 0.61, h * 0.35, w * 0.30, h * 0.22);

        // Мелкая штриховка черепицы вдоль карнизов
        ctx.strokeStyle = 'rgba(32, 18, 12, 0.45)';
        ctx.lineWidth = 1.1;
        for (let x = w * 0.13; x < w * 0.88; x += 5) {
            ctx.beginPath();
            ctx.moveTo(x, h * 0.06);
            ctx.lineTo(x, h * 0.09);
            ctx.moveTo(x, h * 0.14);
            ctx.lineTo(x, h * 0.17);
            ctx.moveTo(x, h * 0.84);
            ctx.lineTo(x, h * 0.87);
            ctx.stroke();
        }
        ctx.restore();

        // Внешний контур крыши
        ctx.strokeStyle = '#24140c';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();

        // 4. Коньковые балки и диагональные стыки крыльев
        ctx.strokeStyle = '#2b180e';
        ctx.lineWidth = 2.0;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(w * 0.51, h * 0.06);
        ctx.lineTo(w * 0.51, h * 0.87);

        // Левое крыло
        ctx.moveTo(w * 0.11, h * 0.35);
        ctx.lineTo(w * 0.41, h * 0.35);
        ctx.moveTo(w * 0.29, h * 0.14);
        ctx.lineTo(w * 0.41, h * 0.35);
        ctx.lineTo(w * 0.29, h * 0.56);

        // Правое крыло
        ctx.moveTo(w * 0.90, h * 0.35);
        ctx.lineTo(w * 0.61, h * 0.35);
        ctx.moveTo(w * 0.73, h * 0.14);
        ctx.lineTo(w * 0.61, h * 0.35);
        ctx.lineTo(w * 0.73, h * 0.56);
        ctx.stroke();

        // 5. Дымоходы и слуховые люки на крыше
        ctx.fillStyle = '#756f68';
        ctx.strokeStyle = '#1c1614';
        ctx.lineWidth = 1.3;
        // Дымоход на левом крыле
        ctx.fillRect(w * 0.18, h * 0.24, 10, 6);
        ctx.strokeRect(w * 0.18, h * 0.24, 10, 6);
        // Дымоход внизу слева на центральном скате
        ctx.fillRect(w * 0.36, h * 0.67, 7, 10);
        ctx.strokeRect(w * 0.36, h * 0.67, 7, 10);
        // Люк на правом крыле
        ctx.fillStyle = '#5c524a';
        ctx.fillRect(w * 0.77, h * 0.22, 7, 7);
        ctx.strokeRect(w * 0.77, h * 0.22, 7, 7);
    },

    library(ctx, w, h) {
        // 1. Фон травянистого участка и мощёная тропинка снизу по центру
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(122, 120, 112, 0.74)';
        for (let y = h * 0.86; y < h - 2; y += 5) {
            for (let dx = -7; dx <= 5; dx += 5) {
                const shift = (Math.floor(y / 5) % 2) * 2;
                ctx.beginPath();
                ctx.roundRect(w * 0.49 + dx + shift, y, 4, 3.5, 1.1);
                ctx.fill();
            }
        }

        // 2. Ящик и бочка у левого нижнего угла здания
        ctx.fillStyle = '#4a4339';
        ctx.strokeStyle = '#171512';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(w * 0.22, h * 0.74, 3.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(w * 0.23, h * 0.63);
        ctx.rotate(-0.35);
        ctx.fillStyle = '#5c5346';
        ctx.fillRect(-5, -4, 9, 7);
        ctx.strokeRect(-5, -4, 9, 7);
        ctx.restore();

        // 3. Крестообразный контур здания библиотеки
        const pts = [
            { x: w * 0.27, y: h * 0.06 },
            { x: w * 0.73, y: h * 0.06 },
            { x: w * 0.73, y: h * 0.14 },
            { x: w * 0.90, y: h * 0.14 },
            { x: w * 0.90, y: h * 0.56 },
            { x: w * 0.73, y: h * 0.56 },
            { x: w * 0.73, y: h * 0.87 },
            { x: w * 0.27, y: h * 0.87 },
            { x: w * 0.27, y: h * 0.56 },
            { x: w * 0.10, y: h * 0.56 },
            { x: w * 0.10, y: h * 0.14 },
            { x: w * 0.27, y: h * 0.14 }
        ];

        // Тень от здания
        ctx.save();
        ctx.translate(2.5, 3.5);
        ctx.fillStyle = 'rgba(18, 16, 12, 0.52)';
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Заливка крыши: светлый левый и верхний скаты, тёмный правый и нижние скаты крыльев
        ctx.save();
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();

        // Базовый светло-песочный цвет левой части
        ctx.fillStyle = '#b5a888';
        ctx.fill();
        ctx.clip();

        // Тёмная правая половина центрального нефа
        ctx.fillStyle = '#736852';
        ctx.fillRect(w * 0.50, h * 0.06, w * 0.42, h * 0.82);

        // Светлые верхние скаты обоих боковых крыльев
        ctx.fillStyle = '#b5a888';
        ctx.fillRect(w * 0.10, h * 0.14, w * 0.28, h * 0.21);
        ctx.fillRect(w * 0.62, h * 0.14, w * 0.28, h * 0.21);

        // Тёмные нижние скаты обоих боковых крыльев
        ctx.fillStyle = '#6b604b';
        ctx.fillRect(w * 0.10, h * 0.35, w * 0.28, h * 0.22);
        ctx.fillRect(w * 0.62, h * 0.35, w * 0.28, h * 0.22);

        // Мелкая штриховка черепицы вдоль карнизов
        ctx.strokeStyle = 'rgba(32, 26, 18, 0.45)';
        ctx.lineWidth = 1.1;
        for (let x = w * 0.12; x < w * 0.88; x += 5) {
            ctx.beginPath();
            ctx.moveTo(x, h * 0.06);
            ctx.lineTo(x, h * 0.09);
            ctx.moveTo(x, h * 0.14);
            ctx.lineTo(x, h * 0.17);
            ctx.moveTo(x, h * 0.53);
            ctx.lineTo(x, h * 0.56);
            ctx.moveTo(x, h * 0.84);
            ctx.lineTo(x, h * 0.87);
            ctx.stroke();
        }
        ctx.restore();

        // Внешний контур крыши
        ctx.strokeStyle = '#1f1b14';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();

        // 4. Коньковые балки и диагональные стыки крыльев
        ctx.strokeStyle = '#292218';
        ctx.lineWidth = 2.0;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        // Главный вертикальный конёк
        ctx.moveTo(w * 0.50, h * 0.06);
        ctx.lineTo(w * 0.50, h * 0.87);

        // Левое крыло (горизонтальный конёк и V-стык)
        ctx.moveTo(w * 0.10, h * 0.35);
        ctx.lineTo(w * 0.40, h * 0.35);
        ctx.moveTo(w * 0.27, h * 0.14);
        ctx.lineTo(w * 0.40, h * 0.35);
        ctx.lineTo(w * 0.27, h * 0.56);

        // Правое крыло (горизонтальный конёк и V-стык)
        ctx.moveTo(w * 0.90, h * 0.35);
        ctx.lineTo(w * 0.60, h * 0.35);
        ctx.moveTo(w * 0.73, h * 0.14);
        ctx.lineTo(w * 0.60, h * 0.35);
        ctx.lineTo(w * 0.73, h * 0.56);
        ctx.stroke();

        // 5. Дымоход на левом крыле и люк на правом крыле
        ctx.fillStyle = '#78736a';
        ctx.strokeStyle = '#1c1917';
        ctx.lineWidth = 1.3;
        ctx.fillRect(w * 0.16, h * 0.24, 11, 6);
        ctx.strokeRect(w * 0.16, h * 0.24, 11, 6);

        ctx.fillStyle = '#5c5850';
        ctx.fillRect(w * 0.77, h * 0.22, 7, 7);
        ctx.strokeRect(w * 0.77, h * 0.22, 7, 7);
    },

    jail(ctx, w, h) {
        // 1. Фон травянистого участка
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // 2. Диагональная мощёная тропинка (сверху слева вниз направо)
        ctx.fillStyle = 'rgba(138, 136, 126, 0.75)';
        for (let t = 0.04; t <= 0.96; t += 0.06) {
            const px = w * (0.20 + t * 0.44);
            const py = h * t;
            ctx.beginPath();
            ctx.roundRect(px - 4, py, 4.2, 3.6, 1.1);
            ctx.roundRect(px + 2, py + 2, 4.0, 3.4, 1.1);
            ctx.fill();
        }

        // 3. Бочки снаружи у левой и нижней стен
        const drawBarrel = (bx, by, r = 3.8) => {
            ctx.fillStyle = '#3b3730';
            ctx.strokeStyle = '#171512';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        };

        drawBarrel(0.14, 0.56, 4.0);
        drawBarrel(0.66, 0.87, 3.8);
        drawBarrel(0.75, 0.81, 3.6);

        // 4. Повёрнутый корпус каменной тюрьмы
        ctx.save();
        ctx.translate(w * 0.49, h * 0.48);
        ctx.rotate(-0.42);

        const size = w * 0.54;
        const half = size / 2;

        // Деревянная пристройка/крыльцо у верхней стены
        ctx.fillStyle = '#8c6e42';
        ctx.strokeStyle = '#221a0f';
        ctx.lineWidth = 1.4;
        ctx.fillRect(-2, -half - 11, 21, 11);
        ctx.strokeRect(-2, -half - 11, 21, 11);
        ctx.beginPath();
        ctx.moveTo(5, -half - 11);
        ctx.lineTo(5, -half);
        ctx.moveTo(12, -half - 11);
        ctx.lineTo(12, -half);
        ctx.stroke();

        // Тень от здания тюрьмы
        ctx.fillStyle = 'rgba(18, 18, 15, 0.52)';
        ctx.fillRect(-half + 3, -half + 4, size, size);

        // Внешние толстые светло-серые каменные стены
        ctx.fillStyle = '#c4c2b8';
        ctx.strokeStyle = '#1f201d';
        ctx.lineWidth = 2.0;
        ctx.fillRect(-half, -half, size, size);
        ctx.strokeRect(-half, -half, size, size);

        // Округлый каменный контрфорс в правом нижнем углу
        ctx.fillStyle = '#8c8a80';
        ctx.beginPath();
        ctx.arc(half, half, 5.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Углублённая оливково-серая плоская крыша
        const inner = size - 10;
        const inHalf = inner / 2;
        const roofGrad = ctx.createLinearGradient(-inHalf, -inHalf, inHalf, inHalf);
        roofGrad.addColorStop(0, '#85856c');
        roofGrad.addColorStop(1, '#a3a288');

        ctx.fillStyle = roofGrad;
        ctx.strokeStyle = '#38382e';
        ctx.lineWidth = 1.4;
        ctx.fillRect(-inHalf, -inHalf, inner, inner);
        ctx.strokeRect(-inHalf, -inHalf, inner, inner);

        // 5. Деревянный люк/надстройка на крыше и тень от него
        ctx.fillStyle = 'rgba(20, 20, 15, 0.45)';
        ctx.fillRect(0, -10, 7, 13);

        ctx.fillStyle = '#82673d';
        ctx.strokeStyle = '#221a0f';
        ctx.lineWidth = 1.3;
        ctx.fillRect(6, -12, 9, 16);
        ctx.strokeRect(6, -12, 9, 16);

        ctx.beginPath();
        ctx.moveTo(6, -4);
        ctx.lineTo(15, -4);
        ctx.moveTo(6, 0);
        ctx.lineTo(15, 0);
        ctx.stroke();

        // 6. Две круглые трубы/вентиляции в нижней части крыши
        ctx.fillStyle = '#525048';
        ctx.strokeStyle = '#1c1b18';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(-1, inHalf - 7, 4.0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#1c1b18';
        ctx.beginPath();
        ctx.arc(-1, inHalf - 7, 1.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#757368';
        ctx.beginPath();
        ctx.arc(7, inHalf - 6, 2.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    },

    inn(ctx, w, h) {
        // 1. Фон травянистого участка и светлая площадка у входа снизу
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(218, 212, 174, 0.48)';
        ctx.beginPath();
        ctx.ellipse(w * 0.45, h * 0.85, w * 0.24, h * 0.16, 0, 0, Math.PI * 2);
        ctx.fill();

        // Мощёная булыжником тропинка снизу по центру
        ctx.fillStyle = 'rgba(118, 116, 108, 0.74)';
        const cobbles = [
            [0.38, 0.74], [0.44, 0.73], [0.40, 0.80], [0.46, 0.79],
            [0.37, 0.86], [0.43, 0.85], [0.49, 0.86], [0.41, 0.92],
            [0.47, 0.92]
        ];
        cobbles.forEach(([cx, cy]) => {
            ctx.beginPath();
            ctx.roundRect(w * cx, h * cy, 4.2, 3.6, 1.1);
            ctx.fill();
        });

        // 2. Внешний реквизит: бочки и синяя кадушка с водой
        const drawBarrel = (bx, by, r = 3.6) => {
            ctx.fillStyle = '#47423b';
            ctx.strokeStyle = '#171512';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        };

        // Бочки сверху и снизу
        drawBarrel(0.28, 0.14, 3.8);
        drawBarrel(0.39, 0.12, 3.8);
        drawBarrel(0.27, 0.78, 3.8);
        drawBarrel(0.46, 0.70, 3.5);
        drawBarrel(0.54, 0.77, 3.8);
        drawBarrel(0.59, 0.69, 3.5);

        // Голубая кадушка с водой сверху справа
        ctx.fillStyle = '#38bdf8';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(w * 0.55, h * 0.09, 4.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 3. Повёрнутое здание постоялого двора
        ctx.save();
        ctx.translate(w * 0.46, h * 0.41);
        ctx.rotate(-0.24);

        // Ящик справа у нижнего входа
        ctx.fillStyle = '#635644';
        ctx.strokeStyle = '#1f1912';
        ctx.lineWidth = 1.2;
        ctx.fillRect(16, 25, 8, 8);
        ctx.strokeRect(16, 25, 8, 8);

        const rw = w * 0.70;
        const rh = h * 0.46;
        const rx = -rw / 2;
        const ry = -rh / 2;

        // Тень от здания
        ctx.fillStyle = 'rgba(18, 15, 10, 0.52)';
        ctx.fillRect(rx + 3, ry + 3.5, rw, rh);

        // Верхний светло-охристый скат и нижний тёмно-коричневый скат крыши
        ctx.fillStyle = '#b59d63';
        ctx.fillRect(rx, ry, rw, rh * 0.46);
        ctx.fillStyle = '#7c6438';
        ctx.fillRect(rx, ry + rh * 0.46, rw, rh * 0.54);

        // Мелкая штриховка соломы по краям крыши
        ctx.strokeStyle = 'rgba(38, 26, 10, 0.45)';
        ctx.lineWidth = 1.1;
        for (let x = rx + 4; x < rx + rw - 4; x += 5) {
            ctx.beginPath();
            ctx.moveTo(x, ry);
            ctx.lineTo(x + 0.5, ry + 4.5);
            ctx.moveTo(x, ry + rh - 4.5);
            ctx.lineTo(x + 0.5, ry + rh);
            ctx.stroke();
        }

        // Контур крыши
        ctx.strokeStyle = '#22180c';
        ctx.lineWidth = 2.0;
        ctx.strokeRect(rx, ry, rw, rh);

        // 4. Продольное коньковое бревно
        const ridgeY = ry + rh * 0.46;
        ctx.fillStyle = '#9c8654';
        ctx.strokeStyle = '#1f160b';
        ctx.lineWidth = 1.4;
        ctx.fillRect(rx - 2, ridgeY - 2.2, rw + 4, 4.4);
        ctx.strokeRect(rx - 2, ridgeY - 2.2, rw + 4, 4.4);

        // 5. Три треугольных слуховых окна на нижнем скате
        [-19, 0, 19].forEach(dx => {
            ctx.fillStyle = '#a38952';
            ctx.strokeStyle = '#22180c';
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.moveTo(dx, ridgeY + 3);
            ctx.lineTo(dx - 6.5, ridgeY + 14);
            ctx.lineTo(dx + 6.5, ridgeY + 14);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(dx, ridgeY + 3);
            ctx.lineTo(dx, ridgeY + 14);
            ctx.stroke();
        });

        // 6. Каменный дымоход у правого края конька
        ctx.fillStyle = '#8c8881';
        ctx.strokeStyle = '#1c1917';
        ctx.lineWidth = 1.5;
        ctx.fillRect(rx + rw - 11, ridgeY - 5, 8, 10);
        ctx.strokeRect(rx + rw - 11, ridgeY - 5, 8, 10);

        ctx.fillStyle = '#1c1917';
        ctx.fillRect(rx + rw - 9, ridgeY - 3, 4, 6);

        ctx.restore();
    },

    festival_hall(ctx, w, h) {
        // 1. Фон травянистого участка со светлой дорогой слева и мощёным двором справа
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(218, 212, 174, 0.50)';
        ctx.fillRect(0, h * 0.14, w * 0.22, h * 0.68);

        // Мощёный булыжником дворик справа
        ctx.fillStyle = 'rgba(122, 120, 112, 0.72)';
        const cobbles = [
            [0.60, 0.42], [0.66, 0.40], [0.73, 0.43], [0.80, 0.41],
            [0.62, 0.49], [0.69, 0.47], [0.76, 0.50], [0.83, 0.48],
            [0.61, 0.56], [0.68, 0.55], [0.75, 0.57], [0.82, 0.56]
        ];
        cobbles.forEach(([cx, cy]) => {
            ctx.beginPath();
            ctx.roundRect(w * cx, h * cy, 4.2, 3.6, 1.1);
            ctx.fill();
        });

        // 2. Бочки и ящики вдоль левой стены
        const drawBarrel = (bx, by, r = 3.8) => {
            ctx.fillStyle = '#3b342c';
            ctx.strokeStyle = '#171411';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        };

        drawBarrel(0.09, 0.16, 3.6);
        drawBarrel(0.11, 0.27, 4.0);
        drawBarrel(0.08, 0.72, 4.0);
        drawBarrel(0.14, 0.77, 3.5);

        ctx.save();
        ctx.translate(w * 0.12, h * 0.39);
        ctx.rotate(0.25);
        ctx.fillStyle = '#4a3d2f';
        ctx.strokeStyle = '#171411';
        ctx.lineWidth = 1.2;
        ctx.fillRect(-4, -5, 8, 10);
        ctx.strokeRect(-4, -5, 8, 10);
        ctx.restore();

        // 3. П-образный контур зала празднеств (открыт вправо)
        const pts = [
            { x: w * 0.15, y: h * 0.08 },
            { x: w * 0.87, y: h * 0.08 },
            { x: w * 0.87, y: h * 0.32 },
            { x: w * 0.55, y: h * 0.32 },
            { x: w * 0.55, y: h * 0.67 },
            { x: w * 0.87, y: h * 0.67 },
            { x: w * 0.87, y: h * 0.91 },
            { x: w * 0.15, y: h * 0.91 }
        ];

        // Тень от здания
        ctx.save();
        ctx.translate(2.5, 3.5);
        ctx.fillStyle = 'rgba(18, 14, 14, 0.54)';
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Заливка коричневато-лиловой черепичной крыши
        ctx.save();
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();

        const roofGrad = ctx.createLinearGradient(w * 0.15, h * 0.08, w * 0.87, h * 0.91);
        roofGrad.addColorStop(0, '#856c6a');
        roofGrad.addColorStop(0.42, '#9c8280');
        roofGrad.addColorStop(0.55, '#66504e');
        roofGrad.addColorStop(1, '#54403e');
        ctx.fillStyle = roofGrad;
        ctx.fill();
        ctx.clip();

        // Затемнение внутреннего правого ската
        ctx.fillStyle = 'rgba(34, 24, 24, 0.42)';
        ctx.fillRect(w * 0.36, h * 0.08, w * 0.52, h * 0.83);

        // Мелкая фактура черепицы
        ctx.strokeStyle = 'rgba(28, 20, 20, 0.36)';
        ctx.lineWidth = 1;
        for (let y = h * 0.10; y < h * 0.90; y += 5) {
            for (let x = w * 0.17; x < w * 0.85; x += 6) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + 3, y);
                ctx.stroke();
            }
        }
        ctx.restore();

        // Внешний контур крыши
        ctx.strokeStyle = '#1f1818';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();

        // 4. Коньковые балки крыши (П-образный хребет и диагональные стыки)
        ctx.strokeStyle = '#261d1d';
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(w * 0.87, h * 0.20);
        ctx.lineTo(w * 0.36, h * 0.20);
        ctx.lineTo(w * 0.36, h * 0.79);
        ctx.lineTo(w * 0.87, h * 0.79);

        ctx.moveTo(w * 0.15, h * 0.08);
        ctx.lineTo(w * 0.36, h * 0.20);
        ctx.moveTo(w * 0.15, h * 0.91);
        ctx.lineTo(w * 0.36, h * 0.79);
        ctx.moveTo(w * 0.55, h * 0.32);
        ctx.lineTo(w * 0.36, h * 0.20);
        ctx.moveTo(w * 0.55, h * 0.67);
        ctx.lineTo(w * 0.36, h * 0.79);
        ctx.stroke();

        // 5. Каменный дымоход на левом скате и два треугольных слуховых окна справа
        ctx.fillStyle = '#756a68';
        ctx.strokeStyle = '#1c1616';
        ctx.lineWidth = 1.4;
        ctx.fillRect(w * 0.27, h * 0.45, 7, 10);
        ctx.strokeRect(w * 0.27, h * 0.45, 7, 10);

        [0.41, 0.58].forEach(dy => {
            ctx.fillStyle = '#8a7371';
            ctx.strokeStyle = '#1f1818';
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(w * 0.36, h * dy);
            ctx.lineTo(w * 0.50, h * (dy - 0.06));
            ctx.lineTo(w * 0.50, h * (dy + 0.06));
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(w * 0.36, h * dy);
            ctx.lineTo(w * 0.50, h * dy);
            ctx.stroke();
        });
    },

    illicit_market(ctx, w, h) {
        this.brewery(ctx, w, h);
    },
    herbalist(ctx, w, h) {
        // 1. Фон травянистого участка со светлой тропой справа
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8c9456');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(218, 212, 174, 0.45)';
        ctx.beginPath();
        ctx.ellipse(w * 0.82, h * 0.65, w * 0.16, h * 0.28, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // 2. Мелкие камни у левого входа
        ctx.fillStyle = 'rgba(115, 113, 104, 0.72)';
        const stones = [
            [0.09, 0.36], [0.15, 0.38], [0.11, 0.43],
            [0.17, 0.45], [0.08, 0.49], [0.14, 0.51]
        ];
        stones.forEach(([sx, sy]) => {
            ctx.beginPath();
            ctx.roundRect(w * sx, h * sy, 3.8, 3.2, 1);
            ctx.fill();
        });

        // 3. Бочки и каменный порог по периметру
        const drawBarrel = (bx, by, r = 3.8) => {
            ctx.fillStyle = '#4f483e';
            ctx.strokeStyle = '#1c1814';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        };

        drawBarrel(0.19, 0.16, 4.0);
        drawBarrel(0.81, 0.26, 4.2);
        drawBarrel(0.77, 0.36, 3.6);

        // Каменное крыльцо снизу
        ctx.fillStyle = '#8c8a82';
        ctx.strokeStyle = '#1f1d1a';
        ctx.lineWidth = 1.4;
        ctx.fillRect(w * 0.43, h * 0.81, 10, 7);
        ctx.strokeRect(w * 0.43, h * 0.81, 10, 7);

        // Деревянные выступы у левой стены
        ctx.fillStyle = '#7c6244';
        ctx.fillRect(w * 0.20, h * 0.28, 4, 9);
        ctx.strokeRect(w * 0.20, h * 0.28, 4, 9);
        ctx.fillRect(w * 0.21, h * 0.63, 4, 9);
        ctx.strokeRect(w * 0.21, h * 0.63, 4, 9);

        // 4. Основная двускатная соломенная крыша
        const rx = w * 0.24;
        const ry = h * 0.09;
        const rw = w * 0.52;
        const rh = h * 0.72;

        // Тень от дома
        ctx.fillStyle = 'rgba(18, 15, 10, 0.50)';
        ctx.fillRect(rx + 3, ry + 3.5, rw, rh);

        // Градиент соломенной кровли (левый скат светлее, правый темнее)
        const roofGrad = ctx.createLinearGradient(rx, ry, rx + rw, ry);
        roofGrad.addColorStop(0, '#a68653');
        roofGrad.addColorStop(0.58, '#c2a370');
        roofGrad.addColorStop(0.62, '#8a6838');
        roofGrad.addColorStop(1, '#6e5026');

        ctx.fillStyle = roofGrad;
        ctx.strokeStyle = '#241a0d';
        ctx.lineWidth = 2.0;
        ctx.fillRect(rx, ry, rw, rh);
        ctx.strokeRect(rx, ry, rw, rh);

        // Фактура пучков соломы по всей площади крыши
        ctx.strokeStyle = 'rgba(42, 28, 12, 0.44)';
        ctx.lineWidth = 1.1;
        for (let y = ry + 5; y < ry + rh - 3; y += 5.5) {
            const shift = (Math.floor(y / 5.5) % 2) * 3;
            for (let x = rx + 3; x < rx + rw - 4; x += 6.5) {
                ctx.beginPath();
                ctx.moveTo(x + shift, y);
                ctx.lineTo(x + shift + 4, y + 0.6);
                ctx.stroke();
            }
        }

        // 5. Массивное коньковое бревно (смещено чуть правее центра)
        const ridgeX = rx + rw * 0.59;
        ctx.fillStyle = '#5c4628';
        ctx.strokeStyle = '#1f160b';
        ctx.lineWidth = 1.4;
        ctx.fillRect(ridgeX - 2.2, ry - 2, 4.4, rh + 4);
        ctx.strokeRect(ridgeX - 2.2, ry - 2, 4.4, rh + 4);
    },

    granary(ctx, w, h) {
        // 1. Фон травянистого участка и светлая вытоптанная дорога снизу
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#8d9658');
        bgGrad.addColorStop(0.5, '#a1aa6b');
        bgGrad.addColorStop(1, '#8c9458');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(218, 212, 174, 0.58)';
        ctx.beginPath();
        ctx.ellipse(w * 0.45, h * 0.82, w * 0.38, h * 0.22, -0.25, 0, Math.PI * 2);
        ctx.fill();

        // Мелкая галька и булыжники на дороге снизу
        ctx.fillStyle = 'rgba(115, 113, 104, 0.72)';
        const pebbles = [
            [0.24, 0.72], [0.30, 0.78], [0.22, 0.85], [0.35, 0.86],
            [0.64, 0.74], [0.72, 0.71], [0.68, 0.80], [0.76, 0.84],
            [0.82, 0.77], [0.61, 0.87]
        ];
        pebbles.forEach(([px, py]) => {
            ctx.beginPath();
            ctx.roundRect(w * px, h * py, 3.8, 3.2, 1);
            ctx.fill();
        });

        // 2. Внешние бочки и ящики вокруг амбара
        const drawBarrel = (bx, by, r = 3.5) => {
            ctx.fillStyle = '#47433b';
            ctx.strokeStyle = '#171512';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        };
        drawBarrel(0.75, 0.36, 3.6);
        drawBarrel(0.72, 0.44, 3.4);
        drawBarrel(0.32, 0.68, 3.8);

        // 3. Повёрнутый по диагонали амбар с пристройками
        ctx.save();
        ctx.translate(w * 0.46, h * 0.47);
        ctx.rotate(-0.48);

        // Ящик у правого верхнего угла крыши
        ctx.fillStyle = '#5c4b32';
        ctx.strokeStyle = '#1f1910';
        ctx.lineWidth = 1.2;
        ctx.fillRect(21, -27, 6, 9);
        ctx.strokeRect(21, -27, 6, 9);

        // Тень от всего комплекса амбара
        ctx.fillStyle = 'rgba(18, 16, 12, 0.50)';
        ctx.fillRect(-19, -35, 43, 56);
        ctx.fillRect(-11, 20, 21, 18);

        // Правая нижняя пристройка-навес
        ctx.fillStyle = '#8c897a';
        ctx.strokeStyle = '#22211c';
        ctx.lineWidth = 1.6;
        ctx.fillRect(5, 13, 18, 13);
        ctx.strokeRect(5, 13, 18, 13);

        // Основной корпус амбара (двускатная крыша)
        // Левый тёмно-оливковый скат
        ctx.fillStyle = '#878772';
        ctx.fillRect(-21, -37, 16, 54);
        // Правый светло-серый дощатый скат
        ctx.fillStyle = '#b3b0a2';
        ctx.fillRect(-5, -37, 26, 50);

        // Поперечные доски на правом скате
        ctx.strokeStyle = 'rgba(42, 40, 34, 0.42)';
        ctx.lineWidth = 1;
        for (let y = -33; y <= 10; y += 4.2) {
            ctx.beginPath();
            ctx.moveTo(-4, y);
            ctx.lineTo(19, y);
            ctx.stroke();
        }

        // Штриховка карниза по левому краю
        for (let y = -34; y <= 14; y += 4.5) {
            ctx.beginPath();
            ctx.moveTo(-21, y);
            ctx.lineTo(-17, y);
            ctx.stroke();
        }

        // Контур основного корпуса и коньковая балка
        ctx.strokeStyle = '#22211c';
        ctx.lineWidth = 1.9;
        ctx.strokeRect(-21, -37, 42, 50);

        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(-5, -37);
        ctx.lineTo(-5, 17);
        ctx.stroke();

        // Выступающий погрузочный тамбур снизу
        ctx.fillStyle = '#999788';
        ctx.lineWidth = 1.8;
        ctx.fillRect(-13, 13, 19, 23);
        ctx.strokeRect(-13, 13, 19, 23);

        // Конёк нижнего тамбура
        ctx.beginPath();
        ctx.moveTo(-5, 13);
        ctx.lineTo(-5, 36);
        ctx.stroke();

        ctx.restore();
    },

    general_store(ctx, w, h) {
        // 1. Фон травянистого участка
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8b9356');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // 2. Мощёная булыжником тропинка в центре двора
        ctx.fillStyle = 'rgba(130, 128, 118, 0.72)';
        const cobbles = [
            [0.44, 0.14], [0.50, 0.17], [0.47, 0.22], [0.53, 0.25],
            [0.45, 0.30], [0.51, 0.32], [0.44, 0.38], [0.50, 0.40],
            [0.46, 0.46], [0.52, 0.48]
        ];
        cobbles.forEach(([cx, cy]) => {
            ctx.beginPath();
            ctx.roundRect(w * cx, h * cy, 4.2, 3.6, 1.1);
            ctx.fill();
        });

        // 3. Товары во дворе и у левой стены (ящики, бочки, брёвна)
        const drawCrate = (x, y, cw, ch, color = '#696259') => {
            ctx.fillStyle = color;
            ctx.strokeStyle = '#1c1917';
            ctx.lineWidth = 1.2;
            ctx.fillRect(w * x, h * y, cw, ch);
            ctx.strokeRect(w * x, h * y, cw, ch);
        };

        const drawBarrel = (bx, by, r = 3.8) => {
            ctx.fillStyle = '#47423b';
            ctx.strokeStyle = '#171512';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        };

        // Ящик и бочка снаружи у левой стены
        drawCrate(0.05, 0.22, 8, 9, '#5e564a');
        drawBarrel(0.11, 0.50, 4.0);

        // Деревянный навес/прилавок у внутреннего вертикального крыла
        drawCrate(0.36, 0.32, 6, 17, '#8c8881');

        // Ящики и бочки во дворе
        drawCrate(0.49, 0.30, 8, 7, '#5c5549');
        drawCrate(0.43, 0.40, 7, 7, '#6b6254');
        drawCrate(0.57, 0.39, 7, 8, '#5c5346');
        drawBarrel(0.75, 0.35, 3.8);
        drawBarrel(0.69, 0.45, 3.8);

        // Вязанка досок/брёвен справа сверху во дворе
        ctx.strokeStyle = '#3b2e1e';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        [
            [0.64, 0.22, 0.84, 0.17],
            [0.63, 0.25, 0.82, 0.22],
            [0.66, 0.28, 0.86, 0.28]
        ].forEach(([x1, y1, x2, y2]) => {
            ctx.beginPath();
            ctx.moveTo(w * x1, h * y1);
            ctx.lineTo(w * x2, h * y2);
            ctx.stroke();
        });

        // 4. Г-образный контур здания лавки
        const pts = [
            { x: w * 0.13, y: h * 0.06 },
            { x: w * 0.36, y: h * 0.06 },
            { x: w * 0.36, y: h * 0.52 },
            { x: w * 0.82, y: h * 0.52 },
            { x: w * 0.82, y: h * 0.90 },
            { x: w * 0.13, y: h * 0.90 }
        ];

        // Тень от здания
        ctx.save();
        ctx.translate(2.5, 3.5);
        ctx.fillStyle = 'rgba(16, 16, 14, 0.52)';
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Заливка серой шиферной крыши
        ctx.save();
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();

        const roofGrad = ctx.createLinearGradient(w * 0.13, h * 0.06, w * 0.82, h * 0.90);
        roofGrad.addColorStop(0, '#96948c');
        roofGrad.addColorStop(0.55, '#aba9a1');
        roofGrad.addColorStop(1, '#7a7870');
        ctx.fillStyle = roofGrad;
        ctx.fill();
        ctx.clip();

        // Тёмно-серый нижний скат крыши
        ctx.fillStyle = '#524e48';
        ctx.fillRect(w * 0.13, h * 0.71, w * 0.70, h * 0.20);

        // Мелкая фактура кровельной плитки
        ctx.strokeStyle = 'rgba(28, 26, 22, 0.36)';
        ctx.lineWidth = 1;
        for (let y = h * 0.08; y < h * 0.89; y += 5) {
            for (let x = w * 0.15; x < w * 0.81; x += 6) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + 3, y);
                ctx.stroke();
            }
        }
        ctx.restore();

        // Внешний контур крыши
        ctx.strokeStyle = '#1f1d1a';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();

        // 5. Коньковая балка и диагональный стык скатов
        ctx.strokeStyle = '#262420';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(w * 0.13, h * 0.71);
        ctx.lineTo(w * 0.82, h * 0.71);
        ctx.moveTo(w * 0.13, h * 0.71);
        ctx.lineTo(w * 0.36, h * 0.52);
        ctx.stroke();

        // 6. Квадратная труба справа и два круглых слуховых люка на нижнем скате
        ctx.fillStyle = '#75726a';
        ctx.strokeStyle = '#1c1917';
        ctx.lineWidth = 1.4;
        ctx.fillRect(w * 0.65, h * 0.56, 8, 9);
        ctx.strokeRect(w * 0.65, h * 0.56, 8, 9);
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(w * 0.67, h * 0.58, 4, 4);

        [0.27, 0.65].forEach(lx => {
            ctx.fillStyle = '#736e65';
            ctx.strokeStyle = '#1f1c18';
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.arc(w * lx, h * 0.81, 4.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(w * lx, h * 0.81 - 4);
            ctx.lineTo(w * lx, h * 0.81 + 4);
            ctx.stroke();
        });
    },

    dump(ctx, w, h) {
        // 1. Фон травянистого участка с вытоптанным песочно-грязевым центром
        const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, w * 0.1, w * 0.5, h * 0.5, w * 0.72);
        bgGrad.addColorStop(0, '#cfc79d');
        bgGrad.addColorStop(0.55, '#b2b378');
        bgGrad.addColorStop(1, '#848f50');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // 2. Извилистый голубовато-зелёный ручей через центр
        ctx.strokeStyle = '#6ba39e';
        ctx.lineWidth = 7.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(w * 0.45, 0);
        ctx.quadraticCurveTo(w * 0.34, h * 0.16, w * 0.52, h * 0.36);
        ctx.quadraticCurveTo(w * 0.60, h * 0.52, w * 0.50, h * 0.72);
        ctx.lineTo(w * 0.54, h);
        ctx.stroke();

        ctx.strokeStyle = '#99ccc7';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // 3. Грязные наносы и галька вдоль берегов ручья
        ctx.fillStyle = 'rgba(110, 102, 85, 0.55)';
        const mudSpots = [
            [0.44, 0.30], [0.48, 0.35], [0.43, 0.42], [0.51, 0.45],
            [0.36, 0.52], [0.42, 0.56], [0.58, 0.54], [0.46, 0.64]
        ];
        mudSpots.forEach(([mx, my]) => {
            ctx.beginPath();
            ctx.roundRect(w * mx, h * my, 5, 4, 1.5);
            ctx.fill();
        });

        // 4. Деревянные балки и мостки через ручей
        const drawBeam = (x, y, bw, bh, angle, color = '#5c4328') => {
            ctx.save();
            ctx.translate(w * x, h * y);
            ctx.rotate(angle);
            ctx.fillStyle = color;
            ctx.strokeStyle = '#1f160d';
            ctx.lineWidth = 1.1;
            ctx.fillRect(-bw / 2, -bh / 2, bw, bh);
            ctx.strokeRect(-bw / 2, -bh / 2, bw, bh);
            ctx.restore();
        };

        // Верхние балки и нижний настил через ручей
        drawBeam(0.51, 0.19, 18, 3, -0.35);
        drawBeam(0.53, 0.23, 15, 2.5, -0.30);
        drawBeam(0.49, 0.61, 17, 3, 0.02);
        drawBeam(0.68, 0.63, 21, 2.5, -0.26);
        drawBeam(0.44, 0.67, 5, 11, 0.35, '#7c5c38');

        // 5. Скопление старых ящиков в левом верхнем углу и по периметру
        drawBeam(0.14, 0.06, 8, 9, 0, '#6b533b');
        drawBeam(0.12, 0.16, 11, 9, 0.05, '#59422c');
        drawBeam(0.22, 0.14, 10, 6, -0.05, '#473422');
        drawBeam(0.15, 0.24, 9, 7, 0.1, '#785e42');

        // Ящики снизу и слева
        drawBeam(0.07, 0.68, 9, 12, 0, '#6e573e');
        drawBeam(0.49, 0.87, 13, 7, 0, '#5e4730');
        drawBeam(0.77, 0.86, 8, 10, -0.1, '#6b533b');
        drawBeam(0.69, 0.87, 7, 8, 0.15, '#7a6147');

        // 6. Старые бочки и колеса
        const drawJunkWheel = (wx, wy, r = 3.6) => {
            ctx.fillStyle = '#3b3228';
            ctx.strokeStyle = '#17130f';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(w * wx, h * wy, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#857766';
            ctx.beginPath();
            ctx.arc(w * wx, h * wy, r * 0.38, 0, Math.PI * 2);
            ctx.fill();
        };

        drawJunkWheel(0.28, 0.48, 3.8);
        drawJunkWheel(0.46, 0.47, 3.0);
        drawJunkWheel(0.35, 0.77, 3.4);
        drawJunkWheel(0.87, 0.87, 4.0);
        drawJunkWheel(0.92, 0.78, 3.8);
        drawJunkWheel(0.08, 0.94, 4.0);

        // 7. Мелкий разбросанный хлам и обломки по всему участку
        const scraps = [
            [0.32, 0.26, 6, 4, 0.3], [0.60, 0.28, 8, 4, -0.1],
            [0.65, 0.37, 5, 5, 0.4], [0.76, 0.15, 7, 4, -0.2],
            [0.85, 0.22, 6, 5, 0.2], [0.74, 0.48, 7, 3, -0.15],
            [0.21, 0.76, 8, 3, 0.2], [0.27, 0.88, 7, 4, -0.25]
        ];
        scraps.forEach(([sx, sy, sw, sh, ang]) => {
            drawBeam(sx, sy, sw, sh, ang, '#695640');
        });
    },

    cemetery(ctx, w, h) {
        // 1. Фон заросшего травянистого участка
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#828c4e');
        bgGrad.addColorStop(0.5, '#97a160');
        bgGrad.addColorStop(1, '#798246');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // 2. Светлые извилистые песчаные тропинки
        ctx.strokeStyle = '#d4cfa3';
        ctx.lineWidth = 3.2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        // Главная тропа от входа снизу и разветвление вокруг центра
        ctx.moveTo(w * 0.50, h * 0.98);
        ctx.lineTo(w * 0.50, h * 0.86);
        ctx.quadraticCurveTo(w * 0.24, h * 0.72, w * 0.24, h * 0.52);
        ctx.quadraticCurveTo(w * 0.24, h * 0.38, w * 0.36, h * 0.36);
        ctx.lineTo(w * 0.64, h * 0.36);
        ctx.quadraticCurveTo(w * 0.78, h * 0.50, w * 0.74, h * 0.70);
        ctx.quadraticCurveTo(w * 0.68, h * 0.82, w * 0.50, h * 0.86);

        // Внутренняя петля и ответвления в верхние углы
        ctx.moveTo(w * 0.50, h * 0.36);
        ctx.quadraticCurveTo(w * 0.52, h * 0.58, w * 0.68, h * 0.64);
        ctx.moveTo(w * 0.34, h * 0.36);
        ctx.lineTo(w * 0.22, h * 0.20);
        ctx.moveTo(w * 0.64, h * 0.36);
        ctx.quadraticCurveTo(w * 0.68, h * 0.20, w * 0.80, h * 0.18);
        ctx.stroke();

        // Светлая круглая площадка справа вверху
        ctx.fillStyle = '#dcd7ad';
        ctx.beginPath();
        ctx.ellipse(w * 0.82, h * 0.17, 6, 4.5, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // 3. Каменный склеп (мавзолей) сверху по центру
        const cryptX = w * 0.38;
        const cryptY = h * 0.15;
        const cryptSize = w * 0.23;

        ctx.fillStyle = 'rgba(18, 20, 15, 0.50)';
        ctx.fillRect(cryptX + 2.5, cryptY + 3, cryptSize, cryptSize);

        ctx.fillStyle = '#8b8e88';
        ctx.strokeStyle = '#222421';
        ctx.lineWidth = 1.8;
        ctx.fillRect(cryptX, cryptY, cryptSize, cryptSize);
        ctx.strokeRect(cryptX, cryptY, cryptSize, cryptSize);

        // Внутренний ступенчатый ярус крыши склепа
        ctx.fillStyle = '#6c706a';
        ctx.strokeStyle = '#333632';
        ctx.lineWidth = 1.2;
        ctx.fillRect(cryptX + 4, cryptY + 4, cryptSize - 8, cryptSize - 8);
        ctx.strokeRect(cryptX + 4, cryptY + 4, cryptSize - 8, cryptSize - 8);

        // 4. Надгробные камни и плиты по участку
        const graves = [
            [0.14, 0.24], [0.15, 0.32], [0.22, 0.28], [0.28, 0.22],
            [0.68, 0.14], [0.76, 0.26], [0.84, 0.28], [0.82, 0.36],
            [0.13, 0.68], [0.18, 0.76], [0.24, 0.82], [0.35, 0.84],
            [0.84, 0.66], [0.80, 0.76], [0.72, 0.84]
        ];
        graves.forEach(([gx, gy]) => {
            ctx.fillStyle = '#696c65';
            ctx.strokeStyle = '#242622';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(w * gx, h * gy, 4.2, 3.2, 1);
            ctx.fill();
            ctx.stroke();
        });

        // 5. Тёмно-зелёные кусты в центре и у склепа
        const drawBush = (bx, by, r) => {
            ctx.fillStyle = 'rgba(15, 20, 10, 0.42)';
            ctx.beginPath();
            ctx.arc(w * bx + 1.5, h * by + 1.5, r, 0, Math.PI * 2);
            ctx.fill();

            const bGrad = ctx.createRadialGradient(w * bx - 1.5, h * by - 1.5, 1, w * bx, h * by, r);
            bGrad.addColorStop(0, '#465e24');
            bGrad.addColorStop(1, '#223010');
            ctx.fillStyle = bGrad;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, r, 0, Math.PI * 2);
            ctx.fill();
        };

        drawBush(0.49, 0.10, 5.5);
        drawBush(0.39, 0.56, 6.5);
        drawBush(0.45, 0.64, 5.5);
        drawBush(0.60, 0.52, 5.0);
        drawBush(0.58, 0.72, 6.0);

        // 6. Ограда по периметру со столбиками и входом снизу по центру
        ctx.strokeStyle = '#262421';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        // Левая, верхняя и правая стены + нижние секции до ворот
        ctx.moveTo(w * 0.34, h * 0.93);
        ctx.lineTo(w * 0.06, h * 0.93);
        ctx.lineTo(w * 0.06, h * 0.06);
        ctx.lineTo(w * 0.93, h * 0.06);
        ctx.lineTo(w * 0.93, h * 0.93);
        ctx.lineTo(w * 0.65, h * 0.93);
        ctx.stroke();

        // Опорные столбики ограды (угловые, промежуточные и воротные)
        const posts = [
            [0.06, 0.06], [0.35, 0.06], [0.64, 0.06], [0.93, 0.06],
            [0.06, 0.35], [0.06, 0.64], [0.06, 0.93],
            [0.93, 0.35], [0.93, 0.64], [0.93, 0.93],
            [0.34, 0.93], [0.65, 0.93]
        ];
        posts.forEach(([px, py]) => {
            ctx.fillStyle = '#52504c';
            ctx.strokeStyle = '#171614';
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.arc(w * px, h * py, 2.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });
    },

    brewery(ctx, w, h) {
        // 1. Фон травянистого участка
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969e60');
        bgGrad.addColorStop(0.5, '#a8b070');
        bgGrad.addColorStop(1, '#8b9356');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // 2. Мощёный булыжником дворик во внутреннем углу
        ctx.fillStyle = 'rgba(122, 120, 112, 0.72)';
        const cobbles = [
            [0.42, 0.22], [0.48, 0.25], [0.40, 0.30], [0.46, 0.32],
            [0.52, 0.30], [0.43, 0.38], [0.49, 0.40], [0.55, 0.42],
            [0.41, 0.45], [0.47, 0.47], [0.53, 0.48]
        ];
        cobbles.forEach(([cx, cy]) => {
            ctx.beginPath();
            ctx.roundRect(w * cx, h * cy, 4.2, 3.6, 1.1);
            ctx.fill();
        });

        // 3. Пивные бочки и ящики во дворе и у внешних стен
        const drawBarrel = (bx, by, r = 3.8) => {
            ctx.fillStyle = '#574c41';
            ctx.strokeStyle = '#1c1814';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#857768';
            ctx.beginPath();
            ctx.arc(w * bx - 0.8, h * by - 0.8, r * 0.45, 0, Math.PI * 2);
            ctx.fill();
        };

        // Группа бочек во внутреннем дворе
        drawBarrel(0.62, 0.36, 4.0);
        drawBarrel(0.74, 0.36, 4.0);
        drawBarrel(0.56, 0.46, 4.0);
        drawBarrel(0.67, 0.46, 4.0);
        // Бочка слева у стены
        drawBarrel(0.08, 0.52, 3.8);

        // Деревянный ящик рядом с бочками во дворе и два ящика справа снаружи
        ctx.fillStyle = '#6b5e4c';
        ctx.strokeStyle = '#1c1814';
        ctx.lineWidth = 1.2;
        ctx.fillRect(w * 0.74, h * 0.44, 8, 8);
        ctx.strokeRect(w * 0.74, h * 0.44, 8, 8);

        ctx.save();
        ctx.translate(w * 0.90, h * 0.68);
        ctx.rotate(0.28);
        ctx.fillRect(-5, -4, 9, 7);
        ctx.strokeRect(-5, -4, 9, 7);
        ctx.fillRect(-4, 4, 8, 6);
        ctx.strokeRect(-4, 4, 8, 6);
        ctx.restore();

        // 4. Г-образный контур здания пивоварни
        const pts = [
            { x: w * 0.11, y: h * 0.04 },
            { x: w * 0.35, y: h * 0.04 },
            { x: w * 0.35, y: h * 0.52 },
            { x: w * 0.84, y: h * 0.52 },
            { x: w * 0.84, y: h * 0.91 },
            { x: w * 0.11, y: h * 0.91 }
        ];

        // Тень от здания
        ctx.save();
        ctx.translate(2.5, 3.5);
        ctx.fillStyle = 'rgba(18, 15, 10, 0.52)';
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Заливка охристо-коричневой черепичной крыши
        ctx.save();
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();

        const roofGrad = ctx.createLinearGradient(w * 0.11, h * 0.04, w * 0.84, h * 0.91);
        roofGrad.addColorStop(0, '#a68246');
        roofGrad.addColorStop(0.5, '#bfa065');
        roofGrad.addColorStop(1, '#755324');
        ctx.fillStyle = roofGrad;
        ctx.fill();
        ctx.clip();

        // Тёмный нижний скат крыши
        ctx.fillStyle = 'rgba(68, 44, 16, 0.45)';
        ctx.fillRect(w * 0.11, h * 0.72, w * 0.73, h * 0.20);

        // Мелкая фактура черепицы
        ctx.strokeStyle = 'rgba(42, 28, 10, 0.38)';
        ctx.lineWidth = 1;
        for (let y = h * 0.06; y < h * 0.90; y += 5) {
            for (let x = w * 0.13; x < w * 0.83; x += 6) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + 3, y);
                ctx.stroke();
            }
        }
        ctx.restore();

        // Внешний контур крыши
        ctx.strokeStyle = '#24180a';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();

        // 5. Коньковая балка нижнего крыла и диагональный стык в углу
        ctx.strokeStyle = '#2e1f0d';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(w * 0.11, h * 0.72);
        ctx.lineTo(w * 0.84, h * 0.72);
        ctx.moveTo(w * 0.11, h * 0.72);
        ctx.lineTo(w * 0.35, h * 0.52);
        ctx.stroke();

        // 6. Каменный дымоход справа на нижнем крыле
        ctx.fillStyle = '#8c8881';
        ctx.strokeStyle = '#1c1917';
        ctx.lineWidth = 1.5;
        ctx.fillRect(w * 0.66, h * 0.56, 9, 10);
        ctx.strokeRect(w * 0.66, h * 0.56, 9, 10);
        ctx.fillStyle = '#1c1917';
        ctx.beginPath();
        ctx.arc(w * 0.705, h * 0.61, 2.3, 0, Math.PI * 2);
        ctx.fill();
    },

    barracks(ctx, w, h) {
        // 1. Травянистый фон участка
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#939b5e');
        bgGrad.addColorStop(0.5, '#a4ac6e');
        bgGrad.addColorStop(1, '#878f52');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // 2. Мощёная булыжником дорога из центрального двора вниз
        ctx.fillStyle = 'rgba(115, 113, 104, 0.75)';
        for (let y = h * 0.44; y < h - 2; y += 5) {
            for (let dx = -9; dx <= 7; dx += 5) {
                const shift = (Math.floor(y / 5) % 2) * 2;
                ctx.beginPath();
                ctx.roundRect(w * 0.49 + dx + shift, y, 4, 3.6, 1.1);
                ctx.fill();
            }
        }

        // 3. Внешний реквизит: ящик сверху справа и бочки во дворе и у правого крыла
        ctx.fillStyle = '#5c4b32';
        ctx.strokeStyle = '#1f1910';
        ctx.lineWidth = 1.3;
        ctx.fillRect(w * 0.65, h * 0.04, 13, 8);
        ctx.strokeRect(w * 0.65, h * 0.04, 13, 8);

        const drawBarrel = (bx, by, r = 3.8) => {
            ctx.fillStyle = '#3f3830';
            ctx.strokeStyle = '#171411';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        };
        drawBarrel(0.36, 0.52, 4.0);
        drawBarrel(0.83, 0.65, 3.8);
        drawBarrel(0.76, 0.75, 4.0);

        // 4. П-образный контур здания казарм (открыт вниз)
        const pts = [
            { x: w * 0.09, y: h * 0.12 },
            { x: w * 0.91, y: h * 0.12 },
            { x: w * 0.91, y: h * 0.62 },
            { x: w * 0.68, y: h * 0.62 },
            { x: w * 0.68, y: h * 0.46 },
            { x: w * 0.32, y: h * 0.46 },
            { x: w * 0.32, y: h * 0.62 },
            { x: w * 0.09, y: h * 0.62 }
        ];

        // Тень от здания
        ctx.save();
        ctx.translate(2.5, 3.5);
        ctx.fillStyle = 'rgba(16, 14, 18, 0.55)';
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Основная заливка серо-фиолетовой сланцевой крыши
        ctx.save();
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();

        const roofGrad = ctx.createLinearGradient(w * 0.1, h * 0.12, w * 0.9, h * 0.62);
        roofGrad.addColorStop(0, '#78717a');
        roofGrad.addColorStop(0.5, '#8f8791');
        roofGrad.addColorStop(1, '#5e5861');
        ctx.fillStyle = roofGrad;
        ctx.fill();
        ctx.clip();

        // Мелкая текстура сланцевой черепицы
        ctx.strokeStyle = 'rgba(32, 28, 36, 0.42)';
        ctx.lineWidth = 1;
        for (let y = h * 0.14; y < h * 0.61; y += 4.5) {
            const shift = (Math.floor(y / 4.5) % 2) * 2.5;
            for (let x = w * 0.10; x < w * 0.90; x += 5) {
                ctx.strokeRect(x + shift, y, 4.5, 4);
            }
        }
        ctx.restore();

        // Внешний контур крыши
        ctx.strokeStyle = '#1f1b21';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();

        // 5. Коньковые балки крыши (П-образный хребет и диагональные рёбра)
        ctx.strokeStyle = '#29232b';
        ctx.lineWidth = 2.6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        // Главный П-образный конёк
        ctx.moveTo(w * 0.205, h * 0.62);
        ctx.lineTo(w * 0.205, h * 0.28);
        ctx.lineTo(w * 0.795, h * 0.28);
        ctx.lineTo(w * 0.795, h * 0.62);
        // Диагональные стыки скатов в углах
        ctx.moveTo(w * 0.09, h * 0.12);
        ctx.lineTo(w * 0.205, h * 0.28);
        ctx.moveTo(w * 0.91, h * 0.12);
        ctx.lineTo(w * 0.795, h * 0.28);
        ctx.moveTo(w * 0.32, h * 0.46);
        ctx.lineTo(w * 0.205, h * 0.28);
        ctx.moveTo(w * 0.68, h * 0.46);
        ctx.lineTo(w * 0.795, h * 0.28);
        ctx.stroke();

        // 6. Центральный тёмный дымоход/вентиляционный короб в верхней части крыши
        ctx.fillStyle = '#36323b';
        ctx.strokeStyle = '#141217';
        ctx.lineWidth = 1.5;
        ctx.fillRect(w * 0.43, h * 0.16, w * 0.14, h * 0.08);
        ctx.strokeRect(w * 0.43, h * 0.16, w * 0.14, h * 0.08);

        ctx.fillStyle = '#141217';
        ctx.beginPath();
        ctx.arc(w * 0.475, h * 0.20, 2.0, 0, Math.PI * 2);
        ctx.arc(w * 0.525, h * 0.20, 2.0, 0, Math.PI * 2);
        ctx.fill();
    },

    occult_shop(ctx, w, h) {
        const cx = w * 0.5;
        const cy = h * 0.48;

        const bgGrad = ctx.createRadialGradient(cx, cy, w * 0.1, cx, cy, w * 0.72);
        bgGrad.addColorStop(0, '#9fa16b');
        bgGrad.addColorStop(0.65, '#8c9159');
        bgGrad.addColorStop(1, '#757a48');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(42, 38, 24, 0.24)';
        ctx.beginPath();
        ctx.ellipse(cx + 3, cy + 4, w * 0.42, h * 0.40, 0, 0, Math.PI * 2);
        ctx.fill();

        const drawPropBox = (x, y, pw, ph, angle, color) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.fillStyle = color;
            ctx.strokeStyle = '#1f1b16';
            ctx.lineWidth = 1.2;
            ctx.fillRect(-pw / 2, -ph / 2, pw, ph);
            ctx.strokeRect(-pw / 2, -ph / 2, pw, ph);
            ctx.restore();
        };

        drawPropBox(w * 0.34, h * 0.12, 11, 6, -0.35, '#6b7280');
        drawPropBox(w * 0.19, h * 0.36, 6, 11, -0.25, '#5c4033');
        drawPropBox(w * 0.81, h * 0.52, 8, 5, 0.4, '#6b4423');
        drawPropBox(w * 0.19, h * 0.77, 10, 8, 0.55, '#8c5830');
        drawPropBox(w * 0.67, h * 0.83, 6, 8, 0.1, '#9ca3af');

        ctx.fillStyle = '#2563eb';
        ctx.strokeStyle = '#1e1b18';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(w * 0.25, h * 0.83, 4.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#93c5fd';
        ctx.beginPath();
        ctx.arc(w * 0.24, h * 0.82, 1.4, 0, Math.PI * 2);
        ctx.fill();

        const outerR = w * 0.37;
        const vertices = [];
        for (let i = 0; i < 8; i++) {
            const ang = (Math.PI / 4) * i - Math.PI / 2;
            vertices.push({
                x: cx + Math.cos(ang) * outerR,
                y: cy + Math.sin(ang) * outerR
            });
        }

        ctx.save();
        ctx.translate(2.5, 3.5);
        ctx.fillStyle = 'rgba(20, 18, 14, 0.48)';
        ctx.beginPath();
        vertices.forEach((v, idx) => idx === 0 ? ctx.moveTo(v.x, v.y) : ctx.lineTo(v.x, v.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        const stoneGrad = ctx.createRadialGradient(cx - 6, cy - 6, 8, cx, cy, outerR);
        stoneGrad.addColorStop(0, '#c2c5bd');
        stoneGrad.addColorStop(0.75, '#9ea39b');
        stoneGrad.addColorStop(1, '#7c8279');

        ctx.fillStyle = stoneGrad;
        ctx.strokeStyle = '#242622';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const curr = vertices[i];
            const next = vertices[(i + 1) % 8];
            const midX = (curr.x + next.x) / 2 + Math.cos((Math.PI / 4) * i) * 1.6;
            const midY = (curr.y + next.y) / 2 + Math.sin((Math.PI / 4) * i) * 1.6;
            if (i === 0) ctx.moveTo(curr.x, curr.y);
            ctx.quadraticCurveTo(midX, midY, next.x, next.y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        vertices.forEach(v => {
            ctx.fillStyle = '#8b9088';
            ctx.strokeStyle = '#242622';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(v.x, v.y, 3.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });

        ctx.strokeStyle = 'rgba(42, 45, 40, 0.42)';
        ctx.lineWidth = 1.1;
        for (let ring = 0.22; ring <= 0.33; ring += 0.045) {
            const steps = 18;
            for (let s = 0; s < steps; s++) {
                const a = (Math.PI * 2 / steps) * s + ring * 5;
                const sx = cx + Math.cos(a) * (w * ring);
                const sy = cy + Math.sin(a) * (w * ring);
                ctx.beginPath();
                ctx.moveTo(sx - Math.sin(a) * 2.5, sy + Math.cos(a) * 2.5);
                ctx.lineTo(sx + Math.sin(a) * 2.5, sy - Math.cos(a) * 2.5);
                ctx.stroke();
            }
        }

        const roofR = w * 0.185;
        ctx.fillStyle = 'rgba(18, 16, 12, 0.55)';
        ctx.beginPath();
        ctx.arc(cx + 2, cy + 3, roofR + 1.5, 0, Math.PI * 2);
        ctx.fill();

        const roofGrad = ctx.createRadialGradient(cx - 4, cy - 5, 2, cx, cy, roofR);
        roofGrad.addColorStop(0, '#c8a951');
        roofGrad.addColorStop(0.55, '#8f732b');
        roofGrad.addColorStop(1, '#4f3e14');

        ctx.fillStyle = roofGrad;
        ctx.strokeStyle = '#1c170b';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(cx, cy, roofR, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = 'rgba(30, 22, 8, 0.45)';
        ctx.lineWidth = 1;
        [0.42, 0.72].forEach(scale => {
            ctx.beginPath();
            ctx.arc(cx, cy, roofR * scale, 0, Math.PI * 2);
            ctx.stroke();
        });

        [0.75, 2.35, 3.95, 5.5].forEach(ang => {
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(ang) * roofR, cy + Math.sin(ang) * roofR);
            ctx.stroke();
        });

        ctx.fillStyle = '#e5c465';
        ctx.beginPath();
        ctx.arc(cx, cy, 2.2, 0, Math.PI * 2);
        ctx.fill();
    },
    alchemy_lab(ctx, w, h) {
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#8d9658');
        bgGrad.addColorStop(0.5, '#9ea369');
        bgGrad.addColorStop(1, '#858a52');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(110, 112, 104, 0.72)';
        const stones = [
            [0.74, 0.62], [0.80, 0.59], [0.86, 0.56],
            [0.71, 0.68], [0.77, 0.66], [0.83, 0.64],
            [0.68, 0.75], [0.74, 0.73], [0.80, 0.71],
            [0.65, 0.82], [0.71, 0.80], [0.76, 0.79]
        ];
        stones.forEach(([sx, sy]) => {
            ctx.beginPath();
            ctx.roundRect(w * sx, h * sy, 4.5, 3.8, 1.2);
            ctx.fill();
        });

        ctx.fillStyle = 'rgba(20, 18, 12, 0.45)';
        ctx.fillRect(w * 0.23, h * 0.72, w * 0.36, h * 0.16);

        const porchGrad = ctx.createLinearGradient(w * 0.22, h * 0.70, w * 0.58, h * 0.86);
        porchGrad.addColorStop(0, '#7c5836');
        porchGrad.addColorStop(1, '#a3825c');
        ctx.fillStyle = porchGrad;
        ctx.strokeStyle = '#241b12';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.rect(w * 0.22, h * 0.70, w * 0.36, h * 0.15);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(w * 0.39, h * 0.70);
        ctx.lineTo(w * 0.39, h * 0.85);
        ctx.stroke();

        ctx.fillStyle = '#78716c';
        ctx.fillRect(w * 0.58, h * 0.74, 6, 7);
        ctx.strokeRect(w * 0.58, h * 0.74, 6, 7);

        ctx.fillStyle = '#6e472b';
        ctx.strokeStyle = '#1f1710';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(w * 0.62, h * 0.66, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.arc(w * 0.84, h * 0.46, 4.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#93c5fd';
        ctx.beginPath();
        ctx.arc(w * 0.83, h * 0.45, 1.4, 0, Math.PI * 2);
        ctx.fill();

        const pts = [
            { x: w * 0.14, y: h * 0.21 },
            { x: w * 0.74, y: h * 0.08 },
            { x: w * 0.88, y: h * 0.24 },
            { x: w * 0.59, y: h * 0.68 },
            { x: w * 0.15, y: h * 0.71 }
        ];

        ctx.save();
        ctx.translate(3, 4);
        ctx.fillStyle = 'rgba(18, 16, 10, 0.52)';
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        const roofGrad = ctx.createLinearGradient(w * 0.15, h * 0.1, w * 0.85, h * 0.7);
        roofGrad.addColorStop(0, '#8f6c28');
        roofGrad.addColorStop(0.45, '#b59242');
        roofGrad.addColorStop(1, '#7a591e');

        ctx.fillStyle = roofGrad;
        ctx.strokeStyle = '#261c0d';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = 'rgba(46, 32, 12, 0.45)';
        ctx.lineWidth = 1.2;
        for (let y = h * 0.25; y < h * 0.68; y += 6) {
            ctx.beginPath();
            ctx.moveTo(w * 0.15, y);
            ctx.lineTo(w * 0.21, y + 1);
            ctx.stroke();
        }
        for (let x = w * 0.22; x < w * 0.70; x += 7) {
            ctx.beginPath();
            ctx.moveTo(x, h * 0.19 - (x - w * 0.22) * 0.18);
            ctx.lineTo(x + 1, h * 0.25 - (x - w * 0.22) * 0.18);
            ctx.stroke();
        }

        ctx.strokeStyle = '#3b2b14';
        ctx.lineWidth = 3.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(w * 0.14, h * 0.21);
        ctx.lineTo(w * 0.59, h * 0.68);
        ctx.moveTo(w * 0.15, h * 0.71);
        ctx.lineTo(w * 0.72, h * 0.24);
        ctx.lineTo(w * 0.74, h * 0.08);
        ctx.moveTo(w * 0.72, h * 0.24);
        ctx.lineTo(w * 0.88, h * 0.24);
        ctx.stroke();

        ctx.fillStyle = '#9ca3af';
        ctx.strokeStyle = '#1f2937';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.roundRect(w * 0.40, h * 0.31, 9, 13, 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(w * 0.425, h * 0.34, 4, 7);

        ctx.save();
        ctx.translate(w * 0.63, h * 0.39);
        ctx.rotate(-0.42);
        ctx.fillStyle = '#4b3b24';
        ctx.strokeStyle = '#1c150c';
        ctx.lineWidth = 1.4;
        ctx.fillRect(-9, -6, 18, 12);
        ctx.strokeRect(-9, -6, 18, 12);

        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(-6, -3, 5, 6);
        ctx.fillRect(1, -3, 5, 6);
        ctx.restore();
    },

    houses(ctx, w, h) {
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969c62');
        bgGrad.addColorStop(0.5, '#a7ad72');
        bgGrad.addColorStop(1, '#8c9258');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(112, 114, 106, 0.72)';
        const cobbles = [
            [0.44, 0.24], [0.50, 0.27], [0.47, 0.33], [0.53, 0.36],
            [0.45, 0.42], [0.51, 0.45], [0.42, 0.50], [0.49, 0.51],
            [0.55, 0.50], [0.46, 0.57], [0.52, 0.58]
        ];
        cobbles.forEach(([cx, cy]) => {
            ctx.beginPath();
            ctx.roundRect(w * cx, h * cy, 4.2, 3.6, 1.2);
            ctx.fill();
        });

        const drawBarrel = (bx, by, r = 3.8) => {
            ctx.fillStyle = '#5c4028';
            ctx.strokeStyle = '#1f160e';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        };

        drawBarrel(0.16, 0.54, 4.0);
        drawBarrel(0.86, 0.57, 3.8);
        drawBarrel(0.81, 0.65, 4.0);
        drawBarrel(0.20, 0.84, 3.5);

        ctx.fillStyle = '#6e5239';
        ctx.strokeStyle = '#1f160e';
        ctx.lineWidth = 1.2;
        ctx.fillRect(w * 0.17, h * 0.72, 6, 8);
        ctx.strokeRect(w * 0.17, h * 0.72, 6, 8);

        ctx.fillStyle = 'rgba(18, 14, 10, 0.48)';
        ctx.fillRect(w * 0.10, h * 0.13, w * 0.31, h * 0.39);
        ctx.fillRect(w * 0.40, h * 0.26, w * 0.08, h * 0.12);

        const roof1Grad = ctx.createLinearGradient(w * 0.08, h * 0.10, w * 0.39, h * 0.49);
        roof1Grad.addColorStop(0, '#9a3412');
        roof1Grad.addColorStop(0.5, '#c2410c');
        roof1Grad.addColorStop(1, '#7c2d12');

        ctx.fillStyle = roof1Grad;
        ctx.strokeStyle = '#291208';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(w * 0.08, h * 0.10);
        ctx.lineTo(w * 0.38, h * 0.10);
        ctx.lineTo(w * 0.38, h * 0.24);
        ctx.lineTo(w * 0.46, h * 0.24);
        ctx.lineTo(w * 0.46, h * 0.36);
        ctx.lineTo(w * 0.38, h * 0.36);
        ctx.lineTo(w * 0.38, h * 0.49);
        ctx.lineTo(w * 0.08, h * 0.49);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = '#431407';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w * 0.23, h * 0.10);
        ctx.lineTo(w * 0.23, h * 0.49);
        ctx.moveTo(w * 0.38, h * 0.30);
        ctx.lineTo(w * 0.46, h * 0.30);
        ctx.stroke();

        ctx.fillStyle = '#9ca3af';
        ctx.strokeStyle = '#1f2937';
        ctx.lineWidth = 1.3;
        ctx.fillRect(w * 0.205, h * 0.11, 5.5, 9);
        ctx.strokeRect(w * 0.205, h * 0.11, 5.5, 9);

        ctx.fillStyle = 'rgba(18, 14, 10, 0.48)';
        ctx.fillRect(w * 0.62, h * 0.11, w * 0.32, h * 0.43);

        const roof2Grad = ctx.createLinearGradient(w * 0.60, h * 0.08, w * 0.92, h * 0.51);
        roof2Grad.addColorStop(0, '#a88958');
        roof2Grad.addColorStop(0.55, '#c4a676');
        roof2Grad.addColorStop(1, '#7c6238');

        ctx.fillStyle = roof2Grad;
        ctx.strokeStyle = '#292012';
        ctx.lineWidth = 1.8;
        ctx.fillRect(w * 0.60, h * 0.08, w * 0.32, h * 0.43);
        ctx.strokeRect(w * 0.60, h * 0.08, w * 0.32, h * 0.43);

        ctx.strokeStyle = '#3d2f18';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(w * 0.77, h * 0.08);
        ctx.lineTo(w * 0.77, h * 0.51);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(56, 42, 20, 0.45)';
        ctx.lineWidth = 1;
        for (let y = h * 0.12; y < h * 0.49; y += 5) {
            ctx.beginPath();
            ctx.moveTo(w * 0.62, y);
            ctx.lineTo(w * 0.74, y + 0.5);
            ctx.moveTo(w * 0.80, y);
            ctx.lineTo(w * 0.90, y + 0.5);
            ctx.stroke();
        }

        ctx.fillStyle = 'rgba(18, 14, 10, 0.50)';
        ctx.fillRect(w * 0.29, h * 0.63, w * 0.48, h * 0.27);

        const roof3Grad = ctx.createLinearGradient(w * 0.27, h * 0.60, w * 0.75, h * 0.87);
        roof3Grad.addColorStop(0, '#855834');
        roof3Grad.addColorStop(0.5, '#a6764e');
        roof3Grad.addColorStop(1, '#5c3a1e');

        ctx.fillStyle = roof3Grad;
        ctx.strokeStyle = '#241509';
        ctx.lineWidth = 1.8;
        ctx.fillRect(w * 0.27, h * 0.60, w * 0.48, h * 0.27);
        ctx.strokeRect(w * 0.27, h * 0.60, w * 0.48, h * 0.27);

        ctx.strokeStyle = '#2e1b0c';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w * 0.27, h * 0.735);
        ctx.lineTo(w * 0.75, h * 0.735);
        ctx.stroke();

        ctx.fillStyle = '#9c6e46';
        ctx.beginPath();
        ctx.moveTo(w * 0.41, h * 0.58);
        ctx.lineTo(w * 0.59, h * 0.58);
        ctx.lineTo(w * 0.50, h * 0.735);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(w * 0.50, h * 0.58);
        ctx.lineTo(w * 0.50, h * 0.735);
        ctx.stroke();

        ctx.fillStyle = '#291a0e';
        ctx.fillRect(w * 0.64, h * 0.78, 7, 5);
    },
    arcanist_tower(ctx, w, h) {
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#858f50');
        bgGrad.addColorStop(0.5, '#99a362');
        bgGrad.addColorStop(1, '#7c8549');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = 'rgba(182, 180, 152, 0.55)';
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(w * 0.25, 0);
        ctx.quadraticCurveTo(w * 0.30, h * 0.45, 0, h * 0.72);
        ctx.stroke();

        ctx.save();
        ctx.translate(w * 0.19, h * 0.62);
        ctx.rotate(-0.22);
        ctx.fillStyle = 'rgba(18, 15, 10, 0.48)';
        ctx.fillRect(-11, -11, 24, 24);

        const shedGrad = ctx.createLinearGradient(-12, -12, 12, 12);
        shedGrad.addColorStop(0, '#855834');
        shedGrad.addColorStop(1, '#b0865c');
        ctx.fillStyle = shedGrad;
        ctx.strokeStyle = '#24180e';
        ctx.lineWidth = 1.6;
        ctx.fillRect(-12, -12, 23, 22);
        ctx.strokeRect(-12, -12, 23, 22);

        ctx.beginPath();
        ctx.moveTo(-12, -1);
        ctx.lineTo(11, -1);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.translate(w * 0.43, h * 0.14);
        ctx.rotate(-0.18);
        ctx.fillStyle = '#9c6e44';
        ctx.strokeStyle = '#24180e';
        ctx.lineWidth = 1.4;
        ctx.fillRect(-9, -5, 18, 10);
        ctx.strokeRect(-9, -5, 18, 10);
        ctx.restore();

        const drawBarrel = (bx, by, r = 3.5) => {
            ctx.fillStyle = '#4f463e';
            ctx.strokeStyle = '#1c1814';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(w * bx, h * by, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        };
        drawBarrel(0.76, 0.63, 3.6);
        drawBarrel(0.75, 0.72, 3.8);
        drawBarrel(0.28, 0.74, 3.2);

        const outerPts = [
            { x: w * 0.21, y: h * 0.22 },
            { x: w * 0.66, y: h * 0.12 },
            { x: w * 0.72, y: h * 0.66 },
            { x: w * 0.45, y: h * 0.76 },
            { x: w * 0.33, y: h * 0.68 }
        ];

        ctx.save();
        ctx.translate(3.5, 4.5);
        ctx.fillStyle = 'rgba(18, 18, 14, 0.55)';
        ctx.beginPath();
        outerPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        const wallGrad = ctx.createLinearGradient(w * 0.2, h * 0.12, w * 0.72, h * 0.76);
        wallGrad.addColorStop(0, '#8d9186');
        wallGrad.addColorStop(0.5, '#72766b');
        wallGrad.addColorStop(1, '#585c52');

        ctx.fillStyle = wallGrad;
        ctx.strokeStyle = '#1e201b';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        outerPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        const innerPts = [
            { x: w * 0.34, y: h * 0.29 },
            { x: w * 0.60, y: h * 0.22 },
            { x: w * 0.63, y: h * 0.56 },
            { x: w * 0.47, y: h * 0.63 },
            { x: w * 0.40, y: h * 0.55 }
        ];

        ctx.fillStyle = '#474a42';
        ctx.strokeStyle = '#c4c7be';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        innerPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(w * 0.47, h * 0.35);
        ctx.rotate(-0.45);
        ctx.fillStyle = '#a38052';
        ctx.strokeStyle = '#241a0e';
        ctx.lineWidth = 1.4;
        ctx.fillRect(-8, -7, 16, 14);
        ctx.strokeRect(-8, -7, 16, 14);

        ctx.beginPath();
        ctx.moveTo(0, -7);
        ctx.lineTo(0, 7);
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.arc(w * 0.47, h * 0.50, 3.2, 0, Math.PI * 2);
        ctx.fill();

        const domeGrad = ctx.createRadialGradient(w * 0.51, h * 0.51, 1, w * 0.52, h * 0.52, 5.2);
        domeGrad.addColorStop(0, '#d6d3d1');
        domeGrad.addColorStop(1, '#78716c');
        ctx.fillStyle = domeGrad;
        ctx.strokeStyle = '#292524';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(w * 0.52, h * 0.52, 5.0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    },

    bank(ctx, w, h) {
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#969c62');
        bgGrad.addColorStop(0.5, '#a7ad72');
        bgGrad.addColorStop(1, '#8c9258');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(115, 115, 105, 0.72)';
        for (let y = 2; y < h - 2; y += 5) {
            if (y > h * 0.25 && y < h * 0.72) continue;
            for (let dx = -7; dx <= 5; dx += 5) {
                const offset = (y % 10 === 0) ? 1.5 : -1;
                ctx.beginPath();
                ctx.roundRect(w * 0.5 + dx + offset, y, 3.8, 3.5, 1);
                ctx.fill();
            }
        }

        const drawBush = (bx, by, rx, ry) => {
            ctx.fillStyle = 'rgba(15, 22, 10, 0.45)';
            ctx.beginPath();
            ctx.ellipse(w * bx + 1.5, h * by + 2, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();

            const bushGrad = ctx.createRadialGradient(w * bx - 2, h * by - 2, 1, w * bx, h * by, Math.max(rx, ry));
            bushGrad.addColorStop(0, '#4d6629');
            bushGrad.addColorStop(0.7, '#324519');
            bushGrad.addColorStop(1, '#1d290e');
            ctx.fillStyle = bushGrad;
            ctx.beginPath();
            ctx.ellipse(w * bx, h * by, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();
        };

        drawBush(0.24, 0.14, 9, 7);
        drawBush(0.76, 0.14, 8, 6);
        drawBush(0.26, 0.83, 12, 6);
        drawBush(0.74, 0.83, 11, 6);

        const poolX = w * 0.405;
        const poolY = h * 0.09;
        const poolW = w * 0.19;
        const poolH = h * 0.28;

        ctx.fillStyle = 'rgba(18, 20, 18, 0.45)';
        ctx.fillRect(poolX + 2, poolY + 2, poolW, poolH);

        const waterGrad = ctx.createLinearGradient(poolX, poolY, poolX + poolW, poolY + poolH);
        waterGrad.addColorStop(0, '#0284c7');
        waterGrad.addColorStop(0.5, '#38bdf8');
        waterGrad.addColorStop(1, '#0369a1');

        ctx.fillStyle = waterGrad;
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2.2;
        ctx.fillRect(poolX, poolY, poolW, poolH);
        ctx.strokeRect(poolX, poolY, poolW, poolH);

        const bankPts = [
            { x: w * 0.12, y: h * 0.27 },
            { x: w * 0.36, y: h * 0.27 },
            { x: w * 0.36, y: h * 0.43 },
            { x: w * 0.64, y: h * 0.43 },
            { x: w * 0.64, y: h * 0.27 },
            { x: w * 0.88, y: h * 0.27 },
            { x: w * 0.88, y: h * 0.72 },
            { x: w * 0.12, y: h * 0.72 }
        ];

        ctx.save();
        ctx.translate(2.5, 3.5);
        ctx.fillStyle = 'rgba(15, 14, 12, 0.55)';
        ctx.beginPath();
        bankPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        bankPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fillStyle = '#7c7870';
        ctx.fill();
        ctx.clip();

        for (let y = h * 0.27; y < h * 0.72; y += 5.5) {
            for (let x = w * 0.12; x < w * 0.88; x += 6.5) {
                const shift = (Math.floor(y / 5.5) % 2) * 3;
                ctx.fillStyle = ((x + y) % 3 === 0) ? '#969188' : '#66625b';
                ctx.fillRect(x + shift, y, 5.2, 4.2);
            }
        }
        ctx.restore();

        ctx.strokeStyle = '#292524';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        bankPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();

        ctx.setLineDash([2.5, 2.5]);
        ctx.strokeStyle = '#a8a29e';
        ctx.lineWidth = 1.6;
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#5c3d24';
        ctx.strokeStyle = '#1c120a';
        ctx.lineWidth = 1.3;
        ctx.fillRect(w * 0.43, h * 0.51, w * 0.14, h * 0.14);
        ctx.strokeRect(w * 0.43, h * 0.51, w * 0.14, h * 0.14);

        ctx.beginPath();
        ctx.moveTo(w * 0.43, h * 0.58);
        ctx.lineTo(w * 0.57, h * 0.58);
        ctx.moveTo(w * 0.50, h * 0.51);
        ctx.lineTo(w * 0.50, h * 0.65);
        ctx.stroke();

        [0.24, 0.76].forEach(cx => {
            ctx.fillStyle = '#57534e';
            ctx.strokeStyle = '#1c1917';
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.arc(w * cx, h * 0.56, 3.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });
    }
};
