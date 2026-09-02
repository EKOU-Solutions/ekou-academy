/* Comprueba la sección Java, los quizzes y su progreso persistente sin navegador. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const store = new Map();

const sandbox = {
  console,
  localStorage: {
    getItem: key => store.has(key) ? store.get(key) : null,
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: key => store.delete(key)
  },
  document: {
    documentElement: { setAttribute() {} },
    dispatchEvent() {}
  },
  CustomEvent: function CustomEvent(type) { this.type = type; }
};
sandbox.window = sandbox;
vm.createContext(sandbox);

['public/assets/js/i18n.js', 'public/assets/js/registry.js', 'public/assets/js/quiz.js', 'public/assets/js/ui.js']
  .forEach(f => vm.runInContext(read(f), sandbox, { filename: f }));
['public/data/lessons/39-java-basics.js', 'public/data/lessons/40-java-basics-exam.js']
  .forEach(f => vm.runInContext(read(f), sandbox, { filename: f }));

const { CURSO, Quiz, UI } = sandbox;
let failures = 0;
function assert(condition, message) {
  if (!condition) { console.log('✗ ' + message); failures++; }
}

const index = read('src/pages/index.astro');
assert(index.includes('data/lessons/39-java-basics.js') && index.includes('data/lessons/40-java-basics-exam.js'), 'index.astro carga las dos lecciones Java');
assert(index.includes('data/i18n/en-10-java.js') && index.includes('assets/js/quiz.js'), 'index.astro carga traducciones y lógica de quiz');

const javaSection = CURSO.SECTIONS.find(section => section.id === 'java');
const javaLessons = CURSO.bySection().find(group => group.section.id === 'java');
const lesson = CURSO.get('java-basics');
const exam = CURSO.get('java-basics-exam');
assert(javaSection && javaSection.name === 'Java', 'existe la sección Java');
assert(javaLessons && javaLessons.items.map(item => item.slug).join(',') === 'java-basics,java-basics-exam', 'Java contiene la lección y el examen en orden');
assert(lesson && exam && CURSO.next(lesson.slug) === exam && CURSO.prev(exam.slug) === lesson, 'la navegación conecta lección y examen');
assert(lesson && lesson.title === 'Lección 1: Java Basics', 'Java Basics empieza como lección 1 de Java, no como lección 39 de SQL');
assert(read('public/data/i18n/en-10-java.js').includes("title: 'Lesson 1: Java Basics'"), 'la traducción inglesa conserva la numeración propia de Java');
assert(lesson.exercise.type === 'quiz' && lesson.exercise.tasks.length === 6, 'Java Basics tiene seis checkpoints interactivos');
assert(exam.exercise.type === 'quiz' && exam.exercise.tasks.length === 8, 'el examen tiene ocho preguntas');
['.java', 'javac', 'bytecode', 'JAVA_HOME', 'PATH', 'java --version', 'javac --version', 'Hello.java', 'java Hello', 'Main-Class', 'Class Loader', 'verification', 'preparation', 'resolution', 'initialization', 'Method Area', 'Heap', 'Stack', 'PC Register', 'Interpreter', 'JIT', 'Garbage Collector'].forEach(term => {
  assert(lesson.body.includes(term), `la lección cubre ${term}`);
});

const requested = [
  '¿Qué función cumple el JDK?',
  '¿Qué función cumple <code>javac</code>?',
  '¿Qué es el bytecode?',
  '¿Qué hace el launcher <code>java</code> y qué hace la JVM?',
  '¿Por qué <code>javac</code> no pertenece a la JVM?',
  '¿Por qué el JRE ya no suele instalarse como producto independiente?',
  '¿Qué hace el Class Loader y qué diferencia hay entre linking e initialization?',
  '¿Qué significa PC Register y qué almacena?'
];
assert(requested.every((text, i) => exam.exercise.tasks[i].text === text), 'el examen conserva las ocho preguntas solicitadas');
assert(exam.exercise.tasks.every(task => task.options.length === 4 && task.explanation), 'cada pregunta tiene cuatro opciones y feedback');

const correctAnswers = exam.exercise.tasks.map(task => task.answer);
const wrongAnswers = correctAnswers.map((answer, i) => (answer + 1) % exam.exercise.tasks[i].options.length);
const fiveCorrect = correctAnswers.map((answer, i) => i < 5 ? answer : wrongAnswers[i]);
const sixCorrect = correctAnswers.map((answer, i) => i < 6 ? answer : wrongAnswers[i]);
assert(Quiz.score(exam.exercise.tasks, correctAnswers) === 8, 'la clave del examen puntúa 8/8');
assert(Quiz.score(exam.exercise.tasks, wrongAnswers) === 0, 'las respuestas incorrectas puntúan 0/8');
assert(!Quiz.passed(exam.exercise.tasks, fiveCorrect, exam.exercise.passingScore), '5/8 no aprueba');
assert(Quiz.passed(exam.exercise.tasks, sixCorrect, exam.exercise.passingScore), '6/8 aprueba');
assert(Quiz.requiredCorrect(8, exam.exercise.passingScore) === 6, 'el umbral de aprobación es 6/8');

UI.Progress.markAnswer(exam.slug, 0, correctAnswers[0]);
UI.Progress.markTask(exam.slug, 0);
let saved = UI.Progress.lesson(exam.slug);
assert(saved.answers[0] === correctAnswers[0] && saved.tasks[0] === true, 'se persiste la respuesta y la tarea correcta');
UI.Progress.unmarkTask(exam.slug, 0);
saved = UI.Progress.lesson(exam.slug);
assert(saved.answers[0] === correctAnswers[0] && !saved.tasks[0], 'se puede retirar una tarea al cambiar una respuesta');
UI.Progress.markDone(exam.slug);
assert(UI.Progress.lesson(exam.slug).done === true, 'se persiste el estado de finalización');
UI.Progress.reset();

console.log(`\nJava: ${failures ? failures + ' fallo(s)' : 'registro, navegación, quiz y persistencia correctos'}`);
process.exit(failures ? 1 : 0);
