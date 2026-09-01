I18N.registerLessons('en', {
  'java-basics': {
    title: 'Lesson 1: Java Basics',
    shortTitle: 'Java Basics',
    summary: 'From source code to the JVM: JDK, javac, bytecode, class loading and memory.',
    body: `
<p>Java deliberately separates the code we write, the tools that compile it, and the runtime that executes it. Understanding that separation prevents confusion between <code>javac</code>, the <code>java</code> launcher, and the JVM.</p>

<h1>A Java program\'s journey</h1>
<div class="definition">
  <div class="desc">From <code>.java</code> to execution</div>
  <code class="sql">Hello.java → javac → Hello.class (bytecode) → java Hello → JVM</code>
</div>
<p><code>javac</code> reads <code>.java</code> source code and compiles it to bytecode, normally in a <code>.class</code> file. The <code>java</code> launcher then starts a JVM, tells it which class to start, and passes its arguments. The JVM loads, links, initializes, and executes that bytecode.</p>
<p>Bytecode is neither source code nor native code for one specific CPU. It is an intermediate representation that lets the same <code>.class</code> run on any platform with a compatible JVM implementation.</p>

<h1>JDK, JRE, JVM, and Java SE</h1>
<div class="datatable">
  <table class="table">
    <tr><td>Concept</td><td>What it means</td></tr>
    <tr><td><strong>JDK</strong></td><td>Development kit: it contains tools such as <code>javac</code>, the <code>java</code> launcher, and a runtime for compiling and running Java.</td></tr>
    <tr><td><strong>JRE</strong></td><td>Historical concept for the runtime environment (JVM plus libraries and support files). Oracle and OpenJDK no longer normally distribute a modern standalone JRE; developers install a JDK.</td></tr>
    <tr><td><strong>JVM</strong></td><td>The virtual machine that loads, links, initializes, and executes bytecode. The JDK/JRE include it, but it is not the compiler.</td></tr>
    <tr><td><strong>Java SE API</strong></td><td>The contract of standard classes, interfaces, methods, and behaviour that Java programs can use.</td></tr>
    <tr><td><strong>Standard library implementation</strong></td><td>The actual code that provides that API in a particular distribution, such as an OpenJDK distribution. The API and its implementation are not the same thing.</td></tr>
  </table>
</div>
<div class="callout note">
  <div class="desc">Practical decision</div>
  <p>If you are going to write programs, install a <strong>JDK</strong>. JRE remains a useful historical runtime concept, but you should not necessarily look for a separate modern installer.</p>
</div>

<h1>What the JVM does</h1>
<p>When it receives a class, the JVM coordinates several phases:</p>
<ol>
  <li><strong>Loading:</strong> a Class Loader loads a class\'s binary representation.</li>
  <li><strong>Linking:</strong> the JVM verifies bytecode, prepares structures and static values, and may resolve symbolic references.</li>
  <li><strong>Initialization:</strong> it runs the class initializers and <code>static</code> blocks when appropriate.</li>
  <li><strong>Execution:</strong> it executes bytecode instructions and methods.</li>
</ol>
<p>The <strong>Class Loader</strong> loads binary classes, such as classes in <code>.class</code> files or inside a JAR. It does not convert <code>.java</code> into <code>.class</code>: <code>javac</code>, a JDK tool rather than a JVM component, performs that transformation.</p>
<p>During <strong>linking</strong>, <em>verification</em> checks that bytecode follows security and format constraints; <em>preparation</em> allocates and prepares memory for static fields; <em>resolution</em> turns symbolic references into concrete references when needed and may be optional or lazy. During <strong>initialization</strong>, initializers and static blocks run in Java\'s defined order.</p>

<h1>JVM memory areas</h1>
<div class="datatable">
  <table class="table">
    <tr><td>Area</td><td>Key idea</td></tr>
    <tr><td><strong>Method Area</strong></td><td>Per-class information: metadata, runtime representation, and method/static-field data.</td></tr>
    <tr><td><strong>Heap</strong></td><td>Shared area where objects and arrays created during execution live.</td></tr>
    <tr><td><strong>Stack</strong></td><td>Each thread has its own stack, with call frames, local variables, and operands.</td></tr>
    <tr><td><strong>PC Register</strong></td><td>Each thread keeps a program counter identifying the next bytecode instruction to execute. It does not perform calculations or store operation results.</td></tr>
  </table>
</div>
<p>The <strong>Interpreter</strong> can execute bytecode instruction by instruction. When it detects frequently used code, the <strong>JIT (Just-In-Time compiler)</strong> can compile and optimize it to native code for that machine. The <strong>Garbage Collector</strong> recovers memory from objects that are no longer reachable; it does not simply delete variables because their names disappeared.</p>

<h1>JDK, JARs, and execution</h1>
<p>A <strong>JAR</strong> is an archive that packages classes and resources. A <code>.jar</code> extension does not make it executable automatically: running it with <code>java -jar</code> requires an entry point, normally a <code>Main-Class</code> manifest entry pointing to a class with <code>public static void main(String[] args)</code>.</p>

<h1>Local practice</h1>
<p>To check the flow on your machine:</p>
<ol>
  <li>Install a JDK and verify that both <code>JAVA_HOME</code> and <code>PATH</code> point to the distribution you want to use.</li>
  <li>Run <code>java --version</code> and <code>javac --version</code>. The first checks the launcher/runtime; the second checks the compiler.</li>
  <li>Create <code>Hello.java</code> with a <code>Hello</code> class containing a <code>main</code> method:</li>
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
  <li>Compile with <code>javac Hello.java</code>. Observe how <code>Hello.class</code> appears.</li>
  <li>Run with <code>java Hello</code>, without writing <code>.class</code>; the launcher finds the class and the JVM executes its bytecode.</li>
</ol>
<p>When you finish the checkpoints, you can take the <a href="#/java-basics-exam">Java Basics exam</a>.</p>
`,
    exerciseTitle: 'Checkpoints: Java Basics',
    tasks: [
      {
        text: 'Mentally order the flow from the source file to execution.',
        options: [
          '<code>.java</code> → <code>java</code> → <code>javac</code> → JVM',
          '<code>.java</code> → <code>javac</code> → <code>.class</code>/bytecode → <code>java</code> launcher → JVM',
          '<code>.java</code> → JVM → <code>javac</code> → <code>.class</code>',
          '<code>.class</code> → <code>javac</code> → <code>.java</code> → <code>java</code> launcher'
        ],
        explanation: 'javac compiles source to bytecode; java then starts a JVM to load and execute it.'
      },
      {
        text: 'What is the practical relationship between the JDK and JRE?',
        options: [
          'The JDK only contains the JVM and the JRE contains javac.',
          'They are two current names for exactly the same executable.',
          'The JDK gathers development tools and a runtime; JRE is the historical runtime concept and is no longer usually a modern standalone distribution.',
          'The JRE compiles and the JDK only runs bytecode.'
        ],
        explanation: 'For development, install a JDK, which already includes what is needed to run programs. JRE remains a useful historical runtime model.'
      },
      {
        text: 'Which best describes the difference between the Java SE API and the standard library?',
        options: [
          'The API is the contract; the standard library is a concrete implementation of that contract.',
          'The API is the compiler and the standard library is the Class Loader.',
          'They are interchangeable names for the Hello.class file.',
          'The API only exists in the JDK and the standard library only exists in the JRE.'
        ],
        explanation: 'The Java SE API defines types and expected behaviour; a distribution provides the code that implements that API.'
      },
      {
        text: 'What does the Class Loader do?',
        options: [
          'It converts .java source code into .class bytecode.',
          'It loads the binary representation of classes so the JVM can link and initialize them.',
          'It compiles every frequently used method to native code.',
          'It recovers unreachable objects from the heap.'
        ],
        explanation: 'The javac compiler creates bytecode. The Class Loader loads binary classes; linking and initialization are later JVM phases.'
      },
      {
        text: 'Which statement about memory and execution is correct?',
        options: [
          'The PC Register is a processor that calculates expressions.',
          'Each thread has its own stack and PC Register; the heap contains objects and the Garbage Collector recovers unreachable ones.',
          'The JIT replaces the Garbage Collector and frees the Method Area.',
          'The Interpreter only executes .java source code.'
        ],
        explanation: 'The PC Register identifies a thread\'s next bytecode instruction and does not calculate. Interpreter and JIT execute/optimize; GC recovers unreachable objects.'
      },
      {
        text: 'Which command sequence reproduces the recommended practice?',
        options: [
          '<code>java --version</code> → <code>javac --version</code> → <code>java Hello.java</code>',
          '<code>javac --version</code> → <code>javac Hello.java</code> → <code>java Hello</code>',
          '<code>javac Hello</code> → <code>java Hello.class</code> → <code>javac --version</code>',
          '<code>java Hello.java</code> → <code>javac Hello.class</code> → <code>java --version</code>'
        ],
        explanation: 'First verify the JDK, then compile the source, and finally run the class name with java, without .class.'
      }
    ]
  },
  'java-basics-exam': {
    title: 'Exam: Java Basics',
    shortTitle: 'Java Basics Exam',
    summary: 'Check the essential concepts of JDK, javac, bytecode, JVM, class loading, and memory.',
    body: `
<p>This exam brings together the essential checks from <a href="#/java-basics">Java Basics</a>. Read each question, choose an option, and press <strong>Check answer</strong>. You will receive immediate feedback and can review any answer.</p>
<div class="callout note">
  <div class="desc">Passing criterion</div>
  <p>You need at least <strong>6 of 8</strong> correct answers (75%). The result is saved in this browser along with your progress.</p>
</div>
<p>If an answer is wrong, use the explanation to return to the lesson and try the question again. The exam is complete once you reach the passing criterion.</p>
`,
    exerciseTitle: 'Java Basics Exam · 8 questions',
    tasks: [
      {
        text: 'What is the role of the JDK?',
        options: [
          'It is only a virtual machine that executes bytecode.',
          'It is the development kit that gathers tools such as javac and a runtime for developing and running Java.',
          'It is the .class file generated by the compiler.',
          'It is the standard API name, without any implementation.'
        ],
        explanation: 'The JDK provides development tools and a runtime, so it is the appropriate installation for programming.'
      },
      {
        text: 'What does <code>javac</code> do?',
        options: [
          'It starts a JVM and executes a class.',
          'It loads binary classes from the classpath.',
          'It compiles .java source code to bytecode, normally in .class files.',
          'It recovers unreachable objects from the heap.'
        ],
        explanation: 'javac is the JDK compiler. The JVM does not receive source code as the result of this phase: it receives bytecode.'
      },
      {
        text: 'What is bytecode?',
        options: [
          'Java source code with another extension.',
          'Native code specific to macOS, Windows, or Linux.',
          'An intermediate representation in JVM instructions, normally stored in .class files.',
          'The dependency list in a JAR manifest.'
        ],
        explanation: 'Bytecode is portable across platforms with a compatible JVM; it is neither source code nor the final native code.'
      },
      {
        text: 'What does the <code>java</code> launcher do and what does the JVM do?',
        options: [
          'java compiles; the JVM packages the result into a JAR.',
          'java starts/configures execution of a class; the JVM loads, links, initializes, and executes its bytecode.',
          'java is an alias for javac; the JVM only checks syntax.',
          'java executes native code; the JVM only manages JAVA_HOME.'
        ],
        explanation: 'The launcher is the process entry point. The JVM performs the loading, linking, initialization, and execution cycle.'
      },
      {
        text: 'Why is <code>javac</code> not part of the JVM?',
        options: [
          'Because javac is a JDK tool that transforms source into bytecode before the JVM executes it.',
          'Because javac only works with executable JARs.',
          'Because the JVM cannot execute a main method.',
          'Because javac is part of the Garbage Collector.'
        ],
        explanation: 'The JVM is the runtime that executes bytecode. The compiler is a separate JDK tool and produces that bytecode.'
      },
      {
        text: 'Why is a JRE no longer usually installed as an independent product?',
        options: [
          'Because Java no longer uses a JVM.',
          'Because modern JDKs include the required runtime and Oracle/OpenJDK do not usually distribute a modern standalone JRE.',
          'Because javac replaced the JRE at runtime.',
          'Because bytecode can only run in a browser.'
        ],
        explanation: 'JRE remains useful as a runtime concept, but current Java installation guidance usually points developers to a complete JDK.'
      },
      {
        text: 'What does the Class Loader do, and how do linking and initialization differ?',
        options: [
          'The Class Loader compiles .java; linking runs main and initialization generates bytecode.',
          'The Class Loader loads binary classes; linking verifies/prepares and may resolve references; initialization runs initializers and static blocks.',
          'The Class Loader frees the heap; linking and initialization are two types of Garbage Collection.',
          'The Class Loader only reads JAVA_HOME; linking packages JARs and initialization runs javac.'
        ],
        explanation: 'Loading is not compiling. Linking prepares a class for use; initialization runs its static code when the time comes.'
      },
      {
        text: 'What does PC Register mean and what does it store?',
        options: [
          'Program Calculation Register: it stores a thread\'s arithmetic results.',
          'Program Counter Register: it identifies the next bytecode instruction for the thread; it does not perform calculations.',
          'Permanent Class Register: it stores every class in the heap.',
          'Process Compiler Register: it stores source code before javac.'
        ],
        explanation: 'PC means Program Counter. It is a per-thread execution-position area, not a unit that performs calculations.'
      }
    ]
  }
});
