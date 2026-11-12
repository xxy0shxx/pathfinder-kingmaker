/**
 * Единый диспетчер полноэкранного HUD-окна и вкладок (Квесты, Королевство, Привал, Погода, Инициатива, Настройки)
 */
const HudWindowManager = {
    activeTab: 'active',
    tabsRegistry: new Map(),
    triggerButtons: ['btnToggleQuests', 'btnToggleCamping', 'btnToggleSettings'],
    _isInitialized: false,

    init() {
        if (this._isInitialized) return;
        this._isInitialized = true;

        this._ensureDomStructure();
        this._bindCloseControls();
        window.HudWindowManager = this;
    },

    /**
     * Перенос контейнера в body и создание динамических вкладок (например, Погоды)
     */
    _ensureDomStructure() {
        const container = document.getElementById('questLogContainer');
        if (!container) return;

        document.body.appendChild(container);

        const questHeader = container.querySelector('.quest-log-header');
        if (questHeader && !questHeader.querySelector('.btn-close-quest-log')) {
            const closeBtn = document.createElement('button');
            closeBtn.type = 'button';
            closeBtn.className = 'btn-close-quest-log';
            closeBtn.innerHTML = '×';
            closeBtn.title = 'Закрыть окно';
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.close();
            });
            questHeader.appendChild(closeBtn);
        }

        // Инъекция вкладки и контейнера Погоды, если их нет в HTML
        const tabCamping = document.getElementById('tabCamping');
        if (tabCamping && !document.getElementById('tabWeather')) {
            const tabWeather = document.createElement('button');
            tabWeather.type = 'button';
            tabWeather.id = 'tabWeather';
            tabWeather.className = 'quest-tab-btn';
            tabWeather.title = 'Календарь Голариона и Погода';
            tabWeather.textContent = '⛅';
            tabCamping.insertAdjacentElement('afterend', tabWeather);
        }

        const kingdomTablet = document.getElementById('kingdomTabletContainer');
        if (kingdomTablet && !document.getElementById('weatherTabletContainer')) {
            const weatherTablet = document.createElement('div');
            weatherTablet.id = 'weatherTabletContainer';
            weatherTablet.style.cssText = 'display: none; width: 100%; flex-direction: column; overflow-y: auto;';
            kingdomTablet.insertAdjacentElement('afterend', weatherTablet);
        }
    },

    _bindCloseControls() {
        const tabCloseJournal = document.getElementById('tabCloseJournal');
        if (tabCloseJournal) {
            tabCloseJournal.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.close();
            });
        }

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || e.code === 'Escape') {
                const container = document.getElementById('questLogContainer');
                if (container && !container.classList.contains('ui-collapsed')) {
                    e.preventDefault();
                    this.close();
                }
            }
        });
    },

    /**
     * Регистрация вкладки любым модулем системы
     */
    registerTab(tabKey, { tabBtnId, containerId, displayMode = 'flex', triggerBtnId = null, onOpen = null }) {
        this.tabsRegistry.set(tabKey, { tabBtnId, containerId, displayMode, triggerBtnId, onOpen });

        const tabBtn = document.getElementById(tabBtnId);
        if (tabBtn && !tabBtn.dataset.hudBound) {
            tabBtn.dataset.hudBound = '1';
            tabBtn.addEventListener('click', () => this.open(tabKey));
        }

        if (triggerBtnId) {
            const triggerBtn = document.getElementById(triggerBtnId);
            if (triggerBtn && !triggerBtn.dataset.hudTriggerBound) {
                triggerBtn.dataset.hudTriggerBound = '1';
                triggerBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggle(tabKey);
                });
            }
        }
    },

    /**
     * Открыть окно на нужной вкладке
     */
    open(tabKey = 'active') {
        const container = document.getElementById('questLogContainer');
        const config = this.tabsRegistry.get(tabKey);
        if (!container || !config) return;

        container.classList.remove('ui-collapsed');
        this.activeTab = tabKey;

        // 1. Скрываем все зарегистрированные контейнеры
        const uniqueContainers = new Set(Array.from(this.tabsRegistry.values()).map(c => c.containerId));
        uniqueContainers.forEach(cId => {
            const el = document.getElementById(cId);
            if (el) el.style.display = 'none';
        });

        // 2. Показываем целевой контейнер
        const targetContainer = document.getElementById(config.containerId);
        if (targetContainer) {
            targetContainer.style.display = config.displayMode || 'flex';
        }

        // 3. Обновляем активную вкладку в шапке
        document.querySelectorAll('.quest-tab-btn').forEach(btn => btn.classList.remove('active'));
        const activeTabBtn = document.getElementById(config.tabBtnId);
        if (activeTabBtn) activeTabBtn.classList.add('active');

        // 4. Подсвечиваем связанную кнопку на правой панели (если есть)
        this._clearTriggerHighlights();
        if (config.triggerBtnId) {
            const btn = document.getElementById(config.triggerBtnId);
            if (btn) {
                btn.style.setProperty('background', 'linear-gradient(180deg, #1e3c27 0%, #112417 100%)', 'important');
                btn.style.setProperty('border-color', '#dfbc6f', 'important');
                btn.style.setProperty('color', '#dfbc6f', 'important');
            }
        }

        // 5. Вызываем хук рендера модуля
        if (typeof config.onOpen === 'function') {
            config.onOpen(tabKey);
        }
    },

    /**
     * Переключить окно: если закрыто — открыть на вкладке; если открыта эта же вкладка — закрыть
     */
    toggle(tabKey) {
        const container = document.getElementById('questLogContainer');
        if (!container) return;

        const isClosed = container.classList.contains('ui-collapsed');
        if (!isClosed && this.activeTab === tabKey) {
            this.close();
        } else {
            this.open(tabKey);
        }
    },

    /**
     * Полное закрытие HUD и сброс подсветки кнопок
     */
    close() {
        const container = document.getElementById('questLogContainer');
        if (container) container.classList.add('ui-collapsed');
        this._clearTriggerHighlights();
    },

    isOpen() {
        const container = document.getElementById('questLogContainer');
        return !!(container && !container.classList.contains('ui-collapsed'));
    },

    _clearTriggerHighlights() {
        this.triggerButtons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.removeAttribute('style');
        });
    }
};

export default HudWindowManager;
