import { MAP_CONFIG } from './config/app_config.js';

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
                    if (btnToggleQuests) {
                        btnToggleQuests.style.removeAttribute('style');
                    }
                });
                questHeader.appendChild(closeBtn);
            }
        }
    },

    /**
     * Инициализация вкладок (Активные / Завершенные / Слухи)
     */
    initTabs() {
        const tabActive = document.getElementById('tabActiveQuests');
        const tabCompleted = document.getElementById('tabCompletedQuests');
        const tabRumors = document.getElementById('tabRumors');

        if (tabActive && tabCompleted && tabRumors) {
            tabActive.addEventListener('click', () => this.setActiveTab(tabActive, 'active'));
            tabCompleted.addEventListener('click', () => this.setActiveTab(tabCompleted, 'completed'));
            tabRumors.addEventListener('click', () => this.setActiveTab(tabRumors, 'rumors'));
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
    initUnifiedUICollapse() {
        const questLog = document.getElementById('questLogContainer');
        const btnToggleQuests = document.getElementById('btnToggleQuests');

        if (btnToggleQuests && questLog) {
            btnToggleQuests.addEventListener('click', () => {
                const isLogCollapsed = questLog.classList.toggle('ui-collapsed');
                if (!isLogCollapsed) {
                    this.render();
                    btnToggleQuests.style.setProperty('background', 'linear-gradient(180deg, #1e3c27 0%, #112417 100%)', 'important');
                    btnToggleQuests.style.setProperty('border-color', '#dfbc6f', 'important');
                    btnToggleQuests.style.setProperty('color', '#dfbc6f', 'important');
                } else {
                    btnToggleQuests.style.removeAttribute('style');
                }
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
     * Генерация списка заданий и слухов в дневнике
     */
    render() {
        const listContainer = document.getElementById('questLogList');
        if (!listContainer || !this.mapDataRef) return;

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
