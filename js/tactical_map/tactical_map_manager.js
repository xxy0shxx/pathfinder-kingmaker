// ============================================================================
// ЧАСТЬ 1 ИЗ 15: ИМПОРТЫ, СТРУКТУРА ОБЪЕКТА И БАЗОВОЕ СОСТОЯНИЕ (STATE)
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
    // ЧАСТЬ 2 ИЗ 15: ИНИЦИАЛИЗАЦИЯ (INIT) И КОНТРОЛЛЕР ПЕРЕКЛЮЧЕНИЯ РЕЖИМОВ
    // ============================================================================

    /**
     * Точка входа: Первичная калькуляция сетки лагеря
     */
    init() {
        this.campParams.cols = Math.floor(this.campParams.width / this.campParams.squareSize) + 1;
        this.campParams.rows = Math.floor(this.campParams.height / this.campParams.squareSize) + 1;

        // Безопасное чтение сохраненного прогресса из LocalStorage
        try {
            this.state.campMapData = JSON.parse(localStorage.getItem('campMapSystemData')) || {};
        } catch (e) {
            console.error("Критическая ошибка чтения campMapSystemData:", e);
            this.state.campMapData = {};
        }

        // Запуск связывания обработчиков
        this.initMapSelector();
        this.initFormEventListeners();
        this.initFogToggleButton();
        this.initGridEventDelegation();
    },

    /**
     * Контроллер переключения режимов (Глобальная карта / Лагерь)
     */
    initMapSelector() {
        const btnToggleMapMode = document.getElementById('btnToggleMapMode');
        if (!btnToggleMapMode) return;

        this.state.currentMapMode = 'global';

        btnToggleMapMode.addEventListener('click', () => {
            if (this.state.currentMapMode === 'global') {
                this.switchMapMode('camp');

                btnToggleMapMode.innerHTML = '⛺';
                btnToggleMapMode.title = 'Переключить на глобальную карту';
                btnToggleMapMode.style.background = 'linear-gradient(180deg, #42351f 0%, #292011 100%)';
                btnToggleMapMode.style.borderColor = '#543e0d';
                btnToggleMapMode.style.color = '#ebd291';
            } else {
                this.switchMapMode('global');

                btnToggleMapMode.innerHTML = '🗺️';
                btnToggleMapMode.title = 'Переключить на карту лагеря';
                btnToggleMapMode.style.background = 'linear-gradient(180deg, #4f5d65 0%, #2c3539 100%)';
                btnToggleMapMode.style.borderColor = '#d4af37';
                btnToggleMapMode.style.color = '#d1d8e0';
            }
        });
    },
    // ============================================================================
    // ЧАСТЬ 3 ИЗ 15: МЕНЕДЖЕР РЕСУРСОВ И СЛОЕВ ВИДИМОСТИ (SWITCH MAP MODE)
    // ============================================================================

    /**
     * Переключение ресурсов подложки, размеров вьюпорта и слоев видимости
     */
    switchMapMode(mode) {
        this.state.currentMapMode = mode;

        const mapImg = document.getElementById('mapImg');
        const hexLayer = document.getElementById('visualLayer');
        const gridLayer = document.getElementById('tacticalGridLayer');
        const mapContainer = document.getElementById('mapContainer');
        const btnToggleFog = document.getElementById('btnToggleFog');
        const clickableMap = document.getElementById('clickableMap');

        if (!mapImg || !mapContainer) return;

        if (typeof window.closeMenu === 'function') window.closeMenu();
        this.closeCampMenu();

        // [ОПТИМИЗАЦИЯ] Безопасный сброс координат вьюпорта через свойства объекта
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

            // Насильно заставляем Canvas обновить экран после возвращения на глобальную карту
            if (window.HexCanvasRender) window.HexCanvasRender.requestFrame();

        } else if (mode === 'camp') {
            mapImg.src = this.campParams.src;
            mapContainer.style.width = this.campParams.width + 'px';
            mapContainer.style.height = this.campParams.height + 'px';
            mapImg.style.width = this.campParams.width + 'px';
            mapImg.style.height = this.campParams.height + 'px';

            if (hexLayer) hexLayer.style.display = 'none';
            if (gridLayer) {
                gridLayer.style.display = 'grid';
                this.buildTacticalGrid();
            }
            if (clickableMap) clickableMap.style.display = 'none';
            if (btnToggleFog) btnToggleFog.style.display = 'flex';
        }

        ViewportManager.updateMapTransform();
    },
    // ============================================================================
    // ЧАСТЬ 4 ИЗ 15: ГЕНЕРАЦИЯ И СБОРКА ТАКТИЧЕСКОЙ СЕТКИ (BUILD TACTICAL GRID)
    // ============================================================================

    /**
     * Рендеринг тактической сетки лагеря БЕЗ создания лишних слушателей событий на ячейках
     */
    buildTacticalGrid() {
        const gridLayer = document.getElementById('tacticalGridLayer');
        if (!gridLayer) return;

        gridLayer.innerHTML = '';

        const realGridWidth = this.campParams.cols * this.campParams.squareSize;
        const realGridHeight = this.campParams.rows * this.campParams.squareSize;

        gridLayer.style.width = realGridWidth + 'px';
        gridLayer.style.height = realGridHeight + 'px';
        gridLayer.style.left = this.campParams.offsetX + 'px';
        gridLayer.style.top = this.campParams.offsetY + 'px';

        gridLayer.style.gridTemplateColumns = `repeat(${this.campParams.cols}, ${this.campParams.squareSize}px)`;
        gridLayer.style.gridTemplateRows = `repeat(${this.campParams.rows}, ${this.campParams.squareSize}px)`;

        // [ОПТИМИЗАЦИЯ] Накапливаем ноды в фрагменте памяти для мгновенного инжекта в DOM
        const fragment = document.createDocumentFragment();

        for (let r = 0; r < this.campParams.rows; r++) {
            for (let c = 0; c < this.campParams.cols; c++) {
                const squareId = `square_${r}_${c}`;
                const data = this.state.campMapData[squareId];

                const square = document.createElement('div');
                square.className = 'tactical-square';
                square.setAttribute('id', `visual_${squareId}`);
                square.dataset.squareId = squareId; // Сохраняем ID для делегирования событий

                square.style.width = this.campParams.squareSize + 'px';
                square.style.height = this.campParams.squareSize + 'px';

                square.innerHTML = `
                    <span class="square-star-label">${data ? '★' : ''}</span>
                    <span class="square-crown-label" draggable="true">${data && data.heroHere ? '👑' : ''}</span>
                    <span class="square-monster-label" draggable="true"></span>
                    <span class="square-obstacle-label"></span>
                `;

                const isFoggy = !data || (!data.explored && !data.hasVisited);
                if (this.state.isCampFogEnabled && isFoggy) {
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

                // Привязываем только Drag-and-Drop логику
                this.bindDragAndDropTargets(square, squareId);
                fragment.appendChild(square);
            }
        }

        gridLayer.appendChild(fragment);
        this.recalculateCampFogOfWar();
    },
    // ============================================================================
    // ОБНОВЛЕННАЯ ЧАСТЬ 5 ИЗ 15: АРХИТЕКТУРНОЕ ДЕЛЕГИРОВАНИЕ С СИНХРОНИЗАЦИЕЙ ТУЛТИПА
    // ============================================================================

    /**
     * Архитектурное делегирование событий: вешаем слушатели на корень сетки.
     * Добавлен mousemove для жесткой и плавной привязки тултипа к курсору мыши.
     */
    initGridEventDelegation() {
        const gridLayer = document.getElementById('tacticalGridLayer');
        if (!gridLayer) return;

        // 1. Единый обработчик одиночных кликов на сетке
        gridLayer.addEventListener('click', (e) => {
            const cell = e.target.closest('.tactical-square');
            if (!cell || ViewportManager.getHasMoved()) return;

            e.preventDefault();
            this.handleTacticalSquareClick(cell.dataset.squareId);
        });

        // 2. Единый обработчик двойных кликов для открытия меню ячейки
        gridLayer.addEventListener('dblclick', (e) => {
            const cell = e.target.closest('.tactical-square');
            if (!cell || ViewportManager.getHasMoved()) return;

            e.preventDefault();
            const squareId = cell.dataset.squareId;

            if (this.state.focusedEntityId === squareId) {
                cell.classList.remove('focused-entity');
                this.state.focusedEntityId = null;
                this.clearVisualPath();
            }
            this.openTacticalMenu(squareId);
        });

        // 3. Динамическое наведение мыши: подгрузка путей и тултипов при входе курсора в ячейку
        gridLayer.addEventListener('mouseenter', (e) => {
            const cell = e.target.closest('.tactical-square');
            if (!cell) return;
            this.showTacticalTooltip(cell.dataset.squareId);
        }, { capture: true });

        // 4. КРИТИЧЕСКОЕ ОБНОВЛЕНИЕ: Плавное следование тултипа за курсором мыши
        gridLayer.addEventListener('mousemove', (e) => {
            const tooltip = document.getElementById('hexTooltip');
            if (!tooltip || tooltip.style.display === 'none') return;

            // Смещение подсказки на 15 пикселей вправо и вниз от курсора, чтобы она не перекрывала ячейку
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
            if (this.state.focusedEntityId) this.clearVisualPath();
        }, { capture: true });
    },



    // ============================================================================
    // ЧАСТЬ 6 ИЗ 15: ОБРАБОТЧИКИ ФОРМЫ МОДАЛЬНОГО ОКНА (FORM EVENT LISTENERS)
    // ============================================================================

    /**
     * Однократная привязка обработчиков для элементов управления формы модального окна лагеря
     */
    initFormEventListeners() {
        const btnCampSave = document.getElementById('btnCampSave');
        const btnCampCancel = document.getElementById('btnCampCancel');
        const btnCampDelete = document.getElementById('btnCampDelete');
        const inpMeasurement = document.getElementById('inpCampMeasurement');
        const directionBox = document.getElementById('campDirectionBox');
        const inpHero = document.getElementById('inpCampHeroHere');
        const inpMonster = document.getElementById('inpCampMonsterHere');
        const inpObstacle = document.getElementById('inpCampObstacle');

        if (btnCampSave) btnCampSave.addEventListener('click', () => this.saveTacticalSquare());
        if (btnCampCancel) btnCampCancel.addEventListener('click', () => this.closeCampMenu());
        if (btnCampDelete) btnCampDelete.addEventListener('click', () => this.deleteTacticalSquare());

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

        this.initCampColorPresets();
    },



    // ============================================================================
    // ЧАСТЬ 7 ИЗ 15: ЦВЕТОВЫЕ ПРЕСЕТЫ И ТУМАН ВОЙНЫ (COLOR PRESETS & FOG TOGGLE)
    // ============================================================================

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
        const btnToggleFog = document.getElementById('btnToggleFog');
        if (!btnToggleFog) return;

        btnToggleFog.addEventListener('click', () => {
            this.state.isCampFogEnabled = !this.state.isCampFogEnabled;
            btnToggleFog.classList.toggle('fog-disabled', !this.state.isCampFogEnabled);
            btnToggleFog.classList.toggle('active', this.state.isCampFogEnabled);
            btnToggleFog.textContent = this.state.isCampFogEnabled ? '👁️' : '👓';

            if (this.state.currentMapMode === 'camp') {
                this.recalculateCampFogOfWar();
            }
        });
    },
    // ============================================================================
    // ЧАСТЬ 8 ИЗ 15: УПРАВЛЕНИЕ МОДАЛЬНЫМ ОКНОМ (OPEN & CLOSE CAMP MENU)
    // ============================================================================

    /**
     * Заполнение полей формы актуальными данными ячейки и вывод окна на экран
     */
    openTacticalMenu(squareId) {
        this.state.currentHexId = squareId;
        const modal = document.getElementById('campMenu');
        if (!modal) return;

        const data = this.state.campMapData[squareId];

        // Заполнение чекбоксов персонажей
        document.getElementById('inpCampHeroHere').checked = !!(data && data.heroHere);
        document.getElementById('inpCampMonsterHere').checked = !!(data && data.monsterHere);

        // Синхронизация селекторов под новые значения со страницы
        document.getElementById('inpCampMeasurement').value = data ? data.measurement || '' : '';
        document.getElementById('inpCampObstacle').value = data ? data.obstacle || '' : '';
        document.getElementById('inpCampSpeed').value = data ? data.speed || '30' : '30';
        document.getElementById('inpCampDistance').value = data ? data.distance || '30' : '30';

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

        // Показ или скрытие селектора направления конуса
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
    // ============================================================================
    // ЧАСТЬ 9 ИЗ 15: КРУД-ОПЕРАЦИИ ЯЧЕЕК (SAVE & DELETE TACTICAL SQUARE)
    // ============================================================================

    /**
     * Сбор параметров из полей формы, запись в стейт и обновление графического состояния ячейки
     */
    saveTacticalSquare() {
        const id = this.state.currentHexId;
        if (!id) return;

        const heroHereVal = document.getElementById('inpCampHeroHere').checked;
        const monsterHereVal = document.getElementById('inpCampMonsterHere').checked;
        const obstacleVal = document.getElementById('inpCampObstacle').value;
        const measurementVal = document.getElementById('inpCampMeasurement').value;
        const distanceVal = document.getElementById('inpCampDistance').value;
        const directionVal = document.getElementById('inpCampDirection').value;
        const colorVal = document.getElementById('inpCampColor').value || 'transparent';
        const speedVal = document.getElementById('inpCampSpeed').value;

        const squareElement = document.getElementById('visual_' + id);

        if (squareElement) {
            squareElement.classList.remove('fog-active');
            const star = squareElement.querySelector('.square-star-label');
            if (star) star.textContent = '★';

            squareElement.classList.toggle('squad-dark', heroHereVal);
            squareElement.classList.remove('monster-dark');

            if (colorVal !== 'transparent') {
                squareElement.style.backgroundColor = ColorConverter.hexToRgba(colorVal, 0.37);
            } else {
                squareElement.style.backgroundColor = '';
            }
        }

        this.state.campMapData[id] = {
            heroHere: heroHereVal,
            monsterHere: monsterHereVal,
            obstacle: obstacleVal,
            measurement: measurementVal,
            distance: distanceVal,
            direction: directionVal,
            color: colorVal,
            speed: speedVal,
            explored: true,
            hasVisited: heroHereVal || (this.state.campMapData[id] && this.state.campMapData[id].hasVisited),
            lastSaved: new Date().toLocaleString()
        };

        localStorage.setItem('campMapSystemData', JSON.stringify(this.state.campMapData));
        this.recalculateCampFogOfWar();
        this.closeCampMenu();
    },

    /**
     * Полное удаление пользовательских данных из ячейки и сброс её CSS-стилей
     */
    deleteTacticalSquare() {
        const id = this.state.currentHexId;
        if (!id) return;

        delete this.state.campMapData[id];
        localStorage.setItem('campMapSystemData', JSON.stringify(this.state.campMapData));

        const squareElement = document.getElementById('visual_' + id);
        if (squareElement) {
            squareElement.classList.remove('squad-dark', 'focused-entity');
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

        this.recalculateCampFogOfWar();
        this.closeCampMenu();
    },
    // ============================================================================
    // ЧАСТЬ 10 ИЗ 15: ЦИКЛ ТУМАНА ВОЙНЫ И ОБЪЕКТОВ ЛАНДШАФТА (RECALCULATE CAMP FOG)
    // ============================================================================

    /**
     * Полноценный цикл обновления видимости, типов препятствий и наложения AoE-аур на холсте лагеря
     */
    recalculateCampFogOfWar() {
        const cellAuras = {};

        // Шаг 1: Очистка и первичное распределение ландшафтных элементов по сетке
        for (let r = 0; r < this.campParams.rows; r++) {
            for (let c = 0; c < this.campParams.cols; c++) {
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

                const savedData = this.state.campMapData[squareId];

                // Обработка видимости с учетом глобального флага тумана лагеря
                if (!this.state.isCampFogEnabled) {
                    squareElement.classList.remove('fog-active');
                    squareElement.style.backgroundImage = '';
                    squareElement.style.boxShadow = '';
                    if (savedData && savedData.color && savedData.color !== 'transparent') {
                        squareElement.style.backgroundColor = ColorConverter.hexToRgba(savedData.color, 0.37);
                    } else {
                        squareElement.style.backgroundColor = '';
                    }
                } else {
                    if (savedData && savedData.explored && !savedData.monsterHere) {
                        squareElement.classList.remove('fog-active');
                        squareElement.style.backgroundImage = '';
                        squareElement.style.boxShadow = '';
                        if (savedData.color && savedData.color !== 'transparent') {
                            squareElement.style.backgroundColor = ColorConverter.hexToRgba(savedData.color, 0.37);
                        } else {
                            squareElement.style.backgroundColor = '';
                        }
                    } else {
                        squareElement.classList.add('fog-active');
                        squareElement.style.backgroundColor = '';
                        squareElement.style.backgroundImage = '';
                        squareElement.style.boxShadow = '';
                    }
                }

                // Встраивание эмодзи-индикаторов и стилей для физических препятствий (Obstacles)
                if (savedData && savedData.obstacle) {
                    const obsType = savedData.obstacle;
                    if (obsType === 'wall') { squareElement.classList.add('obstacle-wall'); if (obstacle) obstacle.textContent = '🧱'; }
                    else if (obsType === 'destructible') { if (obstacle) obstacle.textContent = '📦'; }
                    else if (obsType === 'bushes') { if (obstacle) obstacle.textContent = '🌿'; }
                    else if (obsType === 'forest') { if (obstacle) obstacle.textContent = '🌲'; }
                    else if (obsType === 'water') { if (obstacle) obstacle.textContent = '🌊'; }
                    else if (obsType === 'stones') { squareElement.classList.add('obstacle-stones'); if (obstacle) obstacle.textContent = '🪨'; }
                    else if (obsType === 'ice') { squareElement.classList.add('obstacle-ice'); if (obstacle) obstacle.textContent = '❄️'; }
                    else if (obsType === 'web') { squareElement.classList.add('obstacle-web'); if (obstacle) obstacle.textContent = '🕸️'; }
                }
            }
        }
        // ============================================================================
        // ЧАСТЬ 11 ИЗ 15: РАСЧЕТ И МНОГОСЛОЙНЫЙ РЕНДЕРИНГ ПЕРЕСЕЧЕНИЙ АУР
        // ============================================================================

        // Шаг 2: Расчет источников аур Героев (с автоматическим раскрытием тумана вокруг них)
        for (let id in this.state.campMapData) {
            const data = this.state.campMapData[id];
            if (data && data.heroHere) {
                const squareElement = document.getElementById('visual_' + id);
                if (squareElement) {
                    const crown = squareElement.querySelector('.square-crown-label');
                    if (crown) crown.textContent = '👑';
                }
                this.processEntityAura(id, data, cellAuras, true);
            }
        }

        // Шаг 3: Расчет источников аур Монстров (только если они вышли из тумана войны)
        for (let id in this.state.campMapData) {
            const data = this.state.campMapData[id];
            if (data && data.monsterHere) {
                const squareElement = document.getElementById('visual_' + id);
                if (!squareElement) continue;

                if (!squareElement.classList.contains('fog-active')) {
                    const monster = squareElement.querySelector('.square-monster-label');
                    if (monster) monster.textContent = '👿';
                    this.processEntityAura(id, data, cellAuras, false);
                }
            }
        }

        // Шаг 4: Послойная отрисовка пересечений цветовых аур через множественные градиенты
        for (let targetId in cellAuras) {
            const targetElement = document.getElementById('visual_' + targetId);
            if (!targetElement) continue;

            const targetSavedData = this.state.campMapData[targetId];
            if (targetSavedData && targetSavedData.color && targetSavedData.color !== 'transparent') continue;

            const auras = cellAuras[targetId];
            if (auras.length === 1) {
                const col = auras[0];
                targetElement.style.backgroundImage = '';
                targetElement.style.backgroundColor = col.startsWith('rgba') ? col : ColorConverter.hexToRgba(col, 0.45);
                targetElement.style.boxShadow = `inset 0 0 6px ${col.startsWith('rgba') ? 'rgba(255,255,255,0.2)' : ColorConverter.hexToRgba(col, 0.3)}`;
            } else if (auras.length > 1) {
                targetElement.style.backgroundColor = 'transparent';
                const gradientLayers = auras.map(col => {
                    const rgbaColor = col.startsWith('rgba') ? col : ColorConverter.hexToRgba(col, 0.40);
                    return `linear-gradient(${rgbaColor}, ${rgbaColor})`;
                }).join(', ');
                targetElement.style.backgroundImage = gradientLayers;
                targetElement.style.boxShadow = 'inset 0 0 8px rgba(255, 255, 255, 0.35)';
            }
        }
    },
    // ============================================================================
    // ЧАСТЬ 12 ИЗ 15: ГЕОМЕТРИЯ АУР И ЛИНЕЙНАЯ ТРАССИРОВКА ЛУЧЕЙ (LOS & CONE)
    // ============================================================================

    /**
     * Поклеточный просчет радиуса действия источника и заполнение карты аур
     */
    processEntityAura(id, data, cellAuras, shouldRevealFog) {
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
                if (r >= 0 && r < this.campParams.rows && c >= 0 && c < this.campParams.cols) {

                    let inZone = data.measurement === 'cone' ?
                        this.isCellInCone(centerR, centerC, r, c, cellRadius, data.direction || 'N') :
                        Math.sqrt((r - centerR) ** 2 + (c - centerC) ** 2) <= cellRadius + 0.5;

                    if (inZone) {
                        // [ОПТИМИЗАЦИЯ] Проверка Line of Sight через трассировку лучей Брезенхэма
                        if (!this.checkLineOfSight(centerR, centerC, r, c)) continue;

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
     */
    checkLineOfSight(r1, c1, r2, c2) {
        if (r1 === r2 && c1 === c2) return true;
        let dr = Math.abs(r2 - r1), dc = Math.abs(c2 - c1);
        let sr = (r1 < r2) ? 1 : -1, sc = (c1 < c2) ? 1 : -1;
        let err = dc - dr;
        let currR = r1, currC = c1;

        while (true) {
            if (currR === r2 && currC === c2) return true;
            if (currR !== r1 || currC !== c1) {
                const cellData = this.state.campMapData[`square_${currR}_${currC}`];
                // ОБНОВЛЕНИЕ: Препятствия типа wall и forest полностью блокируют распространение лучей аур
                if (cellData && (cellData.obstacle === 'wall' || cellData.obstacle === 'forest')) return false;
            }
            let e2 = 2 * err;
            if (e2 > -dr) { err -= dr; currC += sc; }
            if (e2 < dc) { err += dc; currR += sr; }
        }
    },
    // ============================================================================
    // ЧАСТЬ 13 ИЗ 15: АЛГОРИТМ ДЕЙКСТРЫ (КАЛЬКУЛЯЦИЯ ПЕШЕХОДНОГО МАРШРУТА)
    // ============================================================================





    /**
     * Поиск кратчайшего пути (Алгоритм Дейкстры) с учетом 3-х действий на ход.
     * Стоимость прыжка — 1 действие. Скорость <= 30: прыжок 10 фт. Скорость > 30: прыжок 15 фт.
     * Часть 1 из 2: Инициализация, приоритетная ходьба и расчет дальности прыжков.
     */
    calculatePathAndCost(startId, targetId, speedLimit) {
        const parseCoords = (id) => {
            if (!id) return { r: 0, c: 0 };
            const p = id.split('_');
            if (p.length === 3) {
                return { r: parseInt(p[1], 10), c: parseInt(p[2], 10) };
            }
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
            // КОМПАРАТОР: Приоритет отдаем путям с МЕНЬШИМ количеством действий и МЕНЬШИМ количеством прыжков
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

            // 1. НАПРАВЛЕНИЯ ДЛЯ ХОДЬБЫ (8 НАПРАВЛЕНИЙ)
            const directions = [
                { dr: -1, dc: 0,  isDiag: false }, { dr: 1,  dc: 0,  isDiag: false },
                { dr: 0,  dc: -1, isDiag: false }, { dr: 0,  dc: 1,  isDiag: false },
                { dr: -1, dc: -1, isDiag: true  }, { dr: -1, dc: 1,  isDiag: true  },
                { dr: 1,  dc: -1, isDiag: true  }, { dr: 1,  dc: 1,  isDiag: true  }
            ];

            for (let d of directions) {
                const nr = curr.r + d.dr;
                const nc = curr.c + d.dc;

                if (nr < 0 || nr >= this.campParams.rows || nc < 0 || nc >= this.campParams.cols) continue;

                const nKey = `square_${nr}_${nc}`;
                const nData = this.state.campMapData[nKey];

                if (nData && ['wall', 'destructible', 'stones', 'forest'].includes(nData.obstacle)) {
                    if (nKey !== targetKey) continue;
                    if (['wall', 'forest'].includes(nData.obstacle)) continue;
                }

                if (d.isDiag) {
                    const sideData1 = this.state.campMapData[`square_${curr.r + d.dr}_${curr.c}`];
                    const sideData2 = this.state.campMapData[`square_${curr.r}_${curr.c + d.dc}`];
                    if ((sideData1 && ['wall', 'forest'].includes(sideData1.obstacle)) ||
                        (sideData2 && ['wall', 'forest'].includes(sideData2.obstacle))) {
                        continue;
                    }
                }

                let stepCost = d.isDiag ? 10 : 5;
                if (nData && nData.obstacle === 'bushes') {
                    stepCost *= 2;
                }

                let nextActions = currState.actions;
                let nextSpentFeet = currState.currentActionSpentFeet + stepCost;

                if (currState.currentActionSpentFeet === 0 || nextSpentFeet > speedLimit) {
                    nextActions += 1;
                    nextSpentFeet = stepCost;
                    if (stepCost > speedLimit || nextActions > 3) continue;
                }

                let nextTotalFeet = currState.feet + stepCost;
                const nextState = {
                    feet: nextTotalFeet,
                    actions: nextActions,
                    currentActionSpentFeet: nextSpentFeet,
                    cameByJump: false,
                    jumpsCount: curr.jumpsCount
                };

                if (distances[nKey] === undefined || nextState.actions < distances[nKey].actions || (nextState.actions === distances[nKey].actions && nextState.feet < distances[nKey].feet)) {
                    distances[nKey] = nextState;
                    parents[nKey] = { parentKey: currKey, isJump: false };
                    queue.push({ id: nKey, r: nr, c: nc, actions: nextActions, feet: nextTotalFeet, cameByJump: false, jumpsCount: curr.jumpsCount });
                }
            }

            // 2. НАПРАВЛЕНИЯ ДЛЯ ПРЫЖКОВ
            const jumpCellsCount = (speedLimit > 30) ? 3 : 2;
            const jumpTargets = [
                { r: curr.r - jumpCellsCount, c: curr.c, dr: -1, dc: 0 },
                { r: curr.r + jumpCellsCount, c: curr.c, dr: 1, dc: 0 },
                { r: curr.r, c: curr.c - jumpCellsCount, dr: 0, dc: -1 },
                { r: curr.r, c: curr.c + jumpCellsCount, dr: 0, dc: 1 }
            ];

            for (let jt of jumpTargets) {
                if (jt.r < 0 || jt.r >= this.campParams.rows || jt.c < 0 || jt.c >= this.campParams.cols) continue;

                const nKey = `square_${jt.r}_${jt.c}`;
                const targetData = this.state.campMapData[nKey];

                if (targetData && ['wall', 'forest'].includes(targetData.obstacle)) continue;

                let obstacleInPath = false;
                let blockerInPath = false;

                for (let i = 1; i < jumpCellsCount; i++) {
                    const checkData = this.state.campMapData[`square_${curr.r + (jt.dr * i)}_${curr.c + (jt.dc * i)}`];
                    if (checkData && checkData.obstacle) {
                        if (checkData.obstacle === 'wall' || checkData.obstacle === 'forest') {
                            blockerInPath = true;
                            break;
                        }
                        if (['destructible', 'stones'].includes(checkData.obstacle)) {
                            obstacleInPath = true;
                        }
                    }
                }

                if (blockerInPath || !obstacleInPath) continue;

                const jumpActions = currState.actions + 1;
                if (jumpActions > 3) continue;

                const nextTotalFeet = currState.feet + (jumpCellsCount * 5);
                const nextState = {
                    feet: nextTotalFeet,
                    actions: jumpActions,
                    currentActionSpentFeet: 0,
                    cameByJump: true,
                    jumpsCount: curr.jumpsCount + 1
                };

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
            currentKey = currNode.parentKey;
            pathCells.push(currentKey);
            currNode = parents[currentKey];
        }
        return { cells: pathCells.reverse(), jumpFlags, totalFeet: distances[targetKey].feet, actions: distances[targetKey].actions };
    },




    /**
     * Очистка визуальных эффектов пути с карты
     */
    clearVisualPath() {
        document.querySelectorAll('.tactical-square').forEach(cell => {
            cell.classList.remove('path-cell', 'path-cell-jump', 'path-cell-jump-start', 'path-cell-jump-land');
            const costLabel = cell.querySelector('.square-path-cost');
            if (costLabel) { costLabel.textContent = ''; costLabel.style.color = ''; }
        });
    },
    // ============================================================================
    // ЧАСТЬ 15 ИЗ 15: РАСШИРЕННЫЙ ТУЛТИП, КЛИКИ, DRAG-AND-DROP И ЭКСПОРТ
    // ============================================================================

    /**
     * Отрисовка расширенного игрового тултипа ячейки лагеря с калькуляцией Pathfinder-путей
     * Часть 1 из 2: Определение типов ландшафта, их накопление и раскраска клеток трека.
     */
    showTacticalTooltip(squareId) {
        const tooltip = document.getElementById('hexTooltip');
        if (!tooltip) return;

        const squareElement = document.getElementById('visual_' + squareId);
        const isFoggy = squareElement ? squareElement.classList.contains('fog-active') : false;

        let content = `<div class="tooltip-title">⛺ Клетка [${squareId.replace('square_', '')}]</div>`;
        let paramsBlock = '<div style="font-size: 16px; color: #ccc; margin: 8px 0 12px 0; line-height: 1.4;">';

        const data = this.state.campMapData[squareId];
        let obstacleName = 'Чистая земля';
        let movementCostText = '5 футов (10 футов по диагонали)';

        if (data && data.obstacle) {
            const obs = data.obstacle;
            if (obs === 'wall') { obstacleName = '🧱 Стена'; movementCostText = '<span style="color:#ff7675;font-weight:bold;">НЕПРОХОДИМАЯ / БЛОК ОБЗОРА</span>'; }
            else if (obs === 'destructible') { obstacleName = '📦 Ящик / Бочка'; movementCostText = '<span style="color:#ff9f43;font-weight:bold;">НЕПРОХОДИМАЯ (Можно перепрыгнуть)</span>'; }
            else if (obs === 'bushes') { obstacleName = '🌿 Густые кусты'; movementCostText = '<span style="color:#f1c40f;font-weight:bold;">10 футов (20 фт. по диагонали)</span>'; }
            else if (obs === 'forest') { obstacleName = '🌲 Чаща леса'; movementCostText = '<span style="color:#ff7675;font-weight:bold;">НЕПРОХОДИМАЯ / БЛОК ОБЗОРА</span>'; }
            else if (obs === 'water') { obstacleName = '<span style="color:#74b9ff;font-weight:bold;">🌊 Глубокая вода</span>'; movementCostText = '<span style="color:#74b9ff;">5 футов (Проверка Атлетики d20)</span>'; }
            else if (obs === 'stones') { obstacleName = '🪨 Камни'; movementCostText = '<span style="color:#ff9f43;font-weight:bold;">Только прыжок</span>'; }
            else if (obs === 'ice') { obstacleName = '<span style="color:#00cec9;font-weight:bold;">❄ Скользкий лед</span>'; movementCostText = '<span style="color:#00cec9;">5 футов (Проверка Акробатики d20)</span>'; }
            else if (obs === 'web') { obstacleName = '<span style="color:#9b59b6;font-weight:bold;">🕸 Паутина</span>'; movementCostText = '<span style="color:#9b59b6;">5 футов (Проверка Спасброска d20)</span>'; }
        }

        if (data && data.heroHere) paramsBlock += `<div style="margin-bottom: 6px; color: #54a0ff;">👑 <b>Герой в клетке</b></div>`;
        if (data && data.monsterHere && !isFoggy) paramsBlock += `<div style="margin-bottom: 6px; color: #ff7675;">👿 <b>Монстр обнаружен!</b></div>`;

        paramsBlock += `<div style="margin-bottom: 4px;">📍 <b>Объект:</b> ${obstacleName}</div>`;
        paramsBlock += `<div style="margin-bottom: 8px;">👣 <b>Цена перехода:</b> ${movementCostText}</div>`;

        if (this.state.focusedEntityId && this.state.focusedEntityId !== squareId) {
            const sourceData = this.state.campMapData[this.state.focusedEntityId];
            const speedLimit = (sourceData && sourceData.speed) ? parseInt(sourceData.speed, 10) : 30;
            const pathData = this.calculatePathAndCost(this.state.focusedEntityId, squareId, speedLimit);

            if (pathData) {
                this.clearVisualPath();

                // Переменные для учета абсолютно всех препятствий на пути персонажа
                let waterCount = 0, iceCount = 0, webCount = 0, jumpCount = 0, bushesCount = 0, objectJumpedCount = 0;

                pathData.cells.forEach(cellKey => {
                    const cellEl = document.getElementById('visual_' + cellKey);
                    if (cellEl) {
                        const cellData = this.state.campMapData[cellKey];
                        let costLabel = cellEl.querySelector('.square-path-cost') || document.createElement('span');
                        if (!costLabel.className) { costLabel.className = 'square-path-cost'; cellEl.appendChild(costLabel); }

                        // 1. Обработка прыжков
                        if (pathData.jumpFlags[cellKey] === 'start') {
                            cellEl.classList.add('path-cell-jump-start');
                            cellEl.style.setProperty('background-color', 'rgba(255, 159, 67, 0.4)', 'important');
                            costLabel.textContent = 'JUMP 🦘'; costLabel.style.color = '#ff9f43'; jumpCount++;

                            // Проверяем, какой именно объект перепрыгнул персонаж (сканируем клетку впереди)
                            const parts = cellKey.split('_');
                            const r = parseInt(parts[1], 10), c = parseInt(parts[2], 10);
                            // Для простоты смотрим на объект в следующей клетке траектории, если он там есть
                            if (cellData && ['destructible', 'stones'].includes(cellData.obstacle)) {
                                objectJumpedCount++;
                            }
                        } else if (pathData.jumpFlags[cellKey] === 'land') {
                            cellEl.classList.add('path-cell-jump-land');
                            cellEl.style.setProperty('background-color', 'rgba(16, 172, 132, 0.4)', 'important');
                            costLabel.textContent = 'LAND 🎯'; costLabel.style.color = '#10ac84';
                        }
                        // 2. Густые кусты (Желтый/Оливковый)
                        else if (cellData && cellData.obstacle === 'bushes') {
                            cellEl.classList.add('path-cell-bushes');
                            cellEl.style.setProperty('background-color', 'rgba(241, 196, 15, 0.35)', 'important');
                            costLabel.textContent = 'BUSH 🌿'; costLabel.style.color = '#f1c40f'; bushesCount++;
                        }
                        // 3. Водная преграда
                        else if (cellData && cellData.obstacle === 'water') {
                            cellEl.classList.add('path-cell-water');
                            cellEl.style.setProperty('background-color', 'rgba(116, 185, 255, 0.4)', 'important');
                            costLabel.textContent = 'WATER 🌊'; costLabel.style.color = '#74b9ff'; waterCount++;
                        }
                        // 4. Скользкий лед
                        else if (cellData && cellData.obstacle === 'ice') {
                            cellEl.classList.add('path-cell-ice');
                            cellEl.style.setProperty('background-color', 'rgba(0, 206, 201, 0.4)', 'important');
                            costLabel.textContent = 'ICE ❄️'; costLabel.style.color = '#00cec9'; iceCount++;
                        }
                        // 5. Липкая паутина
                        else if (cellData && cellData.obstacle === 'web') {
                            cellEl.classList.add('path-cell-web');
                            cellEl.style.setProperty('background-color', 'rgba(155, 89, 182, 0.4)', 'important');
                            costLabel.textContent = 'WEB 🕸️'; costLabel.style.color = '#9b59b6'; webCount++;
                        }
                        // 6. Обычная клетка
                        else {
                            cellEl.classList.add('path-cell');
                        }
                    }
                });
                // Динамическое накопление и сквозной вывод ВСЕХ преград и объектов ландшафта
                let hazardReport = '';
                if (jumpCount > 0) {
                    hazardReport += `<div style="color: #ff9f43; margin-top: 4px;">• <b>Прыжки:</b> совершено <b>${jumpCount}</b> прыжка(ов) с места (требуется 1 действие на каждый)</div>`;
                }
                if (bushesCount > 0) {
                    hazardReport += `<div style="color: #f1c40f; margin-top: 4px;">• <b>Густые кусты:</b> преодолено <b>${bushesCount}</b> клеток (Трудный ландшафт: двойная цена футов движения)</div>`;
                }
                if (waterCount > 0) {
                    hazardReport += `<div style="color: #74b9ff; margin-top: 4px;">• <b>Глубокая вода:</b> пройдено <b>${waterCount}</b> клеток (требуется проверка Атлетики d20 за каждую)</div>`;
                }
                if (iceCount > 0) {
                    hazardReport += `<div style="color: #00cec9; margin-top: 4px;">• <b>Скользкий лед:</b> пройдено <b>${iceCount}</b> клеток (требуется проверка Акробатики d20 за каждую)</div>`;
                }
                if (webCount > 0) {
                    hazardReport += `<div style="color: #9b59b6; margin-top: 4px;">• <b>Липкая паутина:</b> пройдено <b>${webCount}</b> клеток (требуется Спасбросок d20 против опутывания)</div>`;
                }

                paramsBlock += `<div style="border-top: 2px solid #2ecc71; padding-top: 8px; margin-top: 8px;">`;
                paramsBlock += `<span style="color: #2ecc71;">📐 <b>Итоговый маршрут:</b></span><br>`;
                paramsBlock += `• Полная дистанция: <b>${pathData.totalFeet} фт.</b><br>`;
                paramsBlock += `• Расход действий: <b>${pathData.actions} / 3 на ход</b>`;

                if (hazardReport !== '') {
                    paramsBlock += `<div style="border-top: 1px dashed #555; margin-top: 6px; padding-top: 4px; font-size: 14px;">`;
                    paramsBlock += `⚠️ <b>Особенности ландшафта на пути:</b>${hazardReport}`;
                    paramsBlock += `</div>`;
                }
                paramsBlock += `</div>`;
            } else {
                paramsBlock += `<div style="border-top: 2px solid #ff7675; padding-top: 8px; margin-top: 8px; color: #ff7675;">🚫 <b>Маршрут заблокирован</b> (Стены/Чаща или не хватает действий)</div>`;
            }
        }

        tooltip.innerHTML = content + paramsBlock + '</div>';
        tooltip.style.display = 'block';
    },

    /**
     * Выделение существ на карте при одиночном клике
     */
    handleTacticalSquareClick(squareId) {
        const modal = document.getElementById('campMenu');
        if (modal && modal.classList.contains('open')) { this.closeCampMenu(); return; }

        const data = this.state.campMapData[squareId];
        const squareElement = document.getElementById('visual_' + squareId);
        if (!squareElement) return;

        if (data && (data.heroHere || data.monsterHere)) {
            if (this.state.focusedEntityId === squareId) {
                squareElement.classList.remove('focused-entity');
                this.state.focusedEntityId = null;
                this.clearVisualPath();
            } else {
                if (this.state.focusedEntityId) {
                    const oldFocused = document.getElementById('visual_' + this.state.focusedEntityId);
                    if (oldFocused) oldFocused.classList.remove('focused-entity');
                }
                this.state.focusedEntityId = squareId;
                squareElement.classList.add('focused-entity');
                this.clearVisualPath();
            }
        } else {
            this.openTacticalMenu(squareId);
        }
    },

    /**
     * Обработка событий Drag-and-Drop перемещения токенов персонажей на игровом поле лагеря
     */
    bindDragAndDropTargets(square, squareId) {
        const crownLabel = square.querySelector('.square-crown-label');
        const monsterLabel = square.querySelector('.square-monster-label');

        const handleDragStart = (e, type) => {
            e.dataTransfer.setData('text/plain', JSON.stringify({ fromId: squareId, type: type }));
            e.dataTransfer.effectAllowed = 'move';
        };

        if (crownLabel) crownLabel.addEventListener('dragstart', (e) => handleDragStart(e, 'hero'));
        if (monsterLabel) monsterLabel.addEventListener('dragstart', (e) => handleDragStart(e, 'monster'));

        square.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            square.classList.add('drag-over');
        });

        square.addEventListener('dragleave', () => square.classList.remove('drag-over'));

        square.addEventListener('drop', (e) => {
            e.preventDefault();
            square.classList.remove('drag-over');
            try {
                const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
                if (dragData.fromId === squareId) return;

                const oldData = this.state.campMapData[dragData.fromId];
                if (!oldData) return;

                if (this.state.campMapData[squareId] && (this.state.campMapData[squareId].heroHere || this.state.campMapData[squareId].monsterHere)) {
                    alert("Эта клетка уже занята!");
                    return;
                }

                this.clearVisualPath();
                this.state.focusedEntityId = null;

                this.state.campMapData[squareId] = {
                    ...oldData,
                    heroHere: dragData.type === 'hero',
                    monsterHere: dragData.type === 'monster',
                    hasVisited: dragData.type === 'hero' || (this.state.campMapData[squareId] && this.state.campMapData[squareId].hasVisited)
                };

                delete this.state.campMapData[dragData.fromId];
                localStorage.setItem('campMapSystemData', JSON.stringify(this.state.campMapData));

                const oldCell = document.getElementById('visual_' + dragData.fromId);
                if (oldCell) oldCell.className = 'tactical-square';

                this.recalculateCampFogOfWar();
            } catch (err) {
                console.error("Ошибка при обработке Drop события:", err);
            }
        });
    }
};

window['TacticalMapManager'] = TacticalMapManager;

export default TacticalMapManager;
