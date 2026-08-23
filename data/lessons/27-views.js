CURSO.register({
  slug: 'vistas',
  section: 'objetos',
  source: 'extra',
  title: 'Tema: Vistas (VIEW)',
  shortTitle: 'Vistas',
  summary: 'Consultas guardadas con nombre: simplifican, encapsulan y protegen.',
  keywords: 'view vista create view drop view materializada instead of',
  body: `
<p>Una <strong>vista</strong> es una consulta guardada a la que se le da nombre. No almacena datos: cada vez
que la consultas, el motor ejecuta la consulta que hay detrás. Para quien la usa, se comporta como una
tabla más.</p>

<div class="definition">
    <div class="desc">Crear y usar una vista</div>
    <code class="sql">CREATE VIEW v_totales_pedido AS
SELECT p.id AS pedido_id,
       p.cliente_id,
       ROUND(SUM(d.cantidad * d.precio_unit), 2) AS total
FROM pedidos p
JOIN detalle_pedido d ON d.pedido_id = p.id
GROUP BY p.id;

<i>-- a partir de aquí se consulta como una tabla</i>
SELECT * FROM v_totales_pedido WHERE total &gt; 1000;</code>
</div>

<h1>Para qué sirven</h1>
<ul>
  <li><strong>Simplificar</strong>: encapsulas un <code>JOIN</code> de seis tablas y el resto del equipo
      escribe <code>SELECT * FROM v_ventas</code>.</li>
  <li><strong>Reutilizar lógica de negocio</strong>: la definición de «cliente activo» vive en un solo sitio
      en lugar de estar copiada en veinte consultas.</li>
  <li><strong>Seguridad</strong>: das permiso sobre la vista, no sobre la tabla. Así alguien puede consultar
      los pedidos sin ver la columna de márgenes o los datos personales.</li>
  <li><strong>Estabilidad</strong>: si cambia el esquema por debajo, puedes reescribir la vista y no romper
      las consultas que dependen de ella.</li>
</ul>

<div class="definition">
    <div class="desc">Otras operaciones</div>
    <code class="sql">CREATE VIEW IF NOT EXISTS v_x AS SELECT …;   <i>-- no falla si ya existe</i>
DROP VIEW IF EXISTS v_x;                     <i>-- eliminar</i>
CREATE OR REPLACE VIEW v_x AS SELECT …;      <i>-- redefinir (PostgreSQL, MySQL, Oracle)</i></code>
</div>

<div class="callout sqlite">
  <div class="desc">SQLite</div>
  <p>SQLite no tiene <code>CREATE OR REPLACE VIEW</code>: hay que hacer <code>DROP VIEW</code> y volver a
  crearla. Sus vistas son siempre de <strong>solo lectura</strong>; para poder escribir a través de una
  vista se usa un disparador <code>INSTEAD OF</code> (ver <a href="#/triggers">Disparadores</a>).</p>
</div>

<h1>¿Se puede escribir en una vista?</h1>
<p>Depende. Una vista «simple» (una sola tabla, sin agregados, sin <code>DISTINCT</code>, sin
<code>GROUP BY</code>) suele ser actualizable: un <code>UPDATE</code> sobre ella se traduce en un
<code>UPDATE</code> sobre la tabla base. Las vistas con agregados o varias tablas no lo son, y hay que
recurrir a disparadores <code>INSTEAD OF</code>.</p>

<p>La cláusula <code>WITH CHECK OPTION</code> (PostgreSQL, MySQL, SQL Server) impide insertar por la vista
filas que después no serían visibles en ella.</p>

<h1>Vistas materializadas</h1>
<p>Una <strong>vista materializada</strong> sí guarda el resultado en disco: se consulta muy rápido, pero
los datos son una foto que hay que refrescar.</p>

<div class="datatable">
  <table class="table">
    <tr><td style="width:26%">Motor</td><td>Soporte</td></tr>
    <tr><td>PostgreSQL</td><td><code>CREATE MATERIALIZED VIEW …</code> + <code>REFRESH MATERIALIZED VIEW …</code></td></tr>
    <tr><td>Oracle</td><td><code>CREATE MATERIALIZED VIEW … REFRESH FAST ON COMMIT</code></td></tr>
    <tr><td>SQL Server</td><td>Vistas indexadas (<code>CREATE VIEW … WITH SCHEMABINDING</code> + índice clúster único)</td></tr>
    <tr><td>MySQL / SQLite</td><td>No existen. Se emulan con una tabla real que se recalcula por lotes o con disparadores.</td></tr>
  </table>
</div>

<div class="callout danger">
  <div class="desc">Una vista no es un índice</div>
  <p>Una vista normal no acelera nada por sí sola: la consulta de debajo se ejecuta igual cada vez. Anidar
  vistas sobre vistas sobre vistas es una fuente clásica de consultas lentísimas.</p>
</div>

<h1>Ejercicio</h1>
<p>Base <strong>Tienda online</strong>. Ejecuta cada sentencia cuando la tengas lista; si te lías, pulsa
«Reiniciar datos».</p>
`,
  exercise: {
    dataset: 'tienda',
    tables: ['pedidos', 'detalle_pedido', 'clientes'],
    title: 'Ejercicio: vistas',
    starter: 'SELECT * FROM pedidos;',
    tasks: [
      { text: 'Crea una vista llamada <code>v_totales_pedido</code> con el <code>pedido_id</code>, el <code>cliente_id</code> y el <code>total</code> de cada pedido (suma de <code>cantidad * precio_unit</code> de sus líneas)',
        hint: 'Une <code>pedidos</code> con <code>detalle_pedido</code> y agrupa por el id del pedido.',
        postValidateAction: { resultQuery: 'SELECT * FROM v_totales_pedido ORDER BY total DESC;', message: 'Vista creada' },
        solution: 'CREATE VIEW v_totales_pedido AS\nSELECT p.id AS pedido_id,\n       p.cliente_id,\n       ROUND(SUM(d.cantidad * d.precio_unit), 2) AS total\nFROM pedidos p\nJOIN detalle_pedido d ON d.pedido_id = p.id\nGROUP BY p.id;',
        checks: [
          { type: 'object_exists', data: { type: 'view', name: 'v_totales_pedido' }, failQuery: 'DROP VIEW IF EXISTS v_totales_pedido;' },
          { type: 'scalar_equals', data: { query: 'SELECT COUNT(*) FROM v_totales_pedido;', value: 18 }, failQuery: 'DROP VIEW IF EXISTS v_totales_pedido;' },
          { type: 'assert_query_succeeds', data: 'SELECT pedido_id, cliente_id, total FROM v_totales_pedido;', failQuery: 'DROP VIEW IF EXISTS v_totales_pedido;' }
        ] },
      { text: 'Consulta la vista recién creada para obtener el <code>nombre</code> del cliente y el <code>total</code> de los 3 pedidos de mayor importe',
        hint: 'La vista se usa igual que una tabla: puedes hacerle <code>JOIN</code> con <code>clientes</code>.',
        solution: 'SELECT c.nombre, v.total\nFROM v_totales_pedido v\nJOIN clientes c ON c.id = v.cliente_id\nORDER BY v.total DESC\nLIMIT 3;',
        checks: [{ type: 'row_col_val_solution_query_ordered', data: null }] },
      { text: 'Elimina la vista <code>v_totales_pedido</code>',
        postValidateAction: { message: 'Vista eliminada' },
        solution: 'DROP VIEW v_totales_pedido;',
        checks: [{ type: 'assert_query_fails', data: 'SELECT * FROM v_totales_pedido;' }] }
    ]
  }
});
