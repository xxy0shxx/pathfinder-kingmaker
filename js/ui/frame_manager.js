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
     * Применение CSS-классов темы и запуск соответствующего рендера декора
     */
    applyFrameStyle(styleId) {
        if (!this.frameElement) this.frameElement = document.querySelector('.kingmaker-frame');
        if (!this.frameElement) return;

        this.frameElement.classList.remove('frame-style-runes', 'frame-style-norunes', 'frame-style-ornament', 'frame-style-ornament-heavy');

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

        // Зачистка старого декора
        this.frameElement.querySelectorAll('.hex-rune, .hex-diamond-teeth, .diamond-row, .center-bastion').forEach(el => el.remove());

        const width = this.frameElement.offsetWidth;
        const height = this.frameElement.offsetHeight;

        if (styleId === 'runes') {
            this.updateFrameRunes(width, height);
        } else if (styleId === 'ornament') {
            this.buildStandardOrnament(width, height);
        } else if (styleId === 'ornament-heavy') {
            this.buildHeavyOrnament(width, height);
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
     * Универсальное создание линеек орнамента (Полная стабилизация обычного и тяжелого стилей)
     */
    updateFrameOrnament(styleId = 'ornament') {
        // Полностью зачищаем старые элементы, линейки, бастионы и заплатки
        this.frameElement.querySelectorAll('.hex-rune, .hex-diamond-teeth, .diamond-row, .center-bastion, .ornament-center-plug').forEach(el => el.remove());

        const width = this.frameElement.offsetWidth || window.innerWidth;
        const height = this.frameElement.offsetHeight || window.innerHeight;

        const directions = ['top', 'bottom', 'left', 'right'];
        const fragment = document.createDocumentFragment();

        const isHeavy = styleId === 'ornament-heavy';

        // Математически выверенные шаги: 24px для обычной пилы (18х18), 26px/44px для тяжелого
        let stepHorizontal = isHeavy ? 26 : 24;
        let stepVertical = isHeavy ? 44 : 24;

        const paddingOffset = isHeavy ? 44 : 48;

        directions.forEach(dir => {
            const row = document.createElement('div');
            row.className = `diamond-row row-${dir}`;

            let count = 0;
            if (dir === 'top' || dir === 'bottom') {
                const availableWidth = Math.max(0, width - paddingOffset);
                count = Math.floor(availableWidth / stepHorizontal);
            } else {
                const availableHeight = Math.max(0, height - paddingOffset);
                count = Math.ceil(availableHeight / stepVertical);
            }

            if (count > 0) {
                const half = Math.floor(count / 2);

                for (let i = 0; i < count; i++) {
                    // Распорочный спейсер нужен только тяжелому орнаменту и вертикалям легкого
                    if (i === half && (isHeavy || (!isHeavy && (dir === 'left' || dir === 'right')))) {
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

            // РЕНДЕР ЦЕНТРАЛЬНЫХ ЭЛЕМЕНТОВ
            if (isHeavy) {
                // Для тяжелого стиля создаем гигантские геральдические щиты
                const bastion = document.createElement('div');
                bastion.className = `center-bastion bastion-${dir}`;
                fragment.appendChild(bastion);
            } else {
                // ДЛЯ ОБЫЧНОГО ОРНАМЕНТА: создаем аккуратный центрирующий ромб-заплатку, перекрывающий провал
                const plug = document.createElement('div');
                plug.className = `ornament-center-plug plug-${dir}`;
                fragment.appendChild(plug);
            }
        });

        this.frameElement.appendChild(fragment);
    },

    /**
     * МЕТОД 1: Отрисовка ОБЫЧНОГО орнамента (Жесткие фиксированные пиксели, пила под рамкой)
     */
    buildStandardOrnament(width, height) {
        const fragment = document.createDocumentFragment();

        // Шаг 24px гарантирует, что ромбы 18х18 встанут идеально встык без наездов
        const step = 24;
        const padding = 24;

        // Посадочная глубина осей под рамкой
        const cTop = -13;
        const cLeft = -13;
        const cBottom = height - 13;
        const cRight = width - 13;

        const createTooth = (left, top) => {
            const tooth = document.createElement('div');
            tooth.className = 'diamond-tooth hex-diamond-teeth';
            tooth.style.left = `${left}px`;
            tooth.style.top = `${top}px`;
            fragment.appendChild(tooth);
        };

        // Горизонтальные линии (Верх / Низ)
        for (let l = padding; l <= width - padding; l += step) {
            createTooth(l, cTop);
            createTooth(l, cBottom);
        }
        // Вертикальные линии (Лево / Право)
        for (let t = padding; t <= height - padding; t += step) {
            createTooth(cLeft, t);
            createTooth(cRight, t);
        }

        this.frameElement.appendChild(fragment);
    },

    /**
     * МЕТОД 2: Отрисовка ТЯЖЕЛОГО орнамента (Флекс-автоматика, раздвижение и бастионы)
     */
    buildHeavyOrnament(width, height) {
        const directions = ['top', 'bottom', 'left', 'right'];
        const fragment = document.createDocumentFragment();

        const stepHorizontal = 38;
        const stepVertical = 44;
        const paddingOffset = 44;

        directions.forEach(dir => {
            const row = document.createElement('div');
            row.className = `diamond-row row-${dir}`;

            let count = 0;
            if (dir === 'top' || dir === 'bottom') {
                const availableWidth = Math.max(0, width - paddingOffset);
                count = Math.floor(availableWidth / stepHorizontal);
            } else {
                const availableHeight = Math.max(0, height - paddingOffset);
                count = Math.ceil(availableHeight / stepVertical);
            }

            if (count > 0) {
                const half = Math.floor(count / 2);

                for (let i = 0; i < count; i++) {
                    if (i === half) {
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

            const bastion = document.createElement('div');
            bastion.className = `center-bastion bastion-${dir}`;
            fragment.appendChild(bastion);
        });

        this.frameElement.appendChild(fragment);
    }
}

export default FrameManager;
