CURSO.register({
  slug: 'normalizacion',
  section: 'diseno',
  source: 'extra',
  title: 'Tema: Normalización y diseño de esquemas',
  shortTitle: 'Normalización',
  summary: 'Formas normales, claves, cardinalidades y cuándo conviene desnormalizar.',
  keywords: 'normalizacion 1fn 2fn 3fn bcnf forma normal anomalias clave candidata cardinalidad',
  body: `
<p><strong>Normalizar</strong> es organizar las columnas y las tablas de forma que cada dato viva en un solo
sitio. El objetivo no es la elegancia teórica: es evitar tres problemas muy concretos.</p>

<div class="datatable">
  <table class="table">
    <tr><td style="width:26%">Anomalía</td><td>Qué pasa</td></tr>
    <tr><td>De inserción</td><td>No puedes registrar un producto nuevo porque todavía nadie lo ha comprado.</td></tr>
    <tr><td>De actualización</td><td>Cambias el email de un cliente y hay que tocar 400 filas; si fallas una, quedan dos verdades.</td></tr>
    <tr><td>De borrado</td><td>Borras el último pedido de un cliente y pierdes también sus datos de contacto.</td></tr>
  </table>
</div>

<h1>Vocabulario mínimo</h1>
<ul>
  <li><strong>Clave candidata</strong>: conjunto mínimo de columnas que identifica cada fila.</li>
  <li><strong>Clave primaria</strong>: la candidata elegida.</li>
  <li><strong>Atributo no clave</strong>: cualquier columna que no forma parte de una clave candidata.</li>
  <li><strong>Dependencia funcional</strong> (<code>A → B</code>): conocer <code>A</code> determina
      <code>B</code>. «El id de cliente determina su email.»</li>
</ul>

<h1>Primera forma normal (1FN)</h1>
<p>Cada celda contiene <strong>un solo valor atómico</strong> y no hay grupos repetidos.</p>
<div class="datatable">
  <table class="table">
    <tr><td style="width:50%">❌ No está en 1FN</td><td>✅ En 1FN</td></tr>
    <tr><td><code>telefonos = '600111222, 600333444'</code></td><td>Una tabla <code>telefonos(cliente_id, numero)</code></td></tr>
    <tr><td>Columnas <code>producto1</code>, <code>producto2</code>, <code>producto3</code></td><td>Una tabla <code>lineas(pedido_id, producto_id, …)</code></td></tr>
  </table>
</div>

<h1>Segunda forma normal (2FN)</h1>
<p>Está en 1FN <em>y</em> ningún atributo no clave depende solo de <strong>una parte</strong> de una clave
primaria compuesta.</p>
<p>Ejemplo: en <code>detalle_pedido(pedido_id, producto_id, cantidad, nombre_producto)</code>, la columna
<code>nombre_producto</code> depende solo de <code>producto_id</code>, no de la clave completa. Se saca a la
tabla <code>productos</code>.</p>

<h1>Tercera forma normal (3FN)</h1>
<p>Está en 2FN <em>y</em> ningún atributo no clave depende de otro atributo no clave (no hay dependencias
transitivas).</p>
<p>Ejemplo: en <code>pedidos(id, cliente_id, ciudad_cliente, pais_cliente)</code>, la ciudad depende del
cliente, no del pedido. Fuera.</p>

<div class="callout note">
  <div class="desc">La regla nemotécnica</div>
  <p>Cada atributo no clave debe depender <em>de la clave</em> (1FN), <em>de toda la clave</em> (2FN)
  <em>y de nada más que la clave</em> (3FN).</p>
</div>

<h1>BCNF y más allá</h1>
<p><strong>BCNF</strong> (Boyce-Codd) es una 3FN más estricta: <em>toda</em> dependencia funcional debe partir
de una clave candidata. La <strong>4FN</strong> elimina dependencias multivaluadas independientes y la
<strong>5FN</strong> las dependencias de reunión. En la práctica, llegar a 3FN/BCNF cubre el 99 % de los
diseños transaccionales.</p>

<h1>Cardinalidades</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:22%">Relación</td><td>Cómo se implementa</td><td>Ejemplo</td></tr>
    <tr><td>1 a 1</td><td>Clave foránea con <code>UNIQUE</code>, o la misma clave primaria en ambas tablas</td><td>Usuario ↔ perfil ampliado</td></tr>
    <tr><td>1 a N</td><td>Clave foránea en el lado «muchos»</td><td>Cliente → pedidos</td></tr>
    <tr><td>N a M</td><td>Tabla intermedia con clave primaria compuesta</td><td>Pedidos ↔ productos vía <code>detalle_pedido</code></td></tr>
  </table>
</div>

<h1>Desnormalizar (a propósito)</h1>
<p>Normalizar reduce redundancia pero aumenta el número de <code>JOIN</code>. En sistemas de lectura intensiva
—informes, cuadros de mando, almacenes de datos— se desnormaliza <em>conscientemente</em>: se duplica un
nombre, se guarda un total precalculado, se usa un esquema en estrella con tablas de hechos y dimensiones.</p>

<div class="callout danger">
  <div class="desc">La regla de oro</div>
  <p>Normaliza primero; desnormaliza después, solo cuando tengas una medición que lo justifique, y deja
  escrito quién mantiene sincronizado el dato duplicado (un trigger, un proceso por lotes, la aplicación).
  Un total precalculado que nadie actualiza es una mentira que crece.</p>
</div>

<h1>Ejercicio</h1>
<p>Tienes una tabla plana, <code>ventas_planas</code>, con datos de cliente, producto y línea de venta todos
mezclados. Vas a normalizarla en tres tablas.</p>
`,
  exercise: {
    dataset: 'tienda',
    tables: ['ventas_planas'],
    title: 'Ejercicio: normalizar',
    starter: 'SELECT * FROM ventas_planas;',
    preload: {
      ventas: `
CREATE TABLE ventas_planas (
    factura        TEXT,
    fecha          TEXT,
    cliente_nombre TEXT,
    cliente_email  TEXT,
    producto       TEXT,
    categoria      TEXT,
    cantidad       INTEGER,
    precio_unit    REAL
);
INSERT INTO ventas_planas VALUES
 ('F-001','2024-02-03','Ana Ruiz','ana@correo.es','Teclado mecánico K2','Periféricos',1,89.90),
 ('F-001','2024-02-03','Ana Ruiz','ana@correo.es','Ratón ergonómico M5','Periféricos',2,45.50),
 ('F-002','2024-02-11','Marc Oliva','marc@mail.cat','Monitor 27" 4K','Monitores',1,489.00),
 ('F-003','2024-03-02','Ana Ruiz','ana@correo.es','SSD 1 TB NVMe','Almacenamiento',3,94.00),
 ('F-004','2024-03-19','Elena Vidal','elena@empresa.es','Teclado mecánico K2','Periféricos',1,89.90),
 ('F-004','2024-03-19','Elena Vidal','elena@empresa.es','Monitor 27" 4K','Monitores',2,489.00),
 ('F-005','2024-04-07','Marc Oliva','marc@mail.cat','SSD 1 TB NVMe','Almacenamiento',1,94.00);`
    },
    tasks: [
      { text: 'Crea la tabla <code>clientes_norm</code> (<code>id</code> entero clave primaria autoincremental, <code>nombre</code> de texto obligatorio, <code>email</code> de texto obligatorio y único) y rellénala con los clientes <strong>distintos</strong> de <code>ventas_planas</code>',
        hint: 'Dos sentencias: el <code>CREATE TABLE</code> y un <code>INSERT INTO … SELECT DISTINCT …</code>.',
        postValidateAction: { resultQuery: 'SELECT * FROM clientes_norm;', message: 'Clientes normalizados' },
        solution: 'CREATE TABLE clientes_norm (\n    id     INTEGER PRIMARY KEY AUTOINCREMENT,\n    nombre TEXT NOT NULL,\n    email  TEXT NOT NULL UNIQUE\n);\n\nINSERT INTO clientes_norm (nombre, email)\nSELECT DISTINCT cliente_nombre, cliente_email FROM ventas_planas;',
        checks: [
          { type: 'scalar_equals', data: { query: 'SELECT COUNT(*) FROM clientes_norm;', value: 3 }, failQuery: 'DROP TABLE IF EXISTS clientes_norm;' },
          { type: 'assert_query_succeeds', data: 'SELECT id, nombre, email FROM clientes_norm;', failQuery: 'DROP TABLE IF EXISTS clientes_norm;' }
        ] },
      { text: 'Crea la tabla <code>productos_norm</code> (<code>id</code> autoincremental, <code>nombre</code> obligatorio y único, <code>categoria</code> obligatoria) y rellénala con los productos distintos',
        postValidateAction: { resultQuery: 'SELECT * FROM productos_norm;', message: 'Productos normalizados' },
        solution: 'CREATE TABLE productos_norm (\n    id        INTEGER PRIMARY KEY AUTOINCREMENT,\n    nombre    TEXT NOT NULL UNIQUE,\n    categoria TEXT NOT NULL\n);\n\nINSERT INTO productos_norm (nombre, categoria)\nSELECT DISTINCT producto, categoria FROM ventas_planas;',
        checks: [
          { type: 'scalar_equals', data: { query: 'SELECT COUNT(*) FROM productos_norm;', value: 4 }, failQuery: 'DROP TABLE IF EXISTS productos_norm;' },
          { type: 'assert_query_succeeds', data: 'SELECT id, nombre, categoria FROM productos_norm;', failQuery: 'DROP TABLE IF EXISTS productos_norm;' }
        ] },
      { text: 'Crea la tabla <code>lineas_norm</code> con <code>factura</code>, <code>cliente_id</code>, <code>producto_id</code>, <code>cantidad</code> y <code>precio_unit</code>, con clave primaria <code>(factura, producto_id)</code> y claves foráneas a las dos tablas anteriores; después rellénala uniendo <code>ventas_planas</code> con ellas',
        hint: 'En el <code>INSERT … SELECT</code>, une por <code>email</code> y por <code>nombre</code> de producto para traducir los textos a identificadores.',
        postValidateAction: { resultQuery: 'SELECT * FROM lineas_norm;', message: 'Líneas normalizadas' },
        solution: 'CREATE TABLE lineas_norm (\n    factura     TEXT    NOT NULL,\n    cliente_id  INTEGER NOT NULL REFERENCES clientes_norm(id),\n    producto_id INTEGER NOT NULL REFERENCES productos_norm(id),\n    cantidad    INTEGER NOT NULL,\n    precio_unit REAL    NOT NULL,\n    PRIMARY KEY (factura, producto_id)\n);\n\nINSERT INTO lineas_norm\nSELECT v.factura, c.id, p.id, v.cantidad, v.precio_unit\nFROM ventas_planas v\nJOIN clientes_norm  c ON c.email  = v.cliente_email\nJOIN productos_norm p ON p.nombre = v.producto;',
        checks: [
          { type: 'scalar_equals', data: { query: 'SELECT COUNT(*) FROM lineas_norm;', value: 7 }, failQuery: 'DROP TABLE IF EXISTS lineas_norm;' },
          { type: 'scalar_equals', data: { query: 'SELECT ROUND(SUM(cantidad * precio_unit), 2) FROM lineas_norm;', value: 2113.8 }, failQuery: 'DROP TABLE IF EXISTS lineas_norm;' }
        ] },
      { text: 'Comprueba el resultado: reconstruye la vista original consultando las tres tablas nuevas y devolviendo <code>factura</code>, nombre del cliente, nombre del producto y <code>cantidad</code>, ordenado por factura y producto',
        solution: 'SELECT l.factura, c.nombre AS cliente, p.nombre AS producto, l.cantidad\nFROM lineas_norm l\nJOIN clientes_norm  c ON c.id = l.cliente_id\nJOIN productos_norm p ON p.id = l.producto_id\nORDER BY l.factura, p.nombre;',
        checks: [{ type: 'row_col_val_solution_query_ordered', data: null }] }
    ]
  }
});
