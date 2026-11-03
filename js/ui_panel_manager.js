import AnimationManager from './animation_manager.js';

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
        // Правое меню кнопок при этом остаётся открытым.
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

                // Переключаем класс поворота шестеренки
                this.masterToggleBtn.classList.toggle('ui-active');

                // Переключаем видимость правой панели кнопок
                const isMenuExpanded = this.rightPanel.classList.toggle('ui-expanded');

                if (this.playerWrapper) {
                    if (isMenuExpanded) {
                        // Если меню ОТКРЫВАЕТСЯ — принудительно выкатываем и плеер
                        this.playerWrapper.classList.add('ui-expanded');
                    } else {
                        // Если меню ЗАКРЫВАЕТСЯ — принудительно прячем и плеер тоже
                        this.playerWrapper.classList.remove('ui-expanded');
                    }
                }
            });
        }
        const btnToggleTooltips = document.getElementById('btnToggleTooltips');
        if (btnToggleTooltips) {
            btnToggleTooltips.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                AnimationManager.toggleQuestTooltips(btnToggleTooltips);
            });
        }
    }
};

export default UiPanelManager;
