import "./styles.css";

// @ts-ignore
declare const unzipit: typeof import("unzipit");
// @ts-ignore
declare const mermaid: import("mermaid").default;
import * as cp from "./ClassParser.js";

mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    flowchart: {
        nodeSpacing: 20,
        rankSpacing: 40,
    },
    class: {
        useMaxWidth: false,
    },
    themeVariables: {
        fontFamily: "MS Sans Serif, Tahoma, sans-serif",
    }
});

let entries = {};
let selectedClasses = new Set<string>();

const uploadBox = document.getElementById("uploadBox");
const jarInput = document.getElementById("jarInput") as HTMLInputElement;
const classList = document.getElementById("classList");
const search = document.getElementById("search") as HTMLInputElement;
const searchContainer = document.getElementById("searchContainer");
const diagram = document.getElementById("diagram");

// Global drag defaults
// Prevent browser from opening the file when dropped outside the box
["dragover", "drop"].forEach(eventName => {
    window.addEventListener(eventName, e => {
        e.preventDefault();
    });
});

// Drag-Enter / over / leave / drop on the upload box
["dragenter", "dragover"].forEach(eventName => {
    uploadBox.addEventListener(eventName, e => {
        e.preventDefault();
        e.stopPropagation();
        uploadBox.classList.add("dragover");
    });
});

["dragleave", "drop"].forEach(eventName => {
    uploadBox.addEventListener(eventName, e => {
        e.preventDefault();
        e.stopPropagation();
        if (eventName === "dragleave") {
            uploadBox.classList.remove("dragover");
        }
    });
});

uploadBox.addEventListener("drop", e => {
    e.preventDefault();
    e.stopPropagation();
    uploadBox.classList.remove("dragover");
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (!file) {
        return;
    }
    jarInput.files = e.dataTransfer.files;
    void loadJarFile(file);
});

jarInput.addEventListener("change", e => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    void loadJarFile(file);
});

async function loadJarFile(file: File) {
    if (!file) {
        return;
    }
    uploadBox.textContent = `Loading '${file.name}'`;
    try {
        const zip = await unzipit.unzip(file);
        entries = zip.entries;
        console.log(entries);
        classList.innerHTML = "";
        selectedClasses.clear();
        for (const name in entries) {
            if (!name.endsWith(".class")) continue;
            addClassRow(name);
        }
        uploadBox.textContent = `Loading '${file.name}'`;
        searchContainer.style.display = "block";
        void updateDiagram();
    } catch (err) {
        console.error(err);
        uploadBox.textContent = `Error loading .JAR '${file.name}'`;
    }
}

// Build class-row
function addClassRow(name: string) {
    const row = document.createElement("div");
    row.className = "class-row";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    const label = document.createElement("span");
    label.textContent = name.replace(".class", "");

    checkbox.addEventListener("change", e => {
        e.stopPropagation();
        if (checkbox.checked) {
            selectedClasses.add(name);
        } else {
            selectedClasses.delete(name);
        }
        row.classList.toggle("selected", checkbox.checked);
        void updateDiagram();
    });

    row.addEventListener("click", () => {
        checkbox.checked = !checkbox.checked;
        if (checkbox.checked) {
            selectedClasses.add(name);
        } else {
            selectedClasses.delete(name);
        }
        row.classList.toggle("selected", checkbox.checked);
        void updateDiagram();
    });

    row.appendChild(checkbox);
    row.appendChild(label);
    classList.appendChild(row);
}

// Search filter
search.addEventListener("input", () => {
    const filter = search.value.toLowerCase();
    [...classList.children].forEach(row => {
        const el = row as HTMLElement;
        const text = el.textContent!.toLowerCase();
        el.style.display = text.includes(filter) ? "flex" : "none";
    });

});

// Diagram updater
async function updateDiagram() {
    let graph = "classDiagram\n";

    const parsed = new Map<string, cp.ClassFile>();
    // Parse selected classes.
    for (const path of selectedClasses) {
        const buffer = await entries[path].arrayBuffer();
        const cf = cp.parseClassFile(buffer);
        console.log(cf);
        parsed.set(cp.getClassName(cf), cf);
    }

    // Emit class bodies.
    for (const [name, cf] of parsed) {
        graph += `class ${sanitize(name)} {\n`;
        for (const field of cf.fields) {
            graph += `\t${visibility(field.accessFlags)} ${field.name} : ${field.descriptor}\n`;
        }
        for (const method of cf.methods) {
            const params = method.descriptor.slice(0, -1).join(", ");
            const ret = method.descriptor.at(-1);
            graph += `\t${visibility(method.accessFlags)} ${method.name}(${params}) ${ret}\n`;
        }
        graph += "}\n";
    }


    // Emit inheritance.
    for (const [name, cf] of parsed) {
        const superClassName = cp.getSuperClassName(cf);
        if (superClassName && parsed.has(superClassName)) {
            graph += `${sanitize(superClassName)} <|-- ${sanitize(name)}\n`;
        }
    }

    console.log(graph);

    const { svg } = await mermaid.render("uml", graph, diagram);
    diagram.innerHTML = svg;
}

function sanitize(name: string): string {
    return name.replace(/[.$]/g, "_");
}

function visibility(flags: string[]): string {
    if (flags.includes("public")) return "+";
    if (flags.includes("private")) return "-";
    if (flags.includes("protected")) return "#";
    else "~";
}
