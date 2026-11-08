/**
 * ИЗОЛИРОВАННЫЙ ПРОЦЕДУРНЫЙ 3D LOW-POLY ДВИЖОК ТОКЕНОВ ДЛЯ КАРТЫ KINGMAKER
 */
const ThreeDTokenEngine = {
    /**
     * Возвращает компоненты цвета материала на основе интенсивности света по Ламберту
     */
    _getMaterialColors(intensity, isFlag = false) {
        const tokenColorMaterial = window.CURRENT_SQUAD_TOKEN_COLOR || 'gold';
        let r = 0, g = 0, b = 0;
        let strokeColor = "rgba(255, 242, 195, 0.4)";

        if (tokenColorMaterial === 'ruby') {
            r = isFlag ? 235 : Math.floor(180 + 75 * intensity);
            g = isFlag ? 40 : Math.floor(30 + 25 * intensity);
            b = isFlag ? 40 : Math.floor(30 + 25 * intensity);
            strokeColor = isFlag ? "rgba(255,255,255,0.4)" : "rgba(255, 190, 190, 0.35)";
        } else if (tokenColorMaterial === 'emerald') {
            r = isFlag ? 40 : Math.floor(30 + 25 * intensity);
            g = isFlag ? 220 : Math.floor(160 + 80 * intensity);
            b = isFlag ? 65 : Math.floor(60 + 35 * intensity);
            strokeColor = isFlag ? "rgba(255,255,255,0.4)" : "rgba(190, 255, 190, 0.35)";
        } else if (tokenColorMaterial === 'obsidian') {
            r = isFlag ? 25 : Math.floor(35 + 30 * intensity);
            g = isFlag ? 30 : Math.floor(45 + 35 * intensity);
            b = Math.floor(55 + 45 * intensity);
            strokeColor = isFlag ? "rgba(255,255,255,0.2)" : "rgba(200, 220, 255, 0.2)";
        } else if (tokenColorMaterial === 'bone') {
            r = isFlag ? 240 : Math.floor(210 + 45 * intensity);
            g = isFlag ? 235 : Math.floor(215 + 40 * intensity);
            b = Math.floor(200 + 40 * intensity);
            strokeColor = isFlag ? "rgba(100,100,100,0.3)" : "rgba(150, 140, 120, 0.25)";
        } else {
            r = isFlag ? 192 : Math.floor(205 + 50 * intensity);
            g = isFlag ? 41 : Math.floor(160 + 45 * intensity);
            b = Math.floor(55 + 25 * intensity);
            strokeColor = isFlag ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 242, 195, 0.4)";
        }
        return { r, g, b, strokeColor };
    },

    /**
     * Бесконечно катящийся кубик D20 с фиксом двойной трансформации вершины p2
     */
    draw3DDiceToken(ctx, cx, cy) {
        ctx.save();
        ctx.translate(cx, cy - 2);

        const time = Date.now() / 1000;
        const bounceY = Math.sin(time * 2.2) * 1.5;
        ctx.translate(0, bounceY);

        const cX = time * 1.2; const cY = time * 1.5; const cZ = time * 0.8;
        const lightDir = { x: 0.5, y: -0.8, z: 0.4 };
        const lLength = Math.sqrt(lightDir.x*lightDir.x + lightDir.y*lightDir.y + lightDir.z*lightDir.z);
        const lNorm = { x: lightDir.x/lLength, y: lightDir.y/lLength, z: lightDir.z/lLength };

        const t = (1.0 + Math.sqrt(5.0)) / 2.0;
        const vertices = [
            {x: -1, y: t, z: 0}, {x: 1, y: t, z: 0}, {x: -1, y: -t, z: 0}, {x: 1, y: -t, z: 0},
            {x: 0, y: -1, z: t}, {x: 0, y: 1, z: t}, {x: 0, y: -1, z: -t}, {x: 0, y: 1, z: -t},
            {x: t, y: 0, z: -1}, {x: t, y: 0, z: 1}, {x: -t, y: 0, z: -1}, {x: -t, y: 0, z: 1}
        ].map(v => {
            const l = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
            return { x: v.x/l * 36, y: v.y/l * 36, z: v.z/l * 36 };
        });

        const polygons = [];
        const processFace = (i0, i1, i2) => {
            const transform = (v) => {
                let y1 = v.y * Math.cos(cX) - v.z * Math.sin(cX);
                let z1 = v.y * Math.sin(cX) + v.z * Math.cos(cX);
                let x2 = v.x * Math.cos(cY) + z1 * Math.sin(cY);
                let z2 = -v.x * Math.sin(cY) + z1 * Math.cos(cY);
                let x3 = x2 * Math.cos(cZ) - y1 * Math.sin(cZ);
                let y3 = x2 * Math.sin(cZ) + y1 * Math.cos(cZ);
                return { x: x3, y: y3, z: z2 };
            };

            const p0 = transform(vertices[i0]);
            const p1 = transform(vertices[i1]);
            const p2 = transform(vertices[i2]);

            const ax = vertices[i1].x - vertices[i0].x;
            const ay = vertices[i1].y - vertices[i0].y;
            const az = vertices[i1].z - vertices[i0].z;
            const bx = vertices[i2].x - vertices[i0].x;
            const by = vertices[i2].y - vertices[i0].y;
            const bz = vertices[i2].z - vertices[i0].z;

            let nx = ay*bz - az*by; let ny = az*bx - ax*bz; let nz = ax*by - ay*bx;
            const nLen = Math.sqrt(nx*nx + ny*ny + nz*nz);
            if (nLen > 0) { nx /= nLen; ny /= nLen; nz /= nLen; }

            let rny1 = ny*Math.cos(cX) - nz*Math.sin(cX);
            let rnz1 = ny*Math.sin(cX) + nz*Math.cos(cX);
            let rnx2 = nx*Math.cos(cY) + rnz1*Math.sin(cY);
            let rnx3 = rnx2*Math.cos(cZ) - rny1*Math.sin(cZ);
            let rny3 = rnx2*Math.sin(cZ) + rny1*Math.cos(cZ);

            polygons.push({ p0, p1, p2, normal: { x: rnx3, y: rny3, z: rnz1 }, z: (p0.z + p1.z + p2.z) / 3 });
        };

        processFace(0, 11, 5); processFace(0, 5, 1);  processFace(0, 1, 7);  processFace(0, 7, 10); processFace(0, 10, 11);
        processFace(1, 5, 9);  processFace(5, 11, 4); processFace(11, 10, 2); processFace(10, 7, 6);  processFace(7, 1, 8);
        processFace(3, 9, 4);  processFace(3, 4, 2);  processFace(3, 2, 6);  processFace(3, 6, 8);  processFace(3, 8, 9);
        processFace(4, 9, 5);  processFace(2, 4, 11); processFace(6, 2, 10); processFace(8, 6, 7);  processFace(9, 8, 1);

        polygons.sort((a, b) => a.z - b.z);
        polygons.forEach(poly => {
            if ((poly.p1.x - poly.p0.x) * (poly.p2.y - poly.p0.y) - (poly.p1.y - poly.p0.y) * (poly.p2.x - poly.p0.x) > 0) {
                const n = poly.normal; const dot = n.x*lNorm.x + n.y*lNorm.y + n.z*lNorm.z;
                const brightness = Math.max(0.24, Math.abs(dot));
                ctx.beginPath(); ctx.moveTo(poly.p0.x, poly.p0.y); ctx.lineTo(poly.p1.x, poly.p1.y); ctx.lineTo(poly.p2.x, poly.p2.y); ctx.closePath();
                const mat = this._getMaterialColors(brightness);
                ctx.fillStyle = `rgb(${Math.min(255, mat.r)}, ${Math.min(255, mat.g)}, ${Math.min(255, mat.b)})`; ctx.fill();
                ctx.strokeStyle = mat.strokeColor; ctx.lineWidth = 0.6; ctx.stroke();
            }
        });
        ctx.restore();
    },
    /**
     * Процедурный 3D low-poly движок шахматного Ферзя из граней
     */
    draw3DQueenToken(ctx, cx, cy) {
        ctx.save();
        ctx.translate(cx, cy - 6);

        const time = Date.now() / 1000;
        const bounceY = Math.sin(time * 2.2) * 1.8;
        const angleY = time * 0.45;
        ctx.translate(0, bounceY);

        const lightDir = [0.5, -0.8, 0.4];
        const lLength = Math.sqrt(lightDir[0]*lightDir[0] + lightDir[1]*lightDir[1] + lightDir[2]*lightDir[2]);
        const lNorm = [lightDir[0]/lLength, lightDir[1]/lLength, lightDir[2]/lLength];

        const vertices = [];
        const segments = 10;
        const profile = [, [13, 20], [11, 14], [7, 0], [6, -6],
            [8, -11], [5, -14], [8, -20], [11, -26], [0, -32]
        ];

        for (let j = 0; j < profile.length; j++) {
            const radius = profile[j][0]; const h = profile[j][1];
            for (let i = 0; i < segments; i++) {
                const ang = (Math.PI * 2 / segments) * i;
                if (j === profile.length - 1) vertices.push([0, h, 0]);
                else vertices.push([Math.cos(ang) * radius, h, Math.sin(ang) * radius]);
            }
        }

        const faces = [];
        for (let j = 0; j < profile.length - 1; j++) {
            const layerOffset = j * segments; const nextLayerOffset = (j + 1) * segments;
            for (let i = 0; i < segments; i++) {
                const next = (i + 1) % segments;
                if (j === 8) {
                    if (i % 2 === 0) faces.push([layerOffset + i, layerOffset + next, nextLayerOffset + next]);
                } else if (j === profile.length - 2) {
                    faces.push([layerOffset + i, layerOffset + next, nextLayerOffset + i]);
                } else {
                    faces.push([layerOffset + i, layerOffset + next, nextLayerOffset + next, nextLayerOffset + i]);
                }
            }
        }

        const projected = vertices.map(v => {
            const rotX = v[0] * Math.cos(angleY) + v[2] * Math.sin(angleY);
            const rotZ = -v[0] * Math.sin(angleY) + v[2] * Math.cos(angleY);
            return [rotX, v[1], rotZ];
        });

        const renderOrder = faces.map((f, idx) => {
            let zSum = 0;
            for (let vIdx of f) zSum += projected[vIdx][2];
            return { face: f, z: zSum / f.length, origIdx: idx };
        }).sort((a, b) => a.z - b.z);

        renderOrder.forEach(item => {
            const f = item.face;
            const p0 = vertices[f[0]], p1 = vertices[f[1]], p2 = vertices[f[2]];
            const ax = p1[0] - p0[0], ay = p1[1] - p0[1], az = p1[2] - p0[2];
            const bx = p2[0] - p0[0], by = p2[1] - p0[1], bz = p2[2] - p0[2];

            let nx = ay * bz - az * by; let ny = az * bx - ax * bz; let nz = ax * by - ay * bx;
            const nLen = Math.sqrt(nx*nx + ny*ny + nz*nz);

            if (nLen > 0) {
                nx /= nLen; ny /= nLen; nz /= nLen;
                const rNx = nx * Math.cos(angleY) + nz * Math.sin(angleY);
                const rNz = -nx * Math.sin(angleY) + nz * Math.cos(angleY);
                const dot = rNx * lNorm[0] + ny * lNorm[1] + rNz * lNorm[2];
                const intensity = Math.max(0.24, dot);

                ctx.beginPath(); ctx.moveTo(projected[f[0]][0], projected[f[0]][1]);
                for (let i = 1; i < f.length; i++) { ctx.lineTo(projected[f[i]][0], projected[f[i]][1]); }
                ctx.closePath();

                const mat = this._getMaterialColors(intensity);
                ctx.fillStyle = `rgb(${mat.r}, ${mat.g}, ${mat.b})`; ctx.fill();
                ctx.strokeStyle = mat.strokeColor; ctx.lineWidth = 0.8; ctx.stroke();
            }
        });
        ctx.restore();
    },

    /**
     * Монументальная 3D low-poly Ладья с уширенной подошвой
     */
    draw3DRookToken(ctx, cx, cy) {
        ctx.save();
        ctx.translate(cx, cy - 6);

        const time = Date.now() / 1000;
        const bounceY = Math.sin(time * 2.2) * 1.8;
        const angleY = time * 0.45;
        ctx.translate(0, bounceY);

        const lightDir = [0.5, -0.8, 0.4];
        const lLength = Math.sqrt(lightDir[0]*lightDir[0] + lightDir[1]*lightDir[1] + lightDir[2]*lightDir[2]);
        const lNorm = [lightDir[0]/lLength, lightDir[1]/lLength, lightDir[2]/lLength];

        const vertices = [];
        const segments = 12;
        const profile = [, [16, 21], [12, 16], [8, -2], [9, -12],
            [12, -16], [15, -24], [15, -24], [16, -34], [11, -24]
        ];

        for (let j = 0; j < profile.length; j++) {
            const radius = profile[j][0]; const h = profile[j][1];
            for (let i = 0; i < segments; i++) {
                const ang = (Math.PI * 2 / segments) * i;
                vertices.push([Math.cos(ang) * radius, h, Math.sin(ang) * radius]);
            }
        }

        const faces = [];
        for (let j = 0; j < profile.length - 1; j++) {
            const layerOffset = j * segments; const nextLayerOffset = (j + 1) * segments;
            for (let i = 0; i < segments; i++) {
                const next = (i + 1) % segments;
                if (j === 7 || j === 8) {
                    if (i % 3 === 0 || i % 3 === 1) faces.push([layerOffset + i, layerOffset + next, nextLayerOffset + next, nextLayerOffset + i]);
                } else {
                    faces.push([layerOffset + i, layerOffset + next, nextLayerOffset + next, nextLayerOffset + i]);
                }
            }
        }

        const projected = vertices.map(v => {
            const rotX = v[0] * Math.cos(angleY) + v[2] * Math.sin(angleY);
            const rotZ = -v[0] * Math.sin(angleY) + v[2] * Math.cos(angleY);
            return [rotX, v[1], rotZ];
        });

        const renderOrder = faces.map((f, idx) => {
            let zSum = 0;
            for (let vIdx of f) zSum += projected[vIdx][2];
            return { face: f, z: zSum / f.length, origIdx: idx };
        }).sort((a, b) => a.z - b.z);

        renderOrder.forEach(item => {
            const f = item.face;
            const p0 = vertices[f[0]], p1 = vertices[f[1]], p2 = vertices[f[2]];
            const ax = p1[0] - p0[0], ay = p1[1] - p0[1], az = p1[2] - p0[2];
            const bx = p2[0] - p0[0], by = p2[1] - p0[1], bz = p2[2] - p0[2];

            let nx = ay * bz - az * by; let ny = az * bx - ax * bz; let nz = ax * by - ay * bx;
            const nLen = Math.sqrt(nx*nx + ny*ny + nz*nz);

            if (nLen > 0) {
                nx /= nLen; ny /= nLen; nz /= nLen;
                const rNx = nx * Math.cos(angleY) + nz * Math.sin(angleY);
                const rNz = -nx * Math.sin(angleY) + nz * Math.cos(angleY);
                const dot = rNx * lNorm[0] + ny * lNorm[1] + rNz * lNorm[2];
                const intensity = Math.max(0.24, dot);

                ctx.beginPath(); ctx.moveTo(projected[f[0]][0], projected[f[0]][1]);
                for (let i = 1; i < f.length; i++) { ctx.lineTo(projected[f[i]][0], projected[f[i]][1]); }
                ctx.closePath();

                const mat = this._getMaterialColors(intensity);
                ctx.fillStyle = `rgb(${mat.r}, ${mat.g}, ${mat.b})`; ctx.fill();
                ctx.strokeStyle = mat.strokeColor; ctx.lineWidth = 0.8; ctx.stroke();
            }
        });
        ctx.restore();
    },
    /**
     * Архитектура Цитадели (Полный рендер 360 градусов с защитой от рентген-эффекта)
     */
    draw3DCastleToken(ctx, cx, cy) {
        ctx.save();
        ctx.translate(cx, cy + 18);

        const time = Date.now() / 1000;
        const bounceY = Math.sin(time * 2.2) * 1.5;
        const angleY = time * 0.5;
        ctx.translate(0, bounceY);

        const lightDir = { x: 0.5, y: -0.8, z: 0.4 };
        const lLength = Math.sqrt(lightDir.x*lightDir.x + lightDir.y*lightDir.y + lightDir.z*lightDir.z);
        const lNorm = { x: lightDir.x/lLength, y: lightDir.y/lLength, z: lightDir.z/lLength };

        const polygons = [];
        const addBlock = (bx, by, bz, w, h, d, type, zWeight = 0) => {
            const halfW = w * 0.5; const halfH = h * 0.5; const halfD = d * 0.5;
            const meshData = {
                v0: { x: -halfW, y: -halfH, z: -halfD }, v1: { x: halfW,  y: -halfH, z: -halfD },
                v2: { x: halfW,  y: h/2,    z: -halfD }, v3: { x: -halfW, y: h/2,    z: -halfD },
                v4: { x: -halfW, y: -halfH, z: halfD },  v5: { x: halfW,  y: -halfH, z: halfD },
                v6: { x: halfW,  y: h/2,    z: halfD },  v7: { x: -halfW, y: h/2,    z: halfD }
            };

            const processFace = (i0, i1, i2, i3, nx, ny, nz) => {
                const getVert = (idx) => meshData["v" + idx];
                const rawFace = { v0: getVert(i0), v1: getVert(i1), v2: getVert(i2), v3: getVert(i3) };
                const transform = (v) => {
                    const lx = v.x + bx; const ly = v.y + by; const lz = v.z + bz;
                    const rx = lx * Math.cos(angleY) + lz * Math.sin(angleY);
                    const rz = -lx * Math.sin(angleY) + lz * Math.cos(angleY);
                    return { x: rx, y: ly, z: rz };
                };
                const p0 = transform(rawFace.v0); const p1 = transform(rawFace.v1);
                const p2 = transform(rawFace.v2); const p3 = transform(rawFace.v3);
                const rnx = nx * Math.cos(angleY) + nz * Math.sin(angleY);
                const rnz = -nx * Math.sin(angleY) + nz * Math.cos(angleY);
                const bias = type.endsWith('tooth') ? 1.5 : 0;
                polygons.push({ p0, p1, p2, p3, normal: { x: rnx, y: ny, z: rnz }, z: ((p0.z + p1.z + p2.z + p3.z) / 4) - zWeight - bias, type });
            };

            processFace(0, 1, 2, 3, 0, 0, -1); processFace(1, 5, 6, 2, 1, 0, 0);
            processFace(4, 0, 3, 7, -1, 0, 0); processFace(5, 4, 7, 6, 0, 0, 1);
            processFace(3, 2, 6, 7, 0, -1, 0); processFace(4, 5, 1, 0, 0, 1, 0);
        };

        const dist = 18;
        const towerOffsets = { p0: -dist, p1: dist };
        const buildTower = (tx, tz) => {
            addBlock(tx, 14, tz, 10, 6, 10, 'tower_base', 0); addBlock(tx, 0, tz, 8, 22, 8, 'tower_body', 0);
            addBlock(tx, -13, tz, 10, 4, 10, 'tower_crown', 0);
            addBlock(tx - 4.5, -16.5, tz - 4.5, 3, 3, 3, 'tower_tooth', 0.5); addBlock(tx + 4.5, -16.5, tz - 4.5, 3, 3, 3, 'tower_tooth', 0.5);
            addBlock(tx + 4.5, -16.5, tz + 4.5, 3, 3, 3, 'tower_tooth', 0.5); addBlock(tx - 4.5, -16.5, tz + 4.5, 3, 3, 3, 'tower_tooth', 0.5);
        };
        buildTower(towerOffsets.p0, towerOffsets.p0); buildTower(towerOffsets.p1, towerOffsets.p0);
        buildTower(towerOffsets.p1, towerOffsets.p1); buildTower(towerOffsets.p0, towerOffsets.p1);

        const wallLen = dist * 2 - 6;
        addBlock(0, 7, -dist, wallLen, 18, 3, 'wall', 0); addBlock(0, 7,  dist, wallLen, 18, 3, 'wall', 0);
        addBlock(-dist, 7, 0, 3, 18, wallLen, 'wall', 0); addBlock(dist,  7, 0, 3, 18, wallLen, 'wall', 0);

        for (let x = -8; x <= 8; x += 8) {
            addBlock(x, -3, -dist, 3, 2, 3, 'wall_tooth', 0.3); addBlock(x, -3,  dist, 3, 2, 3, 'wall_tooth', 0.3);
        }
        for (let z = -8; z <= 8; z += 8) {
            addBlock(-dist, -3, z, 3, 2, 3, 'wall_tooth', 0.3); addBlock(dist,  -3, z, 3, 2, 3, 'wall_tooth', 0.3);
        }

        const cx5 = 0, cz5 = 0;
        addBlock(cx5, 14, cz5, 15, 6, 15, 'donjon_base', 0); addBlock(cx5, -11, cz5, 13, 44, 13, 'donjon_body', 0);
        addBlock(cx5, -35, cz5, 15, 4, 15, 'donjon_crown', 0);
        addBlock(cx5 - 7.0, -39.0, cz5 - 7.0, 4, 4, 4, 'donjon_tooth', 0.8); addBlock(cx5 + 7.0, -39.0, cz5 - 7.0, 4, 4, 4, 'donjon_tooth', 0.8);
        addBlock(cx5 + 7.0, -39.0, cz5 + 7.0, 4, 4, 4, 'donjon_tooth', 0.8); addBlock(cx5 - 7.0, -39.0, cz5 + 7.0, 4, 4, 4, 'donjon_tooth', 0.8);

        const roofBottomY = -37; const roofTopY = -49; const rw = 12; const halfRw = rw * 0.5;
        const roofVerts = {
            v0: { x: -halfRw, y: roofBottomY, z: -halfRw }, v1: { x: halfRw,  y: roofBottomY, z: -halfRw },
            v2: { x: halfRw,  y: roofBottomY, z: halfRw },  v3: { x: -halfRw, y: roofBottomY, z: halfRw }, v4: { x: 0, y: roofTopY, z: 0 }
        };

        const processRoofFace = (i0, i1, i2, nx, ny, nz) => {
            const getVert = (idx) => roofVerts["v" + idx];
            const transform = (v) => {
                const rx = v.x * Math.cos(angleY) + v.z * Math.sin(angleY);
                const rz = -v.x * Math.sin(angleY) + v.z * Math.cos(angleY);
                return { x: rx, y: v.y, z: rz };
            };
            const p0 = transform(getVert(i0)); const p1 = transform(getVert(i1)); const p2 = transform(getVert(i2));
            polygons.push({ p0, p1, p2, p3: p2, normal: { x: nx * Math.cos(angleY) + nz * Math.sin(angleY), y: ny, z: -nx * Math.sin(angleY) + nz * Math.cos(angleY) }, z: ((p0.z + p1.z + p2.z) / 3) - 2.5, type: 'donjon_roof', isTriangle: true });
        };
        processRoofFace(0, 1, 4, 0, -0.2, -1); processRoofFace(1, 2, 4, 1, -0.2, 0);
        processRoofFace(2, 3, 4, 0, -0.2, 1);  processRoofFace(3, 0, 4, -1, -0.2, 0);

        addBlock(0, (roofTopY + (roofTopY - 14)) * 0.5, 0, 1, 14, 1, 'donjon_flagpole', 3.5);
        const waveX = Math.sin(time * 6.5) * 4.5;
        const pf0 = { x: 0, y: roofTopY - 14, z: 0 }; const pf1 = { x: 0, y: roofTopY - 7, z: 0 }; const pf2 = { x: 11 * Math.cos(angleY), y: roofTopY - 10.5, z: -11 * Math.sin(angleY) + waveX * 0.5 };
        polygons.push({ p0: pf0, p1: pf1, p2: pf2, p3: pf2, normal: { x: 0, y: 0, z: -1 }, z: ((pf0.z + pf1.z + pf2.z) / 3) - 5.0, type: 'donjon_flag_banner', isTriangle: true });

        polygons.sort((a, b) => a.z - b.z);
        polygons.forEach(poly => {
            const n = poly.normal; const dot = n.x*lNorm.x + n.y*lNorm.y + n.z*lNorm.z;
            const intensity = Math.max(0.26, Math.abs(dot));

            ctx.beginPath(); ctx.moveTo(poly.p0.x, poly.p0.y); ctx.lineTo(poly.p1.x, poly.p1.y); ctx.lineTo(poly.p2.x, poly.p2.y);
            if (!poly.isTriangle && poly.p3) { ctx.lineTo(poly.p3.x, poly.p3.y); }
            ctx.closePath();

            let matMod = 1.0;
            if (poly.type === 'wall' || poly.type === 'wall_tooth') matMod = 0.84;
            else if (poly.type.startsWith('donjon')) matMod = poly.type === 'donjon_roof' ? 0.94 : 1.10;

            const isFlag = poly.type === 'donjon_flag_banner';
            const mat = this._getMaterialColors(intensity, isFlag);
            ctx.fillStyle = `rgb(${Math.min(255, Math.floor(mat.r * matMod))}, ${Math.min(255, Math.floor(mat.g * matMod))}, ${Math.min(255, Math.floor(mat.b * matMod))})`; ctx.fill();
            ctx.strokeStyle = mat.strokeColor; ctx.lineWidth = 0.5; ctx.stroke();

            if (poly.type === 'donjon_body' && dot > 0) {
                ctx.save();
                const midTopX = (poly.p0.x + poly.p1.x) * 0.5; const midTopY = (poly.p0.y + poly.p1.y) * 0.5;
                const midBotX = (poly.p3.x + poly.p2.x) * 0.5; const midBotY = (poly.p3.y + poly.p2.y) * 0.5;
                const drawWindow = (pctY) => {
                    const wx = midTopX + (midBotX - midTopX) * pctY; const wy = midTopY + (midBotY - midTopY) * pctY;
                    const winW = Math.max(0.6, Math.abs(poly.p1.x - poly.p0.x) * 0.16);
                    ctx.fillStyle = "rgb(15, 20, 28)"; ctx.fillRect(wx - winW * 0.5, wy - 3, winW, 6);
                };
                drawWindow(0.25); drawWindow(0.65); ctx.restore();
            }
        });
        ctx.restore();
    }
};

export default ThreeDTokenEngine;
