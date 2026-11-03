import SoundPlayer from './sound_player.js';
import FileManager from './file_manager.js';
import QuestManager from './quest_manager.js';
import HexManager from './hex_manager.js';
import ViewportManager from './viewport_manager.js';
import UiSelectManager from './ui_select_manager.js';
import HexModal from './hex_modal.js';
import AnimationManager from './animation_manager.js';
import StorageManager from './storage_manager.js';
import LayoutManager from './layout_manager.js';
import UiPanelManager from './ui_panel_manager.js'; // Наш финальный модуль!
import { MAP_CONFIG } from './config/app_config.js';
import { ColorConverter } from './utils/helpers.js';

let hasMoved = false;
const visualLayer = document.getElementById('visualLayer');
let currentHexId = null;
let mapData = StorageManager.loadData();

// ============================================================================
// ИНИЦИАЛИЗАЦИЯ ИНТЕРФЕЙСА ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Инициализация глобального лейаута и панелей управления
    LayoutManager.init();
    UiPanelManager.init();

    // 2. Инициализация системных компонентов
    initColorPresets();
    SoundPlayer.init();
    UiSelectManager.init();
    ViewportManager.init();

    // 3. Инициализация и связывание гексов, квестов и файлов
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

    // 4. Группировка кнопок модального окна в DOM
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
    // КОЛЛБЭКИ ИНТЕРФЕЙСА МОДАЛЬНОГО ОКНА ГЕКСА
    // ============================================================================
    HexModal.init({
        onSave: (hexId, formData) => {
            const currentHexElement = document.getElementById('visual_' + hexId);
            const currentShape = document.getElementById('shape_' + hexId);

            // Обработка данных отряда и логики полета флага
            let oldHexId = null;
            if (formData.squadHere) {
                oldHexId = StorageManager.moveSquad(mapData, hexId);

                if (oldHexId && oldHexId !== hexId) {
                    const oldHexElement = document.getElementById('visual_' + oldHexId);
                    if (oldHexElement) {
                        oldHexElement.classList.remove('squad-dark');
                        const oldFlag = oldHexElement.querySelector('.squad-flag-container');
                        if (oldFlag) oldFlag.style.display = 'none';
                    }
                }
            }

            // Обновление DOM-элементов гекса на интерактивной карте
            if (currentHexElement) {
                currentHexElement.classList.toggle('squad-dark', formData.squadHere);

                const tLabel = document.getElementById('title_label_' + hexId);
                if (tLabel) {
                    const textNode = tLabel.querySelector('.hex-title-text');
                    if (textNode) textNode.textContent = formData.title;
                }

                // Синхронизация мини-тултипов квестов
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

                // Синхронизация плашки уровня и сложности региона
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

                // Динамические иконки объектов и ландшафта
                const typeElem = currentHexElement.querySelector('.type-icon-container');
                if (typeElem) {
                    typeElem.style.display = formData.type === "" ? 'none' : 'block';
                    typeElem.textContent = MAP_CONFIG.types[formData.type]?.icon || '';
                }

                const terrainElem = currentHexElement.querySelector('.terrain-icon-container');
                if (terrainElem) {
                    terrainElem.style.display = formData.terrain === "" ? 'none' : 'block';
                    terrainElem.textContent = MAP_CONFIG.terrains[formData.terrain]?.icon || '';
                }

                // Статусы исследования гекса
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

                // Триггер анимации летящего флага
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

            if (currentShape) {
                currentShape.style.backgroundColor = formData.color !== 'transparent'
                    ? ColorConverter.hexToRgba(formData.color, 0.37)
                    : 'rgba(255, 255, 255, 0)';
            }
// Синхронизация данных через менеджер репозитория
            StorageManager.updateHex(mapData, hexId, formData);
            const questLog = document.getElementById('questLogContainer');
            if (questLog && !questLog.classList.contains('ui-collapsed')) {
                QuestManager.render();
            }
// Обновление динамического тумана войны для сетки
            for (let id in mapData) {
                const vHex = document.getElementById('visual_' + id);
                if (vHex) {
                    vHex.classList.toggle('fog-active', !mapData[id].explored && !mapData[id].hasVisited);
                }
            }
            HexModal.close();
        },
        onDelete: (hexId) => {
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
});
// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ СИСТЕМНЫЕ МЕТОДЫ ГЕНЕРАЦИИ И ПОДСВЕТКИ
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
window.closeMenu = () => HexModal.close();