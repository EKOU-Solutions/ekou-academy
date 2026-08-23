/* Widget de ejercicio: editor + resultados + tareas verificadas. */
(function () {
  const { el, renderTable, makeEditor, Progress, toast } = UI;

  function tableHints(db) {
    const hints = {};
    try {
      Engine.schema(db).forEach(o => {
        if (o.type === 'table' || o.type === 'view') hints[o.name] = o.columns.map(c => c.name);
      });
    } catch (e) { /* ignore */ }
    return hints;
  }

  function build(lesson, host) {
    const ex = lesson.exercise;
    const dataset = window.DATASETS[ex.dataset];
    let db = null;
    let current = 0;
    const passed = [];
    const doneOnce = new Set();

    const root = el('div', { class: 'exercise' });
    const left = el('div', { class: 'ex-left' });
    const right = el('div', { class: 'ex-right' });
    root.append(left, right);
    host.appendChild(root);

    /* ---------- panel izquierdo ---------- */
    const tabsBar = el('div', { class: 'ex-tabs' });
    const resultHost = el('div', { class: 'ex-result' });
    const message = el('div', { class: 'ex-message' });
    const editorHost = el('div', { class: 'ex-editor' });
    const actions = el('div', { class: 'ex-actions' });

    const runBtn = el('button', { class: 'btn btn-primary' }, 'Ejecutar ⌘⏎');
    const resetDataBtn = el('button', { class: 'btn btn-ghost', title: 'Vuelve a cargar los datos originales' }, 'Reiniciar datos');
    const resetSqlBtn = el('button', { class: 'btn btn-ghost' }, 'Limpiar consulta');
    actions.append(runBtn, resetSqlBtn, resetDataBtn,
      el('span', { class: 'ex-dataset' }, 'Base: ' + dataset.name));

    left.append(tabsBar, resultHost, message, editorHost, actions);

    /* ---------- panel derecho: tareas ---------- */
    const tasksTitle = el('div', { class: 'tasks-title' }, ex.title || 'Tareas');
    const tasksList = el('ol', { class: 'tasks-list' });
    const continueBtn = el('a', { class: 'btn btn-continue disabled' }, 'Completa las tareas');
    right.append(tasksTitle, tasksList, continueBtn);

    const taskNodes = ex.tasks.map((t, i) => {
      const li = el('li', { class: 'task' });
      li.appendChild(el('div', { class: 'task-text', html: t.text }));
      const tools = el('div', { class: 'task-tools' });
      if (t.hint) {
        const hintBtn = el('button', { class: 'linkish' }, 'Pista');
        const hintBox = el('div', { class: 'task-hint hidden', html: t.hint });
        hintBtn.addEventListener('click', () => hintBox.classList.toggle('hidden'));
        tools.appendChild(hintBtn);
        li.appendChild(hintBox);
      }
      const solBtn = el('button', { class: 'linkish' }, 'Ver solución');
      solBtn.addEventListener('click', () => {
        editor.setValue(t.solution);
        editor.focus();
        setMessage('Solución cargada en el editor. Ejecútala para ver el resultado.', 'info');
      });
      tools.appendChild(solBtn);
      li.appendChild(tools);
      li.addEventListener('click', e => {
        if (e.target.closest('.linkish')) return;
        setCurrent(i);
      });
      tasksList.appendChild(li);
      return li;
    });

    function setCurrent(i) {
      current = i;
      taskNodes.forEach((n, k) => n.classList.toggle('active', k === i));
    }

    function setMessage(html, kind) {
      message.className = 'ex-message ' + (kind ? 'msg-' + kind : '');
      message.innerHTML = html || '';
    }

    /* ---------- pestañas de tablas de referencia ---------- */
    let activeTab = '_result';
    function buildTabs() {
      tabsBar.textContent = '';
      const tabs = [{ id: '_result', label: 'Resultado' }]
        .concat((ex.tables || []).map(t => ({ id: t, label: t })));
      tabs.forEach(t => {
        const b = el('button', { class: 'ex-tab' + (t.id === activeTab ? ' active' : '') }, t.label);
        b.addEventListener('click', () => {
          activeTab = t.id;
          buildTabs();
          if (t.id === '_result') showResult(lastResult, lastMessage);
          else showTable(t.id);
        });
        tabsBar.appendChild(b);
      });
    }

    let lastResult = null, lastMessage = '';
    function showResult(res, note) {
      lastResult = res; lastMessage = note || '';
      resultHost.textContent = '';
      if (!res) { resultHost.appendChild(el('div', { class: 'result-empty' }, 'Ejecuta una consulta para ver el resultado.')); return; }
      if (res.error) { resultHost.appendChild(el('div', { class: 'result-error' }, res.error)); return; }
      resultHost.appendChild(renderTable(res));
    }

    function showTable(name) {
      try {
        const res = Engine.query(db, `SELECT * FROM "${name}";`);
        resultHost.textContent = '';
        resultHost.appendChild(renderTable(res));
      } catch (e) {
        resultHost.textContent = '';
        resultHost.appendChild(el('div', { class: 'result-error' }, e.message));
      }
    }

    /* ---------- base de datos ---------- */
    let editor = null;
    function makeDb() {
      if (db) { try { db.close(); } catch (e) { } }
      db = Engine.create(ex.dataset);
      if (ex.preload) {
        Object.values(ex.preload).forEach(sql => { try { db.run(sql); } catch (e) { console.warn(e); } });
      }
      doneOnce.clear();
      if (editor) editor.setOption('hintOptions', { tables: tableHints(db) });
    }

    /* ---------- ejecución + verificación ---------- */
    function execute() {
      const sql = editor.getValue().trim();
      if (!sql) { setMessage('Escribe una consulta antes de ejecutar.', 'warn'); return; }
      let results;
      try {
        results = Engine.run(db, sql);
      } catch (e) {
        showResult({ error: e.message });
        setMessage(e.message, 'error');
        return;
      }
      const errored = results.find(r => r.error);
      const task0 = ex.tasks[current];
      if (errored) {
        activeTab = '_result'; buildTabs();
        showResult({ error: errored.error });
        // Algunas tareas piden precisamente una sentencia que la base debe rechazar.
        if (task0 && task0.expectsError) {
          const verdictErr = Checker.verify(task0, {
            db, userRes: { columns: [], values: [] }, task: task0, userSql: sql
          });
          if (verdictErr.ok) {
            onTaskPassed(current, task0);
            const msg = message.innerHTML;
            setMessage(msg + ' <span class="ex-expected">La base de datos rechazó la sentencia: ' +
              UI.escapeHtml(errored.error) + '</span>', 'ok');
            return;
          }
        }
        setMessage('Error de SQL: ' + errored.error, 'error');
        return;
      }
      const withRows = results.filter(r => r.columns);
      const userRes = withRows.length ? withRows[withRows.length - 1] : { columns: [], values: [] };
      activeTab = '_result'; buildTabs();
      showResult(userRes);

      const task = ex.tasks[current];
      if (task.expectsError) {
        // la sentencia debía ser rechazada por la base de datos y no lo ha sido
        setMessage('La sentencia se ha ejecutado sin error, pero esta tarea espera que la base de datos la <strong>rechace</strong>.', 'warn');
        return;
      }
      const verdict = Checker.verify(task, { db, userRes, task, userSql: sql });

      if (verdict.ok) {
        onTaskPassed(current, task);
      } else {
        if (verdict.failQuery) { try { db.run(verdict.failQuery); } catch (e) { } }
        if (!withRows.length) {
          const dml = results.filter(r => r.rowsModified != null);
          const changed = dml.reduce((a, r) => a + r.rowsModified, 0);
          setMessage(dml.length
            ? `Sentencia ejecutada (${changed} fila(s) afectadas). ${verdict.reason || ''}`
            : `Sentencia ejecutada. ${verdict.reason || ''}`, 'warn');
        } else {
          setMessage('Todavía no: ' + (verdict.reason || 'el resultado no coincide con lo pedido.'), 'warn');
        }
      }
    }

    function onTaskPassed(i, task) {
      if (!passed[i]) {
        passed[i] = true;
        taskNodes[i].classList.add('done');
        Progress.markTask(lesson.slug, i);
      }
      let note = '¡Correcto!';
      const pva = task.postValidateAction;
      if (pva) {
        if (pva.runActionOnce && !doneOnce.has(i)) {
          try { db.run(pva.runActionOnce); doneOnce.add(i); } catch (e) { console.warn(e); }
        }
        if (pva.message) note = pva.message + ' ✓';
        if (pva.resultQuery) {
          try { showResult(Engine.query(db, pva.resultQuery)); } catch (e) { }
        }
      }
      setMessage(note, 'ok');

      const nextPending = ex.tasks.findIndex((t, k) => !passed[k]);
      if (nextPending === -1) {
        finish();
      } else {
        setCurrent(nextPending);
      }
    }

    function finish() {
      Progress.markDone(lesson.slug);
      const nxt = CURSO.next(lesson.slug);
      continueBtn.classList.remove('disabled');
      continueBtn.textContent = nxt ? 'Continuar → ' + nxt.shortTitle : '¡Curso completado!';
      if (nxt) continueBtn.setAttribute('href', '#/' + nxt.slug);
      setMessage('¡Ejercicio completado! 🎉', 'ok');
      toast('Lección completada: ' + lesson.shortTitle, 'ok');
    }

    /* ---------- montaje ---------- */
    makeDb();
    editor = makeEditor(editorHost, {
      value: ex.starter || '',
      onRun: execute,
      tables: tableHints(db)
    });
    buildTabs();
    showResult(null);
    setCurrent(0);

    // marca las tareas ya superadas en sesiones anteriores
    const saved = Progress.lesson(lesson.slug);
    Object.keys(saved.tasks || {}).forEach(k => {
      const i = Number(k);
      if (ex.tasks[i]) { passed[i] = true; taskNodes[i].classList.add('done'); }
    });
    if (saved.done) {
      const nxt = CURSO.next(lesson.slug);
      continueBtn.classList.remove('disabled');
      continueBtn.textContent = nxt ? 'Continuar → ' + nxt.shortTitle : '¡Curso completado!';
      if (nxt) continueBtn.setAttribute('href', '#/' + nxt.slug);
    }
    const firstPending = ex.tasks.findIndex((t, k) => !passed[k]);
    setCurrent(firstPending === -1 ? 0 : firstPending);

    runBtn.addEventListener('click', execute);
    resetSqlBtn.addEventListener('click', () => { editor.setValue(ex.starter || ''); editor.focus(); });
    resetDataBtn.addEventListener('click', () => {
      makeDb();
      showResult(null);
      setMessage('Datos restaurados a su estado inicial.', 'info');
      activeTab = '_result'; buildTabs();
    });

    setTimeout(() => editor.refresh(), 0);
    return { destroy() { try { db.close(); } catch (e) { } } };
  }

  window.Exercise = { build };
})();
