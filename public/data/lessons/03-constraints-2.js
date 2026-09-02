CURSO.register({
  slug: 'where-texto',
  section: 'fundamentos',
  source: 'sqlbolt',
  title: 'Lección 3: Consultas con restricciones (Pt. 2)',
  shortTitle: 'WHERE con texto',
  summary: 'Comparar cadenas, comodines con LIKE y listas con IN.',
  keywords: 'like comodin porcentaje texto cadenas in not like',
  body: `
<p>Cuando escribimos cláusulas <code>WHERE</code> sobre columnas de texto, SQL ofrece varios operadores útiles
para comparar cadenas sin distinguir mayúsculas o para buscar patrones con comodines. Estos son los más
habituales:</p>

<div class="datatable">
    <table class="table">
        <tr><td style="width:16%;text-align:center">Operador</td><td style="width:52%">Condición</td><td>Ejemplo</td></tr>
        <tr><td style="text-align:center">=</td><td>Comparación exacta de cadenas, sensible a mayúsculas (<em>ojo, un solo igual</em>)</td><td>col <span class="faux-keyword">=</span> "abc"</td></tr>
        <tr><td style="text-align:center">!= o &lt;&gt;</td><td>Desigualdad exacta, sensible a mayúsculas</td><td>col <span class="faux-keyword">!=</span> "abcd"</td></tr>
        <tr><td style="text-align:center">LIKE</td><td>Comparación exacta <em>insensible</em> a mayúsculas</td><td>col <span class="faux-keyword">LIKE</span> "ABC"</td></tr>
        <tr><td style="text-align:center">NOT LIKE</td><td>Desigualdad insensible a mayúsculas</td><td>col <span class="faux-keyword">NOT LIKE</span> "ABCD"</td></tr>
        <tr><td style="text-align:center">%</td><td>En cualquier punto de la cadena, sustituye a cero o más caracteres (solo con LIKE / NOT LIKE)</td>
            <td>col <span class="faux-keyword">LIKE</span> "%AT%"<br/>(coincide con "AT", "ATICO", "GAT" o "BATS")</td></tr>
        <tr><td style="text-align:center">_</td><td>Sustituye a un único carácter (solo con LIKE / NOT LIKE)</td>
            <td>col <span class="faux-keyword">LIKE</span> "AN_"<br/>(coincide con "AND", pero no con "AN")</td></tr>
        <tr><td style="text-align:center">IN (…)</td><td>La cadena existe en una lista</td><td>col <span class="faux-keyword">IN</span> ("A", "B", "C")</td></tr>
        <tr><td style="text-align:center">NOT IN (…)</td><td>La cadena no existe en la lista</td><td>col <span class="faux-keyword">NOT IN</span> ("D", "E", "F")</td></tr>
    </table>
</div>

<div class="dyk">
    <div class="desc">¿Sabías que…?</div>
    <p>Todas las cadenas deben ir entrecomilladas para que el analizador de la consulta pueda distinguir
    las palabras del texto de las palabras clave de SQL. El estándar usa comillas simples
    (<code>'texto'</code>); SQLite y MySQL también aceptan comillas dobles.</p>
</div>

<p>Conviene señalar que, aunque la mayoría de bases de datos son bastante eficientes con estos operadores,
la búsqueda de texto completo se resuelve mejor con librerías dedicadas como Apache Lucene, Elasticsearch
o Sphinx, o con las extensiones de texto completo del propio motor (<code>FTS5</code> en SQLite,
<code>tsvector</code> en PostgreSQL).</p>

<h1>Ejercicio</h1>
<p>Aquí tienes de nuevo la definición de una consulta con <code>WHERE</code>. Escribe consultas con los
operadores anteriores para obtener la información que piden las tareas.</p>

<div class="definition">
    <div class="desc">Consulta SELECT con restricciones</div>
    <code class="sql">SELECT columna, otra_columna, …
FROM mi_tabla
<strong>WHERE <i>condición</i>
    AND/OR <i>otra_condición</i>
    AND/OR …</strong>;</code>
</div>
`,
  exercise: {
    dataset: 'pixar',
    tables: ['movies'],
    title: 'Ejercicio 3',
    starter: 'SELECT * FROM movies;',
    tasks: [
      { text: 'Encuentra todas las películas de <em>Toy Story</em>',
        solution: "SELECT title FROM movies\nWHERE title LIKE 'Toy Story%';",
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Encuentra todas las películas dirigidas por <em>John Lasseter</em>',
        solution: "SELECT title FROM movies\nWHERE director = 'John Lasseter';",
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Encuentra todas las películas (y sus directores) <strong>no</strong> dirigidas por <em>John Lasseter</em>',
        solution: "SELECT title, director FROM movies\nWHERE director != 'John Lasseter';",
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Encuentra todas las películas de <em>WALL-*</em>',
        hint: 'Prueba con el comodín <code>%</code>',
        solution: "SELECT title FROM movies\nWHERE title LIKE 'WALL-%';",
        checks: [{ type: 'row_col_val_solution_query', data: null }] }
    ]
  }
});
