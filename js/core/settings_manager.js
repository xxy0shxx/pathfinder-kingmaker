import { MAP_CONFIG } from '../config/app_config.js';

const SettingsManager = {
    state: {
        flightFromCapital: true,
        enableFpsMonitor: true,
        fogOpacity: 70,
        disableAutocenter: false,
        squadAnimMode: 'classic',
        squadTokenSkin: 'flag',
        squadTokenColor: 'gold',
        hideDc: false,
        hideLevel: false,
        hideObjTitle: false,
        hideObjIcon: false,
        hideTerrain: false,
        hideExplored: false,
        hideMapped: false,
        hideQuestMarkers: false // Новое реактивное свойство
    },

    init() {
        try {
            const savedSettings = JSON.parse(localStorage.getItem('kingmakerSystemSettings'));
            if (savedSettings) {
                this.state = { ...this.state, ...savedSettings };
            }
            this.applySettingsToEngine();
            this.bindUiElements();
        } catch (e) { console.error("Ошибка SettingsManager:", e); }
    },

    bindUiElements() {
        const ids = [
            { id: 'settingFlightMode', key: 'flightFromCapital', type: 'check' },
            { id: 'settingFpsMonitor', key: 'enableFpsMonitor', type: 'check' },
            { id: 'settingDisableAutocenter', key: 'disableAutocenter', type: 'check' },
            { id: 'settingHideDc', key: 'hideDc', type: 'check' },
            { id: 'settingHideLevel', key: 'hideLevel', type: 'check' },
            { id: 'settingHideObjTitle', key: 'hideObjTitle', type: 'check' },
            { id: 'settingHideObjIcon', key: 'hideObjIcon', type: 'check' },
            { id: 'settingHideTerrain', key: 'hideTerrain', type: 'check' },
            { id: 'settingHideExplored', key: 'hideExplored', type: 'check' },
            { id: 'settingHideMapped', key: 'hideMapped', type: 'check' },
            { id: 'settingHideQuestMarkers', key: 'hideQuestMarkers', type: 'check' }, // Привязка нового чекбокса
            { id: 'settingSquadTokenSkin', key: 'squadTokenSkin', type: 'value' },
            { id: 'settingSquadSpawnAnim', key: 'squadAnimMode', type: 'value' }
        ];
        ids.forEach(item => {
            const el = document.getElementById(item.id);
            if (!el) return;
            if (item.type === 'check') {
                el.checked = this.state[item.key];
                el.addEventListener('change', () => { this.state[item.key] = el.checked; this.saveAndApply(); });
            } else {
                el.value = this.state[item.key];
                el.addEventListener('change', () => { this.state[item.key] = el.value; this.saveAndApply(); });
            }
        });

        const sldFog = document.getElementById('settingFogOpacity');
        const lblFog = document.getElementById('settingFogOpacityVal');
        if (sldFog) {
            sldFog.value = this.state.fogOpacity;
            if (lblFog) lblFog.textContent = `${this.state.fogOpacity}%`;
            sldFog.addEventListener('input', () => {
                this.state.fogOpacity = parseInt(sldFog.value, 10);
                if (lblFog) lblFog.textContent = `${sldFog.value}%`;
                this.saveAndApply();
            });
        }

        const colorContainer = document.getElementById('squadTokenColorPresets');
        if (colorContainer) {
            const buttons = colorContainer.querySelectorAll('.squad-color-btn');
            buttons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.borderColor = '#fff';

                if (btn.dataset.color === this.state.squadTokenColor) {
                    btn.classList.add('active');
                    btn.style.borderColor = '#ffd875';
                }

                btn.addEventListener('click', () => {
                    buttons.forEach(x => { x.classList.remove('active'); x.style.borderColor = '#fff'; });
                    btn.classList.add('active');
                    btn.style.borderColor = '#ffd875';

                    this.state.squadTokenColor = btn.dataset.color;
                    this.saveAndApply();
                });
            });
        }
    },


    applySettingsToEngine() {
        window.DISABLE_CAMERA_AUTOCENTER = this.state.disableAutocenter;
        window.FLIGHT_FROM_CAPITAL_MODE = this.state.flightFromCapital;
        window.CURRENT_SQUAD_ANIMATION_MODE = this.state.squadAnimMode;
        window.CURRENT_SQUAD_TOKEN_SKIN = this.state.squadTokenSkin;
        window.CURRENT_SQUAD_TOKEN_COLOR = this.state.squadTokenColor;
        window.GLOBAL_FOG_OPACITY = this.state.fogOpacity / 100;
        MAP_CONFIG.ENABLE_FPS_MONITOR = this.state.enableFpsMonitor;

        // Фильтры отображения объектов на карте
        window.MAP_HIDE_DC = this.state.hideDc;
        window.MAP_HIDE_LEVEL = this.state.hideLevel;
        window.MAP_HIDE_OBJ_TYPE = this.state.hideObjType;
        window.MAP_HIDE_TERRAIN = this.state.hideTerrain;
        window.MAP_HIDE_OBJ_TITLE = this.state.hideObjTitle;
        window.MAP_HIDE_OBJ_ICON = this.state.hideObjIcon;
        window.MAP_HIDE_EXPLORED = this.state.hideExplored;
        window.MAP_HIDE_MAPPED = this.state.hideMapped;

        // СИНХРОНИЗАЦИЯ С ДВИЖКОМ CANVAS:
        window.MAP_HIDE_QUEST_MARKERS = this.state.hideQuestMarkers;
        if (window.HexCanvasRender) {
            // Переворачиваем флаг, так как в меню у нас "Скрыть" (true), а в движке "Показывать" (show)
            window.HexCanvasRender.showQuestTooltips = !this.state.hideQuestMarkers;
        }

        const fpsCounter = document.getElementById('fpsCounter') || document.querySelector('.fps-monitor');
        if (fpsCounter) fpsCounter.style.display = this.state.enableFpsMonitor ? 'block' : 'none';

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
