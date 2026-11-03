/**
 * Вспомогательные функции общего назначения для работы с цветом
 */
export const ColorConverter = {
    /**
     * Конвертирует HEX в RGBA строку с заданной прозрачностью
     */
    hexToRgba(hex, alpha) {
        if (!hex || hex === 'transparent') return 'rgba(0,0,0,0)';
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },

    /**
     * Конвертирует HEX в стандартный CSS-формат rgb(r, g, b)
     */
    hexToRgbStandard(hex) {
        if (!hex || hex === 'transparent') return '';
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
        return `rgb(${r}, ${g}, ${b})`;
    }
};
