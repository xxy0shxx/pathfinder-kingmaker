/**
 * ЕДИНЫЙ СЕРВИС СИНХРОНИЗАЦИИ ПЕРСОНАЖЕЙ (HeroSyncService)
 * Связывает копии героя между Бестиарием (отряд/резерв) и трекером боевой инициативы.
 */
const HeroSyncService = {
    normalizeName(name) {
        return String(name || '').trim().toLowerCase().replace(/ё/g, 'е');
    },

    /**
     * Возвращает все доступные списки героев из Бестиария (активный отряд + резерв)
     */
    getAllBestiaryHeroes() {
        const bm = window.BestiaryManager;
        if (!bm || !bm.state) return [];
        return [
            ...(Array.isArray(bm.state.party) ? bm.state.party : []),
            ...(Array.isArray(bm.state.inactive) ? bm.state.inactive : [])
        ].filter(Boolean);
    },

    /**
     * Находит героя в Бестиарии по id или нормализованному имени
     */
    findBestiaryHero(idOrName) {
        const needle = this.normalizeName(idOrName);
        return this.getAllBestiaryHeroes().find(p =>
            p.id === idOrName || this.normalizeName(p.name) === needle
        ) || null;
    },

    /**
     * Находит все экземпляры одного и того же персонажа во всех хранилищах:
     * 1) переданный объект (например, открытый в модалке),
     * 2) запись в отряде или резерве Бестиария,
     * 3) все карточки этого союзника в трекере боевой инициативы.
     */
    getHeroInstances(heroRef) {
        if (!heroRef) return [];
        const instances = new Set([heroRef]);
        const targetHeroId = heroRef.heroId || heroRef.id;
        const targetNormName = this.normalizeName(heroRef.name);

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
     * Применяет функцию обновления ко всем копиям героя и при необходимости сохраняет состояние
     */
    syncHero(heroRef, mutatorFn, options = { save: true, renderInitiative: false }) {
        const copies = this.getHeroInstances(heroRef);
        copies.forEach(copy => {
            if (!copy.stats) copy.stats = {};
            mutatorFn(copy);
        });

        if (options.save && window.BestiaryManager?._save) {
            window.BestiaryManager._save();
        }
        if (options.renderInitiative && window.InitiativeManager?.renderUi) {
            window.InitiativeManager._persist?.();
            window.InitiativeManager.renderUi();
        }
        return copies.length;
    },

    /**
     * Синхронизирует кошелёк героя во всех копиях
     */
    syncCoins(heroRef, gold, silver, copper, save = false) {
        return this.syncHero(heroRef, (copy) => {
            copy.stats.coinsGold = Math.max(0, Number(gold) || 0);
            copy.stats.coinsSilver = Math.max(0, Number(silver) || 0);
            copy.stats.coinsCopper = Math.max(0, Number(copper) || 0);
        }, { save });
    },

    /**
     * Синхронизирует конкретный слот рюкзака (1..15) во всех копиях
     */
    syncBackpackSlot(heroRef, slotIndex, name, qty, notes, save = false) {
        return this.syncHero(heroRef, (copy) => {
            copy.stats[`item${slotIndex}Name`] = String(name || '');
            copy.stats[`item${slotIndex}Qty`] = Math.max(0, Number(qty) || 0);
            copy.stats[`item${slotIndex}Notes`] = String(notes || '');
        }, { save });
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
        }, { save, renderInitiative: true });
    }
};

window.HeroSyncService = HeroSyncService;
export default HeroSyncService;
