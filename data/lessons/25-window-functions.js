CURSO.register({
  slug: 'funciones-de-ventana',
  section: 'funciones',
  source: 'extra',
  title: 'Tema: Funciones de ventana (OVER, PARTITION BY)',
  shortTitle: 'Funciones de ventana',
  summary: 'Agregar sin agrupar: rankings, totales acumulados y comparación con la fila anterior.',
  keywords: 'window functions over partition by row_number rank dense_rank lag lead ntile running total',
  body: `
<p>Las funciones de agregado normales <em>colapsan</em> las filas: <code>GROUP BY categoria</code> convierte
quince productos en cinco filas. Las <strong>funciones de ventana</strong> hacen el mismo cálculo pero
<em>conservan cada fila</em>, añadiendo el resultado como una columna más.</p>

<div class="definition">
    <div class="desc">Anatomía de una función de ventana</div>
    <code class="sql">FUNCION(…) <strong>OVER (
    PARTITION BY columna      <i>-- opcional: divide en grupos</i>
    ORDER BY otra_columna     <i>-- opcional: define el orden dentro del grupo</i>
    ROWS BETWEEN … AND …      <i>-- opcional: acota el marco de filas</i>
)</strong></code>
</div>

<ul>
  <li><strong>PARTITION BY</strong> es el «<code>GROUP BY</code> de la ventana»: reinicia el cálculo en cada
      grupo. Si se omite, la ventana es todo el resultado.</li>
  <li><strong>ORDER BY</strong> ordena dentro de cada partición. Es obligatorio para los rankings y para los
      acumulados.</li>
  <li><strong>El marco</strong> (<code>ROWS</code>/<code>RANGE</code>) define qué filas entran en el cálculo
      de cada fila. Por defecto, con <code>ORDER BY</code>, es «desde el inicio de la partición hasta la
      fila actual» — de ahí que <code>SUM() OVER (ORDER BY …)</code> dé un total acumulado.</li>
</ul>

<h1>Funciones de posición y ranking</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:30%">Función</td><td>Qué devuelve</td></tr>
    <tr><td><code>ROW_NUMBER()</code></td><td>Número correlativo 1, 2, 3… sin empates</td></tr>
    <tr><td><code>RANK()</code></td><td>Puesto con empates; deja huecos (1, 1, 3)</td></tr>
    <tr><td><code>DENSE_RANK()</code></td><td>Puesto con empates; sin huecos (1, 1, 2)</td></tr>
    <tr><td><code>NTILE(n)</code></td><td>Reparte las filas en <code>n</code> grupos de tamaño similar (cuartiles, deciles…)</td></tr>
    <tr><td><code>PERCENT_RANK()</code>, <code>CUME_DIST()</code></td><td>Posición relativa entre 0 y 1</td></tr>
  </table>
</div>

<div class="definition">
    <div class="desc">Los productos más caros de cada categoría</div>
    <code class="sql">SELECT categoria_id, nombre, precio,
       <strong>ROW_NUMBER() OVER (PARTITION BY categoria_id ORDER BY precio DESC)</strong> AS puesto
FROM productos;</code>
</div>

<p>Para quedarte solo con el «top N por grupo», envuelve la consulta en una CTE y filtra por el puesto: no
puedes usar la función de ventana en el <code>WHERE</code> de la misma consulta, porque las ventanas se
calculan <em>después</em> del <code>WHERE</code>.</p>

<div class="definition">
    <div class="desc">Top 1 por categoría</div>
    <code class="sql">WITH ranking AS (
    SELECT categoria_id, nombre, precio,
           ROW_NUMBER() OVER (PARTITION BY categoria_id ORDER BY precio DESC) AS puesto
    FROM productos
)
SELECT * FROM ranking WHERE puesto = 1;</code>
</div>

<h1>Funciones de desplazamiento</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:30%">Función</td><td>Qué devuelve</td></tr>
    <tr><td><code>LAG(col, n, defecto)</code></td><td>El valor de <code>n</code> filas antes (por defecto, 1)</td></tr>
    <tr><td><code>LEAD(col, n, defecto)</code></td><td>El valor de <code>n</code> filas después</td></tr>
    <tr><td><code>FIRST_VALUE(col)</code>, <code>LAST_VALUE(col)</code></td><td>Primer / último valor del marco</td></tr>
  </table>
</div>

<div class="definition">
    <div class="desc">Días transcurridos desde el pedido anterior de cada cliente</div>
    <code class="sql">SELECT cliente_id, fecha,
       <strong>LAG(fecha) OVER (PARTITION BY cliente_id ORDER BY fecha)</strong> AS pedido_anterior,
       julianday(fecha) - julianday(
           LAG(fecha) OVER (PARTITION BY cliente_id ORDER BY fecha)) AS dias
FROM pedidos;</code>
</div>

<h1>Agregados como ventana</h1>
<p><code>SUM</code>, <code>AVG</code>, <code>COUNT</code>, <code>MIN</code> y <code>MAX</code> también
funcionan con <code>OVER</code>:</p>

<div class="definition">
    <div class="desc">Total acumulado y porcentaje sobre el grupo</div>
    <code class="sql">SELECT fecha, importe,
       SUM(importe) OVER (ORDER BY fecha)                       AS acumulado,
       ROUND(100.0 * importe /
             SUM(importe) OVER (PARTITION BY categoria), 1)     AS pct_categoria
FROM ventas;</code>
</div>

<div class="callout note">
  <div class="desc">Disponibilidad</div>
  <p>Funciones de ventana: SQLite 3.25+, PostgreSQL desde siempre, MySQL 8.0+, MariaDB 10.2+, SQL Server
  2012+, Oracle desde 8i. En MySQL 5.7 y anteriores hay que emularlas con variables de usuario o
  subconsultas correlacionadas.</p>
</div>

<h1>Ejercicio</h1>
<p>Base <strong>Tienda online</strong>.</p>
`,
  exercise: {
    dataset: 'tienda',
    tables: ['productos', 'categorias', 'pedidos', 'detalle_pedido'],
    title: 'Ejercicio: ventanas',
    starter: 'SELECT * FROM productos;',
    tasks: [
      { text: 'Muestra <code>categoria_id</code>, <code>nombre</code>, <code>precio</code> y una columna <code>puesto</code> con la posición del producto dentro de su categoría, del más caro al más barato',
        hint: '<code>ROW_NUMBER() OVER (PARTITION BY … ORDER BY … DESC)</code>.',
        queryChecks: ['OVER'],
        solution: 'SELECT categoria_id, nombre, precio,\n       ROW_NUMBER() OVER (PARTITION BY categoria_id ORDER BY precio DESC) AS puesto\nFROM productos;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Usando una CTE, devuelve solo el producto <strong>más caro de cada categoría</strong>: <code>categoria_id</code>, <code>nombre</code> y <code>precio</code>',
        hint: 'Calcula el ranking en una CTE y filtra <code>puesto = 1</code> fuera.',
        queryChecks: ['OVER'],
        solution: 'WITH ranking AS (\n  SELECT categoria_id, nombre, precio,\n         ROW_NUMBER() OVER (PARTITION BY categoria_id ORDER BY precio DESC) AS puesto\n  FROM productos\n)\nSELECT categoria_id, nombre, precio FROM ranking WHERE puesto = 1;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Para cada pedido muestra <code>cliente_id</code>, <code>fecha</code> y la fecha del <strong>pedido anterior de ese mismo cliente</strong> en una columna <code>pedido_anterior</code>',
        hint: '<code>LAG(fecha) OVER (PARTITION BY cliente_id ORDER BY fecha)</code>.',
        queryChecks: ['LAG'],
        solution: 'SELECT cliente_id, fecha,\n       LAG(fecha) OVER (PARTITION BY cliente_id ORDER BY fecha) AS pedido_anterior\nFROM pedidos;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Muestra <code>nombre</code>, <code>precio</code> y el porcentaje que representa el precio de cada producto sobre la suma de precios de su categoría, redondeado a un decimal, en una columna <code>pct</code>',
        hint: 'Divide el precio entre <code>SUM(precio) OVER (PARTITION BY categoria_id)</code>. Recuerda multiplicar por <code>100.0</code>.',
        queryChecks: ['OVER'],
        solution: 'SELECT nombre, precio,\n       ROUND(100.0 * precio / SUM(precio) OVER (PARTITION BY categoria_id), 1) AS pct\nFROM productos;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] }
    ]
  }
});
