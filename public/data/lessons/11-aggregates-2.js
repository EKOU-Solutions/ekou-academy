CURSO.register({
  slug: 'having',
  section: 'agregados',
  source: 'sqlbolt',
  title: 'Lección 11: Consultas con agregados (Pt. 2)',
  shortTitle: 'HAVING',
  summary: 'Filtrar los grupos ya formados, no las filas individuales.',
  keywords: 'having group by filtro grupos agregados',
  body: `
<p>Nuestras consultas se van complicando, pero ya casi hemos visto todas las partes importantes de un
<code>SELECT</code>. Quizá te hayas fijado en un detalle: si el <code>GROUP BY</code> se ejecuta
<em>después</em> del <code>WHERE</code> (que filtra las filas que se van a agrupar), ¿cómo filtramos entonces
las filas ya agrupadas?</p>

<p>SQL lo resuelve con una cláusula adicional, <code>HAVING</code>, que se usa específicamente junto a
<code>GROUP BY</code> para filtrar las filas agrupadas del resultado.</p>

<div class="definition">
    <div class="desc">SELECT con restricción HAVING</div>
    <code class="sql">SELECT columna_agrupada, FUNC_AGG(<i>expresión_columna</i>) AS alias_resultado, …
FROM mi_tabla
WHERE <i>condición</i>
GROUP BY columna
<strong>HAVING <i>condición_de_grupo</i></strong>;</code>
</div>

<p>Las restricciones del <code>HAVING</code> se escriben igual que las del <code>WHERE</code>, pero se aplican
a las filas agrupadas. Con nuestros ejemplos puede no parecer muy útil, pero si imaginas datos con millones
de filas y propiedades distintas, poder aplicar restricciones adicionales suele ser imprescindible.</p>

<div class="dyk">
    <div class="desc">¿Sabías que…?</div>
    <p>Si no usas <code>GROUP BY</code>, con una cláusula <code>WHERE</code> normal basta. La regla práctica:
    <strong>WHERE filtra filas antes de agrupar; HAVING filtra grupos después de agregar.</strong></p>
</div>

<h1>Ejercicio</h1>
<p>Vas a profundizar en los datos de <strong>employees</strong> del estudio. Piensa qué cláusulas necesitas
en cada tarea.</p>
`,
  exercise: {
    dataset: 'misc',
    tables: ['employees', 'buildings'],
    title: 'Ejercicio 11',
    starter: 'SELECT * FROM employees;',
    tasks: [
      { text: 'Encuentra el número de <em>Artist</em> del estudio (sin usar <strong>HAVING</strong>)',
        hint: 'Basta con contar las filas de ese rol.',
        solution: "SELECT COUNT(*) as Number_of_artists\nFROM employees\nWHERE role = 'Artist';",
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Encuentra el número de empleados de cada rol del estudio',
        hint: 'Cuenta las filas y agrupa por rol.',
        solution: 'SELECT role, COUNT(*)\nFROM employees\nGROUP BY role;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Encuentra el total de años trabajados por todos los <em>Engineer</em>',
        hint: 'Parecida a la anterior: añade una restricción sobre el rol con <code>HAVING</code>.',
        solution: "SELECT SUM(years_employed)\nFROM employees\nGROUP BY role\nHAVING role = 'Engineer';",
        checks: [{ type: 'row_col_val_solution_query', data: null }] }
    ]
  }
});
