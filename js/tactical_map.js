const campParams = {
    src: 'img/map_camp1.png',
    width: 1280,
    height: 1024,
    squareSize: 42.7,
    offsetX: 0,
    offsetY: 0
};

campParams.cols = Math.floor(campParams.width / campParams.squareSize) + 1;
campParams.rows = Math.floor(campParams.height / campParams.squareSize) + 1;

let isCampFogEnabled = true;
let focusedEntityId = null;
let globalMapData = JSON.parse(localStorage.getItem('hexMapSystemData')) || {};
let campMapData = JSON.parse(localStorage.getItem('campMapSystemData')) || {};

let currentMapMode = 'global';

function initMapSelector() {
    const btnToggleMapMode = document.getElementById('btnToggleMapMode');
    if (!btnToggleMapMode) return;

    currentMapMode = 'global';

    btnToggleMapMode.addEventListener('click', () => {
        if (currentMapMode === 'global') {
            switchMapMode('camp');

            btnToggleMapMode.innerHTML = '⛺';
            btnToggleMapMode.title = 'Переключить на глобальную карту';
            btnToggleMapMode.style.background = 'linear-gradient(180deg, #42351f 0%, #292011 100%)';
            btnToggleMapMode.style.borderColor = '#543e0d';
            btnToggleMapMode.style.color = '#ebd291';
        } else {
            switchMapMode('global');

            btnToggleMapMode.innerHTML = '🗺️';
            btnToggleMapMode.title = 'Переключить на карту лагеря';
            btnToggleMapMode.style.background = 'linear-gradient(180deg, #4f5d65 0%, #2c3539 100%)';
            btnToggleMapMode.style.borderColor = '#d4af37';
            btnToggleMapMode.style.color = '#d1d8e0';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initMapSelector();
});

function switchMapMode(mode) {
    currentMapMode = mode;

    const mapImg = document.getElementById('mapImg');
    const hexLayer = document.getElementById('visualLayer');
    const gridLayer = document.getElementById('tacticalGridLayer');
    const mapContainer = document.getElementById('mapContainer');

    if (!mapImg || !mapContainer) return;

    if (typeof closeMenu === 'function') closeMenu();

    x = 0;
    y = 0;
    currentZoom = 1.0;

    const btnToggleFog = document.getElementById('btnToggleFog');

    if (mode === 'global') {
        mapImg.src = 'img/map_global.png';
        mapContainer.style.width = '3840px';
        mapContainer.style.height = '1280px';
        mapImg.style.width = '3840px';
        mapImg.style.height = '1280px';

        if (hexLayer) hexLayer.style.display = 'block';
        if (gridLayer) gridLayer.style.display = 'none';

        const clickableMap = document.getElementById('clickableMap');
        if (clickableMap) clickableMap.style.display = 'block';
        if (btnToggleFog) btnToggleFog.style.display = 'none';

    } else if (mode === 'camp') {
        mapImg.src = campParams.src;
        mapContainer.style.width = campParams.width + 'px';
        mapContainer.style.height = campParams.height + 'px';
        mapImg.style.width = campParams.width + 'px';
        mapImg.style.height = campParams.height + 'px';

        if (hexLayer) hexLayer.style.display = 'none';
        if (gridLayer) {
            gridLayer.style.display = 'grid';
            buildTacticalGrid();
        }

        const clickableMap = document.getElementById('clickableMap');
        if (clickableMap) clickableMap.style.display = 'none';
        if (btnToggleFog) btnToggleFog.style.display = 'flex';
    }

    if (typeof updateMapTransform === 'function') {
        updateMapTransform();
    }
}

// ============================================================================
// ЧАСТЬ 1 ИЗ 3: ОТРИСОВКА ТОНКИХ РАЗДЕЛИТЕЛЬНЫХ СТЕН И ОКНО-ГРАНИЦ
// ============================================================================

/**
 * Рендеринг тактической сетки лагеря с учетом тонких разделительных стен/окон на гранях
 */
function buildTacticalGrid() {
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

    const fragment = document.createDocumentFragment();

    for (let r = 0; r < this.campParams.rows; r++) {
        for (let c = 0; c < this.campParams.cols; c++) {
            const squareId = `square_${r}_${c}`;
            const data = this.state.campMapData[squareId];

            const square = document.createElement('div');
            square.className = 'tactical-square';
            square.setAttribute('id', `visual_${squareId}`);
            square.dataset.squareId = squareId;

            square.style.width = this.campParams.squareSize + 'px';
            square.style.height = this.campParams.squareSize + 'px';

            square.innerHTML = `
                    <span class="square-star-label">${data ? '★' : ''}</span>
                    <span class="square-crown-label" draggable="true">${data && data.heroHere ? '👑' : ''}</span>
                    <span class="square-monster-label" draggable="true"></span>
                    <span class="square-obstacle-label"></span>
                `;

            // Динамическое наложение стилей для тонких стен через CSS-границы
            if (data && data.borders && Array.isArray(data.borders)) {
                data.borders.forEach(b => {
                    // Формат строки в базе: "top-wall", "left-window", "right-wall", "bottom-window"
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

            this.bindDragAndDropTargets(square, squareId);
            fragment.appendChild(square);
        }
    }

    gridLayer.appendChild(fragment);
    this.recalculateCampFogOfWar();
}



document.addEventListener('DOMContentLoaded', () => {
    const btnSave = document.getElementById('btnSave');
    const btnDelete = document.getElementById('btnDelete');

    if (btnSave) {
        btnSave.addEventListener('click', (e) => {
            if (currentMapMode === 'camp' && currentHexId && currentHexId.startsWith('square_')) {
                e.stopImmediatePropagation();
                saveTacticalSquare();
            }
        }, { capture: true });
    }

    if (btnDelete) {
        btnDelete.addEventListener('click', (e) => {
            if (currentMapMode === 'camp' && currentHexId && currentHexId.startsWith('square_')) {
                e.stopImmediatePropagation();
                deleteTacticalSquare();
            }
        }, { capture: true });
    }
});




// ============================================================================
// ЧАСТЬ 2 ИЗ 2: СБОР ПАРАМЕТРОВ СТЕН И ИХ ЗАПИСЬ (SAVE TACTICAL SQUARE)
// ============================================================================

/**
 * Сбор параметров из полей формы, запись в стейт и обновление графического состояния ячейки
 */
function saveTacticalSquare() {
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

    // КРИТИЧЕСКОЕ ОБНОВЛЕНИЕ: Сбор выбранных тонких стен и окон с формы
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
        if (star) star.textContent = '★';

        squareElement.classList.toggle('squad-dark', heroHereVal);
        squareElement.classList.remove('monster-dark');

        // Мгновенный сброс старых CSS-границ перед наложением новых
        squareElement.style.borderTop = '';
        squareElement.style.borderBottom = '';
        squareElement.style.borderLeft = '';
        squareElement.style.borderRight = '';

        // Визуализируем новые тонкие стены на клетке через стили
        savedBorders.forEach(b => {
            if (b === 'top-wall') squareElement.style.borderTop = '3px solid #ff7675';
            if (b === 'top-window') squareElement.style.borderTop = '3px dashed #74b9ff';
            if (b === 'bottom-wall') squareElement.style.borderBottom = '3px solid #ff7675';
            if (b === 'bottom-window') squareElement.style.borderBottom = '3px dashed #74b9ff';
            if (b === 'left-wall') squareElement.style.borderLeft = '3px solid #ff7675';
            if (b === 'left-window') squareElement.style.borderLeft = '3px dashed #74b9ff';
            if (b === 'right-wall') squareElement.style.borderRight = '3px solid #ff7675';
            if (b === 'right-window') squareElement.style.borderRight = '3px dashed #74b9ff';
        });

        if (colorVal !== 'transparent') {
            squareElement.style.backgroundColor = ColorConverter.hexToRgba(colorVal, 0.37);
        } else {
            squareElement.style.backgroundColor = '';
        }
    }

    // Сохраняем расширенный пакет данных в изолированное состояние модуля
    this.state.campMapData[id] = {
        heroHere: heroHereVal,
        monsterHere: monsterHereVal,
        obstacle: obstacleVal,
        measurement: measurementVal,
        distance: distanceVal,
        direction: directionVal,
        color: colorVal,
        speed: speedVal,
        borders: savedBorders, // Записываем массив разделителей в базу
        explored: true,
        hasVisited: heroHereVal || (this.state.campMapData[id] && this.state.campMapData[id].hasVisited),
        lastSaved: new Date().toLocaleString()
    };

    localStorage.setItem('campMapSystemData', JSON.stringify(this.state.campMapData));
    this.recalculateCampFogOfWar();
    this.closeCampMenu();
}



function deleteTacticalSquare() {
    const id = currentHexId;
    if (!id) return;

    delete campMapData[id];
    localStorage.setItem('campMapSystemData', JSON.stringify(campMapData));

    const squareElement = document.getElementById('visual_' + id);
    if (squareElement) {
        squareElement.classList.remove('squad-dark');
        squareElement.style.backgroundColor = '';

        const star = squareElement.querySelector('.square-star-label');
        if (star) star.textContent = '';

        const crown = squareElement.querySelector('.square-crown-label');
        if (crown) crown.textContent = '';

        const monster = squareElement.querySelector('.square-monster-label');
        if (monster) monster.textContent = '';

        const obs = squareElement.querySelector('.square-obstacle-label');
        if (obs) obs.textContent = '';
    }

    recalculateCampFogOfWar();
    closeCampMenu();
}

function bindTacticalTooltip(square, squareId) {
    const tooltip = document.getElementById('hexTooltip');
    if (!tooltip) return;

    square.addEventListener('mouseenter', () => {
        const squareElement = document.getElementById('visual_' + squareId);
        const isFoggy = squareElement ? squareElement.classList.contains('fog-active') : false;

        let content = `<div class="tooltip-title">⛺ Клетка [${squareId.replace('square_', '')}]</div>`;
        let paramsBlock = '<div style="font-size: 16px; color: #ccc; margin: 8px 0 12px 0; line-height: 1.4;">';

        const data = campMapData[squareId];

        let obstacleName = 'Чистая земля';
        let movementCostText = '5 футов';
        if (data && data.obstacle) {
            if (data.obstacle === 'wall') { obstacleName = '🧱 Стена'; movementCostText = '<span style="color:#ff7675;font-weight:bold;">НЕПРОХОДИМО</span>'; }
            else if (data.obstacle === 'destructible') { obstacleName = '📦 Ящик / Бочка'; movementCostText = '<span style="color:#ff7675;font-weight:bold;">НЕПРОХОДИМО</span>'; }
            else if (data.obstacle === 'bushes') { obstacleName = '🌿 Густые кусты'; movementCostText = '<span style="color:#f1c40f;font-weight:bold;">10 футов</span>'; }
            else if (data.obstacle === 'forest') { obstacleName = '🌲 Чаща леса'; movementCostText = '<span style="color:#f1c40f;font-weight:bold;">10 футов</span>'; }
            else if (data.obstacle === 'water') { obstacleName = '🌊 Глубокая вода'; movementCostText = '<span style="color:#74b9ff;font-weight:bold;">Риск 🎲 d20 (Вилка хода)</span>'; }
            else if (data.obstacle === 'stones') { obstacleName = '🪨 Камни / Валуны'; movementCostText = '<span style="color:#e67e22;font-weight:bold;">ТОЛЬКО ПРЫЖОК</span>'; }
            else if (data.obstacle === 'ice') { obstacleName = '❄️ Скользкий лед'; movementCostText = '<span style="color:#74b9ff;font-weight:bold;">5 футов (Проверка d20)</span>'; }
            else if (data.obstacle === 'web') { obstacleName = '🕸️ Липкая паутина'; movementCostText = '<span style="color:#ffeaa7;font-weight:bold;">5 футов (Проверка d20)</span>'; }
        }

        if (data && data.monsterHere && isFoggy) {
            obstacleName = 'Чистая земля';
            movementCostText = '5 футов';
        } else if (data) {
            if (data.heroHere) paramsBlock += `<div style="margin-bottom: 6px; color: #54a0ff;">👑 <b>Герой в клетке</b></div>`;
            if (data.monsterHere) paramsBlock += `<div style="margin-bottom: 6px; color: #ff7675;">👿 <b>Монстр обнаружен!</b></div>`;
        }

        paramsBlock += `<div style="margin-bottom: 4px;">📍 <b>Объект:</b> ${obstacleName}</div>`;
        paramsBlock += `<div style="margin-bottom: 8px;">👣 <b>Цена перехода:</b> ${movementCostText}</div>`;

        if (focusedEntityId && focusedEntityId !== squareId) {
            const sourceData = campMapData[focusedEntityId];
            const speedLimit = (sourceData && sourceData.speed && !isNaN(parseInt(sourceData.speed))) ? parseInt(sourceData.speed) : 30;

            const pathData = calculatePathAndCost(focusedEntityId, squareId, speedLimit);

            if (pathData) {
                clearVisualPath();

                pathData.cells.forEach(cellKey => {
                    const cellEl = document.getElementById(`visual_square_${cellKey}`);
                    if (cellEl) {
                        let costLabel = cellEl.querySelector('.square-path-cost');
                        if (!costLabel) {
                            costLabel = document.createElement('span');
                            costLabel.className = 'square-path-cost';
                            cellEl.appendChild(costLabel);
                        }

                        if (pathData.jumpFlags[cellKey] === 'start') {
                            cellEl.classList.add('path-cell-jump-start');
                            costLabel.textContent = 'JUMP 🦘';
                            costLabel.style.color = '#ff9f43';
                        } else if (pathData.jumpFlags[cellKey] === 'land') {
                            cellEl.classList.add('path-cell-jump-land');
                            costLabel.textContent = 'LAND 🎯';
                            costLabel.style.color = '#10ac84';
                        } else {
                            cellEl.classList.add('path-cell');
                        }
                    }
                });

                paramsBlock += `<div style="border-top: 2px solid #2ecc71; padding-top: 8px; margin-top: 8px; color: #2ecc71;">`;
                paramsBlock += `📐 <b>Логистика пути + Прыжки:</b><br>`;
                paramsBlock += `• Эквивалент пути: <b>${pathData.totalFeet} фт.</b><br>`;

                let routeHasIce = false;
                let routeHasWeb = false;
                let routeHasWater = false;

                pathData.cells.forEach(cellKey => {
                    const cellData = campMapData[`square_${cellKey}`];
                    if (cellData && cellData.obstacle === 'ice') routeHasIce = true;
                    if (cellData && cellData.obstacle === 'web') routeHasWeb = true;
                    if (cellData && cellData.obstacle === 'water') routeHasWater = true;
                });

                if (routeHasIce) {
                    paramsBlock += `<span style="color:#74b9ff;">❄️ <b>Пересекается скользкий лед:</b></span><br>`;
                    paramsBlock += `• Возможный ход: <b>🎲 от 5 фт. (1 кл.)</b> до <b>${speedLimit} фт. (${speedLimit / 5} кл.)</b><br>`;
                    paramsBlock += `<span style="font-size:12px;color:#aaa;line-height:1.2;display:block;margin-top:2px;">*При провале 🎲 d20 персонаж может поскользнуться и упасть.</span><br>`;
                }

                if (routeHasWeb) {
                    paramsBlock += `<span style="color:#ffeaa7;">🕸️ <b>Пересекается липкая паутина:</b></span><br>`;
                    paramsBlock += `• Возможный ход: <b>🎲 от 5 фт. (1 кл.)</b> до <b>${speedLimit} фт. (${speedLimit / 5} кл.)</b><br>`;
                    paramsBlock += `<span style="font-size:12px;color:#aaa;line-height:1.2;display:block;margin-top:2px;">*При провале 🎲 d20 персонаж завязнет на месте.</span><br>`;
                }

                if (routeHasWater) {
                    paramsBlock += `<span style="color:#74b9ff;">🌊 <b>Пересекается глубокая вода:</b></span><br>`;
                    paramsBlock += `• Возможный ход: <b>🎲 от 5 фт. (1 кл.)</b> до <b>${speedLimit} фт. (${speedLimit / 5} кл.)</b><br>`;
                    paramsBlock += `<span style="font-size:12px;color:#aaa;line-height:1.2;display:block;margin-top:2px;">*При провале 🎲 d20 персонаж начнет тонуть или завязнет в иле.</span><br>`;
                }

                const hasJumps = Object.keys(pathData.jumpFlags).length > 0;
                if (hasJumps) {
                    paramsBlock += `• Особенности: <span style="color:#f1c40f;font-weight:bold;">Использован прыжок 🦘</span><br>`;
                }

                if (pathData.actions <= 3) {
                    paramsBlock += `• Всего действий: <span style="font-weight:bold;color:#fff;">${pathData.actions} / 3</span><br>`;
                    paramsBlock += `• Статус: <b>Маршрут доступен за 1 ход</b></div>`;
                } else {
                    paramsBlock += `• Всего действий: <span style="font-weight:bold;color:#ff7675;">${pathData.actions} / 3</span><br>`;
                    paramsBlock += `• Статус: <span style="color:#ff7675;font-weight:bold;">❌ Превышает лимит (3 действия)</span></div>`;
                }
            } else {
                paramsBlock += `<div style="border-top:1px dashed #ff7675;padding-top:6px;margin-top:6px;color:#ff7675;">❌ <b>Путь заблокирован преградами</b></div>`;
            }
        }

        paramsBlock += '</div>';
        tooltip.innerHTML = content + paramsBlock;
        tooltip.style.display = 'block';
    });

    square.addEventListener('mousemove', (e) => {
        tooltip.style.left = (e.clientX + 25) + 'px';
        tooltip.style.top = (e.clientY + 25) + 'px';
    });

    square.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
        tooltip.innerHTML = '';
        if (focusedEntityId) clearVisualPath();
    });
}

const campModal = document.getElementById('campMenu');

function initCampColorPresets() {
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
}


// ============================================================================
// ЧАСТЬ 1 ИЗ 2: СИНХРОНИЗАЦИЯ СТЕН ПРИ ОТКРЫТИИ И ОЧИСТКЕ (OPEN & DELETE)
// ============================================================================

/**
 * Заполнение полей формы актуальными данными ячейки и вывод окна на экран
 */
function openTacticalMenu(squareId) {
    this.state.currentHexId = squareId;
    const modal = document.getElementById('campMenu');
    if (!modal) return;

    const data = this.state.campMapData[squareId];

    // Заполнение чекбоксов персонажей и селекторов ландшафта
    document.getElementById('inpCampHeroHere').checked = !!(data && data.heroHere);
    document.getElementById('inpCampMonsterHere').checked = !!(data && data.monsterHere);
    document.getElementById('inpCampMeasurement').value = data ? data.measurement || '' : '';
    document.getElementById('inpCampObstacle').value = data ? data.obstacle || '' : '';
    document.getElementById('inpCampSpeed').value = data ? data.speed || '30' : '30';
    document.getElementById('inpCampDistance').value = data ? data.distance || '30' : '30';

    // КРИТИЧЕСКОЕ ОБНОВЛЕНИЕ: Сброс и выставление чекбоксов тонких стен на форме
    const directions = ['top', 'bottom', 'left', 'right'];
    const types = ['wall', 'window'];

    // Сначала полностью очищаем галочки перед заполнением
    directions.forEach(d => {
        types.forEach(t => {
            const el = document.getElementById(`inpCampBorder_${d}_${t}`);
            if (el) el.checked = false;
        });
    });

    // Если в базе есть сохраненные стены, активируем соответствующие чекбоксы
    if (data && data.borders && Array.isArray(data.borders)) {
        data.borders.forEach(b => {
            // b имеет вид: "top-wall", "left-window" и т.д.
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
}


function closeCampMenu() {
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
    }
    if (campModal) campModal.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
    initCampColorPresets();

    if (currentMapMode === 'camp') {
        buildTacticalGrid();
    }

    if (campModal) {
        campModal.addEventListener('click', function(e) {
            if (e.target === campModal) { closeCampMenu(); }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const btnCampSave = document.getElementById('btnCampSave');
    const btnCampCancel = document.getElementById('btnCampCancel');
    const btnCampDelete = document.getElementById('btnCampDelete');

    if (btnCampSave) btnCampSave.addEventListener('click', saveTacticalSquare);
    if (btnCampCancel) btnCampCancel.addEventListener('click', closeCampMenu);
    if (btnCampDelete) btnCampDelete.addEventListener('click', deleteTacticalSquare);
});

function recalculateCampFogOfWar() {
    const cellAuras = {};

    for (let r = 0; r < campParams.rows; r++) {
        for (let c = 0; c < campParams.cols; c++) {
            const squareId = `square_${r}_${c}`;
            const squareElement = document.getElementById('visual_' + squareId);
            if (!squareElement) continue;

            const crown = squareElement.querySelector('.square-crown-label');
            if (crown) crown.textContent = '';
            const monster = squareElement.querySelector('.square-monster-label');
            if (monster) monster.textContent = '';
            const obstacle = squareElement.querySelector('.square-obstacle-label');
            if (obstacle) obstacle.textContent = '';

            squareElement.classList.remove('obstacle-wall');

            const savedData = campMapData[squareId];

            if (!isCampFogEnabled) {
                squareElement.classList.remove('fog-active');
                squareElement.style.backgroundImage = '';
                squareElement.style.boxShadow = '';
                if (savedData && savedData.color && savedData.color !== 'transparent') {
                    squareElement.style.backgroundColor = convertHexToRgba(savedData.color, 0.37);
                } else {
                    squareElement.style.backgroundColor = '';
                }
            } else {
                if (savedData && savedData.explored && !savedData.monsterHere) {
                    squareElement.classList.remove('fog-active');
                    squareElement.style.backgroundImage = '';
                    squareElement.style.boxShadow = '';
                    if (savedData.color && savedData.color !== 'transparent') {
                        squareElement.style.backgroundColor = convertHexToRgba(savedData.color, 0.37);
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

            if (savedData && savedData.obstacle) {
                if (savedData.obstacle === 'wall') {
                    squareElement.classList.add('obstacle-wall');
                    if (obstacle) obstacle.textContent = '🧱';
                } else if (savedData.obstacle === 'destructible') {
                    if (obstacle) obstacle.textContent = '📦';
                } else if (savedData.obstacle === 'bushes') {
                    if (obstacle) obstacle.textContent = '🌿';
                } else if (savedData.obstacle === 'forest') {
                    if (obstacle) obstacle.textContent = '🌲';
                } else if (savedData.obstacle === 'water') {
                    if (obstacle) obstacle.textContent = '🌊';
                } else if (savedData.obstacle === 'stones') {
                    squareElement.classList.add('obstacle-stones');
                    if (obstacle) obstacle.textContent = '🪨';
                } else if (savedData.obstacle === 'ice') {
                    squareElement.classList.add('obstacle-ice');
                    if (obstacle) obstacle.textContent = '❄️';
                } else if (savedData.obstacle === 'web') {
                    squareElement.classList.add('obstacle-web');
                    if (obstacle) obstacle.textContent = '🕸️';
                }
            }
        }
    }

    for (let id in campMapData) {
        const data = campMapData[id];
        if (data && data.heroHere) {
            const squareElement = document.getElementById('visual_' + id);
            if (squareElement) {
                const crown = squareElement.querySelector('.square-crown-label');
                if (crown) crown.textContent = '👑';
            }
            processEntityAura(id, data, cellAuras, true);
        }
    }

    for (let id in campMapData) {
        const data = campMapData[id];
        if (data && data.monsterHere) {
            const squareElement = document.getElementById('visual_' + id);
            if (!squareElement) continue;

            const isVisibleToPlayers = !squareElement.classList.contains('fog-active');

            if (isVisibleToPlayers) {
                const monster = squareElement.querySelector('.square-monster-label');
                if (monster) monster.textContent = '👿';
                processEntityAura(id, data, cellAuras, false);
            }
        }
    }

    for (let targetId in cellAuras) {
        const targetElement = document.getElementById('visual_' + targetId);
        if (!targetElement) continue;

        const targetSavedData = campMapData[targetId];
        const hasOwnColor = targetSavedData && targetSavedData.color && targetSavedData.color !== 'transparent';

        if (!hasOwnColor) {
            const auras = cellAuras[targetId];

            if (auras.length === 1) {
                const col = auras[0];
                targetElement.style.backgroundImage = '';
                targetElement.style.backgroundColor = col.startsWith('rgba') ? col : convertHexToRgba(col, 0.45);
                targetElement.style.boxShadow = `inset 0 0 6px ${col.startsWith('rgba') ? 'rgba(255,255,255,0.2)' : convertHexToRgba(col, 0.3)}`;
            } else if (auras.length > 1) {
                targetElement.style.backgroundColor = 'transparent';

                const gradientLayers = auras.map(col => {
                    const rgbaColor = col.startsWith('rgba') ? col : convertHexToRgba(col, 0.40);
                    return `linear-gradient(${rgbaColor}, ${rgbaColor})`;
                }).join(', ');

                targetElement.style.backgroundImage = gradientLayers;
                targetElement.style.boxShadow = 'inset 0 0 8px rgba(255, 255, 255, 0.35)';
            }
        }
    }
}

function processEntityAura(id, data, cellAuras, shouldRevealFog) {
    if (!data.measurement || !data.distance) return;

    const parts = id.split('_');
    const centerR = parseInt(parts[1]);
    const centerC = parseInt(parts[2]);

    const ftDistance = parseInt(data.distance) || 5;
    let cellRadius = data.measurement === 'radius' ? Math.round(ftDistance / 5) : Math.round((ftDistance / 2) / 5);
    if (data.measurement === 'cone') cellRadius = Math.round(ftDistance / 5);

    if (cellRadius <= 0) return;

    for (let r = centerR - cellRadius; r <= centerR + cellRadius; r++) {
        for (let c = centerC - cellRadius; c <= centerC + cellRadius; c++) {
            if (r >= 0 && r < campParams.rows && c >= 0 && c < campParams.cols) {

                let inZone = false;

                if (data.measurement === 'cone') {
                    inZone = isCellInCone(centerR, centerC, r, c, cellRadius, data.direction || 'N');
                } else {
                    const distR = r - centerR;
                    const distC = c - centerC;
                    inZone = Math.sqrt(distR * distR + distC * distC) <= cellRadius + 0.5;
                }

                if (inZone) {
                    if (!checkLineOfSight(centerR, centerC, r, c)) {
                        continue;
                    }

                    const targetId = `square_${r}_${c}`;
                    const targetElement = document.getElementById('visual_' + targetId);

                    if (targetElement) {
                        if (shouldRevealFog) {
                            targetElement.classList.remove('fog-active');
                        }

                        if (!cellAuras[targetId]) {
                            cellAuras[targetId] = [];
                        }

                        if (data.color && data.color !== 'transparent') {
                            cellAuras[targetId].push(data.color);
                        } else {
                            cellAuras[targetId].push('rgba(255, 255, 255, 0.08)');
                        }
                    }
                }
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const inpMeasurement = document.getElementById('inpCampMeasurement');
    const directionBox = document.getElementById('campDirectionBox');

    if (inpMeasurement && directionBox) {
        inpMeasurement.addEventListener('change', () => {
            if (inpMeasurement.value === 'cone') {
                directionBox.style.display = 'block';
            } else {
                directionBox.style.display = 'none';
            }
        });
    }
});

function isCellInCone(centerR, centerC, r, c, radius, direction) {
    const distR = r - centerR;
    const distC = c - centerC;

    const currentDist = Math.sqrt(distR * distR + distC * distC);
    if (currentDist > radius + 0.5) return false;
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
}

document.addEventListener('DOMContentLoaded', () => {
    const btnToggleFog = document.getElementById('btnToggleFog');

    if (currentMapMode === 'camp') {
        buildTacticalGrid();
        if (btnToggleFog) btnToggleFog.style.display = 'flex';
    } else {
        if (btnToggleFog) btnToggleFog.style.display = 'none';
    }

    if (btnToggleFog) {
        btnToggleFog.addEventListener('click', () => {
            isCampFogEnabled = !isCampFogEnabled;
            if (isCampFogEnabled) {
                btnToggleFog.classList.remove('fog-disabled');
                btnToggleFog.classList.add('active');
                btnToggleFog.textContent = '👁️';
            } else {
                btnToggleFog.classList.add('fog-disabled');
                btnToggleFog.classList.remove('active');
                btnToggleFog.textContent = '👓';
            }
            if (currentMapMode === 'camp') {
                recalculateCampFogOfWar();
            }
        });
    }

    const inpHero = document.getElementById('inpCampHeroHere');
    const inpMonster = document.getElementById('inpCampMonsterHere');

    if (inpHero && inpMonster) {
        inpHero.addEventListener('change', () => {
            if (inpHero.checked) inpMonster.checked = false;
        });
        inpMonster.addEventListener('change', () => {
            if (inpMonster.checked) inpHero.checked = false;
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const btnExport = document.getElementById('btnExport');
    const fileInput = document.getElementById('fileInput');

    if (btnExport) {
        btnExport.addEventListener('click', (e) => {
            if (currentMapMode === 'camp') {
                e.stopImmediatePropagation();

                const jsonString = JSON.stringify(campMapData, null, 4);
                const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
                const dataStr = URL.createObjectURL(blob);

                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute("download", "camp_data.json");
                document.body.appendChild(downloadAnchor);

                downloadAnchor.click();
                downloadAnchor.remove();
                URL.revokeObjectURL(dataStr);
            }
        }, { capture: true });
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (currentMapMode === 'camp') {
                e.stopImmediatePropagation();

                const files = e.target.files;
                if (!files || files.length === 0) return;

                const reader = new FileReader();
                reader.onload = function(evt) {
                    try {
                        campMapData = JSON.parse(evt.target.result);
                        localStorage.setItem('campMapSystemData', JSON.stringify(campMapData));

                        buildTacticalGrid();
                        alert('Данные тактической карты лагеря успешно импортированы!');
                    } catch (err) {
                        alert('Ошибка при чтении JSON файла лагеря.');
                    }
                    fileInput.value = '';
                };
                reader.readAsText(files[0]);
            }
        }, { capture: true });
    }
});

function bindDragAndDropEvents(square, squareId, crownLabel, monsterLabel) {
    const handleDragStart = (e, type) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ fromId: squareId, type: type }));
        e.dataTransfer.effectAllowed = 'move';

        isDragging = false;
    };

    crownLabel.addEventListener('dragstart', (e) => handleDragStart(e, 'hero'));
    monsterLabel.addEventListener('dragstart', (e) => handleDragStart(e, 'monster'));

    square.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        if (!square.classList.contains('drag-over')) {
            square.classList.add('drag-over');
        }
    });

    square.addEventListener('dragleave', () => {
        square.classList.remove('drag-over');
    });

    square.addEventListener('drop', (e) => {
        e.preventDefault();
        square.classList.remove('drag-over');

        try {
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            const fromId = data.fromId;
            const entityType = data.type;

            if (fromId === squareId) return;

            const oldData = campMapData[fromId];
            if (!oldData) return;

            if (campMapData[squareId] && (campMapData[squareId].heroHere || campMapData[squareId].monsterHere)) {
                alert("Эта клетка уже занята другим персонажем!");
                return;
            }

            if (typeof clearVisualPath === 'function') clearVisualPath();
            focusedEntityId = null;

            campMapData[squareId] = {
                heroHere: entityType === 'hero',
                monsterHere: entityType === 'monster',
                measurement: oldData.measurement || '',
                distance: oldData.distance || '5',
                direction: oldData.direction || 'N',
                color: oldData.color || 'transparent',
                speed: oldData.speed || '30',
                explored: true,
                hasVisited: entityType === 'hero' || (campMapData[squareId] && campMapData[squareId].hasVisited),
                lastSaved: new Date().toLocaleString()
            };

            delete campMapData[fromId];

            localStorage.setItem('campMapSystemData', JSON.stringify(campMapData));

            const oldSquareElement = document.getElementById('visual_' + fromId);
            if (oldSquareElement) {
                oldSquareElement.classList.remove('squad-dark', 'focused-entity');
                const oldStar = oldSquareElement.querySelector('.square-star-label');
                if (oldStar) oldStar.textContent = '';
            }

            const newStar = square.querySelector('.square-star-label');
            if (newStar) newStar.textContent = '★';
            if (entityType === 'hero') square.classList.add('squad-dark');

            recalculateCampFogOfWar();

        } catch (err) {
            console.error("Ошибка обработки Drag-and-Drop перемещения:", err);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const inpObstacle = document.getElementById('inpCampObstacle');
    const inpHeroCheck = document.getElementById('inpCampHeroHere');
    const inpMonsterCheck = document.getElementById('inpCampMonsterHere');

    if (inpObstacle && inpHeroCheck && inpMonsterCheck) {
        inpObstacle.addEventListener('change', () => {
            if (inpObstacle.value !== '') {
                inpHeroCheck.checked = false;
                inpMonsterCheck.checked = false;
            }
        });
    }
});



function checkLineOfSight(r1, c1, r2, c2) {
    if (r1 === r2 && c1 === c2) return true;

    let dr = Math.abs(r2 - r1);
    let dc = Math.abs(c2 - c1);
    let sr = (r1 < r2) ? 1 : -1;
    let sc = (c1 < c2) ? 1 : -1;
    let err = dc - dr;

    let currR = r1;
    let currC = c1;

    while (true) {
        if (currR === r2 && currC === c2) return true;

        if (currR !== r1 || currC !== c1) {
            const checkId = `square_${currR}_${currC}`;
            const cellData = campMapData[checkId];

            if (cellData && (cellData.obstacle === 'wall' || cellData.obstacle === 'destructible')) {
                return false;
            }
        }

        let e2 = 2 * err;
        if (e2 > -dr) { err -= dr; currC += sc; }
        if (e2 < dc) { err += dc; currR += sr; }
    }
}

// ============================================================================
// ЧАСТЬ 3 ИЗ 3: ТРАССИРОВКА ЛУЧЕЙ ВИДИМОСТИ (LOS) СКВОЗЬ ТОНКИЕ ГРАНИ
// ============================================================================

/**
 * Алгоритм Брезенхэма для вычисления линии видимости (LOS) сквозь стены и чащу леса
 * Сверхточная проверка тонких межклеточных разделителей (стены поглощают, окна пропускают ауры)
 */
function checkLineOfSight(r1, c1, r2, c2) {
    if (r1 === r2 && c1 === c2) return true;
    let dr = Math.abs(r2 - r1), dc = Math.abs(c2 - c1);
    let sr = (r1 < r2) ? 1 : -1, sc = (c1 < c2) ? 1 : -1;
    let err = dc - dr;
    let currR = r1, currC = c1;

    while (true) {
        let prevR = currR;
        let prevC = currC;

        if (currR === r2 && currC === c2) return true;

        // Вычисляем координаты следующего шага луча
        let e2 = 2 * err;
        if (e2 > -dr) { err -= dr; currC += sc; }
        if (e2 < dc) { err += dc; currR += sr; }

        // КРИТИЧЕСКАЯ ПРОВЕРКА: Пересекает ли луч тонкую капитальную стену на стыке клеток?
        const cKey = `square_${prevR}_${prevC}`;
        const nKey = `square_${currR}_${currC}`;
        const cData = this.state.campMapData[cKey];
        const nData = this.state.campMapData[nKey];

        const cBorders = (cData && cData.borders) ? cData.borders : [];
        const nBorders = (nData && nData.borders) ? nData.borders : [];

        // Проверка поглощения луча глухими тонкими стенами (-wall)
        if (currR === prevR - 1 && currC === prevC) { // Луч пошел вверх
            if (cBorders.includes('top-wall') || nBorders.includes('bottom-wall')) return false;
        }
        if (currR === prevR + 1 && currC === prevC) { // Луч пошел вниз
            if (cBorders.includes('bottom-wall') || nBorders.includes('top-wall')) return false;
        }
        if (currR === prevR && currC === prevC - 1) { // Луч пошел влево
            if (cBorders.includes('left-wall') || nBorders.includes('right-wall')) return false;
        }
        if (currR === prevR && currC === prevC + 1) { // Луч пошел вправо
            if (cBorders.includes('right-wall') || nBorders.includes('left-wall')) return false;
        }

        // Диагональные направления среза луча (проверяем обе смежные глухие стены)
        if (currR === prevR - 1 && currC === prevC - 1) { // На Северо-Запад
            if (cBorders.includes('top-wall') || cBorders.includes('left-wall')) return false;
            if (nBorders.includes('bottom-wall') || nBorders.includes('right-wall')) return false;
        }
        if (currR === prevR - 1 && currC === prevC + 1) { // На Северо-Восток
            if (cBorders.includes('top-wall') || cBorders.includes('right-wall')) return false;
            if (nBorders.includes('bottom-wall') || nBorders.includes('left-wall')) return false;
        }
        if (currR === prevR + 1 && currC === prevC - 1) { // На Юго-Запад
            if (cBorders.includes('bottom-wall') || cBorders.includes('left-wall')) return false;
            if (nBorders.includes('top-wall') || nBorders.includes('right-wall')) return false;
        }
        if (currR === prevR + 1 && currC === prevC + 1) { // На Юго-Восток
            if (currBorders = cBorders.includes('bottom-wall') || cBorders.includes('right-wall')) return false;
            if (nBorders.includes('top-wall') || nBorders.includes('left-wall')) return false;
        }

        // Стандартная объемная проверка капитального ландшафта (блокируют только wall и forest)
        if (nData && (nData.obstacle === 'wall' || nData.obstacle === 'forest')) {
            // Если луч дошел до конечной цели, то преграды на ней самой не мешают ее увидеть
            if (currR !== r2 || currC !== c2) return false;
        }
    }
}




/**
 * Поиск кратчайшего пути (Алгоритм Дейкстры) с учетом 3-х действий на ход.
 * Часть 2 из 3: Интеграция проверки пересечения тонких разделительных стен и окон на гранях клеток.
 */
function calculatePathAndCost(startId, targetId, speedLimit) {
    const parseCoords = (id) => {
        const p = id.split('_');
        if (p.length === 3) {
            return { r: parseInt(p, 10), c: parseInt(p, 10) };
        }
        return { r: parseInt(p, 10), c: parseInt(p, 10) };
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

        // Хелпер проверки: стоит ли тонкая стена/окно между текущей (curr) и соседней (nr, nc) клетками
        const hasWallBetween = (r1, c1, r2, c2) => {
            const cKey = `square_${r1}_${c1}`;
            const nKey = `square_${r2}_${c2}`;
            const cData = this.state.campMapData[cKey];
            const nData = this.state.campMapData[nKey];

            const cBorders = (cData && cData.borders) ? cData.borders : [];
            const nBorders = (nData && nData.borders) ? nData.borders : [];

            // Ортогональные проверки (прямые шаги)
            if (r2 === r1 - 1 && c2 === c1) { // Шаг вверх (North)
                if (cBorders.some(b => b.startsWith('top'))) return true;
                if (nBorders.some(b => b.startsWith('bottom'))) return true;
            }
            if (r2 === r1 + 1 && c2 === c1) { // Шаг вниз (South)
                if (cBorders.some(b => b.startsWith('bottom'))) return true;
                if (nBorders.some(b => b.startsWith('top'))) return true;
            }
            if (r2 === r1 && c2 === c1 - 1) { // Шаг влево (West)
                if (cBorders.some(b => b.startsWith('left'))) return true;
                if (nBorders.some(b => b.startsWith('right'))) return true;
            }
            if (r2 === r1 && c2 === c1 + 1) { // Шаг вправо (East)
                if (cBorders.some(b => b.startsWith('right'))) return true;
                if (nBorders.some(b => b.startsWith('left'))) return true;
            }

            // Диагональные проверки (проверяем обе грани, через которые проходит срез)
            if (r2 === r1 - 1 && c2 === c1 - 1) { // На Северо-Запад
                if (cBorders.some(b => b.startsWith('top') || b.startsWith('left'))) return true;
                if (nBorders.some(b => b.startsWith('bottom') || b.startsWith('right'))) return true;
            }
            if (r2 === r1 - 1 && c2 === c1 + 1) { // На Северо-Восток
                if (cBorders.some(b => b.startsWith('top') || b.startsWith('right'))) return true;
                if (nBorders.some(b => b.startsWith('bottom') || b.startsWith('left'))) return true;
            }
            if (r2 === r1 + 1 && c2 === c1 - 1) { // На Юго-Запад
                if (cBorders.some(b => b.startsWith('bottom') || b.startsWith('left'))) return true;
                if (nBorders.some(b => b.startsWith('top') || b.startsWith('right'))) return true;
            }
            if (r2 === r1 + 1 && c2 === c1 + 1) { // На Юго-Восток
                if (cBorders.some(b => b.startsWith('bottom') || b.startsWith('right'))) return true;
                if (nBorders.some(b => b.startsWith('top') || b.startsWith('left'))) return true;
            }
            return false;
        };

        // 1. НАПРАВЛЕНИЯ ДЛЯ ХОДЬБЫ
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

            // Проверка тонкой разделительной преграды пешком (блокирует и стены, и окна)
            if (hasWallBetween(curr.r, curr.c, nr, nc)) continue;

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

            let checkR = curr.r;
            let checkC = curr.c;

            for (let i = 1; i < jumpCellsCount; i++) {
                const nextR = curr.r + (jt.dr * i);
                const nextC = curr.c + (jt.dc * i);

                // Проверяем, нет ли на линии перелета тонкой капитальной СТЕНЫ (окна перепрыгнуть можно)
                // Для этого сканируем границы по ходу движения луча прыжка
                if (jt.dr === -1 && this.state.campMapData[`square_${checkR}_${checkC}`]?.borders?.includes('top-wall')) blockerInPath = true;
                if (jt.dr === 1 && this.state.campMapData[`square_${checkR}_${checkC}`]?.borders?.includes('bottom-wall')) blockerInPath = true;
                if (jt.dc === -1 && this.state.campMapData[`square_${checkR}_${checkC}`]?.borders?.includes('left-wall')) blockerInPath = true;
                if (jt.dc === 1 && this.state.campMapData[`square_${checkR}_${checkC}`]?.borders?.includes('right-wall')) blockerInPath = true;

                checkR = nextR;
                checkC = nextC;

                const checkData = this.state.campMapData[`square_${nextR}_${nextC}`];
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
}






function clearVisualPath() {
    document.querySelectorAll('.tactical-square').forEach(cell => {
        cell.classList.remove(
            'path-cell',
            'path-cell-jump',
            'path-cell-jump-start',
            'path-cell-jump-land'
        );

        const costLabel = cell.querySelector('.square-path-cost');
        if (costLabel) {
            costLabel.textContent = '';
            costLabel.style.color = '';
        }
    });
}

function handleTacticalSquareClick(squareId) {
    if (modal.classList.contains('open') || (campModal && campModal.classList.contains('open'))) {
        closeCampMenu();
        return;
    }

    const data = campMapData[squareId];
    const squareElement = document.getElementById('visual_' + squareId);
    if (!squareElement) return;

    if (data && (data.heroHere || data.monsterHere)) {
        if (focusedEntityId === squareId) {
            squareElement.classList.remove('focused-entity');
            focusedEntityId = null;
            clearVisualPath();
        } else {
            if (focusedEntityId) {
                const oldFocused = document.getElementById('visual_' + focusedEntityId);
                if (oldFocused) oldFocused.classList.remove('focused-entity');
            }
            focusedEntityId = squareId;
            squareElement.classList.add('focused-entity');
            clearVisualPath();
        }
    } else {
        openTacticalMenu(squareId);
    }
}
