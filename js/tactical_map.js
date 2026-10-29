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
//            if (gridLayer.children.length === 0) {
                buildTacticalGrid();
//            }
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
            square.appendChild(crownLabel);

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
                if (modal.classList.contains('open')) closeMenu();
                else openTacticalMenu(squareId);
            });

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
    const measurementVal = document.getElementById('inpCampMeasurement').value;
    const distanceVal = document.getElementById('inpCampDistance').value;
    const colorVal = document.getElementById('inpCampColor').value || 'transparent';
    const directionVal = document.getElementById('inpCampDirection').value;

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

        if (colorVal !== 'transparent') {
            squareElement.style.backgroundColor = convertHexToRgba(colorVal, 0.37);
        } else {
            squareElement.style.backgroundColor = '';
        }
    }

    campMapData[id] = {
        heroHere: heroHereVal,
        measurement: measurementVal,
        distance: distanceVal,
        direction: directionVal,
        color: colorVal,
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
    }

    recalculateCampFogOfWar();
    closeCampMenu();
}

function bindTacticalTooltip(square, squareId) {
    const tooltip = document.getElementById('hexTooltip');
    if (!tooltip) return;

    square.addEventListener('mouseenter', () => {
        if (campMapData[squareId] && (campMapData[squareId].heroHere || campMapData[squareId].measurement || campMapData[squareId].color)) {
            const data = campMapData[squareId];

            let content = `<div class="tooltip-title">🔳 Клетка ${squareId.replace('square_', '[')}]</div>`;

            let paramsBlock = '<div style="font-size: 16px; color: #ccc; margin: 8px 0 12px 0; line-height: 1.4;">';

            if (data.heroHere) {
                paramsBlock += `<div style="margin-bottom: 6px; color: #ff7675;">👑 <b>Герой в клетке</b></div>`;
            }

            if (data.measurement) {
                let typeText = '';
                let typeIcon = '';

                if (data.measurement === 'radius') {
                    typeText = 'Радиус';
                    typeIcon = '⭕';
                } else if (data.measurement === 'diameter') {
                    typeText = 'Диаметр';
                    typeIcon = '↔️';
                } else if (data.measurement === 'cone') {
                    typeText = 'Конус';
                    typeIcon = '📐';
                }

                const ft = data.distance || '5';
                paramsBlock += `<div style="margin-bottom: 4px;">${typeIcon} <b>Зона действия:</b> ${typeText} (${ft} фт.)</div>`;

                if (data.measurement === 'cone' && data.direction) {
                    let dirText = '';
                    switch (data.direction) {
                        case 'N':  dirText = '⬆️ Север'; break;
                        case 'NE': dirText = '↗️ Северо-Восток'; break;
                        case 'E':  dirText = '➡️ Восток'; break;
                        case 'SE': dirText = '↘️ Юго-Восток'; break;
                        case 'S':  dirText = '⬇️ Юг'; break;
                        case 'SW': dirText = '↙️ Юго-Запад'; break;
                        case 'W':  dirText = '⬅️ Запад'; break;
                        case 'NW': dirText = '↖️ Северо-Запад'; break;
                        default:   dirText = data.direction;
                    }
                    paramsBlock += `<div style="margin-bottom: 4px; padding-left: 24px; color: #dfbc6f;">🧭 <b>Направление:</b> ${dirText}</div>`;
                }
            }

            if (data.lastSaved) {
                paramsBlock += `<div style="margin-top: 8px; font-size: 12px; color: #888; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 4px;">🛡️ Изменено: ${data.lastSaved}</div>`;
            }

            paramsBlock += '</div>';

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

    const inpHeroHere = document.getElementById('inpCampHeroHere');
    const inpMeasurement = document.getElementById('inpCampMeasurement');
    const inpDistance = document.getElementById('inpCampDistance');
    const inpColor = document.getElementById('inpCampColor');

    let currentColor = 'transparent';

    if (campMapData[squareId]) {
        if (inpHeroHere) inpHeroHere.checked = !!campMapData[squareId].heroHere;
        if (inpMeasurement) inpMeasurement.value = campMapData[squareId].measurement || '';
        if (inpDistance) inpDistance.value = campMapData[squareId].distance || '5';
        currentColor = campMapData[squareId].color || 'transparent';
    } else {
        if (inpHeroHere) inpHeroHere.checked = false;
        if (inpMeasurement) inpMeasurement.value = '';
        if (inpDistance) inpDistance.value = '5';
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
                // Если туман включен — работает стандартная логика скрытия
                if (savedData && savedData.explored) {
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
        }
    }

    for (let id in campMapData) {
        const data = campMapData[id];
        if (data && data.heroHere) {
            const squareElement = document.getElementById('visual_' + id);
            if (squareElement) {
                const crown = squareElement.querySelector('.square-crown-label');
                if (crown) crown.textContent = '👑'; // Рисуем корону герою
            }

            if (data.measurement && data.distance) {
                const parts = id.split('_');
                const centerR = parseInt(parts[1]);
                const centerC = parseInt(parts[2]);

                const ftDistance = parseInt(data.distance) || 5;
                let cellRadius = Math.round(ftDistance / 5);

                if (data.measurement === 'diameter') {
                    cellRadius = Math.round((ftDistance / 2) / 5);
                }

                if (cellRadius <= 0) continue;

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
                                const targetId = `square_${r}_${c}`;

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
    }

    for (let targetId in cellAuras) {
        const targetElement = document.getElementById('visual_' + targetId);
        if (!targetElement) continue;

        if (isCampFogEnabled) {
            targetElement.classList.remove('fog-active');
        }

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
});
