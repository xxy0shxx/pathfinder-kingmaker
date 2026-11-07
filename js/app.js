// ============================================================================
// ИМПОРТЫ: КОНФИГУРАЦИЯ И СИСТЕМНОЕ УПРАВЛЕНИЕ (CONFIG & CONTROLLER)
// ============================================================================

/**
 * MAP_CONFIG (из ./config/app_config.js)
 * Глобальный объект конфигурации карты, лимитов и игровых механик:
 * - .isGlobalFogEnabled: [НОВОЕ] Сквозной реактивный флаг мгновенного включения/отключения тумана на глобальной Canvas-карте.
 * - .grid: геометрия гекса (радиус 77.96), сетка (12х30), смещения и лимит сложности (maxDcLevel = 40).
 * - .viewport: параметры зума (0.5x - 3.0x) и жесткие границы прокрутки холста canvas.
 * - .types & .terrains: справочники типов объектов и ландшафтов со статичными СЛ проверок случайных сцен (Равнины = 12, Лес = 14 и т.д.).
 * - .messages & .audio: тексты для пустого дневника и дефолтные настройки громкости Winamp-панели.
 */
import { MAP_CONFIG } from './config/app_config.js';

/**
 * UiSelectManager (из ./controller/ui_select_manager.js)
 * Контроллер кастомных выпадающих списков интерфейса (.custom-select):
 * - .init(): запускает генерацию опций и вешает обработчики кликов на выпадающие меню.
 * - .populateSelectOptions(): динамически создает элементы выбора «СЛ» и «Уровней» до значения maxDcLevel.
 * - .initDropdownLogic(): управляет переключением классов активности, закрытием других списков и записью в hidden-инпуты.
 * - .setCustomSelectValue(id, val): метод для принудительной синхронизации значения селекта из внешних модулей.
 */
import UiSelectManager from './controller/ui_select_manager.js';

/**
 * FogManager (из ./controller/fog_manager.js)
 * Контроллер «Тумана Войны» на интерактивной карте:
 * - .syncMapFog(hexesData): [ОБНОВЛЕНО] Больше не работает со старыми HTML-нодами. Передает актуальный стейт гексов в Canvas-рендер, сигнализируя движку о необходимости перерисовать маску скрытия.
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
 * - .drawSingleHex(cx, cy, r, data, hexKey): [ОБНОВЛЕНО] Послойно рендерит один гекс: заливка цветом -> туман войны (с учетом абсолютного отключения по кнопке ГМа) -> свечение -> маркеры -> флаг -> плашки текста.
 * - .drawQuestPlate(ctx, text, x, y): рисует фиолетово-золотую плашку парящего мини-тултипа для активного квеста.
 * - .drawHoverEffect(cx, cy, r): накладывает полупрозрачную темную маску и золотую рамку на гекс под курсором.
 * - .drawTextPlate(ctx, text, x, y, isStats, isLargeTitle): генерирует темную подложку с рамкой для названия региона или его кубиков/черепов сложности.
 * - .drawCanvasFlag(cx, cy): рисует развевающийся флаг отряда, высчитывая угол покачивания по тригонометрической формуле от текущего времени.
 * - .attachMouseEvents(): отслеживает движение мыши, переводит экранные координаты в виртуальные (с учетом зума) и двигает HTML-тултип.
 * - .updateTooltipState(tooltip): [ОБНОВЛЕНО] Динамически генерирует сложное HTML-содержимое для всплывающего окна подсказки (статусы, СЛ, описание) без использования неопределенных графических координат.
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
/*import HexManager from './core/hex_manager.js';*/

/**
 * CampingManager (из ./core/camping_manager.js)
 * Управляющий контроллер калькулятора привала настольной ролевой игры (Camping Engine):
 * - .init(mapData, onSave): точка входа; подгружает состояние лагеря из сейва, синхронизирует базовые проверки и вешает слушатели.
 * - .updateMapData(newMapData): реактивно обновляет структуру привала и пересчитывает математику сцен при импорте внешних файлов.
 * - .changeBaseChecks(amount): инкрементирует или декрементирует базовое число обязательных дежурств/проверок отряда кнопками «-» и «+».
 * - .syncCountersUi(): синхронизирует числовые значения базового количества проверок на фронтенд-панели калькулятора.
 * - .getSelectedRadio(name): вспомогательный метод, возвращающий текстовый статус (КУ, У, П, КП) выбранной радиокнопки действия.
 * - .recalculateCamp(): [ОБНОВЛЕНО] Ядро калькулятора лагеря; находит текущий гекс с отрядом, автоматически считывает его ландшафт и базовую СЛ случайной сцены из MAP_CONFIG, рассчитывает модификаторы сложности действий и определяет объемы добытых ингредиентов. Навыки рендерятся внутри единых рамок действий в нижнем регистре.
 * - .renderCalculatedUi(camoRes, prepareRes, huntRes, isCampHorrible, lvl, specialYieldText, terrainLabel): визуализатор итогов; выводит числовые показатели на фронт, динамически инжектит позолоченные рамки навыков (.skill-name-large) в строки и формирует игровой лог эффектов.
 * - .addLogLine(container, text, type): хелпер логирования; создает текстовую CSS-строку эффекта с геральдической лилией «⚜» в зависимости от исхода проверки.
 * - .attachInputListeners(): регистрирует делегированные слушатели изменений состояния радиокнопок таблицы и прогрева AudioContext плеера.
 * - .checkCampPhaseCompletion(): проверяет заполненность всех этапов привала для автоматического завершения фазы планирования лагеря.
 * - .triggerDiceAndResultModal(): запускает трехмерную анимацию куба D20 на ТВ-экране и плавно выводит модальное окно с итоговыми результатами.
 * - .saveFromUi(): сохраняет слепок привала в LocalStorage, закрывает интерфейс, анимирует кнопку сохранения и обновляет фильтры лога.
 * - .resetToDefault(): производит полный сброс радиокнопок таблицы, возвращает дефолтные параметры и анимирует кнопку сброса.
 */
import CampingManager from './core/camping_manager.js';

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
 * - .render(): [ОБНОВЛЕНО] Берет координаты из Canvas-рендера и генерирует единую высокопроизводительную цепочку линий через один тег <path> золотого цвета.
 */
import PathManager from './core/path_manager.js';

/**
 * QuestManager (из ./core/quest_manager.js)
 * Управляющий менеджер Квест-лога, дневника слухов и наводок:
 * - .init(mapData, onHexFocus): инициализирует DOM-структуру, переключатели вкладок и раскрытие панели.
 * - .initDOMPlacement(): переносит container журнала в корень body для правильного отображения слоев и встраивает кнопку закрытия «×».
 * - .initTabs(): регистрирует клики на кнопки фильтров (Активные / Завершенные / Слухи / Планшет Королевства).
 * - .setActiveTab(tabElement, filterName): переключает CSS-классы активной вкладки и обновляет контент.
 * - .initUnifiedUICollapse(): управляет кнопкой разворачивания журнала квестов и стилизует её при открытии.
 * - .updateMapData(newMapData): обновляет внутреннюю ссылку на базу гексов при импорте.
 * - .render(): собирает по всем гексам активные квесты или слухи, генерирует карточки заданий с иконками и выводит их списком.
 */
import QuestManager from './core/quest_manager.js';

/**
 * StorageManager (из ./core/storage_manager.js)
 * Шлюз сохранения и автоматической миграции структуры базы данных LocalStorage:
 * - .loadData(): загружает строку JSON, проверяет формат и автоматически мигрирует старую плоскую структуру в новую вложенную ({hexes, kingdom, paths}).
 * - .saveData(data): сериализует объект данных в JSON-строку и записывает в LocalStorage под ключом 'hexMapSystemData'.
 * - .updateHex(globalMapData, hexId, formData): обновляет поля конкретного гекса, проставляет дату сохранения и флаг посещения.
 * - .moveSquad(globalMapData, newHexId): ищет старый гекс с флагом squadHere=true, снимает его, переносит на новый hexId и возвращает старый ID.
 * - .deleteHex(globalMapData, hexId): полностью стирает гекс из дерева данных и перезаписывает хранилище.
 */
import StorageManager from './core/storage_manager.js';

// ============================================================================
// ИМПОРТЫ: СЕРВИСЫ И ВСПОМОГАТЕЛЬНЫЕ СИСТЕМЫ (SERVICES)
// ============================================================================

/**
 * AnimationManager (из ./services/animation_manager.js)
 * Модуль для управления анимациями, процедурным аудиосинтезом и трехмерными эффектами на карте:
 * - .createBurst(bx, by): создает радиальный взрыв из 8 золотых искр в указанных экранных координатах (эффект удара флага).
 * - .spawnBeamsBurst(cx, cy, scale): генерирует сочную геральдическую вспышку из 6 золотых лучей с возможностью масштабирования.
 * - .warmUpAudioContext(): прогревает и активирует Web Audio API контекст при первом клике пользователя для обхода ограничений браузеров на автовоспроизведение звуков.
 * - ._playDiceSoundEffects(): [НОВОЕ] Внутреннее звуковое ядро; процедурно синтезирует реалистичный звук катящейся кости по столу, генерируя каскад из 22 затухающих по частоте и громкости щелчков через треугольные осцилляторы и полосовые фильтры.
 * - .playFlagFlight(oldHexId, currentHexId, onImpactCallback): рассчитывает баллистическую траекторию полета флага отряда из старого гекса в новый с учетом зума и панорамирования, отрисовывает летящий элемент и запускает каскад финальных искр при приземлении.
 * - .focusOnHex(hexId): переносит камеру на выбранное задание: блокирует автоцентрирование на отряде (на 1.8с), плавно сдвигает вьюпорт к координатам квеста, триггерит пульсацию на Canvas и каскад световых лучей, после чего мягко возвращает камеру обратно к флагу.
 * - .toggleQuestTooltips(btnElement): переключает флаг отображения мини-тултипов квестов на Canvas-карте и стилизует саму кнопку.
 * - .playCampDiceAnimation(targetDc, onCompleteCallback): [НОВОЕ] Полноценный трехмерный графический движок; вычисляет точный вектор нормали к целевой грани икосаэдра (D20), проецирует 3D-вершины треугольников без сплющивания, рассчитывает яркость теней по направлению света, воспроизводит процедурный звук броска, плавно доворачивает кость нужной гранью в экран и подсвечивает критические исходы («20», «1» или лилию «⚜»).
 */
import AnimationManager from './services/animation_manager.js';

/**
 * SoundPlayer (из ./services/sound_player.js)
 * Музыкальный плеер в монолитном стиле Winamp для фонового сопровождения:
 * - .init(): устанавливает стартовую громкость (0.25), подписывается на события плеера и загружает плейлист.
 * - .loadPlaylist(): асинхронно запрашивает JSON-файл треков, формирует UI-список и кэширует первый трек.
 * - .renderPlaylistUI(): динамически генерирует строки треков в HTML-контейнере и вешает на них обработчики клика.
 * - .formatTrackName(filename): очищает имя файла от расширения `.mp3`, путей и нижних подчеркиваний для красивого вывода.
 * - .loadTrack(idx, startPlaying): загружает аудиофайл по индексу, подсвечивает его в списке, выводит название в бегущую строку (Marquee).
 * - .toggleMusic(): переключает режимы воспроизведения (PLAY / PAUSE) с обновлением стилей и текста главной кнопки.
 * - .toggleLoop(): включает или выключает бесконечный повтор текущего аудиоклипа.
 * - .togglePlaylistUI(): открывает/закрывает выпадающее окно списка треков с плавной адаптацией соседних блоков интерфейса.
 * - .playNextRandomTrack(): выбирает и запускает случайный трек из плейлиста, гарантируя, что он не повторит текущий.
 * - .updateButtonUI(isPlayingNow): управляет сложным неоновым CSS-свечением и текстом кнопки проигрывателя в зависимости от состояния.
 * - .formatTime(seconds): переводит секунды в привычный человеческий формат времени `Минуты:Секунды`.
 * - .attachEvents(): регистрирует массив слушателей: клики по кнопкам управления (Shuffle, Loop, Timeline), апдейты ползунка громкости, автоматический переход на следующий трек и закрытие списка по клику вне плеера.
 */
import SoundPlayer from './services/sound_player.js';

/**
 * TouchInterfaceAdapter (из ./services/touch_interface_adapter.js)
 * Модуль-адаптер для оптимизации интерфейса ввода под мобильные тач-устройства:
 * - .isTouchDevice(): проверяет, поддерживает ли текущий браузер и экран сенсорное управление (Touch API).
 * - .adaptiveInputField(element, promptMessage): блокирует вызов стандартной экранной клавиатуры на смартфонах (делает поле readonly), перегружая клик на вызов нативного окна `prompt()`, и генерирует событие `input` для обновления формы после ввода.
 */
/* import TouchInterfaceAdapter from './services/touch_interface_adapter.js';*/

/**
 * ViewportManager (из ./services/viewport_manager.js)
 * Диспетчер управления интерактивным окном просмотра: скролл, зум, тач-перемещение и кадрирование:
 * - .init(): кэширует узлы вьюпорта, регистрирует обработчики мыши/тача, предотвращает ложные клики при перетаскивании и инициализирует графическую рамку.
 * - .getHasMoved() / .resetHasMoved(): возвращают и сбрасывают статус «карта сдвинулась», помогая отличить drag-перемещение от обычного клика.
 * - .attachMouseEvents(): настраивает перетаскивание карты мышью, отслеживает выход за пределы экрана и масштабирование колесиком с изменением коэффициента зума.
 * - .attachTouchEvents(): реализует плавный свайп карты на смартфонах, считывая координаты первого касания (Touch Events).
 * - .processMove(pageX, pageY): математическое ядро смещения холста: рассчитывает дельту сдвига, взводит флаг `hasMoved` и жестко ограничивает координаты физическими лимитами.
 * - .updateMapTransform(): применяет итоговую CSS-трансформацию `translate3d` и `scale` к холсту через requestAnimationFrame и просит FrameManager перерисовать декоративную рамку вокруг видимой зоны.
 * - .focusOnSquad(): автоматическая камера; если пользователь не тащит карту руками и нет блокировки фокуса на квесте, метод находит гекс с флагом `squadHere` и математически центрирует экран точно на позиции отряда.
 */
import ViewportManager from './services/viewport_manager.js';

// ============================================================================
// ИМПОРТЫ: СИНХРОНИЗАЦИЯ И ИНТЕРФЕЙС (SYNC, UI & UTILS)
// ============================================================================

/**
 * HexUiSyncer (из ./sync/hex_ui_syncer.js)
 * Реактивный синклер, связывающий внутреннюю базу данных гексов с их физическим представлением:
 * - .init(): кэширует корневой узел визуального слоя (`#visualLayer`) для последующего встраивания элементов.
 * - .createSubLayers(vHex, hexId, cx, cy, radius, data): выполняет сборку структуры гекса, настраивает цвета заливки, фоновые подложки и маркеры.
 * - .sync(hexId, formData, oldHexId): выполняет сквозное обновление гекса на карте после закрытия формы — переключает классы, изменяет тексты плашек, включает/скрывает нужные эмодзи и запускает баллистический перелет флага отряда.
 * - .clear(hexId): полностью сбрасывает оформление гекса до дефолтных системных значений при его удалении из базы данных.
 */
//import HexUiSyncer from './sync/hex_ui_syncer.js';

/**
 * FrameManager (из ./ui/frame_manager.js)
 * Менеджер адаптивной рамки вьюпорта, рассчитывающий динамическое кадрирование карты и рунические эффекты:
 * - .init(): кэширует DOM-узел рамки `.kingmaker-frame` и инициализирует элементы управления темами оформления.
 * - .initFrameStyleControls(): настраивает кнопку циклического переключения визуальных тем рамки («Без рун» -> «С рунами» -> «Орнамент»).
 * - .applyFrameStyle(styleId): применяет CSS-классы выбранной темы, генерирует обязательные угловые элементы рамки и запускает рендер рун.
 * - .updateBounds(viewport, mapContainer, currentZoom): математическое ядро кадрирования visible-зоны экрана и наложение динамической маски `clipPath: inset(...)`.
 * - .updateFrameRunes(width, height): распределяет руны по всему периметру рамки с фиксированным шагом, накладывая случайную задержку анимации мерцания.
 */
//import FrameManager from './ui/frame_manager.js';

/**
 * HexModal (из ./ui/hex_modal.js)
 * Модуль управления интерактивным модальным окном редактирования метаданных гекса:
 * - .init({ onSave, onDelete }): сохраняет ссылки на внешние коллбэки, настраивает палитру, группирует поля и регистрирует слушатели.
 * - .initColorPresets(): динамически строит круглые кнопки выбора цвета заливки на базе пресетов из конфига, связывая их со скрытым полем формы.
 * - .assembleActionButtons(): DOM-хак для выстраивания кнопок управления («Удалить», «Отмена», «Сохранить») в ровную, адаптивную Flex-строку.
 * - .groupMenuFields(): группирует разрозненные строки выпадающих списков (Тип/Ландшафт и Сложность/Уровень) в компактные двухколоночные блоки.
 * - .open(hexId, hexData): открывает окно, сбрасывает или наполняет поля формы текущими данными гекса (включая блок квестов и слухов), принудительно синхронизирует кастомные селекты, активирует адаптер ввода и подсвечивает выбранный цвет в палитре.
 * - .setupTouchInterface(inpTitle, inpDesc, inpRumorDesc): делегирует текстовые инпуты специализированному тач-адаптеру для удобного ввода на мобильных устройствах.
 * - .close(): убирает фокус с active полей ввода и скрывает модальное окно с экрана.
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
 * - .attachEvents(): [ОБНОВЛЕНО] Связывает логику интерфейса: кнопка «_» сворачивает только Winamp-плеер; клик по главной шестеренке вращает ее, выдвигает правую панель кнопок и принудительно скрывает плеер. Новая кнопка «🎵» на панели 3х4 работает как независимый триггер открытия/закрытия плеера.
 */
import UiPanelManager from './ui/ui_panel_manager.js';

/**
 * ColorConverter (из ./utils/helpers.js)
 * Вспомогательный статический модуль общих утилит для проведения низкоуровневых операций с цветом:
 * - .hexToRgba(hex, alpha): парсит hex-строку формата `#RRGGBB` и возвращает готовую для CSS/Canvas строку `rgba(r, g, b, alpha)`.
 * - .hexToRgbStandard(hex): конвертирует шестнадцатеричный hex-код в стандартную строку формата `rgb(r, g, b)`.
 */
//import { ColorConverter } from './utils/helpers.js';

// ============================================================================
// ИМПОРТЫ: ТАКТИЧЕСКАЯ КАРТА (TACTICAL MAP)
// ============================================================================

/**
 * TacticalMapManager (из ./tactical_map/tactical_map_manager.js)
 * Модуль управления тактической боевой картой привала / лагеря (Tactical Grid):
 * - .init(): точка входа; рассчитывает геометрию сетки, безопасно считывает сохраненный прогресс ячеек из LocalStorage и запускает привязку слушателей.
 * - .initMapSelector(): controller переключения режимов (Глобальная карта / Лагерь); вешает клик на мастер-кнопку, меняет её стили и неоновое оформление.
 * - switchMapMode(mode): сбрасывает координаты вьюпорта, динамически подменяет графические ресурсы подложки, размеры холста и слои видимости. Кнопка «Глаз/Очки» теперь доступна на обеих картах.
 * - .buildTacticalGrid(): генерирует и отрисовывает ячейки тактической сетки, используя DocumentFragment в памяти для мгновенного инжекта в DOM без просадки FPS.
 * - .initGridEventDelegation(): архитектурное делегирование событий; регистрирует всего 4 глобальных слушателя на корневом слое вместо тысяч индивидуальных подписок на ячейках (клик, дблклик, mouseenter, mouseleave).
 * - .initFormEventListeners(): настраивает реактивное поведение полей формы модального окна лагеря (конусные AoE, взаимоисключающие чекбоксы Герой/Монстр, автосброс при установке препятствий).
 * - .initCampColorPresets(): динамически выстраивает палитру быстрых кнопок выбора цвета заливки в форме лагеря с поддержкой прозрачности.
 * - .initFogToggleButton(): [ОБНОВЛЕНО] Инициализирует кнопку переключения и скрытия Тумана Войны на тактической карте лагеря, а также полную очистку пелены на глобальном Canvas-экране.
 * - .openTacticalMenu(squareId): открывает окно редактирования ячейки, наполняет поля текущими параметрами, углами направлений AoE и сверяет активный цветовой пресет.
 * - .closeCampMenu(): скрывает модальное окно лагеря и принудительно убирает фокус с текстовых инпута-строк через blur().
 * - .saveTacticalSquare(): собирает параметры из полей формы, рассчитывает флаги посещения, перекрашивает ячейку, сохраняет слепок состояния в LocalStorage и обновляет карту.
 * - .deleteTacticalSquare(): полностью стирает пользовательские метаданные ячейки лагеря из базы данных и сбрасывает все связанные с ней CSS-классы и эмодзи-маркеры.
 * - .recalculateCampFogOfWar(): главный цикл обновления карты лагеря; пошагово распределяет типы ландшафта, накладывает маски видимости тумана, рассчитывает источники света и послойно отрисовывает пересечения цветных AoE-аур через множественные CSS-градиенты с поддержкой отрисовки тонких межклеточных разделителей-стен.
 * - .processEntityAura(id, data, cellAuras, shouldRevealFog): поклеточный просчет радиуса действия источника ауры с интеграцией Line of Sight (LoS) для выявления слепых зон за препятствиями.
 * - .isCellInCone(centerR, centerC, r, c, radius, direction): математический расчет секторов направленного конуса (AoE Cone) под все 8 сторон света (N, S, E, W, NE, SE, SW, NW).
 * - .checkLineOfSight(r1, c1, r2, c2): алгоритм Брезенхэма для трассировки лучей видимости сквозь физические препятствия и тонкие разделительные стены, блокирующие распространение аур.
 * - .calculatePathAndCost(startId, targetId, speedLimit): волновой алгоритм Дейкстры для поиска кратчайшего Pathfinder-маршрута с учетом цены сложного ландшафта, лимита скорости персонажа, штрафа шагов через окна и прыжков через препятствия.
 * - .clearVisualPath(): полностью очищает карту от наложенных следов маршрута перехода, стирая классы путей, текстовые плашки футов и маркеры прыжков.
 * - .showTacticalTooltip(squareId): генерирует и выводит расширенный игровой HTML-тултип ячейки с creepy-детализацией препятствий, ценой движения и динамической калькуляцией Pathfinder-пути от выделенного юнита.
 * - .handleTacticalSquareClick(squareId): управляет выделением (фокусом) существ на карте лагеря при одиночном клике для последующего расчета путей или открывает меню для пустых ячеек.
 * - .bindDragAndDropTargets(square, squareId): реализует Drag-and-Drop интерфейс перемещения токенов персонажей по игровому полю с проверкой занятости клеток и автосохранением.
 */
import TacticalMapManager from './tactical_map/tactical_map_manager.js';

let hasMoved = false;
// Делаем переменную mapData доступной глобально для всех слушателей в этом файле
let mapData = { hexes: {}, kingdom: null, paths: [] };
// true  — флаг ВСЕГДА прилетает из нулевого гекса (hex_0_0)
// false — флаг летит из своей реальной предыдущей позиции
let FLIGHT_FROM_CAPITAL_MODE = true;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Загрузка данных
    mapData = StorageManager.loadData();

    // 2. Инициализация UI-макета и панелей управления
    LayoutManager.init();
    UiPanelManager.init();
    SoundPlayer.init();
    UiSelectManager.init();
    ViewportManager.init();

    // 3. [ОПТИМИЗАЦИЯ] Чистый математический расчет координат БЕЗ создания HTML-нод
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
        svgPathsLayer.classList.add('hide-paths'); // Добавляем класс скрытия на SVG-слой
    }
    if (btnTogglePaths) {
        btnTogglePaths.classList.add('paths-hidden'); // Окрашиваем кнопку в красный цвет
    }

    // 5. Инициализация интерактивного Canvas-рендерера
    const canvasElement = document.getElementById('mapCanvas');
    if (canvasElement) {
        HexCanvasRender.init(canvasElement, mapData.hexes, hexCoordinatesMap);
        window.HexCanvasRender = HexCanvasRender;

        // Если при загрузке страницы уже выбраны руны — сразу запускаем цикл дыхания
        if (localStorage.getItem('kingmakerFrameStyle') === 'runes') {
            HexCanvasRender.startAnimationLoop();
        }

        // Обработка клика по Canvas (вместо старых 360-ти HTML-слушателей)
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
        KingdomManager.updateMapData(mapData);

        if (CampingManager && typeof CampingManager.updateMapData === 'function') {
            CampingManager.updateMapData(mapData);
        }

        // Передаем данные и принудительно запрашиваем один кадр перерисовки
        HexCanvasRender.updateData(mapData.hexes);
        HexCanvasRender.requestFrame();

        setTimeout(() => { PathManager.render(); }, 50);
    });

    // ============================================================================
    // КОЛЛБЭКИ МОДАЛЬНОГО ОКНА ГЕКСА
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
                const finalStartHexId = FLIGHT_FROM_CAPITAL_MODE ? 'hex_0_0' : oldHexId;

                StorageManager.updateHex(mapData, hexId, formData);
                HexCanvasRender.updateData(mapData.hexes, hexId);

                // Запуск анимации полета (внутри заложен автозапуск анимационного цикла)
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
            HexModal.close();
        },

        onDelete: (hexId) => {
            StorageManager.deleteHex(mapData, hexId);
            HexCanvasRender.updateData(mapData.hexes);
            HexModal.close();
        }
    });

    if (CampingManager && typeof CampingManager.init === 'function') {
        CampingManager.init(mapData, () => {
            StorageManager.saveData(mapData); // Используем твой штатный метод сохранения, как в Королевстве
        });
    }

    TacticalMapManager.init(); // Инициализация тактической сетки лагеря
});

// Пишем в корень главного файла, вне любых областей видимости
window.forceOpenCampingGM = function() {
    const campingWindow = document.getElementById('campingLogContainer');
    const questWindow = document.getElementById('questLogContainer');
    const btn = document.getElementById('btnToggleCamping');
    if (!campingWindow) return;

    const isCollapsed = campingWindow.classList.contains('ui-collapsed');

    if (isCollapsed) {
        // Гарантированно закрываем квесты
        if (questWindow) questWindow.classList.add('ui-collapsed');

        // Открываем привал
        campingWindow.classList.remove('ui-collapsed');

        // Считаем параметры ГМа
        if (window.CampingManager) window.CampingManager.recalculateCamp();

        // Подсвечиваем кнопку зеленым геральдическим стилем
        if (btn) {
            btn.style.setProperty('background', 'linear-gradient(180deg, #1e3c27 0%, #112417 100%)', 'important');
            btn.style.setProperty('border-color', '#dfbc6f', 'important');
            btn.style.setProperty('color', '#dfbc6f', 'important');
        }
    } else {
        campingWindow.classList.add('ui-collapsed');
        if (btn) btn.removeAttribute('style');
    }
};




window.closeMenu = () => HexModal.close();

