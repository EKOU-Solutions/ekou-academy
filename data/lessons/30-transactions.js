CURSO.register({
  slug: 'transacciones',
  section: 'programacion',
  source: 'extra',
  title: 'Tema: Transacciones (BEGIN, COMMIT, ROLLBACK)',
  shortTitle: 'Transacciones',
  summary: 'Agrupar varias sentencias en una unidad que se aplica entera o no se aplica.',
  keywords: 'transaccion begin commit rollback savepoint acid aislamiento bloqueo deadlock',
  body: `
<p>Una <strong>transacción</strong> es un grupo de sentencias que la base de datos trata como una sola
operación: o se aplican todas, o no se aplica ninguna. Es la herramienta que evita quedarte con medio
trabajo hecho cuando algo falla a mitad.</p>

<div class="definition">
    <div class="desc">Estructura de una transacción</div>
    <code class="sql"><strong>BEGIN TRANSACTION;</strong>

UPDATE cuentas SET saldo = saldo - 100 WHERE id = 1;
UPDATE cuentas SET saldo = saldo + 100 WHERE id = 2;

<strong>COMMIT;</strong>          <i>-- confirma: los cambios se hacen permanentes</i>
<i>-- ROLLBACK;    -- o cancela: se deshace todo lo hecho desde el BEGIN</i></code>
</div>

<p>Sin transacción, si el segundo <code>UPDATE</code> falla, el dinero desaparece: se ha restado de una
cuenta y no se ha sumado a la otra.</p>

<h1>Las propiedades ACID</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:26%">Propiedad</td><td>Significa</td></tr>
    <tr><td><strong>A</strong>tomicidad</td><td>Todo o nada. No existen transacciones a medias.</td></tr>
    <tr><td><strong>C</strong>onsistencia</td><td>La base pasa de un estado válido a otro: las restricciones se siguen cumpliendo al terminar.</td></tr>
    <tr><td><strong>I</strong>slamiento (<i>isolation</i>)</td><td>Las transacciones concurrentes no se pisan; cada una ve un estado coherente.</td></tr>
    <tr><td><strong>D</strong>urabilidad</td><td>Una vez confirmada, sobrevive a un corte de luz.</td></tr>
  </table>
</div>

<h1>Puntos de guardado: SAVEPOINT</h1>
<p>Un <code>SAVEPOINT</code> es una marca dentro de la transacción. Permite deshacer solo una parte sin
abortarla entera.</p>

<div class="definition">
    <div class="desc">SAVEPOINT y ROLLBACK TO</div>
    <code class="sql">BEGIN;
    UPDATE productos SET stock = 0 WHERE categoria_id = 5;

    <strong>SAVEPOINT antes_de_borrar;</strong>
    DELETE FROM productos WHERE stock = 0;
    <strong>ROLLBACK TO antes_de_borrar;</strong>   <i>-- deshace solo el DELETE</i>

    <i>-- RELEASE antes_de_borrar;  -- descarta el punto sin deshacer nada</i>
COMMIT;   <i>-- el UPDATE sí se confirma</i></code>
</div>

<h1>Niveles de aislamiento</h1>
<p>Cuando varias transacciones se ejecutan a la vez pueden aparecer anomalías. El nivel de aislamiento
decide cuáles se permiten a cambio de más concurrencia:</p>

<div class="datatable">
  <table class="table">
    <tr><td style="width:30%">Nivel</td><td>Permite</td></tr>
    <tr><td><code>READ UNCOMMITTED</code></td><td>Lecturas sucias: ves cambios que otra transacción aún no ha confirmado.</td></tr>
    <tr><td><code>READ COMMITTED</code></td><td>Solo lees datos confirmados, pero dos lecturas iguales pueden dar resultados distintos. Es el valor por defecto en PostgreSQL, Oracle y SQL Server.</td></tr>
    <tr><td><code>REPEATABLE READ</code></td><td>Las relecturas son estables, pero pueden aparecer «filas fantasma» nuevas. Por defecto en MySQL/InnoDB.</td></tr>
    <tr><td><code>SERIALIZABLE</code></td><td>Como si las transacciones se ejecutaran una detrás de otra. El más seguro y el más lento. Es el único que usa SQLite.</td></tr>
  </table>
</div>

<p>Se cambia con <code>SET TRANSACTION ISOLATION LEVEL …</code>.</p>

<div class="callout danger">
  <div class="desc">Interbloqueos (<i>deadlocks</i>)</div>
  <p>Si la transacción A bloquea la fila 1 y espera la 2, mientras B bloquea la 2 y espera la 1, ninguna
  avanza. El motor detecta el ciclo y aborta una de las dos con un error. Para reducirlos: accede a las
  tablas siempre en el mismo orden, mantén las transacciones cortas y no pidas datos al usuario con una
  transacción abierta.</p>
</div>

<h1>Notas por motor</h1>
<ul>
  <li><strong>SQLite</strong>: cada sentencia suelta es ya una transacción implícita. Agrupar mil
      <code>INSERT</code> dentro de un <code>BEGIN … COMMIT</code> los hace órdenes de magnitud más rápidos.
      Admite <code>BEGIN DEFERRED | IMMEDIATE | EXCLUSIVE</code>.</li>
  <li><strong>MySQL</strong>: solo con motor InnoDB (MyISAM no tiene transacciones), y el DDL provoca un
      <em>commit</em> implícito. <code>autocommit</code> viene activado por defecto.</li>
  <li><strong>PostgreSQL</strong>: el DDL <em>sí</em> es transaccional; puedes hacer <code>ROLLBACK</code> de
      un <code>CREATE TABLE</code>.</li>
</ul>

<h1>Ejercicio</h1>
<p>Base <strong>Tienda online</strong>. Puedes escribir varias sentencias seguidas separadas por punto y
coma: se ejecutan en orden sobre la misma conexión.</p>
`,
  exercise: {
    dataset: 'tienda',
    tables: ['productos', 'pedidos', 'detalle_pedido'],
    title: 'Ejercicio: transacciones',
    starter: 'SELECT id, nombre, precio, stock FROM productos WHERE categoria_id = 2;',
    tasks: [
      { text: 'Dentro de una transacción, sube un 10 % el <code>precio</code> de los productos de la categoría 2 (redondeado a 2 decimales) y <strong>confirma</strong> el cambio',
        hint: '<code>BEGIN TRANSACTION; UPDATE … ; COMMIT;</code> — usa <code>ROUND(precio * 1.10, 2)</code>.',
        queryChecks: ['COMMIT'],
        postValidateAction: { resultQuery: 'SELECT id, nombre, precio FROM productos WHERE categoria_id = 2;', message: 'Transacción confirmada' },
        solution: 'BEGIN TRANSACTION;\nUPDATE productos SET precio = ROUND(precio * 1.10, 2) WHERE categoria_id = 2;\nCOMMIT;',
        checks: [{ type: 'scalar_equals', data: { query: 'SELECT ROUND(SUM(precio), 2) FROM productos WHERE categoria_id = 2;', value: 165.44 } }] },
      { text: 'Abre una transacción, borra <strong>todas</strong> las filas de <code>detalle_pedido</code> y de <code>pedidos</code>… y a continuación <strong>deshaz</strong> el cambio con <code>ROLLBACK</code>',
        hint: 'Borra primero las líneas de detalle (por la clave foránea) y luego los pedidos.',
        queryChecks: ['ROLLBACK'],
        postValidateAction: { resultQuery: 'SELECT COUNT(*) AS pedidos_que_siguen_ahi FROM pedidos;', message: 'Cambios deshechos' },
        solution: 'BEGIN;\nDELETE FROM detalle_pedido;\nDELETE FROM pedidos;\nROLLBACK;',
        checks: [{ type: 'scalar_equals', data: { query: 'SELECT COUNT(*) FROM pedidos;', value: 18 } }] },
      { text: 'En una sola transacción: pon a 0 el <code>stock</code> de los productos de la categoría 5, marca un <code>SAVEPOINT</code>, ejecuta por error un <code>UPDATE productos SET precio = 0</code> sobre toda la tabla, deshaz <strong>solo ese error</strong> y confirma el resto',
        hint: '<code>SAVEPOINT nombre;</code> … <code>ROLLBACK TO nombre;</code> … <code>COMMIT;</code>',
        queryChecks: ['SAVEPOINT', 'ROLLBACK TO'],
        postValidateAction: { resultQuery: 'SELECT id, nombre, precio, stock FROM productos WHERE categoria_id = 5;', message: 'Savepoint deshecho, transacción confirmada' },
        solution: 'BEGIN;\nUPDATE productos SET stock = 0 WHERE categoria_id = 5;\nSAVEPOINT antes_del_desastre;\nUPDATE productos SET precio = 0;\nROLLBACK TO antes_del_desastre;\nCOMMIT;',
        checks: [
          { type: 'scalar_equals', data: { query: 'SELECT COUNT(*) FROM productos WHERE precio = 0;', value: 0 } },
          { type: 'scalar_equals', data: { query: 'SELECT SUM(stock) FROM productos WHERE categoria_id = 5;', value: 0 } },
          { type: 'scalar_equals', data: { query: 'SELECT COUNT(*) FROM productos;', value: 15 } }
        ] }
    ]
  }
});
