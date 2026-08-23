CURSO.register({
  slug: 'subconsultas',
  section: 'intermedio',
  source: 'sqlbolt',
  title: 'Tema: Subconsultas',
  shortTitle: 'Subconsultas',
  summary: 'Consultas dentro de consultas: escalares, de lista, correlacionadas y EXISTS.',
  keywords: 'subconsulta subquery in exists correlacionada anidada',
  body: `
<p>Habrás notado que, incluso con una consulta completa, hay preguntas que no podemos responder sin
procesar los datos antes o después. En esos casos puedes hacer varias consultas y procesar los datos por tu
cuenta, o construir una consulta más compleja usando <i>subconsultas</i>.</p>

<div class="dyk">
    <div class="desc">Ejemplo: subconsulta simple</div>
    <p>Imagina que tu empresa tiene una lista de comerciales con los ingresos que genera cada uno y su
    salario. Los tiempos son duros y quieres averiguar cuáles cuestan más que los ingresos medios generados
    por comercial.</p>
    <p>Primero necesitarías calcular los ingresos medios de todos los comerciales:</p>
    <p><code class="sql">SELECT AVG(ingresos_generados)
FROM comerciales;</code></p>
    <p>Y con ese resultado, comparar el coste de cada comercial contra ese valor. Para usarlo como
    subconsulta basta escribirlo directamente en el <code>WHERE</code>:</p>
    <p><code class="sql">SELECT *
FROM comerciales
WHERE salario &gt;
   <strong>(SELECT AVG(ingresos_generados)
    FROM comerciales)</strong>;</code></p>
    <p>Al evaluar la restricción, el salario de cada comercial se compara con el valor devuelto por la
    subconsulta interior.</p>
</div>

<p>Una subconsulta puede aparecer allí donde puede aparecer una tabla normal. Dentro de un
<code>FROM</code> puedes hacer <code>JOIN</code> de subconsultas con otras tablas; dentro de un
<code>WHERE</code> o un <code>HAVING</code> puedes comparar expresiones contra su resultado; e incluso en
expresiones del <code>SELECT</code>, para devolver datos directamente desde la subconsulta. Se ejecutan en
el mismo orden lógico que la parte de la consulta en la que aparecen.</p>

<p>Como las subconsultas pueden anidarse, cada una debe ir completamente entre paréntesis para establecer
la jerarquía correcta. Por lo demás pueden referenciar cualquier tabla y usar todas las construcciones de
una consulta normal (aunque algunas implementaciones no permiten <code>LIMIT</code> u <code>OFFSET</code>
dentro de una subconsulta).</p>

<h1>Tipos de subconsulta</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:25%">Tipo</td><td>Devuelve</td><td>Se usa en</td></tr>
    <tr><td>Escalar</td><td>Un único valor (1 fila, 1 columna)</td><td><code>SELECT</code>, <code>WHERE</code>, <code>HAVING</code></td></tr>
    <tr><td>De lista</td><td>Una columna con varias filas</td><td><code>IN</code>, <code>NOT IN</code>, <code>ANY</code>, <code>ALL</code></td></tr>
    <tr><td>De tabla (derivada)</td><td>Una tabla completa</td><td><code>FROM</code>, <code>JOIN</code></td></tr>
    <tr><td>Correlacionada</td><td>Depende de la fila exterior</td><td><code>WHERE</code>, <code>SELECT</code>, <code>EXISTS</code></td></tr>
  </table>
</div>

<h1>Subconsultas correlacionadas</h1>
<p>Un tipo más potente es la <i>subconsulta correlacionada</i>, en la que la consulta interior referencia
—y depende de— una columna o alias de la consulta exterior. A diferencia de las anteriores, estas consultas
interiores deben ejecutarse <em>para cada fila</em> de la consulta exterior.</p>

<div class="dyk">
    <div class="desc">Ejemplo: subconsulta correlacionada</div>
    <p>En lugar de la lista de comerciales, imagina una lista general de empleados con su departamento
    (ingeniería, ventas…), sus ingresos y su salario. Ahora buscas, en toda la empresa, a quienes rinden
    por debajo de la media <em>de su departamento</em>:</p>
    <p><code class="sql">SELECT *
FROM empleados
WHERE salario &gt;
   (SELECT AVG(ingresos_generados)
    FROM empleados AS emp_dept
    <strong>WHERE emp_dept.departamento = empleados.departamento</strong>);</code></p>
</div>

<p>Estas consultas son potentes pero difíciles de leer, así que úsalas con cuidado y da alias con sentido a
los valores y tablas temporales. Además, las subconsultas correlacionadas pueden ser difíciles de optimizar,
así que el rendimiento varía mucho entre motores. Muchas veces una <a href="#/cte">CTE</a> o una función de
ventana expresan lo mismo de forma más legible y rápida.</p>

<h1>Comprobar existencia</h1>
<p>Cuando presentamos las restricciones <code>WHERE</code> en la <a href="#/where-numeros">Lección 2</a>,
usamos el operador <code>IN</code> para comprobar si el valor de una columna estaba en una lista fija. En
consultas complejas esto se amplía con subconsultas para comprobar si el valor existe en una lista
<em>dinámica</em>.</p>

<div class="definition">
    <div class="desc">SELECT con restricción por subconsulta</div>
    <code class="sql">SELECT *, …
FROM mi_tabla
WHERE columna
    <strong>IN/NOT IN</strong> (SELECT otra_columna
               FROM otra_tabla);</code>
</div>

<p>Fíjate en que la subconsulta interior debe seleccionar un valor o expresión de una sola columna, para
producir una lista contra la que comparar. Este tipo de restricción es muy potente cuando depende de datos
actuales.</p>

<div class="callout danger">
  <div class="desc">NOT IN y los NULL</div>
  <p>Si la subconsulta de un <code>NOT IN</code> devuelve algún <code>NULL</code>, la condición nunca es
  cierta y la consulta devuelve cero filas. Por eso, para «los que no están», suele ser más seguro
  <code>NOT EXISTS</code>:</p>
  <p><code class="sql">SELECT * FROM clientes c
WHERE NOT EXISTS (SELECT 1 FROM pedidos p WHERE p.cliente_id = c.id);</code></p>
</div>

<h1>Ejercicio</h1>
<p>Trabajarás con la base <strong>Tienda online</strong>: clientes, productos, pedidos y sus líneas de
detalle. Explora las tablas en las pestañas antes de empezar.</p>
`,
  exercise: {
    dataset: 'tienda',
    tables: ['clientes', 'productos', 'pedidos', 'detalle_pedido', 'categorias'],
    title: 'Ejercicio: subconsultas',
    starter: 'SELECT * FROM productos;',
    tasks: [
      { text: 'Lista el <code>nombre</code> de los productos cuyo precio es mayor que el precio medio de todos los productos',
        hint: 'Una subconsulta escalar con <code>AVG(precio)</code> dentro del <code>WHERE</code>.',
        solution: 'SELECT nombre FROM productos\nWHERE precio > (SELECT AVG(precio) FROM productos);',
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Lista el <code>nombre</code> de los clientes que <strong>no</strong> han hecho ningún pedido en 2024',
        hint: 'Usa <code>NOT IN</code> con una subconsulta sobre <code>pedidos</code> filtrada por fecha.',
        solution: "SELECT nombre FROM clientes\nWHERE id NOT IN (SELECT cliente_id FROM pedidos WHERE fecha >= '2024-01-01');",
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Lista el <code>nombre</code> de los clientes que tienen algún pedido <code>cancelado</code>, usando <code>EXISTS</code>',
        hint: '<code>EXISTS (SELECT 1 FROM pedidos p WHERE p.cliente_id = c.id AND …)</code>',
        queryChecks: ['EXISTS'],
        solution: "SELECT nombre FROM clientes c\nWHERE EXISTS (SELECT 1 FROM pedidos p\n              WHERE p.cliente_id = c.id AND p.estado = 'cancelado');",
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Con una subconsulta <strong>correlacionada</strong>, lista el <code>nombre</code> y el <code>precio</code> de los productos que cuestan más que la media de su propia categoría',
        hint: 'La subconsulta interior debe filtrar por <code>categoria_id</code> de la fila exterior.',
        solution: 'SELECT nombre, precio\nFROM productos p\nWHERE precio > (SELECT AVG(p2.precio) FROM productos p2\n                WHERE p2.categoria_id = p.categoria_id);',
        checks: [{ type: 'row_col_val_solution_query', data: null }] }
    ]
  }
});
