// js/services/cloud_auth_modal.js

// Превращает связку "код комнаты + пароль ГМа" в необратимый SHA-256 хеш
export async function deriveGmSecret(roomCode, password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(`${roomCode}:${password.trim()}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return 'gm_' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Модальное окно ввода или создания пароля Мастера
export function promptGmPasswordModal(roomCode, isExistingRoom, errorText = '') {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed',
            inset: '0',
            background: 'rgba(0, 0, 0, 0.92)',
            zIndex: '10000999',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        });

        overlay.innerHTML = `
            <div style="background: #0b140e; border: 2px solid #d4af37; border-radius: 10px; padding: 24px; width: 410px; max-width: 92vw; color: #ebd291; font-family: 'Tinos', serif; box-shadow: 0 12px 35px #000;">
                <h3 style="margin: 0 0 10px; color: #ffd875; font-size: 19px;">
                    🔐 ${isExistingRoom ? 'Вход Мастера в комнату' : 'Защита комнаты паролем ГМа'}
                </h3>
                <p style="font-size: 14px; line-height: 1.45; margin-bottom: 14px; color: #dfe6e9;">
                    ${isExistingRoom
            ? `Комната: <b style="color:#ffd875;">${roomCode}</b>.<br>Введите пароль Мастера, чтобы открыть управление кампанией.`
            : `Комната: <b style="color:#ffd875;">${roomCode}</b>.<br>Придумайте пароль ГМа. Ссылка комнаты не содержит секретов — без этого пароля никто не сможет зайти как Мастер.`}
                </p>
                <input type="password" id="gmPassInput" autocomplete="current-password" placeholder="Введите пароль Мастера..." style="width: 100%; padding: 9px 12px; background: #040905; border: 1px solid #8a6421; color: #fff; border-radius: 5px; font-size: 15px; box-sizing: border-box;">
                ${errorText ? `<div style="color: #ff7675; font-size: 13px; margin-top: 8px;">${errorText}</div>` : ''}
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-top: 16px;">
                    ${isExistingRoom
            ? `<button type="button" id="gmNewRoomBtn" style="background: transparent; border: 1px solid #7f8c8d; color: #a4b0be; padding: 6px 10px; border-radius: 5px; cursor: pointer; font-size: 12px;">Создать новую комнату</button>`
            : '<span></span>'}
                    <button type="button" id="gmPassConfirmBtn" style="background: #1e4620; border: 1px solid #2ecc71; color: #fff; padding: 8px 18px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 14px;">Войти</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        const inp = overlay.querySelector('#gmPassInput');
        const btn = overlay.querySelector('#gmPassConfirmBtn');
        const newRoomBtn = overlay.querySelector('#gmNewRoomBtn');
        inp.focus();

        const submit = () => {
            const val = inp.value.trim();
            if (!val) return;
            overlay.remove();
            resolve(val);
        };

        btn.addEventListener('click', submit);
        inp.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') submit();
        });

        newRoomBtn?.addEventListener('click', () => {
            localStorage.removeItem('pf_online_room_code');
            const cleanUrl = new URL(window.location.href);
            cleanUrl.search = '';
            window.location.href = cleanUrl.toString();
        });
    });
}
