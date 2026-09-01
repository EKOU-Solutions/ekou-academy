/* Comprueba el dashboard público, la separación del Playground y la narrativa del roadmap. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const store = new Map();
const sandbox = {
  console,
  CustomEvent: function CustomEvent(type) { this.type = type; },
  localStorage: { getItem: key => store.get(key) || null, setItem: (key, value) => store.set(key, value) },
  document: { documentElement: { setAttribute() {} }, dispatchEvent() {} }
};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(read('assets/js/i18n.js'), sandbox, { filename: 'assets/js/i18n.js' });
vm.runInContext(read('assets/js/registry.js'), sandbox, { filename: 'assets/js/registry.js' });
fs.readdirSync(path.join(root, 'data/lessons')).sort().forEach(file =>
  vm.runInContext(read('data/lessons/' + file), sandbox, { filename: file }));

const app = read('assets/js/app.js');
const css = read('assets/css/styles.css');
const index = read('index.html');
const { I18N, CURSO } = sandbox;
let failures = 0;
function assert(condition, message) {
  if (!condition) { console.log('✗ ' + message); failures++; }
}

assert(index.includes('<body class="is-home">'), 'la home inicia con el estado visual sin sidebar');
assert(app.includes('home-dashboard') && app.includes('function renderCourseLanding(courseId)'), 'el router renderiza home y landings de cursos');
assert(app.includes("const isHome = !hash || hash === 'subjects'"), 'la home reconoce el ancla de temas');
assert(app.includes("if (hash === 'subjects') setTimeout"), 'el ancla de temas hace scroll y no intenta abrir una ruta');
assert(!app.includes("t('home.openPlayground')"), 'la home no tiene CTA de Playground');
assert(!app.includes('dashboard-hero-card') && !app.includes('dashboard-kpis'), 'la home no renderiza cards o métricas redundantes');
const mainNav = [...index.matchAll(/data-nav="(home|sql|java|playground)"/g)].map(match => match[1]).join(',');
assert(mainNav === 'home,sql,java,playground', 'el menú principal tiene Inicio, SQL, Java y Playground en ese orden');
assert(!index.includes('data-nav="referencia"') && index.includes('data-nav="playground"'), 'Referencia no es transversal y Playground permanece visible');
assert(index.includes('data-nav="playground" class="cta"'), 'Playground tiene CTA azul permanente');
assert(app.includes("hash === 'sql' || hash === 'java'"), 'SQL y Java tienen rutas de landing propias');
assert(app.includes("href: '#/sql'") && app.includes("href: '#/java'"), 'las cards de la home apuntan a las landings de cada curso');
assert(app.includes("href: '#/playground'"), 'el Playground sigue accesible desde la landing SQL');
assert(app.includes("courseSection === 'java' && group.section.id !== 'java'") && app.includes("courseSection === 'sql' && group.section.id === 'java'"), 'el sidebar se limita al curso actual');
assert(app.includes("routeHash === 'playground'"), 'el sidebar del Playground queda dentro del contexto SQL');
assert(CURSO.ordered().filter(lesson => lesson.section !== 'java').length === 39, 'la landing SQL recibe sus 39 temas');
assert(CURSO.ordered().filter(lesson => lesson.section === 'java').length === 2, 'la landing Java recibe sus dos temas actuales');
assert(css.includes('body.is-home .sidebar') && css.includes('body.is-home .nav-toggle'), 'la home oculta sidebar y toggle de navegación');
assert(css.includes('.dashboard-hero') && css.includes('.subject-grid') && css.includes('@media (max-width: 600px)'), 'el dashboard tiene layout y responsive propios');
assert(I18N.t('home.title').includes('Senior Full Stack'), 'la home en español comunica el punto de partida del roadmap');
assert(I18N.t('home.lead').includes('Staff Frontend Platform Engineer'), 'la home en español comunica el destino del roadmap');
assert(I18N.t('home.subject.javaName') === 'Java', 'la materia Java aparece en el dashboard');
assert(I18N.t('nav.home') === 'Inicio' && I18N.t('nav.sql') === 'SQL' && I18N.t('nav.java') === 'Java', 'el menú tiene las etiquetas del producto');
assert(I18N.t('course.sql.title') === 'SQL de principio a fin' && I18N.t('course.java.title') === 'Java de principio a fin', 'cada curso tiene título de landing');
assert(I18N.t('section.referencia.name') === 'Referencia SQL', 'la referencia se identifica como parte de SQL');
assert(app.includes("return 'light'") && app.includes("prefers-color-scheme: dark"), 'el tema usa preferencia guardada, sistema y fallback claro');
I18N.set('en');
assert(I18N.t('home.lead').includes('Staff Frontend Platform Engineer'), 'la home en inglés mantiene el destino del roadmap');
assert(I18N.t('home.aboutBody').includes('SQLBolt'), 'la atribución existente de SQLBolt se conserva');

console.log(`\nHome: ${failures ? failures + ' fallo(s)' : 'dashboard, narrativa, responsive y navegación correctos'}`);
process.exit(failures ? 1 : 0);
