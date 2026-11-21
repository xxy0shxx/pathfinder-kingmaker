import { MAP_CONFIG } from '../config/app_config.js';
import EventBus from './event_bus.js';
import {
    deriveGmSecret,
    derivePlayerHash,
    promptGmPasswordModal,
    promptPlayerPasswordModal
} from './cloud_auth_modal.js';
import ModalManager from '../ui/modal_manager.js';

import HeroSyncService from './hero_sync_service.js';


const { createClient } = window.supabase;

const SUPABASE_URL = MAP_CONFIG.supabase.url;
const SUPABASE_ANON_KEY = MAP_CONFIG.supabase.anonKey;

const params = new URLSearchParams(window.location.search);
const PLAYER_HERO_ID = params.get('playerHeroId');
const IS_PLAYER_MODE = Boolean(PLAYER_HERO_ID);

const CloudSyncService = {
    roomCode: null,
    gmSecret: null,
    supabaseClient: null,
    playerHeroId: PLAYER_HERO_ID,
    isPlayerMode: IS_PLAYER_MODE,
    _isRemoteApplying: false,
    _saveTimer: null,
    _pollTimer: null,
    _knownHeroIds: new Set(),
    _channel: null,

    getRoomCode() {
        let code = localStorage.getItem('pf_online_room_code');
        if (!code) {
            code = 'room_' + Math.random().toString(36).substring(2, 8);
            localStorage.setItem('pf_online_room_code', code);
        }
        return code;
    },

    _createClientWithHeaders() {
        this.supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            global: {
                headers: {
                    ...(this.gmSecret ? { 'x-gm-secret': this.gmSecret } : {}),
                    ...(this.roomCode ? { 'x-room-code': this.roomCode } : {}),
                    ...(this.isPlayerMode && this.playerHeroId ? { 'x-hero-id': this.playerHeroId } : {})
                }
            }
        });
    },

    getPlayerInviteUrl(heroId) {
        const url = new URL(window.location.href);
        url.search = '';
        url.searchParams.set('room', this.roomCode || this.getRoomCode());
        url.searchParams.set('playerHeroId', heroId);
        return url.toString();
    },

    getGmInviteUrl() {
        const url = new URL(window.location.href);
        url.search = '';
        url.searchParams.set('room', this.roomCode || this.getRoomCode());
        return url.toString();
    },

    logoutGm() {
        if (!this.roomCode) return;

        const modal = ModalManager.open({
            id: 'bstGmLogoutConfirmModal',
            title: '🔌 Выход из облачной сессии',
            width: '420px',
            borderColor: '#ffd875',
            bodyHtml: `
                <div style="font-size: 14px; color: #ebd291; line-height: 1.5;">
                    Выйти из облачной комнаты <b style="color:#ffd875;">${this.roomCode}</b> в локальный режим?
                    <div style="margin-top: 6px; font-size: 12px; color: #a4b0be;">
                        Синхронизация с игроками и Telegram-ботом будет приостановлена до повторного входа по паролю.
                    </div>
                </div>
            `,
            footerButtons: [
                {
                    label: '✖ Отмена',
                    variant: 'cc',
                    onClick: () => modal.close()
                },
                {
                    label: '🚪 Выйти в локальный режим',
                    variant: 'del',
                    onClick: () => {
                        localStorage.removeItem(`pf_online_gm_secret_${this.roomCode}`);
                        window.location.reload();
                    }
                }
            ]
        });
    },

    async openManualGmLogin() {
        const isExisting = Boolean(new URLSearchParams(window.location.search).get('room'));
        const success = await this._authenticateGmFlow(isExisting);
        if (!success) return; // Если нажали «Отмена», остаёмся в локальном режиме

        // Обновляем статус кнопки в правом нижнем углу
        const btn = document.getElementById('btnCloudLogin');
        if (btn) {
            btn.innerHTML = '🟢';
            btn.title = `Облако подключено (${this.roomCode}). Нажмите, чтобы выйти в локальный режим`;
        }

        // Загружаем данные из облака и запускаем синхронизацию
        const pulledAnything = await this.pullFromCloud();
        if (!pulledAnything && window.BestiaryManager) {
            await this.pushToCloud();
        }

        const schedulePush = () => {
            if (this._isRemoteApplying) return;
            clearTimeout(this._saveTimer);
            this._saveTimer = setTimeout(() => this.pushToCloud(), 450);
        };

        EventBus.on('data:save', schedulePush);
        EventBus.on('data:imported', schedulePush);

        if (!this._channel) {
            this._channel = this.supabaseClient
                .channel(`heroes_${this.roomCode}`)
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'campaign_heroes',
                    filter: `room_code=eq.${this.roomCode}`
                }, (payload) => this.handleRemotePayload(payload))
                .on('broadcast', { event: 'sync_refresh' }, () => {
                    if (!this._isRemoteApplying) {
                        this.pullFromCloud();
                    }
                })
                .subscribe();
        }
        this._startHeroPolling();
    },

    async init() {
        const urlRoom = params.get('room');
        if (urlRoom && !this.isPlayerMode) {
            localStorage.setItem('pf_online_room_code', urlRoom);
        }
        this.roomCode = urlRoom || this.getRoomCode();

        window.CloudSyncService = this;

        if (!this.isPlayerMode) {
            const url = new URL(window.location.href);
            url.searchParams.set('room', this.roomCode);
            url.searchParams.delete('gmSecret');
            window.history.replaceState({}, '', url);

            const storageKey = `pf_online_gm_secret_${this.roomCode}`;
            this.gmSecret = localStorage.getItem(storageKey);
            this._createClientWithHeaders();

            // Если пароль не введён — остаёмся в локальном режиме (localStorage) и не трогаем облако
            if (!this.gmSecret) {
                return;
            }
        } else {
            this._createClientWithHeaders();
        }

        const pulledAnything = await this.pullFromCloud();

        if (!this.isPlayerMode && window.BestiaryManager) {
            const mapRef = window.BestiaryManager.mapDataRef || {};
            const hasLocalData =
                (window.BestiaryManager.state.party?.length > 0) ||
                (window.BestiaryManager.state.inactive?.length > 0) ||
                (Object.keys(mapRef.hexes || {}).length > 0);

            if (!pulledAnything || hasLocalData) {
                await this.pushToCloud();
            }
        }

        const schedulePush = () => {
            if (this._isRemoteApplying) return;
            clearTimeout(this._saveTimer);
            this._saveTimer = setTimeout(() => this.pushToCloud(), 450);
        };

        EventBus.on('data:save', schedulePush);
        EventBus.on('data:imported', schedulePush);

        this._channel = this.supabaseClient
            .channel(`heroes_${this.roomCode}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'campaign_heroes',
                filter: `room_code=eq.${this.roomCode}`
            }, (payload) => this.handleRemotePayload(payload))
            .on('broadcast', { event: 'sync_refresh' }, () => {
                if (!this._isRemoteApplying) {
                    this.pullFromCloud();
                }
            })
            .on('broadcast', { event: 'gm_toast' }, ({ payload }) => {
                if (payload?.text) {
                    this.showGmToast(payload.text, payload.accentColor || '#ffd875');
                }
            })
            .subscribe();
        this._startHeroPolling();
    },

    async _authenticateGmFlow(isExistingRoom) {
        const storageKey = `pf_online_gm_secret_${this.roomCode}`;
        let errorMsg = '';

        while (true) {
            const password = await promptGmPasswordModal(this.roomCode, isExistingRoom, errorMsg);
            if (!password) {
                return false; // Пользователь нажал «Отмена»
            }

            const candidateSecret = await deriveGmSecret(this.roomCode, password);
            this.gmSecret = candidateSecret;
            this._createClientWithHeaders();

            if (isExistingRoom) {
                const [{ data: heroesData, error: hErr }, { data: stateData, error: sErr }] = await Promise.all([
                    this.supabaseClient.from('campaign_heroes').select('id').eq('room_code', this.roomCode).limit(1),
                    this.supabaseClient.from('campaign_state').select('room_code').eq('room_code', this.roomCode).limit(1)
                ]);

                const hasAccess = (!hErr && heroesData?.length > 0) || (!sErr && stateData?.length > 0);
                if (!hasAccess) {
                    errorMsg = '❌ Неверный пароль Мастера (или комната пуста). Попробуйте ещё раз.';
                    this.gmSecret = null;
                    continue;
                }
            }

            localStorage.setItem(storageKey, candidateSecret);
            return true;
        }
    },

    async _verifyPlayerAccess(hero) {
        const requiredHash = hero?.playerPasswordHash;
        if (!requiredHash) return true;

        const storageKey = `pf_player_auth_${this.roomCode}_${hero.id}`;
        const savedHash = localStorage.getItem(storageKey);
        if (savedHash === requiredHash) return true;

        let errorMsg = '';
        while (true) {
            const pass = await promptPlayerPasswordModal(hero.name || 'Герой', errorMsg);
            const candidateHash = await derivePlayerHash(hero.id, pass);
            if (candidateHash === requiredHash) {
                localStorage.setItem(storageKey, candidateHash);
                return true;
            }
            errorMsg = '❌ Неверный пароль! Уточните пароль у Мастера.';
        }
    },

    async pullFromCloud() {
        let query = this.supabaseClient
            .from('campaign_heroes')
            .select('*')
            .eq('room_code', this.roomCode);

        if (this.isPlayerMode) {
            query = query.eq('id', this.playerHeroId);
        }

        const heroesPromise = query;
        const statePromise = !this.isPlayerMode
            ? this.supabaseClient
                .from('campaign_state')
                .select('map_data')
                .eq('room_code', this.roomCode)
                .maybeSingle()
            : this.supabaseClient
                .rpc('get_player_map', {
                    p_room_code: this.roomCode,
                    p_hero_id: this.playerHeroId
                })
                .then(({ data, error }) => ({
                    data: data ? { map_data: data } : null,
                    error
                }));

        const [{ data: heroesData, error: heroesErr }, { data: stateRow, error: stateErr }] = await Promise.all([
            heroesPromise,
            statePromise
        ]);

        if (heroesErr) console.error('Ошибка загрузки героев из Supabase:', heroesErr.message);
        if (stateErr) console.error('Ошибка загрузки карты из Supabase:', stateErr.message);

        if (this.isPlayerMode) {
            if (!window.BestiaryManager) return false;
            const heroRow = Array.isArray(heroesData) ? heroesData[0] : null;
            if (!heroRow) {
                console.warn('Supabase не вернул данные героя.');
                return false;
            }
            await this._verifyPlayerAccess(heroRow.hero_data);
        }


        const hasHeroes = Array.isArray(heroesData) && heroesData.length > 0;
        const hasMapState = Boolean(stateRow?.map_data && Object.keys(stateRow.map_data).length > 0);
        if (!hasHeroes && !hasMapState) return false;

        this._isRemoteApplying = true;
        try {
            if (hasMapState) {
                this._applyRemoteMapState(stateRow.map_data);
            }

            if (hasHeroes && window.BestiaryManager) {
                const remoteIds = new Set(heroesData.map(r => r.id));
                window.BestiaryManager.state.party = (window.BestiaryManager.state.party || []).filter(h => remoteIds.has(h.id));
                window.BestiaryManager.state.inactive = (window.BestiaryManager.state.inactive || []).filter(h => remoteIds.has(h.id));

                heroesData.forEach(row => this._applyHeroRow(row));
                window.BestiaryManager.renderUi();
                if (window.InitiativeManager) window.InitiativeManager.renderUi();
            }
        } finally {
            this._isRemoteApplying = false;
        }

        return true;
    },

    _buildSanitizedMapPayload() {
        const rawRef = window.BestiaryManager?.mapDataRef;
        if (!rawRef || typeof rawRef !== 'object') return null;

        const clone = JSON.parse(JSON.stringify(rawRef));
        if (clone.bestiary && typeof clone.bestiary === 'object') {
            delete clone.bestiary.party;
            delete clone.bestiary.inactive;
        }
        return clone;
    },

    _applyRemoteMapState(remoteMapData) {
        if (!remoteMapData || typeof remoteMapData !== 'object') return;
        const targetRef = window.BestiaryManager?.mapDataRef;
        if (!targetRef) return;

        // 1. Запоминаем предыдущий гекс отряда до обновления
        const findSquadHex = (hexesObj) => {
            if (!hexesObj) return null;
            return Object.keys(hexesObj).find(k => hexesObj[k]?.squadHere) || null;
        };
        const prevSquadHexId = findSquadHex(targetRef.hexes);

        const mapClone = JSON.parse(JSON.stringify(remoteMapData));

        if (this.isPlayerMode) {
            if (mapClone.hexes) {
                Object.keys(mapClone.hexes).forEach(k => {
                    const h = mapClone.hexes[k];
                    if (!h || (!h.explored && !h.hasVisited && !h.squadHere)) {
                        delete mapClone.hexes[k];
                    }
                });
            }
            MAP_CONFIG.isGlobalFogEnabled = true;
        }

        const preservedParty = window.BestiaryManager.state.party || [];
        const preservedInactive = window.BestiaryManager.state.inactive || [];

        Object.keys(targetRef).forEach(k => {
            if (k !== 'bestiary') delete targetRef[k];
        });
        Object.assign(targetRef, mapClone);

        if (!targetRef.bestiary || typeof targetRef.bestiary !== 'object') {
            targetRef.bestiary = {};
        }
        Object.assign(targetRef.bestiary, mapClone.bestiary || {});
        targetRef.bestiary.party = preservedParty;
        targetRef.bestiary.inactive = preservedInactive;
        window.BestiaryManager.state = targetRef.bestiary;

        const nextSquadHexId = findSquadHex(targetRef.hexes);
        const squadMoved = Boolean(nextSquadHexId && prevSquadHexId && prevSquadHexId !== nextSquadHexId);

        // Если отряд перешёл в новый гекс, временно прячем статичный токен на время полёта
        if (squadMoved && window.HexCanvasRender) {
            window.HexCanvasRender.hiddenSquadHexId = nextSquadHexId;
        }

        EventBus.emit('data:imported', targetRef);
        EventBus.emit('map:hexesChanged', targetRef.hexes || {});

        if (squadMoved) {
            this._animateSquadMoveOnClient(prevSquadHexId, nextSquadHexId, targetRef);
        }

        if (!this.isPlayerMode) {
            if (window.KingdomManager?.init) {
                window.KingdomManager.state = targetRef.kingdom || window.KingdomManager.state;
                window.KingdomManager.renderUi?.();
            }
            if (window.WeatherManager?.renderUi) {
                window.WeatherManager.renderUi();
            }
        }
    },

    _animateSquadMoveOnClient(fromHexId, toHexId, targetRef) {
        if (window.PathManager?.render) {
            window.PathManager.render();
        }

        const startHexId = window.FLIGHT_FROM_CAPITAL_MODE ? 'hex_0_0' : fromHexId;

        if (window.AnimationManager?.playFlagFlight) {
            window.AnimationManager.playFlagFlight(startHexId, toHexId, () => {
                if (window.HexCanvasRender) {
                    window.HexCanvasRender.hiddenSquadHexId = null;
                    window.HexCanvasRender.updateData(targetRef.hexes, toHexId);
                }
            });
        } else if (window.HexCanvasRender) {
            window.HexCanvasRender.hiddenSquadHexId = null;
            window.HexCanvasRender.updateData(targetRef.hexes, toHexId);
        }

        // Плавно центрируем камеру, если игрок не включил фиксацию камеры в настройках
        if (!window.DISABLE_CAMERA_AUTOCENTER && window.AnimationManager?.focusOnHex) {
            window.AnimationManager.focusOnHex(toHexId);
        }
    },

    async pushToCloud() {
        if (!window.BestiaryManager) return;
        const party = window.BestiaryManager.state.party || [];
        const inactive = window.BestiaryManager.state.inactive || [];
        const allHeroes = [...party, ...inactive];

        if (this.isPlayerMode) {
            const myHero = allHeroes.find(h => h.id === this.playerHeroId);
            if (!myHero || myHero.isReadOnly) return;

            const { error } = await this.supabaseClient
                .from('campaign_heroes')
                .update({
                    hero_data: myHero,
                    updated_at: new Date().toISOString()
                })
                .eq('id', myHero.id)
                .eq('room_code', this.roomCode);

            if (error) console.warn('Сохранение отклонено (возможно, включён Read-Only):', error.message);
            return;
        }

        const currentIds = new Set(allHeroes.map(h => h.id));
        for (const oldId of this._knownHeroIds) {
            if (!currentIds.has(oldId)) {
                await this.supabaseClient.from('campaign_heroes').delete().eq('id', oldId);
            }
        }
        this._knownHeroIds = currentIds;

        for (const hero of allHeroes) {
            await this.supabaseClient.from('campaign_heroes').upsert({
                id: hero.id,
                room_code: this.roomCode,
                gm_secret: this.gmSecret,
                hero_data: hero,
                is_readonly: !!hero.isReadOnly,
                updated_at: new Date().toISOString()
            });
        }

        const mapPayload = this._buildSanitizedMapPayload();
        if (mapPayload) {
            const { error: mapErr } = await this.supabaseClient.from('campaign_state').upsert({
                room_code: this.roomCode,
                gm_secret: this.gmSecret,
                map_data: mapPayload,
                updated_at: new Date().toISOString()
            });
            if (mapErr) {
                console.error('Ошибка сохранения карты в Supabase:', mapErr.message);
            }
        }

        if (this._channel) {
            this._channel.send({
                type: 'broadcast',
                event: 'sync_refresh',
                payload: { ts: Date.now() }
            });
        }
    },

    async handleRemotePayload(payload) {
        if (!window.BestiaryManager) return;
        if (payload.eventType === 'DELETE') {
            const delId = payload.old?.id;
            if (delId) {
                window.BestiaryManager.state.party = window.BestiaryManager.state.party.filter(h => h.id !== delId);
                window.BestiaryManager.state.inactive = (window.BestiaryManager.state.inactive || []).filter(h => h.id !== delId);
                window.BestiaryManager.renderUi();
            }
            return;
        }

        const row = payload.new;
        if (!row?.hero_data) return;
        if (this.isPlayerMode && row.id !== this.playerHeroId) return;

        if (this.isPlayerMode && row.hero_data.playerPasswordHash) {
            const storageKey = `pf_player_auth_${this.roomCode}_${row.id}`;
            if (localStorage.getItem(storageKey) !== row.hero_data.playerPasswordHash) {
                await this._verifyPlayerAccess(row.hero_data);
            }
        }

        this._isRemoteApplying = true;
        this._applyHeroRow(row);
        window.BestiaryManager.renderUi();
        if (window.InitiativeManager) window.InitiativeManager.renderUi();
        this._isRemoteApplying = false;
    },

    _applyHeroRow(row) {
        const incoming = { ...row.hero_data, isReadOnly: !!row.is_readonly };
        this._knownHeroIds.add(incoming.id);

        const party = window.BestiaryManager.state.party;
        const inactive = window.BestiaryManager.state.inactive || [];
        const pIdx = party.findIndex(h => h.id === incoming.id);
        const iIdx = inactive.findIndex(h => h.id === incoming.id);
        if (pIdx !== -1) {
            party[pIdx] = incoming;
        } else if (iIdx !== -1) {
            inactive[iIdx] = incoming;
        } else if (incoming.inactive) {
            inactive.push(incoming);
        } else {
            party.push(incoming);
        }

        const openModal = document.getElementById('bstHeroSheetModal');
        if (openModal && openModal.dataset.heroId === String(incoming.id)) {
            // Если пользователь прямо сейчас печатает в этом окне — не перерисовываем его
            const activeEl = document.activeElement;
            const isTypingHere = activeEl && openModal.contains(activeEl) && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeEl.tagName);

            if (!isTypingHere) {
                const activePage = Number(openModal.dataset.pageNum) || 1;
                // Сохраняем scrollTop самого модального окна и всех его прокручиваемых внутренних блоков
                const modalScrolls = [openModal, ...openModal.querySelectorAll('*')]
                    .filter(el => el.scrollTop > 0)
                    .map(el => [el, el.scrollTop]);

                window.BestiaryManager.openCharacterSheetModal(incoming.id, activePage);

                const newModal = document.getElementById('bstHeroSheetModal');
                if (newModal) {
                    requestAnimationFrame(() => {
                        // Восстанавливаем скролл основного контейнера модалки и аналогичных блоков
                        const newScrollables = [newModal, ...newModal.querySelectorAll('*')];
                        modalScrolls.forEach(([oldEl, top]) => {
                            if (oldEl === openModal) {
                                newModal.scrollTop = top;
                            } else if (oldEl.className) {
                                const match = newScrollables.find(el => el.className === oldEl.className && el.scrollHeight > el.clientHeight);
                                if (match) match.scrollTop = top;
                            }
                        });
                    });
                }
            }
        }

        HeroSyncService.syncFullStats(incoming, false);
        this._checkAndShowHeroAlerts(incoming);
    },

    _startHeroPolling() {
        if (this._pollTimer) return;
        this._pollTimer = setInterval(async () => {
            if (this._isRemoteApplying || !this.supabaseClient || !this.roomCode) return;

            // Если пользователь прямо сейчас вводит текст в открытом листе — не мешаем вводу
            const activeEl = document.activeElement;
            if (activeEl && activeEl.closest('#bstHeroSheetModal') && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeEl.tagName)) {
                return;
            }

            let query = this.supabaseClient
                .from('campaign_heroes')
                .select('*')
                .eq('room_code', this.roomCode);

            if (this.isPlayerMode && this.playerHeroId) {
                query = query.eq('id', this.playerHeroId);
            }

            const { data: heroesData, error } = await query;
            if (error || !Array.isArray(heroesData) || !window.BestiaryManager) return;

            const canonicalStringify = (obj) => {
                if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
                if (Array.isArray(obj)) return '[' + obj.map(canonicalStringify).join(',') + ']';
                const keys = Object.keys(obj).sort();
                return '{' + keys.map(k => JSON.stringify(k) + ':' + canonicalStringify(obj[k])).join(',') + '}';
            };

            let hasChanges = false;
            for (const row of heroesData) {
                if (!row?.hero_data) continue;
                const localHero = (window.BestiaryManager.state.party || []).find(h => h.id === row.id)
                    || (window.BestiaryManager.state.inactive || []).find(h => h.id === row.id);

                // Используем canonicalStringify вместо JSON.stringify!
                const localSnap = localHero ? canonicalStringify({ ...localHero, isReadOnly: !!localHero.isReadOnly }) : '';
                const remoteSnap = canonicalStringify({ ...row.hero_data, isReadOnly: !!row.is_readonly });

                if (localSnap !== remoteSnap) {
                    hasChanges = true;
                    this._isRemoteApplying = true;
                    try {
                        this._applyHeroRow(row);
                    } finally {
                        this._isRemoteApplying = false;
                    }
                }
            }


            if (hasChanges) {
                window.BestiaryManager.renderUi();
                if (window.InitiativeManager) window.InitiativeManager.renderUi();
            }
        }, 3000);
    },

    async sendHeroTgNotification(targetHeroId, message) {
        if (!this.supabaseClient || !this.roomCode || !targetHeroId) return;
        try {
            await this.supabaseClient.from('tg_notifications').insert({
                room_code: this.roomCode,
                target_hero_id: String(targetHeroId),
                message: String(message)
            });
        } catch (e) {
            console.warn('Не удалось поставить TG-уведомление в очередь:', e);
        }
    },

    // Отправляет в браузер получателя всплывающую модалку с кнопкой «Принять»
    async pushHeroClientAlert(targetHeroId, title, htmlBody) {
        const hero = window.BestiaryManager?.state?.party?.find(h => String(h.id) === String(targetHeroId))
            || window.BestiaryManager?.state?.inactive?.find(h => String(h.id) === String(targetHeroId));
        if (!hero) return;

        if (!Array.isArray(hero.pendingAlerts)) hero.pendingAlerts = [];
        hero.pendingAlerts.push({
            id: 'al_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            title,
            body: htmlBody,
            ts: Date.now()
        });
        // Храним не более 10 непрочитанных уведомлений
        if (hero.pendingAlerts.length > 10) {
            hero.pendingAlerts = hero.pendingAlerts.slice(-10);
        }
    },

    // Проверяет, есть ли для текущего игрока непрочитанные уведомления, и показывает модалку
    _checkAndShowHeroAlerts(hero) {
        if (!this.isPlayerMode || String(hero.id) !== String(this.playerHeroId)) return;
        if (!Array.isArray(hero.pendingAlerts) || hero.pendingAlerts.length === 0) return;
        if (document.getElementById('bstIncomingLootAlertModal')) return; // Уже открыто

        const alertItem = hero.pendingAlerts[0];

        const modal = ModalManager.open({
            id: 'bstIncomingLootAlertModal',
            title: alertItem.title || '🎁 Новое поступление!',
            width: '440px',
            borderColor: '#2ecc71',
            bodyHtml: `
                <div style="font-size: 15px; color: #ebd291; line-height: 1.55; padding: 4px 2px;">
                    ${alertItem.body}
                </div>
            `,
            footerButtons: [
                {
                    label: '✅ ОК / Принять',
                    variant: 'ok',
                    onClick: async () => {
                        // Удаляем показанное уведомление из очереди героя и сохраняем в облако
                        hero.pendingAlerts = (hero.pendingAlerts || []).filter(a => a.id !== alertItem.id);
                        modal.close();
                        await this.pushToCloud();
                        // Если остались ещё уведомления в очереди — покажем следующее
                        this._checkAndShowHeroAlerts(hero);
                    }
                }
            ]
        });

        if (modal?.overlay) {
            modal.overlay.style.zIndex = '10000500';
        }
    },
    // Отправляет лёгкое тост-уведомление в окно ГМа (без Telegram и без записи в БД)
    notifyGmToast(text, accentColor = '#ffd875') {
        if (!this._channel) return;
        // Если событие произошло у самого ГМа — показываем локально, иначе шлём по broadcast
        if (!this.isPlayerMode) {
            this.showGmToast(text, accentColor);
        } else {
            this._channel.send({
                type: 'broadcast',
                event: 'gm_toast',
                payload: { text, accentColor, ts: Date.now() }
            });
        }
    },

    // Отрисовывает всплывающее уведомление в левом верхнем углу экрана ГМа (не более 5 штук)
    showGmToast(text, accentColor = '#ffd875') {
        if (this.isPlayerMode) return; // Показываем только Мастеру

        let container = document.getElementById('bstGmToastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'bstGmToastContainer';
            Object.assign(container.style, {
                position: 'fixed',
                top: '16px',
                left: '16px',
                zIndex: '10000600',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxWidth: '360px',
                pointerEvents: 'none'
            });
            document.body.appendChild(container);
        }

        // Ограничиваем ленту: не более 5 сообщений в высоту (удаляем самое старое)
        while (container.children.length >= 5) {
            container.firstElementChild?.remove();
        }

        const toast = document.createElement('div');
        Object.assign(toast.style, {
            background: 'rgba(8, 16, 11, 0.96)',
            border: `1.5px solid ${accentColor}`,
            borderLeft: `4px solid ${accentColor}`,
            borderRadius: '6px',
            padding: '8px 12px',
            color: '#ebd291',
            fontSize: '13px',
            lineHeight: '1.4',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.85)',
            pointerEvents: 'auto',
            cursor: 'pointer',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
            opacity: '0',
            transform: 'translateX(-14px)'
        });
        toast.innerHTML = text;
        toast.title = 'Нажмите, чтобы закрыть';

        const removeToast = () => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-14px)';
            setTimeout(() => toast.remove(), 250);
        };

        toast.addEventListener('click', removeToast);
        container.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        });

        // Автоматически скрываем через 6 секунд
        setTimeout(removeToast, 6000);
    },


};

export default CloudSyncService;
