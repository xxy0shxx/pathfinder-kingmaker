import { SHORT_TO_FULL_SKILL_MAP } from './bestiary_config.js';
import { PF2E_ITEMS_CATALOG, getItemLevel } from '../../config/items_catalog.js';
import { PF2E_ANCESTRIES, PF2E_CLASSES } from '../../config/meta_catalog.js';
import CatalogService from '../../services/catalog_service.js';


const FULL_TO_SHORT_SKILL_MAP = Object.fromEntries(
    Object.entries(SHORT_TO_FULL_SKILL_MAP).map(([shortK, fullK]) => [fullK, shortK])
);


export function recalculateSheetStats(overlayEl, hero) {
    if (!overlayEl || !hero) return;

    const getNum = (key) => parseInt(overlayEl.querySelector(`[data-sheet-num="${key}"]`)?.value, 10) || 0;
    const setNum = (key, val) => {
        const el = overlayEl.querySelector(`[data-sheet-num="${key}"]`);
        if (el) el.value = val;
        hero.stats[key] = val;
    };

    const str = getNum('str');
    const dex = getNum('dex');
    const con = getNum('con');
    const int = getNum('int');
    const wis = getNum('wis');
    const cha = getNum('cha');

    // --- 1. Умный расчет КБ с учетом типа брони и лимита Ловкости ---
    const armorType = overlayEl.querySelector('[data-sheet-txt="armorType"]')?.value || 'unarmored';
    const dexCapMap = { unarmored: 5, light: 3, medium: 2, heavy: 1 };
    let maxDex = dexCapMap[armorType] ?? 5;

    // Берем точные лимит Ловкости и требование Силы из кэша CatalogService
    const armorNameRaw = overlayEl.querySelector('[data-sheet-txt="armorName"]')?.value || '';
    const armorObj = CatalogService.findArmor(armorNameRaw);
    if (armorObj) {
        maxDex = armorObj.dexCap;
    }

    const effDex = Math.min(dex, maxDex);
    const acProf = getNum('acProf');
    const acItem = getNum('acItem');
    const acOther = getNum('acOther');
    const totalAc = 10 + effDex + acProf + acItem + acOther;
    setNum('ac', totalAc);

    // Проверка требования Силы для штрафа брони к навыкам (Check Penalty)
    const strReq = armorObj ? (armorObj.strReq || 0) : 0;
    const acInpEl = overlayEl.querySelector('[data-sheet-num="ac"]');
    if (acInpEl) acInpEl.dataset.currentStrReq = String(strReq);

    const baseArmorPenalty = Math.abs(getNum('acArmorPenalty'));
    const effectiveSkillPenalty = (armorType !== 'unarmored' && str < strReq) ? baseArmorPenalty : 0;

    // --- 2. Поиск активных бонусов к навыкам и испытаниям от предметов и рун ---
    const activeSkillBonuses = {};
    let activeSaveBonus = 0;
    const currentHeroLvl = Math.max(1, getNum('level') || 1);

    // 2.1. Предметы и руны из рюкзака (Стр. 2)
    for (let i = 1; i <= 15; i++) {
        const itemName = String(hero.stats[`item${i}Name`] || '').trim();
        const qty = Math.max(0, Number(hero.stats[`item${i}Qty`]) || 0);
        if (!itemName || qty <= 0) continue;

        const found = CatalogService.findItem(itemName);
        if (!CatalogService.isItemActiveForHero(found, currentHeroLvl, true)) continue;

        if (found.skillBonus?.skill) {
            const targetSk = found.skillBonus.skill;
            activeSkillBonuses[targetSk] = Math.max(activeSkillBonuses[targetSk] || 0, Number(found.skillBonus.bonus) || 0);
        }
        if (found.runeEffect?.target === 'save' && found.runeEffect.bonus) {
            activeSaveBonus = Math.max(activeSaveBonus, Number(found.runeEffect.bonus) || 0);
        }
    }

    // 2.2. Вложенные предметы, надетые на куклу персонажа (Стр. 3)
    const dollSlots = ['head', 'cloak', 'hands', 'belt', 'neck', 'armor', 'eyes', 'feet', 'mainHand', 'offHand', 'ring_1', 'ring_2', 'ring_3', 'ring_4', 'ring_5'];
    dollSlots.forEach(sk => {
        const eqName = String(hero.stats[`eq_${sk}_Name`] || '').trim();
        if (!eqName) return;

        const found = CatalogService.findItem(eqName);
        const isInv = !!hero.stats[`eq_${sk}_Invested`];
        if (!CatalogService.isItemActiveForHero(found, currentHeroLvl, isInv)) return;

        if (found.skillBonus?.skill) {
            const targetSk = found.skillBonus.skill;
            activeSkillBonuses[targetSk] = Math.max(activeSkillBonuses[targetSk] || 0, Number(found.skillBonus.bonus) || 0);
        }
        if (found.runeEffect?.target === 'save' && found.runeEffect.bonus) {
            activeSaveBonus = Math.max(activeSaveBonus, Number(found.runeEffect.bonus) || 0);
        }
    });

    hero.stats.skillItemBonuses = activeSkillBonuses;

    // --- 3. Авторасчет Внимания и Испытаний (Спасбросков) + Руна стойкости ---
    setNum('perception', wis + getNum('saveProf_perc'));
    setNum('fortitude', con + getNum('saveProf_fort') + activeSaveBonus);
    setNum('reflex', dex + getNum('saveProf_ref') + activeSaveBonus);
    setNum('will', wis + getNum('saveProf_will') + activeSaveBonus);

    // --- 4. Авторасчет всех 17 навыков Pathfinder 2e (с учетом предметов и штрафа брони) ---
    const skillMap = {
        acrobatics: dex, athletics: str, thievery: dex, stealth: dex,
        survival: wis, medicine: wis, nature: wis, religion: wis,
        diplomacy: cha, intimidation: cha, deception: cha, performance: cha,
        arcana: int, occultism: int, society: int, crafting: int, lore: int
    };
    const penaltySkills = ['acrobatics', 'athletics', 'stealth', 'thievery'];

    Object.entries(skillMap).forEach(([sk, attrVal]) => {
        const prof = getNum(`prof_${sk}`);
        const itemBonus = activeSkillBonuses[sk] || 0;
        const pen = penaltySkills.includes(sk) ? effectiveSkillPenalty : 0;
        setNum(sk, attrVal + prof + itemBonus - pen);
    });
}


/**
 * Пересчитывает Макс. ПЗ, Атаку заклинанием и СЛ заклинаний под текущий уровень, народ и класс героя
 */
export function recalculateLevelProgression(overlay, hero) {
    if (!hero || !hero.stats) return null;

    const getNum = (key, fallback = 0) => {
        const el = overlay?.querySelector(`[data-sheet-num="${key}"]`);
        return el ? (parseInt(el.value, 10) || 0) : (Number(hero.stats[key]) || fallback);
    };
    const getTxt = (key) => {
        const el = overlay?.querySelector(`[data-sheet-txt="${key}"]`);
        return (el ? el.value : (hero.stats[key] || '')).trim();
    };

    const norm = (s) => String(s || '')
        .replace(/^[^\p{L}\p{N}]+/u, '')
        .replace(/\([^)]*\)/g, '')
        .trim()
        .toLowerCase()
        .replace(/ё/g, 'е');

    const level = Math.max(1, Math.min(20, getNum('level', 1)));
    const conMod = getNum('con', 0);

    // 1. Поиск Народа и Класса в meta_catalog.js
    const ancName = norm(getTxt('ancestry'));
    const clsName = norm(getTxt('charClass'));

    const ancObj = CatalogService.findAncestry(hero.stats.ancestry);
    const clsObj = CatalogService.findClass(hero.stats.charClass);

    const ancHp = ancObj ? (Number(ancObj.hp) || 8) : 8;
    const clsHp = clsObj ? (Number(clsObj.hp) || 8) : 8;

    // 2. Проверка наличия черты «Живучесть» (Toughness: +1 ПЗ за каждый уровень)
    const allTexts = Object.values(hero.stats).filter(v => typeof v === 'string').join(' ').toLowerCase().replace(/ё/g, 'е');
    const hasToughness = /живучест|toughness/i.test(allTexts);

    const hpPerLevel = Math.max(1, clsHp + conMod + (hasToughness ? 1 : 0));
    const newHpMax = Math.max(1, ancHp + hpPerLevel * level);

    const prevHpMax = getNum('hpMax', 10);
    const prevHpCur = getNum('hpCurrent', prevHpMax);
    const hpDiff = newHpMax - prevHpMax;
    const newHpCur = Math.max(0, Math.min(newHpMax, prevHpCur + hpDiff));

    hero.stats.hpMax = newHpMax;
    hero.stats.hpCurrent = newHpCur;

    if (overlay) {
        const maxInp = overlay.querySelector('[data-sheet-num="hpMax"]');
        const curInp = overlay.querySelector('[data-sheet-num="hpCurrent"]');
        if (maxInp) maxInp.value = newHpMax;
        if (curInp) curInp.value = newHpCur;
    }

    // 3. Расчёт Атаки и СЛ заклинаний по ключевой характеристике и рангу умения заклинателя
    const keyStatRaw = String(clsObj?.keyStat || '').toLowerCase();
    let spellAttrKey = 'int';
    if (/хар|cha/i.test(keyStatRaw) || /бард|чародей|оракул|призыватель|тауматург|поборник/i.test(clsName)) {
        spellAttrKey = 'cha';
    } else if (/мдр|wis/i.test(keyStatRaw) || /жрец|друид|анимист|следопыт|монах/i.test(clsName)) {
        spellAttrKey = 'wis';
    } else if (/инт|int/i.test(keyStatRaw) || /волшебник|ведьма|экстрасенс|колдун|магус|некромант/i.test(clsName)) {
        spellAttrKey = 'int';
    }

    const attrMod = getNum(spellAttrKey, 0);

    // Прогрессия мастерства заклинаний PF2e:
    // Полные кастеры: Изученный (1-6), Эксперт (7-14), Мастер (15-18), Легендарный (19-20)
    // Полукастеры (Колдун, Призыватель): Изученный (1-8), Эксперт (9-16), Мастер (17-20)
    // Фокальные (Монах, Поборник, Следопыт): Изученный (1-8), Эксперт (9-16), Мастер (17-20)
    const isBoundedOrMartial = /колдун|магус|призыватель|монах|поборник|следопыт|воин|плут|варвар/i.test(clsName);
    let rankBonus = 2; // Изученный
    if (isBoundedOrMartial) {
        if (level >= 17) rankBonus = 6;
        else if (level >= 9) rankBonus = 4;
    } else {
        if (level >= 19) rankBonus = 8;
        else if (level >= 15) rankBonus = 6;
        else if (level >= 7) rankBonus = 4;
    }

    const totalProf = level + rankBonus;
    const newSpellAtk = attrMod + totalProf;
    const newSpellDc = 10 + attrMod + totalProf;

    hero.stats.spellAttack = newSpellAtk;
    hero.stats.spellDc = newSpellDc;

    if (overlay) {
        const atkInp = overlay.querySelector('[data-sheet-num="spellAttack"]');
        const dcInp = overlay.querySelector('[data-sheet-num="spellDc"]');
        if (atkInp) atkInp.value = newSpellAtk;
        if (dcInp) dcInp.value = newSpellDc;
    }

    // 4. Определение рангов мастерства класса на текущем уровне (2 = Изуч., 4 = Эксп., 6 = Маст., 8 = Легенд.)
    const isEliteWeapon = /воин|fighter|стрелок|gunslinger/i.test(clsName);
    const isMartial = /поборник|паладин|champion|варвар|barbarian|следопыт|рейнджер|ranger|монах|monk|плут|rogue|сорвиголова|swashbuckler|следователь|investigator/i.test(clsName);
    const isHybrid = /колдун|магус|magus|изобретатель|inventor|тауматург|thaumaturge|призыватель|summoner/i.test(clsName);

    // Оружие: Воин/Стрелок (Эксперт с 1, Мастер с 5, Легенда с 13); Воины/Гибриды (Эксперт с 5, Мастер с 13); Кастеры (Эксперт с 11)
    let wpnRank = 2;
    if (isEliteWeapon) {
        wpnRank = level >= 13 ? 8 : (level >= 5 ? 4 : 4);
    } else if (isMartial || isHybrid) {
        wpnRank = level >= 13 ? 6 : (level >= 5 ? 4 : 2);
    } else {
        wpnRank = level >= 11 ? 4 : 2;
    }

    // Броня: Монах (Эксперт с 1, Мастер с 13, Легенда с 17); Поборник (Эксперт с 7, Мастер с 13, Легенда с 17);
    // Воин/Варвар/Следопыт/Плут/Колдун (Эксперт с 11/13, Мастер с 17/19); Кастеры (Эксперт с 13)
    let armorRank = 2;
    if (/монах|monk/i.test(clsName)) {
        armorRank = level >= 17 ? 8 : (level >= 13 ? 6 : 4);
    } else if (/поборник|паладин|champion/i.test(clsName)) {
        armorRank = level >= 17 ? 8 : (level >= 13 ? 6 : (level >= 7 ? 4 : 2));
    } else if (isEliteWeapon || isMartial || isHybrid) {
        armorRank = level >= 17 ? 6 : (level >= 11 ? 4 : 2);
    } else {
        armorRank = level >= 13 ? 4 : 2;
    }

    // Обновление атаки оружия (Уровень + Ранг оружия + характеристика + руна могущества)
    const strMod = getNum('str', 0);
    const dexMod = getNum('dex', 0);
    const updateWeaponAtk = (slot, isRanged) => {
        const wName = getTxt(`${slot}Name`);
        if (!wName) return;
        const traits = getTxt(`${slot}Traits`).toLowerCase();
        const isFinesse = !isRanged && traits.includes('фехтовальн');
        const statBonus = isRanged ? dexMod : (isFinesse ? Math.max(strMod, dexMod) : strMod);

        const potencyMatch = wName.match(/^\+(\d)/);
        const potencyBonus = potencyMatch ? (parseInt(potencyMatch[1], 10) || 0) : 0;

        const totalAtk = level + wpnRank + statBonus + potencyBonus;
        const atkStr = totalAtk >= 0 ? `+${totalAtk}` : `${totalAtk}`;
        hero.stats[`${slot}Atk`] = atkStr;
        if (overlay) {
            const inp = overlay.querySelector(`[data-sheet-txt="${slot}Atk"]`);
            if (inp) inp.value = atkStr;
        }
    };

    updateWeaponAtk('melee1', false);
    updateWeaponAtk('melee2', false);
    updateWeaponAtk('ranged', true);

    // 5. Обновление умений Брони, Внимания, Спасбросков и Навыков
    const prevLvl = Math.max(1, Number(hero.stats._lastCalcLevel) || 1);
    const lvlDelta = level - prevLvl;
    hero.stats._lastCalcLevel = level;

    const setProfField = (key, val) => {
        hero.stats[key] = val;
        if (overlay) {
            const inp = overlay.querySelector(`[data-sheet-num="${key}"]`);
            if (inp) inp.value = val;
        }
    };

    // Броня получает максимум из (сдвинутого текущего значения) и (базового классового ранга + уровень)
    const curAcProf = getNum('acProf', 2);
    const shiftedAcProf = curAcProf > 0 ? Math.max(2, curAcProf + lvlDelta) : (level + armorRank);
    setProfField('acProf', Math.max(shiftedAcProf, level + armorRank));

    // Испытания и Внимание: базовый порог (Эксперт с 5/7/9 ур., Мастер с 11/15 ур.), не ниже уже выставленного игроком ранга
    const minSaveRank = level >= 15 ? 6 : (level >= 7 ? 4 : 2);
    const minPercRank = level >= 11 ? 6 : (level >= 5 ? 4 : 2);

    ['saveProf_fort', 'saveProf_ref', 'saveProf_will'].forEach(key => {
        const cur = getNum(key, 2);
        const shifted = cur > 0 ? Math.max(2, cur + lvlDelta) : (level + 2);
        setProfField(key, Math.max(shifted, level + minSaveRank));
    });

    const curPerc = getNum('saveProf_perc', 2);
    const shiftedPerc = curPerc > 0 ? Math.max(2, curPerc + lvlDelta) : (level + 2);
    setProfField('saveProf_perc', Math.max(shiftedPerc, level + minPercRank));

    // Навыки сдвигаются на разницу уровней (если изучены)
    if (lvlDelta !== 0) {
        Object.keys(hero.stats).forEach(k => {
            if (k.startsWith('prof_')) {
                const curVal = getNum(k, 0);
                if (curVal > 0) {
                    setProfField(k, Math.max(2, curVal + lvlDelta));
                }
            }
        });
    }


    return {
        newHpMax,
        newSpellAtk,
        newSpellDc,
        formulaHp: `${ancHp} (народ) + (${clsHp} класс + ${conMod} ВЫН${hasToughness ? ' + 1 Живучесть' : ''}) × ${level} ур.`
    };
}
