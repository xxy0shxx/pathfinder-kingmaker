import { PF2E_SHEET_CONFIG } from './bestiary_config.js';
import { recalculateSheetStats, recalculateLevelProgression } from './sheet_calculator.js';
import { initPage1Pickers } from './sheet_pickers.js';
import { bindSheetTooltip } from './bestiary_tooltip_builder.js';
import { PF2E_COMPANION_ABILITIES, calcCompanionStats } from '../../config/companions_catalog.js';
import { getWeaponCritEffect, getWeaponTraitsDetails } from '../../config/weapons_catalog.js';
import { getArmorGroupEffect, getArmorTraitsDetails } from '../../config/armor_catalog.js';
import CatalogService from '../../services/catalog_service.js';
import { esc, numInp, txtInp, getMagicTierVisibility } from './sheet_helpers.js';

export function buildPage1Html(stats) {
    const sanctifications = [
        ['', '— Без освящения / Обычный —'],
        ['Святой', '✨😇 Святой (Holy — против нежити и бестий)'],
        ['Нечестивый', '🔥😈 Нечестивый (Unholy — против небожителей)'],
        ['Оба', '⚖️✨🔥 Святой или Нечестивый (по выбору божества)'],
        // Оставляем поддержку старых значений для совместимости со старыми чарниками:
        ...(stats.alignment && !['', 'Святой', 'Нечестивый', 'Оба'].includes(stats.alignment)
            ? [[stats.alignment, `📜 Legacy: ${stats.alignment}`]]
            : [])
    ];

    const alignVal = stats.alignment === 'Н' ? 'ИН' : (stats.alignment || '');

    return `
        <div class="bst-sheet-top-bar">
            <div class="bst-top-field" style="position: relative;">
                <span>🧬 Народ</span>
                <input type="text" data-sheet-txt="ancestry" class="k-inp bst-txt-inp bst-meta-picker-inp" data-meta-type="ancestry" autocomplete="off" placeholder="Человек, Эльф..." value="${esc(stats.ancestry)}">
                <div class="bst-cantrip-dropdown" data-meta-drop="ancestry" style="display: none; z-index: 10000120;"></div>
            </div>
            <div class="bst-top-field" style="position: relative;">
                <span>📜 Происхождение</span>
                <input type="text" data-sheet-txt="background" class="k-inp bst-txt-inp bst-background-picker-inp" autocomplete="off" placeholder="Выберите происхождение..." value="${esc(stats.background)}">
                <div class="bst-cantrip-dropdown" data-bg-drop="1" style="display: none; z-index: 10000120;"></div>
            </div>
            <div class="bst-top-field" style="position: relative;">
                <span>⚔️ Класс</span>
                <input type="text" data-sheet-txt="charClass" class="k-inp bst-txt-inp bst-meta-picker-inp" data-meta-type="class" autocomplete="off" placeholder="Воин, Жрец..." value="${esc(stats.charClass)}">
                <div class="bst-cantrip-dropdown" data-meta-drop="class" style="display: none; z-index: 10000120;"></div>
            </div>
            
            <div class="bst-top-field">
                <span>✨ Освящение (PF2e Remaster)</span>
                <select data-sheet-txt="alignment" class="k-inp" style="background: #040905; border: 1px solid #543e0d; color: #ebd291; padding: 4px; font-weight: bold; width: 100%;">
                    ${sanctifications.map(([val, lbl]) => `<option value="${val}" ${alignVal === val ? 'selected' : ''}>${lbl}</option>`).join('')}
                </select>
            </div>
            
            <div class="bst-top-field bst-narrow" style="min-width: 96px;">
                <span>⭐ Уровень</span>
                <div style="display: flex; align-items: center; gap: 3px;">
                    ${numInp(stats, 'level', 'bst-mini-num')}
                    <button type="button" id="btnRecalcByLevel" class="btn cc" style="padding: 2px 5px; font-size: 11px; flex-shrink: 0;" title="Пересчитать Макс. ПЗ, Атаку и СЛ заклинаний по текущему уровню, народу и классу">🔄</button>
                </div>
            </div>
            <div class="bst-top-field bst-narrow"><span>✨ Опыт</span>${numInp(stats, 'xp', 'bst-mini-num')}</div>
            <div class="bst-top-field"><span>👤 Игрок</span>${txtInp(stats, 'playerName', 'Имя игрока')}</div>
            <div style="position: relative;">
                <label style="font-size: 11px; color: #dfbc6f; display: block; margin-bottom: 2px;">🧬 Способность народа / Наследие</label>
                ${txtInp(stats, 'heritage', '🧬 Родословная и способность народа...')}
            </div>
            
            <div class="bst-top-field" style="position: relative;">
                <span>✨ Способность происхождения</span>
                <input type="text" data-sheet-txt="backgroundFeat" class="k-inp bst-txt-inp bst-bgfeat-picker-inp" autocomplete="off" placeholder="Выберите черту происхождения..." value="${esc(stats.backgroundFeat)}">
                <div class="bst-cantrip-dropdown" data-bgfeat-drop="1" style="display: none; z-index: 10000120;"></div>
            </div>
            <div style="grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 2px;">
                <div class="bst-top-field" style="position: relative;">
                    <span>📜 Указы (Edicts — чему следовать)</span>
                    <input type="text" data-sheet-txt="edicts" class="k-inp bst-txt-inp bst-edicts-picker-inp" autocomplete="off" placeholder="Выберите из списка или впишите свои..." value="${esc(stats.edicts)}">
                    <div class="bst-cantrip-dropdown" data-edicts-drop="1" style="display: none; z-index: 10000120;"></div>
                </div>
                <div class="bst-top-field" style="position: relative;">
                    <span>🚫 Анафема (Anathema — что строго запрещено)</span>
                    <input type="text" data-sheet-txt="anathema" class="k-inp bst-txt-inp bst-anathema-picker-inp" autocomplete="off" placeholder="Выберите из списка или впишите свои..." value="${esc(stats.anathema)}">
                    <div class="bst-cantrip-dropdown" data-anathema-drop="1" style="display: none; z-index: 10000120;"></div>
                </div>
            </div>
        </div>

        <div class="bst-sheet-page1-grid">
            <div class="bst-sheet-col">
                <div class="k-panel" style="margin-bottom: 10px;">
                    <div class="k-sec-title">⚔️ Модификаторы характеристик</div>
                    <div class="bst-stats-2col">
                        ${PF2E_SHEET_CONFIG.attributes.map(a => `
                            <div class="bst-stat-row">
                                <label class="bst-stat-label">${a.label}</label>
                                ${numInp(stats, a.key)}
                            </div>`).join('')}
                    </div>
                </div>
                <div class="k-panel">
                    <div class="k-sec-title">📜 Навыки Pathfinder (Авторасчет)</div>
                    <div class="bst-skills-2col">
                        ${PF2E_SHEET_CONFIG.skills.map(s => `
                            <div class="bst-stat-row" style="margin-bottom: 3px;">
                                <label class="bst-stat-label" style="font-size: 13px;">${s.label}</label>
                                <input type="number" data-sheet-num="${s.key}" class="k-inp bst-stat-inp bst-skill-total-output" style="font-weight: bold;" readonly value="${stats[s.key] ?? 0}">
                                <label style="font-size: 11px; margin-left: 4px; color: #a4b0be;">🏆 Ум: 
                                    <input type="number" data-sheet-num="prof_${s.key}" class="k-inp bst-tiny-num bst-skill-calc-trigger" value="${stats['prof_' + s.key] ?? 0}">
                                </label>
                            </div>`).join('')}
                    </div>
                    <div style="margin-top: 8px;">${txtInp(stats, 'skillOtherNotes', '📝 Прочие навыки / заметки...')}</div>
                </div>
            </div>
            <div class="bst-sheet-col">
                ${buildPage1RightColHtml(stats)}
            </div>
        </div>
    `;
}

function buildPage1RightColHtml(stats) {
    const saves = [
        ['perception', 'saveProf_perc', '👁️ Внимание (Мдр)'],
        ['fortitude', 'saveProf_fort', '🛡️ Стойкость (Вын)'],
        ['reflex', 'saveProf_ref', '⚡ Реакция (Лвк)'],
        ['will', 'saveProf_will', '🧠 Воля (Мдр)']
    ];

    const renderFeatRows = (levels, prefix, kind, color, placeholder, descPlaceholder) => levels.map(lvl => `
        <tr>
            <td class="bst-cantrip-num" style="color: ${color}; font-weight: bold; text-align: center;">${lvl}</td>
            <td style="position: relative;">
                <input type="text" data-sheet-txt="${prefix}${lvl}Name" data-feat-level="${lvl}" data-feat-kind="${kind}" class="k-inp bst-txt-inp ${kind === 'class' ? 'bst-ranger-feat-picker-inp' : 'bst-extra-feat-picker-inp'}" autocomplete="off" placeholder="${placeholder.replace('{lvl}', lvl)}" value="${esc(stats[`${prefix}${lvl}Name`] ?? '')}">
                <div class="bst-cantrip-dropdown" data-feat-drop="${kind}_${lvl}" style="display: none;"></div>
            </td>
            <td>${txtInp(stats, `${prefix}${lvl}Desc`, descPlaceholder)}</td>
        </tr>`).join('');

    return `
        <div class="k-panel" style="margin-bottom: 10px;">
            <div class="k-sec-title">🛡️ Защита, Доспехи и Щит (Калькулятор КБ)</div>
            <div class="bst-vitals-row" style="margin-bottom: 12px;">
                <div class="bst-vital-box"><span>❤️ Макс. ПЗ</span>${numInp(stats, 'hpMax', 'bst-vital-num')}</div>
                <div class="bst-vital-box"><span>🩸 Текущие ПЗ</span>${numInp(stats, 'hpCurrent', 'bst-vital-num')}</div>
                <div class="bst-vital-box"><span>💠 Врем. ПЗ</span>${numInp(stats, 'hpTemp', 'bst-vital-num')}</div>
                <div class="bst-vital-box"><span>👟 Скорость</span>${numInp(stats, 'speed', 'bst-vital-num')}</div>
                <div class="bst-vital-box bst-ac-highlight" style="background: rgba(138, 100, 33, 0.25) !important; border-color: #ffd875 !important;">
                    <span style="color:#ffd875; font-weight:900;">🛡️ ИТОГ КБ</span>
                    <input type="number" data-sheet-num="ac" class="k-inp bst-vital-num" style="color:#ffd875 !important; font-weight:900 !important;" value="${stats.ac ?? 10}" readonly>
                </div>
            </div>
            <div class="bst-ac-breakdown" style="background: rgba(4, 9, 5, 0.85); padding: 12px; border-radius: 6px; border: 2px solid #543e0d; margin-bottom: 12px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom: 1px dashed rgba(138,100,33,0.3); padding-bottom:6px;">
                    <select data-sheet-txt="armorType" class="k-inp bst-armor-calc-trigger" style="width: auto; font-size: 14px; font-weight: bold;">
                        <option value="unarmored" ${stats.armorType === 'unarmored' ? 'selected' : ''}>👕 Ткань / Без брони (Макс Лвк: +5)</option>
                        <option value="light" ${stats.armorType === 'light' ? 'selected' : ''}>🧥 Лёгкая броня (Макс Лвк: +3)</option>
                        <option value="medium" ${stats.armorType === 'medium' ? 'selected' : ''}>🦺 Средняя броня (Макс Лвк: +2)</option>
                        <option value="heavy" ${stats.armorType === 'heavy' ? 'selected' : ''}>🛡️ Тяжёлая броня (Макс Лвк: +1)</option>
                    </select>
                    <div style="position: relative; display: inline-block; margin-left: 8px;">
                        <input type="text" data-sheet-txt="armorName" class="k-inp bst-armor-picker-inp" autocomplete="off" placeholder="📦 Выберите доспех..." style="width: 220px;" value="${esc(stats.armorName ?? '')}">
                        <div class="bst-cantrip-dropdown" data-armor-drop="1" style="display: none; z-index: 10000100;"></div>
                    </div>
                    <label style="color:#ff7675; font-weight:bold; font-size:13px;">⚠️ Штраф брони:
                        <input type="number" data-sheet-num="acArmorPenalty" class="k-inp bst-tiny-num bst-armor-calc-trigger" style="color:#ff7675 !important; border-color:#e74c3c !important; width:55px !important;" value="${stats.acArmorPenalty ?? 0}">
                    </label>
                </div>
                <div style="display:grid; grid-template-columns: auto repeat(4, 1fr); gap: 6px; width:100%; align-items: center; font-size:13px; color:#ebd291;">
                    <span style="font-weight:bold; color:#dfbc6f; font-size:15px;">10 ➕</span>
                    <label>🤸 Лвк:<input type="number" data-sheet-num="acDex" class="k-inp bst-tiny-num bst-armor-calc-trigger" value="${stats.acDex ?? 0}"></label>
                    <label>🎓 Умение:<input type="number" data-sheet-num="acProf" class="k-inp bst-tiny-num bst-armor-calc-trigger" value="${stats.acProf ?? 0}"></label>
                    <label>🧥 Предмет:<input type="number" data-sheet-num="acItem" class="k-inp bst-tiny-num bst-armor-calc-trigger" value="${stats.acItem ?? 0}"></label>
                    <label>➕ Прочее:<input type="number" data-sheet-num="acOther" class="k-inp bst-tiny-num bst-armor-calc-trigger" value="${stats.acOther ?? 0}"></label>
                </div>
            </div>
            <div style="background: rgba(20, 31, 41, 0.9); padding: 12px; border-radius: 6px; border: 2px solid #3498db; display: grid; grid-template-columns: 1.1fr repeat(3, 1fr); gap: 10px; align-items: center;">
                <div><span style="font-size:13px; font-weight:900; color:#74b9ff; display:block;">🛡️ Параметры щита</span><span style="font-size:11px; color:#a4b0be;">(бонус КБ только при поднятии)</span></div>
                <label>➕ Бонус КБ:<input type="number" data-sheet-num="acShieldBonus" class="k-inp bst-tiny-num" style="color:#74b9ff !important;" value="${stats.acShieldBonus ?? 0}"></label>
                <label>💎 Твердость:<input type="number" data-sheet-num="acShieldHardness" class="k-inp bst-tiny-num" style="color:#74b9ff !important;" value="${stats.acShieldHardness ?? 0}"></label>
                <label>❤️ Тек. ПЗ:<input type="number" data-sheet-num="acShieldHp" class="k-inp bst-tiny-num" style="color:#74b9ff !important;" value="${stats.acShieldHp ?? 0}"></label>
            </div>
        </div>
        <div class="k-panel" style="margin-bottom: 10px;">
            <div class="k-sec-title">👁️ Внимание и Испытания (Спасброски)</div>
            <div class="bst-stats-2col">
                ${saves.map(([key, profKey, lbl]) => `
                    <div class="bst-stat-row">
                        <label class="bst-stat-label">${lbl}</label>
                        <input type="number" data-sheet-num="${key}" class="k-inp bst-stat-inp bst-save-total-output" style="color: #ffd875 !important; font-weight: bold;" readonly value="${stats[key] ?? 0}">
                        <label style="font-size:11px; margin-left:6px;">🏆 Умение: <input type="number" data-sheet-num="${profKey}" class="k-inp bst-tiny-num bst-save-calc-trigger" value="${stats[profKey] ?? 0}"></label>
                    </div>`).join('')}
            </div>
            <div style="margin-top: 6px;">${txtInp(stats, 'perceptionNotes', '👀 Восприятие и прочее (сумеречное зрение и т.д.)...')}</div>
        </div>
        <div class="k-panel" style="margin-bottom: 10px;">
            <div class="k-sec-title">🗡️ Оружие и Атаки</div>
            ${['melee1', 'melee2'].map((p, idx) => `
                <div class="bst-weapon-row">
                    <div style="position: relative;">
                        <input type="text" data-sheet-txt="${p}Name" data-weapon-slot="${p}" class="k-inp bst-txt-inp bst-weapon-picker-inp" autocomplete="off" placeholder="⚔️ Ближний бой ${idx + 1}..." value="${esc(stats[`${p}Name`])}">
                        <div class="bst-cantrip-dropdown" data-weapon-drop="${p}" style="display: none;"></div>
                    </div>
                    ${txtInp(stats, `${p}Atk`, '🎯 Атака (+)')}${txtInp(stats, `${p}Dmg`, '💥 Урон')}${txtInp(stats, `${p}Traits`, '🏷️ Дескрипторы')}
                </div>`).join('')}
            <div class="bst-weapon-row">
                <div style="position: relative;">
                    <input type="text" data-sheet-txt="rangedName" class="k-inp bst-txt-inp bst-ranged-picker-inp" autocomplete="off" placeholder="🏹 Дистанционное..." value="${esc(stats.rangedName)}">
                    <div class="bst-cantrip-dropdown" data-ranged-drop="1" style="display: none;"></div>
                </div>
                ${txtInp(stats, 'rangedAtk', '🎯 Атака (+)')}${txtInp(stats, 'rangedDmg', '💥 Урон')}${txtInp(stats, 'rangedTraits', '🏷️ Дескрипторы')}
            </div>
            <div style="margin-top: 6px;">${txtInp(stats, 'weaponProfNotes', '🥋 Умения в оружии...')}</div>
        </div>
        <div class="k-panel" id="bstFeatsTabbedPanel">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px; margin-bottom: 6px;">
                <span style="font-size: 12px; color: #2ecc71; font-weight: bold; text-transform: uppercase;">⚔️ Черты и Боевые Действия</span>
                <div style="display: flex; gap: 4px;">
                    <button type="button" class="btn ok bst-feat-tab-btn" data-feat-tab="class" style="padding: 2px 7px; font-size: 11px;">⚔️ Классовые</button>
                    <button type="button" class="btn cc bst-feat-tab-btn" data-feat-tab="general" style="padding: 2px 7px; font-size: 11px;">🌟 Общие (3–19)</button>
                    <button type="button" class="btn cc bst-feat-tab-btn" data-feat-tab="skill" style="padding: 2px 7px; font-size: 11px;">📚 Навыков (2–20)</button>
                    <button type="button" class="btn cc bst-feat-tab-btn" data-feat-tab="ancestry" style="padding: 2px 7px; font-size: 11px;">🧬 Народа (1–17)</button>
                </div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 8px;">
                ${[1, 2, 3].map(idx => `
                    <div class="bst-action-slot" data-action-slot="${idx}" style="position: relative; background: rgba(4, 9, 5, 0.7); border: 1px solid #2d5a3c; border-radius: 5px; padding: 5px;">
                        <span style="font-size: 10px; color: #2ecc71; font-weight: bold; display: block; margin-bottom: 2px;">⚡ Действие ${idx}</span>
                        <input type="text" data-sheet-txt="actionSlot${idx}Name" data-action-idx="${idx}" class="k-inp bst-txt-inp bst-action-picker-inp" autocomplete="off" placeholder="Град ударов, Удар..." value="${esc(stats[`actionSlot${idx}Name`] ?? '')}">
                        <input type="hidden" data-sheet-txt="actionSlot${idx}Desc" value="${esc(stats[`actionSlot${idx}Desc`] ?? '')}">
                        <div class="bst-cantrip-dropdown" data-action-drop="${idx}" style="display: none; z-index: 10000110;"></div>
                    </div>`).join('')}
            </div>
            <div class="bst-feat-tab-pane" data-feat-pane="class">
                <table class="k-table bst-cantrips-table" style="width: 100%;">
                    <thead><tr><th style="width: 45px; text-align: center;">Ур.</th><th style="width: 35%;">Классовая черта</th><th>Действие и Эффект</th></tr></thead>
                    <tbody>${renderFeatRows([1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20], 'classFeatLvl', 'class', '#2ecc71', 'Черта класса {lvl} ур...', 'Действие, требования, бонус...')}</tbody>
                </table>
            </div>
            <div class="bst-feat-tab-pane" data-feat-pane="general" style="display: none;">
                <table class="k-table bst-cantrips-table" style="width: 100%;">
                    <thead><tr><th style="width: 45px; text-align: center;">Ур.</th><th style="width: 35%;">Общая черта</th><th>Эффект</th></tr></thead>
                    <tbody>${renderFeatRows([3, 7, 11, 15, 19], 'genFeatLvl', 'general', '#ffd875', 'Живучесть, Инициатива...', 'Описание общей черты...')}</tbody>
                </table>
            </div>
            <div class="bst-feat-tab-pane" data-feat-pane="skill" style="display: none;">
                <table class="k-table bst-cantrips-table" style="width: 100%;">
                    <thead><tr><th style="width: 45px; text-align: center;">Ур.</th><th style="width: 35%;">Черта навыка</th><th>Эффект и Навык</th></tr></thead>
                    <tbody>${renderFeatRows([2, 4, 6, 8, 10, 12, 14, 16, 18, 20], 'skillFeatLvl', 'skill', '#74b9ff', 'Медицина в бою, Запугивание...', 'Требования и эффект...')}</tbody>
                </table>
            </div>
            <div class="bst-feat-tab-pane" data-feat-pane="ancestry" style="display: none;">
                <table class="k-table bst-cantrips-table" style="width: 100%;">
                    <thead><tr><th style="width: 45px; text-align: center;">Ур.</th><th style="width: 35%;">Черта народа</th><th>Эффект</th></tr></thead>
                    <tbody>${renderFeatRows([1, 5, 9, 13, 17], 'ancFeatLvl', 'ancestry', '#a29bfe', 'Черта народа {lvl} ур...', 'Способность народа...')}</tbody>
                </table>
            </div>
        </div>
    `;
}

export function initPage1(overlay, hero) {
    const lvlInp = overlay.querySelector('[data-sheet-num="level"]');

    const runLevelProgression = () => {
        const newLvl = Math.max(1, parseInt(lvlInp?.value, 10) || 1);
        hero.stats.level = newLvl;

        const res = recalculateLevelProgression(overlay, hero);

        const info = getMagicTierVisibility(hero.stats);
        hero.stats.lvl1PerDay = info.lvl1Slots;
        hero.stats.lvl2PerDay = info.lvl2Slots;
        hero.stats.lvl3PerDay = info.lvl3Slots;
        hero.stats.lvl4PerDay = info.lvl4Slots;

        if (hero.stats.compType === 'familiar') {
            const famSpecies = (PF2E_COMPANION_ABILITIES || []).find(x => x.id === hero.stats.compSpeciesId);
            const hasTough = famSpecies?.hasTough || String(hero.stats.compAbilitiesText || '').includes('Живучий');
            hero.stats.compHpMax = (5 + (hasTough ? 2 : 0)) * newLvl;
            hero.stats.compHpCur = hero.stats.compHpMax;
            hero.stats.compAc = 10 + newLvl + 2;
        } else if (hero.stats.compType === 'companion' && hero.stats.compSpeciesId) {
            const species = (PF2E_COMPANION_ABILITIES || []).find(x => x.id === hero.stats.compSpeciesId);
            const calc = species ? calcCompanionStats(species, newLvl) : null;
            if (calc) {
                hero.stats.compHpMax = calc.hpMax;
                hero.stats.compHpCur = calc.hpMax;
                hero.stats.compAc = calc.ac;
            }
        }

        recalculateSheetStats(overlay, hero);
        return res;
    };

    if (lvlInp) {
        lvlInp.addEventListener('change', runLevelProgression);
    }

    const btnRecalcLvl = overlay.querySelector('#btnRecalcByLevel');
    if (btnRecalcLvl) {
        btnRecalcLvl.addEventListener('click', () => {
            const res = runLevelProgression();
            if (res) {
                const oldText = btnRecalcLvl.textContent;
                btnRecalcLvl.textContent = '✅';
                btnRecalcLvl.title = `Пересчитано! Макс. ПЗ: ${res.newHpMax} (${res.formulaHp}) | Атака закл.: +${res.newSpellAtk} | СЛ закл.: ${res.newSpellDc}`;
                setTimeout(() => { btnRecalcLvl.textContent = oldText; }, 1200);
            }
        });
    }

    bindSheetTooltip(overlay.querySelector('[data-sheet-txt="armorName"]')?.closest('div'), () => {
        const val = overlay.querySelector('[data-sheet-txt="armorName"]')?.value.trim();
        if (!val) return null;
        const found = CatalogService.findArmor(val);
        if (!found) return `<div class="init-tip-header"><span class="init-tip-name">🛡️ ${val}</span></div>`;
        const groupEff = getArmorGroupEffect(found.group);
        const traitsList = getArmorTraitsDetails(found.traits);
        const traitsHtml = traitsList.length
            ? `<div style="margin-top:6px; border-top:1px dashed rgba(235,210,145,0.25); padding-top:4px; font-size:12px; color:#ebd291;">` +
            traitsList.map(t => `<div>🏷️ <b>${t.trait}</b>${t.desc ? `: ${t.desc}` : ''}</div>`).join('') +
            `</div>`
            : '';

        return [
            `<div class="init-tip-header"><span class="init-tip-name">${found.name}</span><span class="init-tip-turn-tag" style="border-color:#74b9ff; color:#74b9ff;">${found.group.toUpperCase()}</span></div>`,
            `<div class="init-tip-top-row"><span>🛡️ КБ: <b>+${found.acBonus}</b></span><span>🤸 Макс. ЛВК: <b>+${found.dexCap}</b></span><span>⚠️ Штраф: <b>${found.penalty}</b></span></div>`,
            groupEff ? `<div style="font-size:12px; margin-top:5px; color:#2ecc71;">${groupEff}</div>` : '',
            traitsHtml
        ].join('');
    });

    const shieldContainer = overlay.querySelector('[data-sheet-num="acShieldBonus"]')?.closest('div');
    bindSheetTooltip(shieldContainer, () => {
        const bonus = parseInt(overlay.querySelector('[data-sheet-num="acShieldBonus"]')?.value, 10) || 0;
        const hardness = parseInt(overlay.querySelector('[data-sheet-num="acShieldHardness"]')?.value, 10) || 0;
        const curHp = parseInt(overlay.querySelector('[data-sheet-num="acShieldHp"]')?.value, 10) || 0;
        if (!bonus && !hardness && !curHp) return null;

        const bt = Math.floor(curHp / 2);
        const statusText = curHp <= 0
            ? '<span style="color:#ff7675;">💥 Уничтожен (0 ПЗ)</span>'
            : (curHp <= bt
                ? `<span style="color:#fdcb6e;">⚠️ Сломан (ПЗ ≤ ПЛ ${bt} — нельзя поднимать без починки)</span>`
                : `<span style="color:#2ecc71;">✅ Исправен (Порог поломки ПЛ: ${bt})</span>`);

        return [
            `<div class="init-tip-header"><span class="init-tip-name">🛡️ Параметры щита</span><span class="init-tip-turn-tag" style="border-color:#74b9ff; color:#74b9ff;">+${bonus} КБ</span></div>`,
            `<div class="init-tip-top-row"><span>🧱 Твёрдость: <b>${hardness}</b></span><span>❤️ ПЗ: <b>${curHp}</b></span><span>💔 ПЛ: <b>${bt}</b></span></div>`,
            `<div style="font-size:12px; margin-top:5px;">${statusText}</div>`,
            `<div style="margin-top:6px; border-top:1px dashed rgba(235,210,145,0.25); padding-top:4px; font-size:12px; color:#ebd291; line-height:1.35;">`,
            `<div>◆ <b>Поднятие щита:</b> даёт ситуативный бонус <b>+${bonus} к КБ</b> до начала вашего следующего хода.</div>`,
            `<div>↺ <b>Блок щитом</b> (если щит поднят): снижает физический урон от атаки на <b>${hardness}</b>; остаток урона поровну получаете вы и щит.</div>`,
            `</div>`
        ].join('');
    });
    const triggerRecalc = () => recalculateSheetStats(overlay, hero);
    initPage1Pickers(overlay, hero, triggerRecalc);
    overlay.querySelectorAll('.bst-armor-calc-trigger, .bst-save-calc-trigger, .bst-skill-calc-trigger, [data-sheet-num="str"], [data-sheet-num="dex"], [data-sheet-num="con"], [data-sheet-num="int"], [data-sheet-num="wis"], [data-sheet-num="cha"]').forEach(el => {
        el.addEventListener('input', triggerRecalc);
        el.addEventListener('change', triggerRecalc);
    });
    triggerRecalc();

    bindSheetTooltip(overlay.querySelector('[data-sheet-txt="background"]')?.closest('.bst-top-field'), () => {
        const val = overlay.querySelector('[data-sheet-txt="background"]')?.value.trim();
        if (!val) return null;
        const found = CatalogService.findBackground(val);
        return [
            `<div class="init-tip-header"><span class="init-tip-name">📜 ${val}</span><span class="init-tip-turn-tag" style="border-color:#74b9ff; color:#74b9ff;">ПРОИСХОЖДЕНИЕ</span></div>`,
            found ? `<div style="font-size:13px; margin-top:6px; color:#ebd291; line-height:1.4;">${found.desc || ''}</div>` : '',
            found?.feat ? `<div style="font-size:12px; margin-top:6px; color:#74b9ff;">✨ Бонусная черта: <b>${found.feat}</b></div>` : ''
        ].join('');
    });

    bindSheetTooltip(overlay.querySelector('[data-sheet-txt="charClass"]')?.closest('.bst-top-field'), () => {
        const val = overlay.querySelector('[data-sheet-txt="charClass"]')?.value.trim();
        if (!val) return null;
        const found = CatalogService.findClass(val);
        return [
            `<div class="init-tip-header"><span class="init-tip-name">⚔️ ${val}</span><span class="init-tip-turn-tag" style="border-color:#ffd875; color:#ffd875;">КЛАСС</span></div>`,
            found ? `<div class="init-tip-top-row"><span>⭐ Ключевая: <b>${found.keyStat || '—'}</b></span><span>❤️ ПЗ за ур.: <b>+${found.hp || 8}</b></span></div>` : '',
            found?.desc ? `<div style="font-size:13px; margin-top:6px; color:#ebd291; line-height:1.4;">${found.desc}</div>` : ''
        ].join('');
    });

    bindSheetTooltip(overlay.querySelector('[data-sheet-txt="heritage"]')?.closest('div'), () => {
        const val = overlay.querySelector('[data-sheet-txt="heritage"]')?.value.trim();
        if (!val) return null;
        const found = CatalogService.findHeritage(val);
        return [
            `<div class="init-tip-header"><span class="init-tip-name">🧬 ${val}</span><span class="init-tip-turn-tag" style="border-color:#2ecc71; color:#2ecc71;">НАСЛЕДИЕ</span></div>`,
            found ? `<div class="init-tip-top-row"><span>👥 Народ: <b>${found.ancestryName || 'Общее'}</b></span>${found.source ? `<span>📚 ${found.source}</span>` : ''}</div>` : '',
            found?.desc ? `<div style="font-size:13px; margin-top:6px; color:#ebd291; line-height:1.4;">${found.desc}</div>` : ''
        ].join('');
    });

    bindSheetTooltip(overlay.querySelector('[data-sheet-txt="backgroundFeat"]')?.closest('div'), () => {
        const name = overlay.querySelector('[data-sheet-txt="backgroundFeat"]')?.value.trim();
        if (!name) return null;
        const bgVal = overlay.querySelector('[data-sheet-txt="background"]')?.value.trim();
        const found = CatalogService.findBackground(bgVal);
        return `<div class="init-tip-header"><span class="init-tip-name">${name}</span><span class="init-tip-turn-tag" style="border-color:#74b9ff; color:#74b9ff;">ЧЕРТА ПРОИСХОЖДЕНИЯ</span></div><div style="font-size:13px; margin-top:6px; color:#ebd291; line-height:1.4;">${found?.desc || 'Способность происхождения.'}</div>`;
    });

    overlay.querySelectorAll('.bst-action-slot').forEach(slotEl => {
        const idx = slotEl.dataset.actionSlot;
        bindSheetTooltip(slotEl, () => {
            const name = overlay.querySelector(`[data-sheet-txt="actionSlot${idx}Name"]`)?.value.trim();
            if (!name) return null;
            const desc = overlay.querySelector(`[data-sheet-txt="actionSlot${idx}Desc"]`)?.value.trim() || 'Описание действия отсутствует.';
            return `<div class="init-tip-header"><span class="init-tip-name">⚡ ${name}</span><span class="init-tip-turn-tag" style="border-color:#2ecc71; color:#2ecc71;">ДЕЙСТВИЕ</span></div><div style="font-size:13px; margin-top:6px; color:#ebd291; line-height:1.4;">${desc}</div>`;
        });
    });

    overlay.querySelectorAll('.bst-weapon-row').forEach((row, rIdx) => {
        const slot = rIdx === 0 ? 'melee1' : (rIdx === 1 ? 'melee2' : 'ranged');
        bindSheetTooltip(row, () => {
            const name = overlay.querySelector(`[data-sheet-txt="${slot}Name"]`)?.value.trim();
            if (!name) return null;
            const atk = overlay.querySelector(`[data-sheet-txt="${slot}Atk"]`)?.value.trim() || '—';
            const dmg = overlay.querySelector(`[data-sheet-txt="${slot}Dmg"]`)?.value.trim() || '—';
            const traits = overlay.querySelector(`[data-sheet-txt="${slot}Traits"]`)?.value.trim() || '';
            const found = CatalogService.findWeapon(name);
            const critEff = found ? getWeaponCritEffect(found.group) : '';
            const traitsList = getWeaponTraitsDetails(traits || found?.traits || '');

            const traitsHtml = traitsList.length
                ? `<div style="margin-top:6px; border-top:1px dashed rgba(235,210,145,0.25); padding-top:4px; font-size:12px; color:#ebd291;">` +
                traitsList.map(t => `<div>🏷️ <b>${t.trait}</b>${t.desc ? `: ${t.desc}` : ''}</div>`).join('') + `</div>`
                : '';

            return [
                `<div class="init-tip-header"><span class="init-tip-name">⚔️ ${name}</span>${found ? `<span class="init-tip-turn-tag" style="border-color:#ffd875; color:#ffd875;">${found.group.toUpperCase()}</span>` : ''}</div>`,
                `<div class="init-tip-top-row"><span>🎯 Атака: <b>${atk}</b></span><span>💥 Урон: <b>${dmg}</b></span></div>`,
                critEff ? `<div style="font-size:12px; margin-top:5px; color:#ff7675;">💥 <b>Крит. специализация:</b> ${critEff}</div>` : '',
                traitsHtml
            ].join('');
        });
    });

    const skillAttrLabels = {
        acrobatics: ['dex', 'ЛВК'], athletics: ['str', 'СИЛ'], thievery: ['dex', 'ЛВК'], stealth: ['dex', 'ЛВК'],
        survival: ['wis', 'МДР'], medicine: ['wis', 'МДР'], nature: ['wis', 'МДР'], religion: ['wis', 'МДР'],
        diplomacy: ['cha', 'ХАР'], intimidation: ['cha', 'ХАР'], deception: ['cha', 'ХАР'], performance: ['cha', 'ХАР'],
        arcana: ['int', 'ИНТ'], occultism: ['int', 'ИНТ'], society: ['int', 'ИНТ'], crafting: ['int', 'ИНТ'], lore: ['int', 'ИНТ']
    };
    const penaltySkillsList = ['acrobatics', 'athletics', 'stealth', 'thievery'];

    Object.entries(skillAttrLabels).forEach(([skKey, [attrKey, attrName]]) => {
        const totalInp = overlay.querySelector(`[data-sheet-num="${skKey}"]`);
        const rowEl = totalInp?.closest('tr') || totalInp?.parentElement;
        if (!rowEl) return;

        bindSheetTooltip(rowEl, () => {
            const total = parseInt(totalInp.value, 10) || 0;
            const attrVal = parseInt(overlay.querySelector(`[data-sheet-num="${attrKey}"]`)?.value, 10) || 0;
            const profVal = parseInt(overlay.querySelector(`[data-sheet-num="prof_${skKey}"]`)?.value, 10) || 0;
            const itemVal = Number(hero.stats.skillItemBonuses?.[skKey]) || 0;

            const armorType = overlay.querySelector('[data-sheet-txt="armorType"]')?.value || 'unarmored';
            const charStr = parseInt(overlay.querySelector('[data-sheet-num="str"]')?.value, 10) || 0;
            const strReq = parseInt(overlay.querySelector('[data-sheet-num="ac"]')?.dataset.currentStrReq, 10) || 0;
            const basePen = Math.abs(parseInt(overlay.querySelector('[data-sheet-num="acArmorPenalty"]')?.value, 10) || 0);
            const penVal = (penaltySkillsList.includes(skKey) && armorType !== 'unarmored' && charStr < strReq) ? basePen : 0;

            const labelText = rowEl.querySelector('td')?.textContent.trim() || skKey;
            const fmt = (n) => (n >= 0 ? `+${n}` : `${n}`);
            const parts = [`${attrName}: <b>${fmt(attrVal)}</b>`, `Умение: <b>+${profVal}</b>`];
            if (itemVal > 0) parts.push(`<span style="color:#ffd875;">Предмет: <b>+${itemVal}</b></span>`);
            if (penVal > 0) parts.push(`<span style="color:#ff7675;">Штраф брони: <b>-${penVal}</b></span>`);

            return [
                `<div class="init-tip-header"><span class="init-tip-name">${labelText}</span><span class="init-tip-turn-tag" style="border-color:#2ecc71; color:#2ecc71;">${fmt(total)}</span></div>`,
                `<div style="font-size:12px; margin-top:4px; color:#ebd291;">${parts.join(' • ')}</div>`
            ].join('');
        });
    });

    overlay.querySelectorAll('.bst-feat-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.featTab;
            overlay.querySelectorAll('.bst-feat-tab-btn').forEach(b => {
                b.className = b === btn ? 'btn ok bst-feat-tab-btn' : 'btn cc bst-feat-tab-btn';
            });
            overlay.querySelectorAll('.bst-feat-tab-pane').forEach(pane => {
                pane.style.display = pane.dataset.featPane === target ? 'block' : 'none';
            });
        });
    });

    overlay.querySelectorAll('.bst-cantrips-table tbody tr').forEach(tr => {
        const nameInp = tr.querySelector('input[data-feat-kind]');
        if (!nameInp) return;

        bindSheetTooltip(tr, () => {
            const name = nameInp.value.trim();
            if (!name) return null;

            const lvl = nameInp.dataset.featLevel;
            const kind = nameInp.dataset.featKind;
            const prefixMap = {
                class: 'classFeatLvl',
                general: 'genFeatLvl',
                skill: 'skillFeatLvl',
                ancestry: 'ancFeatLvl'
            };
            const labelMap = {
                class: 'КЛАСС',
                general: 'ОБЩАЯ',
                skill: 'НАВЫК',
                ancestry: 'НАРОД'
            };

            const desc = overlay.querySelector(`[data-sheet-txt="${prefixMap[kind]}${lvl}Desc"]`)?.value || '';

            return `
                <div class="init-tip-header">
                    <span class="init-tip-name">⚔️ ${name}</span>
                    <span class="init-tip-turn-tag" style="border-color:#2ecc71; color:#2ecc71;">${labelMap[kind]} • УР. ${lvl}</span>
                </div>
                <div style="font-size:13px; margin-top:6px; color:#ebd291; line-height:1.4;">${desc}</div>
            `;
        });
    });

}

