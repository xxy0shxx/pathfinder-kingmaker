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
import HexUiSyncer from './hex_ui_syncer.js'; // Наш новый модуль синхронизации UI гексов

let hasMoved = false;
let mapData = StorageManager.loadData();

// ============================================================================
// ИНИЦИАЛИЗАЦИЯ ИНТЕРФЕЙСА ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Инициализация глобального лейаута и панелей управления
    LayoutManager.init();
    UiPanelManager.init();

    // 2. Инициализация системных и звуковых компонентов
    SoundPlayer.init();
    UiSelectManager.init();
    ViewportManager.init();
    HexUiSyncer.init();

    // 3. Инициализация и связывание менеджеров ядра (Данные -> Сетка -> Квесты)
    HexManager.init(mapData, (hexId) => {
        HexModal.open(hexId, mapData[hexId]);
    });
    HexManager.buildGrid(() => hasMoved);

    // Передаем фокус-вспышку из обновленного AnimationManager
    QuestManager.init(mapData, (hexId) => AnimationManager.focusOnHex(hexId));

    // Настройка импорта файлов
    FileManager.init((importedData) => {
        mapData = importedData;
        QuestManager.updateMapData(mapData);
        HexManager.updateMapData(mapData);
        HexManager.buildGrid(() => hasMoved);
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
            for (let id in mapData) {
                const vHex = document.getElementById('visual_' + id);
                if (vHex) {
                    vHex.classList.toggle('fog-active', !mapData[id].explored && !mapData[id].hasVisited);
                }
            }
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
