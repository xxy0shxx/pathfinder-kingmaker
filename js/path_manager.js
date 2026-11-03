/**
 * Универсальный модуль для управления и отрисовки путей/маршрутов отряда (Pathfinding Log).
 */
const PathManager = {
    svgLayer: null,
    mapDataRef: null, // Ссылка на общий объект данных карты

    init(mapData) {
        this.svgLayer = document.getElementById('mapPathsSvg');
        this.updateMapData(mapData);
    },

    /**
     * Обновление ссылки на данные карты (вызывается при старте и импорте файлов)
     */
    updateMapData(newMapData) {
        // Если прилетел undefined или null, подставляем пустой объект
        this.mapDataRef = newMapData || {};

        // Безопасная инициализация системного поля путей
        if (!this.mapDataRef.__pathHistory) {
            this.mapDataRef.__pathHistory = [];
        }
    },

    /**
     * Геттер для удобного получения массива истории
     */
    get history() {
        return this.mapDataRef && this.mapDataRef.__pathHistory ? this.mapDataRef.__pathHistory : [];
    },

    /**
     * Добавление новой точки в маршрут похода
     * @param {string} cellId - Идентификатор ячейки (гекса)
     */
    addPoint(cellId) {
        if (!this.mapDataRef || !cellId) return;

        const currentHistory = this.history;

        // Избегаем дублирования точек подряд
        if (currentHistory[currentHistory.length - 1] !== cellId) {
            currentHistory.push(cellId);

            // Сами данные в LocalStorage сохранит StorageManager в main.js сразу после этого вызова
            this.render();
        }
    },

    /**
     * Очистка всей истории маршрута
     */
    clearHistory() {
        if (this.mapDataRef) {
            this.mapDataRef.__pathHistory = [];
            this.render();
        }
    },

    /**
     * Генерация SVG-линий между всеми посещенными точками на карте
     */
    render() {
        if (!this.svgLayer) this.svgLayer = document.getElementById('mapPathsSvg');
        if (!this.svgLayer || !this.mapDataRef) return;

        this.svgLayer.innerHTML = '';

        const currentHistory = this.history;
        if (currentHistory.length < 2) return;

        let svgContent = '';

        for (let i = 0; i < currentHistory.length - 1; i++) {
            const startId = currentHistory[i];
            const endId = currentHistory[i + 1];

            const startEl = document.getElementById('visual_' + startId);
            const endEl = document.getElementById('visual_' + endId);

            if (startEl && endEl) {
                const startX = startEl.offsetLeft + startEl.offsetWidth / 2;
                const startY = startEl.offsetTop + startEl.offsetHeight / 2;

                const endX = endEl.offsetLeft + endEl.offsetWidth / 2;
                const endY = endEl.offsetTop + endEl.offsetHeight / 2;

                svgContent += `
                    <line 
                        x1="${startX}" 
                        y1="${startY}" 
                        x2="${endX}" 
                        y2="${endY}" 
                        stroke="#ffd875" 
                        stroke-width="5" 
                        class="squad-path-line"
                    ></line>
                `;
            }
        }

        this.svgLayer.innerHTML = svgContent;
    }
};

export default PathManager;
