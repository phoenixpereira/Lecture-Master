import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Player from "./Player";
import "./css/index.css";

let rootComponent;

if (
    typeof browser !== "undefined" &&
    browser.extension.getViews({ type: "popup" }).includes(window)
) {
    // If it's running in the popup context in Firefox, render App
    rootComponent = <App />;
} else if (
    typeof chrome !== "undefined" &&
    chrome.extension.getViews({ type: "popup" }).includes(window)
) {
    // If it's running in the popup context in Chrome, render App
    rootComponent = <App />;
} else {
    // Otherwise (e.g., as a full tab), render Player
    rootComponent = <Player />;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>{rootComponent}</React.StrictMode>
);
