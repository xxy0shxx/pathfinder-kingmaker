import { PF2E_SHEET_CONFIG, ensureCharacterStats } from './bestiary_config.js';

const esc = (v) => String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const fmtMod = (v) => {
    const n = Number(v) || 0;
    return n >= 0 ? `+${n}` : `${n}`;
};

const profBoxes = (prof) => {
    const p = Number(prof) || 0;
    const isT = p >= 2;
    const isE = p >= 4;
    return `<span class="prof-wrap"><span class="pbox ${isT ? 'on' : ''}">И</span><span class="pbox ${isE ? 'on' : ''}">Э</span></span>`;
};

export function exportCharacterToPdf(hero) {
    if (!hero) return;
    const s = ensureCharacterStats(hero);
    const name = hero.name || 'Безымянный герой';

    const feat1 = [s.classFeatLvl1Name, s.classFeatLvl1Desc].filter(Boolean).join(' — ');
    const feat2 = [s.classFeatLvl2Name, s.classFeatLvl2Desc].filter(Boolean).join(' — ');
    const higherLevels = new Array(4, 6, 8, 10, 12, 14, 16, 18, 20);
    const otherFeats = higherLevels
        .map(l => s[`classFeatLvl${l}Name`] ? `[${l} ур.] ${s[`classFeatLvl${l}Name`]}${s[`classFeatLvl${l}Desc`] ? ': ' + s[`classFeatLvl${l}Desc`] : ''}` : '')
        .filter(Boolean)
        .join('; ');

    const penaltySkills = ['acrobatics', 'athletics', 'stealth', 'thievery'];
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

    const renderSpellRows = (prefix, count, hasReady = true) => {
        let rows = '';
        for (let i = 1; i <= count; i++) {
            const spName = s[`${prefix}${i}Name`] || '';
            const spAct = s[`${prefix}${i}Actions`] || '';
            const spNotes = s[`${prefix}${i}Notes`] || '';
            const ready = hasReady ? !!s[`${prefix}${i}Ready`] : false;
            const text = [spName, spAct ? `(${spAct})` : '', spNotes].filter(Boolean).join(' ');
            rows += `
            <div class="spell-line">
                ${hasReady ? `<span class="chk ${ready ? 'on' : ''}">${ready ? '✓' : ''}</span>` : `<span class="idx-num">${i}.</span>`}
                <div class="line-val">${esc(text)}</div>
            </div>`;
        }
        return rows;
    };

    let itemsHtml = '';
    for (let i = 1; i <= 15; i++) {
        const itName = s[`item${i}Name`] || '';
        const itQty = Number(s[`item${i}Qty`]) || 1;
        const itNotes = s[`item${i}Notes`] || '';
        const fullItem = itName ? `${itName}${itQty > 1 ? ` (×${itQty})` : ''}${itNotes ? ` — ${itNotes}` : ''}` : itNotes;
        itemsHtml += `
        <div class="item-row">
            <div class="item-main">${esc(fullItem)}</div>
            <div class="item-qty">${itName ? `×${itQty}` : ''}</div>
        </div>`;
    }

    const compBlock = (s.compType && s.compType !== 'none') || s.compName
        ? `[СПУТНИК: ${s.compName || 'Спутник'} | ПЗ: ${s.compHpCur ?? 0}/${s.compHpMax ?? 0} | КБ: ${s.compAc ?? 10} | Скор.: ${s.compSpeed ?? 25} фт.]\n${s.compAbilitiesText || ''}`
        : '';

    const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>${esc(name)} — Бланк персонажа PF2e</title>
<style>
    @page { size: A4 portrait; margin: 6mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { margin: 0; padding: 0; font-family: "Segoe UI", Arial, sans-serif; font-size: 8.5pt; color: #1a1a1a; background: #fff; }
    .page { width: 198mm; height: 284mm; margin: 0 auto; page-break-after: always; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; }
    .page:last-child { page-break-after: auto; }
    .hdr { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2.5px solid #5e1914; padding-bottom: 4px; margin-bottom: 5px; }
    .logo-title { font-size: 16pt; font-weight: 900; color: #5e1914; letter-spacing: 0.5px; line-height: 1; }
    .logo-sub { font-size: 7pt; font-weight: 700; color: #fff; background: #2d4739; padding: 1px 6px; display: inline-block; margin-top: 2px; }
    .hdr-center { flex: 1; margin: 0 10px; }
    .hdr-field { border-bottom: 1.5px solid #333; font-size: 11pt; font-weight: 700; min-height: 18px; padding: 0 4px; }
    .hdr-lbl { font-size: 6.5pt; font-weight: 800; color: #5e1914; text-transform: uppercase; }
    .hdr-right { display: flex; gap: 6px; align-items: center; }
    .lvl-box { border: 2px solid #5e1914; border-radius: 4px; width: 42px; text-align: center; padding: 2px; }
    .lvl-box .val { font-size: 13pt; font-weight: 900; }
    .sec { border: 1.5px solid #2b2b2b; border-radius: 4px; margin-bottom: 5px; background: #fff; }
    .sec-hdr { background: #1e242b; color: #fff; font-weight: 800; font-size: 7.5pt; padding: 2px 6px; display: flex; align-items: center; gap: 5px; text-transform: uppercase; letter-spacing: 0.3px; }
    .badge { background: #e6b84c; color: #1a1a1a; border-radius: 50%; width: 14px; height: 14px; display: inline-flex; align-items: center; justify-content: center; font-weight: 900; font-size: 7.5pt; flex-shrink: 0; }
    .sec-body { padding: 4px 6px; }
    .row { display: flex; gap: 6px; }
    .col-left { width: 44%; display: flex; flex-direction: column; }
    .col-right { width: 56%; display: flex; flex-direction: column; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px; }
    .field-line { border-bottom: 1px solid #666; min-height: 15px; font-weight: 600; font-size: 8pt; padding: 1px 3px; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .field-multi { border: 1px solid #bbb; border-radius: 3px; padding: 3px 4px; font-size: 7.3pt; line-height: 1.25; min-height: 28px; background: #fafafa; overflow: hidden; }
    .box { border: 1.5px solid #2b2b2b; border-radius: 3px; display: inline-flex; align-items: center; justify-content: center; background: #fff; font-weight: 700; }
    .box-lg { width: 38px; height: 26px; font-size: 11pt; border-color: #5e1914; }
    .box-sm { width: 26px; height: 18px; font-size: 8.5pt; }
    .box-xs { width: 21px; height: 16px; font-size: 7.5pt; border-width: 1px; }
    .box-sub { display: inline-flex; flex-direction: column; align-items: center; font-size: 5.5pt; font-weight: 700; color: #444; line-height: 1.1; }
    .bold { font-weight: 900; }
    .prof-wrap { display: inline-flex; gap: 1px; }
    .pbox { width: 12px; height: 14px; border: 1px solid #333; font-size: 6.5pt; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; color: #777; }
    .pbox.on { background: #5e1914; color: #fff; border-color: #5e1914; }
    .stat-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e0e0e0; padding: 2px 0; }
    .stat-name { font-weight: 800; font-size: 7.5pt; }
    .skill-row { display: flex; align-items: center; gap: 3px; border-bottom: 1px solid #ececec; padding: 1.5px 0; }
    .skill-name { width: 82px; font-weight: 800; font-size: 7pt; }
    .eq, .op { font-weight: 800; font-size: 7.5pt; color: #555; }
    .pen-spacer { width: 32px; }
    .wpn-card { border: 1px solid #999; border-radius: 3px; padding: 3px 5px; margin-bottom: 4px; background: #fcfcfc; }
    .wpn-top { display: flex; justify-content: space-between; align-items: center; gap: 4px; margin-bottom: 2px; }
    .wpn-title { flex: 1; border-bottom: 1px solid #444; font-weight: 800; font-size: 8pt; }
    .wpn-sub { display: flex; justify-content: space-between; font-size: 7.2pt; color: #333; }
    .spell-line { display: flex; align-items: center; gap: 4px; border-bottom: 1px solid #ccc; min-height: 16px; padding: 1px 0; }
    .chk { width: 11px; height: 11px; border: 1.2px solid #333; display: inline-flex; align-items: center; justify-content: center; font-size: 7pt; font-weight: 900; flex-shrink: 0; }
    .chk.on { background: #2d4739; color: #fff; }
    .idx-num { width: 12px; font-size: 7pt; font-weight: 700; color: #555; }
    .line-val { font-size: 7.2pt; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; }
    .item-row { display: flex; border-bottom: 1px solid #ccc; min-height: 15.5px; font-size: 7.3pt; align-items: center; }
    .item-main { flex: 1; padding-right: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .item-qty { width: 32px; text-align: right; font-weight: 700; color: #444; border-left: 1px solid #ccc; padding-left: 3px; }
    .notes-box { border: 1px solid #bbb; border-radius: 3px; padding: 4px 5px; font-size: 7.2pt; line-height: 1.3; white-space: pre-wrap; overflow: hidden; background: #fcfcfc; }
    .ftr { font-size: 6.5pt; color: #666; display: flex; justify-content: space-between; border-top: 1px solid #ccc; padding-top: 2px; }
</style>
</head>
<div class="page">
    <div>
        <div class="hdr">
            <div>
                <div class="logo-title">PATHFINDER</div>
                <div class="logo-sub">БЛАНК ПЕРСОНАЖА (2E)</div>
            </div>
            <div class="hdr-center">
                <div class="hdr-lbl">Имя персонажа</div>
                <div class="hdr-field">${esc(name)}</div>
                <div style="display:flex; gap:8px; margin-top:2px;">
                    <div style="flex:1;"><span class="hdr-lbl">Игрок:</span> <b>${esc(s.playerName || '—')}</b></div>
                    <div><span class="hdr-lbl">Мировоззрение:</span> <b>${esc(s.alignment || '—')}</b></div>
                </div>
            </div>
            <div class="hdr-right">
                <div class="lvl-box"><div class="hdr-lbl">УРОВЕНЬ</div><div class="val">${s.level ?? 1}</div></div>
                <div class="lvl-box" style="width:52px;"><div class="hdr-lbl">ОПЫТ</div><div class="val">${s.xp ?? 0}</div></div>
            </div>
        </div>

        <div class="grid-3">
            <div class="sec">
                <div class="sec-hdr"><span class="badge">А</span> Народ</div>
                <div class="sec-body">
                    <div class="field-line">${esc(s.ancestry)}</div>
                    <div class="hdr-lbl">Родословная и способности</div>
                    <div class="field-multi" style="height:46px;">${esc(s.heritage)}</div>
                </div>
            </div>
            <div class="sec">
                <div class="sec-hdr"><span class="badge">Б</span> Происхождение</div>
                <div class="sec-body">
                    <div class="field-line">${esc(s.background)}</div>
                    <div class="hdr-lbl">Способность происхождения</div>
                    <div class="field-multi" style="height:46px;">${esc(s.backgroundFeat)}</div>
                </div>
            </div>
            <div class="sec">
                <div class="sec-hdr"><span class="badge">В</span> Класс</div>
                <div class="sec-body">
                    <div class="field-line">${esc(s.charClass)}</div>
                    <div class="hdr-lbl">Классовые способности</div>
                    <div class="field-multi" style="height:46px;">
                        ${feat1 ? `<div><b>1 ур.:</b> ${esc(feat1)}</div>` : ''}
                        ${feat2 ? `<div><b>2 ур.:</b> ${esc(feat2)}</div>` : ''}
                        ${otherFeats ? `<div>${esc(otherFeats)}</div>` : ''}
                    </div>
                </div>
            </div>
        </div>

        <div class="row" style="flex:1;">
            <div class="col-left">
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

                <div class="sec" style="flex:1;">
                    <div class="sec-hdr"><span class="badge">Ж</span> Навыки</div>
                    <div class="sec-body">
                        ${skillsHtml}
                        <div style="margin-top:4px;">
                            <div class="hdr-lbl">Знания (Lore) и прочие навыки</div>
                            <div class="field-multi" style="min-height:24px;">${esc(s.skillOtherNotes)}</div>
                        </div>
                    </div>
                </div>
            </div>
                        <div class="col-right">
                <div class="row">
                    <div class="sec" style="width:55%;">
                        <div class="sec-hdr"><span class="badge">Д</span> Пункты здоровья</div>
                        <div class="sec-body" style="display:flex; justify-content:space-around; align-items:center;">
                            <div class="box-sub"><div class="box box-lg">${s.hpMax ?? 10}</div><span>МАКСИМУМ</span></div>
                            <div class="box-sub"><div class="box box-lg">${s.hpCurrent ?? 10}</div><span>ТЕКУЩИЕ</span></div>
                            <div class="box-sub"><div class="box box-sm">${s.hpTemp ?? 0}</div><span>ВРЕМ. ПЗ</span></div>
                        </div>
                    </div>
                    <div class="sec" style="width:45%;">
                        <div class="sec-hdr"><span class="badge">Е</span> Скорость</div>
                        <div class="sec-body" style="display:flex; align-items:center; gap:6px;">
                            <div class="box box-lg">${s.speed ?? 25}</div>
                            <div style="font-size:6.8pt; line-height:1.15;"><b>ФУТОВ</b><br>Переместитесь на значение скорости.</div>
                        </div>
                    </div>
                </div>

                <div class="sec">
                    <div class="sec-hdr"><span class="badge">З</span> Внимание</div>
                    <div class="sec-body" style="display:flex; align-items:center; gap:5px;">
                        <div class="box box-lg">${fmtMod(s.perception)}</div>
                        <span class="eq">=</span>
                        <div class="box-sub"><div class="box box-xs">${fmtMod(s.wis)}</div><span>МДР</span></div>
                        <span class="op">+</span>
                        <div class="box-sub"><div class="box box-xs">${s.saveProf_perc ?? 0}</div><span>УМЕНИЕ</span></div>
                        ${profBoxes(s.saveProf_perc)}
                        <div style="flex:1; border-left:1px solid #ccc; padding-left:5px; font-size:7pt;">
                            <b>Восприятие:</b> ${esc(s.perceptionNotes || '—')}
                        </div>
                    </div>
                </div>

                <div class="sec">
                    <div class="sec-hdr"><span class="badge">И</span> Испытания (Спасброски)</div>
                    <div class="sec-body">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                            <span class="stat-name" style="width:72px;">СТОЙКОСТЬ</span>
                            <div class="box box-sm bold">${fmtMod(s.fortitude)}</div>
                            <span class="eq">=</span>
                            <div class="box-sub"><div class="box box-xs">${fmtMod(s.con)}</div><span>ВЫН</span></div>
                            <span class="op">+</span>
                            <div class="box-sub"><div class="box box-xs">${s.saveProf_fort ?? 0}</div><span>УМЕНИЕ</span></div>
                            ${profBoxes(s.saveProf_fort)}
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                            <span class="stat-name" style="width:72px;">РЕАКЦИЯ</span>
                            <div class="box box-sm bold">${fmtMod(s.reflex)}</div>
                            <span class="eq">=</span>
                            <div class="box-sub"><div class="box box-xs">${fmtMod(s.dex)}</div><span>ЛВК</span></div>
                            <span class="op">+</span>
                            <div class="box-sub"><div class="box box-xs">${s.saveProf_ref ?? 0}</div><span>УМЕНИЕ</span></div>
                            ${profBoxes(s.saveProf_ref)}
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span class="stat-name" style="width:72px;">ВОЛЯ</span>
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
                    <div class="sec-hdr"><span class="badge">К</span> Защита и Класс брони</div>
                    <div class="sec-body">
                        <div style="display:flex; align-items:center; gap:5px; margin-bottom:4px;">
                            <div class="box-sub"><div class="box box-lg">${s.ac ?? 10}</div><span>КБ</span></div>
                            <span class="eq">= 10 +</span>
                            <div class="box-sub"><div class="box box-xs">${s.acDex ?? 0}</div><span>ЛВК</span></div>
                            <span class="op">+</span>
                            <div class="box-sub"><div class="box box-xs">${s.acProf ?? 0}</div><span>УМЕНИЕ</span></div>
                            <span class="op">+</span>
                            <div class="box-sub"><div class="box box-xs">${s.acItem ?? 0}</div><span>ПРЕДМЕТ</span></div>
                            <span class="op">+</span>
                            <div class="box-sub"><div class="box box-xs">${s.acOther ?? 0}</div><span>ПРОЧЕЕ</span></div>
                            <div style="border-left:1.5px solid #5e1914; padding-left:5px; margin-left:auto; display:flex; gap:4px; align-items:center;">
                                <div class="box-sub"><div class="box box-sm">+${s.acShieldBonus ?? 0}</div><span>ЩИТ</span></div>
                                <div class="box-sub"><div class="box box-xs">${s.acShieldHardness ?? 0}</div><span>ТВЁРД.</span></div>
                                <div class="box-sub"><div class="box box-xs">${s.acShieldHp ?? 0}</div><span>ПЗ ЩИТА</span></div>
                            </div>
                        </div>
                        <div style="font-size:7.2pt;"><b>Доспех:</b> ${esc(s.armorName || 'Без брони')} (${esc(s.armorType)})</div>
                    </div>
                </div>

                <div class="sec" style="flex:1;">
                    <div class="sec-hdr"><span class="badge">Л</span> Оружие и Атаки</div>
                    <div class="sec-body">
                        <div class="wpn-card">
                            <div class="wpn-top">
                                <span class="hdr-lbl">БЛИЖНИЙ БОЙ 1:</span>
                                <div class="wpn-title">${esc(s.melee1Name)}</div>
                                <div class="box-sub"><div class="box box-sm bold">${esc(s.melee1Atk || '—')}</div><span>АТАКА</span></div>
                            </div>
                            <div class="wpn-sub">
                                <span><b>Урон:</b> ${esc(s.melee1Dmg || '—')}</span>
                                <span><b>Дескр.:</b> ${esc(s.melee1Traits || '—')}</span>
                            </div>
                        </div>

                        <div class="wpn-card">
                            <div class="wpn-top">
                                <span class="hdr-lbl">БЛИЖНИЙ БОЙ 2:</span>
                                <div class="wpn-title">${esc(s.melee2Name)}</div>
                                <div class="box-sub"><div class="box box-sm bold">${esc(s.melee2Atk || '—')}</div><span>АТАКА</span></div>
                            </div>
                            <div class="wpn-sub">
                                <span><b>Урон:</b> ${esc(s.melee2Dmg || '—')}</span>
                                <span><b>Дескр.:</b> ${esc(s.melee2Traits || '—')}</span>
                            </div>
                        </div>

                        <div class="wpn-card">
                            <div class="wpn-top">
                                <span class="hdr-lbl">ДИСТАНЦИОННОЕ:</span>
                                <div class="wpn-title">${esc(s.rangedName)}</div>
                                <div class="box-sub"><div class="box box-sm bold">${esc(s.rangedAtk || '—')}</div><span>АТАКА</span></div>
                            </div>
                            <div class="wpn-sub">
                                <span><b>Урон/Дист.:</b> ${esc(s.rangedDmg || '—')}</span>
                                <span><b>Дескр.:</b> ${esc(s.rangedTraits || '—')}</span>
                            </div>
                        </div>

                        <div style="font-size:7pt; margin-top:2px;"><b>Умения в оружии:</b> ${esc(s.weaponProfNotes || '—')}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="ftr">
        <span><span class="badge">Н</span> <span class="badge">О</span> Снаряжение и заклинания см. на обороте</span>
        <span>Pathfinder 2e Remaster • Страница 1 из 2</span>
    </div>
</div>
<div class="page">
    <div class="row" style="flex:1;">
        <div style="width:52%; display:flex; flex-direction:column;">
            <div class="sec">
                <div class="sec-hdr"><span class="badge">Н</span> Снаряжение и Деньги</div>
                <div class="sec-body">
                    <div style="display:flex; justify-content:flex-end; gap:8px; margin-bottom:4px; align-items:center;">
                        <span class="hdr-lbl">ДЕНЬГИ:</span>
                        <div class="box-sub"><div class="box box-sm">${s.coinsCopper ?? 0}</div><span>ММ</span></div>
                        <div class="box-sub"><div class="box box-sm">${s.coinsSilver ?? 0}</div><span>СМ</span></div>
                        <div class="box-sub"><div class="box box-sm">${s.coinsGold ?? 0}</div><span>ЗМ</span></div>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:6.5pt; font-weight:800; background:#eee; padding:1px 3px;">
                        <span>ПРЕДМЕТЫ</span><span>КОЛ-ВО</span>
                    </div>
                    ${itemsHtml}
                </div>
            </div>

            <div class="sec" style="flex:1;">
                <div class="sec-hdr"><span class="badge">О</span> Сотворение заклинаний</div>
                <div class="sec-body">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; border-bottom:1px solid #ccc; padding-bottom:3px;">
                        <div style="display:flex; align-items:center; gap:3px;">
                            <span class="hdr-lbl">АТАКА ЗАКЛ.:</span>
                            <div class="box box-sm bold">${fmtMod(s.spellAttack)}</div>
                        </div>
                        <div style="display:flex; align-items:center; gap:3px;">
                            <span class="hdr-lbl">СЛ ЗАКЛ.:</span>
                            <div class="box box-sm bold">${s.spellDc ?? 10}</div>
                        </div>
                        <div style="display:flex; align-items:center; gap:3px;">
                            <span class="hdr-lbl">ФП:</span>
                            <div class="box box-xs">${s.focusCurrent ?? 1}/${s.focusMax ?? 1}</div>
                        </div>
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:2px;">
                        <span class="hdr-lbl">ФОКУСЫ</span>
                        <span class="hdr-lbl">В ДЕНЬ: <b>${s.cantripsPerDay ?? 5}</b></span>
                    </div>
                    ${renderSpellRows('cantrip', 5, false)}

                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
                        <span class="hdr-lbl">ФОКАЛЬНЫЕ ЗАКЛИНАНИЯ</span>
                        <span class="hdr-lbl">ПОДГ.</span>
                    </div>
                    ${renderSpellRows('focusSpell', 3, true)}

                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
                        <span class="hdr-lbl">ЗАКЛИНАНИЯ 1 КРУГА</span>
                        <span class="hdr-lbl">ЯЧЕЕК В ДЕНЬ: <b>${s.lvl1PerDay ?? 0}</b></span>
                    </div>
                    ${renderSpellRows('lvl1Spell', 7, false)}

                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
                        <span class="hdr-lbl">ЗАКЛИНАНИЯ 2 КРУГА</span>
                        <span class="hdr-lbl">ЯЧЕЕК В ДЕНЬ: <b>${s.lvl2PerDay ?? 0}</b></span>
                    </div>
                    ${renderSpellRows('lvl2Spell', 5, true)}
                </div>
            </div>
        </div>

        <div style="width:48%; display:flex; flex-direction:column;">
            <div class="sec">
                <div class="sec-hdr"><span class="badge">П</span> Портрет персонажа / Спутник</div>
                <div class="sec-body">
                    <div class="notes-box" style="height:150px;">${esc(compBlock.trim() || 'Место для портрета или краткой сводки спутника.')}</div>
                </div>
            </div>

            <div class="sec">
                <div class="sec-hdr"><span class="badge">Р</span> Журнал приключений</div>
                <div class="sec-body">
                    <div class="notes-box" style="height:115px;">${esc(s.adventureLogText || '')}</div>
                </div>
            </div>

            <div class="sec">
                <div class="sec-hdr"><span class="badge">С</span> Заметки</div>
                <div class="sec-body">
                    <div class="notes-box" style="height:175px;">${esc(s.notesText || '')}</div>
                </div>
            </div>

            <div class="sec" style="flex:1;">
                <div class="sec-hdr"><span class="badge">Т</span> Книга заклинаний и формул</div>
                <div class="sec-body">
                    <div class="notes-box" style="height:170px;">${esc(s.spellbookText || '')}</div>
                </div>
            </div>
        </div>
    </div>

    <div class="ftr">
        <span>${esc(name)} • Уровень ${s.level ?? 1}</span>
        <span>Pathfinder 2e Remaster • Страница 2 из 2</span>
    </div>
</div>

<script>
    window.onload = function() {
        setTimeout(function() { window.print(); }, 250);
    };
</script>
</body>
</html>`;

    const printWin = window.open('', '_blank', 'width=900,height=1100');
    if (!printWin) {
        alert('Разрешите всплывающие окна для экспорта бланка в PDF.');
        return;
    }
    printWin.document.open();
    printWin.document.write(html);
    printWin.document.close();
}
