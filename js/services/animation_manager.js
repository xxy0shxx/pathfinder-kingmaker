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
     * [НОВЫЙ МЕТОД] Генерирует сочную вспышку шести золотых лучей в стиле квестов
     */
    spawnBeamsBurst(cx, cy) {
        const beamsContainer = document.createElement('div');
        beamsContainer.className = 'hex-beams-burst';
        beamsContainer.style.left = `${cx}px`;
        beamsContainer.style.top = `${cy}px`;

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
     * Запускает баллистический полет флага отряда между гексами
     */
    playFlagFlight(oldHexId, currentHexId, onImpactCallback) {
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

        // --- ТАЙМИНГИ И СТИЛИ ПРИЗЕМЛЕНИЯ ФЛАГА ---
        setTimeout(() => {
            flyingFlag.style.animation = 'none';
            flyingFlag.style.transition = 'transform 0.05s ease-out';
            flyingFlag.style.transform = `translate3d(${tX}px, ${tY}px, 0) scale(1) rotate(-5deg)`;

            // Вспышка стиля квеста №1 (Главный удар ровно в центр гекса)
            this.spawnBeamsBurst(targetScreen.x, targetScreen.y);

            if (typeof onImpactCallback === 'function') {
                onImpactCallback();
            }
        }, 1300);

        setTimeout(() => { flyingFlag.remove(); }, 1300);

        // Каскадные вспышки стиля квеста №2 и №3 (расходятся по оригинальным таймингам по бокам клетки)
        setTimeout(() => { this.spawnBeamsBurst(targetScreen.x - 45, targetScreen.y + 40); }, 1430);
        setTimeout(() => { this.spawnBeamsBurst(targetScreen.x + 45, targetScreen.y - 40); }, 1610);
    },


    /**
     * Эффект циклической пульсирующей вспышки для фокусировки внимания на конкретном гексе
     * (Добавленный метод!)
     */
    /*
    focusOnHex(hexId) {
        const vHex = document.getElementById('visual_' + hexId);
        if (!vHex) return;

        vHex.classList.add('hex-focused-flash');

        setTimeout(() => {
            vHex.classList.remove('hex-focused-flash');
        }, 3600);
    },
     */



    /**
     * Быстрый каскад из вспышек лучей света с предварительным центрированием карты
     */

    focusOnHex(hexId) {
        const coords = HexCanvasRender.hexCoords[hexId];
        if (!coords) return;

        const zoom = ViewportManager.currentZoom || 1.0;
        const viewportElement = document.getElementById('viewport');

        if (viewportElement) {
            const viewWidth = viewportElement.clientWidth;
            const viewHeight = viewportElement.clientHeight;
            const virtualXFromRight = 3840 - coords.cx;
            const virtualYFromTop = coords.cy;

            let targetPanX = (virtualXFromRight * zoom) - viewWidth / 2;
            let targetPanY = (viewHeight / 2) - (virtualYFromTop * zoom);

            const { minX, maxX, minY, maxY } = MAP_CONFIG.viewport.limits;

            targetPanX = Math.max(minX, Math.min(maxX, targetPanX));
            targetPanY = Math.max(minY, Math.min(maxY, targetPanY));

            ViewportManager.x = targetPanX;
            ViewportManager.y = targetPanY;
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
    },


    /**
     * Переключение видимости мини-тултипов квестов на карте
     * (Добавленный метод!)
     */
    toggleQuestTooltips(btnElement) {
        const visualLayer = document.getElementById('visualLayer');
        if (!visualLayer) return;
        const areHidden = visualLayer.classList.toggle('hide-quest-tooltips');
        if (btnElement) {
            btnElement.title = areHidden ? "Показать маркеры заданий" : "Скрыть маркеры заданий";
        }
    }
};

export default AnimationManager;
