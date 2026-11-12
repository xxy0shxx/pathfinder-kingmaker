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

        // 8. Переключение видимости дорог королевства (правая панель 3x4 + синхронизация с меню настроек)
        window.MAP_HIDE_KINGDOM_ROADS = localStorage.getItem('kingmakerHideKingdomRoads') === 'true';

        const updateRoadsUiState = () => {
            const isHidden = !!window.MAP_HIDE_KINGDOM_ROADS;
            localStorage.setItem('kingmakerHideKingdomRoads', String(isHidden));

            const panelBtn = document.getElementById('btnToggleKingdomRoads');
            if (panelBtn) {
                panelBtn.classList.toggle('paths-hidden', isHidden);
                panelBtn.title = isHidden ? 'Показать дороги королевства' : 'Скрыть дороги королевства';
            }

            const chk = document.getElementById('chkHideKingdomRoads');
            if (chk && chk.checked !== isHidden) {
                chk.checked = isHidden;
            }

            if (window.HexCanvasRender && typeof window.HexCanvasRender.requestFrame === 'function') {
                window.HexCanvasRender.requestFrame();
            }
        };

        // 8.1. Создаём кнопку 🛣 в правой панели инструментов (рядом с кнопкой путей)
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
                window.MAP_HIDE_KINGDOM_ROADS = !window.MAP_HIDE_KINGDOM_ROADS;
                updateRoadsUiState();
            });
        }

        // 8.2. Инъекция чекбокса в меню настроек ГМа и двусторонняя синхронизация
        const injectRoadToggleIntoSettings = () => {
            const settingsBox = document.getElementById('settingsTabletContainer');
            if (!settingsBox || settingsBox.querySelector('#chkHideKingdomRoads')) return;

            const bordersCb = settingsBox.querySelector('[id*="Border"], [id*="border"], input[type="checkbox"]');
            const targetRow = bordersCb?.closest('.checkbox-row, label, div');
            if (!targetRow || !targetRow.parentElement) return;

            const roadRow = document.createElement('div');
            roadRow.className = targetRow.className || 'checkbox-row';
            roadRow.style.cssText = 'display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:8px; background:rgba(0,0,0,0.2); padding:6px 10px; border-radius:4px; border:1px solid rgba(84,62,13,0.3); cursor:pointer;';
            roadRow.innerHTML = `
                <label for="chkHideKingdomRoads" style="color:#ebd291; font-size:14px; cursor:pointer; flex:1;">🛣 Скрыть дороги королевства</label>
                <input type="checkbox" id="chkHideKingdomRoads" ${window.MAP_HIDE_KINGDOM_ROADS ? 'checked' : ''} style="accent-color:#a68032; width:18px; height:18px; cursor:pointer;">
            `;

            targetRow.parentElement.insertBefore(roadRow, targetRow.nextSibling);

            const chk = roadRow.querySelector('#chkHideKingdomRoads');
            chk.addEventListener('change', () => {
                window.MAP_HIDE_KINGDOM_ROADS = chk.checked;
                updateRoadsUiState();
            });
        };

        const settingsContainer = document.getElementById('settingsTabletContainer');
        if (settingsContainer) {
            const observer = new MutationObserver(() => injectRoadToggleIntoSettings());
            observer.observe(settingsContainer, { childList: true, subtree: true });
            injectRoadToggleIntoSettings();
        }

        updateRoadsUiState();


    }
};

export default UiPanelManager;
