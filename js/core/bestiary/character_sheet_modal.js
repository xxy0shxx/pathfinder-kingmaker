import ModalManager from '../../ui/modal_manager.js';
import { PF2E_BACKGROUNDS } from '../../config/backgrounds_catalog.js';
import { PF2E_SHEET_CONFIG, SHORT_TO_FULL_SKILL_MAP, ensureCharacterStats } from './bestiary_config.js';
import { recalculateSheetStats } from './sheet_calculator.js';
import { initPage1Pickers, initPage2Pickers } from './sheet_pickers.js';
import { bindSheetTooltip, hideSheetItemTooltip } from './bestiary_tooltip_builder.js';
import { PF2E_CLASSES } from '../../config/meta_catalog.js';
import { PF2E_HERITAGES } from '../../config/heritages_catalog.js';
import { PF2E_COMPANION_ABILITIES, calcCompanionStats } from '../../config/companions_catalog.js';


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
            <div class="bst-top-field bst-narrow"><span>⭐ Уровень</span>${numInp(stats, 'level', 'bst-mini-num')}</div>
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
        <div class="k-panel">
            <div style="font-size: 12px; color: #2ecc71; font-weight: bold; margin-bottom: 4px; text-transform: uppercase;">⚔️ Боевые Черты Класса и Архетипов</div>
            <table class="k-table bst-cantrips-table" style="width: 100%;">
                <thead><tr><th style="width: 45px; text-align: center;">Ур.</th><th style="width: 35%;">Название черты</th><th>Действие и Эффект</th></tr></thead>
                <tbody>
                    ${[1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20].map(lvl => `
                        <tr>
                            <td class="bst-cantrip-num" style="color: #2ecc71; font-weight: bold; text-align: center;">${lvl}</td>
                            <td style="position: relative;">
                                <input type="text" data-sheet-txt="classFeatLvl${lvl}Name" data-feat-level="${lvl}" class="k-inp bst-txt-inp bst-ranger-feat-picker-inp" autocomplete="off" placeholder="Поиск черты ${lvl} ур..." value="${esc(stats[`classFeatLvl${lvl}Name`] ?? '')}">
                                <div class="bst-cantrip-dropdown" data-feat-drop="${lvl}" style="display: none;"></div>
                            </td>
                            <td>${txtInp(stats, `classFeatLvl${lvl}Desc`, 'Действие, требования, бонус...')}</td>
                        </tr>`).join('')}
                </tbody>
            </table>
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
        'псионик', 'psychic',
        'магус', 'magus',
        'призыватель', 'summoner'
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
        return { showLvl1: false, showLvl2: false, lvl1Slots: 0, lvl2Slots: 0 };
    }

    const hasBonusSlot = matchWord(extraSlotKeywords);

    // 1 круг:
    // Обычные кастеры (друид, бард, ведьма...): 1 ур -> 2 ячейки, 2+ ур -> 3 ячейки
    // Жрец, Волшебник, Чародей: 1 ур -> 3 ячейки, 2+ ур -> 4 ячейки
    const baseLvl1 = lvl >= 2 ? 3 : 2;
    const lvl1Slots = baseLvl1 + (hasBonusSlot ? 1 : 0);

    // 2 круг (открывается с 3 уровня):
    // Обычные кастеры: 3 ур -> 2 ячейки, 4+ ур -> 3 ячейки
    // Жрец, Волшебник, Чародей: 3 ур -> 3 ячейки, 4+ ур -> 4 ячейки
    let lvl2Slots = 0;
    if (lvl >= 3) {
        const baseLvl2 = lvl >= 4 ? 3 : 2;
        lvl2Slots = baseLvl2 + (hasBonusSlot ? 1 : 0);
    }

    return {
        showLvl1: true,
        showLvl2: lvl >= 3,
        lvl1Slots,
        lvl2Slots
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
                <input type="text" data-sheet-txt="item${idx}Name" data-item-row="${idx}" class="k-inp bst-txt-inp bst-item-picker-inp" autocomplete="off" placeholder="Выберите предмет..." value="${esc(stats[`item${idx}Name`])}">
                <div class="bst-cantrip-dropdown" data-item-drop="${idx}" style="display: none;"></div>
            </td>
            <td style="text-align: center;">
                <div class="bst-qty-stepper" style="display: inline-flex; align-items: center; gap: 4px; width: 110px;">
                    <button type="button" class="bst-qty-btn" data-qty-delta="-1" style="width:26px; height:26px; background:#292011; border:1px solid #543e0d; color:#ebd291;">−</button>
                    <input type="number" data-sheet-num="item${idx}Qty" class="k-inp bst-tiny-num bst-qty-inp" min="0" value="${stats[`item${idx}Qty`] ?? 1}" style="width:40px; text-align:center; color:#2ecc71; font-weight:900;">
                    <button type="button" class="bst-qty-btn" data-qty-delta="1" style="width:26px; height:26px; background:#292011; border:1px solid #543e0d; color:#ebd291;">+</button>
                </div>
            </td>
            <td>${txtInp(stats, `item${idx}Notes`, 'Эффект, вес...')}</td>
        </tr>`).join('');

    const magicInfo = getMagicTierVisibility(stats);

    // Всегда синхронизируем лимит слотов с текущим уровнем персонажа
    const lvl1PerDayVal = magicInfo.lvl1Slots;
    const lvl2PerDayVal = magicInfo.lvl2Slots;

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
                </div>
            </div>
            <div class="bst-sheet-col">
                <div class="k-panel" style="margin-bottom: 10px;">
                    <div class="k-sec-title">🎒 Снаряжение и Монеты</div>
                    <div class="bst-coins-row">
                        <label>🥉 ММ: ${numInp(stats, 'coinsCopper', 'bst-mini-num')}</label>
                        <label>🥈 СМ: ${numInp(stats, 'coinsSilver', 'bst-mini-num')}</label>
                        <label>🥇 ЗМ: ${numInp(stats, 'coinsGold', 'bst-mini-num')}</label>
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
                            <input type="text" class="k-inp bst-comp-ability-picker" autocomplete="off" placeholder="🔍 Поиск способностей...">
                            <div class="bst-cantrip-dropdown" data-comp-drop="1" style="display: none;"></div>
                        </div>
                    </div>
                    ${txtArea(stats, 'compAbilitiesText', 3, 'Способности питомца...')}
                </div>
                <div class="k-panel" style="margin-bottom: 10px;"><div class="k-sec-title">📖 Журнал приключений</div>${txtArea(stats, 'adventureLogText', 3)}</div>
                <div class="k-panel" style="margin-bottom: 10px;"><div class="k-sec-title">📝 Заметки</div>${txtArea(stats, 'notesText', 3)}</div>
                <div class="k-panel"><div class="k-sec-title">📚 Книга заклинаний</div>${txtArea(stats, 'spellbookText', 3)}</div>
            </div>
        </div>
    `;
}


// ➔ ВОТ СЮДА (в начало и внутрь кнопок openCharacterSheetModal):
export function openCharacterSheetModal(hero, onSaveCallback, pageNum = 1) {
    hideSheetItemTooltip(); // 1. Вставить в первую строку функции
    if (!hero) return;
    const stats = ensureCharacterStats(hero);
    const isPage1 = pageNum === 1;

    const { overlay, close } = ModalManager.open({
        id: 'bstHeroSheetModal',
        title: isPage1
            ? '🛡️ Бланк: ' + hero.name + ' — Стр. 1 (Бой и Навыки)'
            : '📜 Бланк: ' + hero.name + ' — Стр. 2 (Снаряжение и Магия)',
        width: '1420px',
        borderColor: '#dfbc6f',
        bodyHtml: isPage1 ? buildPage1Html(stats) : buildPage2Html(stats),
        footerButtons: [
            {
                label: isPage1 ? '📜 Стр. 2: Снаряжение и Магия ➔' : '⬅ 🛡️ Стр. 1: Бой и Навыки',
                variant: 'cc',
                onClick: () => {
                    hideSheetItemTooltip(); // 2. Вставить перед сохранением и переключением
                    collectFormData(overlay, hero);
                    onSaveCallback();
                    close();
                    openCharacterSheetModal(hero, onSaveCallback, isPage1 ? 2 : 1);
                }
            },
            {
                label: '✖ Отмена',
                variant: 'cc',
                onClick: () => {
                    hideSheetItemTooltip(); // 3. Вставить в кнопку отмены
                    close();
                }
            },
            {
                label: '⚜ Сохранить бланк',
                variant: 'ok',
                onClick: () => {
                    hideSheetItemTooltip(); // 4. Вставить в кнопку сохранения
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

    // ... дальше идёт блок if (isPage1) { ... } else { ... }


    if (isPage1) {
        const lvlInp = overlay.querySelector('[data-sheet-num="level"]');
        if (lvlInp) {
            lvlInp.addEventListener('change', () => {
                const newLvl = Math.max(1, parseInt(lvlInp.value, 10) || 1);
                hero.stats.level = newLvl;

                // Обновление ячеек заклинаний
                const info = getMagicTierVisibility(hero.stats);
                hero.stats.lvl1PerDay = info.lvl1Slots;
                hero.stats.lvl2PerDay = info.lvl2Slots;

                // Пересчет ПЗ и КБ спутника под новый уровень хозяина
                if (hero.stats.compType === 'familiar') {
                    const hasTough = String(hero.stats.compAbilitiesText || '').includes('Живучий');
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
            });
        }


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

        // 2. Тултипы оружия
        overlay.querySelectorAll('.bst-weapon-row').forEach((row, rIdx) => {
            const slot = rIdx === 0 ? 'melee1' : (rIdx === 1 ? 'melee2' : 'ranged');
            bindSheetTooltip(row, () => {
                const name = overlay.querySelector(`[data-sheet-txt="${slot}Name"]`)?.value.trim();
                if (!name) return null;
                const atk = overlay.querySelector(`[data-sheet-txt="${slot}Atk"]`)?.value.trim() || '—';
                const dmg = overlay.querySelector(`[data-sheet-txt="${slot}Dmg"]`)?.value.trim() || '—';
                const traits = overlay.querySelector(`[data-sheet-txt="${slot}Traits"]`)?.value.trim() || '';
                return `<div class="init-tip-header"><span class="init-tip-name">⚔️ ${name}</span></div><div class="init-tip-top-row"><span>🎯 Атака: <b>${atk}</b></span><span>💥 Урон: <b>${dmg}</b></span></div>${traits ? `<div style="font-size:12px; margin-top:4px; color:#ebd291;">${traits}</div>` : ''}`;
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
    } else {
        initPage2Pickers(overlay, hero);

        // 1. Тултипы всех 4 типов заклинаний (фокусы, фокальные, 1 и 2 круг)
        const magicGroups = [
            { prefix: 'cantrip', rowAttr: 'cantripRow', icon: '✨' },
            { prefix: 'focusSpell', rowAttr: 'focusRow', icon: '💠' },
            { prefix: 'lvl1Spell', rowAttr: 'lvl1Row', icon: '1️⃣' },
            { prefix: 'lvl2Spell', rowAttr: 'lvl2Row', icon: '2️⃣' }
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
                const notes = tr.querySelector('input[data-sheet-txt$="Notes"]')?.value.trim();
                return name ? `<div class="init-tip-header"><span class="init-tip-name">🎒 ${name}</span></div><div style="font-size:13px; color:#ebd291;">${notes || 'Описание отсутствует.'}</div>` : null;
            });
        });
    }

}


