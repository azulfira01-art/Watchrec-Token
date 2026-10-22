/* Volfied – 20 bölümlü uzay macerası (Canvas) */
const Volfied = (() => {
  const GW = 40, GH = 56, CS = 12, W = GW * CS, H = GH * CS;
  const TARGET = 0.7, FULL = 0.99, R_STD = 5, R_FULL = 8, STEP = 1000 / 60, TIME = 60000, MAXL = 3, MAXL_HI = 5, NL = 20, TAU = 6.2832;
  /* ---- 20 BÖLÜM AYARLARI (buradan değiştirilebilir) ---- */
  const R_HI = 25, R_LAST = 25;            // 11-20. bölümlerin her biri: 25 WRGP
  const FIRST_BONUS = 100, FINAL_BONUS = 500; // 10. bölüm (ilk periyot) bonusu / 20 bölüm bitince ekstra
  const FIRST_N = 10, CONT_FROM = 4;       // ilk periyot 10 bölüm; Devam Et/Bitir ekranı 5. bölümden (indeks 4) itibaren
  const maxL = i => i >= FIRST_N ? MAXL_HI : MAXL;   // 1-10: 3 can, 11-20: 5 can
  const CONT_NEED = li => 1;   // devam için gereken reklam sayısı: tüm bölümlerde 1 (+1 can butonuyla aynı reklam akışı)
  /* Zorluk: 1-10 normal; 11-19 ≈2 kat (hız x1.4+, tepki x2, bekleme süreleri yarı); 20 ultra */
  const diffOf = i => i < FIRST_N ? { spd: 1, rate: 1, cd: 1, lead: 0 }
    : i < NL - 1 ? { spd: 1.3 + (i - FIRST_N) * .022, rate: 1.75, cd: .6, lead: 0 }
    : { spd: 1.68, rate: 2.7, cd: .4, lead: 6 };
  /* Bölüm süresi: 1-10: 60 sn · 11-15: 90 sn · 16-19: 120 sn · 20: 180 sn */
  const timeOf = i => i >= FIRST_N ? Infinity : 60000;   // 11-20: süre sınırı yok (Infinity)
  const COL = { bounce: '#ff2d6f', wander: '#ffa726', snake: '#7cff4d', chase: '#ff5252', dash: '#c06bff', teleport: '#4df0ff' };

  /* ---------- 10 BÖLÜM TANIMI ---------- */
  const LV = [
    { n: 'Dünya Yörüngesi', boss: 'Yörünge Bekçisi', bt: 'bounce', c1: '#04122e', c2: '#0b2a5e', nc: ['#2e7bff', '#00d2ff'], neb: 3, st: 260, mw: 0, ac: '#35e0ff', sp: .105,
      cr: ['bounce', 'bounce', 'wander', 'wander'], pl: [['earth', .27, .27, 92], ['moon', .82, .8, 34]] },
    { n: 'Ay Yüzeyi', boss: 'Kraterus', bt: 'wander', c1: '#080913', c2: '#262b40', nc: ['#8892b0', '#4a5578'], neb: 2, st: 320, mw: 0, ac: '#cfd8ff', sp: .115,
      cr: ['bounce', 'wander', 'wander', 'snake'], pl: [['moon', .72, .24, 112], ['earth', .2, .8, 40]] },
    { n: 'Mars Çölleri', boss: 'Kızıl Kum Solucanı', bt: 'snake', c1: '#1c0a08', c2: '#4a1a10', nc: ['#ff6a3d', '#ff2d55'], neb: 3, st: 200, mw: 0, ac: '#ff9a5a', sp: .12,
      cr: ['bounce', 'snake', 'snake', 'wander'], pl: [['mars', .74, .28, 100], ['rock', .2, .7, 26], ['moon', .3, .18, 22]] },
    { n: 'Asteroit Kuşağı', boss: 'Taşparçalayan', bt: 'dash', c1: '#0b0b10', c2: '#2a2230', nc: ['#8a6d5a', '#5a4a7a'], neb: 2, st: 280, mw: 0, ac: '#ffcf70', sp: .125,
      cr: ['dash', 'bounce', 'wander', 'snake'], pl: [['rock', .25, .22, 46], ['rock', .78, .4, 34], ['rock', .35, .72, 58], ['rock', .85, .85, 24], ['rock', .12, .5, 20]] },
    { n: 'Jüpiter Fırtınası', boss: 'Fırtına Devi Jovar', bt: 'chase', c1: '#1b0f08', c2: '#4b2a14', nc: ['#ffb86b', '#ff7a3d'], neb: 4, st: 220, mw: 0, ac: '#ffc77a', sp: .13,
      cr: ['chase', 'bounce', 'wander', 'dash', 'snake'], pl: [['gas', .68, .3, 135], ['moon', .15, .78, 28]] },
    { n: 'Satürn Halkaları', boss: 'Halka Hükümdarı', bt: 'teleport', c1: '#14110a', c2: '#3a3018', nc: ['#ffd27a', '#c9a24a'], neb: 3, st: 240, mw: 0, ac: '#ffe08a', sp: .135,
      cr: ['teleport', 'chase', 'bounce', 'snake'], pl: [['ring', .35, .3, 85], ['ice', .82, .75, 38]] },
    { n: 'Samanyolu Kıyısı', boss: 'Galaksi Yutan', bt: 'chase', c1: '#050514', c2: '#1a1040', nc: ['#8a5cff', '#ff5cd0', '#4da6ff'], neb: 5, st: 520, mw: 1, ac: '#b79cff', sp: .14,
      cr: ['chase', 'dash', 'teleport', 'wander', 'bounce'], pl: [['ice', .8, .2, 44], ['alien', .2, .82, 52]] },
    { n: 'Orion Nebulası', boss: 'Nebula Hortlağı', bt: 'teleport', c1: '#12041f', c2: '#2a0a3d', nc: ['#ff4da6', '#7a4dff', '#00d2ff', '#ff9a4d'], neb: 8, st: 360, mw: 0, ac: '#ff7ad1', sp: .145,
      cr: ['teleport', 'teleport', 'chase', 'snake', 'dash'], pl: [['alien', .75, .72, 60]] },
    { n: 'Zeta-9 Yabancı Gezegen', boss: 'Zeta Ana Gemisi', bt: 'dash', c1: '#031a14', c2: '#0a3a30', nc: ['#00ffb0', '#b66bff'], neb: 4, st: 300, mw: 0, ac: '#5dffc8', sp: .155,
      cr: ['dash', 'chase', 'teleport', 'snake', 'wander'], pl: [['alien', .3, .28, 105], ['ice', .8, .62, 48], ['moon', .6, .9, 22]] },
    { n: 'Kara Delik', boss: 'Olay Ufku Canavarı', bt: 'chase', c1: '#02020a', c2: '#150a22', nc: ['#ff8a3d', '#6a3dff'], neb: 4, st: 420, mw: 1, ac: '#ff9a4d', sp: .165,
      cr: ['chase', 'dash', 'teleport', 'chase', 'snake'], pl: [['bh', .5, .45, 70]] }
  ];
  /* 11-20: daha parlak arka plan (br:1). Küçük yaratık sayısı: 11-12→6, 13-14→7, 15-16→8, 17-18→9, 19→10, 20→10 (+2 büyük canavar) */
  const POOL = ['chase', 'dash', 'teleport', 'snake', 'chase', 'bounce', 'dash', 'teleport', 'wander', 'chase'];
  const HI = [
    { n: 'Uranüs Buz Fırtınası', boss: 'Buz Titanı', bt: 'chase', c1: '#031a3a', c2: '#0a4a7a', nc: ['#4de1ff', '#7a8cff', '#b0f0ff'], ac: '#7fe9ff', pl: [['ice', .7, .25, 100], ['gas', .2, .78, 60]] },
    { n: 'Neptün Derinlikleri', boss: 'Üç Dişli Leviathan', bt: 'dash', c1: '#02103a', c2: '#0a2a8a', nc: ['#2e6bff', '#00e0ff', '#7a4dff'], ac: '#4da6ff', pl: [['gas', .3, .3, 110], ['ice', .8, .8, 40]] },
    { n: 'Plüton Sınırı', boss: 'Donmuş Nöbetçi', bt: 'teleport', c1: '#0a0f24', c2: '#2a3a6a', nc: ['#9ab8ff', '#ff9ad0', '#6affea'], ac: '#bcd0ff', pl: [['ice', .25, .7, 70], ['moon', .75, .22, 50]] },
    { n: 'Kuiper Kuşağı', boss: 'Kuyruklu Yıldız Hidrası', bt: 'snake', c1: '#0a1030', c2: '#1a3a5a', nc: ['#6affd8', '#4da6ff', '#ff7ad1'], ac: '#8affea', pl: [['rock', .2, .2, 40], ['rock', .8, .35, 50], ['ice', .5, .8, 60], ['rock', .15, .65, 26]] },
    { n: 'Güneş Patlaması', boss: 'Güneş Anka Kuşu', bt: 'chase', c1: '#2a0800', c2: '#8a2a00', nc: ['#ff6a00', '#ffd000', '#ff2d55'], ac: '#ffb347', pl: [['mars', .75, .3, 120], ['gas', .2, .8, 50]] },
    { n: 'Pulsar Fırtınası', boss: 'Pulsar Gardiyanı', bt: 'dash', c1: '#08042a', c2: '#2a0a7a', nc: ['#7a5cff', '#00f0ff', '#ff4dff'], ac: '#a58cff', mw: 1, pl: [['alien', .3, .3, 70], ['bh', .8, .75, 38]] },
    { n: 'Kristal Nebula', boss: 'Prizma Hayaleti', bt: 'teleport', c1: '#14043a', c2: '#4a0a7a', nc: ['#ff5cf0', '#5cffea', '#ffe45c', '#8a5cff'], ac: '#ff9af5', pl: [['alien', .7, .28, 90], ['ice', .2, .72, 60]] },
    { n: 'Dyson Kalıntıları', boss: 'Makine Efendisi', bt: 'chase', c1: '#041a14', c2: '#0a5a4a', nc: ['#00ffb0', '#ffd000', '#00b0ff'], ac: '#5dffc8', pl: [['ring', .3, .3, 80], ['rock', .8, .7, 44], ['alien', .7, .15, 30]] },
    { n: 'Kuasar Geçidi', boss: 'Geçit Yutan', bt: 'dash', c1: '#10032a', c2: '#3a0a6a', nc: ['#ff4dd2', '#4d7aff', '#ffb04d', '#4dffea'], ac: '#d28cff', mw: 1, pl: [['bh', .5, .4, 60], ['ring', .15, .85, 40]] },
    { n: 'Evrenin Kalbi', boss: 'İkiz Boşluklar', bt: 'chase', bt2: 'teleport', c1: '#180018', c2: '#5a0a5a', nc: ['#ff2d95', '#ffd000', '#00e5ff', '#9a4dff', '#00ff95'], ac: '#ff7ad9', mw: 1, pl: [['bh', .3, .3, 80], ['alien', .8, .78, 70], ['ring', .78, .2, 50]] }
  ];
  HI.forEach((o, k) => {
    const n = Math.min(10, 6 + (k >> 1));
    LV.push(Object.assign({ br: 1, sp: .165, mw: 0, neb: 6, st: 480,
      cr: Array.from({ length: n }, (_, j) => POOL[(j + k * 3) % POOL.length]) }, o));
  });

  /* ---------- Yardımcılar ---------- */
  const rng = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const angDiff = (a, b) => { let d = a - b; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU; return d; };
  const ell = (x, cx, cy, rx, ry, rot) => { x.beginPath(); x.ellipse(cx, cy, Math.max(.5, rx), Math.max(.5, ry), rot, 0, TAU); x.fill(); };

  /* ---------- Uzay arka planları ---------- */
  const PAL = {
    earth: ['#6bc1ff', '#0b3d91', '#4da6ff'], moon: ['#f0f0f6', '#6d7184', '#aab4d0'], mars: ['#ffa070', '#7a2410', '#ff6a3d'],
    gas: ['#ffe2b0', '#9a5224', '#ffb86b'], ring: ['#fff0c0', '#a8793a', '#ffd27a'], alien: ['#9dffd8', '#5b1ca8', '#b66bff'], ice: ['#d8f6ff', '#2f6fc0', '#7fd8ff']
  };
  function ringArc(x, px, py, r, a0, a1) {
    x.save(); x.translate(px, py); x.rotate(-.35); x.scale(1, .3);
    for (let k = 0; k < 5; k++) {
      x.strokeStyle = 'rgba(255,' + (225 - k * 18) + ',' + (170 - k * 20) + ',' + (.75 - k * .1) + ')';
      x.lineWidth = r * .09; x.beginPath(); x.arc(0, 0, r * (1.35 + k * .12), a0, a1); x.stroke();
    }
    x.restore();
  }
  function planet(x, t, px, py, r, R) {
    x.save();
    if (t === 'bh') {
      x.translate(px, py);
      const gl = x.createRadialGradient(0, 0, r * .9, 0, 0, r * 2.6);
      gl.addColorStop(0, 'rgba(255,170,80,.35)'); gl.addColorStop(1, 'rgba(255,170,80,0)');
      x.fillStyle = gl; x.beginPath(); x.arc(0, 0, r * 2.6, 0, TAU); x.fill();
      const disk = (a0, a1) => {
        x.save(); x.rotate(-.25); x.scale(1, .3); x.globalCompositeOperation = 'lighter';
        for (let k = 0; k < 14; k++) {
          x.strokeStyle = 'rgba(255,' + (130 + k * 8) + ',' + (50 + k * 9) + ',' + (.55 - k * .035) + ')';
          x.lineWidth = r * .07; x.beginPath(); x.arc(0, 0, r * (1.12 + k * .1), a0, a1); x.stroke();
        }
        x.restore();
      };
      disk(Math.PI, TAU);
      x.fillStyle = '#000'; x.beginPath(); x.arc(0, 0, r, 0, TAU); x.fill();
      x.strokeStyle = 'rgba(255,220,160,.9)'; x.lineWidth = 2.5; x.beginPath(); x.arc(0, 0, r + 1, 0, TAU); x.stroke();
      disk(0, Math.PI);
      x.restore(); return;
    }
    if (t === 'rock') {
      x.translate(px, py); x.rotate(R() * 6);
      x.beginPath();
      for (let k = 0; k < 9; k++) { const a = k / 9 * TAU, d = r * (.72 + R() * .38); if (k) x.lineTo(Math.cos(a) * d, Math.sin(a) * d); else x.moveTo(Math.cos(a) * d, Math.sin(a) * d); }
      x.closePath();
      const rg = x.createRadialGradient(-r * .3, -r * .3, r * .1, 0, 0, r * 1.1); rg.addColorStop(0, '#b5aa9c'); rg.addColorStop(1, '#3b3530');
      x.fillStyle = rg; x.fill(); x.strokeStyle = 'rgba(0,0,0,.45)'; x.lineWidth = 1.5; x.stroke();
      x.fillStyle = 'rgba(0,0,0,.25)';
      for (let k = 0; k < 4; k++) { x.beginPath(); x.arc((R() - .5) * r, (R() - .5) * r, r * (.07 + R() * .08), 0, TAU); x.fill(); }
      x.restore(); return;
    }
    const p = PAL[t];
    const gl = x.createRadialGradient(px, py, r * .8, px, py, r * 1.6);
    gl.addColorStop(0, p[2] + '66'); gl.addColorStop(1, p[2] + '00');
    x.fillStyle = gl; x.beginPath(); x.arc(px, py, r * 1.6, 0, TAU); x.fill();
    if (t === 'ring') ringArc(x, px, py, r, Math.PI, TAU);
    x.save(); x.beginPath(); x.arc(px, py, r, 0, TAU); x.clip();
    const bg = x.createRadialGradient(px - r * .4, py - r * .4, r * .1, px, py, r);
    bg.addColorStop(0, p[0]); bg.addColorStop(1, p[1]); x.fillStyle = bg; x.fillRect(px - r, py - r, r * 2, r * 2);
    if (t === 'earth') {
      x.fillStyle = '#35a85c';
      for (let i = 0; i < 7; i++) { const a = R() * 6.28, d = R() * r * .7; ell(x, px + Math.cos(a) * d, py + Math.sin(a) * d, r * (.14 + R() * .22), r * (.1 + R() * .18), R() * 3); }
      x.fillStyle = 'rgba(255,255,255,.4)';
      for (let i = 0; i < 9; i++) ell(x, px + (R() - .5) * r * 1.8, py + (R() - .5) * r * 1.8, r * (.15 + R() * .25), r * .05, R() * .6 - .3);
    } else if (t === 'moon') {
      for (let i = 0; i < 16; i++) {
        const cx = px + (R() - .5) * r * 1.8, cy = py + (R() - .5) * r * 1.8, cr = r * (.05 + R() * .11);
        x.fillStyle = 'rgba(0,0,0,.2)'; x.beginPath(); x.arc(cx, cy, cr, 0, TAU); x.fill();
        x.strokeStyle = 'rgba(255,255,255,.25)'; x.lineWidth = 1; x.stroke();
      }
    } else if (t === 'mars') {
      x.fillStyle = 'rgba(90,20,5,.35)';
      for (let i = 0; i < 8; i++) ell(x, px + (R() - .5) * r * 1.6, py + (R() - .5) * r * 1.6, r * (.1 + R() * .25), r * (.06 + R() * .12), R() * 3);
      x.fillStyle = 'rgba(255,255,255,.7)'; ell(x, px, py - r * .95, r * .4, r * .18, 0);
    } else if (t === 'gas' || t === 'ring') {
      const cols = t === 'gas' ? ['#f3d6a4', '#c98a4b', '#e9b97a', '#9c5a2c', '#f6e3c0'] : ['#fff0c0', '#d8b070', '#ffe39a', '#b8894a', '#f6e3c0'];
      x.globalAlpha = .55;
      for (let i = 0; i < 12; i++) { x.fillStyle = cols[i % cols.length]; x.fillRect(px - r, py - r + i * r * .17, r * 2, r * .17 * (.6 + R() * .7)); }
      x.globalAlpha = 1;
      if (t === 'gas') { x.fillStyle = 'rgba(200,60,30,.7)'; ell(x, px + r * .25, py + r * .3, r * .22, r * .12, 0); }
    } else {
      x.fillStyle = 'rgba(255,255,255,.28)';
      for (let i = 0; i < 10; i++) { x.beginPath(); x.arc(px + (R() - .5) * r * 1.7, py + (R() - .5) * r * 1.7, r * (.04 + R() * .1), 0, TAU); x.fill(); }
      x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 1.5;
      for (let i = 0; i < 6; i++) { x.beginPath(); x.moveTo(px + (R() - .5) * r * 1.8, py + (R() - .5) * r * 1.8); x.lineTo(px + (R() - .5) * r * 1.8, py + (R() - .5) * r * 1.8); x.stroke(); }
    }
    const sh = x.createRadialGradient(px - r * .45, py - r * .45, r * .55, px, py, r * 1.05);
    sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(0,0,12,.78)');
    x.fillStyle = sh; x.fillRect(px - r, py - r, r * 2, r * 2);
    x.restore();
    if (t === 'ring') ringArc(x, px, py, r, 0, Math.PI);
    x.restore();
  }
  function makeBg(L, idx) {
    const R = rng(idx * 7919 + 101), c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d');
    const lg = x.createLinearGradient(0, 0, W * .5, H); lg.addColorStop(0, L.c1); lg.addColorStop(1, L.c2);
    x.fillStyle = lg; x.fillRect(0, 0, W, H);
    x.globalCompositeOperation = 'lighter';
    for (let i = 0; i < L.neb + (L.br ? 4 : 0); i++) {
      const nx = R() * W, ny = R() * H, nr = 90 + R() * 170, col = L.nc[i % L.nc.length];
      const rg = x.createRadialGradient(nx, ny, 0, nx, ny, nr); rg.addColorStop(0, col + (L.br ? '88' : '66')); rg.addColorStop(1, col + '00');
      x.fillStyle = rg; x.fillRect(nx - nr, ny - nr, nr * 2, nr * 2);
    }
    if (L.mw) {
      x.save(); x.translate(W / 2, H / 2); x.rotate(-.9);
      const bd = x.createLinearGradient(0, -80, 0, 80);
      bd.addColorStop(0, 'rgba(200,190,255,0)'); bd.addColorStop(.5, 'rgba(210,200,255,.3)'); bd.addColorStop(1, 'rgba(200,190,255,0)');
      x.fillStyle = bd; x.fillRect(-H, -80, H * 2, 160);
      for (let i = 0; i < 900; i++) { x.fillStyle = 'rgba(255,255,255,' + (R() * .6) + ')'; x.fillRect((R() - .5) * H * 1.6, (R() + R() + R() - 1.5) * 70, 1.3, 1.3); }
      x.restore();
    }
    if (L.br) {   // aurora şeritleri
      for (let b = 0; b < 3; b++) {
        const col = L.nc[b % L.nc.length], y0 = H * (.12 + R() * .6), amp = 30 + R() * 50, fr = .008 + R() * .01, ph = R() * 6;
        for (let k = 0; k < 6; k++) {
          x.strokeStyle = col + '16'; x.lineWidth = 64 - k * 10; x.lineCap = 'round'; x.beginPath();
          for (let px = -10; px <= W + 10; px += 12) { const py = y0 + Math.sin(px * fr + ph) * amp + Math.sin(px * fr * 2.3 + ph) * amp * .4; if (px < 0) x.moveTo(px, py); else x.lineTo(px, py); }
          x.stroke();
        }
      }
    }
    x.globalCompositeOperation = 'source-over';
    const SC = L.br ? ['#bfe6ff', '#ffe9b0', '#ffc2f0', '#b8ffd8', '#ffffff', '#ffffff'] : null;
    const NS = L.br ? Math.round(L.st * 2.4) : L.st;
    for (let i = 0; i < NS; i++) {
      const s = R(); x.globalAlpha = (L.br ? .4 : .25) + R() * (L.br ? .6 : .75);
      x.fillStyle = SC ? SC[(R() * SC.length) | 0] : (s < .1 ? '#bfe6ff' : (s < .2 ? '#ffe9b0' : '#ffffff'));
      const sz = R() < (L.br ? .14 : .08) ? 2.2 : (L.br ? 1.5 : 1.2);
      x.fillRect(R() * W, R() * H, sz, sz);
    }
    x.globalAlpha = 1;
    if (L.br) {   // parlayan ışıltılı yıldızlar
      x.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 46; i++) {
        const sx = R() * W, sy = R() * H, sr = 5 + R() * 11, col = SC[(R() * 4) | 0];
        const gg = x.createRadialGradient(sx, sy, 0, sx, sy, sr); gg.addColorStop(0, '#ffffff'); gg.addColorStop(.3, col + 'aa'); gg.addColorStop(1, col + '00');
        x.fillStyle = gg; x.fillRect(sx - sr, sy - sr, sr * 2, sr * 2);
        x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 1; x.beginPath();
        x.moveTo(sx - sr * 1.6, sy); x.lineTo(sx + sr * 1.6, sy); x.moveTo(sx, sy - sr * 1.6); x.lineTo(sx, sy + sr * 1.6); x.stroke();
      }
      x.globalCompositeOperation = 'source-over';
    }
    for (const p of L.pl) planet(x, p[0], p[1] * W, p[2] * H, p[3], R);
    return c;
  }

  const MUL = { bounce: 1, wander: .85, snake: .9, chase: .8, dash: .55, teleport: .7 };
  const SPD = 1.25;

  function start(cv, ui) {
    cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d');
    const modalEl = document.getElementById('modal');
    const hp = t => { try { haptic(t); } catch (_) {} };
    const g = new Uint8Array(GW * GH), fresh = new Uint8Array(GW * GH), comp = new Int16Array(GW * GH);
    const total = (GW - 2) * (GH - 2);
    const layer = document.createElement('canvas'); layer.width = W; layer.height = H;
    const lc = layer.getContext('2d');
    let L, li = 0, bg, dimBg, tw = [], ss = [], D = diffOf(0);
    let ast = [], fst = [], deb = [], sk0 = null, skT = 0;   // 11-20: arka plan asteroitleri, hızlı yıldızlar, süpernova
    let lives = MAXL, score = 0, pct = 0, cleared = 0, dir = null, trail = [], tstart = [0, 0], tick = 0;
    let alive = true, state = 'intro', stT = 0, curTime = TIME, timeLeft = TIME, acc = 0, last = 0, shake = 0, raf = 0, dirty = true, lastSec = -1, bonus = 0, earned = 0, perfect = false, lvlReward = 0;
    const unlimited = () => curTime === Infinity;   // süre sınırı yok (11-20)
    const player = { x: GW >> 1, y: GH - 1 };
    let creatures = [];
    const parts = [], texts = [];
    let firstShow = false;
    let freezeT = 0;   // büyük canavar ölünce (11+. bölüm) diğer yaratıklar 5 sn donar

    const hud = () => {
      const s = unlimited() ? '∞' : Math.max(0, Math.ceil(timeLeft / 1000));
      ui.hud('🚀<b>' + (li + 1) + '</b>/' + NL + ' ⏱<b>' + s + '</b> ❤️<b>' + lives + '</b> <b>' + Math.round(pct * 100) + '%</b>');
    };
    const cellAt = (x, y) => { const cx = Math.floor(x), cy = Math.floor(y); return (cx < 0 || cy < 0 || cx >= GW || cy >= GH) ? 1 : g[cy * GW + cx]; };
    const solid = (x, y) => cellAt(x, y) === 1;

    /* ---------- Efektler ---------- */
    function burst(px, py, col, n, spd) {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * TAU, v = (.4 + Math.random()) * spd;
        parts.push({ x: px, y: py, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: 30 + Math.random() * 30, m: 60, c: col, s: 2 + Math.random() * 3 });
      }
    }
    function floatText(px, py, s, c) { texts.push({ x: px, y: py, s, c, l: 70 }); }
    function updateFx() {
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]; p.x += p.vx; p.y += p.vy; p.vx *= .96; p.vy *= .96; if (--p.l <= 0) parts.splice(i, 1);
      }
      for (let i = texts.length - 1; i >= 0; i--) { const t = texts[i]; t.y -= .6; if (--t.l <= 0) texts.splice(i, 1); }
    }

    /* ---------- Bölüm kurulumu ---------- */
    function mk(t, boss) {
      let x, y, tries = 0;
      do { x = 5 + Math.random() * (GW - 10); y = 5 + Math.random() * (GH - 18); tries++; }
      while (tries < 60 && creatures.some(o => Math.hypot(o.x - x, o.y - y) < (boss ? 12 : 6)));
      const e = { t, boss: !!boss, x, y, ang: Math.random() * TAU, ph: Math.random() * 6, rot: 0,
        spin: (Math.random() < .5 ? -1 : 1) * (.03 + Math.random() * .05), r: boss ? 3.2 : 1.2,
        timer: 30 + Math.random() * 60, turn: 0, mode: 0, hist: [], alpha: 1 };
      e.wr = boss ? 2.0 : .6; e.tr = boss ? 2.6 : 1.0;
      e.sp = L.sp * SPD * MUL[t] * (boss ? .8 : 1) * D.spd;
      e.name = boss ? L.boss : '';
      if (t === 'dash') e.timer = (60 + Math.random() * 60) * D.cd;
      if (t === 'teleport') e.timer = (120 + Math.random() * 100) * D.cd;
      return e;
    }
    function startLevel(i) {
      li = i; L = LV[i]; D = diffOf(i); if (i === FIRST_N) lives = MAXL_HI; firstShow = false; bg = makeBg(L, i);
      dimBg = document.createElement('canvas'); dimBg.width = W; dimBg.height = H;
      const d = dimBg.getContext('2d'); d.drawImage(bg, 0, 0); d.fillStyle = L.br ? 'rgba(2,4,14,.46)' : 'rgba(2,4,14,.58)'; d.fillRect(0, 0, W, H);
      g.fill(0); fresh.fill(0);
      for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) if (x === 0 || y === 0 || x === GW - 1 || y === GH - 1) g[y * GW + x] = 1;
      trail = []; dir = null; player.x = GW >> 1; player.y = GH - 1; tstart = [player.x, player.y];
      pct = 0; perfect = false; lvlReward = 0; curTime = timeOf(i); timeLeft = curTime; parts.length = 0; texts.length = 0; lastSec = -1;
      freezeT = 0; creatures = []; creatures.push(mk(L.bt, true)); if (L.bt2) creatures.push(mk(L.bt2, true)); for (const t of L.cr) creatures.push(mk(t, false));
      initSky();
      tw = []; ss = []; for (let k = 0; k < (L.br ? 120 : 40); k++) tw.push({ x: Math.random() * W, y: Math.random() * H, p: Math.random() * 6, s: Math.random() < .2 ? 2 : 1, z: L.br ? [.4, .8, 1.4][k % 3] : 0, g: !!L.br && k % 6 === 0, c: k % 4 });
      dirty = true; state = 'intro'; stT = 2300; hud();
    }

    /* ---------- Oyuncu ---------- */
    function setDir(dx, dy) {
      const d = Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)];
      if (trail.length && dir && d[0] === -dir[0] && d[1] === -dir[1]) return;
      dir = d;
    }
    function movePlayer() {
      if (!dir) return;
      const nx = player.x + dir[0], ny = player.y + dir[1];
      if (nx < 0 || ny < 0 || nx >= GW || ny >= GH) { if (!trail.length) dir = null; return; }
      const c = g[ny * GW + nx];
      if (c === 2) return;
      if (c === 1) {
        player.x = nx; player.y = ny;
        if (trail.length) { closeArea(); dir = null; }
        return;
      }
      if (!trail.length) tstart = [player.x, player.y];
      g[ny * GW + nx] = 2; trail.push(ny * GW + nx);
      player.x = nx; player.y = ny;
    }

    /* ---------- ALAN KAPATMA + SIKIŞTIRMA ----------
       Çizgi tamamlanınca boş alan parçalara ayrılır. En büyük parça açık kalır,
       diğer TÜM küçük parçalar (içinde yaratık/canavar olsa da olmasa da) doldurulur:
       alan yüzdeye eklenir, kazanılmış alanın görüntüsüne döner, içindeki yaratık ölür. */
    function closeArea() {
      for (const i of trail) { g[i] = 1; fresh[i] = 255; }
      trail = [];
      comp.fill(0);
      const sizes = [0], st = [];
      let n = 0;
      for (let s = 0; s < g.length; s++) {
        if (g[s] !== 0 || comp[s] !== 0) continue;
        n++; let cnt = 0; comp[s] = n; st.push(s);
        while (st.length) {
          const i = st.pop(), x = i % GW, y = (i / GW) | 0; cnt++;
          if (x > 0 && g[i - 1] === 0 && !comp[i - 1]) { comp[i - 1] = n; st.push(i - 1); }
          if (x < GW - 1 && g[i + 1] === 0 && !comp[i + 1]) { comp[i + 1] = n; st.push(i + 1); }
          if (y > 0 && g[i - GW] === 0 && !comp[i - GW]) { comp[i - GW] = n; st.push(i - GW); }
          if (y < GH - 1 && g[i + GW] === 0 && !comp[i + GW]) { comp[i + GW] = n; st.push(i + GW); }
        }
        sizes[n] = cnt;
      }
      let big = 0;
      for (let k = 1; k <= n; k++) if (!big || sizes[k] > sizes[big]) big = k;
      for (let i = 0; i < g.length; i++) if (g[i] === 0 && comp[i] !== big) { g[i] = 1; fresh[i] = 255; }
      let f = 0;
      for (let y = 1; y < GH - 1; y++) for (let x = 1; x < GW - 1; x++) if (g[y * GW + x] === 1) f++;
      const before = pct;
      pct = f / total;
      score += Math.round((pct - before) * total) * 5;
      // Kapatılan alanın içinde kalan yaratıklar ve canavar ölür (ekstra puan YOK)
      for (let k = creatures.length - 1; k >= 0; k--) {
        const e = creatures[k];
        if (cellAt(e.x, e.y) !== 1) continue;
        burst(e.x * CS, e.y * CS, e.boss ? '#ff2040' : COL[e.t], e.boss ? 60 : 24, e.boss ? 5 : 3);
        floatText(e.x * CS, e.y * CS, e.boss ? tl('boss_killed') : tl('killed'), e.boss ? '#ff5a6e' : '#ffffff');
        shake = Math.max(shake, e.boss ? 24 : 12); hp(e.boss ? 'heavy' : 'medium');
        if (e.boss && li >= 10) freezeT = 5000;
        creatures.splice(k, 1);
      }
      // %100 kuralı: harita %70 dolmadan tüm yaratıklar/canavar yok olduysa ya da alan zaten (neredeyse) tamamen kapandıysa
      // kalan boşluk da doldurulur, bölüm %100 kapatılmış sayılır ve 8 WRGP verilir.
      if (creatures.length === 0 || pct >= FULL) {
        perfect = true;
        let add = 0;
        for (let y = 1; y < GH - 1; y++) for (let x = 1; x < GW - 1; x++) { const i = y * GW + x; if (g[i] !== 1) { g[i] = 1; fresh[i] = 255; add++; } }
        pct = 1; score += add * 5;
        floatText(W / 2, H / 2, '100%', '#ffd700');
      }
      dirty = true; hp('light'); hud();
      if (pct >= TARGET) levelWin();
    }

    /* ---------- Yaratıklar ---------- */
    function openSpot() {
      for (let t = 0; t < 80; t++) {
        const x = 4 + Math.random() * (GW - 8), y = 4 + Math.random() * (GH - 8);
        let ok = true;
        for (let dy = -2; dy <= 2 && ok; dy++) for (let dx = -2; dx <= 2; dx++) if (cellAt(x + dx, y + dy) !== 0) { ok = false; break; }
        if (ok) return [x, y];
      }
      return null;
    }
    function hitsTrail(e) {
      const R = e.tr, o = [[0, 0], [R, 0], [-R, 0], [0, R], [0, -R], [R * .7, R * .7], [-R * .7, R * .7], [R * .7, -R * .7], [-R * .7, -R * .7]];
      for (const p of o) if (cellAt(e.x + p[0], e.y + p[1]) === 2) return true;
      return false;
    }
    function stepCreature(e) {
      e.rot += e.spin; e.ph += .12;
      let sp = e.sp;
      switch (e.t) {
        case 'wander':
          if (--e.timer <= 0) { e.turn = (Math.random() - .5) * .09; e.timer = 20 + Math.random() * 50; }
          e.ang += e.turn; break;
        case 'snake':
          e.ang += Math.sin(e.ph * .8) * .07; break;
        case 'chase':
          { const rate = (e.boss ? .014 : .024) * D.rate, lx = D.lead && dir ? dir[0] * D.lead : 0, ly = D.lead && dir ? dir[1] * D.lead : 0;
            if (trail.length) {
              const want = Math.atan2(player.y + .5 + ly - e.y, player.x + .5 + lx - e.x), d = angDiff(want, e.ang);
              e.ang += Math.max(-rate, Math.min(rate, d));
            } else if (D.lead) {
              const want = Math.atan2(player.y + .5 - e.y, player.x + .5 - e.x), d = angDiff(want, e.ang);
              e.ang += Math.max(-rate * .4, Math.min(rate * .4, d));
            } else e.ang += Math.sin(e.ph * .5) * .03; }
          break;
        case 'dash':
          if (e.mode === 0) {
            sp *= .55; e.ang += (Math.random() - .5) * .08;
            if (--e.timer <= 0) { e.mode = 1; e.timer = 26; e.ang = Math.atan2(player.y + .5 + (D.lead && dir ? dir[1] * D.lead : 0) - e.y, player.x + .5 + (D.lead && dir ? dir[0] * D.lead : 0) - e.x); }
          } else {
            sp *= 3.4;
            if (--e.timer <= 0) { e.mode = 0; e.timer = (70 + Math.random() * 70) * D.cd; }
          }
          break;
        case 'teleport':
          if (e.mode === 0) {
            e.ang += (Math.random() - .5) * .1;
            if (--e.timer <= 0) e.mode = 1;
          } else if (e.mode === 1) {
            e.alpha -= .05 / D.cd;
            if (e.alpha <= 0) {
              e.alpha = 0; const s = openSpot();
              if (s) { e.x = s[0]; e.y = s[1]; burst(e.x * CS, e.y * CS, COL.teleport, 10, 2); }
              e.mode = 2;
            }
          } else {
            e.alpha += .05 / D.cd;
            if (e.alpha >= 1) { e.alpha = 1; e.mode = 0; e.timer = (110 + Math.random() * 110) * D.cd; }
          }
          break;
      }
      const dx = Math.cos(e.ang) * sp, dy = Math.sin(e.ang) * sp, wr = e.wr;
      if (solid(e.x + dx + Math.sign(dx) * wr, e.y)) e.ang = Math.PI - e.ang + (Math.random() - .5) * .3; else e.x += dx;
      if (solid(e.x, e.y + dy + Math.sign(dy) * wr)) e.ang = -e.ang + (Math.random() - .5) * .3; else e.y += dy;
      if (e.t === 'snake' && tick % 2 === 0) { e.hist.unshift({ x: e.x, y: e.y }); if (e.hist.length > (e.boss ? 14 : 8)) e.hist.pop(); }
      if (e.t === 'teleport' && e.alpha < .4) return;
      if (hitsTrail(e) || (trail.length && Math.hypot(e.x - (player.x + .5), e.y - (player.y + .5)) < e.tr + .4)) loseLife();
    }
    /* canlar bitti ya da süre doldu: 5. bölümden itibaren Devam Et / Bitir (15 sn) */
    function noLives(why) {
      if (li >= CONT_FROM && ui.cont) {
        state = 'cont'; dir = null;
        return ui.cont(CONT_NEED(li), maxL(li), ok => {
          if (!alive || state !== 'cont') return;
          if (ok) { lives = maxL(li); startLevel(li); } else finish(false, why);   // reklam izlendi: aynı bölüm baştan, 3 canla, süre de baştan
        });
      }
      return finish(false, why);
    }
    function loseLife() {
      if (state !== 'play') return;
      lives--; shake = 16; hp('error');
      burst((player.x + .5) * CS, (player.y + .5) * CS, '#ffd700', 22, 3);
      for (const i of trail) g[i] = 0;
      trail = []; dir = null; player.x = tstart[0]; player.y = tstart[1];
      hud();
      if (lives <= 0) return noLives('life');
      state = 'pause'; stT = 700;
    }

    /* ---------- Bölüm / oyun sonu ---------- */
    function levelWin() {
      if (state !== 'play') return;
      cleared++;
      if (li < FIRST_N) lvlReward = perfect ? R_FULL : R_STD;       // 1-10: 5 WRGP (%100 ise 8)
      else lvlReward = li === NL - 1 ? R_LAST : R_HI;              // 11-19: 10, 20: 20
      earned += lvlReward;
      bonus = unlimited() ? 0 : Math.ceil(timeLeft / 1000) * 10;
      score += bonus;
      lives = Math.min(maxL(li), lives + 1);
      dir = null; hp('medium');
      if (li === FIRST_N - 1) { earned += FIRST_BONUS; firstShow = true; }   // ilk periyot bitti: bonus + tebrik, oyun 11. bölümle sürer
      if (li >= NL - 1) { earned += FINAL_BONUS; return finish(true, 'win'); }
      state = 'clear'; stT = firstShow ? 4200 : 2300; hud();
    }
    function finish(win, why) {
      if (!alive || state === 'over') return;
      state = 'over'; dir = null;
      const reward = earned;
      const title = win ? tl('vf_win') : (why === 'time' ? tl('time_up') : tl('lives_out'));
      const lines = [tl('vf_l1', { c: cleared, n: NL }), tl('vf_l2', { p: Math.round(pct * 100) }), tl('vf_l3', { s: score }), tl('vf_l4', { r: reward })];
      if (cleared >= FIRST_N) lines.push(tl('vf_l5', { b: FIRST_BONUS }));
      if (win) lines.push(tl('vf_l6', { b: FINAL_BONUS }));
      ui.end({ kind: 'vf', score, reward, win, title, lines });
    }
    function step() {
      if (!modalEl.classList.contains('hidden')) return;
      updateFx();
      if (state === 'intro' || state === 'pause') { stT -= STEP; if (stT <= 0) state = 'play'; return; }
      if (state === 'clear') { stT -= STEP; if (stT <= 0) startLevel(li + 1); return; }
      if (state !== 'play') return;
      tick++;
      timeLeft -= STEP;
      const sec = Math.ceil(timeLeft / 1000);
      if (sec !== lastSec) { lastSec = sec; hud(); if (sec <= 5 && sec > 0) hp('medium'); }
      if (timeLeft <= 0) { timeLeft = 0; hud(); return noLives('time'); }
      if (tick % 3 === 0) movePlayer();
      if (state !== 'play') return;
      if (freezeT > 0) { freezeT -= STEP; if (freezeT < 0) freezeT = 0; return; }   // yaratıklar hareketsiz
      for (let k = creatures.length - 1; k >= 0; k--) { if (state !== 'play') break; if (creatures[k]) stepCreature(creatures[k]); }
    }

    /* ---------- Çizim ---------- */
    function rebuild() {
      lc.drawImage(dimBg, 0, 0);
      for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
        if (g[y * GW + x] !== 1) continue;
        lc.drawImage(bg, x * CS, y * CS, CS, CS, x * CS, y * CS, CS, CS);
      }
      lc.fillStyle = L.ac + '22'; 
      for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) if (g[y * GW + x] === 1) lc.fillRect(x * CS, y * CS, CS, CS);
      lc.fillStyle = L.ac; lc.shadowColor = L.ac; lc.shadowBlur = 8;
      for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
        const i = y * GW + x; if (g[i] !== 1) continue;
        const px = x * CS, py = y * CS;
        if (x > 0 && g[i - 1] !== 1) lc.fillRect(px - 1, py, 3, CS);
        if (x < GW - 1 && g[i + 1] !== 1) lc.fillRect(px + CS - 2, py, 3, CS);
        if (y > 0 && g[i - GW] !== 1) lc.fillRect(px, py - 1, CS, 3);
        if (y < GH - 1 && g[i + GW] !== 1) lc.fillRect(px, py + CS - 2, CS, 3);
      }
      lc.shadowBlur = 0; dirty = false;
    }
    function body(e, T) {
      const s = e.boss ? 2.6 : 1, c = e.boss ? '#ff2040' : COL[e.t];
      ctx.shadowColor = c; ctx.shadowBlur = e.boss ? 26 : 16; ctx.fillStyle = c;
      const eye = (r) => {
        ctx.shadowBlur = 0; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
        ctx.fillStyle = e.boss ? '#600' : '#200'; ctx.beginPath(); ctx.arc(Math.cos(e.ang) * r * .35, Math.sin(e.ang) * r * .35, r * .5, 0, TAU); ctx.fill();
      };
      if (e.t === 'bounce') {
        ctx.rotate(e.rot); ctx.beginPath();
        for (let k = 0; k < 12; k++) { const a = Math.PI / 6 * k, r = (k % 2 ? 8 : 15) * s; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
        ctx.closePath(); ctx.fill(); eye(5 * s);
      } else if (e.t === 'wander') {
        const wob = Math.sin(T * 4 + e.ph) * .12;
        ctx.scale(1 + wob, 1 - wob); ctx.beginPath(); ctx.arc(0, -2 * s, 12 * s, Math.PI, 0);
        for (let k = 0; k < 4; k++) ctx.quadraticCurveTo((9 - k * 6) * s, (16 + (k % 2) * 4) * s, (6 - k * 6) * s, 10 * s + 2 * s);
        ctx.lineTo(-12 * s, -2 * s); ctx.fill();
        ctx.translate(0, -3 * s); eye(4.5 * s);
      } else if (e.t === 'snake') {
        ctx.restore(); ctx.save();
        for (let k = e.hist.length - 1; k >= 0; k--) {
          const h = e.hist[k], r = (11 - k * .7) * (e.boss ? 1.9 : 1);
          ctx.fillStyle = k % 2 ? c : '#3a8a1f'; ctx.shadowBlur = 10;
          ctx.beginPath(); ctx.arc(h.x * CS, h.y * CS, Math.max(3, r), 0, TAU); ctx.fill();
        }
        ctx.translate(e.x * CS, e.y * CS); ctx.fillStyle = c; ctx.shadowBlur = 16;
        ctx.beginPath(); ctx.arc(0, 0, 12 * s, 0, TAU); ctx.fill(); eye(5.5 * s);
      } else if (e.t === 'chase') {
        ctx.rotate(e.ang); ctx.beginPath(); ctx.moveTo(18 * s, 0); ctx.lineTo(-11 * s, 13 * s); ctx.lineTo(-5 * s, 0); ctx.lineTo(-11 * s, -13 * s);
        ctx.closePath(); ctx.fill(); ctx.rotate(-e.ang); eye(4.5 * s);
      } else if (e.t === 'dash') {
        ctx.rotate(e.mode ? e.ang : e.rot); ctx.beginPath();
        for (let k = 0; k < 6; k++) { const a = Math.PI / 3 * k; ctx.lineTo(Math.cos(a) * 15 * s, Math.sin(a) * 15 * s); const b = a + Math.PI / 6; ctx.lineTo(Math.cos(b) * 7 * s, Math.sin(b) * 7 * s); }
        ctx.closePath(); ctx.fill(); ctx.rotate(e.mode ? -e.ang : -e.rot); eye(4.5 * s);
      } else {
        ctx.rotate(e.rot); ctx.beginPath(); ctx.moveTo(0, -17 * s); ctx.lineTo(13 * s, 0); ctx.lineTo(0, 17 * s); ctx.lineTo(-13 * s, 0); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke(); ctx.rotate(-e.rot); eye(4.5 * s);
      }
    }
    function drawCreature(e, T) {
      ctx.save();
      ctx.globalAlpha = e.alpha;
      ctx.translate(e.x * CS, e.y * CS);
      if (e.boss) {
        const pr = 1 + Math.sin(T * 5) * .07;
        ctx.save(); ctx.rotate(-T * 1.2); ctx.strokeStyle = '#ff2040'; ctx.shadowColor = '#ff2040'; ctx.shadowBlur = 20; ctx.lineWidth = 4;
        ctx.setLineDash([16, 9]); ctx.beginPath(); ctx.arc(0, 0, 54 * pr, 0, TAU); ctx.stroke(); ctx.restore();
        ctx.save(); ctx.strokeStyle = 'rgba(255,90,110,.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 44, 0, TAU); ctx.stroke(); ctx.restore();
      }
      body(e, T);
      ctx.restore();
    }
    const GCOL = ['#9fd8ff', '#ffd9a0', '#ffb0e8', '#b0ffd8'];
    const glow = GCOL.map(c => { const k = document.createElement('canvas'); k.width = k.height = 32; const q = k.getContext('2d'); const rg = q.createRadialGradient(16, 16, 0, 16, 16, 16); rg.addColorStop(0, '#ffffff'); rg.addColorStop(.25, c); rg.addColorStop(1, c + '00'); q.fillStyle = rg; q.fillRect(0, 0, 32, 32); return k; });

    /* ---------- 11-20: arka plan asteroitleri, hızlı yıldızlar ve 20. bölümde süpernova ---------- */
    function initSky() {
      sk0 = null; skT = 0; ast = []; fst = []; deb = [];
      if (!L.br) return;
      const last = li === NL - 1, n = last ? 14 : 9;
      for (let k = 0; k < n; k++) {
        const fast = k % 3 === 2, r = fast ? 3 + Math.random() * 4 : 5 + Math.random() * 11, a = .3 + Math.random() * .9, v = fast ? 90 + Math.random() * 70 : 8 + Math.random() * 12, pts = [];
        for (let j = 0; j < 8; j++) pts.push(.7 + Math.random() * .5);
        ast.push({ x: Math.random() * W, y: Math.random() * H, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r, rot: Math.random() * 6, vr: (Math.random() - .5) * (fast ? 4 : .8), pts, fast });
      }
      for (let k = 0; k < (last ? 12 : 8); k++) {
        const a = .3 + Math.random() * .9, v = 190 + Math.random() * 150;
        fst.push({ x: Math.random() * W, y: Math.random() * H, vx: Math.cos(a) * v, vy: Math.sin(a) * v, al: .4 + Math.random() * .5 });
      }
      for (let k = 0; k < 44; k++) deb.push({ a: Math.random() * TAU, s: .35 + Math.random() * .65, z: 1 + Math.random() * 2.2, c: k % 3 });
    }
    function drawDrift(T) {
      const dt = sk0 === null ? 0 : Math.min(.1, T - skT); skT = T;
      for (const q of fst) {   // hızlı geçen yıldız çizgileri
        q.x += q.vx * dt; q.y += q.vy * dt;
        if (q.x > W + 60 || q.y > H + 60) { q.x = -40 - Math.random() * 60; q.y = Math.random() * H * .9; }
        const gr = ctx.createLinearGradient(q.x - q.vx * .11, q.y - q.vy * .11, q.x, q.y);
        gr.addColorStop(0, 'rgba(190,225,255,0)'); gr.addColorStop(1, 'rgba(235,245,255,' + q.al + ')');
        ctx.globalAlpha = 1; ctx.strokeStyle = gr; ctx.lineWidth = 1.4; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(q.x - q.vx * .11, q.y - q.vy * .11); ctx.lineTo(q.x, q.y); ctx.stroke();
      }
      for (const a of ast) {   // yavaş ve hızlı asteroitler
        a.x += a.vx * dt; a.y += a.vy * dt; a.rot += a.vr * dt;
        if (a.x > W + 40) { a.x = -30; a.y = Math.random() * H; } else if (a.y > H + 40) { a.y = -30; a.x = Math.random() * W; }
        if (a.fast) {
          const gr = ctx.createLinearGradient(a.x - a.vx * .1, a.y - a.vy * .1, a.x, a.y);
          gr.addColorStop(0, 'rgba(255,190,130,0)'); gr.addColorStop(1, 'rgba(255,200,150,.45)');
          ctx.globalAlpha = 1; ctx.strokeStyle = gr; ctx.lineWidth = a.r * .9; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(a.x - a.vx * .1, a.y - a.vy * .1); ctx.lineTo(a.x, a.y); ctx.stroke();
        }
        ctx.save(); ctx.translate(a.x, a.y); ctx.rotate(a.rot); ctx.globalAlpha = a.fast ? .75 : .6;
        ctx.beginPath();
        for (let j = 0; j < 8; j++) { const an = j / 8 * TAU, d = a.r * a.pts[j]; if (j) ctx.lineTo(Math.cos(an) * d, Math.sin(an) * d); else ctx.moveTo(d, 0); }
        ctx.closePath(); ctx.fillStyle = '#8c7f73'; ctx.fill(); ctx.strokeStyle = 'rgba(20,14,10,.6)'; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.arc(a.r * .2, -a.r * .15, a.r * .22, 0, TAU); ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }
    /* 20. bölüm: çok uzakta bir yıldız diğerine çarpar; patlama 40 sn boyunca yavaşça büyür, söner (60 sn'lik döngü) */
    function drawNova(T) {
      const AP = 14, EX = 40, C = 60, u = (T - sk0) % C, cx = W * .7, cy = H * .17;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const orb = (x, y, sz, gi, al) => { ctx.globalAlpha = al; ctx.drawImage(glow[gi], x - sz / 2, y - sz / 2, sz, sz); };
      if (u < AP) {
        const k = u / AP, e = k * k;
        orb(cx - 150 * (1 - e), cy - 55 * (1 - e), 26 + 8 * k, 0, .95);
        orb(cx + 140 * (1 - e), cy + 50 * (1 - e), 20 + 8 * k, 1, .95);
      } else if (u < AP + EX) {
        const te = (u - AP) / EX, eo = 1 - Math.pow(1 - te, 2.2), fade = Math.pow(1 - te, 1.3);
        if (te < .05) { const fa = 1 - te / .05, fr = 40 + 160 * te / .05, g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, fr); g1.addColorStop(0, 'rgba(255,255,255,' + fa + ')'); g1.addColorStop(1, 'rgba(255,255,255,0)'); ctx.globalAlpha = 1; ctx.fillStyle = g1; ctx.fillRect(cx - fr, cy - fr, fr * 2, fr * 2); }
        const rr = 18 + 100 * eo, g2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr);
        g2.addColorStop(0, 'rgba(255,255,235,.95)'); g2.addColorStop(.25, 'rgba(255,200,90,.75)'); g2.addColorStop(.6, 'rgba(255,90,40,.4)'); g2.addColorStop(1, 'rgba(160,40,200,0)');
        ctx.globalAlpha = .35 + .65 * fade; ctx.fillStyle = g2; ctx.fillRect(cx - rr, cy - rr, rr * 2, rr * 2);
        const nr = 40 + 190 * eo, g3 = ctx.createRadialGradient(cx, cy, nr * .3, cx, cy, nr);
        g3.addColorStop(0, 'rgba(255,90,170,.22)'); g3.addColorStop(.6, 'rgba(110,80,255,.14)'); g3.addColorStop(1, 'rgba(60,120,255,0)');
        ctx.globalAlpha = Math.min(1, fade * 1.4); ctx.fillStyle = g3; ctx.fillRect(cx - nr, cy - nr, nr * 2, nr * 2);
        for (let w = 0; w < 2; w++) {   // şok dalgaları
          const p = Math.max(0, te - w * .12) / (1 - w * .12), R = (60 + 230 * (1 - Math.pow(1 - p, 2))) * (1 - w * .25);
          ctx.globalAlpha = Math.max(0, (1 - p)) * .65; ctx.strokeStyle = w ? '#ffb0e8' : '#bfe6ff'; ctx.lineWidth = 3 * (1 - p) + 1;
          ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();
        }
        for (const d of deb) {   // savrulan parçalar
          const dd = d.s * 170 * eo, x = cx + Math.cos(d.a) * dd, y = cy + Math.sin(d.a) * dd;
          ctx.globalAlpha = fade * .9; ctx.drawImage(glow[d.c], x - d.z * 3, y - d.z * 3, d.z * 6, d.z * 6);
        }
      }
      ctx.restore();
    }
    function drawSky(T) {
      if (sk0 === null) sk0 = T;   // 11-20: çok katmanlı kayan yıldızlar, ışıltılar, kayan yıldız
      for (const t of tw) {
        const a = .3 + .7 * Math.abs(Math.sin(T * (1.2 + t.z) + t.p)), px = (t.x + T * t.z * 5) % W, py = (t.y + T * t.z * 1.5) % H;
        ctx.globalAlpha = a;
        if (t.g) { const sz = 14 + 10 * a; ctx.drawImage(glow[t.c], px - sz / 2, py - sz / 2, sz, sz); }
        else { const z = t.s * (t.z > 1 ? 1.6 : 1.1); ctx.fillStyle = '#fff'; ctx.fillRect(px, py, z, z); }
      }
      if (ss.length < 3 && Math.random() < (li === NL - 1 ? .03 : .008)) ss.push({ x: Math.random() * W * .8, y: Math.random() * H * .4, vx: 7 + Math.random() * 5, vy: 3 + Math.random() * 3, l: 38 });
      for (let i = ss.length - 1; i >= 0; i--) {
        const q = ss[i]; q.x += q.vx; q.y += q.vy;
        if (--q.l <= 0) { ss.splice(i, 1); continue; }
        const gr = ctx.createLinearGradient(q.x - q.vx * 5, q.y - q.vy * 5, q.x, q.y);
        gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(255,255,255,.95)');
        ctx.globalAlpha = Math.min(1, q.l / 12); ctx.strokeStyle = gr; ctx.lineWidth = 2; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(q.x - q.vx * 5, q.y - q.vy * 5); ctx.lineTo(q.x, q.y); ctx.stroke();
      }
      drawDrift(T);
      if (li === NL - 1) drawNova(T);
      if (li === NL - 1) { ctx.globalAlpha = .03; ctx.fillStyle = 'hsl(' + ((T * 30) % 360) + ',90%,60%)'; ctx.fillRect(0, 0, W, H); }   // ultra bölüm: renk nabzı
    }
    function ft(s, y, size, col) {   // sığacak şekilde küçülen yazı
      let z = size; ctx.fillStyle = col;
      do { ctx.font = 'bold ' + z + 'px sans-serif'; z--; } while (ctx.measureText(s).width > W - 24 && z > 9);
      ctx.fillText(s, W / 2, y);
    }
    function draw(T) {
      if (dirty) rebuild();
      ctx.save();
      if (shake > 0) { ctx.translate((Math.random() - .5) * shake, (Math.random() - .5) * shake); shake *= .86; if (shake < .5) shake = 0; }
      ctx.drawImage(layer, 0, 0);
      ctx.globalAlpha = .85;
      if (L.br) drawSky(T); else for (const t of tw) { ctx.fillStyle = '#fff'; ctx.globalAlpha = .25 + .5 * Math.abs(Math.sin(T * 2 + t.p)); ctx.fillRect(t.x, t.y, t.s, t.s); }
      ctx.globalAlpha = 1;
      for (let i = 0; i < fresh.length; i++) if (fresh[i]) {
        ctx.fillStyle = 'rgba(255,255,255,' + (fresh[i] / 255 * .75) + ')';
        ctx.fillRect((i % GW) * CS, ((i / GW) | 0) * CS, CS, CS);
        fresh[i] = fresh[i] > 10 ? fresh[i] - 10 : 0;
      }
      ctx.shadowColor = '#ffd700'; ctx.shadowBlur = 10; ctx.fillStyle = '#ffd700';
      for (const i of trail) ctx.fillRect((i % GW) * CS + 2, ((i / GW) | 0) * CS + 2, CS - 4, CS - 4);
      ctx.shadowBlur = 0;
      for (const e of creatures) drawCreature(e, T);
      for (const p of parts) { ctx.globalAlpha = Math.max(0, p.l / p.m); ctx.fillStyle = p.c; ctx.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s); }
      ctx.globalAlpha = 1;
      const px = (player.x + .5) * CS, py = (player.y + .5) * CS;
      ctx.save(); const hiLv = li >= FIRST_N;   // 11-20: siyah kenarlı oyuncu (ışıklı arka planda net seçilsin)
      ctx.shadowColor = hiLv ? '#000' : '#fff'; ctx.shadowBlur = hiLv ? 6 : 16; ctx.fillStyle = state === 'pause' && ((T * 12) | 0) % 2 ? '#ff9a9a' : '#fff';
      ctx.beginPath(); ctx.moveTo(px, py - 11); ctx.lineTo(px + 9, py); ctx.lineTo(px, py + 11); ctx.lineTo(px - 9, py); ctx.closePath();
      if (hiLv) { ctx.lineJoin = 'round'; ctx.lineWidth = 4.5; ctx.strokeStyle = '#000'; ctx.stroke(); }
      ctx.fill(); ctx.restore();
      ctx.textAlign = 'center'; ctx.font = 'bold 13px sans-serif';
      for (const t of texts) { ctx.globalAlpha = Math.min(1, t.l / 25); ctx.fillStyle = t.c; ctx.shadowColor = '#000'; ctx.shadowBlur = 6; ctx.fillText(t.s, Math.max(70, Math.min(W - 70, t.x)), t.y); }
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      // süre çubuğu
      const fr = unlimited() ? 1 : timeLeft / curTime;
      ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(0, 0, W, 5);
      ctx.fillStyle = fr < .2 ? '#ff3b5c' : '#00d2ff'; ctx.fillRect(0, 0, W * fr, 5);
      // dondurma geri sayımı
      if (freezeT > 0 && state === 'play') {
        const n = Math.ceil(freezeT / 1000);
        ctx.save(); ctx.fillStyle = 'rgba(120,220,255,.12)'; ctx.fillRect(0, 0, W, H);
        ctx.textAlign = 'center'; ctx.shadowColor = '#4df0ff'; ctx.shadowBlur = 18;
        ctx.fillStyle = '#bff6ff'; ctx.font = 'bold 18px sans-serif'; ctx.fillText(tl('freeze'), W / 2, H * .14);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 64px sans-serif'; ctx.fillText(String(n), W / 2, H * .14 + 64);
        ctx.fillStyle = '#4df0ff'; ctx.fillRect(W * .25, H * .14 + 78, W * .5 * (freezeT / 5000), 5);
        ctx.restore();
      }
      // bölüm duyuruları
      if (state === 'intro' || state === 'clear') {
        ctx.fillStyle = 'rgba(2,4,14,.62)'; ctx.fillRect(0, H * .3, W, 190);
        ctx.fillStyle = '#fff'; ctx.shadowColor = L.ac; ctx.shadowBlur = 16;
        if (state === 'intro') {
          ft(li === NL - 1 ? tl('final_lvl') : tl('level_of', { a: li + 1, b: NL }), H * .3 + 42, 20, li === NL - 1 ? '#ff5a6e' : L.ac);
          ctx.font = 'bold 29px sans-serif'; ctx.fillStyle = '#fff'; ctx.fillText(LVN(li)[0], W / 2, H * .3 + 88);
          ctx.font = '15px sans-serif'; ctx.fillStyle = '#ff6a7e'; ctx.fillText(tl('boss_lbl', { n: LVN(li)[1] }), W / 2, H * .3 + 128);
          ctx.fillStyle = '#cfe'; ctx.fillText((unlimited() ? tl('goal_inf') : tl('goal').replace('60', Math.round(curTime / 1000))), W / 2, H * .3 + 158);
        } else if (firstShow) {   // 10. bölüm bitti: ilk periyot tebriği
          ft(tl('level_done'), H * .3 + 40, 24, '#00e676');
          ft(tl('first_done'), H * .3 + 78, 19, '#ffd700');
          ft(tl('first_sub', { b: FIRST_BONUS }), H * .3 + 112, 18, '#ffffff');
          ft(tl('first_next'), H * .3 + 148, 15, '#cceeff');
        } else {
          ctx.font = 'bold 30px sans-serif'; ctx.fillStyle = '#00e676'; ctx.fillText(tl('level_done'), W / 2, H * .3 + 46);
          ctx.font = 'bold 16px sans-serif'; ctx.fillStyle = '#ffd700'; ctx.fillText(tl(perfect ? 'lvl_perfect' : 'lvl_reward', { r: lvlReward }), W / 2, H * .3 + 82);
          ctx.font = '16px sans-serif'; ctx.fillStyle = '#fff'; ctx.fillText(tl('time_bonus', { b: bonus }), W / 2, H * .3 + 116);
          ctx.fillStyle = '#cfe'; ctx.fillText(tl('next', { n: LVN(li + 1)[0] }), W / 2, H * .3 + 150);
        }
        ctx.shadowBlur = 0;
      }
      ctx.restore();
    }
    function loop(t) {
      if (!alive) return;
      if (!last) last = t;
      acc += Math.min(100, t - last); last = t;
      while (acc >= STEP) { step(); acc -= STEP; }
      draw(t / 1000);
      raf = requestAnimationFrame(loop);
    }

    /* ---------- Girdi: kaydırma + ok tuşları ---------- */
    let sp = null, moved = false, tapT = 0;
    cv.onpointerdown = e => { moved = false; tapT = performance.now(); sp = { x: e.clientX, y: e.clientY }; try { cv.setPointerCapture(e.pointerId); } catch (_) {} };
    cv.onpointermove = e => {
      if (!sp) return;
      const dx = e.clientX - sp.x, dy = e.clientY - sp.y;
      if (Math.hypot(dx, dy) > 14) { moved = true; setDir(dx, dy); sp = { x: e.clientX, y: e.clientY }; }
    };
    cv.onpointerup = () => { if (sp && !moved && performance.now() - tapT < 400 && state === 'play') dir = null; sp = null; };   // sadece dokunma = cisim olduğu yerde durur
    cv.onpointercancel = () => { sp = null; };
    const keyH = e => {
      const m = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
      if (m) { e.preventDefault(); setDir(m[0], m[1]); } else if (e.key === ' ') { e.preventDefault(); dir = null; }
    };
    window.addEventListener('keydown', keyH);

    startLevel(0);
    ui.hint(tl('vf_hint') + ' • ' + tl('vf_stop'));
    raf = requestAnimationFrame(loop);
    return { stop() {
      alive = false; cancelAnimationFrame(raf);
      window.removeEventListener('keydown', keyH);
      cv.onpointerdown = cv.onpointermove = cv.onpointerup = cv.onpointercancel = null;
    } };
  }
  return { start };
})();
