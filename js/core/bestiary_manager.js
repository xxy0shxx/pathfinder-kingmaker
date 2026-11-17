import AvatarRegistry from '../services/avatars/avatar_registry.js';
import EventBus from '../services/event_bus.js';
import ModalManager from '../ui/modal_manager.js';
import StorageManager from './storage_manager.js';
import {
    STAT_CATEGORIES,
    createDefaultStats,
    ensureCharacterStats
} from './bestiary/bestiary_config.js';
import {
    hidePresetTooltip,
    attachPresetTooltip,
    buildUnitTooltipHtml
} from './bestiary/bestiary_tooltip_builder.js';
import { openCharacterSheetModal } from './bestiary/character_sheet_modal.js';
import { PF2E_ITEMS_CATALOG, searchItemsCatalog } from '../config/items_catalog.js';
import { bindSheetTooltip } from './bestiary/bestiary_tooltip_builder.js';
import CloudSyncService from '../services/cloud_sync_service.js';



export { STAT_CATEGORIES, createDefaultStats };

const BestiaryManager = {
    state: {
        party: [],
        monsters: [],
        inactive: []
    },
    mapDataRef: null,
    _pendingAvatarType: null,
    _isBound: false,

    init(mapData) {
        this.mapDataRef = mapData || { hexes: {}, kingdom: null, bestiary: null };
        if (this.mapDataRef.bestiary) {
            this.state = this.mapDataRef.bestiary;
            if (!Array.isArray(this.state.party)) this.state.party = [];
            if (!Array.isArray(this.state.monsters)) this.state.monsters = [];
            if (!Array.isArray(this.state.inactive)) this.state.inactive = [];
        } else {
            this.mapDataRef.bestiary = this.state;
        }

        EventBus.on('data:imported', (newData) => {
            this.mapDataRef = newData || {};
            if (this.mapDataRef.bestiary) {
                this.state = this.mapDataRef.bestiary;
                if (!Array.isArray(this.state.party)) this.state.party = [];
                if (!Array.isArray(this.state.monsters)) this.state.monsters = [];
                if (!Array.isArray(this.state.inactive)) this.state.inactive = [];
            }
            if (!this.state.treasury || typeof this.state.treasury !== 'object') {
                this.state.treasury = { gold: 0, silver: 0, copper: 0, notes: '', log: [] };
            }
            this.renderUi();
        });

        window.BestiaryManager = this;
        this.renderUi();
    },

    toggleHeroReadOnly(groupKey, id) {
        const hero = this._getGroupList(groupKey).find(x => x.id === id);
        if (!hero) return;
        hero.isReadOnly = !hero.isReadOnly;
        this._save();
    },

    moveHeroReserve(fromGroup, toGroup, id) {
        const sourceList = this.state[fromGroup];
        const targetList = this.state[toGroup];
        if (!Array.isArray(sourceList) || !Array.isArray(targetList)) return;

        const idx = sourceList.findIndex(x => x.id === id);
        if (idx === -1) return;

        const [hero] = sourceList.splice(idx, 1);
        targetList.push(hero);
        this._save();
    },

    _save() {
        if (this.mapDataRef) this.mapDataRef.bestiary = this.state;
        EventBus.emit('data:save');
        this.renderUi();
        if (window.InitiativeManager) {
            window.InitiativeManager.renderUi();
        }
    },

    _ensureCharacterStats(item) {
        return ensureCharacterStats(item);
    },

    addPreset(name, faction = 'enemy', defaultScore = 10) {
        const cleanName = String(name || '').trim();
        if (!cleanName) {
            alert('Введите имя персонажа или монстра!');
            return;
        }

        const avatarType = this._pendingAvatarType || AvatarRegistry.guessAvatarByName(cleanName);
        const avatar = avatarType ? AvatarRegistry.getAvatarDataUrl(avatarType) : null;
        this._pendingAvatarType = null;

        const entry = {
            id: 'bst_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            name: cleanName,
            faction: faction || 'enemy',
            defaultScore: Math.max(1, Math.min(100, parseInt(defaultScore, 10) || 10)),
            avatarType,
            avatar,
            stats: createDefaultStats()
        };

        ensureCharacterStats(entry);
        if (faction === 'friend') {
            this.state.party.push(entry);
        } else {
            this.state.monsters.push(entry);
        }
        this._save();
    },

    confirmRemoveHero(groupKey, id) {
        const hero = this._getGroupList(groupKey).find(x => x.id === id);
        if (!hero) return;

        const locationLabel = groupKey === 'inactive' ? 'резерва' : 'текущего отряда';
        ModalManager.open({
            id: 'bstConfirmDeleteHeroModal',
            title: '⚠️ Удаление персонажа',
            width: '460px',
            borderColor: '#e74c3c',
            bodyHtml: `
                <div style="font-size: 16px; line-height: 1.5; color: #ebd291;">
                    Вы действительно хотите навсегда удалить героя <b style="color: #ffd875;">${hero.name}</b> из ${locationLabel}?
                    <div style="margin-top: 8px; font-size: 14px; color: #ff7675;">
                        Все заполненные характеристики, навыки, снаряжение и заметки в бланке будут потеряны.
                    </div>
                </div>`,
            footerButtons: [
                { label: '✖ Отмена', variant: 'cc' },
                { label: '🗑️ Удалить навсегда', variant: 'del', onClick: ({ close }) => { this.removePreset(groupKey, id); close(); } }
            ]
        });
    },

    removePreset(groupKey, id) {
        if (groupKey === 'party') {
            this.state.party = this.state.party.filter(x => x.id !== id);
        } else if (groupKey === 'inactive') {
            this.state.inactive = (this.state.inactive || []).filter(x => x.id !== id);
        } else {
            this.state.monsters = this.state.monsters.filter(x => x.id !== id);
        }
        this._save();
    },

    updatePresetScore(groupKey, id, val) {
        const num = Math.max(1, Math.min(100, parseInt(val, 10) || 10));
        const item = this._getGroupList(groupKey).find(x => x.id === id);
        if (item) {
            item.defaultScore = num;
            this._save();
        }
    },

    _getGroupList(groupKey) {
        if (groupKey === 'party') return this.state.party;
        if (groupKey === 'inactive') {
            if (!Array.isArray(this.state.inactive)) this.state.inactive = [];
            return this.state.inactive;
        }
        return this.state.monsters;
    },
    updatePresetName(groupKey, id, newName) {
        const cleanName = String(newName || '').trim();
        if (!cleanName) return;

        const item = this._getGroupList(groupKey).find(x => x.id === id);
        if (!item || item.name === cleanName) return;

        const oldName = item.name;
        item.name = cleanName;

        if (!item.avatarType) {
            const guessed = AvatarRegistry.guessAvatarByName(cleanName);
            if (guessed) {
                item.avatarType = guessed;
                item.avatar = AvatarRegistry.getAvatarDataUrl(guessed);
            }
        }

        if (window.InitiativeManager?.state?.combatants) {
            let initChanged = false;
            window.InitiativeManager.state.combatants.forEach(u => {
                if (u.name === oldName && u.faction === item.faction) {
                    u.name = cleanName;
                    initChanged = true;
                }
            });
            if (initChanged) window.InitiativeManager.renderUi();
        }

        this._save();
    },

    openCharacterSheetModal(heroId, pageNum = 1) {
        const hero = this.state.party.find(x => x.id === heroId)
            || (this.state.inactive || []).find(x => x.id === heroId)
            || (this.state.monsters || []).find(x => x.id === heroId);
        if (!hero) return;

        openCharacterSheetModal(hero, () => this._save(), pageNum);
    },

    deployToInitiative(item, customScore = null) {
        if (!window.InitiativeManager) return;
        const score = customScore !== null ? customScore : (item.defaultScore || 10);
        window.InitiativeManager._pendingHeroId = item.id || null;
        window.InitiativeManager._pendingAvatarType = item.avatarType || null;
        window.InitiativeManager._pendingStats = item.stats ? JSON.parse(JSON.stringify(item.stats)) : createDefaultStats();
        window.InitiativeManager.addCombatant(item.name, score, item.faction, false, false);
    },

    deployWholeParty() {
        if (!window.InitiativeManager || this.state.party.length === 0) return;
        this.state.party.forEach(hero => this.deployToInitiative(hero));
    },

    _ensureTreasury() {
        if (!this.state.treasury || typeof this.state.treasury !== 'object') {
            this.state.treasury = { gold: 0, silver: 0, copper: 0, notes: '', log: [] };
        }
        if (!Array.isArray(this.state.treasury.log)) this.state.treasury.log = [];

        if (!this.state.treasury.log._auditWrapped) {
            const origUnshift = this.state.treasury.log.unshift.bind(this.state.treasury.log);
            this.state.treasury.log.unshift = (...items) => {
                items.forEach(txt => StorageManager.appendTreasuryLog(txt, 'treasury'));
                return origUnshift(...items);
            };
            this.state.treasury.log._auditWrapped = true;
        }

        return this.state.treasury;
    },


    _getTreasuryRecipients() {
        const companionNames = new Set();
        (this.state.party || []).forEach(u => {
            const cName = String(u?.stats?.compName || '').trim().toLowerCase();
            if (cName) companionNames.add(cName);
        });

        return (this.state.party || []).filter(u => {
            if (!u || u.faction !== 'friend' || u.inactive) return false;
            const normName = String(u.name || '').trim().toLowerCase();
            if (!normName || companionNames.has(normName)) return false;
            if (/фамильяр|верный зверь|спутник/i.test(normName)) return false;
            return true;
        });
    },

    addTreasuryLoot(gold, silver, copper, comment = '') {
        const tr = this._ensureTreasury();
        const g = Math.max(0, parseInt(gold, 10) || 0);
        const s = Math.max(0, parseInt(silver, 10) || 0);
        const c = Math.max(0, parseInt(copper, 10) || 0);
        if (g === 0 && s === 0 && c === 0) return;

        tr.gold = (Number(tr.gold) || 0) + g;
        tr.silver = (Number(tr.silver) || 0) + s;
        tr.copper = (Number(tr.copper) || 0) + c;

        const parts = [];
        if (g > 0) parts.push(`${g} ЗМ`);
        if (s > 0) parts.push(`${s} СМ`);
        if (c > 0) parts.push(`${c} ММ`);
        const noteStr = String(comment || '').trim();
        tr.log.unshift(`+${parts.join(', ')}${noteStr ? ` (${noteStr})` : ''}`);
        if (tr.log.length > 8) tr.log.length = 8;

        this._save();
    },

    convertTreasuryCoins() {
        const tr = this._ensureTreasury();
        const totalCp = (Number(tr.gold) || 0) * 100 + (Number(tr.silver) || 0) * 10 + (Number(tr.copper) || 0);
        tr.gold = Math.floor(totalCp / 100);
        tr.silver = Math.floor((totalCp % 100) / 10);
        tr.copper = totalCp % 10;
        this._save();
    },

    openSplitTreasuryModal() {
        const tr = this._ensureTreasury();
        const recipients = this._getTreasuryRecipients();
        const totalCp = (Number(tr.gold) || 0) * 100 + (Number(tr.silver) || 0) * 10 + (Number(tr.copper) || 0);

        if (totalCp <= 0) {
            alert('В общей казне отряда пока нет монет для деления!');
            return;
        }
        if (recipients.length === 0) {
            alert('В текущем отряде нет активных героев!');
            return;
        }

        const shareCp = Math.floor(totalCp / recipients.length);
        const remCp = totalCp % recipients.length;

        const shareG = Math.floor(shareCp / 100);
        const shareS = Math.floor((shareCp % 100) / 10);
        const shareC = shareCp % 10;

        const remG = Math.floor(remCp / 100);
        const remS = Math.floor((remCp % 100) / 10);
        const remC = remCp % 10;

        const fmtCoins = (g, s, c) => {
            const p = [];
            if (g > 0) p.push(`<b>${g}</b> 🥇ЗМ`);
            if (s > 0) p.push(`<b>${s}</b> 🥈СМ`);
            if (c > 0) p.push(`<b>${c}</b> 🥉ММ`);
            return p.length > 0 ? p.join(', ') : '<b>0</b> монет';
        };

        const modal = ModalManager.open({
            id: 'bstSplitTreasuryModal',
            title: '⚖️ Деление общей казны отряда',
            width: '460px',
            borderColor: '#ffd875',
            bodyHtml: `
                <div style="font-size: 14px; color: #ebd291; line-height: 1.55;">
                    <div>💰 <b>Всего в казне:</b> ${fmtCoins(Number(tr.gold) || 0, Number(tr.silver) || 0, Number(tr.copper) || 0)}</div>
                    <div>🛡️ <b>Участников деления (${recipients.length} чел.):</b> ${recipients.map(r => `<span style="color:#2ecc71;">${r.name}</span>`).join(', ')}</div>
                    <div style="margin-top: 10px; padding: 10px; background: rgba(4, 9, 5, 0.8); border: 1px solid #8a6421; border-radius: 6px;">
                        <div style="color: #ffd875; font-size: 15px;">✨ <b>Доля каждого героя:</b> ${fmtCoins(shareG, shareS, shareC)}</div>
                        <div style="color: #a4b0be; font-size: 12px; margin-top: 4px;">Останется в общей казне (неделимый остаток): ${fmtCoins(remG, remS, remC)}</div>
                    </div>
                </div>
            `,
            footerButtons: [
                { label: '✖ Отмена', variant: 'cc', onClick: () => modal.close() },
                {
                    label: '✅ Выдать долю в кошельки',
                    variant: 'ok',
                    onClick: () => {
                        if (shareCp > 0) {
                            const initCombatants = window.InitiativeManager?.state?.combatants || [];
                            recipients.forEach(hero => {
                                if (!hero.stats) hero.stats = createDefaultStats();
                                hero.stats.coinsGold = (Number(hero.stats.coinsGold) || 0) + shareG;
                                hero.stats.coinsSilver = (Number(hero.stats.coinsSilver) || 0) + shareS;
                                hero.stats.coinsCopper = (Number(hero.stats.coinsCopper) || 0) + shareC;

                                // Синхронизируем с копией героя в трекере инициативы, если она отдельная
                                const normH = String(hero.name || '').trim().toLowerCase();
                                initCombatants.forEach(u => {
                                    if (u && u.faction === 'friend' && String(u.name || '').trim().toLowerCase() === normH && u.stats && u.stats !== hero.stats) {
                                        u.stats.coinsGold = hero.stats.coinsGold;
                                        u.stats.coinsSilver = hero.stats.coinsSilver;
                                        u.stats.coinsCopper = hero.stats.coinsCopper;
                                    }
                                });
                            });

                            tr.gold = remG;
                            tr.silver = remS;
                            tr.copper = remC;
                            tr.log.unshift(`⚖️ Разделено по ${shareG} ЗМ ${shareS} СМ ${shareC} ММ на ${recipients.length} чел.`);
                            if (tr.log.length > 8) tr.log.length = 8;

                            this._save();
                        }
                        modal.close();
                    }
                }
            ]
        });

        if (modal?.overlay) modal.overlay.style.zIndex = '10000250';
    },

    openCollectPartyCoinsModal() {
        const tr = this._ensureTreasury();
        const recipients = this._getTreasuryRecipients();

        if (recipients.length === 0) {
            alert('В текущем отряде нет активных героев!');
            return;
        }

        let sumG = 0;
        let sumS = 0;
        let sumC = 0;
        const donorLines = [];

        recipients.forEach(hero => {
            const st = hero.stats || {};
            const g = Math.max(0, Number(st.coinsGold) || 0);
            const s = Math.max(0, Number(st.coinsSilver) || 0);
            const c = Math.max(0, Number(st.coinsCopper) || 0);
            if (g > 0 || s > 0 || c > 0) {
                sumG += g;
                sumS += s;
                sumC += c;
                const p = [];
                if (g > 0) p.push(`${g} ЗМ`);
                if (s > 0) p.push(`${s} СМ`);
                if (c > 0) p.push(`${c} ММ`);
                donorLines.push(`• <b>${hero.name}:</b> ${p.join(', ')}`);
            }
        });

        if (sumG === 0 && sumS === 0 && sumC === 0) {
            alert('У героев отряда в кошельках сейчас нет монет!');
            return;
        }

        const totalParts = [];
        if (sumG > 0) totalParts.push(`<b>${sumG}</b> 🥇ЗМ`);
        if (sumS > 0) totalParts.push(`<b>${sumS}</b> 🥈СМ`);
        if (sumC > 0) totalParts.push(`<b>${sumC}</b> 🥉ММ`);

        const modal = ModalManager.open({
            id: 'bstCollectTreasuryModal',
            title: '📥 Сбор монет со всего отряда в казну',
            width: '460px',
            borderColor: '#dfbc6f',
            bodyHtml: `
                <div style="font-size: 14px; color: #ebd291; line-height: 1.55;">
                    <div>Вы действительно хотите собрать все личные монеты героев в общую казну?</div>
                    <div style="margin-top: 8px; padding: 8px 10px; background: rgba(4, 9, 5, 0.8); border: 1px solid #543e0d; border-radius: 6px; font-size: 13px;">
                        ${donorLines.join('<br>')}
                        <div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed rgba(223,188,111,0.25); color: #ffd875;">
                            💰 <b>Итого поступит в казну:</b> ${totalParts.join(', ')}
                        </div>
                    </div>
                </div>
            `,
            footerButtons: [
                { label: '✖ Отмена', variant: 'cc', onClick: () => modal.close() },
                {
                    label: '📥 Собрать в казну',
                    variant: 'ok',
                    onClick: () => {
                        const initCombatants = window.InitiativeManager?.state?.combatants || [];
                        recipients.forEach(hero => {
                            if (!hero.stats) hero.stats = createDefaultStats();
                            hero.stats.coinsGold = 0;
                            hero.stats.coinsSilver = 0;
                            hero.stats.coinsCopper = 0;

                            const normH = String(hero.name || '').trim().toLowerCase();
                            initCombatants.forEach(u => {
                                if (u && u.faction === 'friend' && String(u.name || '').trim().toLowerCase() === normH && u.stats && u.stats !== hero.stats) {
                                    u.stats.coinsGold = 0;
                                    u.stats.coinsSilver = 0;
                                    u.stats.coinsCopper = 0;
                                }
                            });
                        });

                        tr.gold = (Number(tr.gold) || 0) + sumG;
                        tr.silver = (Number(tr.silver) || 0) + sumS;
                        tr.copper = (Number(tr.copper) || 0) + sumC;

                        const logStr = [
                            sumG > 0 ? `${sumG} ЗМ` : '',
                            sumS > 0 ? `${sumS} СМ` : '',
                            sumC > 0 ? `${sumC} ММ` : ''
                        ].filter(Boolean).join(' ');

                        tr.log.unshift(`📥 Собрано с отряда: +${logStr}`);
                        if (tr.log.length > 8) tr.log.length = 8;

                        this._save();
                        modal.close();
                    }
                }
            ]
        });

        if (modal?.overlay) modal.overlay.style.zIndex = '10000250';
    },

    _ensureTreasuryLootBag() {
        const tr = this._ensureTreasury();
        if (!Array.isArray(tr.lootItems)) tr.lootItems = [];
        return tr.lootItems;
    },

    addItemToTreasuryLoot(itemName, qty = 1, notes = '') {
        const cleanName = String(itemName || '').trim();
        const addQty = Math.max(1, parseInt(qty, 10) || 1);
        if (!cleanName) return;

        const tr = this._ensureTreasury();
        const bag = this._ensureTreasuryLootBag();
        const norm = (s) => String(s || '').replace(/[\u{1F000}-\u{1FAFF}\uFE0F\u200D]/gu, '').trim().toLowerCase().replace(/ё/g, 'е');

        const catMatch = (PF2E_ITEMS_CATALOG || []).find(it => norm(it.name) === norm(cleanName));
        const finalName = catMatch ? catMatch.name : cleanName;
        const finalNotes = String(notes || '').trim() || catMatch?.notes || '';

        const existing = bag.find(x => norm(x.name) === norm(finalName));
        if (existing) {
            existing.qty = (Number(existing.qty) || 0) + addQty;
            if (!existing.notes && finalNotes) existing.notes = finalNotes;
        } else {
            bag.push({
                id: 'tr_item_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                name: finalName,
                qty: addQty,
                notes: finalNotes
            });
        }

        tr.log.unshift(`📦 В сундук: ${finalName} (×${addQty})`);
        if (tr.log.length > 8) tr.log.length = 8;
        this._save();
    },

    openClaimTreasuryItemModal(lootId) {
        const bag = this._ensureTreasuryLootBag();
        const item = bag.find(x => x.id === lootId);
        if (!item) return;

        const recipients = [...(this.state.party || []), ...(this.state.inactive || [])].filter(Boolean);
        if (!recipients.length) {
            alert('В отряде нет персонажей!');
            return;
        }

        const modal = ModalManager.open({
            id: 'bstClaimTreasuryItemModal',
            title: '🎒 Забрать предмет из сундука отряда',
            width: '440px',
            borderColor: '#2ecc71',
            bodyHtml: `
                <div style="font-size: 14px; color: #ebd291; line-height: 1.5;">
                    <div>Трофей: <b style="color:#fff;">${item.name}</b> <span style="color:#a4b0be;">(в сундуке: ${item.qty} шт.)</span></div>
                    ${item.notes ? `<div style="font-size:12px; color:#a4b0be; margin-top:4px;">${item.notes}</div>` : ''}
                    <div style="display: grid; grid-template-columns: 1fr 110px; gap: 8px; margin-top: 10px;">
                        <div>
                            <label style="font-size: 12px; color: #2ecc71; font-weight: bold;">В чей рюкзак положить:</label>
                            <select id="bstClaimHeroSel" class="k-inp" style="width: 100%; margin-top: 3px; padding: 6px; background: #040905; border: 1px solid #543e0d; color: #ebd291;">
                                ${recipients.map(h => `<option value="${h.id}">🛡️ ${h.name}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label style="font-size: 12px; color: #2ecc71; font-weight: bold;">Количество:</label>
                            <input type="number" id="bstClaimQtyInp" class="k-inp" min="1" max="${item.qty}" value="1" style="width: 100%; text-align: center; margin-top: 3px;">
                        </div>
                    </div>
                    <div id="bstClaimErr" style="color: #ff7675; font-size: 12px; margin-top: 6px;"></div>
                </div>
            `,
            footerButtons: [
                { label: '✖ Отмена', variant: 'cc', onClick: () => modal.close() },
                {
                    label: '🎒 Забрать в рюкзак',
                    variant: 'ok',
                    onClick: () => {
                        const heroId = document.getElementById('bstClaimHeroSel')?.value;
                        const takeQty = Math.max(1, Math.min(item.qty, parseInt(document.getElementById('bstClaimQtyInp')?.value, 10) || 1));
                        const targetHero = recipients.find(h => h.id === heroId);
                        const errEl = document.getElementById('bstClaimErr');

                        if (!targetHero) return;
                        if (!targetHero.stats) targetHero.stats = createDefaultStats();

                        const norm = (s) => String(s || '').replace(/[\u{1F000}-\u{1FAFF}\uFE0F\u200D]/gu, '').trim().toLowerCase().replace(/ё/g, 'е');
                        const targetNorm = norm(item.name);
                        let foundSlot = -1;
                        let emptySlot = -1;

                        for (let i = 1; i <= 15; i++) {
                            const sName = String(targetHero.stats[`item${i}Name`] || '').trim();
                            if (!sName && emptySlot === -1) emptySlot = i;
                            else if (sName && norm(sName) === targetNorm) { foundSlot = i; break; }
                        }

                        if (foundSlot === -1 && emptySlot === -1) {
                            if (errEl) errEl.textContent = `⚠️ У героя ${targetHero.name} заполнен весь рюкзак (15/15 слотов)!`;
                            return;
                        }

                        const dest = foundSlot !== -1 ? foundSlot : emptySlot;
                        const prevQty = foundSlot !== -1 ? (Math.max(0, Number(targetHero.stats[`item${dest}Qty`]) || 0)) : 0;
                        targetHero.stats[`item${dest}Name`] = targetHero.stats[`item${dest}Name`] || item.name;
                        targetHero.stats[`item${dest}Qty`] = prevQty + takeQty;
                        if (!targetHero.stats[`item${dest}Notes`]) targetHero.stats[`item${dest}Notes`] = item.notes || '';

                        (window.InitiativeManager?.state?.combatants || []).forEach(u => {
                            if (u && u.faction === 'friend' && norm(u.name) === norm(targetHero.name) && u.stats && u.stats !== targetHero.stats) {
                                u.stats[`item${dest}Name`] = targetHero.stats[`item${dest}Name`];
                                u.stats[`item${dest}Qty`] = targetHero.stats[`item${dest}Qty`];
                                u.stats[`item${dest}Notes`] = targetHero.stats[`item${dest}Notes`];
                            }
                        });

                        item.qty -= takeQty;
                        const tr = this._ensureTreasury();
                        if (item.qty <= 0) tr.lootItems = bag.filter(x => x.id !== lootId);
                        tr.log.unshift(`🎒 ${targetHero.name} забрал: ${item.name} (×${takeQty})`);
                        if (tr.log.length > 8) tr.log.length = 8;

                        this._save();
                        modal.close();
                    }
                }
            ]
        });

        if (modal?.overlay) modal.overlay.style.zIndex = '10000250';
    },

    openSellTreasuryItemModal(lootId) {
        const bag = this._ensureTreasuryLootBag();
        const item = bag.find(x => x.id === lootId);
        if (!item) return;

        const norm = (s) => String(s || '').replace(/[\u{1F000}-\u{1FAFF}\uFE0F\u200D]/gu, '').trim().toLowerCase().replace(/ё/g, 'е');
        const catObj = (PF2E_ITEMS_CATALOG || []).find(it => norm(it.name) === norm(item.name));
        const rawText = `${catObj?.price || ''} ${catObj?.notes || ''} ${item.notes || ''}`;
        const m = rawText.match(/(\d+(?:[.,]\d+)?)\s*(зм|см|мм|gp|sp|cp)(?![а-яёa-z])/i);

        let baseUnitCp = 0;
        if (m) {
            const val = parseFloat(String(m.at(1)).replace(',', '.')) || 0;
            const unit = String(m.at(2)).toLowerCase();
            const mult = (unit === 'зм' || unit === 'gp') ? 100 : ((unit === 'см' || unit === 'sp') ? 10 : 1);
            baseUnitCp = Math.round(val * mult);
        }

        const fmtCp = (cp) => {
            if (cp <= 0) return '0 ММ';
            const g = Math.floor(cp / 100);
            const s = Math.floor((cp % 100) / 10);
            const c = cp % 10;
            return [g > 0 ? `${g} ЗМ` : '', s > 0 ? `${s} СМ` : '', c > 0 ? `${c} ММ` : ''].filter(Boolean).join(', ');
        };

        const modal = ModalManager.open({
            id: 'bstSellTreasuryItemModal',
            title: '💰 Продать трофей прямо в общую казну',
            width: '440px',
            borderColor: '#ffd875',
            bodyHtml: `
                <div style="font-size: 14px; color: #ebd291; line-height: 1.5;">
                    <div>Предмет: <b style="color:#fff;">${item.name}</b> <span style="color:#a4b0be;">(в сундуке: ${item.qty} шт.)</span></div>
                    <div>Базовая цена (1 шт.): <b style="color:#ffd875;">${baseUnitCp > 0 ? fmtCp(baseUnitCp) : 'не указана'}</b></div>
                    <div style="display: grid; grid-template-columns: 110px 1fr; gap: 8px; margin-top: 10px;">
                        <div>
                            <label style="font-size: 12px; color: #a4b0be;">Продать (шт.):</label>
                            <input type="number" id="bstTrSellQty" class="k-inp" min="1" max="${item.qty}" value="${item.qty}" style="width: 100%; text-align: center; margin-top: 3px;">
                        </div>
                        <div>
                            <label style="font-size: 12px; color: #a4b0be;">Условия продажи:</label>
                            <select id="bstTrSellRate" class="k-inp" style="width: 100%; margin-top: 3px; padding: 6px; background: #040905; border: 1px solid #543e0d; color: #ebd291;">
                                <option value="0.5" selected>⚖️ Снаряжение PF2e (50%)</option>
                                <option value="1">💎 Драгоценности / Трофеи (100%)</option>
                            </select>
                        </div>
                    </div>
                    <div id="bstTrSellPreview" style="margin-top: 10px; padding: 8px; background: rgba(30,60,39,0.45); border: 1px solid #2ecc71; border-radius: 5px; color: #2ecc71; font-weight: bold;"></div>
                </div>
            `,
            footerButtons: [
                { label: '✖ Отмена', variant: 'cc', onClick: () => modal.close() },
                {
                    label: '💰 Продать в казну',
                    variant: 'ok',
                    onClick: () => {
                        const cnt = Math.max(1, Math.min(item.qty, parseInt(document.getElementById('bstTrSellQty')?.value, 10) || 1));
                        const rate = parseFloat(document.getElementById('bstTrSellRate')?.value) || 0.5;
                        const gainCp = Math.floor(baseUnitCp * cnt * rate);

                        const tr = this._ensureTreasury();
                        const totalCp = (Number(tr.gold) || 0) * 100 + (Number(tr.silver) || 0) * 10 + (Number(tr.copper) || 0) + gainCp;
                        tr.gold = Math.floor(totalCp / 100);
                        tr.silver = Math.floor((totalCp % 100) / 10);
                        tr.copper = totalCp % 10;

                        item.qty -= cnt;
                        if (item.qty <= 0) tr.lootItems = bag.filter(x => x.id !== lootId);
                        tr.log.unshift(`💰 Продано в казну: ${item.name} ×${cnt} (+${fmtCp(gainCp)})`);
                        if (tr.log.length > 8) tr.log.length = 8;

                        this._save();
                        modal.close();
                    }
                }
            ]
        });

        if (modal?.overlay) modal.overlay.style.zIndex = '10000250';

        const qInp = document.getElementById('bstTrSellQty');
        const rSel = document.getElementById('bstTrSellRate');
        const prev = document.getElementById('bstTrSellPreview');
        const upd = () => {
            const c = Math.max(1, Math.min(item.qty, parseInt(qInp?.value, 10) || 1));
            const r = parseFloat(rSel?.value) || 0.5;
            if (prev) prev.textContent = `Поступит в общую казну: +${fmtCp(Math.floor(baseUnitCp * c * r))}`;
        };
        qInp?.addEventListener('input', upd);
        rSel?.addEventListener('change', upd);
        upd();
    },


    renderUi() {
        hidePresetTooltip();
        const container = document.getElementById('bestiaryTabletContainer');
        if (!container) return;

        if (!container.querySelector('.bestiary-tablet-root')) {
            container.innerHTML = `
                <div class="bestiary-tablet-root">
                    <div class="init-quick-input-bar" style="margin-bottom: 14px;">
                        <div class="init-name-autocomplete-wrap" style="position: relative; flex-grow: 1; display: flex;">
                            <input type="text" id="bstInputName" autocomplete="off" placeholder="Поиск героя, NPC или монстра для заготовки..." style="width: 100%;">
                            <div id="bstNameSuggestions" class="init-name-suggestions" style="display: none;"></div>
                        </div>
                        <div class="camp-count-controls" style="padding: 2px 8px;">
                            <span class="camp-param-label" style="font-size: 16px; margin-right: 4px;">Баз. иниц:</span>
                            <button type="button" onclick="const inp = document.getElementById('bstInputScore'); inp.value = Math.max(1, (parseInt(inp.value, 10) || 10) - 1)">-</button>
                            <input type="text" id="bstInputScore" value="10" style="width: 50px; text-align: center; background: #000; border: 1px solid #543e0d; color: #fff; font-weight: bold;">
                            <button type="button" onclick="const inp = document.getElementById('bstInputScore'); inp.value = Math.min(100, (parseInt(inp.value, 10) || 10) + 1)">+</button>
                        </div>
                        <select id="bstInputFaction" style="width: 175px; background: #090f0b; border: 1px solid #543e0d; color: #ebd291; padding: 6px;">
                            <option value="friend">🟢 Текущий отряд</option>
                            <option value="enemy" selected>🔴 Монстр / Враг</option>
                            <option value="neutral">🟡 Нейтрал / NPC</option>
                        </select>
                        <button type="button" class="btn ok" id="bstBtnAdd" style="padding: 6px 20px; font-size: 14px; height: 38px;">⚜ В заготовки</button>
                    </div>
                    <div class="bst-workspace-layout">
                        <aside class="bst-catalog-sidebar">
                            <div class="bst-catalog-sidebar-header">
                                <span>📖 Справочник существ</span>
                                <span id="bstCatalogTotalCount" class="bst-catalog-badge">0</span>
                            </div>
                            <input type="text" id="bstSidebarFilter" class="bst-sidebar-filter-inp" autocomplete="off" placeholder="Фильтр по каталогу...">
                            <div id="bstFullCatalogList" class="bst-full-catalog-list"></div>
                        </aside>
                        
                        <div class="bst-zones-main">
                            <div id="bstZoneTreasury" class="init-out-combatants-zone" style="margin-bottom: 16px;"></div>
                            <div id="bstZoneParty" class="init-out-combatants-zone bestiary-zone-party"></div>
                            <div id="bstZoneMonsters" class="init-out-combatants-zone bestiary-zone-monsters" style="margin-top: 16px;"></div>
                            <div id="bstZoneInactive" class="init-out-combatants-zone bestiary-zone-inactive" style="margin-top: 16px;"></div>
                        </div>

                        
                    </div>
                </div>`;
            this._isBound = false;
        }

        if (!this._isBound) {
            this._bindSearchControls();
            this._isBound = true;
        }

        const filterVal = document.getElementById('bstSidebarFilter')?.value || '';
        this._renderCatalogSidebar(filterVal);
        this._renderTreasuryZone();
        this._renderZone('bstZoneParty', '🛡️ Текущий отряд (Герои)', 'party', this.state.party, true);
        this._renderZone('bstZoneMonsters', '👹 Заготовленные монстры и NPC', 'monsters', this.state.monsters, false);
        this._renderZone('bstZoneInactive', '💤 Неактивные персонажи (Резерв)', 'inactive', this.state.inactive || [], false);
    },



    _renderTreasuryZone() {
        const box = document.getElementById('bstZoneTreasury');
        if (!box) return;
        const tr = this._ensureTreasury();
        const totalGoldEq = ((Number(tr.gold) || 0) + (Number(tr.silver) || 0) / 10 + (Number(tr.copper) || 0) / 100).toFixed(2);

        const lootBag = this._ensureTreasuryLootBag();

        const lootRowsHtml = lootBag.length === 0
            ? `<div style="font-size: 12px; color: #7f8c8d; padding: 4px 0;">Сундук нераспределённой добычи пуст. Добавьте трофей по названию или из справочника выше.</div>`
            : lootBag.map(it => `
                <div class="bst-tr-loot-row" data-loot-row-id="${it.id}" style="display: flex; justify-content: space-between; align-items: center; gap: 6px; padding: 4px 6px; background: rgba(0,0,0,0.35); border: 1px solid #543e0d; border-radius: 4px; cursor: help;">
                    <div style="font-size: 12px; color: #ebd291; min-width: 0; flex: 1;">
                        <b>${it.name}</b> <span style="color: #ffd875; font-weight: bold;">×${it.qty}</span>
                    </div>
                    <div style="display: flex; gap: 4px; flex-shrink: 0;">
                        <button type="button" class="btn ok bst-tr-claim-btn" data-loot-id="${it.id}" style="padding: 2px 7px; font-size: 11px;" title="Передать в рюкзак выбранного героя">🎒 Забрать</button>
                        <button type="button" class="btn cc bst-tr-sell-btn" data-loot-id="${it.id}" style="padding: 2px 7px; font-size: 11px;" title="Продать трофей в общую казну">💰 Продать</button>
                        <button type="button" class="btn del bst-tr-del-btn" data-loot-id="${it.id}" style="padding: 2px 6px; font-size: 11px;" title="Убрать из сундука">🗑️</button>
                    </div>
                </div>
            `).join('');


        box.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;">
                <div class="init-out-zone-title" style="margin: 0; font-size: 16px; color: #ffd875;">
                    💰 Общая казна отряда <span style="font-size: 13px; color: #a4b0be; font-weight: normal;">(≈ ${totalGoldEq} ЗМ)</span>
                </div>
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                    <button type="button" id="bstBtnConvertCoins" class="btn cc" style="padding: 4px 10px; font-size: 12px;" title="Обменять каждые 10 ММ → 1 СМ и 10 СМ → 1 ЗМ">💱 Укрупнить монеты</button>
                    <button type="button" id="bstBtnCollectFromParty" class="btn cc" style="padding: 4px 10px; font-size: 12px;" title="Собрать все монеты из личных кошельков героев в общую казну">📥 Собрать с отряда</button>
                    <button type="button" id="bstBtnSplitTreasury" class="btn ok" style="padding: 4px 12px; font-size: 13px;">⚖️ Разделить поровну на отряд</button>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 405px 1fr; gap: 14px; align-items: start; background: rgba(4, 9, 5, 0.72); border: 1px solid #543e0d; border-radius: 6px; padding: 10px;">
                <div style="display: flex; flex-direction: column; gap: 8px; border-right: 1px dashed rgba(223,188,111,0.25); padding-right: 12px;">
                    <div style="display: flex; gap: 8px; align-items: center; flex-wrap: nowrap;">
                        <label style="color: #ffd875; font-weight: bold; display: inline-flex; align-items: center; gap: 4px; white-space: nowrap;">🥇 ЗМ:
                            <input type="number" id="bstTrGold" class="k-inp bst-mini-num" min="0" value="${Number(tr.gold) || 0}" style="width: 58px !important; text-align: center;">
                        </label>
                        <label style="color: #dfe6e9; font-weight: bold; display: inline-flex; align-items: center; gap: 4px; white-space: nowrap;">🥈 СМ:
                            <input type="number" id="bstTrSilver" class="k-inp bst-mini-num" min="0" value="${Number(tr.silver) || 0}" style="width: 58px !important; text-align: center;">
                        </label>
                        <label style="color: #e17055; font-weight: bold; display: inline-flex; align-items: center; gap: 4px; white-space: nowrap;">🥉 ММ:
                            <input type="number" id="bstTrCopper" class="k-inp bst-mini-num" min="0" value="${Number(tr.copper) || 0}" style="width: 58px !important; text-align: center;">
                        </label>
                    </div>
                    
                    <div style="display: flex; gap: 4px; align-items: center;">
                        <input type="number" id="bstLootAddAmt" class="k-inp" min="1" placeholder="Кол-во" style="width: 66px !important; padding: 4px 6px; font-size: 12px; text-align: center;">
                        <select id="bstLootAddType" class="k-inp" style="width: 68px !important; padding: 4px; font-size: 12px; background: #090f0b; border: 1px solid #543e0d; color: #ebd291;">
                            <option value="gold">🥇 ЗМ</option>
                            <option value="silver">🥈 СМ</option>
                            <option value="copper">🥉 ММ</option>
                        </select>
                        <input type="text" id="bstLootAddNote" class="k-inp" placeholder="За что добыча..." style="flex: 1; min-width: 0; padding: 4px 6px; font-size: 12px;">
                        <button type="button" id="bstBtnAddLoot" class="btn ok" style="padding: 4px 8px; font-size: 12px; white-space: nowrap;">➕ В казну</button>
                    </div>
        <div style="font-size: 11px; color: #a4b0be; line-height: 1.3; display: flex; justify-content: space-between; align-items: center; gap: 6px;">
            <span>${tr.log.length > 0 ? `📜 Последние: <span style="color:#ebd291;">${tr.log.slice(0, 2).join(' • ')}</span>` : '📜 История операций пуста.'}</span>
            <button type="button" id="bstBtnOpenFullAuditLog" class="btn cc" style="padding: 2px 8px; font-size: 11px; white-space: nowrap;">📜 Весь журнал</button>
        </div>

                </div>

                <div style="display: flex; flex-direction: column; gap: 6px; min-width: 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
                        <span style="font-size: 13px; color: #dfbc6f; font-weight: bold; white-space: nowrap;">📦 Сундук нераспределённой добычи (${lootBag.length} поз.):</span>
                        <input type="text" id="bstTrNotes" class="k-inp" placeholder="💎 Заметки по казне, доли, долги..." value="${String(tr.notes || '').replace(/"/g, '&quot;')}" style="width: 240px !important; font-size: 12px; padding: 3px 8px;">
                    </div>
                    <div style="display: flex; gap: 6px; align-items: center;">
                        <div class="init-name-autocomplete-wrap" style="position: relative; flex: 1; display: flex; min-width: 0;">
                            <input type="text" id="bstTrLootNameInp" class="k-inp" autocomplete="off" placeholder="🔍 Найти вещь из каталога или вписать трофей..." style="width: 100%; font-size: 13px; padding: 5px 10px;">
                            <div id="bstTrLootSuggestions" class="init-name-suggestions" style="display: none; z-index: 10000180; max-height: 240px; overflow-y: auto;"></div>
                        </div>
                        <input type="number" id="bstTrLootQtyInp" class="k-inp" min="1" value="1" style="width: 56px !important; text-align: center; font-size: 13px; padding: 5px;">
                        <button type="button" id="bstBtnAddTreasuryItem" class="btn ok" style="padding: 5px 12px; font-size: 12px; white-space: nowrap;">➕ В сундук</button>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 4px; max-height: 150px; overflow-y: auto;">
                        ${lootRowsHtml}
                    </div>
                </div>
            </div>
        `;




        box.querySelector('#bstTrGold')?.addEventListener('change', (e) => { tr.gold = Math.max(0, parseInt(e.target.value, 10) || 0); this._save(); });
        box.querySelector('#bstTrSilver')?.addEventListener('change', (e) => { tr.silver = Math.max(0, parseInt(e.target.value, 10) || 0); this._save(); });
        box.querySelector('#bstTrCopper')?.addEventListener('change', (e) => { tr.copper = Math.max(0, parseInt(e.target.value, 10) || 0); this._save(); });
        box.querySelector('#bstTrNotes')?.addEventListener('change', (e) => { tr.notes = e.target.value; this._save(); });
        box.querySelector('#bstBtnOpenFullAuditLog')?.addEventListener('click', () => this.openFullTreasuryLogModal());

        box.querySelector('#bstBtnAddLoot')?.addEventListener('click', () => {
            const amt = parseInt(box.querySelector('#bstLootAddAmt')?.value, 10) || 0;
            const kind = box.querySelector('#bstLootAddType')?.value || 'gold';
            const note = box.querySelector('#bstLootAddNote')?.value || '';
            if (amt <= 0) return;
            this.addTreasuryLoot(
                kind === 'gold' ? amt : 0,
                kind === 'silver' ? amt : 0,
                kind === 'copper' ? amt : 0,
                note
            );
        });

        box.querySelector('#bstBtnConvertCoins')?.addEventListener('click', () => this.convertTreasuryCoins());
        box.querySelector('#bstBtnCollectFromParty')?.addEventListener('click', () => this.openCollectPartyCoinsModal());
        box.querySelector('#bstBtnSplitTreasury')?.addEventListener('click', () => this.openSplitTreasuryModal());

        const lootInp = box.querySelector('#bstTrLootNameInp');
        const lootSuggest = box.querySelector('#bstTrLootSuggestions');
        let lootActiveIdx = -1;

        const hideLootSuggest = () => {
            if (!lootSuggest) return;
            lootSuggest.style.display = 'none';
            lootSuggest.innerHTML = '';
            lootActiveIdx = -1;
        };

        const renderLootSuggest = (query) => {
            if (!lootSuggest) return;
            const matches = searchItemsCatalog(query).slice(0, 30);
            if (!matches.length) {
                hideLootSuggest();
                return;
            }
            lootActiveIdx = -1;
            lootSuggest.innerHTML = matches.map((it, idx) => `
                <div class="init-suggest-item" data-loot-idx="${idx}" style="display: flex; flex-direction: column; align-items: flex-start; gap: 2px; padding: 6px 10px;">
                    <div style="display: flex; justify-content: space-between; width: 100%; align-items: center; gap: 8px;">
                        <span class="init-suggest-label" style="font-weight: bold; color: #ffd875;">${it.name}</span>
                        <span style="font-size: 11px; color: #a4b0be; white-space: nowrap;">${it.category || ''}</span>
                    </div>
                    ${it.notes ? `<div style="font-size: 11px; color: #ebd291; opacity: 0.85; white-space: normal; line-height: 1.25;">${it.notes}</div>` : ''}
                </div>
            `).join('');
            lootSuggest.style.display = 'block';

            lootSuggest.querySelectorAll('.init-suggest-item').forEach((el, idx) => {
                el.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    if (lootInp && matches[idx]) {
                        lootInp.value = matches[idx].name;
                    }
                    hideLootSuggest();
                    lootInp?.focus();
                });
            });
        };

        if (lootInp) {
            lootInp.addEventListener('focus', () => renderLootSuggest(lootInp.value));
            lootInp.addEventListener('input', () => renderLootSuggest(lootInp.value));
            lootInp.addEventListener('keydown', (e) => {
                const items = lootSuggest?.querySelectorAll('.init-suggest-item') || [];
                if (!lootSuggest || lootSuggest.style.display === 'none' || !items.length) {
                    if (e.key === 'Enter') box.querySelector('#bstBtnAddTreasuryItem')?.click();
                    return;
                }
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    lootActiveIdx = (lootActiveIdx + 1) % items.length;
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    lootActiveIdx = (lootActiveIdx - 1 + items.length) % items.length;
                } else if (e.key === 'Enter' && lootActiveIdx >= 0) {
                    e.preventDefault();
                    items[lootActiveIdx].dispatchEvent(new MouseEvent('mousedown'));
                    return;
                } else if (e.key === 'Escape') {
                    hideLootSuggest();
                    return;
                }
                items.forEach((el, i) => el.classList.toggle('active', i === lootActiveIdx));
                if (lootActiveIdx >= 0) items[lootActiveIdx].scrollIntoView({ block: 'nearest' });
            });
            lootInp.addEventListener('blur', () => setTimeout(hideLootSuggest, 150));
        }


        box.querySelector('#bstBtnAddTreasuryItem')?.addEventListener('click', () => {
            const nameEl = box.querySelector('#bstTrLootNameInp');
            const qtyEl = box.querySelector('#bstTrLootQtyInp');
            if (!nameEl?.value.trim()) return;
            this.addItemToTreasuryLoot(nameEl.value, qtyEl?.value || 1);
        });

        box.querySelectorAll('.bst-tr-claim-btn').forEach(btn => {
            btn.addEventListener('click', () => this.openClaimTreasuryItemModal(btn.dataset.lootId));
        });

        box.querySelectorAll('.bst-tr-sell-btn').forEach(btn => {
            btn.addEventListener('click', () => this.openSellTreasuryItemModal(btn.dataset.lootId));
        });

        box.querySelectorAll('.bst-tr-del-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                tr.lootItems = this._ensureTreasuryLootBag().filter(x => x.id !== btn.dataset.lootId);
                this._save();
            });
        });

        box.querySelectorAll('.bst-tr-loot-row').forEach(rowEl => {
            const lootItem = lootBag.find(x => x.id === rowEl.dataset.lootRowId);
            if (!lootItem) return;


            const showLootTip = (e) => {
                let tipEl = document.getElementById('bstTreasuryLootTooltip');
                if (!tipEl) {
                    tipEl = document.createElement('div');
                    tipEl.id = 'bstTreasuryLootTooltip';
                    tipEl.className = 'init-combatant-tooltip';
                    Object.assign(tipEl.style, {
                        position: 'fixed',
                        pointerEvents: 'none',
                        zIndex: '10000350',
                        maxWidth: '380px',
                        background: 'rgba(8, 16, 11, 0.97)',
                        border: '1.5px solid #d4af37',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.85)',
                        color: '#ebd291',
                        fontFamily: "'Tinos', serif"
                    });
                    document.body.appendChild(tipEl);
                }

                const norm = (s) => String(s || '').replace(/[\u{1F000}-\u{1FAFF}\uFE0F\u200D]/gu, '').trim().toLowerCase().replace(/ё/g, 'е');
                const catObj = (PF2E_ITEMS_CATALOG || []).find(it => norm(it.name) === norm(lootItem.name));
                const desc = lootItem.notes || catObj?.notes || 'Описание предмета отсутствует.';
                const catTag = catObj?.category
                    ? `<span class="init-tip-turn-tag" style="border-color:#ffd875; color:#ffd875;">${catObj.category}</span>`
                    : '';

                tipEl.innerHTML = [
                    `<div class="init-tip-header"><span class="init-tip-name">${lootItem.name} (×${lootItem.qty})</span>${catTag}</div>`,
                    `<div style="font-size:13px; color:#ebd291; margin-top:4px; line-height:1.4;">${desc}</div>`
                ].join('');

                tipEl.style.display = 'block';
                const x = Math.min(window.innerWidth - tipEl.offsetWidth - 16, e.clientX + 14);
                const y = Math.min(window.innerHeight - tipEl.offsetHeight - 16, e.clientY + 14);
                tipEl.style.left = Math.max(8, x) + 'px';
                tipEl.style.top = Math.max(8, y) + 'px';
            };

            const hideLootTip = () => {
                const tipEl = document.getElementById('bstTreasuryLootTooltip');
                if (tipEl) tipEl.style.display = 'none';
            };

            rowEl.addEventListener('mouseenter', showLootTip);
            rowEl.addEventListener('mousemove', showLootTip);
            rowEl.addEventListener('mouseleave', hideLootTip);
            rowEl.addEventListener('mousedown', hideLootTip);
        });



    },

    _bindSearchControls() {
        const nameInp = document.getElementById('bstInputName');
        const scoreInp = document.getElementById('bstInputScore');
        const factionSel = document.getElementById('bstInputFaction');
        const suggestBox = document.getElementById('bstNameSuggestions');
        const sidebarFilter = document.getElementById('bstSidebarFilter');
        let activeIdx = -1;

        const hideSuggest = () => { suggestBox.style.display = 'none'; suggestBox.innerHTML = ''; activeIdx = -1; };
        const applySuggest = (item) => {
            nameInp.value = item.displayName + ' ';
            this._pendingAvatarType = item.id;
            if (item.defaultFaction) factionSel.value = item.defaultFaction;
            hideSuggest();
            nameInp.focus();
        };

        nameInp.addEventListener('input', () => {
            const val = nameInp.value;
            if (!val.trim()) { this._pendingAvatarType = null; hideSuggest(); return; }
            if (this._pendingAvatarType && val.endsWith(' ')) { hideSuggest(); return; }
            const matches = AvatarRegistry.searchCatalog(val);
            if (!matches.length) { hideSuggest(); return; }

            activeIdx = -1;
            suggestBox.innerHTML = matches.map((m, i) => `
                <div class="init-suggest-item" data-idx="${i}">
                    ${m.avatarUrl ? `<img src="${m.avatarUrl}" class="init-suggest-thumb">` : ''}
                    <span class="init-suggest-label">${m.label}</span>
                </div>`).join('');
            suggestBox.style.display = 'block';

            suggestBox.querySelectorAll('.init-suggest-item').forEach((el, i) => {
                el.addEventListener('mousedown', (e) => { e.preventDefault(); applySuggest(matches[i]); });
            });
        });

        nameInp.addEventListener('keydown', (e) => {
            const items = suggestBox.querySelectorAll('.init-suggest-item');
            if (suggestBox.style.display === 'none' || !items.length) {
                if (e.key === 'Enter') document.getElementById('bstBtnAdd').click();
                return;
            }
            if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = (activeIdx + 1) % items.length; }
            else if (e.key === 'ArrowUp') { e.preventDefault(); activeIdx = (activeIdx - 1 + items.length) % items.length; }
            else if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); items[activeIdx].dispatchEvent(new MouseEvent('mousedown')); return; }
            else if (e.key === 'Escape') { hideSuggest(); return; }
            items.forEach((el, i) => el.classList.toggle('active', i === activeIdx));
        });

        nameInp.addEventListener('blur', () => setTimeout(hideSuggest, 150));
        document.getElementById('bstBtnAdd').addEventListener('click', () => {
            this.addPreset(nameInp.value, factionSel.value, scoreInp.value);
            nameInp.value = ''; scoreInp.value = '10'; hideSuggest(); nameInp.focus();
        });
        if (sidebarFilter) sidebarFilter.addEventListener('input', () => this._renderCatalogSidebar(sidebarFilter.value));
    },

    _renderZone(elId, title, groupKey, items, isParty) {
        const zone = document.getElementById(elId);
        if (!zone) return;

        const isInactive = groupKey === 'inactive';
        const isHeroGroup = isParty || isInactive;
        const headerColor = isParty ? '#2ecc71' : (isInactive ? '#a4b0be' : '#ff7675');
        const emptyHint = isInactive
            ? 'Резерв пуст. Нажмите 💤 на карточке героя в отряде, чтобы убрать его сюда без потери параметров.'
            : 'Список пуст. Добавьте персонажей через строку поиска выше или справочник слева.';

        const gmLinkBtnHtml = isParty
            ? '<button type="button" class="btn cc" id="bstBtnCopyGmLink" style="padding:4px 10px; font-size:13px; margin-right:6px;" title="Скопировать секретную ссылку ГМа для входа с другого компьютера">👑 Ссылка ГМа</button>'
            : '';

        const deployBtnHtml = (isParty && items.length > 0)
            ? '<button type="button" class="btn ok" id="bstBtnDeployAllParty" style="padding:4px 12px; font-size:13px;">⚔️ Весь отряд в бой</button>'
            : '';
        const emptyListHtml = items.length === 0
            ? '<div style="color:#7f8c8d; font-size:15px; padding:12px;">' + emptyHint + '</div>'
            : '';



        zone.innerHTML = [
            '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">',
            '<div class="init-out-zone-title" style="margin:0; font-size:16px; color:' + headerColor + ';">' + title + ' (' + items.length + ')</div>',
            '<div>' + gmLinkBtnHtml + deployBtnHtml + '</div>',
            '</div>',
            '<div class="init-cards-scroll-list mode-bg3 init-out-zone-grid">',
            emptyListHtml,
            '</div>'
        ].join('');

        zone.querySelector('#bstBtnDeployAllParty')?.addEventListener('click', () => this.deployWholeParty());

        zone.querySelector('#bstBtnCopyGmLink')?.addEventListener('click', (e) => {
            const btn = e.currentTarget;
            const link = CloudSyncService.getGmInviteUrl();
            navigator.clipboard.writeText(link).then(() => {
                btn.textContent = '✅ Скопировано!';
                setTimeout(() => { btn.textContent = '👑 Ссылка ГМа'; }, 1500);
            });
        });

        const grid = zone.querySelector('.init-out-zone-grid');
        items.forEach((item, idx) => {
            const card = document.createElement('div');
            card.className = 'init-combatant-card faction-' + item.faction + (isInactive ? ' bst-card-inactive' : '');

            const reserveBtn = isParty
                ? '<button type="button" class="bst-reserve-move-btn to-reserve" title="Отправить в неактивные">💤</button>'
                : (isInactive ? '<button type="button" class="bst-reserve-move-btn to-party" title="Вернуть в отряд">🛡️</button>' : '');

            const avatarContent = item.avatar ? '<img src="' + item.avatar + '">' : (idx + 1);

            const lockBtnHtml = isHeroGroup
                ? `<button type="button" class="bst-lock-hero-btn" title="${item.isReadOnly ? 'Режим Read-Only ВКЛ (игрок не может менять лист). Нажмите, чтобы разрешить' : 'Редактирование разрешено. Нажмите, чтобы сделать Read-Only'}" style="background:${item.isReadOnly ? '#5e1914' : '#1b3324'}; border:1px solid ${item.isReadOnly ? '#ff7675' : '#2ecc71'}; color:#fff; border-radius:4px; padding:1px 5px; font-size:11px; cursor:pointer;">${item.isReadOnly ? '🔒' : '🔓'}</button>
       <button type="button" class="bst-copy-link-btn" title="Скопировать персональную ссылку для игрока" style="background:#14283b; border:1px solid #74b9ff; color:#74b9ff; border-radius:4px; padding:1px 5px; font-size:11px; cursor:pointer;">🔗</button>`
                : '';


            card.innerHTML = [
                reserveBtn,
                '<button type="button" class="init-btn-delete-card" title="Удалить навсегда">×</button>',
                '<div class="init-card-left">',
                '<div class="init-card-name-text" title="' + item.name + '">' + item.name + '</div>',
                '<div class="init-avatar-shield-circle active">' + avatarContent + '</div>',
                '</div>',
                '<div class="init-card-right">',
                lockBtnHtml,
                '<button type="button" class="bst-quick-send-btn" title="Добавить в трекер инициативы">⚔️</button>',
                '<div class="init-score-massive-block">',
                '<input type="number" class="init-inline-score-input" value="' + item.defaultScore + '" title="Базовая инициатива">',
                '</div>',
                '</div>'
            ].join('');

            card.querySelector('.bst-reserve-move-btn')?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.moveHeroReserve(isParty ? 'party' : 'inactive', isParty ? 'inactive' : 'party', item.id);
            });
            card.querySelector('.bst-quick-send-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.deployToInitiative(item);
            });
            card.querySelector('.init-inline-score-input').addEventListener('change', (e) => {
                this.updatePresetScore(groupKey, item.id, e.target.value);
            });
            card.querySelector('.init-btn-delete-card').addEventListener('click', (e) => {
                e.stopPropagation();
                isHeroGroup ? this.confirmRemoveHero(groupKey, item.id) : this.removePreset(groupKey, item.id);
            });

            card.querySelector('.bst-lock-hero-btn')?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleHeroReadOnly(groupKey, item.id);
            });

            card.querySelector('.bst-copy-link-btn')?.addEventListener('click', (e) => {
                e.stopPropagation();
                const btn = e.currentTarget;
                const link = CloudSyncService.getPlayerInviteUrl(item.id);
                navigator.clipboard.writeText(link).then(() => {
                    if (btn) {
                        btn.textContent = '✅';
                        setTimeout(() => { btn.textContent = '🔗'; }, 1200);
                    }
                });
            });

            const nameEl = card.querySelector('.init-card-name-text');
            let clickTimer = null;
            nameEl.addEventListener('click', (e) => {
                e.stopPropagation();
                if (nameEl.querySelector('input')) return;
                clearTimeout(clickTimer);
                clickTimer = setTimeout(() => {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.className = 'init-inline-name-input';
                    input.value = item.name;
                    let done = false;
                    const finish = (save) => {
                        if (done) return;
                        done = true;
                        const val = input.value.trim();
                        if (save && val && val !== item.name) this.updatePresetName(groupKey, item.id, val);
                        else nameEl.textContent = item.name;
                    };
                    input.addEventListener('click', ev => ev.stopPropagation());
                    input.addEventListener('keydown', ev => {
                        ev.stopPropagation();
                        if (ev.key === 'Enter') { ev.preventDefault(); finish(true); }
                        else if (ev.key === 'Escape') { ev.preventDefault(); finish(false); }
                    });
                    input.addEventListener('blur', () => finish(true));
                    nameEl.textContent = '';
                    nameEl.appendChild(input);
                    input.focus();
                    input.select();
                }, 220);
            });

            nameEl.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                clearTimeout(clickTimer);
                this.openCharacterSheetModal(item.id);
            });

            if (isHeroGroup || window.SHOW_ENEMY_TOOLTIPS) {
                attachPresetTooltip(card, item, isInactive);
            }

            grid.appendChild(card);
        });
    },

    _renderCatalogSidebar(filterQuery = '') {
        const listEl = document.getElementById('bstFullCatalogList');
        const countEl = document.getElementById('bstCatalogTotalCount');
        if (!listEl) return;

        const allItems = typeof AvatarRegistry.getAllCatalogItems === 'function'
            ? AvatarRegistry.getAllCatalogItems()
            : [];

        const q = String(filterQuery || '').trim().toLowerCase().replace(/ё/g, 'е');
        const filtered = q
            ? allItems.filter(item =>
                String(item.label || item.displayName || '')
                    .toLowerCase()
                    .replace(/ё/g, 'е')
                    .includes(q)
            )
            : allItems;

        if (countEl) countEl.textContent = filtered.length;

        if (!filtered.length) {
            listEl.innerHTML = '<div class="bst-catalog-empty">Ничего не найдено</div>';
            return;
        }

        listEl.innerHTML = filtered.map(item => {
            const name = item.displayName || item.label || item.id;
            const avatarUrl = item.avatarUrl || (item.id ? AvatarRegistry.getAvatarDataUrl(item.id) : null);
            const faction = item.defaultFaction || 'enemy';
            const dot = faction === 'friend' ? '🟢' : (faction === 'neutral' ? '🟡' : '🔴');
            const thumbHtml = avatarUrl
                ? '<img src="' + avatarUrl + '" class="bst-catalog-thumb">'
                : '<div class="bst-catalog-thumb bst-catalog-thumb-empty">⚔️</div>';

            return [
                '<div class="bst-catalog-row" data-cat-id="' + (item.id || '') + '" data-cat-name="' + name + '" data-cat-faction="' + faction + '">',
                '<div class="bst-catalog-row-main">',
                thumbHtml,
                '<span class="bst-catalog-name">' + dot + ' ' + name + '</span>',
                '</div>',
                '<div class="bst-catalog-actions">',
                '<button type="button" class="bst-cat-btn-party" title="В отряд">🛡️</button>',
                '<button type="button" class="bst-cat-btn-monster" title="В монстры/NPC">👹</button>',
                '</div>',
                '</div>'
            ].join('');
        }).join('');

        listEl.querySelectorAll('.bst-catalog-row').forEach(row => {
            const { catId, catName, catFaction } = row.dataset;

            row.querySelector('.bst-catalog-row-main').addEventListener('click', () => {
                const nameInp = document.getElementById('bstInputName');
                const factionSel = document.getElementById('bstInputFaction');
                this._pendingAvatarType = catId || null;
                if (nameInp) {
                    nameInp.value = catName;
                    nameInp.focus();
                }
                if (factionSel && catFaction) {
                    factionSel.value = catFaction;
                }
            });

            row.querySelector('.bst-cat-btn-party').addEventListener('click', (e) => {
                e.stopPropagation();
                this._pendingAvatarType = catId || null;
                this.addPreset(catName, 'friend', 10);
            });

            row.querySelector('.bst-cat-btn-monster').addEventListener('click', (e) => {
                e.stopPropagation();
                this._pendingAvatarType = catId || null;
                this.addPreset(catName, catFaction === 'friend' ? 'neutral' : catFaction, 10);
            });
        });
    },

    buildUnitTooltipHtml(item, options = {}) {
            return buildUnitTooltipHtml(item, options);
    },

    _pushTreasuryLog(text, category = 'treasury') {
        const tr = this._ensureTreasury();
        tr.log.unshift(text);
        if (tr.log.length > 8) tr.log.length = 8;
        StorageManager.appendTreasuryLog(text, category);
    },

    openFullTreasuryLogModal() {
        const renderModalBody = () => {
            const entries = StorageManager.getTreasuryLog();
            if (!entries.length) {
                return `<div style="padding: 20px; text-align: center; color: #95a5a6; font-size: 14px;">Журнал операций казны и обмена предметами пока пуст.</div>`;
            }
            return `
                <div style="display: flex; flex-direction: column; gap: 6px; max-height: 70vh; overflow-y: auto; padding-right: 4px;">
                    ${entries.map(item => `
                        <div style="padding: 8px 12px; background: rgba(4,9,5,0.85); border: 1px solid #543e0d; border-left: 3px solid ${item.category === 'transfer' ? '#74b9ff' : '#ffd875'}; border-radius: 5px; font-size: 14px; color: #ebd291; line-height: 1.4;">
                            <span style="color: #a4b0be; font-size: 12px; margin-right: 8px;">[${item.time}]</span>
                            <span>${item.text}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        };

        const modal = ModalManager.open({
            id: 'bstFullTreasuryLogModal',
            title: '📜 Полный журнал казны и передачи вещей',
            width: '680px',
            borderColor: '#ffd875',
            bodyHtml: `<div id="bstAuditLogBodyHost">${renderModalBody()}</div>`,
            footerButtons: [
                {
                    label: '🗑️ Очистить журнал',
                    variant: 'del',
                    onClick: () => {
                        if (!StorageManager.getTreasuryLog().length) return;

                        const confirmModal = ModalManager.open({
                            id: 'bstConfirmClearAuditLogModal',
                            title: '⚠️ Очистка журнала операций',
                            width: '420px',
                            borderColor: '#e74c3c',
                            bodyHtml: `
                                <div style="font-size: 14px; color: #ebd291; line-height: 1.5;">
                                    Вы действительно хотите безвозвратно удалить всю историю операций казны и передачи предметов?
                                </div>
                            `,
                            footerButtons: [
                                { label: '✖ Отмена', variant: 'cc', onClick: () => confirmModal.close() },
                                {
                                    label: '🗑️ Да, очистить',
                                    variant: 'del',
                                    onClick: () => {
                                        StorageManager.clearTreasuryLog();
                                        const host = document.getElementById('bstAuditLogBodyHost');
                                        if (host) host.innerHTML = renderModalBody();
                                        confirmModal.close();
                                    }
                                }
                            ]
                        });

                        if (confirmModal?.overlay) confirmModal.overlay.style.zIndex = '10000450';
                    }

                },
                { label: 'Закрыть', variant: 'ok', onClick: () => modal.close() }
            ]
        });

        if (modal?.overlay) modal.overlay.style.zIndex = '10000350';
    },



};
export default BestiaryManager;