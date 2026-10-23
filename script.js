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

// ========================================
// ИНИЦИАЛИЗАЦИЯ МУЗЫКАЛЬНОГО ПЛЕЕРА (НОВЫЙ БЛОК)
// ========================================

const audioPlayer = document.getElementById('bg-music');
const musicButton = document.getElementById('btnMusic');
const loopButton = document.getElementById('btnLoop');
const playlistButton = document.getElementById('btnPlaylist');
const trackSelector = document.getElementById('trackSelectorStyle'); 
let isPlaying = false;
let currentTrackIndex = null;

/**
 * 1. Инициализация плеера: устанавливает обработчики и готовит данные.
 */
function initializeMusicPlayer() {
    // Назначаем обработчики событий для всех элементов управления музыкой
    musicButton.addEventListener('click', toggleMusic);
    loopButton.addEventListener('click', toggleLoop);
    playlistButton.addEventListener('click', openPlaylist);
    trackSelector.addEventListener('change', () => {
        const selectedPath = trackSelector.value;
        if (selectedPath) {
            // При смене трека - всегда стоп и загрузка нового источника
            stopMusic(); 
            audioPlayer.src = selectedPath;
            currentTrackIndex = null; // Сбрасываем индекс, так как это выбранный трек
            audioPlayer.load();
        } else {
             // Если выбрано по умолчанию или пусто - ничего не делаем
        }
    });

    // Инициализация состояния кнопок и плейлиста происходит позже в основном коде.
}


/**
 * 2. Управление воспроизведением музыки (Главная кнопка)
 */
function toggleMusic() {
    if (!audioPlayer || !trackSelector.value) {
        alert("Пожалуйста, выберите трек для начала.");
        return;
    }

    // Если играет - пауза / если не играет - воспроизведение
    if (isPlaying) {
        audioPlayer.pause();
    } else {
        // Воспроизведение, с обработкой ошибок автовоспроизведения
        audioPlayer.play().catch(error => {
            console.warn("Требуется взаимодействие пользователя для запуска аудио.");
            alert('⚠️ Внимание: Ваш браузер требует дополнительного взаимодействия (повторного нажатия) для воспроизведения медиа.');
        });
    }

    isPlaying = !isPlaying;
    updatePlayerState(isPlaying);
}


/**
 * 3. Управление циклом (Кнопка 🔁)
 */
function toggleLoop() {
    if (!audioPlayer || !trackSelector.value) return;

    // Меняем состояние loop и обновляем класс/текст
    const isLooped = audioPlayer.loop;
    audioPlayer.loop = !isLooped;
    
    if (audioPlayer.loop) {
        loopButton.classList.add('loop-active');
        loopButton.title = "Цикл ВКЛ";
    } else {
        loopButton.classList.remove('loop-active');
        loopButton.title = "Зациклить трек";
    }
}


/** 
 * 4. Остановка музыки (Сброс)
 */
function stopMusic() {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    isPlaying = false;
    loopButton.classList.remove('loop-active'); // Сбрасываем класс цикла
    updatePlayerState(false);
}

/**
 * Обновляет визуальное состояние кнопок плеера.
 */
function updatePlayerState(isPlayingNow) {
     if (!trackSelector.value) {
        musicButton.disabled = true;
        loopButton.disabled = true;
    } else {
        musicButton.disabled = false;
        // Логика для включения/выключения остальных кнопок при изменении состояния будет здесь, 
        // но пока достаточно базовой проверки воспроизведения.
    }
     if (isPlayingNow) {
         musicButton.style.backgroundColor = '#e74c3c'; // Красный - играет
     } else if (!audioPlayer.src || audioPlayer.currentTime === 0) {
          // Если ничего не загружено или остановлено с начала
         musicButton.style.backgroundColor = ''; 
     }
    
}


// ========================================
// ЛОГИКА КАРТЫ (Начало оригинального кода...)
// ========================================

function populateDifficultySelect() {
    const regionLevelSelect = document.getElementById('inpRegionLevel');
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

vHex.addEventListener('mouseenter', function(e) {
    if (mapData[hexId] && (mapData[hexId].title || mapData[hexId].text)) {
        const data = mapData[hexId];
        let content = '';
        
if (data.title) {
    const star = data.explored ? '⭐ ' : '';
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
    if (data.type === 'landmark') typeIcon = '🔍 ';
    else if (data.type === 'resource') typeIcon = '🪵 ';
    else if (data.type === 'quest') typeIcon = '✔ ';
    else if (data.type === 'mystery') typeIcon = '❓ ';

    let terrainIcon = '';
    if (data.terrain === 'swamp') terrainIcon = '🐊 ';
    else if (data.terrain === 'forest') terrainIcon = '🌲 ';
    else if (data.terrain === 'water') terrainIcon = '🌊 ';
    else if (data.terrain === 'arctic') terrainIcon = '❄ ';
    else if (data.terrain === 'mountain') terrainIcon = '⛰ ';
    else if (data.terrain === 'plains') terrainIcon = '🌾 ';

    content += `<div class="tooltip-title">${terrainIcon}${star}${mapIcon}${typeIcon}${data.title}${statsLabel}</div>`;
}

        let paramsBlock = '';

        paramsBlock += `<div style="margin-bottom: 4px;">${data.explored ? '⭐ <b>Разведан</b>' : '❌ <b>Не разведан</b>'}</div>`;
        paramsBlock += `<div style="margin-bottom: 4px;">${data.mapMapped ? '📜 <b>Карта составлена</b>' : '✖ <b>Карта отсутствует</b>'}</div>`;

		if (data.squadHere) {
    		paramsBlock += `<div style="margin-bottom: 4px; color: #ff7675;">⛺ <b>Отряд в гексе</b></div>`;
		}

        if (data.difficulty) {
            paramsBlock += `<div style="margin-bottom: 4px;">🎲 <b>Сложность региона:</b> СЛ ${data.difficulty}</div>`;
        }

        if (data.regionLevel) {
            paramsBlock += `<div style="margin-bottom: 4px;">💀 <b>Уровень региона:</b> Уровень ${data.regionLevel}</div>`;
        }

        if (data.type) {
            let typeText = '';
            let tIcon = '';
            if (data.type === 'landmark') { tIcon = '🔍'; typeText = 'Достопримечательность'; }
            if (data.type === 'resource') { tIcon = '🪵'; typeText = 'Ресурс'; }
            if (data.type === 'quest') { tIcon = '✔'; typeText = 'Стандартное задание'; }
            if (data.type === 'mystery') { tIcon = '❓'; typeText = 'Тайна'; }
            paramsBlock += `<div style="margin-bottom: 4px;">${tIcon} <b>Объект:</b> ${typeText}</div>`;
        }

        if (data.terrain) {
            let terrainText = '';
            let terrIcon = '';
            if (data.terrain === 'swamp') { terrIcon = '🐊'; terrainText = 'Болото (СЛ 14)'; }
            if (data.terrain === 'forest') { terrIcon = '🌲'; terrainText = 'Лес (СЛ 14)'; }
            if (data.terrain === 'water') { terrIcon = '🌊'; terrainText = 'Вода (СЛ 17)'; }
            if (data.terrain === 'arctic') { terrIcon = '❄'; terrainText = 'Приполярье (СЛ 17)'; }
            if (data.terrain === 'mountain') { terrIcon = '⛰'; terrainText = 'Горы (СЛ 16)'; }
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

vHex.addEventListener('mousemove', function(e) {
    tooltip.style.left = (e.clientX + 25) + 'px';
    tooltip.style.top = (e.clientY + 25) + 'px';
});

vHex.addEventListener('mouseleave', function() {
    tooltip.style.display = 'none';
    tooltip.innerHTML = '';
});
				
                const shape = document.createElement('div');
                shape.className = 'hex-shape';
                shape.setAttribute('id', 'shape_' + hexId);
                
                if (mapData[hexId] && mapData[hexId].color) {
                    shape.style.backgroundColor = convertHexToRgba(mapData[hexId].color, 0.17);
                }

				if (mapData[hexId] && mapData[hexId].squadHere) {
    				shape.classList.add('squad-dark');
				}
						
                vHex.appendChild(shape);

const label = document.createElement('span');
label.className = 'hex-text-label';
label.setAttribute('id', 'label_' + hexId);

if (mapData[hexId] && mapData[hexId].title) {
    const title = mapData[hexId].title;
    const diff = mapData[hexId].difficulty;
    const lvl = mapData[hexId].regionLevel;

    if (diff && lvl) {
        label.textContent = title + ' СЛ ' + diff + ' / lvl ' + lvl;
    } else if (diff) {
        label.textContent = title + ' СЛ ' + diff;
    } else if (lvl) {
        label.textContent = title + ' lvl ' + lvl;
    } else {
        label.textContent = title;
    }
}
vHex.appendChild(label);

                visualLayer.appendChild(vHex);
            }
        }
    }

    function convertHexToRgba(hex, alpha) {
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    }

function openMenu(hexId) {
    currentHexId = hexId;
    
    const inpExplored = document.getElementById('inpExplored');
    const inpMapMapped = document.getElementById('inpMapMapped');
    const inpSquadHere = document.getElementById('inpSquadHere'); // Ссылка на новый чекбокс
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
    
    inpSquadHere.checked = mapData[hexId] ? !!mapData[hexId].squadHere : false;

    inpColor.value = currentColor;
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

/**
 * Сохраняет данные гекса и обновляет название лейбла.
 */
function saveMenu() {
    if (!currentHexId) return;
    const titleVal = document.getElementById('inpTitle').value;
    const descVal = document.getElementById('inpDesc').value;
    const colorVal = document.getElementById('inpColor').value || 'transparent';
    const diffVal = difficultySelect.value;
    const exploredVal = document.getElementById('inpExplored').checked;
    const mapMappedVal = document.getElementById('inpMapMapped').checked;
    const squadHereVal = document.getElementById('inpSquadHere').checked; // Считываем галочку
    const typeVal = document.getElementById('inpType').value;
    const terrainVal = document.getElementById('inpTerrain').value;
    const regionLevelVal = document.getElementById('inpRegionLevel').value;
    const currentShape = document.getElementById('shape_' + currentHexId);
    if (currentShape) {
        if (squadHereVal) {
            currentShape.classList.add('squad-dark');
        } else {
            currentShape.classList.remove('squad-dark');
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
        regionLevel: regionLevelVal
    };
    
    localStorage.setItem('hexMapSystemData', JSON.stringify(mapData));

    const label = document.getElementById('label_' + currentHexId);
    if (label) {
        if (diffVal && regionLevelVal) {
            label.textContent = titleVal + ' СЛ ' + diffVal + ' / lvl ' + regionLevelVal;
        } else if (diffVal) {
            label.textContent = titleVal + ' СЛ ' + diffVal;
        } else if (regionLevelVal) {
            label.textContent = titleVal + ' lvl ' + regionLevelVal;
        } else {
            label.textContent = titleVal;
        }
    }
    closeMenu();
}

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


// ========================================
// СТАРТАП ИНИЦИАЛИЗАЦИЯ ПОСЛЕ ВСЕГО
// ========================================

document.addEventListener('DOMContentLoaded', () => {
     initializeMusicPlayer(); // Вызываем инициализацию плеера первой.
     initColorPresets();    // После этого — цвета.
     populateDifficultySelect();  // Потом - выпадающие списки.
     buildHexGrid();        // И только потом — отрисовка карты.

});


const viewport = document.getElementById('viewport');
const mapContainer = document.getElementById('mapContainer');
let isDragging = false;
let hasMoved = false; 
let startX, startY;

viewport.addEventListener('mousedown', (e) => {
    if (e.target.closest('.pop-menu') || e.target.closest('button')) return;
    isDragging = true;
    hasMoved = false;
    startX = e.pageX - mapContainer.offsetLeft;
    startY = e.pageY - mapContainer.offsetTop;
});

viewport.addEventListener('mouseleave', () => { isDragging = false; });
viewport.addEventListener('mouseup', () => {
    isDragging = false;
    // Даем небольшую задержку, чтобы убедиться, что все обработчики отработали.
    setTimeout(() => { hasMoved = false; }, 50);
});

viewport.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - startX;
    const y = e.pageY - startY;
    
    // Простая проверка на движение: если смещение значительное, значит пользователь двигал карту
    if (Math.abs(x - mapContainer.offsetLeft) > 3 || Math.abs(y - mapContainer.offsetTop) > 3) {
        hasMoved = true;
    }
    mapContainer.style.left = x + 'px';
    mapContainer.style.top = y + 'px';
});

// ЭКСПОРТ JSON (Оставлено без изменений)
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

// ИМПОРТ JSON (Оставлено без изменений)
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
            // При импорте данных нужно перестроить всю сетку, чтобы данные обновились
            buildHexGrid(); 
            alert('Данные успешно импортированы!');
        } catch (err) {
            alert('Ошибка при чтении JSON файла.');
        }
        fileInput.value = ''; 
    };
    reader.readAsText(files[0]); 
});

// Обработчик закрытия меню
modal.addEventListener('click', function(e) {
    if (e.target === modal) { closeMenu(); }
});

document.getElementById('mapImg').addEventListener('click', function() {
    if (!hasMoved) closeMenu();
});

document.getElementById('btnCancel').addEventListener('click', closeMenu);
document.getElementById('btnSave').addEventListener('click', saveMenu);


// ========================================
// МЕДИАПЛЕЕР И ПЛЕЙЛИСТ (Оригинальная логика осталась, но теперь она в конце)
// ========================================

const playlist = [
    "main_theme.mp3",
    "02_beginning.mp3",
    "03_exploring_the_stolen_lands.mp3",
    "04_bittersweet_nyrissas_theme.mp3",
    "05_peaceful_lands.mp3",
    "06_the_shrike_hills.mp3",
    "07_hills_of_glenebon.mp3",
    "08_twilight_at_glenebon.mp3",
    "09_the_narlmarches.mp3",
    "10_sunset_at_the_narlmarches.mp3",
    "11_dawn_at_the_narlmarches.mp3",
    "12_old_sycamore_caves.mp3",
    "13_thousand_grains.mp3",
    "14_city_of_hollow_eyes.mp3",
    "15_tomb_of_the_iron_lords_champion.mp3"
];

const musicPlayer = document.getElementById('bg-music');
const musicBtn = document.getElementById('btnMusic');
const btnLoop = document.getElementById('btnLoop');
const btnPlaylist = document.getElementById('btnPlaylist');
const dropdownPlaylist = document.getElementById('dropdownPlaylist');
const playlistTracksContainer = document.getElementById('playlistTracksContainer');

let isMusicPlaying = false;
let currentTrackIndex = null;
let isLoopActive = false;

musicPlayer.volume = 0.25; // Рекомендую оставить низкую громкость для фоновой музыки


function formatTrackName(filename) {
    let name = filename.replace('.mp3', '').replace(/_/g, ' ');
    return name.charAt(0).toUpperCase() + name.slice(1);
}

/** Инициализация UI плейлиста */
function initPlaylistUI() {
    if (!playlistTracksContainer) return;
    playlistTracksContainer.innerHTML = '';
    
    playlist.forEach((track, index) => {
        const trackItem = document.createElement('div');
        trackItem.className = 'playlist-track-item';
        trackItem.textContent = formatTrackName(track);
        trackItem.dataset.index = index;
        
        trackItem.addEventListener('click', (e) => {
            e.stopPropagation();
            playTrack(index);
            dropdownPlaylist.classList.remove('show');
        });
        
        playlistTracksContainer.appendChild(trackItem);
    });
}

function playTrack(index) {
    if (index < 0 || index >= playlist.length) return;
    
    currentTrackIndex = index;
    musicPlayer.src = playlist[index];
    musicPlayer.load();
    
    isMusicPlaying = true;
    // Обновляем кнопку с именем трека и цветом 'играет'
    musicBtn.innerHTML = `⏸ Пауза: <span style="font-size: 13px; font-weight: normal;">${formatTrackName(playlist[index])}</span>`;
    musicBtn.style.backgroundColor = '#e74c3c';
    musicBtn.style.color = '#fff';
    
    audioPlayer.play().catch(err => {
        console.log("Ошибка автоплея:", err);
    });
    
    highlightActiveTrack();
}

function highlightActiveTrack() {
    const items = playlistTracksContainer.querySelectorAll('.playlist-track-item');
    items.forEach((item, idx) => {
        if (idx === currentTrackIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function playNextRandomTrack() {
    if (playlist.length === 0) return;

    let nextTrackIndex;
    // Генерируем случайный индекс, который НЕ равен текущему индексу (если он есть)
    do {
        nextTrackIndex = Math.floor(Math.random() * playlist.length);
    } while (currentTrackIndex !== null && nextTrackIndex === currentTrackIndex);

    playTrack(nextTrackIndex);
}

// Обработчик клика по главной кнопке управления музыкой
musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();

    if (!isMusicPlaying) {
        if (currentTrackIndex !== null) { 
            // Если трек выбран, но не воспроизводится - просто возобновляем его
            toggleMusic();
        } else if (trackSelector.value) {
             // Если трек выбран и мы только что загрузили его через селект
             playNextRandomTrack();
        } else {
             alert("Пожалуйста, выберите трек для начала.");
        }
    } else {
        toggleMusic(); // Пауза/Стоп
    }
});

// Обработчик кнопки цикла
btnLoop.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!audioPlayer || !trackSelector.value) return; 
    toggleLoop();
});


/** Обмен состояния кнопок плеера */
function updateMusicButtonText() {
     const trackName = currentTrackIndex !== null ? formatTrackName(playlist[currentTrackIndex]) : "Выберите трек";

     if (isMusicPlaying) {
        musicBtn.innerHTML = `⏸ Пауза: <span style="font-size: 13px; font-weight: normal;">${trackName}</span>`;
         musicBtn.style.backgroundColor = '#e74c3c';
     } else if (!trackSelector.value) {
        musicBtn.innerHTML = `🎵 Включить музыку`;
        musicButton.disabled = true;
    } else {
        musicBtn.innerHTML = `🎵 Включить музыку`;
        musicButton.disabled = false;
    }
}

/** Открытие плейлиста */
function openPlaylist() {
    const playlistContainer = document.getElementById('dropdownPlaylist');
    if (playlistContainer.style.display === 'flex') {
        playlistContainer.classList.remove('show');
    } else {
        playlistContainer.classList.add('show');
    }
}

// Обработка клика вне плейлиста
document.addEventListener('click', (e) => {
    if (dropdownPlaylist && !dropdownPlaylist.contains(e.target) && e.target !== btnPlaylist) {
        dropdownPlaylist.classList.remove('show');
    }
});


// Инициализация всего при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
     initializeMusicPlayer(); 
     initColorPresets();    
     populateDifficultySelect();  
     buildHexGrid();        
     updateMusicButtonText(); // Устанавливаем начальное состояние кнопок
});

