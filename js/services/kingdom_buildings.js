/**
 * СЕРВИС: КАТАЛОГ ПОСТРОЕК КОРОЛЕВСТВА И CANVAS-ГЕНЕРАЦИЯ ТЕКСТУР
 */
const KingdomBuildings = {
    catalog: [
        { id: 'occult_shop', name: 'Occult Shop (Оккультная лавка)', cols: 1, rows: 1, level: 13 },
        { id: 'alchemy_lab', name: 'Alchemy Lab (Алхимическая лаб.)', cols: 1, rows: 1, level: 3 },
        { id: 'houses', name: 'Houses (Жилые дома)', cols: 1, rows: 1, level: 1 },
        { id: 'inn', name: 'Inn (Постоялый двор)', cols: 1, rows: 1, level: 1 },
        { id: 'shrine', name: 'Shrine (Святилище)', cols: 1, rows: 1, level: 1 },
        { id: 'smithy', name: 'Smithy (Кузница)', cols: 1, rows: 1, level: 3 },
        { id: 'tavern_popular', name: 'Tavern (Таверна)', cols: 1, rows: 1, level: 3 },
        { id: 'watchtower', name: 'Watchtower (Сторожевая башня)', cols: 1, rows: 1, level: 3 },
        { id: 'garrison', name: 'Garrison (Гарнизон)', cols: 2, rows: 1, level: 5 },
        { id: 'marketplace', name: 'Marketplace (Рыночная площадь)', cols: 2, rows: 1, level: 4 },
        { id: 'town_hall', name: 'Town Hall (Ратуша)', cols: 2, rows: 1, level: 2 },
        { id: 'castle', name: 'Castle (Замок)', cols: 2, rows: 2, level: 9 }
    ],

    _cache: {},

    getBuildingMeta(id) {
        return this.catalog.find(b => b.id === id) || null;
    },

    getBuildingDataUrl(id) {
        if (this._cache[id]) return this._cache[id];

        const meta = this.getBuildingMeta(id);
        if (!meta) return null;

        const cellPx = 96;
        const canvas = document.createElement('canvas');
        canvas.width = meta.cols * cellPx;
        canvas.height = meta.rows * cellPx;
        const ctx = canvas.getContext('2d');

        if (id === 'occult_shop') {
            this._drawOccultShop(ctx, canvas.width, canvas.height);
        } else {
            this._drawPlaceholderBuilding(ctx, canvas.width, canvas.height, meta);
        }

        const url = canvas.toDataURL();
        this._cache[id] = url;
        return url;
    },

    _drawOccultShop(ctx, w, h) {
        // 1. Замшелый двор из булыжника
        ctx.fillStyle = '#4a5538';
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = '#6b705c';
        for (let y = 6; y < h - 6; y += 14) {
            for (let x = 6; x < w - 6; x += 14) {
                ctx.beginPath();
                ctx.roundRect(x + ((y % 28) ? 3 : 0), y, 10, 9, 2);
                ctx.fill();
            }
        }

        // 2. Тень от башни
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.arc(w * 0.54, h * 0.54, w * 0.34, 0, Math.PI * 2);
        ctx.fill();

        // 3. Мистический рунический круг во дворе
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(w * 0.24, h * 0.74, 11, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(192, 132, 252, 0.28)';
        ctx.fill();

        // 4. Боковое крыло с черепицей
        ctx.fillStyle = '#581c87';
        ctx.strokeStyle = '#1e1b4b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(w * 0.48, h * 0.44, w * 0.36, h * 0.34, 4);
        ctx.fill();
        ctx.stroke();

        // 5. Круглая башня оккультиста (вид сверху)
        const cx = w * 0.46;
        const cy = h * 0.44;
        const radius = w * 0.28;

        const roofGrad = ctx.createRadialGradient(cx - 5, cy - 5, 3, cx, cy, radius);
        roofGrad.addColorStop(0, '#a855f7');
        roofGrad.addColorStop(0.65, '#6b21a8');
        roofGrad.addColorStop(1, '#3b0764');

        ctx.fillStyle = roofGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 2.2;
        ctx.strokeStyle = '#e9d5ff';
        ctx.stroke();

        ctx.fillStyle = '#ffd875';
        ctx.beginPath();
        ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
        ctx.fill();
    },

    _drawPlaceholderBuilding(ctx, w, h, meta) {
        ctx.fillStyle = '#3f382c';
        ctx.fillRect(2, 2, w - 4, h - 4);
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2;
        ctx.strokeRect(4, 4, w - 8, h - 8);

        ctx.fillStyle = '#ebd291';
        ctx.font = 'bold 12px Montserrat, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(meta.name.split(' (')[0], w / 2, h / 2);
    }
};

export default KingdomBuildings;
