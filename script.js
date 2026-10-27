// ========================================================
// ЧАСТЬ 1: ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И МУЗЫКАЛЬНЫЙ ДВИЖОК
// ========================================================
let currentSquadHex = localStorage.getItem('hexMapSquadLocation') || null;
const hexRadius = 78;
const rows = 12;
const cols = 30;
const offsetX = 29;
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

const playlist = [
    "audio/main_theme.mp3",
    "audio/02_beginning.mp3",
    "audio/03_exploring_the_stolen_lands.mp3",
    "audio/04_bittersweet_nyrissas_theme.mp3",
    "audio/05_peaceful_lands.mp3",
    "audio/06_the_shrike_hills.mp3",
    "audio/07_hills_of_glenebon.mp3",
    "audio/08_twilight_at_glenebon.mp3",
    "audio/09_the_narlmarches.mp3",
    "audio/10_sunset_at_the_narlmarches.mp3",
    "audio/11_dawn_at_the_narlmarches.mp3",
    "audio/12_old_sycamore_caves.mp3",
    "audio/13_thousand_grains.mp3",
    "audio/14_city_of_hollow_eyes.mp3",
    "audio/15_tomb_of_the_iron_lords_champion.mp3",
    "audio/16_the_dunsward.mp3",
    "audio/17_sunset_at_the_dunsward.mp3",
    "audio/18_dawn_at_the_dunsward.mp3",
    "audio/19_the_tarnished_jewel_pitax_theme.mp3",
    "audio/20_the_coronation.mp3",
    "audio/21_rule_of_chaos.mp3",
    "audio/22_rule_of_balance.mp3",
    "audio/23_rule_of_order.mp3",
    "audio/24_rule_of_good.mp3",
    "audio/25_rule_of_evil.mp3",
    "audio/26_steps_of_the_goddess.mp3",
    "audio/27_the_art_of_ruling.mp3",
    "audio/28_season_of_bloom.mp3",
    "audio/29_canvas_for_the_gods.mp3",
    "audio/30_where_trees_talk_to_the_stars.mp3",
    "audio/31_the_echo_born_before_the_sound.mp3",
    "audio/32_blade_of_your_own_choices.mp3",
    "audio/33_bold_dog_barks_loud.mp3",
    "audio/34_skylark.mp3",
    "audio/35_who_rules_your_heart.mp3",
    "audio/36_brevoy_folk_melody_tavern_theme_1.mp3",
    "audio/37_the_heart_of_the_land_tavern_theme_2.mp3",
    "audio/38_fey_in_the_hills_tavern_theme_3.mp3",
    "audio/39_lazy_morning_tavern_theme_4.mp3",
    "audio/40_rushlight_festival_tavern_theme_5.mp3",
    "audio/41_lake_of_mists_and_veils_tavern_theme_6.mp3",
    "audio/42_the_shrike_hills_battle_theme.mp3",
    "audio/43_uplands_battle_theme.mp3",
    "audio/44_the_dunsward_battle_theme.mp3",
    "audio/45_the_narlmarches_battle_theme.mp3",
    "audio/46_dungeon_battle_theme_1.mp3",
    "audio/47_dungeon_battle_theme_2.mp3",
    "audio/48_first_world_battle_theme.mp3",
    "audio/49_capital_under_attack.mp3",
    "audio/50_ancient_ruins_battle_theme.mp3",
    "audio/51_caves_battle_theme.mp3",
    "audio/52_in_the_name_of_my_dream_stag_lord_battle_theme.mp3",
    "audio/53_dur_borba_hargulka_battle_theme.mp3",
    "audio/54_relic_of_a_crumbled_empire_vordakai_battle_theme.mp3",
    "audio/55_false_destiny_armag_battle_theme.mp3",
    "audio/56_the_proud_the_bitter_the_fallen_nyrissa_battle_theme.mp3",
    "audio/57_the_doomsayer.mp3",
    "audio/58_the_laughing_lie.mp3",
    "audio/59_he_who_leads_the_hunt.mp3",
    "audio/60_a_string_that_holds_the_world_in_place.mp3",
    "audio/61_the_art_of_illusion.mp3",
    "audio/62_varnholds_dawn.mp3"
];
let currentTrackIdx = 0;
let isLooping = false;

function formatTrackName(filename) {
    let name = filename.replace('.mp3', '');
    name = name.replace(/_/g, ' ');
    name = name.replace(/audio\//gi, '').replace(/\s+/g, ' ').trim();
    return name.charAt(0).toUpperCase() + name.slice(1);
}
function initializeMusicPlayer() {
    if (!audioPlayer) return;
    audioPlayer.volume = 0.25;

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
    const trackName = formatTrackName(playlist[currentTrackIdx]);
    if (isPlayingNow) {
        musicButton.innerHTML = `⏸ Пауза: <span style="font-size:13px;font-weight:normal;">${trackName}</span>`;
        musicButton.style.backgroundColor = '#e74c3c'; musicButton.style.color = '#fff';
    } else {
        musicButton.innerHTML = `🎵 Включить музыку`; musicButton.style.backgroundColor = ''; musicButton.style.color = '';
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
// ========================================================
// ЧАСТЬ 2: ГЕНЕРАЦИЯ СЕТКИ ГЕКСОВ И ИНТЕРАКТИВНЫЙ ТУЛТИП
// ========================================================
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
            if (r % 2 !== 0) { cx += widthBetweenHexes / 2; }

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

            vHex.addEventListener('click', function(e) {
                e.preventDefault(); e.stopPropagation();
                if (hasMoved) return;
                if (modal.classList.contains('open')) { closeMenu(); } else { openMenu(hexId); }
            });

            const tooltip = document.getElementById('hexTooltip');
            vHex.addEventListener('mouseenter', function(e) {
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
                        else if (data.type === 'quest') typeIcon = '✔ ';
                        else if (data.type === 'mystery') typeIcon = '❓ ';
                        let terrainIcon = '';
                        if (data.terrain === 'swamp') terrainIcon = '🐸 ';
                        else if (data.terrain === 'forest') terrainIcon = '🌲 ';
                        else if (data.terrain === 'water') terrainIcon = '🌊 ';
                        else if (data.terrain === 'arctic') terrainIcon = '❄ ';
                        else if (data.terrain === 'mountain') terrainIcon = '⛰ ';
                        else if (data.terrain === 'plains') terrainIcon = '🌾 ';
                        content += `<div class="tooltip-title">${terrainIcon}${star}${mapIcon}${typeIcon}${data.title}${statsLabel}</div>`;
                    }
                    let paramsBlock = '';
                    paramsBlock += `<div style="margin-bottom: 4px;">${data.explored ? '🔍 <b>Разведан</b>' : '❌ <b>Не разведан</b>'}</div>`;
                    paramsBlock += `<div style="margin-bottom: 4px;">${data.mapMapped ? '📜 <b>Карта составлена</b>' : '✖ <b>Карта отсутствует</b>'}</div>`;
                    if (data.squadHere) paramsBlock += `<div style="margin-bottom: 4px; color: #ff7675;">🚩 <b>Отряд в гексе</b></div>`;
                    if (data.difficulty) paramsBlock += `<div style="margin-bottom: 4px;">🎲 <b>Сложность региона:</b> СЛ ${data.difficulty}</div>`;
                    if (data.regionLevel) paramsBlock += `<div style="margin-bottom: 4px;">💀 <b>Уровень региона:</b> Уровень ${data.regionLevel}</div>`;
                    if (data.type) {
                        let typeText = ''; let tIcon = '';
                        if (data.type === 'landmark') { tIcon = '🏛️'; typeText = 'Достопримечательность'; }
                        if (data.type === 'resource') { tIcon = '💎'; typeText = 'Ресурс'; }
                        if (data.type === 'quest') { tIcon = '⚜️'; typeText = 'Стандартное задание'; }
                        if (data.type === 'mystery') { tIcon = '❓'; typeText = 'Тайна'; }
                        paramsBlock += `<div style="margin-bottom: 4px;">${tIcon} <b>Объект:</b> ${typeText}</div>`;
                    }
                    if (data.terrain) {
                        let terrainText = ''; let terrIcon = '';
                        if (data.terrain === 'swamp') { terrIcon = '🐸'; terrainText = 'Болото (СЛ 14)'; }
                        if (data.terrain === 'forest') { terrIcon = '🌲'; terrainText = 'Лес (СЛ 14)'; }
                        if (data.terrain === 'water') { terrIcon = '🌊'; terrainText = 'Вода (СЛ 17)'; }
                        if (data.terrain === 'arctic') { terrIcon = '❄'; terrainText = 'Приполярье (СЛ 17)'; }
                        if (data.terrain === 'mountain') { terrIcon = '⛰️'; terrainText = 'Горы (СЛ 16)'; }
                        if (data.terrain === 'plains') { terrIcon = '🌾'; terrainText = 'Равнины (СЛ 12)'; }
                        paramsBlock += `<div style="margin-bottom: 4px;">${terrIcon} <b>Местность:</b> ${terrainText}</div>`;
                    }
                    content += `<div style="font-size: 16px; color: #ccc; margin: 8px 0 12px 0; line-height: 1.3;">${paramsBlock}</div>`;
                    if (data.text) {
                        content += `<div style="border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 8px;" class="tooltip-desc">${data.text.replace(/\n/g, '<br>')}</div>`;
                    }
                    tooltip.innerHTML = content;
                    tooltip.style.display = 'block';
                }
            });

            vHex.addEventListener('mousemove', (e) => {
                if (tooltip) { tooltip.style.left = (e.clientX + 25) + 'px'; tooltip.style.top = (e.clientY + 25) + 'px'; }
            });

            vHex.addEventListener('mouseleave', () => {
                if (tooltip) { tooltip.style.display = 'none'; tooltip.innerHTML = ''; }
            });

            const shape = document.createElement('div');
            shape.className = 'hex-shape';
            shape.setAttribute('id', 'shape_' + hexId);
            if (mapData[hexId] && mapData[hexId].color) shape.style.backgroundColor = convertHexToRgba(mapData[hexId].color, 0.37);
            if (mapData[hexId] && mapData[hexId].squadHere) vHex.classList.add('squad-dark');
            vHex.appendChild(shape);

            // СОЗДАЕМ ВСЕ ЭЛЕМЕНТЫ (ВСЕГДА)
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

            // ЗАПОЛНЯЕМ ДАННЫМИ
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

// ========================================================
// ЧАСТЬ 3: МОДАЛЬНОЕ ОКНО, ЦВЕТА, ИМПОРТ/ЭКСПОРТ И DRAG & DROP
// ========================================================
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
    modal.classList.remove('open');
    currentHexId = null;
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

    const currentHexElement = document.getElementById('visual_' + currentHexId);
    const currentShape = document.getElementById('shape_' + currentHexId);

    // ============================================================
    // ЛОГИКА ПЕРЕМЕЩЕНИЯ ОТРЯДА (Один отряд на карте)
    // ============================================================
    if (squadHereVal) {
        for (let id in mapData) {
            // Если это не текущий гекс И в этом гексе отряд уже стоит
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
    // ============================================================

    if (currentHexElement) {
        // 1. Затемнение гекса
        if (squadHereVal) {
            currentHexElement.classList.add('squad-dark');
        } else {
            currentHexElement.classList.remove('squad-dark');
        }

        // 2. Текст заголовка
        const tLabel = currentHexElement.querySelector('.hex-title-label');
        if (tLabel) tLabel.textContent = titleVal;

        // 3. Текст характеристик (СЛ и lvl)
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

        // 4. Иконка типа объекта
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

        // 5. Иконка типа местности
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

        // Обновляем статус Разведан
        const exploredElem = currentHexElement.querySelector('.explored-icon-container');
        if (exploredElem) {
            exploredElem.style.display = exploredVal ? 'block' : 'none';
            exploredElem.textContent = exploredVal ? '🔍' : '';
        }

        // Обновляем статус Карта
        const mappedElem = currentHexElement.querySelector('.mapped-icon-container');
        if (mappedElem) {
            mappedElem.style.display = mapMappedVal ? 'block' : 'none';
            mappedElem.textContent = mapMappedVal ? '📜' : '';
        }

        // 6. Флажок отряда
        const flagElem = currentHexElement.querySelector('.squad-flag-container');
        if (flagElem) {
            if (squadHereVal) {
                flagElem.style.display = 'block';
                flagElem.classList.add('active-flag');
            } else {
                flagElem.style.display = 'none';
                flagElem.classList.remove('active-flag');
            }
        }
    }

    // Обновляем цвет подложки
    if (currentShape) {
        if (colorVal !== 'transparent') {
            currentShape.style.backgroundColor = convertHexToRgba(colorVal, 0.37);
        } else {
            currentShape.style.backgroundColor = 'rgba(255, 255, 255, 0)';
        }
    }

    // Сохраняем всё в объект
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
        regionLevel: regionLevelVal
    };

    // Сохраняем в локальное хранилище
    localStorage.setItem('hexMapSystemData', JSON.stringify(mapData));

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
        { color: '#2ecc71', label: '' }, // Зеленый
        { color: '#3498db', label: '' }, // Синий
        { color: '#e74c3c', label: '' }, // Красный
        { color: '#f1c40f', label: '' }, // Желтый
        { color: '#9b59b6', label: '' }, // Фиолетовый
        { color: '#e67e22', label: '' }  // Оранжевый
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
     initializeMusicPlayer();    
     initColorPresets();        
     populateDifficultySelect(); 
     buildHexGrid();            
});

let currentZoom = 1.0;
const minZoom = 0.5;
const maxZoom = 3.0;

const viewport = document.getElementById('viewport');
const mapContainer = document.getElementById('mapContainer');

let isDragging = false;
let hasMoved = false; 
let startX, startY;

if (viewport && mapContainer) {
    // Функция обновления трансформации карты
    function updateMapTransform() {
        mapContainer.style.transform = `translate(${x}px, ${y}px) scale(${currentZoom})`;
    }

    // Переопределяем переменные x и y для работы с масштабом
    let x = 0;
    let y = 0;

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

        // Рассчитываем новые координаты с учетом масштаба
        x = e.pageX - startX;
        y = e.pageY - startY;

        if (Math.abs(x) > 3 || Math.abs(y) > 3) {
            hasMoved = true;
        }

        updateMapTransform();
    });

    viewport.addEventListener('mouseleave', () => {
        isDragging = false;
    });

    viewport.addEventListener('mouseup', () => {
        isDragging = false;
        setTimeout(() => { hasMoved = false; }, 50);
    });

    // Добавление Zoom через колесо мыши
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

// Логика открытия/закрытия легенды
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

    // Добавляем кликабельность на весь заголовок
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