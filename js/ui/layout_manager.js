/**
 * Модуль для управления структурой интерфейса, ресайзом и аккордеоном легенды
 */
const LayoutManager = {
    init() {
        this.initLegendAccordion();
        this.revealMapFrame();
    },

    initLegendAccordion() {
        const legendContainer = document.querySelector('.legend-container');
        const legendHeader = document.querySelector('.legend-header');
        const legendContent = document.querySelector('.legend-content');

        if (!legendContainer || !legendHeader || !legendContent) return;

        legendContent.style.maxHeight = '0px';
        legendContent.style.overflow = 'hidden';
        legendContent.style.transition = 'max-height 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), padding 0.3s ease';

        legendHeader.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const isOpen = legendContainer.classList.toggle('open');
            const toggleBtn = legendHeader.querySelector('button');

            if (isOpen) {
                legendContent.style.maxHeight = (legendContent.scrollHeight + 35) + 'px';
                if (toggleBtn) toggleBtn.textContent = '🔽';
            } else {
                legendContent.style.maxHeight = '0px';
                if (toggleBtn) toggleBtn.textContent = '🔼';
            }
        });

        const legendBtn = legendHeader.querySelector('button');
        if (legendBtn) {
            legendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                legendHeader.click();
            });
        }
    },

    revealMapFrame() {
        setTimeout(() => {
            const frame = document.querySelector('.kingmaker-frame');
            if (frame) frame.style.opacity = '1';
        }, 150);
    }
};

export default LayoutManager;
