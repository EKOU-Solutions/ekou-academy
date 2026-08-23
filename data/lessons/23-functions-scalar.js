CURSO.register({
  slug: 'funciones-escalares',
  section: 'funciones',
  source: 'extra',
  title: 'Tema: Funciones escalares (texto, números, conversión)',
  shortTitle: 'Funciones escalares',
  summary: 'Funciones que transforman un valor en otro: cadenas, matemáticas y CAST.',
  keywords: 'funciones escalares upper lower length substr replace trim round abs cast concat',
  body: `
<p>Una <strong>función escalar</strong> recibe uno o varios valores y devuelve <em>un</em> valor, fila a
fila. Se diferencia de las funciones de agregado (<code>SUM</code>, <code>COUNT</code>…), que reducen muchas
filas a una.</p>

<h1>Funciones de texto</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:34%">Función</td><td>Qué hace</td><td>Ejemplo</td></tr>
    <tr><td><code>LENGTH(s)</code></td><td>Número de caracteres</td><td><code>LENGTH('hola')</code> → 4</td></tr>
    <tr><td><code>UPPER(s)</code> / <code>LOWER(s)</code></td><td>Mayúsculas / minúsculas</td><td><code>UPPER('sql')</code> → <code>SQL</code></td></tr>
    <tr><td><code>TRIM(s)</code>, <code>LTRIM</code>, <code>RTRIM</code></td><td>Quita espacios (o los caracteres indicados)</td><td><code>TRIM('  x  ')</code> → <code>x</code></td></tr>
    <tr><td><code>SUBSTR(s, inicio, largo)</code></td><td>Subcadena; el primer carácter es la posición 1</td><td><code>SUBSTR('database',1,4)</code> → <code>data</code></td></tr>
    <tr><td><code>REPLACE(s, buscar, poner)</code></td><td>Sustituye todas las apariciones</td><td><code>REPLACE('a-b','-','/')</code> → <code>a/b</code></td></tr>
    <tr><td><code>INSTR(s, sub)</code></td><td>Posición de la primera aparición (0 si no está)</td><td><code>INSTR('a@b','@')</code> → 2</td></tr>
    <tr><td><code>a || b</code></td><td>Concatenación estándar</td><td><code>'a' || 'b'</code> → <code>ab</code></td></tr>
    <tr><td><code>PRINTF(fmt, …)</code></td><td>Formateo estilo C (SQLite; <code>FORMAT</code> en otros)</td><td><code>PRINTF('%.2f', 3.14159)</code> → <code>3.14</code></td></tr>
  </table>
</div>

<div class="callout note">
  <div class="desc">Nombres distintos según el motor</div>
  <p>Concatenar: <code>||</code> en SQLite, PostgreSQL y Oracle; <code>CONCAT(a,b)</code> en MySQL (donde
  <code>||</code> es «o» lógico) y <code>+</code> en SQL Server. Posición de subcadena:
  <code>INSTR</code> (SQLite, MySQL, Oracle), <code>POSITION(sub IN s)</code> (estándar/PostgreSQL),
  <code>CHARINDEX</code> (SQL Server). Longitud: <code>LENGTH</code> salvo en SQL Server, que usa
  <code>LEN</code>.</p>
</div>

<h1>Funciones numéricas</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:34%">Función</td><td>Qué hace</td></tr>
    <tr><td><code>ROUND(x, decimales)</code></td><td>Redondea al número de decimales indicado</td></tr>
    <tr><td><code>ABS(x)</code></td><td>Valor absoluto</td></tr>
    <tr><td><code>CEIL(x)</code> / <code>FLOOR(x)</code></td><td>Redondeo hacia arriba / abajo (en SQLite, 3.35+)</td></tr>
    <tr><td><code>x % y</code> o <code>MOD(x, y)</code></td><td>Resto de la división</td></tr>
    <tr><td><code>POWER(x, y)</code>, <code>SQRT(x)</code>, <code>EXP</code>, <code>LOG</code></td><td>Potencias, raíces y logaritmos</td></tr>
    <tr><td><code>RANDOM()</code> / <code>RAND()</code></td><td>Número aleatorio (útil con <code>ORDER BY RANDOM() LIMIT 1</code>)</td></tr>
    <tr><td><code>MIN(a,b)</code> / <code>MAX(a,b)</code></td><td>Con <em>varios argumentos</em> son escalares (no confundir con los agregados de un solo argumento)</td></tr>
  </table>
</div>

<h1>Conversión de tipos: CAST</h1>
<div class="definition">
    <div class="desc">CAST(expresión AS tipo)</div>
    <code class="sql">SELECT CAST('42' AS INTEGER) + 1,        <i>-- 43</i>
       CAST(precio AS INTEGER),          <i>-- trunca los decimales</i>
       CAST(3 AS REAL) / 2               <i>-- 1.5 en vez de 1</i>
FROM productos;</code>
</div>

<div class="callout danger">
  <div class="desc">La trampa de la división entera</div>
  <p>En la mayoría de motores, <code>7 / 2</code> con dos enteros da <code>3</code>, no <code>3.5</code>.
  Convierte uno de los operandos: <code>7 * 1.0 / 2</code> o <code>CAST(7 AS REAL) / 2</code>. Es la causa
  número uno de porcentajes que salen a cero.</p>
</div>

<h1>Ejercicio</h1>
<p>Base <strong>Tienda online</strong>.</p>
`,
  exercise: {
    dataset: 'tienda',
    tables: ['clientes', 'productos', 'categorias'],
    title: 'Ejercicio: funciones escalares',
    starter: 'SELECT * FROM clientes;',
    tasks: [
      { text: 'Muestra el <code>nombre</code> de cada cliente en mayúsculas (columna <code>nombre_mayus</code>) y el número de caracteres de su nombre (columna <code>letras</code>)',
        hint: '<code>UPPER()</code> y <code>LENGTH()</code>.',
        solution: 'SELECT UPPER(nombre) AS nombre_mayus, LENGTH(nombre) AS letras\nFROM clientes;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Lista los dominios de correo <strong>distintos</strong> de los clientes que tienen email (la parte que va después de la <code>@</code>)',
        hint: 'Combina <code>SUBSTR</code> con <code>INSTR(email, \'@\')</code> y usa <code>DISTINCT</code>.',
        solution: "SELECT DISTINCT substr(email, instr(email, '@') + 1) AS dominio\nFROM clientes\nWHERE email IS NOT NULL;",
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Muestra el <code>nombre</code> de cada producto y su precio con el 21 % de IVA redondeado a 2 decimales, en una columna <code>precio_iva</code>',
        hint: '<code>ROUND(precio * 1.21, 2)</code>.',
        solution: 'SELECT nombre, ROUND(precio * 1.21, 2) AS precio_iva\nFROM productos;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Muestra una sola columna <code>etiqueta</code> con el formato <code>Nombre (País)</code> para cada cliente — por ejemplo <code>Ana Ruiz (España)</code>',
        hint: 'Concatena con <code>||</code>.',
        solution: "SELECT nombre || ' (' || pais || ')' AS etiqueta\nFROM clientes;",
        checks: [{ type: 'row_col_val_solution_query', data: null }] }
    ]
  }
});
