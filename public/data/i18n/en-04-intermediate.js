I18N.registerLessons('en', {

'subconsultas': {
  title: 'Topic: Subqueries',
  shortTitle: 'Subqueries',
  summary: 'Queries inside queries: scalar, list, correlated and EXISTS.',
  body: `
<p>You may have noticed that, even with a complete query, there are questions we can't answer without extra
pre- or post-processing. In those cases you can either run several queries and process the data yourself, or
build a more complex query using <i>subqueries</i>.</p>

<div class="dyk">
    <div class="desc">Example: general subquery</div>
    <p>Say your company has a list of sales associates, with the revenue each one brings in and their
    individual salary. Times are tight, and you want to find out which associates cost the company more than
    the average revenue brought per associate.</p>
    <p>First you'd need to calculate the average revenue all associates generate:</p>
    <p><code class="sql">SELECT AVG(revenue_generated)
FROM sales_associates;</code></p>
    <p>And then, using that result, compare each associate's cost against that value. To use it as a
    subquery, just write it straight into the <code>WHERE</code> clause:</p>
    <p><code class="sql">SELECT *
FROM sales_associates
WHERE salary &gt;
   <strong>(SELECT AVG(revenue_generated)
    FROM sales_associates)</strong>;</code></p>
    <p>As the constraint is evaluated, each associate's salary is tested against the value returned by the
    inner subquery.</p>
</div>

<p>A subquery can appear anywhere a normal table can. Inside a <code>FROM</code> clause you can
<code>JOIN</code> subqueries with other tables; inside a <code>WHERE</code> or <code>HAVING</code> constraint
you can test expressions against their results; and even in <code>SELECT</code> expressions, to return data
straight from the subquery. They run in the same logical order as the part of the query they appear in.</p>

<p>Because subqueries can be nested, each one must be fully enclosed in parentheses to establish the proper
hierarchy. Otherwise they can reference any table and use all the constructs of a normal query (though some
implementations don't allow <code>LIMIT</code> or <code>OFFSET</code> inside a subquery).</p>

<h1>Types of subquery</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:25%">Type</td><td>Returns</td><td>Used in</td></tr>
    <tr><td>Scalar</td><td>A single value (1 row, 1 column)</td><td><code>SELECT</code>, <code>WHERE</code>, <code>HAVING</code></td></tr>
    <tr><td>List</td><td>One column with several rows</td><td><code>IN</code>, <code>NOT IN</code>, <code>ANY</code>, <code>ALL</code></td></tr>
    <tr><td>Table (derived)</td><td>A whole table</td><td><code>FROM</code>, <code>JOIN</code></td></tr>
    <tr><td>Correlated</td><td>Depends on the outer row</td><td><code>WHERE</code>, <code>SELECT</code>, <code>EXISTS</code></td></tr>
  </table>
</div>

<h1>Correlated subqueries</h1>
<p>A more powerful type is the <i>correlated subquery</i>, in which the inner query references — and depends
on — a column or alias from the outer query. Unlike the subqueries above, each of these inner queries has to
run <em>for every row</em> of the outer query.</p>

<div class="dyk">
    <div class="desc">Example: correlated subquery</div>
    <p>Instead of the list of sales associates, imagine a general list of employees with their department
    (engineering, sales, …), revenue and salary. Now you're looking across the whole company for the
    employees who perform worse than the average <em>in their own department</em>:</p>
    <p><code class="sql">SELECT *
FROM employees
WHERE salary &gt;
   (SELECT AVG(revenue_generated)
    FROM employees AS dept_employees
    <strong>WHERE dept_employees.department = employees.department</strong>);</code></p>
</div>

<p>These queries are powerful but hard to read, so use them carefully and give meaningful aliases to the
temporary values and tables. Correlated subqueries can also be hard to optimise, so performance varies a lot
between engines. Often a <a href="#/cte">CTE</a> or a window function expresses the same thing more legibly
and faster.</p>

<h1>Existence tests</h1>
<p>When we introduced <code>WHERE</code> constraints in <a href="#/where-numeros">Lesson 2</a>, we used the
<code>IN</code> operator to test whether a column value existed in a fixed list. In complex queries this is
extended with subqueries to test whether the value exists in a <em>dynamic</em> list.</p>

<div class="definition">
    <div class="desc">Select query with a subquery constraint</div>
    <code class="sql">SELECT *, …
FROM mytable
WHERE column
    <strong>IN/NOT IN</strong> (SELECT another_column
               FROM another_table);</code>
</div>

<p>Notice that the inner subquery must select a single column value or expression, to produce a list the
outer value can be tested against. This kind of constraint is powerful when it depends on current data.</p>

<div class="callout danger">
  <div class="desc">NOT IN and NULLs</div>
  <p>If the subquery of a <code>NOT IN</code> returns any <code>NULL</code>, the condition is never true and
  the query returns zero rows. That's why, for "the ones that aren't there", <code>NOT EXISTS</code> is
  usually safer:</p>
  <p><code class="sql">SELECT * FROM clientes c
WHERE NOT EXISTS (SELECT 1 FROM pedidos p WHERE p.cliente_id = c.id);</code></p>
</div>

<h1>Exercise</h1>
<p>You'll work with the <strong>Online store</strong> database: customers (<code>clientes</code>), products
(<code>productos</code>), orders (<code>pedidos</code>) and their line items
(<code>detalle_pedido</code>). Browse the tables in the tabs before you start.</p>
`,
  exerciseTitle: 'Exercise: subqueries',
  tasks: [
    { text: 'List the <code>nombre</code> of the products whose price is higher than the average price of all products', hint: 'A scalar subquery with <code>AVG(precio)</code> inside the <code>WHERE</code>.' },
    { text: 'List the <code>nombre</code> of the customers who have <strong>not</strong> placed any order in 2024', hint: 'Use <code>NOT IN</code> with a subquery over <code>pedidos</code> filtered by date.' },
    { text: 'List the <code>nombre</code> of the customers who have at least one <code>cancelado</code> order, using <code>EXISTS</code>', hint: '<code>EXISTS (SELECT 1 FROM pedidos p WHERE p.cliente_id = c.id AND …)</code>' },
    { text: 'Using a <strong>correlated</strong> subquery, list the <code>nombre</code> and <code>precio</code> of the products that cost more than the average of their own category', hint: 'The inner subquery must filter by the <code>categoria_id</code> of the outer row.' }
  ]
},

'operaciones-de-conjunto': {
  title: 'Topic: Unions, intersections and differences',
  shortTitle: 'UNION, INTERSECT, EXCEPT',
  summary: 'Combining the results of several queries as sets.',
  body: `
<p>When working with multiple tables, the <code>UNION</code> and <code>UNION ALL</code> operators let you
append the results of one query to another, assuming they have the same column count, order and compatible
types. If you use <code>UNION</code> without <code>ALL</code>, duplicate rows are removed from the
result.</p>

<div class="definition">
    <div class="desc">Select query with set operators</div>
    <code class="sql">SELECT column, another_column
   FROM mytable
<strong>UNION / UNION ALL / INTERSECT / EXCEPT
SELECT other_column, yet_another_column
   FROM another_table</strong>
ORDER BY column DESC
LIMIT <i>n</i>;</code>
</div>

<p>In the order of operations described in <a href="#/orden-de-ejecucion">Lesson 12</a>, the
<code>UNION</code> happens <em>before</em> the <code>ORDER BY</code> and the <code>LIMIT</code>: that's why
you write a single <code>ORDER BY</code>, at the end, applying to the combined result.</p>

<p>Similar to <code>UNION</code>, the <code>INTERSECT</code> operator returns only rows that are identical
in both result sets, and <code>EXCEPT</code> returns only rows in the first set that aren't in the second.
This means <code>EXCEPT</code> is query order-sensitive, like <code>LEFT JOIN</code> and
<code>RIGHT JOIN</code>.</p>

<p>Both <code>INTERSECT</code> and <code>EXCEPT</code> also discard duplicate rows, though some databases
support <code>INTERSECT ALL</code> and <code>EXCEPT ALL</code> to keep them.</p>

<div class="callout note">
  <div class="desc">Differences between engines</div>
  <p>Oracle calls <code>EXCEPT</code> <code>MINUS</code>. MySQL had neither <code>INTERSECT</code> nor
  <code>EXCEPT</code> until version 8.0.31; before that they were emulated with <code>INNER JOIN</code> and
  <code>LEFT JOIN … WHERE … IS NULL</code> respectively.</p>
</div>

<h1>UNION versus JOIN</h1>
<p>They're easy to confuse: a <code>JOIN</code> combines tables <strong>sideways</strong> (adds columns),
while a <code>UNION</code> combines them <strong>vertically</strong> (adds rows). Use <code>UNION ALL</code>
whenever you know there are no duplicates: it avoids the cost of sorting and de-duplicating.</p>

<h1>Exercise</h1>
<p>We continue with the <strong>Online store</strong> database.</p>
`,
  exerciseTitle: 'Exercise: set operations',
  tasks: [
    { text: 'Return, in a single <code>nombre</code> column, every customer and employee name, without duplicates and sorted alphabetically', hint: 'Two <code>SELECT nombre</code> joined by <code>UNION</code> and a single <code>ORDER BY</code> at the end.' },
    { text: 'Find the <code>cliente_id</code>s that placed orders <strong>both</strong> in 2023 <strong>and</strong> in 2024', hint: 'Use <code>INTERSECT</code> between two queries filtered by year.' },
    { text: 'Find the <code>id</code>s of the products that have never been sold (they appear in no order line)', hint: 'Use <code>EXCEPT</code>: all products minus the ones in <code>detalle_pedido</code>.' }
  ]
},

'case-condicionales': {
  title: 'Topic: Conditional expressions (CASE, COALESCE, NULLIF)',
  shortTitle: 'CASE and conditionals',
  summary: 'if/else logic inside a query, and graceful NULL handling.',
  body: `
<p>SQL has no <code>if</code> like programming languages, but it does have a full conditional expression:
<code>CASE</code>. With it you can classify, translate, bucket values, or even build cross tables
(<i>pivots</i>) without leaving the query.</p>

<h1>CASE with conditions (searched form)</h1>
<div class="definition">
    <div class="desc">CASE WHEN … THEN … ELSE … END</div>
    <code class="sql">SELECT nombre,
       <strong>CASE
           WHEN precio &lt; 100  THEN 'budget'
           WHEN precio &lt; 500  THEN 'mid-range'
           ELSE                     'premium'
       END</strong> AS gama
FROM productos;</code>
</div>

<p>Conditions are evaluated in order and the first match wins. If none matches and there is no
<code>ELSE</code>, the result is <code>NULL</code>.</p>

<h1>CASE on a value (simple form)</h1>
<div class="definition">
    <div class="desc">CASE expression WHEN value THEN …</div>
    <code class="sql">SELECT id,
       <strong>CASE estado
           WHEN 'pendiente' THEN 'Not shipped'
           WHEN 'enviado'   THEN 'On its way'
           WHEN 'entregado' THEN 'Completed'
           ELSE 'Cancelled'
       END</strong> AS situacion
FROM pedidos;</code>
</div>

<h1>Where it can be used</h1>
<p><code>CASE</code> is an <em>expression</em>, so it works anywhere a value fits:</p>
<ul>
  <li>in the <code>SELECT</code>, to compute a derived column;</li>
  <li>inside an aggregate, to build <em>pivots</em>:
      <code>SUM(CASE WHEN estado = 'entregado' THEN 1 ELSE 0 END)</code>;</li>
  <li>in the <code>ORDER BY</code>, for a custom ordering:
      <code>ORDER BY CASE estado WHEN 'pendiente' THEN 1 WHEN 'enviado' THEN 2 ELSE 3 END</code>;</li>
  <li>in the <code>WHERE</code> and in <code>UPDATE … SET</code>.</li>
</ul>

<h1>Functions for handling NULL</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:30%">Function</td><td>What it does</td></tr>
    <tr><td><code>COALESCE(a, b, c, …)</code></td><td>Returns the first non-null argument. Standard and available in every engine.</td></tr>
    <tr><td><code>IFNULL(a, b)</code></td><td>Two-argument version (SQLite, MySQL). Oracle calls it <code>NVL</code>; SQL Server, <code>ISNULL</code>.</td></tr>
    <tr><td><code>NULLIF(a, b)</code></td><td>Returns <code>NULL</code> if <code>a = b</code>, otherwise <code>a</code>. Very handy to avoid division by zero: <code>x / NULLIF(y, 0)</code>.</td></tr>
    <tr><td><code>IIF(cond, a, b)</code></td><td>Shorthand for a two-branch <code>CASE</code> (SQLite 3.32+, SQL Server). Not standard.</td></tr>
  </table>
</div>

<div class="callout note">
  <div class="desc">Handy pattern: an average that ignores zeros</div>
  <p><code class="sql">SELECT AVG(sales / NULLIF(units, 0)) FROM data;</code><br/>
  If <code>units</code> is 0, the divisor becomes <code>NULL</code>, the division yields <code>NULL</code>
  and <code>AVG</code> ignores it instead of blowing up with a division-by-zero error.</p>
</div>

<h1>Exercise</h1>
<p>Use the <strong>Online store</strong> database to classify and summarise data with conditional
expressions.</p>
`,
  exerciseTitle: 'Exercise: CASE',
  tasks: [
    { text: "Show each product's <code>nombre</code> and a <code>gama</code> column that is <code>'económico'</code> when the price is under 100, <code>'medio'</code> when it is under 500 and <code>'premium'</code> otherwise", hint: 'Remember: conditions are evaluated in order.' },
    { text: "Show each customer's <code>nombre</code> and their city, replacing null values with the text <code>Sin ciudad</code>", hint: '<code>COALESCE</code> or <code>IFNULL</code>.' },
    { text: 'In a single row, count how many orders are <code>entregado</code>, <code>enviado</code>, <code>pendiente</code> and <code>cancelado</code> (one column per status)', hint: 'Combine <code>SUM()</code> with a <code>CASE</code> inside for each status.' }
  ]
},

'cte': {
  title: 'Topic: CTEs — the WITH clause and recursive queries',
  shortTitle: 'CTEs (WITH) and recursion',
  summary: 'Naming subqueries to write readable queries, and walking hierarchies.',
  body: `
<p>A <strong>CTE</strong> (Common Table Expression) is a subquery you give a name to <em>before</em> using it.
It is declared with <code>WITH</code> and then used as if it were another table.</p>

<div class="definition">
    <div class="desc">Basic syntax</div>
    <code class="sql"><strong>WITH cte_name AS (
    SELECT …
)</strong>
SELECT *
FROM cte_name
WHERE …;</code>
</div>

<p>Compared with a subquery nested in the <code>FROM</code>, a CTE:</p>
<ul>
  <li>reads top to bottom, in the order you think about the problem;</li>
  <li>can be referenced <em>several times</em> in the same query;</li>
  <li>lets you chain steps: one CTE can use the previous ones.</li>
</ul>

<div class="definition">
    <div class="desc">Several chained CTEs</div>
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

<h1>Recursive CTEs</h1>
<p>With <code>WITH RECURSIVE</code> a CTE can reference itself. It is the standard way of walking
hierarchical structures (org charts, nested categories, bills of materials, graphs) or generating series of
values.</p>

<p>A recursive CTE always has two parts joined by <code>UNION ALL</code>:</p>
<ol>
  <li>the <strong>base case</strong> (or anchor): the starting rows;</li>
  <li>the <strong>recursive step</strong>: a query that references the CTE itself and produces the next
      level. It repeats until it returns no new rows.</li>
</ol>

<div class="definition">
    <div class="desc">Walking an org chart</div>
    <code class="sql">WITH RECURSIVE arbol(id, nombre, jefe_id, nivel) AS (
    <i>-- base case: whoever has no manager</i>
    SELECT id, nombre, jefe_id, 0
    FROM empleados
    WHERE jefe_id IS NULL
  UNION ALL
    <i>-- recursive step: whoever reports to somebody already included</i>
    SELECT e.id, e.nombre, e.jefe_id, a.nivel + 1
    FROM empleados e
    JOIN arbol a ON e.jefe_id = a.id
)
SELECT nivel, nombre FROM arbol ORDER BY nivel;</code>
</div>

<div class="definition">
    <div class="desc">Generating a series of numbers</div>
    <code class="sql">WITH RECURSIVE meses(m) AS (
    SELECT 1
  UNION ALL
    SELECT m + 1 FROM meses WHERE m &lt; 12
)
SELECT m FROM meses;</code>
</div>

<div class="callout danger">
  <div class="desc">Watch out for infinite loops</div>
  <p>If the recursive step has no stopping condition (or the data has cycles), the query never ends. Always
  add a depth limit (<code>WHERE nivel &lt; 10</code>) or a <code>LIMIT</code> while developing.</p>
</div>

<div class="callout note">
  <div class="desc">Differences between engines</div>
  <p>SQLite, PostgreSQL and MySQL 8+ use <code>WITH RECURSIVE</code>. SQL Server and Oracle write just
  <code>WITH</code> (no <code>RECURSIVE</code> keyword). In PostgreSQL, a CTE marked
  <code>MATERIALIZED</code> / <code>NOT MATERIALIZED</code> lets you control whether it is computed once or
  inlined into the outer query.</p>
</div>

<h1>Exercise</h1>
<p><strong>Online store</strong> database. These queries are long: write them step by step.</p>
`,
  exerciseTitle: 'Exercise: CTEs',
  tasks: [
    { text: 'With a CTE named <code>totales</code> that computes the amount (<code>SUM(cantidad * precio_unit)</code>) of each order, return the <code>pedido_id</code> and the <code>total</code> of the orders above 1000, sorted from highest to lowest', hint: 'Group by <code>pedido_id</code> inside the CTE and filter outside.' },
    { text: 'With a <strong>recursive</strong> CTE, return the hierarchy <code>nivel</code> and the <code>nombre</code> of each employee (management is level 0), ordered by level and name', hint: 'Base case: <code>WHERE jefe_id IS NULL</code>. Recursive step: <code>JOIN</code> <code>empleados</code> with the CTE itself.' },
    { text: 'Use a recursive CTE to generate a column <code>m</code> with the numbers from 1 to 12', hint: 'Base case <code>SELECT 1</code>, recursive step <code>SELECT m + 1 … WHERE m &lt; 12</code>.' }
  ]
}

});
