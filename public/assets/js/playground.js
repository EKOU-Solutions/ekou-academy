/* Playground SQL: editor libre sobre SQLite en el navegador. */
(function () {
  const { el, renderTable, makeEditor, toast, download, toCSV } = UI;
  const t = (k, p) => I18N.t(k, p);

  const LS_SNIPPETS = 'sqltotal:snippets:v1';
  const LS_LAST = 'sqltotal:playground:last';

  const EJEMPLOS = [
    { g: 'basic', n: 'ex.select', ds: 'tienda', sql:
`SELECT nombre, precio, stock
FROM productos
WHERE descatalogado = 0 AND precio < 200
ORDER BY precio DESC;` },
    { g: 'basic', n: 'ex.join3', ds: 'tienda', sql:
`SELECT p.id AS pedido, c.nombre AS cliente, pr.nombre AS producto,
       d.cantidad, d.precio_unit
FROM pedidos p
JOIN clientes c        ON c.id = p.cliente_id
JOIN detalle_pedido d  ON d.pedido_id = p.id
JOIN productos pr      ON pr.id = d.producto_id
ORDER BY p.id
LIMIT 20;` },
    { g: 'agg', n: 'ex.revenue', ds: 'tienda', sql:
`SELECT cat.nombre AS categoria,
       COUNT(DISTINCT p.id)                AS pedidos,
       SUM(d.cantidad)                     AS unidades,
       ROUND(SUM(d.cantidad * d.precio_unit), 2) AS importe
FROM detalle_pedido d
JOIN productos  pr  ON pr.id = d.producto_id
JOIN categorias cat ON cat.id = pr.categoria_id
JOIN pedidos    p   ON p.id  = d.pedido_id
WHERE p.estado <> 'cancelado'
GROUP BY cat.nombre
HAVING importe > 500
ORDER BY importe DESC;` },
    { g: 'fn', n: 'ex.dates', ds: 'tienda', sql:
`SELECT id,
       fecha,
       strftime('%Y', fecha)          AS anio,
       strftime('%m', fecha)          AS mes,
       CAST(julianday('now') - julianday(fecha) AS INT) AS dias_desde,
       date(fecha, '+30 days')        AS vence
FROM pedidos
ORDER BY fecha DESC
LIMIT 10;` },
    { g: 'fn', n: 'ex.window', ds: 'tienda', sql:
`WITH ventas AS (
  SELECT pr.categoria_id, pr.nombre,
         SUM(d.cantidad * d.precio_unit) AS importe
  FROM detalle_pedido d
  JOIN productos pr ON pr.id = d.producto_id
  GROUP BY pr.id
)
SELECT c.nombre AS categoria, v.nombre AS producto,
       ROUND(v.importe, 2) AS importe,
       RANK()       OVER (PARTITION BY v.categoria_id ORDER BY v.importe DESC) AS puesto,
       ROUND(100.0 * v.importe /
             SUM(v.importe) OVER (PARTITION BY v.categoria_id), 1) AS pct_categoria
FROM ventas v
JOIN categorias c ON c.id = v.categoria_id
ORDER BY categoria, puesto;` },
    { g: 'fn', n: 'ex.udf', ds: 'tienda', sqlEn:
`-- iva(), iniciales(), slugify() and distancia_km() are registered
-- from JavaScript with db.create_function() in assets/js/engine.js
SELECT nombre,
       precio,
       iva(precio)        AS precio_con_iva,
       iva(precio, 0.10)  AS precio_iva_reducido,
       slugify(nombre)    AS slug
FROM productos
LIMIT 10;`, sql:
`-- iva(), iniciales(), slugify() y distancia_km() están registradas
-- desde JavaScript con db.create_function() en assets/js/engine.js
SELECT nombre,
       precio,
       iva(precio)        AS precio_con_iva,
       iva(precio, 0.10)  AS precio_iva_reducido,
       slugify(nombre)    AS slug
FROM productos
LIMIT 10;` },
    { g: 'adv', n: 'ex.cte', ds: 'tienda', sql:
`WITH RECURSIVE arbol(id, nombre, puesto, jefe_id, nivel, ruta) AS (
    SELECT id, nombre, puesto, jefe_id, 0, nombre
    FROM empleados
    WHERE jefe_id IS NULL
  UNION ALL
    SELECT e.id, e.nombre, e.puesto, e.jefe_id, a.nivel + 1, a.ruta || ' › ' || e.nombre
    FROM empleados e
    JOIN arbol a ON e.jefe_id = a.id
)
SELECT nivel, printf('%*s%s', nivel * 3, '', nombre) AS organigrama, puesto, ruta
FROM arbol
ORDER BY ruta;` },
    { g: 'adv', n: 'ex.viewIndex', ds: 'tienda', sql:
`CREATE VIEW IF NOT EXISTS v_totales_pedido AS
SELECT p.id            AS pedido_id,
       p.cliente_id,
       p.fecha,
       ROUND(SUM(d.cantidad * d.precio_unit) * (1 - p.descuento), 2) AS total
FROM pedidos p
JOIN detalle_pedido d ON d.pedido_id = p.id
GROUP BY p.id;

CREATE INDEX IF NOT EXISTS idx_pedidos_cliente ON pedidos(cliente_id, fecha);

EXPLAIN QUERY PLAN
SELECT * FROM pedidos WHERE cliente_id = 1 ORDER BY fecha;

SELECT * FROM v_totales_pedido ORDER BY total DESC LIMIT 10;` },
    { g: 'adv', n: 'ex.savepoint', ds: 'tienda', sqlEn:
`BEGIN TRANSACTION;

UPDATE productos SET precio = precio * 1.10 WHERE categoria_id = 2;

SAVEPOINT antes_de_borrar;
DELETE FROM productos WHERE stock = 0;
ROLLBACK TO antes_de_borrar;   -- undoes only the DELETE

COMMIT;

SELECT id, nombre, precio, stock FROM productos WHERE categoria_id = 2 OR stock = 0;`, sql:
`BEGIN TRANSACTION;

UPDATE productos SET precio = precio * 1.10 WHERE categoria_id = 2;

SAVEPOINT antes_de_borrar;
DELETE FROM productos WHERE stock = 0;
ROLLBACK TO antes_de_borrar;   -- deshace solo el DELETE

COMMIT;

SELECT id, nombre, precio, stock FROM productos WHERE categoria_id = 2 OR stock = 0;` },
    { g: 'adv', n: 'ex.trigger', ds: 'tienda', sql:
`CREATE TABLE IF NOT EXISTS auditoria_precios (
    id          INTEGER PRIMARY KEY,
    producto_id INTEGER,
    precio_ant  REAL,
    precio_nuevo REAL,
    momento     TEXT DEFAULT (datetime('now'))
);

CREATE TRIGGER IF NOT EXISTS trg_precio_update
AFTER UPDATE OF precio ON productos
FOR EACH ROW
WHEN OLD.precio <> NEW.precio
BEGIN
    INSERT INTO auditoria_precios (producto_id, precio_ant, precio_nuevo)
    VALUES (OLD.id, OLD.precio, NEW.precio);
END;

UPDATE productos SET precio = 99.90 WHERE id = 4;
UPDATE productos SET precio = 49.90 WHERE id = 5;

SELECT * FROM auditoria_precios;` },
    { g: 'adv', n: 'ex.sets', ds: 'tienda', sqlEn:
`-- Customers who ordered in 2023 but NOT in 2024
SELECT DISTINCT cliente_id FROM pedidos WHERE fecha LIKE '2023%'
EXCEPT
SELECT DISTINCT cliente_id FROM pedidos WHERE fecha LIKE '2024%';`, sql:
`-- Clientes que han pedido en 2023 pero NO en 2024
SELECT DISTINCT cliente_id FROM pedidos WHERE fecha LIKE '2023%'
EXCEPT
SELECT DISTINCT cliente_id FROM pedidos WHERE fecha LIKE '2024%';` },
    { g: 'ddl', n: 'ex.createTable', ds: 'vacia', sql:
`CREATE TABLE proveedores (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre  TEXT    NOT NULL UNIQUE,
    pais    TEXT    NOT NULL DEFAULT 'España',
    rating  REAL    CHECK (rating BETWEEN 0 AND 5),
    alta    TEXT    NOT NULL DEFAULT (date('now'))
);

INSERT INTO proveedores (nombre, pais, rating) VALUES
 ('Aura Systems','España',4.6),
 ('Nimbus GmbH','Alemania',4.1),
 ('Duo Audio','Portugal',3.8);

SELECT * FROM proveedores;` }
  ];

  function loadSnippets() {
    try { return JSON.parse(localStorage.getItem(LS_SNIPPETS)) || []; } catch (e) { return []; }
  }
  function saveSnippets(list) {
    try { localStorage.setItem(LS_SNIPPETS, JSON.stringify(list)); } catch (e) { }
  }

  function render(host) {
    let db = null;
    let currentDataset = 'tienda';

    const root = el('div', { class: 'pg' });
    host.appendChild(root);

    /* --- barra superior --- */
    const dsSelect = el('select', { class: 'select' });
    Object.values(window.DATASETS).forEach(d =>
      dsSelect.appendChild(el('option', { value: d.id }, I18N.datasetField(d, 'name'))));
    dsSelect.appendChild(el('option', { value: 'vacia' }, t('pg.emptyDb')));
    dsSelect.value = currentDataset;

    const ejSelect = el('select', { class: 'select' });
    ejSelect.appendChild(el('option', { value: '' }, t('pg.loadExample')));
    const grupos = [...new Set(EJEMPLOS.map(e => e.g))];
    grupos.forEach(g => {
      const og = el('optgroup', { label: t('pg.group.' + g) });
      EJEMPLOS.forEach((e, i) => { if (e.g === g) og.appendChild(el('option', { value: String(i) }, t('pg.' + e.n))); });
      ejSelect.appendChild(og);
    });

    const runBtn = el('button', { class: 'btn btn-primary' }, t('pg.run'));
    const runSelBtn = el('button', { class: 'btn btn-ghost', title: t('pg.runSelectionTitle') }, t('pg.runSelection'));
    const resetBtn = el('button', { class: 'btn btn-ghost' }, t('pg.resetDb'));
    const saveBtn = el('button', { class: 'btn btn-ghost' }, t('pg.saveQuery'));
    const exportMenu = el('select', { class: 'select' });
    ['pg.export', 'pg.exportCsv', 'pg.exportDb', 'pg.exportSql'].forEach((key, i) =>
      exportMenu.appendChild(el('option', { value: String(i) }, t(key))));
    const importInput = el('input', { type: 'file', accept: '.sql,.sqlite,.db', class: 'hidden' });
    const importBtn = el('button', { class: 'btn btn-ghost' }, t('pg.import'));

    const bar = el('div', { class: 'pg-bar' },
      el('label', { class: 'pg-field' }, el('span', {}, t('pg.data')), dsSelect),
      el('label', { class: 'pg-field' }, el('span', {}, t('pg.examples')), ejSelect),
      el('div', { class: 'pg-bar-actions' }, runBtn, runSelBtn, resetBtn, saveBtn, importBtn, exportMenu, importInput)
    );

    /* --- layout --- */
    const schemaPane = el('aside', { class: 'pg-schema' });
    const editorHost = el('div', { class: 'pg-editor' });
    const resultsHost = el('div', { class: 'pg-results' });
    const statusBar = el('div', { class: 'pg-status' }, t('pg.ready'));
    const snippetsPane = el('div', { class: 'pg-snippets' });

    const body = el('div', { class: 'pg-body' },
      el('div', { class: 'pg-side' }, schemaPane, snippetsPane),
      el('div', { class: 'pg-work' }, editorHost, statusBar, resultsHost)
    );
    root.append(bar, body);

    /* --- base de datos --- */
    let editor = null;
    function makeDb(id) {
      if (db) { try { db.close(); } catch (e) { } }
      if (id === 'vacia') {
        db = Engine.fromBinary(undefined);
      } else {
        db = Engine.create(id);
      }
      currentDataset = id;
      drawSchema();
      if (editor) editor.setOption('hintOptions', { tables: hints() });
    }

    function hints() {
      const h = {};
      Engine.schema(db).forEach(o => {
        if (o.type === 'table' || o.type === 'view') h[o.name] = o.columns.map(c => c.name);
      });
      return h;
    }

    function drawSchema() {
      schemaPane.textContent = '';
      schemaPane.appendChild(el('div', { class: 'pane-title' }, t('pg.schema')));
      const objs = Engine.schema(db);
      if (!objs.length) {
        schemaPane.appendChild(el('div', { class: 'pane-empty' }, t('pg.schemaEmpty')));
        return;
      }
      const groups = { table: 'pg.tables', view: 'pg.views', index: 'pg.indexes', trigger: 'pg.triggers' };
      Object.entries(groups).forEach(([type, labelKey]) => {
        const items = objs.filter(o => o.type === type);
        if (!items.length) return;
        schemaPane.appendChild(el('div', { class: 'schema-group' }, t(labelKey)));
        items.forEach(o => {
          const head = el('div', { class: 'schema-obj' },
            el('span', { class: 'schema-name' }, o.name),
            o.rowCount != null ? el('span', { class: 'schema-count' }, String(o.rowCount)) : null);
          const cols = el('div', { class: 'schema-cols hidden' });
          o.columns.forEach(c => {
            const line = el('div', { class: 'schema-col' },
              el('span', { class: 'col-name' }, c.name),
              el('span', { class: 'col-type' }, c.type || '—'),
              c.pk ? el('span', { class: 'badge' }, 'PK') : null,
              c.notnull ? el('span', { class: 'badge badge-dim' }, 'NN') : null);
            line.addEventListener('click', () => insertAtCursor(c.name));
            cols.appendChild(line);
          });
          if ((o.type === 'index' || o.type === 'trigger') && o.sql) {
            cols.appendChild(el('pre', { class: 'schema-sql' }, o.sql));
          }
          head.addEventListener('click', () => cols.classList.toggle('hidden'));
          const quick = el('button', { class: 'schema-peek', title: 'SELECT * FROM ' + o.name }, '▸');
          quick.addEventListener('click', e => {
            e.stopPropagation();
            editor.setValue(`SELECT * FROM ${o.name};`);
            runAll();
          });
          if (o.type === 'table' || o.type === 'view') head.appendChild(quick);
          schemaPane.append(head, cols);
        });
      });
    }

    function insertAtCursor(text) {
      editor.replaceSelection(text);
      editor.focus();
    }

    /* --- ejecución --- */
    function show(results) {
      resultsHost.textContent = '';
      const tables = results.filter(r => r.columns);
      if (!results.length) {
        resultsHost.appendChild(el('div', { class: 'result-empty' }, t('pg.nothingToRun')));
        return;
      }
      const err = results.find(r => r.error);
      if (err) {
        resultsHost.appendChild(el('div', { class: 'result-error' },
          el('strong', {}, t('pg.error', { msg: '' })), err.error,
          el('pre', { class: 'err-sql' }, err.sql)));
      }
      results.forEach((r, i) => {
        if (r.error) return;
        if (r.columns) {
          const card = el('div', { class: 'result-card' });
          const head = el('div', { class: 'result-head' },
            el('code', { class: 'result-sql' }, r.sql.length > 120 ? r.sql.slice(0, 120) + '…' : r.sql),
            el('span', { class: 'result-meta' }, t('pg.rows', { n: r.values.length })));
          const csvBtn = el('button', { class: 'linkish' }, 'CSV');
          csvBtn.addEventListener('click', () => download(`resultado_${i + 1}.csv`, toCSV(r), 'text/csv'));
          head.appendChild(csvBtn);
          card.append(head, renderTable(r));
          resultsHost.appendChild(card);
        } else {
          const head = r.sql.replace(/\s+/g, ' ').slice(0, 80);
          resultsHost.appendChild(el('div', { class: 'result-ok' },
            r.rowsModified == null
              ? `✓ ${head}${r.sql.length > 80 ? '…' : ''}`
              : `✓ ${head}${r.sql.length > 80 ? '…' : ''} — ${t('pg.rowsAffected', { n: r.rowsModified })}`));
        }
      });
      if (!tables.length && !err) {
        statusBar.textContent = t('pg.stmtsOk');
      }
    }

    function execSql(sql) {
      const t0 = performance.now();
      let results;
      try {
        results = Engine.run(db, sql);
      } catch (e) {
        results = [{ sql, error: e.message }];
      }
      const ms = Math.round(performance.now() - t0);
      const errored = results.find(r => r.error);
      statusBar.className = 'pg-status' + (errored ? ' status-error' : '');
      statusBar.textContent = errored
        ? t('pg.error', { msg: errored.error })
        : t('pg.stmtsIn', { n: results.length, ms });
      show(results);
      drawSchema();
      try { localStorage.setItem(LS_LAST, editor.getValue()); } catch (e) { }
    }

    const runAll = () => execSql(editor.getValue());
    const runSelection = () => {
      const sel = editor.getSelection();
      execSql(sel && sel.trim() ? sel : editor.getValue());
    };

    /* --- consultas guardadas --- */
    function drawSnippets() {
      snippetsPane.textContent = '';
      snippetsPane.appendChild(el('div', { class: 'pane-title' }, t('pg.mySnippets')));
      const list = loadSnippets();
      if (!list.length) {
        snippetsPane.appendChild(el('div', { class: 'pane-empty' }, t('pg.snippetsEmpty')));
        return;
      }
      list.forEach((s, i) => {
        const row = el('div', { class: 'snippet' },
          el('span', { class: 'snippet-name' }, s.name));
        const del = el('button', { class: 'snippet-del', title: t('pg.deleteSnippet') }, '×');
        del.addEventListener('click', e => {
          e.stopPropagation();
          const l = loadSnippets(); l.splice(i, 1); saveSnippets(l); drawSnippets();
        });
        row.appendChild(del);
        row.addEventListener('click', () => {
          if (s.dataset && s.dataset !== currentDataset) { dsSelect.value = s.dataset; makeDb(s.dataset); }
          editor.setValue(s.sql);
          editor.focus();
        });
        snippetsPane.appendChild(row);
      });
    }

    /* --- eventos --- */
    dsSelect.addEventListener('change', () => {
      makeDb(dsSelect.value);
      statusBar.textContent = t('pg.dbLoaded', { name: dsSelect.options[dsSelect.selectedIndex].text });
      resultsHost.textContent = '';
    });

    ejSelect.addEventListener('change', () => {
      const i = ejSelect.value;
      if (i === '') return;
      const e = EJEMPLOS[Number(i)];
      if (e.ds !== currentDataset) { dsSelect.value = e.ds; makeDb(e.ds); }
      editor.setValue(I18N.lang === 'en' && e.sqlEn ? e.sqlEn : e.sql);
      ejSelect.value = '';
      editor.focus();
    });

    runBtn.addEventListener('click', runAll);
    runSelBtn.addEventListener('click', runSelection);
    resetBtn.addEventListener('click', () => {
      makeDb(currentDataset);
      resultsHost.textContent = '';
      statusBar.textContent = t('pg.dbReset');
      toast(t('pg.dbReset'), 'info');
    });
    saveBtn.addEventListener('click', () => {
      const sql = editor.getValue().trim();
      if (!sql) return toast(t('pg.nothingToSave'), 'warn');
      const name = prompt(t('pg.snippetName'), t('pg.snippetDefault', { n: loadSnippets().length + 1 }));
      if (!name) return;
      const list = loadSnippets();
      list.unshift({ name, sql, dataset: currentDataset });
      saveSnippets(list); drawSnippets();
      toast(t('pg.snippetSaved'), 'ok');
    });

    exportMenu.addEventListener('change', () => {
      const v = exportMenu.value;
      exportMenu.value = '0';
      if (v === '1') {
        const cards = resultsHost.querySelectorAll('.result-card');
        if (!cards.length) return toast(t('pg.runFirst'), 'warn');
        const last = Engine.run(db, editor.getValue()).filter(r => r.columns).pop();
        if (!last) return toast(t('pg.nothingToExport'), 'warn');
        download('resultado.csv', toCSV(last), 'text/csv');
      } else if (v === '2') {
        download(currentDataset + '.sqlite', new Blob([db.export()], { type: 'application/octet-stream' }));
      } else if (v === '3') {
        download('consulta.sql', editor.getValue(), 'application/sql');
      }
    });

    importBtn.addEventListener('click', () => importInput.click());
    importInput.addEventListener('change', () => {
      const file = importInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      if (/\.sql$/i.test(file.name)) {
        reader.onload = () => { editor.setValue(String(reader.result)); toast(t('pg.scriptLoaded'), 'ok'); };
        reader.readAsText(file);
      } else {
        reader.onload = () => {
          try {
            db = Engine.fromBinary(new Uint8Array(reader.result));
            currentDataset = 'importada';
            drawSchema();
            toast(t('pg.dbImported'), 'ok');
          } catch (e) { toast(t('pg.dbImportError', { msg: e.message }), 'error'); }
        };
        reader.readAsArrayBuffer(file);
      }
      importInput.value = '';
    });

    /* --- montaje --- */
    makeDb(currentDataset);
    let saved = '';
    try { saved = localStorage.getItem(LS_LAST) || ''; } catch (e) { }
    editor = makeEditor(editorHost, {
      value: saved || EJEMPLOS[1].sql,
      onRun: runAll,
      tables: hints(),
      placeholder: t('pg.editorPlaceholder')
    });
    editor.setOption('extraKeys', Object.assign({}, editor.getOption('extraKeys'), {
      'Shift-Ctrl-Enter': runSelection,
      'Shift-Cmd-Enter': runSelection
    }));
    drawSnippets();
    drawSchema();
    setTimeout(() => editor.refresh(), 0);
    resultsHost.appendChild(el('div', { class: 'result-empty' }, t('pg.runToSee')));

    return { destroy() { try { db.close(); } catch (e) { } } };
  }

  window.Playground = { render };
})();
