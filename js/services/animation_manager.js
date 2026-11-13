import { MAP_CONFIG } from '../config/app_config.js';
import HexCanvasRender from '../core/hex_canvas_render.js';
import ViewportManager from '../services/viewport_manager.js';
import ThreeDTokenEngine from './3d_token_engine.js';

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

        // ПРИНУДИТЕЛЬНЫЙ ФИКС: ставим фиксированное позиционирование для отображения поверх куба
        beamsContainer.style.cssText = `
            position: fixed !important;
            z-index: 99999999 !important;
            left: ${cx}px;
            top: ${cy}px;
            pointer-events: none;
            transform: translate(-50%, -50%) scale(${scale});
        `;

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

        const targetCoords = HexCanvasRender.hexCoords ? HexCanvasRender.hexCoords[currentHexId] : null;
        if (!targetCoords) {
            if (typeof onImpactCallback === 'function') onImpactCallback();
            return;
        }

        let startCoords = HexCanvasRender.hexCoords ? HexCanvasRender.hexCoords[oldHexId] : null;
        if (!startCoords || oldHexId === 'hex_0_0' || window.FLIGHT_FROM_CAPITAL_MODE) {
            startCoords = (HexCanvasRender.hexCoords && HexCanvasRender.hexCoords['hex_0_0']) || { cx: 0, cy: 0 };
        }

        const canvasElement = document.getElementById('mapCanvas');
        if (!canvasElement) {
            if (typeof onImpactCallback === 'function') onImpactCallback();
            return;
        }

        const canvasRect = canvasElement.getBoundingClientRect();
        const realScaleX = canvasRect.width / 3840;
        const realScaleY = canvasRect.height / 1280;

        const calcScreen = (coords) => ({
            x: canvasRect.left + (coords.cx * realScaleX),
            y: canvasRect.top + (coords.cy * realScaleY)
        });

        const startScreen = calcScreen(startCoords);
        const targetScreen = calcScreen(targetCoords);

        let tokenSkin = 'flag';
        if (window.CURRENT_SQUAD_TOKEN_SKIN) {
            tokenSkin = window.CURRENT_SQUAD_TOKEN_SKIN;
        } else if (window.SettingsManager && window.SettingsManager.state && window.SettingsManager.state.squadTokenSkin) {
            tokenSkin = window.SettingsManager.state.squadTokenSkin;
        }
        tokenSkin = String(tokenSkin).trim().toLowerCase();

        let flightContainer;
        const size = 120;

        if (tokenSkin === 'queen' || tokenSkin === 'rook' || tokenSkin === 'castle' || tokenSkin === 'dice') {
            flightContainer = document.createElement('canvas');
            flightContainer.width = size;
            flightContainer.height = size;
            flightContainer.style.cssText = `position:fixed; z-index:2000000!important; pointer-events:none; background:transparent!important; border:none!important; box-shadow:none!important; will-change:transform; left:0; top:0;`;

            const fCtx = flightContainer.getContext('2d');
            const renderLoop = () => {
                if (!document.body.contains(flightContainer)) return;
                fCtx.clearRect(0, 0, size, size);

                if (tokenSkin === 'queen') ThreeDTokenEngine.draw3DQueenToken(fCtx, size / 2, size / 2 + 15);
                else if (tokenSkin === 'rook') ThreeDTokenEngine.draw3DRookToken(fCtx, size / 2, size / 2 + 15);
                else if (tokenSkin === 'castle') ThreeDTokenEngine.draw3DCastleToken(fCtx, size / 2, size / 2 + 15);
                else if (tokenSkin === 'dice') ThreeDTokenEngine.draw3DDiceToken(fCtx, size / 2, size / 2 + 10);

                requestAnimationFrame(renderLoop);
            };
            requestAnimationFrame(renderLoop);
        } else {
            flightContainer = document.createElement('div');
            flightContainer.className = 'global-flying-flag';
            flightContainer.style.cssText = `position:fixed; z-index:2000000!important; pointer-events:none; left:0; top:0;`;
            flightContainer.innerHTML = `<div class="squad-pole"><div class="squad-flag"></div></div>`;
        }

        const offsetX = (tokenSkin === 'queen' || tokenSkin === 'rook') ? size / 2 : 9;
        const offsetY = (tokenSkin === 'queen' || tokenSkin === 'rook') ? size / 2 + 15 : 50;

        flightContainer.style.setProperty('--start-x', `${startScreen.x - offsetX}px`);
        flightContainer.style.setProperty('--start-y', `${startScreen.y - offsetY}px`);
        flightContainer.style.setProperty('--target-x', `${targetScreen.x - offsetX}px`);
        flightContainer.style.setProperty('--target-y', `${targetScreen.y - offsetY}px`);

        flightContainer.style.animation = 'windowsSmoothFly3D 1.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
        document.body.appendChild(flightContainer);

        setTimeout(() => {

            const mode = window.CURRENT_SQUAD_ANIMATION_MODE
                || window.SettingsManager?.state?.squadAnimMode
                || 'classic';

            const viewportView = document.getElementById('viewport');

            if (mode === 'wave') {
                this.spawnBeamsBurst(targetScreen.x, targetScreen.y, 0.1);
                const container = document.createElement('div');
                container.style.cssText = `position:absolute; left:${targetScreen.x}px; top:${targetScreen.y}px; pointer-events:none; z-index:9999;`;
                document.body.appendChild(container);
                const runesPool = ["ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ", "ᚺ", "ᚾ", "ᛁ", "ᛃ", "ᛇ", "ᛈ", "ᛉ", "ᛊ", "ᛏ", "ᛒ", "ᛗ", "ᛚ", "ᛜ", "ᛟ", "ᛞ"];
                const numRunes = 12;
                for (let i = 0; i < numRunes; i++) {
                    const runeEl = document.createElement('div');
                    runeEl.className = 'squad-rune-particle';
                    runeEl.textContent = runesPool[Math.floor(Math.random() * runesPool.length)];
                    const angleRad = (Math.PI * 2 / numRunes) * i; const angleDeg = (360 / numRunes) * i;
                    runeEl.style.setProperty('--start-x', `${Math.cos(angleRad) * 15}px`); runeEl.style.setProperty('--start-y', `${Math.sin(angleRad) * 15}px`);
                    runeEl.style.setProperty('--target-x', `${Math.cos(angleRad) * 130}px`); runeEl.style.setProperty('--target-y', `${Math.sin(angleRad) * 130}px`);
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
            } else if (mode === 'quest') {
                const hexElement = document.getElementById(currentHexId);
                if (hexElement) {
                    hexElement.classList.add('hex-focused-flash');
                    setTimeout(() => { hexElement.classList.remove('hex-focused-flash'); }, 2500);
                }
                this.spawnBeamsBurst(targetScreen.x, targetScreen.y, 1.3);
                if (HexCanvasRender && typeof HexCanvasRender.triggerFocus === 'function') {
                    HexCanvasRender.triggerFocus(currentHexId);
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

        // Гарантируем перенос в корень body, чтобы избежать багов с масштабом карты
        if (overlay.parentNode !== document.body) {
            document.body.appendChild(overlay);
        }

        overlay.classList.add('open');
        this._playDiceSoundEffects();

        const ctx = canvas.getContext('2d');
        const t = (1.0 + Math.sqrt(5.0)) / 2.0;

        const vertices = [
            [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t],
            [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
        ].map(v => {
            const l = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
            return [v[0]/l * 120, v[1]/l * 120, v[2]/l * 120];
        });

        const faces = [
            [0, 11, 5, "⚜"], [0, 5, 1, "2"], [0, 1, 7, "3"], [0, 7, 10, "4"], [0, 10, 11, "5"],
            [1, 5, 9, "6"], [5, 11, 4, "7"], [11, 10, 2, "8"], [10, 7, 6, "9"], [7, 1, 8, "10"],
            [3, 9, 4, "11"], [3, 4, 2, "12"], [3, 2, 6, "13"], [3, 6, 8, "14"], [3, 8, 9, "15"],
            [4, 9, 5, "16"], [2, 4, 11, "17"], [6, 2, 10, "18"], [8, 6, 7, "19"], [9, 8, 1, "20"]
        ];

        const dcMap = { "⚜":0, "1":0, "2":1, "3":2, "4":3, "5":4, "6":5, "7":6, "8":7, "9":8, "10":9, "11":10, "12":11, "13":12, "14":13, "15":14, "16":15, "17":16, "18":17, "19":18, "20":19 };
        let realWinIdx = 11;
        if (targetDc !== undefined && targetDc !== null) {
            const k = String(targetDc).trim();
            if (dcMap[k] !== undefined) realWinIdx = dcMap[k];
        }

        const fWinBase = faces[realWinIdx];
        let nx = (vertices[fWinBase[0]][0] + vertices[fWinBase[1]][0] + vertices[fWinBase[2]][0]) / 3;
        let ny = (vertices[fWinBase[0]][1] + vertices[fWinBase[1]][1] + vertices[fWinBase[2]][1]) / 3;
        let nz = (vertices[fWinBase[0]][2] + vertices[fWinBase[1]][2] + vertices[fWinBase[2]][2]) / 3;
        const nl = Math.sqrt(nx*nx + ny*ny + nz*nz); nx /= nl; ny /= nl; nz /= nl;

        const rotY = -Math.atan2(nx, nz);
        const nzR = -nx * Math.sin(rotY) + nz * Math.cos(rotY);
        const rotX = Math.atan2(ny, nzR);

        const dynamicTextValue = faces[realWinIdx][3];
        let aX = Math.random() * 5, aY = Math.random() * 5, aZ = Math.random() * 5;
        let sc = 0.1, sTime = performance.now(), frameId, snapX = null, snapY = null, snapZ = null, flashed = false;

        const draw3D = () => {
            const elapsed = performance.now() - sTime;
            if (elapsed >= 3000) {
                cancelAnimationFrame(frameId);
                overlay.classList.remove('open');
                if (onCompleteCallback) onCompleteCallback();
                return;
            }

            let cX = aX += 0.12, cY = aY += 0.18, cZ = aZ += 0.06;
            if (elapsed >= 1000 && elapsed < 1400) {
                if (snapX === null) {
                    snapX = (aX - 0.12) % (Math.PI * 2);
                    snapY = (aY - 0.18) % (Math.PI * 2);
                    snapZ = (aZ - 0.06) % (Math.PI * 2);
                }
                const p = (elapsed - 1000) / 400, ease = p * p * (3 - 2 * p);
                cX = snapX + (rotX - snapX) * ease;
                cY = snapY + (rotY - snapY) * ease;
                cZ = snapZ + (0 - snapZ) * ease;
            } else if (elapsed >= 1400) {
                cX = rotX; cY = rotY; cZ = 0;
            }

            sc = elapsed < 200 ? 0.1 + 0.9 * (elapsed / 200) : (elapsed > 2700 ? 1.0 - 0.9 * ((elapsed - 2700) / 300) : 1.0);
            ctx.clearRect(0, 0, 400, 400);

            const rotated = vertices.map(v => {
                let x = v[0], y = v[1], z = v[2];
                let y1 = y * Math.cos(cX) - z * Math.sin(cX), z1 = y * Math.sin(cX) + z * Math.cos(cX);
                let x2 = x * Math.cos(cY) + z1 * Math.sin(cY), z2 = -x * Math.sin(cY) + z1 * Math.cos(cY);
                let x3 = x2 * Math.cos(cZ) - y1 * Math.sin(cZ), y3 = x2 * Math.sin(cZ) + y1 * Math.cos(cZ);
                return [x3 * sc + 200, y3 * sc + 200, z2];
            });

            const renderOrder = faces.map(f => ({
                face: f,
                z: (rotated[f[0]][2] + rotated[f[1]][2] + rotated[f[2]][2]) / 3
            })).sort((a, b) => a.z - b.z);

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

                    if (elapsed >= 1400 && f[0] === faces[realWinIdx][0] && f[1] === faces[realWinIdx][1] && f[2] === faces[realWinIdx][2]) {
                        ctx.save();
                        if (!flashed) {
                            const screenCenterX = window.innerWidth / 2;
                            const screenCenterY = window.innerHeight / 2;
                            this.spawnBeamsBurst(screenCenterX, screenCenterY, 1.4);
                            flashed = true;
                        }
                        const opacity = Math.min(1, (elapsed - 1400) / 150);
                        let sz = Math.floor(54 * sc), sCol = `rgba(255,162,0,${opacity})`, tCol = `rgba(255,255,255,${opacity})`;
                        if (dynamicTextValue === "20") { sz = Math.floor(68 * sc); sCol = `rgba(46,204,113,${opacity})`; tCol = `rgba(235,255,240,${opacity})`; }
                        else if (dynamicTextValue === "1" || dynamicTextValue === "⚜") { sz = Math.floor(68 * sc); sCol = `rgba(231,76,60,${opacity})`; tCol = `rgba(255,210,210,${opacity})`; }
                        ctx.fillStyle = tCol; ctx.font = `900 ${sz}px 'Times New Roman', serif`; ctx.shadowColor = sCol; ctx.shadowBlur = 18; ctx.textAlign = "center"; ctx.textBaseline = "middle";

                        const centerX = (p0[0] + p1[0] + p2[0]) / 3;
                        const centerY = (p0[1] + p1[1] + p2[1]) / 3;
                        ctx.fillText(dynamicTextValue, centerX, centerY);
                        ctx.restore();
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
