/* Verificación de las tareas de cada ejercicio.
   Reproduce (y amplía) los tipos de comprobación del sitio original. */
(function () {

  function norm(v) {
    if (v === null || v === undefined) return null;
    if (typeof v === 'number') return Math.round(v * 1e6) / 1e6;
    if (v instanceof Uint8Array) return Array.from(v).join(',');
    const s = String(v).trim();
    const n = Number(s);
    if (s !== '' && !Number.isNaN(n)) return Math.round(n * 1e6) / 1e6;
    return s.toLowerCase();
  }

  function columnValues(result, idx) { return result.values.map(r => norm(r[idx])); }

  function sameSequence(a, b) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => v === b[i]);
  }

  function sameMultiset(a, b) {
    if (a.length !== b.length) return false;
    const sort = arr => arr.slice().sort((x, y) => String(x) < String(y) ? -1 : String(x) > String(y) ? 1 : 0);
    return sameSequence(sort(a), sort(b));
  }

  /* La consulta del usuario debe contener, para cada columna de la solución,
     alguna columna con exactamente los mismos valores. Se permiten columnas extra. */
  function matchesSolution(userRes, solRes, ordered) {
    if (!userRes || !userRes.columns) return { ok: false, reason: 'La consulta no ha devuelto ninguna tabla de resultados.' };
    if (userRes.values.length !== solRes.values.length) {
      return { ok: false, reason: `Se esperaban ${solRes.values.length} fila(s) y la consulta ha devuelto ${userRes.values.length}.` };
    }
    const used = new Set();
    for (let j = 0; j < solRes.columns.length; j++) {
      const want = columnValues(solRes, j);
      let found = -1;
      for (let k = 0; k < userRes.columns.length; k++) {
        if (used.has(k)) continue;
        const got = columnValues(userRes, k);
        if (ordered ? sameSequence(want, got) : sameMultiset(want, got)) { found = k; break; }
      }
      if (found === -1) {
        return { ok: false, reason: `Falta una columna con los valores de <code>${solRes.columns[j]}</code>` +
          (ordered ? ' en el orden correcto.' : '.') };
      }
      used.add(found);
    }
    return { ok: true };
  }

  function findCol(res, name) {
    const i = res.columns.findIndex(c => String(c).toLowerCase() === String(name).toLowerCase());
    if (i !== -1) return i;
    // permite alias tipo "tabla.columna"
    return res.columns.findIndex(c => String(c).toLowerCase().endsWith('.' + String(name).toLowerCase()));
  }

  /* check individual → { ok, reason } */
  function runCheck(check, ctx) {
    const { db, userRes, task } = ctx;
    switch (check.type) {

      case 'row_col_val_solution_query':
      case 'row_col_val_solution_query_ordered': {
        const ordered = check.type.endsWith('_ordered');
        let solRes;
        try {
          solRes = Engine.query(db, task.solution);
        } catch (e) {
          return { ok: false, reason: 'No se ha podido ejecutar la solución de referencia: ' + e.message };
        }
        return matchesSolution(userRes, solRes, ordered);
      }

      case 'col_equals': {
        const want = check.data.map(c => String(c).toLowerCase());
        const got = (userRes.columns || []).map(c => String(c).toLowerCase());
        if (want.length !== got.length || !want.every((c, i) => c === got[i])) {
          return { ok: false, reason: `Se esperaban exactamente estas columnas: <code>${check.data.join(', ')}</code>.` };
        }
        return { ok: true };
      }

      case 'assert_query_succeeds': {
        try { Engine.query(db, check.data); return { ok: true }; }
        catch (e) { return { ok: false, reason: e.message, failQuery: check.failQuery }; }
      }

      case 'assert_query_fails': {
        try { Engine.query(db, check.data); }
        catch (e) { return { ok: true }; }
        return { ok: false, reason: 'La comprobación esperaba que la consulta fallase y ha funcionado.', failQuery: check.failQuery };
      }

      case 'row_count_query_range': {
        let res;
        try { res = Engine.query(db, check.data.query); }
        catch (e) { return { ok: false, reason: e.message }; }
        const n = res.values.length;
        if (check.data.maxCount != null && n > check.data.maxCount) {
          return { ok: false, reason: `Todavía quedan ${n} fila(s) que deberían haber desaparecido.` };
        }
        if (check.data.minCount != null && n < check.data.minCount) {
          return { ok: false, reason: `Se esperaban al menos ${check.data.minCount} fila(s) y hay ${n}.` };
        }
        return { ok: true };
      }

      case 'row_exists_contain_col_val': {
        const d = check.data;
        let res;
        try { res = Engine.query(db, `SELECT "${d.column}" FROM "${d.table}";`); }
        catch (e) { return { ok: false, reason: e.message }; }
        const target = d.ignoreCase ? String(d.value).toLowerCase() : String(d.value);
        const hit = res.values.some(r => {
          const v = r[0] == null ? '' : String(r[0]);
          return (d.ignoreCase ? v.toLowerCase() : v) === target;
        });
        return hit ? { ok: true }
          : { ok: false, reason: `No se encuentra ninguna fila con <code>${d.column} = '${d.value}'</code> en <code>${d.table}</code>.` };
      }

      case 'row_col_val_greather_than_or_equal': {
        const a = findCol(userRes, check.data.column_a);
        const b = findCol(userRes, check.data.column_b);
        if (a === -1 || b === -1) {
          return { ok: false, reason: `El resultado debe incluir las columnas <code>${check.data.column_a}</code> y <code>${check.data.column_b}</code>.` };
        }
        const bad = userRes.values.some(r => Number(r[a]) < Number(r[b]));
        return bad ? { ok: false, reason: `Hay filas donde <code>${check.data.column_a}</code> es menor que <code>${check.data.column_b}</code>.` } : { ok: true };
      }

      /* --- comprobaciones añadidas para los temas nuevos --- */

      case 'object_exists': {   // data: { type: 'view'|'trigger'|'index'|'table', name }
        let res;
        try {
          res = Engine.query(db, `SELECT name FROM sqlite_master WHERE type='${check.data.type}' AND lower(name)=lower('${check.data.name}');`);
        } catch (e) { return { ok: false, reason: e.message }; }
        return res.values.length
          ? { ok: true }
          : { ok: false, reason: `No existe ning&uacute;n objeto de tipo <code>${check.data.type}</code> llamado <code>${check.data.name}</code>.` };
      }

      case 'query_result_equals': {  // data: { query, columns?, values: [[...]] }
        let res;
        try { res = Engine.query(db, check.data.query); }
        catch (e) { return { ok: false, reason: e.message }; }
        const got = res.values.map(r => r.map(norm));
        const want = check.data.values.map(r => r.map(norm));
        if (got.length !== want.length) {
          return { ok: false, reason: `La comprobación <code>${check.data.query}</code> esperaba ${want.length} fila(s) y ha obtenido ${got.length}.` };
        }
        for (let i = 0; i < want.length; i++) {
          if (!sameSequence(want[i], got[i])) {
            return { ok: false, reason: `Fila ${i + 1} distinta de la esperada (esperado: <code>${want[i].join(' | ')}</code>).` };
          }
        }
        return { ok: true };
      }

      case 'scalar_equals': {   // data: { query, value }
        let res;
        try { res = Engine.query(db, check.data.query); }
        catch (e) { return { ok: false, reason: e.message }; }
        const got = res.values.length ? norm(res.values[0][0]) : null;
        return got === norm(check.data.value)
          ? { ok: true }
          : { ok: false, reason: `Se esperaba <code>${check.data.value}</code> y se ha obtenido <code>${got}</code>.` };
      }

      default:
        console.warn('Comprobación desconocida:', check.type);
        return { ok: true };
    }
  }

  /* queryChecks: subcadenas obligatorias en la consulta escrita por la persona. */
  function runQueryChecks(list, sql) {
    const hay = sql.toLowerCase();
    for (const needle of list) {
      if (!hay.includes(String(needle).toLowerCase())) {
        return { ok: false, reason: `La consulta debe usar <code>${needle}</code>.` };
      }
    }
    return { ok: true };
  }

  /* Verifica una tarea completa. */
  function verify(task, ctx) {
    if (task.queryChecks && task.queryChecks.length) {
      const r = runQueryChecks(task.queryChecks, ctx.userSql || '');
      if (!r.ok) return r;
    }
    for (const check of (task.checks || [])) {
      const r = runCheck(check, ctx);
      if (!r.ok) return r;
    }
    return { ok: true };
  }

  window.Checker = { verify, runCheck, matchesSolution, norm };
})();
