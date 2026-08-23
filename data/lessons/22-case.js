CURSO.register({
  slug: 'case-condicionales',
  section: 'intermedio',
  source: 'extra',
  title: 'Tema: Expresiones condicionales (CASE, COALESCE, NULLIF)',
  shortTitle: 'CASE y condicionales',
  summary: 'Lógica if/else dentro de una consulta y manejo elegante de los NULL.',
  keywords: 'case when then else end coalesce nullif ifnull iif pivot',
  body: `
<p>SQL no tiene <code>if</code> como los lenguajes de programación, pero sí una expresión condicional
completa: <code>CASE</code>. Con ella puedes clasificar, traducir, redondear a categorías o incluso
construir tablas cruzadas (<i>pivot</i>) sin salir de la consulta.</p>

<h1>CASE con condiciones (forma buscada)</h1>
<div class="definition">
    <div class="desc">CASE WHEN … THEN … ELSE … END</div>
    <code class="sql">SELECT nombre,
       <strong>CASE
           WHEN precio &lt; 100  THEN 'económico'
           WHEN precio &lt; 500  THEN 'medio'
           ELSE                     'premium'
       END</strong> AS gama
FROM productos;</code>
</div>

<p>Las condiciones se evalúan en orden y gana la primera que se cumple. Si ninguna se cumple y no hay
<code>ELSE</code>, el resultado es <code>NULL</code>.</p>

<h1>CASE sobre un valor (forma simple)</h1>
<div class="definition">
    <div class="desc">CASE expresión WHEN valor THEN …</div>
    <code class="sql">SELECT id,
       <strong>CASE estado
           WHEN 'pendiente' THEN 'Sin enviar'
           WHEN 'enviado'   THEN 'En camino'
           WHEN 'entregado' THEN 'Completado'
           ELSE 'Anulado'
       END</strong> AS situacion
FROM pedidos;</code>
</div>

<h1>Dónde se puede usar</h1>
<p><code>CASE</code> es una <em>expresión</em>, así que funciona en cualquier sitio donde quepa un valor:</p>
<ul>
  <li>en el <code>SELECT</code>, para calcular una columna derivada;</li>
  <li>dentro de un agregado, para hacer <em>pivots</em>:
      <code>SUM(CASE WHEN estado = 'entregado' THEN 1 ELSE 0 END)</code>;</li>
  <li>en el <code>ORDER BY</code>, para dar un orden a medida:
      <code>ORDER BY CASE estado WHEN 'pendiente' THEN 1 WHEN 'enviado' THEN 2 ELSE 3 END</code>;</li>
  <li>en el <code>WHERE</code> y en <code>UPDATE … SET</code>.</li>
</ul>

<h1>Funciones para tratar NULL</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:30%">Función</td><td>Qué hace</td></tr>
    <tr><td><code>COALESCE(a, b, c, …)</code></td><td>Devuelve el primer argumento no nulo. Estándar y disponible en todos los motores.</td></tr>
    <tr><td><code>IFNULL(a, b)</code></td><td>Versión de dos argumentos (SQLite, MySQL). En Oracle es <code>NVL</code>; en SQL Server, <code>ISNULL</code>.</td></tr>
    <tr><td><code>NULLIF(a, b)</code></td><td>Devuelve <code>NULL</code> si <code>a = b</code>; si no, <code>a</code>. Muy útil para evitar divisiones por cero: <code>x / NULLIF(y, 0)</code>.</td></tr>
    <tr><td><code>IIF(cond, a, b)</code></td><td>Atajo para un <code>CASE</code> de dos ramas (SQLite 3.32+, SQL Server). No es estándar.</td></tr>
  </table>
</div>

<div class="callout note">
  <div class="desc">Patrón útil: media que ignora ceros</div>
  <p><code class="sql">SELECT AVG(ventas / NULLIF(unidades, 0)) FROM datos;</code><br/>
  Si <code>unidades</code> es 0, el divisor pasa a <code>NULL</code>, la división da <code>NULL</code> y
  <code>AVG</code> lo ignora en lugar de reventar con un error de división por cero.</p>
</div>

<h1>Ejercicio</h1>
<p>Usa la base <strong>Tienda online</strong> para clasificar y resumir datos con expresiones
condicionales.</p>
`,
  exercise: {
    dataset: 'tienda',
    tables: ['productos', 'pedidos', 'clientes'],
    title: 'Ejercicio: CASE',
    starter: 'SELECT * FROM productos;',
    tasks: [
      { text: "Muestra el <code>nombre</code> de cada producto y una columna <code>gama</code> que valga <code>'económico'</code> si el precio es menor de 100, <code>'medio'</code> si es menor de 500 y <code>'premium'</code> en el resto de casos",
        hint: 'Recuerda: las condiciones se evalúan en orden.',
        queryChecks: ['CASE'],
        solution: "SELECT nombre,\n       CASE WHEN precio < 100 THEN 'económico'\n            WHEN precio < 500 THEN 'medio'\n            ELSE 'premium'\n       END AS gama\nFROM productos;",
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Muestra el <code>nombre</code> de cada cliente y su ciudad, sustituyendo los valores nulos por el texto <code>Sin ciudad</code>',
        hint: '<code>COALESCE</code> o <code>IFNULL</code>.',
        solution: "SELECT nombre, COALESCE(ciudad, 'Sin ciudad') AS ciudad\nFROM clientes;",
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'En una sola fila, cuenta cuántos pedidos hay <code>entregados</code>, <code>enviados</code>, <code>pendientes</code> y <code>cancelados</code> (una columna por estado)',
        hint: 'Combina <code>SUM()</code> con un <code>CASE</code> dentro para cada estado.',
        queryChecks: ['CASE'],
        solution: "SELECT SUM(CASE WHEN estado = 'entregado' THEN 1 ELSE 0 END) AS entregados,\n       SUM(CASE WHEN estado = 'enviado'   THEN 1 ELSE 0 END) AS enviados,\n       SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) AS pendientes,\n       SUM(CASE WHEN estado = 'cancelado' THEN 1 ELSE 0 END) AS cancelados\nFROM pedidos;",
        checks: [{ type: 'row_col_val_solution_query', data: null }] }
    ]
  }
});
