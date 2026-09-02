CURSO.register({
  slug: 'rendimiento',
  section: 'diseno',
  source: 'extra',
  title: 'Tema: Rendimiento y buenas prácticas',
  shortTitle: 'Rendimiento',
  summary: 'Los errores que hacen lenta una consulta y cómo detectarlos.',
  keywords: 'rendimiento performance explain n+1 paginacion keyset covering index analyze select *',
  body: `
<p>Casi todos los problemas de rendimiento en SQL vienen de un puñado de patrones repetidos. Estos son los
más rentables de corregir.</p>

<h1>1. Medir antes de tocar nada</h1>
<p>Empieza siempre por el plan de ejecución (<a href="#/indices">Índices</a>):
<code>EXPLAIN QUERY PLAN</code> en SQLite, <code>EXPLAIN ANALYZE</code> en PostgreSQL y MySQL. Busca los
escaneos completos sobre tablas grandes y los <code>TEMP B-TREE</code> por ordenaciones.</p>

<p>Y actualiza las estadísticas: el planificador decide con ellas. <code>ANALYZE</code> en SQLite y
PostgreSQL, <code>ANALYZE TABLE</code> en MySQL.</p>

<h1>2. El problema N+1</h1>
<p>La aplicación pide la lista de pedidos (1 consulta) y después, en un bucle, el cliente de cada pedido
(N consultas). Con 500 pedidos son 501 viajes de red.</p>
<div class="definition">
    <div class="desc">Solución: una sola consulta con JOIN</div>
    <code class="sql">SELECT p.id, p.fecha, c.nombre
FROM pedidos p
JOIN clientes c ON c.id = p.cliente_id;</code>
</div>
<p>En los ORM esto se resuelve con carga anticipada: <code>includes</code> / <code>joinedload</code> /
<code>with</code> / <code>Include</code>.</p>

<h1>3. Pedir solo lo necesario</h1>
<ul>
  <li><code>SELECT *</code> transfiere columnas que no usas e impide los <em>índices cubrientes</em>.</li>
  <li>Un <strong>índice cubriente</strong> contiene todas las columnas de la consulta, así que el motor
      responde sin tocar la tabla: <code>CREATE INDEX idx ON pedidos(cliente_id, fecha, estado);</code></li>
  <li>Filtra en la base de datos, no en la aplicación: traer 100 000 filas para quedarte con 20 es
      desperdiciar red, memoria y CPU.</li>
</ul>

<h1>4. Paginación por clave, no por OFFSET</h1>
<p><code>LIMIT 20 OFFSET 100000</code> obliga al motor a leer y descartar 100 000 filas. Cuanto más avanzas,
más lento va.</p>
<div class="definition">
    <div class="desc">Paginación por clave (keyset)</div>
    <code class="sql"><i>-- página siguiente: recuerda el último valor visto</i>
SELECT id, fecha, total
FROM pedidos
WHERE (fecha, id) &lt; ('2024-03-05', 1014)   <i>-- último de la página anterior</i>
ORDER BY fecha DESC, id DESC
LIMIT 20;</code>
</div>

<h1>5. Condiciones que anulan los índices</h1>
<p>Repaso rápido de lo visto en <a href="#/indices">Índices</a>: no envuelvas la columna filtrada en una
función, evita <code>LIKE '%algo%'</code>, no hagas aritmética sobre la columna y cuidado con comparar
columnas de tipos distintos (fuerza una conversión implícita en cada fila).</p>

<h1>6. Escrituras por lotes</h1>
<ul>
  <li>Mil <code>INSERT</code> sueltos son mil transacciones. Envuélvelos en una:
      <code>BEGIN; … COMMIT;</code></li>
  <li>Mejor aún, un solo <code>INSERT</code> con varias tuplas
      (<code>VALUES (…), (…), (…)</code>), o la utilidad de carga masiva del motor
      (<code>COPY</code>, <code>LOAD DATA INFILE</code>, <code>.import</code>).</li>
  <li>Para cargas grandes: elimina los índices, carga, y vuelve a crearlos.</li>
</ul>

<h1>7. Agregados y subconsultas</h1>
<ul>
  <li>Filtra con <code>WHERE</code> lo antes posible; usa <code>HAVING</code> solo para condiciones sobre
      el agregado.</li>
  <li><code>EXISTS</code> suele ser más rápido que <code>COUNT(*) &gt; 0</code>: puede parar en cuanto
      encuentra la primera fila.</li>
  <li>Una subconsulta correlacionada que se ejecuta por cada fila casi siempre se puede reescribir como un
      <code>JOIN</code> o una función de ventana.</li>
  <li><code>UNION ALL</code> en lugar de <code>UNION</code> cuando sabes que no hay duplicados: te ahorras
      una ordenación completa.</li>
</ul>

<h1>8. Diseño</h1>
<ul>
  <li>Tipos de datos ajustados: un <code>INTEGER</code> ocupa menos y compara más rápido que un
      <code>VARCHAR</code> con el mismo contenido.</li>
  <li>Indexa las columnas de clave foránea: no se crean solas.</li>
  <li>Particiona las tablas históricas muy grandes por fecha, si tu motor lo soporta.</li>
  <li>Considera desnormalizar solo con una medición delante (<a href="#/normalizacion">Normalización</a>).</li>
</ul>

<div class="callout note">
  <div class="desc">Orden de trabajo recomendado</div>
  <p>1) Encuentra la consulta lenta (registro de consultas lentas o APM). 2) Reprodúcela con datos reales.
  3) Mira el plan. 4) Cambia <em>una</em> cosa. 5) Vuelve a medir. Optimizar a ciegas añade índices que
  nadie usa y ralentiza las escrituras.</p>
</div>

<h1>Ejercicio</h1>
<p>Reescribe consultas problemáticas sobre la base <strong>Tienda online</strong>.</p>
`,
  exercise: {
    dataset: 'tienda',
    tables: ['pedidos', 'clientes', 'detalle_pedido', 'productos'],
    title: 'Ejercicio: optimizar',
    starter: 'EXPLAIN QUERY PLAN\nSELECT * FROM pedidos WHERE strftime(\'%Y\', fecha) = \'2024\';',
    tasks: [
      { text: 'La consulta <code>WHERE strftime(\'%Y\', fecha) = \'2024\'</code> no puede usar un índice. Reescríbela como un <strong>rango de fechas</strong> que devuelva el <code>id</code> y la <code>fecha</code> de los pedidos de 2024',
        hint: 'Compara la columna directamente con dos literales.',
        solution: "SELECT id, fecha\nFROM pedidos\nWHERE fecha >= '2024-01-01' AND fecha < '2025-01-01';",
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Evita el problema N+1: en <strong>una sola consulta</strong>, devuelve el <code>id</code> del pedido, su <code>fecha</code> y el <code>nombre</code> del cliente de todos los pedidos',
        hint: 'Un <code>JOIN</code> entre <code>pedidos</code> y <code>clientes</code>.',
        queryChecks: ['JOIN'],
        solution: 'SELECT p.id, p.fecha, c.nombre\nFROM pedidos p\nJOIN clientes c ON c.id = p.cliente_id;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Crea un índice cubriente llamado <code>idx_pedidos_cubriente</code> sobre <code>(cliente_id, fecha, estado)</code> y comprueba con <code>EXPLAIN QUERY PLAN</code> que la consulta <code>SELECT cliente_id, fecha, estado FROM pedidos WHERE cliente_id = 1</code> lo usa como índice cubriente',
        hint: 'En el plan debe aparecer <code>USING COVERING INDEX</code>.',
        postValidateAction: { resultQuery: 'EXPLAIN QUERY PLAN SELECT cliente_id, fecha, estado FROM pedidos WHERE cliente_id = 1;', message: 'Índice cubriente en uso' },
        solution: 'CREATE INDEX idx_pedidos_cubriente ON pedidos(cliente_id, fecha, estado);',
        checks: [{ type: 'object_exists', data: { type: 'index', name: 'idx_pedidos_cubriente' } }] },
      { text: 'Usa <code>EXISTS</code> en lugar de contar: devuelve el <code>nombre</code> de los clientes que tienen al menos un pedido entregado',
        hint: '<code>EXISTS</code> puede parar en la primera coincidencia; <code>COUNT(*) &gt; 0</code> tiene que contarlas todas.',
        queryChecks: ['EXISTS'],
        solution: "SELECT nombre FROM clientes c\nWHERE EXISTS (SELECT 1 FROM pedidos p\n              WHERE p.cliente_id = c.id AND p.estado = 'entregado');",
        checks: [{ type: 'row_col_val_solution_query', data: null }] }
    ]
  }
});
