I18N.registerLessons('en', {

'inner-join': {
  title: 'Lesson 6: Multi-table queries with JOINs',
  shortTitle: 'INNER JOIN',
  summary: 'Combining rows from several tables through keys.',
  body: `
<p>Up to now we've been working with a single table, but entity data in the real world is often broken down
and stored across multiple orthogonal tables through a process known as <i>normalization</i>.</p>

<h1>Database normalization</h1>
<p>Normalization is useful because it minimises duplicate data within any single table and allows data to
grow independently (types of car engine can grow independently of each car model). As a trade-off, queries
get slightly more complex — they have to find data in different parts of the database — and performance
issues can arise when working with many large tables.</p>

<p>To answer questions about an entity whose data spans multiple tables, we need to learn how to write a
query that combines all that data and pulls out exactly the information we need.</p>

<h1>Multi-table queries with JOINs</h1>
<p>Tables that share information about a single entity need a <i>primary key</i> that identifies that entity
<i>uniquely</i> across the database. A common primary key type is an auto-incrementing integer (they are
space efficient), but it can also be a string or a hashed value, as long as it is unique.</p>

<p>Using the <code>JOIN</code> clause, we can combine row data across two separate tables using that unique
key. The first join we'll look at is the <code>INNER JOIN</code>.</p>

<div class="definition">
    <div class="desc">Select query with INNER JOIN on multiple tables</div>
    <code class="sql">SELECT column, another_table_column, …
FROM mytable
<strong>INNER JOIN another_table
    ON mytable.id = another_table.id</strong>
WHERE <i>condition(s)</i>
ORDER BY column, … ASC/DESC
LIMIT num_limit OFFSET num_offset;</code>
</div>

<p>The <code>INNER JOIN</code> matches rows from the first table and the second that have the same key (as
defined by the <code>ON</code> constraint) to create a result row with the combined columns of both tables.
Once the tables are joined, the other clauses we already know are applied.</p>

<div class="dyk">
    <div class="desc">Did you know?</div>
    <p>You'll see queries where the <code>INNER JOIN</code> is written simply as <code>JOIN</code>. They are
    equivalent, but we'll keep writing <code>INNER JOIN</code> because it makes the query easier to read
    once you start using other join types, which we introduce in the next lesson.</p>
</div>

<h1>Exercise</h1>
<p>We've added a new table to the Pixar database so you can practise joins. The <strong>boxoffice</strong>
table stores the rating and sales of each movie, and its <em>movie_id</em> column corresponds one-to-one
with the <em>id</em> column of the <strong>movies</strong> table.</p>
`,
  exerciseTitle: 'Exercise 6',
  tasks: [
    { text: 'Find the domestic and international sales for each movie' },
    { text: 'Show the sales numbers for each movie that did better internationally than domestically' },
    { text: 'List all the movies by their <code>rating</code> in descending order' }
  ]
},

'outer-join': {
  title: 'Lesson 7: OUTER JOINs',
  shortTitle: 'LEFT / RIGHT / FULL JOIN',
  summary: 'Keeping unmatched rows when joining asymmetric tables.',
  body: `
<p>Depending on how you want to analyse the data, the <code>INNER JOIN</code> from the previous lesson might
not be enough, because the resulting table only contains data that belongs to <em>both</em> tables.</p>

<p>If the two tables have asymmetric data — which happens easily when data is entered at different stages —
we need <code>LEFT JOIN</code>, <code>RIGHT JOIN</code> or <code>FULL JOIN</code> instead, to make sure the
data we need is not left out of the results.</p>

<div class="definition">
    <div class="desc">Select query with LEFT/RIGHT/FULL JOINs</div>
    <code class="sql">SELECT column, another_column, …
FROM mytable
<strong>INNER/LEFT/RIGHT/FULL JOIN another_table
    ON mytable.id = another_table.matching_id</strong>
WHERE <i>condition(s)</i>
ORDER BY column, … ASC/DESC
LIMIT num_limit OFFSET num_offset;</code>
</div>

<p>Like the <code>INNER JOIN</code>, these three joins have to specify which column to join the data on.
When joining table A to table B, a <code>LEFT JOIN</code> includes rows from A regardless of whether a
matching row is found in B. The <code>RIGHT JOIN</code> is the same but reversed, keeping rows in B whether
or not a match exists in A. Finally, a <code>FULL JOIN</code> keeps rows from both tables, regardless of
whether a matching row exists in the other.</p>

<p>When using any of these joins you will likely have to write extra logic to deal with the
<code>NULL</code>s in the result (more on this in the next lesson).</p>

<div class="dyk">
    <div class="desc">Did you know?</div>
    <p>You'll see these joins written as <code>LEFT OUTER JOIN</code>, <code>RIGHT OUTER JOIN</code> or
    <code>FULL OUTER JOIN</code>, but the <code>OUTER</code> keyword is kept only for SQL-92 compatibility:
    they are equivalent to <code>LEFT JOIN</code>, <code>RIGHT JOIN</code> and <code>FULL JOIN</code>.</p>
</div>

<div class="callout sqlite">
  <div class="desc">A note on SQLite</div>
  <p>Modern SQLite versions (3.39+) do support <code>RIGHT JOIN</code> and <code>FULL JOIN</code>. Even so,
  any <code>RIGHT JOIN</code> can be rewritten as a <code>LEFT JOIN</code> by swapping the tables, and a
  <code>FULL JOIN</code> as the <code>UNION</code> of a left join and a right join. Use the
  <code>LEFT JOIN</code> in the exercise.</p>
</div>

<h1>Exercise</h1>
<p>You are going to work with a new table holding fictional data about the <strong>employees</strong> of the
film studio and the office <strong>buildings</strong> assigned to them. Some buildings are new and don't
have any employees yet, but we still need information about them.</p>
`,
  exerciseTitle: 'Exercise 7',
  tasks: [
    { text: 'Find the list of all buildings that have employees' },
    { text: 'Find the list of all buildings and their capacity' },
    { text: 'List all buildings and the distinct employee roles in each building (including empty buildings)', hint: 'Try a <code>LEFT JOIN</code> from <code>buildings</code> to <code>employees</code>.' }
  ]
},

'nulls': {
  title: 'Lesson 8: A short note on NULLs',
  shortTitle: 'NULL values',
  summary: 'What NULL means and how to test for it with IS NULL.',
  body: `
<p>As promised in the last lesson, let's talk briefly about <code>NULL</code> values. It's always good to
reduce the possibility of <code>NULL</code>s in a database, because they need special attention when you
build queries and constraints (some functions behave differently with nulls) and when you process the
results.</p>

<p>An alternative to <code>NULL</code>s is to use <em>data-type appropriate default values</em>: 0 for
numbers, empty strings for text, and so on. But if your database needs to store incomplete data,
<code>NULL</code>s can be the right choice when default values would skew later analysis (for example, when
taking averages).</p>

<p>Sometimes they can't be avoided either, as we saw in the previous lesson when outer-joining two tables
with asymmetric data. In those cases you can test a column for <code>NULL</code> inside a
<code>WHERE</code> clause using <code>IS NULL</code> or <code>IS NOT NULL</code>.</p>

<div class="definition">
    <div class="desc">Select query with constraints on NULL values</div>
    <code class="sql">SELECT column, another_column, …
FROM mytable
<strong>WHERE column IS/IS NOT NULL</strong>
AND/OR <i>another_condition</i>
AND/OR …;</code>
</div>

<div class="callout danger">
  <div class="desc">Careful: NULL is not compared with =</div>
  <p><code>column = NULL</code> is never true, not even when the column is null: in SQL's three-valued logic
  the result is <i>unknown</i>, not <i>true</i>. That's why <code>IS NULL</code> and
  <code>IS NOT NULL</code> exist. Likewise, <code>NULL &lt;&gt; 5</code> is not true either. And watch out
  for <code>NOT IN</code>: if the list contains a <code>NULL</code>, the condition never returns rows.</p>
</div>

<h1>Exercise</h1>
<p>This exercise is a review of the last few lessons. We're using the same <strong>employees</strong> and
<strong>buildings</strong> tables, but we've hired a couple more people who haven't been assigned a building
yet.</p>
`,
  exerciseTitle: 'Exercise 8',
  tasks: [
    { text: 'Find the name and role of all employees who have not been assigned to a building', hint: 'The <strong>building</strong> for those employees will have a NULL value.' },
    { text: 'Find the names of the buildings that hold no employees', hint: 'Find the employee roles in each building (like the last lesson): buildings without employees will have a NULL <code>role</code>.' }
  ]
},

'expresiones-alias': {
  title: 'Lesson 9: Queries with expressions',
  shortTitle: 'Expressions and aliases',
  summary: 'Computing values inside the query and naming them with AS.',
  body: `
<p>In addition to querying and referencing raw column data, SQL lets you use <i>expressions</i> to write more
complex logic on column values. These expressions can use mathematical and string functions along with basic
arithmetic to transform values while the query runs, as in this example:</p>

<div class="definition">
    <div class="desc">Example query with expressions</div>
    <code class="sql">SELECT <strong>particle_speed / 2.0</strong> AS half_particle_speed
FROM physics_data
WHERE <strong>ABS(particle_position) * 10.0 &gt; 500</strong>;</code>
</div>

<p>Every database has its own set of mathematical, string and date functions; you'll find them in its docs.
We dedicate several topics to them later in this course.</p>

<p>Using expressions saves time and post-processing of the results, but can also make the query harder to
read. That's why we recommend that, when you use expressions in the <code>SELECT</code> part, you give them
a descriptive <i>alias</i> with the <code>AS</code> keyword.</p>

<div class="definition">
    <div class="desc">Select query with expression aliases</div>
    <code class="sql">SELECT <strong><i>col_expression</i> AS <i>expr_description</i></strong>, …
FROM mytable;</code>
</div>

<p>Besides expressions, regular columns and even tables can have aliases, which makes them easier to
reference in the output and simplifies more complex queries.</p>

<div class="definition">
    <div class="desc">Example with both column and table aliases</div>
    <code class="sql">SELECT column <strong>AS better_column_name</strong>, …
FROM a_long_widgets_table_name <strong>AS mywidgets</strong>
INNER JOIN widget_sales
  ON mywidgets.id = widget_sales.widget_id;</code>
</div>

<h1>Exercise</h1>
<p>You'll have to use expressions to turn the <strong>boxoffice</strong> data into something easier to
understand.</p>
`,
  exerciseTitle: 'Exercise 9',
  tasks: [
    { text: 'List all movies and their combined sales in <strong>millions</strong> of dollars', hint: 'They are currently stored in dollars.' },
    { text: 'List all movies and their ratings <strong>in percent</strong>', hint: 'The rating goes from 0 to 10.' },
    { text: 'List all movies released in even-numbered years', hint: 'Use the modulo (<code>%</code>) to determine whether the year is even.' }
  ]
},

'agregados': {
  title: 'Lesson 10: Queries with aggregates (Pt. 1)',
  shortTitle: 'COUNT, SUM, AVG and GROUP BY',
  summary: 'Summarising groups of rows with aggregate functions.',
  body: `
<p>In addition to the simple expressions of the previous lesson, SQL supports <i>aggregate</i> expressions
(or functions) that let you summarise information about a group of rows. With the Pixar database, aggregate
functions answer questions like "how many movies has Pixar produced?" or "what is the highest grossing Pixar
film each year?".</p>

<div class="definition">
    <div class="desc">Select query with aggregate functions over all rows</div>
    <code class="sql"><strong>SELECT AGG_FUNC(<i>column_or_expression</i>) AS aggregate_description</strong>, …
FROM mytable
WHERE <i>constraint_expression</i>;</code>
</div>

<p>Without an explicit grouping, each aggregate function runs over the whole set of result rows and returns
a single value. As with normal expressions, giving your aggregates an alias makes the results easier to read
and process.</p>

<h1>Common aggregate functions</h1>
<div class="datatable">
    <table class="table">
        <tr><td style="width:26%">Function</td><td>Description</td></tr>
        <tr><td><strong>COUNT(</strong>*<strong>)</strong>, <strong>COUNT(</strong><i>column</i><strong>)</strong></td>
            <td>Counts the number of rows in the group if no column is given. If a column is given, counts the rows with a <em>non-null</em> value in that column.</td></tr>
        <tr><td><strong>MIN(</strong><i>column</i><strong>)</strong></td><td>Finds the smallest value of the column across all rows in the group.</td></tr>
        <tr><td><strong>MAX(</strong><i>column</i><strong>)</strong></td><td>Finds the largest value of the column across all rows in the group.</td></tr>
        <tr><td><strong>AVG(</strong><i>column</i><strong>)</strong></td><td>Finds the average of the numeric values in the column.</td></tr>
        <tr><td><strong>SUM(</strong><i>column</i><strong>)</strong></td><td>Sums all the numeric values in the column.</td></tr>
    </table>
</div>

<div class="callout note">
  <div class="desc">COUNT(*) versus COUNT(column)</div>
  <p><code>COUNT(*)</code> counts rows. <code>COUNT(column)</code> ignores <code>NULL</code>s. And
  <code>COUNT(DISTINCT column)</code> counts distinct non-null values. The three can return different
  numbers over the same data.</p>
</div>

<h1>Grouped aggregate functions</h1>
<p>Besides aggregating across all rows, you can apply the functions to specific groups of data (for example
box office sales for comedies versus action movies). That produces as many results as there are unique
groups defined by the <code>GROUP BY</code> clause.</p>

<div class="definition">
    <div class="desc">Select query with aggregate functions over groups</div>
    <code class="sql">SELECT AGG_FUNC(<i>column_or_expression</i>) AS aggregate_description, …
FROM mytable
WHERE <i>constraint_expression</i>
<strong>GROUP BY column</strong>;</code>
</div>

<p>The <code>GROUP BY</code> clause groups rows that have the same value in the specified column.</p>

<h1>Exercise</h1>
<p>For this exercise we work with the <strong>employees</strong> table. Notice how its rows share data, which
gives us the chance to use aggregates to summarise some high-level metrics about the teams.</p>
`,
  exerciseTitle: 'Exercise 10',
  tasks: [
    { text: 'Find the longest time that an employee has been at the studio', hint: 'Take the <strong>MAX()</strong> of the years employed.' },
    { text: 'For each role, find the average number of years employed by employees in that role', hint: 'Group by <strong>role</strong> and take the <strong>AVG()</strong>.' },
    { text: 'Find the total number of employee years worked in each building', hint: 'Group by <strong>building</strong> and take the <strong>SUM()</strong>.' }
  ]
},

'having': {
  title: 'Lesson 11: Queries with aggregates (Pt. 2)',
  shortTitle: 'HAVING',
  summary: 'Filtering the groups already formed, not the individual rows.',
  body: `
<p>Our queries are getting fairly complex, but we've nearly covered all the important parts of a
<code>SELECT</code>. You may have noticed one detail: if <code>GROUP BY</code> runs <em>after</em>
<code>WHERE</code> (which filters the rows that are about to be grouped), how exactly do we filter the
grouped rows?</p>

<p>SQL solves this with an additional <code>HAVING</code> clause, used specifically with
<code>GROUP BY</code> to filter grouped rows out of the result set.</p>

<div class="definition">
    <div class="desc">Select query with a HAVING constraint</div>
    <code class="sql">SELECT group_by_column, AGG_FUNC(<i>column_expression</i>) AS aggregate_result_alias, …
FROM mytable
WHERE <i>condition</i>
GROUP BY column
<strong>HAVING <i>group_condition</i></strong>;</code>
</div>

<p><code>HAVING</code> constraints are written the same way as <code>WHERE</code> constraints, but they are
applied to the grouped rows. With our examples this may not look particularly useful, but if you imagine
data with millions of rows and different properties, being able to apply extra constraints is often
essential.</p>

<div class="dyk">
    <div class="desc">Did you know?</div>
    <p>If you aren't using <code>GROUP BY</code>, a plain <code>WHERE</code> clause is enough. The rule of
    thumb: <strong>WHERE filters rows before grouping; HAVING filters groups after aggregating.</strong></p>
</div>

<h1>Exercise</h1>
<p>You'll dive deeper into the studio's <strong>employees</strong> data. Think about which clauses you need
for each task.</p>
`,
  exerciseTitle: 'Exercise 11',
  tasks: [
    { text: 'Find the number of <em>Artist</em>s in the studio (without a <strong>HAVING</strong> clause)', hint: 'You just need to count the rows with that role.' },
    { text: 'Find the number of employees of each role in the studio', hint: 'Count the rows and group by role.' },
    { text: 'Find the total number of years employed by all <em>Engineer</em>s', hint: 'Similar to the previous query: add a constraint on the role with <code>HAVING</code>.' }
  ]
},

'orden-de-ejecucion': {
  title: 'Lesson 12: Order of execution of a query',
  shortTitle: 'Order of execution',
  summary: 'The order in which the database actually evaluates each clause.',
  body: `
<p>Now that we know all the parts of a query, let's see how they fit together in a complete one.</p>

<div class="definition">
    <div class="desc">Complete SELECT query</div>
    <code class="sql">SELECT DISTINCT column, AGG_FUNC(<i>column_or_expression</i>), …
FROM mytable
    JOIN another_table
      ON mytable.column = another_table.column
    WHERE <i>constraint_expression</i>
    GROUP BY column
    HAVING <i>constraint_expression</i>
    ORDER BY <i>column</i> ASC/DESC
    LIMIT <i>count</i> OFFSET <i>count</i>;</code>
</div>

<p>Every query begins by finding the data we need and then filtering it down to something that can be
processed and understood as quickly as possible. Because each part runs sequentially, understanding the
order of execution is key to knowing which results are available where.</p>

<h1>Query order of execution</h1>

<h2>1. <code>FROM</code> and the <code>JOIN</code>s</h2>
<p>The <code>FROM</code> clause and its <code>JOIN</code>s run first to determine the total working set of
data being queried. This includes subqueries in this clause, and can cause temporary tables to be created
under the hood containing all the columns and rows of the joined tables.</p>

<h2>2. <code>WHERE</code></h2>
<p>Once we have the full working set, the first-pass <code>WHERE</code> constraints are applied row by row,
and rows that don't satisfy them are discarded. Each constraint can only access columns from the tables
listed in the <code>FROM</code> clause. Aliases defined in the <code>SELECT</code> part are
<strong>not</strong> accessible in most databases, since they may include expressions depending on parts of
the query that haven't run yet.</p>

<h2>3. <code>GROUP BY</code></h2>
<p>The rows that survive the <code>WHERE</code> are grouped by the common values of the specified column. As
a result there will be only as many rows as there are unique values in that column. Implicitly, this means
you should only need it when your query contains aggregate functions.</p>

<h2>4. <code>HAVING</code></h2>
<p>If the query has a <code>GROUP BY</code>, the <code>HAVING</code> constraints are applied to the grouped
rows, discarding the groups that don't satisfy them. As with <code>WHERE</code>, most engines don't let you
use a <code>SELECT</code> alias here either.</p>

<h2>5. <code>SELECT</code></h2>
<p>Any expressions in the <code>SELECT</code> part are finally computed.</p>

<h2>6. <code>DISTINCT</code></h2>
<p>Of the remaining rows, those with duplicate values in the columns marked as <code>DISTINCT</code> are
discarded.</p>

<h2>7. <code>ORDER BY</code></h2>
<p>If an order is specified, the rows are sorted ascending or descending. Since all the expressions in the
<code>SELECT</code> part have been computed, <strong>here you can</strong> reference aliases.</p>

<h2>8. <code>LIMIT</code> / <code>OFFSET</code></h2>
<p>Finally, the rows outside the specified range are discarded, leaving the final set of rows the query
returns.</p>

<h2>Conclusion</h2>
<p>Not every query needs all these parts, but part of why SQL is so flexible is that it lets you manipulate
data quickly without writing extra code, just by combining these clauses.</p>

<div class="callout note">
  <div class="desc">A trick to remember it</div>
  <p>The <em>written</em> order is SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT.
  The <em>executed</em> order is FROM → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT.
  Nearly every "unknown column" error when using an alias comes from mixing the two up.</p>
</div>

<h1>Exercise</h1>
<p>This is where our lessons on <code>SELECT</code> queries end. This exercise tests what you've learned, so
don't be discouraged if you find it challenging.</p>
`,
  exerciseTitle: 'Exercise 12',
  tasks: [
    { text: 'Find the number of movies each director has directed', hint: 'Group by director and count the movies.' },
    { text: 'Find the total domestic and international sales that can be attributed to each director', hint: 'Join the data and group it before summing up the sales.' }
  ]
}

});
