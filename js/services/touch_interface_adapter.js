/**
 * Модуль-адаптер для оптимизации интерфейса ввода под мобильные тач-устройства
 */
const TouchInterfaceAdapter = {
    /**
     * Проверяет, поддерживает ли текущее устройство сенсорный ввод
     * @returns {boolean}
     */
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    /**
     * Перегружает стандартные поля ввода формы под всплывающие окна prompt()
     * для удобного ввода на смартфонах и планшетах
     * @param {HTMLElement} element - Целевое поле ввода (input или textarea)
     * @param {string} promptMessage - Текст-подсказка для пользователя в окне prompt
     */
    adaptiveInputField(element, promptMessage) {
        if (!element || !this.isTouchDevice()) return;

        // Делаем поле ввода readonly, чтобы при таче не вызывалась системная клавиатура поверх модалки
        element.setAttribute('readonly', 'true');

        // Перегружаем событие клика на вызов prompt
        element.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();

            const newValue = prompt(promptMessage, element.value);
            if (newValue !== null) {
                element.value = newValue;

                // Триггерим событие изменения, чтобы форма знала об апдейте
                element.dispatchEvent(new Event('input', { bubbles: true }));
            }
        };
    }
};

export default TouchInterfaceAdapter;
