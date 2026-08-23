CURSO.register({
  slug: 'restricciones-claves',
  section: 'objetos',
  source: 'extra',
  title: 'Tema: Restricciones e integridad referencial',
  shortTitle: 'Restricciones y claves',
  summary: 'PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, CHECK y las acciones ON DELETE.',
  keywords: 'primary key foreign key unique not null check default integridad referencial cascade',
  body: `
<p>Las restricciones son reglas que la base de datos aplica <em>siempre</em>, venga el dato de donde venga.
Es la diferencia entre validar en la aplicación (que se puede saltar) y validar en la base (que no).</p>

<h1>Restricciones de columna</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:26%">Restricción</td><td>Garantiza</td></tr>
    <tr><td><code>NOT NULL</code></td><td>La columna nunca queda vacía.</td></tr>
    <tr><td><code>DEFAULT valor</code></td><td>Valor que se usa si el <code>INSERT</code> no lo indica. Puede ser una expresión: <code>DEFAULT (date('now'))</code>.</td></tr>
    <tr><td><code>UNIQUE</code></td><td>No hay dos filas con el mismo valor. Ojo: varios <code>NULL</code> sí se permiten en la mayoría de motores, porque <code>NULL ≠ NULL</code>.</td></tr>
    <tr><td><code>CHECK (expr)</code></td><td>La expresión debe ser cierta para cada fila: <code>CHECK (precio &gt;= 0)</code>, <code>CHECK (estado IN ('a','b'))</code>.</td></tr>
    <tr><td><code>PRIMARY KEY</code></td><td>Identifica cada fila de forma única. Implica <code>UNIQUE</code> + <code>NOT NULL</code> y crea un índice.</td></tr>
    <tr><td><code>REFERENCES otra(col)</code></td><td>Clave foránea: el valor debe existir en la tabla referenciada.</td></tr>
  </table>
</div>

<h1>Claves primarias</h1>
<p>Puede ser <strong>natural</strong> (el DNI, el ISBN, el código de producto) o <strong>sustituta</strong>
(un entero autoincremental sin significado). Las sustitutas son las más habituales porque son cortas,
estables y nunca cambian aunque cambien los datos del negocio.</p>

<p>Una clave primaria puede ser <strong>compuesta</strong>, formada por varias columnas — típico en las
tablas de relación:</p>

<div class="definition">
    <div class="desc">Clave primaria compuesta</div>
    <code class="sql">CREATE TABLE detalle_pedido (
    pedido_id   INTEGER NOT NULL REFERENCES pedidos(id),
    producto_id INTEGER NOT NULL REFERENCES productos(id),
    cantidad    INTEGER NOT NULL CHECK (cantidad &gt; 0),
    precio_unit REAL    NOT NULL,
    <strong>PRIMARY KEY (pedido_id, producto_id)</strong>
);</code>
</div>

<h1>Claves foráneas e integridad referencial</h1>
<p>Una clave foránea impide que existan «filas huérfanas»: no puedes tener una línea de pedido que apunte a
un producto que no existe. También decide qué pasa cuando se borra o se modifica la fila padre:</p>

<div class="datatable">
  <table class="table">
    <tr><td style="width:30%">Acción</td><td>Al borrar/modificar el padre…</td></tr>
    <tr><td><code>ON DELETE RESTRICT</code> / <code>NO ACTION</code></td><td>…se impide la operación si hay hijos. Es el comportamiento por defecto.</td></tr>
    <tr><td><code>ON DELETE CASCADE</code></td><td>…se borran también los hijos. Potente y peligroso: úsalo solo cuando el hijo no tiene sentido sin el padre (líneas de un pedido, sí; pedidos de un cliente, casi nunca).</td></tr>
    <tr><td><code>ON DELETE SET NULL</code></td><td>…la columna del hijo pasa a <code>NULL</code>. Requiere que admita nulos.</td></tr>
    <tr><td><code>ON DELETE SET DEFAULT</code></td><td>…la columna del hijo toma su valor por defecto.</td></tr>
    <tr><td><code>ON UPDATE …</code></td><td>Las mismas opciones, para cuando cambia la clave del padre.</td></tr>
  </table>
</div>

<div class="definition">
    <div class="desc">Clave foránea con acción en cascada</div>
    <code class="sql">CREATE TABLE lineas (
    id        INTEGER PRIMARY KEY,
    pedido_id INTEGER NOT NULL
              REFERENCES pedidos(id) <strong>ON DELETE CASCADE ON UPDATE CASCADE</strong>
);</code>
</div>

<div class="callout sqlite">
  <div class="desc">SQLite no comprueba las claves foráneas por defecto</div>
  <p>Hay que activarlas <em>en cada conexión</em> con <code>PRAGMA foreign_keys = ON;</code>. En este curso
  ya viene activado en la base «Tienda online», por eso los ejercicios de abajo fallan como deben.</p>
</div>

<h1>Añadir restricciones a una tabla que ya existe</h1>
<p>En PostgreSQL, MySQL y SQL Server se usa
<code>ALTER TABLE t ADD CONSTRAINT nombre CHECK (…)</code> o <code>… ADD FOREIGN KEY …</code>. En SQLite no
se puede: hay que crear una tabla nueva con las restricciones, copiar los datos y renombrar.</p>

<h1>Ejercicio</h1>
<p>Base <strong>Tienda online</strong>, con las claves foráneas activadas. Algunas tareas te piden ejecutar
sentencias que <strong>deben fallar</strong>: eso es exactamente lo que se comprueba.</p>
`,
  exercise: {
    dataset: 'tienda',
    tables: ['clientes', 'pedidos', 'productos', 'detalle_pedido'],
    title: 'Ejercicio: restricciones',
    starter: 'SELECT * FROM productos;',
    tasks: [
      { text: 'Crea una tabla <code>proveedores</code> con: <code>id</code> entero clave primaria autoincremental; <code>nombre</code> de texto obligatorio y único; <code>pais</code> de texto obligatorio con valor por defecto <code>España</code>; y <code>rating</code> real que solo admita valores entre 0 y 5',
        hint: 'Necesitas <code>PRIMARY KEY AUTOINCREMENT</code>, <code>NOT NULL UNIQUE</code>, <code>DEFAULT</code> y <code>CHECK (rating BETWEEN 0 AND 5)</code>.',
        postValidateAction: { resultQuery: "SELECT sql FROM sqlite_master WHERE name='proveedores';", message: 'Tabla creada' },
        solution: "CREATE TABLE proveedores (\n    id     INTEGER PRIMARY KEY AUTOINCREMENT,\n    nombre TEXT NOT NULL UNIQUE,\n    pais   TEXT NOT NULL DEFAULT 'España',\n    rating REAL CHECK (rating BETWEEN 0 AND 5)\n);",
        checks: [
          { type: 'assert_query_succeeds', data: "INSERT INTO proveedores (nombre, rating) VALUES ('__test__', 4.0);", failQuery: 'DROP TABLE IF EXISTS proveedores;' },
          { type: 'assert_query_fails', data: "INSERT INTO proveedores (nombre, rating) VALUES ('__test2__', 9.0);", failQuery: 'DROP TABLE IF EXISTS proveedores;' },
          { type: 'assert_query_fails', data: "INSERT INTO proveedores (nombre) VALUES ('__test__');", failQuery: 'DROP TABLE IF EXISTS proveedores;' },
          { type: 'assert_query_succeeds', data: "SELECT pais FROM proveedores WHERE nombre = '__test__' AND pais = 'España';", failQuery: 'DROP TABLE IF EXISTS proveedores;' },
          { type: 'assert_query_succeeds', data: "DELETE FROM proveedores WHERE nombre LIKE '\\_\\_test%' ESCAPE '\\';" }
        ] },
      { text: 'Inserta el proveedor <code>Nimbus GmbH</code>, de <code>Alemania</code>, con un <code>rating</code> de <code>4.1</code>',
        postValidateAction: { resultQuery: 'SELECT * FROM proveedores;', message: 'Proveedor insertado' },
        solution: "INSERT INTO proveedores (nombre, pais, rating) VALUES ('Nimbus GmbH', 'Alemania', 4.1);",
        checks: [{ type: 'row_exists_contain_col_val', data: { table: 'proveedores', column: 'nombre', value: 'Nimbus GmbH', ignoreCase: true } }] },
      { text: 'Comprueba la integridad referencial: intenta insertar en <code>pedidos</code> una fila con <code>cliente_id = 999</code> (un cliente que no existe). La sentencia <strong>debe fallar</strong>.',
        hint: "Por ejemplo <code>INSERT INTO pedidos (id, cliente_id, fecha) VALUES (9999, 999, '2024-01-01');</code>",
        expectsError: true,
        queryChecks: ['INSERT INTO pedidos', '999'],
        postValidateAction: { message: 'La clave foránea ha hecho su trabajo' },
        solution: "INSERT INTO pedidos (id, cliente_id, fecha) VALUES (9999, 999, '2024-01-01');",
        checks: [{ type: 'scalar_equals', data: { query: 'SELECT COUNT(*) FROM pedidos WHERE cliente_id = 999;', value: 0 } }] },
      { text: 'Comprueba la restricción <code>CHECK</code> de <code>detalle_pedido</code>: intenta insertar una línea con <code>cantidad = 0</code>. También debe fallar.',
        hint: '<code>INSERT INTO detalle_pedido VALUES (1001, 13, 0, 94.0);</code>',
        expectsError: true,
        queryChecks: ['INSERT INTO detalle_pedido'],
        postValidateAction: { message: 'El CHECK ha rechazado la fila' },
        solution: 'INSERT INTO detalle_pedido VALUES (1001, 13, 0, 94.0);',
        checks: [{ type: 'scalar_equals', data: { query: 'SELECT COUNT(*) FROM detalle_pedido WHERE cantidad <= 0;', value: 0 } }] }
    ]
  }
});
