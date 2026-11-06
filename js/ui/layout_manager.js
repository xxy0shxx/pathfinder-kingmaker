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
        this.initCampingToggle();
        this.attachResizeEvent();
        this.revealMapFrame();
    },

    initCampingToggle() {
        // Запускаем через setTimeout, чтобы дождаться сборки DOM-дерева кнопками
        setTimeout(() => {
            const btnToggleCamping = document.getElementById('btnToggleCamping');
            const campingWindow = document.getElementById('campingLogContainer');
            const questWindow = document.getElementById('questLogContainer');

            if (!btnToggleCamping || !campingWindow) return;

            btnToggleCamping.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();

                const isCampCollapsed = campingWindow.classList.contains('ui-collapsed');

                if (isCampCollapsed) {
                    // Закрываем окно квестов, если оно мешает
                    if (questWindow) {
                        questWindow.classList.add('ui-collapsed');
                        const btnToggleQuests = document.getElementById('btnToggleQuests');
                        if (btnToggleQuests) btnToggleQuests.removeAttribute('style');
                    }

                    // Открываем привал
                    campingWindow.classList.remove('ui-collapsed');
                    if (window.CampingManager) window.CampingManager.recalculateCamp();

                    // Зеленая подсветка геральдики Kingmaker
                    btnToggleCamping.style.setProperty('background', 'linear-gradient(180deg, #1e3c27 0%, #112417 100%)', 'important');
                    btnToggleCamping.style.setProperty('border-color', '#dfbc6f', 'important');
                    btnToggleCamping.style.setProperty('color', '#dfbc6f', 'important');
                } else {
                    campingWindow.classList.add('ui-collapsed');
                    btnToggleCamping.removeAttribute('style');
                }
            });
        }, 300);
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
