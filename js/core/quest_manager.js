import { MAP_CONFIG } from '../config/app_config.js';
import HudWindowManager from '../ui/hud_window_manager.js';

/**
 * Модуль для управления Журналом заданий и слухами Королевства
 */
const QuestManager = {
    currentFilter: 'active',
    mapDataRef: null,
    focusCallback: null,

    init(mapData, onHexFocus) {
        this.mapDataRef = mapData;
        this.focusCallback = onHexFocus;
        window.QuestManager = this;

        HudWindowManager.registerTab('active', {
            tabBtnId: 'tabActiveQuests',
            containerId: 'questLogList',
            triggerBtnId: 'btnToggleQuests',
            onOpen: () => this.render('active')
        });

        HudWindowManager.registerTab('completed', {
            tabBtnId: 'tabCompletedQuests',
            containerId: 'questLogList',
            onOpen: () => this.render('completed')
        });

        HudWindowManager.registerTab('rumors', {
            tabBtnId: 'tabRumors',
            containerId: 'questLogList',
            onOpen: () => this.render('rumors')
        });
        EventBus.on('data:imported', (newMapData) => this.updateMapData(newMapData.hexes));

    },

    updateMapData(newMapData) {
        this.mapDataRef = newMapData;
    },

    render(filterOverride = null) {
        if (filterOverride) {
            this.currentFilter = filterOverride;
        }

        const listContainer = document.getElementById('questLogList');
        if (!listContainer || !this.mapDataRef) return;

        listContainer.innerHTML = '';
        let count = 0;
        const filterStatus = this.currentFilter;

        for (let hexId in this.mapDataRef) {
            const hex = this.mapDataRef[hexId];
            if (!hex) continue;

            if (filterStatus === 'rumors') {
                if (hex.rumorText && hex.rumorText.trim() !== '') {
                    count++;
                    const rumorItem = document.createElement('div');
                    rumorItem.className = 'quest-log-item status-rumor';
                    rumorItem.innerHTML = `
                        <div class="quest-item-title">👂 Наводка / Слух</div>
                        <div class="quest-item-location">📍 Место действия: ${hex.title || hexId.replace('hex_', 'Гекс ')}</div>
                        <div class="quest-item-desc">${hex.rumorText.replace(/\n/g, '<br>')}</div>
                    `;
                    rumorItem.addEventListener('click', () => {
                        if (this.focusCallback) this.focusCallback(hexId);
                        HudWindowManager.close();
                    });
                    listContainer.appendChild(rumorItem);
                }
            } else if (hex.questData && hex.questData.status === filterStatus) {
                count++;
                const questItem = document.createElement('div');
                questItem.className = 'quest-log-item status-rumor';

                const objIcon = MAP_CONFIG.types[hex.type]?.icon || '⚜️';
                const statusLabel = filterStatus === 'completed' ? '✅ Задание завершено' : '⚔️ Активное задание';

                questItem.innerHTML = `
                    <div class="quest-item-title">${objIcon} ${statusLabel}</div>
                    <div class="quest-item-location">📍 Название/Регион: ${hex.title || hexId.replace('hex_', 'Гекс ')}</div>
                    <div class="quest-item-desc" style="font-size: 20px; font-weight: bold; color: #ffd875; margin-top: 6px; text-transform: uppercase;">${hex.questData.title}</div>
                    ${hex.questData.desc ? `<div class="quest-item-desc" style="margin-top: 8px; color: #ccc; font-size: 16px;">${hex.questData.desc.replace(/\n/g, '<br>')}</div>` : ''}
                `;

                questItem.addEventListener('click', () => {
                    if (this.focusCallback) this.focusCallback(hexId);
                    HudWindowManager.close();
                });

                listContainer.appendChild(questItem);
            }
        }

        if (count === 0) {
            const emptyMessage = MAP_CONFIG.messages.questEmpty[filterStatus] || 'Пусто';
            listContainer.innerHTML = `<div class="quest-log-empty">${emptyMessage}</div>`;
        }
    }
};

export default QuestManager;
