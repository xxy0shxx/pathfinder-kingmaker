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
     * Запускает баллистический полет флага отряда между гексами с последующим эффектом удара
     */
    playFlagFlight(startHexElement, targetHexElement, onImpactCallback) {
        if (!targetHexElement) return;

        let startX = 0;
        let startY = 0;
        const baseStartHex = startHexElement || document.getElementById('visual_hex_0_0');

        if (baseStartHex) {
            const startRect = baseStartHex.getBoundingClientRect();
            startX = startRect.left + startRect.width / 2;
            startY = startRect.top + startRect.height / 2;
        }

        const targetRect = targetHexElement.getBoundingClientRect();
        const targetX = targetRect.left + targetRect.width / 2;
        const targetY = targetRect.top + targetRect.height / 2;

        const flyingFlag = document.createElement('div');
        flyingFlag.className = 'global-flying-flag';
        flyingFlag.innerHTML = `
            <div class="squad-pole" style="height: 50px; width: 6px; background: #333; margin-left: 6px; border-radius: 2px; border: 1px solid #000;">
                <div class="squad-flag" style="width: 30px; height: 20px; background: #c0392b; clip-path: polygon(0 0, 100% 50%, 0 100%); border: 2px solid #ffffff; box-shadow: 2px 2px 4px rgba(0,0,0,0.4);"></div>
            </div>
        `;

        const sX = startX - 9;
        const sY = startY - 50;
        const tX = targetX - 9;
        const tY = targetY - 50;

        flyingFlag.style.setProperty('--start-x', `${sX}px`);
        flyingFlag.style.setProperty('--start-y', `${sY}px`);
        flyingFlag.style.setProperty('--target-x', `${tX}px`);
        flyingFlag.style.setProperty('--target-y', `${tY}px`);

        document.body.appendChild(flyingFlag);

        setTimeout(() => {
            flyingFlag.style.animation = 'none';
            flyingFlag.style.transition = 'transform 0.05s ease-out';
            flyingFlag.style.transform = `translate3d(${tX}px, ${tY}px, 0) scale(1) rotate(-5deg)`;

            this.createBurst(targetX, targetY);

            if (typeof onImpactCallback === 'function') {
                onImpactCallback();
            }
        }, 1300);

        setTimeout(() => {
            flyingFlag.remove();
        }, 1300);

        setTimeout(() => { this.createBurst(targetX - 45, targetY + 40); }, 1430);
        setTimeout(() => { this.createBurst(targetX + 45, targetY - 40); }, 1610);
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
     * Быстрый каскад из 3 пульсирующих вспышек, исходящих из центра гекса подряд
     * (Вызывается при клике на квест/слух в Журнале заданий)
     */
    focusOnHex(hexId) {
        const vHex = document.getElementById('visual_' + hexId);
        if (!vHex) return;

        // 1. Включаем фирменное свечение самого гекса
        vHex.classList.add('hex-focused-flash');

        // Расчет геометрии центра гекса для генерации эффектов
        const rect = vHex.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        // Внутренний хелпер для генерации одной быстрой вспышки лучей
        const spawnBurst = () => {
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

            // Удаляем контейнер конкретной вспышки сразу после окончания её анимации (600мс)
            setTimeout(() => { beamsContainer.remove(); }, 500);
        };

        setTimeout(() => { spawnBurst(); }, 100);
//        setTimeout(() => { spawnBurst(); }, 700);
//        setTimeout(() => { spawnBurst(); }, 1300);

        // 3. Таймер очистки свечения самого гекса
        setTimeout(() => {
            vHex.classList.remove('hex-focused-flash');
        }, 3600);
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
