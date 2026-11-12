import { MAP_CONFIG } from '../config/app_config.js';

/**
 * Модуль для управления кастомными выпадающими списками (Select UI)
 */
const UiSelectManager = {
    /**
     * Инициализация кастомных селекторов на странице
     */
    init() {
        this.populateSelectOptions();
        this.initDropdownLogic();
        this.initWorkSiteGuard();
    },

    /**
     * Самодостаточная защита списка рабочих участков внутри #hexMenu
     */
    initWorkSiteGuard() {
        const rules = MAP_CONFIG.workSiteRules || {};

        const syncGuard = () => {
            const menu = document.getElementById('hexMenu');
            if (!menu) return;

            // Ищем чекбокс «Территория королевства»
            const claimedCb = Array.from(menu.querySelectorAll('input[type="checkbox"]')).find(cb => {
                const row = cb.closest('.checkbox-row, label, div');
                return /королевств/i.test((row?.textContent || '') + ' ' + cb.id);
            });
            const isClaimed = !!claimedCb?.checked;

            // Ищем селект местности и селект рабочих участков
            const allSelects = Array.from(menu.querySelectorAll('.custom-select, select'));
            const terrainEl = allSelects.find(el =>
                el.querySelector('[data-value="plains"], option[value="plains"]')
            );
            const wsEl = allSelects.find(el =>
                el.querySelector('[data-value="farmlands"], option[value="farmlands"]')
            );
            if (!wsEl) return;

            const terrainVal = terrainEl?.tagName === 'SELECT'
                ? terrainEl.value
                : (terrainEl?.querySelector('input[type="hidden"]')?.value || '');

            const isAllowed = (wsVal) => {
                if (!wsVal || wsVal === 'none') return true;
                if (!isClaimed) return false;
                const r = rules[wsVal];
                return !r || (terrainVal && r.allowedTerrains.includes(terrainVal));
            };

            // 1. Приглушаем весь селект участков, если гекс не принадлежит королевству
            wsEl.classList.toggle('is-disabled', !isClaimed);
            wsEl.style.opacity = isClaimed ? '1' : '0.4';
            wsEl.style.pointerEvents = isClaimed ? 'auto' : 'none';
            if (!isClaimed) wsEl.classList.remove('active');

            // 2. Помечаем и блокируем недоступные пункты по рельефу
            wsEl.querySelectorAll('.custom-option, option').forEach(opt => {
                const val = opt.dataset?.value ?? opt.value;
                const ok = isAllowed(val);
                opt.classList.toggle('option-disabled', !ok);
                if (opt.tagName === 'OPTION') opt.disabled = !ok;
                opt.style.opacity = ok ? '1' : '0.35';
                opt.style.textDecoration = ok ? 'none' : 'line-through';
            });

            // 3. Сбрасываем выбранный участок в 'none', если он стал запрещён
            const curVal = wsEl.tagName === 'SELECT'
                ? wsEl.value
                : (wsEl.querySelector('input[type="hidden"]')?.value || 'none');

            if (!isAllowed(curVal)) {
                if (wsEl.tagName === 'SELECT') {
                    wsEl.value = 'none';
                } else {
                    const hid = wsEl.querySelector('input[type="hidden"]');
                    const trig = wsEl.querySelector('.custom-select-trigger');
                    const noneOpt = wsEl.querySelector('.custom-option[data-value="none"]');
                    if (hid) hid.value = 'none';
                    if (trig) trig.textContent = noneOpt ? noneOpt.textContent : 'Нет';
                    wsEl.querySelectorAll('.custom-option').forEach(o =>
                        o.classList.toggle('selected', o.dataset.value === 'none')
                    );
                }
            }




            // 4. Вывод расчётной стоимости ОР, СЛ освоения и кнопок быстрого списания из казны
            if (terrainEl) {
                let hintBox = menu.querySelector('#hexTerrainCostHint');
                if (!hintBox) {
                    hintBox = document.createElement('div');
                    hintBox.id = 'hexTerrainCostHint';
                    hintBox.style.cssText = 'margin-top:6px; padding:8px 10px; background:rgba(0,0,0,0.45); border:1px solid #543e0d; border-radius:4px; font-size:12px; color:#ebd291; line-height:1.4;';
                    (terrainEl.closest('.box') || terrainEl.parentElement).appendChild(hintBox);
                }

                const terr = MAP_CONFIG.terrains?.[terrainVal];
                const km = window.KingdomManager;
                if (!terr || !km?.state) {
                    hintBox.style.display = 'none';
                } else {
                    const kState = km.state;
                    const curRp = parseInt(kState.rp, 10) || 0;
                    const baseCtrlDc = (parseInt(kState.controlDcBase, 10) || 14) + (parseInt(kState.controlDcSize, 10) || 0);
                    const claimDc = baseCtrlDc + (terr.claimDcMod || 0);

                    const titleVal = menu.querySelector('input[type="text"]')?.value || '';
                    const descVal = menu.querySelector('textarea')?.value || '';
                    const combinedText = `${titleVal} ${descVal}`;
                    const hasBridge = /мост|bridge/i.test(combinedText);
                    const hasClearedRuins = /руин.*расчищ|расчищ.*руин|ruin.*clear/i.test(combinedText);

                    const claimCost = 1; // Захват гекса (Claim Hex) по правилам PF2e: 1 ОР
                    const clearCost = terr.clearCost || 0;
                    const rawSiteCost = terr.workSiteCost || 0;
                    const siteCost = (rawSiteCost > 0 && hasClearedRuins) ? Math.max(1, Math.floor(rawSiteCost / 2)) : rawSiteCost;
                    const roadCost = (terrainVal === 'water' && hasBridge) ? 1 : (terr.roadCost ?? 1);

                    const makeSpendBtn = (id, label, cost) => {
                        if (cost <= 0) return '';
                        const ok = curRp >= cost;
                        return `<button type="button" data-spend-rp="${cost}" data-spend-label="${label}" ${ok ? '' : 'disabled'}
                            style="padding:3px 7px; font-size:11px; font-weight:bold; border-radius:3px; cursor:${ok ? 'pointer' : 'not-allowed'};
                            background:${ok ? 'linear-gradient(180deg, #1e3c27 0%, #112417 100%)' : '#1a1a1a'};
                            border:1px solid ${ok ? '#dfbc6f' : '#444'}; color:${ok ? '#ffd875' : '#666'};">
                            ${label} (-${cost} ОР)
                        </button>`;
                    };

                    hintBox.style.display = 'block';
                    hintBox.innerHTML = `
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                            <span>👑 <b>Освоение (${terr.label}):</b> СЛ <b>${claimDc}</b></span>
                            <span style="color:#ffd875; font-family:monospace; font-weight:bold;">Казна: ${curRp} ОР</span>
                        </div>
                        <div style="display:flex; flex-wrap:wrap; gap:5px; margin-top:6px;">
                            ${makeSpendBtn('claim', '🚩 Захват', claimCost)}
                            ${makeSpendBtn('clear', '🪓 Расчистка', clearCost)}
                            ${makeSpendBtn('site', '🏗 Участок', siteCost)}
                            ${makeSpendBtn('road', '🛣 Дорога', roadCost)}
                        </div>
                        ${hasClearedRuins && rawSiteCost > 0 ? `<div style="color:#2ecc71; font-size:11px; margin-top:4px;">✔ Скидка расчищенных руин: цена участка снижена вдвое</div>` : ''}
                    `;



                    hintBox.querySelectorAll('[data-spend-rp]').forEach(btn => {
                        btn.onclick = (ev) => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            const cost = parseInt(btn.dataset.spendRp, 10) || 0;
                            const label = btn.dataset.spendLabel || 'Работы';
                            const latestRp = parseInt(kState.rp, 10) || 0;
                            if (latestRp < cost) return;

                            kState.rp = latestRp - cost;
                            if (typeof km._persist === 'function') km._persist();
                            if (typeof km.renderUi === 'function') km.renderUi();

                            // Автоматически ставим галочку «Территория королевства» при оплате захвата
                            if (label.includes('Захват') && claimedCb && !claimedCb.checked) {
                                claimedCb.checked = true;
                            }

                            // Автоматически добавляем метку в первое текстовое поле описания гекса
                            const descArea = menu.querySelector('textarea');
                            if (descArea) {
                                const curText = descArea.value.trim();
                                if (label.includes('Дорога') && !/дорог|тракт|road/i.test(curText)) {
                                    descArea.value = curText ? `${curText}\n🛣 Дорога проложена.` : '🛣 Дорога проложена.';
                                } else if (label.includes('Расчистка') && /руин|ruin/i.test(curText) && !/расчищ|clear/i.test(curText)) {
                                    descArea.value = `${curText}\n🏛 Руины расчищены.`;
                                } else if (label.includes('Расчистка') && !/расчищ|clear/i.test(curText)) {
                                    descArea.value = curText ? `${curText}\n🪓 Территория расчищена.` : '🪓 Территория расчищена.';
                                }
                            }

                            syncGuard();
                        };
                    });




                }
            }





        };

        document.addEventListener('change', (e) => {
            if (e.target.closest('#hexMenu')) syncGuard();
        }, true);

        document.addEventListener('click', (e) => {
            if (e.target.closest('#hexMenu') || e.target.closest('#mapCanvas')) {
                setTimeout(syncGuard, 20);
            }
        }, true);
    },


    /**
     * Динамическая генерация числовых опций (СЛ и Уровни) на основе лимита из конфига
     */
    populateSelectOptions() {
        const diffContainer = document.getElementById('inpDifficultyContainer');
        const levelContainer = document.getElementById('inpRegionLevelContainer');
        if (!diffContainer || !levelContainer) return;

        diffContainer.innerHTML = '';
        levelContainer.innerHTML = '';

        // Считываем максимальный предел числовых значений из конфигурации
        const maxLevel = MAP_CONFIG.grid.maxDcLevel;

        for (let i = 1; i <= maxLevel; i++) {
            const optDiff = document.createElement('div');
            optDiff.className = 'custom-option';
            optDiff.setAttribute('data-value', i);
            optDiff.textContent = 'СЛ ' + i;
            diffContainer.appendChild(optDiff);

            const optLvl = document.createElement('div');
            optLvl.className = 'custom-option';
            optLvl.setAttribute('data-value', i);
            optLvl.textContent = 'Уровень ' + i;
            levelContainer.appendChild(optLvl);
        }
    },

    /**
     * Инициализация логики открытия/закрытия списков и выбора элементов
     */
    initDropdownLogic() {
        document.querySelectorAll('.custom-select').forEach(select => {
            const trigger = select.querySelector('.custom-select-trigger');
            const container = select.querySelector('.custom-options-container');
            const hiddenInput = select.querySelector('input[type="hidden"]');




            trigger.addEventListener('click', (e) => {
                e.stopPropagation();

                // Если селект заблокирован (например, гекс не принадлежит королевству) — не открываем
                if (select.classList.contains('is-disabled')) {
                    return;
                }

                // Закрываем все остальные открытые списки
                document.querySelectorAll('.custom-select').forEach(otherSelect => {
                    if (otherSelect !== select) {
                        otherSelect.classList.remove('active');
                    }
                });

                select.classList.toggle('active');
            });

            container.addEventListener('click', (e) => {
                const option = e.target.closest('.custom-option');
                if (!option) return;

                // Не даём выбрать недоступную для текущего рельефа опцию
                if (option.classList.contains('option-disabled')) {
                    e.stopPropagation();
                    return;
                }

                const val = option.getAttribute('data-value');

                select.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');

                trigger.textContent = option.textContent;
                trigger.setAttribute('data-value', val);
                if (hiddenInput) {
                    hiddenInput.value = val;
                    hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
                }

                select.classList.remove('active');
            });




        });

        // Клик по любому месту экрана закрывает активные списки
        document.addEventListener('click', () => {
            document.querySelectorAll('.custom-select').forEach(select => {
                select.classList.remove('active');
            });
        });
    },



    /**
     * Синхронизация и принудительная установка значения списка извне
     */
    setCustomSelectValue(selectId, value) {
        const selectEl = document.getElementById(selectId);
        if (!selectEl) return;
        const trigger = selectEl.querySelector('.custom-select-trigger');
        const hiddenInput = selectEl.querySelector('input[type="hidden"]');
        const options = selectEl.querySelectorAll('.custom-option');

        let targetOption = selectEl.querySelector(`.custom-option[data-value="${value}"]`);
        if (!targetOption && options.length > 0) {
            targetOption = options[0];
        }

        if (targetOption) {
            options.forEach(opt => opt.classList.remove('selected'));
            targetOption.classList.add('selected');
            trigger.textContent = targetOption.textContent;
            trigger.setAttribute('data-value', value);
            if (hiddenInput) {
                hiddenInput.value = value;
            }
        }
    }
};

export default UiSelectManager;

