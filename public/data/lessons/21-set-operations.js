CURSO.register({
  slug: 'operaciones-de-conjunto',
  section: 'intermedio',
  source: 'sqlbolt',
  title: 'Tema: Uniones, intersecciones y diferencias',
  shortTitle: 'UNION, INTERSECT, EXCEPT',
  summary: 'Combinar los resultados de varias consultas como conjuntos.',
  keywords: 'union union all intersect except minus conjuntos',
  body: `
<p>Al trabajar con varias tablas, los operadores <code>UNION</code> y <code>UNION ALL</code> permiten
añadir el resultado de una consulta al de otra, siempre que tengan el mismo número de columnas, en el mismo
orden y con tipos compatibles. Si usas <code>UNION</code> sin <code>ALL</code>, las filas duplicadas se
eliminan del resultado.</p>

<div class="definition">
    <div class="desc">Consulta con operadores de conjunto</div>
    <code class="sql">SELECT columna, otra_columna
   FROM mi_tabla
<strong>UNION / UNION ALL / INTERSECT / EXCEPT
SELECT otra_columna, otra_columna_mas
   FROM otra_tabla</strong>
ORDER BY columna DESC
LIMIT <i>n</i>;</code>
</div>

<p>En el orden de operaciones descrito en la <a href="#/orden-de-ejecucion">Lección 12</a>, la
<code>UNION</code> ocurre <em>antes</em> del <code>ORDER BY</code> y del <code>LIMIT</code>: por eso solo se
escribe un <code>ORDER BY</code>, al final, y se aplica al resultado combinado.</p>

<p>Igual que <code>UNION</code>, el operador <code>INTERSECT</code> devuelve solo las filas idénticas en
ambos conjuntos de resultados, y <code>EXCEPT</code> devuelve solo las filas del primer conjunto que no
están en el segundo. Esto significa que <code>EXCEPT</code> es sensible al orden de las consultas, igual que
<code>LEFT JOIN</code> y <code>RIGHT JOIN</code>.</p>

<p><code>INTERSECT</code> y <code>EXCEPT</code> también descartan duplicados, aunque algunos motores
soportan <code>INTERSECT ALL</code> y <code>EXCEPT ALL</code> para conservarlos.</p>

<div class="callout note">
  <div class="desc">Diferencias entre motores</div>
  <p>Oracle llama <code>MINUS</code> a <code>EXCEPT</code>. MySQL no tuvo <code>INTERSECT</code> ni
  <code>EXCEPT</code> hasta la versión 8.0.31; antes se emulaban con <code>INNER JOIN</code> y
  <code>LEFT JOIN … WHERE … IS NULL</code>, respectivamente.</p>
</div>

<h1>UNION frente a JOIN</h1>
<p>Es fácil confundirlos: un <code>JOIN</code> combina tablas <strong>a lo ancho</strong> (añade columnas),
mientras que un <code>UNION</code> las combina <strong>a lo alto</strong> (añade filas). Usa
<code>UNION ALL</code> siempre que sepas que no hay duplicados: evita el coste de ordenar y deduplicar.</p>

<h1>Ejercicio</h1>
<p>Seguimos con la base <strong>Tienda online</strong>.</p>
`,
  exercise: {
    dataset: 'tienda',
    tables: ['clientes', 'empleados', 'productos', 'pedidos', 'detalle_pedido'],
    title: 'Ejercicio: conjuntos',
    starter: 'SELECT nombre FROM clientes;',
    tasks: [
      { text: 'Devuelve en una sola columna <code>nombre</code> todos los nombres de clientes y de empleados, sin duplicados y ordenados alfabéticamente',
        hint: 'Dos <code>SELECT nombre</code> unidos con <code>UNION</code> y un solo <code>ORDER BY</code> al final.',
        queryChecks: ['UNION'],
        solution: 'SELECT nombre FROM clientes\nUNION\nSELECT nombre FROM empleados\nORDER BY nombre;',
        checks: [{ type: 'row_col_val_solution_query_ordered', data: null }] },
      { text: 'Encuentra los <code>cliente_id</code> que hicieron pedidos <strong>tanto</strong> en 2023 <strong>como</strong> en 2024',
        hint: 'Usa <code>INTERSECT</code> entre dos consultas filtradas por año.',
        queryChecks: ['INTERSECT'],
        solution: "SELECT cliente_id FROM pedidos WHERE fecha LIKE '2023%'\nINTERSECT\nSELECT cliente_id FROM pedidos WHERE fecha LIKE '2024%';",
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Encuentra los <code>id</code> de los productos que nunca se han vendido (no aparecen en ninguna línea de pedido)',
        hint: 'Usa <code>EXCEPT</code>: todos los productos menos los que están en <code>detalle_pedido</code>.',
        queryChecks: ['EXCEPT'],
        solution: 'SELECT id FROM productos\nEXCEPT\nSELECT producto_id FROM detalle_pedido;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] }
    ]
  }
});
