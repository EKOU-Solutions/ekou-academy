CURSO.register({
  slug: 'insert',
  section: 'dml',
  source: 'sqlbolt',
  title: 'Lección 13: Insertar filas',
  shortTitle: 'INSERT',
  summary: 'Qué es un esquema y cómo añadir filas nuevas con INSERT.',
  keywords: 'insert into values esquema schema tipos de datos',
  body: `
<p>Hemos dedicado muchas lecciones a consultar datos; toca empezar a aprender sobre esquemas SQL y sobre
cómo añadir datos nuevos.</p>

<h1>¿Qué es un esquema?</h1>
<p>Describimos una tabla como un conjunto bidimensional de filas y columnas, donde las columnas son las
propiedades y las filas son instancias de la entidad. En SQL, el <i>esquema de la base de datos</i> es lo
que describe la estructura de cada tabla y los tipos de datos que puede contener cada columna.</p>

<div class="dyk">
    <div class="desc">Ejemplo</div>
    <p>En nuestra tabla <strong>movies</strong>, los valores de la columna <em>year</em> deben ser enteros y
    los de <em>title</em> deben ser cadenas de texto.</p>
</div>

<p>Esta estructura fija es lo que permite que una base de datos sea eficiente y coherente aunque guarde
millones o miles de millones de filas.</p>

<h1>Insertar datos nuevos</h1>
<p>Para insertar datos usamos una sentencia <code>INSERT</code>, que declara en qué tabla escribir, qué
columnas se rellenan y una o varias filas de datos. En general, cada fila que insertes debe contener valores
para todas las columnas de la tabla. Puedes insertar varias filas a la vez listándolas seguidas.</p>

<div class="definition">
    <div class="desc">INSERT con valores para todas las columnas</div>
    <code class="sql">INSERT INTO mi_tabla
VALUES (valor_o_expr, otro_valor_o_expr, …),
       (valor_o_expr_2, otro_valor_o_expr_2, …),
       …;</code>
</div>

<p>Si tienes datos incompletos y la tabla tiene columnas con valores por defecto, puedes insertar filas
indicando solo las columnas de las que dispones.</p>

<div class="definition">
    <div class="desc">INSERT con columnas concretas</div>
    <code class="sql">INSERT INTO mi_tabla
<strong>(columna, otra_columna, …)</strong>
VALUES (valor_o_expr, otro_valor_o_expr, …),
       (valor_o_expr_2, otro_valor_o_expr_2, …),
       …;</code>
</div>

<p>En ese caso el número de valores debe coincidir con el número de columnas indicadas. Aunque es más
verboso, insertar así tiene la ventaja de ser compatible hacia adelante: si añades una columna nueva con
valor por defecto, ningún <code>INSERT</code> existente tendrá que cambiar.</p>

<p>Además, puedes usar expresiones matemáticas y de cadena en los valores que insertas, lo que ayuda a
garantizar que todos los datos entren con un formato concreto.</p>

<div class="definition">
    <div class="desc">Ejemplo de INSERT con expresiones</div>
    <code class="sql">INSERT INTO boxoffice
<strong>(movie_id, rating, sales_in_millions)</strong>
VALUES (1, 9.9, 283742034 / 1000000);</code>
</div>

<div class="callout note">
  <div class="desc">También se puede insertar el resultado de una consulta</div>
  <p><code>INSERT INTO destino (a, b) SELECT x, y FROM origen WHERE …;</code> copia filas de una tabla a
  otra sin pasar por la aplicación.</p>
</div>

<h1>Ejercicio</h1>
<p>Vamos a jugar a ser ejecutivos del estudio y añadir algunas películas a <strong>movies</strong>. En esta
tabla, <strong>id</strong> es un entero autoincremental, así que puedes probar a insertar una fila indicando
solo el resto de columnas.</p>
<p>Como esta lección modifica la base de datos, ejecuta cada consulta cuando la tengas lista. Si algo sale
mal, pulsa «Reiniciar datos».</p>
`,
  exercise: {
    dataset: 'pixar',
    tables: ['movies', 'boxoffice'],
    title: 'Ejercicio 13',
    starter: 'SELECT * FROM movies;',
    preload: {
      movies: 'DELETE FROM movies WHERE id > 3;',
      boxoffice: 'DELETE FROM boxoffice WHERE movie_id > 3;'
    },
    tasks: [
      { text: 'Añade la nueva producción del estudio, <strong>Toy Story 4</strong>, a la lista de películas (puedes poner el director que quieras)',
        postValidateAction: { resultQuery: 'SELECT * FROM movies;', message: 'Fila(s) insertada(s)' },
        solution: "INSERT INTO movies VALUES (4, 'Toy Story 4', 'El Directore', 2015, 90);",
        checks: [{ type: 'row_exists_contain_col_val', data: { table: 'movies', column: 'title', value: 'Toy Story 4', ignoreCase: true } }] },
      { text: '¡Toy Story 4 se ha estrenado con excelentes críticas! Tuvo una valoración de <strong>8.7</strong> y recaudó <strong>340 millones en su país</strong> y <strong>270 millones fuera</strong>. Añade el registro a la tabla <code>boxoffice</code>.',
        postValidateAction: { resultQuery: 'SELECT * FROM boxoffice;', message: 'Fila(s) insertada(s)' },
        solution: 'INSERT INTO boxoffice VALUES (4, 8.7, 340000000, 270000000);',
        checks: [{ type: 'row_count_query_range', data: { query: "SELECT * FROM boxoffice \nWHERE movie_id IN (\n    SELECT id FROM movies\n    WHERE title LIKE 'Toy Story 4'\n);", minCount: 1, maxCount: 1 } }] }
    ]
  }
});
