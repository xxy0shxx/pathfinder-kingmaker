import EventBus from '../services/event_bus.js';
import ModalManager from '../ui/modal_manager.js';

const FileManager = {
    init() {
        const btnExport = document.getElementById('btnExport');
        const btnImport = document.getElementById('btnImport');
        const fileInput = document.getElementById('fileInput');

        if (btnExport) {
            btnExport.addEventListener('click', () => this.exportData());
        }

        if (btnImport && fileInput) {
            btnImport.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => this.importData(e));
        }
    },

    exportData() {
        const mapData = JSON.parse(localStorage.getItem('hexMapSystemData')) || {};
        const jsonString = JSON.stringify(mapData, null, 4);
        const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
        const dataStr = URL.createObjectURL(blob);

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const filename = `pf_save_${year}_${month}_${day}.json`;

        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', filename);
        document.body.appendChild(downloadAnchor);

        downloadAnchor.click();
        downloadAnchor.remove();
        URL.revokeObjectURL(dataStr);
    },

    importData(e) {
        const fileInput = e.target;
        const files = fileInput.files;
        if (!files || files.length === 0) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const parsedData = JSON.parse(evt.target.result);

                // Если загружен старый плоский формат сейва — приводим к новой структуре
                const normalizedData = (parsedData && !parsedData.hexes)
                    ? {
                        hexes: parsedData,
                        kingdom: parsedData.kingdomState || null,
                        paths: parsedData.__pathHistory || []
                    }
                    : (parsedData || { hexes: {}, kingdom: null, paths: [] });

                // Оповещаем все модули (Storage, Карту, Королевство, Привал и др.)
                EventBus.emit('data:imported', normalizedData);

                ModalManager.open({
                    id: 'fileImportSuccessModal',
                    title: '📜 Импорт данных',
                    borderColor: '#2ecc71',
                    width: '400px',
                    bodyHtml: '<div style="font-size:17px; color:#ebd291;">Данные карты и королевства успешно загружены!</div>',
                    footerButtons: [{ label: 'Отлично', variant: 'ok' }]
                });
            } catch (err) {
                ModalManager.open({
                    id: 'fileImportErrorModal',
                    title: '⚠ Ошибка импорта',
                    borderColor: '#e74c3c',
                    width: '420px',
                    bodyHtml: '<div style="font-size:17px; color:#ff7675;">Не удалось прочитать JSON-файл сохранения.</div>',
                    footerButtons: [{ label: 'Закрыть', variant: 'cc' }]
                });
            }
            fileInput.value = '';
        };
        reader.readAsText(files[0]);
    }
};

export default FileManager;
