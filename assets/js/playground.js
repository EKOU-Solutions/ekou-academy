/* Playground SQL: editor libre sobre SQLite en el navegador. */
(function () {
  const { el, renderTable, makeEditor, toast, download, toCSV } = UI;

  const LS_SNIPPETS = 'sqltotal:snippets:v1';
  const LS_LAST = 'sqltotal:playground:last';

  const EJEMPLOS = [
    { g: 'Básico', n: 'SELECT con filtro y orden', ds: 'tienda', sql:
`SELECT nombre, precio, stock
FROM productos
WHERE descatalogado = 0 AND precio < 200
ORDER BY precio DESC;` },
    { g: 'Básico', n: 'JOIN de tres tablas', ds: 'tienda', sql:
`SELECT p.id AS pedido, c.nombre AS cliente, pr.nombre AS producto,
       d.cantidad, d.precio_unit
FROM pedidos p
JOIN clientes c        ON c.id = p.cliente_id
JOIN detalle_pedido d  ON d.pedido_id = p.id
JOIN productos pr      ON pr.id = d.producto_id
ORDER BY p.id
LIMIT 20;` },
    { g: 'Agregados', n: 'Facturación por categoría', ds: 'tienda', sql:
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
    { g: 'Funciones', n: 'Funciones de fecha', ds: 'tienda', sql:
`SELECT id,
       fecha,
       strftime('%Y', fecha)          AS anio,
       strftime('%m', fecha)          AS mes,
       CAST(julianday('now') - julianday(fecha) AS INT) AS dias_desde,
       date(fecha, '+30 days')        AS vence
FROM pedidos
ORDER BY fecha DESC
LIMIT 10;` },
    { g: 'Funciones', n: 'Funciones de ventana', ds: 'tienda', sql:
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
    { g: 'Funciones', n: 'Función definida por el usuario (JS)', ds: 'tienda', sql:
`-- iva(), iniciales(), slugify() y distancia_km() están registradas
-- desde JavaScript con db.create_function() en assets/js/engine.js
SELECT nombre,
       precio,
       iva(precio)        AS precio_con_iva,
       iva(precio, 0.10)  AS precio_iva_reducido,
       slugify(nombre)    AS slug
FROM productos
LIMIT 10;` },
    { g: 'Avanzado', n: 'CTE recursiva: jerarquía de empleados', ds: 'tienda', sql:
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
    { g: 'Avanzado', n: 'Vista + índice + plan de ejecución', ds: 'tienda', sql:
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
    { g: 'Avanzado', n: 'Transacción con SAVEPOINT', ds: 'tienda', sql:
`BEGIN TRANSACTION;

UPDATE productos SET precio = precio * 1.10 WHERE categoria_id = 2;

SAVEPOINT antes_de_borrar;
DELETE FROM productos WHERE stock = 0;
ROLLBACK TO antes_de_borrar;   -- deshace solo el DELETE

COMMIT;

SELECT id, nombre, precio, stock FROM productos WHERE categoria_id = 2 OR stock = 0;` },
    { g: 'Avanzado', n: 'Trigger de auditoría', ds: 'tienda', sql:
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
    { g: 'Avanzado', n: 'Conjuntos: UNION / INTERSECT / EXCEPT', ds: 'tienda', sql:
`-- Clientes que han pedido en 2023 pero NO en 2024
SELECT DISTINCT cliente_id FROM pedidos WHERE fecha LIKE '2023%'
EXCEPT
SELECT DISTINCT cliente_id FROM pedidos WHERE fecha LIKE '2024%';` },
    { g: 'DDL', n: 'Crear tabla con restricciones', ds: 'vacia', sql:
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
      dsSelect.appendChild(el('option', { value: d.id }, d.name)));
    dsSelect.appendChild(el('option', { value: 'vacia' }, 'Base vacía'));
    dsSelect.value = currentDataset;

    const ejSelect = el('select', { class: 'select' });
    ejSelect.appendChild(el('option', { value: '' }, 'Cargar ejemplo…'));
    const grupos = [...new Set(EJEMPLOS.map(e => e.g))];
    grupos.forEach(g => {
      const og = el('optgroup', { label: g });
      EJEMPLOS.forEach((e, i) => { if (e.g === g) og.appendChild(el('option', { value: String(i) }, e.n)); });
      ejSelect.appendChild(og);
    });

    const runBtn = el('button', { class: 'btn btn-primary' }, 'Ejecutar ⌘⏎');
    const runSelBtn = el('button', { class: 'btn btn-ghost', title: 'Ejecuta solo el texto seleccionado' }, 'Ejecutar selección');
    const resetBtn = el('button', { class: 'btn btn-ghost' }, 'Reiniciar base');
    const saveBtn = el('button', { class: 'btn btn-ghost' }, 'Guardar consulta');
    const exportMenu = el('select', { class: 'select' });
    ['Exportar…', 'Resultado a CSV', 'Base a .sqlite', 'Script a .sql'].forEach((t, i) =>
      exportMenu.appendChild(el('option', { value: String(i) }, t)));
    const importInput = el('input', { type: 'file', accept: '.sql,.sqlite,.db', class: 'hidden' });
    const importBtn = el('button', { class: 'btn btn-ghost' }, 'Importar…');

    const bar = el('div', { class: 'pg-bar' },
      el('label', { class: 'pg-field' }, el('span', {}, 'Datos'), dsSelect),
      el('label', { class: 'pg-field' }, el('span', {}, 'Ejemplos'), ejSelect),
      el('div', { class: 'pg-bar-actions' }, runBtn, runSelBtn, resetBtn, saveBtn, importBtn, exportMenu, importInput)
    );

    /* --- layout --- */
    const schemaPane = el('aside', { class: 'pg-schema' });
    const editorHost = el('div', { class: 'pg-editor' });
    const resultsHost = el('div', { class: 'pg-results' });
    const statusBar = el('div', { class: 'pg-status' }, 'Listo.');
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
      schemaPane.appendChild(el('div', { class: 'pane-title' }, 'Esquema'));
      const objs = Engine.schema(db);
      if (!objs.length) {
        schemaPane.appendChild(el('div', { class: 'pane-empty' }, 'La base está vacía. Crea tablas con CREATE TABLE.'));
        return;
      }
      const groups = { table: 'Tablas', view: 'Vistas', index: 'Índices', trigger: 'Disparadores' };
      Object.entries(groups).forEach(([type, label]) => {
        const items = objs.filter(o => o.type === type);
        if (!items.length) return;
        schemaPane.appendChild(el('div', { class: 'schema-group' }, label));
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
        resultsHost.appendChild(el('div', { class: 'result-empty' }, 'Nada que ejecutar.'));
        return;
      }
      const err = results.find(r => r.error);
      if (err) {
        resultsHost.appendChild(el('div', { class: 'result-error' },
          el('strong', {}, 'Error: '), err.error,
          el('pre', { class: 'err-sql' }, err.sql)));
      }
      results.forEach((r, i) => {
        if (r.error) return;
        if (r.columns) {
          const card = el('div', { class: 'result-card' });
          const head = el('div', { class: 'result-head' },
            el('code', { class: 'result-sql' }, r.sql.length > 120 ? r.sql.slice(0, 120) + '…' : r.sql),
            el('span', { class: 'result-meta' }, `${r.values.length} fila(s)`));
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
              : `✓ ${head}${r.sql.length > 80 ? '…' : ''} — ${r.rowsModified} fila(s) afectadas`));
        }
      });
      if (!tables.length && !err) {
        statusBar.textContent = 'Sentencias ejecutadas correctamente.';
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
        ? 'Error: ' + errored.error
        : `${results.length} sentencia(s) en ${ms} ms`;
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
      snippetsPane.appendChild(el('div', { class: 'pane-title' }, 'Mis consultas'));
      const list = loadSnippets();
      if (!list.length) {
        snippetsPane.appendChild(el('div', { class: 'pane-empty' }, 'Guarda una consulta para tenerla siempre a mano.'));
        return;
      }
      list.forEach((s, i) => {
        const row = el('div', { class: 'snippet' },
          el('span', { class: 'snippet-name' }, s.name));
        const del = el('button', { class: 'snippet-del', title: 'Eliminar' }, '×');
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
      statusBar.textContent = 'Base cargada: ' + dsSelect.options[dsSelect.selectedIndex].text;
      resultsHost.textContent = '';
    });

    ejSelect.addEventListener('change', () => {
      const i = ejSelect.value;
      if (i === '') return;
      const e = EJEMPLOS[Number(i)];
      if (e.ds !== currentDataset) { dsSelect.value = e.ds; makeDb(e.ds); }
      editor.setValue(e.sql);
      ejSelect.value = '';
      editor.focus();
    });

    runBtn.addEventListener('click', runAll);
    runSelBtn.addEventListener('click', runSelection);
    resetBtn.addEventListener('click', () => {
      makeDb(currentDataset);
      resultsHost.textContent = '';
      statusBar.textContent = 'Base reiniciada.';
      toast('Base de datos reiniciada', 'info');
    });
    saveBtn.addEventListener('click', () => {
      const sql = editor.getValue().trim();
      if (!sql) return toast('No hay nada que guardar', 'warn');
      const name = prompt('Nombre de la consulta:', 'Consulta ' + (loadSnippets().length + 1));
      if (!name) return;
      const list = loadSnippets();
      list.unshift({ name, sql, dataset: currentDataset });
      saveSnippets(list); drawSnippets();
      toast('Consulta guardada', 'ok');
    });

    exportMenu.addEventListener('change', () => {
      const v = exportMenu.value;
      exportMenu.value = '0';
      if (v === '1') {
        const cards = resultsHost.querySelectorAll('.result-card');
        if (!cards.length) return toast('Ejecuta primero una consulta con resultados', 'warn');
        const last = Engine.run(db, editor.getValue()).filter(r => r.columns).pop();
        if (!last) return toast('Sin resultados que exportar', 'warn');
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
        reader.onload = () => { editor.setValue(String(reader.result)); toast('Script cargado en el editor', 'ok'); };
        reader.readAsText(file);
      } else {
        reader.onload = () => {
          try {
            db = Engine.fromBinary(new Uint8Array(reader.result));
            currentDataset = 'importada';
            drawSchema();
            toast('Base de datos importada', 'ok');
          } catch (e) { toast('No se pudo abrir el archivo: ' + e.message, 'error'); }
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
      placeholder: 'Escribe SQL. Varias sentencias separadas por ; — Ctrl/⌘+Enter para ejecutar.'
    });
    editor.setOption('extraKeys', Object.assign({}, editor.getOption('extraKeys'), {
      'Shift-Ctrl-Enter': runSelection,
      'Shift-Cmd-Enter': runSelection
    }));
    drawSnippets();
    drawSchema();
    setTimeout(() => editor.refresh(), 0);
    resultsHost.appendChild(el('div', { class: 'result-empty' }, 'Ejecuta una consulta para ver los resultados aquí.'));

    return { destroy() { try { db.close(); } catch (e) { } } };
  }

  window.Playground = { render };
})();
