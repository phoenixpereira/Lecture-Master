import React from "react";

const LocalPlayerInfo = () => (
    <div className="local-player-info">
        You are trying to use Lecture Master with a local video file.
        <br />
        Due to browser-restrictions, this extension cannot work on local files
        directly.
        <br />
        <br />
        Instead, please open the Lecture Master Local Video player using the
        button below, choose your local video file, and use Lecture Master
        normally.
        <br />
        <a
            href=""
            className="player-btn"
            target="_blank"
        >
            Open Player
        </a>
    </div>
);
export default LocalPlayerInfo;
