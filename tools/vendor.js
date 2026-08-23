/* Copia las dependencias de node_modules a assets/vendor/ (sitio sin build). */
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const out = path.join(root, 'assets/vendor');
const files = [
  ['sql.js/dist/sql-wasm.js', 'sql-wasm.js'],
  ['sql.js/dist/sql-wasm.wasm', 'sql-wasm.wasm'],
  ['codemirror/lib/codemirror.js', 'codemirror.js'],
  ['codemirror/lib/codemirror.css', 'codemirror.css'],
  ['codemirror/mode/sql/sql.js', 'codemirror-sql.js'],
  ['codemirror/addon/hint/show-hint.js', 'cm-show-hint.js'],
  ['codemirror/addon/hint/show-hint.css', 'cm-show-hint.css'],
  ['codemirror/addon/hint/sql-hint.js', 'cm-sql-hint.js'],
  ['codemirror/addon/edit/matchbrackets.js', 'cm-matchbrackets.js'],
  ['codemirror/addon/display/placeholder.js', 'cm-placeholder.js']
];
fs.mkdirSync(out, { recursive: true });
for (const [src, dst] of files) {
  fs.copyFileSync(path.join(root, 'node_modules', src), path.join(out, dst));
  console.log('→', dst);
}
