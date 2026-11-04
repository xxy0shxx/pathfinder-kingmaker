import ViewportManager from '../services/viewport_manager.js';

/**
 * Модуль для управления структурой интерфейса, ресайзом и верстальными DOM-хаками
 */
const LayoutManager = {
    /**
     * Инициализация менеджера макета страницы
     */
    init() {
        this.initLegendAccordion();
        this.attachResizeEvent();
        this.revealMapFrame();
    },

    /**
     * Настройка раскрывающегося аккордеона для контента легенды карты
     */
    initLegendAccordion() {
        const legendContainer = document.querySelector('.legend-container');
        const legendHeader = document.querySelector('.legend-header');
        const legendContent = document.querySelector('.legend-content');

        if (!legendContainer || !legendHeader || !legendContent) return;

        // Начальное состояние: закрыто
        legendContent.style.maxHeight = '0px';
        legendContent.style.overflow = 'hidden';
        legendContent.style.transition = 'max-height 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), padding 0.3s ease';

        // Клик по шапке легенды
        legendHeader.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const isOpen = legendContainer.classList.toggle('open');
            const toggleBtn = legendHeader.querySelector('button');

            if (isOpen) {
                // Динамически рассчитываем высоту контента для плавной CSS-анимации
                legendContent.style.maxHeight = (legendContent.scrollHeight + 35) + 'px';
                if (toggleBtn) toggleBtn.textContent = '🔽';
            } else {
                legendContent.style.maxHeight = '0px';
                if (toggleBtn) toggleBtn.textContent = '🔼';
            }
        });

        // Клик конкретно по кнопке-стрелочке дублирует поведение шапки
        const legendBtn = legendHeader.querySelector('button');
        if (legendBtn) {
            legendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                legendHeader.click();
            });
        }
    },

    /**
     * Слушатель изменения размеров окна браузера для адаптации вьюпорта
     */
    attachResizeEvent() {
        window.addEventListener('resize', () => {
            if (ViewportManager && typeof ViewportManager.updateMapTransform === 'function') {
                ViewportManager.updateMapTransform();
            }
        });
    },

    /**
     * Плавное первичное проявление декоративной рамки карты при загрузке
     */
    revealMapFrame() {
        setTimeout(() => {
            const frame = document.querySelector('.kingmaker-frame');
            if (frame) frame.style.opacity = '1';
        }, 150);
    }
};

export default LayoutManager;
