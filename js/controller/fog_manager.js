import HexCanvasRender from '../core/hex_canvas_render.js';

/**
 * Модуль для управления Туманом Войны (Fog of War) на Canvas-карте.
 */
const FogManager = {
    /**
     * Больше не работает с HTML-нодами. Просто сообщает Canvas, что данные обновились.
     * @param {Object} hexesData - Ветка гексов mapData.hexes из StorageManager
     */
    syncMapFog(hexesData) {
        if (!hexesData) return;

        // Просто проталкиваем актуальный стейт гексов в Canvas-рендер.
        // Рендерер в своем цикле requestAnimationFrame сам проверит флаги
        // explored и hasVisited для каждого гекса и наложит туман!
        HexCanvasRender.updateData(hexesData);
    }
};

export default FogManager;