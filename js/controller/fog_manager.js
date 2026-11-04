/**
 * Универсальный модуль для управления Туманом Войны (Fog of War) на интерактивных картах.
 * Поддерживает как гексагональные, так и классические прямоугольные сеточные системы.
 */
const FogManager = {
    /**
     * Базовый метод для переключения видимости тумана на конкретном элементе ячейки карты
     * @param {HTMLElement|null} cellElement - DOM-элемент ячейки (гекс, клетка, див)
     * @param {boolean} isVisible - Флаг: true — туман рассеян, false — туман активен
     * @param {string} className - Название CSS-класса тумана (по умолчанию 'fog-active')
     */
    toggleCellFog(cellElement, isVisible, className = 'fog-active') {
        if (!cellElement) return;
        cellElement.classList.toggle(className, !isVisible);
    },

    /**
     * Массовое обновление тумана войны по всей карте на основе переданного объекта данных.
     * @param {Object} mapData - Полный объект состояния карты из StorageManager
     * @param {string} elementIdPrefix - Префикс ID элементов на карте (например, 'visual_')
     */
    syncMapFog(mapData, elementIdPrefix = 'visual_') {
        if (!mapData) return;

        for (let cellId in mapData) {
            const cellData = mapData[cellId];
            if (!cellData) continue;

            // Ищем элемент на холсте по его составному ID (например, 'visual_hex_0_0')
            const cellElement = document.getElementById(elementIdPrefix + cellId);

            if (cellElement) {
                // Рассчитываем видимость: открыто, если ячейка разведана ИЛИ отряд там уже бывал
                const isRevealed = !!(cellData.explored || cellData.hasVisited);
                this.toggleCellFog(cellElement, isRevealed);
            }
        }
    }
};

export default FogManager;
