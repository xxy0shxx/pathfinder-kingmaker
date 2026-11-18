import ModalManager from '../ui/modal_manager.js';

async function sha256Hex(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function deriveGmSecret(roomCode, password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(`${roomCode}:${password.trim()}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return 'gm_' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function derivePlayerHash(heroId, password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(`player:${heroId}:${password.trim()}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return 'pl_' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function promptGmPasswordModal(roomCode, isExistingRoom, errorMsg = '') {
    return new Promise((resolve) => {
        let resolved = false;
        const finish = (val) => {
            if (resolved) return;
            resolved = true;
            resolve(val);
        };

        const titleText = isExistingRoom
            ? `🔐 Вход Мастера в комнату: ${roomCode}`
            : `🔐 Создание пароля Мастера: ${roomCode}`;

        const hintText = isExistingRoom
            ? 'Введите пароль Мастера для подключения к облачной кампании.'
            : 'Придумайте пароль Мастера для защиты этой комнаты. Он понадобится для входа с других устройств.';

        const modal = ModalManager.open({
            id: 'bstGmAuthModal',
            title: titleText,
            width: '440px',
            borderColor: '#ffd875',
            bodyHtml: `
                <div style="font-size: 14px; color: #ebd291; line-height: 1.5;">
                    <div style="margin-bottom: 10px;">${hintText}</div>
                    <input type="password" id="bstGmPassInput" class="k-inp" placeholder="Пароль Мастера..." style="width: 100%; padding: 8px 10px; font-size: 15px;">
                    <div id="bstGmPassErr" style="color: #ff7675; font-size: 13px; margin-top: 8px; min-height: 18px;">${errorMsg}</div>
                </div>
            `,
            footerButtons: [
                {
                    label: '✖ Отмена',
                    variant: 'cc',
                    onClick: () => {
                        modal.close();
                        finish(null);
                    }
                },
                {
                    label: '🔓 Войти',
                    variant: 'ok',
                    onClick: () => {
                        const val = document.getElementById('bstGmPassInput')?.value.trim();
                        if (!val) {
                            const errEl = document.getElementById('bstGmPassErr');
                            if (errEl) errEl.textContent = '⚠️ Пароль не может быть пустым.';
                            return;
                        }
                        modal.close();
                        finish(val);
                    }
                }
            ]
        });

        const inp = document.getElementById('bstGmPassInput');
        if (inp) {
            setTimeout(() => inp.focus(), 50);
            inp.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    modal.overlay?.querySelector('.btn.ok')?.click();
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    modal.close();
                    finish(null);
                }
            });
        }
    });
}

export function promptPlayerPasswordModal(heroName, errorMsg = '') {
    return new Promise((resolve) => {
        const modal = ModalManager.open({
            id: 'bstPlayerAuthModal',
            title: `🔒 Доступ к персонажу: ${heroName}`,
            width: '420px',
            borderColor: '#74b9ff',
            bodyHtml: `
                <div style="font-size: 14px; color: #ebd291; line-height: 1.5;">
                    <div style="margin-bottom: 10px;">Мастер защитил этот лист паролем. Введите пароль игрока:</div>
                    <input type="password" id="bstPlayerPassInput" class="k-inp" placeholder="Пароль игрока..." style="width: 100%; padding: 8px 10px; font-size: 15px;">
                    <div id="bstPlayerPassErr" style="color: #ff7675; font-size: 13px; margin-top: 8px; min-height: 18px;">${errorMsg}</div>
                </div>
            `,
            footerButtons: [
                {
                    label: '🛡️ Открыть лист',
                    variant: 'ok',
                    onClick: () => {
                        const val = document.getElementById('bstPlayerPassInput')?.value.trim();
                        if (!val) {
                            const errEl = document.getElementById('bstPlayerPassErr');
                            if (errEl) errEl.textContent = '⚠️ Введите пароль.';
                            return;
                        }
                        modal.close();
                        resolve(val);
                    }
                }
            ]
        });

        const inp = document.getElementById('bstPlayerPassInput');
        if (inp) {
            setTimeout(() => inp.focus(), 50);
            inp.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    modal.overlay?.querySelector('.btn.ok')?.click();
                }
            });
        }
    });
}
