CURSO.register({
  slug: 'nulls',
  section: 'multitabla',
  source: 'sqlbolt',
  title: 'Lección 8: Una nota sobre los NULL',
  shortTitle: 'Valores NULL',
  summary: 'Qué significa NULL y cómo comprobarlo con IS NULL.',
  keywords: 'null is null is not null valores nulos',
  body: `
<p>Como prometimos en la lección anterior, vamos a hablar brevemente de los valores <code>NULL</code>.
Siempre conviene reducir la posibilidad de tener <code>NULL</code> en la base de datos, porque exigen atención
especial al construir consultas y restricciones (hay funciones que se comportan de otra forma con nulos) y
al procesar los resultados.</p>

<p>Una alternativa a los <code>NULL</code> es usar <em>valores por defecto apropiados para el tipo de
dato</em>: 0 para números, cadena vacía para texto, etc. Pero si tu base de datos necesita guardar
información incompleta, los <code>NULL</code> pueden ser lo correcto si los valores por defecto distorsionan
análisis posteriores (por ejemplo, al calcular medias).</p>

<p>A veces tampoco es posible evitarlos, como vimos en la lección anterior al hacer un outer join de dos
tablas con datos asimétricos. En esos casos puedes comprobar si una columna es nula dentro de un
<code>WHERE</code> usando <code>IS NULL</code> o <code>IS NOT NULL</code>.</p>

<div class="definition">
    <div class="desc">Consulta SELECT con restricciones sobre valores NULL</div>
    <code class="sql">SELECT columna, otra_columna, …
FROM mi_tabla
<strong>WHERE columna IS/IS NOT NULL</strong>
AND/OR <i>otra_condición</i>
AND/OR …;</code>
</div>

<div class="callout danger">
  <div class="desc">Cuidado: NULL no se compara con =</div>
  <p><code>columna = NULL</code> nunca es cierto, ni siquiera cuando la columna es nula: en la lógica
  ternaria de SQL el resultado es <i>desconocido</i>, no <i>verdadero</i>. Por eso existen
  <code>IS NULL</code> e <code>IS NOT NULL</code>. Igualmente, <code>NULL &lt;&gt; 5</code> tampoco es cierto.
  Y ojo con <code>NOT IN</code>: si la lista contiene un <code>NULL</code>, la condición nunca devuelve
  filas.</p>
</div>

<h1>Ejercicio</h1>
<p>Este ejercicio es un repaso de las últimas lecciones. Usamos las mismas tablas
<strong>employees</strong> y <strong>buildings</strong>, pero hemos contratado a un par de personas más que
todavía no tienen edificio asignado.</p>
`,
  exercise: {
    dataset: 'misc',
    tables: ['buildings', 'employees'],
    title: 'Ejercicio 8',
    starter: 'SELECT * FROM employees;',
    preload: {
      employees: "INSERT INTO employees (role, name, building, years_employed) VALUES ('Engineer', 'Yancy I.', NULL, 0);" +
                 "INSERT INTO employees (role, name, building, years_employed) VALUES ('Artist', 'Oliver P.', NULL, 0);"
    },
    tasks: [
      { text: 'Encuentra el nombre y el rol de todos los empleados que no tienen edificio asignado',
        hint: 'El <strong>building</strong> de esos empleados tendrá valor NULL.',
        solution: 'SELECT name, role FROM employees\nWHERE building IS NULL;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Encuentra los nombres de los edificios que no albergan a ningún empleado',
        hint: 'Saca los roles de empleado de cada edificio (como en la lección anterior): los edificios sin empleados tendrán <code>role</code> NULL.',
        solution: 'SELECT DISTINCT building_name\nFROM buildings \n  LEFT JOIN employees\n    ON building_name = building\nWHERE role IS NULL;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] }
    ]
  }
});
