I18N.registerLessons('en', {

'insert': {
  title: 'Lesson 13: Inserting rows',
  shortTitle: 'INSERT',
  summary: 'What a schema is and how to add new rows with INSERT.',
  body: `
<p>We've spent quite a few lessons querying data, so it's time to learn a bit about SQL schemas and how to
add new data.</p>

<h1>What is a schema?</h1>
<p>We described a table as a two-dimensional set of rows and columns, where the columns are the properties
and the rows are instances of the entity. In SQL, the <i>database schema</i> is what describes the structure
of each table and the data types each column can contain.</p>

<div class="dyk">
    <div class="desc">Example</div>
    <p>In our <strong>movies</strong> table, the values in the <em>year</em> column must be integers, and
    the values in <em>title</em> must be strings.</p>
</div>

<p>This fixed structure is what allows a database to be efficient and consistent despite storing millions or
even billions of rows.</p>

<h1>Inserting new data</h1>
<p>To insert data we use an <code>INSERT</code> statement, which declares which table to write into, the
columns being filled, and one or more rows of data. In general, each row you insert should contain values
for every corresponding column in the table. You can insert multiple rows at once by listing them
sequentially.</p>

<div class="definition">
    <div class="desc">Insert statement with values for all columns</div>
    <code class="sql">INSERT INTO mytable
VALUES (value_or_expr, another_value_or_expr, …),
       (value_or_expr_2, another_value_or_expr_2, …),
       …;</code>
</div>

<p>If you have incomplete data and the table has columns with default values, you can insert rows specifying
only the columns you have.</p>

<div class="definition">
    <div class="desc">Insert statement with specific columns</div>
    <code class="sql">INSERT INTO mytable
<strong>(column, another_column, …)</strong>
VALUES (value_or_expr, another_value_or_expr, …),
       (value_or_expr_2, another_value_or_expr_2, …),
       …;</code>
</div>

<p>In that case the number of values must match the number of columns specified. Although more verbose,
inserting this way has the benefit of being forward compatible: if you add a new column with a default
value, no existing <code>INSERT</code> has to change.</p>

<p>You can also use mathematical and string expressions in the values you insert, which helps make sure all
inserted data is formatted a certain way.</p>

<div class="definition">
    <div class="desc">Example insert statement with expressions</div>
    <code class="sql">INSERT INTO boxoffice
<strong>(movie_id, rating, sales_in_millions)</strong>
VALUES (1, 9.9, 283742034 / 1000000);</code>
</div>

<div class="callout note">
  <div class="desc">You can also insert the result of a query</div>
  <p><code>INSERT INTO target (a, b) SELECT x, y FROM source WHERE …;</code> copies rows from one table to
  another without going through the application.</p>
</div>

<h1>Exercise</h1>
<p>Let's play studio executive and add a few movies to <strong>movies</strong>. In this table,
<strong>id</strong> is an auto-incrementing integer, so you can try inserting a row specifying only the
other columns.</p>
<p>Since this lesson modifies the database, run each query once it's ready. If something goes wrong, press
"Reset data".</p>
`,
  exerciseTitle: 'Exercise 13',
  tasks: [
    { text: "Add the studio's new production, <strong>Toy Story 4</strong>, to the list of movies (you can use any director)" },
    { text: 'Toy Story 4 has been released to critical acclaim! It had a rating of <strong>8.7</strong> and made <strong>340 million domestically</strong> and <strong>270 million internationally</strong>. Add the record to the <code>boxoffice</code> table.' }
  ]
},

'update': {
  title: 'Lesson 14: Updating rows',
  shortTitle: 'UPDATE',
  summary: 'Changing existing data without wrecking the whole table.',
  body: `
<p>In addition to adding new data, a common task is updating existing data, which is done with an
<code>UPDATE</code> statement. As with <code>INSERT</code>, you have to specify exactly which table, columns
and rows to update. The data must also match the data type of the columns in the table schema.</p>

<div class="definition">
    <div class="desc">Update statement with values</div>
    <code class="sql">UPDATE mytable
SET column = value_or_expr,
    other_column = another_value_or_expr,
    …
WHERE condition;</code>
</div>

<p>The statement takes multiple column/value pairs and applies those changes to each and every row that
satisfies the constraint in the <code>WHERE</code> clause.</p>

<h1>Taking care</h1>
<p>Most people working with SQL <strong>will</strong> make a mistake updating data at some point: updating
the wrong set of rows in production, or the classic — leaving out the <code>WHERE</code> clause, which
applies the update to <i>all</i> rows.</p>

<div class="callout danger">
    <div class="desc">Rule of thumb</div>
    <p>Always write the constraint first and test it in a <code>SELECT</code> query to make sure you're
    updating the right rows; only then write the column/value pairs. In production, wrap the change in a
    transaction (<a href="#/transacciones">Transactions</a>) so you can undo it.</p>
</div>

<h1>Exercise</h1>
<p>It looks like some of the information in our <strong>movies</strong> database is incorrect. Fix it with
the tasks below.</p>
`,
  exerciseTitle: 'Exercise 14',
  tasks: [
    { text: "The director for A Bug's Life is incorrect, it was actually directed by <strong>John Lasseter</strong>" },
    { text: 'The year that Toy Story 2 was released is incorrect, it was actually released in <strong>1999</strong>' },
    { text: 'Both the title and director for Toy Story 8 are incorrect! The title should be "Toy Story 3" and it was directed by <strong>Lee Unkrich</strong>' }
  ]
},

'delete': {
  title: 'Lesson 15: Deleting rows',
  shortTitle: 'DELETE',
  summary: 'Removing rows with DELETE … WHERE, and why you read it twice.',
  body: `
<p>When you need to delete data from a table you can use a <code>DELETE</code> statement, which describes
the table to act on and the rows to delete through the <code>WHERE</code> clause.</p>

<div class="definition">
    <div class="desc">Delete statement with condition</div>
    <code class="sql">DELETE FROM mytable
WHERE condition;</code>
</div>

<p>If you leave out the <code>WHERE</code> constraint, <i>all</i> rows are removed, which is a quick and easy
way to clear out a table completely (if that's what you intended).</p>

<h1>Taking extra care</h1>
<p>As with <code>UPDATE</code>, it's recommended to run the constraint in a <code>SELECT</code> first to make
sure you're removing the right rows. Without a proper backup or a test database it is downright easy to
irrevocably remove data, so <strong>always read your <code>DELETE</code> statements twice and execute
once</strong>.</p>

<div class="callout note">
  <div class="desc">DELETE versus TRUNCATE versus DROP</div>
  <p><code>DELETE FROM t</code> removes rows one by one and can be undone inside a transaction.
  <code>TRUNCATE TABLE t</code> (in MySQL, PostgreSQL, SQL Server) empties the table in one go, is much
  faster and usually resets auto-increment counters. <code>DROP TABLE t</code> also removes the table itself
  and its schema. SQLite has no <code>TRUNCATE</code>: it optimises a <code>DELETE</code> without a
  <code>WHERE</code> internally.</p>
</div>

<h1>Exercise</h1>
<p>The database needs a little cleaning up. Delete a few rows with the tasks below.</p>
`,
  exerciseTitle: 'Exercise 15',
  tasks: [
    { text: 'This database is getting too big: remove all movies released <strong>before</strong> 2005.' },
    { text: 'Andrew Stanton has also left the studio, so remove all the movies he directed.' }
  ]
},

'create-table': {
  title: 'Lesson 16: Creating tables',
  shortTitle: 'CREATE TABLE',
  summary: 'Defining new tables, data types and basic constraints.',
  body: `
<p>When you have new entities and relationships to store, you can create a table with the
<code>CREATE TABLE</code> statement.</p>

<div class="definition">
    <div class="desc">Create table statement with optional constraint and default value</div>
    <code class="sql">CREATE TABLE IF NOT EXISTS mytable (
    column <i>DataType</i> <i>TableConstraint</i> DEFAULT <i>default_value</i>,
    another_column <i>DataType</i> <i>TableConstraint</i> DEFAULT <i>default_value</i>,
    …
);</code>
</div>

<p>The structure of the new table is defined by its <i>schema</i>, which declares a series of columns. Each
column has a name, the type of data allowed in it, an <i>optional</i> constraint on the values being
inserted, and an optional default value.</p>

<p>If a table with the same name already exists, most engines throw an error; to suppress it and skip the
creation, use the <code>IF NOT EXISTS</code> clause.</p>

<h1>Table data types</h1>
<div class="datatable">
    <table class="table">
        <tr><td style="width:32%">Data type</td><td>Description</td></tr>
        <tr><td><code>INTEGER</code>, <code>BOOLEAN</code></td>
            <td>Whole numbers: a count, an age. In some implementations the boolean is simply represented as an integer 0 or 1.</td></tr>
        <tr><td><code>FLOAT</code>, <code>DOUBLE</code>, <code>REAL</code>, <code>DECIMAL(p,s)</code></td>
            <td>Numbers with a fractional part: measurements, fractions. For money, prefer <code>DECIMAL/NUMERIC</code>, which is exact, over floating point.</td></tr>
        <tr><td><code>CHARACTER(n)</code>, <code>VARCHAR(n)</code>, <code>TEXT</code></td>
            <td><p>Text types. The difference between them usually comes down to the engine's internal efficiency.</p>
                <p><code>CHARACTER</code> and <code>VARCHAR</code> are declared with the maximum number of characters they can store (longer values may be truncated), which can be more efficient in big tables.</p></td></tr>
        <tr><td><code>DATE</code>, <code>TIME</code>, <code>DATETIME</code>, <code>TIMESTAMP</code></td>
            <td>Dates and timestamps for time series and event data. They can be tricky across time zones.</td></tr>
        <tr><td><code>BLOB</code></td>
            <td>Binary data stored right in the database. It is usually opaque to the engine, so you normally store it alongside metadata to be able to retrieve it.</td></tr>
    </table>
</div>

<div class="callout sqlite">
  <div class="desc">SQLite and types</div>
  <p>SQLite uses <em>type affinity</em> rather than strict types: you can declare <code>VARCHAR(20)</code>
  and store a number. Its real types are <code>NULL</code>, <code>INTEGER</code>, <code>REAL</code>,
  <code>TEXT</code> and <code>BLOB</code>. Since 3.37 there are <code>STRICT TABLE</code>s, which do enforce
  the declared type.</p>
</div>

<h1>Table constraints</h1>
<div class="datatable">
    <table class="table">
        <tr><td style="width:32%">Constraint</td><td>Description</td></tr>
        <tr><td><code>PRIMARY KEY</code></td><td>The values in this column are unique and each one identifies a single row of the table.</td></tr>
        <tr><td><code>AUTOINCREMENT</code></td><td>For integers: the value is filled in and incremented automatically on each insert. Not available everywhere (MySQL uses <code>AUTO_INCREMENT</code>, PostgreSQL <code>SERIAL</code> or <code>GENERATED … AS IDENTITY</code>).</td></tr>
        <tr><td><code>UNIQUE</code></td><td>Values must be unique: you can't insert another row with the same value. It differs from <code>PRIMARY KEY</code> in that it doesn't have to be the row's key.</td></tr>
        <tr><td><code>NOT NULL</code></td><td>The inserted value cannot be <code>NULL</code>.</td></tr>
        <tr><td><code>CHECK (expression)</code></td><td>Lets you evaluate a more complex expression to test whether the values are valid: positive, bigger than a certain size, starting with a prefix…</td></tr>
        <tr><td><code>FOREIGN KEY</code></td><td>A consistency check that ensures each value in this column corresponds to a value in a column of another table.<br/><br/>For example, with one table of employees by ID and another with their payroll, the <code>FOREIGN KEY</code> ensures every payroll row points at a valid employee.</td></tr>
    </table>
</div>

<p>We go deeper into all of them in <a href="#/restricciones-claves">Constraints and referential
integrity</a>.</p>

<h1>An example</h1>
<div class="definition">
    <div class="desc">Movies table schema</div>
    <code class="sql">CREATE TABLE movies (
    id INTEGER PRIMARY KEY,
    title TEXT,
    director TEXT,
    year INTEGER,
    length_minutes INTEGER
);</code>
</div>

<h1>Exercise</h1>
<p>Create a new table so we can insert some rows into it.</p>
`,
  exerciseTitle: 'Exercise 16',
  tasks: [
    { text: 'Create a new table named <code>Database</code> with the following columns:<br/><p>' +
            '– <code>Name</code>: a string (text) describing the name of the database<br/>' +
            '– <code>Version</code>: a number (floating point) of the latest version<br/>' +
            '– <code>Download_count</code>: an integer count of the times it was downloaded<br/></p>' +
            'This table has no constraints.' }
  ]
},

'alter-table': {
  title: 'Lesson 17: Altering tables',
  shortTitle: 'ALTER TABLE',
  summary: 'Adding, dropping and renaming columns and tables.',
  body: `
<p>As your data changes over time, SQL lets you update your tables and schema with the
<code>ALTER TABLE</code> statement, which adds, removes or modifies columns and constraints.</p>

<h1>Adding columns</h1>
<p>The syntax is similar to <code>CREATE TABLE</code>. You need to specify the data type along with any
constraints and default values, which are applied to existing <i>and</i> new rows. In some engines such as
MySQL you can even specify where to insert the column with <code>FIRST</code> or <code>AFTER</code>, though
that is not standard.</p>

<div class="definition">
    <div class="desc">Altering a table to add new column(s)</div>
    <code class="sql">ALTER TABLE mytable
ADD column <i>DataType</i> <i>OptionalTableConstraint</i>
    DEFAULT default_value;</code>
</div>

<h1>Removing columns</h1>
<p>Dropping a column is as easy as naming it, though some engines don't support it in older versions and you
have to create a new table and migrate the data.</p>

<div class="definition">
    <div class="desc">Altering a table to remove column(s)</div>
    <code class="sql">ALTER TABLE mytable
DROP COLUMN column_to_be_deleted;</code>
</div>

<h1>Renaming the table</h1>
<div class="definition">
    <div class="desc">Altering the table name</div>
    <code class="sql">ALTER TABLE mytable
RENAME TO new_table_name;</code>
</div>

<div class="callout sqlite">
  <div class="desc">What SQLite supports</div>
  <p>SQLite supports <code>ADD COLUMN</code>, <code>RENAME TO</code>, <code>RENAME COLUMN</code> (3.25+) and
  <code>DROP COLUMN</code> (3.35+). It cannot change a column's type or add constraints after the fact: for
  that you create a new table, copy the data with
  <code>INSERT INTO new SELECT … FROM old</code>, drop the old one and rename.</p>
</div>

<h1>Other changes</h1>
<p>Each engine supports different ways of altering its tables, so always consult your database's docs before
touching anything in production. On large tables an <code>ALTER TABLE</code> can block writes for
minutes.</p>

<h1>Exercise</h1>
<p>Our exercises use an implementation that supports adding new columns; give it a try below.</p>
`,
  exerciseTitle: 'Exercise 17',
  tasks: [
    { text: 'Add a column named <strong>Aspect_ratio</strong> with a <strong>FLOAT</strong> data type to store the aspect ratio each movie was released in.' },
    { text: 'Add another column named <strong>Language</strong> with a <strong>TEXT</strong> data type to store the language the movie was released in. Make sure the default for this language is <strong>English</strong>.' }
  ]
},

'drop-table': {
  title: 'Lesson 18: Dropping tables',
  shortTitle: 'DROP TABLE',
  summary: 'Removing an entire table, data and schema included.',
  body: `
<p>In some cases you may want to remove an entire table, including all its data and metadata. That's what
<code>DROP TABLE</code> is for; it differs from <code>DELETE</code> in that it also removes the table schema
from the database entirely.</p>

<div class="definition">
    <div class="desc">Drop table statement</div>
    <code class="sql">DROP TABLE IF EXISTS mytable;</code>
</div>

<p>As with <code>CREATE TABLE</code>, the engine may throw an error if the table does not exist; to suppress
it, use <code>IF EXISTS</code>.</p>

<p>Also, if you have another table that depends on columns of the one you're removing (for example with a
<code>FOREIGN KEY</code>), you'll have to update the dependent tables first to remove the dependent rows, or
remove those tables entirely.</p>

<div class="callout danger">
  <div class="desc">Irreversible</div>
  <p>A committed <code>DROP TABLE</code> cannot be undone without a backup. In PostgreSQL and SQLite, DDL is
  transactional (you can <code>ROLLBACK</code> if you haven't committed yet); in MySQL with InnoDB it is
  not: every DDL statement performs an implicit commit.</p>
</div>

<h1>Exercise</h1>
<p>We've reached the end of the basic exercises, so let's clean up by removing the tables we've worked
with.</p>
`,
  exerciseTitle: 'Exercise 18',
  tasks: [
    { text: "Let's clean up by removing the <strong>movies</strong> table" },
    { text: 'And drop the <strong>boxoffice</strong> table as well' }
  ]
},

'fin-del-tutorial': {
  title: 'Lesson X: To infinity and beyond!',
  shortTitle: 'End of the basic tutorial',
  summary: "You've finished the original syllabus. Here's what comes next.",
  body: `
<div class="callout note">
  <div class="desc">🎉 You've finished the basic tutorial!</div>
  <p>You've now seen every fundamental piece of SQL: queries, filters, ordering, joins, aggregates, data
  modification and table definition.</p>
</div>

<p>We hope the lessons have given you experience with SQL and confidence to use it with your own data. But
we've only scratched the surface of what SQL can do.</p>

<h1>What comes next</h1>
<p>From here the course continues with topics the original site only sketched, or didn't cover at all:</p>
<ul>
  <li><strong>Subqueries and set operations</strong> — queries inside queries, <code>UNION</code>, <code>INTERSECT</code>, <code>EXCEPT</code>.</li>
  <li><strong>Conditional expressions</strong> — <code>CASE</code>, <code>COALESCE</code>, <code>NULLIF</code>.</li>
  <li><strong>Functions</strong> — scalar, text, date and time, and window functions.</li>
  <li><strong>Database objects</strong> — views, indexes and integrity constraints.</li>
  <li><strong>Programming the database</strong> — transactions, triggers, stored procedures, user-defined functions, cursors and error handling.</li>
  <li><strong>Design and performance</strong> — normalization, execution plans and security with users and permissions.</li>
</ul>

<p>And you always have the <a href="#/playground">Playground</a> to experiment freely with any of these
topics.</p>

<p>If you need more detail, also read the documentation for the specific engine you use: every database has
its own set of features and optimisations.</p>
`
}

});
