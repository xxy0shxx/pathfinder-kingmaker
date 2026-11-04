import { MAP_CONFIG } from '../config/app_config.js';
import { ColorConverter } from '../utils/helpers.js';
import AnimationManager from '../services/animation_manager.js';

/**
 * Модуль синхронизации UI: создание внутренних слоев гекса и обновление его DOM-состояния
 */
const HexUiSyncer = {
    visualLayer: null,

    init() {
        this.visualLayer = document.getElementById('visualLayer');
    },

    /**
     * Первичное создание внутренних DOM-слоев, индикаторов и маркеров гекса
     * (Вызывается один раз при построении сетки в HexManager)
     */
    createSubLayers(vHex, hexId, cx, cy, radius, data) {
        if (!this.visualLayer) this.init();

        // 1. Слой заливки цвета (внутренняя форма)
        const shape = document.createElement('div');
        shape.className = 'hex-shape';
        shape.setAttribute('id', 'shape_' + hexId);
        if (data && data.color) {
            shape.style.backgroundColor = ColorConverter.hexToRgba(data.color, 0.37);
        }
        if (data && data.squadHere) { vHex.classList.add('squad-dark'); }
        vHex.appendChild(shape);

        // 2. Текстовая плашка названия объекта
        const titleLabel = document.createElement('div');
        titleLabel.className = 'hex-title-label-framed';
        titleLabel.setAttribute('id', 'title_label_' + hexId);
        const titleText = document.createElement('span');
        titleText.className = 'hex-title-text';
        titleLabel.appendChild(titleText);
        titleLabel.style.left = cx + 'px';
        titleLabel.style.top = (cy - radius + 30) + 'px';
        this.visualLayer.appendChild(titleLabel);

        // 3. Текстовая плашка сложности и уровня региона
        const statsLabel = document.createElement('div');
        statsLabel.className = 'hex-title-label-framed hex-region-stats-framed';
        statsLabel.setAttribute('id', 'stats_label_' + hexId);
        const statsText = document.createElement('span');
        statsText.className = 'hex-title-text';
        statsLabel.appendChild(statsText);
        statsLabel.style.left = cx + 'px';
        statsLabel.style.top = (cy + 48) + 'px';
        this.visualLayer.appendChild(statsLabel);

        // 4. Контейнеры для статусных иконок
        const exploredElem = document.createElement('div'); exploredElem.className = 'explored-icon-container'; vHex.appendChild(exploredElem);
        const mappedElem = document.createElement('div'); mappedElem.className = 'mapped-icon-container'; vHex.appendChild(mappedElem);
        const typeElem = document.createElement('div'); typeElem.className = 'type-icon-container'; vHex.appendChild(typeElem);
        const terrainElem = document.createElement('div'); terrainElem.className = 'terrain-icon-container'; vHex.appendChild(terrainElem);

        // 5. Контейнер статического флага отряда
        const flagContainer = document.createElement('div');
        flagContainer.className = 'squad-flag-container';
        const pole = document.createElement('div'); pole.className = 'squad-pole';
        const flag = document.createElement('div'); flag.className = 'squad-flag';
        pole.appendChild(flag); flagContainer.appendChild(pole); vHex.appendChild(flagContainer);

        // Заполнение начальными данными, если они есть
        if (data) {
            if (data.title) { titleText.textContent = data.title; }

            const diff = data.difficulty;
            const lvl = data.regionLevel;
            if (diff && lvl) statsText.textContent = `🎲${diff}💀${lvl}`;
            else if (diff) statsText.textContent = `🎲${diff}`;
            else if (lvl) statsText.textContent = `💀${lvl}`;
            statsLabel.style.display = (diff || lvl) ? 'flex' : 'none';

            if (data.terrain && MAP_CONFIG.terrains[data.terrain]) {
                terrainElem.style.display = 'block';
                terrainElem.textContent = MAP_CONFIG.terrains[data.terrain].icon;
            }
            if (data.type && MAP_CONFIG.types[data.type]) {
                typeElem.style.display = 'block';
                typeElem.textContent = MAP_CONFIG.types[data.type].icon;
            }
            if (data.squadHere) {
                flagContainer.style.display = 'block';
                flagContainer.classList.add('active-flag');
            }
            if (data.explored) { exploredElem.style.display = 'block'; exploredElem.textContent = '🔍'; }
            if (data.mapMapped) { mappedElem.style.display = 'block'; mappedElem.textContent = '📜'; }

            if (data.questData && data.questData.title && data.questData.title.trim() !== '' && data.questData.status !== 'completed') {
                this.updateQuestTooltip(vHex, hexId, cx, cy, data.questData.title.trim());
            }
        }
    },
    /**
     * Сквозное обновление всех DOM-элементов гекса на карте после изменения данных
     * (Вызывается из коллбэка onSave в main.js)
     */
    sync(hexId, formData, oldHexId) {
        if (!this.visualLayer) this.init();

        const currentHexElement = document.getElementById('visual_' + hexId);
        const currentShape = document.getElementById('shape_' + hexId);
        if (!currentHexElement) return;

        // 1. Состояние отряда (классы подсветок)
        currentHexElement.classList.toggle('squad-dark', formData.squadHere);

        // 2. Текст заголовка объекта
        const tLabel = document.getElementById('title_label_' + hexId);
        if (tLabel) {
            const textNode = tLabel.querySelector('.hex-title-text');
            if (textNode) textNode.textContent = formData.title;
        }

        // 3. Плашка уровня и сложности региона
        const statsLabel = document.getElementById('stats_label_' + hexId);
        if (statsLabel) {
            const sTextNode = statsLabel.querySelector('.hex-title-text');
            if (sTextNode) {
                if (formData.difficulty && formData.regionLevel) sTextNode.textContent = `🎲${formData.difficulty}💀${formData.regionLevel}`;
                else if (formData.difficulty) sTextNode.textContent = `🎲${formData.difficulty}`;
                else if (formData.regionLevel) sTextNode.textContent = `💀${formData.regionLevel}`;
                else sTextNode.textContent = '';
            }
            statsLabel.style.display = (formData.difficulty || formData.regionLevel) ? 'flex' : 'none';
        }

        // 4. Иконки объекта и ландшафта
        const typeElem = currentHexElement.querySelector('.type-icon-container');
        if (typeElem) {
            typeElem.style.display = formData.type === "" ? 'none' : 'block';
            typeElem.textContent = MAP_CONFIG.types[formData.type]?.icon || '';
        }
        const terrainElem = currentHexElement.querySelector('.terrain-icon-container');
        if (terrainElem) {
            terrainElem.style.display = formData.terrain === "" ? 'none' : 'block';
            terrainElem.textContent = MAP_CONFIG.terrains[formData.terrain]?.icon || '';
        }

        // 5. Статусы разведки
        const exploredElem = currentHexElement.querySelector('.explored-icon-container');
        if (exploredElem) {
            exploredElem.style.display = formData.explored ? 'block' : 'none';
            exploredElem.textContent = formData.explored ? '🔍' : '';
        }
        const mappedElem = currentHexElement.querySelector('.mapped-icon-container');
        if (mappedElem) {
            mappedElem.style.display = formData.mapMapped ? 'block' : 'none';
            mappedElem.textContent = formData.mapMapped ? '📜' : '';
        }

        // 6. Обновление цвета подложки гекса
        if (currentShape) {
            currentShape.style.backgroundColor = formData.color !== 'transparent'
                ? ColorConverter.hexToRgba(formData.color, 0.37)
                : 'rgba(255, 255, 255, 0)';
        }

        // 7. Синхронизация мини-тултипов квестов
        let qTooltip = this.visualLayer.querySelector(`.hex-quest-mini-tooltip[data-hex-id="${hexId}"]`);
        if (formData.questData && formData.questData.status !== 'completed') {
            const hexLeft = parseFloat(currentHexElement.style.left) || 0;
            const hexTop = parseFloat(currentHexElement.style.top) || 0;
            const hexWidth = parseFloat(currentHexElement.style.width) || 0;
            this.updateQuestTooltip(currentHexElement, hexId, hexLeft + hexWidth / 2, hexTop, formData.questData.title);
        } else if (qTooltip) {
            qTooltip.remove();
        }

        // 8. Логика анимации летящего флага отряда
        const flagElem = currentHexElement.querySelector('.squad-flag-container');
        if (flagElem) {
            if (formData.squadHere) {
                const isAlreadyHere = flagElem.classList.contains('active-flag') && flagElem.style.display === 'block';

                if (!isAlreadyHere) {
                    flagElem.style.display = 'none';
                    flagElem.classList.remove('active-flag');

                    const oldHexElement = document.getElementById('visual_' + oldHexId);

                    AnimationManager.playFlagFlight(oldHexElement, currentHexElement, () => {
                        flagElem.style.display = 'block';
                        flagElem.style.animation = 'flagAppear 0.05s forwards';

                        setTimeout(() => {
                            flagElem.style.animation = '';
                            flagElem.classList.add('active-flag');
                        }, 50);
                    });
                }
            } else {
                flagElem.style.display = 'none';
                flagElem.classList.remove('active-flag');
                flagElem.style.animation = '';
            }
        }
    },

    /**
     * Локальный хелпер для создания/обновления мини-тултипа квеста
     */
    updateQuestTooltip(vHex, hexId, targetX, targetY, title) {
        let qTooltip = this.visualLayer.querySelector(`.hex-quest-mini-tooltip[data-hex-id="${hexId}"]`);
        if (!qTooltip) {
            qTooltip = document.createElement('div');
            qTooltip.className = 'hex-quest-mini-tooltip';
            qTooltip.setAttribute('data-hex-id', hexId);
            this.visualLayer.appendChild(qTooltip);
        }
        qTooltip.textContent = '⚜️ ' + title;

        const isInitial = !vHex.style.width;
        const offsetTop = isInitial ? (MAP_CONFIG.grid.radius - 12) : -12;

        qTooltip.style.left = targetX + 'px';
        qTooltip.style.top = (targetY + offsetTop) + 'px';
    },

    /**
     * Сброс стилей и очистка кастомных данных гекса при удалении
     * (Вызывается из коллбэка onDelete в main.js)
     */
    clear(hexId) {
        const shape = document.getElementById('shape_' + hexId);
        const globalLabel = document.getElementById('title_label_' + hexId);
        const statsLabel = document.getElementById('stats_label_' + hexId);
        const currentHexElement = document.getElementById('visual_' + hexId);

        if (shape) shape.style.backgroundColor = 'rgba(255, 255, 255, 0)';
        if (globalLabel) {
            const textNode = globalLabel.querySelector('.hex-title-text');
            if (textNode) textNode.textContent = '';
        }
        if (statsLabel) {
            statsLabel.style.display = 'none';
            const textNode = statsLabel.querySelector('.hex-title-text');
            if (textNode) textNode.textContent = '';
        }

        if (currentHexElement) {
            currentHexElement.classList.remove('squad-dark');
            ['.type-icon-container', '.terrain-icon-container', '.explored-icon-container', '.mapped-icon-container', '.squad-flag-container'].forEach(selector => {
                const el = currentHexElement.querySelector(selector);
                if (el) {
                    el.style.display = 'none';
                    el.classList.remove('active-flag');
                }
            });
        }

        if (this.visualLayer) {
            const qTooltip = this.visualLayer.querySelector(`.hex-quest-mini-tooltip[data-hex-id="${hexId}"]`);
            if (qTooltip) qTooltip.remove();
        }
    }
};

export default HexUiSyncer;
