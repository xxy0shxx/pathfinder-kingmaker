/**
 * Модуль для управления данными карты и работы с LocalStorage (Data Layer)
 */
const StorageManager = {
    STORAGE_KEY: 'hexMapSystemData',

    /**
     * Загрузка данных карты из localStorage
     * @returns {Object} Объект с данными всех гексов
     */
    loadData() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || {};
        } catch (e) {
            console.error("Ошибка чтения данных карты из localStorage:", e);
            return {};
        }
    },

    /**
     * Полное сохранение (перезапись) всего объекта данных карты
     * @param {Object} data - Полный объект данных карты
     */
    saveData(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error("Ошибка записи данных карты в localStorage:", e);
        }
    },

    /**
     * Обновление метаданных конкретного гекса
     * @param {Object} currentMapData - Текущий объект данных в памяти
     * @param {string} hexId - Идентификатор целевого гекса
     * @param {Object} formData - Чистые данные, собранные из формы
     * @returns {Object} Обновленный гекс
     */
    updateHex(currentMapData, hexId, formData) {
        currentMapData[hexId] = {
            ...formData,
            // Если отряд в гексе ИЛИ мы там уже были — ставим true
            hasVisited: formData.squadHere || (currentMapData[hexId] && currentMapData[hexId].hasVisited),
            lastSaved: new Date().toLocaleString()
        };

        this.saveData(currentMapData);
        return currentMapData[hexId];
    },

    /**
     * Поиск гекса, в котором сейчас находится отряд, и перемещение его в новый гекс
     * @param {Object} currentMapData - Текущий объект данных в памяти
     * @param {string} newHexId - Идентификатор нового гекса отряда
     * @returns {string|null} Идентификатор СТАРОГО гекса отряда (нужен для анимации полета флага)
     */
    moveSquad(currentMapData, newHexId) {
        let oldHexId = null;

        // Сбрасываем squadHere у всех гексов, где он был активен
        for (let id in currentMapData) {
            if (currentMapData[id].squadHere === true) {
                if (id !== newHexId) {
                    oldHexId = id; // запоминаем откуда летим
                    currentMapData[id].squadHere = false;
                }
            }
        }

        return oldHexId;
    },

    /**
     * Полное удаление кастомных данных гекса
     * @param {Object} currentMapData - Текущий объект данных в памяти
     * @param {string} hexId - Идентификатор удаляемого гекса
     */
    deleteHex(currentMapData, hexId) {
        delete currentMapData[hexId];
        this.saveData(currentMapData);
    }
};

export default StorageManager;
