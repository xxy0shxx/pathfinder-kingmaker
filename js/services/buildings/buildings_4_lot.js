/**
 * ГЕНЕРАТОРЫ ПОСТРОЕК НА 4 КЛЕТКИ (2x2)
 */
export const Buildings4Lot = {

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
