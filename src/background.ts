// Change the icon to active state
function setIconActive() {
    const iconPath = chrome.runtime.getURL("icons/active.png");
    if (typeof chrome !== "undefined") {
        if (typeof browser !== "undefined") {
            browser.browserAction.setIcon({
                path: {
                    128: iconPath
                }
            });
        } else {
            chrome.action.setIcon({
                path: {
                    128: iconPath
                }
            });
        }
    }
}

// Change the icon to inactive state
function setIconInactive() {
    const iconPath = chrome.runtime.getURL("icons/inactive.png");
    if (typeof chrome !== "undefined") {
        if (typeof browser !== "undefined") {
            browser.browserAction.setIcon({
                path: {
                    128: iconPath
                }
            });
        } else {
            chrome.action.setIcon({
                path: {
                    128: iconPath
                }
            });
        }
    }
}

// Listen for messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "setIconActive") {
        setIconActive();
    } else if (message.action === "setIconInactive") {
        setIconInactive();
    }
});
