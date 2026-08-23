CURSO.register({
  slug: 'expresiones-alias',
  section: 'multitabla',
  source: 'sqlbolt',
  title: 'Lección 9: Consultas con expresiones',
  shortTitle: 'Expresiones y alias',
  summary: 'Calcular valores dentro de la consulta y darles nombre con AS.',
  keywords: 'expresiones alias as aritmetica funciones round modulo',
  body: `
<p>Además de consultar y referenciar los datos en bruto de una columna, SQL permite usar
<i>expresiones</i> para escribir lógica más compleja sobre los valores. Estas expresiones pueden usar
funciones matemáticas y de cadena junto con aritmética básica para transformar valores mientras se ejecuta
la consulta, como en este ejemplo:</p>

<div class="definition">
    <div class="desc">Consulta de ejemplo con expresiones</div>
    <code class="sql">SELECT <strong>velocidad_particula / 2.0</strong> AS media_velocidad
FROM datos_fisica
WHERE <strong>ABS(posicion_particula) * 10.0 &gt; 500</strong>;</code>
</div>

<p>Cada base de datos tiene su propio conjunto de funciones matemáticas, de cadena y de fecha; las
encontrarás en su documentación. En este curso les dedicamos varios temas más adelante.</p>

<p>Usar expresiones ahorra tiempo y posprocesado de los resultados, pero también puede hacer la consulta más
difícil de leer. Por eso recomendamos que, cuando uses expresiones en la parte <code>SELECT</code>, les des
un <i>alias</i> descriptivo con la palabra clave <code>AS</code>.</p>

<div class="definition">
    <div class="desc">Consulta SELECT con alias de expresión</div>
    <code class="sql">SELECT <strong><i>expresión_columna</i> AS <i>descripción_expresión</i></strong>, …
FROM mi_tabla;</code>
</div>

<p>Además de las expresiones, las columnas normales e incluso las tablas pueden tener alias, lo que facilita
referenciarlas en la salida y simplifica consultas más complejas.</p>

<div class="definition">
    <div class="desc">Ejemplo con alias de columna y de tabla</div>
    <code class="sql">SELECT columna <strong>AS nombre_mejor</strong>, …
FROM una_tabla_con_nombre_larguisimo <strong>AS mitabla</strong>
INNER JOIN ventas_widgets
  ON mitabla.id = ventas_widgets.widget_id;</code>
</div>

<h1>Ejercicio</h1>
<p>Tendrás que usar expresiones para transformar los datos de <strong>boxoffice</strong> en algo más fácil de
entender.</p>
`,
  exercise: {
    dataset: 'pixar',
    tables: ['movies', 'boxoffice'],
    title: 'Ejercicio 9',
    starter: 'SELECT * FROM movies;',
    tasks: [
      { text: 'Lista todas las películas y su recaudación total en <strong>millones</strong> de dólares',
        hint: 'Ahora mismo están guardadas en dólares.',
        solution: 'SELECT title, (domestic_sales + international_sales) / 1000000 AS gross_sales_millions\nFROM movies\n  JOIN boxoffice\n    ON movies.id = boxoffice.movie_id;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Lista todas las películas y su valoración <strong>en porcentaje</strong>',
        hint: 'La valoración va de 0 a 10.',
        solution: 'SELECT title, rating * 10 AS rating_percent\nFROM movies\n  JOIN boxoffice\n    ON movies.id = boxoffice.movie_id;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Lista todas las películas estrenadas en años pares',
        hint: 'Usa el módulo (<code>%</code>) para saber si el año es par.',
        solution: 'SELECT title\nFROM movies\nWHERE year % 2 = 0;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] }
    ]
  }
});
