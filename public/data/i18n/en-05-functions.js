I18N.registerLessons('en', {

'funciones-escalares': {
  title: 'Topic: Scalar functions (text, numbers, conversion)',
  shortTitle: 'Scalar functions',
  summary: 'Functions that turn one value into another: strings, maths and CAST.',
  body: `
<p>A <strong>scalar function</strong> takes one or more values and returns <em>one</em> value, row by row. It
differs from aggregate functions (<code>SUM</code>, <code>COUNT</code>…), which reduce many rows to one.</p>

<h1>Text functions</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:34%">Function</td><td>What it does</td><td>Example</td></tr>
    <tr><td><code>LENGTH(s)</code></td><td>Number of characters</td><td><code>LENGTH('hola')</code> → 4</td></tr>
    <tr><td><code>UPPER(s)</code> / <code>LOWER(s)</code></td><td>Upper / lower case</td><td><code>UPPER('sql')</code> → <code>SQL</code></td></tr>
    <tr><td><code>TRIM(s)</code>, <code>LTRIM</code>, <code>RTRIM</code></td><td>Strips spaces (or the given characters)</td><td><code>TRIM('  x  ')</code> → <code>x</code></td></tr>
    <tr><td><code>SUBSTR(s, start, length)</code></td><td>Substring; the first character is position 1</td><td><code>SUBSTR('database',1,4)</code> → <code>data</code></td></tr>
    <tr><td><code>REPLACE(s, find, put)</code></td><td>Replaces every occurrence</td><td><code>REPLACE('a-b','-','/')</code> → <code>a/b</code></td></tr>
    <tr><td><code>INSTR(s, sub)</code></td><td>Position of the first occurrence (0 if absent)</td><td><code>INSTR('a@b','@')</code> → 2</td></tr>
    <tr><td><code>a || b</code></td><td>Standard concatenation</td><td><code>'a' || 'b'</code> → <code>ab</code></td></tr>
    <tr><td><code>PRINTF(fmt, …)</code></td><td>C-style formatting (SQLite; <code>FORMAT</code> elsewhere)</td><td><code>PRINTF('%.2f', 3.14159)</code> → <code>3.14</code></td></tr>
  </table>
</div>

<div class="callout note">
  <div class="desc">Different names per engine</div>
  <p>Concatenation: <code>||</code> in SQLite, PostgreSQL and Oracle; <code>CONCAT(a,b)</code> in MySQL
  (where <code>||</code> is logical OR) and <code>+</code> in SQL Server. Substring position:
  <code>INSTR</code> (SQLite, MySQL, Oracle), <code>POSITION(sub IN s)</code> (standard/PostgreSQL),
  <code>CHARINDEX</code> (SQL Server). Length: <code>LENGTH</code> everywhere except SQL Server, which uses
  <code>LEN</code>.</p>
</div>

<h1>Numeric functions</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:34%">Function</td><td>What it does</td></tr>
    <tr><td><code>ROUND(x, decimals)</code></td><td>Rounds to the given number of decimals</td></tr>
    <tr><td><code>ABS(x)</code></td><td>Absolute value</td></tr>
    <tr><td><code>CEIL(x)</code> / <code>FLOOR(x)</code></td><td>Round up / down (SQLite 3.35+)</td></tr>
    <tr><td><code>x % y</code> or <code>MOD(x, y)</code></td><td>Remainder of the division</td></tr>
    <tr><td><code>POWER(x, y)</code>, <code>SQRT(x)</code>, <code>EXP</code>, <code>LOG</code></td><td>Powers, roots and logarithms</td></tr>
    <tr><td><code>RANDOM()</code> / <code>RAND()</code></td><td>Random number (handy with <code>ORDER BY RANDOM() LIMIT 1</code>)</td></tr>
    <tr><td><code>MIN(a,b)</code> / <code>MAX(a,b)</code></td><td>With <em>several arguments</em> they are scalar (not to be confused with the single-argument aggregates)</td></tr>
  </table>
</div>

<h1>Type conversion: CAST</h1>
<div class="definition">
    <div class="desc">CAST(expression AS type)</div>
    <code class="sql">SELECT CAST('42' AS INTEGER) + 1,        <i>-- 43</i>
       CAST(precio AS INTEGER),          <i>-- truncates the decimals</i>
       CAST(3 AS REAL) / 2               <i>-- 1.5 instead of 1</i>
FROM productos;</code>
</div>

<div class="callout danger">
  <div class="desc">The integer division trap</div>
  <p>In most engines, <code>7 / 2</code> with two integers gives <code>3</code>, not <code>3.5</code>.
  Convert one of the operands: <code>7 * 1.0 / 2</code> or <code>CAST(7 AS REAL) / 2</code>. This is the
  number one cause of percentages that come out as zero.</p>
</div>

<h1>Exercise</h1>
<p><strong>Online store</strong> database.</p>
`,
  exerciseTitle: 'Exercise: scalar functions',
  tasks: [
    { text: "Show each customer's <code>nombre</code> in upper case (column <code>nombre_mayus</code>) and the number of characters in their name (column <code>letras</code>)", hint: '<code>UPPER()</code> and <code>LENGTH()</code>.' },
    { text: 'List the <strong>distinct</strong> email domains of the customers who have an email (the part after the <code>@</code>)', hint: "Combine <code>SUBSTR</code> with <code>INSTR(email, '@')</code> and use <code>DISTINCT</code>." },
    { text: "Show each product's <code>nombre</code> and its price with 21% VAT rounded to 2 decimals, in a <code>precio_iva</code> column", hint: '<code>ROUND(precio * 1.21, 2)</code>.' },
    { text: 'Show a single <code>etiqueta</code> column with the format <code>Name (Country)</code> for each customer — for example <code>Ana Ruiz (España)</code>', hint: 'Concatenate with <code>||</code>.' }
  ]
},

'funciones-fechas': {
  title: 'Topic: Date and time functions',
  shortTitle: 'Dates and times',
  summary: 'Extracting parts of a date, adding intervals and computing differences.',
  body: `
<p>Dates are the data type with the most differences between engines. The good news is that the
<em>operations</em> are always the same four: get the current date, extract a part, add or subtract an
interval, and compute the difference between two dates.</p>

<h1>How they are stored</h1>
<p>SQLite has no native <code>DATE</code> type: it stores dates as ISO-8601 text
(<code>'2024-03-05'</code>, <code>'2024-03-05 14:30:00'</code>), as a Julian day number, or as Unix seconds.
The ISO text format is the recommended one because it sorts and compares correctly as a string.</p>

<div class="callout note">
  <div class="desc">General advice</div>
  <p>Always store dates in a real date type (or in ISO text) and in UTC. Storing
  <code>'05/03/2024'</code> as text turns any sorting or comparison into a problem.</p>
</div>

<h1>Current date and time</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:34%">SQLite</td><td>Other engines</td></tr>
    <tr><td><code>date('now')</code></td><td><code>CURRENT_DATE</code></td></tr>
    <tr><td><code>datetime('now')</code></td><td><code>CURRENT_TIMESTAMP</code>, <code>NOW()</code> (MySQL/PostgreSQL), <code>GETDATE()</code> (SQL Server), <code>SYSDATE</code> (Oracle)</td></tr>
  </table>
</div>

<h1>Extracting parts of a date</h1>
<p>SQLite uses <code>strftime(format, date)</code>; the standard uses
<code>EXTRACT(part FROM date)</code>.</p>

<div class="definition">
    <div class="desc">strftime</div>
    <code class="sql">SELECT fecha,
       strftime('%Y', fecha) AS anio,    <i>-- '2024'</i>
       strftime('%m', fecha) AS mes,     <i>-- '03'</i>
       strftime('%d', fecha) AS dia,
       strftime('%Y-%m', fecha) AS periodo,
       strftime('%w', fecha) AS dia_semana   <i>-- 0 = Sunday</i>
FROM pedidos;</code>
</div>

<p>Careful: <code>strftime</code> returns <strong>text</strong>. If you need a number to compare or add,
wrap it in <code>CAST(… AS INTEGER)</code>.</p>

<h1>Adding and subtracting intervals</h1>
<div class="definition">
    <div class="desc">date()/datetime() modifiers in SQLite</div>
    <code class="sql">SELECT date('2024-03-05', '+30 days')            AS in_30_days,
       date('2024-03-05', '-1 month')             AS a_month_ago,
       date('2024-03-05', 'start of month')       AS first_day,
       date('2024-03-05', 'start of month',
                          '+1 month', '-1 day')   AS last_day,
       datetime('now', 'localtime')               AS now_local;</code>
</div>

<p>The equivalent elsewhere: <code>date + INTERVAL '30 day'</code> (PostgreSQL),
<code>DATE_ADD(date, INTERVAL 30 DAY)</code> (MySQL), <code>DATEADD(day, 30, date)</code> (SQL Server).</p>

<h1>Difference between two dates</h1>
<p>In SQLite you subtract using <code>julianday()</code>, which converts a date to a number of days:</p>

<div class="definition">
    <div class="desc">Days and years between two dates</div>
    <code class="sql">SELECT CAST(julianday('2025-01-01') - julianday(fecha_ingreso) AS INTEGER) AS dias,
       CAST((julianday('2025-01-01') - julianday(fecha_ingreso)) / 365.25 AS INTEGER) AS anios
FROM empleados;</code>
</div>

<p>Elsewhere: <code>date_b - date_a</code> (PostgreSQL, yields an interval),
<code>DATEDIFF(date_b, date_a)</code> (MySQL) or <code>DATEDIFF(day, a, b)</code> (SQL Server).</p>

<div class="callout danger">
  <div class="desc">Don't apply functions to the column you filter on</div>
  <p><code>WHERE strftime('%Y', fecha) = '2024'</code> forces a full table scan because the index on
  <code>fecha</code> becomes useless. Write ranges instead:
  <code>WHERE fecha &gt;= '2024-01-01' AND fecha &lt; '2025-01-01'</code>. We cover this in
  <a href="#/indices">Indexes</a>.</p>
</div>

<h1>Exercise</h1>
<p><strong>Online store</strong> database. Dates are stored as ISO text (<code>YYYY-MM-DD</code>).</p>
`,
  exerciseTitle: 'Exercise: dates',
  tasks: [
    { text: 'Show the <code>id</code> of each order together with its <code>anio</code> and <code>mes</code> extracted from the <code>fecha</code> column', hint: "<code>strftime('%Y', fecha)</code> and <code>strftime('%m', fecha)</code>." },
    { text: 'Count how many orders there are per year: an <code>anio</code> column and a <code>pedidos</code> column, sorted by year ascending', hint: "Group by the expression <code>strftime('%Y', fecha)</code>." },
    { text: 'List the <code>id</code> and <code>fecha</code> of the orders in the first quarter of 2024, using a <strong>date range</strong> (without applying functions to the column)', hint: "<code>WHERE fecha &gt;= '2024-01-01' AND fecha &lt; '2024-04-01'</code>." },
    { text: "Show each employee's <code>nombre</code> and their full years of service as of <code>2025-01-01</code>, in an <code>anios</code> column", hint: 'Subtract with <code>julianday()</code>, divide by 365.25 and cast to integer with <code>CAST</code>.' }
  ]
},

'funciones-de-ventana': {
  title: 'Topic: Window functions (OVER, PARTITION BY)',
  shortTitle: 'Window functions',
  summary: 'Aggregating without grouping: rankings, running totals and row-to-row comparisons.',
  body: `
<p>Regular aggregate functions <em>collapse</em> rows: <code>GROUP BY categoria</code> turns fifteen products
into five rows. <strong>Window functions</strong> do the same computation but <em>keep every row</em>, adding
the result as one more column.</p>

<div class="definition">
    <div class="desc">Anatomy of a window function</div>
    <code class="sql">FUNCTION(…) <strong>OVER (
    PARTITION BY column       <i>-- optional: splits into groups</i>
    ORDER BY another_column   <i>-- optional: defines the order inside the group</i>
    ROWS BETWEEN … AND …      <i>-- optional: bounds the frame of rows</i>
)</strong></code>
</div>

<ul>
  <li><strong>PARTITION BY</strong> is the window's "<code>GROUP BY</code>": it restarts the computation for
      each group. If omitted, the window is the whole result.</li>
  <li><strong>ORDER BY</strong> sorts within each partition. It is required for rankings and running
      totals.</li>
  <li><strong>The frame</strong> (<code>ROWS</code>/<code>RANGE</code>) defines which rows enter the
      computation for each row. By default, with <code>ORDER BY</code>, it is "from the start of the
      partition to the current row" — which is why <code>SUM() OVER (ORDER BY …)</code> gives a running
      total.</li>
</ul>

<h1>Position and ranking functions</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:30%">Function</td><td>What it returns</td></tr>
    <tr><td><code>ROW_NUMBER()</code></td><td>Sequential 1, 2, 3… with no ties</td></tr>
    <tr><td><code>RANK()</code></td><td>Rank with ties; leaves gaps (1, 1, 3)</td></tr>
    <tr><td><code>DENSE_RANK()</code></td><td>Rank with ties; no gaps (1, 1, 2)</td></tr>
    <tr><td><code>NTILE(n)</code></td><td>Splits the rows into <code>n</code> buckets of similar size (quartiles, deciles…)</td></tr>
    <tr><td><code>PERCENT_RANK()</code>, <code>CUME_DIST()</code></td><td>Relative position between 0 and 1</td></tr>
  </table>
</div>

<div class="definition">
    <div class="desc">The most expensive products in each category</div>
    <code class="sql">SELECT categoria_id, nombre, precio,
       <strong>ROW_NUMBER() OVER (PARTITION BY categoria_id ORDER BY precio DESC)</strong> AS puesto
FROM productos;</code>
</div>

<p>To keep only the "top N per group", wrap the query in a CTE and filter on the rank: you can't use the
window function in the <code>WHERE</code> of the same query, because windows are computed <em>after</em> the
<code>WHERE</code>.</p>

<div class="definition">
    <div class="desc">Top 1 per category</div>
    <code class="sql">WITH ranking AS (
    SELECT categoria_id, nombre, precio,
           ROW_NUMBER() OVER (PARTITION BY categoria_id ORDER BY precio DESC) AS puesto
    FROM productos
)
SELECT * FROM ranking WHERE puesto = 1;</code>
</div>

<h1>Offset functions</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:30%">Function</td><td>What it returns</td></tr>
    <tr><td><code>LAG(col, n, default)</code></td><td>The value <code>n</code> rows earlier (1 by default)</td></tr>
    <tr><td><code>LEAD(col, n, default)</code></td><td>The value <code>n</code> rows later</td></tr>
    <tr><td><code>FIRST_VALUE(col)</code>, <code>LAST_VALUE(col)</code></td><td>First / last value of the frame</td></tr>
  </table>
</div>

<div class="definition">
    <div class="desc">Days since each customer's previous order</div>
    <code class="sql">SELECT cliente_id, fecha,
       <strong>LAG(fecha) OVER (PARTITION BY cliente_id ORDER BY fecha)</strong> AS pedido_anterior,
       julianday(fecha) - julianday(
           LAG(fecha) OVER (PARTITION BY cliente_id ORDER BY fecha)) AS dias
FROM pedidos;</code>
</div>

<h1>Aggregates as windows</h1>
<p><code>SUM</code>, <code>AVG</code>, <code>COUNT</code>, <code>MIN</code> and <code>MAX</code> also work
with <code>OVER</code>:</p>

<div class="definition">
    <div class="desc">Running total and share of the group</div>
    <code class="sql">SELECT fecha, importe,
       SUM(importe) OVER (ORDER BY fecha)                       AS acumulado,
       ROUND(100.0 * importe /
             SUM(importe) OVER (PARTITION BY categoria), 1)     AS pct_categoria
FROM ventas;</code>
</div>

<div class="callout note">
  <div class="desc">Availability</div>
  <p>Window functions: SQLite 3.25+, PostgreSQL forever, MySQL 8.0+, MariaDB 10.2+, SQL Server 2012+,
  Oracle since 8i. In MySQL 5.7 and earlier they have to be emulated with user variables or correlated
  subqueries.</p>
</div>

<h1>Exercise</h1>
<p><strong>Online store</strong> database.</p>
`,
  exerciseTitle: 'Exercise: windows',
  tasks: [
    { text: "Show <code>categoria_id</code>, <code>nombre</code>, <code>precio</code> and a <code>puesto</code> column with the product's position within its category, from most to least expensive", hint: '<code>ROW_NUMBER() OVER (PARTITION BY … ORDER BY … DESC)</code>.' },
    { text: 'Using a CTE, return only the <strong>most expensive product of each category</strong>: <code>categoria_id</code>, <code>nombre</code> and <code>precio</code>', hint: 'Compute the ranking in a CTE and filter <code>puesto = 1</code> outside.' },
    { text: 'For each order show <code>cliente_id</code>, <code>fecha</code> and the date of that <strong>same customer\\u2019s previous order</strong> in a <code>pedido_anterior</code> column', hint: '<code>LAG(fecha) OVER (PARTITION BY cliente_id ORDER BY fecha)</code>.' },
    { text: "Show <code>nombre</code>, <code>precio</code> and the percentage each product's price represents of the sum of prices in its category, rounded to one decimal, in a <code>pct</code> column", hint: 'Divide the price by <code>SUM(precio) OVER (PARTITION BY categoria_id)</code>. Remember to multiply by <code>100.0</code>.' }
  ]
}

});
