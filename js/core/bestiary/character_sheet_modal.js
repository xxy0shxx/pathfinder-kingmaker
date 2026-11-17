import ModalManager from '../../ui/modal_manager.js';
import { PF2E_BACKGROUNDS } from '../../config/backgrounds_catalog.js';
import { PF2E_SHEET_CONFIG, SHORT_TO_FULL_SKILL_MAP, ensureCharacterStats } from './bestiary_config.js';
import { recalculateSheetStats, recalculateLevelProgression } from './sheet_calculator.js';
import { initPage1Pickers, initPage2Pickers, initPage3Pickers } from './sheet_pickers.js';
import { bindSheetTooltip, hideSheetItemTooltip } from './bestiary_tooltip_builder.js';
import { PF2E_CLASSES } from '../../config/meta_catalog.js';
import { PF2E_HERITAGES } from '../../config/heritages_catalog.js';
import { PF2E_COMPANION_ABILITIES, calcCompanionStats } from '../../config/companions_catalog.js';
import { exportCharacterToPdf } from './sheet_pdf_exporter.js';
import { PF2E_MELEE_WEAPONS, PF2E_RANGED_WEAPONS, getWeaponCritEffect, getWeaponTraitsDetails } from '../../config/weapons_catalog.js';
import { PF2E_ARMOR_CATALOG, getArmorGroupEffect, getArmorTraitsDetails } from '../../config/armor_catalog.js';
import { PF2E_ITEMS_CATALOG, calculateCharacterBulk, getItemLevel } from '../../config/items_catalog.js';
import StorageManager from '../storage_manager.js';

const esc = (v) => String(v ?? '').replace(/"/g, '&quot;');
const numInp = (stats, key, cls = 'bst-stat-inp') =>
    `<input type="number" data-sheet-num="${key}" class="k-inp ${cls}" value="${stats[key] ?? 0}">`;
const txtInp = (stats, key, placeholder = '') =>
    `<input type="text" data-sheet-txt="${key}" class="k-inp bst-txt-inp" placeholder="${placeholder}" value="${esc(stats[key])}">`;
const txtArea = (stats, key, rows = 4, placeholder = '') =>
    `<textarea data-sheet-txt="${key}" class="k-inp bst-area-inp" rows="${rows}" placeholder="${placeholder}">${String(stats[key] ?? '')}</textarea>`;

function collectFormData(overlayEl, hero) {
    overlayEl.querySelectorAll('[data-sheet-num]').forEach(inp => {
        const val = parseInt(inp.value, 10);
        hero.stats[inp.dataset.sheetNum] = isNaN(val) ? 0 : val;
    });
    overlayEl.querySelectorAll('[data-sheet-txt]').forEach(inp => {
        hero.stats[inp.dataset.sheetTxt] = inp.value;
    });
    overlayEl.querySelectorAll('[data-sheet-chk]').forEach(chk => {
        hero.stats[chk.dataset.sheetChk] = chk.checked;
    });

    Object.entries(SHORT_TO_FULL_SKILL_MAP).forEach(([shortKey, fullKey]) => {
        if (hero.stats[fullKey] !== undefined) {
            hero.stats[shortKey] = hero.stats[fullKey];
        }
    });
}

function buildPage1Html(stats) {
    const alignments = [
        ['', '— Выберите —'],
        ['ЗД', '⚖️😇 Законопослушный Добрый (ЗД)'],
        ['НД', '😇 Нейтральный Добрый (НД)'],
        ['ХД', '🌀😇 Хаотичный Добрый (ХД)'],
        ['ЗН', '⚖️ Законопослушный Нейтральный (ЗН)'],
        ['ИН', '⚖️🌀 Истинный Нейтральный (Н)'],
        ['ХН', '🌀 Хаотичный Нейтральный (ХН)'],
        ['ЗЗ', '⚖️😈 Законопослушный Злой (ЗЗ)'],
        ['НЗ', '😈 Нейтральный Злой (НЗ)'],
        ['ХЗ', '🌀😈 Хаотичный Злой (ХЗ)']
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
                <span>⚖️ Мировоззрение</span>
                <select data-sheet-txt="alignment" class="k-inp" style="background: #040905; border: 1px solid #543e0d; color: #ebd291; padding: 4px; font-weight: bold; width: 100%;">
                    ${alignments.map(([val, lbl]) => `<option value="${val}" ${alignVal === val ? 'selected' : ''}>${lbl}</option>`).join('')}
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
                <input type="text" data-sheet-txt="backgroundFeat" class="k-inp bst-txt-inp" placeholder="Автовыбор из происхождения..." value="${esc(stats.backgroundFeat)}">
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
                <div><span style="font-size:13px; font-weight:900; color:#74b9ff; display:block;">🛡️ Настройки щита</span><span style="font-size:11px; color:#a4b0be;">(Shield Raise)</span></div>
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
                ${new Array(1, 2, 3).map(idx => `
                    <div class="bst-action-slot" data-action-slot="${idx}" style="position: relative; background: rgba(4, 9, 5, 0.7); border: 1px solid #2d5a3c; border-radius: 5px; padding: 5px;">
                        <span style="font-size: 10px; color: #2ecc71; font-weight: bold; display: block; margin-bottom: 2px;">⚡ Действие ${idx}</span>
                        <input type="text" data-sheet-txt="actionSlot${idx}Name" data-action-idx="${idx}" class="k-inp bst-txt-inp bst-action-picker-inp" autocomplete="off" placeholder="Град ударов, Удар..." value="${esc(stats[`actionSlot${idx}Name`] ?? '')}">
                        <input type="hidden" data-sheet-txt="actionSlot${idx}Desc" value="${esc(stats[`actionSlot${idx}Desc`] ?? '')}">
                        <div class="bst-cantrip-dropdown" data-action-drop="${idx}" style="display: none; z-index: 10000110;"></div>
                    </div>`).join('')}
            </div>

            <!-- Вкладка 1: Классовые черты -->
            <div class="bst-feat-tab-pane" data-feat-pane="class">
                <table class="k-table bst-cantrips-table" style="width: 100%;">
                    <thead><tr><th style="width: 45px; text-align: center;">Ур.</th><th style="width: 35%;">Классовая черта</th><th>Действие и Эффект</th></tr></thead>
                    <tbody>
                        ${new Array(1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20).map(lvl => `
                            <tr>
                                <td class="bst-cantrip-num" style="color: #2ecc71; font-weight: bold; text-align: center;">${lvl}</td>
                                <td style="position: relative;">
                                    <input type="text" data-sheet-txt="classFeatLvl${lvl}Name" data-feat-level="${lvl}" data-feat-kind="class" class="k-inp bst-txt-inp bst-ranger-feat-picker-inp" autocomplete="off" placeholder="Черта класса ${lvl} ур..." value="${esc(stats[`classFeatLvl${lvl}Name`] ?? '')}">
                                    <div class="bst-cantrip-dropdown" data-feat-drop="class_${lvl}" style="display: none;"></div>
                                </td>
                                <td>${txtInp(stats, `classFeatLvl${lvl}Desc`, 'Действие, требования, бонус...')}</td>
                            </tr>`).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Вкладка 2: Общие черты (3, 7, 11, 15, 19) -->
            <div class="bst-feat-tab-pane" data-feat-pane="general" style="display: none;">
                <table class="k-table bst-cantrips-table" style="width: 100%;">
                    <thead><tr><th style="width: 45px; text-align: center;">Ур.</th><th style="width: 35%;">Общая черта</th><th>Эффект</th></tr></thead>
                    <tbody>
                        ${new Array(3, 7, 11, 15, 19).map(lvl => `
                            <tr>
                                <td class="bst-cantrip-num" style="color: #ffd875; font-weight: bold; text-align: center;">${lvl}</td>
                                <td style="position: relative;">
                                    <input type="text" data-sheet-txt="genFeatLvl${lvl}Name" data-feat-level="${lvl}" data-feat-kind="general" class="k-inp bst-txt-inp bst-extra-feat-picker-inp" autocomplete="off" placeholder="Живучесть, Инициатива..." value="${esc(stats[`genFeatLvl${lvl}Name`] ?? '')}">
                                    <div class="bst-cantrip-dropdown" data-feat-drop="general_${lvl}" style="display: none;"></div>
                                </td>
                                <td>${txtInp(stats, `genFeatLvl${lvl}Desc`, 'Описание общей черты...')}</td>
                            </tr>`).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Вкладка 3: Черты навыков (2, 4, 6, 8, 10, 12, 14, 16, 18, 20) -->
            <div class="bst-feat-tab-pane" data-feat-pane="skill" style="display: none;">
                <table class="k-table bst-cantrips-table" style="width: 100%;">
                    <thead><tr><th style="width: 45px; text-align: center;">Ур.</th><th style="width: 35%;">Черта навыка</th><th>Эффект и Навык</th></tr></thead>
                    <tbody>
                        ${new Array(2, 4, 6, 8, 10, 12, 14, 16, 18, 20).map(lvl => `
                            <tr>
                                <td class="bst-cantrip-num" style="color: #74b9ff; font-weight: bold; text-align: center;">${lvl}</td>
                                <td style="position: relative;">
                                    <input type="text" data-sheet-txt="skillFeatLvl${lvl}Name" data-feat-level="${lvl}" data-feat-kind="skill" class="k-inp bst-txt-inp bst-extra-feat-picker-inp" autocomplete="off" placeholder="Медицина в бою, Запугивание..." value="${esc(stats[`skillFeatLvl${lvl}Name`] ?? '')}">
                                    <div class="bst-cantrip-dropdown" data-feat-drop="skill_${lvl}" style="display: none;"></div>
                                </td>
                                <td>${txtInp(stats, `skillFeatLvl${lvl}Desc`, 'Требования и эффект...')}</td>
                            </tr>`).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Вкладка 4: Черты народа (1, 5, 9, 13, 17) -->
            <div class="bst-feat-tab-pane" data-feat-pane="ancestry" style="display: none;">
                <table class="k-table bst-cantrips-table" style="width: 100%;">
                    <thead><tr><th style="width: 45px; text-align: center;">Ур.</th><th style="width: 35%;">Черта народа</th><th>Эффект</th></tr></thead>
                    <tbody>
                        ${new Array(1, 5, 9, 13, 17).map(lvl => `
                            <tr>
                                <td class="bst-cantrip-num" style="color: #a29bfe; font-weight: bold; text-align: center;">${lvl}</td>
                                <td style="position: relative;">
                                    <input type="text" data-sheet-txt="ancFeatLvl${lvl}Name" data-feat-level="${lvl}" data-feat-kind="ancestry" class="k-inp bst-txt-inp bst-extra-feat-picker-inp" autocomplete="off" placeholder="Черта народа ${lvl} ур..." value="${esc(stats[`ancFeatLvl${lvl}Name`] ?? '')}">
                                    <div class="bst-cantrip-dropdown" data-feat-drop="ancestry_${lvl}" style="display: none;"></div>
                                </td>
                                <td>${txtInp(stats, `ancFeatLvl${lvl}Desc`, 'Способность народа...')}</td>
                            </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        

        

    `;
}

function getMagicTierVisibility(stats) {
    const cls = String(stats.charClass || '').toLowerCase().replace(/ё/g, 'е').trim();
    const lvl = Math.max(1, parseInt(stats.level, 10) || 1);

    const casterKeywords = [
        'волшебник', 'маг', 'wizard',
        'чародей', 'сорк', 'sorcerer',
        'жрец', 'клирик', 'cleric',
        'друид', 'druid',
        'бард', 'bard',
        'ведьма', 'witch',
        'оракул', 'oracle',
        'анимист', 'animist',
        'экстрасенс', 'псионик', 'psychic',
        'колдун', 'магус', 'magus',
        'призыватель', 'summoner',
        'некромант', 'necromancer'
    ];

    // Классы с +1 дополнительной ячейкой на новом круге (Жрец, Волшебник, Чародей)
    const extraSlotKeywords = [
        'волшебник', 'маг', 'wizard',
        'чародей', 'сорк', 'sorcerer',
        'жрец', 'клирик', 'cleric'
    ];

    const matchWord = (keywords) =>
        keywords.some(k => new RegExp(`(^|\\s|\\()${k}($|\\s|\\))`, 'i').test(cls));

    const isSpellcaster = matchWord(casterKeywords);


    if (!isSpellcaster) {
        return {
            showLvl1: false, showLvl2: false, showLvl3: false, showLvl4: false,
            lvl1Slots: 0, lvl2Slots: 0, lvl3Slots: 0, lvl4Slots: 0
        };
    }

    const hasBonusSlot = matchWord(extraSlotKeywords);

    const baseLvl1 = lvl >= 2 ? 3 : 2;
    const lvl1Slots = baseLvl1 + (hasBonusSlot ? 1 : 0);

    let lvl2Slots = 0;
    if (lvl >= 3) {
        const baseLvl2 = lvl >= 4 ? 3 : 2;
        lvl2Slots = baseLvl2 + (hasBonusSlot ? 1 : 0);
    }

    let lvl3Slots = 0;
    if (lvl >= 5) {
        const baseLvl3 = lvl >= 6 ? 3 : 2;
        lvl3Slots = baseLvl3 + (hasBonusSlot ? 1 : 0);
    }

    let lvl4Slots = 0;
    if (lvl >= 7) {
        const baseLvl4 = lvl >= 8 ? 3 : 2;
        lvl4Slots = baseLvl4 + (hasBonusSlot ? 1 : 0);
    }

    return {
        showLvl1: true,
        showLvl2: lvl >= 3,
        showLvl3: lvl >= 5,
        showLvl4: lvl >= 7,
        lvl1Slots,
        lvl2Slots,
        lvl3Slots,
        lvl4Slots
    };

}

function buildPage2Html(stats) {
    if (stats.cantripsPrepared && !stats.cantrip1Name) { stats.cantrip1Name = stats.cantripsPrepared; stats.cantripsPrepared = ''; }
    if (stats.lvl1Prepared && !stats.lvl1Spell1Name) { stats.lvl1Spell1Name = stats.lvl1Prepared; stats.lvl1Prepared = ''; }
    if (stats.lvl2Prepared && !stats.lvl2Spell1Name) { stats.lvl2Spell1Name = stats.lvl2Prepared; stats.lvl2Prepared = ''; }

    if (stats.equipmentText && !stats.item1Name) { stats.item1Name = 'Снаряжение'; stats.item1Notes = stats.equipmentText.replace(/\n+/g, '; '); stats.equipmentText = ''; }

    const renderSpellRows = (count, prefix, dataAttr, dropAttr, pickerCls, placeholder, withCheck = false) =>
        Array.from({ length: count }, (_, i) => i + 1).map(idx => `
            <tr>
                <td class="bst-cantrip-num">${withCheck ? `<label style="cursor:pointer;"><input type="checkbox" data-sheet-chk="${prefix}${idx}Ready" ${stats[`${prefix}${idx}Ready`] ? 'checked' : ''}> ${idx}</label>` : idx}</td>
                <td style="position: relative;">
                    <input type="text" data-sheet-txt="${prefix}${idx}Name" ${dataAttr}="${idx}" class="k-inp bst-txt-inp ${pickerCls}" autocomplete="off" placeholder="${placeholder}" value="${esc(stats[`${prefix}${idx}Name`])}">
                    <div class="bst-cantrip-dropdown" ${dropAttr}="${idx}" style="display: none;"></div>
                </td>
                <td>${txtInp(stats, `${prefix}${idx}Actions`, '◆◆ / 30 фт.')}</td>
                <td>${txtInp(stats, `${prefix}${idx}Notes`, 'Эффект...')}</td>
            </tr>`).join('');


    const itemsRows = Array.from({ length: 15 }, (_, i) => i + 1).map(idx => `
        <tr>
            <td class="bst-cantrip-num">${idx}</td>
            <td style="position: relative;">
                <input type="text" data-sheet-txt="item${idx}Name" data-item-row="${idx}" class="k-inp bst-txt-inp bst-item-picker-inp" autocomplete="off" placeholder="🔍 Нажмите для выбора..." value="${esc(stats[`item${idx}Name`])}" style="cursor: pointer;">
                <div class="bst-cantrip-dropdown" data-item-drop="${idx}" style="display: none;"></div>
            </td>
            <td style="text-align: center;">
                <div class="bst-qty-stepper" style="display: inline-flex; align-items: center; gap: 4px; width: 110px;">
                    <button type="button" class="bst-qty-btn" data-qty-delta="-1" style="width:26px; height:26px; background:#292011; border:1px solid #543e0d; color:#ebd291;">−</button>
                    <input type="number" data-sheet-num="item${idx}Qty" class="k-inp bst-tiny-num bst-qty-inp" min="0" value="${stats[`item${idx}Qty`] ?? 1}" style="width:40px; text-align:center; color:#2ecc71; font-weight:900;">
                    <button type="button" class="bst-qty-btn" data-qty-delta="1" style="width:26px; height:26px; background:#292011; border:1px solid #543e0d; color:#ebd291;">+</button>
                </div>
            </td>
            <td>
                <div style="display: flex; align-items: center; gap: 4px;">
                    <input type="text" data-sheet-txt="item${idx}Notes" class="k-inp bst-txt-inp" placeholder="Эффект, вес..." value="${esc(stats[`item${idx}Notes`])}" readonly style="opacity: 0.9; cursor: default;">
                    <button type="button" class="bst-item-give-btn" data-item-give="${idx}" title="Передать предмет другому герою отряда" style="width: 26px; height: 26px; flex-shrink: 0; background: #14283b; border: 1px solid #74b9ff; color: #74b9ff; border-radius: 4px; cursor: pointer; font-size: 12px; display: inline-flex; align-items: center; justify-content: center;">🎁</button>
                    <button type="button" class="bst-item-sell-btn" data-item-sell="${idx}" title="Продать предмет за монеты" style="width: 26px; height: 26px; flex-shrink: 0; background: #1e3c27; border: 1px solid #ffd875; color: #ffd875; border-radius: 4px; cursor: pointer; font-size: 12px; display: inline-flex; align-items: center; justify-content: center;">💰</button>
                    <button type="button" class="bst-item-clear-btn" data-item-clear="${idx}" title="Удалить позицию из рюкзака" style="width: 26px; height: 26px; flex-shrink: 0; background: #3b1717; border: 1px solid #9b2c2c; color: #ff7675; border-radius: 4px; cursor: pointer; font-size: 12px; display: inline-flex; align-items: center; justify-content: center;">🗑️</button>
                </div>
            </td>
        </tr>`).join('');



    const magicInfo = getMagicTierVisibility(stats);

    // Всегда синхронизируем лимит слотов с текущим уровнем персонажа
    const lvl1PerDayVal = magicInfo.lvl1Slots;
    const lvl2PerDayVal = magicInfo.lvl2Slots;
    const lvl3PerDayVal = magicInfo.lvl3Slots;
    const lvl4PerDayVal = magicInfo.lvl4Slots;

    const lvl1BlockHtml = magicInfo.showLvl1 ? `
        <div class="bst-spell-tier">
            <div class="bst-spell-tier-head">
                <span>1️⃣ 1 круг</span>
                <label>📅 В день: <input type="number" data-sheet-num="lvl1PerDay" class="k-inp bst-tiny-num" value="${lvl1PerDayVal}" readonly></label>
            </div>
            <table class="k-table bst-cantrips-table">
                <tbody>${renderSpellRows(magicInfo.lvl1Slots, 'lvl1Spell', 'data-lvl1-row', 'data-lvl1-drop', 'bst-lvl1-picker-inp', 'Заклинание 1 круга...')}</tbody>
            </table>
        </div>` : '';

    const lvl2BlockHtml = magicInfo.showLvl2 ? `
        <div class="bst-spell-tier">
            <div class="bst-spell-tier-head">
                <span>2️⃣ 2 круг</span>
                <label>📅 В день: <input type="number" data-sheet-num="lvl2PerDay" class="k-inp bst-tiny-num" value="${lvl2PerDayVal}" readonly></label>
            </div>
            <table class="k-table bst-cantrips-table">
                <tbody>${renderSpellRows(magicInfo.lvl2Slots, 'lvl2Spell', 'data-lvl2-row', 'data-lvl2-drop', 'bst-lvl2-picker-inp', 'Заклинание 2 круга...', true)}</tbody>
            </table>
        </div>` : '';

    const lvl3BlockHtml = magicInfo.showLvl3 ? `
        <div class="bst-spell-tier">
            <div class="bst-spell-tier-head">
                <span>3️⃣ 3 круг</span>
                <label>📅 В день: <input type="number" data-sheet-num="lvl3PerDay" class="k-inp bst-tiny-num" value="${lvl3PerDayVal}" readonly></label>
            </div>
            <table class="k-table bst-cantrips-table">
                <tbody>${renderSpellRows(magicInfo.lvl3Slots, 'lvl3Spell', 'data-lvl3-row', 'data-lvl3-drop', 'bst-lvl3-picker-inp', 'Заклинание 3 круга...', true)}</tbody>
            </table>
        </div>` : '';

    const lvl4BlockHtml = magicInfo.showLvl4 ? `
        <div class="bst-spell-tier">
            <div class="bst-spell-tier-head">
                <span>4️⃣ 4 круг</span>
                <label>📅 В день: <input type="number" data-sheet-num="lvl4PerDay" class="k-inp bst-tiny-num" value="${lvl4PerDayVal}" readonly></label>
            </div>
            <table class="k-table bst-cantrips-table">
                <tbody>${renderSpellRows(magicInfo.lvl4Slots, 'lvl4Spell', 'data-lvl4-row', 'data-lvl4-drop', 'bst-lvl4-picker-inp', 'Заклинание 4 круга...', true)}</tbody>
            </table>
        </div>` : '';

    return `
        <div class="bst-sheet-page2-grid">
            <div class="bst-sheet-col">
                <div class="k-panel">
                    <div class="k-sec-title">✨ Сотворение заклинаний</div>
                    <div class="bst-spell-stats-row">
                        <label>🎯 Атака: ${numInp(stats, 'spellAttack', 'bst-mini-num')}</label>
                        <label>🔮 СЛ: ${numInp(stats, 'spellDc', 'bst-mini-num')}</label>
                    </div>
                    <div class="bst-spell-tier">
                        <div class="bst-spell-tier-head"><span>✨ Фокусы</span><label>📅 В день: ${numInp(stats, 'cantripsPerDay', 'bst-tiny-num')}</label></div>
                        <table class="k-table bst-cantrips-table"><tbody>${renderSpellRows(5, 'cantrip', 'data-cantrip-row', 'data-cantrip-drop', 'bst-cantrip-picker-inp', 'Выберите фокус...')}</tbody></table>
                    </div>
                    <div class="bst-spell-tier">
                        <div class="bst-spell-tier-head"><span>💠 Фокальные</span><label>🔋 Очки: ${numInp(stats, 'focusCurrent', 'bst-tiny-num')} / ${numInp(stats, 'focusMax', 'bst-tiny-num')}</label></div>
                        <table class="k-table bst-cantrips-table"><tbody>${renderSpellRows(3, 'focusSpell', 'data-focus-row', 'data-focus-drop', 'bst-focus-picker-inp', 'Фокальное...', true)}</tbody></table>
                    </div>
                    ${lvl1BlockHtml}
                    ${lvl2BlockHtml}
                    ${lvl3BlockHtml}
                    ${lvl4BlockHtml}
                </div>
            </div>
            <div class="bst-sheet-col">
                <div class="k-panel" style="margin-bottom: 10px;">
                    <div class="k-sec-title">🎒 Снаряжение и Монеты</div>
                    
                    <div class="bst-coins-row" style="justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                        <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <span style="font-size: 12px; color: #e17055; font-weight: bold;">🥉 ММ:</span>
                ${numInp(stats, 'coinsCopper', 'bst-mini-num')}
                <span style="font-size: 12px; color: #dfe6e9; font-weight: bold;">🥈 СМ:</span>
                ${numInp(stats, 'coinsSilver', 'bst-mini-num')}
                <span style="font-size: 12px; color: #ffd875; font-weight: bold;">🥇 ЗМ:</span>
                ${numInp(stats, 'coinsGold', 'bst-mini-num')}
                <button type="button" id="btnHeroCoinsConvert" class="btn cc" style="padding: 2px 7px; font-size: 11px;" title="Укрупнить монеты (10 ММ → 1 СМ, 10 СМ → 1 ЗМ)">💱</button>
                <button type="button" id="btnHeroCoinsTransfer" class="btn ok" style="padding: 2px 8px; font-size: 11px;" title="Передать монеты союзнику, в казну или списать за покупку">💸 Передать / Тратить</button>
            </div>
                        <div id="bstBulkCounterBadge" style="padding: 4px 10px; border-radius: 5px; border: 1px solid #543e0d; background: rgba(4, 9, 5, 0.85); font-size: 13px; font-weight: bold;"></div>
                    </div>
                    
                    <table class="k-table bst-cantrips-table bst-items-table"><tbody>${itemsRows}</tbody></table>
                </div>
                
                <div class="k-panel" style="margin-bottom: 10px; border-color: #2ecc71;">
                    <div class="k-sec-title" style="color: #2ecc71;">🐾 Спутники</div>
                    <div style="display: grid; grid-template-columns: 1.5fr repeat(4, 1fr); gap: 6px; margin-bottom: 8px;">
                        ${txtInp(stats, 'compName', 'Имя / Вид...')}
                        <label>❤️ Макс: ${numInp(stats, 'compHpMax', 'bst-mini-num')}</label>
                        <label>🩸 Тек: ${numInp(stats, 'compHpCur', 'bst-mini-num')}</label>
                        <label>🛡️ КБ: ${numInp(stats, 'compAc', 'bst-mini-num')}</label>
                        <label>👟 Скор: ${numInp(stats, 'compSpeed', 'bst-mini-num')}</label>
                    </div>
                    <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                        <select data-sheet-txt="compType" class="k-inp bst-comp-type-selector" style="width: auto; color: #2ecc71;">
                            <option value="none" ${stats.compType === 'none' ? 'selected' : ''}>❌ Нет</option>
                            <option value="companion" ${stats.compType === 'companion' ? 'selected' : ''}>🐅 Верный зверь</option>
                            <option value="familiar" ${stats.compType === 'familiar' ? 'selected' : ''}>🦉 Фамильяр</option>
                        </select>
                        <div style="position: relative; flex-grow: 1;">
                            <input type="text" class="k-inp bst-comp-ability-picker" autocomplete="off" placeholder="🔍 Выберите вид зверя или способность...">
                            <div class="bst-cantrip-dropdown" data-comp-drop="1" style="display: none;"></div>
                        </div>
                    </div>
                    <input type="hidden" data-sheet-txt="compAbilitiesText" value="${esc(stats.compAbilitiesText)}">
                    <div id="bstCompInfoBox" style="background: rgba(4, 9, 5, 0.75); border: 1px solid #2d5a3c; border-radius: 6px; padding: 10px; font-size: 13px; color: #ebd291; line-height: 1.45; white-space: pre-line; min-height: 54px;">
                        ${stats.compAbilitiesText ? esc(stats.compAbilitiesText) : '<span style="color: #7f8c8d;">Спутник не выбран. Выберите тип и найдите зверя или способность в поиске выше.</span>'}
                    </div>
                </div>

                
                <div class="k-panel" style="margin-bottom: 10px;"><div class="k-sec-title">📖 Журнал приключений</div>${txtArea(stats, 'adventureLogText', 3)}</div>
                <div class="k-panel" style="margin-bottom: 10px;"><div class="k-sec-title">📝 Заметки</div>${txtArea(stats, 'notesText', 3)}</div>
                <div class="k-panel"><div class="k-sec-title">📚 Книга заклинаний</div>${txtArea(stats, 'spellbookText', 3)}</div>
            </div>
        </div>
    `;
}

function buildPage3Html(hero) {
    const stats = hero.stats || {};
    const investedUsed = Math.min(10, Math.max(0, Number(stats.investedUsedToday) || 0));

    const avatarHtml = hero.avatar
        ? `<img src="${hero.avatar}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">`
        : `<div style="font-size:64px; color:#543e0d;">🛡️</div>`;

    const renderBodySlot = (slotKey, icon, label) => {
        const val = esc(stats[`eq_${slotKey}_Name`] || '');
        const isInv = !!stats[`eq_${slotKey}_Invested`];
        return `
            <div class="bst-doll-slot" data-eq-slot="${slotKey}" style="background:rgba(4,9,5,0.85); border:1.5px solid ${isInv ? '#a29bfe' : '#8a6421'}; border-radius:6px; padding:5px 7px; position:relative;">
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:10px; color:#a4b0be; margin-bottom:2px;">
                    <span>${icon} ${label}</span>
                    ${isInv ? `<span title="Вложенный магический предмет" style="color:#a29bfe; font-weight:bold;">✨ Влож.</span>` : ''}
                </div>
                <div style="display:flex; gap:3px; align-items:center;">
                    <input type="text" data-sheet-txt="eq_${slotKey}_Name" data-eq-picker="${slotKey}" class="k-inp bst-txt-inp" placeholder="Пусто..." value="${val}" style="font-size:11px; padding:2px 5px; height:22px;">
                    ${val ? `<button type="button" class="bst-eq-unequip-btn" data-unequip-slot="${slotKey}" title="Снять предмет (дневной лимит вложения сохраняется)" style="background:#3b1717; border:1px solid #9b2c2c; color:#ff7675; border-radius:3px; padding:0 5px; height:22px; cursor:pointer; font-size:11px;">✖</button>` : ''}
                </div>
            </div>
        `;
    };

    const extraInvestedRows = [1, 2, 3, 4, 5].map(idx => {
        const val = esc(stats[`eq_ring_${idx}_Name`] || '');
        const isInv = !!stats[`eq_ring_${idx}_Invested`];
        return `
            <div style="display:flex; gap:4px; align-items:center; margin-bottom:4px;">
                <span style="font-size:11px; color:${isInv ? '#a29bfe' : '#7f8c8d'}; width:18px;">💍${idx}</span>
                <input type="text" data-sheet-txt="eq_ring_${idx}_Name" data-eq-picker="ring_${idx}" class="k-inp bst-txt-inp" placeholder="Кольцо, эонский камень, татуировка..." value="${val}" style="font-size:11px; padding:2px 6px; height:22px;">
                ${val ? `<button type="button" class="bst-eq-unequip-btn" data-unequip-slot="ring_${idx}" title="Снять (дневное вложение не возвращается)" style="background:#3b1717; border:1px solid #9b2c2c; color:#ff7675; border-radius:3px; padding:0 5px; height:22px; cursor:pointer; font-size:11px;">✖</button>` : ''}
            </div>
        `;
    }).join('');

    const beltSlotsHtml = [1, 2, 3, 4, 5].map(idx => `
        <div style="background:rgba(4,9,5,0.85); border:1px solid #8a6421; border-radius:5px; padding:4px 6px;">
            <div style="font-size:10px; color:#ffd875; margin-bottom:2px;">⚡ Пояс #${idx} (1 ◆)</div>
            <input type="text" data-sheet-txt="beltItem${idx}Name" data-belt-picker="${idx}" class="k-inp bst-txt-inp" placeholder="Зелье, свиток, бомба, набор..." value="${esc(stats[`beltItem${idx}Name`] || '')}" style="font-size:11px; padding:2px 5px; height:22px;">
        </div>
    `).join('');

    return `
        <div style="display:grid; grid-template-columns: 1.35fr 1fr; gap:14px; align-items:start;">
            <!-- ЛЕВАЯ КОЛОНКА: Кукла персонажа + Пояс быстрого доступа + Оружие в руках -->
            <div class="k-panel" style="padding:12px 14px; border:1px solid #8a6421;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #543e0d; padding-bottom:6px;">
                    <span style="font-size:15px; font-weight:bold; color:#ffd875;">🛡️ Экипировка на теле (Кукла героя)</span>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span id="bstInvestedCounterBadge" style="font-size:12px; font-weight:bold; padding:2px 8px; border-radius:4px; background:rgba(162,155,254,0.15); border:1px solid #a29bfe; color:#a29bfe;">
                            ✨ Вложено сегодня: ${investedUsed} / 10
                        </span>
                        <button type="button" id="btnResetDailyInvested" class="btn cc" style="padding:2px 8px; font-size:11px;" title="Ежедневная подготовка: сбросить счётчик вложенных предметов и заново вложить надетые">🌅 Подготовка</button>
                    </div>
                </div>

                <!-- Сетка вокруг портрета в стиле Kingmaker -->
                <div style="display:grid; grid-template-columns: 1fr 190px 1fr; gap:8px; align-items:center;">
                    <div style="display:flex; flex-direction:column; gap:7px;">
                        ${renderBodySlot('head', '👑', 'Голова (Шлем/Диадема)')}
                        ${renderBodySlot('cloak', '🧥', 'Плечи (Плащ)')}
                        ${renderBodySlot('hands', '🧤', 'Кисти (Перчатки/Наручи)')}
                        ${renderBodySlot('belt', '🥋', 'Талия (Пояс)')}
                    </div>

                    <div style="height:245px; border:2px solid #d4af37; border-radius:10px; background:radial-gradient(circle, #1e3524 0%, #09120c 100%); display:flex; align-items:center; justify-content:center; overflow:hidden; box-shadow:0 0 18px rgba(212,175,55,0.25);">
                        ${avatarHtml}
                    </div>

                    <div style="display:flex; flex-direction:column; gap:7px;">
                        ${renderBodySlot('neck', '📿', 'Шея (Амулет/Кулон)')}
                        ${renderBodySlot('armor', '🦺', 'Торс (Доспех/Роба)')}
                        ${renderBodySlot('eyes', '🥽', 'Глаза (Очки/Маска)')}
                        ${renderBodySlot('feet', '👢', 'Ноги (Сапоги)')}
                    </div>
                </div>

                <!-- Пояс быстрого доступа (до 2 Массы по Remaster) -->
                <div style="margin-top:12px; padding-top:8px; border-top:1px dashed #543e0d;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <span style="font-size:13px; font-weight:bold; color:#ffd875;">⚡ Пояс и перевязи (Быстрый доступ за 1 ◆ — лимит 2.0 Массы)</span>
                        <span id="bstBeltBulkBadge" style="font-size:12px; font-weight:bold; color:#2ecc71;">0.0 / 2.0 Массы</span>
                    </div>
                    <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap:6px;">
                        ${beltSlotsHtml}
                    </div>
                </div>

                <!-- Руки / Оружейные наборы (Weapon Sets I–II) -->
                <div style="margin-top:12px; padding-top:8px; border-top:1px dashed #543e0d;">
                    <div style="font-size:13px; font-weight:bold; color:#ffd875; margin-bottom:6px;">⚔️ Предметы в руках (Макс. 2 руки: двуручное или 1р + щит/жезл)</div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
                        ${renderBodySlot('mainHand', '🗡️', 'Правая / Ведущая рука')}
                        ${renderBodySlot('offHand', '🛡️', 'Левая рука (Щит / Второе / Жезл)')}
                    </div>
                </div>
            </div>

            <!-- ПРАВАЯ КОЛОНКА: Свободные слоты вложения (Кольца/Эонские камни/Татуировки) + Сумки и Рюкзак -->
            <div style="display:flex; flex-direction:column; gap:12px;">
                <div class="k-panel" style="padding:12px 14px; border:1px solid #8a6421;">
                    <div style="font-size:14px; font-weight:bold; color:#a29bfe; margin-bottom:4px;">💍 Кольца, Эонские камни и Татуировки</div>
                    <div style="font-size:11px; color:#a4b0be; margin-bottom:8px; line-height:1.35;">
                        В PF2e нет лимита «только 2 кольца» — ограничения задаёт только общий дневной лимит <b>10 вложенных предметов</b>. При снятии вложенного предмета лимит возвращается только после 🌅 Ежедневной подготовки.
                    </div>
                    ${extraInvestedRows}
                </div>

                <div class="k-panel" style="padding:12px 14px; border:1px solid #8a6421;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <span style="font-size:14px; font-weight:bold; color:#ffd875;">🎒 Походный рюкзак (4.0 Массы)</span>
                        <span style="font-size:11px; color:#2ecc71;">Первые 2.0 Массы не весят!</span>
                    </div>
                    <div style="font-size:11px; color:#a4b0be; margin-bottom:8px; line-height:1.35;">
                        Доставать вещи из рюкзака в бою неудобно (2 ◆: снять рюкзак и достать), поэтому здесь хранятся спальник, пайки, верёвка и запасные факелы.
                    </div>
                    <div id="bstPage3BackpackSummary" style="font-size:12px; color:#ebd291; background:rgba(0,0,0,0.35); border:1px solid #543e0d; border-radius:5px; padding:8px;">
                        Все 15 слотов рюкзака синхронизированы со Стр. 2. Нажмите «Стр. 2: Инвентарь» для покупки, продажи или редактирования содержимого.
                    </div>
                </div>
            </div>
        </div>
    `;
}


export function openCharacterSheetModal(hero, onSaveCallback, pageNum = 1) {
    hideSheetItemTooltip(); // 1. Вставить в первую строку функции
    if (!hero) return;
    const stats = ensureCharacterStats(hero);
    const isPage1 = pageNum === 1;
    const isPage2 = pageNum === 2;
    const isPage3 = pageNum === 3;

    const pageTitles = {
        1: `🛡️ Бланк: ${hero.name} — Стр. 1 (Бой и Навыки)`,
        2: `📜 Бланк: ${hero.name} — Стр. 2 (Снаряжение и Магия)`,
        3: `🧍 Бланк: ${hero.name} — Стр. 3 (Кукла и Пояс)`
    };

    const pageBodyHtml = isPage1
        ? buildPage1Html(stats)
        : (isPage2 ? buildPage2Html(stats) : buildPage3Html(hero));

    const goToPage = (targetPage) => {
        hideSheetItemTooltip();
        collectFormData(overlay, hero);
        onSaveCallback();
        close();
        openCharacterSheetModal(hero, onSaveCallback, targetPage);
    };

    const navButtons = [
        !isPage1 ? { label: '🛡️ Стр. 1: Бой', variant: 'cc', onClick: () => goToPage(1) } : null,
        !isPage2 ? { label: '📜 Стр. 2: Инвентарь и Магия', variant: 'cc', onClick: () => goToPage(2) } : null,
        !isPage3 ? { label: '🧍 Стр. 3: Кукла и Пояс', variant: 'cc', onClick: () => goToPage(3) } : null
    ].filter(Boolean);

    const { overlay, close } = ModalManager.open({
        id: 'bstHeroSheetModal',
        title: pageTitles[pageNum] || pageTitles[1],
        width: '1420px',
        borderColor: '#dfbc6f',
        bodyHtml: pageBodyHtml,
        footerButtons: [
            ...navButtons,
            {
                label: '🖨️ Экспорт в PDF',
                variant: 'cc',
                onClick: () => {
                    collectFormData(overlay, hero);
                    exportCharacterToPdf(hero);
                }
            },
            {
                label: '✖ Отмена',
                variant: 'cc',
                onClick: () => {
                    hideSheetItemTooltip();
                    close();
                }
            },
            {
                label: '⚜ Сохранить бланк',
                variant: 'ok',
                onClick: () => {
                    hideSheetItemTooltip();
                    collectFormData(overlay, hero);
                    onSaveCallback();
                    close();
                }
            }
        ]

    });

    // Закрытие тултипа при клике по тёмному фону вокруг бланка
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) hideSheetItemTooltip();
    });

    if (isPage1) {

//        const lvlInp = overlay.querySelector('[data-sheet-num="level"]');

        const runLevelProgression = () => {
            const newLvl = Math.max(1, parseInt(lvlInp?.value, 10) || 1);
            hero.stats.level = newLvl;

            // Пересчёт Макс. ПЗ, Атаки заклинанием и СЛ заклинаний
            const res = recalculateLevelProgression(overlay, hero);

            // Обновление ячеек заклинаний (1–4 круги)
            const info = getMagicTierVisibility(hero.stats);
            hero.stats.lvl1PerDay = info.lvl1Slots;
            hero.stats.lvl2PerDay = info.lvl2Slots;
            hero.stats.lvl3PerDay = info.lvl3Slots;
            hero.stats.lvl4PerDay = info.lvl4Slots;

            // Пересчёт ПЗ и КБ спутника под новый уровень хозяина
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

        const lvlInp = overlay.querySelector('[data-sheet-num="level"]');
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


        // Тултип: Доспех (статы, эффект группы и дескрипторы)
        bindSheetTooltip(overlay.querySelector('[data-sheet-txt="armorName"]')?.closest('div'), () => {
            const val = overlay.querySelector('[data-sheet-txt="armorName"]')?.value.trim();
            if (!val) return null;
            const found = (PF2E_ARMOR_CATALOG || []).find(a => normName(a.name) === normName(val));
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

        // Тултип: Щит (Бонус КБ, Твёрдость, ПЗ, Порог поломки и действия)
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

        const normName = (s) => String(s || '').replace(/[^\p{L}\p{N}\s-]/gu, '').trim().toLowerCase().replace(/ё/g, 'е');

        // Тултип: Происхождение
        bindSheetTooltip(overlay.querySelector('[data-sheet-txt="background"]')?.closest('.bst-top-field'), () => {
            const val = overlay.querySelector('[data-sheet-txt="background"]')?.value.trim();
            if (!val) return null;
            const found = (PF2E_BACKGROUNDS || []).find(b => normName(b.name) === normName(val));
            return [
                '<div class="init-tip-header"><span class="init-tip-name">📜 ' + val + '</span><span class="init-tip-turn-tag" style="border-color:#74b9ff; color:#74b9ff;">ПРОИСХОЖДЕНИЕ</span></div>',
                found ? '<div style="font-size:13px; margin-top:6px; color:#ebd291; line-height:1.4;">' + (found.desc || '') + '</div>' : '',
                found?.feat ? '<div style="font-size:12px; margin-top:6px; color:#74b9ff;">✨ Бонусная черта: <b>' + found.feat + '</b></div>' : ''
            ].join('');
        });

        // Тултип: Класс
        bindSheetTooltip(overlay.querySelector('[data-sheet-txt="charClass"]')?.closest('.bst-top-field'), () => {
            const val = overlay.querySelector('[data-sheet-txt="charClass"]')?.value.trim();
            if (!val) return null;
            const found = (PF2E_CLASSES || []).find(c => normName(c.name) === normName(val));
            return [
                '<div class="init-tip-header"><span class="init-tip-name">⚔️ ' + val + '</span><span class="init-tip-turn-tag" style="border-color:#ffd875; color:#ffd875;">КЛАСС</span></div>',
                found ? '<div class="init-tip-top-row"><span>⭐ Ключевая: <b>' + (found.keyStat || '—') + '</b></span><span>❤️ ПЗ за ур.: <b>+' + (found.hp || 8) + '</b></span></div>' : '',
                found?.desc ? '<div style="font-size:13px; margin-top:6px; color:#ebd291; line-height:1.4;">' + found.desc + '</div>' : ''
            ].join('');
        });

        // Тултип: Способность народа / Наследие
        bindSheetTooltip(overlay.querySelector('[data-sheet-txt="heritage"]')?.closest('div'), () => {
            const val = overlay.querySelector('[data-sheet-txt="heritage"]')?.value.trim();
            if (!val) return null;
            const found = (PF2E_HERITAGES || []).find(h => normName(h.name) === normName(val));
            return [
                '<div class="init-tip-header"><span class="init-tip-name">🧬 ' + val + '</span><span class="init-tip-turn-tag" style="border-color:#2ecc71; color:#2ecc71;">НАСЛЕДИЕ</span></div>',
                found ? '<div class="init-tip-top-row"><span>👥 Народ: <b>' + (found.ancestryName || 'Общее') + '</b></span>' + (found.source ? '<span>📚 ' + found.source + '</span>' : '') + '</div>' : '',
                found?.desc ? '<div style="font-size:13px; margin-top:6px; color:#ebd291; line-height:1.4;">' + found.desc + '</div>' : ''
            ].join('');
        });

        // 1. Тултип способности происхождения
        bindSheetTooltip(overlay.querySelector('[data-sheet-txt="backgroundFeat"]')?.closest('div'), () => {
            const name = overlay.querySelector('[data-sheet-txt="backgroundFeat"]')?.value.trim();
            if (!name) return null;
            const found = (PF2E_BACKGROUNDS || []).find(b => b.feat?.toLowerCase() === name.replace(/📜\s*/, '').toLowerCase());
            return `<div class="init-tip-header"><span class="init-tip-name">${name}</span><span class="init-tip-turn-tag" style="border-color:#74b9ff; color:#74b9ff;">ЧЕРТА ПРОИСХОЖДЕНИЯ</span></div><div style="font-size:13px; margin-top:6px; color:#ebd291; line-height:1.4;">${found?.desc || 'Способность происхождения.'}</div>`;
        });

        // Тултипы 3 ячеек действий
        overlay.querySelectorAll('.bst-action-slot').forEach(slotEl => {
            const idx = slotEl.dataset.actionSlot;
            bindSheetTooltip(slotEl, () => {
                const name = overlay.querySelector(`[data-sheet-txt="actionSlot${idx}Name"]`)?.value.trim();
                if (!name) return null;
                const desc = overlay.querySelector(`[data-sheet-txt="actionSlot${idx}Desc"]`)?.value.trim() || 'Описание действия отсутствует.';
                return `<div class="init-tip-header"><span class="init-tip-name">⚡ ${name}</span><span class="init-tip-turn-tag" style="border-color:#2ecc71; color:#2ecc71;">ДЕЙСТВИЕ</span></div><div style="font-size:13px; margin-top:6px; color:#ebd291; line-height:1.4;">${desc}</div>`;
            });
        });

        // 2. Тултипы оружия (с критическим эффектом группы и расшифровкой дескрипторов)
        overlay.querySelectorAll('.bst-weapon-row').forEach((row, rIdx) => {
            const slot = rIdx === 0 ? 'melee1' : (rIdx === 1 ? 'melee2' : 'ranged');
            const isRanged = slot === 'ranged';
            bindSheetTooltip(row, () => {
                const name = overlay.querySelector(`[data-sheet-txt="${slot}Name"]`)?.value.trim();
                if (!name) return null;
                const atk = overlay.querySelector(`[data-sheet-txt="${slot}Atk"]`)?.value.trim() || '—';
                const dmg = overlay.querySelector(`[data-sheet-txt="${slot}Dmg"]`)?.value.trim() || '—';
                const traits = overlay.querySelector(`[data-sheet-txt="${slot}Traits"]`)?.value.trim() || '';

                const pool = isRanged ? PF2E_RANGED_WEAPONS : PF2E_MELEE_WEAPONS;
                const found = (pool || []).find(w => normName(w.name) === normName(name));
                const critEff = found ? getWeaponCritEffect(found.group) : '';
                const traitsList = getWeaponTraitsDetails(traits || found?.traits || '');

                const traitsHtml = traitsList.length
                    ? `<div style="margin-top:6px; border-top:1px dashed rgba(235,210,145,0.25); padding-top:4px; font-size:12px; color:#ebd291;">` +
                    traitsList.map(t => `<div>🏷️ <b>${t.trait}</b>${t.desc ? `: ${t.desc}` : ''}</div>`).join('') +
                    `</div>`
                    : '';

                return [
                    `<div class="init-tip-header"><span class="init-tip-name">⚔️ ${name}</span>${found ? `<span class="init-tip-turn-tag" style="border-color:#ffd875; color:#ffd875;">${found.group.toUpperCase()}</span>` : ''}</div>`,
                    `<div class="init-tip-top-row"><span>🎯 Атака: <b>${atk}</b></span><span>💥 Урон: <b>${dmg}</b></span></div>`,
                    critEff ? `<div style="font-size:12px; margin-top:5px; color:#ff7675;">💥 <b>Крит. специализация:</b> ${critEff}</div>` : '',
                    traitsHtml
                ].join('');
            });
        });

        // Тултипы навыков (разбор: Характеристика + Умение + Предмет − Штраф брони)
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

        // 3. Тултипы боевых черт
        overlay.querySelectorAll('.bst-cantrips-table tbody tr').forEach(tr => {
            const nameInp = tr.querySelector('.bst-ranger-feat-picker-inp');
            if (!nameInp) return;
            bindSheetTooltip(tr, () => {
                const name = nameInp.value.trim();
                if (!name) return null;
                const lvl = nameInp.dataset.featLevel;
                const desc = overlay.querySelector(`[data-sheet-txt="classFeatLvl${lvl}Desc"]`)?.value || '';
                return `<div class="init-tip-header"><span class="init-tip-name">⚔️ ${name}</span><span class="init-tip-turn-tag" style="border-color:#2ecc71; color:#2ecc71;">УР. ${lvl}</span></div><div style="font-size:13px; margin-top:6px; color:#ebd291; line-height:1.4;">${desc}</div>`;
            });
        });

        // Переключение вкладок черт (Классовые / Общие / Навыков / Народа)
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

        // Тултипы для всех 4 типов черт
        overlay.querySelectorAll('.bst-cantrips-table tbody tr').forEach(tr => {
            const nameInp = tr.querySelector('input[data-feat-kind]');
            if (!nameInp) return;
            bindSheetTooltip(tr, () => {
                const name = nameInp.value.trim();
                if (!name) return null;
                const lvl = nameInp.dataset.featLevel;
                const kind = nameInp.dataset.featKind;
                const prefixMap = { class: 'classFeatLvl', general: 'genFeatLvl', skill: 'skillFeatLvl', ancestry: 'ancFeatLvl' };
                const labelMap = { class: 'КЛАСС', general: 'ОБЩАЯ', skill: 'НАВЫК', ancestry: 'НАРОД' };
                const desc = overlay.querySelector(`[data-sheet-txt="${prefixMap[kind]}${lvl}Desc"]`)?.value || '';
                return `<div class="init-tip-header"><span class="init-tip-name">⚔️ ${name}</span><span class="init-tip-turn-tag" style="border-color:#2ecc71; color:#2ecc71;">${labelMap[kind]} • УР. ${lvl}</span></div><div style="font-size:13px; margin-top:6px; color:#ebd291; line-height:1.4;">${desc}</div>`;
            });
        });

    } else if (isPage2) {
        initPage2Pickers(overlay, hero);

        // 3. Тултип бейджа Массы (разбивка: Броня + Оружие + Рюкзак + Монеты)
        const bulkBadgeEl = overlay.querySelector('#bstBulkCounterBadge');
        if (bulkBadgeEl) {
            bulkBadgeEl.style.cursor = 'help';
            bindSheetTooltip(bulkBadgeEl, () => {
                collectFormData(overlay, hero);
                const b = calculateCharacterBulk(hero.stats);
                const bd = b.breakdown || { armor: '0', weapons: '0', backpack: '0', coins: '0', totalCoins: 0 };
                const bulkStr = `${b.totalBulk}${b.remLight > 0 ? ` и ${b.remLight} Л` : ''}`;
                const strMod = Number(hero.stats.str) || 0;

                return [
                    `<div class="init-tip-header"><span class="init-tip-name">🎒 Детализация Массы (Bulk)</span><span class="init-tip-turn-tag" style="border-color:#ffd875; color:#ffd875;">${bulkStr} / ${b.encumberedLimit}</span></div>`,
                    `<div class="init-tip-2col" style="font-size:13px; margin-top:6px;">`,
                    `<div>🛡️ Доспех: <b>${bd.armor}</b></div>`,
                    `<div>⚔️ Оружие: <b>${bd.weapons}</b></div>`,
                    `<div>📦 Рюкзак и щит: <b>${bd.backpack}</b></div>`,
                    `<div>🪙 Монеты (${bd.totalCoins}): <b>${bd.coins}</b></div>`,
                    `</div>`,
                    `<div style="margin-top:6px; border-top:1px dashed rgba(235,210,145,0.25); padding-top:4px; font-size:12px; color:#ebd291;">`,
                    `<div>📏 Порог перегрузки: <b>5 + ${strMod} (СИЛ)${b.extraLimit > 0 ? ` + ${b.extraLimit} (предмет)` : ''} = ${b.encumberedLimit}</b> (Макс.: <b>${b.maxLimit}</b>)</div>`,
                    `<div style="color:#a4b0be; margin-top:2px;">10 Лёгких (Л) = 1 Масса • 1000 монет = 1 Масса</div>`,
                    `</div>`
                ].join('');
            });
        }


        const refreshBulkBadge = () => {
            collectFormData(overlay, hero);
            const b = calculateCharacterBulk(hero.stats);
            const badge = overlay.querySelector('#bstBulkCounterBadge');
            if (!badge) return;

            const bulkStr = `${b.totalBulk}${b.remLight > 0 ? ` и ${b.remLight} Л` : ''}`;
            if (b.isOverloaded) {
                badge.style.borderColor = '#e74c3c';
                badge.style.color = '#ff7675';
                badge.innerHTML = `🚫 Масса: <b>${bulkStr}</b> / ${b.encumberedLimit} (Макс. ${b.maxLimit}) — НЕЛЬЗЯ ПОДНЯТЬ!`;
            } else if (b.isEncumbered) {
                badge.style.borderColor = '#f39c12';
                badge.style.color = '#fdcb6e';
                badge.innerHTML = `⚠️ Перегрузка: <b>${bulkStr}</b> / ${b.encumberedLimit} (Неуклюжесть 1, −10 фт. скорости)`;
            } else {
                badge.style.borderColor = '#2ecc71';
                badge.style.color = '#2ecc71';
                badge.innerHTML = `🎒 Масса: <b>${bulkStr}</b> / ${b.encumberedLimit} (Макс. ${b.maxLimit})`;
            }
        };

        // Управление личным кошельком героя (укрупнение, перевод союзнику/в казну, покупка)
        const syncCoinsInputs = () => {
            const gEl = overlay.querySelector('[data-sheet-num="coinsGold"]');
            const sEl = overlay.querySelector('[data-sheet-num="coinsSilver"]');
            const cEl = overlay.querySelector('[data-sheet-num="coinsCopper"]');
            if (gEl) gEl.value = hero.stats.coinsGold ?? 0;
            if (sEl) sEl.value = hero.stats.coinsSilver ?? 0;
            if (cEl) cEl.value = hero.stats.coinsCopper ?? 0;
            refreshBulkBadge();
        };

        overlay.querySelector('#btnHeroCoinsConvert')?.addEventListener('click', () => {
            collectFormData(overlay, hero);
            const totalCp = (Number(hero.stats.coinsGold) || 0) * 100 +
                (Number(hero.stats.coinsSilver) || 0) * 10 +
                (Number(hero.stats.coinsCopper) || 0);
            hero.stats.coinsGold = Math.floor(totalCp / 100);
            hero.stats.coinsSilver = Math.floor((totalCp % 100) / 10);
            hero.stats.coinsCopper = totalCp % 10;
            syncCoinsInputs();
        });

        overlay.querySelector('#btnHeroCoinsTransfer')?.addEventListener('click', () => {
            collectFormData(overlay, hero);
            const curG = Math.max(0, Number(hero.stats.coinsGold) || 0);
            const curS = Math.max(0, Number(hero.stats.coinsSilver) || 0);
            const curC = Math.max(0, Number(hero.stats.coinsCopper) || 0);
            const totalAvailableCp = curG * 100 + curS * 10 + curC;

            const partyList = (window.BestiaryManager?.state?.party || []).filter(p => p && p.id !== hero.id && !p.inactive);
            const targetOptionsHtml = [
                `<option value="spend">🛒 Траты / Покупка / Услуги (списать со счёта)</option>`,
                `<option value="treasury">💰 В общую казну отряда</option>`,
                ...partyList.map(p => `<option value="hero:${p.id}">🛡️ Передать герою: ${esc(p.name)}</option>`)
            ].join('');

            const txModal = ModalManager.open({
                id: 'bstHeroCoinTxModal',
                title: `💸 Кошелёк: ${esc(hero.name)}`,
                width: '440px',
                borderColor: '#ffd875',
                bodyHtml: `
                    <div style="font-size: 14px; color: #ebd291; line-height: 1.5;">
                        <div style="margin-bottom: 8px; padding: 6px 10px; background: rgba(4,9,5,0.75); border: 1px solid #543e0d; border-radius: 5px;">
                            В кошельке: <b style="color:#ffd875;">${curG} ЗМ</b>, <b style="color:#dfe6e9;">${curS} СМ</b>, <b style="color:#e17055;">${curC} ММ</b>
                            <span style="color:#a4b0be; font-size:12px;">(всего ${(totalAvailableCp / 100).toFixed(2)} ЗМ)</span>
                        </div>
                        <div style="margin-bottom: 8px;">
                            <label style="font-size: 12px; color: #ffd875; font-weight: bold;">Куда направить монеты:</label>
                            <select id="bstTxTargetSel" class="k-inp" style="width: 100%; margin-top: 3px; padding: 6px; background: #040905; border: 1px solid #543e0d; color: #ebd291;">
                                ${targetOptionsHtml}
                            </select>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 8px;">
                            <div>
                                <span style="font-size: 12px; color: #ffd875;">🥇 ЗМ:</span>
                                <input type="number" id="bstTxGold" class="k-inp" min="0" value="0" style="width: 100%; text-align: center;">
                            </div>
                            <div>
                                <span style="font-size: 12px; color: #dfe6e9;">🥈 СМ:</span>
                                <input type="number" id="bstTxSilver" class="k-inp" min="0" value="0" style="width: 100%; text-align: center;">
                            </div>
                            <div>
                                <span style="font-size: 12px; color: #e17055;">🥉 ММ:</span>
                                <input type="number" id="bstTxCopper" class="k-inp" min="0" value="0" style="width: 100%; text-align: center;">
                            </div>
                        </div>
                        <input type="text" id="bstTxNote" class="k-inp" placeholder="Комментарий (напр. Зелье лечения, на доспех)..." style="width: 100%; font-size: 13px; padding: 6px 8px;">
                        <div id="bstTxErr" style="color: #ff7675; font-size: 12px; margin-top: 6px; min-height: 16px;"></div>
                    </div>
                `,

                footerButtons: [

                    {
                        label: '✅ Выполнить',
                        variant: 'ok',
                        onClick: () => {
                            const g = Math.max(0, parseInt(document.getElementById('bstTxGold')?.value, 10) || 0);
                            const s = Math.max(0, parseInt(document.getElementById('bstTxSilver')?.value, 10) || 0);
                            const c = Math.max(0, parseInt(document.getElementById('bstTxCopper')?.value, 10) || 0);
                            const sendCp = g * 100 + s * 10 + c;
                            const errEl = document.getElementById('bstTxErr');

                            if (sendCp <= 0) {
                                if (errEl) errEl.textContent = '⚠️ Укажите сумму больше 0.';
                                return;
                            }
                            if (sendCp > totalAvailableCp) {
                                if (errEl) errEl.textContent = '⚠️ Недостаточно монет в кошельке героя!';
                                return;
                            }

                            // 1. Вычисляем остаток у отправителя с автоматическим разменом
                            const remCp = totalAvailableCp - sendCp;
                            const nextG = Math.floor(remCp / 100);
                            const nextS = Math.floor((remCp % 100) / 10);
                            const nextC = remCp % 10;

                            hero.stats.coinsGold = nextG;
                            hero.stats.coinsSilver = nextS;
                            hero.stats.coinsCopper = nextC;

                            // 2. Синхронизируем кошелёк отправителя в Бестиарии (отряд/резерв) и трекере инициативы
                            const allBestiaryHeroes = [
                                ...(window.BestiaryManager?.state?.party || []),
                                ...(window.BestiaryManager?.state?.inactive || [])
                            ];
                            const normSenderName = String(hero.name || '').trim().toLowerCase();

                            allBestiaryHeroes.forEach(p => {
                                if (p && (p.id === hero.id || String(p.name || '').trim().toLowerCase() === normSenderName)) {
                                    if (!p.stats) p.stats = {};
                                    p.stats.coinsGold = nextG;
                                    p.stats.coinsSilver = nextS;
                                    p.stats.coinsCopper = nextC;
                                }
                            });

                            (window.InitiativeManager?.state?.combatants || []).forEach(u => {
                                if (u && u.faction === 'friend' && String(u.name || '').trim().toLowerCase() === normSenderName) {
                                    if (!u.stats) u.stats = {};
                                    u.stats.coinsGold = nextG;
                                    u.stats.coinsSilver = nextS;
                                    u.stats.coinsCopper = nextC;
                                }
                            });

                            // 3. Обновляем поля ввода в текущем бланке ДО вызова refreshBulkBadge
                            const gEl = overlay.querySelector('[data-sheet-num="coinsGold"]');
                            const sEl = overlay.querySelector('[data-sheet-num="coinsSilver"]');
                            const cEl = overlay.querySelector('[data-sheet-num="coinsCopper"]');
                            if (gEl) { gEl.value = String(nextG); gEl.setAttribute('value', String(nextG)); }
                            if (sEl) { sEl.value = String(nextS); sEl.setAttribute('value', String(nextS)); }
                            if (cEl) { cEl.value = String(nextC); cEl.setAttribute('value', String(nextC)); }

                            const target = document.getElementById('bstTxTargetSel')?.value || 'spend';
                            const note = String(document.getElementById('bstTxNote')?.value || '').trim();

                            if (target === 'treasury' && window.BestiaryManager?.addTreasuryLoot) {
                                window.BestiaryManager.addTreasuryLoot(g, s, c, `${hero.name}${note ? ': ' + note : ''}`);
                            } else if (target.startsWith('hero:')) {
                                const recipientId = target.slice(5);
                                const recipient = allBestiaryHeroes.find(p => p && p.id === recipientId);
                                if (recipient) {
                                    if (!recipient.stats) recipient.stats = {};
                                    recipient.stats.coinsGold = (Number(recipient.stats.coinsGold) || 0) + g;
                                    recipient.stats.coinsSilver = (Number(recipient.stats.coinsSilver) || 0) + s;
                                    recipient.stats.coinsCopper = (Number(recipient.stats.coinsCopper) || 0) + c;

                                    // Синхронизируем кошелёк получателя с трекером инициативы
                                    const normRecName = String(recipient.name || '').trim().toLowerCase();
                                    (window.InitiativeManager?.state?.combatants || []).forEach(u => {
                                        if (u && u.faction === 'friend' && String(u.name || '').trim().toLowerCase() === normRecName && u.stats && u.stats !== recipient.stats) {
                                            u.stats.coinsGold = recipient.stats.coinsGold;
                                            u.stats.coinsSilver = recipient.stats.coinsSilver;
                                            u.stats.coinsCopper = recipient.stats.coinsCopper;
                                        }
                                    });

                                    const coinParts = [g > 0 ? `${g} ЗМ` : '', s > 0 ? `${s} СМ` : '', c > 0 ? `${c} ММ` : ''].filter(Boolean).join(' ');
                                    StorageManager.appendTreasuryLog(`💸 ${hero.name} → ${recipient.name}: ${coinParts}${note ? ` (${note})` : ''}`, 'transfer');
                                }
                            }

                            refreshBulkBadge();
                            if (window.BestiaryManager?._save) window.BestiaryManager._save();
                            txModal.close();
                        }
                    }




                ]


            });

            if (txModal?.overlay) txModal.overlay.style.zIndex = '10000250';
        });


        overlay.querySelectorAll('.bst-items-table input, [data-sheet-num^="coins"]').forEach(el => {
            el.addEventListener('input', refreshBulkBadge);
            el.addEventListener('change', refreshBulkBadge);
        });
        overlay.querySelectorAll('.bst-qty-btn').forEach(btn => {
            btn.addEventListener('click', () => setTimeout(refreshBulkBadge, 10));
        });
        refreshBulkBadge();

        // 1. Тултипы всех 4 типов заклинаний (фокусы, фокальные, 1 и 2 круг)
        const magicGroups = [
            { prefix: 'cantrip', rowAttr: 'cantripRow', icon: '✨' },
            { prefix: 'focusSpell', rowAttr: 'focusRow', icon: '💠' },
            { prefix: 'lvl1Spell', rowAttr: 'lvl1Row', icon: '1️⃣' },
            { prefix: 'lvl2Spell', rowAttr: 'lvl2Row', icon: '2️⃣' },
            { prefix: 'lvl3Spell', rowAttr: 'lvl3Row', icon: '3️⃣' },
            { prefix: 'lvl4Spell', rowAttr: 'lvl4Row', icon: '4️⃣' }
        ];

        overlay.querySelectorAll('.bst-cantrips-table tbody tr').forEach(tr => {
            for (const g of magicGroups) {
                const nameInp = tr.querySelector(`input[data-sheet-txt^="${g.prefix}"]`);
                if (!nameInp) continue;
                bindSheetTooltip(tr, () => {
                    const name = nameInp.value.trim();
                    if (!name) return null;
                    const idx = nameInp.dataset[g.rowAttr];
                    const act = overlay.querySelector(`[data-sheet-txt="${g.prefix}${idx}Actions"]`)?.value || '—';
                    const notes = overlay.querySelector(`[data-sheet-txt="${g.prefix}${idx}Notes"]`)?.value || 'Описание отсутствует.';
                    return `<div class="init-tip-header"><span class="init-tip-name">${g.icon} ${name}</span></div><div class="init-tip-top-row"><span>⏳ Действие: <b>${act}</b></span></div><div style="font-size:13px; margin-top:6px; color:#ebd291;">${notes}</div>`;
                });
                break;
            }
        });

        // 2. Тултипы предметов в рюкзаке
        overlay.querySelectorAll('.bst-items-table tbody tr').forEach(tr => {
            bindSheetTooltip(tr, () => {
                const name = tr.querySelector('input[data-sheet-txt$="Name"]')?.value.trim();
                if (!name) return null;
                const notes = tr.querySelector('input[data-sheet-txt$="Notes"]')?.value.trim() || 'Описание отсутствует.';
                const heroLvl = Math.max(1, parseInt(hero.stats.level, 10) || 1);

                const cleanName = name.replace(/^[^\p{L}\p{N}]+/u, '').trim().toLowerCase().replace(/ё/g, 'е');
                const found = PF2E_ITEMS_CATALOG.find(it => {
                    const target = it.name.replace(/^[^\p{L}\p{N}]+/u, '').trim().toLowerCase().replace(/ё/g, 'е');
                    return target === cleanName || (cleanName.length > 3 && target.includes(cleanName));
                });
                const reqLvl = found ? getItemLevel(found) : 0;
                const lvlBadge = reqLvl > 0
                    ? `<span class="init-tip-turn-tag" style="border-color:${reqLvl > heroLvl ? '#e74c3c' : '#2ecc71'}; color:${reqLvl > heroLvl ? '#ff7675' : '#2ecc71'};">УР. ${reqLvl}</span>`
                    : '';
                const lockWarn = reqLvl > heroLvl
                    ? `<div style="font-size:12px; color:#ff7675; margin-bottom:5px; font-weight:bold;">🔒 Требуется ${reqLvl} уровень персонажа (бонусы предмета заблокированы)</div>`
                    : '';

                return `<div class="init-tip-header"><span class="init-tip-name">🎒 ${name}</span>${lvlBadge}</div>${lockWarn}<div style="font-size:13px; color:#ebd291;">${notes}</div>`;
            });
        });

    } else if (isPage3) {
        initPage3Pickers(overlay, hero);
    }
}


