/**
 * ГЕНЕРАТОРЫ ПОСТРОЕК НА 1 КЛЕТКУ (1x1)
 */
export const Buildings1Lot = {
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
