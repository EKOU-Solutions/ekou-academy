CURSO.register({
  slug: 'cursores-errores',
  section: 'programacion',
  source: 'extra',
  title: 'Tema: Cursores y manejo de errores',
  shortTitle: 'Cursores y errores',
  summary: 'Recorrer filas una a una (y por qué casi siempre hay algo mejor), y capturar excepciones.',
  keywords: 'cursor declare fetch open close exception handler try catch raise signal upsert merge',
  body: `
<p>Dentro de un procedimiento a veces necesitas recorrer un conjunto de filas y hacer algo con cada una. Esa
herramienta se llama <strong>cursor</strong>. Y el corolario inmediato es que necesitarás también capturar
errores cuando algo falle a mitad del recorrido.</p>

<h1>Cursores: el patrón general</h1>
<p>Siempre son los mismos cinco pasos: <strong>declarar</strong>, <strong>abrir</strong>,
<strong>leer</strong> en bucle, detectar el <strong>final</strong> y <strong>cerrar</strong>.</p>

<div class="definition">
    <div class="desc">Cursor en MySQL</div>
    <code class="sql">DELIMITER $$
CREATE PROCEDURE sp_recalcular_totales()
BEGIN
    DECLARE v_fin      INT DEFAULT 0;
    DECLARE v_pedido   INT;
    DECLARE v_total    DECIMAL(10,2);

    <strong>DECLARE cur CURSOR FOR</strong>
        SELECT id FROM pedidos WHERE estado = 'pendiente';

    <strong>DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_fin = 1;</strong>

    <strong>OPEN cur;</strong>
    bucle: LOOP
        <strong>FETCH cur INTO v_pedido;</strong>
        IF v_fin = 1 THEN LEAVE bucle; END IF;

        SELECT SUM(cantidad * precio_unit) INTO v_total
          FROM detalle_pedido WHERE pedido_id = v_pedido;

        UPDATE pedidos SET total = v_total WHERE id = v_pedido;
    END LOOP;
    <strong>CLOSE cur;</strong>
END$$
DELIMITER ;</code>
</div>

<div class="definition">
    <div class="desc">El mismo recorrido en PL/pgSQL (bucle FOR implícito)</div>
    <code class="sql">FOR fila IN SELECT id FROM pedidos WHERE estado = 'pendiente' LOOP
    UPDATE pedidos
       SET total = (SELECT SUM(cantidad * precio_unit)
                      FROM detalle_pedido WHERE pedido_id = fila.id)
     WHERE id = fila.id;
END LOOP;</code>
</div>

<div class="datatable">
  <table class="table">
    <tr><td style="width:22%">Motor</td><td>Sintaxis del cursor</td></tr>
    <tr><td>MySQL</td><td><code>DECLARE cur CURSOR FOR …</code> + <code>CONTINUE HANDLER FOR NOT FOUND</code></td></tr>
    <tr><td>PostgreSQL</td><td><code>DECLARE cur CURSOR FOR …</code>, o el bucle <code>FOR … IN SELECT</code></td></tr>
    <tr><td>SQL Server</td><td><code>DECLARE cur CURSOR FOR …</code> + <code>WHILE @@FETCH_STATUS = 0</code></td></tr>
    <tr><td>Oracle</td><td>Cursores explícitos, o <code>FOR fila IN (SELECT …) LOOP</code></td></tr>
    <tr><td>SQLite</td><td>No existen: se recorre desde el lenguaje anfitrión iterando el resultado.</td></tr>
  </table>
</div>

<div class="callout danger">
  <div class="desc">Antes de escribir un cursor, para y piensa</div>
  <p>Un cursor sobre 100 000 filas hace 100 000 idas y vueltas dentro del motor. La misma tarea expresada en
  <strong>una sola sentencia</strong> se resuelve en un recorrido. El ejemplo de arriba se escribe así:</p>
  <p><code class="sql">UPDATE pedidos
   SET total = (SELECT SUM(cantidad * precio_unit)
                  FROM detalle_pedido d WHERE d.pedido_id = pedidos.id)
 WHERE estado = 'pendiente';</code></p>
  <p>Un cursor solo se justifica cuando cada fila necesita una acción que <em>no</em> es SQL: llamar a un
  servicio externo, generar un archivo, enviar un correo, o procesar por lotes para no bloquear la tabla.</p>
</div>

<h1>Alternativas basadas en conjuntos</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:34%">En vez de un bucle que…</td><td>Usa</td></tr>
    <tr><td>…actualiza fila a fila</td><td><code>UPDATE … FROM</code> / <code>UPDATE</code> con subconsulta correlacionada</td></tr>
    <tr><td>…inserta si no existe y si no actualiza</td><td><code>INSERT … ON CONFLICT DO UPDATE</code> (SQLite/PostgreSQL), <code>INSERT … ON DUPLICATE KEY UPDATE</code> (MySQL), <code>MERGE</code> (estándar, SQL Server, Oracle)</td></tr>
    <tr><td>…acumula un total corriente</td><td>Funciones de ventana: <code>SUM(x) OVER (ORDER BY …)</code></td></tr>
    <tr><td>…recorre una jerarquía</td><td><code>WITH RECURSIVE</code></td></tr>
    <tr><td>…copia filas de una tabla a otra</td><td><code>INSERT INTO destino SELECT … FROM origen</code></td></tr>
  </table>
</div>

<h1>Manejo de errores</h1>
<div class="definition">
    <div class="desc">PostgreSQL: bloque EXCEPTION</div>
    <code class="sql">BEGIN
    UPDATE cuentas SET saldo = saldo - 100 WHERE id = 1;
    INSERT INTO movimientos (cuenta_id, importe) VALUES (1, -100);
EXCEPTION
    WHEN <strong>unique_violation</strong> THEN
        RAISE NOTICE 'Movimiento duplicado, se ignora';
    WHEN <strong>OTHERS</strong> THEN
        RAISE EXCEPTION 'Fallo inesperado: %', SQLERRM;
END;</code>
</div>

<div class="definition">
    <div class="desc">SQL Server: TRY … CATCH</div>
    <code class="sql">BEGIN TRY
    BEGIN TRANSACTION;
        UPDATE cuentas SET saldo = saldo - 100 WHERE id = 1;
        UPDATE cuentas SET saldo = saldo + 100 WHERE id = 2;
    COMMIT;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT &gt; 0 ROLLBACK;
    THROW;   <i>-- vuelve a lanzar el error al llamante</i>
END CATCH;</code>
</div>

<div class="definition">
    <div class="desc">MySQL: handlers y SIGNAL</div>
    <code class="sql">DECLARE EXIT HANDLER FOR SQLEXCEPTION
BEGIN
    ROLLBACK;
    SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No se pudo completar la operación';
END;</code>
</div>

<h1>Cómo maneja SQLite los conflictos</h1>
<p>SQLite no tiene bloques de excepción, pero sí una cláusula <code>ON CONFLICT</code> por sentencia que
decide qué hacer cuando se viola una restricción:</p>

<div class="definition">
    <div class="desc">Cláusulas de resolución</div>
    <code class="sql">INSERT <strong>OR IGNORE</strong>  INTO clientes (id, nombre) VALUES (1, 'Duplicado');
INSERT <strong>OR REPLACE</strong> INTO clientes (id, nombre) VALUES (1, 'Reemplaza');

<i>-- UPSERT explícito (SQLite 3.24+, igual que PostgreSQL)</i>
INSERT INTO clientes (id, nombre, email)
VALUES (1, 'Lucía Ferrer', 'nuevo@correo.es')
<strong>ON CONFLICT(id) DO UPDATE SET email = excluded.email</strong>;</code>
</div>

<p>Las opciones son <code>ROLLBACK</code>, <code>ABORT</code> (por defecto), <code>FAIL</code>,
<code>IGNORE</code> y <code>REPLACE</code>.</p>

<h1>Ejercicio</h1>
<p>Base <strong>Tienda online</strong>. Vas a reescribir en conjuntos lo que un cursor haría fila a fila, y a
practicar el <em>upsert</em>.</p>
`,
  exercise: {
    dataset: 'tienda',
    tables: ['pedidos', 'detalle_pedido', 'clientes', 'productos'],
    title: 'Ejercicio: sin cursores',
    starter: 'SELECT * FROM pedidos LIMIT 5;',
    tasks: [
      { text: 'Añade a <code>pedidos</code> una columna <code>total</code> de tipo <code>REAL</code>',
        postValidateAction: { resultQuery: 'SELECT id, estado, total FROM pedidos LIMIT 5;', message: 'Columna añadida' },
        solution: 'ALTER TABLE pedidos ADD COLUMN total REAL;',
        checks: [{ type: 'assert_query_succeeds', data: 'SELECT total FROM pedidos;' }] },
      { text: 'Sin ningún bucle: con <strong>una sola sentencia</strong> <code>UPDATE</code>, rellena la columna <code>total</code> de cada pedido con la suma de <code>cantidad * precio_unit</code> de sus líneas, redondeada a 2 decimales',
        hint: 'Una subconsulta correlacionada dentro del <code>SET</code>: <code>SET total = (SELECT … WHERE d.pedido_id = pedidos.id)</code>.',
        postValidateAction: { resultQuery: 'SELECT id, total FROM pedidos ORDER BY total DESC;', message: 'Totales recalculados de una sola pasada' },
        solution: 'UPDATE pedidos\n   SET total = (SELECT ROUND(SUM(d.cantidad * d.precio_unit), 2)\n                  FROM detalle_pedido d\n                 WHERE d.pedido_id = pedidos.id);',
        checks: [
          { type: 'scalar_equals', data: { query: 'SELECT COUNT(*) FROM pedidos WHERE total IS NULL;', value: 0 } },
          { type: 'scalar_equals', data: { query: 'SELECT ROUND(total, 2) FROM pedidos WHERE id = 1001;', value: 1288.9 } }
        ] },
      { text: 'Practica el <em>upsert</em>: inserta el cliente con <code>id = 1</code> y correo <code>lucia@nuevo.es</code>; si ese id ya existe, en lugar de fallar debe <strong>actualizar</strong> su email',
        hint: '<code>INSERT INTO … VALUES … ON CONFLICT(id) DO UPDATE SET email = excluded.email;</code>',
        queryChecks: ['ON CONFLICT'],
        postValidateAction: { resultQuery: 'SELECT id, nombre, email FROM clientes WHERE id = 1;', message: 'Upsert aplicado' },
        solution: "INSERT INTO clientes (id, nombre, email, ciudad, pais, fecha_alta, vip)\nVALUES (1, 'Lucía Ferrer', 'lucia@nuevo.es', 'Valencia', 'España', '2021-03-14', 1)\nON CONFLICT(id) DO UPDATE SET email = excluded.email;",
        checks: [
          { type: 'scalar_equals', data: { query: 'SELECT email FROM clientes WHERE id = 1;', value: 'lucia@nuevo.es' } },
          { type: 'scalar_equals', data: { query: 'SELECT COUNT(*) FROM clientes;', value: 10 } }
        ] },
      { text: 'Comprueba <code>INSERT OR IGNORE</code>: intenta insertar de nuevo un cliente con <code>id = 1</code> de forma que la sentencia <strong>no</strong> falle y <strong>no</strong> cambie nada',
        hint: '<code>INSERT OR IGNORE INTO clientes (id, nombre, fecha_alta) VALUES (1, \'Otro\', \'2025-01-01\');</code>',
        queryChecks: ['OR IGNORE'],
        postValidateAction: { resultQuery: 'SELECT id, nombre FROM clientes WHERE id = 1;', message: 'La fila duplicada se ha ignorado sin error' },
        solution: "INSERT OR IGNORE INTO clientes (id, nombre, fecha_alta)\nVALUES (1, 'Otro nombre', '2025-01-01');",
        checks: [
          { type: 'scalar_equals', data: { query: 'SELECT nombre FROM clientes WHERE id = 1;', value: 'Lucía Ferrer' } },
          { type: 'scalar_equals', data: { query: 'SELECT COUNT(*) FROM clientes;', value: 10 } }
        ] }
    ]
  }
});
