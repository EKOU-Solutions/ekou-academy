CURSO.register({
  slug: 'repaso-select',
  section: 'fundamentos',
  source: 'sqlbolt',
  title: 'Repaso: consultas SELECT simples',
  shortTitle: 'Repaso: SELECT simple',
  summary: 'Practica todo lo anterior sobre una tabla nueva de ciudades.',
  keywords: 'repaso practica select where order by limit ciudades',
  body: `
<p>¡Buen trabajo hasta aquí! Ya has probado cómo se escribe una consulta básica; ahora toca practicar
escribiendo consultas que resuelvan problemas reales.</p>

<div class="definition">
    <div class="desc">Consulta SELECT</div>
    <code class="sql">SELECT columna, otra_columna, …
FROM mi_tabla
WHERE <i>condición(es)</i>
ORDER BY columna ASC/DESC
LIMIT num_limite OFFSET num_desplazamiento;</code>
</div>

<h1>Ejercicio</h1>
<p>En el ejercicio siguiente trabajarás con otra tabla, que contiene información sobre algunas de las
ciudades más pobladas de Norteamérica, incluida su población y su posición geográfica.</p>

<div class="dyk">
    <div class="desc">¿Sabías que…?</div>
    <p>Las latitudes positivas corresponden al hemisferio norte y las longitudes positivas al hemisferio
    este. Como Norteamérica está al norte del ecuador y al oeste del meridiano de Greenwich, todas las
    ciudades de la lista tienen latitud positiva y longitud negativa.</p>
</div>

<p>Escribe consultas para obtener la información que piden las tareas. Puede que necesites una combinación
distinta de cláusulas en cada una.</p>
`,
  exercise: {
    dataset: 'misc',
    tables: ['north_american_cities'],
    title: 'Repaso 1',
    starter: 'SELECT * FROM north_american_cities;',
    tasks: [
      { text: 'Lista todas las ciudades canadienses y su población',
        solution: "SELECT city, population FROM north_american_cities\nWHERE country = 'Canada';",
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Ordena todas las ciudades de Estados Unidos por su latitud, de norte a sur',
        hint: 'Las latitudes más pequeñas están más al sur',
        solution: "SELECT city FROM north_american_cities\nWHERE country = 'United States'\nORDER BY latitude DESC;",
        checks: [{ type: 'row_col_val_solution_query_ordered', data: null }] },
      { text: 'Lista todas las ciudades al oeste de Chicago, ordenadas de oeste a este',
        hint: 'Las longitudes más pequeñas están más al oeste',
        solution: 'SELECT city FROM north_american_cities\nWHERE longitude < -87.629798\nORDER BY longitude ASC;',
        checks: [{ type: 'row_col_val_solution_query_ordered', data: null }] },
      { text: 'Lista las dos ciudades más grandes de México (por población)',
        solution: "SELECT city FROM north_american_cities\nWHERE country LIKE 'Mexico'\nORDER BY population DESC\nLIMIT 2;",
        checks: [{ type: 'row_col_val_solution_query_ordered', data: null }] },
      { text: 'Lista la tercera y la cuarta ciudad más grandes (por población) de Estados Unidos y su población',
        solution: "SELECT city FROM north_american_cities\nWHERE country LIKE 'United States'\nORDER BY population DESC\nLIMIT 2 OFFSET 2;",
        checks: [{ type: 'row_col_val_solution_query_ordered', data: null }] }
    ]
  }
});
