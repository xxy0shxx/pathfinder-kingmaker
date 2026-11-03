/**
 * Модуль для управления сеткой гексов, их отрисовкой, слоями и тултипами
 */
const HexManager = {
    hexRadius: 77.96,
    rows: 12,
    cols: 30,
    offsetX: -106,
    offsetY: 16,

    mapDataRef: null,
    clickableMap: null,
    visualLayer: null,
    openMenuCallback: null,

    /**
     * Инициализация менеджера гексов
     */
    init(mapData, openMenuCallback) {
        this.mapDataRef = mapData;
        this.openMenuCallback = openMenuCallback;
        this.clickableMap = document.getElementById('clickableMap');
        this.visualLayer = document.getElementById('visualLayer');
    },

    /**
     * Обновление ссылки на данные карты (при импорте файлов)
     */
    updateMapData(newMapData) {
        this.mapDataRef = newMapData;
    },

    /**
     * Расчет вершин регулярного гексагона для тегов area
     */
    getHexCoordsArray(cx, cy, r) {
        let coords = [];
        for (let i = 0; i < 6; i++) {
            let angle_deg = 60 * i - 30;
            let angle_rad = Math.PI / 180 * angle_deg;
            let x = Math.round(cx + r * Math.cos(angle_rad));
            let y = Math.round(cy + r * Math.sin(angle_rad));
            coords.push(x, y);
        }
        return coords.join(',');
    },

    /**
     * Вспомогательная функция перевода HEX-цвета в RGBA с прозрачностью
     */
    convertHexToRgba(hex, alpha) {
        if (!hex || hex === 'transparent') return 'rgba(0,0,0,0)';
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    },
    /**
     * Рендеринг всей сетки гексов и привязка событий клика
     */
    buildGrid(hasMovedCheck) {
        if (!this.clickableMap || !this.visualLayer) return;

        this.clickableMap.innerHTML = '';
        this.visualLayer.innerHTML = '';

        const widthBetweenHexes = this.hexRadius * Math.sqrt(3);
        const heightBetweenHexes = this.hexRadius * 1.5;
        const hexWidth = this.hexRadius * Math.sqrt(3);
        const hexHeight = this.hexRadius * 2;

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                let cx = this.offsetX + c * widthBetweenHexes;
                let cy = this.offsetY + r * heightBetweenHexes;
                if (r % 2 !== 0) { cx += widthBetweenHexes / 2; }

                const hexId = 'hex_' + r + '_' + c;

                const area = document.createElement('area');
                area.setAttribute('shape', 'poly');
                area.setAttribute('coords', this.getHexCoordsArray(cx, cy, this.hexRadius));
                area.setAttribute('href', '#');
                area.setAttribute('id', 'area_' + hexId);
                this.clickableMap.appendChild(area);

                const vHex = document.createElement('div');
                vHex.className = 'visual-hex';
                vHex.style.width = hexWidth + 'px';
                vHex.style.height = hexHeight + 'px';
                vHex.style.left = (cx - hexWidth / 2) + 'px';
                vHex.style.top = (cy - this.hexRadius) + 'px';
                vHex.setAttribute('id', 'visual_' + hexId);

                const hexData = this.mapDataRef[hexId];
                if (!hexData || (!hexData.explored && !hexData.hasVisited)) {
                    vHex.classList.add('fog-active');
                }

                vHex.addEventListener('click', (e) => {
                    e.preventDefault(); e.stopPropagation();
                    if (hasMovedCheck()) return;

                    const modal = document.getElementById('hexMenu');
                    if (modal && modal.classList.contains('open')) {
                        if (typeof window.closeMenu === 'function') window.closeMenu();
                    } else if (this.openMenuCallback) {
                        this.openMenuCallback(hexId);
                    }
                });

                this.attachTooltipEvents(vHex, hexId);
                this.createSubLayers(vHex, hexId, cx, cy);

                this.visualLayer.appendChild(vHex);
            }
        }
    },
    /**
     * Динамический сбор метаданных при наведении (Тултипы) - Начало
     */
    attachTooltipEvents(vHex, hexId) {
        const tooltip = document.getElementById('hexTooltip');
        if (!tooltip) return;

        vHex.addEventListener('mouseenter', () => {
            const data = this.mapDataRef[hexId];
            if (data && (data.title || data.text)) {
                let content = '';

                if (data.title) {
                    const star = data.explored ? '🔍 ' : '';
                    const mapIcon = data.mapMapped ? '📜 ' : '';
                    let statsLabel = '';
                    if (data.difficulty && data.regionLevel) {
                        statsLabel = ` (СЛ ${data.difficulty} / lvl ${data.regionLevel})`;
                    } else if (data.difficulty) {
                        statsLabel = ` (СЛ ${data.difficulty})`;
                    } else if (data.regionLevel) {
                        statsLabel = ` (lvl ${data.regionLevel})`;
                    }

                    let typeIcon = '';
                    if (data.type === 'landmark') typeIcon = '🏛️ ';
                    else if (data.type === 'resource') typeIcon = '💎 ';
                    else if (data.type === 'quest') typeIcon = '⚜️ ';
                    else if (data.type === 'mystery') typeIcon = '❓ ';

                    let terrainIcon = '';
                    if (data.terrain === 'swamp') terrainIcon = '🐸 ';
                    else if (data.terrain === 'forest') terrainIcon = '🌲 ';
                    else if (data.terrain === 'water') terrainIcon = '🌊 ';
                    else if (data.terrain === 'arctic') terrainIcon = '❄️ ';
                    else if (data.terrain === 'mountain') terrainIcon = '⛰️ ';
                    else if (data.terrain === 'plains') terrainIcon = '🌾 ';

                    content += `<div class="tooltip-title">${terrainIcon}${star}${mapIcon}${typeIcon}${data.title}${statsLabel}</div>`;
                }
                let paramsBlock = '';
                paramsBlock += `<div style="margin-bottom: 4px;">${data.explored ? '🔍 <b>Разведан</b>' : '❌ <b>Не разведан</b>'}</div>`;
                paramsBlock += `<div style="margin-bottom: 4px;">${data.mapMapped ? '📜 <b>Карта составлена</b>' : '❌ <b>Карта отсутствует</b>'}</div>`;
                if (data.squadHere) { paramsBlock += `<div style="margin-bottom: 4px; color: #ff7675;">🚩 <b>Отряд в гексе</b></div>`; }
                if (data.difficulty) { paramsBlock += `<div style="margin-bottom: 4px;">🎲 <b>Сложность:<b/> <span class="tooltip-value">${data.difficulty}</span></div>`; }
                if (data.regionLevel) { paramsBlock += `<div style="margin-bottom: 4px;">💀 <b>Уровень:</b> <span class="tooltip-value">${data.regionLevel}</span></div>`; }

                if (data.type) {
                    let typeText = ''; let tIcon = '';
                    if (data.type === 'landmark') { tIcon = '🏛️'; typeText = 'Достопримечательность'; }
                    if (data.type === 'resource') { tIcon = '💎'; typeText = 'Ресурс'; }
                    if (data.type === 'quest') { tIcon = '⚜️'; typeText = 'Стандартное задание'; }
                    if (data.type === 'mystery') { tIcon = '❓'; typeText = 'Тайна'; }
                    paramsBlock += `<div style="margin-bottom: 4px;">${tIcon} <b>Объект:</b> <span class="tooltip-value">${typeText}</span></div>`;
                }

                if (data.terrain) {
                    let terrainText = ''; let terrIcon = '';
                    if (data.terrain === 'swamp') { terrIcon = '🐸'; terrainText = 'Болото 🎲СЛ 14'; }
                    if (data.terrain === 'forest') { terrIcon = '🌲'; terrainText = 'Лес 🎲СЛ 14'; }
                    if (data.terrain === 'water') { terrIcon = '🌊'; terrainText = 'Вода 🎲СЛ 17'; }
                    if (data.terrain === 'arctic') { terrIcon = '❄️'; terrainText = 'Приполярье 🎲СЛ 17'; }
                    if (data.terrain === 'mountain') { terrIcon = '⛰️'; terrainText = 'Горы 🎲СЛ 16'; }
                    if (data.terrain === 'plains') { terrIcon = '🌾'; terrainText = 'Равнины 🎲СЛ 12'; }
                    paramsBlock += `<div style="margin-bottom: 4px;">${terrIcon} <b>Местность:</b> <span class="tooltip-value">${terrainText}</span></div>`;
                }

                content += `<div style="font-size: 16px; color: #ccc; margin: 8px 0 12px 0; line-height: 1.3;">${paramsBlock}</div>`;

                if (data.text) { content += `<div style="border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 8px;" class="tooltip-desc">${data.text.replace(/\n/g, '<br>')}</div>`; }
                if (data.lastSaved) { content += `<div style="margin-top: 8px; font-size: 12px; color: #888; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 4px;">🛡️ ${data.lastSaved}</div>`; }

                tooltip.innerHTML = content; tooltip.style.display = 'block';
            }
        });

        vHex.addEventListener('mousemove', (e) => {
            tooltip.style.left = (e.clientX + 25) + 'px';
            tooltip.style.top = (e.clientY + 25) + 'px';
        });

        vHex.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none'; tooltip.innerHTML = '';
        });
    },
    /**
     * Создание внутренних DOM-слоев, индикаторов и маркеров гекса
     */
    createSubLayers(vHex, hexId, cx, cy) {
        const data = this.mapDataRef[hexId];

        const shape = document.createElement('div');
        shape.className = 'hex-shape';
        shape.setAttribute('id', 'shape_' + hexId);
        if (data && data.color) { shape.style.backgroundColor = this.convertHexToRgba(data.color, 0.37); }
        if (data && data.squadHere) { vHex.classList.add('squad-dark'); }
        vHex.appendChild(shape);

        const titleLabel = document.createElement('div');
        titleLabel.className = 'hex-title-label-framed';
        titleLabel.setAttribute('id', 'title_label_' + hexId);
        const titleText = document.createElement('span');
        titleText.className = 'hex-title-text';
        titleLabel.appendChild(titleText);
        titleLabel.style.left = cx + 'px';
        titleLabel.style.top = (cy - this.hexRadius + 30) + 'px';
        this.visualLayer.appendChild(titleLabel);

        const statsLabel = document.createElement('div');
        statsLabel.className = 'hex-title-label-framed hex-region-stats-framed';
        const statsText = document.createElement('span');
        statsText.className = 'hex-title-text';
        statsLabel.appendChild(statsText);
        statsLabel.style.left = cx + 'px';
        statsLabel.style.top = (cy + 48) + 'px';
        this.visualLayer.appendChild(statsLabel);

        const exploredElem = document.createElement('div'); exploredElem.className = 'explored-icon-container'; vHex.appendChild(exploredElem);
        const mappedElem = document.createElement('div'); mappedElem.className = 'mapped-icon-container'; vHex.appendChild(mappedElem);
        const typeElem = document.createElement('div'); typeElem.className = 'type-icon-container'; vHex.appendChild(typeElem);
        const terrainElem = document.createElement('div'); terrainElem.className = 'terrain-icon-container'; vHex.appendChild(terrainElem);

        const flagContainer = document.createElement('div');
        flagContainer.className = 'squad-flag-container';
        const pole = document.createElement('div'); pole.className = 'squad-pole';
        const flag = document.createElement('div'); flag.className = 'squad-flag';
        pole.appendChild(flag); flagContainer.appendChild(pole); vHex.appendChild(flagContainer);

        if (data) {
            if (data.title) { titleLabel.querySelector('.hex-title-text').textContent = data.title; }
            const diff = data.difficulty; const lvl = data.regionLevel;
            const sTextNode = statsLabel.querySelector('.hex-title-text');

            if (sTextNode) {
                if (diff && lvl) sTextNode.textContent = `🎲${diff}💀${lvl}`;
                else if (diff) sTextNode.textContent = `🎲${diff}`;
                else if (lvl) sTextNode.textContent = `💀${lvl}`;
            }
            statsLabel.style.display = (diff || lvl) ? 'flex' : 'none';

            if (data.terrain) {
                terrainElem.style.display = 'block';
                let icon = '';
                if (data.terrain === 'swamp') icon = '🐸';
                else if (data.terrain === 'forest') icon = '🌲';
                else if (data.terrain === 'water') icon = '🌊';
                else if (data.terrain === 'arctic') icon = '❄️';
                else if (data.terrain === 'mountain') icon = '⛰️';
                else if (data.terrain === 'plains') icon = '🌾';
                terrainElem.textContent = icon;
            }

            if (data.type) {
                typeElem.style.display = 'block';
                let icon = '';
                if (data.type === 'landmark') icon = '🏛️';
                else if (data.type === 'resource') icon = '💎';
                else if (data.type === 'quest') icon = '⚜️';
                else if (data.type === 'mystery') icon = '❓';
                typeElem.textContent = icon;
            }

            if (data.squadHere) { flagContainer.style.display = 'block'; flagContainer.classList.add('active-flag'); }
            if (data.explored) { exploredElem.style.display = 'block'; exploredElem.textContent = '🔍'; }
            if (data.mapMapped) { mappedElem.style.display = 'block'; mappedElem.textContent = '📜'; }

            if (data.questData && data.questData.title && data.questData.title.trim() !== '' && data.questData.status !== 'completed') {
                const qTooltip = document.createElement('div');
                qTooltip.className = 'hex-quest-mini-tooltip';
                qTooltip.textContent = '⚜️ ' + data.questData.title.trim();
                qTooltip.style.left = cx + 'px';
                qTooltip.style.top = (cy - this.hexRadius + 12) + 'px';
                this.visualLayer.appendChild(qTooltip);
            }
        }
    }
};

export default HexManager;
