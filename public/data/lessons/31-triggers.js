CURSO.register({
  slug: 'triggers',
  section: 'programacion',
  source: 'extra',
  title: 'Tema: Disparadores (TRIGGERS)',
  shortTitle: 'Disparadores (triggers)',
  summary: 'Código que la base ejecuta sola cuando alguien inserta, actualiza o borra.',
  keywords: 'trigger disparador before after instead of old new raise auditoria',
  body: `
<p>Un <strong>disparador</strong> es un bloque de sentencias que la base de datos ejecuta
<em>automáticamente</em> cuando ocurre un evento sobre una tabla. Nadie lo llama: se dispara solo.</p>

<div class="definition">
    <div class="desc">Anatomía de un trigger en SQLite</div>
    <code class="sql">CREATE TRIGGER <i>nombre</i>
<strong>AFTER UPDATE OF precio ON productos</strong>   <i>-- cuándo</i>
FOR EACH ROW
<strong>WHEN OLD.precio &lt;&gt; NEW.precio</strong>          <i>-- condición opcional</i>
BEGIN
    INSERT INTO auditoria_precios (producto_id, precio_ant, precio_nuevo)
    VALUES (OLD.id, OLD.precio, NEW.precio);
END;</code>
</div>

<h1>Las tres decisiones</h1>
<ul>
  <li><strong>Momento</strong>: <code>BEFORE</code> (antes de aplicar el cambio, sirve para validar o
      normalizar), <code>AFTER</code> (después, sirve para auditar o propagar) o <code>INSTEAD OF</code>
      (sustituye a la operación; solo sobre vistas).</li>
  <li><strong>Evento</strong>: <code>INSERT</code>, <code>UPDATE</code> (opcionalmente
      <code>UPDATE OF columna</code>) o <code>DELETE</code>.</li>
  <li><strong>Alcance</strong>: <code>FOR EACH ROW</code> (una vez por fila afectada) o
      <code>FOR EACH STATEMENT</code> (una vez por sentencia; no existe en SQLite ni MySQL).</li>
</ul>

<h1>Las pseudotablas OLD y NEW</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:26%">Evento</td><td><code>OLD</code></td><td><code>NEW</code></td></tr>
    <tr><td><code>INSERT</code></td><td>no disponible</td><td>la fila que entra</td></tr>
    <tr><td><code>UPDATE</code></td><td>la fila antes del cambio</td><td>la fila después</td></tr>
    <tr><td><code>DELETE</code></td><td>la fila que se va</td><td>no disponible</td></tr>
  </table>
</div>

<h1>Para qué se usan</h1>
<ul>
  <li><strong>Auditoría</strong>: registrar quién cambió qué y cuándo.</li>
  <li><strong>Validación compleja</strong>: reglas que un <code>CHECK</code> no puede expresar porque
      necesitan consultar otras tablas.</li>
  <li><strong>Datos derivados</strong>: mantener un contador o un total al día sin recalcularlo.</li>
  <li><strong>Marcas de tiempo</strong>: rellenar <code>actualizado_en</code> en cada <code>UPDATE</code>.</li>
  <li><strong>Vistas escribibles</strong>: con <code>INSTEAD OF</code> sobre una vista.</li>
</ul>

<div class="definition">
    <div class="desc">Rechazar una operación desde un trigger</div>
    <code class="sql">CREATE TRIGGER trg_no_negativos
BEFORE UPDATE OF stock ON productos
FOR EACH ROW
WHEN NEW.stock &lt; 0
BEGIN
    SELECT <strong>RAISE(ABORT, 'El stock no puede ser negativo')</strong>;
END;</code>
</div>

<p><code>RAISE</code> admite <code>ABORT</code> (deshace la sentencia), <code>ROLLBACK</code> (deshace la
transacción entera), <code>FAIL</code> e <code>IGNORE</code>. En PostgreSQL el equivalente es
<code>RAISE EXCEPTION</code>; en MySQL, <code>SIGNAL SQLSTATE '45000'</code>.</p>

<div class="definition">
    <div class="desc">Vista escribible con INSTEAD OF</div>
    <code class="sql">CREATE TRIGGER trg_alta_cliente
INSTEAD OF INSERT ON v_clientes_espana
FOR EACH ROW
BEGIN
    INSERT INTO clientes (nombre, email, ciudad, pais, fecha_alta)
    VALUES (NEW.nombre, NEW.email, NEW.ciudad, 'España', date('now'));
END;</code>
</div>

<div class="callout danger">
  <div class="desc">Úsalos con moderación</div>
  <p>Un trigger es lógica <em>invisible</em>: quien lee el <code>INSERT</code> no ve lo que ocurre después.
  Depurar una cadena de triggers que se llaman entre sí es doloroso, y en tablas con mucha escritura pueden
  hundir el rendimiento. Regla razonable: para auditoría e integridad, sí; para lógica de negocio compleja,
  mejor en la aplicación o en un procedimiento explícito.</p>
</div>

<div class="callout note">
  <div class="desc">Otras sentencias útiles</div>
  <p><code>DROP TRIGGER IF EXISTS nombre;</code> elimina un disparador.
  En SQLite puedes ver los que existen con
  <code>SELECT name, sql FROM sqlite_master WHERE type = 'trigger';</code></p>
</div>

<h1>Ejercicio</h1>
<p>Base <strong>Tienda online</strong>. Escribe cada bloque completo (incluido el <code>END;</code>) antes de
ejecutarlo.</p>
`,
  exercise: {
    dataset: 'tienda',
    tables: ['productos', 'pedidos', 'detalle_pedido'],
    title: 'Ejercicio: disparadores',
    starter: 'SELECT id, nombre, precio, stock FROM productos LIMIT 5;',
    tasks: [
      { text: 'Crea la tabla <code>auditoria_precios</code> con las columnas <code>id</code> (entero, clave primaria), <code>producto_id</code>, <code>precio_ant</code>, <code>precio_nuevo</code> y <code>momento</code> (texto con valor por defecto <code>datetime(\'now\')</code>)',
        hint: "<code>momento TEXT DEFAULT (datetime('now'))</code> — los paréntesis alrededor de la expresión son obligatorios.",
        postValidateAction: { resultQuery: "SELECT sql FROM sqlite_master WHERE name = 'auditoria_precios';", message: 'Tabla de auditoría creada' },
        solution: "CREATE TABLE auditoria_precios (\n    id           INTEGER PRIMARY KEY,\n    producto_id  INTEGER,\n    precio_ant   REAL,\n    precio_nuevo REAL,\n    momento      TEXT DEFAULT (datetime('now'))\n);",
        checks: [{ type: 'assert_query_succeeds', data: 'SELECT id, producto_id, precio_ant, precio_nuevo, momento FROM auditoria_precios;', failQuery: 'DROP TABLE IF EXISTS auditoria_precios;' }] },
      { text: 'Crea un disparador <code>trg_precio_update</code> que, <strong>después</strong> de actualizar la columna <code>precio</code> de <code>productos</code> y solo si el precio ha cambiado de verdad, inserte una fila en <code>auditoria_precios</code> con el id del producto y los precios antiguo y nuevo',
        hint: 'Usa <code>AFTER UPDATE OF precio ON productos FOR EACH ROW WHEN OLD.precio &lt;&gt; NEW.precio</code> y las pseudotablas <code>OLD</code> y <code>NEW</code>.',
        postValidateAction: { resultQuery: "SELECT name FROM sqlite_master WHERE type = 'trigger';", message: 'Disparador creado' },
        solution: 'CREATE TRIGGER trg_precio_update\nAFTER UPDATE OF precio ON productos\nFOR EACH ROW\nWHEN OLD.precio <> NEW.precio\nBEGIN\n    INSERT INTO auditoria_precios (producto_id, precio_ant, precio_nuevo)\n    VALUES (OLD.id, OLD.precio, NEW.precio);\nEND;',
        checks: [{ type: 'object_exists', data: { type: 'trigger', name: 'trg_precio_update' }, failQuery: 'DROP TRIGGER IF EXISTS trg_precio_update;' }] },
      { text: 'Comprueba que funciona: cambia el precio del producto 4 a <code>99.90</code> y el del producto 5 a <code>49.90</code>. Deben aparecer dos filas en <code>auditoria_precios</code>.',
        hint: 'Dos <code>UPDATE</code> seguidos; el disparador se encarga del resto.',
        postValidateAction: { resultQuery: 'SELECT * FROM auditoria_precios;', message: 'El disparador ha registrado los cambios' },
        solution: 'UPDATE productos SET precio = 99.90 WHERE id = 4;\nUPDATE productos SET precio = 49.90 WHERE id = 5;',
        checks: [{ type: 'scalar_equals', data: { query: 'SELECT COUNT(*) FROM auditoria_precios;', value: 2 } }] },
      { text: 'Crea un disparador <code>trg_stock_no_negativo</code> que, <strong>antes</strong> de actualizar el <code>stock</code> de <code>productos</code>, aborte la operación con el mensaje <code>El stock no puede ser negativo</code> cuando el nuevo valor sea menor que 0',
        hint: '<code>BEGIN SELECT RAISE(ABORT, \'…\'); END;</code>',
        queryChecks: ['RAISE'],
        postValidateAction: { resultQuery: "SELECT name FROM sqlite_master WHERE type = 'trigger';", message: 'Disparador de validación creado' },
        solution: "CREATE TRIGGER trg_stock_no_negativo\nBEFORE UPDATE OF stock ON productos\nFOR EACH ROW\nWHEN NEW.stock < 0\nBEGIN\n    SELECT RAISE(ABORT, 'El stock no puede ser negativo');\nEND;",
        checks: [
          { type: 'object_exists', data: { type: 'trigger', name: 'trg_stock_no_negativo' }, failQuery: 'DROP TRIGGER IF EXISTS trg_stock_no_negativo;' },
          { type: 'assert_query_fails', data: 'UPDATE productos SET stock = -5 WHERE id = 4;', failQuery: 'DROP TRIGGER IF EXISTS trg_stock_no_negativo;' }
        ] }
    ]
  }
});
