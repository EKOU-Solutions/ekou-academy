I18N.registerLessons('en', {

'introduccion-sql': {
  title: 'Introduction to SQL',
  shortTitle: 'Introduction to SQL',
  summary: 'What SQL is, what a relational database is, and how this course is organised.',
  body: `
<p>Welcome to <strong>EKOU Academy</strong>, a series of interactive lessons and exercises designed to help you
learn SQL quickly, right in your browser.</p>

<h1>What is SQL?</h1>
<p>SQL, or <i>Structured Query Language</i>, is a language designed to let both technical and non-technical
users query, manipulate and transform data from a relational database. Thanks to its simplicity, SQL
databases provide safe and scalable storage for millions of websites and mobile applications.</p>

<div class="dyk">
    <div class="desc">Did you know?</div>
    <p>There are many popular SQL databases, including SQLite, MySQL/MariaDB, PostgreSQL, Oracle and
    Microsoft SQL Server. All of them support the common SQL language standard — which is what this site
    teaches — but each implementation differs in the extra features and storage types it supports.</p>
</div>

<h1>Relational databases</h1>
<p>Before learning the syntax it helps to have a mental model of what a relational database actually is. A
relational database represents a collection of related (two-dimensional) tables. Each table is like a
spreadsheet: a fixed number of named columns — the attributes or properties of the table — and any number
of rows of data.</p>

<p>For example, if the Department of Motor Vehicles had a database, you would probably find a table with
every vehicle driven in the state. That table might store the model, type, number of wheels and number of
doors of each vehicle.</p>

<div class="datatable_title"><strong>Table: Vehicles</strong></div>
<div class="datatable">
  <table class="table">
    <tr><td>Id</td><td>Make/Model</td><td># Wheels</td><td># Doors</td><td>Type</td></tr>
    <tr><td>1</td><td>Ford Focus</td><td>4</td><td>4</td><td>Sedan</td></tr>
    <tr><td>2</td><td>Tesla Roadster</td><td>4</td><td>2</td><td>Sports</td></tr>
    <tr><td>3</td><td>Kawasaki Ninja</td><td>2</td><td>0</td><td>Motorcycle</td></tr>
    <tr><td>4</td><td>McLaren Formula 1</td><td>4</td><td>0</td><td>Race</td></tr>
    <tr><td>5</td><td>Tesla S</td><td>4</td><td>4</td><td>Sedan</td></tr>
  </table>
</div>

<p>In such a database you would also find related tables: the list of registered drivers, the types of
licence that can be granted, or even the driving violations of each driver.</p>

<p>Learning SQL means learning to answer specific questions about that data, such as <i>"which types of
vehicle on the road have fewer than four wheels?"</i> or <i>"how many car models does Tesla produce?"</i>,
so you can make better decisions.</p>

<h1>About the lessons</h1>
<p>Since most people learn SQL to work with a database that already exists, the lessons begin by introducing
the different parts of a query. Later lessons show how to alter a table (or schema) and create tables from
scratch. After that, the extension topics cover views, indexes, constraints, transactions, triggers, stored
procedures, functions, window functions and database design.</p>

<p>Each lesson introduces one concept and ends with an interactive exercise. Go at your own pace and don't
be afraid to experiment before moving on. If you already know SQL you can jump straight to the topics you
care about from the sidebar.</p>

<div class="callout note">
  <div class="desc">Everything runs in your browser</div>
  <p>The exercises and the Playground use <strong>SQLite compiled to WebAssembly</strong>. There is no
  server: every lesson creates its own in-memory database, so you can break whatever you like and press
  "Reset data" to go back to the initial state.</p>
</div>
`
},

'select-101': {
  title: 'Lesson 1: SELECT queries 101',
  shortTitle: 'SELECT 101',
  summary: 'The most basic query: picking columns from a table.',
  body: `
<p>To retrieve data from a SQL database we need to write <code>SELECT</code> statements, which are often
colloquially called <i>queries</i>. A query is simply a statement that declares what data we are looking
for, where to find it in the database and, optionally, how to transform it before it is returned.</p>

<p>As we mentioned in the introduction, you can think of a SQL table as a type of entity (say, <i>Dogs</i>)
and each row in that table as a specific <i>instance</i> of that type (a pug, a beagle, another pug of a
different colour). The columns then represent the properties shared by every instance of that entity (fur
colour, tail length, and so on).</p>

<p>Given a table of data, the most basic query we can write selects a couple of columns (properties) with
all their rows (instances).</p>

<div class="definition">
    <div class="desc">Select query for specific columns</div>
    <code class="sql">SELECT column, another_column, …
FROM mytable;</code>
</div>

<p>The result of this query is a two-dimensional set of rows and columns: effectively a copy of the table,
but only with the columns we asked for.</p>

<p>If we want to retrieve absolutely every column, we can use the asterisk (<code>*</code>) as a shorthand
instead of listing the names one by one.</p>

<div class="definition">
    <div class="desc">Select query for all columns</div>
    <code class="sql">SELECT *
FROM mytable;</code>
</div>

<p>This query is particularly useful because it is the quickest way to inspect a table by dumping all its
data at once.</p>

<h1>Exercise</h1>
<p>We will be using a database with data about some of Pixar's classic movies for most of the exercises.
This first one only involves the <strong>movies</strong> table, and the starting query shows every property
of each movie. Change it to get exactly what each task asks for.</p>
`,
  exerciseTitle: 'Exercise 1',
  tasks: [
    { text: 'Find the <code>title</code> of each movie' },
    { text: 'Find the <code>director</code> of each movie' },
    { text: 'Find the <code>title</code> and the <code>director</code> of each movie' },
    { text: 'Find the <code>title</code> and the <code>year</code> of each movie' },
    { text: 'Find <strong>all</strong> the data about each movie' }
  ]
},

'where-numeros': {
  title: 'Lesson 2: Queries with constraints (Pt. 1)',
  shortTitle: 'WHERE with numbers',
  summary: 'Filtering rows with WHERE and numeric operators.',
  body: `
<p>We already know how to select specific columns of a table, but if you had a table with a hundred million
rows, reading through all of them would be inefficient and perhaps impossible.</p>

<p>To discard certain results we use a <code>WHERE</code> clause in the query. The clause is applied to each
row, checking specific column values to decide whether it should be included in the results or not.</p>

<div class="definition">
    <div class="desc">Select query with constraints</div>
    <code class="sql">SELECT column, another_column, …
FROM mytable
<strong>WHERE <i>condition</i>
    AND/OR <i>another_condition</i>
    AND/OR …</strong>;</code>
</div>

<p>More complex clauses can be built by chaining <code>AND</code> or <code>OR</code> keywords (for example,
<code>num_wheels &gt;= 4 AND doors &lt;= 2</code>). These are the useful operators for numeric data (integer
or floating point):</p>

<div class="datatable">
    <table class="table">
        <tr><td style="width:22%;text-align:center">Operator</td><td style="width:48%">Condition</td><td>SQL example</td></tr>
        <tr><td style="text-align:center">=, !=, &lt;, &lt;=, &gt;, &gt;=</td><td>Standard numerical operators</td><td>col <span class="faux-keyword">!=</span> 4</td></tr>
        <tr><td style="text-align:center">BETWEEN … AND …</td><td>Number is within a range of two values (inclusive)</td><td>col <span class="faux-keyword">BETWEEN</span> 1.5 <span class="faux-keyword">AND</span> 10.5</td></tr>
        <tr><td style="text-align:center">NOT BETWEEN … AND …</td><td>Number is <em>not</em> within the range (inclusive)</td><td>col <span class="faux-keyword">NOT BETWEEN</span> 1 <span class="faux-keyword">AND</span> 10</td></tr>
        <tr><td style="text-align:center">IN (…)</td><td>Number exists in a list</td><td>col <span class="faux-keyword">IN</span> (2, 4, 6)</td></tr>
        <tr><td style="text-align:center">NOT IN (…)</td><td>Number does not exist in the list</td><td>col <span class="faux-keyword">NOT IN</span> (1, 3, 5)</td></tr>
    </table>
</div>

<p>Besides making the results easier to handle, constraining the rows returned also makes the query run
faster, because less unnecessary data is processed and transferred.</p>

<div class="dyk">
    <div class="desc">Did you know?</div>
    <p>SQL doesn't <i>require</i> you to write keywords in capitals, but by convention it helps people tell
    them apart from column and table names, and makes the query easier to read.</p>
</div>

<h1>Exercise</h1>
<p>Using the right constraints, find the information each task asks for in the <strong>movies</strong>
table.</p>
`,
  exerciseTitle: 'Exercise 2',
  tasks: [
    { text: 'Find the movie with a row <code>id</code> of 6' },
    { text: 'Find the movies released in the <code>year</code>s between 2000 and 2010' },
    { text: 'Find the movies <strong>not</strong> released in the <code>year</code>s between 2000 and 2010' },
    { text: 'Find the first 5 Pixar movies and their release <code>year</code>', hint: 'Check the <code>year</code>' }
  ]
},

'where-texto': {
  title: 'Lesson 3: Queries with constraints (Pt. 2)',
  shortTitle: 'WHERE with text',
  summary: 'Comparing strings, wildcards with LIKE and lists with IN.',
  body: `
<p>When writing <code>WHERE</code> clauses on columns containing text, SQL supports a number of useful
operators to do things like case-insensitive string comparison and wildcard pattern matching. Here are the
most common ones:</p>

<div class="datatable">
    <table class="table">
        <tr><td style="width:16%;text-align:center">Operator</td><td style="width:52%">Condition</td><td>Example</td></tr>
        <tr><td style="text-align:center">=</td><td>Case-sensitive exact string comparison (<em>notice the single equals</em>)</td><td>col <span class="faux-keyword">=</span> "abc"</td></tr>
        <tr><td style="text-align:center">!= or &lt;&gt;</td><td>Case-sensitive exact string inequality</td><td>col <span class="faux-keyword">!=</span> "abcd"</td></tr>
        <tr><td style="text-align:center">LIKE</td><td>Case-<em>insensitive</em> exact string comparison</td><td>col <span class="faux-keyword">LIKE</span> "ABC"</td></tr>
        <tr><td style="text-align:center">NOT LIKE</td><td>Case-insensitive string inequality</td><td>col <span class="faux-keyword">NOT LIKE</span> "ABCD"</td></tr>
        <tr><td style="text-align:center">%</td><td>Used anywhere in a string to match a sequence of zero or more characters (only with LIKE / NOT LIKE)</td>
            <td>col <span class="faux-keyword">LIKE</span> "%AT%"<br/>(matches "AT", "ATTIC", "CAT" or even "BATS")</td></tr>
        <tr><td style="text-align:center">_</td><td>Used anywhere in a string to match a single character (only with LIKE / NOT LIKE)</td>
            <td>col <span class="faux-keyword">LIKE</span> "AN_"<br/>(matches "AND", but not "AN")</td></tr>
        <tr><td style="text-align:center">IN (…)</td><td>String exists in a list</td><td>col <span class="faux-keyword">IN</span> ("A", "B", "C")</td></tr>
        <tr><td style="text-align:center">NOT IN (…)</td><td>String does not exist in the list</td><td>col <span class="faux-keyword">NOT IN</span> ("D", "E", "F")</td></tr>
    </table>
</div>

<div class="dyk">
    <div class="desc">Did you know?</div>
    <p>All strings must be quoted so that the query parser can tell words in the string apart from SQL
    keywords. The standard uses single quotes (<code>'text'</code>); SQLite and MySQL also accept double
    quotes.</p>
</div>

<p>It is worth noting that, while most databases are quite efficient with these operators, full-text search
is best left to dedicated libraries such as Apache Lucene, Elasticsearch or Sphinx, or to the engine's own
full-text extensions (<code>FTS5</code> in SQLite, <code>tsvector</code> in PostgreSQL).</p>

<h1>Exercise</h1>
<p>Here is the definition of a query with a <code>WHERE</code> clause again. Write queries using the
operators above to get the information the tasks ask for.</p>

<div class="definition">
    <div class="desc">Select query with constraints</div>
    <code class="sql">SELECT column, another_column, …
FROM mytable
<strong>WHERE <i>condition</i>
    AND/OR <i>another_condition</i>
    AND/OR …</strong>;</code>
</div>
`,
  exerciseTitle: 'Exercise 3',
  tasks: [
    { text: 'Find all the <em>Toy Story</em> movies' },
    { text: 'Find all the movies directed by <em>John Lasseter</em>' },
    { text: 'Find all the movies (and their directors) <strong>not</strong> directed by <em>John Lasseter</em>' },
    { text: 'Find all the <em>WALL-*</em> movies', hint: 'Try the <code>%</code> wildcard' }
  ]
},

'distinct-order-limit': {
  title: 'Lesson 4: Filtering and sorting query results',
  shortTitle: 'DISTINCT, ORDER BY, LIMIT',
  summary: 'Removing duplicates, sorting and paginating results.',
  body: `
<p>Even though the data in a database may be unique, the results of a particular query may not be. In our
<strong>movies</strong> table, for instance, several movies can be released in the same year. To discard
rows with duplicate column values, SQL provides the <code>DISTINCT</code> keyword.</p>

<div class="definition">
    <div class="desc">Select query with unique results</div>
    <code class="sql">SELECT <strong>DISTINCT</strong> column, another_column, …
FROM mytable
WHERE <i>condition(s)</i>;</code>
</div>

<p>Since <code>DISTINCT</code> blindly removes duplicate rows (looking at every selected column), a later
lesson will show how to discard duplicates based on specific columns using grouping and the
<code>GROUP BY</code> clause.</p>

<h1>Ordering results</h1>
<p>Unlike the neatly ordered tables of the previous lessons, most data in real databases is added in no
particular order. As a table grows to thousands or even millions of rows, reading the results of a query
becomes difficult.</p>

<p>To help with that, SQL lets you sort your results by a given column in ascending or descending order with
the <code>ORDER BY</code> clause.</p>

<div class="definition">
    <div class="desc">Select query with ordered results</div>
    <code class="sql">SELECT column, another_column, …
FROM mytable
WHERE <i>condition(s)</i>
<strong>ORDER BY column ASC/DESC</strong>;</code>
</div>

<p>When an <code>ORDER BY</code> clause is specified, each row is sorted alphanumerically based on the
specified column's value. In some databases you can also specify a collation to better sort text containing
accents or other alphabets.</p>

<h1>Limiting results to a subset</h1>
<p>Two clauses commonly used together with <code>ORDER BY</code> are <code>LIMIT</code> and
<code>OFFSET</code>, a useful optimisation to tell the database which subset of the results you care about.
<code>LIMIT</code> reduces the number of rows returned, and the optional <code>OFFSET</code> specifies where
to begin counting rows from.</p>

<div class="definition">
    <div class="desc">Select query with limited rows</div>
    <code class="sql">SELECT column, another_column, …
FROM mytable
WHERE <i>condition(s)</i>
ORDER BY column ASC/DESC
<strong>LIMIT num_limit OFFSET num_offset</strong>;</code>
</div>

<p>Think of sites like Reddit or Pinterest: the front page is a list of links sorted by popularity and time,
and each subsequent page is a set of links at a different offset. With these clauses the database can
execute the query faster, processing and returning only the requested content.</p>

<div class="dyk">
    <div class="desc">Did you know?</div>
    <p>If you are curious about when <code>LIMIT</code> and <code>OFFSET</code> are applied relative to the
    rest of the query: generally last, after the other clauses. We cover this in detail in
    <a href="#/orden-de-ejecucion">Lesson 12: Order of execution</a>.</p>
</div>

<div class="callout note">
  <div class="desc">Differences between engines</div>
  <p>SQLite, MySQL and PostgreSQL use <code>LIMIT … OFFSET …</code>. SQL Server and Oracle use the standard
  <code>OFFSET n ROWS FETCH NEXT m ROWS ONLY</code>, which PostgreSQL also accepts.</p>
</div>

<h1>Exercise</h1>
<p>There are a few concepts in this lesson, but all are straightforward to apply. Use the keywords and
clauses above to solve the tasks.</p>
`,
  exerciseTitle: 'Exercise 4',
  tasks: [
    { text: 'List all directors of Pixar movies (alphabetically), without duplicates' },
    { text: 'List the last four Pixar movies released (from most recent to least)' },
    { text: 'List the <strong>first</strong> five Pixar movies sorted alphabetically' },
    { text: 'List the <strong>next</strong> five Pixar movies sorted alphabetically' }
  ]
},

'repaso-select': {
  title: 'Review: simple SELECT queries',
  shortTitle: 'Review: simple SELECT',
  summary: 'Practise everything so far on a new table of cities.',
  body: `
<p>You've done a good job getting this far! Now that you've had a taste of writing a basic query, you need
practice writing queries that solve actual problems.</p>

<div class="definition">
    <div class="desc">SELECT query</div>
    <code class="sql">SELECT column, another_column, …
FROM mytable
WHERE <i>condition(s)</i>
ORDER BY column ASC/DESC
LIMIT num_limit OFFSET num_offset;</code>
</div>

<h1>Exercise</h1>
<p>In the exercise below you'll be working with a different table, containing information about some of the
most populous cities of North America, including their population and their geographic position.</p>

<div class="dyk">
    <div class="desc">Did you know?</div>
    <p>Positive latitudes correspond to the northern hemisphere, and positive longitudes to the eastern
    hemisphere. Since North America is north of the equator and west of the prime meridian, every city in
    the list has a positive latitude and a negative longitude.</p>
</div>

<p>Write queries to find the information the tasks ask for. You may need a different combination of clauses
for each one.</p>
`,
  exerciseTitle: 'Review 1',
  tasks: [
    { text: 'List all the Canadian cities and their populations' },
    { text: 'Order all the cities in the United States by their latitude from north to south', hint: 'Smaller latitudes are further south' },
    { text: 'List all the cities west of Chicago, ordered from west to east', hint: 'Smaller longitudes are further west' },
    { text: 'List the two largest cities in Mexico (by population)' },
    { text: 'List the third and fourth largest cities (by population) in the United States and their population' }
  ]
}

});
