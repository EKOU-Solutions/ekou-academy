CURSO.register({
  slug: 'delete',
  section: 'dml',
  source: 'sqlbolt',
  title: 'Lección 15: Borrar filas',
  shortTitle: 'DELETE',
  summary: 'Eliminar filas con DELETE … WHERE y por qué revisarlo dos veces.',
  keywords: 'delete from where borrar truncate',
  body: `
<p>Cuando necesitas eliminar datos de una tabla puedes usar una sentencia <code>DELETE</code>, que indica
sobre qué tabla actuar y qué filas borrar mediante la cláusula <code>WHERE</code>.</p>

<div class="definition">
    <div class="desc">Sentencia DELETE con condición</div>
    <code class="sql">DELETE FROM mi_tabla
WHERE condición;</code>
</div>

<p>Si omites el <code>WHERE</code>, se eliminan <i>todas</i> las filas, que es una forma rápida de vaciar
una tabla por completo (si es lo que pretendías).</p>

<h1>Cuidado redoblado</h1>
<p>Igual que con <code>UPDATE</code>, conviene probar la restricción primero en un <code>SELECT</code> para
asegurarte de que borras las filas correctas. Sin una copia de seguridad o una base de pruebas es
tremendamente fácil eliminar datos de forma irreversible: <strong>lee tu <code>DELETE</code> dos veces y
ejecútalo una</strong>.</p>

<div class="callout note">
  <div class="desc">DELETE frente a TRUNCATE frente a DROP</div>
  <p><code>DELETE FROM t</code> borra filas una a una y puede deshacerse dentro de una transacción.
  <code>TRUNCATE TABLE t</code> (en MySQL, PostgreSQL, SQL Server) vacía la tabla de golpe, es mucho más
  rápido y suele reiniciar los contadores autoincrementales. <code>DROP TABLE t</code> elimina además la
  propia tabla y su esquema. SQLite no tiene <code>TRUNCATE</code>: optimiza internamente el
  <code>DELETE</code> sin <code>WHERE</code>.</p>
</div>

<h1>Ejercicio</h1>
<p>La base de datos necesita una limpieza. Borra algunas filas con las tareas siguientes.</p>
`,
  exercise: {
    dataset: 'pixar',
    tables: ['movies'],
    title: 'Ejercicio 15',
    starter: 'SELECT * FROM movies;',
    tasks: [
      { text: 'Esta base de datos está creciendo demasiado: elimina todas las películas estrenadas <strong>antes</strong> de 2005.',
        postValidateAction: { resultQuery: 'SELECT * FROM movies;', message: 'Fila(s) eliminada(s)' },
        solution: 'DELETE FROM movies\nWHERE year < 2005;',
        queryChecks: ['WHERE', '2005'],
        checks: [{ type: 'row_count_query_range', data: { query: 'SELECT * FROM movies \nWHERE year < 2005;', maxCount: 0 } }] },
      { text: 'Andrew Stanton también ha dejado el estudio: elimina todas las películas que dirigió.',
        postValidateAction: { resultQuery: 'SELECT * FROM movies;', message: 'Fila(s) eliminada(s)' },
        solution: "DELETE FROM movies\nWHERE director = 'Andrew Stanton';",
        queryChecks: ['WHERE', 'Andrew Stanton'],
        checks: [{ type: 'row_count_query_range', data: { query: "SELECT * FROM movies \nWHERE director = 'Andrew Stanton';", maxCount: 0 } }] }
    ]
  }
});
