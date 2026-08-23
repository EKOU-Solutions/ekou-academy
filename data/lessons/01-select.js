CURSO.register({
  slug: 'select-101',
  section: 'fundamentos',
  source: 'sqlbolt',
  title: 'Lección 1: Consultas SELECT 101',
  shortTitle: 'SELECT 101',
  summary: 'La consulta más básica: elegir columnas de una tabla.',
  keywords: 'select from columnas asterisco consulta',
  body: `
<p>Para recuperar datos de una base de datos SQL necesitamos escribir sentencias <code>SELECT</code>, que
coloquialmente se llaman <i>consultas</i>. Una consulta es simplemente una sentencia que declara qué datos
buscamos, dónde encontrarlos en la base de datos y, opcionalmente, cómo transformarlos antes de
devolverlos.</p>

<p>Como decíamos en la introducción, puedes ver una tabla de SQL como un tipo de entidad (por ejemplo,
<i>Perros</i>) y cada fila de esa tabla como una <i>instancia</i> concreta de ese tipo (un carlino, un
beagle, otro carlino de distinto color…). Las columnas representan entonces las propiedades comunes que
comparten todas las instancias de esa entidad (color del pelo, longitud de la cola…).</p>

<p>Dada una tabla de datos, la consulta más básica que podemos escribir es la que selecciona algunas
columnas (propiedades) con todas sus filas (instancias).</p>

<div class="definition">
    <div class="desc">Consulta SELECT de columnas concretas</div>
    <code class="sql">SELECT columna, otra_columna, …
FROM mi_tabla;</code>
</div>

<p>El resultado de esta consulta será un conjunto bidimensional de filas y columnas: en la práctica, una
copia de la tabla pero solo con las columnas que hemos pedido.</p>

<p>Si queremos recuperar absolutamente todas las columnas, podemos usar el asterisco (<code>*</code>) como
atajo en lugar de escribir los nombres uno a uno.</p>

<div class="definition">
    <div class="desc">Consulta SELECT de todas las columnas</div>
    <code class="sql">SELECT *
FROM mi_tabla;</code>
</div>

<p>Esta consulta es especialmente útil porque es la forma más rápida de inspeccionar una tabla volcando
todos sus datos de una vez.</p>

<h1>Ejercicio</h1>
<p>En la mayoría de ejercicios usaremos una base de datos con información sobre películas clásicas de Pixar.
Este primer ejercicio solo usa la tabla <strong>movies</strong>, y la consulta inicial muestra todas las
propiedades de cada película. Modifícala para obtener exactamente lo que pide cada tarea.</p>
`,
  exercise: {
    dataset: 'pixar',
    tables: ['movies'],
    title: 'Ejercicio 1',
    starter: 'SELECT * FROM movies;',
    tasks: [
      { text: 'Encuentra el <code>title</code> de cada película',
        solution: 'SELECT title FROM movies;',
        checks: [{ type: 'col_equals', data: ['title'] }] },
      { text: 'Encuentra el <code>director</code> de cada película',
        solution: 'SELECT director FROM movies;',
        checks: [{ type: 'col_equals', data: ['director'] }] },
      { text: 'Encuentra el <code>title</code> y el <code>director</code> de cada película',
        solution: 'SELECT title, director FROM movies;',
        checks: [{ type: 'col_equals', data: ['title', 'director'] }] },
      { text: 'Encuentra el <code>title</code> y el <code>year</code> de cada película',
        solution: 'SELECT title, year FROM movies;',
        checks: [{ type: 'col_equals', data: ['title', 'year'] }] },
      { text: 'Encuentra <strong>todos</strong> los datos de cada película',
        solution: 'SELECT * FROM movies;',
        checks: [{ type: 'col_equals', data: ['id', 'title', 'director', 'year', 'length_minutes'] }] }
    ]
  }
});
