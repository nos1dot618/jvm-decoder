// Reference: https://docs.oracle.com/javase/specs/jvms/se7/html/jvms-4.html

// ByteReader: Safe incremental buffer reader
class ByteReader {
    private view: DataView;
    private offset = 0;

    constructor(buffer: ArrayBuffer) {
        this.view = new DataView(buffer);
    }

    readUint8(): number {
        const v = this.view.getUint8(this.offset);
        this.offset += 1;
        return v;
    }

    readUint16(): number {
        const v = this.view.getUint16(this.offset, false);
        this.offset += 2;
        return v;
    }

    readUint32(): number {
        const v = this.view.getUint32(this.offset, false);
        this.offset += 4;
        return v;
    }

    readBytes(n: number): Uint8Array {
        const arr = new Uint8Array(this.view.buffer, this.offset, n);
        this.offset += n;
        return arr;
    }
}

// TODO: Combine ConstantPoolTag and ConstantPoolTagName.
export const enum ConstantPoolTag {
    UTF8 = 1,
    INTEGER = 3,
    FLOAT = 4,
    LONG = 5,
    DOUBLE = 6,
    CLASS = 7,
    STRING = 8,
    FIELD_REF = 9,
    METHOD_REF = 10,
    INTERFACE_METHOD_REF = 11,
    NAME_AND_TYPE = 12,
    METHOD_HANDLE = 15,
    METHOD_TYPE = 16,
    INVOKE_DYNAMIC = 18,
    MODULE = 19,
    PACKAGE = 20,
}

export const enum ConstantPoolTagKind {
    UTF8 = "Utf8",
    INTEGER = "Integer",
    FLOAT = "Float",
    LONG = "Long",
    DOUBLE = "Double",
    CLASS = "Class",
    STRING = "String",
    FIELD_REF = "FieldRef",
    METHOD_REF = "MethodRef",
    INTERFACE_METHOD_REF = "InterfaceMethodRef",
    NAME_AND_TYPE = "NameAndType",
    METHOD_HANDLE = "MethodHandle",
    METHOD_TYPE = "MethodType",
    INVOKE_DYNAMIC = "InvokeDynamic",
    MODULE = "Module",
    PACKAGE = "Package",
}

export interface CpBase {
    index: number;
    tag: ConstantPoolTag;
    kind: ConstantPoolTagKind;
}

export interface CpUtf8 extends CpBase {
    tag: ConstantPoolTag.UTF8;
    kind: ConstantPoolTagKind.UTF8;
    value: string;
}

export interface CpInteger extends CpBase {
    tag: ConstantPoolTag.INTEGER;
    kind: ConstantPoolTagKind.INTEGER;
    value: number;
}

export interface CpFloat extends CpBase {
    tag: ConstantPoolTag.FLOAT;
    kind: ConstantPoolTagKind.FLOAT;
    value: number;
}

export interface CpLong extends CpBase {
    tag: ConstantPoolTag.LONG;
    kind: ConstantPoolTagKind.LONG;
    value: bigint;
}

export interface CpDouble extends CpBase {
    tag: ConstantPoolTag.DOUBLE;
    kind: ConstantPoolTagKind.DOUBLE;
    value: number;
}

export interface CpClass extends CpBase {
    tag: ConstantPoolTag.CLASS;
    kind: ConstantPoolTagKind.CLASS;
    nameIndex: number;
}

export interface CpString extends CpBase {
    tag: ConstantPoolTag.STRING;
    kind: ConstantPoolTagKind.STRING;
    stringIndex: number;
}

export interface CpFieldRef extends CpBase {
    tag: ConstantPoolTag.FIELD_REF;
    kind: ConstantPoolTagKind.FIELD_REF;
    classIndex: number;
    nameAndTypeIndex: number;
}

export interface CpMethodRef extends CpBase {
    tag: ConstantPoolTag.METHOD_REF;
    kind: ConstantPoolTagKind.METHOD_REF;
    classIndex: number;
    nameAndTypeIndex: number;
}

export interface CpInterfaceMethodRef extends CpBase {
    tag: ConstantPoolTag.INTERFACE_METHOD_REF;
    kind: ConstantPoolTagKind.INTERFACE_METHOD_REF;
    classIndex: number;
    nameAndTypeIndex: number;
}

export interface CpNameAndType extends CpBase {
    tag: ConstantPoolTag.NAME_AND_TYPE;
    kind: ConstantPoolTagKind.NAME_AND_TYPE;
    nameIndex: number;
    descriptorIndex: number;
}

export interface CpMethodHandle extends CpBase {
    tag: ConstantPoolTag.METHOD_HANDLE;
    kind: ConstantPoolTagKind.METHOD_HANDLE;
    referenceKind: number;
    referenceIndex: number;
}

export interface CpMethodType extends CpBase {
    tag: ConstantPoolTag.METHOD_TYPE;
    kind: ConstantPoolTagKind.METHOD_TYPE;
    descriptorIndex: number;
}

export interface CpInvokeDynamic extends CpBase {
    tag: ConstantPoolTag.INVOKE_DYNAMIC;
    kind: ConstantPoolTagKind.INVOKE_DYNAMIC;
    bootstrapMethodAttrIndex: number;
    nameAndTypeIndex: number;
}

export interface CpModule extends CpBase {
    tag: ConstantPoolTag.MODULE;
    kind: ConstantPoolTagKind.MODULE;
    nameIndex: number;
}

export interface CpPackage extends CpBase {
    tag: ConstantPoolTag.PACKAGE;
    kind: ConstantPoolTagKind.PACKAGE;
    nameIndex: number;
}

export type ConstantPoolEntry =
    | CpUtf8
    | CpInteger
    | CpFloat
    | CpLong
    | CpDouble
    | CpClass
    | CpString
    | CpFieldRef
    | CpMethodRef
    | CpInterfaceMethodRef
    | CpNameAndType
    | CpMethodHandle
    | CpMethodType
    | CpInvokeDynamic
    | CpModule
    | CpPackage
    | null;

export interface AttributeInfo {
    nameIndex: number;
    length: number;
    info: Uint8Array;
}

// Field-Access-Flag Constants (JVMS #4.5)
export const enum FieldAccessFlags {
    ACC_PUBLIC = 0x0001,
    ACC_PRIVATE = 0x0002,
    ACC_PROTECTED = 0x0004,
    ACC_STATIC = 0x0008,
    ACC_FINAL = 0x0010,
    ACC_VOLATILE = 0x0040,
    ACC_TRANSIENT = 0x0080,
    ACC_SYNTHETIC = 0x1000,
    ACC_ENUM = 0x4000, // Field is an enum-element
}

// Method-Access-Flag Constants (JVMS #4.6)
export const enum MethodAccessFlags {
    ACC_PUBLIC = 0x0001,
    ACC_PRIVATE = 0x0002,
    ACC_PROTECTED = 0x0004,
    ACC_STATIC = 0x0008,
    ACC_FINAL = 0x0010,
    ACC_SYNCHRONIZED = 0x0020,
    ACC_BRIDGE = 0x0040,
    ACC_VARARGS = 0x0080, // Method is declared with variable number of arguments
    ACC_NATIVE = 0x0100, // Native-Java-Method
    ACC_ABSTRACT = 0x0400,
    ACC_STRICT = 0x0800, // Floating-Point-Mode is strict
    ACC_SYNTHETIC = 0x1000, // Method not present in source-code
}

export interface FieldInfo {
    accessFlags: string[];
    name: string;
    descriptor: string;
    attributes: AttributeInfo[];
}

export interface MethodInfo {
    accessFlags: string[];
    name: string;
    descriptor: string[];
    attributes: AttributeInfo[];
}

export interface ClassFile {
    magic: number;
    minorVersion: number;
    majorVersion: number;
    constantPool: ConstantPool;
    accessFlags: number;
    thisClass: number;
    superClass: number;
    interfaces: number[];
    fields: FieldInfo[];
    methods: MethodInfo[];
    attributes: AttributeInfo[];
}

class ConstantPool {
    private readonly length: number;
    private readonly entries: ConstantPoolEntry[];

    constructor(length: number, entries: ConstantPoolEntry[]) {
        this.length = length;
        this.entries = entries;
    }

    public getLength(): number {
        return this.length;
    }

    public getEntryAt(index: number): ConstantPoolEntry {
        return this.entries[index];
    }

    public getEntryAtOfKind(index: number, kind: ConstantPoolTagKind): ConstantPoolEntry {
        const entry: ConstantPoolEntry = this.getEntryAt(index);
        return (entry.kind === kind) ? entry : undefined;
    }
}

function readConstantPool(reader: ByteReader, count: number): ConstantPoolEntry[] {
    const constantPool: ConstantPoolEntry[] = new Array(count).fill(null);
    let i = 1;
    while (i < count) {
        const tag = reader.readUint8() as ConstantPoolTag;
        let entry: ConstantPoolEntry = null;
        switch (tag) {
            case ConstantPoolTag.UTF8: {
                const len = reader.readUint16();
                const bytes = reader.readBytes(len);
                entry = {
                    index: i,
                    tag: ConstantPoolTag.UTF8,
                    kind: ConstantPoolTagKind.UTF8,
                    value: new TextDecoder().decode(bytes),
                };
                break;
            }
            case ConstantPoolTag.INTEGER: {
                entry = {
                    index: i,
                    tag: ConstantPoolTag.INTEGER,
                    kind: ConstantPoolTagKind.INTEGER,
                    value: reader.readUint32() | 0,
                };
                break;
            }
            case ConstantPoolTag.FLOAT: {
                const raw = reader.readUint32();
                const dv = new DataView(new ArrayBuffer(4));
                dv.setUint32(0, raw);
                entry = {
                    index: i,
                    tag: ConstantPoolTag.FLOAT,
                    kind: ConstantPoolTagKind.FLOAT,
                    value: dv.getFloat32(0)
                };
                break;
            }
            case ConstantPoolTag.LONG: {
                const high = reader.readUint32();
                const low = reader.readUint32();
                entry = {
                    index: i,
                    tag: ConstantPoolTag.LONG,
                    kind: ConstantPoolTagKind.LONG,
                    value: (BigInt(high) << 32n) | BigInt(low),
                };
                constantPool[i++] = entry;
                constantPool[i++] = null;
                continue;
            }
            case ConstantPoolTag.DOUBLE: {
                const high = reader.readUint32();
                const low = reader.readUint32();
                const buf = new ArrayBuffer(8);
                const dv = new DataView(buf);
                dv.setUint32(0, high);
                dv.setUint32(4, low);
                entry = {
                    index: i,
                    tag: ConstantPoolTag.DOUBLE,
                    kind: ConstantPoolTagKind.DOUBLE,
                    value: dv.getFloat64(0)
                };
                constantPool[i++] = entry;
                constantPool[i++] = null;
                continue;
            }
            case ConstantPoolTag.CLASS: {
                entry = {
                    index: i,
                    tag: ConstantPoolTag.CLASS,
                    kind: ConstantPoolTagKind.CLASS,
                    nameIndex: reader.readUint16(),
                };
                break;
            }
            case ConstantPoolTag.STRING: {
                entry = {
                    index: i,
                    tag: ConstantPoolTag.STRING,
                    kind: ConstantPoolTagKind.STRING,
                    stringIndex: reader.readUint16(),
                };
                break;
            }
            case ConstantPoolTag.FIELD_REF: {
                entry = {
                    index: i,
                    tag: ConstantPoolTag.FIELD_REF,
                    kind: ConstantPoolTagKind.FIELD_REF,
                    classIndex: reader.readUint16(),
                    nameAndTypeIndex: reader.readUint16(),
                };
                break;
            }
            case ConstantPoolTag.METHOD_REF: {
                entry = {
                    index: i,
                    tag: ConstantPoolTag.METHOD_REF,
                    kind: ConstantPoolTagKind.METHOD_REF,
                    classIndex: reader.readUint16(),
                    nameAndTypeIndex: reader.readUint16(),
                };
                break;
            }
            case ConstantPoolTag.INTERFACE_METHOD_REF: {
                entry = {
                    index: i,
                    tag: ConstantPoolTag.INTERFACE_METHOD_REF,
                    kind: ConstantPoolTagKind.INTERFACE_METHOD_REF,
                    classIndex: reader.readUint16(),
                    nameAndTypeIndex: reader.readUint16(),
                } as any;
                break;
            }
            case ConstantPoolTag.NAME_AND_TYPE: {
                entry = {
                    index: i,
                    tag: ConstantPoolTag.NAME_AND_TYPE,
                    kind: ConstantPoolTagKind.NAME_AND_TYPE,
                    nameIndex: reader.readUint16(),
                    descriptorIndex: reader.readUint16(),
                };
                break;
            }
            case ConstantPoolTag.METHOD_HANDLE: {
                entry = {
                    index: i,
                    tag: ConstantPoolTag.METHOD_HANDLE,
                    kind: ConstantPoolTagKind.METHOD_HANDLE,
                    referenceKind: reader.readUint8(),
                    referenceIndex: reader.readUint16(),
                };
                break;
            }
            case ConstantPoolTag.METHOD_TYPE: {
                entry = {
                    index: i,
                    tag: ConstantPoolTag.METHOD_TYPE,
                    kind: ConstantPoolTagKind.METHOD_TYPE,
                    descriptorIndex: reader.readUint16(),
                };
                break;
            }
            case ConstantPoolTag.INVOKE_DYNAMIC: {
                entry = {
                    index: i,
                    tag: ConstantPoolTag.INVOKE_DYNAMIC,
                    kind: ConstantPoolTagKind.INVOKE_DYNAMIC,
                    bootstrapMethodAttrIndex: reader.readUint16(),
                    nameAndTypeIndex: reader.readUint16(),
                };
                break;
            }
            case ConstantPoolTag.MODULE: {
                entry = {
                    index: i,
                    tag: ConstantPoolTag.MODULE,
                    kind: ConstantPoolTagKind.MODULE,
                    nameIndex: reader.readUint16(),
                };
                break;
            }
            case ConstantPoolTag.PACKAGE: {
                entry = {
                    index: i,
                    tag: ConstantPoolTag.PACKAGE,
                    kind: ConstantPoolTagKind.PACKAGE,
                    nameIndex: reader.readUint16(),
                };
                break;
            }

            default:
                throw new Error(`Unsupported CP tag ${tag} at index ${i}`);
        }
        constantPool[i++] = entry;
    }
    return constantPool;
}

function readAttributes(reader: ByteReader, count: number): AttributeInfo[] {
    const out: AttributeInfo[] = [];
    for (let i = 0; i < count; i++) {
        const nameIndex = reader.readUint16();
        const length = reader.readUint32();
        const attributeInfo = reader.readBytes(length);
        out.push({
            nameIndex: nameIndex,
            length: length,
            info: attributeInfo,
        });
    }
    return out;
}

function decodeFieldAccessFlags(flags: number): string[] {
    const result: string[] = [];
    if (flags & FieldAccessFlags.ACC_PUBLIC) {
        result.push("public");
    }
    if (flags & FieldAccessFlags.ACC_PRIVATE) {
        result.push("private");
    }
    if (flags & FieldAccessFlags.ACC_PROTECTED) {
        result.push("protected");
    }
    if (flags & FieldAccessFlags.ACC_STATIC) {
        result.push("static");
    }
    if (flags & FieldAccessFlags.ACC_FINAL) {
        result.push("final");
    }
    if (flags & FieldAccessFlags.ACC_VOLATILE) {
        result.push("volatile");
    }
    if (flags & FieldAccessFlags.ACC_TRANSIENT) {
        result.push("transient");
    }
    if (flags & FieldAccessFlags.ACC_SYNTHETIC) {
        result.push("synthetic");
    }
    if (flags & FieldAccessFlags.ACC_ENUM) {
        result.push("enum");
    }
    return result;
}

function decodeFieldDescriptor(descriptor: string): string {
    switch (descriptor) {
        case "B":
            return "byte";
        case "C":
            return "char";
        case "D":
            return "double";
        case "F":
            return "float";
        case "I":
            return "int";
        case "J":
            return "long";
        case "S":
            return "short";
        case "Z":
            return "boolean";
        default: {
            if (descriptor.startsWith("L") && descriptor.endsWith(";")) { // Object reference
                return descriptor.slice(1, -1).replace(/\//g, ".");
            } else if (descriptor.startsWith("[")) { // Array Reference
                return `${decodeFieldDescriptor(descriptor.slice(1))}[]`;
            }
            return undefined;
        }
    }
}

function readFields(reader: ByteReader, constantPool: ConstantPool): FieldInfo[] {
    const count = reader.readUint16();
    const out: FieldInfo[] = [];
    for (let i = 0; i < count; i++) {
        const accessFlags = reader.readUint16();
        const name = (constantPool.getEntryAtOfKind(reader.readUint16(), ConstantPoolTagKind.UTF8) as CpUtf8).value;
        const descriptor = (constantPool.getEntryAtOfKind(reader.readUint16(), ConstantPoolTagKind.UTF8) as CpUtf8).value;
        const attrCount = reader.readUint16();
        out.push({
            accessFlags: decodeFieldAccessFlags(accessFlags),
            name: name,
            descriptor: decodeFieldDescriptor(descriptor),
            attributes: readAttributes(reader, attrCount),
        });
    }
    return out;
}

function decodeMethodAccessFlags(flags: number): string[] {
    let result: string[] = [];
    if (flags & MethodAccessFlags.ACC_PUBLIC) {
        result.push("public");
    }
    if (flags & MethodAccessFlags.ACC_PRIVATE) {
        result.push("private");
    }
    if (flags & MethodAccessFlags.ACC_PROTECTED) {
        result.push("protected");
    }
    if (flags & MethodAccessFlags.ACC_STATIC) {
        result.push("static");
    }
    if (flags & MethodAccessFlags.ACC_FINAL) {
        result.push("final");
    }
    if (flags & MethodAccessFlags.ACC_SYNCHRONIZED) {
        result.push("synchronized");
    }
    if (flags & MethodAccessFlags.ACC_BRIDGE) {
        result.push("bridge");
    }
    if (flags & MethodAccessFlags.ACC_VARARGS) {
        result.push("varargs");
    }
    if (flags & MethodAccessFlags.ACC_NATIVE) {
        result.push("native");
    }
    if (flags & MethodAccessFlags.ACC_ABSTRACT) {
        result.push("abstract");
    }
    if (flags & MethodAccessFlags.ACC_STRICT) {
        result.push("strict");
    }
    if (flags & MethodAccessFlags.ACC_SYNTHETIC) {
        result.push("synthetic");
    }
    return result;
}

function decodeMethodDescriptor(descriptor: string): string[] {
    function parseField(descriptor: string, start: number): { type: string; nextIndex: number } | undefined {
        const c = descriptor[start];
        if (!c) {
            return undefined;
        }
        if ("BCDFIJSZ".includes(c)) { // Primitive type
            const type = decodeFieldDescriptor(c)!;
            return { type: type, nextIndex: start + 1 };
        }
        if (c === "L") { // Object reference
            const end = descriptor.indexOf(";", start);
            if (end === -1) return undefined;
            const fieldDesc = descriptor.slice(start, end + 1);
            const type = decodeFieldDescriptor(fieldDesc)!;
            return { type: type, nextIndex: end + 1 };
        }
        if (c === "[") { // Array reference
            let pos = start;
            while (descriptor[pos] === "[") {
                pos++;
            }
            const inner = parseField(descriptor, pos);
            if (!inner) {
                return undefined;
            }
            const full = descriptor.slice(start, inner.nextIndex);
            const type = decodeFieldDescriptor(full)!;
            return { type: type, nextIndex: inner.nextIndex };
        }
        return undefined;
    }

    if (!descriptor.startsWith("(")) {
        return undefined;
    }
    let index = 1; // skip '('
    // Method-Parameter-Descriptors followed by a Return-Descriptor at the end
    const result: string[] = [];
    // Parse ParameterDescriptor* until ')'
    while (index < descriptor.length && descriptor[index] !== ")") {
        const field = parseField(descriptor, index);
        if (!field) {
            return undefined;
        }
        result.push(field.type);
        index = field.nextIndex;
    }
    if (descriptor[index] !== ")") {
        return undefined;
    }
    index++; // skip ')'
    // Parse ReturnDescriptor
    if (index >= descriptor.length) {
        return undefined;
    }
    if (descriptor[index] === "V") { // Void-Descriptor
        result.push("void");
        index++;
    } else {
        const field = parseField(descriptor, index);
        if (!field) {
            return undefined;
        }
        result.push(field.type);
        index = field.nextIndex;
    }
    // Should have consumed the whole descriptor
    if (index !== descriptor.length) {
        return undefined;
    }
    return result;
}

function readMethods(reader: ByteReader, constantPool: ConstantPool): MethodInfo[] {
    const count = reader.readUint16();
    const out: MethodInfo[] = [];
    for (let i = 0; i < count; i++) {
        const accessFlags = reader.readUint16();
        const name = (constantPool.getEntryAtOfKind(reader.readUint16(), ConstantPoolTagKind.UTF8) as CpUtf8).value;
        const descriptor = (constantPool.getEntryAtOfKind(reader.readUint16(), ConstantPoolTagKind.UTF8) as CpUtf8).value;
        const attrCount = reader.readUint16();
        out.push({
            accessFlags: decodeMethodAccessFlags(accessFlags),
            name: name,
            descriptor: decodeMethodDescriptor(descriptor),
            attributes: readAttributes(reader, attrCount),
        });
    }
    return out;
}

export function parseClassFile(buffer: ArrayBuffer): ClassFile {
    const reader = new ByteReader(buffer);

    const magic = reader.readUint32();
    if (magic !== 0XCAFEBABE) {
        throw new Error("Invalid JVM class file: magic mismatch");
    }

    const minorVersion = reader.readUint16();
    const majorVersion = reader.readUint16();

    const constantPoolCount = reader.readUint16();
    const constantPool = new ConstantPool(constantPoolCount, readConstantPool(reader, constantPoolCount));

    const accessFlags = reader.readUint16();
    const thisClass = reader.readUint16();
    const superClass = reader.readUint16();

    const interfacesCount = reader.readUint16();
    const interfaces = Array.from({ length: interfacesCount }, () => reader.readUint16());

    const fields = readFields(reader, constantPool);
    const methods = readMethods(reader, constantPool);

    const attrCount = reader.readUint16();
    const attributes = readAttributes(reader, attrCount);

    return {
        magic,
        minorVersion,
        majorVersion,
        constantPool,
        accessFlags,
        thisClass,
        superClass,
        interfaces,
        fields,
        methods,
        attributes,
    };
}

export function cpToString(cp: ConstantPool, index: number): string {
    const e = cp.getEntryAt(index);
    if (!e) return "<empty>";
    switch (e.tag) {
        case ConstantPoolTag.UTF8:
            return e.value;
        case ConstantPoolTag.CLASS:
            return cpToString(cp, e.nameIndex);
        case ConstantPoolTag.STRING:
            return cpToString(cp, e.stringIndex);
        case ConstantPoolTag.NAME_AND_TYPE:
            return `${cpToString(cp, e.nameIndex)}:${cpToString(cp, e.descriptorIndex)}`;
        default:
            return `${e.kind}#${index}`;
    }
}

export function getClassName(cf: ClassFile): string {
    const e = cf.constantPool.getEntryAt(cf.thisClass) as CpClass;
    return cpToString(cf.constantPool, e.nameIndex).replace(/\//g, ".");
}

export function getSuperClassName(cf: ClassFile): string | null {
    if (cf.superClass === 0) return null; // java.lang.Object
    const e = cf.constantPool.getEntryAt(cf.superClass) as CpClass;
    return cpToString(cf.constantPool, e.nameIndex).replace(/\//g, ".");
}
