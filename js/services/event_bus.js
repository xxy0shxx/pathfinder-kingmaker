/**
 * Легкая шина событий (Pub/Sub) для слабой связанности модулей
 */
const EventBus = {
    listeners: new Map(),

    on(eventName, callback) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, new Set());
        }
        this.listeners.get(eventName).add(callback);
        return () => this.off(eventName, callback);
    },

    off(eventName, callback) {
        const set = this.listeners.get(eventName);
        if (set) set.delete(callback);
    },

    emit(eventName, payload = null) {
        const set = this.listeners.get(eventName);
        if (!set) return;
        set.forEach(cb => {
            try {
                cb(payload);
            } catch (err) {
                console.error(`[EventBus] Ошибка в обработчике события "${eventName}":`, err);
            }
        });
    }
};

window.EventBus = EventBus;
export default EventBus;
