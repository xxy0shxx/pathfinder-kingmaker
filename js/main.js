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
import UiPanelManager from './ui_panel_manager.js';
import HexUiSyncer from './hex_ui_syncer.js';
import FogManager from './fog_manager.js';
import PathManager from './path_manager.js';
import KingdomManager from './kingdom_manager.js';

let hasMoved = false;
//let mapData = StorageManager.loadData();

// ============================================================================
// ИНИЦИАЛИЗАЦИЯ ИНТЕРФЕЙСА ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {

    let mapData = StorageManager.loadData();

    // 1. Инициализация глобального лейаута и панелей управления
    LayoutManager.init();
    UiPanelManager.init();

    // 2. Инициализация системных и звуковых компонентов
    SoundPlayer.init();
    UiSelectManager.init();
    ViewportManager.init();
    HexUiSyncer.init();
    PathManager.init(mapData);

    // 3. Инициализация и связывание менеджеров ядра (Данные -> Сетка -> Квесты)
    HexManager.init(mapData.hexes, (hexId) => {
        HexModal.open(hexId, mapData.hexes[hexId]);
    });
    HexManager.buildGrid(() => hasMoved);

    setTimeout(() => { PathManager.render(); }, 300);

    // Передаем фокус-вспышку из обновленного AnimationManager
    QuestManager.init(mapData.hexes, (hexId) => AnimationManager.focusOnHex(hexId));

    KingdomManager.init(mapData, () => {
        StorageManager.saveData(mapData);
    });
    KingdomManager.renderUi();

    // Настройка импорта файлов
    FileManager.init((importedData) => {
        // Если пользователь загружает старый JSON-файл (где все гексы в корне)
        if (importedData && !importedData.hexes) {
            mapData = {
                hexes: importedData,
                kingdom: importedData.kingdomState || null,
                paths: importedData.__pathHistory || []
            };
        } else {
            // Если импортируется уже новый изолированный формат
            mapData = importedData || { hexes: {}, kingdom: null, paths: [] };
        }

        QuestManager.updateMapData(mapData.hexes);
        HexManager.updateMapData(mapData.hexes);
        if (typeof PathManager.updateMapData === 'function') {
            PathManager.updateMapData(mapData);
        }
        KingdomManager.updateMapData(mapData);

        // Принудительно заставляем HexManager перерисовать DOM-элементы сетки на экране
        HexManager.buildGrid(() => hasMoved);

        // Даем браузеру 50мс на отрисовку гексов и пускаем линии путей
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
                // Перемещаем отряд в памяти и узнаем ID старого гекса для анимации
                oldHexId = StorageManager.moveSquad(mapData, hexId);

                PathManager.addPoint(hexId);

                // Гасим стационарный флаг на старом гексе перед запуском полета
                if (oldHexId && oldHexId !== hexId) {
                    const oldHexElement = document.getElementById('visual_' + oldHexId);
                    if (oldHexElement) {
                        oldHexElement.classList.remove('squad-dark');
                        const oldFlag = oldHexElement.querySelector('.squad-flag-container');
                        if (oldFlag) {
                            oldFlag.style.display = 'none';
                            oldFlag.classList.remove('active-flag');
                        }
                    }
                }
            }

            // Вся тяжелая работа с DOM гекса (иконки, тексты, анимация флага) теперь тут:
            HexUiSyncer.sync(hexId, formData, oldHexId);

            // Сохраняем состояние в репозиторий данных (LocalStorage)
            StorageManager.updateHex(mapData, hexId, formData);

            // Если журнал квестов открыт — обновляем списки
            const questLog = document.getElementById('questLogContainer');
            if (questLog && !questLog.classList.contains('ui-collapsed')) {
                QuestManager.render();
            }

            // Синхронно обновляем туман войны для всей сетки
            FogManager.syncMapFog(mapData.hexes);

            HexModal.close();
        },
        onDelete: (hexId) => {
            // Удаляем данные из LocalStorage
            StorageManager.deleteHex(mapData, hexId);

            // Сбрасываем и очищаем визуальные элементы гекса на карте
            HexUiSyncer.clear(hexId);

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

// Проброс глобального метода закрытия для вызова из старых inline-обработчиков (если остались)
window.closeMenu = () => HexModal.close();
