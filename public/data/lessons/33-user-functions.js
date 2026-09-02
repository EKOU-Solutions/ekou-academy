CURSO.register({
  slug: 'funciones-usuario',
  section: 'programacion',
  source: 'extra',
  title: 'Tema: Funciones definidas por el usuario (UDF)',
  shortTitle: 'Funciones de usuario',
  summary: 'Crear tus propias funciones y usarlas como si fueran nativas del motor.',
  keywords: 'udf create function funcion usuario plpgsql deterministic tabla escalar create_function',
  body: `
<p>Además de las funciones que trae el motor, puedes definir las tuyas. Una <strong>función definida por el
usuario</strong> encapsula un cálculo con nombre y parámetros, y se invoca dentro de cualquier consulta
igual que <code>ROUND()</code> o <code>UPPER()</code>.</p>

<h1>Función frente a procedimiento</h1>
<div class="datatable">
  <table class="table">
    <tr><td style="width:26%"></td><td>Función</td><td>Procedimiento</td></tr>
    <tr><td>Devuelve</td><td>Siempre un valor (o una tabla)</td><td>Nada, o valores por parámetros <code>OUT</code></td></tr>
    <tr><td>Se invoca</td><td>Dentro de un <code>SELECT</code>, <code>WHERE</code>, <code>ORDER BY</code>…</td><td>Con <code>CALL</code> / <code>EXEC</code>, como sentencia propia</td></tr>
    <tr><td>Efectos secundarios</td><td>Normalmente prohibidos o desaconsejados</td><td>Es su razón de ser</td></tr>
    <tr><td>Transacciones</td><td>No las controla</td><td>Puede hacer <code>COMMIT</code>/<code>ROLLBACK</code> (según motor)</td></tr>
  </table>
</div>

<h1>PostgreSQL</h1>
<div class="definition">
    <div class="desc">Función escalar en PL/pgSQL</div>
    <code class="sql">CREATE OR REPLACE FUNCTION con_iva(importe NUMERIC, tipo NUMERIC DEFAULT 0.21)
RETURNS NUMERIC
LANGUAGE plpgsql
<strong>IMMUTABLE</strong>            <i>-- mismo resultado con los mismos argumentos: el planificador lo aprovecha</i>
AS $$
BEGIN
    RETURN ROUND(importe * (1 + tipo), 2);
END;
$$;

SELECT nombre, con_iva(precio) FROM productos;</code>
</div>

<div class="definition">
    <div class="desc">Función que devuelve una tabla</div>
    <code class="sql">CREATE FUNCTION pedidos_de(p_cliente INT)
RETURNS TABLE (pedido_id INT, fecha DATE, total NUMERIC)
LANGUAGE sql AS $$
    SELECT p.id, p.fecha, SUM(d.cantidad * d.precio_unit)
    FROM pedidos p JOIN detalle_pedido d ON d.pedido_id = p.id
    WHERE p.cliente_id = p_cliente
    GROUP BY p.id, p.fecha;
$$;

SELECT * FROM pedidos_de(3);</code>
</div>

<h1>MySQL / MariaDB</h1>
<div class="definition">
    <div class="desc">CREATE FUNCTION en MySQL</div>
    <code class="sql">DELIMITER $$
CREATE FUNCTION con_iva(importe DECIMAL(10,2), tipo DECIMAL(4,2))
RETURNS DECIMAL(10,2)
<strong>DETERMINISTIC</strong>
BEGIN
    RETURN ROUND(importe * (1 + tipo), 2);
END$$
DELIMITER ;</code>
</div>

<h1>SQL Server y Oracle</h1>
<div class="definition">
    <div class="desc">T-SQL y PL/SQL</div>
    <code class="sql"><i>-- SQL Server</i>
CREATE FUNCTION dbo.con_iva(@importe DECIMAL(10,2), @tipo DECIMAL(4,2))
RETURNS DECIMAL(10,2)
AS BEGIN
    RETURN ROUND(@importe * (1 + @tipo), 2);
END;

<i>-- Oracle</i>
CREATE OR REPLACE FUNCTION con_iva(p_importe NUMBER, p_tipo NUMBER DEFAULT 0.21)
RETURN NUMBER IS
BEGIN
    RETURN ROUND(p_importe * (1 + p_tipo), 2);
END;
/</code>
</div>

<h1>UDF en SQLite: se registran desde el lenguaje anfitrión</h1>
<p>SQLite no tiene <code>CREATE FUNCTION</code>. En su lugar, el programa que abre la base registra funciones
escritas en C, Python, JavaScript… y a partir de ese momento se pueden usar en cualquier consulta de esa
conexión.</p>

<div class="definition">
    <div class="desc">Registro desde JavaScript (así funciona este sitio)</div>
    <code class="sql">db.create_function('iva', (importe, tipo) =&gt;
    Math.round(importe * (1 + (tipo ?? 0.21)) * 100) / 100
);

<i>-- y en Python sería:</i>
<i>-- conn.create_function("iva", 2, lambda imp, t: round(imp * (1 + (t or 0.21)), 2))</i></code>
</div>

<div class="callout sqlite">
  <div class="desc">Funciones disponibles en este curso</div>
  <p>Todas las bases de este sitio tienen registradas cuatro funciones de ejemplo, implementadas en
  <code>assets/js/engine.js</code>:</p>
  <ul>
    <li><code>iva(importe [, tipo])</code> — añade el IVA (21 % por defecto) y redondea a 2 decimales.</li>
    <li><code>iniciales(nombre)</code> — <code>'Lucía Ferrer'</code> → <code>'L.F.'</code></li>
    <li><code>slugify(texto)</code> — <code>'Portátil Aura 14'</code> → <code>'portatil-aura-14'</code></li>
    <li><code>distancia_km(lat1, lon1, lat2, lon2)</code> — distancia entre dos puntos (pruébala en el
        Playground con la base «Oficina y ciudades»).</li>
  </ul>
</div>

<h1>Cuándo compensan y cuándo no</h1>
<ul>
  <li>✅ Reglas de negocio repetidas en muchas consultas (cálculo de IVA, normalización de códigos).</li>
  <li>✅ Encapsular expresiones largas e ilegibles.</li>
  <li>❌ En el <code>WHERE</code> sobre tablas grandes: una función alrededor de la columna
      <strong>anula el índice</strong> y fuerza un escaneo completo (ver <a href="#/indices">Índices</a>).
      Solución: índices sobre expresiones o columnas generadas.</li>
  <li>❌ Marcarlas como deterministas cuando no lo son: el planificador cacheará resultados incorrectos.</li>
</ul>

<h1>Ejercicio</h1>
<p>Base <strong>Tienda online</strong>, con las funciones de usuario ya registradas.</p>
`,
  exercise: {
    dataset: 'tienda',
    tables: ['productos', 'clientes', 'categorias'],
    title: 'Ejercicio: funciones de usuario',
    starter: "SELECT nombre, precio, iva(precio) FROM productos LIMIT 5;",
    tasks: [
      { text: 'Muestra el <code>nombre</code> de cada producto, su <code>precio</code> y el precio con IVA usando la función <code>iva()</code>, en una columna <code>precio_iva</code>',
        hint: '<code>iva(precio)</code> aplica el 21 % por defecto.',
        queryChecks: ['iva'],
        solution: 'SELECT nombre, precio, iva(precio) AS precio_iva\nFROM productos;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Muestra el <code>nombre</code> de cada cliente y sus iniciales usando <code>iniciales()</code>, en una columna <code>abrev</code>',
        solution: 'SELECT nombre, iniciales(nombre) AS abrev\nFROM clientes;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Muestra el <code>nombre</code> de cada producto y su versión apta para URL con <code>slugify()</code>, en una columna <code>slug</code>, solo para los productos de la categoría 1',
        solution: 'SELECT nombre, slugify(nombre) AS slug\nFROM productos\nWHERE categoria_id = 1;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Combina las dos cosas: para los productos de más de 500 €, muestra el <code>slug</code> y el precio con IVA <strong>reducido del 10 %</strong> (<code>iva(precio, 0.10)</code>) en una columna <code>precio_reducido</code>',
        hint: 'La función acepta un segundo argumento opcional con el tipo de IVA.',
        solution: 'SELECT slugify(nombre) AS slug, iva(precio, 0.10) AS precio_reducido\nFROM productos\nWHERE precio > 500;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] }
    ]
  }
});
