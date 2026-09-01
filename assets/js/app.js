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
  function applyTheme(t, persist = false) {
    document.documentElement.setAttribute('data-theme', t);
    if (persist) {
      try { localStorage.setItem(THEME_KEY, t); } catch (e) { }
    }
  }
  function preferredTheme() {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) { }
    try {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    } catch (e) { }
    return 'light';
  }
  applyTheme(preferredTheme());
  document.getElementById('themeToggle').addEventListener('click', () => {
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
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
    const routeHash = (location.hash || '#/').replace(/^#\/?/, '');
    const currentLesson = routeHash === 'referencia' ? CURSO.get('chuleta-sql') : routeHash && CURSO.get(routeHash);
    const courseSection = routeHash === 'java' ? 'java'
      : routeHash === 'sql' || routeHash === 'playground' || (currentLesson && currentLesson.section !== 'java') ? 'sql'
      : currentLesson && currentLesson.section === 'java' ? 'java' : null;
    let shown = 0;

    CURSO.bySection().forEach(group => {
      if (courseSection === 'java' && group.section.id !== 'java') return;
      if (courseSection === 'sql' && group.section.id === 'java') return;
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
    document.getElementById('progressPill').textContent = `${Progress.countDone()} / ${total}`;
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
    const lessons = CURSO.ordered();
    const progress = Progress.all();
    const total = lessons.length;
    const completed = Progress.countDone();
    const pending = lessons.find(l => !(progress[l.slug] && progress[l.slug].done)) || lessons[0];
    const pendingCourse = pending && pending.section === 'java' ? '#/java' : '#/sql';
    const subjects = [
      {
        id: 'sql', className: 'subject-sql', index: '01', href: '#/sql',
        lessons: lessons.filter(l => l.section !== 'java'),
        name: t('home.subject.sqlName'),
        label: t('home.subject.sqlLabel'),
        body: t('home.subject.sqlBody')
      },
      {
        id: 'java', className: 'subject-java', index: '02', href: '#/java',
        lessons: lessons.filter(l => l.section === 'java'),
        name: t('home.subject.javaName'),
        label: t('home.subject.javaLabel'),
        body: t('home.subject.javaBody')
      }
    ];

    const wrap = el('div', { class: 'page home home-dashboard' });
    const hero = el('section', { class: 'dashboard-hero' });
    hero.appendChild(el('div', { class: 'dashboard-hero-copy' },
      el('div', { class: 'eyebrow' }, t('home.eyebrow')),
      el('h1', {}, t('home.title')),
      el('p', { class: 'lead' }, t('home.lead')),
      el('div', { class: 'hero-actions' },
        el('a', { class: 'btn btn-primary btn-lg', href: pendingCourse }, t('home.primaryCta')),
        el('a', { class: 'btn btn-ghost btn-lg', href: '#subjects' }, t('home.secondaryCta')))));
    wrap.appendChild(hero);

    const layout = el('div', { class: 'dashboard-layout' });
    const mainColumn = el('div', { class: 'dashboard-main' });
    const subjectPanel = el('section', { class: 'dashboard-panel', id: 'subjects' });
    subjectPanel.appendChild(el('div', { class: 'panel-heading' },
      el('div', {}, el('div', { class: 'eyebrow' }, t('home.subjectsKicker')), el('h2', {}, t('home.subjectsTitle'))),
      el('p', {}, t('home.subjectsBody'))));
    const subjectGrid = el('div', { class: 'subject-grid' });
    subjects.forEach(subject => {
      const subjectDone = subject.lessons.filter(l => progress[l.slug] && progress[l.slug].done).length;
      const first = subject.lessons.find(l => !(progress[l.slug] && progress[l.slug].done)) || subject.lessons[0];
      const percentage = subject.lessons.length ? Math.round(subjectDone / subject.lessons.length * 100) : 0;
      subjectGrid.appendChild(el('a', { class: 'subject-card ' + subject.className, href: subject.href },
        el('div', { class: 'subject-card-top' },
          el('span', { class: 'subject-index' }, subject.index),
          el('span', { class: 'subject-label' }, subject.label),
          el('span', { class: 'subject-arrow' }, '↗')),
        el('h3', {}, subject.name),
        el('p', {}, subject.body),
        el('div', { class: 'subject-card-meta' },
          el('span', {}, subject.lessons.length + ' ' + t('home.stats.topicUnit')),
          el('span', {}, subjectDone + '/' + subject.lessons.length + ' ' + t('home.stats.doneUnit'))),
        el('div', { class: 'subject-progress' }, el('span', { style: 'width:' + percentage + '%' }))));
    });
    subjectPanel.appendChild(subjectGrid);
    mainColumn.appendChild(subjectPanel);

    const methodPanel = el('section', { class: 'dashboard-panel method-panel' });
    methodPanel.appendChild(el('div', { class: 'panel-heading' },
      el('div', {}, el('div', { class: 'eyebrow' }, t('home.methodKicker')), el('h2', {}, t('home.methodTitle'))),
      el('p', {}, t('home.methodBody'))));
    const methodGrid = el('div', { class: 'method-grid' });
    [['01', 'home.method.oneTitle', 'home.method.oneBody'], ['02', 'home.method.twoTitle', 'home.method.twoBody'], ['03', 'home.method.threeTitle', 'home.method.threeBody']]
      .forEach(([index, title, body]) => methodGrid.appendChild(el('article', { class: 'method-step' },
        el('span', {}, index), el('h3', {}, t(title)), el('p', {}, t(body)))));
    methodPanel.appendChild(methodGrid);
    mainColumn.appendChild(methodPanel);

    const sideColumn = el('aside', { class: 'dashboard-side' });
    const progressPanel = el('section', { class: 'dashboard-panel progress-panel' });
    const progressPercent = total ? Math.round(completed / total * 100) : 0;
    progressPanel.append(
      el('div', { class: 'eyebrow' }, t('home.progressKicker')),
      el('h2', {}, t('home.progressTitle')),
      el('div', { class: 'progress-number' }, el('strong', {}, progressPercent + '%'), el('span', {}, completed + '/' + total)),
      el('div', { class: 'dashboard-progress' }, el('span', { style: 'width:' + progressPercent + '%' })),
      el('p', {}, t('home.progressBody'))
    );
    if (pending) progressPanel.appendChild(el('a', { class: 'btn btn-primary', href: '#/' + pending.slug }, t('home.continueCta')));
    sideColumn.appendChild(progressPanel);

    const futurePanel = el('section', { class: 'dashboard-panel future-panel' });
    futurePanel.append(
      el('div', { class: 'eyebrow' }, t('home.futureKicker')),
      el('h2', {}, t('home.futureTitle')),
      el('p', {}, t('home.futureBody')),
      el('div', { class: 'future-tags' },
        el('span', {}, t('home.future.spring')),
        el('span', {}, t('home.future.apis')),
        el('span', {}, t('home.future.architecture')),
        el('span', {}, t('home.future.systems'))));
    sideColumn.appendChild(futurePanel);
    layout.append(mainColumn, sideColumn);
    wrap.appendChild(layout);

    wrap.appendChild(el('section', { class: 'home-note' },
      el('h2', {}, t('home.aboutTitle')),
      el('p', { html: t('home.aboutBody') })
    ));

    return wrap;
  }

  function renderCourseCard(lesson, progress) {
    const done = progress[lesson.slug] && progress[lesson.slug].done;
    return el('a', { class: 'card' + (done ? ' done' : ''), href: '#/' + lesson.slug },
      el('div', { class: 'card-top' },
        el('span', { class: 'card-kind' }, lesson.source === 'extra' ? t('card.extra') : t('card.sqlbolt')),
        lesson.exercise ? el('span', { class: 'card-badge' }, t('card.practice')) : null,
        done ? el('span', { class: 'card-done', title: t('card.doneTitle'), 'aria-label': t('card.doneTitle') }, '✓') : null),
      el('h3', {}, L(lesson, 'shortTitle')),
      el('p', {}, L(lesson, 'summary')));
  }

  function renderCourseLanding(courseId) {
    const isSql = courseId === 'sql';
    const lessons = CURSO.ordered().filter(lesson => isSql ? lesson.section !== 'java' : lesson.section === 'java');
    const progress = Progress.all();
    const completed = lessons.filter(lesson => progress[lesson.slug] && progress[lesson.slug].done).length;
    const withExercises = lessons.filter(lesson => lesson.exercise).length;
    const start = lessons.find(lesson => !(progress[lesson.slug] && progress[lesson.slug].done)) || lessons[0];
    const groups = CURSO.bySection().filter(group => isSql ? group.section.id !== 'java' : group.section.id === 'java');
    const wrap = el('div', { class: 'page home course-landing course-' + courseId });
    wrap.appendChild(el('nav', { class: 'breadcrumbs', 'aria-label': t('nav.breadcrumbs') },
      el('a', { href: '#/' }, t('nav.home')),
      el('span', { 'aria-hidden': 'true' }, '›'),
      el('span', { 'aria-current': 'page' }, isSql ? t('nav.sql') : t('nav.java'))));

    const hero = el('section', { class: 'hero' },
      el('h1', {}, t('course.' + courseId + '.title')),
      el('p', { class: 'lead' }, t('course.' + courseId + '.lead')));
    const actions = [
      el('a', { class: 'btn btn-primary btn-lg', href: start ? '#/' + start.slug : '#/' }, t('course.start'))
    ];
    if (isSql) actions.push(el('a', { class: 'btn btn-ghost btn-lg', href: '#/playground' }, t('course.playground')));
    hero.appendChild(el('div', { class: 'hero-actions' }, actions));
    const statItems = isSql
      ? [[lessons.length, 'course.stats.topics'], [withExercises, 'course.stats.exercises'], [completed, 'course.stats.completed'], [3, 'course.stats.datasets'], ['SQLite', 'course.stats.engine']]
      : [[lessons.length, 'course.stats.topics'], [withExercises, 'course.stats.exercises'], [completed, 'course.stats.completed'], ['JDK', 'course.stats.language'], ['JVM', 'course.stats.runtime']];
    hero.appendChild(el('div', { class: 'hero-stats' }, statItems.map(([value, label]) =>
      el('div', { class: 'stat' }, el('b', {}, String(value)), el('span', {}, t(label))))));
    wrap.appendChild(hero);

    groups.forEach(group => {
      const section = el('section', { class: 'home-section' });
      section.appendChild(el('h2', {},
        t('section.' + group.section.id + '.name'),
        el('small', {}, t('section.' + group.section.id + '.hint'))));
      section.appendChild(el('div', { class: 'card-grid' }, group.items.map(lesson => renderCourseCard(lesson, progress))));
      wrap.appendChild(section);
    });

    const noteTitle = isSql ? t('home.aboutTitle') : t('course.java.noteTitle');
    const noteBody = isSql ? t('home.aboutBody') : t('course.java.noteBody');
    wrap.appendChild(el('section', { class: 'home-note' }, el('h2', {}, noteTitle), el('p', { html: noteBody })));
    return wrap;
  }

  function renderLesson(lesson) {
    const wrap = el('div', { class: 'page lesson-page' });
    const prev = CURSO.prev(lesson.slug), next = CURSO.next(lesson.slug);
    const section = CURSO.SECTIONS.find(s => s.id === lesson.section);
    const courseId = lesson.section === 'java' ? 'java' : 'sql';

    wrap.appendChild(el('nav', { class: 'breadcrumbs', 'aria-label': t('nav.breadcrumbs') },
      el('a', { href: '#/' }, t('nav.home')), el('span', { 'aria-hidden': 'true' }, '›'),
      el('a', { href: '#/' + courseId }, t('nav.' + courseId)), el('span', { 'aria-hidden': 'true' }, '›'),
      el('span', { 'aria-current': 'page' }, section ? t('section.' + section.id + '.name') : ''),
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
    const currentLesson = hash && CURSO.get(hash);
    const isHome = !hash || hash === 'subjects';
    document.body.classList.toggle('is-home', isHome);
    main.textContent = '';
    let view;
    if (isHome) view = renderHome();
    else if (hash === 'sql' || hash === 'java') view = renderCourseLanding(hash);
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
    buildSidebar(document.getElementById('lessonSearch').value);
    highlightActive();
    sidebar.classList.remove('open'); scrim.classList.remove('show');
    document.querySelectorAll('.topnav a').forEach(a => { a.classList.remove('active'); a.removeAttribute('aria-current'); });
    const navKey = isHome ? 'home'
      : hash === 'playground' ? 'playground'
      : hash === 'java' || (currentLesson && currentLesson.section === 'java') ? 'java'
      : hash === 'sql' || hash === 'playground' || hash === 'referencia' || (currentLesson && currentLesson.section !== 'java') ? 'sql'
      : null;
    const navEl = navKey && document.querySelector(`.topnav a[data-nav="${navKey}"]`);
    if (navEl) { navEl.classList.add('active'); navEl.setAttribute('aria-current', 'page'); }
    if (hash === 'subjects') setTimeout(() => document.getElementById('subjects')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
    const cur = hash === 'referencia' ? CURSO.get('chuleta-sql') : currentLesson;
    const pageTitle = hash === 'sql' ? t('course.sql.title') : hash === 'java' ? t('course.java.title') : cur ? L(cur, 'shortTitle') : '';
    document.title = (pageTitle ? pageTitle + ' — ' : '') + t('site.title');
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
