// ============================================================================
// МОДУЛЬ: МЕНЕДЖЕР АНИМАЦИЙ И ЭФФЕКТОВ (ANIMATION MANAGER) — ЧАСТЬ 1 ИЗ 3
// ============================================================================

import { MAP_CONFIG } from '../config/app_config.js';
import HexCanvasRender from '../core/hex_canvas_render.js';
import ViewportManager from '../services/viewport_manager.js';

const AnimationManager = {
    _sharedAudioCtx: null,

    /**
     * Создает радиальный взрыв искр в указанных координатах
     */
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

    /**
     * Генерирует вспышку шести золотых лучей с возможностью изменения масштаба
     */
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
            beam.style.setProperty('--radius', `0px`);
            beamsContainer.appendChild(beam);
        }

        document.body.appendChild(beamsContainer);
        setTimeout(() => { beamsContainer.remove(); }, 1200);
    },

    /**
     * Инициализирует и будит глобальный аудиоконтекст для обхода автоплея
     */
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

    /**
     * Синтезирует реалистичный процедурный перестук костей на лету
     */
    _playDiceSoundEffects() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AnimationManager._sharedAudioCtx && AudioContext) {
                AnimationManager._sharedAudioCtx = new AudioContext();
            }
            const audioCtx = AnimationManager._sharedAudioCtx;
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
                const intensity = Math.max(0.15, (22 - i) / 22);
                playClick(scheduleTime, intensity);
                delay += 0.015;
                scheduleTime += delay;
            }
        } catch (e) { console.warn("Не удалось воспроизвести процедурный звук:", e); }
    },
// ============================================================================
// МОДУЛЬ: МЕНЕДЖЕР АНИМАЦИЙ И ЭФФЕКТОВ (ANIMATION MANAGER) — ЧАСТЬ 2 ИЗ 3
// ============================================================================

    /**
     * Запускает баллистический полет флага отряда с динамическим определением стороны вылета
     */
    playFlagFlight(oldHexId, currentHexId, onImpactCallback) {
        if (oldHexId === currentHexId) {
            if (typeof onImpactCallback === 'function') onImpactCallback();
            return;
        }

        const targetCoords = HexCanvasRender.hexCoords[currentHexId];
        if (!targetCoords) return;

        let startCoords = HexCanvasRender.hexCoords[oldHexId];

        if (!startCoords || oldHexId === 'hex_0_0') {
            const mapWidth = 3840;

            if (targetCoords.cx > mapWidth / 2) {
                startCoords = { cx: 100, cy: targetCoords.cy };
            } else {
                startCoords = { cx: mapWidth - 100, cy: targetCoords.cy };
            }
        }

        const zoom = ViewportManager.currentZoom || 1.0;
        const panX = ViewportManager.x || 0;
        const panY = ViewportManager.y || 0;

        const viewportElement = document.getElementById('viewport');
        const viewRect = viewportElement ? viewportElement.getBoundingClientRect() : { left: 0, top: 0 };
        const viewWidth = viewportElement ? viewportElement.clientWidth : 0;

        const calculateScreenCoords = (coords) => {
            const virtualXFromRight = 3840 - coords.cx;
            const screenX = viewRect.left + panX + viewWidth - (virtualXFromRight * zoom);
            const screenY = viewRect.top + panY + (coords.cy * zoom);
            return { x: screenX, y: screenY };
        };

        const startScreen = calculateScreenCoords(startCoords);
        const targetScreen = calculateScreenCoords(targetCoords);

        if (isNaN(startScreen.x) || isNaN(startScreen.y) || isNaN(targetScreen.x) || isNaN(targetScreen.y)) {
            console.error("Ошибка калькуляции анимации флага.");
            if (typeof onImpactCallback === 'function') onImpactCallback();
            return;
        }

        const flyingFlag = document.createElement('div');
        flyingFlag.className = 'global-flying-flag';
        flyingFlag.innerHTML = `
            <div class="squad-pole" style="height: 50px; width: 6px; background: #333; margin-left: 6px; border-radius: 2px; border: 1px solid #000;">
                <div class="squad-flag" style="width: 30px; height: 20px; background: #c0392b; clip-path: polygon(0 0, 100% 50%, 0 100%); border: 2px solid #ffffff; box-shadow: 2px 2px 4px rgba(0,0,0,0.4);"></div>
            </div>
        `;

        const sX = startScreen.x - 9;
        const sY = startScreen.y - 50;
        const tX = targetScreen.x - 9;
        const tY = targetScreen.y - 50;

        flyingFlag.style.setProperty('--start-x', `${sX}px`);
        flyingFlag.style.setProperty('--start-y', `${sY}px`);
        flyingFlag.style.setProperty('--target-x', `${tX}px`);
        flyingFlag.style.setProperty('--target-y', `${tY}px`);

        document.body.appendChild(flyingFlag);

        setTimeout(() => {
            flyingFlag.style.animation = 'none';
            flyingFlag.style.transition = 'transform 0.05s ease-out';
            flyingFlag.style.transform = `translate3d(${tX}px, ${tY}px, 0) scale(1) rotate(-5deg)`;

            this.spawnBeamsBurst(targetScreen.x, targetScreen.y, 0.1);

            if (typeof onImpactCallback === 'function') {
                onImpactCallback();
            }
        }, 1300);

        setTimeout(() => { flyingFlag.remove(); }, 1300);

        setTimeout(() => { this.spawnBeamsBurst(targetScreen.x - 45, targetScreen.y + 40, 0.1); }, 1430);
        setTimeout(() => { this.spawnBeamsBurst(targetScreen.x + 45, targetScreen.y - 40, 0.1); }, 1610);
    },

    /**
     * Быстрый каскад из вспышек лучей света с удержанием фокуса на квесте
     */
    focusOnHex(hexId) {
        const coords = HexCanvasRender.hexCoords[hexId];
        if (!coords) return;

        const zoom = ViewportManager.currentZoom || 1.0;
        const viewportElement = document.getElementById('viewport');

        if (viewportElement) {
            ViewportManager.lockFocusUntil = Date.now() + 1800;

            const viewWidth = viewportElement.clientWidth;
            const viewHeight = viewportElement.clientHeight;

            const virtualXFromRight = 3840 - coords.cx;
            const virtualYFromTop = coords.cy;

            let targetPanX = (virtualXFromRight * zoom) - viewWidth / 2;
            let targetPanY = (viewHeight / 2) - (virtualYFromTop * zoom);

            const { minX, maxX, minY, maxY } = MAP_CONFIG.viewport.limits;

            ViewportManager.x = Math.max(minX, Math.min(maxX, targetPanX));
            ViewportManager.y = Math.max(minY, Math.min(maxY, targetPanY));
            ViewportManager.updateMapTransform();
        }

        setTimeout(() => {
            const currentPanX = ViewportManager.x || 0;
            const currentPanY = ViewportManager.y || 0;
            const viewRect = viewportElement ? viewportElement.getBoundingClientRect() : { left: 0, top: 0 };
            const viewWidth = viewportElement ? viewportElement.clientWidth : 0;

            HexCanvasRender.triggerFocus(hexId);

            const virtualXFromRight = 3840 - coords.cx;
            const cx = viewRect.left + currentPanX + viewWidth - (virtualXFromRight * zoom);
            const cy = viewRect.top + currentPanY + (coords.cy * zoom);

            this.spawnBeamsBurst(cx, cy);
            setTimeout(() => { this.spawnBeamsBurst(cx, cy); }, 100);

        }, 100);

        setTimeout(() => {
            ViewportManager.updateMapTransform();
        }, 1800);
    },

    /**
     * Переключение видимости мини-тултипов квестов на Canvas-карте
     */
    toggleQuestTooltips(btnElement) {
        if (!HexCanvasRender) return;

        HexCanvasRender.showQuestTooltips = !HexCanvasRender.showQuestTooltips;

        if (btnElement) {
            btnElement.title = HexCanvasRender.showQuestTooltips ? "Скрыть маркеры заданий" : "Показать маркеры заданий";
            btnElement.classList.toggle('ui-active', !HexCanvasRender.showQuestTooltips);
        }

        if (HexCanvasRender && typeof HexCanvasRender.requestFrame === 'function') {
            HexCanvasRender.requestFrame();
        }
    },

// ============================================================================
// МОДУЛЬ: МЕНЕДЖЕР АНИМАЦИЙ И ЭФФЕКТОВ (ANIMATION MANAGER) — ЧАСТЬ 3 ИЗ 3
// ============================================================================

    /**
     * Запускает полноценный цикл 3D Canvas рендеринга d20 с динамическим выравниванием грани
     */
    playCampDiceAnimation(targetDc, onCompleteCallback) {
        const overlay = document.getElementById('campDiceOverlay');
        const canvas = document.getElementById('d20Canvas');
        if (!overlay || !canvas) {
            if (typeof onCompleteCallback === 'function') onCompleteCallback();
            return;
        }

        overlay.classList.add('open');
        AnimationManager._playDiceSoundEffects();

        const ctx = canvas.getContext('2d');
        const t = (1.0 + Math.sqrt(5.0)) / 2.0;

        const vertices = [
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

        const dcToFaceIndex = {
            "⚜": 0, "1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6, "8": 7, "9": 8, "10": 9,
            "11": 10, "12": 11, "13": 12, "14": 13, "15": 14, "16": 15, "17": 16, "18": 17, "19": 18, "20": 19
        };

        let winningIndex = 0;
        if (targetDc !== undefined && targetDc !== null) {
            const dcKey = String(targetDc).trim();
            if (dcToFaceIndex[dcKey] !== undefined) {
                winningIndex = dcToFaceIndex[dcKey];
            } else {
                const numericDc = parseInt(targetDc, 10);
                if (!isNaN(numericDc)) {
                    if (numericDc > 20) winningIndex = 0;
                    else if (numericDc < 1) winningIndex = 10;
                    else {
                        const foundIdx = faces.findIndex(f => f[3] === dcKey);
                        if (foundIdx !== -1) winningIndex = foundIdx;
                    }
                }
            }
        }

        // ====================================================================
        // МАТЕМАТИЧЕСКИЙ РАСЧЕТ ИДЕАЛЬНЫХ УГЛОВ ДЛЯ ВЫБРАННОЙ ГРАНИ
        // ====================================================================
        const winningFace = faces[winningIndex];
        const v0 = vertices[winningFace[0]], v1 = vertices[winningFace[1]], v2 = vertices[winningFace[2]];

        // Вычисляем центр масс (нормаль) целевой грани в исходном состоянии
        let nx = (v0[0] + v1[0] + v2[0]) / 3;
        let ny = (v0[1] + v1[1] + v2[1]) / 3;
        let nz = (v0[2] + v1[2] + v2[2]) / 3;
        const nLen = Math.sqrt(nx*nx + ny*ny + nz*nz);
        nx /= nLen; ny /= nLen; nz /= nLen;

        // Рассчитываем точные углы поворота вокруг осей Y и X, чтобы нормаль совпала с осью Z [0, 0, 1]
        const targetY = -Math.atan2(nx, nz);
        const cosY = Math.cos(targetY), sinY = Math.sin(targetY);
        const nzRotated = -nx * sinY + nz * cosY;
        const targetX = Math.atan2(ny, nzRotated);
        const targetZ = 0; // Нам не нужно крутить плоскость по Z, грань уже лежит лицом к игроку

        let angleX = Math.random() * 5, angleY = Math.random() * 5, angleZ = Math.random() * 5;
        let scale = 0.1;
        const startTime = performance.now();
        let animationFrameId;
        let snapX = null, snapY = null, snapZ = null;

        const draw3D = () => {
            const now = performance.now();
            const elapsed = now - startTime;

            if (elapsed >= 5000) {
                cancelAnimationFrame(animationFrameId);
                overlay.classList.remove('open');
                if (typeof onCompleteCallback === 'function') onCompleteCallback();
                return;
            }

            let curX, curY, curZ;
            if (elapsed < 2500) {
                angleX += 0.06; angleY += 0.09; angleZ += 0.03;
                curX = angleX; curY = angleY; curZ = angleZ;
            } else if (elapsed < 3000) {
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
            } else {
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
                    const cx = (p0[0] + p1[0] + p2[0]) / 3;
                    const cy = (p0[1] + p1[1] + p2[1]) / 3;
                    ctx.fillText(f[3], cx, cy);
                    ctx.restore();
                }
            });
            animationFrameId = requestAnimationFrame(draw3D);
        };
        draw3D();
    }
};

window.AnimationManager = AnimationManager;
export default AnimationManager;
