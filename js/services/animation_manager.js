import { MAP_CONFIG } from '../config/app_config.js';
import HexCanvasRender from '../core/hex_canvas_render.js';
import ViewportManager from '../services/viewport_manager.js';

/**
 * Модуль для управления анимациями, спецэффектами и летящими объектами на карте
 */
const AnimationManager = {
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
     * Запускает баллистический полет флага отряда с уменьшенными вспышками золотых лучей
     */
    playFlagFlight(oldHexId, currentHexId, onImpactCallback) {
        if (oldHexId === currentHexId) {
            if (typeof onImpactCallback === 'function') onImpactCallback();
            return;
        }

        const startCoords = HexCanvasRender.hexCoords[oldHexId] || HexCanvasRender.hexCoords['hex_0_0'];
        const targetCoords = HexCanvasRender.hexCoords[currentHexId];

        if (!targetCoords) return;

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

        // --- УДАР ФЛАГА ---
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
            // Включаем временную блокировку фокуса во ViewportManager (на 1.8 секунды)
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

        // ВСПЫШКА ЛУЧЕЙ НА МЕСТЕ КВЕСТА
        setTimeout(() => {
            const currentPanX = ViewportManager.x || 0;
            const currentPanY = ViewportManager.y || 0;
            const viewRect = viewportElement ? viewportElement.getBoundingClientRect() : { left: 0, top: 0 };
            const viewWidth = viewportElement ? viewportElement.clientWidth : 0;

            // [ОПТИМИЗАЦИЯ] Триггерим фокус на гексе, что автоматически заводит анимационный loop в Canvas-рендерере
            HexCanvasRender.triggerFocus(hexId);

            const virtualXFromRight = 3840 - coords.cx;
            const cx = viewRect.left + currentPanX + viewWidth - (virtualXFromRight * zoom);
            const cy = viewRect.top + currentPanY + (coords.cy * zoom);

            this.spawnBeamsBurst(cx, cy);
            setTimeout(() => { this.spawnBeamsBurst(cx, cy); }, 100);

        }, 100);

        // Через 1.8 секунды блокировка спадает, камера сама мягко центрируется обратно на флаг отряда
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

        // [ОПТИМИЗАЦИЯ] Принудительно обновляем один кадр, чтобы скрыть/показать тултипы заданий
        if (HexCanvasRender && typeof HexCanvasRender.requestFrame === 'function') {
            HexCanvasRender.requestFrame();
        }
    }
};

export default AnimationManager;
