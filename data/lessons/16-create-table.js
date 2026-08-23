CURSO.register({
  slug: 'create-table',
  section: 'ddl',
  source: 'sqlbolt',
  title: 'Lección 16: Crear tablas',
  shortTitle: 'CREATE TABLE',
  summary: 'Definir tablas nuevas, tipos de datos y restricciones básicas.',
  keywords: 'create table tipos datos primary key not null check foreign key',
  body: `
<p>Cuando tienes entidades y relaciones nuevas que guardar, puedes crear una tabla con la sentencia
<code>CREATE TABLE</code>.</p>

<div class="definition">
    <div class="desc">CREATE TABLE con restricción y valor por defecto opcionales</div>
    <code class="sql">CREATE TABLE IF NOT EXISTS mi_tabla (
    columna <i>TipoDato</i> <i>Restricción</i> DEFAULT <i>valor_por_defecto</i>,
    otra_columna <i>TipoDato</i> <i>Restricción</i> DEFAULT <i>valor_por_defecto</i>,
    …
);</code>
</div>

<p>La estructura de la tabla nueva la define su <i>esquema</i>, que declara una serie de columnas. Cada
columna tiene un nombre, el tipo de dato permitido, una restricción <i>opcional</i> sobre los valores que se
insertan y un valor por defecto opcional.</p>

<p>Si ya existe una tabla con el mismo nombre, la mayoría de motores lanzan un error; para evitarlo y
saltarte la creación, usa la cláusula <code>IF NOT EXISTS</code>.</p>

<h1>Tipos de datos</h1>
<div class="datatable">
    <table class="table">
        <tr><td style="width:32%">Tipo de dato</td><td>Descripción</td></tr>
        <tr><td><code>INTEGER</code>, <code>BOOLEAN</code></td>
            <td>Enteros: un recuento, una edad… En algunas implementaciones el booleano se representa simplemente como un entero 0 o 1.</td></tr>
        <tr><td><code>FLOAT</code>, <code>DOUBLE</code>, <code>REAL</code>, <code>DECIMAL(p,s)</code></td>
            <td>Números con parte decimal: medidas, fracciones… Para dinero se recomienda <code>DECIMAL/NUMERIC</code>, que es exacto, en lugar de coma flotante.</td></tr>
        <tr><td><code>CHARACTER(n)</code>, <code>VARCHAR(n)</code>, <code>TEXT</code></td>
            <td><p>Tipos de texto. La diferencia entre ellos suele reducirse a la eficiencia interna del motor.</p>
                <p><code>CHARACTER</code> y <code>VARCHAR</code> se declaran con el número máximo de caracteres que admiten (los valores más largos pueden truncarse), lo que puede ser más eficiente en tablas grandes.</p></td></tr>
        <tr><td><code>DATE</code>, <code>TIME</code>, <code>DATETIME</code>, <code>TIMESTAMP</code></td>
            <td>Fechas y marcas de tiempo para series temporales y eventos. Pueden ser delicados al trabajar con zonas horarias.</td></tr>
        <tr><td><code>BLOB</code></td>
            <td>Datos binarios guardados directamente en la base. Suelen ser opacos para el motor, así que normalmente hay que guardarlos junto a metadatos para poder recuperarlos.</td></tr>
    </table>
</div>

<div class="callout sqlite">
  <div class="desc">SQLite y los tipos</div>
  <p>SQLite usa <em>afinidad de tipo</em> en lugar de tipos estrictos: puedes declarar
  <code>VARCHAR(20)</code> y guardar un número. Los tipos reales son <code>NULL</code>,
  <code>INTEGER</code>, <code>REAL</code>, <code>TEXT</code> y <code>BLOB</code>. Desde 3.37 existen las
  <code>STRICT TABLE</code>, que sí obligan al tipo declarado.</p>
</div>

<h1>Restricciones de tabla</h1>
<div class="datatable">
    <table class="table">
        <tr><td style="width:32%">Restricción</td><td>Descripción</td></tr>
        <tr><td><code>PRIMARY KEY</code></td><td>Los valores de esta columna son únicos y cada valor identifica una única fila de la tabla.</td></tr>
        <tr><td><code>AUTOINCREMENT</code></td><td>Para enteros: el valor se rellena e incrementa automáticamente en cada inserción. No está en todos los motores (MySQL usa <code>AUTO_INCREMENT</code>, PostgreSQL <code>SERIAL</code> o <code>GENERATED … AS IDENTITY</code>).</td></tr>
        <tr><td><code>UNIQUE</code></td><td>Los valores han de ser únicos: no puedes insertar otra fila con el mismo valor. Se diferencia de <code>PRIMARY KEY</code> en que no tiene por qué ser la clave de la fila.</td></tr>
        <tr><td><code>NOT NULL</code></td><td>El valor insertado no puede ser <code>NULL</code>.</td></tr>
        <tr><td><code>CHECK (expresión)</code></td><td>Permite evaluar una expresión más compleja para comprobar si los valores son válidos: que sean positivos, mayores que cierto tamaño, que empiecen por un prefijo…</td></tr>
        <tr><td><code>FOREIGN KEY</code></td><td>Comprobación de coherencia que garantiza que cada valor de esta columna se corresponde con un valor de una columna de otra tabla.<br/><br/>Por ejemplo, con una tabla de empleados por ID y otra con sus nóminas, la <code>FOREIGN KEY</code> asegura que cada fila de nóminas apunta a un empleado válido.</td></tr>
    </table>
</div>

<p>Profundizamos en todas ellas en el tema <a href="#/restricciones-claves">Restricciones e integridad
referencial</a>.</p>

<h1>Un ejemplo</h1>
<div class="definition">
    <div class="desc">Esquema de la tabla movies</div>
    <code class="sql">CREATE TABLE movies (
    id INTEGER PRIMARY KEY,
    title TEXT,
    director TEXT,
    year INTEGER,
    length_minutes INTEGER
);</code>
</div>

<h1>Ejercicio</h1>
<p>Crea una tabla nueva para poder insertar filas en ella.</p>
`,
  exercise: {
    dataset: 'misc',
    tables: [],
    title: 'Ejercicio 16',
    starter: '',
    tasks: [
      { text: 'Crea una tabla nueva llamada <code>Database</code> con estas columnas:<br/><p>' +
              '– <code>Name</code>: una cadena (texto) con el nombre de la base de datos<br/>' +
              '– <code>Version</code>: un número (coma flotante) con la última versión<br/>' +
              '– <code>Download_count</code>: un entero con las veces que se ha descargado<br/></p>' +
              'La tabla no tiene restricciones.',
        postValidateAction: {
          runActionOnce: "INSERT INTO database VALUES ('SQLite', 3.9, 92000000), ('MySQL', 5.5, 512000000), ('Postgres', 9.4, 384000000);",
          resultQuery: 'SELECT * FROM database;',
          message: 'Tabla creada'
        },
        solution: 'CREATE TABLE Database (\n    Name TEXT,\n    Version FLOAT,\n    Download_count INTEGER\n);',
        checks: [{ type: 'assert_query_succeeds', data: 'SELECT Name, Version, Download_count FROM database;', failQuery: 'DROP TABLE IF EXISTS database;' }] }
    ]
  }
});
