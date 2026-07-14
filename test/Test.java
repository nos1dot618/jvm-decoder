import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Test implements Runnable, Comparable<Test> {

    protected static final double STATIC_FINAL_DOUBLE = 3.14;       // D
    public int publicIntField;                                      // I
    public int[] intArrayField;                                     // [I
    public String[] stringArrayField;                               // [Ljava/lang/String;
    public Thread threadField;                                      // Ljava/lang/Thread;
    public TestEnum enumField = TestEnum.FIRST;                     // Test$TestEnum
    public InnerClass innerClassField = new InnerClass(42);         // Test$InnerClass
    public ArrayList<Integer> genericListField = new ArrayList<>(); // Ljava/util/ArrayList;
    volatile long volatileLongField;                                // J
    transient Object transientObjectField;                          // Ljava/lang/Object
    private String privateStringField = "hello";                    // Ljava/lang/String;

    // Constructors

    public Test() {
    }

    public Test(int initial) {
        this.publicIntField = initial;
    }

    public Test(int initial, String text) {
        this.publicIntField = initial;
        this.privateStringField = text;
    }


    // Methods with various descriptors

    // (I)V
    private static native void nativeMethod(int code);

    // (I)I
    public int increment(int x) {
        return x + 1;
    }

    // (IDLjava/lang/Thread;)D
    public double mixedTypes(int i, double d, Thread t) {
        return i + d + (t == null ? 0.0 : 1.0);
    }

    // ()V
    public void doNothing() {
    }

    // ([I)[I
    public int[] duplicateArray(int[] input) {
        if (input == null) return null;
        int[] out = new int[input.length];
        System.arraycopy(input, 0, out, 0, input.length);
        return out;
    }

    // (Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
    public String concatStrings(String a, String b) {
        return String.valueOf(a) + String.valueOf(b);
    }

    // (Ljava/lang/String;[Ljava/lang/String;)Ljava/lang/String;
    public String joinWithVarargs(String prefix, String... parts) {
        StringBuilder sb = new StringBuilder(prefix);
        for (String p : parts) {
            sb.append(p);
        }
        return sb.toString();
    }

    // ()V
    public synchronized final void synchronizedFinalMethod() {
        this.publicIntField++;
    }

    // (D)D
    public strictfp double strictfpMethod(double a, double b) {
        return a / b;
    }


    // Methods to trigger invoke-dynamic / method-handle (lambda)

    public void useLambda() {
        Runnable r = () -> System.out.println("lambda from Test");
        r.run();
    }

    public void useLambdaWithCapture(String msg) {
        Runnable r = () -> System.out.println("captured: " + msg);
        r.run();
    }


    // Interface-Implementations

    @Override
    public void run() {
        System.out.println("Test.run()");
    }

    @Override
    public int compareTo(Test other) {
        return Integer.compare(this.publicIntField, other.publicIntField);
    }

    @Override
    public String toString() {
        return "Test{" + "publicIntField=" + publicIntField + ", privateStringField='" + privateStringField + '\'' + ", enumField=" + enumField + '}';
    }


    // Inner-Class & enum

    public enum TestEnum {
        FIRST, SECOND, THIRD
    }

    public static class InnerClass {
        public int innerValue;

        public InnerClass(int innerValue) {
            this.innerValue = innerValue;
        }

        public int getInnerValue() {
            return innerValue;
        }
    }
}

class Animal {}

abstract class Dog extends Animal {
    private int age;
    public abstract void bark();
}
