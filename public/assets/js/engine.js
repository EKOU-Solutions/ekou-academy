/* Motor SQLite en el navegador (sql.js / WebAssembly). */
(function () {
  let SQL = null;
  let readyPromise = null;

  function ready() {
    if (!readyPromise) {
      readyPromise = initSqlJs({ locateFile: f => '/assets/vendor/' + f })
        .then(mod => { SQL = mod; return mod; });
    }
    return readyPromise;
  }

  /* Divide un script en sentencias respetando comillas, comentarios y bloques BEGIN…END
     (necesario para triggers, donde el ';' interno no termina la sentencia). */
  function splitStatements(sql) {
    const out = [];
    let cur = '';
    let i = 0;
    let depth = 0;          // nivel de BEGIN…END
    const upper = sql.toUpperCase();
    while (i < sql.length) {
      const c = sql[i];
      // comentario de línea
      if (c === '-' && sql[i + 1] === '-') {
        const nl = sql.indexOf('\n', i);
        const end = nl === -1 ? sql.length : nl + 1;
        cur += sql.slice(i, end); i = end; continue;
      }
      // comentario de bloque
      if (c === '/' && sql[i + 1] === '*') {
        const end = sql.indexOf('*/', i + 2);
        const stop = end === -1 ? sql.length : end + 2;
        cur += sql.slice(i, stop); i = stop; continue;
      }
      // literales
      if (c === "'" || c === '"' || c === '`') {
        let j = i + 1;
        while (j < sql.length) {
          if (sql[j] === c && sql[j + 1] === c) { j += 2; continue; }
          if (sql[j] === c) { j++; break; }
          j++;
        }
        cur += sql.slice(i, j); i = j; continue;
      }
      // palabras clave BEGIN / END en el nivel de sentencia
      if (/[A-Za-z]/.test(c)) {
        let j = i;
        while (j < sql.length && /[A-Za-z_]/.test(sql[j])) j++;
        const word = upper.slice(i, j);
        // "BEGIN TRANSACTION" no abre bloque; "BEGIN" tras CREATE TRIGGER sí
        if (word === 'BEGIN') {
          const rest = upper.slice(j).replace(/^\s+/, '');
          const isTx = /^(TRANSACTION|DEFERRED|IMMEDIATE|EXCLUSIVE|;|$)/.test(rest);
          if (!isTx) depth++;      // cuerpo de un trigger
        } else if (word === 'CASE') {
          depth++;                 // CASE … END también se cierra con END
        } else if (word === 'END' && depth > 0) {
          depth--;
        }
        cur += sql.slice(i, j); i = j; continue;
      }
      if (c === ';' && depth === 0) {
        if (cur.trim()) out.push(cur.trim());
        cur = ''; i++; continue;
      }
      cur += c; i++;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  }

  /* Funciones de usuario de ejemplo, disponibles en todas las bases.
     sql.js permite registrar funciones escalares en JavaScript. */
  /* sql.js deduce el número de argumentos de fn.length; forzando length = -1
     SQLite registra la función como variádica (argumentos opcionales). */
  function defineFn(db, name, fn, arity) {
    Object.defineProperty(fn, 'length', { value: arity, configurable: true });
    db.create_function(name, fn);
  }

  function registerHelpers(db) {
    try {
      defineFn(db, 'iva', function (importe, tipo) {
        if (importe === null) return null;
        return Math.round(importe * (1 + (tipo == null ? 0.21 : tipo)) * 100) / 100;
      }, -1);
      defineFn(db, 'iniciales', function (nombre) {
        if (!nombre) return null;
        return String(nombre).trim().split(/\s+/).map(p => p[0].toUpperCase()).join('.') + '.';
      }, 1);
      defineFn(db, 'slugify', function (txt) {
        if (txt == null) return null;
        return String(txt).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      }, 1);
      defineFn(db, 'distancia_km', function (lat1, lon1, lat2, lon2) {
        if ([lat1, lon1, lat2, lon2].some(v => v == null)) return null;
        const R = 6371, rad = d => d * Math.PI / 180;
        const dLat = rad(lat2 - lat1), dLon = rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) ** 2 +
          Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
        return Math.round(2 * R * Math.asin(Math.sqrt(a)) * 10) / 10;
      }, 4);
    } catch (e) {
      console.warn('No se pudieron registrar las funciones de usuario:', e);
    }
  }

  function create(datasetId) {
    const ds = window.DATASETS[datasetId];
    if (!ds) throw new Error('Dataset desconocido: ' + datasetId);
    const db = new SQL.Database();
    db.run(ds.sql);
    registerHelpers(db);
    return db;
  }

  function fromBinary(bytes) {
    const db = new SQL.Database(bytes);
    registerHelpers(db);
    return db;
  }

  /* Ejecuta un script completo. Devuelve un array de resultados
     [{ sql, columns, values, rowsModified, error }] */
  function run(db, sql) {
    const statements = splitStatements(sql);
    const results = [];
    for (const stmt of statements) {
      if (!stmt.replace(/--[^\n]*/g, '').trim()) continue;
      let res;
      try {
        res = db.exec(stmt);
      } catch (err) {
        results.push({ sql: stmt, error: err.message });
        return results;
      }
      if (res.length) {
        res.forEach(r => results.push({ sql: stmt, columns: r.columns, values: r.values }));
      } else {
        // getRowsModified solo tiene sentido tras INSERT / UPDATE / DELETE
        const isDml = /^\s*(insert|update|delete|replace)\b/i.test(stmt);
        results.push({
          sql: stmt, columns: null, values: null,
          rowsModified: isDml ? db.getRowsModified() : null
        });
      }
    }
    return results;
  }

  /* Ejecuta una única consulta y devuelve {columns, values} o lanza error. */
  function query(db, sql) {
    const res = db.exec(sql);
    if (!res.length) return { columns: [], values: [] };
    return { columns: res[0].columns, values: res[0].values };
  }

  function schema(db) {
    const out = [];
    let objs;
    try {
      objs = query(db, `SELECT type, name, sql FROM sqlite_master
                        WHERE name NOT LIKE 'sqlite_%'
                        ORDER BY CASE type WHEN 'table' THEN 0 WHEN 'view' THEN 1
                                           WHEN 'index' THEN 2 ELSE 3 END, name;`);
    } catch (e) { return out; }
    for (const [type, name, sqlText] of objs.values) {
      const entry = { type, name, sql: sqlText, columns: [], rowCount: null };
      if (type === 'table' || type === 'view') {
        try {
          const info = query(db, `PRAGMA table_info("${name}");`);
          entry.columns = info.values.map(r => ({
            name: r[1], type: r[2] || '', notnull: !!r[3], dflt: r[4], pk: !!r[5]
          }));
          const c = query(db, `SELECT COUNT(*) FROM "${name}";`);
          entry.rowCount = c.values.length ? c.values[0][0] : null;
        } catch (e) { /* vista rota o tabla virtual */ }
      }
      out.push(entry);
    }
    return out;
  }

  window.Engine = { ready, create, fromBinary, run, query, schema, splitStatements, registerHelpers,
    get SQL() { return SQL; } };
})();
