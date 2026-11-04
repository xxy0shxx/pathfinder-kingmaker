// ============================================================================
// ИМПОРТЫ: КОНФИГУРАЦИЯ И СИСТЕМНОЕ УПРАВЛЕНИЕ (CONFIG & CONTROLLER)
// ============================================================================

/**
 * MAP_CONFIG (из ./config/app_config.js)
 * Глобальный объект конфигурации карты и игровых механик:
 * - .grid: радиус гекса (77.96), сетка (12х30), смещения и лимит сложности (maxDcLevel = 40)
 * - .viewport: параметры зума (0.5x - 3.0x) и жесткие границы прокрутки холста canvas
 * - .types & .terrains: справочники типов объектов (ресурсы, квесты) и ландшафтов с базовыми СЛ проверок
 * - .messages & .audio: тексты для пустого дневника и дефолтные настройки громкости Winamp-панели
 */
import { MAP_CONFIG } from './config/app_config.js';

/**
 * UiSelectManager (из ./controller/ui_select_manager.js)
 * Контроллер кастомных выпадающих списков интерфейса (.custom-select):
 * - .init(): запускает генерацию опций и вешает обработчики кликов на выпадающие меню
 * - .populateSelectOptions(): динамически создает элементы выбора «СЛ» и «Уровней» до значения maxDcLevel
 * - .initDropdownLogic(): управляет переключением классов активности, закрытием других списков и записью в hidden-инпуты
 * - .setCustomSelectValue(id, val): метод для принудительной синхронизации значения селекта из внешних модулей
 */
import UiSelectManager from './controller/ui_select_manager.js';

/**
 * FogManager (из ./controller/fog_manager.js)
 * Контроллер «Тумана Войны» на Canvas-карте:
 * - .syncMapFog(hexesData): принимает актуальный стейт гексов из хранилища и проталкивает его в рендер,
 *   сигнализируя Canvas-движку о необходимости пересчитать и наложить маску скрытия (explored / hasVisited)
 */
import FogManager from './controller/fog_manager.js';

// ============================================================================
// ИМПОРТЫ: ЯДРО СИСТЕМЫ (CORE)
// ============================================================================

/**
 * FileManager (из ./core/file_manager.js)
 * Модуль импорта и экспорта игровых данных во внешние JSON-файлы:
 * - .init(onImportSuccess): привязывает клики к кнопкам экспорта и скрытого инпута загрузки файлов.
 * - .exportData(): собирает актуальное состояние карты из LocalStorage и скачивает его как 'map_data.json'.
 * - .importData(e, onImportSuccess): считывает файл через FileReader, перезаписывает LocalStorage и вызывает обновление UI.
 */
import FileManager from './core/file_manager.js';

/**
 * HexCanvasRender (из ./core/hex_canvas_render.js)
 * Высокопроизводительный движок отрисовки карты на элементе Canvas (HTML5 холст):
 * - .init(canvasElement, initialHexesData, coordinatesMap): настраивает размеры холста, запускает цикл отрисовки и события мыши.
 * - .updateData(newHexesData, changedHexId): обновляет стейт гексов и сохраняет штампы времени для анимации плавного появления иконок.
 * - .drawHexPath(cx, cy, r): вспомогательный метод построения математического контура шестиугольника (пути Canvas).
 * - .startAnimationLoop(): инициализирует бесконечный цикл рендеринга через requestAnimationFrame.
 * - .render(): главный игровой цикл; пересчитывает гекс под курсором мыши, эффекты наведения, фокуса и поочередно отрисовывает слои.
 * - .drawSingleHex(cx, cy, r, data, hexKey): послойно рендерит один гекс: заливка цветом -> туман войны -> свечение -> маркеры -> флаг -> плашки текста.
 * - .drawQuestPlate(ctx, text, x, y): рисует фиолетово-золотую плашку парящего мини-тултипа для активного квеста.
 * - .drawHoverEffect(cx, cy, r): накладывает полупрозрачную темную маску и золотую рамку на гекс под курсором.
 * - .drawTextPlate(ctx, text, x, y, isStats, isLargeTitle): генерирует темную подложку с рамкой для названия региона или его кубиков/черепов сложности.
 * - .drawCanvasFlag(cx, cy): рисует развевающийся флаг отряда, высчитывая угол покачивания по тригонометрической формуле от текущего времени.
 * - .attachMouseEvents(): отслеживает движение мыши, переводит экранные координаты в виртуальные (с учетом зума) и двигает HTML-тултип.
 * - .updateTooltipState(tooltip): динамически генерирует сложное HTML-содержимое для всплывающего окна подсказки (статусы, СЛ, описание).
 * - .triggerFocus(hexId): активирует эффект пульсирующего красно-золотого фокуса на выбранном гексе на 3.6 секунды.
 */
import HexCanvasRender from './core/hex_canvas_render.js';

/**
 * HexManager (из ./core/hex_manager.js)
 * Устаревший резервный модуль попиксельного построения DOM-сетки и маппинга полигонов:
 * - .init(mapData, openMenuCallback): сохраняет ссылку на данные и кэширует элементы интерактивных слоев.
 * - .updateMapData(newMapData): перезаписывает ссылку на актуальные данные карты при импорте.
 * - .getHexCoordsArray(cx, cy, r): вычисляет массив из 12 координат вершин гекса для HTML-тегов <area shape="poly">.
 * - .buildGrid(hasMovedCheck): [Перехвачен в app.js] Старый метод генерации сотен HTML-нод гексов и вешания на них обработчиков клика.
 * - .attachTooltipEvents(vHex, hexId): привязывает события наведения мыши для HTML-версии тултипа.
 * - .createSubLayers(vHex, hexId, cx, cy, radius): генерирует внутреннюю DOM-структуру гекса (иконки, флаги, контейнеры текста).
 */
import HexManager from './core/hex_manager.js';

/**
 * KingdomManager (из ./core/kingdom_manager.js)
 * Модуль симуляции настольного королевства (параметры, статы, проверки):
 * - .init(mapData, onSave): загружает королевство из сейва или создает дефолтное (1 уровень, 10 ОС), высчитывает модификаторы.
 * - .updateMapData(newMapData): синхронизирует состояние королевства при импорте файла и перерисовывает планшет.
 * - .recalculateModifiers(): рассчитывает модификаторы характеристик по классической формуле: Math.floor((значение - 10) / 2).
 * - .changeStat(statName, amount): изменяет базовое значение стата (культура, экономика и т.д.) и запускает обновление.
 * - .addRP(amount): начисляет или списывает очки Ресурсов (RP / Очки Королевства).
 * - .setUnrest(value): жестко устанавливает уровень Беспокойства (Unrest) в стране.
 * - .changeRuins(amount): изменяет показатель Упадка/Разрухи (Ruins).
 * - .saveFromUi(): парсит имена лидеров из полей ввода, сохраняет всё в корень mapData, триггерит запись в LocalStorage и анимирует кнопку сохранения.
 * - .renderUi(): выводит все числовые показатели, модификаторы и текстовые инпуты правителей в соответствующие HTML-блоки.
 */
import KingdomManager from './core/kingdom_manager.js';

/**
 * PathManager (из ./core/path_manager.js)
 * Модуль ведения лога перемещений и построения SVG-маршрута экспедиции:
 * - .init(mapData): кэширует SVG-контейнер и подгружает историю точек из объекта данных.
 * - .updateMapData(newMapData): обновляет ссылку на структуру сейва, страхует массив .paths и рендерит линии.
 * - .get history(): удобный геттер, возвращающий массив цепочки ID гексов (например, ['hex_0_0', 'hex_0_1']).
 * - .addPoint(cellId): добавляет гекс в историю походов, защищая от дублирования, если отряд кликнул на тот же гекс дважды.
 * - .clearHistory(): полностью очищает пройденный маршрут.
 * - .render(): берет эталонные координаты центров гексов из Canvas-рендера и генерирует цепочку SVG-линий <line> золотого цвета.
 */
import PathManager from './core/path_manager.js';

/**
 * QuestManager (из ./core/quest_manager.js)
 * Управляющий менеджер Квест-лога, дневника слухов и наводок:
 * - .init(mapData, onHexFocus): инициализирует DOM-структуру, переключатели вкладок и раскрытие панели.
 * - .initDOMPlacement(): переносит контейнер журнала в корень body для правильного отображения слоев и встраивает кнопку закрытия «×».
 * - .initTabs(): регистрирует клики на кнопки фильтров (Активные / Завершенные / Слухи / Планшет Королевства).
 * - .setActiveTab(tabElement, filterName): переключает CSS-классы активной вкладки и обновляет контент.
 * - .initUnifiedUICollapse(): управляет кнопкой разворачивания журнала квестов и стилизует её при открытии.
 * - .updateMapData(newMapData): обновляет внутреннюю ссылку на базу гексов при импорте.
 * - .render(): собирает по всем гексам активные квесты или слухи, генерирует карточки заданий с иконками и выводит их списком (или открывает вкладку королевства).
 */
import QuestManager from './core/quest_manager.js';

/**
 * StorageManager (из ./core/storage_manager.js)
 * Шлюз сохранения и автоматической миграции структуры базы данных LocalStorage:
 * - .loadData(): загружает строку JSON, проверяет формат и автоматически мигрирует старую плоскую структуру в новую вложенную ({hexes, kingdom, paths}).
 * - .saveData(data): сериализует объект данных в JSON-строку и записывает в LocalStorage под ключом 'hexMapSystemData'.
 * - .updateHex(globalMapData, hexId, formData): обновляет поля конкретного гекса, проставляет дату сохранения и флаг посещения.
 * - .moveSquad(globalMapData, newHexId): ищет старый гекс с флагом squadHere=true, снимает его, переносит на новый hexId и возвращает старый ID (для анимации полета).
 * - .deleteHex(globalMapData, hexId): полностью стирает гекс из дерева данных и перезаписывает хранилище.
 */
import StorageManager from './core/storage_manager.js';

// ============================================================================
// ИМПОРТЫ: СЕРВИСЫ И ВСПОМОГАТЕЛЬНЫЕ СИСТЕМЫ (SERVICES)
// ============================================================================

/**
 * AnimationManager (из ./services/animation_manager.js)
 * Модуль для управления анимациями, спецэффектами и летящими объектами на карте:
 * - .createBurst(bx, by): создает радиальный взрыв из 8 искр в указанных экранных координатах (эффект удара флага).
 * - .spawnBeamsBurst(cx, cy, scale): генерирует сочную вспышку из 6 золотых лучей с возможностью изменения масштаба через CSS-трансформ.
 * - .playFlagFlight(oldHexId, currentHexId, onImpactCallback): рассчитывает баллистическую траекторию полета флага отряда из старого гекса в новый с учетом текущего зума/панорамирования, отрисовывает летящий элемент и запускает каскад финальных искр при приземлении.
 * - .focusOnHex(hexId): переносит камеру на выбранное задание: блокирует автоцентрирование на отряде (на 1.8с), плавно сдвигает вьюпорт к координатам квеста, триггерит пульсацию на Canvas и каскад световых лучей, после чего мягко возвращает камеру обратно к флагу.
 * - .toggleQuestTooltips(btnElement): переключает флаг отображения мини-тултипов квестов на Canvas-карте и стилизует саму кнопку.
 */
import AnimationManager from './services/animation_manager.js';

/**
 * SoundPlayer (из ./services/sound_player.js)
 * Музыкальный плеер в монолитном стиле Winamp для фонового сопровождения:
 * - .init(): устанавливает стартовую громкость (0.25), подписывается на события плеера и загружает плейлист.
 * - .loadPlaylist(): асинхронно запрашивает JSON-файл треков, формирует UI-список и кэширует первый трек.
 * - .renderPlaylistUI(): динамически генерирует строки треков в HTML-контейнере и вешает на них обработчики клика.
 * - .formatTrackName(filename): очищает имя файла от расширения `.mp3`, путей и нижних подчеркиваний для красивого вывода.
 * - .loadTrack(idx, startPlaying): загружает аудиофайл по индексу, подсвечивает его в списке, выводит название в бегущую строку (Marquee) и при необходимости запускает воспроизведение.
 * - .toggleMusic(): переключает режимы воспроизведения (PLAY / PAUSE) с обновлением стилей и текста главной кнопки.
 * - .toggleLoop(): включает или выключает бесконечный повтор текущего аудиоклипа.
 * - .togglePlaylistUI(): открывает/закрывает выпадающее окно списка треков с плавной адаптацией соседних блоков интерфейса.
 * - .playNextRandomTrack(): выбирает и запускает случайный трек из плейлиста, гарантируя, что он не повторит текущий.
 * - .updateButtonUI(isPlayingNow): управляет сложным неоновым CSS-свечением и текстом кнопки проигрывателя в зависимости от состояния.
 * - .formatTime(seconds): переводит секунды в привычный человеческий формат времени `Минуты:Секунды` (например, `3:05`).
 * - .attachEvents(): регистрирует массив слушателей: клики по кнопкам управления (Shuffle, Loop, Timeline), апдейты ползунка громкости, автоматический переход на следующий трек по окончании воспроизведения и закрытие списка по клику вне плеера.
 */
import SoundPlayer from './services/sound_player.js';

/**
 * TouchInterfaceAdapter (из ./services/touch_interface_adapter.js)
 * Модуль-адаптер для оптимизации интерфейса ввода под мобильные тач-устройства:
 * - .isTouchDevice(): проверяет, поддерживает ли текущий браузер и экран сенсорное управление (Touch API).
 * - .adaptiveInputField(element, promptMessage): блокирует вызов стандартной экранной клавиатуры на смартфонах (делает поле readonly), перегружая клик на вызов нативного окна `prompt()`, и генерирует событие `input` для обновления формы после ввода.
 */
//import TouchInterfaceAdapter from './services/touch_interface_adapter.js';

/**
 * ViewportManager (из ./services/viewport_manager.js)
 * Диспетчер управления интерактивным окном просмотра: скролл, зум, тач-перемещение и кадрирование:
 * - .init(): кэширует узлы вьюпорта, регистрирует обработчики мыши/тача, предотвращает ложные клики при перетаскивании и инициализирует графическую рамку.
 * - .getHasMoved() / .resetHasMoved(): возвращают и сбрасывают статус «карта сдвинулась», помогая отличить drag-перемещение от обычного клика по гексу.
 * - .attachMouseEvents(): настраивает перетаскивание карты мышью, отслеживает выход за пределы экрана и масштабирование колесиком (MouseWheel) с изменением коэффициента зума.
 * - .attachTouchEvents(): реализует плавный свайп карты на смартфонах, считывая координаты первого касания (Touch Events).
 * - .processMove(pageX, pageY): математическое ядро смещения холста: рассчитывает дельту сдвига, взводит флаг `hasMoved` и жестко ограничивает координаты физическими лимитами `limits` из конфигурации.
 * - .updateMapTransform(): применяет итоговую CSS-трансформацию `translate3d` и `scale` к холсту через requestAnimationFrame и просит FrameManager перерисовать декоративную рамку вокруг видимой зоны.
 * - .focusOnSquad(): автоматическая камера; если пользователь не тащит карту руками и нет блокировки фокуса на квесте, метод находит гекс с флагом `squadHere` и математически центрирует экран точно на позиции отряда.
 */
import ViewportManager from './services/viewport_manager.js';

// ============================================================================
// ИМПОРТЫ: СИНХРОНИЗАЦИЯ И ИНТЕРФЕЙС (SYNC, UI & UTILS)
// ============================================================================

/**
 * HexUiSyncer (из ./sync/hex_ui_syncer.js)
 * Модуль сквозной синхронизации данных с физическими DOM-слоями и маркерами гексов:
 * - .init(): кэширует корневой узел визуального слоя (`#visualLayer`) для последующего встраивания элементов.
 * - .createSubLayers(vHex, hexId, cx, cy, radius, data): выполняет первичную сборку структуры гекса при генерации сетки:
 *   создает фоновую подложку цвета (.hex-shape), текстовые рамки названий и характеристик, контейнеры для четырех иконок
 *   (разведка, карта, объект, ландшафт) и статического флага отряда, наполняя их стартовыми данными.
 * - .sync(hexId, formData, oldHexId): выполняет реактивное обновление гекса на карте после закрытия формы — переключает
 *   классы подсветки отряда, изменяет тексты плашек, включает/скрывает нужные эмодзи, перекрашивает фон, обновляет парящие
 *   квесты и запускает анимацию баллистического перелета флага (`AnimationManager.playFlagFlight`), если отряд сменил позицию.
 * - .updateQuestTooltip(vHex, hexId, targetX, targetY, title): локальный хелпер для добавления или позиционирования
 *   парящего над верхней границей гекса мини-тултипа активного задания с геральдической лилией `⚜️`.
 * - .clear(hexId): полностью сбрасывает оформление гекса до дефолтных системных значений при его удалении из базы данных.
 */
//import HexUiSyncer from './sync/hex_ui_syncer.js';

/**
 * FrameManager (из ./ui/frame_manager.js)
 * Менеджер адаптивной рамки вьюпорта, рассчитывающий динамическое кадрирование карты и рунические эффекты:
 * - .init(): кэширует DOM-узел рамки `.kingmaker-frame` и инициализирует элементы управления темами оформления.
 * - .initFrameStyleControls(): настраивает кнопку циклического переключения визуальных тем рамки («Без рун» -> «С рунами» -> «Орнамент»), сохраняя выбор в LocalStorage.
 * - .applyFrameStyle(styleId): применяет CSS-классы выбранной темы, генерирует обязательные угловые элементы рамки и при необходимости запускает рендер рун.
 * - .updateBounds(viewport, mapContainer, currentZoom): математическое ядро кадрирования: вычисляет пересечение границ вьюпорта и холста карты, сдвигает физическую рамку под видимую зону экрана и накладывает динамическую маску `clipPath: inset(...)` на холст, чтобы карта не вылезала за пределы декоративных границ.
 * - .updateFrameRunes(width, height): распределяет скандинавские руны из массива `RUNE_POOL` по всему периметру рамки с фиксированным шагом, накладывая на каждую случайную задержку анимации мерцания.
 */
//import FrameManager from './ui/frame_manager.js';

/**
 * HexModal (из ./ui/hex_modal.js)
 * Модуль управления интерактивным модальным окном редактирования метаданных гекса:
 * - .init({ onSave, onDelete }): сохраняет ссылки на внешние коллбэки сохранения/удаления, настраивает структуру палитры, группирует поля и регистрирует слушатели.
 * - .initColorPresets(): динамически строит круглые кнопки выбора цвета заливки на базе пресетов из конфига, связывая их со скрытым полем формы.
 * - .assembleActionButtons(): DOM-хак для выстраивания кнопок управления («Удалить», «Отмена», «Сохранить») в ровную, адаптивную Flex-строку.
 * - .groupMenuFields(): группирует разрозненные строки выпадающих списков (Тип/Ландшафт и Сложность/Уровень) в компактные двухколоночные блоки.
 * - .open(hexId, hexData): открывает окно, сбрасывает или наполняет поля формы текущими данными гекса (включая блок квестов и слухов), принудительно синхронизирует кастомные селекты, активирует адаптер ввода и подсвечивает выбранный цвет в палитре.
 * - .setupTouchInterface(inpTitle, inpDesc, inpRumorDesc): делегирует текстовые инпуты специализированному тач-адаптеру для удобного ввода на мобильных устройствах.
 * - .close(): убирает фокус с активных полей ввода через `blur()` и скрывает модальное окно с экрана.
 * - .save(): собирает все заполненные чекбоксы, строки и кастомные объекты формы в единый стандартизированный пакет `formData` и отправляет его в коллбэк.
 * - .delete(): передает ID текущего гекса в коллбэк удаления для полной очистки его истории.
 * - .syncColorPresets(currentColor): сверяет текущий цвет гекса с палитрой кнопок и вешает класс `active` на подходящую кнопку (с конвертацией hex в rgb).
 * - .hexToRgbStandard(hex): вспомогательный конвертер для корректного сравнения строковых стилей CSS-цвета кнопки с hex-значением из базы.
 * - .attachEvents(): вешает стандартные обработчики кликов на управляющие кнопки формы и закрывает окно при клике на полупрозрачную подложку оверлея.
 */
import HexModal from './ui/hex_modal.js';

/**
 * LayoutManager (из ./ui/layout_manager.js)
 * Модуль глобальной структуры макета, отвечающий за адаптивность интерфейса и верстку вспомогательных панелей:
 * - .init(): инициализирует аккордеон легенды, вешает глобальный ресайз окна и запускает первичное появление рамки.
 * - .initLegendAccordion(): настраивает раскрывающуюся панель легенды карты — рассчитывает точную высоту `scrollHeight` внутреннего контента для плавного CSS-раскрытия и меняет стрелочки-индикаторы (`🔽` / `🔼`).
 * - .attachResizeEvent(): слушает изменение размеров окна браузера и просит `ViewportManager` мгновенно скорректировать масштаб и положение холста.
 * - .revealMapFrame(): плавно проявляет рамку (`opacity: 1`) через небольшой таймаут после полной загрузки страницы для исключения визуальных подергиваний.
 */
import LayoutManager from './ui/layout_manager.js';

/**
 * UiPanelManager (из ./ui/ui_panel_manager.js)
 * Диспетчер управления глобальными боковыми панелями интерфейса, Winamp-плеером и режимами тултипов:
 * - .init(): кэширует элементы управления Winamp-оболочки, угловой мастер-кнопки и боковой панели кнопок.
 * - .attachEvents(): связывает логику интерфейса: кнопка «_» сворачивает только Winamp-плеер; клик по главной шестеренке (`masterToggleBtn`) вращает ее, выдвигает/задвигает правую панель кнопок и синхронно управляет состоянием плеера, а кнопка переключения тултипов перенаправляет команду в менеджер анимаций.
 */
import UiPanelManager from './ui/ui_panel_manager.js';

/**
 * ColorConverter (из ./utils/helpers.js)
 * Вспомогательный статический модуль общих утилит для проведения низкоуровневых операций с цветом:
 * - .hexToRgba(hex, alpha): парсит hex-строку формата `#RRGGBB` и возвращает готовую для CSS/Canvas строку `rgba(r, g, b, alpha)`.
 * - .hexToRgbStandard(hex): конвертирует шестнадцатеричный hex-код в стандартную строку формата `rgb(r, g, b)`.
 */
//import { ColorConverter } from './utils/helpers.js';

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
        window.HexCanvasRender = HexCanvasRender;

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
