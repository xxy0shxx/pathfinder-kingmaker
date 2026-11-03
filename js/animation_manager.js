/**
 * Модуль для управления анимациями, спецэффектами и летящими объектами на карте
 */
const AnimationManager = {
    /**
     * Создает радиальный взрыв искр в указанных координатах (фиксированных относительно экрана)
     * @param {number} bx - Координата X (clientX / px)
     * @param {number} by - Координата Y (clientY / px)
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
     * Запускает баллистический полет флага отряда между гексами с последующим эффектом удара
     * @param {HTMLElement|null} startHexElement - Элемент, от которого летит флаг (если null, берется дефолтный hex_0_0)
     * @param {HTMLElement} targetHexElement - Целевой элемент гекса, куда перемещается отряд
     * @param {Function} onImpactCallback - Функция, вызываемая в момент приземления флага (для включения статического флага)
     */
    playFlagFlight(startHexElement, targetHexElement, onImpactCallback) {
        if (!targetHexElement) return;

        // Расчет стартовой позиции флага
        let startX = 0;
        let startY = 0;
        const baseStartHex = startHexElement || document.getElementById('visual_hex_0_0');

        if (baseStartHex) {
            const startRect = baseStartHex.getBoundingClientRect();
            startX = startRect.left + startRect.width / 2;
            startY = startRect.top + startRect.height / 2;
        }

        // Расчет целевой позиции флага
        const targetRect = targetHexElement.getBoundingClientRect();
        const targetX = targetRect.left + targetRect.width / 2;
        const targetY = targetRect.top + targetRect.height / 2;

        // Создание летящей ноды флага
        const flyingFlag = document.createElement('div');
        flyingFlag.className = 'global-flying-flag';
        flyingFlag.innerHTML = `
            <div class="squad-pole" style="height: 50px; width: 6px; background: #333; margin-left: 6px; border-radius: 2px; border: 1px solid #000;">
                <div class="squad-flag" style="width: 30px; height: 20px; background: #c0392b; clip-path: polygon(0 0, 100% 50%, 0 100%); border: 2px solid #ffffff; box-shadow: 2px 2px 4px rgba(0,0,0,0.4);"></div>
            </div>
        `;

        // Смещение относительно центра флага (совпадает со стилями оригинального скрипта)
        const sX = startX - 9;
        const sY = startY - 50;
        const tX = targetX - 9;
        const tY = targetY - 50;

        flyingFlag.style.setProperty('--start-x', `${sX}px`);
        flyingFlag.style.setProperty('--start-y', `${sY}px`);
        flyingFlag.style.setProperty('--target-x', `${tX}px`);
        flyingFlag.style.setProperty('--target-y', `${tY}px`);

        document.body.appendChild(flyingFlag);

        // Таймер 1: Приземление основного флага (1300мс — длительность анимации windowsSmoothFly в CSS)
        setTimeout(() => {
            flyingFlag.style.animation = 'none';
            flyingFlag.style.transition = 'transform 0.05s ease-out';
            flyingFlag.style.transform = `translate3d(${tX}px, ${tY}px, 0) scale(1) rotate(-5deg)`;

            // Первичный взрыв в точке падения
            this.createBurst(targetX, targetY);

            // Передаем управление обратно для отрисовки стационарного флага на карте
            if (typeof onImpactCallback === 'function') {
                onImpactCallback();
            }
        }, 1300);

        // Таймер 2: Удаление временного летящего DOM-элемента
        setTimeout(() => {
            flyingFlag.remove();
        }, 1300);

        // Таймеры 3 и 4: Дополнительные отголоски взрывов (сохраняем оригинальный сочный сок спецэффектов)
        setTimeout(() => { this.createBurst(targetX - 45, targetY + 40); }, 1430);
        setTimeout(() => { this.createBurst(targetX + 45, targetY - 40); }, 1610);
    }
};

export default AnimationManager;
