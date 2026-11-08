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
     * Оптимизированный рендеринг пути через один тег <path>
     * Слой гарантированно изолирован под фигурками отряда
     */
    render() {
        if (!this.svgLayer) this.svgLayer = document.getElementById('mapPathsSvg');
        if (!this.svgLayer || !this.mapDataRef) return;

        const currentHistory = this.history;
        // Если точек в истории меньше двух — рисовать нечего
        if (currentHistory.length < 2) {
            this.svgLayer.innerHTML = '';
            return;
        }

        const coordsSource = HexCanvasRender.hexCoords || HexCanvasRender.coordinatesMap || null;

        if (!coordsSource) {
            console.error("PathManager: Координаты гексов в HexCanvasRender не найдены!");
            return;
        }

        let pathData = '';
        let isFirstPoint = true;

        for (let i = 0; i < currentHistory.length; i++) {
            const pointId = currentHistory[i];
            const coords = coordsSource[pointId];

            if (coords) {
                if (isFirstPoint) {
                    pathData += `M ${coords.cx} ${coords.cy}`;
                    isFirstPoint = false;
                } else {
                    pathData += ` L ${coords.cx} ${coords.cy}`;
                }
            }
        }

        if (pathData) {
            // Принудительно выставляем инлайновые стили для слоя, страхуя приоритет слоев
            this.svgLayer.style.zIndex = "5";
            this.svgLayer.style.pointerEvents = "none";

            this.svgLayer.innerHTML = `
                <path 
                    d="${pathData}" 
                    stroke="#ffd875" 
                    stroke-width="5" 
                    fill="none" 
                    class="squad-path-line"
                    style="pointer-events: none;"
                ></path>
            `;
        } else {
            this.svgLayer.innerHTML = '';
        }
    }


};

export default PathManager;
