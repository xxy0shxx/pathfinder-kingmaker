import { SHORT_TO_FULL_SKILL_MAP } from './bestiary_config.js';
import { PF2E_ITEMS_CATALOG, getItemLevel } from '../../config/items_catalog.js';
import { PF2E_ANCESTRIES, PF2E_CLASSES } from '../../config/meta_catalog.js';



const FULL_TO_SHORT_SKILL_MAP = Object.fromEntries(
    Object.entries(SHORT_TO_FULL_SKILL_MAP).map(([shortK, fullK]) => [fullK, shortK])
);

export function recalculateSheetStats(overlay, hero) {
    const armorType = overlay.querySelector('[data-sheet-txt="armorType"]')?.value || 'unarmored';
    const dexInp = overlay.querySelector('[data-sheet-num="acDex"]');
    const profInp = overlay.querySelector('[data-sheet-num="acProf"]');
    const itemInp = overlay.querySelector('[data-sheet-num="acItem"]');
    const otherInp = overlay.querySelector('[data-sheet-num="acOther"]');
    const penaltyInp = overlay.querySelector('[data-sheet-num="acArmorPenalty"]');
    const totalAcInp = overlay.querySelector('[data-sheet-num="ac"]');

    if (!totalAcInp) return;

    let rawDex = parseInt(dexInp?.value, 10) || 0;
    const prof = parseInt(profInp?.value, 10) || 0;
    const item = parseInt(itemInp?.value, 10) || 0;
    const other = parseInt(otherInp?.value, 10) || 0;

    const charStr = parseInt(overlay.querySelector('[data-sheet-num="str"]')?.value, 10) || 0;
    const armorStrReq = parseInt(totalAcInp.dataset.currentStrReq, 10) || 0;

    let dexCap = 5;
    if (armorType === 'light') dexCap = 3;
    else if (armorType === 'medium') dexCap = 2;
    else if (armorType === 'heavy') dexCap = 1;

    if (rawDex > dexCap) rawDex = dexCap;

    const basePenalty = parseInt(penaltyInp?.value, 10) || 0;
    const activePenalty = (armorType !== 'unarmored' && charStr < armorStrReq)
        ? Math.abs(basePenalty)
        : 0;

    hero.stats.acArmorPenalty = basePenalty;

    if (penaltyInp) {
        if (armorType === 'unarmored') {
            penaltyInp.title = 'Нет брони — штрафы отсутствуют.';
        } else if (charStr < armorStrReq) {
            penaltyInp.title = `Штраф активен! Сила (${charStr}) меньше требуемой (${armorStrReq}).`;
            penaltyInp.style.borderColor = '#e74c3c';
        } else {
            penaltyInp.title = `Штраф аннулирован! Сила (${charStr}) соответствует требованиям (${armorStrReq}).`;
            penaltyInp.style.borderColor = '#2ecc71';
        }
    }

    // Итоговый КБ
    const totalAc = 10 + rawDex + prof + item + other;
    totalAcInp.value = totalAc;
    hero.stats.ac = totalAc;

    // Синхронизация бонусов от предметов в рюкзаке с проверкой уровня персонажа
    const currentHeroLvl = Math.max(1, parseInt(overlay.querySelector('[data-sheet-num="level"]')?.value, 10) || Number(hero.stats.level) || 1);
    const activeSkillBonuses = {};
    let activeSaveBonus = 0;

    for (let i = 1; i <= 15; i++) {
        const dollSlots = ['head', 'cloak', 'hands', 'belt', 'neck', 'armor', 'eyes', 'feet', 'mainHand', 'offHand', 'ring_1', 'ring_2', 'ring_3', 'ring_4', 'ring_5'];
        dollSlots.forEach(sk => {
            const eqName = String(hero.stats[`eq_${sk}_Name`] || '').trim();
            if (!eqName) return;
            const cleanEq = eqName.replace(/^[^\p{L}\p{N}]+/u, '').trim().toLowerCase().replace(/ё/g, 'е');
            const found = PF2E_ITEMS_CATALOG.find(it => it.name.replace(/^[^\p{L}\p{N}]+/u, '').trim().toLowerCase().replace(/ё/g, 'е') === cleanEq);
            if (!found || getItemLevel(found) > currentHeroLvl) return;

            const isInv = /настроенность|вкладываем|invested/i.test(`${found.notes || ''} ${found.category || ''}`);
            if (isInv && !hero.stats[`eq_${sk}_Invested`]) return;

            if (found.skillBonus?.skill) {
                const targetSk = found.skillBonus.skill;
                activeSkillBonuses[targetSk] = Math.max(activeSkillBonuses[targetSk] || 0, Number(found.skillBonus.bonus) || 0);
            }
            if (found.runeEffect?.target === 'save' && found.runeEffect.bonus) {
                activeSaveBonus = Math.max(activeSaveBonus, Number(found.runeEffect.bonus) || 0);
            }
        });

        const rawName = String(hero.stats[`item${i}Name`] || '').trim();
        const qty = Number(hero.stats[`item${i}Qty`]) || 0;
        if (!rawName || qty <= 0) continue;

        const cleanName = rawName.replace(/^[^\p{L}\p{N}]+/u, '').trim().toLowerCase().replace(/ё/g, 'е');
        const found = PF2E_ITEMS_CATALOG.find(it => {
            const target = it.name.replace(/^[^\p{L}\p{N}]+/u, '').trim().toLowerCase().replace(/ё/g, 'е');
            return target === cleanName || (cleanName.length > 3 && target.includes(cleanName));
        });

        if (!found) continue;
        const reqLvl = getItemLevel(found);
        if (reqLvl > currentHeroLvl) continue; // Предмет не по уровню — пропускаем бонус

        if (found.skillBonus && found.skillBonus.skill) {
            const sk = found.skillBonus.skill;
            activeSkillBonuses[sk] = Math.max(activeSkillBonuses[sk] || 0, Number(found.skillBonus.bonus) || 0);
        }
        if (found.runeEffect && found.runeEffect.target === 'save' && found.runeEffect.bonus) {
            activeSaveBonus = Math.max(activeSaveBonus, Number(found.runeEffect.bonus) || 0);
        }
    }

    hero.stats.skillItemBonuses = activeSkillBonuses;
    if (activeSaveBonus > 0 || hero.stats.saveItemBonus) {
        hero.stats.saveItemBonus = activeSaveBonus;
    }


    // Внимание и спасброски
    const charWis = parseInt(overlay.querySelector('[data-sheet-num="wis"]')?.value, 10) || 0;
    const charCon = parseInt(overlay.querySelector('[data-sheet-num="con"]')?.value, 10) || 0;
    const charDex = parseInt(overlay.querySelector('[data-sheet-num="dex"]')?.value, 10) || 0;
    const charInt = parseInt(overlay.querySelector('[data-sheet-num="int"]')?.value, 10) || 0;
    const charCha = parseInt(overlay.querySelector('[data-sheet-num="cha"]')?.value, 10) || 0;

    const profPerc = parseInt(overlay.querySelector('[data-sheet-num="saveProf_perc"]')?.value, 10) || 0;
    const profFort = parseInt(overlay.querySelector('[data-sheet-num="saveProf_fort"]')?.value, 10) || 0;
    const profRef = parseInt(overlay.querySelector('[data-sheet-num="saveProf_ref"]')?.value, 10) || 0;
    const profWill = parseInt(overlay.querySelector('[data-sheet-num="saveProf_will"]')?.value, 10) || 0;

    const saveItem = Number(hero.stats.saveItemBonus) || 0;

    const saves = [
        ['perception', 'perc', charWis + profPerc],
        ['fortitude', 'fort', charCon + profFort + saveItem],
        ['reflex', 'ref', charDex + profRef + saveItem],
        ['will', null, charWis + profWill + saveItem]
    ];

    saves.forEach(([fullKey, shortKey, val]) => {
        const el = overlay.querySelector(`[data-sheet-num="${fullKey}"]`);
        if (el) el.value = val;
        hero.stats[fullKey] = val;
        if (shortKey) hero.stats[shortKey] = val;
    });

    // Авторасчет всех 17 навыков
    const skillToAttrMap = {
        acrobatics: charDex, athletics: charStr, thievery: charDex, stealth: charDex,
        survival: charWis, medicine: charWis, nature: charWis, religion: charWis,
        diplomacy: charCha, intimidation: charCha, deception: charCha,
        arcana: charInt, occultism: charInt, society: charInt, crafting: charInt,
        lore: charInt, performance: charCha
    };

    const penaltySkills = ['acrobatics', 'athletics', 'stealth', 'thievery'];

    Object.entries(skillToAttrMap).forEach(([skillKey, attrModifier]) => {
        const totalInp = overlay.querySelector(`[data-sheet-num="${skillKey}"]`);
        const profInp = overlay.querySelector(`[data-sheet-num="prof_${skillKey}"]`);
        if (!totalInp || !profInp) return;

        const profValue = parseInt(profInp.value, 10) || 0;
        const itemBonus = Number(hero.stats.skillItemBonuses?.[skillKey]) || 0;
        let finalSkillVal = attrModifier + profValue + itemBonus;
        const hasActivePenalty = penaltySkills.includes(skillKey) && activePenalty > 0;

        if (hasActivePenalty) finalSkillVal -= activePenalty;

        totalInp.value = finalSkillVal;
        hero.stats[skillKey] = finalSkillVal;

        const shortKey = FULL_TO_SHORT_SKILL_MAP[skillKey];
        if (shortKey) hero.stats[shortKey] = finalSkillVal;

        const itemStr = itemBonus > 0 ? `, Предмет: +${itemBonus}` : '';

        if (hasActivePenalty) {
            totalInp.style.color = '#ff7675';
            totalInp.title = `Штраф брони активен! (База: ${attrModifier + profValue}${itemStr}, Штраф: -${activePenalty})`;
        } else if (profValue > 0 || itemBonus > 0) {
            totalInp.style.color = '#2ecc71';
            totalInp.title = `Бонус активен! (Характеристика: ${attrModifier}, Умение: +${profValue}${itemStr})`;
        } else {
            totalInp.style.color = '';
            totalInp.title = `Не изучен (Только модификатор характеристики: ${attrModifier})`;
        }
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

    const ancObj = (PF2E_ANCESTRIES || []).find(a => ancName && (norm(a.name) === ancName || norm(a.name).includes(ancName) || ancName.includes(norm(a.name))));
    const clsObj = (PF2E_CLASSES || []).find(c => clsName && (norm(c.name) === clsName || norm(c.name).includes(clsName) || clsName.includes(norm(c.name))));

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
