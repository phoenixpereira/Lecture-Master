import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Player from "./Player";
import "./css/index.css";

let rootComponent;

// Check if view is a popup or tab
if (chrome.extension.getViews({ type: "popup" }).length > 0) {
    // If it's running in the popup context, render App
    rootComponent = <App />;
} else {
    // Otherwise (e.g., as a full tab), render Player
    rootComponent = <Player />;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>{rootComponent}</React.StrictMode>
);
