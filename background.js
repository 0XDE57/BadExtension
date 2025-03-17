let blacklist;

async function loadBlacklist() {
    const response = await fetch('blacklist.json');
    return response.json();
}

function isBlacklisted(tab, blacklist) {
    for (const entry of blacklist) {
        //tab.url requires 'tabs' permision
        if (tab.url.includes(entry.id)) {
            console.log(`Extension [${entry.id}] is blacklisted: ${entry.reasons}`);
            return entry;
        }
    }
    return null;
}

function setIconViaCanvas() {
    const canvas = new OffscreenCanvas(16, 16);
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, 16, 16);
    context.fillStyle = '#00FF00';  // Green
    context.fillRect(0, 0, 16, 16);
    const imageData = context.getImageData(0, 0, 16, 16);
    chrome.action.setIcon({ imageData: imageData }, () => { /* ... */ });
}

/* popup.js <-> background.js
chrome.runtime.onConnect.addListener(function (port) {
    console.log("port: " + port);
    port.onMessage.addListener(function (msg) {
        console.log("message recieved" + msg);
        port.postMessage("Hi Popup.js");
    });
})*/

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log("background onMessage: " + message.data)
    //chrome.runtime.sendMessage({ data: 'hello from background.js' }, function (response) { });
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) {
        if (!blacklist) {
            blacklist = await loadBlacklist();
            console.log('list loaded: ' + blacklist.length);
        } else {
            console.log('already loaded: ' + blacklist.length);
        }

        let badExtensionFound = isBlacklisted(tab, blacklist);
        if (badExtensionFound) {
            chrome.action.setBadgeText({ text: 'Bad!', tabId: tabId });
            chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
            chrome.storage.sync.set({ 'bad': badExtensionFound });
       
            /* popup.js <-> background.js
            //Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.
            chrome.runtime.sendMessage({ type: 'BadExtension', extension: badExtensionFound });
            chrome.runtime.sendMessage({
                msg: "something_completed", 
                data: {
                    subject: "Loading",
                    content: "Just completed!"
                }
            });*/


            chrome.storage.sync.get(['enableNotifications', 'enablePopup'], (items) => {
                if (items.enablePopup) {
                    chrome.action.openPopup();
                }
                if (items.enableNotifications) {
                    //requires 'notifications' permission
                    const notification = {
                        type: 'basic',
                        iconUrl: 'icon48.png',
                        title: 'Warning: Bad Extension!',
                        message: `${badExtensionFound.name} is flagged as bad!`
                    };
                    chrome.notifications.create('BadNotification', notification);
                }
            });
        } else {
            //clear
            chrome.action.setBadgeText({ text: '', tabId: tabId });
            chrome.storage.sync.remove(['bad'], function () {
                var error = chrome.runtime.lastError;
                if (error) {
                    console.error(error);
                }
            });
        }
    }
});