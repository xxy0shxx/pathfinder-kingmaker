import { MAP_CONFIG } from '../config/app_config.js';

const FrameManager = {
    RUNE_POOL: ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛟ', 'ᛞ'],
    frameElement: null,
    runeCharacterCache: new Map(),
    isRuneAnimating: false, // Изолированный поток анимации рун

    init() {
        this.frameElement = document.querySelector('.kingmaker-frame');
        this.initFrameStyleControls();

        // Автозапуск изолированного дыхания при первой загрузке
        if (localStorage.getItem('kingmakerFrameStyle') === 'runes') {
            this.startRuneAnimation();
        }
    },

    initFrameStyleControls() {
        const btn = document.getElementById('btnFrameStyle');
        if (!btn) return;

        const styles = [
            { id: 'norunes', icon: '🔲', title: 'Рамка: Без рун' },
            { id: 'runes', icon: 'ᚱ', title: 'Рамка: С рунами' },
            { id: 'ornament', icon: '🔸', title: 'Рамка: Орнамент' },
            { id: 'ornament-heavy', icon: '🔶', title: 'Рамка: Орнамент Крупный' }
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

        if (styleId === 'ornament' || styleId === 'ornament-heavy' || styleId === 'runes') {
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

        this.frameElement.querySelectorAll('.hex-rune, .hex-diamond-teeth, .diamond-row, .center-bastion, #ornamentCanvas, .frame-heavy-backdrop').forEach(el => el.remove());
        this.runeCharacterCache.clear();

        const width = this.frameElement.offsetWidth;
        const height = this.frameElement.offsetHeight;

        if (styleId === 'runes' || styleId === 'ornament') {
            if (this.frameElement.querySelector('#ornamentCanvas')) return;
            const canvas = document.createElement('canvas');
            canvas.id = 'ornamentCanvas';
            this.frameElement.appendChild(canvas);

            if (styleId === 'runes') {
                canvas.style.zIndex = '10003';
                this.startRuneAnimation();
            } else {
                this.isRuneAnimating = false;
                canvas.style.zIndex = '-1';
                this.drawStandardOrnamentCanvas(width, height);
            }
        } else {
            this.isRuneAnimating = false;
            if (styleId === 'ornament-heavy') this.updateFrameOrnament(styleId);
        }
    },

    startRuneAnimation() {
        if (this.isRuneAnimating) return;
        this.isRuneAnimating = true;

        const runeLoop = () => {
            if (!this.isRuneAnimating || localStorage.getItem('kingmakerFrameStyle') !== 'runes') {
                this.isRuneAnimating = false;
                return;
            }
            this.updateFrameRunes(this.frameElement.offsetWidth, this.frameElement.offsetHeight);
            requestAnimationFrame(runeLoop);
        };
        requestAnimationFrame(runeLoop);
    },

    updateFrameRunes(width, height) {
        const canvas = document.getElementById('ornamentCanvas');
        if (!canvas) return;

        const canvasWidth = width + 44;
        const canvasHeight = height + 44;

        if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
        }

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        const time = Date.now() * 0.0007;

        ctx.font = 'bold 18px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(223, 188, 111, 0.6)';
        ctx.shadowBlur = 5;

        const step = MAP_CONFIG.viewport.step || 50;
        const padding = MAP_CONFIG.viewport.padding || 20;

        const topY = 13;
        const bottomY = canvasHeight - 54;
        const leftX = 11;
        const rightX = canvasWidth - 54;

        const drawRuneAt = (x, y) => {
            const coordKey = `${Math.round(x)}_${Math.round(y)}`;

            // Если руны нет в кэше — генерируем её символ и уникальное смещение фазы анимации
            if (!this.runeCharacterCache.has(coordKey)) {
                this.runeCharacterCache.set(coordKey, {
                    char: this.RUNE_POOL[Math.floor(Math.random() * this.RUNE_POOL.length)],
                    phaseShift: Math.random() * Math.PI * 2 // Случайная фаза от 0 до 360 градусов
                });
            }

            const runeData = this.runeCharacterCache.get(coordKey);

            const runeAlpha = 0.2 + Math.abs(Math.sin(time + runeData.phaseShift)) * 0.8;

            ctx.fillStyle = `rgba(223, 188, 111, ${runeAlpha})`;
            ctx.fillText(runeData.char, x, y);
        };

        for (let x = padding + 44; x <= canvasWidth - padding - 44; x += step) {
            drawRuneAt(x, topY); drawRuneAt(x, bottomY);
        }
        for (let y = padding + 44; y <= canvasHeight - padding - 44; y += step) {
            drawRuneAt(leftX, y); drawRuneAt(rightX, y);
        }
    },

    drawStandardOrnamentCanvas(width, height) {
        const canvas = document.getElementById('ornamentCanvas');
        if (!canvas) return;

        const canvasWidth = width + 44;
        const canvasHeight = height + 44;

        if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
        }

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        const drawDiamond = (cx, cy, size) => {
            ctx.save(); ctx.beginPath();
            ctx.moveTo(cx, cy - size); ctx.lineTo(cx + size, cy);
            ctx.lineTo(cx, cy + size); ctx.lineTo(cx - size, cy);
            ctx.closePath(); ctx.fillStyle = '#8a6421'; ctx.fill();
            ctx.strokeStyle = '#dfbc6f'; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore();
        };

        const size = 9; const step = 22; const pad = 44;
        const topY = 22; const bottomY = height - 22;
        const leftX = 22; const rightX = width - 22;

        for (let x = pad; x <= canvasWidth - pad; x += step) {
            drawDiamond(x, topY, size); drawDiamond(x, bottomY, size);
        }
        for (let y = pad; y <= canvasHeight - pad; y += step) {
            drawDiamond(leftX, y, size); drawDiamond(rightX, y, size);
        }
    },

    updateBounds(viewport, mapContainer, currentZoom) {
        if (!this.frameElement) this.frameElement = document.querySelector('.kingmaker-frame');
        if (!this.frameElement || !viewport || !mapContainer) return;

        const mapRect = mapContainer.getBoundingClientRect();
        const viewRect = viewport.getBoundingClientRect();

        const cleanLeft = Math.max(viewRect.left, mapRect.left);
        const cleanTop = Math.max(viewRect.top, mapRect.top);
        const cleanRight = Math.min(viewRect.right, mapRect.right);
        const cleanBottom = Math.min(viewRect.bottom, mapRect.bottom);

        const baseWidth = Math.max(0, cleanRight - cleanLeft);
        const baseHeight = Math.max(0, cleanBottom - cleanTop);

        if (baseWidth > 0 && baseHeight > 0) {
            const borderWidth = 22;
            const currentStyleId = localStorage.getItem('kingmakerFrameStyle') || 'norunes';
            const isHeavy = currentStyleId === 'ornament-heavy';

            this.frameElement.style.display = 'block';

            let frameLeft = cleanLeft - borderWidth;
            let frameTop = cleanTop - borderWidth;
            let frameWidth = baseWidth + (borderWidth * 2);
            let frameHeight = baseHeight + (borderWidth * 2);

            const heavyPadding = isHeavy ? 24 : 0;

            if (frameLeft < viewRect.left + heavyPadding) {
                frameWidth -= ((viewRect.left + heavyPadding) - frameLeft); frameLeft = viewRect.left + heavyPadding;
            }
            if (frameTop < viewRect.top + heavyPadding) {
                frameHeight -= ((viewRect.top + heavyPadding) - frameTop); frameTop = viewRect.top + heavyPadding;
            }
            if (frameLeft + frameWidth > viewRect.right - heavyPadding) {
                frameWidth = (viewRect.right - heavyPadding) - frameLeft;
            }
            if (frameTop + frameHeight > viewRect.bottom - heavyPadding) {
                frameHeight = (viewRect.bottom - heavyPadding) - frameTop;
            }

            const fWidth = Math.ceil(frameWidth); const fHeight = Math.ceil(frameHeight);
            this.frameElement.style.left = `${Math.floor(frameLeft)}px`;
            this.frameElement.style.top = `${Math.floor(frameTop)}px`;
            this.frameElement.style.width = `${fWidth}px`;
            this.frameElement.style.height = `${fHeight}px`;

            if (currentStyleId === 'runes') {
                const canvas = document.getElementById('ornamentCanvas');
                if (canvas) canvas.style.zIndex = '10003';
                this.startRuneAnimation();
            } else if (currentStyleId === 'ornament') {
                this.drawStandardOrnamentCanvas(fWidth, fHeight);
            } else if (isHeavy) {
                this.updateFrameOrnament(currentStyleId);
            }

            const clipLeft = Math.max(0, viewRect.left - mapRect.left) / currentZoom;
            const clipTop = Math.max(0, viewRect.top - mapRect.top) / currentZoom;
            const clipRight = Math.max(0, mapRect.right - viewRect.right) / currentZoom;
            const clipBottom = Math.max(0, mapRect.bottom - viewRect.bottom) / currentZoom;
            mapContainer.style.clipPath = `inset(${clipTop}px ${clipRight}px ${clipBottom}px ${clipLeft}px)`;
        } else {
            this.frameElement.style.display = 'none'; mapContainer.style.clipPath = 'none';
        }
    },

    updateFrameOrnament(styleId = 'ornament') {
        this.frameElement.querySelectorAll('.hex-rune, .hex-diamond-teeth, .diamond-row, .center-bastion, .heavy-absolute-shield, .heavy-glow-underlay').forEach(el => el.remove());

        const width = this.frameElement.offsetWidth || window.innerWidth;
        const height = this.frameElement.offsetHeight || window.innerHeight;
        const directions = ['top', 'bottom', 'left', 'right'];
        const fragment = document.createDocumentFragment();

        const isHeavy = styleId === 'ornament-heavy';
        const targetStep = isHeavy ? 38 : 35; const paddingOffset = isHeavy ? 44 : 56;

        directions.forEach(dir => {
            const row = document.createElement('div'); row.className = `diamond-row row-${dir}`;
            let count = 0;
            if (dir === 'top' || dir === 'bottom') {
                count = Math.floor(Math.max(0, width - paddingOffset) / targetStep);
            } else {
                count = Math.ceil(Math.max(0, height - paddingOffset) / targetStep);
            }

            if (count > 0) {
                const half = Math.floor(count / 2);
                for (let i = 0; i < count; i++) {
                    if (isHeavy && i === half) {
                        const spacer = document.createElement('div'); spacer.className = 'diamond-spacer'; row.appendChild(spacer);
                    }
                    const tooth = document.createElement('div'); tooth.className = 'diamond-tooth'; row.appendChild(tooth);
                }
                fragment.appendChild(row);
            }

            if (isHeavy) {
                const bastion = document.createElement('div'); bastion.className = `center-bastion bastion-${dir}`; fragment.appendChild(bastion);
            }
        });

        if (isHeavy) {
            const glowUnderlay = document.createElement('div'); glowUnderlay.className = 'heavy-glow-underlay'; fragment.appendChild(glowUnderlay);
            const shield = document.createElement('div'); shield.className = 'heavy-absolute-shield'; fragment.appendChild(shield);
        }
        this.frameElement.appendChild(fragment);
    }
};

export default FrameManager;
