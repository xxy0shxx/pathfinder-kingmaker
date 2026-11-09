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
        roundAudioMode: 'gong', // НОВОЕ: Способ оповещения раунда ('gong', 'bell', 'drum')
        hideDc: false,
        hideLevel: false,
        hideObjTitle: false,
        hideObjIcon: false,
        hideTerrain: false,
        hideExplored: false,
        hideMapped: false,
        hideQuestMarkers: false
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
            { id: 'settingHideQuestMarkers', key: 'hideQuestMarkers', type: 'check' }
        ];

        ids.forEach(item => {
            const el = document.getElementById(item.id);
            if (!el) return;
            el.checked = this.state[item.key];
            el.addEventListener('change', () => {
                this.state[item.key] = el.checked;
                this.saveAndApply();
            });
        });

        // СИНХРОНИЗАЦИЯ НОВОГО СЕЛЕКТА: Звуковое оповещение нового раунда боевой сцены
        const audioContainer = document.getElementById('customSelectRoundAudioMode');
        const audioHiddenInput = document.getElementById('settingRoundAudioMode');
        if (audioContainer && audioHiddenInput) {
            const savedAudio = this.state.roundAudioMode || 'gong';
            audioHiddenInput.value = savedAudio;

            if (window.UiSelectManager && typeof window.UiSelectManager.setCustomSelectValue === 'function') {
                window.UiSelectManager.setCustomSelectValue('customSelectRoundAudioMode', savedAudio);
            }

            audioContainer.querySelectorAll('.custom-option').forEach(option => {
                option.addEventListener('click', () => {
                    this.state.roundAudioMode = option.dataset.value;
                    audioHiddenInput.value = option.dataset.value;
                    this.saveAndApply();
                });
            });
        }
        // 1. СИНХРОНИЗАЦИЯ КАСТОМНОГО СЕЛЕКТА (Скин токена отряда)
        const container = document.getElementById('customSelectSquadTokenSkin');
        const hiddenInput = document.getElementById('settingSquadTokenSkin');
        if (container && hiddenInput) {
            const savedSkin = this.state.squadTokenSkin;
            hiddenInput.value = savedSkin;

            if (window.UiSelectManager && typeof window.UiSelectManager.setCustomSelectValue === 'function') {
                window.UiSelectManager.setCustomSelectValue('customSelectSquadTokenSkin', savedSkin);
            } else {
                const activeOption = container.querySelector(`.custom-option[data-value="${savedSkin}"]`);
                if (activeOption) {
                    container.querySelectorAll('.custom-option').forEach(o => o.classList.remove('selected'));
                    activeOption.classList.add('selected');
                    const trigger = container.querySelector('.custom-select-trigger');
                    if (trigger) trigger.textContent = activeOption.textContent;
                }
            }

            container.querySelectorAll('.custom-option').forEach(option => {
                option.addEventListener('click', () => {
                    this.state.squadTokenSkin = option.dataset.value;
                    hiddenInput.value = option.dataset.value;
                    this.saveAndApply();
                });
            });
        }

        // 2. СИНХРОНИЗАЦИЯ ГРУППЫ РАДИОКНОПОК (Режим эффектов прибытия)
        const savedAnimMode = this.state.squadAnimMode;
        const animRadioButtons = document.querySelectorAll('input[name="squadAnimMode"]');

        animRadioButtons.forEach(radio => {
            if (radio.value === savedAnimMode) {
                radio.checked = true;
            }
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    this.state.squadAnimMode = radio.value;
                    this.saveAndApply();
                }
            });
        });

        // 3. Управление ползунком плотности Тумана Войны
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

        // 4. Привязка пресетов цвета фигурки отряда
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

        // Передаем выбранный пресет звука раунда в трекер инициативы
        if (window.InitiativeManager) {
            window.InitiativeManager.state.audioPreset = this.state.roundAudioMode || 'gong';
        }

        window.MAP_HIDE_DC = this.state.hideDc;
        window.MAP_HIDE_LEVEL = this.state.hideLevel;
        window.MAP_HIDE_TERRAIN = this.state.hideTerrain;
        window.MAP_HIDE_OBJ_TITLE = this.state.hideObjTitle;
        window.MAP_HIDE_OBJ_ICON = this.state.hideObjIcon;
        window.MAP_HIDE_EXPLORED = this.state.hideExplored;
        window.MAP_HIDE_MAPPED = this.state.hideMapped;

        window.MAP_HIDE_QUEST_MARKERS = this.state.hideQuestMarkers;
        if (window.HexCanvasRender) {
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
