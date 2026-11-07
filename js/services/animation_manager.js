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
                delay += 0.015;
                scheduleTime += delay;
            }
        } catch (e) {}
    },

    playFlagFlight(oldHexId, currentHexId, onImpactCallback) {
        if (oldHexId === currentHexId) {
            if (typeof onImpactCallback === 'function') onImpactCallback();
            return;
        }
        const targetCoords = HexCanvasRender.hexCoords[currentHexId];
        if (!targetCoords) return;

        let startCoords = HexCanvasRender.hexCoords[oldHexId];
        if (!startCoords || oldHexId === 'hex_0_0') {
            startCoords = { cx: targetCoords.cx > 1920 ? 100 : 3740, cy: targetCoords.cy };
        }

        const zoom = ViewportManager.currentZoom || 1.0;
        const panX = ViewportManager.x || 0;
        const panY = ViewportManager.y || 0;
        const viewportElement = document.getElementById('viewport');
        const viewRect = viewportElement ? viewportElement.getBoundingClientRect() : { left: 0, top: 0 };
        const viewWidth = viewportElement ? viewportElement.clientWidth : 0;

        const calcScreen = (coords) => ({
            x: viewRect.left + panX + viewWidth - ((3840 - coords.cx) * zoom),
            y: viewRect.top + panY + (coords.cy * zoom)
        });

        const startScreen = calcScreen(startCoords);
        const targetScreen = calcScreen(targetCoords);

        const flyingFlag = document.createElement('div');
        flyingFlag.className = 'global-flying-flag';
        flyingFlag.innerHTML = `<div class="squad-pole"><div class="squad-flag"></div></div>`;

        flyingFlag.style.setProperty('--start-x', `${startScreen.x - 9}px`);
        flyingFlag.style.setProperty('--start-y', `${startScreen.y - 50}px`);
        flyingFlag.style.setProperty('--target-x', `${targetScreen.x - 9}px`);
        flyingFlag.style.setProperty('--target-y', `${targetScreen.y - 50}px`);

        document.body.appendChild(flyingFlag);

        setTimeout(() => {
            this.spawnBeamsBurst(targetScreen.x, targetScreen.y, 0.1);
            if (typeof onImpactCallback === 'function') onImpactCallback();
        }, 1300);

        setTimeout(() => { flyingFlag.remove(); }, 1300);
        setTimeout(() => { this.spawnBeamsBurst(targetScreen.x - 45, targetScreen.y + 40, 0.1); }, 1430);
        setTimeout(() => { this.spawnBeamsBurst(targetScreen.x + 45, targetScreen.y - 40, 0.1); }, 1610);
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


        // 2. ДИНАМИЧЕСКИ ПЕРЕЗАПИСЫВАЕМ СИМВОЛ НА ЭТОЙ ФРОНТАЛЬНОЙ ГРАНИ
        // Находим, какой символ хочет отобразить ГМ (targetDc)
        const dcMap = { "⚜":0, "1":0, "2":1, "3":2, "4":3, "5":4, "6":5, "7":6, "8":7, "9":8, "10":9, "11":10, "12":11, "13":12, "14":13, "15":14, "16":15, "17":16, "18":17, "19":18, "20":19 };
        let realWinIdx = 11; // Если что-то пойдет не так, покажем 12
        if (targetDc !== undefined && targetDc !== null) {
            const k = String(targetDc).trim();
            if (dcMap[k] !== undefined) realWinIdx = dcMap[k];
        }

        // Подменяем текст на главной фронтальной грани (индекс 11) на тот, который выпал!
        const finalSymbolToDisplay = faces[realWinIdx][3];
        faces[11][3] = finalSymbolToDisplay;

        // Запоминаем индекс нашей "магической" грани, чтобы отрисовать на ней спецэффекты текста
        let winIdx = 11;
        const fWin = faces[winIdx];

        // Точное вычисление вектора нормали К ЛЮБОЙ выбранной грани треугольника
        const fWinBase = faces[11];
        let nx = (vertices[fWinBase[0]][0] + vertices[fWinBase[1]][0] + vertices[fWinBase[2]][0]) / 3;
        let ny = (vertices[fWinBase[0]][1] + vertices[fWinBase[1]][1] + vertices[fWinBase[2]][1]) / 3;
        let nz = (vertices[fWinBase[0]][2] + vertices[fWinBase[1]][2] + vertices[fWinBase[2]][2]) / 3;
        const nl = Math.sqrt(nx*nx + ny*ny + nz*nz); nx /= nl; ny /= nl; nz /= nl;


        // Поворот вокруг Y, затем вокруг X, чтобы нормаль смотрела строго в экран (0, 0, 1)
        const rotY = -Math.atan2(nx, nz);
        const nzR = -nx * Math.sin(rotY) + nz * Math.cos(rotY);
        const rotX = Math.atan2(ny, nzR);

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

            // Четкое проецирование вершин без сплющивания (масштаб накладывается строго в конце)
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

                    if (elapsed >= 1400 && f[0] === fWin[0] && f[1] === fWin[1] && f[2] === fWin[2]) {
                        ctx.save(); if (!flashed) { this.spawnBeamsBurst(canvas.getBoundingClientRect().left + 200, canvas.getBoundingClientRect().top + 200, 1.4); flashed = true; }
                        const txt = String(f[3]).trim(), opacity = Math.min(1, (elapsed - 1400) / 150);
                        let size = Math.floor(54 * sc), sCol = `rgba(255,162,0,${opacity})`, tCol = `rgba(255,255,255,${opacity})`;

                        if (txt === "20") { size = Math.floor(68 * sc); sCol = `rgba(46,204,113,${opacity})`; tCol = `rgba(235,255,240,${opacity})`; }
                        else if (txt === "1" || txt === "⚜") { size = Math.floor(68 * sc); sCol = `rgba(231,76,60,${opacity})`; tCol = `rgba(255,210,210,${opacity})`; }

                        ctx.fillStyle = tCol; ctx.font = `900 ${size}px 'Times New Roman', serif`; ctx.shadowColor = sCol; ctx.shadowBlur = 18; ctx.textAlign = "center"; ctx.textBaseline = "middle";
                        ctx.fillText(f[3], (p0[0] + p1[0] + p2[0]) / 3, (p0[1] + p1[1] + p2[1]) / 3); ctx.restore();
                    }
                }
            });
            frameId = requestAnimationFrame(draw3D);
        };
        draw3D();
    }
};

window.AnimationManager = AnimationManager;
export default AnimationManager;
