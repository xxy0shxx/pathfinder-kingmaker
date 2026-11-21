import ModalManager from '../ui/modal_manager.js';

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

// Компактный чистый JS-фоллбэк SHA-256 на случай открытия по обычному HTTP (не localhost)
function sha256Fallback(ascii) {
    const rightRotate = (value, amount) => (value >>> amount) | (value << (32 - amount));
    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    let result = '';

    const words = [];
    const asciiBitLength = ascii.length * 8;

    const hash = [];
    const k = [];
    let primeCounter = 0;

    const isComposite = {};
    for (let candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (let i = 0; i < 313; i += candidate) {
                isComposite[i] = candidate;
            }
            hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
            k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
        }
    }

    ascii += '\x80';
    while (ascii.length % 64 - 56) ascii += '\x00';
    for (let i = 0; i < ascii.length; i++) {
        const j = ascii.charCodeAt(i);
        words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    words[words.length] = ((asciiBitLength / maxWord) | 0);
    words[words.length] = (asciiBitLength);

    for (let j = 0; j < words.length;) {
        const w = words.slice(j, j += 16);
        const oldHash = hash.slice(0);

        for (let i = 0; i < 64; i++) {
            const w15 = w[i - 15], w2 = w[i - 2];
            const a = hash[0], e = hash[4];
            const temp1 = hash[7]
                + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
                + ((e & hash[5]) ^ ((~e) & hash[6]))
                + k[i]
                + (w[i] = (i < 16) ? w[i] : (
                    w[i - 16]
                    + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
                    + w[i - 7]
                    + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
                ) | 0);

            const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
                + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

            hash.unshift((temp1 + temp2) | 0);
            hash.pop();
            hash[4] = (hash[4] + temp1) | 0;
        }

        for (let i = 0; i < 8; i++) {
            hash[i] = (hash[i] + oldHash[i]) | 0;
        }
    }

    for (let i = 0; i < 8; i++) {
        for (let j = 3; j + 1; j--) {
            const b = (hash[i] >> (j * 8)) & 255;
            result += ((b < 16) ? 0 : '') + b.toString(16);
        }
    }
    return result;
}

async function sha256Hex(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    if (window.crypto?.subtle?.digest) {
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Конвертируем UTF-8 байты в бинарную строку для корректного хеширования кириллицы и спецсимволов
    let binary = '';
    for (let i = 0; i < data.length; i++) {
        binary += String.fromCharCode(data[i]);
    }
    return sha256Fallback(binary);
}

export async function deriveGmSecret(roomCode, password) {
    const hex = await sha256Hex(`${roomCode}:${password.trim()}`);
    return 'gm_' + hex;
}

export async function derivePlayerHash(heroId, password) {
    const hex = await sha256Hex(`player:${heroId}:${password.trim()}`);
    return 'pl_' + hex;
}
