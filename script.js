/* ============================================================
   Happy Birthday to an Amazing Mother
   script.js · no dependencies
   ------------------------------------------------------------
   ✏️  EDIT THE CONFIG BELOW to personalise this site.
   ============================================================ */
(function () {
  'use strict';

  /* ======================= CONFIG ======================= */
  var CONFIG = {
    name: 'Mom',                                  // how she's addressed
    birthday: new Date(2026, 8, 27, 0, 0, 0, 0),  // 27 Sept 2026 (month is 0-indexed)
    whatsapp: '2347078456163',                    // WhatsApp number, international format, no +
    waIntro: 'Hi! I just saw the birthday site for Mom — it\'s beautiful. Here\'s my message for her: '
  };
  /* ====================================================== */

  var BIRTHDAY = CONFIG.birthday.getTime();
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(id) { return document.getElementById(id); }
  function on(el, ev, fn) { if (el) el.addEventListener(ev, fn); }
  function rand(a, b) { return a + Math.random() * (b - a); }

  /* ---------------- SPLASH ---------------- */
  var splash = $('splash');
  function hideSplash() {
    if (!splash) return;
    splash.classList.add('gone');
    setTimeout(function () { if (splash && splash.parentNode) splash.parentNode.removeChild(splash); }, 900);
  }
  if (splash) {
    if (document.readyState === 'complete') setTimeout(hideSplash, 350);
    else on(window, 'load', function () { setTimeout(hideSplash, 350); });
    setTimeout(function () { if (splash) splash.classList.add('slow'); }, 2600);
    setTimeout(hideSplash, 5000);
    on($('splashRetry'), 'click', function () { window.location.reload(); });
  }

  /* ---------------- HERO PHOTO SLIDESHOW (auto-rotating) ---------------- */
  (function () {
    var wrap = $('heroSlides');
    if (!wrap) return;
    var slides = wrap.querySelectorAll('.slide');
    if (slides.length < 2) return;
    var dots = $('heroDots') ? $('heroDots').querySelectorAll('.dot') : [];
    var i = 0, timer = null;
    function show(n) {
      i = (n + slides.length) % slides.length;
      for (var k = 0; k < slides.length; k++) slides[k].classList.toggle('is-active', k === i);
      for (var d = 0; d < dots.length; d++) dots[d].classList.toggle('is-active', d === i);
    }
    function start() {
      if (REDUCED) return;            // respect reduced-motion: just show the first photo
      stop();
      timer = setInterval(function () { show(i + 1); }, 4200);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    show(0);
    start();
  })();

  /* ---------------- BIRTHDAY MODE ---------------- */
  function isBirthdayNow() { return Date.now() >= BIRTHDAY; }

  /* ---------------- COUNTDOWN (keeps ticking — even after the birthday) ---------------- */
  var tD = $('tDays'), tH = $('tHours'), tM = $('tMins'), tS = $('tSecs');
  var timerTitle = $('timerTitle'), timerCapsule = $('timerCapsule'), countFoot = $('countFoot');
  var banner = $('birthdayBanner');
  var flipped = false;

  var BD_MONTH = CONFIG.birthday.getMonth(); // 8 = September
  var BD_DAY = CONFIG.birthday.getDate();    // 27

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime(); }
  function isBirthdayToday(d) { return d.getMonth() === BD_MONTH && d.getDate() === BD_DAY; }
  // the upcoming birthday (start of day) — today or later, rolling to next year automatically
  function nextBirthday(d) {
    var y = d.getFullYear();
    var c = new Date(y, BD_MONTH, BD_DAY, 0, 0, 0, 0);
    if (c.getTime() < startOfDay(d)) c = new Date(y + 1, BD_MONTH, BD_DAY, 0, 0, 0, 0);
    return c.getTime();
  }

  function enterBirthdayMode() {
    if (flipped) return;
    flipped = true;
    document.body.classList.add('is-birthday');
    if (banner) banner.hidden = false;
    if (timerTitle) timerTitle.textContent = "It's your day";
    if (timerCapsule) timerCapsule.textContent = 'she has been celebrating since';
    if (countFoot) countFoot.textContent = "and it's only just beginning ✦";
    if (window.__burstConfetti) window.__burstConfetti(160);
    if (window.__launchLanterns) window.__launchLanterns();
  }

  function tick() {
    if (!tD) return;
    var now = new Date();
    var diff;
    if (isBirthdayToday(now)) {
      // her day — celebrate and count up through the day
      enterBirthdayMode();
      diff = now.getTime() - startOfDay(now);
    } else {
      // always count down to the next birthday, so the timer never stops ticking
      diff = nextBirthday(now) - now.getTime();
    }
    var s = Math.floor(diff / 1000);
    tD.textContent = pad(Math.floor(s / 86400));
    tH.textContent = pad(Math.floor((s % 86400) / 3600));
    tM.textContent = pad(Math.floor((s % 3600) / 60));
    tS.textContent = pad(s % 60);
  }
  if (tD) { if (isBirthdayToday(new Date())) enterBirthdayMode(); tick(); setInterval(tick, 1000); }

  /* ---------------- REVEAL ON SCROLL ---------------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !REDUCED) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('seen'); io.unobserve(en.target); }
      });
    }, { threshold: 0.14 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('seen'); });
  }

  /* ---------------- MODAL HELPERS ---------------- */
  var openModal = null;
  function showModal(m) {
    if (!m) return;
    m.hidden = false;
    requestAnimationFrame(function () { m.classList.add('open'); });
    openModal = m;
    document.body.style.overflow = 'hidden';
    var c = m.querySelector('.modal-close');
    if (c) c.focus();
  }
  function hideModal() {
    if (!openModal) return;
    var m = openModal;
    m.classList.remove('open');
    setTimeout(function () { m.hidden = true; }, 320);
    openModal = null;
    document.body.style.overflow = '';
  }
  document.querySelectorAll('.modal').forEach(function (m) {
    on(m, 'click', function (e) { if (e.target === m || e.target.hasAttribute('data-close')) hideModal(); });
  });
  on(document, 'keydown', function (e) { if (e.key === 'Escape') hideModal(); });

  /* ---------------- THREE LITTLE NOTES ---------------- */
  var NOTES = {
    heart: { emoji: '❤', title: 'A note for you', text: 'Some people make the world softer just by being in it. Thank you for being one of them.' },
    flower: { emoji: '🌷', title: 'A bloom for you', text: 'You have a way of making ordinary days feel like something worth remembering. This one\'s for you.' },
    sparkle: { emoji: '✨', title: 'A secret for you', text: 'We brag about you more than you know. You are, and always will be, our favourite person.' }
  };
  document.querySelectorAll('.orb').forEach(function (btn) {
    on(btn, 'click', function () {
      var n = NOTES[btn.getAttribute('data-note')] || NOTES.heart;
      $('noteEmoji').textContent = n.emoji;
      $('noteModalTitle').textContent = n.title;
      $('noteText').textContent = n.text;
      showModal($('noteModal'));
    });
  });

  /* ---------------- LETTER ---------------- */
  on($('openLetter'), 'click', function () { showModal($('letterModal')); });
  on($('envelope'), 'click', function () { showModal($('letterModal')); });
  on($('envelope'), 'keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showModal($('letterModal')); }
  });

  /* ---------------- CANDLES ---------------- */
  var WISHES = [
    'A year of gentle mornings and warm tea ☕',
    'More laughter than you know what to do with 😄',
    'Health, dancing, and beautiful surprises 💃',
    'Every dream you hold, coming true 🌟',
    'And simply… more of you, exactly as you are 💛'
  ];
  var candlesRow = $('candlesRow'), wishReveal = $('wishReveal');
  if (candlesRow) {
    var N = 5, outCount = 0, wishIdx = 0;
    for (var i = 0; i < N; i++) {
      var c = document.createElement('div');
      c.className = 'candle';
      c.setAttribute('role', 'button');
      c.setAttribute('tabindex', '0');
      c.setAttribute('aria-label', 'Blow out candle ' + (i + 1));
      c.innerHTML = '<span class="flame"></span>';
      (function (candle) {
        function blow() {
          if (candle.classList.contains('out')) return;
          candle.classList.add('out');
          outCount++;
          if (wishReveal) wishReveal.textContent = '✦ ' + WISHES[wishIdx % WISHES.length];
          wishIdx++;
          if (window.__burstConfetti) window.__burstConfetti(24, candle);
          if (outCount === N) {
            setTimeout(function () {
              if (wishReveal) wishReveal.textContent = 'All wishes made. Happy birthday, ' + CONFIG.name + '! 🎂';
              if (window.__burstConfetti) window.__burstConfetti(120);
            }, 500);
          }
        }
        on(candle, 'click', blow);
        on(candle, 'keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); blow(); } });
      })(c);
      candlesRow.appendChild(c);
    }
  }

  /* ---------------- SCRATCH-OFF SECRET ---------------- */
  (function () {
    var cv = $('scratch'), wrap = cv ? cv.closest('.scratch-wrap') : null;
    if (!cv || !wrap) return;
    var ctx = cv.getContext('2d');
    var revealed = false, scratching = false, dpr = Math.min(window.devicePixelRatio || 1, 2);

    function size() {
      var r = wrap.getBoundingClientRect();
      cv.width = Math.max(1, Math.floor(r.width * dpr));
      cv.height = Math.max(1, Math.floor(r.height * dpr));
      paintCover();
    }
    function paintCover() {
      var w = cv.width, h = cv.height;
      var g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#c99a52');
      g.addColorStop(.5, '#e3bd74');
      g.addColorStop(1, '#b8863f');
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      // subtle speckle
      ctx.fillStyle = 'rgba(255,255,255,.10)';
      for (var i = 0; i < 260; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 2, 0, 7);
        ctx.fill();
      }
    }
    function pos(e) {
      var r = cv.getBoundingClientRect();
      var p = e.touches ? e.touches[0] : e;
      return { x: (p.clientX - r.left) * dpr, y: (p.clientY - r.top) * dpr };
    }
    function scratchAt(x, y) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,1)'; // fully opaque brush → erases the cover in one pass
      ctx.beginPath();
      ctx.arc(x, y, 26 * dpr, 0, Math.PI * 2);
      ctx.fill();
    }
    function checkReveal() {
      if (revealed) return;
      var data = ctx.getImageData(0, 0, cv.width, cv.height).data;
      var clear = 0, total = 0;
      for (var i = 3; i < data.length; i += 4 * 12) { total++; if (data[i] < 40) clear++; }
      if (total && clear / total > 0.55) {
        revealed = true;
        ctx.clearRect(0, 0, cv.width, cv.height);
        wrap.classList.add('revealed');
        if (window.__burstConfetti) window.__burstConfetti(80);
      }
    }
    function start(e) { scratching = true; var p = pos(e); scratchAt(p.x, p.y); checkReveal(); if (e.cancelable) e.preventDefault(); }
    function move(e) { if (!scratching) return; var p = pos(e); scratchAt(p.x, p.y); checkReveal(); if (e.cancelable) e.preventDefault(); }
    function end() { scratching = false; }

    on(cv, 'mousedown', start); on(cv, 'mousemove', move);
    on(window, 'mouseup', end);
    on(cv, 'touchstart', start, { passive: false });
    on(cv, 'touchmove', move, { passive: false });
    on(cv, 'touchend', end);
    on(window, 'resize', function () { if (!revealed) size(); });
    size();
  })();

  /* ---------------- BACKGROUND MUSIC (Web Audio) ---------------- */
  (function () {
    var btn = $('musicBtn'), label = $('musicLabel');
    if (!btn) return;
    var actx = null, master = null, timer = null, playing = false, nodes = [];
    // gentle looping melody: [freq, beats]
    var MELODY = [
      [523.25, 1], [523.25, 1], [587.33, 1], [523.25, 1], [698.46, 1], [659.25, 1.5],
      [523.25, 1], [523.25, 1], [587.33, 1], [523.25, 1], [783.99, 1], [698.46, 1.5],
      [523.25, 1], [523.25, 1], [1046.5, 1], [880, 1], [698.46, 1], [659.25, 1], [587.33, 1.5],
      [932.33, 1], [932.33, 1], [880, 1], [698.46, 1], [783.99, 1], [698.46, 1.5]
    ];
    var BEAT = 0.42, LOOP = MELODY.reduce(function (a, n) { return a + n[1]; }, 0) * BEAT;

    function schedule(t0) {
      var t = t0;
      MELODY.forEach(function (n) {
        var o = actx.createOscillator(), g = actx.createGain();
        o.type = 'triangle'; o.frequency.value = n[0];
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.16, t + 0.03);
        g.gain.exponentialRampToValueAtTime(0.001, t + n[1] * BEAT * 0.95);
        o.connect(g); g.connect(master);
        o.start(t); o.stop(t + n[1] * BEAT);
        nodes.push(o);
        t += n[1] * BEAT;
      });
    }
    function start() {
      if (!actx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        actx = new AC();
        master = actx.createGain();
        master.gain.value = 0.5;
        master.connect(actx.destination);
      }
      if (actx.state === 'suspended') actx.resume();
      playing = true;
      schedule(actx.currentTime + 0.05);
      timer = setInterval(function () {
        if (!playing) return;
        schedule(actx.currentTime + 0.05);
      }, (LOOP - 0.2) * 1000);
      btn.setAttribute('aria-pressed', 'true');
      if (label) label.textContent = 'playing';
    }
    function stop() {
      playing = false;
      if (timer) { clearInterval(timer); timer = null; }
      nodes.forEach(function (n) { try { n.stop(0); } catch (e) {} });
      nodes = [];
      btn.setAttribute('aria-pressed', 'false');
      if (label) label.textContent = 'music';
    }
    on(btn, 'click', function () { playing ? stop() : start(); });
    // pause when tab hidden
    on(document, 'visibilitychange', function () { if (document.hidden && playing) stop(); });
  })();

  /* ---------------- CONFETTI / PARTICLES ---------------- */
  (function () {
    var cv = $('fxCanvas');
    if (!cv || REDUCED) return;
    var ctx = cv.getContext('2d');
    var parts = [], lanterns = [], dpr = Math.min(window.devicePixelRatio || 1, 2);
    var COLORS = ['#d97a97', '#e9c478', '#a83b64', '#8b5fbf', '#f6cdd6', '#d9a441'];

    function size() { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; }
    size(); on(window, 'resize', size);

    window.__burstConfetti = function (count, originEl) {
      var ox = innerWidth / 2, oy = innerHeight / 3;
      if (originEl) {
        var r = originEl.getBoundingClientRect();
        ox = r.left + r.width / 2; oy = r.top;
      }
      for (var i = 0; i < count; i++) {
        parts.push({
          x: ox, y: oy,
          vx: rand(-4, 4), vy: rand(-9, -2),
          g: rand(0.12, 0.24), life: rand(70, 130),
          size: rand(4, 9), rot: rand(0, 7), vr: rand(-0.2, 0.2),
          color: COLORS[(Math.random() * COLORS.length) | 0]
        });
      }
    };
    window.__launchLanterns = function () {
      for (var i = 0; i < 14; i++) {
        lanterns.push({
          x: rand(0, innerWidth), y: innerHeight + rand(0, 200),
          vy: rand(0.4, 1.1), r: rand(6, 12), a: rand(0.4, 0.9)
        });
      }
    };

    function loop() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.save(); ctx.scale(dpr, dpr);
      // confetti
      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life--;
        if (p.life <= 0 || p.y > innerHeight + 40) { parts.splice(i, 1); continue; }
        ctx.save();
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
      // lanterns
      for (var j = lanterns.length - 1; j >= 0; j--) {
        var l = lanterns[j];
        l.y -= l.vy; l.x += Math.sin(l.y / 40) * 0.4;
        if (l.y < -40) { lanterns.splice(j, 1); continue; }
        var g = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r * 3);
        g.addColorStop(0, 'rgba(233,196,120,' + l.a + ')');
        g.addColorStop(1, 'rgba(233,196,120,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(l.x, l.y, l.r * 3, 0, 7); ctx.fill();
      }
      ctx.restore();
      requestAnimationFrame(loop);
    }
    loop();
  })();

  /* ---------------- SHARE / INSTALL ---------------- */
  var deferredPrompt = null;
  on(window, 'beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    var bar = $('installBar');
    if (bar) bar.hidden = false;
  });
  function tryInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finalize && deferredPrompt.userChoice.finalize();
      deferredPrompt = null;
      var bar = $('installBar'); if (bar) bar.hidden = true;
    } else {
      var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
      alert(isIOS
        ? 'To save: tap the Share button in Safari, then choose "Add to Home Screen". 💛'
        : 'To save: open your browser menu and choose "Install app" or "Add to Home screen". 💛');
    }
  }
  on($('installBtn'), 'click', tryInstall);
  on($('installAdd'), 'click', tryInstall);
  on($('installClose'), 'click', function () { var b = $('installBar'); if (b) b.hidden = true; });

  on($('shareBtn'), 'click', function () {
    var data = { title: 'Happy Birthday to an Amazing Mother 🎉', text: 'A little birthday surprise 💛', url: location.href };
    if (navigator.share) navigator.share(data).catch(function () {});
    else { navigator.clipboard && navigator.clipboard.writeText(location.href); alert('Link copied — share it with anyone who loves Mom! 💛'); }
  });

  /* ---------------- WHATSAPP LINKS ---------------- */
  (function () {
    var base = 'https://wa.me/' + CONFIG.whatsapp;
    var msg = base + '?text=' + encodeURIComponent(CONFIG.waIntro);
    if ($('waBtn')) $('waBtn').href = msg;
  })();

  /* ---------------- HOW MODAL ---------------- */
  on($('howBtn'), 'click', function () { showModal($('howModal')); });

  /* ---------------- SERVICE WORKER ---------------- */
  if ('serviceWorker' in navigator) {
    on(window, 'load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }
})();
