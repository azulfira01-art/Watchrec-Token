/* WatchRec Game Center – uygulama mantığı */
const BOT = 'WatchRecGameBot';
const MONETAG_FN = 'show_12011278';                    // Monetag Zone ID: 12011278
const TADS_WIDGET_ID = 12600;                          // TADS Widget ID
const LITEBITS_API_KEY = 'lba_242cbbfc8cf72476a6fa66af209f1f63';
const LITEBITS_PLACEMENT_ID = 'a8a5c64c-8aa2-4b26-ba39-8c18b72f79be';   // LiteBits Placement ID
const MAX_LIVES = 5, LIFE_REGEN_MS = 30 * 60 * 1000;   // 30 dk'da 1 can
const REF_WRGP = 200;                                 // davet edilen her yeni oyuncu için ödül
const APP_SHORT = 'app';                              // BotFather'daki Mini App kısa adı (t.me/WatchRecGameBot/app)
const DAILY = [10, 15, 20, 30, 40, 60, 100];
const DAY = 86400000;
const MAX_WRGP = 999999999;                           // en fazla bakiye
// 1234567 -> 1.234.567 (3 basamakta bir nokta)
const fmt = n => String(Math.max(0, Math.floor(Number(n) || 0))).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const clampW = n => Math.min(MAX_WRGP, Math.max(0, Math.floor(Number(n) || 0)));


/* ---------- Supabase (gerçek sıralama) ---------- */
const SB_URL = 'https://mwyywojglxrpnqqscumi.supabase.co';
const SB_KEY = 'sb_publishable_L25Sbpm9k65CZFT_a9PdOQ_mcED2ENY';   // publishable key: istemcide durması normaldir
const SB_TABLE = 'players';
const SB_HEAD = { apikey: SB_KEY, 'Content-Type': 'application/json' };

const tg = window.Telegram && Telegram.WebApp;
if (tg) { try { tg.ready(); tg.expand(); tg.setHeaderColor('#080c16'); tg.setBackgroundColor('#04060d'); } catch (_) {} }
function haptic(t) {
  try {
    if (!tg || !tg.HapticFeedback) return;
    if (t === 'error') tg.HapticFeedback.notificationOccurred('error');
    else tg.HapticFeedback.impactOccurred(t || 'light');
  } catch (_) {}
}
const $ = s => document.querySelector(s);
const tgUser = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) || null;
const USER_ID = tgUser ? tgUser.id : 'demo';
const TG_NAME = tgUser ? (tgUser.first_name || tgUser.username || '') : '';
const REF_NAME = String(tgUser ? (tgUser.username ? '@' + tgUser.username : (tgUser.first_name || 'Player')) : 'Player').slice(0, 32);
const getName = () => TG_NAME || tl('you_name');
const KEY = 'wrgp_state_' + USER_ID;

/* ---------- Durum (localStorage) ---------- */
const def = { upd: 0, wrgp: 100, lives: MAX_LIVES, lastRegen: Date.now(), streak: 0, lastClaim: 0, best: { m3: 0, vf: 0 }, invited: 0, refDone: false, refPaid: [] };
let S;
const freshDevice = !localStorage.getItem(KEY);   // bu cihazda daha önce kayıt yok
try { S = Object.assign({}, def, JSON.parse(localStorage.getItem(KEY) || '{}')); S.best = Object.assign({}, def.best, S.best); } catch (_) { S = Object.assign({}, def); }
S.wrgp = clampW(S.wrgp);
S.refPaid = Array.isArray(S.refPaid) ? S.refPaid.slice() : [];
if (!freshDevice && !S.upd) { S.upd = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (_) {} }   // eski kayıt: ilk kez zaman damgası al
const save = () => { S.upd = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (_) {} scheduleSync(); };


/* ---------- Bulut kaydı (Supabase): tüm cihazlarda aynı ilerleme ----------
   Tüm durum (bakiye, can, seri, rekor...) players.state sütununa kaydedilir.
   Uygulama açılınca önce buluttaki kayıt okunur; daha yeni olan (S.upd) kullanılır. */
let lastSynced = -1, syncTimer = null, syncing = false;
let remoteReady = USER_ID === 'demo', loadTries = 0, loading = false, hasStateCol = true, lastPull = 0;
function scheduleSync() { if (USER_ID === 'demo') return; clearTimeout(syncTimer); syncTimer = setTimeout(() => syncScore(), 4000); }
function saveLocalOnly() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (_) {} }
function mergeRemote(row) {
  // Kural: bakiye yalnızca artabildiği için iki cihazın EN YÜKSEK değeri alınır; hiçbir cihaz diğerini küçültemez.
  const rs = row.state && typeof row.state === 'object' ? row.state : null;
  const L = S;
  if (!rs) {                                                        // eski kayıt: yalnızca bakiye var
    const rw = clampW(row.wrgp);
    if (rw > L.wrgp) { L.wrgp = rw; saveLocalOnly(); }
    lastSynced = -1;                                                // yerel değer yüksekse buluta da yaz
    return;
  }
  const R = Object.assign({}, def, rs);
  R.best = Object.assign({}, def.best, rs.best);
  const remoteNewer = (Number(rs.upd) || 0) > (Number(L.upd) || 0);
  const base = remoteNewer ? R : L;                                 // can/zamanlayıcı: daha yeni kayıttan
  const M = Object.assign({}, def, base);
  M.best = { m3: Math.max(L.best.m3 || 0, R.best.m3 || 0), vf: Math.max(L.best.vf || 0, R.best.vf || 0) };
  M.wrgp = clampW(Math.max(L.wrgp, R.wrgp, Number(row.wrgp) || 0));
  const lc = Number(L.lastClaim) || 0, rc = Number(R.lastClaim) || 0;   // günlük seri: en son alınan ödüle bak
  const seriesSrc = rc > lc ? R : (lc > rc ? L : (R.streak > L.streak ? R : L));
  M.lastClaim = seriesSrc.lastClaim; M.streak = seriesSrc.streak;
  M.invited = Math.max(L.invited || 0, R.invited || 0);
  M.refDone = !!(L.refDone || R.refDone);
  M.refPaid = Array.from(new Set([].concat(L.refPaid || [], R.refPaid || []).map(Number)));   // ödülü verilen davetler: birleşim
  if (!M.referrer) M.referrer = L.referrer || R.referrer;
  const ll = L.lb || {}, rl = R.lb || {};                           // LiteBits günlük sayaç: aynı günse yüksek olan, değilse yeni gün
  const lbPick = ll.d === rl.d ? ((ll.n || 0) >= (rl.n || 0) ? ll : rl) : ((ll.d || '') > (rl.d || '') ? ll : rl);
  if (lbPick && lbPick.d) M.lb = lbPick;
  M.lives = Math.min(MAX_LIVES, Math.max(0, Math.floor(Number(M.lives) || 0)));
  M.upd = Math.max(Number(L.upd) || 0, Number(rs.upd) || 0, 1);
  S = M; saveLocalOnly();
  lastSynced = -1;                                                  // birleşmiş durumu bir kez buluta yaz
}
async function loadRemote() {
  if (USER_ID === 'demo' || loading) return;
  loading = true;
  try {
    let r = await fetch(`${SB_URL}/rest/v1/${SB_TABLE}?select=wrgp,state&tg_id=eq.${Number(USER_ID)}`, { headers: SB_HEAD });
    if (r.status === 400 && hasStateCol) {                         // state sütunu henüz eklenmemiş
      hasStateCol = false;
      r = await fetch(`${SB_URL}/rest/v1/${SB_TABLE}?select=wrgp&tg_id=eq.${Number(USER_ID)}`, { headers: SB_HEAD });
    }
    if (!r.ok) throw new Error('http ' + r.status);
    const rows = await r.json();
    if (rows[0]) mergeRemote(rows[0]);
    else if (REF_FROM && !S.refDone) await registerReferral();   // yepyeni oyuncu + davet linki: davet kaydı
    remoteReady = true; lastPull = Date.now();
    render(); scheduleSync();
    refreshInvites();
  } catch (_) {
    if (!remoteReady) {
      if (++loadTries < 8) setTimeout(loadRemote, 3000 * loadTries);
      else if (!freshDevice) remoteReady = true;      // bağlantı yok: bu cihazda kayıt varsa yine de göndermeyi dene
    }
  }
  loading = false;
}
async function syncScore(keep) {
  if (USER_ID === 'demo' || syncing || !remoteReady || S.upd === lastSynced) return;
  syncing = true;
  const snap = S.upd;
  const body = { tg_id: Number(USER_ID), name: String(TG_NAME || 'Player').slice(0, 24), wrgp: S.wrgp, updated_at: new Date().toISOString() };
  if (hasStateCol) body.state = JSON.parse(JSON.stringify(S));
  try {
    const r = await fetch(`${SB_URL}/rest/v1/${SB_TABLE}?on_conflict=tg_id`, {
      method: 'POST', keepalive: !!keep,
      headers: Object.assign({ Prefer: 'resolution=merge-duplicates,return=minimal' }, SB_HEAD),
      body: JSON.stringify(body)
    });
    if (r.ok) lastSynced = snap;
    else if (r.status === 400 && hasStateCol) { hasStateCol = false; scheduleSync(); }   // state sütunu yok → yalnızca bakiye
  } catch (_) {}
  syncing = false;
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden) syncScore(true);
  else if (!cur && Date.now() - lastPull > 20000) loadRemote();   // uygulamaya dönünce buluttaki en yeni kaydı al
});

function regen() {
  if (S.lives >= MAX_LIVES) { S.lastRegen = Date.now(); return; }
  const n = Math.floor((Date.now() - S.lastRegen) / LIFE_REGEN_MS);
  if (n > 0) { S.lives = Math.min(MAX_LIVES, S.lives + n); S.lastRegen = S.lives >= MAX_LIVES ? Date.now() : S.lastRegen + n * LIFE_REGEN_MS; save(); }
}
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2200); }
function render() {
  regen();
  $('#bal').textContent = fmt(S.wrgp);
  $('#lives').textContent = S.lives;
  $('#bestM3').textContent = S.best.m3;
  $('#bestVF').textContent = S.best.vf;
  $('#invCount').textContent = S.invited;
  const out = S.lives <= 0;
  document.querySelectorAll('[data-play]').forEach(b => b.disabled = out);
  const full = S.lives >= MAX_LIVES;
  $('#adBtn').disabled = full;
  const left = LIFE_REGEN_MS - (Date.now() - S.lastRegen);
  $('#lifeTimer').textContent = S.lives >= MAX_LIVES ? tl('life_full') : tl('life_next', { m: Math.max(0, Math.floor(left / 60000)), s: Math.max(0, Math.floor(left / 1000) % 60) });
  renderDaily();
}
setInterval(render, 1000);
setInterval(() => { if (!cur && !document.hidden && remoteReady && Date.now() - lastPull > 60000) loadRemote(); }, 30000);   // açık kalan cihazlar da buluttaki en yeni kaydı alsın

/* ---------- Sekmeler ---------- */
document.querySelectorAll('.nav button').forEach(b => b.onclick = () => {
  document.querySelectorAll('.nav button').forEach(x => x.classList.toggle('active', x === b));
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.id === 'tab-' + b.dataset.tab));
  if (b.dataset.tab === 'board') renderBoard();
  if (b.dataset.tab === 'invite') refreshInvites();
  haptic('light');
});

/* ---------- Günlük ödül ---------- */
const dayNo = ts => Math.floor((ts - new Date(ts).getTimezoneOffset() * 60000) / DAY);
function dailyState() {
  const today = dayNo(Date.now());
  if (!S.lastClaim) return { next: 0, can: true };
  const diff = today - dayNo(S.lastClaim);
  if (diff === 0) return { next: S.streak % 7, can: false };
  if (diff === 1) return { next: S.streak % 7, can: true };
  return { next: 0, can: true };            // gün atlandı → seri sıfırlanır
}
function renderDaily() {
  const st = dailyState(), box = $('#streak');
  const doneCount = st.can ? st.next : (S.streak % 7 || 7);
  box.innerHTML = DAILY.map((v, i) => `<div class="day ${i < doneCount ? 'done' : (st.can && i === st.next ? 'now' : '')}">${tl('day', { n: i + 1 })}<b>+${v}</b></div>`).join('');
  const b = $('#claimBtn');
  b.disabled = !st.can;
  b.textContent = st.can ? tl('claim', { n: DAILY[st.next] }) : tl('come_back');
}
$('#claimBtn').onclick = () => {
  const st = dailyState(); if (!st.can) return;
  S.streak = st.next + 1; S.lastClaim = Date.now(); S.wrgp = clampW(S.wrgp + DAILY[st.next]); save();
  haptic('light'); render();
  modal(`<h2>${tl('daily_modal')}</h2><div class="reward">+${DAILY[st.next]} WRGP</div><p>${tl('streak_msg', { n: S.streak })}</p><button class="btn primary" onclick="closeModal()">${tl('great')}</button>`);
};

/* ---------- Davet ----------
   Davet linki Mini App'in doğrudan linkidir (startapp). Yeni oyuncu bu linkle açınca davet kaydı
   sunucuda (Edge Function) yapılır; davet eden uygulamayı açınca her yeni kayıt için ödülü sunucudan alır. */
const refLink = `https://t.me/${BOT}/${APP_SHORT}?startapp=ref_${USER_ID}`;
$('#refLink').textContent = refLink;
$('#copyBtn').onclick = async () => {
  try { await navigator.clipboard.writeText(refLink); } catch (_) {
    const r = document.createRange(); r.selectNode($('#refLink')); getSelection().removeAllRanges(); getSelection().addRange(r); try { document.execCommand('copy'); } catch (_) {}
  }
  toast(tl('copied'));
};
$('#shareBtn').onclick = () => {
  const url = 'https://t.me/share/url?url=' + encodeURIComponent(refLink) + '&text=' + encodeURIComponent(tl('share_text'));
  if (tg && tg.openTelegramLink) tg.openTelegramLink(url); else window.open(url, '_blank');
};
function startParam() {
  let sp = tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param;
  if (!sp && tg && tg.initData) { try { sp = new URLSearchParams(tg.initData).get('start_param'); } catch (_) {} }
  if (!sp) { try { sp = new URLSearchParams(location.hash.slice(1)).get('tgWebAppStartParam'); } catch (_) {} }
  return sp || '';
}
const REF_FROM = (() => { const m = /^ref_(\d{1,15})$/.exec(startParam()); return m && m[1] !== String(USER_ID) ? Number(m[1]) : 0; })();
/* Davet doğrulaması SUNUCUDA yapılır (Supabase Edge Function "referral"):
   Telegram imzalı initData kontrol edilir, davet kaydı ve ödül yalnızca sunucudan gelir. */
const REF_FN = `${SB_URL}/functions/v1/referral`;
let refReward = REF_WRGP;
async function refApi(body) {
  const r = await fetch(REF_FN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: SB_KEY },
    body: JSON.stringify(Object.assign({ initData: (tg && tg.initData) || '' }, body))
  });
  if (r.status >= 500) throw new Error('ref http ' + r.status);     // geçici hata: sonra yeniden denenir
  let data = null; try { data = await r.json(); } catch (_) {}
  return { status: r.status, data };
}
async function registerReferral() {
  // Yalnızca hiç kaydı olmayan (yepyeni) oyuncular için çağrılır; son kararı sunucu verir.
  if (!tg || !tg.initData) return;
  const { data } = await refApi({ action: 'register', ref: REF_FROM });
  if (data && data.ok) { S.refDone = true; if (data.result === 'registered') S.referrer = String(REF_FROM); saveLocalOnly(); }
}
let invRows = [], invBusy = false;
function renderInvites() {
  const el = $('#invList'); if (!el) return;
  el.innerHTML = invRows.length
    ? invRows.map((p, i) => `<div class="lb"><span class="rk">${i + 1}</span><span class="nm">${esc(p.invitee_name || '—')}</span><span class="sc">+${fmt(refReward)}</span></div>`).join('')
    : '<p class="muted">' + tl('inv_empty') + '</p>';
}
async function refreshInvites() {
  if (USER_ID === 'demo' || !remoteReady || invBusy || !tg || !tg.initData) return;
  invBusy = true;
  try {
    // Sunucu: yeni (ödülü verilmemiş) davetleri atomik olarak işaretler, ödül miktarını ve listeyi döndürür.
    const { status, data } = await refApi({ action: 'claim', paid: S.refPaid.slice(-500) });
    if (!data || !data.ok) throw new Error('claim ' + status);
    invRows = Array.isArray(data.list) ? data.list : [];
    if (Number(data.reward) > 0) refReward = Number(data.reward);
    if (invRows.length > (S.invited || 0)) S.invited = invRows.length;
    const claimed = (data.claimed || []).map(Number);
    if (claimed.length) {
      claimed.forEach(id => { if (S.refPaid.indexOf(id) < 0) S.refPaid.push(id); });
      const gain = clampW(Number(data.gain) || 0);
      S.wrgp = clampW(S.wrgp + gain);
      save(); render(); haptic('medium');
      const msg = tl('ref_joined', { n: claimed.length });
      if (cur || !$('#modal').classList.contains('hidden')) toast('👥 +' + fmt(gain) + ' WRGP');
      else modal(`<h2>${tl('ref_modal')}</h2><div class="reward">+${fmt(gain)} WRGP</div><p>${msg}</p><button class="btn primary" onclick="closeModal()">${tl('great')}</button>`);
    } else { render(); }
    renderInvites();
  } catch (_) {}
  invBusy = false;
}

/* ---------- Liderlik (Supabase) ---------- */
/* Sıralamada isim gizleme: ilk 2 karakter görünür, kalanı * (en fazla 8 yıldız) */
function maskName(n) {
  const c = Array.from(String(n || '').trim());
  if (!c.length) return '—';
  if (c.length <= 2) return c.join('');
  return c.slice(0, 2).join('') + '*'.repeat(Math.min(c.length - 2, 8));
}
let boardSeq = 0;
async function renderBoard() {
  const el = $('#boardList'), seq = ++boardSeq;
  el.innerHTML = '<p class="muted">' + tl('board_loading') + '</p>';
  try {
    await syncScore();
    const r = await fetch(`${SB_URL}/rest/v1/${SB_TABLE}?select=tg_id,name,wrgp&order=wrgp.desc&limit=100`, { headers: SB_HEAD });
    if (!r.ok) throw new Error('http ' + r.status);
    const rows = await r.json();
    let myRank = 0;
    const inTop = rows.findIndex(p => String(p.tg_id) === String(USER_ID));
    if (USER_ID !== 'demo' && inTop < 0) {
      try {
        const c = await fetch(`${SB_URL}/rest/v1/${SB_TABLE}?select=tg_id&wrgp=gt.${S.wrgp}`, { headers: Object.assign({ Prefer: 'count=exact', Range: '0-0' }, SB_HEAD) });
        const m = /\/(\d+)$/.exec(c.headers.get('Content-Range') || '');
        if (m) myRank = Number(m[1]) + 1;
      } catch (_) {}
    }
    if (seq !== boardSeq) return;
    const medal = ['🥇', '🥈', '🥉'];
    const row = (rk, name, sc, me) => `<div class="lb ${me ? 'me' : ''}"><span class="rk">${rk}</span><span class="nm">${esc(maskName(name))}${me ? ' ' + tl('you') : ''}</span><span class="sc">${fmt(sc)}</span></div>`;
    let html = rows.length ? rows.map((p, i) => row(medal[i] || (i + 1), p.name || '—', p.wrgp, String(p.tg_id) === String(USER_ID))).join('') : '<p class="muted">' + tl('board_empty') + '</p>';
    if (myRank) html += '<div class="muted" style="text-align:center">…</div>' + row(myRank, getName(), S.wrgp, true);
    el.innerHTML = html + '<p class="muted" style="margin-top:10px">' + tl('board_note') + '</p>';
  } catch (_) {
    if (seq === boardSeq) el.innerHTML = '<p class="muted">' + tl('board_error') + '</p>';
  }
}
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- Modal ---------- */
function modal(html) { $('#modalBox').innerHTML = html; $('#modal').classList.remove('hidden'); }
function closeModal() { $('#modal').classList.add('hidden'); }
window.closeModal = closeModal;

/* ---------- Reklam (Monetag + TADS) ---------- */
let adBusy = false;
const AD_TIMEOUT_MS = 180000;   // callback hiç gelmezse buton sonsuza kadar kilitli kalmasın

/* A) Monetag ödüllü reklam – Zone 12011278 */
function showMonetag() {
  return new Promise((resolve, reject) => {
    const fn = window[MONETAG_FN];
    if (typeof fn !== 'function') return reject(new Error('monetag-sdk-missing'));
    const t = setTimeout(() => reject(new Error('monetag-timeout')), AD_TIMEOUT_MS);
    Promise.resolve(fn()).then(() => { clearTimeout(t); resolve(); }).catch(err => { clearTimeout(t); reject(err); });
  });
}
/* B) TADS ödüllü reklam – Fullscreen Banner, Widget 12600 (SDK: https://w.tads.me/widget.js)
   Denetleyici bir kez oluşturulur; geri çağrılar o anki reklam isteğine yönlendirilir. */
let tadsCtrl = null, tadsCb = null;
const tadsReady = () => !!(window.tads && typeof window.tads.init === 'function');
function tadsInit() {
  if (tadsCtrl) return tadsCtrl;
  tadsCtrl = window.tads.init({
    widgetId: TADS_WIDGET_ID,
    type: 'fullscreen',
    debug: false,
    onShowReward: () => { if (tadsCb) tadsCb.ok(); },                                   // ödül yalnızca bu olay gelirse verilir
    onAdsNotFound: () => { if (tadsCb) tadsCb.fail(new Error('tads-nofill')); }         // reklam yok → sıradaki ağ
  });
  return tadsCtrl;
}
function showTads() {
  return new Promise((resolve, reject) => {
    if (!tadsReady()) return reject(new Error('tads-sdk-missing'));
    let done = false;
    const finish = (fn, v) => { if (done) return; done = true; clearTimeout(t); tadsCb = null; fn(v); };
    const t = setTimeout(() => finish(reject, new Error('tads-timeout')), AD_TIMEOUT_MS);
    tadsCb = { ok: () => finish(resolve), fail: err => finish(reject, err) };
    try {
      const ctrl = tadsInit();
      if (!ctrl || typeof ctrl.showAd !== 'function') return finish(reject, new Error('tads-bad-controller'));
      Promise.resolve(ctrl.showAd()).catch(err => finish(reject, err));
    } catch (err) { finish(reject, err); }
  });
}
/* TADS kuralı: ARKA ARKAYA 2 reklam = +1 can (reklamlar 8 sn). S.tp = 1 ise ilk reklam izlendi, ikincisi bekleniyor. */
async function showTadsPair() {
  if (!S.tp) {
    await showTads();
    S.tp = 1; save();                                               // 1/2 tamam; ikincisi yarım kalırsa bir sonraki TADS reklamı tamamlar
    toast(tl('lb_step'));
    await new Promise(r => setTimeout(r, 1500));
  }
  await showTads();
  S.tp = 0; save();                                                 // 2/2 tamam → can verilir
}
/* C) LiteBits ödüllü reklam */
let liteAds = null, liteCb = null;
const liteReady = () => !!LITEBITS_PLACEMENT_ID && typeof window.LiteBitsAds === 'function';
/* LiteBits kuralı: ARKA ARKAYA 2 reklam = +1 can. Günde en fazla 20 gösterim (= 10 can). Sayaç UTC gününe göre sıfırlanır.
   S.lb = { d: gün, n: bugünkü gösterim, p: 1 ise ilk reklam izlendi, ikincisi bekleniyor } */
const LB_DAILY_ADS = 20;
const utcDay = () => new Date().toISOString().slice(0, 10);
function lbState() { if (!S.lb || S.lb.d !== utcDay()) S.lb = { d: utcDay(), n: 0, p: 0 }; return S.lb; }
const liteQuotaLeft = () => LB_DAILY_ADS - lbState().n;
function liteInit() {
  if (liteAds) return liteAds;
  liteAds = new window.LiteBitsAds({ apiKey: LITEBITS_API_KEY, placementId: LITEBITS_PLACEMENT_ID, baseUrl: 'https://ads.litebits.io' });
  liteAds.on('rewarded', r => { console.log('LiteBits verified', r); if (liteCb) liteCb.ok(); });   // ödül yalnızca bu olay gelirse verilir
  liteAds.on('nofill', () => { if (liteCb) liteCb.fail(new Error('litebits-nofill')); });          // kampanya yok → sıradaki ağ
  return liteAds;
}
function showLiteBits() {
  return new Promise((resolve, reject) => {
    if (!liteReady()) return reject(new Error('litebits-not-ready'));
    let done = false, grace = null;
    const t = setTimeout(() => finish(reject, new Error('litebits-timeout')), AD_TIMEOUT_MS);
    const finish = (fn, v) => { if (done) return; done = true; clearTimeout(t); clearTimeout(grace); liteCb = null; fn(v); };
    liteCb = { ok: () => finish(resolve), fail: err => finish(reject, err) };
    try {
      // show() bitince 'rewarded' olayı için kısa süre beklenir; gelmezse (reklam kapatıldı) ödül verilmez.
      Promise.resolve(liteInit().show())
        .then(() => { grace = setTimeout(() => finish(reject, new Error('litebits-no-reward')), 8000); })
        .catch(err => finish(reject, err));
    } catch (err) { finish(reject, err); }
  });
}
/* LiteBits: iki reklam art arda gösterilir; yalnızca ikisi de tamamlanırsa resolve olur (= +1 can). */
async function showLiteBitsPair() {
  if (liteQuotaLeft() <= 0) throw new Error('litebits-daily-limit');
  if (lbState().p === 0) {
    await showLiteBits();
    const lb = lbState(); lb.n++; lb.p = 1; save();                 // 1/2 tamam; ikincisi yarım kalırsa bir sonraki LiteBits reklamı tamamlar
    if (liteQuotaLeft() <= 0) throw new Error('litebits-daily-limit');
    toast(tl('lb_step'));
    await new Promise(r => setTimeout(r, 1500));
  }
  await showLiteBits();
  const lb2 = lbState(); lb2.n++; lb2.p = 0; save();               // 2/2 tamam → can verilir
}
/* Reklam ağları: her seferinde rastgele sırayla denenir; ilk başarılı olan ödül verir (tek sefer). */
const AD_NETWORKS = [
  { name: 'Monetag', ok: () => typeof window[MONETAG_FN] === 'function', show: showMonetag },
  { name: 'TADS', ok: tadsReady, show: showTadsPair },
  { name: 'LiteBits', ok: () => liteReady() && liteQuotaLeft() > 0, show: showLiteBitsPair }
];
function shuffle(arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
async function watchAd(onDone, onFail) {
  if (adBusy) { if (onFail) onFail(); return; }
  adBusy = true;
  let ok = false;
  const list = shuffle(AD_NETWORKS.filter(n => n.ok()));          // yalnızca hazır olan ağlar
  for (const n of list) {
    try { await n.show(); ok = true; break; }
    catch (err) { console.error(n.name + ' hata:', err); }          // olmadıysa sıradaki ağa geç
  }
  adBusy = false;
  if (ok) onDone(); else { toast(tl('ad_none')); if (onFail) onFail(); }
}
/* Buton: can 5'ten azsa aktif → +1 can */
$('#adBtn').onclick = () => {
  if (S.lives >= MAX_LIVES) return;
  watchAd(() => { S.lives = Math.min(MAX_LIVES, S.lives + 1); save(); render(); toast(tl('got_life')); });
};

/* ---------- Telegram dikey kaydırma kilidi (oyun sırasında aşağı kaydırarak kapanmayı engeller) ---------- */
function lockSwipes() { try { if (tg && tg.disableVerticalSwipes) tg.disableVerticalSwipes(); } catch (_) {} }
function unlockSwipes() { try { if (tg && tg.enableVerticalSwipes) tg.enableVerticalSwipes(); } catch (_) {} }

/* ---------- Oyun yöneticisi ---------- */
let cur = null;
const ui = {
  hud: h => { $('#gInfo').innerHTML = h; },
  hint: h => { $('#gHint').textContent = h; },
  /* Volfied: canlar bitince (5. bölümden itibaren) Devam Et / Bitir. need = izlenecek reklam sayısı (1 veya 2).
     Devam Et'e 15 sn içinde basılmazsa oyun biter. Basıldıktan sonra geri sayım durur. cb(true) = devam, cb(false) = bitir. */
  cont: (need, cb) => {
    let left = 15, seen = 0, busy = false, over = false, timer = null;
    const done = ok => { if (over) return; over = true; clearInterval(timer); closeModal(); cb(ok); };
    const paint = (msg) => {
      const b = $('#contGo'); if (!b) return;
      b.disabled = busy;
      b.textContent = busy ? tl('cont_loading') : (left !== null ? tl('cont_btn', { s: left }) : tl('cont_btn0'));
      $('#contAd').textContent = need > 1 ? tl('cont_ad', { a: Math.min(seen + 1, need), n: need }) : '';
      $('#contBar').style.width = (left !== null ? left / 15 * 100 : 100) + '%';
      $('#contNote').textContent = msg || '';
    };
    modal(`<h2>${tl('cont_title')}</h2><p>${tl(need > 1 ? 'cont_msg2' : 'cont_msg1')}</p>
      <div style="height:6px;border-radius:3px;background:rgba(255,255,255,.12);overflow:hidden;margin:10px 0"><div id="contBar" style="height:100%;width:100%;background:linear-gradient(90deg,#ff3b5c,#00d2ff);transition:width 1s linear"></div></div>
      <div id="contAd" class="muted"></div><div id="contNote" class="muted" style="color:#ff8a9a"></div>
      <button class="btn primary" id="contGo"></button><button class="btn" id="contFin">${tl('cont_fin')}</button>`);
    paint();
    $('#contFin').onclick = () => done(false);
    $('#contGo').onclick = async () => {
      if (busy || over) return;
      left = null; clearInterval(timer); busy = true; paint();   // basıldı: geri sayım durur
      let ok = true;
      while (seen < need) {
        ok = await new Promise(res => watchAd(() => res(true), () => res(false)));
        if (over || !cur) return;
        if (!ok) break;
        seen++;
        if (seen < need) toast(tl('cont_ad', { a: seen, n: need }));
      }
      busy = false;
      if (ok && seen >= need) { haptic('medium'); done(true); } else paint(tl('cont_fail'));   // reklam tamamlanmadı: devam hakkı verilmez, tekrar dene ya da bitir
    };
    timer = setInterval(() => {
      if (!cur) { over = true; clearInterval(timer); return; }
      if (busy || left === null) return;
      if (--left <= 0) { done(false); return; }                    // süre doldu → oyun biter, ödüller verilir
      paint();
    }, 1000);
  },
  end: r => {
    unlockSwipes();   // oyun bitti: normal kaydırma geri açılır
    if (r.reward > 0) S.wrgp = clampW(S.wrgp + r.reward);
    if (r.score > S.best[r.kind]) S.best[r.kind] = r.score;
    save(); render();
    modal(`<h2>${r.title}</h2><p>${r.lines.join('<br>')}</p><div class="reward">+${r.reward} WRGP</div>
      <button class="btn primary" onclick="closeModal();startGame('${r.kind}')" ${S.lives <= 0 ? 'disabled' : ''}>${tl('again')}</button>
      <button class="btn" onclick="closeModal();quitGame()">${tl('to_menu')}</button>`);
  }
};
function fitCanvas() {
  const st = $('#gstage'), cv = $('#cv');
  const ar = cv.width / cv.height, aw = st.clientWidth - 16, ah = st.clientHeight - 16;
  let w = aw, h = w / ar; if (h > ah) { h = ah; w = h * ar; }
  cv.style.width = Math.floor(w) + 'px'; cv.style.height = Math.floor(h) + 'px';
}
window.startGame = function (kind) {
  regen();
  if (S.lives <= 0) { toast(tl('no_lives')); return; }
  quitGame(true);
  S.lives--; S.lastRegen = S.lives === MAX_LIVES - 1 ? Date.now() : S.lastRegen; save(); render();
  $('#game').classList.remove('hidden');
  lockSwipes();   // oyun başladı: aşağı kaydırarak kapatma/küçültme kapalı
  $('#gTitle').textContent = kind === 'm3' ? '💎 Match-3' : '📐 Volfied';
  const cv = $('#cv');
  // yeni canvas (eski olay dinleyicileri temizlensin)
  const nc = cv.cloneNode(false); cv.parentNode.replaceChild(nc, cv);
  cur = (kind === 'm3' ? Match3 : Volfied).start(nc, ui);
  fitCanvas();
};
window.quitGame = function (silent) {
  if (cur) { cur.stop(); cur = null; }
  unlockSwipes();
  $('#game').classList.add('hidden');
};
$('#gQuit').onclick = () => {
  modal(`<h2>${tl('quit_title')}</h2><p>${tl('quit_msg')}</p>
    <button class="btn" onclick="closeModal()">${tl('keep')}</button>
    <button class="btn" style="border-color:#ff5a7a;color:#ff5a7a" onclick="closeModal();quitGame()">${tl('quit')}</button>`);
};
document.querySelectorAll('[data-play]').forEach(b => b.onclick = () => startGame(b.dataset.play));
window.addEventListener('resize', () => { if (cur) fitCanvas(); });

/* ---------- Dil seçici ---------- */
(function () {
  const sel = $('#langSel');
  sel.innerHTML = LANGS.map(l => `<option value="${l[0]}">${l[1]}</option>`).join('');
  sel.value = LANG;
  sel.onchange = () => {
    setLang(sel.value);
    render(); renderInvites();
    if ($('#tab-board').classList.contains('active')) renderBoard();
    haptic('light');
  };
  applyI18n();
  render(); renderInvites();
  loadRemote();
})();

/* Tanı: TADS SDK yüklendi mi? (Konsolda görülür) */
window.addEventListener('load', () => setTimeout(() => {
  console.log('TADS SDK:', tadsReady() ? 'hazır (window.tads.init var)' : 'BULUNAMADI (w.tads.me/widget.js yüklenmedi)');
}, 2000));
