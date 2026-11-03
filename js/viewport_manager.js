import { MAP_CONFIG } from './config/app_config.js';

/**
 * Модуль управления вьюпортом: скролл, зум, перемещение и адаптация рамки
 */
const ViewportManager = {
    RUNE_POOL: ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛟ', 'ᛞ'],
    lastFrameWidth: 0,
    lastFrameHeight: 0,

    minZoom: MAP_CONFIG.viewport.minZoom,
    maxZoom: MAP_CONFIG.viewport.maxZoom,
    currentZoom: MAP_CONFIG.viewport.defaultZoom,

    isDragging: false,
    hasMoved: false,
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,

    viewport: null,
    mapContainer: null,

    /**
     * Инициализация менеджера вьюпорта
     */
    init() {
        this.viewport = document.getElementById('viewport');
        this.mapContainer = document.getElementById('mapContainer');
        if (!this.viewport || !this.mapContainer) return;

        this.attachMouseEvents();
        this.attachTouchEvents();

        this.viewport.addEventListener('click', (e) => {
            if (this.getHasMoved()) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);

        window.addEventListener('resize', () => this.updateMapTransform());

        this.initFrameStyleControls();
        setTimeout(() => this.updateMapTransform(), 150);
    },

    getHasMoved() {
        return this.hasMoved;
    },

    resetHasMoved() {
        this.hasMoved = false;
    },

    /**
     * Привязка событий мыши (Desktop)
     */
    attachMouseEvents() {
        this.viewport.addEventListener('mousedown', (e) => {
            if (e.target.closest('#hexMenu') || e.target.closest('.pop-menu') ||
                e.target.closest('button') || e.target.closest('.player-container') ||
                e.target.closest('select') || e.target.closest('input')) return;

            this.isDragging = true;
            this.hasMoved = false;
            this.startX = e.pageX - this.x;
            this.startY = e.pageY - this.y;
        });

        this.viewport.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            e.preventDefault();
            this.processMove(e.pageX, e.pageY);
        });

        window.addEventListener('mouseup', () => {
            this.isDragging = false;
            setTimeout(() => { this.hasMoved = false; }, 20);
        });

        this.viewport.addEventListener('mouseleave', () => {
            this.isDragging = false;
        });

        this.viewport.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            const newZoom = this.currentZoom * delta;

            if (newZoom >= this.minZoom && newZoom <= this.maxZoom) {
                this.currentZoom = newZoom;
                this.updateMapTransform();
            }
        }, { passive: false });
    },
    /**
     * Привязка тач-событий (Mobile)
     */
    attachTouchEvents() {
        this.viewport.addEventListener('touchstart', (e) => {
            if (e.target.closest('#hexMenu') || e.target.closest('.pop-menu') ||
                e.target.closest('button') || e.target.closest('.player-container') ||
                e.target.closest('select') || e.target.closest('input')) return;

            this.isDragging = true;
            this.hasMoved = false;
            const touch = e.touches[0];
            this.startX = touch.pageX - this.x;
            this.startY = touch.pageY - this.y;
        }, { passive: true });

        this.viewport.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            if (e.cancelable) e.preventDefault();

            const touch = e.touches[0];
            this.processMove(touch.pageX, touch.pageY);
        }, { passive: false });

        this.viewport.addEventListener('touchend', () => {
            this.isDragging = false;
            setTimeout(() => { this.hasMoved = false; }, 20);
        });

        this.viewport.addEventListener('touchcancel', () => {
            this.isDragging = false;
        });
    },

    /**
     * Общая математика смещения координат холста с учетом лимитов из конфигурации
     */
    processMove(pageX, pageY) {
        let newX = pageX - this.startX;
        let newY = pageY - this.startY;

        if (Math.abs(newX - this.x) > 3 || Math.abs(newY - this.y) > 3) {
            this.hasMoved = true;
        }

        const { minX, maxX, minY, maxY } = MAP_CONFIG.viewport.limits;

        this.x = Math.max(minX, Math.min(maxX, newX));
        this.y = Math.max(minY, Math.min(maxY, newY));

        this.updateMapTransform();
    },
    /**
     * Расчет CSS-трансформаций и динамическое inset-кадрирование холста
     */
    updateMapTransform() {
        requestAnimationFrame(() => {
            this.mapContainer.style.transform = `translate(${Math.round(this.x)}px, ${Math.round(this.y)}px) scale(${this.currentZoom})`;

            const frame = document.querySelector('.kingmaker-frame');
            if (frame && this.viewport && this.mapContainer) {
                const mapRect = this.mapContainer.getBoundingClientRect();
                const viewRect = this.viewport.getBoundingClientRect();

                const cleanLeft = Math.max(viewRect.left, mapRect.left);
                const cleanTop = Math.max(viewRect.top, mapRect.top);
                const cleanRight = Math.min(viewRect.right, mapRect.right);
                const cleanBottom = Math.min(viewRect.bottom, mapRect.bottom);

                const baseWidth = Math.max(0, cleanRight - cleanLeft);
                const baseHeight = Math.max(0, cleanBottom - cleanTop);

                if (baseWidth > 0 && baseHeight > 0) {
                    const borderWidth = 22;
                    frame.style.display = 'block';

                    let frameLeft = cleanLeft - borderWidth;
                    let frameTop = cleanTop - borderWidth;
                    let frameWidth = baseWidth + (borderWidth * 2);
                    let frameHeight = baseHeight + (borderWidth * 2);

                    if (frameLeft < viewRect.left) {
                        frameWidth -= (viewRect.left - frameLeft);
                        frameLeft = viewRect.left;
                    }
                    if (frameTop < viewRect.top) {
                        frameHeight -= (viewRect.top - frameTop);
                        frameTop = viewRect.top;
                    }
                    if (frameLeft + frameWidth > viewRect.right) {
                        frameWidth = viewRect.right - frameLeft;
                    }
                    if (frameTop + frameHeight > viewRect.bottom) {
                        frameHeight = viewRect.bottom - frameTop;
                    }

                    frame.style.left = `${Math.floor(frameLeft)}px`;
                    frame.style.top = `${Math.floor(frameTop)}px`;
                    frame.style.width = `${Math.ceil(frameWidth)}px`;
                    frame.style.height = `${Math.ceil(frameHeight)}px`;

                    this.updateFrameRunes(Math.ceil(frameWidth), Math.ceil(frameHeight));

                    const clipLeft = Math.max(0, viewRect.left - mapRect.left) / this.currentZoom;
                    const clipTop = Math.max(0, viewRect.top - mapRect.top) / this.currentZoom;
                    const clipRight = Math.max(0, mapRect.right - viewRect.right) / this.currentZoom;
                    const clipBottom = Math.max(0, mapRect.bottom - viewRect.bottom) / this.currentZoom;

                    this.mapContainer.style.clipPath = `inset(${clipTop}px ${clipRight}px ${clipBottom}px ${clipLeft}px)`;
                } else {
                    frame.style.display = 'none';
                    this.mapContainer.style.clipPath = 'none';
                }
            }
        });
    },
    /**
     * Инициализация переключателя стилей рамки
     */
    initFrameStyleControls() {
        const btn = document.getElementById('btnFrameStyle');
        if (!btn) return;

        const styles = [
            { id: 'norunes', icon: '🔲', title: 'Рамка: Без рун' },
            { id: 'runes', icon: 'ᚱ', title: 'Рамка: С рунами' },
            { id: 'ornament', icon: '🔸', title: 'Рамка: Орнамент' }
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
     * Применение CSS-классов к рамке
     */
    applyFrameStyle(styleId) {
        const frame = document.querySelector('.kingmaker-frame');
        if (!frame) return;

        frame.classList.remove('frame-style-runes', 'frame-style-norunes', 'frame-style-ornament');
        frame.classList.add(`frame-style-${styleId}`);

        const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
        corners.forEach(cClass => {
            if (!frame.querySelector(`.${cClass}`)) {
                const corner = document.createElement('div');
                corner.className = `frame-corner ${cClass}`;
                frame.appendChild(corner);
            }
        });

        if (styleId === 'runes') {
            this.lastFrameWidth = 0;
            this.lastFrameHeight = 0;
            this.updateFrameRunes(frame.offsetWidth, frame.offsetHeight);
        } else {
            frame.querySelectorAll('.hex-rune').forEach(el => el.remove());
        }
    },

    /**
     * Отрисовка скандинавских рун по периметру рамки
     */
    updateFrameRunes(width, height) {
        const currentFrameStyle = localStorage.getItem('kingmakerFrameStyle') || 'norunes';
        const frame = document.querySelector('.kingmaker-frame');
        if (!frame) return;

        if (currentFrameStyle !== 'runes') {
            frame.querySelectorAll('.hex-rune').forEach(el => el.remove());
            return;
        }

        frame.querySelectorAll('.hex-rune').forEach(el => el.remove());

        const step = MAP_CONFIG.viewport.step;
        const padding = MAP_CONFIG.viewport.padding;

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
            runeElement.style.animationDelay = `${Math.random() * -5}s`;
            runeElement.textContent = this.RUNE_POOL[Math.floor(Math.random() * this.RUNE_POOL.length)];
            frame.appendChild(runeElement);
        };

        const innerWidth = width - 44;
        const innerHeight = height - 44;

        for (let l = padding; l < innerWidth - padding; l += step) { createRune(l, cTop); }
        for (let l = padding; l < innerWidth - padding; l += step) { createRune(l, cBottom); }
        for (let t = padding; t < innerHeight - padding; t += step) { createRune(cLeft, t); }
        for (let t = padding; t < innerHeight - padding; t += step) { createRune(cRight, t); }
    }
};

export default ViewportManager;
