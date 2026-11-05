import { MAP_CONFIG } from '../config/app_config.js';

const FrameManager = {
    RUNE_POOL: ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛟ', 'ᛞ'],
    frameElement: null,

    init() {
        this.frameElement = document.querySelector('.kingmaker-frame');
        this.initFrameStyleControls();
    },

    initFrameStyleControls() {
        const btn = document.getElementById('btnFrameStyle');
        if (!btn) return;

        const styles = [
            { id: 'norunes', icon: '🔲', title: 'Рамка: Без рун' },
            { id: 'runes', icon: 'ᚱ', title: 'Рамка: С рунами' },
            { id: 'ornament', icon: '🔸', title: 'Рамка: Орнамент' },
            { id: 'ornament-heavy', icon: '🔸', title: 'Рамка: Орнамент' }
        ];

        let currentStyleId = localStorage.getItem('kingmakerFrameStyle') || 'norunes';
        const getCurrentIndex = () => styles.findIndex(s => s.id === currentStyleId);

        btn.addEventListener('click', () => {
            let nextIdx = getCurrentIndex() + 1;
            if (nextIdx >= styles.length) nextIdx = 0;

            currentStyleId = styles[nextIdx].id;
            localStorage.setItem('kingmakerFrameStyle', currentStyleId);

            btn.innerHTML = styles[nextIdx].icon;
            btn.title = styles[nextIdx].title;

            this.applyFrameStyle(currentStyleId);
        });

        const startStyle = styles[getCurrentIndex()] || styles[0];
        btn.innerHTML = startStyle.icon;
        btn.title = startStyle.title;
        this.applyFrameStyle(startStyle.id);
    },

    applyFrameStyle(styleId) {
        if (!this.frameElement) this.frameElement = document.querySelector('.kingmaker-frame');
        if (!this.frameElement) return;

        this.frameElement.classList.remove('frame-style-runes', 'frame-style-norunes', 'frame-style-ornament', 'frame-style-ornament-heavy');

        if (styleId === 'ornament' || styleId === 'ornament-heavy') {
            this.frameElement.classList.add('frame-style-norunes', `frame-style-${styleId}`);
        } else {
            this.frameElement.classList.add(`frame-style-${styleId}`);
        }

        const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
        corners.forEach(cClass => {
            if (!this.frameElement.querySelector(`.${cClass}`)) {
                const corner = document.createElement('div');
                corner.className = `frame-corner ${cClass}`;
                this.frameElement.appendChild(corner);
            }
        });

//        this.frameElement.querySelectorAll('.hex-rune, .hex-diamond-teeth, .diamond-row, .center-bastion, #ornamentCanvas').forEach(el => el.remove());
        // Полностью очищаем старый декор (включая новую глухую заглушку карт)
        this.frameElement.querySelectorAll('.hex-rune, .hex-diamond-teeth, .diamond-row, .center-bastion, #ornamentCanvas, .frame-heavy-backdrop').forEach(el => el.remove());


        const width = this.frameElement.offsetWidth;
        const height = this.frameElement.offsetHeight;

        if (styleId === 'runes') {
            this.updateFrameRunes(width, height);
        } else if (styleId === 'ornament') {
            this.initStandardOrnamentCanvas();
        } else if (styleId === 'ornament-heavy') {
            this.updateFrameOrnament(styleId);
        }
    },

    initStandardOrnamentCanvas() {
        if (this.frameElement.querySelector('#ornamentCanvas')) return;
        const canvas = document.createElement('canvas');
        canvas.id = 'ornamentCanvas';
        this.frameElement.appendChild(canvas);
        this.drawStandardOrnamentCanvas(this.frameElement.offsetWidth, this.frameElement.offsetHeight);
    },

    drawStandardOrnamentCanvas(width, height) {
        const canvas = document.getElementById('ornamentCanvas');
        if (!canvas) return;

        // Физический размер холста с учетом расширения бордеров
        const canvasWidth = width + 44;
        const canvasHeight = height + 44;

        if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
        }

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        const drawDiamond = (cx, cy, size) => {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(cx, cy - size);
            ctx.lineTo(cx + size, cy);
            ctx.lineTo(cx, cy + size);
            ctx.lineTo(cx - size, cy);
            ctx.closePath();

            ctx.fillStyle = '#8a6421';
            ctx.fill();
            ctx.strokeStyle = '#dfbc6f';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.restore();
        };

        const size = 9;
        const step = 22;
        const pad = 44;

        const topY = 22;
        const bottomY = height - 22; // Сдвигаем снизу внутрь к видимой золотой кромке
        const leftX = 22;
        const rightX = width - 22;   // Сдвигаем справа внутрь к видимой золотой кромке

        // 1. Горизонтальные линии (Верх / Низ)
        for (let x = pad; x <= canvasWidth - pad; x += step) {
            drawDiamond(x, topY, size);
            drawDiamond(x, bottomY, size);
        }

        // 2. Вертикальные линии (Лево / Право)
        for (let y = pad; y <= canvasHeight - pad; y += step) {
            drawDiamond(leftX, y, size);
            drawDiamond(rightX, y, size);
        }
    },




    updateBounds(viewport, mapContainer, currentZoom) {
        if (!this.frameElement) this.frameElement = document.querySelector('.kingmaker-frame');
        if (!this.frameElement || !viewport || !mapContainer) return;

        const mapRect = mapContainer.getBoundingClientRect();
        const viewRect = viewport.getBoundingClientRect();

        // Проверяем текущий стиль
        const currentStyleId = localStorage.getItem('kingmakerFrameStyle') || 'norunes';
        const isHeavy = currentStyleId === 'ornament-heavy';

        // Виртуальный барьер-отступ: 24px для тяжелого орнамента, чтобы упор шел по вершинам
        const screenPadding = isHeavy ? 24 : 0;

        // Корректируем виртуальные границы экрана с учетом вылета ромбов наружу
        const cleanLeft = Math.max(viewRect.left + screenPadding, mapRect.left);
        const cleanTop = Math.max(viewRect.top + screenPadding, mapRect.top);
        const cleanRight = Math.min(viewRect.right - screenPadding, mapRect.right);
        const cleanBottom = Math.min(viewRect.bottom - screenPadding, mapRect.bottom);

        const baseWidth = Math.max(0, cleanRight - cleanLeft);
        const baseHeight = Math.max(0, cleanBottom - cleanTop);

        if (baseWidth > 0 && baseHeight > 0) {
            // ЖЁСТКАЯ ФИКСАЦИЯ: Всегда 22px бордера! Карта сохраняет исходный 100% масштаб
            const borderWidth = 22;

            this.frameElement.style.display = 'block';

            let frameLeft = cleanLeft - borderWidth;
            let frameTop = cleanTop - borderWidth;
            let frameWidth = baseWidth + (borderWidth * 2);
            let frameHeight = baseHeight + (borderWidth * 2);

            // Ограничиваем движение рамки, не давая ей заезжать за вершины ромбов
            if (frameLeft < viewRect.left) { frameWidth -= (viewRect.left - frameLeft); frameLeft = viewRect.left; }
            if (frameTop < viewRect.top) { frameHeight -= (viewRect.top - frameTop); frameTop = viewRect.top; }
            if (frameLeft + frameWidth > viewRect.right) { frameWidth = viewRect.right - frameLeft; }
            if (frameTop + frameHeight > viewRect.bottom) { frameHeight = viewRect.bottom - frameTop; }

            const fWidth = Math.ceil(frameWidth);
            const fHeight = Math.ceil(frameHeight);

            this.frameElement.style.left = `${Math.floor(frameLeft)}px`;
            this.frameElement.style.top = `${Math.floor(frameTop)}px`;
            this.frameElement.style.width = `${fWidth}px`;
            this.frameElement.style.height = `${fHeight}px`;

            if (currentStyleId === 'runes') {
                this.updateFrameRunes(fWidth, fHeight);
            } else if (currentStyleId === 'ornament') {
                this.drawStandardOrnamentCanvas(fWidth, fHeight);
            } else if (isHeavy) {
                this.updateFrameOrnament(currentStyleId);
            }

            // Маска карты всегда режется по стандартным 22px видимого золотого канта
            const clipLeft = Math.max(0, viewRect.left - mapRect.left) / currentZoom;
            const clipTop = Math.max(0, viewRect.top - mapRect.top) / currentZoom;
            const clipRight = Math.max(0, mapRect.right - viewRect.right) / currentZoom;
            const clipBottom = Math.max(0, mapRect.bottom - viewRect.bottom) / currentZoom;

            mapContainer.style.clipPath = `inset(${clipTop}px ${clipRight}px ${clipBottom}px ${clipLeft}px)`;
        } else {
            this.frameElement.style.display = 'none';
            mapContainer.style.clipPath = 'none';
        }
    },



    updateFrameRunes(width, height) {
        this.frameElement.querySelectorAll('.hex-rune, .hex-diamond-teeth').forEach(el => el.remove());

        const step = MAP_CONFIG.viewport.step || 50;
        const padding = MAP_CONFIG.viewport.padding || 20;

        const cTop = -11;
        const cLeft = -11;
        const cBottom = height - 33;
        const cRight = width - 33;

        const createRune = (left, top) => {
            const runeElement = document.createElement('div');
            runeElement.className = 'hex-rune';
            runeElement.style.left = `${left}px`;
            runeElement.style.top = `${top}px`;
            runeElement.style.transform = 'translate(-50%, -50%)';
            runeElement.style.animationDelay = `${Math.random() * -5}s`;
            runeElement.textContent = this.RUNE_POOL[Math.floor(Math.random() * this.RUNE_POOL.length)];
            this.frameElement.appendChild(runeElement);
        };

        const innerWidth = width - 44;
        const innerHeight = height - 44;

        for (let l = padding; l < innerWidth - padding; l += step) { createRune(l, cTop); }
        for (let l = padding; l < innerWidth - padding; l += step) { createRune(l, cBottom); }
        for (let t = padding; t < innerHeight - padding; t += step) { createRune(cLeft, t); }
        for (let t = padding; t < innerHeight - padding; t += step) { createRune(cRight, t); }
    },


    updateFrameOrnament(styleId = 'ornament') {
        this.frameElement.querySelectorAll('.hex-rune, .hex-diamond-teeth, .diamond-row, .center-bastion, .heavy-edge-shield').forEach(el => el.remove());

        const width = this.frameElement.offsetWidth || window.innerWidth;
        const height = this.frameElement.offsetHeight || window.innerHeight;

        const directions = ['top', 'bottom', 'left', 'right'];
        const fragment = document.createDocumentFragment();

        const isHeavy = styleId === 'ornament-heavy';
        const targetStep = isHeavy ? 38 : 35;
        const paddingOffset = isHeavy ? 44 : 56;

        directions.forEach(dir => {
            const row = document.createElement('div');
            row.className = `diamond-row row-${dir}`;

            let count = 0;
            if (dir === 'top' || dir === 'bottom') {
                const availableWidth = Math.max(0, width - paddingOffset);
                count = Math.floor(availableWidth / targetStep);
            } else {
                const availableHeight = Math.max(0, height - paddingOffset);
                count = Math.ceil(availableHeight / targetStep);
            }

            if (count > 0) {
                const half = Math.floor(count / 2);

                for (let i = 0; i < count; i++) {
                    if (isHeavy && i === half) {
                        const spacer = document.createElement('div');
                        spacer.className = 'diamond-spacer';
                        row.appendChild(spacer);
                    }

                    const tooth = document.createElement('div');
                    tooth.className = 'diamond-tooth';
                    row.appendChild(tooth);
                }
                fragment.appendChild(row);
            }

            if (isHeavy) {
                const bastion = document.createElement('div');
                bastion.className = `center-bastion bastion-${dir}`;
                fragment.appendChild(bastion);

                // Создаем защитную плашку цвета общего фона для текущей стороны
                const shield = document.createElement('div');
                shield.className = `heavy-edge-shield shield-${dir}`;
                fragment.appendChild(shield);
            }
        });

        this.frameElement.appendChild(fragment);
    }


};

export default FrameManager;
