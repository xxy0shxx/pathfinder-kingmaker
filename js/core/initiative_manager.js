/**
 * МОДУЛЬ: ТРЕКЕР ИНИЦИАТИВЫ С ТВ-СТРЕЛКОЙ ХОДА И ВСПЫШКОЙ НОВОГО РАУНДА
 */
const InitiativeManager = {
    state: {
        combatants: [],
        selectedUnitId: null,
        round: 1,
        viewMode: 'classic', // Режимы: 'classic' (список) или 'bg3' (горизонт)
        phraseSeed: 0
    },
    mapDataRef: null,
    onSaveCallback: null,
    _isInputsBound: false,
    _isGlobalKeyBound: false,

    init(mapData, onSave) {
        try {
            this.mapDataRef = mapData || { hexes: {}, kingdom: null, initiative: null };
            this.onSaveCallback = onSave;

            if (this.mapDataRef.initiative) {
                this.state = this.mapDataRef.initiative;
                if (!Array.isArray(this.state.combatants)) this.state.combatants = [];
                if (this.state.round === undefined || isNaN(this.state.round)) this.state.round = 1;
                if (this.state.viewMode === undefined) this.state.viewMode = 'classic';
                if (this.state.phraseSeed === undefined) this.state.phraseSeed = 0;
            } else {
                this.mapDataRef.initiative = this.state;
            }

            window.InitiativeManager = this;
            this.renderUi();
            this.bindGlobalHotkeys();
        } catch (e) { console.error("Ошибка инициализации InitiativeManager:", e); }
    },

    bindGlobalHotkeys() {
        if (this._isGlobalKeyBound) return;
        window.addEventListener('keydown', (e) => {
            const container = document.getElementById('initiativeTabletContainer');
            if (!container || container.style.display === 'none') return;
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;

            if (e.code === 'Space') {
                e.preventDefault();
                this.nextTurn();
            }
        });
        this._isGlobalKeyBound = true;
    },

    updateMapData(newMapData) {
        this.mapDataRef = newMapData || { hexes: {}, kingdom: null, initiative: null };
        if (this.mapDataRef.initiative && Array.isArray(this.mapDataRef.initiative.combatants)) {
            this.state = this.mapDataRef.initiative;
        }
        this.renderUi();
    },

    toggleViewMode() {
        this.state.viewMode = this.state.viewMode === 'classic' ? 'bg3' : 'classic';
        this._saveWithoutSort();
    },

    addCombatant(name, score, faction, isNat20, isNat1 = false) {
        const cleanName = String(name).trim();
        let parsedScore = parseInt(score, 10);

        if (isNat20) parsedScore = 20;
        if (isNat1) parsedScore = 1;

        if (!cleanName) { alert("Введите имя или название существа!"); return; }
        if (isNaN(parsedScore) || parsedScore < 1 || parsedScore > 100) { alert("Инициатива должна быть от 1 до 100!"); return; }

        const newUnit = {
            id: 'unit_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            name: cleanName,
            score: parsedScore,
            faction: faction || 'neutral',
            isNat20: !!isNat20,
            isNat1: !!isNat1
        };

        this.state.combatants.push(newUnit);
        if (this.state.combatants.length === 1) {
            this.state.selectedUnitId = newUnit.id;
        }
        this._sortAndSave();
    },

    nextTurn() {
        if (this.state.combatants.length === 0) return;

        const currentIndex = this.state.combatants.findIndex(c => c.id === this.state.selectedUnitId);

        // Обновляем случайный сид фразы абсолютно на каждый ход
        this.state.phraseSeed = Math.floor(Math.random() * 1000);

        if (currentIndex === -1 || currentIndex === this.state.combatants.length - 1) {
            if (this.state.combatants.length > 0) {
                this.state.selectedUnitId = this.state.combatants[0].id;
            }
            this.state.round += 1;
            this.triggerRoundFlashEffect();
        } else {
            this.state.selectedUnitId = this.state.combatants[currentIndex + 1].id;
        }

        this._saveWithoutSort();
    },

    _sortAndSave() {
        this.state.combatants.sort((a, b) => {
            if (a.isNat20 && !b.isNat20) return -1;
            if (!a.isNat20 && b.isNat20) return 1;
            if (a.isNat1 && !b.isNat1) return 1;
            if (!a.isNat1 && b.isNat1) return -1;
            return b.score - a.score;
        });
        this._saveWithoutSort();
    },

    _saveWithoutSort() {
        if (this.mapDataRef) this.mapDataRef.initiative = this.state;
        if (this.onSaveCallback) this.onSaveCallback();
        else localStorage.setItem('hexMapSystemData', JSON.stringify(this.mapDataRef));

        this.renderUi();
        this.scrollToActiveCombatant();
    },

    scrollToActiveCombatant() {
        if (!this.state.selectedUnitId) return;
        const activeCard = document.querySelector(`.init-combatant-card.selected-turn-gold`);
        if (activeCard) {
            activeCard.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        }
    },

    triggerRoundFlashEffect() {
        const oldFlash = document.getElementById('initTvRoundFlashOverlay');
        if (oldFlash) oldFlash.remove();
        const flashOverlay = document.createElement('div');
        flashOverlay.id = 'initTvRoundFlashOverlay';
        flashOverlay.style.cssText = `
            position: fixed !important; left: 0 !important; top: 0 !important;
            width: 100vw !important; height: 100vh !important; pointer-events: none !important;
            z-index: 299999999 !important;
            box-shadow: inset 0 0 200px 50px rgba(255, 216, 117, 0.6) !important;
            background-color: rgba(255, 216, 117, 0.12) !important;
            opacity: 1 !important; transition: opacity 0.6s ease-out !important;
        `;
        document.body.appendChild(flashOverlay);
        requestAnimationFrame(() => { flashOverlay.style.opacity = '0'; });
        setTimeout(() => { if (flashOverlay.parentNode) flashOverlay.remove(); }, 600);
    },

    toggleNat20(id) {
        const unit = this.state.combatants.find(c => c.id === id);
        if (unit) {
            unit.isNat20 = !unit.isNat20;
            unit.isNat1 = false;
            if (unit.isNat20) unit.score = 20;
            this._sortAndSave();
        }
    },

    toggleNat1(id) {
        const unit = this.state.combatants.find(c => c.id === id);
        if (unit) {
            unit.isNat1 = !unit.isNat1;
            unit.isNat20 = false;
            if (unit.isNat1) unit.score = 1;
            this._sortAndSave();
        }
    },

    updateScore(id, newScore) {
        const val = parseInt(newScore, 10);
        if (isNaN(val) || val < 1 || val > 100) return;

        const unit = this.state.combatants.find(c => c.id === id);
        if (unit) {
            unit.score = val;
            if (val !== 20) unit.isNat20 = false;
            if (val !== 1) unit.isNat1 = false;
            this._sortAndSave();
        }
    },

    updateFaction(id, newFaction) {
        const unit = this.state.combatants.find(c => c.id === id);
        if (unit) {
            unit.faction = newFaction;
            this._saveWithoutSort();
        }
    },

    removeCombatant(id) {
        this.state.combatants = this.state.combatants.filter(c => c.id !== id);
        if (this.state.selectedUnitId === id) {
            this.state.selectedUnitId = this.state.combatants.length > 0 ? this.state.combatants[0].id : null;
        }
        this._saveWithoutSort();
    },

    resetRound() {
        if (this.state.round === 1) return;
        if (confirm("Сбросить счетчик текущих раундов боя до 1?")) {
            this.state.round = 1;
            this.state.phraseSeed = Math.floor(Math.random() * 1000);
            this._saveWithoutSort();
        }
    },

    clearAll() {
        if (confirm("Полностью очистить боевой трекер инициативы?")) {
            this.state.combatants = [];
            this.state.selectedUnitId = null;
            this.state.round = 1;
            this.state.phraseSeed = 0;
            this._saveWithoutSort();
        }
    },

    toggleSelectUnit(id) {
        this.state.selectedUnitId = (this.state.selectedUnitId === id) ? null : id;
        this.state.phraseSeed = Math.floor(Math.random() * 1000);
        this._saveWithoutSort();
    },

    getEpicPhrases(activeUnit) {
        const activeName = activeUnit ? activeUnit.name : 'Неизвестно';
        const faction = activeUnit ? activeUnit.faction : 'neutral';

        // 🟢 КАТЕГОРИЯ: СОЮЗНИКИ / ИГРОКИ (35 фраз)
        if (faction === 'friend') {
            return [
                // Пафосные / Героические фразы
                `Судьба отряда в надежных руках! Отважный воин <span class="gold-unit-focus-name">🟢 ${activeName} 🟢</span> планирует гениальный ход!`,
                `Время совершать подвиги! Сквозь хаос боя на передовую вырывается <span class="gold-unit-focus-name">⚔️ ${activeName} ⚔️</span>!`,
                `Клинок обнажен, заклинание готово! Герой <span class="gold-unit-focus-name">⚡ ${activeName} ⚡</span> берет инициативу!`,
                `Эпическая битва требует решимости! Бесстрашный боец <span class="gold-unit-focus-name">👑 ${activeName} 👑</span> начинает ход!`,
                `Слышен яростный клич доблести! На острие атаки оказывается легендарный <span class="gold-unit-focus-name">🔥 ${activeName} 🔥</span>!`,
                `Ни шагу назад перед лицом опасности! Защитник <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span> держит оборону!`,
                `Магические потоки сплетаются воедино! Опытный заклинатель <span class="gold-unit-focus-name">✨ ${activeName} ✨</span> шепчет слова силы!`,
                `Каждый шаг приближает победу! Настоящий лидер <span class="gold-unit-focus-name">⚜️ ${activeName} ⚜️</span> координирует удар!`,
                `Сталь звенит, возвещая начало триумфа! Могучий витязь <span class="gold-unit-focus-name">🔱 ${activeName} 🔱</span> готов сокрушить врага!`,
                `Чистый разум и холодный расчет! Тактик <span class="gold-unit-focus-name">🎯 ${activeName} 🎯</span> ищет брешь в чужой защите!`,
                `Древние пророчества сбываются на глазах! Гордый искатель приключений <span class="gold-unit-focus-name">📜 ${activeName} 📜</span> начинает атаку!`,
                `В жилах кипит благородная кровь! Отважное сердце <span class="gold-unit-focus-name">🩸 ${activeName} 🩸</span> ведет вперед!`,
                `Вспышка праведного огня озаряет арену схватки! Герой <span class="gold-unit-focus-name">☀️ ${activeName} ☀️</span> диктует правила!`,
                `Враги трепещут перед этой решимостью! Непоколебимый союзник <span class="gold-unit-focus-name">🦅 ${activeName} 🦅</span> наносит удар!`,
                `Сила духа ломает любые оковы! Неудержимый борец <span class="gold-unit-focus-name">⛓️ ${activeName} ⛓️</span> врывается в гущу событий!`,
                `Каждый взмах оружия дышит величием! Прекрасный боец <span class="gold-unit-focus-name">🏆 ${activeName} 🏆</span> рвется к славе!`,
                `Сквозь стрелы и преграды к верной цели! Меткий стрелок <span class="gold-unit-focus-name">🏹 ${activeName} 🏹</span> спускает тетиву!`,
                `Слава ждет тех, кто не знает страха! Отважный авантюрист <span class="gold-unit-focus-name">🐺 ${activeName} 🐺</span> делает решающий шаг!`,
                `Гром битвы разносится по округе! Великий воитель <span class="gold-unit-focus-name">🔨 ${activeName} 🔨</span> поднимает свой молот!`,
                `Ветры удачи дуют в паруса нашей партии! Гордый лидер <span class="gold-unit-focus-name">🚩 ${activeName} 🚩</span> начинает штурм!`,
                `Каждое действие наполнено отвагой! Неутомимый следопыт <span class="gold-unit-focus-name">🌿 ${activeName} 🌿</span> начинает ход!`,
                `Яростный вихрь возмездия готов сокрушить преграды! Сильный атлет <span class="gold-unit-focus-name">🌪️ ${activeName} 🌪️</span> идет напролом!`,
                `Священный обет зовет к новым свершениям! Гордый паладин <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span> обнажает меч!`,
                `Голос разума звучит громче приказов! Мудрый волшебник <span class="gold-unit-focus-name">🔮 ${activeName} 🔮</span> просчитывает последствия!`,
                // Шуточные фразы RPG-стиля
                `Боги рандома смотрят на это с нервной улыбкой! Игрок <span class="gold-unit-focus-name">🎲 ${activeName} 🎲</span> судорожно ищет кубы!`,
                `Паника в рядах отряда отменяется (но это неточно)! Наш верный <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span> забыл свои заклинания!`,
                `Главная задача — не выкинуть критический провал на урон! Паникующий <span class="gold-unit-focus-name">🏹 ${activeName} 🏹</span> закрывает глаза!`,
                `«У меня есть тактический план, я читал правила!» — уверенно заявляет <span class="gold-unit-focus-name">📜 ${activeName} 📜</span>!`,
                `Когда вся командная стратегия летит в бездну, в бой вступает великий рандом и <span class="gold-unit-focus-name">💥 ${activeName} 💥</span>!`,
                `Пожелаем этим кубикам d20 не споткнуться о край коврика! Наш азартный <span class="gold-unit-focus-name">🎲 ${activeName} 🎲</span> делает бросок!`,
                `Плут уже ворует кошельки у собственной партии... Вся надежда команды — спящий <span class="gold-unit-focus-name">💤 ${activeName} 💤</span>!`,
                `Главное в бою — вовремя вспомнить, где лежат лечебные зелья! Рассеянный <span class="gold-unit-focus-name">🧪 ${activeName} 🧪</span> роется в сумке!`,
                `Бросок на скрытность провален, но бой уже начался! Наш неосторожный <span class="gold-unit-focus-name">👣 ${activeName} 👣</span> привлекает всё внимание!`,
                `«Если я выкину единицу, я ухожу жить в таверну!» — торжественно обещает <span class="gold-unit-focus-name">🍺 ${activeName} 🍺</span>!`,
                `Лист персонажа перечеркан до дыр, но боевой дух силен! Наш отчаянный <span class="gold-unit-focus-name">⚔️ ${activeName} ⚔️</span> начинает ходить!`
            ];
        }

        // 🔴 КАТЕГОРИЯ: ВРАГИ / МОНСТРЫ (35 фраз)
        if (faction === 'enemy') {
            return [
                // Пафосные / Зловещие фразы
                `Тени сгущаются, предвещая скорую гибель! Грозный противник <span class="gold-unit-focus-name">🔴 ${activeName} 🔴</span> натачивает свои клыки!`,
                `Защита нашего отряда трещит по швам! Свирепый монстр <span class="gold-unit-focus-name">💀 ${activeName} 💀</span> выбирает следующую жертву!`,
                `Приготовьтесь к жестокому испытанию стойкости! Яростный палач <span class="gold-unit-focus-name">🩸 ${activeName} 🩸</span> заносит карающий клинок!`,
                `Земля содрогается от поступи первобытного зла! Жуткий исполин <span class="gold-unit-focus-name">⛰️ ${activeName} ⛰️</span> начинает сокрушительный штурм!`,
                `Удар из коварной засады неотвратим! Опасный убийца <span class="gold-unit-focus-name">🗡️ ${activeName} 🗡️</span> бесшумно выходит из невидимости!`,
                `Древнее проклятие Бет-Майри обретает плоть! Безумный чернокнижник <span class="gold-unit-focus-name">🔮 ${activeName} 🔮</span> шепчет слова погибели!`,
                `Ядовитый оскал и леденящий блеск мертвых глаз! Смертоносный хищник <span class="gold-unit-focus-name">🐺 ${activeName} 🐺</span> бросается вперед!`,
                `Сталь и магия Бездны готовы выжечь эту землю! Темный лорд <span class="gold-unit-focus-name">🚩 ${activeName} 🚩</span> диктует свои условия!`,
                `Никакой пощады и никаких переговоров! Бескомпромиссный крушитель <span class="gold-unit-focus-name">🔨 ${activeName} 🔨</span> рвется крушить черепа!`,
                `Магический вихрь разрушения окутывает поле боя! Вестник апокалипсиса <span class="gold-unit-focus-name">🌪️ ${activeName} 🌪️</span> начинает сокрушать ряды!`,
                `Мрачное предзнаменование зависло над героями! Безжалостный каратель <span class="gold-unit-focus-name">⛓️ ${activeName} ⛓️</span> выходит на идеальную позицию!`,
                `Ужас пронизывает сердца до самого основания! Инфернальный страж <span class="gold-unit-focus-name">👁️ ${activeName} 👁️</span> открывает свои смертоносные очи!`,
                `Жажда крови ведет это отродье сквозь пламя битвы! Дикий берсерк <span class="gold-unit-focus-name">🔥 ${activeName} 🔥</span> размахивает тяжелым топором!`,
                `Каждое движение этого чудовища дышит чистой яростью! Древний кошмар <span class="gold-unit-focus-name">👹 ${activeName} 👹</span> готов разорвать дистанцию!`,
                `Тяжелый доспех осквернен темными рунами упадка! Проклятый рыцарь <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span> начинает безжалостную атаку!`,
                `Свист оперяемых стрел предвещает скорые спас-броски! Меткий засадный стрелок <span class="gold-unit-focus-name">🏹 ${activeName} 🏹</span> берет нас на мушку!`,
                `Голод Бездны невозможно утолить золотом или мольбами! Прожорливый тварь-людоед <span class="gold-unit-focus-name">🔱 ${activeName} 🔱</span> начинает ход!`,
                `Ледяной ветер смерти сковывает движения наших героев! Хладнокровный убийца <span class="gold-unit-focus-name">❄️ ${activeName} ❄️</span> обнажает оружие!`,
                `Смертельный приговор уже вынесен и скреплен кровью! Безжалостный вожак стаи <span class="gold-unit-focus-name">👑 ${activeName} 👑</span> отдает приказ!`,
                `Скрежет когтей по камню заставляет содрогнуться! Скрытный подземный охотник <span class="gold-unit-focus-name">🐾 ${activeName} 🐾</span> готовит прыжок!`,
                `Иллюзия безопасности рассыпается прахом! Коварный гипнотизер <span class="gold-unit-focus-name">🔮 ${activeName} 🔮</span> плетет паутину лжи!`,
                `Жуткое эхо раскатывается по коридорам подземелья! Разъяренный страж гробницы <span class="gold-unit-focus-name">🔱 ${activeName} 🔱</span> идет на таран!`,
                `Тьма забирает свет, не оставляя шанса на спасение! Могущественный предводитель орды <span class="gold-unit-focus-name">🚩 ${activeName} 🚩</span> начинает ход!`,
                `Вся ярость дикой природы ополчилась против нас! Разъяренный лесной монстр <span class="gold-unit-focus-name">🌿 ${activeName} 🌿</span> ломает строй!`,
                // Шуточные фразы RPG-стиля
                `«Кажется, у этого парня класс доспеха под тридцать...» — паникует лекарь. Ход делает непобедимый <span class="gold-unit-focus-name">⛓️ ${activeName} ⛓️</span>!`,
                `Этот монстр явно прочитал бестиарий и знает наши слабые места! Коварный бестия-тактик <span class="gold-unit-focus-name">🎯 ${activeName} 🎯</span> начинает ход!`,
                `Кубики d20 у этой вражины явно заговорены на постоянные двадцатки! Наглый везунчик <span class="gold-unit-focus-name">🎲 ${activeName} 🎲</span> готовится бить!`,
                `«Я же говорил, что проверять тот подозрительный сундук было плохой идеей!» — кричит плут. На нас прет <span class="gold-unit-focus-name">👹 ${activeName} 👹</span>!`,
                `Кто-то из нашей команды сейчас гарантированно отправится на спас-броски от смерти! Свирепый <span class="gold-unit-focus-name">💀 ${activeName} 💀</span> заносит топор!`,
                `У него очков здоровья больше, чем у всей нашей партии вместе взятой! Огромный губчатый босс <span class="gold-unit-focus-name">⛰️ ${activeName} ⛰️</span> идет в атаку!`,
                `«У кого из вас самый низкий показатель пассивного восприятия?» — зловеще намекает ситуация. Нападает скрытный <span class="gold-unit-focus-name">🗡️ ${activeName} 🗡️</span>!`,
                `Этот парень пришел не за диалогом, он пришел за полным вайпом нашей команды! Жестокий <span class="gold-unit-focus-name">💥 ${activeName} 💥</span> тратит ход!`,
                `Лекарь партии уже приготовил свитки воскрешения на случай худшего сценария! Смертоносный враг <span class="gold-unit-focus-name">🔱 ${activeName} 🔱</span> начинает комбо!`,
                `«Его показатель КД слишком высок, мы не пробьем!» — кричит воин в панике. Наглый противник <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span> ухмыляется!`,
                `Бросок на инициативу у этого чудовища идеален, готовьтесь страдать! Коварный монстр <span class="gold-unit-focus-name">⚡ ${activeName} ⚡</span> ходит первым!`
            ];
        }

        // 💛 КАТЕГОРИЯ: НЕЙТРАЛЫ / ОКРУЖЕНИЯ
        return [
            // Пафосные / Загадочные фразы
            `Ситуация накаляется до предела! Загадочный свидетель <span class="gold-unit-focus-name">💛 ${activeName} 💛</span> выжидает идеальный момент!`,
            `Чью сторону примет эта непредсказуемая сила? Таинственный незнакомец <span class="gold-unit-focus-name">🔮 ${activeName} 🔮</span> вступает в конфликт!`,
            `В жилах кипит адреналин, но истинные мотивы скрыты! Свой ход начинает загадочный <span class="gold-unit-focus-name">⚡ ${activeName} ⚡</span>!`,
            `Третья сторона вмешивается в великую битву за Украденные Земли! Мудрый наблюдатель <span class="gold-unit-focus-name">📜 ${activeName} 📜</span> начинает ход!`,
            `Нейтралитет — штука хрупкая и опасная для обеих сторон! Непредсказуемый воин <span class="gold-unit-focus-name">🦅 ${activeName} 🦅</span> обдумывает шаги!`,
            `Свидетель этой эпической бойни решает, куда лучше направить клинок! Осторожный боец <span class="gold-unit-focus-name">❄️ ${activeName} ❄️</span> замер!`,
            `Судьба замерла в точке абсолютной неопределенности! Загадочный странник <span class="gold-unit-focus-name">⚜️ ${activeName} ⚜️</span> делает свой шаг!`,
            `Скрытый потенциал этого существа способен перевернуть исход войны! Могучий титан <span class="gold-unit-focus-name">⛰️ ${activeName} ⛰️</span> выходит на поле!`,
            `В тени великих армий скрывается истинная угроза! Молчаливый отшельник <span class="gold-unit-focus-name">👁️ ${activeName} 👁️</span> начинает действовать!`,
            `Каждое решение этого персонажа окутано завесой тайны! Одинокий волк <span class="gold-unit-focus-name">🐺 ${activeName} 🐺</span> оглядывает арену схватки!`,
            `Баланс сил нарушен незваным гостем! Бесстрашный наемник <span class="gold-unit-focus-name">⚔️ ${activeName} ⚔️</span> готов продать свой меч дороже!`,
            `Суровый закон природы не знает правых и виноватых! Разъяренный лесной зверь <span class="gold-unit-focus-name">🌿 ${activeName} 🌿</span> бросается вперед!`,
            `Сквозь туман войны проступает силуэт нового участника! Гордый рыцарь ордена <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span> начинает ход!`,
            `Новая фигура на шахматной доске этой смертоносной сессии! Тайный агент <span class="gold-unit-focus-name">🎯 ${activeName} 🎯</span> делает маневр!`,
            `Слово ветерана весит больше, чем угрозы необстрелянных юнцов! Закаленный ветеран <span class="gold-unit-focus-name">👑 ${activeName} 👑</span> вступает в игру!`,
            `Холодная сталь не выбирает фракций и идеалов! Профессиональный киллер <span class="gold-unit-focus-name">🗡️ ${activeName} 🗡️</span> выходит на дистанцию!`,
            `Голос разума призывает прекратить это безумное кровопролитие! Мирный дипломат <span class="gold-unit-focus-name">☀️ ${activeName} ☀️</span> просит слова!`,
            `Вспышка стихийной магии путает карты обоим лагерям! Дикий элементаль <span class="gold-unit-focus-name">🔥 ${activeName} 🔥</span> вырывается на свободу!`,
            `Каждый вздох этого существа наполнен вековой мудростью! Старейшина племени <span class="gold-unit-focus-name">🔱 ${activeName} 🔱</span> начинает свой ход!`,
            `Невинная жертва обстоятельств или скрытый кукловод? Подозрительный путник <span class="gold-unit-focus-name">🚩 ${activeName} 🚩</span> начинает движение!`,
            `Грозовая туча рока сгущается над головами сражающихся! Яростный дух бури <span class="gold-unit-focus-name">🌪️ ${activeName} 🌪️</span> влетает в бой!`,
            `Тяжелый молот правосудия готов опуститься на головы нарушителей покоя! Судья <span class="gold-unit-focus-name">🔨 ${activeName} 🔨</span> берет инициативу!`,
            `Блеск золота манит сильнее, чем призывы к чести и доблести! Алчный охотник за головами <span class="gold-unit-focus-name">🔱 ${activeName} 🔱</span> начеку!`,
            `Скрытые следы ведут в глубину дикой непролазной чащи! Осторожный следопыт <span class="gold-unit-focus-name">🐾 ${activeName} 🐾</span> оценивает обстановку!`,
            // Шуточные фразы RPG-стиля
            `«Он за нас или пришел украсть наши кошельки с золотом?» — паникует бард. Действует хитрый <span class="gold-unit-focus-name">💰 ${activeName} 💰</span>!`,
            `«Я просто мимо проходил, у меня лавка в соседнем селе!» — заявляет перепуганный торговец <span class="gold-unit-focus-name">💰 ${activeName} 💰</span>!`,
            `Местный стражник спросонья вообще пытается понять, в кого стрелять! Наш медлительный <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span> тупит!`,
            `Дикий лесной кабанчик случайно выбежал на арену боя и запутал всю тактику! Ошалевший <span class="gold-unit-focus-name">🐗 ${activeName} 🐗</span> бежит вперед!`,
            `Пока все вокруг дерутся не на жизнь, а на смерть, этот парень просто спит! Меланхоличный <span class="gold-unit-focus-name">💤 ${activeName} 💤</span> спит!`,
            `«Если мы его не тронем, это чучело нас тоже не укусит?» — надеется лекарь. Действует бродячий <span class="gold-unit-focus-name">🐺 ${activeName} 🐺</span>!`,
            `Правила настольной игры подкинули случайное событие из таблицы встреч! На поле боя топчется <span class="gold-unit-focus-name">🎲 ${activeName} 🎲</span>!`,
            `«Эй, не бейте меня, я важный сюжетный NPC, я бессмертный!» — истошно вопит испуганный <span class="gold-unit-focus-name">⚜️ ${activeName} ⚜️</span>!`,
            `Этот участник боя вообще забыл, зачем пришел, и просто наслаждается хаосом! Рассеянный <span class="gold-unit-focus-name">💥 ${activeName} 💥</span> тратит ход!`,
            `Лекарь партии пытается наложить на него дипломатию, пока воин заносит топор! Непонятливый <span class="gold-unit-focus-name">🔮 ${activeName} 🔮</span> моргает!`,
            `Бросок d20 на дружелюбие этого существа показал средний результат, ждем сюрпризов! Нерешительный <span class="gold-unit-focus-name">🎲 ${activeName} 🎲</span> думает!`
        ];
    },

    renderUi() {
        const container = document.getElementById('initiativeTabletContainer');
        if (!container) return;

        if (!container.querySelector('.init-header-zone')) {
            container.innerHTML = `
                <div class="initiative-tablet-content" style="width: 100%;">
                    <div class="init-header-zone">
                        <div class="init-master-battle-control-bar">
                            <div class="init-round-counter-badge">
                                РАУНД <span id="initRoundCounterNum">1</span>
                                <button type="button" id="initBtnResetRoundOnly" class="init-btn-reset-round-inline" title="Сбросить раунды до 1">🔄</button>
                            </div>
                            <button type="button" id="initBtnToggleView" class="init-btn-view-toggle" title="Сменить стиль отображения">⚔️ Режим: Список / Горизонт</button>
                            <button type="button" class="btn ok" id="initBtnNextTurn" style="flex-grow: 1; height: 50px; font-size: 18px; font-weight: 900; letter-spacing: 1px;">🛡️ СЛЕДУЮЩИЙ ХОД</button>
                        </div>
                        <div class="init-quick-input-bar" style="margin-top: 14px;">
                            <input type="text" id="initInputName" placeholder="Имя персонажа / Название монстра...">
                            <div class="camp-count-controls" style="padding: 2px 8px;">
                                <span class="camp-param-label" style="font-size: 16px; margin-right: 4px;">Иниц:</span>
                                <button type="button" onclick="document.getElementById('initInputScore').value = Math.max(1, parseInt(document.getElementById('initInputScore').value, 10) - 1)">-</button>
                                <input type="text" id="initInputScore" value="10" style="width: 50px; text-align: center; background: #000; border: 1px solid #543e0d; color: #fff; font-weight: bold;">
                                <button type="button" onclick="document.getElementById('initInputScore').value = Math.min(100, parseInt(document.getElementById('initInputScore').value, 10) + 1)">+</button>
                            </div>
                            <label class="init-nat20-checkbox-label" title="Натуральная 20" style="margin-right: 4px !important;"><input type="checkbox" id="initInputNat20"><span>D20</span></label>
                            <label class="init-nat20-checkbox-label" title="Натуральная 1" style="border-color: #823030 !important;"><input type="checkbox" id="initInputNat1"><span style="color: #ff7675 !important;">D1</span></label>
                            <select id="initInputFaction" style="width: 140px; background: #090f0b; border: 1px solid #543e0d; color: #ebd291; padding: 4px;">
                                <option value="friend">🟢 Союзник</option><option value="neutral" selected>💛 Нейтрал</option><option value="enemy">🔴 Враг</option>
                            </select>
                            <button type="button" class="btn ok" id="initBtnAdd" style="padding: 6px 20px; font-size: 14px; min-width: auto; height: 38px;">⚜ Добавить</button>
                        </div>
                    </div>
                    <div id="initiativeCombatantsList" class="init-cards-scroll-list"></div>
                </div>
            `;
            this._isInputsBound = false;
        }

        if (!this._isInputsBound) {
            const nameInp = document.getElementById('initInputName'); const scoreInp = document.getElementById('initInputScore');
            const nat20Inp = document.getElementById('initInputNat20'); const nat1Inp = document.getElementById('initInputNat1');
            document.getElementById('initBtnNextTurn').addEventListener('click', () => this.nextTurn());
            document.getElementById('initBtnToggleView').addEventListener('click', () => this.toggleViewMode());
            document.getElementById('initBtnResetRoundOnly').addEventListener('click', (e) => { e.stopPropagation(); this.resetRound(); });

            nat20Inp.addEventListener('change', () => { if (nat20Inp.checked) { scoreInp.value = 20; scoreInp.disabled = true; scoreInp.style.opacity = '0.5'; if (nat1Inp) nat1Inp.checked = false; } else { scoreInp.disabled = false; scoreInp.style.opacity = '1'; } });
            if (nat1Inp) { nat1Inp.addEventListener('change', () => { if (nat1Inp.checked) { scoreInp.value = 1; scoreInp.disabled = true; scoreInp.style.opacity = '0.5'; nat20Inp.checked = false; } else { scoreInp.disabled = false; scoreInp.style.opacity = '1'; } }); }

            document.getElementById('initBtnAdd').addEventListener('click', () => { this.addCombatant(nameInp.value, scoreInp.value, document.getElementById('initInputFaction').value, nat20Inp.checked, nat1Inp ? nat1Inp.checked : false); nameInp.value = ''; nat20Inp.checked = false; if (nat1Inp) nat1Inp.checked = false; scoreInp.disabled = false; scoreInp.style.opacity = '1'; scoreInp.value = '10'; nameInp.focus(); });
            this._isInputsBound = true;
        }

        const listContainer = document.getElementById('initiativeCombatantsList');
        if (!listContainer) return;
        listContainer.innerHTML = '';

        if (this.state.viewMode === 'bg3') {
            listContainer.classList.add('mode-bg3');
            document.getElementById('initBtnToggleView').textContent = '🏹 Режим: Горизонт';
        } else {
            listContainer.classList.remove('mode-bg3');
            document.getElementById('initBtnToggleView').textContent = '📜 Режим: Список';
        }

        const roundNumEl = document.getElementById('initRoundCounterNum');
        if (roundNumEl) roundNumEl.textContent = this.state.round;

        const oldShield = container.querySelector('.init-focus-quote-shield');
        if (oldShield) oldShield.remove();

        if (this.state.combatants.length === 0) {
            listContainer.innerHTML = `<div class="quest-log-empty">Бой не начат. Добавьте участников.</div>`;
            return;
        }

        const activeUnit = this.state.combatants.find(c => c.id === this.state.selectedUnitId) || this.state.combatants[0];
        const phrases = this.getEpicPhrases(activeUnit);
        const currentQuoteHTML = phrases[this.state.phraseSeed % phrases.length];

        this.state.combatants.forEach((unit, index) => {
            const card = document.createElement('div');
            const isActive = this.state.selectedUnitId === unit.id;
            card.className = `init-combatant-card faction-${unit.faction}`;
            card.setAttribute('draggable', 'true');
            card.setAttribute('data-id', unit.id);
            if (isActive) card.classList.add('selected-turn-gold');

            let statusIcon = '';
            if (unit.isNat20) statusIcon = '<span class="init-crown-badge">👑</span>';
            if (unit.isNat1) statusIcon = '<span class="init-nat1-skull-badge">💀</span>';

            card.innerHTML = `
                <div class="init-card-left" style="pointer-events: none;">
                    <div class="init-turn-pointer-arrow ${isActive ? 'visible' : ''}">▶</div>
                    <div class="init-badge-index">${index + 1}</div>
                    <div class="init-card-name-text">${unit.name}</div>
                    ${statusIcon}
                </div>
                <div class="init-card-right">
                    <button type="button" class="init-btn-toggle-d20-inline ${unit.isNat20 || unit.isNat1 ? 'active' : ''}">🎲</button>
                    <div class="init-select-wrapper">
                        <select class="init-inline-faction-select" data-id="${unit.id}">
                            <option value="friend" ${unit.faction === 'friend' ? 'selected' : ''}>🟢 Свой</option>
                            <option value="neutral" ${unit.faction === 'neutral' ? 'selected' : ''}>💛 Нейтрал</option>
                            <option value="enemy" ${unit.faction === 'enemy' ? 'selected' : ''}>🔴 Чужой</option>
                        </select>
                    </div>
                    <div class="init-score-massive-block">
                        <input type="number" class="init-inline-score-input" data-id="${unit.id}" value="${unit.score}">
                    </div>
                    <button type="button" class="init-btn-delete-card">×</button>
                </div>
            `;

            card.addEventListener('click', (e) => {
                if (e.target.tagName !== 'SELECT' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
                    this.toggleSelectUnit(unit.id);
                }
            });

            card.querySelector('.init-btn-toggle-d20-inline').addEventListener('click', (e) => {
                e.stopPropagation();
                if (!unit.isNat20 && !unit.isNat1) this.toggleNat20(unit.id);
                else if (unit.isNat20) this.toggleNat1(unit.id);
                else { unit.isNat1 = false; this._sortAndSave(); }
            });

            const scoreInp = card.querySelector('.init-inline-score-input');
            scoreInp.addEventListener('wheel', (e) => {
                e.preventDefault();
                const direction = e.deltaY < 0 ? 1 : -1;
                const newVal = Math.max(1, Math.min(100, (parseInt(scoreInp.value, 10) || 0) + direction));
                this.updateScore(unit.id, newVal);
            });

            scoreInp.addEventListener('change', (e) => this.updateScore(unit.id, e.target.value));

            card.querySelector('.init-inline-faction-select').addEventListener('change', (e) => {
                this.updateFaction(unit.id, e.target.value);
                this._sortAndSave();
            });

            card.querySelector('.init-btn-delete-card').addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeCombatant(unit.id);
            });

            card.addEventListener('dragstart', (e) => {
                card.classList.add('init-card-dragging');
                e.dataTransfer.setData('text/plain', unit.id);
            });
            card.addEventListener('dragend', () => card.classList.remove('init-card-dragging'));
            card.addEventListener('dragover', (e) => e.preventDefault());
            card.addEventListener('drop', (e) => {
                e.preventDefault();
                const draggedId = e.dataTransfer.getData('text/plain');
                const draggedIdx = this.state.combatants.findIndex(c => c.id === draggedId);
                const targetIdx = this.state.combatants.findIndex(c => c.id === unit.id);
                if (draggedIdx !== -1 && targetIdx !== -1) {
                    const [draggedItem] = this.state.combatants.splice(draggedIdx, 1);
                    this.state.combatants.splice(targetIdx, 0, draggedItem);
                    this._saveWithoutSort();
                }
            });

            listContainer.appendChild(card);
        });

        const quoteShield = document.createElement('div');
        quoteShield.className = 'init-focus-quote-shield';
        quoteShield.innerHTML = `<div class="init-focus-phrase-text">${currentQuoteHTML}</div>`;
        listContainer.parentNode.appendChild(quoteShield);
    }
};

export default InitiativeManager;
