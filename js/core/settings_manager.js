import { MAP_CONFIG } from '../config/app_config.js';

/**
 * Модуль управления конфигурацией и системными настройками интерфейса
 */
const SettingsManager = {
    state: {
        flightFromCapital: true,
        enableFpsMonitor: true,
        fogOpacity: 70 // Дефолтное значение плотности тумана (0.7)
    },

    init() {
        try {
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

    bindUiElements() {
        const chkFlight = document.getElementById('settingFlightMode');
        const chkFps = document.getElementById('settingFpsMonitor');
        const sldFog = document.getElementById('settingFogOpacity');
        const lblFog = document.getElementById('settingFogOpacityVal');

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

        // Привязка нового ползунка плотности тумана
        if (sldFog) {
            sldFog.value = this.state.fogOpacity;
            if (lblFog) lblFog.textContent = `${this.state.fogOpacity}%`;

            sldFog.addEventListener('input', () => {
                this.state.fogOpacity = parseInt(sldFog.value, 10);
                if (lblFog) lblFog.textContent = `${this.state.fogOpacity}%`;
                this.saveAndApply();
            });
        }
    },

    applySettingsToEngine() {
        window.FLIGHT_FROM_CAPITAL_MODE = this.state.flightFromCapital;
        MAP_CONFIG.ENABLE_FPS_MONITOR = this.state.enableFpsMonitor;

        // Переводим проценты (0-100) в коэффициент альфа-канала для Canvas (0.0 - 1.0)
        window.GLOBAL_FOG_OPACITY = this.state.fogOpacity / 100;

        const fpsCounter = document.getElementById('fpsCounter') || document.querySelector('.fps-monitor');
        if (fpsCounter) {
            fpsCounter.style.display = this.state.enableFpsMonitor ? 'block' : 'none';
        }

        // Запрашиваем мгновенную перерисовку холста Canvas, чтобы увидеть изменения тумана «на лету»
        if (window.HexCanvasRender && typeof window.HexCanvasRender.requestFrame === 'function') {
            window.HexCanvasRender.requestFrame();
        }
    },

    saveAndApply() {
        localStorage.setItem('kingmakerSystemSettings', JSON.stringify(this.state));
        this.applySettingsToEngine();
    }
};

window.SettingsManager = SettingsManager;
export default SettingsManager;
