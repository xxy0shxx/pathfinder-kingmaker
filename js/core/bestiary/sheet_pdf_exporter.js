import { PF2E_SHEET_CONFIG, ensureCharacterStats } from './bestiary_config.js';
import { PF2E_CANTRIPS } from '../../config/cantrips_catalog.js';
import { PF2E_FOCUS_SPELLS } from '../../config/focus_spells_catalog.js';
import { PF2E_SPELLS_LVL1 } from '../../config/spells_lvl1_catalog.js';
import { PF2E_SPELLS_LVL2 } from '../../config/spells_lvl2_catalog.js';
import { PF2E_SPELLS_LVL3 } from '../../config/spells_lvl3_catalog.js';
import { PF2E_ITEMS_CATALOG } from '../../config/items_catalog.js';
import { PF2E_MELEE_WEAPONS, PF2E_RANGED_WEAPONS, getWeaponCritEffect, getWeaponTraitsDetails } from '../../config/weapons_catalog.js';
import { PF2E_ARMOR_CATALOG, getArmorGroupEffect, getArmorTraitsDetails } from '../../config/armor_catalog.js';
import { PF2E_ANCESTRIES, PF2E_CLASSES } from '../../config/meta_catalog.js';
import { PF2E_HERITAGES } from '../../config/heritages_catalog.js';
import { PF2E_BACKGROUNDS } from '../../config/backgrounds_catalog.js';
import * as FeatsMod from '../../config/feats_catalog.js';
import AvatarRegistry from '../../services/avatars/avatar_registry.js';

const esc = (v) => String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const fmtMod = (v) => {
    const n = Number(v) || 0;
    return n >= 0 ? `+${n}` : `${n}`;
};

const norm = (str) => String(str || '')
    .replace(/^[^\p{L}\p{N}]+/u, '')
    .replace(/\([^)]*\)/g, '')
    .trim()
    .toLowerCase()
    .replace(/ё/g, 'е');

const findInCat = (list, query) => {
    const q = norm(query);
    if (!q || !Array.isArray(list)) return null;
    return list.find(x => {
        const n = norm(x.name);
        return n === q || (q.length > 3 && (n.includes(q) || q.includes(n)));
    }) || null;
};

const profBoxes = (prof) => {
    const p = Number(prof) || 0;
    return `<span class="prof-wrap"><span class="pbox ${p >= 2 ? 'on' : ''}">И</span><span class="pbox ${p >= 4 ? 'on' : ''}">Э</span></span>`;
};

const sidebarHtml = (pageNum) => `
    <aside class="pf-sidebar">
        <div class="sb-logo">
            <div class="sb-pf">PATHFINDER</div>
            <div class="sb-sub">СТАРТОВЫЙ НАБОР</div>
        </div>
        <div class="sb-hdr">КОСТИ</div>
        <div class="sb-dice">
            <div class="die-row"><span class="die-shape d4">▲</span><b>d4</b></div>
            <div class="die-row"><span class="die-shape d6">■</span><b>d6</b></div>
            <div class="die-row"><span class="die-shape d8">◆</span><b>d8</b></div>
            <div class="die-row"><span class="die-shape d10">⬟</span><b>d10</b></div>
            <div class="die-row"><span class="die-shape d12">⬢</span><b>d12</b></div>
            <div class="die-row"><span class="die-shape d20">⬣</span><b>d20</b></div>
        </div>
        <div class="sb-hdr">ДЕЙСТВИЯ</div>
        <div class="sb-acts">
            <div class="act-item"><span class="act-sym">◆</span><span>Одно действие</span></div>
            <div class="act-item"><span class="act-sym">◆◆</span><span>Два действия</span></div>
            <div class="act-item"><span class="act-sym">◆◆◆</span><span>Три действия</span></div>
            <div class="act-item"><span class="act-sym">↺</span><span>Ответное действие</span></div>
        </div>
        <div class="sb-hdr">УМЕНИЕ</div>
        <div class="sb-prof">
            <div class="prof-tier"><b>НЕИЗУЧЕННЫЙ</b><span>0</span></div>
            <div class="prof-tier"><b>ИЗУЧЕННЫЙ</b><span>2 + уровень</span></div>
            <div class="prof-tier"><b>ЭКСПЕРТНЫЙ</b><span>4 + уровень</span></div>
        </div>
        <div class="sb-foot">Разрешено копирование для личного использования<br>© Paizo Inc. • Стр. ${pageNum}/2</div>
    </aside>
`;
export function exportCharacterToPdf(hero) {

    if (!hero) return;
    const s = ensureCharacterStats(hero);
    const name = hero.name || 'Безымянный герой';

    const feat1 = [s.classFeatLvl1Name, s.classFeatLvl1Desc].filter(Boolean).join(' — ');
    const feat2 = [s.classFeatLvl2Name, s.classFeatLvl2Desc].filter(Boolean).join(' — ');
    const higherLevels = new Array(4, 6, 8, 10, 12, 14, 16, 18, 20);
    const otherFeats = higherLevels
        .map(l => s[`classFeatLvl${l}Name`] ? `${l} ур.: ${s[`classFeatLvl${l}Name`]}${s[`classFeatLvl${l}Desc`] ? ' (' + s[`classFeatLvl${l}Desc`] + ')' : ''}` : '')
        .filter(Boolean)
        .join(' • ');

    const penaltySkills = new Array('acrobatics', 'athletics', 'stealth', 'thievery');
    const armorPen = Math.abs(Number(s.acArmorPenalty) || 0);
    const statLabels = { str: 'СИЛ', dex: 'ЛВК', con: 'ВЫН', int: 'ИНТ', wis: 'МДР', cha: 'ХАР' };

    const skillsHtml = PF2E_SHEET_CONFIG.skills.map(sk => {
        const cleanName = sk.label.replace(/^[^\p{L}]+/u, '').trim().toUpperCase();
        const total = Number(s[sk.key]) || 0;
        const prof = Number(s[`prof_${sk.key}`]) || 0;
        const statMod = Number(s[sk.stat]) || 0;
        const hasPen = penaltySkills.includes(sk.key);
        return `
        <div class="skill-row">
            <div class="skill-name">${esc(cleanName)}</div>
            ${profBoxes(prof)}
            <span class="eq">=</span>
            <div class="box box-sm bold">${fmtMod(total)}</div>
            <span class="op">+</span>
            <div class="box-sub"><div class="box box-xs">${fmtMod(statMod)}</div><span>${statLabels[sk.stat]}</span></div>
            <span class="op">+</span>
            <div class="box-sub"><div class="box box-xs">${prof}</div><span>УМЕНИЕ</span></div>
            ${hasPen ? `<span class="op">−</span><div class="box-sub"><div class="box box-xs">${armorPen}</div><span>БРОНЯ</span></div>` : '<div class="pen-spacer"></div>'}
        </div>`;
    }).join('');

    const buildRichSpells = (prefix, maxCount, catalog, hasReady = false) => {
        const entries = new Array();
        for (let i = 1; i <= maxCount; i++) {
            const spName = String(s[`${prefix}${i}Name`] || '').trim();
            const spAct = String(s[`${prefix}${i}Actions`] || '').trim();
            const spNotes = String(s[`${prefix}${i}Notes`] || '').trim();
            const ready = hasReady ? !!s[`${prefix}${i}Ready`] : false;
            if (!spName && !spNotes) continue;
            const cat = findInCat(catalog, spName);
            const act = spAct || cat?.actions || '';
            const desc = spNotes || cat?.notes || '';
            entries.push({ idx: i, name: spName || 'Заклинание', act, desc, ready, hasReady });
        }
        if (!entries.length) {
            return `<div class="empty-slot">Слоты не заполнены</div>`;
        }
        return entries.map(e => `
            <div class="rich-entry">
                <div class="re-head">
                    ${e.hasReady ? `<span class="chk ${e.ready ? 'on' : ''}">${e.ready ? '✓' : ''}</span>` : `<span class="re-num">${e.idx}.</span>`}
                    <b class="re-title">${esc(e.name)}</b>
                    ${e.act ? `<span class="re-tag">${esc(e.act)}</span>` : ''}
                </div>
                ${e.desc ? `<div class="re-desc">${esc(e.desc)}</div>` : ''}
            </div>
        `).join('');
    };

    const buildRichItems = () => {
        const entries = new Array();
        for (let i = 1; i <= 15; i++) {
            const itName = String(s[`item${i}Name`] || '').trim();
            const itQty = Number(s[`item${i}Qty`]) || 1;
            const itNotes = String(s[`item${i}Notes`] || '').trim();
            if (!itName && !itNotes) continue;
            const cat = findInCat(PF2E_ITEMS_CATALOG, itName);
            const desc = itNotes || cat?.notes || cat?.desc || '';
            const meta = cat ? new Array(cat.price, cat.bulk ? `Масса ${cat.bulk}` : '').filter(Boolean).join(', ') : '';
            entries.push({ name: itName || 'Предмет', qty: itQty, desc, meta });
        }
        if (!entries.length) {
            return `<div class="empty-slot">Рюкзак пуст</div>`;
        }
        return entries.map(it => `
            <div class="rich-entry">
                <div class="re-head">
                    <b class="re-title">${esc(it.name)}</b>
                    <span class="re-qty">×${it.qty}${it.meta ? ` (${esc(it.meta)})` : ''}</span>
                </div>
                ${it.desc ? `<div class="re-desc">${esc(it.desc)}</div>` : ''}
            </div>
        `).join('');
    };

    const armorObj = findInCat(PF2E_ARMOR_CATALOG, s.armorName);
    const armorGroupEff = armorObj ? getArmorGroupEffect(armorObj.group) : '';
    const armorTraitsText = armorObj
        ? getArmorTraitsDetails(armorObj.traits).map(t => t.desc ? `${t.trait}: ${t.desc}` : t.trait).join(' • ')
        : '';

    const buildWeaponCardHtml = (label, wName, wAtk, wDmg, wTraits, isRanged = false) => {
        const cat = findInCat(isRanged ? PF2E_RANGED_WEAPONS : PF2E_MELEE_WEAPONS, wName);
        const traitsStr = wTraits || cat?.traits || '';
        const critEff = cat ? getWeaponCritEffect(cat.group) : '';
        const traitsExplained = getWeaponTraitsDetails(traitsStr)
            .map(t => t.desc ? `<b>${esc(t.trait)}</b>: ${esc(t.desc)}` : esc(t.trait))
            .join(' • ');

        return `
        <div class="wpn-card">
            <div class="wpn-top">
                <span class="sub-lbl">${label}:</span>
                <div class="wpn-title">${esc(wName)}</div>
                <div class="box-sub"><div class="box box-sm bold">${esc(wAtk || '—')}</div><span>АТАКА</span></div>
            </div>
            <div class="wpn-sub"><span><b>Урон:</b> ${esc(wDmg || '—')}</span><span><b>Дескр.:</b> ${esc(traitsStr || '—')}</span></div>
            ${(critEff || traitsExplained) ? `<div class="wpn-extra">${critEff ? `<span><b>Крит (${esc(cat.group)}):</b> ${esc(critEff)}</span> ` : ''}${traitsExplained ? `<span>${traitsExplained}</span>` : ''}</div>` : ''}
        </div>`;
    };

    const hasComp = (s.compType && s.compType !== 'none') || String(s.compName || '').trim() || String(s.compAbilitiesText || '').trim();
    const compTypeName = s.compType === 'familiar' ? 'Фамильяр' : (s.compType === 'companion' ? 'Верный зверь' : 'Спутник');

    const allFeatsPool = Object.values(FeatsMod).filter(Array.isArray).flat();

    // А. Народ и Наследие
    const ancestryObj = findInCat(PF2E_ANCESTRIES, s.ancestry);
    const heritageObj = findInCat(PF2E_HERITAGES, s.heritage);
    const ancestryFullText = new Array(
        ancestryObj ? `Народ: ${ancestryObj.traits}` : '',
        s.heritage ? `Наследие: ${s.heritage}${heritageObj?.desc ? ' — ' + heritageObj.desc : ''}` : ''
    ).filter(Boolean).join('\n');

    // Б. Происхождение и Черта происхождения
    const bgObj = findInCat(PF2E_BACKGROUNDS, s.background);
    const bgFeatText = s.backgroundFeat || bgObj?.feat || '';
    const bgFullText = new Array(
        bgFeatText ? `Черта: ${bgFeatText}` : '',
        bgObj ? `${bgObj.desc} (Навык: ${bgObj.skillName}, Знание: ${bgObj.lore})` : ''
    ).filter(Boolean).join('\n');


    // В. Класс, Действия и Классовые способности
    const classObj = findInCat(PF2E_CLASSES, s.charClass);
    const allLevels = new Array(1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20);
    const classFeatsLines = allLevels.map(lvl => {
        const fName = String(s[`classFeatLvl${lvl}Name`] || '').trim();
        let fDesc = String(s[`classFeatLvl${lvl}Desc`] || '').trim();
        if (!fName && !fDesc) return '';
        if (!fDesc && fName) {
            const catFeat = findInCat(allFeatsPool, fName);
            if (catFeat?.desc) fDesc = catFeat.desc;
        }
        return `${lvl} ур.: ${fName}${fDesc ? ' — ' + fDesc : ''}`;
    }).filter(Boolean);

    const actionLines = new Array(1, 2, 3).map(i => {
        const aName = String(s[`actionSlot${i}Name`] || '').trim();
        const aDesc = String(s[`actionSlot${i}Desc`] || '').trim();
        return aName ? `⚡ ${aName}${aDesc ? ' — ' + aDesc : ''}` : '';
    }).filter(Boolean);

    const classFullText = new Array(
        classObj ? `Класс (${classObj.hp} ПЗ/ур., ${classObj.keyStat}): ${classObj.desc}` : '',
        ...actionLines,
        ...classFeatsLines
    ).filter(Boolean).join('\n');

    const avatarId = hero.avatarType || AvatarRegistry.guessAvatarByName(name) || AvatarRegistry.guessAvatarByName(s.charClass);
    const portraitUrl = hero.avatarUrl || hero.img || (avatarId ? AvatarRegistry.getAvatarDataUrl(avatarId) : '');

    const compSummaryForNotes = hasComp
        ? `🐾 ${compTypeName.toUpperCase()}: ${s.compName || 'Без имени'} (ПЗ: ${s.compHpCur ?? 0}/${s.compHpMax ?? 0} | КБ: ${s.compAc ?? 10} | Скор.: ${s.compSpeed ?? 25} фт.)\n${s.compAbilitiesText || ''}`
        : '';

    const fullNotesWithComp = new Array(compSummaryForNotes, String(s.notesText || '').trim())
        .filter(Boolean)
        .join('\n\n');

    const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>${esc(name)} — Бланк персонажа PF2e</title>
<style>
    @page { size: A4 portrait; margin: 4mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { margin: 0; padding: 0; font-family: "Segoe UI", Arial, sans-serif; font-size: 8pt; color: #1a1a1a; background: #fff; }
    .page { width: 202mm; height: 288mm; margin: 0 auto; page-break-after: always; display: flex; gap: 4px; overflow: hidden; background: #fff; }
    .page:last-child { page-break-after: auto; }
    .pf-sidebar { width: 23mm; background: #f4efe6; border: 1.5px solid #5e1914; border-radius: 4px; display: flex; flex-direction: column; justify-content: space-between; padding: 3px; text-align: center; flex-shrink: 0; }
    .sb-pf { font-size: 8.5pt; font-weight: 900; color: #5e1914; letter-spacing: 0.2px; }
    .sb-sub { font-size: 5.5pt; font-weight: 800; background: #2d4739; color: #fff; padding: 1px 2px; border-radius: 2px; margin-top: 1px; }
    .sb-hdr { background: #5e1914; color: #fff; font-size: 6.5pt; font-weight: 800; padding: 1.5px 0; border-radius: 2px; margin: 2px 0; letter-spacing: 0.3px; }
    .die-row { display: flex; align-items: center; justify-content: center; gap: 4px; font-size: 7.5pt; margin: 1.5px 0; }
    .die-shape { font-size: 11pt; line-height: 1; }
    .d4 { color: #d4a017; } .d6 { color: #7f5a83; } .d8 { color: #2e8b57; } .d10 { color: #2b6cb0; } .d12 { color: #c05621; } .d20 { color: #9b2c2c; }
    .act-item { display: flex; flex-direction: column; align-items: center; font-size: 6pt; line-height: 1.1; margin: 2px 0; }
    .act-sym { font-size: 8.5pt; font-weight: 900; color: #1a1a1a; }
    .prof-tier { border-bottom: 1px solid #d6cbb8; padding: 2px 0; font-size: 5.5pt; line-height: 1.15; }
    .prof-tier b { display: block; color: #5e1914; }
    .prof-tier span { font-weight: 700; font-size: 6.5pt; }
    .sb-foot { font-size: 4.8pt; color: #555; line-height: 1.15; }
    .main-area { flex: 1; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; }
    .top-banner { display: flex; align-items: stretch; gap: 5px; margin-bottom: 4px; }
    .name-ribbon { flex: 1.4; background: #1e242b; color: #fff; border-radius: 4px; padding: 3px 7px; display: flex; flex-direction: column; justify-content: center; border-left: 4px solid #e6b84c; }
    .name-ribbon .lbl { font-size: 6pt; color: #e6b84c; font-weight: 800; text-transform: uppercase; }
    .name-ribbon .val { font-size: 11.5pt; font-weight: 900; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .meta-stack { flex: 1; display: flex; flex-direction: column; justify-content: space-between; gap: 2px; }
    .meta-line { border: 1px solid #444; border-radius: 3px; padding: 1.5px 5px; font-size: 7pt; background: #faf8f5; }
    .sheet-badge { text-align: right; display: flex; flex-direction: column; justify-content: space-between; }
    .sheet-title { font-size: 9.5pt; font-weight: 900; color: #1e242b; letter-spacing: 0.3px; }
    .lvl-row { display: flex; gap: 4px; justify-content: flex-end; }
    .lvl-box { border: 1.8px solid #5e1914; border-radius: 4px; padding: 1px 5px; text-align: center; background: #fff; }
    .lvl-box .lbl { font-size: 5.5pt; font-weight: 800; color: #5e1914; }
    .lvl-box .val { font-size: 11pt; font-weight: 900; }
    .sec { border: 1.5px solid #2b2b2b; border-radius: 4px; margin-bottom: 4px; background: #fff; display: flex; flex-direction: column; }
    .sec-hdr { background: #1e242b; color: #fff; font-weight: 800; font-size: 7pt; padding: 2px 5px; display: flex; align-items: center; gap: 4px; text-transform: uppercase; }
    .sec-hdr.red { background: #5e1914; }
    .sec-hdr.green { background: #2d4739; }
    .badge { background: #e6b84c; color: #1a1a1a; border-radius: 50%; width: 13px; height: 13px; display: inline-flex; align-items: center; justify-content: center; font-weight: 900; font-size: 7pt; flex-shrink: 0; }
    .sec-body { padding: 3px 5px; flex: 1; display: flex; flex-direction: column; }
    .row { display: flex; gap: 4px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4px; }
    .field-line { border-bottom: 1.2px solid #444; min-height: 14px; font-weight: 800; font-size: 7.8pt; padding: 0 2px; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .sub-lbl { font-size: 5.5pt; font-weight: 800; color: #5e1914; text-transform: uppercase; }
    .fit-box { border: 1px solid #cbbba0; border-radius: 3px; padding: 2px 4px; font-size: 6.8pt; line-height: 1.2; background: #fcfaf6; overflow: hidden; flex: 1; }
    .box { border: 1.5px solid #2b2b2b; border-radius: 3px; display: inline-flex; align-items: center; justify-content: center; background: #fff; font-weight: 800; }
    .box-lg { width: 34px; height: 24px; font-size: 10.5pt; border-color: #5e1914; }
    .box-sm { width: 24px; height: 16px; font-size: 8pt; }
    .box-xs { width: 19px; height: 14px; font-size: 7pt; border-width: 1px; }
    .box-sub { display: inline-flex; flex-direction: column; align-items: center; font-size: 5pt; font-weight: 800; color: #444; line-height: 1.05; }
    .bold { font-weight: 900; }
    .prof-wrap { display: inline-flex; gap: 1px; }
    .pbox { width: 11px; height: 13px; border: 1px solid #333; font-size: 6pt; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; color: #888; }
    .pbox.on { background: #5e1914; color: #fff; border-color: #5e1914; }
    .stat-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5dfd3; padding: 1.5px 0; }
    .stat-name { font-weight: 800; font-size: 7pt; }
    .skill-row { display: flex; align-items: center; gap: 2.5px; border-bottom: 1px solid #eee8dc; padding: 1px 0; }
    .skill-name { width: 74px; font-weight: 800; font-size: 6.5pt; }
    .eq, .op { font-weight: 800; font-size: 7pt; color: #555; }
    .pen-spacer { width: 29px; }
    .wpn-card { border: 1px solid #8c7b65; border-radius: 3px; padding: 2.5px 4px; margin-bottom: 3px; background: #fcfaf6; }
    .wpn-top { display: flex; justify-content: space-between; align-items: center; gap: 4px; margin-bottom: 1.5px; }
    .wpn-title { flex: 1; border-bottom: 1px solid #333; font-weight: 800; font-size: 7.5pt; }
    .wpn-sub { display: flex; justify-content: space-between; font-size: 6.6pt; color: #222; }
    .wpn-extra { font-size: 5.5pt; color: #444; line-height: 1.15; margin-top: 1.5px; border-top: 1px dashed #d6cbb8; padding-top: 1px; }
    .rich-list { display: flex; flex-direction: column; gap: 2.5px; overflow: hidden; }
    .rich-entry { border-bottom: 1px dashed #cbbba0; padding-bottom: 2px; }
    .rich-entry:last-child { border-bottom: none; padding-bottom: 0; }
    .re-head { display: flex; align-items: center; gap: 3px; line-height: 1.15; }
    .re-title { font-size: 7pt; color: #1e242b; }
    .re-tag { font-size: 6pt; background: #eee6d8; border: 1px solid #cbbba0; border-radius: 2px; padding: 0 3px; font-weight: 700; margin-left: auto; white-space: nowrap; }
    .re-qty { font-size: 6.3pt; font-weight: 800; color: #5e1914; margin-left: auto; white-space: nowrap; }
    .re-desc { font-size: 6.3pt; color: #333; line-height: 1.18; margin-top: 1px; }
    .chk { width: 10px; height: 10px; border: 1px solid #333; display: inline-flex; align-items: center; justify-content: center; font-size: 6.5pt; font-weight: 900; flex-shrink: 0; }
    .chk.on { background: #2d4739; color: #fff; }
    .re-num { font-size: 6.5pt; font-weight: 800; color: #5e1914; }
    .empty-slot { font-size: 6.5pt; color: #888; font-style: italic; padding: 1px 0; }
    .tier-bar { background: #eee6d8; padding: 1.5px 4px; font-size: 6.5pt; font-weight: 800; color: #5e1914; display: flex; justify-content: space-between; border-radius: 2px; margin: 3px 0 2px 0; }
    .notes-fill { border: 1px solid #cbbba0; border-radius: 3px; padding: 3px 5px; font-size: 6.8pt; line-height: 1.22; white-space: pre-wrap; background: #fcfaf6; flex: 1; overflow: hidden; }
</style>
</head>
<body>
<div class="page">
    ${sidebarHtml(1)}
    <div class="main-area">
        <div>
            <div class="top-banner">
                <div class="name-ribbon">
                    <div class="lbl">Имя персонажа</div>
                    <div class="val">${esc(name)}</div>
                </div>
                <div class="meta-stack">
                    <div class="meta-line"><span class="sub-lbl">Игрок:</span> <b>${esc(s.playerName || '—')}</b></div>
                    <div class="meta-line"><span class="sub-lbl">Мировоззрение:</span> <b>${esc(s.alignment || '—')}</b></div>
                </div>
                <div class="sheet-badge">
                    <div class="sheet-title">БЛАНК ПЕРСОНАЖА</div>
                    <div class="lvl-row">
                        <div class="lvl-box"><div class="lbl">УРОВЕНЬ</div><div class="val">${s.level ?? 1}</div></div>
                        <div class="lvl-box"><div class="lbl">ОПЫТ</div><div class="val">${s.xp ?? 0}</div></div>
                    </div>
                </div>
            </div>



            <div class="grid-3">
                <div class="sec">
                    <div class="sec-hdr red"><span class="badge">А</span> Народ</div>
                    <div class="sec-body">
                        <div class="field-line">${esc(s.ancestry)}</div>
                        <div class="sub-lbl">Родословная и особенности народа</div>
                        <div class="fit-box" style="height: 58px; white-space: pre-line;">${esc(ancestryFullText || '—')}</div>
                    </div>
                </div>
                <div class="sec">
                    <div class="sec-hdr red"><span class="badge">Б</span> Происхождение</div>
                    <div class="sec-body">
                        <div class="field-line">${esc(s.background)}</div>
                        <div class="sub-lbl">Способность и описание происхождения</div>
                        <div class="fit-box" style="height: 58px; white-space: pre-line;">${esc(bgFullText || '—')}</div>
                    </div>
                </div>
                <div class="sec">
                    <div class="sec-hdr red"><span class="badge">В</span> Класс</div>
                    <div class="sec-body">
                        <div class="field-line">${esc(s.charClass)}</div>
                        <div class="sub-lbl">Классовые способности и черты</div>
                        <div class="fit-box" style="height: 58px; white-space: pre-line;">${esc(classFullText || '—')}</div>
                    </div>
                </div>
            </div>

            
            
            
        </div>

        <div class="row" style="flex: 1;">
            <div style="width: 44%; display: flex; flex-direction: column;">
                <div class="sec">
                    <div class="sec-hdr"><span class="badge">Г</span> Модификаторы характеристик</div>
                    <div class="sec-body">
                        <div class="stat-row"><span class="stat-name">СИЛА (СИЛ)</span><div class="box box-sm bold">${fmtMod(s.str)}</div></div>
                        <div class="stat-row"><span class="stat-name">ЛОВКОСТЬ (ЛВК)</span><div class="box box-sm bold">${fmtMod(s.dex)}</div></div>
                        <div class="stat-row"><span class="stat-name">ВЫНОСЛИВОСТЬ (ВЫН)</span><div class="box box-sm bold">${fmtMod(s.con)}</div></div>
                        <div class="stat-row"><span class="stat-name">ИНТЕЛЛЕКТ (ИНТ)</span><div class="box box-sm bold">${fmtMod(s.int)}</div></div>
                        <div class="stat-row"><span class="stat-name">МУДРОСТЬ (МДР)</span><div class="box box-sm bold">${fmtMod(s.wis)}</div></div>
                        <div class="stat-row" style="border:none;"><span class="stat-name">ХАРИЗМА (ХАР)</span><div class="box box-sm bold">${fmtMod(s.cha)}</div></div>
                    </div>
                </div>

                <div class="sec" style="flex: 1; margin-bottom: 0;">
                    <div class="sec-hdr"><span class="badge">Ж</span> Навыки</div>
                    <div class="sec-body">
                        ${skillsHtml}
                        <div style="margin-top: 3px; flex: 1; display: flex; flex-direction: column;">
                            <div class="sub-lbl">Знания (Lore) и прочие навыки</div>
                            <div class="fit-box">${esc(s.skillOtherNotes)}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="width: 56%; display: flex; flex-direction: column;">
                <div class="row">
                    <div class="sec" style="width: 56%;">
                        <div class="sec-hdr red"><span class="badge">Д</span> Пункты здоровья</div>
                        <div class="sec-body" style="display:flex; flex-direction:row; justify-content:space-around; align-items:center;">
                            <div class="box-sub"><div class="box box-lg">${s.hpMax ?? 10}</div><span>МАКСИМУМ</span></div>
                            <div class="box-sub"><div class="box box-lg">${s.hpCurrent ?? 10}</div><span>ТЕКУЩИЕ</span></div>
                            <div class="box-sub"><div class="box box-sm">${s.hpTemp ?? 0}</div><span>ВРЕМ. ПЗ</span></div>
                        </div>
                    </div>
                    <div class="sec" style="width: 44%;">
                        <div class="sec-hdr green"><span class="badge">Е</span> Скорость</div>
                        <div class="sec-body" style="display:flex; flex-direction:row; align-items:center; gap:5px;">
                            <div class="box box-lg">${s.speed ?? 25}</div>
                            <div style="font-size:6.2pt; line-height:1.1;"><b>ФУТОВ</b><br>Переместитесь ◆ на значение скорости.</div>
                        </div>
                    </div>
                </div>

                <div class="sec">
                    <div class="sec-hdr"><span class="badge">З</span> Внимание</div>
                    <div class="sec-body" style="display:flex; flex-direction:row; align-items:center; gap:4px;">
                        <div class="box box-lg">${fmtMod(s.perception)}</div>
                        <span class="eq">=</span>
                        <div class="box-sub"><div class="box box-xs">${fmtMod(s.wis)}</div><span>МДР</span></div>
                        <span class="op">+</span>
                        <div class="box-sub"><div class="box box-xs">${s.saveProf_perc ?? 0}</div><span>УМЕНИЕ</span></div>
                        ${profBoxes(s.saveProf_perc)}
                        <div class="fit-box" style="height: 28px; margin-left: 3px;"><b>Восприятие:</b> ${esc(s.perceptionNotes || '—')}</div>
                    </div>
                </div>

                <div class="sec">
                    <div class="sec-hdr"><span class="badge">И</span> Испытания (Спасброски)</div>
                    <div class="sec-body">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                            <span class="stat-name" style="width:68px;">СТОЙКОСТЬ</span>
                            <div class="box box-sm bold">${fmtMod(s.fortitude)}</div>
                            <span class="eq">=</span>
                            <div class="box-sub"><div class="box box-xs">${fmtMod(s.con)}</div><span>ВЫН</span></div>
                            <span class="op">+</span>
                            <div class="box-sub"><div class="box box-xs">${s.saveProf_fort ?? 0}</div><span>УМЕНИЕ</span></div>
                            ${profBoxes(s.saveProf_fort)}
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                            <span class="stat-name" style="width:68px;">РЕАКЦИЯ</span>
                            <div class="box box-sm bold">${fmtMod(s.reflex)}</div>
                            <span class="eq">=</span>
                            <div class="box-sub"><div class="box box-xs">${fmtMod(s.dex)}</div><span>ЛВК</span></div>
                            <span class="op">+</span>
                            <div class="box-sub"><div class="box box-xs">${s.saveProf_ref ?? 0}</div><span>УМЕНИЕ</span></div>
                            ${profBoxes(s.saveProf_ref)}
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span class="stat-name" style="width:68px;">ВОЛЯ</span>
                            <div class="box box-sm bold">${fmtMod(s.will)}</div>
                            <span class="eq">=</span>
                            <div class="box-sub"><div class="box box-xs">${fmtMod(s.wis)}</div><span>МДР</span></div>
                            <span class="op">+</span>
                            <div class="box-sub"><div class="box box-xs">${s.saveProf_will ?? 0}</div><span>УМЕНИЕ</span></div>
                            ${profBoxes(s.saveProf_will)}
                        </div>
                    </div>
                </div>



                <div class="sec">
                    <div class="sec-hdr red"><span class="badge">К</span> Защита и Класс брони</div>
                    <div class="sec-body">
                        <div style="display:flex; align-items:center; gap:4px; margin-bottom:3px;">
                            <div class="box-sub"><div class="box box-lg">${s.ac ?? 10}</div><span>КБ</span></div>
                            <span class="eq">= 10 +</span>
                            <div class="box-sub"><div class="box box-xs">${s.acDex ?? 0}</div><span>ЛВК</span></div>
                            <span class="op">+</span>
                            <div class="box-sub"><div class="box box-xs">${s.acProf ?? 0}</div><span>УМЕНИЕ</span></div>
                            <span class="op">+</span>
                            <div class="box-sub"><div class="box box-xs">${s.acItem ?? 0}</div><span>ПРЕДМЕТ</span></div>
                            <span class="op">+</span>
                            <div class="box-sub"><div class="box box-xs">${s.acOther ?? 0}</div><span>ПРОЧЕЕ</span></div>
                            <div style="border-left:1.5px solid #5e1914; padding-left:4px; margin-left:auto; display:flex; gap:3px; align-items:center;">
                                <div class="box-sub"><div class="box box-sm">+${s.acShieldBonus ?? 0}</div><span>ЩИТ</span></div>
                                <div class="box-sub"><div class="box box-xs">${s.acShieldHardness ?? 0}</div><span>ТВЁРД.</span></div>
                                <div class="box-sub"><div class="box box-xs">${s.acShieldHp ?? 0}</div><span>ПЗ ЩИТА</span></div>
                            </div>
                        </div>
                        <div style="font-size:6.5pt; line-height:1.15;">
                            <b>Доспех:</b> ${esc(s.armorName || 'Без брони')} (${esc(s.armorType)})
                            ${armorGroupEff ? `<br><span style="color:#2d4739;">${esc(armorGroupEff)}</span>` : ''}
                            ${armorTraitsText ? `<br><span style="color:#444; font-size:5.7pt;">${esc(armorTraitsText)}</span>` : ''}
                        </div>
                    </div>
                </div>

                <div class="sec" style="flex: 1; margin-bottom: 0;">
                    <div class="sec-hdr"><span class="badge">Л</span> Оружие и Атаки</div>
                    <div class="sec-body">
                        ${buildWeaponCardHtml('БЛИЖНИЙ БОЙ 1', s.melee1Name, s.melee1Atk, s.melee1Dmg, s.melee1Traits, false)}
                        ${buildWeaponCardHtml('БЛИЖНИЙ БОЙ 2', s.melee2Name, s.melee2Atk, s.melee2Dmg, s.melee2Traits, false)}
                        ${buildWeaponCardHtml('ДИСТАНЦИОННОЕ', s.rangedName, s.rangedAtk, s.rangedDmg, s.rangedTraits, true)}
                        <div class="fit-box" style="margin-top: 2px;"><b>Умения в оружии:</b> ${esc(s.weaponProfNotes || '—')}</div>
                    </div>
                </div>

                
                
            </div>
        </div>
    </div>
</div>
<div class="page">
    ${sidebarHtml(2)}
    <div class="main-area">
        <div class="row" style="flex: 1; overflow: hidden;">
            <div style="width: 53%; display: flex; flex-direction: column; overflow: hidden;">
                <div class="sec" style="max-height: 36%;">
                    <div class="sec-hdr green"><span class="badge">Н</span> Снаряжение и Деньги</div>
                    <div class="sec-body" style="overflow: hidden;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px; border-bottom:1px solid #d6cbb8; padding-bottom:2px;">
                            <span class="sub-lbl">РЮКЗАК И ОПИСАНИЯ ПРЕДМЕТОВ</span>
                            <div style="display:flex; gap:5px; align-items:center;">
                                <span class="sub-lbl">ДЕНЬГИ:</span>
                                <div class="box-sub"><div class="box box-xs">${s.coinsCopper ?? 0}</div><span>ММ</span></div>
                                <div class="box-sub"><div class="box box-xs">${s.coinsSilver ?? 0}</div><span>СМ</span></div>
                                <div class="box-sub"><div class="box box-xs">${s.coinsGold ?? 0}</div><span>ЗМ</span></div>
                            </div>
                        </div>
                        <div class="rich-list auto-fit-list">${buildRichItems()}</div>
                    </div>
                </div>

                <div class="sec" style="flex: 1; margin-bottom: 0; overflow: hidden;">
                    <div class="sec-hdr red"><span class="badge">О</span> Сотворение заклинаний (с описаниями)</div>
                    <div class="sec-body" style="overflow: hidden;">
                        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #d6cbb8; padding-bottom:2px;">
                            <div style="display:flex; align-items:center; gap:3px;"><span class="sub-lbl">АТАКА ЗАКЛ.:</span><div class="box box-sm bold">${fmtMod(s.spellAttack)}</div></div>
                            <div style="display:flex; align-items:center; gap:3px;"><span class="sub-lbl">СЛ ЗАКЛ.:</span><div class="box box-sm bold">${s.spellDc ?? 10}</div></div>
                            <div style="display:flex; align-items:center; gap:3px;"><span class="sub-lbl">ФП:</span><div class="box box-xs">${s.focusCurrent ?? 1}/${s.focusMax ?? 1}</div></div>
                        </div>

                        <div class="rich-list auto-fit-list" style="flex: 1;">
                            <div class="tier-bar"><span>✨ ФОКУСЫ</span><span>В ДЕНЬ: ${s.cantripsPerDay ?? 5}</span></div>
                            ${buildRichSpells('cantrip', 5, PF2E_CANTRIPS, false)}

                            <div class="tier-bar"><span>💠 ФОКАЛЬНЫЕ ЗАКЛИНАНИЯ</span><span>ПОДГ.</span></div>
                            ${buildRichSpells('focusSpell', 3, PF2E_FOCUS_SPELLS, true)}

                            <div class="tier-bar"><span>1️⃣ ЗАКЛИНАНИЯ 1 КРУГА</span><span>ЯЧЕЕК: ${s.lvl1PerDay ?? 0}</span></div>
                            ${buildRichSpells('lvl1Spell', 7, PF2E_SPELLS_LVL1, false)}

                            <div class="tier-bar"><span>2️⃣ ЗАКЛИНАНИЯ 2 КРУГА</span><span>ЯЧЕЕК: ${s.lvl2PerDay ?? 0}</span></div>
                            ${buildRichSpells('lvl2Spell', 5, PF2E_SPELLS_LVL2, true)}
                            
                            <div class="tier-bar"><span>3️⃣ ЗАКЛИНАНИЯ 3 КРУГА</span><span>ЯЧЕЕК: ${s.lvl3PerDay ?? 0}</span></div>
                            ${buildRichSpells('lvl3Spell', 5, PF2E_SPELLS_LVL3, true)}
                        </div>
                    </div>
                </div>
            </div>

            <div style="width: 47%; display: flex; flex-direction: column; overflow: hidden;">
                <div class="sec" style="height: 26%;">
                    <div class="sec-hdr green"><span class="badge">П</span> Портрет персонажа</div>
                    <div class="sec-body" style="padding: 3px; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #141920;">
                        ${portraitUrl ? `
                            <img src="${portraitUrl}" alt="${esc(name)}" style="height: 100%; aspect-ratio: 1 / 1; max-width: 100%; object-fit: cover; border: 1.5px solid #e6b84c; border-radius: 4px; background: radial-gradient(circle, #2a3441 0%, #141920 100%);">
                        ` : `
                            <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #7f8c8d; font-size: 7pt;">Нет портрета</div>
                        `}
                    </div>
                </div>

                ${hasComp ? `
                <div class="sec" style="height: 20%;">
                    <div class="sec-hdr green"><span class="badge">🐾</span> Спутник (${esc(compTypeName)})</div>
                    <div class="sec-body" style="overflow: hidden;">
                        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #d6cbb8; padding-bottom:2px; margin-bottom:2px;">
                            <b style="font-size:7.3pt; color:#2d4739;">${esc(s.compName || compTypeName)}</b>
                            <span style="font-size:6.3pt; font-weight:800;">ПЗ: ${s.compHpCur ?? 0}/${s.compHpMax ?? 0} | КБ: ${s.compAc ?? 10} | ${s.compSpeed ?? 25} фт.</span>
                        </div>
                        <div class="notes-fill auto-fit-text">${esc(s.compAbilitiesText || 'Способности спутника не указаны.')}</div>
                    </div>
                </div>
                ` : ''}

                <div class="sec" style="flex: 1; min-height: 0;">
                    <div class="sec-hdr"><span class="badge">Р</span> Журнал приключений</div>
                    <div class="sec-body" style="overflow: hidden;">
                        <div class="notes-fill auto-fit-text">${esc(s.adventureLogText || '')}</div>
                    </div>
                </div>

                <div class="sec" style="flex: 1.15; min-height: 0;">
                    <div class="sec-hdr"><span class="badge">С</span> Заметки</div>
                    <div class="sec-body" style="overflow: hidden;">
                        <div class="notes-fill auto-fit-text">${esc(s.notesText || '')}</div>
                    </div>
                </div>

                <div class="sec" style="flex: 1.15; min-height: 0; margin-bottom: 0;">
                    <div class="sec-hdr"><span class="badge">Т</span> Книга заклинаний и формул</div>
                    <div class="sec-body" style="overflow: hidden;">
                        <div class="notes-fill auto-fit-text">${esc(s.spellbookText || '')}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    window.onload = function() {
        document.querySelectorAll('.auto-fit-list, .auto-fit-text, .fit-box').forEach(function(box) {
            var size = parseFloat(window.getComputedStyle(box).fontSize) || 6.5;
            while (box.scrollHeight > box.clientHeight + 1 && size > 3.6) {
                size -= 0.2;
                box.style.fontSize = size + 'pt';
                box.querySelectorAll('.re-title, .re-desc, .re-tag, .re-qty').forEach(function(el) {
                    el.style.fontSize = size + 'pt';
                });
            }
        });
        setTimeout(function() { window.print(); }, 300);
    };
</script>
</body>
</html>`;

    const printWin = window.open('', '_blank', 'width=920,height=1120');
    if (!printWin) {
        alert('Разрешите всплывающие окна для экспорта бланка в PDF.');
        return;
    }
    printWin.document.open();
    printWin.document.write(html);
    printWin.document.close();
}
