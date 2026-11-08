import { MAP_CONFIG } from '../config/app_config.js';
import HexCanvasRender from '../core/hex_canvas_render.js';
import ViewportManager from '../services/viewport_manager.js';
// Подключаем наш новый изолированный 3D движок токенов
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
            let mode = 'classic';
            const animSelect = document.getElementById('settingSquadAnimMode');
            if (animSelect) mode = animSelect.value;
            else if (window.SettingsManager && window.SettingsManager.state && window.SettingsManager.state.squadAnimMode) {
                mode = window.SettingsManager.state.squadAnimMode;
            }

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
                    const angleRad = (Math.PI * 2 / numRunes) * i;
                    const angleDeg = (360 / numRunes) * i;
                    runeEl.style.setProperty('--start-x', `${Math.cos(angleRad) * 15}px`);
                    runeEl.style.setProperty('--start-y', `${Math.sin(angleRad) * 15}px`);
                    runeEl.style.setProperty('--target-x', `${Math.cos(angleRad) * 130}px`);
                    runeEl.style.setProperty('--target-y', `${Math.sin(angleRad) * 130}px`);
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
    }
};

window.AnimationManager = AnimationManager;
export default AnimationManager;
