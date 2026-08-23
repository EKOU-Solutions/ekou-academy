I18N.registerLessons('en', {

'normalizacion': {
  title: 'Topic: Normalization and schema design',
  shortTitle: 'Normalization',
  summary: 'Normal forms, keys, cardinalities and when denormalizing is the right call.',
  body: `
<p><strong>Normalizing</strong> means organising columns and tables so that each piece of data lives in
exactly one place. The goal isn't theoretical elegance: it is avoiding three very concrete problems.</p>

<div class="datatable">
  <table class="table">
    <tr><td style="width:26%">Anomaly</td><td>What happens</td></tr>
    <tr><td>Insertion</td><td>You can't record a new product because nobody has bought it yet.</td></tr>
    <tr><td>Update</td><td>You change a customer's email and 400 rows have to be touched; miss one and you have two truths.</td></tr>
    <tr><td>Deletion</td><td>You delete a customer's last order and lose their contact details too.</td></tr>
  </table>
</div>

<h1>Minimum vocabulary</h1>
<ul>
  <li><strong>Candidate key</strong>: the minimal set of columns that identifies each row.</li>
  <li><strong>Primary key</strong>: the candidate that was chosen.</li>
  <li><strong>Non-key attribute</strong>: any column that is not part of a candidate key.</li>
  <li><strong>Functional dependency</strong> (<code>A → B</code>): knowing <code>A</code> determines
      <code>B</code>. "The customer id determines their email."</li>
</ul>

<h1>First normal form (1NF)</h1>
<p>Every cell holds <strong>a single atomic value</strong> and there are no repeating groups.</p>
<div class="datatable">
  <table class="table">
    <tr><td style="width:50%">❌ Not in 1NF</td><td>✅ In 1NF</td></tr>
    <tr><td><code>phones = '600111222, 600333444'</code></td><td>A <code>phones(customer_id, number)</code> table</td></tr>
    <tr><td>Columns <code>product1</code>, <code>product2</code>, <code>product3</code></td><td>A <code>lines(order_id, product_id, …)</code> table</td></tr>
  </table>
</div>

<h1>Second normal form (2NF)</h1>
<p>It is in 1NF <em>and</em> no non-key attribute depends on just <strong>part</strong> of a composite primary
key.</p>
<p>Example: in <code>detalle_pedido(pedido_id, producto_id, cantidad, nombre_producto)</code>, the
<code>nombre_producto</code> column depends only on <code>producto_id</code>, not on the full key. It moves
out to the <code>productos</code> table.</p>

<h1>Third normal form (3NF)</h1>
<p>It is in 2NF <em>and</em> no non-key attribute depends on another non-key attribute (no transitive
dependencies).</p>
<p>Example: in <code>pedidos(id, cliente_id, ciudad_cliente, pais_cliente)</code>, the city depends on the
customer, not on the order. Out it goes.</p>

<div class="callout note">
  <div class="desc">The mnemonic</div>
  <p>Every non-key attribute must depend <em>on the key</em> (1NF), <em>on the whole key</em> (2NF)
  <em>and on nothing but the key</em> (3NF).</p>
</div>

<h1>BCNF and beyond</h1>
<p><strong>BCNF</strong> (Boyce-Codd) is a stricter 3NF: <em>every</em> functional dependency must start from
a candidate key. <strong>4NF</strong> removes independent multi-valued dependencies and <strong>5NF</strong>
join dependencies. In practice, reaching 3NF/BCNF covers 99% of transactional designs.</p>

<h1>Cardinalities</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:22%">Relationship</td><td>How it is implemented</td><td>Example</td></tr>
    <tr><td>1 to 1</td><td>Foreign key with <code>UNIQUE</code>, or the same primary key in both tables</td><td>User ↔ extended profile</td></tr>
    <tr><td>1 to N</td><td>Foreign key on the "many" side</td><td>Customer → orders</td></tr>
    <tr><td>N to M</td><td>An intermediate table with a composite primary key</td><td>Orders ↔ products via <code>detalle_pedido</code></td></tr>
  </table>
</div>

<h1>Denormalizing (on purpose)</h1>
<p>Normalizing reduces redundancy but increases the number of <code>JOIN</code>s. In read-heavy systems —
reports, dashboards, data warehouses — you denormalize <em>deliberately</em>: a name is duplicated, a
pre-computed total is stored, a star schema with fact and dimension tables is used.</p>

<div class="callout danger">
  <div class="desc">The golden rule</div>
  <p>Normalize first; denormalize afterwards, only when you have a measurement that justifies it, and write
  down who keeps the duplicated data in sync (a trigger, a batch process, the application). A pre-computed
  total nobody updates is a lie that keeps growing.</p>
</div>

<h1>Exercise</h1>
<p>You have a flat table, <code>ventas_planas</code>, with customer, product and sale line data all mixed
together. You are going to normalize it into three tables.</p>
`,
  exerciseTitle: 'Exercise: normalize',
  tasks: [
    { text: 'Create the table <code>clientes_norm</code> (<code>id</code> integer auto-incrementing primary key, mandatory text <code>nombre</code>, mandatory and unique text <code>email</code>) and fill it with the <strong>distinct</strong> customers from <code>ventas_planas</code>', hint: 'Two statements: the <code>CREATE TABLE</code> and an <code>INSERT INTO … SELECT DISTINCT …</code>.' },
    { text: 'Create the table <code>productos_norm</code> (auto-incrementing <code>id</code>, mandatory and unique <code>nombre</code>, mandatory <code>categoria</code>) and fill it with the distinct products' },
    { text: 'Create the table <code>lineas_norm</code> with <code>factura</code>, <code>cliente_id</code>, <code>producto_id</code>, <code>cantidad</code> and <code>precio_unit</code>, with primary key <code>(factura, producto_id)</code> and foreign keys to the two previous tables; then fill it by joining <code>ventas_planas</code> with them', hint: 'In the <code>INSERT … SELECT</code>, join on <code>email</code> and on the product <code>nombre</code> to translate the text into identifiers.' },
    { text: 'Check the result: rebuild the original view by querying the three new tables and returning <code>factura</code>, the customer name, the product name and <code>cantidad</code>, ordered by invoice and product' }
  ]
},

'rendimiento': {
  title: 'Topic: Performance and best practices',
  shortTitle: 'Performance',
  summary: 'The mistakes that make a query slow, and how to spot them.',
  body: `
<p>Almost every performance problem in SQL comes from a handful of repeated patterns. These are the ones
worth fixing first.</p>

<h1>1. Measure before touching anything</h1>
<p>Always start with the execution plan (<a href="#/indices">Indexes</a>):
<code>EXPLAIN QUERY PLAN</code> in SQLite, <code>EXPLAIN ANALYZE</code> in PostgreSQL and MySQL. Look for
full scans on big tables and <code>TEMP B-TREE</code>s caused by sorting.</p>

<p>And keep the statistics up to date: the planner decides using them. <code>ANALYZE</code> in SQLite and
PostgreSQL, <code>ANALYZE TABLE</code> in MySQL.</p>

<h1>2. The N+1 problem</h1>
<p>The application asks for the list of orders (1 query) and then, in a loop, for each order's customer
(N queries). With 500 orders that is 501 round trips.</p>
<div class="definition">
    <div class="desc">Fix: a single query with a JOIN</div>
    <code class="sql">SELECT p.id, p.fecha, c.nombre
FROM pedidos p
JOIN clientes c ON c.id = p.cliente_id;</code>
</div>
<p>In ORMs this is solved with eager loading: <code>includes</code> / <code>joinedload</code> /
<code>with</code> / <code>Include</code>.</p>

<h1>3. Ask only for what you need</h1>
<ul>
  <li><code>SELECT *</code> transfers columns you don't use and prevents <em>covering indexes</em>.</li>
  <li>A <strong>covering index</strong> contains every column of the query, so the engine answers without
      touching the table: <code>CREATE INDEX idx ON pedidos(cliente_id, fecha, estado);</code></li>
  <li>Filter in the database, not in the application: fetching 100,000 rows to keep 20 wastes network,
      memory and CPU.</li>
</ul>

<h1>4. Keyset pagination, not OFFSET</h1>
<p><code>LIMIT 20 OFFSET 100000</code> forces the engine to read and discard 100,000 rows. The further you
go, the slower it gets.</p>
<div class="definition">
    <div class="desc">Keyset pagination</div>
    <code class="sql"><i>-- next page: remember the last value you saw</i>
SELECT id, fecha, total
FROM pedidos
WHERE (fecha, id) &lt; ('2024-03-05', 1014)   <i>-- last row of the previous page</i>
ORDER BY fecha DESC, id DESC
LIMIT 20;</code>
</div>

<h1>5. Conditions that kill indexes</h1>
<p>A quick recap of <a href="#/indices">Indexes</a>: don't wrap the filtered column in a function, avoid
<code>LIKE '%something%'</code>, don't do arithmetic on the column, and be careful comparing columns of
different types (it forces an implicit conversion on every row).</p>

<h1>6. Batch writes</h1>
<ul>
  <li>A thousand standalone <code>INSERT</code>s are a thousand transactions. Wrap them in one:
      <code>BEGIN; … COMMIT;</code></li>
  <li>Better still, a single <code>INSERT</code> with several tuples
      (<code>VALUES (…), (…), (…)</code>), or the engine's bulk-load utility
      (<code>COPY</code>, <code>LOAD DATA INFILE</code>, <code>.import</code>).</li>
  <li>For large loads: drop the indexes, load, and recreate them.</li>
</ul>

<h1>7. Aggregates and subqueries</h1>
<ul>
  <li>Filter with <code>WHERE</code> as early as possible; use <code>HAVING</code> only for conditions on the
      aggregate.</li>
  <li><code>EXISTS</code> is usually faster than <code>COUNT(*) &gt; 0</code>: it can stop at the first
      matching row.</li>
  <li>A correlated subquery running once per row can nearly always be rewritten as a <code>JOIN</code> or a
      window function.</li>
  <li><code>UNION ALL</code> instead of <code>UNION</code> when you know there are no duplicates: it saves a
      full sort.</li>
</ul>

<h1>8. Design</h1>
<ul>
  <li>Tight data types: an <code>INTEGER</code> takes less space and compares faster than a
      <code>VARCHAR</code> with the same content.</li>
  <li>Index foreign key columns: they are not created for you.</li>
  <li>Partition very large historical tables by date, if your engine supports it.</li>
  <li>Consider denormalizing only with a measurement in front of you
      (<a href="#/normalizacion">Normalization</a>).</li>
</ul>

<div class="callout note">
  <div class="desc">Recommended order of work</div>
  <p>1) Find the slow query (slow query log or APM). 2) Reproduce it with real data. 3) Look at the plan.
  4) Change <em>one</em> thing. 5) Measure again. Optimising blindly adds indexes nobody uses and slows
  writes down.</p>
</div>

<h1>Exercise</h1>
<p>Rewrite problematic queries on the <strong>Online store</strong> database.</p>
`,
  exerciseTitle: 'Exercise: optimise',
  tasks: [
    { text: "The query <code>WHERE strftime('%Y', fecha) = '2024'</code> cannot use an index. Rewrite it as a <strong>date range</strong> returning the <code>id</code> and <code>fecha</code> of the 2024 orders", hint: 'Compare the column directly against two literals.' },
    { text: 'Avoid the N+1 problem: in <strong>a single query</strong>, return the order <code>id</code>, its <code>fecha</code> and the customer <code>nombre</code> for every order', hint: 'A <code>JOIN</code> between <code>pedidos</code> and <code>clientes</code>.' },
    { text: 'Create a covering index named <code>idx_pedidos_cubriente</code> on <code>(cliente_id, fecha, estado)</code> and check with <code>EXPLAIN QUERY PLAN</code> that the query <code>SELECT cliente_id, fecha, estado FROM pedidos WHERE cliente_id = 1</code> uses it as a covering index', hint: '<code>USING COVERING INDEX</code> should appear in the plan.' },
    { text: 'Use <code>EXISTS</code> instead of counting: return the <code>nombre</code> of the customers who have at least one delivered order', hint: '<code>EXISTS</code> can stop at the first match; <code>COUNT(*) &gt; 0</code> has to count them all.' }
  ]
},

'seguridad-usuarios': {
  title: 'Topic: Users, permissions and security (DCL)',
  shortTitle: 'Users and permissions',
  summary: 'GRANT, REVOKE, roles, least privilege and SQL injection.',
  body: `
<p>The third subset of SQL, after DML (data) and DDL (schema), is <strong>DCL</strong> (Data Control
Language): who can do what.</p>

<div class="callout sqlite">
  <div class="desc">SQLite has no users</div>
  <p>SQLite is a file: permissions are the file system's. There is no <code>GRANT</code> or
  <code>REVOKE</code>. This topic is a <strong>reference</strong> for PostgreSQL, MySQL, SQL Server and
  Oracle; the SQL injection part, on the other hand, affects you whatever engine you use.</p>
</div>

<h1>Creating users and roles</h1>
<div class="definition">
    <div class="desc">PostgreSQL</div>
    <code class="sql">CREATE ROLE analyst;                           <i>-- role = a group of permissions</i>
CREATE USER ana WITH PASSWORD '…';             <i>-- a user that can log in</i>
GRANT analyst TO ana;                          <i>-- ana inherits the role's permissions</i></code>
</div>

<div class="definition">
    <div class="desc">MySQL</div>
    <code class="sql">CREATE USER 'ana'@'%' IDENTIFIED BY '…';
CREATE ROLE 'analyst';
GRANT 'analyst' TO 'ana'@'%';</code>
</div>

<h1>GRANT and REVOKE</h1>
<div class="definition">
    <div class="desc">Granting and revoking permissions</div>
    <code class="sql"><i>-- read-only over two tables</i>
GRANT SELECT ON pedidos, clientes TO analyst;

<i>-- read and write over a whole schema (PostgreSQL)</i>
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA sales TO app;

<i>-- a single column</i>
GRANT SELECT (id, nombre) ON clientes TO support;

<i>-- execute a procedure without touching its tables</i>
GRANT EXECUTE ON PROCEDURE sp_apply_discount TO app;

<i>-- revoke</i>
REVOKE DELETE ON pedidos FROM analyst;</code>
</div>

<div class="datatable">
  <table class="table">
    <tr><td style="width:26%">Privilege</td><td>Allows</td></tr>
    <tr><td><code>SELECT</code></td><td>Reading rows</td></tr>
    <tr><td><code>INSERT</code> / <code>UPDATE</code> / <code>DELETE</code></td><td>Changing data</td></tr>
    <tr><td><code>EXECUTE</code></td><td>Running functions and procedures</td></tr>
    <tr><td><code>REFERENCES</code></td><td>Creating foreign keys pointing at the table</td></tr>
    <tr><td><code>CREATE</code>, <code>ALTER</code>, <code>DROP</code></td><td>Changing the schema</td></tr>
    <tr><td><code>ALL PRIVILEGES</code></td><td>Everything above. Rarely what you want.</td></tr>
  </table>
</div>

<h1>Principle of least privilege</h1>
<ul>
  <li>The web application <strong>never</strong> connects as a superuser or as the schema owner.</li>
  <li>A different user per access type: <code>app_write</code>, <code>app_read</code>,
      <code>backup</code>, <code>migrations</code>.</li>
  <li>Reports read from <strong>views</strong>, not from tables: that's how you hide sensitive columns.</li>
  <li><code>DROP</code> and <code>ALTER</code> permissions live only in the migration process.</li>
</ul>

<h1>Row level security</h1>
<p>PostgreSQL, SQL Server and Oracle can filter rows per user transparently:</p>
<div class="definition">
    <div class="desc">Row Level Security in PostgreSQL</div>
    <code class="sql">ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

CREATE POLICY only_my_orders ON pedidos
    FOR SELECT
    USING (cliente_id = current_setting('app.cliente_id')::INT);</code>
</div>

<h1>SQL injection</h1>
<p>The most common vulnerability in database-backed applications. It happens when SQL is built by
concatenating text that comes from the user:</p>

<div class="callout danger">
  <div class="desc">Never do this</div>
  <p><code class="sql">query = "SELECT * FROM clientes WHERE email = '" + input + "'";</code></p>
  <p>If <code>input</code> is <code>' OR '1'='1</code>, the condition is always true and the whole table is
  returned. If it is <code>'; DROP TABLE clientes; --</code>, worse.</p>
</div>

<div class="definition">
    <div class="desc">The fix: parameterised queries</div>
    <code class="sql"><i>-- Python</i>
cur.execute("SELECT * FROM clientes WHERE email = ?", (input,))

<i>-- Java / JDBC</i>
ps = con.prepareStatement("SELECT * FROM clientes WHERE email = ?");
ps.setString(1, input);

<i>-- Node.js</i>
db.query('SELECT * FROM clientes WHERE email = $1', [input]);</code>
</div>

<p>With parameters, the engine receives the query and the data <em>separately</em>: the value can never turn
into syntax. This is not "escaping quotes" — escaping by hand fails sooner or later.</p>

<h1>Other common measures</h1>
<ul>
  <li><strong>Encryption</strong>: TLS on the connection, at-rest encryption of the volume, and
      column-level encryption for especially sensitive data.</li>
  <li><strong>Password hashing</strong>: passwords are never stored, not even encrypted; you store a slow
      hash (bcrypt, argon2) computed in the application.</li>
  <li><strong>Auditing</strong>: log accesses and changes (see <a href="#/triggers">Triggers</a>).</li>
  <li><strong>Tested backups</strong>: a backup that has never been restored is not a backup.</li>
  <li><strong>Anonymised data</strong> in development and test environments.</li>
</ul>
`
}

});
