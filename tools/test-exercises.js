/* Ejecuta la solución de cada tarea y comprueba que las verificaciones pasan. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const initSqlJs = require('sql.js');

const root = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');

(async () => {
  const SQL = await initSqlJs({ locateFile: f => path.join(root, 'public/assets/vendor', f) });

  const sandbox = {
    console, initSqlJs: () => Promise.resolve(SQL),
    performance: { now: () => Date.now() },
    document: { documentElement: { setAttribute() {} }, dispatchEvent() {}, addEventListener() {} },
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} }
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);

  for (const f of ['public/data/datasets.js', 'public/assets/js/i18n.js', 'public/assets/js/registry.js', 'public/assets/js/engine.js', 'public/assets/js/checker.js']) {
    vm.runInContext(read(f), sandbox, { filename: f });
  }
  // el Engine necesita SQL ya resuelto
  await sandbox.Engine.ready();

  const lessonFiles = fs.readdirSync(path.join(root, 'public/data/lessons')).sort();
  for (const f of lessonFiles) vm.runInContext(read('public/data/lessons/' + f), sandbox, { filename: f });
  const i18nFiles = fs.readdirSync(path.join(root, 'public/data/i18n')).sort();
  for (const f of i18nFiles) vm.runInContext(read('public/data/i18n/' + f), sandbox, { filename: f });

  const { CURSO, Engine, Checker } = sandbox;
  let totalTasks = 0, failures = 0, lessonsWithEx = 0;

  for (const lesson of CURSO.ordered()) {
    const ex = lesson.exercise;
    if (!ex) continue;
    if (ex.type === 'quiz') continue;
    lessonsWithEx++;
    let db;
    try {
      db = Engine.create(ex.dataset);
      if (ex.preload) Object.values(ex.preload).forEach(s => db.run(s));
    } catch (e) {
      console.log(`✗ ${lesson.slug}: no se pudo preparar la base — ${e.message}`);
      failures++;
      continue;
    }

    ex.tasks.forEach((task, i) => {
      totalTasks++;
      const label = `${lesson.slug} · tarea ${i + 1}`;
      let results;
      try {
        results = Engine.run(db, task.solution);
      } catch (e) {
        console.log(`✗ ${label}: excepción al ejecutar la solución — ${e.message}`);
        failures++; return;
      }
      const errored = results.find(r => r.error);
      if (errored && !task.expectsError) {
        console.log(`✗ ${label}: la solución falló — ${errored.error}\n    ${errored.sql.slice(0, 120)}`);
        failures++; return;
      }
      const withRows = results.filter(r => r.columns);
      const userRes = withRows.length ? withRows[withRows.length - 1] : { columns: [], values: [] };
      const verdict = Checker.verify(task, { db, userRes, task, userSql: task.solution });
      if (!verdict.ok) {
        console.log(`✗ ${label}: la verificación rechazó la solución — ${String(verdict.reason).replace(/<[^>]+>/g, '')}`);
        failures++; return;
      }
      // aplica la acción posterior, como haría la interfaz
      const pva = task.postValidateAction;
      if (pva) {
        if (pva.runActionOnce) { try { db.run(pva.runActionOnce); } catch (e) { console.log(`  ! ${label}: runActionOnce falló — ${e.message}`); } }
        if (pva.resultQuery) { try { Engine.query(db, pva.resultQuery); } catch (e) { console.log(`✗ ${label}: resultQuery falló — ${e.message}`); failures++; } }
      }
    });
    db.close();
  }

  console.log(`\n${CURSO.ordered().length} temas · ${lessonsWithEx} con ejercicio · ${totalTasks} tareas · ${failures} fallo(s)`);
  process.exit(failures ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
