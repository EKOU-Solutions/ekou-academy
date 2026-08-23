/* Router y armazón de la aplicación. */
(function () {
  const { el, Progress, toast } = UI;
  const t = (k, p) => I18N.t(k, p);
  const L = (lesson, f) => I18N.field(lesson, f);
  const main = document.getElementById('main');
  const sidebarNav = document.getElementById('sidebarNav');
  const sidebar = document.getElementById('sidebar');
  const scrim = document.getElementById('sidebarScrim');
  let currentView = null;

  /* ---------------- tema ---------------- */
  const THEME_KEY = 'sqltotal:theme';
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem(THEME_KEY, t); } catch (e) { }
  }
  applyTheme((() => { try { return localStorage.getItem(THEME_KEY) || 'dark'; } catch (e) { return 'dark'; } })());
  document.getElementById('themeToggle').addEventListener('click', () => {
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  /* ---------------- idioma ---------------- */
  function applyStaticStrings() {
    document.querySelectorAll('[data-i18n]').forEach(n => { n.textContent = t(n.dataset.i18n); });
    document.querySelectorAll('[data-i18n-title]').forEach(n => { n.title = t(n.dataset.i18nTitle); });
    document.querySelectorAll('[data-i18n-label]').forEach(n => { n.setAttribute('aria-label', t(n.dataset.i18nLabel)); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(n => { n.placeholder = t(n.dataset.i18nPlaceholder); });
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', t('meta.description'));
  }

  const langSwitch = document.getElementById('langSwitch');
  function paintLangSwitch() {
    langSwitch.querySelectorAll('button').forEach(b => {
      const on = b.dataset.lang === I18N.lang;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }
  langSwitch.addEventListener('click', e => {
    const btn = e.target.closest('button[data-lang]');
    if (btn) I18N.set(btn.dataset.lang);
  });
  document.addEventListener('lang:changed', () => {
    paintLangSwitch();
    applyStaticStrings();
    buildSidebar(document.getElementById('lessonSearch').value);
    route();
  });

  /* ---------------- barra lateral ---------------- */
  function buildSidebar(filter) {
    sidebarNav.textContent = '';
    const q = (filter || '').trim().toLowerCase();
    const progress = Progress.all();
    let shown = 0;

    CURSO.bySection().forEach(group => {
      const items = group.items.filter(l =>
        !q ||
        L(l, 'title').toLowerCase().includes(q) ||
        L(l, 'shortTitle').toLowerCase().includes(q) ||
        (L(l, 'summary') || '').toLowerCase().includes(q) ||
        (l.keywords || '').toLowerCase().includes(q));
      if (!items.length) return;
      shown += items.length;
      const box = el('div', { class: 'nav-group' });
      box.appendChild(el('div', { class: 'nav-group-title' },
        el('span', {}, t('section.' + group.section.id + '.name')),
        el('small', {}, t('section.' + group.section.id + '.hint'))));
      items.forEach(l => {
        const done = progress[l.slug] && progress[l.slug].done;
        const a = el('a', {
          class: 'nav-item' + (done ? ' done' : '') + (l.source === 'extra' ? ' extra' : ''),
          href: '#/' + l.slug
        },
          el('span', { class: 'nav-check' }, done ? '✓' : ''),
          el('span', { class: 'nav-label' }, L(l, 'shortTitle')),
          l.exercise ? null : el('span', { class: 'nav-tag', title: t('nav.refTagTitle') }, t('nav.refTag'))
        );
        box.appendChild(a);
      });
      sidebarNav.appendChild(box);
    });

    if (!shown) sidebarNav.appendChild(el('div', { class: 'pane-empty' }, t('search.noMatch')));
    highlightActive();
  }

  function highlightActive() {
    const hash = location.hash || '#/';
    sidebarNav.querySelectorAll('.nav-item').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === hash);
    });
  }

  function updateProgressPill() {
    const total = CURSO.ordered().length;
    const done = Progress.countDone();
    const pill = document.getElementById('progressPill');
    pill.textContent = `${done} / ${total}`;
    // alimenta el anillo cónico de la marca (--grad-progreso)
    pill.style.setProperty('--progress', total ? (done / total * 100).toFixed(1) + '%' : '0%');
  }

  document.getElementById('lessonSearch').addEventListener('input', e => buildSidebar(e.target.value));
  document.getElementById('resetProgress').addEventListener('click', () => {
    if (confirm(t('progress.resetConfirm'))) {
      Progress.reset();
      toast(t('progress.resetDone'), 'info');
    }
  });
  document.addEventListener('progress:changed', () => { buildSidebar(document.getElementById('lessonSearch').value); updateProgressPill(); });

  document.getElementById('navToggle').addEventListener('click', () => {
    sidebar.classList.toggle('open'); scrim.classList.toggle('show');
  });
  scrim.addEventListener('click', () => { sidebar.classList.remove('open'); scrim.classList.remove('show'); });

  document.addEventListener('keydown', e => {
    if (e.key === '/' && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName) && !document.activeElement.closest('.CodeMirror')) {
      e.preventDefault();
      document.getElementById('lessonSearch').focus();
    }
  });

  /* ---------------- vistas ---------------- */
  function renderHome() {
    const total = CURSO.ordered().length;
    const conEjercicio = CURSO.ordered().filter(l => l.exercise).length;
    const wrap = el('div', { class: 'page home' });

    wrap.appendChild(el('section', { class: 'hero' },
      el('h1', {}, t('home.title')),
      el('p', { class: 'lead' }, t('home.lead')),
      el('div', { class: 'hero-actions' },
        el('a', { class: 'btn btn-primary btn-lg', href: '#/' + CURSO.ordered()[0].slug }, t('home.start')),
        el('a', { class: 'btn btn-ghost btn-lg', href: '#/playground' }, t('home.openPlayground'))),
      el('div', { class: 'hero-stats' },
        el('div', { class: 'stat' }, el('b', {}, String(total)), el('span', {}, t('stats.topics'))),
        el('div', { class: 'stat' }, el('b', {}, String(conEjercicio)), el('span', {}, t('stats.withExercises'))),
        el('div', { class: 'stat' }, el('b', {}, String(Object.keys(window.DATASETS).length)), el('span', {}, t('stats.datasets'))),
        el('div', { class: 'stat' }, el('b', {}, 'SQLite'), el('span', {}, t('stats.engine'))))
    ));

    const progress = Progress.all();
    CURSO.bySection().forEach(group => {
      const sec = el('section', { class: 'home-section' });
      sec.appendChild(el('h2', {}, t('section.' + group.section.id + '.name'),
        el('small', {}, t('section.' + group.section.id + '.hint'))));
      const grid = el('div', { class: 'card-grid' });
      group.items.forEach(l => {
        const done = progress[l.slug] && progress[l.slug].done;
        grid.appendChild(el('a', { class: 'card' + (done ? ' done' : ''), href: '#/' + l.slug },
          el('div', { class: 'card-top' },
            el('span', { class: 'card-kind' }, t(l.source === 'extra' ? 'card.extra' : 'card.sqlbolt')),
            l.exercise ? el('span', { class: 'card-badge' }, t('card.practice')) : null,
            done ? el('span', { class: 'card-done' }, '✓') : null),
          el('h3', {}, L(l, 'shortTitle')),
          el('p', {}, L(l, 'summary') || '')));
      });
      sec.appendChild(grid);
      wrap.appendChild(sec);
    });

    wrap.appendChild(el('section', { class: 'home-note' },
      el('h2', {}, t('home.aboutTitle')),
      el('p', { html: t('home.aboutBody') })
    ));

    return wrap;
  }

  function renderLesson(lesson) {
    const wrap = el('div', { class: 'page lesson-page' });
    const prev = CURSO.prev(lesson.slug), next = CURSO.next(lesson.slug);
    const section = CURSO.SECTIONS.find(s => s.id === lesson.section);

    wrap.appendChild(el('div', { class: 'breadcrumbs' },
      el('a', { href: '#/' }, t('lesson.crumbCourse')), el('span', {}, '›'),
      el('span', {}, section ? t('section.' + section.id + '.name') : ''),
      lesson.source === 'extra'
        ? el('span', { class: 'pill pill-extra' }, t('card.extra'))
        : el('span', { class: 'pill' }, t('card.sqlbolt'))));

    wrap.appendChild(el('h1', { class: 'lesson-title' }, L(lesson, 'title')));
    if (L(lesson, 'summary')) wrap.appendChild(el('p', { class: 'lesson-summary' }, L(lesson, 'summary')));
    wrap.appendChild(el('article', { class: 'lesson-body', html: L(lesson, 'body') }));

    if (lesson.exercise) {
      const exHost = el('section', { class: 'exercise-host' });
      wrap.appendChild(exHost);
      setTimeout(() => Exercise.build(lesson, exHost), 0);
    } else {
      wrap.appendChild(el('div', { class: 'no-exercise' },
        el('span', {}, t('lesson.noExercise')),
        el('a', { href: '#/playground' }, t('lesson.tryPlayground'))));
    }

    wrap.appendChild(el('nav', { class: 'lesson-nav' },
      prev ? el('a', { class: 'btn btn-ghost', href: '#/' + prev.slug }, '← ' + L(prev, 'shortTitle')) : el('span', {}),
      next ? el('a', { class: 'btn btn-primary', href: '#/' + next.slug }, L(next, 'shortTitle') + ' →') : el('span', {})));

    return wrap;
  }

  function renderPlayground() {
    const wrap = el('div', { class: 'page page-playground' });
    wrap.appendChild(el('div', { class: 'pg-head' },
      el('h1', {}, t('pg.title')),
      el('p', {}, t('pg.lead'))));
    const host = el('div');
    wrap.appendChild(host);
    setTimeout(() => { currentView = Playground.render(host); }, 0);
    return wrap;
  }

  function renderNotFound() {
    return el('div', { class: 'page' },
      el('h1', {}, t('nf.title')),
      el('p', {}, t('nf.body')),
      el('a', { class: 'btn btn-primary', href: '#/' }, t('nf.back')));
  }

  /* ---------------- router ---------------- */
  function route() {
    if (currentView && currentView.destroy) { try { currentView.destroy(); } catch (e) { } }
    currentView = null;
    const hash = (location.hash || '#/').replace(/^#\/?/, '');
    main.textContent = '';
    let view;
    if (!hash) view = renderHome();
    else if (hash === 'playground') view = renderPlayground();
    else if (hash === 'referencia') {
      const ref = CURSO.get('chuleta-sql');
      view = ref ? renderLesson(ref) : renderNotFound();
    } else {
      const lesson = CURSO.get(hash);
      view = lesson ? renderLesson(lesson) : renderNotFound();
    }
    main.appendChild(view);
    window.scrollTo(0, 0);
    highlightActive();
    sidebar.classList.remove('open'); scrim.classList.remove('show');
    document.querySelectorAll('.topnav a').forEach(a => a.classList.remove('active'));
    const navKey = hash === 'playground' ? 'playground' : hash === 'referencia' ? 'referencia' : 'curso';
    const navEl = document.querySelector(`.topnav a[data-nav="${navKey}"]`);
    if (navEl) navEl.classList.add('active');
    const cur = hash && CURSO.get(hash);
    document.title = (cur ? L(cur, 'shortTitle') + ' — ' : '') + t('site.title');
  }

  window.addEventListener('hashchange', route);

  /* ---------------- arranque ---------------- */
  Engine.ready().then(() => {
    document.getElementById('splash')?.remove();
    applyStaticStrings();
    paintLangSwitch();
    buildSidebar('');
    updateProgressPill();
    route();
  }).catch(err => {
    main.innerHTML = `<div class="page"><h1>${t('boot.failTitle')}</h1>
      <p>${t('boot.failBody')}</p>
      <pre>${UI.escapeHtml(err.message || err)}</pre></div>`;
  });
})();
