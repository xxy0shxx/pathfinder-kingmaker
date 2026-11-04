import { MAP_CONFIG } from '../config/app_config.js';
import { ColorConverter } from '../utils/helpers.js';
import ViewportManager from '../services/viewport_manager.js';

const HexCanvasRender = {
    canvas: null,
    ctx: null,
    hexesData: {},
    hexCoords: {}, // Карта эталонных координат
    hiddenSquadHexId: null, // Флаг скрытия на время полета анимации

    mouseX: -1000,
    mouseY: -1000,
//    hoveredHexKey: null,
    focusedHexKey: null,
    focusAlpha: 0,            // Текущая прозрачность вспышки для анимации пульсации
    focusTime: 0,             // Таймер анимации

    init(canvasElement, initialHexesData, coordinatesMap) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.hexesData = initialHexesData || {};
        this.hexCoords = coordinatesMap || {};

        this.canvas.width = 3840;
        this.canvas.height = 1280;

        this.attachMouseEvents();
        this.startAnimationLoop();
    },

    updateData(newHexesData) {
        // Создаем глубокий структурированный клон объекта данных гексов,
        // чтобы Canvas гарантированно увидел новые флаги hasVisited и explored в ту же миллисекунду!
        this.hexesData = newHexesData ? JSON.parse(JSON.stringify(newHexesData)) : {};
    },

    /**
     * Отрисовка Pointy-topped гексагона строго по углам 60*i - 30 из HexManager.js
     */
    drawHexPath(cx, cy, r) {
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle_deg = 60 * i - 30;
            const angle_rad = (Math.PI / 180) * angle_deg;
            const x = cx + r * Math.cos(angle_rad);
            const y = cy + r * Math.sin(angle_rad);
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
    },

    startAnimationLoop() {
        const loop = () => {
            this.render();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    },

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const r = MAP_CONFIG.grid.radius;
        const h = r * Math.sqrt(3); // Физическая ширина pointy гекса

        let currentHoverKey = null;
        let minDistance = Infinity;

        // Рисуем сетку строго по координатам ядра
        for (let row = 0; row < MAP_CONFIG.grid.rows; row++) {
            for (let col = 0; col < MAP_CONFIG.grid.cols; col++) {

                const hexKey = `hex_${row}_${col}`;
                const coords = this.hexCoords[hexKey];

                if (!coords) continue;

                const cx = coords.cx;
                const cy = coords.cy;

                // Для pointy-topped гексов радиус клика ограничен шириной h / 2
                const dist = Math.hypot(this.mouseX - cx, this.mouseY - cy);
                if (dist < h / 2 && dist < minDistance) {
                    minDistance = dist;
                    currentHoverKey = hexKey;
                }

                // Клонируем стейт данных, чтобы не испортить LocalStorage
                const data = this.hexesData[hexKey] ? { ...this.hexesData[hexKey] } : null;

                if (data) {
                    // Если этот гекс является целью полета флага прямо сейчас
                    if (this.hiddenSquadHexId === hexKey) {
                        data.hasVisited = true; // Туман гарантированно спадает!
                        data.squadHere = false; // Но сам спрайт стационарного флага скрыт, пока летит DOM-анимация
                    }
                }

                if (hexKey === this.focusedHexKey) {
                    this.focusTime += 0.05;
                    // Значение колеблется от 0.2 до 0.8
                    this.focusAlpha = 0.5 + Math.sin(this.focusTime * 2) * 0.3;
                }

                // Отрисовка вспышки фокуса под гексом на Canvas
                if (this.focusedHexKey === hexKey) {
                    this.ctx.save();
                    this.drawHexPath(cx, cy, r);
                    const focusGrad = this.ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r * 1.2);
                    focusGrad.addColorStop(0, `rgba(255, 216, 117, ${this.focusAlpha})`);
                    focusGrad.addColorStop(0.5, `rgba(231, 76, 60, ${this.focusAlpha * 0.4})`);
                    focusGrad.addColorStop(1, 'rgba(231, 76, 60, 0)');
                    this.ctx.fillStyle = focusGrad;
                    this.ctx.fill();
                    this.ctx.restore();
                }

                this.drawSingleHex(cx, cy, r, data);

                if (currentHoverKey === hexKey) {
                    this.drawHoverEffect(cx, cy, r);
                }
            }
        }

        this.hoveredHexKey = currentHoverKey;
    },


    drawSingleHex(cx, cy, r, data) {
        const ctx = this.ctx;

        if (data && data.color && data.color !== 'transparent') {
            this.drawHexPath(cx, cy, r);
            ctx.fillStyle = ColorConverter.hexToRgba(data.color, 0.37);
            ctx.fill();
        }

        const isRevealed = !!(data && (data.explored === true || data.hasVisited === true || data.squadHere === true));

        if (!isRevealed) {
            this.drawHexPath(cx, cy, r);
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; // Накладываем туман войны
            this.ctx.fill();
        }

        if (data && data.squadHere) {
            this.drawHexPath(cx, cy, r);
            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.7);
            grad.addColorStop(0, 'rgba(231, 76, 60, 0.8)');
            grad.addColorStop(1, 'rgba(231, 76, 60, 0)');
            ctx.fillStyle = grad;
            ctx.fill();
        }

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '22px sans-serif';

        if (data && data.explored) ctx.fillText('🔍', cx - r * 0.4, cy - r * 0.2);
        if (data && data.mapMapped) ctx.fillText('📜', cx - r * 0.4, cy + r * 0.2);

        if (data && data.type && MAP_CONFIG.types[data.type]) {
            ctx.fillText(MAP_CONFIG.types[data.type].icon, cx + r * 0.4, cy - r * 0.2);
        }
        if (data && data.terrain && MAP_CONFIG.terrains[data.terrain]) {
            ctx.fillText(MAP_CONFIG.terrains[data.terrain].icon, cx + r * 0.4, cy + r * 0.2);
        }

        if (data && data.squadHere) {
            this.drawCanvasFlag(cx, cy);
        }

        if (data && data.title) {
            this.drawTextPlate(ctx, data.title, cx, cy - r + 30, false);
        }
        if (data && (data.difficulty || data.regionLevel)) {
            let statsText = '';
            if (data.difficulty) statsText += `🎲${data.difficulty}`;
            if (data.regionLevel) statsText += `💀${data.regionLevel}`;
            this.drawTextPlate(ctx, statsText, cx, cy + 48, true);
        }

    },

    drawHoverEffect(cx, cy, r) {
        this.ctx.save();
        this.drawHexPath(cx, cy, r);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.restore();
    },

    drawTextPlate(ctx, text, x, y, isStats) {
        ctx.save();
        ctx.font = isStats ? '900 10px Montserrat, sans-serif' : 'italic bold 14px Tinos, serif';
        const metrics = ctx.measureText(text);
        const paddingH = 6;
        const w = metrics.width + paddingH * 2;
        const h = 18;

        ctx.fillStyle = 'rgba(20, 20, 20, 0.95)';
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x - w / 2, y - h / 2, w, h, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isStats ? '#ebd291' : '#ffd875';
        ctx.fillText(text, x, y);
        ctx.restore();
    },

    /**
     * Отрисовка миниатюрного флага на Canvas с эффектом плавного покачивания ветра
     * Эмулирует CSS-анимацию flagSwing (от -5deg до 5deg)
     */
    drawCanvasFlag(cx, cy) {
        const ctx = this.ctx;
        ctx.save();

        // 1. Сдвигаем матрицу к основанию древка флага (точка вращения)
        // Чтобы флаг качался от земли, сдвигаем к нижней точке древка
        ctx.translate(cx, cy + 15);

        // 2. Вычисляем динамический угол покачивания на базе времени (Date.now())
        // Скорость качания регулируется делителем 800, амплитуда (5 градусов) — умножением
        const swingAngleDeg = Math.sin(Date.now() / 800) * 5;
        const swingAngleRad = (Math.PI / 180) * swingAngleDeg;

        // Поворачиваем холст на вычисленный угол
        ctx.rotate(swingAngleRad);

        // Возвращаем координаты назад для отрисовки самого флага относительно точки вращения
        ctx.translate(-cx, -(cy + 15));

        // Сдвиг к верхней точке для рисования флага
        ctx.save();
        ctx.translate(cx - 5, cy - 25);

        // Древко флага (.squad-pole)
        ctx.fillStyle = '#333';
        ctx.fillRect(6, 0, 4, 40);

        // Полотнище флага (.squad-flag)
        ctx.fillStyle = '#c0392b';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(35, 10); // Треугольный вырез полотнища
        ctx.lineTo(10, 20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
        ctx.restore(); // Дважды восстанавливаем стейт context
    },

    /**
     * Точный pointy-topped расчет мыши с учетом правого выравнивания
     */
    attachMouseEvents() {
        const calculateVirtualCoords = (e) => {
            const zoom = ViewportManager.currentZoom || 1.0;
            const rect = this.canvas.getBoundingClientRect();

            // Расчет смещения мыши относительно правого верхнего угла (transform-origin: 100% 0)
            const distanceFromRight = rect.right - e.clientX;
            const distanceFromTop = e.clientY - rect.top;

            this.mouseX = 3840 - (distanceFromRight / zoom);
            this.mouseY = distanceFromTop / zoom;
        };

        this.canvas.addEventListener('mousemove', calculateVirtualCoords);

        this.canvas.addEventListener('mouseleave', () => {
            this.mouseX = -1000;
            this.mouseY = -1000;
            this.hoveredHexKey = null;
        });
    },
    /**
     * Включение анимации вспышки на гексе
     */
    triggerFocus(hexId) {
        this.focusedHexKey = hexId;
        this.focusTime = 0;

        // Автоматически выключаем вспышку через 3.6 секунды (как в старом коде)
        setTimeout(() => {
            if (this.focusedHexKey === hexId) {
                this.focusedHexKey = null;
            }
        }, 3600);
    }

};

export default HexCanvasRender;
