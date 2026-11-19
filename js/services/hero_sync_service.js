import CloudSyncService from './cloud_sync_service.js';

/**
 * ЕДИНЫЙ СЕРВИС СИНХРОНИЗАЦИИ ПЕРСОНАЖЕЙ (HeroSyncService)
 * Связывает копии героя между Бестиарием (отряд/резерв), трекером инициативы,
 * локальным сохранением и облаком Supabase.
 */
const HeroSyncService = {
    normalizeName(name) {
        return String(name || '').trim().toLowerCase().replace(/ё/g, 'е');
    },

    getAllBestiaryHeroes() {
        const bm = window.BestiaryManager;
        if (!bm || !bm.state) return [];
        return [
            ...(Array.isArray(bm.state.party) ? bm.state.party : []),
            ...(Array.isArray(bm.state.inactive) ? bm.state.inactive : [])
        ].filter(Boolean);
    },

    findBestiaryHero(idOrName) {
        const needle = this.normalizeName(idOrName);
        return this.getAllBestiaryHeroes().find(p =>
            p.id === idOrName || this.normalizeName(p.name) === needle
        ) || null;
    },

    /**
     * Находит все локальные экземпляры персонажа:
     * 1) переданный объект, 2) запись в отряде/резерве Бестиария, 3) карточки в трекере инициативы.
     */
    getHeroInstances(heroRef) {
        if (!heroRef) return [];
        const instances = new Set();
        const isObj = typeof heroRef === 'object';
        if (isObj) instances.add(heroRef);

        const targetHeroId = isObj ? (heroRef.heroId || heroRef.id) : heroRef;
        const targetNormName = isObj ? this.normalizeName(heroRef.name) : this.normalizeName(heroRef);

        const isSameHero = (candidate) => {
            if (!candidate) return false;
            if (targetHeroId && (candidate.id === targetHeroId || candidate.heroId === targetHeroId)) {
                return true;
            }
            return targetNormName && this.normalizeName(candidate.name) === targetNormName;
        };

        this.getAllBestiaryHeroes().forEach(p => {
            if (isSameHero(p)) instances.add(p);
        });

        const combatants = window.InitiativeManager?.state?.combatants || [];
        combatants.forEach(u => {
            if (u && u.faction === 'friend' && isSameHero(u)) {
                instances.add(u);
            }
        });

        return Array.from(instances);
    },

    /**
     * Применяет мутацию ко всем локальным копиям героя, сохраняет локально и в облако.
     */
    syncHero(heroRef, mutatorFn, options = { save: true, renderInitiative: false, cloudPush: true }) {
        const copies = this.getHeroInstances(heroRef);
        copies.forEach(copy => {
            if (!copy.stats) copy.stats = {};
            mutatorFn(copy);
        });

        const shouldSave = options.save !== false;
        const shouldCloud = options.cloudPush !== false;

        if (shouldSave) {
            // _save() внутри BestiaryManager сам вызовет EventBus('data:save'),
            // который сохранит в StorageManager и запустит CloudSyncService.pushToCloud()
            if (window.BestiaryManager?._save) {
                window.BestiaryManager._save();
            } else if (window.InitiativeManager?._saveWithoutSort) {
                window.InitiativeManager._saveWithoutSort();
            }
        } else if (options.renderInitiative && window.InitiativeManager?.renderUi) {
            window.InitiativeManager.renderUi();
        }

        // Если save === false (например, пакетное обновление нескольких героев),
        // но включён cloudPush, точечно обновляем затронутого героя в Supabase
        if (!shouldSave && shouldCloud && copies.length > 0) {
            this.pushSingleHeroToCloud(copies[0]);
        }

        return copies.length;
    },

    /**
     * Точечная отправка одного героя в Supabase (актуально для пакетных операций
     * и передачи предметов/монет между игроками).
     */
    async pushSingleHeroToCloud(heroObj) {
        if (!heroObj?.id || !CloudSyncService?.supabaseClient || !CloudSyncService.roomCode) return;
        if (CloudSyncService._isRemoteApplying) return;

        // Ищем эталонную запись из Бестиария, если передали копию из инициативы
        const canonical = this.findBestiaryHero(heroObj.heroId || heroObj.id) || heroObj;
        if (!canonical.id) return;

        try {
            if (CloudSyncService.isPlayerMode) {
                if (canonical.isReadOnly) return;
                await CloudSyncService.supabaseClient
                    .from('campaign_heroes')
                    .update({
                        hero_data: canonical,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', canonical.id)
                    .eq('room_code', CloudSyncService.roomCode);
            } else if (CloudSyncService.gmSecret) {
                await CloudSyncService.supabaseClient
                    .from('campaign_heroes')
                    .upsert({
                        id: canonical.id,
                        room_code: CloudSyncService.roomCode,
                        gm_secret: CloudSyncService.gmSecret,
                        hero_data: canonical,
                        is_readonly: !!canonical.isReadOnly,
                        updated_at: new Date().toISOString()
                    });
            }
        } catch (e) {
            console.warn('HeroSyncService: ошибка точечного сохранения в облако:', e);
        }
    },

    /**
     * Синхронизирует кошелёк героя во всех копиях
     */
    syncCoins(heroRef, gold, silver, copper, save = false) {
        return this.syncHero(heroRef, (copy) => {
            copy.stats.coinsGold = Math.max(0, Number(gold) || 0);
            copy.stats.coinsSilver = Math.max(0, Number(silver) || 0);
            copy.stats.coinsCopper = Math.max(0, Number(copper) || 0);
        }, { save, cloudPush: save });
    },

    /**
     * Синхронизирует конкретный слот рюкзака (1..15) во всех копиях
     */
    syncBackpackSlot(heroRef, slotIndex, name, qty, notes, save = false) {
        return this.syncHero(heroRef, (copy) => {
            copy.stats[`item${slotIndex}Name`] = String(name || '');
            copy.stats[`item${slotIndex}Qty`] = Math.max(0, Number(qty) || 0);
            copy.stats[`item${slotIndex}Notes`] = String(notes || '');
        }, { save, cloudPush: save });
    },

    /**
     * Полностью копирует объект stats из эталона во все остальные экземпляры героя
     */
    syncFullStats(sourceHero, save = true) {
        if (!sourceHero?.stats) return 0;
        const snapshot = JSON.parse(JSON.stringify(sourceHero.stats));
        return this.syncHero(sourceHero, (copy) => {
            if (copy !== sourceHero) {
                copy.name = sourceHero.name;
                copy.avatarType = sourceHero.avatarType;
                copy.stats = JSON.parse(JSON.stringify(snapshot));
            }
        }, { save, renderInitiative: true, cloudPush: save });
    }
};

window.HeroSyncService = HeroSyncService;
export default HeroSyncService;
