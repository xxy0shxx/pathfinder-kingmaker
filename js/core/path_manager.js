// PathManager.js

import HexCanvasRender from './hex_canvas_render.js';

/**
 * Универсальный модуль для управления и отрисовки путей/маршрутов отряда (Pathfinding Log).
 */
const PathManager = {
    svgLayer: null,
    mapDataRef: null, // Ссылка на глобальный корневой объект данных карты { hexes: {}, kingdom: {}, paths: [] }

    init(mapData) {
        this.svgLayer = document.getElementById('mapPathsSvg');
        this.updateMapData(mapData);
    },

    /**
     * Обновление ссылки на данные карты (вызывается при старте и импорте файлов)
     */
    updateMapData(newMapData) {
        // Подставляем чистую структуру, если прилетел пустой объект
        this.mapDataRef = newMapData || { hexes: {}, kingdom: null, paths: [] };

        // Изолированное системное поле путей на уровне корня сейва
        if (!this.mapDataRef.paths) {
            this.mapDataRef.paths = [];
        }

        this.render();
    },

    /**
     * Геттер для удобного получения массива истории из изолированной ветки
     */
    get history() {
        return this.mapDataRef && this.mapDataRef.paths ? this.mapDataRef.paths : [];
    },

    /**
     * Добавление новой точки в маршрут похода
     */
    addPoint(cellId) {
        if (!this.mapDataRef || !cellId) return;

        const currentHistory = this.history;

        // Избегаем дублирования точек подряд
        if (currentHistory[currentHistory.length - 1] !== cellId) {
            currentHistory.push(cellId);
            this.render();
        }
    },

    /**
     * Очистка всей истории маршрута
     */
    clearHistory() {
        if (this.mapDataRef) {
            this.mapDataRef.paths = [];
            this.render();
        }
    },

    /**
     * Генерация SVG-линий между всеми посещенными точками на карте на основе эталонных координат
     */
    render() {
        if (!this.svgLayer) this.svgLayer = document.getElementById('mapPathsSvg');
        if (!this.svgLayer || !this.mapDataRef) return;

        // Полностью очищаем старые линии на SVG-слое
        this.svgLayer.innerHTML = '';

        const currentHistory = this.history;
        // Если точек в истории меньше двух — рисовать линию не между чем
        if (currentHistory.length < 2) return;

        let svgContent = '';

        for (let i = 0; i < currentHistory.length - 1; i++) {
            const startId = currentHistory[i];
            const endId = currentHistory[i + 1];

            // Вместо поиска DOM-элементов берем чистые, эталонные cx и cy центра гексов
            const startCoords = HexCanvasRender.hexCoords[startId];
            const endCoords = HexCanvasRender.hexCoords[endId];

            // Если для обеих точек у нас есть вычисленные координаты — генерируем SVG-линию
            if (startCoords && endCoords) {
                svgContent += `
                    <line 
                        x1="${startCoords.cx}" 
                        y1="${startCoords.cy}" 
                        x2="${endCoords.cx}" 
                        y2="${endCoords.cy}" 
                        stroke="#ffd875" 
                        stroke-width="5" 
                        class="squad-path-line"
                    ></line>
                `;
            }
        }

        // Записываем сгенерированные линии в SVG-слой
        this.svgLayer.innerHTML = svgContent;
    }

};

export default PathManager;
