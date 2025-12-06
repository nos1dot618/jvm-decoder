// @ts-ignore
declare const unzipit: typeof import("unzipit");

document.getElementById("jarInput").addEventListener("change", async (e) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
        return;
    }

    document.getElementById("status").textContent = "Loading JAR...";

    // Unzip JAR
    const {entries} = await unzipit.unzip(file);

    const classListDiv = document.getElementById("classList");
    classListDiv.innerHTML = "";

    document.getElementById("status").textContent = "Listing class files...";

    for (const name in entries) {
        if (name.endsWith(".class")) {
            const div = document.createElement("div");
            div.className = "class-item";
            div.textContent = name;
            // Extract .class-file
            div.onclick = async () => {
                const data = await entries[name].blob();
                const url = URL.createObjectURL(data);
                // Auto-Download the .class-file
                const a = document.createElement("a");
                a.href = url;
                a.download = name.split("/").pop();
                a.click();
                URL.revokeObjectURL(url);
            };
            classListDiv.appendChild(div);
        }
    }
    document.getElementById("status").textContent = "Done.";
});