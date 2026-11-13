/**
 * СПРАВОЧНИК БОЕВЫХ И ЮМОРИСТИЧЕСКИХ ФРАЗ ДЛЯ ТРЕКЕРА ИНИЦИАТИВЫ
 */
export const InitiativePhrases = {
    getPhrasesForUnit(activeUnit) {
        const activeName = activeUnit ? activeUnit.name : 'Неизвестно';
        const faction = activeUnit ? activeUnit.faction : 'neutral';
        const status = activeUnit ? activeUnit.status : 'active';

        if (status === 'dying') {
            return this._dyingPhrases(activeName);
        }
        if (status === 'prone') {
            return this._pronePhrases(activeName);
        }
        if (activeUnit?.isNat20) {
            return this._nat20Phrases(activeName);
        }
        if (activeUnit?.isNat1) {
            return this._nat1Phrases(activeName);
        }

        if (faction === 'friend') {
            return [...this._friendBase(activeName), ...this._friendExtra(activeName)];
        }
        if (faction === 'enemy') {
            return [...this._enemyBase(activeName), ...this._enemyExtra(activeName)];
        }
        return this._neutralExtra(activeName);
    },

    _dyingPhrases(activeName) {
        return [
            `СПАС-БРОСОК ОТ СМЕРТИ! С того света передает привет и кидает кубик <span class="gold-unit-focus-name">💀 ${activeName} 💀</span>!`,
            `«Кто-нибудь, залейте в меня зелье лечения, пока я не выкинул единицу!» — хрипит <span class="gold-unit-focus-name">🩸 ${activeName} 🩸</span>!`,
            `Свет в конце тоннеля уже виден, но все еще держится за жизнь <span class="gold-unit-focus-name">🕯️ ${activeName} 🕯️</span>!`,
            `Лежит без сознания, но морально поддерживает всех остальных наш <span class="gold-unit-focus-name">💔 ${activeName} 💔</span>!`,
            `«Мастер, а двадцатка на спас-броске ведь сразу поднимает в один хит?!» — надеется <span class="gold-unit-focus-name">🎲 ${activeName} 🎲</span>!`,
            `Смерть уже занесла косу, но пока не сдается упрямый <span class="gold-unit-focus-name">⏳ ${activeName} ⏳</span>!`,
            `«Я просто прилег отдохнуть посреди боя, не отвлекайтесь!» — бормочет в бреду <span class="gold-unit-focus-name">💤 ${activeName} 💤</span>!`,
            `Жрец партии нервно ищет ячейки для исцеления, пока истекает кровью <span class="gold-unit-focus-name">🩹 ${activeName} 🩹</span>!`,
            `Два провала уже есть, права на ошибку больше не имеет наш <span class="gold-unit-focus-name">⚠️ ${activeName} ⚠️</span>!`,
            `«Если я сейчас умру, мой новый персонаж будет братом-близнецом!» — обещает <span class="gold-unit-focus-name">📜 ${activeName} 📜</span>!`
        ];
    },

    _pronePhrases(activeName) {
        return [
            `РАСПЛАСТАН НА ЗЕМЛЕ! Внимательно изучает узор на полу и тратит половину скорости <span class="gold-unit-focus-name">💫 ${activeName} 💫</span>!`,
            `«Я не упал, я занял выгодную позицию для стрельбы лежа!» — уверяет <span class="gold-unit-focus-name">🏹 ${activeName} 🏹</span>!`,
            `Гравитация сегодня беспощадна! С трудом отрывается от земли <span class="gold-unit-focus-name">🪨 ${activeName} 🪨</span>!`,
            `Помеха на броски атаки, зато от стрел укрываться удобно! Встает с колен <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span>!`,
            `«Кто вообще разлил здесь масло?!» — ругается, потирая ушибленный бок, <span class="gold-unit-focus-name">🧴 ${activeName} 🧴</span>!`,
            `Враги в ближнем бою уже потирают руки от преимущества, пока поднимается <span class="gold-unit-focus-name">🤕 ${activeName} 🤕</span>!`,
            `«Это был тактический перекат, просто он немного затянулся!» — оправдывается <span class="gold-unit-focus-name">🤸 ${activeName} 🤸</span>!`,
            `Половина движения ушла на то, чтобы просто встать! Отряхивает доспехи <span class="gold-unit-focus-name">🧹 ${activeName} 🧹</span>!`,
            `«Подайте руку, я в этих латах как перевернутая черепаха!» — просит помощи <span class="gold-unit-focus-name">🐢 ${activeName} 🐢</span>!`,
            `Земля-матушка притянула слишком сильно, но уже возвращается в строй <span class="gold-unit-focus-name">⚔️ ${activeName} ⚔️</span>!`
        ];
    },

    _nat20Phrases(activeName) {
        return [
            `НАТУРАЛЬНАЯ ДВАДЦАТКА! Боги рандома целуют в лоб, пока на арену вырывается <span class="gold-unit-focus-name">🌟 ${activeName} 🌟</span>!`,
            `КРИТИЧЕСКИЙ УСПЕХ НА ИНИЦИАТИВУ! Вся вселенная замерла, ведь первым ходит <span class="gold-unit-focus-name">👑 ${activeName} 👑</span>!`,
            `«Кто-нибудь, проверьте этот d20 на магниты!» — кричит зал, пока торжествует <span class="gold-unit-focus-name">🎲 ${activeName} 🎲</span>!`,
            `Молниеносная реакция полубога! Еще никто не моргнул, а уже атакует <span class="gold-unit-focus-name">⚡ ${activeName} ⚡</span>!`,
            `Природная 20! Даже Мастер подземелий уважительно снимает шляпу, когда ходит <span class="gold-unit-focus-name">🎩 ${activeName} 🎩</span>!`,
            `«Я знал, что благословение кубов сработает!» — сияет от счастья <span class="gold-unit-focus-name">✨ ${activeName} ✨</span>!`,
            `Идеальный бросок! Враги еще не успели достать оружие, а в бой уже вступает <span class="gold-unit-focus-name">⚔️ ${activeName} ⚔️</span>!`,
            `Чистая двадцатка на грани! Судьба сегодня явно на стороне, которой управляет <span class="gold-unit-focus-name">🍀 ${activeName} 🍀</span>!`,
            `Двадцать на кубе! Время остановилось, чтобы первым походил неподражаемый <span class="gold-unit-focus-name">⏳ ${activeName} ⏳</span>!`,
            `«Я просто подул на кубик перед броском!» — хвастается невероятно везучий <span class="gold-unit-focus-name">🌬️ ${activeName} 🌬️</span>!`,
            `Крит на инициативу! Этот парень явно продал душу за идеальные броски, встречайте — <span class="gold-unit-focus-name">🔥 ${activeName} 🔥</span>!`,
            `Натуральная 20! Даже дракон в соседней пещере зааплодировал, когда вступил в бой <span class="gold-unit-focus-name">🐉 ${activeName} 🐉</span>!`
        ];
    },

    _nat1Phrases(activeName) {
        return [
            `КРИТИЧЕСКИЙ ПРОВАЛ НА ИНИЦИАТИВУ! Запутался в собственных шнурках и ходит последним <span class="gold-unit-focus-name">🤡 ${activeName} 🤡</span>!`,
            `ЕДИНИЧКА НА d20! Бой уже почти закончился, когда наконец проснулся <span class="gold-unit-focus-name">💤 ${activeName} 💤</span>!`,
            `«Погодите, а мы уже деремся?!» — роняет оружие и паникует <span class="gold-unit-focus-name">🤦 ${activeName} 🤦</span>!`,
            `Природная 1! Этот кубик немедленно отправляется в микроволновку, а в бой плетется <span class="gold-unit-focus-name">🐌 ${activeName} 🐌</span>!`,
            `Реакция ленивца под сонным зельем! Спустя вечность в драку вступает <span class="gold-unit-focus-name">🐢 ${activeName} 🐢</span>!`,
            `«Я просто засмотрелся на красивую люстру в подземелье!» — оправдывается <span class="gold-unit-focus-name">🕯️ ${activeName} 🕯️</span>!`,
            `Единица! Даже табуретка в таверне среагировала быстрее, чем наш <span class="gold-unit-focus-name">🪑 ${activeName} 🪑</span>!`,
            `Классическая натуральная единица! С грацией мешка картошки вступает в бой <span class="gold-unit-focus-name">🥔 ${activeName} 🥔</span>!`,
            `«А что мы вообще здесь делаем?» — протирает заспанные глаза неудачливый <span class="gold-unit-focus-name">🥱 ${activeName} 🥱</span>!`,
            `Единица на кубе! Уронил щит себе на ногу и только сейчас начинает ход <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span>!`,
            `Крит-провал! Пока все дрались, завязывал плащ и искал стрелы рассеянный <span class="gold-unit-focus-name">🏹 ${activeName} 🏹</span>!`,
            `«Кажется, я забыл вытащить меч из ножен...» — краснеет от стыда <span class="gold-unit-focus-name">🗡️ ${activeName} 🗡️</span>!`
        ];
    },

    _friendBase(activeName) {
        return [
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
            `Лист персонажа перечеркан до дыр, но боевой дух силен! Наш отчаянный <span class="gold-unit-focus-name">⚔️ ${activeName} ⚔️</span> начинает ходить!`,
            `«Я трачу свое действие, чтобы пафосно поправить плащ!» — заявляет стильный <span class="gold-unit-focus-name">🧥 ${activeName} 🧥</span>!`,
            `Математика D&D — штука сложная, поэтому на пальцах складывает бонусы <span class="gold-unit-focus-name">🧮 ${activeName} 🧮</span>!`,
            `«Мастер, а за креативность будет преимущество на бросок?» — подмигивает хитрый <span class="gold-unit-focus-name">😉 ${activeName} 😉</span>!`,
            `Когда заканчиваются аргументы и стрелы, в ход идут кулаки! Вперед летит <span class="gold-unit-focus-name">👊 ${activeName} 👊</span>!`,
            `«Я использую "Уклонение" и молюсь всем богам Пантеона!» — шепчет осторожный <span class="gold-unit-focus-name">🙏 ${activeName} 🙏</span>!`,
            `Вся надежда партии на то, что не промахнется наш меткий <span class="gold-unit-focus-name">🎯 ${activeName} 🎯</span>!`,
            `«А можно я сначала поем рацион, а потом ударю?» — уточняет голодный <span class="gold-unit-focus-name">🍗 ${activeName} 🍗</span>!`,
            `Заклинание «Волшебная стрела» никогда не промахивается, радуется наш <span class="gold-unit-focus-name">✨ ${activeName} ✨</span>!`,
            `«Если мы победим, я сочиню об этом балладу... и перевру все факты!» — обещает <span class="gold-unit-focus-name">🪕 ${activeName} 🪕</span>!`,
            `Инвентарь забит хламом на триста фунтов, но в бой уверенно идет <span class="gold-unit-focus-name">🎒 ${activeName} 🎒</span>!`,
            `«Я точно помню, что брал с собой веревку и крюк-кошку!» — роется в рюкзаке <span class="gold-unit-focus-name">🪢 ${activeName} 🪢</span>!`,
            `Критическое попадание уже близко, чувствует это наш заряженный <span class="gold-unit-focus-name">⚡ ${activeName} ⚡</span>!`,
            `«Не переживайте, у меня есть Слово Целителя на бонусное действие!» — успокаивает всех <span class="gold-unit-focus-name">💚 ${activeName} 💚</span>!`,
            `Свиток с неизвестным заклинанием — отличная лотерея! Рискует бесстрашный <span class="gold-unit-focus-name">📜 ${activeName} 📜</span>!`,
            `«Я впадаю в Ярость и перестаю думать о последствиях!» — рычит неудержимый <span class="gold-unit-focus-name">💢 ${activeName} 💢</span>!`,
            `Пять футов до врага не хватило, но не теряет оптимизма наш быстрый <span class="gold-unit-focus-name">👟 ${activeName} 👟</span>!`,
            `«Погодите, у меня же есть Реакция на этот случай!» — радостно вспоминает <span class="gold-unit-focus-name">💡 ${activeName} 💡</span>!`,
            `Вся тактика свелась к простому «бей сильнее», и ее блестяще исполняет <span class="gold-unit-focus-name">🔨 ${activeName} 🔨</span>!`,
            `«Мастер, а этот гоблин выглядит дружелюбным?» — пытается в дипломатию добрый <span class="gold-unit-focus-name">🕊️ ${activeName} 🕊️</span>!`,
            `Боевой дух на высоте, даже если хитов осталось на один чих! В бой идет <span class="gold-unit-focus-name">🔥 ${activeName} 🔥</span>!`
        ];
    },


        _friendExtra(activeName) {
            return [
                `Сквозь бурю клинков и стрел пробивается доблестный союзник <span class="gold-unit-focus-name">🟢 ${activeName} 🟢</span>!`,
                `Каждый удар этого воина приближает долгожданный триумф! Силен и опасен <span class="gold-unit-focus-name">⚔️ ${activeName} ⚔️</span>!`,
                `Небесный свет озаряет путь нашей команды! Благородный защитник <span class="gold-unit-focus-name">☀️ ${activeName} ☀️</span> начинает маневр!`,
                `Ярость праведного гнева сокрушит любые преграды! Сильный атлет <span class="gold-unit-focus-name">💪 ${activeName} 💪</span> рвется вперед!`,
                `Ни капли сомнения, только чистая воля к победе! Храбрый следопыт <span class="gold-unit-focus-name">🏹 ${activeName} 🏹</span> наготове!`,
                `Искры сыплются от тяжелых шагов по каменным плитам! Наш танк <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span> держит строй!`,
                `Старые клятвы верности зовут к великим свершениям! Благородный паладин <span class="gold-unit-focus-name">⚜️ ${activeName} ⚜️</span> начинает ход!`,
                `Смертоносная сталь поет в руках искусного мастера! Фехтовальщик <span class="gold-unit-focus-name">🗡️ ${activeName} 🗡️</span> выбирает позицию!`,
                `Энергия стихий покорна этому призыву! Величественный маг <span class="gold-unit-focus-name">✨ ${activeName} ✨</span> готов сотворить чудо!`,
                `Тактическое преимущество полностью на нашей стороне, пока в бою <span class="gold-unit-focus-name">🎯 ${activeName} 🎯</span>!`,
                `Гром аплодисментов и крики боевой ярости! Отважное сердце <span class="gold-unit-focus-name">❤️ ${activeName} ❤️</span> бьется в такт войне!`,
                `Ни шагу назад перед превосходящими силами врага! Бесстрашный боец <span class="gold-unit-focus-name">🔱 ${activeName} 🔱</span> наступает!`,
                `Легенды о сегодняшнем дне будут жить в веках! Гордый авантюрист <span class="gold-unit-focus-name">👑 ${activeName} 👑</span> начинает штурм!`,
                `Каждый маневр просчитан до мельчайших деталей! Наш главный стратег <span class="gold-unit-focus-name">📊 ${activeName} 📊</span> ходит!`,
                `Сквозь пламя битвы к бессмертной славе! Отважный соратник <span class="gold-unit-focus-name">🔥 ${activeName} 🔥</span> рвется в бой!`,
                `Знак геральдической лилии сияет на доспехах! На острие атаки оказывается <span class="gold-unit-focus-name">⚜️ ${activeName} ⚜️</span>!`,
                `Священное оружие готово обрушить кару на силы зла! Сильный крушитель <span class="gold-unit-focus-name">🔨 ${activeName} 🔨</span> наготове!`,
                `Никакой паники, строй остается монолитным и крепким! Наш защитник <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span> начинает ход!`,
                `Ветры перемен несут победу нашей доблестной партии! Храбрый боец <span class="gold-unit-focus-name">🌪️ ${activeName} 🌪️</span> наступает!`,
                `Чистый разум ведет клинок сквозь любую защиту! Бесстрашный витязь <span class="gold-unit-focus-name">⚔️ ${activeName} ⚔️</span> ходит!`,
                `Древняя магия крови пробуждается в этот судьбоносный миг! Колдун <span class="gold-unit-focus-name">🔮 ${activeName} 🔮</span> начинает ход!`,
                `«Так, у кого есть свободные ячейки заклинаний третьего уровня?» — паникует <span class="gold-unit-focus-name">🧙 ${activeName} 🧙</span>!`,
                `Бросок кубика на спас-бросок провален, но мы делаем вид, что так и задумывалось! Ходит <span class="gold-unit-focus-name">🎲 ${activeName} 🎲</span>!`,
                `«Если мы выживем, я скуплю всю выпивку в этой локации!» — мечтает <span class="gold-unit-focus-name">🍻 ${activeName} 🍺</span>!`,
                `Молитва великому двадцатиграннику d20 сработала, пришло время тратить очки действия! Ходит <span class="gold-unit-focus-name">⚜️ ${activeName} ⚜️</span>!`,
                `«Мой персонаж просто стоит в глухой обороне и молится!» — заявляет испуганный <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span>!`,
                `Тактика лобовой атаки провалилась, переходим к плану Б — паническому бегу в исполнении <span class="gold-unit-focus-name">🏃 ${activeName} 🏃</span>!`,
                `«Я забыл прибавить свой модификатор атаки к этому броску!» — внезапно вспоминает <span class="gold-unit-focus-name">📜 ${activeName} 📜</span>!`,
                `Эффект неожиданности утерян, зато у нас есть тяжелый двуручный топор и отчаянный <span class="gold-unit-focus-name">🪓 ${activeName} 🪓</span>!`,
                `«Кто-нибудь, разбудите нашего мага, его очередь наступила!» — кричит команда ушам <span class="gold-unit-focus-name">💤 ${activeName} 💤</span>!`,
                `Лист персонажа залит чаем, но боевой задор dnd-партии не сломить! Ход начинает <span class="gold-unit-focus-name">⚔️ ${activeName} ⚔️</span>!`,
                `«У меня нет плана, но есть вдохновение барда!» — радостно кричит <span class="gold-unit-focus-name">🎵 ${activeName} 🎵</span>!`,
                `Огненный шар в закрытой комнате — всегда отличная идея, уверен наш <span class="gold-unit-focus-name">🔥 ${activeName} 🔥</span>!`,
                `«Я просто хотел погладить этого милого мимика!» — оправдывается покусанный <span class="gold-unit-focus-name">📦 ${activeName} 📦</span>!`,
                `Свободное действие тратится на пафосную речь! Слово берет великий <span class="gold-unit-focus-name">🎭 ${activeName} 🎭</span>!`,
                `«Мастер, а можно я брошу на Акробатику, чтобы красиво спрыгнуть со стола?» — спрашивает <span class="gold-unit-focus-name">🤸 ${activeName} 🤸</span>!`,
                `Запас зелий иссяк, осталась только вера в природную двадцатку! В бой идет <span class="gold-unit-focus-name">🍀 ${activeName} 🍀</span>!`,
                `«Я не ворую лут во время боя, я просто проверяю вес сундука!» — заявляет честный <span class="gold-unit-focus-name">💰 ${activeName} 💰</span>!`,
                `Когда заканчиваются ячейки заклинаний, в ход идет обычный посох! Наступает суровый <span class="gold-unit-focus-name">🪄 ${activeName} 🪄</span>!`,
                `«Надеюсь, у этого тролля нет регенерации от огня... погодите-ка!» — замирает <span class="gold-unit-focus-name">🕯️ ${activeName} 🕯️</span>!`,
                `Бонусное действие уже потрачено впустую, но не унывает наш находчивый <span class="gold-unit-focus-name">🎲 ${activeName} 🎲</span>!`,
                `«Это не отступление, это тактическая перегруппировка к выходу!» — поясняет быстрый <span class="gold-unit-focus-name">💨 ${activeName} 💨</span>!`,
                `Вся партия замерла в ожидании, пока <span class="gold-unit-focus-name">📖 ${activeName} 📖</span> полчаса читает описание своего заклинания!`,
                `«Мой фамильяр сейчас сделает всю грязную работу!» — гордо заявляет ленивый <span class="gold-unit-focus-name">🦉 ${activeName} 🦉</span>!`,
                `Харизма на максимуме, интеллект в минусе! Врага пытается заболтать наш обаятельный <span class="gold-unit-focus-name">✨ ${activeName} ✨</span>!`,
                `«Я использую Действие "Рывок", чтобы спрятаться за спину нашего танка!» — решает мудрый <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span>!`,
                `Кубики отправлены в «тюрьму для плохих кубов», а новый d20 берет в руки <span class="gold-unit-focus-name">⛓️ ${activeName} ⛓️</span>!`,
                `«У меня темное зрение на 60 футов, я все равно ничего не вижу!» — щурится в темноте <span class="gold-unit-focus-name">👁️ ${activeName} 👁️</span>!`,
                `Короткий отдых нам только снится, поэтому из последних сил сражается наш <span class="gold-unit-focus-name">⚔️ ${activeName} ⚔️</span>!`,
                `«А на это срабатывает провоцированная атака?» — с надеждой уточняет неосторожный <span class="gold-unit-focus-name">👣 ${activeName} 👣</span>!`,
                `Клятва верности требует идти до конца, даже если в хитах остался единичка! Вперед шагает <span class="gold-unit-focus-name">🩸 ${activeName} 🩸</span>!`
            ];
        },

    _enemyBase(activeName) {
        return [
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
            `Голод Бездны невозможно утолить золотом или мольбами! Прожорливая тварь-людоед <span class="gold-unit-focus-name">🔱 ${activeName} 🔱</span> начинает ход!`,
            `Ледяной ветер смерти сковывает движения наших героев! Хладнокровный убийца <span class="gold-unit-focus-name">❄️ ${activeName} ❄️</span> обнажает оружие!`,
            `Смертельный приговор уже вынесен и скреплен кровью! Безжалостный вожак стаи <span class="gold-unit-focus-name">👑 ${activeName} 👑</span> отдает приказ!`,
            `Скрежет когтей по камню заставляет содрогнуться! Скрытный подземный охотник <span class="gold-unit-focus-name">🐾 ${activeName} 🐾</span> готовит прыжок!`,
            `Иллюзия безопасности рассыпается прахом! Коварный гипнотизер <span class="gold-unit-focus-name">🔮 ${activeName} 🔮</span> плетет паутину лжи!`,
            `Жуткое эхо раскатывается по коридорам подземелья! Разъяренный страж гробницы <span class="gold-unit-focus-name">🔱 ${activeName} 🔱</span> идет на таран!`,
            `Тьма забирает свет, не оставляя шанса на спасение! Могущественный предводитель орды <span class="gold-unit-focus-name">🚩 ${activeName} 🚩</span> начинает ход!`,
            `Вся ярость дикой природы ополчилась против нас! Разъяренный лесной монстр <span class="gold-unit-focus-name">🌿 ${activeName} 🌿</span> ломает строй!`,
            `«Кажется, у этого парня класс доспеха под тридцать...» — паникует лекарь. Ход делает непобедимый <span class="gold-unit-focus-name">⛓️ ${activeName} ⛓️</span>!`,
            `Этот монстр явно прочитал бестиарий и знает наши слабые места! Коварный бестия-тактик <span class="gold-unit-focus-name">🎯 ${activeName} 🎯</span> начинает ход!`,
            `Кубики d20 у этой вражины явно заговорены на постоянные двадцатки! Наглый везунчик <span class="gold-unit-focus-name">🎲 ${activeName} 🎲</span> готовится бить!`,
            `«Я же говорил, что проверять тот подозрительный сундук было плохой идеей!» — кричит плут. На нас прет <span class="gold-unit-focus-name">👹 ${activeName} 👹</span>!`,
            `Кто-нибудь из нашей команды сейчас гарантированно отправится на спас-броски от смерти! Свирепый <span class="gold-unit-focus-name">💀 ${activeName} 💀</span> заносит топор!`,
            `У него очков здоровья больше, чем у всей нашей партии вместе взятой! Огромный губчатый босс <span class="gold-unit-focus-name">⛰️ ${activeName} ⛰️</span> идет в атаку!`,
            `«У кого из вас самый низкий показатель пассивного восприятия?» — зловеще намекает ситуация. Нападает скрытный <span class="gold-unit-focus-name">🗡️ ${activeName} 🗡️</span>!`,
            `Этот парень пришел не за диалогом, он пришел за полным вайпом нашей команды! Жестокий <span class="gold-unit-focus-name">💥 ${activeName} 💥</span> тратит ход!`,
            `Лекарь партии уже приготовил свитки воскрешения на случай худшего сценария! Смертоносный враг <span class="gold-unit-focus-name">🔱 ${activeName} 🔱</span> начинает комбо!`,
            `«Его показатель КД слишком высок, мы не пробьем!» — кричит воин в панике. Наглый противник <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span> ухмыляется!`,
            `Бросок на инициативу у этого чудовища идеален, готовьтесь страдать! Коварный монстр <span class="gold-unit-focus-name">⚡ ${activeName} ⚡</span> ходит первым!`,
            // --- 20 новых шуточных фраз (Именительный падеж) ---
            `«У этого гада есть мультиатака, а у нас даже зелий не осталось!» — паникует отряд, пока наступает <span class="gold-unit-focus-name">⚔️ ${activeName} ⚔️</span>!`,
            `Показатель опасности этого чудовища явно выше нашей средней зарплаты! Свой ход начинает <span class="gold-unit-focus-name">💀 ${activeName} 💀</span>!`,
            `«Мастер, а у него точно не было второй фазы босса?!» — шепчет бард, глядя, как рычит <span class="gold-unit-focus-name">👹 ${activeName} 👹</span>!`,
            `Никакого милосердия, только криты и спас-броски Телосложения! В атаку идет беспощадный <span class="gold-unit-focus-name">🩸 ${activeName} 🩸</span>!`,
            `«Я пытаюсь притвориться мертвым, может, он пройдет мимо?» — надеется плут, пока рыщет <span class="gold-unit-focus-name">🐺 ${activeName} 🐺</span>!`,
            `Легендарное сопротивление сработало в третий раз подряд! Нагло ухмыляется неуязвимый <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span>!`,
            `«Кто вообще додумался крикнуть "Эй, урод!" в темной пещере?!» — кричит маг, когда выбегает <span class="gold-unit-focus-name">🔨 ${activeName} 🔨</span>!`,
            `Сейчас кто-то гарантированно улетит в ноль хитов с одного удара! Размахивается громадный <span class="gold-unit-focus-name">⛰️ ${activeName} ⛰️</span>!`,
            `«Он что, только что съел нашего фамильяра на бонусное действие?!» — ужасается колдун, пока чавкает <span class="gold-unit-focus-name">🐾 ${activeName} 🐾</span>!`,
            `Заклинание «Огненный шар» лишь приятно согрело этого монстра! Вперед шагает огнеупорный <span class="gold-unit-focus-name">🔥 ${activeName} 🔥</span>!`,
            `«У меня плохое предчувствие насчет этого кубика d12...» — бормочет воин, когда замахивается <span class="gold-unit-focus-name">🪓 ${activeName} 🪓</span>!`,
            `Похоже, дипломатия провалилась еще на этапе фразы «Мы пришли с миром»! Нападает злой <span class="gold-unit-focus-name">🚩 ${activeName} 🚩</span>!`,
            `«Если он сейчас наложит на нас Очарование, я буду бить своих!» — предупреждает варвар, пока колдует <span class="gold-unit-focus-name">🔮 ${activeName} 🔮</span>!`,
            `Этот противник явно не читал кодекс рыцарской чести и бьет лежачих! Коварный <span class="gold-unit-focus-name">🗡️ ${activeName} 🗡️</span> атакует!`,
            `«Мастер, мы же просто зашли спросить дорогу до таверны!» — оправдываются герои, пока наступает <span class="gold-unit-focus-name">👁️ ${activeName} 👁️</span>!`,
            `Аура ужаса заставляет коленки трястись даже у нашего паладина! На арене властвует жуткий <span class="gold-unit-focus-name">👑 ${activeName} 👑</span>!`,
            `«У него иммунитет к немагическому оружию, а у меня только ржавый кинжал!» — плачет разбойник, пока идет <span class="gold-unit-focus-name">⛓️ ${activeName} ⛓️</span>!`,
            `Бросок атаки у этого чудовища явно превысит тридцатку! Прицеливается смертоносный <span class="gold-unit-focus-name">🏹 ${activeName} 🏹</span>!`,
            `«Спорим, он сейчас испортит концентрацию на моем лучшем заклинании?!» — кричит жрец, когда бьет <span class="gold-unit-focus-name">⚡ ${activeName} ⚡</span>!`,
            `Свиток воскрешения стоит пятьсот золотых, а похороны еще дороже! Свой ход начинает безжалостный <span class="gold-unit-focus-name">💥 ${activeName} 💥</span>!`
        ];
    },


    _enemyExtra(activeName) {
        return [
            `Жажда разрушения движет этим созданием! Беспощадный <span class="gold-unit-focus-name">🔴 ${activeName} 🔴</span> наступает на позиции!`,
            `Древнее зло не знает усталости и жалости! Свирепый палач <span class="gold-unit-focus-name">💀 ${activeName} 💀</span> начинает свой ход!`,
            `Свист багровой стали рассекает воздух! Смертоносный противник <span class="gold-unit-focus-name">🩸 ${activeName} 🩸</span> рвется вперед!`,
            `Тьма наступает, поглощая остатки надежды! Жуткий монстр <span class="gold-unit-focus-name">👹 ${activeName} 👹</span> готов разорвать строй!`,
            `Доспехи этого чудовища покрыты кровью былых жертв! Проклятый рыцарь <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span> идет на таран!`,
            `Запах гари и мертвой плоти предвещает атаку! Свирепый берсерк <span class="gold-unit-focus-name">🔥 ${activeName} 🔥</span> поднимает топор!`,
            `Никто не спасется от этого яростного натиска! Бескомпромиссный крушитель <span class="gold-unit-focus-name">🔨 ${activeName} 🔨</span> наготове!`,
            `Смертоносное плетение магии упадка готово сорваться с пальцев! Колдун <span class="gold-unit-focus-name">🔮 ${activeName} 🔮</span> шепчет порчу!`,
            `Ужас сковывает движения, заставляя партию паниковать! Инфернальный страж <span class="gold-unit-focus-name">👁️ ${activeName} 👁️</span> ходит!`,
            `Каждое действие врага наполнено первобытной жестокостью! Дикий хищник <span class="gold-unit-focus-name">🐺 ${activeName} 🐺</span> оскалил клыки!`,
            `Стрелы коварного врага уже летят в сторону наших магов! Меткий засадник <span class="gold-unit-focus-name">🏹 ${activeName} 🏹</span> натягивает лук!`,
            `Тяжелый молот готов обрушить всю ярость на наши доспехи! Жестокий тиран <span class="gold-unit-focus-name">🔱 ${activeName} 🔱</span> начинает штурм!`,
            `Возмездие или вечное забвение ждет тех, кто встал на его пути! Грозный вожак <span class="gold-unit-focus-name">👑 ${activeName} 👑</span> атакует!`,
            `Скрежет когтей по металлу разносится во тьме подземелья! Скрытный охотник <span class="gold-unit-focus-name">🐾 ${activeName} 🐾</span> делает шаг!`,
            `Проклятое оружие жаждет новых душ для подпитки! Смертоносный паладин зла <span class="gold-unit-focus-name">🚩 ${activeName} 🚩</span> ходит!`,
            `Ледяное дыхание смерти сковывает волю наших защитников! Безжалостный убийца <span class="gold-unit-focus-name">❄️ ${activeName} ❄️</span> наступает!`,
            `Аура увядания исходит от каждого шага этого существа! Жуткий вестник рока <span class="gold-unit-focus-name">🔮 ${activeName} 🔮</span> начинает ход!`,
            `Иллюзия спасения рассыпается под тяжелыми ударами! Могучий крушитель строя <span class="gold-unit-focus-name">⛰️ ${activeName} ⛰️</span> прет вперед!`,
            `Вражеский авангард прорывает рубежи нашей обороны! Свирепый штурмовик <span class="gold-unit-focus-name">🚩 ${activeName} 🚩</span> начинает маневр!`,
            `Вся злоба диких пустошей сконцентрирована в этом ударе! Опасный воитель орды <span class="gold-unit-focus-name">🔱 ${activeName} 🔱</span> наготове!`,
            `Траектория этой атаки сулит тяжелые ранения! Неудержимый противник <span class="gold-unit-focus-name">⚡ ${activeName} ⚡</span> начинает ход!`,
            `«Этот монстр совершает уже третью атаку за один свой ход, это легально?!» — кричит бард в сторону <span class="gold-unit-focus-name">⚔️ ${activeName} ⚔️</span>!`,
            `Показатель здоровья этого босса не влезает в экран планшета! Огромная губка для урона <span class="gold-unit-focus-name">⛰️ ${activeName} ⛰️</span> делает шаг!`,
            `«Я уверен, у него d20 под столом заряжен только на криты!» — жалуется плут на <span class="gold-unit-focus-name">🎲 ${activeName} 🎲</span>!`,
            `Спас-бросок по КД провален, готовьтесь собирать выбитые зубы! Свирепый <span class="gold-unit-focus-name">🔨 ${activeName} 🔨</span> начинает комбо!`,
            `«Если он сейчас ударит по мне, мой персонаж умрет навсегда!» — бледнеет маг при виде <span class="gold-unit-focus-name">💀 ${activeName} 💀</span>!`,
            `Этот противник явно плевать хотел на наши хваленые классы защиты доспехов! Наглый крушитель <span class="gold-unit-focus-name">💥 ${activeName} 💥</span> бьет!`,
            `«У него иммунитет вообще ко всем моим типам стихийного урона!» — плачет чародей перед <span class="gold-unit-focus-name">✨ ${activeName} ✨</span>!`,
            `Боевой d20 этого монстра выдает двадцатку за двадцаткой, ломая наши щиты! Жестокий везунчик <span class="gold-unit-focus-name">⚡ ${activeName} ⚡</span> ходит!`,
            `«Кто-нибудь, свяжите этого гада дипломатией, иначе нам конец!» — паникует лекарь от <span class="gold-unit-focus-name">👹 ${activeName} 👹</span>!`,
            `Инициатива врага безупречна, готовьтесь принимать урон на первом же раунде! Опасный монстр <span class="gold-unit-focus-name">🎯 ${activeName} 🎯</span> атакует!`,
            `«Мастер зловеще улыбается и берет горсть шестигранников!» — пугается партия, пока ходит <span class="gold-unit-focus-name">🎲 ${activeName} 🎲</span>!`,
            `У этого парня есть легендарные действия, и одно из них — унижать героев! Наступает <span class="gold-unit-focus-name">👑 ${activeName} 👑</span>!`,
            `«А мы точно не забрели в локацию для 15-го уровня?!» — шепчет воин, глядя, как замахивается <span class="gold-unit-focus-name">💀 ${activeName} 💀</span>!`,
            `Сопротивление магии, иммунитет к яду и полное отсутствие совести! Свой ход начинает <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span>!`,
            `«Не переживайте, это всего лишь случайная встреча по дороге в город!» — ухмыляется жестокий <span class="gold-unit-focus-name">👹 ${activeName} 👹</span>!`,
            `Сейчас кто-то получит состояние «Опутан», «Ослеплен» и «Унижен»! Колдует коварный <span class="gold-unit-focus-name">🔮 ${activeName} 🔮</span>!`,
            `«Он только что проигнорировал мой Контрспелл?!» — кричит волшебник, пока торжествует <span class="gold-unit-focus-name">✨ ${activeName} ✨</span>!`,
            `Похоже, бард слишком неудачно пошутил в таверне, и теперь мстить пришел сам <span class="gold-unit-focus-name">⚔️ ${activeName} ⚔️</span>!`,
            `«Кидайте спас-бросок Мудрости со сложностью 22!» — требует беспощадный <span class="gold-unit-focus-name">👁️ ${activeName} 👁️</span>!`,
            `У него перезарядилось дыхание дракона на шестерке! Вся партия в ужасе, ведь ходит <span class="gold-unit-focus-name">🔥 ${activeName} 🔥</span>!`,
            `«Я просто хотел поторговаться за скидку!» — рыдает плут, которого вот-вот раздавит <span class="gold-unit-focus-name">⛰️ ${activeName} ⛰️</span>!`,
            `Никакого ролеплея, только чистый, концентрированный урон по площади! В бой врывается <span class="gold-unit-focus-name">💥 ${activeName} 💥</span>!`,
            `«Мастер, а у него точно не закончились ячейки заклинаний?» — с надеждой спрашивает партия, пока кастует <span class="gold-unit-focus-name">🧙 ${activeName} 🧙</span>!`,
            `Этот монстр явно не читал правила про честный баланс энкаунтеров! Свирепый <span class="gold-unit-focus-name">🔨 ${activeName} 🔨</span> бьет!`,
            `«Спорим, он сейчас пойдет бить именно нашего хилого мага?!» — угадывает тактику врага <span class="gold-unit-focus-name">🎯 ${activeName} 🎯</span>!`,
            `Угроза полного вайпа (TPK) возрастает до ста процентов! На арене свирепствует <span class="gold-unit-focus-name">🩸 ${activeName} 🩸</span>!`,
            `«Он даже не поцарапался от моей высшей кары!» — в шоке замирает паладин, пока смеется <span class="gold-unit-focus-name">⛓️ ${activeName} ⛓️</span>!`,
            `Ловушки в этом подземелье были лишь разминкой! Настоящую боль приносит <span class="gold-unit-focus-name">🗡️ ${activeName} 🗡️</span>!`,
            `«Кто вообще додумался разделить партию?!» — кричат герои, когда из тени выходит <span class="gold-unit-focus-name">🐾 ${activeName} 🐾</span>!`,
            `Готовьте чистые листы персонажей! Свою смертоносную серию атак начинает <span class="gold-unit-focus-name">📜 ${activeName} 📜</span>!`
        ];
    },

    _neutralExtra(activeName) {
        return [
            `Новое действующее лицо на арене этой смертоносной схватки! Осторожный странник <span class="gold-unit-focus-name">💛 ${activeName} 💛</span> замер!`,
            `В жилах этого воина кипит ярость, но цели до сих пор туманны! Загадочный наемник <span class="gold-unit-focus-name">⚔️ ${activeName} ⚔️</span> наготове!`,
            `Никто не знает, куда повернет клинок этой непредсказуемой третьей силы! Гордый искатель <span class="gold-unit-focus-name">🔮 ${activeName} 🔮</span> ходит!`,
            `Баланс сил колеблется, готовый рухнуть от любого неловкого маневра! Одинокий волк <span class="gold-unit-focus-name">🐺 ${activeName} 🐺</span> оглядывает поле!`,
            `Каждое решение этого персонажа окутано завесой мистической тайны! Древний хранитель <span class="gold-unit-focus-name">📜 ${activeName} 📜</span> начинает ход!`,
            `Свидетель этой эпической бойни решает, чью сторону занять выгоднее! Суровый страж <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span> начеку!`,
            `Сквозь густую пелену тумана проступает силуэт незваного гостя! Таинственный незнакомец <span class="gold-unit-focus-name">⚡ ${activeName} ⚡</span> делает шаг!`,
            `Суровый закон дикой природы призывает атаковать любого нарушителя покоя! Лесной хищник <span class="gold-unit-focus-name">🌿 ${activeName} 🌿</span> рычит!`,
            `Холодный расчет заставляет эту фигуру выжидать идеальный момент для удара! Охотник за головами <span class="gold-unit-focus-name">🗡️ ${activeName} 🗡️</span> замер!`,
            `Новая грозовая туча рока нависает над позициями обеих фракций! Свободный элементаль <span class="gold-unit-focus-name">🌪️ ${activeName} 🌪️</span> влетает в бой!`,
            `Голос разума призывает прекратить это безумное кровопролитие! Уважаемый дипломат <span class="gold-unit-focus-name">☀️ ${activeName} ☀️</span> просит слова!`,
            `Тяжелый молот правосудия готов опуститься на головы бунтовщиков! Суровый судья <span class="gold-unit-focus-name">🔨 ${activeName} 🔨</span> берет инициативу!`,
            `Скрытые следы ведут в самую глубь непролазной дикой чащи! Осторожный следопыт <span class="gold-unit-focus-name">🐾 ${activeName} 🐾</span> оценивает ситуацию!`,
            `Новая фигура на шахматной доске этой затянувшейся смертоносной сессии! Тайный агент <span class="gold-unit-focus-name">🎯 ${activeName} 🎯</span> ходит!`,
            `Вспышка стихийной магии путает карты обоим противоборствующим лагерям! Дикий маг <span class="gold-unit-focus-name">🔥 ${activeName} 🔥</span> наготове!`,
            `Слово ветерана весит гораздо больше, чем угрозы необстрелянных юнцов! Закаленный боец <span class="gold-unit-focus-name">👑 ${activeName} 👑</span> начинает ход!`,
            `Холодная острая сталь не выбирает фракций, идеалов или ложных союзов! Профессиональный киллер <span class="gold-unit-focus-name">🔱 ${activeName} 🔱</span> замер!`,
            `Каждое движение этого загадочного существа дышит вековой мудростью! Старейшина руин <span class="gold-unit-focus-name">🔱 ${activeName} 🔱</span> начинает ход!`,
            `Невинная жертва обстоятельств или скрытый хитрый кукловод? Подозрительный путник <span class="gold-unit-focus-name">🚩 ${activeName} 🚩</span> делает маневр!`,
            `Знак древней геральдической лилии сияет на старых помятых доспехах! Рыцарь-бродяга <span class="gold-unit-focus-name">⚜️ ${activeName} ⚜️</span> наготове!`,
            `Судьба замерла в точке хрупкого и пугающего равновесия! Осторожный наблюдатель <span class="gold-unit-focus-name">❄️ ${activeName} ❄️</span> начинает ход!`,
            `«Он за нас или пришел украсть наши кошельки с заработанным золотом?» — паникует бард при виде <span class="gold-unit-focus-name">💰 ${activeName} 💰</span>!`,
            `«Я просто мимо проходил, у меня лавка в соседнем селе, не бейте!» — вопит испуганный торговец <span class="gold-unit-focus-name">💰 ${activeName} 💰</span>!`,
            `Местный стражник спросонья вообще пытается сообразить, в кого надо стрелять! Медлительный <span class="gold-unit-focus-name">🛡️ ${activeName} 🛡️</span> тупит!`,
            `Дикий лесной кабанчик случайно выбежал на арену и полностью сломал нам тактику! Ошалевший <span class="gold-unit-focus-name">🐗 ${activeName} 🐗</span> бежит!`,
            `Пока все вокруг бьются не на жизнь, а на смерть, этот парень просто заснул! Меланхоличный <span class="gold-unit-focus-name">💤 ${activeName} 💤</span> спит!`,
            `«Если мы его не тронем, это чучело нас тоже не укусит?» — с надеждой шепчет лекарь про бродячего <span class="gold-unit-focus-name">🐺 ${activeName} 🐺</span>!`,
            `Случайное событие из таблицы встреч сработало в самый неподходящий момент! На поле боя топчется <span class="gold-unit-focus-name">🎲 ${activeName} 🎲</span>!`,
            `«Эй, не бейте меня, я важный квестовый NPC, я сюжетно бессмертный!» — истошно орет испуганный <span class="gold-unit-focus-name">⚜️ ${activeName} ⚜️</span>!`,
            `Этот участник потасовки вообще забыл, зачем пришел, и просто наслаждается хаосом! Рассеянный <span class="gold-unit-focus-name">💥 ${activeName} 💥</span> тратит ход!`,
            `Лекарь партии пытается наложить на него дипломатию, пока воин заносит топор! Непонятливый <span class="gold-unit-focus-name">🔮 ${activeName} 🔮</span> моргает!`,
            `Бросок d20 на дружелюбие этого существа показал средний результат, ждем подвоха! Нерешительный <span class="gold-unit-focus-name">🎲 ${activeName} 🎲</span> думает!`,
            `«Я не участвую в драке, я тут мебель оцениваю на случай погрома!» — заявляет <span class="gold-unit-focus-name">🪑 ${activeName} 🪑</span>!`,
            `Мастер забыл придумать этому NPC мотивацию, поэтому в ступоре стоит <span class="gold-unit-focus-name">❓ ${activeName} ❓</span>!`,
            `«Погодите, а кто из вас нанимал меня в таверне?!» — растерянно оглядывается <span class="gold-unit-focus-name">🍺 ${activeName} 🍺</span>!`,
            `Мировоззрение «Истинно нейтральный» во всей красе! За битвой с попкорном наблюдает <span class="gold-unit-focus-name">🍿 ${activeName} 🍿</span>!`,
            `«Если вы разнесете мою телегу с капустой, я стану финальным боссом!» — грозит <span class="gold-unit-focus-name">🥬 ${activeName} 🥬</span>!`,
            `Плут уже прикидывает, сколько золотых в карманах, пока мирно прогуливается <span class="gold-unit-focus-name">🪙 ${activeName} 🪙</span>!`,
            `«Не обращайте на меня внимания, я просто случайный прохожий без статблока!» — кричит <span class="gold-unit-focus-name">🏃 ${activeName} 🏃</span>!`,
            `Стоит задеть его огненным шаром — и он тут же сменит фракцию на враждебную! Осторожничает <span class="gold-unit-focus-name">🔥 ${activeName} 🔥</span>!`,
            `«У меня лапки, я вообще не умею кидать спас-броски!» — жалобно пищит <span class="gold-unit-focus-name">🐾 ${activeName} 🐾</span>!`,
            `Пока герои и злодеи ломают копья, свои дела спокойно решает хитрый <span class="gold-unit-focus-name">🦊 ${activeName} 🦊</span>!`,
            `«А вы точно приключенцы, а не налоговая инспекция?» — подозрительно щурится <span class="gold-unit-focus-name">📜 ${activeName} 📜</span>!`,
            `Третья сторона конфликта — это всегда головная боль для тактиков! На сцену выходит <span class="gold-unit-focus-name">🎭 ${activeName} 🎭</span>!`,
            `«Я нейтрален, но за десять золотых могу кинуть камень вон в того гоблина!» — торгуется <span class="gold-unit-focus-name">💰 ${activeName} 💰</span>!`,
            `Никто не знает, зачем он в трекере инициативы, даже сам <span class="gold-unit-focus-name">🤷 ${activeName} 🤷</span>!`,
            `«Моя хата с краю, я в ваши разборки с культистами не лезу!» — отступает в тень <span class="gold-unit-focus-name">🕯️ ${activeName} 🕯️</span>!`,
            `Дикий выброс магии случайно призвал его прямо в центр заварушки! Недоумевает <span class="gold-unit-focus-name">✨ ${activeName} ✨</span>!`,
            `«Если я притворюсь статуей, меня ведь не заденут по площади?» — надеется <span class="gold-unit-focus-name">🗿 ${activeName} 🗿</span>!`,
            `Бард уже пытается его соблазнить, но гордо держит дистанцию неприступный <span class="gold-unit-focus-name">🌹 ${activeName} 🌹</span>!`,
            `«Я пришел сюда жевать жвачку и не участвовать в бою, и жвачка у меня еще есть!» — говорит <span class="gold-unit-focus-name">🌿 ${activeName} 🌿</span>!`,
            `Свидетель будущих подвигов (или позора) партии! Записывает происходящее в блокнот <span class="gold-unit-focus-name">🖋️ ${activeName} 🖋️</span>!`
            `«Я не подписывался на драку с драконом, мне платили за охрану сарая!» — возмущается <span class="gold-unit-focus-name">🏚️ ${activeName} 🏚️</span>!`,
            `Бросает монетку, чтобы решить, кому сегодня помочь, наш непредсказуемый <span class="gold-unit-focus-name">🪙 ${activeName} 🪙</span>!`,
            `«Эй, вы мне всю клумбу потоптали своими огненными шарами!» — ворчит <span class="gold-unit-focus-name">🌻 ${activeName} 🌻</span>!`,
            `Мастер сам еще не решил, союзник это или тайный босс, но уже ходит <span class="gold-unit-focus-name">🎭 ${activeName} 🎭</span>!`,
            `«Кто победит — тому и продам зелья лечения втридорога!» — потирает руки <span class="gold-unit-focus-name">🧪 ${activeName} 🧪</span>!`,
            `Стоит в самом центре перекрестного огня и делает вид, что его тут нет, хитрый <span class="gold-unit-focus-name">🙈 ${activeName} 🙈</span>!`,
            `«А можно я просто уйду домой, пока вы тут кидаете кубы?» — вежливо интересуется <span class="gold-unit-focus-name">🚪 ${activeName} 🚪</span>!`,
            `Уровень угрозы: «Случайный свидетель». Нервно сглатывает слюну <span class="gold-unit-focus-name">👀 ${activeName} 👀</span>!`,
            `«Если кто-нибудь заденет мою любимую шляпу — пощады не ждите!» — предупреждает <span class="gold-unit-focus-name">🎩 ${activeName} 🎩</span>!`,
            `Ждет, когда обе стороны ослабят друг друга, чтобы собрать весь лут, коварный <span class="gold-unit-focus-name">🎒 ${activeName} 🎒</span>!`,
            `«Я вообще-то мирный алхимик, но эта колба в руке очень взрывоопасна!» — дрожит <span class="gold-unit-focus-name">⚗️ ${activeName} ⚗️</span>!`,
            `Проверка Проницательности не помогает понять, что на уме у загадочного <span class="gold-unit-focus-name">🧠 ${activeName} 🧠</span>!`,
            `«Господа, а у вас есть разрешение на проведение боевых действий в этом лесу?» — спрашивает <span class="gold-unit-focus-name">📋 ${activeName} 📋</span>!`,
            `Пытается незаметно свистнуть бесхозный кинжал, пока все заняты дракой, ловкий <span class="gold-unit-focus-name">🗡️ ${activeName} 🗡️</span>!`,
            `«Я за тех, кто не будет кидать в меня заклинания по площади!» — выдвигает условия <span class="gold-unit-focus-name">✨ ${activeName} ✨</span>!`,
            `Даже боги не знают его мировоззрения, но свой ход уверенно делает <span class="gold-unit-focus-name">⚖️ ${activeName} ⚖️</span>!`,
            `«Погодите, я только достану блокнот, чтобы зарисовать этот эпический провал!» — радуется <span class="gold-unit-focus-name">🎨 ${activeName} 🎨</span>!`,
            `Случайно оказался не в том подземелье и не в то время! Озирается по сторонам <span class="gold-unit-focus-name">🧭 ${activeName} 🧭</span>!`,
            `«Не смотрите на меня так, я просто местный призрак и болею за красивый бой!» — парит <span class="gold-unit-focus-name">👻 ${activeName} 👻</span>!`,
            `Хранит гробовое молчание и загадочно щурится, наводя жути на обе стороны, таинственный <span class="gold-unit-focus-name">🦉 ${activeName} 🦉</span>!`

        ];
    }

};
