import ModalManager from '../../ui/modal_manager.js';
import HeroSyncService from '../../services/hero_sync_service.js';
import { ensureCharacterStats } from './bestiary_config.js';
import { hideSheetItemTooltip } from './bestiary_tooltip_builder.js';
import { exportCharacterToPdf } from './sheet_pdf_exporter.js';
import { collectFormData } from './sheet_helpers.js';
import { buildPage1Html, initPage1 } from './sheet_page1.js';
import { buildPage2Html, initPage2 } from './sheet_page2.js';
import { buildPage3Html, initPage3 } from './sheet_page3.js';
import CloudSyncService from '../../services/cloud_sync_service.js';

export function openCharacterSheetModal(hero, onSaveCallback, pageNum = 1) {
    hideSheetItemTooltip();
    if (!hero) return;

    const stats = ensureCharacterStats(hero);
    const isPage1 = pageNum === 1;
    const isPage2 = pageNum === 2;
    const isPage3 = pageNum === 3;

    const isReadOnlyForPlayer = CloudSyncService.isPlayerMode && !!hero.isReadOnly;
    const lockBadge = isReadOnlyForPlayer ? ' 🔒 [ТОЛЬКО ЧТЕНИЕ]' : '';

    const pageTitles = {
        1: `🛡️ Бланк: ${hero.name} — Стр. 1 (Бой и Навыки)${lockBadge}`,
        2: `📜 Бланк: ${hero.name} — Стр. 2 (Снаряжение и Магия)${lockBadge}`,
        3: `🧍 Бланк: ${hero.name} — Стр. 3 (Кукла и Пояс)${lockBadge}`
    };

    const pageBodyHtml = isPage1
        ? buildPage1Html(stats)
        : (isPage2 ? buildPage2Html(stats) : buildPage3Html(hero));

    const saveAndSync = () => {
        if (isReadOnlyForPlayer) return;
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

    const actionButtons = [
        ...navButtons,
        {
            label: '🖨️ Экспорт в PDF',
            variant: 'cc',
            onClick: () => {
                if (!isReadOnlyForPlayer) collectFormData(overlay, hero);
                exportCharacterToPdf(hero);
            }
        }
    ];

    if (!CloudSyncService.isPlayerMode) {
        actionButtons.push({
            label: '✖ Отмена',
            variant: 'cc',
            onClick: () => {
                hideSheetItemTooltip();
                close();
            }
        });
    }

    if (!isReadOnlyForPlayer) {
        actionButtons.push({
            label: '⚜ Сохранить бланк',
            variant: 'ok',
            onClick: () => {
                hideSheetItemTooltip();
                saveAndSync();
                if (!CloudSyncService.isPlayerMode) close();
            }
        });
    }

    const { overlay, close } = ModalManager.open({
        id: 'bstHeroSheetModal',
        title: pageTitles[pageNum] || pageTitles,
        width: '1420px',
        borderColor: isReadOnlyForPlayer ? '#ff7675' : '#dfbc6f',
        bodyHtml: pageBodyHtml,
        footerButtons: actionButtons
    });

    if (isPage1) initPage1(overlay, hero);
    else if (isPage2) initPage2(overlay, hero);
    else if (isPage3) initPage3(overlay, hero);

    overlay.dataset.pageNum = String(pageNum);

    if (CloudSyncService.isPlayerMode) {
        // Не даём игроку закрыть окно бланка кликом по фону или крестиком
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) e.stopPropagation();
        }, true);
        overlay.querySelectorAll('button').forEach(b => {
            if (b.textContent.trim() === '×' || b.textContent.trim() === '✖') b.remove();
        });
    } else {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) hideSheetItemTooltip();
        });
    }

    if (isReadOnlyForPlayer) {
        // 1. Блокируем все поля ввода
        overlay.querySelectorAll('input, select, textarea').forEach(el => {
            el.disabled = true;
            el.style.cursor = 'not-allowed';
        });

        // 2. Блокируем все кнопки внутри тела бланка, кроме вкладок черт и нижних кнопок навигации/PDF
        const allowedLabels = ['Стр. 1', 'Стр. 2', 'Стр. 3', 'Экспорт в PDF', 'Классовые', 'Общие', 'Навыков', 'Народа'];
        overlay.querySelectorAll('button').forEach(btn => {
            const txt = btn.textContent || '';
            const isAllowed = allowedLabels.some(lbl => txt.includes(lbl));
            if (!isAllowed) {
                btn.disabled = true;
                btn.style.opacity = '0.4';
                btn.style.pointerEvents = 'none';
            }
        });
    }
}
