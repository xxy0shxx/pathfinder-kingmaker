// QuestManager.js — ЧАСТЬ 1 ИЗ 2
import { MAP_CONFIG } from '../config/app_config.js';
import KingdomManager from './kingdom_manager.js';

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
        this.bindGlobalEscapeKey(); // Намертво вешаем хоткей Escape на закрытие
    },

    /**
     * Перемещение контейнера журнала в корень body
     */
    initDOMPlacement() {
        const questLogContainerEl = document.getElementById('questLogContainer');
        if (questLogContainerEl) {
            document.body.appendChild(questLogContainerEl);

            const questHeader = questLogContainerEl.querySelector('.quest-log-header');
            if (questHeader && !questHeader.querySelector('.btn-close-quest-log')) {
                const closeBtn = document.createElement('button');
                closeBtn.type = 'button';
                closeBtn.className = 'btn-close-quest-log';
                closeBtn.innerHTML = '×';
                closeBtn.title = 'Закрыть журнал заданий';

                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.closeFullscreenHUD();
                });
                questHeader.appendChild(closeBtn);
            }
        }
    },

    /**
     * Слушатель клавиши Escape для быстрого закрытия полноэкранного режима
     */
    bindGlobalEscapeKey() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || e.code === 'Escape') {
                const questLog = document.getElementById('questLogContainer');
                if (questLog && !questLog.classList.contains('ui-collapsed')) {
                    e.preventDefault();
                    this.closeFullscreenHUD();
                }
            }
        });
    },

    /**
     * Унифицированный метод полного закрытия HUD и очистки стилей
     */
    closeFullscreenHUD() {
        const questLog = document.getElementById('questLogContainer');
        if (questLog) questLog.classList.add('ui-collapsed');

        const btnToggleQuests = document.getElementById('btnToggleQuests');
        if (btnToggleQuests) btnToggleQuests.removeAttribute('style');

        const btnToggleCamping = document.getElementById('btnToggleCamping');
        if (btnToggleCamping) btnToggleCamping.removeAttribute('style');

        const btnToggleSettings = document.getElementById('btnToggleSettings');
        if (btnToggleSettings) btnToggleSettings.removeAttribute('style');
    },

    /**
     * Инициализация вкладок (Активные / Завершенные / Слухи / Королевство / Привал / Настройки)
     */
    initTabs() {
        const tabActive = document.getElementById('tabActiveQuests');
        const tabCompleted = document.getElementById('tabCompletedQuests');
        const tabRumors = document.getElementById('tabRumors');
        const tabKingdom = document.getElementById('tabKingdom');
        const tabCamping = document.getElementById('tabCamping');
        const tabSettings = document.getElementById('tabSettings');
        const tabInitiative = document.getElementById('tabInitiative');

        if (tabCamping && !document.getElementById('tabWeather')) {
            const tabWeather = document.createElement('button');
            tabWeather.type = 'button';
            tabWeather.id = 'tabWeather';
            tabWeather.className = 'quest-tab-btn';
            tabWeather.title = 'Календарь Голариона и Погода';
            tabWeather.textContent = '⛅';
            tabCamping.insertAdjacentElement('afterend', tabWeather);
        }

        // Контейнер планшета Погоды внутри окна журнала
        const kingdomTablet = document.getElementById('kingdomTabletContainer');
        if (kingdomTablet && !document.getElementById('weatherTabletContainer')) {
            const weatherTablet = document.createElement('div');
            weatherTablet.id = 'weatherTabletContainer';
            weatherTablet.style.cssText = 'display: none; width: 100%; flex-direction: column; overflow-y: auto;';
            kingdomTablet.insertAdjacentElement('afterend', weatherTablet);
        }

        if (tabInitiative) {
            tabInitiative.addEventListener('click', () => this.setActiveTab(tabInitiative, 'initiative'));
        }

        if (tabActive && tabCompleted && tabRumors) {
            tabActive.addEventListener('click', () => this.setActiveTab(tabActive, 'active'));
            tabCompleted.addEventListener('click', () => this.setActiveTab(tabCompleted, 'completed'));
            tabRumors.addEventListener('click', () => this.setActiveTab(tabRumors, 'rumors'));
        }

        if (tabKingdom) tabKingdom.addEventListener('click', () => this.setActiveTab(tabKingdom, 'kingdom'));
        if (tabCamping) tabCamping.addEventListener('click', () => this.setActiveTab(tabCamping, 'camping'));

        const tabWeather = document.getElementById('tabWeather');
        if (tabWeather) tabWeather.addEventListener('click', () => this.setActiveTab(tabWeather, 'weather'));

        if (tabSettings) tabSettings.addEventListener('click', () => this.setActiveTab(tabSettings, 'settings'));

        const tabCloseJournal = document.getElementById('tabCloseJournal');
        if (tabCloseJournal) {
            tabCloseJournal.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                this.closeFullscreenHUD();
            });
        }
    },

    setActiveTab(tabElement, filterName) {
        document.querySelectorAll('.quest-tab-btn').forEach(btn => btn.classList.remove('active'));
        tabElement.classList.add('active');
        this.currentFilter = filterName;
        this.render();
    },
    /**
     * Настройка открытия/закрытия панелей по кнопкам интерфейса
     */
    initUnifiedUICollapse() {
        const questLog = document.getElementById('questLogContainer');
        const btnToggleQuests = document.getElementById('btnToggleQuests');
        const btnToggleCamping = document.getElementById('btnToggleCamping');

        if (btnToggleQuests && questLog) {
            btnToggleQuests.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                this.currentFilter = 'active';

                document.querySelectorAll('.quest-tab-btn').forEach(btn => btn.classList.remove('active'));
                const tabActive = document.getElementById('tabActiveQuests');
                if (tabActive) tabActive.classList.add('active');

                const isLogCollapsed = questLog.classList.toggle('ui-collapsed');
                if (!isLogCollapsed) {
                    if (btnToggleCamping) btnToggleCamping.removeAttribute('style');
                    btnToggleQuests.style.setProperty('background', 'linear-gradient(180deg, #1e3c27 0%, #112417 100%)', 'important');
                    btnToggleQuests.style.setProperty('border-color', '#dfbc6f', 'important');
                    btnToggleQuests.style.setProperty('color', '#dfbc6f', 'important');
                    this.render();
                } else {
                    btnToggleQuests.removeAttribute('style');
                }
            });
        }

        if (btnToggleCamping && questLog) {
            btnToggleCamping.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();

                const campTablet = document.getElementById('campingTabletContainer');
                const isCurrentlyCollapsed = questLog.classList.contains('ui-collapsed');
                const isCampVisible = campTablet && campTablet.style.display === 'flex';

                if (isCurrentlyCollapsed) {
                    questLog.classList.remove('ui-collapsed');
                } else if (isCampVisible) {
                    this.closeFullscreenHUD();
                    return;
                }

                this.currentFilter = 'camping';
                if (btnToggleQuests) btnToggleQuests.removeAttribute('style');

                document.querySelectorAll('.quest-tab-btn').forEach(btn => btn.classList.remove('active'));
                const tabCamping = document.getElementById('tabCamping');
                if (tabCamping) tabCamping.classList.add('active');

                this.render();

                if (window.CampingManager) {
                    window.CampingManager.recalculateCamp();
                }

                btnToggleCamping.style.setProperty('background', 'linear-gradient(180deg, #1e3c27 0%, #112417 100%)', 'important');
                btnToggleCamping.style.setProperty('border-color', '#dfbc6f', 'important');
                btnToggleCamping.style.setProperty('color', '#dfbc6f', 'important');
            });
        }
    },

    updateMapData(newMapData) {
        this.mapDataRef = newMapData;
    },


    /**
     * Генерация контента без принудительной перезаписи заголовков шапки HUD
     */
    render() {
        const listContainer = document.getElementById('questLogList');
        const kingdomTabletEl = document.getElementById('kingdomTabletContainer');
        const campingTabletEl = document.getElementById('campingTabletContainer');
        const weatherTabletEl = document.getElementById('weatherTabletContainer');
        const settingsTabletEl = document.getElementById('settingsTabletContainer');
        const initiativeTabletEl = document.getElementById('initiativeTabletContainer');
        if (!this.mapDataRef) return;

        // Полный сброс отображения вкладок
        if (listContainer) listContainer.style.display = 'none';
        if (kingdomTabletEl) kingdomTabletEl.style.display = 'none';
        if (campingTabletEl) campingTabletEl.style.display = 'none';
        if (settingsTabletEl) settingsTabletEl.style.display = 'none';
        if (initiativeTabletEl) initiativeTabletEl.style.display = 'none';
        if (weatherTabletEl) weatherTabletEl.style.display = 'none';

        if (this.currentFilter === 'camping') {
            if (campingTabletEl) campingTabletEl.style.display = 'flex';
            if (window.CampingManager) window.CampingManager.recalculateCamp();
            return;
        }
        else if (this.currentFilter === 'kingdom') {
            if (kingdomTabletEl) kingdomTabletEl.style.display = 'flex';
            KingdomManager.renderUi();
            return;
        }
        if (this.currentFilter === 'weather') {
            if (weatherTabletEl) weatherTabletEl.style.display = 'flex';
            if (window.WeatherManager && typeof window.WeatherManager.renderTabUi === 'function') {
                window.WeatherManager.renderTabUi();
            }
            return;
        }
        else if (this.currentFilter === 'initiative') {
            if (initiativeTabletEl) initiativeTabletEl.style.display = 'flex';
            if (window.InitiativeManager) window.InitiativeManager.renderUi();
            return;
        }
        else if (this.currentFilter === 'settings') {
            if (settingsTabletEl) settingsTabletEl.style.display = 'flex';
            return;
        }
        else {
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
                        this.closeFullscreenHUD();
                    });
                    listContainer.appendChild(rumorItem);
                }
            }
            else {

                if (hex.questData && hex.questData.status === filterStatus) {
                    count++;
                    const questItem = document.createElement('div');

                    // УНИФИЦИРОВАНО: Принудительно присваиваем карточкам квестов монументальный класс слухов
                    questItem.className = 'quest-log-item status-rumor';

                    const objIcon = MAP_CONFIG.types[hex.type]?.icon || '⚜️';
                    const statusLabel = filterStatus === 'completed' ? '✅ Задание завершено' : '⚔️ Активное задание';

                    questItem.innerHTML = `
                        <div class="quest-item-title">${objIcon} ${statusLabel}</div>
                        <div class="quest-item-location">📍 Название/Регион: ${hex.title || hexId.replace('hex_', 'Гекс ')}</div>
                        <div class="quest-item-desc" style="font-size: 20px; font-weight: bold; color: #ffd875; margin-top: 6px; text-transform: uppercase;">${hex.questData.title}</div>
                        ${hex.questData.desc ? `<div class="quest-item-desc" style="margin-top: 8px; color: #ccc; font-size: 16px;">${hex.questData.desc.replace(/\n/g, '<br>')}</div>` : ''}
                    `;

                    questItem.addEventListener('click', () => {
                        if (this.focusCallback) this.focusCallback(hexId);
                        this.closeFullscreenHUD();
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
