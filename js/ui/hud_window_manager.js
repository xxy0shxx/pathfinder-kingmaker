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


        // В режиме игрока скрываем все вкладки в шапке окна, кроме квестов, слухов и кнопки закрытия
        const isPlayerMode = new URLSearchParams(window.location.search).has('playerHeroId');
        if (isPlayerMode) {
            // Находим вкладку настроек по id или по тексту '⚙'
            const settingsTab = Array.from(container.querySelectorAll('.quest-tab-btn'))
                .find(b => b.id === 'tabSettings' || b.textContent.trim() === '⚙');
            if (settingsTab && !settingsTab.id) settingsTab.id = 'tabSettings';

            const allowedTabs = new Set([
                'tabActiveQuests',
                'tabCompletedQuests',
                'tabRumors',
                'tabSettings',
                'tabCloseJournal'
            ]);

            container.querySelectorAll('.quest-tab-btn').forEach(btn => {
                if (!allowedTabs.has(btn.id)) {
                    btn.style.setProperty('display', 'none', 'important');
                }
            });

            // Внутри панели настроек оставляем только первый блок («Настройки токена и перемещения отряда»)
            const settingsPanel = document.getElementById('settingsTabletContainer') || document.getElementById('settingsContainer');
            if (settingsPanel) {
                const sections = settingsPanel.querySelectorAll('.settings-section, .settings-group, .settings-block');
                if (sections.length > 1) {
                    sections.forEach((sec, idx) => {
                        if (idx > 0) sec.style.setProperty('display', 'none', 'important');
                    });
                } else {
                    // Запасной вариант, если блоки не обёрнуты в классы: скрываем элементы по ID настроек ГМа
                    ['settingFogOpacity', 'settingHideDc', 'settingHideLevel', 'settingHideObjTitle',
                        'settingHideObjIcon', 'settingHideTerrain', 'settingHideExplored', 'settingHideMapped',
                        'settingHideQuestMarkers', 'settingHideKingdomBorders', 'settingShowEnemyTooltips',
                        'customSelectRoundAudioMode', 'settingFpsMonitor'].forEach(gmSettingId => {
                        const el = document.getElementById(gmSettingId);
                        const group = el?.closest('.settings-section, .settings-group, .settings-card, fieldset') || el?.parentElement;
                        if (group) group.style.setProperty('display', 'none', 'important');
                    });
                }
            }
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
