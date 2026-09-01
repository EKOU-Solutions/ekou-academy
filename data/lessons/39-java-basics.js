CURSO.register({
  slug: 'java-basics',
  section: 'java',
  source: 'extra',
  title: 'Lección 1: Java Basics',
  shortTitle: 'Java Basics',
  summary: 'Del código fuente a la JVM: JDK, javac, bytecode, carga de clases y memoria.',
  keywords: 'java jdk jre jvm javac bytecode class loader linking initialization heap stack pc register jit interpreter garbage collector jar main-class hello',
  body: `
<p>Java separa de forma deliberada el código que escribimos, las herramientas que lo compilan y el runtime que lo ejecuta. Entender esa separación evita confundir <code>javac</code>, el launcher <code>java</code> y la JVM.</p>

<h1>El viaje de un programa Java</h1>
<div class="definition">
  <div class="desc">De <code>.java</code> a la ejecución</div>
  <code class="sql">Hello.java → javac → Hello.class (bytecode) → java Hello → JVM</code>
</div>
<p><code>javac</code> lee el código fuente <code>.java</code> y lo compila a bytecode, normalmente en un archivo <code>.class</code>. Después, el launcher <code>java</code> inicia una JVM, le indica qué clase debe arrancar y le pasa sus argumentos. La JVM carga, enlaza, inicializa y ejecuta ese bytecode.</p>
<p>El bytecode no es código fuente ni código nativo de una CPU concreta. Es una representación intermedia que permite que el mismo <code>.class</code> se ejecute en cualquier plataforma que tenga una implementación compatible de la JVM.</p>

<h1>JDK, JRE, JVM y Java SE</h1>
<div class="datatable">
  <table class="table">
    <tr><td>Concepto</td><td>Qué significa</td></tr>
    <tr><td><strong>JDK</strong></td><td>Kit de desarrollo: contiene herramientas como <code>javac</code>, el launcher <code>java</code> y un runtime para compilar y ejecutar.</td></tr>
    <tr><td><strong>JRE</strong></td><td>Concepto histórico para el entorno de ejecución (JVM más librerías y archivos de soporte). Oracle y OpenJDK ya no suelen distribuir un JRE standalone moderno; para desarrollar se instala un JDK.</td></tr>
    <tr><td><strong>JVM</strong></td><td>La máquina virtual que carga, enlaza, inicializa y ejecuta bytecode. El JDK/JRE la incluyen, pero no es el compilador.</td></tr>
    <tr><td><strong>Java SE API</strong></td><td>El contrato de clases, interfaces, métodos y comportamiento estándar que pueden usar los programas Java.</td></tr>
    <tr><td><strong>Implementación de la standard library</strong></td><td>El código real que proporciona esa API en una distribución concreta, por ejemplo una distribución de OpenJDK. API y código de implementación no son lo mismo.</td></tr>
  </table>
</div>
<div class="callout note">
  <div class="desc">Decisión práctica</div>
  <p>Si vas a programar, instala un <strong>JDK</strong>. El JRE es útil como concepto histórico para razonar sobre el runtime, pero no debes buscar necesariamente un instalador moderno separado.</p>
</div>

<h1>Qué hace la JVM</h1>
<p>Al recibir una clase, la JVM coordina varias fases:</p>
<ol>
  <li><strong>Loading:</strong> un Class Loader carga la representación binaria de una clase.</li>
  <li><strong>Linking:</strong> la JVM verifica el bytecode, prepara estructuras y valores estáticos, y puede resolver referencias simbólicas.</li>
  <li><strong>Initialization:</strong> ejecuta los inicializadores de la clase y los bloques <code>static</code> cuando corresponde.</li>
  <li><strong>Execution:</strong> ejecuta las instrucciones y métodos del bytecode.</li>
</ol>
<p>El <strong>Class Loader</strong> carga clases binarias, como las que están en archivos <code>.class</code> o dentro de un JAR. No convierte un <code>.java</code> en un <code>.class</code>: esa transformación la hace <code>javac</code>, que es una herramienta del JDK y no una parte de la JVM.</p>
<p>En <strong>linking</strong>, la <em>verification</em> comprueba que el bytecode respeta restricciones de seguridad y formato; la <em>preparation</em> reserva y prepara memoria para campos estáticos; la <em>resolution</em> convierte referencias simbólicas en referencias concretas cuando se necesita y puede ser opcional o perezosa. En <strong>initialization</strong> se ejecutan los inicializadores y bloques estáticos en el orden definido por Java.</p>

<h1>Áreas de memoria de la JVM</h1>
<div class="datatable">
  <table class="table">
    <tr><td>Área</td><td>Idea clave</td></tr>
    <tr><td><strong>Method Area</strong></td><td>Información por clase: metadatos, representación del runtime y datos de métodos/campos estáticos.</td></tr>
    <tr><td><strong>Heap</strong></td><td>Zona compartida donde viven los objetos y arrays creados durante la ejecución.</td></tr>
    <tr><td><strong>Stack</strong></td><td>Cada thread tiene su propio stack, con frames de llamadas, variables locales y operandos.</td></tr>
    <tr><td><strong>PC Register</strong></td><td>Cada thread mantiene un contador de programa que identifica la siguiente instrucción de bytecode que debe ejecutar. No realiza cálculos ni almacena resultados de operaciones.</td></tr>
  </table>
</div>
<p>El <strong>Interpreter</strong> puede ejecutar bytecode instrucción a instrucción. Cuando detecta código frecuente, el <strong>JIT (Just-In-Time compiler)</strong> puede compilarlo y optimizarlo a código nativo para esa máquina. El <strong>Garbage Collector</strong> recupera la memoria de objetos que ya no son alcanzables; no elimina variables porque su nombre haya desaparecido sin más.</p>

<h1>JDK, JAR y ejecución</h1>
<p>Un <strong>JAR</strong> es un archivo que empaqueta clases y recursos. Que termine en <code>.jar</code> no lo hace ejecutable automáticamente: para ejecutarlo con <code>java -jar</code> necesita un entry point, normalmente una entrada <code>Main-Class</code> en su manifiesto que apunte a una clase con <code>public static void main(String[] args)</code>.</p>

<h1>Práctica local</h1>
<p>Para comprobar el flujo en tu máquina:</p>
<ol>
  <li>Instala un JDK y verifica que tanto <code>JAVA_HOME</code> como <code>PATH</code> apuntan a la distribución que quieres usar.</li>
  <li>Ejecuta <code>java --version</code> y <code>javac --version</code>. El primero consulta el launcher/runtime; el segundo consulta el compilador.</li>
  <li>Crea <code>Hello.java</code> con una clase <code>Hello</code> que tenga un método <code>main</code>:</li>
</ol>
<div class="definition">
  <div class="desc">Hello.java</div>
  <code class="sql">public class Hello {
  public static void main(String[] args) {
    System.out.println("Hello, Java!");
  }
}</code>
</div>
<ol start="4">
  <li>Compila con <code>javac Hello.java</code>. Observa cómo aparece <code>Hello.class</code>.</li>
  <li>Ejecuta con <code>java Hello</code>, sin escribir <code>.class</code>; el launcher encuentra la clase y la JVM ejecuta su bytecode.</li>
</ol>
<p>Cuando termines los checkpoints, puedes hacer el <a href="#/java-basics-exam">examen de Java Basics</a>.</p>
`,
  exercise: {
    type: 'quiz',
    title: 'Comprobación: Java Basics',
    passingScore: 1,
    tasks: [
      {
        text: 'Ordena mentalmente el flujo desde el archivo fuente hasta la ejecución.',
        options: [
          '<code>.java</code> → <code>java</code> → <code>javac</code> → JVM',
          '<code>.java</code> → <code>javac</code> → <code>.class</code>/bytecode → launcher <code>java</code> → JVM',
          '<code>.java</code> → JVM → <code>javac</code> → <code>.class</code>',
          '<code>.class</code> → <code>javac</code> → <code>.java</code> → launcher <code>java</code>'
        ],
        answer: 1,
        explanation: 'javac compila el fuente a bytecode; después java inicia una JVM para cargarlo y ejecutarlo.'
      },
      {
        text: '¿Cuál es la relación práctica entre JDK y JRE?',
        options: [
          'El JDK solo contiene la JVM y el JRE contiene javac.',
          'Son dos nombres actuales para exactamente el mismo ejecutable.',
          'El JDK reúne herramientas de desarrollo y runtime; el JRE es el concepto histórico del entorno de ejecución y ya no suele distribuirse standalone moderno.',
          'El JRE compila y el JDK solo ejecuta bytecode.'
        ],
        answer: 2,
        explanation: 'Para desarrollar se instala un JDK, que ya incluye lo necesario para ejecutar. El JRE se conserva como modelo mental histórico del runtime.'
      },
      {
        text: '¿Qué describe mejor la diferencia entre Java SE API y la standard library?',
        options: [
          'La API es el contrato; la standard library es una implementación concreta de ese contrato.',
          'La API es el compilador y la standard library es el Class Loader.',
          'Son nombres intercambiables para el archivo Hello.class.',
          'La API solo existe en el JDK y la standard library solo en el JRE.'
        ],
        answer: 0,
        explanation: 'La Java SE API define tipos y comportamiento esperado; una distribución proporciona el código que implementa esa API.'
      },
      {
        text: '¿Qué hace el Class Loader?',
        options: [
          'Convierte código fuente .java en bytecode .class.',
          'Carga la representación binaria de las clases para que la JVM pueda enlazarlas e inicializarlas.',
          'Compila todos los métodos frecuentes a código nativo.',
          'Recupera objetos no alcanzables del heap.'
        ],
        answer: 1,
        explanation: 'El compilador javac crea bytecode. El Class Loader carga clases binarias; linking e initialization son fases posteriores de la JVM.'
      },
      {
        text: '¿Cuál afirmación sobre la memoria y la ejecución es correcta?',
        options: [
          'El PC Register es un procesador que calcula expresiones.',
          'Cada thread tiene su stack y PC Register; el heap contiene objetos y el Garbage Collector recupera los no alcanzables.',
          'El JIT sustituye al Garbage Collector y libera el Method Area.',
          'El Interpreter solo ejecuta código fuente .java.'
        ],
        answer: 1,
        explanation: 'El PC Register identifica la siguiente instrucción de bytecode del thread y no calcula. Interpreter y JIT ejecutan/optimizan; GC recupera objetos no alcanzables.'
      },
      {
        text: '¿Qué secuencia de comandos reproduce la práctica recomendada?',
        options: [
          '<code>java --version</code> → <code>javac --version</code> → <code>java Hello.java</code>',
          '<code>javac --version</code> → <code>javac Hello.java</code> → <code>java Hello</code>',
          '<code>javac Hello</code> → <code>java Hello.class</code> → <code>javac --version</code>',
          '<code>java Hello.java</code> → <code>javac Hello.class</code> → <code>java --version</code>'
        ],
        answer: 1,
        explanation: 'Primero verificas el JDK, luego compilas el fuente y finalmente ejecutas el nombre de la clase con java, sin .class.'
      }
    ]
  }
});
