// ============================================================================
// МОДУЛЬ: МЕНЕДЖЕР ПРИВАЛА (CAMPING MANAGER) — ЧАСТЬ 1 ИЗ 3
// ============================================================================

const CampingManager = {
    state: {
        baseChecks: 2,
        checkMod: 12,
        normalIngredients: 0,
        specialIngredients: 0,
        encounterDc: 0,
        totalChecks: 2
    },
    mapDataRef: null,
    onSaveCallback: null,

    init(mapData, onSave) {
        try {
            this.mapDataRef = mapData || { hexes: {}, kingdom: null, camping: null };
            this.onSaveCallback = onSave;

            if (this.mapDataRef.camping) {
                this.state = this.mapDataRef.camping;
                if (this.state.baseChecks === undefined || isNaN(this.state.baseChecks)) this.state.baseChecks = 2;
                if (this.state.checkMod === undefined || isNaN(this.state.checkMod) || this.state.checkMod === 0) this.state.checkMod = 12;
            } else {
                this.mapDataRef.camping = this.state;
            }

            window.CampingManager = this;
            this.syncCountersUi();
            this.recalculateCamp();
            this.attachInputListeners();
        } catch (e) { console.error("Ошибка инициализации CampingManager:", e); }
    },

    updateMapData(newMapData) {
        try {
            this.mapDataRef = newMapData || { hexes: {}, kingdom: null, camping: null };
            if (this.mapDataRef.camping) {
                this.state = this.mapDataRef.camping;
                if (this.state.baseChecks === undefined || isNaN(this.state.baseChecks)) this.state.baseChecks = 2;
                if (this.state.checkMod === undefined || isNaN(this.state.checkMod) || this.state.checkMod === 0) this.state.checkMod = 12;
            }
            this.syncCountersUi();
            this.recalculateCamp();
        } catch (e) { console.error("Ошибка обновления CampingManager:", e); }
    },

    changeBaseChecks(amount) {
        this.state.baseChecks = Math.max(0, Math.min(20, this.state.baseChecks + amount));
        this.syncCountersUi();
        this.recalculateCamp();
    },

    changeCheckMod(amount) {
        this.state.checkMod = Math.max(1, Math.min(41, this.state.checkMod + amount));
        this.syncCountersUi();
        this.recalculateCamp();
    },

    syncCountersUi() {
        const baseEl = document.getElementById('campBaseChecksVal');
        const modEl = document.getElementById('campCheckModVal');
        if (baseEl) baseEl.textContent = this.state.baseChecks;
        if (modEl) modEl.textContent = this.state.checkMod;
    },

    getSelectedRadio(name) {
        const checked = document.querySelector(`input[name="${name}"]:checked`);
        return checked ? checked.value : null;
    },
    // ============================================================================
// МЕНЕДЖЕР ПРИВАЛА (CAMPING MANAGER) — ЧАСТЬ 2 ИЗ 3
// ============================================================================

    recalculateCamp() {
        try {
            if (!this.mapDataRef || !this.mapDataRef.hexes) return;

            let squadHex = null;
            for (let id in this.mapDataRef.hexes) {
                if (this.mapDataRef.hexes[id].squadHere === true) {
                    squadHex = this.mapDataRef.hexes[id];
                    break;
                }
            }

            let baseRegionDc = 14;
            let currentRegionLevel = 1;

            if (squadHex) {
                if (squadHex.difficulty) baseRegionDc = parseInt(squadHex.difficulty, 10);
                if (squadHex.regionLevel) currentRegionLevel = parseInt(squadHex.regionLevel, 10);
            }

            const dcTextEl = document.getElementById('campRegionDcText');
            if (dcTextEl) dcTextEl.textContent = `СЛ ${baseRegionDc} (уровень региона: ${currentRegionLevel})`;

            const prepareRes = this.getSelectedRadio('res_prepare');
            const camoRow = document.getElementById('row_camouflage');
            const huntRow = document.getElementById('row_hunt');
            const isCampHorrible = (prepareRes === 'crit_failure');

            if (isCampHorrible) {
                if (camoRow) camoRow.style.display = 'none';
                if (huntRow) huntRow.style.display = 'none';
                document.querySelectorAll('input[name="res_camouflage"], input[name="res_hunt"]').forEach(r => r.checked = false);
            } else {
                if (camoRow) camoRow.style.display = 'table-row';
                if (huntRow) huntRow.style.display = 'table-row';
            }

            const camoRes = this.getSelectedRadio('res_camouflage');
            const huntRes = this.getSelectedRadio('res_hunt');

            let prepareDcModifier = 0;
            if (prepareRes === 'failure') prepareDcModifier = 2;

            const finalPrepareDc = baseRegionDc;
            const finalCamoDc = baseRegionDc + prepareDcModifier;
            const finalHuntDc = baseRegionDc + prepareDcModifier;

            ['label_dc_prepare', 'label_dc_camouflage', 'label_dc_hunt'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    if (id === 'label_dc_prepare') el.textContent = `(СЛ: ${finalPrepareDc})`;
                    if (id === 'label_dc_camouflage') el.textContent = `(СЛ: ${finalCamoDc})`;
                    if (id === 'label_dc_hunt') el.textContent = `(СЛ: ${finalHuntDc})`;
                }
            });

            let finalEncounterDc = this.state.checkMod;
            if (!isCampHorrible) {
                if (camoRes === 'crit_success') finalEncounterDc += 2;
                if (camoRes === 'success') finalEncounterDc += 1;
                if (camoRes === 'crit_failure') finalEncounterDc = Math.max(1, finalEncounterDc - 2);
            }
            if (prepareRes === 'crit_success') finalEncounterDc += 2;
            this.state.encounterDc = finalEncounterDc;

            let calculatedChecks = this.state.baseChecks;
            if (prepareRes === 'crit_success') calculatedChecks -= 1;
            if (prepareRes === 'crit_failure') calculatedChecks += 1;
            if (!isCampHorrible && camoRes === 'crit_success') calculatedChecks -= 1;
            if (!isCampHorrible && huntRes === 'crit_failure') calculatedChecks += 1;

            this.state.totalChecks = Math.max(0, calculatedChecks);

            let normalYield = 0;
            let specialYieldText = "0";

            if (!isCampHorrible) {
                if (huntRes === 'success') {
                    normalYield = baseRegionDc;
                    if (currentRegionLevel < 7) specialYieldText = "1d4";
                    else if (currentRegionLevel >= 7 && currentRegionLevel <= 14) specialYieldText = "2d4";
                    else if (currentRegionLevel > 14) specialYieldText = "3d4";
                }
                else if (huntRes === 'crit_success') {
                    normalYield = baseRegionDc;
                    if (currentRegionLevel < 7) specialYieldText = "4";
                    else if (currentRegionLevel >= 7 && currentRegionLevel <= 14) specialYieldText = "8";
                    else if (currentRegionLevel > 14) specialYieldText = "12";
                }
                else if (huntRes === 'failure') {
                    normalYield = baseRegionDc;
                    specialYieldText = "0";
                }
                else if (huntRes === 'crit_failure') {
                    normalYield = "1d4";
                    specialYieldText = "0";
                }
            }

            this.state.normalIngredients = normalYield;
            this.state.specialIngredients = specialYieldText;

            this.renderCalculatedUi(camoRes, prepareRes, huntRes, isCampHorrible, currentRegionLevel, specialYieldText);
        } catch (e) { console.error("Ошибка при перерасчете параметров лагеря:", e); }
    },

    renderCalculatedUi(camoRes, prepareRes, huntRes, isCampHorrible, lvl, specialYieldText) {
        const normEl = document.getElementById('campNormalIngredients');
        const specEl = document.getElementById('campSpecialIngredients');
        const encEl = document.getElementById('calcEncounterDc');
        const totEl = document.getElementById('calcTotalChecks');

        if (normEl) normEl.textContent = this.state.normalIngredients;
        if (specEl) specEl.textContent = this.state.specialIngredients;
        if (encEl) encEl.textContent = this.state.encounterDc;
        if (totEl) totEl.textContent = this.state.totalChecks;

        const effectsList = document.getElementById('campEffectsList');
        if (!effectsList) return;
        effectsList.innerHTML = '';

        if (prepareRes === 'crit_success') this.addLogLine(effectsList, "КУ подготовки: Число проверок снижено на -1, СЛ ночной сцены защищен на +2.", "good");
        else if (prepareRes === 'failure') this.addLogLine(effectsList, "Провал подготовки: СЛ Маскировки и Охоты увеличены на +2 из-за плохой стоянки.", "bad");
        else if (isCampHorrible) this.addLogLine(effectsList, "Это ужасное место для лагеря! Маскировка и Охота невозможны. Число проверок увеличено на +1.", "bad");

        if (!isCampHorrible) {
            if (camoRes === 'crit_success') this.addLogLine(effectsList, "КУ маскировки: Число проверок снижено на -1, СЛ сцены увеличен на +2.", "good");
            if (camoRes === 'success') this.addLogLine(effectsList, "Успех маскировки: СЛ случайной сцены увеличен на +1.", "good");
            if (camoRes === 'crit_failure') this.addLogLine(effectsList, "КП маскировки: СЛ случайной сцены уменьшен на -2. Критический успех проверки случайной сцены: 19 или 20.", "bad");
        }

        if (!isCampHorrible) {
            if (huntRes === 'success') {
                this.addLogLine(effectsList, `Успех охоты (Уровень региона: ${lvl}): Получено пайков в размере СЛ региона (${this.state.normalIngredients}). Бросьте за столом ${specialYieldText} на особые специи.`, "good");
            } else if (huntRes === 'crit_success') {
                this.addLogLine(effectsList, `КУ охоты (Уровень региона: ${lvl}): Получено пайков в размере СЛ региона (${this.state.normalIngredients}) + ${specialYieldText} особых специй.`, "good");
            } else if (huntRes === 'failure') {
                this.addLogLine(effectsList, `Провал охоты: Найдено лишь базовое пропитание в размере СЛ региона (${this.state.normalIngredients}). Особых специй нет.`, "generic");
            } else if (huntRes === 'crit_failure') {
                this.addLogLine(effectsList, `КП охоты: Охота обернулась катастрофой! Число проверок привала (дежурств) увеличено на +1. Бросьте за столом ${this.state.normalIngredients} на количество добытых пайков. Специй нет.`, "bad");
            }
        }
    },

    addLogLine(container, text, type) {
        const line = document.createElement('div');
        line.className = `camp-effect-line ${type}`;
        line.textContent = text;
        container.appendChild(line);
    },
// ============================================================================
// МЕНЕДЖЕР ПРИВАЛА (CAMPING MANAGER) — ЧАСТЬ 3 ИЗ 3
// ============================================================================

    attachInputListeners() {
        const grid = document.querySelector('.camp-gm-inputs-grid');
        if (!grid) return;

        grid.removeEventListener('change', this._handleGridChange);

        this._handleGridChange = () => {
            this.recalculateCamp();
            this.checkCampPhaseCompletion();
        };

        grid.addEventListener('change', this._handleGridChange);
    },

    checkCampPhaseCompletion() {
        const prepareRes = this.getSelectedRadio('res_prepare');
        const camoRes = this.getSelectedRadio('res_camouflage');
        const huntRes = this.getSelectedRadio('res_hunt');

        let isFinished = false;

        // Если КП подготовки — это мгновенный финал лагеря (1 действие)
        if (prepareRes === 'crit_failure') {
            isFinished = true;
        }
        // В штатном режиме ждем заполнения всех трех строк (3 действия)
        else if (prepareRes && camoRes && huntRes) {
            isFinished = true;
        }

        if (isFinished) {
            this.triggerDiceAndResultModal();
        }
    },




    triggerDiceAndResultModal() {
        const overlay = document.getElementById('campDiceOverlay');
        const resultModal = document.getElementById('campResultModal');
        const modalBody = document.getElementById('campResultModalBody');
        const effectsList = document.getElementById('campEffectsList');
        const canvas = document.getElementById('d20Canvas');

        if (!overlay || !resultModal || !modalBody || !effectsList || !canvas) return;

        overlay.classList.add('open');



        // ВСТРОЕННЫЙ СИНТЕЗАТОР ЗВУКА БРОСКА КОСТЕЙ (Web Audio API) с авто-пробуждением
        const playDiceSoundEffects = () => {
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (!AudioContext) return;
                const audioCtx = new AudioContext();

                // ЖЕСТКИЙ ФИКС: Принудительно будим контекст, если браузер усыпил его
                if (audioCtx.state === 'suspended') {
                    audioCtx.resume();
                }

                const playClick = (time, intensity) => {
                    const osc = audioCtx.createOscillator();
                    const gainNode = audioCtx.createGain();
                    const filter = audioCtx.createBiquadFilter();

                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(130 + Math.random() * 70, time);
                    osc.frequency.exponentialRampToValueAtTime(30, time + 0.08);

                    filter.type = 'bandpass';
                    filter.frequency.setValueAtTime(800, time);
                    filter.Q.setValueAtTime(3, time);

                    // Сделали базовый звук чуть сочнее и громче (0.35 вместо 0.2)
                    gainNode.gain.setValueAtTime(0.35 * intensity, time);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

                    osc.connect(filter);
                    filter.connect(gainNode);
                    gainNode.connect(audioCtx.destination);

                    osc.start(time);
                    osc.stop(time + 0.08);
                };

                let scheduleTime = audioCtx.currentTime + 0.02;
                let delay = 0.06; // Немного ускорили начальный темп стука

                for (let i = 0; i < 20; i++) { // Увеличили до 20 ударов для плотности
                    const intensity = Math.max(0.15, (20 - i) / 20);
                    playClick(scheduleTime, intensity);
                    delay += 0.014;
                    scheduleTime += delay;
                }
            } catch (e) { console.warn("Audio Context заблокирован политикой браузера:", e); }
        };


        playDiceSoundEffects();

        const ctx = canvas.getContext('2d');
        const t = (1.0 + Math.sqrt(5.0)) / 2.0;

        let vertices = [
            [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
            [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
            [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
        ].map(v => {
            const length = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
            return [v[0]/length * 120, v[1]/length * 120, v[2]/length * 120];
        });

        const faces = [
            [0, 11, 5, "⚜"], [0, 5, 1, "2"], [0, 1, 7, "3"], [0, 7, 10, "4"], [0, 10, 11, "5"],
            [1, 5, 9, "6"], [5, 11, 4, "7"], [11, 10, 2, "8"], [10, 7, 6, "9"], [7, 1, 8, "10"],
            [3, 9, 4, "11"], [3, 4, 2, "12"], [3, 2, 6, "13"], [3, 6, 8, "14"], [3, 8, 9, "15"],
            [4, 9, 5, "16"], [2, 4, 11, "17"], [6, 2, 10, "18"], [8, 6, 7, "19"], [9, 8, 1, "20"]
        ];
        let angleX = Math.random() * 5, angleY = Math.random() * 5, angleZ = Math.random() * 5;
        const targetX = 0.53, targetY = -0.62, targetZ = 0.55;

        let scale = 0.1;
        let startTime = performance.now();
        let animationFrameId;
        let snapX = null, snapY = null, snapZ = null;

        const draw3D = () => {
            const now = performance.now();
            const elapsed = now - startTime;

            if (elapsed >= 5000) {
                cancelAnimationFrame(animationFrameId);
                overlay.classList.remove('open');
                resultModal.classList.add('open');
                return;
            }

            let curX, curY, curZ;

            if (elapsed < 2500) {
                angleX += 0.06; angleY += 0.09; angleZ += 0.03;
                curX = angleX; curY = angleY; curZ = angleZ;
            }
            else if (elapsed < 3000) {
                if (snapX === null) {
                    snapX = angleX % (Math.PI * 2);
                    snapY = angleY % (Math.PI * 2);
                    snapZ = angleZ % (Math.PI * 2);
                }
                const progress = (elapsed - 2500) / 500;
                const ease = progress * progress * (3 - 2 * progress);
                curX = snapX + (targetX - snapX) * ease;
                curY = snapY + (targetY - snapY) * ease;
                curZ = snapZ + (targetZ - snapZ) * ease;
            }
            else {
                curX = targetX; curY = targetY; curZ = targetZ;
            }

            if (elapsed < 400) scale = 0.1 + 0.9 * (elapsed / 400);
            else if (elapsed > 4600) scale = 1.0 - 0.8 * ((elapsed - 4600) / 400);
            else scale = 1.0;

            ctx.clearRect(0, 0, 400, 400);
            const lightDir = [0.3, 0.3, 1];
            const lLen = Math.sqrt(lightDir[0]*lightDir[0] + lightDir[1]*lightDir[1] + lightDir[2]*lightDir[2]);
            const light = [lightDir[0]/lLen, lightDir[1]/lLen, lightDir[2]/lLen];

            const rotatedVertices = vertices.map(v => {
                let x = v[0], y = v[1], z = v[2];
                let cosX = Math.cos(curX), sinX = Math.sin(curX);
                let y1 = y * cosX - z * sinX, z1 = y * sinX + z * cosX;
                let cosY = Math.cos(curY), sinY = Math.sin(curY);
                let x2 = x * cosY + z1 * sinY, z2 = -x * sinY + z1 * cosY;
                let cosZ = Math.cos(curZ), sinZ = Math.sin(curZ);
                let x3 = x2 * cosZ - y1 * sinZ, y3 = x2 * sinZ + y1 * cosZ;
                return [x3 * scale + 200, y3 * scale + 200, z2];
            });

            const renderOrder = faces.map(f => {
                const zAvg = (rotatedVertices[f[0]][2] + rotatedVertices[f[1]][2] + rotatedVertices[f[2]][2]) / 3;
                return { face: f, z: zAvg };
            }).sort((a, b) => a.z - b.z);

            renderOrder.forEach(item => {
                const f = item.face;
                const p0 = rotatedVertices[f[0]], p1 = rotatedVertices[f[1]], p2 = rotatedVertices[f[2]];
                const ux = p1[0] - p0[0], uy = p1[1] - p0[1];
                const vx = p2[0] - p0[0], vy = p2[1] - p0[1];
                const nz = ux * vy - uy * vx;

                if (nz > 0) {
                    const ax = vertices[f[1]][0] - vertices[f[0]][0], ay = vertices[f[1]][1] - vertices[f[0]][1], az = vertices[f[1]][2] - vertices[f[0]][2];
                    const bx = vertices[f[2]][0] - vertices[f[0]][0], by = vertices[f[2]][1] - vertices[f[0]][1], bz = vertices[f[2]][2] - vertices[f[0]][2];
                    let crossX = ay*bz - az*by, crossY = az*bx - ax*bz, crossZ = ax*by - ay*bx;
                    let cLen = Math.sqrt(crossX*crossX + crossY*crossY + crossZ*crossZ);
                    crossX /= cLen; crossY /= cLen; crossZ /= cLen;

                    let ny1 = crossY*Math.cos(curX) - crossZ*Math.sin(curX), nz1 = crossY*Math.sin(curX) + crossZ*Math.cos(curX);
                    let nx2 = crossX*Math.cos(curY) + nz1*Math.sin(curY);
                    let nx3 = nx2*Math.cos(curZ) - ny1*Math.sin(curZ), ny3 = nx2*Math.sin(curZ) + ny1*Math.cos(curZ);

                    const dot = nx3*light[0] + ny3*light[1] + nz1*light[2];
                    const brightness = Math.max(0.2, dot);
                    const r = Math.floor(23 + 115 * brightness), g = Math.floor(45 + 150 * brightness), b = Math.floor(28 + 80 * brightness);

                    ctx.beginPath();
                    ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]);
                    ctx.closePath();
                    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`; ctx.fill();
                    ctx.strokeStyle = "rgba(223, 188, 111, 0.75)"; ctx.lineWidth = 1; ctx.stroke();

                    ctx.save();
                    ctx.fillStyle = "#ffd875";
                    ctx.font = `bold ${Math.floor(22 * scale)}px 'Times New Roman', serif`;
                    ctx.textAlign = "center"; ctx.textBaseline = "middle";
                    ctx.fillText(f[3], (p0[0] + p1[0] + p2[0]) / 3, (p0[1] + p1[1] + p2[1]) / 3);
                    ctx.restore();
                }
            });
            animationFrameId = requestAnimationFrame(draw3D);
        };

        modalBody.innerHTML = '';
        const summaryStats = document.createElement('div');
        summaryStats.style.cssText = 'background: rgba(0,0,0,0.4); padding: 12px; border: 1px solid #543e0d; border-radius: 4px; margin-bottom: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; text-align: center; color: #ffd875; font-weight: bold;';
        summaryStats.innerHTML = `
            <div>🎲 СЛ Сцены: <span style="color:#fff;">${this.state.encounterDc}</span></div>
            <div>⏱ Проверок: <span style="color:#2ecc71;">${this.state.totalChecks}</span></div>
            <div>🥩 Пайки: <span style="color:#fff;">${this.state.normalIngredients}</span></div>
            <div>🌿 Специи: <span style="color:#2ecc71;">${this.state.specialIngredients}</span></div>
        `;
        modalBody.appendChild(summaryStats);

        Array.from(effectsList.children).forEach(child => {
            const clone = child.cloneNode(true);
            clone.style.fontSize = '20px';
            modalBody.appendChild(clone);
        });

        draw3D();
    },

    saveFromUi() {
        try {
            if (this.mapDataRef) this.mapDataRef.camping = this.state;
            if (this.onSaveCallback) this.onSaveCallback();
            else localStorage.setItem('hexMapSystemData', JSON.stringify(this.mapDataRef));

            const questLogContainerEl = document.getElementById('questLogContainer');
            if (questLogContainerEl) questLogContainerEl.classList.add('ui-collapsed');

            const saveBtn = document.querySelector('.kingdom-save-wrapper .btn.ok');
            if (saveBtn) {
                const oldText = saveBtn.textContent;
                saveBtn.style.setProperty('transform', 'scale(0.96)', 'important');
                saveBtn.textContent = '⚜ Итоги применены!';

                const flash = document.createElement('div');
                flash.className = 'button-flash-overlay';
                flash.style.left = saveBtn.offsetLeft + 'px';
                flash.style.top = saveBtn.offsetTop + 'px';
                flash.style.width = saveBtn.offsetWidth + 'px';
                flash.style.height = saveBtn.offsetHeight + 'px';
                saveBtn.parentNode.appendChild(flash);

                setTimeout(() => {
                    saveBtn.style.removeProperty('transform');
                    flash.style.opacity = '0';
                }, 40);

                setTimeout(() => {
                    flash.remove();
                    saveBtn.textContent = oldText;
                    if (window.QuestManager) window.QuestManager.currentFilter = 'active';
                }, 450);
            }
        } catch (error) { console.error("Критическая ошибка при сохранении привала:", error); }
    },

    resetToDefault() {
        try {
            const camoRow = document.getElementById('row_camouflage');
            const huntRow = document.getElementById('row_hunt');

            if (camoRow) camoRow.style.display = 'table-row';
            if (huntRow) huntRow.style.display = 'table-row';

            this.state.baseChecks = 2;
            this.state.checkMod = 12;

            document.querySelectorAll('input[type="radio"]').forEach(radio => {
                radio.checked = false;
            });

            this.syncCountersUi();
            this.recalculateCamp();

            const resetBtn = document.querySelector('.kingdom-save-wrapper .btn.del');
            if (resetBtn) {
                const oldText = resetBtn.textContent;
                resetBtn.style.setProperty('transform', 'scale(0.96)', 'important');
                resetBtn.textContent = '🔄 Сброшено';

                const flash = document.createElement('div');
                flash.className = 'button-flash-overlay';
                flash.style.left = resetBtn.offsetLeft + 'px';
                flash.style.top = resetBtn.offsetTop + 'px';
                flash.style.width = resetBtn.offsetWidth + 'px';
                flash.style.height = resetBtn.offsetHeight + 'px';
                resetBtn.parentNode.appendChild(flash);

                setTimeout(() => {
                    resetBtn.style.removeProperty('transform');
                    flash.style.opacity = '0';
                }, 40);

                setTimeout(() => {
                    flash.remove();
                    resetBtn.textContent = oldText;
                }, 450);
            }
        } catch (e) { console.error("Ошибка при сбросе параметров привала:", e); }
    }
};

export default CampingManager;
