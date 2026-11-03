/**
 * Модуль для управления кастомными выпадающими списками (Select UI)
 */
const UiSelectManager = {
    /**
     * Инициализация кастомных селекторов на странице
     */
    init() {
        this.populateSelectOptions();
        this.initDropdownLogic();
    },

    /**
     * Динамическая генерация числовых опций от 1 до 40 (СЛ и Уровни)
     */
    populateSelectOptions() {
        const diffContainer = document.getElementById('inpDifficultyContainer');
        const levelContainer = document.getElementById('inpRegionLevelContainer');
        if (!diffContainer || !levelContainer) return;

        diffContainer.innerHTML = '';
        levelContainer.innerHTML = '';

        for (let i = 1; i <= 40; i++) {
            const optDiff = document.createElement('div');
            optDiff.className = 'custom-option';
            optDiff.setAttribute('data-value', i);
            optDiff.textContent = 'СЛ ' + i;
            diffContainer.appendChild(optDiff);

            const optLvl = document.createElement('div');
            optLvl.className = 'custom-option';
            optLvl.setAttribute('data-value', i);
            optLvl.textContent = 'Уровень ' + i;
            levelContainer.appendChild(optLvl);
        }
    },

    /**
     * Инициализация логики открытия/закрытия списков и выбора элементов
     */
    initDropdownLogic() {
        document.querySelectorAll('.custom-select').forEach(select => {
            const trigger = select.querySelector('.custom-select-trigger');
            const container = select.querySelector('.custom-options-container');
            const hiddenInput = select.querySelector('input[type="hidden"]');

            trigger.addEventListener('click', (e) => {
                e.stopPropagation();

                // Закрываем все остальные открытые списки
                document.querySelectorAll('.custom-select').forEach(otherSelect => {
                    if (otherSelect !== select) {
                        otherSelect.classList.remove('active');
                    }
                });

                select.classList.toggle('active');
            });

            container.addEventListener('click', (e) => {
                const option = e.target.closest('.custom-option');
                if (!option) return;

                const val = option.getAttribute('data-value');

                select.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');

                trigger.textContent = option.textContent;
                trigger.setAttribute('data-value', val);
                if (hiddenInput) {
                    hiddenInput.value = val;
                }

                select.classList.remove('active');
            });
        });

        // Клик по любому месту экрана закрывает активные списки
        document.addEventListener('click', () => {
            document.querySelectorAll('.custom-select').forEach(select => {
                select.classList.remove('active');
            });
        });
    },

    /**
     * Синхронизация и принудительная установка значения списка извне
     * @param {string} selectId - ID контейнера селекта (.custom-select)
     * @param {string|number} value - Устанавливаемое значение
     */
    setCustomSelectValue(selectId, value) {
        const selectEl = document.getElementById(selectId);
        if (!selectEl) return;
        const trigger = selectEl.querySelector('.custom-select-trigger');
        const hiddenInput = selectEl.querySelector('input[type="hidden"]');
        const options = selectEl.querySelectorAll('.custom-option');

        let targetOption = selectEl.querySelector(`.custom-option[data-value="${value}"]`);
        if (!targetOption && options.length > 0) {
            targetOption = options[0];
        }

        if (targetOption) {
            options.forEach(opt => opt.classList.remove('selected'));
            targetOption.classList.add('selected');
            trigger.textContent = targetOption.textContent;
            trigger.setAttribute('data-value', value);
            if (hiddenInput) {
                hiddenInput.value = value;
            }
        }
    }
};

export default UiSelectManager;
