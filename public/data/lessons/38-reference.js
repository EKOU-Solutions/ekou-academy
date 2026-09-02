CURSO.register({
  slug: 'chuleta-sql',
  section: 'referencia',
  source: 'extra',
  title: 'Chuleta de SQL y equivalencias entre motores',
  shortTitle: 'Chuleta SQL',
  summary: 'Toda la sintaxis del curso en una página, más las diferencias entre SQLite, MySQL, PostgreSQL, SQL Server y Oracle.',
  keywords: 'chuleta cheatsheet referencia resumen sintaxis equivalencias motores',
  body: `
<h1>Consultar datos (DQL)</h1>
<div class="definition">
    <div class="desc">Consulta completa y orden de ejecución</div>
    <code class="sql">SELECT   DISTINCT col, AGG(col) AS alias   <i>-- 5.º / 6.º</i>
FROM     tabla                            <i>-- 1.º</i>
  JOIN   otra ON tabla.id = otra.tabla_id <i>-- 1.º</i>
WHERE    condicion                        <i>-- 2.º</i>
GROUP BY col                              <i>-- 3.º</i>
HAVING   condicion_de_grupo               <i>-- 4.º</i>
ORDER BY col ASC|DESC                     <i>-- 7.º</i>
LIMIT    n OFFSET m;                      <i>-- 8.º</i></code>
</div>

<h1>Operadores de WHERE</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:34%">Operador</td><td>Uso</td></tr>
    <tr><td><code>= != &lt;&gt; &lt; &lt;= &gt; &gt;=</code></td><td>Comparación</td></tr>
    <tr><td><code>BETWEEN a AND b</code></td><td>Rango inclusivo</td></tr>
    <tr><td><code>IN (…)</code> / <code>NOT IN (…)</code></td><td>Pertenencia a una lista o subconsulta</td></tr>
    <tr><td><code>LIKE 'a%'</code> / <code>'a_'</code></td><td>Patrón: <code>%</code> = cualquier secuencia, <code>_</code> = un carácter</td></tr>
    <tr><td><code>IS NULL</code> / <code>IS NOT NULL</code></td><td>Comprobar nulos (nunca <code>= NULL</code>)</td></tr>
    <tr><td><code>EXISTS (SELECT …)</code></td><td>¿Devuelve alguna fila la subconsulta?</td></tr>
    <tr><td><code>AND</code>, <code>OR</code>, <code>NOT</code></td><td>Combinación lógica</td></tr>
  </table>
</div>

<h1>JOINs</h1>
<div class="definition">
    <code class="sql">FROM a INNER JOIN b ON a.id = b.a_id   <i>-- solo coincidencias</i>
FROM a LEFT  JOIN b ON a.id = b.a_id   <i>-- todas las de A</i>
FROM a RIGHT JOIN b ON a.id = b.a_id   <i>-- todas las de B</i>
FROM a FULL  JOIN b ON a.id = b.a_id   <i>-- todas las de ambas</i>
FROM a CROSS JOIN b                    <i>-- producto cartesiano</i>
FROM empleados e JOIN empleados j ON e.jefe_id = j.id   <i>-- self join</i></code>
</div>

<h1>Modificar datos (DML)</h1>
<div class="definition">
    <code class="sql">INSERT INTO t (a, b) VALUES (1, 'x'), (2, 'y');
INSERT INTO t (a, b) SELECT a, b FROM otra WHERE …;

UPDATE t SET a = 1, b = 'x' WHERE id = 7;

DELETE FROM t WHERE id = 7;

<i>-- upsert</i>
INSERT INTO t (id, b) VALUES (1, 'x')
ON CONFLICT(id) DO UPDATE SET b = excluded.b;</code>
</div>

<h1>Definir el esquema (DDL)</h1>
<div class="definition">
    <code class="sql">CREATE TABLE IF NOT EXISTS t (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT    NOT NULL UNIQUE,
    pais   TEXT    NOT NULL DEFAULT 'España',
    nota   REAL    CHECK (nota BETWEEN 0 AND 10),
    otro_id INTEGER REFERENCES otra(id) ON DELETE CASCADE
);

ALTER TABLE t ADD COLUMN extra TEXT DEFAULT '';
ALTER TABLE t RENAME TO t2;
ALTER TABLE t DROP COLUMN extra;
DROP TABLE IF EXISTS t;

CREATE VIEW  v AS SELECT …;      DROP VIEW  IF EXISTS v;
CREATE INDEX i ON t(a, b);       DROP INDEX IF EXISTS i;
CREATE TRIGGER g AFTER INSERT ON t FOR EACH ROW BEGIN … END;</code>
</div>

<h1>Agregados y ventanas</h1>
<div class="definition">
    <code class="sql"><i>-- agregados</i>
COUNT(*), COUNT(col), COUNT(DISTINCT col), SUM, AVG, MIN, MAX
GROUP_CONCAT(col, ', ')   <i>-- STRING_AGG en PostgreSQL/SQL Server</i>

<i>-- ventanas</i>
ROW_NUMBER() OVER (PARTITION BY g ORDER BY x)
RANK() | DENSE_RANK() | NTILE(4)
LAG(col, 1) | LEAD(col, 1) | FIRST_VALUE(col) | LAST_VALUE(col)
SUM(x) OVER (ORDER BY fecha)                 <i>-- total acumulado</i></code>
</div>

<h1>Conjuntos y subconsultas</h1>
<div class="definition">
    <code class="sql">SELECT … UNION [ALL] SELECT …
SELECT … INTERSECT    SELECT …
SELECT … EXCEPT       SELECT …      <i>-- MINUS en Oracle</i>

WITH cte AS (SELECT …), otra AS (SELECT … FROM cte)
SELECT * FROM otra;

WITH RECURSIVE arbol AS (
    SELECT … WHERE padre IS NULL
  UNION ALL
    SELECT … FROM tabla JOIN arbol ON …
) SELECT * FROM arbol;</code>
</div>

<h1>Transacciones</h1>
<div class="definition">
    <code class="sql">BEGIN TRANSACTION;
    …
    SAVEPOINT sp;   ROLLBACK TO sp;   RELEASE sp;
COMMIT;   <i>-- o ROLLBACK;</i></code>
</div>

<h1>Equivalencias entre motores</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:20%">Concepto</td><td>SQLite</td><td>PostgreSQL</td><td>MySQL</td><td>SQL Server</td></tr>
    <tr><td>Concatenar</td><td><code>||</code></td><td><code>||</code></td><td><code>CONCAT()</code></td><td><code>+</code></td></tr>
    <tr><td>Autoincremento</td><td><code>AUTOINCREMENT</code></td><td><code>SERIAL</code> / <code>IDENTITY</code></td><td><code>AUTO_INCREMENT</code></td><td><code>IDENTITY(1,1)</code></td></tr>
    <tr><td>Limitar filas</td><td><code>LIMIT n</code></td><td><code>LIMIT n</code></td><td><code>LIMIT n</code></td><td><code>TOP n</code> / <code>OFFSET…FETCH</code></td></tr>
    <tr><td>Fecha actual</td><td><code>date('now')</code></td><td><code>CURRENT_DATE</code></td><td><code>CURDATE()</code></td><td><code>GETDATE()</code></td></tr>
    <tr><td>Extraer año</td><td><code>strftime('%Y', d)</code></td><td><code>EXTRACT(YEAR FROM d)</code></td><td><code>YEAR(d)</code></td><td><code>YEAR(d)</code></td></tr>
    <tr><td>Sumar días</td><td><code>date(d, '+7 day')</code></td><td><code>d + INTERVAL '7 day'</code></td><td><code>DATE_ADD(d, INTERVAL 7 DAY)</code></td><td><code>DATEADD(day, 7, d)</code></td></tr>
    <tr><td>Si es nulo</td><td><code>IFNULL</code> / <code>COALESCE</code></td><td><code>COALESCE</code></td><td><code>IFNULL</code> / <code>COALESCE</code></td><td><code>ISNULL</code> / <code>COALESCE</code></td></tr>
    <tr><td>Upsert</td><td><code>ON CONFLICT DO UPDATE</code></td><td><code>ON CONFLICT DO UPDATE</code></td><td><code>ON DUPLICATE KEY UPDATE</code></td><td><code>MERGE</code></td></tr>
    <tr><td>Diferencia de conjuntos</td><td><code>EXCEPT</code></td><td><code>EXCEPT</code></td><td><code>EXCEPT</code> (8.0.31+)</td><td><code>EXCEPT</code></td></tr>
    <tr><td>Plan de ejecución</td><td><code>EXPLAIN QUERY PLAN</code></td><td><code>EXPLAIN ANALYZE</code></td><td><code>EXPLAIN</code></td><td>Plan gráfico</td></tr>
    <tr><td>Procedimientos</td><td>No existen</td><td><code>CREATE PROCEDURE … plpgsql</code></td><td><code>CREATE PROCEDURE</code></td><td><code>CREATE PROCEDURE</code></td></tr>
    <tr><td>Funciones de usuario</td><td>Desde el lenguaje anfitrión</td><td><code>CREATE FUNCTION</code></td><td><code>CREATE FUNCTION</code></td><td><code>CREATE FUNCTION</code></td></tr>
    <tr><td>Usuarios y permisos</td><td>No existen</td><td colspan="3"><code>GRANT</code> / <code>REVOKE</code></td></tr>
  </table>
</div>

<h1>Errores clásicos</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:44%">Síntoma</td><td>Causa habitual</td></tr>
    <tr><td>Un <code>WHERE col = NULL</code> no devuelve nada</td><td>Hay que usar <code>IS NULL</code></td></tr>
    <tr><td>Un <code>NOT IN</code> no devuelve nada</td><td>La subconsulta contiene algún <code>NULL</code>; usa <code>NOT EXISTS</code></td></tr>
    <tr><td>Un porcentaje sale 0</td><td>División entera; multiplica por <code>100.0</code></td></tr>
    <tr><td>«No such column: alias» en el <code>WHERE</code></td><td>Los alias del <code>SELECT</code> no existen aún; repite la expresión o usa una CTE</td></tr>
    <tr><td>Un <code>UPDATE</code> ha tocado toda la tabla</td><td>Faltaba el <code>WHERE</code></td></tr>
    <tr><td>Un <code>JOIN</code> devuelve más filas de las esperadas</td><td>La relación es 1 a N por ambos lados: revisa la condición <code>ON</code></td></tr>
    <tr><td>La consulta va bien en local y fatal en producción</td><td>Falta un índice, o hay 10 000 veces más datos</td></tr>
  </table>
</div>

<p>Practica cualquiera de estas construcciones en el <a href="#/playground">Playground</a>.</p>
`
});
