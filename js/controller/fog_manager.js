import { MAP_CONFIG } from '../config/app_config.js';
import HexCanvasRender from '../core/hex_canvas_render.js';
import EventBus from '../services/event_bus.js';

/**
 * Единый контроллер Тумана Войны для глобальной (гексы) и тактической (клетки) карт
 */
const FogManager = {
    isFogEnabled: true,

    init() {
        this.isFogEnabled = MAP_CONFIG.isGlobalFogEnabled !== false;
        this._ensureToggleButton();
    },

    _ensureToggleButton() {
        const rightPanel = document.querySelector('.right-controls-panel');
        let btn = document.getElementById('btnToggleFog');

        // Если кнопки нет в index.html — создаём её в правой панели 3х4
        if (!btn && rightPanel) {
            btn = document.createElement('button');
            btn.type = 'button';
            btn.id = 'btnToggleFog';
            btn.className = 'btn-ui-toggle';

            const mapModeBtn = document.getElementById('btnToggleMapMode');
            if (mapModeBtn && mapModeBtn.parentElement === rightPanel) {
                rightPanel.insertBefore(btn, mapModeBtn.nextSibling);
            } else {
                rightPanel.insertBefore(btn, rightPanel.firstChild);
            }
        }

        if (!btn || btn.dataset.fogBound) return;
        btn.dataset.fogBound = '1';

        this._syncButtonUi(btn);

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleAllFog();
        });
    },

    toggleAllFog() {
        this.isFogEnabled = !this.isFogEnabled;
        MAP_CONFIG.isGlobalFogEnabled = this.isFogEnabled;

        const btn = document.getElementById('btnToggleFog');
        if (btn) this._syncButtonUi(btn);

        // Обновляем обе карты одновременно
        HexCanvasRender.requestFrame();
        EventBus.emit('fog:toggled', this.isFogEnabled);
    },

    _syncButtonUi(btn) {
        btn.classList.toggle('paths-hidden', !this.isFogEnabled);
        btn.classList.toggle('fog-disabled', !this.isFogEnabled);
        btn.textContent = this.isFogEnabled ? '👁️' : '👓';
        btn.title = this.isFogEnabled
            ? 'Скрыть Туман Войны (Гексы и Лагерь)'
            : 'Включить Туман Войны (Гексы и Лагерь)';
    },

    syncMapFog(hexesData) {
        if (!hexesData) return;
        HexCanvasRender.updateData(hexesData);
    }
};

export default FogManager;
