import React from "react";

const LocalPlayerInfo = () => (
    <div className="local-player-info mx-8 my-10">
        <p className="text-lg font-semibold">
            You are trying to use Lecture Master with a local video file.
        </p>
        <p className="mt-2">
            Due to browser restrictions, this extension cannot directly work on
            local videos.
        </p>
        <p className="mt-2">
            Instead, please open the Lecture Master Local Video player using the
            button below, choose your local video file, and use Lecture Master
            normally.
        </p>
        <a
            href=""
            className="mt-4 px-4 py-2 bg-bright-orange text-white rounded inline-block"
            target="_blank"
        >
            Open Player
        </a>
    </div>
);

export default LocalPlayerInfo;
