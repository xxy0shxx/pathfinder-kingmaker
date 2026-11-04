const FileManager = {
    init(onImportSuccess) {
        const btnExport = document.getElementById('btnExport');
        const btnImport = document.getElementById('btnImport');
        const fileInput = document.getElementById('fileInput');

        if (btnExport) {
            btnExport.addEventListener('click', () => this.exportData());
        }

        if (btnImport && fileInput) {
            btnImport.addEventListener('click', () => fileInput.click());

            fileInput.addEventListener('change', (e) => {
                this.importData(e, onImportSuccess);
            });
        }
    },

    exportData() {
        const mapData = JSON.parse(localStorage.getItem('hexMapSystemData')) || {};
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
    },

    importData(e, onImportSuccess) {
        const fileInput = e.target;
        const files = fileInput.files;
        if (!files || files.length === 0) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const parsedData = JSON.parse(evt.target.result);
                localStorage.setItem('hexMapSystemData', JSON.stringify(parsedData));

                alert('Данные успешно импортированы!');

                // Вызываем функцию обновления интерфейса в главном скрипте
                if (typeof onImportSuccess === 'function') {
                    onImportSuccess(parsedData);
                }
            } catch (err) {
                alert('Ошибка при чтении JSON файла.');
            }
            fileInput.value = '';
        };
        reader.readAsText(files[0]);
    }
};

export default FileManager;
