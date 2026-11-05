import { MAP_CONFIG } from '../config/app_config.js';

/**
 * Модуль для управления стилями декоративной рамки карты, кадрированием холста холста и руническими эффектами
 */
const FrameManager = {
    RUNE_POOL: ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛟ', 'ᛞ'],
    frameElement: null,

    init() {
        this.frameElement = document.querySelector('.kingmaker-frame');
        this.initFrameStyleControls();
    },

    /**
     * Инициализация кнопок управления стилем рамки в интерфейсе
     */
    initFrameStyleControls() {
        const btn = document.getElementById('btnFrameStyle');
        if (!btn) return;

        const styles = [
            {id: 'norunes', icon: '🔲', title: 'Рамка: Без рун'},
            {id: 'runes', icon: 'ᚱ', title: 'Рамка: С рунами'},
            {id: 'ornament', icon: '🔸', title: 'Рамка: Орнамент'},
            {id: 'ornament-heavy', icon: '🔶', title: 'Рамка: Орнамент Крупный'}
        ];

        let currentStyleId = localStorage.getItem('kingmakerFrameStyle') || 'norunes';
        const getCurrentIndex = () => styles.findIndex(s => s.id === currentStyleId);

        btn.addEventListener('click', () => {
            let nextIdx = getCurrentIndex() + 1;
            if (nextIdx >= styles.length) nextIdx = 0;

            currentStyleId = styles[nextIdx].id;
            localStorage.setItem('kingmakerFrameStyle', currentStyleId);

            btn.innerHTML = styles[nextIdx].icon;
            btn.title = styles[nextIdx].title;

            this.applyFrameStyle(currentStyleId);
        });

        const startStyle = styles[getCurrentIndex()] || styles[0];
        btn.innerHTML = startStyle.icon;
        btn.title = startStyle.title;
        this.applyFrameStyle(startStyle.id);
    },


    /**
     * Применение CSS-классов темы и генерация базовых уголков рамки
     */
    applyFrameStyle(styleId) {
        if (!this.frameElement) this.frameElement = document.querySelector('.kingmaker-frame');
        if (!this.frameElement) return;

        // Очищаем все возможные старые классы стилей
        this.frameElement.classList.remove('frame-style-runes', 'frame-style-norunes', 'frame-style-ornament', 'frame-style-ornament-heavy');

        // Оба орнамента используют красивую базовую подложку norunes
        if (styleId === 'ornament' || styleId === 'ornament-heavy') {
            this.frameElement.classList.add('frame-style-norunes', `frame-style-${styleId}`);
        } else {
            this.frameElement.classList.add(`frame-style-${styleId}`);
        }

        const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
        corners.forEach(cClass => {
            if (!this.frameElement.querySelector(`.${cClass}`)) {
                const corner = document.createElement('div');
                corner.className = `frame-corner ${cClass}`;
                this.frameElement.appendChild(corner);
            }
        });

        // Полная очистка DOM от старых элементов
        this.frameElement.querySelectorAll('.hex-rune, .hex-diamond-teeth, .diamond-row').forEach(el => el.remove());

        const width = this.frameElement.offsetWidth;
        const height = this.frameElement.offsetHeight;

        if (styleId === 'runes') {
            this.updateFrameRunes(width, height);
        } else if (styleId === 'ornament' || styleId === 'ornament-heavy') {
            this.updateFrameOrnament(styleId);
        }
    },
    /**
     * Динамическое позиционирование рамки
     */
    updateBounds(viewport, mapContainer, currentZoom) {
        if (!this.frameElement) this.frameElement = document.querySelector('.kingmaker-frame');
        if (!this.frameElement || !viewport || !mapContainer) return;

        const mapRect = mapContainer.getBoundingClientRect();
        const viewRect = viewport.getBoundingClientRect();

        const cleanLeft = Math.max(viewRect.left, mapRect.left);
        const cleanTop = Math.max(viewRect.top, mapRect.top);
        const cleanRight = Math.min(viewRect.right, mapRect.right);
        const cleanBottom = Math.min(viewRect.bottom, mapRect.bottom);

        const baseWidth = Math.max(0, cleanRight - cleanLeft);
        const baseHeight = Math.max(0, cleanBottom - cleanTop);

        if (baseWidth > 0 && baseHeight > 0) {
            const borderWidth = 22;
            this.frameElement.style.display = 'block';

            let frameLeft = cleanLeft - borderWidth;
            let frameTop = cleanTop - borderWidth;
            let frameWidth = baseWidth + (borderWidth * 2);
            let frameHeight = baseHeight + (borderWidth * 2);

            if (frameLeft < viewRect.left) { frameWidth -= (viewRect.left - frameLeft); frameLeft = viewRect.left; }
            if (frameTop < viewRect.top) { frameHeight -= (viewRect.top - frameTop); frameTop = viewRect.top; }
            if (frameLeft + frameWidth > viewRect.right) { frameWidth = viewRect.right - frameLeft; }
            if (frameTop + frameHeight > viewRect.bottom) { frameHeight = viewRect.bottom - frameTop; }

            this.frameElement.style.left = `${Math.floor(frameLeft)}px`;
            this.frameElement.style.top = `${Math.floor(frameTop)}px`;
            this.frameElement.style.width = `${Math.ceil(frameWidth)}px`;
            this.frameElement.style.height = `${Math.ceil(frameHeight)}px`;

            const currentStyleId = localStorage.getItem('kingmakerFrameStyle') || 'norunes';
            if (currentStyleId === 'runes') {
                this.updateFrameRunes(Math.ceil(frameWidth), Math.ceil(frameHeight));
            }

            const clipLeft = Math.max(0, viewRect.left - mapRect.left) / currentZoom;
            const clipTop = Math.max(0, viewRect.top - mapRect.top) / currentZoom;
            const clipRight = Math.max(0, mapRect.right - viewRect.right) / currentZoom;
            const clipBottom = Math.max(0, mapRect.bottom - viewRect.bottom) / currentZoom;

            mapContainer.style.clipPath = `inset(${clipTop}px ${clipRight}px ${clipBottom}px ${clipLeft}px)`;
        } else {
            this.frameElement.style.display = 'none';
            mapContainer.style.clipPath = 'none';
        }
    },


    /**
     * Отрисовка скандинавских рун по периметру рамки
     */
    updateFrameRunes(width, height) {
        this.frameElement.querySelectorAll('.hex-rune, .hex-diamond-teeth').forEach(el => el.remove());

        const step = MAP_CONFIG.viewport.step || 50;
        const padding = MAP_CONFIG.viewport.padding || 20;

        // Коррекция на -22px бордера для точного попадания в центр золотой линии
        const cTop = -11;
        const cLeft = -11;
        const cBottom = height - 33;
        const cRight = width - 33;

        const createRune = (left, top) => {
            const runeElement = document.createElement('div');
            runeElement.className = 'hex-rune';
            runeElement.style.left = `${left}px`;
            runeElement.style.top = `${top}px`;
            runeElement.style.transform = 'translate(-50%, -50%)';
            runeElement.style.animationDelay = `${Math.random() * -3.5}s`;
            runeElement.textContent = this.RUNE_POOL[Math.floor(Math.random() * this.RUNE_POOL.length)];
            this.frameElement.appendChild(runeElement);
        };

        const innerWidth = width - 44;
        const innerHeight = height - 44;

        // Горизонтальные ряды
        for (let l = padding; l < innerWidth - padding; l += step) {
            createRune(l, cTop);
            createRune(l, cBottom);
        }
        // Вертикальные ряды
        for (let t = padding; t < innerHeight - padding; t += step) {
            createRune(cLeft, t);
            createRune(cRight, t);
        }
    },


    /**
     * Универсальное создание линеек орнамента с увеличенной плотностью элементов
     */
    updateFrameOrnament(styleId = 'ornament') {
        this.frameElement.querySelectorAll('.hex-rune, .hex-diamond-teeth, .diamond-row').forEach(el => el.remove());

        const width = this.frameElement.offsetWidth || window.innerWidth;
        const height = this.frameElement.offsetHeight || window.innerHeight;

        const directions = ['top', 'bottom', 'left', 'right'];
        const fragment = document.createDocumentFragment();

        const isHeavy = styleId === 'ornament-heavy';
        // 35px для обычного стиля, 36px для тяжелого (дает высокую плотность под размер 24х24)
        const targetStep = isHeavy ? 36 : 35;
        const paddingOffset = isHeavy ? 80 : 56;

        directions.forEach(dir => {
            const row = document.createElement('div');
            row.className = `diamond-row row-${dir}`;

            let count = 0;
            if (dir === 'top' || dir === 'bottom') {
                const availableWidth = Math.max(0, width - paddingOffset);
                count = Math.floor(availableWidth / targetStep);
            } else {
                const availableHeight = Math.max(0, height - paddingOffset);
                count = Math.ceil(availableHeight / targetStep);
            }

            if (count > 0) {
                const half = Math.floor(count / 2);

                for (let i = 0; i < count; i++) {
                    if (isHeavy && i === half) {
                        const spacer = document.createElement('div');
                        spacer.className = 'diamond-spacer';
                        row.appendChild(spacer);
                    }

                    const tooth = document.createElement('div');
                    tooth.className = 'diamond-tooth';
                    row.appendChild(tooth);
                }
                fragment.appendChild(row);
            }
        });

        this.frameElement.appendChild(fragment);
    }

}


export default FrameManager;
