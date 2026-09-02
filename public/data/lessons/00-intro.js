CURSO.register({
  slug: 'introduccion-sql',
  section: 'fundamentos',
  source: 'sqlbolt',
  title: 'Introducción a SQL',
  shortTitle: 'Introducción a SQL',
  summary: 'Qué es SQL, qué es una base de datos relacional y cómo está organizado este curso.',
  keywords: 'sql introduccion relacional tablas filas columnas',
  body: `
<p>Bienvenido a <strong>EKOU Academy</strong>, una serie de lecciones y ejercicios interactivos pensados para
que aprendas SQL rápidamente, directamente en tu navegador.</p>

<h1>¿Qué es SQL?</h1>
<p>SQL, o <i>Structured Query Language</i> (lenguaje de consulta estructurado), es un lenguaje diseñado para
que tanto perfiles técnicos como no técnicos puedan consultar, manipular y transformar datos de una base de
datos relacional. Gracias a su sencillez, las bases de datos SQL dan almacenamiento seguro y escalable a
millones de sitios web y aplicaciones móviles.</p>

<div class="dyk">
    <div class="desc">¿Sabías que…?</div>
    <p>Existen muchas bases de datos SQL populares: SQLite, MySQL/MariaDB, PostgreSQL, Oracle y
    Microsoft SQL Server, entre otras. Todas soportan el estándar común del lenguaje SQL —que es lo que
    enseña este sitio—, pero cada implementación difiere en las funciones adicionales y los tipos de
    almacenamiento que admite.</p>
</div>

<h1>Bases de datos relacionales</h1>
<p>Antes de aprender la sintaxis conviene tener un modelo mental de qué es realmente una base de datos
relacional. Una base de datos relacional representa una colección de tablas (bidimensionales) relacionadas
entre sí. Cada tabla se parece a una hoja de cálculo: tiene un número fijo de columnas con nombre —los
atributos o propiedades de la tabla— y cualquier cantidad de filas de datos.</p>

<p>Por ejemplo, si la Dirección General de Tráfico tuviera una base de datos, probablemente encontrarías una
tabla con todos los vehículos que circulan por el país. Esa tabla podría guardar el modelo, el tipo, el
número de ruedas y el número de puertas de cada vehículo.</p>

<div class="datatable_title"><strong>Tabla: Vehiculos</strong></div>
<div class="datatable">
  <table class="table">
    <tr><td>Id</td><td>Marca/Modelo</td><td>Nº ruedas</td><td>Nº puertas</td><td>Tipo</td></tr>
    <tr><td>1</td><td>Ford Focus</td><td>4</td><td>4</td><td>Berlina</td></tr>
    <tr><td>2</td><td>Tesla Roadster</td><td>4</td><td>2</td><td>Deportivo</td></tr>
    <tr><td>3</td><td>Kawasaki Ninja</td><td>2</td><td>0</td><td>Motocicleta</td></tr>
    <tr><td>4</td><td>McLaren Fórmula 1</td><td>4</td><td>0</td><td>Competición</td></tr>
    <tr><td>5</td><td>Tesla S</td><td>4</td><td>4</td><td>Berlina</td></tr>
  </table>
</div>

<p>En una base así encontrarías además otras tablas relacionadas: la lista de conductores registrados, los
tipos de permiso de conducción que se pueden expedir o incluso las infracciones de cada conductor.</p>

<p>Aprender SQL consiste en aprender a responder preguntas concretas sobre esos datos, del tipo
<i>«¿qué tipos de vehículos circulan con menos de cuatro ruedas?»</i> o <i>«¿cuántos modelos de coche
fabrica Tesla?»</i>, para poder tomar mejores decisiones.</p>

<h1>Sobre las lecciones</h1>
<p>Como la mayoría de la gente aprende SQL para trabajar con una base de datos que ya existe, las lecciones
empiezan presentando las distintas partes de una consulta. Las lecciones posteriores enseñan a modificar
una tabla (o el esquema) y a crear tablas desde cero. Después, los temas de ampliación cubren vistas,
índices, restricciones, transacciones, disparadores, procedimientos almacenados, funciones, funciones de
ventana y diseño de bases de datos.</p>

<p>Cada lección introduce un concepto y termina con un ejercicio interactivo. Ve a tu ritmo y no tengas
miedo de experimentar antes de continuar. Si ya conoces SQL puedes saltar directamente a los temas que te
interesen desde el menú lateral.</p>

<div class="callout note">
  <div class="desc">Todo se ejecuta en tu navegador</div>
  <p>Los ejercicios y el Playground usan <strong>SQLite compilado a WebAssembly</strong>. No hay servidor:
  cada lección crea su propia base de datos en memoria, así que puedes romper lo que quieras y pulsar
  «Reiniciar datos» para volver al estado inicial.</p>
</div>
`
});
