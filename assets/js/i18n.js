/* Internacionalización: cadenas de interfaz y traducciones del temario. */
(function () {
  const KEY = 'sqltotal:lang';
  const SUPPORTED = ['es', 'en'];

  const DICT = {
    es: {
      'html.lang': 'es',
      'site.title': 'EKOU Academy',
      'site.tagline': 'Curso interactivo de SQL con Playground',
      'meta.description': 'Curso interactivo de SQL en español: consultas, JOINs, agregados, DML, DDL, vistas, índices, transacciones, CTEs, funciones de ventana, triggers, procedimientos almacenados y funciones. Incluye un playground SQL en el navegador.',

      'nav.course': 'Curso',
      'nav.reference': 'Referencia',
      'nav.playground': 'Playground',
      'nav.menu': 'Abrir menú',
      'nav.theme': 'Cambiar tema',
      'nav.lang': 'Idioma',
      'nav.progress': 'Lecciones completadas',
      'nav.refTag': 'ref',
      'nav.refTagTitle': 'Tema de referencia, sin ejercicio',

      'search.placeholder': 'Buscar tema… (/)',
      'search.noMatch': 'Ningún tema coincide con la búsqueda.',
      'progress.reset': 'Reiniciar progreso',
      'progress.resetConfirm': '¿Borrar todo el progreso guardado en este navegador?',
      'progress.resetDone': 'Progreso reiniciado',

      'home.title': 'Aprende SQL de principio a fin',
      'home.lead': 'Curso interactivo en español basado en el temario de SQLBolt, ampliado con vistas, índices, transacciones, funciones, funciones de ventana, disparadores, procedimientos almacenados y diseño de bases de datos. Todo se ejecuta en tu navegador con SQLite: no hay servidor ni instalación.',
      'home.start': 'Empezar el curso',
      'home.openPlayground': 'Abrir el Playground',
      'stats.topics': 'temas',
      'stats.withExercises': 'con ejercicios',
      'stats.datasets': 'bases de ejemplo',
      'stats.engine': 'en WebAssembly',
      'home.aboutTitle': 'Sobre los contenidos',
      'home.aboutBody': 'Las lecciones 1 a 18 y los temas de subconsultas y operaciones de conjunto reproducen el temario y los ejercicios de <a href="https://sqlbolt.com" target="_blank" rel="noopener">SQLBolt</a>, incluidas sus bases de datos de ejemplo. El resto de temas — marcados como <em>Ampliación</em> — son material nuevo escrito para este sitio. El volcado íntegro de la copia original está en <code>data/raw/</code>.',

      'card.sqlbolt': 'SQLBolt',
      'card.extra': 'Ampliación',
      'card.practice': 'práctica',

      'lesson.crumbCourse': 'Curso',
      'lesson.noExercise': 'Este tema es de referencia. ',
      'lesson.tryPlayground': 'Pruébalo en el Playground →',

      'ex.run': 'Ejecutar ⌘⏎',
      'ex.clearQuery': 'Limpiar consulta',
      'ex.resetData': 'Reiniciar datos',
      'ex.resetDataTitle': 'Vuelve a cargar los datos originales',
      'ex.dataset': 'Base: {name}',
      'ex.tabResult': 'Resultado',
      'ex.tasks': 'Tareas',
      'ex.hint': 'Pista',
      'ex.showSolution': 'Ver solución',
      'ex.solutionLoaded': 'Solución cargada en el editor. Ejecútala para ver el resultado.',
      'ex.correct': '¡Correcto!',
      'ex.completed': '¡Ejercicio completado! 🎉',
      'ex.continueDisabled': 'Completa las tareas',
      'ex.continueTo': 'Continuar → {title}',
      'ex.courseDone': '¡Curso completado!',
      'ex.notYet': 'Todavía no: {reason}',
      'ex.defaultFail': 'el resultado no coincide con lo pedido.',
      'ex.sqlError': 'Error de SQL: {msg}',
      'ex.writeSomething': 'Escribe una consulta antes de ejecutar.',
      'ex.stmtRun': 'Sentencia ejecutada. {reason}',
      'ex.stmtRunRows': 'Sentencia ejecutada ({n} fila(s) afectadas). {reason}',
      'ex.expectedRejection': 'La sentencia se ha ejecutado sin error, pero esta tarea espera que la base de datos la <strong>rechace</strong>.',
      'ex.rejected': 'La base de datos rechazó la sentencia: {msg}',
      'ex.dataRestored': 'Datos restaurados a su estado inicial.',
      'ex.runToSee': 'Ejecuta una consulta para ver el resultado.',
      'toast.lessonDone': 'Lección completada: {title}',

      'result.noColumns': 'La consulta no ha devuelto columnas.',
      'result.moreRows': '… {n} fila(s) más no mostradas',
      'editor.placeholder': 'Escribe aquí tu consulta SQL…',

      'pg.title': 'Playground SQL',
      'pg.lead': 'Un SQLite completo dentro del navegador. Elige una base de ejemplo o crea la tuya, escribe varias sentencias separadas por punto y coma y ejecútalas con ⌘/Ctrl + Enter. Puedes practicar aquí todo lo que aparece en el curso: consultas, DDL, transacciones, vistas, índices, disparadores, CTEs, funciones de ventana y funciones definidas por el usuario.',
      'pg.data': 'Datos',
      'pg.examples': 'Ejemplos',
      'pg.loadExample': 'Cargar ejemplo…',
      'pg.emptyDb': 'Base vacía',
      'pg.run': 'Ejecutar ⌘⏎',
      'pg.runSelection': 'Ejecutar selección',
      'pg.runSelectionTitle': 'Ejecuta solo el texto seleccionado',
      'pg.resetDb': 'Reiniciar base',
      'pg.saveQuery': 'Guardar consulta',
      'pg.import': 'Importar…',
      'pg.export': 'Exportar…',
      'pg.exportCsv': 'Resultado a CSV',
      'pg.exportDb': 'Base a .sqlite',
      'pg.exportSql': 'Script a .sql',
      'pg.schema': 'Esquema',
      'pg.schemaEmpty': 'La base está vacía. Crea tablas con CREATE TABLE.',
      'pg.tables': 'Tablas',
      'pg.views': 'Vistas',
      'pg.indexes': 'Índices',
      'pg.triggers': 'Disparadores',
      'pg.mySnippets': 'Mis consultas',
      'pg.snippetsEmpty': 'Guarda una consulta para tenerla siempre a mano.',
      'pg.ready': 'Listo.',
      'pg.nothingToRun': 'Nada que ejecutar.',
      'pg.runToSee': 'Ejecuta una consulta para ver los resultados aquí.',
      'pg.stmtsIn': '{n} sentencia(s) en {ms} ms',
      'pg.stmtsOk': 'Sentencias ejecutadas correctamente.',
      'pg.rowsAffected': '{n} fila(s) afectadas',
      'pg.rows': '{n} fila(s)',
      'pg.dbLoaded': 'Base cargada: {name}',
      'pg.dbReset': 'Base reiniciada.',
      'pg.nothingToSave': 'No hay nada que guardar',
      'pg.snippetName': 'Nombre de la consulta:',
      'pg.snippetDefault': 'Consulta {n}',
      'pg.snippetSaved': 'Consulta guardada',
      'pg.deleteSnippet': 'Eliminar',
      'pg.runFirst': 'Ejecuta primero una consulta con resultados',
      'pg.nothingToExport': 'Sin resultados que exportar',
      'pg.scriptLoaded': 'Script cargado en el editor',
      'pg.dbImported': 'Base de datos importada',
      'pg.dbImportError': 'No se pudo abrir el archivo: {msg}',
      'pg.editorPlaceholder': 'Escribe SQL. Varias sentencias separadas por ; — Ctrl/⌘+Enter para ejecutar.',
      'pg.error': 'Error: {msg}',

      'pg.group.basic': 'Básico',
      'pg.group.agg': 'Agregados',
      'pg.group.fn': 'Funciones',
      'pg.group.adv': 'Avanzado',
      'pg.group.ddl': 'DDL',
      'pg.ex.select': 'SELECT con filtro y orden',
      'pg.ex.join3': 'JOIN de tres tablas',
      'pg.ex.revenue': 'Facturación por categoría',
      'pg.ex.dates': 'Funciones de fecha',
      'pg.ex.window': 'Funciones de ventana',
      'pg.ex.udf': 'Función definida por el usuario (JS)',
      'pg.ex.cte': 'CTE recursiva: jerarquía de empleados',
      'pg.ex.viewIndex': 'Vista + índice + plan de ejecución',
      'pg.ex.savepoint': 'Transacción con SAVEPOINT',
      'pg.ex.trigger': 'Trigger de auditoría',
      'pg.ex.sets': 'Conjuntos: UNION / INTERSECT / EXCEPT',
      'pg.ex.createTable': 'Crear tabla con restricciones',

      'nf.title': 'Página no encontrada',
      'nf.body': 'Ese tema no existe.',
      'nf.back': 'Volver al índice',
      'boot.loading': 'Cargando motor SQLite…',
      'boot.failTitle': 'No se pudo cargar SQLite',
      'boot.failBody': 'El motor WebAssembly no ha podido inicializarse. Abre el sitio desde un servidor HTTP (por ejemplo <code>python3 -m http.server</code>) en lugar de con <code>file://</code>.',

      'section.fundamentos.name': 'Fundamentos',
      'section.fundamentos.hint': 'De cero a SELECT',
      'section.multitabla.name': 'Consultas multitabla',
      'section.multitabla.hint': 'JOINs, NULLs y expresiones',
      'section.agregados.name': 'Agregados y ejecución',
      'section.agregados.hint': 'GROUP BY, HAVING, orden de ejecución',
      'section.dml.name': 'Modificar datos (DML)',
      'section.dml.hint': 'INSERT, UPDATE, DELETE',
      'section.ddl.name': 'Definir el esquema (DDL)',
      'section.ddl.hint': 'CREATE, ALTER, DROP',
      'section.intermedio.name': 'SQL intermedio',
      'section.intermedio.hint': 'Subconsultas, conjuntos, CASE',
      'section.funciones.name': 'Funciones',
      'section.funciones.hint': 'Escalares, fechas, ventana',
      'section.objetos.name': 'Objetos de base de datos',
      'section.objetos.hint': 'Vistas, índices, restricciones',
      'section.programacion.name': 'Programación en la base de datos',
      'section.programacion.hint': 'Transacciones, triggers, procedimientos',
      'section.diseno.name': 'Diseño y rendimiento',
      'section.diseno.hint': 'Normalización, planes de ejecución',
      'section.referencia.name': 'Referencia',
      'section.referencia.hint': 'Chuleta y equivalencias entre motores',

      'chk.noResultTable': 'La consulta no ha devuelto ninguna tabla de resultados.',
      'chk.rowCount': 'Se esperaban {want} fila(s) y la consulta ha devuelto {got}.',
      'chk.missingColumn': 'Falta una columna con los valores de <code>{col}</code>.',
      'chk.missingColumnOrdered': 'Falta una columna con los valores de <code>{col}</code> en el orden correcto.',
      'chk.solutionFailed': 'No se ha podido ejecutar la solución de referencia: {msg}',
      'chk.exactColumns': 'Se esperaban exactamente estas columnas: <code>{cols}</code>.',
      'chk.shouldHaveFailed': 'La comprobación esperaba que la consulta fallase y ha funcionado.',
      'chk.rowsLeft': 'Todavía quedan {n} fila(s) que deberían haber desaparecido.',
      'chk.rowsExpected': 'Se esperaban al menos {min} fila(s) y hay {n}.',
      'chk.rowMissing': 'No se encuentra ninguna fila con <code>{col} = \'{val}\'</code> en <code>{table}</code>.',
      'chk.needColumns': 'El resultado debe incluir las columnas <code>{a}</code> y <code>{b}</code>.',
      'chk.notGreater': 'Hay filas donde <code>{a}</code> es menor que <code>{b}</code>.',
      'chk.objectMissing': 'No existe ningún objeto de tipo <code>{type}</code> llamado <code>{name}</code>.',
      'chk.checkRowCount': 'La comprobación <code>{query}</code> esperaba {want} fila(s) y ha obtenido {got}.',
      'chk.rowDiffers': 'Fila {i} distinta de la esperada (esperado: <code>{want}</code>).',
      'chk.scalarDiffers': 'Se esperaba <code>{want}</code> y se ha obtenido <code>{got}</code>.',
      'chk.mustUse': 'La consulta debe usar <code>{needle}</code>.'
    },

    en: {
      'html.lang': 'en',
      'site.title': 'EKOU Academy',
      'site.tagline': 'Interactive SQL course with a Playground',
      'meta.description': 'Interactive SQL course: queries, JOINs, aggregates, DML, DDL, views, indexes, transactions, CTEs, window functions, triggers, stored procedures and functions. Includes an SQL playground that runs in your browser.',

      'nav.course': 'Course',
      'nav.reference': 'Reference',
      'nav.playground': 'Playground',
      'nav.menu': 'Open menu',
      'nav.theme': 'Toggle theme',
      'nav.lang': 'Language',
      'nav.progress': 'Lessons completed',
      'nav.refTag': 'ref',
      'nav.refTagTitle': 'Reference topic, no exercise',

      'search.placeholder': 'Search a topic… (/)',
      'search.noMatch': 'No topic matches your search.',
      'progress.reset': 'Reset progress',
      'progress.resetConfirm': 'Delete all progress saved in this browser?',
      'progress.resetDone': 'Progress reset',

      'home.title': 'Learn SQL from start to finish',
      'home.lead': 'An interactive course based on the SQLBolt syllabus, extended with views, indexes, transactions, functions, window functions, triggers, stored procedures and database design. Everything runs in your browser on SQLite: no server, no installation.',
      'home.start': 'Start the course',
      'home.openPlayground': 'Open the Playground',
      'stats.topics': 'topics',
      'stats.withExercises': 'with exercises',
      'stats.datasets': 'sample databases',
      'stats.engine': 'in WebAssembly',
      'home.aboutTitle': 'About the content',
      'home.aboutBody': 'Lessons 1 to 18 and the subqueries and set-operations topics reproduce the syllabus and exercises of <a href="https://sqlbolt.com" target="_blank" rel="noopener">SQLBolt</a>, including its sample databases. Every other topic — tagged <em>Extension</em> — is new material written for this site. The complete dump of the original copy lives in <code>data/raw/</code>.',

      'card.sqlbolt': 'SQLBolt',
      'card.extra': 'Extension',
      'card.practice': 'practice',

      'lesson.crumbCourse': 'Course',
      'lesson.noExercise': 'This is a reference topic. ',
      'lesson.tryPlayground': 'Try it in the Playground →',

      'ex.run': 'Run ⌘⏎',
      'ex.clearQuery': 'Clear query',
      'ex.resetData': 'Reset data',
      'ex.resetDataTitle': 'Reload the original data',
      'ex.dataset': 'Database: {name}',
      'ex.tabResult': 'Result',
      'ex.tasks': 'Tasks',
      'ex.hint': 'Hint',
      'ex.showSolution': 'Show solution',
      'ex.solutionLoaded': 'Solution loaded into the editor. Run it to see the result.',
      'ex.correct': 'Correct!',
      'ex.completed': 'Exercise completed! 🎉',
      'ex.continueDisabled': 'Finish the tasks',
      'ex.continueTo': 'Continue → {title}',
      'ex.courseDone': 'Course completed!',
      'ex.notYet': 'Not yet: {reason}',
      'ex.defaultFail': 'the result does not match what was asked.',
      'ex.sqlError': 'SQL error: {msg}',
      'ex.writeSomething': 'Write a query before running it.',
      'ex.stmtRun': 'Statement executed. {reason}',
      'ex.stmtRunRows': 'Statement executed ({n} row(s) affected). {reason}',
      'ex.expectedRejection': 'The statement ran without an error, but this task expects the database to <strong>reject</strong> it.',
      'ex.rejected': 'The database rejected the statement: {msg}',
      'ex.dataRestored': 'Data restored to its initial state.',
      'ex.runToSee': 'Run a query to see the result.',
      'toast.lessonDone': 'Lesson completed: {title}',

      'result.noColumns': 'The query returned no columns.',
      'result.moreRows': '… {n} more row(s) not shown',
      'editor.placeholder': 'Write your SQL query here…',

      'pg.title': 'SQL Playground',
      'pg.lead': 'A full SQLite inside your browser. Pick a sample database or build your own, write several statements separated by semicolons and run them with ⌘/Ctrl + Enter. You can practise everything the course covers here: queries, DDL, transactions, views, indexes, triggers, CTEs, window functions and user-defined functions.',
      'pg.data': 'Data',
      'pg.examples': 'Examples',
      'pg.loadExample': 'Load an example…',
      'pg.emptyDb': 'Empty database',
      'pg.run': 'Run ⌘⏎',
      'pg.runSelection': 'Run selection',
      'pg.runSelectionTitle': 'Runs only the selected text',
      'pg.resetDb': 'Reset database',
      'pg.saveQuery': 'Save query',
      'pg.import': 'Import…',
      'pg.export': 'Export…',
      'pg.exportCsv': 'Result to CSV',
      'pg.exportDb': 'Database to .sqlite',
      'pg.exportSql': 'Script to .sql',
      'pg.schema': 'Schema',
      'pg.schemaEmpty': 'The database is empty. Create tables with CREATE TABLE.',
      'pg.tables': 'Tables',
      'pg.views': 'Views',
      'pg.indexes': 'Indexes',
      'pg.triggers': 'Triggers',
      'pg.mySnippets': 'My queries',
      'pg.snippetsEmpty': 'Save a query to keep it handy.',
      'pg.ready': 'Ready.',
      'pg.nothingToRun': 'Nothing to run.',
      'pg.runToSee': 'Run a query to see the results here.',
      'pg.stmtsIn': '{n} statement(s) in {ms} ms',
      'pg.stmtsOk': 'Statements executed successfully.',
      'pg.rowsAffected': '{n} row(s) affected',
      'pg.rows': '{n} row(s)',
      'pg.dbLoaded': 'Database loaded: {name}',
      'pg.dbReset': 'Database reset.',
      'pg.nothingToSave': 'There is nothing to save',
      'pg.snippetName': 'Query name:',
      'pg.snippetDefault': 'Query {n}',
      'pg.snippetSaved': 'Query saved',
      'pg.deleteSnippet': 'Delete',
      'pg.runFirst': 'Run a query that returns rows first',
      'pg.nothingToExport': 'No results to export',
      'pg.scriptLoaded': 'Script loaded into the editor',
      'pg.dbImported': 'Database imported',
      'pg.dbImportError': 'Could not open the file: {msg}',
      'pg.editorPlaceholder': 'Write SQL. Several statements separated by ; — Ctrl/⌘+Enter to run.',
      'pg.error': 'Error: {msg}',

      'pg.group.basic': 'Basics',
      'pg.group.agg': 'Aggregates',
      'pg.group.fn': 'Functions',
      'pg.group.adv': 'Advanced',
      'pg.group.ddl': 'DDL',
      'pg.ex.select': 'SELECT with a filter and an order',
      'pg.ex.join3': 'Joining three tables',
      'pg.ex.revenue': 'Revenue by category',
      'pg.ex.dates': 'Date functions',
      'pg.ex.window': 'Window functions',
      'pg.ex.udf': 'User-defined function (JS)',
      'pg.ex.cte': 'Recursive CTE: employee hierarchy',
      'pg.ex.viewIndex': 'View + index + query plan',
      'pg.ex.savepoint': 'Transaction with a SAVEPOINT',
      'pg.ex.trigger': 'Audit trigger',
      'pg.ex.sets': 'Set operations: UNION / INTERSECT / EXCEPT',
      'pg.ex.createTable': 'Create a table with constraints',

      'nf.title': 'Page not found',
      'nf.body': 'That topic does not exist.',
      'nf.back': 'Back to the index',
      'boot.loading': 'Loading the SQLite engine…',
      'boot.failTitle': 'SQLite could not be loaded',
      'boot.failBody': 'The WebAssembly engine failed to start. Open the site from an HTTP server (for example <code>python3 -m http.server</code>) instead of <code>file://</code>.',

      'section.fundamentos.name': 'Fundamentals',
      'section.fundamentos.hint': 'From zero to SELECT',
      'section.multitabla.name': 'Multi-table queries',
      'section.multitabla.hint': 'JOINs, NULLs and expressions',
      'section.agregados.name': 'Aggregates and execution',
      'section.agregados.hint': 'GROUP BY, HAVING, order of execution',
      'section.dml.name': 'Changing data (DML)',
      'section.dml.hint': 'INSERT, UPDATE, DELETE',
      'section.ddl.name': 'Defining the schema (DDL)',
      'section.ddl.hint': 'CREATE, ALTER, DROP',
      'section.intermedio.name': 'Intermediate SQL',
      'section.intermedio.hint': 'Subqueries, set operations, CASE',
      'section.funciones.name': 'Functions',
      'section.funciones.hint': 'Scalar, date, window',
      'section.objetos.name': 'Database objects',
      'section.objetos.hint': 'Views, indexes, constraints',
      'section.programacion.name': 'Programming the database',
      'section.programacion.hint': 'Transactions, triggers, procedures',
      'section.diseno.name': 'Design and performance',
      'section.diseno.hint': 'Normalization, execution plans',
      'section.referencia.name': 'Reference',
      'section.referencia.hint': 'Cheat sheet and cross-engine equivalences',

      'chk.noResultTable': 'The query did not return a result table.',
      'chk.rowCount': 'Expected {want} row(s), the query returned {got}.',
      'chk.missingColumn': 'A column with the values of <code>{col}</code> is missing.',
      'chk.missingColumnOrdered': 'A column with the values of <code>{col}</code> in the right order is missing.',
      'chk.solutionFailed': 'The reference solution could not be run: {msg}',
      'chk.exactColumns': 'Exactly these columns were expected: <code>{cols}</code>.',
      'chk.shouldHaveFailed': 'The check expected the query to fail, but it succeeded.',
      'chk.rowsLeft': 'There are still {n} row(s) that should be gone.',
      'chk.rowsExpected': 'At least {min} row(s) were expected and there are {n}.',
      'chk.rowMissing': 'No row with <code>{col} = \'{val}\'</code> found in <code>{table}</code>.',
      'chk.needColumns': 'The result must include the columns <code>{a}</code> and <code>{b}</code>.',
      'chk.notGreater': 'There are rows where <code>{a}</code> is smaller than <code>{b}</code>.',
      'chk.objectMissing': 'There is no <code>{type}</code> named <code>{name}</code>.',
      'chk.checkRowCount': 'The check <code>{query}</code> expected {want} row(s) and got {got}.',
      'chk.rowDiffers': 'Row {i} differs from the expected one (expected: <code>{want}</code>).',
      'chk.scalarDiffers': 'Expected <code>{want}</code> but got <code>{got}</code>.',
      'chk.mustUse': 'The query must use <code>{needle}</code>.'
    }
  };

  /* traducciones del temario: { en: { slug: {title, shortTitle, summary, body, exerciseTitle, tasks:[…]} } } */
  const LESSONS = { en: Object.create(null) };

  function detect() {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved && SUPPORTED.includes(saved)) return saved;
    } catch (e) { /* modo privado o entorno sin localStorage */ }
    // fuera del navegador (Node, pruebas) no hay navigator: se asume español
    const pref = typeof navigator !== 'undefined' ? navigator.language : null;
    const nav = (pref || 'es').slice(0, 2).toLowerCase();
    return SUPPORTED.includes(nav) ? nav : 'es';
  }

  let lang = detect();

  function t(key, params) {
    const table = DICT[lang] || DICT.es;
    let s = table[key];
    if (s === undefined) s = DICT.es[key];
    if (s === undefined) return key;
    if (params) {
      s = s.replace(/\{(\w+)\}/g, (m, k) => (params[k] === undefined ? m : params[k]));
    }
    return s;
  }

  /* Devuelve un campo de una lección en el idioma activo, con el español como respaldo. */
  function field(lesson, name) {
    if (!lesson) return '';
    const over = LESSONS[lang] && LESSONS[lang][lesson.slug];
    if (over && over[name] != null) return over[name];
    return lesson[name];
  }

  /* Igual para las tareas del ejercicio ('text', 'hint'). */
  function taskField(lesson, index, name) {
    const over = LESSONS[lang] && LESSONS[lang][lesson.slug];
    const task = lesson.exercise && lesson.exercise.tasks[index];
    if (over && over.tasks && over.tasks[index] && over.tasks[index][name] != null) {
      return over.tasks[index][name];
    }
    return task ? task[name] : undefined;
  }

  function exerciseTitle(lesson) {
    const over = LESSONS[lang] && LESSONS[lang][lesson.slug];
    if (over && over.exerciseTitle) return over.exerciseTitle;
    return (lesson.exercise && lesson.exercise.title) || t('ex.tasks');
  }

  function datasetField(dataset, name) {
    if (!dataset) return '';
    if (lang !== 'es' && dataset.i18n && dataset.i18n[lang] && dataset.i18n[lang][name] != null) {
      return dataset.i18n[lang][name];
    }
    return dataset[name];
  }

  const I18N = {
    SUPPORTED,
    get lang() { return lang; },
    set(next) {
      if (!SUPPORTED.includes(next) || next === lang) return false;
      lang = next;
      try { localStorage.setItem(KEY, next); } catch (e) { /* modo privado */ }
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.setAttribute('lang', t('html.lang'));
        document.dispatchEvent(new CustomEvent('lang:changed', { detail: next }));
      }
      return true;
    },
    t, field, taskField, exerciseTitle, datasetField,
    registerLessons(code, table) {
      LESSONS[code] = LESSONS[code] || Object.create(null);
      Object.assign(LESSONS[code], table);
    },
    /* Para las pruebas: qué traducciones faltan. */
    missing(code, lessons) {
      const table = LESSONS[code] || {};
      const gaps = [];
      lessons.forEach(l => {
        const o = table[l.slug];
        if (!o) { gaps.push(`${l.slug}: sin traducción`); return; }
        ['title', 'shortTitle', 'summary', 'body'].forEach(f => {
          if (!o[f]) gaps.push(`${l.slug}: falta ${f}`);
        });
        if (l.exercise) {
          if (!o.exerciseTitle) gaps.push(`${l.slug}: falta exerciseTitle`);
          l.exercise.tasks.forEach((task, i) => {
            const tr = o.tasks && o.tasks[i];
            if (!tr || !tr.text) gaps.push(`${l.slug}: falta texto de la tarea ${i + 1}`);
            else if (task.hint && !tr.hint) gaps.push(`${l.slug}: falta pista de la tarea ${i + 1}`);
          });
        }
      });
      return gaps;
    }
  };

  window.I18N = I18N;
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('lang', t('html.lang'));
  }
})();
