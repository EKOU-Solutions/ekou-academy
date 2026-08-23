CURSO.register({
  slug: 'inner-join',
  section: 'multitabla',
  source: 'sqlbolt',
  title: 'Lección 6: Consultas multitabla con JOIN',
  shortTitle: 'INNER JOIN',
  summary: 'Combinar filas de varias tablas mediante claves.',
  keywords: 'join inner join normalizacion clave primaria on',
  body: `
<p>Hasta ahora hemos trabajado con una sola tabla, pero en el mundo real los datos de una entidad suelen
descomponerse y guardarse en varias tablas ortogonales mediante un proceso llamado
<i>normalización</i>.</p>

<h1>Normalización</h1>
<p>La normalización es útil porque minimiza los datos duplicados dentro de una misma tabla y permite que
distintos conjuntos de datos crezcan de forma independiente (por ejemplo, los tipos de motor pueden crecer
sin depender de cada modelo de coche). A cambio, las consultas se vuelven algo más complejas, porque tienen
que localizar datos en distintas partes de la base, y pueden aparecer problemas de rendimiento al trabajar
con muchas tablas grandes.</p>

<p>Para responder preguntas sobre una entidad cuyos datos están repartidos en varias tablas necesitamos
aprender a escribir una consulta que combine todos esos datos y extraiga exactamente la información que
buscamos.</p>

<h1>Consultas multitabla con JOIN</h1>
<p>Las tablas que comparten información sobre una misma entidad necesitan una <i>clave primaria</i> que
identifique esa entidad de forma <i>única</i> en toda la base de datos. Un tipo habitual de clave primaria
es un entero autoincremental (porque ocupa poco), pero también puede ser una cadena o un valor hash,
siempre que sea único.</p>

<p>Con la cláusula <code>JOIN</code> podemos combinar filas de dos tablas distintas usando esa clave única.
El primer join que vamos a ver es el <code>INNER JOIN</code>.</p>

<div class="definition">
    <div class="desc">Consulta SELECT con INNER JOIN sobre varias tablas</div>
    <code class="sql">SELECT columna, columna_de_otra_tabla, …
FROM mi_tabla
<strong>INNER JOIN otra_tabla
    ON mi_tabla.id = otra_tabla.id</strong>
WHERE <i>condición(es)</i>
ORDER BY columna, … ASC/DESC
LIMIT num_limite OFFSET num_desplazamiento;</code>
</div>

<p>El <code>INNER JOIN</code> empareja las filas de la primera tabla con las de la segunda que tienen la
misma clave (según la condición <code>ON</code>) para crear una fila de resultado con las columnas combinadas
de ambas tablas. Una vez unidas las tablas, se aplican el resto de cláusulas que ya conocemos.</p>

<div class="dyk">
    <div class="desc">¿Sabías que…?</div>
    <p>Verás consultas donde el <code>INNER JOIN</code> se escribe simplemente como <code>JOIN</code>. Son
    equivalentes, pero seguiremos escribiendo <code>INNER JOIN</code> porque hace la consulta más legible en
    cuanto empiezas a usar otros tipos de join, que veremos en la siguiente lección.</p>
</div>

<h1>Ejercicio</h1>
<p>Hemos añadido una tabla nueva a la base de Pixar para que practiques los joins. La tabla
<strong>boxoffice</strong> guarda la valoración y la recaudación de cada película, y su columna
<em>movie_id</em> se corresponde uno a uno con la columna <em>id</em> de la tabla
<strong>movies</strong>.</p>
`,
  exercise: {
    dataset: 'pixar',
    tables: ['movies', 'boxoffice'],
    title: 'Ejercicio 6',
    starter: 'SELECT * FROM movies;',
    tasks: [
      { text: 'Encuentra la recaudación nacional e internacional de cada película',
        solution: 'SELECT title, domestic_sales, international_sales \nFROM movies\n  JOIN boxoffice\n    ON movies.id = boxoffice.movie_id;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Muestra las cifras de ventas de cada película que recaudó más fuera que dentro de su país',
        solution: 'SELECT title, domestic_sales, international_sales\nFROM movies\n  JOIN boxoffice\n    ON movies.id = boxoffice.movie_id\nWHERE international_sales > domestic_sales;',
        checks: [
          { type: 'row_col_val_solution_query', data: null },
          { type: 'row_col_val_greather_than_or_equal', data: { column_a: 'international_sales', column_b: 'domestic_sales' } }
        ] },
      { text: 'Lista todas las películas por su valoración (<code>rating</code>) en orden descendente',
        solution: 'SELECT title\nFROM movies\n  JOIN boxoffice\n    ON movies.id = boxoffice.movie_id\nORDER BY rating DESC;',
        checks: [{ type: 'row_col_val_solution_query_ordered', data: null }] }
    ]
  }
});
