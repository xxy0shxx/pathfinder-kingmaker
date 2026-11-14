import AvatarRegistry from '../services/avatars/avatar_registry.js';
import EventBus from '../services/event_bus.js';

const BestiaryManager = {
    state: {
        party: [],     // Текущий отряд (Герои / Союзники)
        monsters: []   // Подготовленные монстры / NPC / Враги
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
        } else {
            this.mapDataRef.bestiary = this.state;
        }

        EventBus.on('data:imported', (newData) => {
            this.mapDataRef = newData || {};
            if (this.mapDataRef.bestiary) {
                this.state = this.mapDataRef.bestiary;
                if (!Array.isArray(this.state.party)) this.state.party = [];
                if (!Array.isArray(this.state.monsters)) this.state.monsters = [];
            }
            this.renderUi();
        });

        window.BestiaryManager = this;
        this.renderUi();
    },

    _save() {
        if (this.mapDataRef) this.mapDataRef.bestiary = this.state;
        EventBus.emit('data:save');
        this.renderUi();
        if (window.InitiativeManager) {
            window.InitiativeManager.renderUi();
        }
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
            avatar
        };

        if (faction === 'friend') {
            this.state.party.push(entry);
        } else {
            this.state.monsters.push(entry);
        }
        this._save();
    },

    removePreset(groupKey, id) {
        if (groupKey === 'party') {
            this.state.party = this.state.party.filter(x => x.id !== id);
        } else {
            this.state.monsters = this.state.monsters.filter(x => x.id !== id);
        }
        this._save();
    },

    updatePresetScore(groupKey, id, val) {
        const num = Math.max(1, Math.min(100, parseInt(val, 10) || 10));
        const list = groupKey === 'party' ? this.state.party : this.state.monsters;
        const item = list.find(x => x.id === id);
        if (item) {
            item.defaultScore = num;
            this._save();
        }
    },

    updatePresetName(groupKey, id, newName) {
        const cleanName = String(newName || '').trim();
        if (!cleanName) return;

        const list = groupKey === 'party' ? this.state.party : this.state.monsters;
        const item = list.find(x => x.id === id);
        if (!item || item.name === cleanName) return;

        const oldName = item.name;
        item.name = cleanName;

        // Если аватар не был задан жёстко, пробуем обновить по новому имени
        if (!item.avatarType) {
            const guessed = AvatarRegistry.guessAvatarByName(cleanName);
            if (guessed) {
                item.avatarType = guessed;
                item.avatar = AvatarRegistry.getAvatarDataUrl(guessed);
            }
        }

        // Синхронизируем имя с бойцом в трекере инициативы (если он уже в бою)
        if (window.InitiativeManager?.state?.combatants) {
            let initChanged = false;
            window.InitiativeManager.state.combatants.forEach(u => {
                if (u.name === oldName && u.faction === item.faction) {
                    u.name = cleanName;
                    initChanged = true;
                }
            });
            if (initChanged) {
                window.InitiativeManager.renderUi();
            }
        }

        this._save();
    },


    deployToInitiative(item, customScore = null) {
        if (!window.InitiativeManager) return;
        const score = customScore !== null ? customScore : (item.defaultScore || 10);
        window.InitiativeManager._pendingAvatarType = item.avatarType || null;
        window.InitiativeManager.addCombatant(item.name, score, item.faction, false, false);
    },

    deployWholeParty() {
        if (!window.InitiativeManager || this.state.party.length === 0) return;
        this.state.party.forEach(hero => {
            window.InitiativeManager._pendingAvatarType = hero.avatarType || null;
            window.InitiativeManager.addCombatant(hero.name, hero.defaultScore || 10, 'friend', false, false);
        });
    },

    renderUi() {
        const container = document.getElementById('bestiaryTabletContainer');
        if (!container) return;

        if (!container.querySelector('.bestiary-tablet-root')) {
            container.innerHTML = `
                <div class="bestiary-tablet-root">
                    <div class="init-quick-input-bar" style="margin-bottom: 16px;">
                        <div class="init-name-autocomplete-wrap" style="position: relative; flex-grow: 1; display: flex;">
                            <input type="text" id="bstInputName" autocomplete="off" placeholder="Поиск героя, NPC или монстра для заготовки...">
                            <div id="bstNameSuggestions" class="init-name-suggestions" style="display: none;"></div>
                        </div>
                        <div class="camp-count-controls" style="padding: 2px 8px;">
                            <span class="camp-param-label" style="font-size: 16px; margin-right: 4px;">Баз. иниц:</span>
                            <input type="number" id="bstInputScore" value="10" min="1" max="100" style="width: 55px; text-align: center; background: #000; border: 1px solid #543e0d; color: #fff; font-weight: bold;">
                        </div>
                        <select id="bstInputFaction" style="width: 175px; background: #090f0b; border: 1px solid #543e0d; color: #ebd291; padding: 6px;">
                            <option value="friend">🟢 Текущий отряд</option>
                            <option value="enemy" selected>🔴 Монстр / Враг</option>
                            <option value="neutral">🟡 Нейтрал / NPC</option>
                        </select>
                        <button type="button" class="btn ok" id="bstBtnAdd" style="padding: 6px 20px; font-size: 14px; height: 38px;">⚜ В заготовки</button>
                    </div>

                    <div id="bstZoneParty" class="init-out-combatants-zone bestiary-zone-party"></div>
                    <div id="bstZoneMonsters" class="init-out-combatants-zone bestiary-zone-monsters" style="margin-top: 20px;"></div>
                </div>
            `;
            this._isBound = false;
        }

        if (!this._isBound) {
            const nameInp = document.getElementById('bstInputName');
            const scoreInp = document.getElementById('bstInputScore');
            const factionSel = document.getElementById('bstInputFaction');
            const suggestBox = document.getElementById('bstNameSuggestions');
            let activeIdx = -1;

            const hideSuggest = () => {
                suggestBox.style.display = 'none';
                suggestBox.innerHTML = '';
                activeIdx = -1;
            };

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
                    </div>
                `).join('');
                suggestBox.style.display = 'block';

                suggestBox.querySelectorAll('.init-suggest-item').forEach((el, i) => {
                    el.addEventListener('mousedown', (e) => {
                        e.preventDefault();
                        applySuggest(matches[i]);
                    });
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
                else if (e.key === 'Enter' && activeIdx >= 0) {
                    e.preventDefault();
                    items[activeIdx].dispatchEvent(new MouseEvent('mousedown'));
                    return;
                } else if (e.key === 'Escape') { hideSuggest(); return; }

                items.forEach((el, i) => el.classList.toggle('active', i === activeIdx));
            });

            nameInp.addEventListener('blur', () => setTimeout(hideSuggest, 150));

            document.getElementById('bstBtnAdd').addEventListener('click', () => {
                this.addPreset(nameInp.value, factionSel.value, scoreInp.value);
                nameInp.value = '';
                scoreInp.value = '10';
                hideSuggest();
                nameInp.focus();
            });

            this._isBound = true;
        }

        this._renderZone('bstZoneParty', '🛡️ Текущий отряд (Герои)', 'party', this.state.party, true);
        this._renderZone('bstZoneMonsters', '👹 Заготовленные монстры и NPC', 'monsters', this.state.monsters, false);
    },





    _renderZone(elId, title, groupKey, items, isParty) {
        const zone = document.getElementById(elId);
        if (!zone) return;

        zone.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <div class="init-out-zone-title" style="margin:0; font-size:16px; color:${isParty ? '#2ecc71' : '#ff7675'};">
                    ${title} (${items.length})
                </div>
                ${isParty && items.length > 0 ? `<button type="button" class="btn ok" id="bstBtnDeployAllParty" style="padding:4px 12px; font-size:13px;">⚔️ Весь отряд в бой</button>` : ''}
            </div>
            <div class="init-cards-scroll-list mode-bg3 init-out-zone-grid">
                ${items.length === 0 ? `<div style="color:#7f8c8d; font-size:15px; padding:12px;">Список пуст. Добавьте персонажей через строку поиска выше.</div>` : ''}
            </div>
        `;

        const deployAllBtn = zone.querySelector('#bstBtnDeployAllParty');
        if (deployAllBtn) {
            deployAllBtn.addEventListener('click', () => this.deployWholeParty());
        }

        const grid = zone.querySelector('.init-out-zone-grid');
        items.forEach((item, idx) => {




            const card = document.createElement('div');
            card.className = `init-combatant-card faction-${item.faction}`;
            card.innerHTML = `
                <div class="init-card-left">
                    <div class="init-card-name-text" title="${item.name}">${item.name}</div>
                    <div class="init-avatar-shield-circle active">${item.avatar ? `<img src="${item.avatar}">` : (idx + 1)}</div>
                </div>
                <div class="init-card-right">
                    <button type="button" class="bst-quick-send-btn" title="Добавить сразу в трекер инициативы">⚔️</button>
                    <div class="init-score-massive-block">
                        <input type="number" class="init-inline-score-input" value="${item.defaultScore}" title="Базовая инициатива">
                    </div>
                </div>
                <button type="button" class="init-btn-delete-card" title="Удалить из заготовок">×</button>
            `;

            card.querySelector('.bst-quick-send-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.deployToInitiative(item);
            });

            card.querySelector('.init-inline-score-input').addEventListener('change', (e) => {
                this.updatePresetScore(groupKey, item.id, e.target.value);
            });

            card.querySelector('.init-btn-delete-card').addEventListener('click', (e) => {
                e.stopPropagation();
                this.removePreset(groupKey, item.id);
            });

            const nameEl = card.querySelector('.init-card-name-text');
            if (nameEl) {
                nameEl.title = 'Нажмите, чтобы переименовать';
                nameEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (nameEl.querySelector('input')) return;

                    const currentName = item.name;
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.className = 'init-inline-name-input';
                    input.value = currentName;

                    let isFinished = false;
                    const finishEdit = (save) => {
                        if (isFinished) return;
                        isFinished = true;
                        const val = input.value.trim();
                        if (save && val && val !== currentName) {
                            this.updatePresetName(groupKey, item.id, val);
                        } else {
                            nameEl.textContent = currentName;
                        }
                    };

                    input.addEventListener('click', (ev) => ev.stopPropagation());
                    input.addEventListener('keydown', (ev) => {
                        ev.stopPropagation();
                        if (ev.key === 'Enter') {
                            ev.preventDefault();
                            finishEdit(true);
                        } else if (ev.key === 'Escape') {
                            ev.preventDefault();
                            finishEdit(false);
                        }
                    });
                    input.addEventListener('blur', () => finishEdit(true));

                    nameEl.textContent = '';
                    nameEl.appendChild(input);
                    input.focus();
                    input.select();
                });
            }

            grid.appendChild(card);
        });


    }



};

export default BestiaryManager;
