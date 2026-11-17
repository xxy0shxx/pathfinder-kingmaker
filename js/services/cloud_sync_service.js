import EventBus from './event_bus.js';

const { createClient } = window.supabase;

const SUPABASE_URL = 'https://ozifsproqgzfmdmuaapb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_vUhWveXr7Rm0wbpCBKEaPA_skmNbeek';

const params = new URLSearchParams(window.location.search);
const PLAYER_HERO_ID = params.get('playerHeroId');
const IS_PLAYER_MODE = Boolean(PLAYER_HERO_ID);

function getOrCreateGmSecret() {
    let secret = localStorage.getItem('pf_online_gm_secret');
    if (!secret) {
        secret = 'gm_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
        localStorage.setItem('pf_online_gm_secret', secret);
    }
    return secret;
}

const GM_SECRET = !IS_PLAYER_MODE ? getOrCreateGmSecret() : '';
const initialRoomCode = params.get('room') || localStorage.getItem('pf_online_room_code') || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
        headers: {
            ...(GM_SECRET ? { 'x-gm-secret': GM_SECRET } : {}),
            ...(initialRoomCode ? { 'x-room-code': initialRoomCode } : {})
        }
    }
});

const CloudSyncService = {
    roomCode: null,
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

    getPlayerInviteUrl(heroId) {
        const url = new URL(window.location.href);
        url.search = '';
        url.searchParams.set('room', this.roomCode || this.getRoomCode());
        url.searchParams.set('playerHeroId', heroId);
        return url.toString();
    },

    async init() {
        this.roomCode = params.get('room') || this.getRoomCode();

        if (!params.get('room') && !this.isPlayerMode) {
            const url = new URL(window.location.href);
            url.searchParams.set('room', this.roomCode);
            window.history.replaceState({}, '', url);
        }

        // 1. Загружаем актуальные данные из облака при старте
        await this.pullFromCloud();

        // Если это ГМ и отряд ещё не в облаке — отправляем стартовое состояние
        if (!this.isPlayerMode) {
            await this.pushToCloud();
        }

        // 2. Автоматически отправляем изменения при сохранении в системе
        EventBus.on('data:save', () => {
            if (this._isRemoteApplying) return;
            clearTimeout(this._saveTimer);
            this._saveTimer = setTimeout(() => this.pushToCloud(), 450);
        });

        // 3. Подписка на изменения от других участников в реальном времени
        supabase
            .channel(`heroes_${this.roomCode}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'campaign_heroes',
                filter: `room_code=eq.${this.roomCode}`
            }, (payload) => this.handleRemotePayload(payload))
            .subscribe();
    },

    async pullFromCloud() {
        let query = supabase.from('campaign_heroes').select('*').eq('room_code', this.roomCode);
        if (this.isPlayerMode) {
            query = query.eq('id', this.playerHeroId);
        }

        const { data, error } = await query;
        if (error) {
            console.error('Ошибка загрузки из Supabase:', error.message);
            return;
        }
        if (!data?.length || !window.BestiaryManager) return;

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

            const { error } = await supabase
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

        // Режим ГМа: синхронизируем весь отряд и удаляем удалённых героев
        const currentIds = new Set(allHeroes.map(h => h.id));
        for (const oldId of this._knownHeroIds) {
            if (!currentIds.has(oldId)) {
                await supabase.from('campaign_heroes').delete().eq('id', oldId);
            }
        }
        this._knownHeroIds = currentIds;

        for (const hero of allHeroes) {
            await supabase.from('campaign_heroes').upsert({
                id: hero.id,
                room_code: this.roomCode,
                gm_secret: GM_SECRET,
                hero_data: hero,
                is_readonly: !!hero.isReadOnly,
                updated_at: new Date().toISOString()
            });
        }
    },

    handleRemotePayload(payload) {
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

        if (pIdx !== -1) party[pIdx] = incoming;
        else if (iIdx !== -1) inactive[iIdx] = incoming;
        else if (this.isPlayerMode) party.push(incoming);

        // Перерисовываем открытый бланк у игрока, если ГМ обновил статы или включил/выключил Read-Only
        const openModal = document.getElementById('bstHeroSheetModal');
        if (openModal && this.isPlayerMode && incoming.id === this.playerHeroId) {
            const activePage = Number(openModal.dataset.pageNum) || 1;
            window.BestiaryManager.openCharacterSheetModal(incoming.id, activePage);
        }
    }
};

export default CloudSyncService;
