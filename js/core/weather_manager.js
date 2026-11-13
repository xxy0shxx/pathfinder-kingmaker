import { MAP_CONFIG } from '../config/app_config.js';
import EventBus from '../services/event_bus.js';
import ModalManager from '../ui/modal_manager.js';

const WeatherManager = {
    state: {
        day: 10,
        month: 3,
        year: 4710,
        precip: false,
        cold: false,
        hazardId: null,
        secondHazardNote: false
    },
    mapDataRef: null,
    onSaveCallback: null,

    init(mapData) {
        this.mapDataRef = mapData || { hexes: {} };

        // Миграция из старого сохранения королевства, если корневого weather ещё нет
        if (this.mapDataRef.weather) {
            this.state = { ...this.state, ...this.mapDataRef.weather };
        } else if (this.mapDataRef.kingdom?.calendar) {
            this.state = { ...this.state, ...this.mapDataRef.kingdom.calendar };
        }
        this.mapDataRef.weather = this.state;

        window.WeatherManager = this;

        EventBus.on('data:imported', (newMapData) => this.updateMapData(newMapData));
        EventBus.on('kingdom:turnEnded', () => this.advanceCalendar(0, 1));


        this.renderTabUi();
    },

    updateMapData(newMapData) {
        this.mapDataRef = newMapData || { hexes: {} };
        if (this.mapDataRef.weather) {
            this.state = { ...this.state, ...this.mapDataRef.weather };
        } else if (this.mapDataRef.kingdom?.calendar) {
            this.state = { ...this.state, ...this.mapDataRef.kingdom.calendar };
        }
        this.mapDataRef.weather = this.state;
        this.renderTabUi();
    },

    _persist() {
        if (this.mapDataRef) this.mapDataRef.weather = this.state;
        EventBus.emit('data:save');
    },

    _getWeekdayInfo(day, monthIdx, year) {
        const calCfg = MAP_CONFIG.golarionCalendar;
        const months = calCfg?.months || [];
        const weekdays = calCfg?.weekdays || [
            { id: 0, name: 'День луны',   rus: 'Пн' },
            { id: 1, name: 'День труда',   rus: 'Вт' },
            { id: 2, name: 'День богатств',  rus: 'Ср' },
            { id: 3, name: 'День клятв',     rus: 'Чт' },
            { id: 4, name: 'День огня',  rus: 'Пт' },
            { id: 5, name: 'Суббота',  rus: 'Сб' },
            { id: 6, name: 'Воскресенье',   rus: 'Вс' }
        ];

        // Считаем количество дней, прошедших с опорной даты: 10 Гозрана (месяц 3) 4710 AR = Стардей (индекс 5)
        const baseYear = 4710;
        let daysInPastMonths = 0;
        for (let i = 0; i < monthIdx; i++) {
            daysInPastMonths += (months[i]?.days || 30);
        }
        // 10 Гозрана 4710 AR — это (31 + 28 + 31 + 10) = 100-й день 4710 года
        const baseDayOfYear = 31 + 28 + 31 + 10;
        const currentDayOfYear = daysInPastMonths + day;
        const totalDiffDays = ((year - baseYear) * 365) + (currentDayOfYear - baseDayOfYear);

        const weekdayIndex = (((5 + totalDiffDays) % 7) + 7) % 7;
        return weekdays[weekdayIndex] || weekdays[5];
    },


    getCalendarInfo() {
        const calCfg = MAP_CONFIG.golarionCalendar;
        const c = this.state;
        const months = calCfg?.months || [];
        const mObj = months[c.month] || { id: 3, name: 'Гозран', days: 30, season: 'spring', seasonLabel: '🌱 Весна', precipDc: 15, coldDc: null };
        const hazards = calCfg?.weatherHazardsTable || [];
        const hazard = c.hazardId ? (hazards.find(h => h.id === c.hazardId) || null) : null;

        const day = c.day || 10;
        const year = c.year || 4710;
        const weekday = this._getWeekdayInfo(day, mObj.id, year);

        return {
            day,
            month: mObj.id,
            monthName: mObj.name,
            monthDays: mObj.days,
            year,
            weekdayName: weekday.name,
            weekdayRus: weekday.rus,
            season: mObj.season,
            seasonLabel: mObj.seasonLabel,
            precipDc: mObj.precipDc ?? 15,
            coldDc: mObj.coldDc ?? null,
            precip: !!c.precip,
            cold: !!c.cold,
            hazard,
            secondHazardNote: !!c.secondHazardNote
        };
    },

    advanceCalendar(daysDelta = 0, monthsDelta = 0) {
        const months = MAP_CONFIG.golarionCalendar?.months || [];
        if (months.length === 0) return;

        const c = this.state;
        c.day = (parseInt(c.day, 10) || 1) + daysDelta;
        c.month = (parseInt(c.month, 10) || 0) + monthsDelta;

        while (c.month >= 12) { c.month -= 12; c.year += 1; }
        while (c.month < 0) { c.month += 12; c.year -= 1; }

        while (c.day > (months[c.month]?.days || 30)) {
            c.day -= (months[c.month]?.days || 30);
            c.month += 1;
            if (c.month >= 12) { c.month = 0; c.year += 1; }
        }
        while (c.day < 1) {
            c.month -= 1;
            if (c.month < 0) { c.month = 11; c.year -= 1; }
            c.day += (months[c.month]?.days || 30);
        }

        this._persist();
        this.syncAllViews();
    },

    setDailyWeather({ precip, cold, hazardId, secondHazardNote }, showModal = false) {
        this.state.precip = !!precip;
        this.state.cold = !!cold;
        this.state.hazardId = hazardId || null;
        this.state.secondHazardNote = !!secondHazardNote;

        this._persist();
        this.syncAllViews();

        if (showModal) {
            this.showWeatherAppliedModal();
        }
    },

    syncAllViews() {
        this.renderTabUi();
        EventBus.emit('weather:updated', this.getCalendarInfo());
    },


    renderCompactBarHtml() {
        const cal = this.getCalendarInfo();
        let bgWeatherLabel = '⛅ Ясно и благоприятно';
        let badgeStyle = 'background:rgba(46, 204, 113, 0.14); border:1px solid #2ecc71; color:#2ecc71;';

        if (cal.precip && cal.cold) {
            bgWeatherLabel = '🌨️ Снег (утомление 4 ч, −1 Внимание)';
            badgeStyle = 'background:rgba(52, 152, 219, 0.2); border:1px solid #3498db; color:#74b9ff;';
        } else if (cal.precip) {
            bgWeatherLabel = '🌧️ Небольшой дождь (утомление 4 ч, −1 Внимание)';
            badgeStyle = 'background:rgba(52, 152, 219, 0.2); border:1px solid #3498db; color:#74b9ff;';
        } else if (cal.cold) {
            bgWeatherLabel = '🥶 Холодный день (утомление 4 ч)';
            badgeStyle = 'background:rgba(116, 185, 255, 0.18); border:1px solid #74b9ff; color:#74b9ff;';
        }

        const hazardBadgeHtml = cal.hazard
            ? `<button type="button" class="w-btn-active-hazard" title="Открыть карточку правил погодного явления"
                   style="background:rgba(231, 76, 60, 0.25); border:1.5px solid #e74c3c; color:#ff7675; padding:3px 10px; border-radius:4px; font-weight:bold; cursor:pointer; font-family:inherit; font-size:13px;">
                   ⚡ ${cal.hazard.icon} ${cal.hazard.label} (${cal.hazard.levelText}) ℹ️
               </button>`
            : '';

        return `
            <div class="w-shared-calendar-bar" style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:10px; background:rgba(0,0,0,0.42); border:1px solid #543e0d; border-radius:6px; padding:7px 12px; margin-bottom:10px; font-size:14px;">
            
                <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                    <span style="color:#ffd875; font-weight:bold;">📅 ${cal.day} ${cal.monthName} ${cal.year} AR (${cal.weekdayName} / ${cal.weekdayRus})</span>
                    <span style="background:#040905; border:1px solid #8a6421; padding:2px 8px; border-radius:4px; color:#ebd291;">${cal.seasonLabel}</span>
                    <button type="button" class="btn cc w-btn-prev-day" title="Минус 1 день" style="padding:3px 7px; font-size:12px;">-1Д</button>
                    <button type="button" class="btn cc w-btn-next-day" title="Плюс 1 день" style="padding:3px 7px; font-size:12px;">+1Д</button>
                    <button type="button" class="btn cc w-btn-prev-month" title="Минус 1 месяц" style="padding:3px 7px; font-size:12px;">-1М</button>
                    <button type="button" class="btn cc w-btn-next-month" title="Плюс 1 месяц" style="padding:3px 7px; font-size:12px;">+1М</button>
                </div>
                
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                    <button type="button" class="w-btn-weather-summary" title="Открыть сводку итогов погоды дня"
                            style="${badgeStyle} padding:3px 10px; border-radius:4px; font-weight:bold; cursor:pointer; font-family:inherit; font-size:13px;">
                        ${bgWeatherLabel} ℹ️
                    </button>
                    ${hazardBadgeHtml}
                    <button type="button" class="btn cc w-btn-open-roll" style="padding:3px 10px; font-size:12px;">⛅ Подготовка погоды</button>
                </div>
            </div>
        `;
    },

    bindBarEvents(rootEl) {
        if (!rootEl) return;
        rootEl.querySelectorAll('.w-btn-prev-day').forEach(b => b.onclick = () => this.advanceCalendar(-1, 0));
        rootEl.querySelectorAll('.w-btn-next-day').forEach(b => b.onclick = () => this.advanceCalendar(1, 0));
        rootEl.querySelectorAll('.w-btn-prev-month').forEach(b => b.onclick = () => this.advanceCalendar(0, -1));
        rootEl.querySelectorAll('.w-btn-next-month').forEach(b => b.onclick = () => this.advanceCalendar(0, 1));
        rootEl.querySelectorAll('.w-btn-open-roll').forEach(b => b.onclick = () => this.openWeatherRollModal());
        rootEl.querySelectorAll('.w-btn-weather-summary').forEach(b => b.onclick = () => this.showWeatherAppliedModal());
        rootEl.querySelectorAll('.w-btn-active-hazard').forEach(b => b.onclick = () => this.openActiveHazardDetailsModal());
    },

    renderCombatWeatherAlertHtml() {
        const cal = this.getCalendarInfo();
        const alerts = [];

        if (cal.precip) {
            alerts.push('🌧️ <b>Осадки:</b> ситуативный штраф <b>−1 к Вниманию</b> (зрение)');
        }
        if (cal.hazard) {
            alerts.push(`⚡ <b>${cal.hazard.icon} ${cal.hazard.label} (${cal.hazard.levelText}):</b> ${cal.hazard.effect}`);
        }

        if (alerts.length === 0) return '';

        const isDanger = !!cal.hazard;
        const borderCol = isDanger ? '#e74c3c' : '#3498db';
        const bgCol = isDanger ? 'rgba(92, 30, 30, 0.25)' : 'rgba(52, 152, 219, 0.14)';

        return `
            <div class="w-combat-weather-reminder" style="background:${bgCol}; border:1.5px solid ${borderCol}; border-radius:6px; padding:7px 14px; margin-bottom:10px; font-size:15px; line-height:1.4; color:#ebd291; display:flex; flex-direction:column; gap:3px;">
                ${alerts.map(line => `<div>${line}</div>`).join('')}
            </div>
        `;
    },

    renderCombatEffectsHtml() {
        const cal = this.getCalendarInfo();
        const alerts = [];

        if (cal.precip) {
            alerts.push('👁️ <b>Осадки:</b> штраф <b>−1 к Вниманию (зрение)</b>');
        }
        if (cal.cold) {
            alerts.push('🥶 <b>Холод:</b> утомление через <b>4 ч</b> активности');
        }
        if (cal.hazard) {
            alerts.push(`⚡ <b>${cal.hazard.icon} ${cal.hazard.label} (${cal.hazard.levelText}):</b> ${cal.hazard.effect}`);
        }

        if (alerts.length === 0) return '';

        const isHazard = !!cal.hazard;
        const borderCol = isHazard ? '#e74c3c' : '#3498db';
        const bgCol = isHazard ? 'rgba(92, 30, 30, 0.28)' : 'rgba(20, 48, 72, 0.35)';

        return `
            <div class="w-combat-weather-banner" style="background:${bgCol}; border:1.5px solid ${borderCol}; border-radius:6px; padding:7px 14px; margin-bottom:10px; font-size:15px; line-height:1.4; color:#ebd291; display:flex; flex-wrap:wrap; align-items:center; gap:8px 18px;">
                <span style="color:#ffd875; font-weight:bold; text-transform:uppercase; font-size:13px; letter-spacing:0.5px;">⚔️ Эффекты в бою:</span>
                ${alerts.map(a => `<span>${a}</span>`).join('')}
            </div>
        `;
    },


    renderTabUi() {
        const container = document.getElementById('weatherTabletContainer');
        if (!container) return;

        const cal = this.getCalendarInfo();
        const hazards = MAP_CONFIG.golarionCalendar?.weatherHazardsTable || [];

        let wIcon = '⛅';
        let wTitle = 'Ясно и благоприятно';
        let wNotes = ['Стандартная скорость перехода (утомление через 8 ч), без штрафов к Вниманию.'];
        let wBorder = '#2ecc71';

        if (cal.precip && cal.cold) {
            wIcon = '🌨️';
            wTitle = 'Снег и мороз';
            wNotes = ['Ускоренное утомление (через 4 ч пешего перехода)', 'Штраф −1 к Вниманию (зрение)'];
            wBorder = '#3498db';
        } else if (cal.precip) {
            wIcon = '🌧️';
            wTitle = 'Небольшой дождь';
            wNotes = ['Ускоренное утомление (через 4 ч пешего перехода)', 'Штраф −1 к Вниманию (зрение)'];
            wBorder = '#3498db';
        } else if (cal.cold) {
            wIcon = '🥶';
            wTitle = 'Холодный день';
            wNotes = ['Ускоренное утомление (через 4 ч дневной активности вместо 8)'];
            wBorder = '#74b9ff';
        }

        const activeHazardHtml = cal.hazard
            ? this._renderWeatherHazardCardHtml(cal.hazard)
            : `<div style="padding:16px; border:1px dashed #543e0d; border-radius:6px; color:#95a5a6; font-size:19px; text-align:center;">
                   Опасных погодных явлений сегодня нет.
               </div>`;

        container.innerHTML = `
            <div style="padding:16px 24px; color:#ebd291; font-family:'Tinos', serif; display:flex; flex-direction:column; gap:16px;">
                ${this.renderCompactBarHtml()}
                <div style="display:grid; grid-template-columns: 1.05fr 1.15fr; gap:20px; align-items:start;">
                    <div class="k-panel" style="padding:18px 22px; display:flex; flex-direction:column; gap:14px;">
                        <div class="k-sec-title" style="font-size:22px; margin-bottom:0;">🌤 Текущая погода дня</div>

                        <div style="display:flex; align-items:center; justify-content:space-between; gap:16px; background:rgba(0,0,0,0.42); border:2px solid ${wBorder}; border-radius:8px; padding:14px 18px;">
                            <div style="display:flex; align-items:center; gap:16px;">
                                <div style="font-size:48px; line-height:1;">${wIcon}</div>
                                <div>
                                    <div style="font-size:24px; font-weight:bold; color:#fff; margin-bottom:4px;">${wTitle}</div>
                                    <div style="font-size:17px; color:#ebd291; line-height:1.4;">${wNotes.join(' • ')}</div>
                                </div>
                            </div>
                            ${(cal.precip || cal.cold || cal.hazard) ? `<button type="button" class="btn cc" id="wBtnResetClear" style="padding:8px 14px; font-size:15px; white-space:nowrap;">☀️ Сбросить в ясно</button>` : ''}
                        </div>

                        <div style="background:rgba(0,0,0,0.28); border:1px solid #543e0d; border-radius:6px; padding:12px 16px; font-size:18px; line-height:1.5;">
                            <div style="color:#ffd875; font-weight:bold; margin-bottom:4px;">🎲 СЛ утренних чистых проверок (${cal.monthName}):</div>
                            <div>• Осадки: <b>СЛ ${cal.precipDc}</b> • Холод: <b>${cal.coldDc ? 'СЛ ' + cal.coldDc : 'Нет'}</b> • Опасное явление: <b>СЛ 17</b></div>
                        </div>

                        ${activeHazardHtml}
                    </div>

                    <div class="k-panel" style="padding:18px 22px;">
                        <div class="k-sec-title" style="font-size:22px;">⚡ Таблица случайных погодных явлений (d20)</div>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; font-size:18px;">
                            ${hazards.map(h => `
                                <div data-pick-hz="${h.id}" style="padding:9px 12px; border:1px solid ${cal.hazard?.id === h.id ? '#2ecc71' : '#543e0d'}; background:${cal.hazard?.id === h.id ? 'rgba(46,204,113,0.18)' : 'rgba(0,0,0,0.35)'}; border-radius:5px; cursor:pointer; display:flex; justify-content:space-between; align-items:center;" title="Кликните, чтобы выбрать или снять явление">
                                    <span><b>${h.minRoll === h.maxRoll ? h.minRoll : h.minRoll + '–' + h.maxRoll}</b> ${h.icon} ${h.label}</span>
                                    <span style="color:#a4b0be; font-size:15px;">${h.levelText}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.bindBarEvents(container);

        const resetBtn = container.querySelector('#wBtnResetClear');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.setDailyWeather({ precip: false, cold: false, hazardId: null, secondHazardNote: false }, false);
            });
        }

        container.querySelectorAll('[data-pick-hz]').forEach(el => {
            el.addEventListener('click', () => {
                const nextHz = (cal.hazard?.id === el.dataset.pickHz) ? null : el.dataset.pickHz;
                this.setDailyWeather({
                    precip: cal.precip,
                    cold: cal.cold,
                    hazardId: nextHz,
                    secondHazardNote: cal.secondHazardNote
                }, false);
            });
        });
    },

    _renderWeatherHazardCardHtml(hz) {
        if (!hz) return '';
        const hasPlus = String(hz.duration || '').includes('+');
        const plusNote = hasPlus
            ? ' <span style="color:#a4b0be; font-size:11px;">(знак «+»: в конце срока чистая проверка СЛ 11 для продления)</span>'
            : '';

        return `
            <div style="background:rgba(92, 30, 30, 0.22); border:1.5px solid #e74c3c; border-radius:6px; padding:10px 12px; margin-top:8px; font-size:13px; line-height:1.45; color:#ebd291;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px dashed rgba(231, 76, 60, 0.45); padding-bottom:5px; margin-bottom:6px;">
                    <span style="font-size:16px; font-weight:bold; color:#ff7675;">${hz.icon} ${hz.label}</span>
                    <span style="background:#040905; border:1px solid #e74c3c; color:#ffd875; padding:1px 8px; border-radius:4px; font-size:12px; font-weight:bold;">Опасность (${hz.levelText})</span>
                </div>
                <div><b>🧭 Предсказание (Выживание):</b> ${hz.survivalDc || '—'} • <b>Требования:</b> ${hz.req || 'Нет'}</div>
                <div><b>⏳ Длительность:</b> ${hz.duration || '—'}${plusNote}</div>
                <div style="margin-top:4px;"><b>🏕 Подготовка и укрытие:</b> ${hz.prep || '—'}</div>
                <div style="margin-top:4px; color:#fff;"><b>⚡ Эффект:</b> ${hz.effect || '—'}</div>
                <div style="margin-top:5px; font-size:11px; color:#2ecc71;">
                    🏆 Награда ПО: как за простую опасность (${hz.levelText}), кроме пережидания внутри полноценного здания.
                </div>
            </div>
        `;
    },

    openActiveHazardDetailsModal() {
        const hz = this.getCalendarInfo()?.hazard;
        if (!hz) return;

        ModalManager.open({
            id: 'kHazardDetailsOverlay',
            title: '📜 Справка по активному погодному явлению',
            borderColor: '#e74c3c',
            width: '500px',
            bodyHtml: this._renderWeatherHazardCardHtml(hz),
            footerButtons: [
                { label: 'Закрыть', variant: 'ok' }
            ]
        });
    },



    openWeatherRollModal() {
        const info = this.getCalendarInfo();
        const hazards = MAP_CONFIG.golarionCalendar?.weatherHazardsTable || [];
        const existing = document.getElementById('kWeatherRollOverlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'kWeatherRollOverlay';
        overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:9999999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(3px);';

        const coldBlockHtml = info.coldDc
            ? `<div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.35); border:1px solid #543e0d; padding:8px 12px; border-radius:4px;">
                   <div><b>2. Холод (${info.monthName}):</b> чистая проверка <b>СЛ ${info.coldDc}</b><div style="font-size:11px; color:#a4b0be;">Утомление через 4 ч; при осадках идёт снег</div></div>
                   <input type="number" id="kWInpCold" class="k-inp" min="1" max="20" placeholder="d20" style="width:74px; font-size:18px; font-weight:bold; text-align:center;">
               </div>`
            : `<div style="background:rgba(0,0,0,0.25); border:1px solid #543e0d; padding:6px 12px; border-radius:4px; font-size:12px; color:#a4b0be;">
                   <b>2. Температура:</b> В сезон «${info.seasonLabel}» проверка на холод не требуется (норма)
               </div>`;

        overlay.innerHTML = `
            <div style="background:linear-gradient(135deg, #112618 0%, #09140d 100%); border:2px solid #b89445; border-radius:8px; padding:20px 24px; width:520px; max-width:95vw; max-height:92vh; overflow-y:auto; color:#ebd291; box-shadow:0 15px 40px rgba(0,0,0,0.9); font-family:'Tinos', serif;">
                <div style="font-size:18px; font-weight:bold; color:#ffd875; border-bottom:1px solid #543e0d; padding-bottom:8px; margin-bottom:12px;">
                    ⛅ Ежедневная подготовка: Погода (${info.day} ${info.monthName}, ${info.seasonLabel})
                </div>

                <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:12px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.35); border:1px solid #543e0d; padding:8px 12px; border-radius:4px;">
                        <div><b>1. Небольшие осадки:</b> чистая проверка <b>СЛ ${info.precipDc}</b><div style="font-size:11px; color:#a4b0be;">Утомление через 4 ч, штраф −1 к Вниманию (зрение)</div></div>
                        <input type="number" id="kWInpPrecip" class="k-inp" min="1" max="20" placeholder="d20" style="width:74px; font-size:18px; font-weight:bold; text-align:center;">
                    </div>

                    ${coldBlockHtml}

                    <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.35); border:1px solid #543e0d; padding:8px 12px; border-radius:4px;">
                        <div><b>3. Погодное явление (опасность):</b> чистая проверка <b>СЛ 17</b><div style="font-size:11px; color:#a4b0be;">При успехе (≥17) введите бросок d20 по таблице ниже</div></div>
                        <input type="number" id="kWInpEventFlat" class="k-inp" min="1" max="20" placeholder="d20" style="width:74px; font-size:18px; font-weight:bold; text-align:center;">
                    </div>
                </div>

                <div id="kWHazardSection" style="display:none; background:rgba(0,0,0,0.45); border:1px solid #ffd875; border-radius:6px; padding:10px 12px; margin-bottom:12px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span style="color:#ffd875; font-weight:bold;">⚡ Бросок по таблице погодных явлений (d20):</span>
                        <input type="number" id="kWInpHazardRoll" class="k-inp" min="1" max="20" placeholder="1–20" style="width:80px; font-size:18px; font-weight:bold; text-align:center; color:#ffd875; border-color:#ffd875;">
                    </div>
                    <div id="kWNat20Hint" style="display:none; color:#2ecc71; font-size:12px; margin-bottom:6px;">
                        👑 Выпала натуральная 20 на проверке СЛ 17! Можете сделать доп. проверку СЛ 17 на связанное явление.
                    </div>
                    
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:4px; font-size:12px;">
                        ${hazards.map(h => `
                            <div data-hz-id="${h.id}" data-min-roll="${h.minRoll}" title="Нажмите, чтобы подставить значение ${h.minRoll}" style="padding:4px 8px; border:1px solid #543e0d; border-radius:3px; display:flex; justify-content:space-between; cursor:pointer; transition:all 0.15s ease;">
                                <span><b>${h.minRoll === h.maxRoll ? h.minRoll : h.minRoll + '–' + h.maxRoll}</b> ${h.icon} ${h.label}</span>
                                <span style="color:#a4b0be;">${h.levelText}</span>
                            </div>
                        `).join('')}
                    </div>
                    
                </div>

                <div id="kWSummaryPreview" style="background:#040905; border:1px solid #543e0d; border-radius:4px; padding:8px 12px; margin-bottom:12px; font-size:13px; color:#ebd291;">
                    Введите результаты бросков d20 со стола (пустое поле = провал проверки)
                </div>

                <div style="display:flex; justify-content:flex-end; gap:8px;">
                    <button type="button" class="btn cc" id="kWeatherCancelBtn">Отмена</button>
                    <button type="button" class="btn ok" id="kWeatherApplyBtn">Применить погоду дня</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const inpPrecip = overlay.querySelector('#kWInpPrecip');
        const inpCold = overlay.querySelector('#kWInpCold');
        const inpEventFlat = overlay.querySelector('#kWInpEventFlat');
        const hzSec = overlay.querySelector('#kWHazardSection');
        const inpHzRoll = overlay.querySelector('#kWInpHazardRoll');
        const nat20Hint = overlay.querySelector('#kWNat20Hint');
        const preview = overlay.querySelector('#kWSummaryPreview');

        let stateDraft = { precip: false, cold: false, hazardId: null, secondHazardNote: false };


        const refresh = () => {
            const pRoll = parseInt(inpPrecip.value, 10);
            const cRoll = inpCold ? parseInt(inpCold.value, 10) : NaN;
            const eFlat = parseInt(inpEventFlat.value, 10);
            const hRoll = parseInt(inpHzRoll.value, 10);

            const hasPrecip = !isNaN(pRoll) && pRoll >= info.precipDc;
            const hasCold = !!(info.coldDc && !isNaN(cRoll) && cRoll >= info.coldDc);
            const hasEvent = !isNaN(eFlat) && eFlat >= 17;

            hzSec.style.display = hasEvent ? 'block' : 'none';
            nat20Hint.style.display = eFlat === 20 ? 'block' : 'none';

            const matchedHz = (hasEvent && !isNaN(hRoll) && hRoll >= 1 && hRoll <= 20)
                ? hazards.find(h => hRoll >= h.minRoll && hRoll <= h.maxRoll) || null
                : null;

            overlay.querySelectorAll('[data-hz-id]').forEach(el => {
                const active = matchedHz && el.dataset.hzId === matchedHz.id;
                el.style.borderColor = active ? '#2ecc71' : '#543e0d';
                el.style.background = active ? 'rgba(46, 204, 113, 0.18)' : 'transparent';
            });

            stateDraft = { precip: hasPrecip, cold: hasCold, hazardId: matchedHz?.id || null, secondHazardNote: eFlat === 20 };

            const tags = [];
            if (hasPrecip && hasCold) tags.push('🌨️ Снег (осадки + холод: утомление через 4 ч, −1 Внимание)');
            else if (hasPrecip) tags.push('🌧️ Небольшой дождь (утомление через 4 ч, −1 Внимание)');
            else if (hasCold) tags.push('🥶 Холодный день (утомление через 4 ч)');
            else tags.push('⛅ Ясно, температура в норме');

            if (matchedHz) tags.push(`⚡ Явление: ${matchedHz.icon} ${matchedHz.label} (${matchedHz.levelText})`);
            else if (hasEvent) tags.push('⚡ Погодное явление сработало — введите бросок d20 по таблице');

            preview.innerHTML = tags.join('<br>') + (matchedHz ? this._renderWeatherHazardCardHtml(matchedHz) : '');
        };

        [inpPrecip, inpCold, inpEventFlat, inpHzRoll].filter(Boolean).forEach(el => el.addEventListener('input', refresh));

        overlay.querySelectorAll('[data-hz-id]').forEach(row => {
            row.addEventListener('click', () => {
                inpHzRoll.value = row.dataset.minRoll;
                refresh();
            });
        });

        overlay.querySelector('#kWeatherApplyBtn').addEventListener('click', () => {
            overlay.remove();
            this.setDailyWeather(stateDraft, true);
        });
        overlay.querySelector('#kWeatherCancelBtn').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
        setTimeout(() => inpPrecip.focus(), 40);
    },

    showWeatherAppliedModal() {
        const cal = this.getCalendarInfo();
        const existing = document.getElementById('kWeatherSummaryOverlay');
        if (existing) existing.remove();

        let icon = '⛅';
        let title = 'Ясно и благоприятно';
        let effectsList = ['Путешествие без погодных штрафов: утомление наступает через стандартные 8 часов.'];

        if (cal.precip && cal.cold) {
            icon = '🌨️';
            title = 'Снег и мороз';
            effectsList = [
                'Ускоренное утомление: наступает через 4 часа пешего перехода вместо 8.',
                'Ухудшение видимости: ситуативный штраф −1 к проверкам Внимания (зрение).'
            ];
        } else if (cal.precip) {
            icon = '🌧️';
            title = 'Небольшой дождь';
            effectsList = [
                'Ускоренное утомление: наступает через 4 часа пешего перехода вместо 8.',
                'Ухудшение видимости: ситуативный штраф −1 к проверкам Внимания (зрение).'
            ];
        } else if (cal.cold) {
            icon = '🥶';
            title = 'Холодный день';
            effectsList = [
                'Ускоренное утомление: наступает через 4 часа дневной активности вместо 8.'
            ];
        }

        const hazardHtml = cal.hazard ? this._renderWeatherHazardCardHtml(cal.hazard) : '';
        const nat20Html = cal.secondHazardNote
            ? `<div style="margin-top:10px; padding:8px 12px; background:rgba(46,204,113,0.15); border:1px solid #2ecc71; border-radius:6px; color:#2ecc71; font-size:20px;">
                   👑 Натуральная 20 на проверке явлений: ведущий может добавить второе связанное явление (СЛ 17).
               </div>`
            : '';

        const overlay = document.createElement('div');
        overlay.id = 'kWeatherSummaryOverlay';
        overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.86); z-index:9999999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px);';
        overlay.innerHTML = `
            <div style="background:linear-gradient(135deg, #112618 0%, #09140d 100%); border:3px solid #ffd875; border-radius:12px; padding:32px 40px; width:1100px; max-width:95vw; max-height:92vh; overflow-y:auto; color:#ebd291; box-shadow:0 20px 60px rgba(0,0,0,0.95), 0 0 35px rgba(255,216,117,0.35); font-family:'Tinos', serif;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #543e0d; padding-bottom:14px; margin-bottom:20px;">
                    <span style="font-size:32px; font-weight:bold; color:#ffd875;">📅 Итоги утренней погоды: ${cal.year} AR (${cal.weekdayName} / ${cal.weekdayRus})</span>
                </div>

                <div style="display:flex; align-items:center; gap:20px; background:rgba(0,0,0,0.4); border:2px solid #8a6421; border-radius:8px; padding:18px 24px; margin-bottom:18px;">
                    <div style="font-size:58px; line-height:1;">${icon}</div>
                    <div>
                        <div style="font-size:30px; font-weight:bold; color:#fff; margin-bottom:6px;">${title}</div>
                        <ul style="margin:0; padding-left:22px; font-size:22px; color:#ebd291; line-height:1.45;">
                            ${effectsList.map(line => `<li>${line}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                ${nat20Html}
                ${hazardHtml}

                <div style="display:flex; justify-content:flex-end; margin-top:22px;">
                    <button type="button" class="btn ok" id="kWeatherSummaryCloseBtn" style="padding:14px 36px; font-size:24px; min-width:220px;">Принять</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        overlay.querySelector('#kWeatherSummaryCloseBtn').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    },

};

export default WeatherManager;
