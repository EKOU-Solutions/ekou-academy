/* Utilidades de interfaz compartidas. */
(function () {

  const el = (tag, attrs = {}, ...children) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') n.className = v;
      else if (k === 'html') n.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? '' : v);
    }
    children.flat().forEach(c => {
      if (c == null) return;
      n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return n;
  };

  const escapeHtml = s => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  function formatCell(v) {
    if (v === null || v === undefined) return { text: 'NULL', cls: 'cell-null' };
    if (typeof v === 'number') {
      const s = Number.isInteger(v) ? String(v) : String(Math.round(v * 1e6) / 1e6);
      return { text: s, cls: 'cell-num' };
    }
    if (v instanceof Uint8Array) return { text: `<blob ${v.length} bytes>`, cls: 'cell-null' };
    return { text: String(v), cls: '' };
  }

  /* Tabla de resultados con orden por columna al hacer clic. */
  function renderTable(result, opts = {}) {
    if (!result || !result.columns || !result.columns.length) {
      return el('div', { class: 'result-empty' }, opts.emptyText || 'La consulta no ha devuelto columnas.');
    }
    const wrap = el('div', { class: 'table-wrap' });
    const table = el('table', { class: 'datagrid' });
    const thead = el('thead');
    const headRow = el('tr');
    let sortState = { col: -1, dir: 1 };

    result.columns.forEach((c, i) => {
      const th = el('th', { title: 'Ordenar por ' + c }, String(c));
      th.addEventListener('click', () => {
        sortState = { col: i, dir: sortState.col === i ? -sortState.dir : 1 };
        draw();
        headRow.querySelectorAll('th').forEach(x => x.removeAttribute('data-sort'));
        th.setAttribute('data-sort', sortState.dir > 0 ? 'asc' : 'desc');
      });
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);
    const tbody = el('tbody');
    table.appendChild(tbody);

    function draw() {
      let rows = result.values;
      if (sortState.col >= 0) {
        const c = sortState.col, d = sortState.dir;
        rows = rows.slice().sort((a, b) => {
          const x = a[c], y = b[c];
          if (x === null) return 1;
          if (y === null) return -1;
          if (typeof x === 'number' && typeof y === 'number') return (x - y) * d;
          return String(x).localeCompare(String(y), 'es') * d;
        });
      }
      tbody.textContent = '';
      const limit = opts.limit || 500;
      rows.slice(0, limit).forEach(r => {
        const tr = el('tr');
        r.forEach(v => {
          const f = formatCell(v);
          tr.appendChild(el('td', { class: f.cls }, f.text));
        });
        tbody.appendChild(tr);
      });
      if (rows.length > limit) {
        const tr = el('tr', { class: 'more-row' });
        tr.appendChild(el('td', { colspan: result.columns.length },
          `… ${rows.length - limit} fila(s) más no mostradas`));
        tbody.appendChild(tr);
      }
    }
    draw();
    wrap.appendChild(table);
    return wrap;
  }

  function makeEditor(host, opts = {}) {
    const cm = CodeMirror(host, {
      value: opts.value || '',
      mode: 'text/x-sql',
      lineNumbers: opts.lineNumbers !== false,
      lineWrapping: true,
      matchBrackets: true,
      placeholder: opts.placeholder || 'Escribe aquí tu consulta SQL…',
      viewportMargin: Infinity,
      extraKeys: {
        'Ctrl-Enter': () => opts.onRun && opts.onRun(),
        'Cmd-Enter': () => opts.onRun && opts.onRun(),
        'Ctrl-Space': 'autocomplete',
        'Shift-Tab': 'indentLess'
      },
      hintOptions: { tables: opts.tables || {} }
    });
    if (opts.onChange) cm.on('change', () => opts.onChange(cm.getValue()));
    return cm;
  }

  /* ---- progreso persistente ---- */
  const KEY = 'sqltotal:progress:v1';
  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function saveProgress(p) {
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) { /* modo privado */ }
  }
  const Progress = {
    all: loadProgress,
    lesson(slug) { return loadProgress()[slug] || { tasks: {}, done: false }; },
    markTask(slug, i) {
      const p = loadProgress();
      const l = p[slug] || (p[slug] = { tasks: {}, done: false });
      l.tasks[i] = true;
      saveProgress(p);
    },
    markDone(slug) {
      const p = loadProgress();
      const l = p[slug] || (p[slug] = { tasks: {}, done: false });
      l.done = true;
      saveProgress(p);
      document.dispatchEvent(new CustomEvent('progress:changed'));
    },
    reset() { saveProgress({}); document.dispatchEvent(new CustomEvent('progress:changed')); },
    countDone() { return Object.values(loadProgress()).filter(x => x.done).length; }
  };

  function toast(msg, kind = 'info') {
    let host = document.querySelector('.toasts');
    if (!host) { host = el('div', { class: 'toasts' }); document.body.appendChild(host); }
    const t = el('div', { class: 'toast toast-' + kind, html: msg });
    host.appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, 2600);
  }

  function download(filename, content, mime = 'text/plain') {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = el('a', { href: url, download: filename });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function toCSV(result) {
    const esc = v => {
      if (v === null || v === undefined) return '';
      const s = String(v);
      return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    return [result.columns.map(esc).join(','),
      ...result.values.map(r => r.map(esc).join(','))].join('\n');
  }

  window.UI = { el, escapeHtml, renderTable, makeEditor, Progress, toast, download, toCSV, formatCell };
})();
