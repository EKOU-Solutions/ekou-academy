/* Router y armazón de la aplicación. */
(function () {
  const { el, Progress, toast } = UI;
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

  /* ---------------- barra lateral ---------------- */
  function buildSidebar(filter) {
    sidebarNav.textContent = '';
    const q = (filter || '').trim().toLowerCase();
    const progress = Progress.all();
    let shown = 0;

    CURSO.bySection().forEach(group => {
      const items = group.items.filter(l =>
        !q || l.title.toLowerCase().includes(q) || (l.keywords || '').toLowerCase().includes(q));
      if (!items.length) return;
      shown += items.length;
      const box = el('div', { class: 'nav-group' });
      box.appendChild(el('div', { class: 'nav-group-title' },
        el('span', {}, group.section.name),
        el('small', {}, group.section.hint)));
      items.forEach(l => {
        const done = progress[l.slug] && progress[l.slug].done;
        const a = el('a', {
          class: 'nav-item' + (done ? ' done' : '') + (l.source === 'extra' ? ' extra' : ''),
          href: '#/' + l.slug
        },
          el('span', { class: 'nav-check' }, done ? '✓' : ''),
          el('span', { class: 'nav-label' }, l.shortTitle),
          l.exercise ? null : el('span', { class: 'nav-tag', title: 'Tema de referencia, sin ejercicio' }, 'ref')
        );
        box.appendChild(a);
      });
      sidebarNav.appendChild(box);
    });

    if (!shown) sidebarNav.appendChild(el('div', { class: 'pane-empty' }, 'Ningún tema coincide con la búsqueda.'));
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
    if (confirm('¿Borrar todo el progreso guardado en este navegador?')) {
      Progress.reset();
      toast('Progreso reiniciado', 'info');
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
      el('h1', {}, 'Aprende SQL de principio a fin'),
      el('p', { class: 'lead' },
        'Curso interactivo en español basado en el temario de SQLBolt, ampliado con vistas, índices, transacciones, funciones, funciones de ventana, disparadores, procedimientos almacenados y diseño de bases de datos. Todo se ejecuta en tu navegador con SQLite: no hay servidor ni instalación.'),
      el('div', { class: 'hero-actions' },
        el('a', { class: 'btn btn-primary btn-lg', href: '#/' + CURSO.ordered()[0].slug }, 'Empezar el curso'),
        el('a', { class: 'btn btn-ghost btn-lg', href: '#/playground' }, 'Abrir el Playground')),
      el('div', { class: 'hero-stats' },
        el('div', { class: 'stat' }, el('b', {}, String(total)), el('span', {}, 'temas')),
        el('div', { class: 'stat' }, el('b', {}, String(conEjercicio)), el('span', {}, 'con ejercicios')),
        el('div', { class: 'stat' }, el('b', {}, String(Object.keys(window.DATASETS).length)), el('span', {}, 'bases de ejemplo')),
        el('div', { class: 'stat' }, el('b', {}, 'SQLite'), el('span', {}, 'en WebAssembly')))
    ));

    const progress = Progress.all();
    CURSO.bySection().forEach(group => {
      const sec = el('section', { class: 'home-section' });
      sec.appendChild(el('h2', {}, group.section.name, el('small', {}, group.section.hint)));
      const grid = el('div', { class: 'card-grid' });
      group.items.forEach(l => {
        const done = progress[l.slug] && progress[l.slug].done;
        grid.appendChild(el('a', { class: 'card' + (done ? ' done' : ''), href: '#/' + l.slug },
          el('div', { class: 'card-top' },
            el('span', { class: 'card-kind' }, l.source === 'extra' ? 'Ampliación' : 'SQLBolt'),
            l.exercise ? el('span', { class: 'card-badge' }, 'práctica') : null,
            done ? el('span', { class: 'card-done' }, '✓') : null),
          el('h3', {}, l.shortTitle),
          el('p', {}, l.summary || '')));
      });
      sec.appendChild(grid);
      wrap.appendChild(sec);
    });

    wrap.appendChild(el('section', { class: 'home-note' },
      el('h2', {}, 'Sobre los contenidos'),
      el('p', { html:
        'Las lecciones 1 a 18 y los temas de subconsultas y operaciones de conjunto reproducen, traducidos al español, el temario y los ejercicios de <a href="https://sqlbolt.com" target="_blank" rel="noopener">SQLBolt</a>, incluidas sus bases de datos de ejemplo. ' +
        'El resto de temas — marcados como <em>Ampliación</em> — son material nuevo escrito para este sitio. ' +
        'El volcado íntegro de la copia original está en <code>data/raw/</code>.' })
    ));

    return wrap;
  }

  function renderLesson(lesson) {
    const wrap = el('div', { class: 'page lesson-page' });
    const prev = CURSO.prev(lesson.slug), next = CURSO.next(lesson.slug);
    const section = CURSO.SECTIONS.find(s => s.id === lesson.section);

    wrap.appendChild(el('div', { class: 'breadcrumbs' },
      el('a', { href: '#/' }, 'Curso'), el('span', {}, '›'),
      el('span', {}, section ? section.name : ''),
      lesson.source === 'extra' ? el('span', { class: 'pill pill-extra' }, 'Ampliación') : el('span', { class: 'pill' }, 'SQLBolt')));

    wrap.appendChild(el('h1', { class: 'lesson-title' }, lesson.title));
    if (lesson.summary) wrap.appendChild(el('p', { class: 'lesson-summary' }, lesson.summary));
    wrap.appendChild(el('article', { class: 'lesson-body', html: lesson.body }));

    if (lesson.exercise) {
      const exHost = el('section', { class: 'exercise-host' });
      wrap.appendChild(exHost);
      setTimeout(() => Exercise.build(lesson, exHost), 0);
    } else {
      wrap.appendChild(el('div', { class: 'no-exercise' },
        el('span', {}, 'Este tema es de referencia. '),
        el('a', { href: '#/playground' }, 'Pruébalo en el Playground →')));
    }

    wrap.appendChild(el('nav', { class: 'lesson-nav' },
      prev ? el('a', { class: 'btn btn-ghost', href: '#/' + prev.slug }, '← ' + prev.shortTitle) : el('span', {}),
      next ? el('a', { class: 'btn btn-primary', href: '#/' + next.slug }, next.shortTitle + ' →') : el('span', {})));

    return wrap;
  }

  function renderPlayground() {
    const wrap = el('div', { class: 'page page-playground' });
    wrap.appendChild(el('div', { class: 'pg-head' },
      el('h1', {}, 'Playground SQL'),
      el('p', {}, 'Un SQLite completo dentro del navegador. Elige una base de ejemplo o crea la tuya, escribe varias sentencias separadas por punto y coma y ejecútalas con ⌘/Ctrl + Enter. Puedes practicar aquí todo lo que aparece en el curso: consultas, DDL, transacciones, vistas, índices, disparadores, CTEs, funciones de ventana y funciones definidas por el usuario.')));
    const host = el('div');
    wrap.appendChild(host);
    setTimeout(() => { currentView = Playground.render(host); }, 0);
    return wrap;
  }

  function renderNotFound() {
    return el('div', { class: 'page' },
      el('h1', {}, 'Página no encontrada'),
      el('p', {}, 'Ese tema no existe. '),
      el('a', { class: 'btn btn-primary', href: '#/' }, 'Volver al índice'));
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
    document.title = (hash && CURSO.get(hash) ? CURSO.get(hash).shortTitle + ' — ' : '') + 'SQL Total';
  }

  window.addEventListener('hashchange', route);

  /* ---------------- arranque ---------------- */
  Engine.ready().then(() => {
    document.getElementById('splash')?.remove();
    buildSidebar('');
    updateProgressPill();
    route();
  }).catch(err => {
    main.innerHTML = `<div class="page"><h1>No se pudo cargar SQLite</h1>
      <p>El motor WebAssembly no ha podido inicializarse. Abre el sitio desde un servidor HTTP
      (por ejemplo <code>python3 -m http.server</code>) en lugar de con <code>file://</code>.</p>
      <pre>${UI.escapeHtml(err.message || err)}</pre></div>`;
  });
})();
