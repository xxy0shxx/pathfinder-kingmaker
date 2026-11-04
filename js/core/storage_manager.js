// StorageManager.js
const StorageManager = {
    STORAGE_KEY: 'hexMapSystemData',

    /**
     * Загрузка данных карты из localStorage с автоматической миграцией структуры
     */
    /**
     * Загрузка данных карты из localStorage с автоматической миграцией структуры
     */
    /**
     * Загрузка данных карты из localStorage с гарантированной совместимостью
     */
    loadData() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);

            // Если база абсолютно пуста
            if (!raw) {
                return { hexes: {}, kingdom: null, paths: [] };
            }

            const parsed = JSON.parse(raw);

            // Проверяем формат: если это старая плоская структура (гексы в корне)
            if (parsed && !parsed.hexes) {
                console.log("Обнаружен старый формат базы гексов. Запуск миграции...");

                const migrated = {
                    hexes: {},
                    kingdom: parsed.kingdomState || null,
                    paths: parsed.__pathHistory || []
                };

                // Переносим только гексы и системные слои во вложенную ветку
                for (let key in parsed) {
                    if (key.startsWith('hex_') || key === 'visualLayer' || key === 'squadPath') {
                        migrated.hexes[key] = parsed[key];
                    }
                }

                // Перезаписываем LocalStorage новым красивым форматом
                this.saveData(migrated);
                return migrated;
            }

            // На всякий случай страхуем массивы, если они отсутствуют
            if (parsed && !parsed.paths) parsed.paths = [];
            if (parsed && !parsed.hexes) parsed.hexes = {};

            return parsed;
        } catch (e) {
            console.error("Ошибка чтения данных карты из localStorage:", e);
            return { hexes: {}, kingdom: null, paths: [] };
        }
    },


    saveData(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error("Ошибка записи данных карты в localStorage:", e);
        }
    },

    updateHex(globalMapData, hexId, formData) {
        // Гарантируем наличие ветки hexes
        if (!globalMapData.hexes) globalMapData.hexes = {};

        globalMapData.hexes[hexId] = {
            ...formData,
            hasVisited: formData.squadHere || (globalMapData.hexes[hexId] && globalMapData.hexes[hexId].hasVisited),
            lastSaved: new Date().toLocaleString()
        };

        this.saveData(globalMapData);
        return globalMapData.hexes[hexId];
    },

    moveSquad(globalMapData, newHexId) {
        let oldHexId = null;
        if (!globalMapData.hexes) return null;

        // Находим старую позицию отряда
        for (let id in globalMapData.hexes) {
            if (globalMapData.hexes[id].squadHere === true) {
                if (id !== newHexId) {
                    oldHexId = id;
                    globalMapData.hexes[id].squadHere = false;
                }
            }
        }

        // Гарантируем, что новый гекс, куда переместился отряд, сразу помечается как посещенный
        if (globalMapData.hexes[newHexId]) {
            globalMapData.hexes[newHexId].squadHere = true;
            globalMapData.hexes[newHexId].hasVisited = true;
        }

        return oldHexId;
    },

    deleteHex(globalMapData, hexId) {
        if (globalMapData.hexes && globalMapData.hexes[hexId]) {
            delete globalMapData.hexes[hexId];
            this.saveData(globalMapData);
        }
    }
};

export default StorageManager;
