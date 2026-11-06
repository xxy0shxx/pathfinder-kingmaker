// QuestManager.js
import { MAP_CONFIG } from '../config/app_config.js';
import KingdomManager from './kingdom_manager.js'; // Подключаем менеджер королевства

/**
 * Модуль для управления Журналом заданий, вкладками и слухами Королевства
 */
const QuestManager = {
    currentFilter: 'active',
    mapDataRef: null,
    focusCallback: null,

    /**
     * Инициализация менеджера квестов
     */
    init(mapData, onHexFocus) {
        this.mapDataRef = mapData;
        this.focusCallback = onHexFocus;

        this.initDOMPlacement();
        this.initTabs();
        this.initUnifiedUICollapse();

//        window.QuestManager = this;
    },

    /**
     * Перемещение контейнера журнала в корень body
     */
    initDOMPlacement() {
        const questLogContainerEl = document.getElementById('questLogContainer');
        if (questLogContainerEl) {
            document.body.appendChild(questLogContainerEl);

            // Добавляем кнопку закрытия "×", если её нет
            const questHeader = questLogContainerEl.querySelector('.quest-log-header');
            if (questHeader && !questHeader.querySelector('.btn-close-quest-log')) {
                const closeBtn = document.createElement('button');
                closeBtn.type = 'button';
                closeBtn.className = 'btn-close-quest-log';
                closeBtn.innerHTML = '×';
                closeBtn.title = 'Закрыть журнал заданий';

                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    questLogContainerEl.classList.add('ui-collapsed');



                    const btnToggleQuests = document.getElementById('btnToggleQuests');
                    if (btnToggleQuests) btnToggleQuests.removeAttribute('style');
                    const btnToggleCamping = document.getElementById('btnToggleCamping');
                    if (btnToggleCamping) btnToggleCamping.removeAttribute('style');
                });
                questHeader.appendChild(closeBtn);
            }
        }
    },


    /**
     * Инициализация вкладок (Активные / Завершенные / Слухи / Королевство)
     */
    initTabs() {
        const tabActive = document.getElementById('tabActiveQuests');
        const tabCompleted = document.getElementById('tabCompletedQuests');
        const tabRumors = document.getElementById('tabRumors');
        const tabKingdom = document.getElementById('tabKingdom');
        const tabCamping = document.getElementById('tabCamping');

        if (tabActive && tabCompleted && tabRumors) {
            tabActive.addEventListener('click', () => this.setActiveTab(tabActive, 'active'));
            tabCompleted.addEventListener('click', () => this.setActiveTab(tabCompleted, 'completed'));
            tabRumors.addEventListener('click', () => this.setActiveTab(tabRumors, 'rumors'));
        }

        // Подключаем слушатель для вкладки королевства, если она добавлена в HTML
        if (tabKingdom) {
            tabKingdom.addEventListener('click', () => this.setActiveTab(tabKingdom, 'kingdom'));
        }

        if (tabCamping) {
            tabCamping.addEventListener('click', () => this.setActiveTab(tabCamping, 'camping'));
        }

        const tabCloseJournal = document.getElementById('tabCloseJournal');
        if (tabCloseJournal) {
            tabCloseJournal.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Закрываем модальное окно журнала
                const questLogContainerEl = document.getElementById('questLogContainer');
                if (questLogContainerEl) {
                    questLogContainerEl.classList.add('ui-collapsed');
                }

                // Сбрасываем зеленую подсветку утилит на боковой панели 3х4
                const btnToggleQuests = document.getElementById('btnToggleQuests');
                if (btnToggleQuests) btnToggleQuests.removeAttribute('style');

                const btnToggleCamping = document.getElementById('btnToggleCamping');
                if (btnToggleCamping) btnToggleCamping.removeAttribute('style');
            });
        }

    },


    /**
     * Переключение активной вкладки
     */
    setActiveTab(tabElement, filterName) {
        document.querySelectorAll('.quest-tab-btn').forEach(btn => btn.classList.remove('active'));
        tabElement.classList.add('active');
        this.currentFilter = filterName;
        this.render();
    },

    /**
     * Настройка открытия/закрытия панелей по кнопкам интерфейса
     */
// QuestManager.js — Финальная и неубиваемая логика открытия панелей
    initUnifiedUICollapse() {
        const questLog = document.getElementById('questLogContainer');
        const btnToggleQuests = document.getElementById('btnToggleQuests');
        const btnToggleCamping = document.getElementById('btnToggleCamping'); // Подключаем кнопку привала напрямую

        // 1. Единый обработчик для кнопки Квестов
        if (btnToggleQuests && questLog) {
            btnToggleQuests.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();

                // Переключаем фильтр на обычные активные квесты
                this.currentFilter = 'active';

                // Переключаем вкладки кнопок в дефолтный статус
                document.querySelectorAll('.quest-tab-btn').forEach(btn => btn.classList.remove('active'));
                const tabActive = document.getElementById('tabActiveQuests');
                if (tabActive) tabActive.classList.add('active');

                const isLogCollapsed = questLog.classList.toggle('ui-collapsed');
                if (!isLogCollapsed) {
                    // Убираем подсветку с кнопки привала ГМа, если она была активна
                    if (btnToggleCamping) btnToggleCamping.removeAttribute('style');

                    // Включаем зеленую подсветку кнопке квестов
                    btnToggleQuests.style.setProperty('background', 'linear-gradient(180deg, #1e3c27 0%, #112417 100%)', 'important');
                    btnToggleQuests.style.setProperty('border-color', '#dfbc6f', 'important');
                    btnToggleQuests.style.setProperty('color', '#dfbc6f', 'important');
                    this.render();
                } else {
                    btnToggleQuests.removeAttribute('style');
                }
            });
        }

        // 2. Единый перехватчик для кнопки Привала
        if (btnToggleCamping && questLog) {
            btnToggleCamping.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();

                const campTablet = document.getElementById('campingTabletContainer');
                const isCurrentlyCollapsed = questLog.classList.contains('ui-collapsed');
                const isCampVisible = campTablet && campTablet.style.display === 'flex';

                // Логика открытия/закрытия
                if (isCurrentlyCollapsed) {
                    questLog.classList.remove('ui-collapsed');
                } else if (isCampVisible) {
                    questLog.classList.add('ui-collapsed');
                    btnToggleCamping.removeAttribute('style');
                    return;
                }

                // Жестко блокируем фильтр квестов на значении привала
                this.currentFilter = 'camping';

                // Сбрасываем подсветку с кнопки квестов на правой панели
                if (btnToggleQuests) btnToggleQuests.removeAttribute('style');

                // === НОВЫЙ КОД: Переключаем визуальную подсветку табов ЖУРНАЛА ===
                document.querySelectorAll('.quest-tab-btn').forEach(btn => btn.classList.remove('active'));
                const tabCamping = document.getElementById('tabCamping');
                if (tabCamping) {
                    tabCamping.classList.add('active'); // Намертво включаем подсветку вкладки "Привал ГМа"
                }

                this.render();

                if (window.CampingManager) {
                    window.CampingManager.recalculateCamp();
                }

                // Включаем зеленую подсветку быстрой кнопке привала на панели 3х4
                btnToggleCamping.style.setProperty('background', 'linear-gradient(180deg, #1e3c27 0%, #112417 100%)', 'important');
                btnToggleCamping.style.setProperty('border-color', '#dfbc6f', 'important');
                btnToggleCamping.style.setProperty('color', '#dfbc6f', 'important');
            });
        }
    },


    /**
     * Обновление данных карты внутри менеджера (вызывать при импорте новых файлов)
     */
    updateMapData(newMapData) {
        this.mapDataRef = newMapData;
    },


    /**
     * Генерация списка заданий и слухов в дневнике / Отрисовка планшетов ГМа и Королевства
     */
    render() {
        const listContainer = document.getElementById('questLogList');
        const kingdomTabletEl = document.getElementById('kingdomTabletContainer');
        const campingTabletEl = document.getElementById('campingTabletContainer');
        if (!this.mapDataRef) return;

        // 1. РЕЖИМ ПРИВАЛА ГМА
        if (this.currentFilter === 'camping') {
            if (listContainer) listContainer.style.display = 'none';
            if (kingdomTabletEl) kingdomTabletEl.style.display = 'none';
            if (campingTabletEl) {
                campingTabletEl.style.display = 'flex';
                // Автоматически запускаем перерасчет параметров при переходе на вкладку
                if (window.CampingManager) {
                    window.CampingManager.recalculateCamp();
                }
            }
            return; // Прерываем выполнение стандартного рендера квестов
        }

        // 2. РЕЖИМ ПЛАНШЕТА КОРОЛЕВСТВА
        else if (this.currentFilter === 'kingdom') {
            if (listContainer) listContainer.style.display = 'none';
            if (campingTabletEl) campingTabletEl.style.display = 'none';
            if (kingdomTabletEl) {
                kingdomTabletEl.style.display = 'flex';
                KingdomManager.renderUi(); // Обновляем и выводим интерфейс планшета
            }
            return; // Прерываем выполнение стандартного рендера квестов
        }

        // 3. СТАНДАРТНЫЙ РЕЖИМ КВЕСТОВ И СЛУХОВ
        else {
            if (kingdomTabletEl) kingdomTabletEl.style.display = 'none';
            if (campingTabletEl) campingTabletEl.style.display = 'none';
            if (listContainer) listContainer.style.display = 'flex';
        }

        if (!listContainer) return;
        listContainer.innerHTML = '';
        let count = 0;
        const filterStatus = this.currentFilter;

        for (let hexId in this.mapDataRef) {
            const hex = this.mapDataRef[hexId];
            if (!hex) continue;

            if (filterStatus === 'rumors') {
                if (hex.rumorText && hex.rumorText.trim() !== '') {
                    count++;
                    const rumorItem = document.createElement('div');
                    rumorItem.className = 'quest-log-item status-rumor';

                    rumorItem.innerHTML = `
                        <div class="quest-item-title">👂 Наводка / Слух</div>
                        <div class="quest-item-location">📍 Место действия: ${hex.title || hexId.replace('hex_', 'Гекс ')}</div>
                        <div class="quest-item-desc">${hex.rumorText.replace(/\n/g, '<br>')}</div>
                    `;

                    rumorItem.addEventListener('click', () => {
                        if (this.focusCallback) this.focusCallback(hexId);
                        const questLog = document.getElementById('questLogContainer');
                        if (questLog) questLog.classList.add('ui-collapsed');
                    });

                    listContainer.appendChild(rumorItem);
                }
            }
            else {
                if (hex.questData && hex.questData.status === filterStatus) {
                    count++;
                    const questItem = document.createElement('div');
                    questItem.className = `quest-log-item status-${filterStatus}`;

                    const objIcon = MAP_CONFIG.types[hex.type]?.icon || '⚜️';

                    questItem.innerHTML = `
                        <div class="quest-item-title">${objIcon} ${hex.questData.title}</div>
                        <div class="quest-item-location">📍 Регион: ${hex.title || hexId.replace('hex_', 'Гекс ')}</div>
                        ${hex.questData.desc ? `<div class="quest-item-desc">${hex.questData.desc.replace(/\n/g, '<br>')}</div>` : ''}
                    `;

                    questItem.addEventListener('click', () => {
                        if (this.focusCallback) this.focusCallback(hexId);
                        const questLog = document.getElementById('questLogContainer');
                        if (questLog) questLog.classList.add('ui-collapsed');
                    });

                    listContainer.appendChild(questItem);
                }
            }
        }

        if (count === 0) {
            const emptyMessage = MAP_CONFIG.messages.questEmpty[filterStatus] || 'Пусто';
            listContainer.innerHTML = `<div class="quest-log-empty">${emptyMessage}</div>`;
        }
    }


};

export default QuestManager;
