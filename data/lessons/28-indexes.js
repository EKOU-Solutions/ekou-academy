CURSO.register({
  slug: 'indices',
  section: 'objetos',
  source: 'extra',
  title: 'Tema: Índices y planes de ejecución',
  shortTitle: 'Índices',
  summary: 'Por qué una consulta tarda 2 ms o 2 segundos, y cómo leer el plan.',
  keywords: 'indice index create index explain query plan b-tree covering unique sargable',
  body: `
<p>Un <strong>índice</strong> es una estructura auxiliar (casi siempre un árbol B) que el motor mantiene
ordenada por los valores de una o varias columnas. Sirve para lo mismo que el índice alfabético de un libro:
encontrar filas sin leerlas todas.</p>

<div class="definition">
    <div class="desc">Crear y eliminar índices</div>
    <code class="sql">CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);

<i>-- índice compuesto: el orden de las columnas importa</i>
CREATE INDEX idx_pedidos_cli_fecha ON pedidos(cliente_id, fecha);

<i>-- índice único: además impone unicidad</i>
CREATE UNIQUE INDEX idx_clientes_email ON clientes(email);

<i>-- índice parcial: solo indexa parte de las filas</i>
CREATE INDEX idx_pedidos_abiertos ON pedidos(fecha)
    WHERE estado IN ('pendiente', 'enviado');

DROP INDEX idx_pedidos_cliente;</code>
</div>

<h1>Lo que un índice te cuesta</h1>
<p>No es gratis. Cada índice:</p>
<ul>
  <li>ocupa espacio en disco;</li>
  <li>ralentiza <code>INSERT</code>, <code>UPDATE</code> y <code>DELETE</code>, porque hay que mantenerlo;</li>
  <li>puede no usarse nunca si nadie filtra por esas columnas.</li>
</ul>
<p>La regla práctica: indexa las columnas por las que filtras (<code>WHERE</code>), por las que unes
(<code>JOIN … ON</code>) y por las que ordenas (<code>ORDER BY</code>) en las consultas que <em>de verdad</em>
son frecuentes o lentas.</p>

<h1>La regla del prefijo izquierdo</h1>
<p>Un índice sobre <code>(cliente_id, fecha)</code> sirve para filtrar por <code>cliente_id</code>, y para
filtrar por <code>cliente_id</code> <em>y</em> <code>fecha</code>. <strong>No</strong> sirve para filtrar
solo por <code>fecha</code>: es como buscar en una guía telefónica por el nombre de pila.</p>

<h1>Consultas «sargables»</h1>
<p>Un índice solo se usa si la condición se puede traducir a una búsqueda en el árbol. Estas condiciones
<strong>inutilizan</strong> el índice:</p>

<div class="datatable">
  <table class="table">
    <tr><td style="width:48%">No usa índice</td><td>Alternativa que sí lo usa</td></tr>
    <tr><td><code>WHERE strftime('%Y', fecha) = '2024'</code></td><td><code>WHERE fecha &gt;= '2024-01-01' AND fecha &lt; '2025-01-01'</code></td></tr>
    <tr><td><code>WHERE UPPER(email) = 'A@B.COM'</code></td><td>Índice sobre la expresión, o guardar el email ya normalizado</td></tr>
    <tr><td><code>WHERE nombre LIKE '%SSD%'</code></td><td><code>LIKE 'SSD%'</code> (sin comodín inicial) o un índice de texto completo</td></tr>
    <tr><td><code>WHERE precio * 1.21 &gt; 100</code></td><td><code>WHERE precio &gt; 100 / 1.21</code></td></tr>
  </table>
</div>

<h1>Leer el plan de ejecución</h1>
<p>Todos los motores permiten preguntar «¿cómo piensas resolver esta consulta?» antes de ejecutarla:</p>

<div class="datatable">
  <table class="table">
    <tr><td style="width:26%">Motor</td><td>Sentencia</td></tr>
    <tr><td>SQLite</td><td><code>EXPLAIN QUERY PLAN SELECT …</code></td></tr>
    <tr><td>PostgreSQL</td><td><code>EXPLAIN ANALYZE SELECT …</code></td></tr>
    <tr><td>MySQL</td><td><code>EXPLAIN</code> / <code>EXPLAIN ANALYZE</code></td></tr>
    <tr><td>SQL Server</td><td><code>SET SHOWPLAN_ALL ON</code> o el plan gráfico</td></tr>
    <tr><td>Oracle</td><td><code>EXPLAIN PLAN FOR …</code> + <code>DBMS_XPLAN.DISPLAY</code></td></tr>
  </table>
</div>

<p>En SQLite lo importante es la primera palabra de cada línea:</p>
<ul>
  <li><code>SCAN tabla</code> → recorre la tabla entera. Aceptable en tablas pequeñas, sospechoso en grandes.</li>
  <li><code>SEARCH tabla USING INDEX idx (col=?)</code> → está usando un índice. 👍</li>
  <li><code>USE TEMP B-TREE FOR ORDER BY</code> → está ordenando en memoria porque ningún índice da ese orden.</li>
</ul>

<div class="callout note">
  <div class="desc">Índices que ya existen sin pedirlos</div>
  <p><code>PRIMARY KEY</code> y <code>UNIQUE</code> crean un índice automáticamente. Las claves foráneas
  <strong>no</strong>: en la mayoría de motores conviene indexar a mano la columna que referencia, o cada
  borrado en la tabla padre provocará un escaneo completo de la hija.</p>
</div>

<h1>Ejercicio</h1>
<p>Base <strong>Tienda online</strong>. Fíjate en cómo cambia el plan antes y después de crear el
índice.</p>
`,
  exercise: {
    dataset: 'tienda',
    tables: ['pedidos', 'productos', 'clientes'],
    title: 'Ejercicio: índices',
    starter: 'EXPLAIN QUERY PLAN\nSELECT * FROM pedidos WHERE cliente_id = 1 ORDER BY fecha;',
    tasks: [
      { text: 'Crea un índice llamado <code>idx_pedidos_cliente_fecha</code> sobre las columnas <code>cliente_id</code> y <code>fecha</code> de la tabla <code>pedidos</code>',
        hint: '<code>CREATE INDEX nombre ON tabla(col1, col2);</code>',
        postValidateAction: { resultQuery: "SELECT name, sql FROM sqlite_master WHERE type='index' AND name NOT LIKE 'sqlite_%';", message: 'Índice creado' },
        solution: 'CREATE INDEX idx_pedidos_cliente_fecha ON pedidos(cliente_id, fecha);',
        checks: [{ type: 'object_exists', data: { type: 'index', name: 'idx_pedidos_cliente_fecha' } }] },
      { text: 'Comprueba con <code>EXPLAIN QUERY PLAN</code> que la consulta <code>SELECT * FROM pedidos WHERE cliente_id = 1 ORDER BY fecha</code> ya usa el índice',
        hint: 'Escribe <code>EXPLAIN QUERY PLAN</code> delante de la consulta. Debe aparecer <code>SEARCH … USING INDEX</code>.',
        queryChecks: ['EXPLAIN QUERY PLAN'],
        solution: 'EXPLAIN QUERY PLAN\nSELECT * FROM pedidos WHERE cliente_id = 1 ORDER BY fecha;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Crea un índice <strong>parcial</strong> llamado <code>idx_pedidos_abiertos</code> sobre <code>fecha</code>, que solo incluya los pedidos cuyo estado sea <code>pendiente</code> o <code>enviado</code>',
        hint: 'Añade una cláusula <code>WHERE</code> al final del <code>CREATE INDEX</code>.',
        postValidateAction: { resultQuery: "SELECT name, sql FROM sqlite_master WHERE type='index' AND name NOT LIKE 'sqlite_%';", message: 'Índice parcial creado' },
        queryChecks: ['WHERE'],
        solution: "CREATE INDEX idx_pedidos_abiertos ON pedidos(fecha)\nWHERE estado IN ('pendiente', 'enviado');",
        checks: [{ type: 'object_exists', data: { type: 'index', name: 'idx_pedidos_abiertos' } }] },
      { text: 'Elimina el índice <code>idx_pedidos_abiertos</code>',
        postValidateAction: { message: 'Índice eliminado' },
        solution: 'DROP INDEX idx_pedidos_abiertos;',
        checks: [{ type: 'scalar_equals', data: { query: "SELECT COUNT(*) FROM sqlite_master WHERE type='index' AND name='idx_pedidos_abiertos';", value: 0 } }] }
    ]
  }
});
