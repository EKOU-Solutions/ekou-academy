CURSO.register({
  slug: 'fin-del-tutorial',
  section: 'ddl',
  source: 'sqlbolt',
  title: 'Lección X: ¡Hasta el infinito y más allá!',
  shortTitle: 'Fin del tutorial básico',
  summary: 'Has terminado el temario original. Esto es lo que viene después.',
  keywords: 'fin resumen siguiente pasos',
  body: `
<div class="callout note">
  <div class="desc">🎉 ¡Has terminado el tutorial básico!</div>
  <p>Ya has visto todas las piezas fundamentales de SQL: consultas, filtros, orden, joins, agregados,
  modificación de datos y definición de tablas.</p>
</div>

<p>Esperamos que las lecciones te hayan dado experiencia con SQL y confianza para usarlo con tus propios
datos. Pero solo hemos rascado la superficie de lo que SQL puede hacer.</p>

<h1>Qué viene ahora</h1>
<p>A partir de aquí el curso continúa con temas que en el sitio original solo se esbozaban o directamente
no existían:</p>
<ul>
  <li><strong>Subconsultas y operaciones de conjunto</strong> — consultas dentro de consultas, <code>UNION</code>, <code>INTERSECT</code>, <code>EXCEPT</code>.</li>
  <li><strong>Expresiones condicionales</strong> — <code>CASE</code>, <code>COALESCE</code>, <code>NULLIF</code>.</li>
  <li><strong>Funciones</strong> — escalares, de texto, de fecha y hora, y funciones de ventana.</li>
  <li><strong>Objetos de base de datos</strong> — vistas, índices y restricciones de integridad.</li>
  <li><strong>Programación en la base de datos</strong> — transacciones, disparadores, procedimientos almacenados, funciones definidas por el usuario, cursores y manejo de errores.</li>
  <li><strong>Diseño y rendimiento</strong> — normalización, planes de ejecución y seguridad con usuarios y permisos.</li>
</ul>

<p>Y siempre tienes el <a href="#/playground">Playground</a> para experimentar libremente con cualquiera de
estos temas sobre bases de datos de ejemplo.</p>

<p>Si necesitas más detalle, lee también la documentación del motor concreto que uses: cada base de datos
tiene su propio conjunto de funciones y optimizaciones.</p>
`
});
