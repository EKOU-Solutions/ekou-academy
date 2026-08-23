CURSO.register({
  slug: 'where-numeros',
  section: 'fundamentos',
  source: 'sqlbolt',
  title: 'Lección 2: Consultas con restricciones (Pt. 1)',
  shortTitle: 'WHERE con números',
  summary: 'Filtrar filas con WHERE y operadores numéricos.',
  keywords: 'where and or between in operadores numericos filtro',
  body: `
<p>Ya sabemos seleccionar columnas concretas de una tabla, pero si tuvieras una tabla con cien millones de
filas, leerlas todas sería ineficiente y quizá imposible.</p>

<p>Para descartar ciertos resultados usamos una cláusula <code>WHERE</code> en la consulta. La cláusula se
aplica a cada fila comprobando los valores de columnas concretas para decidir si debe incluirse en el
resultado o no.</p>

<div class="definition">
    <div class="desc">Consulta SELECT con restricciones</div>
    <code class="sql">SELECT columna, otra_columna, …
FROM mi_tabla
<strong>WHERE <i>condición</i>
    AND/OR <i>otra_condición</i>
    AND/OR …</strong>;</code>
</div>

<p>Se pueden construir cláusulas más complejas encadenando <code>AND</code> u <code>OR</code>
(por ejemplo, <code>num_ruedas &gt;= 4 AND puertas &lt;= 2</code>). Estos son los operadores útiles para datos
numéricos (enteros o decimales):</p>

<div class="datatable">
    <table class="table">
        <tr><td style="width:22%;text-align:center">Operador</td><td style="width:48%">Condición</td><td>Ejemplo SQL</td></tr>
        <tr><td style="text-align:center">=, !=, &lt;, &lt;=, &gt;, &gt;=</td><td>Operadores numéricos estándar</td><td>col <span class="faux-keyword">!=</span> 4</td></tr>
        <tr><td style="text-align:center">BETWEEN … AND …</td><td>El número está dentro de un rango (inclusive)</td><td>col <span class="faux-keyword">BETWEEN</span> 1.5 <span class="faux-keyword">AND</span> 10.5</td></tr>
        <tr><td style="text-align:center">NOT BETWEEN … AND …</td><td>El número <em>no</em> está dentro del rango (inclusive)</td><td>col <span class="faux-keyword">NOT BETWEEN</span> 1 <span class="faux-keyword">AND</span> 10</td></tr>
        <tr><td style="text-align:center">IN (…)</td><td>El número existe en una lista</td><td>col <span class="faux-keyword">IN</span> (2, 4, 6)</td></tr>
        <tr><td style="text-align:center">NOT IN (…)</td><td>El número no existe en la lista</td><td>col <span class="faux-keyword">NOT IN</span> (1, 3, 5)</td></tr>
    </table>
</div>

<p>Además de hacer los resultados más manejables, restringir las filas devueltas también hace que la
consulta se ejecute más rápido, porque se procesan y transmiten menos datos innecesarios.</p>

<div class="dyk">
    <div class="desc">¿Sabías que…?</div>
    <p>SQL no <i>exige</i> escribir las palabras clave en mayúsculas, pero por convención ayuda a
    distinguirlas de los nombres de columnas y tablas, y hace la consulta más legible.</p>
</div>

<h1>Ejercicio</h1>
<p>Usando las restricciones adecuadas, obtén de la tabla <strong>movies</strong> la información que pide cada tarea.</p>
`,
  exercise: {
    dataset: 'pixar',
    tables: ['movies'],
    title: 'Ejercicio 2',
    starter: 'SELECT * FROM movies;',
    tasks: [
      { text: 'Encuentra la película cuyo <code>id</code> es 6',
        solution: 'SELECT title FROM movies \nWHERE id = 6;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Encuentra las películas estrenadas en los <code>year</code>s entre 2000 y 2010',
        solution: 'SELECT title FROM movies\nWHERE year BETWEEN 2000 AND 2010;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Encuentra las películas <strong>no</strong> estrenadas entre los <code>year</code>s 2000 y 2010',
        solution: 'SELECT title FROM movies\nWHERE year < 2000 OR year > 2010;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Encuentra las cinco primeras películas de Pixar y su <code>year</code> de estreno',
        hint: 'Fíjate en el <code>year</code>',
        solution: 'SELECT title FROM movies\nWHERE year <= 2003;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] }
    ]
  }
});
