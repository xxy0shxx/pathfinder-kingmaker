import ModalManager from '../../ui/modal_manager.js';
import HeroSyncService from '../../services/hero_sync_service.js';
import { ensureCharacterStats } from './bestiary_config.js';
import { hideSheetItemTooltip } from './bestiary_tooltip_builder.js';
import { exportCharacterToPdf } from './sheet_pdf_exporter.js';
import { collectFormData } from './sheet_helpers.js';
import { buildPage1Html, initPage1 } from './sheet_page1.js';
import { buildPage2Html, initPage2 } from './sheet_page2.js';
import { buildPage3Html, initPage3 } from './sheet_page3.js';
export function openCharacterSheetModal(hero, onSaveCallback, pageNum = 1) {
    hideSheetItemTooltip();
    if (!hero) return;

    const stats = ensureCharacterStats(hero);
    const isPage1 = pageNum === 1;
    const isPage2 = pageNum === 2;
    const isPage3 = pageNum === 3;

    const pageTitles = {
        1: `🛡️ Бланк: ${hero.name} — Стр. 1 (Бой и Навыки)`,
        2: `📜 Бланк: ${hero.name} — Стр. 2 (Снаряжение и Магия)`,
        3: `🧍 Бланк: ${hero.name} — Стр. 3 (Кукла и Пояс)`
    };

    const pageBodyHtml = isPage1
        ? buildPage1Html(stats)
        : (isPage2 ? buildPage2Html(stats) : buildPage3Html(hero));

    const saveAndSync = () => {
        collectFormData(overlay, hero);
        HeroSyncService.syncFullStats(hero, false);
        if (typeof onSaveCallback === 'function') onSaveCallback();
    };

    const goToPage = (targetPage) => {
        hideSheetItemTooltip();
        saveAndSync();
        close();
        openCharacterSheetModal(hero, onSaveCallback, targetPage);
    };

    const navButtons = [
        !isPage1 ? { label: '🛡️ Стр. 1: Бой', variant: 'cc', onClick: () => goToPage(1) } : null,
        !isPage2 ? { label: '📜 Стр. 2: Инвентарь и Магия', variant: 'cc', onClick: () => goToPage(2) } : null,
        !isPage3 ? { label: '🧍 Стр. 3: Кукла и Пояс', variant: 'cc', onClick: () => goToPage(3) } : null
    ].filter(Boolean);

    const { overlay, close } = ModalManager.open({
        id: 'bstHeroSheetModal',
        title: pageTitles[pageNum] || pageTitles[1],
        width: '1420px',
        borderColor: '#dfbc6f',
        bodyHtml: pageBodyHtml,
        footerButtons: [
            ...navButtons,
            {
                label: '🖨️ Экспорт в PDF',
                variant: 'cc',
                onClick: () => {
                    collectFormData(overlay, hero);
                    exportCharacterToPdf(hero);
                }
            },
            {
                label: '✖ Отмена',
                variant: 'cc',
                onClick: () => {
                    hideSheetItemTooltip();
                    close();
                }
            },
            {
                label: '⚜ Сохранить бланк',
                variant: 'ok',
                onClick: () => {
                    hideSheetItemTooltip();
                    saveAndSync();
                    close();
                }
            }
        ]
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) hideSheetItemTooltip();
    });

    if (isPage1) initPage1(overlay, hero);
    else if (isPage2) initPage2(overlay, hero);
    else if (isPage3) initPage3(overlay, hero);
}
