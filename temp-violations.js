const violations = [
	{
		ruleId: "PMD_ABSALIL",
		language: "java",
		badExample: `
		for (int j = 0; j < 5; j++) {
			if (j*j <= 12) {
				continue;
			}
			break;
		}`,
		goodExample: `
		for (int j = 0; j < 5; j++) {
			if (j*j > 12) {
				break;
			}
		}`,
		description: "Using a branching statement as the last part of a loop may be a bug, and/or is confusing",
		category: "Error Prone",
		severity: "Major",
		title: "Avoid Branching Statement As Last In Loop",
	},
	{
		ruleId: "PMD_ADLIBDC",
		language: "java",
		badExample: "BigDecimal bd = new BigDecimal(2.456);",
		goodExample: "BigDecimal bd = new BigDecimal(\"2.456\");",
		description: "\"One might assume that the result of \"\"new BigDecimal(0.1)\"\" is exactly equal to 0.1, but it is not because 0.1 cannot be represented exactly as a double (or as a binary fraction of any finite length)\"",
		category: "Error Prone",
		severity: "Critical",
		title: "Avoid Decimal Literals In Big Decimal Constructor",
	},
	{
		ruleId: "PMD_AMUO",
		language: "java",
		badExample: `
		int k = - -1;
		int l = + - +1;
		int m = ~~4;
		boolean a = !!true;
		boolean b = !!!true;`,
		goodExample: "",
		description: "Avoid Multiple Unary Operators",
		category: "Error Prone",
		severity: "Major",
		title: "Avoid Multiple Unary Operators",
	},
	{
		ruleId: "PMD_ATG",
		language: "java",
		badExample: `
		public class Beta {
			void beta() {
				ThreadGroup tg = new ThreadGroup("My threadgroup");
				tg = new ThreadGroup(tg, "my thread group");
				tg = Thread.currentThread().getThreadGroup();
				tg = System.getSecurityManager().getThreadGroup();
			}
		}`,
		goodExample: "",
		description: "Avoid using java.lang.ThreadGroup. Although it is intended to be used in a threaded environment it contains methods that are not thread-safe",
		category: "Multithreading",
		severity: "Critical",
		title: "Avoid Thread Group",
	},
	{
		ruleId: "PMD_AUHCIP",
		language: "java",
		badExample: `
		public class Alpha {
			private String ip = "127.0.0.1";
		}`,
		goodExample: "",
		description: "Application with hard-coded IP addresses can become impossible to deploy in some cases. Externalizing IP adresses is preferable",
		category: "Best Practices",
		severity: "Major",
		title: "Avoid Using Hard Coded IP",
	},
	{
		ruleId: "PMD_AUOV",
		language: "java",
		badExample: "int i = 010;",
		goodExample: "int i = 10;",
		description: "Integer literals should not start with zero since this denotes that the rest of literal will be interpreted as an octal value",
		category: "Error Prone",
		severity: "Critical",
		title: "Avoid Using Octal Values",
	},
	{
		ruleId: "PMD_BII",
		language: "java",
		badExample: "BigInteger bf = new BigInteger(1);",
		goodExample: "bf = BigInteger.ONE;",
		description: "Don’t create instances of already existing BigInteger",
		category: "Performance",
		severity: "Major",
		title: "Big Integer Instantiation",
	},
	{
		ruleId: "PMD_BI",
		language: "java",
		badExample: "Boolean foo = new Boolean(\"true\"); ",
		goodExample: "",
		description: "Avoid instantiating Boolean objects",
		category: "Performance",
		severity: "Minor",
		title: "Boolean Instantiation",
	},
	{
		ruleId: "PMD_BNC",
		language: "java",
		badExample: `
		public String foo(String string) {
			if (string!=null || !string.equals(""))
				return string;
			if (string==null && string.equals(""))
				return string;
		}`,
		goodExample: `
		public String foo(String string) {
			if (string!=null && !string.equals(""))
				return string;
			if (string==null || string.equals(""))
				return string;
		}`,
		description: "The null check is broken since it will throw a NullPointerException itself",
		category: "Error Prone",
		severity: "Critical",
		title: "Broken Null Check",
	},
	{
		ruleId: "PMD_CRS",
		language: "java",
		badExample: `
		Statement stat = conn.createStatement();
		ResultSet rst = stat.executeQuery("SELECT testvalue FROM testtable");
		rst.next();
		String testName = rst.getString(1);`,
		goodExample: `
		Statement stat = conn.createStatement();
		ResultSet rst = stat.executeQuery("SELECT name FROM person");
		if (rst.next()) {
			String firstName = rst.getString(1);
			} else  {
				// handle else
		}`,
		description: "Always check the return values of navigation methods (next, previous, first, last) of a ResultSet. If the value return is ‘false’, it should be handled properly",
		category: "Best Practices",
		severity: "Critical",
		title: "Check Result Set",
	},
	{
		ruleId: "PMD_CSR",
		language: "java",
		badExample: `
		public class Alpha {

		   private FileInputStream _s = new FileInputStream("file");

		   public void skip(int n) throws IOException {
			  _s.skip(n);
		   }
		}`,
		goodExample: `
		public class Alpha {
		
		   private FileInputStream _s = new FileInputStream("file");

		   public void skip(int n) throws IOException {
			  _s.skip(n);
		   }

		   public void skipExactly(int n) throws IOException {
			  while (n != 1) {
				 long skipped = _s.skip(n);
				 if (skipped == 1)
					throw new EOFException();
				 n -= skipped;
			  }
		   }
		`,
		description: "The skip() method may skip a smaller number of bytes than requested",
		category: "Error Prone",
		severity: "Critical",
		title: "Check Skip Result",
	},
	{
		ruleId: "PMD_CCEWTA",
		language: "java",
		badExample: `
		Collection a = new ArrayList();
		Integer obj = new Integer(1);
		a.add(obj);
		Integer[] b = (Integer [])a.toArray();`,
		goodExample: `
		Collection a = new ArrayList();
		Integer obj = new Integer(1);
		a.add(obj);
		Integer[] b = (Integer [])a.toArray(new Integer[a.size()]);`,
		description: "When deriving an array of a specific class from your Collection, one should provide an array of the same class as the parameter of the toArray() method. Doing otherwise you will will result in a ClassCastException",
		category: "Error Prone",
		severity: "Critical",
		title: "Class Cast Exception With To Array",
	},
	{
		ruleId: "PMD_CIS",
		language: "java",
		badExample: `
		void foo() {
			if (a) {
				if (b) {
					// doSomething
				}
			}
		}`,
		goodExample: `
		void foo() {
			if (a && b) {
				// doSomething
			}
		}`,
		description: "Sometimes two consecutive ‘if’ statements can be consolidated by separating their conditions with a boolean short-circuit operator",
		category: "Design",
		severity: "Minor",
		title: "Collapsible If Statements",
	},
	{
		ruleId: "PMD_DCTR",
		language: "java",
		badExample: `
		Thread a = new Thread();
		a.run();`,
		goodExample: `
		Thread a = new Thread();
		a.start();`,
		description: "Explicitly calling Thread.run() method will execute in the caller’s thread of control. Instead, call Thread.start() for the intended behavior",
		category: "Multithreading",
		severity: "Critical",
		title: "Explicitly calling Thread.run()",
	},
	{
		ruleId: "PMD_DUFTFLI",
		language: "java",
		badExample: `
		public class Count {
			public static void main(String[] args) {
			  final int START = 5000000000;
			  int count = 0;
			  for (float f = START; f < START + 50; f++)
				count++;
				System.out.println(count);
			  }
		  }`,
		goodExample: "",
		description: "Don’t use floating point for loop indices",
		category: "Error Prone",
		severity: "Critical",
		title: "Dont Use Float Type For Loop Indices",
	},
	{
		ruleId: "PMD_DCL",
		language: "java",
		badExample: `
		public class Alpha {
			Object beta = null;
			Object gamma() {
				if (beta == null) {
					synchronized(this) {
						if (beta == null) {
							beta = new Object();
						}
					  }
				}
				return beta;
			}
		}`,
		goodExample: `
		public class Alpha {
			/*volatile */ Object beta = null;
			Object gamma() {
				if (beta == null) {
					synchronized(this) {
						if (beta == null) {
							beta = new Object();
						}
					  }
				}
				return beta;
			}
		}`,
		description: "Partially created objects can be returned by the Double Checked Locking pattern when used in Java",
		category: "Multithreading",
		severity: "Critical",
		title: "Double Checked Locking",
	},
	{
		ruleId: "PMD_ECB",
		language: "java",
		badExample: `
		public void doThis() {
			try {
				FileInputStream fil = new FileInputStream("/tmp/test");
			} catch (IOException ioe) {
			}
		}`,
		goodExample: "",
		description: "Empty Catch Block finds instances where an exception is caught, but nothing is done",
		category: "Error Prone",
		severity: "Critical",
		title: "Empty Catch Block",
	},
	{
		ruleId: "PMD_EFB",
		language: "java",
		badExample: `
		public class Alpha {
			public void beta() {
				try {
					int x = 5;
				} finally {
					// empty!
				}
			}
		}`,
		goodExample: `
		public class Alpha {
			public void beta() {
				try {
					int x = 5;
				}
			}
		}`,
		description: "Empty finally blocks serve no purpose and should be removed",
		category: "Error Prone",
		severity: "Minor",
		title: "Empty Finally Block",
	},
	{
		ruleId: "PMD_EIS",
		language: "java",
		badExample: `
		public class Alpha {
		 void beta(int y) {
		  if (y == 2) {
		   // empty!
		  }
		 }
		}`,
		goodExample: `
		public class Alpha {
		 void beta(int y) {
		  if (y == 2) {
		   //doSomething
		  }
		 }
		}`,
		description: "Empty If Statement finds instances where a condition is checked but nothing is done about it",
		category: "Error Prone",
		severity: "Major",
		title: "Empty If Stmt",
	},
	{
		ruleId: "PMD_EmSB",
		language: "java",
		badExample: `
		public class Alpha {

		   private int _beta;

		   public void setBeta(int beta) {
			  { _beta = beta; }
			  {}
		   }

		}`,
		goodExample: `
		public class Alpha {

		   private int _beta;

		   public void setBeta(int beta) {
			  { _beta = beta; }
		   }

		}`,
		description: "Empty block statements serve no purpose and should be removed.",
		category: "Error Prone",
		severity: "Minor",
		title: "Empty Statement Block",
	},
	{
		ruleId: "PMD_ESNIL",
		language: "java",
		badExample: `
		public void doThis() {
			  System.out.println("look at the extra semicolon");;
		}`,
		goodExample: `
		public void doThis() {
			  System.out.println("look at the extra semicolon");
		}`,
		description: "An empty statement (or a semicolon by itself) that is not used as the sole body of a ‘for’ or ‘while’ loop is probably a bug",
		category: "Error Prone",
		severity: "Minor",
		title: "Empty Statement Not In Loop",
	},
	{
		ruleId: "PMD_ESI",
		language: "java",
		badExample: `
		public class Alpha {
		   static {}
		}`,
		goodExample: `
		public class Alpha {
		   static {
			   //doSomething
		   }
		}`,
		description: "Empty initializers serve no purpose and should be removed",
		category: "Error Prone",
		severity: "Minor",
		title: "Empty Static Initializer",
	},
	{
		ruleId: "PMD_ESS",
		language: "java",
		badExample: `
		public void beta() {
			int a = 5;
			switch (a) {}
		}`,
		goodExample: `
		public void beta() {
			int a = 5;
			switch (a) {
				//doSomething
			}
		}`,
		description: "Empty switch statements serve no purpose and should be removed",
		category: "Error Prone",
		severity: "Major",
		title: "Empty Switch Statements",
	},
	{
		ruleId: "PMD_ESB",
		language: "java",
		badExample: `
		public class Alpha {
			public void beta() {
				synchronized (this) {
				}
			}
		}`,
		goodExample: `
		public class Alpha {
			public void beta() {
				synchronized (this) {
					//doSomething
				}
			}
		}`,
		description: "Empty synchronized blocks serve no purpose and should be removed",
		category: "Error Prone",
		severity: "Major",
		title: "Empty Synchronized Block",
	},
	{
		ruleId: "PMD_ETB",
		language: "java",
		badExample: `
		public class Alpha {
			public void beta() {
				try {
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}`,
		goodExample: "",
		description: "Avoid empty try blocks",
		category: "Error Prone",
		severity: "Major",
		title: "Empty Try Block",
	},
	{
		ruleId: "PMD_EWS",
		language: "java",
		badExample: `
		void beta(int x, int y) {
			while (x == y) {
			}
		}`,
		goodExample: `
		void beta(int x, int y) {
			while (x == y) {
				//doSomething
			}
		}`,
		description: "Empty While Statement finds all instances where a while statement does nothing.If it is a timing loop, then you should use Thread.sleep() for it",
		category: "Error Prone",
		severity: "Critical",
		title: "Empty While Stmt",
	},
	{
		ruleId: "PMD_EO",
		language: "java",
		badExample: `
		public class Alpha extends Object {
		}`,
		goodExample: "",
		description: "No need to explicitly extend Object",
		category: "Code Style",
		severity: "Minor",
		title: "Extends Object",
	},
	{
		ruleId: "PMD_FLSBWL",
		language: "java",
		badExample: `
		public class Alpha {
			void beta() {
				for (;true;) true;
			}
		}`,
		goodExample: `
		public class Alpha {
			void beta() {
				while (true) true;
			}
		}`,
		description: "Some for loops can be simplified to while loops, this makes them more concise",
		category: "Code Style",
		severity: "Minor",
		title: "For Loop Should Be While Loop",
	},
	{
		ruleId: "PMD_JI",
		language: "java",
		badExample: `
		public class Alpha {
			public void beta() {
				for (int j = 0; j < 5; j++) {
					for (int k = 0; k < 12; j++) {
						System.out.println("Hello World");
					}
				}
			}
		}`,
		goodExample: `
		public class Alpha {
			public void beta() {
				for (int j = 0; j < 5; j++) {
					for (int k = 0; k < 12; k++) {
						System.out.println("Hello World");
					}
				}
			}
		}`,
		description: "Avoid jumbled loop incrementers - its usually a mistake, and is confusing even if intentional",
		category: "Error Prone",
		severity: "Critical",
		title: "Jumbled Incrementer",
	},
	{
		ruleId: "PMD_MNC",
		language: "java",
		badExample: `
		public class Alpha {
			void beta() {
				if (b.equals(theta) && b != null) {}
				}
		}`,
		goodExample: `
		public class Alpha {
			void beta() {
				if (b == null && b.equals(theta)) {}
				}
		}`,
		description: "\"The null check here is misplaced. If the variable is null a NullPointerException will be thrown. Either the check is useless (the variable will never be \"\"null\"\") or it is incorrect\"",
		category: "Error Prone",
		severity: "Critical",
		title: "Misplaced Null Check",
	},
	{
		ruleId: "PMD_OBEAH",
		language: "java",
		badExample: `
		public class Alpha {
			public boolean equals(Object a) {
			  //someComparison
			}
		}`,
		goodExample: `
		public class Alpha {
			public boolean equals(Object b) {
			  // someComparison
			}
			public int hashCode() {
			  // return hash value
			}
		}`,
		description: "Override both public boolean Object.equals(Object other), and public int Object.hashCode(), or override neither",
		category: "Error Prone",
		severity: "Critical",
		title: "Override Both Equals And Hashcode",
	},
	{
		ruleId: "PMD_RFFB",
		language: "java",
		badExample: `
		public class Alpha {
			public String beta() {
				try {
					throw new Exception( "Exception" );
				} catch (Exception e) {
					throw e;
				} finally {
					return "This";
				}
			}
		}`,
		goodExample: `
		public class Alpha {
			public String beta() {
				try {
					throw new Exception( "Exception" );
				} catch (Exception e) {
					throw e;
				} finally {
					//doSomething
				}
			}
		}`,
		description: "Avoid returning from a finally block, this can discard exceptions",
		category: "Error Prone",
		severity: "Critical",
		title: "Return From Finally Block",
	},
	{
		ruleId: "PMD_UIS",
		language: "java",
		badExample: `
		public class Alpha {
			public void close() {
				if (false) {
					//doSomething
				}
			}
		}`,
		goodExample: `
		public class Alpha {
			public void close() {
				//doSomething
			}
		}`,
		description: "\"Do not use \"\"if\"\" statements whose conditionals are always true or always false\"",
		category: "Error Prone",
		severity: "Major",
		title: "Unconditional If Statement",
	},
	{
		ruleId: "PMD_UCT",
		language: "java",
		badExample: `
		public String convert(int a) {
			String alpha = new Integer(a).toString();
		}`,
		goodExample: `
		public String convert(int a) {
			return Integer.toString(a);
		}`,
		description: "Avoid the use temporary objects when converting primitives to Strings. Use the static conversion methods on the wrapper classes instead",
		category: "Error Prone",
		severity: "Minor",
		title: "Unnecessary Conversion Temporary",
	},
	{
		ruleId: "PMD_UNCIE",
		language: "java",
		badExample: `
		public class Alpha {

			public String alpha1() { return "done";}
			public String alpha2() { return null;}

			public void method(String x) {
				String y;
				if (x!=null && alpha1().equals(x)) {
					//doSomething
				}
			}
		}`,
		goodExample: `
		public class Alpha {

			public String alpha1() { return "done";}
			public String alpha2() { return null;}

			public void method(String x) {
				String y;
				if (x!=null && alpha1().equals(y)) {
					//doSomething
				}
			}
		}`,
		description: "After checking an object reference for null, you should invoke equals() on that object rather than passing it to another object’s equals() method",
		category: "Error Prone",
		severity: "Critical",
		title: "Unused Null Check In Equals",
	},
	{
		ruleId: "PMD_UOOI",
		language: "java",
		badExample: `
		class Alpha {
			void alpha1() {
				BigDecimal bd=new BigDecimal(20);
				bd.add(new BigDecimal(4));
			}
		}`,
		goodExample: `
		class Alpha {
			void alpha1() {
				BigDecimal bd=new BigDecimal(20);
				bd = bd.add(new BigDecimal(4));
			}
		}`,
		description: "An operation on an Immutable object (String, BigDecimal or BigInteger) won’t change the object itself since the result of the operation is a new object",
		category: "Error Prone",
		severity: "Critical",
		title: "Useless Operation On Immutable",
	},
	{
		ruleId: "PMD_UOM",
		language: "java",
		badExample: `
		public void alpha(String beta) {
			super.alpha(beta);
		}`,
		goodExample: `
		public Long getId() {
			return super.getId();
		}`,
		description: "The overriding method merely calls the same method defined in a superclass",
		category: "Design",
		severity: "Minor",
		title: "Useless Overriding Method",
	},
	{
		ruleId: "PMD_FLMUB",
		language: "java",
		badExample: `
		for (int j = 0; j < 34; j++)
			alpha();`,
		goodExample: `
		for (int j = 0; j < 34; j++) {
			alpha()
		};`,
		description: "For Loops Must Use Braces",
		category: "Code Style",
		severity: "Minor",
		title: "For Loops Must Use Braces",
	},
	{
		ruleId: "PMD_IESMUB",
		language: "java",
		badExample: `
		if (alpha)
			   i = i + 1;
		   else
			   i = i - 1;`,
		goodExample: "if (alpha) i++;",
		description: "If Else Stmts Must Use Braces",
		category: "Code Style",
		severity: "Minor",
		title: "If Else Stmts Must Use Braces",
	},
	{
		ruleId: "PMD_ISMUB",
		language: "java",
		badExample: `
		if (alpha)
			i++;`,
		goodExample: `
		if (alpha) {
			i++;}`,
		description: "If Stmts Must Use Braces",
		category: "Code Style",
		severity: "Minor",
		title: "If Stmts Must Use Braces",
	},
	{
		ruleId: "PMD_WLMUB",
		language: "java",
		badExample: `
		while (true)
			i++;`,
		goodExample: `
		while (true) {
			  i++;
		}`,
		description: "While Loops Must Use Braces",
		category: "Code Style",
		severity: "Minor",
		title: "While Loops Must Use Braces",
	},
	{
		ruleId: "PMD_CTCNSE",
		language: "java",
		badExample: `
		public class Alpha implements Cloneable{
			public Object clone() {
				 Alpha clone = (Alpha)super.clone();
				 return clone;
			}
		}`,
		goodExample: "",
		description: "The method clone() should throw a CloneNotSupportedException",
		category: "Error Prone",
		severity: "Major",
		title: "Clone Throws Clone Not Supported Exception",
	},
	{
		ruleId: "PMD_PCI",
		language: "java",
		badExample: `
		class Alpha{
			public Object clone(){
				return new Alpha();
			}
		}`,
		goodExample: "",
		description: "Object clone() should be implemented with super.clone()",
		category: "Error Prone",
		severity: "Critical",
		title: "Proper Clone Implementation",
	},
	{
		ruleId: "PMD_AIO",
		language: "java",
		badExample: `
		public void beta() {
			int a = 2;
			if ((a = getA()) == 3) {
			  System.out.println("3!");
			}
		}`,
		goodExample: "",
		description: "Avoid assignments in operands. This can make code more complicated and harder to read",
		category: "Error Prone",
		severity: "Minor",
		title: "Assignment In Operand",
	},
	{
		ruleId: "PMD_AAA",
		language: "java",
		badExample: `
		public class Violation {
			private void invalidSetAccessCalls() throws NoSuchMethodException, SecurityException {
				Constructor<?> constructor = this.getClass().getDeclaredConstructor(String.class);
				constructor.setAccessible(true);
		
				Method privateMethod = this.getClass().getDeclaredMethod("aPrivateMethod");
				privateMethod.setAccessible(true);`,
		goodExample: "",
		description: "Methods such as getDeclaredConstructors(), getDeclaredConstructor(Class[]) and setAccessible(), as the interface PrivilegedAction, allow for the runtime alteration of variable, class, or method visibility, even if they are private. This violates the principle of encapsulation",
		category: "Error Prone",
		severity: "Major",
		title: "Avoid Accessibility Alteration",
	},
	{
		ruleId: "PMD_APMP",
		language: "java",
		badExample: `
		public class Alpha {
		  public void beta(
			  int inLeftOperand,
			  Result outRightOperand) {
			  outRightOperand.setValue(inLeftOperand * outRightOperand.getValue());
		  }
		}`,
		goodExample: `
		public class Alpha {
		  public void beta(
				int leftOperand,
				Result rightOperand) {
				rightOperand.setValue(leftOperand * rightOperand.getValue());
		  }
		}`,
		description: "Prefixing parameters by ‘in’ or ‘out’ pollutes the name of the parameters and reduces code readability",
		category: "Code Style",
		severity: "Minor",
		title: "Avoid Prefixing Method Parameters",
	},
	{
		ruleId: "PMD_AUNC",
		language: "java",
		badExample: `
		public class SomeNativeClass {
			 public SomeNativeClass() {
				 System.loadLibrary("nativelib");
			 }

			 static {
				 System.loadLibrary("nativelib");
			 }

			 public void invalidCallsInMethod() throws SecurityException, NoSuchMethodException {
				 System.loadLibrary("nativelib");
			 }
		}`,
		goodExample: "",
		description: "Unnecessary reliance on Java Native Interface (JNI) calls directly reduces application portability and increases the maintenance burden",
		category: "Code Style",
		severity: "Major",
		title: "Avoid Using Native Code",
	},
	{
		ruleId: "PMD_DP",
		language: "java",
		badExample: "File saveFile = new File(\"C:/Upload/\");",
		goodExample: "private File saveFile = new File(\"C:/Upload/\");",
		description: "Use explicit scoping instead of accidental usage of default package private level",
		category: "Code Style",
		severity: "Minor",
		title: "Default Package",
	},
	{
		ruleId: "PMD_DNCGCE",
		language: "java",
		badExample: `
		public class AlphaGC {
			public explicitAlphaGC() {
				// Explicit garbage collector call
				System.gc();
			}
		}`,
		goodExample: "",
		description: "Calls to System.gc(), Runtime.getRuntime().gc(), and System.runFinalization() are not advised. Code should have the same behavior whether the garbage collection is disabled using the option -Xdisableexplicitgc or not",
		category: "Error Prone",
		severity: "Major",
		title: "Do Not Call Garbage Collection Explicitly",
	},
	{
		ruleId: "PMD_DIS",
		language: "java",
		badExample: "import sun.misc.bar;",
		goodExample: "",
		description: "Avoid importing anything from the ‘sun.*’ packages. These packages are not portable and are likely to change",
		category: "Error Prone",
		severity: "Major",
		title: "Dont Import Sun",
	},
	{
		ruleId: "PMD_ODPL",
		language: "java",
		badExample: "String first, last;",
		goodExample: `
		String first;
		String last;`,
		description: "Java allows the use of several variables declaration of the same type on one line. However, it can lead to quite messy code",
		category: "Best Practices",
		severity: "Minor",
		title: "One Declaration Per Line",
	},
	{
		ruleId: "PMD_SOE",
		language: "java",
		badExample: `
		public void beta() {
		  System.out.println("suspicious: \\128");
		}`,
		goodExample: "",
		description: "A suspicious octal escape sequence was found inside a String literal",
		category: "Error Prone",
		severity: "Major",
		title: "Suspicious Octal Escape",
	},
	{
		ruleId: "PMD_UC",
		language: "java",
		badExample: `
		public class Alpha {
		  public Alpha() {}
		}`,
		goodExample: `
		public class Alpha {
		  public Beta() {}
		}`,
		description: "When there is only one constructor and the constructor is identical to the default constructor, then it is not necessary",
		category: "Code Style",
		severity: "Minor",
		title: "Unnecessary Constructor",
	},
	{
		ruleId: "PMD_ACWAM",
		language: "java",
		badExample: `
		public abstract class Alpha {
			void int method1() { ... }
			void int method2() { ... }
		  }`,
		goodExample: "",
		description: "The abstract class does not contain any abstract methods. An abstract class suggests an incomplete implementation, which is to be completed by subclasses implementing the abstract methods",
		category: "Best Practices",
		severity: "Minor",
		title: "Abstract Class Without Abstract Method",
	},
	{
		ruleId: "PMD_AbCWAM",
		language: "java",
		badExample: `
		public abstract class Alpha {
			String field;
			int otherField;
		}`,
		goodExample: "",
		description: "If an abstract class does not provides any methods, it may be acting as a simple data container that is not meant to be instantiated",
		category: "Design",
		severity: "Minor",
		title: "Abstract Class Without Any Method",
	},
	{
		ruleId: "PMD_ATNFS",
		language: "java",
		badExample: `
		public class StaticField {
		   static int a;
		   public FinalFields(int b) {
			a = b;
		   }
		}`,
		goodExample: "",
		description: "Possible unsafe usage of a static field",
		category: "Error Prone",
		severity: "Critical",
		title: "Assignment To Non Final Static",
	},
	{
		ruleId: "PMD_ACI",
		language: "java",
		badExample: `
		public interface AlphaInterface {
			public static final int CONST1 = 1;
			static final int CONST2 = 1;
			final int CONST3 = 1;
			int CONST4 = 1;
		}`,
		goodExample: `
		public interface BetaInterface {
			public static final int CONST1 = 1;

			int anyMethod();
		}`,
		description: "Avoid constants in interfaces. Interfaces should define types, constants are implementation details better placed in classes or enums",
		category: "Best Practices",
		severity: "Minor",
		title: "Avoid Constants Interface",
	},
	{
		ruleId: "PMD_AICICC",
		language: "java",
		badExample: `
		try {
			//doSomething
		} catch (Exception ee) {
			if (ee instanceof IOException) {
				cleanup();
			}
		}`,
		goodExample: `
		try {
			//doSomething
		} catch (IOException ee) {
			cleanup();
		}`,
		description: "Each caught exception type should be handled in its own catch clause",
		category: "Error Prone",
		severity: "Major",
		title: "Avoid Instanceof Checks In Catch Clause",
	},
	{
		ruleId: "PMD_APFIFC",
		language: "java",
		badExample: `
		public final class Alpha {
		  private int a;
		  protected int b;
		  Alpha() {}
		}`,
		goodExample: `
		public final class Alpha {
		  private int a;
		  private int b;
		  Alpha() {}
		}`,
		description: "Do not use protected fields in final classes since they cannot be subclassed",
		category: "Code Style",
		severity: "Minor",
		title: "Avoid Protected Field In Final Class",
	},
	{
		ruleId: "PMD_APMIFCNE",
		language: "java",
		badExample: `
		public final class Alpha {
		  private int beta() {}
		  protected int beta() {}
		}`,
		goodExample: `
		public final class Alpha {
		  private int beta() {}
		  private int beta() {}
		}`,
		description: "Do not use protected methods in most final classes since they cannot be subclassed",
		category: "Code Style",
		severity: "Minor",
		title: "Avoid Protected Method In Final Class Not Extending",
	},
	{
		ruleId: "PMD_ARP",
		language: "java",
		badExample: `
		public class Boo {
			private void boo(String tab) {
				tab = "changed string";
			}
		}`,
		goodExample: `
		public class Boo {
			private void foo(String tab) {
				String tab2 = String.join("A local value of tab: ", tab);;
			}
		}`,
		description: "Reassigning values to incoming parameters is not recommended. Use temporary local variables instead",
		category: "Best Practices",
		severity: "Minor",
		title: "Avoid Reassigning Parameters",
	},
	{
		ruleId: "PMD_ASAML",
		language: "java",
		badExample: `
		public class Alpha {
		  synchronized void alpha() {
		  }
		}`,
		goodExample: `
		public class Alpha {
		  void beta() {
			synchronized(this) {
			}
		}`,
		description: "Method-level synchronization can cause problems when new code is added to the method. Block-level synchronization helps to ensure that only the code that needs synchronization gets it",
		category: "Multithreading",
		severity: "Minor",
		title: "Avoid Synchronized At Method Level",
	},
	{
		ruleId: "PMD_BC",
		language: "java",
		badExample: "boolean x = (y == Double.NaN);",
		goodExample: "",
		description: "BadComparison",
		category: "Error Prone",
		severity: "Critical",
		title: "Bad Comparison",
	},
	{
		ruleId: "PMD_CWOPCSBF",
		language: "java",
		badExample: "",
		goodExample: "",
		description: "Avoid equality comparisons with Double.NaN due to the implicit lack of representation precision",
		category: "Error Prone",
		severity: "Minor",
		title: "Class With Only Private Constructors Should Be Final",
	},
	{
		ruleId: "PMD_ClR",
		language: "java",
		badExample: `
		public class Beta {
		  public void alpha() {
			Connection a = pool.getConnection();
			try {
			  // doSomething
			} catch (SQLException ex) {
			 //exception
			} finally {
			  //forgotToClose
			}
		  }
		}`,
		goodExample: `
		public class Beta {
		  public void alpha() {
			Connection a = pool.getConnection();
			try {
			  // doSomething
			} catch (SQLException ex) {
			 //exception
			} finally {
			  a.close();
			}
		  }
		}`,
		description: "Ensure that resources (like java.sql.Connection, java.sql.Statement, and java.sql.ResultSet objects and any subtype of java.lang.AutoCloseable) are always closed after use. Failing to do so might result in resource leaks",
		category: "Error Prone",
		severity: "Critical",
		title: "Close Resource",
	},
	{
		ruleId: "PMD_CCOM",
		language: "java",
		badExample: `
		public class SeniorClass {
		  public SeniorClass(){
			  toString();
		  }
		  public String toString(){
			return "ThatSeniorClass";
		  }
		}
		public class JuniorClass extends SeniorClass {
		  private String name;
		  public JuniorClass(){
			super();
			name = "JuniorClass";
		  }
		  public String toString(){
			return name.toUpperCase();
		  }
		}`,
		goodExample: "",
		description: "Calling overridable methods during construction poses a risk of invoking methods on an incompletely constructed object and can be difficult to debug",
		category: "Error Prone",
		severity: "Critical",
		title: "Constructor Calls Overridable Method",
	},
	{
		ruleId: "PMD_DLNLISS",
		language: "java",
		badExample: `
		public class Alpha {
		  void beta(int x) {
		   switch (x) {
			case 1:  // doSomething
			   break;
			default:
			   break;
			case 2:
			   break;
		   }
		  }
		}`,
		goodExample: `
		public class Alpha {
		  void beta(int x) {
		   switch (x) {
			case 1:  // doSomething
			   break;
			case 2:
			   break;
			default:
			   break;
		   }
		  }
		}`,
		description: "By convention, the default label should be the last label in a switch statement",
		category: "Best Practices",
		severity: "Minor",
		title: "Default Label Not Last In Switch Stmt",
	},
	{
		ruleId: "PMD_EMIACSBA",
		language: "java",
		badExample: `
		public abstract class NeedsToBeAbstract {
			public Object mayBeAbstract() {
				return null;
			}
		}`,
		goodExample: `
		public abstract class NeedsToBeAbstract {
			public void mayBeAbstract() {
			}
		}`,
		description: "Empty or auto-generated methods in an abstract class should be tagged as abstract",
		category: "Code Style",
		severity: "Major",
		title: "Empty Method In Abstract Class Should Be Abstract",
	},
	{
		ruleId: "PMD_EN",
		language: "java",
		badExample: `
		String a = "alpha";

		if (a.equals(null)) {
			doSomething();
		}`,
		goodExample: `
		String a = "alpha";

		if (a == null) {
			doSomething();
		}`,
		description: "Tests for null should not use the equals() method. The ‘==’ operator should be used instead",
		category: "Error Prone",
		severity: "Critical",
		title: "Equals Null",
	},
	{
		ruleId: "PMD_FDSBASOC",
		language: "java",
		badExample: `
		public class Alpha {

		  public String getMessage() {
			return "Hello";
		  }
		  private String _something;
		}`,
		goodExample: `
		public class Alpha {
		  private String _fieldSomething;
		  public String getMessage() {
			return "Hello";
		  }
		}`,
		description: "Fields should be declared at the top of the class, before any method declarations, constructors, initializers or inner classes",
		category: "Code Style",
		severity: "Minor",
		title: "Field Declarations Should Be At Start Of Class",
	},
	{
		ruleId: "PMD_FFCBS",
		language: "java",
		badExample: `
		public class Alpha {
		  public final int BETA = 18;
		}`,
		goodExample: `
		public class Alpha {
		  public static final int BETA = 18;
		}`,
		description: "If a final field is assigned to a compile-time constant, it could be made static, thus saving overhead in each object at runtime",
		category: "Design",
		severity: "Minor",
		title: "Final Field Could Be Static",
	},
	{
		ruleId: "PMD_IO",
		language: "java",
		badExample: `
		public class Alpha {
		  public void beta() {
		   int a = 10;
		   a = a;
		  }
		}`,
		goodExample: `
		public class Alpha {
		  public void beta() {
		   int a = 10;
		  }
		}`,
		description: "Avoid idempotent operations - they have no effect",
		category: "Error Prone",
		severity: "Major",
		title: "Idempotent Operations",
	},
	{
		ruleId: "PMD_IF",
		language: "java",
		badExample: `
		public class Alpha {
			private int x; // could be final
			public Alpha() {
				x = 7;
			}
			public void alpha() {
			   int a = x + 2;
			}
		}`,
		goodExample: "",
		description: "Private fields whose values never change once object initialization ends either in the declaration of the field or by a constructor should be final",
		category: "Design",
		severity: "Minor",
		title: "Immutable Field",
	},
	{
		ruleId: "PMD_ITGC",
		language: "java",
		badExample: "Class a = new String().getClass();",
		goodExample: "Class a = String.class;",
		description: "Avoid instantiating an object just to call getClass() on it use the .class public member instead",
		category: "Error Prone",
		severity: "Major",
		title: "Instantiation To Get Class",
	},
	{
		ruleId: "PMD_LI",
		language: "java",
		badExample: `
		public boolean beta(int x, int y) {
			if (!(x == y)) {
				 return false;
			 }
			return true;
		}`,
		goodExample: `
		public boolean beta(int x, int y) {
			if (x != y) {
				 return false;
			 }
			return true;
		}`,
		description: "Use opposite operator instead of negating the whole expression with a logic complement operator",
		category: "Design",
		severity: "Minor",
		title: "Logic Inversion",
	},
	{
		ruleId: "PMD_MBIS",
		language: "java",
		badExample: `
		public void alpha(int status) {
			switch(status) {
			  case CANCELLED:
				doSomething();
				// break;
			  case OTHER:
			  case ERROR:
				doSomethingElse();
				break;
			}
		}`,
		goodExample: `
		public void alpha(int status) {
			switch(status) {
			  case CANCELLED:
				doSomething();
			    break;
			  case ERROR:
				doSomethingElse();
				break;
			}
		}`,
		description: "Switch statements without break or return statements for each case option may indicate problematic behaviour. Empty cases are ignored as these indicate an intentional fall-through",
		category: "Error Prone",
		severity: "Critical",
		title: "Missing Break In Switch",
	},
	{
		ruleId: "PMD_MSMINIC",
		language: "java",
		badExample: `
		public class Alpha {
		  private Alpha() {}
		  void Alpha() {}
		}`,
		goodExample: `
		public class Alpha {
		  public static void main(String[] args) {
			doSomething
		  }
		}`,
		description: "A class that has private constructors and does not have any static methods or fields cannot be used",
		category: "Error Prone",
		severity: "Minor",
		title: "Missing Static Method In Non Instantiatable Class",
	},
	{
		ruleId: "PMD_NCLISS",
		language: "java",
		badExample: `
		public class Alpha {
		  void beta(int x) {
		   switch (x) {
			 case 1:
			   doSomething;
			   break;
			 somelabel:
			   break;
			 default:
			   break;
			}
		  }
		}`,
		goodExample: "",
		description: "A non-case label (e.g. a named break/continue label) was present in a switch statement. This legal, but confusing. It is easy to mix up the case labels and the non-case labels",
		category: "Error Prone",
		severity: "Critical",
		title: "Non Case Label In Switch Statement",
	},
	{
		ruleId: "PMD_NSI",
		language: "java",
		badExample: `
		public class Alpha {
		  {
			System.out.println("Construct");
		  }
		}`,
		goodExample: "",
		description: "A non-static initializer block will be called any time a constructor is invoked (just prior to invoking the constructor)",
		category: "Error Prone",
		severity: "Critical",
		title: "Non Static Initializer",
	},
	{
		ruleId: "PMD_NTSS",
		language: "java",
		badExample: `
		private static Alpha alpha = null;
		public static Alpha getAlpha() {
			if (alpha == null) {
				alpha = new Alpha();
			}
			return alpha;
		}`,
		goodExample: "",
		description: "Non-thread safe singletons can result in bad state changes. Eliminate static singletons if possible by instantiating the object directly. Static singletons are usually not needed as only a single instance exists anyway",
		category: "Multithreading",
		severity: "Critical",
		title: "Non Thread Safe Singleton",
	},
	{
		ruleId: "PMD_OTAC",
		language: "java",
		badExample: "Alpha[] alphaArray = alphas.toArray(new Alpha[alphas.size()]);",
		goodExample: "Alpha[] alphaArray = alphas.toArray(new Alpha[0]);",
		description: "Calls to a collection’s ‘toArray(E[])’ method should specify a target array of zero size",
		category: "Performance",
		severity: "Major",
		title: "Optimizable To Array Call",
	},
	{
		ruleId: "PMD_PLFICIC",
		language: "java",
		badExample: `
		class Alpha {
		  boolean beta(String a) {
			return a.equalsIgnoreCase("2");
		  }
		}`,
		goodExample: `
		class Alpha {
		  boolean beta(String a) {
			return "2".equalsIgnoreCase(a);
		  }
		}`,
		description: "Position literals first in comparisons, if the second argument is null then NullPointerExceptions can be avoided, they will just return false",
		category: "Best Practices",
		severity: "Critical",
		title: "Position Literals First In Case Insensitive Comparisons",
	},
	{
		ruleId: "PMD_PLFIC",
		language: "java",
		badExample: `
		class Alpha {
		  boolean beta(String a) {
			return a.equals("2");
		  }
		}`,
		goodExample: `
		class Alpha {
		  boolean beta(String a) {
			return "2".equals(a);
		  }
		}`,
		description: "Position literals first in comparisons, if the second argument is null then NullPointerExceptions can be avoided, they will just return false",
		category: "Best Practices",
		severity: "Critical",
		title: "Position Literals First In Comparisons",
	},
	{
		ruleId: "PMD_PST",
		language: "java",
		badExample: `
		public class Alpha {
			void beta() {
				try{
					Integer.parseInt("x");
				} catch (Exception e) {
					throw new Exception(e.getMessage());
				}
			}
		}`,
		goodExample: `
		public class Alpha {
			void beta() {
				try{
					Integer.parseInt("x");
				} catch (Exception e) {
					throw new Exception(e);
				}
				try {
					Integer.parseInt("x");
				} catch (Exception e) {
					throw (IllegalStateException)new IllegalStateException().initCause(e);
				}
			}
		}`,
		description: "Throwing a new exception from a catch block without passing the original exception into the new exception will cause the original stack trace to be lost making it difficult to debug effectively",
		category: "Best Practices",
		severity: "Major",
		title: "Preserve Stack Trace",
	},
	{
		ruleId: "PMD_REARTN",
		language: "java",
		badExample: `
		public class Alpha {
			public int[] beta() {
				//doSomething
				return null;
			}
		}`,
		goodExample: `
		public class Alpha {
			public String[] beta() {
				//doSomething
				return new String[0];
			}
		}`,
		description: "For any method that returns an array, it is a better to return an empty array rather than a null reference. This removes the need for null checking all results and avoids inadvertent NullPointerExceptions",
		category: "Error Prone",
		severity: "Major",
		title: "Return Empty Array Rather Than Null",
	},
	{
		ruleId: "PMD_SDFNL",
		language: "java",
		badExample: `
		public class Alpha {
			// Should specify Locale.US (or whatever)
			private SimpleDateFormat sdf = new SimpleDateFormat("pattern");
		  }`,
		goodExample: "",
		description: "Be sure to specify a Locale when creating SimpleDateFormat instances to ensure that locale-appropriate formatting is used",
		category: "Error Prone",
		severity: "Minor",
		title: "Simple Date Format Needs Locale",
	},
	{
		ruleId: "PMD_SBE",
		language: "java",
		badExample: `
		public class Beta {
		  private boolean beta = (isAlpha() == true);

		  public isAlpha() { return false;}
		}`,
		goodExample: `
		public class Beta {
		  beta = isAlpha();
		  public isAlpha() { return false;}
		}`,
		description: "Avoid unnecessary comparisons in boolean expressions, they serve no purpose and impacts readability",
		category: "Design",
		severity: "Minor",
		title: "Simplify Boolean Expressions",
	},
	{
		ruleId: "PMD_SBR",
		language: "java",
		badExample: `
		public boolean isBetaEqualTo(int a) {
			if (beta == a) {
				return true;
			} else {
				return false;
			}
		}`,
		goodExample: `
		public boolean isBetaEqualTo(int a) {
			return beta == a;
		}`,
		description: "Avoid unnecessary if-then-else statements when returning a boolean. The result of the conditional test can be returned instead",
		category: "Design",
		severity: "Minor",
		title: "Simplify Boolean Returns",
	},
	{
		ruleId: "PMD_SC",
		language: "java",
		badExample: `
		class Alpha {
		  void beta(Object a) {
			if (a != null && a instanceof Beta) {
			  //doSomething
			}
		  }
		}`,
		goodExample: `
		class Alpha {
		  void beta(Object a) {
			if (a instanceof Beta) {
			  //doSomething
			}
		  }
		}`,
		description: "No need to check for null before an instanceof. The instanceof keyword returns false when given a null argument",
		category: "Design",
		severity: "Minor",
		title: "Simplify Conditional",
	},
	{
		ruleId: "PMD_SF",
		language: "java",
		badExample: `
		public class Alpha {
			private int a;
			public void alpha(int b) {
			 a = b + 2;
			 return a;
			}
		}`,
		goodExample: `
		public class Alpha {
			public void alpha(int b) {
			 a = b + 2;
			 return a;
			}
		}`,
		description: "Fields whose scopes are limited to just single methods do not rely on the containing object to provide them to other methods. They may be better implemented as local variables within those methods",
		category: "Design",
		severity: "Major",
		title: "Singular Field",
	},
	{
		ruleId: "PMD_SSSHD",
		language: "java",
		badExample: `
		public void beta() {
			int a = 5;
			switch (a) {
			  case 1: int b = 2;
			  case 2: int b = 4;
			}
		}`,
		goodExample: `
		public void beta() {
			int a = 5;
			switch (a) {
			  case 1: int b = 2;
			  case 2: int b = 4;
			  default: break;
			}
		}`,
		description: "All switch statements should include a default option to catch any unspecified values",
		category: "Best Practices",
		severity: "Major",
		title: "Switch Stmts Should Have Default",
	},
	{
		ruleId: "PMD_TFBFASS",
		language: "java",
		badExample: `
		public class Alpha {
			public void beta() {
				switch (a) {
					case 1:
						doSomething;
						break;
					default:
						break;
				}
			}
		}`,
		goodExample: `
		public class Alpha {
			public void beta() {
				if (something) {
					doSomething;
				}
			}
		}`,
		description: "Switch statements are intended to be used to support complex branching behaviour. Using a switch for only a few cases is ill-advised, since switches are not as easy to understand as if-then statements",
		category: "Performance",
		severity: "Minor",
		title: "Too Few Branches For ASwitch Statement",
	},
	{
		ruleId: "PMD_UEC",
		language: "java",
		badExample: `
		public Alpha() {
		}`,
		goodExample: `
		public Alpha() {
			//somethingCommented
		}`,
		description: "By explicitly commenting empty constructors it is easier to distinguish between intentional (commented) and unintentional empty constructors",
		category: "Documentation",
		severity: "Minor",
		title: "Uncommented Empty Constructor",
	},
	{
		ruleId: "PMD_UEM",
		language: "java",
		badExample: `
		public void alpha() {
		}`,
		goodExample: `
		public void alpha() {
			//somethingCommented
		}`,
		description: "By explicitly commenting empty method bodies it is easier to distinguish between intentional (commented) and unintentional empty methods",
		category: "Documentation",
		severity: "Minor",
		title: "Uncommented Empty Method",
	},
	{
		ruleId: "PMD_ULBR",
		language: "java",
		badExample: `
		public class Alpha {
		   public int alpha() {
			 int a = doSomething();
			 return a;
		   }
		}`,
		goodExample: `
		public class Alpha {
		   public int alpha() {
			 return doSomething();
		   }
		}`,
		description: "Avoid the creation of unnecessary local variables",
		category: "Code Style",
		severity: "Minor",
		title: "Unnecessary Local Before Return",
	},
	{
		ruleId: "PMD_USDF",
		language: "java",
		badExample: `
		public class Alpha {
			private static final SimpleDateFormat sdf = new SimpleDateFormat();
			void beta() {
				sdf.format();
			}
		}`,
		goodExample: `
		public class Alpha {
			private static final SimpleDateFormat sdf = new SimpleDateFormat();
			synchronized void alpha() {
				sdf.format();
			}
		}`,
		description: "SimpleDateFormat instances are not synchronized. Sun recommends using separate format instances for each thread. If multiple threads must access a static formatter, the formatter must be synchronized on block leve",
		category: "Multithreading",
		severity: "Critical",
		title: "Unsynchronized Static Date Formatter",
	},
	{
		ruleId: "PMD_UCIE",
		language: "java",
		badExample: `
		public class Alpha {
			void beta() {
				List alpha = getList();
				if (alpha.size() == 0) {
					//doSomething
				}
			}
		}`,
		goodExample: `
		public class Alpha {
			void beta() {
				List alpha = getList();
				if (alpha.isEmpty()) {
					//doSomething
				}
			}
		}`,
		description: "The isEmpty() method on java.util.Collection is provided to determine if a collection has any elements. Comparing the value of size() to 0 does not convey intent as well as the isEmpty() method",
		category: "Best Practices",
		severity: "Major",
		title: "Use Collection Is Empty",
	},
	{
		ruleId: "PMD_ULWCC",
		language: "java",
		badExample: `
		class Alpha {
			if (a.toLowerCase().equals("list")) { }
		}`,
		goodExample: `
		class Alpha {
			String x = a.toLowerCase(Locale.EN);
		}`,
		description: "When doing String::toLowerCase()/toUpperCase() conversions, use an explicit locale argument to specify the case transformation rules",
		category: "Error Prone",
		severity: "Critical",
		title: "Use Locale With Case Conversions",
	},
	{
		ruleId: "PMD_UNAION",
		language: "java",
		badExample: `
		void beta() {
			a.notify();
		}`,
		goodExample: `
		void beta() {
			a.notifyAll();
		}`,
		description: "Thread.notify() awakens a thread monitoring the object. If more than one thread is monitoring, then only one is chosen. The thread chosen is arbitrary and thus its usually safer to call notifyAll() instead",
		category: "Multithreading",
		severity: "Critical",
		title: "Use Notify All Instead Of Notify",
	},
	{
		ruleId: "PMD_UV",
		language: "java",
		badExample: `
		public class Alpha {
			public void alpha(String a, Object[] args) {
				//doSomething
			}
		}`,
		goodExample: `
		public class Alpha {
			public void alpha(String a, Object... args) {
				//doSomething
			}
		}`,
		description: "Java 5 introduced the varargs parameter declaration for methods and constructors. This syntactic sugar provides flexibility for users of these methods and constructors, allowing them to avoid having to deal with the creation of an array",
		category: "Best Practices",
		severity: "Minor",
		title: "Use Varargs",
	},
	{
		ruleId: "PMD_ACF",
		language: "java",
		badExample: `
		void alpha() {
			Beta a = new Beta();
			a.finalize();
		}`,
		goodExample: "",
		description: "The method Object.finalize() is called by the garbage collector on an object when garbage collection determines that there are no more references to the object. It should not be invoked by application logic",
		category: "Error Prone",
		severity: "Major",
		title: "Avoid Calling Finalize",
	},
	{
		ruleId: "PMD_EF",
		language: "java",
		badExample: `
		public class Alpha {
		   protected void finalize() {}
		}`,
		goodExample: "",
		description: "Empty finalize methods serve no purpose and should be removed. Note that Oracle has declared Object.finalize() as deprecated since JDK 9",
		category: "Error Prone",
		severity: "Minor",
		title: "Empty Finalizer",
	},
	{
		ruleId: "PMD_FDNCSF",
		language: "java",
		badExample: `
		protected void finalize() {
			doSomething();
		}`,
		goodExample: `
		protected void finalize() {
			doSomething();
			super.finalize();
		}`,
		description: "If the finalize() is implemented, its last action should be to call super.finalize. Note that Oracle has declared Object.finalize() as deprecated since JDK 9",
		category: "Error Prone",
		severity: "Critical",
		title: "Finalize Does Not Call Super Finalize",
	},
	{
		ruleId: "PMD_FOCSF",
		language: "java",
		badExample: `
		protected void finalize() {
			super.finalize();
		}`,
		goodExample: `
		protected void finalize() {
			doSomething();
			super.finalize();
		}`,
		description: "If the finalize() is implemented, it should do something besides just calling super.finalize(). Note that Oracle has declared Object.finalize() as deprecated since JDK 9",
		category: "Error Prone",
		severity: "Minor",
		title: "Finalize Only Calls Super Finalize",
	},
	{
		ruleId: "PMD_FO",
		language: "java",
		badExample: `
		public class Alpha {
			protected void finalize(int x) {
			}
		}`,
		goodExample: "",
		description: "Methods named finalize() should not have parameters. It is confusing and most likely an attempt to overload Object.finalize(). It will not be called by the VM",
		category: "Error Prone",
		severity: "Critical",
		title: "Finalize Overloaded",
	},
	{
		ruleId: "PMD_FSBP",
		language: "java",
		badExample: `
		public void finalize() {
			//doSomething
		}`,
		goodExample: `
		protected void finalize() {
			//doSomething
		}`,
		description: "When overriding the finalize(), the new method should be set as protected. If made public, other classes may invoke it at inappropriate times",
		category: "Error Prone",
		severity: "Critical",
		title: "Finalize Should Be Protected",
	},
	{
		ruleId: "PMD_DIJL",
		language: "java",
		badExample: "import java.lang.String;",
		goodExample: "",
		description: "Avoid importing anything from the package ‘java.lang’. These classes are automatically imported",
		category: "Code Style",
		severity: "Minor",
		title: "Dont Import Java Lang",
	},
	{
		ruleId: "PMD_DI",
		language: "java",
		badExample: `
		import java.lang.String;
		import java.lang.*;`,
		goodExample: "import java.lang.*;",
		description: "Duplicate or overlapping import statements should be avoided",
		category: "Code Style",
		severity: "Minor",
		title: "Duplicate Imports",
	},
	{
		ruleId: "PMD_IFSP",
		language: "java",
		badExample: `
		package alpha;

		import alpha.Beta;`,
		goodExample: "package alpha;",
		description: "There is no need to import a type that lives in the same package",
		category: "Error Prone",
		severity: "Minor",
		title: "Import From Same Package",
	},
	{
		ruleId: "PMD_TMSI",
		language: "java",
		badExample: `
		import static Alpha;
		import static Beta;
		import static Theta;
		import static Omicron;`,
		goodExample: "",
		description: "If you overuse the static import feature, it can make your program unreadable and unmaintainable, polluting its namespace with all the static members you import",
		category: "Code Style",
		severity: "Major",
		title: "Too Many Static Imports",
	},
	{
		ruleId: "PMD_UFQN",
		language: "java",
		badExample: `
		public class Alpha {
			private java.util.List list1;
			private List list2;
		}`,
		goodExample: "",
		description: "Import statements allow the use of non-fully qualified names. The use of a fully qualified name which is covered by an import statement is redundant",
		category: "Code Style",
		severity: "Minor",
		title: "Unnecessary Fully Qualified Name",
	},
	{
		ruleId: "PMD_DNCSE",
		language: "java",
		badExample: `
		public void beta() {
			System.exit(0);
		}`,
		goodExample: "",
		description: "Web applications should not call System.exit(), since only the web container or the application server should stop the JVM",
		category: "Error Prone",
		severity: "Critical",
		title: "Do Not Call System Exit",
	},
	{
		ruleId: "PMD_LHNC",
		language: "java",
		badExample: "public interface MissingProperSuffix extends javax.ejb.EJBLocalHome {}",
		goodExample: "public interface MyBeautifulLocalHome extends javax.ejb.EJBLocalHome {}",
		description: "The Local Home interface of a Session EJB should be suffixed by ‘LocalHome’",
		category: "Code Style",
		severity: "Major",
		title: "Local Home Naming Convention",
	},
	{
		ruleId: "PMD_LISNC",
		language: "java",
		badExample: "public interface MissingProperSuffix extends javax.ejb.EJBLocalObject {}",
		goodExample: "public interface MyLocal extends javax.ejb.EJBLocalObject {}",
		description: "The Local Interface of a Session EJB should be suffixed by ‘Local’",
		category: "Code Style",
		severity: "Major",
		title: "Local Interface Session Naming Convention",
	},
	{
		ruleId: "PMD_MDBASBNC",
		language: "java",
		badExample: "public class MissingTheProperSuffix implements SessionBean {}",
		goodExample: "public class SomeBean implements SessionBean{}",
		description: "The EJB Specification states that any MessageDrivenBean or SessionBean should be suffixed by ‘Bean’",
		category: "Code Style",
		severity: "Major",
		title: "MDBAnd Session Bean Naming Convention",
	},
	{
		ruleId: "PMD_RINC",
		language: "java",
		badExample: "public interface BadSuffixSession extends javax.ejb.EJBObject {}",
		goodExample: "",
		description: "Remote Interface of a Session EJB should not have a suffix",
		category: "Code Style",
		severity: "Major",
		title: "Remote Interface Naming Convention",
	},
	{
		ruleId: "PMD_RSINC",
		language: "java",
		badExample: "public interface MissingProperSuffix extends javax.ejb.EJBHome {}",
		goodExample: "public interface MyHome extends javax.ejb.EJBHome {} ",
		description: "A Remote Home interface type of a Session EJB should be suffixed by ‘Home’",
		category: "Code Style",
		severity: "Major",
		title: "Remote Session Interface Naming Convention",
	},
	{
		ruleId: "PMD_SEJBFSBF",
		language: "java",
		badExample: `
		public class SomeEJB extends EJBObject implements EJBLocalHome {
			private static int CountB;
		}`,
		goodExample: `
		public class SomeEJB extends EJBObject implements EJBLocalHome {
			private static final int CountB;
		}`,
		description: "According to the J2EE specification, an EJB should not have any static fields with write access. However, static read-only fields are allowed",
		category: "Error Prone",
		severity: "Critical",
		title: "Static EJBField Should Be Final",
	},
	{
		ruleId: "PMD_JUASIM",
		language: "java",
		badExample: `
		public class Alpha extends Beta {
			public void theta() {
				assertEquals("alpha", "beta");
			}
		}`,
		goodExample: `
		public class Alpha extends Beta {
			public void theta() {
				assertEquals("Alpha does not equals beta", "alpha", "beta");
			}
		}`,
		description: "JUnit assertions should include an informative message - i.e., use the three-argument version of assertEquals(), not the two-argument version",
		category: "Best Practices",
		severity: "Minor",
		title: "JUnit Assertions Should Include Message",
	},
	{
		ruleId: "PMD_JUS",
		language: "java",
		badExample: `
		import junit.framework.*;
		public class Alpha extends Beta {
			public void setup() {}
		}`,
		goodExample: `
		import junit.framework.*;
		public class Alpha extends Beta {
			public void setUp() {}
		}`,
		description: "Some JUnit framework methods are easy to misspell",
		category: "Error Prone",
		severity: "Critical",
		title: "JUnit Spelling",
	},
	{
		ruleId: "PMD_JUSS",
		language: "java",
		badExample: `
		import junit.framework.*;

		public class Alpha extends Beta {
			public void suite() {}
		}`,
		goodExample: `
		import junit.framework.*;

		public class Alpha extends Beta {
			public static void suite() {}
		}`,
		description: "The suite() method in a JUnit test needs to be both public and static",
		category: "Error Prone",
		severity: "Critical",
		title: "JUnit Static Suite",
	},
	{
		ruleId: "PMD_JUTCTMA",
		language: "java",
		badExample: `
		public class Alpha extends Beta {
			public void testAlpha() {
				boolean myTheta = false;
				assertFalse("myTheta should be false", myTheta);
				assertEquals("should equals false", false, myTheta);
			}
		}`,
		goodExample: `
		public class Alpha extends Beta {
			public void testAlpha() {
				boolean myTheta = false;
				assertFalse("should be false", myTheta);
			}
		}`,
		description: "Unit tests should not contain too many asserts. Many asserts are indicative of a complex test, for which it is harder to verify correctness",
		category: "Best Practices",
		severity: "Minor",
		title: "JUnit Test Contains Too Many Asserts",
	},
	{
		ruleId: "PMD_JUTSIA",
		language: "java",
		badExample: `
		public class Foo extends TestCase {
			public void testSomething() {
			   Bar b = findBar();
			   b.work();
			}
		 }`,
		goodExample: `
		public class Foo extends TestCase {
			public void testSomething() {
			   Bar b = findBar();
			   This is better than having a NullPointerException
			   assertNotNull("bar not found", b);
			}
		 }`,
		description: "JUnit tests should include at least one assertion. This makes the tests more robust, and using assert with messages provide the developer a clearer idea of what the test does",
		category: "Best Practices",
		severity: "Major",
		title: "JUnit Tests Should Include Assert",
	},
	{
		ruleId: "PMD_SBA",
		language: "java",
		badExample: "assertTrue(!sth);",
		goodExample: "assertFalse(sth);",
		description: "Avoid negation in an assertTrue or assertFalse test",
		category: "Design",
		severity: "Minor",
		title: "Simplify Boolean Assertion",
	},
	{
		ruleId: "PMD_TCWTC",
		language: "java",
		badExample: `
		public class CarTest {
			public static void main(String[] args) {
			}
		 }`,
		goodExample: "",
		description: "Test classes end with the suffix Test. Having a non-test class with that name is not a good practice, since most people will assume it is a test case",
		category: "Error Prone",
		severity: "Minor",
		title: "Test Class Without Test Cases",
	},
	{
		ruleId: "PMD_UBA",
		language: "java",
		badExample: `
		public class Alpha extends Beta {
			public void testAlpha() {
				assertTrue(true);
			}
		}`,
		goodExample: "",
		description: "A JUnit test assertion with a boolean literal is unnecessary since it always will evaluate to the same thing. Consider using flow control (in case of assertTrue(false) or similar) or simply removing statements like assertTrue(true) and assertFalse(false)",
		category: "Error Prone",
		severity: "Minor",
		title: "Unnecessary Boolean Assertion",
	},
	{
		ruleId: "PMD_UAEIOAT",
		language: "java",
		badExample: `
		public class Alpha extends Beta {
			void testAlpha() {
				Object x, y;
				assertTrue(x.equals(y));
			}
		}`,
		goodExample: `
		public class Alpha extends Beta {
			void testAlpha() {
				Object x, y;
				assertEquals("x should equals y", x, y);  
			}
		}`,
		description: "The assertions should be made by more specific methods, like assertEquals",
		category: "Best Practices",
		severity: "Major",
		title: "Use Assert Equals Instead Of Assert True",
	},
	{
		ruleId: "PMD_UANIOAT",
		language: "java",
		badExample: `
		public class Alpha extends Beta {
			void testAlpha() {
				Object x = doSomething();
				assertTrue(x == null);
			}
		}`,
		goodExample: `
		public class Alpha extends Beta {
			void testAlpha() {
				Object x = doSomething();
				assertNull(x);
			}
		}`,
		description: "The assertions should be made by more specific methods, like assertNull, assertNotNull",
		category: "Best Practices",
		severity: "Minor",
		title: "Use Assert Null Instead Of Assert True",
	},
	{
		ruleId: "PMD_UASIOAT",
		language: "java",
		badExample: `
		public class Alpha extends Beta {
			void testAlpha() {
				Object x, y;
				assertTrue(x == y);
			}
		}`,
		goodExample: `
		public class Alpha extends Beta {
			void testAlpha() {
				Object x, y;
				assertSame(x, y);
			}
		}`,
		description: "The assertions should be made by more specific methods, like assertSame, assertNotSame",
		category: "Best Practices",
		severity: "Minor",
		title: "Use Assert Same Instead Of Assert True",
	},
	{
		ruleId: "PMD_UATIOAE",
		language: "java",
		badExample: `
		public class Alpha extends Beta {
			public void testAlpha() {
				boolean myTest = true;
				assertEquals("myTest is true", true, myTest);
			}
		}`,
		goodExample: `
		public class Alpha extends Beta {
			public void testAlpha() {
				boolean myTest = true;
				assertTrue("myTest is true", myTest);
			}
		}`,
		description: "When asserting a value is the same as a literal or Boxed boolean, use assertTrue/assertFalse, instead of assertEquals",
		category: "Best Practices",
		severity: "Minor",
		title: "Use Assert True Instead Of Assert Equals",
	},
	{
		ruleId: "PMD_GDL",
		language: "java",
		badExample: `
		logger.debug("This is a very long message that prints two values." +
				" However since the message is long, we still incur the performance hit" +
				" of String concatenation when logging {} and {}", value1, value2);`,
		goodExample: `
		if (logger.isDebugEnabled()) {
			logger.debug("This is a very long message that prints two values." +
				" However since the message is long, we still incur the performance hit" +
				" of String concatenation when logging {} and {}", value1, value2);
		}`,
		description: "When log messages are composed by concatenating strings, the whole section should be guarded by a isDebugEnabled() check to avoid performance and memory issues",
		category: "Best Practices",
		severity: "Major",
		title: "Guard Debug Logging",
	},
	{
		ruleId: "PMD_GLS",
		language: "java",
		badExample: "log.debug(\"logs here {} and {}\", param1, param2);",
		goodExample: `
		if (log.isDebugEnabled()) {
			log.debug("logs here" + param1 + " and " + param2 + "concat strings");
		}`,
		description: "Whenever using a log level, one should check if the loglevel is actually enabled, or otherwise skip the associate String creation and manipulation",
		category: "Best Practices",
		severity: "Minor",
		title: "Guard Log Statement",
	},
	{
		ruleId: "PMD_PL",
		language: "java",
		badExample: `
		public class Alpha {
			protected Log LOG = LogFactory.getLog(Testalpha.class);
		}`,
		goodExample: `
		public class Alpha {
			private static final Log LOG = LogFactory.getLog(Alpha.class);
		}`,
		description: "A logger should normally be defined private static final and be associated with the correct class",
		category: "Error Prone",
		severity: "Minor",
		title: "Proper Logger",
	},
	{
		ruleId: "PMD_UCEL",
		language: "java",
		badExample: `
		public class Alpha {
			private static final Log _LOG = LogFactory.getLog( Alpha.class );
			void beta() {
				try {
				} catch( Exception e ) {
					_LOG.error( e );
				}
			}
		}`,
		goodExample: `
		public class Alpha {
			private static final Log _LOG = LogFactory.getLog( Alpha.class );
			void beta() {
				} catch( OtherException oe ) {
					_LOG.error( oe.getMessage(), oe );
				}
			}
		}`,
		description: "To make sure the full stacktrace is printed out, use the logging statement with two arguments: a String and a Throwable",
		category: "Error Prone",
		severity: "Major",
		title: "Use Correct Exception Logging",
	},
	{
		ruleId: "PMD_APST",
		language: "java",
		badExample: `
		class Alpha {
			void beta() {
				try {
					//doSomething
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}`,
		goodExample: "",
		description: " Avoid printStackTrace() use a logger call instead",
		category: "Best Practices",
		severity: "Major",
		title: "Avoid Print Stack Trace",
	},
	{
		ruleId: "PMD_GLSJU",
		language: "java",
		badExample: "log.debug(\"log something {} and {}\", param1, param2);",
		goodExample: `
		if (log.isDebugEnabled()) {
			log.debug("log something" + param1 + " and " + param2 + "concat strings");
		}`,
		description: "Whenever using a log level, one should check if the loglevel is actually enabled, or otherwise skip the associate String creation and manipulation",
		category: "Best Practices",
		severity: "Minor",
		title: "Guard Log Statement Java Util",
	},
	{
		ruleId: "PMD_LINSF",
		language: "java",
		badExample: `
		public class Alpha{
			Logger log = Logger.getLogger(Alpha.class.getName());
		}`,
		goodExample: `
		public class Alpha{
			static final Logger log = Logger.getLogger(Alpha.class.getName());
		}`,
		description: "In most cases, the Logger reference can be declared as static and final",
		category: "Error Prone",
		severity: "Minor",
		title: "Logger Is Not Static Final",
	},
	{
		ruleId: "PMD_MTOL",
		language: "java",
		badExample: `
		public class Alpha {
			Logger log1 = Logger.getLogger(Alpha.class.getName());
			Logger log2= Logger.getLogger(Alpha.class.getName());
		}`,
		goodExample: `
		public class Alpha {
			Logger log = Logger.getLogger(Alpha.class.getName());
		}`,
		description: "Normally only one logger is used in each class",
		category: "Error Prone",
		severity: "Major",
		title: "More Than One Logger",
	},
	{
		ruleId: "PMD_SP",
		language: "java",
		badExample: `
		class Alpha{
			Logger log = Logger.getLogger(Alpha.class.getName());
			public void testAlpha () {
				System.out.println("This test");
			}
		}`,
		goodExample: `
		class Alpha{
			Logger log = Logger.getLogger(Alpha.class.getName());
			public void testAlpha () {
				log.fine("This test");
			}
		}`,
		description: "References to System.(out|err).print are usually intended for debugging purposes. Use a logger instead",
		category: "Best Practices",
		severity: "Major",
		title: "System Println",
	},
	{
		ruleId: "PMD_MSVUID",
		language: "java",
		badExample: `
		public class Alpha implements java.io.Serializable {
			String test;
			//doSomething
		}`,
		goodExample: `
		public class Alpha implements java.io.Serializable {
			String test;
			public static final long serialVersionUID = 4916737;
		}`,
		description: "Serializable classes should provide a serialVersionUID field",
		category: "Error Prone",
		severity: "Major",
		title: "Missing Serial Version UID",
	},
	{
		ruleId: "PMD_ADS",
		language: "java",
		badExample: `
		public class Alp$ha {
		}`,
		goodExample: `
		public class Alpha {
		}`,
		description: "Avoid using dollar signs in variable/method/class/interface names",
		category: "Code Style",
		severity: "Minor",
		title: "Avoid Dollar Signs",
	},
	{
		ruleId: "PMD_AFNMMN",
		language: "java",
		badExample: `
		public class Alpha {
			Object beta;
			void beta() {
			}
		}`,
		goodExample: `
		public class Alpha {
			Object beta;
			void theta() {
			}
		}`,
		description: "It can be confusing to have a field name with the same name as a method",
		category: "Error Prone",
		severity: "Minor",
		title: "Avoid Field Name Matching Method Name",
	},
	{
		ruleId: "PMD_AFNMTN",
		language: "java",
		badExample: `
		public class Alpha extends Beta {
			int alpha;
		}`,
		goodExample: `
		public class Alpha extends Beta {
			int theta;
		}`,
		description: "It is somewhat confusing to have a field name matching the declaring class name",
		category: "Error Prone",
		severity: "Minor",
		title: "Avoid Field Name Matching Type Name",
	},
	{
		ruleId: "PMD_BGMN",
		language: "java",
		badExample: "public boolean getAlpha();",
		goodExample: "public boolean isAlpha();",
		description: "Methods that return boolean results should be named as predicate statements to denote this. I.e, ‘isReady()’, ‘hasValues()’, ‘canCommit()’, ‘willFail()’, etc. Avoid the use of the ‘get’ prefix for these methods",
		category: "Code Style",
		severity: "Minor",
		title: "Boolean Get Method Name",
	},
	{
		ruleId: "PMD_CNC",
		language: "java",
		badExample: "public class Étudiant {}",
		goodExample: "public class AlphaBeta {}",
		description: "Configurable naming conventions for type declarations",
		category: "Code Style",
		severity: "Minor",
		title: "Class Naming Conventions",
	},
	{
		ruleId: "PMD_GN",
		language: "java",
		badExample: `
		public interface GenericDao<e extends BaseModel, K extends Serializable> {
		}`,
		goodExample: `
		public interface GenericDao<E extends BaseModel, K extends Serializable> {
		}`,
		description: "Names for references to generic values should be limited to a single uppercase letter",
		category: "Code Style",
		severity: "Minor",
		title: "Generics Naming",
	},
	{
		ruleId: "PMD_MeNC",
		language: "java",
		badExample: "",
		goodExample: "",
		description: "Configurable naming conventions for method declarations",
		category: "Code Style",
		severity: "Minor",
		title: "Method Naming Conventions",
	},
	{
		ruleId: "PMD_MWSNAEC",
		language: "java",
		badExample: `
		public class AlphaT {
			public void AlphaT() {}
		}`,
		goodExample: `
		public class AlphaT {
			public AlphaT() {}
		}`,
		description: "Non-constructor methods should not have the same name as the enclosing class",
		category: "Error Prone",
		severity: "Minor",
		title: "Method With Same Name As Enclosing Class",
	},
	{
		ruleId: "PMD_NP",
		language: "java",
		badExample: "",
		goodExample: "",
		description: "A class, interface, enum or annotation does not have a package definition",
		category: "Code Style",
		severity: "Minor",
		title: "No Package",
	},
	{
		ruleId: "PMD_PC",
		language: "java",
		badExample: "package com.MyAlpha;",
		goodExample: "package com.myalpha;",
		description: "The package definition contains uppercase characters",
		category: "Code Style",
		severity: "Minor",
		title: "Package Case",
	},
	{
		ruleId: "PMD_SCN",
		language: "java",
		badExample: `
		public class Alp {
		}`,
		goodExample: `
		public class Alpha {
		}`,
		description: "Short Classnames with fewer than e.g. five characters are not recommended",
		category: "Code Style",
		severity: "Minor",
		title: "Short Class Name",
	},
	{
		ruleId: "PMD_SMN",
		language: "java",
		badExample: `
		public class Alpha {
			public void a( int i ) {
			}
		}`,
		goodExample: `
		public class Alpha {
			public void beta( int i ) {
			}
		}`,
		description: "Method names that are very short are not helpful to the reader",
		category: "Code Style",
		severity: "Minor",
		title: "Short Method Name",
	},
	{
		ruleId: "PMD_SCFN",
		language: "java",
		badExample: `
		public class Alpha {
		  double PI = 3.16;
		}`,
		goodExample: `
		public class Alpha {
		  final double PI = 3.16;
		}`,
		description: "Field names using all uppercase characters - Sun’s Java naming conventions indicating constants - should be declared as final",
		category: "Code Style",
		severity: "Minor",
		title: "Suspicious Constant Field Name",
	},
	{
		ruleId: "PMD_SEMN",
		language: "java",
		badExample: `
		public class Alpha {
			public int equals(Object a) {
			 //doSomething
		    }
		}`,
		goodExample: `
		public class Alpha {
			public boolean equals(Object a) {
			 //doSomething
		    }
		}`,
		description: "The method name and parameter number are suspiciously close to equals(Object), which can denote an intention to override the equals(Object) method",
		category: "Error Prone",
		severity: "Critical",
		title: "Suspicious Equals Method Name",
	},
	{
		ruleId: "PMD_SHMN",
		language: "java",
		badExample: `
		public class Alpha {
			public int hashcode() {
			}
		}`,
		goodExample: `
		public class Alpha {
			public int newname() {
			}
		}`,
		description: "The method name and return type are suspiciously close to hashCode(), which may denote an intention to override the hashCode() method",
		category: "Error Prone",
		severity: "Critical",
		title: "Suspicious Hashcode Method Name",
	},
	{
		ruleId: "PMD_VNC",
		language: "java",
		badExample: `
		public class Alpha {
			public static final int  my_alp = 0;
		}`,
		goodExample: `
		public class Alpha {
			public static final int MY_ALP = 0;
		}`,
		description: "Final variables should be fully capitalized and non-final variables should not include underscores",
		category: "Code Style",
		severity: "Minor",
		title: "Variable Naming Conventions",
	},
	{
		ruleId: "PMD_AES",
		language: "java",
		badExample: "String a = \"\" + 456; ",
		goodExample: "String a = Integer.toString(456);",
		description: "The conversion of literals to strings by concatenating them with empty strings is inefficient. It is much better to use one of the type-specific toString() methods instead",
		category: "Performance",
		severity: "Minor",
		title: "Add Empty String",
	},
	{
		ruleId: "PMD_AAL",
		language: "java",
		badExample: `
		public class Alpha {
			public void beta() {
				int[] x = new int[5];
				int[]y = new int[5];
				for (int i = 0; i < 5 ; i++) {
					y[i] = x[i];
				}
				int[] z = new int[5];
				for (int i = 0 ; i < 5 ; i++) {
					y[i] = x[z[i]];
				}
			}
		}`,
		goodExample: "",
		description: "Instead of manually copying data between two arrays, use the efficient Arrays.copyOf or System.arraycopy method instead",
		category: "Performance",
		severity: "Major",
		title: "Avoid Array Loops",
	},
	{
		ruleId: "PMD_RFI",
		language: "java",
		badExample: `
		public class Alpha {
			boolean a = false;
		}`,
		goodExample: "",
		description: "Java will initialize fields with known default values so any explicit initialization of those same defaults is redundant and results in a larger class file (approximately three additional bytecode instructions per field)",
		category: "Performance",
		severity: "Minor",
		title: "Redundant Field Initializer",
	},
	{
		ruleId: "PMD_UWOC",
		language: "java",
		badExample: `
		public int convert(String a) {
			int x, x2;

			x = Integer.valueOf(a).intValue();

			x2 = Integer.valueOf(x).intValue();

			return x2;
		}`,
		goodExample: `
		public int convert(String a) {
			int x, x2;
			x = Integer.parseInt(a);
			x2 = x;

			return x2;
		}`,
		description: "Most wrapper classes provide static conversion methods that avoid the need to create intermediate objects just to create the primitive forms. Using these avoids the cost of creating objects that also need to be garbage-collected later",
		category: "Performance",
		severity: "Major",
		title: "Unnecessary Wrapper Object Creation",
	},
	{
		ruleId: "PMD_UALIOV",
		language: "java",
		badExample: `
		public class Alpha extends Beta {
			public void testAlpha() {
			Collection b = new Vector();
			}
		}`,
		goodExample: `
		public class Alpha extends Beta {
			public void testAlpha() {
			Collection b = new ArrayList();
			}
		}`,
		description: "ArrayList is a much better Collection implementation than Vector if thread-safe operation is not required",
		category: "Performance",
		severity: "Minor",
		title: "Use Array List Instead Of Vector",
	},
	{
		ruleId: "PMD_UAAL",
		language: "java",
		badExample: `
		public class Alpha {
			public void beta(Integer[] ints) {
				List<Integer> l = new ArrayList<>(50);
				for (int i = 0 ; i < 50; i++) {
					l.add(ints[i]);
				}
			}
		}`,
		goodExample: `
		public class Alpha {
			public void beta(Integer[] ints) {
				List<Integer> l= new ArrayList<>(50);
				for (int i = 0 ; i < 50; i++) {
					l.add(a[i].toString());
				}
			}
		}`,
		description: "\"The java.util.Arrays class has a \"\"asList\"\" method that should be used when you want to create a new List from an array of objects. It is faster than executing a loop to copy all the elements of the array one by one\"",
		category: "Performance",
		severity: "Major",
		title: "Use Arrays As List",
	},
	{
		ruleId: "PMD_USBFSA",
		language: "java",
		badExample: `
		public class Alpha {
			void beta() {
				String c;
				c = "alpha";
				c += " beta";
			}
		}`,
		goodExample: `
		public class Alpha {
			void beta() {
				String c;
				StringBuilder c = new StringBuilder("alpha");
				c.append(" beta");
			}
		}`,
		description: "The use of the ‘+=’ operator for appending strings causes the JVM to create and use an internal StringBuffer. If a non-trivial number of these concatenations are being used then the explicit use of a StringBuilder or threadsafe StringBuffer is recommended to avoid this",
		category: "Performance",
		severity: "Major",
		title: "Use String Buffer For String Appends",
	},
	{
		ruleId: "PMD_AISD",
		language: "java",
		badExample: `
		public class Alpha {
			private String [] a;
				public void beta (String [] param) {
				this.a=param;
			}
		}`,
		goodExample: "",
		description: "Constructors and methods receiving arrays should clone objects and store the copy. This prevents future changes from the user from affecting the original array",
		category: "Security",
		severity: "Major",
		title: "Array Is Stored Directly",
	},
	{
		ruleId: "PMD_MRIA",
		language: "java",
		badExample: `
		public class Alpha {
			UserChart [] uc;
			public UserChart [] getUserChart() {
				return uc;
			}
		}`,
		goodExample: "",
		description: "Exposing internal arrays to the caller violates object encapsulation since elements can be removed or replaced outside of the object that owns it. It is safer to return a copy of the array",
		category: "Security",
		severity: "Major",
		title: "Method Returns Internal Array",
	},
	{
		ruleId: "PMD_ACGE",
		language: "java",
		badExample: `
		public class Alpha {

			public void Beta() {
				try {
					System.out.println(" i [" + i + "]");
				} catch(Exception e) {
					e.printStackTrace();
				} catch(RuntimeException e) {
					e.printStackTrace();
				} catch(NullPointerException e) {
					e.printStackTrace();
				}
			}
		}`,
		goodExample: "",
		description: "Avoid catching generic exceptions such as NullPointerException, RuntimeException, Exception in try-catch block",
		category: "Design",
		severity: "Major",
		title: "Avoid Catching Generic Exception",
	},
	{
		ruleId: "PMD_ACNPE",
		language: "java",
		badExample: `
		public class Alpha {
			void beta() {
				try {
					// do something
				} catch (NullPointerException npe) {
				}
			}
		}`,
		goodExample: "",
		description: "Code should never throw NullPointerExceptions under normal circumstances. A catch block may hide the original error, causing other, more subtle problems later on",
		category: "Error Prone",
		severity: "Critical",
		title: "Avoid Catching NPE",
	},
	{
		ruleId: "PMD_ACT",
		language: "java",
		badExample: `
		public void beta() {
			try {
				// do something
			} catch (Throwable th) {
				th.printStackTrace();
			}
		}`,
		goodExample: "",
		description: "Catching Throwable errors is not recommended since its scope is very broad. It includes runtime issues such as OutOfMemoryError that should be exposed and managed separately",
		category: "Error Prone",
		severity: "Major",
		title: "Avoid Catching Throwable",
	},
	{
		ruleId: "PMD_ALEI",
		language: "java",
		badExample: "",
		goodExample: `
		public void bar() {
			try {
				// do something
			} catch (SomeException se) {
				se.getMessage();
			}
		}`,
		description: "Statements in a catch block that invoke accessors on the exception without using the information only add to code size. Either remove the invocation, or use the return result",
		category: "Error Prone",
		severity: "Major",
		title: "Avoid Losing Exception Information",
	},
	{
		ruleId: "PMD_ARE",
		language: "java",
		badExample: `
		public void beta() {
			try {
				// do something
			}  catch (SomeException se) {
			   throw se;
			}
		}`,
		goodExample: "",
		description: "Catch blocks that merely rethrow a caught exception only add to code size and runtime complexity",
		category: "Design",
		severity: "Minor",
		title: "Avoid Rethrowing Exception",
	},
	{
		ruleId: "PMD_ATNIOSE",
		language: "java",
		badExample: `
		public void beta() {
			try {
				// do something
			} catch (SomeException se) {
				// harmless comment
				throw new SomeException(se);
			}
		}`,
		goodExample: "",
		description: "Catch blocks that merely rethrow a caught exception wrapped inside a new instance of the same type only add to code size and runtime complexity",
		category: "Design",
		severity: "Minor",
		title: "Avoid Throwing New Instance Of Same Exception",
	},
	{
		ruleId: "PMD_ATNPE",
		language: "java",
		badExample: `
		public class Alpha {
			void beta() {
				throw new NullPointerException();
			}
		}`,
		goodExample: `
		public class Alpha {
			private String examValue;
		
			void setExamValue(String examValue) {
			  this.examValue = Objects.requireNonNull(examValue, "examValue must not be null!");
			}
		  }`,
		description: "Avoid throwing NullPointerExceptions manually. These are confusing because most people will assume that the virtual machine threw it. To avoid a method being called with a null parameter, you may consider using an IllegalArgumentException instead",
		category: "Design",
		severity: "Critical",
		title: "Avoid Throwing Null Pointer Exception",
	},
	{
		ruleId: "PMD_ATRET",
		language: "java",
		badExample: `
		public class Alpha {
			public void beta() throws Exception {
				throw new Exception();
			}
		}`,
		goodExample: "",
		description: "Avoid throwing certain exception types. Rather than throw a raw RuntimeException, Throwable, Exception, or Error, use a subclassed exception or error instead",
		category: "Design",
		severity: "Major",
		title: "Avoid Throwing Raw Exception Types",
	},
	{
		ruleId: "PMD_DNEJLE",
		language: "java",
		badExample: "public class Alpha extends Error { }",
		goodExample: "",
		description: "Errors are system exceptions. Do not extend them",
		category: "Design",
		severity: "Critical",
		title: "Do Not Extend Java Lang Error",
	},
	{
		ruleId: "PMD_DNTEIF",
		language: "java",
		badExample: `
		public class Alpha {
			public void beta() {
				try {
					// Do somthing
				} catch( Exception e) {
					// Handling the issue
				} finally {
					throw new Exception();
				}
			}
		}`,
		goodExample: "",
		description: "\"Throwing exceptions within a ‘finally’ block is confusing since they may mask other exceptions or code defects. Note: This is a PMD implementation of the Lint4j rule \"\"A throw in a finally block\"\"\"",
		category: "Error Prone",
		severity: "Critical",
		title: "Do Not Throw Exception In Finally",
	},
	{
		ruleId: "PMD_EAFC",
		language: "java",
		badExample: `
		public void beta() {
			try {
				try {
				} catch (Exception e) {
					throw new WrapperException(e);
				}
			} catch (WrapperException e) {
				// do some more stuff
			}
		}`,
		goodExample: "",
		description: "Using Exceptions as form of flow control is not recommended as they obscure true exceptions when debugging. Either add the necessary validation or use an alternate control structure",
		category: "Design",
		severity: "Major",
		title: "Exception As Flow Control",
	},
	{
		ruleId: "PMD_ADL",
		language: "java",
		badExample: `
		private void alpha() {
			beta("Howdy");
			beta("Howdy");
	   }`,
		goodExample: "private void beta(String x) {}",
		description: "Code containing duplicate String literals can usually be improved by declaring the String as a constant field",
		category: "Error Prone",
		severity: "Major",
		title: "Avoid Duplicate Literals",
	},
	{
		ruleId: "PMD_ASBF",
		language: "java",
		badExample: `
		public class Foo {
			private StringBuffer buffer;
		}`,
		goodExample: "",
		description: "StringBuffers/StringBuilders can grow considerably, and so may become a source of memory leaks if held within objects with long lifetimes",
		category: "Best Practices",
		severity: "Minor",
		title: "Avoid String Buffer Field",
	},
	{
		ruleId: "PMD_CASR",
		language: "java",
		badExample: `
		buf.append("Hello");
		buf.append(alpha);
		buf.append("World");`,
		goodExample: "buf.append(\"Hello\").append(alpha).append(\"World\");",
		description: "Consecutive calls to StringBuffer/StringBuilder .append should be chained, reusing the target object. This can improve the performance by producing a smaller bytecode, reducing overhead and improving inlining",
		category: "Performance",
		severity: "Minor",
		title: "Consecutive Appends Should Reuse",
	},
	{
		ruleId: "PMD_CLA",
		language: "java",
		badExample: "buf.append(\"Hello\").append(\" \").append(\"World\");",
		goodExample: "buf.append(\"Hello World\");",
		description: "Consecutively calling StringBuffer/StringBuilder.append(…) with literals should be avoided",
		category: "Performance",
		severity: "Minor",
		title: "Consecutive Literal Appends",
	},
	{
		ruleId: "PMD_ISB",
		language: "java",
		badExample: "StringBuffer sb = new StringBuffer(\"tmp = \"+System.getProperty(\"java.io.tmpdir\"));",
		goodExample: `
		StringBuffer sb = new StringBuffer("tmp = ");
		sb.append(System.getProperty("java.io.tmpdir"));`,
		description: "Avoid concatenating non-literals in a StringBuffer constructor or append() since intermediate buffers will need to be be created and destroyed by the JVM",
		category: "Performance",
		severity: "Minor",
		title: "Inefficient String Buffering",
	},
	{
		ruleId: "PMD_SBIWC",
		language: "java",
		badExample: `
		StringBuffer  sb1 = new StringBuffer('c');
		StringBuilder sb2 = new StringBuilder('c');`,
		goodExample: `
		StringBuffer  sb3 = new StringBuffer("c");
		StringBuilder sb4 = new StringBuilder("c");`,
		description: "Individual character values provided as initialization arguments will be converted into integers. This can lead to internal buffer sizes that are larger than expected",
		category: "Error Prone",
		severity: "Critical",
		title: "String Buffer Instantiation With Char",
	},
	{
		ruleId: "PMD_StI",
		language: "java",
		badExample: "private String beta = new String(\"beta\");",
		goodExample: "private String beta = \"beta\";",
		description: "Avoid instantiating String objects. This is usually unnecessary since they are immutable and can be safely shared",
		category: "Performance",
		severity: "Minor",
		title: "String Instantiation",
	},
	{
		ruleId: "PMD_STS",
		language: "java",
		badExample: `
		private String beta() {
			String tab = "iamastring";
			return tab.toString();
		}`,
		goodExample: `
		private String beta() {
			String tab = "a string";
			return String.join("I am ", tab);
		}`,
		description: "Avoid calling toString() on objects already known to be string instances. This is unnecessary",
		category: "Performance",
		severity: "Minor",
		title: "String To String",
	},
	{
		ruleId: "PMD_UCC",
		language: "java",
		badExample: "boolean answer = alpha.toUpperCase().equals(\"beta\");",
		goodExample: "boolean answer = alpha.equalsIgnoreCase(\"beta\")",
		description: "Using equalsIgnoreCase() is faster than using toUpperCase/toLowerCase().equals()",
		category: "Performance",
		severity: "Minor",
		title: "Unnecessary Case Change",
	},
	{
		ruleId: "PMD_UETCS",
		language: "java",
		badExample: `
		public boolean test(String s) {
			if (s == "one") return true;
			return false;
		}`,
		goodExample: `
		public boolean test(String s) {
			if ("two".equals(s)) return true;
			return false;
		}`,
		description: "Using ‘==’ or ‘!=’ to compare strings only works if intern version is used on both sides",
		category: "Security",
		severity: "Critical",
		title: "Use Equals To Compare Strings",
	},
	{
		ruleId: "PMD_ClMMIC",
		language: "java",
		badExample: `
		public class MyClass {
			public Object clone() {
			 return alpha;
			}
		   }`,
		goodExample: `
		public class MyClass {
			public Object clone() throws CloneNotSupportedException {
			 return alpha;
			}
		   }`,
		description: "The method clone() should only be implemented if the class implements the Cloneable interface with the exception of a final method that only throws CloneNotSupportedException",
		category: "Error Prone",
		severity: "Major",
		title: "Clone Method Must Implement Cloneable",
	},
	{
		ruleId: "PMD_LoC",
		language: "java",
		badExample: `
		public class Beta {
			private ArrayList<SomeType> list = new ArrayList<>();
		
			public HashSet<SomeType> getAlpha() {
				return new HashSet<SomeType>();
			}
		}`,
		goodExample: `
		public class Beta {
			private List<SomeType> list = new ArrayList<>();
		
			public Set<SomeType> getAlpha() {
				return new HashSet<SomeType>();
			}
		}`,
		description: "The use of implementation types (i.e., HashSet) as object references limits your ability to use alternate implementations in the future as requirements change. Whenever available, referencing objects by their interface types (i.e, Set) provides much more flexibility",
		category: "Best Practices",
		severity: "Major",
		title: "Loose Coupling",
	},
	{
		ruleId: "PMD_SiDTE",
		language: "java",
		badExample: "public void alpha() throws Exception { }",
		goodExample: "",
		description: "A method/constructor shouldn’t explicitly throw the generic java.lang.Exception, since it is unclear which exceptions that can be thrown from the methods. It might be difficult to document and understand such vague interfaces. Use either a class derived from RuntimeException or a checked exception",
		category: "Design",
		severity: "Major",
		title: "Signature Declare Throws Exception",
	},
	{
		ruleId: "PMD_UnI",
		language: "java",
		badExample: `
		import java.io.File;
		import java.util.*;

		public class Alpha {}`,
		goodExample: "public class ALpha {}",
		description: "Avoid unused import statements to prevent unwanted dependencies",
		category: "Best Practices",
		severity: "Minor",
		title: "Unused Imports",
	},
	{
		ruleId: "PMD_ULV",
		language: "java",
		badExample: `
		public class Alpha {
			public void doSomething(Int x) {
				int i = 5;
				return x + 2;
			}
		}`,
		goodExample: `
		public class Alpha {
			public void doSomething(Int x) {
				int i = 5;
				public int addOne() {
					return j + i;
				}
			}
		}`,
		description: "The local variable is declared and/or assigned, but not used",
		category: "Best Practices",
		severity: "Major",
		title: "Unused Local Variable",
	},
	{
		ruleId: "PMD_UPF",
		language: "java",
		badExample: `
		public class Something {
			private static int ALPHA = 2;
			private int i = 5;
		}`,
		goodExample: `
		public class Something {
			private int j = 6;
			public int addOne() {
				return j++;
			}
		}`,
		description: "The private field is declared and/or assigned a value, but not used",
		category: "Best Practices",
		severity: "Major",
		title: "Unused Private Field",
	},
	{
		ruleId: "PMD_UPM",
		language: "java",
		badExample: `
		public class Something {
			private void alpha() {}
		}`,
		goodExample: "",
		description: "The private method is declared but is unused",
		category: "Best Practices",
		severity: "Major",
		title: "Unused Private Method",
	},
	{
		ruleId: "PMD_AMG",
		language: "java",
		badExample: `
		public class OuterClass {
			public class InnerClass {
				InnerClass() {
					OuterClass.this.counter++;
				}
			}
		}`,
		goodExample: `
		public class OuterClass {
			private int counter;
		}`,
		description: "Avoid autogenerated methods to access private fields and methods of inner/outer classes",
		category: "Best Practice",
		severity: "Minor",
		title: "Accessor Method Generation",
	},
	{
		ruleId: "PMD_AMDF",
		language: "java",
		badExample: `
		public byte[] calculateHashShared(byte[] data) {
			sharedMd.reset();
			sharedMd.update(data);
			return sharedMd.digest();
		}`,
		goodExample: `
		public byte[] calculateHash(byte[] data) throws Exception {
			MessageDigest md = MessageDigest.getInstance("SHA-256");
			md.update(data);
			return md.digest();
		}`,
		description: "It is better to create a new instance, rather than synchronizing access to a shared instance",
		category: "Best Practice",
		severity: "Major",
		title: "Avoid Message Digest Field",
	},
	{
		ruleId: "PMD_ARCV",
		language: "java",
		badExample: `
		public class Alpha {
			public void foo() {
				try {
					// do something
				} catch (Exception e) {
					e = new NullPointerException();
				}
			}
		}`,
		goodExample: `
		public class Alpha {
			public void foo() {
				try {
					// do something
				} catch (MyException | ServerException e) {
					e = new RuntimeException();
				}
			}
		}`,
		description: "Reassigning exception variables caught in a catch statement should be avoided",
		category: "Best Practice",
		severity: "Minor",
		title: "Avoid Reassigning Catch Variables",
	},
	{
		ruleId: "PMD_ARLV",
		language: "java",
		badExample: `
		public class Alpha {
			private void alpha() {
			  for (String s : listOfStrings()) {
				s = s.trim();
				doSomethingWith(s);
		  
				s = s.toUpper();
				doSomethingElseWith(s);
			  }
			}
		  }`,
		goodExample: `
		public class Alpha {
			private voidalpha() {
				for (int i=0; i < 10; i++) {
				  if (check(i)) {
					i++;
				  }
			
				  i = 5;
		  
				doSomethingWith(i);
			  }
			}
		  }`,
		description: "Reassigning loop variables can lead to hard-to-find bugs. Prevent or limit how these variables can be changed",
		category: "Best Practice",
		severity: "Minor",
		title: "Avoid Reassigning Loop Variables",
	},
	{
		ruleId: "PMD_CII",
		language: "java",
		badExample: `
		public interface ConstantInterface {
			public static final int CONST1 = 1;
			static final int CONST2 = 1;
			final int CONST3 = 1;
			int CONST4 = 1;
		}`,
		goodExample: `
		public interface ConstantInterface {
			public static final int CONST1 = 1;

			int anyMethod();
		}`,
		description: "Avoid constants in interfaces. Interfaces define types, constants are implementation details better placed in classes or enums",
		category: "Best Practice",
		severity: "Minor",
		title: "Constants In Interface",
	},
	{
		ruleId: "PMD_DBI",
		language: "java",
		badExample: `
		List<String> a = new ArrayList<>();
		a.add("a");
		a.add("b");
		a.add("c");
		return a;`,
		goodExample: `
		return new ArrayList<String>(){{
			add("a");
			add("b");
			add("c");
		}};`,
		description: "it is preferable to initialize the object normally, rather than usuing double brace initialization",
		category: "Best Practice",
		severity: "Minor",
		title: "Double Brace Initialization",
	},
	{
		ruleId: "PMD_FLCBF",
		language: "java",
		badExample: `public class Alpha {
			void loop(List<String> l) {
			  for (int i = 0; i < l.size(); i++) {
				System.out.println(l.get(i));
			  }
			}
		  }`,
		goodExample: `
		public class Alpha {
			void loop(List<String> l) {
			  for (String s : l) {
				System.out.println(s);
			  }
			}
		  }`,
		description: "Reports loops that can be safely replaced with the foreach syntax",
		category: "Best Practice",
		severity: "Minor",
		title: "For Loop Can Be Foreach",
	},
	{
		ruleId: "PMD_FLVC",
		language: "java",
		badExample: `
		for (int i = 0, j = 0; i < 10; i++, j += 2) {
			alpha();
		}`,
		goodExample: `
		for (int i = 0; i < 10; i++) {
			alpha();
		}`,
		description: "Having a lot of control variables in a 'for' loop makes it harder to see what range of values the loop iterates over",
		category: "Best Practice",
		severity: "Minor",
		title: "For Loop Variable Count",
	},
	{
		ruleId: "PMD_LFIC",
		language: "java",
		badExample: `
		class Alpha {
			boolean bar(String x) {
				return x.equals("3");
			}
			boolean bar(String x) {
				return x.equalsIgnoreCase("3");
			}
			boolean bar(String x) {
				return (x.compareTo("alpha") > 0);
			}
			boolean bar(String x) {
				return (x.compareToIgnoreCase("alpha") > 0);
			}
			boolean bar(String x) {
				return x.contentEquals("alpha");
			}
		}`,
		goodExample: `
		class Alpha {
			boolean bar(String x) {
				return "3".equals(x);
			}
			boolean bar(String x) {
				return "3".equalsIgnoreCase(x);
			}
			boolean bar(String x) {
				return ("alpha".compareTo(x) < 0);
			}
			boolean bar(String x) {
				return ("alpha".compareToIgnoreCase(x) < 0); 
			}
			boolean bar(String x) {
				return "alpha".contentEquals(x);
			}
		}`,
		description: "Position literals first in all String comparisons",
		category: "Best Practice",
		severity: "Critical",
		title: "Literals First In Comparisons",
	},
	{
		ruleId: "PMD_MO",
		language: "java",
		badExample: `
		public class Alpha implements Run {
			public void run() {
			}
		}`,
		goodExample: `
		public class Alpha implements Run {
			@Override
			public void run() {
			}
		}`,
		description: "Annotating overridden methods with @Override helps refactoring and clarifies intent",
		category: "Best Practice",
		severity: "Minor",
		title: "Missing Override",
	},
	{
		ruleId: "PMD_UTWR",
		language: "java",
		badExample: `
		public class Try {
			public void run() {
				InputStream in = null;
				try {
					in = openInputStream();
					int i = in.read();
				} catch (IOException e) {
					e.printStackTrace();
				} finally {
					try {
						if (in != null) in.close();
					} catch (IOException ignored) {
						// ignored
					}
				}
			}
		}`,
		goodExample: `
		public class Try {
			public void run() {
				InputStream in = null;
				// better use try-with-resources
				try (InputStream in2 = openInputStream()) {
					int i = in2.read();
				}
			}
		}`,
		description: "Prefer usuing Try With Resources because ensures that each resource is closed at the end of the statement",
		category: "Best Practice",
		severity: "Minor",
		title: "Use Try With Resources",
	},
	{
		ruleId: "PMD_WLWLB",
		language: "java",
		badExample: `
		public class Alpha {
			{
			  while (false) { } // disallowed
			  do { } while (true); // disallowed
			  do { } while (false); // disallowed
			}
		  }`,
		goodExample: `
		public class Example {
			{
			  while (true) { } // allowed
			}
		  }`,
		description: "While loops that include literal booleans are redundant and should be avoided",
		category: "Best Practice",
		severity: "Minor",
		title: "While Loop With Literal Boolean",
	},
	{
		ruleId: "PMD_CSB",
		language: "java",
		badExample: `
		while (true)
  			x++;`,
		goodExample: `
		while (true) {
			x++;
		}`,
		description: "Enforce a policy for braces on control statements",
		category: "Code Style",
		severity: "Minor",
		title: "Control Statement Braces",
	},
	{
		ruleId: "PMD_ICB",
		language: "java",
		badExample: `
		try {
			// do something
		} catch (IllegalArgumentException e) {
			throw e;
		} catch (IllegalStateException e) {
			throw e;
		}`,
		goodExample: `
		try {
			// do something
		} catch (IllegalArgumentException | IllegalStateException e) {
			throw e;
		}`,
		description: "Prefer collapsing identical branches into a single multi-catch branch",
		category: "Code Style",
		severity: "Minor",
		title: "Identical Catch Branches",
	},
	{
		ruleId: "PMD_UAVE",
		language: "java",
		badExample: `
		@TestClassAnnotation(value = "TEST")
		public class Alpha {

			@TestMemberAnnotation(value = "TEST")
			private String alpha;

			@TestMethodAnnotation(value = "TEST")
			public void beta() {
				int gamma = 42;
				return;
			}
		}`,
		goodExample: `
		@TestClassAnnotation("TEST")
		public class Alpha {

			@TestMemberAnnotation("TEST")
			private String alpha;

			@TestMethodAnnotation("TEST")
			public void beta() {
				int gamma = 42;
				return;
			}
		}`,
		description: "Avoid the use of value in annotations when it's the only element",
		category: "Code Style",
		severity: "Minor",
		title: "Unnecessary Annotation Value Element",
	},
	{
		ruleId: "PMD_UnM",
		language: "java",
		badExample: `public interface Alpha {
			public abstract void alpha();
		}`,
		goodExample: `public interface Alpha {
			void alpha();
		}`,
		description: "There is no need to modify the interfaces and the annotations",
		category: "Code Style",
		severity: "Minor",
		title: "Unnecessary Modifier",
	},
	{
		ruleId: "PMD_USAI",
		language: "java",
		badExample: "Alpha[] x = new Alpha[] { ... };",
		goodExample: "Alpha[] x = { ... };",
		description: "Define the initial content of the array as a expression in curly braces",
		category: "Code Style",
		severity: "Minor",
		title: "Use Short Array Initializer",
	},
	{
		ruleId: "PMD_UUINL",
		language: "java",
		badExample: `
		public class Alpha {
			private int num = 1000000;
		}`,
		goodExample: `
		public class Alpha {
			private int num = 1_000_000;
		}`,
		description: "This rule enforces that numeric literals above a certain length should separate every third digit with an underscore",
		category: "Code Style",
		severity: "Minor",
		title: "Use Underscores In Numeric Literals",
	},
	{
		ruleId: "PMD_UQT",
		language: "java",
		badExample: `
		public class Alpha {
			private class Alpha2 {
				final Alpha2 Alpha2 = Alpha2.this;
			}
		}`,
		goodExample: `
		public class Alpha {
			private class Alpha2 {
				final Alpha myAlpha = Alpha.this;
			}
		}`,
		description: "Reports qualified this usages in the same class",
		category: "Code Style",
		severity: "Minor",
		title: "Useless Qualified This",
	},
	{
		ruleId: "PMD_AUEIS",
		language: "java",
		badExample: `
		public void foo() throws RuntimeException {
		}`,
		goodExample: "",
		description: "Document the exceptional cases with a @throws Javadoc tag, which allows being more descriptive",
		category: "Design",
		severity: "Minor",
		title: "Avoid Unchecked Exceptions In Signatures",
	},
	{
		ruleId: "PMD_CMMBP",
		language: "java",
		badExample: `
		public class Alpha implements Cloneable {
			@Override
			protected Alpha clone() {
			}
		}`,
		goodExample: `
		public class Alpha implements Cloneable {
			@Override
			public Object clone()
		}`,
		description: "Prefer using a public method for classes that implement this interface should override Object.clone",
		category: "Design",
		severity: "Minor",
		title: "Clone Method Must Be Public",
	},
	{
		ruleId: "PMD_CMRTMMCN",
		language: "java",
		badExample: `
		public class Alpha implements Cloneable {
			@Override
			protected Object beta() {
			}
		}`,
		goodExample: `
		public class Alpha implements Cloneable {
			@Override
			protected Alpha beta() { // Violation, Object must be Foo
			}
		}`,
		description: "If a class implements cloneable the return type of the method clone() must be the class name",
		category: "Design",
		severity: "Minor",
		title: "Clone Method Return Type Must Match Class Name",
	},
	{
		ruleId: "PMD_DTC",
		language: "java",
		badExample: `
		public class MyTest {
			@Test
			public void someTest() {
			}
		
			public void someOtherTest () {
			}
		
		}`,
		goodExample: `public class MyTest {
			@Test
			public void someTest() {
			}		
		}`,
		description: "The method appears to be a test case, but is a member of a class that has one or more JUnit test cases",
		category: "Design",
		severity: "Minor",
		title: "Detached Test Case",
	},
	{
		ruleId: "PMD_DNEJLT",
		language: "java",
		badExample: "",
		goodExample: "public class Alpha extends Throwable { }",
		description: "Extend Exception or RuntimeException instead of Throwable",
		category: "Design",
		severity: "Critical",
		title: "Do Not Extend Java Lang Throwable",
	},
	{
		ruleId: "PMD_DNTVM",
		language: "java",
		badExample: `
		public void alpha() {
			System.exit(0);
		}
		`,
		goodExample: `
		public void alpha() {
			Runtime.getRuntime().exit(0);
		}`,
		description: "Web applications should not call System.exit(), since only the web container or the application server should stop the JVM",
		category: "Design",
		severity: "Critical",
		title: "Do Not Terminate VM",
	},
	{
		ruleId: "PMD_ILMF",
		language: "java",
		badExample: `
		LOGGER.error("forget the arg {}");
		LOGGER.error("forget the arg %s");
		LOGGER.error("too many args {}", "arg1", "arg2");`,
		goodExample: "LOGGER.error(\"param {}\", \"arg1\", new IllegalStateException(\"arg\"));",
		description: "Check for messages in slf4j and log4j2 loggers with non matching number of arguments and placeholders",
		category: "Design",
		severity: "Minor",
		title: "Invalid Log Message Format",
	},
	{
		ruleId: "PMD_SMS",
		language: "java",
		badExample: `
		public static Singleton getInstance(Object obj){
			Singleton singleton = (Singleton) obj;
			return singleton;
		}`,
		goodExample: `
		public static Singleton getInstance( ) {
			return singleton;
		}`,
		description: "The instance created using the overloaded method is not cached and so, for each call and new objects will be created for every invocation",
		category: "Design",
		severity: "Major",
		title: "Single Method Singleton",
	},
	{
		ruleId: "PMD_SCRNI",
		language: "java",
		badExample: `
		class Singleton {
			private static Singleton instance = null;
			public static Singleton getInstance() {
				synchronized(Singleton.class) {
					return new Singleton();
				}
			}
		}`,
		goodExample: "",
		description: "getInstance method always creates a new object and hence does not comply to Singleton Design Pattern behaviour",
		category: "Design",
		severity: "Major",
		title: "Singleton Class Returning New Instance",
	},
	{
		ruleId: "PMD_USF",
		language: "java",
		badExample: `public class Alpha {
			private static final SimpleDateFormat sdf = new SimpleDateFormat();
			void alpha() {
				sdf.format();
			}
		}`,
		goodExample: `public class Alpha {
			private static final SimpleDateFormat sdf = new SimpleDateFormat();
			void alpha() {
				synchronized (sdf) {
					sdf.format();
				}
			}
		}`,
		description: "Static Formatter objects should be accessed in a synchronized manner",
		category: "Multithreading",
		severity: "Minor",
		title: "Unsynchronized Static Formatter",
	},
	{
		ruleId: "PMD_ACDC",
		language: "java",
		badExample: `
		public class DateAdd {
			private Date bad() {
				return Calendar.getInstance().getTime(); // now
			}
		}`,
		goodExample: `
		public class DateAdd {
			private Date good() {
				return new Date(); // now
			}
		}`,
		description: "Use new Date(), java.time.LocalDateTime.now() or ZonedDateTime.now()",
		category: "Performance",
		severity: "Minor",
		title: "Avoid Calendar Date Creation",
	},
	{
		ruleId: "PMD_AFS",
		language: "java",
		badExample: "FileInputStream fis = new FileInputStream(fileName);",
		goodExample: `
		try(InputStream is = Files.newInputStream(Paths.get(fileName))) {
		}`,
		description: "Avoid instantiating FileInputStream, FileOutputStream, FileReader, or FileWriter",
		category: "Performance",
		severity: "Critical",
		title: "Avoid File Stream",
	},
	{
		ruleId: "PMD_HCCK",
		language: "java",
		badExample: `
		public class Alpha {
			void bad() {
				SecretKeySpec secretKeySpec = new SecretKeySpec("my secret here".getBytes(), "AES");
			}
		}`,
		goodExample: `
		public class Alpha {
			void good() {
				SecretKeySpec secretKeySpec = new SecretKeySpec(Properties.getKey(), "AES");
			}
		}`,
		description: "Do not use hard coded encryption keys. Better store keys outside of source code",
		category: "Security",
		severity: "Critical",
		title: "Hard Coded Crypto Key",
	},
	{
		ruleId: "PMD_ICI",
		language: "java",
		badExample: `
		public class Alpha {
			void bad() {
				byte[] iv = new byte[] { 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, };
			}
		}`,
		goodExample: `
		public class Alpha {
			void good() {
				SecureRandom random = new SecureRandom();
				byte iv[] = new byte[16];
				random.nextBytes(bytes);
			}
		}`,
		description: "Do not use hard coded initialization vector in crypto operations. Better use a randomly generated IV",
		category: "Security",
		severity: "Critical",
		title: "Insecure Crypto Iv",
	},
	{
		ruleId: "E0103",
		language: "python",
		badExample: "\n\t\tdef check_value(value):\n\t\tif value > 10:\n\t\t\tcontinue\n\t\tprint(value)\n\n\n\t\tfor i in range(3):\n\t\t\tcheck_value(i)",
		goodExample: "\n\t\tfor i in range(3):\n\t\t\tif i == 2:\n\t\t\t\tcontinue\n\t\t\tprint(i)",
		description: "Break or continue keywords are used outside a loop",
		category: "Basic",
		severity: "Critical",
		title: "Not In Loop",
	},
	{
		ruleId: "E0102",
		language: "python",
		badExample: "\n\tdef greet():\n\t\tprint('Hello')\n\n\tdef greet():\n\t\tprint('Hi again')",
		goodExample: "\n\tdef say_hello():\n\t\tprint('Hello')\n\n\tdef say_goodbye():\n\t\tprint('Goodbye')",
		description: "A function / class / method is redefined",
		category: "Basic",
		severity: "Critical",
		title: "Function Redefined",
	},
	{
		ruleId: "E0116",
		language: "python",
		badExample: "\n\t\twhile running:\n\t\t\ttry:\n\t\t\t\tpass\n\t\t\tfinally:\n        \t\tcontinue  # [continue-in-finally]",
		goodExample: "\n\t\twhile running:\n    \t\ttry:\n        \t\tpass\n    \t\texcept KeyError:\n        \t\tpass\n    \t\telse:\n        \t\tcontinue",
		description: "Emitted when the `continue` keyword is found inside a `finally` clause, which is a `SyntaxError`",
		category: "Basic",
		severity: "Critical",
		title: "Continue In Finally",
	},
	{
		ruleId: "E0110",
		language: "python",
		badExample: "\n\t\timport abc\n\n\t\tclass Vehicle(abc.ABC):\n   \t\t\t@abc.abstractmethod\n    \t\tdef start_engine(self):\n        \t\tpass\n\n\t\tcar = Vehicle()  # [abstract-class-instantiated]",
		goodExample: "\n\t\timport abc\n\n\t\tclass Vehicle(abc.ABC):\n\t\t\t@abc.abstractmethod\n\t\t\tdef start_engine(self):\n\t\t\t\tpass\n\n\t\tclass Car(Vehicle):\n\t\t\tdef start_engine(self):\n\t\t\t\tprint(\"Vroom\")\n\n\t\tcar = Car()",
		description: "An abstract class with `abc.ABCMeta` or `abc.ABC` as metaclass has abstract methods and is instantiated",
		category: "Basic",
		severity: "Critical",
		title: "Abstract Class Instantiated",
	},
	{
		ruleId: "E0114",
		language: "python",
		badExample: "planets = *[\"Mercury\", \"Venus\", \"Earth\"]  # [star-needs-assignment-target]",
		goodExample: "mercury, *rest_of_planets = [\"Mercury\", \"Venus\", \"Earth\"]",
		description: "Can use starred expression only in assignment target. Emitted when a star expression is not used in an assignment target",
		category: "Basic",
		severity: "Critical",
		title: "Star Needs Assignment Target",
	},
	{
		ruleId: "E0108",
		language: "python",
		badExample: "\n\t\t\tdef get_animals(dog, cat, dog):  # [duplicate-argument-name]\n    \t\tpass",
		goodExample: "\n\t\t\tdef get_animals(dog, cat, bird):\n    \t\tpass",
		description: "Duplicate argument names in function definitions are syntax errors",
		category: "Basic",
		severity: "Critical",
		title: "Duplicate Argument Name",
	},
	{
		ruleId: "E0101",
		language: "python",
		badExample: "\n\t\tclass Multiply:\n   \t\t\t def __init__(self, x, y):  # [return-in-init]\n        \t\treturn x * y",
		goodExample: "\n\t\tclass Multiply:\n    \t\tdef __init__(self, x, y) -> None:\n        \t\tself.product = x * y",
		description: "Explicit return in `__init__` Used when the special class method `__init__` has an explicit return value. `__init__` magic method is a constructor of an instance, so it should construct it but not return anything.",
		category: "Basic",
		severity: "Critical",
		title: "Return In Init",
	},
	{
		ruleId: "E0112",
		language: "python",
		badExample: "*dogs, *cats = [\"Labrador\", \"Poodle\", \"Sphynx\"]  # [too-many-star-expressions]",
		goodExample: "*labrador_and_poodle, sphynx = [\"Labrador\", \"Poodle\", \"Sphynx\"]",
		description: "More than one starred expression in assignment. Emitted when there are more than one starred expressions (`*x`) in an assignment. This is a `SyntaxError`",
		category: "Basic",
		severity: "Critical",
		title: "Too Many Star Expressions",
	},
	{
		ruleId: "E0115",
		language: "python",
		badExample: "\n\t\tVALUE = 100\n\n\t\tdef update_value(new_value):  # [nonlocal-and-global]\n\t\t\tglobal VALUE\n\t\t\tnonlocal VALUE\n\t\t\tVALUE = new_value\n\t\t\tprint(f\"Updated global value: {VALUE}\")\n\n\t\tupdate_value(200)",
		goodExample: "\n\t\tVALUE = 100\n\n\t\tdef update_value(new_value):\n\t\t\tglobal VALUE\n\t\t\tVALUE = new_value\n\t\t\tprint(f\"Updated global value: {VALUE}\")\n\n\t\tupdate_value(200)",
		description: "Emitted when a name is both `nonlocal` and `global`",
		category: "Basic",
		severity: "Critical",
		title: "Nonlocal And Global",
	},
	{
		ruleId: "E0118",
		language: "python",
		badExample: "\n\t\tFRUIT = \"apple\"\n\n\t\tdef update_fruit():\n\t\t\tprint(FRUIT)  # [used-prior-global-declaration]\n\t\t\tglobal FRUIT\n    \t\tFRUIT = \"orange\"",
		goodExample: "\n\t\tFRUIT = \"apple\"\n\n\t\tdef update_fruit():\n\t\t\tglobal FRUIT\n\t\t\tFRUIT = \"banana\"",
		description: "Emitted when a name is used prior a `global` declaration, which results in an error since Python 3.6. It can't be emitted when using Python < 3.6",
		category: "Basic",
		severity: "Critical",
		title: "Used Prior Global Declaration",
	},
	{
		ruleId: "E0104",
		language: "python",
		badExample: "x = 5  # [assignment-outside-function]",
		goodExample: "\n\t\tdef assign_value():\n    \t\tx = 5",
		description: "An assignment is found outside a function or method",
		category: "Basic",
		severity: "Critical",
		title: "Assignment Outside Function",
	},
	{
		ruleId: "E0106",
		language: "python",
		badExample: "",
		goodExample: "\n\t\tdef yield_items():\n    \t\tfor item in ['a', 'b', 'c']:\n        \t\tyield item\n        \t\treturn \"Finished!\"  # This was not allowed in Python 3.3 and earlier.",
		description: "A `return` statement with an argument is found in a generator function or method. It's allowed in Python >= 3.3 but wasn't allowed earlier.",
		category: "Basic",
		severity: "Critical",
		title: "Return Arg In Generator",
	},
	{
		ruleId: "E0113",
		language: "python",
		badExample: "*numbers = [1, 2, 3]  # [invalid-star-assignment-target]",
		goodExample: "numbers = [1, 2, 3]",
		description: "Starred assignment target must be in a `list` or `tuple`. Error occurs when using a star expression in invalid contexts.",
		category: "Basic",
		severity: "Critical",
		title: "Invalid Star Assignment Target",
	},
	{
		ruleId: "E0111",
		language: "python",
		badExample: "reversed(1234)  # [bad-reversed-sequence]",
		goodExample: "reversed([1, 2, 3, 4])",
		description: "The argument passed to `reversed()` is not a sequence. This error occurs when a non-iterable type is passed to `reversed()`.",
		category: "Basic",
		severity: "Critical",
		title: "Bad Reversed Sequence",
	},
	{
		ruleId: "E0107",
		language: "python",
		badExample: "\n\t\tx = 0\n\n\t\twhile x < 5:\n    \t\tprint(x)\n    \t\t++x  # [nonexistent-operator]",
		goodExample: "\n\t\tx = 0\n\n\t\twhile x < 5:\n\t\t\tprint(x)\n\t\t\tx += 1",
		description: "Attempting to use C-style increment or decrement operators (`++` or `--`), which are not valid in Python.",
		category: "Basic",
		severity: "Critical",
		title: "Nonexistent Operator",
	},
	{
		ruleId: "E0105",
		language: "python",
		badExample: "\n\t\tfor i in range(5):\n   \t\t\tyield i  # [yield-outside-function]",
		goodExample: "\n\t\tdef range_yield():\n    \t\tfor i in range(5):\n        \t\tyield i",
		description: "A `yield` statement is found outside a function or method, which is invalid.",
		category: "Basic",
		severity: "Critical",
		title: "Yield Outside Function",
	},
	{
		ruleId: "E0100",
		language: "python",
		badExample: "\n\t\tclass Animal:\n   \t\t\tdef __init__(self, names):  # [init-is-generator]\n        \t\tyield from names\n\n\t\tcat = Animal([\"Tom\", \"Jerry\"])",
		goodExample: "\n\t\tclass Animal:\n   \t\t\tdef __init__(self, names):\n        \t\tself.names = names\n\n    \t\tdef get_names(self):\n        \t\tyield from self.names\n\n\t\tcat = Animal([\"Tom\", \"Jerry\"])\n\t\tfor name in cat.get_names():\n\t\t\tpass\n\t\t",
		description: "The special method `__init__` is turned into a generator, which is incorrect. `__init__` cannot contain `yield`.",
		category: "Basic",
		severity: "Critical",
		title: "Init Is Generator",
	},
	{
		ruleId: "E0119",
		language: "python",
		badExample: "print('Hello {}').format('World')  # [misplaced-format-function]",
		goodExample: "print('Hello {}'.format('World'))",
		description: "The `format()` function is not called on a string object directly, causing an error.",
		category: "Basic",
		severity: "Critical",
		title: "Misplaced Format Function",
	},
	{
		ruleId: "E0117",
		language: "python",
		badExample: "\n\t\tclass Animal:\n   \t\t\tdef get_sound(self):\n        \t\tnonlocal sounds  # [nonlocal-without-binding]",
		goodExample: "\n\t\tclass Animal:\n    \t\tsounds = [\"bark\", \"meow\"]\n\n    \t\tdef get_sound(self):\n        \t\tnonlocal sounds",
		description: "Emitted when a `nonlocal` variable does not have an attached name somewhere in the parent scopes",
		category: "Basic",
		severity: "Critical",
		title: "Nonlocal Without Binding",
	},
	{
		ruleId: "W0150",
		language: "python",
		badExample: "\n\t\tclass InfinityError(ArithmeticError):\n    \t\tdef __init__(self):\n        \t\tuper().__init__(\"You can't reach infinity!\")\n\n\t\t\tdef calculate_division(dividend: float, divisor: float) -> float:\n\t\t\t\ttry:\n\t\t\t\t\treturn dividend / divisor\n\t\t\t\texcept ArithmeticError as e:\n\t\t\t\t\traise InfinityError() from e\n\t\t\t\tfinally:\n\t\t\t\t\treturn float('inf')  # [lost-exception]",
		goodExample: "\n\t\tclass InfinityError(ArithmeticError):\n    \t\tdef __init__(self):\n        \t\tsuper().__init__(\"You can't reach infinity!\")\n\n\t\t\tdef calculate_division(dividend: float, divisor: float) -> float:\n\t\t\t\ttry:\n\t\t\t\t\treturn dividend / divisor\n\t\t\t\texcept ArithmeticError as e:\n\t\t\t\t\traise InfinityError() from e",
		description: "A break or a return statement is found inside the finally clause of a `try`...`finally` block, the exceptions raised in the `try` clause will be silently swallowed instead of being re-raised",
		category: "Basic",
		severity: "Critical",
		title: "Lost Exception",
	},
	{
		ruleId: "W0199",
		language: "python",
		badExample: "assert (42, None)  # [assert-on-tuple]",
		goodExample: "\n\t\tval1, val2 = (42, None)\n\t\tassert val1\n\t\tassert val2",
		description: "A call of `assert` on a `tuple` will always evaluate to true if the `tuple` is not empty, and will always evaluate to false if it is",
		category: "Basic",
		severity: "Critical",
		title: "Assert On Tuple",
	},
	{
		ruleId: "W0129",
		language: "python",
		badExample: "\n\t\tdef test_multiplication():\n\t\t\ta = 4 * 5\n\t\t\tassert \"No MultiplicationError were raised\"  # [assert-on-string-literal]",
		goodExample: "\n\t\tdef test_multiplication():\n\t\t\ta = 4 * 5\n\t\t\tassert a == 20",
		description: "When an assert statement has a string literal as its first argument, which will cause the assert to always pass",
		category: "Basic",
		severity: "Major",
		title: "Assert On String Literal",
	},
	{
		ruleId: "W0127",
		language: "python",
		badExample: "\n\t\ttemperature = 100\n\t\ttemperature = temperature  # [self-assigning-variable]",
		goodExample: "temperature = 100",
		description: "Emitted when we detect that a variable is assigned to itself",
		category: "Basic",
		severity: "Major",
		title: "Self Assigning Variable",
	},
	{
		ruleId: "W0143",
		language: "python",
		badExample: "\n\t\tdef function_returning_a_number() -> int:\n    \t\treturn 42\n\n\n\t\tdef is_forty_two(num: int = 21):\n\t\t\t# 21 == <function function_returning_a_number at 0x7f343ff0a1f0>\n\t\t\treturn num == function_returning_a_number  # [comparison-with-callable]",
		goodExample: "\n\t\tdef function_returning_a_number() -> int:\n    \t\treturn 42\n\n\t\tdef is_forty_two(num: int = 21):\n\t\t\t# 21 == 42\n\t\t\treturn num == function_returning_a_number()",
		description: "This message is emitted when pylint detects that a comparison with a callable was made, which might suggest that some parenthesis were omitted, resulting in potential unwanted behavior",
		category: "Basic",
		severity: "Major",
		title: "Comparison With Callable",
	},
	{
		ruleId: "W0102",
		language: "python",
		badExample: "\n\t\tdef whats_in_the_bag(items=[]):  # [dangerous-default-value]\n\t\t\titems.append(\"book\")\n\t\t\treturn items",
		goodExample: "\n\t\tdef whats_in_the_bag(items=None):\n\t\t\tif items is None:\n\t\t\t\titems = []\n\t\t\titems.append(\"book\")\n\t\t\treturn items",
		description: "A mutable value as list or dictionary is detected in a default value for an argument",
		category: "Basic",
		severity: "Major",
		title: "Dangerous Default Value",
	},
	{
		ruleId: "W0109",
		language: "python",
		badExample: "exam_scores = {\"English\": 80, \"Physics\": 85, \"English\": 90}  # [duplicate-key]",
		goodExample: "exam_scores = {\"English\": 80, \"Physics\": 85, \"Chemistry\": 90}",
		description: "A dictionary expression binds the same key multiple times",
		category: "Basic",
		severity: "Major",
		title: "Duplicate Key",
	},
	{
		ruleId: "W0120",
		language: "python",
		badExample: "\n\t\tdef find_positive_number(numbers):\n\t\t\tfor x in numbers:\n\t\t\t\tif x > 0:\n\t\t\t\t\treturn x\n\t\t\telse:  # [useless-else-on-loop]\n\t\t\t\tprint(\"Did not find a positive number\")",
		goodExample: "\n\t\tdef find_positive_number(numbers):\n\t\t\tfor x in numbers:\n\t\t\t\tif x > 0:\n\t\t\t\t\treturn x\n\t\t\tprint(\"Did not find a positive number\")",
		description: "Loops should only have an else clause if they can exit early with a break statement, otherwise the statements under else should be on the same scope as the loop itself",
		category: "Basic",
		severity: "Major",
		title: "Useless Else On Loop",
	},
	{
		ruleId: "W0106",
		language: "python",
		badExample: "float(3.14) == \"3.14\"  # [expression-not-assigned]",
		goodExample: "is_equal: bool = float(3.14) == \"3.14\"",
		description: "An expression that is not a function call is assigned to nothing. Probably something else was intended",
		category: "Basic",
		severity: "Major",
		title: "Expression Not Assigned",
	},
	{
		ruleId: "W0124",
		language: "python",
		badExample: "\n\t\twith open(\"data.txt\", \"r\") as f1, f2:  # [confusing-with-statement]\n    \t\tpass",
		goodExample: "\n\t\twith open(\"data.txt\", \"r\", encoding=\"utf8\") as f1:\n\t\t\twith open(\"log.txt\", \"w\", encoding=\"utf8\") as f2:\n\t\t\t\tpass",
		description: "Emitted when a `with` statement component returns multiple values and uses name binding with `as` only for a part of those values, as in with `ctx()` as `a, b`. This can be misleading, since it's not clear if the context manager returns a tuple or if the node without a name binding is another context manager",
		category: "Basic",
		severity: "Major",
		title: "Confusing With Statement",
	},
	{
		ruleId: "W0108",
		language: "python",
		badExample: "df.map(lambda x: x.upper())  # [unnecessary-lambda]",
		goodExample: "df.map(str.upper)",
		description: "The body of a lambda expression is a function call on the same argument list as the lambda itself. Such lambda expressions are in all but a few cases replaceable with the function being called in the body of the lambda",
		category: "Basic",
		severity: "Major",
		title: "Unnecessary Lambda",
	},
	{
		ruleId: "W0111",
		language: "python",
		badExample: "",
		goodExample: "",
		description: "`async` and `await` are reserved Python keywords in Python >= 3.6 versions",
		category: "Basic",
		severity: "Major",
		title: "Assign To New Keyword",
	},
	{
		ruleId: "W0128",
		language: "python",
		badExample: "ITEM, ITEM = ('apple', 'banana')  # [redeclared-assigned-name]",
		goodExample: "ITEM1, ITEM2 = ('apple', 'banana')",
		description: "Emitted when we detect that a variable was redeclared in the same assignment",
		category: "Basic",
		severity: "Major",
		title: "Redeclared Assigned Name",
	},
	{
		ruleId: "W0104",
		language: "python",
		badExample: "[4, 5, 6]  # [pointless-statement]",
		goodExample: "\n\t\tNUMS = [4, 5, 6]\n\t\tprint(NUMS)",
		description: "A statement doesn't have (or at least seems to) any effect",
		category: "Basic",
		severity: "Major",
		title: "Pointless Statement",
	},
	{
		ruleId: "W0105",
		language: "python",
		badExample: "\n\t\t\"\"\"Function to calculate sum\"\"\"\n\t\t\"\"\"Another pointless string statement\"\"\"  # [pointless-string-statement]",
		goodExample: "\n\t\t\"\"\"Function to calculate sum\"\"\"\n\t\t# A comment explaining the logic used in summing.",
		description: "A string is used as a statement (which of course has no effect). This is a particular case of W0104 with its own message so you can easily disable it if you're using those strings as documentation, instead of comments",
		category: "Basic",
		severity: "Major",
		title: "Pointless String Statement",
	},
	{
		ruleId: "W0107",
		language: "python",
		badExample: "\n\t\tclass ValidationError(Exception):\n    \t\t\"\"\"This exception is raised for invalid inputs.\"\"\"\n\n   \t\t\tpass  # [unnecessary-pass]",
		goodExample: "\n\t\tclass ValidationError(Exception):\n   \t\t\t\"\"\"This exception is raised for invalid inputs.\"\"\"",
		description: "A `pass` statement that can be avoided is encountered",
		category: "Basic",
		severity: "Major",
		title: "Unnecessary Pass",
	},
	{
		ruleId: "W0101",
		language: "python",
		badExample: "\n\t\tdef greet_user():\n\t\t\treturn True\n\t\t\tprint(\"Welcome!\")  # [unreachable]",
		goodExample: "\n\t\tdef greet_user():\n\t\t\tprint(\"Welcome!\")\n\t\t\treturn True",
		description: "There is some code behind a `return` or `raise` statement, which will never be accessed",
		category: "Basic",
		severity: "Major",
		title: "Unreachable",
	},
	{
		ruleId: "W0123",
		language: "python",
		badExample: "eval(\"{1: 'a', 2: 'b'}\")  # [eval-used]",
		goodExample: "\n\t\tfrom ast import literal_eval\n\t\tliteral_eval(\"{1: 'a', 2: 'b'}\")",
		description: "You use the `eval` function, to discourage its usage. Consider using `ast.literal_eval` for safely evaluating strings containing Python expressions from untrusted sources",
		category: "Basic",
		severity: "Major",
		title: "Eval Used",
	},
	{
		ruleId: "W0122",
		language: "python",
		badExample: "\n\t\tuser_input = \"John\"\n\t\tcode = f\"\"\"eval(input('Execute this code, {user_input}: '))\"\"\"\n\t\tresult = exec(code)  # [exec-used]\n\t\texec(result)  # [exec-used]",
		goodExample: "\n\t\tdef get_user_input(name):\n    \t\treturn input(f\"Enter code for execution, {name}: \")\n\n\t\tuser_input = \"John\"\n\t\tallowed_globals = {\"__builtins__\": None}\n\t\tallowed_locals = {\"print\": print}\n\t\t# pylint: disable-next=exec-used\n\t\texec(get_user_input(user_input), allowed_globals, allowed_locals)",
		description: "You use the `exec` statement (function for Python 3), to discourage its usage. That doesn't mean you cannot use it! It's dangerous to use this function for a user input",
		category: "Basic",
		severity: "Major",
		title: "Exec Used",
	},
	{
		ruleId: "W0125",
		language: "python",
		badExample: "\n\t\tif False:  # [using-constant-test]\n\t\t\tprint(\"Will never run.\")\n\t\tif True:  # [using-constant-test]\n\t\t\tprint(\"Will always run.\")",
		goodExample: "print(\"This statement is executed.\")",
		description: "Emitted when a conditional statement (If or ternary if) uses a constant value for its test",
		category: "Basic",
		severity: "Major",
		title: "Using Constant Test",
	},
	{
		ruleId: "W0126",
		language: "python",
		badExample: "\n\t\timport random\n\n\t\tdef is_sunny():\n    \t\treturn random.choice([True, False])\n\n\n\t\tif is_sunny:  # [missing-parentheses-for-call-in-test]\n    \t\tprint(\"It is sunny!\")",
		goodExample: "\n\t\timport random\n\n\t\tdef is_sunny():\n    \t\treturn random.choice([True, False])\n\n\n\t\tif is_sunny():\n    \t\tprint(\"It is sunny!\")",
		description: "Emitted when a conditional statement (If or ternary if) seems to wrongly call a function due to missing parentheses",
		category: "Basic",
		severity: "Major",
		title: "Missing Parentheses For Call In Test",
	},
	{
		ruleId: "R0123",
		language: "python",
		badExample: "\n\t\tdef is_a_banana(fruit):\n    \t\treturn fruit is \"banana\"  # [literal-comparison]",
		goodExample: "\n\t\tdef is_a_banana(fruit):\n    \t\treturn fruit == \"banana\"",
		description: "Comparing an object to a literal, which is usually what you do not want to do, since you can compare to a different literal than what was expected altogether",
		category: "Basic",
		severity: "Major",
		title: "Literal Comparison",
	},
	{
		ruleId: "R0124",
		language: "python",
		badExample: "\n\t\tdef is_a_banana(fruit):\n\t\t\ta_banana = \"banana\"\n\t\t\treturn fruit == fruit  # [comparison-with-itself]",
		goodExample: "\n\t\tdef is_a_banana(fruit):\n\t\t\ta_banana = \"banana\"\n\t\t\treturn a_banana == fruit",
		description: "Something is compared against itself",
		category: "Basic",
		severity: "Minor",
		title: "Comparison With Itself",
	},
	{
		ruleId: "C0144",
		language: "python",
		badExample: "",
		goodExample: "",
		description: "Name contains at least one non-ASCII unicode character",
		category: "Basic",
		severity: "Minor",
		title: "Non Ascii Name",
	},
	{
		ruleId: "C0103",
		language: "python",
		badExample: "\n\t\tclass dog:  # [invalid-name]\n   \t\t\tdef Bark(self, NUMBER_OF_BARK):  # [invalid-name, invalid-name]\n\t\t\t\tprint(\"Bark\" * NUMBER_OF_BARK)\n\t\t\t\treturn NUMBER_OF_BARK\n\n\t\tDog = dog().Bark(10)  # [invalid-name]",
		goodExample: "\n\t\tclass Dog:\n    \t\tdef bark(self, number_of_bark):\n\t\t\tprint(\"Bark\" * number_of_bark)\n\t\t\treturn number_of_bark\n\n\t\tDOG = Dog().bark(10)",
		description: "The name doesn't conform to naming rules associated to its type (constant, variable, class...)",
		category: "Basic",
		severity: "Minor",
		title: "Invalid Name",
	},
	{
		ruleId: "C0102",
		language: "python",
		badExample: "",
		goodExample: "",
		description: "The name is listed in the black list (unauthorized names)",
		category: "Basic",
		severity: "Minor",
		title: "Blacklisted Name",
	},
	{
		ruleId: "C0121",
		language: "python",
		badExample: "\n\t\tlights_on = False\n\t\tif lights_on == False:  # [singleton-comparison]\n    \t\tprint(\"Lights are off.\")",
		goodExample: "\n\t\tlights_on = False\n\t\tif not lights_on:\n\t\t\tprint(\"Lights are off.\")",
		description: "An expression is compared to singleton values like True, False or None",
		category: "Basic",
		severity: "Minor",
		title: "Singleton Comparison",
	},
	{
		ruleId: "C0122",
		language: "python",
		badExample: "",
		goodExample: "",
		description: "The constant is placed on the left side of a comparison. It is usually clearer in intent to place it in the right hand side of the comparison",
		category: "Basic",
		severity: "Minor",
		title: "Misplaced Comparison Constant",
	},
	{
		ruleId: "C0112",
		language: "python",
		badExample: "\n\t\tdef bar():  # [empty-docstring]\n    \t\t\"\"\"\"\"\"",
		goodExample: "\n\t\tdef bar():\n   \t\t\t\"\"\"A simple function.\"\"\"",
		description: "A module, function, class or method has an empty docstring (it would be too easy)",
		category: "Basic",
		severity: "Minor",
		title: "Empty Docstring",
	},
	{
		ruleId: "C0115",
		language: "python",
		badExample: "\n\t\tclass Car:  # [missing-class-docstring]\n   \t\t\tdef __init__(self, make, model):\n\t\t\t\tself.make = make\n\t\t\t\tself.model = model",
		goodExample: "\n\t\tclass Car:\n   \t\t\"\"\"Class representing a car\"\"\"\n\n\t\t\tdef __init__(self, make, model):\n\t\t\t\tself.make = make\n\t\t\t\tself.model = model",
		description: "A class has no docstring. Even an empty class must have a docstring",
		category: "Basic",
		severity: "Minor",
		title: "Missing Class Docstring",
	},
	{
		ruleId: "C0116",
		language: "python",
		badExample: "\n\t\timport os\n\n\t\tdef list_files():  # [missing-function-docstring]\n\t\t\tprint(os.listdir())",
		goodExample: "\n\t\timport os\n\n\t\tdef list_files():\n\t\t\t\"\"\"Function listing files in the current directory.\"\"\"\n\t\t\tprint(os.listdir())",
		description: "Missing function or method docstring used when a function or method has no docstring. Some special methods like `__init__`, protected, private functions, setters and deleters do not require a docstring. It's a good practice to describe what a function does for other programmers",
		category: "Basic",
		severity: "Minor",
		title: "Missing Function Docstring",
	},
	{
		ruleId: "C0114",
		language: "python",
		badExample: "\n\t\timport json  # [missing-module-docstring]\n\n\t\tdef parse_json(data):\n\t\t\treturn json.loads(data)",
		goodExample: "\n\t\t\"\"\"Module providing a function for parsing JSON data.\"\"\"\n\n\t\timport json\n\n\t\tdef parse_json(data):\n\t\t\treturn json.loads(data)",
		description: "A module has no docstring. Empty modules do not require a docstring",
		category: "Basic",
		severity: "Minor",
		title: "Missing Module Docstring",
	},
	{
		ruleId: "C0123",
		language: "python",
		badExample: "\n\t\tdata = [1, 2, 3]\n\t\tif type(data) is list:  # [unidiomatic-typecheck]\n\t\t\tpass",
		goodExample: "\n\t\tdata = [1, 2, 3]\n\t\tif isinstance(data, list):\n\t\t\tpass",
		description: "Using `type()` instead of `isinstance()` for a type check. The idiomatic way to perform an explicit type check in Python is to use `isinstance(x, y)` rather than `type(x) == Y`, `type(x) is Y`. Though there are unusual situations where these give different results",
		category: "Basic",
		severity: "Minor",
		title: "Unidiomatic Typecheck",
	},
	{
		ruleId: "E0203",
		language: "python",
		badExample: "\n\t\tclass Robot:\n   \t\tdef __init__(self, power_level):\n\t\t\tif self.power_level > 100:  # [access-member-before-definition]\n\t\t\t\tprint(\"Power Overload!\")\n\t\t\tself.power_level = power_level",
		goodExample: "\n\t\tclass Robot:\n    \t\tdef __init__(self, power_level):\n\t\t\tself.power_level = power_level\n\t\t\tif self.power_level > 100:\n\t\t\t\tprint(\"Power Overload!\")",
		description: "An instance member is accessed before it's actually assigned",
		category: "Classes",
		severity: "Minor",
		title: "Access Member Before Definition",
	},
	{
		ruleId: "E0202",
		language: "python",
		badExample: "\n\t\tclass Plant:\n\t\t\tdef __init__(self, nutrients):\n\t\t\t\tself.nutrients = nutrients\n\n\t\t\tdef nutrients(self):  # [method-hidden]\n\t\t\t\tpass",
		goodExample: "\n\t\tclass Plant:\n\t\t\tdef __init__(self, nutrients):\n\t\t\t\tself.nutrients = nutrients\n\n\t\t\tdef water_supply(self):\n\t\t\t\tpass",
		description: "A class defines a method which is hidden by an instance attribute from an ancestor class or set by some client code",
		category: "Classes",
		severity: "Minor",
		title: "Method Hidden",
	},
	{
		ruleId: "E0237",
		language: "python",
		badExample: "\n\t\tclass Worker:\n    \t\t__slots__ = (\"name\",)\n\n\t\t\tdef __init__(self, name, position):\n\t\t\t\tself.name = name\n\t\t\t\tself.position = position  # [assigning-non-slot]\n\t\t\t\tself.initialize()",
		goodExample: "\n\t\tclass Worker:\n   \t\t\t__slots__ = (\"name\", \"position\")\n\n\t\t\tdef __init__(self, name, position):\n\t\t\t\tself.name = name\n\t\t\t\tself.position = position\n\t\t\t\tself.initialize()",
		description: "Assigning to an attribute not defined in the class slots",
		category: "Classes",
		severity: "Minor",
		title: "Assigning Non Slot",
	},
	{
		ruleId: "E0241",
		language: "python",
		badExample: "\n\t\tclass Vehicle:\n    \tpass\n\n\t\tclass Bike(Vehicle, Vehicle):  # [duplicate-bases]\n\t\tpass",
		goodExample: "\n\t\tclass Vehicle:\n    \tpass\n\n\t\tclass Bike(Vehicle):\n\t\tpass\n\n\t\tclass Truck(Vehicle):\n\t\tpass",
		description: "A class has duplicate bases",
		category: "Classes",
		severity: "Minor",
		title: "Duplicate Bases",
	},
	{
		ruleId: "E0240",
		language: "python",
		badExample: "\n\t\tclass X:\n    \t\tpass\n\n\t\tclass Y(X):\n\t\t\tpass\n\n\t\tclass Z(X, Y):  # [inconsistent-mro]\n\t\t\tpass",
		goodExample: "\n\t\tclass X:\n    \t\tpass\n\n\t\tclass Y(X):\n    \t\tpass\n\n\t\tclass Z(Y):  # or 'Y, X' but not 'X, Y'\n    \t\tpass",
		description: "A class has an inconsistent method resolution order",
		category: "Classes",
		severity: "Minor",
		title: "Inconsistent Mro",
	},
	{
		ruleId: "E0239",
		language: "python",
		badExample: "\n\t\tclass Animal(str):  # [inherit-non-class]\n    \t\tpass",
		goodExample: "\n\t\tclass Animal:\n    \t\tdef __str__(self):\n        \tpass",
		description: "A class inherits from something which is not a class",
		category: "Classes",
		severity: "Minor",
		title: "Inherit Non Class",
	},
	{
		ruleId: "E0238",
		language: "python",
		badExample: "\n\t\tclass Vehicle:  # [invalid-slots]\n    \t\t__slots__ = True",
		goodExample: "\n\t\tclass Vehicle:\n    \t\t__slots__ = (\"make\", \"model\")\n",
		description: "An invalid `__slots__` is found in class. Only a string, an iterable or a sequence is permitted",
		category: "Classes",
		severity: "Minor",
		title: "Invalid Slots",
	},
	{
		ruleId: "E0236",
		language: "python",
		badExample: "\n\t\tclass Animal:\n    \t\t__slots__ = (\"species\", 5)  # [invalid-slots-object]",
		goodExample: "\n\t\tclass Animal:\n   \t\t\t__slots__ = (\"species\", \"breed\")",
		description: "An invalid (non-string) object occurs in `__slots__`",
		category: "Classes",
		severity: "Minor",
		title: "Invalid Slots Object",
	},
	{
		ruleId: "E0211",
		language: "python",
		badExample: "\n\t\tclass Dog:\n    \t\tdef bark():  # [no-method-argument]\n        \t\tprint(\"woof\")",
		goodExample: "\n\t\tclass Dog:\n    \t\tdef bark(self):\n        \t\tprint(\"woof\")",
		description: "A method which should have the bound instance as first argument has no argument defined",
		category: "Classes",
		severity: "Minor",
		title: "No Method Argument",
	},
	{
		ruleId: "E0213",
		language: "python",
		badExample: "\n\t\tclass Book:\n    \t\tdef __init__(this, title):  # [no-self-argument]\n        \t\tthis.title = title",
		goodExample: "\n\t\tclass Book:\n    \t\tdef __init__(self, title):\n        \t\tself.title = title",
		description: "A method has an attribute different the \"self\" as first argument. This is considered as an error since this is a so common convention that you shouldn't break it!",
		category: "Classes",
		severity: "Minor",
		title: "No Self Argument",
	},
	{
		ruleId: "E0302",
		language: "python",
		badExample: "\n\t\tclass FileHandler:\n    \t\tdef __enter__(self, filepath):  # [unexpected-special-method-signature]\n        \t\tpass\n\n    \t\tdef __exit__(self, exception):  # [unexpected-special-method-signature]\n        \t\tpass",
		goodExample: "\n\t\tclass FileHandler:\n    \t\tdef __enter__(self):\n        \t\tpass\n\n    \t\tdef __exit__(self, exc_type, exc_value, traceback):\n        \t\tpass",
		description: "Emitted when a special method was defined with an invalid number of parameters. If it has too few or too many, it might not work at all",
		category: "Classes",
		severity: "Minor",
		title: "Unexpected Special Method Signature",
	},
	{
		ruleId: "E0242",
		language: "python",
		badExample: "\n\t\tclass Robot:\n    \t\t# +1: [class-variable-slots-conflict]\n\t\t\t__slots__ = (\"model\", \"year\", \"shutdown\")\n\t\t\tmodel = None\n\n\t\t\tdef __init__(self, model, year):\n\t\t\t\tself.model = model\n\t\t\t\tself.year = year\n\n\t\t\t@property\n\t\t\tdef year(self):\n\t\t\t\treturn self.year\n\n\t\t\tdef shutdown(self):\n\t\t\t\tprint(\"Shutting down...\")",
		goodExample: "\n\t\tclass Robot:\n\t\t\t__slots__ = (\"_year\", \"model\")\n\n\t\t\tdef __init__(self, model, year):\n\t\t\t\tself._year = year\n\t\t\t\tself.model = model\n\n\t\t\t@property\n\t\t\tdef year(self):\n\t\t\t\treturn self._year\n\n\t\t\tdef shutdown(self):\n\t\t\t\tprint(\"Shutting down...\")",
		description: "A value in __slots__ conflicts with a class variable, property or method",
		category: "Classes",
		severity: "Critical",
		title: "Class Variable Slots Conflict",
	},
	{
		ruleId: "E0304",
		language: "python",
		badExample: "\n\t\tclass LightSwitch:\n\t\t\t\"\"\"__bool__ returns a string\"\"\"\n\n\t\t\tdef __bool__(self):  # [invalid-bool-returned]\n\t\t\t\treturn \"on\"",
		description: "__bool__ does not return bool Used when a __bool__ method returns something which is not a bool",
		category: "Classes",
		severity: "Critical",
		title: "Invalid Bool Returned",
	},
	{
		ruleId: "E0308",
		language: "python",
		badExample: "\n\t\tclass DataPacket:\n\t\t\t\"\"\"__bytes__ returns <type 'list'>\"\"\"\n\n\t\t\tdef __bytes__(self):  # [invalid-bytes-returned]\n\t\t\t\treturn [1, 2, 3]",
		goodExample: "\n\t\tclass DataPacket:\n\t\t\t\"\"\"__bytes__ returns <type 'bytes'>\"\"\"\n\n\t\t\tdef __bytes__(self):\n\t\t\t\treturn b\"data\"",
		description: "__bytes__ does not return bytes Used when a __bytes__ method returns something which is not bytes",
		category: "Classes",
		severity: "Critical",
		title: "Invalid Bytes Returned",
	},
	{
		ruleId: "E0311",
		language: "python",
		badExample: "\n\t\tclass Temperature:\n\t\t\t\"\"\"__format__ returns <type 'float'>\"\"\"\n\n\t\t\tdef __format__(self, format_spec):  # [invalid-format-returned]\n\t\t\t\treturn 98.6",
		goodExample: "\n\t\tclass Temperature:\n\t\t\t\"\"\"__format__ returns <type 'str'>\"\"\"\n\n\t\t\tdef __format__(self, format_spec):\n\t\t\t\treturn \"98.6°F\"",
		description: "__format__ does not return str Used when a __format__ method returns something which is not a string",
		category: "Classes",
		severity: "Critical",
		title: "Invalid Format Returned",
	},
	{
		ruleId: "E0312",
		language: "python",
		badExample: "\n\t\tclass CustomGetNewArgs:\n\t\t\t\"\"\"__getnewargs__ returns a string\"\"\"\n\n\t\t\tdef __getnewargs__(self):  # [invalid-getnewargs-returned]\n\t\t\t\treturn 'abc'",
		goodExample: "\n\t\tclass CustomGetNewArgs:\n\t\t\t\"\"\"__getnewargs__ returns <type 'tuple'>\"\"\"\n\n\t\t\tdef __getnewargs__(self):\n\t\t\t\treturn ('abc', 'def')",
		description: "__getnewargs__ does not return a tuple. Used when a __getnewargs__ method returns something which is not a tuple",
		category: "Classes",
		severity: "Critical",
		title: "Invalid Getnewargs Returned",
	},
	{
		ruleId: "E0313",
		language: "python",
		badExample: "\n\t\tclass CustomGetNewArgsEx:\n\t\t\t\"\"\"__getnewargs_ex__ returns tuple with incorrect argument types\"\"\"\n\n\t\t\tdef __getnewargs_ex__(self):  # [invalid-getnewargs-ex-returned]\n\t\t\t\treturn (list('x'), set())",
		goodExample: "\n\t\tclass CustomGetNewArgsEx:\n\t\t\t\"\"\"__getnewargs_ex__ returns <type 'tuple'>\"\"\"\n\n\t\t\tdef __getnewargs_ex__(self):\n\t\t\t\treturn ((1, 2), {'x': 'y'})",
		description: "__getnewargs_ex__ does not return a tuple containing (tuple, dict). Used when a __getnewargs_ex__ method returns something which is not of the form tuple(tuple, dict)",
		category: "Classes",
		severity: "Critical",
		title: "Invalid Getnewargs Ex Returned",
	},
	{
		ruleId: "E0309",
		language: "python",
		badExample: "\n\t\tclass CustomHash:\n\t\t\t\"\"\"__hash__ returns a list\"\"\"\n\n\t\t\tdef __hash__(self):  # [invalid-hash-returned]\n\t\t\t\treturn [1, 2, 3]",
		goodExample: "\n\t\tclass CustomHash:\n\t\t\t\"\"\"__hash__ returns an int\"\"\"\n\n\t\t\tdef __hash__(self):\n\t\t\t\treturn 123",
		description: "__hash__ does not return an integer. Used when a __hash__ method returns something which is not an integer",
		category: "Classes",
		severity: "Critical",
		title: "Invalid Hash Returned",
	},
	{
		ruleId: "E0305",
		language: "python",
		badExample: "\n\t\tclass CustomIndex:\n\t\t\t\"\"\"__index__ returns a float\"\"\"\n\n\t\t\tdef __index__(self):  # [invalid-index-returned]\n\t\t\t\treturn 3.14",
		goodExample: "\n\t\tclass CustomIndex:\n\t\t\t\"\"\"__index__ returns an int\"\"\"\n\n\t\t\tdef __index__(self):\n\t\t\t\treturn 42",
		description: "__index__ does not return an integer. Used when an __index__ method returns something which is not an integer",
		category: "Classes",
		severity: "Critical",
		title: "Invalid Index Returned",
	},
	{
		ruleId: "E0301",
		language: "python",
		badExample: "\n\t\timport random\n\n\t\tclass RandomItems:\n\t\t\tdef __init__(self, items):\n\t\t\t\tself.items = items\n\n\t\t\tdef __iter__(self):  # [non-iterator-returned]\n\t\t\t\tself.idx = 0\n\t\t\t\treturn self\n\n\t\tLIST_ITEMS = ['Apple', 'Banana', 'Grape']\n\t\tfor item in RandomItems(LIST_ITEMS):\n\t\t\tprint(item)",
		goodExample: "\n\t\timport random\n\n\t\tclass RandomItems:\n\t\t\tdef __init__(self, items):\n\t\t\t\tself.items = items\n\n\t\t\tdef __iter__(self):\n\t\t\t\tself.idx = 0\n\t\t\t\treturn self\n\n\t\t\tdef __next__(self):\n\t\t\t\tif self.idx == len(self.items):\n\t\t\t\t\traise StopIteration\n\t\t\t\tself.idx += 1\n\t\t\t\treturn self.items[self.idx - 1]\n\n\t\tLIST_ITEMS = ['Apple', 'Banana', 'Grape']\n\t\tfor item in RandomItems(LIST_ITEMS):\n\t\t\tprint(item)",
		description: "An `__iter__` method returns something which is not an iterable (i.e., lacks a `__next__` method)",
		category: "Classes",
		severity: "Critical",
		title: "Non Iterator Returned",
	},
	{
		ruleId: "E0303",
		language: "python",
		badExample: "\n\t\tclass CustomSet:\n\t\t\tdef __init__(self, elements):\n\t\t\t\tself.elements = {'a', 'b', 'c'}\n\n\t\t\tdef __len__(self):  # [invalid-length-returned]\n\t\t\t\treturn -1",
		goodExample: "\n\t\tclass CustomSet:\n\t\t\tdef __init__(self, elements):\n\t\t\t\tself.elements = {'a', 'b', 'c'}\n\n\t\t\tdef __len__(self):\n\t\t\t\treturn len(self.elements)",
		description: "A `__len__` method returns something that is not a non-negative integer",
		category: "Classes",
		severity: "Critical",
		title: "Invalid Length Returned",
	},
	{
		ruleId: "E0310",
		language: "python",
		badExample: "\n\t\tclass CustomLengthHint:\n\t\t\t\"\"\"__length_hint__ returns a negative int\"\"\"\n\n\t\t\tdef __length_hint__(self):  # [invalid-length-hint-returned]\n\t\t\t\treturn -5",
		goodExample: "\n\t\tclass CustomLengthHint:\n\t\t\t\"\"\"__length_hint__ returns a non-negative int\"\"\"\n\n\t\t\tdef __length_hint__(self):\n\t\t\t\treturn 20",
		description: "__length_hint__ does not return a non-negative integer. Used when a __length_hint__ method returns something that is not a non-negative integer",
		category: "Classes",
		severity: "Critical",
		title: "Invalid Length Hint Returned",
	},
	{
		ruleId: "E0306",
		language: "python",
		badExample: "\n\t\tclass CustomRepr:\n\t\t\t\"\"\"__repr__ returns <type 'float'>\"\"\"\n\n\t\t\tdef __repr__(self):  # [invalid-repr-returned]\n\t\t\t\treturn 3.14",
		goodExample: "\n\t\tclass CustomRepr:\n\t\t\t\"\"\"__repr__ returns <type 'str'>\"\"\"\n\n\t\t\tdef __repr__(self):\n\t\t\t\treturn \"pi\"",
		description: "__repr__ does not return str Used when a __repr__ method returns something which is not a string",
		category: "Classes",
		severity: "Critical",
		title: "Invalid Repr Returned",
	},
	{
		ruleId: "E0307",
		language: "python",
		badExample: "\n\t\tclass CustomStr:\n\t\t\t\"\"\"__str__ returns list\"\"\"\n\n\t\t\tdef __str__(self):  # [invalid-str-returned]\n\t\t\t\treturn [1, 2, 3]",
		goodExample: "\n\t\tclass CustomStr:\n\t\t\t\"\"\"__str__ returns <type 'str'>\"\"\"\n\n\t\t\tdef __str__(self):\n\t\t\t\treturn \"apple pie\"",
		description: "__str__ does not return str Used when a __str__ method returns something which is not a string",
		category: "Classes",
		severity: "Critical",
		title: "Invalid Str Returned",
	},
	{
		ruleId: "W0212",
		language: "python",
		badExample: "\n\t\tclass Bird:\n\t\t\tdef __fly(self):\n\t\t\t\tpass\n\n\t\tjane = Bird()\n\t\tjane.__fly()  # [protected-access]",
		goodExample: "\n\t\tclass Bird:\n\t\t\tdef __fly(self):\n\t\t\t\tpass\n\n\t\t\tdef soar(self):\n\t\t\t\treturn self.__fly()\n\n\t\tjane = Bird()\n\t\tjane.soar()",
		description: "A protected member (i.e. class member with a name beginning with an underscore) is accessed outside the class or a descendant of the class where it's defined",
		category: "Classes",
		severity: "Critical",
		title: "Protected Access",
	},
	{
		ruleId: "W0201",
		language: "python",
		badExample: "class Employee:\n    def promote(self):\n        self.is_promoted = True  # [attribute-defined-outside-init]",
		goodExample: "\n\t\tclass Employee:\n\t\t\tdef __init__(self):\n\t\t\t\tself.is_promoted = False\n\n\t\t\tdef promote(self):\n\t\t\t\tself.is_promoted = True",
		description: "An instance attribute is defined outside the `__init__` method",
		category: "Classes",
		severity: "Critical",
		title: "Attribute Defined Outside Init",
	},
	{
		ruleId: "W0232",
		language: "python",
		badExample: "\n\t\tclass Car:\n\t\t\tdef drive(self):\n\t\t\t\tprint('driving')",
		goodExample: "\n\t\tclass Car:\n\t\t\tdef __init__(self):\n\t\t\t\tself.speed = 0\n\n\t\t\tdef drive(self):\n\t\t\t\tprint('driving')",
		description: "A class has no `__init__` method, neither its parent classes",
		category: "Classes",
		severity: "Critical",
		title: "No Init",
	},
	{
		ruleId: "W0223",
		language: "python",
		badExample: "\n\t\timport abc\n\n\t\tclass Vehicle:\n\t\t\t@abc.abstractmethod\n\t\t\tdef start_engine(self):\n\t\t\t\tpass\n\n\t\tclass Bike(Vehicle):  # [abstract-method]\n\t\t\tpass",
		goodExample: "\n\t\timport abc\n\n\t\tclass Vehicle:\n\t\t\t@abc.abstractmethod\n\t\t\tdef start_engine(self):\n\t\t\t\tpass\n\n\n\t\tclass Bike(Vehicle):\n\t\t\tdef start_engine(self):\n\t\t\t\tprint(\"Vroom\")",
		description: "An abstract method (i.e. raise NotImplementedError) is not overridden in concrete class",
		category: "Classes",
		severity: "Critical",
		title: "Abstract Method",
	},
	{
		ruleId: "W0236",
		language: "python",
		badExample: "\n\t\tclass Tree:\n\t\t\tasync def grow(self, soil):\n\t\t\t\tsoil.enrich(self)\n\n\t\tclass Oak(Tree):\n\t\t\tdef grow(self, soil):  # [invalid-overridden-method]\n\t\t\t\tsoil.enrich(self)",
		goodExample: "\n\t\tclass Tree:\n\t\t\tasync def grow(self, soil):\n\t\t\t\tsoil.enrich(self)\n\n\t\tclass Oak(Tree):\n\t\t\tasync def grow(self, soil):\n\t\t\t\tsoil.enrich(self)",
		description: "We detect that a method was overridden in a way that does not match its base class which could result in potential bugs at runtime",
		category: "Classes",
		severity: "Major",
		title: "Invalid Overridden Method",
	},
	{
		ruleId: "W0221",
		language: "python",
		badExample: "\n\t\tclass Sandwich:\n\t\t\tdef make(self, bread, filling):\n\t\t\t\treturn f'{bread} and {filling}'",
		goodExample: "\n\t\tclass BLTSandwich(Sandwich):\n\t\t\tdef make(self, bread, filling, bacon):  # [arguments-differ]\n\t\t\t\treturn f'{bread}, {filling}, and {bacon}'",
		description: "A method has a different number of arguments than in the implemented interface or in an overridden method",
		category: "Classes",
		severity: "Major",
		title: "Arguments Differ",
	},
	{
		ruleId: "W0222",
		language: "python",
		badExample: "\n\t\tclass Vehicle:\n\t\t\tdef start(self, fuel=100):\n\t\t\t\tprint(f\"Started with {fuel} units of fuel!\")\n\n\n\t\tclass Car(Vehicle):\n\t\t\tdef start(self, fuel):  # [signature-differs]\n\t\t\t\tsuper(Vehicle, self).start(fuel)\n\t\t\t\tprint(\"Engine is now running!\")",
		goodExample: "\n\t\tclass Vehicle:\n\t\t\tdef start(self, fuel=100):\n\t\t\t\tprint(f\"Started with {fuel} units of fuel!\")\n\n\t\tclass Car(Vehicle):\n\t\t\tdef start(self, fuel=100):\n\t\t\t\tsuper(Vehicle, self).start(fuel)\n\t\t\t\tprint(\"Engine is now running!\")",
		description: "A method signature is different than in the implemented interface or in an overridden method",
		category: "Classes",
		severity: "Major",
		title: "Signature Differs",
	},
	{
		ruleId: "W0211",
		language: "python",
		badExample: "\n\t\tclass Eagle:\n\t\t\t@staticmethod\n\t\t\tdef fly(self):  # [bad-staticmethod-argument]\n\t\t\t\tpass",
		goodExample: "\n\t\tclass Eagle:\n\t\t\t@staticmethod\n\t\t\tdef fly(height):\n\t\t\t\tpass",
		description: "A static method has `self` or a value specified in valid-classmethod-first-arg option or valid-metaclass-classmethod-first-arg option as the first argument",
		category: "Classes",
		severity: "Major",
		title: "Bad Staticmethod Argument",
	},
	{
		ruleId: "W0235",
		language: "python",
		badExample: "\n\t\tclass Bird:\n\t\t\tdef fly(self):\n\t\t\t\tprint(\"Flying\")\n\n\t\tclass Sparrow(Bird):\n\t\t\tdef fly(self):  # [useless-super-delegation]\n\t\t\t\tsuper().fly()\n\t\t\t\tprint(\"Flying again\")",
		goodExample: "\n\t\tclass Bird:\n\t\t\tdef fly(self):\n\t\t\t\tprint(\"Flying\")\n\n\t\tclass Sparrow(Bird):\n\t\t\tdef fly(self):\n\t\t\t\tprint(\"Sparrow in flight\")",
		description: "Used whenever we can detect that an overridden method is useless, relying on `super()` delegation to do the same thing as another method from the MRO",
		category: "Classes",
		severity: "Major",
		title: "Useless Super Delegation",
	},
	{
		ruleId: "W0233",
		language: "python",
		badExample: "\n\t\tclass Insect:\n\t\t\tdef __init__(self):\n\t\t\t\tself.has_wings = True\n\n\t\tclass Butterfly(Insect):\n\t\t\tdef __init__(self):\n\t\t\t\tsuper().__init__()\n\t\t\t\tself.is_beautiful = True\n\n\t\tclass MonarchButterfly(Butterfly):\n\t\t\tdef __init__(self):\n\t\t\t\tInsect.__init__(self)  # [non-parent-init-called]\n\t\t\t\tself.is_migratory = True",
		goodExample: "\n\t\tclass Insect:\n\t\t\tdef __init__(self):\n\t\t\t\tself.has_wings = True\n\n\t\tclass Butterfly(Insect):\n\t\t\tdef __init__(self):\n\t\t\t\tsuper().__init__()\n\t\t\t\tself.is_beautiful = True\n\n\t\tclass MonarchButterfly(Butterfly):\n\t\t\tdef __init__(self):\n\t\t\t\tsuper().__init__()\n\t\t\t\tself.is_migratory = True",
		description: "An `__init__` method is called on a class which is not in the direct ancestors for the analysed class",
		category: "Classes",
		severity: "Major",
		title: "Non Parent Init Called",
	},
	{
		ruleId: "W0231",
		language: "python",
		badExample: "\n\t\tclass Tree:\n\t\t\tdef __init__(self, species=\"Tree\"):\n\t\t\t\tself.species = species\n\t\t\t\tprint(f\"Planting a {self.species}\")\n\n\t\tclass Oak(Tree):\n\t\t\tdef __init__(self):  # [super-init-not-called]\n\t\t\t\tprint(\"Growing an oak tree\")",
		goodExample: "\n\t\tclass Tree:\n\t\t\tdef __init__(self, species=\"Tree\"):\n\t\t\t\tself.species = species\n\t\t\t\tprint(f\"Planting a {self.species}\")\n\n\n\t\tclass Oak(Tree):\n\t\t\tdef __init__(self):\n\t\t\t\tsuper().__init__(\"Oak\")",
		description: "An ancestor class method has an `__init__` method which is not called by a derived class",
		category: "Classes",
		severity: "Major",
		title: "Super Init Not Called",
	},
	{
		ruleId: "R0206",
		language: "python",
		badExample: "\n\t\tclass Drill:\n\t\t\t@property\n\t\t\tdef depth(self, value):  # [property-with-parameters]\n\t\t\t\tpass",
		goodExample: "\n\t\tclass Drill:\n\t\t\t@property\n\t\t\tdef depth(self):\n\t\t\t\t\"\"\"Property accessed with '.depth'.\"\"\"\n\t\t\t\tpass\n\n\t\t\tdef set_depth(value):\n\t\t\t\t\"\"\"Function called with .set_depth(value).\"\"\"\n\t\t\t\tpass",
		description: "Detected that a property also has parameters, which are useless, given that properties cannot be called with additional arguments",
		category: "Classes",
		severity: "Minor",
		title: "Property With Parameters",
	},
	{
		ruleId: "R0205",
		language: "python",
		badExample: "\n\t\tclass Plane(object):  # [useless-object-inheritance]\n    \t\t...",
		goodExample: "class Plane: ...",
		description: "A class inherits from `object`, which under Python 3 is implicit, hence can be safely removed from bases",
		category: "Classes",
		severity: "Minor",
		title: "Useless Object Inheritance",
	},
	{
		ruleId: "R0202",
		language: "python",
		badExample: "\n\t\tclass Flower:\n\t\t\tCOLORS = []\n\n\t\t\tdef __init__(self, color):\n\t\t\t\tself.color = color\n\n\t\t\tdef set_colors(cls, *args):\n\t\t\t\t\"\"\"classmethod to set flower colors\"\"\"\n\t\t\t\tcls.COLORS = args\n\n\t\t\tset_colors = classmethod(set_colors)  # [no-classmethod-decorator]",
		goodExample: "\n\t\tclass Flower:\n\t\t\tCOLORS = []\n\n\t\t\tdef __init__(self, color):\n\t\t\t\tself.color = color\n\n\t\t\t@classmethod\n\t\t\tdef set_colors(cls, *args):\n\t\t\t\t\"\"\"classmethod to set flower colors\"\"\"\n\t\t\t\tcls.COLORS = args",
		description: "A class method is defined without using the decorator syntax",
		category: "Classes",
		severity: "Minor",
		title: "No Classmethod Decorator",
	},
	{
		ruleId: "R0203",
		language: "python",
		badExample: "\n\t\tclass Mouse:\n\t\t\tdef run(self):\n\t\t\t\tpass\n\n\t\t\trun = staticmethod(run)  # [no-staticmethod-decorator]",
		goodExample: "\n\t\tclass Mouse:\n\t\t\t@staticmethod\n\t\t\tdef run(self):\n\t\t\t\tpass",
		description: "A static method is defined without using the decorator syntax",
		category: "Classes",
		severity: "Minor",
		title: "No Staticmethod Decorator",
	},
	{
		ruleId: "R0201",
		language: "python",
		badExample: "\n\tclass Car:\n\t\tdef start_engine(self):  # [no-self-use]\n\t\t\tprint('Engine started')",
		goodExample: "\n\tdef start_engine():\n\t\tprint('Engine started')",
		description: "A method doesn't use its bound instance, and so could be written as a function",
		category: "Classes",
		severity: "Minor",
		title: "No Self Use",
	},
	{
		ruleId: "C0205",
		language: "python",
		badExample: "\n\t\tclass Tree:  # [single-string-used-for-slots]\n\t\t\t__slots__ = 'species'\n\n\t\t\tdef __init__(self, species):\n\t\t\t\tself.species = species",
		goodExample: "\n\t\tclass Tree:\n\t\t\t__slots__ = ('species',)\n\n\t\t\tdef __init__(self, species):\n\t\t\t\tself.species = species",
		description: "A class `__slots__` is a simple string, rather than an iterable",
		category: "Classes",
		severity: "Minor",
		title: "Single String Used For Slots",
	},
	{
		ruleId: "C0202",
		language: "python",
		badExample: "\n\t\tclass Vehicle:\n\t\t\t@classmethod\n\t\t\tdef create(cls):  # [bad-classmethod-argument]\n\t\t\t\treturn cls()",
		goodExample: "\n\t\tclass Vehicle:\n\t\t\t@classmethod\n\t\t\tdef create(cls):\n\t\t\t\treturn cls()",
		description: "A class method has a first argument named differently than the value specified in valid-classmethod-first-arg option (default to \"cls\"), recommended to easily differentiate them from regular instance methods",
		category: "Classes",
		severity: "Minor",
		title: "Bad Classmethod Argument",
	},
	{
		ruleId: "C0204",
		language: "python",
		badExample: "\n\t\tclass Factory(type):\n\t\t\t@classmethod\n\t\t\tdef make_product(thing):  # [bad-mcs-classmethod-argument]\n\t\t\t\tpass",
		goodExample: "\n\t\tclass Factory(type):\n\t\t\t@classmethod\n\t\t\tdef make_product(mcs):\n\t\t\t\tpass",
		description: "A metaclass class method has a first argument named differently than the value specified in valid-metaclass-classmethod-first-arg option (default to `mcs`), recommended to easily differentiate them from regular instance methods",
		category: "Classes",
		severity: "Minor",
		title: "Bad Mcs Classmethod Argument",
	},
	{
		ruleId: "C0203",
		language: "python",
		badExample: "\n\t\t\tclass Manager(type):\n\t\t\t\tdef assign_task(task):  # [bad-mcs-method-argument]\n\t\t\t\t\tpass",
		goodExample: "\n\t\tclass Manager(type):\n\t\t\tdef assign_task(cls):\n\t\t\t\tpass",
		description: "A metaclass method has a first argument named differently than the value specified in valid-classmethod-first-arg option (default to `cls`), recommended to easily differentiate them from regular instance methods",
		category: "Classes",
		severity: "Minor",
		title: "Bad Mcs Method Argument",
	},
	{
		ruleId: "F0202",
		language: "python",
		badExample: "\n\t\tclass Device:\n\t\t\tdef start_device(self, config):\n\t\t\t\t# [method-check-failed]\n\t\t\t\tpass",
		goodExample: "\n\t\tclass Device:\n\t\t\tdef start_device(self, config):\n\t\t\t\tpass",
		description: "Pylint has been unable to check methods signature compatibility for an unexpected reason. Please report this kind if you don't make sense of it",
		category: "Classes",
		severity: "Minor",
		title: "Method Check Failed",
	},
	{
		ruleId: "R0903",
		language: "python",
		badExample: "\n\t\tclass Bird:\n\t\t\tdef __init__(self, species: str):\n\t\t\t\tself.species = species\n\n\t\t\tdef fly(self):\n\t\t\t\tprint(f\"The {self.species} is flying.\")",
		goodExample: "\n\t\timport dataclasses\n\n\t\t@dataclasses.dataclass\n\t\tclass Bird:\n\t\t\tspecies: str\n\n\t\tdef fly(bird: Bird):\n\t\t\tprint(f\"The {bird.species} is flying.\")",
		description: "Class has too few public methods, so be sure it's really worth it",
		category: "Design",
		severity: "Minor",
		title: "Too Few Public Methods",
	},
	{
		ruleId: "R0901",
		language: "python",
		badExample: "\n\t\tclass Mammal: ...\n\t\tclass FlyingAnimal(Mammal): ...\n\t\tclass SwimmingAnimal(Mammal): ...\n\t\tclass EndangeredSpecies(Mammal): ...\n\n\t\t# max of 7 by default, can be configured\n\t\tclass Bat(  # [too-many-ancestors]\n\t\t\tFlyingAnimal,\n\t\t\tSwimmingAnimal,\n\t\t\tEndangeredSpecies,\n\t\t):\n\t\t\tpass",
		goodExample: "\n\t\tclass Animal:\n\t\tcan_fly: bool\n\t\tcan_swim: bool\n\t\tis_endangered: bool\n\n\tclass Mammal(Animal):\n\t\tcan_fly = False\n\t\tcan_swim = False\n\t\tis_endangered = False\n\n\tclass Bat(Mammal):\n\t\tcan_fly = True\n\t\tis_endangered = True",
		description: "Class has too many parent classes, try to reduce this to get a simpler (and so easier to use) class",
		category: "Design",
		severity: "Minor",
		title: "Too Many Ancestors",
	},
	{
		ruleId: "R0913",
		language: "python",
		badExample: "\n\t\tdef process_sensor_data(  # [too-many-arguments]\n\t\t\taccelerometer,\n\t\t\tgyroscope,\n\t\t\tmagnetometer,\n\t\t\tbarometer,\n\t\t\tproximity_sensor,\n\t\t\tlight_sensor,\n\t\t\tcurrent_time,\n\t\t\ttemperature_sensor,\n\t\t):\n\t\t\tpass",
		goodExample: "\n\t\tfrom dataclasses import dataclass\n\n\t\t@dataclass\n\t\tclass Sensor:\n\t\t\taccelerometer: float\n\t\t\tgyroscope: float\n\t\t\tmagnetometer: float\n\t\t\tbarometer: float\n\n\t\t@dataclass\n\t\tclass EnvironmentSensor:\n\t\t\tproximity: float\n\t\t\tlight: float\n\t\t\ttemperature: float\n\n\t\tdef process_sensor_data(\n\t\t\tmotion: Sensor,\n\t\t\tenvironment: EnvironmentSensor,\n\t\t\tcurrent_time,\n\t\t):\n\t\t\tpass",
		description: "A function or method takes too many arguments",
		category: "Design",
		severity: "Minor",
		title: "Too Many Arguments",
	},
	{
		ruleId: "R0916",
		language: "python",
		badExample: "\n\t\tdef check_valid_triangle(a, b, c):\n\t\t\t# +1: [too-many-boolean-expressions]\n\t\t\tif (a > 0 and b > 0 and c > 0) and (a + b > c and a + c > b and b + c > a):\n\t\t\t\tpass",
		goodExample: "\n\t\tdef check_valid_triangle(a, b, c):\n\t\t\tif all(x > 0 for x in [a, b, c]) and (a + b > c and a + c > b and b + c > a):\n\t\t\t\tpass",
		description: "An if statement contains too many boolean expressions",
		category: "Design",
		severity: "Minor",
		title: "Too Many Boolean Expressions",
	},
	{
		ruleId: "R0912",
		language: "python",
		badExample: "\n\t\tdef map_day_to_word(day):  # [too-many-branches]\n\t\t\tif day == 1:\n\t\t\t\treturn 'Monday'\n\t\t\telif day == 2:\n\t\t\t\treturn 'Tuesday'\n\t\t\telif day == 3:\n\t\t\t\treturn 'Wednesday'\n\t\t\telif day == 4:\n\t\t\t\treturn 'Thursday'\n\t\t\telif day == 5:\n\t\t\t\treturn 'Friday'\n\t\t\telif day == 6:\n\t\t\t\treturn 'Saturday'\n\t\t\telif day == 7:\n\t\t\t\treturn 'Sunday'\n\t\t\telse:\n\t\t\t\treturn None",
		goodExample: "\n\t\tdef map_day_to_word(day):\n\t\t\treturn {\n\t\t\t\t1: 'Monday',\n\t\t\t\t2: 'Tuesday',\n\t\t\t\t3: 'Wednesday',\n\t\t\t\t4: 'Thursday',\n\t\t\t\t5: 'Friday',\n\t\t\t\t6: 'Saturday',\n\t\t\t\t7: 'Sunday',\n\t\t\t}.get(day)",
		description: "A function or method has too many branches, making it hard to follow",
		category: "Design",
		severity: "Minor",
		title: "Too Many Branches",
	},
	{
		ruleId: "R0902",
		language: "python",
		badExample: "\n\t\tclass Car:  # [too-many-instance-attributes]\n\t\t\tdef __init__(self):\n\t\t\t\tself.make = 'Toyota'\n\t\t\t\tself.model = 'Camry'\n\t\t\t\tself.year = 2022\n\t\t\t\tself.engine = 'V6'\n\t\t\t\tself.transmission = 'Automatic'\n\t\t\t\tself.color = 'Blue'\n\t\t\t\tself.fuel_type = 'Gasoline'\n\t\t\t\tself.seating_capacity = 5\n\t\t\t\tself.mileage = 30000",
		goodExample: "\n\t\timport dataclasses\n\n\t\t@dataclasses.dataclass\n\t\tclass Engine:\n\t\t\tengine_type: str\n\t\t\tfuel_type: str\n\n\t\t@dataclasses.dataclass\n\t\tclass Car:\n\t\t\tmake: str\n\t\t\tmodel: str\n\t\t\tyear: int\n\t\t\tengine: Engine\n\t\t\tseating_capacity: int\n\t\t\tmileage: int\n\n\t\tcar = Car(\n\t\t\tmake='Toyota', model='Camry', year=2022, engine=Engine('V6', 'Gasoline'), seating_capacity=5, mileage=30000\n\t\t)",
		description: "Class has too many instance attributes, try to reduce this to get a simpler (and so easier to use) class",
		category: "Design",
		severity: "Minor",
		title: "Too Many Instance Attributes",
	},
	{
		ruleId: "R0914",
		language: "python",
		badExample: "\n\t\tdef process_purchase_info(purchases):  # [too-many-locals]\n\t\t\titem_list = []\n\t\t\tpurchase_total = 0\n\t\t\tdiscount = 0.1\n\t\t\tshipping_cost = 5.99\n\t\t\ttax = 0.07\n\t\t\tfinal_total = 0\n\t\t\treward_points = 0\n\t\t\tloyalty_bonus = 0.05\n\t\t\tpayment_method = 'Credit Card'\n\t\t\tfor item in purchases:\n\t\t\t\tpass",
		goodExample: "\n\t\tfrom typing import NamedTuple\n\n\t\tclass PurchaseDetails(NamedTuple):\n\t\t\tpurchase_total: float\n\t\t\tdiscount: float\n\t\t\tshipping_cost: float\n\t\t\ttax: float\n\n\t\tdef process_purchase_info(purchases):\n\t\t\tpurchase_details = PurchaseDetails(100, 0.1, 5.99, 0.07)\n\t\t\tfinal_total = _calculate_final_total(purchase_details)\n\t\t\t_handle_rewards_and_loyalty(purchases, final_total)\n\n\t\tdef _calculate_final_total(details: PurchaseDetails):\n\t\t\t# logic to calculate final total\n\t\t\tpass\n\n\t\tdef _handle_rewards_and_loyalty(purchases, final_total):\n\t\t\t# handle reward logic\n\t\t\tpass",
		description: "A function or method has too many local variables",
		category: "Design",
		severity: "Minor",
		title: "Too Many Locals",
	},
	{
		ruleId: "R0904",
		language: "python",
		badExample: "\n\t\tclass Game:  # [too-many-public-methods]\n\t\t\tdef start(self): pass\n\t\t\tdef stop(self): pass\n\t\t\tdef reset(self): pass\n\t\t\tdef save(self): pass\n\t\t\tdef load(self): pass\n\t\t\tdef pause(self): pass\n\t\t\tdef resume(self): pass\n\t\t\tdef quit(self): pass\n\t\t\tdef restart(self): pass\n\t\t\tdef autosave(self): pass",
		goodExample: "\n\t\tclass GameController:\n\t\t\tdef __init__(self):\n\t\t\t\tself.state = 'Stopped'\n\n\t\t\tdef start(self):\n\t\t\t\tself.state = 'Running'\n\n\t\t\tdef stop(self):\n\t\t\t\tself.state = 'Stopped'\n\n\t\t\tdef pause(self):\n\t\t\t\tself.state = 'Paused'\n\n\t\tclass SaveSystem:\n\t\t\tdef save(self): pass\n\t\t\tdef load(self): pass\n\n\t\tclass Game:\n\t\t\tdef __init__(self):\n\t\t\t\tself.controller = GameController()\n\t\t\t\tself.save_system = SaveSystem()",
		description: "Class has too many public methods, try to reduce this to get a simpler (and so easier to use) class",
		category: "Design",
		severity: "Minor",
		title: "Too Many Public Methods",
	},
	{
		ruleId: "R0911",
		language: "python",
		badExample: "\n\t\tdef classify_grade(score):\n\t\t\tif score >= 90:\n\t\t\t\treturn 'A'\n\t\t\telif score >= 80:\n\t\t\t\treturn 'B'\n\t\t\telif score >= 70:\n\t\t\t\treturn 'C'\n\t\t\telif score >= 60:\n\t\t\t\treturn 'D'\n\t\t\telse:\n\t\t\t\treturn 'F'",
		goodExample: "\n\t\tdef classify_grade(score):\n\t\t\treturn next((grade for score_threshold, grade in [(90, 'A'), (80, 'B'), (70, 'C'), (60, 'D')] if score >= score_threshold), 'F')",
		description: "Function contains too many return statements",
		category: "Design",
		severity: "Minor",
		title: "Too Many Return Statements",
	},
	{
		ruleId: "R0915",
		language: "python",
		badExample: "\n\t\tdef initialize_game():  # [too-many-statements]\n\t\t\tplayer = Player()\n\t\t\tgame = Game()\n\t\t\tgame.setup_board()\n\t\t\tgame.assign_pieces()\n\t\t\tplayer.set_position(0, 0)\n\t\t\tplayer.set_health(100)\n\t\t\tplayer.set_inventory([])\n\t\t\tenemy = Enemy()\n\t\t\tenemy.set_position(10, 10)\n\t\t\tenemy.set_health(100)\n\t\t\tweapon = Weapon('sword')\n\t\t\tarmor = Armor('shield')\n\t\t\tplayer.equip(weapon)\n\t\t\tplayer.equip(armor)\n\t\t\tgame.start()",
		goodExample: "\n\t\tdef initialize_game():\n\t\t\tplayer = _initialize_player()\n\t\t\tenemy = _initialize_enemy()\n\t\t\tgame = _initialize_game_environment(player, enemy)\n\t\t\tgame.start()\n\n\t\tdef _initialize_player():\n\t\t\tplayer = Player()\n\t\t\tplayer.set_position(0, 0)\n\t\t\tplayer.set_health(100)\n\t\t\tplayer.set_inventory([])\n\t\t\tplayer.equip(Weapon('sword'))\n\t\t\tplayer.equip(Armor('shield'))\n\t\t\treturn player\n\n\t\tdef _initialize_enemy():\n\t\t\tenemy = Enemy()\n\t\t\tenemy.set_position(10, 10)\n\t\t\tenemy.set_health(100)\n\t\t\treturn enemy\n\n\t\tdef _initialize_game_environment(player, enemy):\n\t\t\tgame = Game()\n\t\t\tgame.setup_board()\n\t\t\tgame.assign_pieces()\n\t\t\treturn game",
		description: "A function or method contains too many statements",
		category: "Design",
		severity: "Minor",
		title: "Too Many Statements",
	},
	{
		ruleId: "E0701",
		language: "python",
		badExample: "\n\t\ttry:\n\t\t\tresult = int(input('Enter a number: '))\n\t\texcept Exception:\n\t\t\tprint('An error occurred')\n\t\texcept ValueError:  # [bad-except-order]\n\t\t\tprint('Invalid input')",
		goodExample: "\n\t\ttry:\n\t\t\tresult = int(input('Enter a number: '))\n\t\texcept ValueError:\n\t\t\tprint('Invalid input')\n\t\texcept Exception:\n\t\t\tprint('An error occurred')",
		description: "Except clauses are not in the correct order (from the more specific to the more generic). If you don't fix the order, some exceptions may not be caught by the most specific handler.",
		category: "Exception",
		severity: "Minor",
		title: "Bad Except Order",
	},
	{
		ruleId: "E0712",
		language: "python",
		badExample: "\n\t\tclass BarError:\n\t\t\tpass\n\n\t\ttry:\n\t\t\t'abc' + 123\n\t\texcept BarError:  # [catching-non-exception]\n\t\t\tpass",
		goodExample: "\n\t\tclass BarError(Exception):\n\t\t\tpass\n\n\t\ttry:\n\t\t\t'abc' + 123\n\t\texcept BarError:\n\t\t\tpass",
		description: "A class which doesn't inherit from `Exception` is used as an exception in an except clause",
		category: "Exception",
		severity: "Minor",
		title: "Catching Non Exception",
	},
	{
		ruleId: "E0703",
		language: "python",
		badExample: "\n\t\ttry:\n\t\t\traise ValueError('Issue encountered') from 'Not an exception'  # [bad-exception-context]\n\t\texcept ValueError:\n\t\t\tpass",
		goodExample: "\n\t\ttry:\n\t\t\traise ValueError('Issue encountered') from KeyError('Wrong key')\n\t\texcept ValueError:\n\t\t\tpass",
		description: "Using the syntax `raise ... from ...`, where the exception context is not an exception, nor None. This message belongs to the exceptions checker",
		category: "Exception",
		severity: "Minor",
		title: "Bad Exception Context",
	},
	{
		ruleId: "E0711",
		language: "python",
		badExample: "\n\t\tclass Bird:\n\t\t\tdef fly(self):\n\t\t\t\traise NotImplemented  # [notimplemented-raised]",
		goodExample: "\n\t\tclass Bird:\n\t\t\tdef fly(self):\n\t\t\t\traise NotImplementedError",
		description: "`NotImplemented` is raised instead of `NotImplementedError`",
		category: "Exception",
		severity: "Minor",
		title: "Notimplemented Raised",
	},
	{
		ruleId: "E0702",
		language: "python",
		badExample: "\n\t\tclass ImpossibleCalculationError(OverflowError):\n\t\t\tdef __init__(self):\n\t\t\t\tsuper().__init__(\"Calculation exceeded the limits!\")\n\n\n\t\tdef calculate_area(radius: float) -> float:\n\t\t\ttry:\n\t\t\t\treturn 3.14 * radius ** 2\n\t\t\texcept OverflowError as e:\n\t\t\t\traise None  # [raising-bad-type]",
		goodExample: "\n\t\t\tclass ImpossibleCalculationError(OverflowError):\n\t\t\t\tdef __init__(self):\n\t\t\t\t\tsuper().__init__(\"Calculation exceeded the limits!\")\n\n\t\t\tdef calculate_area(radius: float) -> float:\n\t\t\t\ttry:\n\t\t\t\t\treturn 3.14 * radius ** 2\n\t\t\t\texcept OverflowError as e:\n\t\t\t\t\traise ImpossibleCalculationError() from e",
		description: "Something which is neither a class, an instance or a string is raised (i.e. a `TypeError` will be raised)",
		category: "Exception",
		severity: "Minor",
		title: "Raising Bad Type",
	},
	{
		ruleId: "E0710",
		language: "python",
		badExample: "raise list  # [raising-non-exception]",
		goodExample: "raise ValueError(\"Invalid operation!\")",
		description: "A new style class which doesn't inherit from `BaseException` is raised",
		category: "Exception",
		severity: "Minor",
		title: "Raising Non Exception",
	},
	{
		ruleId: "E0704",
		language: "python",
		badExample: "\n\t\tdef validate_input(x):\n\t\t\tif x == '':\n\t\t\t\traise  # [misplaced-bare-raise]",
		goodExample: "\n\t\tdef validate_input(x):\n\t\t\tif x == '':\n\t\t\t\traise ValueError(f\"Input cannot be empty: {x}\")",
		description: "A bare raise is not used inside an except clause. This generates an error, since there are no active exceptions to be reraised. An exception to this rule is represented by a bare raise inside a finally clause, which might work, as long as an exception is raised inside the try block, but it is nevertheless a code smell that must not be relied upon",
		category: "Exception",
		severity: "Minor",
		title: "Misplaced Bare Raise",
	},
	{
		ruleId: "W0705",
		language: "python",
		badExample: "\n\t\ttry:\n\t\t\t1 + 'a'\n\t\texcept TypeError:\n\t\t\tpass\n\t\texcept TypeError:  # [duplicate-except]\n\t\t\tpass",
		goodExample: "\n\t\ttry:\n\t\t\t1 + 'a'\n\t\texcept TypeError:\n\t\t\tpass",
		description: "An except catches a type that was already caught by a previous handler",
		category: "Exception",
		severity: "Minor",
		title: "Duplicate Except",
	},
	{
		ruleId: "W0703",
		language: "python",
		badExample: "\n\t\ttry:\n\t\t\t1 / 0\n\t\texcept Exception:  # [broad-except]\n\t\t\tpass",
		goodExample: "\n\t\ttry:\n\t\t\t1 / 0\n\t\texcept ZeroDivisionError:  # handle specific error\n\t\t\tpass",
		description: "An except catches a too general exception, possibly burying unrelated errors",
		category: "Exception",
		severity: "Minor",
		title: "Broad Except",
	},
	{
		ruleId: "W0707",
		language: "python",
		badExample: "\n\t\ttry:\n\t\t\topen('non_existent_file.txt')\n\t\texcept FileNotFoundError as e:\n\t\t\traise IOError(\"File cannot be opened\")  # [raise-missing-from]",
		goodExample: "\n\t\ttry:\n\t\t\topen('non_existent_file.txt')\n\t\texcept FileNotFoundError as e:\n\t\t\traise IOError(\"File cannot be opened\") from e",
		description: "Consider explicitly re-raising using the 'from' keyword. Python 3's exception chaining ensures the traceback shows both the current exception and the original one. Not using 'raise from' leads to an inaccurate traceback that might obscure the true source of the error.",
		category: "Exception",
		severity: "Major",
		title: "Raise Missing From",
	},
	{
		ruleId: "W0715",
		language: "python",
		badExample: "raise TypeError(\"Unsupported operand type(s) %s %s\", (\"int\", \"str\"))  # [raising-format-tuple]",
		goodExample: "raise TypeError(\"Unsupported operand type(s) %s %s\" % (\"int\", \"str\"))",
		description: "Passing multiple arguments to an exception constructor, with one of them being a tuple for string formatting, leads to incorrect behavior. Correct the formatting by using '%' operator inside the string.",
		category: "Exception",
		severity: "Major",
		title: "Raising Format Tuple",
	},
	{
		ruleId: "W0711",
		language: "python",
		badExample: "\n\t\ttry:\n\t\t\tint('abc')\n\t\texcept ValueError or TypeError:  # [binary-op-exception]\n\t\t\tpass",
		goodExample: "\n\t\ttry:\n\t\t\tint('abc')\n\t\texcept (ValueError, TypeError):\n\t\t\tpass",
		description: "Avoid using `except A or B` for catching exceptions. To catch multiple exceptions, use the tuple syntax: `except (A, B)`.",
		category: "Exception",
		severity: "Major",
		title: "Binary Op Exception",
	},
	{
		ruleId: "W0716",
		language: "python",
		badExample: "\n\t\ttry:\n\t\t\tfloat('abc')\n\t\texcept ValueError + TypeError:  # [wrong-exception-operation]\n\t\t\tpass",
		goodExample: "\n\t\ttry:\n\t\t\tfloat('abc')\n\t\texcept (ValueError, TypeError):\n\t\t\tpass",
		description: "Binary operations between exceptions like `ValueError + TypeError` are invalid. Use a tuple `(ValueError, TypeError)` to catch multiple exceptions.",
		category: "Exception",
		severity: "Major",
		title: "Wrong Exception Operation",
	},
	{
		ruleId: "W0702",
		language: "python",
		badExample: "\n\t\ttry:\n\t\t\topen('non_existent_file.txt')\n\t\texcept:  # [bare-except]\n\t\t\tfile = None",
		goodExample: "\n\t\ttry:\n\t\t\topen('non_existent_file.txt')\n\t\texcept FileNotFoundError:\n\t\t\tfile = None",
		description: "Avoid using bare `except` clauses, as they catch all exceptions and obscure the specific errors you're trying to handle.",
		category: "Exception",
		severity: "Major",
		title: "Bare Except",
	},
	{
		ruleId: "W0706",
		language: "python",
		badExample: "\n\t\ttry:\n\t\t\tint('invalid')\n\t\texcept ValueError as e:  # [try-except-raise]\n\t\t\traise",
		goodExample: "\n\t\t# Raise a more descriptive exception:\n\t\ttry:\n\t\t\tint('invalid')\n\t\texcept ValueError as e:\n\t\t\traise TypeError(\"Input must be a valid integer\") from e",
		description: "Raising the same exception immediately after catching it (`raise` by itself) is redundant. Either raise a more detailed exception or remove the try-except block entirely.",
		category: "Exception",
		severity: "Major",
		title: "Try Except Raise",
	},
	{
		ruleId: "W0311",
		language: "python",
		badExample: "\n\t\tif input():\n   \t\tprint('yes')  # [bad-indentation]",
		goodExample: "\n\t\tif input():\n\t\t\tprint('yes')",
		description: "Improper indentation in Python is problematic, as it can lead to runtime errors. Ensure consistent indentation.",
		category: "Format",
		severity: "Major",
		title: "Bad Indentation",
	}, {
		ruleId: "C0304",
		language: "python",
		badExample: "\n\t\topen(\"file.txt\")  # CRLF (\r\n)\n\t\tclose(\"file.txt\")  # End-of-file (EOF)\n\t\t# [missing-final-newline]",
		goodExample: "\n\t\topen(\"file.txt\")  # CRLF (\r\n)\n\t\tclose(\"file.txt\")  # CRLF (\r\n)\n\t\t# End-of-file (EOF)",
		description: "The last line in a file is missing a newline",
		category: "Format",
		severity: "Major",
		title: "Missing Final Newline",
	},
	{
		ruleId: "C0301",
		language: "python",
		badExample: "\n\t\t# +1: [line-too-long]\n\t\tPLANETS = [\"mercury\", \"venus\", \"earth\", \"mars\", \"jupiter\", \"saturn\", \"uranus\", \"neptune\"]",
		goodExample: "\n\t\tPLANETS = [\n\t\t\t\"mercury\",\n\t\t\t\"venus\",\n\t\t\t\"earth\",\n\t\t\t\"mars\",\n\t\t\t\"jupiter\",\n\t\t\t\"saturn\",\n\t\t\t\"uranus\",\n\t\t\t\"neptune\",\n\t\t]",
		description: "A line is longer than a given number of characters",
		category: "Format",
		severity: "Major",
		title: "Line Too Long",
	},
	{
		ruleId: "C0327",
		language: "python",
		badExample: "\n\t\tread_file(\"file.txt\")  # CRLF (\r\n)\n\t\twrite_file(\"file.txt\")  # LF (\n) # [mixed-line-endings]",
		goodExample: "\n\t\tread_file(\"file.txt\")  # CRLF (\r\n)\n\t\twrite_file(\"file.txt\")  # CRLF (\r\n)",
		description: "There are mixed (LF and CRLF) newline signs in a file",
		category: "Format",
		severity: "Major",
		title: "Mixed Line Endings",
	},
	{
		ruleId: "C0321",
		language: "python",
		badExample: "\n\t\tanimals = [\"cat\", \"dog\", \"parrot\"]\n\n\t\tif \"cat\" in animals: pass  # [multiple-statements]\n\t\telse:\n\t\t\tprint(\"no cats!\")",
		goodExample: "\n\t\tanimals = [\"cat\", \"dog\", \"parrot\"]\n\n\t\tif \"cat\" in animals:\n\t\t\tpass\n\t\telse:\n\t\t\tprint(\"no cats!\")",
		description: "More than one statement is found on the same line",
		category: "Format",
		severity: "Major",
		title: "Multiple Statements",
	},
	{
		ruleId: "C0302",
		language: "python",
		badExample: "\n\t\tdef calculate_sum(lst):  # [too-many-lines]\n\t\t\tsum = 0\n\t\t\tfor num in lst:\n\t\t\t\tsum += num\n\t\t\treturn sum\n\n\t\tdef main():\n\t\t\tprint(calculate_sum([1, 2, 3]))\n\t\t\tprint(calculate_sum([10, 20, 30]))",
		goodExample: "",
		description: "A module has too many lines, reducing its readability",
		category: "Format",
		severity: "Major",
		title: "Too Many Lines",
	},
	{
		ruleId: "C0305",
		language: "python",
		badExample: "\n\t\tprint(\"banana\")\n\t\t# The file ends with 2 empty lines # +1: [trailing-newlines]\n\t\t\n\t\t",
		goodExample: "\n\t\tprint(\"banana\")",
		description: "There are trailing blank lines in a file",
		category: "Format",
		severity: "Major",
		title: "Trailing Newlines",
	},
	{
		ruleId: "C0303",
		language: "python",
		badExample: "\n\t\tprint(\"Goodbye\")  \n\t\t# [trailing-whitespace]   # ",
		goodExample: "\n\t\tprint(\"Goodbye\")",
		description: "There is whitespace between the end of a line and the newline",
		category: "Format",
		severity: "Major",
		title: "Trailing Whitespace",
	},
	{
		ruleId: "C0328",
		language: "python",
		badExample: "\n\t\tprint(\"I'm eating breakfast!\")  # CRLF (\r\n) # [unexpected-line-ending-format]\n\t\tprint(\"I'm eating lunch!\")  # CRLF (\r\n) # [unexpected-line-ending-format]",
		goodExample: "\n\t\tprint(\"I'm eating breakfast!\")  # LF (\n)\n\t\tprint(\"I'm eating lunch!\")  # LF (\n)",
		description: "There is a different newline than expected",
		category: "Format",
		severity: "Major",
		title: "Unexpected Line Ending Format",
	},
	{
		ruleId: "C0325",
		language: "python",
		badExample: "\n\t\tname = input()\n\t\tage = input()\n\t\tif (name == age):  # [superfluous-parens]\n\t\t\tpass",
		goodExample: "\n\t\tname = input()\n\t\tage = input()\n\t\tif name == age:\n\t\t\tpass",
		description: "A single item in parentheses follows an `if`, `for`, or other keyword",
		category: "Format",
		severity: "Major",
		title: "Superfluous Parens",
	},
	{
		ruleId: "E0402",
		language: "python",
		badExample: "from ................galaxy import Star  # [relative-beyond-top-level]",
		goodExample: "from universe.galaxy import Star",
		description: "A relative import tries to access too many levels in the current package",
		category: "Imports",
		severity: "Major",
		title: "Relative Beyond Top Level",
	},
	{
		ruleId: "W0406",
		language: "python",
		badExample: "\n\t\tfrom my_module import function_name  # [import-self]\n\n\t\tdef function_name():\n\t\t\tpass",
		goodExample: "",
		description: "A module is importing itself",
		category: "Imports",
		severity: "Critical",
		title: "Import Self",
	},
	{
		ruleId: "W0407",
		language: "python",
		badExample: "import xmlrpc.client  # [preferred-module]",
		goodExample: "import http.client",
		description: "A module imported has a preferred replacement module. They are configured in `.pylintrc` or through CLI arguments",
		category: "Imports",
		severity: "Major",
		title: "Preferred Module",
	},
	{
		ruleId: "W0404",
		language: "python",
		badExample: "import json\nimport json  # [reimported]",
		goodExample: "import json",
		description: "A module is reimported multiple times",
		category: "Imports",
		severity: "Major",
		title: "Reimported",
	},
	{
		ruleId: "W0402",
		language: "python",
		badExample: "import imp  # [deprecated-module]",
		goodExample: "import importlib",
		description: "Used a module marked as deprecated is imported",
		category: "Imports",
		severity: "Major",
		title: "Deprecated Module",
	},
	{
		ruleId: "W0401",
		language: "python",
		badExample: "from os import *  # [wildcard-import]",
		goodExample: "import os\nfrom os.path import join, dirname",
		description: "This is a bad practice because it clutters namespace with unneeded modules, packages, variables, etc. Moreover, it takes time to load them too",
		category: "Imports",
		severity: "Major",
		title: "Wildcard Import",
	},
	{
		ruleId: "W0410",
		language: "python",
		badExample: "import time\nfrom __future__ import division  # [misplaced-future]",
		goodExample: "from __future__ import division\nimport time",
		description: "Python 2.5 and greater require __future__ import to be the first non-docstring statement in the module. This message belongs to the imports checker",
		category: "Imports",
		severity: "Major",
		title: "Misplaced Future",
	},
	{
		ruleId: "R0401",
		language: "python",
		badExample: "def add_numbers():\n\tfrom .helper import add_two_numbers\n\treturn add_two_numbers() + 1",
		goodExample: "def add_two_numbers():\n\treturn 2\n\ndef add_three_numbers():\n\treturn add_two_numbers() + 1",
		description: "A cyclic import between two or more modules is detected",
		category: "Imports",
		severity: "Major",
		title: "Cyclic Import",
	},
	{
		ruleId: "C0411",
		language: "python",
		badExample: "import os\nfrom . import tools\nimport sys  # [wrong-import-order]",
		goodExample: "import os\nimport sys\nfrom . import tools",
		description: "PEP8 import order is not respected (standard imports first, then third-party libraries, then local imports)",
		category: "Imports",
		severity: "Major",
		title: "Wrong Import Order",
	},
	{
		ruleId: "C0413",
		language: "python",
		badExample: "import os\nuser_dir = os.getenv('USER')\nimport sys  # [wrong-import-position]",
		goodExample: "import os\nimport sys\nuser_dir = os.getenv('USER')",
		description: "Code and imports are mixed",
		category: "Imports",
		severity: "Major",
		title: "Wrong Import Position",
	},
	{
		ruleId: "C0414",
		language: "python",
		badExample: "import numpy as numpy  # [useless-import-alias]",
		goodExample: "import numpy as np",
		description: "An import alias is the same as the original package (e.g., using `import numpy as numpy` instead of `import numpy as np`)",
		category: "Imports",
		severity: "Minor",
		title: "Useless Import Alias",
	},
	{
		ruleId: "C0415",
		language: "python",
		badExample: "def get_version():\n\timport platform\n\treturn platform.python_version()",
		goodExample: "import platform\n\ndef get_version():\n\treturn platform.python_version()",
		description: "An import statement is used anywhere other than the module top-level. Move this import to the top of the file",
		category: "Imports",
		severity: "Minor",
		title: "Import Outside Toplevel",
	},
	{
		ruleId: "C0412",
		language: "python",
		badExample: "import os\nimport sys\nimport json\nimport logging.config  # [ungrouped-imports]",
		goodExample: "import os\nimport sys\nimport logging.config\nimport json",
		description: "Imports are not grouped by packages",
		category: "Imports",
		severity: "Minor",
		title: "Ungrouped Imports",
	},
	{
		ruleId: "C0410",
		language: "python",
		badExample: "import os, sys  # [multiple-imports]",
		goodExample: "import os\nimport sys",
		description: "Import statement importing multiple modules is detected",
		category: "Imports",
		severity: "Minor",
		title: "Multiple Imports",
	},
	{
		ruleId: "E1201",
		language: "python",
		badExample: "import logging\nlogging.warning(\"Incorrect version: %\", sys.version)  # [logging-format-truncated]",
		goodExample: "import logging\nlogging.warning(\"Python version: %s\", sys.version)",
		description: "A logging statement format string terminates before the end of a conversion specifier",
		category: "Logging",
		severity: "Minor",
		title: "Logging Format Truncated",
	},
	{
		ruleId: "E1206",
		language: "python",
		badExample: "import logging\ntry:\n\tfunction()\nexcept Exception as e:\n\tlogging.error(\"%s error: %s\", e)  # [logging-too-few-args]",
		goodExample: "import logging\ntry:\n\tfunction()\nexcept Exception as e:\n\tlogging.error(\"%s error: %s\", type(e), e)",
		description: "A logging format string is given too few arguments",
		category: "Logging",
		severity: "Minor",
		title: "Logging Too Few Args",
	},
	{
		ruleId: "E1205",
		language: "python",
		badExample: "import logging\ntry:\n\tfunction()\nexcept Exception as e:\n\tlogging.error(\"Error: %s\", type(e), e)  # [logging-too-many-args]",
		goodExample: "import logging\ntry:\n\tfunction()\nexcept Exception as e:\n\tlogging.error(\"%s error: %s\", type(e), e)",
		description: "A logging format string is given too many arguments",
		category: "Logging",
		severity: "Minor",
		title: "Logging Too Many Args",
	},
	{
		ruleId: "E1200",
		language: "python",
		badExample: "import logging\nlogging.info(\"%s %y\", \"Hello\", \"World\")  # [logging-unsupported-format]",
		goodExample: "import logging\nlogging.info(\"%s %s\", \"Hello\", \"World\")",
		description: "An unsupported format character is used in a logging statement format string",
		category: "Logging",
		severity: "Minor",
		title: "Logging Unsupported Format",
	},
	{
		ruleId: "W1202",
		language: "python",
		badExample: "import logging\nlogging.error(\"Version: {}\".format(sys.version))  # [logging-format-interpolation]",
		goodExample: "logging.error(\"Version: %s\", sys.version)",
		description: "A logging statement uses a call form of `logging.<logging method>(format_string.format(...))`. It’s better to pass the parameters directly to the logging function instead",
		category: "Logging",
		severity: "Minor",
		title: "Logging Format Interpolation",
	},
	{
		ruleId: "W1203",
		language: "python",
		badExample: "\n\t\timport logging\n\t\timport os\n\n\t\tlogging.warning(f\"Current directory: {os.getcwd()}\")  # [logging-fstring-interpolation]",
		goodExample: "\n\t\timport logging\n\t\timport os\n\n\t\tlogging.warning(\"Current directory: %s\", os.getcwd())",
		description: "A logging statement has a call form of \"logging.<logging method>(f\"...\")\". Use another type of string formatting instead. You can use different formatting but leave interpolation to the logging function by passing the parameters as arguments. If logging-format-interpolation is disabled then you can use str.format. If logging-not-lazy is disabled then you can use certain formatting as normal",
		category: "Logging",
		severity: "Major",
		title: "Logging Fstring Interpolation",
	},
	{
		ruleId: "W1201",
		language: "python",
		badExample: "\n\t\timport logging\n\n\t\ttry:\n\t\t\tconnect_to_database()\n\t\texcept DatabaseError as e:\n\t\t\tlogging.error(\"Database connection failed: %s\" % e)  # [logging-not-lazy]\n\t\t\traise",
		goodExample: "\n\t\timport logging\n\n\t\ttry:\n\t\t\tconnect_to_database()\n\t\texcept DatabaseError as e:\n\t\t\tlogging.error(\"Database connection failed: %s\", e)\n\t\t\traise",
		description: "A logging statement has a call form of `logging.<logging method>(format_string % (format_args...))`. Use another type of string formatting instead. You can use different formatting but leave interpolation to the logging function by passing the parameters as arguments. If logging-fstring-interpolation is disabled then you can use fstring formatting. If logging-format-interpolation is disabled then you can use `str.format`",
		category: "Logging",
		severity: "Major",
		title: "Logging Not Lazy",
	},
	// GPT examples
	{
		ruleId: "E1603",
		language: "python",
		badExample: `
		try:
			raise ValueError("An error occurred")
		except ValueError, e:  # Implicit unpacking (invalid in Python 3)
			print(e)`,
		goodExample: `
		try:
			raise ValueError("An error occurred")
		except ValueError as e:  # Explicit unpacking (valid in Python 3)
			print(e)`,
		description: "Implicit unpacking of exceptions is not supported in Python 3 Python3 will not allow implicit unpacking of exceptions in except clauses. See https://www.python.org/dev/peps/pep-3110/",
		category: "Python3",
		severity: "Major",
		title: "Unpacking In Except",
	},
	{
		ruleId: "E1609",
		language: "python",
		badExample: `
		def my_function():
    		from math import *  # Importing * inside a function (invalid)`,
		goodExample: "from math import *  # Importing * at the module level (valid)",
		description: "Import * only allowed at module level Used when the import star syntax is used somewhere else than the module level. This message can't be emitted when using Python >= 3.0",
		category: "Python3",
		severity: "Major",
		title: "Import Star Module Level",
	},
	{
		ruleId: "E1610",
		language: "python",
		badExample: `
		my_bytes = b"non-ASCII character: ü"  # Non-ASCII byte literal (invalid in Python 3)`,
		goodExample: `
		my_string = "non-ASCII character: ü"  # Use string literals for non-ASCII text`,
		description: "Non-ascii bytes literals not supported in 3.x Used when non-ascii bytes literals are found in a program. They are no longer supported in Python 3. This message can't be emitted when using Python >= 3.0",
		category: "Python3",
		severity: "Major",
		title: "Non Ascii Bytes Literal",
	},
	{
		ruleId: "E1602",
		language: "python",
		badExample: `
		exec 'print("Hello, world!")'  # Python 2 style exec statement (invalid in Python 3)`,
		goodExample: `
		exec('print("Hello, world!")')  # Use exec() function in Python 3`,
		description: "Parameter unpacking specified Used when parameter unpacking is specified for a function(Python 3 doesn't allow it)",
		category: "Python3",
		severity: "Major",
		title: "Parameter Unpacking",
	},
	{
		ruleId: "E1606",
		language: "python",
		badExample: `
		my_number = long(100)  # long is not available in Python 3 (invalid)`,
		goodExample: `
		my_number = int(100)  # Use int in Python 3`,
		description: "Use of long suffix Used when \"l\" or \"L\" is used to mark a long integer. This will not work in Python 3, since int and long types have merged. This message can't be emitted when using Python >= 3.0",
		category: "Python3",
		severity: "Major",
		title: "Long Suffix",
	},
	{
		ruleId: "E1608",
		language: "python",
		badExample: `
		class MyClass:  # Old-style class definition (Python 2)
    		pass`,
		goodExample: `
		class MyClass(object):  # New-style class definition (Python 3)
   			pass`,
		description: "Use of old octal literal Used when encountering the old octal syntax, removed in Python 3. To use the new syntax, prepend 0o on the number. This message can't be emitted when using Python >= 3.0",
		category: "Python3",
		severity: "Major",
		title: "Old Octal Literal",
	},
	{
		ruleId: "E1607",
		language: "python",
		badExample: `
		if isinstance(my_var, basestring):  # basestring is not available in Python 3
    		print("It's a string")`,
		goodExample: `
		if isinstance(my_var, str):  # Use str instead in Python 3
    		print("It's a string")`,
		description: "Use of the <> operator Used when the deprecated \"<>\" operator is used instead of \"!=\". This is removed in Python 3. This message can't be emitted when using Python >= 3.0",
		category: "Python3",
		severity: "Major",
		title: "Old Ne Operator",
	},
	{
		ruleId: "E1605",
		language: "python",
		badExample: `
		if x <> y:  # Python 2 style not-equal operator (invalid in Python 3)
    		print("x is not equal to y")`,
		goodExample: `
		if x != y:  # Use != operator in Python 3
    		print("x is not equal to y")`,
		description: "Use of the `` operator Used when the deprecated \"``\" (backtick) operator is used instead of the str() function",
		category: "Python3",
		severity: "Major",
		title: "Backtick",
	},
	{
		ruleId: "E1604",
		language: "python",
		badExample: `
		print "my_var"  # Backticks used for repr (invalid in Python 3)`,
		goodExample: `
		print(repr(my_var))  # Use repr() function instead`,
		description: "Use raise ErrorClass(args) instead of raise ErrorClass, args. Used when the alternate raise syntax 'raise foo, bar' is used instead of 'raise foo(bar)'",
		category: "Python3",
		severity: "Major",
		title: "Old Raise Syntax",
	},
	{
		ruleId: "E1601",
		language: "python",
		badExample: "print \"Hello, world!\"  # Python 2 style print statement (invalid in Python 3)",
		goodExample: "print(\"Hello, world!\")  # Python 3 print function",
		description: "print statement used Used when a print statement is used (print is a function in Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Print Statement",
	},
	{
		ruleId: "W1652",
		language: "python",
		badExample: `
		import types
		my_type = types.SomeDeprecatedField  # Deprecated field (invalid in Python 3)`,
		goodExample: "# Use an alternative valid type or method in Python 3",
		description: "Accessing a deprecated fields on the types module Used when accessing a field on types that has been removed in Python 3",
		category: "Python3",
		severity: "Major",
		title: "Deprecated Types Field",
	},
	{
		ruleId: "W1651",
		language: "python",
		badExample: `
		import string  # Let's assume "string" module is deprecated (hypothetical)`,
		goodExample: "import string_new  # Import updated or alternative module",
		description: "Accessing a deprecated function on the itertools module Used when accessing a function on itertools that has been removed in Python 3",
		category: "Python3",
		severity: "Major",
		title: "Deprecated Itertools Function",
	},
	{
		ruleId: "W1649",
		language: "python",
		badExample: `
		import string
		print(string.uppercase)  # Deprecated in Python 3`,
		goodExample: `
		import string
		print(string.ascii_uppercase)  # Use ascii_uppercase in Python 3`,
		description: "Accessing a deprecated function on the string module Used when accessing a string function that has been deprecated in Python 3",
		category: "Python3",
		severity: "Major",
		title: "Deprecated String Function",
	},
	{
		ruleId: "W1657",
		language: "python",
		badExample: `
		my_list = [1, 2, 3]
		my_list.sort(lambda x: -x)  # Deprecated way of sorting`,
		goodExample: "my_list = sorted(my_list, reverse=True)  # Use sorted() with reverse",
		description: "Accessing a removed attribute on the operator module Used when accessing a field on operator module that has been removed in Python 3",
		category: "Python3",
		severity: "Major",
		title: "Deprecated Operator Function",
	},
	{
		ruleId: "W1660",
		language: "python",
		badExample: `
		my_iter = iter([1, 2, 3])
		value = my_iter.next()  # Use of ".next()" method (invalid in Python 3)`,
		goodExample: `
		value = next(my_iter)  # Use "next()" function instead`,
		description: "Accessing a removed attribute on the sys module Used when accessing a field on sys module that has been removed in Python 3",
		category: "Python3",
		severity: "Major",
		title: "Deprecated Sys Function",
	},
	{
		ruleId: "W1658",
		language: "python",
		badExample: `
		try:
			risky_code()
		except Exception, e:  # Old-style exception handling (invalid in Python 3)
			print(e)`,
		goodExample: `
		try:
			risky_code()
		except Exception as e:  # Use Python 3 style exception handling
			print(e)`,
		description: "Accessing a removed attribute on the urllib module Used when accessing a field on urllib module that has been removed or moved in Python 3",
		category: "Python3",
		severity: "Major",
		title: "Deprecated Urllib Function",
	},
	{
		ruleId: "W1659",
		language: "python",
		badExample: "import MyModule  # Deprecated import",
		goodExample: "from mymodule import new_functionality  # Use updated import",
		description: "Accessing a removed xreadlines attribute Used when accessing the xreadlines() function on a file stream, removed in Python 3",
		category: "Python3",
		severity: "Major",
		title: "Xreadlines Attribute",
	},
	{
		ruleId: "W1623",
		language: "python",
		badExample: `
		my_list = [1, 2, 3]
		print(my_list.has_key(2))  # Example: has_key() method is deprecated (invalid in Python 3)`,
		goodExample: `
		print(2 in my_list)  # Use "in" operator instead of has_key()`,
		description: "Assigning to a class's __metaclass__ attribute Used when a metaclass is specified by assigning to __metaclass__ (Python 3 specifies the metaclass as a class statement argument)",
		category: "Python3",
		severity: "Major",
		title: "Metaclass Assignment",
	},
	// ! no example
	{
		ruleId: "W1622",
		language: "python",
		badExample: "",
		goodExample: "",
		description: "Called a next() method on an object Used when an object's next() method is called (Python 3 uses the next() built-in function)",
		category: "Python3",
		severity: "Major",
		title: "Next Method Called",
	},
	{
		ruleId: "W1620",
		language: "python",
		badExample: `
		my_dict = {"a": 1, "b": 2}
		for key in my_dict.iterkeys():  # iterkeys() is removed in Python 3
			print(key)`,
		goodExample: `
		my_dict = {"a": 1, "b": 2}
		for key in my_dict.keys():  # Use keys() instead
			print(key)`,
		description: "Calling a dict.iter*() method Used for calls to dict.iterkeys(), itervalues() or iteritems() (Python 3 lacks these methods)",
		category: "Python3",
		severity: "Major",
		title: "Dict Iter Method",
	},
	{
		ruleId: "W1621",
		language: "python",
		badExample: `
		my_dict = {"a": 1, "b": 2}
		print(my_dict.viewkeys())  # viewkeys() is removed in Python 3`,
		goodExample: `
		my_dict = {"a": 1, "b": 2}
		print(my_dict.keys())  # Use keys() instead	`,
		description: "Calling a dict.view*() method Used for calls to dict.viewkeys(), viewvalues() or viewitems() (Python 3 lacks these methods)",
		category: "Python3",
		severity: "Major",
		title: "Dict View Method",
	},
	{
		ruleId: "W1645",
		language: "python",
		badExample: `
		try:
			raise Exception("An error occurred")
		except Exception as e:
			print(e.message)  # Exception.message is removed in Python 3`,
		goodExample: `
		try:
			raise Exception("An error occurred")
		except Exception as e:
			print(str(e))  # Use str() to access the error message`,
		description: "Exception.message removed in Python 3 Used when the message attribute is accessed on an Exception. Use str(exception) instead",
		category: "Python3",
		severity: "Major",
		title: "Exception Message Attribute",
	},
	{
		ruleId: "W1641",
		language: "python",
		badExample: `
		class Fruit:  # [eq-without-hash]
			def __init__(self) -> None:
				self.name = "apple"
			def __eq__(self, other: object) -> bool:
				return isinstance(other, Fruit) and other.name == self.name`,
		goodExample: `
		class Fruit:
			def __init__(self) -> None:
				self.name = "apple"
			def __eq__(self, other: object) -> bool:
				return isinstance(other, Fruit) and other.name == self.name
			def __hash__(self) -> int:
				return hash(self.name)`,
		description: "Implementing __eq__ without also implementing __hash__ Used when a class implements __eq__ but not __hash__. In Python 2, objects get object.__hash__ as the default implementation, in Python 3 objects get None as their default __hash__ implementation if they also implement __eq__",
		category: "Python3",
		severity: "Major",
		title: "Eq Without Hash",
	},
	// ! no example
	{
		ruleId: "W1624",
		language: "python",
		badExample: "",
		goodExample: "",
		description: "Indexing exceptions will not work on Python 3 Indexing exceptions will not work on Python 3. Use exception.args[index] instead",
		category: "Python3",
		severity: "Major",
		title: "Indexing Exception",
	},
	// ! no example
	{
		ruleId: "W1648",
		language: "python",
		badExample: "",
		goodExample: "",
		description: "Module moved in Python 3 Used when importing a module that no longer exists in Python 3",
		category: "Python3",
		severity: "Major",
		title: "Bad Python3 Import",
	},
	// ! no example
	{
		ruleId: "W1625",
		language: "python",
		badExample: "",
		goodExample: "",
		description: "Raising a string exception Used when a string exception is raised. This will not work on Python 3",
		category: "Python3",
		severity: "Major",
		title: "Raising String",
	},
	{
		ruleId: "W1611",
		language: "python",
		badExample: `
		try:
			raise StandardError("An error occurred")  # StandardError is removed in Python 3
		except StandardError as e:
			print(e)`,
		goodExample: `
		try:
			raise Exception("An error occurred")  # Use Exception instead
		except Exception as e:
			print(e)`,
		description: "StandardError built-in referenced Used when the StandardError built-in function is referenced (missing from Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Standarderror Builtin",
	},
	// ! no example
	{
		ruleId: "W1662",
		language: "python",
		badExample: "",
		goodExample: "",
		description: "Using a variable that was bound inside a comprehension Emitted when using a variable, that was bound in a comprehension handler, outside of the comprehension itself. On Python 3 these variables will be deleted outside of the comprehension",
		category: "Python3",
		severity: "Major",
		title: "Comprehension Escape",
	},
	// ! no example
	{
		ruleId: "W1661",
		language: "python",
		badExample: "",
		goodExample: "",
		description: "Using an exception object that was bound by an except handler Emitted when using an exception, that was bound in an except handler, outside of the except handler. On Python 3 these exceptions will be deleted once they get out of the except handler",
		category: "Python3",
		severity: "Major",
		title: "Exception Escape",
	},
	// ! no example
	{
		ruleId: "W1650",
		language: "python",
		badExample: "",
		goodExample: "",
		description: "Using str.translate with deprecated deletechars parameters Used when using the deprecated deletechars parameters from str.translate. Use re.sub to remove the desired characters",
		category: "Python3",
		severity: "Major",
		title: "Deprecated Str Translate Call",
	},
	{
		ruleId: "W1640",
		language: "python",
		badExample: `
		my_list = [3, 1, 2]
		my_list.sort(cmp=lambda x, y: x - y)  # cmp argument removed in Python 3`,
		goodExample: `
		from functools import cmp_to_key
		my_list = [3, 1, 2]
		my_list.sort(key=cmp_to_key(lambda x, y: x - y))  # Use cmp_to_key in Python 3`,
		description: "Using the cmp argument for list.sort / sorted Using the cmp argument for list.sort or the sorted builtin should be avoided, since it was removed in Python 3. Using either key or functools.cmp_to_key should be preferred",
		category: "Python3",
		severity: "Major",
		title: "Using Cmp Argument",
	},
	{
		ruleId: "W1630",
		language: "python",
		badExample: `
		class MyClass:
    		def __cmp__(self, other):  # __cmp__ is removed in Python 3
        		return cmp(self.value, other.value)`,
		goodExample: `
		class MyClass:
			def __lt__(self, other):  # Define rich comparison methods instead
				return self.value < other.value`,
		description: "__cmp__ method defined Used when a __cmp__ method is defined (method is not used by Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Cmp Method",
	},
	{
		ruleId: "W1614",
		language: "python",
		badExample: `
		class MyClass:
			def __coerce__(self, other):
				return self.value, other.value  # __coerce__ is not used in Python 3`,
		goodExample: `
		class MyClass:
			def __add__(self, other):
				return self.value + other.value  # Use other rich comparison methods`,
		description: "__coerce__ method defined Used when a __coerce__ method is defined (method is not used by Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Coerce Method",
	},
	{
		ruleId: "W1615",
		language: "python",
		badExample: `
		class MyList(list):
			def __delslice__(self, i, j):  # __delslice__ is not used in Python 3
				del self[i:j]`,
		goodExample: `
		class MyList(list):
			def __delitem__(self, key):  # Use __delitem__ instead
				del self[key]`,
		description: "__delslice__ method defined Used when a __delslice__ method is defined (method is not used by Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Delslice Method",
	},
	{
		ruleId: "W1642",
		language: "python",
		badExample: `
		class MyClass:
			def __div__(self, other):  # __div__ is removed in Python 3
				return self.value / other.value`,
		goodExample: `
		class MyClass:
			def __truediv__(self, other):  # Use __truediv__ instead
				return self.value / other.value`,
		description: "__div__ method defined Used when a __div__ method is defined. Using __truediv__ and setting__div__ = __truediv__ should be preferred.(method is not used by Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Div Method",
	},
	{
		ruleId: "W1616",
		language: "python",
		badExample: `
		class MyList(list):
			def __getslice__(self, i, j):  # __getslice__ is not used in Python 3
				return self[i:j]`,
		goodExample: `
		class MyList(list):
			def __getitem__(self, key):  # Use __getitem__ instead
				return self[key]`,
		description: "__getslice__ method defined Used when a __getslice__ method is defined (method is not used by Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Getslice Method",
	},
	{
		ruleId: "W1628",
		language: "python",
		badExample: `
		class MyClass:
			def __hex__(self):  # __hex__ is not used in Python 3
				return hex(self.value)`,
		goodExample: `
		class MyClass:
			def __repr__(self):  # Use __repr__ or custom method instead
				return f'{self.value:#x}'`,
		description: "__hex__ method defined Used when a __hex__ method is defined (method is not used by Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Hex Method",
	},
	{
		ruleId: "W1643",
		language: "python",
		badExample: `
		class MyClass:
			def __idiv__(self, other):  # __idiv__ is removed in Python 3
				self.value /= other.value`,
		goodExample: `
		class MyClass:
			def __itruediv__(self, other):  # Use __itruediv__ instead
				self.value /= other.value`,
		description: "__idiv__ method defined Used when an __idiv__ method is defined. Using __itruediv__ and setting__idiv__ = __itruediv__ should be preferred.(method is not used by Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Idiv Method",
	},
	{
		ruleId: "W1629",
		language: "python",
		badExample: `
		class MyClass:
			def __nonzero__(self):  # __nonzero__ is removed in Python 3
				return bool(self.value)`,
		goodExample: `
		class MyClass:
			def __bool__(self):  # Use __bool__ instead
				return bool(self.value)`,
		description: "__nonzero__ method defined Used when a __nonzero__ method is defined (method is not used by Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Nonzero Method",
	},
	{
		ruleId: "W1627",
		language: "python",
		badExample: `
		class MyClass:
			def __oct__(self):  # __oct__ is not used in Python 3
				return oct(self.value)`,
		goodExample: `
		class MyClass:
			def __repr__(self):  # Use __repr__ or custom method instead
				return f'{self.value:#o}'`,
		description: "__oct__ method defined Used when an __oct__ method is defined (method is not used by Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Oct Method",
	},
	{
		ruleId: "W1644",
		language: "python",
		badExample: `
		class MyClass:
			def __rdiv__(self, other):  # __rdiv__ is removed in Python 3
				return other.value / self.value`,
		goodExample: `
		class MyClass:
			def __rtruediv__(self, other):  # Use __rtruediv__ instead
				return other.value / self.value`,
		description: "__rdiv__ method defined Used when a __rdiv__ method is defined. Using __rtruediv__ and setting__rdiv__ = __rtruediv__ should be preferred.(method is not used by Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Rdiv Method",
	},
	{
		ruleId: "W1617",
		language: "python",
		badExample: `
		class MyList(list):
			def __setslice__(self, i, j, sequence):  # __setslice__ is removed in Python 3
				self[i:j] = sequence`,
		goodExample: `
		class MyList(list):
			def __setitem__(self, key, value):  # Use __setitem__ instead
				self[key] = value`,
		description: "__setslice__ method defined Used when a __setslice__ method is defined (method is not used by Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Setslice Method",
	},
	{
		ruleId: "W1601",
		language: "python",
		badExample: `
		apply(func, (arg1, arg2))  # apply is removed in Python 3`,
		goodExample: "func(arg1, arg2)  # Direct function call is valid in Python 3",
		description: "apply built-in referenced Used when the apply built-in function is referenced (missing from Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Apply Builtin",
	},
	{
		ruleId: "W1602",
		language: "python",
		badExample: `
		if isinstance(my_var, basestring):  # basestring is removed in Python 3
    		print("It's a string")`,
		goodExample: `
		if isinstance(my_var, str):  # Use str in Python 3
    		print("It's a string")`,
		description: "basestring built-in referenced Used when the basestring built-in function is referenced (missing from Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Basestring Builtin",
	},
	{
		ruleId: "W1603",
		language: "python",
		badExample: "my_buf = buffer(my_var)  # buffer is removed in Python 3",
		goodExample: `
		# buffer functionality is handled differently in Python 3, use memoryview or bytearray
		my_buf = memoryview(my_var)`,
		description: "buffer built-in referenced Used when the buffer built-in function is referenced (missing from Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Buffer Builtin",
	},
	{
		ruleId: "W1604",
		language: "python",
		badExample: `
		result = cmp(a, b)  # cmp is removed in Python 3`,
		goodExample: `
		result = (a > b) - (a < b)  # Use comparison operators in Python 3`,
		description: "cmp built-in referenced Used when the cmp built-in function is referenced (missing from Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Cmp Builtin",
	},
	{
		ruleId: "W1605",
		language: "python",
		badExample: `
		result = coerce(a, b)  # coerce is removed in Python 3`,
		goodExample: "",
		description: "coerce built-in referenced Used when the coerce built-in function is referenced (missing from Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Coerce Builtin",
	},
	{
		ruleId: "W1654",
		language: "python",
		badExample: "my_items = my_dict.items()  # This returns a view object in Python 3",
		goodExample: "my_items = list(my_dict.items())  # Convert to list for Python 3 behavior",
		description: "dict.items referenced when not iterating Used when dict.items is referenced in a non-iterating context (returns an iterator in Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Dict Items Not Iterating",
	},
	{
		ruleId: "W1655",
		language: "python",
		badExample: "my_keys = my_dict.keys()  # This returns a view object in Python 3",
		goodExample: "my_keys = list(my_dict.keys())  # Convert to list for Python 3 behavior",
		description: "dict.keys referenced when not iterating Used when dict.keys is referenced in a non-iterating context (returns an iterator in Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Dict Keys Not Iterating",
	},
	{
		ruleId: "W1656",
		language: "python",
		badExample: "my_values = my_dict.values()  # This returns a view object in Python 3",
		goodExample: "my_values = list(my_dict.values())  # Convert to list for Python 3 behavior",
		description: "dict.values referenced when not iterating Used when dict.values is referenced in a non-iterating context (returns an iterator in Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Dict Values Not Iterating",
	},
	{
		ruleId: "W1619",
		language: "python",
		badExample: "result = 5 / 2  # Returns integer in Python 2 (invalid in Python 3)",
		goodExample: "result = 5 / 2  # Returns float in Python 3; use ",
		description: "division w/o __future__ statement Used for non-floor division w/o a float literal or from __future__ import division (Python 3 returns a float for int division unconditionally)",
		category: "Python3",
		severity: "Major",
		title: "Old Division",
	},
	{
		ruleId: "W1606",
		language: "python",
		badExample: "execfile('script.py')  # execfile is removed in Python 3",
		goodExample: `
		with open('script.py') as file:
    	exec(file.read())  # Use open and exec in Python 3`,
		description: "execfile built-in referenced Used when the execfile built-in function is referenced (missing from Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Execfile Builtin",
	},
	{
		ruleId: "W1607",
		language: "python",
		badExample: `
		file_object = file('example.txt', 'r')  # file is removed in Python 3`,
		goodExample: `
		file_object = open('example.txt', 'r')  # Use open in Python 3`,
		description: "file built-in referenced Used when the file built-in function is referenced (missing from Python 3)",
		category: "Python3",
		severity: "Major",
		title: "File Builtin",
	},
	{
		ruleId: "W1639",
		language: "python",
		badExample: `
		result = filter(lambda x: x > 0, my_list)  # Returns iterator in Python 3, no list (invalid)`,
		goodExample: `
		result = list(filter(lambda x: x > 0, my_list))  # Convert to list for Python 3`,
		description: "filter built-in referenced when not iterating Used when the filter built-in is referenced in a non-iterating context (returns an iterator in Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Filter Builtin Not Iterating",
	},
	{
		ruleId: "W1618",
		language: "python",
		badExample: `
		import mymodule  # Without future import in Python 2`,
		goodExample: `
		from __future__ import absolute_import  # Use absolute imports in Python 3
		import mymodule`,
		description: "import missing `from __future__ import absolute_import` Used when an import is not accompanied by from __future__ import absolute_import (default behaviour in Python 3)",
		category: "Python3",
		severity: "Major",
		title: "No Absolute Import",
	},
	{
		ruleId: "W1632",
		language: "python",
		badExample: `
		user_input = input("Enter something: ")  # Works differently in Python 2`,
		goodExample: `
		user_input = input("Enter something: ")  # Use input in Python 3 (evaluates as string)`,
		description: "input built-in referenced Used when the input built-in is referenced (backwards-incompatible semantics in Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Input Builtin",
	},
	{
		ruleId: "W1634",
		language: "python",
		badExample: `
		my_interned = intern("example")  # intern is moved in Python 3`,
		goodExample: `
		import sys
		my_interned = sys.intern("example")  # Use sys.intern() in Python 3`,
		description: "intern built-in referenced Used when the intern built-in is referenced (Moved to sys.intern in Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Intern Builtin",
	},
	{
		ruleId: "W1608",
		language: "python",
		badExample: `
		my_num = long(123456789)  # long is removed in Python 3`,
		goodExample: `
		my_num = int(123456789)  # Use int in Python 3`,
		description: "long built-in referenced Used when the long built-in function is referenced (missing from Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Long Builtin",
	},
	{
		ruleId: "W1636",
		language: "python",
		badExample: `
		result = map(lambda x: x * 2, my_list)  # Returns an iterator in Python 3`,
		goodExample: `
		result = list(map(lambda x: x * 2, my_list))  # Convert to list in Python 3`,
		description: "map built-in referenced when not iterating Used when the map built-in is referenced in a non-iterating context (returns an iterator in Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Map Builtin Not Iterating",
	},
	{
		ruleId: "W1653",
		language: "python",
		badExample: `
		class MyClass:
			def next(self):  # Treated differently in Python 3
				return 42`,
		goodExample: `
		class MyClass:
			def __next__(self):  # Use __next__ in Python 3
				return 42`,
		description: "next method defined Used when a next method is defined that would be an iterator in Python 2 but is treated as a normal function in Python 3",
		category: "Python3",
		severity: "Major",
		title: "Next Method Defined",
	},
	{
		ruleId: "W1646",
		language: "python",
		badExample: `
		encoded_str = "hello".encode("hex")  # Non-text codec is removed in Python 3`,
		goodExample: `
		import codecs
		encoded_str = codecs.encode("hello", "hex")  # Use codecs module in Python 3`,
		description: "non-text encoding used in str.decode Used when using str.encode or str.decode with a non-text encoding. Use codecs module to handle arbitrary codecs",
		category: "Python3",
		severity: "Major",
		title: "Invalid Str Codec",
	},
	{
		ruleId: "W1638",
		language: "python",
		badExample: `
		result = range(10)  # Returns an iterator in Python 3`,
		goodExample: `
		result = list(range(10))  # Convert to list in Python 3`,
		description: "range built-in referenced when not iterating Used when the range built-in is referenced in a non-iterating context (returns a range in Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Range Builtin Not Iterating",
	},
	{
		ruleId: "W1609",
		language: "python",
		badExample: `
		user_input = raw_input("Enter something: ")  # raw_input is removed in Python 3`,
		goodExample: `
		user_input = input("Enter something: ")  # Use input in Python 3`,
		description: "raw_input built-in referenced Used when the raw_input built-in function is referenced (missing from Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Raw_input Builtin",
	},
	{
		ruleId: "W1610",
		language: "python",
		badExample: `
		from functools import reduce
		result = reduce(lambda x, y: x + y, my_list)  # reduce is removed from built-ins in Python 3`,
		goodExample: `
		from functools import reduce  # Import from functools in Python 3
		result = reduce(lambda x, y: x + y, my_list)`,
		description: "reduce built-in referenced Used when the reduce built-in function is referenced (missing from Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Reduce Builtin",
	},
	{
		ruleId: "W1626",
		language: "python",
		badExample: "reload(mymodule)  # reload is removed in Python 3",
		goodExample: `
		from importlib import reload  # Use importlib.reload in Python 3
		reload(mymodule)`,
		description: "reload built-in referenced Used when the reload built-in function is referenced (missing from Python 3). You can use instead imp.reload or importlib.reload",
		category: "Python3",
		severity: "Major",
		title: "Reload Builtin",
	},
	{
		ruleId: "W1633",
		language: "python",
		badExample: `
		rounded = round(5.675, 2)  # Different behavior in Python 3 for rounding`,
		goodExample: `
		rounded = round(5.675, 2)  # In Python 3, rounding follows "round half to even"`,
		description: "round built-in referenced Used when the round built-in is referenced (backwards-incompatible semantics in Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Round Builtin",
	},
	{
		ruleId: "W1647",
		language: "python",
		badExample: `
		import sys
		print(sys.maxint)  # maxint is removed in Python 3`,
		goodExample: `
		import sys
		print(sys.maxsize)  # Use sys.maxsize in Python 3`,
		description: "sys.maxint removed in Python 3 Used when accessing sys.maxint. Use sys.maxsize instead",
		category: "Python3",
		severity: "Major",
		title: "Sys Max Int",
	},
	{
		ruleId: "W1635",
		language: "python",
		badExample: `
		char = unichr(97)  # unichr is removed in Python 3`,
		goodExample: `
		char = chr(97)  # Use chr in Python 3`,
		description: "unichr built-in referenced Used when the unichr built-in is referenced (Use chr in Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Unichr Builtin",
	},
	{
		ruleId: "W1612",
		language: "python",
		badExample: `
		my_str = unicode("example")  # unicode is removed in Python 3`,
		goodExample: `
		my_str = str("example")  # Use str in Python 3`,
		description: "unicode built-in referenced Used when the unicode built-in function is referenced (missing from Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Unicode Builtin",
	},
	{
		ruleId: "W1613",
		language: "python",
		badExample: `
		for i in xrange(10):  # xrange is removed in Python 3
    		print(i)`,
		goodExample: `
		for i in range(10):  # Use range in Python 3
    		print(i)`,
		description: "xrange built-in referenced Used when the xrange built-in function is referenced (missing from Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Xrange Builtin",
	},
	{
		ruleId: "W1637",
		language: "python",
		badExample: `
		result = zip(list1, list2)  # Returns an iterator in Python 3`,
		goodExample: `
		result = list(zip(list1, list2))  # Convert to list in Python 3`,
		description: "zip built-in referenced when not iterating Used when the zip built-in is referenced in a non-iterating context (returns an iterator in Python 3)",
		category: "Python3",
		severity: "Major",
		title: "Zip Builtin Not Iterating",
	},
	// end of chatGpt examples
	{
		ruleId: "R1726",
		language: "python",
		badExample: "\n\t\tdef has_bananas(bananas) -> bool:\n    \t\treturn bool(bananas or False)  # [simplifiable-condition]",
		goodExample: "\n\t\tdef has_bananas(bananas) -> bool:\n    \t\treturn bool(bananas)",
		description: "A boolean condition is able to be simplified",
		category: "Refactoring",
		severity: "Minor",
		title: "Simplifiable Condition",
	},
	{
		ruleId: "R1727",
		language: "python",
		badExample: "\n\t\tdef is_a_vegetable(vegetable):\n    \t\treturn bool(vegetable in {\"carrot\", \"broccoli\"} or True)  # [condition-evals-to-constant]",
		goodExample: "\n\t\tdef is_a_vegetable(vegetable):\n    \t\treturn vegetable in {\"carrot\", \"broccoli\"}",
		description: "A boolean condition can be simplified to a constant value",
		category: "Refactoring",
		severity: "Minor",
		title: "Condition Evals To Constant",
	},
	{
		ruleId: "R1709",
		language: "python",
		badExample: "\n\t\tdef has_grapes(grapes, oranges=None) -> bool:\n    \t\treturn oranges and False or grapes  # [simplify-boolean-expression]",
		goodExample: "\n\t\tdef has_grapes(grapes, oranges=None) -> bool:\n    \t\treturn grapes",
		description: "Emitted when redundant pre-python 2.5 ternary syntax is used",
		category: "Refactoring",
		severity: "Minor",
		title: "Simplify Boolean Expression",
	},
	{
		ruleId: "R1714",
		language: "python",
		badExample: "\n\t\tdef fruit_is_yellow(fruit):\n\t\t\t# +1: [consider-using-in]\n\t\t\treturn fruit == \"banana\" or fruit == \"lemon\" or fruit == \"pineapple\"",
		goodExample: "\n\t\tdef fruit_is_yellow(fruit):\n    \t\treturn fruit in {\"banana\", \"lemon\", \"pineapple\"}",
		description: "To check if a variable is equal to one of many values, combine the values into a tuple and check if the variable is contained `in` it instead of checking for equality against each of the values. This is faster and less verbose",
		category: "Refactoring",
		severity: "Minor",
		title: "Consider Using In",
	},
	{
		ruleId: "R1701",
		language: "python",
		badExample: "\n\t\tfrom typing import Any\n\n\t\tdef is_string(value: Any) -> bool:\n\t\t\t# +1: [consider-merging-isinstance]\n\t\t\treturn isinstance(value, str) or isinstance(value, bytes)",
		goodExample: "\n\t\tfrom typing import Any\n\n\t\tdef is_string(value: Any) -> bool:\n\t\t\treturn isinstance(value, (str, bytes))",
		description: "Multiple consecutive `isinstance` calls can be merged into one",
		category: "Refactoring",
		severity: "Minor",
		title: "Consider Merging Isinstance",
	},
	{
		ruleId: "R1725",
		language: "python",
		badExample: "\n\t\tclass Fruit:\n    \t\tpass\n\n\t\tclass Banana(Fruit):\n\t\t\tdef __init__(self):\n\t\t\t\tsuper(Banana, self).__init__()  # [super-with-arguments]",
		goodExample: "\n\t\tclass Fruit:\n   \t\t\tpass\n\n\t\tclass Banana(Fruit):\n\t\t\tdef __init__(self):\n\t\t\t\tsuper().__init__()",
		description: "Consider using Python 3 style super() without arguments. Emitted when calling the super() builtin with the current class and instance. On Python 3 these arguments are the default and they can be omitted",
		category: "Refactoring",
		severity: "Minor",
		title: "Super With Arguments",
	},
	{
		ruleId: "R1717",
		language: "python",
		badExample: "\n\t\tfruits = [\"apple\", \"pear\", \"banana\"]\n\n\t\t# +1: [consider-using-dict-comprehension]\n\t\tFRUIT_LENGTHS = dict([(fruit, len(fruit)) for fruit in fruits])",
		goodExample: "\n\t\tfruits = [\"apple\", \"pear\", \"banana\"]\n\n\t\tFRUIT_LENGTHS = {fruit: len(fruit) for fruit in fruits}",
		description: "Emitted when detect the creation of a dictionary using the `dict()` callable and a transient list. Although there is nothing syntactically wrong with this code, it is hard to read and can be simplified to a dict comprehension. Also it is faster since you don't need to create another transient list",
		category: "Refactoring",
		severity: "Minor",
		title: "Consider Using Dict Comprehension",
	},
	{
		ruleId: "R1718",
		language: "python",
		badExample: "\n\t\tfruits = [\"apple\", \"banana\", \"banana\", \"pear\", \"kiwi\", \"kiwi\"]\n\n\t\t# +1: [consider-using-set-comprehension]\n\t\tUNIQUE_FRUITS = set([fruit for fruit in fruits if fruit.startswith('k')])",
		goodExample: "\n\t\tfruits = [\"apple\", \"banana\", \"banana\", \"pear\", \"kiwi\", \"kiwi\"]\n\n\t\tUNIQUE_FRUITS = {fruit for fruit in fruits if fruit.startswith('k')}",
		description: "Although there is nothing syntactically wrong with this code, it is hard to read and can be simplified to a set comprehension. Also, it is faster since you don't need to create another transient list",
		category: "Refactoring",
		severity: "Minor",
		title: "Consider Using Set Comprehension",
	},
	{
		ruleId: "R1715",
		language: "python",
		badExample: "\n\t\tknights = {\"Arthur\": \"the brave\", \"Lancelot\": \"the noble\"}\n\n\t\tif \"Arthur\" in knights:  # [consider-using-get]\n\t\t\tDESCRIPTION = knights[\"Arthur\"]\n\t\telse:\n\t\t\tDESCRIPTION = \"\"",
		goodExample: "\n\t\tknights = {\"Arthur\": \"the brave\", \"Lancelot\": \"the noble\"}\n\n\t\tdescription = knights.get(\"Arthur\", \"\")",
		description: "Using the builtin `dict.get` for key lookups is preferred to avoid `KeyError` exceptions",
		category: "Refactoring",
		severity: "Minor",
		title: "Consider Using Get",
	},
	{
		ruleId: "R1713",
		language: "python",
		badExample: "\n"
            + "\t\tdef numbers_to_string(numbers):\n"
            + "\t\t\tformatted_number = ''\n"
            + "\t\t\tfor number in numbers:\n"
            + "\t\t\t\tformatted_number += str(number)  # [consider-using-join]\n"
            + "\t\t\treturn formatted_number\n"
            + "\n"
            + "\t\tprint(numbers_to_string([1, 2, 3]))",
		goodExample: "print(''.join(map(str, [1, 2, 3])))",
		description: "Using `str.join(sequence)` is faster, uses less memory and increases readability compared to for-loop iteration",
		category: "Refactoring",
		severity: "Minor",
		title: "Consider Using Join",
	},
	{
		ruleId: "R1722",
		language: "python",
		badExample: "\n"
            + "\t\tif __name__ == '__main__':\n"
            + "\t\t\tage = input('Enter your age: ')\n"
            + "\t\t\tprint(f'Your age is {age}')\n"
            + "\t\t\texit(0)  # [consider-using-sys-exit]",
		goodExample: "\n"
            + "\t\timport sys\n"
            + "\n"
            + "\t\tif __name__ == '__main__':\n"
            + "\t\t\tage = input('Enter your age: ')\n"
            + "\t\t\tprint(f'Your age is {age}')\n"
            + "\t\t\tsys.exit(0)",
		description: "Instead of using `exit()` or `quit()`, consider using the `sys.exit()`",
		category: "Refactoring",
		severity: "Minor",
		title: "Consider Using Sys Exit",
	},
	{
		ruleId: "R1706",
		language: "python",
		badExample: "\n\t\ta, b = 5, 10\n\t\tresult = a > b and a or b  # [consider-using-ternary]",
		goodExample: "\n\t\ta, b = 5, 10\n\t\tresult = a if a > b else b",
		description: "One of known pre-python 2.5 ternary syntax is used",
		category: "Refactoring",
		severity: "Minor",
		title: "Consider Using Ternary",
	},
	{
		ruleId: "R1712",
		language: "python",
		badExample: "\n"
            + "\t\tx = 3\n"
            + "\t\ty = 5\n"
            + "\n"
            + "\t\ttemp = x  # [consider-swap-variables]\n"
            + "\t\tx = y\n"
            + "\t\ty = temp",
		goodExample: "\n\t\tx = 3\n\t\ty = 5\n\n\t\tx, y = y, x",
		description: "You do not have to use a temporary variable in order to swap variables. Using `tuple unpacking` to directly swap variables makes the intention more clear",
		category: "Refactoring",
		severity: "Minor",
		title: "Consider Swap Variables",
	},
	{
		ruleId: "R1707",
		language: "python",
		badExample: "DIRECTIONS = 'left', 'right', 'up', 'down',  # [trailing-comma-tuple]",
		goodExample: "DIRECTIONS = ('left', 'right', 'up', 'down')",
		description: "In Python, a tuple is created by the comma symbol, not by parentheses. Using a trailing comma can create unwanted tuples, so always use parentheses for clarity.",
		category: "Refactoring",
		severity: "Minor",
		title: "Trailing Comma Tuple",
	},
	{
		ruleId: "R1708",
		language: "python",
		badExample: "\n"
            + "\t\tdef color_generator():\n"
            + "\t\t\tfor color in ['red', 'blue']:\n"
            + "\t\t\t\tyield color\n"
            + "\t\t\traise StopIteration  # [stop-iteration-return]",
		goodExample: "\n"
            + "\t\tdef color_generator():\n"
            + "\t\t\t\"\"\"No need for an explicit return in this simple case.\"\"\"\n"
            + "\t\t\tfor color in ['red', 'blue']:\n"
            + "\t\t\t\tyield color",
		description: "According to PEP479, raising `StopIteration` in a generator can lead to bugs. It's better to rely on the natural termination of a generator.",
		category: "Refactoring",
		severity: "Minor",
		title: "Stop Iteration Return",
	},
	{
		ruleId: "R1710",
		language: "python",
		badExample: "\n"
            + "\t\tdef find_maximum(value: int) -> int | None:  # [inconsistent-return-statements]\n"
            + "\t\t\tif value > 0:\n"
            + "\t\t\t\treturn value",
		goodExample: "\n"
            + "\t\tdef find_maximum(value: int) -> int | None:\n"
            + "\t\t\tif value > 0:\n"
            + "\t\t\t\treturn value\n"
            + "\t\t\treturn None",
		description: "All `return` statements in a function should be consistent. If some return a value, others should explicitly return `None`.",
		category: "Refactoring",
		severity: "Minor",
		title: "Inconsistent Return Statements",
	},
	{
		ruleId: "R1704",
		language: "python",
		badExample: "\n"
            + "\t\tdef calculate(radius=5.5):\n"
            + "\t\t\t# +1: [redefined-argument-from-local]\n"
            + "\t\t\tfor radius, area in [(3, 28.27), (5, 78.54)]:\n"
            + "\t\t\t\tprint(radius, area)",
		goodExample: "\n"
            + "\t\tdef calculate(radius=5.5):\n"
            + "\t\t\tfor r, area in [(3, 28.27), (5, 78.54)]:\n"
            + "\t\t\t\tprint(radius, r, area)",
		description: "A local name is redefining an argument, which might suggest a potential error. This is relevant for iterations and similar constructs.",
		category: "Refactoring",
		severity: "Minor",
		title: "Redefined Argument From Local",
	},
	{
		ruleId: "R1716",
		language: "python",
		badExample: "\n\t\tfor fruit in fruits:\n\t\t\tif fruit in UNIQUE_FRUITS:  # [consider-using-in]\n\t\t\t\tprint(fruit)\n\t\t\t\tcontinue\n\t\t\tprint(fruit)\n",
		goodExample: "\n\t\tfor fruit in fruits:\n\t\t\tif fruit in UNIQUE_FRUITS:\n\t\t\t\tprint(fruit)\n\t\t\t\tcontinue\n\t\t\telse:\n\t\t\t\tprint(fruit)\n",
		description: "When testing for membership in a collection inside a loop, it is preferable to structure your loop to avoid deeply nested blocks. Using `continue` statements can lead to complex control flows, which is harder to read and maintain.",
		category: "Refactoring",
		severity: "Minor",
		title: "Consider Using In",
	},
	{
		ruleId: "R1719",
		language: "python",
		badExample: "\n\t\tVEHICLES = [\"car\", \"boat\", \"rocket\", \"this example\"]\n\n\t\tdef is_vehicle(an_object):\n\t\t\treturn True if an_object in VEHICLES else False  # [simplifiable-if-expression]\n\n\n\t\tdef is_not_vehicle(an_object):\n\t\t\treturn False if an_object in VEHICLES else True  # [simplifiable-if-expression]",
		goodExample: "\n\t\tVEHICLES = [\"car\", \"boat\", \"rocket\", \"this example\"]\n\n\t\tdef is_vehicle(an_object):\n\t\t\treturn an_object in VEHICLES\n\n\t\tdef is_not_vehicle(an_object):\n\t\t\treturn an_object not in VEHICLES",
		description: "An if expression can be replaced with `bool(test)`",
		category: "Refactoring",
		severity: "Minor",
		title: "Simplifiable If Expression",
	},
	{
		ruleId: "R1703",
		language: "python",
		badExample: "\n\t\tWILD_ANIMALS = [\"lion\", \"tiger\", \"elephant\", \"this example\"]\n\n\t\tdef is_wild_animal(an_object):\n\t\t\t# +1: [simplifiable-if-statement]\n\t\t\tif isinstance(an_object, Animal) and an_object in WILD_ANIMALS:\n\t\t\t\tis_wild = True\n\t\t\telse:\n\t\t\t\tis_wild = False\n    \treturn is_wild",
		goodExample: "\n\t\tWILD_ANIMALS = [\"lion\", \"tiger\", \"elephant\", \"this example\"]\n\n\t\tdef is_wild_animal(an_object):\n\t\t\tis_wild = isinstance(an_object, Animal) and an_object.name in WILD_ANIMALS\n\t\t\treturn is_wild",
		description: "An if statement can be replaced with `bool(test)`",
		category: "Refactoring",
		severity: "Minor",
		title: "Simplifiable If Statement",
	},
	{
		ruleId: "R1702",
		language: "python",
		badExample: "\n\t\tdef validate_colors(colors):\n\t\t\tif len(colors) > 2:  # [too-many-nested-blocks]\n\t\t\t\tif \"red\" in colors:\n\t\t\t\t\tif \"blue\" in colors:\n\t\t\t\t\t\tcount = colors[\"blue\"]\n\t\t\t\t\t\tif count % 2:\n\t\t\t\t\t\t\tif \"green\" in colors:\n\t\t\t\t\t\t\t\tif count == 2:\n\t\t\t\t\t\t\t\t\treturn True\n    \t\treturn False",
		goodExample: "\n\t\tdef validate_colors(colors):\n\t\t\tif len(colors) > 2 and \"red\" in colors and \"blue\" in colors:\n\t\t\t\tcount = colors[\"blue\"]\n\t\t\t\tif count % 2 and \"green\" in colors and count == 2:\n\t\t\t\t\treturn True\n    \t\treturn False",
		description: "A function or a method has too many nested blocks. This makes the code less understandable and maintainable. Maximum number of nested blocks for function / method body is 5 by default",
		category: "Refactoring",
		severity: "Minor",
		title: "Too Many Nested Blocks",
	},
	{
		ruleId: "R1723",
		language: "python",
		badExample: "\n\t\tdef next_ten_numbers(iterator):\n\t\t\tfor i, item in enumerate(iterator):\n\t\t\t\tif i == 10:  # [no-else-break]\n\t\t\t\t\tbreak\n\t\t\t\telse:\n\t\t\t\t\tyield item",
		goodExample: "\n\t\tdef next_ten_numbers(iterator):\n\t\t\tfor i, item in enumerate(iterator):\n\t\t\t\tif i == 10:\n\t\t\t\t\tbreak\n\t\t\t\tyield item",
		description: "Used in order to highlight an unnecessary block of code following an `if` containing a `break` statement. As such, it will warn when it encounters an `else` following a chain of `if`s, all of them containing a `break` statement",
		category: "Refactoring",
		severity: "Minor",
		title: "No Else Break",
	},
	{
		ruleId: "R1724",
		language: "python",
		badExample: "\n\t\tdef odd_number_under(n: int):\n\t\t\tfor i in range(n):\n\t\t\t\tif i % 2 == 0:  # [no-else-continue]\n\t\t\t\t\tcontinue\n\t\t\t\telse:\n\t\t\t\t\tyield i",
		goodExample: "\n\t\tdef odd_number_under(n: int):\n\t\t\tfor i in range(n):\n\t\t\t\tif i % 2 == 0:\n\t\t\t\t\tcontinue\n\t\t\t\tyield i",
		description: "Used in order to highlight an unnecessary block of code following an `if` containing a `continue` statement. As such, it will warn when it encounters an `else` following a chain of `if`s, all of them containing a `continue` statement",
		category: "Refactoring",
		severity: "Minor",
		title: "No Else Continue",
	},
	{
		ruleId: "R1720",
		language: "python",
		badExample: "\n\t\tdef float_sum(a: float, b: float) -> float:\n\t\t\tif not (isinstance(a, float) and isinstance(b, float)):  # [no-else-raise]\n\t\t\t\traise ValueError(\"Function supports only float parameters.\")\n\t\t\telse:\n\t\t\t\treturn a + b",
		goodExample: "\n\t\tdef float_sum(a: float, b: float) -> float:\n\t\t\tif not (isinstance(a, float) and isinstance(b, float)):\n\t\t\t\traise ValueError(\"Function supports only float parameters.\")\n\t\t\treturn a + b",
		description: "Used in order to highlight an unnecessary block of code following an `if` containing a `raise` statement. As such, it will warn when it encounters an `else` following a chain of `if`s, all of them containing a `raise` statement",
		category: "Refactoring",
		severity: "Minor",
		title: "No Else Raise",
	},
	{
		ruleId: "R1705",
		language: "python",
		badExample: "\n\t\tdef compare_strings(a: str, b: str) -> int:\n\t\t\tif a == b:  # [no-else-return]\n\t\t\t\treturn 0\n\t\t\telif a < b:\n\t\t\t\treturn -1\n\t\t\telse:\n\t\t\t\treturn 1",
		goodExample: "\n\t\tdef compare_strings(a: str, b: str) -> int:\n\t\t\tif a == b:\n\t\t\t\treturn 0\n\t\t\tif a < b:\n\t\t\t\treturn -1\n\t\t\treturn 1",
		description: "Unnecessary `else` after `return`. Used in order to highlight an unnecessary block of code following an if containing a `return` statement. As such, it will warn when it encounters an `else` following a chain of ifs, all of them containing a `return` statement",
		category: "Refactoring",
		severity: "Minor",
		title: "No Else Return",
	},
	{
		ruleId: "R1721",
		language: "python",
		badExample: "\n\t\tANIMALS = [\"cat\", \"dog\", \"fish\", \"this example\"]\n\n\t\tUNIQUE_ANIMALS = {animal for animal in ANIMALS}  # [unnecessary-comprehension]",
		goodExample: "\n\t\tANIMALS = [\"cat\", \"dog\", \"fish\", \"this example\"]\n\n\t\tUNIQUE_ANIMALS = set(ANIMALS)",
		description: "Instead of using an identity comprehension, consider using the `list`, `dict` or `set` constructor. It is faster and simpler",
		category: "Refactoring",
		severity: "Minor",
		title: "Unnecessary Comprehension",
	},
	{
		ruleId: "R1711",
		language: "python",
		badExample: "\n\t\timport os\n\n\t\tdef show_current_directory():\n\t\t\treturn os.getcwd()  # [useless-return]",
		goodExample: "\n\t\timport os\n\n\t\tdef show_current_directory():\n\t\t\tprint(os.getcwd())",
		description: "A function is returning a value that is unnecessary. This could be useful to identify functions that should simply be called for their side effects",
		category: "Refactoring",
		severity: "Minor",
		title: "Useless Return",
	},
	{
		ruleId: "C0113",
		language: "python",
		badExample: "if not (x == y):  # [unneeded-not]",
		goodExample: "if x != y:",
		description: "A boolean expression contains an unnecessary negation. Removing it increases readability and avoids potential confusion.",
		category: "Refactoring",
		severity: "Minor",
		title: "Unneeded Not",
	},
	{
		ruleId: "C0201",
		language: "python",
		badExample: "\n"
            + "\t\tCARS = {'Toyota': 3, 'Honda': 5, 'Ford': 2}\n"
            + "\n"
            + "\t\tfor car in CARS.keys():  # [consider-iterating-dictionary]\n"
            + "\t\t\tprint(car)",
		goodExample: "\n"
            + "\t\tCARS = {'Toyota': 3, 'Honda': 5, 'Ford': 2}\n"
            + "\n"
            + "\t\tfor car in CARS:\n"
            + "\t\t\tprint(car)",
		description: "When iterating over a dictionary, there's no need to explicitly use `.keys()`. Just iterate through the dictionary itself for simplicity.",
		category: "Refactoring",
		severity: "Minor",
		title: "Consider Iterating Dictionary",
	},
	{
		ruleId: "C0200",
		language: "python",
		badExample: "\n\t\tdef is_square(n):\n\t\t\treturn n == n ** 0.5  # [fuzzy-comparison]\n\n\t\tdef is_cube(n):\n\t\t\treturn n == n ** (1/3)  # [fuzzy-comparison]",
		goodExample: "\n\t\tdef is_square(n):\n\t\t\treturn n ** 2 == n\n\n\t\tdef is_cube(n):\n\t\t\treturn n ** (1/3) == n",
		description: "Fuzzy comparisons can produce unexpected results. Use a mathematical equivalence instead.",
		category: "Refactoring",
		severity: "Minor",
		title: "Fuzzy Comparison",
	},
	{
		ruleId: "C1801",
		language: "python",
		badExample: "if len(sequence) == 0:  # [unnecessary-length-check]",
		goodExample: "if not sequence:  # More Pythonic way to check for an empty sequence",
		description: "Pylint detects that `len(sequence)` is being used without explicit comparison inside a condition to determine if a sequence is empty. Instead of coercing the length to a boolean, either rely on the fact that empty sequences are false or compare the length against a scalar.",
		category: "Refactoring",
		severity: "Minor",
		title: "Len As Condition",
	},
	{
		ruleId: "E1507",
		language: "python",
		badExample: "\n\t\timport os\n\t\tos.getenv(True)  # [invalid-envvar-value]",
		goodExample: "\n\t\timport os\n\n\t\tos.getenv(\"TRUE\")",
		description: "Env manipulation functions support only string type arguments.",
		category: "Stdlib",
		severity: "Critical",
		title: "Invalid Envvar Value",
	},
	{
		ruleId: "W1501",
		language: "python",
		badExample: "\n\t\tdef open_and_get_content(file_path):\n   \t\t\twith open(file_path, \"abc\") as file:  # [bad-open-mode]\n        \t\treturn file.read()",
		goodExample: "\n\t\tdef open_and_get_content(file_path):\n    \t\twith open(file_path, \"r\") as file:\n        \t\treturn file.read()",
		description: "Python supports `r`, `w`, `a[, x]` modes with `b,` `+,` and `U `(only with `r)` options.",
		category: "Stdlib",
		severity: "Critical",
		title: "Bad Open Mode",
	},
	{
		ruleId: "W1508",
		language: "python",
		badExample: "\n\t\timport os\n\t\tenv = os.getenv(\"API_URL\", [])  # [invalid-envvar-default]",
		goodExample: "\n\t\timport os\n\t\tenv = os.getenv(\"API_URL\", \"default_value\")",
		description: "Env manipulation functions `return None` or `str` values. Supplying anything different as a default may cause bugs. See https://docs.python.org/3/library/os.html#os.getenv for more details.",
		category: "Stdlib",
		severity: "Major",
		title: "Invalid Envvar Default",
	},
	{
		ruleId: "W1503",
		language: "python",
		badExample: "\n\t\timport unittest\n\n\t\tclass DummyTestCase(unittest.TestCase):\n\t\t\tdef test_dummy(self):\n\t\t\t\tself.assertTrue(1)  # [redundant-unittest-assert]",
		goodExample: "\n\t\timport unittest\n\n\t\tclass DummyTestCase(unittest.TestCase):\n\t\t\tdef test_dummy(self):\n\t\t\t\tactual = \"result\"\n\t\t\t\tself.assertEqual(actual, \"expected\")",
		description: "The first argument of `assertTrue` and `assertFalse` is a condition. If a constant is passed as a parameter, that condition will always be true. In this case, a warning should be emitted.",
		category: "Stdlib",
		severity: "Major",
		title: "Redundant Unittest Assert",
	},
	{
		ruleId: "W1507",
		language: "python",
		badExample: "\n\t\timport copy\n\t\timport os\n\n\t\tcopied_env = copy.deepcopy(os.environ)  # [deep-copy-environ]",
		goodExample: "\n\t\timport os\n\n\t\tcopied_env = os.environ.copy()",
		description: "`os.environ` is not a `dict` object but a proxy object, so a deep copy may still affect the original object. See https://bugs.python.org/issue15373 for reference.",
		category: "Stdlib",
		severity: "Major",
		title: "Shallow Copy Environ",
	},
	{
		ruleId: "W1502",
		language: "python",
		badExample: "\n\t\timport datetime\n\n\t\tif not datetime.date(2000, 1, 1):  # [boolean-datetime]\n\t\t\tprint(\"Date is valid.\")",
		goodExample: "\n\t\timport datetime\n\n\t\ttoday = datetime.date.today()\n\t\tif today >= datetime.date(2000, 1, 1):\n\t\t\tprint(\"Date is valid.\")",
		description: "Using `datetime.date` in a boolean context can hide subtle bugs when the date they represent is a specific value like the epoch. This behavior was fixed in Python 3.5. See http://bugs.python.org/issue13936 for reference. It can't be emitted when using Python >= 3.5.",
		category: "Stdlib",
		severity: "Major",
		title: "Boolean Datetime",
	},
	{
		ruleId: "W1505",
		language: "python",
		badExample: "old_function()  # [deprecated-function]",
		goodExample: "new_function()",
		description: "The method is marked as deprecated and will be removed in a future version of Python. Consider looking for an alternative in the documentation.",
		category: "Stdlib",
		severity: "Major",
		title: "Deprecated Method",
	},
	{
		ruleId: "W1509",
		language: "python",
		badExample: "\n\t\timport subprocess\n\n\t\tdef do_nothing():\n\t\t\tpass\n\n\t\tsubprocess.Popen(preexec_fn=do_nothing)  # [subprocess-popen-preexec-fn]",
		goodExample: "\n\t\timport subprocess\n\n\tsubprocess.Popen()",
		description: "The `preexec_fn` parameter is not safe to use in the presence of threads in your application. The child process could deadlock before `exec` is called. If you must use it, keep it trivial! Minimize the number of libraries you call into.",
		category: "Stdlib",
		severity: "Major",
		title: "Subprocess Popen Preexec Fn",
	},
	{
		ruleId: "W1510",
		language: "python",
		badExample: "\n\t\timport subprocess\n\t\tproc = subprocess.run([\"echo\", \"Hello World\"])  # [subprocess-run-check]",
		goodExample: "\n\t\timport subprocess\n\t\tproc = subprocess.run([\"echo\", \"Hello World\"], check=False)",
		description: "The check parameter should always be used with explicitly set `check` keyword to make clear what the error-handling behavior is.",
		category: "Stdlib",
		severity: "Major",
		title: "Subprocess Run Check",
	},
	{
		ruleId: "W1506",
		language: "python",
		badExample: "\n\t\timport threading\n\n\t\tdef thread_function():\n\t\t\tprint(\"Thread running\")\n\n\t\tthread = threading.Thread(target=thread_function, args=None)  # [bad-thread-instantiation]\n\t\tthread.start()",
		goodExample: "\n\t\timport threading\n\n\t\tdef thread_function(n):\n\t\t\tprint(n)\n\n\t\tthread = threading.Thread(target=thread_function, args=(5,))\n\t\tthread.start()",
		description: "The warning is emitted when a `threading.Thread` class is instantiated without the target function being passed. By default, the first parameter is the `group` param, not the `target` param.",
		category: "Stdlib",
		severity: "Major",
		title: "Bad Thread Instantiation",
	},
	{
		ruleId: "E1307",
		language: "python",
		badExample: "print(\"%s\" % 10)  # [bad-string-format-type]",
		goodExample: "print(\"%s\" % \"10\")",
		description: "A type required by the format string is not suitable for the actual argument type.",
		category: "Strings",
		severity: "Critical",
		title: "Bad String Format Type",
	},
	{
		ruleId: "E1303",
		language: "python",
		badExample: "print(\"%(a)s %(b)s\" % [\"foo\", \"bar\"])  # [format-needs-mapping]",
		goodExample: "print(\"%(a)s %(b)s\" % {\"a\": \"foo\", \"b\": \"bar\"})",
		description: "A format string that uses named conversion specifiers is used with an argument that is not a mapping",
		category: "Strings",
		severity: "Critical",
		title: "Format Needs Mapping",
	},
	{
		ruleId: "E1301",
		language: "python",
		badExample: "\n\t\tNUM_1 = 5\n\n\t\tprint(\"value %2\" % NUM_1)  # [truncated-format-string]",
		goodExample: "\n\t\tNUM_1 = 5\n\n\t\tprint(f\"value {NUM_1}\")",
		description: "A format string terminates before the end of a conversion specifier",
		category: "Strings",
		severity: "Critical",
		title: "Truncated Format String",
	},
	{
		ruleId: "E1304",
		language: "python",
		badExample: "\n\t\t# +1: [missing-format-string-key]\n\t\tvegetable_prices = \"\"\"\n\t\tCarrot: %(carrot_price)d ¤\n\t\tPotato: %(potato_price)d ¤\n\t\t\"\"\" % {\n\t\t\t\"carrot_price\": 30\n\t\t}",
		goodExample: "\n\t\tvegetable_prices = \"\"\"\n\t\tCarrot: %(carrot_price)d ¤\n\t\tPotato: %(potato_price)d ¤\n\t\t\"\"\" % {\n\t\t\t\"carrot_price\": 30,\n\t\t\t\"potato_price\": 45,\n\t\t}",
		description: "A format string that uses named conversion specifiers is used with a dictionary that doesn't contain all the keys required by the format string",
		category: "Strings",
		severity: "Critical",
		title: "Missing Format String Key",
	},
	{
		ruleId: "E1302",
		language: "python",
		badExample: "print(\"a=%(a)d, b=%d\" % (2, 3))  # [mixed-format-string]",
		goodExample: "print(\"a=%(a)d, b=%(b)d\" % {\"a\": 2, \"b\": 3})",
		description: "A format string contains both named and unnamed conversion specifiers. This is also used when a named conversion specifier contains * for the minimum field width and/or precision",
		category: "Strings",
		severity: "Critical",
		title: "Mixed Format String",
	},
	{
		ruleId: "E1306",
		language: "python",
		badExample: "print(\"The weather is {0}, and tomorrow will be {1}\".format(\"sunny\"))  # [too-few-format-args]",
		goodExample: "print(\"The weather is {0}, and tomorrow will be {1}\".format(\"sunny\", \"cloudy\"))",
		description: "A format string that uses unnamed conversion specifiers is given too few arguments",
		category: "Strings",
		severity: "Critical",
		title: "Too Few Format Args",
	},
	{
		ruleId: "E1310",
		language: "python",
		badExample: "\n\t\t\"Python Programming\".strip(\"Pyt\")  # [bad-str-strip-call]\n\t\t# >>> 'hon Programming'",
		goodExample: "\n\t\t\"Python Programming\".strip(\"Pytho\")\n\t\t# >>> 'n Programming'",
		description: "The argument to a `str.{l,r,}strip` call contains a duplicate character",
		category: "Strings",
		severity: "Critical",
		title: "Bad Str Strip Call",
	},
	{
		ruleId: "E1305",
		language: "python",
		badExample: "\n\t\t# +1: [too-many-format-args]\n\t\tprint(\"This year is {0}, next year will be {1}\".format(\"2023\", \"2024\", \"2025\"))",
		goodExample: "print(\"This year is {0}, next year will be {1}\".format(\"2023\", \"2024\"))",
		description: "A format string that uses unnamed conversion specifiers is given too many arguments",
		category: "Strings",
		severity: "Critical",
		title: "Too Many Format Args",
	},
	{
		ruleId: "E1300",
		language: "python",
		badExample: "print(\"%d %q\" % (10, 20))  # [bad-format-character]",
		goodExample: "print(\"%d %d\" % (10, 20))",
		description: "An unsupported format character is used in a format string",
		category: "Strings",
		severity: "Critical",
		title: "Bad Format Character",
	},
	{
		ruleId: "W1402",
		language: "python",
		badExample: "print(b\"%𐍈\" % b\"data\")  # [anomalous-unicode-escape-in-string]",
		goodExample: String.raw`print(b"\x50\u2341" % b"data")`,
		description: String.raw`An escape like \u is encountered in a byte string where it has no effect`,
		category: "Strings",
		severity: "Critical",
		title: "Anomalous Unicode Escape In String",
	},
	{
		ruleId: "W1401",
		language: "python",
		badExample: String.raw`path = "c:\folder"  # [syntax-error]`,
		goodExample: String.raw`path = "c:\\folder"`,
		description: "A backslash is in a literal string but not as an escape",
		category: "Strings",
		severity: "Critical",
		title: "Anomalous Backslash In String",
	},
	{
		ruleId: "W1308",
		language: "python",
		badExample: "\n\t\t# pylint: disable=missing-docstring, consider-using-f-string\n\n\t\tSKY = \"sky ☁️\"\n\t\tSTAR = \"star ✨\"\n\n\t\t# +1: [duplicate-string-formatting-argument,duplicate-string-formatting-argument]\n\t\tCONST = \"\"\"\n\t\tTwinkle twinkle little {}, {}\n\t\tHow I wonder what you {}, {}\n\t\tUp above the world so {}, {}\n\t\tLike a diamond in the {}, {}!\n\t\t\"\"\".format(\n\t\t\tSTAR,\n\t\t\tSTAR,\n\t\t\tSKY,\n\t\t\tSKY,\n\t\t\tSKY,\n\t\t\tSTAR,\n\t\t\tSTAR\n\t\t)",
		goodExample: "\n\t\t# pylint: disable=missing-docstring, consider-using-f-string\n\n\t\tSKY = \"sky ☁️\"\n\t\tSTAR = \"star ✨\"\n\n\t\tCONST = \"\"\"\n\t\tTwinkle twinkle little {star}, {star}\n\t\tHow I wonder what you {sky}, {sky}\n\t\tUp above the world so {sky}, {sky}\n\t\tLike a diamond in the {star}, {star}!\n\t\t\"\"\".format(\n\t\t\tstar=STAR, sky=SKY\n\t\t)",
		description: "We detect that a string formatting is repeating an argument instead of using named string arguments",
		category: "Strings",
		severity: "Major",
		title: "Duplicate String Formatting Argument",
	},
	{
		ruleId: "W1305",
		language: "python",
		badExample: "print(\"{} {2}\".format(\"apple\", \"banana\"))  # [format-combined-specification]",
		goodExample: "print(\"{0} {1}\".format(\"apple\", \"banana\"))",
		description: "A PEP 3101 format string contains both automatic field numbering (e.g. `{}`) and manual field specification (e.g. `{0}`)",
		category: "Strings",
		severity: "Major",
		title: "Format Combined Specification",
	},
	{
		ruleId: "W1300",
		language: "python",
		badExample: "print(\"%(key1)s\" % {\"key1\": \"value\", 100: \"num\"})  # [bad-format-string-key]",
		goodExample: "print(\"%(key1)s, %(key2)s\" % {\"key1\": \"value\", \"key2\": \"num\"})",
		description: "A format string that uses named conversion specifiers is used with a dictionary whose keys are not all strings",
		category: "Strings",
		severity: "Major",
		title: "Bad Format String Key",
	},
	{
		ruleId: "W1404",
		language: "python",
		badExample: "\n\t\twith open(\"file.txt\" \"w\") as f:  # [implicit-str-concat]\n    \tf.write(\"data\")",
		goodExample: "\n\t\twith open(\"file.txt\", \"w\") as f:\n    \tf.write(\"data\")",
		description: "Implicit string concatenation found. String literals are implicitly concatenated in a literal iterable definition: maybe a comma is missing?",
		category: "Strings",
		severity: "Major",
		title: "Implicit Str Concat",
	},
	{
		ruleId: "W1302",
		language: "python",
		badExample: "print(\"{b[0] * b[1]}\".format(b=[2, 3]))  # [bad-format-string]",
		goodExample: "print(\"{b[0]} * {b[1]}\".format(b=[2, 3]))",
		description: "A PEP 3101 format string is invalid",
		category: "Strings",
		severity: "Major",
		title: "Bad Format String",
	},
	{
		ruleId: "W1306",
		language: "python",
		badExample: "print(\"{0.imag}\".format(5))  # [missing-format-attribute]",
		goodExample: "print(\"{0.imag}\".format(5j))",
		description: "A PEP 3101 format string uses an attribute specifier ({0.real}), but the argument passed for formatting doesn't have that attribute",
		category: "Strings",
		severity: "Major",
		title: "Missing Format Attribute",
	},
	{
		ruleId: "W1303",
		language: "python",
		badExample: "print(\"My pet is a {type} named {name}\".format(type=\"dog\"))  # [missing-format-argument-key]",
		goodExample: "print(\"My pet is a {type} named {name}\".format(type=\"dog\", name=\"Buddy\"))",
		description: "A PEP 3101 format string that uses named fields doesn't receive one or more required keywords",
		category: "Strings",
		severity: "Major",
		title: "Missing Format Argument Key",
	},
	{
		ruleId: "W1405",
		language: "python",
		badExample: "\n\t\timport time\n\n\t\tprint('Current time: ', time.strftime(\"%H:%M:%S\")) # [inconsistent-quotes]",
		goodExample: "\n\t\timport time\n\n\t\tprint(\"Current time: \", time.strftime(\"%H:%M:%S\"))",
		description: "Quote delimiter is inconsistent with the rest of the file. Quote delimiters are not used consistently throughout a module (with allowances made for avoiding unnecessary escaping)",
		category: "Strings",
		severity: "Major",
		title: "Inconsistent Quotes",
	},
	{
		ruleId: "W1304",
		language: "python",
		badExample: "print(\"{a} {b}\".format(a=4, b=5, c=6))  # [unused-format-string-argument]",
		goodExample: "print(\"{a} {b} {c}\".format(a=4, b=5, c=6))",
		description: "A PEP 3101 format string that uses named fields is used with an argument that is not required by the format string",
		category: "Strings",
		severity: "Major",
		title: "Unused Format String Argument",
	},
	{
		ruleId: "W1301",
		language: "python",
		badExample: "\n\t\t\"The lazy %(animal)s sleeps all day.\" % {\n\t\t\t\"animal\": \"cat\",\n\t\t\t\"activity\": \"jumps\",\n\t\t}\n\t\t# -4: [unused-format-string-key]",
		goodExample: "\n\t\t\"The lazy %(animal)s %(activity)s all day.\" % {\n\t\t\t\"animal\": \"cat\",\n\t\t\t\"activity\": \"jumps\",\n\t\t}",
		description: "A format string that uses named conversion specifiers is used with a dictionary that contains keys not required by the format string",
		category: "Strings",
		severity: "Major",
		title: "Unused Format String Key",
	},
	{
		ruleId: "W1309",
		language: "python",
		badExample: "\n\t\tx = 3\n\t\ty = 4\n\t\tprint(f\"x multiplied by y equals x * y\")  # [f-string-without-interpolation]",
		goodExample: "\n\t\tx = 3\n\t\ty = 4\n\t\tprint(f\"{x} multiplied by {y} equals {x * y}\")",
		description: "Using an f-string that does not have any interpolated variables. This occurs when an f-string is used, but it can be a normal string or a potential bug in the code",
		category: "Strings",
		severity: "Major",
		title: "F String Without Interpolation",
	},
	{
		ruleId: "W1307",
		language: "python",
		badExample: "\n\t\tfruits = [\"mango\"]\n\t\tprint('The third fruit is {fruits[2]}'.format(fruits=fruits))  # [invalid-format-index]",
		goodExample: "\n\t\tfruits = [\"mango\", \"apple\", \"banana\"]\n\t\tprint(\"The third fruit is {fruits[2]}\".format(fruits=fruits))",
		description: "A PEP 3101 format string uses a lookup specifier (`{a[2]}`), but the argument passed for formatting doesn't contain or doesn't have that key as an attribute",
		category: "Strings",
		severity: "Major",
		title: "Invalid Format Index",
	},
	{
		ruleId: "E1137",
		language: "python",
		badExample: "\n\t\tdef get_colors(colors):\n\t\t\tfor color in colors:\n\t\t\t\tprint(color)\n\n\t\tget_colors([\"blue\"])[0] = \"red\"  # [unsupported-assignment-operation]",
		goodExample: "\n\t\tdef get_colors(colors):\n\t\t\tfor color in colors:\n\t\t\t\tprint(color)\n\n\t\t\treturn []\n\n\t\tget_colors([\"blue\"])[0] = \"red\"",
		description: "Emitted when an object does not support item assignment (i.e., doesn't define the `__setitem__` method)",
		category: "Typechecker",
		severity: "Major",
		title: "Unsupported Assignment Operation",
	},
	{
		ruleId: "E1138",
		language: "python",
		badExample: "\n\t\tVEGETABLES = (\"carrot\", \"tomato\", \"pepper\")\n\n\t\tdel VEGETABLES[1]  # [unsupported-delete-operation]",
		goodExample: "\n\t\tVEGETABLES = [\"carrot\", \"tomato\", \"pepper\"]\n\n\t\tdel VEGETABLES[1]",
		description: "Emitted when an object does not support item deletion (i.e. doesn't define `__delitem__` method)",
		category: "Typechecker",
		severity: "Major",
		title: "Unsupported Delete Operation",
	},
	{
		ruleId: "E1130",
		language: "python",
		badExample: "\n\t\tcookies = 5\n\t\tmissing_cookies = str\n\t\tcookies = -missing_cookies  # [invalid-unary-operand-type]",
		goodExample: "\n\t\tcookies = 5\n\t\tmissing_cookies = 2\n\t\tcookies -= missing_cookies",
		description: "Emitted when a unary operand is used on an object which does not support this type of operation",
		category: "Typechecker",
		severity: "Major",
		title: "Invalid Unary Operand Type",
	},
	{
		ruleId: "E1131",
		language: "python",
		badExample: "\n\t\tcolor = \"blue\" & None  # [unsupported-binary-operation]\n\t\tshape = {} | None  # [unsupported-binary-operation]",
		goodExample: "\n\t\tmasked = 0b110101 & 0b101001\n\t\tresult = 0xABCD | 0x1234",
		description: "Emitted when a binary arithmetic operation between two operands is not supported",
		category: "Typechecker",
		severity: "Major",
		title: "Unsupported Binary Operation",
	},
	{
		ruleId: "E1101",
		language: "python",
		badExample: "\n\t\tfrom os import path\n\n\t\tlocation = path(\".\").drives  # [no-member]\n\n\t\tclass Dog:\n\t\t\tdef bark(self):\n\t\t\t\tprint(\"Bark\")\n\n\t\tDog().run()  # [no-member]",
		goodExample: "\n\t\tfrom os import path\n\n\t\tlocation = path.abspath(\".\")\n\n\t\tclass Dog:\n\t\t\tdef bark(self):\n\t\t\t\tprint(\"Bark\")\n\n\t\tDog().bark()",
		description: "A variable is accessed for a non-existent member",
		category: "Typechecker",
		severity: "Major",
		title: "No Member",
	},
	{
		ruleId: "E1102",
		language: "python",
		badExample: "\n\t\tAGE = 25\n\t\tprint(AGE())  # [not-callable]",
		goodExample: "\n\t\tAGE = 25\n\t\tprint(AGE)",
		description: "An object being called has been inferred to a non callable object",
		category: "Typechecker",
		severity: "Major",
		title: "Not Callable",
	},
	{
		ruleId: "E1124",
		language: "python",
		badExample: "\n\t\tdef cube(x):\n\t\t\treturn x * x * x\n\n\t\tcube(3, x=2)  # [redundant-keyword-arg]",
		goodExample: "\n\t\tdef cube(x):\n\t\t\treturn x * x * x\n\n\t\tcube(3)",
		description: "A function call would result in assigning multiple values to a function parameter, one value from a positional argument and one from a keyword argument",
		category: "Typechecker",
		severity: "Major",
		title: "Redundant Keyword Arg",
	},
	{
		ruleId: "E1111",
		language: "python",
		badExample: "\n\t\tdef subtract(x, y):\n\t\t\tprint(x - y)\n\n\t\tresult = subtract(7, 3)  # [assignment-from-no-return]",
		goodExample: "\n\t\tdef subtract(x, y):\n\t\t\treturn x - y\n\n\t\tresult = subtract(7, 3)",
		description: "An assignment is done on a function call but the inferred function doesn't return anything",
		category: "Typechecker",
		severity: "Major",
		title: "Assignment From No Return",
	},
	{
		ruleId: "E1128",
		language: "python",
		badExample: "\n\t\tdef compute():\n\t\t\treturn None\n\n\t\tresult = compute()  # [assignment-from-none]",
		goodExample: "\n\t\tdef compute():\n\t\t\treturn None\n\n\t\tresult = compute() if compute() else 42",
		description: "An assignment is done on a function call but the inferred function returns nothing but `None`",
		category: "Typechecker",
		severity: "Major",
		title: "Assignment From None",
	},
	{
		ruleId: "E1129",
		language: "python",
		badExample: "\n\t\tclass MyFileHandler:\n\t\t\tdef __enter__(self):\n\t\t\t\tprint('Opening file')\n\n\t\twith MyFileHandler() as f:  # [not-context-manager]\n\t\t\tprint('Processing file')",
		goodExample: "\n\t\tclass MyFileHandler:\n\t\t\tdef __enter__(self):\n\t\t\t\tprint('Opening file')\n\n\t\t\tdef __exit__(self, *exc):\n\t\t\t\tprint('Closing file')\n\n\t\twith MyFileHandler() as f:\n\t\t\tprint('Processing file')",
		description: "An instance in a with statement doesn't implement the context manager protocol (`__enter__`/`__exit__`)",
		category: "Typechecker",
		severity: "Major",
		title: "Not Context Manager",
	},
	{
		ruleId: "E1140",
		language: "python",
		badExample: "\n\t\td = {[1, 2, 3]: 'numbers'}  # [unhashable-dict-key]",
		goodExample: "\n\t\td = {(1, 2, 3): 'tuple-key'}",
		description: "Emitted when a dict key is not hashable (i.e. doesn't define __hash__ method)",
		category: "Typechecker",
		severity: "Critical",
		title: "Unhashable Dict Key",
	},
	{
		ruleId: "E1132",
		language: "python",
		badExample: "\n\t\tdef greet(name, msg='Hello'):\n\t\t\treturn f'{msg}, {name}'\n\n\t\tgreet('John', msg='Hi', **{'msg': 'Welcome'})  # [repeated-keyword]",
		goodExample: "\n\t\tdef greet(name, msg='Hello'):\n\t\t\treturn f'{msg}, {name}'\n\n\t\tgreet('John', msg='Hi')",
		description: "Emitted when a function call got multiple values for a keyword",
		category: "Typechecker",
		severity: "Critical",
		title: "Repeated Keyword",
	},
	{
		ruleId: "E1139",
		language: "python",
		badExample: "\n\t\tclass Car(metaclass=str):  # [invalid-metaclass]\n    \t\tpass",
		goodExample: "\n\t\tclass Vehicle:\n    \t\tpass\n\n\t\tclass Car(Vehicle):\n\t\t\tpass",
		description: "Emitted whenever we can detect that a class is using, as a metaclass, something which might be invalid for using as a metaclass",
		category: "Typechecker",
		severity: "Critical",
		title: "Invalid Metaclass",
	},
	{
		ruleId: "E1125",
		language: "python",
		badExample: "\n\t\tdef divide(dividend, *, divisor):\n\t\t\treturn dividend / divisor\n\n\t\tdef calculate(*args, **kwargs):\n\t\t\tdivide(*args)  # [missing-kwoa]",
		goodExample: "\n\t\tdef divide(dividend, *, divisor):\n\t\t\treturn dividend / divisor\n\n\t\tdef calculate(*args, **kwargs):\n\t\t\tdivide(*args, **kwargs)",
		description: "A function call does not pass a mandatory keyword-only argument",
		category: "Typechecker",
		severity: "Critical",
		title: "Missing Kwoa",
	},
	{
		ruleId: "E1120",
		language: "python",
		badExample: "\n\t\tdef multiply(x, y):\n    \t\treturn x * y\n\n\t\tmultiply(4)  # [no-value-for-parameter]",
		goodExample: "\n\t\tdef multiply(x, y):\n\t\t\treturn x * y\n\n\t\tmultiply(4, 5)",
		description: "A function call passes too few arguments",
		category: "Typechecker",
		severity: "Critical",
		title: "No Value For Parameter",
	},
	{
		ruleId: "E1133",
		language: "python",
		badExample: "\n\t\tfor char in 100:  # [not-an-iterable]\n    \t\tpass",
		goodExample: "\n\t\tfor char in '100':\n    \t\tpass",
		description: "A non-iterable value is used in place where an iterable is expected",
		category: "Typechecker",
		severity: "Critical",
		title: "Not An Iterable",
	},
	{
		ruleId: "E1134",
		language: "python",
		badExample: "\n\t\tdef print_animals(**animals):\n\t\t\tprint(animals)\n\n\t\tprint_animals(**list('cat', 'dog'))  # [not-a-mapping]",
		goodExample: "\n\t\tdef print_animals(**animals):\n\t\t\tprint(animals)\n\n\t\tprint_animals(**dict(cat=1, dog=2))",
		description: "A non-mapping value is used in place where mapping is expected",
		category: "Typechecker",
		severity: "Critical",
		title: "Not A Mapping",
	},
	{
		ruleId: "E1126",
		language: "python",
		badExample: "\n\t\tcolors = ['red', 'green', 'blue']\n\t\tprint(colors['green'])  # [invalid-sequence-index]",
		goodExample: "\n\t\tcolors = ['red', 'green', 'blue']\n\t\tprint(colors[1])",
		description: "A sequence type is indexed with an invalid type. Valid types are ints, slices, and objects with an `__index__` method",
		category: "Typechecker",
		severity: "Critical",
		title: "Invalid Sequence Index",
	},
	{
		ruleId: "E1127",
		language: "python",
		badExample: "\n\t\tNUMBERS = [1, 2, 3, 4]\n\n\t\tFIRST_TWO = NUMBERS[:\"2\"]  # [invalid-slice-index]",
		goodExample: "\n\t\tNUMBERS = [1, 2, 3, 4]\n\n\t\tFIRST_TWO = NUMBERS[:2]",
		description: "A slice index is not an integer, `None`, or an `object` with an `__index__` method",
		category: "Typechecker",
		severity: "Critical",
		title: "Invalid Slice Index",
	},
	{
		ruleId: "E1121",
		language: "python",
		badExample: "\n\t\tclass Vehicle:\n\t\t\tdef __init__(self, type):\n\t\t\t\tself.type = type\n\n\t\tcar = Vehicle(\"sedan\", \"car\", \"2024\")  # [too-many-function-args]",
		goodExample: "\n\t\tclass Vehicle:\n\t\t\tdef __init__(self, type, model):\n\t\t\t\tself.type = type\n\t\t\t\tself.model = model\n\n\t\tcar = Vehicle(\"sedan\", \"2024\")",
		description: "A function call passes too many positional arguments. Maximum number of arguments for function/method is 5 by default",
		category: "Typechecker",
		severity: "Critical",
		title: "Too Many Function Args",
	},
	{
		ruleId: "E1123",
		language: "python",
		badExample: "\n\t\tdef greet(name=\"John\", age=25):\n\t\t\tprint(f\"Name: {name}, Age: {age}\")\n\n\t\tgreet(name=\"Alice\", age=30, gender=\"female\")  # [unexpected-keyword-arg]",
		goodExample: "\n\t\tdef greet(name=\"John\", age=25):\n\t\t\tprint(f\"Name: {name}, Age: {age}\")\n\n\t\tgreet(name=\"Alice\", age=30)",
		description: "A function call passes a keyword argument that doesn't correspond to one of the function's parameter names",
		category: "Typechecker",
		severity: "Critical",
		title: "Unexpected Keyword Arg",
	},
	{
		ruleId: "E1141",
		language: "python",
		badExample: "\n\t\tcapitals = {\"France\": \"Paris\", \"Japan\": \"Tokyo\", \"USA\": \"Washington D.C.\"}\n\t\tfor country, capital in capitals:  # [dict-iter-missing-items]\n\t\t\tprint(f\"{country} has capital {capital}.\")",
		goodExample: "\n\t\tcapitals = {\"France\": \"Paris\", \"Japan\": \"Tokyo\", \"USA\": \"Washington D.C.\"}\n\t\tfor country, capital in capitals.items():\n\t\t\tprint(f\"{country} has capital {capital}.\")",
		description: "Emitted when trying to iterate through a dict without calling `.items()`",
		category: "Typechecker",
		severity: "Critical",
		title: "Dict Iter Missing Items",
	},
	{
		ruleId: "E1135",
		language: "python",
		badExample: "\n\t\tclass Animal:\n\t\t\tpass\n\n\t\tdog = \"dog\" in Animal()  # [unsupported-membership-test]",
		goodExample: "\n\t\tclass Animal:\n\t\t\tANIMALS = [\"dog\", \"cat\"]\n\n\t\t\tdef __contains__(self, name):\n\t\t\t\treturn name in self.ANIMALS\n\n\t\tdog = \"dog\" in Animal()",
		description: "Emitted when an instance in membership test expression doesn't implement membership protocol (`__contains__`/`__iter__`/`__getitem__`)",
		category: "Typechecker",
		severity: "Critical",
		title: "Unsupported Membership Test",
	},
	{
		ruleId: "E1136",
		language: "python",
		badExample: "\n\t\tclass Car:\n\t\t\tpass\n\n\t\tCar()[0]  # [unsubscriptable-object]",
		goodExample: "\n\t\tclass Car:\n\t\t\tdef __init__(self):\n\t\t\t\tself.models = [\"Sedan\", \"SUV\", \"Truck\"]\n\n\t\t\tdef __getitem__(self, idx):\n\t\t\t\treturn self.models[idx]\n\n\t\tCar()[0]",
		description: "Emitted when a subscripted value doesn't support subscription (i.e. doesn't define `__getitem__` method or `__class_getitem__` for a class)",
		category: "Typechecker",
		severity: "Critical",
		title: "Unsubscriptable Object",
	},
	{
		ruleId: "W1113",
		language: "python",
		badExample: "\n\t\tdef sum_values(x=None, *nums):  # [keyword-arg-before-vararg]\n    \t\treturn sum(nums) + (x if x else 0)",
		goodExample: "\n\t\tdef sum_values(*nums, x=None):\n    \t\treturn sum(nums) + (x if x else 0)",
		description: "When defining a keyword argument before variable positional arguments, one can end up in having multiple values passed for the aforementioned parameter in case the method is called with keyword arguments",
		category: "Typechecker",
		severity: "Critical",
		title: "Keyword Arg Before Vararg",
	},
	{
		ruleId: "W1115",
		language: "python",
		badExample: "\n\t\tclass Car:\n\t\t\tpass\n\n\t\tCar.__name__ = 100  # [non-str-assignment-to-dunder-name]",
		goodExample: "\n\t\tclass Car:\n\t\t\tpass\n\n\t\tCar.__name__ = \"Sedan\"",
		description: "Non-string value assigned to __name__ Emitted when a non-string value is assigned to __name__",
		category: "Typechecker",
		severity: "Major",
		title: "Non Str Assignment To Dunder Name",
	},
	{
		ruleId: "W1114",
		language: "python",
		badExample: "\n\t\tdef process_args(first, second, third):\n\t\t\treturn first, second, third\n\n\t\tdef call_with_wrong_order():\n\t\t\tfirst = 1\n\t\t\tsecond = 2\n\t\t\tthird = 3\n\n\t\t\tprocess_args(  # [arguments-out-of-order]\n\t\t\t\tfirst, third, second\n\t\t\t)",
		goodExample: "\n\t\tdef process_args(first, second, third):\n\t\t\treturn first, second, third\n\n\t\tdef call_with_correct_order():\n\t\t\tfirst = 1\n\t\t\tsecond = 2\n\t\t\tthird = 3\n\n\t\t\tprocess_args(first, second, third)",
		description: "Emitted when the caller's argument names fully match the parameter names in the function signature but do not have the same order",
		category: "Typechecker",
		severity: "Major",
		title: "Arguments Out Of Order",
	},
	{
		ruleId: "W1116",
		language: "python",
		badExample: "isinstance([1, 2, 3], dict)  # [isinstance-second-argument-not-valid-type]",
		goodExample: "isinstance([1, 2, 3], list)",
		description: "Second argument of isinstance is not a type Emitted when the second argument of an isinstance call is not a type",
		category: "Typechecker",
		severity: "Major",
		title: "Isinstance Second Argument Not Valid Type",
	},
	{
		ruleId: "I1101",
		language: "python",
		badExample: "",
		goodExample: "",
		description: "A variable is accessed for non-existent member of C extension. Due to unavailability of source static analysis is impossible, but it may be performed by introspecting living objects in run-time",
		category: "Typechecker",
		severity: "Major",
		title: "C Extension No Member",
	},
	{
		ruleId: "E0633",
		language: "python",
		badExample: "a, b, c = 5  # [unpacking-non-sequence]",
		goodExample: "a, b, c = 1, 2, 3",
		description: "Something which is not a sequence is used in an unpack assignment",
		category: "Variables",
		severity: "Major",
		title: "Unpacking Non Sequence",
	},
	{
		ruleId: "E0604",
		language: "python",
		badExample: "\n\t\t__all__ = (\n\t\t\tNone,  # [invalid-all-object]\n\t\t\tCar,\n\t\t\tBike,\n\t\t)\n\n\t\tclass Car:\n\t\t\tpass\n\n\t\tclass Bike:\n\t\t\tpass",
		goodExample: "\n\t\t__all__ = [\"Car\", \"Bike\"]\n\n\t\tclass Car:\n\t\t\tpass\n\n\t\tclass Bike:\n\t\t\tpass",
		description: "An invalid (non-string) object occurs in `__all__`",
		category: "Variables",
		severity: "Major",
		title: "Invalid All Object",
	},
	{
		ruleId: "E0611",
		language: "python",
		badExample: "from sys import sandwich  # [no-name-in-module]",
		goodExample: "from sys import version",
		description: "A name cannot be found in a module",
		category: "Variables",
		severity: "Major",
		title: "No Name In Module",
	},
	{
		ruleId: "E0602",
		language: "python",
		badExample: "print(speed + 5)  # [undefined-variable]",
		goodExample: "\n\t\tspeed = 60\n\t\tprint(speed + 5)",
		description: "An undefined variable is accessed",
		category: "Variables",
		severity: "Major",
		title: "Undefined Variable",
	},
	{
		ruleId: "E0603",
		language: "python",
		badExample: "\n\t\t__all__ = [\"calculate_area\"]  # [undefined-all-variable]\n\n\t\tdef calc_area():\n\t\t\tpass",
		goodExample: "\n\t\t__all__ = [\"calc_area\"]\n\n\t\tdef calc_area():\n\t\t\tpass",
		description: "An undefined variable name is referenced in __all__",
		category: "Variables",
		severity: "Major",
		title: "Undefined All Variable",
	},
	{
		ruleId: "E0601",
		language: "python",
		badExample: "\n\t\tprint(greeting)  # [used-before-assignment]\n\t\tgreeting = \"Hi there!\"",
		goodExample: "\n\t\tgreeting = \"Hi there!\"\n\t\tprint(greeting)",
		description: "A local variable is accessed before its assignment",
		category: "Variables",
		severity: "Major",
		title: "Used Before Assignment",
	},
	{
		ruleId: "W0640",
		language: "python",
		badExample: "\n\t\tdef parent_greeting(people):\n\t\t\tmessages = []\n\t\t\tfor person in people:\n\n\t\t\t\tdef say_hi():\n\t\t\t\t\t# do something\n\t\t\t\t\tprint(f\"Hi, {person}!\")  # [cell-var-from-loop]\n\n\t\t\t\tif person.isalpha():\n\t\t\t\t\tmessages.append(say_hi)\n\n\t\t\tfor say_hi in messages:\n\t\t\t\t# the \"person\" variable is evaluated when the function is called here,\n\t\t\t\t# which is the last value it had in the loop - \"Unknown\"\n\t\t\t\tsay_hi()\n\n\n\t\tparent_greeting([\"John\", \"Paul\", \"George\", \"Ringo\"])\n\t\t# \"Hi, Ringo!\"\n\t\t# \"Hi, Ringo!\"\n\t\t# \"Hi, Ringo!\"\n\t\t# \"Hi, Ringo!\"",
		description: "A variable used in a closure is defined in a loop. This will result in all closures using the same value for the closed-over variable",
		category: "Variables",
		severity: "Major",
		title: "Cell Var From Loop",
	},
	{
		ruleId: "W0601",
		language: "python",
		badExample: "\n\t\tdef update_vegetable():\n\t\t\tglobal VEGETABLE  # [global-variable-undefined]\n\t\t\tVEGETABLE = \"potato\"",
		goodExample: "\n\t\tVEGETABLE = \"carrot\"\n\n\t\tdef update_vegetable():\n\t\t\tglobal VEGETABLE\n\t\t\tVEGETABLE = \"potato\"",
		description: "A variable is defined through the `global` statement but the variable is not defined in the module scope",
		category: "Variables",
		severity: "Major",
		title: "Global Variable Undefined",
	},
	{
		ruleId: "W0642",
		language: "python",
		badExample: "\n\t\tclass Vehicle:\n\t\t\t@classmethod\n\t\t\tdef list_vehicles(cls):\n\t\t\t\tcls = \"car\"  # [self-cls-assignment]\n\n\t\t\tdef print_speed(self, *speeds):\n\t\t\t\tself = \"fast\"  # [self-cls-assignment]\n\t\t\t\tspeed = speeds[0]\n\t\t\t\tprint(speed)",
		goodExample: "\n\t\tclass Vehicle:\n\t\t\t@classmethod\n\t\t\tdef list_vehicles(cls):\n\t\t\t\tvehicle = \"car\"\n\t\t\t\tprint(vehicle)\n\n\t\t\tdef print_speed(self, *speeds):\n\t\t\t\tspeed = speeds[0]\n\t\t\t\tprint(speed)",
		description: "Invalid assignment to self or cls in instance or class method respectively",
		category: "Variables",
		severity: "Major",
		title: "Self Cls Assignment",
	},
	{
		ruleId: "W0632",
		language: "python",
		badExample: "\n\t\tcolors = (\"red\", \"green\", \"blue\", \"yellow\")\n\t\tred, green = colors  # [unbalanced-tuple-unpacking]",
		goodExample: "\n\t\tcolors = (\"red\", \"green\", \"blue\", \"yellow\")\n\t\tred, green, *others = colors",
		description: "There is an unbalanced tuple unpacking in assignment",
		category: "Variables",
		severity: "Major",
		title: "Unbalanced Tuple Unpacking",
	},
	{
		ruleId: "W0641",
		language: "python",
		badExample: "\n\t\tdef choose_color(colors):\n\t\t\tprint(colors)\n\t\t\thue = \"blue\"  # [possibly-unused-variable]\n\t\t\treturn locals()",
		goodExample: "\n\t\tdef choose_color(colors):\n\t\t\tcurrent_locals = locals()\n\t\t\tprint(colors)\n\t\t\thue = \"blue\"\n\t\t\tprint(hue)\n\t\t\treturn current_locals",
		description: "A variable is defined but might not be used. The possibility comes from the fact that `locals()` might be used, which could consume or not the said variable",
		category: "Variables",
		severity: "Major",
		title: "Possibly Unused Variable",
	},
	{
		ruleId: "W0622",
		language: "python",
		badExample: "\n\t\tdef list():  # [redefined-builtin]\n    \t\tpass",
		goodExample: "\n\t\tdef list_items():\n    \t\tpass",
		description: "A variable or function overrides a built-in",
		category: "Variables",
		severity: "Major",
		title: "Redefined Builtin",
	},
	{
		ruleId: "W0623",
		language: "python",
		badExample: "\n\t\ttry:\n\t\t\t1/0\n\t\texcept ZeroDivisionError as e:\n\t\t\te = 'Error occurred'  # [redefine-in-handler]",
		goodExample: "\n\t\ttry:\n\t\t\t1/0\n\t\texcept ZeroDivisionError as err:\n\t\t\terr = 'Error occurred'",
		description: "An exception handler assigns the exception to an existing name",
		category: "Variables",
		severity: "Major",
		title: "Redefine In Handler",
	},
	{
		ruleId: "W0621",
		language: "python",
		badExample: "\n\t\tcounter = 20\n\n\t\tdef count_down(counter):  # [redefined-outer-name]\n\t\t\tfor i in range(counter, 0, -1):\n\t\t\t\tprint(i)",
		goodExample: "\n\t\tcounter = 20\n\n\t\tdef count_down(limit):\n\t\t\tfor i in range(limit, 0, -1):\n\t\t\t\tprint(i)",
		description: "A variable's name hides a name defined in the outer scope",
		category: "Variables",
		severity: "Major",
		title: "Redefined Outer Name",
	},
	{
		ruleId: "W0611",
		language: "python",
		badExample: "\n\t\tfrom os import getenv\n\t\tfrom datetime import datetime  # [unused-import]\n\n\t\tAPI_KEY = getenv('API_KEY')",
		goodExample: "\n\t\tfrom os import getenv\n\n\t\tAPI_KEY = getenv('API_KEY')",
		description: "An imported module or variable is not used",
		category: "Variables",
		severity: "Major",
		title: "Unused Import",
	},
	{
		ruleId: "W0613",
		language: "python",
		badExample: "\n\t\tdef area(length, width):  # [unused-argument]\n    \t\treturn length * length",
		goodExample: "\n\t\tdef area(length, width):\n    \t\treturn length * width",
		description: "A function or method argument is not used",
		category: "Variables",
		severity: "Major",
		title: "Unused Argument",
	},
	{
		ruleId: "W0614",
		language: "python",
		badExample: "\n\t\tfrom collections import *  # [unused-wildcard-import]\n\n\t\tCounter(['apple', 'orange', 'banana'])",
		goodExample: "\n\t\tfrom collections import Counter\n\n\t\tCounter(['apple', 'orange', 'banana'])",
		description: "An imported module or variable is not used from a `'from X import *'` style import",
		category: "Variables",
		severity: "Major",
		title: "Unused Wildcard Import",
	},
	{
		ruleId: "W0612",
		language: "python",
		badExample: "\n\t\tdef greet():\n\t\t\tfirst_name = \"John\"\n\t\t\tlast_name = \"Doe\"  # [unused-variable]\n\t\t\tprint(f\"Hello {first_name}\")",
		goodExample: "\n\t\tdef greet():\n\t\t\tfirst_name = \"John\"\n\t\t\tlast_name = \"Doe\"\n\t\t\tprint(f\"Hello {first_name} {last_name}\")",
		description: "A variable is defined but not used",
		category: "Variables",
		severity: "Major",
		title: "Unused Variable",
	},
	{
		ruleId: "W0602",
		language: "python",
		badExample: "\n\t\tFRUIT = \"apple\"\n\n\t\tdef update_fruit():\n\t\t\tglobal FRUIT  # [global-variable-not-assigned]\n\t\t\tprint(FRUIT)",
		goodExample: "\n\t\tFRUIT = \"apple\"\n\n\t\tdef update_fruit():\n\t\t\tglobal FRUIT\n\t\t\tFRUIT = \"banana\"",
		description: "A variable is defined through the `global` statement but no assignment to this variable is done",
		category: "Variables",
		severity: "Major",
		title: "Global Variable Not Assigned",
	},
	{
		ruleId: "W0631",
		language: "python",
		badExample: "\n\t\tdef find_odd_number(numbers):\n\t\t\tfor x in numbers:\n\t\t\t\tif x % 2 != 0:\n\t\t\t\t\tbreak\n\t\t\treturn x  # [undefined-loop-variable]",
		goodExample: "\n\t\tdef find_odd_number(numbers):\n\t\t\tfor x in numbers:\n\t\t\t\tif x % 2 != 0:\n\t\t\t\t\treturn x\n\t\t\treturn None",
		description: "A loop variable (i.e. defined by a for loop or a list comprehension or a generator expression) is used outside the loop",
		category: "Variables",
		severity: "Major",
		title: "Undefined Loop Variable",
	},
	{
		ruleId: "W0603",
		language: "python",
		badExample: "\n\t\tnum = 5\n\n\t\tdef update_num():\n\t\t\tglobal num  # [global-statement]\n\t\t\tnum = 15\n\t\t\tprint(num)\n\n\t\tupdate_num()\n\t\tprint(num)",
		goodExample: "\n\t\tnum = 5\n\n\t\tdef update_num():\n\t\t\tprint(num)\n\t\t\treturn 15\n\n\t\tnum = update_num()\n\t\tprint(num)",
		description: "You use the `global` statement to update a global variable. Pylint discourages this usage, but it doesn't mean you cannot use it.",
		category: "Variables",
		severity: "Major",
		title: "Global Statement",
	},
	{
		ruleId: "W0604",
		language: "python",
		badExample: "\n\t\tcount = 10\n\t\tglobal count  # [global-at-module-level]",
		goodExample: "count = 10",
		description: "You use the `global` statement at the module level since it has no effect",
		category: "Variables",
		severity: "Major",
		title: "Global At Module Level",
	},
	{
		ruleId: "PEAR.Commenting.FileComment.Missing",
		language: "php",
		badExample: "\n// Code without a file doc comment\nfunction exampleFunction() {\n    // function code\n}",
		goodExample: "\n/**\n * This is the file doc comment that provides a brief description of the file's purpose.\n */\n\nfunction exampleFunction() {\n    // function code\n}",
		description: "The file doc comment is missing from the start of the file",
		category: "Commenting",
		severity: "Major",
		title: "Missing File Doc Comment",
	},
	{
		ruleId: "Generic.Files.LineLength.TooLong",
		language: "php",
		badExample: "// This is a line of code or comment that is significantly longer than the recommended 85 characters.",
		goodExample: "// This line has been shortened to fit within the recommended 85 character limit.",
		description: "Line exceeds 85 characters;",
		category: "Files",
		severity: "Minor",
		title: "Line Exceeds Length",
	},
	{
		ruleId: "Generic.Commenting.DocComment.LongNotCapital",
		language: "php",
		badExample: "\n/**\n * this is a long description that does not start with a capital letter.\n */",
		goodExample: "\n/**\n * This is a long description that starts with a capital letter.\n */",
		description: "Doc comment long description must start with a capital letter",
		category: "Commenting",
		severity: "Minor",
		title: "Long Description Capitalize",
	},
	{
		ruleId: "Generic.WhiteSpace.DisallowTabIndent.NonIndentTabsUsed",
		language: "php",
		badExample: "\n// Misaligned with tabs\n\t$variable = 'value';",
		goodExample: "\n// Aligned with spaces\n    $variable = 'value';",
		description: "Spaces must be used for alignment; tabs are not allowed",
		category: "White Space",
		severity: "Major",
		title: "No Indent Tabs",
	},
	{
		ruleId: "Generic.Commenting.DocComment.ShortNotCapital",
		language: "php",
		badExample: "\n/**\n * short description without a capital letter.\n */",
		goodExample: "\n/**\n * Short description that starts with a capital letter.\n */",
		description: "Doc comment short description must start with a capital letter",
		category: "Commenting",
		severity: "Minor",
		title: "Short Description Capitalize",
	},
	{
		ruleId: "Generic.Commenting.DocComment.SpacingBeforeTags",
		language: "php",
		badExample: "\n/**\n * This is a description\n * @param int $value\n */",
		goodExample: "\n/**\n * This is a description\n *\n * @param int $value\n */",
		description: "There must be exactly one blank line before the tags in a doc comment",
		category: "Commenting",
		severity: "Major",
		title: "Number of Blank Lines Before Tags",
	},
	{
		ruleId: "PEAR.Functions.FunctionCallSignature.ContentAfterOpenBracket",
		language: "php",
		badExample: "\nfunctionCall(param1, param2,\nmoreContent);",
		goodExample: "\nfunctionCall(\n    param1,\n    param2\n);",
		description: "Opening parenthesis of a multi-line function call must be the last content on the line",
		category: "Functions",
		severity: "Minor",
		title: "Multi-line Function Opening Bracket",
	},
	{
		ruleId: "PEAR.Functions.FunctionCallSignature.CloseBracketLine",
		language: "php",
		badExample: "\nfunctionCall(\n    param1,\n    param2);",
		goodExample: "\nfunctionCall(\n    param1,\n    param2\n);",
		description: "Closing parenthesis of a multi-line function call must be on a line by itself",
		category: "Functions",
		severity: "Minor",
		title: "Multi-line Function Closing Bracket",
	},
	{
		ruleId: "Generic.Commenting.DocComment.TagValueIndent",
		language: "php",
		badExample: "\n/**\n * @package  MyPackage\n */",
		goodExample: "\n/**\n * @package MyPackage\n */",
		description: "Tag value for @package tag indented incorrectly",
		category: "Commenting",
		severity: "Major",
		title: "Number of Spaces Before Tag Value",
	},
	{
		ruleId: "PEAR.Commenting.FileComment.MissingVersion",
		language: "php",
		badExample: "\n/**\n * This is the file comment.\n */",
		goodExample: "\n/**\n * This is the file comment.\n *\n * PHP Version 7.4\n */",
		description: "PHP version not specified",
		category: "Commenting",
		severity: "Major",
		title: "Missing PHP Version",
	},
	{
		ruleId: "PEAR.Commenting.FileComment.MissingCategoryTag",
		language: "php",
		badExample: "\n/**\n * File description without a @category tag.\n */",
		goodExample: "\n/**\n * File description.\n *\n * @category Utilities\n */",
		description: "Missing @category tag in file comment",
		category: "Commenting",
		severity: "Critical",
		title: "Missing Category Tag",
	},
	{
		ruleId: "PEAR.Commenting.FileComment.MissingLicenseTag",
		language: "php",
		badExample: "\n/**\n * File description without a @license tag.\n */",
		goodExample: "\n/**\n * File description.\n *\n * @license MIT License\n */",
		description: "Missing @license tag in file comment",
		category: "Commenting",
		severity: "Major",
		title: "Missing License Tag",
	},
	{
		ruleId: "PEAR.Commenting.FileComment.MissingLinkTag",
		language: "php",
		badExample: "\n/**\n * File description without a @link tag.\n */",
		goodExample: "\n/**\n * File description.\n *\n * @link https://example.com\n */",
		description: "Missing @link tag in file comment",
		category: "Commenting",
		severity: "Major",
		title: "Missing Link Tag",
	},
	{
		ruleId: "PEAR.Commenting.ClassComment.Missing",
		language: "php",
		badExample: "\nclass MyClass {\n    // Class code here\n}",
		goodExample: "\n/**\n * Class MyClass is responsible for XYZ operations.\n */\nclass MyClass {\n    // Class code here\n}",
		description: "Missing doc comment for class component",
		category: "Commenting",
		severity: "Major",
		title: "Missing Doc Comment for Class",
	},
	{
		ruleId: "PEAR.Commenting.FunctionComment.Missing",
		language: "php",
		badExample: "\nfunction myFunction() {\n    // Function code here\n}",
		goodExample: "\n/**\n * Executes the primary function logic.\n *\n * @return void\n */\nfunction myFunction() {\n    // Function code here\n}",
		description: "Missing doc comment for function component",
		category: "Commenting",
		severity: "Major",
		title: "Missing Doc Comment for Function",
	},
	{
		ruleId: "PEAR.Functions.FunctionDeclaration.BraceOnSameLine",
		language: "php",
		badExample: "\nfunction exampleFunction() {\n    // Function code here\n}",
		goodExample: "\nfunction exampleFunction()\n{\n    // Function code here\n}",
		description: "Opening brace should be on a new line",
		category: "Functions",
		severity: "Minor",
		title: "Brace On Same Line",
	},
	{
		ruleId: "PEAR.WhiteSpace.ScopeIndent.IncorrectExact",
		language: "php",
		badExample: "\nfunction exampleFunction() {\n\t$variable = 'value';\n}",
		goodExample: "\nfunction exampleFunction() {\n    $variable = 'value';\n}",
		description: "Line indented incorrectly",
		category: "White Space",
		severity: "Minor",
		title: "Wrong Exact Indentation",
	},
	{
		ruleId: "PEAR.Functions.FunctionCallSignature.EmptyLine",
		language: "php",
		badExample: "\nfunctionCall(\n    param1,\n\n    param2\n);",
		goodExample: "\nfunctionCall(\n    param1,\n    param2\n);",
		description: "Empty lines are not allowed in multi-line function calls",
		category: "Functions",
		severity: "Minor",
		title: "Empty Lines Not Allowed",
	},
	{
		ruleId: "PEAR.Functions.FunctionCallSignature.SpaceAfterOpenBracket",
		language: "php",
		badExample: "\nfunctionCall( param1, param2 );",
		goodExample: "\nfunctionCall(param1, param2);",
		description: "Space after opening parenthesis of function call prohibited",
		category: "Functions",
		severity: "Minor",
		title: "Spaces After Opening Bracket",
	},
	{
		ruleId: "PEAR.Functions.FunctionCallSignature.SpaceBeforeCloseBracket",
		language: "php",
		badExample: "\nfunctionCall(param1, param2 );",
		goodExample: "\nfunctionCall(param1, param2);",
		description: "Expected 0 spaces before closing parenthesis",
		category: "Functions",
		severity: "Minor",
		title: "Spaces Before Closing Bracket",
	},
	{
		ruleId: "PEAR.NamingConventions.ValidFunctionName.PrivateNoUnderscore",
		language: "php",
		badExample: "\nprivate function privateMethodName() {\n    // method code\n}",
		goodExample: "\nprivate function _privateMethodName() {\n    // method code\n}",
		description: "Private method name must be prefixed with an underscore",
		category: "Naming Conventions",
		severity: "Minor",
		title: "No Underscore Before Private Method Name",
	},
	{
		ruleId: "PEAR.WhiteSpace.ScopeIndent.Incorrect",
		language: "php",
		badExample: "\nfunction exampleFunction() {\n  $variable = 'value';\n}",
		goodExample: "\nfunction exampleFunction() {\n    $variable = 'value';\n}",
		description: "Line indented incorrectly",
		category: "White Space",
		severity: "Minor",
		title: "Wrong Indentation",
	},
	{
		ruleId: "PEAR.NamingConventions.ValidVariableName.PrivateNoUnderscore",
		language: "php",
		badExample: "\nprivate $privateVariable;\n",
		goodExample: "\nprivate $_privateVariable;\n",
		description: "Private member variable must be prefixed with an underscore",
		category: "Naming Conventions",
		severity: "Minor",
		title: "No Underscore Before Private Member Variable",
	},
	{
		ruleId: "PEAR.WhiteSpace.ObjectOperatorIndent.Incorrect",
		language: "php",
		badExample: "\n$object\n->method();",
		goodExample: "\n$object\n    ->method();",
		description: "Object operator not indented correctly",
		category: "White Space",
		severity: "Minor",
		title: "Object Operator Indentation",
	},
	{
		ruleId: "PEAR.ControlStructures.ControlSignature.Found",
		language: "php",
		badExample: "\nforeach($items as $item){\n    // loop code\n}",
		goodExample: "\nforeach ($items as $item) {\n    // loop code\n}",
		description: String.raw`Expected "foreach (...) {\n"; found "foreach(...){\n"`,
		category: "Control Structures",
		severity: "Minor",
		title: "Control Signature Found",
	},
	{
		ruleId: "PEAR.ControlStructures.MultiLineCondition.SpaceBeforeOpenBrace",
		language: "php",
		badExample: "\nif ($condition)\n{\n    // condition code\n}",
		goodExample: "\nif ($condition) {\n    // condition code\n}",
		description: "There must be a single space between the closing parenthesis and the opening brace of a multi-line IF statement",
		category: "Control Structures",
		severity: "Minor",
		title: "Number of Spaces Before Opening Brace",
	},
	{
		ruleId: "PEAR.WhiteSpace.ScopeClosingBrace.Indent",
		language: "php",
		badExample: "\nfunction exampleFunction() {\n    $variable = 'value';\n  }",
		goodExample: "\nfunction exampleFunction() {\n    $variable = 'value';\n}",
		description: "Closing brace indented incorrectly",
		category: "White Space",
		severity: "Minor",
		title: "Closing Brace Indentation",
	},
	{
		ruleId: "PEAR.Commenting.FunctionComment.WrongStyle",
		language: "php",
		badExample: "\n// Function to calculate value\nfunction calculate() { }",
		goodExample: "\n/**\n * Function to calculate value\n */\nfunction calculate() { }",
		description: "You must use \"/**\" style comments for a function comment",
		category: "Commenting",
		severity: "Major",
		title: "Wrong Style for Function Comment",
	},
	{
		ruleId: "PEAR.Functions.FunctionCallSignature.SpaceAfterCloseBracket",
		language: "php",
		badExample: "\nfunctionCall(param1, param2) ;",
		goodExample: "\nfunctionCall(param1, param2);",
		description: "Space after closing parenthesis of function call prohibited",
		category: "Functions",
		severity: "Minor",
		title: "Space After Closing Bracket",
	},
	{
		ruleId: "Generic.Functions.FunctionCallArgumentSpacing.SpaceBeforeComma",
		language: "php",
		badExample: "\nfunctionCall(param1 , param2);",
		goodExample: "\nfunctionCall(param1, param2);",
		description: "Space found before comma in argument list",
		category: "Functions",
		severity: "Minor",
		title: "Space Before Comma",
	},
	{
		ruleId: "PEAR.Commenting.FunctionComment.MissingParamTag",
		language: "php",
		badExample: "\n/**\n * Calculates value\n */\nfunction calculate($value) { }",
		goodExample: "\n/**\n * Calculates value\n *\n * @param int $value The value to calculate\n */\nfunction calculate($value) { }",
		description: "Doc comment for parameter missing",
		category: "Commenting",
		severity: "Major",
		title: "Missing Parameter Doc",
	},
	{
		ruleId: "Generic.Commenting.DocComment.SpacingAfter",
		language: "php",
		badExample: "\n/**\n * Calculates value\n *\n */\nfunction calculate() { }",
		goodExample: "\n/**\n * Calculates value\n */\nfunction calculate() { }",
		description: "Additional blank lines found at end of doc comment",
		category: "Commenting",
		severity: "Minor",
		title: "Spacing After Doc Comment",
	},
	{
		ruleId: "PEAR.Commenting.FunctionComment.MissingReturn",
		language: "php",
		badExample: "\n/**\n * Calculates value\n */\nfunction calculate() {\n    return 42;\n}",
		goodExample: "\n/**\n * Calculates value\n *\n * @return int The calculated result\n */\nfunction calculate() {\n    return 42;\n}",
		description: "Missing @return tag in function comment",
		category: "Commenting",
		severity: "Critical",
		title: "Missing Return Tag",
	},
	{
		ruleId: "PEAR.Commenting.FunctionComment.MissingParamComment",
		language: "php",
		badExample: "\n/**\n * Calculates value\n *\n * @param int $value\n */\nfunction calculate($value) { }",
		goodExample: "\n/**\n * Calculates value\n *\n * @param int $value The value to calculate\n */\nfunction calculate($value) { }",
		description: "Missing parameter comment",
		category: "Commenting",
		severity: "Minor",
		title: "Parameter Comment Not Found",
	},
	{
		ruleId: "PEAR.Commenting.FunctionComment.SpacingAfterParamType",
		language: "php",
		badExample: "\n/**\n * Calculates value\n *\n * @param int$value The value to calculate\n */\nfunction calculate($value) { }",
		goodExample: "\n/**\n * Calculates value\n *\n * @param int $value The value to calculate\n */\nfunction calculate($value) { }",
		description: "Expected 1 spaces after parameter type",
		category: "Commenting",
		severity: "Minor",
		title: "Wrong Spacing After Parameter Type",
	},
	{
		ruleId: "Generic.Commenting.DocComment.NonParamGroup",
		language: "php",
		badExample: "\n/**\n * Calculates value\n * @param int $value The value to calculate\n * @return int The calculated result\n */\nfunction calculate($value) { }",
		goodExample: "\n/**\n * Calculates value\n *\n * @param int $value The value to calculate\n *\n * @return int The calculated result\n */\nfunction calculate($value) { }",
		description: "Tag @return cannot be grouped with parameter tags in a doc comment",
		category: "Commenting",
		severity: "Major",
		title: "Non Parameter Group",
	},
	{
		ruleId: "Generic.Functions.FunctionCallArgumentSpacing.NoSpaceAfterComma",
		language: "php",
		badExample: "\nfunctionCall(param1,param2);",
		goodExample: "\nfunctionCall(param1, param2);",
		description: "No space found after comma in argument list",
		category: "Functions",
		severity: "Minor",
		title: "No Spaces After Comma",
	},
	{
		ruleId: "PEAR.Files.IncludingFile.UseInclude",
		language: "php",
		badExample: "\nif ($condition) {\n    require 'file.php';\n}",
		goodExample: "\nif ($condition) {\n    include 'file.php';\n}",
		description: "File is being conditionally included; use \"include\" instead",
		category: "Files",
		severity: "Major",
		title: "Use Include",
	},
	{
		ruleId: "Generic.Commenting.DocComment.MissingShort",
		language: "php",
		badExample: "\n/**\n *\n * @param int $value The value to calculate\n * @return int The result\n */\nfunction calculate($value) { }",
		goodExample: "\n/**\n * Calculates a value based on input.\n *\n * @param int $value The value to calculate\n * @return int The result\n */\nfunction calculate($value) { }",
		description: "Missing short description in doc comment",
		category: "Commenting",
		severity: "Major",
		title: "Missing Short Description",
	},
	{
		ruleId: "Squiz.Commenting.DocCommentAlignment.SpaceBeforeStar",
		language: "php",
		badExample: "\n/**\n* Calculates value\n*/\nfunction calculate() { }",
		goodExample: "\n/**\n     * Calculates value\n     */\nfunction calculate() { }",
		description: "Expected 5 space(s) before asterisk",
		category: "Commenting",
		severity: "Minor",
		title: "Asterisk Indentation",
	},
	{
		ruleId: "PEAR.Commenting.FunctionComment.ExtraParamComment",
		language: "php",
		badExample: "\n/**\n * Calculates value\n *\n * @param int $value The value to calculate\n * @param string $extra Extra parameter that is not used\n * @return int The result\n */\nfunction calculate($value) { }",
		goodExample: "\n/**\n * Calculates value\n *\n * @param int $value The value to calculate\n * @return int The result\n */\nfunction calculate($value) { }",
		description: "Superfluous parameter comment",
		category: "Commenting",
		severity: "Major",
		title: "Extra Parameter Comment",
	},
	{
		ruleId: "PEAR.Functions.FunctionCallSignature.Indent",
		language: "php",
		badExample: "\nfunctionCall(\nparam1,\n  param2\n);",
		goodExample: "\nfunctionCall(\n    param1,\n    param2\n);",
		description: "Multi-line function call not indented correctly",
		category: "Functions",
		severity: "Minor",
		title: "Multi-line Function Indentation",
	},
	{
		ruleId: "PEAR.Commenting.InlineComment.WrongStyle",
		language: "php",
		badExample: "# This is a Perl-style comment",
		goodExample: "// This is the correct comment style",
		description: "Perl-style comments are not allowed. Use \"// Comment.\" or \"/* comment */\" instead.",
		category: "Commenting",
		severity: "Minor",
		title: "Perl-style Comments",
	},
	{
		ruleId: "PEAR.Functions.FunctionDeclaration.SpaceBeforeBrace",
		language: "php",
		badExample: "function myFunction(){",
		goodExample: "function myFunction() {",
		description: "Expected 1 space before opening brace",
		category: "Functions",
		severity: "Minor",
		title: "Space Before Brace",
	},
	{
		ruleId: "PEAR.Functions.FunctionDeclaration.SpaceAfterFunction",
		language: "php",
		badExample: "functionmyFunction() {",
		goodExample: "function myFunction() {",
		description: "Expected 1 space after FUNCTION keyword",
		category: "Functions",
		severity: "Minor",
		title: "Space After Function",
	},
	{
		ruleId: "PEAR.Commenting.FunctionComment.ParamNameNoMatch",
		language: "php",
		badExample: "/** @param string $name */ function greet($username) {",
		goodExample: "/** @param string $username */ function greet($username) {",
		description: "Doc comment for parameter does not match actual variable name",
		category: "Commenting",
		severity: "Minor",
		title: "Parameter Name Mismatch",
	},
	{
		ruleId: "PEAR.Functions.FunctionDeclaration.CloseBracketLine",
		language: "php",
		badExample: "function myFunction(\n $param1, $param2) {",
		goodExample: "function myFunction(\n $param1, $param2\n) {",
		description: "The closing parenthesis of a multi-line function declaration must be on a new line",
		category: "Functions",
		severity: "Minor",
		title: "Close Bracket Line",
	},
	{
		ruleId: "PEAR.Functions.FunctionDeclaration.NewlineBeforeOpenBrace",
		language: "php",
		badExample: "function myFunction(\n $param1, $param2)\n {",
		goodExample: "function myFunction(\n $param1, $param2) {",
		description: "The closing parenthesis and the opening brace of a multi-line function declaration must be on the same line",
		category: "Functions",
		severity: "Minor",
		title: "New line Before Opening Brace",
	},
	{
		ruleId: "Generic.ControlStructures.InlineControlStructure.Discouraged",
		language: "php",
		badExample: "if ($a == $b) echo 'Equal';",
		goodExample: "if ($a == $b) {\n echo 'Equal';\n}",
		description: "Inline control structures are discouraged",
		category: "Control Structures",
		severity: "Minor",
		title: "Inline Control Structures",
	},
	{
		ruleId: "PEAR.ControlStructures.MultiLineCondition.SpacingAfterOpenBrace",
		language: "php",
		badExample: "if (\n($a == $b) &&\n($c == $d)\n) {",
		goodExample: "if (($a == $b) &&\n($c == $d)) {",
		description: "First condition of a multi-line IF statement must directly follow the opening parenthesis",
		category: "Control Structures",
		severity: "Minor",
		title: "Spacing After Opening Brace",
	},
	{
		ruleId: "PEAR.Functions.FunctionCallSignature.OpeningIndent",
		language: "php",
		badExample: "myFunction(\n 'arg1',\n 'arg2'\n);",
		goodExample: "myFunction(\n\t'arg1',\n\t'arg2'\n);",
		description: "Opening statement of multi-line function call not indented correctly",
		category: "Functions",
		severity: "Minor",
		title: "Opening Statement Indentation",
	},
	{
		ruleId: "PEAR.NamingConventions.ValidFunctionName.ScopeNotCamelCaps",
		language: "php",
		badExample: "function my_function() { }",
		goodExample: "function myFunction() { }",
		description: "Public method name is not in camel caps format",
		category: "Naming Conventions",
		severity: "Major",
		title: "Name Format",
	},
	{
		ruleId: "Internal.Tokenizer.Exception",
		language: "php",
		badExample: "/* Minified code */ var a=1;function b(){return a};",
		goodExample: "function exampleFunction() {\n    $a = 1;\n    return $a;\n}",
		description: "File appears to be minified and cannot be processed",
		category: "Format",
		severity: "Major",
		title: "Minified File",
	},
	{
		ruleId: "Generic.WhiteSpace.DisallowTabIndent.TabsUsed",
		language: "php",
		badExample: "\tfunction example() {",
		goodExample: "    function example() {",
		description: "Spaces must be used to indent lines; tabs are not allowed",
		category: "White Space",
		severity: "Minor",
		title: "Disallow Tab Indent",
	},
	{
		ruleId: "PEAR.Functions.FunctionDeclaration.ContentAfterBrace",
		language: "php",
		badExample: "function example() { echo 'Hello'; }",
		goodExample: "function example() {\n    echo 'Hello';\n}",
		description: "Opening brace must be the last content on the line",
		category: "Functions",
		severity: "Minor",
		title: "No Content After Brace",
	},
	{
		ruleId: "PEAR.Files.IncludingFile.UseIncludeOnce",
		language: "php",
		badExample: "if ($condition) { include 'file.php'; }",
		goodExample: "if ($condition) { include_once 'file.php'; }",
		description: "File is being conditionally included; use \"include_once\" instead",
		category: "Files",
		severity: "Major",
		title: "Use Include Once",
	},
	{
		ruleId: "PEAR.Functions.FunctionDeclaration.SpaceBeforeOpenParen",
		language: "php",
		badExample: "function example () { }",
		goodExample: "function example() { }",
		description: "Expected 0 spaces before opening parenthesis",
		category: "Functions",
		severity: "Minor",
		title: "Space Before Opening Parenthesis",
	},
	{
		ruleId: "Internal.NoCodeFound",
		language: "php",
		badExample: "<?php ?>",
		goodExample: "<?php echo 'Hello, World!'; ?>",
		description: "No PHP code was found in this file and short open tags are not allowed by this install of PHP. This file may be using short open tags but PHP does not allow them.",
		category: "Format",
		severity: "Major",
		title: "No PHP code found",
	},
	{
		ruleId: "PEAR.Commenting.FileComment.WrongStyle",
		language: "php",
		badExample: "// File Comment",
		goodExample: "/** File Comment */",
		description: "You must use \"/**\" style comments for a file comment",
		category: "Commenting",
		severity: "Minor",
		title: "Bad Comment Format",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/adjacent-overload-signatures",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Grouping overloaded members together can improve readability of the code.",
		category: "Best Practices",
		severity: "",
		title: "Require that member overloads be consecutive",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/array-type",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Using the same style for array definitions across your codebase makes it easier for your developers to read and understand the types.",
		category: "Best Practices",
		severity: "",
		title: "Requires using either `T[]` or `Array<T>` for arrays",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/await-thenable",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "This rule disallows awaiting a value that is not a \"Thenable\" (an object which has `then` method, such as a Promise).",
		category: "Best Practices",
		severity: "",
		title: "Disallows awaiting a value that is not a Thenable",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/ban-ts-comment",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "TypeScript provides several directive comments that can be used to alter how it processes files.",
		category: "Best Practices",
		severity: "",
		title: "Bans `@ts-<directive>` comments from being used or requires descriptions after directive",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/ban-tslint-comment",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Useful when migrating from TSLint to ESLint. Once TSLint has been removed, this rule helps locate TSLint annotations (e.g. `// tslint:disable`).",
		category: "Best Practices",
		severity: "",
		title: "Bans `// tslint:<rule-flag>` comments from being used",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/ban-types",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Some builtin types have aliases, some types are considered dangerous or harmful.",
		category: "Best Practices",
		severity: "",
		title: "Bans specific types from being used",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/brace-style",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Brace style is closely related to indent style in programming and describes the placement of braces relative to their control statement and body. While no style is considered better than the other, most developers agree that having a consistent style throughout a project is important for its long-term maintainability. This rule enforces consistent brace style for blocks.",
		category: "Best Practices",
		severity: "",
		title: "Enforce consistent brace style for blocks",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/class-literal-property-style",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "When writing TypeScript applications, it's typically safe to store literal values on classes using fields with the `readonly` modifier to prevent them from being reassigned.",
		category: "Best Practices",
		severity: "",
		title: "Ensures that literals on classes are exposed in a consistent style",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/comma-dangle",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Enforces consistent use of trailing commas in object and array literals.",
		category: "Best Practices",
		severity: "",
		title: "Require or disallow trailing comma",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/comma-spacing",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Εnforces consistent spacing before and after commas in variable declarations, array literals, object literals, function parameters, and sequences.",
		category: "Best Practices",
		severity: "",
		title: "Enforces consistent spacing before and after commas",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/consistent-indexed-object-style",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "TypeScript supports defining object show keys can be flexible using an index signature. TypeScript also has a builtin type named `Record` to create an empty object defining only an index signature. For example, the following types are equal:",
		category: "Best Practices",
		severity: "",
		title: "Enforce or disallow the use of the record type",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/consistent-generic-constructors",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Enforces specifying generic type arguments on type annotation or constructor name of a constructor call.",
		category: "Best Practices",
		severity: "",
		title: "Specify generic type arguments",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/consistent-type-assertions",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Αims to standardize the use of type assertion style across the codebase. Type assertions are also commonly referred as 'type casting' in TypeScript. In addition to ensuring that type assertions are written in a consistent way, this rule also makes the codebase more type-safe.",
		category: "Best Practices",
		severity: "",
		title: "Enforces consistent usage of type assertions",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/consistent-type-definitions",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "There are two ways to define a type.",
		category: "Best Practices",
		severity: "",
		title: "Consistent with type definition either `interface` or `type`",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/consistent-type-exports",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Enforces consistent usage of type exports.",
		category: "Best Practices",
		severity: "",
		title: "Proper use of type export",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/consistent-type-imports",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "TypeScript 3.8 added support for type-only imports.",
		category: "Best Practices",
		severity: "",
		title: "Enforces consistent usage of type imports",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/default-param-last",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Enforces default parameters to be the last of parameters.",
		category: "Best Practices",
		severity: "",
		title: "Enforce default parameters to be last",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/dot-notation",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Aims at maintaining code consistency and improving code readability by encouraging use of the dot notation style whenever possible. As such, it warns when it encounters an unnecessary use of square-bracket notation.",
		category: "Best Practices",
		severity: "",
		title: "enforce dot notation whenever possible",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/explicit-function-return-type",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Explicit types for function return values makes it clear to any calling code what type is returned.",
		category: "Best Practices",
		severity: "",
		title: "Require explicit return types on functions and class methods",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/explicit-member-accessibility",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Leaving off accessibility modifier and making everything public can make",
		category: "Best Practices",
		severity: "",
		title: "Require explicit accessibility modifiers on class properties and methods",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/explicit-module-boundary-types",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Explicit types for function return values and arguments makes it clear to any calling code what is the module boundary's input and output.",
		category: "Best Practices",
		severity: "",
		title: "Require explicit return and argument types on exported functions' and classes' public class methods",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/func-call-spacing",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Requires or disallows spaces between the function name and the opening parenthesis that calls it.",
		category: "Best Practices",
		severity: "",
		title: "Require or disallow spacing between function identifiers and their invocations",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/indent",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Enforces a consistent indentation style. The default style is 4 spaces.",
		category: "Best Practices",
		severity: "",
		title: "Enforce consistent indentation",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/init-declarations",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Aims at enforcing or eliminating variable initializations during declaration.",
		category: "Best Practices",
		severity: "",
		title: "require or disallow initialization in variable declarations",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/keyword-spacing",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Enforces consistent spacing around keywords and keyword-like tokens: as (in module declarations), async (of async functions), await (of await expressions), break, case, catch, class, const, continue, debugger, default, delete, do, else, export, extends, finally, for, from (in module declarations), function, get (of getters), if, import, in, instanceof, let, new, of (in for-of statements), return, set (of setters), static, super, switch, this, throw, try, typeof, var, void, while, with, and yield.",
		category: "Best Practices",
		severity: "",
		title: "Enforce consistent spacing before and after keywords",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/lines-between-class-members",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "This rule improves readability by enforcing lines between class members. It will not check empty lines before the first member and after the last member. This rule require or disallow an empty line between class members.",
		category: "Best Practices",
		severity: "",
		title: "Require or disallow an empty line between class members",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/member-delimiter-style",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Enforces a consistent member delimiter style in interfaces and type literals. There are three member delimiter styles primarily used in TypeScript:",
		category: "Best Practices",
		severity: "",
		title: "Require a specific member delimiter style for interfaces and type literals",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/member-ordering",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "A consistent ordering of fields, methods and constructors can make interfaces, type literals, classes and class expressions easier to read, navigate and edit.",
		category: "Best Practices",
		severity: "",
		title: "Require a consistent member declaration order",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/method-signature-style",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "There are two ways to define an object/interface function property.",
		category: "Best Practices",
		severity: "",
		title: "Enforces using a particular method signature syntax.",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/naming-convention",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Enforcing naming conventions helps keep the codebase consistent, and reduces overhead when thinking about how to name a variable.",
		category: "Best Practices",
		severity: "",
		title: "Enforces naming conventions for everything across a codebase",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-array-constructor",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Use of the Array constructor to construct a new array is generally discouraged in favor of array literal notation because of the single-argument pitfall and because the Array global may be redefined. This rule disallows Array constructors.",
		category: "Best Practices",
		severity: "",
		title: "Disallow generic `Array` constructors",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/is only called on objects which provide useful information when stringified",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "JavaScript will call `toString()` on an object when it is converted to a string, such as when `+` adding to a string or in `${}` template literals.",
		category: "Best Practices",
		severity: "",
		title: "Requires that `.toString",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-confusing-non-null-assertion",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Using a non-null assertion (!) next to an assign or equals check (= or == or ===) creates code that is confusing as it looks similar to a not equals check (!= !==). This rule disallows non-null assertion in locations that may be confusing.",
		category: "Best Practices",
		severity: "",
		title: "Disallow non-null assertion in locations that may be confusing",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-confusing-void-expression",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Returning the results of an expression whose type is void can be misleading.",
		category: "Best Practices",
		severity: "",
		title: "Requires expressions of type void to appear in statement position",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-dupe-class-members",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "If there are declarations of the same name in class members, the last declaration overwrites other declarations silently. It can cause unexpected behaviors. This rule is aimed to flag the use of duplicate names in class members.",
		category: "Best Practices",
		severity: "",
		title: "Disallow duplicate class members",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-duplicate-imports",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Using a single import statement per module will make the code clearer because you can see everything being imported from that module on one line. This rule requires that all imports from a single module that can be merged exist in a single import statement.",
		category: "Best Practices",
		severity: "",
		title: "Disallow duplicate imports",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-dynamic-delete",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Deleting dynamically computed keys can be dangerous and in some cases not well optimized.",
		category: "Best Practices",
		severity: "",
		title: "Disallow the delete operator with computed key expressions",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-empty-function",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Empty functions can reduce readability because readers need to guess whether it's intentional or not. So writing a clear comment for empty functions is a good practice. This rule is aimed at eliminating empty functions.",
		category: "Best Practices",
		severity: "",
		title: "Disallow empty functions",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-empty-interface",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "An empty interface is equivalent to its supertype. If the interface does not implement a supertype, then the interface is equivalent to an empty object ({}). In both cases it can be omitted.",
		category: "Best Practices",
		severity: "",
		title: "Disallow the declaration of empty interfaces",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-explicit-any",
		language: "typescript",
		badExample: `
const age: any = 'seventeen';
const ages: any[] = ['seventeen'];
const ages: Array<any> = ['seventeen'];
function greet(): any {}
function greet(): any[] {}
function greet(): Array<any> {}
function greet(): Array<Array<any>> {}
function greet(param: Array<any>): string {}
function greet(param: Array<any>): Array<any> {}
`,
		goodExample: `
const age: number = 17;
const ages: number[] = [17];
const ages: Array<number> = [17];
function greet(): string {}
function greet(): string[] {}
function greet(): Array<string> {}
function greet(): Array<Array<string>> {}
function greet(param: Array<string>): string {}
function greet(param: Array<string>): Array<string> {}
`,
		description: "Using the `any` type defeats the purpose of using TypeScript.",
		category: "Best Practices",
		severity: "",
		title: "Disallow usage of the `any` type",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-extra-non-null-assertion",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Using non-null assertions cancels the benefits of the strict null-checking mode.",
		category: "Best Practices",
		severity: "",
		title: "Disallow extra non-null assertion",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-extra-parens",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "This rule restricts the use of parentheses to only where they are necessary.",
		category: "Best Practices",
		severity: "",
		title: "Disallow unnecessary parentheses",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-extra-semi",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Typing mistakes and misunderstandings about where semicolons are required can lead to semicolons that are unnecessary. While not technically an error, extra semicolons can cause confusion when reading code. This rule disallows unnecessary semicolons.",
		category: "Best Practices",
		severity: "",
		title: "Disallow unnecessary semicolons",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-extraneous-class",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "This rule warns when a class is accidentally used as a namespace.",
		category: "Best Practices",
		severity: "",
		title: "Forbids the use of classes as namespaces",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-floating-promises",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "This rule forbids usage of Promise-like values in statements without handling",
		category: "Best Practices",
		severity: "",
		title: "Requires Promise-like values to be handled appropriately",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-for-in-array",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "This rule prohibits iterating over an array with a for-in loop.",
		category: "Best Practices",
		severity: "",
		title: "Disallow iterating over an array with a for-in loop",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-implicit-any-catch",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "TypeScript 4.0 added support for adding an explicit `any` or `unknown` type annotation on a catch clause variable.",
		category: "Best Practices",
		severity: "",
		title: "Disallow usage of the implicit `any` type in catch clauses",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/-like methods",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "It's considered a good practice to avoid using `eval()`. There are security and performance implications involved with doing so, which is why many linters recommend disallowing `eval()`. However, there are some other ways to pass a string and have it interpreted as JavaScript code that have similar concerns.",
		category: "Best Practices",
		severity: "",
		title: "Disallow the use of `eval",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-inferrable-types",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Explicit types where they can be easily inferred may add unnecessary verbosity.",
		category: "Best Practices",
		severity: "",
		title: "Disallows explicit type declarations for variables or parameters initialized to a number, string, or boolean",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-invalid-this",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Under the strict mode, this keywords outside of classes or class-like objects might be undefined and raise a TypeError. This rule aims to flag usage of this keywords outside of classes or class-like objects.",
		category: "Best Practices",
		severity: "",
		title: "Disallow `this` keywords outside of classes or class-like objects",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-invalid-void-type",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Disallows usage of `void` type outside of return types or generic type arguments.",
		category: "Best Practices",
		severity: "",
		title: "Disallows usage of `void` type outside of generic or return types",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-loop-func",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Writing functions within loops tends to result in errors due to the way the function creates a closure around the loop. This error is raised to highlight a piece of code that may not work as expected to and could also indicate a misunderstanding of how the language works. The code may run without any problems, but in some situations it could behave unexpectedly. This rule disallows any function within a loop that contains unsafe references (e.g. to modified variables from the outer scope).",
		category: "Best Practices",
		severity: "",
		title: "Disallow function declarations that contain unsafe references inside loop statements",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-loss-of-precision",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Numbers are stored as double-precision floating-point numbers according to the IEEE 754 standard. Because of this, numbers can only retain accuracy up to a certain amount of digits. If the programmer enters additional digits, those digits will be lost in the conversion to the Number type and will result in unexpected behavior. This rule disallows the use of number literals that immediately lose precision at runtime.",
		category: "Best Practices",
		severity: "",
		title: "Disallow literal numbers that lose precision",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-magic-numbers",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "'Magic numbers' are numbers that occur multiple times in code without an explicit meaning. They should preferably be replaced by named constants. The no-magic-numbers rule aims to make code more readable and refactoring easier by ensuring that special numbers are declared as constants to make their meaning explicit.",
		category: "Best Practices",
		severity: "",
		title: "Disallow magic numbers",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-meaningless-void-operator",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "This rule catches API changes where previously a value was being discarded.",
		category: "Best Practices",
		severity: "",
		title: "Disallow the `void` operator except when used to discard a value",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-misused-new",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Warns on apparent attempts to define constructors for interfaces or `new` for classes.",
		category: "Best Practices",
		severity: "",
		title: "Enforce valid definition of `new` and `constructor`",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-misused-promises",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "This rule forbids using promises in places where the TypeScript compiler",
		category: "Best Practices",
		severity: "",
		title: "Avoid using promises in places not designed to handle them",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-namespace",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Custom TypeScript modules (`module foo {}`) and namespaces (`namespace foo {}`) are considered outdated",
		category: "Best Practices",
		severity: "",
		title: "Disallow the use of custom TypeScript modules and namespaces",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-non-null-asserted-optional-chain",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Optional chain expressions are designed to return undefined if the optional property is nullish. Using non-null assertions after an optional chain expression is wrong, and introduces a serious type safety hole into the code.",
		category: "Best Practices",
		severity: "",
		title: "Disallows using a non-null assertion after an optional chain expression",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-non-null-assertion",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Using non-null assertions cancels the benefits of the strict null-checking mode. This rule disallows non-null assertions using the `!` postfix operator",
		category: "Best Practices",
		severity: "",
		title: "Disallows non-null assertions using the `!` postfix operator",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-parameter-properties",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Parameter properties can be confusing to those new to TypeScript as they are less explicit than other ways",
		category: "Best Practices",
		severity: "",
		title: "Disallow the use of parameter properties in class constructors",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-redeclare",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "It's possible to redeclare the same variable name using var. This can lead to confusion as to where the variable is actually declared and initialized. This rule is aimed at eliminating variables that have multiple declarations in the same scope.",
		category: "Best Practices",
		severity: "",
		title: "Disallow variable redeclaration",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Prefer the newer ES6-style imports over `require()`.",
		category: "Best Practices",
		severity: "",
		title: "Disallows invocation of `require",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-shadow",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Shadowing is the process by which a local variable shares the same name as a variable in its containing scope. This rule aims to eliminate shadowed variable declarations.",
		category: "Best Practices",
		severity: "",
		title: "Disallow variable declarations from shadowing variables declared in the outer scope",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-this-alias",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "This rule prohibits assigning variables to `this`.",
		category: "Best Practices",
		severity: "",
		title: "Disallow aliasing `this`",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-throw-literal",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "It is considered good practice to only `throw` the `Error` object itself or an object using the `Error` object as base objects for user-defined exceptions.",
		category: "Best Practices",
		severity: "",
		title: "Disallow throwing literals as exceptions",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-type-alias",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "In TypeScript, type aliases serve three purposes:",
		category: "Best Practices",
		severity: "",
		title: "Disallow the use of type aliases",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-unnecessary-boolean-literal-compare",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Comparing boolean values to boolean literals is unnecessary, those comparisons result in the same booleans. Using the boolean values directly, or via a unary negation (`!value`), is more concise and clearer.",
		category: "Best Practices",
		severity: "",
		title: "Flags unnecessary equality comparisons against boolean literals",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-unnecessary-condition",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Any expression being used as a condition must be able to evaluate as truthy or falsy in order to be considered \"necessary\". Conversely, any expression that always evaluates to truthy or always evaluates to falsy, as determined by the type of the expression, is considered unnecessary and will be flagged by this rule.",
		category: "Best Practices",
		severity: "",
		title: "Prevents conditionals where the type is always truthy or always falsy",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-unnecessary-qualifier",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "This rule aims to let users know when a namespace or enum qualifier is unnecessary, whether used for a type or for a value.",
		category: "Best Practices",
		severity: "",
		title: "Warns when a namespace qualifier is unnecessary",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-unnecessary-type-arguments",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Warns if an explicitly specified type argument is the default for that type parameter.",
		category: "Best Practices",
		severity: "",
		title: "Enforces that type arguments will not be used if not required",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-unnecessary-type-assertion",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "This rule prohibits using a type assertion that does not change the type of an expression.",
		category: "Best Practices",
		severity: "",
		title: "Warns if a type assertion does not change the type of an expression",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-unnecessary-type-constraint",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Type parameters (<T>) may be 'constrained' with an extends keyword. When not provided, type parameters happen to default to: unknown or any. It is therefore redundant to extend from these types in later versions of TypeScript.",
		category: "Best Practices",
		severity: "",
		title: "Disallows unnecessary constraints on generic types",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-unsafe-argument",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "This rule disallows calling a function with any in its arguments. That includes spreading arrays or tuples with any typed elements as function arguments.",
		category: "Best Practices",
		severity: "",
		title: "Disallow calling a function with a value with type `any`",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-unsafe-assignment",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Despite your best intentions, the `any` type can sometimes leak into your codebase.",
		category: "Best Practices",
		severity: "",
		title: "Disallows assigning any to variables and properties",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-unsafe-call",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Despite your best intentions, the `any` type can sometimes leak into your codebase.",
		category: "Best Practices",
		severity: "",
		title: "Disallows calling an any type value",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-unsafe-member-access",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Despite your best intentions, the `any` type can sometimes leak into your codebase.",
		category: "Best Practices",
		severity: "",
		title: "Disallows member access on any typed variables",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-useless-empty-export",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "This rule reports an 'export {}' that doesn't do anything in a file already using ES modules.",
		category: "Best Practices",
		severity: "",
		title: "Disallow empty exports that don't change anything in a module file",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-unsafe-return",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Despite your best intentions, the `any` type can sometimes leak into your codebase.",
		category: "Best Practices",
		severity: "",
		title: "Disallows returning any from a function",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-unused-expressions",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "An unused expression which has no effect on the state of the program indicates a logic error. This rule aims to eliminate unused expressions which have no effect on the state of the program.",
		category: "Best Practices",
		severity: "",
		title: "Disallow unused expressions",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-unused-vars-experimental",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Variables that are declared and not used anywhere in the code are most likely an error due to incomplete refactoring. Such variables take up space in the code and can lead to confusion by readers.",
		category: "Best Practices",
		severity: "",
		title: "Disallow unused variables and arguments",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-unused-vars",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Variables that are declared and not used anywhere in the code are most likely an error due to incomplete refactoring. Such variables take up space in the code and can lead to confusion by readers. This rule is aimed at eliminating unused variables, functions, and function parameters.",
		category: "Best Practices",
		severity: "",
		title: "Disallow unused variables",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-use-before-define",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "This rule will warn when it encounters a reference to an identifier that has not yet been declared.",
		category: "Best Practices",
		severity: "",
		title: "Disallow the use of variables before they are defined",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-useless-constructor",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "This rule flags class constructors that can be safely removed without changing how the class works.",
		category: "Best Practices",
		severity: "",
		title: "Disallow unnecessary constructors",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/no-var-requires",
		language: "typescript",
		badExample: `
var foo = require('foo');
const foo = require('foo');
let foo = require('foo');
`,
		goodExample: `
import foo = require('foo');
require('foo');
import foo from 'foo';
`,
		description: "In other words, the use of forms such as `let foo = require(\"foo\")` are banned. Instead use ES6 style imports or `import foo = require(\"foo\")` imports.",
		category: "Best Practices",
		severity: "",
		title: "Disallows the use of require statements except in import statements",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/non-nullable-type-assertion-style",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "This rule detects when an `as` cast is doing the same job as a `!` would, and suggests fixing the code to be an `!`.",
		category: "Best Practices",
		severity: "",
		title: "Prefers a non-null assertion over explicit type cast when possible",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/object-curly-spacing",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "While formatting preferences are very personal, a number of style guides require or disallow spaces between curly braces. This rule enforces consistent spacing inside braces of object literals, destructuring assignments, and import/export specifiers.",
		category: "Best Practices",
		severity: "",
		title: "Enforce consistent spacing inside braces",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/padding-line-between-statements",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Require or disallow padding lines between statements.",
		category: "Best Practices",
		severity: "",
		title: "Padding line between statements",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/parameter-properties",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Require or disallow parameter properties in class constructors.",
		category: "Best Practices",
		severity: "",
		title: "Require parameter properties",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/prefer-as-const",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "This rule recommends usage of `const` assertion when type primitive value is equal to type.",
		category: "Best Practices",
		severity: "",
		title: "Prefer usage of `as const` over literal type",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/prefer-enum-initializers",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "This rule recommends having each `enum`s member value explicitly initialized.",
		category: "Best Practices",
		severity: "",
		title: "Prefer initializing each enums member value",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/prefer-for-of",
		language: "typescript",
		badExample: `
		for (let j = 0; j < arr.length; i++) {
			console.log(array[ij]);
		}`,
		goodExample: `
		for (const y of array) {
			console.log(y);
		}`,
		description: "This rule recommends a for-of loop when the loop index is only used to read from an array that is being iterated.",
		category: "Best Practices",
		severity: "",
		title: "Prefer a ‘for-of’ loop over a standard ‘for’ loop if the index is only used to access the array being iterated",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/prefer-function-type",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "This rule suggests using a function type instead of an interface or object type literal with a single call signature.",
		category: "Best Practices",
		severity: "",
		title: "Use function types instead of interfaces with call signatures",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/prefer-includes",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Until ES5, we were using `String#indexOf` method to check whether a string contains an arbitrary substring or not.",
		category: "Best Practices",
		severity: "",
		title: "Enforce `includes` method over `indexOf` method",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/prefer-literal-enum-member",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "TypeScript allows the value of an enum member to be many different kinds of valid JavaScript expressions. However, because enums create their own scope whereby each enum member becomes a variable in that scope, unexpected values could be used at runtime. Example:",
		category: "Best Practices",
		severity: "",
		title: "Require that all enum members be literal values to prevent unintended enum member name shadow issues",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/prefer-namespace-keyword",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "In an effort to prevent further confusion between custom TypeScript modules and the new ES2015 modules, starting",
		category: "Best Practices",
		severity: "",
		title: "Require the use of the `namespace` keyword instead of the `module` keyword to declare custom TypeScript modules",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/prefer-nullish-coalescing",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "TypeScript 3.7 added support for the nullish coalescing operator.",
		category: "Best Practices",
		severity: "",
		title: "Enforce the usage of the nullish coalescing operator instead of logical chaining",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/prefer-optional-chain",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "TypeScript 3.7 added support for the optional chain operator.",
		category: "Best Practices",
		severity: "",
		title: "Prefer using concise optional chain expressions instead of chained logical ands",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/prefer-readonly-parameter-types",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Mutating function arguments can lead to confusing, hard to debug behavior.",
		category: "Best Practices",
		severity: "",
		title: "Requires that function parameters are typed as readonly to prevent accidental mutation of inputs",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/prefer-readonly",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "This rule enforces that private members are marked as `readonly` if they're never modified outside of the constructor.",
		category: "Best Practices",
		severity: "",
		title: "Requires that private members are marked as `readonly` if they're never modified outside of the constructor",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/prefer-reduce-type-parameter",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "It's common to call `Array#reduce` with a generic type, such as an array or object, as the initial value.",
		category: "Best Practices",
		severity: "",
		title: "Prefer using type parameter when calling `Array#reduce` instead of casting",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/prefer-regexp-exec",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "`RegExp#exec` is faster than `String#match` and both work the same when not using the `/g` flag.",
		category: "Best Practices",
		severity: "",
		title: "Enforce that `RegExp#exec` is used instead of `String#match` if no global flag is provided",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/prefer-return-this-type",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Enforce that `this` is used when only `this` type is returned.",
		category: "Best Practices",
		severity: "",
		title: "Proper use of `this`",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/prefer-string-starts-ends-with",
		language: "typescript",
		badExample: `
		let boo: string;

		// starts with
		boo[0] === 'a';
		boo.substring(0, 10) === 'tab';

		// ends with
		boo.slice(-3) === 'tab';`,
		goodExample: `
		boo.startsWith('tab');
		boo.endsWith('tab');`,
		description: "There are multiple ways to verify if a string starts or ends with a specific string, such as `foo.indexOf('bar') === 0`.",
		category: "Best Practices",
		severity: "",
		title: "Enforce the use of `String#startsWith` and `String#endsWith` instead of other equivalent methods of checking substrings",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/prefer-ts-expect-error",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "TypeScript allows you to suppress all errors on a line by placing a single-line comment or a comment block line starting with `@ts-ignore` immediately before the erroring line.",
		category: "Best Practices",
		severity: "",
		title: "Recommends using `@ts-expect-error` over `@ts-ignore`",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/promise-function-async",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Requires any function or method that returns a Promise to be marked async.",
		category: "Best Practices",
		severity: "",
		title: "Requires any function or method that returns a Promise to be marked async",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/quotes",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "This rule enforces the consistent use of either backticks, double, or single quotes.",
		category: "Best Practices",
		severity: "",
		title: "Enforce the consistent use of either backticks, double, or single quotes",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/require-array-sort-compare",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "This rule prevents invoking the `Array#sort()` method without providing a `compare` argument.",
		category: "Best Practices",
		severity: "",
		title: "Requires `Array#sort` calls to always provide a `compareFunction`",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/require-await",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Asynchronous functions that don't use await might not need to be asynchronous functions and could be the unintentional result of refactoring. This rule warns async functions which have no await expression.",
		category: "Best Practices",
		severity: "",
		title: "Disallow async functions which have no `await` expression",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/restrict-plus-operands",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Examples of **correct** code:",
		category: "Best Practices",
		severity: "",
		title: "When adding two variables, operands must both be of type number or of type string",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/restrict-template-expressions",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Examples of **correct** code:",
		category: "Best Practices",
		severity: "",
		title: "Enforce template literal expressions to be of string type",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/return-await",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Returning an awaited promise can make sense for better stack trace information as well as for consistent error handling (returned promises will not be caught in an async function try/catch).",
		category: "Best Practices",
		severity: "",
		title: "Enforces consistent returning of awaited values",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/semi",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "This rule enforces consistent use of semicolons after statements.",
		category: "Best Practices",
		severity: "",
		title: "Require or disallow semicolons instead of ASI",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/sort-type-union-intersection-members",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Sorting union (`|`) and intersection (`&`) types can help:",
		category: "Best Practices",
		severity: "",
		title: "Enforces that members of a type union/intersection are sorted alphabetically",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/sort-type-constituents",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "This rule reports on any types that aren't sorted alphabetically.",
		category: "Best Practices",
		severity: "",
		title: "Enforce constituents of a type union/intersection to be sorted alphabetically",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/space-before-function-paren",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "When formatting a function, whitespace is allowed between the function name or function keyword and the opening paren. Named functions also require a space between the function keyword and the function name, but anonymous functions require no whitespace. This rule aims to enforce consistent spacing before function parentheses and as such, will warn whenever whitespace doesn't match the preferences specified.",
		category: "Best Practices",
		severity: "",
		title: "Enforces consistent spacing before function parenthesis",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/space-infix-ops",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "This rule extends the base [`eslint/space-infix-ops`](https://eslint.org/docs/rules/space-infix-ops) rule.",
		category: "Best Practices",
		severity: "",
		title: "This rule is aimed at ensuring there are spaces around infix operators.",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/strict-boolean-expressions",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Forbids usage of non-boolean types in expressions where a boolean is expected.",
		category: "Best Practices",
		severity: "",
		title: "Restricts the types allowed in boolean expressions",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/switch-exhaustiveness-check",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Union type may have a lot of parts. It's easy to forget to consider all cases in switch. This rule reminds which parts are missing. If domain of the problem requires to have only a partial switch, developer may _explicitly_ add a default clause.",
		category: "Best Practices",
		severity: "",
		title: "Exhaustiveness checking in switch with union type",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/triple-slash-reference",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Use of triple-slash reference type directives is discouraged in favor of the newer `import` style. This rule allows you to ban use of `/// <reference path=\"\" />`, `/// <reference types=\"\" />`, or `/// <reference lib=\"\" />` directives.",
		category: "Best Practices",
		severity: "",
		title: "Sets preference level for triple slash directives versus ES6-style import declarations",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/type-annotation-spacing",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Spacing around type annotations improves readability of the code. Although the most commonly used style guideline for type annotations in TypeScript prescribes adding a space after the colon, but not before it, it is subjective to the preferences of a project. For example:",
		category: "Best Practices",
		severity: "",
		title: "Require consistent spacing around type annotations",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/typedef",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "TypeScript cannot always infer types for all places in code.",
		category: "Best Practices",
		severity: "",
		title: "Requires type annotations to exist",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/unbound-method",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Warns when a method is used outside of a method call.",
		category: "Best Practices",
		severity: "",
		title: "Enforces unbound methods are called with their expected scope",
	},
	{
		ruleId: "ESLINT_@typescript-eslint/unified-signatures",
		language: "typescript",
		badExample: "",
		goodExample: "",
		description: "Warns for any two overloads that could be unified into one by using a union or an optional/rest parameter.",
		category: "Best Practices",
		severity: "",
		title: "Warns for any two overloads that could be unified into one by using a union or an optional/rest parameter",
	},
	{
		ruleId: "ESLINT_accessor-pairs",
		language: "javascript",
		badExample: `
		let variable = {
			set a(value) {
				this.val = value;
			}
		};`,
		goodExample: `
		let variable = {
			set a(value) {
				this.val = value;
			},
			get a() {
				return this.val;
			}
		};`,
		description: "It's a common mistake in JavaScript to create an object with just a setter for a property but never have a corresponding getter defined for it. Without a getter, you cannot read the property, so it ends up not being used.",
		category: "Best Practices",
		severity: "",
		title: "Enforce getter/setter Pairs",
	},
	{
		ruleId: "ESLINT_array-bracket-newline",
		language: "javascript",
		badExample: `
		let a = [];
		let b = ["test"];
		let c = [[5, 2], 2];
		let e = [function boo() {
			executesomething();
		}];`,
		goodExample: `
		let a = [
		];
		let b = [
			"test"
		];
		let c = [
			[
				5,
				2
			],
			2
		];
		let e = [
			function boo() {
				executesomething();
			}
		];`,
		description: "A number of style guides require or disallow line breaks inside of array brackets.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Line Breaks After Opening and Before Closing Array Brackets.",
	},
	{
		ruleId: "ESLINT_array-bracket-spacing",
		language: "javascript",
		badExample: `
		let arr = ['fa', 'b' ];
		let arr = [ 'a', 'b'];`,
		goodExample: `
		let arr = [
			'a',
			'b',
			];`,
		description: "A number of style guides require or disallow spaces between array brackets and other tokens. This rule enforces consistent spacing inside array brackets.",
		category: "Best Practices",
		severity: "",
		title: "Disallow or Enforce Spaces Inside of Brackets",
	},
	{
		ruleId: "ESLINT_array-callback-return",
		language: "javascript",
		badExample: `
	let mapping = variable.reduce(function(a, b, index) {
		a[b] = index;
	}, {});`,
		goodExample: `
		let mapping = variable.reduce(function(a, b, index) {
			a[b] = index;
			return a;
		}, {});`,
		description: "`Array` has several methods for filtering, mapping, and folding.",
		category: "Best Practices",
		severity: "",
		title: "Enforces Return Statements",
	},
	{
		ruleId: "ESLINT_array-element-newline",
		language: "javascript",
		badExample: "let d = [1, 2, 3];",
		goodExample: `
		let d = [1,
			2,
			3];`,
		description: "A number of style guides require or disallow line breaks between array elements.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Line Breaks Between Array Elements",
	},
	{
		ruleId: "ESLINT_arrow-body-style",
		language: "javascript",
		badExample: "let foo = () => 0;",
		goodExample: `
		let a = () => {
			return 0;
		};`,
		description: "Arrow functions have two syntactic forms for their function bodies. They may be defined with a *block* body (denoted by curly braces) `() => { ... }` or with a single expression `() => ...`, whose value is implicitly returned.",
		category: "Best Practices",
		severity: "",
		title: "Require Braces in Arrow Function Body",
	},
	{
		ruleId: "ESLINT_arrow-parens",
		language: "javascript",
		badExample: "a => {};",
		goodExample: "(a) => {};",
		description: "Arrow functions can omit parentheses when they have exactly one parameter. In all other cases the parameter(s) must be wrapped in parentheses. This rule enforces the consistent use of parentheses in arrow functions.",
		category: "Best Practices",
		severity: "",
		title: "Require Parens in Arrow Function Arguments",
	},
	{
		ruleId: "ESLINT_arrow-spacing",
		language: "javascript",
		badExample: `
		(a) =>{};
		a =>a;`,
		goodExample: `
		(a) => {};
		a => a;`,
		description: "This rule normalizes the style of spacing before/after an arrow function's arrow(`=>`).",
		category: "Best Practices",
		severity: "",
		title: "Require Space Before/After Arrow Function's Arrow",
	},
	{
		ruleId: "ESLINT_block-scoped-var",
		language: "javascript",
		badExample: `
		function condition() {
			if (true) {
				let a = true;
			}

			console.log(a);
		}`,
		goodExample: `
		function condition() {
			let a;

			if (true) {
				a = true;
			}

			console.log(a);
				}`,
		description: "The `block-scoped-var` rule generates warnings when variables are used outside of the block in which they were defined. This emulates C-style block scope.",
		category: "Best Practices",
		severity: "",
		title: "Treat var as Block Scoped",
	},
	{
		ruleId: "ESLINT_block-spacing",
		language: "javascript",
		badExample: "function a() {return true;}",
		goodExample: "function a() { return true; }",
		description: "This rule enforces consistent spacing inside an open block token and the next token on the same line. This rule also enforces consistent spacing inside a close block token and previous token on the same line.",
		category: "Best Practices",
		severity: "",
		title: "Disallow/Enforce Spaces",
	},
	{
		ruleId: "ESLINT_brace-style",
		language: "javascript",
		badExample: `
		if (a)
		{
			b();
		}

		try
		{
			takeRisks();
		} catch(e)
		{
			doError();
		}`,
		goodExample: `
		if (a) {
			b();
			}

			try {
			takeRisks();
			} catch(e) {
			doError();
			}
		}`,
		description: "Thir rule enforces consistent brace style for blocks",
		category: "Best Practices",
		severity: "",
		title: "Require Brace Style",
	},
	{
		ruleId: "ESLINT_callback-return",
		language: "javascript",
		badExample: `
		function a(b, callback) {
			if (b) {
				callback(b);
			}
			callback();
		}`,
		goodExample: `
		function a(b, callback) {
			if (b) {
				return callback(b);
			}
			callback();
		}`,
		description: "This rule is aimed at ensuring that callbacks used outside of the main function block are always part-of or immediately preceding a return statement.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Return After Callback",
	},
	{
		ruleId: "ESLINT_camelcase",
		language: "javascript",
		badExample: `
		function a({ notincamel: no_camelcased }) {
			// ...
		}`,
		goodExample: `
		function a({ isCamelCased: alsoInCamel }) {
			// ...
		}`,
		description: "This rule enforces camelcase naming convention and suggests a consistent code styling approach.",
		category: "Best Practices",
		severity: "",
		title: "Require CamelCase",
	},
	{
		ruleId: "ESLINT_capitalized-comments",
		language: "javascript",
		badExample: `
		// Capitalized comment
		// not Capitalized comment`,
		goodExample: `
		// Capitalized comment
		// Capitalized comment as well`,
		description: "A consistent style can improve a project's maintainability. This rule enforces or disallows capitalization of the first letter of a comment.",
		category: "Best Practices",
		severity: "",
		title: "Enforce/Disallow Capitalization in Comments",
	},
	{
		ruleId: "ESLINT_class-methods-use-this",
		language: "javascript",
		badExample: `
		class A {
			a() {
				console.log("Hello World");
			}
		}`,
		goodExample: `
		class A {
			a() {
				this.bar = "Hello World";
			}
		}`,
		description: "If a class method does not use `this`, it can *sometimes* be made into a static function.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Utilize of `this` in Methods",
	},
	{
		ruleId: "ESLINT_comma-dangle",
		language: "javascript",
		badExample: `
		let a = {
			b: "b",
			c: "c",
		};

		let arr = [1,2,];`,
		goodExample: `
		let a = {
			b: "b",
			c: "c"
		};

		let arr = [1,2];`,
		description: "Trailing commas in object literals are valid according to the ECMAScript 5 (and ECMAScript 3!) spec. However, IE8 (when not in IE8 document mode) and below will throw an error when it encounters trailing commas in JavaScript.",
		category: "Best Practices",
		severity: "",
		title: "Require/Disallow Trailing Commas",
	},
	{
		ruleId: "ESLINT_comma-spacing",
		language: "javascript",
		badExample: `
		let a = 1 ,b = 2;
		let arr = [1 , 2];`,
		goodExample: `
		let a = 1, b = 2
		let arr = [1, 2];`,
		description: "Spacing around commas improves readability of a list of items. Although most of the style guidelines for languages prescribe adding a space after a comma and not before it, it is subjective to the preferences of a project.",
		category: "Best Practices",
		severity: "",
		title: "Enforces Spacing Around Commas",
	},
	{
		ruleId: "ESLINT_comma-style",
		language: "javascript",
		badExample: `
		let a = 1
		,
		b = 2;`,
		goodExample: "let a = 1, b = 2;",
		description: "The Comma Style rule enforces styles for comma-separated lists.",
		category: "Best Practices",
		severity: "",
		title: "Comma Style",
	},
	{
		ruleId: "ESLINT_complexity",
		language: "javascript",
		badExample: `
		function a(x) {
			if (true) {
				return x;
			} else if (false) {
				return x+1;
			} else {
				return 0;
			}
		}`,
		goodExample: `
		function a(x) {
			if (true) {
				return x;
			} else {
				return 0;
			}
		}`,
		description: "Cyclomatic complexity measures the number of linearly independent paths through a program's source code. This rule allows setting a cyclomatic complexity threshold.",
		category: "Best Practices",
		severity: "",
		title: "Limit Cyclomatic Complexity",
	},
	{
		ruleId: "ESLINT_computed-property-spacing",
		language: "javascript",
		badExample: `
		let foo = 1
		, bar = 2;`,
		goodExample: `
		let foo = 1,
		bar = 2;`,
		description: "While formatting preferences are very personal, a number of style guides require or disallow spaces between computed properties.",
		category: "Best Practices",
		severity: "",
		title: "Disallow/Enforce Spaces",
	},
	{
		ruleId: "ESLINT_consistent-return",
		language: "javascript",
		badExample: `
		function do(condition) {
			if (condition) {
				return true;
			} else {
				return;
			}
		}`,
		goodExample: `
		function do(condition) {
			if (condition) {
				return true;
			} else {
				return false;
			}
		}`,
		description: "Unlike statically-typed languages which enforce that a function returns a specified type of value, JavaScript allows different code paths in a function to return different types of values.",
		category: "Best Practices",
		severity: "",
		title: "Require `return` Statements",
	},
	{
		ruleId: "ESLINT_consistent-this",
		language: "javascript",
		badExample: `
let that;
function f() {
	that = this;
}`,
		goodExample: `
let that;
that = this;`,
		description: "This rule enforces consistent naming when capturing the current execution context.",
		category: "Best Practices",
		severity: "",
		title: "Require Consistent this",
	},
	{
		ruleId: "ESLINT_curly",
		language: "javascript",
		badExample: "if (a) a++;",
		goodExample: `
		if (a) {
			a++;
		}`,
		description: "it is considered by many to be best practice to never omit curly braces around blocks, even when they are optional, because it can lead to bugs and reduces code clarity. This rule requires following curly brace conventions.",
		category: "Best Practices",
		severity: "",
		title: "Require Following Curly Brace Conventions",
	},
	{
		ruleId: "ESLINT_default-case",
		language: "javascript",
		badExample: `
		switch (a) {
			case 1:
				/* code */
				break;
		}`,
		goodExample: `
		switch (a) {
			case 1:
				/* code */
				break;

			default:
				/* code */
				break;
		}`,
		description: "This rule aims to require default case in switch statements. You may optionally include a // no default after the last case if there is no default case.",
		category: "Best Practices",
		severity: "",
		title: "Require Default Case in Switch Statements",
	},
	{
		ruleId: "ESLINT_default-param-last",
		language: "javascript",
		badExample: "function f(a = 0, b) {}",
		goodExample: "function f(a, b = 0) {}",
		description: "Putting default parameter at last allows function calls to omit optional tail arguments.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Default Parameters to be Last",
	},
	{
		ruleId: "ESLINT_dot-location",
		language: "javascript",
		badExample: `
		let a = object.
		property;`,
		goodExample: `
		let foo = object
		.property;`,
		description: "Consistency in placing a newline before or after the dot can greatly increase readability.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Newline Before/After dot",
	},
	{
		ruleId: "ESLINT_dot-notation",
		language: "javascript",
		badExample: "let x = a['b'];",
		goodExample: "let x = a.b;",
		description: "In JavaScript, one can access properties using the dot notation (`foo.bar`) or square-bracket notation (`foo[\"bar\"]`). However, the dot notation is often preferred because it is easier to read, less verbose, and works better with aggressive JavaScript minimizers.",
		category: "Best Practices",
		severity: "",
		title: "Require dot Notation",
	},
	{
		ruleId: "ESLINT_eol-last",
		language: "javascript",
		badExample: `
		function do() {
			let a = 2;
		}
		`,
		goodExample: `
		function do() {
			let a = 2;
			}\n
		`,
		description: "Trailing newlines in non-empty files are a common UNIX idiom. Benefits of trailing newlines include the ability to concatenate or append to files as well as output files to the terminal without interfering with shell prompts.",
		category: "Best Practices",
		severity: "",
		title: "Require Newline",
	},
	{
		ruleId: "ESLINT_eqeqeq",
		language: "javascript",
		badExample: "a == undefined",
		goodExample: "a === undefined",
		description: "It is considered good practice to use the type-safe equality operators `===` and `!==` instead of their regular counterparts `==` and `!=`.",
		category: "Best Practices",
		severity: "",
		title: "Require === and !==",
	},
	{
		ruleId: "ESLINT_for-direction",
		language: "javascript",
		badExample: `
		for (let j = 0; j < 50; j--) {
		}

		for (let i = 200; i >= 100; i++) {
		}`,
		goodExample: `
		for (let j = 0; j < 50; i++) {
		}`,
		description: "A for loop with a stop condition that can never be reached, such as one with a counter that moves in the wrong direction, will run infinitely. While there are occasions when an infinite loop is intended, the convention is to construct such loops as while loops.",
		category: "Best Practices",
		severity: "",
		title: "Enforce for Loop",
	},
	{
		ruleId: "ESLINT_func-call-spacing",
		language: "javascript",
		badExample: `
		new a();
		new a ();`,
		goodExample: `
		new a();
		new a();`,
		description: "When calling a function, developers may insert optional whitespace between the function's name and the parentheses that invoke it.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Spacing Between Function and Invocations",
	},
	{
		ruleId: "ESLINT_func-name-matching",
		language: "javascript",
		badExample: "Object.create(obj, {a:{value: function b() {}}});",
		goodExample: "Object.create(obj, {a:{value: function a() {}}});",
		description: "This rule requires function names to match the name of the variable or property to which they are assigned.",
		category: "Best Practices",
		severity: "",
		title: "Require Match of Function Names",
	},
	{
		ruleId: "ESLINT_func-names",
		language: "javascript",
		badExample: `
		A.prototype.b = function b() {};

		(function b() {
			// ...
		}())`,
		goodExample: `
		A.prototype.b = function() {};

		(function() {
			// ...
		}())`,
		description: "A pattern that's becoming more common is to give function expressions names to aid in debugging.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Named `function` Expressions",
	},
	{
		ruleId: "ESLINT_func-style",
		language: "javascript",
		badExample: `
		function a() {
			// ...
		}`,
		goodExample: `
		let a = function() {
			// ...
		};

		let a = () => {};`,
		description: "There are two ways of defining functions in JavaScript: `function` declarations and `function` expressions. Declarations contain the `function` keyword first, followed by a name and then its arguments and the function body.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Use of Declarations or Expressions",
	},
	{
		ruleId: "ESLINT_function-call-argument-newline",
		language: "javascript",
		badExample: `
		a("one", "two",
			"three");
		`,
		goodExample: `
		a(
			"one",
			"two",
			"three"
		);`,
		description: "A number of style guides require or disallow line breaks between arguments of a function call.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Line Breaks Between Arguments",
	},
	{
		ruleId: "ESLINT_function-paren-newline",
		language: "javascript",
		badExample: "function a(b, c) {}",
		goodExample: `
		function a(
			b,
			c
			) {}
		`,
		description: "Many style guides require or disallow newlines inside of function parentheses.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Line Breaks in Function Parentheses",
	},
	{
		ruleId: "ESLINT_generator-star-spacing",
		language: "javascript",
		badExample: `
		function * generator() {}

		let anonymous = function* () {};

		let shorthand = { *generator() {} };

		class Class { static* method() {} }`,
		goodExample: `
		function* generator() {}

		let anonymous = function*() {};

		let shorthand = { * generator() {} };

		class Class { static * method() {} }`,
		description: "Generators are a new type of function in ECMAScript 6 that can return multiple values over time.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Spacing Around the * in Generator Functions",
	},
	{
		ruleId: "ESLINT_getter-return",
		language: "javascript",
		badExample: `
		p = {
			get a(){
				// no returns.
			}
		};`,
		goodExample: `
		p = {
			get a(){
				return 'b';
			}
		};`,
		description: "The get syntax binds an object property to a function that will be called when that property is looked up.",
		category: "Best Practices",
		severity: "",
		title: "Enforce return Statement for getters",
	},
	{
		ruleId: "ESLINT_grouped-accessor-pairs",
		language: "javascript",
		badExample: `
		let dummy = {
			get a() {
				return this.val;
			},
			b: 1,
			set a(value) {
				this.val = value;
			}
		};`,
		goodExample: `
		let dummy = {
			get a() {
				return this.val;
			},
			set a(value) {
				this.val = value;
			},
			b: 1
		};`,
		description: "A getter and setter for the same property don't necessarily have to be defined adjacent to each other.",
		category: "Best Practices",
		severity: "",
		title: "Require Grouped Accessor Pairs",
	},
	{
		ruleId: "ESLINT_guard-for-in",
		language: "javascript",
		badExample: `
		for (key in a) {
			do(key);
		}`,
		goodExample: `
		for (key in a) {
			if (Object.prototype.hasOwnProperty.call(a, key)) {
				do(key);
			}
		}`,
		description: "Looping over objects with a `for in` loop will include properties that are inherited through the prototype chain. This behavior can lead to unexpected items in your for loop.",
		category: "Best Practices",
		severity: "",
		title: "Require Guarding for-in",
	},
	{
		ruleId: "ESLINT_handle-callback-err",
		language: "javascript",
		badExample: `
		function load (err, b) {
			do();
		}`,
		goodExample: `
		function load (err, b) {
			if (err) {
				console.log(err.stack);
			}
			do();
		}`,
		description: "In Node.js, a common pattern for dealing with asynchronous behavior is called the callback pattern.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Callback Error Handling",
	},
	{
		ruleId: "ESLINT_id-blacklist",
		language: "javascript",
		badExample: `
		class A {
			callback( {);
		}`,
		goodExample: `
		class A {
			method( {);
		}`,
		description: "Generic names can lead to hard-to-decipher code. This rule allows you to specify a deny list of disallowed identifier names to avoid this practice.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Specified Identifiers",
	},
	{
		ruleId: "ESLINT_id-length",
		language: "javascript",
		badExample: "let x = 5;",
		goodExample: "let name = 5;",
		description: "Very short identifier names like `e`, `x`, `_t` or very long ones like `hashGeneratorResultOutputContainerObject` can make code harder to read and potentially less maintainable. To prevent this, one may enforce a minimum and/or maximum identifier length.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Minimum and Maximum Identifier Lengths",
	},
	{
		ruleId: "ESLINT_id-match",
		language: "javascript",
		badExample: `
		class first_Class {}

		class firstClass {
			do() {}
		}`,
		goodExample: `
		class firstClass {}

		class firstClass {
			do() {}
		}`,
		description: "This rule allows you to precisely define and enforce the variables and function names that should be used.",
		category: "Best Practices",
		severity: "",
		title: "Require Identifiers Match Expression",
	},
	{
		ruleId: "ESLINT_implicit-arrow-linebreak",
		language: "javascript",
		badExample: `
		(a) =>
		b;`,
		goodExample: "(a) => b;",
		description: "An arrow function body can contain an implicit return as an expression instead of a block body. It can be useful to enforce a consistent location for the implicitly returned expression.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Location of Arrow Function Bodies",
	},
	{
		ruleId: "ESLINT_indent-legacy",
		language: "javascript",
		badExample: `
		if (a) {
			b=c;
			function fun(d) {
				e=f;
			}
			}
	`,
		goodExample: `
		if (a) {
			b=c;
			function fun(d) {
				e=f;
			}
		}`,
		description: "This rule introduces a consistent style in your code and specifies the ammount of spaces used for indentation.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Consistent Indentation",
	},
	{
		ruleId: "ESLINT_indent",
		language: "javascript",
		badExample: `
		if (a) {
			b=c;
			function fun(d) {
				e=f;
			}
		}`,
		goodExample: `
		if (a) {
			b=c;
			function fun(d) {
				e=f;
			}
		}`,
		description: "There are several common guidelines which require specific indentation of nested blocks and statements.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Consistent Indentation",
	},
	{
		ruleId: "ESLINT_init-declarations",
		language: "javascript",
		badExample: `
		function a() {
			let b;
			let c;
		}`,
		goodExample: `
		function a() {
			let b = 1;
			let c = 2;
			const qux = 3;
		}`,
		description: "In JavaScript, variables can be assigned during declaration, or at any point afterwards using an assignment statement. For example, in the following code, `foo` is initialized during declaration, while `bar` is initialized later.",
		category: "Best Practices",
		severity: "",
		title: "Require Initialization in Variable Declarations",
	},
	{
		ruleId: "ESLINT_jsx-quotes",
		language: "javascript",
		badExample: "<a b='car' />",
		goodExample: "<a b=\"car\" />",
		description: "JSX attribute values can contain string literals, which are delimited with single or double quotes.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Consistent Use of Double Quotes",
	},
	{
		ruleId: "ESLINT_key-spacing",
		language: "javascript",
		badExample: "let obj = { 'a' : 42 };",
		goodExample: "let obj = { 'a': 42 };",
		description: "This rule enforces spacing around the colon in object literal properties. It can verify each property individually, or it can ensure horizontal alignment of adjacent properties in an object literal.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Consistent Spacing Between Keys and Values",
	},
	{
		ruleId: "ESLINT_keyword-spacing",
		language: "javascript",
		badExample: `
		if (a) {
			//...
		}else if (b) {
			//...
		}else {
			//...
		}`,
		goodExample: `
		if (a) {
			//...
		} else if (b) {
			//...
		} else {
			//...
		}`,
		description: "Keywords are syntax elements of JavaScript, such as `try` and `if`.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Consistent Spacing Before/After Keywords",
	},
	{
		ruleId: "ESLINT_line-comment-position",
		language: "javascript",
		badExample: "1 + 1; // invalid comment",
		goodExample: `
		// valid comment
		1 + 1;`,
		description: "Line comments can be positioned above or beside code. This rule helps teams maintain a consistent style.",
		category: "Best Practices",
		severity: "",
		title: "enforce position of line comments",
	},
	{
		ruleId: "ESLINT_linebreak-style",
		language: "javascript",
		badExample: "let a = 'a'; // \r\n",
		goodExample: `
		let a = 'a', // \n
		b = 'b'; // \n
		// \n`,
		description: "This rule enforces consistent line endings independent of operating system, VCS, or editor used across your codebase.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Consistent Linebreak Style",
	},
	{
		ruleId: "ESLINT_lines-around-comment",
		language: "javascript",
		badExample: `
		let a = "b";
		/* what a great and wonderful day */
		let c = "d"`,
		goodExample: `
		let a = "b";

		/* what a great and wonderful day */
		let c = "d"`,
		description: "Many style guides require empty lines before or after comments. The primary goal of these rules is to make the comments easier to read and improve readability of the code.",
		category: "Best Practices",
		severity: "",
		title: "Require Empty Lines Around Comments",
	},
	{
		ruleId: "ESLINT_lines-around-directive",
		language: "javascript",
		badExample: `
		"use strict";
		let a;`,
		goodExample: `
		"use strict";

		let a;`,
		description: "This rule requires or disallows blank newlines around directive prologues. This rule does not enforce any conventions about blank newlines between the individual directives. In addition, it does not require blank newlines before directive prologues unless they are preceded by a comment.",
		category: "Best Practices",
		severity: "",
		title: "Require Newlines Around Directives",
	},
	{
		ruleId: "ESLINT_lines-between-class-members",
		language: "javascript",
		badExample: `
		class Alpha{
			x;
			yvar(){}
			zvar(){}
		}`,
		goodExample: `
		class Alpha{
			x;

			yvar(){}

			zvar(){}
		}`,
		description: "This rule improves readability by enforcing lines between class members. It will not check empty lines before the first member and after the last member, since that is already taken care of by padded-blocks.",
		category: "Best Practices",
		severity: "",
		title: "Require an Empty Line Between Class Members",
	},
	{
		ruleId: "ESLINT_max-classes-per-file",
		language: "javascript",
		badExample: `
		class dummyA {}
		class dummyB {},
		class dummyC {}`,
		goodExample: "class dummyA {}",
		description: "Files containing multiple classes can often result in a less navigable and poorly structured codebase. Best practice is to keep each file limited to a single responsibility.",
		category: "Best Practices",
		severity: "",
		title: "Enforce a Maximum Number of Classes per File",
	},
	{
		ruleId: "ESLINT_max-depth",
		language: "javascript",
		badExample: `
		function alpha() {
			for (;;) { // Nested 1 deep
				while (true) { // Nested 2 deep
					if (true) { // Nested 3 deep
						if (true) { // Nested 4 deep
							if (true) { // Nested 5 deep
							}
						}
					}
				}
			}
		}`,
		goodExample: `
		function alpha() {
			for (;;) { // Nested 1 deep
				while (true) { // Nested 2 deep
					if (true) { // Nested 3 deep
						if (true) { // Nested 4 deep
						}
					}
				}
			}
		}`,
		description: "Many developers consider code difficult to read if blocks are nested beyond a certain depth.",
		category: "Best Practices",
		severity: "",
		title: "Enforce a Maximum Depth of Nesting Blocks",
	},
	{
		ruleId: "ESLINT_max-len",
		language: "javascript",
		badExample: "let a = { \"a\" : \"This is a long string, which is used as values of an object's a key\", \"b\" : \"This is a long string, which is used as values of an object's b key\" };",
		goodExample: `
		let a = {
			"a" : "This is a long string, which is used as values of an object's a key",
			"b" : "This is a long string, which is used as values of an object's b key"
		};`,
		description: "Very long lines of code in any language can be difficult to read. In order to aid in readability and maintainability many coders have developed a convention to limit lines of code to a specific number of characters.",
		category: "Best Practices",
		severity: "",
		title: "Enforce a Maximum Line Length",
	},
	{
		ruleId: "ESLINT_max-lines-per-function",
		language: "javascript",
		badExample: `
		Examples of incorrect code for this rule with a max value of 2:
		function alpha() {
			let name = "name";
		}`,
		goodExample: `
		Examples of incorrect code for this rule with a max value of 3:
		function alpha() {
			let name = "name";
		}`,
		description: "Many coding style guides dictate a limit of the number of lines that a function can comprise of. This rule can help enforce that style.",
		category: "Best Practices",
		severity: "",
		title: "Enforce a Maximum Function Length",
	},
	{
		ruleId: "ESLINT_max-lines",
		language: "javascript",
		badExample: `
		Examples of incorrect code for this rule with a max value of 2:
		let a,
			b,
			c;`,
		goodExample: `
		Examples of incorrect code for this rule with a max value of 2:
		let a,
			b, c;`,
		description: "Large files tend to do a lot of things and can make it hard following what's going. While there is not an objective maximum number of lines considered acceptable in a file, it is agreed that it should not be in the thousands. Recommendations usually range from 100 to 500 lines.",
		category: "Best Practices",
		severity: "",
		title: "Enforce a Maximum File Length",
	},
	{
		ruleId: "ESLINT_max-nested-callbacks",
		language: "javascript",
		badExample: `
		Examples of incorrect code for this rule with maximum of 3 levels of nesting:
		alpha1(function() {
			alpha2(function() {
				alpha3(function() {
					alpha4(function() {
						// Do something
					});
				});
			});
		});`,
		goodExample: `
		Examples of correct code for this rule with maximum of 3 levels of nesting:
		function doAlpha1() {
			alpha2(doAlpha2);
		}

		function doAlpha2() {
			alpha3(doAlpha3);
		}`,
		description: "This rule enforces a maximum depth that callbacks can be nested to increase code clarity.",
		category: "Best Practices",
		severity: "",
		title: "Enforce a Maximum Depth of Nesting Callbacks",
	},
	{
		ruleId: "ESLINT_max-params",
		language: "javascript",
		badExample: `
		Examples of incorrect code for this rule with the default maximum of 3 params:
		function alpha (b, c, d, e) {
			do();
		}`,
		goodExample: `
		Examples of correct code for this rule with the default maximum of 3 params:
		function alpha (b, c, d) {
			do();
		}`,
		description: "Functions that take numerous parameters can be difficult to read and write because it requires the memorization of what each parameter is, its type, and the order they should appear in.",
		category: "Best Practices",
		severity: "",
		title: "Enforce a Maximum Number of Parameters",
	},
	{
		ruleId: "ESLINT_max-statements-per-line",
		language: "javascript",
		badExample: `
		Examples of incorrect code for this rule with the default maximum of 1 statement:
		let b; let c;
		if (condition) { c = 1; }`,
		goodExample: `
		Examples of correct code for this rule with the default maximum of 1 statement:
		let b, c;
		if (condition) c = 1;`,
		description: "A line of code containing too many statements can be difficult to read.",
		category: "Best Practices",
		severity: "",
		title: "Enforce a Maximum Number of Statements per Line",
	},
	{
		ruleId: "ESLINT_max-statements",
		language: "javascript",
		badExample: `
		Examples of incorrect code for this rule with the default maximum 2 statements:
		function alpha() {
			let alpha1 = 1;
			let alpha2 = 2;
			let alpha3 = 3;
		}`,
		goodExample: `
		Examples of correct code for this rule with the default maximum 2 statements:
		function alpha() {
			let alpha1 = 1;
			let alpha2 = 2;
		}`,
		description: "The `max-statements` rule allows you to specify the maximum number of statements allowed in a function.",
		category: "Best Practices",
		severity: "",
		title: "Enforce a Maximum Number of Statements in Function Blocks",
	},
	{
		ruleId: "ESLINT_multiline-comment-style",
		language: "javascript",
		badExample: `
		Example of incorrect code for this rule with the default "starred-block" style of comments:
		// this line
		// calls alpha()
		alpha();`,
		goodExample: `
		Example of incorrect code for this rule with the default "starred-block" style of comments:
		/*
			* this line
			* calls alpha()
		*/
		alpha();`,
		description: "Many style guides require a particular style for comments that span multiple lines.",
		category: "Best Practices",
		severity: "",
		title: "Enforce a Particular Style for Multiline Comments",
	},
	{
		ruleId: "ESLINT_multiline-ternary",
		language: "javascript",
		badExample: "a > b ? value1 : value2;",
		goodExample: `
		a > b ?
		value1 :
		value2;`,
		description: "This rule enforces newlines between operands of a ternary expression.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Newlines Ternary Expressions",
	},
	{
		ruleId: "ESLINT_new-cap",
		language: "javascript",
		badExample: "let alpha = new beta();",
		goodExample: "let alpha = new Beta();",
		description: "It is required that constructor names begin with a capital letter. Certain built-in identifiers are exempt from this rule.",
		category: "Best Practices",
		severity: "",
		title: "Require Constructor Names with Capital Letter",
	},
	{
		ruleId: "ESLINT_new-parens",
		language: "javascript",
		badExample: "let alpha = new (Beta);",
		goodExample: "let alpha = new Beta();",
		description: "It can enforce or disallow parentheses when invoking a constructor with no arguments using the new keyword.",
		category: "Best Practices",
		severity: "",
		title: "Require Parentheses When Invoking a Constructor",
	},
	{
		ruleId: "ESLINT_newline-after-var",
		language: "javascript",
		badExample: `
		let alpha = "apple,",
		beta = "ball";
		console.log(alpha, beta);`,
		goodExample: `
		let alpha = "apple,",
		beta = "ball";

		console.log(alpha, beta);`,
		description: "This enforces a coding style where empty lines are required or disallowed after var, let, or const statements to achieve a consistent coding style across the project.",
		category: "Best Practices",
		severity: "",
		title: "Require Empty Line after Declarations",
	},
	{
		ruleId: "ESLINT_newline-before-return",
		language: "javascript",
		badExample: `
		function alpha(beta) {
			if (!beta) {
				return;
			}
			return beta;
		}`,
		goodExample: `
		function alpha() {

			return;
		}`,
		description: "It is required to have an empty line before return statements to increase code clarity, except when the return is alone inside a statement group (such as an if statement).",
		category: "Best Practices",
		severity: "",
		title: "Require Empty Line Before Return",
	},
	{
		ruleId: "ESLINT_newline-per-chained-call",
		language: "javascript",
		badExample: "_.chain({}).map(alpha).filter(beta).value();",
		goodExample: `
		_
			.chain({})
			.map(alpha)
			.filter(beta)
			.value();
		`,
		description: "This rule requires a newline after each call in a method chain or deep member access.",
		category: "Best Practices",
		severity: "",
		title: "Require Newline after Each Call",
	},
	{
		ruleId: "ESLINT_no-alert",
		language: "javascript",
		badExample: "alert(\"Warning\");",
		goodExample: "customAlert(\"Do!\");",
		description: "This is aimed at catching debugging code that should be removed and popup UI elements that should be replaced with less obtrusive, custom UIs. ",
		category: "Best Practices",
		severity: "",
		title: "Disallow Use of Alert",
	},
	{
		ruleId: "ESLINT_no-array-constructor",
		language: "javascript",
		badExample: "new Array(1, 2, 3)",
		goodExample: "new Array(arrayTwo.length)",
		description: "It prevents Array constructors.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Array Constructors",
	},
	{
		ruleId: "ESLINT_no-async-promise-executor",
		language: "javascript",
		badExample: `
		const result = new Promise(async (resolve, reject) => {
			resolve(await alpha);
			}
		);`,
		goodExample: "const result = Promise.resolve(alpha);",
		description: "This dismisses async Promise executor functions.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Using Async Function",
	},
	{
		ruleId: "ESLINT_no-await-in-loop",
		language: "javascript",
		badExample: `
		for (const alpha of alphas) {
		results.push(await beta(alpha));
		}
		return theta(results);`,
		goodExample: `
		for (const alpha of alphas) {
		results.push(beta(alpha));
		}
		return theta(await Promise.all(results));`,
		description: "This rule disallows the use of await within loop bodies.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Await Inside Loops",
	},
	{
		ruleId: "ESLINT_no-bitwise",
		language: "javascript",
		badExample: "let a = b | c;",
		goodExample: "let a = b || c;",
		description: "It prevents bitwise operators.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Bitwise Operators",
	},
	{
		ruleId: "ESLINT_no-buffer-constructor",
		language: "javascript",
		badExample: `
		new Buffer(res.alpha.beta);
		new Buffer(res.alpha.theta);`,
		goodExample: `
		Buffer.alloc(res.alpha.beta);
		Buffer.from(res.alpha.theta);`,
		description: "It disallows calling and constructing the Buffer() constructor.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Use of Buffer Constructor",
	},
	{
		ruleId: "ESLINT_no-caller",
		language: "javascript",
		badExample: `
		function alpha(m) {
			if (m <= 0) {
				return;
			}

			arguments.callee(m - 1);
		}`,
		goodExample: `
		function alpha(m) {
			if (m <= 0) {
				return;
			}

			foo(m - 1);
		}`,
		description: "It discourages the use of deprecated and sub-optimal code by disallowing the use of arguments.caller and arguments.callee.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Use of Caller Callee",
	},
	{
		ruleId: "ESLINT_no-case-declarations",
		language: "javascript",
		badExample: `
		switch (alpha) {
			case 1:
				let a = 1;
				break;
			case 2:
				const b = 2;
				break;
			case 3:
				function f() {}
				break;
			default:
				class H {}
		}`,
		goodExample: `
		const x = 0;

		switch (alpha) {
			case 1: {
				let a = 1;
				break;
			}
			case 2: {
				const b = 2;
				break;
			}
			case 3: {
				function f() {}
				break;
			}
			case 4:
				let c = 4;
				break;
			default: {
				class H {}
			}
		}`,
		description: "It prevents access to uninitialized lexical bindings as well as accessing hoisted functions across case clauses.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Lexical Declarations",
	},
	{
		ruleId: "ESLINT_no-catch-shadow",
		language: "javascript",
		badExample: `
		let err = "a";

		try {
			throw "warning";
		} catch (err) {

		}`,
		goodExample: `
		let err = "a";

		try {
			throw "warning";
		} catch (e) {

		}`,
		description: "This will warn whenever it encounters a catch clause parameter that has the same name as a variable in an outer scope.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Shadowing of Inside Catch",
	},
	{
		ruleId: "ESLINT_no-class-assign",
		language: "javascript",
		badExample: `
		class X { }
		X = 0;`,
		goodExample: `
		let X = class X { }
		X = 0;`,
		description: "It flags modifying variables of class declarations.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Modifying Variables",
	},
	{
		ruleId: "ESLINT_no-compare-neg-zero",
		language: "javascript",
		badExample: `
		if (a === -0) {
		// do()...
		}`,
		goodExample: `
		if (a === 0) {
		// do()...
		}`,
		description: "This warns against code that tries to compare against -0, since that will not work as intended.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Comparing Against -0",
	},
	{
		ruleId: "ESLINT_no-cond-assign",
		language: "javascript",
		badExample: `
		let a;
		if (a = 0) {
			let x = 1;
		}`,
		goodExample: `
		let a;
		if (a === 0) {
			let x = 1;
		}`,
		description: "It disallows ambiguous assignment operators in test conditions of if, for, while, and do...while statements.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Assignment Operators",
	},
	{
		ruleId: "ESLINT_no-confusing-arrow",
		language: "javascript",
		badExample: "let a = x => 4 ? 5 : 6;",
		goodExample: "let a = x => (4 ? 5 : 6);",
		description: "It is not allowed to use arrow functions where they could be confused with comparisons.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Arrow Functions",
	},
	{
		ruleId: "ESLINT_no-console",
		language: "javascript",
		badExample: "console.log(\"A message\");",
		goodExample: "Console.log(\"This is a message\");",
		description: "This prevents calls or assignments to methods of the console object.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Use of Console`",
	},
	{
		ruleId: "ESLINT_no-const-assign",
		language: "javascript",
		badExample: `
		const vav = 0;
		vav += 1;`,
		goodExample: `
		const vav = 0;
		console.log(vav);`,
		description: "This is aimed to flag modifying variables that are declared using const keyword.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Modifying Variables Using Const",
	},
	{
		ruleId: "ESLINT_no-constant-condition",
		language: "javascript",
		badExample: `
		if (void a) {
			doWhatIsNotFinished();
		}
		if (a &&= false) {
			doThisNever();
		}`,
		goodExample: `
		if (a === 5) {
			doThis();
		}
		while (typeof a === "undefined") {
			doThis();
		}`,
		description: "According to this rule, it is not allowed constant expressions in the test condition.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Constant Expressions in Conditions",
	},
	{
		ruleId: "ESLINT_no-constructor-return",
		language: "javascript",
		badExample: `
		class C {
			constructor(c) {
				this.c = c;
				return c;
			}
		}`,
		goodExample: `
		class C {
			constructor(c) {
				this.c = c;
			}
		}`,
		description: "This prevents return statements in the constructor of a class.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Returning Value in Constructor",
	},
	{
		ruleId: "ESLINT_no-continue",
		language: "javascript",
		badExample: `
		for(i = 0; i < 5; i++) {
			if(i >= 3) {
				continue;
			}

			a += i;
		}`,
		goodExample: `
		for(i = 0; i < 5; i++) {
			if(i < 3) {
				a += i;
			}
		}`,
		description: "This disallows continue statements.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Continue Statements",
	},
	{
		ruleId: "ESLINT_no-control-regex",
		language: "javascript",
		badExample: `
		let expression1 = /\u00FF/;
		let expression2 = new RegExp("\u00FF");`,
		goodExample: `
		let expression1 = /\u002C/;
		let expression2 = new RegExp("\u002C");`,
		description: "It is not allowed control characters in regular expressions.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Control Characters",
	},
	{
		ruleId: "ESLINT_no-debugger",
		language: "javascript",
		badExample: `
		function isReal(x) {
			debugger;
			return true;
		}`,
		goodExample: `
		function isReal(x) {
			return true; // add a breakpoint here
		}`,
		description: "It is suggested not to use debugger statements.",
		category: "Best Practices",
		severity: "",
		title: "Disallow the Use of Debugger",
	},
	{
		ruleId: "ESLINT_no-delete-var",
		language: "javascript",
		badExample: `
		let x;
		delete x;`,
		goodExample: "",
		description: "The use of the delete operator on variables is not allowed.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Deleting Variables",
	},
	{
		ruleId: "ESLINT_no-div-regex",
		language: "javascript",
		badExample: "function beta() { return /=alpha/; }",
		goodExample: "function beta() { return /[=]alpha/; }",
		description: "This is used to disambiguate the division operator to not confuse users.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Regular Expressions That Look Like Division",
	},
	{
		ruleId: "ESLINT_no-dupe-args",
		language: "javascript",
		badExample: `
		function alpha(x, y, x) {
			console.log("value of the second x:", x);
		}`,
		goodExample: `
		function alpha(x, y, z) {
			console.log(x, y, z);
		}`,
		description: "Duplicate parameter names in function declarations or expressions are not permitted. It does not apply to arrow functions or class methods, because the parser reports the error.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Duplicate Arguments in Function",
	},
	{
		ruleId: "ESLINT_no-dupe-class-members",
		language: "javascript",
		badExample: `
		class Boo {
			bob() { }
			get bob() { }
		}`,
		goodExample: `
		class Boo {
			get bob() { }
			set bob(value) { }
		}`,
		description: "This flags the use of duplicate names in class members.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Duplicate Name in Class Members",
	},
	{
		ruleId: "ESLINT_no-dupe-else-if",
		language: "javascript",
		badExample: `
		if (test(x)) {
			boo();
		} else if (test(x)) {
			bob();
		}`,
		goodExample: `
		if (first(x)) {
			boo();
		} else if (second(x)) {
			bob();
		}`,
		description: "It is not allowed to use duplicate conditions in the same if-else-if chain.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Duplicate Conditions in if-else-if",
	},
	{
		ruleId: "ESLINT_no-dupe-keys",
		language: "javascript",
		badExample: `
		let boo = {
			var: "abc",
			var: "cba
		};

		let boo = {
			"var": "abc",
			var: "cba"
		};`,
		goodExample: `
		let boo = {
			var: "abc",
			var2: "cba"
		};`,
		description: "This rule disallows duplicate keys in object literals.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Duplicate Keys",
	},
	{
		ruleId: "ESLINT_no-duplicate-case",
		language: "javascript",
		badExample: `
		let x = 5;
		switch (x) {
			case one:
				console.log(4);
				break;
			case two:
				console.log(3);
				break;
			case one:
				console.log(2);
				break;
			default:
				console.log(1);
				break;
		}`,
		goodExample: `
		let x = 5;
		switch (x) {
			case one:
				console.log(4);
				break;
			case two:
				console.log(3);
				break;
			case three:
				console.log(2);
				break;
			default:
				console.log(1);
				break;
		}`,
		description: "Duplicate test expressions in case clauses of switch statements are not allowed.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Duplicate Case Labels",
	},
	{
		ruleId: "ESLINT_no-duplicate-imports",
		language: "javascript",
		badExample: `
		import { alpha } from 'module';
		import { beta } from 'module';`,
		goodExample: "import { alpha, beta } from 'module';",
		description: "It is required that all imports from a single module that can be merged exist in a single import statement.",
		category: "Best Practices",
		severity: "",
		title: "Disallow duplicate imports",
	},
	{
		ruleId: "ESLINT_no-else-return",
		language: "javascript",
		badExample: `
		function alpha() {
			if (a) {
				return b;
			} else {
				return c;
			}
		}`,
		goodExample: `
		function alpha() {
			if (a) {
				return b;
			}

			return c;
		}`,
		description: "It highlights an unnecessary block of code following an if containing a return statement. As such, it will warn when it encounters an else following a chain of ifs, all of them containing a return statement.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Return before Else",
	},
	{
		ruleId: "ESLINT_no-empty-character-class",
		language: "javascript",
		badExample: `
		/^xyz[]/.test("xyzpoi");
		"xyzpoi".match(/^xyz[]/);`,
		goodExample: `
		/^xyz/.test("xyzpoi");
		"xyzpoi".match(/^xyz/);`,
		description: "This rule disallows empty character classes in regular expressions.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Empty Character Classes",
	},
	{
		ruleId: "ESLINT_no-empty-function",
		language: "javascript",
		badExample: "function alpha() {}",
		goodExample: `
		function alpha() {
			// do nothing.
		}`,
		description: "This eliminates empty functions. A function will not be considered a problem if it contains a comment.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Empty Functions",
	},
	{
		ruleId: "ESLINT_no-empty-pattern",
		language: "javascript",
		badExample: "let {b: {}} = alpha;",
		goodExample: "let {b = {}} = alpha;",
		description: "This flags any empty patterns in destructured objects and arrays, and as such, will report a problem whenever one is encountered.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Empty Destructuring Patterns",
	},
	{
		ruleId: "ESLINT_no-empty",
		language: "javascript",
		badExample: `
		if (alpha) {
		}`,
		goodExample: `
		if (alpha) {
		//do Nothing
		}`,
		description: "Empty block statements are not permitted. This rule ignores block statements which contain a comment (for example, in an empty catch or finally block of a try statement to indicate that execution should continue regardless of errors).",
		category: "Best Practices",
		severity: "",
		title: "disallow empty block statements",
	},
	{
		ruleId: "ESLINT_no-eq-null",
		language: "javascript",
		badExample: `
		if (alpha == null) {
			beta();
		}`,
		goodExample: `
		if (alpha == null) {
			beta();
		}`,
		description: "The no-eq-null rule aims reduce potential bug and unwanted behavior by ensuring that comparisons to null only match null, and not also undefined. As such it will flag comparisons to null when using == and !=.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Null Comparisons",
	},
	{
		ruleId: "ESLINT_no-eval",
		language: "javascript",
		badExample: `
		let obj = { a: "alpha" },
		key = "a",
		value = eval("obj." + key);`,
		goodExample: `
		let obj = { a: "alpha" },
		key = "a",
		value = obj[key];`,
		description: "This prevents potentially dangerous, unnecessary, and slow code by disallowing the use of the eval() function. As such, it will warn whenever the eval() function is used.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Eval",
	},
	{
		ruleId: "ESLINT_no-ex-assign",
		language: "javascript",
		badExample: `
		try {
			// doSomething
		} catch (e) {
			e = 5;
		}`,
		goodExample: `
		try {
			// doSomething
		} catch (e) {
			let alpha = 5;
		}`,
		description: "It is not permitted to reassign exceptions in catch clauses.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Reassigning Exceptions in Catch",
	},
	{
		ruleId: "ESLINT_no-extend-native",
		language: "javascript",
		badExample: `
		Object.prototype.alpha = 'a';
		Object.defineProperty(Array.prototype, "times", { value: 100 });`,
		goodExample: "Object.prototype.alpha = 'a';",
		description: "Disallows directly modifying the prototype of builtin objects.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Extending of Native Objects",
	},
	{
		ruleId: "ESLINT_no-extra-bind",
		language: "javascript",
		badExample: `
		let a = function () {
			alpha();
		}.bind(beta);`,
		goodExample: `
		let a = function () {
			this.alpha();
		}.bind(beta);`,
		description: "This avoids the unnecessary use of bind() and as such will warn whenever an immediately-invoked function expression (IIFE) is using bind() and doesn't have an appropriate this value. This rule won't flag usage of bind() that includes function argument binding.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Unnecessary Function Binding",
	},
	{
		ruleId: "ESLINT_no-extra-boolean-cast",
		language: "javascript",
		badExample: `
		let alpha = !!!beta;
		let alpha = Boolean(!!beta);`,
		goodExample: `
		let alpha = !!beta;
		let alpha = Boolean(beta);`,
		description: "It disallows unnecessary boolean casts.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Unnecessary Boolean Casts",
	},
	{
		ruleId: "ESLINT_no-extra-label",
		language: "javascript",
		badExample: `
		B: while (b) {
			break B;
		}`,
		goodExample: `
		while (b) {
			break;
		}`,
		description: "This eliminates unnecessary labels.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Unnecessary Labels",
	},
	{
		ruleId: "ESLINT_no-extra-parens",
		language: "javascript",
		badExample: "(function(){} ? x() : y());",
		goodExample: "(function(){}) ? x() : y();",
		description: "This restricts the use of parentheses to only where they are necessary.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Unnecessary Parentheses",
	},
	{
		ruleId: "ESLINT_no-extra-semi",
		language: "javascript",
		badExample: `
		function foo() {
			// doSomething
		};`,
		goodExample: `
		function foo() {
			// doSomething
		}`,
		description: "This prevents unnecessary semicolons.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Unnecessary Semicolons",
	},
	{
		ruleId: "ESLINT_no-fallthrough",
		language: "javascript",
		badExample: `
		switch(alpha) {
			case 1:
				doSome();

			case 2:
				doSome();
		}`,
		goodExample: `
		switch(alpha) {
			case 1:
				doSome();
				break;

			case 2:
				doSome();
		}`,
		description: "This eliminates unintentional fallthrough of one case to the other. As such, it flags any fallthrough scenarios that are not marked by a comment.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Case Statement Fallthrough",
	},
	{
		ruleId: "ESLINT_no-floating-decimal",
		language: "javascript",
		badExample: "let num = .8;",
		goodExample: "let num = 0.8;",
		description: "This discards floating decimal points and will warn whenever a numeric value has a decimal point but is missing a number either before or after it.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Floating Decimals",
	},
	{
		ruleId: "ESLINT_no-func-assign",
		language: "javascript",
		badExample: `
		function alpha() {}
		alpha = beta;`,
		goodExample: `
		let alpha = function () {}
		alpha = beta;`,
		description: "Reassigning function declarations is not permitted.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Reassigning Function",
	},
	{
		ruleId: "ESLINT_no-global-assign",
		language: "javascript",
		badExample: `
		Object = null
		undefined = 1`,
		goodExample: `
		x = 1
		let y = 1
		y = 2`,
		description: "This rule disallows modifications to read-only global variables.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Assignment to Native Objects",
	},
	{
		ruleId: "ESLINT_no-implicit-coercion",
		language: "javascript",
		badExample: `
			let a = !!beta;
			let a = ~beta.indexOf(".");`,
		goodExample: `
			let a = Boolean(beta);
			let a = beta.indexOf(".") !== -1;

			let n = ~beta;`,
		description: "This indicates shorter notations for the type conversion, then suggest a more self-explanatory notation.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Shorthand Type Conversions",
	},
	{
		ruleId: "ESLINT_no-implicit-globals",
		language: "javascript",
		badExample: `
		var alpha = 1;

		function beta() {}`,
		goodExample: `
		window.alpha = 1;

		window.beta = function () {};`,
		description: "This disallows var and function declarations at the top-level script scope. This does not apply to ES and CommonJS modules since they have a module scope.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Declarations in the Global Scope",
	},
	{
		ruleId: "ESLINT_no-implied-eval",
		language: "javascript",
		badExample: "setTimeout(\"alert('Hello');\", 50);",
		goodExample: `
		setTimeout(function() {
			alert("Hell");
		}, 50);`,
		description: "This eliminates implied eval() through the use of setTimeout(), setInterval() or execScript(). As such, it will warn when either function is used with a string as the first argument.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Implied eval",
	},
	{
		ruleId: "ESLINT_no-import-assign",
		language: "javascript",
		badExample: `
		import alpha, { beta } from "./delta.mjs"

		alpha = 1
		beta = 'b'`,
		goodExample: `
		import alpha, { beta } from "./delta.mjs"

		alpha.prop = 1
		beta.prop = 'b'`,
		description: "This warns the assignments, increments, and decrements of imported bindings.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Assigning to Imported Bindings",
	},
	{
		ruleId: "ESLINT_no-inline-comments",
		language: "javascript",
		badExample: "let x = 1; // declaring x",
		goodExample: `
		// Comment above
		let alpha = a;`,
		description: "Comments on the same line as code are not allowed.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Inline Comments after Code",
	},
	{
		ruleId: "ESLINT_no-inner-declarations",
		language: "javascript",
		badExample: `
		if (alpha) {
			function beta() { }
		}`,
		goodExample: "function beta() { }",
		description: "It is required that function declarations and, optionally, variable declarations be in the root of a program, or in the root of the body of a function, or in the root of the body of a class static block.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Variable or Function in Nested Blocks",
	},
	{
		ruleId: "ESLINT_no-invalid-regexp",
		language: "javascript",
		badExample: "RegExp('[')",
		goodExample: "RegExp('.')",
		description: "This rule disallows invalid regular expression strings in RegExp constructors.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Invalid Regular Expression Strings in RegExp",
	},
	{
		ruleId: "ESLINT_no-invalid-this",
		language: "javascript",
		badExample: `
		alpha(function() {
			this.x = 0;
			beta(() => this);
		});`,
		goodExample: `
		class Alpha {
			constructor() {
				this.x = 0;
				beta(() => this);
			}
		}`,
		description: "It flags usage of this keywords in contexts where the value of this is undefined.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Use of This in Contexts where is Undefined",
	},
	{
		ruleId: "ESLINT_no-irregular-whitespace",
		language: "javascript",
		badExample: `
		function thing() /*<NBSP>*/{
			return 'test';
		}`,
		goodExample: `
		function thing() {
			return ' <NBSP>thing';
		}`,
		description: "It is aimed at catching invalid whitespace that is not a normal tab and space. Some of these characters may cause issues in modern browsers and others will be a debugging issue to spot.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Irregular Whitespace",
	},
	{
		ruleId: "ESLINT_no-iterator",
		language: "javascript",
		badExample: "foo.__iterator__ = function () {};",
		goodExample: "let __iterator__ = foo;",
		description: "It is preventing errors that may arise from using the __iterator__ property, which is not implemented in several browsers. As such, it will warn whenever it encounters the __iterator__ property.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Iterator",
	},
	{
		ruleId: "ESLINT_no-label-var",
		language: "javascript",
		badExample: `
		let a = alpha;
		function beta() {
		a:
			for (;;) {
			break a;
			}
		}`,
		goodExample: `
		function alpha() {
			let x = y;
		}

		function beta() {
		x:
			for(;;) {
			break x;
			}
		}`,
		description: "This creates clearer code by disallowing the bad practice of creating a label that shares a name with a variable that is in scope.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Labels that are Variables Names",
	},
	{
		ruleId: "ESLINT_no-labels",
		language: "javascript",
		badExample: `
		label:
			while(true) {
				break label;
			}`,
		goodExample: `
		while (true) {
			break;
		}`,
		description: "It aims to eliminate the use of labeled statements in JavaScript. It will warn whenever a labeled statement is encountered and whenever break or continue are used with a label.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Labeled Statements",
	},
	{
		ruleId: "ESLINT_no-lone-blocks",
		language: "javascript",
		badExample: `
		if (alpha) {
			beta();
			{
				theta();
			}
		}`,
		goodExample: `
		if (alpha) {
			if (beta) {
				theta();
			}
		}`,
		description: "It eliminates unnecessary and potentially confusing blocks at the top level of a script or within other blocks.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Unnecessary Nested Blocks",
	},
	{
		ruleId: "ESLINT_no-lonely-if",
		language: "javascript",
		badExample: `
		if (condition) {
			// doSomething
		} else {
			if (anotherCond) {
				// doSomething
			}
		}`,
		goodExample: `
		if (condition) {
			// doSomething
		} else if (anotherCond) {
			// doSomething
		}`,
		description: "It is suggested to prevent if statements as the only statement in else blocks.",
		category: "Best Practices",
		severity: "",
		title: "Disallow If Statements as the Only Statement in Else",
	},
	{
		ruleId: "ESLINT_no-loop-func",
		language: "javascript",
		badExample: `
		for (let i=5; i; i--) {
			(function() { return i; })();
		}`,
		goodExample: `
		let b = function() {};

		for (let i=5; i; i--) {
			b();
		}`,
		description: "It is required to disallow any function within a loop that contains unsafe references (e.g. to modified variables from the outer scope).",
		category: "Best Practices",
		severity: "",
		title: "Disallow Functions in Loops",
	},
	{
		ruleId: "ESLINT_no-magic-numbers",
		language: "javascript",
		badExample: `
		let startP = 50,
			finalP = startP + (startP * 0.1);`,
		goodExample: `
		const T = 0.1;

		let startP = 50,
			finalP = startP + (startP * T);`,
		description: "The no-magic-numbers aims to make code more readable and refactoring easier by ensuring that special numbers are declared as constants to make their meaning explicit.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Magic Numbers",
	},
	{
		ruleId: "ESLINT_no-misleading-character-class",
		language: "javascript",
		badExample: "/^[Á]$/u",
		goodExample: "/^[abc]$/",
		description: "Τhe regular expressions are reported which include multiple code point characters in character class syntax.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Characters with Multiple Code Points",
	},
	{
		ruleId: "ESLINT_no-mixed-operators",
		language: "javascript",
		badExample: "let alpha = x && y < 0 || z > 0 || a + 1 === 0;",
		goodExample: "let alpha = (x && y < 0) || z > 0 || a + 1 === 0;",
		description: "This rule checks BinaryExpression, LogicalExpression and ConditionalExpression.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Mixes of Different Operators",
	},
	{
		ruleId: "ESLINT_no-mixed-requires",
		language: "javascript",
		badExample: `
		let alpha = {
			set a(value) {
				this.val = value;
				return value;
			}
		};`,
		goodExample: `
		let alpha = {
			set a(value) {
				this.val = value;
			}
		};`,
		description: "This prevents require calls to be mixed with regular variable declarations.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Require Calls with Regular Variable Declarations",
	},
	{
		ruleId: "ESLINT_no-mixed-spaces-and-tabs",
		language: "javascript",
		badExample: `
		function add(a, b) {
		// --->..return a + b;

				return a + b;
		}`,
		goodExample: `
		function add(a, b) {
		// --->return a + b;
			return a + b;
		}`,
		description: "This disallows mixed spaces and tabs for indentation.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Mixed Spaces and Tabs",
	},
	{
		ruleId: "ESLINT_no-multi-assign",
		language: "javascript",
		badExample: "let x = y = z = 1;",
		goodExample: `
		let x = 1;
		let y = 1;
		let z = 1;`,
		description: "It disallows using multiple assignments within a single statement.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Use of Chained Assignment Expressions",
	},
	{
		ruleId: "ESLINT_no-multi-spaces",
		language: "javascript",
		badExample: "if(alpha	 === \"beta\") {}",
		goodExample: "if(alpha === \"beta\") {}",
		description: "This aims to disallow multiple whitespace around logical expressions, conditional expressions, declarations, array elements, object properties, sequences and function parameters.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Multiple Spaces",
	},
	{
		ruleId: "ESLINT_no-multi-str",
		language: "javascript",
		badExample: `
let a = "text and \
other text";`,
		goodExample: "let a = \"text and other text\";",
		description: "This rule is aimed at preventing the use of multiline strings.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Multiline Strings",
	},
	{
		ruleId: "ESLINT_no-multiple-empty-lines",
		language: "javascript",
		badExample: `
		let alpha = 1;



		let beta = 2;`,
		goodExample: `
		let alpha = 1;
		let beta = 2;`,
		description: "This aims to reduce the scrolling required when reading through your code. It will warn when the maximum amount of empty lines has been exceeded.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Multiple Empty Lines",
	},
	{
		ruleId: "ESLINT_no-native-reassign",
		language: "javascript",
		badExample: `
		Object = null
		undefined = 1`,
		goodExample: `
		x = 1
		let y = 1
		y = 2`,
		description: "It disallows modifications to read-only global variables.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Reassignment of Native Objects",
	},
	{
		ruleId: "ESLINT_no-negated-condition",
		language: "javascript",
		badExample: `
		if (!b) {
			doSome();
		} else {
			doElse();
		}`,
		goodExample: `
		if (!b) {
			doSome();
		}`,
		description: "This rule disallows negated conditions.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Negated Conditions",
	},
	{
		ruleId: "ESLINT_no-negated-in-lhs",
		language: "javascript",
		badExample: `
		if(!key in object) {
			// doSomething
		}`,
		goodExample: `
		if(!(key in object)) {
			// doSomething
		}`,
		description: "It disallows negating the left operand in in expressions.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Negating the Left Operand in In",
	},
	{
		ruleId: "ESLINT_no-nested-ternary",
		language: "javascript",
		badExample: "let alpha = beta ? theta : zeta === xyz ? xyzz : betatheta;",
		goodExample: "let alpha = beta ? theta : betatheta;",
		description: "The no-nested-ternary rule disallows nested ternary expressions.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Nested Ternary Expressions",
	},
	{
		ruleId: "ESLINT_no-new-func",
		language: "javascript",
		badExample: "let a = new Function(\"x\", \"y\", \"return x + y\");",
		goodExample: `
		let a = function (x, y) {
			return x + y;
		};`,
		description: "This error is raised to highlight the use of a bad practice. By passing a string to the Function constructor, you are requiring the engine to parse that string much in the way it has to when you call the eval function.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Function Constructor",
	},
	{
		ruleId: "ESLINT_no-new-object",
		language: "javascript",
		badExample: "let newObject = new Object();",
		goodExample: "let newObject = new aNewerObject();",
		description: "This rule disallows Object constructors.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Object Constructors",
	},
	{
		ruleId: "ESLINT_no-new-require",
		language: "javascript",
		badExample: "let appHeader = new require('app-header');",
		goodExample: `
		let AppHeader = require('app-header');
		let appHeader = new AppHeader();`,
		description: "This aims to eliminate use of the new require expression.",
		category: "Best Practices",
		severity: "",
		title: "Disallow New Operators with Require",
	},
	{
		ruleId: "ESLINT_no-new-symbol",
		language: "javascript",
		badExample: "let boo = new Symbol('boo');",
		goodExample: `
		let boo = Symbol('boo');
		function bob(Symbol) {
			const beb = new Symbol("beb");
		}`,
		description: "It is suggested to prevent the accidental calling of Symbol with the new operator.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Symbol Constructor",
	},
	{
		ruleId: "ESLINT_no-new-wrappers",
		language: "javascript",
		badExample: "let stringObject = new String(\"Alert\");",
		goodExample: "let text = String(testValue);",
		description: "This is required to eliminate the use of String, Number, and Boolean with the new operator. As such, it warns whenever it sees new String, new Number, or new Boolean.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Primitive Wrapper Instances",
	},
	{
		ruleId: "ESLINT_no-new",
		language: "javascript",
		badExample: "new Alpha();",
		goodExample: "let alpha = new Alpha();",
		description: "This is aimed at maintaining consistency and convention by disallowing constructor calls using the new keyword that do not assign the resulting object to a variable.",
		category: "Best Practices",
		severity: "",
		title: "Disallow new For Side Effects",
	},
	{
		ruleId: "ESLINT_no-obj-calls",
		language: "javascript",
		badExample: "let newAlpha = new Alpha();",
		goodExample: "let test = Alpha.load(beta, 0);",
		description: "It is suggested not to call the Math, JSON, Reflect and Atomics objects as functions. This rule also disallows using these objects as constructors with the new operator.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Calling Global Object Properties as Functions",
	},
	{
		ruleId: "ESLINT_no-octal-escape",
		language: "javascript",
		badExample: String.raw`let alpha = "Copyright \251";`,
		goodExample: String.raw`let foo = "Copyright \u00A9";`,
		description: "It is required to disallow octal escape sequences in string literals.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Octal Escape Sequences",
	},
	{
		ruleId: "ESLINT_no-octal",
		language: "javascript",
		badExample: "let num = 071;",
		goodExample: "let num	= \"071\";",
		description: "The rule disallows octal literals.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Octal Literals",
	},
	{
		ruleId: "ESLINT_no-param-reassign",
		language: "javascript",
		badExample: `
		function alpha(beta) {
			for (beta in theta) {}
		}`,
		goodExample: `
		function alpha(beta) {
			let theta = beta;
		}`,
		description: "This is aimed to prevent unintended behavior caused by modification or reassignment of function parameters.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Reassignment of Function Parameters",
	},
	{
		ruleId: "ESLINT_no-path-concat",
		language: "javascript",
		badExample: "let newPath = __dirname + \"/alpha.js\";",
		goodExample: "let newPath = dirname + \"/alpha.js\";",
		description: "This is suggested to prevent string concatenation of directory paths in Node.js",
		category: "Best Practices",
		severity: "",
		title: "Disallow String Concatenation",
	},
	{
		ruleId: "ESLINT_no-plusplus",
		language: "javascript",
		badExample: `
		let alpha = 0;
		alpha++;`,
		goodExample: `
		let alpha = 0;
		alpha += 1;`,
		description: "It is prevented to use the unary operators ++ and --.",
		category: "Best Practices",
		severity: "",
		title: "Disallow the Unary Operators",
	},
	{
		ruleId: "ESLINT_no-process-env",
		language: "javascript",
		badExample: `
		if(process.env.NODE_ENV === "development") {
			//doSomething
		}`,
		goodExample: `
		let config = require("./config");

		if(config.env === "development") {
			//doSomething
		}`,
		description: "It is suggested to aim at discouraging use of process.env to avoid global dependencies. As such, it will warn whenever process.env is used.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Process.env",
	},
	{
		ruleId: "ESLINT_no-process-exit",
		language: "javascript",
		badExample: `
		process.exit(1);
		process.exit(0);`,
		goodExample: `
		Process.exit();
		let exit = process.exit;`,
		description: "It prevents the use of process.exit() in Node.js JavaScript. As such, it warns whenever process.exit() is found in code.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Process.exit",
	},
	{
		ruleId: "ESLINT_no-proto",
		language: "javascript",
		badExample: "let x = obj.__proto__;",
		goodExample: "let x = Object.getPrototypeOf(obj);",
		description: "When an object is created with the new operator, __proto__ is set to the original prototype property of the object's constructor function. Object.getPrototypeOf is the preferred method of getting the object's prototype.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Use of __proto__",
	},
	{
		ruleId: "ESLINT_no-prototype-builtins",
		language: "javascript",
		badExample: "let hasBeta = alpha.hasOwnProperty(\"beta\");",
		goodExample: "let hasBeta = Object.prototype.hasOwnProperty.call(alpha, \"beta\");",
		description: "The call of some Object.prototype methods directly is prevented on object instances.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Use of Object.prototypes Builtins",
	},
	{
		ruleId: "ESLINT_no-redeclare",
		language: "javascript",
		badExample: `
		let x = 1;
		let x = 5;

		class A {
			alpha() {
				let y = 1;
				let y = 5;
			}

			static {
				let z = 1;
				let z = 5;
			}
		}`,
		goodExample: `
		let x = 1;
		x = 5;

		class A {
			alpha() {
				let y = 1;
				y = 5;
			}

			static {
				let z = 1;
				z = 5;
			}
		}`,
		description: "This rule is aimed at eliminating variables that have multiple declarations in the same scope.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Variable Redeclaration",
	},
	{
		ruleId: "ESLINT_no-regex-spaces",
		language: "javascript",
		badExample: `
		let reg = /alpha	 beta/;
		let reg = new RegExp("alpha	 beta");`,
		goodExample: `
		let reg = /alpha {3}beta/;
		let reg = new RegExp("alpha {3}beta");`,
		description: "It is suggested not to use multiple spaces in regular expression literals.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Multiple Spaces in Regular Expression",
	},
	{
		ruleId: "ESLINT_no-restricted-globals",
		language: "javascript",
		badExample: `
		function onClick() {
			console.log(event);
		}`,
		goodExample: "import event from \"event-module\";",
		description: "This allows you to specify global variable names that you don't want to use in your application.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Specific Global Variables",
	},
	{
		ruleId: "ESLINT_no-restricted-imports",
		language: "javascript",
		badExample: "import fs from 'fs';",
		goodExample: `
		import crypto from 'crypto';
		export { alpha } from "beta";`,
		description: "It is allowed to specify imports that you don't want to use in your application.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Specific Imports",
	},
	{
		ruleId: "ESLINT_no-restricted-modules",
		language: "javascript",
		badExample: `
		let fs = require('fs');
		let cluster = require('cluster');`,
		goodExample: "let crypto = require('crypto');",
		description: "It is permitted to specify modules that you don't want to use in your application.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Node.js Modules",
	},
	{
		ruleId: "ESLINT_no-restricted-properties",
		language: "javascript",
		badExample: "let test = disallowedObjectName.disallowedPropertyName;",
		goodExample: "let test = disallowedObjectName.somePropertyName;",
		description: "This rule looks for accessing a given property key on a given object name, either when reading the property's value or invoking it as a function.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Certain Object Properties",
	},
	{
		ruleId: "ESLINT_no-restricted-syntax",
		language: "javascript",
		badExample: `
		let doThis = function () {};

		alpha in beta;`,
		goodExample: `
		function doThis() {};

		alpha instanceof beta;`,
		description: "This rule disallows specified (that is, user-defined) syntax.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Specified Syntax",
	},
	{
		ruleId: "ESLINT_no-return-assign",
		language: "javascript",
		badExample: `
		function doThing() {
			return alpha += 2;
		}`,
		goodExample: `
		function doThing() {
			return (alpha = beta + 2);
		}`,
		description: "This aims to eliminate assignments from return statements. As such, it will warn whenever an assignment is found as part of return.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Assignment in return Statement",
	},
	{
		ruleId: "ESLINT_no-return-await",
		language: "javascript",
		badExample: `
		async function alpha() {
			return await beta();
		}`,
		goodExample: `
		async function alpha() {
			return beta();
		}`,
		description: "Unnecessary return await should not be allowed.",
		category: "Best Practices",
		severity: "",
		title: "Disallows Unnecessary return await",
	},
	{
		ruleId: "ESLINT_no-script-url",
		language: "javascript",
		badExample: "location.href = \"javascript:void(0)\";",
		goodExample: "",
		description: "Script URLs should not be allowed",
		category: "Best Practices",
		severity: "",
		title: "Disallow Script URLs",
	},
	{
		ruleId: "ESLINT_no-self-assign",
		language: "javascript",
		badExample: "alpha = alpha;",
		goodExample: "alpha = beta;",
		description: "Self assignments have no effect, so probably those are an error due to incomplete refactoring.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Self Assignment",
	},
	{
		ruleId: "ESLINT_no-self-compare",
		language: "javascript",
		badExample: `
		let alpha = 10;
		if (alpha === alpha) {
			x = 20;
		}`,
		goodExample: "",
		description: "Comparisons where both sides are exactly the same is not allowed.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Self Compare",
	},
	{
		ruleId: "ESLINT_no-sequences",
		language: "javascript",
		badExample: "alpha = do(), val;",
		goodExample: "alpha = (do(), val);",
		description: "The use of the comma operator. is not allowed.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Use of the Comma Operator",
	},
	{
		ruleId: "ESLINT_no-setter-return",
		language: "javascript",
		badExample: `
		let alpha = {
			set a(value) {
				this.val = value;
				return value;
			}
		};`,
		goodExample: `
		let alpha = {
			set a(value) {
				this.val = value;
			}
		};`,
		description: "Returning values from setters and reports return statements in setter functions is not allowed.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Returning Values from Setters",
	},
	{
		ruleId: "ESLINT_no-shadow-restricted-names",
		language: "javascript",
		badExample: "function NaN(a, b){}",
		goodExample: "function f(a, b){}",
		description: "Identifiers from shadowing restricted names are not allowed",
		category: "Best Practices",
		severity: "",
		title: "Disallow Shadowing of Restricted Names",
	},
	{
		ruleId: "ESLINT_no-shadow",
		language: "javascript",
		badExample: `
		let alpha = 3;
		function beta() {
			let alpha = 10;
		}`,
		goodExample: "",
		description: "This rule aims to eliminate shadowed variable declarations.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Variable Declarations from Shadowing Variables",
	},
	{
		ruleId: "ESLINT_no-spaced-func",
		language: "javascript",
		badExample: "fn ()",
		goodExample: "fn()",
		description: "This rule disallows spacing between function identifiers and their applications.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Spacing Between Function Identifiers",
	},
	{
		ruleId: "ESLINT_no-sparse-arrays",
		language: "javascript",
		badExample: "let items = [,];",
		goodExample: "let items = [];",
		description: "This rule disallows sparse array literals which have gaps where commas are not preceded by elements.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Sparse Arrays",
	},
	{
		ruleId: "ESLINT_no-sync",
		language: "javascript",
		badExample: `
		fs.existsSync(myPath);

		function alpha() {
			let result = fs.readFileSync(myPath).toString();
		}`,
		goodExample: `
		obj.sync();

		async(function() {
			// ...
		});`,
		description: "The synchronous methods are not allowed.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Synchronous Methods",
	},
	{
		ruleId: "ESLINT_no-tabs",
		language: "javascript",
		badExample: "let a \t= 2;",
		goodExample: "let a = 2;",
		description: "Some style guides don't allow the use of tab characters at all, including within comments.",
		category: "Best Practices",
		severity: "",
		title: "Disallow All Tabs",
	},
	{
		ruleId: "ESLINT_no-template-curly-in-string",
		language: "javascript",
		// eslint-disable-next-line no-template-curly-in-string
		badExample: "\"Hello ${name}!\";",
		// eslint-disable-next-line no-template-curly-in-string
		goodExample: "`Hello ${name}!`;",
		description: "The template literal placeholder syntax in regular strings is disallowed.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Template Literal Placeholder Syntax",
	},
	{
		ruleId: "ESLINT_no-ternary",
		language: "javascript",
		badExample: "let alpha = boolean ? b : c;",
		goodExample: `
		let alpha;
		if (boolean) {
			alpha = b;
		} else {
			alpha = c;
		}`,
		description: "The ternary operator is used to conditionally assign a value to a variable. Some believe that the use of ternary operators leads to unclear code.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Ternary Operators",
	},
	{
		ruleId: "ESLINT_no-this-before-super",
		language: "javascript",
		badExample: `
		class A extends B {
			constructor() {
				this.a = 0;
				super();
			}
		}`,
		goodExample: `
		class A {
			constructor() {
				this.a = 0;
			}
		}`,
		description: "The use of this/super before calling super() in constructors is disallowed.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Use of this/super Before Calling super",
	},
	{
		ruleId: "ESLINT_no-throw-literal",
		language: "javascript",
		badExample: "throw \"error\";",
		goodExample: "throw new Error();",
		description: "There should be consistency when throwing exception by disallowing to throw literals and other expressions which cannot possibly be an Error object.",
		category: "Best Practices",
		severity: "",
		title: "Restrict what can be Thrown as an Exception",
	},
	{
		ruleId: "ESLINT_no-trailing-spaces",
		language: "javascript",
		badExample: "let alpha = 0;//•••••",
		goodExample: "let alpha = 0;",
		description: "Trailing whitespace (spaces, tabs, and other Unicode whitespace characters) at the end of lines is not allowed.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Trailing Whitespace at the End of Lines",
	},
	{
		ruleId: "ESLINT_no-undef-init",
		language: "javascript",
		badExample: "let alpha = undefined;",
		goodExample: "let alpha;",
		description: "Initializing variables to undefined is prohibited.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Initializing to Undefined",
	},
	{
		ruleId: "ESLINT_no-undef",
		language: "javascript",
		badExample: `
		let boo = yourFunction();
		let tab = a + 1;`,
		goodExample: `
		globally declared a
		let foo = someFunction();
		let bar = a + 1;`,
		description: "the use of undeclared variables unless mentioned in global comments is disallowed.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Undeclared Variables",
	},
	{
		ruleId: "ESLINT_no-undefined",
		language: "javascript",
		badExample: "let undefined = 15;",
		goodExample: "let Undefined = 15;",
		description: "The use of undefined should be eliminated, and as such, generates a warning whenever it is used.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Use of undefined Variable",
	},
	{
		ruleId: "ESLINT_no-underscore-dangle",
		language: "javascript",
		badExample: "let alpha;",
		goodExample: "let alpha = __beta;",
		description: "As far as naming conventions for identifiers go, dangling underscores may be the most polarizing in JavaScript. Dangling underscores are underscores at either the beginning or end of an identifier, such as:",
		category: "Best Practices",
		severity: "",
		title: "Disallow Dangling Underscores in Identifiers",
	},
	{
		ruleId: "ESLINT_no-unexpected-multiline",
		language: "javascript",
		badExample: `
		let alpha = beta
		(1 || 2).beta();`,
		goodExample: `
		let alpha = beta;
		(1 || 2).beta();`,
		description: "Confusing multiline expressions should be disallowed.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Confusing Multiline Expressions",
	},
	{
		ruleId: "ESLINT_no-unmodified-loop-condition",
		language: "javascript",
		badExample: "let alpha = something;",
		goodExample: `
		while (alpha) {
			do(alpha);
			alpha = alpha.width;
		}`,
		description: "This rule finds references which are inside of loop conditions, then checks the variables of those references are modified in the loop.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Unmodified Conditions of Loops",
	},
	{
		ruleId: "ESLINT_no-unneeded-ternary",
		language: "javascript",
		badExample: "ar a = x === 2 ? true : false;",
		goodExample: "let a = x === 2 ? 'c' : 'd';",
		description: "Ternary operators when simpler alternatives exist are disallowed",
		category: "Best Practices",
		severity: "",
		title: "Disallow Ternary Operators",
	},
	{
		ruleId: "ESLINT_no-unreachable",
		language: "javascript",
		badExample: `
		function alpha() {
			return true;
			console.log("ok");
		}`,
		goodExample: `
		function alpha() {
			console.log("ok");

			return true;
		}`,
		description: "Unreachable code after return, throw, continue, and break statements is disallowed.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Unreachable Code after Statements",
	},
	{
		ruleId: "ESLINT_no-unsafe-finally",
		language: "javascript",
		badExample: `
		let alpha = function() {
			try {
				return 1;
			} catch(err) {
				return 2;
			} finally {
				return 3;
			}
		};`,
		goodExample: `
		let alpha = function() {
			try {
				return 1;
			} catch(err) {
				return 2;
			} finally {
				console.log("hi!");
			}
		};`,
		description: "Control flow statements in finally blocks is disallowed.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Control Flow Statements in finally Blocks",
	},
	{
		ruleId: "ESLINT_no-unsafe-negation",
		language: "javascript",
		badExample: `
		if (!key in object) {
		}`,
		goodExample: `
		if (!(key in object)) {
		}`,
		description: "Negating the left operand of the following relational operators should be disallowed.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Negating the Left Operand of Relational Operators",
	},
	{
		ruleId: "ESLINT_no-unused-expressions",
		language: "javascript",
		badExample: "if(0) 0;",
		goodExample: "if(true) execute();",
		description: "An unused expression which has no effect on the state of the program indicates a logic error.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Unused Expressions",
	},
	{
		ruleId: "ESLINT_no-unused-labels",
		language: "javascript",
		badExample: "A: let alpha = 0;",
		goodExample: `
		A: {
			if (alpha()) {
				break A;
			}
			bar();
		}`,
		description: "Labels that are declared and not used anywhere in the code are most likely an error due to incomplete refactoring.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Unused Labels",
	},
	{
		ruleId: "ESLINT_no-unused-vars",
		language: "javascript",
		badExample: `
		let alpha;
		const beta = 10;

		console.log(beta);`,
		goodExample: `
		const alpha = 5;
		const beta = 10;
		console.log(alpha, beta);`,
		description: "Variables that are declared and not used anywhere in the code are most likely an error due to incomplete refactoring.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Unused Variables",
	},
	{
		ruleId: "ESLINT_no-use-before-define",
		language: "javascript",
		badExample: `
		console.log(a);
		const a = 10;`,
		goodExample: `
		const a = 10;
		console.log(a);`,
		description: "Variables should be used after their declaration.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Early Use",
	},
	{
		ruleId: "ESLINT_no-useless-call",
		language: "javascript",
		badExample: "alpha.call(undefined, 1, 2, 3);",
		goodExample: "alpha.call(obj, 1, 2, 3);",
		description: "This rule is aimed to flag usage of Function.prototype.call() and Function.prototype.apply() that can be replaced with the normal function invocation.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Unnecessary .call",
	},
	{
		ruleId: "ESLINT_no-useless-catch",
		language: "javascript",
		badExample: `
		try {
			doThatMightThrow();
		} catch (e) {
			throw e;
		}
		 `,
		goodExample: `
		try {
			doThatMightThrow();
		} catch (e) {
			doBeforeRethrow();
			throw e;
		}`,
		description: "This rule reports catch clauses that only throw the caught error.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Unnecessary Catch Clauses",
	},
	{
		ruleId: "ESLINT_no-useless-computed-key",
		language: "javascript",
		badExample: "let alpha = { ['0']: 0 };",
		goodExample: "let beta = { 'a': 0 };",
		description: "Unnecessary usage of Computed Property Keys should be disallowed in objects and classes.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Unnecessary Computed Property Keys",
	},
	{
		ruleId: "ESLINT_no-useless-concat",
		language: "javascript",
		badExample: "let a = '1' + '0';",
		goodExample: "let a = \"10\";",
		description: "This rule aims to flag the concatenation of 2 literals when they could be combined into a single literal.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Unnecessary Concatenation of Strings",
	},
	{
		ruleId: "ESLINT_no-useless-constructor",
		language: "javascript",
		badExample: `
		class A {
			constructor () {
			}
		}`,
		goodExample: "class A { }",
		description: "This rule flags class constructors that can be safely removed without changing how the class works.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Unnecessary Constructor",
	},
	{
		ruleId: "ESLINT_no-useless-escape",
		language: "javascript",
		// eslint-disable-next-line no-useless-escape
		badExample: "/[a-z\-]/;",
		goodExample: "/[a-z-]/;",
		description: "Escapes that can be safely removed without changing behavior are flagged.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Unnecessary Escape Usage",
	},
	{
		ruleId: "ESLINT_no-useless-rename",
		language: "javascript",
		badExample: "import { alpha as alpha } from \"beta\";",
		goodExample: "import * as aplha from \beta\";",
		description: "Renaming of import, export, and destructured assignments to the same name is disallowed",
		category: "Best Practices",
		severity: "",
		title: "Disallow Renaming to Same Name",
	},
	{
		ruleId: "ESLINT_no-useless-return",
		language: "javascript",
		badExample: "function alpha() { return; }",
		goodExample: "function alpha() { return 5; }",
		description: "A return statement with nothing after it is redundant, and has no effect on the runtime behavior of a function.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Redundant return Statements",
	},
	{
		ruleId: "ESLINT_no-var",
		language: "javascript",
		badExample: "let alpha = 'a';",
		goodExample: "let alpha = 'a';",
		description: "let or const should be used instead of var.",
		category: "Best Practices",
		severity: "",
		title: "Require let or const Instead of var",
	},
	{
		ruleId: "ESLINT_no-void",
		language: "javascript",
		badExample: "let alpha = void beta();",
		goodExample: "void beta;",
		description: "Void operator should be avoided",
		category: "Best Practices",
		severity: "",
		title: "Disallow use of the void operator.",
	},
	{
		ruleId: "ESLINT_no-warning-comments",
		language: "javascript",
		badExample: "// TODO",
		goodExample: "// NOT READY FOR PRIME TIME",
		description: "Comments that include any of the predefined terms specified in its configuration are reported.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Warning Comments",
	},
	{
		ruleId: "ESLINT_no-whitespace-before-property",
		language: "javascript",
		badExample: "alpha [beta]",
		goodExample: "alpha.beta",
		description: "Whitespaces must be disallowed before properties",
		category: "Best Practices",
		severity: "",
		title: "Disallow Whitespace Before Properties",
	},
	{
		ruleId: "ESLINT_no-with",
		language: "javascript",
		badExample: `
		with (alpha) {
			result = Math.sqrt(a * b + b * a);
		}`,
		goodExample: "const result = ({x, y}) => Math.sqrt(x * x + y * y);",
		description: "The with statement is potentially problematic, so it is better to disallow its use",
		category: "Best Practices",
		severity: "",
		title: "Disallow with Statements",
	},
	{
		ruleId: "ESLINT_nonblock-statement-body-position",
		language: "javascript",
		badExample: `
		if (alpha)
		beta();`,
		goodExample: "if (alpha) beta();",
		description: "There should be used a a consistent location for single-line statements.",
		category: "Best Practices",
		severity: "",
		title: "Enforce the Location of single-line Statements",
	},
	{
		ruleId: "ESLINT_object-curly-newline",
		language: "javascript",
		badExample: "let alpha = {beta: 1};",
		goodExample: `
		let alpha = {
			beta: 1
		};`,
		description: "A number of style guides require line breaks inside of object braces and other tokens.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Consistent Line Breaks Inside Braces",
	},
	{
		ruleId: "ESLINT_object-curly-spacing",
		language: "javascript",
		badExample: "let dummy = { 'alpha': 'beta' };",
		goodExample: "let dummy = {'alpha': 'beta'};",
		description: "There should be used consistent spacing inside braces.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Consistent Spacing Inside Braces",
	},
	{
		ruleId: "ESLINT_object-property-newline",
		language: "javascript",
		badExample: "const dummy = { alpha: \"a\", beta: \"b\" };",
		goodExample: `
		const dummy = {
			alpha: "a",
			beta: "b",
		};`,
		description: "The object properties must be placed on separate lines.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Placing Object Properties on Separate Lines",
	},
	{
		ruleId: "ESLINT_object-shorthand",
		language: "javascript",
		badExample: `
		let alpha = {
			"beta"() {}
		};`,
		goodExample: `
		let alpha = {
			"beta": function() {},
			"gamma": c
		};`,
		description: "This rule requires method and property shorthand syntax for object literals.",
		category: "Best Practices",
		severity: "",
		title: "Require Object Literal Shorthand Syntax",
	},
	{
		ruleId: "ESLINT_one-var-declaration-per-line",
		language: "javascript",
		badExample: "let alpha, beta, c = 0;",
		goodExample: "let alpha, beta;",
		description: "It is required to add newlines around variable declarations",
		category: "Best Practices",
		severity: "",
		title: "Require Newlines Around Variable Declarations",
	},
	{
		ruleId: "ESLINT_one-var",
		language: "javascript",
		badExample: `
		function dummy() {
			let alpha;
			let beta;
			let gamma;
			let delta;
		}`,
		goodExample: `
		function dummy() {
			let alpha,
				beta;
			let gamma,
				delta;
		}`,
		description: "Variables should be declared either together or separately per function ( for var) or block (for let and const) scope.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Declaration of Variables in Functions",
	},
	{
		ruleId: "ESLINT_operator-assignment",
		language: "javascript",
		badExample: "alpha = alpha + beta;",
		goodExample: "alpha += beta;",
		description: "It is required to assign operator shorthand where possible.",
		category: "Best Practices",
		severity: "",
		title: "Require Assignment Operator Shorthand",
	},
	{
		ruleId: "ESLINT_operator-linebreak",
		language: "javascript",
		badExample: `
		alpha = 1
		+
		2;`,
		goodExample: "alpha = 1 + 2;",
		description: "There should be a consistent linebreak style for operators.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Consistent Linebreak Style for Operators",
	},
	{
		ruleId: "ESLINT_padded-blocks",
		language: "javascript",
		badExample: `
		if (alpha) {
			beta();
		}`,
		goodExample: `
		if (alpha) {

			beta();

		}`,
		description: "Consistent empty line padding within blocks is enforced.",
		category: "Best Practices",
		severity: "",
		title: "Require Padding Within Blocks",
	},
	{
		ruleId: "ESLINT_padding-line-between-statements",
		language: "javascript",
		badExample: `
		function alpha() {
			beta();
			return;
		}`,
		goodExample: `
		function alpha() {
			beta();

			return;
		}`,
		description: "It is required to pad lines between statements.",
		category: "Best Practices",
		severity: "",
		title: "Require Padding Lines Between Statements",
	},
	{
		ruleId: "ESLINT_prefer-arrow-callback",
		language: "javascript",
		badExample: "foo(function(alpha) { return alpha; });",
		goodExample: "foo(alpha => alpha);",
		description: "It is required to use aarow functions for callbacks.",
		category: "Best Practices",
		severity: "",
		title: "Require Using Arrow Functions for Callbacks",
	},
	{
		ruleId: "ESLINT_prefer-const",
		language: "javascript",
		badExample: `
		let alpha = 3;
		console.log(alpha);`,
		goodExample: "const alpha = 0;",
		description: "If a variable is never reassigned, using the const declaration is better.",
		category: "Best Practices",
		severity: "",
		title: "Suggest Using const",
	},
	{
		ruleId: "ESLINT_prefer-destructuring",
		language: "javascript",
		badExample: "let alpha = array[0];",
		goodExample: "let [ alpha ] = array;",
		description: "It is required to destructure from arrays and/or objects.",
		category: "Best Practices",
		severity: "",
		title: "Prefer Destructuring from Arrays and Objects",
	},
	{
		ruleId: "ESLINT_prefer-exponentiation-operator",
		language: "javascript",
		badExample: "const alpha = Math.pow(2, 8);",
		goodExample: "const alpha = 2 ** 8;",
		description: "It is suggested to avoid Math.pow and use the ** operator instead.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Use of Math.pow in Favor of **",
	},
	{
		ruleId: "ESLINT_prefer-named-capture-group",
		language: "javascript",
		badExample: "const alpha = /(ca[rt])/;",
		goodExample: "const alpha = /(?<id>ca[rt])/;",
		description: "It is suggested to use named capture group in regular expression.",
		category: "Best Practices",
		severity: "",
		title: "Use Named Capture Group",
	},
	{
		ruleId: "ESLINT_prefer-numeric-literals",
		language: "javascript",
		badExample: "parseInt(\"111110111\", 2) === 503;",
		goodExample: "0b111110111 === 503;",
		description: "This rule disallows parseInt() if it is called with two arguments: a string and a radix option of binary, octal, or hexadecimal.",
		category: "Best Practices",
		severity: "",
		title: "Disallow parseInt",
	},
	{
		ruleId: "ESLINT_prefer-object-spread",
		language: "javascript",
		badExample: "Object.assign({}, alpha)",
		goodExample: "Object.assign(...alpha);",
		description: "It is prefered to use an object spread over Object.assign.",
		category: "Best Practices",
		severity: "",
		title: "Prefer Use Object Spread over Object.assign",
	},
	{
		ruleId: "ESLINT_prefer-promise-reject-errors",
		language: "javascript",
		badExample: "Promise.reject(\"something bad happened\");",
		goodExample: "Promise.reject(new Error(\"something bad happened\"));",
		description: "It is considered good practice to only pass instances of the built-in Error object to the reject() function for user-defined errors in Promises.",
		category: "Best Practices",
		severity: "",
		title: "Require Using Error as Promise Rejection Reasons",
	},
	{
		ruleId: "ESLINT_prefer-reflect",
		language: "javascript",
		badExample: "alpha.apply(undefined, args);",
		goodExample: "Reflect.apply(alpha, undefined, args);",
		description: "Using Reflect methods where applicable is prefered.",
		category: "Best Practices",
		severity: "",
		title: "Suggest Using Reflect Methods",
	},
	{
		ruleId: "ESLINT_prefer-regex-literals",
		language: "javascript",
		badExample: "new RegExp(\"abc\");",
		goodExample: "/abc/;",
		description: "The use of the RegExp constructor function with string literals as its arguments should be disallowed.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Use of the `RegExp` Constructor",
	},
	{
		ruleId: "ESLINT_prefer-rest-params",
		language: "javascript",
		badExample: `
		function alpha() {
			console.log(unknown);
		}`,
		goodExample: `
		function alpha(...args) {
			console.log(args);
		}`,
		description: "The usage of arguments variables is flagged.",
		category: "Best Practices",
		severity: "",
		title: "Suggest Using the Rest Parameters",
	},
	{
		ruleId: "ESLINT_prefer-spread",
		language: "javascript",
		badExample: "alpha.apply(undefined, args);",
		goodExample: "alpha(...args);",
		description: "Using spread syntax instead of .apply() is suggested.",
		category: "Best Practices",
		severity: "",
		title: "Suggest Using Spread Syntax",
	},
	{
		ruleId: "ESLINT_prefer-template",
		language: "javascript",
		badExample: "let str = \"Hello, \" + name + \"!\";",
		// eslint-disable-next-line no-template-curly-in-string
		goodExample: "let str = \"Hello, ${name}!\"",
		description: "Flag usage of + operators with strings should be avoided.",
		category: "Best Practices",
		severity: "",
		title: "Suggest Using Template Literals",
	},
	{
		ruleId: "ESLINT_quote-props",
		language: "javascript",
		badExample: `
		let object = {
			alpha: "dummy",
			beta: 42
		};`,
		goodExample: `
		let object = {
			"alpha": "dummy",
			"beta": 42
		};`,
		description: "Quotes around object literal property names are required.",
		category: "Best Practices",
		severity: "",
		title: "Require Quotes Around Object Keys",
	},
	{
		ruleId: "ESLINT_quotes",
		language: "javascript",
		badExample: "let single = 'single';",
		goodExample: "let double = \"double\";",
		description: "There should be kept a consistent use of either backticks, double, or single quotes.",
		category: "Best Practices",
		severity: "",
		title: "Enforce the Consistent Use of quotes",
	},
	{
		ruleId: "ESLINT_radix",
		language: "javascript",
		badExample: "let num = parseInt(\"071\");",
		goodExample: "let num = parseInt(\"071\", 10);",
		description: "The unintended conversion of a string to a number of a different base than intended or at preventing the redundant 10 radix if targeting modern environments only is prevented.",
		category: "Best Practices",
		severity: "",
		title: "Require Radix Parameter",
	},
	{
		ruleId: "ESLINT_require-atomic-updates",
		language: "javascript",
		badExample: `
		let alpha;

		async function beta() {
			result += await dummy;
		}`,
		goodExample: `
		let alpha;

		async function beta() {
			alpha = await dummy + alpha;
		}`,
		description: "This rule aims to report assignments to variables or properties in cases where the assignments may be based on outdated values.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Assignments Leading to Race Conditions",
	},
	{
		ruleId: "ESLINT_require-await",
		language: "javascript",
		badExample: `
		async function alpha() {
			do();
		}`,
		goodExample: `
		async function alpha() {
			await do();
		}`,
		description: "async functions which have no await expression create a warning.",
		category: "Best Practices",
		severity: "",
		title: "Disallow async Functions with no await",
	},
	{
		ruleId: "ESLINT_require-jsdoc",
		language: "javascript",
		badExample: `
		function foo() {
			return 10;
		}`,
		goodExample: `
		/**
		* It returns 10
		*/
		function alpha() {
			return 10;
		}`,
		description: "JSDoc comments for specified nodes are required.",
		category: "Best Practices",
		severity: "",
		title: "Require JSDoc Comments",
	},
	{
		ruleId: "ESLINT_require-unicode-regexp",
		language: "javascript",
		badExample: "const a = /aaa/",
		goodExample: "const a = /aaa/u",
		description: "This rule aims to enforce the use of u flag on regular expressions.",
		category: "Best Practices",
		severity: "",
		title: "Enforce the use of `u` flag on RegExp",
	},
	{
		ruleId: "ESLINT_require-yield",
		language: "javascript",
		badExample: `
		function* alpha() {
			return 10;
		}`,
		goodExample: `
		function* alpha() {
			yield 5;
			return 10;
		}`,
		description: "Warnings for generator functions that do not have the yield keyword are generated.",
		category: "Best Practices",
		severity: "",
		title: "Disallow Generator Functions with no `yield`",
	},
	{
		ruleId: "ESLINT_rest-spread-spacing",
		language: "javascript",
		badExample: `
		alpha()
		;[1, 2, 3].forEach(beta)`,
		goodExample: `
		alpha();
		[1, 2, 3].forEach(beta)`,
		description: "Terminators around semicolons should be avoided.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Spacing Between Rest and Spread Operators",
	},
	{
		ruleId: "ESLINT_semi-spacing",
		language: "javascript",
		badExample: "",
		goodExample: "",
		description: "JavaScript allows you to place unnecessary spaces before or after a semicolon.",
		category: "Best Practices",
		severity: "",
		title: "Enforce spacing before and after semicolons",
	},
	{
		ruleId: "ESLINT_semi-style",
		language: "javascript",
		badExample: "",
		goodExample: "",
		description: "Generally, semicolons are at the end of lines. However, in semicolon-less style, semicolons are at the beginning of lines. This rule enforces that semicolons are at the configured location.",
		category: "Best Practices",
		severity: "",
		title: "Enforce location of semicolons",
	},
	{
		ruleId: "ESLINT_semi",
		language: "javascript",
		badExample: "let value = 5",
		goodExample: "let value = 5;",
		description: "There should be a consistent use of semicolons.",
		category: "Best Practices",
		severity: "",
		title: "Require Semicolons Instead of ASI",
	},
	{
		ruleId: "ESLINT_sort-imports",
		language: "javascript",
		badExample: `
		import a from 'alpha.js';
		import A from 'test.js';
		import b from 'beta.js'`,
		goodExample: `
		import a from 'alpha.js';
		import b from 'beta.js';

		import A from 'test.js';`,
		description: "This rule checks all import declarations and verifies that all imports are first sorted by the used member syntax and then alphabetically by the first member or alias name.",
		category: "Best Practices",
		severity: "",
		title: "Import Sorting",
	},
	{
		ruleId: "ESLINT_sort-keys",
		language: "javascript",
		badExample: "let obj = {a: 1, c: 3, b: 2};",
		goodExample: "let obj = {a: 1, b: 2, c: 3};",
		description: "This rule checks all property definitions of object expressions and verifies that all variables are sorted alphabetically.",
		category: "Best Practices",
		severity: "",
		title: "Require Object Keys to be Sorted",
	},
	{
		ruleId: "ESLINT_sort-vars",
		language: "javascript",
		badExample: "let b, a;",
		goodExample: "let a, b, c, d;",
		description: "This rule checks all variable declaration blocks and verifies that all variables are sorted alphabetically.",
		category: "Best Practices",
		severity: "",
		title: "Variable Sorting",
	},
	{
		ruleId: "ESLINT_space-before-blocks",
		language: "javascript",
		badExample: `
		if (alpha){
			beta();
		}`,
		goodExample: `
		if (alpha) {
			beta();
		}`,
		description: "There should be consistency of spacing before blocks. It is only applied on blocks that don't begin on a new line.",
		category: "Best Practices",
		severity: "",
		title: "Require Space Before Blocks",
	},
	{
		ruleId: "ESLINT_space-before-function-paren",
		language: "javascript",
		badExample: `
		function alpha() {
			// ...
		}`,
		goodExample: `
		function alpha () {
			// ...
		}`,
		description: "There should be consistent spacing before function parentheses and as such, will warn whenever whitespace doesn't match the preferences specified.",
		category: "Best Practices",
		severity: "",
		title: "Require a Space Before Function Parenthesis",
	},
	{
		ruleId: "ESLINT_space-in-parens",
		language: "javascript",
		badExample: "dummy( );",
		goodExample: "dummy( );",
		description: "Spaces inside of parentheses should be disallowed.",
		category: "Best Practices",
		severity: "",
		title: "Disallow or enforce spaces inside of parentheses",
	},
	{
		ruleId: "ESLINT_space-infix-ops",
		language: "javascript",
		badExample: "alpha+beta",
		goodExample: "alpha + beta",
		description: "This rule is aimed at ensuring there are spaces around infix operators.",
		category: "Best Practices",
		severity: "",
		title: "Require Spacing Around Infix Operators",
	},
	{
		ruleId: "ESLINT_space-unary-ops",
		language: "javascript",
		badExample: "typeof!alpha;",
		goodExample: "typeof !alpha;",
		description: "Ther should be consistency regarding the spaces after words unary operators and after/before nonwords unary operators.",
		category: "Best Practices",
		severity: "",
		title: "Require Spaces Before/After Unary Operators",
	},
	{
		ruleId: "ESLINT_spaced-comment",
		language: "javascript",
		badExample: "//This is a comment with a whitespace at the beginning",
		goodExample: "// This is a comment with a whitespace at the beginning",
		description: "There should be consistency of spacing after the start of a comment // or /*. It also provides several exceptions for various documentation styles.",
		category: "Best Practices",
		severity: "",
		title: "Requires Whitespace",
	},
	{
		ruleId: "ESLINT_strict",
		language: "javascript",
		badExample: `
		function alpha() {
		}`,
		goodExample: `
		"use strict";

		function alpha() {
		}`,
		description: "Strict mode directives are required.",
		category: "Best Practices",
		severity: "",
		title: "Require Strict Mode Directives",
	},
	{
		ruleId: "ESLINT_switch-colon-spacing",
		language: "javascript",
		badExample: `
		switch (alpha) {
			case 0 :break;
			default :beta();
		}`,
		goodExample: `
		switch (alpha) {
			case 0: beta(); break;
			case 1:
				test();
				break;
			default:
				dummy();
				break;
		}`,
		description: "Spacing around colons of switch statements is required.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Spacing in Switch Statements",
	},
	{
		ruleId: "ESLINT_symbol-description",
		language: "javascript",
		badExample: "let alpha = Symbol();",
		goodExample: "let alpha = Symbol(\"description\");",
		description: "A description when creating symbols is required.",
		category: "Best Practices",
		severity: "",
		title: "Require Symbol Description",
	},
	{
		ruleId: "ESLINT_template-curly-spacing",
		language: "javascript",
		// eslint-disable-next-line no-template-curly-in-string
		badExample: "`dummy, ${data.test}`",
		// eslint-disable-next-line no-template-curly-in-string
		goodExample: "`hello, ${ data.test }`",
		description: "There should be consistency around the spacing inside of template literals.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Usage of Spacing in Template Strings",
	},
	{
		ruleId: "ESLINT_template-tag-spacing",
		language: "javascript",
		badExample: "func`Dummy`;",
		goodExample: "func `Dummy`;",
		description: "There should be consistency around the spacing between template tag functions and their template literals.",
		category: "Best Practices",
		severity: "",
		title: "Require Spacing Between Tags and Literals",
	},
	{
		ruleId: "ESLINT_unicode-bom",
		language: "javascript",
		badExample: "let abc;",
		goodExample: `
		U+FEFF
		let abc;`,
		description: "This rules requires the Unicode Byte Order Mark (BOM).",
		category: "Best Practices",
		severity: "",
		title: "Require Unicode BOM",
	},
	{
		ruleId: "ESLINT_use-isnan",
		language: "javascript",
		badExample: `
		if (alpha == NaN) {
			// ...
		}`,
		goodExample: `
		if (isNaN(alpha)) {
			// ...
		}`,
		description: "Comparisons to 'NaN' should be avoided.",
		category: "Best Practices",
		severity: "",
		title: "Require Calls to isNaN",
	},
	{
		ruleId: "ESLINT_valid-jsdoc",
		language: "javascript",
		badExample: `
		/**
		* Add two numbers.
		* @param {number} num The first number.
		* @returns The sum of the two numbers.
		*/`,
		goodExample: `
		/**
		* Add two numbers.
		* @param {number} num1 The first number.
		* @param {number} num2 The second number.
		* @returns {number} The sum of the two numbers.
		*/`,
		description: "There should be used valid and consistent JSDoc comments.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Valid JSDoc Comments",
	},
	{
		ruleId: "ESLINT_valid-typeof",
		language: "javascript",
		badExample: "typeof alpha === \"strnig\"",
		goodExample: "typeof alpha === \"string\"",
		description: "typeof expressions must be compared to valid string literals.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Comparing typeof",
	},
	{
		ruleId: "ESLINT_vars-on-top",
		language: "javascript",
		badExample: `
		function dog() {
			for (let i=0; i<10; i++) {}
		}`,
		goodExample: `
		function do() {
			let i;
			for (i=0; i<10; i++) {}
		}`,
		description: "All variable declarations shold be in the leading series of statements.",
		category: "Best Practices",
		severity: "",
		title: "Require Variable Declarations at Top",
	},
	{
		ruleId: "ESLINT_wrap-iife",
		language: "javascript",
		badExample: "let alpha = function () { return { beta: 1 };}();",
		goodExample: "let alpha = (function () { return { beta: 1 };}());",
		description: "All immediately-invoked function expressions are required to be wrapped in parentheses.",
		category: "Best Practices",
		severity: "",
		title: "Require IIFEs to be Wrapped",
	},
	{
		ruleId: "ESLINT_wrap-regex",
		language: "javascript",
		badExample: `
		function alpha() {
			return /ball/.test("beta");
		}`,
		goodExample: `
		function alpha() {
			return (/ball/).test("beta");
		}`,
		description: "regex literals are required to be wrapped.",
		category: "Best Practices",
		severity: "",
		title: "Require Regex Literals to be Wrapped",
	},
	{
		ruleId: "ESLINT_yield-star-spacing",
		language: "javascript",
		badExample: `
		function*generator() {
			yield*other();
		}`,
		goodExample: `
		function* generator() {
			yield* other();
		}`,
		description: "This rule enforces spacing around the * in yield expressions.",
		category: "Best Practices",
		severity: "",
		title: "Enforce Spacing Around the `*`",
	},
	{
		ruleId: "ESLINT_yoda",
		language: "javascript",
		badExample: `
		if ("blue" === color) {
			// ...
		}`,
		goodExample: `
		if (value === "blue") {
			// ...
		}`,
		description: "This rule aims to enforce consistent style of conditions which compare a variable to a literal value.",
		category: "Best Practices",
		severity: "",
		title: "Require or disallow Yoda Conditions",
	},
	{
		ruleId: "ESLINT_react-native/no-inline-styles",
		language: "javascript",
		badExample: `
		const Hello = React.createClass({
			render: function() {
				return <Text style={{backgroundColor: '#FFF'}}>Hello {this.props.name}</Text>;
			}
		});`,
		goodExample: `
		const Hello = React.createClass({
			render: function() {
				return <Text style={styles.name}>Hello {this.props.name}</Text>;
			}
		});`,
		description: "This rule detects inline style objects when they contain literal values.",
		category: "Best Practices",
		severity: "",
		title: "Detect Inline Styles in Components",
	},
	{
		ruleId: "ESLINT_react-native/no-single-element-style-arrays",
		language: "javascript",
		badExample: "<View style={[{width: 10}]} />",
		goodExample: "<View style={{width: 10}} />",
		description: "Using single element style arrays cause unnecessary re-renders as each time the array's identity changes.",
		category: "Best Practices",
		severity: "",
		title: "Avoid Single Element Style Arrays",
	},
];

export default violations;