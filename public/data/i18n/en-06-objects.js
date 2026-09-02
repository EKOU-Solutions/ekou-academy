I18N.registerLessons('en', {

'vistas': {
  title: 'Topic: Views (VIEW)',
  shortTitle: 'Views',
  summary: 'Saved queries with a name: they simplify, encapsulate and protect.',
  body: `
<p>A <strong>view</strong> is a saved query with a name. It stores no data: every time you query it, the
engine runs the query behind it. To whoever uses it, it behaves like just another table.</p>

<div class="definition">
    <div class="desc">Creating and using a view</div>
    <code class="sql">CREATE VIEW v_totales_pedido AS
SELECT p.id AS pedido_id,
       p.cliente_id,
       ROUND(SUM(d.cantidad * d.precio_unit), 2) AS total
FROM pedidos p
JOIN detalle_pedido d ON d.pedido_id = p.id
GROUP BY p.id;

<i>-- from here on it is queried like a table</i>
SELECT * FROM v_totales_pedido WHERE total &gt; 1000;</code>
</div>

<h1>What they are for</h1>
<ul>
  <li><strong>Simplifying</strong>: you encapsulate a six-table <code>JOIN</code> and the rest of the team
      writes <code>SELECT * FROM v_sales</code>.</li>
  <li><strong>Reusing business logic</strong>: the definition of "active customer" lives in one place instead
      of being copy-pasted into twenty queries.</li>
  <li><strong>Security</strong>: you grant access to the view, not the table. That way someone can query the
      orders without seeing the margin column or the personal data.</li>
  <li><strong>Stability</strong>: if the schema underneath changes, you can rewrite the view without breaking
      the queries that depend on it.</li>
</ul>

<div class="definition">
    <div class="desc">Other operations</div>
    <code class="sql">CREATE VIEW IF NOT EXISTS v_x AS SELECT …;   <i>-- does not fail if it exists</i>
DROP VIEW IF EXISTS v_x;                     <i>-- remove</i>
CREATE OR REPLACE VIEW v_x AS SELECT …;      <i>-- redefine (PostgreSQL, MySQL, Oracle)</i></code>
</div>

<div class="callout sqlite">
  <div class="desc">SQLite</div>
  <p>SQLite has no <code>CREATE OR REPLACE VIEW</code>: you have to <code>DROP VIEW</code> and create it
  again. Its views are always <strong>read-only</strong>; to write through a view you use an
  <code>INSTEAD OF</code> trigger (see <a href="#/triggers">Triggers</a>).</p>
</div>

<h1>Can you write to a view?</h1>
<p>It depends. A "simple" view (one table, no aggregates, no <code>DISTINCT</code>, no
<code>GROUP BY</code>) is usually updatable: an <code>UPDATE</code> on it translates into an
<code>UPDATE</code> on the base table. Views with aggregates or several tables are not, and you have to fall
back on <code>INSTEAD OF</code> triggers.</p>

<p>The <code>WITH CHECK OPTION</code> clause (PostgreSQL, MySQL, SQL Server) prevents inserting rows through
the view that would then not be visible in it.</p>

<h1>Materialized views</h1>
<p>A <strong>materialized view</strong> does store its result on disk: it is very fast to query, but the data
is a snapshot that has to be refreshed.</p>

<div class="datatable">
  <table class="table">
    <tr><td style="width:26%">Engine</td><td>Support</td></tr>
    <tr><td>PostgreSQL</td><td><code>CREATE MATERIALIZED VIEW …</code> + <code>REFRESH MATERIALIZED VIEW …</code></td></tr>
    <tr><td>Oracle</td><td><code>CREATE MATERIALIZED VIEW … REFRESH FAST ON COMMIT</code></td></tr>
    <tr><td>SQL Server</td><td>Indexed views (<code>CREATE VIEW … WITH SCHEMABINDING</code> + a unique clustered index)</td></tr>
    <tr><td>MySQL / SQLite</td><td>They don't exist. Emulate them with a real table recomputed in batch or with triggers.</td></tr>
  </table>
</div>

<div class="callout danger">
  <div class="desc">A view is not an index</div>
  <p>A plain view speeds nothing up by itself: the underlying query runs every time. Nesting views on views
  on views is a classic source of painfully slow queries.</p>
</div>

<h1>Exercise</h1>
<p><strong>Online store</strong> database. Run each statement once it's ready; if you get stuck, press
"Reset data".</p>
`,
  exerciseTitle: 'Exercise: views',
  tasks: [
    { text: 'Create a view named <code>v_totales_pedido</code> with the <code>pedido_id</code>, the <code>cliente_id</code> and the <code>total</code> of each order (the sum of <code>cantidad * precio_unit</code> over its line items)', hint: 'Join <code>pedidos</code> with <code>detalle_pedido</code> and group by the order id.' },
    { text: 'Query the view you just created to get the customer <code>nombre</code> and the <code>total</code> of the 3 largest orders', hint: 'A view is used just like a table: you can <code>JOIN</code> it with <code>clientes</code>.' },
    { text: 'Drop the <code>v_totales_pedido</code> view' }
  ]
},

'indices': {
  title: 'Topic: Indexes and execution plans',
  shortTitle: 'Indexes',
  summary: 'Why a query takes 2 ms or 2 seconds, and how to read the plan.',
  body: `
<p>An <strong>index</strong> is an auxiliary structure (almost always a B-tree) that the engine keeps sorted
by the values of one or more columns. It serves the same purpose as the index at the back of a book: finding
rows without reading them all.</p>

<div class="definition">
    <div class="desc">Creating and dropping indexes</div>
    <code class="sql">CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);

<i>-- composite index: the order of the columns matters</i>
CREATE INDEX idx_pedidos_cli_fecha ON pedidos(cliente_id, fecha);

<i>-- unique index: it also enforces uniqueness</i>
CREATE UNIQUE INDEX idx_clientes_email ON clientes(email);

<i>-- partial index: indexes only some of the rows</i>
CREATE INDEX idx_pedidos_abiertos ON pedidos(fecha)
    WHERE estado IN ('pendiente', 'enviado');

DROP INDEX idx_pedidos_cliente;</code>
</div>

<h1>What an index costs you</h1>
<p>It isn't free. Every index:</p>
<ul>
  <li>takes up disk space;</li>
  <li>slows down <code>INSERT</code>, <code>UPDATE</code> and <code>DELETE</code>, because it has to be
      maintained;</li>
  <li>may never be used if nobody filters by those columns.</li>
</ul>
<p>The rule of thumb: index the columns you filter on (<code>WHERE</code>), join on
(<code>JOIN … ON</code>) and sort by (<code>ORDER BY</code>) in the queries that <em>actually</em> are
frequent or slow.</p>

<h1>The leftmost prefix rule</h1>
<p>An index on <code>(cliente_id, fecha)</code> works for filtering by <code>cliente_id</code>, and for
filtering by <code>cliente_id</code> <em>and</em> <code>fecha</code>. It does <strong>not</strong> work for
filtering by <code>fecha</code> alone: that's like searching a phone book by first name.</p>

<h1>Sargable queries</h1>
<p>An index is only used if the condition can be turned into a search in the tree. These conditions
<strong>disable</strong> the index:</p>

<div class="datatable">
  <table class="table">
    <tr><td style="width:48%">Does not use the index</td><td>Alternative that does</td></tr>
    <tr><td><code>WHERE strftime('%Y', fecha) = '2024'</code></td><td><code>WHERE fecha &gt;= '2024-01-01' AND fecha &lt; '2025-01-01'</code></td></tr>
    <tr><td><code>WHERE UPPER(email) = 'A@B.COM'</code></td><td>An index on the expression, or storing the email already normalised</td></tr>
    <tr><td><code>WHERE nombre LIKE '%SSD%'</code></td><td><code>LIKE 'SSD%'</code> (no leading wildcard) or a full-text index</td></tr>
    <tr><td><code>WHERE precio * 1.21 &gt; 100</code></td><td><code>WHERE precio &gt; 100 / 1.21</code></td></tr>
  </table>
</div>

<h1>Reading the execution plan</h1>
<p>Every engine lets you ask "how do you intend to resolve this query?" before running it:</p>

<div class="datatable">
  <table class="table">
    <tr><td style="width:26%">Engine</td><td>Statement</td></tr>
    <tr><td>SQLite</td><td><code>EXPLAIN QUERY PLAN SELECT …</code></td></tr>
    <tr><td>PostgreSQL</td><td><code>EXPLAIN ANALYZE SELECT …</code></td></tr>
    <tr><td>MySQL</td><td><code>EXPLAIN</code> / <code>EXPLAIN ANALYZE</code></td></tr>
    <tr><td>SQL Server</td><td><code>SET SHOWPLAN_ALL ON</code> or the graphical plan</td></tr>
    <tr><td>Oracle</td><td><code>EXPLAIN PLAN FOR …</code> + <code>DBMS_XPLAN.DISPLAY</code></td></tr>
  </table>
</div>

<p>In SQLite what matters is the first word of each line:</p>
<ul>
  <li><code>SCAN table</code> → it reads the whole table. Fine on small tables, suspicious on big ones.</li>
  <li><code>SEARCH table USING INDEX idx (col=?)</code> → it is using an index. 👍</li>
  <li><code>USE TEMP B-TREE FOR ORDER BY</code> → it is sorting in memory because no index provides that
      order.</li>
</ul>

<div class="callout note">
  <div class="desc">Indexes that exist without asking</div>
  <p><code>PRIMARY KEY</code> and <code>UNIQUE</code> create an index automatically. Foreign keys do
  <strong>not</strong>: in most engines you should index the referencing column yourself, or every delete on
  the parent table will trigger a full scan of the child.</p>
</div>

<h1>Exercise</h1>
<p><strong>Online store</strong> database. Notice how the plan changes before and after creating the
index.</p>
`,
  exerciseTitle: 'Exercise: indexes',
  tasks: [
    { text: 'Create an index named <code>idx_pedidos_cliente_fecha</code> on the <code>cliente_id</code> and <code>fecha</code> columns of the <code>pedidos</code> table', hint: '<code>CREATE INDEX name ON table(col1, col2);</code>' },
    { text: 'Check with <code>EXPLAIN QUERY PLAN</code> that the query <code>SELECT * FROM pedidos WHERE cliente_id = 1 ORDER BY fecha</code> now uses the index', hint: 'Write <code>EXPLAIN QUERY PLAN</code> in front of the query. <code>SEARCH … USING INDEX</code> should appear.' },
    { text: 'Create a <strong>partial</strong> index named <code>idx_pedidos_abiertos</code> on <code>fecha</code> that only includes orders whose status is <code>pendiente</code> or <code>enviado</code>', hint: 'Add a <code>WHERE</code> clause at the end of the <code>CREATE INDEX</code>.' },
    { text: 'Drop the <code>idx_pedidos_abiertos</code> index' }
  ]
},

'restricciones-claves': {
  title: 'Topic: Constraints and referential integrity',
  shortTitle: 'Constraints and keys',
  summary: 'PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, CHECK and the ON DELETE actions.',
  body: `
<p>Constraints are rules the database enforces <em>always</em>, no matter where the data comes from. That's
the difference between validating in the application (which can be bypassed) and validating in the database
(which cannot).</p>

<h1>Column constraints</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:26%">Constraint</td><td>Guarantees</td></tr>
    <tr><td><code>NOT NULL</code></td><td>The column is never left empty.</td></tr>
    <tr><td><code>DEFAULT value</code></td><td>The value used when the <code>INSERT</code> doesn't provide one. It can be an expression: <code>DEFAULT (date('now'))</code>.</td></tr>
    <tr><td><code>UNIQUE</code></td><td>No two rows share the same value. Note: several <code>NULL</code>s are allowed in most engines, because <code>NULL ≠ NULL</code>.</td></tr>
    <tr><td><code>CHECK (expr)</code></td><td>The expression must be true for every row: <code>CHECK (precio &gt;= 0)</code>, <code>CHECK (estado IN ('a','b'))</code>.</td></tr>
    <tr><td><code>PRIMARY KEY</code></td><td>Identifies each row uniquely. Implies <code>UNIQUE</code> + <code>NOT NULL</code> and creates an index.</td></tr>
    <tr><td><code>REFERENCES other(col)</code></td><td>Foreign key: the value must exist in the referenced table.</td></tr>
  </table>
</div>

<h1>Primary keys</h1>
<p>They can be <strong>natural</strong> (a national ID, an ISBN, a product code) or <strong>surrogate</strong>
(a meaningless auto-incrementing integer). Surrogate keys are the most common because they are short, stable
and never change even when the business data does.</p>

<p>A primary key can be <strong>composite</strong>, made of several columns — typical in relationship
tables:</p>

<div class="definition">
    <div class="desc">Composite primary key</div>
    <code class="sql">CREATE TABLE detalle_pedido (
    pedido_id   INTEGER NOT NULL REFERENCES pedidos(id),
    producto_id INTEGER NOT NULL REFERENCES productos(id),
    cantidad    INTEGER NOT NULL CHECK (cantidad &gt; 0),
    precio_unit REAL    NOT NULL,
    <strong>PRIMARY KEY (pedido_id, producto_id)</strong>
);</code>
</div>

<h1>Foreign keys and referential integrity</h1>
<p>A foreign key prevents "orphan rows": you can't have an order line pointing at a product that doesn't
exist. It also decides what happens when the parent row is deleted or updated:</p>

<div class="datatable">
  <table class="table">
    <tr><td style="width:30%">Action</td><td>When the parent is deleted/updated…</td></tr>
    <tr><td><code>ON DELETE RESTRICT</code> / <code>NO ACTION</code></td><td>…the operation is blocked if children exist. This is the default behaviour.</td></tr>
    <tr><td><code>ON DELETE CASCADE</code></td><td>…the children are deleted too. Powerful and dangerous: use it only when the child makes no sense without the parent (order lines, yes; a customer's orders, almost never).</td></tr>
    <tr><td><code>ON DELETE SET NULL</code></td><td>…the child's column becomes <code>NULL</code>. It must allow nulls.</td></tr>
    <tr><td><code>ON DELETE SET DEFAULT</code></td><td>…the child's column takes its default value.</td></tr>
    <tr><td><code>ON UPDATE …</code></td><td>The same options, for when the parent key changes.</td></tr>
  </table>
</div>

<div class="definition">
    <div class="desc">Foreign key with a cascading action</div>
    <code class="sql">CREATE TABLE lineas (
    id        INTEGER PRIMARY KEY,
    pedido_id INTEGER NOT NULL
              REFERENCES pedidos(id) <strong>ON DELETE CASCADE ON UPDATE CASCADE</strong>
);</code>
</div>

<div class="callout sqlite">
  <div class="desc">SQLite does not check foreign keys by default</div>
  <p>You have to enable them <em>on every connection</em> with <code>PRAGMA foreign_keys = ON;</code>. In this
  course it is already enabled on the "Online store" database, which is why the exercises below fail the way
  they should.</p>
</div>

<h1>Adding constraints to an existing table</h1>
<p>In PostgreSQL, MySQL and SQL Server you use
<code>ALTER TABLE t ADD CONSTRAINT name CHECK (…)</code> or <code>… ADD FOREIGN KEY …</code>. SQLite can't:
you have to create a new table with the constraints, copy the data and rename.</p>

<h1>Exercise</h1>
<p><strong>Online store</strong> database, with foreign keys enabled. Some tasks ask you to run statements
that <strong>must fail</strong>: that is exactly what is being checked.</p>
`,
  exerciseTitle: 'Exercise: constraints',
  tasks: [
    { text: 'Create a <code>proveedores</code> table with: an integer <code>id</code> auto-incrementing primary key; a mandatory, unique text <code>nombre</code>; a mandatory text <code>pais</code> defaulting to <code>España</code>; and a real <code>rating</code> that only accepts values between 0 and 5', hint: 'You need <code>PRIMARY KEY AUTOINCREMENT</code>, <code>NOT NULL UNIQUE</code>, <code>DEFAULT</code> and <code>CHECK (rating BETWEEN 0 AND 5)</code>.' },
    { text: 'Insert the supplier <code>Nimbus GmbH</code>, from <code>Alemania</code>, with a <code>rating</code> of <code>4.1</code>' },
    { text: 'Test referential integrity: try to insert a row into <code>pedidos</code> with <code>cliente_id = 999</code> (a customer that does not exist). The statement <strong>must fail</strong>.', hint: "For example <code>INSERT INTO pedidos (id, cliente_id, fecha) VALUES (9999, 999, '2024-01-01');</code>" },
    { text: 'Test the <code>CHECK</code> constraint of <code>detalle_pedido</code>: try to insert a line with <code>cantidad = 0</code>. It must fail too.', hint: '<code>INSERT INTO detalle_pedido VALUES (1001, 13, 0, 94.0);</code>' }
  ]
}

});
