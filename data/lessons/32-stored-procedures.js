CURSO.register({
  slug: 'procedimientos-almacenados',
  section: 'programacion',
  source: 'extra',
  title: 'Tema: Procedimientos almacenados',
  shortTitle: 'Procedimientos almacenados',
  summary: 'Rutinas con parámetros y lógica guardadas dentro del servidor de base de datos.',
  keywords: 'procedimiento almacenado stored procedure create procedure call delimiter plpgsql in out inout',
  body: `
<p>Un <strong>procedimiento almacenado</strong> es un programa guardado dentro del servidor de base de datos.
Tiene nombre, admite parámetros, puede contener variables, condicionales, bucles y varias sentencias SQL, y
se ejecuta con una sola llamada.</p>

<div class="callout sqlite">
  <div class="desc">Importante: SQLite no tiene procedimientos almacenados</div>
  <p>SQLite es una biblioteca embebida, no un servidor, y deliberadamente <strong>no</strong> implementa
  <code>CREATE PROCEDURE</code> ni ningún lenguaje procedimental. Por eso este tema es de
  <strong>referencia</strong>: aquí tienes la sintaxis real de MySQL, PostgreSQL, SQL Server y Oracle, y al
  final un ejercicio con las <em>alternativas</em> que sí puedes practicar en el playground.</p>
</div>

<h1>Por qué existen</h1>
<ul>
  <li><strong>Menos viajes de red</strong>: una llamada en lugar de veinte consultas desde la aplicación.</li>
  <li><strong>Lógica compartida</strong>: varias aplicaciones (y el ETL nocturno, y el informe) usan la misma
      rutina.</li>
  <li><strong>Seguridad</strong>: puedes dar permiso para <em>ejecutar</em> el procedimiento sin dar permiso
      sobre las tablas que toca.</li>
  <li><strong>Transaccionalidad</strong>: todo el bloque se ejecuta dentro del servidor, sin ventanas entre
      sentencias.</li>
</ul>

<p>Y por qué mucha gente los evita: son difíciles de versionar y de probar, el lenguaje cambia por completo
entre motores, y la lógica de negocio queda repartida entre la aplicación y la base de datos.</p>

<h1>MySQL / MariaDB</h1>
<div class="definition">
    <div class="desc">CREATE PROCEDURE en MySQL</div>
    <code class="sql">DELIMITER $$

CREATE PROCEDURE sp_aplicar_descuento(
    <strong>IN</strong>  p_cliente_id INT,
    <strong>IN</strong>  p_pct        DECIMAL(4,2),
    <strong>OUT</strong> p_afectados  INT
)
BEGIN
    DECLARE v_vip TINYINT DEFAULT 0;

    SELECT vip INTO v_vip FROM clientes WHERE id = p_cliente_id;

    IF v_vip = 1 THEN
        SET p_pct = p_pct + 0.05;
    END IF;

    UPDATE pedidos
       SET descuento = p_pct
     WHERE cliente_id = p_cliente_id
       AND estado = 'pendiente';

    SET p_afectados = ROW_COUNT();
END$$

DELIMITER ;

<i>-- llamada</i>
CALL sp_aplicar_descuento(3, 0.10, @n);
SELECT @n;</code>
</div>

<p><code>DELIMITER</code> es necesario en el cliente de MySQL porque el cuerpo contiene puntos y coma que no
deben terminar la sentencia.</p>

<h1>PostgreSQL (PL/pgSQL)</h1>
<div class="definition">
    <div class="desc">CREATE PROCEDURE / FUNCTION en PostgreSQL</div>
    <code class="sql">CREATE OR REPLACE PROCEDURE sp_aplicar_descuento(
    p_cliente_id INT,
    p_pct        NUMERIC
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_vip BOOLEAN;
BEGIN
    SELECT vip INTO v_vip FROM clientes WHERE id = p_cliente_id;

    IF v_vip THEN
        p_pct := p_pct + 0.05;
    END IF;

    UPDATE pedidos
       SET descuento = p_pct
     WHERE cliente_id = p_cliente_id
       AND estado = 'pendiente';

    <i>-- COMMIT / ROLLBACK están permitidos dentro de un PROCEDURE (PG 11+)</i>
END;
$$;

CALL sp_aplicar_descuento(3, 0.10);</code>
</div>

<p>En PostgreSQL, <code>FUNCTION</code> devuelve un valor y se usa dentro de un <code>SELECT</code>;
<code>PROCEDURE</code> no devuelve nada y se invoca con <code>CALL</code>, pero puede controlar
transacciones.</p>

<h1>SQL Server (T-SQL)</h1>
<div class="definition">
    <div class="desc">CREATE PROCEDURE en T-SQL</div>
    <code class="sql">CREATE OR ALTER PROCEDURE sp_aplicar_descuento
    @cliente_id INT,
    @pct        DECIMAL(4,2),
    @afectados  INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM clientes WHERE id = @cliente_id AND vip = 1)
        SET @pct = @pct + 0.05;

    UPDATE pedidos
       SET descuento = @pct
     WHERE cliente_id = @cliente_id AND estado = 'pendiente';

    SET @afectados = @@ROWCOUNT;
END;

EXEC sp_aplicar_descuento @cliente_id = 3, @pct = 0.10, @afectados = @n OUTPUT;</code>
</div>

<h1>Oracle (PL/SQL)</h1>
<div class="definition">
    <div class="desc">CREATE PROCEDURE en PL/SQL</div>
    <code class="sql">CREATE OR REPLACE PROCEDURE sp_aplicar_descuento (
    p_cliente_id IN  NUMBER,
    p_pct        IN  NUMBER,
    p_afectados  OUT NUMBER
) AS
    v_vip NUMBER;
BEGIN
    SELECT vip INTO v_vip FROM clientes WHERE id = p_cliente_id;

    UPDATE pedidos
       SET descuento = p_pct + CASE WHEN v_vip = 1 THEN 0.05 ELSE 0 END
     WHERE cliente_id = p_cliente_id AND estado = 'pendiente';

    p_afectados := SQL%ROWCOUNT;
END;
/</code>
</div>

<h1>Tabla comparativa</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:20%">Concepto</td><td>MySQL</td><td>PostgreSQL</td><td>SQL Server</td><td>Oracle</td></tr>
    <tr><td>Crear</td><td><code>CREATE PROCEDURE</code></td><td><code>CREATE PROCEDURE … LANGUAGE plpgsql</code></td><td><code>CREATE PROCEDURE</code></td><td><code>CREATE PROCEDURE</code></td></tr>
    <tr><td>Llamar</td><td><code>CALL p(…)</code></td><td><code>CALL p(…)</code></td><td><code>EXEC p …</code></td><td><code>EXEC p(…)</code> / bloque anónimo</td></tr>
    <tr><td>Parámetros</td><td><code>IN/OUT/INOUT</code></td><td><code>IN/OUT/INOUT</code></td><td><code>@x</code>, <code>OUTPUT</code></td><td><code>IN/OUT/IN OUT</code></td></tr>
    <tr><td>Variables</td><td><code>DECLARE</code> + <code>SET</code></td><td><code>DECLARE</code> + <code>:=</code></td><td><code>DECLARE @v</code> + <code>SET</code></td><td><code>DECLARE</code> + <code>:=</code></td></tr>
    <tr><td>Filas afectadas</td><td><code>ROW_COUNT()</code></td><td><code>GET DIAGNOSTICS … ROW_COUNT</code></td><td><code>@@ROWCOUNT</code></td><td><code>SQL%ROWCOUNT</code></td></tr>
    <tr><td>Eliminar</td><td colspan="4"><code>DROP PROCEDURE [IF EXISTS] nombre;</code></td></tr>
  </table>
</div>

<h1>Estructuras de control (esquema común)</h1>
<div class="definition">
    <div class="desc">Condicionales y bucles</div>
    <code class="sql">IF condicion THEN … ELSEIF otra THEN … ELSE … END IF;

CASE valor WHEN 1 THEN … ELSE … END CASE;

WHILE condicion DO … END WHILE;      <i>-- MySQL</i>
LOOP … EXIT WHEN condicion; END LOOP; <i>-- Oracle / PL/pgSQL</i>
REPEAT … UNTIL condicion END REPEAT;  <i>-- MySQL</i>

FOR fila IN SELECT … LOOP … END LOOP; <i>-- PL/pgSQL: recorre un cursor implícito</i></code>
</div>

<div class="callout note">
  <div class="desc">Piensa en conjuntos, no en bucles</div>
  <p>La tentación al escribir un procedimiento es recorrer filas una a una. Casi siempre existe una sola
  sentencia <code>UPDATE</code>, <code>INSERT … SELECT</code> o <code>MERGE</code> que hace lo mismo y es
  entre diez y mil veces más rápida. Deja los bucles para lo que de verdad no se puede expresar en conjunto.
  Lo vemos en <a href="#/cursores-errores">Cursores y manejo de errores</a>.</p>
</div>

<h1>Ejercicio</h1>
<p>Como SQLite no ejecuta <code>CREATE PROCEDURE</code>, vas a escribir el <strong>cuerpo</strong> de los
procedimientos: las sentencias SQL que irían dentro. Es exactamente el trabajo difícil; el envoltorio
cambia con cada motor.</p>
`,
  exercise: {
    dataset: 'tienda',
    tables: ['clientes', 'pedidos', 'detalle_pedido', 'productos'],
    title: 'Ejercicio: cuerpos de procedimiento',
    starter: "SELECT * FROM pedidos WHERE estado = 'pendiente';",
    tasks: [
      { text: 'Cuerpo de <code>sp_aplicar_descuento(10, 0.10)</code>: escribe el <code>UPDATE</code> que pone un <code>descuento</code> de <code>0.10</code> a todos los pedidos <code>pendiente</code> del cliente 10',
        hint: 'Los parámetros del procedimiento son, aquí, valores literales.',
        postValidateAction: { resultQuery: 'SELECT id, cliente_id, estado, descuento FROM pedidos WHERE cliente_id = 10;', message: 'Descuento aplicado' },
        solution: "UPDATE pedidos\n   SET descuento = 0.10\n WHERE cliente_id = 10\n   AND estado = 'pendiente';",
        checks: [
          { type: 'scalar_equals', data: { query: 'SELECT descuento FROM pedidos WHERE id = 1014;', value: 0.1 } },
          { type: 'scalar_equals', data: { query: 'SELECT COUNT(*) FROM pedidos WHERE descuento = 0.10;', value: 3 } }
        ] },
      { text: 'Cuerpo de <code>sp_cerrar_pedidos_antiguos()</code>: marca como <code>entregado</code> todos los pedidos con estado <code>enviado</code> cuya <code>fecha</code> sea anterior a <code>2024-01-01</code>',
        postValidateAction: { resultQuery: "SELECT id, fecha, estado FROM pedidos WHERE estado IN ('enviado','entregado') ORDER BY fecha;", message: 'Pedidos cerrados' },
        solution: "UPDATE pedidos\n   SET estado = 'entregado'\n WHERE estado = 'enviado'\n   AND fecha < '2024-01-01';",
        checks: [{ type: 'scalar_equals', data: { query: "SELECT COUNT(*) FROM pedidos WHERE estado = 'enviado' AND fecha < '2024-01-01';", value: 0 } }] },
      { text: 'Cuerpo de <code>sp_generar_resumen_clientes()</code>: crea una tabla <code>resumen_clientes</code> con el <code>cliente_id</code>, el número de pedidos (<code>n_pedidos</code>) y el importe total gastado (<code>gastado</code>, redondeado a 2 decimales) de cada cliente que haya pedido alguna vez',
        hint: 'Se hace en una sola sentencia: <code>CREATE TABLE … AS SELECT …</code>.',
        postValidateAction: { resultQuery: 'SELECT * FROM resumen_clientes ORDER BY gastado DESC;', message: 'Resumen generado' },
        solution: 'CREATE TABLE resumen_clientes AS\nSELECT p.cliente_id,\n       COUNT(DISTINCT p.id) AS n_pedidos,\n       ROUND(SUM(d.cantidad * d.precio_unit), 2) AS gastado\nFROM pedidos p\nJOIN detalle_pedido d ON d.pedido_id = p.id\nGROUP BY p.cliente_id;',
        checks: [
          { type: 'assert_query_succeeds', data: 'SELECT cliente_id, n_pedidos, gastado FROM resumen_clientes;', failQuery: 'DROP TABLE IF EXISTS resumen_clientes;' },
          { type: 'scalar_equals', data: { query: 'SELECT COUNT(*) FROM resumen_clientes;', value: 10 }, failQuery: 'DROP TABLE IF EXISTS resumen_clientes;' }
        ] }
    ]
  }
});
