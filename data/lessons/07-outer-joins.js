CURSO.register({
  slug: 'outer-join',
  section: 'multitabla',
  source: 'sqlbolt',
  title: 'Lección 7: OUTER JOIN',
  shortTitle: 'LEFT / RIGHT / FULL JOIN',
  summary: 'Conservar filas sin pareja al combinar tablas asimétricas.',
  keywords: 'left join right join full join outer join',
  body: `
<p>Según cómo quieras analizar los datos, el <code>INNER JOIN</code> de la lección anterior puede no bastar,
porque la tabla resultante solo contiene los datos que están en <em>ambas</em> tablas.</p>

<p>Si las dos tablas tienen datos asimétricos —algo muy fácil cuando la información se introduce en momentos
distintos—, habrá que usar <code>LEFT JOIN</code>, <code>RIGHT JOIN</code> o <code>FULL JOIN</code> para
asegurarnos de que no se queda fuera nada que necesitemos.</p>

<div class="definition">
    <div class="desc">Consulta SELECT con LEFT/RIGHT/FULL JOIN</div>
    <code class="sql">SELECT columna, otra_columna, …
FROM mi_tabla
<strong>INNER/LEFT/RIGHT/FULL JOIN otra_tabla
    ON mi_tabla.id = otra_tabla.id_correspondiente</strong>
WHERE <i>condición(es)</i>
ORDER BY columna, … ASC/DESC
LIMIT num_limite OFFSET num_desplazamiento;</code>
</div>

<p>Igual que el <code>INNER JOIN</code>, estos tres joins tienen que indicar por qué columna se combinan los
datos. Al unir la tabla A con la B, un <code>LEFT JOIN</code> incluye las filas de A tanto si encuentra una
fila coincidente en B como si no. El <code>RIGHT JOIN</code> hace lo mismo al revés: conserva las filas de B
haya o no coincidencia en A. Y el <code>FULL JOIN</code> conserva las filas de ambas tablas, exista o no
pareja en la otra.</p>

<p>Al usar cualquiera de estos joins seguramente tendrás que escribir lógica adicional para tratar los
<code>NULL</code> del resultado (más sobre esto en la siguiente lección).</p>

<div class="dyk">
    <div class="desc">¿Sabías que…?</div>
    <p>Verás consultas escritas como <code>LEFT OUTER JOIN</code>, <code>RIGHT OUTER JOIN</code> o
    <code>FULL OUTER JOIN</code>, pero la palabra <code>OUTER</code> se mantiene solo por compatibilidad con
    SQL-92: son equivalentes a <code>LEFT JOIN</code>, <code>RIGHT JOIN</code> y <code>FULL JOIN</code>.</p>
</div>

<div class="callout sqlite">
  <div class="desc">Nota sobre SQLite</div>
  <p>Las versiones modernas de SQLite (3.39+) ya soportan <code>RIGHT JOIN</code> y <code>FULL JOIN</code>.
  Aun así, cualquier <code>RIGHT JOIN</code> puede reescribirse como un <code>LEFT JOIN</code> intercambiando
  el orden de las tablas, y un <code>FULL JOIN</code> como la <code>UNION</code> de un left join y un right
  join. En el ejercicio usa el <code>LEFT JOIN</code>.</p>
</div>

<h1>Ejercicio</h1>
<p>Vas a trabajar con una tabla nueva con datos ficticios sobre los <strong>empleados</strong> del estudio y
los <strong>edificios</strong> de oficinas asignados. Algunos edificios son nuevos y todavía no tienen
empleados, pero igualmente necesitamos información sobre ellos.</p>
`,
  exercise: {
    dataset: 'misc',
    tables: ['buildings', 'employees'],
    title: 'Ejercicio 7',
    starter: 'SELECT * FROM employees;',
    tasks: [
      { text: 'Encuentra la lista de todos los edificios que tienen empleados',
        solution: 'SELECT DISTINCT building FROM employees;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Encuentra la lista de todos los edificios y su capacidad',
        solution: 'SELECT * FROM buildings;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Lista todos los edificios y los distintos roles de empleado de cada uno (incluidos los edificios vacíos)',
        hint: 'Prueba un <code>LEFT JOIN</code> desde <code>buildings</code> hacia <code>employees</code>.',
        solution: 'SELECT DISTINCT building_name, role \nFROM buildings \n  LEFT JOIN employees\n    ON building_name = building;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] }
    ]
  }
});
