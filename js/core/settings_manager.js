import { MAP_CONFIG } from '../config/app_config.js';

/**
 * Модуль управления конфигурацией и системными настройками интерфейса
 */
const SettingsManager = {
    state: {
        flightFromCapital: true,
        enableFpsMonitor: true,
        fogOpacity: 70,
        disableAutocenter: false, // Наш новый флаг (по умолчанию выключен)
        squadAnimMode: 'classic',
        squadTokenSkin: 'flag'
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
        const chkAutocenter = document.getElementById('settingDisableAutocenter');
        const sldFog = document.getElementById('settingFogOpacity');
        const lblFog = document.getElementById('settingFogOpacityVal');
        const selAnim = document.getElementById('settingSquadSpawnAnim');
        const selSkin = document.getElementById('settingSquadTokenSkin');

        if (selSkin) {
            selSkin.value = this.state.squadTokenSkin;
            selSkin.addEventListener('change', () => {
                this.state.squadTokenSkin = selSkin.value;
                this.saveAndApply();
            });
        }

        if (selAnim) {
            selAnim.value = this.state.squadAnimMode;
            selAnim.addEventListener('change', () => {
                this.state.squadAnimMode = selAnim.value;
                this.saveAndApply();
            });
        }

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

        // Привязка нового чекбокса автоцентрирования камеры
        if (chkAutocenter) {
            chkAutocenter.checked = this.state.disableAutocenter;
            chkAutocenter.addEventListener('change', () => {
                this.state.disableAutocenter = chkAutocenter.checked;
                this.saveAndApply();
            });
        }

        if (sldFog) {
            sldFog.value = this.state.fogOpacity;
            if (lblFog) lblFog.textContent = `${this.state.fogOpacity}%`;

            sldFog.addEventListener('input', () => {
                this.state.fogOpacity = parseInt(sldFog.value, 10);
                if (lblFog) lblFog.textContent = `${sldFog.value}%`;
                this.saveAndApply();
            });
        }
    },


    applySettingsToEngine() {
        window.FLIGHT_FROM_CAPITAL_MODE = this.state.flightFromCapital;
        MAP_CONFIG.ENABLE_FPS_MONITOR = this.state.enableFpsMonitor;
        window.GLOBAL_FOG_OPACITY = this.state.fogOpacity / 100;

        // Передаем сквозную переменную в окно window для ViewportManager
        window.DISABLE_CAMERA_AUTOCENTER = this.state.disableAutocenter;
        window.CURRENT_SQUAD_TOKEN_SKIN = this.state.squadTokenSkin;

        const fpsCounter = document.getElementById('fpsCounter') || document.querySelector('.fps-monitor');
        if (fpsCounter) {
            fpsCounter.style.display = this.state.enableFpsMonitor ? 'block' : 'none';
        }

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
