import HexCanvasRender from './hex_canvas_render.js';
import EventBus from '../services/event_bus.js';

const StorageManager = {
    STORAGE_KEY: 'hexMapSystemData',
    mapDataRef: null,
    _isInitialized: false,

    /**
     * Подписка на глобальные события сохранения и импорта
     */
    init(mapData) {
        this.mapDataRef = mapData;
        if (this._isInitialized) return;
        this._isInitialized = true;

        EventBus.on('data:save', (customData = null) => {
            const target = customData || this.mapDataRef;
            if (target) this.saveData(target);
        });

        EventBus.on('data:imported', (newMapData) => {
            this.mapDataRef = newMapData;
            this.saveData(newMapData);
        });
    },

    loadData() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (!raw) {
                return { hexes: {}, kingdom: null, paths: [] };
            }

            const parsed = JSON.parse(raw);

            if (parsed && !parsed.hexes) {
                console.log("Обнаружен старый формат базы гексов. Запуск миграции...");

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
            if (data) this.mapDataRef = data;
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.mapDataRef));
        } catch (e) {
            console.error("Ошибка записи данных карты в localStorage:", e);
        }
    },

    updateHex(globalMapData, hexId, formData) {
        if (!globalMapData.hexes) globalMapData.hexes = {};

        globalMapData.hexes[hexId] = {
            ...formData,
            hasVisited: !!(formData.squadHere || (globalMapData.hexes[hexId] && globalMapData.hexes[hexId].hasVisited)),
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

            if (HexCanvasRender && HexCanvasRender.colorCache && HexCanvasRender.colorCache[hexId]) {
                delete HexCanvasRender.colorCache[hexId];
            }
        }
    }
};

export default StorageManager;
