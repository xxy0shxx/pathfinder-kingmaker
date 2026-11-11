import { MAP_CONFIG } from '../config/app_config.js';
import UiSelectManager from '../controller/ui_select_manager.js';
import TouchInterfaceAdapter from '../services/touch_interface_adapter.js';

/**
 * Модуль управления модальным окном редактирования гекса
 */
const HexModal = {
    modal: null,
    currentHexId: null,
    onSaveCallback: null,
    onDeleteCallback: null,

    /**
     * Инициализация менеджера модального окна
     */
    init({ onSave, onDelete }) {
        this.modal = document.getElementById('hexMenu');
        this.onSaveCallback = onSave;
        this.onDeleteCallback = onDelete;

        if (!this.modal) return;

        this.groupMenuFields();
        this.assembleActionButtons();
        this.ensureKingdomControls();
        this.initColorPresets();
        this.attachEvents();
    },
    ensureKingdomControls() {
        const menu = document.getElementById('hexMenu');
        if (!menu || document.getElementById('hexKingdomClaimed')) return;

        const row = document.createElement('div');
        row.className = 'box-row-combined';
        row.style.cssText = 'display:flex; gap:10px; margin-top:8px; width:100%; clear:both;';
        row.innerHTML = `
            <div class="checkbox-row" style="flex:1; margin-bottom:0; justify-content:flex-start; gap:8px;">
                <input type="checkbox" id="hexKingdomClaimed">
                <label for="hexKingdomClaimed" style="margin:0; font-weight:bold; color:#ffd875; font-size:13px;">👑 Территория королевства</label>
            </div>
            <div class="box" style="flex:1; margin-bottom:0;">
                <select id="hexWorkSiteType" title="Добывающий участок королевства в этом гексе">
                    <option value="none">Участок: Нет</option>
                    <option value="farmlands">🌾 Ферма (Еда)</option>
                    <option value="lumberCamps">🪵 Лесопилка (Дерево)</option>
                    <option value="mines">⛏ Шахта (Руда)</option>
                    <option value="quarries">🧱 Каменоломня (Камень)</option>
                </select>
            </div>
        `;

        const btnSave = document.getElementById('btnSave');
        const buttonsBlock = btnSave ? btnSave.closest('.buttons') : menu.querySelector('.buttons');
        if (buttonsBlock && buttonsBlock.parentNode) {
            buttonsBlock.parentNode.insertBefore(row, buttonsBlock);
        } else {
            menu.appendChild(row);
        }
    },


    initColorPresets() {
        const container = document.getElementById('colorPresetsContainer');
        // Если контейнера нет или кнопки уже сгенерированы — выходим
        if (!container || container.children.length > 0) return;

        MAP_CONFIG.colorPresets.forEach(p => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'color-preset-btn';

            if (p.color === 'transparent') {
                b.classList.add('transparent-preset');
                b.textContent = p.label;
            } else {
                b.style.backgroundColor = p.color;
            }

            b.addEventListener('click', () => {
                document.getElementById('inpColor').value = p.color;
                container.querySelectorAll('.color-preset-btn').forEach(x => x.classList.remove('active'));
                b.classList.add('active');
            });

            container.appendChild(b);
        });
    },
    /**
     * DOM-хак: Красивая перегруппировка кнопок модального окна в ровный Flex-контейнер
     */
    assembleActionButtons() {
        const btnDeleteEl = document.getElementById('btnDelete');
        const btnCancelEl = document.getElementById('btnCancel');
        const btnSaveEl = document.getElementById('btnSave');
        const buttonsContainer = document.querySelector('.buttons');

        if (buttonsContainer && btnDeleteEl && btnCancelEl && btnSaveEl) {
            buttonsContainer.innerHTML = '';

            const boxWrapper = document.createElement('div');
            boxWrapper.className = 'box';
            boxWrapper.style.width = '100%';
            boxWrapper.style.display = 'flex';
            boxWrapper.style.gap = '15px';

            boxWrapper.appendChild(btnDeleteEl);
            boxWrapper.appendChild(btnCancelEl);
            boxWrapper.appendChild(btnSaveEl);

            buttonsContainer.appendChild(boxWrapper);
        }
    },

    /**
     * Группировка строк селекторов в комбинированные строки (2 колонки)
     */
    groupMenuFields() {
        const inpType = document.getElementById('inpType');
        const inpTerrain = document.getElementById('inpTerrain');
        const diffSelect = document.getElementById('inpDifficulty');
        const inpRegionLevel = document.getElementById('inpRegionLevel');

        if (!inpType || !inpTerrain || !diffSelect || !inpRegionLevel) return;

        const boxType = inpType.closest('.box');
        const boxTerrain = inpTerrain.closest('.box');
        const boxDiff = diffSelect.closest('.box');
        const boxLevel = inpRegionLevel.closest('.box');

        if (boxType && boxTerrain) {
            const rowObjects = document.createElement('div');
            rowObjects.className = 'box-row-combined';
            boxType.parentNode.insertBefore(rowObjects, boxType);
            rowObjects.appendChild(boxType);
            rowObjects.appendChild(boxTerrain);
        }

        if (boxDiff && boxLevel) {
            const rowStats = document.createElement('div');
            rowStats.className = 'box-row-combined';
            boxDiff.parentNode.insertBefore(rowStats, boxDiff);
            rowStats.appendChild(boxDiff);
            rowStats.appendChild(boxLevel);
        }
    },
    /**
     * Открытие меню и заполнение формы данными гекса
     * @param {string} hexId - Идентификатор гекса (например, 'hex_0_0')
     * @param {Object|null} hexData - Текущие сохраненные данные гекса
     */
    open(hexId, hexData) {
        this.currentHexId = hexId;

        const inpTitle = document.getElementById('inpTitle');
        const inpDesc = document.getElementById('inpDesc');
        const difficultySelect = document.getElementById('inpDifficulty');
        const inpExplored = document.getElementById('inpExplored');
        const inpMapMapped = document.getElementById('inpMapMapped');
        const inpSquadHere = document.getElementById('inpSquadHere');
        const inpType = document.getElementById('inpType');
        const inpTerrain = document.getElementById('inpTerrain');
        const inpRegionLevel = document.getElementById('inpRegionLevel');
        const inpColor = document.getElementById('inpColor');
        const inpRumorDesc = document.getElementById('inpRumorDesc');

        let currentColor = 'transparent';

        if (hexData) {
            if (inpTitle) inpTitle.value = hexData.title || '';
            if (inpDesc) inpDesc.value = hexData.text || '';
            if (difficultySelect) difficultySelect.value = hexData.difficulty || '';
            if (inpExplored) inpExplored.checked = !!hexData.explored;
            if (inpMapMapped) inpMapMapped.checked = !!hexData.mapMapped;
            if (inpType) inpType.value = hexData.type || '';
            if (inpTerrain) inpTerrain.value = hexData.terrain || '';
            if (inpRegionLevel) inpRegionLevel.value = hexData.regionLevel || '';
            if (inpRumorDesc) inpRumorDesc.value = hexData.rumorText || '';
            currentColor = hexData.color || 'transparent';

            UiSelectManager.setCustomSelectValue('customSelectType', hexData.type || '');
            UiSelectManager.setCustomSelectValue('customSelectTerrain', hexData.terrain || '');
            UiSelectManager.setCustomSelectValue('customSelectDifficulty', hexData.difficulty || '');
            UiSelectManager.setCustomSelectValue('customSelectRegionLevel', hexData.regionLevel || '');
        } else {
            if (inpTitle) inpTitle.value = '';
            if (inpDesc) inpDesc.value = '';
            if (difficultySelect) difficultySelect.value = '';
            if (inpExplored) inpExplored.checked = false;
            if (inpMapMapped) inpMapMapped.checked = false;
            if (inpType) inpType.value = '';
            if (inpTerrain) inpTerrain.value = '';
            if (inpRegionLevel) inpRegionLevel.value = '';
            if (inpRumorDesc) inpRumorDesc.value = '';
            currentColor = 'transparent';

            UiSelectManager.setCustomSelectValue('customSelectType', '');
            UiSelectManager.setCustomSelectValue('customSelectTerrain', '');
            UiSelectManager.setCustomSelectValue('customSelectDifficulty', '');
            UiSelectManager.setCustomSelectValue('customSelectRegionLevel', '');
        }

        if (inpSquadHere) inpSquadHere.checked = hexData ? !!hexData.squadHere : false;
        if (inpColor) inpColor.value = currentColor;

        this.syncColorPresets(currentColor);
        this.setupTouchInterface(inpTitle, inpDesc, inpRumorDesc);


        const inpQuestTitle = document.getElementById('inpQuestTitle');
        const inpQuestDesc = document.getElementById('inpQuestDesc');
        const inpQuestStatus = document.getElementById('inpQuestStatus');


        if (hexData && hexData.questData) {
            if (inpQuestTitle) inpQuestTitle.value = hexData.questData.title || '';
            if (inpQuestDesc) inpQuestDesc.value = hexData.questData.desc || '';
            if (inpQuestStatus) inpQuestStatus.checked = hexData.questData.status === 'completed';
        } else {
            if (inpQuestTitle) inpQuestTitle.value = '';
            if (inpQuestDesc) inpQuestDesc.value = '';
            if (inpQuestStatus) inpQuestStatus.checked = false;
        }

        const cbClaimed = document.getElementById('hexKingdomClaimed');
        const selWorkSite = document.getElementById('hexWorkSiteType');
        if (cbClaimed) cbClaimed.checked = !!(hexData && hexData.kingdomClaimed);
        if (selWorkSite) selWorkSite.value = (hexData && hexData.workSite) ? hexData.workSite : 'none';

        if (this.modal) this.modal.classList.add('open');
    },

    /**
     * Делегирование настройки мобильных полей ввода специализированному адаптеру
     */
    setupTouchInterface(inpTitle, inpDesc, inpRumorDesc) {
        TouchInterfaceAdapter.adaptiveInputField(inpTitle, "Введите название гекса:");
        TouchInterfaceAdapter.adaptiveInputField(inpDesc, "Введите описание гекса:");
        TouchInterfaceAdapter.adaptiveInputField(inpRumorDesc, "Введите слухи:");
    },

    /**
     * Закрытие меню с дефокус-очисткой текстовых полей
     */
    close() {
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
            document.activeElement.blur();
        }
        if (this.modal) this.modal.classList.remove('open');
        this.currentHexId = null;
    },

    /**
     * Сбор введенных в форму данных и передача их наружу через callback
     */
    save() {
        if (!this.currentHexId) return;

        const questTitleVal = document.getElementById('inpQuestTitle').value.trim();

        const formData = {
            title: document.getElementById('inpTitle').value,
            text: document.getElementById('inpDesc').value,
            rumorText: document.getElementById('inpRumorDesc').value.trim(),
            color: document.getElementById('inpColor').value || 'transparent',
            difficulty: document.getElementById('inpDifficulty').value,
            explored: document.getElementById('inpExplored').checked,
            mapMapped: document.getElementById('inpMapMapped').checked,
            squadHere: document.getElementById('inpSquadHere').checked,
            type: document.getElementById('inpType').value,
            terrain: document.getElementById('inpTerrain').value,
            regionLevel: document.getElementById('inpRegionLevel').value,
            kingdomClaimed: document.getElementById('hexKingdomClaimed')?.checked || false,
            workSite: document.getElementById('hexWorkSiteType')?.value || 'none',
            questData: questTitleVal ? {
                title: questTitleVal,
                desc: document.getElementById('inpQuestDesc').value.trim(),
                status: document.getElementById('inpQuestStatus').checked ? 'completed' : 'active'
            } : null
        };

        if (this.onSaveCallback) {
            this.onSaveCallback(this.currentHexId, formData);
        }
    },

    /**
     * Удаление данных гекса через callback
     */
    delete() {
        if (!this.currentHexId) return;
        if (this.onDeleteCallback) {
            this.onDeleteCallback(this.currentHexId);
        }
    },

    /**
     * Синхронизация активной круглой кнопки палитры цветов
     */
    syncColorPresets(currentColor) {
        document.querySelectorAll('.color-preset-btn').forEach(btn => {
            btn.classList.remove('active');
            if (currentColor === 'transparent' && btn.classList.contains('transparent-preset')) {
                btn.classList.add('active');
            } else if (btn.style.backgroundColor === this.hexToRgbStandard(currentColor)) {
                btn.classList.add('active');
            }
        });
    },

    /**
     * Хелпер для корректного сравнения стилей цвета кнопки с hex-значением
     */
    hexToRgbStandard(hex) {
        if (!hex || hex === 'transparent') return '';
        hex = hex.replace('#', '');
        if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgb(${r}, ${g}, ${b})`;
    },

    /**
     * Перегрузка полей ввода под prompt() на мобильных тач-устройствах
     */
    /*
    setupTouchInterface(inpTitle, inpDesc, inpRumorDesc) {
        if (!('ontouchstart' in window)) return;

        if (inpTitle) {
            inpTitle.setAttribute('readonly', 'true');
            inpTitle.onclick = () => {
                let newTitle = prompt("Введите название гекса:", inpTitle.value);
                if (newTitle !== null) inpTitle.value = newTitle;
            };
        }
        if (inpDesc) {
            inpDesc.setAttribute('readonly', 'true');
            inpDesc.onclick = () => {
                let newDesc = prompt("Введите описание гекса:", inpDesc.value);
                if (newDesc !== null) inpDesc.value = newDesc;
            };
        }
        if (inpRumorDesc) {
            inpRumorDesc.setAttribute('readonly', 'true');
            inpRumorDesc.onclick = () => {
                let newRumor = prompt("Введите слухи:", inpRumorDesc.value);
                if (newRumor !== null) inpRumorDesc.value = newRumor;
            };
        }
    },

     */

    /**
     * Навешивание стандартных слушателей событий на кнопки внутри модального окна
     */
    attachEvents() {
        const btnSave = document.getElementById('btnSave');
        const btnCancel = document.getElementById('btnCancel');
        const btnDelete = document.getElementById('btnDelete');

        if (btnSave) btnSave.addEventListener('click', () => this.save());
        if (btnCancel) btnCancel.addEventListener('click', () => this.close());
        if (btnDelete) btnDelete.addEventListener('click', () => this.delete());

        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) this.close();
            });
        }
    }
};

export default HexModal;
