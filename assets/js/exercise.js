/* Widget de ejercicio: editor + resultados + tareas verificadas. */
(function () {
  const { el, renderTable, makeEditor, Progress, toast } = UI;
  const t = (k, p) => I18N.t(k, p);

  function tableHints(db) {
    const hints = {};
    try {
      Engine.schema(db).forEach(o => {
        if (o.type === 'table' || o.type === 'view') hints[o.name] = o.columns.map(c => c.name);
      });
    } catch (e) { /* ignore */ }
    return hints;
  }

  function buildSql(lesson, host) {
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

    const runBtn = el('button', { class: 'btn btn-primary' }, t('ex.run'));
    const resetDataBtn = el('button', { class: 'btn btn-ghost', title: t('ex.resetDataTitle') }, t('ex.resetData'));
    const resetSqlBtn = el('button', { class: 'btn btn-ghost' }, t('ex.clearQuery'));
    actions.append(runBtn, resetSqlBtn, resetDataBtn,
      el('span', { class: 'ex-dataset' }, t('ex.dataset', { name: I18N.datasetField(dataset, 'name') })));

    left.append(tabsBar, resultHost, message, editorHost, actions);

    /* ---------- panel derecho: tareas ---------- */
    const tasksTitle = el('div', { class: 'tasks-title' }, I18N.exerciseTitle(lesson));
    const tasksList = el('ol', { class: 'tasks-list' });
    const continueBtn = el('a', { class: 'btn btn-continue disabled' }, t('ex.continueDisabled'));
    right.append(tasksTitle, tasksList, continueBtn);

    const taskNodes = ex.tasks.map((task, i) => {
      const li = el('li', { class: 'task' });
      li.appendChild(el('div', { class: 'task-text', html: I18N.taskField(lesson, i, 'text') }));
      const tools = el('div', { class: 'task-tools' });
      const hintText = I18N.taskField(lesson, i, 'hint');
      if (hintText) {
        const hintBtn = el('button', { class: 'linkish' }, t('ex.hint'));
        const hintBox = el('div', { class: 'task-hint hidden', html: hintText });
        hintBtn.addEventListener('click', () => hintBox.classList.toggle('hidden'));
        tools.appendChild(hintBtn);
        li.appendChild(hintBox);
      }
      const solBtn = el('button', { class: 'linkish' }, t('ex.showSolution'));
      solBtn.addEventListener('click', () => {
        editor.setValue(task.solution);
        editor.focus();
        setMessage(t('ex.solutionLoaded'), 'info');
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
      const tabs = [{ id: '_result', label: t('ex.tabResult') }]
        .concat((ex.tables || []).map(t => ({ id: t, label: t })));
      tabs.forEach(tab => {
        const b = el('button', { class: 'ex-tab' + (tab.id === activeTab ? ' active' : '') }, tab.label);
        b.addEventListener('click', () => {
          activeTab = tab.id;
          buildTabs();
          if (tab.id === '_result') showResult(lastResult, lastMessage);
          else showTable(tab.id);
        });
        tabsBar.appendChild(b);
      });
    }

    let lastResult = null, lastMessage = '';
    function showResult(res, note) {
      lastResult = res; lastMessage = note || '';
      resultHost.textContent = '';
      if (!res) { resultHost.appendChild(el('div', { class: 'result-empty' }, t('ex.runToSee'))); return; }
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
      if (!sql) { setMessage(t('ex.writeSomething'), 'warn'); return; }
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
            setMessage(msg + ' <span class="ex-expected">' +
              t('ex.rejected', { msg: UI.escapeHtml(errored.error) }) + '</span>', 'ok');
            return;
          }
        }
        setMessage(t('ex.sqlError', { msg: errored.error }), 'error');
        return;
      }
      const withRows = results.filter(r => r.columns);
      const userRes = withRows.length ? withRows[withRows.length - 1] : { columns: [], values: [] };
      activeTab = '_result'; buildTabs();
      showResult(userRes);

      const task = ex.tasks[current];
      if (task.expectsError) {
        // la sentencia debía ser rechazada por la base de datos y no lo ha sido
        setMessage(t('ex.expectedRejection'), 'warn');
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
            ? t('ex.stmtRunRows', { n: changed, reason: verdict.reason || '' })
            : t('ex.stmtRun', { reason: verdict.reason || '' }), 'warn');
        } else {
          setMessage(t('ex.notYet', { reason: verdict.reason || t('ex.defaultFail') }), 'warn');
        }
      }
    }

    function onTaskPassed(i, task) {
      if (!passed[i]) {
        passed[i] = true;
        taskNodes[i].classList.add('done');
        Progress.markTask(lesson.slug, i);
      }
      let note = t('ex.correct');
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

      const nextPending = ex.tasks.findIndex((_, k) => !passed[k]);
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
      continueBtn.textContent = nxt
        ? t('ex.continueTo', { title: I18N.field(nxt, 'shortTitle') })
        : t('ex.courseDone');
      if (nxt) continueBtn.setAttribute('href', '#/' + nxt.slug);
      setMessage(t('ex.completed'), 'ok');
      toast(t('toast.lessonDone', { title: I18N.field(lesson, 'shortTitle') }), 'ok');
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
      continueBtn.textContent = nxt
        ? t('ex.continueTo', { title: I18N.field(nxt, 'shortTitle') })
        : t('ex.courseDone');
      if (nxt) continueBtn.setAttribute('href', '#/' + nxt.slug);
    }
    const firstPending = ex.tasks.findIndex((_, k) => !passed[k]);
    setCurrent(firstPending === -1 ? 0 : firstPending);

    runBtn.addEventListener('click', execute);
    resetSqlBtn.addEventListener('click', () => { editor.setValue(ex.starter || ''); editor.focus(); });
    resetDataBtn.addEventListener('click', () => {
      makeDb();
      showResult(null);
      setMessage(t('ex.dataRestored'), 'info');
      activeTab = '_result'; buildTabs();
    });

    setTimeout(() => editor.refresh(), 0);
    return { destroy() { try { db.close(); } catch (e) { } } };
  }

  function buildQuiz(lesson, host) {
    const ex = lesson.exercise;
    const root = el('div', { class: 'exercise quiz-exercise' });
    const left = el('div', { class: 'ex-left quiz-main' });
    const right = el('div', { class: 'ex-right' });
    root.append(left, right);
    host.appendChild(root);

    const saved = Progress.lesson(lesson.slug);
    const answers = Object.assign({}, saved.answers || {});
    const passed = ex.tasks.map((task, i) => !!(saved.tasks && saved.tasks[i]));
    const feedbackByTask = {};
    let current = 0;
    let complete = !!saved.done;

    const questionCounter = el('div', { class: 'quiz-question-counter' });
    const question = el('div', { class: 'quiz-question', role: 'heading', 'aria-level': '2' });
    const options = el('fieldset', { class: 'quiz-options' });
    const feedback = el('div', { class: 'ex-message' });
    const actions = el('div', { class: 'ex-actions quiz-actions' });
    const checkBtn = el('button', { class: 'btn btn-primary' }, t('quiz.check'));
    const nextBtn = el('button', { class: 'btn btn-ghost' }, t('quiz.next'));
    const progressLabel = el('span', { class: 'quiz-progress' });
    actions.append(checkBtn, nextBtn, progressLabel);
    left.append(questionCounter, question, options, feedback, actions);

    const tasksTitle = el('div', { class: 'tasks-title' }, I18N.exerciseTitle(lesson));
    const criterion = ex.passingScore < 1
      ? el('div', { class: 'quiz-criterion' }, t('quiz.examCriterion', {
        need: Quiz.requiredCorrect(ex.tasks.length, ex.passingScore),
        total: ex.tasks.length,
        percent: Math.round(ex.passingScore * 100)
      }))
      : null;
    const tasksList = el('ol', { class: 'tasks-list' });
    const continueBtn = el('a', { class: 'btn btn-continue disabled' }, t('ex.continueDisabled'));
    right.append(tasksTitle);
    if (criterion) right.appendChild(criterion);
    right.append(tasksList, continueBtn);

    const taskNodes = ex.tasks.map((task, i) => {
      const li = el('li', { class: 'task' });
      li.appendChild(el('div', { class: 'task-text', html: I18N.taskField(lesson, i, 'text') }));
      li.addEventListener('click', () => setCurrent(i));
      tasksList.appendChild(li);
      return li;
    });

    function setFeedback(html, kind) {
      feedback.className = 'ex-message ' + (kind ? 'msg-' + kind : '');
      feedback.innerHTML = html || '';
    }

    function updateProgress() {
      const got = Quiz.score(ex.tasks, answers);
      progressLabel.textContent = t('quiz.progress', { done: got, total: ex.tasks.length });
      taskNodes.forEach((node, i) => node.classList.toggle('done', passed[i] || complete));
    }

    function finish() {
      if (complete) return;
      complete = true;
      const got = Quiz.score(ex.tasks, answers);
      const total = ex.tasks.length;
      Progress.markDone(lesson.slug);
      const nxt = CURSO.next(lesson.slug);
      continueBtn.classList.remove('disabled');
      continueBtn.textContent = nxt ? t('ex.continueTo', { title: I18N.field(nxt, 'shortTitle') }) : t('ex.courseDone');
      if (nxt) continueBtn.setAttribute('href', '#/' + nxt.slug);
      checkBtn.disabled = true;
      nextBtn.disabled = true;
      setFeedback(t('quiz.passed', { got, total, percent: Math.round(got / total * 100) }), 'ok');
      toast(t('toast.lessonDone', { title: I18N.field(lesson, 'shortTitle') }), 'ok');
      updateProgress();
    }

    function showSavedFeedback() {
      const old = feedbackByTask[current];
      if (old) setFeedback(old.html, old.kind);
      else if (complete) {
        const got = Quiz.score(ex.tasks, answers), total = ex.tasks.length;
        setFeedback(t('quiz.passed', { got, total, percent: Math.round(got / total * 100) }), 'ok');
      } else setFeedback('', '');
    }

    function renderQuestion() {
      const task = ex.tasks[current];
      questionCounter.textContent = t('quiz.question', { current: current + 1, total: ex.tasks.length });
      question.innerHTML = I18N.taskField(lesson, current, 'text');
      options.textContent = '';
      const optionTexts = I18N.taskField(lesson, current, 'options') || task.options || [];
      const name = lesson.slug + '-answer';
      optionTexts.forEach((optionText, i) => {
        const id = name + '-' + i;
        const radio = el('input', { type: 'radio', name, value: i, id });
        if (answers[current] != null && String(answers[current]) === String(i)) radio.checked = true;
        const label = el('label', { class: 'quiz-option', for: id }, radio,
          el('span', { html: optionText }));
        options.appendChild(label);
      });
      taskNodes.forEach((node, i) => node.classList.toggle('active', i === current));
      nextBtn.disabled = current === ex.tasks.length - 1 || complete;
      checkBtn.disabled = complete;
      showSavedFeedback();
    }

    function setCurrent(i) {
      current = i;
      renderQuestion();
    }

    function checkCurrent() {
      if (complete) return;
      const selected = options.querySelector('input:checked');
      if (!selected) {
        setFeedback(t('quiz.select'), 'warn');
        return;
      }
      const answer = Number(selected.value);
      const task = ex.tasks[current];
      answers[current] = answer;
      Progress.markAnswer(lesson.slug, current, answer);
      const ok = Quiz.isCorrect(task, answer);
      if (ok) {
        passed[current] = true;
        Progress.markTask(lesson.slug, current);
      } else {
        passed[current] = false;
        Progress.unmarkTask(lesson.slug, current);
      }
      const explanation = I18N.taskField(lesson, current, 'explanation') || task.explanation || '';
      const html = (ok ? t('quiz.correct') : t('quiz.incorrect')) +
        (explanation ? '<br><span class="quiz-explanation">' + explanation + '</span>' : '');
      feedbackByTask[current] = { html, kind: ok ? 'ok' : 'warn' };
      setFeedback(html, ok ? 'ok' : 'warn');
      updateProgress();

      const allAnswered = ex.tasks.every((_, i) => answers[i] != null);
      if (allAnswered && Quiz.passed(ex.tasks, answers, ex.passingScore)) finish();
      else if (allAnswered && ex.passingScore < 1) {
        const got = Quiz.score(ex.tasks, answers), total = ex.tasks.length;
        setFeedback(t('quiz.failed', {
          need: Quiz.requiredCorrect(total, ex.passingScore), total
        }) + ' ' + t('quiz.score', { got, total }), 'warn');
      }
    }

    checkBtn.addEventListener('click', checkCurrent);
    nextBtn.addEventListener('click', () => setCurrent(Math.min(current + 1, ex.tasks.length - 1)));

    if (complete) taskNodes.forEach(node => node.classList.add('done'));
    renderQuestion();
    updateProgress();
    if (complete) {
      const nxt = CURSO.next(lesson.slug);
      continueBtn.classList.remove('disabled');
      continueBtn.textContent = nxt ? t('ex.continueTo', { title: I18N.field(nxt, 'shortTitle') }) : t('ex.courseDone');
      if (nxt) continueBtn.setAttribute('href', '#/' + nxt.slug);
    }
    return { destroy() {} };
  }

  function build(lesson, host) {
    return lesson.exercise && lesson.exercise.type === 'quiz'
      ? buildQuiz(lesson, host)
      : buildSql(lesson, host);
  }

  window.Exercise = { build };
})();
