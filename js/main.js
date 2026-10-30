const hexRadius = 77.96;
const rows = 12;
const cols = 30;
const offsetX = -106;
const offsetY = 16;

const clickableMap = document.getElementById('clickableMap');
const visualLayer = document.getElementById('visualLayer');
const modal = document.getElementById('hexMenu');
const difficultySelect = document.getElementById('inpDifficulty');
let currentHexId = null;
let mapData = JSON.parse(localStorage.getItem('hexMapSystemData')) || {};

const audioPlayer = document.getElementById('bg-music');
const musicButton = document.getElementById('btnMusic');
const loopButton = document.getElementById('btnLoop');
const playlistButton = document.getElementById('btnPlaylist');
const trackSelector = document.getElementById('trackSelectorStyle');
const playlistContainer = document.getElementById('playerPlaylist');
const tracksListContainer = document.getElementById('playlistTracksContainer');
const progressBg = document.querySelector('.timeline-bg');
const progressFill = document.querySelector('.timeline-fill');
const timeCurrent = document.getElementById('timeCurrent');
const timeTotal = document.getElementById('timeTotal');
const volumeSlider = document.getElementById('volumeSlider');

let playlist = [];
let currentTrackIdx = 0;
let isLooping = false;

function formatTrackName(filename) {
    let name = filename.replace('.mp3', '');
    name = name.replace(/_/g, ' ');
    name = name.replace(/audio\//gi, '').replace(/\s+/g, ' ').trim();
    return name.charAt(0).toUpperCase() + name.slice(1);
}
async function initializeMusicPlayer() {
    if (!audioPlayer) return;
    audioPlayer.volume = 0.25;

    try {
        const response = await fetch('audio/playlist.json');
        playlist = await response.json();

        if (trackSelector) {
            trackSelector.innerHTML = "";
            playlist.forEach((track) => {
                const opt = document.createElement("option");
                opt.value = track;
                opt.textContent = formatTrackName(track);
                trackSelector.appendChild(opt);
            });
            trackSelector.addEventListener('change', () => {
                const idx = playlist.indexOf(trackSelector.value);
                if (idx !== -1) loadTrack(idx, true);
            });
        }

        if (tracksListContainer) {
            tracksListContainer.innerHTML = "";
            playlist.forEach((track, idx) => {
                const item = document.createElement("div");
                item.className = "playlist-item";
                item.textContent = `${idx + 1}. ${formatTrackName(track)}`;
                item.addEventListener("click", () => loadTrack(idx, true));
                tracksListContainer.appendChild(item);
            });
        }

        if (musicButton) musicButton.addEventListener('click', toggleMusic);
        if (loopButton) loopButton.addEventListener('click', toggleLoop);
        if (playlistButton) playlistButton.addEventListener('click', togglePlaylistUI);

        audioPlayer.addEventListener("timeupdate", () => {
            if (!audioPlayer.duration) return;
            const pct = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            if (progressFill) progressFill.style.width = `${pct}%`;
            if (timeCurrent) timeCurrent.textContent = formatMusicTime(audioPlayer.currentTime);
        });

        audioPlayer.addEventListener("loadedmetadata", () => {
            if (timeTotal) timeTotal.textContent = formatMusicTime(audioPlayer.duration);
        });

        if (progressBg) {
            progressBg.addEventListener("click", (e) => {
                if (!audioPlayer.duration) return;
                const rect = progressBg.getBoundingClientRect();
                const pct = (e.clientX - rect.left) / rect.width;
                audioPlayer.currentTime = pct * audioPlayer.duration;
            });
        }

        if (volumeSlider) {
            volumeSlider.value = audioPlayer.volume;
            volumeSlider.addEventListener("input", (e) => { audioPlayer.volume = e.target.value; });
        }

        audioPlayer.addEventListener("ended", () => {
            if (!isLooping) playNextRandomTrack();
        });

        loadTrack(currentTrackIdx, false);
    } catch (error) {
        console.error("Ошибка загрузки плейлиста:", error);
    }
}

function loadTrack(idx, startPlaying = false) {
    if (idx < 0 || idx >= playlist.length) return;
    currentTrackIdx = idx;
    audioPlayer.src = playlist[currentTrackIdx];
    if (trackSelector) trackSelector.value = playlist[currentTrackIdx];
    if (tracksListContainer) {
        const items = tracksListContainer.querySelectorAll(".playlist-item");
        items.forEach((item, index) => { item.classList.toggle("current", index === idx); });
    }
    if (startPlaying) {
        audioPlayer.play().then(() => { updatePlayerButtonUI(true); }).catch(e => console.log("Ожидание клика"));
    } else {
        updatePlayerButtonUI(false);
    }
}

function toggleMusic() {
    if (!audioPlayer.src) { loadTrack(currentTrackIdx, true); return; }
    if (audioPlayer.paused) {
        audioPlayer.play().then(() => { updatePlayerButtonUI(true); }).catch(e => alert('Нужен клик на странице'));
    } else {
        audioPlayer.pause(); updatePlayerButtonUI(false);
    }
}

function toggleLoop() {
    isLooping = !isLooping; audioPlayer.loop = isLooping;
    if (isLooping) { loopButton.classList.add('active'); loopButton.title = "Цикл ВКЛ"; } 
    else { loopButton.classList.remove('active'); loopButton.title = "Зациклить трек"; }
}

function togglePlaylistUI() {
    if (playlistContainer) { playlistContainer.classList.toggle("open"); playlistButton.classList.toggle("active"); }
}

function playNextRandomTrack() {
    if (playlist.length <= 1) return;
    let nextTrackIndex;
    do { nextTrackIndex = Math.floor(Math.random() * playlist.length); } while (nextTrackIndex === currentTrackIdx);
    loadTrack(nextTrackIndex, true);
}

function updatePlayerButtonUI(isPlayingNow) {
    if (!musicButton) return;

    if (isPlayingNow) {
        musicButton.innerHTML = `⏸ Пауза`;
        musicButton.style.backgroundColor = '#e74c3c';
        musicButton.style.color = '#fff';
    } else {
        musicButton.innerHTML = `🎵 Включить музыку`;
        musicButton.style.backgroundColor = '';
        musicButton.style.color = '';
    }
}

function formatMusicTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60); const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

document.addEventListener('click', (e) => {
    if (playlistContainer && playlistContainer.classList.contains('open') && !playlistContainer.contains(e.target) && e.target !== playlistButton) {
        playlistContainer.classList.remove('open'); playlistButton.classList.remove('active');
    }
});

function populateDifficultySelect() {
    const regionLevelSelect = document.getElementById('inpRegionLevel');
    if (!difficultySelect || !regionLevelSelect) return;
    
    for (let i = 1; i <= 40; i++) {
        const optDiff = document.createElement('option');
        optDiff.value = i;
        optDiff.textContent = 'СЛ ' + i;
        difficultySelect.appendChild(optDiff);

        const optLvl = document.createElement('option');
        optLvl.value = i;
        optLvl.textContent = 'Уровень ' + i;
        regionLevelSelect.appendChild(optLvl);
    }
}

function getHexCoordsArray(cx, cy, r) {
    let coords = [];
    for (let i = 0; i < 6; i++) {
        let angle_deg = 60 * i - 30;
        let angle_rad = Math.PI / 180 * angle_deg;
        let x = Math.round(cx + r * Math.cos(angle_rad));
        let y = Math.round(cy + r * Math.sin(angle_rad));
        coords.push(x, y);
    }
    return coords.join(',');
}

function buildHexGrid() {
    clickableMap.innerHTML = '';
    visualLayer.innerHTML = '';

    const widthBetweenHexes = hexRadius * Math.sqrt(3);
    const heightBetweenHexes = hexRadius * 1.5;
    const hexWidth = hexRadius * Math.sqrt(3);
    const hexHeight = hexRadius * 2;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let cx = offsetX + c * widthBetweenHexes;
            let cy = offsetY + r * heightBetweenHexes;
            if (r % 2 !== 0) {
                cx += widthBetweenHexes / 2;
            }

            const hexId = 'hex_' + r + '_' + c;

            const area = document.createElement('area');
            area.setAttribute('shape', 'poly');
            area.setAttribute('coords', getHexCoordsArray(cx, cy, hexRadius));
            area.setAttribute('href', '#');
            area.setAttribute('id', 'area_' + hexId);
            clickableMap.appendChild(area);

            const vHex = document.createElement('div');
            vHex.className = 'visual-hex';
            vHex.style.width = hexWidth + 'px';
            vHex.style.height = hexHeight + 'px';
            vHex.style.left = (cx - hexWidth / 2) + 'px';
            vHex.style.top = (cy - hexRadius) + 'px';
            vHex.setAttribute('id', 'visual_' + hexId);

            if (!mapData[hexId] || (!mapData[hexId].explored && !mapData[hexId].hasVisited)) {
                vHex.classList.add('fog-active');
            }

            vHex.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (hasMoved) return;
                if (modal.classList.contains('open')) {
                    closeMenu();
                } else {
                    openMenu(hexId);
                }
            });

            const tooltip = document.getElementById('hexTooltip');
            vHex.addEventListener('mouseenter', function (e) {
                if (mapData[hexId] && (mapData[hexId].title || mapData[hexId].text)) {
                    const data = mapData[hexId];
                    let content = '';
                    if (data.title) {
                        const star = data.explored ? '🔍 ' : '';
                        const mapIcon = data.mapMapped ? '📜 ' : '';
                        let statsLabel = '';
                        if (data.difficulty && data.regionLevel) statsLabel = ` (СЛ ${data.difficulty} / lvl ${data.regionLevel})`;
                        else if (data.difficulty) statsLabel = ` (СЛ ${data.difficulty})`;
                        else if (data.regionLevel) statsLabel = ` (lvl ${data.regionLevel})`;
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
                    if (data.squadHere) paramsBlock += `<div style="margin-bottom: 4px; color: #ff7675;">🚩 <b>Отряд в гексе</b></div>`;
                    if (data.difficulty) paramsBlock += `<div style="margin-bottom: 4px;">🎲 <b>Сложность региона:</b> СЛ ${data.difficulty}</div>`;
                    if (data.regionLevel) paramsBlock += `<div style="margin-bottom: 4px;">💀 <b>Уровень региона:</b> Уровень ${data.regionLevel}</div>`;
                    if (data.type) {
                        let typeText = '';
                        let tIcon = '';
                        if (data.type === 'landmark') {
                            tIcon = '🏛️';
                            typeText = 'Достопримечательность';
                        }
                        if (data.type === 'resource') {
                            tIcon = '💎';
                            typeText = 'Ресурс';
                        }
                        if (data.type === 'quest') {
                            tIcon = '⚜️';
                            typeText = 'Стандартное задание';
                        }
                        if (data.type === 'mystery') {
                            tIcon = '❓';
                            typeText = 'Тайна';
                        }
                        paramsBlock += `<div style="margin-bottom: 4px;">${tIcon} <b>Объект:</b> ${typeText}</div>`;
                    }
                    if (data.terrain) {
                        let terrainText = '';
                        let terrIcon = '';
                        if (data.terrain === 'swamp') {
                            terrIcon = '🐸';
                            terrainText = 'Болото (СЛ 14)';
                        }
                        if (data.terrain === 'forest') {
                            terrIcon = '🌲';
                            terrainText = 'Лес (СЛ 14)';
                        }
                        if (data.terrain === 'water') {
                            terrIcon = '🌊';
                            terrainText = 'Вода (СЛ 17)';
                        }
                        if (data.terrain === 'arctic') {
                            terrIcon = '❄️';
                            terrainText = 'Приполярье (СЛ 17)';
                        }
                        if (data.terrain === 'mountain') {
                            terrIcon = '⛰️';
                            terrainText = 'Горы (СЛ 16)';
                        }
                        if (data.terrain === 'plains') {
                            terrIcon = '🌾';
                            terrainText = 'Равнины (СЛ 12)';
                        }
                        paramsBlock += `<div style="margin-bottom: 4px;">${terrIcon} <b>Местность:</b> ${terrainText}</div>`;
                    }
                    content += `<div style="font-size: 16px; color: #ccc; margin: 8px 0 12px 0; line-height: 1.3;">${paramsBlock}</div>`;
                    if (data.text) {
                        content += `<div style="border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 8px;" class="tooltip-desc">${data.text.replace(/\n/g, '<br>')}</div>`;
                    }

                    if (data.lastSaved) {
                        content += `<div style="margin-top: 8px; font-size: 12px; color: #888; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 4px;">🛡️ ${data.lastSaved}</div>`;
                    }

                    tooltip.innerHTML = content;
                    tooltip.style.display = 'block';
                }
            });

            vHex.addEventListener('mousemove', (e) => {
                if (tooltip) {
                    tooltip.style.left = (e.clientX + 25) + 'px';
                    tooltip.style.top = (e.clientY + 25) + 'px';
                }
            });

            vHex.addEventListener('mouseleave', () => {
                if (tooltip) {
                    tooltip.style.display = 'none';
                    tooltip.innerHTML = '';
                }
            });

            const shape = document.createElement('div');
            shape.className = 'hex-shape';
            shape.setAttribute('id', 'shape_' + hexId);
            if (mapData[hexId] && mapData[hexId].color) shape.style.backgroundColor = convertHexToRgba(mapData[hexId].color, 0.37);
            if (mapData[hexId] && mapData[hexId].squadHere) vHex.classList.add('squad-dark');
            vHex.appendChild(shape);

            const titleLabel = document.createElement('span');
            titleLabel.className = 'hex-title-label';
            vHex.appendChild(titleLabel);

            const statsLabel = document.createElement('span');
            statsLabel.className = 'hex-stats-label';
            vHex.appendChild(statsLabel);

            const exploredElem = document.createElement('div');
            exploredElem.className = 'explored-icon-container';
            vHex.appendChild(exploredElem);

            const mappedElem = document.createElement('div');
            mappedElem.className = 'mapped-icon-container';
            vHex.appendChild(mappedElem);

            const typeElem = document.createElement('div');
            typeElem.className = 'type-icon-container';
            vHex.appendChild(typeElem);

            const terrainElem = document.createElement('div');
            terrainElem.className = 'terrain-icon-container';
            vHex.appendChild(terrainElem);

            const flagContainer = document.createElement('div');
            flagContainer.className = 'squad-flag-container';
            const pole = document.createElement('div');
            pole.className = 'squad-pole';
            const flag = document.createElement('div');
            flag.className = 'squad-flag';
            pole.appendChild(flag);
            flagContainer.appendChild(pole);
            vHex.appendChild(flagContainer);

            if (mapData[hexId]) {
                if (mapData[hexId].title) titleLabel.textContent = mapData[hexId].title;
                const diff = mapData[hexId].difficulty;
                const lvl = mapData[hexId].regionLevel;
                if (diff && lvl) statsLabel.textContent = `🎲${diff}💀${lvl}`;
                else if (diff) statsLabel.textContent = `🎲${diff}`;
                else if (lvl) statsLabel.textContent = `💀${lvl}`;
                statsLabel.style.display = (diff || lvl) ? 'block' : 'none';

                if (mapData[hexId].terrain) {
                    terrainElem.style.display = 'block';
                    let icon = '';
                    if (mapData[hexId].terrain === 'swamp') icon = '🐸';
                    else if (mapData[hexId].terrain === 'forest') icon = '🌲';
                    else if (mapData[hexId].terrain === 'water') icon = '🌊';
                    else if (mapData[hexId].terrain === 'arctic') icon = '❄️';
                    else if (mapData[hexId].terrain === 'mountain') icon = '⛰️';
                    else if (mapData[hexId].terrain === 'plains') icon = '🌾';
                    terrainElem.textContent = icon;
                }

                if (mapData[hexId].type) {
                    typeElem.style.display = 'block';
                    let icon = '';
                    if (mapData[hexId].type === 'landmark') icon = '🏛️';
                    else if (mapData[hexId].type === 'resource') icon = '💎';
                    else if (mapData[hexId].type === 'quest') icon = '⚜️';
                    else if (mapData[hexId].type === 'mystery') icon = '❓';
                    typeElem.textContent = icon;
                }

                if (mapData[hexId].squadHere) {
                    flagContainer.style.display = 'block';
                    flagContainer.classList.add('active-flag');
                }

                if (mapData[hexId].explored) {
                    exploredElem.style.display = 'block';
                    exploredElem.textContent = '🔍';
                } else {
                    exploredElem.style.display = 'none';
                }

                if (mapData[hexId].mapMapped) {
                    mappedElem.style.display = 'block';
                    mappedElem.textContent = '📜';
                } else {
                    mappedElem.style.display = 'none';
                }
            }
            visualLayer.appendChild(vHex);
        }
    }
}

function convertHexToRgba(hex, alpha) {
    if (!hex || hex === 'transparent') return 'rgba(0,0,0,0)';
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
}

function openMenu(hexId) {
    currentHexId = hexId;
    
    const inpExplored = document.getElementById('inpExplored');
    const inpMapMapped = document.getElementById('inpMapMapped');
    const inpSquadHere = document.getElementById('inpSquadHere');
    const inpType = document.getElementById('inpType');
    const inpTerrain = document.getElementById('inpTerrain');
    const inpRegionLevel = document.getElementById('inpRegionLevel');
    const inpColor = document.getElementById('inpColor');

    let currentColor = 'transparent';

    if (mapData[hexId]) {
        document.getElementById('inpTitle').value = mapData[hexId].title || '';
        document.getElementById('inpDesc').value = mapData[hexId].text || '';
        difficultySelect.value = mapData[hexId].difficulty || '';
        inpExplored.checked = !!mapData[hexId].explored;
        inpMapMapped.checked = !!mapData[hexId].mapMapped;
        inpType.value = mapData[hexId].type || '';
        inpTerrain.value = mapData[hexId].terrain || '';
        inpRegionLevel.value = mapData[hexId].regionLevel || '';
        currentColor = mapData[hexId].color || 'transparent';
    } else {
        document.getElementById('inpTitle').value = '';
        document.getElementById('inpDesc').value = '';
        difficultySelect.value = '';
        inpExplored.checked = false;
        inpMapMapped.checked = false;
        inpType.value = '';
        inpTerrain.value = '';
        inpRegionLevel.value = '';
    }
    
    if (inpSquadHere) inpSquadHere.checked = mapData[hexId] ? !!mapData[hexId].squadHere : false;
    if (inpColor) inpColor.value = currentColor;

    document.querySelectorAll('.color-preset-btn').forEach(btn => {
        btn.classList.remove('active');
        if (currentColor === 'transparent' && btn.classList.contains('transparent-preset')) {
            btn.classList.add('active');
        } else if (btn.style.backgroundColor === convertHexToRgbStandard(currentColor)) {
            btn.classList.add('active');
        }
    });

    if ('ontouchstart' in window) {
        const inpTitle = document.getElementById('inpTitle');
        const inpDesc = document.getElementById('inpDesc');

        inpTitle.setAttribute('readonly', 'true');
        inpDesc.setAttribute('readonly', 'true');

        inpTitle.onclick = function() {
            let newTitle = prompt("Введите название гекса:", inpTitle.value);
            if (newTitle !== null) inpTitle.value = newTitle;
        };

        inpDesc.onclick = function() {
            let newDesc = prompt("Введите описание гекса:", inpDesc.value);
            if (newDesc !== null) inpDesc.value = newDesc;
        };
    }

    if (mapData[hexId] && mapData[hexId].questData) {
        document.getElementById('inpQuestTitle').value = mapData[hexId].questData.title || '';
        document.getElementById('inpQuestDesc').value = mapData[hexId].questData.desc || '';
        document.getElementById('inpQuestStatus').checked = mapData[hexId].questData.status === 'completed';
    } else {
        document.getElementById('inpQuestTitle').value = '';
        document.getElementById('inpQuestDesc').value = '';
        document.getElementById('inpQuestStatus').checked = false;
    }

    modal.classList.add('open');
}

function convertHexToRgbStandard(hex) {
    if (hex === 'transparent' || !hex) return '';
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
}

function closeMenu() {
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
    }

    modal.classList.remove('open');
    currentHexId = null;

    setTimeout(() => {
        if (typeof updateMapTransform === 'function') {
            updateMapTransform();
        }
    }, 300);
}

function saveMenu() {
    if (!currentHexId) return;

    const titleVal = document.getElementById('inpTitle').value;
    const descVal = document.getElementById('inpDesc').value;
    const colorVal = document.getElementById('inpColor').value || 'transparent';
    const diffVal = difficultySelect.value;
    const exploredVal = document.getElementById('inpExplored').checked;
    const mapMappedVal = document.getElementById('inpMapMapped').checked;
    const squadHereVal = document.getElementById('inpSquadHere').checked;
    const typeVal = document.getElementById('inpType').value;
    const terrainVal = document.getElementById('inpTerrain').value;
    const regionLevelVal = document.getElementById('inpRegionLevel').value;
    const questTitleVal = document.getElementById('inpQuestTitle').value.trim();
    const questDescVal = document.getElementById('inpQuestDesc').value.trim();
    const questStatusVal = document.getElementById('inpQuestStatus').checked ? 'completed' : 'active';

    const currentHexElement = document.getElementById('visual_' + currentHexId);
    const currentShape = document.getElementById('shape_' + currentHexId);

    if (squadHereVal) {
        for (let id in mapData) {
            if (id !== currentHexId && mapData[id].squadHere === true) {
                mapData[id].squadHere = false;

                const oldHexElement = document.getElementById('visual_' + id);
                if (oldHexElement) {
                    oldHexElement.classList.remove('squad-dark');
                    const oldFlag = oldHexElement.querySelector('.squad-flag-container');
                    if (oldFlag) oldFlag.style.display = 'none';
                }
            }
        }
    }

    if (currentHexElement) {
        if (squadHereVal) {
            currentHexElement.classList.add('squad-dark');
        } else {
            currentHexElement.classList.remove('squad-dark');
        }

        const tLabel = currentHexElement.querySelector('.hex-title-label');
        if (tLabel) tLabel.textContent = titleVal;

        const sLabel = currentHexElement.querySelector('.hex-stats-label');
        if (sLabel) {
            if (diffVal && regionLevelVal) {
                sLabel.textContent = `🎲${diffVal}💀${regionLevelVal}`;
            } else if (diffVal) {
                sLabel.textContent = `🎲${diffVal}`;
            } else if (regionLevelVal) {
                sLabel.textContent = `💀${regionLevelVal}`;
            } else {
                sLabel.textContent = '';
            }
            sLabel.style.display = (diffVal || regionLevelVal) ? 'block' : 'none';
        }

        const typeElem = currentHexElement.querySelector('.type-icon-container');
        if (typeElem) {
            if (typeVal === "") {
                typeElem.style.display = 'none';
            } else {
                typeElem.style.display = 'block';
                let icon = '';
                if (typeVal === 'landmark') icon = '🏛️';
                else if (typeVal === 'resource') icon = '💎';
                else if (typeVal === 'quest') icon = '⚜️';
                else if (typeVal === 'mystery') icon = '❓';
                typeElem.textContent = icon;
            }
        }

        const terrainElem = currentHexElement.querySelector('.terrain-icon-container');
        if (terrainElem) {
            if (terrainVal === "") {
                terrainElem.style.display = 'none';
            } else {
                terrainElem.style.display = 'block';
                let icon = '';
                if (terrainVal === 'swamp') icon = '🐸';
                else if (terrainVal === 'forest') icon = '🌲';
                else if (terrainVal === 'water') icon = '🌊';
                else if (terrainVal === 'arctic') icon = '❄️';
                else if (terrainVal === 'mountain') icon = '⛰️';
                else if (terrainVal === 'plains') icon = '🌾';
                terrainElem.textContent = icon;
            }
        }

        const exploredElem = currentHexElement.querySelector('.explored-icon-container');
        if (exploredElem) {
            exploredElem.style.display = exploredVal ? 'block' : 'none';
            exploredElem.textContent = exploredVal ? '🔍' : '';
        }

        const mappedElem = currentHexElement.querySelector('.mapped-icon-container');
        if (mappedElem) {
            mappedElem.style.display = mapMappedVal ? 'block' : 'none';
            mappedElem.textContent = mapMappedVal ? '📜' : '';
        }

        const flagElem = currentHexElement.querySelector('.squad-flag-container');
        if (flagElem) {
            if (squadHereVal) {
                const isAlreadyHere = mapData[currentHexId] && mapData[currentHexId].squadHere;

                if (!isAlreadyHere) {
                    flagElem.style.display = 'none';
                    flagElem.classList.remove('active-flag');

                    const startHex = document.getElementById('visual_hex_0_0');
                    let startX = 0;
                    let startY = 0;
                    if (startHex) {
                        const startRect = startHex.getBoundingClientRect();
                        startX = startRect.left + startRect.width / 2;
                        startY = startRect.top + startRect.height / 2;
                    }

                    const targetRect = currentHexElement.getBoundingClientRect();
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

                    function createBurst(x, y) {
                        const burstContainer = document.createElement('div');
                        burstContainer.className = 'flag-impact-burst';
                        burstContainer.style.left = `${x}px`;
                        burstContainer.style.top = `${y}px`;

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
                    }

                    setTimeout(() => {
                        flyingFlag.style.animation = 'none';

                        flyingFlag.style.transition = 'transform 0.05s ease-out';
                        flyingFlag.style.transform = `translate3d(${tX}px, ${tY}px, 0) scale(1) rotate(-5deg)`;

                        createBurst(targetX, targetY);
                    }, 1300);

                    setTimeout(() => {
                        flyingFlag.remove();

                        flagElem.style.display = 'block';
                        flagElem.style.animation = 'flagAppear 0.05s forwards';

                        setTimeout(() => {
                            flagElem.style.animation = '';
                            flagElem.classList.add('active-flag');
                        }, 50);
                    }, 1300);

                    setTimeout(() => {
                        createBurst(targetX - 45, targetY + 40);
                    }, 1430);

                    setTimeout(() => {
                        createBurst(targetX + 45, targetY - 40);
                    }, 1610);

                } else {
                    flagElem.style.display = 'block';
                    flagElem.classList.add('active-flag');
                }
            } else {
                flagElem.style.display = 'none';
                flagElem.classList.remove('active-flag');
                flagElem.style.animation = '';
            }
        }
    }

    if (currentShape) {
        if (colorVal !== 'transparent') {
            currentShape.style.backgroundColor = convertHexToRgba(colorVal, 0.37);
        } else {
            currentShape.style.backgroundColor = 'rgba(255, 255, 255, 0)';
        }
    }

    mapData[currentHexId] = {
        title: titleVal,
        text: descVal,
        color: colorVal,
        difficulty: diffVal,
        explored: exploredVal,
        mapMapped: mapMappedVal,
        squadHere: squadHereVal,
        type: typeVal,
        terrain: terrainVal,
        regionLevel: regionLevelVal,
        hasVisited: squadHereVal || (mapData[currentHexId] && mapData[currentHexId].hasVisited),
        lastSaved: new Date().toLocaleString(),
        questData: questTitleVal ? {
            title: questTitleVal,
            desc: questDescVal,
            status: questStatusVal
        } : null
    };

    localStorage.setItem('hexMapSystemData', JSON.stringify(mapData));

    const questLog = document.getElementById('questLogContainer');
    if (questLog && !questLog.classList.contains('ui-collapsed')) {
        const activeTab = document.querySelector('.quest-tab-btn.active');
        renderQuestLog(activeTab && activeTab.id === 'tabCompletedQuests' ? 'completed' : 'active');
    }

    for (let id in mapData) {
        const vHex = document.getElementById('visual_' + id);
        if (vHex) {
            const data = mapData[id];
            if (data && (data.explored || data.hasVisited)) {
                vHex.classList.remove('fog-active');
            } else {
                vHex.classList.add('fog-active');
            }
        }
    }

    closeMenu();
}

const btnSave = document.getElementById('btnSave');
if (btnSave) btnSave.addEventListener('click', saveMenu);

const btnCancel = document.getElementById('btnCancel');
if (btnCancel) btnCancel.addEventListener('click', closeMenu);

document.getElementById('btnDelete').addEventListener('click', function() {
    if (!currentHexId) return;
    
    delete mapData[currentHexId];
    localStorage.setItem('hexMapSystemData', JSON.stringify(mapData));

    const shape = document.getElementById('shape_' + currentHexId);
    const label = document.getElementById('label_' + currentHexId);
    
    if (shape) shape.style.backgroundColor = 'rgba(255, 255, 255, 0)';
    if (label) label.textContent = '';

    closeMenu();
});

modal.addEventListener('click', function(e) {
    if (e.target === modal) { closeMenu(); }
});

document.getElementById('mapImg').addEventListener('click', function() {
    if (!hasMoved) closeMenu();
});

function initColorPresets() {
    const container = document.getElementById('colorPresetsContainer');
    if (!container || container.children.length > 0) return; 
    
    const presets = [
        { color: 'transparent', label: '✖' },
        { color: '#2ecc71', label: '' },
        { color: '#3498db', label: '' },
        { color: '#e74c3c', label: '' },
        { color: '#f1c40f', label: '' },
        { color: '#9b59b6', label: '' },
        { color: '#e67e22', label: '' }
    ];

    presets.forEach(p => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'color-preset-btn';
        if(p.color === 'transparent') {
            b.classList.add('transparent-preset');
            b.textContent = p.label;
        } else {
            b.style.backgroundColor = p.color;
        }
        b.addEventListener('click', () => {
            document.getElementById('inpColor').value = p.color;
            container.querySelectorAll('.color-preset-btn').forEach(x => x.classList.remove('active'));
            b.classList.add('active');
        });
        container.appendChild(b);
    });
}

document.getElementById('btnExport').addEventListener('click', function() {
    const jsonString = JSON.stringify(mapData, null, 4);
    const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
    const dataStr = URL.createObjectURL(blob);

    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "map_data.json");
    document.body.appendChild(downloadAnchor);
    
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(dataStr); 
});

const fileInput = document.getElementById('fileInput');
document.getElementById('btnImport').addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', function(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
        try {
            mapData = JSON.parse(evt.target.result);
            localStorage.setItem('hexMapSystemData', JSON.stringify(mapData));
            buildHexGrid(); 
            alert('Данные успешно импортированы!');
        } catch (err) {
            alert('Ошибка при чтении JSON файла.');
        }
        fileInput.value = ''; 
    };
    reader.readAsText(files[0]); 
});

document.addEventListener('DOMContentLoaded', () => {
    groupMenuFields();

    initializeMusicPlayer();
    initColorPresets();
    populateDifficultySelect();
    buildHexGrid();

    setTimeout(() => {
        updateMapTransform();
        const frame = document.querySelector('.kingmaker-frame');
        if (frame) frame.style.opacity = '1';
    }, 150);
});

window.addEventListener('resize', () => {
    if (typeof updateMapTransform === 'function') {
        updateMapTransform();
    }
});

let currentZoom = 1.0;
const minZoom = 0.5;
const maxZoom = 3.0;

const viewport = document.getElementById('viewport');
const mapContainer = document.getElementById('mapContainer');

let isDragging = false;
let hasMoved = false; 
let startX, startY;

let x = 0;
let y = 0;

if (viewport && mapContainer) {

    viewport.addEventListener('touchstart', (e) => {

        if (e.target.closest('.pop-menu') || e.target.closest('button') || e.target.closest('.player-container') || e.target.closest('select') || e.target.closest('input')) return;

        isDragging = true;
        hasMoved = false;

        const touch = e.touches[0];
        startX = touch.pageX - x;
        startY = touch.pageY - y;
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
        if (!isDragging) return;

        if (e.cancelable) e.preventDefault();

        const touch = e.touches[0];
        let newX = touch.pageX - startX;
        let newY = touch.pageY - startY;

        if (Math.abs(newX - x) > 3 || Math.abs(newY - y) > 3) {
            hasMoved = true;
        }

        const maxLimitX = 3840 * 1.5;
        const minLimitX = -3840 * 1.5;
        const maxLimitY = 1280 * 1.1;
        const minLimitY = -1280 * 1.1;

        x = Math.max(minLimitX, Math.min(maxLimitX, newX));
        y = Math.max(minLimitY, Math.min(maxLimitY, newY));

        updateMapTransform();
    }, { passive: false });

    viewport.addEventListener('touchend', () => {
        isDragging = false;
        setTimeout(() => { hasMoved = false; }, 50);
    });

    viewport.addEventListener('touchcancel', () => {
        isDragging = false;
    });

    mapContainer.style.transformOrigin = '100% 0';

    const frame = document.querySelector('.kingmaker-frame');

    function updateMapTransform() {
        mapContainer.style.transform = `translate(${x}px, ${y}px) scale(${currentZoom})`;

        if (frame && viewport && mapContainer) {
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
                frame.style.display = 'block';

                let frameLeft = cleanLeft - borderWidth;
                let frameTop = cleanTop - borderWidth;
                let frameWidth = baseWidth + (borderWidth * 2);
                let frameHeight = baseHeight + (borderWidth * 2);

                if (frameLeft < viewRect.left) {
                    frameWidth -= (viewRect.left - frameLeft);
                    frameLeft = viewRect.left;
                }
                if (frameTop < viewRect.top) {
                    frameHeight -= (viewRect.top - frameTop);
                    frameTop = viewRect.top;
                }
                if (frameLeft + frameWidth > viewRect.right) {
                    frameWidth = viewRect.right - frameLeft;
                }
                if (frameTop + frameHeight > viewRect.bottom) {
                    frameHeight = viewRect.bottom - frameTop;
                }

                frame.style.left = `${Math.floor(frameLeft)}px`;
                frame.style.top = `${Math.floor(frameTop)}px`;
                frame.style.width = `${Math.ceil(frameWidth)}px`;
                frame.style.height = `${Math.ceil(frameHeight)}px`;

                updateFrameRunes(Math.ceil(frameWidth), Math.ceil(frameHeight));

                const clipLeft = Math.max(0, viewRect.left - mapRect.left) / currentZoom;
                const clipTop = Math.max(0, viewRect.top - mapRect.top) / currentZoom;
                const clipRight = Math.max(0, mapRect.right - viewRect.right) / currentZoom;
                const clipBottom = Math.max(0, mapRect.bottom - viewRect.bottom) / currentZoom;

                mapContainer.style.clipPath = `inset(${clipTop}px ${clipRight}px ${clipBottom}px ${clipLeft}px)`;
            } else {
                frame.style.display = 'none';
                mapContainer.style.clipPath = 'none';
            }

            viewport.style.clipPath = 'none';
        }
    }

    viewport.addEventListener('mousedown', (e) => {
        if (e.target.closest('.pop-menu') || e.target.closest('button') || e.target.closest('.player-container') || e.target.closest('select') || e.target.closest('input')) return;

        isDragging = true;
        hasMoved = false;

        startX = e.pageX - x;
        startY = e.pageY - y;
    });

    viewport.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();

        let newX = e.pageX - startX;
        let newY = e.pageY - startY;

        if (Math.abs(newX - x) > 3 || Math.abs(newY - y) > 3) {
            hasMoved = true;
        }

        const maxLimitX = 3840 * 1.5;
        const minLimitX = -3840 * 1.5;
        const maxLimitY = 1280 * 1.1;
        const minLimitY = -1280 * 1.1;

        x = Math.max(minLimitX, Math.min(maxLimitX, newX));
        y = Math.max(minLimitY, Math.min(maxLimitY, newY));

        updateMapTransform();
    });

    viewport.addEventListener('mouseleave', () => {
        isDragging = false;
    });

    viewport.addEventListener('mouseup', () => {
        isDragging = false;
        setTimeout(() => { hasMoved = false; }, 50);
    });

    viewport.addEventListener('wheel', (e) => {
        e.preventDefault();

        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = currentZoom * delta;

        if (newZoom >= minZoom && newZoom <= maxZoom) {
            currentZoom = newZoom;
            updateMapTransform();
        }
    }, { passive: false });
}

const btnToggle = document.getElementById('btnToggleLegend');
const legendCont = document.getElementById('legendContainer');

if (btnToggle && legendCont) {
    btnToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        legendCont.classList.toggle('open');
        btnToggle.textContent = legendCont.classList.contains('open') ? '🔽' : '🔼';
        console.log("Легенда переключена!");
    });

    const header = document.querySelector('.legend-header');
    if (header) {
        header.style.cursor = 'pointer';
        header.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            legendCont.classList.toggle('open');
            btnToggle.textContent = legendCont.classList.contains('open') ? '🔽' : '🔼';
            console.log("Легенда нажата по заголовку!");
        });
    }
} else {
    console.error("Ошибка: Элементы легенды не найдены в DOM! Проверьте правильность вставки HTML.");
}

const RUNE_POOL = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛟ', 'ᛞ'];

let lastFrameWidth = 0;
let lastFrameHeight = 0;

function updateFrameRunes(width, height) {
    if (width === lastFrameWidth && height === lastFrameHeight) return;

    lastFrameWidth = width;
    lastFrameHeight = height;

    const frame = document.querySelector('.kingmaker-frame');
    if (!frame) return;

    frame.querySelectorAll('.hex-rune').forEach(el => el.remove());

    const step = 50;
    const padding = 20;

    const cTop = -11;
    const cLeft = -11;
    const cBottom = height - 33;
    const cRight = width - 33;

    function createRune(left, top) {
        const runeElement = document.createElement('div');
        runeElement.className = 'hex-rune';

        runeElement.style.left = `${left}px`;
        runeElement.style.top = `${top}px`;
        runeElement.style.transform = 'translate(-50%, -50%)';

        runeElement.style.animationDelay = `${Math.random() * -5}s`;

        runeElement.textContent = RUNE_POOL[Math.floor(Math.random() * RUNE_POOL.length)];
        frame.appendChild(runeElement);
    }

    const innerWidth = width - 44;
    const innerHeight = height - 44;

    for (let l = padding; l < innerWidth - padding; l += step) { createRune(l, cTop); }
    for (let l = padding; l < innerWidth - padding; l += step) { createRune(l, cBottom); }
    for (let t = padding; t < innerHeight - padding; t += step) { createRune(cLeft, t); }
    for (let t = padding; t < innerHeight - padding; t += step) { createRune(cRight, t); }
}

let currentFrameStyle = localStorage.getItem('kingmakerFrameStyle') || 'norunes';

function initFrameStyleControls() {
    if (document.querySelector('.frame-style-controls')) return;

    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'frame-style-controls';

    const styles = [
        { id: 'norunes', icon: '🔲', title: 'Рамка: Без рун' },
        { id: 'runes', icon: 'ᚱ', title: 'Рамка: С рунами' },
        { id: 'ornament', icon: '⚜️', title: 'Рамка: Орнамент' }
    ];

    const getCurrentIndex = () => styles.findIndex(s => s.id === currentFrameStyle);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-frame-style active';
    btn.style.width = '100%';

    function updateButtonUI() {
        const currentStyle = styles[getCurrentIndex()] || styles[0];
        btn.innerHTML = `${currentStyle.icon} Стиль`;
        btn.title = currentStyle.title;
    }

    btn.addEventListener('click', () => {
        let nextIdx = getCurrentIndex() + 1;
        if (nextIdx >= styles.length) nextIdx = 0;

        currentFrameStyle = styles[nextIdx].id;
        localStorage.setItem('kingmakerFrameStyle', currentFrameStyle);

        updateButtonUI();
        applyFrameStyle();
    });

    updateButtonUI();

    controlsContainer.appendChild(btn);
    document.body.appendChild(controlsContainer);
    applyFrameStyle();
}

function applyFrameStyle() {
    const frame = document.querySelector('.kingmaker-frame');
    if (!frame) return;

    frame.classList.remove('frame-style-runes', 'frame-style-norunes', 'frame-style-ornament');
    frame.classList.add(`frame-style-${currentFrameStyle}`);

    const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    corners.forEach(cClass => {
        if (!frame.querySelector(`.${cClass}`)) {
            const corner = document.createElement('div');
            corner.className = `frame-corner ${cClass}`;
            frame.appendChild(corner);
        }
    });

    if (currentFrameStyle === 'runes') {
        if (typeof lastFrameWidth !== 'undefined' && typeof lastFrameHeight !== 'undefined') {
            lastFrameWidth = 0;
            lastFrameHeight = 0;
            updateFrameRunes(frame.offsetWidth, frame.offsetHeight);
        }
    } else {
        frame.querySelectorAll('.hex-rune').forEach(el => el.remove());
    }
}

const originalUpdateFrameRunes = updateFrameRunes;
updateFrameRunes = function(width, height) {
    if (currentFrameStyle !== 'runes') {
        const frame = document.querySelector('.kingmaker-frame');
        if (frame) frame.querySelectorAll('.hex-rune').forEach(el => el.remove());
        return;
    }
    if (typeof originalUpdateFrameRunes === 'function') {
        originalUpdateFrameRunes(width, height);
    }
};

function initUnifiedUICollapse() {
    const player = document.querySelector('.music-controller');
    const btnExport = document.getElementById('btnExport');
    const btnImport = document.getElementById('btnImport');
    const styleControls = document.querySelector('.frame-style-controls');
    const mapControls = document.querySelector('.map-selector-controls');
    const btnToggleFog = document.getElementById('btnToggleFog');
    const btnMapGlobal = document.getElementById('btnMapGlobal');
    const btnMapCamp = document.getElementById('btnMapCamp');
    const questLog = document.getElementById('questLogContainer');

    let rightPanel = document.querySelector('.right-controls-panel');
    if (!rightPanel) {
        rightPanel = document.createElement('div');
        rightPanel.className = 'right-controls-panel ui-collapsed';
        document.body.appendChild(rightPanel);
    }

    if (btnExport) rightPanel.appendChild(btnExport);
    if (btnImport) rightPanel.appendChild(btnImport);
    if (styleControls) rightPanel.appendChild(styleControls);
    if (player) player.classList.add('ui-collapsed');
    if (mapControls) mapControls.classList.add('ui-collapsed');
    if (btnToggleFog) btnToggleFog.classList.add('ui-collapsed');
    if (btnMapGlobal) btnMapGlobal.classList.add('ui-collapsed');
    if (btnMapCamp) btnMapCamp.classList.add('ui-collapsed');
    if (questLog) questLog.classList.add('ui-collapsed');

    if (!document.querySelector('.master-toggle-btn')) {
        const toggleMasterBtn = document.createElement('button');
        toggleMasterBtn.type = 'button';
        toggleMasterBtn.className = 'btn-ui-toggle master-toggle-btn';
        toggleMasterBtn.innerHTML = '⚙️';
        toggleMasterBtn.title = 'Показать/скрыть интерфейс управления';
        document.body.appendChild(toggleMasterBtn);

        toggleMasterBtn.addEventListener('click', () => {
            const isCollapsed = rightPanel.classList.toggle('ui-collapsed');

            if (player) player.classList.toggle('ui-collapsed', isCollapsed);
            if (mapControls) mapControls.classList.toggle('ui-collapsed', isCollapsed);
            if (btnToggleFog) btnToggleFog.classList.toggle('ui-collapsed', isCollapsed);
            if (btnMapGlobal) btnMapGlobal.classList.toggle('ui-collapsed', isCollapsed);
            if (btnMapCamp) btnMapCamp.classList.toggle('ui-collapsed', isCollapsed);
            if (questLog) {
                questLog.classList.toggle('ui-collapsed', isCollapsed);
                if (!isCollapsed) renderQuestLog('active');
            }

            toggleMasterBtn.classList.toggle('ui-active', !isCollapsed);
        });
    }

    initQuestLogTabs();
    if (questLog && !questLog.querySelector('.btn-close-quest-log')) {
        const header = questLog.querySelector('.quest-log-header');
        if (header) {
            header.style.position = 'relative';

            const closeBtn = document.createElement('button');
            closeBtn.type = 'button';
            closeBtn.className = 'btn-close-quest-log';
            closeBtn.innerHTML = '✖';
            closeBtn.title = 'Закрыть журнал заданий';

            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                questLog.classList.add('ui-collapsed');

                const toggleMasterBtn = document.querySelector('.master-toggle-btn');
                if (toggleMasterBtn && rightPanel && rightPanel.classList.contains('ui-collapsed')) {
                    toggleMasterBtn.classList.remove('ui-active');
                }
            });

            header.appendChild(closeBtn);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initFrameStyleControls();
    initUnifiedUICollapse();
});

let currentQuestFilter = 'active';

function initQuestLogTabs() {
    const tabActive = document.getElementById('tabActiveQuests');
    const tabCompleted = document.getElementById('tabCompletedQuests');

    if (tabActive && tabCompleted) {
        tabActive.addEventListener('click', () => {
            tabActive.classList.add('active');
            tabCompleted.classList.remove('active');
            currentQuestFilter = 'active';
            renderQuestLog('active');
        });
        tabCompleted.addEventListener('click', () => {
            tabCompleted.classList.add('active');
            tabActive.classList.remove('active');
            currentQuestFilter = 'completed';
            renderQuestLog('completed');
        });
    }
}

function renderQuestLog(filterStatus = 'active') {
    const listContainer = document.getElementById('questLogList');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    let count = 0;

    for (let hexId in mapData) {
        const hex = mapData[hexId];
        if (hex && hex.questData && hex.questData.status === filterStatus) {
            count++;
            const questItem = document.createElement('div');
            questItem.className = `quest-log-item status-${filterStatus}`;

            let objIcon = '⚜️';
            if (hex.type === 'landmark') objIcon = '🏛️';
            if (hex.type === 'resource') objIcon = '💎';
            if (hex.type === 'mystery') objIcon = '❓';

            questItem.innerHTML = `
                <div class="quest-item-title">${objIcon} ${hex.questData.title}</div>
                <div class="quest-item-location">📍 Регион: ${hex.title || hexId.replace('hex_', 'Гекс ')}</div>
                ${hex.questData.desc ? `<div class="quest-item-desc">${hex.questData.desc.replace(/\n/g, '<br>')}</div>` : ''}
            `;

            questItem.addEventListener('click', () => {
                focusOnHex(hexId);

                const questLog = document.getElementById('questLogContainer');
                if (questLog) {
                    questLog.classList.add('ui-collapsed');
                }

            });

            listContainer.appendChild(questItem);
        }
    }

    if (count === 0) {
        listContainer.innerHTML = `<div class="quest-log-empty">Нет заданий в этой категории</div>`;
    }
}

function focusOnHex(hexId) {
    const vHex = document.getElementById('visual_' + hexId);
    if (!vHex) return;

    isDragging = false;
    hasMoved = false;

    vHex.classList.add('hex-focused-flash');
    setTimeout(() => {
        vHex.classList.remove('hex-focused-flash');
    }, 3600);
}

function groupMenuFields() {
    const inpType = document.getElementById('inpType');
    const inpTerrain = document.getElementById('inpTerrain');
    const difficultySelect = document.getElementById('inpDifficulty');
    const inpRegionLevel = document.getElementById('inpRegionLevel');

    if (!inpType || !inpTerrain || !difficultySelect || !inpRegionLevel) return;

    const boxType = inpType.closest('.box');
    const boxTerrain = inpTerrain.closest('.box');
    const boxDiff = difficultySelect.closest('.box');
    const boxLevel = inpRegionLevel.closest('.box');

    if (boxType && boxTerrain) {
        const rowObjects = document.createElement('div');
        rowObjects.className = 'box-row-combined';
        boxType.parentNode.insertBefore(rowObjects, boxType);
        rowObjects.appendChild(boxType);
        rowObjects.appendChild(boxTerrain);
    }

    if (boxDiff && boxLevel) {
        const rowStats = document.createElement('div');
        rowStats.className = 'box-row-combined';
        boxDiff.parentNode.insertBefore(rowStats, boxDiff);
        rowStats.appendChild(boxDiff);
        rowStats.appendChild(boxLevel);
    }
}
