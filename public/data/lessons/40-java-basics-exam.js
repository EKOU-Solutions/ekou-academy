CURSO.register({
  slug: 'java-basics-exam',
  section: 'java',
  source: 'extra',
  title: 'Examen: Java Basics',
  shortTitle: 'Examen Java Basics',
  summary: 'Comprueba los conceptos esenciales de JDK, javac, bytecode, JVM, class loading y memoria.',
  keywords: 'java examen quiz jdk jre jvm javac bytecode class loader linking initialization pc register',
  body: `
<p>Este examen reúne las comprobaciones esenciales de <a href="#/java-basics">Java Basics</a>. Lee cada pregunta, elige una opción y pulsa <strong>Comprobar respuesta</strong>. Recibirás feedback inmediato y podrás revisar cualquier respuesta.</p>
<div class="callout note">
  <div class="desc">Criterio de aprobación</div>
  <p>Necesitas al menos <strong>6 de 8</strong> respuestas correctas (75%). El resultado se guarda en este navegador junto con tu progreso.</p>
</div>
<p>Si una respuesta falla, usa la explicación para volver a la lección y repite la pregunta. El examen queda completado cuando alcanzas el criterio de aprobación.</p>
`,
  exercise: {
    type: 'quiz',
    title: 'Examen Java Basics · 8 preguntas',
    passingScore: 0.75,
    tasks: [
      {
        text: '¿Qué función cumple el JDK?',
        options: [
          'Es solo una máquina virtual que ejecuta bytecode.',
          'Es el kit de desarrollo que reúne herramientas como javac y el runtime para desarrollar y ejecutar Java.',
          'Es el archivo .class que genera el compilador.',
          'Es el nombre de la API estándar, sin ninguna implementación.'
        ],
        answer: 1,
        explanation: 'El JDK proporciona herramientas de desarrollo y un runtime; por eso es la instalación adecuada para programar.'
      },
      {
        text: '¿Qué función cumple <code>javac</code>?',
        options: [
          'Inicia una JVM y ejecuta una clase.',
          'Carga clases binarias desde el classpath.',
          'Compila código fuente .java a bytecode, normalmente en archivos .class.',
          'Recupera objetos no alcanzables del heap.'
        ],
        answer: 2,
        explanation: 'javac es el compilador del JDK. La JVM no recibe código fuente como resultado de esa fase: recibe bytecode.'
      },
      {
        text: '¿Qué es el bytecode?',
        options: [
          'Código fuente Java con otra extensión.',
          'Código nativo específico de macOS, Windows o Linux.',
          'Una representación intermedia en instrucciones para la JVM, normalmente almacenada en .class.',
          'La lista de dependencias del manifiesto de un JAR.'
        ],
        answer: 2,
        explanation: 'El bytecode es portable entre plataformas con una JVM compatible; no es ni el fuente ni el código nativo final.'
      },
      {
        text: '¿Qué hace el launcher <code>java</code> y qué hace la JVM?',
        options: [
          'java compila; la JVM empaqueta el resultado en un JAR.',
          'java inicia/configura la ejecución de una clase; la JVM carga, enlaza, inicializa y ejecuta su bytecode.',
          'java es un alias de javac; la JVM solo verifica la sintaxis.',
          'java ejecuta el código nativo; la JVM solo administra JAVA_HOME.'
        ],
        answer: 1,
        explanation: 'El launcher es el punto de entrada del proceso. La JVM realiza el ciclo de carga, linking, initialization y execution.'
      },
      {
        text: '¿Por qué <code>javac</code> no pertenece a la JVM?',
        options: [
          'Porque javac es una herramienta del JDK que transforma fuente en bytecode antes de que la JVM lo ejecute.',
          'Porque javac solo funciona con JAR ejecutables.',
          'Porque la JVM no puede ejecutar ningún método main.',
          'Porque javac es parte del Garbage Collector.'
        ],
        answer: 0,
        explanation: 'La JVM es el runtime que ejecuta bytecode. El compilador es una herramienta separada del JDK y produce ese bytecode.'
      },
      {
        text: '¿Por qué el JRE ya no suele instalarse como producto independiente?',
        options: [
          'Porque Java ya no usa una JVM.',
          'Porque los JDK modernos ya incluyen el runtime necesario y Oracle/OpenJDK no suelen distribuir un JRE standalone moderno.',
          'Porque javac reemplazó al JRE en tiempo de ejecución.',
          'Porque el bytecode solo puede ejecutarse en un navegador.'
        ],
        answer: 1,
        explanation: 'JRE sigue siendo un concepto útil para describir el runtime, pero para instalar Java actualmente suele elegirse un JDK completo.'
      },
      {
        text: '¿Qué hace el Class Loader y qué diferencia hay entre linking e initialization?',
        options: [
          'Class Loader compila .java; linking ejecuta main e initialization genera bytecode.',
          'Class Loader carga clases binarias; linking verifica/prepara y puede resolver referencias; initialization ejecuta inicializadores y bloques static.',
          'Class Loader libera el heap; linking y initialization son dos tipos de Garbage Collection.',
          'Class Loader solo lee JAVA_HOME; linking empaqueta JARs e initialization ejecuta javac.'
        ],
        answer: 1,
        explanation: 'Cargar no es compilar. Linking prepara la clase para usarla; initialization ejecuta su código estático cuando llega el momento.'
      },
      {
        text: '¿Qué significa PC Register y qué almacena?',
        options: [
          'Program Calculation Register: almacena resultados aritméticos del thread.',
          'Program Counter Register: identifica la siguiente instrucción de bytecode que debe ejecutar el thread; no realiza cálculos.',
          'Permanent Class Register: almacena todas las clases del heap.',
          'Process Compiler Register: guarda el código fuente antes de javac.'
        ],
        answer: 1,
        explanation: 'PC significa Program Counter. Es un área por thread que señala la posición de ejecución, no una unidad que haga cálculos.'
      }
    ]
  }
});
