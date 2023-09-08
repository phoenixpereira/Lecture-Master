const playSelectedFile = (file) => {
    const videoNode = document.getElementById("player");
    const fileURL = window.URL.createObjectURL(file);

    videoNode.src = fileURL;

    const selectionElement = document.querySelector(".selection");
    const playerElement = document.querySelector("#player");
    const activateInfoElement = document.querySelector(".activate-info");
    const dragInfoElement = document.querySelector(".drag-info");

    selectionElement.classList.add("hidden");
    playerElement.classList.remove("hidden");
    activateInfoElement.classList.remove("hidden");
    dragInfoElement.style.display = "none";
};

// Handle selecting a new file
const inputNode = document.getElementById("input");

if (inputNode && inputNode.files && inputNode.files.length > 0) {
    // Access the selected file
    const selectedFile = inputNode.files[0];
    playSelectedFile(selectedFile);
}

inputNode.addEventListener(
    "change",
    (evt) => {
        if (inputNode.files && inputNode.files.length > 0) {
            const selectedFile = inputNode.files[0];
            playSelectedFile(selectedFile);
        }
    },
    false
);

// Handle Drag and Drop of files over the page
document.body.addEventListener("dragover", (ev) => {
    ev.preventDefault();
    const dragInfoElement = document.querySelector(".drag-info");
    dragInfoElement.style.display = "flex";
});

document.body.addEventListener("dragexit", () => {
    const dragInfoElement = document.querySelector(".drag-info");
    dragInfoElement.style.display = "none";
});

document.body.addEventListener("drop", (ev) => {
    console.log("File(s) dropped");

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer && ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (let i = 0; i < ev.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (ev.dataTransfer.items[i].kind === "file") {
                const file = ev.dataTransfer.items[i].getAsFile();

                playSelectedFile(file);
                return;
            }
        }
    } else {
        // Use DataTransfer interface to access the file(s)
        for (let i = 0; i < ev.dataTransfer.files.length; i++) {
            playSelectedFile(ev.dataTransfer.files[i]);
            return;
        }
    }
});
