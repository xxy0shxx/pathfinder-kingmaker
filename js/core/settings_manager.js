import { MAP_CONFIG } from '../config/app_config.js';

/**
 * Модуль управления конфигурацией и системными настройками интерфейса
 */
const SettingsManager = {
    state: {
        flightFromCapital: true,
        enableFpsMonitor: true
    },

    /**
     * Первичная инициализация настроек ГМа
     */
    init() {
        try {
            // Безопасно считываем прошлый сейв конфигурации из localStorage
            const savedSettings = JSON.parse(localStorage.getItem('kingmakerSystemSettings'));
            if (savedSettings) {
                this.state = { ...this.state, ...savedSettings };
            }

            this.applySettingsToEngine();
            this.bindUiElements();
        } catch (e) {
            console.error("Ошибка инициализации SettingsManager:", e);
        }
    },

    /**
     * Привязка слушателей к HTML-чекбоксам на вкладке настроек
     */
    bindUiElements() {
        const chkFlight = document.getElementById('settingFlightMode');
        const chkFps = document.getElementById('settingFpsMonitor');

        if (chkFlight) {
            chkFlight.checked = this.state.flightFromCapital;
            chkFlight.addEventListener('change', () => {
                this.state.flightFromCapital = chkFlight.checked;
                this.saveAndApply();
            });
        }

        if (chkFps) {
            chkFps.checked = this.state.enableFpsMonitor;
            chkFps.addEventListener('change', () => {
                this.state.enableFpsMonitor = chkFps.checked;
                this.saveAndApply();
            });
        }
    },

    /**
     * Применение выбранных параметров к глобальным переменным систем
     */
    applySettingsToEngine() {
        // Сквозная синхронизация с флагом траектории в app.js через глобальное окно window
        window.FLIGHT_FROM_CAPITAL_MODE = this.state.flightFromCapital;

        // Синхронизация со справочником мониторинга кадров
        MAP_CONFIG.ENABLE_FPS_MONITOR = this.state.enableFpsMonitor;

        // Показываем/прячем счетчик производительности, если он выведен на экран
        const fpsCounter = document.getElementById('fpsCounter') || document.querySelector('.fps-monitor');
        if (fpsCounter) {
            fpsCounter.style.display = this.state.enableFpsMonitor ? 'block' : 'none';
        }
    },

    /**
     * Сохранение конфигурации в локальную базу данных
     */
    saveAndApply() {
        localStorage.setItem('kingmakerSystemSettings', JSON.stringify(this.state));
        this.applySettingsToEngine();
    }
};

window.SettingsManager = SettingsManager;
export default SettingsManager;
