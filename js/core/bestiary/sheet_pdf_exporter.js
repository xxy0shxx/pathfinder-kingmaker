import { PF2E_SHEET_CONFIG, ensureCharacterStats } from './bestiary_config.js';
import { PF2E_CANTRIPS } from '../../config/cantrips_catalog.js';
import { PF2E_FOCUS_SPELLS } from '../../config/focus_spells_catalog.js';
import { PF2E_SPELLS_LVL1 } from '../../config/spells_lvl1_catalog.js';
import { PF2E_SPELLS_LVL2 } from '../../config/spells_lvl2_catalog.js';
import { PF2E_SPELLS_LVL3 } from '../../config/spells_lvl3_catalog.js';
import { PF2E_SPELLS_LVL4 } from '../../config/spells_lvl4_catalog.js';
import { PF2E_ITEMS_CATALOG, calculateCharacterBulk, getItemLevel } from '../../config/items_catalog.js';

import { PF2E_MELEE_WEAPONS, PF2E_RANGED_WEAPONS, getWeaponCritEffect, getWeaponTraitsDetails } from '../../config/weapons_catalog.js';
import { PF2E_ARMOR_CATALOG, getArmorGroupEffect, getArmorTraitsDetails } from '../../config/armor_catalog.js';
import { PF2E_ANCESTRIES, PF2E_CLASSES } from '../../config/meta_catalog.js';
import { PF2E_HERITAGES } from '../../config/heritages_catalog.js';
import { PF2E_BACKGROUNDS } from '../../config/backgrounds_catalog.js';
import * as FeatsMod from '../../config/feats_catalog.js';
import AvatarRegistry from '../../services/avatars/avatar_registry.js';

const esc = (v) => String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const fmtMod = (v) => {
    const n = Number(v) || 0;
    return n >= 0 ? `+${n}` : `${n}`;
};

const norm = (str) => String(str || '')
    .replace(/^[^\p{L}\p{N}]+/u, '')
    .replace(/\([^)]*\)/g, '')
    .trim()
    .toLowerCase()
    .replace(/ё/g, 'е');

const findInCat = (list, query) => {
    const q = norm(query);
    if (!q || !Array.isArray(list)) return null;
    return list.find(x => {
        const n = norm(x.name);
        return n === q || (q.length > 3 && (n.includes(q) || q.includes(n)));
    }) || null;
};

const profBoxes = (prof) => {
    const p = Number(prof) || 0;
    return `<span class="prof-wrap"><span class="pbox ${p >= 2 ? 'on' : ''}">И</span><span class="pbox ${p >= 4 ? 'on' : ''}">Э</span></span>`;
};

let cachedPfLogoUrl = null;
function generatePathfinderLogoDataUrl() {
    if (cachedPfLogoUrl) return cachedPfLogoUrl;

    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 140;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Вычисляем точные координаты букв
    const pX = 39;
    const pBaseY = 98;
    const word = 'ATHFINDER';
    const wordStartX = 96;
    const wordBaseY = 85;

    ctx.font = '900 44px Georgia, "Times New Roman", serif';
    const letterBoxes = [];
    let curX = wordStartX;
    for (let i = 0; i < word.length; i++) {
        const ch = word[i];
        const w = ctx.measureText(ch).width;
        letterBoxes.push({ ch, x: curX, w });
        curX += w + 1.5;
    }

    const iBox = letterBoxes.find(b => b.ch === 'I') || { x: 245, w: 18 };
    const rBox = letterBoxes[letterBoxes.length - 1] || { x: 380, w: 32 };
    const iMidX = iBox.x + iBox.w / 2;
    const rMidX = rBox.x + rBox.w * 0.55;
    const rightEndX = curX + 12;

    // 2. Контур ленты: опущенный шпиль и завиток P точно к верхней перекладине буквы, пик над I, вензели под P и R
    const traceRibbon = () => {
        ctx.beginPath();
        // Вершина шпиля буквы P (опущена на 9px прямо к букве)
        ctx.moveTo(49, 23);
        ctx.lineTo(59, 36);
        // Верхняя правая дуга чаши P
        ctx.lineTo(75, 38);
        ctx.quadraticCurveTo(95, 39, 98, 47);
        // Верхняя планка до выступа над I
        ctx.lineTo(iMidX - 12, 47);
        ctx.lineTo(iMidX, 35);
        ctx.lineTo(iMidX + 12, 47);
        // Верхняя планка до правого края
        ctx.lineTo(rightEndX - 16, 47);
        ctx.quadraticCurveTo(rightEndX, 47, rightEndX, 65);
        ctx.lineTo(rightEndX, 82);
        // Правый нижний вензель под R
        ctx.quadraticCurveTo(rightEndX, 97, rightEndX - 14, 97);
        ctx.lineTo(rMidX + 10, 97);
        ctx.quadraticCurveTo(rMidX + 4, 110, rMidX - 6, 110);
        ctx.quadraticCurveTo(rMidX - 15, 110, rMidX - 17, 97);
        // Нижняя горизонтальная линия до ножки P
        ctx.lineTo(74, 97);
        // Нижний вензель и удлинённое остриё ножки P
        ctx.quadraticCurveTo(73, 110, 64, 110);
        ctx.lineTo(57, 110);
        ctx.lineTo(49, 124);
        ctx.lineTo(41, 112);
        ctx.lineTo(41, 78);
        // Выемка слева под верхней волютой P
        ctx.lineTo(34, 70);
        // Верхняя волюта слева на уровне верхней перекладины P
        ctx.quadraticCurveTo(18, 66, 18, 52);
        ctx.quadraticCurveTo(18, 39, 35, 38);
        ctx.lineTo(39, 36);
        ctx.closePath();
    };

    // Мягкая тень под эмблемой
    ctx.save();
    ctx.translate(3, 5);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    traceRibbon();
    ctx.fill();
    ctx.restore();

    // Внешняя золотисто-кремовая кайма
    traceRibbon();
    ctx.lineJoin = 'round';
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#e8d399';
    ctx.stroke();

    // Тёмный внешний контур
    ctx.lineWidth = 13;
    ctx.strokeStyle = '#1f1008';
    ctx.globalCompositeOperation = 'destination-over';
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';

    // Внутренняя тёмно-бордовая заливка
    const bgGrad = ctx.createLinearGradient(0, 26, 0, 122);
    bgGrad.addColorStop(0, '#3d150c');
    bgGrad.addColorStop(0.5, '#260b06');
    bgGrad.addColorStop(1, '#170603');
    ctx.fillStyle = bgGrad;
    traceRibbon();
    ctx.fill();

    // Тонкая внутренняя золотая обводка
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = '#c8a456';
    traceRibbon();
    ctx.stroke();

    // Декоративная золотая линия под словом ATHFINDER с двумя симметричными вензелями (под P и под R)
    const barGrad = ctx.createLinearGradient(58, 0, rightEndX - 10, 0);
    barGrad.addColorStop(0, '#c8a456');
    barGrad.addColorStop(0.5, '#f5e4b3');
    barGrad.addColorStop(1, '#c8a456');

    ctx.strokeStyle = barGrad;
    ctx.lineWidth = 3.0;
    ctx.lineCap = 'round';
    ctx.beginPath();
    // Левый вензель под P
    ctx.moveTo(64, 92);
    ctx.quadraticCurveTo(60, 92, 60, 96);
    ctx.quadraticCurveTo(60, 102, 66, 102);
    ctx.quadraticCurveTo(72, 102, 72, 90);
    // Горизонтальная перекладина до R
    ctx.lineTo(rMidX - 12, 90);
    // Правый вензель под R
    ctx.quadraticCurveTo(rMidX - 12, 102, rMidX - 5, 102);
    ctx.quadraticCurveTo(rMidX + 2, 102, rMidX + 2, 95);
    ctx.quadraticCurveTo(rMidX + 2, 91, rMidX - 2, 91);
    ctx.stroke();

    // 3. Золотистый градиент для букв
    const textGrad = ctx.createLinearGradient(0, 26, 0, 116);
    textGrad.addColorStop(0, '#fff4cf');
    textGrad.addColorStop(0.45, '#e8cd82');
    textGrad.addColorStop(1, '#b58d3d');

    ctx.fillStyle = textGrad;
    ctx.strokeStyle = '#140703';
    ctx.lineJoin = 'round';
    ctx.textBaseline = 'alphabetic';

    // Стилизованная заглавная P со шпилем и верхним завитком
    ctx.font = '900 82px Georgia, "Times New Roman", serif';
    ctx.lineWidth = 4.5;
    ctx.strokeText('P', pX, pBaseY);
    ctx.fillText('P', pX, pBaseY);

    // Верхний шпиль вплотную к верхней перекладине буквы P
    ctx.fillStyle = textGrad;
    ctx.strokeStyle = '#140703';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(49, 27);
    ctx.lineTo(54, 44);
    ctx.lineTo(44, 44);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Завиток слева, выходящий прямо из верхней засечки буквы P
    ctx.strokeStyle = '#f5e4b3';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(45, 44);
    ctx.quadraticCurveTo(25, 42, 25, 52);
    ctx.quadraticCurveTo(25, 60, 33, 60);
    ctx.quadraticCurveTo(37, 60, 37, 55);
    ctx.stroke();

    // Нижнее остриё ножки P
    ctx.fillStyle = textGrad;
    ctx.strokeStyle = '#140703';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(45, 97);
    ctx.lineTo(53, 97);
    ctx.lineTo(49, 118);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Буквы ATHFINDER
    ctx.font = '900 44px Georgia, "Times New Roman", serif';
    letterBoxes.forEach(({ ch, x }) => {
        ctx.lineWidth = 3.8;
        ctx.strokeText(ch, x, wordBaseY);
        ctx.fillText(ch, x, wordBaseY);
    });

    // Ромб-звёздочка над буквой I
    ctx.fillStyle = '#f5e4b3';
    ctx.beginPath();
    ctx.moveTo(iMidX, 40);
    ctx.lineTo(iMidX + 3.8, 44);
    ctx.lineTo(iMidX, 48);
    ctx.lineTo(iMidX - 3.8, 44);
    ctx.closePath();
    ctx.fill();

    // Обрезаем пустое прозрачное поле справа, чтобы логотип центрировался строго по середине блока
    const exactWidth = Math.min(canvas.width, Math.ceil(rightEndX + 14));
    const trimmedCanvas = document.createElement('canvas');
    trimmedCanvas.width = exactWidth;
    trimmedCanvas.height = canvas.height;
    const tCtx = trimmedCanvas.getContext('2d');
    if (tCtx) {
        tCtx.drawImage(canvas, 0, 0, exactWidth, canvas.height, 0, 0, exactWidth, canvas.height);
        cachedPfLogoUrl = trimmedCanvas.toDataURL('image/png');
    } else {
        cachedPfLogoUrl = canvas.toDataURL('image/png');
    }
    return cachedPfLogoUrl;
}

let cachedPfIcons = null;

function generatePathfinderSidebarIcons() {
    if (cachedPfIcons) return cachedPfIcons;

    const makeIcon = (w, h, drawFn) => {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d');
        if (!ctx) return '';
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        drawFn(ctx, w, h);
        return c.toDataURL('image/png');
    };

    const poly = (ctx, pts) => {
        ctx.beginPath();
        pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
        ctx.closePath();
    };

    // 1. Шесть фирменных многогранников Pathfinder 2e
    const dice = {
        d4: makeIcon(64, 64, (ctx) => {
            const pts = [[32, 8], [56, 54], [8, 54]];
            poly(ctx, pts);
            ctx.fillStyle = '#ede53b';
            ctx.fill();
            ctx.lineWidth = 4.2;
            ctx.strokeStyle = '#111111';
            ctx.stroke();
        }),
        d6: makeIcon(64, 64, (ctx) => {
            const top = [[32, 8], [54, 20], [32, 32], [10, 20]];
            const left = [[10, 20], [32, 32], [32, 56], [10, 44]];
            const right = [[32, 32], [54, 20], [54, 44], [32, 56]];
            ctx.fillStyle = '#aa6e9b'; poly(ctx, top); ctx.fill();
            ctx.fillStyle = '#995c8a'; poly(ctx, left); ctx.fill();
            ctx.fillStyle = '#874c79'; poly(ctx, right); ctx.fill();
            ctx.lineWidth = 2.4; ctx.strokeStyle = '#111111';
            [top, left, right].forEach(f => { poly(ctx, f); ctx.stroke(); });
            poly(ctx, [[32, 8], [54, 20], [54, 44], [32, 56], [10, 44], [10, 20]]);
            ctx.lineWidth = 4.0; ctx.stroke();
        }),

        d8: makeIcon(64, 64, (ctx) => {
            const top = new Array(32, 7);
            const topRight = new Array(54, 19.5);
            const botRight = new Array(54, 44.5);
            const bot = new Array(32, 57);
            const botLeft = new Array(10, 44.5);
            const topLeft = new Array(10, 19.5);

            const outer = new Array(top, topRight, botRight, bot, botLeft, topLeft);
            const inner = new Array(top, botRight, botLeft);

            poly(ctx, outer);
            ctx.fillStyle = '#c86026';
            ctx.fill();

            poly(ctx, inner);
            ctx.fillStyle = '#dc7234';
            ctx.fill();

            ctx.lineWidth = 2.6;
            ctx.strokeStyle = '#111111';
            poly(ctx, inner);
            ctx.stroke();

            poly(ctx, outer);
            ctx.lineWidth = 4.2;
            ctx.stroke();
        }),

        d10: makeIcon(64, 64, (ctx) => {
            const outer = [[32, 7], [55, 32], [32, 57], [9, 32]];
            poly(ctx, outer); ctx.fillStyle = '#159848'; ctx.fill();
            ctx.fillStyle = '#24b05a';
            poly(ctx, [[32, 7], [43, 30], [32, 39], [21, 30]]); ctx.fill();
            ctx.lineWidth = 2.2; ctx.strokeStyle = '#111111';
            [
                [[32, 7], [43, 30]], [[32, 7], [21, 30]],
                [[43, 30], [32, 39]], [[21, 30], [32, 39]],
                [[43, 30], [55, 32]], [[21, 30], [9, 32]],
                [[32, 39], [32, 57]]
            ].forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); });
            poly(ctx, outer); ctx.lineWidth = 4.0; ctx.stroke();
        }),
        d12: makeIcon(64, 64, (ctx) => {
            const cx = 32, cy = 32, rOut = 25, rIn = 12.5;
            const outPts = Array.from({ length: 10 }, (_, i) => {
                const a = -Math.PI / 2 + (i * Math.PI) / 5;
                return [cx + Math.cos(a) * rOut, cy + Math.sin(a) * rOut];
            });
            const inPts = Array.from({ length: 5 }, (_, i) => {
                const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
                return [cx + Math.cos(a) * rIn, cy + Math.sin(a) * rIn];
            });
            poly(ctx, outPts); ctx.fillStyle = '#195492'; ctx.fill();
            poly(ctx, inPts); ctx.fillStyle = '#2466ab'; ctx.fill();
            ctx.lineWidth = 2.2; ctx.strokeStyle = '#111111';
            poly(ctx, inPts); ctx.stroke();
            inPts.forEach((p, i) => {
                const target = outPts[i * 2];
                ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(target[0], target[1]); ctx.stroke();
            });
            poly(ctx, outPts); ctx.lineWidth = 4.0; ctx.stroke();
        }),
        d20: makeIcon(64, 64, (ctx) => {
            const outer = [[32, 7], [54, 19], [54, 45], [32, 57], [10, 45], [10, 19]];
            const inner = [[32, 18], [46, 41], [18, 41]];
            poly(ctx, outer); ctx.fillStyle = '#a81e24'; ctx.fill();
            poly(ctx, inner); ctx.fillStyle = '#c42930'; ctx.fill();
            ctx.lineWidth = 2.2; ctx.strokeStyle = '#111111';
            poly(ctx, inner); ctx.stroke();
            [
                [[32, 7], [32, 18]], [[54, 19], [32, 18]], [[10, 19], [32, 18]],
                [[54, 19], [46, 41]], [[54, 45], [46, 41]], [[32, 57], [46, 41]],
                [[10, 19], [18, 41]], [[10, 45], [18, 41]], [[32, 57], [18, 41]]
            ].forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); });
            poly(ctx, outer); ctx.lineWidth = 4.0; ctx.stroke();
        })
    };

    // 2. Пять фирменных значков действий Pathfinder 2e (малый ромб строго СЛЕВА + шеврон-стрелка справа)
    const drawActionGlyph = (ctx, x, y, s, hollow = false, chevronOnly = false) => {
        ctx.save();
        ctx.translate(x, y);
        // При повороте на +45° угол (-s, +s) уходит строго ВЛЕВО (9 часов), а (+s, -s) — ВПРАВО (3 часа)
        ctx.rotate(Math.PI / 4);

        const d = s * 0.84; // размер стороны малого ромба
        const c = d + s * 0.24; // отступ до внутренней грани шеврона

        if (hollow) {
            ctx.lineWidth = 2.2;
            ctx.strokeStyle = '#111111';
            if (!chevronOnly) {
                ctx.strokeRect(-s, s - d, d, d);
            }
            ctx.beginPath();
            ctx.moveTo(-s, -s);
            ctx.lineTo(s, -s);
            ctx.lineTo(s, s);
            ctx.lineTo(-s + c, s);
            ctx.lineTo(-s + c, s - c);
            ctx.lineTo(-s, s - c);
            ctx.closePath();
            ctx.stroke();
        } else {
            ctx.fillStyle = '#111111';
            // 1. Отдельный маленький ромб строго слева (только у первого символа)
            if (!chevronOnly) {
                ctx.fillRect(-s, s - d, d, d);
            }

            // 2. Широкий шеврон-стрелка справа
            ctx.beginPath();
            ctx.moveTo(-s, -s);
            ctx.lineTo(s, -s);
            ctx.lineTo(s, s);
            ctx.lineTo(-s + c, s);
            ctx.lineTo(-s + c, s - c);
            ctx.lineTo(-s, s - c);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
    };

    const actions = {
        act1: makeIcon(80, 36, (ctx) => drawActionGlyph(ctx, 40, 18, 10.5, false, false)),
        act2: makeIcon(96, 36, (ctx) => {
            drawActionGlyph(ctx, 39, 18, 10.2, false, false);
            drawActionGlyph(ctx, 56, 18, 10.2, false, true);
        }),
        act3: makeIcon(114, 36, (ctx) => {
            drawActionGlyph(ctx, 39, 18, 10.0, false, false);
            drawActionGlyph(ctx, 56, 18, 10.0, false, true);
            drawActionGlyph(ctx, 73, 18, 10.0, false, true);
        }),
        free: makeIcon(80, 36, (ctx) => drawActionGlyph(ctx, 40, 18, 10.5, true, false)),

        react: makeIcon(80, 38, (ctx) => {
            // Толстая изогнутая стрелка ответного действия как на фото
            ctx.fillStyle = '#111111';
            ctx.beginPath();
            // Внешняя дуга от левого верхнего хвоста до правого изгиба и вниз к основанию наконечника
            ctx.moveTo(26, 13);
            ctx.bezierCurveTo(33, 6, 53, 7, 53, 20);
            ctx.bezierCurveTo(53, 29, 43, 31, 37, 30);
            // Нижнее крыло наконечника стрелки
            ctx.lineTo(39, 35);
            ctx.lineTo(27, 27);
            ctx.lineTo(38, 20);
            ctx.lineTo(37, 25);
            // Внутренняя дуга обратно к сужающемуся хвосту
            ctx.bezierCurveTo(42, 26, 47, 24, 47, 19);
            ctx.bezierCurveTo(47, 13, 34, 12, 26, 13);
            ctx.closePath();
            ctx.fill();
        })
    };

    cachedPfIcons = { dice, actions };
    return cachedPfIcons;
}

let cachedPfCombatBadges = null;

function generatePathfinderCombatBadges() {
    if (cachedPfCombatBadges) return cachedPfCombatBadges;

    const makeBadge = (w, h, drawFn) => {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d');
        if (!ctx) return '';
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        drawFn(ctx, w, h);
        return c.toDataURL('image/png');
    };

    const crimson = '#8a1c14';

    // 1. Жирное красное контурное сердце «МАКСИМУМ»
    const hpHeart = makeBadge(120, 108, (ctx) => {
        ctx.beginPath();
        ctx.moveTo(60, 98);
        ctx.bezierCurveTo(18, 71, 7, 46, 7, 29);
        ctx.bezierCurveTo(7, 13, 20, 6, 34, 6);
        ctx.bezierCurveTo(46, 6, 55, 13, 60, 22);
        ctx.bezierCurveTo(65, 13, 74, 6, 86, 6);
        ctx.bezierCurveTo(100, 6, 113, 13, 113, 29);
        ctx.bezierCurveTo(113, 46, 102, 71, 60, 98);
        ctx.closePath();

        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.lineWidth = 5.6;
        ctx.strokeStyle = crimson;
        ctx.stroke();

        ctx.fillStyle = crimson;
        ctx.font = '900 12.5px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('МАКСИМУМ', 60, 32);
    });

    // 2. Жирная красная фигурная рамка «СКОРОСТЬ / ФУТОВ»
    const speedBox = makeBadge(156, 72, (ctx) => {
        ctx.beginPath();
        ctx.moveTo(14, 7);
        ctx.lineTo(142, 7);
        ctx.lineTo(149, 16);
        ctx.lineTo(149, 56);
        ctx.lineTo(142, 65);
        ctx.lineTo(14, 65);
        ctx.lineTo(7, 56);
        ctx.lineTo(7, 16);
        ctx.closePath();

        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.lineWidth = 5.0;
        ctx.strokeStyle = crimson;
        ctx.stroke();

        // Внутренняя красная рамка
        ctx.lineWidth = 2.0;
        ctx.strokeRect(13, 12, 130, 48);

        // Надпись «ФУТОВ» справа снизу
        ctx.fillStyle = crimson;
        ctx.font = '900 12px Arial, sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText('ФУТОВ', 137, 55);
    });

    // 3. Жирная красная контурная лупа для «Внимания»
    const perceptionGlass = makeBadge(100, 100, (ctx) => {
        const cx = 56, cy = 42, r = 31;

        // Ручка лупы влево-вниз (↙) с жирным красным контуром
        ctx.save();
        ctx.translate(33, 64);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = crimson;
        ctx.lineWidth = 4.8;
        ctx.beginPath();
        ctx.roundRect(-5.5, 0, 11, 27, 4);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Внешний жирный красный ободок линзы
        ctx.beginPath();
        ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.lineWidth = 5.2;
        ctx.strokeStyle = crimson;
        ctx.stroke();

        // Внутренний тонкий красный кант линзы
        ctx.beginPath();
        ctx.arc(cx, cy, r - 1.5, 0, Math.PI * 2);
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = crimson;
        ctx.stroke();
    });

    // 4. Жирный красный геральдический щит «КБ»
    const acShield = makeBadge(108, 118, (ctx) => {
        const traceShield = () => {
            ctx.beginPath();
            ctx.moveTo(54, 6);
            ctx.quadraticCurveTo(78, 16, 97, 15);
            ctx.lineTo(93, 54);
            ctx.quadraticCurveTo(89, 89, 54, 111);
            ctx.quadraticCurveTo(19, 89, 15, 54);
            ctx.lineTo(11, 15);
            ctx.quadraticCurveTo(30, 16, 54, 6);
            ctx.closePath();
        };

        // Белый фон щита
        traceShield();
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Верхняя плашка под «КБ» с красной отбивкой
        ctx.save();
        traceShield();
        ctx.clip();
        ctx.fillStyle = '#f9f1ed';
        ctx.fillRect(0, 0, 108, 36);
        ctx.beginPath();
        ctx.moveTo(8, 36);
        ctx.lineTo(100, 36);
        ctx.lineWidth = 3.2;
        ctx.strokeStyle = crimson;
        ctx.stroke();
        ctx.restore();

        // Внешний жирный красный контур щита
        traceShield();
        ctx.lineWidth = 5.6;
        ctx.strokeStyle = crimson;
        ctx.stroke();

        // Надпись «КБ» в верхней шапке щита
        ctx.fillStyle = crimson;
        ctx.font = '900 17px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('КБ', 54, 24);
    });

    // 5. Значок «АТАКА» для оружия ближнего боя (свиток-плашка с вогнутыми сторонами)
    const meleeAtkBadge = makeBadge(116, 86, (ctx) => {
        const traceMelee = () => {
            ctx.beginPath();
            ctx.moveTo(8, 8);
            ctx.quadraticCurveTo(58, 18, 108, 8);
            ctx.quadraticCurveTo(96, 42, 108, 78);
            ctx.quadraticCurveTo(58, 68, 8, 78);
            ctx.quadraticCurveTo(20, 42, 8, 8);
            ctx.closePath();
        };

        // Белое поле для цифры атаки
        traceMelee();
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Нижняя тёмно-красная плашка с белой надписью «АТАКА»
        ctx.save();
        traceMelee();
        ctx.clip();
        ctx.fillStyle = crimson;
        ctx.fillRect(0, 56, 116, 30);
        ctx.restore();

        // Жирный красный контур
        traceMelee();
        ctx.lineWidth = 4.2;
        ctx.strokeStyle = crimson;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 12.5px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('АТАКА', 58, 66);
    });

    // 6. Значок «АТАКА» для дистанционного оружия (наконечник стрелы вверх)
    const rangedAtkBadge = makeBadge(124, 92, (ctx) => {
        const traceArrow = () => {
            ctx.beginPath();
            ctx.moveTo(62, 6);
            ctx.lineTo(116, 46);
            ctx.lineTo(90, 46);
            ctx.lineTo(96, 84);
            ctx.lineTo(28, 84);
            ctx.lineTo(34, 46);
            ctx.lineTo(8, 46);
            ctx.closePath();
        };

        // Белое поле для цифры атаки
        traceArrow();
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Нижняя тёмно-красная плашка с белой надписью «АТАКА»
        ctx.save();
        traceArrow();
        ctx.clip();
        ctx.fillStyle = crimson;
        ctx.fillRect(0, 62, 124, 30);
        ctx.restore();

        // Жирный красный контур
        traceArrow();
        ctx.lineWidth = 4.2;
        ctx.strokeStyle = crimson;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 12.5px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('АТАКА', 62, 73);
    });

    // 7. Восьмиугольная красная рамка для «Проверки атаки заклинанием» и «СЛ заклинаний»
    const spellOctBadge = makeBadge(92, 68, (ctx) => {
        ctx.beginPath();
        ctx.moveTo(20, 7);
        ctx.lineTo(72, 7);
        ctx.lineTo(85, 20);
        ctx.lineTo(85, 48);
        ctx.lineTo(72, 61);
        ctx.lineTo(20, 61);
        ctx.lineTo(7, 48);
        ctx.lineTo(7, 20);
        ctx.closePath();

        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.lineWidth = 4.6;
        ctx.strokeStyle = crimson;
        ctx.stroke();
    });

    cachedPfCombatBadges = { hpHeart, speedBox, perceptionGlass, acShield, meleeAtkBadge, rangedAtkBadge, spellOctBadge };
    return cachedPfCombatBadges;
}




const sidebarHtml = (pageNum) => {
    const logoUrl = generatePathfinderLogoDataUrl();
    const { dice, actions } = generatePathfinderSidebarIcons();


    const dieRow = (imgUrl, label) => `
        <div class="die-row" style="position:relative; display:flex; justify-content:center; align-items:center; width:100%; margin:2px 0;">
            <img src="${imgUrl}" alt="${label}" style="width:46px; height:46px; display:block;">
            <b style="position:absolute; left:calc(50% + 18px); bottom:2px; font-size:7.5pt; color:#111; line-height:1;">${label}</b>
        </div>
    `;
    const actRow = (imgUrl, text, isLast = false) => `
        <div class="act-item" style="flex-direction:column; align-items:center; text-align:center; padding:3px 0; ${isLast ? '' : 'border-bottom:1px solid #d46b27;'}">
            <img src="${imgUrl}" alt="${text}" style="height:17px; width:auto; display:block; margin:0 auto 2px auto;">
            <span style="font-size:6.3pt; font-weight:700; line-height:1.1; color:#111;">${text}</span>
        </div>
    `;

    return `
    <aside class="pf-sidebar">
        <div class="sb-logo">
            ${logoUrl
        ? `<img src="${logoUrl}" alt="Pathfinder" style="max-width: 100%; height: auto; display: block; margin: 0 auto 3px auto;">`
        : `<div class="sb-pf">PATHFINDER</div>`
    }
        </div>
        <div class="sb-hdr">КОСТИ</div>
        <div class="sb-dice" style="display:flex; flex-direction:column; align-items:center; padding:3px 0;">
            ${dieRow(dice.d4, 'D4')}
            ${dieRow(dice.d6, 'D6')}
            ${dieRow(dice.d8, 'D8')}
            ${dieRow(dice.d10, 'D10')}
            ${dieRow(dice.d12, 'D12')}
            ${dieRow(dice.d20, 'D20')}
        </div>
        <div class="sb-hdr">ДЕЙСТВИЯ</div>
        <div class="sb-acts" style="display:flex; flex-direction:column; padding:2px 0;">
            ${actRow(actions.act1, 'Одно действие')}
            ${actRow(actions.act2, 'Два действия')}
            ${actRow(actions.act3, 'Три действия')}
            ${actRow(actions.free, 'Свободное действие')}
            ${actRow(actions.react, 'Ответное действие', true)}
        </div>
        <div class="sb-hdr">УМЕНИЕ</div>
        <div class="sb-prof">
            <div class="prof-tier"><b>НЕИЗУЧЕННЫЙ</b><span>0</span></div>
            <div class="prof-tier"><b>ИЗУЧЕННЫЙ</b><span>2 + уровень</span></div>
            <div class="prof-tier"><b>ЭКСПЕРТНЫЙ</b><span>4 + уровень</span></div>
        </div>
        <div class="sb-foot">Разрешено копирование для личного использования<br>© Paizo Inc. • Стр. ${pageNum}/3</div>
    </aside>
`;
};


export function exportCharacterToPdf(hero) {

    if (!hero) return;
    const s = ensureCharacterStats(hero);
    const name = hero.name || 'Безымянный герой';
    const { hpHeart, speedBox, perceptionGlass, acShield, meleeAtkBadge, rangedAtkBadge, spellOctBadge } = generatePathfinderCombatBadges();




    const feat1 = [s.classFeatLvl1Name, s.classFeatLvl1Desc].filter(Boolean).join(' — ');
    const feat2 = [s.classFeatLvl2Name, s.classFeatLvl2Desc].filter(Boolean).join(' — ');
    const higherLevels = new Array(4, 6, 8, 10, 12, 14, 16, 18, 20);
    const otherFeats = higherLevels
        .map(l => s[`classFeatLvl${l}Name`] ? `${l} ур.: ${s[`classFeatLvl${l}Name`]}${s[`classFeatLvl${l}Desc`] ? ' (' + s[`classFeatLvl${l}Desc`] + ')' : ''}` : '')
        .filter(Boolean)
        .join(' • ');

    const penaltySkills = ['acrobatics', 'athletics', 'stealth', 'thievery'];
    const armorPen = Math.abs(Number(s.acArmorPenalty) || 0);
    const statLabels = { str: 'СИЛ', dex: 'ЛВК', con: 'ВЫН', int: 'ИНТ', wis: 'МДР', cha: 'ХАР' };
    const skillStatMap = {
        acrobatics: 'dex', athletics: 'str', thievery: 'dex', stealth: 'dex',
        survival: 'wis', medicine: 'wis', nature: 'wis', religion: 'wis',
        diplomacy: 'cha', intimidation: 'cha', deception: 'cha', performance: 'cha',
        arcana: 'int', occultism: 'int', society: 'int', crafting: 'int', lore: 'int'
    };

    const skillsHtml = PF2E_SHEET_CONFIG.skills.map(sk => {
        const cleanName = sk.label.replace(/^[^\p{L}]+/u, '').trim().toUpperCase();
        const total = Number(s[sk.key]) || 0;
        const prof = Number(s[`prof_${sk.key}`]) || 0;
        const statKey = skillStatMap[sk.key] || 'int';
        const statMod = Number(s[statKey]) || 0;
        const hasPen = penaltySkills.includes(sk.key);
        return `
        <div class="skill-row">
            <div class="skill-name">${esc(cleanName)}</div>
            ${profBoxes(prof)}
            <span class="eq">=</span>
            <div class="box box-sm bold">${fmtMod(total)}</div>
            <span class="op">+</span>
            <div class="box-sub"><div class="box box-xs">${fmtMod(statMod)}</div><span>${statLabels[statKey]}</span></div>
            <span class="op">+</span>
            <div class="box-sub"><div class="box box-xs">${prof}</div><span>УМЕНИЕ</span></div>
            ${hasPen ? `<span class="op">−</span><div class="box-sub"><div class="box box-xs">${armorPen}</div><span>БРОНЯ</span></div>` : '<div class="pen-spacer"></div>'}
        </div>`;
    }).join('');


    const buildRichSpells = (prefix, maxCount, catalog, hasReady = false) => {
        const entries = new Array();
        for (let i = 1; i <= maxCount; i++) {
            const spName = String(s[`${prefix}${i}Name`] || '').trim();
            const spAct = String(s[`${prefix}${i}Actions`] || '').trim();
            const spNotes = String(s[`${prefix}${i}Notes`] || '').trim();
            const ready = hasReady ? !!s[`${prefix}${i}Ready`] : false;
            if (!spName && !spNotes) continue;
            const cat = findInCat(catalog, spName);
            const act = spAct || cat?.actions || '';
            const desc = spNotes || cat?.notes || '';
            entries.push({ idx: i, name: spName || 'Заклинание', act, desc, ready, hasReady });
        }
        if (!entries.length) {
            return `<div class="empty-slot">Слоты не заполнены</div>`;
        }
        return entries.map(e => `
            <div class="rich-entry">
                <div class="re-head">
                    ${e.hasReady ? `<span class="chk ${e.ready ? 'on' : ''}">${e.ready ? '✓' : ''}</span>` : `<span class="re-num">${e.idx}.</span>`}
                    <b class="re-title">${esc(e.name)}</b>
                    ${e.act ? `<span class="re-tag">${esc(e.act)}</span>` : ''}
                </div>
                ${e.desc ? `<div class="re-desc">${esc(e.desc)}</div>` : ''}
            </div>
        `).join('');
    };

    const buildRichItems = () => {
        const heroLvl = Math.max(1, parseInt(s.level, 10) || 1);
        const entries = [];
        for (let i = 1; i <= 15; i++) {
            const itName = String(s[`item${i}Name`] || '').trim();
            const itQty = Number(s[`item${i}Qty`]) ?? 1;
            const itNotes = String(s[`item${i}Notes`] || '').trim();
            if (!itName && !itNotes) continue;

            const cat = findInCat(PF2E_ITEMS_CATALOG, itName);
            const reqLvl = cat ? getItemLevel(cat) : 0;
            const isLocked = reqLvl > heroLvl;

            // Очищаем дублирующийся префикс из заметок, чтобы красиво отрендерить его тегом
            const cleanNotes = itNotes.replace(/^⚠️\s*\[Требуется\s*\d+\s*ур\.[^\]]*\]\s*/i, '');
            const desc = cleanNotes || cat?.notes || cat?.desc || '';

            const metaParts = [];
            if (cat?.category) metaParts.push(cat.category);
            if (cat?.price) metaParts.push(cat.price);
            if (cat?.bulk) metaParts.push(`Масса ${cat.bulk}`);
            const meta = metaParts.join(', ');

            entries.push({ name: itName || 'Предмет', qty: itQty, desc, meta, isLocked, reqLvl });
        }
        if (!entries.length) {
            return `<div class="empty-slot">Рюкзак пуст</div>`;
        }
        return entries.map(it => `
            <div class="rich-entry">
                <div class="re-head">
                    <b class="re-title">${esc(it.name)}</b>
                    ${it.isLocked ? `<span style="font-size:5.8pt; color:#b91c1c; font-weight:800; background:#fee2e2; border:1px solid #f87171; border-radius:2px; padding:0 3px;">🔒 ТРЕБ. ${it.reqLvl} УР.</span>` : ''}
                    <span class="re-qty">×${it.qty}${it.meta ? ` (${esc(it.meta)})` : ''}</span>
                </div>
                ${it.desc ? `<div class="re-desc">${it.isLocked ? `<b style="color:#b91c1c;">[Бонусы заблокированы: требуется ${it.reqLvl} уровень]</b> ` : ''}${esc(it.desc)}</div>` : ''}
            </div>
        `).join('');
    };

    const armorObj = findInCat(PF2E_ARMOR_CATALOG, s.armorName);
    const armorGroupEff = armorObj ? getArmorGroupEffect(armorObj.group) : '';
    const armorTraitsText = armorObj
        ? getArmorTraitsDetails(armorObj.traits).map(t => t.desc ? `${t.trait}: ${t.desc}` : t.trait).join(' • ')
        : '';

    const buildWeaponCardHtml = (label, wName, wAtk, wDmg, wTraits, isRanged = false) => {
        const cat = findInCat(isRanged ? PF2E_RANGED_WEAPONS : PF2E_MELEE_WEAPONS, wName);
        const traitsStr = wTraits || cat?.traits || '';
        const critEff = cat ? getWeaponCritEffect(cat.group) : '';
        const traitsExplained = getWeaponTraitsDetails(traitsStr)
            .map(t => t.desc ? `<b>${esc(t.trait)}</b>: ${esc(t.desc)}` : esc(t.trait))
            .join(' • ');

        const dmgLower = `${wDmg || ''} ${cat?.damageType || ''}`.toLowerCase();
        const isB = /дроб|bludg|\bд\b/i.test(dmgLower);
        const isP = /кол|pierc|\bк\b/i.test(dmgLower);
        const isS = /реж|руб|slash|\bр\b/i.test(dmgLower);
        const atkIcon = isRanged ? rangedAtkBadge : meleeAtkBadge;

        // Вычисляем модификатор характеристики (ЛВК/СИЛ) и бонус умения (И/Э) для формулы АТАКА = ЛВК/СИЛ + УМЕНИЕ
        const isFinesse = /точн|finesse/i.test(traitsStr);
        const strMod = Number(s.str) || 0;
        const dexMod = Number(s.dex) || 0;
        const statVal = isRanged ? dexMod : (isFinesse ? Math.max(strMod, dexMod) : strMod);

        const parsedAtk = parseInt(String(wAtk || '').replace(/[^\d+-]/g, ''), 10);
        const hasWeapon = Boolean(String(wName || '').trim() || !isNaN(parsedAtk));
        const lvl = Math.max(1, Number(s.level) || 1);

        let profVal = 0;
        if (!isNaN(parsedAtk)) {
            const diff = parsedAtk - statVal;
            if (diff >= lvl + 4) profVal = lvl + 4;
            else if (diff >= lvl + 2) profVal = lvl + 2;
            else if (diff > 0) profVal = diff;
        }

        const statDisplay = hasWeapon ? fmtMod(statVal) : '';
        const profDisplay = hasWeapon ? String(profVal) : '';
        const statCaption = isRanged ? 'ЛВК' : 'ЛВК/СИЛ';

        return `
        <div class="wpn-card" style="border:1.4px solid #5e1914; padding:3px 5px;">
            <div style="display:flex; align-items:center; gap:3px; margin-bottom:3px;">
                <div style="flex:1; min-width:0;">
                    <div class="sub-lbl" style="font-size:5.2pt;">${label}</div>
                    <div class="wpn-title" style="min-height:14px; font-size:7.6pt;">${esc(wName || '')}</div>
                </div>
                <div style="position:relative; width:${isRanged ? '48px' : '44px'}; height:35px; flex-shrink:0;">
                    <img src="${atkIcon}" alt="Атака" style="width:100%; height:100%; object-fit:contain; display:block;">
                    <span style="position:absolute; top:${isRanged ? '12px' : '8px'}; left:0; right:0; text-align:center; font-size:9pt; font-weight:900; color:#111; line-height:1;">${esc(wAtk || '')}</span>
                </div>
                <span class="eq">=</span>
                <div class="box-sub">
                    <div class="box box-xs" style="width:24px; height:16px; font-size:7.5pt;">${statDisplay}</div>
                    <span>${statCaption}</span>
                </div>
                <span class="op">+</span>
                <div class="box-sub">
                    <div class="box box-xs" style="width:24px; height:16px; font-size:7.5pt;">${profDisplay}</div>
                    <span>УМЕНИЕ</span>
                </div>
                <div style="display:flex; flex-direction:column; gap:1px; margin-left:1px;">
                    <span class="pbox ${profVal >= lvl + 2 ? 'on' : ''}" style="width:11px; height:11px; font-size:5.5pt;">И</span>
                    <span class="pbox ${profVal >= lvl + 4 ? 'on' : ''}" style="width:11px; height:11px; font-size:5.5pt;">Э</span>
                </div>
            </div>
            <div style="display:flex; align-items:center; justify-content:space-between; gap:6px; font-size:6.5pt; margin-bottom:2px;">
                <div style="display:flex; align-items:center; gap:4px;">
                    <span class="sub-lbl">УРОН:</span>
                    <span style="border:1.2px solid #2b2b2b; border-radius:3px; background:#fff; padding:1px 6px; font-weight:800; min-width:52px; text-align:center;">${esc(wDmg || '—')}</span>
                </div>
                <div style="display:flex; gap:5px; align-items:center; font-size:5.6pt; font-weight:800;">
                    <span style="display:inline-flex; align-items:center; gap:2px;"><span class="chk ${isB ? 'on' : ''}">${isB ? '✓' : ''}</span>ДРОБЯЩИЙ</span>
                    <span style="display:inline-flex; align-items:center; gap:2px;"><span class="chk ${isP ? 'on' : ''}">${isP ? '✓' : ''}</span>КОЛЮЩИЙ</span>
                    <span style="display:inline-flex; align-items:center; gap:2px;"><span class="chk ${isS ? 'on' : ''}">${isS ? '✓' : ''}</span>РЕЖУЩИЙ</span>
                </div>
            </div>
            <div style="font-size:6pt; color:#222; border-top:1px solid #cbbba0; padding-top:1.5px;">
                <span class="sub-lbl">ДЕСКРИПТОРЫ:</span> <b>${esc(traitsStr || '—')}</b>
            </div>
            ${(critEff || traitsExplained) ? `<div class="wpn-extra">${critEff ? `<span><b>Крит (${esc(cat.group)}):</b> ${esc(critEff)}</span> ` : ''}${traitsExplained ? `<span>${traitsExplained}</span>` : ''}</div>` : ''}
        </div>`;
    };






    const hasComp = (s.compType && s.compType !== 'none') || String(s.compName || '').trim() || String(s.compAbilitiesText || '').trim();
    const compTypeName = s.compType === 'familiar' ? 'Фамильяр' : (s.compType === 'companion' ? 'Верный зверь' : 'Спутник');

    const allFeatsPool = Object.values(FeatsMod).filter(Array.isArray).flat();




    const renderMiniEntry = (tag, tagBg, title, desc) => `
        <div class="mini-feat-row">
            <div class="mfr-head">
                ${tag ? `<span class="mfr-tag" style="background:${tagBg};">${esc(tag)}</span>` : ''}
                <b class="mfr-title">${esc(title)}</b>
            </div>
            ${desc ? `<div class="mfr-desc">${esc(desc)}</div>` : ''}
        </div>
    `;

    // А. Народ, Наследие и Черты народа (1, 5, 9, 13, 17 ур.)
    const ancestryObj = findInCat(PF2E_ANCESTRIES, s.ancestry);
    const heritageObj = findInCat(PF2E_HERITAGES, s.heritage);
    const ancLevels = new Array(1, 5, 9, 13, 17);
    const ancEntries = new Array();

    if (ancestryObj?.traits) {
        ancEntries.push(renderMiniEntry('НАРОД', '#eee6d8', 'Дескрипторы и черты', ancestryObj.traits));
    }
    if (s.heritage) {
        ancEntries.push(renderMiniEntry('НАСЛЕДИЕ', '#e8f5e9', s.heritage, heritageObj?.desc || ''));
    }
    ancLevels.forEach(lvl => {
        const fName = String(s[`ancFeatLvl${lvl}Name`] || '').trim();
        const fDesc = String(s[`ancFeatLvl${lvl}Desc`] || '').trim();
        if (fName || fDesc) {
            ancEntries.push(renderMiniEntry(`${lvl} УР.`, '#ede7f6', fName || 'Черта народа', fDesc));
        }
    });

    const ancestryHtml = ancEntries.length
        ? ancEntries.join('')
        : `<div class="empty-slot">Особенности народа не указаны</div>`;

    // Б. Происхождение и Черта происхождения
    const bgObj = findInCat(PF2E_BACKGROUNDS, s.background);
    const bgFeatText = s.backgroundFeat || bgObj?.feat || '';
    const bgEntries = [];

    if (bgFeatText) {
        bgEntries.push(renderMiniEntry('ЧЕРТА', '#e3f2fd', bgFeatText, bgObj?.desc || ''));
    } else if (bgObj?.desc) {
        bgEntries.push(renderMiniEntry('ОПИСАНИЕ', '#eee6d8', s.background || 'Происхождение', bgObj.desc));
    }
    if (bgObj?.skillName || bgObj?.lore) {
        const skillsLine = [bgObj.skillName ? `Навык: ${bgObj.skillName}` : '', bgObj.lore ? `Знание: ${bgObj.lore}` : ''].filter(Boolean).join(' • ');
        bgEntries.push(renderMiniEntry('ПОДГОТОВКА', '#f3e5f5', 'Обучение', skillsLine));
    }

    const bgHtml = bgEntries.length
        ? bgEntries.join('')
        : `<div class="empty-slot">Описание происхождения не указано</div>`;

    // В. Класс, Действия, Классовые, Общие и Навыковые черты
    const classObj = findInCat(PF2E_CLASSES, s.charClass);
    const classEntries = [];

    if (classObj) {
        classEntries.push(renderMiniEntry('КЛАСС', '#fff3e0', `${classObj.hp} ПЗ/ур. • Ключевая: ${classObj.keyStat}`, classObj.desc || ''));
    }

    [1, 2, 3].forEach(i => {
        const aName = String(s[`actionSlot${i}Name`] || '').trim();
        const aDesc = String(s[`actionSlot${i}Desc`] || '').trim();
        if (aName) {
            classEntries.push(renderMiniEntry('⚡ ДЕЙСТВИЕ', '#e8f5e9', aName, aDesc));
        }
    });

    [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20].forEach(lvl => {
        const fName = String(s[`classFeatLvl${lvl}Name`] || '').trim();
        let fDesc = String(s[`classFeatLvl${lvl}Desc`] || '').trim();
        if (!fName && !fDesc) return;
        if (!fDesc && fName) {
            const catFeat = findInCat(allFeatsPool, fName);
            if (catFeat?.desc) fDesc = catFeat.desc;
        }
        classEntries.push(renderMiniEntry(`КЛАСС ${lvl}`, '#e8f5e9', fName || `Черта ${lvl} ур.`, fDesc));
    });

    [3, 7, 11, 15, 19].forEach(lvl => {
        const fName = String(s[`genFeatLvl${lvl}Name`] || '').trim();
        const fDesc = String(s[`genFeatLvl${lvl}Desc`] || '').trim();
        if (fName || fDesc) {
            classEntries.push(renderMiniEntry(`ОБЩАЯ ${lvl}`, '#fff8e1', fName || `Общая черта ${lvl} ур.`, fDesc));
        }
    });

    [2, 4, 6, 8, 10, 12, 14, 16, 18, 20].forEach(lvl => {
        const fName = String(s[`skillFeatLvl${lvl}Name`] || '').trim();
        const fDesc = String(s[`skillFeatLvl${lvl}Desc`] || '').trim();
        if (fName || fDesc) {
            classEntries.push(renderMiniEntry(`НАВЫК ${lvl}`, '#e3f2fd', fName || `Черта навыка ${lvl} ур.`, fDesc));
        }
    });

    const classHtml = classEntries.length
        ? classEntries.join('')
        : `<div class="empty-slot">Классовые способности не указаны</div>`;




    const genLevels = new Array(3, 7, 11, 15, 19);
    const genFeatsLines = genLevels.map(lvl => {
        const fName = String(s[`genFeatLvl${lvl}Name`] || '').trim();
        const fDesc = String(s[`genFeatLvl${lvl}Desc`] || '').trim();
        return (fName || fDesc) ? `🌟 Общая (${lvl} ур.): ${fName}${fDesc ? ' — ' + fDesc : ''}` : '';
    }).filter(Boolean);

    const skillLevels = new Array(2, 4, 6, 8, 10, 12, 14, 16, 18, 20);
    const skillFeatsLines = skillLevels.map(lvl => {
        const fName = String(s[`skillFeatLvl${lvl}Name`] || '').trim();
        const fDesc = String(s[`skillFeatLvl${lvl}Desc`] || '').trim();
        return (fName || fDesc) ? `📚 Навык (${lvl} ур.): ${fName}${fDesc ? ' — ' + fDesc : ''}` : '';
    }).filter(Boolean);

    const actionLines = new Array(1, 2, 3).map(i => {
        const aName = String(s[`actionSlot${i}Name`] || '').trim();
        const aDesc = String(s[`actionSlot${i}Desc`] || '').trim();
        return aName ? `⚡ ${aName}${aDesc ? ' — ' + aDesc : ''}` : '';
    }).filter(Boolean);

    const avatarId = hero.avatarType || AvatarRegistry.guessAvatarByName(name) || AvatarRegistry.guessAvatarByName(s.charClass);
    const portraitUrl = hero.avatarUrl || hero.img || (avatarId ? AvatarRegistry.getAvatarDataUrl(avatarId) : '');

    const bulkInfo = calculateCharacterBulk(s);
    const bd = bulkInfo.breakdown || { armor: '0', weapons: '0', backpack: '0', coins: '0', totalCoins: 0 };
    const bulkStr = `${bulkInfo.totalBulk}${bulkInfo.remLight > 0 ? ` и ${bulkInfo.remLight} Л` : ''}`;
    const bulkStatus = bulkInfo.isOverloaded
        ? ' [🚫 ПЕРЕГРУЗКА: НЕЛЬЗЯ ПОДНЯТЬ]'
        : (bulkInfo.isEncumbered ? ' [⚠️ Перегрузка: Неуклюжесть 1, −10 фт. скорости]' : '');

    const bulkSummaryLine = `🎒 МАССА (BULK): ${bulkStr} / ${bulkInfo.encumberedLimit} (Макс. ${bulkInfo.maxLimit})${bulkStatus}\n• Доспех: ${bd.armor} | Оружие: ${bd.weapons} | Рюкзак и щит: ${bd.backpack} | Монеты (${bd.totalCoins}): ${bd.coins}`;

    const notesWithBulk = new Array(bulkSummaryLine, String(s.notesText || '').trim())
        .filter(Boolean)
        .join('\n\n');


    const investedUsed = Math.min(10, Math.max(0, Number(s.investedUsedToday) || 0));

    const renderPdfBodySlot = (slotKey, icon, label) => {
        const val = String(s[`eq_${slotKey}_Name`] || '').trim();
        const isInv = !!s[`eq_${slotKey}_Invested`];
        return `
            <div style="border: 1.2px solid ${isInv ? '#5e1914' : '#8c7b65'}; border-radius: 3px; padding: 3px 5px; background: ${isInv ? '#fdf6f0' : '#fcfaf6'}; margin-bottom: 3px;">
                <div style="display:flex; justify-content:space-between; font-size:5.5pt; font-weight:800; color:#5e1914; text-transform:uppercase;">
                    <span>${icon} ${label}</span>
                    ${isInv ? `<span style="color:#5e1914;">✨ ВЛОЖ.</span>` : ''}
                </div>
                <div style="font-size:7.2pt; font-weight:800; color:${val ? '#1e242b' : '#999'}; min-height:12px; border-bottom:1px solid #cbbba0;">
                    ${esc(val || '— Пусто —')}
                </div>
            </div>
        `;
    };

    const ringsHtml = [1, 2, 3, 4, 5].map(idx => {
        const val = String(s[`eq_ring_${idx}_Name`] || '').trim();
        const isInv = !!s[`eq_ring_${idx}_Invested`];
        return `
            <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:1px dashed #cbbba0; padding:2px 0; font-size:7pt;">
                <span><b>💍 Слот ${idx}:</b> ${esc(val || '—')}</span>
                ${isInv ? `<span style="font-size:5.8pt; font-weight:800; color:#5e1914; background:#eee6d8; padding:0 3px; border-radius:2px;">✨ ВЛОЖ.</span>` : ''}
            </div>
        `;
    }).join('');

    const beltPdfHtml = [1, 2, 3, 4, 5].map(idx => {
        const bVal = String(s[`beltItem${idx}Name`] || '').trim();
        return `
            <div style="border:1px solid #8c7b65; border-radius:3px; padding:3px 4px; background:#fcfaf6;">
                <div style="font-size:5.5pt; font-weight:800; color:#2d4739;">⚡ ПОЯС #${idx} (1 ◆)</div>
                <div style="font-size:6.8pt; font-weight:800; color:${bVal ? '#1a1a1a' : '#999'}; min-height:11px;">${esc(bVal || 'Пусто')}</div>
            </div>
        `;
    }).join('');

    const allDollSlots = [
        ['head', '👑 Голова'], ['cloak', '🧥 Плечи'], ['neck', '📿 Шея'],
        ['armor', '🦺 Торс'], ['hands', '🧤 Кисти'], ['eyes', '🥽 Глаза'],
        ['belt', '🥋 Талия'], ['feet', '👢 Ноги'], ['mainHand', '🗡️ Ведущая рука'],
        ['offHand', '🛡️ Левая рука'], ['ring_1', '💍 Слот 1'], ['ring_2', '💍 Слот 2'],
        ['ring_3', '💍 Слот 3'], ['ring_4', '💍 Слот 4'], ['ring_5', '💍 Слот 5']
    ];

    const equippedPropsList = [];
    const seenPropNames = new Set();

    allDollSlots.forEach(([slotKey, slotLabel]) => {
        const rawName = String(s[`eq_${slotKey}_Name`] || '').trim();
        if (!rawName || rawName.startsWith('🔒')) return;
        const cleanKey = norm(rawName);
        if (seenPropNames.has(cleanKey)) return;
        seenPropNames.add(cleanKey);

        const found = findInCat(PF2E_ITEMS_CATALOG, rawName)
            || findInCat(PF2E_ARMOR_CATALOG, rawName)
            || findInCat(PF2E_MELEE_WEAPONS, rawName)
            || findInCat(PF2E_RANGED_WEAPONS, rawName);

        const isInv = !!s[`eq_${slotKey}_Invested`];
        const needsInv = /настроенность|вкладываем|invested/i.test(`${found?.notes || ''} ${found?.category || ''}`);
        const inactiveNote = (needsInv && !isInv) ? ' [⚠️ Не вложено — пассивные бонусы отключены]' : '';
        const desc = found?.notes || found?.traits || 'Экипированный предмет.';

        equippedPropsList.push(`
            <div class="rich-entry">
                <div class="re-head">
                    <b class="re-title">${esc(rawName)}</b>
                    <span class="re-tag">${esc(slotLabel)}${isInv ? ' • ✨ Влож.' : ''}</span>
                </div>
                <div class="re-desc">${esc(desc)}${inactiveNote ? `<b style="color:#b91c1c;">${inactiveNote}</b>` : ''}</div>
            </div>
        `);
    });

    for (let b = 1; b <= 5; b++) {
        const bName = String(s[`beltItem${b}Name`] || '').trim();
        if (!bName) continue;
        const cleanKey = norm(bName);
        if (seenPropNames.has(cleanKey)) continue;
        seenPropNames.add(cleanKey);

        const found = findInCat(PF2E_ITEMS_CATALOG, bName);
        const desc = found?.notes || 'Расходник или инструмент быстрого доступа (1 ◆).';
        equippedPropsList.push(`
            <div class="rich-entry">
                <div class="re-head">
                    <b class="re-title">${esc(bName)}</b>
                    <span class="re-tag">⚡ Пояс #${b}</span>
                </div>
                <div class="re-desc">${esc(desc)}</div>
            </div>
        `);
    }

    const activeEquipmentSummaryHtml = equippedPropsList.length
        ? `<div class="rich-list auto-fit-list" style="flex: 1;">${equippedPropsList.join('')}</div>`
        : `<div class="empty-slot">Наденьте предметы на куклу, в кольца или на пояс, чтобы здесь автоматически отобразились их боевые и активируемые свойства.</div>`;



    const casterStatMod = Math.max(Number(s.int) || 0, Number(s.wis) || 0, Number(s.cha) || 0);
    const spellProfBonus = Math.max(0, (Number(s.spellAttack) || 0) - casterStatMod);

    const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>${esc(name)} — Бланк персонажа PF2e</title>
<style>
    @page { size: A4 portrait; margin: 4mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { margin: 0; padding: 0; font-family: "Segoe UI", Arial, sans-serif; font-size: 8pt; color: #1a1a1a; background: #fff; }
    .page { width: 202mm; height: 288mm; margin: 0 auto; page-break-after: always; display: flex; gap: 4px; overflow: hidden; background: #fff; }
    .page:last-child { page-break-after: auto; }
    .pf-sidebar { width: 23mm; background: #f4efe6; border: 1.5px solid #5e1914; border-radius: 4px; display: flex; flex-direction: column; justify-content: space-between; padding: 3px; text-align: center; flex-shrink: 0; }
    .sb-pf { font-size: 8.5pt; font-weight: 900; color: #5e1914; letter-spacing: 0.2px; }
    .sb-hdr { background: #5e1914; color: #fff; font-size: 6.5pt; font-weight: 800; padding: 1.5px 0; border-radius: 2px; margin: 2px 0; letter-spacing: 0.3px; }
    .die-row { display: flex; align-items: center; justify-content: center; gap: 4px; font-size: 7.5pt; margin: 1.5px 0; }
    .die-shape { font-size: 11pt; line-height: 1; }
    .d4 { color: #d4a017; } .d6 { color: #7f5a83; } .d8 { color: #2e8b57; } .d10 { color: #2b6cb0; } .d12 { color: #c05621; } .d20 { color: #9b2c2c; }
    .act-item { display: flex; flex-direction: column; align-items: center; font-size: 6pt; line-height: 1.1; margin: 2px 0; }
    .act-sym { font-size: 8.5pt; font-weight: 900; color: #1a1a1a; }
    .prof-tier { border-bottom: 1px solid #d6cbb8; padding: 2px 0; font-size: 5.5pt; line-height: 1.15; }
    .prof-tier b { display: block; color: #5e1914; }
    .prof-tier span { font-weight: 700; font-size: 6.5pt; }
    .sb-foot { font-size: 4.8pt; color: #555; line-height: 1.15; }
    .main-area { flex: 1; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; }
    .top-banner { display: flex; align-items: stretch; gap: 5px; margin-bottom: 4px; }
    .name-ribbon { flex: 1.4; background: #1e242b; color: #fff; border-radius: 4px; padding: 3px 7px; display: flex; flex-direction: column; justify-content: center; border-left: 4px solid #e6b84c; }
    .name-ribbon .lbl { font-size: 6pt; color: #e6b84c; font-weight: 800; text-transform: uppercase; }
    .name-ribbon .val { font-size: 11.5pt; font-weight: 900; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .meta-stack { flex: 1; display: flex; flex-direction: column; justify-content: space-between; gap: 2px; }
    .meta-line { border: 1px solid #444; border-radius: 3px; padding: 1.5px 5px; font-size: 7pt; background: #faf8f5; }
    .sheet-badge { text-align: right; display: flex; flex-direction: column; justify-content: space-between; }
    .sheet-title { font-size: 9.5pt; font-weight: 900; color: #1e242b; letter-spacing: 0.3px; }
    .lvl-row { display: flex; gap: 4px; justify-content: flex-end; }
    .lvl-box { border: 1.8px solid #5e1914; border-radius: 4px; padding: 1px 5px; text-align: center; background: #fff; }
    .lvl-box .lbl { font-size: 5.5pt; font-weight: 800; color: #5e1914; }
    .lvl-box .val { font-size: 11pt; font-weight: 900; }
    .sec { border: 1.5px solid #2b2b2b; border-radius: 4px; margin-bottom: 4px; background: #fff; display: flex; flex-direction: column; }
    .sec-hdr { background: #1e242b; color: #fff; font-weight: 800; font-size: 7pt; padding: 2px 5px; display: flex; align-items: center; gap: 4px; text-transform: uppercase; }
    .sec-hdr.red { background: #5e1914; }
    .sec-hdr.green { background: #2d4739; }
    .badge { background: #e6b84c; color: #1a1a1a; border-radius: 50%; width: 13px; height: 13px; display: inline-flex; align-items: center; justify-content: center; font-weight: 900; font-size: 7pt; flex-shrink: 0; }
    .sec-body { padding: 3px 5px; flex: 1; display: flex; flex-direction: column; }
    .row { display: flex; gap: 4px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4px; }
    .field-line { border-bottom: 1.2px solid #444; min-height: 14px; font-weight: 800; font-size: 7.8pt; padding: 0 2px; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .sub-lbl { font-size: 5.5pt; font-weight: 800; color: #5e1914; text-transform: uppercase; }
    .fit-box { border: 1px solid #cbbba0; border-radius: 3px; padding: 2px 4px; font-size: 6.8pt; line-height: 1.2; background: #fcfaf6; overflow: hidden; flex: 1; }
    .mini-feat-row { border-bottom: 1px dashed #d6cbb8; padding: 1.5px 0; line-height: 1.15; }
.mini-feat-row:last-child { border-bottom: none; padding-bottom: 0; }
.mfr-head { display: flex; align-items: baseline; gap: 3px; flex-wrap: wrap; }
.mfr-tag { font-size: 5pt; font-weight: 800; color: #3b100b; border: 0.8px solid #cbbba0; border-radius: 2px; padding: 0 2.5px; white-space: nowrap; flex-shrink: 0; }
.mfr-title { font-size: 6.3pt; color: #1e242b; }
.mfr-desc { font-size: 5.8pt; color: #333; margin-top: 0.5px; word-break: break-word; }
    .box { border: 1.5px solid #2b2b2b; border-radius: 3px; display: inline-flex; align-items: center; justify-content: center; background: #fff; font-weight: 800; }
    .box-lg { width: 34px; height: 24px; font-size: 10.5pt; border-color: #5e1914; }
    .box-sm { width: 24px; height: 16px; font-size: 8pt; }
    .box-xs { width: 19px; height: 14px; font-size: 7pt; border-width: 1px; }
    .box-sub { display: inline-flex; flex-direction: column; align-items: center; font-size: 5pt; font-weight: 800; color: #444; line-height: 1.05; }
    .bold { font-weight: 900; }
    .prof-wrap { display: inline-flex; gap: 1px; }
    .pbox { width: 11px; height: 13px; border: 1px solid #333; font-size: 6pt; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; color: #888; }
    .pbox.on { background: #5e1914; color: #fff; border-color: #5e1914; }
    .stat-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5dfd3; padding: 1.5px 0; }
    .stat-name { font-weight: 800; font-size: 7pt; }
    .skill-row { display: flex; align-items: center; gap: 2.5px; border-bottom: 1px solid #eee8dc; padding: 1px 0; }
    .skill-name { width: 74px; font-weight: 800; font-size: 6.5pt; }
    .eq, .op { font-weight: 800; font-size: 7pt; color: #555; }
    .pen-spacer { width: 29px; }
    .wpn-card { border: 1px solid #8c7b65; border-radius: 3px; padding: 2.5px 4px; margin-bottom: 3px; background: #fcfaf6; }
    .wpn-top { display: flex; justify-content: space-between; align-items: center; gap: 4px; margin-bottom: 1.5px; }
    .wpn-title { flex: 1; border-bottom: 1px solid #333; font-weight: 800; font-size: 7.5pt; }
    .wpn-sub { display: flex; justify-content: space-between; font-size: 6.6pt; color: #222; }
    .wpn-extra { font-size: 5.5pt; color: #444; line-height: 1.15; margin-top: 1.5px; border-top: 1px dashed #d6cbb8; padding-top: 1px; }
    .rich-list { display: flex; flex-direction: column; gap: 2.5px; overflow: hidden; }
    .rich-entry { border-bottom: 1px dashed #cbbba0; padding-bottom: 2px; }
    .rich-entry:last-child { border-bottom: none; padding-bottom: 0; }
    .re-head { display: flex; align-items: center; gap: 3px; line-height: 1.15; }
    .re-title { font-size: 7pt; color: #1e242b; }
    .re-tag { font-size: 6pt; background: #eee6d8; border: 1px solid #cbbba0; border-radius: 2px; padding: 0 3px; font-weight: 700; margin-left: auto; white-space: nowrap; }
    .re-qty { font-size: 6.3pt; font-weight: 800; color: #5e1914; margin-left: auto; white-space: nowrap; }
    .re-desc { font-size: 6.3pt; color: #333; line-height: 1.18; margin-top: 1px; white-space: normal; word-break: break-word; }
    .chk { width: 10px; height: 10px; border: 1px solid #333; display: inline-flex; align-items: center; justify-content: center; font-size: 6.5pt; font-weight: 900; flex-shrink: 0; }
    .chk.on { background: #2d4739; color: #fff; }
    .re-num { font-size: 6.5pt; font-weight: 800; color: #5e1914; }
    .empty-slot { font-size: 6.5pt; color: #888; font-style: italic; padding: 1px 0; }
    .tier-bar { background: #eee6d8; padding: 1.5px 4px; font-size: 6.5pt; font-weight: 800; color: #5e1914; display: flex; justify-content: space-between; border-radius: 2px; margin: 3px 0 2px 0; }
    .notes-fill { border: 1px solid #cbbba0; border-radius: 3px; padding: 3px 5px; font-size: 6.8pt; line-height: 1.22; white-space: pre-wrap; background: #fcfaf6; flex: 1; overflow: hidden; }
</style>
</head>
<body>
<div class="page">
    ${sidebarHtml(1)}
    <div class="main-area">
        <div>
            <div class="top-banner">
                <div class="name-ribbon">
                    <div class="lbl">Имя персонажа</div>
                    <div class="val">${esc(name)}</div>
                </div>
                <div class="meta-stack">
                    <div class="meta-line"><span class="sub-lbl">Игрок:</span> <b>${esc(s.playerName || '—')}</b></div>
                    <div class="meta-line"><span class="sub-lbl">Мировоззрение:</span> <b>${esc(s.alignment || '—')}</b></div>
                </div>
                <div class="sheet-badge">
                    <div class="sheet-title">БЛАНК ПЕРСОНАЖА</div>
                    <div class="lvl-row">
                        <div class="lvl-box"><div class="lbl">УРОВЕНЬ</div><div class="val">${s.level ?? 1}</div></div>
                        <div class="lvl-box"><div class="lbl">ОПЫТ</div><div class="val">${s.xp ?? 0}</div></div>
                    </div>
                </div>
            </div>




         <div class="grid-3">
             <div class="sec">
                 <div class="sec-hdr red"><span class="badge">А</span> Народ</div>
                 <div class="sec-body">
                     <div class="field-line">${esc(s.ancestry)}</div>
                     <div class="sub-lbl">Родословная и особенности народа</div>
                     <div class="fit-box auto-fit-list" style="height: 62px;">${ancestryHtml}</div>
                 </div>
             </div>
             <div class="sec">
                 <div class="sec-hdr red"><span class="badge">Б</span> Происхождение</div>
                 <div class="sec-body">
                     <div class="field-line">${esc(s.background)}</div>
                     <div class="sub-lbl">Способность и описание происхождения</div>
                     <div class="fit-box auto-fit-list" style="height: 62px;">${bgHtml}</div>
                 </div>
             </div>
             <div class="sec">
                 <div class="sec-hdr red"><span class="badge">В</span> Класс</div>
                 <div class="sec-body">
                     <div class="field-line">${esc(s.charClass)}</div>
                     <div class="sub-lbl">Классовые способности и черты</div>
                     <div class="fit-box auto-fit-list" style="height: 62px;">${classHtml}</div>
                 </div>
             </div>
         </div>



            
            
            
        </div>



        <!-- Верхний пояс: Г (Характеристики) | Д (ПЗ) + Е (Скорость) | З (Внимание) -->
        <div class="row" style="align-items: stretch;">
            <div class="sec" style="width: 33%;">
                <div class="sec-hdr"><span class="badge">Г</span> Модификаторы характеристик</div>
                <div class="sec-body" style="justify-content: space-between;">
                    <div class="stat-row"><span class="stat-name">СИЛА (СИЛ)</span><div class="box box-sm bold">${fmtMod(s.str)}</div></div>
                    <div class="stat-row"><span class="stat-name">ЛОВКОСТЬ (ЛВК)</span><div class="box box-sm bold">${fmtMod(s.dex)}</div></div>
                    <div class="stat-row"><span class="stat-name">ВЫНОСЛИВОСТЬ (ВЫН)</span><div class="box box-sm bold">${fmtMod(s.con)}</div></div>
                    <div class="stat-row"><span class="stat-name">ИНТЕЛЛЕКТ (ИНТ)</span><div class="box box-sm bold">${fmtMod(s.int)}</div></div>
                    <div class="stat-row"><span class="stat-name">МУДРОСТЬ (МДР)</span><div class="box box-sm bold">${fmtMod(s.wis)}</div></div>
                    <div class="stat-row" style="border:none;"><span class="stat-name">ХАРИЗМА (ХАР)</span><div class="box box-sm bold">${fmtMod(s.cha)}</div></div>
                </div>
            </div>

            <div style="width: 35%; display: flex; flex-direction: column;">
                <div class="sec">
                    <div class="sec-hdr red"><span class="badge">Д</span> Пункты здоровья</div>
                    <div class="sec-body" style="padding: 3px 5px; gap: 3px;">
                        <div style="display:flex; align-items:center; gap:0;">
                            <div style="position:relative; width:50px; height:44px; flex-shrink:0; z-index:2; display:flex; align-items:center; justify-content:center;">
                                <img src="${hpHeart}" alt="Максимум ПЗ" style="width:100%; height:100%; object-fit:contain;">
                                <span style="position:absolute; top:17px; left:0; right:0; text-align:center; font-size:10.5pt; font-weight:900; color:#1a1a1a;">${s.hpMax ?? 10}</span>
                            </div>
                            <div style="flex:1; margin-left:-11px; padding:2px 5px 2px 14px; border:2.2px solid #8a1c14; border-left:none; border-radius:0 5px 5px 0; background:#ffffff; text-align:center;">
                                <div style="font-size:5.2pt; font-weight:800; color:#5e1914; letter-spacing:0.3px;">ТЕКУЩИЕ</div>
                                <div style="font-size:11pt; font-weight:900; color:#1a1a1a; line-height:1.12;">${s.hpCurrent ?? 10}</div>
                            </div>
                        </div>
                        <div style="display:flex; align-items:center; justify-content:space-between; gap:3px; font-size:5.5pt; padding-top:1px;">
                            <div style="display:flex; align-items:center; gap:2px;">
                                <span style="font-weight:800; color:#5e1914;">При смерти</span>
                                <span style="width:8px; height:8px; border:1.2px solid #5e1914; border-radius:50%; display:inline-block;"></span>
                                <span style="width:8px; height:8px; border:1.2px solid #5e1914; border-radius:50%; display:inline-block;"></span>
                                <span style="width:8px; height:8px; border:1.2px solid #5e1914; border-radius:50%; display:inline-block;"></span>
                                <span style="width:8px; height:8px; border:1.2px solid #5e1914; border-radius:50%; display:inline-block;"></span>
                                <span style="font-size:7.5pt; line-height:1;">💀</span>
                            </div>
                            <div style="display:flex; align-items:center; gap:2px;">
                                <span style="font-weight:800; color:#5e1914;">Ранение</span>
                                <span class="box box-xs" style="width:16px; height:12px;">${Number(s.hpTemp) > 0 ? `+${s.hpTemp}` : ''}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="sec" style="flex: 1;">
                    <div class="sec-hdr green"><span class="badge">Е</span> Скорость</div>
                    <div class="sec-body" style="padding: 3px 5px; display:flex; flex-direction:row; align-items:center; gap:5px;">
                        <div style="position:relative; width:78px; height:35px; flex-shrink:0; display:flex; align-items:center; justify-content:center;">
                            <img src="${speedBox}" alt="Скорость" style="width:100%; height:100%; object-fit:contain;">
                            <span style="position:absolute; left:7px; right:24px; text-align:center; font-size:10.5pt; font-weight:900; color:#1a1a1a;">${s.speed ?? 25}</span>
                        </div>
                        <div style="font-size:5.3pt; line-height:1.12; color:#222;"><b>ПЕРЕМЕЩЕНИЕ ◆</b><br>Переместитесь на значение скорости.</div>
                    </div>
                </div>
            </div>

            <div class="sec" style="width: 32%;">
                <div class="sec-hdr"><span class="badge">З</span> Внимание</div>
                <div class="sec-body" style="display:flex; flex-direction:column; justify-content:space-between; gap:4px;">
                    <div style="display:flex; align-items:center; gap:2.5px;">
                        <div style="position:relative; width:40px; height:40px; flex-shrink:0;">
                            <img src="${perceptionGlass}" alt="Внимание" style="width:100%; height:100%; object-fit:contain; display:block;">
                            <span style="position:absolute; top:10px; left:10px; width:24px; text-align:center; font-size:9.5pt; font-weight:900; color:#111; line-height:1;">${fmtMod(s.perception)}</span>
                        </div>
                        <span class="eq">=</span>
                        <div class="box-sub"><div class="box box-xs" style="width:20px; height:15px;">${fmtMod(s.wis)}</div><span>МДР</span></div>
                        <span class="op">+</span>
                        <div class="box-sub"><div class="box box-xs" style="width:20px; height:15px;">${s.saveProf_perc ?? 0}</div><span>УМЕНИЕ</span></div>
                        <div style="display:flex; flex-direction:column; gap:1px; margin-left:1px;">
                            <span class="pbox ${(Number(s.saveProf_perc) || 0) >= 2 ? 'on' : ''}" style="width:10px; height:10px; font-size:5pt;">И</span>
                            <span class="pbox ${(Number(s.saveProf_perc) || 0) >= 4 ? 'on' : ''}" style="width:10px; height:10px; font-size:5pt;">Э</span>
                        </div>
                    </div>
                    <div style="flex:1; display:flex; flex-direction:column;">
                        <div class="sub-lbl" style="font-size:5.2pt; color:#1a1a1a;">ВОСПРИЯТИЕ И ПРОЧЕЕ</div>
                        <div class="fit-box" style="margin-top:2px; min-height:36px;">${esc(s.perceptionNotes || '—')}</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Нижний пояс: Ж (Навыки) слева | И (Испытания) + К (Защита) + Л (Оружие) справа -->
        <div class="row" style="flex: 1; min-height: 0;">
            <div class="sec" style="width: 44%; margin-bottom: 0;">
                <div class="sec-hdr"><span class="badge">Ж</span> Навыки</div>
                <div class="sec-body">
                    ${skillsHtml}
                    <div style="margin-top: 3px; flex: 1; display: flex; flex-direction: column;">
                        <div class="sub-lbl">Знания (Lore) и прочие навыки</div>
                        <div class="fit-box">${esc(s.skillOtherNotes)}</div>
                    </div>
                </div>
            </div>

            <div style="width: 56%; display: flex; flex-direction: column;">
                <div class="sec">
                    <div class="sec-hdr"><span class="badge">И</span> Испытания (Спасброски)</div>
                    <div class="sec-body" style="display:flex; flex-direction:row; gap:5px; align-items:stretch;">
                        <div style="flex:1.45; display:flex; flex-direction:column; justify-content:space-between; gap:2px;">
                            <div style="display:flex; align-items:center; gap:3px;">
                                <span class="stat-name" style="width:62px; font-size:6.6pt;">СТОЙКОСТЬ</span>
                                <div class="box box-sm bold" style="border:2.2px solid #8a1c14; width:28px; height:18px; font-size:8.8pt;">${fmtMod(s.fortitude)}</div>
                                <span class="eq">=</span>
                                <div class="box-sub"><div class="box box-xs">${fmtMod(s.con)}</div><span>ВЫН</span></div>
                                <span class="op">+</span>
                                <div class="box-sub"><div class="box box-xs">${s.saveProf_fort ?? 0}</div><span>УМЕНИЕ</span></div>
                                <div style="display:flex; flex-direction:column; gap:1px; margin-left:1px;">
                                    <span class="pbox ${(Number(s.saveProf_fort) || 0) >= 2 ? 'on' : ''}" style="width:11px; height:10px; font-size:5.3pt;">И</span>
                                    <span class="pbox ${(Number(s.saveProf_fort) || 0) >= 4 ? 'on' : ''}" style="width:11px; height:10px; font-size:5.3pt;">Э</span>
                                </div>
                            </div>
                            <div style="display:flex; align-items:center; gap:3px;">
                                <span class="stat-name" style="width:62px; font-size:6.6pt;">РЕАКЦИЯ</span>
                                <div class="box box-sm bold" style="border:2.2px solid #8a1c14; width:28px; height:18px; font-size:8.8pt;">${fmtMod(s.reflex)}</div>
                                <span class="eq">=</span>
                                <div class="box-sub"><div class="box box-xs">${fmtMod(s.dex)}</div><span>ЛВК</span></div>
                                <span class="op">+</span>
                                <div class="box-sub"><div class="box box-xs">${s.saveProf_ref ?? 0}</div><span>УМЕНИЕ</span></div>
                                <div style="display:flex; flex-direction:column; gap:1px; margin-left:1px;">
                                    <span class="pbox ${(Number(s.saveProf_ref) || 0) >= 2 ? 'on' : ''}" style="width:11px; height:10px; font-size:5.3pt;">И</span>
                                    <span class="pbox ${(Number(s.saveProf_ref) || 0) >= 4 ? 'on' : ''}" style="width:11px; height:10px; font-size:5.3pt;">Э</span>
                                </div>
                            </div>
                            <div style="display:flex; align-items:center; gap:3px;">
                                <span class="stat-name" style="width:62px; font-size:6.6pt;">ВОЛЯ</span>
                                <div class="box box-sm bold" style="border:2.2px solid #8a1c14; width:28px; height:18px; font-size:8.8pt;">${fmtMod(s.will)}</div>
                                <span class="eq">=</span>
                                <div class="box-sub"><div class="box box-xs">${fmtMod(s.wis)}</div><span>МДР</span></div>
                                <span class="op">+</span>
                                <div class="box-sub"><div class="box box-xs">${s.saveProf_will ?? 0}</div><span>УМЕНИЕ</span></div>
                                <div style="display:flex; flex-direction:column; gap:1px; margin-left:1px;">
                                    <span class="pbox ${(Number(s.saveProf_will) || 0) >= 2 ? 'on' : ''}" style="width:11px; height:10px; font-size:5.3pt;">И</span>
                                    <span class="pbox ${(Number(s.saveProf_will) || 0) >= 4 ? 'on' : ''}" style="width:11px; height:10px; font-size:5.3pt;">Э</span>
                                </div>
                            </div>
                        </div>
                        <div style="width:32%; border-left:1.5px solid #2b2b2b; padding-left:5px; display:flex; flex-direction:column;">
                            <div class="sub-lbl" style="font-size:5.5pt; color:#1a1a1a;">ПРОЧЕЕ</div>
                            <div class="fit-box" style="margin-top:2px; font-size:6.2pt;">${esc(s.saveNotes || '')}</div>
                        </div>
                    </div>
                </div>

                <div class="sec">
                    <div class="sec-hdr red"><span class="badge">К</span> Защита и Класс брони</div>
                    <div class="sec-body">
                        <div style="display:flex; align-items:center; gap:4px; margin-bottom:3px;">
                            <div style="position:relative; width:48px; height:52px; flex-shrink:0;">
                                <img src="${acShield}" alt="КБ" style="width:100%; height:100%; object-fit:contain; display:block;">
                                <span style="position:absolute; top:22px; left:0; right:0; text-align:center; font-size:12.5pt; font-weight:900; color:#1a1a1a;">${s.ac ?? 10}</span>
                            </div>
                            <span class="eq">= 10 +</span>
                            <div class="box-sub"><div class="box box-xs">${s.acDex ?? 0}</div><span>ЛВК</span></div>
                            <span class="op">+</span>
                            <div class="box-sub"><div class="box box-xs">${s.acProf ?? 0}</div><span>УМЕНИЕ</span></div>
                            <span class="op">+</span>
                            <div class="box-sub"><div class="box box-xs">${s.acItem ?? 0}</div><span>ПРЕДМЕТ</span></div>
                            <span class="op">+</span>
                            <div class="box-sub"><div class="box box-xs">${s.acOther ?? 0}</div><span>ПРОЧЕЕ</span></div>
                            <div style="border-left:1.5px solid #5e1914; padding-left:4px; margin-left:auto; display:flex; gap:3px; align-items:center;">
                                <div class="box-sub"><div class="box box-sm">+${s.acShieldBonus ?? 0}</div><span>ЩИТ</span></div>
                                <div class="box-sub"><div class="box box-xs">${s.acShieldHardness ?? 0}</div><span>ТВЁРД.</span></div>
                                <div class="box-sub"><div class="box box-xs">${s.acShieldHp ?? 0}</div><span>ПЗ ЩИТА</span></div>
                            </div>
                        </div>
                        <div style="font-size:6.5pt; line-height:1.15;">
                            <b>Доспех:</b> ${esc(s.armorName || 'Без брони')} (${esc(s.armorType)})
                            ${armorGroupEff ? `<br><span style="color:#2d4739;">${esc(armorGroupEff)}</span>` : ''}
                            ${armorTraitsText ? `<br><span style="color:#444; font-size:5.7pt;">${esc(armorTraitsText)}</span>` : ''}
                        </div>
                    </div>
                </div>

                <div class="sec" style="flex: 1; margin-bottom: 0;">
                    <div class="sec-hdr"><span class="badge">Л</span> Оружие и Атаки</div>
                    <div class="sec-body">
                        ${buildWeaponCardHtml('БЛИЖНИЙ БОЙ 1', s.melee1Name, s.melee1Atk, s.melee1Dmg, s.melee1Traits, false)}
                        ${buildWeaponCardHtml('БЛИЖНИЙ БОЙ 2', s.melee2Name, s.melee2Atk, s.melee2Dmg, s.melee2Traits, false)}
                        ${buildWeaponCardHtml('ДИСТАНЦИОННОЕ', s.rangedName, s.rangedAtk, s.rangedDmg, s.rangedTraits, true)}
                        <div class="fit-box" style="margin-top: 2px;"><b>Умения в оружии:</b> ${esc(s.weaponProfNotes || '—')}</div>
                    </div>
                </div>
            </div>
        </div>

        
        
        
    </div>
</div>

<div class="page">
    ${sidebarHtml(2)}
    <div class="main-area">
        <div class="row" style="flex: 1; overflow: hidden;">
            <div style="width: 53%; display: flex; flex-direction: column; overflow: hidden;">
            
                <div class="sec" style="height: 38%; overflow: hidden;">
                    <div class="sec-hdr green"><span class="badge">Н</span> Снаряжение и Деньги</div>
                    <div class="sec-body" style="overflow: hidden; min-height: 0;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px; border-bottom:1px solid #d6cbb8; padding-bottom:2px; flex-shrink: 0;">
                            <span class="sub-lbl">РЮКЗАК И ОПИСАНИЯ ПРЕДМЕТОВ</span>
                            <div style="display:flex; gap:5px; align-items:center;">
                                <span class="sub-lbl">ДЕНЬГИ:</span>
                                <div class="box-sub"><div class="box box-xs">${s.coinsCopper ?? 0}</div><span>ММ</span></div>
                                <div class="box-sub"><div class="box box-xs">${s.coinsSilver ?? 0}</div><span>СМ</span></div>
                                <div class="box-sub"><div class="box box-xs">${s.coinsGold ?? 0}</div><span>ЗМ</span></div>
                            </div>
                        </div>
                        <div class="rich-list auto-fit-list" style="flex: 1; min-height: 0;">${buildRichItems()}</div>
                    </div>
                </div>

                

                <div class="sec" style="flex: 1; margin-bottom: 0; overflow: hidden;">
                    <div class="sec-hdr red"><span class="badge">О</span> Сотворение заклинаний (с описаниями)</div>
                    <div class="sec-body" style="overflow: hidden;">
                    
                    
                        <div style="border-bottom:1.5px solid #5e1914; padding-bottom:3px; margin-bottom:2px; display:flex; flex-direction:column; gap:3px; flex-shrink:0;">
                            <div style="display:flex; align-items:center; gap:3px;">
                                <span style="width:92px; font-size:5.8pt; font-weight:800; line-height:1.1; color:#1a1a1a;">ПРОВЕРКА АТАКИ<br>ЗАКЛИНАНИЕМ</span>
                                <div style="position:relative; width:36px; height:26px; flex-shrink:0;">
                                    <img src="${spellOctBadge}" alt="Атака закл." style="width:100%; height:100%; object-fit:contain; display:block;">
                                    <span style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:9pt; font-weight:900; color:#111;">${fmtMod(s.spellAttack)}</span>
                                </div>
                                <span class="eq" style="width:28px; text-align:center; flex-shrink:0;">=</span>
                                <div class="box-sub"><div class="box box-xs" style="width:26px;">${fmtMod(casterStatMod)}</div><span>ИНТ/МДР/ХАР</span></div>
                                <span class="op">+</span>
                                <div class="box-sub"><div class="box box-xs" style="width:24px;">${spellProfBonus}</div><span>УМЕНИЕ</span></div>
                                <span class="pbox ${spellProfBonus >= 2 ? 'on' : ''}" style="margin-bottom:6px;">И</span>
                                <div style="margin-left:auto; display:flex; align-items:center; gap:2px;">
                                    <span class="sub-lbl">ФП:</span>
                                    <div class="box box-xs" style="width:26px;">${s.focusCurrent ?? 1}/${s.focusMax ?? 1}</div>
                                </div>
                            </div>
                            <div style="display:flex; align-items:center; gap:3px;">
                                <span style="width:92px; font-size:5.8pt; font-weight:800; line-height:1.1; color:#1a1a1a;">СЛ ЗАКЛИНАНИЙ</span>
                                <div style="position:relative; width:36px; height:26px; flex-shrink:0;">
                                    <img src="${spellOctBadge}" alt="СЛ закл." style="width:100%; height:100%; object-fit:contain; display:block;">
                                    <span style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:9pt; font-weight:900; color:#111;">${s.spellDc ?? 10}</span>
                                </div>
                                <span class="eq" style="width:28px; text-align:center; flex-shrink:0; font-size:6.5pt;">= 10 +</span>
                                <div class="box-sub"><div class="box box-xs" style="width:26px;">${fmtMod(casterStatMod)}</div><span>ИНТ/МДР/ХАР</span></div>
                                <span class="op">+</span>
                                <div class="box-sub"><div class="box box-xs" style="width:24px;">${spellProfBonus}</div><span>УМЕНИЕ</span></div>
                                <span class="pbox ${spellProfBonus >= 2 ? 'on' : ''}" style="margin-bottom:6px;">И</span>
                            </div>
                        </div>

                        


                        <div class="rich-list auto-fit-list" style="flex: 1;">
                            <div class="tier-bar"><span>✨ ФОКУСЫ</span><span>В ДЕНЬ: ${s.cantripsPerDay ?? 5}</span></div>
                            ${buildRichSpells('cantrip', 5, PF2E_CANTRIPS, false)}

                            <div class="tier-bar"><span>💠 ФОКАЛЬНЫЕ ЗАКЛИНАНИЯ</span><span>ПОДГ.</span></div>
                            ${buildRichSpells('focusSpell', 3, PF2E_FOCUS_SPELLS, true)}

                            <div class="tier-bar"><span>1️⃣ ЗАКЛИНАНИЯ 1 КРУГА</span><span>ЯЧЕЕК: ${s.lvl1PerDay ?? 0}</span></div>
                            ${buildRichSpells('lvl1Spell', 7, PF2E_SPELLS_LVL1, false)}

                            <div class="tier-bar"><span>2️⃣ ЗАКЛИНАНИЯ 2 КРУГА</span><span>ЯЧЕЕК: ${s.lvl2PerDay ?? 0}</span></div>
                            ${buildRichSpells('lvl2Spell', 5, PF2E_SPELLS_LVL2, true)}
                            
                            <div class="tier-bar"><span>3️⃣ ЗАКЛИНАНИЯ 3 КРУГА</span><span>ЯЧЕЕК: ${s.lvl3PerDay ?? 0}</span></div>
                            ${buildRichSpells('lvl3Spell', 5, PF2E_SPELLS_LVL3, true)}
                            
                            <div class="tier-bar"><span>4️⃣ ЗАКЛИНАНИЯ 4 КРУГА</span><span>ЯЧЕЕК: ${s.lvl4PerDay ?? 0}</span></div>
                            ${buildRichSpells('lvl4Spell', 5, PF2E_SPELLS_LVL4, true)}

                        </div>
                    </div>
                </div>
            </div>


            <div style="width: 47%; display: flex; flex-direction: column; overflow: hidden;">
                <div class="sec" style="height: 25%;">
                    <div class="sec-hdr green"><span class="badge">П</span> Портрет персонажа</div>
                    <div class="sec-body" style="padding: 3px; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #141920;">
                        ${portraitUrl ? `
                            <img src="${portraitUrl}" alt="${esc(name)}" style="height: 100%; aspect-ratio: 1 / 1; max-width: 100%; object-fit: cover; border: 1.5px solid #e6b84c; border-radius: 4px; background: radial-gradient(circle, #2a3441 0%, #141920 100%);">
                        ` : `
                            <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #7f8c8d; font-size: 7pt;">Нет портрета</div>
                        `}
                    </div>
                </div>

                ${hasComp ? `
                <div class="sec" style="height: 19%;">
                    <div class="sec-hdr green"><span class="badge">🐾</span> Спутник (${esc(compTypeName)})</div>
                    <div class="sec-body" style="overflow: hidden;">
                        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #d6cbb8; padding-bottom:2px; margin-bottom:2px;">
                            <b style="font-size:7.3pt; color:#2d4739;">${esc(s.compName || compTypeName)}</b>
                            <span style="font-size:6.3pt; font-weight:800;">ПЗ: ${s.compHpCur ?? 0}/${s.compHpMax ?? 0} | КБ: ${s.compAc ?? 10} | ${s.compSpeed ?? 25} фт.</span>
                        </div>
                        <div class="notes-fill auto-fit-text">${esc(s.compAbilitiesText || 'Способности спутника не указаны.')}</div>
                    </div>
                </div>
                ` : ''}

                <div class="sec" style="flex: 1.25; min-height: 0;">
                    <div class="sec-hdr"><span class="badge">С</span> Заметки и Нагрузка</div>
                    <div class="sec-body" style="overflow: hidden;">
                        <div class="notes-fill auto-fit-text">${esc(notesWithBulk)}</div>
                    </div>
                </div>

                <div class="sec" style="flex: 0.95; min-height: 0;">
                    <div class="sec-hdr"><span class="badge">Р</span> Журнал приключений</div>
                    <div class="sec-body" style="overflow: hidden;">
                        <div class="notes-fill auto-fit-text">${esc(s.adventureLogText || '')}</div>
                    </div>
                </div>

                <div class="sec" style="flex: 1.05; min-height: 0; margin-bottom: 0;">
                    <div class="sec-hdr"><span class="badge">Т</span> Книга заклинаний и формул</div>
                    <div class="sec-body" style="overflow: hidden;">
                        <div class="notes-fill auto-fit-text">${esc(s.spellbookText || '')}</div>
                    </div>
                </div>
            </div>

            
        </div>
    </div>
</div>


<div class="page">
    ${sidebarHtml(3)}
    <div class="main-area" style="justify-content: flex-start; gap: 5px;">
        <div>
            <div class="top-banner">
                <div class="name-ribbon">
                    <div class="lbl">Экипировка и Кукла персонажа</div>
                    <div class="val">${esc(name)}</div>
                </div>
                <div class="lvl-row">
                    <div class="lvl-box">
                        <div class="lbl">ВЛОЖЕНО СЕГОДНЯ</div>
                        <div class="val">${investedUsed} / 10</div>
                    </div>
                    <div class="lvl-box">
                        <div class="lbl">ПОЯС (МАССА)</div>
                        <div class="val">до 2.0</div>
                    </div>
                </div>
            </div>

            <div class="sec">
                <div class="sec-hdr red"><span class="badge">У</span> Экипировка на теле (Кукла героя)</div>
                <div class="sec-body">
                    <div style="display:grid; grid-template-columns: 1fr 44mm 1fr; gap:6px; align-items:center;">
                        <div>
                            ${renderPdfBodySlot('head', '👑', 'Голова (Шлем/Диадема)')}
                            ${renderPdfBodySlot('cloak', '🧥', 'Плечи (Плащ)')}
                            ${renderPdfBodySlot('hands', '🧤', 'Кисти (Перчатки/Наручи)')}
                            ${renderPdfBodySlot('belt', '🥋', 'Талия (Пояс)')}
                        </div>

                        <div style="height:54mm; border:2px solid #5e1914; border-radius:6px; background:#141920; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                            ${portraitUrl
        ? `<img src="${portraitUrl}" alt="${esc(name)}" style="width:100%; height:100%; object-fit:cover;">`
        : `<span style="color:#888; font-size:7pt;">Нет портрета</span>`
    }
                        </div>

                        <div>
                            ${renderPdfBodySlot('neck', '📿', 'Шея (Амулет/Кулон)')}
                            ${renderPdfBodySlot('armor', '🦺', 'Торс (Доспех/Роба)')}
                            ${renderPdfBodySlot('eyes', '🥽', 'Глаза (Очки/Маска)')}
                            ${renderPdfBodySlot('feet', '👢', 'Ноги (Сапоги)')}
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:6px; margin-top:4px; padding-top:4px; border-top:1px dashed #cbbba0;">
                        ${renderPdfBodySlot('mainHand', '🗡️', 'Правая / Ведущая рука')}
                        ${renderPdfBodySlot('offHand', '🛡️', 'Левая рука (Щит / Второе / Жезл)')}
                    </div>
                </div>
            </div>
        </div>

        <div class="sec" style="margin-bottom: 0;">
            <div class="sec-hdr green"><span class="badge">Ф</span> Пояс и перевязи (Быстрый доступ за 1 ◆ — лимит 2.0 Массы)</div>
            <div class="sec-body">
                <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap:4px;">
                    ${beltPdfHtml}
                </div>
            </div>
        </div>

        <div class="row" style="align-items: stretch; margin-bottom: 0;">
            <div class="sec" style="width: 54%; margin-bottom: 0;">
                <div class="sec-hdr"><span class="badge">Х</span> Кольца, Эонские камни и Татуировки (Вкладываемые)</div>
                <div class="sec-body" style="justify-content: flex-start; gap: 5px;">
                    <div>${ringsHtml}</div>
                    <div style="font-size:5.9pt; color:#444; background:#f4efe6; padding:3px 5px; border-radius:3px; border:1px solid #cbbba0; line-height:1.22;">
                        <b>Правило вложения (Invested):</b> максимум <b>10</b> магических предметов в день. При снятии вложенного предмета его магия отключается, но потраченный дневной лимит возвращается только после утренней <b>Ежедневной подготовки</b>.
                    </div>
                </div>
            </div>

            <div class="sec" style="width: 46%; margin-bottom: 0;">
                <div class="sec-hdr green"><span class="badge">Ц</span> Памятка по ношению и нагрузке PF2e</div>
                <div class="sec-body" style="font-size:6.2pt; line-height:1.25; color:#222; justify-content: flex-start; gap: 4px;">
                    <div><b>• Две руки (Held):</b> можно держать либо двуручное оружие, либо одноручное и щит/жезл. Взять предмет с пояса — <b>1 ◆ Взаимодействие</b>.</div>
                    <div><b>• Пояс и перевязи:</b> вмещают до <b>2.0 Массы</b> зелий, свитков, бомб или наборов инструментов для быстрого доступа в бою.</div>
                    <div><b>• Походный рюкзак:</b> вмещает до <b>4.0 Массы</b>, причём первые <b>2.0 Массы</b> не учитываются в общей перегрузке героя (достать вещь в бою — ◆◆).</div>
                    <div style="margin-top: auto; border-top:1px dashed #cbbba0; padding-top:3px; font-weight:800; color:#5e1914;">
                        Итоговая нагрузка: ${esc(bulkStr)} / ${bulkInfo.encumberedLimit} (Макс. ${bulkInfo.maxLimit})
                    </div>
                </div>
            </div>
        </div>

        <div class="sec" style="flex: 1; margin-bottom: 0; overflow: hidden;">
            <div class="sec-hdr red"><span class="badge">Ч</span> Активные свойства надетой экипировки и пояса</div>
            <div class="sec-body" style="justify-content: flex-start; overflow: hidden;">
                ${activeEquipmentSummaryHtml}
            </div>
        </div>
    </div>
</div>



<script>
    window.onload = function() {
        document.querySelectorAll('.auto-fit-list, .auto-fit-text, .fit-box').forEach(function(box) {
            var size = parseFloat(window.getComputedStyle(box).fontSize) || 6.5;
            while (box.scrollHeight > box.clientHeight + 1 && size > 3.6) {
                size -= 0.2;
                box.style.fontSize = size + 'pt';
                box.querySelectorAll('.re-title, .re-desc, .re-tag, .re-qty, .mfr-title, .mfr-desc, .mfr-tag').forEach(function(el) {
                    el.style.fontSize = size + 'pt';
                });
            }
        });
        setTimeout(function() { window.print(); }, 300);
    };
</script>
</body>
</html>`;

    const printWin = window.open('', '_blank', 'width=920,height=1120');
    if (!printWin) {
        alert('Разрешите всплывающие окна для экспорта бланка в PDF.');
        return;
    }
    printWin.document.open();
    printWin.document.write(html);
    printWin.document.close();
}
