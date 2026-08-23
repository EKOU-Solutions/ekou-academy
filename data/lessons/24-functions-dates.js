CURSO.register({
  slug: 'funciones-fechas',
  section: 'funciones',
  source: 'extra',
  title: 'Tema: Funciones de fecha y hora',
  shortTitle: 'Fechas y horas',
  summary: 'Extraer partes de una fecha, sumar intervalos y calcular diferencias.',
  keywords: 'fecha hora date datetime strftime julianday interval extract now current_date',
  body: `
<p>Las fechas son el tipo de dato con más diferencias entre motores. La buena noticia es que las
<em>operaciones</em> son siempre las mismas cuatro: obtener la fecha actual, extraer una parte, sumar o
restar un intervalo, y calcular la diferencia entre dos fechas.</p>

<h1>Cómo se guardan</h1>
<p>SQLite no tiene un tipo <code>DATE</code> nativo: guarda las fechas como texto ISO-8601
(<code>'2024-03-05'</code>, <code>'2024-03-05 14:30:00'</code>), como número Julian day o como segundos
Unix. El formato de texto ISO es el recomendado porque se ordena y compara correctamente
como cadena.</p>

<div class="callout note">
  <div class="desc">Consejo general</div>
  <p>Guarda siempre las fechas en un tipo de fecha real (o en texto ISO) y en UTC. Guardar
  <code>'05/03/2024'</code> como texto convierte cualquier ordenación o comparación en un problema.</p>
</div>

<h1>Fecha y hora actuales</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:34%">SQLite</td><td>Otros motores</td></tr>
    <tr><td><code>date('now')</code></td><td><code>CURRENT_DATE</code></td></tr>
    <tr><td><code>datetime('now')</code></td><td><code>CURRENT_TIMESTAMP</code>, <code>NOW()</code> (MySQL/PostgreSQL), <code>GETDATE()</code> (SQL Server), <code>SYSDATE</code> (Oracle)</td></tr>
  </table>
</div>

<h1>Extraer partes de una fecha</h1>
<p>En SQLite se usa <code>strftime(formato, fecha)</code>; el estándar usa
<code>EXTRACT(parte FROM fecha)</code>.</p>

<div class="definition">
    <div class="desc">strftime</div>
    <code class="sql">SELECT fecha,
       strftime('%Y', fecha) AS anio,    <i>-- '2024'</i>
       strftime('%m', fecha) AS mes,     <i>-- '03'</i>
       strftime('%d', fecha) AS dia,
       strftime('%Y-%m', fecha) AS periodo,
       strftime('%w', fecha) AS dia_semana   <i>-- 0 = domingo</i>
FROM pedidos;</code>
</div>

<p>Ojo: <code>strftime</code> devuelve <strong>texto</strong>. Si necesitas un número para comparar o
sumar, envuélvelo en <code>CAST(… AS INTEGER)</code>.</p>

<h1>Sumar y restar intervalos</h1>
<div class="definition">
    <div class="desc">Modificadores de date()/datetime() en SQLite</div>
    <code class="sql">SELECT date('2024-03-05', '+30 days')            AS en_30_dias,
       date('2024-03-05', '-1 month')             AS hace_un_mes,
       date('2024-03-05', 'start of month')       AS primer_dia,
       date('2024-03-05', 'start of month',
                          '+1 month', '-1 day')   AS ultimo_dia,
       datetime('now', 'localtime')               AS ahora_local;</code>
</div>

<p>El equivalente en otros motores: <code>fecha + INTERVAL '30 day'</code> (PostgreSQL),
<code>DATE_ADD(fecha, INTERVAL 30 DAY)</code> (MySQL), <code>DATEADD(day, 30, fecha)</code> (SQL Server).</p>

<h1>Diferencia entre dos fechas</h1>
<p>En SQLite se resta con <code>julianday()</code>, que convierte una fecha a un número de días:</p>

<div class="definition">
    <div class="desc">Días y años entre dos fechas</div>
    <code class="sql">SELECT CAST(julianday('2025-01-01') - julianday(fecha_ingreso) AS INTEGER) AS dias,
       CAST((julianday('2025-01-01') - julianday(fecha_ingreso)) / 365.25 AS INTEGER) AS anios
FROM empleados;</code>
</div>

<p>En otros motores: <code>fecha_b - fecha_a</code> (PostgreSQL, da un intervalo),
<code>DATEDIFF(fecha_b, fecha_a)</code> (MySQL) o <code>DATEDIFF(day, a, b)</code> (SQL Server).</p>

<div class="callout danger">
  <div class="desc">No apliques funciones a la columna que filtras</div>
  <p><code>WHERE strftime('%Y', fecha) = '2024'</code> obliga a leer toda la tabla porque el índice sobre
  <code>fecha</code> deja de servir. Escribe rangos:
  <code>WHERE fecha &gt;= '2024-01-01' AND fecha &lt; '2025-01-01'</code>. Lo veremos en
  <a href="#/indices">Índices</a>.</p>
</div>

<h1>Ejercicio</h1>
<p>Base <strong>Tienda online</strong>. Las fechas están guardadas como texto ISO
(<code>AAAA-MM-DD</code>).</p>
`,
  exercise: {
    dataset: 'tienda',
    tables: ['pedidos', 'clientes', 'empleados'],
    title: 'Ejercicio: fechas',
    starter: 'SELECT * FROM pedidos;',
    tasks: [
      { text: 'Muestra el <code>id</code> de cada pedido junto con su <code>anio</code> y su <code>mes</code> extraídos de la columna <code>fecha</code>',
        hint: '<code>strftime(\'%Y\', fecha)</code> y <code>strftime(\'%m\', fecha)</code>.',
        solution: "SELECT id, strftime('%Y', fecha) AS anio, strftime('%m', fecha) AS mes\nFROM pedidos;",
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Cuenta cuántos pedidos hay por año: una columna <code>anio</code> y otra <code>pedidos</code>, ordenadas por año ascendente',
        hint: 'Agrupa por la expresión <code>strftime(\'%Y\', fecha)</code>.',
        solution: "SELECT strftime('%Y', fecha) AS anio, COUNT(*) AS pedidos\nFROM pedidos\nGROUP BY anio\nORDER BY anio;",
        checks: [{ type: 'row_col_val_solution_query_ordered', data: null }] },
      { text: 'Lista el <code>id</code> y la <code>fecha</code> de los pedidos del primer trimestre de 2024, usando un <strong>rango de fechas</strong> (sin aplicar funciones a la columna)',
        hint: '<code>WHERE fecha &gt;= \'2024-01-01\' AND fecha &lt; \'2024-04-01\'</code>.',
        solution: "SELECT id, fecha\nFROM pedidos\nWHERE fecha >= '2024-01-01' AND fecha < '2024-04-01';",
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Muestra el <code>nombre</code> de cada empleado y sus años completos de antigüedad a fecha <code>2025-01-01</code>, en una columna <code>anios</code>',
        hint: 'Resta con <code>julianday()</code>, divide entre 365.25 y convierte a entero con <code>CAST</code>.',
        solution: "SELECT nombre,\n       CAST((julianday('2025-01-01') - julianday(fecha_ingreso)) / 365.25 AS INTEGER) AS anios\nFROM empleados;",
        checks: [{ type: 'row_col_val_solution_query', data: null }] }
    ]
  }
});
