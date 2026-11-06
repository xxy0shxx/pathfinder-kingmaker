// ============================================================================
// ЧАСТЬ 1 ИЗ 10: ИМПОРТЫ, СТРУКТУРА ОБЪЕКТА И ВНУТРЕННЕЕ СОСТОЯНИЕ (STATE)
// ============================================================================

import { MAP_CONFIG } from '../config/app_config.js';
import { ColorConverter } from '../utils/helpers.js';
import ViewportManager from '../services/viewport_manager.js';

/**
 * Модуль управления тактической боевой картой привала / лагеря (Tactical Grid)
 */
const TacticalMapManager = {
    // Геометрические параметры сетки по умолчанию
    campParams: {
        src: 'img/map_camp1.png',
        width: 1280,
        height: 1024,
        squareSize: 42.7,
        offsetX: 0,
        offsetY: 0,
        cols: 0,
        rows: 0
    },

    // Локальное изолированное состояние (State) модуля
    state: {
        isCampFogEnabled: true,
        focusedEntityId: null,
        campMapData: {},
        currentMapMode: 'global',
        currentHexId: null
    },
    // ============================================================================
    // ЧАСТЬ 2 ИЗ 10: МЕТОДЫ ИНИЦИАЛИЗАЦИИ И СМЕНЫ РЕЖИМОВ ОТОБРАЖЕНИЯ (INIT & SWITCH)
    // ============================================================================

    /**
     * Точка входа: Первичная калькуляция сетки лагеря
     */
    init() {
        const self = TacticalMapManager;
        self.campParams.cols = Math.floor(self.campParams.width / self.campParams.squareSize) + 1;
        self.campParams.rows = Math.floor(self.campParams.height / self.campParams.squareSize) + 1;

        try {
            self.state.campMapData = JSON.parse(localStorage.getItem('campMapSystemData')) || {};
        } catch (e) {
            console.error("Критическая ошибка чтения campMapSystemData:", e);
            self.state.campMapData = {};
        }

        self.initMapSelector();
        self.initFormEventListeners();
        self.initFogToggleButton();
        self.initGridEventDelegation();
    },

    /**
     * Контроллер переключения режимов (Глобальная карта / Лагерь)
     */
    initMapSelector() {
        const self = TacticalMapManager;
        const btnToggleMapMode = document.getElementById('btnToggleMapMode');
        if (!btnToggleMapMode) return;

        self.state.currentMapMode = 'global';

        btnToggleMapMode.addEventListener('click', () => {
            if (self.state.currentMapMode === 'global') {
                self.switchMapMode('camp');

                btnToggleMapMode.innerHTML = '⛺';
                btnToggleMapMode.title = 'Переключить на глобальную карту';
                btnToggleMapMode.style.background = 'linear-gradient(180deg, #42351f 0%, #292011 100%)';
                btnToggleMapMode.style.borderColor = '#543e0d';
                btnToggleMapMode.style.color = '#ebd291';
            } else {
                self.switchMapMode('global');

                btnToggleMapMode.innerHTML = '🗺️';
                btnToggleMapMode.title = 'Переключить на карту лагеря';
                btnToggleMapMode.style.background = 'linear-gradient(180deg, #4f5d65 0%, #2c3539 100%)';
                btnToggleMapMode.style.borderColor = '#d4af37';
                btnToggleMapMode.style.color = '#d1d8e0';
            }
        });
    },

    /**
     * Переключение ресурсов подложки, размеров вьюпорта и слоев видимости
     */
    switchMapMode(mode) {
        const self = TacticalMapManager;
        self.state.currentMapMode = mode;

        const mapImg = document.getElementById('mapImg');
        const hexLayer = document.getElementById('visualLayer');
        const gridLayer = document.getElementById('tacticalGridLayer');
        const mapContainer = document.getElementById('mapContainer');
        const btnToggleFog = document.getElementById('btnToggleFog');
        const clickableMap = document.getElementById('clickableMap');

        if (!mapImg || !mapContainer) return;

        if (typeof window.closeMenu === 'function') window.closeMenu();
        self.closeCampMenu();

        ViewportManager.x = 0;
        ViewportManager.y = 0;
        ViewportManager.currentZoom = 1.0;

        if (mode === 'global') {
            mapImg.src = 'img/map_global.png';
            mapContainer.style.width = '3840px';
            mapContainer.style.height = '1280px';
            mapImg.style.width = '3840px';
            mapImg.style.height = '1280px';

            if (hexLayer) hexLayer.style.display = 'block';
            if (gridLayer) gridLayer.style.display = 'none';
            if (clickableMap) clickableMap.style.display = 'block';
            if (btnToggleFog) btnToggleFog.style.display = 'none';

            if (window.HexCanvasRender) window.HexCanvasRender.requestFrame();

        } else if (mode === 'camp') {
            mapImg.src = self.campParams.src;
            mapContainer.style.width = self.campParams.width + 'px';
            mapContainer.style.height = self.campParams.height + 'px';
            mapImg.style.width = self.campParams.width + 'px';
            mapImg.style.height = self.campParams.height + 'px';

            if (hexLayer) hexLayer.style.display = 'none';
            if (gridLayer) {
                gridLayer.style.display = 'grid';
                self.buildTacticalGrid();
            }
            if (clickableMap) clickableMap.style.display = 'none';
            if (btnToggleFog) btnToggleFog.style.display = 'flex';
        }

        ViewportManager.updateMapTransform();
    },
    // ============================================================================
    // ЧАСТЬ 3 ИЗ 10: ГЕНЕРАЦИЯ И СБОРКА ТАКТИЧЕСКОЙ СЕТКИ (BUILD TACTICAL GRID)
    // ============================================================================

    /**
     * Рендеринг тактической сетки лагеря БЕЗ создания лишних слушателей событий на ячейках
     */
    buildTacticalGrid() {
        const self = TacticalMapManager;
        const gridLayer = document.getElementById('tacticalGridLayer');
        if (!gridLayer) return;

        gridLayer.innerHTML = '';

        const realGridWidth = self.campParams.cols * self.campParams.squareSize;
        const realGridHeight = self.campParams.rows * self.campParams.squareSize;

        gridLayer.style.width = realGridWidth + 'px';
        gridLayer.style.height = realGridHeight + 'px';
        gridLayer.style.left = self.campParams.offsetX + 'px';
        gridLayer.style.top = self.campParams.offsetY + 'px';

        gridLayer.style.gridTemplateColumns = `repeat(${self.campParams.cols}, ${self.campParams.squareSize}px)`;
        gridLayer.style.gridTemplateRows = `repeat(${self.campParams.rows}, ${self.campParams.squareSize}px)`;

        const fragment = document.createDocumentFragment();

        for (let r = 0; r < self.campParams.rows; r++) {
            for (let c = 0; c < self.campParams.cols; c++) {
                const squareId = `square_${r}_${c}`;
                const data = self.state.campMapData[squareId];

                const square = document.createElement('div');
                square.className = 'tactical-square';
                square.setAttribute('id', `visual_${squareId}`);
                square.dataset.squareId = squareId;

                square.style.width = self.campParams.squareSize + 'px';
                square.style.height = self.campParams.squareSize + 'px';

                square.innerHTML = `
                    <span class="square-star-label"></span>
                    <span class="square-crown-label" draggable="true">${data && data.heroHere ? '👑' : ''}</span>
                    <span class="square-monster-label" draggable="true"></span>
                    <span class="square-obstacle-label"></span>
                `;

                // Отрисовка тонких разделительных стен на гранях через CSS-границы ячеек
                if (data && data.borders && Array.isArray(data.borders)) {
                    data.borders.forEach(b => {
                        if (b === 'top-wall') square.style.borderTop = '3px solid #ff7675';
                        if (b === 'top-window') square.style.borderTop = '3px dashed #74b9ff';
                        if (b === 'bottom-wall') square.style.borderBottom = '3px solid #ff7675';
                        if (b === 'bottom-window') square.style.borderBottom = '3px dashed #74b9ff';
                        if (b === 'left-wall') square.style.borderLeft = '3px solid #ff7675';
                        if (b === 'left-window') square.style.borderLeft = '3px dashed #74b9ff';
                        if (b === 'right-wall') square.style.borderRight = '3px solid #ff7675';
                        if (b === 'right-window') square.style.borderRight = '3px dashed #74b9ff';
                    });
                }

                const isFoggy = !data || (!data.explored && !data.hasVisited);
                if (self.state.isCampFogEnabled && isFoggy) {
                    square.classList.add('fog-active');
                }

                if (data) {
                    if (data.color && data.color !== 'transparent') {
                        square.style.backgroundColor = ColorConverter.hexToRgba(data.color, 0.37);
                    }
                    if (data.heroHere) {
                        square.classList.add('squad-dark');
                    }
                }

                self.bindDragAndDropTargets(square, squareId);
                fragment.appendChild(square);
            }
        }

        gridLayer.appendChild(fragment);
        self.recalculateCampFogOfWar();
    },
    // ============================================================================
    // ЧАСТЬ 4 ИЗ 10: АРХИТЕКТУРНОЕ ДЕЛЕГИРОВАНИЕ СОБЫТИЙ СЕТКИ (GRID EVENT DELEGATION)
    // ============================================================================

    /**
     * Архитектурное делегирование событий: 4 слушателя на корень вместо 1000+ на ячейках
     */
    initGridEventDelegation() {
        const self = TacticalMapManager;
        const gridLayer = document.getElementById('tacticalGridLayer');
        if (!gridLayer) return;

        // 1. Единый обработчик одиночных кликов на сетке
        gridLayer.addEventListener('click', (e) => {
            const cell = e.target.closest('.tactical-square');
            if (!cell || ViewportManager.getHasMoved()) return;

            e.preventDefault();
            self.handleTacticalSquareClick(cell.dataset.squareId);
        });

        // 2. Единый обработчик двойных кликов для открытия меню ячейки
        gridLayer.addEventListener('dblclick', (e) => {
            const cell = e.target.closest('.tactical-square');
            if (!cell || ViewportManager.getHasMoved()) return;

            e.preventDefault();
            const squareId = cell.dataset.squareId;

            if (self.state.focusedEntityId === squareId) {
                cell.classList.remove('focused-entity');
                self.state.focusedEntityId = null;
                self.clearVisualPath();
            }
            self.openTacticalMenu(squareId);
        });

        // 3. Динамическое наведение мыши: подгрузка путей и тултипов при входе курсора в ячейку
        gridLayer.addEventListener('mouseenter', (e) => {
            const cell = e.target.closest('.tactical-square');
            if (!cell) return;
            self.showTacticalTooltip(cell.dataset.squareId);
        }, { capture: true });

        // 4. Плавное следование тултипа за курсором мыши
        gridLayer.addEventListener('mousemove', (e) => {
            const tooltip = document.getElementById('hexTooltip');
            if (!tooltip || tooltip.style.display === 'none') return;

            tooltip.style.left = (e.clientX + 15) + 'px';
            tooltip.style.top = (e.clientY + 15) + 'px';
        }, { capture: true });

        // 5. Очистка тултипов и путей при выходе мыши из ячейки
        gridLayer.addEventListener('mouseleave', (e) => {
            const cell = e.target.closest('.tactical-square');
            if (!cell) return;

            const tooltip = document.getElementById('hexTooltip');
            if (tooltip) {
                tooltip.style.display = 'none';
                tooltip.innerHTML = '';
            }
            if (self.state.focusedEntityId) self.clearVisualPath();
        }, { capture: true });
    },
    // ============================================================================
    // ЧАСТЬ 5 ИЗ 10: СЛУШАТЕЛИ ФОРМЫ, ЦВЕТОВЫЕ ПРЕСЕТЫ И ТУМАН ВОЙНЫ
    // ============================================================================

    /**
     * Однократная привязка обработчиков для элементов управления формы модального окна лагеря
     */
    initFormEventListeners() {
        const self = TacticalMapManager;
        const btnCampSave = document.getElementById('btnCampSave');
        const btnCampCancel = document.getElementById('btnCampCancel');
        const btnCampDelete = document.getElementById('btnCampDelete');
        const inpMeasurement = document.getElementById('inpCampMeasurement');
        const directionBox = document.getElementById('campDirectionBox');
        const inpHero = document.getElementById('inpCampHeroHere');
        const inpMonster = document.getElementById('inpCampMonsterHere');
        const inpObstacle = document.getElementById('inpCampObstacle');

        if (btnCampSave) btnCampSave.addEventListener('click', () => self.saveTacticalSquare());
        if (btnCampCancel) btnCampCancel.addEventListener('click', () => self.closeCampMenu());
        if (btnCampDelete) btnCampDelete.addEventListener('click', () => self.deleteTacticalSquare());

        // Показ селектора направления только при выборе конуса (Cone AoE)
        if (inpMeasurement && directionBox) {
            inpMeasurement.addEventListener('change', () => {
                directionBox.style.display = inpMeasurement.value === 'cone' ? 'block' : 'none';
            });
        }

        // Взаимоисключающие чекбоксы: клетку может занимать либо Герой, либо Монстр
        if (inpHero && inpMonster) {
            inpHero.addEventListener('change', () => { if (inpHero.checked) inpMonster.checked = false; });
            inpMonster.addEventListener('change', () => { if (inpMonster.checked) inpHero.checked = false; });
        }

        // Если на клетку устанавливается стационарное препятствие, персонажи с неё сбрасываются
        if (inpObstacle && inpHero && inpMonster) {
            inpObstacle.addEventListener('change', () => {
                if (inpObstacle.value !== '') {
                    inpHero.checked = false;
                    inpMonster.checked = false;
                }
            });
        }

        // Взаимоисключающие чекбоксы граней: грань может быть ЛИБО стеной, ЛИБО окном
        const sides = ['top', 'bottom', 'left', 'right'];
        sides.forEach(s => {
            const wallEl = document.getElementById(`inpCampBorder_${s}_wall`);
            const winEl = document.getElementById(`inpCampBorder_${s}_window`);

            if (wallEl && winEl) {
                wallEl.addEventListener('change', () => { if (wallEl.checked) winEl.checked = false; });
                winEl.addEventListener('change', () => { if (winEl.checked) wallEl.checked = false; });
            }
        });

        self.initCampColorPresets();
    },

    /**
     * Динамическая генерация палитры кнопок быстрых пресетов цвета в форме лагеря
     */
    initCampColorPresets() {
        const container = document.getElementById('campColorPresetsContainer');
        if (!container || container.children.length > 0) return;

        const presets = [
            { color: 'transparent', label: '✖' },
            { color: '#2ecc71', label: '' },
            { color: '#3498db', label: '' },
            { color: '#e74c3c', label: '' },
            { color: '#f1c40f', label: '' },
            { color: '#9b59b6', label: '' },
            { color: '#e67e22', label: '' }
        ];

        presets.forEach(p => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'color-preset-btn';
            if (p.color === 'transparent') {
                b.classList.add('transparent-preset');
                b.textContent = p.label;
            } else {
                b.style.backgroundColor = p.color;
            }
            b.addEventListener('click', () => {
                document.getElementById('inpCampColor').value = p.color;
                container.querySelectorAll('.color-preset-btn').forEach(x => x.classList.remove('active'));
                b.classList.add('active');
            });
            container.appendChild(b);
        });
    },

    /**
     * Инициализация кнопки глобального переключения Тумана Войны для тактической карты
     */
    initFogToggleButton() {
        const self = TacticalMapManager;
        const btnToggleFog = document.getElementById('btnToggleFog');
        if (!btnToggleFog) return;

        btnToggleFog.addEventListener('click', () => {
            self.state.isCampFogEnabled = !self.state.isCampFogEnabled;
            btnToggleFog.classList.toggle('fog-disabled', !self.state.isCampFogEnabled);
            btnToggleFog.classList.toggle('active', self.state.isCampFogEnabled);
            btnToggleFog.textContent = self.state.isCampFogEnabled ? '👁️' : '👓';

            if (self.state.currentMapMode === 'camp') {
                self.recalculateCampFogOfWar();
            }
        });
    },
    // ============================================================================
    // ЧАСТЬ 6 ИЗ 10: КРУД-МЕТОДЫ МОДАЛЬНОГО ОКНА (OPEN, CLOSE, SAVE, DELETE)
    // ============================================================================

    /**
     * Заполнение полей формы актуальными данными ячейки и вывод окна на экран
     */
    openTacticalMenu(squareId) {
        const self = TacticalMapManager;
        const modal = document.getElementById('campMenu');
        if (!modal) return;

        self.state.currentHexId = squareId;
        const data = self.state.campMapData[squareId];

        // Заполнение чекбоксов персонажей
        document.getElementById('inpCampHeroHere').checked = !!(data && data.heroHere);
        document.getElementById('inpCampMonsterHere').checked = !!(data && data.monsterHere);

        // Синхронизация селекторов под новые значения со страницы
        document.getElementById('inpCampMeasurement').value = data ? data.measurement || '' : '';
        document.getElementById('inpCampFloor').value = data ? data.floor || '' : '';
        document.getElementById('inpCampObstacle').value = data ? data.obstacle || '' : '';
        document.getElementById('inpCampSpeed').value = data ? data.speed || '30' : '30';
        document.getElementById('inpCampDistance').value = data ? data.distance || '30' : '30';

        // Сброс и заполнение чекбоксов тонких стен на форме
        const directions = ['top', 'bottom', 'left', 'right'];
        const types = ['wall', 'window'];

        directions.forEach(d => {
            types.forEach(t => {
                const el = document.getElementById(`inpCampBorder_${d}_${t}`);
                if (el) el.checked = false;
            });
        });

        if (data && data.borders && Array.isArray(data.borders)) {
            data.borders.forEach(b => {
                const p = b.split('-');
                if (p.length === 2) {
                    const el = document.getElementById(`inpCampBorder_${p[0]}_${p[1]}`);
                    if (el) el.checked = true;
                }
            });
        }

        const currentColor = data ? data.color || '#ff0000' : '#ff0000';
        document.getElementById('inpCampColor').value = currentColor;

        const container = document.getElementById('campColorPresetsContainer');
        if (container) {
            container.querySelectorAll('.color-preset-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.style.backgroundColor === ColorConverter.hexToRgbStandard(currentColor)) {
                    btn.classList.add('active');
                }
            });
        }

        const directionBox = document.getElementById('campDirectionBox');
        const inpDirection = document.getElementById('inpCampDirection');
        if (directionBox && inpDirection) {
            const isCone = data && data.measurement === 'cone';
            directionBox.style.display = isCone ? 'block' : 'none';
            inpDirection.value = data ? data.direction || 'N' : 'N';
        }

        modal.classList.add('open');
    },

    /**
     * Скрытие модального окна и снятие фокуса со строк ввода
     */
    closeCampMenu() {
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
            document.activeElement.blur();
        }
        const modal = document.getElementById('campMenu');
        if (modal) modal.classList.remove('open');
    },

    /**
     * Сбор параметров из полей формы, запись в стейт и обновление графического состояния ячейки
     */
    saveTacticalSquare() {
        const self = TacticalMapManager;
        const id = self.state.currentHexId;
        if (!id) return;

        const heroHereVal = document.getElementById('inpCampHeroHere').checked;
        const monsterHereVal = document.getElementById('inpCampMonsterHere').checked;
        const floorVal = document.getElementById('inpCampFloor').value;
        const obstacleVal = document.getElementById('inpCampObstacle').value;
        const measurementVal = document.getElementById('inpCampMeasurement').value;
        const distanceVal = document.getElementById('inpCampDistance').value;
        const directionVal = document.getElementById('inpCampDirection').value;
        const colorVal = document.getElementById('inpCampColor').value || 'transparent';
        const speedVal = document.getElementById('inpCampSpeed').value;

        const savedBorders = [];
        const directions = ['top', 'bottom', 'left', 'right'];

        directions.forEach(d => {
            const wallEl = document.getElementById(`inpCampBorder_${d}_wall`);
            const windowEl = document.getElementById(`inpCampBorder_${d}_window`);

            if (wallEl && wallEl.checked) {
                savedBorders.push(`${d}-wall`);
            } else if (windowEl && windowEl.checked) {
                savedBorders.push(`${d}-window`);
            }
        });

        const squareElement = document.getElementById('visual_' + id);
        if (squareElement) {
            squareElement.classList.remove('fog-active');
            const star = squareElement.querySelector('.square-star-label');
            if (star) star.textContent = '';

            squareElement.classList.toggle('squad-dark', heroHereVal);
            squareElement.classList.remove('monster-dark');
        }

        self.state.campMapData[id] = {
            heroHere: heroHereVal,
            monsterHere: monsterHereVal,
            floor: floorVal,
            obstacle: obstacleVal,
            measurement: measurementVal,
            distance: distanceVal,
            direction: directionVal,
            color: colorVal,
            speed: speedVal,
            borders: savedBorders,
            explored: true,
            hasVisited: heroHereVal || (self.state.campMapData[id] && self.state.campMapData[id].hasVisited),
            lastSaved: new Date().toLocaleString()
        };

        localStorage.setItem('campMapSystemData', JSON.stringify(self.state.campMapData));
        self.recalculateCampFogOfWar();
        self.closeCampMenu();
    },

    /**
     * Полное удаление пользовательских данных из ячейки и сброс её CSS-стилей
     */
    deleteTacticalSquare() {
        const self = TacticalMapManager;
        const id = self.state.currentHexId;
        if (!id) return;

        delete self.state.campMapData[id];
        localStorage.setItem('campMapSystemData', JSON.stringify(self.state.campMapData));

        const squareElement = document.getElementById('visual_' + id);
        if (squareElement) {
            squareElement.className = 'tactical-square';
            squareElement.style.backgroundColor = '';

            const star = squareElement.querySelector('.square-star-label');
            const crown = squareElement.querySelector('.square-crown-label');
            const monster = squareElement.querySelector('.square-monster-label');
            const obs = squareElement.querySelector('.square-obstacle-label');

            if (star) star.textContent = '';
            if (crown) crown.textContent = '';
            if (monster) monster.textContent = '';
            if (obs) obs.textContent = '';
        }

        self.recalculateCampFogOfWar();
        self.closeCampMenu();
    },
    // ============================================================================
    // ЧАСТЬ 7 ИЗ 10: ГРАФИЧЕСКИЙ ЦИКЛ ОБНОВЛЕНИЯ (RECALCULATE CAMP FOG OF WAR)
    // ============================================================================


    /**
     * Полноценный цикл обновления видимости, типов препятствий, аое-аур и ТОНКИХ СТЕН
     */
    recalculateCampFogOfWar() {
        const self = TacticalMapManager;
        const cellAuras = {};

        // Шаг 1: Очистка и распределение ландшафтных элементов и тонких стен по сетке
        for (let r = 0; r < self.campParams.rows; r++) {
            for (let c = 0; c < self.campParams.cols; c++) {
                const squareId = `square_${r}_${c}`;
                const squareElement = document.getElementById('visual_' + squareId);
                if (!squareElement) continue;

                const crown = squareElement.querySelector('.square-crown-label');
                const monster = squareElement.querySelector('.square-monster-label');
                const obstacle = squareElement.querySelector('.square-obstacle-label');

                if (crown) crown.textContent = '';
                if (monster) monster.textContent = '';
                if (obstacle) obstacle.textContent = '';

                // Сбрасываем классы декораций до базового состояния
                squareElement.className = 'tactical-square';

                // СБРОС СТАРЫХ ГРАНИЦ: Очищаем стили перед новой отрисовкой разделителей
                squareElement.style.borderTop = '';
                squareElement.style.borderBottom = '';
                squareElement.style.borderLeft = '';
                squareElement.style.borderRight = '';

                const savedData = self.state.campMapData[squareId];

                // Накладываем базовый плотный слой ПОЛА, если он сохранен
                if (savedData && savedData.floor) {
                    squareElement.classList.add(savedData.floor);
                }

                // ОТРИСОВКА ТОНКИХ СТЕН: Накладываем CSS-границы из сохраненного массива borders
                if (savedData && savedData.borders && Array.isArray(savedData.borders)) {
                    savedData.borders.forEach(b => {
                        if (b === 'top-wall') squareElement.style.borderTop = '3px solid #ff7675';
                        if (b === 'top-window') squareElement.style.borderTop = '3px dashed #74b9ff';
                        if (b === 'bottom-wall') squareElement.style.borderBottom = '3px solid #ff7675';
                        if (b === 'bottom-window') squareElement.style.borderBottom = '3px dashed #74b9ff';
                        if (b === 'left-wall') squareElement.style.borderLeft = '3px solid #ff7675';
                        if (b === 'left-window') squareElement.style.borderLeft = '3px dashed #74b9ff';
                        if (b === 'right-wall') squareElement.style.borderRight = '3px solid #ff7675';
                        if (b === 'right-window') squareElement.style.borderRight = '3px dashed #74b9ff';
                    });
                }

                // Обработка видимости с учетом глобального флага тумана лагеря

                if (!self.state.isCampFogEnabled) {
                    squareElement.classList.remove('fog-active');
                    if (savedData && savedData.color && savedData.color !== 'transparent') {
                        squareElement.style.backgroundColor = ColorConverter.hexToRgba(savedData.color, 0.37);
                    }
                } else {
                    if (savedData && savedData.explored && !savedData.monsterHere) {
                        squareElement.classList.remove('fog-active');
                        if (savedData.color && savedData.color !== 'transparent') {
                            squareElement.style.backgroundColor = ColorConverter.hexToRgba(savedData.color, 0.37);
                        }
                    } else {
                        squareElement.classList.add('fog-active');
                    }
                }

                if (savedData && savedData.obstacle) {
                    const obsType = savedData.obstacle;
                    if (obsType === 'wall') { squareElement.classList.add('obstacle-wall'); if (obstacle) obstacle.textContent = '🧱'; }
                    else if (obsType === 'destructible') { squareElement.classList.add('obstacle-destructible'); if (obstacle) obstacle.textContent = '📦'; }
                    else if (obsType === 'bushes') { squareElement.classList.add('obstacle-bushes'); if (obstacle) obstacle.textContent = '🌿'; }
                    else if (obsType === 'forest') { squareElement.classList.add('obstacle-forest'); if (obstacle) obstacle.textContent = '🌲'; }
                    else if (obsType === 'water') { squareElement.classList.add('obstacle-water'); if (obstacle) obstacle.textContent = '🌊'; }
                    else if (obsType === 'stones') { squareElement.classList.add('obstacle-stones'); if (obstacle) obstacle.textContent = '🪨'; }
                    else if (obsType === 'ice') { squareElement.classList.add('obstacle-ice'); if (obstacle) obstacle.textContent = '❄️'; }
                    else if (obsType === 'web') { squareElement.classList.add('obstacle-web'); if (obstacle) obstacle.textContent = '🕸️'; }
                }

            }
        }

        // Шаг 2: Расчет источников аур Героев (с автоматическим раскрытием тумана вокруг них)
        for (let id in self.state.campMapData) {
            const data = self.state.campMapData[id];
            if (data && data.heroHere) {
                const squareElement = document.getElementById('visual_' + id);
                if (squareElement) {
                    const crown = squareElement.querySelector('.square-crown-label');
                    if (crown) crown.textContent = '👑';
                }
                self.processEntityAura(id, data, cellAuras, true);
            }
        }

        // Шаг 3: Расчет источников аур Монстров (только если они вышли из тумана войны)
        for (let id in self.state.campMapData) {
            const data = self.state.campMapData[id];
            if (data && data.monsterHere) {
                const squareElement = document.getElementById('visual_' + id);
                if (!squareElement) continue;

                if (!squareElement.classList.contains('fog-active')) {
                    const monster = squareElement.querySelector('.square-monster-label');
                    if (monster) monster.textContent = '👿';
                    self.processEntityAura(id, data, cellAuras, false);
                }
            }
        }


        // Шаг 4: Послойная отрисовка пересечений цветовых аур через множественные градиенты
        for (let targetId in cellAuras) {
            const targetElement = document.getElementById('visual_' + targetId);
            if (!targetElement) continue;

            const targetSavedData = self.state.campMapData[targetId];
            if (targetSavedData && targetSavedData.color && targetSavedData.color !== 'transparent') continue;

            const auras = cellAuras[targetId];
            if (auras.length === 1) {
                const col = auras[0];
                targetElement.style.backgroundImage = '';
                // Заменили жесткий красный дефолт на мягкую подсветку в тон интерфейса
                const finalCol = (col === '#ff0000' || col === 'transparent') ? 'rgba(223, 188, 111, 0.15)' : col;
                targetElement.style.backgroundColor = finalCol.startsWith('rgba') ? finalCol : ColorConverter.hexToRgba(finalCol, 0.45);
                targetElement.style.boxShadow = `inset 0 0 6px ${finalCol.startsWith('rgba') ? 'rgba(255,255,255,0.2)' : ColorConverter.hexToRgba(finalCol, 0.3)}`;
            } else if (auras.length > 1) {
                targetElement.style.backgroundColor = 'transparent';
                const gradientLayers = auras.map(col => {
                    const finalCol = col === '#ff0000' ? 'rgba(223, 188, 111, 0.15)' : col;
                    const rgbaColor = finalCol.startsWith('rgba') ? finalCol : ColorConverter.hexToRgba(finalCol, 0.40);
                    return `linear-gradient(${rgbaColor}, ${rgbaColor})`;
                }).join(', ');
                targetElement.style.backgroundImage = gradientLayers;
                targetElement.style.boxShadow = 'inset 0 0 8px rgba(255, 255, 255, 0.35)';
            }
        }

    },

    // ============================================================================
    // ЧАСТЬ 8 ИЗ 10: ГЕОМЕТРИЯ АУР И СВЕРХТОЧНАЯ ТРАССИРОВКА ЛУЧЕЙ (LOS & CONE)
    // ============================================================================

    /**
     * Поклеточный просчет радиуса действия источника и заполнение карты аур
     */
    processEntityAura(id, data, cellAuras, shouldRevealFog) {
        const self = TacticalMapManager;
        if (!data.measurement || !data.distance) return;

        const parts = id.split('_');
        const centerR = parseInt(parts[1], 10);
        const centerC = parseInt(parts[2], 10);

        const ftDistance = parseInt(data.distance, 10) || 5;
        let cellRadius = data.measurement === 'radius' ? Math.round(ftDistance / 5) : Math.round((ftDistance / 2) / 5);
        if (data.measurement === 'cone') cellRadius = Math.round(ftDistance / 5);

        if (cellRadius <= 0) return;

        for (let r = centerR - cellRadius; r <= centerR + cellRadius; r++) {
            for (let c = centerC - cellRadius; c <= centerC + cellRadius; c++) {
                if (r >= 0 && r < self.campParams.rows && c >= 0 && c < self.campParams.cols) {

                    let inZone = data.measurement === 'cone' ?
                        self.isCellInCone(centerR, centerC, r, c, cellRadius, data.direction || 'N') :
                        Math.sqrt((r - centerR) ** 2 + (c - centerC) ** 2) <= cellRadius + 0.5;

                    if (inZone) {
                        if (!self.checkLineOfSight(centerR, centerC, r, c)) continue;

                        const targetId = `square_${r}_${c}`;
                        const targetElement = document.getElementById('visual_' + targetId);

                        if (targetElement) {
                            if (shouldRevealFog) targetElement.classList.remove('fog-active');
                            if (!cellAuras[targetId]) cellAuras[targetId] = [];
                            cellAuras[targetId].push((data.color && data.color !== 'transparent') ? data.color : 'rgba(255, 255, 255, 0.08)');
                        }
                    }
                }
            }
        }
    },

    /**
     * Расчет секторов направленного конуса (AoE Cone) в зависимости от стороны света
     */
    isCellInCone(centerR, centerC, r, c, radius, direction) {
        const distR = r - centerR;
        const distC = c - centerC;

        if (Math.sqrt(distR ** 2 + distC ** 2) > radius + 0.5) return false;
        if (distR === 0 && distC === 0) return true;

        switch (direction) {
            case 'N':  return distR < 0 && Math.abs(distC) <= Math.abs(distR);
            case 'S':  return distR > 0 && Math.abs(distC) <= Math.abs(distR);
            case 'E':  return distC > 0 && Math.abs(distR) <= Math.abs(distC);
            case 'W':  return distC < 0 && Math.abs(distR) <= Math.abs(distC);
            case 'NE': return distR <= 0 && distC >= 0;
            case 'SE': return distR >= 0 && distC >= 0;
            case 'SW': return distR >= 0 && distC <= 0;
            case 'NW': return distR <= 0 && distC <= 0;
            default: return false;
        }
    },

    /**
     * Алгоритм Брезенхэма для вычисления линии видимости (LOS) сквозь стены и чащу леса
     * Сверхточная проверка тонких межклеточных разделителей (стены поглощают, окна пропускают ауры)
     */
    checkLineOfSight(r1, c1, r2, c2) {
        const self = TacticalMapManager;
        if (r1 === r2 && c1 === c2) return true;
        let dr = Math.abs(r2 - r1), dc = Math.abs(c2 - c1);
        let sr = (r1 < r2) ? 1 : -1, sc = (c1 < c2) ? 1 : -1;
        let err = dc - dr;
        let currR = r1, currC = c1;

        while (true) {
            let prevR = currR;
            let prevC = currC;

            if (currR === r2 && currC === c2) return true;

            let e2 = 2 * err;
            if (e2 > -dr) { err -= dr; currC += sc; }
            if (e2 < dc) { err += dc; currR += sr; }

            const cKey = `square_${prevR}_${prevC}`;
            const nKey = `square_${currR}_${currC}`;
            const cData = self.state.campMapData[cKey];
            const nData = self.state.campMapData[nKey];

            const cBorders = (cData && cData.borders) ? cData.borders : [];
            const nBorders = (nData && nData.borders) ? nData.borders : [];

            if (currR === prevR - 1 && currC === prevC) {
                if (cBorders.includes('top-wall') || nBorders.includes('bottom-wall')) return false;
            }
            if (currR === prevR + 1 && currC === prevC) {
                if (cBorders.includes('bottom-wall') || nBorders.includes('top-wall')) return false;
            }
            if (currR === prevR && currC === prevC - 1) {
                if (cBorders.includes('left-wall') || nBorders.includes('right-wall')) return false;
            }
            if (currR === prevR && currC === prevC + 1) {
                if (cBorders.includes('right-wall') || nBorders.includes('left-wall')) return false;
            }

            if (currR === prevR - 1 && currC === prevC - 1) {
                if (cBorders.includes('top-wall') || cBorders.includes('left-wall')) return false;
                if (nBorders.includes('bottom-wall') || nBorders.includes('right-wall')) return false;
            }
            if (currR === prevR - 1 && currC === prevC + 1) {
                if (cBorders.includes('top-wall') || cBorders.includes('right-wall')) return false;
                if (nBorders.includes('bottom-wall') || nBorders.includes('left-wall')) return false;
            }
            if (currR === prevR + 1 && currC === prevC - 1) {
                if (cBorders.includes('bottom-wall') || cBorders.includes('left-wall')) return false;
                if (nBorders.includes('top-wall') || nBorders.includes('right-wall')) return false;
            }
            if (currR === prevR + 1 && currC === prevC + 1) {
                if (cBorders.includes('bottom-wall') || cBorders.includes('right-wall')) return false;
                if (nBorders.includes('top-wall') || nBorders.includes('left-wall')) return false;
            }

            if (nData && (nData.obstacle === 'wall' || nData.obstacle === 'forest')) {
                if (currR !== r2 || currC !== c2) return false;
            }
        }
    },
    // ============================================================================
    // ЧАСТЬ 9 ИЗ 10: АЛГОРИТМ ДЕЙКСТРЫ (CALCULATE PATH AND COST)
    // ============================================================================

    /**
     * Поиск кратчайшего пути (Алгоритм Дейкстры) с учетом 3-х действий на ход.
     * Стоимость прыжка — 1 действие. Скорость <= 30: прыжок 10 фт. Скорость > 30: прыжок 15 фт.
     */
    calculatePathAndCost(startId, targetId, speedLimit) {
        const self = TacticalMapManager;
        const parseCoords = (id) => {
            if (!id) return { r: 0, c: 0 };
            const p = id.split('_');
            if (p.length === 3) return { r: parseInt(p[1], 10), c: parseInt(p[2], 10) };
            return { r: parseInt(p[0], 10), c: parseInt(p[1], 10) };
        };

        const start = parseCoords(startId);
        const target = parseCoords(targetId);
        const queue = [], distances = {}, parents = {}, jumpFlags = {};

        const startKey = `square_${start.r}_${start.c}`;
        const targetKey = `square_${target.r}_${target.c}`;

        distances[startKey] = { feet: 0, actions: 0, currentActionSpentFeet: 0, cameByJump: false, jumpsCount: 0 };
        queue.push({ id: startKey, r: start.r, c: start.c, actions: 0, feet: 0, cameByJump: false, jumpsCount: 0 });

        while (queue.length > 0) {
            queue.sort((a, b) => {
                if (a.actions !== b.actions) return a.actions - b.actions;
                if (a.jumpsCount !== b.jumpsCount) return a.jumpsCount - b.jumpsCount;
                return a.feet - b.feet;
            });

            const curr = queue.shift();
            const currKey = curr.id;
            const currState = distances[currKey];

            if (curr.r === target.r && curr.c === target.c) break;
            if (curr.actions > currState.actions) continue;
            if (curr.r === target.r && curr.c === target.c) break;
            if (curr.actions > currState.actions) continue;

            // ПРОВЕРКА ГРАНИЦ: Стены блокируют (Infinity), окна добавляют 10 футов стоимости
            const checkBorderCrossing = (r1, c1, r2, c2) => {
                const cData = self.state.campMapData[`square_${r1}_${c1}`];
                const nData = self.state.campMapData[`square_${r2}_${c2}`];
                const cBorders = (cData && cData.borders) ? cData.borders : [];
                const nBorders = (nData && nData.borders) ? nData.borders : [];

                let cost = 0;

                // Функция-хелпер для анализа конкретного направления
                const evaluateEdge = (cType, nType) => {
                    if (cBorders.includes(cType) || nBorders.includes(nType)) {
                        if (cType.endsWith('wall')) return Infinity; // Стена — непроходима
                        if (cType.endsWith('window')) return 10;     // Окно — штраф 10 футов
                    }
                    return 0;
                };

                // Ортогональные перемещения (вверх, вниз, влево, вправо)
                if (r2 === r1 - 1 && c2 === c1) cost = evaluateEdge('top-wall', 'bottom-wall') || evaluateEdge('top-window', 'bottom-window');
                else if (r2 === r1 + 1 && c2 === c1) cost = evaluateEdge('bottom-wall', 'top-wall') || evaluateEdge('bottom-window', 'top-window');
                else if (r2 === r1 && c2 === c1 - 1) cost = evaluateEdge('left-wall', 'right-wall') || evaluateEdge('left-window', 'right-window');
                else if (r2 === r1 && c2 === c1 + 1) cost = evaluateEdge('right-wall', 'left-wall') || evaluateEdge('right-window', 'left-window');

                // Диагональные перемещения (проверяем обе грани угла)
                else {
                    const dr = r2 - r1;
                    const dc = c2 - c1;

                    // Первая грань (по вертикали)
                    const vCost = dr === -1 ?
                        (evaluateEdge('top-wall', 'bottom-wall') || evaluateEdge('top-window', 'bottom-window')) :
                        (evaluateEdge('bottom-wall', 'top-wall') || evaluateEdge('bottom-window', 'top-window'));

                    // Вторая грань (по горизонтали)
                    const hCost = dc === -1 ?
                        (evaluateEdge('left-wall', 'right-wall') || evaluateEdge('left-window', 'right-window')) :
                        (evaluateEdge('right-wall', 'left-wall') || evaluateEdge('right-window', 'left-window'));

                    if (vCost === Infinity || hCost === Infinity) return Infinity;
                    cost = vCost + hCost; // Суммируем штрафы, если прыгаем по углам окон
                }

                return cost;
            };

            // 1. НАПРАВЛЕНИЯ ДЛЯ ХОДЬБЫ (8 НАПРАВЛЕНИЙ)
            const directions = [
                { dr: -1, dc: 0, isDiag: false }, { dr: 1, dc: 0, isDiag: false },
                { dr: 0, dc: -1, isDiag: false }, { dr: 0, dc: 1, isDiag: false },
                { dr: -1, dc: -1, isDiag: true }, { dr: -1, dc: 1, isDiag: true },
                { dr: 1, dc: -1, isDiag: true }, { dr: 1, dc: 1, isDiag: true }
            ];

            for (let d of directions) {
                const nr = curr.r + d.dr;
                const nc = curr.c + d.dc;
                if (nr < 0 || nr >= self.campParams.rows || nc < 0 || nc >= self.campParams.cols) continue;

                const borderCost = self.checkBorderCrossing(curr.r, curr.c, nr, nc);
                if (borderCost === Infinity) continue; // Наткнулись на стену — пропускаем ячейку

                const nKey = `square_${nr}_${nc}`;
                const nData = self.state.campMapData[nKey];

                if (nData && ['wall', 'destructible', 'stones', 'forest'].includes(nData.obstacle)) {
                    if (nKey !== targetKey) continue;
                    if (['wall', 'forest'].includes(nData.obstacle)) continue;
                }

                if (d.isDiag) {
                    const sideData1 = self.state.campMapData[`square_${curr.r + d.dr}_${curr.c}`];
                    const sideData2 = self.state.campMapData[`square_${curr.r}_${curr.c + d.dc}`];
                    if ((sideData1 && ['wall', 'forest'].includes(sideData1.obstacle)) || (sideData2 && ['wall', 'forest'].includes(sideData2.obstacle))) continue;
                }

                let stepCost = d.isDiag ? 10 : 5;
                if (nData && nData.obstacle === 'bushes') stepCost *= 2;


                // КОРРЕКЦИЯ СТОИМОСТИ:
                // Если borderCost вернул 10 (окно), шаг по прямой становится равен ровно 10 фт
                if (borderCost === 10) {
                    stepCost = d.isDiag ? 15 : 10; // 10 фт по прямой, 15 фт по диагонали
                }

                let nextActions = currState.actions;
                let nextSpentFeet = currState.currentActionSpentFeet + stepCost;

                if (currState.currentActionSpentFeet === 0 || nextSpentFeet > speedLimit) {
                    nextActions += 1;
                    nextSpentFeet = stepCost;
                    if (stepCost > speedLimit || nextActions > 3) continue;
                }

                let nextTotalFeet = currState.feet + stepCost;
                const nextState = { feet: nextTotalFeet, actions: nextActions, currentActionSpentFeet: nextSpentFeet, cameByJump: false, jumpsCount: curr.jumpsCount };

                if (distances[nKey] === undefined || nextState.actions < distances[nKey].actions || (nextState.actions === distances[nKey].actions && nextState.feet < distances[nKey].feet)) {
                    distances[nKey] = nextState;
                    parents[nKey] = { parentKey: currKey, isJump: false };
                    queue.push({ id: nKey, r: nr, c: nc, actions: nextActions, feet: nextTotalFeet, cameByJump: false, jumpsCount: curr.jumpsCount });
                }
            }

            // 2. НАПРАВЛЕНИЯ ДЛЯ ПРЫЖКОВ
            const jumpCellsCount = (speedLimit > 30) ? 3 : 2;
            const jumpTargets = [
                { r: curr.r - jumpCellsCount, c: curr.c, dr: -1, dc: 0 }, { r: curr.r + jumpCellsCount, c: curr.c, dr: 1, dc: 0 },
                { r: curr.r, c: curr.c - jumpCellsCount, dr: 0, dc: -1 }, { r: curr.r, c: curr.c + jumpCellsCount, dr: 0, dc: 1 }
            ];

            for (let jt of jumpTargets) {
                if (jt.r < 0 || jt.r >= self.campParams.rows || jt.c < 0 || jt.c >= self.campParams.cols) continue;

                const nKey = `square_${jt.r}_${jt.c}`;
                const targetData = self.state.campMapData[nKey];
                if (targetData && ['wall', 'forest'].includes(targetData.obstacle)) continue;

                let obstacleInPath = false, blockerInPath = false, checkR = curr.r, checkC = curr.c;

                for (let i = 1; i < jumpCellsCount; i++) {
                    if (jt.dr === -1 && self.state.campMapData[`square_${checkR}_${checkC}`]?.borders?.includes('top-wall')) blockerInPath = true;
                    if (jt.dr === 1 && self.state.campMapData[`square_${checkR}_${checkC}`]?.borders?.includes('bottom-wall')) blockerInPath = true;
                    if (jt.dc === -1 && self.state.campMapData[`square_${checkR}_${checkC}`]?.borders?.includes('left-wall')) blockerInPath = true;
                    if (jt.dc === 1 && self.state.campMapData[`square_${checkR}_${checkC}`]?.borders?.includes('right-wall')) blockerInPath = true;

                    checkR = curr.r + (jt.dr * i); checkC = curr.c + (jt.dc * i);
                    const checkData = self.state.campMapData[`square_${checkR}_${checkC}`];
                    if (checkData && checkData.obstacle) {
                        if (['wall', 'forest'].includes(checkData.obstacle)) { blockerInPath = true; break; }
                        if (['destructible', 'stones'].includes(checkData.obstacle)) obstacleInPath = true;
                    }
                }

                if (blockerInPath || !obstacleInPath) continue;

                const jumpActions = currState.actions + 1;
                if (jumpActions > 3) continue;

                const nextTotalFeet = currState.feet + (jumpCellsCount * 5);
                const nextState = { feet: nextTotalFeet, actions: jumpActions, currentActionSpentFeet: 0, cameByJump: true, jumpsCount: curr.jumpsCount + 1 };

                if (distances[nKey] === undefined || jumpActions < distances[nKey].actions || (jumpActions === distances[nKey].actions && nextState.feet < distances[nKey].feet)) {
                    distances[nKey] = nextState;
                    parents[nKey] = { parentKey: currKey, isJump: true };
                    queue.push({ id: nKey, r: jt.r, c: jt.c, actions: jumpActions, feet: nextTotalFeet, cameByJump: true, jumpsCount: curr.jumpsCount + 1 });
                }
            }
        }

        if (distances[targetKey] === undefined) return null;

        const pathCells = [];
        let currentKey = targetKey, currNode = parents[currentKey];
        pathCells.push(targetKey);

        while (currNode) {
            if (currNode.isJump) { jumpFlags[currentKey] = 'land'; jumpFlags[currNode.parentKey] = 'start'; }
            currentKey = currNode.parentKey; pathCells.push(currentKey); currNode = parents[currentKey];
        }
        return { cells: pathCells.reverse(), jumpFlags, totalFeet: distances[targetKey].feet, actions: distances[targetKey].actions };
    },
    // ============================================================================
    // ЧАСТЬ 10 ИЗ 10: ВИЗУАЛИЗАЦИЯ ПУТИ, ТАКТИЧЕСКИЙ ТУЛТИП, КЛИКИ И ЭКСПОРТ (SELF)
    // ============================================================================

    /**
     * Очистка визуальных эффектов пути с карты лагеря
     */
    clearVisualPath() {
        document.querySelectorAll('.tactical-square').forEach(cell => {
            cell.classList.remove('path-cell', 'path-cell-jump', 'path-cell-jump-start', 'path-cell-jump-land', 'path-cell-bushes', 'path-cell-water', 'path-cell-ice', 'path-cell-web');
            cell.style.removeProperty('background-color');
            const costLabel = cell.querySelector('.square-path-cost');
            if (costLabel) { costLabel.textContent = ''; costLabel.style.color = ''; }
        });
    },

    /**
     * Отрисовка расширенного игрового тултипа ячейки лагеря с калькуляцией Pathfinder-путей
     */
    showTacticalTooltip(squareId) {
        const self = TacticalMapManager;
        const tooltip = document.getElementById('hexTooltip');
        if (!tooltip) return;

        const squareElement = document.getElementById('visual_' + squareId);
        const isFoggy = squareElement ? squareElement.classList.contains('fog-active') : false;

        let content = `<div class="tooltip-title">⛺ Клетка [${squareId.replace('square_', '')}]</div>`;
        let paramsBlock = '<div style="font-size: 16px; color: #ccc; margin: 8px 0 12px 0; line-height: 1.4;">';

        const data = self.state.campMapData[squareId];
        let obstacleName = 'Чистая земля';
        let movementCostText = '5 футов (10 футов по диагонали)';

        if (data && data.obstacle) {
            const obs = data.obstacle;
            if (obs === 'wall') { obstacleName = '🧱 Стена'; movementCostText = '<span style="color:#ff7675;font-weight:bold;">НЕПРОХОДИМАЯ / БЛОК ОБЗОРА</span>'; }
            else if (obs === 'destructible') { obstacleName = '📦 Ящик / Бочка'; movementCostText = '<span style="color:#ff9f43;font-weight:bold;">НЕПРОХОДИМАЯ (Можно перепрыгнуть)</span>'; }
            else if (obs === 'bushes') { obstacleName = '🌿 Густые кусты'; movementCostText = '<span style="color:#f1c40f;font-weight:bold;">10 футов (20 фт. по диагонали)</span>'; }
            else if (obs === 'forest') { obstacleName = '🌲 Чаща леса'; movementCostText = '<span style="color:#ff7675;font-weight:bold;">НЕПРОХОДИМАЯ / БЛОК ОБЗОРА</span>'; }
            else if (obs === 'water') { obstacleName = '<span style="color:#74b9ff;font-weight:bold;">🌊 Глубокая вода</span>'; movementCostText = '<span style="color:#74b9ff;">5 футов (Проверка d20 Атлетика)</span>'; }
            else if (obs === 'stones') { obstacleName = '⛰️ Камни'; movementCostText = '<span style="color:#ff9f43;font-weight:bold;">Только прыжок</span>'; }
            else if (obs === 'ice') { obstacleName = '<span style="color:#00cec9;font-weight:bold;">❄ Скользкий лед</span>'; movementCostText = '<span style="color:#00cec9;">5 футов (Проверка d20 Акробатика)</span>'; }
            else if (obs === 'web') { obstacleName = '<span style="color:#9b59b6;font-weight:bold;">🕸 Паутина</span>'; movementCostText = '<span style="color:#9b59b6;">5 футов (Проверка d20 Спасбросок)</span>'; }
            else if (obs === 'floor-planks') { obstacleName = '🟫 Пол: Деревянные доски'; movementCostText = '5 футов'; }
            else if (obs === 'floor-cobble') { obstacleName = '🧱 Пол: Брусчатка'; movementCostText = '5 футов'; }
            else if (obs === 'floor-earth') { obstacleName = '🌱 Пол: Утоптанная земля'; movementCostText = '5 футов'; }
        }

        if (data && data.heroHere) paramsBlock += `<div style="margin-bottom: 6px; color: #54a0ff;">👑 <b>Герой в клетке</b></div>`;
        if (data && data.monsterHere && !isFoggy) paramsBlock += `<div style="margin-bottom: 6px; color: #ff7675;">👿 <b>Монстр обнаружен!</b></div>`;

        paramsBlock += `<div style="margin-bottom: 4px;">📍 <b>Объект:</b> ${obstacleName}</div>`;
        paramsBlock += `<div style="margin-bottom: 8px;">👣 <b>Цена перехода:</b> ${movementCostText}</div>`;

        if (self.state.focusedEntityId && self.state.focusedEntityId !== squareId) {
            const sourceData = self.state.campMapData[self.state.focusedEntityId];
            const speedLimit = (sourceData && sourceData.speed) ? parseInt(sourceData.speed, 10) : 30;
            const pathData = self.calculatePathAndCost(self.state.focusedEntityId, squareId, speedLimit);

            if (pathData) {
                self.clearVisualPath();
                let waterCount = 0, iceCount = 0, webCount = 0, jumpCount = 0, bushesCount = 0;
                let webJumpCount = 0, iceJumpCount = 0, waterJumpCount = 0;
                let windowCount = 0;

                pathData.cells.forEach((cellKey, index)=> {
                    const cellEl = document.getElementById('visual_' + cellKey);
                    if (cellEl) {
                        const cellData = self.state.campMapData[cellKey];
                        let costLabel = cellEl.querySelector('.square-path-cost') || document.createElement('span');
                        if (!costLabel.className) { costLabel.className = 'square-path-cost'; cellEl.appendChild(costLabel); }

                        const isJumpStart = pathData.jumpFlags[cellKey] === 'start';
                        const isJumpLand = pathData.jumpFlags[cellKey] === 'land';
                        const isJumpAction = isJumpStart || isJumpLand;

                        if (isJumpStart) jumpCount++;
                        if (cellData && cellData.obstacle === 'bushes') bushesCount++;
                        if (cellData && cellData.obstacle === 'water') { waterCount++; if (isJumpAction) waterJumpCount++; }
                        if (cellData && cellData.obstacle === 'ice') { iceCount++; if (isJumpAction) iceJumpCount++; }
                        if (cellData && cellData.obstacle === 'web') { webCount++; if (isJumpAction) webJumpCount++; }

                        if (index > 0) {
                            const prevCellKey = pathData.cells[index - 1];
                            const pParts = prevCellKey.split('_'); // ['square', 'r', 'c']
                            const cParts = cellKey.split('_');     // ['square', 'r', 'c']

                            // Извлекаем r (индекс 1) и c (индекс 2) для обеих ячеек
                            const borderCost = self.checkBorderCrossing(
                                parseInt(pParts[1], 10), parseInt(pParts[2], 10),
                                parseInt(cParts[1], 10), parseInt(cParts[2], 10)
                            );

                            if (borderCost === 10) {
                                windowCount++;
                            }
                        }

                        // СБРОС ИНЛАЙН СТИЛЕЙ: Переносим управление цветом в CSS классы ради плотности!
                        cellEl.style.removeProperty('background-color');

                        if (isJumpStart) {
                            cellEl.classList.add('path-cell-jump-start');
                            costLabel.textContent = 'JUMP 🦘'; costLabel.style.color = '#ff9f43';
                        } else if (isJumpLand) {
                            cellEl.classList.add('path-cell-jump-land');
                            costLabel.textContent = 'LAND 🎯'; costLabel.style.color = '#10ac84';
                        } else if (cellData && cellData.obstacle === 'water') {
                            cellEl.classList.add('path-cell-water');
                            costLabel.textContent = 'WATER 🌊'; costLabel.style.color = '#74b9ff';
                        } else if (cellData && cellData.obstacle === 'ice') {
                            cellEl.classList.add('path-cell-ice');
                            costLabel.textContent = 'ICE ❄️'; costLabel.style.color = '#00cec9';
                        } else if (cellData && cellData.obstacle === 'web') {
                            cellEl.classList.add('path-cell-web');
                            costLabel.textContent = 'WEB 🕸️'; costLabel.style.color = '#9b59b6';
                        } else if (cellData && cellData.obstacle === 'bushes') {
                            cellEl.classList.add('path-cell-bushes');
                            costLabel.textContent = 'BUSH 🌿'; costLabel.style.color = '#f1c40f';
                        } else {
                            cellEl.classList.add('path-cell');
                        }
                    }
                });

                let hazardReport = '';
                if (jumpCount > 0) {
                    let jumpDesc = `• <b>Прыжки:</b> совершено <b>${jumpCount}</b> прыжка(ов) с места (требуется 1 действие на каждый).`;
                    if (webJumpCount > 0) jumpDesc += ` <span style="color: #9b59b6;">[Внимание: ${webJumpCount} прыжок/приземление в паутине]</span>`;
                    if (iceJumpCount > 0) jumpDesc += ` <span style="color: #00cec9;">[Внимание: ${iceJumpCount} прыжок/приземление на льду]</span>`;
                    if (waterJumpCount > 0) jumpDesc += ` <span style="color: #74b9ff;">[Внимание: ${waterJumpCount} прыжок/приземление в воде]</span>`;
                    if (windowCount > 0) hazardReport += `<div style="color: #74b9ff; margin-top: 4px;">• <b>Окна:</b> преодолено <b>${windowCount}</b> шт. (Стоимость шага через окно: 10 фт)</div>`;

                    hazardReport += `<div style="color: #ff9f43; margin-top: 4px;">${jumpDesc}</div>`;
                }
                if (bushesCount > 0) hazardReport += `<div style="color: #f1c40f; margin-top: 4px;">• <b>Густые кусты:</b> преодолено <b>${bushesCount}</b> клеток (Трудный ландшафт: двойная цена футов движения)</div>`;
                if (waterCount > 0) hazardReport += `<div style="color: #74b9ff; margin-top: 4px;">• <b>Глубокая вода:</b> пройдено <b>${waterCount}</b> клеток (требуется проверка Атлетики 🎲D20 чтобы не утонуть)</div>`;
                if (iceCount > 0) hazardReport += `<div style="color: #00cec9; margin-top: 4px;">• <b>Скользкий лед:</b> пройдено <b>${iceCount}</b> клеток (требуется проверка Акробатики 🎲D20 чтобы не упасть)</div>`;
                if (webCount > 0) hazardReport += `<div style="color: #9b59b6; margin-top: 4px;">• <b>Липкая паутина:</b> пройдено <b>${webCount}</b> клеток (требуется проверка Акробатики 🎲D20 против опутывания)</div>`;

                paramsBlock += `<div style="border-top: 2px solid #2ecc71; padding-top: 8px; margin-top: 8px;">`;
                paramsBlock += `<span style="color: #2ecc71;">📐 <b>Итоговый маршрут:</b></span><br>`;
                paramsBlock += `• Полная дистанция: <b>${pathData.totalFeet} фт.</b><br>`;
                paramsBlock += `• Расход действий: <b>${pathData.actions} / 3 на ход</b>`;

                if (hazardReport !== '') {
                    paramsBlock += `<div style="border-top: 1px dashed #555; margin-top: 6px; padding-top: 4px; font-size: 14px;">⚠️ <b>Особенности ландшафта на пути:</b>${hazardReport}</div>`;
                }

                paramsBlock += `</div>`;
            } else {
                paramsBlock += `<div style="border-top: 2px solid #ff7675; padding-top: 8px; margin-top: 8px; color: #ff7675;">🚫 <b>Маршрут заблокирован</b> (Стены/Чаща или не хватает действий)</div>`;
            }
        }
        tooltip.innerHTML = content + paramsBlock + '';
        tooltip.style.display = 'block';
    },

    // ============================================================================
    // МЕТОДЫ ПРОВЕРКИ ГРАНИЦ И ТРАССИРОВКИ
    // ============================================================================

    /**
     * Вычисляет стоимость преодоления границы между ячейками.
     * Возвращает: 0 — свободно, 10 — окно, Infinity — стена.
     */
    checkBorderCrossing(r1, c1, r2, c2) {
        const self = TacticalMapManager;
        const cData = self.state.campMapData[`square_${r1}_${c1}`];
        const nData = self.state.campMapData[`square_${r2}_${c2}`];
        const cBorders = (cData && cData.borders) ? cData.borders : [];
        const nBorders = (nData && nData.borders) ? nData.borders : [];

        // Хелпер для анализа конкретного типа границы
        const evaluateEdge = (cType, nType) => {
            if (cBorders.includes(cType) || nBorders.includes(nType)) {
                if (cType.endsWith('wall')) return Infinity;
                if (cType.endsWith('window')) return 10;
            }
            return 0;
        };

        // Ортогональные шаги
        if (r2 === r1 - 1 && c2 === c1) return evaluateEdge('top-wall', 'bottom-wall') || evaluateEdge('top-window', 'bottom-window');
        if (r2 === r1 + 1 && c2 === c1) return evaluateEdge('bottom-wall', 'top-wall') || evaluateEdge('bottom-window', 'top-window');
        if (r2 === r1 && c2 === c1 - 1) return evaluateEdge('left-wall', 'right-wall') || evaluateEdge('left-window', 'right-window');
        if (r2 === r1 && c2 === c1 + 1) return evaluateEdge('right-wall', 'left-wall') || evaluateEdge('right-window', 'left-window');

        // Диагональные шаги (проверка угловых стыков)
        const dr = r2 - r1;
        const dc = c2 - c1;

        const vCost = dr === -1 ?
            (evaluateEdge('top-wall', 'bottom-wall') || evaluateEdge('top-window', 'bottom-window')) :
            (evaluateEdge('bottom-wall', 'top-wall') || evaluateEdge('bottom-window', 'top-window'));

        const hCost = dc === -1 ?
            (evaluateEdge('left-wall', 'right-wall') || evaluateEdge('left-window', 'right-window')) :
            (evaluateEdge('right-wall', 'left-wall') || evaluateEdge('right-window', 'left-window'));

        if (vCost === Infinity || hCost === Infinity) return Infinity;
        return vCost + hCost;
    },

    /**
     * Выделение существ на карте при одиночном клике
     */
    handleTacticalSquareClick(squareId) {
        const self = TacticalMapManager;
        const modal = document.getElementById('campMenu');
        if (modal && modal.classList.contains('open')) { self.closeCampMenu(); return; }
        const data = self.state.campMapData[squareId];
        const squareElement = document.getElementById('visual_' + squareId);
        if (!squareElement) return;
        if (data && (data.heroHere || data.monsterHere)) {
            if (self.state.focusedEntityId === squareId) {
                squareElement.classList.remove('focused-entity');
                self.state.focusedEntityId = null;
                self.clearVisualPath();
            } else {
                if (self.state.focusedEntityId) {
                    const oldFocused = document.getElementById('visual_' + self.state.focusedEntityId);
                    if (oldFocused) oldFocused.classList.remove('focused-entity');
                }
                self.state.focusedEntityId = squareId;
                squareElement.classList.add('focused-entity');
                self.clearVisualPath();
            }
        } else {
            self.openTacticalMenu(squareId);
        }
    },
    /**
     * Обработка событий Drag-and-Drop перемещения токенов персонажей на поле лагеря
     */
    bindDragAndDropTargets(square, squareId) {
        const self = TacticalMapManager;
        const crownLabel = square.querySelector('.square-crown-label');
        const monsterLabel = square.querySelector('.square-monster-label');
        const handleDragStart = (e, type) => {
            e.dataTransfer.setData('text/plain', JSON.stringify({ fromId: squareId, type: type }));
            e.dataTransfer.effectAllowed = 'move';
        };
        if (crownLabel) crownLabel.addEventListener('dragstart', (e) => handleDragStart(e, 'hero'));
        if (monsterLabel) monsterLabel.addEventListener('dragstart', (e) => handleDragStart(e, 'monster'));
        square.addEventListener('dragover', (e) => {
            e.preventDefault(); e.dataTransfer.dropEffect = 'move'; square.classList.add('drag-over');
        });
        square.addEventListener('dragleave', () => square.classList.remove('drag-over'));
        square.addEventListener('drop', (e) => {
            e.preventDefault(); square.classList.remove('drag-over');
            try {
                const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
                if (dragData.fromId === squareId) return;
                const oldData = self.state.campMapData[dragData.fromId];
                if (!oldData) return;
                if (self.state.campMapData[squareId] && (self.state.campMapData[squareId].heroHere || self.state.campMapData[squareId].monsterHere)) {
                    alert("Эта клетка уже занята!"); return;
                }
                self.clearVisualPath();
                self.state.focusedEntityId = null;
                self.state.campMapData[squareId] = {
                    ...oldData,
                    heroHere: dragData.type === 'hero',
                    monsterHere: dragData.type === 'monster',
                    hasVisited: dragData.type === 'hero' || (self.state.campMapData[squareId] && self.state.campMapData[squareId].hasVisited)
                };
                delete self.state.campMapData[dragData.fromId];
                localStorage.setItem('campMapSystemData', JSON.stringify(self.state.campMapData));
                const oldCell = document.getElementById('visual_' + dragData.fromId);
                if (oldCell) oldCell.className = 'tactical-square';
                self.recalculateCampFogOfWar();
            } catch (err) {
                console.error("Ошибка при обработке Drop события:", err);
            }
        });
    }
};
window['TacticalMapManager'] = TacticalMapManager;
export default TacticalMapManager;