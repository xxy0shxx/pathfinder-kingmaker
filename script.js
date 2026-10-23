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

    function populateDifficultySelect() {
        for (let i = 1; i <= 40; i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = 'Level ' + i;
            difficultySelect.appendChild(opt);
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
    // Проверяем, есть ли сохраненные данные для этого гекса
    if (mapData[hexId] && (mapData[hexId].title || mapData[hexId].text)) {
        const data = mapData[hexId];
        let content = '';
        
        // Формируем красивую разметку внутри подсказки
        if (data.title) {
            const lvl = data.difficulty ? ` (Lvl ${data.difficulty})` : '';
            content += `<div class="tooltip-title">${data.title}${lvl}</div>`;
        }
        if (data.text) {
            content += `<div class="tooltip-desc">${data.text.replace(/\n/g, '<br>')}</div>`;
        }
        
        tooltip.innerHTML = content;
        tooltip.style.display = 'block';
    }
});

vHex.addEventListener('mousemove', function(e) {
    // Сдвигаем плашку чуть правее и ниже курсора мыши
    tooltip.style.left = (e.clientX + 15) + 'px';
    tooltip.style.top = (e.clientY + 15) + 'px';
});

vHex.addEventListener('mouseleave', function() {
    // Скрываем плашку, когда мышь уходит с гекса
    tooltip.style.display = 'none';
    tooltip.innerHTML = '';
});
				
                const shape = document.createElement('div');
                shape.className = 'hex-shape';
                shape.setAttribute('id', 'shape_' + hexId);
                
                if (mapData[hexId] && mapData[hexId].color) {
                    shape.style.backgroundColor = convertHexToRgba(mapData[hexId].color, 0.6);
                }
                vHex.appendChild(shape);

                const label = document.createElement('span');
                label.className = 'hex-text-label';
                label.setAttribute('id', 'label_' + hexId);
                
                if (mapData[hexId] && mapData[hexId].title) {
                    const title = mapData[hexId].title;
                    const diff = mapData[hexId].difficulty;
                    if (diff) {
                        label.textContent = title + ': lvl ' + diff;
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
		document.getElementById('hexTooltip').style.display = 'none';
        currentHexId = hexId;
        document.getElementById('menuTitle').textContent = 'Hex Setup: ' + hexId;
        
        if (mapData[hexId]) {
            document.getElementById('inpTitle').value = mapData[hexId].title || '';
            document.getElementById('inpDesc').value = mapData[hexId].text || '';
            document.getElementById('inpColor').value = mapData[hexId].color || '#3498db';
            difficultySelect.value = mapData[hexId].difficulty || ''; 
        } else {
            document.getElementById('inpTitle').value = '';
            document.getElementById('inpDesc').value = '';
            document.getElementById('inpColor').value = '#3498db';
            difficultySelect.value = ''; 
        }
        modal.classList.add('open');
    }
    function closeMenu() {
        modal.classList.remove('open');
        currentHexId = null;
    }

    function saveMenu() {
        if (!currentHexId) return;
        const titleVal = document.getElementById('inpTitle').value;
        const descVal = document.getElementById('inpDesc').value;
        const colorVal = document.getElementById('inpColor').value;
        const diffVal = difficultySelect.value; 

        mapData[currentHexId] = { 
            title: titleVal, 
            text: descVal, 
            color: colorVal,
            difficulty: diffVal 
        };
        localStorage.setItem('hexMapSystemData', JSON.stringify(mapData));

        const shape = document.getElementById('shape_' + currentHexId);
        const label = document.getElementById('label_' + currentHexId);

        if (shape) shape.style.backgroundColor = convertHexToRgba(colorVal, 0.6);
        
        if (label) {
            if (diffVal) {
                label.textContent = titleVal + ': lvl ' + diffVal;
            } else {
                label.textContent = titleVal;
            }
        }

        closeMenu();
    }

    document.getElementById('btnApplyColor').addEventListener('click', function() {
        if (!currentHexId) return;
        const colorVal = document.getElementById('inpColor').value;
        const shape = document.getElementById('shape_' + currentHexId);
        if (shape) {
            shape.style.backgroundColor = convertHexToRgba(colorVal, 0.4);
        }
    });

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
        setTimeout(() => { hasMoved = false; }, 50);
    });

    viewport.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - startX;
        const y = e.pageY - startY;
        
        if (Math.abs(x - mapContainer.offsetLeft) > 3 || Math.abs(y - mapContainer.offsetTop) > 3) {
            hasMoved = true;
        }
        mapContainer.style.left = x + 'px';
        mapContainer.style.top = y + 'px';
    });

// ЭКСПОРТ JSON
document.getElementById('btnExport').addEventListener('click', function() {
    const jsonString = JSON.stringify(mapData, null, 4);
    const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
    const dataStr = URL.createObjectURL(blob);

    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "map_data.json");
    document.body.appendChild(downloadAnchor);
    
    downloadAnchor.click();
    
    // Очищаем память
    downloadAnchor.remove();
    URL.revokeObjectURL(dataStr); 
});

// ИМПОРТ JSON
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

    modal.addEventListener('click', function(e) {
        if (e.target === modal) { closeMenu(); }
    });

    document.getElementById('mapImg').addEventListener('click', function() {
        if (!hasMoved) closeMenu();
    });

    document.getElementById('btnCancel').addEventListener('click', closeMenu);
    document.getElementById('btnSave').addEventListener('click', saveMenu);

    populateDifficultySelect();
    buildHexGrid();
