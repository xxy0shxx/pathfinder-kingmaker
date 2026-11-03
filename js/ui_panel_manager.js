/**
 * Модуль для управления глобальными UI-панелями, кнопками переключения режимов и тултипов
 */
const UiPanelManager = {
    /**
     * Инициализация менеджера панелей интерфейса
     */
    init() {
        this.initUnifiedUICollapse();
        this.initMapModeToggle();
        this.initTooltipsToggle();
    },

    /**
     * Мастер-кнопка сворачивания/разворачивания боковых панелей, журнала квестов и плеера
     */
    initUnifiedUICollapse() {
        const rightPanel = document.querySelector('.right-controls-panel');
        const questLog = document.getElementById('questLogContainer');
        const masterBtn = document.getElementById('btnMasterToggle');

        if (masterBtn && rightPanel) {
            rightPanel.classList.remove('ui-expanded');

            masterBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isExpanded = rightPanel.classList.toggle('ui-expanded');

                const monolithWrapper = document.querySelector('.music-player-monolith-wrapper');
                if (monolithWrapper) {
                    monolithWrapper.classList.toggle('ui-expanded', isExpanded);
                }

                if (!isExpanded && questLog) {
                    questLog.classList.add('ui-collapsed');
                }
                masterBtn.classList.toggle('ui-active', isExpanded);
            });
        }
    },

    /**
     * Логика переключения режима карты (Глобальная / Карта лагеря)
     */
    initMapModeToggle() {
        const btnToggleMapMode = document.getElementById('btnToggleMapMode');
        if (!btnToggleMapMode) return;

        let currentMode = 'global';

        btnToggleMapMode.addEventListener('click', () => {
            if (currentMode === 'global') {
                currentMode = 'camp';
                btnToggleMapMode.innerHTML = '⛺';
                btnToggleMapMode.title = 'Переключить на глобальную карту';
                btnToggleMapMode.style.background = 'linear-gradient(180deg, #42351f 0%, #292011 100%)';
                btnToggleMapMode.style.borderColor = '#543e0d';
                btnToggleMapMode.style.color = '#ebd291';
            } else {
                currentMode = 'global';
                btnToggleMapMode.innerHTML = '🗺️';
                btnToggleMapMode.title = 'Переключить на карту лагеря';
                btnToggleMapMode.style.background = 'linear-gradient(180deg, #4f5d65 0%, #2c3539 100%)';
                btnToggleMapMode.style.borderColor = '#d4af37';
                btnToggleMapMode.style.color = '#d1d8e0';
            }
        });
    },

    /**
     * Динамическое создание кнопки управления мини-тултипами квестов и привязка событий
     */
    initTooltipsToggle() {
        const btnToggleTooltips = document.createElement('button');
        btnToggleTooltips.type = 'button';
        btnToggleTooltips.id = 'btnToggleTooltips';
        btnToggleTooltips.className = 'btn-ui-toggle';
        btnToggleTooltips.innerHTML = '✨';
        btnToggleTooltips.title = 'Скрыть/Показать тултипы квестов';

        // Настройка инлайн-стилей отображения кнопки
        btnToggleTooltips.style.setProperty('position', 'fixed', 'important');
        btnToggleTooltips.style.setProperty('right', '96px', 'important');
        btnToggleTooltips.style.setProperty('bottom', '-160px', 'important');
        btnToggleTooltips.style.setProperty('width', '46px', 'important');
        btnToggleTooltips.style.setProperty('height', '44px', 'important');
        btnToggleTooltips.style.setProperty('z-index', '10005', 'important');
        btnToggleTooltips.style.setProperty('display', 'flex', 'important');
        btnToggleTooltips.style.setProperty('align-items', 'center', 'important');
        btnToggleTooltips.style.setProperty('justify-content', 'center', 'important');
        btnToggleTooltips.style.setProperty('border-radius', '4px', 'important');
        btnToggleTooltips.style.setProperty('cursor', 'pointer', 'important');
        btnToggleTooltips.style.setProperty('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.5)', 'important');
        btnToggleTooltips.style.background = 'linear-gradient(180deg, #1e3c27 0%, #112417 100%)';
        btnToggleTooltips.style.borderColor = '#3e6349';
        btnToggleTooltips.style.color = '#dfbc6f';
        btnToggleTooltips.style.setProperty('opacity', '0', 'important');
        btnToggleTooltips.style.setProperty('pointer-events', 'none', 'important');
        btnToggleTooltips.style.setProperty('transition', 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)', 'important');

        document.body.appendChild(btnToggleTooltips);

        btnToggleTooltips.addEventListener('click', () => {
            const visualLayerEl = document.getElementById('visualLayer');
            if (!visualLayerEl) return;

            const isHidden = visualLayerEl.classList.toggle('hide-quest-tooltips');

            const miniTooltips = visualLayerEl.querySelectorAll('.hex-quest-mini-tooltip');
            miniTooltips.forEach(tooltip => {
                tooltip.style.setProperty('display', isHidden ? 'none' : 'block', 'important');
            });

            if (!isHidden) {
                btnToggleTooltips.style.background = 'linear-gradient(180deg, #1e3c27 0%, #112417 100%)';
                btnToggleTooltips.style.borderColor = '#3e6349';
                btnToggleTooltips.style.color = '#dfbc6f';
            } else {
                btnToggleTooltips.style.background = 'linear-gradient(180deg, #5c1e1e 0%, #3a1111 100%)';
                btnToggleTooltips.style.borderColor = '#823030';
                btnToggleTooltips.style.color = '#f7baba';
            }
        });
    }
};

export default UiPanelManager;
