import { MAP_CONFIG } from '../config/app_config.js';
import { ColorConverter } from '../utils/helpers.js';
import ViewportManager from '../services/viewport_manager.js';

const HexCanvasRender = {
    canvas: null,
    ctx: null,
    hexesData: {},
    hexCoords: {},
    hiddenSquadHexId: null,

    // Менеджер анимаций появления иконок (сохраняет время изменения для плавного scale)
    spawnTimers: {},

    mouseX: -1000,
    mouseY: -1000,
    hoveredHexKey: null,
    focusedHexKey: null,
    focusAlpha: 0,
    focusTime: 0,

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

    /**
     * Вызывается при сохранении изменений. Засекает время для анимации появления иконок
     */
    updateData(newHexesData, changedHexId = null) {
        const oldData = this.hexesData;
        const freshData = newHexesData ? JSON.parse(JSON.stringify(newHexesData)) : {};

        // Проверяем, у каких гексов изменились статусы разведки или объекты
        for (let key in freshData) {
            const oldHex = oldData[key];
            const newHex = freshData[key];

            const wasChanged = !oldHex ||
                oldHex.explored !== newHex.explored ||
                oldHex.mapMapped !== newHex.mapMapped ||
                oldHex.type !== newHex.type ||
                oldHex.terrain !== newHex.terrain;

            if (wasChanged) {
                // Запоминаем текущий штамп времени для старта анимации плавного масштабирования
                this.spawnTimers[key] = Date.now();
            }
            if (changedHexId) {
                this.spawnTimers[changedHexId] = Date.now();
            }
        }

        this.hexesData = freshData;
    },

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
        const h = r * Math.sqrt(3);

        let currentHoverKey = null;
        let minDistance = Infinity;

        for (let row = 0; row < MAP_CONFIG.grid.rows; row++) {
            for (let col = 0; col < MAP_CONFIG.grid.cols; col++) {

                const hexKey = `hex_${row}_${col}`;
                const coords = this.hexCoords[hexKey];

                if (!coords) continue;

                const cx = coords.cx;
                const cy = coords.cy;

                const dist = Math.hypot(this.mouseX - cx, this.mouseY - cy);
                if (dist < h / 2 && dist < minDistance) {
                    minDistance = dist;
                    currentHoverKey = hexKey;
                }

                const data = this.hexesData[hexKey] ? { ...this.hexesData[hexKey] } : null;

                if (data) {
                    if (this.hiddenSquadHexId === hexKey) {
                        data.hasVisited = true;
                        data.squadHere = false;
                    }
                }

                if (hexKey === this.focusedHexKey) {
                    this.focusTime += 0.05;
                    this.focusAlpha = 0.5 + Math.sin(this.focusTime * 2) * 0.3;
                }

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

                // Передаем уникальный hexKey для расчета таймеров анимации иконок
                this.drawSingleHex(cx, cy, r, data, hexKey);

                if (currentHoverKey === hexKey) {
                    this.drawHoverEffect(cx, cy, r);
                }
            }
        }

        this.hoveredHexKey = currentHoverKey;
    },

    drawSingleHex(cx, cy, r, data, hexKey) {
        const ctx = this.ctx;

        // 1. Заливка кастомным цветом подложки
        if (data && data.color && data.color !== 'transparent') {
            this.drawHexPath(cx, cy, r);
            ctx.fillStyle = ColorConverter.hexToRgba(data.color, 0.37);
            ctx.fill();
        }

        // 2. Единый туман войны (исправленный, без дублирующего блока)
        const isRevealed = !!(data && (data.explored === true || data.hasVisited === true || data.squadHere === true));

        if (!isRevealed) {
            this.drawHexPath(cx, cy, r);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fill();
        }

        // 3. Свечение домашней клетки отряда
        if (data && data.squadHere) {
            this.drawHexPath(cx, cy, r);
            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.7);
            grad.addColorStop(0, 'rgba(231, 76, 60, 0.8)');
            grad.addColorStop(1, 'rgba(231, 76, 60, 0)');
            ctx.fillStyle = grad;
            ctx.fill();
        }

        // Настройка базовых параметров шрифта для верхнего слоя
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '24px sans-serif'; // Немного увеличили размер для четкости

        // Вычисляем текущий коэффициент масштабирования (scale) для анимации появления иконок
        let iconScale = 1.0;
        if (this.spawnTimers[hexKey]) {
            const elapsed = Date.now() - this.spawnTimers[hexKey];
            const duration = 250; // Время анимации в мс (как в CSS iconAppear)
            if (elapsed < duration) {
                iconScale = elapsed / duration; // Изменяется плавно от 0.0 до 1.0
            } else {
                delete this.spawnTimers[hexKey]; // Очищаем таймер по окончании анимации
            }
        }

        // Вспомогательный хелпер для сочной отрисовки смайлов/иконок с drop-shadow
        const drawAnimatedIcon = (iconText, targetX, targetY) => {
            ctx.save();

            // Переносим матрицу в центр иконки и плавно увеличиваем от 0.0 до 1.0
            ctx.translate(targetX, targetY);
            ctx.scale(iconScale, iconScale);

            // РИСУЕМ КОНТРАСТНЫЙ КРУЖОК-ПОДЛОЖКУ (Убирает тусклость на 100%)
            ctx.beginPath();
            ctx.arc(0, 0, 14, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(20, 20, 20, 0.75)'; // Темный сочный фон
            ctx.strokeStyle = '#d4af37';             // Тонкий золотой кант
            ctx.lineWidth = 1.5;
            ctx.fill();
            ctx.stroke();

            // Рисуем сам эмодзи поверх кружка
            ctx.font = '18px sans-serif'; // Оптимальный размер под кружок
            ctx.fillText(iconText, 0, 1); // Смещение по Y для идеального центрирования смайла

            ctx.restore();
        };


        // 4. Отрисовка статусов разведки (🔍 Лупа, 📜 Свиток)
        if (data && data.explored) {
            drawAnimatedIcon('🔍', cx - r * 0.42, cy - r * 0.22);
        }
        if (data && data.mapMapped) {
            drawAnimatedIcon('📜', cx - r * 0.42, cy + r * 0.22);
        }

        // 5. Отрисовка иконок объектов и ландшафта (🏛️ Постройки, 🌲 Леса)
        if (data && data.type && MAP_CONFIG.types[data.type]) {
            drawAnimatedIcon(MAP_CONFIG.types[data.type].icon, cx + r * 0.42, cy - r * 0.22);
        }
        if (data && data.terrain && MAP_CONFIG.terrains[data.terrain]) {
            drawAnimatedIcon(MAP_CONFIG.terrains[data.terrain].icon, cx + r * 0.42, cy + r * 0.22);
        }

        // 6. Отрисовка флага отряда с покачиванием
        if (data && data.squadHere) {
            this.drawCanvasFlag(cx, cy);
        }

        // 7. Текстовые плашки (Название и Статы региона)
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

    drawCanvasFlag(cx, cy) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(cx, cy + 15);

        const swingAngleDeg = Math.sin(Date.now() / 800) * 5;
        const swingAngleRad = (Math.PI / 180) * swingAngleDeg;
        ctx.rotate(swingAngleRad);
        ctx.translate(-cx, -(cy + 15));
        ctx.save();
        ctx.translate(cx - 5, cy - 25);
        ctx.fillStyle = '#333';
        ctx.fillRect(6, 0, 4, 40);
        ctx.fillStyle = '#c0392b';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(35, 10);
        ctx.lineTo(10, 20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        ctx.restore();
    },
    attachMouseEvents() {
        const calculateVirtualCoords = (e) => {
            const zoom = ViewportManager.currentZoom || 1.0;
            const rect = this.canvas.getBoundingClientRect();
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
    triggerFocus(hexId) {
        this.focusedHexKey = hexId;
        this.focusTime = 0;
        setTimeout(() => {
            if (this.focusedHexKey === hexId) {
                this.focusedHexKey = null;
            }
        }, 3600);
    }
};
export default HexCanvasRender;