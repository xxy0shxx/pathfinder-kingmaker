/**
 * Универсальный модуль для управления и отрисовки путей/маршрутов отряда (Pathfinding Log).
 * Инкапсулирует работу с SVG-слоем и адаптирован как под гексы, так и под квадратные клетки.
 */
const PathManager = {
    svgLayer: null,
    history: [], // Хранит упорядоченный массив ID посещенных ячеек

    init() {
        this.svgLayer = document.getElementById('mapPathsSvg');
        this.loadPathHistory();

        // Если игра запущена впервые и история пуста, автоматически ищем, где стоит отряд
        if (this.history.length === 0) {
            // Импортируем или напрямую считываем данные из памяти, либо ищем по классу на холсте
            const allHexes = document.querySelectorAll('.visual-hex');
            for (let vHex of allHexes) {
                // Если у гекса в DOM есть флаг или класс squad-dark (отряд тут)
                if (vHex.classList.contains('squad-dark') || vHex.querySelector('.active-flag')) {
                    const hexId = vHex.id.replace('visual_', ''); // извлекаем чистый id (например, 'hex_0_0')
                    this.history.push(hexId);
                    localStorage.setItem('squadPathHistory', JSON.stringify(this.history));
                    break;
                }
            }
        }
    },

    /**
     * Загрузка истории перемещений из localStorage, чтобы маршрут сохранялся при перезагрузке
     */
    loadPathHistory() {
        try {
            this.history = JSON.parse(localStorage.getItem('squadPathHistory')) || [];
        } catch (e) {
            console.error("Ошибка чтения истории путей:", e);
            this.history = [];
        }
    },

    /**
     * Добавление новой точки в маршрут похода
     * @param {string} cellId - Идентификатор ячейки (гекса/клетки)
     */
    addPoint(cellId) {
        if (!cellId) return;

        // Если отряд переместился, записываем точку (избегаем дублирования подряд)
        if (this.history[this.history.length - 1] !== cellId) {
            this.history.push(cellId);
            localStorage.setItem('squadPathHistory', JSON.stringify(this.history));
            this.render();
        }
    },

    /**
     * Очистка всей истории маршрута (например, при сбросе карты)
     */
    clearHistory() {
        this.history = [];
        localStorage.removeItem('squadPathHistory');
        this.render();
    },

    /**
     * Генерация SVG-линий между всеми посещенными точками на карте
     */
    render() {
        if (!this.svgLayer) this.svgLayer = document.getElementById('mapPathsSvg');
        if (!this.svgLayer) return;

        this.svgLayer.innerHTML = '';

        if (this.history.length < 2) return;

        let svgContent = '';

        for (let i = 0; i < this.history.length - 1; i++) {
            const startId = this.history[i];
            const endId = this.history[i + 1];

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
