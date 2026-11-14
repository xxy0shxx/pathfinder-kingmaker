/**
 * Единый диспетчер полноэкранного HUD-окна (#questLogContainer) и его вкладок
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

        // Динамическая вкладка Погоды
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

        // Контейнер планшета Погоды
        const kingdomTablet = document.getElementById('kingdomTabletContainer');
        if (kingdomTablet && !document.getElementById('weatherTabletContainer')) {
            const weatherTablet = document.createElement('div');
            weatherTablet.id = 'weatherTabletContainer';
            weatherTablet.style.cssText = 'display: none; width: 100%; flex-direction: column; overflow-y: auto;';
            kingdomTablet.insertAdjacentElement('afterend', weatherTablet);
        }

        // Динамическая вкладка Бестиария
        const tabInitiative = document.getElementById('tabInitiative');
        if (tabInitiative && !document.getElementById('tabBestiary')) {
            const tabBestiary = document.createElement('button');
            tabBestiary.type = 'button';
            tabBestiary.id = 'tabBestiary';
            tabBestiary.className = 'quest-tab-btn';
            tabBestiary.title = 'Бестиарий: Отряд и заготовки монстров';
            tabBestiary.textContent = '🐉';
            tabInitiative.insertAdjacentElement('afterend', tabBestiary);
        }

        // Контейнер планшета Бестиария
        const initTablet = document.getElementById('initiativeTabletContainer');
        if (initTablet && !document.getElementById('bestiaryTabletContainer')) {
            const bestiaryTablet = document.createElement('div');
            bestiaryTablet.id = 'bestiaryTabletContainer';
            bestiaryTablet.style.cssText = 'display: none; width: 100%; flex-direction: column; overflow-y: auto;';
            initTablet.insertAdjacentElement('afterend', bestiaryTablet);
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
     * Регистрация вкладки любым независимым модулем
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

    open(tabKey = 'active') {
        const container = document.getElementById('questLogContainer');
        const config = this.tabsRegistry.get(tabKey);
        if (!container || !config) return;

        container.classList.remove('ui-collapsed');
        this.activeTab = tabKey;

        const uniqueContainers = new Set(Array.from(this.tabsRegistry.values()).map(c => c.containerId));
        uniqueContainers.forEach(cId => {
            const el = document.getElementById(cId);
            if (el) el.style.display = 'none';
        });

        const targetContainer = document.getElementById(config.containerId);
        if (targetContainer) {
            targetContainer.style.display = config.displayMode || 'flex';
        }

        document.querySelectorAll('.quest-tab-btn').forEach(btn => btn.classList.remove('active'));
        const activeTabBtn = document.getElementById(config.tabBtnId);
        if (activeTabBtn) activeTabBtn.classList.add('active');

        this._clearTriggerHighlights();
        if (config.triggerBtnId) {
            const btn = document.getElementById(config.triggerBtnId);
            if (btn) {
                btn.style.setProperty('background', 'linear-gradient(180deg, #1e3c27 0%, #112417 100%)', 'important');
                btn.style.setProperty('border-color', '#dfbc6f', 'important');
                btn.style.setProperty('color', '#dfbc6f', 'important');
            }
        }

        if (typeof config.onOpen === 'function') {
            config.onOpen(tabKey);
        }
    },

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
