import { useEffect, useState } from "react";

function useBrowser() {
    const [isLocalVideo, setIsLocalVideo] = useState(false);

    useEffect(() => {
        const detectLocalVideo = (url: URL) => {
            setIsLocalVideo(url.protocol === "file:");
            chrome.storage.local.set({
                isLocalVideo: url.protocol === "file:"
            });
        };

        if (typeof browser !== "undefined") {
            browser.tabs
                .query({ active: true, currentWindow: true })
                .then((tabs) => {
                    if (tabs[0] && tabs[0].url) {
                        const url = new URL(tabs[0].url);
                        detectLocalVideo(url);
                    }
                });
        } else if (typeof chrome !== "undefined") {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0] && tabs[0].url) {
                    const url = new URL(tabs[0].url);
                    detectLocalVideo(url);
                }
            });
        } else {
            console.error("Unsupported browser");
        }
    }, []);

    return { isLocalVideo };
}

export default useBrowser;
