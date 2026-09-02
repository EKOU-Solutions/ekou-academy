/* Internacionalización: cadenas de interfaz y traducciones del temario. */
(function () {
  const KEY = 'sqltotal:lang';
  const SUPPORTED = ['es', 'en'];

  const DICT = {
    es: {
      'html.lang': 'es',
      'site.title': 'EKOU Academy',
      'site.tagline': 'Notas interactivas de aprendizaje en público',
      'meta.description': 'Notas interactivas de aprendizaje en público: un recorrido de Senior Full-Stack Engineer a Staff Frontend Platform Engineer, con materias como SQL y Java.',

      'nav.course': 'Temas',
      'nav.reference': 'Referencia SQL',
      'nav.home': 'Inicio',
      'nav.sql': 'SQL',
      'nav.java': 'Java',
      'nav.primary': 'Navegación principal',
      'nav.breadcrumbs': 'Ruta de navegación',
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

      'home.eyebrow': 'PROYECTO PERSONAL DE APRENDIZAJE',
      'home.title': 'De Senior Full Stack a Staff Platform Engineer',
      'home.lead': 'EKOU Academy reúne las notas interactivas de mi camino desde Senior Full-Stack Engineer hacia Staff Frontend Platform Engineer. Cada materia es un cuaderno vivo: lo que estudio, lo que construyo y lo que quiero compartir para que otras personas puedan aprender conmigo.',
      'home.primaryCta': 'Explorar el proyecto',
      'home.secondaryCta': 'Ver temas',
      'home.projectKicker': 'EKOU / LEARNING PROJECT',
      'home.projectStatus': 'En evolución',
      'home.projectTitle': 'Aprender. Construir. Compartir.',
      'home.projectBody': 'Un espacio público de notas interactivas para convertir aprendizaje en evidencia de pensamiento de Staff.',
      'home.projectFoot': 'Senior → Staff',
      'home.overviewTitle': 'El proyecto en una mirada',
      'home.stats.subjects': 'materias activas',
      'home.stats.topics': 'temas disponibles',
      'home.stats.interactive': 'experiencias interactivas',
      'home.stats.progress': 'progreso actual',
      'home.stats.topicUnit': 'temas',
      'home.stats.doneUnit': 'completados',
      'home.subjectsKicker': 'CUADERNOS DE APRENDIZAJE',
      'home.subjectsTitle': 'Temas que estoy construyendo',
      'home.subjectsBody': 'Cada tema recoge conceptos, decisiones y práctica. El catálogo crecerá a medida que avance el roadmap.',
      'home.subject.sqlName': 'SQL',
      'home.subject.sqlLabel': 'Datos y fundamentos',
      'home.subject.sqlBody': 'Consultas, modelado, rendimiento y diseño de bases de datos, con práctica ejecutable en el navegador.',
      'home.subject.javaName': 'Java',
      'home.subject.javaLabel': 'Lenguaje y runtime',
      'home.subject.javaBody': 'JDK, JVM, bytecode y fundamentos para construir servicios backend con criterio.',
      'home.methodKicker': 'CÓMO FUNCIONA',
      'home.methodTitle': 'Notas que se pueden recorrer',
      'home.methodBody': 'No es un curso cerrado ni una colección de enlaces: es un registro de aprendizaje que se convierte en práctica reutilizable.',
      'home.method.oneTitle': 'Elijo una materia',
      'home.method.oneBody': 'Parto de una pregunta real y la convierto en un tema que pueda explicar.',
      'home.method.twoTitle': 'Lo hago interactivo',
      'home.method.twoBody': 'Añado ejemplos, decisiones, ejercicios y feedback para aprender haciendo.',
      'home.method.threeTitle': 'Lo dejo como evidencia',
      'home.method.threeBody': 'Cada cuaderno crece con entregables, notas y criterios que acercan el aprendizaje al nivel Staff.',
      'home.progressKicker': 'TU RECORRIDO',
      'home.progressTitle': 'Sigue desde donde estás',
      'home.progressBody': 'El progreso se guarda en este navegador. Puedes volver a cualquier materia cuando quieras.',
      'home.continueCta': 'Continuar aprendiendo',
      'home.futureKicker': 'LO QUE VIENE',
      'home.futureTitle': 'Un mapa que seguirá creciendo',
      'home.futureBody': 'La siguiente etapa incorporará más materias y entregables alrededor de plataforma, DX, IA asistida, comunicación técnica, observabilidad y visibilidad pública.',
      'home.future.spring': 'Spring Boot',
      'home.future.apis': 'Platform & DX',
      'home.future.architecture': 'RFCs / ADRs',
      'home.future.systems': 'IA · Observability',
      'home.start': 'Empezar el curso',
      'home.openPlayground': 'Abrir el Playground',
      'stats.topics': 'temas',
      'stats.withExercises': 'con ejercicios',
      'stats.datasets': 'bases de ejemplo',
      'stats.engine': 'en WebAssembly',
      'home.aboutTitle': 'Notas abiertas, aprendizaje en público',
      'home.aboutBody': 'Este sitio resume parte de lo que voy aprendiendo, construyendo y validando en mi evolución profesional. La intención es compartir el proceso con claridad: iremos sumando materias como SQL, Java, Spring Boot y otros temas de plataforma. Algunas bases de SQL parten del temario y los ejercicios de <a href="https://sqlbolt.com" target="_blank" rel="noopener">SQLBolt</a>; el resto del material está escrito y ampliado para este proyecto.',

      'card.sqlbolt': 'SQLBolt',
      'card.extra': 'Ampliación',
      'card.practice': 'práctica',
      'card.doneTitle': 'Tema completado',

      'course.sql.title': 'SQL de principio a fin',
      'course.sql.lead': 'Consultas, JOINs, agregados, DML, DDL, vistas, índices, transacciones, CTEs, funciones de ventana, triggers, procedimientos, diseño y rendimiento. Cada tema termina con un ejercicio evaluado contra una base de datos SQLite real dentro del navegador.',
      'course.java.title': 'Java de principio a fin',
      'course.java.lead': 'Código fuente, JDK, javac, bytecode, JVM, carga de clases, memoria y ejecución. Una introducción interactiva para entender qué ocurre desde el archivo .java hasta el runtime.',
      'course.start': 'Empezar',
      'course.playground': 'Abrir el Playground',
      'course.stats.topics': 'temas',
      'course.stats.exercises': 'con ejercicios',
      'course.stats.completed': 'completados',
      'course.stats.datasets': 'bases de ejemplo',
      'course.stats.engine': 'en WebAssembly',
      'course.stats.language': 'herramientas y lenguaje',
      'course.stats.runtime': 'runtime',
      'course.java.noteTitle': 'Sobre este cuaderno',
      'course.java.noteBody': 'Java es una línea de aprendizaje independiente dentro de EKOU Academy. Este cuaderno irá creciendo con fundamentos del lenguaje, runtime, backend y las herramientas que formen parte del recorrido.',

      'lesson.crumbCourse': 'Temas',
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

      'quiz.check': 'Comprobar respuesta',
      'quiz.next': 'Siguiente pregunta',
      'quiz.select': 'Selecciona una respuesta antes de continuar.',
      'quiz.correct': '¡Correcto!',
      'quiz.incorrect': 'Aún no.',
      'quiz.question': 'Pregunta {current} de {total}',
      'quiz.progress': '{done} de {total} correctas',
      'quiz.score': 'Puntuación: {got}/{total}',
      'quiz.passed': '¡Aprobado! Has conseguido {got}/{total} ({percent}%).',
      'quiz.failed': 'Necesitas {need}/{total} respuestas correctas para aprobar. Repasa el feedback e inténtalo de nuevo.',
      'quiz.examCriterion': 'Criterio de aprobación: {need}/{total} ({percent}%).',

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
      'section.java.name': 'Java',
      'section.java.hint': 'JDK, JVM y ejecución',
      'section.referencia.name': 'Referencia SQL',
      'section.referencia.hint': 'Sintaxis y equivalencias entre motores',

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
      'site.tagline': 'Interactive notes from a public learning journey',
      'meta.description': 'Interactive public learning notes from Senior Full-Stack Engineer to Staff Frontend Platform Engineer, with subjects such as SQL and Java.',

      'nav.course': 'Topics',
      'nav.reference': 'SQL reference',
      'nav.home': 'Home',
      'nav.sql': 'SQL',
      'nav.java': 'Java',
      'nav.primary': 'Primary navigation',
      'nav.breadcrumbs': 'Breadcrumb',
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

      'home.eyebrow': 'PERSONAL LEARNING PROJECT',
      'home.title': 'From Senior Full Stack to Staff Platform Engineer',
      'home.lead': 'EKOU Academy brings together the interactive notes from my journey from Senior Full-Stack Engineer to Staff Frontend Platform Engineer. Each subject is a living notebook: what I study, what I build, and what I want to share so other people can learn with me.',
      'home.primaryCta': 'Explore the project',
      'home.secondaryCta': 'View topics',
      'home.projectKicker': 'EKOU / LEARNING PROJECT',
      'home.projectStatus': 'In progress',
      'home.projectTitle': 'Learn. Build. Share.',
      'home.projectBody': 'A public space for interactive notes that turns learning into visible evidence of Staff-level thinking.',
      'home.projectFoot': 'Senior → Staff',
      'home.overviewTitle': 'The project at a glance',
      'home.stats.subjects': 'active subjects',
      'home.stats.topics': 'available topics',
      'home.stats.interactive': 'interactive experiences',
      'home.stats.progress': 'current progress',
      'home.stats.topicUnit': 'topics',
      'home.stats.doneUnit': 'completed',
      'home.subjectsKicker': 'LEARNING NOTEBOOKS',
      'home.subjectsTitle': 'Topics I am building',
      'home.subjectsBody': 'Each topic brings together concepts, decisions, and practice. The catalog will grow as the roadmap moves forward.',
      'home.subject.sqlName': 'SQL',
      'home.subject.sqlLabel': 'Data and foundations',
      'home.subject.sqlBody': 'Queries, modeling, performance, and database design, with practice that runs in the browser.',
      'home.subject.javaName': 'Java',
      'home.subject.javaLabel': 'Language and runtime',
      'home.subject.javaBody': 'JDK, JVM, bytecode, and the foundations for building backend services with intent.',
      'home.methodKicker': 'HOW IT WORKS',
      'home.methodTitle': 'Notes you can work through',
      'home.methodBody': 'This is not a closed course or a link collection. It is a learning record that becomes reusable practice.',
      'home.method.oneTitle': 'Choose a subject',
      'home.method.oneBody': 'Start from a real question and turn it into a topic you can explain.',
      'home.method.twoTitle': 'Make it interactive',
      'home.method.twoBody': 'Add examples, decisions, exercises, and feedback to learn by doing.',
      'home.method.threeTitle': 'Leave evidence behind',
      'home.method.threeBody': 'Each notebook grows with deliverables, notes, and criteria that move learning toward Staff level.',
      'home.progressKicker': 'YOUR JOURNEY',
      'home.progressTitle': 'Pick up where you left off',
      'home.progressBody': 'Progress is saved in this browser. Return to any subject whenever you like.',
      'home.continueCta': 'Continue learning',
      'home.futureKicker': 'WHAT IS NEXT',
      'home.futureTitle': 'A map that will keep growing',
      'home.futureBody': 'The next stages will add more subjects and deliverables around platform, DX, AI-assisted engineering, technical communication, observability, and public visibility.',
      'home.future.spring': 'Spring Boot',
      'home.future.apis': 'Platform & DX',
      'home.future.architecture': 'RFCs / ADRs',
      'home.future.systems': 'AI · Observability',
      'home.start': 'Start the course',
      'home.openPlayground': 'Open the Playground',
      'stats.topics': 'topics',
      'stats.withExercises': 'with exercises',
      'stats.datasets': 'sample databases',
      'stats.engine': 'in WebAssembly',
      'home.aboutTitle': 'Open notes, learning in public',
      'home.aboutBody': 'This site summarizes part of what I am learning, building, and validating throughout my professional growth. The goal is to share the process clearly: subjects such as SQL, Java, Spring Boot, and more platform topics will be added over time. Some SQL foundations start from the <a href="https://sqlbolt.com" target="_blank" rel="noopener">SQLBolt</a> syllabus and exercises; the rest is written and extended for this project.',

      'card.sqlbolt': 'SQLBolt',
      'card.extra': 'Extension',
      'card.practice': 'practice',
      'card.doneTitle': 'Topic completed',

      'course.sql.title': 'SQL from start to finish',
      'course.sql.lead': 'Queries, JOINs, aggregates, DML, DDL, views, indexes, transactions, CTEs, window functions, triggers, procedures, design and performance. Every topic ends in an exercise graded against a real SQLite database inside your browser.',
      'course.java.title': 'Java from start to finish',
      'course.java.lead': 'Source code, the JDK, javac, bytecode, the JVM, class loading, memory, and execution. An interactive introduction to what happens from a .java file to runtime.',
      'course.start': 'Start',
      'course.playground': 'Open the Playground',
      'course.stats.topics': 'topics',
      'course.stats.exercises': 'with exercises',
      'course.stats.completed': 'completed',
      'course.stats.datasets': 'sample databases',
      'course.stats.engine': 'in WebAssembly',
      'course.stats.language': 'language and tools',
      'course.stats.runtime': 'runtime',
      'course.java.noteTitle': 'About this notebook',
      'course.java.noteBody': 'Java is an independent learning track inside EKOU Academy. This notebook will grow with language fundamentals, runtime concepts, backend, and the tools that belong to the journey.',

      'lesson.crumbCourse': 'Topics',
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

      'quiz.check': 'Check answer',
      'quiz.next': 'Next question',
      'quiz.select': 'Select an answer before continuing.',
      'quiz.correct': 'Correct!',
      'quiz.incorrect': 'Not quite.',
      'quiz.question': 'Question {current} of {total}',
      'quiz.progress': '{done} of {total} correct',
      'quiz.score': 'Score: {got}/{total}',
      'quiz.passed': 'Passed! You scored {got}/{total} ({percent}%).',
      'quiz.failed': 'You need {need}/{total} correct answers to pass. Review the feedback and try again.',
      'quiz.examCriterion': 'Passing criterion: {need}/{total} ({percent}%).',

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
      'section.java.name': 'Java',
      'section.java.hint': 'JDK, JVM and execution',
      'section.referencia.name': 'SQL reference',
      'section.referencia.hint': 'Syntax and cross-engine equivalences',

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
            if (task.options && (!tr || !Array.isArray(tr.options) || tr.options.length !== task.options.length)) {
              gaps.push(`${l.slug}: faltan opciones de la tarea ${i + 1}`);
            }
            if (task.explanation && (!tr || !tr.explanation)) {
              gaps.push(`${l.slug}: falta explicación de la tarea ${i + 1}`);
            }
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
