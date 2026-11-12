// ============================================================================
// ИМПОРТЫ: КОНФИГУРАЦИЯ И СИСТЕМНОЕ УПРАВЛЕНИЕ (CONFIG & CONTROLLER)
// ============================================================================
import { MAP_CONFIG } from './config/app_config.js';
import UiSelectManager from './controller/ui_select_manager.js';
import FogManager from './controller/fog_manager.js';

// ============================================================================
// ИМПОРТЫ: ЯДРО СИСТЕМЫ (CORE)
// ============================================================================

import FileManager from './core/file_manager.js';
import HexCanvasRender from './core/hex_canvas_render.js';
import CampingManager from './core/camping_manager.js';
import KingdomManager from './core/kingdom_manager.js';
import PathManager from './core/path_manager.js';
import QuestManager from './core/quest_manager.js';
import StorageManager from './core/storage_manager.js';

// ============================================================================
// ИМПОРТЫ: СЕРВИСЫ И ВСПОМОГАТЕЛЬНЫЕ СИСТЕМЫ (SERVICES)
// ============================================================================

import AnimationManager from './services/animation_manager.js';
import SoundPlayer from './services/sound_player.js';
import ViewportManager from './services/viewport_manager.js';
import SettingsManager from './core/settings_manager.js';
import HexModal from './ui/hex_modal.js';
import LayoutManager from './ui/layout_manager.js';
import UiPanelManager from './ui/ui_panel_manager.js';
import TacticalMapManager from './tactical_map/tactical_map_manager.js';
import InitiativeManager from './core/initiative_manager.js';
import WeatherManager from './core/weather_manager.js';
import HudWindowManager from './ui/hud_window_manager.js';

let hasMoved = false;
let mapData = { hexes: {}, kingdom: null, paths: [] };
window.FLIGHT_FROM_CAPITAL_MODE = true;

document.addEventListener('DOMContentLoaded', () => {
    // Первичный запуск и реактивное применение сохраненных настроек интерфейса
    SettingsManager.init();

    // 1. Загрузка данных
    mapData = StorageManager.loadData();

    // 2. Инициализация UI-макета и панелей управления
    LayoutManager.init();
    HudWindowManager.init();

    // Регистрация вкладок остальных модулей:
    HudWindowManager.registerTab('kingdom', {
        tabBtnId: 'tabKingdom',
        containerId: 'kingdomTabletContainer',
        onOpen: () => KingdomManager.renderUi()
    });

    HudWindowManager.registerTab('camping', {
        tabBtnId: 'tabCamping',
        containerId: 'campingTabletContainer',
        triggerBtnId: 'btnToggleCamping',
        onOpen: () => CampingManager.recalculateCamp()
    });

    HudWindowManager.registerTab('weather', {
        tabBtnId: 'tabWeather',
        containerId: 'weatherTabletContainer',
        onOpen: () => WeatherManager.renderTabUi()
    });

    HudWindowManager.registerTab('initiative', {
        tabBtnId: 'tabInitiative',
        containerId: 'initiativeTabletContainer',
        onOpen: () => InitiativeManager.renderUi()
    });

    HudWindowManager.registerTab('settings', {
        tabBtnId: 'tabSettings',
        containerId: 'settingsTabletContainer',
        triggerBtnId: 'btnToggleSettings'
    });

    UiPanelManager.init();
    SoundPlayer.init();
    UiSelectManager.init();
    ViewportManager.init();

    // 3. Чистый математический расчет координат БЕЗ создания HTML-нод
    const hexCoordinatesMap = {};
    const { radius, rows, cols, offsetX, offsetY } = MAP_CONFIG.grid;
    const widthBetweenHexes = radius * Math.sqrt(3);
    const heightBetweenHexes = radius * 1.5;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let cx = offsetX + c * widthBetweenHexes;
            let cy = offsetY + r * heightBetweenHexes;
            if (r % 2 !== 0) {
                cx += widthBetweenHexes / 2; // Pointy-сдвиг для нечетных строк
            }
            hexCoordinatesMap[`hex_${r}_${c}`] = { cx, cy };
        }
    }

    // 4. Инициализация путей на основе рассчитанных координат
    PathManager.init(mapData);
    const svgPathsLayer = document.getElementById('mapPathsSvg');
    const btnTogglePaths = document.getElementById('btnTogglePaths');
    if (svgPathsLayer) {
        svgPathsLayer.classList.add('hide-paths');
    }
    if (btnTogglePaths) {
        btnTogglePaths.classList.add('paths-hidden');
    }

    // 5. Инициализация интерактивного Canvas-рендерера
    const canvasElement = document.getElementById('mapCanvas');
    if (canvasElement) {
        HexCanvasRender.init(canvasElement, mapData.hexes, hexCoordinatesMap);
        window.HexCanvasRender = HexCanvasRender;

        if (window.SettingsManager && window.SettingsManager.state) {
            HexCanvasRender.showQuestTooltips = !window.SettingsManager.state.hideQuestMarkers;
        }

        if (localStorage.getItem('kingmakerFrameStyle') === 'runes') {
            HexCanvasRender.startAnimationLoop();
        }

        // Обработка клика по Canvas (заменяет старые HTML-слушатели)
        canvasElement.addEventListener('click', () => {
            if (!ViewportManager.getHasMoved() && HexCanvasRender.hoveredHexKey) {
                const hexId = HexCanvasRender.hoveredHexKey;
                const hexData = mapData.hexes[hexId] || null;

                if (window.CampingManager) {
                    const lvl = (hexData && hexData.regionLevel) ? hexData.regionLevel : 1;
                    window.CampingManager.state.currentHexRegionLevel = lvl;
                }
                HexModal.open(hexId, hexData);
            }
        });
    }

    // Первичный рендер путей
    setTimeout(() => { PathManager.render(); }, 300);

    // Настройка фокуса по клику из журнала квестов
    QuestManager.init(mapData.hexes, (hexId) => AnimationManager.focusOnHex(hexId));

    // Инициализация независимого календаря и погоды
    WeatherManager.init(mapData, () => {
        StorageManager.saveData(mapData);
    });

    // Настройка менеджмента королевства
    KingdomManager.init(mapData, () => {
        StorageManager.saveData(mapData);
    });
    KingdomManager.renderUi();

    // Настройка импорта файлов (FileManager)
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
        if (WeatherManager && typeof WeatherManager.updateMapData === 'function') {
            WeatherManager.updateMapData(mapData);
        }
        KingdomManager.updateMapData(mapData);

        if (CampingManager && typeof CampingManager.updateMapData === 'function') {
            CampingManager.updateMapData(mapData);
        }

        HexCanvasRender.updateData(mapData.hexes);
        HexCanvasRender.requestFrame();

        setTimeout(() => { PathManager.render(); }, 50);
    });

    InitiativeManager.init(mapData, () => {
        StorageManager.saveData(mapData);
    });

    // ============================================================================
    // КОЛЛБЭКИ МОДАЛЬНОГО ОКНА ГЕКСА
    // ============================================================================
    HexModal.init({
        onSave: (hexId, formData) => {
            let oldHexId = null;

            if (HudWindowManager.isOpen() && ['active', 'completed', 'rumors'].includes(HudWindowManager.activeTab)) {
                QuestManager.render();
            }

            if (formData.squadHere) {
                formData.hasVisited = true;
                oldHexId = StorageManager.moveSquad(mapData, hexId);
                PathManager.addPoint(hexId);
            } else {
                formData.hasVisited = !!(mapData.hexes[hexId] && mapData.hexes[hexId].hasVisited);
            }

            if (formData.squadHere && oldHexId && oldHexId !== hexId) {
                HexCanvasRender.hiddenSquadHexId = hexId;
                const finalStartHexId = window.FLIGHT_FROM_CAPITAL_MODE ? 'hex_0_0' : oldHexId;

                StorageManager.updateHex(mapData, hexId, formData);
                HexCanvasRender.updateData(mapData.hexes, hexId);

                AnimationManager.playFlagFlight(finalStartHexId, hexId, () => {
                    HexCanvasRender.hiddenSquadHexId = null;
                    HexCanvasRender.updateData(mapData.hexes, hexId);
                });
            } else {
                StorageManager.updateHex(mapData, hexId, formData);
                HexCanvasRender.updateData(mapData.hexes, hexId);
            }

            const questLog = document.getElementById('questLogContainer');
            if (questLog && !questLog.classList.contains('ui-collapsed')) {
                QuestManager.render();
            }

            FogManager.syncMapFog(mapData.hexes);
            if (window.KingdomManager && typeof window.KingdomManager.syncFromHexMap === 'function') {
                window.KingdomManager.syncFromHexMap(true);
            }
            HexModal.close();
        },

        onDelete: (hexId) => {
            StorageManager.deleteHex(mapData, hexId);
            HexCanvasRender.updateData(mapData.hexes);
            if (window.KingdomManager && typeof window.KingdomManager.syncFromHexMap === 'function') {
                window.KingdomManager.syncFromHexMap(true);
            }
            HexModal.close();
        }
    });

    if (CampingManager && typeof CampingManager.init === 'function') {
        CampingManager.init(mapData, () => {
            StorageManager.saveData(mapData);
        });
    }

    TacticalMapManager.init();
});

// Глобальный переключатель окон
window.forceOpenCampingGM = function() {
    HudWindowManager.toggle('camping');
};

window.closeMenu = () => HexModal.close();
