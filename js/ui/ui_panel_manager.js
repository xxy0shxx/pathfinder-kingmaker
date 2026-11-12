import AnimationManager from '../services/animation_manager.js';

/**
 * Модуль для управления глобальными UI-панелями, кнопками переключения режимов и тултипов
 */
const UiPanelManager = {
    playerWrapper: null,
    btnMinimize: null,
    masterToggleBtn: null,
    rightPanel: null,
    /**
     * Инициализация менеджера панелей интерфейса
     */
    init() {
        this.playerWrapper = document.querySelector('.music-player-monolith-wrapper');
        this.btnMinimize = document.querySelector('.wa-minimize');
        this.masterToggleBtn = document.querySelector('.master-toggle-btn');
        this.rightPanel = document.querySelector('.right-controls-panel');
        this.attachEvents();
    },


    /**
     * Привязка событий клика
     */
    attachEvents() {
        // 1. Клик по кнопке "_" в шапке плеера Winamp — скрывает ТОЛЬКО плеер.
        if (this.btnMinimize && this.playerWrapper) {
            this.btnMinimize.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.playerWrapper.classList.remove('ui-expanded');
            });
        }


        // 2. Клик по главной шестеренке (мастер-кнопке) в углу экрана
        if (this.masterToggleBtn && this.rightPanel) {
            this.masterToggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                this.masterToggleBtn.classList.toggle('ui-active');
                const isMenuExpanded = this.rightPanel.classList.toggle('ui-expanded');

                // ИСПРАВЛЕНО: Если панель открыта ГМом — принудительно СКРЫВАЕМ плеер
                if (this.playerWrapper) {
                    if (isMenuExpanded) {
                        this.playerWrapper.classList.remove('ui-expanded');

                        // Сбрасываем подсветку кнопки вызова плеера, если панель распахнулась
                        const btnTogglePlayer = document.getElementById('btnTogglePlayer');
                        if (btnTogglePlayer) btnTogglePlayer.removeAttribute('style');
                    }
                }
            });
        }

        // 4. Скрытие и отображение путей отряда
        const btnTogglePaths = document.getElementById('btnTogglePaths');
        const svgPathsLayer = document.getElementById('mapPathsSvg');

        if (btnTogglePaths && svgPathsLayer) {
            btnTogglePaths.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Переключаем класс скрытия на самом SVG слое путей
                const isHidden = svgPathsLayer.classList.toggle('hide-paths');

                // Меняем визуальный статус кнопки (красный/дефолтный) для индикации
                if (isHidden) {
                    btnTogglePaths.classList.add('paths-hidden');
                } else {
                    btnTogglePaths.classList.remove('paths-hidden');
                }
            });
        }


        // 5. Полностью изолированное управление окном привала ГМа
        const btnToggleCamping = document.getElementById('btnToggleCamping');
        const campingWindow = document.getElementById('campingLogContainer');
        const questWindow = document.getElementById('questLogContainer');

        if (btnToggleCamping && campingWindow) {
            btnToggleCamping.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const isCampCollapsed = campingWindow.classList.contains('ui-collapsed');

                if (isCampCollapsed) {
                    // Если окно квестов открыто — принудительно закрываем его, чтобы не перекрывало
                    if (questWindow) questWindow.classList.add('ui-collapsed');

                    // Открываем наше окно привала
                    campingWindow.classList.remove('ui-collapsed');

                    // Инициализируем перерасчет математики калькулятора
                    if (window.CampingManager) window.CampingManager.recalculateCamp();

                    // Красиво подсвечиваем кнопку привала зеленым
                    btnToggleCamping.style.setProperty('background', 'linear-gradient(180deg, #1e3c27 0%, #112417 100%)', 'important');
                    btnToggleCamping.style.setProperty('border-color', '#dfbc6f', 'important');
                    btnToggleCamping.style.setProperty('color', '#dfbc6f', 'important');
                } else {
                    // Если окно уже было открыто — просто закрываем его
                    campingWindow.classList.add('ui-collapsed');
                    btnToggleCamping.removeAttribute('style');
                }
            });
        }

        // БЛОК 6: Выделенная кнопка вызова музыкального плеера на панели 3х4
        const btnTogglePlayer = document.getElementById('btnTogglePlayer');
        if (btnTogglePlayer && this.playerWrapper) {
            btnTogglePlayer.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const isPlayerVisible = this.playerWrapper.classList.toggle('ui-expanded');

                if (isPlayerVisible) {
                    btnTogglePlayer.style.setProperty('background', 'linear-gradient(180deg, #1e3c27 0%, #112417 100%)', 'important');
                    btnTogglePlayer.style.setProperty('border-color', '#dfbc6f', 'important');
                    btnTogglePlayer.style.setProperty('color', '#dfbc6f', 'important');
                } else {
                    btnTogglePlayer.removeAttribute('style');
                }
            });
        }


        // 7. Изолированное управление быстрой кнопкой Настроек на панели 3х4
        const btnToggleSettings = document.getElementById('btnToggleSettings');
        if (btnToggleSettings && questWindow) {
            btnToggleSettings.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();

                const isLogCollapsed = questWindow.classList.contains('ui-collapsed');
                const isSettingsActive = window.QuestManager && window.QuestManager.currentFilter === 'settings';

                if (isLogCollapsed) {
                    questWindow.classList.remove('ui-collapsed');
                } else if (isSettingsActive) {
                    questWindow.classList.add('ui-collapsed');
                    btnToggleSettings.removeAttribute('style');
                    return;
                }

                if (window.QuestManager) {
                    window.QuestManager.currentFilter = 'settings';

                    document.querySelectorAll('.quest-tab-btn').forEach(btn => btn.classList.remove('active'));
                    const tabSettings = document.getElementById('tabSettings');
                    if (tabSettings) tabSettings.classList.add('active');

                    window.QuestManager.render();
                }

                const btnToggleQuests = document.getElementById('btnToggleQuests');
                const btnToggleCamping = document.getElementById('btnToggleCamping');
                const btnTogglePlayer = document.getElementById('btnTogglePlayer');
                if (btnToggleQuests) btnToggleQuests.removeAttribute('style');
                if (btnToggleCamping) btnToggleCamping.removeAttribute('style');
                if (btnTogglePlayer) btnTogglePlayer.removeAttribute('style');

                btnToggleSettings.style.setProperty('background', 'linear-gradient(180deg, #1e3c27 0%, #112417 100%)', 'important');
                btnToggleSettings.style.setProperty('border-color', '#dfbc6f', 'important');
                btnToggleSettings.style.setProperty('color', '#dfbc6f', 'important');
            });
        }

        // 8. Регулировка прозрачности дорог королевства (ползунок в настройках + кнопка 🛣 на правой панели)
        const savedOpacityRaw = localStorage.getItem('kingmakerKingdomRoadsOpacity');
        let currentRoadsOpacity = savedOpacityRaw !== null ? parseFloat(savedOpacityRaw) : 1.0;
        let lastNonZeroOpacity = currentRoadsOpacity > 0 ? currentRoadsOpacity : 1.0;
        window.MAP_KINGDOM_ROADS_OPACITY = currentRoadsOpacity;

        const updateRoadsOpacityUi = (newOpacity) => {
            currentRoadsOpacity = Math.max(0, Math.min(1, Number(newOpacity) || 0));
            if (currentRoadsOpacity > 0) lastNonZeroOpacity = currentRoadsOpacity;

            window.MAP_KINGDOM_ROADS_OPACITY = currentRoadsOpacity;
            localStorage.setItem('kingmakerKingdomRoadsOpacity', String(currentRoadsOpacity));

            const pct = Math.round(currentRoadsOpacity * 100);

            const panelBtn = document.getElementById('btnToggleKingdomRoads');
            if (panelBtn) {
                panelBtn.classList.toggle('paths-hidden', pct === 0);
                panelBtn.title = pct === 0
                    ? `Показать дороги королевства (${Math.round(lastNonZeroOpacity * 100)}%)`
                    : `Скрыть дороги королевства (сейчас ${pct}%)`;
            }

            const slider = document.getElementById('rngKingdomRoadsOpacity');
            const valLbl = document.getElementById('lblKingdomRoadsOpacityVal');
            if (slider && Number(slider.value) !== pct) slider.value = pct;
            if (valLbl) valLbl.textContent = `${pct}%`;

            if (window.HexCanvasRender && typeof window.HexCanvasRender.requestFrame === 'function') {
                window.HexCanvasRender.requestFrame();
            }
        };

        // 8.1. Кнопка быстрого переключения 🛣 на правой панели
        if (this.rightPanel && !document.getElementById('btnToggleKingdomRoads')) {
            const roadBtn = document.createElement('button');
            roadBtn.type = 'button';
            roadBtn.id = 'btnToggleKingdomRoads';
            roadBtn.className = 'btn-ui-toggle';
            roadBtn.innerHTML = '🛣';

            const pathsBtn = document.getElementById('btnTogglePaths');
            if (pathsBtn && pathsBtn.parentElement === this.rightPanel) {
                this.rightPanel.insertBefore(roadBtn, pathsBtn.nextSibling);
            } else {
                this.rightPanel.insertBefore(roadBtn, this.rightPanel.firstChild);
            }

            roadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                updateRoadsOpacityUi(currentRoadsOpacity > 0 ? 0 : lastNonZeroOpacity);
            });
        }

        // 8.2. Инъекция ползунка прозрачности в меню настроек ГМа (в точном стиле Тумана Войны)
        const injectRoadSliderIntoSettings = () => {
            const settingsBox = document.getElementById('settingsTabletContainer');
            if (!settingsBox || settingsBox.querySelector('#rngKingdomRoadsOpacity')) return;

            const fogSlider = settingsBox.querySelector('input[type="range"]');
            const fogContainer = fogSlider?.closest('.box') || fogSlider?.parentElement?.parentElement || fogSlider?.parentElement;
            if (!fogContainer || !fogContainer.parentElement) return;

            const pct = Math.round(currentRoadsOpacity * 100);
            const roadBlock = document.createElement('div');
            roadBlock.className = 'box';
            roadBlock.style.cssText = 'width: 100%; margin-top: 12px; margin-bottom: 14px;';
            roadBlock.innerHTML = `
                <label for="rngKingdomRoadsOpacity" style="display:block; margin-bottom: 8px; color: #dfbc6f; font-size: 13px; font-weight: bold; text-transform: uppercase;">
                    🛣 Прозрачность дорог королевства:
                </label>
                <div style="display: flex; align-items: center; gap: 15px; width: 100%;">
                    <input type="range" id="rngKingdomRoadsOpacity" min="0" max="100" step="5" value="${pct}" style="flex: 1; width: 100%; cursor: pointer;">
                    <span id="lblKingdomRoadsOpacityVal" style="color: #ebd291; font-family: monospace; font-weight: bold; font-size: 15px; min-width: 45px; text-align: right;">${pct}%</span>
                </div>
            `;

            fogContainer.parentElement.insertBefore(roadBlock, fogContainer.nextSibling);

            const slider = roadBlock.querySelector('#rngKingdomRoadsOpacity');
            slider.addEventListener('input', () => {
                updateRoadsOpacityUi(Number(slider.value) / 100);
            });
        };


        const settingsContainer = document.getElementById('settingsTabletContainer');
        if (settingsContainer) {
            const observer = new MutationObserver(() => injectRoadSliderIntoSettings());
            observer.observe(settingsContainer, { childList: true, subtree: true });
            injectRoadSliderIntoSettings();
        }

        updateRoadsOpacityUi(currentRoadsOpacity);


    }
};

export default UiPanelManager;
