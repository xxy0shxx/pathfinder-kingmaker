import SoundPlayer from './services/sound_player.js';
import FileManager from './core/file_manager.js';
import QuestManager from './core/quest_manager.js';
import HexManager from './core/hex_manager.js';
import ViewportManager from './services/viewport_manager.js';
import UiSelectManager from './controller/ui_select_manager.js';
import HexModal from './ui/hex_modal.js';
import AnimationManager from './services/animation_manager.js';
import StorageManager from './core/storage_manager.js';
import LayoutManager from './ui/layout_manager.js';
import UiPanelManager from './ui/ui_panel_manager.js';
import FogManager from './controller/fog_manager.js';
import PathManager from './core/path_manager.js';
import KingdomManager from './core/kingdom_manager.js';
import HexCanvasRender from './core/hex_canvas_render.js';
import { MAP_CONFIG } from './config/app_config.js';

let hasMoved = false;
// Делаем переменную mapData доступной глобально для всех слушателей в этом файле
let mapData = { hexes: {}, kingdom: null, paths: [] };
// true  — флаг ВСЕГДА прилетает из нулевого гекса (hex_0_0)
// false — флаг летит из своей реальной предыдущей позиции
let FLIGHT_FROM_CAPITAL_MODE = true;

// ============================================================================
// ИНИЦИАЛИЗАЦИЯ ИНТЕРФЕЙСА ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {

    // Загружаем актуальные данные из LocalStorage в глобальную переменную
    mapData = StorageManager.loadData();

    // 1. Инициализация глобального лейаута и панелей управления
    LayoutManager.init();
    UiPanelManager.init();

    // 2. Инициализация системных и звуковых компонентов
    SoundPlayer.init();
    UiSelectManager.init();
    ViewportManager.init();
    PathManager.init(mapData);
    const hexCoordinatesMap = {};

    const originalCreateHexElement = HexManager.createHexElement;
    HexManager.createHexElement = function(hexId, row, col, cx, cy, radius, data) {
        // Ловим оригинальные cx и cy, которые Kingmaker вычисляет пиксель-в-пиксель!
        hexCoordinatesMap[hexId] = { cx, cy };
        // DOM-ноды не создаем, возвращаем null, чтобы не захламлять память
        return null;
    };

    // Запускаем оригинальный билд сетки Kingmaker для расчета координат
    HexManager.init(mapData.hexes, (hexId) => {
        HexModal.open(hexId, mapData.hexes[hexId]);
    });



    // Карта сбора оригинальных пиксельных координат
//    let hexCoordinatesMap = {};

    // Перехватываем создание гекса для извлечения cx и cy
    HexManager.buildGrid = function(hasMovedCheck) {
        const { radius, rows, cols, offsetX, offsetY } = MAP_CONFIG.grid;
        const widthBetweenHexes = radius * Math.sqrt(3);
        const heightBetweenHexes = radius * 1.5;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                let cx = offsetX + c * widthBetweenHexes;
                let cy = offsetY + r * heightBetweenHexes;
                if (r % 2 !== 0) { cx += widthBetweenHexes / 2; } // Оригинальный pointy-сдвиг

                const hexId = 'hex_' + r + '_' + c;
                // Сохраняем в карту
                hexCoordinatesMap[hexId] = { cx, cy };
            }
        }
    };

    // Генерируем массив оригинальных координат
    HexManager.buildGrid(() => hasMoved);

    // Инициализируем интерактивный Canvas-рендер
    const canvasElement = document.getElementById('mapCanvas');
    if (canvasElement) {
        HexCanvasRender.init(canvasElement, mapData.hexes, hexCoordinatesMap);

        canvasElement.addEventListener('click', () => {
            if (!hasMoved && HexCanvasRender.hoveredHexKey) {
                const hexId = HexCanvasRender.hoveredHexKey;
                const hexData = mapData.hexes[hexId] || null;
                HexModal.open(hexId, hexData);
            }
        });
    }




    setTimeout(() => { PathManager.render(); }, 300);

    // Передаем фокус-вспышку из обновленного AnimationManager
    QuestManager.init(mapData.hexes, (hexId) => AnimationManager.focusOnHex(hexId));

    KingdomManager.init(mapData, () => {
        StorageManager.saveData(mapData);
    });
    KingdomManager.renderUi();

    // Настройка импорта файлов
    FileManager.init((importedData) => {
        if (importedData && !importedData.hexes) {
            mapData = {
                hexes: importedData,
                kingdom: importedData.kingdomState || null,
                paths: importedData.__pathHistory || []
            };
        } else {
            mapData = importedData || { hexes: {}, kingdom: null, paths: [] };
        }

        QuestManager.updateMapData(mapData.hexes);

        if (typeof PathManager.updateMapData === 'function') {
            PathManager.updateMapData(mapData);
        }
        KingdomManager.updateMapData(mapData);

        // Передаем новые импортированные данные в Canvas и заставляем его обновиться
        HexCanvasRender.updateData(mapData.hexes);

        setTimeout(() => {
            PathManager.render();
        }, 50);
    });

    // ============================================================================
    // КОЛЛБЭКИ ИНТЕРФЕЙСА МОДАЛЬНОГО ОКНА ГЕКСА
    // ============================================================================

    HexModal.init({


        onSave: (hexId, formData) => {
            let oldHexId = null;

            if (formData.squadHere) {
                formData.hasVisited = true;
                oldHexId = StorageManager.moveSquad(mapData, hexId);
                PathManager.addPoint(hexId);
            } else {
                formData.hasVisited = !!(mapData.hexes[hexId] && mapData.hexes[hexId].hasVisited);
            }

            if (formData.squadHere && oldHexId && oldHexId !== hexId) {

                HexCanvasRender.hiddenSquadHexId = hexId;

                // Определяем точку старта в зависимости от нашей переменной-режима
                // Если режим активен — принудительно подменяем старый гекс на 'hex_0_0'
                const finalStartHexId = FLIGHT_FROM_CAPITAL_MODE ? 'hex_0_0' : oldHexId;

                StorageManager.updateHex(mapData, hexId, formData);
                HexCanvasRender.updateData(mapData.hexes);

                // Передаем вычисленный ID старта в анимационный менеджер
                AnimationManager.playFlagFlight(finalStartHexId, hexId, () => {
                    HexCanvasRender.hiddenSquadHexId = null;
                    HexCanvasRender.updateData(hexId);
                    HexCanvasRender.updateData(mapData.hexes);
                });

            } else {
                StorageManager.updateHex(mapData, hexId, formData);
                HexCanvasRender.updateData(mapData.hexes);
            }

            const questLog = document.getElementById('questLogContainer');
            if (questLog && !questLog.classList.contains('ui-collapsed')) {
                QuestManager.render();
            }

            FogManager.syncMapFog(mapData.hexes);
            HexModal.close();
        },



        onDelete: (hexId) => {
            // 1. Удаляем данные гекса из LocalStorage (внутриglobalMapData)
            StorageManager.deleteHex(mapData, hexId);

            // 2. Передаем очищенный массив данных в Canvas-рендер
            // Мгновенно стираем все маркеры, иконки и тексты удаленного гекса
            HexCanvasRender.updateData(mapData.hexes);

            // 3. Закрываем модальное окно гекса
            HexModal.close();
        }

    });

});

// ============================================================================
// ГЛОБАЛЬНЫЕ СЛУШАТЕЛИ КАРТЫ
// ============================================================================
const mapImg = document.getElementById('mapImg');
if (mapImg) {
    mapImg.addEventListener('click', () => {
        if (!hasMoved) HexModal.close();
    });
}

// Проброс глобального метода закрытия для вызова из старых inline-обработчиков
window.closeMenu = () => HexModal.close();
