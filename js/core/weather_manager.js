import { MAP_CONFIG } from '../config/app_config.js';

const WeatherManager = {
    state: {
        day: 1,
        month: 2,
        year: 4710,
        precip: false,
        cold: false,
        hazardId: null,
        secondHazardNote: false
    },
    mapDataRef: null,
    onSaveCallback: null,

    init(mapData, onSave) {
        this.mapDataRef = mapData || { hexes: {} };
        this.onSaveCallback = onSave;

        // Миграция из старого сохранения королевства, если корневого weather ещё нет
        if (this.mapDataRef.weather) {
            this.state = { ...this.state, ...this.mapDataRef.weather };
        } else if (this.mapDataRef.kingdom?.calendar) {
            this.state = { ...this.state, ...this.mapDataRef.kingdom.calendar };
        }
        this.mapDataRef.weather = this.state;

        window.WeatherManager = this;
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
        if (typeof this.onSaveCallback === 'function') this.onSaveCallback();
        else localStorage.setItem('hexMapSystemData', JSON.stringify(this.mapDataRef));
    },

    getCalendarInfo() {
        const calCfg = MAP_CONFIG.golarionCalendar;
        const c = this.state;
        const months = calCfg?.months || [];
        const mObj = months[c.month] || { id: 2, name: 'Фараст', days: 31, season: 'spring', seasonLabel: '🌱 Весна', precipDc: 15, coldDc: null };
        const hazards = calCfg?.weatherHazardsTable || [];
        const hazard = c.hazardId ? (hazards.find(h => h.id === c.hazardId) || null) : null;

        return {
            day: c.day || 1,
            month: mObj.id,
            monthName: mObj.name,
            monthDays: mObj.days,
            year: c.year || 4710,
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
        if (c.day < 1) c.day = 1;

        this._persist();
        this.syncAllViews();
    },

    setDailyWeather({ precip, cold, hazardId, secondHazardNote }) {
        this.state.precip = !!precip;
        this.state.cold = !!cold;
        this.state.hazardId = hazardId || null;
        this.state.secondHazardNote = !!secondHazardNote;

        this._persist();
        this.syncAllViews();
    },

    syncAllViews() {
        this.renderTabUi();
        if (window.KingdomManager && typeof window.KingdomManager.renderUi === 'function') {
            window.KingdomManager.renderUi();
        }
        if (window.CampingManager && typeof window.CampingManager.recalculateCamp === 'function') {
            window.CampingManager.recalculateCamp();
        }
    },
    renderCompactBarHtml() {
        const cal = this.getCalendarInfo();
        let bgWeatherLabel = '⛅ Ясно и благоприятно';
        if (cal.precip && cal.cold) bgWeatherLabel = '🌨️ Снег (утомление 4 ч, −1 Внимание)';
        else if (cal.precip) bgWeatherLabel = '🌧️ Небольшой дождь (утомление 4 ч, −1 Внимание)';
        else if (cal.cold) bgWeatherLabel = '🥶 Холодный день (утомление 4 ч)';

        const hazardBadgeHtml = cal.hazard
            ? `<button type="button" class="w-btn-active-hazard" title="Открыть карточку правил погодного явления"
                   style="background:rgba(231, 76, 60, 0.22); border:1px solid #e74c3c; color:#ff7675; padding:3px 10px; border-radius:4px; font-weight:bold; cursor:pointer; font-family:inherit; font-size:13px;">
                   ⚡ ${cal.hazard.icon} ${cal.hazard.label} (${cal.hazard.levelText}) ℹ️
               </button>`
            : '';

        return `
            <div class="w-shared-calendar-bar" style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:10px; background:rgba(0,0,0,0.42); border:1px solid #543e0d; border-radius:6px; padding:7px 12px; margin-bottom:10px; font-size:14px;">
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                    <span style="color:#ffd875; font-weight:bold;">📅 ${cal.day} ${cal.monthName} ${cal.year} AR</span>
                    <span style="background:#040905; border:1px solid #8a6421; padding:2px 8px; border-radius:4px; color:#ebd291;">${cal.seasonLabel}</span>
                    <button type="button" class="btn cc w-btn-next-day" style="padding:3px 8px; font-size:12px;">+1 День</button>
                    <button type="button" class="btn cc w-btn-next-month" style="padding:3px 8px; font-size:12px;">+1 Месяц</button>
                </div>
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                    <span style="color:#ebd291;">Погода: <b style="color:#ffd875;">${bgWeatherLabel}</b></span>
                    ${hazardBadgeHtml}
                    <button type="button" class="btn cc w-btn-open-roll" style="padding:3px 10px; font-size:12px;">🌦 Подготовка погоды</button>
                </div>
            </div>
        `;
    },

    bindBarEvents(rootEl) {
        if (!rootEl) return;
        rootEl.querySelectorAll('.w-btn-next-day').forEach(b => b.onclick = () => this.advanceCalendar(1, 0));
        rootEl.querySelectorAll('.w-btn-next-month').forEach(b => b.onclick = () => this.advanceCalendar(0, 1));
        rootEl.querySelectorAll('.w-btn-open-roll').forEach(b => b.onclick = () => this.openWeatherRollModal());
        rootEl.querySelectorAll('.w-btn-active-hazard').forEach(b => b.onclick = () => this.openActiveHazardDetailsModal());
    },

    renderTabUi() {
        const container = document.getElementById('weatherTabletContainer');
        if (!container) return;

        const cal = this.getCalendarInfo();
        const hazards = MAP_CONFIG.golarionCalendar?.weatherHazardsTable || [];

        const activeHazardHtml = cal.hazard
            ? this._renderWeatherHazardCardHtml(cal.hazard)
            : `<div style="padding:18px; border:1px dashed #543e0d; border-radius:6px; color:#95a5a6; font-size:20px; text-align:center;">
                   Опасных погодных явлений сегодня нет. Нажмите «🌦 Подготовка погоды», чтобы ввести утренние проверки.
               </div>`;

        container.innerHTML = `
            <div style="padding:16px 24px; color:#ebd291; font-family:'Tinos', serif; display:flex; flex-direction:column; gap:16px;">
                ${this.renderCompactBarHtml()}
                <div style="display:grid; grid-template-columns: 1fr 1.2fr; gap:20px; align-items:start;">
                    <div class="k-panel" style="padding:18px 22px;">
                        <div class="k-sec-title" style="font-size:22px;">📜 Погодные условия и справочник</div>
                        <div style="font-size:19px; line-height:1.5; margin-bottom:14px;">
                            <div>• <b>СЛ чистой проверки осадков (${cal.monthName}):</b> <span style="color:#ffd875;">СЛ ${cal.precipDc}</span></div>
                            <div>• <b>СЛ чистой проверки холода:</b> <span style="color:#ffd875;">${cal.coldDc ? 'СЛ ' + cal.coldDc : 'Не требуется (теплый сезон)'}</span></div>
                            <div>• <b>СЛ чистой проверки опасного явления:</b> <span style="color:#ffd875;">СЛ 17</span></div>
                        </div>
                        ${activeHazardHtml}
                    </div>
                    <div class="k-panel" style="padding:18px 22px;">
                        <div class="k-sec-title" style="font-size:22px;">⚡ Таблица случайных погодных явлений (d20)</div>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; font-size:18px;">
                            ${hazards.map(h => `
                                <div data-pick-hz="${h.id}" style="padding:8px 12px; border:1px solid ${cal.hazard?.id === h.id ? '#2ecc71' : '#543e0d'}; background:${cal.hazard?.id === h.id ? 'rgba(46,204,113,0.16)' : 'rgba(0,0,0,0.35)'}; border-radius:5px; cursor:pointer; display:flex; justify-content:space-between; align-items:center;" title="Нажмите, чтобы просмотреть или активировать явление">
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
        container.querySelectorAll('[data-pick-hz]').forEach(el => {
            el.addEventListener('click', () => {
                this.setDailyWeather({
                    precip: cal.precip,
                    cold: cal.cold,
                    hazardId: el.dataset.pickHz,
                    secondHazardNote: cal.secondHazardNote
                });
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

        const existing = document.getElementById('kHazardDetailsOverlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'kHazardDetailsOverlay';
        overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:9999999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(3px);';
        overlay.innerHTML = `
            <div style="background:linear-gradient(135deg, #112618 0%, #09140d 100%); border:2px solid #e74c3c; border-radius:8px; padding:18px 22px; width:500px; max-width:94vw; color:#ebd291; box-shadow:0 15px 40px rgba(0,0,0,0.9); font-family:'Tinos', serif;">
                <div style="font-size:17px; font-weight:bold; color:#ffd875; margin-bottom:4px;">📜 Справка по активному погодному явлению</div>
                ${this._renderWeatherHazardCardHtml(hz)}
                <div style="display:flex; justify-content:flex-end; margin-top:12px;">
                    <button type="button" class="btn ok" id="kCloseHazardDetailsBtn">Закрыть</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        overlay.querySelector('#kCloseHazardDetailsBtn').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
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
                    🌦 Ежедневная подготовка: Погода (${info.day} ${info.monthName}, ${info.seasonLabel})
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
                            <div data-hz-id="${h.id}" style="padding:4px 8px; border:1px solid #543e0d; border-radius:3px; display:flex; justify-content:space-between;">
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
        overlay.querySelector('#kWeatherApplyBtn').addEventListener('click', () => {
            overlay.remove();
            this.setDailyWeather(stateDraft);
        });
        overlay.querySelector('#kWeatherCancelBtn').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
        setTimeout(() => inpPrecip.focus(), 40);
    },
};

export default WeatherManager;
