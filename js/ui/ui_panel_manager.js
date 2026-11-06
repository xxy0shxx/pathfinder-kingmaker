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

                if (this.playerWrapper) {
                    if (isMenuExpanded) {
                        this.playerWrapper.classList.add('ui-expanded');
                    } else {
                        this.playerWrapper.classList.remove('ui-expanded');
                    }
                }
            });
        }

        // 3. Переключение мини-тултипов квестов
        const btnToggleTooltips = document.getElementById('btnToggleTooltips');
        if (btnToggleTooltips) {
            btnToggleTooltips.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                AnimationManager.toggleQuestTooltips(btnToggleTooltips);
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


// Внутри UiPanelManager.js -> метод attachEvents()

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




    }
};

export default UiPanelManager;
