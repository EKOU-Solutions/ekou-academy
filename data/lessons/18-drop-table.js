CURSO.register({
  slug: 'drop-table',
  section: 'ddl',
  source: 'sqlbolt',
  title: 'Lección 18: Eliminar tablas',
  shortTitle: 'DROP TABLE',
  summary: 'Borrar una tabla entera, datos y esquema incluidos.',
  keywords: 'drop table if exists eliminar tabla',
  body: `
<p>En algunos casos querrás eliminar una tabla entera, incluidos sus datos y sus metadatos. Para eso está
<code>DROP TABLE</code>, que se diferencia de <code>DELETE</code> en que también elimina el esquema de la
base de datos.</p>

<div class="definition">
    <div class="desc">Sentencia DROP TABLE</div>
    <code class="sql">DROP TABLE IF EXISTS mi_tabla;</code>
</div>

<p>Igual que con <code>CREATE TABLE</code>, el motor puede lanzar un error si la tabla no existe; para
silenciarlo usa <code>IF EXISTS</code>.</p>

<p>Además, si tienes otra tabla que depende de columnas de la que vas a eliminar (por ejemplo con una
<code>FOREIGN KEY</code>), tendrás que actualizar primero las tablas dependientes para quitar las filas
dependientes, o eliminarlas también.</p>

<div class="callout danger">
  <div class="desc">Irreversible</div>
  <p>Un <code>DROP TABLE</code> confirmado no se deshace sin una copia de seguridad. En PostgreSQL y SQLite
  el DDL sí es transaccional (puedes hacer <code>ROLLBACK</code> si aún no has confirmado); en MySQL con
  InnoDB, no: cada sentencia DDL hace un <em>commit</em> implícito.</p>
</div>

<h1>Ejercicio</h1>
<p>Hemos llegado al final de los ejercicios básicos: hagamos limpieza eliminando las tablas con las que
hemos trabajado.</p>
`,
  exercise: {
    dataset: 'pixar',
    tables: ['movies', 'boxoffice'],
    title: 'Ejercicio 18',
    starter: 'SELECT * FROM movies;',
    tasks: [
      { text: 'Hagamos limpieza eliminando la tabla <strong>movies</strong>',
        postValidateAction: { message: 'Tabla eliminada' },
        solution: 'DROP TABLE Movies;',
        checks: [{ type: 'assert_query_fails', data: 'SELECT * FROM movies;' }] },
      { text: 'Elimina también la tabla <strong>boxoffice</strong>',
        postValidateAction: { message: 'Tabla eliminada' },
        solution: 'DROP TABLE BoxOffice;',
        checks: [{ type: 'assert_query_fails', data: 'SELECT * FROM boxoffice;' }] }
    ]
  }
});
