CURSO.register({
  slug: 'agregados',
  section: 'agregados',
  source: 'sqlbolt',
  title: 'Lección 10: Consultas con agregados (Pt. 1)',
  shortTitle: 'COUNT, SUM, AVG y GROUP BY',
  summary: 'Resumir grupos de filas con funciones de agregado.',
  keywords: 'count sum avg min max group by agregados',
  body: `
<p>Además de las expresiones simples de la lección anterior, SQL soporta expresiones (o funciones)
<i>de agregado</i>, que permiten resumir información sobre un grupo de filas. Con la base de datos de Pixar,
las funciones de agregado responden preguntas como «¿cuántas películas ha producido Pixar?» o «¿cuál es la
película más taquillera de cada año?».</p>

<div class="definition">
    <div class="desc">SELECT con funciones de agregado sobre todas las filas</div>
    <code class="sql"><strong>SELECT FUNC_AGG(<i>columna_o_expresión</i>) AS descripción_agregado</strong>, …
FROM mi_tabla
WHERE <i>expresión_de_restricción</i>;</code>
</div>

<p>Sin una agrupación explícita, cada función de agregado se ejecuta sobre todo el conjunto de filas
resultantes y devuelve un único valor. Igual que con las expresiones normales, ponerles un alias hace que
los resultados sean más fáciles de leer y procesar.</p>

<h1>Funciones de agregado habituales</h1>
<div class="datatable">
    <table class="table">
        <tr><td style="width:26%">Función</td><td>Descripción</td></tr>
        <tr><td><strong>COUNT(</strong>*<strong>)</strong>, <strong>COUNT(</strong><i>columna</i><strong>)</strong></td>
            <td>Cuenta el número de filas del grupo si no se indica columna. Si se indica una, cuenta las filas con valor <em>no nulo</em> en esa columna.</td></tr>
        <tr><td><strong>MIN(</strong><i>columna</i><strong>)</strong></td><td>Encuentra el valor más pequeño de la columna en todas las filas del grupo.</td></tr>
        <tr><td><strong>MAX(</strong><i>columna</i><strong>)</strong></td><td>Encuentra el valor más grande de la columna en todas las filas del grupo.</td></tr>
        <tr><td><strong>AVG(</strong><i>columna</i><strong>)</strong></td><td>Calcula la media de los valores numéricos de la columna.</td></tr>
        <tr><td><strong>SUM(</strong><i>columna</i><strong>)</strong></td><td>Suma todos los valores numéricos de la columna.</td></tr>
    </table>
</div>

<div class="callout note">
  <div class="desc">COUNT(*) frente a COUNT(columna)</div>
  <p><code>COUNT(*)</code> cuenta filas. <code>COUNT(columna)</code> ignora los <code>NULL</code>. Y
  <code>COUNT(DISTINCT columna)</code> cuenta valores distintos no nulos. Los tres pueden dar números
  diferentes sobre los mismos datos.</p>
</div>

<h1>Agregados por grupos</h1>
<p>Además de agregar sobre todas las filas, puedes aplicar las funciones a grupos concretos de datos (por
ejemplo, la recaudación de las comedias frente a las de acción). Eso genera tantos resultados como grupos
únicos defina la cláusula <code>GROUP BY</code>.</p>

<div class="definition">
    <div class="desc">SELECT con funciones de agregado por grupos</div>
    <code class="sql">SELECT FUNC_AGG(<i>columna_o_expresión</i>) AS descripción_agregado, …
FROM mi_tabla
WHERE <i>expresión_de_restricción</i>
<strong>GROUP BY columna</strong>;</code>
</div>

<p>La cláusula <code>GROUP BY</code> agrupa las filas que tienen el mismo valor en la columna indicada.</p>

<h1>Ejercicio</h1>
<p>En este ejercicio trabajamos con la tabla <strong>employees</strong>. Fíjate en que sus filas comparten
datos, lo que nos da la oportunidad de usar agregados para resumir métricas de los equipos.</p>
`,
  exercise: {
    dataset: 'misc',
    tables: ['employees', 'buildings'],
    title: 'Ejercicio 10',
    starter: 'SELECT * FROM employees;',
    tasks: [
      { text: 'Encuentra el mayor número de años que lleva una persona en el estudio',
        hint: 'Usa <strong>MAX()</strong> sobre los años trabajados.',
        solution: 'SELECT MAX(years_employed) as Max_years_employed\nFROM employees;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Para cada rol, encuentra la media de años trabajados por sus empleados',
        hint: 'Agrupa por <strong>role</strong> y aplica <strong>AVG()</strong>.',
        solution: 'SELECT role, AVG(years_employed) as Average_years_employed\nFROM employees\nGROUP BY role;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] },
      { text: 'Encuentra el total de años trabajados por los empleados de cada edificio',
        hint: 'Agrupa por <strong>building</strong> y aplica <strong>SUM()</strong>.',
        solution: 'SELECT building, SUM(years_employed) as Total_years_employed\nFROM employees\nGROUP BY building;',
        checks: [{ type: 'row_col_val_solution_query', data: null }] }
    ]
  }
});
