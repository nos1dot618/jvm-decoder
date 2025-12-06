import {readFileSync} from "fs";
import {getClassName, getSuperClassName, parseClassFile} from "../src/lib/ClassParser";

const file = readFileSync("./Test.class"); // Node Buffer
const buffer = file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength);
const classFile = parseClassFile(buffer);

console.log("Class:", getClassName(classFile));
console.log("Super:", getSuperClassName(classFile));
console.log("Major Version:", classFile.majorVersion);
console.log("Fields:", classFile.fields);
console.log("Methods:", classFile.methods);