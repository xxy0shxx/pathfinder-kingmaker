import SoundPlayer from '../js/sound_player.js';
import FileManager from '../js/file_manager.js';
import QuestManager from '../js/quest_manager.js';
import HexManager from '../js/hex_manager.js';
import ViewportManager from '../js/viewport_manager.js';
import UiSelectManager from '../js/ui_select_manager.js';

const hexRadius = 77.96;

let isDragging = false;
let hasMoved = false;

const visualLayer = document.getElementById('visualLayer');
const modal = document.getElementById('hexMenu');
const difficultySelect = document.getElementById('inpDifficulty');

let currentHexId = null;
let mapData = JSON.parse(localStorage.getItem('hexMapSystemData')) || {};

// ============================================================================
// ИНИЦИАЛИЗАЦИЯ ИНТЕРФЕЙСА
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    groupMenuFields();
    SoundPlayer.init();
    initColorPresets();
    UiSelectManager.init();

    ViewportManager.init();
    HexManager.init(mapData, openMenu);
    HexManager.buildGrid(() => hasMoved);
    QuestManager.init(mapData, focusOnHex);

    FileManager.init((importedData) => {
        mapData = importedData;

        QuestManager.updateMapData(mapData);

        HexManager.updateMapData(mapData);
        HexManager.buildGrid(() => hasMoved);
    });

    const btnDeleteEl = document.getElementById('btnDelete');
    const btnCancelEl = document.getElementById('btnCancel');
    const btnSaveEl = document.getElementById('btnSave');

    let buttonsContainer = document.querySelector('.buttons');
    if (buttonsContainer && btnDeleteEl && btnCancelEl && btnSaveEl) {
        buttonsContainer.innerHTML = '';

        const boxWrapper = document.createElement('div');
        boxWrapper.className = 'box';
        boxWrapper.style.width = '100%';
        boxWrapper.style.display = 'flex';
        boxWrapper.style.gap = '15px';
        boxWrapper.appendChild(btnDeleteEl);
        boxWrapper.appendChild(btnCancelEl);
        boxWrapper.appendChild(btnSaveEl);

        buttonsContainer.appendChild(boxWrapper);
    }

    initUnifiedUICollapse();

    const btnToggleMapMode = document.getElementById('btnToggleMapMode');
    if (btnToggleMapMode) {
        let currentMode = 'global';

        btnToggleMapMode.addEventListener('click', () => {
            if (currentMode === 'global') {
                currentMode = 'camp';
                btnToggleMapMode.innerHTML = '⛺';
                btnToggleMapMode.title = 'Переключить на глобальную карту';
                btnToggleMapMode.style.background = 'linear-gradient(180deg, #42351f 0%, #292011 100%)';
                btnToggleMapMode.style.borderColor = '#543e0d';
                btnToggleMapMode.style.color = '#ebd291';
            } else {
                currentMode = 'global';
                btnToggleMapMode.innerHTML = '🗺️';
                btnToggleMapMode.title = 'Переключить на карту лагеря';
                btnToggleMapMode.style.background = 'linear-gradient(180deg, #4f5d65 0%, #2c3539 100%)';
                btnToggleMapMode.style.borderColor = '#d4af37';
                btnToggleMapMode.style.color = '#d1d8e0';
            }
        });
    }

    const btnToggleTooltips = document.createElement('button');
    btnToggleTooltips.type = 'button';
    btnToggleTooltips.id = 'btnToggleTooltips';
    btnToggleTooltips.className = 'btn-ui-toggle';
    btnToggleTooltips.innerHTML = '✨';
    btnToggleTooltips.title = 'Скрыть/Показать тултипы квестов';

    btnToggleTooltips.style.setProperty('position', 'fixed', 'important');
    btnToggleTooltips.style.setProperty('right', '96px', 'important');
    btnToggleTooltips.style.setProperty('bottom', '-160px', 'important');
    btnToggleTooltips.style.setProperty('width', '46px', 'important');
    btnToggleTooltips.style.setProperty('height', '44px', 'important');
    btnToggleTooltips.style.setProperty('z-index', '10005', 'important');
    btnToggleTooltips.style.setProperty('display', 'flex', 'important');
    btnToggleTooltips.style.setProperty('align-items', 'center', 'important');
    btnToggleTooltips.style.setProperty('justify-content', 'center', 'important');
    btnToggleTooltips.style.setProperty('border-radius', '4px', 'important');
    btnToggleTooltips.style.setProperty('cursor', 'pointer', 'important');
    btnToggleTooltips.style.setProperty('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.5)', 'important');
    btnToggleTooltips.style.setProperty('background', 'linear-gradient(180deg, #1e3c27 0%, #112417 100%)', 'important');
    btnToggleTooltips.style.setProperty('border', '1px solid #3e6349', 'important');
    btnToggleTooltips.style.setProperty('color', '#dfbc6f', 'important');
    btnToggleTooltips.style.setProperty('opacity', '0', 'important');
    btnToggleTooltips.style.setProperty('pointer-events', 'none', 'important');
    btnToggleTooltips.style.setProperty('transition', 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)', 'important');

    document.body.appendChild(btnToggleTooltips);

    btnToggleTooltips.addEventListener('click', () => {
        const visualLayerEl = document.getElementById('visualLayer');
        if (!visualLayerEl) return;

        const isHidden = visualLayerEl.classList.toggle('hide-quest-tooltips');

        const miniTooltips = visualLayerEl.querySelectorAll('.hex-quest-mini-tooltip');
        miniTooltips.forEach(tooltip => {
            tooltip.style.setProperty('display', isHidden ? 'none' : 'block', 'important');
        });

        if (!isHidden) {
            btnToggleTooltips.style.background = 'linear-gradient(180deg, #1e3c27 0%, #112417 100%)';
            btnToggleTooltips.style.borderColor = '#3e6349';
            btnToggleTooltips.style.color = '#dfbc6f';
        } else {
            btnToggleTooltips.style.background = 'linear-gradient(180deg, #5c1e1e 0%, #3a1111 100%)';
            btnToggleTooltips.style.borderColor = '#823030';
            btnToggleTooltips.style.color = '#f7baba';
        }
    });

    const legendContainer = document.querySelector('.legend-container');
    const playerContainer = document.querySelector('.music-controller');
    const legendHeader = document.querySelector('.legend-header');
    const legendContent = document.querySelector('.legend-content');

    if (legendContainer && playerContainer) {
        const playerWrapper = document.createElement('div');
        playerWrapper.className = 'music-player-monolith-wrapper';

        playerContainer.parentNode.insertBefore(playerWrapper, playerContainer);

        legendContainer.removeAttribute('style');
        playerContainer.removeAttribute('style');

        playerWrapper.appendChild(legendContainer);
        playerWrapper.appendChild(playerContainer);
    }

    if (legendContainer && legendHeader && legendContent) {
        legendContent.style.maxHeight = '0px';
        legendContent.style.overflow = 'hidden';
        legendContent.style.transition = 'max-height 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), padding 0.3s ease';

        legendHeader.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const isOpen = legendContainer.classList.toggle('open');
            const toggleBtn = legendHeader.querySelector('button');

            if (isOpen) {
                legendContent.style.maxHeight = (legendContent.scrollHeight + 35) + 'px';
                if (toggleBtn) toggleBtn.textContent = '🔽';
            } else {
                legendContent.style.maxHeight = '0px';
                if (toggleBtn) toggleBtn.textContent = '🔼';
            }
        });

        const legendBtn = legendHeader.querySelector('button');
        if (legendBtn) {
            legendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                legendHeader.click();
            });
        }
    }

    // Первичный расчет положения рамки и проявление карты
    setTimeout(() => {
        const frame = document.querySelector('.kingmaker-frame');
        if (frame) frame.style.opacity = '1';
    }, 150);
});

// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ПРИВЕДЕНИЯ ФОРМАТОВ ЦВЕТА
// ============================================================================
function convertHexToRgba(hex, alpha) {
    if (!hex || hex === 'transparent') return 'rgba(0,0,0,0)';
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
}

function convertHexToRgbStandard(hex) {
    if (hex === 'transparent' || !hex) return '';
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
}
// ============================================================================
// ФУНКЦИЯ ОТКРЫТИЯ МЕНЮ И СИНХРОНИЗАЦИИ ДАННЫХ ФОРМЫ С ХРАНИЛИЩЕМ
// ============================================================================
function openMenu(hexId) {
    currentHexId = hexId;

    const inpExplored = document.getElementById('inpExplored');
    const inpMapMapped = document.getElementById('inpMapMapped');
    const inpSquadHere = document.getElementById('inpSquadHere');
    const inpType = document.getElementById('inpType');
    const inpTerrain = document.getElementById('inpTerrain');
    const inpRegionLevel = document.getElementById('inpRegionLevel');
    const inpColor = document.getElementById('inpColor');
    const inpRumorDesc = document.getElementById('inpRumorDesc');

    let currentColor = 'transparent';

    if (mapData[hexId]) {
        if (document.getElementById('inpTitle')) document.getElementById('inpTitle').value = mapData[hexId].title || '';
        if (document.getElementById('inpDesc')) document.getElementById('inpDesc').value = mapData[hexId].text || '';
        if (difficultySelect) difficultySelect.value = mapData[hexId].difficulty || '';
        if (inpExplored) inpExplored.checked = !!mapData[hexId].explored;
        if (inpMapMapped) inpMapMapped.checked = !!mapData[hexId].mapMapped;
        if (inpType) inpType.value = mapData[hexId].type || '';
        if (inpTerrain) inpTerrain.value = mapData[hexId].terrain || '';
        if (inpRegionLevel) inpRegionLevel.value = mapData[hexId].regionLevel || '';
        if (inpRumorDesc) inpRumorDesc.value = mapData[hexId].rumorText || '';
        currentColor = mapData[hexId].color || 'transparent';

        UiSelectManager.setCustomSelectValue('customSelectType', mapData[hexId].type || '');
        UiSelectManager.setCustomSelectValue('customSelectTerrain', mapData[hexId].terrain || '');
        UiSelectManager.setCustomSelectValue('customSelectDifficulty', mapData[hexId].difficulty || '');
        UiSelectManager.setCustomSelectValue('customSelectRegionLevel', mapData[hexId].regionLevel || '');
    } else {
        if (document.getElementById('inpTitle')) document.getElementById('inpTitle').value = '';
        if (document.getElementById('inpDesc')) document.getElementById('inpDesc').value = '';
        if (difficultySelect) difficultySelect.value = '';
        if (inpExplored) inpExplored.checked = false;
        if (inpMapMapped) inpMapMapped.checked = false;
        if (inpType) inpType.value = '';
        if (inpTerrain) inpTerrain.value = '';
        if (inpRegionLevel) inpRegionLevel.value = '';
        if (inpRumorDesc) inpRumorDesc.value = '';
        currentColor = 'transparent';

        UiSelectManager.setCustomSelectValue('customSelectType', '');
        UiSelectManager.setCustomSelectValue('customSelectTerrain', '');
        UiSelectManager.setCustomSelectValue('customSelectDifficulty', '');
        UiSelectManager.setCustomSelectValue('customSelectRegionLevel', '');
    }

    if (inpSquadHere) inpSquadHere.checked = mapData[hexId] ? !!mapData[hexId].squadHere : false;
    if (inpColor) inpColor.value = currentColor;

    document.querySelectorAll('.color-preset-btn').forEach(btn => {
        btn.classList.remove('active');
        if (currentColor === 'transparent' && btn.classList.contains('transparent-preset')) {
            btn.classList.add('active');
        } else if (btn.style.backgroundColor === convertHexToRgbStandard(currentColor)) {
            btn.classList.add('active');
        }
    });

    // ============================================================================
    // АДАПТАЦИЯ ТЕКСТОВЫХ ПОЛЕЙ ПОД ТАЧ-ИНТЕРФЕЙСЫ (MOBILE PROMPT)
    // ============================================================================
    if ('ontouchstart' in window) {
        const inpTitle = document.getElementById('inpTitle');
        const inpDesc = document.getElementById('inpDesc');

        if (inpTitle) {
            inpTitle.setAttribute('readonly', 'true');
            inpTitle.onclick = function() {
                let newTitle = prompt("Введите название гекса:", inpTitle.value);
                if (newTitle !== null) inpTitle.value = newTitle;
            };
        }

        if (inpDesc) {
            inpDesc.setAttribute('readonly', 'true');
            inpDesc.onclick = function() {
                let newDesc = prompt("Введите описание гекса:", inpDesc.value);
                if (newDesc !== null) inpDesc.value = newDesc;
            };
        }

        if (inpRumorDesc) {
            inpRumorDesc.setAttribute('readonly', 'true');
            inpRumorDesc.onclick = function() {
                let newRumor = prompt("Введите слухи:", inpRumorDesc.value);
                if (newRumor !== null) inpRumorDesc.value = newRumor;
            };
        }
    }

    const inpQuestTitle = document.getElementById('inpQuestTitle');
    const inpQuestDesc = document.getElementById('inpQuestDesc');
    const inpQuestStatus = document.getElementById('inpQuestStatus');

    if (mapData[hexId] && mapData[hexId].questData) {
        if (inpQuestTitle) inpQuestTitle.value = mapData[hexId].questData.title || '';
        if (inpQuestDesc) inpQuestDesc.value = mapData[hexId].questData.desc || '';
        if (inpQuestStatus) inpQuestStatus.checked = mapData[hexId].questData.status === 'completed';
    } else {
        if (inpQuestTitle) inpQuestTitle.value = '';
        if (inpQuestDesc) inpQuestDesc.value = '';
        if (inpQuestStatus) inpQuestStatus.checked = false;
    }

    if (modal) modal.classList.add('open');
}

// ============================================================================
// ФУНКЦИИ ЗАКРЫТИЯ И ОЧИСТКИ ДАННЫХ ИЗ ФОРМЫ НА КАРТЕ
// ============================================================================
function closeMenu() {
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
    }

    modal.classList.remove('open');
    currentHexId = null;

    setTimeout(() => {
    }, 300);
}

// ============================================================================
// ФУНКЦИЯ СОХРАНЕНИЯ ДАННЫХ ГЕКСА
// ============================================================================

function saveMenu() {
    if (!currentHexId) return;

    const titleVal = document.getElementById('inpTitle').value;
    const descVal = document.getElementById('inpDesc').value;
    const colorVal = document.getElementById('inpColor').value || 'transparent';
    const diffVal = difficultySelect.value;
    const exploredVal = document.getElementById('inpExplored').checked;
    const mapMappedVal = document.getElementById('inpMapMapped').checked;
    const squadHereVal = document.getElementById('inpSquadHere').checked;
    const typeVal = document.getElementById('inpType').value;
    const terrainVal = document.getElementById('inpTerrain').value;
    const regionLevelVal = document.getElementById('inpRegionLevel').value;
    const questTitleVal = document.getElementById('inpQuestTitle').value.trim();
    const questDescVal = document.getElementById('inpQuestDesc').value.trim();
    const questStatusVal = document.getElementById('inpQuestStatus').checked ? 'completed' : 'active';
    const rumorTextVal = document.getElementById('inpRumorDesc').value.trim();

    const currentHexElement = document.getElementById('visual_' + currentHexId);
    const currentShape = document.getElementById('shape_' + currentHexId);

    if (squadHereVal) {
        for (let id in mapData) {
            if (id !== currentHexId && mapData[id].squadHere === true) {
                mapData[id].squadHere = false;

                const oldHexElement = document.getElementById('visual_' + id);
                if (oldHexElement) {
                    oldHexElement.classList.remove('squad-dark');
                    const oldFlag = oldHexElement.querySelector('.squad-flag-container');
                    if (oldFlag) oldFlag.style.display = 'none';
                }
            }
        }
    }

    if (currentHexElement) {
        if (squadHereVal) {
            currentHexElement.classList.add('squad-dark');
        } else {
            currentHexElement.classList.remove('squad-dark');
        }

        const tLabel = document.getElementById('title_label_' + currentHexId);
        if (tLabel) {
            const textNode = tLabel.querySelector('.hex-title-text');
            if (textNode) textNode.textContent = titleVal;
        }

        let qTooltip = visualLayer.querySelector(`.hex-quest-mini-tooltip[data-hex-id="${currentHexId}"]`);

        if (questTitleVal && questStatusVal !== 'completed') {
            if (!qTooltip) {
                qTooltip = document.createElement('div');
                qTooltip.className = 'hex-quest-mini-tooltip';
                qTooltip.setAttribute('data-hex-id', currentHexId);
                visualLayer.appendChild(qTooltip);
            }
            qTooltip.textContent = '⚜️ ' + questTitleVal;

            const hexLeft = parseFloat(currentHexElement.style.left) || 0;
            const hexTop = parseFloat(currentHexElement.style.top) || 0;
            const hexWidth = parseFloat(currentHexElement.style.width) || 0;

            qTooltip.style.left = (hexLeft + hexWidth / 2) + 'px';
            qTooltip.style.top = (hexTop + 12) + 'px';
        } else {
            if (qTooltip) {
                qTooltip.remove();
            }
        }

        const allFramed = visualLayer.querySelectorAll('.hex-region-stats-framed');
        let currentHexStatsLabel = null;
        const currentHexLeft = parseFloat(currentHexElement.style.left) + (parseFloat(currentHexElement.style.width) / 2);
        const currentHexTop = parseFloat(currentHexElement.style.top) + hexRadius + 48;

        allFramed.forEach(el => {
            const elLeft = parseFloat(el.style.left) || 0;
            const elTop = parseFloat(el.style.top) || 0;
            if (Math.abs(elLeft - currentHexLeft) < 5 && Math.abs(elTop - currentHexTop) < 5) {
                currentHexStatsLabel = el;
            }
        });

        if (currentHexStatsLabel) {
            const sTextNode = currentHexStatsLabel.querySelector('.hex-title-text');
            if (sTextNode) {
                if (diffVal && regionLevelVal) sTextNode.textContent = `🎲${diffVal}💀${regionLevelVal}`;
                else if (diffVal) sTextNode.textContent = `🎲${diffVal}`;
                else if (regionLevelVal) sTextNode.textContent = `💀${regionLevelVal}`;
                else sTextNode.textContent = '';
            }
            currentHexStatsLabel.style.display = (diffVal || regionLevelVal) ? 'flex' : 'none';
        }

        const typeElem = currentHexElement.querySelector('.type-icon-container');
        if (typeElem) {
            if (typeVal === "") {
                typeElem.style.display = 'none';
            } else {
                typeElem.style.display = 'block';
                let icon = '';
                if (typeVal === 'landmark') icon = '🏛️';
                else if (typeVal === 'resource') icon = '💎';
                else if (typeVal === 'quest') icon = '⚜️';
                else if (typeVal === 'mystery') icon = '❓';
                typeElem.textContent = icon;
            }
        }

        const terrainElem = currentHexElement.querySelector('.terrain-icon-container');
        if (terrainElem) {
            if (terrainVal === "") {
                terrainElem.style.display = 'none';
            } else {
                terrainElem.style.display = 'block';
                let icon = '';
                if (terrainVal === 'swamp') icon = '🐸';
                else if (terrainVal === 'forest') icon = '🌲';
                else if (terrainVal === 'water') icon = '🌊';
                else if (terrainVal === 'arctic') icon = '❄️';
                else if (terrainVal === 'mountain') icon = '⛰️';
                else if (terrainVal === 'plains') icon = '🌾';
                terrainElem.textContent = icon;
            }
        }

        const exploredElem = currentHexElement.querySelector('.explored-icon-container');
        if (exploredElem) {
            exploredElem.style.display = exploredVal ? 'block' : 'none';
            exploredElem.textContent = exploredVal ? '🔍' : '';
        }

        const mappedElem = currentHexElement.querySelector('.mapped-icon-container');
        if (mappedElem) {
            mappedElem.style.display = mapMappedVal ? 'block' : 'none';
            mappedElem.textContent = mapMappedVal ? '📜' : '';
        }

        const flagElem = currentHexElement.querySelector('.squad-flag-container');
        if (flagElem) {
            if (squadHereVal) {
                const isAlreadyHere = mapData[currentHexId] && mapData[currentHexId].squadHere;

                if (!isAlreadyHere) {
                    flagElem.style.display = 'none';
                    flagElem.classList.remove('active-flag');

                    const startHex = document.getElementById('visual_hex_0_0');
                    let startX = 0;
                    let startY = 0;
                    if (startHex) {
                        const startRect = startHex.getBoundingClientRect();
                        startX = startRect.left + startRect.width / 2;
                        startY = startRect.top + startRect.height / 2;
                    }

                    const targetRect = currentHexElement.getBoundingClientRect();
                    const targetX = targetRect.left + targetRect.width / 2;
                    const targetY = targetRect.top + targetRect.height / 2;

                    const flyingFlag = document.createElement('div');
                    flyingFlag.className = 'global-flying-flag';
                    flyingFlag.innerHTML = `
                        <div class="squad-pole" style="height: 50px; width: 6px; background: #333; margin-left: 6px; border-radius: 2px; border: 1px solid #000;">
                            <div class="squad-flag" style="width: 30px; height: 20px; background: #c0392b; clip-path: polygon(0 0, 100% 50%, 0 100%); border: 2px solid #ffffff; box-shadow: 2px 2px 4px rgba(0,0,0,0.4);"></div>
                        </div>
                    `;

                    const sX = startX - 9;
                    const sY = startY - 50;
                    const tX = targetX - 9;
                    const tY = targetY - 50;

                    flyingFlag.style.setProperty('--start-x', `${sX}px`);
                    flyingFlag.style.setProperty('--start-y', `${sY}px`);
                    flyingFlag.style.setProperty('--target-x', `${tX}px`);
                    flyingFlag.style.setProperty('--target-y', `${tY}px`);

                    document.body.appendChild(flyingFlag);

                    function createBurst(bx, by) {
                        const burstContainer = document.createElement('div');
                        burstContainer.className = 'flag-impact-burst';
                        burstContainer.style.left = `${bx}px`;
                        burstContainer.style.top = `${by}px`;

                        const sparksCount = 8;
                        for (let i = 0; i < sparksCount; i++) {
                            const spark = document.createElement('div');
                            spark.className = 'impact-spark';
                            const currentAngle = (360 / sparksCount) * i;
                            spark.style.setProperty('--angle', `${currentAngle}deg`);
                            burstContainer.appendChild(spark);
                        }

                        document.body.appendChild(burstContainer);
                        setTimeout(() => { burstContainer.remove(); }, 250);
                    }

                    setTimeout(() => {
                        flyingFlag.style.animation = 'none';
                        flyingFlag.style.transition = 'transform 0.05s ease-out';
                        flyingFlag.style.transform = `translate3d(${tX}px, ${tY}px, 0) scale(1) rotate(-5deg)`;
                        createBurst(targetX, targetY);
                    }, 1300);

                    setTimeout(() => {
                        flyingFlag.remove();
                        flagElem.style.display = 'block';
                        flagElem.style.animation = 'flagAppear 0.05s forwards';

                        setTimeout(() => {
                            flagElem.style.animation = '';
                            flagElem.classList.add('active-flag');
                        }, 50);
                    }, 1300);

                    setTimeout(() => { createBurst(targetX - 45, targetY + 40); }, 1430);
                    setTimeout(() => { createBurst(targetX + 45, targetY - 40); }, 1610);

                } else {
                    flagElem.style.display = 'block';
                    flagElem.classList.add('active-flag');
                }
            } else {
                flagElem.style.display = 'none';
                flagElem.classList.remove('active-flag');
                flagElem.style.animation = '';
            }
        }
    }

    if (currentShape) {
        if (colorVal !== 'transparent') {
            currentShape.style.backgroundColor = convertHexToRgba(colorVal, 0.37);
        } else {
            currentShape.style.backgroundColor = 'rgba(255, 255, 255, 0)';
        }
    }

    mapData[currentHexId] = {
        title: titleVal,
        text: descVal,
        rumorText: rumorTextVal,
        color: colorVal,
        difficulty: diffVal,
        explored: exploredVal,
        mapMapped: mapMappedVal,
        squadHere: squadHereVal,
        type: typeVal,
        terrain: terrainVal,
        regionLevel: regionLevelVal,
        hasVisited: squadHereVal || (mapData[currentHexId] && mapData[currentHexId].hasVisited),
        lastSaved: new Date().toLocaleString(),
        questData: questTitleVal ? {
            title: questTitleVal,
            desc: questDescVal,
            status: questStatusVal
        } : null
    };

    localStorage.setItem('hexMapSystemData', JSON.stringify(mapData));

    const questLog = document.getElementById('questLogContainer');
    if (questLog && !questLog.classList.contains('ui-collapsed')) {
        QuestManager.render();
    }

    for (let id in mapData) {
        const vHex = document.getElementById('visual_' + id);
        if (vHex) {
            const data = mapData[id];
            if (data && (data.explored || data.hasVisited)) {
                vHex.classList.remove('fog-active');
            } else {
                vHex.classList.add('fog-active');
            }
        }
    }

    closeMenu();
}

// ============================================================================
// СЛУШАТЕЛИ КНОПОК ФОРМЫ И ЛОГИКА ПОЛНОГО УДАЛЕНИЯ ДАННЫХ ГЕКСА
// ============================================================================
const btnSave = document.getElementById('btnSave');
if (btnSave) btnSave.addEventListener('click', saveMenu);

const btnCancel = document.getElementById('btnCancel');
if (btnCancel) btnCancel.addEventListener('click', closeMenu);

const btnDelete = document.getElementById('btnDelete');
if (btnDelete) {
    btnDelete.addEventListener('click', function() {
        if (!currentHexId) return;

        delete mapData[currentHexId];
        localStorage.setItem('hexMapSystemData', JSON.stringify(mapData));

        const shape = document.getElementById('shape_' + currentHexId);
        const label = document.getElementById('label_' + currentHexId);

        if (shape) shape.style.backgroundColor = 'rgba(255, 255, 255, 0)';
        if (label) label.textContent = '';

        const globalLabel = document.getElementById('title_label_' + currentHexId);
        if (globalLabel) {
            const textNode = globalLabel.querySelector('.hex-title-text');
            if (textNode) textNode.textContent = '';
        }

        closeMenu();
    });
}

if (modal) {
    modal.addEventListener('click', function(e) {
        if (e.target === modal) { closeMenu(); }
    });
}

const mapImg = document.getElementById('mapImg');
if (mapImg) {
    mapImg.addEventListener('click', function() {
        if (!hasMoved) closeMenu();
    });
}

// ============================================================================
// ИНИЦИАЛИЗАЦИЯ ПАЛИТРЫ ЦВЕТНЫХ КНОПОК-ПРЕСЕТОВ ГЕКСА
// ============================================================================
function initColorPresets() {
    const container = document.getElementById('colorPresetsContainer');
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
        if(p.color === 'transparent') {
            b.classList.add('transparent-preset');
            b.textContent = p.label;
        } else {
            b.style.backgroundColor = p.color;
        }
        b.addEventListener('click', () => {
            document.getElementById('inpColor').value = p.color;
            container.querySelectorAll('.color-preset-btn').forEach(x => x.classList.remove('active'));
            b.classList.add('active');
        });
        container.appendChild(b);
    });
}

// ============================================================================
// ИНИЦИАЛИЗАЦИЯ И НАЗНАЧЕНИЕ СОБЫТИЙ ДЛЯ КНОПОК ИЗ HTML
// ============================================================================

function initUnifiedUICollapse() {
    const rightPanel = document.querySelector('.right-controls-panel');
    const questLog = document.getElementById('questLogContainer');
    const btnToggleQuests = document.getElementById('btnToggleQuests');
    const masterBtn = document.getElementById('btnMasterToggle');

    if (btnToggleQuests && questLog) {
        btnToggleQuests.replaceWith(btnToggleQuests.cloneNode(true));

        const activeBtnToggleQuests = document.getElementById('btnToggleQuests');
        activeBtnToggleQuests.addEventListener('click', (e) => {
            e.stopPropagation();

            const isLogCollapsed = questLog.classList.toggle('ui-collapsed');
            if (!isLogCollapsed) {
                QuestManager.render();
                activeBtnToggleQuests.style.setProperty('background', 'linear-gradient(180deg, #1e3c27 0%, #112417 100%)', 'important');
                activeBtnToggleQuests.style.setProperty('border-color', '#dfbc6f', 'important');
                activeBtnToggleQuests.style.setProperty('color', '#dfbc6f', 'important');
            } else {
                activeBtnToggleQuests.style.setProperty('background', '', 'important');
                activeBtnToggleQuests.style.setProperty('border-color', '', 'important');
                activeBtnToggleQuests.style.setProperty('color', '', 'important');
            }
        });
    }

    if (masterBtn && rightPanel) {
        rightPanel.classList.remove('ui-expanded');

        masterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = rightPanel.classList.toggle('ui-expanded');

            const monolithWrapper = document.querySelector('.music-player-monolith-wrapper');
            if (monolithWrapper) {
                monolithWrapper.classList.toggle('ui-expanded', isExpanded);
            }

            if (!isExpanded && questLog) {
                questLog.classList.add('ui-collapsed');
                const activeBtnToggleQuests = document.getElementById('btnToggleQuests');
                if (activeBtnToggleQuests) {
                    activeBtnToggleQuests.style.setProperty('background', '', 'important');
                    activeBtnToggleQuests.style.setProperty('border-color', '', 'important');
                    activeBtnToggleQuests.style.setProperty('color', '', 'important');
                }
            }
            masterBtn.classList.toggle('ui-active', isExpanded);
        });
    }

    const minimizeBtnEl = document.querySelector('.wa-minimize');
    if (minimizeBtnEl) {
        minimizeBtnEl.style.cursor = 'pointer';
        minimizeBtnEl.title = 'Скрыть панель легенды и плеера';

        minimizeBtnEl.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();

            const monolithWrapperEl = document.querySelector('.music-player-monolith-wrapper');
            if (monolithWrapperEl) {
                monolithWrapperEl.classList.remove('ui-expanded');
            }

            if (masterBtn) {
                masterBtn.classList.remove('ui-active');
            }

        });
    }
}

// ============================================================================
// СИСТЕМА ФОКУСИРОВКИ И ФЛЭШ-ПОДСВЕТКИ ВЫБРАННОГО ГЕКСА
// ============================================================================
function focusOnHex(hexId) {
    const vHex = document.getElementById('visual_' + hexId);
    if (!vHex) return;

    ViewportManager.resetHasMoved();

    isDragging = false;
    hasMoved = false;

    vHex.classList.add('hex-focused-flash');
    setTimeout(() => {
        vHex.classList.remove('hex-focused-flash');
    }, 3600);
}

// ============================================================================
// ОПТИМИЗАЦИЯ И СТРУКТУРИРОВАНИЕ СТРОК СЕЛЕКТОРОВ МОДАЛЬНОГО ОКНА
// ============================================================================
function groupMenuFields() {
    const inpType = document.getElementById('inpType');
    const inpTerrain = document.getElementById('inpTerrain');
    const diffSelect = document.getElementById('inpDifficulty');
    const inpRegionLevel = document.getElementById('inpRegionLevel');

    if (!inpType || !inpTerrain || !diffSelect || !inpRegionLevel) return;

    const boxType = inpType.closest('.box');
    const boxTerrain = inpTerrain.closest('.box');
    const boxDiff = diffSelect.closest('.box');
    const boxLevel = inpRegionLevel.closest('.box');

    if (boxType && boxTerrain) {
        const rowObjects = document.createElement('div');
        rowObjects.className = 'box-row-combined';
        boxType.parentNode.insertBefore(rowObjects, boxType);
        rowObjects.appendChild(boxType);
        rowObjects.appendChild(boxTerrain);
    }

    if (boxDiff && boxLevel) {
        const rowStats = document.createElement('div');
        rowStats.className = 'box-row-combined';
        boxDiff.parentNode.insertBefore(rowStats, boxDiff);
        rowStats.appendChild(boxDiff);
        rowStats.appendChild(boxLevel);
    }
}

window.addEventListener('resize', () => {
    ViewportManager.updateMapTransform();
});

if (modal) {
    ['mousedown', 'mousemove', 'mouseup', 'click', 'touchstart', 'touchmove', 'touchend'].forEach(eventType => {
        modal.addEventListener(eventType, (e) => {
            if (e.target === modal) return;
            e.stopPropagation();
        }, { passive: true });
    });
}
