// ============================================================================
// СЕРВИС: ПРОФИЛИРОВАНИЕ И ОТЛАДКА (DEBUG & PROFILE MANAGER)
// ============================================================================

import { MAP_CONFIG } from '../config/app_config.js';

const DebugManager = {
    _fpsLastTime: performance.now(),
    _fpsFrames: 0,

    /**
     * Внутренний метод калькуляции и вывода производительности кадра (FPS)
     */
    profileFps() {
        // Если в конфигурации глобально отключен мониторинг, сразу выходим
        if (!MAP_CONFIG.ENABLE_FPS_MONITOR) return;

        this._fpsFrames++;
        const now = performance.now();

        if (now >= this._fpsLastTime + 1000) {
            const fps = Math.round((this._fpsFrames * 1000) / (now - this._fpsLastTime));

            let color = '#4aff4a';   // Высокий FPS (Зеленый)
            if (fps < 30) color = '#ff4a4a';      // Критический (Красный)
            else if (fps < 50) color = '#ffaa00'; // Просадка (Оранжевый)

            console.log(
                `%c FPS: ${fps}`,
                `background: #1e1e24; color: ${color}; font-weight: bold; border-left: 4px solid ${color}; padding: 2px 4px;`
            );

            this._fpsFrames = 0;
            this._fpsLastTime = now;
        }
    }
};

export default DebugManager;
