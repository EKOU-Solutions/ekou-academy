/* Registro global del temario. Cada archivo de data/lessons/ llama a CURSO.register(). */
(function () {
  const SECTIONS = [
    { id: 'fundamentos', name: 'Fundamentos', hint: 'De cero a SELECT' },
    { id: 'multitabla', name: 'Consultas multitabla', hint: 'JOINs, NULLs y expresiones' },
    { id: 'agregados', name: 'Agregados y ejecución', hint: 'GROUP BY, HAVING, orden de ejecución' },
    { id: 'dml', name: 'Modificar datos (DML)', hint: 'INSERT, UPDATE, DELETE' },
    { id: 'ddl', name: 'Definir el esquema (DDL)', hint: 'CREATE, ALTER, DROP' },
    { id: 'intermedio', name: 'SQL intermedio', hint: 'Subconsultas, conjuntos, CASE' },
    { id: 'funciones', name: 'Funciones', hint: 'Escalares, fechas, ventana' },
    { id: 'objetos', name: 'Objetos de base de datos', hint: 'Vistas, índices, restricciones' },
    { id: 'programacion', name: 'Programación en la base de datos', hint: 'Transacciones, triggers, procedimientos' },
    { id: 'diseno', name: 'Diseño y rendimiento', hint: 'Normalización, planes de ejecución' },
    { id: 'java', name: 'Java', hint: 'JDK, JVM y ejecución' },
    { id: 'referencia', name: 'Referencia', hint: 'Chuleta y equivalencias entre motores' }
  ];

  const lessons = [];
  const bySlug = Object.create(null);

  const CURSO = {
    SECTIONS,
    lessons,
    register(lesson) {
      if (bySlug[lesson.slug]) {
        console.warn('Slug duplicado:', lesson.slug);
        return;
      }
      lesson.index = lessons.length;
      lessons.push(lesson);
      bySlug[lesson.slug] = lesson;
    },
    get(slug) { return bySlug[slug] || null; },
    ordered() { return lessons; },
    next(slug) {
      const l = bySlug[slug];
      return l && lessons[l.index + 1] ? lessons[l.index + 1] : null;
    },
    prev(slug) {
      const l = bySlug[slug];
      return l && l.index > 0 ? lessons[l.index - 1] : null;
    },
    bySection() {
      return SECTIONS.map(s => ({
        section: s,
        items: lessons.filter(l => l.section === s.id)
      })).filter(g => g.items.length);
    }
  };

  window.CURSO = CURSO;
})();
