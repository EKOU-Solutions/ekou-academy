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
    if (!userRes || !userRes.columns) return { ok: false, reason: I18N.t('chk.noResultTable') };
    if (userRes.values.length !== solRes.values.length) {
      return { ok: false, reason: I18N.t('chk.rowCount', { want: solRes.values.length, got: userRes.values.length }) };
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
        return { ok: false, reason: I18N.t(ordered ? 'chk.missingColumnOrdered' : 'chk.missingColumn', { col: solRes.columns[j] }) };
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
          return { ok: false, reason: I18N.t('chk.solutionFailed', { msg: e.message }) };
        }
        return matchesSolution(userRes, solRes, ordered);
      }

      case 'col_equals': {
        const want = check.data.map(c => String(c).toLowerCase());
        const got = (userRes.columns || []).map(c => String(c).toLowerCase());
        if (want.length !== got.length || !want.every((c, i) => c === got[i])) {
          return { ok: false, reason: I18N.t('chk.exactColumns', { cols: check.data.join(', ') }) };
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
        return { ok: false, reason: I18N.t('chk.shouldHaveFailed'), failQuery: check.failQuery };
      }

      case 'row_count_query_range': {
        let res;
        try { res = Engine.query(db, check.data.query); }
        catch (e) { return { ok: false, reason: e.message }; }
        const n = res.values.length;
        if (check.data.maxCount != null && n > check.data.maxCount) {
          return { ok: false, reason: I18N.t('chk.rowsLeft', { n }) };
        }
        if (check.data.minCount != null && n < check.data.minCount) {
          return { ok: false, reason: I18N.t('chk.rowsExpected', { min: check.data.minCount, n }) };
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
          : { ok: false, reason: I18N.t('chk.rowMissing', { col: d.column, val: d.value, table: d.table }) };
      }

      case 'row_col_val_greather_than_or_equal': {
        const a = findCol(userRes, check.data.column_a);
        const b = findCol(userRes, check.data.column_b);
        if (a === -1 || b === -1) {
          return { ok: false, reason: I18N.t('chk.needColumns', { a: check.data.column_a, b: check.data.column_b }) };
        }
        const bad = userRes.values.some(r => Number(r[a]) < Number(r[b]));
        return bad ? { ok: false, reason: I18N.t('chk.notGreater', { a: check.data.column_a, b: check.data.column_b }) } : { ok: true };
      }

      /* --- comprobaciones añadidas para los temas nuevos --- */

      case 'object_exists': {   // data: { type: 'view'|'trigger'|'index'|'table', name }
        let res;
        try {
          res = Engine.query(db, `SELECT name FROM sqlite_master WHERE type='${check.data.type}' AND lower(name)=lower('${check.data.name}');`);
        } catch (e) { return { ok: false, reason: e.message }; }
        return res.values.length
          ? { ok: true }
          : { ok: false, reason: I18N.t('chk.objectMissing', { type: check.data.type, name: check.data.name }) };
      }

      case 'query_result_equals': {  // data: { query, columns?, values: [[...]] }
        let res;
        try { res = Engine.query(db, check.data.query); }
        catch (e) { return { ok: false, reason: e.message }; }
        const got = res.values.map(r => r.map(norm));
        const want = check.data.values.map(r => r.map(norm));
        if (got.length !== want.length) {
          return { ok: false, reason: I18N.t('chk.checkRowCount', { query: check.data.query, want: want.length, got: got.length }) };
        }
        for (let i = 0; i < want.length; i++) {
          if (!sameSequence(want[i], got[i])) {
            return { ok: false, reason: I18N.t('chk.rowDiffers', { i: i + 1, want: want[i].join(' | ') }) };
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
          : { ok: false, reason: I18N.t('chk.scalarDiffers', { want: check.data.value, got }) };
      }

      default:
        console.warn('Unknown check type:', check.type);
        return { ok: true };
    }
  }

  /* queryChecks: subcadenas obligatorias en la consulta escrita por la persona. */
  function runQueryChecks(list, sql) {
    const hay = sql.toLowerCase();
    for (const needle of list) {
      if (!hay.includes(String(needle).toLowerCase())) {
        return { ok: false, reason: I18N.t('chk.mustUse', { needle }) };
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
