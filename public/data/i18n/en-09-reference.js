I18N.registerLessons('en', {

'chuleta-sql': {
  title: 'SQL cheat sheet and cross-engine equivalences',
  shortTitle: 'SQL cheat sheet',
  summary: 'Every piece of syntax in the course on one page, plus the differences between SQLite, MySQL, PostgreSQL, SQL Server and Oracle.',
  body: `
<h1>Querying data (DQL)</h1>
<div class="definition">
    <div class="desc">Full query and order of execution</div>
    <code class="sql">SELECT   DISTINCT col, AGG(col) AS alias   <i>-- 5th / 6th</i>
FROM     table                            <i>-- 1st</i>
  JOIN   other ON table.id = other.table_id <i>-- 1st</i>
WHERE    condition                        <i>-- 2nd</i>
GROUP BY col                              <i>-- 3rd</i>
HAVING   group_condition                  <i>-- 4th</i>
ORDER BY col ASC|DESC                     <i>-- 7th</i>
LIMIT    n OFFSET m;                      <i>-- 8th</i></code>
</div>

<h1>WHERE operators</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:34%">Operator</td><td>Use</td></tr>
    <tr><td><code>= != &lt;&gt; &lt; &lt;= &gt; &gt;=</code></td><td>Comparison</td></tr>
    <tr><td><code>BETWEEN a AND b</code></td><td>Inclusive range</td></tr>
    <tr><td><code>IN (…)</code> / <code>NOT IN (…)</code></td><td>Membership in a list or subquery</td></tr>
    <tr><td><code>LIKE 'a%'</code> / <code>'a_'</code></td><td>Pattern: <code>%</code> = any sequence, <code>_</code> = one character</td></tr>
    <tr><td><code>IS NULL</code> / <code>IS NOT NULL</code></td><td>Testing for nulls (never <code>= NULL</code>)</td></tr>
    <tr><td><code>EXISTS (SELECT …)</code></td><td>Does the subquery return any row?</td></tr>
    <tr><td><code>AND</code>, <code>OR</code>, <code>NOT</code></td><td>Logical combination</td></tr>
  </table>
</div>

<h1>JOINs</h1>
<div class="definition">
    <code class="sql">FROM a INNER JOIN b ON a.id = b.a_id   <i>-- matches only</i>
FROM a LEFT  JOIN b ON a.id = b.a_id   <i>-- all of A</i>
FROM a RIGHT JOIN b ON a.id = b.a_id   <i>-- all of B</i>
FROM a FULL  JOIN b ON a.id = b.a_id   <i>-- all of both</i>
FROM a CROSS JOIN b                    <i>-- cartesian product</i>
FROM employees e JOIN employees m ON e.manager_id = m.id   <i>-- self join</i></code>
</div>

<h1>Changing data (DML)</h1>
<div class="definition">
    <code class="sql">INSERT INTO t (a, b) VALUES (1, 'x'), (2, 'y');
INSERT INTO t (a, b) SELECT a, b FROM other WHERE …;

UPDATE t SET a = 1, b = 'x' WHERE id = 7;

DELETE FROM t WHERE id = 7;

<i>-- upsert</i>
INSERT INTO t (id, b) VALUES (1, 'x')
ON CONFLICT(id) DO UPDATE SET b = excluded.b;</code>
</div>

<h1>Defining the schema (DDL)</h1>
<div class="definition">
    <code class="sql">CREATE TABLE IF NOT EXISTS t (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    name    TEXT    NOT NULL UNIQUE,
    country TEXT    NOT NULL DEFAULT 'Spain',
    score   REAL    CHECK (score BETWEEN 0 AND 10),
    other_id INTEGER REFERENCES other(id) ON DELETE CASCADE
);

ALTER TABLE t ADD COLUMN extra TEXT DEFAULT '';
ALTER TABLE t RENAME TO t2;
ALTER TABLE t DROP COLUMN extra;
DROP TABLE IF EXISTS t;

CREATE VIEW  v AS SELECT …;      DROP VIEW  IF EXISTS v;
CREATE INDEX i ON t(a, b);       DROP INDEX IF EXISTS i;
CREATE TRIGGER g AFTER INSERT ON t FOR EACH ROW BEGIN … END;</code>
</div>

<h1>Aggregates and windows</h1>
<div class="definition">
    <code class="sql"><i>-- aggregates</i>
COUNT(*), COUNT(col), COUNT(DISTINCT col), SUM, AVG, MIN, MAX
GROUP_CONCAT(col, ', ')   <i>-- STRING_AGG in PostgreSQL/SQL Server</i>

<i>-- windows</i>
ROW_NUMBER() OVER (PARTITION BY g ORDER BY x)
RANK() | DENSE_RANK() | NTILE(4)
LAG(col, 1) | LEAD(col, 1) | FIRST_VALUE(col) | LAST_VALUE(col)
SUM(x) OVER (ORDER BY date)                  <i>-- running total</i></code>
</div>

<h1>Set operations and subqueries</h1>
<div class="definition">
    <code class="sql">SELECT … UNION [ALL] SELECT …
SELECT … INTERSECT    SELECT …
SELECT … EXCEPT       SELECT …      <i>-- MINUS in Oracle</i>

WITH cte AS (SELECT …), other AS (SELECT … FROM cte)
SELECT * FROM other;

WITH RECURSIVE tree AS (
    SELECT … WHERE parent IS NULL
  UNION ALL
    SELECT … FROM table JOIN tree ON …
) SELECT * FROM tree;</code>
</div>

<h1>Transactions</h1>
<div class="definition">
    <code class="sql">BEGIN TRANSACTION;
    …
    SAVEPOINT sp;   ROLLBACK TO sp;   RELEASE sp;
COMMIT;   <i>-- or ROLLBACK;</i></code>
</div>

<h1>Cross-engine equivalences</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:20%">Concept</td><td>SQLite</td><td>PostgreSQL</td><td>MySQL</td><td>SQL Server</td></tr>
    <tr><td>Concatenate</td><td><code>||</code></td><td><code>||</code></td><td><code>CONCAT()</code></td><td><code>+</code></td></tr>
    <tr><td>Auto-increment</td><td><code>AUTOINCREMENT</code></td><td><code>SERIAL</code> / <code>IDENTITY</code></td><td><code>AUTO_INCREMENT</code></td><td><code>IDENTITY(1,1)</code></td></tr>
    <tr><td>Limit rows</td><td><code>LIMIT n</code></td><td><code>LIMIT n</code></td><td><code>LIMIT n</code></td><td><code>TOP n</code> / <code>OFFSET…FETCH</code></td></tr>
    <tr><td>Current date</td><td><code>date('now')</code></td><td><code>CURRENT_DATE</code></td><td><code>CURDATE()</code></td><td><code>GETDATE()</code></td></tr>
    <tr><td>Extract year</td><td><code>strftime('%Y', d)</code></td><td><code>EXTRACT(YEAR FROM d)</code></td><td><code>YEAR(d)</code></td><td><code>YEAR(d)</code></td></tr>
    <tr><td>Add days</td><td><code>date(d, '+7 day')</code></td><td><code>d + INTERVAL '7 day'</code></td><td><code>DATE_ADD(d, INTERVAL 7 DAY)</code></td><td><code>DATEADD(day, 7, d)</code></td></tr>
    <tr><td>If null</td><td><code>IFNULL</code> / <code>COALESCE</code></td><td><code>COALESCE</code></td><td><code>IFNULL</code> / <code>COALESCE</code></td><td><code>ISNULL</code> / <code>COALESCE</code></td></tr>
    <tr><td>Upsert</td><td><code>ON CONFLICT DO UPDATE</code></td><td><code>ON CONFLICT DO UPDATE</code></td><td><code>ON DUPLICATE KEY UPDATE</code></td><td><code>MERGE</code></td></tr>
    <tr><td>Set difference</td><td><code>EXCEPT</code></td><td><code>EXCEPT</code></td><td><code>EXCEPT</code> (8.0.31+)</td><td><code>EXCEPT</code></td></tr>
    <tr><td>Execution plan</td><td><code>EXPLAIN QUERY PLAN</code></td><td><code>EXPLAIN ANALYZE</code></td><td><code>EXPLAIN</code></td><td>Graphical plan</td></tr>
    <tr><td>Stored procedures</td><td>Not available</td><td><code>CREATE PROCEDURE … plpgsql</code></td><td><code>CREATE PROCEDURE</code></td><td><code>CREATE PROCEDURE</code></td></tr>
    <tr><td>User-defined functions</td><td>From the host language</td><td><code>CREATE FUNCTION</code></td><td><code>CREATE FUNCTION</code></td><td><code>CREATE FUNCTION</code></td></tr>
    <tr><td>Users and permissions</td><td>Not available</td><td colspan="3"><code>GRANT</code> / <code>REVOKE</code></td></tr>
  </table>
</div>

<h1>Classic mistakes</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:44%">Symptom</td><td>Usual cause</td></tr>
    <tr><td>A <code>WHERE col = NULL</code> returns nothing</td><td>You have to use <code>IS NULL</code></td></tr>
    <tr><td>A <code>NOT IN</code> returns nothing</td><td>The subquery contains a <code>NULL</code>; use <code>NOT EXISTS</code></td></tr>
    <tr><td>A percentage comes out as 0</td><td>Integer division; multiply by <code>100.0</code></td></tr>
    <tr><td>"No such column: alias" in the <code>WHERE</code></td><td><code>SELECT</code> aliases don't exist yet; repeat the expression or use a CTE</td></tr>
    <tr><td>An <code>UPDATE</code> touched the whole table</td><td>The <code>WHERE</code> was missing</td></tr>
    <tr><td>A <code>JOIN</code> returns more rows than expected</td><td>The relationship is 1-to-N on both sides: check the <code>ON</code> condition</td></tr>
    <tr><td>The query is fine locally and terrible in production</td><td>A missing index, or 10,000 times more data</td></tr>
  </table>
</div>

<p>Practise any of these constructs in the <a href="#/playground">Playground</a>.</p>
`
}

});
