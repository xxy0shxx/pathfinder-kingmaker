/**
 * ГЕНЕРАТОРЫ ПОСТРОЕК НА 4 КЛЕТКИ (2x2)
 */
export const Buildings4Lot = {
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
