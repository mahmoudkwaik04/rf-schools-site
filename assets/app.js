/* RF School marketing page — behaviour.
 *
 * Language switch (six languages, Arabic right-to-left), the free level-test
 * booking form (real seats from the school's database), the quick-contact
 * button and the reveal-on-scroll animations.
 */
(function () {
  'use strict';

  var S = window.RFSite, DATA = window.RF_DATA, CFG = window.RF_CONFIG;
  var root = document.getElementById('rf-root');
  if (!S || !DATA || !CFG || !root) return;
  S.setData(DATA);

  // Same keys as the app, so the choice follows the visitor.
  var LANG_KEY = 'pro-english-lang', CHOSEN_KEY = 'pro-english-lang-chosen';
  var state = S.initialState();
  var lang = startLanguage();
  var observer = null;

  function startLanguage() {
    try {
      var saved = localStorage.getItem(LANG_KEY);
      if (saved && S.LANGS.indexOf(saved) >= 0) return saved;
    } catch (e) { /* private mode */ }
    var list = navigator.languages || [navigator.language || 'en'];
    for (var i = 0; i < list.length; i++) {
      var code = String(list[i]).slice(0, 2).toLowerCase();
      if (S.LANGS.indexOf(code) >= 0) return code;
    }
    return 'en';
  }

  // ---------------------------------------------------------------------
  // Light / dark (same storage key and default as the reference: the saved
  // choice, otherwise the device's setting). The class is put on <html> by
  // a script in the page head, before the first paint.
  // ---------------------------------------------------------------------
  var THEME_KEY = 'pro-english-theme';

  function isDark() { return document.documentElement.classList.contains('dark'); }

  function syncTheme() {
    var dark = isDark();
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#120D1C' : '#6034B0');
    var button = document.getElementById('rf-theme');
    if (!button) return;
    // The button names what a press switches to.
    var label = button.getAttribute(dark ? 'data-light' : 'data-dark');
    button.title = label;
    button.setAttribute('aria-label', label);
    button.setAttribute('aria-pressed', String(dark));
  }

  function toggleTheme() {
    var dark = !isDark();
    document.documentElement.classList.toggle('dark', dark);
    try { localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light'); } catch (e) { /* private mode */ }
    syncTheme();
  }

  function raw(key) {
    var e = DATA.i18n[key];
    return e[lang] != null ? e[lang] : e.en;
  }

  // ---------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------
  function renderAll(animateIn) {
    document.documentElement.lang = lang;
    document.documentElement.dir = S.dirOf(lang);
    // No entrance animation when only the language changes.
    root.classList.toggle('rf-static', !animateIn);
    root.innerHTML = S.page(lang, CFG, state, new Date());
    syncTheme();
    watchReveals(animateIn);
  }

  function renderBooking() {
    var el = document.getElementById('book');
    if (!el) return;
    var box = document.createElement('div');
    box.innerHTML = S.booking(lang, state, new Date());
    el.replaceWith(box.firstChild);
  }

  function renderDays() {
    var el = document.getElementById('rf-days');
    if (el) el.innerHTML = S.dayChips(lang, state, new Date());
  }

  function renderSlots() {
    var el = document.getElementById('rf-slots');
    if (el) el.innerHTML = S.slotGrid(lang, state, new Date());
  }

  function renderFab() {
    var el = document.getElementById('rf-fab');
    if (!el) return;
    var box = document.createElement('div');
    box.innerHTML = S.fab(lang, CFG, state.fabOpen);
    el.replaceWith(box.firstChild);
  }

  function showError(id, message) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = message || '';
    el.hidden = !message;
  }

  /** Email hint and the confirm button follow the fields as they change. */
  function syncForm() {
    var bad = state.email.length > 0 && !S.emailValid(state.email);
    var email = root.querySelector('[data-f="email"]');
    if (email) {
      email.setAttribute('aria-invalid', String(bad));
      email.classList.toggle('border-destructive', bad);
      email.classList.toggle('border-border', !bad);
    }
    var hint = document.getElementById('rf-email-error');
    if (hint) hint.hidden = !bad;
    var button = document.getElementById('rf-confirm');
    if (button) button.disabled = !S.canSubmit(state);
  }

  // ---------------------------------------------------------------------
  // Reveal on scroll (the reference's "whileInView" animations)
  // ---------------------------------------------------------------------
  function settle(el) {
    el.classList.add('in');
    var cs = getComputedStyle(el);
    var ms = (parseFloat(cs.getPropertyValue('--rd')) || 0.5) * 1000 +
      (parseFloat(cs.getPropertyValue('--rdl')) || 0) * 1000;
    setTimeout(function () { el.classList.add('done'); }, ms + 60);
  }

  function watchReveals(animateIn) {
    if (observer) observer.disconnect();
    var items = root.querySelectorAll('.rf-reveal');
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!animateIn || reduce || !('IntersectionObserver' in window)) {
      // A language switch redraws the page: nothing fades in a second time.
      for (var i = 0; i < items.length; i++) items[i].classList.add('in', 'done', 'rf-instant');
      return;
    }
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        observer.unobserve(en.target);
        settle(en.target);
      });
    }, { rootMargin: '0px 0px -60px 0px' });
    for (var j = 0; j < items.length; j++) observer.observe(items[j]);
  }

  // ---------------------------------------------------------------------
  // Booking: seats come from the school's database
  // ---------------------------------------------------------------------
  function rpc(name, body) {
    return fetch(CFG.supabaseUrl + '/rest/v1/rpc/' + name, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: CFG.supabaseKey,
        Authorization: 'Bearer ' + CFG.supabaseKey,
      },
      body: JSON.stringify(body || {}),
    }).then(function (r) {
      if (!r.ok) throw new Error('http ' + r.status);
      return r.json();
    });
  }

  var retry = 0;
  function loadAvailability() {
    return rpc('placement_public_availability').then(function (a) {
      retry = 0;
      state.avail = { slots: a.slots || [], taken: a.taken || [] };
      // A chosen time that filled meanwhile is released.
      if (state.slot) {
        var still = S.slotsOf(state.day, state.avail, new Date()).some(function (s) {
          return s.at === state.slot && s.available;
        });
        if (!still) state.slot = null;
      }
      renderSlots();
      syncForm();
    }).catch(function () {
      if (!state.avail) showError('rf-slot-error', raw('loadError'));
      if (retry++ < 5) setTimeout(function () { loadAvailability().then(clearLoadError); }, 4000 * retry);
    });
  }

  function clearLoadError() {
    if (state.avail && !state.slotError) showError('rf-slot-error', '');
  }

  function submit() {
    if (!S.canSubmit(state)) return;
    state.formError = '';
    state.slotError = '';
    showError('rf-form-error', '');
    showError('rf-slot-error', '');
    state.sending = true;
    syncForm();
    rpc('book_placement_public', {
      p_booked_at: new Date(state.slot).toISOString(),
      p_name: state.name.trim(),
      p_email: state.email.trim(),
      p_phone: S.fullPhone(state),
    }).then(function (r) {
      state.sending = false;
      if (r && r.ok) {
        state.done = true;
        renderBooking();
        var done = document.getElementById('book');
        if (done && done.scrollIntoView) done.scrollIntoView({ block: 'nearest' });
        return;
      }
      var reason = r && r.reason;
      if (reason === 'full' || reason === 'closed') {
        state.slot = null;
        state.slotError = raw('slotFullError');
        showError('rf-slot-error', state.slotError);
        loadAvailability();
      } else {
        state.formError = raw(reason === 'duplicate' ? 'duplicateError' : 'busyError');
        showError('rf-form-error', state.formError);
      }
      syncForm();
    }).catch(function () {
      state.sending = false;
      state.formError = raw('busyError');
      showError('rf-form-error', state.formError);
      syncForm();
    });
  }

  // ---------------------------------------------------------------------
  // Events (delegated: the page is redrawn on a language change)
  // ---------------------------------------------------------------------
  root.addEventListener('click', function (ev) {
    var el = ev.target.closest('[data-lang],[data-day],[data-slot],#rf-confirm,#rf-fab-toggle,#rf-theme');
    if (!el || !root.contains(el)) return;
    if (el.id === 'rf-theme') { toggleTheme(); return; }
    if (el.hasAttribute('data-lang')) {
      var next = el.getAttribute('data-lang');
      if (next === lang) return;
      lang = next;
      try {
        localStorage.setItem(LANG_KEY, lang);
        localStorage.setItem(CHOSEN_KEY, 'true');
      } catch (e) { /* private mode */ }
      // Messages are shown in the language they were raised in: clear them.
      state.slotError = '';
      state.formError = '';
      renderAll(false);
      if (!state.avail) loadAvailability();
    } else if (el.hasAttribute('data-day')) {
      state.day = Number(el.getAttribute('data-day'));
      state.slot = null;
      renderDays();
      renderSlots();
      syncForm();
    } else if (el.hasAttribute('data-slot')) {
      if (el.disabled) return;
      state.slot = Number(el.getAttribute('data-slot'));
      state.slotError = '';
      showError('rf-slot-error', '');
      renderSlots();
      syncForm();
    } else if (el.id === 'rf-confirm') {
      submit();
    } else if (el.id === 'rf-fab-toggle') {
      state.fabOpen = !state.fabOpen;
      renderFab();
    }
  });

  function onField(ev) {
    var f = ev.target.getAttribute && ev.target.getAttribute('data-f');
    if (!f) return;
    state[f] = ev.target.value;
    syncForm();
  }
  root.addEventListener('input', onField);
  root.addEventListener('change', onField);

  // The page arrives pre-rendered in English; redraw only for another
  // language, then start the animations and load the real seats.
  if (lang !== 'en' || !root.firstElementChild) renderAll(true);
  else {
    document.documentElement.lang = lang;
    document.documentElement.dir = S.dirOf(lang);
    renderBooking(); // the visitor's own calendar days, not the build's
    syncTheme();
    watchReveals(true);
  }
  loadAvailability();
  // Seats change while the page stays open.
  setInterval(function () { if (!state.done && !document.hidden) loadAvailability(); }, 60000);
})();
