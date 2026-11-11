/* RF School marketing page — markup.
 *
 * One function per block, each returning an HTML string with the same
 * elements and Tailwind classes as the reference page (lingua1k.com/join).
 * Runs in Node (build.js pre-renders the English page for search engines)
 * and in the browser (app.js re-renders on a language change).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.RFSite = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var D = null; // { i18n, icons, flags }
  var LANGS = ['en', 'ar', 'ja', 'zh', 'ru', 'ko'];
  var LOCALES = { en: 'en-US', ar: 'ar-SA', ja: 'ja-JP', zh: 'zh-CN', ru: 'ru-RU', ko: 'ko-KR' };
  var DIAL = [
    ['+966', 'Saudi Arabia'], ['+971', 'UAE'], ['+965', 'Kuwait'], ['+974', 'Qatar'],
    ['+973', 'Bahrain'], ['+968', 'Oman'], ['+20', 'Egypt'], ['+962', 'Jordan'],
    ['+964', 'Iraq'], ['+1', 'USA / Canada'], ['+44', 'UK'], ['+81', 'Japan'],
    ['+86', 'China'], ['+7', 'Russia'], ['+82', 'Korea'], ['+90', 'Turkey'],
    ['+91', 'India'], ['+92', 'Pakistan'], ['+880', 'Bangladesh'], ['+62', 'Indonesia'],
    ['+60', 'Malaysia'], ['+63', 'Philippines'],
  ];
  var PARTNERS = ['National Geographic Learning', 'Cambridge', 'CEFR', 'Oxford', 'IELTS Prep', 'A1 → C2'];
  var HOUR = 3600000;
  // The school's clock (Asia/Riyadh, no daylight saving): UTC+3.
  var SCHOOL_OFFSET = 3 * HOUR;

  function setData(d) { D = d; }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function dirOf(lang) { return lang === 'ar' ? 'rtl' : 'ltr'; }

  /** Text of [key] in [lang] (English when a language lacks it), escaped. */
  function t(lang, key) {
    var e = D.i18n[key];
    return esc(e[lang] != null ? e[lang] : e.en);
  }

  function tv(lang, entry) { return esc(entry[lang] != null ? entry[lang] : entry.en); }

  /** A lucide icon as inline SVG. */
  function icon(name, cls) {
    var shapes = D.icons[name].map(function (p) {
      var a = '';
      for (var k in p[1]) a += ' ' + k + '="' + esc(p[1][k]) + '"';
      return '<' + p[0] + a + '></' + p[0] + '>';
    }).join('');
    return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ' +
      'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
      'stroke-linejoin="round" class="lucide ' + cls + '" aria-hidden="true">' + shapes + '</svg>';
  }

  function flag(lang, cls) {
    return D.flags[lang].replace('<svg ', '<svg class="' + cls + '" aria-hidden="true" ');
  }

  // -------------------------------------------------------------------------
  // Decorative background
  // -------------------------------------------------------------------------
  function waves() {
    var a = '', b = '', s;
    for (s = 0; s < 14; s++) {
      a += '<path d="M -100 ' + (s * 45 - 120) + ' C 400 ' + (s * 45 + 140) + ', 900 ' +
        (s * 45 - 260) + ', 1700 ' + (s * 45 + 80) + '" stroke="currentColor" stroke-width="1.2" opacity="' +
        (0.35 + (s % 4) * 0.15) + '"></path>';
    }
    for (s = 0; s < 10; s++) {
      b += '<path d="M -100 ' + (s * 80 + 200) + ' C 500 ' + (s * 80 - 60) + ', 1100 ' +
        (s * 80 + 220) + ', 1700 ' + (s * 80 + 40) + '" stroke="currentColor" stroke-width="1"></path>';
    }
    return '<div aria-hidden="true" class="pointer-events-none fixed inset-0 overflow-hidden">' +
      '<div class="wave-layer absolute inset-0"><svg class="absolute inset-x-0 top-1/4 h-[120%] w-[200%] -translate-x-1/4 text-primary/10 rtl:translate-x-1/4" viewBox="0 0 1600 900" preserveAspectRatio="none" fill="none">' + a + '</svg></div>' +
      '<div class="wave-layer slow absolute inset-0"><svg class="absolute inset-x-0 bottom-0 h-[60%] w-[200%] translate-x-1/4 text-primary/[0.07] rtl:-translate-x-1/4" viewBox="0 0 1600 900" preserveAspectRatio="none" fill="none">' + b + '</svg></div>' +
      '</div>';
  }

  // -------------------------------------------------------------------------
  // Language flags
  // -------------------------------------------------------------------------
  function languageBar(lang) {
    var h = '<div class="mb-4 flex items-center justify-center gap-3 overflow-x-auto rounded-xl border border-border bg-secondary px-3 py-2" dir="ltr">';
    LANGS.forEach(function (code) {
      h += '<button type="button" data-lang="' + code + '" title="' + code.toUpperCase() + '" aria-label="' +
        code.toUpperCase() + '" aria-pressed="' + (lang === code) + '" class="shrink-0 rounded-lg p-1 transition-all ' +
        (lang === code ? 'scale-110 ring-2 ring-primary' : 'opacity-60 hover:opacity-100 hover:scale-105') + '">' +
        flag(code, 'h-5 w-7 rounded-sm') + '</button>';
    });
    // Light / dark switch (in the reference it sits in the side menu). Both
    // icons are in the page; the style sheet shows the one that applies.
    h += '<span aria-hidden="true" class="h-5 w-px shrink-0 bg-border"></span>' +
      '<button type="button" id="rf-theme" data-dark="' + t(lang, 'darkMode') + '" data-light="' + t(lang, 'lightMode') +
      '" title="' + t(lang, 'darkMode') + '" aria-label="' + t(lang, 'darkMode') +
      '" class="rf-theme shrink-0 rounded-lg p-1 text-foreground transition-all opacity-60 hover:opacity-100 hover:scale-105">' +
      icon('Moon', 'rf-i-moon size-5') + icon('Sun', 'rf-i-sun size-5') + '</button>';
    return h + '</div>';
  }

  // -------------------------------------------------------------------------
  // Hero
  // -------------------------------------------------------------------------
  function hero(lang) {
    var rtl = dirOf(lang) === 'rtl';
    var pills = [['Headphones', 'aiListening'], ['MessageCircle', 'aiSpeaking'], ['BookOpen', 'aiGrammar'], ['Layers', 'aiSentences']];
    var h = '<header class="relative overflow-hidden rounded-3xl shadow-primary"><div class="grid md:grid-cols-2">';
    h += '<div class="relative flex min-h-56 items-center justify-center overflow-hidden gradient-hero p-8 text-primary-foreground ' +
      (rtl ? 'md:[clip-path:polygon(14%_0,100%_0,100%_100%,0_100%)]' : 'md:[clip-path:polygon(0_0,100%_0,86%_100%,0_100%)]') + '">' +
      '<div aria-hidden="true" class="pointer-events-none absolute -bottom-16 -start-10 size-56 rounded-full border-[18px] border-white/10"></div>' +
      '<div aria-hidden="true" class="pointer-events-none absolute -top-20 -end-14 size-64 rounded-full border-[22px] border-white/10"></div>' +
      '<div aria-hidden="true" class="pointer-events-none absolute bottom-6 end-10 size-24 rounded-full border-[12px] border-white/15"></div>' +
      '<div class="rf-pop relative z-10 flex size-44 items-center justify-center overflow-hidden rounded-full bg-background text-center shadow-elevated ring-8 ring-white/10 md:size-56">' +
      '<img src="/assets/rf-school-logo.jpg" alt="RF School — Real Fluency" width="224" height="224" class="h-full w-full object-contain p-3"></div></div>';
    h += '<div class="relative bg-card p-7 text-center md:p-9 md:text-start">' +
      '<div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[repeating-linear-gradient(115deg,transparent,transparent_14px,hsl(var(--primary)/0.05)_14px,hsl(var(--primary)/0.05)_15px)]"></div>' +
      '<div class="rf-rise relative z-10">' +
      '<h1 class="mb-1 text-3xl font-extrabold leading-tight text-primary md:text-4xl">' + t(lang, 'heroTitle') + '</h1>' +
      '<p class="mb-3 text-lg font-bold text-foreground/70">' + t(lang, 'brand') + '</p>' +
      '<p class="mx-auto mb-5 max-w-md text-sm leading-relaxed text-muted-foreground md:mx-0">' + t(lang, 'heroSub') + '</p>' +
      '<div class="mb-5 grid grid-cols-4 divide-x divide-border rounded-2xl border border-border bg-background/60 py-3 rtl:divide-x-reverse">';
    pills.forEach(function (p) {
      h += '<a href="#ai" class="flex flex-col items-center gap-1.5 px-1 transition-transform hover:scale-105">' +
        icon(p[0], 'size-5 text-primary') +
        '<span class="text-[10px] font-bold text-foreground/80">' + t(lang, p[1]) + '</span></a>';
    });
    h += '</div><div class="flex flex-col items-center gap-2">' +
      '<a href="#book" class="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-primary transition-transform hover:scale-105">' +
      icon('CalendarCheck', 'size-4') + t(lang, 'ctaBook') + '</a>' +
      '<a href="#book" class="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-transform hover:scale-105" style="background:hsl(var(--rf-magenta));color:hsl(var(--accent-foreground))">' +
      icon('BadgeDollarSign', 'size-4') + t(lang, 'ctaPrivate') + '</a>' +
      '</div></div></div></div></header>';
    return h;
  }

  function marquee() {
    var group = '<div class="flex items-center gap-8">';
    PARTNERS.forEach(function (name) {
      group += '<span class="flex items-center gap-2 whitespace-nowrap text-xs font-bold text-muted-foreground">' +
        icon('Award', 'size-4 text-amber') + esc(name) + '</span>';
    });
    group += '</div>';
    return '<div class="mt-4 overflow-hidden rounded-2xl border border-border bg-card py-3" dir="ltr">' +
      '<div class="rf-marquee flex w-max items-center gap-8 px-4">' + group + group + '</div></div>';
  }

  // -------------------------------------------------------------------------
  // "Your journey" (curricula, levels, AI programmes)
  // -------------------------------------------------------------------------
  function reveal(y, duration, delay, extra) {
    return 'class="rf-reveal ' + extra + '" style="--ry:' + y + 'px;--rd:' + duration + 's;--rdl:' + delay + 's"';
  }

  function journey(lang) {
    var rtl = dirOf(lang) === 'rtl';
    var tag = 'rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold text-muted-foreground';
    var levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    var ai = [
      ['Headphones', 'aiListening', 'aiListeningDesc', 'bg-accent/15', 'text-accent'],
      ['MessageCircle', 'aiSpeaking', 'aiSpeakingDesc', 'bg-primary/15', 'text-primary'],
      ['BookOpen', 'aiGrammar', 'aiGrammarDesc', 'bg-amber/15', 'text-amber'],
      ['Layers', 'aiSentences', 'aiSentencesDesc', 'bg-primary/15', 'text-primary'],
    ];
    var h = '<section class="mt-8" aria-label="Marketing">';
    h += '<div ' + reveal(16, 0.5, 0, 'mb-6 text-center') + ' data-margin="1">' +
      '<span class="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">' +
      icon('Sparkles', 'size-3.5') + t(lang, 'brand') + '</span>' +
      '<h2 class="mt-2 text-2xl font-extrabold leading-tight text-foreground md:text-3xl">' + t(lang, 'journeyTitle') + '</h2>' +
      '<p class="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">' + t(lang, 'journeySub') + '</p></div>';

    h += '<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">';
    h += '<div ' + reveal(20, 0.45, 0.05, 'rounded-2xl border border-border bg-card p-5 shadow-card') + ' data-margin="1">' +
      '<div class="mb-3 flex size-12 items-center justify-center rounded-2xl bg-amber/15">' + icon('Earth', 'size-6 text-amber') + '</div>' +
      '<h3 class="text-base font-bold text-foreground">' + t(lang, 'curriculumTitle') + '</h3>' +
      '<p class="mt-2 text-xs leading-relaxed text-muted-foreground">' + t(lang, 'curriculumDesc') + '</p>' +
      '<div class="mt-4 flex flex-wrap gap-2">' +
      '<span class="' + tag + '">National Geographic</span><span class="' + tag + '">Cambridge</span><span class="' + tag + '">CEFR</span>' +
      '</div></div>';
    h += '<div ' + reveal(20, 0.45, 0.1, 'rounded-2xl border border-border bg-card p-5 shadow-card') + ' data-margin="1">' +
      '<div class="mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/15">' + icon('TrendingUp', 'size-6 text-primary') + '</div>' +
      '<h3 class="text-base font-bold text-foreground">' + t(lang, 'levelsTitle') + '</h3>' +
      '<p class="mt-2 text-xs leading-relaxed text-muted-foreground">' + t(lang, 'levelsDesc') + '</p>' +
      '<div class="mt-4 flex items-center gap-1.5">';
    levels.forEach(function (lv, i) {
      h += '<div class="flex flex-1 items-center gap-1.5"><span class="flex h-6 flex-1 items-center justify-center rounded-md bg-primary/10 text-[10px] font-bold text-primary">' + lv + '</span>' +
        (i < 5 ? '<div class="h-0.5 w-2 bg-primary/20"></div>' : '') + '</div>';
    });
    h += '</div></div></div>';

    h += '<div id="ai" ' + reveal(20, 0.45, 0.15, 'mt-6 scroll-mt-4 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/8 to-accent/8 p-5') + ' data-margin="1">' +
      '<div class="mb-4 flex items-center gap-3"><div class="flex size-12 items-center justify-center rounded-2xl bg-primary/15">' + icon('Brain', 'size-6 text-primary') + '</div>' +
      '<div><h3 class="text-lg font-bold text-foreground">' + t(lang, 'aiTitle') + '</h3>' +
      '<p class="text-xs text-muted-foreground">' + t(lang, 'aiSub') + '</p></div></div>' +
      '<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">';
    ai.forEach(function (c, i) {
      h += '<div class="rf-reveal rf-lift rounded-2xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-elevated" style="--ry:0px;--rs:.96;--rd:.35s;--rdl:' + (0.2 + i * 0.07).toFixed(2) + 's">' +
        '<div class="mb-2 flex size-10 items-center justify-center rounded-xl ' + c[3] + '">' + icon(c[0], 'size-5 ' + c[4]) + '</div>' +
        '<p class="text-sm font-bold text-foreground">' + t(lang, c[1]) + '</p>' +
        '<p class="mt-1 text-xs leading-relaxed text-muted-foreground">' + t(lang, c[2]) + '</p></div>';
    });
    h += '</div></div>';

    h += '<div ' + reveal(12, 0.4, 0.4, 'mt-6 text-center') + '>' +
      '<a href="#book" class="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-primary transition-transform hover:scale-105">' +
      t(lang, 'ctaStart') + icon(rtl ? 'ArrowLeft' : 'ArrowRight', 'size-4') + '</a></div>';
    return h + '</section>';
  }

  // -------------------------------------------------------------------------
  // "Why our school"
  // -------------------------------------------------------------------------
  function features(lang) {
    var list = [['Smartphone', 'f1'], ['GraduationCap', 'f2'], ['Sparkles', 'f3'], ['Users', 'f4'],
      ['CalendarCheck', 'f5'], ['Baby', 'f6'], ['CalendarDays', 'f7']];
    var h = '<section class="mt-8"><h2 class="mb-3 text-lg font-bold text-foreground">' + t(lang, 'featuresTitle') + '</h2>' +
      '<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">';
    list.forEach(function (f) {
      h += '<div class="rounded-2xl border border-border bg-card p-4 shadow-card">' +
        '<div class="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary/15">' + icon(f[0], 'size-5 text-primary') + '</div>' +
        '<p class="text-sm font-bold text-foreground">' + t(lang, f[1] + 't') + '</p>' +
        '<p class="mt-1 text-xs leading-relaxed text-muted-foreground">' + t(lang, f[1] + 'd') + '</p></div>';
    });
    return h + '</div></section>';
  }

  // -------------------------------------------------------------------------
  // Booking form
  // -------------------------------------------------------------------------
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /** The next seven days of the visitor's calendar, as the day chips show them. */
  function days(lang, now) {
    var loc = LOCALES[lang] || 'en-US', out = [];
    for (var i = 0; i < 7; i++) {
      var d = new Date(now.getTime());
      d.setDate(d.getDate() + i);
      out.push({
        i: i,
        // Gregorian everywhere: some browsers default Arabic (Saudi) to Hijri.
        weekday: d.toLocaleDateString(loc, { weekday: 'short', calendar: 'gregory' }),
        num: d.toLocaleDateString(loc, { day: 'numeric', month: 'short', calendar: 'gregory' }),
      });
    }
    return out;
  }

  /**
   * The 24 class times of day [dayIndex] (0 = today) in the visitor's own
   * clock. Every time is a whole hour of the school's clock; whether it is
   * offered and how many seats remain come from [avail]
   * (`placement_public_availability`), null while it loads.
   */
  function slotsOf(dayIndex, avail, now) {
    var start = new Date(now.getTime());
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() + dayIndex);
    var end = new Date(start.getTime());
    end.setDate(end.getDate() + 1);
    var first = Math.ceil(start.getTime() / HOUR) * HOUR;
    var offered = {}, taken = {};
    if (avail) {
      avail.slots.forEach(function (s) { offered[s.weekday + '-' + s.hour] = s.seats; });
      avail.taken.forEach(function (x) { taken[new Date(x.at).getTime()] = x.n; });
    }
    var out = [];
    for (var at = first; at < end.getTime(); at += HOUR) {
      var local = new Date(at);
      var school = new Date(at + SCHOOL_OFFSET);
      var seats = offered[school.getUTCDay() + '-' + school.getUTCHours()] || 0;
      var remaining = Math.max(0, seats - (taken[at] || 0));
      out.push({
        at: at,
        time: pad(local.getHours()) + ':' + pad(local.getMinutes()),
        remaining: remaining,
        // Ten minutes ahead at least, so the booking is still valid on arrival.
        available: remaining > 0 && at > now.getTime() + 10 * 60000,
      });
    }
    return out;
  }

  function dayChips(lang, state, now) {
    return days(lang, now).map(function (d) {
      return '<button type="button" data-day="' + d.i + '" class="shrink-0 rounded-2xl border px-3 py-2 text-center transition-colors ' +
        (state.day === d.i ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-foreground') + '">' +
        '<span class="block text-[11px] font-bold">' + esc(d.weekday) + '</span>' +
        '<span class="block text-[11px] opacity-80">' + esc(d.num) + '</span></button>';
    }).join('');
  }

  function slotGrid(lang, state, now) {
    var loading = !state.avail;
    return slotsOf(state.day, state.avail, now).map(function (s) {
      var selected = state.slot === s.at;
      var full = !s.available;
      var cls = selected ? 'border-primary bg-primary text-primary-foreground'
        : loading ? 'border-border bg-card text-foreground'
          : full ? 'border-destructive/30 bg-destructive/10 text-destructive'
            : 'border-border bg-card text-foreground hover:border-primary/50';
      var note = loading ? '…' : full ? t(lang, 'full') : t(lang, 'seatsLeft').replace('{n}', String(s.remaining));
      var noteCls = selected ? 'text-primary-foreground/80' : loading ? 'text-muted-foreground' : full ? 'text-destructive' : 'text-emerald-600';
      return '<button type="button" data-slot="' + s.at + '"' + (full || loading ? ' disabled' : '') + ' dir="ltr" ' +
        'class="relative rounded-xl border px-2 py-2 text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ' + cls + '">' +
        '<span>' + s.time + '</span><span class="block text-[9px] font-extrabold ' + noteCls + '">' + note + '</span></button>';
    }).join('');
  }

  function emailValid(email) {
    var r = String(email || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(r)) return false;
    var p = r.split('@'), s = p[0], n = p[1];
    return !(!s || !n || s.length > 64 || n.length > 253 || s.charAt(0) === '.' || s.slice(-1) === '.' ||
      s.indexOf('..') >= 0 || n.charAt(0) === '.' || n.slice(-1) === '.' || n.indexOf('..') >= 0);
  }

  function phoneValid(phone) { return String(phone || '').replace(/\D/g, '').length >= 7; }

  function fullPhone(state) {
    var digits = String(state.phone || '').replace(/\D/g, '');
    return digits ? state.dial + ' ' + digits : '';
  }

  function canSubmit(state) {
    return !!state.slot && !!String(state.name || '').trim() && emailValid(state.email) &&
      phoneValid(state.phone) && !state.sending;
  }

  function booking(lang, state, now) {
    var input = 'rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary';
    var h = '<section id="book" class="mt-8 rounded-3xl border border-amber/30 bg-gradient-to-br from-amber/15 to-primary/10 p-5">' +
      '<h2 class="text-lg font-bold text-foreground">' + t(lang, 'bookTitle') + '</h2>' +
      '<p class="mt-1 text-xs leading-relaxed text-muted-foreground">' + t(lang, 'bookSub') + '</p>';
    if (state.done) {
      h += '<div class="mt-5 rounded-2xl border border-accent/30 bg-accent/10 p-5 text-foreground" id="rf-done">' +
        '<div class="mb-3 flex items-center gap-2">' + icon('CircleCheck', 'size-6 text-accent') +
        '<h3 class="text-base font-bold">' + t(lang, 'confirmTitle') + '</h3></div>' +
        '<p class="mb-4 text-sm leading-relaxed text-muted-foreground">' + t(lang, 'done') + '</p>' +
        '<div class="space-y-2 rounded-xl bg-card p-3 text-sm">' +
        '<div class="flex items-center justify-between gap-2"><span class="text-muted-foreground">' + t(lang, 'confirmEmailLabel') + '</span>' +
        '<span class="font-medium" dir="ltr">' + esc(String(state.email).trim()) + '</span></div>' +
        '<div class="flex items-center justify-between gap-2"><span class="text-muted-foreground">' + t(lang, 'confirmPhoneLabel') + '</span>' +
        '<span class="font-medium" dir="ltr">' + esc(fullPhone(state)) + '</span></div></div>' +
        '<p class="mt-4 text-xs leading-relaxed text-muted-foreground">' + t(lang, 'confirmNote') + '</p></div>';
      return h + '</section>';
    }
    var badEmail = String(state.email || '').length > 0 && !emailValid(state.email);
    h += '<p class="mb-2 mt-5 text-xs font-bold text-foreground">' + t(lang, 'pickDay') + '</p>' +
      '<div class="flex gap-2 overflow-x-auto pb-1" id="rf-days">' + dayChips(lang, state, now) + '</div>' +
      '<p class="mb-2 mt-4 text-xs font-bold text-foreground">' + t(lang, 'pickTime') + '</p>' +
      '<div class="grid grid-cols-3 gap-2 sm:grid-cols-4" id="rf-slots">' + slotGrid(lang, state, now) + '</div>' +
      '<p id="rf-slot-error" role="alert" class="mt-2 rounded-xl bg-destructive/10 p-2 text-center text-[11px] font-bold text-destructive"' +
      (state.slotError ? '' : ' hidden') + '>' + esc(state.slotError || '') + '</p>' +
      '<div class="mt-4 grid gap-2">' +
      '<input data-f="name" value="' + esc(state.name) + '" placeholder="' + t(lang, 'namePh') + '" aria-label="' + t(lang, 'namePh') + '" maxlength="100" autocomplete="name" class="' + input + '">' +
      '<input data-f="email" type="email" value="' + esc(state.email) + '" placeholder="' + t(lang, 'emailPh') + '" aria-label="' + t(lang, 'emailPh') + '" maxlength="255" autocomplete="email" aria-invalid="' + badEmail + '" class="rounded-xl border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary ' + (badEmail ? 'border-destructive' : 'border-border') + '">' +
      '<p id="rf-email-error" class="text-[11px] font-bold text-destructive"' + (badEmail ? '' : ' hidden') + '>' + t(lang, 'invalidEmail') + '</p>' +
      '<div class="flex gap-2" dir="ltr">' +
      '<select data-f="dial" aria-label="' + t(lang, 'countryCode') + '" class="shrink-0 rounded-xl border border-border bg-card px-2 py-2 text-sm text-foreground outline-none focus:border-primary">';
    DIAL.forEach(function (d) {
      h += '<option value="' + d[0] + '"' + (state.dial === d[0] ? ' selected' : '') + '>' + d[0] + ' ' + d[1] + '</option>';
    });
    h += '</select>' +
      '<input data-f="phone" type="tel" value="' + esc(state.phone) + '" placeholder="' + t(lang, 'phonePh') + '" aria-label="' + t(lang, 'phonePh') + '" maxlength="20" autocomplete="tel-national" class="min-w-0 flex-1 ' + input + '">' +
      '</div></div>' +
      '<p class="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">' +
      '<span class="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">i</span>' +
      t(lang, 'linkDeliveryNote') + '</p>' +
      '<p id="rf-form-error" role="alert" class="mt-3 rounded-xl bg-destructive/10 p-2 text-center text-[11px] font-bold text-destructive"' +
      (state.formError ? '' : ' hidden') + '>' + esc(state.formError || '') + '</p>' +
      '<button type="button" id="rf-confirm"' + (canSubmit(state) ? '' : ' disabled') +
      ' class="mt-4 w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground shadow-primary disabled:opacity-50">' +
      t(lang, 'confirm') + '</button>';
    return h + '</section>';
  }

  // -------------------------------------------------------------------------
  // About, how we work, contact, download
  // -------------------------------------------------------------------------
  function about(lang) {
    return '<section class="mt-8 rounded-2xl border border-border bg-card p-5">' +
      '<h2 class="mb-2 text-lg font-bold text-foreground">' + t(lang, 'aboutTitle') + '</h2>' +
      '<p class="text-sm leading-relaxed text-muted-foreground">' + t(lang, 'aboutBody') + '</p></section>';
  }

  function howWeWork(lang) {
    var h = '<section class="mt-8 rounded-2xl border border-border bg-card p-5"><div class="mb-4 text-center">' +
      '<h2 class="text-lg font-bold text-foreground">' + t(lang, 'howWorkTitle') + '</h2>' +
      '<p class="mt-1 text-xs leading-relaxed text-muted-foreground">' + t(lang, 'howWorkSub') + '</p></div>' +
      '<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">';
    D.i18n.howWorkSteps.forEach(function (s, i) {
      h += '<div class="relative rounded-xl border border-border bg-background/60 p-4 transition hover:-translate-y-0.5 hover:shadow-md">' +
        '<span class="absolute start-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-emerald-500 text-[10px] font-bold text-white">' + (i + 1) + '</span>' +
        '<div class="mb-2 mt-5 inline-flex rounded-xl bg-gradient-to-br from-purple-500/15 to-emerald-500/15 p-2.5 text-primary">' + icon(s.icon, 'size-5') + '</div>' +
        '<div class="text-sm font-bold leading-snug text-foreground">' + tv(lang, s.title) + '</div>' +
        '<p class="mt-1 text-xs leading-relaxed text-muted-foreground">' + tv(lang, s.desc) + '</p></div>';
    });
    return h + '</div></section>';
  }

  function tel(phone) { return 'tel:' + String(phone).replace(/\s/g, ''); }

  function contact(lang, cfg) {
    var social = [['Instagram', 'Instagram', cfg.social.instagram], ['Facebook', 'Facebook', cfg.social.facebook],
      ['Music2', 'TikTok', cfg.social.tiktok]];
    var h = '<section class="mt-6 rounded-2xl border border-border bg-card p-5">' +
      '<h2 class="mb-3 text-lg font-bold text-foreground">' + t(lang, 'contactTitle') + '</h2>' +
      '<div class="space-y-2 text-sm">' +
      '<a href="mailto:' + esc(cfg.email) + '" class="flex items-center gap-2 text-foreground hover:text-primary" dir="ltr">' + icon('Mail', 'size-4 text-primary') + ' ' + esc(cfg.email) + '</a>' +
      '<a href="' + esc(tel(cfg.phone)) + '" class="flex items-center gap-2 text-foreground hover:text-primary" dir="ltr">' + icon('Phone', 'size-4 text-primary') + ' ' + esc(cfg.phone) + '</a>' +
      '</div><div class="mt-4 flex gap-2">';
    social.forEach(function (s) {
      if (!s[2]) return;
      h += '<a href="' + esc(s[2]) + '" target="_blank" rel="noreferrer" aria-label="' + s[1] + '" class="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary transition-colors hover:bg-primary hover:text-primary-foreground">' + icon(s[0], 'size-5') + '</a>';
    });
    return h + '</div></section>';
  }

  function download(lang, cfg) {
    return '<section class="mt-6 rounded-3xl border border-border bg-card p-5 text-center shadow-card">' +
      '<div class="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary/15">' + icon('Download', 'size-6 text-primary') + '</div>' +
      '<h2 class="text-lg font-bold text-foreground">' + t(lang, 'downloadTitle') + '</h2>' +
      '<p class="mx-auto mt-1 max-w-md text-xs leading-relaxed text-muted-foreground">' + t(lang, 'downloadSub') + '</p>' +
      '<div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">' +
      '<a href="' + esc(cfg.stores.ios) + '" target="_blank" rel="noreferrer" class="flex items-center justify-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-sm font-bold text-background transition-colors hover:bg-foreground/90">' + icon('Apple', 'size-5') + t(lang, 'iOS') + '</a>' +
      '<a href="' + esc(cfg.stores.android) + '" target="_blank" rel="noreferrer" class="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90">' + icon('Smartphone', 'size-5') + t(lang, 'android') + '</a>' +
      '<a href="' + esc(cfg.stores.windows) + '" target="_blank" rel="noreferrer" class="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground transition-colors hover:bg-muted">' + icon('Monitor', 'size-5') + t(lang, 'windows') + '</a>' +
      '</div></section>';
  }

  // -------------------------------------------------------------------------
  // Floating quick-contact button
  // -------------------------------------------------------------------------
  function fab(lang, cfg, open) {
    var rtl = dirOf(lang) === 'rtl';
    var h = '<div id="rf-fab" class="fixed bottom-6 z-40 flex flex-col items-center gap-3 ' + (rtl ? 'left-6' : 'right-6') + '">';
    if (open) {
      h += '<div class="rf-fab-menu flex flex-col gap-2">' +
        '<a href="https://wa.me/' + esc(String(cfg.whatsapp || cfg.phone).replace(/\D/g, '')) + '" target="_blank" rel="noreferrer" aria-label="' + t(lang, 'whatsapp') + '" class="flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-transform hover:scale-105">' + icon('MessageCircle', 'size-4') + t(lang, 'whatsapp') + '</a>' +
        '<a href="' + esc(tel(cfg.phone)) + '" aria-label="' + t(lang, 'call') + '" class="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105">' + icon('Phone', 'size-4') + t(lang, 'call') + '</a></div>';
    }
    h += '<button type="button" id="rf-fab-toggle" aria-label="' + t(lang, 'quickContact') + '" aria-expanded="' + !!open + '" class="flex size-14 items-center justify-center rounded-full shadow-xl transition-all hover:scale-105 ' +
      (open ? 'bg-destructive text-destructive-foreground rotate-45' : 'bg-gradient-to-br from-purple-500 to-emerald-500 text-white') + '">' +
      icon('MessageCircle', 'size-7') + '</button></div>';
    return h;
  }

  // -------------------------------------------------------------------------
  // Whole page
  // -------------------------------------------------------------------------
  function initialState() {
    return { day: 0, slot: null, name: '', email: '', phone: '', dial: '+966', done: false,
      sending: false, slotError: '', formError: '', avail: null, fabOpen: false };
  }

  function page(lang, cfg, state, now) {
    return '<div dir="' + dirOf(lang) + '" class="relative min-h-screen bg-background">' + waves() +
      '<div class="relative mx-auto w-full max-w-3xl px-4 pb-16 pt-4">' +
      languageBar(lang) + hero(lang) + marquee() + journey(lang) + features(lang) +
      booking(lang, state, now) + about(lang) + howWeWork(lang) + contact(lang, cfg) + download(lang, cfg) +
      '</div>' + fab(lang, cfg, state.fabOpen) + '</div>';
  }

  return {
    LANGS: LANGS, setData: setData, dirOf: dirOf, t: t, page: page, booking: booking,
    dayChips: dayChips, slotGrid: slotGrid, slotsOf: slotsOf, fab: fab,
    emailValid: emailValid, phoneValid: phoneValid, fullPhone: fullPhone,
    canSubmit: canSubmit, initialState: initialState,
  };
});
