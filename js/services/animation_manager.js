import { MAP_CONFIG } from '../config/app_config.js';
import HexCanvasRender from '../core/hex_canvas_render.js';
import ViewportManager from '../services/viewport_manager.js';

const AnimationManager = {
    _sharedAudioCtx: null,

    createBurst(bx, by) {
        const burstContainer = document.createElement('div');
        burstContainer.className = 'flag-impact-burst';
        burstContainer.style.left = `${bx}px`;
        burstContainer.style.top = `${by}px`;

        const sparksCount = 8;
        for (let i = 0; i < sparksCount; i++) {
            const spark = document.createElement('div');
            spark.className = 'impact-spark';
            const currentAngle = (360 / sparksCount) * i;
            spark.style.setProperty('--angle', `${currentAngle}deg`);
            burstContainer.appendChild(spark);
        }
        document.body.appendChild(burstContainer);
        setTimeout(() => { burstContainer.remove(); }, 250);
    },

    spawnBeamsBurst(cx, cy, scale = 1.0) {
        const beamsContainer = document.createElement('div');
        beamsContainer.className = 'hex-beams-burst';
        beamsContainer.style.left = `${cx}px`;
        beamsContainer.style.top = `${cy}px`;

        if (scale !== 1.0) {
            beamsContainer.style.transform = `translate(-50%, -50%) scale(${scale})`;
        }

        for (let i = 0; i < 6; i++) {
            const beam = document.createElement('div');
            beam.className = 'focus-beam';
            const currentAngle = 60 * i - 30;
            beam.style.setProperty('--angle', `${currentAngle}deg`);
            beamsContainer.appendChild(beam);
        }
        document.body.appendChild(beamsContainer);
        setTimeout(() => { beamsContainer.remove(); }, 1200);
    },

    warmUpAudioContext() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext && !AnimationManager._sharedAudioCtx) {
                AnimationManager._sharedAudioCtx = new AudioContext();
            }
            if (AnimationManager._sharedAudioCtx && AnimationManager._sharedAudioCtx.state === 'suspended') {
                AnimationManager._sharedAudioCtx.resume();
            }
        } catch (e) {}
    },

    _playDiceSoundEffects() {
        try {
            const audioCtx = AnimationManager._sharedAudioCtx || new (window.AudioContext || window.webkitAudioContext)();
            if (!audioCtx) return;
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const playClick = (time, intensity) => {
                const osc = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                const filter = audioCtx.createBiquadFilter();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(140 + Math.random() * 60, time);
                osc.frequency.exponentialRampToValueAtTime(35, time + 0.08);

                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(750, time);
                filter.Q.setValueAtTime(4, time);

                gainNode.gain.setValueAtTime(0.4 * intensity, time);
                gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

                osc.connect(filter);
                filter.connect(gainNode);
                gainNode.connect(audioCtx.destination);

                osc.start(time);
                osc.stop(time + 0.08);
            };

            let scheduleTime = audioCtx.currentTime + 0.02;
            let delay = 0.05;
            for (let i = 0; i < 22; i++) {
                playClick(scheduleTime, Math.max(0.15, (22 - i) / 22));
                delay += 0.002;
                scheduleTime += delay;
            }
        } catch (e) {}
    },

    playFlagFlight(oldHexId, currentHexId, onImpactCallback) {
        if (oldHexId === currentHexId) {
            if (typeof onImpactCallback === 'function') onImpactCallback();
            return;
        }

        // Страхуем получение данных о координатах целевого гекса
        const targetCoords = HexCanvasRender.hexCoords ? HexCanvasRender.hexCoords[currentHexId] : null;
        if (!targetCoords) {
            if (typeof onImpactCallback === 'function') onImpactCallback();
            return;
        }

        // Рассчитываем стартовый гекс (или столицу при FLIGHT_FROM_CAPITAL_MODE)
        let startCoords = HexCanvasRender.hexCoords ? HexCanvasRender.hexCoords[oldHexId] : null;
        if (!startCoords || oldHexId === 'hex_0_0' || window.FLIGHT_FROM_CAPITAL_MODE) {
            startCoords = (HexCanvasRender.hexCoords && HexCanvasRender.hexCoords['hex_0_0']) || { cx: 0, cy: 0 };
        }

        // НАХОДИМ РЕАЛЬНЫЙ ХОЛСТ НА ЭКРАНЕ ДЛЯ СНЯТИЯ МАТРИЦЫ СДВИГА
        const canvasElement = document.getElementById('mapCanvas');
        if (!canvasElement) {
            if (typeof onImpactCallback === 'function') onImpactCallback();
            return;
        }

        // Считываем физические границы холста с учетом CSS-трансформаций, скролла и зума
        const canvasRect = canvasElement.getBoundingClientRect();

        // Вычисляем текущий реальный масштаб сжатия/растяжения Canvas на экране ГМа
        const realScaleX = canvasRect.width / 3840;
        const realScaleY = canvasRect.height / 1280;

        // ПРЯМАЯ ПРОЕКЦИЯ КООРДИНАТ: Точнейшая привязка виртуального гекса к пикселям монитора
        const calcScreen = (coords) => ({
            x: canvasRect.left + (coords.cx * realScaleX),
            y: canvasRect.top + (coords.cy * realScaleY)
        });

        const startScreen = calcScreen(startCoords);
        const targetScreen = calcScreen(targetCoords);

        // Считываем текущий визуальный скин токена отряда
        let tokenSkin = 'flag';
        if (window.CURRENT_SQUAD_TOKEN_SKIN) {
            tokenSkin = window.CURRENT_SQUAD_TOKEN_SKIN;
        } else if (window.SettingsManager && window.SettingsManager.state && window.SettingsManager.state.squadTokenSkin) {
            tokenSkin = window.SettingsManager.state.squadTokenSkin;
        }
        tokenSkin = String(tokenSkin).trim().toLowerCase();

        let flightContainer;
        const size = 120; // Габариты холста под 3D-модели

        if (tokenSkin === 'queen' || tokenSkin === 'rook' || tokenSkin === 'castle') {
            flightContainer = document.createElement('canvas');
            flightContainer.width = size;
            flightContainer.height = size;
            flightContainer.style.cssText = `
                position: fixed;
                z-index: 2000000 !important;
                pointer-events: none;
                background: transparent !important;
                border: none !important;
                box-shadow: none !important;
                will-change: transform;
                left: 0;
                top: 0;
            `;

            const fCtx = flightContainer.getContext('2d');



            const renderLoop = () => {
                if (!document.body.contains(flightContainer)) return;
                fCtx.clearRect(0, 0, size, size);
                if (tokenSkin === 'queen') {
                    this.draw3DQueenToken(fCtx, size / 2, size / 2 + 15);
                } else if (tokenSkin === 'rook') {
                    this.draw3DRookToken(fCtx, size / 2, size / 2 + 15);
                } else if (tokenSkin === 'castle') {
                    this.draw3DCastleToken(fCtx, size / 2, size / 2 + 15); // Наш замок в полете
                }
                requestAnimationFrame(renderLoop);
            };



            requestAnimationFrame(renderLoop);

        } else {
            flightContainer = document.createElement('div');
            flightContainer.className = 'global-flying-flag';
            flightContainer.style.cssText = `
                position: fixed;
                z-index: 2000000 !important;
                pointer-events: none;
                left: 0;
                top: 0;
            `;
            flightContainer.innerHTML = `<div class="squad-pole"><div class="squad-flag"></div></div>`;
        }

        // Идеальное центрирование геометрии токенов по центру шестиугольника гекса
        const offsetX = (tokenSkin === 'queen' || tokenSkin === 'rook') ? size / 2 : 9;
        const offsetY = (tokenSkin === 'queen' || tokenSkin === 'rook') ? size / 2 + 15 : 50;

        const startX = startScreen.x - offsetX;
        const startY = startScreen.y - offsetY;
        const targetX = targetScreen.x - offsetX;
        const targetY = targetScreen.y - offsetY;

        flightContainer.style.setProperty('--start-x', `${startX}px`);
        flightContainer.style.setProperty('--start-y', `${startY}px`);
        flightContainer.style.setProperty('--target-x', `${targetX}px`);
        flightContainer.style.setProperty('--target-y', `${targetY}px`);

        // Запускаем аппаратную интерполяцию полета
        flightContainer.style.animation = 'windowsSmoothFly3D 1.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';

        document.body.appendChild(flightContainer);

        // Обработка импакт-эффектов приземления в точке назначения
        setTimeout(() => {
            let mode = 'classic';
            if (window.SettingsManager && window.SettingsManager.state && window.SettingsManager.state.squadAnimMode) {
                mode = window.SettingsManager.state.squadAnimMode;
            }

            const viewportView = document.getElementById('viewport');

            if (mode === 'wave') {
                this.spawnBeamsBurst(targetScreen.x, targetScreen.y, 0.1);
                const container = document.createElement('div');
                container.style.cssText = `position:absolute; left:${targetScreen.x}px; top:${targetScreen.y}px; pointer-events:none; z-index:9999;`;
                document.body.appendChild(container);
                const runesPool = (window.FrameManager && window.FrameManager.RUNE_POOL) || ["ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ", "ᚺ", "ᚾ", "ᛁ", "ᛃ", "ᛇ", "ᛈ", "ᛉ", "ᛊ", "ᛏ", "ᛒ", "ᛗ", "ᛚ", "ᛜ", "ᛟ", "ᛞ"];
                const numRunes = 12;
                for (let i = 0; i < numRunes; i++) {
                    const runeEl = document.createElement('div');
                    runeEl.className = 'squad-rune-particle';
                    runeEl.textContent = runesPool[Math.floor(Math.random() * runesPool.length)];
                    const angleRad = (Math.PI * 2 / numRunes) * i;
                    const angleDeg = (360 / numRunes) * i;
                    const startRadius = 15; const targetRadius = 130;
                    const startX = Math.cos(angleRad) * startRadius; const startY = Math.sin(angleRad) * startRadius;
                    const targetX = Math.cos(angleRad) * targetRadius; const targetY = Math.sin(angleRad) * targetRadius;
                    runeEl.style.setProperty('--start-x', `${startX}px`); runeEl.style.setProperty('--start-y', `${startY}px`);
                    runeEl.style.setProperty('--target-x', `${targetX}px`); runeEl.style.setProperty('--target-y', `${targetY}px`);
                    runeEl.style.setProperty('--rotate-deg', `${angleDeg - 90}deg`);
                    container.appendChild(runeEl);
                }
                setTimeout(() => container.remove(), 1000);
            } else if (mode === 'ghost') {
                const cloud = document.createElement('div');
                cloud.className = 'squad-impact-cloud';
                cloud.style.left = `${targetScreen.x}px`; cloud.style.top = `${targetScreen.y}px`;
                document.body.appendChild(cloud);
                setTimeout(() => cloud.remove(), 1200);
            } else if (mode === 'shake') {
                this.spawnBeamsBurst(targetScreen.x, targetScreen.y, 0.1);
                if (viewportView) {
                    viewportView.classList.add('squad-screen-shake');
                    setTimeout(() => viewportView.classList.remove('squad-screen-shake'), 400);
                }
            } else {
                this.spawnBeamsBurst(targetScreen.x, targetScreen.y, 0.1);
                setTimeout(() => { this.spawnBeamsBurst(targetScreen.x - 45, targetScreen.y + 40, 0.1); }, 130);
                setTimeout(() => { this.spawnBeamsBurst(targetScreen.x + 45, targetScreen.y - 40, 0.1); }, 310);
            }

            if (typeof onImpactCallback === 'function') onImpactCallback();
        }, 1300);

        setTimeout(() => { flightContainer.remove(); }, 1300);
    },


    focusOnHex(hexId) {
        const coords = HexCanvasRender.hexCoords[hexId];
        if (!coords) return;
        const zoom = ViewportManager.currentZoom || 1.0;
        const viewportElement = document.getElementById('viewport');

        if (viewportElement) {
            ViewportManager.lockFocusUntil = Date.now() + 1800;
            let targetPanX = ((3840 - coords.cx) * zoom) - viewportElement.clientWidth / 2;
            let targetPanY = (viewportElement.clientHeight / 2) - (coords.cy * zoom);
            const { minX, maxX, minY, maxY } = MAP_CONFIG.viewport.limits;

            ViewportManager.x = Math.max(minX, Math.min(maxX, targetPanX));
            ViewportManager.y = Math.max(minY, Math.min(maxY, targetPanY));
            ViewportManager.updateMapTransform();
        }

        setTimeout(() => {
            HexCanvasRender.triggerFocus(hexId);
            const viewRect = viewportElement ? viewportElement.getBoundingClientRect() : { left: 0, top: 0 };
            const cx = viewRect.left + ViewportManager.x + (viewportElement ? viewportElement.clientWidth : 0) - ((3840 - coords.cx) * zoom);
            const cy = viewRect.top + ViewportManager.y + (coords.cy * zoom);
            this.spawnBeamsBurst(cx, cy);
        }, 100);
    },

    toggleQuestTooltips(btnElement) {
        if (!HexCanvasRender) return;
        HexCanvasRender.showQuestTooltips = !HexCanvasRender.showQuestTooltips;
        if (btnElement) {
            btnElement.title = HexCanvasRender.showQuestTooltips ? "Скрыть маркеры заданий" : "Показать маркеры заданий";
            btnElement.classList.toggle('ui-active', !HexCanvasRender.showQuestTooltips);
        }
        if (typeof HexCanvasRender.requestFrame === 'function') HexCanvasRender.requestFrame();
    },


    playCampDiceAnimation(targetDc, onCompleteCallback) {
        const overlay = document.getElementById('campDiceOverlay');
        const canvas = document.getElementById('d20Canvas');
        if (!overlay || !canvas) { if (typeof onCompleteCallback === 'function') onCompleteCallback(); return; }
        overlay.classList.add('open'); this._playDiceSoundEffects();
        const ctx = canvas.getContext('2d'), t = (1.0 + Math.sqrt(5.0)) / 2.0;

        const vertices = [
            [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t],
            [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
        ].map(v => { const l = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]); return [v[0]/l * 120, v[1]/l * 120, v[2]/l * 120]; });

        const faces = [
            [0, 11, 5, "⚜"], [0, 5, 1, "2"], [0, 1, 7, "3"], [0, 7, 10, "4"], [0, 10, 11, "5"],
            [1, 5, 9, "6"], [5, 11, 4, "7"], [11, 10, 2, "8"], [10, 7, 6, "9"], [7, 1, 8, "10"],
            [3, 9, 4, "11"], [3, 4, 2, "12"], [3, 2, 6, "13"], [3, 6, 8, "14"], [3, 8, 9, "15"],
            [4, 9, 5, "16"], [2, 4, 11, "17"], [6, 2, 10, "18"], [8, 6, 7, "19"], [9, 8, 1, "20"]
        ];

        // 1. НАМЕРТВО БЕРЕМ ИДЕАЛЬНЫЕ УГЛЫ ПОВОРОТА ОТ ГРАНИ "12" (Индекс 11 в массиве faces)
        const fWinBase = faces[11];
        let nx = (vertices[fWinBase[0]][0] + vertices[fWinBase[1]][0] + vertices[fWinBase[2]][0]) / 3;
        let ny = (vertices[fWinBase[0]][1] + vertices[fWinBase[1]][1] + vertices[fWinBase[2]][1]) / 3;
        let nz = (vertices[fWinBase[0]][2] + vertices[fWinBase[1]][2] + vertices[fWinBase[2]][2]) / 3;
        const nl = Math.sqrt(nx*nx + ny*ny + nz*nz); nx /= nl; ny /= nl; nz /= nl;

        const rotY = -Math.atan2(nx, nz);
        const nzR = -nx * Math.sin(rotY) + nz * Math.cos(rotY);
        const rotX = Math.atan2(ny, nzR);

        // 2. ОПРЕДЕЛЯЕМ ВЫПАВШЕЕ ДЛЯ ГМА ЗНАЧЕНИЕ (НАПРИМЕР, ИТОГОВОЕ СЛ)
        const dcMap = { "⚜":0, "1":0, "2":1, "3":2, "4":3, "5":4, "6":5, "7":6, "8":7, "9":8, "10":9, "11":10, "12":11, "13":12, "14":13, "15":14, "16":15, "17":16, "18":17, "19":18, "20":19 };
        let realWinIdx = 11;
        if (targetDc !== undefined && targetDc !== null) {
            const k = String(targetDc).trim();
            if (dcMap[k] !== undefined) realWinIdx = dcMap[k];
        }

        // Запоминаем строковый символ, который нужно вывести во фронт (например "20", "14" или "⚜")
        const dynamicTextValue = faces[realWinIdx][3];

        let aX = Math.random() * 5, aY = Math.random() * 5, aZ = Math.random() * 5;
        let sc = 0.1, sTime = performance.now(), frameId, snapX = null, snapY = null, snapZ = null, flashed = false;

        const draw3D = () => {
            const elapsed = performance.now() - sTime;
            if (elapsed >= 3000) { cancelAnimationFrame(frameId); overlay.classList.remove('open'); if (onCompleteCallback) onCompleteCallback(); return; }

            let cX = aX += 0.12, cY = aY += 0.18, cZ = aZ += 0.06;
            if (elapsed >= 1000 && elapsed < 1400) {
                if (snapX === null) { snapX = (aX - 0.12) % (Math.PI * 2); snapY = (aY - 0.18) % (Math.PI * 2); snapZ = (aZ - 0.06) % (Math.PI * 2); }
                const p = (elapsed - 1000) / 400, ease = p * p * (3 - 2 * p);
                cX = snapX + (rotX - snapX) * ease; cY = snapY + (rotY - snapY) * ease; cZ = snapZ + (0 - snapZ) * ease;
            } else if (elapsed >= 1400) { cX = rotX; cY = rotY; cZ = 0; }

            sc = elapsed < 200 ? 0.1 + 0.9 * (elapsed / 200) : (elapsed > 2700 ? 1.0 - 0.9 * ((elapsed - 2700) / 300) : 1.0);
            ctx.clearRect(0, 0, 400, 400);

            const rotated = vertices.map(v => {
                let x = v[0], y = v[1], z = v[2];
                let y1 = y * Math.cos(cX) - z * Math.sin(cX), z1 = y * Math.sin(cX) + z * Math.cos(cX);
                let x2 = x * Math.cos(cY) + z1 * Math.sin(cY), z2 = -x * Math.sin(cY) + z1 * Math.cos(cY);
                let x3 = x2 * Math.cos(cZ) - y1 * Math.sin(cZ), y3 = x2 * Math.sin(cZ) + y1 * Math.cos(cZ);
                return [x3 * sc + 200, y3 * sc + 200, z2];
            });

            const renderOrder = faces.map(f => ({ face: f, z: (rotated[f[0]][2] + rotated[f[1]][2] + rotated[f[2]][2]) / 3 })).sort((a, b) => a.z - b.z);

            renderOrder.forEach(item => {
                const f = item.face, p0 = rotated[f[0]], p1 = rotated[f[1]], p2 = rotated[f[2]];
                if ((p1[0] - p0[0]) * (p2[1] - p0[1]) - (p1[1] - p0[1]) * (p2[0] - p0[0]) > 0) {
                    const ax = vertices[f[1]][0] - vertices[f[0]][0], ay = vertices[f[1]][1] - vertices[f[0]][1], az = vertices[f[1]][2] - vertices[f[0]][2];
                    const bx = vertices[f[2]][0] - vertices[f[0]][0], by = vertices[f[2]][1] - vertices[f[0]][1], bz = vertices[f[2]][2] - vertices[f[0]][2];
                    let cx = ay*bz - az*by, cy = az*bx - ax*bz, cz = ax*by - ay*bx, cl = Math.sqrt(cx*cx + cy*cy + cz*cz); cx /= cl; cy /= cl; cz /= cl;

                    let ny1 = cy*Math.cos(cX) - cz*Math.sin(cX), nz1 = cy*Math.sin(cX) + cz*Math.cos(cX), nx2 = cx*Math.cos(cY) + nz1*Math.sin(cY);
                    let nx3 = nx2*Math.cos(cZ) - ny1*Math.sin(cZ), ny3 = nx2*Math.sin(cZ) + ny1*Math.cos(cZ);

                    const brightness = Math.max(0.2, nx3*0.3 + ny3*0.3 + nz1*0.9);
                    ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.closePath();
                    ctx.fillStyle = `rgb(${Math.floor(180 + 75 * brightness)}, ${Math.floor(135 + 80 * brightness)}, ${Math.floor(35 + 40 * brightness)})`; ctx.fill();
                    ctx.strokeStyle = "rgba(255, 230, 150, 0.85)"; ctx.lineWidth = 1.5; ctx.stroke();

                    // Если это финальная фронтальная грань (Индекс 11) — рисуем на ней динамический текст
                    if (elapsed >= 1400 && f[0] === faces[11][0] && f[1] === faces[11][1] && f[2] === faces[11][2]) {
                        ctx.save(); if (!flashed) { this.spawnBeamsBurst(canvas.getBoundingClientRect().left + 200, canvas.getBoundingClientRect().top + 200, 1.4); flashed = true; }

                        const opacity = Math.min(1, (elapsed - 1400) / 150);
                        let size = Math.floor(54 * sc), sCol = `rgba(255,162,0,${opacity})`, tCol = `rgba(255,255,255,${opacity})`;

                        if (dynamicTextValue === "20") { size = Math.floor(68 * sc); sCol = `rgba(46,204,113,${opacity})`; tCol = `rgba(235,255,240,${opacity})`; }
                        else if (dynamicTextValue === "1" || dynamicTextValue === "⚜") { size = Math.floor(68 * sc); sCol = `rgba(231,76,60,${opacity})`; tCol = `rgba(255,210,210,${opacity})`; }

                        ctx.fillStyle = tCol; ctx.font = `900 ${size}px 'Times New Roman', serif`; ctx.shadowColor = sCol; ctx.shadowBlur = 18; ctx.textAlign = "center"; ctx.textBaseline = "middle";
                        ctx.fillText(dynamicTextValue, (p0[0] + p1[0] + p2[0]) / 3, (p0[1] + p1[1] + p2[1]) / 3); ctx.restore();
                    }
                }
            });
            frameId = requestAnimationFrame(draw3D);
        };
        draw3D();
    },

    /**
     * [ПЕРЕНЕСЕНО] Математически точный 3D low-poly движок шахматного Ферзя из граней
     */
    draw3DQueenToken(ctx, cx, cy) {
        ctx.save();
        ctx.translate(cx, cy - 6);

        const time = Date.now() / 1000;
        const bounceY = Math.sin(time * 2.2) * 1.8;
        const angleY = time * 0.45;
        ctx.translate(0, bounceY);

        const lightDir = [0.5, -0.8, 0.4];
        const lLength = Math.sqrt(lightDir[0]*lightDir[0] + lightDir[1]*lightDir[1] + lightDir[2]*lightDir[2]);
        const lNorm = [lightDir[0]/lLength, lightDir[1]/lLength, lightDir[2]/lLength];

        const vertices = [];
        const segments = 10;

        // ЖЕСТКАЯ ЗАЩИТА: Пошаговый push профиля Ферзя без пустых ячеек
        const profile = [];
        profile.push([14, 25]);
        profile.push([13, 20]);
        profile.push([11, 14]);
        profile.push([7, 0]);
        profile.push([6, -6]);
        profile.push([8, -11]);
        profile.push([5, -14]);
        profile.push([8, -20]);
        profile.push([11, -26]);
        profile.push([0, -32]);

        for (let j = 0; j < profile.length; j++) {
            const radius = profile[j][0];
            const h = profile[j][1];
            for (let i = 0; i < segments; i++) {
                const ang = (Math.PI * 2 / segments) * i;
                if (j === profile.length - 1) vertices.push([0, h, 0]);
                else vertices.push([Math.cos(ang) * radius, h, Math.sin(ang) * radius]);
            }
        }

        const faces = [];
        for (let j = 0; j < profile.length - 1; j++) {
            const layerOffset = j * segments;
            const nextLayerOffset = (j + 1) * segments;
            for (let i = 0; i < segments; i++) {
                const next = (i + 1) % segments;
                if (j === 8) {
                    if (i % 2 === 0) faces.push([layerOffset + i, layerOffset + next, nextLayerOffset + next]);
                } else if (j === profile.length - 2) {
                    faces.push([layerOffset + i, layerOffset + next, nextLayerOffset + i]);
                } else {
                    faces.push([layerOffset + i, layerOffset + next, nextLayerOffset + next, nextLayerOffset + i]);
                }
            }
        }

        const projected = vertices.map(v => {
            const rotX = v[0] * Math.cos(angleY) + v[2] * Math.sin(angleY);
            const rotZ = -v[0] * Math.sin(angleY) + v[2] * Math.cos(angleY);
            return [rotX, v[1], rotZ];
        });

        const renderOrder = faces.map((f, idx) => {
            let zSum = 0;
            for (let vIdx of f) zSum += projected[vIdx][2];
            return { face: f, z: zSum / f.length, origIdx: idx };
        }).sort((a, b) => a.z - b.z);

        renderOrder.forEach(item => {
            const f = item.face;
            const p0 = vertices[f[0]], p1 = vertices[f[1]], p2 = vertices[f[2]];
            const ax = p1[0] - p0[0], ay = p1[1] - p0[1], az = p1[2] - p0[2];
            const bx = p2[0] - p0[0], by = p2[1] - p0[1], bz = p2[2] - p0[2];

            let nx = ay * bz - az * by;
            let ny = az * bx - ax * bz;
            let nz = ax * by - ay * bx;
            const nLen = Math.sqrt(nx*nx + ny*ny + nz*nz);

            if (nLen > 0) {
                nx /= nLen; ny /= nLen; nz /= nLen;
                const rNx = nx * Math.cos(angleY) + nz * Math.sin(angleY);
                const rNz = -nx * Math.sin(angleY) + nz * Math.cos(angleY);
                const dot = rNx * lNorm[0] + ny * lNorm[1] + rNz * lNorm[2];
                const intensity = Math.max(0.24, dot);

                ctx.beginPath();
                ctx.moveTo(projected[f[0]][0], projected[f[0]][1]);
                for (let i = 1; i < f.length; i++) {
                    ctx.lineTo(projected[f[i]][0], projected[f[i]][1]);
                }
                ctx.closePath();

                // Динамическая палитра материалов в зависимости от выбора ГМа
                const tokenColorMaterial = window.CURRENT_SQUAD_TOKEN_COLOR || 'gold';
                let r = 0, g = 0, b = 0;
                let strokeColor = "rgba(255, 240, 180, 0.35)";

                if (tokenColorMaterial === 'ruby') {
                    r = Math.floor(180 + 75 * intensity);
                    g = Math.floor(30 + 25 * intensity);
                    b = Math.floor(30 + 25 * intensity);
                    strokeColor = "rgba(255, 190, 190, 0.4)";
                } else if (tokenColorMaterial === 'emerald') {
                    r = Math.floor(30 + 25 * intensity);
                    g = Math.floor(160 + 80 * intensity);
                    b = Math.floor(60 + 35 * intensity);
                    strokeColor = "rgba(190, 255, 190, 0.4)";
                } else if (tokenColorMaterial === 'obsidian') {
                    r = Math.floor(35 + 30 * intensity);
                    g = Math.floor(45 + 35 * intensity);
                    b = Math.floor(55 + 45 * intensity);
                    strokeColor = "rgba(200, 220, 255, 0.25)";
                } else if (tokenColorMaterial === 'bone') {
                    r = Math.floor(210 + 45 * intensity);
                    g = Math.floor(215 + 40 * intensity);
                    b = Math.floor(200 + 40 * intensity);
                    strokeColor = "rgba(150, 140, 120, 0.3)";
                } else {
                    // НАШЕ КЛАССИЧЕСКОЕ КОРОЛЕВСКОЕ ЗОЛОТО (Дефолт)
                    r = Math.floor(205 + 50 * intensity);
                    g = Math.floor(160 + 45 * intensity);
                    b = Math.floor(55 + 25 * intensity);
                    strokeColor = "rgba(255, 242, 195, 0.4)";
                }

                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                ctx.fill();

                ctx.strokeStyle = strokeColor;
                ctx.lineWidth = 0.8;
                ctx.stroke();

            }
        });
        ctx.restore();
    },

    /**
     * [ПЕРЕНЕСЕНО] Монументальная 3D low-poly Ладья с уширенной подошвой из граней
     */
    draw3DRookToken(ctx, cx, cy) {
        ctx.save();
        ctx.translate(cx, cy - 6);

        const time = Date.now() / 1000;
        const bounceY = Math.sin(time * 2.2) * 1.8;
        const angleY = time * 0.45;
        ctx.translate(0, bounceY);

        const lightDir = [0.5, -0.8, 0.4];
        const lLength = Math.sqrt(lightDir[0]*lightDir[0] + lightDir[1]*lightDir[1] + lightDir[2]*lightDir[2]);
        const lNorm = [lightDir[0]/lLength, lightDir[1]/lLength, lightDir[2]/lLength];

        const vertices = [];
        const segments = 12;

        // ЖЕСТКАЯ ЗАЩИТА: Пошаговый push профиля Ладьи без пустых ячеек
        const profile = [];
        profile.push([17, 25]);
        profile.push([16, 21]);
        profile.push([12, 16]);
        profile.push([8, -2]);
        profile.push([9, -12]);
        profile.push([12, -16]);
        profile.push([15, -24]);
        profile.push([15, -24]);
        profile.push([16, -34]);
        profile.push([11, -24]);

        for (let j = 0; j < profile.length; j++) {
            const radius = profile[j][0];
            const h = profile[j][1];
            for (let i = 0; i < segments; i++) {
                const ang = (Math.PI * 2 / segments) * i;
                vertices.push([Math.cos(ang) * radius, h, Math.sin(ang) * radius]);
            }
        }

        const faces = [];
        for (let j = 0; j < profile.length - 1; j++) {
            const layerOffset = j * segments;
            const nextLayerOffset = (j + 1) * segments;
            for (let i = 0; i < segments; i++) {
                const next = (i + 1) % segments;
                if (j === 7) {
                    if (i % 3 === 0 || i % 3 === 1) faces.push([layerOffset + i, layerOffset + next, nextLayerOffset + next, nextLayerOffset + i]);
                } else if (j === 8) {
                    if (i % 3 === 0 || i % 3 === 1) faces.push([layerOffset + i, layerOffset + next, nextLayerOffset + next, nextLayerOffset + i]);
                } else {
                    faces.push([layerOffset + i, layerOffset + next, nextLayerOffset + next, nextLayerOffset + i]);
                }
            }
        }

        const projected = vertices.map(v => {
            const rotX = v[0] * Math.cos(angleY) + v[2] * Math.sin(angleY);
            const rotZ = -v[0] * Math.sin(angleY) + v[2] * Math.cos(angleY);
            return [rotX, v[1], rotZ];
        });

        const renderOrder = faces.map((f, idx) => {
            let zSum = 0;
            for (let vIdx of f) zSum += projected[vIdx][2];
            return { face: f, z: zSum / f.length, origIdx: idx };
        }).sort((a, b) => a.z - b.z);

        renderOrder.forEach(item => {
            const f = item.face;
            const p0 = vertices[f[0]], p1 = vertices[f[1]], p2 = vertices[f[2]];
            const ax = p1[0] - p0[0], ay = p1[1] - p0[1], az = p1[2] - p0[2];
            const bx = p2[0] - p0[0], by = p2[1] - p0[1], bz = p2[2] - p0[2];

            let nx = ay * bz - az * by;
            let ny = az * bx - ax * bz;
            let nz = ax * by - ay * bx;
            const nLen = Math.sqrt(nx*nx + ny*ny + nz*nz);

            if (nLen > 0) {
                nx /= nLen; ny /= nLen; nz /= nLen;
                const rNx = nx * Math.cos(angleY) + nz * Math.sin(angleY);
                const rNz = -nx * Math.sin(angleY) + nz * Math.cos(angleY);
                const dot = rNx * lNorm[0] + ny * lNorm[1] + rNz * lNorm[2];
                const intensity = Math.max(0.24, dot);

                ctx.beginPath();
                ctx.moveTo(projected[f[0]][0], projected[f[0]][1]);
                for (let i = 1; i < f.length; i++) {
                    ctx.lineTo(projected[f[i]][0], projected[f[i]][1]);
                }
                ctx.closePath();

                // Динамическая палитра материалов в зависимости от выбора ГМа
                const tokenColorMaterial = window.CURRENT_SQUAD_TOKEN_COLOR || 'gold';
                let r = 0, g = 0, b = 0;
                let strokeColor = "rgba(255, 240, 180, 0.35)";

                if (tokenColorMaterial === 'ruby') {
                    r = Math.floor(180 + 75 * intensity);
                    g = Math.floor(30 + 25 * intensity);
                    b = Math.floor(30 + 25 * intensity);
                    strokeColor = "rgba(255, 190, 190, 0.4)";
                } else if (tokenColorMaterial === 'emerald') {
                    r = Math.floor(30 + 25 * intensity);
                    g = Math.floor(160 + 80 * intensity);
                    b = Math.floor(60 + 35 * intensity);
                    strokeColor = "rgba(190, 255, 190, 0.4)";
                } else if (tokenColorMaterial === 'obsidian') {
                    r = Math.floor(35 + 30 * intensity);
                    g = Math.floor(45 + 35 * intensity);
                    b = Math.floor(55 + 45 * intensity);
                    strokeColor = "rgba(200, 220, 255, 0.25)";
                } else if (tokenColorMaterial === 'bone') {
                    r = Math.floor(210 + 45 * intensity);
                    g = Math.floor(215 + 40 * intensity);
                    b = Math.floor(200 + 40 * intensity);
                    strokeColor = "rgba(150, 140, 120, 0.3)";
                } else {
                    // НАШЕ КЛАССИЧЕСКОЕ КОРОЛЕВСКОЕ ЗОЛОТО (Дефолт)
                    r = Math.floor(205 + 50 * intensity);
                    g = Math.floor(160 + 45 * intensity);
                    b = Math.floor(55 + 25 * intensity);
                    strokeColor = "rgba(255, 242, 195, 0.4)";
                }

                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                ctx.fill();

                ctx.strokeStyle = strokeColor;
                ctx.lineWidth = 0.8;
                ctx.stroke();

            }
        });
        ctx.restore();
    },

    /**
     * ЧАСТЬ 1 ИЗ 2: СБОРКА АРХИТЕКТУРЫ ЦИТАДЕЛИ (ПОЛНАЯ ВИДИМОСТЬ 360 ГРАДУСОВ)
     */
    draw3DCastleToken(ctx, cx, cy) {
        ctx.save();
        // Смещено по вертикали вниз, чтобы замок стоял идеально ровно над плашкой сложности
        ctx.translate(cx, cy + 18);

        const time = Date.now() / 1000;
        const bounceY = Math.sin(time * 2.2) * 1.5;
        const angleY = time * 0.5; // Скорость вращения цитадели
        ctx.translate(0, bounceY);

        const lightDir = { x: 0.5, y: -0.8, z: 0.4 };
        const lLength = Math.sqrt(lightDir.x*lightDir.x + lightDir.y*lightDir.y + lightDir.z*lightDir.z);
        const lNorm = { x: lightDir.x/lLength, y: lightDir.y/lLength, z: lightDir.z/lLength };

        const polygons = [];

        // Функция-хелпер для генерации стабильного 3D-куба (блока) без квадратных скобок
        const addBlock = (bx, by, bz, w, h, d, type, zWeight = 0) => {
            const halfW = w * 0.5; const halfH = h * 0.5; const halfD = d * 0.5;

            const meshData = {
                v0: { x: -halfW, y: -halfH, z: -halfD }, v1: { x: halfW,  y: -halfH, z: -halfD },
                v2: { x: halfW,  y: h/2,    z: -halfD }, v3: { x: -halfW, y: h/2,    z: -halfD },
                v4: { x: -halfW, y: -halfH, z: halfD },  v5: { x: halfW,  y: -halfH, z: halfD },
                v6: { x: halfW,  y: h/2,    z: halfD },  v7: { x: -halfW, y: h/2,    z: halfD }
            };

            const processFace = (i0, i1, i2, i3, nx, ny, nz) => {
                const getVert = (idx) => meshData["v" + idx];
                const rawFace = { v0: getVert(i0), v1: getVert(i1), v2: getVert(i2), v3: getVert(i3) };

                const transform = (v) => {
                    const lx = v.x + bx; const ly = v.y + by; const lz = v.z + bz;
                    const rx = lx * Math.cos(angleY) + lz * Math.sin(angleY);
                    const rz = -lx * Math.sin(angleY) + lz * Math.cos(angleY);
                    return { x: rx, y: ly, z: rz };
                };

                const p0 = transform(rawFace.v0); const p1 = transform(rawFace.v1);
                const p2 = transform(rawFace.v2); const p3 = transform(rawFace.v3);

                const rnx = nx * Math.cos(angleY) + nz * Math.sin(angleY);
                const rnz = -nx * Math.sin(angleY) + nz * Math.cos(angleY);

                // Коррекция глубины: выталкивает мелкие детали (зубцы) вперед, исключая мигание ребер
                const bias = type.endsWith('tooth') ? 1.5 : 0;
                const avgZ = ((p0.z + p1.z + p2.z + p3.z) / 4) - zWeight - bias;

                polygons.push({
                    p0: p0, p1: p1, p2: p2, p3: p3,
                    normal: { x: rnx, y: ny, z: rnz },
                    z: avgZ,
                    type: type
                });
            };

            processFace(0, 1, 2, 3, 0, 0, -1); // Передняя
            processFace(1, 5, 6, 2, 1, 0, 0);  // Правая
            processFace(4, 0, 3, 7, -1, 0, 0); // Левая
            processFace(5, 4, 7, 6, 0, 0, 1);  // Задняя
            processFace(3, 2, 6, 7, 0, -1, 0); // Верхняя
            processFace(4, 5, 1, 0, 0, 1, 0);  // Нижняя
        };

        const dist = 18; // Размер квадрата цитадели

        // А. Четыре угловые Башни-Ладьи
        const towerOffsets = { p0: -dist, p1: dist };
        const buildTower = (tx, tz) => {
            addBlock(tx, 14, tz, 10, 6, 10, 'tower_base', 0);
            addBlock(tx, 0,  tz, 8, 22, 8,  'tower_body', 0);
            addBlock(tx, -13, tz, 10, 4, 10, 'tower_crown', 0);
            addBlock(tx - 4.5, -16.5, tz - 4.5, 3, 3, 3, 'tower_tooth', 0.5);
            addBlock(tx + 4.5, -16.5, tz - 4.5, 3, 3, 3, 'tower_tooth', 0.5);
            addBlock(tx + 4.5, -16.5, tz + 4.5, 3, 3, 3, 'tower_tooth', 0.5);
            addBlock(tx - 4.5, -16.5, tz + 4.5, 3, 3, 3, 'tower_tooth', 0.5);
        };
        buildTower(towerOffsets.p0, towerOffsets.p0); buildTower(towerOffsets.p1, towerOffsets.p0);
        buildTower(towerOffsets.p1, towerOffsets.p1); buildTower(towerOffsets.p0, towerOffsets.p1);

        // Б. Крепостные Стены продлены вровень с подошвой башен (высота 18px, y = 7px)
        const wallLen = dist * 2 - 6;
        addBlock(0, 7, -dist, wallLen, 18, 3, 'wall', 0); addBlock(0, 7,  dist, wallLen, 18, 3, 'wall', 0);
        addBlock(-dist, 7, 0, 3, 18, wallLen, 'wall', 0); addBlock(dist,  7, 0, 3, 18, wallLen, 'wall', 0);

        for (let x = -8; x <= 8; x += 8) {
            addBlock(x, -3, -dist, 3, 2, 3, 'wall_tooth', 0.3); addBlock(x, -3,  dist, 3, 2, 3, 'wall_tooth', 0.3);
        }
        for (let z = -8; z <= 8; z += 8) {
            addBlock(-dist, -3, z, 3, 2, 3, 'wall_tooth', 0.3); addBlock(dist,  -3, z, 3, 2, 3, 'wall_tooth', 0.3);
        }

        // В. Центральный Донжон и его корона с массивными зубцами
        const cx5 = 0, cz5 = 0;
        addBlock(cx5, 14,   cz5, 15, 6,  15, 'donjon_base', 0);
        addBlock(cx5, -11,  cz5, 13, 44, 13, 'donjon_body', 0);
        addBlock(cx5, -35,  cz5, 15, 4,  15, 'donjon_crown', 0);

        addBlock(cx5 - 7.0, -39.0, cz5 - 7.0, 4, 4, 4, 'donjon_tooth', 0.8);
        addBlock(cx5 + 7.0, -39.0, cz5 - 7.0, 4, 4, 4, 'donjon_tooth', 0.8);
        addBlock(cx5 + 7.0, -39.0, cz5 + 7.0, 4, 4, 4, 'donjon_tooth', 0.8);
        addBlock(cx5 - 7.0, -39.0, cz5 + 7.0, 4, 4, 4, 'donjon_tooth', 0.8);
        // Г. Конусообразная 3D-крыша донжона (zWeight = 2.5 — выталкивает купол поверх короны)
        const roofBottomY = -37; const roofTopY = -49; const rw = 12; const halfRw = rw * 0.5;
        const roofVerts = {
            v0: { x: -halfRw, y: roofBottomY, z: -halfRw }, v1: { x: halfRw,  y: roofBottomY, z: -halfRw },
            v2: { x: halfRw,  y: roofBottomY, z: halfRw },  v3: { x: -halfRw, y: roofBottomY, z: halfRw },
            v4: { x: 0,       y: roofTopY,    z: 0 }
        };

        const processRoofFace = (i0, i1, i2, nx, ny, nz) => {
            const getVert = (idx) => roofVerts["v" + idx];
            const transform = (v) => {
                const rx = v.x * Math.cos(angleY) + v.z * Math.sin(angleY);
                const rz = -v.x * Math.sin(angleY) + v.z * Math.cos(angleY);
                return { x: rx, y: v.y, z: rz };
            };
            const p0 = transform(getVert(i0)); const p1 = transform(getVert(i1)); const p2 = transform(getVert(i2));

            const rnx = nx * Math.cos(angleY) + nz * Math.sin(angleY);
            const rnz = -nx * Math.sin(angleY) + nz * Math.cos(angleY);
            const avgZ = ((p0.z + p1.z + p2.z) / 3) - 2.5;

            polygons.push({ p0: p0, p1: p1, p2: p2, p3: p2, normal: {x: rnx, y: ny, z: rnz}, z: avgZ, type: 'donjon_roof', isTriangle: true });
        };
        processRoofFace(0, 1, 4, 0, -0.2, -1); processRoofFace(1, 2, 4, 1, -0.2, 0);
        processRoofFace(2, 3, 4, 0, -0.2, 1);  processRoofFace(3, 0, 4, -1, -0.2, 0);

        // Д. Флагшток и вейв-знамя (zWeight = 4.0 — гарантирует рендер на пике конуса)
        addBlock(0, (roofTopY + (roofTopY - 14)) * 0.5, 0, 1, 14, 1, 'donjon_flagpole', 3.5);
        const waveX = Math.sin(time * 6.5) * 4.5;

        const fPoleTopY = roofTopY - 14; const fPoleMidY = roofTopY - 7;
        const flagVerts = {
            v0: { x: 0, y: fPoleTopY, z: 0 }, v1: { x: 0, y: fPoleMidY, z: 0 }, v2: { x: 11, y: roofTopY - 10.5, z: waveX * 0.5 }
        };
        const transformFlag = (v) => {
            const rx = v.x * Math.cos(angleY) + v.z * Math.sin(angleY);
            const rz = -v.x * Math.sin(angleY) + v.z * Math.cos(angleY);
            return { x: rx, y: v.y, z: rz };
        };
        const pf0 = transformFlag(flagVerts.v0); const pf1 = transformFlag(flagVerts.v1); const pf2 = transformFlag(flagVerts.v2);
        polygons.push({ p0: pf0, p1: pf1, p2: pf2, p3: pf2, normal: {x: 0, y: 0, z: -1}, z: ((pf0.z + pf1.z + pf2.z) / 3) - 5.0, type: 'donjon_flag_banner', isTriangle: true });

        // Е. ГЛОБАЛЬНАЯ СКВОЗНАЯ СОРТИРОВКА ХУДОЖНИКА (По глубине z)
        polygons.sort((a, b) => a.z - b.z);

        polygons.forEach(poly => {
            const n = poly.normal;
            const dot = n.x*lNorm.x + n.y*lNorm.y + n.z*lNorm.z;

            // ИСПРАВЛЕНО НА СТОПРОЦЕНТНЫЙ ДВУСТОРОННИЙ РЕНДЕР:
            // Отсечение полностью отключено, рисуем абсолютно все полигоны замка!
            const shouldRender = true;

            if (shouldRender) {
                // Использование Math.abs спасает развернутые тылом грани от падения интенсивности в черноту
                const intensity = Math.max(0.26, Math.abs(dot));

                ctx.beginPath();
                ctx.moveTo(poly.p0.x, poly.p0.y); ctx.lineTo(poly.p1.x, poly.p1.y); ctx.lineTo(poly.p2.x, poly.p2.y);
                if (!poly.isTriangle && poly.p3) { ctx.lineTo(poly.p3.x, poly.p3.y); }
                ctx.closePath();

                const tokenColorMaterial = window.CURRENT_SQUAD_TOKEN_COLOR || 'gold';
                let r = 0, g = 0, b = 0; let strokeColor = "rgba(255, 242, 195, 0.22)";
                let matMod = 1.0;
                if (poly.type === 'wall' || poly.type === 'wall_tooth') matMod = 0.84;
                else if (poly.type.startsWith('donjon')) matMod = poly.type === 'donjon_roof' ? 0.94 : 1.10;

                const isFlag = poly.type === 'donjon_flag_banner';
                if (tokenColorMaterial === 'ruby') {
                    r = isFlag ? 235 : Math.floor((185 + 70 * intensity) * matMod); g = isFlag ? 40 : Math.floor(35 * matMod); b = isFlag ? 40 : Math.floor(35 * matMod);
                    strokeColor = isFlag ? "rgba(255,255,255,0.4)" : "rgba(255, 190, 190, 0.2)";
                } else if (tokenColorMaterial === 'emerald') {
                    r = isFlag ? 40 : Math.floor(35 * matMod); g = isFlag ? 220 : Math.floor((165 + 75 * intensity) * matMod); b = isFlag ? 65 : Math.floor(65 * matMod);
                    strokeColor = isFlag ? "rgba(255,255,255,0.4)" : "rgba(190, 255, 190, 0.2)";
                } else if (tokenColorMaterial === 'obsidian') {
                    r = isFlag ? 25 : Math.floor((35 + 30 * intensity) * matMod); g = isFlag ? 30 : Math.floor((45 + 35 * intensity) * matMod); b = Math.floor((55 + 45 * intensity) * matMod);
                    strokeColor = isFlag ? "rgba(255,255,255,0.2)" : "rgba(200, 220, 255, 0.15)";
                } else if (tokenColorMaterial === 'bone') {
                    r = isFlag ? 240 : Math.floor((215 + 40 * intensity) * matMod); g = isFlag ? 235 : Math.floor((215 + 40 * intensity) * matMod); b = Math.floor((200 + 40 * intensity) * matMod);
                    strokeColor = isFlag ? "rgba(100,100,100,0.3)" : "rgba(150, 140, 120, 0.15)";
                } else {
                    r = isFlag ? 192 : Math.floor((210 + 45 * intensity) * matMod); g = isFlag ? 41 : Math.floor((165 + 40 * intensity) * matMod); b = Math.floor((60 + 20 * intensity) * matMod);
                    strokeColor = isFlag ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 242, 195, 0.25)";
                }

                ctx.fillStyle = `rgb(${Math.min(255, r)}, ${Math.min(255, g)}, ${Math.min(255, b)})`; ctx.fill();
                ctx.strokeStyle = strokeColor; ctx.lineWidth = 0.5; ctx.stroke();

                // Ж. ИСПРАВЛЕННЫЙ ТРАФАРЕТ ОКНО-БОЙНИЦ: Теперь окна рисуются только тогда, когда вектор грани донжона направлен к экрану (dot > 0)!
                // Это полностью исключает рентген-эффект и просвечивание с обратной стороны башни!
                if (poly.type === 'donjon_body' && dot > 0) {
                    ctx.save();
                    const midTopX = (poly.p0.x + poly.p1.x) * 0.5; const midTopY = (poly.p0.y + poly.p1.y) * 0.5;
                    const midBotX = (poly.p3.x + poly.p2.x) * 0.5; const midBotY = (poly.p3.y + poly.p2.y) * 0.5;

                    const drawWindow = (pctY) => {
                        const wx = midTopX + (midBotX - midTopX) * pctY;
                        const wy = midTopY + (midBotY - midTopY) * pctY;
                        const winW = Math.max(0.6, Math.abs(poly.p1.x - poly.p0.x) * 0.16);

                        ctx.fillStyle = "rgb(15, 20, 28)";
                        ctx.fillRect(wx - winW * 0.5, wy - 3, winW, 6);
                        ctx.strokeStyle = "rgba(0, 0, 0, 0.4)"; ctx.lineWidth = 0.5;
                        ctx.strokeRect(wx - winW * 0.5, wy - 3, winW, 6);
                    };

                    drawWindow(0.25);
                    drawWindow(0.65);
                    ctx.restore();
                }
            }
        });
        ctx.restore();
    },


};

window.AnimationManager = AnimationManager;
export default AnimationManager;
