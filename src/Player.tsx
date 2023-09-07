import React from "react";
const Player = () => {
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
};
export default Player;
