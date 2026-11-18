import { MAP_CONFIG } from '../config/app_config.js';
import EventBus from './event_bus.js';
import {
    deriveGmSecret,
    derivePlayerHash,
    promptGmPasswordModal,
    promptPlayerPasswordModal
} from './cloud_auth_modal.js';

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
    _knownHeroIds: new Set(),

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
        localStorage.removeItem(`pf_online_gm_secret_${this.roomCode}`);
        window.location.reload();
    },

    async init() {
        const urlRoom = params.get('room');
        if (urlRoom && !this.isPlayerMode) {
            localStorage.setItem('pf_online_room_code', urlRoom);
        }
        this.roomCode = urlRoom || this.getRoomCode();

        if (!this.isPlayerMode) {
            const url = new URL(window.location.href);
            url.searchParams.set('room', this.roomCode);
            url.searchParams.delete('gmSecret');
            window.history.replaceState({}, '', url);

            const storageKey = `pf_online_gm_secret_${this.roomCode}`;
            this.gmSecret = localStorage.getItem(storageKey);

            if (!this.gmSecret) {
                await this._authenticateGmFlow(Boolean(urlRoom));
            } else {
                this._createClientWithHeaders();
            }
        } else {
            this._createClientWithHeaders();
        }

        await this.pullFromCloud();

        if (!this.isPlayerMode && window.BestiaryManager) {
            const hasLocalHeroes = (window.BestiaryManager.state.party?.length > 0) ||
                (window.BestiaryManager.state.inactive?.length > 0);
            if (hasLocalHeroes) {
                await this.pushToCloud();
            }
        }

        EventBus.on('data:save', () => {
            if (this._isRemoteApplying) return;
            clearTimeout(this._saveTimer);
            this._saveTimer = setTimeout(() => this.pushToCloud(), 450);
        });

        this.supabaseClient
            .channel(`heroes_${this.roomCode}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'campaign_heroes',
                filter: `room_code=eq.${this.roomCode}`
            }, (payload) => this.handleRemotePayload(payload))
            .subscribe();
    },

    async _authenticateGmFlow(isExistingRoom) {
        const storageKey = `pf_online_gm_secret_${this.roomCode}`;
        let errorMsg = '';

        while (true) {
            const password = await promptGmPasswordModal(this.roomCode, isExistingRoom, errorMsg);
            const candidateSecret = await deriveGmSecret(this.roomCode, password);
            this.gmSecret = candidateSecret;
            this._createClientWithHeaders();

            if (isExistingRoom) {
                const { data, error } = await this.supabaseClient
                    .from('campaign_heroes')
                    .select('id')
                    .eq('room_code', this.roomCode)
                    .limit(1);

                if (error || !data || data.length === 0) {
                    errorMsg = '❌ Неверный пароль Мастера (или комната пуста). Попробуйте ещё раз.';
                    this.gmSecret = null;
                    continue;
                }
            }

            localStorage.setItem(storageKey, candidateSecret);
            break;
        }
    },

    async _verifyPlayerAccess(hero) {
        const requiredHash = hero?.playerPasswordHash;
        if (!requiredHash) return true; // Если пароль не задан — пускаем свободно

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

        const { data, error } = await query;
        if (error) {
            console.error('Ошибка загрузки из Supabase:', error.message);
            return;
        }
        if (!data?.length || !window.BestiaryManager) return;

        // Проверяем пароль игрока перед тем, как открыть ему данные героя
        if (this.isPlayerMode) {
            const heroData = data[0]?.hero_data;
            await this._verifyPlayerAccess(heroData);
        }

        this._isRemoteApplying = true;
        data.forEach(row => this._applyHeroRow(row));
        window.BestiaryManager.renderUi();
        if (window.InitiativeManager) window.InitiativeManager.renderUi();
        this._isRemoteApplying = false;
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
    },

    async handleRemotePayload(payload) {
        if (!window.BestiaryManager) return;
        if (payload.eventType === 'DELETE') {
            const delId = payload.old?.id;
            if (delId) {
                window.BestiaryManager.state.party = window.BestiaryManager.state.party.filter(h => h.id !== delId);
                window.BestiaryManager.renderUi();
            }
            return;
        }

        const row = payload.new;
        if (!row?.hero_data) return;
        if (this.isPlayerMode && row.id !== this.playerHeroId) return;

        // Если ГМ сменил пароль героя прямо во время сессии — сразу требуем новый пароль у игрока
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
        if (openModal && this.isPlayerMode && incoming.id === this.playerHeroId) {
            const activePage = Number(openModal.dataset.pageNum) || 1;
            window.BestiaryManager.openCharacterSheetModal(incoming.id, activePage);
        }
    },


};
export default CloudSyncService;
