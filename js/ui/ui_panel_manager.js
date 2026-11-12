/**
 * Модуль для управления глобальными UI-панелями, аудиоплеером и оверлеями карты
 */
const UiPanelManager = {
    playerWrapper: null,
    btnMinimize: null,
    masterToggleBtn: null,
    rightPanel: null,

    init() {
        this.playerWrapper = document.querySelector('.music-player-monolith-wrapper');
        this.btnMinimize = document.querySelector('.wa-minimize');
        this.masterToggleBtn = document.querySelector('.master-toggle-btn');
        this.rightPanel = document.querySelector('.right-controls-panel');
        this.attachEvents();
    },

    attachEvents() {
        // 1. Клик по кнопке "_" в шапке плеера Winamp
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

                if (this.playerWrapper && isMenuExpanded) {
                    this.playerWrapper.classList.remove('ui-expanded');
                    const btnTogglePlayer = document.getElementById('btnTogglePlayer');
                    if (btnTogglePlayer) btnTogglePlayer.removeAttribute('style');
                }
            });
        }

        // 3. Скрытие и отображение путей отряда
        const btnTogglePaths = document.getElementById('btnTogglePaths');
        const svgPathsLayer = document.getElementById('mapPathsSvg');

        if (btnTogglePaths && svgPathsLayer) {
            btnTogglePaths.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const isHidden = svgPathsLayer.classList.toggle('hide-paths');
                btnTogglePaths.classList.toggle('paths-hidden', isHidden);
            });
        }

        // 4. Кнопка вызова музыкального плеера на панели 3х4
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

        // 5. Регулировка прозрачности дорог королевства
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

        if (this.rightPanel && !document.getElementById('btnToggleKingdomRoads')) {
            const roadBtn = document.createElement('button');
            roadBtn.type = 'button';
            roadBtn.id = 'btnToggleKingdomRoads';
            roadBtn.className = 'btn-ui-toggle';
            roadBtn.innerHTML = '🛣️';

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
                    🛣️ Прозрачность дорог королевства:
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
