> JVM-Decoder in TypeScript

---

## Getting Started

```shell
# Install dependencies
npm install

# Build .class-files for the test
javac -d ./test/ ./test/Test.java
# Build .jar-file for the test
jar cf ./test/test.jar ./test/*.class

# Compile astro-project
npm run build
# Compile .ts-files
npx tsc
```

## Run Test

```shell
# Test .class-file-parser
cd ./test/
npx tsx ./ClassParser.test.ts
cd ../
# Test tool
python -m http-server --directory public/ &
open http://localhost:8000/
```

## References

1. [JVM-Specification: Chapter 4. The class File Format](https://docs.oracle.com/javase/specs/jvms/se7/html/jvms-4.html)