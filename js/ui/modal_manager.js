/**
 * Единый сервис для создания геральдических модальных окон Kingmaker
 */
const ModalManager = {
    /**
     * Открывает модальное окно и возвращает объект { overlay, close }
     */
    open({
             id = 'kDynamicModal',
             title = '',
             headerRightHtml = '',
             bodyHtml = '',
             footerButtons = [],
             width = '500px',
             borderColor = '#b89445',
             closeOnBackdrop = true,
             closeOnEscape = true
         }) {
        this.close(id);

        const overlay = document.createElement('div');
        overlay.id = id;
        overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:9999999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(3px);';

        const buttonsHtml = footerButtons.map((btn, idx) => `
            <button type="button"
                    class="btn ${btn.variant || 'cc'}"
                    data-modal-btn-idx="${idx}"
                    ${btn.id ? `id="${btn.id}"` : ''}
                    ${btn.disabled ? 'disabled' : ''}
                    style="${btn.style || ''}">
                ${btn.label}
            </button>
        `).join('');

        overlay.innerHTML = `
            <div class="k-modal-card" style="background:linear-gradient(135deg, #112618 0%, #09140d 100%); border:2px solid ${borderColor}; border-radius:8px; padding:22px 26px; width:${width}; max-width:95vw; max-height:92vh; overflow-y:auto; color:#ebd291; box-shadow:0 15px 40px rgba(0,0,0,0.9), 0 0 25px rgba(223,188,111,0.35); font-family:'Tinos', serif;">
                ${title ? `
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #543e0d; padding-bottom:8px; margin-bottom:14px; gap:12px;">
                        <span style="font-size:20px; font-weight:bold; color:#ffd875; text-transform:uppercase; letter-spacing:0.8px;">${title}</span>
                        ${headerRightHtml}
                    </div>
                ` : ''}
                <div class="k-modal-body">${bodyHtml}</div>
                ${footerButtons.length > 0 ? `
                    <div style="display:flex; gap:10px; justify-content:flex-end; flex-wrap:wrap; margin-top:16px;">
                        ${buttonsHtml}
                    </div>
                ` : ''}
            </div>
        `;

        document.body.appendChild(overlay);

        const close = () => {
            if (overlay.parentNode) overlay.remove();
            document.removeEventListener('keydown', onKeyDown);
        };

        const onKeyDown = (e) => {
            if (closeOnEscape && (e.key === 'Escape' || e.code === 'Escape')) {
                e.stopPropagation();
                close();
            }
        };

        if (closeOnEscape) {
            document.addEventListener('keydown', onKeyDown);
        }

        if (closeOnBackdrop) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) close();
            });
        }

        footerButtons.forEach((btn, idx) => {
            const btnEl = overlay.querySelector(`[data-modal-btn-idx="${idx}"]`);
            if (!btnEl) return;
            btnEl.addEventListener('click', () => {
                if (typeof btn.onClick === 'function') {
                    btn.onClick({ overlay, close });
                } else {
                    close();
                }
            });
        });

        return { overlay, close };
    },

    close(id) {
        const existing = document.getElementById(id);
        if (existing) existing.remove();
    }
};

export default ModalManager;
