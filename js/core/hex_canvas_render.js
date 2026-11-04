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
    showQuestTooltips: true,  // Глобальный флаг видимости мини-тултипов квестов на карте

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
        if (this.showQuestTooltips && data && data.questData && data.questData.title && data.questData.status !== 'completed') {
            const questTitle = data.questData.title.trim();
            if (questTitle !== '') {
                // Вычисляем точную позицию по Y (чуть выше верхнего угла pointy-topped гекса)
                // В оригинальном коде смещение было (cy - radius + 12)
                const questY = cy - r + 12;

                // Рисуем рамку с текстом квеста, используя геральдический знак ⚜️
                this.drawQuestPlate(ctx, `⚜️ ${questTitle}`, cx, questY);
            }
        }
    },
    /**
     * Отрисовка стилизованной плашки мини-тултипа квеста (с белым текстом и фиолетово-золотым отливом ⚜️)
     */
    drawQuestPlate(ctx, text, x, y) {
        ctx.save();
        ctx.font = 'bold 12px Montserrat, sans-serif';
        const metrics = ctx.measureText(text);
        const paddingH = 8;
        const w = metrics.width + paddingH * 2;
        const h = 20;

        // Красивая темная подложка с легким фиолетовым оттенком для квестов
        ctx.fillStyle = 'rgba(25, 15, 35, 0.95)';
        ctx.strokeStyle = '#ebd291'; // Золотая рамка
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.roundRect(x - w / 2, y - h / 2, w, h, 4);
        ctx.fill();
        ctx.stroke();

        // Белый контрастный текст для заданий
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x, y);
        ctx.restore();
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
        // Кэшируем ссылку на элемент тултипа, чтобы не искать его каждый кадр
        const tooltipElem = document.getElementById('hexTooltip');

        const calculateVirtualCoords = (e) => {
            const zoom = ViewportManager.currentZoom || 1.0;
            const rect = this.canvas.getBoundingClientRect();

            // Расчет смещения мыши относительно правого верхнего угла (transform-origin: 100% 0)
            const distanceFromRight = rect.right - e.clientX;
            const distanceFromTop = e.clientY - rect.top;

            this.mouseX = 3840 - (distanceFromRight / zoom);
            this.mouseY = distanceFromTop / zoom;

            // СИНХРОНИЗАЦИЯ ТУЛТИПА: Двигаем тултип вслед за курсором мыши на экране (как в старом коде)
            if (tooltipElem && tooltipElem.style.display === 'block') {
                tooltipElem.style.left = (e.clientX + 25) + 'px';
                tooltipElem.style.top = (e.clientY + 25) + 'px';
            }
        };

        this.canvas.addEventListener('mousemove', calculateVirtualCoords);

        // Каждую миллисекунду проверяем, изменился ли гекс под курсором
        this.canvas.addEventListener('mousemove', () => {
            this.updateTooltipState(tooltipElem);
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouseX = -1000;
            this.mouseY = -1000;
            this.hoveredHexKey = null;
            if (tooltipElem) {
                tooltipElem.style.display = 'none';
                tooltipElem.innerHTML = '';
            }
        });
    },

    /**
     * Динамическое наполнение оригинального HTML-тултипа для ВСЕХ гексов
     */
    updateTooltipState(tooltip) {
        if (!tooltip) return;

        const hexKey = this.hoveredHexKey;

        // Если мышь не наведена ни на один гекс — скрываем тултип
        if (!hexKey) {
            tooltip.style.display = 'none';
            tooltip.innerHTML = '';
            return;
        }

        // Извлекаем строку 'hex_row_col' и парсим чистые координаты сетки для вывода
        const [_, row, col] = hexKey.split('_');
        const data = this.hexesData[hexKey] || null;

        // Флаг: рассеян ли туман войны над гексом
        const isRevealed = !!(data && (data.explored || data.hasVisited || data.squadHere));

        let content = '';

        // 1. ЗАГОЛОВОК ТУЛТИПА
        if (isRevealed && data && data.title) {
            // Если гекс открыт и у него есть имя — пишем кастомное имя объекта
            const star = data.explored ? '🔍 ' : '';
            const mapIcon = data.mapMapped ? '📜 ' : '';

            let statsLabel = '';
            if (data.difficulty && data.regionLevel) {
                statsLabel = ` (СЛ ${data.difficulty} / lvl ${data.regionLevel})`;
            } else if (data.difficulty) {
                statsLabel = ` (СЛ ${data.difficulty})`;
            } else if (data.regionLevel) {
                statsLabel = ` (lvl ${data.regionLevel})`;
            }

            const typeIcon = MAP_CONFIG.types[data.type]?.icon || '';
            const terrainIcon = MAP_CONFIG.terrains[data.terrain]?.icon || '';

            content += `<div class="tooltip-title">${terrainIcon}${star}${mapIcon}${typeIcon}${data.title}${statsLabel}</div>`;
        } else {
            // Если гекс скрыт туманом или пустой — выводим его системные координаты Kingmaker
            content += `<div class="tooltip-title" style="color: #95a5a6;">📍 Гекс [Строка: ${row}, Колонка: ${col}]</div>`;
        }

        // 2. БЛОК СТАТУСНЫХ ПАРАМЕТРОВ ГЕКСА
        let paramsBlock = '';

        const isExplored = !!(data && data.explored);
        const isMapped = !!(data && data.mapMapped);
        const isSquad = !!(data && data.squadHere);

        paramsBlock += `<div style="margin-bottom: 4px;">${isExplored ? '🔍 <b>Разведан</b>' : '❌ <span style="color: #7f8c8d;">Не разведан</span>'}</div>`;
        paramsBlock += `<div style="margin-bottom: 4px;">${isMapped ? '📜 <b>Карта составлена</b>' : '❌ <span style="color: #7f8c8d;">Карта отсутствует</span>'}</div>`;

        if (isSquad) {
            paramsBlock += `<div style="margin-bottom: 4px; color: #ff7675;">🚩 <b>Отряд в гексе</b></div>`;
        }

        // Выводим сложность и уровень, только если они заполнены и гекс открыт
        if (isRevealed && data) {
            if (data.difficulty) {
                paramsBlock += `<div style="margin-bottom: 4px;">🎲 <b>Сложность:</b> <span class="tooltip-value">${data.difficulty}</span></div>`;
            }
            if (data.regionLevel) {
                paramsBlock += `<div style="margin-bottom: 4px;">💀 <b>Уровень:</b> <span class="tooltip-value">${data.regionLevel}</span></div>`;
            }
            if (data.type && MAP_CONFIG.types[data.type]) {
                const tData = MAP_CONFIG.types[data.type];
                paramsBlock += `<div style="margin-bottom: 4px;">${tData.icon} <b>Объект:</b> <span class="tooltip-value">${tData.label}</span></div>`;
            }
            if (data.terrain && MAP_CONFIG.terrains[data.terrain]) {
                const terrData = MAP_CONFIG.terrains[data.terrain];
                paramsBlock += `<div style="margin-bottom: 4px;">${terrData.icon} <b>Местность:</b> <span class="tooltip-value">${terrData.label} 🎲СЛ ${terrData.dc}</span></div>`;
            }
        }

        content += `<div style="font-size: 16px; color: #ccc; margin: 8px 0 12px 0; line-height: 1.3;">${paramsBlock}</div>`;

        // 3. БЛОК ОПИСАНИЯ (Показываем только для открытых территорий)
        if (isRevealed && data && data.text) {
            content += `<div style="border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 8px;" class="tooltip-desc">${data.text.replace(/\n/g, '<br>')}</div>`;
        }

        if (isRevealed && data && data.lastSaved) {
            content += `<div style="margin-top: 8px; font-size: 12px; color: #888; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 4px;">🛡️ ${data.lastSaved}</div>`;
        }

        tooltip.innerHTML = content;
        tooltip.style.display = 'block';
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