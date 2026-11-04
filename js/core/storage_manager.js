import HexCanvasRender from './hex_canvas_render.js';

const StorageManager = {
    STORAGE_KEY: 'hexMapSystemData',

    /**
     * Загрузка данных карты из localStorage с гарантированной совместимостью и миграцией
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

                // Перезаписываем LocalStorage новым форматом
                this.saveData(migrated);
                return migrated;
            }

            // Страхуем массивы и ветки, если они отсутствуют
            if (parsed && !parsed.paths) parsed.paths = [];
            if (parsed && !parsed.hexes) parsed.hexes = {};

            return parsed;
        } catch (e) {
            console.error("Ошибка чтения данных карты из localStorage:", e);
            return { hexes: {}, kingdom: null, paths: [] };
        }
    },

    /**
     * Сериализация и запись пакета данных в локальное хранилище браузера
     */
    saveData(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error("Ошибка записи данных карты в localStorage:", e);
        }
    },

    /**
     * Точечное обновление полей конкретного гекса без создания глубоких копий всей базы
     */
    updateHex(globalMapData, hexId, formData) {
        if (!globalMapData.hexes) globalMapData.hexes = {};

        // [ОПТИМИЗАЦИЯ] Мутируем гекс быстрой деструктуризацией ссылки
        globalMapData.hexes[hexId] = {
            ...formData,
            hasVisited: !!(formData.squadHere || (globalMapData.hexes[hexId] && globalMapData.hexes[hexId].hasVisited)),
            lastSaved: new Date().toLocaleString()
        };

        this.saveData(globalMapData);
        return globalMapData.hexes[hexId];
    },

    /**
     * Перемещение маркера отряда между гексами на уровне ядра данных
     */
    moveSquad(globalMapData, newHexId) {
        let oldHexId = null;
        if (!globalMapData.hexes) return null;

        // Находим прошлую позицию отряда и снимаем флаг присутствия
        for (let id in globalMapData.hexes) {
            if (globalMapData.hexes[id].squadHere === true) {
                if (id !== newHexId) {
                    oldHexId = id;
                    globalMapData.hexes[id].squadHere = false;
                }
            }
        }

        // Помечаем целевую точку как посещенную и занятую отрядом
        if (globalMapData.hexes[newHexId]) {
            globalMapData.hexes[newHexId].squadHere = true;
            globalMapData.hexes[newHexId].hasVisited = true;
        }

        return oldHexId;
    },

    /**
     * Полное удаление гекса из дерева объектов с триггером перерисовки холста
     */
    deleteHex(globalMapData, hexId) {
        if (globalMapData.hexes && globalMapData.hexes[hexId]) {
            delete globalMapData.hexes[hexId];
            this.saveData(globalMapData);

            // [ОПТИМИЗАЦИЯ] Сбрасываем цвет удаленного сектора в кэше рендера
            if (HexCanvasRender && HexCanvasRender.colorCache && HexCanvasRender.colorCache[hexId]) {
                delete HexCanvasRender.colorCache[hexId];
            }
        }
    }
};

export default StorageManager;
