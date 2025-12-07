// @ts-ignore
declare const unzipit: typeof import("unzipit");
// @ts-ignore
declare const mermaid: import("mermaid").default;

mermaid.initialize({startOnLoad: false, theme: "dark"});

const unzip = unzipit;

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

// Upload Handling
uploadBox.addEventListener("click", () => {
    jarInput.click();
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
        const zip = await unzip.unzip(file);
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
        updateDiagram();
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
        updateDiagram();
    });

    row.addEventListener("click", () => {
        checkbox.checked = !checkbox.checked;
        if (checkbox.checked) {
            selectedClasses.add(name);
        } else {
            selectedClasses.delete(name);
        }
        updateDiagram();
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

// TODO: Fix this
// Diagram updater
function updateDiagram() {
    const classes: string[] = [...selectedClasses];
    if (classes.length === 0) {
        diagram.textContent = "graph TD;";
        mermaid.run({nodes: [diagram]});
        return;
    }
    let graph = "graph TD;\n";

    classes.forEach((cls, i) => {
        const id = cls.replace(/[^a-zA-Z0-9]/g, "_");
        graph += `    ${id}["${cls.replace(".class", "")}"];\n`;

        if (i > 0) {
            const prev = classes[i - 1].replace(/[^a-zA-Z0-9]/g, "_");
            graph += `    ${prev} --> ${id};\n`;
        }
    });

    diagram.textContent = graph;
    mermaid.run({nodes: [diagram]});
}
