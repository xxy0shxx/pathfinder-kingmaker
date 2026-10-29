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

    } else if (mode === 'camp') {
        mapImg.src = campParams.src;
        mapContainer.style.width = campParams.width + 'px';
        mapContainer.style.height = campParams.height + 'px';
        mapImg.style.width = campParams.width + 'px';
        mapImg.style.height = campParams.height + 'px';

        if (hexLayer) hexLayer.style.display = 'none';
        if (gridLayer) {
            gridLayer.style.display = 'grid';
            if (gridLayer.children.length === 0) {
                buildTacticalGrid();
            }
        }

        const clickableMap = document.getElementById('clickableMap');
        if (clickableMap) clickableMap.style.display = 'none';
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

            if (!campMapData[squareId] || (!campMapData[squareId].explored && !campMapData[squareId].hasVisited)) {
                square.classList.add('fog-active');
            }

            if (campMapData[squareId] && campMapData[squareId].color && campMapData[squareId].color !== 'transparent') {
                square.style.backgroundColor = convertHexToRgba(campMapData[squareId].color, 0.37);
            }

            square.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (hasMoved) return;

                if (modal.classList.contains('open')) {
                    closeMenu();
                } else {
                    openTacticalMenu(squareId);
                }
            });

            bindTacticalTooltip(square, squareId);

            gridLayer.appendChild(square);
        }
    }
}

function openTacticalMenu(squareId) {
    currentHexId = squareId; // Используем глобальную переменную как указатель текущего ID ячейки

    const inpExplored = document.getElementById('inpExplored');
    const inpMapMapped = document.getElementById('inpMapMapped');
    const inpSquadHere = document.getElementById('inpSquadHere');
    const inpType = document.getElementById('inpType');
    const inpTerrain = document.getElementById('inpTerrain');
    const inpRegionLevel = document.getElementById('inpRegionLevel');
    const inpColor = document.getElementById('inpColor');

    let currentColor = 'transparent';

    if (campMapData[squareId]) {
        document.getElementById('inpTitle').value = campMapData[squareId].title || '';
        document.getElementById('inpDesc').value = campMapData[squareId].text || '';
        if (difficultySelect) difficultySelect.value = campMapData[squareId].difficulty || '';
        if (inpExplored) inpExplored.checked = !!campMapData[squareId].explored;
        if (inpMapMapped) inpMapMapped.checked = !!campMapData[squareId].mapMapped;
        if (inpType) inpType.value = campMapData[squareId].type || '';
        if (inpTerrain) inpTerrain.value = campMapData[squareId].terrain || '';
        if (inpRegionLevel) inpRegionLevel.value = campMapData[squareId].regionLevel || '';
        currentColor = campMapData[squareId].color || 'transparent';
    } else {
        document.getElementById('inpTitle').value = '';
        document.getElementById('inpDesc').value = '';
        if (difficultySelect) difficultySelect.value = '';
        if (inpExplored) inpExplored.checked = false;
        if (inpMapMapped) inpMapMapped.checked = false;
        if (inpType) inpType.value = '';
        if (inpTerrain) inpTerrain.value = '';
        if (inpRegionLevel) inpRegionLevel.value = '';
    }

    if (inpSquadHere) inpSquadHere.checked = campMapData[squareId] ? !!campMapData[squareId].squadHere : false;
    if (inpColor) inpColor.value = currentColor;

    document.querySelectorAll('.color-preset-btn').forEach(btn => {
        btn.classList.remove('active');
        if (currentColor === 'transparent' && btn.classList.contains('transparent-preset')) {
            btn.classList.add('active');
        } else if (btn.style.backgroundColor === convertHexToRgbStandard(currentColor)) {
            btn.classList.add('active');
        }
    });

    modal.classList.add('open');
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
    const titleVal = document.getElementById('inpTitle').value;
    const descVal = document.getElementById('inpDesc').value;
    const colorVal = document.getElementById('inpColor').value || 'transparent';
    const diffVal = difficultySelect ? difficultySelect.value : '';
    const exploredVal = document.getElementById('inpExplored').checked;
    const mapMappedVal = document.getElementById('inpMapMapped').checked;
    const squadHereVal = document.getElementById('inpSquadHere').checked;
    const typeVal = document.getElementById('inpType').value;
    const terrainVal = document.getElementById('inpTerrain').value;
    const regionLevelVal = document.getElementById('inpRegionLevel').value;

    const squareElement = document.getElementById('visual_' + id);

    if (squareElement) {
        if (exploredVal) {
            squareElement.classList.remove('fog-active');
        } else {
            squareElement.classList.add('fog-active');
        }

        // Подсветка отряда
        if (squadHereVal) {
            squareElement.classList.add('squad-dark');
        } else {
            squareElement.classList.remove('squad-dark');
        }

        if (colorVal !== 'transparent') {
            squareElement.style.backgroundColor = convertHexToRgba(colorVal, 0.37);
        } else {
            squareElement.style.backgroundColor = '';
        }
    }

    campMapData[id] = {
        title: titleVal,
        text: descVal,
        color: colorVal,
        difficulty: diffVal,
        explored: exploredVal,
        mapMapped: mapMappedVal,
        squadHere: squadHereVal,
        type: typeVal,
        terrain: terrainVal,
        regionLevel: regionLevelVal,
        hasVisited: squadHereVal || (campMapData[id] && campMapData[id].hasVisited),
        lastSaved: new Date().toLocaleString()
    };

    localStorage.setItem('campMapSystemData', JSON.stringify(campMapData));
    closeMenu();
}

function deleteTacticalSquare() {
    const id = currentHexId;
    delete campMapData[id];
    localStorage.setItem('campMapSystemData', JSON.stringify(campMapData));

    const squareElement = document.getElementById('visual_' + id);
    if (squareElement) {
        squareElement.classList.add('fog-active');
        squareElement.classList.remove('squad-dark');
        squareElement.style.backgroundColor = '';
    }
    closeMenu();
}

function bindTacticalTooltip(square, squareId) {
    const tooltip = document.getElementById('hexTooltip');
    if (!tooltip) return;

    square.addEventListener('mouseenter', () => {
        if (campMapData[squareId] && (campMapData[squareId].title || campMapData[squareId].text)) {
            const data = campMapData[squareId];
            let content = `<div class="tooltip-title">⛺ ${data.title || 'Квадрат ' + squareId}</div>`;

            let paramsBlock = '';
            paramsBlock += `<div>${data.explored ? '🔍 <b>Разведан</b>' : '❌ <b>Не изучен</b>'}</div>`;
            if (data.squadHere) paramsBlock += `<div style="color: #ff7675;">🚩 <b>Отряд здесь</b></div>`;
            if (data.text) paramsBlock += `<div style="margin-top: 8px; border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 8px;" class="tooltip-desc">${data.text.replace(/\n/g, '<br>')}</div>`;

            tooltip.innerHTML = content + paramsBlock;
            tooltip.style.display = 'block';
        }
    });

    square.addEventListener('mousemove', (e) => {
        tooltip.style.left = (e.clientX + 25) + 'px';
        tooltip.style.top = (e.clientY + 25) + 'px';
    });

    square.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
        tooltip.innerHTML = '';
    });
}
