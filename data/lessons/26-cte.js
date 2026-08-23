CURSO.register({
  slug: 'cte',
  section: 'intermedio',
  source: 'extra',
  title: 'Tema: CTEs — la cláusula WITH y las consultas recursivas',
  shortTitle: 'CTEs (WITH) y recursión',
  summary: 'Nombrar subconsultas para escribir consultas legibles, y recorrer jerarquías.',
  keywords: 'cte with recursive common table expression jerarquia arbol recursiva',
  body: `
<p>Una <strong>CTE</strong> (<i>Common Table Expression</i>, expresión de tabla común) es una subconsulta a
la que le pones nombre <em>antes</em> de usarla. Se declara con <code>WITH</code> y luego se usa como si
fuera una tabla más.</p>

<div class="definition">
    <div class="desc">Sintaxis básica</div>
    <code class="sql"><strong>WITH nombre_cte AS (
    SELECT …
)</strong>
SELECT *
FROM nombre_cte
WHERE …;</code>
</div>

<p>Comparada con una subconsulta anidada en el <code>FROM</code>, una CTE:</p>
<ul>
  <li>se lee de arriba abajo, en el orden en que piensas el problema;</li>
  <li>se puede referenciar <em>varias veces</em> en la misma consulta;</li>
  <li>permite encadenar pasos: una CTE puede usar las anteriores.</li>
</ul>

<div class="definition">
    <div class="desc">Varias CTEs encadenadas</div>
    <code class="sql">WITH lineas AS (
    SELECT pedido_id, SUM(cantidad * precio_unit) AS total
    FROM detalle_pedido
    GROUP BY pedido_id
), grandes AS (
    SELECT * FROM lineas WHERE total &gt; 1000
)
SELECT p.id, c.nombre, g.total
FROM grandes g
JOIN pedidos  p ON p.id = g.pedido_id
JOIN clientes c ON c.id = p.cliente_id;</code>
</div>

<h1>CTEs recursivas</h1>
<p>Con <code>WITH RECURSIVE</code> una CTE puede referenciarse a sí misma. Es la forma estándar de recorrer
estructuras jerárquicas (organigramas, categorías anidadas, listas de materiales, grafos) o de generar
series de valores.</p>

<p>Una CTE recursiva tiene siempre dos partes unidas por <code>UNION ALL</code>:</p>
<ol>
  <li>el <strong>caso base</strong> (o «ancla»): las filas de partida;</li>
  <li>el <strong>paso recursivo</strong>: una consulta que referencia la propia CTE y produce el siguiente
      nivel. Se repite hasta que no devuelve filas nuevas.</li>
</ol>

<div class="definition">
    <div class="desc">Recorrer un organigrama</div>
    <code class="sql">WITH RECURSIVE arbol(id, nombre, jefe_id, nivel) AS (
    <i>-- caso base: quien no tiene jefe</i>
    SELECT id, nombre, jefe_id, 0
    FROM empleados
    WHERE jefe_id IS NULL
  UNION ALL
    <i>-- paso recursivo: quien depende de alguien ya incluido</i>
    SELECT e.id, e.nombre, e.jefe_id, a.nivel + 1
    FROM empleados e
    JOIN arbol a ON e.jefe_id = a.id
)
SELECT nivel, nombre FROM arbol ORDER BY nivel;</code>
</div>

<div class="definition">
    <div class="desc">Generar una serie de números</div>
    <code class="sql">WITH RECURSIVE meses(m) AS (
    SELECT 1
  UNION ALL
    SELECT m + 1 FROM meses WHERE m &lt; 12
)
SELECT m FROM meses;</code>
</div>

<div class="callout danger">
  <div class="desc">Cuidado con los bucles infinitos</div>
  <p>Si el paso recursivo no tiene una condición de parada (o los datos tienen ciclos), la consulta no
  termina. Añade siempre un límite de profundidad (<code>WHERE nivel &lt; 10</code>) o un
  <code>LIMIT</code> mientras desarrollas.</p>
</div>

<div class="callout note">
  <div class="desc">Diferencias entre motores</div>
  <p>SQLite, PostgreSQL y MySQL 8+ usan <code>WITH RECURSIVE</code>. SQL Server y Oracle escriben solo
  <code>WITH</code> (sin la palabra <code>RECURSIVE</code>). En PostgreSQL, una CTE con
  <code>MATERIALIZED</code> / <code>NOT MATERIALIZED</code> te deja controlar si se calcula una sola vez o
  se integra en la consulta exterior.</p>
</div>

<h1>Ejercicio</h1>
<p>Base <strong>Tienda online</strong>. Estas consultas son largas: escríbelas por pasos.</p>
`,
  exercise: {
    dataset: 'tienda',
    tables: ['pedidos', 'detalle_pedido', 'clientes', 'empleados'],
    title: 'Ejercicio: CTEs',
    starter: 'SELECT * FROM pedidos;',
    tasks: [
      { text: 'Con una CTE llamada <code>totales</code> que calcule el importe (<code>SUM(cantidad * precio_unit)</code>) de cada pedido, devuelve el <code>pedido_id</code> y el <code>total</code> de los pedidos que superan los 1000, ordenados de mayor a menor',
        hint: 'Agrupa por <code>pedido_id</code> dentro de la CTE y filtra fuera.',
        queryChecks: ['WITH'],
        solution: 'WITH totales AS (\n  SELECT pedido_id, SUM(cantidad * precio_unit) AS total\n  FROM detalle_pedido\n  GROUP BY pedido_id\n)\nSELECT pedido_id, total\nFROM totales\nWHERE total > 1000\nORDER BY total DESC;',
        checks: [{ type: 'row_col_val_solution_query_ordered', data: null }] },
      { text: 'Con una CTE <strong>recursiva</strong>, devuelve el <code>nivel</code> jerárquico y el <code>nombre</code> de cada empleado (la dirección es el nivel 0), ordenado por nivel y nombre',
        hint: 'Caso base: <code>WHERE jefe_id IS NULL</code>. Paso recursivo: <code>JOIN</code> de <code>empleados</code> con la propia CTE.',
        queryChecks: ['RECURSIVE'],
        solution: 'WITH RECURSIVE arbol(id, nombre, jefe_id, nivel) AS (\n  SELECT id, nombre, jefe_id, 0 FROM empleados WHERE jefe_id IS NULL\n  UNION ALL\n  SELECT e.id, e.nombre, e.jefe_id, a.nivel + 1\n  FROM empleados e JOIN arbol a ON e.jefe_id = a.id\n)\nSELECT nivel, nombre FROM arbol ORDER BY nivel, nombre;',
        checks: [{ type: 'row_col_val_solution_query_ordered', data: null }] },
      { text: 'Genera con una CTE recursiva una columna <code>m</code> con los números del 1 al 12',
        hint: 'Caso base <code>SELECT 1</code>, paso recursivo <code>SELECT m + 1 … WHERE m &lt; 12</code>.',
        queryChecks: ['RECURSIVE'],
        solution: 'WITH RECURSIVE meses(m) AS (\n  SELECT 1\n  UNION ALL\n  SELECT m + 1 FROM meses WHERE m < 12\n)\nSELECT m FROM meses;',
        checks: [{ type: 'row_col_val_solution_query_ordered', data: null }] }
    ]
  }
});
