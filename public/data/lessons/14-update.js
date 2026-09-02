CURSO.register({
  slug: 'update',
  section: 'dml',
  source: 'sqlbolt',
  title: 'Lección 14: Actualizar filas',
  shortTitle: 'UPDATE',
  summary: 'Modificar datos existentes sin destrozar la tabla entera.',
  keywords: 'update set where modificar datos',
  body: `
<p>Además de añadir datos, una tarea habitual es actualizar los que ya existen, y eso se hace con una
sentencia <code>UPDATE</code>. Igual que con <code>INSERT</code>, hay que indicar exactamente qué tabla, qué
columnas y qué filas se actualizan. Los datos deben coincidir con el tipo de la columna en el esquema.</p>

<div class="definition">
    <div class="desc">Sentencia UPDATE con valores</div>
    <code class="sql">UPDATE mi_tabla
SET columna = valor_o_expr,
    otra_columna = otro_valor_o_expr,
    …
WHERE condición;</code>
</div>

<p>La sentencia toma varios pares columna/valor y aplica esos cambios a todas y cada una de las filas que
cumplen la restricción del <code>WHERE</code>.</p>

<h1>Mucho cuidado</h1>
<p>Casi todo el mundo que trabaja con SQL <strong>va</strong> a equivocarse actualizando datos alguna vez:
actualizar el conjunto de filas equivocado en producción o —el clásico— olvidarse del <code>WHERE</code>,
lo que aplica el cambio a <i>todas</i> las filas.</p>

<div class="callout danger">
    <div class="desc">Regla de oro</div>
    <p>Escribe primero la restricción y pruébala en un <code>SELECT</code> para confirmar que afecta a las
    filas correctas; solo entonces escribe los pares columna/valor. En producción, además, envuelve el
    cambio en una transacción (<a href="#/transacciones">Transacciones</a>) para poder deshacerlo.</p>
</div>

<h1>Ejercicio</h1>
<p>Parece que parte de la información de nuestra base de <strong>movies</strong> es incorrecta. Arréglala con
las tareas siguientes.</p>
`,
  exercise: {
    dataset: 'pixar',
    tables: ['movies'],
    title: 'Ejercicio 14',
    starter: 'SELECT * FROM movies;',
    preload: {
      movies: "UPDATE movies SET director = 'El Directore' WHERE id = 2;\n" +
              "UPDATE movies SET year = 1899 WHERE id = 3;\n" +
              "UPDATE movies SET title = 'Toy Story 8', director = 'El Directore' WHERE id = 11;"
    },
    tasks: [
      { text: "El director de <em>A Bug's Life</em> es incorrecto: en realidad la dirigió <strong>John Lasseter</strong>",
        postValidateAction: { resultQuery: 'SELECT * FROM movies;', message: 'Fila(s) actualizada(s)' },
        solution: "UPDATE movies\nSET director = 'John Lasseter'\nWHERE id = 2;",
        checks: [
          { type: 'row_count_query_range', data: { query: "SELECT * FROM movies \nWHERE director = 'John Lasseter';", minCount: 5, maxCount: 5 } },
          { type: 'row_count_query_range', data: { query: "SELECT * FROM movies \nWHERE id = 2 AND director = 'John Lasseter';", minCount: 1, maxCount: 1 } }
        ] },
      { text: 'El año de estreno de <em>Toy Story 2</em> es incorrecto: se estrenó en <strong>1999</strong>',
        postValidateAction: { resultQuery: 'SELECT * FROM movies;', message: 'Fila(s) actualizada(s)' },
        solution: 'UPDATE movies\nSET year = 1999\nWHERE id = 3;',
        checks: [{ type: 'row_count_query_range', data: { query: 'SELECT * FROM movies \nWHERE id = 3 AND year = 1999;', minCount: 1, maxCount: 1 } }] },
      { text: '¡El título y el director de <em>Toy Story 8</em> están mal! El título debería ser "Toy Story 3" y la dirigió <strong>Lee Unkrich</strong>',
        postValidateAction: { resultQuery: 'SELECT * FROM movies;', message: 'Fila(s) actualizada(s)' },
        solution: "UPDATE movies\nSET title = 'Toy Story 3', director = 'Lee Unkrich'\nWHERE id = 11;",
        checks: [{ type: 'row_count_query_range', data: { query: "SELECT * FROM movies \nWHERE id = 11 AND title = 'Toy Story 3' AND director = 'Lee Unkrich';", minCount: 1, maxCount: 1 } }] }
    ]
  }
});
