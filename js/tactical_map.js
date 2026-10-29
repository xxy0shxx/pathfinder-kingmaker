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
    const btnGlobal = document.getElementById('btnMapGlobal');
    const btnCamp = document.getElementById('btnMapCamp');

    if (!btnGlobal || !btnCamp) return;

    btnGlobal.addEventListener('click', () => {
        if (currentMapMode === 'global') return;
        switchMapMode('global');
        btnGlobal.classList.add('active');
        btnCamp.classList.remove('active');
    });

    btnCamp.addEventListener('click', () => {
        if (currentMapMode === 'camp') return;
        switchMapMode('camp');
        btnCamp.classList.add('active');
        btnGlobal.classList.remove('active');
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

function buildTacticalGrid() {
    const gridLayer = document.getElementById('tacticalGridLayer');
    if (!gridLayer) return;

    gridLayer.innerHTML = '';

    const realGridWidth = campParams.cols * campParams.squareSize;
    const realGridHeight = campParams.rows * campParams.squareSize;

    gridLayer.style.width = realGridWidth + 'px';
    gridLayer.style.height = realGridHeight + 'px';

    gridLayer.style.left = campParams.offsetX + 'px';
    gridLayer.style.top = campParams.offsetY + 'px';

    gridLayer.style.gridTemplateColumns = `repeat(${campParams.cols}, ${campParams.squareSize}px)`;
    gridLayer.style.gridTemplateRows = `repeat(${campParams.rows}, ${campParams.squareSize}px)`;

    for (let r = 0; r < campParams.rows; r++) {
        for (let c = 0; c < campParams.cols; c++) {
            const squareId = `square_${r}_${c}`;

            const square = document.createElement('div');
            square.className = 'tactical-square';
            square.setAttribute('id', `visual_${squareId}`);
            square.style.width = campParams.squareSize + 'px';
            square.style.height = campParams.squareSize + 'px';

            const starLabel = document.createElement('span');
            starLabel.className = 'square-star-label';
            square.appendChild(starLabel);

            const crownLabel = document.createElement('span');
            crownLabel.className = 'square-crown-label';
            crownLabel.setAttribute('draggable', 'true');
            square.appendChild(crownLabel);

            const monsterLabel = document.createElement('span');
            monsterLabel.className = 'square-monster-label';
            monsterLabel.setAttribute('draggable', 'true');
            square.appendChild(monsterLabel);

            const obstacleLabel = document.createElement('span');
            obstacleLabel.className = 'square-obstacle-label';
            square.appendChild(obstacleLabel);

            if (!campMapData[squareId] || (!campMapData[squareId].explored && !campMapData[squareId].hasVisited)) {
                square.classList.add('fog-active');
            }

            if (campMapData[squareId]) {
                starLabel.textContent = '★';
                if (campMapData[squareId].color && campMapData[squareId].color !== 'transparent') {
                    square.style.backgroundColor = convertHexToRgba(campMapData[squareId].color, 0.37);
                }
                if (campMapData[squareId].heroHere) {
                    square.classList.add('squad-dark');
                    crownLabel.textContent = '👑';
                }
            }

            square.addEventListener('click', function (e) {
                e.preventDefault(); e.stopPropagation();
                if (hasMoved) return;
                handleTacticalSquareClick(squareId);
            });

            square.addEventListener('dblclick', function (e) {
                e.preventDefault(); e.stopPropagation();
                if (hasMoved) return;

                if (focusedEntityId === squareId) {
                    square.classList.remove('focused-entity');
                    focusedEntityId = null;
                    clearVisualPath();
                }

                openTacticalMenu(squareId);
            });

            bindDragAndDropEvents(square, squareId, crownLabel, monsterLabel);
            bindTacticalTooltip(square, squareId);
            gridLayer.appendChild(square);
        }
    }

    recalculateCampFogOfWar();
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

function saveTacticalSquare() {
    const id = currentHexId;
    if (!id) return;

    const heroHereVal = document.getElementById('inpCampHeroHere').checked;
    const monsterHereVal = document.getElementById('inpCampMonsterHere').checked;
    const obstacleVal = document.getElementById('inpCampObstacle').value; // Читаем объединенное поле
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

        if (heroHereVal) {
            squareElement.classList.add('squad-dark');
        } else {
            squareElement.classList.remove('squad-dark');
        }

        squareElement.classList.remove('monster-dark');

        if (colorVal !== 'transparent') {
            squareElement.style.backgroundColor = convertHexToRgba(colorVal, 0.37);
        } else {
            squareElement.style.backgroundColor = '';
        }
    }

    campMapData[id] = {
        heroHere: heroHereVal,
        monsterHere: monsterHereVal,
        obstacle: obstacleVal,
        measurement: measurementVal,
        distance: distanceVal,
        direction: directionVal,
        color: colorVal,
        speed: speedVal,
        explored: true,
        hasVisited: heroHereVal || (campMapData[id] && campMapData[id].hasVisited),
        lastSaved: new Date().toLocaleString()
    };

    localStorage.setItem('campMapSystemData', JSON.stringify(campMapData));
    recalculateCampFogOfWar();
    closeCampMenu();
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

function openTacticalMenu(squareId) {
    currentHexId = squareId;

    const inpObstacle = document.getElementById('inpCampObstacle');
    const inpHeroHere = document.getElementById('inpCampHeroHere');
    const inpMonsterHere = document.getElementById('inpCampMonsterHere');
    const inpMeasurement = document.getElementById('inpCampMeasurement');
    const inpDistance = document.getElementById('inpCampDistance');
    const inpColor = document.getElementById('inpCampColor');

    let currentColor = 'transparent';

    if (campMapData[squareId]) {
        if (inpHeroHere) inpHeroHere.checked = !!campMapData[squareId].heroHere;
        if (inpMonsterHere) inpMonsterHere.checked = !!campMapData[squareId].monsterHere;
        if (inpMeasurement) inpMeasurement.value = campMapData[squareId].measurement || '';
        if (inpDistance) inpDistance.value = campMapData[squareId].distance || '5';
        currentColor = campMapData[squareId].color || 'transparent';
        if (inpObstacle) inpObstacle.value = campMapData[squareId].obstacle || '';
        document.getElementById('inpCampSpeed').value = campMapData[squareId].speed || '30';
        document.getElementById('inpCampDistance').value = campMapData[squareId].distance || '30';
    } else {
        if (inpHeroHere) inpHeroHere.checked = false;
        if (inpMonsterHere) inpMonsterHere.checked = false;
        if (inpMeasurement) inpMeasurement.value = '';
        if (inpDistance) inpDistance.value = '5';
        if (inpObstacle) inpObstacle.value = '';
        document.getElementById('inpCampSpeed').value = '30';
        document.getElementById('inpCampDistance').value = '30';
    }

    if (inpColor) inpColor.value = currentColor;

    const container = document.getElementById('campColorPresetsContainer');
    if (container) {
        container.querySelectorAll('.color-preset-btn').forEach(btn => {
            btn.classList.remove('active');
            if (currentColor === 'transparent' && btn.classList.contains('transparent-preset')) {
                btn.classList.add('active');
            } else if (btn.style.backgroundColor === convertHexToRgbStandard(currentColor)) {
                btn.classList.add('active');
            }
        });
    }

    const directionBox = document.getElementById('campDirectionBox');
    const inpDirection = document.getElementById('inpCampDirection');
    if (directionBox && inpDirection) {
        if (campMapData[squareId] && campMapData[squareId].measurement === 'cone') {
            directionBox.style.display = 'block';
            inpDirection.value = campMapData[squareId].direction || 'N';
        } else {
            directionBox.style.display = 'none';
            inpDirection.value = 'N';
        }
    }

    if (campModal) campModal.classList.add('open');
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

function calculatePathAndCost(startId, targetId, speedLimit) {
    if (!startId || !targetId) return null;

    const parseCoords = (id) => {
        const parts = id.split('_');
        return { r: parseInt(parts[1], 10), c: parseInt(parts[2], 10) };
    };

    const start = parseCoords(startId);
    const target = parseCoords(targetId);

    const queue = [];
    const distances = {};
    const parents = {};
    const jumpFlags = {};

    const startKey = `${start.r}_${start.c}`;
    distances[startKey] = { feet: 0, actions: 0, currentActionSpentFeet: 0, cameByJump: false, jumpsCount: 0 };
    queue.push({ r: start.r, c: start.c, actions: 0, feet: 0, cameByJump: false, jumpsCount: 0 });

    while (queue.length > 0) {
        queue.sort((a, b) => {
            if (a.actions !== b.actions) return a.actions - b.actions;
            if (a.jumpsCount !== b.jumpsCount) return b.jumpsCount - a.jumpsCount; // Больше прыжков в начале пути = выше приоритет
            return a.feet - b.feet;
        });

        const curr = queue.shift();
        const currKey = `${curr.r}_${curr.c}`;
        const currState = distances[currKey];

        if (curr.r === target.r && curr.c === target.c) break;
        if (curr.actions > currState.actions || (curr.actions === currState.actions && curr.feet > currState.feet)) continue;

        const neighbors = [
            { r: curr.r - 1, c: curr.c },
            { r: curr.r + 1, c: curr.c },
            { r: curr.r, c: curr.c - 1 },
            { r: curr.r, c: curr.c + 1 }
        ];

        for (let n of neighbors) {
            if (n.r < 0 || n.r >= campParams.rows || n.c < 0 || n.c >= campParams.cols) continue;

            const nId = `square_${n.r}_${n.c}`;
            const nKey = `${n.r}_${n.c}`;
            const nData = campMapData[nId];

            if (nData && (nData.obstacle === 'wall' || nData.obstacle === 'destructible' || nData.obstacle === 'stones')) continue;

            let stepCost = (nData && ['bushes', 'forest',].includes(nData.obstacle)) ? 10 : 5;
            let nextActions = currState.actions;
            let nextSpentFeet = currState.currentActionSpentFeet + stepCost;

            if (currState.currentActionSpentFeet === 0 || nextSpentFeet > speedLimit) {
                nextActions += 1;
                nextSpentFeet = stepCost;
                if (stepCost > speedLimit) continue;
            }

            let nextTotalFeet = currState.feet + stepCost;
            const nextState = {
                feet: nextTotalFeet,
                actions: nextActions,
                currentActionSpentFeet: nextSpentFeet,
                cameByJump: false,
                jumpsCount: currState.jumpsCount
            };

            if (distances[nKey] === undefined ||
                nextState.actions < distances[nKey].actions ||
                (nextState.actions === distances[nKey].actions && nextState.jumpsCount > distances[nKey].jumpsCount) ||
                (nextState.actions === distances[nKey].actions && nextState.jumpsCount === distances[nKey].jumpsCount && nextState.feet < distances[nKey].feet)) {

                distances[nKey] = nextState;
                parents[nKey] = { parentKey: currKey, isJump: false };
                queue.push({ r: n.r, c: n.c, actions: nextActions, feet: nextTotalFeet, cameByJump: false, jumpsCount: currState.jumpsCount });
            }
        }

        if (curr.cameByJump) continue;

        const jumpCellsCount = (speedLimit >= 30) ? 3 : 2;
        const jumpFeetDist = jumpCellsCount * 5;

        const jumpTargets = [
            { r: curr.r - jumpCellsCount, c: curr.c, dr: -1, dc: 0 },
            { r: curr.r + jumpCellsCount, c: curr.c, dr: 1, dc: 0 },
            { r: curr.r, c: curr.c - jumpCellsCount, dr: 0, dc: -1 },
            { r: curr.r, c: curr.c + jumpCellsCount, dr: 0, dc: 1 }
        ];

        for (let jt of jumpTargets) {
            if (jt.r < 0 || jt.r >= campParams.rows || jt.c < 0 || jt.c >= campParams.cols) continue;

            const targetCellId = `square_${jt.r}_${jt.c}`;
            const targetCellKey = `${jt.r}_${jt.c}`;
            const targetData = campMapData[targetCellId];

            if (targetData && (targetData.obstacle === 'wall' || targetData.obstacle === 'destructible')) continue;

            let obstacleInPath = false;
            for (let i = 1; i < jumpCellsCount; i++) {
                const checkR = curr.r + (jt.dr * i);
                const checkC = curr.c + (jt.dc * i);
                const checkId = `square_${checkR}_${checkC}`;
                const checkData = campMapData[checkId];
                if (checkData && checkData.obstacle && checkData.obstacle !== '') {
                    obstacleInPath = true;
                    break;
                }
            }

            if (!obstacleInPath) continue;

            let nextActions = currState.actions + 1;
            let nextSpentFeet = 0;
            let nextTotalFeet = currState.feet + jumpFeetDist;
            let nextJumpsCount = currState.jumpsCount + 1;

            const nextState = {
                feet: nextTotalFeet,
                actions: nextActions,
                currentActionSpentFeet: nextSpentFeet,
                cameByJump: true,
                jumpsCount: nextJumpsCount
            };

            if (distances[targetCellKey] === undefined ||
                nextState.actions < distances[targetCellKey].actions ||
                (nextState.actions === distances[targetCellKey].actions && nextState.jumpsCount > distances[targetCellKey].jumpsCount) ||
                (nextState.actions === distances[targetCellKey].actions && nextState.jumpsCount === distances[targetCellKey].jumpsCount && nextState.feet < distances[targetCellKey].feet)) {

                distances[targetCellKey] = nextState;
                parents[targetCellKey] = { parentKey: currKey, isJump: true };
                queue.push({ r: jt.r, c: jt.c, actions: nextActions, feet: nextTotalFeet, cameByJump: true, jumpsCount: nextJumpsCount });
            }
        }
    }

    const targetKey = `${target.r}_${target.c}`;
    if (distances[targetKey] === undefined) return null;

    const pathCells = [];
    let currentKey = targetKey;
    let currNode = parents[currentKey];

    pathCells.push(targetKey);

    while (currNode) {
        if (currNode.isJump) {
            jumpFlags[currentKey] = 'land';
            jumpFlags[currNode.parentKey] = 'start';
        }
        currentKey = currNode.parentKey;
        pathCells.push(currentKey);
        currNode = parents[currentKey];
    }
    pathCells.reverse();

    return {
        cells: pathCells,
        jumpFlags: jumpFlags,
        totalFeet: distances[targetKey].feet,
        actions: distances[targetKey].actions
    };
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
