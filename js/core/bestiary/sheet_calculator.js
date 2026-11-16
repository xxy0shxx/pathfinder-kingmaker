import { SHORT_TO_FULL_SKILL_MAP } from './bestiary_config.js';

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
