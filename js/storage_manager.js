// StorageManager.js
const StorageManager = {
    STORAGE_KEY: 'hexMapSystemData',

    /**
     * Загрузка данных карты из localStorage с автоматической миграцией структуры
     */
    /**
     * Загрузка данных карты из localStorage с автоматической миграцией структуры
     */
    loadData() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (!raw) return { hexes: {}, kingdom: null, paths: [] };

            const parsed = JSON.parse(raw);

            // Если это старый сейв (где гексы лежали прямо в корне), мигрируем его
            if (parsed && !parsed.hexes) {
                const migrated = {
                    hexes: {},
                    kingdom: parsed.kingdomState || null,
                    paths: parsed.__pathHistory || []
                };

                for (let key in parsed) {
                    if (key.startsWith('hex_') || key === 'visualLayer' || key === 'squadPath') {
                        migrated.hexes[key] = parsed[key];
                    }
                }

                this.saveData(migrated);
                return migrated;
            }

            // Если это промежуточная структура, но paths еще нет — создаем массив
            if (parsed && !parsed.paths) {
                parsed.paths = [];
            }

            return parsed || { hexes: {}, kingdom: null, paths: [] };
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

        for (let id in globalMapData.hexes) {
            if (globalMapData.hexes[id].squadHere === true) {
                if (id !== newHexId) {
                    oldHexId = id;
                    globalMapData.hexes[id].squadHere = false;
                }
            }
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
