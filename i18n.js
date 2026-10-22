/* WatchRec – çoklu dil (i18n): en, tr, ru, zh, ko, es */
const LANGS = [['en', 'English'], ['tr', 'Türkçe'], ['ru', 'Русский'], ['zh', '中文'], ['ko', '한국어'], ['es', 'Español']];
const I18N = {};
I18N.en = {
  freeze: '❄ Monsters frozen!',
  nav_games: 'Games', nav_daily: 'Daily', nav_invite: 'Invite', nav_board: 'Ranking',
  m3_title: '💎 Match-3 Duel',
  m3_desc: 'Drag gems to match 3 or more of the same shape. You have 60 seconds and 15 moves — get the highest score!',
  m3_meta: "Best: <b id='bestM3'>0</b> pts · Reward: up to 8 WRGP",
  vf_title: '📐 Volfied (Area Capture)',
  vf_desc: '10 space levels, each with creatures and a boss. Draw lines to claim territory; any creature trapped in a small area dies. Claim 70% of the map in 60 seconds!',
  vf_meta: "Best: <b id='bestVF'>0</b> pts · Reward: 5 WRGP per level (8 if all creatures are cleared), +50 for finishing all 10",
  play: 'PLAY · 1 ❤️',
  ad_life: '📺 Watch Ad (+1 Life)',
  life_full: 'Lives full ✅', life_next: 'Next life: {m} min {s} sec',
  daily_title: '🎁 Daily Reward Streak', daily_desc: 'Log in every day to keep your streak. If you skip a day, it resets to day 1.',
  claim: 'Claim (+{n} WRGP)', come_back: 'Come back tomorrow ⏳', day: 'D{n}',
  daily_modal: '🎁 Daily Reward', streak_msg: 'Day {n} streak!', great: 'Awesome',
  inv_title: '👥 Invite & Earn', inv_desc: "You earn <b class='goldtxt'>+200 WRGP</b> for every friend you invite.",
  copy: '📋 Copy', share: '📤 Share', inv_count: "Friends invited: <b id='invCount'>0</b>",
  inv_list_title: "Friends you invited", inv_empty: "No friends have joined through your link yet.", ref_modal: "👥 Invite reward", ref_joined: "{n} new friend(s) joined with your link!",
  copied: 'Link copied ✅', share_text: 'Play WatchRec games and earn WRGP! 🎮',
  board_title: '🏆 Leaderboard', you: '(you)', you_name: 'You',
  board_note: 'Live ranking: top 100 players by WRGP.', board_loading: 'Loading ranking…', board_error: 'Could not load the ranking. Check your connection and try again.', board_empty: 'No players yet. Be the first!',
  ad_none: 'No ad available right now, please try again later', ad_fail: 'Ad not completed, no reward given',
  got_life: 'Ad watched! +1 Life added.',
  again: 'Play Again (1 ❤️)', to_menu: 'Back to Menu', no_lives: 'Out of lives! Watch an ad or wait.',
  quit_title: 'Quit?', quit_msg: 'If you quit now, the spent life and your progress are lost.', keep: 'Keep Playing', quit: 'Quit',
  lang_title: '🌐 Language',
  score_u: 'SCORE', moves_u: 'MOVES', time_u: 'TIME', score: 'Score', shuffling: 'Shuffling!', time_up_big: "TIME'S UP!",
  combo: 'x{n} COMBO!', go: 'GO!', time_up: "⏱ Time's Up!", moves_out: 'Out of Moves!',
  m3_l1: 'Your score: <b>{s}</b>', m3_l2: 'Moves used: {u}/{m}', m3_l3: 'Reward: {r} WRGP (every {p} points = 1 WRGP, max {x})',
  m3_hint: 'Tap a gem and drag it to a neighbor • match 3+ of the same gem • 15 moves and 60 seconds',
  boss_killed: 'BOSS DESTROYED!', killed: 'DESTROYED', level_of: 'LEVEL {a} / {b}', boss_lbl: '👹 Boss: {n}',
  goal: 'Claim 70% of the area in 60 seconds', level_done: 'LEVEL COMPLETE!', time_bonus: 'Time bonus +{b} · +1 ❤️', next: 'Next: {n}',
  vf_win: '🏆 All Levels Complete!', lives_out: 'Out of Lives!',
  vf_l1: 'Levels completed: <b>{c}/{n}</b>', vf_l2: 'Final area: <b>{p}%</b>', vf_l3: 'Score: <b>{s}</b>',
  vf_l4: 'Reward: {r} WRGP (5–8 per level{f})', vf_final: ' + 50 final bonus',
  lvl_reward: 'Level reward +{r} WRGP', lvl_perfect: 'ALL CREATURES CLEARED · 100% · +{r} WRGP', lb_step: 'Ad 1/2 watched — one more ad for +1 Life',
  vf_hint: 'Swipe (or arrow keys) • draw a line from the edge into open space • creatures trapped in a small area die • time limit varies by level'
};
I18N.tr = {
  freeze: '❄ Canavarlar dondu!',
  nav_games: 'Oyunlar', nav_daily: 'Günlük', nav_invite: 'Davet', nav_board: 'Sıralama',
  m3_title: '💎 Match-3 Düello',
  m3_desc: 'Taşları sürükle, 3 veya daha fazla aynı şekli eşleştir. 60 saniye ve 15 hamlen var, en yüksek skoru yap!',
  m3_meta: "Rekor: <b id='bestM3'>0</b> puan · Ödül: en fazla 8 WRGP",
  vf_title: '📐 Volfied (Çizmeci)',
  vf_desc: "10 uzay bölümü, her bölümde yaratıklar ve bir canavar. Çizgi çekip alanı kapat; küçük alanda sıkışan yaratık ölür. 60 saniyede haritanın %70'ini kapat!",
  vf_meta: "Rekor: <b id='bestVF'>0</b> puan · Ödül: bölüm başı 5 WRGP (tüm yaratıklar temizlenirse 8), 10 bölüm bitince +50",
  play: 'OYNA · 1 ❤️',
  ad_life: '📺 Reklam İzle (+1 Can)',
  life_full: 'Canların dolu ✅', life_next: 'Sonraki can: {m} dk {s} sn',
  daily_title: '🎁 Günlük Ödül Serisi', daily_desc: 'Her gün gir, serini bozma. Bir gün atlarsan seri 1. güne döner.',
  claim: 'Ödülü Al (+{n} WRGP)', come_back: 'Yarın tekrar gel ⏳', day: 'G{n}',
  daily_modal: '🎁 Günlük Ödül', streak_msg: '{n}. gün serisi!', great: 'Harika',
  inv_title: '👥 Davet Et ve Kazan', inv_desc: "Davet ettiğin her arkadaş için <b class='goldtxt'>+200 WRGP</b>.",
  copy: '📋 Kopyala', share: '📤 Paylaş', inv_count: "Davet ettiklerin: <b id='invCount'>0</b>",
  inv_list_title: "Davet ettiğin arkadaşlar", inv_empty: "Henüz linkinle katılan arkadaş yok.", ref_modal: "👥 Davet ödülü", ref_joined: "Linkinle {n} yeni arkadaş katıldı!",
  copied: 'Link kopyalandı ✅', share_text: 'WatchRec oyunlarını oyna, WRGP kazan! 🎮',
  board_title: '🏆 Liderlik Sıralaması', you: '(sen)', you_name: 'Sen',
  board_note: 'Canlı sıralama: WRGP\'ye göre ilk 100 oyuncu.', board_loading: 'Sıralama yükleniyor…', board_error: 'Sıralama yüklenemedi. Bağlantını kontrol edip tekrar dene.', board_empty: 'Henüz oyuncu yok. İlk sen ol!',
  ad_none: 'Şu an reklam gösterilemiyor, lütfen sonra tekrar dene', ad_fail: 'Reklam tamamlanmadı, ödül verilmedi',
  got_life: 'Reklamı başarıyla izlediniz! +1 Can eklendi.',
  again: 'Tekrar Oyna (1 ❤️)', to_menu: 'Menüye Dön', no_lives: 'Canın bitti! Reklam izle veya bekle.',
  quit_title: 'Çıkılsın mı?', quit_msg: 'Şimdi çıkarsan harcanan can ve ilerleme kaybolur.', keep: 'Devam Et', quit: 'Çık',
  lang_title: '🌐 Dil',
  score_u: 'SKOR', moves_u: 'HAMLE', time_u: 'SÜRE', score: 'Skor', shuffling: 'Karıştırılıyor!', time_up_big: 'SÜRE DOLDU!',
  combo: 'x{n} KOMBO!', go: 'BAŞLA!', time_up: '⏱ Süre Doldu!', moves_out: 'Hamlelerin Bitti!',
  m3_l1: 'Skorun: <b>{s}</b>', m3_l2: 'Kullanılan hamle: {u}/{m}', m3_l3: 'Ödül: {r} WRGP (her {p} puan = 1 WRGP, en fazla {x})',
  m3_hint: 'Taşa dokun, komşusuna sürükle • 3+ aynı taşı eşleştir • 15 hamle ve 60 saniyen var',
  boss_killed: 'CANAVAR YOK EDİLDİ!', killed: 'YOK EDİLDİ', level_of: 'BÖLÜM {a} / {b}', boss_lbl: '👹 Canavar: {n}',
  goal: '60 saniyede %70 alanı kapat', level_done: 'BÖLÜM TAMAM!', time_bonus: 'Süre bonusu +{b} · +1 ❤️', next: 'Sıradaki: {n}',
  vf_win: '🏆 Tüm Bölümler Tamam!', lives_out: 'Canların Bitti!',
  vf_l1: 'Tamamlanan bölüm: <b>{c}/{n}</b>', vf_l2: 'Son alan: <b>%{p}</b>', vf_l3: 'Skor: <b>{s}</b>',
  vf_l4: 'Ödül: {r} WRGP (bölüm başı 5–8{f})', vf_final: ' + 50 final bonusu',
  lvl_reward: 'Bölüm ödülü +{r} WRGP', lvl_perfect: 'TÜM YARATIKLAR TEMİZLENDİ · %100 · +{r} WRGP', lb_step: '1/2 reklam izlendi — +1 Can için bir reklam daha',
  vf_hint: 'Parmağını kaydır (veya ok tuşları) • Kenardan boşluğa çizgi çek • Küçük alanda sıkışan yaratık ölür • Süre bölüme göre değişir'
};
I18N.ru = {
  freeze: '❄ Монстры заморожены!',
  nav_games: 'Игры', nav_daily: 'Награды', nav_invite: 'Друзья', nav_board: 'Рейтинг',
  m3_title: '💎 Три в ряд: Дуэль',
  m3_desc: 'Перетаскивай камни и собирай 3 и более одинаковых. У тебя 60 секунд и 15 ходов — набери максимум очков!',
  m3_meta: "Рекорд: <b id='bestM3'>0</b> очк. · Награда: до 8 WRGP",
  vf_title: '📐 Volfied (Захват территории)',
  vf_desc: '10 космических уровней, в каждом — существа и босс. Проводи линии и захватывай территорию; существо, запертое в небольшой области, погибает. Захвати 70% карты за 60 секунд!',
  vf_meta: "Рекорд: <b id='bestVF'>0</b> очк. · Награда: 5 WRGP за уровень (8, если все существа уничтожены), +50 за все 10",
  play: 'ИГРАТЬ · 1 ❤️',
  ad_life: '📺 Смотреть рекламу (+1 жизнь)',
  life_full: 'Жизни полны ✅', life_next: 'Следующая жизнь: {m} мин {s} сек',
  daily_title: '🎁 Ежедневная награда', daily_desc: 'Заходи каждый день, чтобы не прерывать серию. Пропустишь день — серия начнётся с 1-го дня.',
  claim: 'Получить (+{n} WRGP)', come_back: 'Приходи завтра ⏳', day: 'Д{n}',
  daily_modal: '🎁 Ежедневная награда', streak_msg: 'Серия: {n} дн.!', great: 'Отлично',
  inv_title: '👥 Приглашай и зарабатывай', inv_desc: "За каждого приглашённого друга ты получаешь <b class='goldtxt'>+200 WRGP</b>.",
  copy: '📋 Копировать', share: '📤 Поделиться', inv_count: "Приглашено друзей: <b id='invCount'>0</b>",
  inv_list_title: "Приглашённые друзья", inv_empty: "По твоей ссылке пока никто не присоединился.", ref_modal: "👥 Награда за приглашение", ref_joined: "По твоей ссылке присоединились новые друзья: {n}!",
  copied: 'Ссылка скопирована ✅', share_text: 'Играй в игры WatchRec и зарабатывай WRGP! 🎮',
  board_title: '🏆 Таблица лидеров', you: '(ты)', you_name: 'Ты',
  board_note: 'Живой рейтинг: топ-100 игроков по WRGP.', board_loading: 'Загрузка рейтинга…', board_error: 'Не удалось загрузить рейтинг. Проверьте соединение и повторите попытку.', board_empty: 'Игроков пока нет. Будьте первым!',
  ad_none: 'Сейчас нет доступной рекламы, попробуйте позже', ad_fail: 'Реклама не досмотрена, награда не выдана',
  got_life: 'Реклама просмотрена! +1 жизнь добавлена.',
  again: 'Играть снова (1 ❤️)', to_menu: 'В меню', no_lives: 'Жизни закончились! Посмотри рекламу или подожди.',
  quit_title: 'Выйти?', quit_msg: 'Если выйти сейчас, потраченная жизнь и прогресс пропадут.', keep: 'Продолжить', quit: 'Выйти',
  lang_title: '🌐 Язык',
  score_u: 'ОЧКИ', moves_u: 'ХОДЫ', time_u: 'ВРЕМЯ', score: 'Очки', shuffling: 'Перемешивание!', time_up_big: 'ВРЕМЯ ВЫШЛО!',
  combo: 'x{n} КОМБО!', go: 'СТАРТ!', time_up: '⏱ Время вышло!', moves_out: 'Ходы закончились!',
  m3_l1: 'Твой счёт: <b>{s}</b>', m3_l2: 'Использовано ходов: {u}/{m}', m3_l3: 'Награда: {r} WRGP (каждые {p} очков = 1 WRGP, максимум {x})',
  m3_hint: 'Коснись камня и перетащи к соседнему • собирай 3+ одинаковых • 15 ходов и 60 секунд',
  boss_killed: 'БОСС УНИЧТОЖЕН!', killed: 'УНИЧТОЖЕНО', level_of: 'УРОВЕНЬ {a} / {b}', boss_lbl: '👹 Босс: {n}',
  goal: 'Захвати 70% территории за 60 секунд', level_done: 'УРОВЕНЬ ПРОЙДЕН!', time_bonus: 'Бонус за время +{b} · +1 ❤️', next: 'Далее: {n}',
  vf_win: '🏆 Все уровни пройдены!', lives_out: 'Жизни закончились!',
  vf_l1: 'Пройдено уровней: <b>{c}/{n}</b>', vf_l2: 'Итоговая площадь: <b>{p}%</b>', vf_l3: 'Очки: <b>{s}</b>',
  vf_l4: 'Награда: {r} WRGP (5–8 за уровень{f})', vf_final: ' + 50 финальный бонус',
  lvl_reward: 'Награда за уровень +{r} WRGP', lvl_perfect: 'ВСЕ СУЩЕСТВА УНИЧТОЖЕНЫ · 100% · +{r} WRGP', lb_step: 'Просмотрено 1/2 — ещё одна реклама за +1 жизнь',
  vf_hint: 'Свайп (или стрелки) • проведи линию от края в свободное место • существа в небольшой области погибают • время зависит от уровня'
};
I18N.zh = {
  freeze: '❄ 怪物被冻结！',
  nav_games: '游戏', nav_daily: '每日', nav_invite: '邀请', nav_board: '排行',
  m3_title: '💎 三消对决',
  m3_desc: '拖动宝石，连成3个或更多相同图形。你有60秒和15步，争取最高分！',
  m3_meta: "最高分：<b id='bestM3'>0</b> · 奖励：最多 8 WRGP",
  vf_title: '📐 Volfied（圈地）',
  vf_desc: '10个太空关卡，每关都有怪物和一只首领。画线圈地；被困在小区域内的怪物会死亡。在60秒内圈占地图的70%！',
  vf_meta: "最高分：<b id='bestVF'>0</b> · 奖励：每关 5 WRGP（消灭所有怪物为 8），通关全部10关再 +50",
  play: '开始 · 1 ❤️',
  ad_life: '📺 观看广告（+1 生命）',
  life_full: '生命已满 ✅', life_next: '下一条生命：{m}分{s}秒',
  daily_title: '🎁 每日奖励连续签到', daily_desc: '每天登录以保持连续签到。漏掉一天，将从第1天重新开始。',
  claim: '领取（+{n} WRGP）', come_back: '明天再来 ⏳', day: '第{n}天',
  daily_modal: '🎁 每日奖励', streak_msg: '连续签到第 {n} 天！', great: '太棒了',
  inv_title: '👥 邀请赚奖励', inv_desc: "每邀请一位好友，可获得 <b class='goldtxt'>+200 WRGP</b>。",
  copy: '📋 复制', share: '📤 分享', inv_count: "已邀请好友：<b id='invCount'>0</b>",
  inv_list_title: "你邀请的好友", inv_empty: "还没有好友通过你的链接加入。", ref_modal: "👥 邀请奖励", ref_joined: "有 {n} 位新好友通过你的链接加入！",
  copied: '链接已复制 ✅', share_text: '来玩 WatchRec 游戏，赚取 WRGP！🎮',
  board_title: '🏆 排行榜', you: '（你）', you_name: '你',
  board_note: '实时排行榜：按 WRGP 排名前 100 的玩家。', board_loading: '正在加载排行榜…', board_error: '无法加载排行榜。请检查网络后重试。', board_empty: '还没有玩家，快来抢第一！',
  ad_none: '暂无可用广告，请稍后再试', ad_fail: '广告未看完，未发放奖励',
  got_life: '广告观看成功！已增加 +1 生命。',
  again: '再玩一次（1 ❤️）', to_menu: '返回菜单', no_lives: '生命用完了！请观看广告或等待。',
  quit_title: '要退出吗？', quit_msg: '现在退出，已消耗的生命和进度将会丢失。', keep: '继续游戏', quit: '退出',
  lang_title: '🌐 语言',
  score_u: '得分', moves_u: '步数', time_u: '时间', score: '得分', shuffling: '重新洗牌！', time_up_big: '时间到！',
  combo: 'x{n} 连击！', go: '开始！', time_up: '⏱ 时间到！', moves_out: '步数用完！',
  m3_l1: '你的得分：<b>{s}</b>', m3_l2: '已用步数：{u}/{m}', m3_l3: '奖励：{r} WRGP（每 {p} 分 = 1 WRGP，最多 {x}）',
  m3_hint: '点按宝石并拖向相邻位置 • 连成3个以上相同宝石 • 15步，60秒',
  boss_killed: '首领被消灭！', killed: '已消灭', level_of: '第 {a} / {b} 关', boss_lbl: '👹 首领：{n}',
  goal: '60秒内圈占70%的区域', level_done: '过关！', time_bonus: '时间奖励 +{b} · +1 ❤️', next: '下一关：{n}',
  vf_win: '🏆 全部通关！', lives_out: '生命用完了！',
  vf_l1: '已通关：<b>{c}/{n}</b>', vf_l2: '最终面积：<b>{p}%</b>', vf_l3: '得分：<b>{s}</b>',
  vf_l4: '奖励：{r} WRGP（每关 5–8{f}）', vf_final: ' + 50 通关奖励',
  lvl_reward: '关卡奖励 +{r} WRGP', lvl_perfect: '怪物全部消灭 · 100% · +{r} WRGP', lb_step: '已观看 1/2 — 再看一条广告可得 +1 生命',
  vf_hint: '滑动屏幕（或方向键） • 从边缘向空地画线 • 被困在小区域的怪物会死亡 • 每关时间不同'
};
I18N.ko = {
  freeze: '❄ 몬스터 정지!',
  nav_games: '게임', nav_daily: '일일', nav_invite: '초대', nav_board: '순위',
  m3_title: '💎 매치-3 듀얼',
  m3_desc: '보석을 드래그해 같은 모양 3개 이상을 맞추세요. 60초와 15번의 이동으로 최고 점수에 도전하세요!',
  m3_meta: "최고 기록: <b id='bestM3'>0</b>점 · 보상: 최대 8 WRGP",
  vf_title: '📐 Volfied (땅따먹기)',
  vf_desc: '10개의 우주 스테이지, 각 스테이지마다 크리처와 보스가 있습니다. 선을 그어 영역을 차지하세요. 좁은 영역에 갇힌 크리처는 죽습니다. 60초 안에 맵의 70%를 차지하세요!',
  vf_meta: "최고 기록: <b id='bestVF'>0</b>점 · 보상: 스테이지당 5 WRGP (모든 크리처 처치 시 8), 10개 모두 클리어 시 +50",
  play: '플레이 · 1 ❤️',
  ad_life: '📺 광고 보기 (+1 생명)',
  life_full: '생명이 가득 찼습니다 ✅', life_next: '다음 생명: {m}분 {s}초',
  daily_title: '🎁 일일 보상 연속 출석', daily_desc: '매일 접속해 연속 출석을 유지하세요. 하루를 건너뛰면 1일차부터 다시 시작합니다.',
  claim: '받기 (+{n} WRGP)', come_back: '내일 다시 오세요 ⏳', day: '{n}일',
  daily_modal: '🎁 일일 보상', streak_msg: '{n}일 연속 출석!', great: '좋아요',
  inv_title: '👥 초대하고 보상 받기', inv_desc: "친구를 초대할 때마다 <b class='goldtxt'>+200 WRGP</b>를 받습니다.",
  copy: '📋 복사', share: '📤 공유', inv_count: "초대한 친구: <b id='invCount'>0</b>",
  inv_list_title: "초대한 친구 목록", inv_empty: "아직 내 링크로 가입한 친구가 없습니다.", ref_modal: "👥 초대 보상", ref_joined: "내 링크로 새 친구 {n}명이 가입했습니다!",
  copied: '링크가 복사되었습니다 ✅', share_text: 'WatchRec 게임을 플레이하고 WRGP를 받으세요! 🎮',
  board_title: '🏆 리더보드', you: '(나)', you_name: '나',
  board_note: '실시간 순위: WRGP 상위 100명.', board_loading: '순위를 불러오는 중…', board_error: '순위를 불러올 수 없습니다. 연결을 확인하고 다시 시도하세요.', board_empty: '아직 플레이어가 없습니다. 첫 번째가 되어 보세요!',
  ad_none: '지금은 광고를 표시할 수 없습니다. 나중에 다시 시도하세요', ad_fail: '광고를 끝까지 보지 않아 보상이 지급되지 않았습니다',
  got_life: '광고 시청 완료! +1 생명이 추가되었습니다.',
  again: '다시 플레이 (1 ❤️)', to_menu: '메뉴로 돌아가기', no_lives: '생명이 없습니다! 광고를 보거나 기다리세요.',
  quit_title: '나가시겠어요?', quit_msg: '지금 나가면 사용한 생명과 진행 상황이 사라집니다.', keep: '계속하기', quit: '나가기',
  lang_title: '🌐 언어',
  score_u: '점수', moves_u: '이동', time_u: '시간', score: '점수', shuffling: '섞는 중!', time_up_big: '시간 종료!',
  combo: 'x{n} 콤보!', go: '시작!', time_up: '⏱ 시간 종료!', moves_out: '이동 횟수 소진!',
  m3_l1: '내 점수: <b>{s}</b>', m3_l2: '사용한 이동: {u}/{m}', m3_l3: '보상: {r} WRGP ({p}점마다 1 WRGP, 최대 {x})',
  m3_hint: '보석을 누르고 옆 칸으로 드래그 • 같은 보석 3개 이상 맞추기 • 15번 이동, 60초',
  boss_killed: '보스 처치!', killed: '처치', level_of: '스테이지 {a} / {b}', boss_lbl: '👹 보스: {n}',
  goal: '60초 안에 영역의 70% 차지하기', level_done: '스테이지 클리어!', time_bonus: '시간 보너스 +{b} · +1 ❤️', next: '다음: {n}',
  vf_win: '🏆 모든 스테이지 클리어!', lives_out: '생명이 모두 소진되었습니다!',
  vf_l1: '클리어한 스테이지: <b>{c}/{n}</b>', vf_l2: '최종 면적: <b>{p}%</b>', vf_l3: '점수: <b>{s}</b>',
  vf_l4: '보상: {r} WRGP (스테이지당 5–8{f})', vf_final: ' + 50 최종 보너스',
  lvl_reward: '스테이지 보상 +{r} WRGP', lvl_perfect: '모든 크리처 처치 · 100% · +{r} WRGP', lb_step: '광고 1/2 시청 — 하나 더 보면 +1 생명',
  vf_hint: '스와이프 (또는 방향키) • 가장자리에서 빈 공간으로 선 긋기 • 좁은 영역에 갇힌 크리처는 죽음 • 스테이지마다 시간 다름'
};
I18N.es = {
  freeze: '❄ ¡Monstruos congelados!',
  nav_games: 'Juegos', nav_daily: 'Diario', nav_invite: 'Invitar', nav_board: 'Ranking',
  m3_title: '💎 Match-3 Duelo',
  m3_desc: 'Arrastra las gemas para unir 3 o más iguales. Tienes 60 segundos y 15 movimientos: ¡consigue la máxima puntuación!',
  m3_meta: "Récord: <b id='bestM3'>0</b> pts · Premio: hasta 8 WRGP",
  vf_title: '📐 Volfied (Captura de área)',
  vf_desc: '10 niveles espaciales, cada uno con criaturas y un jefe. Traza líneas para conquistar territorio; la criatura atrapada en un área pequeña muere. ¡Conquista el 70 % del mapa en 60 segundos!',
  vf_meta: "Récord: <b id='bestVF'>0</b> pts · Premio: 5 WRGP por nivel (8 si eliminas todas las criaturas), +50 al completar los 10",
  play: 'JUGAR · 1 ❤️',
  ad_life: '📺 Ver anuncio (+1 vida)',
  life_full: 'Vidas completas ✅', life_next: 'Próxima vida: {m} min {s} s',
  daily_title: '🎁 Racha de recompensa diaria', daily_desc: 'Entra cada día para mantener tu racha. Si te saltas un día, vuelve al día 1.',
  claim: 'Reclamar (+{n} WRGP)', come_back: 'Vuelve mañana ⏳', day: 'D{n}',
  daily_modal: '🎁 Recompensa diaria', streak_msg: '¡Racha de {n} días!', great: 'Genial',
  inv_title: '👥 Invita y gana', inv_desc: "Ganas <b class='goldtxt'>+200 WRGP</b> por cada amigo que invites.",
  copy: '📋 Copiar', share: '📤 Compartir', inv_count: "Amigos invitados: <b id='invCount'>0</b>",
  inv_list_title: "Amigos que invitaste", inv_empty: "Aún no se ha unido nadie con tu enlace.", ref_modal: "👥 Recompensa por invitar", ref_joined: "¡{n} amigo(s) nuevo(s) se unieron con tu enlace!",
  copied: 'Enlace copiado ✅', share_text: '¡Juega a los juegos de WatchRec y gana WRGP! 🎮',
  board_title: '🏆 Clasificación', you: '(tú)', you_name: 'Tú',
  board_note: 'Clasificación en vivo: los 100 mejores jugadores por WRGP.', board_loading: 'Cargando clasificación…', board_error: 'No se pudo cargar la clasificación. Revisa tu conexión e inténtalo de nuevo.', board_empty: 'Aún no hay jugadores. ¡Sé el primero!',
  ad_none: 'No hay anuncios disponibles ahora, inténtalo más tarde', ad_fail: 'Anuncio no completado, no se dio recompensa',
  got_life: '¡Anuncio visto! +1 vida añadida.',
  again: 'Jugar de nuevo (1 ❤️)', to_menu: 'Volver al menú', no_lives: '¡Sin vidas! Mira un anuncio o espera.',
  quit_title: '¿Salir?', quit_msg: 'Si sales ahora, perderás la vida gastada y tu progreso.', keep: 'Seguir jugando', quit: 'Salir',
  lang_title: '🌐 Idioma',
  score_u: 'PUNTOS', moves_u: 'MOVS.', time_u: 'TIEMPO', score: 'Puntos', shuffling: '¡Mezclando!', time_up_big: '¡TIEMPO!',
  combo: '¡COMBO x{n}!', go: '¡YA!', time_up: '⏱ ¡Se acabó el tiempo!', moves_out: '¡Sin movimientos!',
  m3_l1: 'Tu puntuación: <b>{s}</b>', m3_l2: 'Movimientos usados: {u}/{m}', m3_l3: 'Premio: {r} WRGP (cada {p} puntos = 1 WRGP, máximo {x})',
  m3_hint: 'Toca una gema y arrástrala a una vecina • une 3 o más iguales • 15 movimientos y 60 segundos',
  boss_killed: '¡JEFE DESTRUIDO!', killed: 'DESTRUIDO', level_of: 'NIVEL {a} / {b}', boss_lbl: '👹 Jefe: {n}',
  goal: 'Conquista el 70 % del área en 60 segundos', level_done: '¡NIVEL COMPLETADO!', time_bonus: 'Bonus de tiempo +{b} · +1 ❤️', next: 'Siguiente: {n}',
  vf_win: '🏆 ¡Todos los niveles completados!', lives_out: '¡Sin vidas!',
  vf_l1: 'Niveles completados: <b>{c}/{n}</b>', vf_l2: 'Área final: <b>{p}%</b>', vf_l3: 'Puntos: <b>{s}</b>',
  vf_l4: 'Premio: {r} WRGP (5–8 por nivel{f})', vf_final: ' + 50 de bonus final',
  lvl_reward: 'Premio del nivel +{r} WRGP', lvl_perfect: 'TODAS LAS CRIATURAS ELIMINADAS · 100 % · +{r} WRGP', lb_step: 'Anuncio 1/2 visto: otro más para +1 vida',
  vf_hint: 'Desliza (o usa las flechas) • traza una línea desde el borde hacia el espacio libre • las criaturas atrapadas en un área pequeña mueren • el tiempo varía según el nivel'
};
const LVN_DATA = {
  en: [['Earth Orbit', 'Orbit Guardian'], ['Lunar Surface', 'Craterus'], ['Martian Deserts', 'Red Sand Worm'], ['Asteroid Belt', 'Rockbreaker'], ['Jupiter Storm', 'Storm Giant Jovar'],
       ["Saturn's Rings", 'Ring Sovereign'], ['Milky Way Shore', 'Galaxy Devourer'], ['Orion Nebula', 'Nebula Wraith'], ['Zeta-9 Alien Planet', 'Zeta Mothership'], ['Black Hole', 'Event Horizon Beast']],
  tr: [['Dünya Yörüngesi', 'Yörünge Bekçisi'], ['Ay Yüzeyi', 'Kraterus'], ['Mars Çölleri', 'Kızıl Kum Solucanı'], ['Asteroit Kuşağı', 'Taşparçalayan'], ['Jüpiter Fırtınası', 'Fırtına Devi Jovar'],
       ['Satürn Halkaları', 'Halka Hükümdarı'], ['Samanyolu Kıyısı', 'Galaksi Yutan'], ['Orion Nebulası', 'Nebula Hortlağı'], ['Zeta-9 Yabancı Gezegen', 'Zeta Ana Gemisi'], ['Kara Delik', 'Olay Ufku Canavarı']],
  ru: [['Орбита Земли', 'Страж орбиты'], ['Поверхность Луны', 'Кратерус'], ['Пустыни Марса', 'Красный песчаный червь'], ['Пояс астероидов', 'Камнедробитель'], ['Буря на Юпитере', 'Гигант бурь Йовар'],
       ['Кольца Сатурна', 'Повелитель колец'], ['Берег Млечного Пути', 'Пожиратель галактик'], ['Туманность Ориона', 'Призрак туманности'], ['Чужая планета Зета-9', 'Корабль-матка Зета'], ['Чёрная дыра', 'Чудовище горизонта событий']],
  zh: [['地球轨道', '轨道守卫'], ['月球表面', '陨坑巨兽'], ['火星沙漠', '红沙巨虫'], ['小行星带', '碎石者'], ['木星风暴', '风暴巨人约瓦'],
       ['土星光环', '光环主宰'], ['银河之滨', '吞星者'], ['猎户座星云', '星云幽灵'], ['泽塔-9外星球', '泽塔母舰'], ['黑洞', '视界巨兽']],
  ko: [['지구 궤도', '궤도 수호자'], ['달 표면', '크레이터스'], ['화성 사막', '붉은 모래 벌레'], ['소행성대', '암석 파괴자'], ['목성 폭풍', '폭풍의 거인 조바르'],
       ['토성 고리', '고리의 군주'], ['은하수 해안', '은하 포식자'], ['오리온 성운', '성운 유령'], ['제타-9 외계 행성', '제타 모함'], ['블랙홀', '사건의 지평선 괴물']],
  es: [['Órbita terrestre', 'Guardián orbital'], ['Superficie lunar', 'Crateros'], ['Desiertos de Marte', 'Gusano de arena rojo'], ['Cinturón de asteroides', 'Rompepiedras'], ['Tormenta de Júpiter', 'Jovar, gigante de la tormenta'],
       ['Anillos de Saturno', 'Soberano de los anillos'], ['Costa de la Vía Láctea', 'Devorador de galaxias'], ['Nebulosa de Orión', 'Espectro de la nebulosa'], ['Planeta alienígena Zeta-9', 'Nave nodriza Zeta'], ['Agujero negro', 'Bestia del horizonte de sucesos']]
};

/* ---------- 20 bölüm: yeni metinler ve 11-20. bölüm adları ---------- */
Object.assign(I18N.en, {"goal_inf": "Claim 70% of the area — no time limit", "vf_desc": "20 space levels, each with creatures and a boss. Draw lines to claim territory; any creature trapped in a small area dies. Claim 70% of the map in 60 seconds! From level 11 the galaxy gets far harder.", "vf_meta": "Best: <b id='bestVF'>0</b> pts · Reward: 5 WRGP per level (8 if all creatures are cleared), +100 for the first 10 levels, 25 per level from 11 to 20, +500 for the finale", "vf_win": "🏆 You conquered the galaxy!", "vf_l4": "Reward: {r} WRGP", "vf_l5": "First period bonus: +{b} WRGP", "vf_l6": "Finale bonus: +{b} WRGP", "final_lvl": "FINAL LEVEL", "first_done": "🎉 Congratulations! You finished the first period", "first_sub": "+{b} points reward earned", "first_next": "New worlds await — level 11 starts now!", "cont_title": "Out of lives!", "cont_msg1": "Watch 1 ad to restart this level with {n} ❤️.", "cont_msg2": "Watch 2 ads to restart this level with {n} ❤️.", "cont_btn": "Continue ({s})", "cont_btn0": "Continue", "cont_fin": "Finish", "cont_ad": "Ad {a}/{n}", "cont_fail": "Ad not completed. You can try again or finish.", "cont_loading": "Loading ad…"});
Object.assign(I18N.tr, {"goal_inf": "%70 alanı kapat — süre sınırı yok", "vf_desc": "20 uzay bölümü, her bölümde yaratıklar ve bir canavar. Çizgi çekip alanı kapat; küçük alanda sıkışan yaratık ölür. 60 saniyede haritanın %70'ini kapat! 11. bölümden sonra galaksi çok daha zorlaşır.", "vf_meta": "Rekor: <b id='bestVF'>0</b> puan · Ödül: bölüm başı 5 WRGP (tüm yaratıklar temizlenirse 8), ilk 10 bölümde +100, 11-20. bölümlerde bölüm başı 25, final +500", "vf_win": "🏆 Galaksiyi Fethettin!", "vf_l4": "Ödül: {r} WRGP", "vf_l5": "İlk periyot bonusu: +{b} WRGP", "vf_l6": "Final bonusu: +{b} WRGP", "final_lvl": "SON BÖLÜM", "first_done": "🎉 Tebrikler! İlk periyodu bitirdiniz", "first_sub": "+{b} puan ödül kazandınız", "first_next": "Yeni dünyalar sizi bekliyor — 11. bölüm başlıyor!", "cont_title": "Canların bitti!", "cont_msg1": "1 reklam izle, bu bölüme baştan {n} ❤️ ile başla.", "cont_msg2": "2 reklam izle, bu bölüme baştan {n} ❤️ ile başla.", "cont_btn": "Devam Et ({s})", "cont_btn0": "Devam Et", "cont_fin": "Bitir", "cont_ad": "Reklam {a}/{n}", "cont_fail": "Reklam tamamlanmadı. Tekrar deneyebilir veya bitirebilirsin.", "cont_loading": "Reklam yükleniyor…"});
Object.assign(I18N.ru, {"goal_inf": "Захвати 70% территории — без ограничения времени", "vf_desc": "20 космических уровней, в каждом — существа и босс. Проводи линии и захватывай территорию; существо, запертое в небольшой области, погибает. Захвати 70% карты за 60 секунд! С 11-го уровня галактика становится намного сложнее.", "vf_meta": "Рекорд: <b id='bestVF'>0</b> очк. · Награда: 5 WRGP за уровень (8, если все существа уничтожены), +100 за первые 10 уровней, 25 за уровень с 11-го по 20-й, +500 за финал", "vf_win": "🏆 Галактика покорена!", "vf_l4": "Награда: {r} WRGP", "vf_l5": "Бонус первого периода: +{b} WRGP", "vf_l6": "Финальный бонус: +{b} WRGP", "final_lvl": "ФИНАЛЬНЫЙ УРОВЕНЬ", "first_done": "🎉 Поздравляем! Вы прошли первый период", "first_sub": "Вы получили +{b} очков награды", "first_next": "Новые миры ждут вас — начинается уровень 11!", "cont_title": "Жизни закончились!", "cont_msg1": "Посмотри 1 рекламу, чтобы начать этот уровень заново с {n} ❤️.", "cont_msg2": "Посмотри 2 рекламы, чтобы начать этот уровень заново с {n} ❤️.", "cont_btn": "Продолжить ({s})", "cont_btn0": "Продолжить", "cont_fin": "Завершить", "cont_ad": "Реклама {a}/{n}", "cont_fail": "Реклама не досмотрена. Можно повторить или завершить.", "cont_loading": "Загрузка рекламы…"});
Object.assign(I18N.zh, {"goal_inf": "圈占70%的区域——无时间限制", "vf_desc": "20个太空关卡，每关都有怪物和一只首领。画线圈地；被困在小区域内的怪物会死亡。在60秒内圈占地图的70%！从第11关起难度大幅提升。", "vf_meta": "最高分：<b id='bestVF'>0</b> · 奖励：每关 5 WRGP（消灭所有怪物为 8），前10关 +100，第11至20关每关 25，通关再 +500", "vf_win": "🏆 你征服了银河！", "vf_l4": "奖励：{r} WRGP", "vf_l5": "第一阶段奖励：+{b} WRGP", "vf_l6": "终章奖励：+{b} WRGP", "final_lvl": "最终关卡", "first_done": "🎉 恭喜！你完成了第一阶段", "first_sub": "获得 +{b} 积分奖励", "first_next": "新的世界在等你——第11关开始！", "cont_title": "生命用完了！", "cont_msg1": "观看1条广告，即可带着 {n} ❤️ 从本关重新开始。", "cont_msg2": "观看2条广告，即可带着 {n} ❤️ 从本关重新开始。", "cont_btn": "继续（{s}）", "cont_btn0": "继续", "cont_fin": "结束", "cont_ad": "广告 {a}/{n}", "cont_fail": "广告未看完。可以重试或结束。", "cont_loading": "广告加载中…"});
Object.assign(I18N.ko, {"goal_inf": "영역의 70% 차지하기 — 시간 제한 없음", "vf_desc": "20개의 우주 스테이지, 각 스테이지마다 크리처와 보스가 있습니다. 선을 그어 영역을 차지하세요. 좁은 영역에 갇힌 크리처는 죽습니다. 60초 안에 맵의 70%를 차지하세요! 11스테이지부터 훨씬 어려워집니다.", "vf_meta": "최고 기록: <b id='bestVF'>0</b>점 · 보상: 스테이지당 5 WRGP (모든 크리처 처치 시 8), 처음 10개 클리어 시 +100, 11~20스테이지 스테이지당 25, 최종 클리어 +500", "vf_win": "🏆 은하를 정복했습니다!", "vf_l4": "보상: {r} WRGP", "vf_l5": "첫 번째 구간 보너스: +{b} WRGP", "vf_l6": "최종 보너스: +{b} WRGP", "final_lvl": "마지막 스테이지", "first_done": "🎉 축하합니다! 첫 번째 구간을 마쳤습니다", "first_sub": "+{b} 포인트 보상을 받았습니다", "first_next": "새로운 세계가 기다립니다 — 11스테이지 시작!", "cont_title": "생명이 모두 소진되었습니다!", "cont_msg1": "광고 1개를 시청하면 이 스테이지를 {n} ❤️로 처음부터 다시 시작합니다.", "cont_msg2": "광고 2개를 시청하면 이 스테이지를 {n} ❤️로 처음부터 다시 시작합니다.", "cont_btn": "계속하기 ({s})", "cont_btn0": "계속하기", "cont_fin": "끝내기", "cont_ad": "광고 {a}/{n}", "cont_fail": "광고를 끝까지 보지 않았습니다. 다시 시도하거나 끝낼 수 있습니다.", "cont_loading": "광고 로딩 중…"});
Object.assign(I18N.es, {"goal_inf": "Conquista el 70 % del área — sin límite de tiempo", "vf_desc": "20 niveles espaciales, cada uno con criaturas y un jefe. Traza líneas para conquistar territorio; la criatura atrapada en un área pequeña muere. ¡Conquista el 70 % del mapa en 60 segundos! Desde el nivel 11 la galaxia se vuelve mucho más difícil.", "vf_meta": "Récord: <b id='bestVF'>0</b> pts · Premio: 5 WRGP por nivel (8 si eliminas todas las criaturas), +100 por los primeros 10, 25 por nivel del 11 al 20, +500 por el final", "vf_win": "🏆 ¡Conquistaste la galaxia!", "vf_l4": "Premio: {r} WRGP", "vf_l5": "Bonus del primer periodo: +{b} WRGP", "vf_l6": "Bonus final: +{b} WRGP", "final_lvl": "NIVEL FINAL", "first_done": "🎉 ¡Felicidades! Terminaste el primer periodo", "first_sub": "Ganaste +{b} puntos de premio", "first_next": "Nuevos mundos te esperan: ¡empieza el nivel 11!", "cont_title": "¡Sin vidas!", "cont_msg1": "Mira 1 anuncio para reiniciar este nivel con {n} ❤️.", "cont_msg2": "Mira 2 anuncios para reiniciar este nivel con {n} ❤️.", "cont_btn": "Continuar ({s})", "cont_btn0": "Continuar", "cont_fin": "Terminar", "cont_ad": "Anuncio {a}/{n}", "cont_fail": "Anuncio no completado. Puedes reintentar o terminar.", "cont_loading": "Cargando anuncio…"});
const LVN_EXT = {"en": [["Uranus Ice Storm", "Ice Titan"], ["Neptune Depths", "Trident Leviathan"], ["Pluto Frontier", "Frozen Sentinel"], ["Kuiper Belt", "Comet Hydra"], ["Solar Flare", "Solar Phoenix"], ["Pulsar Storm", "Pulsar Warden"], ["Crystal Nebula", "Prism Phantom"], ["Dyson Ruins", "Machine Lord"], ["Quasar Gate", "Gate Devourer"], ["Heart of the Universe", "Twin Voids"]], "tr": [["Uranüs Buz Fırtınası", "Buz Titanı"], ["Neptün Derinlikleri", "Üç Dişli Leviathan"], ["Plüton Sınırı", "Donmuş Nöbetçi"], ["Kuiper Kuşağı", "Kuyruklu Yıldız Hidrası"], ["Güneş Patlaması", "Güneş Anka Kuşu"], ["Pulsar Fırtınası", "Pulsar Gardiyanı"], ["Kristal Nebula", "Prizma Hayaleti"], ["Dyson Kalıntıları", "Makine Efendisi"], ["Kuasar Geçidi", "Geçit Yutan"], ["Evrenin Kalbi", "İkiz Boşluklar"]], "ru": [["Ледяная буря Урана", "Ледяной титан"], ["Глубины Нептуна", "Левиафан с трезубцем"], ["Рубеж Плутона", "Замёрзший страж"], ["Пояс Койпера", "Гидра комет"], ["Солнечная вспышка", "Солнечный феникс"], ["Буря пульсара", "Страж пульсара"], ["Кристальная туманность", "Призрак призмы"], ["Руины Дайсона", "Повелитель машин"], ["Врата квазара", "Пожиратель врат"], ["Сердце Вселенной", "Близнецы пустоты"]], "zh": [["天王星冰暴", "冰霜泰坦"], ["海王星深渊", "三叉戟利维坦"], ["冥王星边境", "冰封哨兵"], ["柯伊伯带", "彗星九头蛇"], ["太阳耀斑", "太阳凤凰"], ["脉冲星风暴", "脉冲星守卫"], ["水晶星云", "棱镜幻影"], ["戴森遗迹", "机械领主"], ["类星体之门", "吞门者"], ["宇宙之心", "双生虚空"]], "ko": [["천왕성 얼음 폭풍", "얼음 타이탄"], ["해왕성 심해", "삼지창 리바이어던"], ["명왕성 경계", "얼어붙은 파수꾼"], ["카이퍼 벨트", "혜성 히드라"], ["태양 플레어", "태양 불사조"], ["펄서 폭풍", "펄서 감시자"], ["크리스털 성운", "프리즘 유령"], ["다이슨 폐허", "기계 군주"], ["퀘이사 관문", "관문 포식자"], ["우주의 심장", "쌍둥이 공허"]], "es": [["Tormenta de hielo de Urano", "Titán de hielo"], ["Profundidades de Neptuno", "Leviatán del tridente"], ["Frontera de Plutón", "Centinela helado"], ["Cinturón de Kuiper", "Hidra cometa"], ["Llamarada solar", "Fénix solar"], ["Tormenta de púlsar", "Guardián del púlsar"], ["Nebulosa de cristal", "Fantasma del prisma"], ["Ruinas de Dyson", "Señor de las máquinas"], ["Puerta del cuásar", "Devorador de puertas"], ["Corazón del universo", "Vacíos gemelos"]]};
for (const k in LVN_EXT) LVN_DATA[k] = LVN_DATA[k].concat(LVN_EXT[k]);

/* ---------- Dil seçimi ---------- */
const LANG_KEY = 'wrgp_lang';
function detectLang() {
  let saved = null;
  try { saved = localStorage.getItem(LANG_KEY); } catch (_) {}
  if (saved && I18N[saved]) return saved;
  const u = window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe && Telegram.WebApp.initDataUnsafe.user;
  const cand = String((u && u.language_code) || navigator.language || 'en').toLowerCase().slice(0, 2);
  return I18N[cand] ? cand : 'en';
}
let LANG = detectLang();

/* tl('anahtar', {n: 5}) → çeviri; eksikse İngilizceye, o da yoksa anahtara düşer */
function tl(key, vars) {
  let s = I18N[LANG] && I18N[LANG][key];
  if (s == null) s = I18N.en[key];
  if (s == null) return key;
  if (vars) for (const k in vars) s = s.split('{' + k + '}').join(vars[k]);
  return s;
}
function LVN(i) { return (LVN_DATA[LANG] || LVN_DATA.en)[i] || LVN_DATA.en[i]; }

function applyI18n() {
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = tl(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = tl(el.dataset.i18nHtml); });
}
function setLang(l) {
  if (!I18N[l]) return;
  LANG = l;
  try { localStorage.setItem(LANG_KEY, l); } catch (_) {}
  applyI18n();
}

Object.assign(I18N.en, {"vf_stop": "tap = stop in place"});
Object.assign(I18N.tr, {"vf_stop": "Dokunmak = cisim olduğu yerde durur"});
Object.assign(I18N.ru, {"vf_stop": "касание = остановка на месте"});
Object.assign(I18N.zh, {"vf_stop": "点按 = 原地停住"});
Object.assign(I18N.ko, {"vf_stop": "탭 = 제자리에 정지"});
Object.assign(I18N.es, {"vf_stop": "toca = detenerse en el sitio"});
