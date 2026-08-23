CURSO.register({
  slug: 'distinct-order-limit',
  section: 'fundamentos',
  source: 'sqlbolt',
  title: 'Lección 4: Filtrar y ordenar resultados',
  shortTitle: 'DISTINCT, ORDER BY, LIMIT',
  summary: 'Eliminar duplicados, ordenar y paginar resultados.',
  keywords: 'distinct order by asc desc limit offset paginacion',
  body: `
<p>Aunque los datos de una base sean únicos, los resultados de una consulta concreta pueden no serlo: en
nuestra tabla <strong>movies</strong>, por ejemplo, varias películas pueden haberse estrenado el mismo año.
Para descartar filas con valores de columna duplicados, SQL ofrece la palabra clave
<code>DISTINCT</code>.</p>

<div class="definition">
    <div class="desc">Consulta SELECT con resultados únicos</div>
    <code class="sql">SELECT <strong>DISTINCT</strong> columna, otra_columna, …
FROM mi_tabla
WHERE <i>condición(es)</i>;</code>
</div>

<p>Como <code>DISTINCT</code> elimina filas duplicadas «a ciegas» (mirando todas las columnas
seleccionadas), en una lección posterior veremos cómo descartar duplicados según columnas concretas usando
agrupación con <code>GROUP BY</code>.</p>

<h1>Ordenar los resultados</h1>
<p>A diferencia de las tablas ordenadas de las lecciones anteriores, en las bases de datos reales los datos
se añaden sin ningún orden concreto. Cuando una tabla llega a miles o millones de filas, leer el resultado
de una consulta se vuelve difícil.</p>

<p>Para ayudar con eso, SQL permite ordenar los resultados por una columna en orden ascendente o descendente
con la cláusula <code>ORDER BY</code>.</p>

<div class="definition">
    <div class="desc">Consulta SELECT con resultados ordenados</div>
    <code class="sql">SELECT columna, otra_columna, …
FROM mi_tabla
WHERE <i>condición(es)</i>
<strong>ORDER BY columna ASC/DESC</strong>;</code>
</div>

<p>Cuando se especifica <code>ORDER BY</code>, cada fila se ordena alfanuméricamente según el valor de la
columna indicada. En algunas bases de datos puedes además indicar una <i>collation</i> para ordenar mejor
textos con acentos u otros alfabetos.</p>

<h1>Limitar los resultados a un subconjunto</h1>
<p>Otras dos cláusulas que suelen acompañar a <code>ORDER BY</code> son <code>LIMIT</code> y
<code>OFFSET</code>, una optimización muy útil para indicar a la base de datos qué subconjunto de resultados
te interesa. <code>LIMIT</code> reduce el número de filas devueltas y el <code>OFFSET</code> opcional indica
a partir de qué fila empezar a contar.</p>

<div class="definition">
    <div class="desc">Consulta SELECT con filas limitadas</div>
    <code class="sql">SELECT columna, otra_columna, …
FROM mi_tabla
WHERE <i>condición(es)</i>
ORDER BY columna ASC/DESC
<strong>LIMIT num_limite OFFSET num_desplazamiento</strong>;</code>
</div>

<p>Piensa en sitios como Reddit o Pinterest: la portada es una lista de enlaces ordenados por popularidad y
fecha, y cada página siguiente es un conjunto de enlaces con un desplazamiento distinto. Con estas
cláusulas la base de datos ejecuta la consulta más rápido, porque procesa y devuelve solo lo pedido.</p>

<div class="dyk">
    <div class="desc">¿Sabías que…?</div>
    <p>Si te preguntas cuándo se aplican <code>LIMIT</code> y <code>OFFSET</code> respecto al resto de la
    consulta: en general se aplican al final, después de las demás cláusulas. Lo veremos con detalle en la
    <a href="#/orden-de-ejecucion">Lección 12: Orden de ejecución</a>.</p>
</div>

<div class="callout note">
  <div class="desc">Diferencias entre motores</div>
  <p>SQLite, MySQL y PostgreSQL usan <code>LIMIT … OFFSET …</code>. SQL Server y Oracle usan el estándar
  <code>OFFSET n ROWS FETCH NEXT m ROWS ONLY</code>, que también acepta PostgreSQL.</p>
</div>

<h1>Ejercicio</h1>
<p>Hay varios conceptos en esta lección, pero todos son fáciles de aplicar. Usa las palabras clave y
cláusulas anteriores para resolver las tareas.</p>
`,
  exercise: {
    dataset: 'pixar',
    tables: ['movies'],
    title: 'Ejercicio 4',
    starter: 'SELECT * FROM movies;',
    tasks: [
      { text: 'Lista todos los directores de películas de Pixar (alfabéticamente), sin duplicados',
        solution: 'SELECT DISTINCT director FROM movies\nORDER BY director ASC;',
        checks: [{ type: 'row_col_val_solution_query_ordered', data: null }] },
      { text: 'Lista las cuatro últimas películas de Pixar estrenadas (de la más reciente a la más antigua)',
        solution: 'SELECT title FROM movies\nORDER BY year DESC\nLIMIT 4;',
        checks: [{ type: 'row_col_val_solution_query_ordered', data: null }] },
      { text: 'Lista las <strong>cinco primeras</strong> películas de Pixar ordenadas alfabéticamente',
        solution: 'SELECT title FROM movies\nORDER BY title ASC\nLIMIT 5;',
        checks: [{ type: 'row_col_val_solution_query_ordered', data: null }] },
      { text: 'Lista las <strong>cinco siguientes</strong> películas de Pixar ordenadas alfabéticamente',
        solution: 'SELECT title FROM movies\nORDER BY title ASC\nLIMIT 5 OFFSET 5;',
        checks: [{ type: 'row_col_val_solution_query_ordered', data: null }] }
    ]
  }
});
