CURSO.register({
  slug: 'seguridad-usuarios',
  section: 'diseno',
  source: 'extra',
  title: 'Tema: Usuarios, permisos y seguridad (DCL)',
  shortTitle: 'Usuarios y permisos',
  summary: 'GRANT, REVOKE, roles, principio de mínimo privilegio e inyección SQL.',
  keywords: 'grant revoke roles permisos dcl inyeccion sql injection prepared statement rls',
  body: `
<p>El tercer subconjunto de SQL, después del DML (datos) y el DDL (esquema), es el <strong>DCL</strong>
(<i>Data Control Language</i>): quién puede hacer qué.</p>

<div class="callout sqlite">
  <div class="desc">SQLite no tiene usuarios</div>
  <p>SQLite es un archivo: los permisos son los del sistema de ficheros. No existen <code>GRANT</code> ni
  <code>REVOKE</code>. Este tema es de <strong>referencia</strong> para PostgreSQL, MySQL, SQL Server y
  Oracle; la parte de inyección SQL, en cambio, te afecta uses el motor que uses.</p>
</div>

<h1>Crear usuarios y roles</h1>
<div class="definition">
    <div class="desc">PostgreSQL</div>
    <code class="sql">CREATE ROLE analista;                          <i>-- rol = grupo de permisos</i>
CREATE USER ana WITH PASSWORD '…';             <i>-- usuario que puede iniciar sesión</i>
GRANT analista TO ana;                         <i>-- ana hereda los permisos del rol</i></code>
</div>

<div class="definition">
    <div class="desc">MySQL</div>
    <code class="sql">CREATE USER 'ana'@'%' IDENTIFIED BY '…';
CREATE ROLE 'analista';
GRANT 'analista' TO 'ana'@'%';</code>
</div>

<h1>GRANT y REVOKE</h1>
<div class="definition">
    <div class="desc">Conceder y retirar permisos</div>
    <code class="sql"><i>-- solo lectura sobre dos tablas</i>
GRANT SELECT ON pedidos, clientes TO analista;

<i>-- lectura y escritura sobre un esquema entero (PostgreSQL)</i>
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA ventas TO app;

<i>-- solo una columna</i>
GRANT SELECT (id, nombre) ON clientes TO soporte;

<i>-- ejecutar un procedimiento sin tocar sus tablas</i>
GRANT EXECUTE ON PROCEDURE sp_aplicar_descuento TO app;

<i>-- retirar</i>
REVOKE DELETE ON pedidos FROM analista;</code>
</div>

<div class="datatable">
  <table class="table">
    <tr><td style="width:26%">Privilegio</td><td>Permite</td></tr>
    <tr><td><code>SELECT</code></td><td>Leer filas</td></tr>
    <tr><td><code>INSERT</code> / <code>UPDATE</code> / <code>DELETE</code></td><td>Modificar datos</td></tr>
    <tr><td><code>EXECUTE</code></td><td>Ejecutar funciones y procedimientos</td></tr>
    <tr><td><code>REFERENCES</code></td><td>Crear claves foráneas hacia la tabla</td></tr>
    <tr><td><code>CREATE</code>, <code>ALTER</code>, <code>DROP</code></td><td>Modificar el esquema</td></tr>
    <tr><td><code>ALL PRIVILEGES</code></td><td>Todo lo anterior. Rara vez es lo que quieres.</td></tr>
  </table>
</div>

<h1>Principio de mínimo privilegio</h1>
<ul>
  <li>La aplicación web <strong>nunca</strong> se conecta como superusuario ni como el dueño del esquema.</li>
  <li>Un usuario distinto por tipo de acceso: <code>app_escritura</code>, <code>app_lectura</code>,
      <code>backup</code>, <code>migraciones</code>.</li>
  <li>Los informes leen de <strong>vistas</strong>, no de las tablas: así ocultas columnas sensibles.</li>
  <li>Los permisos de <code>DROP</code> y <code>ALTER</code> viven solo en el proceso de migración.</li>
</ul>

<h1>Seguridad a nivel de fila</h1>
<p>PostgreSQL, SQL Server y Oracle permiten filtrar filas por usuario de forma transparente:</p>
<div class="definition">
    <div class="desc">Row Level Security en PostgreSQL</div>
    <code class="sql">ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

CREATE POLICY solo_mis_pedidos ON pedidos
    FOR SELECT
    USING (cliente_id = current_setting('app.cliente_id')::INT);</code>
</div>

<h1>Inyección SQL</h1>
<p>La vulnerabilidad más común en aplicaciones con base de datos. Ocurre cuando se construye SQL concatenando
texto que viene del usuario:</p>

<div class="callout danger">
  <div class="desc">Nunca hagas esto</div>
  <p><code class="sql">consulta = "SELECT * FROM clientes WHERE email = '" + entrada + "'";</code></p>
  <p>Si <code>entrada</code> vale <code>' OR '1'='1</code>, la condición siempre es cierta y se devuelve la
  tabla entera. Si vale <code>'; DROP TABLE clientes; --</code>, peor.</p>
</div>

<div class="definition">
    <div class="desc">La solución: consultas parametrizadas</div>
    <code class="sql"><i>-- Python</i>
cur.execute("SELECT * FROM clientes WHERE email = ?", (entrada,))

<i>-- Java / JDBC</i>
ps = con.prepareStatement("SELECT * FROM clientes WHERE email = ?");
ps.setString(1, entrada);

<i>-- Node.js</i>
db.query('SELECT * FROM clientes WHERE email = $1', [entrada]);</code>
</div>

<p>Con parámetros, el motor recibe la consulta y los datos <em>por separado</em>: el valor nunca puede
convertirse en sintaxis. Esto no es «escapar comillas» — escapar a mano falla tarde o temprano.</p>

<h1>Otras medidas habituales</h1>
<ul>
  <li><strong>Cifrado</strong>: TLS en la conexión, cifrado en reposo del volumen, y cifrado a nivel de
      columna para datos especialmente sensibles.</li>
  <li><strong>Hash de contraseñas</strong>: nunca se guardan, ni cifradas; se guarda un hash lento
      (bcrypt, argon2) calculado en la aplicación.</li>
  <li><strong>Auditoría</strong>: registrar accesos y cambios (ver <a href="#/triggers">Disparadores</a>).</li>
  <li><strong>Copias de seguridad probadas</strong>: una copia que nunca se ha restaurado no es una copia.</li>
  <li><strong>Datos anonimizados</strong> en los entornos de desarrollo y pruebas.</li>
</ul>
`
});
