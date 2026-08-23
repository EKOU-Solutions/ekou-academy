I18N.registerLessons('en', {

'transacciones': {
  title: 'Topic: Transactions (BEGIN, COMMIT, ROLLBACK)',
  shortTitle: 'Transactions',
  summary: 'Grouping statements into a unit that is applied entirely or not at all.',
  body: `
<p>A <strong>transaction</strong> is a group of statements the database treats as a single operation: either
all of them are applied, or none is. It is the tool that stops you from ending up with half the work done
when something fails midway.</p>

<div class="definition">
    <div class="desc">Structure of a transaction</div>
    <code class="sql"><strong>BEGIN TRANSACTION;</strong>

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

<strong>COMMIT;</strong>          <i>-- confirm: the changes become permanent</i>
<i>-- ROLLBACK;    -- or cancel: everything since BEGIN is undone</i></code>
</div>

<p>Without a transaction, if the second <code>UPDATE</code> fails the money vanishes: it was taken from one
account and never added to the other.</p>

<h1>The ACID properties</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:26%">Property</td><td>Means</td></tr>
    <tr><td><strong>A</strong>tomicity</td><td>All or nothing. Half-transactions don't exist.</td></tr>
    <tr><td><strong>C</strong>onsistency</td><td>The database moves from one valid state to another: constraints still hold at the end.</td></tr>
    <tr><td><strong>I</strong>solation</td><td>Concurrent transactions don't step on each other; each sees a coherent state.</td></tr>
    <tr><td><strong>D</strong>urability</td><td>Once committed, it survives a power cut.</td></tr>
  </table>
</div>

<h1>Save points: SAVEPOINT</h1>
<p>A <code>SAVEPOINT</code> is a marker inside the transaction. It lets you undo part of it without aborting
the whole thing.</p>

<div class="definition">
    <div class="desc">SAVEPOINT and ROLLBACK TO</div>
    <code class="sql">BEGIN;
    UPDATE productos SET stock = 0 WHERE categoria_id = 5;

    <strong>SAVEPOINT before_delete;</strong>
    DELETE FROM productos WHERE stock = 0;
    <strong>ROLLBACK TO before_delete;</strong>   <i>-- undoes only the DELETE</i>

    <i>-- RELEASE before_delete;  -- discards the point without undoing anything</i>
COMMIT;   <i>-- the UPDATE is committed</i></code>
</div>

<h1>Isolation levels</h1>
<p>When several transactions run at once, anomalies can appear. The isolation level decides which ones are
allowed in exchange for more concurrency:</p>

<div class="datatable">
  <table class="table">
    <tr><td style="width:30%">Level</td><td>Allows</td></tr>
    <tr><td><code>READ UNCOMMITTED</code></td><td>Dirty reads: you see changes another transaction has not committed yet.</td></tr>
    <tr><td><code>READ COMMITTED</code></td><td>You only read committed data, but two identical reads can return different results. It is the default in PostgreSQL, Oracle and SQL Server.</td></tr>
    <tr><td><code>REPEATABLE READ</code></td><td>Re-reads are stable, but new "phantom rows" can appear. Default in MySQL/InnoDB.</td></tr>
    <tr><td><code>SERIALIZABLE</code></td><td>As if transactions ran one after another. The safest and the slowest. It is the only one SQLite uses.</td></tr>
  </table>
</div>

<p>You change it with <code>SET TRANSACTION ISOLATION LEVEL …</code>.</p>

<div class="callout danger">
  <div class="desc">Deadlocks</div>
  <p>If transaction A locks row 1 and waits for row 2, while B locks row 2 and waits for row 1, neither can
  move. The engine detects the cycle and aborts one of them with an error. To reduce them: always access
  tables in the same order, keep transactions short, and never wait for user input with a transaction
  open.</p>
</div>

<h1>Notes per engine</h1>
<ul>
  <li><strong>SQLite</strong>: every standalone statement is already an implicit transaction. Grouping a
      thousand <code>INSERT</code>s inside a <code>BEGIN … COMMIT</code> makes them orders of magnitude
      faster. It supports <code>BEGIN DEFERRED | IMMEDIATE | EXCLUSIVE</code>.</li>
  <li><strong>MySQL</strong>: only with the InnoDB engine (MyISAM has no transactions), and DDL causes an
      implicit commit. <code>autocommit</code> is on by default.</li>
  <li><strong>PostgreSQL</strong>: DDL <em>is</em> transactional; you can <code>ROLLBACK</code> a
      <code>CREATE TABLE</code>.</li>
</ul>

<h1>Exercise</h1>
<p><strong>Online store</strong> database. You can write several statements in a row separated by semicolons:
they run in order over the same connection.</p>
`,
  exerciseTitle: 'Exercise: transactions',
  tasks: [
    { text: 'Inside a transaction, raise the <code>precio</code> of the category 2 products by 10% (rounded to 2 decimals) and <strong>commit</strong> the change', hint: '<code>BEGIN TRANSACTION; UPDATE … ; COMMIT;</code> — use <code>ROUND(precio * 1.10, 2)</code>.' },
    { text: 'Open a transaction, delete <strong>every</strong> row from <code>detalle_pedido</code> and <code>pedidos</code>… and then <strong>undo</strong> the change with <code>ROLLBACK</code>', hint: 'Delete the line items first (because of the foreign key) and then the orders.' },
    { text: 'In a single transaction: set the <code>stock</code> of the category 5 products to 0, mark a <code>SAVEPOINT</code>, run an accidental <code>UPDATE productos SET precio = 0</code> over the whole table, undo <strong>only that mistake</strong> and commit the rest', hint: '<code>SAVEPOINT name;</code> … <code>ROLLBACK TO name;</code> … <code>COMMIT;</code>' }
  ]
},

'triggers': {
  title: 'Topic: Triggers',
  shortTitle: 'Triggers',
  summary: 'Code the database runs by itself when somebody inserts, updates or deletes.',
  body: `
<p>A <strong>trigger</strong> is a block of statements the database runs <em>automatically</em> when an event
happens on a table. Nobody calls it: it fires on its own.</p>

<div class="definition">
    <div class="desc">Anatomy of a trigger in SQLite</div>
    <code class="sql">CREATE TRIGGER <i>name</i>
<strong>AFTER UPDATE OF precio ON productos</strong>   <i>-- when</i>
FOR EACH ROW
<strong>WHEN OLD.precio &lt;&gt; NEW.precio</strong>          <i>-- optional condition</i>
BEGIN
    INSERT INTO auditoria_precios (producto_id, precio_ant, precio_nuevo)
    VALUES (OLD.id, OLD.precio, NEW.precio);
END;</code>
</div>

<h1>The three decisions</h1>
<ul>
  <li><strong>Timing</strong>: <code>BEFORE</code> (before the change is applied — good for validating or
      normalising), <code>AFTER</code> (afterwards — good for auditing or propagating) or
      <code>INSTEAD OF</code> (replaces the operation; on views only).</li>
  <li><strong>Event</strong>: <code>INSERT</code>, <code>UPDATE</code> (optionally
      <code>UPDATE OF column</code>) or <code>DELETE</code>.</li>
  <li><strong>Scope</strong>: <code>FOR EACH ROW</code> (once per affected row) or
      <code>FOR EACH STATEMENT</code> (once per statement; not available in SQLite or MySQL).</li>
</ul>

<h1>The OLD and NEW pseudo-tables</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:26%">Event</td><td><code>OLD</code></td><td><code>NEW</code></td></tr>
    <tr><td><code>INSERT</code></td><td>not available</td><td>the incoming row</td></tr>
    <tr><td><code>UPDATE</code></td><td>the row before the change</td><td>the row afterwards</td></tr>
    <tr><td><code>DELETE</code></td><td>the row being removed</td><td>not available</td></tr>
  </table>
</div>

<h1>What they are used for</h1>
<ul>
  <li><strong>Auditing</strong>: recording who changed what and when.</li>
  <li><strong>Complex validation</strong>: rules a <code>CHECK</code> can't express because they need to
      query other tables.</li>
  <li><strong>Derived data</strong>: keeping a counter or a total up to date without recomputing it.</li>
  <li><strong>Timestamps</strong>: filling in <code>updated_at</code> on every <code>UPDATE</code>.</li>
  <li><strong>Writable views</strong>: with <code>INSTEAD OF</code> on a view.</li>
</ul>

<div class="definition">
    <div class="desc">Rejecting an operation from a trigger</div>
    <code class="sql">CREATE TRIGGER trg_no_negatives
BEFORE UPDATE OF stock ON productos
FOR EACH ROW
WHEN NEW.stock &lt; 0
BEGIN
    SELECT <strong>RAISE(ABORT, 'Stock cannot be negative')</strong>;
END;</code>
</div>

<p><code>RAISE</code> accepts <code>ABORT</code> (undoes the statement), <code>ROLLBACK</code> (undoes the
whole transaction), <code>FAIL</code> and <code>IGNORE</code>. In PostgreSQL the equivalent is
<code>RAISE EXCEPTION</code>; in MySQL, <code>SIGNAL SQLSTATE '45000'</code>.</p>

<div class="definition">
    <div class="desc">Writable view with INSTEAD OF</div>
    <code class="sql">CREATE TRIGGER trg_new_customer
INSTEAD OF INSERT ON v_clientes_espana
FOR EACH ROW
BEGIN
    INSERT INTO clientes (nombre, email, ciudad, pais, fecha_alta)
    VALUES (NEW.nombre, NEW.email, NEW.ciudad, 'España', date('now'));
END;</code>
</div>

<div class="callout danger">
  <div class="desc">Use them sparingly</div>
  <p>A trigger is <em>invisible</em> logic: whoever reads the <code>INSERT</code> doesn't see what happens
  afterwards. Debugging a chain of triggers calling each other is painful, and on write-heavy tables they can
  sink performance. A reasonable rule: for auditing and integrity, yes; for complex business logic, better in
  the application or in an explicit procedure.</p>
</div>

<div class="callout note">
  <div class="desc">Other useful statements</div>
  <p><code>DROP TRIGGER IF EXISTS name;</code> removes a trigger. In SQLite you can list the existing ones
  with <code>SELECT name, sql FROM sqlite_master WHERE type = 'trigger';</code></p>
</div>

<h1>Exercise</h1>
<p><strong>Online store</strong> database. Write each block in full (including the <code>END;</code>) before
running it.</p>
`,
  exerciseTitle: 'Exercise: triggers',
  tasks: [
    { text: "Create the table <code>auditoria_precios</code> with the columns <code>id</code> (integer, primary key), <code>producto_id</code>, <code>precio_ant</code>, <code>precio_nuevo</code> and <code>momento</code> (text defaulting to <code>datetime('now')</code>)", hint: "<code>momento TEXT DEFAULT (datetime('now'))</code> — the parentheses around the expression are required." },
    { text: 'Create a trigger <code>trg_precio_update</code> that, <strong>after</strong> the <code>precio</code> column of <code>productos</code> is updated and only if the price really changed, inserts a row into <code>auditoria_precios</code> with the product id and the old and new prices', hint: 'Use <code>AFTER UPDATE OF precio ON productos FOR EACH ROW WHEN OLD.precio &lt;&gt; NEW.precio</code> and the <code>OLD</code> / <code>NEW</code> pseudo-tables.' },
    { text: 'Check that it works: change the price of product 4 to <code>99.90</code> and product 5 to <code>49.90</code>. Two rows should show up in <code>auditoria_precios</code>.', hint: 'Two <code>UPDATE</code>s in a row; the trigger takes care of the rest.' },
    { text: 'Create a trigger <code>trg_stock_no_negativo</code> that, <strong>before</strong> the <code>stock</code> of <code>productos</code> is updated, aborts the operation with the message <code>El stock no puede ser negativo</code> when the new value is below 0', hint: "<code>BEGIN SELECT RAISE(ABORT, '…'); END;</code>" }
  ]
},

'procedimientos-almacenados': {
  title: 'Topic: Stored procedures',
  shortTitle: 'Stored procedures',
  summary: 'Routines with parameters and logic stored inside the database server.',
  body: `
<p>A <strong>stored procedure</strong> is a program saved inside the database server. It has a name, takes
parameters, can contain variables, conditionals, loops and several SQL statements, and runs with a single
call.</p>

<div class="callout sqlite">
  <div class="desc">Important: SQLite has no stored procedures</div>
  <p>SQLite is an embedded library, not a server, and deliberately does <strong>not</strong> implement
  <code>CREATE PROCEDURE</code> or any procedural language. That's why this topic is a
  <strong>reference</strong>: here you get the real syntax for MySQL, PostgreSQL, SQL Server and Oracle, and
  at the end an exercise on the <em>alternatives</em> you can actually practise in the playground.</p>
</div>

<h1>Why they exist</h1>
<ul>
  <li><strong>Fewer network round trips</strong>: one call instead of twenty queries from the application.</li>
  <li><strong>Shared logic</strong>: several applications (and the nightly ETL, and the report) use the same
      routine.</li>
  <li><strong>Security</strong>: you can grant permission to <em>execute</em> the procedure without granting
      permission on the tables it touches.</li>
  <li><strong>Transactionality</strong>: the whole block runs inside the server, with no windows between
      statements.</li>
</ul>

<p>And why many people avoid them: they are hard to version and to test, the language changes completely
between engines, and the business logic ends up split between the application and the database.</p>

<h1>MySQL / MariaDB</h1>
<div class="definition">
    <div class="desc">CREATE PROCEDURE in MySQL</div>
    <code class="sql">DELIMITER $$

CREATE PROCEDURE sp_apply_discount(
    <strong>IN</strong>  p_customer_id INT,
    <strong>IN</strong>  p_pct         DECIMAL(4,2),
    <strong>OUT</strong> p_affected    INT
)
BEGIN
    DECLARE v_vip TINYINT DEFAULT 0;

    SELECT vip INTO v_vip FROM clientes WHERE id = p_customer_id;

    IF v_vip = 1 THEN
        SET p_pct = p_pct + 0.05;
    END IF;

    UPDATE pedidos
       SET descuento = p_pct
     WHERE cliente_id = p_customer_id
       AND estado = 'pendiente';

    SET p_affected = ROW_COUNT();
END$$

DELIMITER ;

<i>-- call</i>
CALL sp_apply_discount(3, 0.10, @n);
SELECT @n;</code>
</div>

<p><code>DELIMITER</code> is needed in the MySQL client because the body contains semicolons that must not
end the statement.</p>

<h1>PostgreSQL (PL/pgSQL)</h1>
<div class="definition">
    <div class="desc">CREATE PROCEDURE / FUNCTION in PostgreSQL</div>
    <code class="sql">CREATE OR REPLACE PROCEDURE sp_apply_discount(
    p_customer_id INT,
    p_pct         NUMERIC
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_vip BOOLEAN;
BEGIN
    SELECT vip INTO v_vip FROM clientes WHERE id = p_customer_id;

    IF v_vip THEN
        p_pct := p_pct + 0.05;
    END IF;

    UPDATE pedidos
       SET descuento = p_pct
     WHERE cliente_id = p_customer_id
       AND estado = 'pendiente';

    <i>-- COMMIT / ROLLBACK are allowed inside a PROCEDURE (PG 11+)</i>
END;
$$;

CALL sp_apply_discount(3, 0.10);</code>
</div>

<p>In PostgreSQL a <code>FUNCTION</code> returns a value and is used inside a <code>SELECT</code>; a
<code>PROCEDURE</code> returns nothing and is invoked with <code>CALL</code>, but can control
transactions.</p>

<h1>SQL Server (T-SQL)</h1>
<div class="definition">
    <div class="desc">CREATE PROCEDURE in T-SQL</div>
    <code class="sql">CREATE OR ALTER PROCEDURE sp_apply_discount
    @customer_id INT,
    @pct         DECIMAL(4,2),
    @affected    INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM clientes WHERE id = @customer_id AND vip = 1)
        SET @pct = @pct + 0.05;

    UPDATE pedidos
       SET descuento = @pct
     WHERE cliente_id = @customer_id AND estado = 'pendiente';

    SET @affected = @@ROWCOUNT;
END;

EXEC sp_apply_discount @customer_id = 3, @pct = 0.10, @affected = @n OUTPUT;</code>
</div>

<h1>Oracle (PL/SQL)</h1>
<div class="definition">
    <div class="desc">CREATE PROCEDURE in PL/SQL</div>
    <code class="sql">CREATE OR REPLACE PROCEDURE sp_apply_discount (
    p_customer_id IN  NUMBER,
    p_pct         IN  NUMBER,
    p_affected    OUT NUMBER
) AS
    v_vip NUMBER;
BEGIN
    SELECT vip INTO v_vip FROM clientes WHERE id = p_customer_id;

    UPDATE pedidos
       SET descuento = p_pct + CASE WHEN v_vip = 1 THEN 0.05 ELSE 0 END
     WHERE cliente_id = p_customer_id AND estado = 'pendiente';

    p_affected := SQL%ROWCOUNT;
END;
/</code>
</div>

<h1>Comparison table</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:20%">Concept</td><td>MySQL</td><td>PostgreSQL</td><td>SQL Server</td><td>Oracle</td></tr>
    <tr><td>Create</td><td><code>CREATE PROCEDURE</code></td><td><code>CREATE PROCEDURE … LANGUAGE plpgsql</code></td><td><code>CREATE PROCEDURE</code></td><td><code>CREATE PROCEDURE</code></td></tr>
    <tr><td>Call</td><td><code>CALL p(…)</code></td><td><code>CALL p(…)</code></td><td><code>EXEC p …</code></td><td><code>EXEC p(…)</code> / anonymous block</td></tr>
    <tr><td>Parameters</td><td><code>IN/OUT/INOUT</code></td><td><code>IN/OUT/INOUT</code></td><td><code>@x</code>, <code>OUTPUT</code></td><td><code>IN/OUT/IN OUT</code></td></tr>
    <tr><td>Variables</td><td><code>DECLARE</code> + <code>SET</code></td><td><code>DECLARE</code> + <code>:=</code></td><td><code>DECLARE @v</code> + <code>SET</code></td><td><code>DECLARE</code> + <code>:=</code></td></tr>
    <tr><td>Rows affected</td><td><code>ROW_COUNT()</code></td><td><code>GET DIAGNOSTICS … ROW_COUNT</code></td><td><code>@@ROWCOUNT</code></td><td><code>SQL%ROWCOUNT</code></td></tr>
    <tr><td>Drop</td><td colspan="4"><code>DROP PROCEDURE [IF EXISTS] name;</code></td></tr>
  </table>
</div>

<h1>Control structures (common outline)</h1>
<div class="definition">
    <div class="desc">Conditionals and loops</div>
    <code class="sql">IF condition THEN … ELSEIF other THEN … ELSE … END IF;

CASE value WHEN 1 THEN … ELSE … END CASE;

WHILE condition DO … END WHILE;        <i>-- MySQL</i>
LOOP … EXIT WHEN condition; END LOOP;  <i>-- Oracle / PL/pgSQL</i>
REPEAT … UNTIL condition END REPEAT;   <i>-- MySQL</i>

FOR row IN SELECT … LOOP … END LOOP;   <i>-- PL/pgSQL: walks an implicit cursor</i></code>
</div>

<div class="callout note">
  <div class="desc">Think in sets, not in loops</div>
  <p>The temptation when writing a procedure is to walk the rows one by one. There is almost always a single
  <code>UPDATE</code>, <code>INSERT … SELECT</code> or <code>MERGE</code> statement that does the same thing
  ten to a thousand times faster. Save loops for what genuinely cannot be expressed as a set. We cover this
  in <a href="#/cursores-errores">Cursors and error handling</a>.</p>
</div>

<h1>Exercise</h1>
<p>Since SQLite won't run <code>CREATE PROCEDURE</code>, you are going to write the <strong>bodies</strong>
of the procedures: the SQL statements that would go inside. That is exactly the hard part; the wrapper
changes with every engine.</p>
`,
  exerciseTitle: 'Exercise: procedure bodies',
  tasks: [
    { text: 'Body of <code>sp_aplicar_descuento(10, 0.10)</code>: write the <code>UPDATE</code> that sets a <code>descuento</code> of <code>0.10</code> on every <code>pendiente</code> order of customer 10', hint: 'The procedure parameters are, here, literal values.' },
    { text: 'Body of <code>sp_cerrar_pedidos_antiguos()</code>: mark as <code>entregado</code> every order with status <code>enviado</code> whose <code>fecha</code> is before <code>2024-01-01</code>' },
    { text: 'Body of <code>sp_generar_resumen_clientes()</code>: create a <code>resumen_clientes</code> table with the <code>cliente_id</code>, the number of orders (<code>n_pedidos</code>) and the total amount spent (<code>gastado</code>, rounded to 2 decimals) of every customer who has ever ordered', hint: 'It is done in a single statement: <code>CREATE TABLE … AS SELECT …</code>.' }
  ]
},

'funciones-usuario': {
  title: 'Topic: User-defined functions (UDF)',
  shortTitle: 'User-defined functions',
  summary: 'Creating your own functions and using them as if they were built into the engine.',
  body: `
<p>Besides the functions the engine ships with, you can define your own. A <strong>user-defined
function</strong> wraps a computation with a name and parameters, and is called inside any query just like
<code>ROUND()</code> or <code>UPPER()</code>.</p>

<h1>Function versus procedure</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:26%"></td><td>Function</td><td>Procedure</td></tr>
    <tr><td>Returns</td><td>Always a value (or a table)</td><td>Nothing, or values through <code>OUT</code> parameters</td></tr>
    <tr><td>Called</td><td>Inside a <code>SELECT</code>, <code>WHERE</code>, <code>ORDER BY</code>…</td><td>With <code>CALL</code> / <code>EXEC</code>, as its own statement</td></tr>
    <tr><td>Side effects</td><td>Usually forbidden or discouraged</td><td>That's the whole point</td></tr>
    <tr><td>Transactions</td><td>Does not control them</td><td>Can <code>COMMIT</code>/<code>ROLLBACK</code> (engine dependent)</td></tr>
  </table>
</div>

<h1>PostgreSQL</h1>
<div class="definition">
    <div class="desc">Scalar function in PL/pgSQL</div>
    <code class="sql">CREATE OR REPLACE FUNCTION with_vat(amount NUMERIC, rate NUMERIC DEFAULT 0.21)
RETURNS NUMERIC
LANGUAGE plpgsql
<strong>IMMUTABLE</strong>            <i>-- same result for the same arguments: the planner exploits it</i>
AS $$
BEGIN
    RETURN ROUND(amount * (1 + rate), 2);
END;
$$;

SELECT nombre, with_vat(precio) FROM productos;</code>
</div>

<div class="definition">
    <div class="desc">Function returning a table</div>
    <code class="sql">CREATE FUNCTION orders_of(p_customer INT)
RETURNS TABLE (pedido_id INT, fecha DATE, total NUMERIC)
LANGUAGE sql AS $$
    SELECT p.id, p.fecha, SUM(d.cantidad * d.precio_unit)
    FROM pedidos p JOIN detalle_pedido d ON d.pedido_id = p.id
    WHERE p.cliente_id = p_customer
    GROUP BY p.id, p.fecha;
$$;

SELECT * FROM orders_of(3);</code>
</div>

<h1>MySQL / MariaDB</h1>
<div class="definition">
    <div class="desc">CREATE FUNCTION in MySQL</div>
    <code class="sql">DELIMITER $$
CREATE FUNCTION with_vat(amount DECIMAL(10,2), rate DECIMAL(4,2))
RETURNS DECIMAL(10,2)
<strong>DETERMINISTIC</strong>
BEGIN
    RETURN ROUND(amount * (1 + rate), 2);
END$$
DELIMITER ;</code>
</div>

<h1>SQL Server and Oracle</h1>
<div class="definition">
    <div class="desc">T-SQL and PL/SQL</div>
    <code class="sql"><i>-- SQL Server</i>
CREATE FUNCTION dbo.with_vat(@amount DECIMAL(10,2), @rate DECIMAL(4,2))
RETURNS DECIMAL(10,2)
AS BEGIN
    RETURN ROUND(@amount * (1 + @rate), 2);
END;

<i>-- Oracle</i>
CREATE OR REPLACE FUNCTION with_vat(p_amount NUMBER, p_rate NUMBER DEFAULT 0.21)
RETURN NUMBER IS
BEGIN
    RETURN ROUND(p_amount * (1 + p_rate), 2);
END;
/</code>
</div>

<h1>UDFs in SQLite: registered from the host language</h1>
<p>SQLite has no <code>CREATE FUNCTION</code>. Instead, the program that opens the database registers
functions written in C, Python, JavaScript… and from then on they can be used in any query on that
connection.</p>

<div class="definition">
    <div class="desc">Registering from JavaScript (this is how this site works)</div>
    <code class="sql">db.create_function('iva', (importe, tipo) =&gt;
    Math.round(importe * (1 + (tipo ?? 0.21)) * 100) / 100
);

<i>-- and in Python it would be:</i>
<i>-- conn.create_function("iva", 2, lambda imp, t: round(imp * (1 + (t or 0.21)), 2))</i></code>
</div>

<div class="callout sqlite">
  <div class="desc">Functions available in this course</div>
  <p>Every database on this site has four sample functions registered, implemented in
  <code>assets/js/engine.js</code>:</p>
  <ul>
    <li><code>iva(amount [, rate])</code> — adds VAT (21% by default) and rounds to 2 decimals.</li>
    <li><code>iniciales(name)</code> — <code>'Lucía Ferrer'</code> → <code>'L.F.'</code></li>
    <li><code>slugify(text)</code> — <code>'Portátil Aura 14'</code> → <code>'portatil-aura-14'</code></li>
    <li><code>distancia_km(lat1, lon1, lat2, lon2)</code> — distance between two points (try it in the
        Playground with the "Office and cities" database).</li>
  </ul>
</div>

<h1>When they pay off and when they don't</h1>
<ul>
  <li>✅ Business rules repeated across many queries (VAT calculation, code normalisation).</li>
  <li>✅ Wrapping long, unreadable expressions.</li>
  <li>❌ In the <code>WHERE</code> over big tables: a function around the column <strong>kills the
      index</strong> and forces a full scan (see <a href="#/indices">Indexes</a>). The fix: expression
      indexes or generated columns.</li>
  <li>❌ Marking them deterministic when they aren't: the planner will cache wrong results.</li>
</ul>

<h1>Exercise</h1>
<p><strong>Online store</strong> database, with the user-defined functions already registered.</p>
`,
  exerciseTitle: 'Exercise: user-defined functions',
  tasks: [
    { text: "Show each product's <code>nombre</code>, its <code>precio</code> and the price with VAT using the <code>iva()</code> function, in a <code>precio_iva</code> column", hint: '<code>iva(precio)</code> applies 21% by default.' },
    { text: "Show each customer's <code>nombre</code> and their initials using <code>iniciales()</code>, in an <code>abrev</code> column" },
    { text: "Show each product's <code>nombre</code> and its URL-friendly version with <code>slugify()</code>, in a <code>slug</code> column, only for the products of category 1" },
    { text: 'Combine both: for the products over €500, show the <code>slug</code> and the price with the <strong>reduced 10% VAT</strong> (<code>iva(precio, 0.10)</code>) in a <code>precio_reducido</code> column', hint: 'The function takes an optional second argument with the VAT rate.' }
  ]
},

'cursores-errores': {
  title: 'Topic: Cursors and error handling',
  shortTitle: 'Cursors and errors',
  summary: 'Walking rows one by one (and why there is almost always something better), and catching exceptions.',
  body: `
<p>Inside a procedure you sometimes need to walk a set of rows and do something with each one. That tool is
called a <strong>cursor</strong>. And the immediate corollary is that you'll also need to catch errors when
something fails halfway through.</p>

<h1>Cursors: the general pattern</h1>
<p>It is always the same five steps: <strong>declare</strong>, <strong>open</strong>, <strong>fetch</strong>
in a loop, detect the <strong>end</strong> and <strong>close</strong>.</p>

<div class="definition">
    <div class="desc">Cursor in MySQL</div>
    <code class="sql">DELIMITER $$
CREATE PROCEDURE sp_recompute_totals()
BEGIN
    DECLARE v_done   INT DEFAULT 0;
    DECLARE v_order  INT;
    DECLARE v_total  DECIMAL(10,2);

    <strong>DECLARE cur CURSOR FOR</strong>
        SELECT id FROM pedidos WHERE estado = 'pendiente';

    <strong>DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = 1;</strong>

    <strong>OPEN cur;</strong>
    loop_rows: LOOP
        <strong>FETCH cur INTO v_order;</strong>
        IF v_done = 1 THEN LEAVE loop_rows; END IF;

        SELECT SUM(cantidad * precio_unit) INTO v_total
          FROM detalle_pedido WHERE pedido_id = v_order;

        UPDATE pedidos SET total = v_total WHERE id = v_order;
    END LOOP;
    <strong>CLOSE cur;</strong>
END$$
DELIMITER ;</code>
</div>

<div class="definition">
    <div class="desc">The same walk in PL/pgSQL (implicit FOR loop)</div>
    <code class="sql">FOR row IN SELECT id FROM pedidos WHERE estado = 'pendiente' LOOP
    UPDATE pedidos
       SET total = (SELECT SUM(cantidad * precio_unit)
                      FROM detalle_pedido WHERE pedido_id = row.id)
     WHERE id = row.id;
END LOOP;</code>
</div>

<div class="datatable">
  <table class="table">
    <tr><td style="width:22%">Engine</td><td>Cursor syntax</td></tr>
    <tr><td>MySQL</td><td><code>DECLARE cur CURSOR FOR …</code> + <code>CONTINUE HANDLER FOR NOT FOUND</code></td></tr>
    <tr><td>PostgreSQL</td><td><code>DECLARE cur CURSOR FOR …</code>, or the <code>FOR … IN SELECT</code> loop</td></tr>
    <tr><td>SQL Server</td><td><code>DECLARE cur CURSOR FOR …</code> + <code>WHILE @@FETCH_STATUS = 0</code></td></tr>
    <tr><td>Oracle</td><td>Explicit cursors, or <code>FOR row IN (SELECT …) LOOP</code></td></tr>
    <tr><td>SQLite</td><td>They don't exist: you iterate the result from the host language.</td></tr>
  </table>
</div>

<div class="callout danger">
  <div class="desc">Before writing a cursor, stop and think</div>
  <p>A cursor over 100,000 rows makes 100,000 round trips inside the engine. The same task expressed in
  <strong>a single statement</strong> is resolved in one pass. The example above is written like this:</p>
  <p><code class="sql">UPDATE pedidos
   SET total = (SELECT SUM(cantidad * precio_unit)
                  FROM detalle_pedido d WHERE d.pedido_id = pedidos.id)
 WHERE estado = 'pendiente';</code></p>
  <p>A cursor is only justified when each row needs an action that is <em>not</em> SQL: calling an external
  service, generating a file, sending an email, or processing in batches to avoid locking the table.</p>
</div>

<h1>Set-based alternatives</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:34%">Instead of a loop that…</td><td>Use</td></tr>
    <tr><td>…updates row by row</td><td><code>UPDATE … FROM</code> / <code>UPDATE</code> with a correlated subquery</td></tr>
    <tr><td>…inserts if missing and updates otherwise</td><td><code>INSERT … ON CONFLICT DO UPDATE</code> (SQLite/PostgreSQL), <code>INSERT … ON DUPLICATE KEY UPDATE</code> (MySQL), <code>MERGE</code> (standard, SQL Server, Oracle)</td></tr>
    <tr><td>…accumulates a running total</td><td>Window functions: <code>SUM(x) OVER (ORDER BY …)</code></td></tr>
    <tr><td>…walks a hierarchy</td><td><code>WITH RECURSIVE</code></td></tr>
    <tr><td>…copies rows from one table to another</td><td><code>INSERT INTO target SELECT … FROM source</code></td></tr>
  </table>
</div>

<h1>Error handling</h1>
<div class="definition">
    <div class="desc">PostgreSQL: EXCEPTION block</div>
    <code class="sql">BEGIN
    UPDATE accounts SET balance = balance - 100 WHERE id = 1;
    INSERT INTO movements (account_id, amount) VALUES (1, -100);
EXCEPTION
    WHEN <strong>unique_violation</strong> THEN
        RAISE NOTICE 'Duplicate movement, ignored';
    WHEN <strong>OTHERS</strong> THEN
        RAISE EXCEPTION 'Unexpected failure: %', SQLERRM;
END;</code>
</div>

<div class="definition">
    <div class="desc">SQL Server: TRY … CATCH</div>
    <code class="sql">BEGIN TRY
    BEGIN TRANSACTION;
        UPDATE accounts SET balance = balance - 100 WHERE id = 1;
        UPDATE accounts SET balance = balance + 100 WHERE id = 2;
    COMMIT;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT &gt; 0 ROLLBACK;
    THROW;   <i>-- rethrows the error to the caller</i>
END CATCH;</code>
</div>

<div class="definition">
    <div class="desc">MySQL: handlers and SIGNAL</div>
    <code class="sql">DECLARE EXIT HANDLER FOR SQLEXCEPTION
BEGIN
    ROLLBACK;
    SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'The operation could not be completed';
END;</code>
</div>

<h1>How SQLite handles conflicts</h1>
<p>SQLite has no exception blocks, but it does have an <code>ON CONFLICT</code> clause per statement that
decides what to do when a constraint is violated:</p>

<div class="definition">
    <div class="desc">Resolution clauses</div>
    <code class="sql">INSERT <strong>OR IGNORE</strong>  INTO clientes (id, nombre) VALUES (1, 'Duplicate');
INSERT <strong>OR REPLACE</strong> INTO clientes (id, nombre) VALUES (1, 'Replaces');

<i>-- explicit UPSERT (SQLite 3.24+, same as PostgreSQL)</i>
INSERT INTO clientes (id, nombre, email)
VALUES (1, 'Lucía Ferrer', 'nuevo@correo.es')
<strong>ON CONFLICT(id) DO UPDATE SET email = excluded.email</strong>;</code>
</div>

<p>The options are <code>ROLLBACK</code>, <code>ABORT</code> (the default), <code>FAIL</code>,
<code>IGNORE</code> and <code>REPLACE</code>.</p>

<h1>Exercise</h1>
<p><strong>Online store</strong> database. You'll rewrite as sets what a cursor would do row by row, and
practise the <em>upsert</em>.</p>
`,
  exerciseTitle: 'Exercise: no cursors',
  tasks: [
    { text: 'Add a <code>total</code> column of type <code>REAL</code> to <code>pedidos</code>' },
    { text: 'With no loop at all: using <strong>a single</strong> <code>UPDATE</code> statement, fill the <code>total</code> column of each order with the sum of <code>cantidad * precio_unit</code> over its line items, rounded to 2 decimals', hint: 'A correlated subquery inside the <code>SET</code>: <code>SET total = (SELECT … WHERE d.pedido_id = pedidos.id)</code>.' },
    { text: 'Practise the <em>upsert</em>: insert the customer with <code>id = 1</code> and email <code>lucia@nuevo.es</code>; if that id already exists it must <strong>update</strong> their email instead of failing', hint: '<code>INSERT INTO … VALUES … ON CONFLICT(id) DO UPDATE SET email = excluded.email;</code>' },
    { text: 'Try <code>INSERT OR IGNORE</code>: attempt to insert a customer with <code>id = 1</code> again so that the statement does <strong>not</strong> fail and does <strong>not</strong> change anything', hint: "<code>INSERT OR IGNORE INTO clientes (id, nombre, fecha_alta) VALUES (1, 'Other', '2025-01-01');</code>" }
  ]
}

});
