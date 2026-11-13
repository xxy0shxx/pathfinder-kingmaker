import { MAP_CONFIG } from '../config/app_config.js';
import FrameManager from '../ui/frame_manager.js';
import HexCanvasRender from '../core/hex_canvas_render.js';
import EventBus from './event_bus.js';


/**
 * Модуль управления вьюпортом: скролл, зум, перемещение и адаптация рамки
 */
const ViewportManager = {
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
    lockFocusUntil: 0,

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

        FrameManager.init();

        // Первичное принудительное центрирование на отряде при старте системы
        /*
        setTimeout(() => {
            this.updateMapTransform();
        }, 150);
        */

        EventBus.on('data:imported', () => {
            setTimeout(() => this.updateMapTransform(), 100);
        });
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
     * Привязка тач-событий (Mobile) - ИСПРАВЛЕНО ЧТЕНИЕ ТАЧЕЙ
     */
    attachTouchEvents() {
        this.viewport.addEventListener('touchstart', (e) => {
            if (e.target.closest('#hexMenu') || e.target.closest('.pop-menu') ||
                e.target.closest('button') || e.target.closest('.player-container') ||
                e.target.closest('select') || e.target.closest('input')) return;

            this.isDragging = true;
            this.hasMoved = false;

            // Берём первый палец из списка касаний
            const touch = e.touches[0];
            this.startX = touch.pageX - this.x;
            this.startY = touch.pageY - this.y;
        }, { passive: true });

        this.viewport.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            if (e.cancelable) e.preventDefault();

            // Берём координаты первого пальца при сдвиге
            const touch = e.touches[0];
            this.processMove(touch.pageX, touch.pageY);
        }, { passive: false });

        window.addEventListener('touchend', () => {
            this.isDragging = false;
            setTimeout(() => { this.hasMoved = false; }, 20);
        });

        window.addEventListener('touchcancel', () => {
            this.isDragging = false;
        });
    },
    /**
     * Общая математика смещения координат холста с учетом лимитов и выступа пилы
     */
    processMove(pageX, pageY) {
        let newX = pageX - this.startX;
        let newY = pageY - this.startY;

        if (Math.abs(newX - this.x) > 3 || Math.abs(newY - this.y) > 3) {
            this.hasMoved = true;
        }

        // Считываем текущий стиль рамки из хранилища
        const currentStyleId = localStorage.getItem('kingmakerFrameStyle') || 'norunes';
        const isHeavy = currentStyleId === 'ornament-heavy';

        // МАКСИМАЛЬНЫЙ УПОР: Если включен тяжелый стиль, мы искусственно зажимаем
        // лимиты упора камеры на 24px (вылет вершин ромбов) внутрь экрана.
        // Это заставит всю конструкцию намертво стопориться ровно по кончикам пилы!
        const extraOffset = isHeavy ? 24 : 0;

        const { minX, maxX, minY, maxY } = MAP_CONFIG.viewport.limits;

        // Корректируем лимиты: сдвигаем границы остановки карты к центру на 24px
        this.x = Math.max(minX + extraOffset, Math.min(maxX - extraOffset, newX));
        this.y = Math.max(minY + extraOffset, Math.min(maxY - extraOffset, newY));

        this.updateMapTransform();
    },



    /**
     * Расчет CSS-трансформаций и динамическое inset-кадрирование холста
     */
    updateMapTransform() {
        this.focusOnSquad();

        requestAnimationFrame(() => {
            this.mapContainer.style.transform = `translate(${Math.round(this.x)}px, ${Math.round(this.y)}px) scale(${this.currentZoom})`;

            FrameManager.updateBounds(this.viewport, this.mapContainer, this.currentZoom);

            if (HexCanvasRender && typeof HexCanvasRender.requestFrame === 'function') {
                HexCanvasRender.requestFrame();
            }
        });
    },

    /**
     * Автоматический пересчет координат сдвига для центрирования на отряде
     */
    focusOnSquad(force = false) {
        if (window.DISABLE_CAMERA_AUTOCENTER) return;

        if (!force && (this.isDragging || Date.now() < this.lockFocusUntil)) return;

        const TacticalMapManager = window.TacticalMapManager || null;
        if (TacticalMapManager && TacticalMapManager.state && TacticalMapManager.state.currentMapMode === 'camp') {
            return;
        }

        if (!force && (this.isDragging || Date.now() < this.lockFocusUntil)) return;

        if (!HexCanvasRender || !HexCanvasRender.hexCoords || !HexCanvasRender.hexesData) return;

        let squadHexId = null;
        for (let key in HexCanvasRender.hexesData) {
            if (HexCanvasRender.hexesData[key] && HexCanvasRender.hexesData[key].squadHere) {
                squadHexId = key;
                break;
            }
        }

        if (!squadHexId) return;

        const coords = HexCanvasRender.hexCoords[squadHexId];
        if (!coords) return;

        const viewWidth = this.viewport.clientWidth;
        const viewHeight = this.viewport.clientHeight;
        const zoom = this.currentZoom;

        const virtualXFromRight = 3840 - coords.cx;
        const virtualYFromTop = coords.cy;

        let targetPanX = (virtualXFromRight * zoom) - viewWidth / 2;
        let targetPanY = (viewHeight / 2) - (virtualYFromTop * zoom);

        const { minX, maxX, minY, maxY } = MAP_CONFIG.viewport.limits;

        this.x = Math.max(minX, Math.min(maxX, targetPanX));
        this.y = Math.max(minY, Math.min(maxY, targetPanY));
    }
};

export default ViewportManager;
