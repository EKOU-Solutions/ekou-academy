/* Comprueba que el catálogo de cadenas y las traducciones del temario están completos. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');

const sb = {
  console,
  localStorage: { getItem: () => null, setItem() {} },
  document: { documentElement: { setAttribute() {} }, dispatchEvent() {} }
};
sb.window = sb;
vm.createContext(sb);

['assets/js/i18n.js', 'data/datasets.js', 'assets/js/registry.js'].forEach(f =>
  vm.runInContext(read(f), sb, { filename: f }));
fs.readdirSync(path.join(root, 'data/lessons')).sort().forEach(f =>
  vm.runInContext(read('data/lessons/' + f), sb, { filename: f }));
fs.readdirSync(path.join(root, 'data/i18n')).sort().forEach(f =>
  vm.runInContext(read('data/i18n/' + f), sb, { filename: f }));

const { I18N, CURSO } = sb;
let problems = 0;

/* 1. las traducciones del temario cubren todos los temas y todas las tareas */
const gaps = I18N.missing('en', CURSO.ordered());
gaps.forEach(g => { console.log('✗ en/' + g); problems++; });

/* 2. los dos catálogos de interfaz tienen exactamente las mismas claves */
const dictEs = new Set(), dictEn = new Set();
const src = read('assets/js/i18n.js');
const esBlock = src.slice(src.indexOf('    es: {'), src.indexOf('    en: {'));
const enBlock = src.slice(src.indexOf('    en: {'), src.indexOf('  /* traducciones del temario'));
for (const m of esBlock.matchAll(/^\s+'([\w.]+)':/gm)) dictEs.add(m[1]);
for (const m of enBlock.matchAll(/^\s+'([\w.]+)':/gm)) dictEn.add(m[1]);
[...dictEs].filter(k => !dictEn.has(k)).forEach(k => { console.log('✗ falta en inglés: ' + k); problems++; });
[...dictEn].filter(k => !dictEs.has(k)).forEach(k => { console.log('✗ falta en español: ' + k); problems++; });

/* 3. cada clave usada en el código existe en el catálogo */
const used = new Set();
['app.js', 'exercise.js', 'playground.js', 'ui.js', 'checker.js'].forEach(f => {
  // solo literales completos: t('clave') o t('clave', {…}) — no concatenaciones ni closest('.x')
  for (const m of read('assets/js/' + f).matchAll(/(?<![A-Za-z0-9_.$])(?:I18N\.)?t\('([\w.]+)'\s*[,)]/g)) used.add(m[1]);
});
// las claves compuestas en tiempo de ejecución se comprueban aparte
CURSO.SECTIONS.forEach(s => { used.add('section.' + s.id + '.name'); used.add('section.' + s.id + '.hint'); });
['basic', 'agg', 'fn', 'adv', 'ddl'].forEach(g => used.add('pg.group.' + g));
[...used].filter(k => !dictEs.has(k) && !k.startsWith('pg.ex.')).forEach(k => {
  console.log('✗ clave usada pero no definida: ' + k); problems++;
});

/* 4. los datasets tienen nombre y descripción en inglés */
Object.values(sb.DATASETS).forEach(d => {
  if (!d.i18n || !d.i18n.en || !d.i18n.en.name || !d.i18n.en.description) {
    console.log('✗ dataset sin traducir: ' + d.id); problems++;
  }
});

const withEx = CURSO.ordered().filter(l => l.exercise).length;
const tasks = CURSO.ordered().reduce((a, l) => a + (l.exercise ? l.exercise.tasks.length : 0), 0);
console.log(`\n${CURSO.ordered().length} temas traducidos · ${withEx} ejercicios · ${tasks} tareas · ` +
            `${dictEs.size} cadenas de interfaz por idioma · ${problems} problema(s)`);
process.exit(problems ? 1 : 0);
