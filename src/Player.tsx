import React, { useEffect, useState } from "react";
function Player() {
    useEffect(() => {
        const playSelectedFile = (file: File) => {
            const videoNode = document.getElementById(
                "player"
            ) as HTMLVideoElement;
            const fileURL = window.URL.createObjectURL(file);

            videoNode.src = fileURL;

            const selectionElement = document.querySelector(
                ".selection"
            ) as HTMLElement;
            const playerElement = document.querySelector(
                "#player"
            ) as HTMLElement;
            const activateInfoElement = document.querySelector(
                ".activate-info"
            ) as HTMLElement;
            const dragInfoElement = document.querySelector(
                ".drag-info"
            ) as HTMLElement;

            selectionElement.classList.add("hidden");
            playerElement.classList.remove("hidden");
            activateInfoElement.classList.remove("hidden");
            dragInfoElement.style.display = "none";
        };

        // Handle selecting a new file
        const inputNode = document.getElementById("input") as HTMLInputElement;

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
            const dragInfoElement = document.querySelector(
                ".drag-info"
            ) as HTMLElement;
            dragInfoElement.style.display = "flex";
        });

        document.body.addEventListener("dragexit", () => {
            const dragInfoElement = document.querySelector(
                ".drag-info"
            ) as HTMLElement;
            dragInfoElement.style.display = "none";
        });

        document.body.addEventListener("drop", (ev) => {
            console.log("File(s) dropped");

            // Prevent default behavior (Prevent file from being opened)
            ev.preventDefault();

            if (ev.dataTransfer!.items) {
                // Use DataTransferItemList interface to access the file(s)
                for (let i = 0; i < ev.dataTransfer!.items.length; i++) {
                    // If dropped items aren't files, reject them
                    if (ev.dataTransfer!.items[i].kind === "file") {
                        const file = ev.dataTransfer!.items[i].getAsFile();

                        playSelectedFile(file!);
                        return;
                    }
                }
            } else {
                // Use DataTransfer interface to access the file(s)
                for (let i = 0; i < ev.dataTransfer!.files.length; i++) {
                    playSelectedFile(ev.dataTransfer!.files[i]);
                    return;
                }
            }
        });
    }, []);
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
            <div className="hidden activate-info">
                <p>You can now activate Lecture Master</p>
            </div>

            <div className="hidden drag-info">
                <p>Drop your video to play it</p>
            </div>

            <div className="selection text-center">
                <h1 className="text-3xl font-bold mb-4">
                    Lecture Master Video Player
                </h1>
                <p>
                    This player allows you to use the{" "}
                    <a
                        href=""
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                    >
                        Lecture Master extension{" "}
                    </a>{" "}
                    in combination with local files.
                </p>
                <p>
                    Simply choose the video you want to watch, then activate
                    Lecture Master as normal.
                </p>

                <div className="file mt-4">
                    <label className="fileContainer">
                        Choose a video
                        <input
                            type="file"
                            accept="video/*"
                            id="input"
                        />
                    </label>
                </div>
            </div>
            <video
                controls
                autoPlay
                id="player"
                className="hidden"
            ></video>
        </div>
    );
}
export default Player;
