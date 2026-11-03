// kingdom_manager.js
const KingdomManager = {
    state: null,
    mapDataRef: null,
    onSaveCallback: null,

    defaultState: {
        name: "Мое Королевство",
        level: 1,
        unrest: 0,
        rp: 10,
        ruins: 0,
        stats: {
            culture: { value: 10, modifier: 0 },
            economy: { value: 10, modifier: 0 },
            loyalty: { value: 10, modifier: 0 },
            stability: { value: 10, modifier: 0 }
        },
        leaders: { ruler: "", counselor: "", general: "", highPriest: "", magister: "", warden: "" }
    },

    roleNames: { ruler: "Правитель", counselor: "Канцлер", general: "Генерал", highPriest: "Иерарх", magister: "Магистр", warden: "Маршал" },

    init(mapData, onSave) {
        try {
            this.mapDataRef = mapData || { hexes: {}, kingdom: null };
            this.onSaveCallback = onSave;

            if (!this.mapDataRef.kingdom) {
                this.mapDataRef.kingdom = JSON.parse(JSON.stringify(this.defaultState));
            }

            this.state = this.mapDataRef.kingdom;
            this.recalculateModifiers();
            window.KingdomManager = this;
        } catch (e) {
            console.error("Ошибка при инициализации KingdomManager:", e);
        }
    },

    updateMapData(newMapData) {
        try {
            this.mapDataRef = newMapData || { hexes: {}, kingdom: null };
            if (!this.mapDataRef.kingdom) {
                this.mapDataRef.kingdom = JSON.parse(JSON.stringify(this.defaultState));
            }
            this.state = this.mapDataRef.kingdom;
            this.recalculateModifiers();
            this.renderUi();
        } catch (e) {
            console.error("Ошибка при обновлении данных KingdomManager:", e);
        }
    },

    recalculateModifiers() {
        for (let key in this.state.stats) {
            const val = this.state.stats[key].value;
            this.state.stats[key].modifier = Math.floor((val - 10) / 2);
        }
    },

    changeStat(statName, amount) {
        if (this.state.stats[statName]) {
            this.state.stats[statName].value = Math.max(0, this.state.stats[statName].value + amount);
            this.recalculateModifiers();
            this.renderUi();
        }
    },

    addRP(amount) {
        this.state.rp = Math.max(0, this.state.rp + amount);
        this.renderUi();
    },

    setUnrest(value) {
        this.state.unrest = Math.max(0, value);
        this.renderUi();
    },

    changeRuins(amount) {
        this.state.ruins = Math.max(0, this.state.ruins + amount);
        this.renderUi();
    },

    saveFromUi() {
        try {
            const leadersListEl = document.getElementById('kingdomLeadersList');
            if (leadersListEl) {
                for (let role in this.state.leaders) {
                    const input = leadersListEl.querySelector(`[data-role="${role}"]`);
                    if (input) this.state.leaders[role] = input.value.trim();
                }
            }

            if (this.mapDataRef) {
                this.mapDataRef.kingdom = this.state;
            }

            if (this.onSaveCallback) {
                this.onSaveCallback();
            } else {
                localStorage.setItem('hexMapSystemData', JSON.stringify(this.mapDataRef));
            }

            this.renderUi();

            const saveBtn = document.querySelector('.k-btn-save-small');
            if (saveBtn) {
                saveBtn.style.setProperty('filter', 'brightness(1.5)', 'important');
                saveBtn.textContent = '⚜ Сохранено!';
                setTimeout(() => {
                    saveBtn.style.removeProperty('filter');
                    saveBtn.textContent = '⚜ Сохранить';
                }, 800);
            }
        } catch (error) {
            console.error("Критическая ошибка внутри метода saveFromUi:", error);
        }
    },

    renderUi() {
        try {
            if (document.getElementById('kingdomRpVal')) {
                document.getElementById('kingdomRpVal').textContent = this.state.rp;
                document.getElementById('kingdomUnrestVal').textContent = this.state.unrest;
                document.getElementById('kingdomRuinsVal').textContent = this.state.ruins;
            }

            for (let key in this.state.stats) {
                const el = document.getElementById(`k_stat_${key}`);
                if (el) {
                    const stat = this.state.stats[key];
                    const modStr = stat.modifier >= 0 ? `+${stat.modifier}` : stat.modifier;
                    el.textContent = `${stat.value} (${modStr})`;
                }
            }

            const leadersListEl = document.getElementById('kingdomLeadersList');
            if (leadersListEl) {
                if (leadersListEl.children.length === Object.keys(this.state.leaders).length) {
                    for (let role in this.state.leaders) {
                        const input = leadersListEl.querySelector(`[data-role="${role}"]`);
                        if (input && input !== document.activeElement) input.value = this.state.leaders[role];
                    }
                } else {
                    leadersListEl.innerHTML = '';
                    for (let role in this.state.leaders) {
                        const row = document.createElement('div');
                        row.className = 'k-leader-row';

                        const label = document.createElement('span');
                        label.className = 'k-leader-role';
                        label.textContent = this.roleNames[role];

                        const input = document.createElement('input');
                        input.type = 'text';
                        input.dataset.role = role;
                        input.value = this.state.leaders[role];
                        input.placeholder = "Имя персонажа...";

                        row.appendChild(label);
                        row.appendChild(input);
                        leadersListEl.appendChild(row);
                    }
                }
            }
        } catch (e) {
            console.error("Ошибка при отрисовке UI королевства:", e);
        }
    }
};

export default KingdomManager;
