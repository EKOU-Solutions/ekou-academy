CURSO.register({
  slug: 'alter-table',
  section: 'ddl',
  source: 'sqlbolt',
  title: 'Lección 17: Modificar tablas',
  shortTitle: 'ALTER TABLE',
  summary: 'Añadir, quitar y renombrar columnas y tablas.',
  keywords: 'alter table add column drop column rename to',
  body: `
<p>A medida que tus datos cambian, SQL te permite actualizar las tablas y el esquema con la sentencia
<code>ALTER TABLE</code>, que añade, elimina o modifica columnas y restricciones.</p>

<h1>Añadir columnas</h1>
<p>La sintaxis es parecida a la de <code>CREATE TABLE</code>. Hay que indicar el tipo de dato junto con
las posibles restricciones y valores por defecto, que se aplican tanto a las filas existentes
<i>como</i> a las nuevas. En algunos motores como MySQL incluso puedes indicar dónde insertar la columna con
<code>FIRST</code> o <code>AFTER</code>, aunque no es estándar.</p>

<div class="definition">
    <div class="desc">Añadir columna(s)</div>
    <code class="sql">ALTER TABLE mi_tabla
ADD columna <i>TipoDato</i> <i>RestricciónOpcional</i>
    DEFAULT valor_por_defecto;</code>
</div>

<h1>Eliminar columnas</h1>
<p>Eliminar una columna es tan simple como indicarla, aunque algunos motores no lo soportan en versiones
antiguas y hay que crear una tabla nueva y migrar los datos.</p>

<div class="definition">
    <div class="desc">Eliminar columna(s)</div>
    <code class="sql">ALTER TABLE mi_tabla
DROP COLUMN columna_a_eliminar;</code>
</div>

<h1>Renombrar la tabla</h1>
<div class="definition">
    <div class="desc">Renombrar tabla</div>
    <code class="sql">ALTER TABLE mi_tabla
RENAME TO nuevo_nombre;</code>
</div>

<div class="callout sqlite">
  <div class="desc">Qué soporta SQLite</div>
  <p>SQLite admite <code>ADD COLUMN</code>, <code>RENAME TO</code>, <code>RENAME COLUMN</code> (3.25+) y
  <code>DROP COLUMN</code> (3.35+). No permite cambiar el tipo de una columna ni añadir restricciones a
  posteriori: para eso hay que crear una tabla nueva, copiar los datos con
  <code>INSERT INTO nueva SELECT … FROM vieja</code>, borrar la vieja y renombrar.</p>
</div>

<h1>Otros cambios</h1>
<p>Cada motor soporta métodos distintos para modificar sus tablas, así que consulta siempre la
documentación de tu base de datos antes de tocar nada en producción. En tablas grandes, un
<code>ALTER TABLE</code> puede bloquear escrituras durante minutos.</p>

<h1>Ejercicio</h1>
<p>Nuestros ejercicios usan una implementación que soporta añadir columnas nuevas; pruébalo abajo.</p>
`,
  exercise: {
    dataset: 'pixar',
    tables: ['movies'],
    title: 'Ejercicio 17',
    starter: 'SELECT * FROM movies;',
    tasks: [
      { text: 'Añade una columna llamada <strong>Aspect_ratio</strong> de tipo <strong>FLOAT</strong> para guardar la relación de aspecto de cada película.',
        postValidateAction: { resultQuery: 'SELECT * FROM movies;', message: 'Columna añadida' },
        solution: 'ALTER TABLE Movies\n  ADD COLUMN Aspect_ratio FLOAT DEFAULT 2.39;',
        queryChecks: ['FLOAT'],
        checks: [{ type: 'assert_query_succeeds', data: 'SELECT aspect_ratio FROM movies;' }] },
      { text: 'Añade otra columna llamada <strong>Language</strong> de tipo <strong>TEXT</strong> para guardar el idioma de estreno. Asegúrate de que su valor por defecto sea <strong>English</strong>.',
        postValidateAction: { resultQuery: 'SELECT * FROM movies;', message: 'Columna añadida' },
        solution: "ALTER TABLE Movies\n  ADD COLUMN Language TEXT DEFAULT 'English';",
        queryChecks: ['DEFAULT', 'English'],
        checks: [{ type: 'assert_query_succeeds', data: 'SELECT language FROM movies;' }] }
    ]
  }
});
