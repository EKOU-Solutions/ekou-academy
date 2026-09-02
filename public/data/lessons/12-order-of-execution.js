CURSO.register({
  slug: 'orden-de-ejecucion',
  section: 'agregados',
  source: 'sqlbolt',
  title: 'Lección 12: Orden de ejecución de una consulta',
  shortTitle: 'Orden de ejecución',
  summary: 'En qué orden real evalúa la base de datos cada cláusula.',
  keywords: 'orden ejecucion from where group by having select distinct order by limit',
  body: `
<p>Ya conocemos todas las partes de una consulta; toca ver cómo encajan en una consulta completa.</p>

<div class="definition">
    <div class="desc">Consulta SELECT completa</div>
    <code class="sql">SELECT DISTINCT columna, FUNC_AGG(<i>columna_o_expresión</i>), …
FROM mi_tabla
    JOIN otra_tabla
      ON mi_tabla.columna = otra_tabla.columna
    WHERE <i>expresión_de_restricción</i>
    GROUP BY columna
    HAVING <i>expresión_de_restricción</i>
    ORDER BY <i>columna</i> ASC/DESC
    LIMIT <i>cantidad</i> OFFSET <i>cantidad</i>;</code>
</div>

<p>Toda consulta empieza localizando los datos que necesitamos y después los va filtrando hasta algo que se
pueda procesar y entender lo más rápido posible. Como cada parte se ejecuta de forma secuencial, entender el
orden de ejecución es clave para saber qué resultados están disponibles en cada punto.</p>

<h1>Orden de ejecución</h1>

<h2>1. <code>FROM</code> y los <code>JOIN</code></h2>
<p>Primero se ejecutan la cláusula <code>FROM</code> y sus <code>JOIN</code> para determinar el conjunto total
de datos sobre el que se trabaja. Aquí entran también las subconsultas de esta cláusula, y por debajo pueden
crearse tablas temporales con todas las columnas y filas de las tablas combinadas.</p>

<h2>2. <code>WHERE</code></h2>
<p>Con el conjunto completo de datos, se aplican las restricciones del <code>WHERE</code> fila a fila y se
descartan las que no las cumplen. Cada restricción solo puede acceder a columnas de las tablas indicadas en
el <code>FROM</code>. Los alias definidos en el <code>SELECT</code> <strong>no</strong> son accesibles en la
mayoría de motores, porque pueden depender de partes de la consulta que aún no se han ejecutado.</p>

<h2>3. <code>GROUP BY</code></h2>
<p>Las filas que sobreviven al <code>WHERE</code> se agrupan por los valores comunes de la columna indicada.
Como resultado quedarán tantas filas como valores únicos haya. Implícitamente, esto significa que solo
deberías necesitarlo cuando hay funciones de agregado en la consulta.</p>

<h2>4. <code>HAVING</code></h2>
<p>Si la consulta tiene <code>GROUP BY</code>, se aplican las restricciones del <code>HAVING</code> a las
filas agrupadas y se descartan los grupos que no las cumplen. Igual que en el <code>WHERE</code>, en la
mayoría de motores tampoco se puede usar aquí un alias del <code>SELECT</code>.</p>

<h2>5. <code>SELECT</code></h2>
<p>Se calculan finalmente las expresiones de la parte <code>SELECT</code>.</p>

<h2>6. <code>DISTINCT</code></h2>
<p>De las filas restantes se descartan las que tengan valores duplicados en las columnas marcadas como
<code>DISTINCT</code>.</p>

<h2>7. <code>ORDER BY</code></h2>
<p>Si se ha indicado un orden, las filas se ordenan ascendente o descendentemente. Como todas las
expresiones del <code>SELECT</code> ya están calculadas, <strong>aquí sí</strong> puedes referenciar
alias.</p>

<h2>8. <code>LIMIT</code> / <code>OFFSET</code></h2>
<p>Por último se descartan las filas fuera del rango indicado, dejando el conjunto final que devuelve la
consulta.</p>

<h2>Conclusión</h2>
<p>No todas las consultas necesitan todas estas partes, pero parte de la flexibilidad de SQL está en que
permite manipular datos rápidamente sin escribir código adicional, solo combinando estas cláusulas.</p>

<div class="callout note">
  <div class="desc">Truco para recordarlo</div>
  <p>El orden <em>escrito</em> es SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT.
  El orden <em>ejecutado</em> es FROM → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT.
  Casi todos los errores de «columna desconocida» al usar un alias vienen de confundir ambos.</p>
</div>

<h1>Ejercicio</h1>
<p>Aquí terminan las lecciones sobre consultas <code>SELECT</code>. Este ejercicio pone a prueba lo
aprendido, así que no te desanimes si te cuesta.</p>
`,
  exercise: {
    dataset: 'pixar',
    tables: ['movies', 'boxoffice'],
    title: 'Ejercicio 12',
    starter: 'SELECT * FROM movies;',
    tasks: [
      { text: 'Encuentra cuántas películas ha dirigido cada director',
        hint: 'Agrupa por director y cuenta las películas.',
        solution: 'SELECT director, COUNT(id) as Num_movies_directed\nFROM movies\nGROUP BY director;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Encuentra la recaudación total (nacional + internacional) atribuible a cada director',
        hint: 'Combina las tablas y agrupa antes de sumar las ventas.',
        solution: 'SELECT director, SUM(domestic_sales + international_sales) as Cumulative_sales_from_all_movies\nFROM movies\n    INNER JOIN boxoffice\n        ON movies.id = boxoffice.movie_id\nGROUP BY director;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] }
    ]
  }
});
