import SoundPlayer from './sound_player.js';
import FileManager from './file_manager.js';
import QuestManager from './quest_manager.js';
import HexManager from './hex_manager.js';
import ViewportManager from './viewport_manager.js';
import UiSelectManager from './ui_select_manager.js';
import HexModal from './hex_modal.js';
import AnimationManager from './animation_manager.js';
import { MAP_CONFIG } from './config/app_config.js';
import { ColorConverter } from './utils/helpers.js';
import StorageManager from './storage_manager.js';

let hasMoved = false;
const visualLayer = document.getElementById('visualLayer');
let currentHexId = null;
let mapData = StorageManager.loadData();

// ============================================================================
// ИНИЦИАЛИЗАЦИЯ ИНТЕРФЕЙСА ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    SoundPlayer.init();
    initColorPresets();
    UiSelectManager.init();
    ViewportManager.init();
    HexManager.init(mapData, (hexId) => {
        currentHexId = hexId;
        HexModal.open(hexId, mapData[hexId]);
    });
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

    // ============================================================================
    // ИНИЦИАЛИЗАЦИЯ И СВЯЗЫВАНИЕ МОДАЛЬНОГО ОКНА ГЕКСА
    // ============================================================================
    HexModal.init({
        onSave: (hexId, formData) => {
            const currentHexElement = document.getElementById('visual_' + hexId);
            const currentShape = document.getElementById('shape_' + hexId);

            // 1. Управляем данными отряда и находим старую позицию через StorageManager
            let oldHexId = null;
            if (formData.squadHere) {
                oldHexId = StorageManager.moveSquad(mapData, hexId);

                // Визуально скрываем старый флаг, если отряд сменил позицию
                if (oldHexId && oldHexId !== hexId) {
                    const oldHexElement = document.getElementById('visual_' + oldHexId);
                    if (oldHexElement) {
                        oldHexElement.classList.remove('squad-dark');
                        const oldFlag = oldHexElement.querySelector('.squad-flag-container');
                        if (oldFlag) oldFlag.style.display = 'none';
                    }
                }
            }

            // 2. Обновление визуального слоя гекса на холсте
            if (currentHexElement) {
                if (formData.squadHere) {
                    currentHexElement.classList.add('squad-dark');
                } else {
                    currentHexElement.classList.remove('squad-dark');
                }

                // Текстовая плашка названия гекса
                const tLabel = document.getElementById('title_label_' + hexId);
                if (tLabel) {
                    const textNode = tLabel.querySelector('.hex-title-text');
                    if (textNode) textNode.textContent = formData.title;
                }

                // Логика квестовых мини-тултипов на карте
                let qTooltip = visualLayer.querySelector(`.hex-quest-mini-tooltip[data-hex-id="${hexId}"]`);
                if (formData.questData && formData.questData.status !== 'completed') {
                    if (!qTooltip) {
                        qTooltip = document.createElement('div');
                        qTooltip.className = 'hex-quest-mini-tooltip';
                        qTooltip.setAttribute('data-hex-id', hexId);
                        visualLayer.appendChild(qTooltip);
                    }
                    qTooltip.textContent = '⚜️ ' + formData.questData.title;

                    const hexLeft = parseFloat(currentHexElement.style.left) || 0;
                    const hexTop = parseFloat(currentHexElement.style.top) || 0;
                    const hexWidth = parseFloat(currentHexElement.style.width) || 0;

                    qTooltip.style.left = (hexLeft + hexWidth / 2) + 'px';
                    qTooltip.style.top = (hexTop + 12) + 'px';
                } else if (qTooltip) {
                    qTooltip.remove();
                }

                // Расчет плашки уровня и СЛ региона на карте
                const allFramed = visualLayer.querySelectorAll('.hex-region-stats-framed');
                let currentHexStatsLabel = null;
                const currentHexLeft = parseFloat(currentHexElement.style.left) + (parseFloat(currentHexElement.style.width) / 2);
                const currentHexTop = parseFloat(currentHexElement.style.top) + MAP_CONFIG.grid.radius + 48;

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
                        if (formData.difficulty && formData.regionLevel) sTextNode.textContent = `🎲${formData.difficulty}💀${formData.regionLevel}`;
                        else if (formData.difficulty) sTextNode.textContent = `🎲${formData.difficulty}`;
                        else if (formData.regionLevel) sTextNode.textContent = `💀${formData.regionLevel}`;
                        else sTextNode.textContent = '';
                    }
                    currentHexStatsLabel.style.display = (formData.difficulty || formData.regionLevel) ? 'flex' : 'none';
                }

                // Иконка типа объекта
                const typeElem = currentHexElement.querySelector('.type-icon-container');
                if (typeElem) {
                    typeElem.style.display = formData.type === "" ? 'none' : 'block';
                    typeElem.textContent = MAP_CONFIG.types[formData.type]?.icon || '';
                }

                // Иконка типа местности
                const terrainElem = currentHexElement.querySelector('.terrain-icon-container');
                if (terrainElem) {
                    terrainElem.style.display = formData.terrain === "" ? 'none' : 'block';
                    terrainElem.textContent = MAP_CONFIG.terrains[formData.terrain]?.icon || '';
                }

                // Иконки статуса разведки и составления карты
                const exploredElem = currentHexElement.querySelector('.explored-icon-container');
                if (exploredElem) {
                    exploredElem.style.display = formData.explored ? 'block' : 'none';
                    exploredElem.textContent = formData.explored ? '🔍' : '';
                }

                const mappedElem = currentHexElement.querySelector('.mapped-icon-container');
                if (mappedElem) {
                    mappedElem.style.display = formData.mapMapped ? 'block' : 'none';
                    mappedElem.textContent = formData.mapMapped ? '📜' : '';
                }

                // Триггер анимации полета флага
                const flagElem = currentHexElement.querySelector('.squad-flag-container');
                if (flagElem) {
                    if (formData.squadHere) {
                        const isAlreadyHere = mapData[hexId] && mapData[hexId].squadHere;

                        if (!isAlreadyHere) {
                            flagElem.style.display = 'none';
                            flagElem.classList.remove('active-flag');

                            const oldHexElement = document.getElementById('visual_' + oldHexId);

                            AnimationManager.playFlagFlight(oldHexElement, currentHexElement, () => {
                                flagElem.style.display = 'block';
                                flagElem.style.animation = 'flagAppear 0.05s forwards';

                                setTimeout(() => {
                                    flagElem.style.animation = '';
                                    flagElem.classList.add('active-flag');
                                }, 50);
                            });
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

            // Цветная заливка подложки гекса
            if (currentShape) {
                currentShape.style.backgroundColor = formData.color !== 'transparent'
                    ? ColorConverter.hexToRgba(formData.color, 0.37)
                    : 'rgba(255, 255, 255, 0)';
            }

            // 3. Сохраняем обновленные данные гекса через StorageManager
            StorageManager.updateHex(mapData, hexId, formData);

            // Обновляем Дневник Квестов, если он открыт
            const questLog = document.getElementById('questLogContainer');
            if (questLog && !questLog.classList.contains('ui-collapsed')) {
                QuestManager.render();
            }

            // Обновление тумана войны для всей сетки
            for (let id in mapData) {
                const vHex = document.getElementById('visual_' + id);
                if (vHex) {
                    if (mapData[id].explored || mapData[id].hasVisited) {
                        vHex.classList.remove('fog-active');
                    } else {
                        vHex.classList.add('fog-active');
                    }
                }
            }

            HexModal.close();
        },
        onDelete: (hexId) => {
            // Удаляем данные гекса через StorageManager
            StorageManager.deleteHex(mapData, hexId);

            const shape = document.getElementById('shape_' + hexId);
            const label = document.getElementById('label_' + hexId);

            if (shape) shape.style.backgroundColor = 'rgba(255, 255, 255, 0)';
            if (label) label.textContent = '';

            const globalLabel = document.getElementById('title_label_' + hexId);
            if (globalLabel) {
                const textNode = globalLabel.querySelector('.hex-title-text');
                if (textNode) textNode.textContent = '';
            }

            HexModal.close();
        }
    });

    // ============================================================================
    // ИНИЦИАЛИЗАЦИЯ ВСЕХ ОСТАЛЬНЫХ UI-КОМПОНЕНТОВ СТРАНИЦЫ
    // ============================================================================
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
    btnToggleTooltips.style.background = 'linear-gradient(180deg, #1e3c27 0%, #112417 100%)';
    btnToggleTooltips.style.borderColor = '#3e6349';
    btnToggleTooltips.style.color = '#dfbc6f';
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

    setTimeout(() => {
        const frame = document.querySelector('.kingmaker-frame');
        if (frame) frame.style.opacity = '1';
    }, 150);
});

// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ И СЛУШАТЕЛИ ВСПЛЫВАЮЩИХ ОКОН
// ============================================================================
function initColorPresets() {
    const container = document.getElementById('colorPresetsContainer');
    if (!container || container.children.length > 0) return;

    MAP_CONFIG.colorPresets.forEach(p => {
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
            document.getElementById('inpColor').value = p.color;
            container.querySelectorAll('.color-preset-btn').forEach(x => x.classList.remove('active'));
            b.classList.add('active');
        });
        container.appendChild(b);
    });
}

const mapImg = document.getElementById('mapImg');
if (mapImg) {
    mapImg.addEventListener('click', function() {
        if (!hasMoved) HexModal.close();
    });
}

function focusOnHex(hexId) {
    const vHex = document.getElementById('visual_' + hexId);
    if (!vHex) return;

    ViewportManager.resetHasMoved();
    hasMoved = false;

    vHex.classList.add('hex-focused-flash');
    setTimeout(() => {
        vHex.classList.remove('hex-focused-flash');
    }, 3600);
}

function initUnifiedUICollapse() {
    const rightPanel = document.querySelector('.right-controls-panel');
    const questLog = document.getElementById('questLogContainer');
    const masterBtn = document.getElementById('btnMasterToggle');

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
            }
            masterBtn.classList.toggle('ui-active', isExpanded);
        });
    }
}

window.addEventListener('resize', () => {
    ViewportManager.updateMapTransform();
});

window.closeMenu = () => HexModal.close();
