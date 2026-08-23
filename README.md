# EKOU Academy

Copia en español del curso interactivo de [SQLBolt](https://sqlbolt.com), **ampliada** con los temas que
el original no cubre (vistas, índices, restricciones, transacciones, disparadores, procedimientos
almacenados, funciones, funciones de ventana, CTEs, normalización, rendimiento y seguridad) y con un
**Playground SQL** para practicar cualquiera de ellos.

Todo se ejecuta en el navegador con SQLite compilado a WebAssembly (`sql.js`). No hay backend, ni build,
ni base de datos que instalar.

## Arrancar

```bash
npm run start
```

Y abre <http://localhost:4173>. Cualquier servidor estático vale; lo que **no** funciona es abrir
`index.html` con `file://`, porque el navegador bloquea la carga del `.wasm`.

## Qué hay dentro

| Ruta | Contenido |
|---|---|
| `index.html` | Única página; carga los datos y los módulos en orden |
| `assets/js/i18n.js` | Catálogo de cadenas de interfaz y traducciones del temario |
| `assets/js/registry.js` | Registro del temario y sus secciones |
| `assets/js/engine.js` | SQLite en el navegador: crear bases, ejecutar scripts, leer el esquema, funciones de usuario |
| `assets/js/checker.js` | Verificación de las tareas de cada ejercicio |
| `assets/js/exercise.js` | Widget de ejercicio (editor + resultados + tareas) |
| `assets/js/playground.js` | Playground SQL |
| `assets/js/app.js` | Router, barra lateral, temas claro/oscuro, progreso |
| `assets/js/ui.js` | Tabla de resultados, editor, toasts, progreso en `localStorage` |
| `data/datasets.js` | Las tres bases de ejemplo |
| `data/lessons/*.js` | Un archivo por tema: texto + ejercicio (español) |
| `data/i18n/en-*.js` | Traducción al inglés de cada tema y de sus tareas |
| `data/raw/` | El material scrapeado tal cual (ver más abajo) |
| `tools/` | Scraper, copia de dependencias y pruebas |

## El temario

39 temas en 11 secciones, 35 de ellos con ejercicio corregido automáticamente (115 tareas en total).

1. **Fundamentos** — introducción, `SELECT`, `WHERE` con números y texto, `DISTINCT`/`ORDER BY`/`LIMIT`, repaso.
2. **Consultas multitabla** — `INNER JOIN`, `LEFT`/`RIGHT`/`FULL JOIN`, `NULL`, expresiones y alias.
3. **Agregados y ejecución** — `COUNT`/`SUM`/`AVG`/`GROUP BY`, `HAVING`, orden de ejecución.
4. **DML** — `INSERT`, `UPDATE`, `DELETE`.
5. **DDL** — `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`.
6. **SQL intermedio** — subconsultas, `UNION`/`INTERSECT`/`EXCEPT`, `CASE`, CTEs y recursión.
7. **Funciones** — escalares, de fecha y hora, de ventana.
8. **Objetos** — vistas, índices y planes de ejecución, restricciones e integridad referencial.
9. **Programación** — transacciones, disparadores, procedimientos almacenados, funciones de usuario, cursores y errores.
10. **Diseño y rendimiento** — normalización, rendimiento, usuarios y permisos.
11. **Referencia** — chuleta con equivalencias entre SQLite, PostgreSQL, MySQL, SQL Server y Oracle.

### Temas que SQLite no soporta

SQLite no tiene procedimientos almacenados, ni `CREATE FUNCTION`, ni usuarios y permisos. Esos tres temas
están marcados como **referencia**: incluyen la sintaxis real de MySQL, PostgreSQL, SQL Server y Oracle,
y sus ejercicios practican la parte que sí se puede ejecutar (el cuerpo del procedimiento, las funciones
de usuario registradas desde JavaScript, las alternativas basadas en conjuntos a los cursores).

## Idiomas

El sitio está en **español e inglés**. El selector `ES / EN` de la cabecera cambia todo a la vez: cuerpo de
las lecciones, títulos, resúmenes, enunciados y pistas de los ejercicios, mensajes del corrector, interfaz
del Playground, nombres de las bases de ejemplo e incluso los comentarios de los ejemplos SQL.

- El idioma inicial se toma de `navigator.language` y, a partir de ahí, del que elijas: se guarda en
  `localStorage`.
- El español vive en los propios archivos de `data/lessons/`. El inglés se registra aparte, en
  `data/i18n/en-*.js`, con `I18N.registerLessons('en', { … })`. Si falta una traducción, se muestra el
  español en su lugar en vez de romperse.
- Las cadenas de interfaz están en un único diccionario dentro de `assets/js/i18n.js`, con `t('clave')` y
  parámetros del tipo `{n}`.

Para **añadir un idioma nuevo** (por ejemplo portugués):

1. Añade `'pt'` a `SUPPORTED` y un bloque `pt: { … }` al diccionario de `assets/js/i18n.js`.
2. Crea `data/i18n/pt-*.js` con `I18N.registerLessons('pt', { … })` y enlázalos en `index.html`.
3. Añade un botón `<button data-lang="pt">PT</button>` al `#langSwitch`.
4. Ejecuta `npm test`: `tools/test-i18n.js` te dirá exactamente qué falta.

El SQL de los ejercicios, los nombres de las tablas y los datos de ejemplo están en español en las tres
bases: se comparten entre idiomas para que las soluciones sean las mismas.

## Bases de datos de ejemplo

- **Pixar** — `movies`, `boxoffice`, `movie_location`. Es la base original de SQLBolt.
- **Oficina y ciudades** — `employees`, `buildings`, `north_american_cities`. También original de SQLBolt.
- **Tienda online** — `clientes`, `categorias`, `productos`, `pedidos`, `detalle_pedido`, `empleados`.
  Escrita para este sitio: tiene fechas, `NULL`s, claves foráneas y restricciones `CHECK`, así que sirve
  para los temas avanzados.

## Playground

- Selector de base de datos (o base vacía) y 12 ejemplos listos para ejecutar.
- Editor con resaltado, autocompletado de tablas y columnas (`Ctrl+Espacio`) y ejecución con `⌘/Ctrl+Enter`.
- Varias sentencias por ejecución, incluidos bloques `CREATE TRIGGER … BEGIN … END`.
- Navegador de esquema: tablas, vistas, índices y disparadores, con número de filas.
- Consultas guardadas en `localStorage`, importación de `.sql` y `.sqlite`, exportación a CSV, `.sqlite` y `.sql`.

### Funciones de usuario registradas

Definidas en `assets/js/engine.js` y disponibles en todas las bases:

| Función | Ejemplo |
|---|---|
| `iva(importe [, tipo])` | `iva(100)` → `121.0`, `iva(100, 0.10)` → `110.0` |
| `iniciales(nombre)` | `iniciales('Lucía Ferrer')` → `L.F.` |
| `slugify(texto)` | `slugify('Portátil Aura 14')` → `portatil-aura-14` |
| `distancia_km(lat1, lon1, lat2, lon2)` | distancia entre dos coordenadas |

## Pruebas

```bash
npm test
```

Tres pasadas sin navegador:

- `tools/test-exercises.js` ejecuta la solución de cada una de las 115 tareas y comprueba que la verificación la acepta.
- `tools/test-negative.js` envía una respuesta incorrecta a cada tarea y comprueba que la verificación la rechaza.
- `tools/test-i18n.js` comprueba que las traducciones están completas: cada tema con su título, resumen y cuerpo en
  inglés, cada tarea con su enunciado (y su pista, si la tiene en español), los dos diccionarios de interfaz con
  exactamente las mismas claves, y ninguna clave usada en el código que no exista en el catálogo.

## Sobre el scraping

El contenido de las lecciones 1–18 y de los temas de subconsultas y operaciones de conjunto procede de
SQLBolt, descargado con `tools/extract-sqlbolt.py`. En `data/raw/` está el material original sin tocar:

- `html/` — las 23 páginas HTML tal como las sirve el sitio.
- `sqlbolt-scraped.json` — título, cuerpo HTML y definición completa de los ejercicios (tareas, soluciones
  y comprobaciones) de cada página.
- `pixar.sql`, `misc.sql` — volcado SQL de las dos bases de datos originales, que el sitio distribuye como
  arrays de bytes de SQLite dentro de archivos `.js`.

Sobre ese material, este sitio traduce los textos al español, reescribe las páginas con su propio maquetado
y reimplementa el motor de ejercicios conservando los tipos de comprobación originales
(`row_col_val_solution_query`, `col_equals`, `assert_query_succeeds`, …) y añadiendo otros nuevos
(`object_exists`, `scalar_equals`, `query_result_equals`).

SQLBolt es material de terceros: si vas a publicar esto en algún sitio, revisa antes sus condiciones de uso
y mantén la atribución que aparece en la página de inicio.

## Dependencias

`sql.js` (SQLite en WebAssembly) y CodeMirror 5, ambas copiadas a `assets/vendor/` para que el sitio
funcione sin conexión. Para actualizarlas:

```bash
npm install && npm run vendor
```
