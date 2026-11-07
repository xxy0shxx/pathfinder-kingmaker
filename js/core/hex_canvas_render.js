import { MAP_CONFIG } from '../config/app_config.js';
import { ColorConverter } from '../utils/helpers.js';
import ViewportManager from '../services/viewport_manager.js';
import DebugManager from '../utils/debug.js';

const HexCanvasRender = {
    canvas: null,
    ctx: null,
    hexesData: {},
    hexCoords: {},
    hiddenSquadHexId: null,
    spawnTimers: {},
    colorCache: {},
    mouseX: -1000,
    mouseY: -1000,
    hoveredHexKey: null,
    focusedHexKey: null,
    focusAlpha: 0,
    focusTime: 0,
    showQuestTooltips: true,
    isAnimating: false,
    frameRequested: false,

    init(canvasElement, initialHexesData, coordinatesMap) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.hexCoords = coordinatesMap || {};

        this.canvas.width = 3840;
        this.canvas.height = 1280;

        this.updateData(initialHexesData);
        this.attachMouseEvents();
        this.requestFrame();
    },

    /**
     * Запрос единичного кадра перерисовки холста (On-Demand ядро)
     */
    requestFrame() {
        if (this.frameRequested || this.isAnimating) return;
        this.frameRequested = true;
        requestAnimationFrame(() => {
            this.frameRequested = false;
            this.render();
        });
    },

    /**
     * Контролируемый запуск цикла анимации
     */
    startAnimationLoop() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const loop = () => {
            this.render();

            const isRuneStyleActive = localStorage.getItem('kingmakerFrameStyle') === 'runes';
            if (this.isAnimating || isRuneStyleActive) {
                requestAnimationFrame(loop);
            }
        };
        requestAnimationFrame(loop);
    },

    /**
     * Перевод графического движка в режим энергосбережения
     */
    stopAnimationLoop() {
        this.isAnimating = false;
    },

    /**
     * Прием свежих данных гексов с предварительным кэшированием цветов
     */
    updateData(newHexesData, changedHexId = null) {
        const oldData = this.hexesData;
        const freshData = newHexesData ? JSON.parse(JSON.stringify(newHexesData)) : {};

        this.colorCache = {};
        let hasActiveSpawnAnimations = false;

        for (let key in freshData) {
            const oldHex = oldData[key];
            const newHex = freshData[key];

            if (newHex.color && newHex.color !== 'transparent') {
                this.colorCache[key] = ColorConverter.hexToRgba(newHex.color, 0.37);
            }

            const wasChanged = !oldHex ||
                oldHex.explored !== newHex.explored ||
                oldHex.mapMapped !== newHex.mapMapped ||
                oldHex.type !== newHex.type ||
                oldHex.terrain !== newHex.terrain;

            if (wasChanged || key === changedHexId) {
                this.spawnTimers[key] = Date.now();
                hasActiveSpawnAnimations = true;
            }
        }

        this.hexesData = freshData;

        const isRuneStyleActive = localStorage.getItem('kingmakerFrameStyle') === 'runes';

        if (hasActiveSpawnAnimations || isRuneStyleActive) {
            this.startAnimationLoop(); // Запускаем постоянный цикл для мерцания рун
        } else {
            this.requestFrame();
        }
    },

    drawHexPath(cx, cy, r) {
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle_rad = (Math.PI / 180) * (60 * i - 30);
            const x = cx + r * Math.cos(angle_rad);
            const y = cy + r * Math.sin(angle_rad);
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
    },

    render() {
        DebugManager.profileFps();

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (localStorage.getItem('kingmakerFrameStyle') === 'runes' && window.FrameManager) {
            const frame = document.querySelector('.kingmaker-frame');
            if (frame) {
                window.FrameManager.updateFrameRunes(frame.offsetWidth, frame.offsetHeight);
            }
        }

        const r = MAP_CONFIG.grid.radius;
        let activeTimersCount = 0;
        let needsOngoingAnimation = false;
        let isSquadPresentOnMap = false;

        for (let row = 0; row < MAP_CONFIG.grid.rows; row++) {
            for (let col = 0; col < MAP_CONFIG.grid.cols; col++) {
                const hexKey = `hex_${row}_${col}`;
                const coords = this.hexCoords[hexKey];
                if (!coords) continue;

                const cx = coords.cx;
                const cy = coords.cy;
                const data = this.hexesData[hexKey] ? { ...this.hexesData[hexKey] } : null;

                if (data && this.hiddenSquadHexId === hexKey) {
                    data.hasVisited = true;
                    data.squadHere = false;
                }

                if (data && data.squadHere) {
                    isSquadPresentOnMap = true;
                }

                if (hexKey === this.focusedHexKey) {
                    this.focusTime += 0.05;
                    this.focusAlpha = 0.5 + Math.sin(this.focusTime * 2) * 0.3;
                    needsOngoingAnimation = true;

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

                if (this.spawnTimers[hexKey]) {
                    if (Date.now() - this.spawnTimers[hexKey] < 250) {
                        activeTimersCount++;
                    } else {
                        delete this.spawnTimers[hexKey];
                    }
                }

                this.drawSingleHex(cx, cy, r, data, hexKey);

                if (this.hoveredHexKey === hexKey) {
                    this.drawHoverEffect(cx, cy, r);
                }
            }
        }

        const isRuneStyleActive = localStorage.getItem('kingmakerFrameStyle') === 'runes';

        if (activeTimersCount > 0 || needsOngoingAnimation || this.hiddenSquadHexId || isSquadPresentOnMap) {
            this.isAnimating = true;
        } else if (this.isAnimating) {
            this.stopAnimationLoop();
        }
    },





    drawSingleHex(cx, cy, r, data, hexKey) {
        const ctx = this.ctx;

        // 1. Быстрая заливка из предвычисленного кэша цветов
        if (this.colorCache[hexKey]) {
            this.drawHexPath(cx, cy, r);
            ctx.fillStyle = this.colorCache[hexKey];
            ctx.fill();
        }

        // 2. Туман войны (с динамической регулировкой плотности из настроек ГМа)
        if (MAP_CONFIG.isGlobalFogEnabled) {
            const isRevealed = !!(data && (data.explored || data.hasVisited || data.squadHere));
            if (!isRevealed) {
                this.drawHexPath(cx, cy, r);

                // Используем сохраненный коэффициент window.GLOBAL_FOG_OPACITY (по дефолту 0.7)
                const currentAlpha = window.GLOBAL_FOG_OPACITY !== undefined ? window.GLOBAL_FOG_OPACITY : 0.7;
                ctx.fillStyle = `rgba(0, 0, 0, ${currentAlpha})`;
                ctx.fill();
            }
        }

        // 3. Свечение под домашней клеткой отряда
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

        // Вычисляем текущий коэффициент scale для анимации спавна
        let iconScale = 1.0;
        if (this.spawnTimers[hexKey]) {
            const elapsed = Date.now() - this.spawnTimers[hexKey];
            iconScale = Math.min(1.0, elapsed / 250);
        }

        const drawAnimatedIcon = (iconText, targetX, targetY) => {
            ctx.save();
            ctx.translate(targetX, targetY);
            if (iconScale !== 1.0) ctx.scale(iconScale, iconScale);

            ctx.beginPath();
            ctx.arc(0, 0, 14, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(20, 20, 20, 0.75)';
            ctx.strokeStyle = '#d4af37';
            ctx.lineWidth = 1.5;
            ctx.fill();
            ctx.stroke();

            ctx.font = '18px sans-serif';
            ctx.fillText(iconText, 0, 1);
            ctx.restore();
        };

        // 4. Отрисовка статусов и слоев
        if (data && data.explored) drawAnimatedIcon('🔍', cx - r * 0.42, cy - r * 0.22);
        if (data && data.mapMapped) drawAnimatedIcon('📜', cx - r * 0.42, cy + r * 0.22);
        if (data && data.type && MAP_CONFIG.types[data.type]) drawAnimatedIcon(MAP_CONFIG.types[data.type].icon, cx + r * 0.42, cy - r * 0.22);
        if (data && data.terrain && MAP_CONFIG.terrains[data.terrain]) drawAnimatedIcon(MAP_CONFIG.terrains[data.terrain].icon, cx + r * 0.42, cy + r * 0.22);

        // Флаг отрисовывается и колышется всегда
        if (data && data.squadHere) {
            const currentSkin = window.CURRENT_SQUAD_TOKEN_SKIN || 'flag';
            if (currentSkin === '3dknight') {
                this.draw3DKnightToken(cx, cy);
            } else {
                this.drawCanvasFlag(cx, cy); // Старый дефолтный флаг
            }
        }

        // 5. Текстовые плашки названий и характеристик
        if (data && data.title) {
            this.drawTextPlate(ctx, data.title, cx, cy - r + 32, false, true);
        }

        if (data && (data.difficulty || data.regionLevel)) {
            let statsText = '';
            if (data.difficulty) statsText += `🎲${data.difficulty}`;
            if (data.regionLevel) statsText += `💀${data.regionLevel}`;
            this.drawTextPlate(ctx, statsText, cx, cy + 54, true, false);
        }

        // 6. Парящий тултип активного задания
        if (this.showQuestTooltips && data && data.questData && data.questData.title && data.questData.status !== 'completed') {
            const questTitle = data.questData.title.trim();
            if (questTitle !== '') {
                this.drawQuestPlate(ctx, `⚜️ ${questTitle}`, cx, cy - r + 8);
            }
        }
    },

    /**
     * Математически точный и защищенный 3D low-poly движок шахматного Ферзя из граней
     */
    draw3DKnightToken(cx, cy) {
        const ctx = this.ctx;
        ctx.save();

        // Центрируем фигуру в гексе отряда и приподнимаем ее для идеального баланса
        ctx.translate(cx, cy - 6);

        // 1. АНИМАЦИЯ: Живое вертикальное покачивание (дыхание) и непрерывное плавное вращение
        const time = Date.now() / 1000;
        const bounceY = Math.sin(time * 2.2) * 1.8;
        const angleY = time * 0.45; // Скорость вращения фигуры

        ctx.translate(0, bounceY);

        // Направление солнца (светит под углом 45 градусов сверху-слева-спереди)
        const lightDir = [0.5, -0.8, 0.4];
        const lLength = Math.sqrt(lightDir[0]*lightDir[0] + lightDir[1]*lightDir[1] + lightDir[2]*lightDir[2]);
        const lNorm = [lightDir[0]/lLength, lightDir[1]/lLength, lightDir[2]/lLength];

        // 2. ГЕОМЕТРИЯ: Процедурно генерируем 3D-вершины слоями [X, Y, Z]
        const vertices = [];
        const segments = 10; // Количество граней по окружности (Low-Poly рельеф)

        // Чистый массив профиля Ферзя по вертикали: [радиус, высота Y]
        // Пьедестал -> Юбка -> Корсет -> Воротник -> Шея -> Корона -> Навершие
        const profile = [
            [16, 25],  // 0: Широкое основание (низ)
            [16, 21],  // 1: Основание (верх)
            [13, 16],  // 2: Начало конуса юбки
            [7, 2],    // 3: Сужение талии
            [6, -6],   // 4: Корсет
            [8, -11],  // 5: Воротник расширение
            [5, -14],  // 6: Шея сужение
            [8, -20],  // 7: Основание короны
            [11, -26], // 8: Зубцы короны (пик расширения)
            [0, -32]   // 9: Магическое навершие/шарик на макушке
        ];

        // Генерируем 3D-вершины для каждого радиального слоя
        for (let j = 0; j < profile.length; j++) {
            const radius = profile[j][0];
            const h = profile[j][1];

            for (let i = 0; i < segments; i++) {
                const ang = (Math.PI * 2 / segments) * i;

                // Для макушки (навершия) стягиваем все точки в одну координату
                if (j === profile.length - 1) {
                    vertices.push([0, h, 0]);
                } else {
                    vertices.push([Math.cos(ang) * radius, h, Math.sin(ang) * radius]);
                }
            }
        }

        // 3. ТОПОЛОГИЯ: Автоматически собираем замкнутые полигоны (Faces) без ручных ошибок
        const faces = [];

        // Строим боковые Low-Poly пояса между слоями профиля
        for (let j = 0; j < profile.length - 1; j++) {
            const layerOffset = j * segments;
            const nextLayerOffset = (j + 1) * segments;

            for (let i = 0; i < segments; i++) {
                const next = (i + 1) % segments;

                // Слой 8 — это зубцы короны. Делаем прорези, пропуская каждый второй полигон через один!
                if (j === 8) {
                    if (i % 2 === 0) {
                        faces.push([layerOffset + i, layerOffset + next, nextLayerOffset + next]);
                    }
                }
                // Верхний купол навершия закрываем треугольниками
                else if (j === profile.length - 2) {
                    faces.push([layerOffset + i, layerOffset + next, nextLayerOffset + i]);
                }
                // Стандартные четырехугольные Low-Poly плашки для тела фигуры
                else {
                    faces.push([layerOffset + i, layerOffset + next, nextLayerOffset + next, nextLayerOffset + i]);
                }
            }
        }

        // 4. ТРАНСФОРМАЦИЯ: Поворачиваем 3D-вершины в пространстве вокруг вертикальной оси Y
        const projected = vertices.map(v => {
            const x = v[0], y = v[1], z = v[2];
            const rotX = x * Math.cos(angleY) + z * Math.sin(angleY);
            const rotZ = -x * Math.sin(angleY) + z * Math.cos(angleY);
            return [rotX, y, rotZ];
        });

        // 5. Z-SORTING (Алгоритм художника): Корректно перекрываем грани по глубине Z для исключения артефактов
        const renderOrder = faces.map((f, idx) => {
            let zSum = 0;
            for (let vIdx of f) {
                zSum += projected[vIdx][2];
            }
            return { face: f, z: zSum / f.length, origIdx: idx };
        }).sort((a, b) => a.z - b.z); // Сначала рисуем дальние полигоны

        // 6. ПОСЛОЙНЫЙ 3D-РЕНДЕРИНГ И Flat Shading ОСВЕЩЕНИЕ ЛАМБЕРТА
        renderOrder.forEach(item => {
            const f = item.face;

            // Расчет вектора нормали текущей грани по ее оригинальным 3D-координатам
            const p0 = vertices[f[0]], p1 = vertices[f[1]], p2 = vertices[f[2]];
            const ax = p1[0] - p0[0], ay = p1[1] - p0[1], az = p1[2] - p0[2];
            const bx = p2[0] - p0[0], by = p2[1] - p0[1], bz = p2[2] - p0[2];

            let nx = ay * bz - az * by;
            let ny = az * bx - ax * bz;
            let nz = ax * by - ay * bx;
            const nLen = Math.sqrt(nx*nx + ny*ny + nz*nz);

            if (nLen > 0) {
                nx /= nLen; ny /= nLen; nz /= nLen;

                // Поворачиваем вектор нормали вслед за вращением фигуры вокруг оси Y
                const rNx = nx * Math.cos(angleY) + nz * Math.sin(angleY);
                const rNz = -nx * Math.sin(angleY) + nz * Math.cos(angleY);

                // Скалярное произведение нормали и солнца (Закон Ламберта)
                const dot = rNx * lNorm[0] + ny * lNorm[1] + rNz * lNorm[2];
                const intensity = Math.max(0.24, dot); // Фоновый Ambient свет для мягких теней

                // Отрисовываем контур полигона на Canvas
                ctx.beginPath();
                ctx.moveTo(projected[f[0]][0], projected[f[0]][1]);
                for (let i = 1; i < f.length; i++) {
                    ctx.lineTo(projected[f[i]][0], projected[f[i]][1]);
                }
                ctx.closePath();

                // Яркий королевский золотой градиент, переливающийся на свету
                const r = Math.floor(195 + 60 * intensity);
                const g = Math.floor(152 + 55 * intensity);
                const b = Math.floor(45 + 30 * intensity);

                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                ctx.fill();

                // Тонкая золоченая обводка ребер для красивого подчеркивания объема Low-Poly граней
                ctx.strokeStyle = "rgba(255, 240, 180, 0.32)";
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        });

        ctx.restore();

        // Удерживаем цикл анимации активным для непрерывной перерисовки кадров вращения
        this.isAnimating = true;
    },



    drawQuestPlate(ctx, text, x, y) {
        ctx.save();
        ctx.font = 'bold 12px Montserrat, sans-serif';
        const metrics = ctx.measureText(text);
        const w = metrics.width + 16;
        const h = 20;

        ctx.fillStyle = 'rgba(25, 15, 35, 0.95)';
        ctx.strokeStyle = '#ebd291';
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.roundRect(x - w / 2, y - h / 2, w, h, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
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

    drawTextPlate(ctx, text, x, y, isStats, isLargeTitle = false) {
        ctx.save();
        ctx.font = isStats ? '900 10px Montserrat, sans-serif' : (isLargeTitle ? 'italic bold 22px Tinos, serif' : 'italic bold 14px Tinos, serif');

        const metrics = ctx.measureText(text);
        const w = metrics.width + (isLargeTitle ? 24 : 16);
        const h = isLargeTitle ? 28 : 18;

        ctx.fillStyle = 'rgba(20, 20, 20, 0.95)';
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = isLargeTitle ? 2.5 : 2;

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
        ctx.rotate((Math.PI / 180) * swingAngleDeg);
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
        const tooltipElem = document.getElementById('hexTooltip');
        const r = MAP_CONFIG.grid.radius;
        const h = r * Math.sqrt(3);

        const calculateVirtualCoords = (e) => {
            const zoom = ViewportManager.currentZoom || 1.0;
            const rect = this.canvas.getBoundingClientRect();

            const distanceFromRight = rect.right - e.clientX;
            const distanceFromTop = e.clientY - rect.top;

            this.mouseX = 3840 - (distanceFromRight / zoom);
            this.mouseY = distanceFromTop / zoom;

            let currentHoverKey = null;
            let minDistance = Infinity;

            for (let hexKey in this.hexCoords) {
                const coords = this.hexCoords[hexKey];
                const dist = Math.hypot(this.mouseX - coords.cx, this.mouseY - coords.cy);
                if (dist < h / 2 && dist < minDistance) {
                    minDistance = dist;
                    currentHoverKey = hexKey;
                }
            }

            if (this.hoveredHexKey !== currentHoverKey) {
                this.hoveredHexKey = currentHoverKey;
                this.updateTooltipState(tooltipElem);
                this.requestFrame();
            }

            if (tooltipElem && tooltipElem.style.display === 'block') {
                tooltipElem.style.left = (e.clientX + 25) + 'px';
                tooltipElem.style.top = (e.clientY + 25) + 'px';
            }
        };

        this.canvas.addEventListener('mousemove', calculateVirtualCoords);
        this.canvas.addEventListener('mouseleave', () => {
            this.mouseX = -1000;
            this.mouseY = -1000;
            if (this.hoveredHexKey) {
                this.hoveredHexKey = null;
                this.requestFrame();
            }
            if (tooltipElem) {
                tooltipElem.style.display = 'none';
                tooltipElem.innerHTML = '';
            }
        });
    },

    updateTooltipState(tooltip) {
        if (!tooltip) return;
        const hexKey = this.hoveredHexKey;
        if (!hexKey) {
            tooltip.style.display = 'none';
            return;
        }

        const [_, row, col] = hexKey.split('_');
        const data = this.hexesData[hexKey] || null;
        const isRevealed = !!(data && (data.explored || data.hasVisited || data.squadHere));

        if (!data || (!data.title && !data.text)) {
            tooltip.innerHTML = `<div class="tooltip-title" style="color: #95a5a6;">📍 Гекс [${row};${col}]</div>
                                 <div style="font-size: 16px; color: #ccc; margin: 8px 0 4px 0;">❌ <span style="color: #7f8c8d;">Не разведан</span></div>`;
            tooltip.style.display = 'block';
            return;
        }

        let content = '';
        if (isRevealed && data.title) {
            const star = data.explored ? '🔍 ' : '';
            const mapIcon = data.mapMapped ? '📜 ' : '';
            let statsLabel = data.difficulty && data.regionLevel ? ` (СЛ ${data.difficulty} / lvl ${data.regionLevel})` : (data.difficulty ? ` (СЛ ${data.difficulty})` : (data.regionLevel ? ` (lvl ${data.regionLevel})` : ''));
            const typeIcon = MAP_CONFIG.types[data.type]?.icon || '';
            const terrainIcon = MAP_CONFIG.terrains[data.terrain]?.icon || '';
            content += `<div class="tooltip-title">${terrainIcon}${star}${mapIcon}${typeIcon}${data.title}${statsLabel}</div>`;
        } else {
            content += `<div class="tooltip-title" style="color: #95a5a6;">📍 Гекс [${row};${col}]</div>`;
        }

        let paramsBlock = '';
        paramsBlock += `<div style="margin-bottom: 4px;">${data.explored ? '🔍 <b>Разведан</b>' : '❌ <span style="color: #7f8c8d;">Не разведан</span>'}</div>`;
        paramsBlock += `<div style="margin-bottom: 4px;">${data.mapMapped ? '📜 <b>Карта составлена</b>' : '❌ <span style="color: #7f8c8d;">Карта отсутствует</span>'}</div>`;
        if (data.squadHere) paramsBlock += `<div style="margin-bottom: 4px; color: #ff7675;">🚩 <b>Отряд в гексе</b></div>`;

        if (isRevealed) {
            if (data.difficulty) paramsBlock += `<div style="margin-bottom: 4px;">🎲 <b>Сложность:</b> <span class="tooltip-value">${data.difficulty}</span></div>`;
            if (data.regionLevel) paramsBlock += `<div style="margin-bottom: 4px;">💀 <b>Уровень:</b> <span class="tooltip-value">${data.regionLevel}</span></div>`;
            if (data.type && MAP_CONFIG.types[data.type]) paramsBlock += `<div style="margin-bottom: 4px;">${MAP_CONFIG.types[data.type].icon} <b>Объект:</b> <span class="tooltip-value">${MAP_CONFIG.types[data.type].label}</span></div>`;
            if (data.terrain && MAP_CONFIG.terrains[data.terrain]) paramsBlock += `<div style="margin-bottom: 4px;">${MAP_CONFIG.terrains[data.terrain].icon} <b>Местность:</b> <span class="tooltip-value">${MAP_CONFIG.terrains[data.terrain].label} 🎲СЛ ${MAP_CONFIG.terrains[data.terrain].dc}</span></div>`;
        }

        content += `<div style="font-size: 16px; color: #ccc; margin: 8px 0 12px 0; line-height: 1.3;">${paramsBlock}</div>`;
        if (data.text) content += `<div style="border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 8px;" class="tooltip-desc">${data.text.replace(/\n/g, '<br>')}</div>`;
        if (isRevealed && data.lastSaved) content += `<div style="margin-top: 8px; font-size: 12px; color: #888; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 4px;">🛡️ ${data.lastSaved}</div>`;

        tooltip.innerHTML = content;
        tooltip.style.display = 'block';
    },

    triggerFocus(hexId) {
        this.focusedHexKey = hexId;
        this.focusTime = 0;
        this.startAnimationLoop();
        setTimeout(() => {
            if (this.focusedHexKey === hexId) {
                this.focusedHexKey = null;
                this.requestFrame();
            }
        }, 3600);
    }
};

export default HexCanvasRender;
