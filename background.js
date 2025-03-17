let blacklist;

async function loadBlacklist() {
    const response = await fetch('blacklist.json');
    return response.json();
}

function isBlacklisted(tab, blacklist) {
    //var test = await chrome.tabs.query({active: true, lastFocusedWindow: true})
    for (const entry of blacklist) {
        //tab.url requires 'tabs' permision
        if (tab.url.includes(entry.id)) {
            console.log(`Extension [${entry.id}] is blacklisted: ${entry.reason}`);
            return entry;
        }
    }
    return null;
}


function injectContentScript(tabId, extensionInfo) {
    //requires 'scripting' permission, and extension store url added to host_permissions
    const injected = chrome.scripting.executeScript({
        target: { tabId },
        files: ['content.js']
    }).then(() => console.log("script injected"));
    if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
    }
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) {
        if (!blacklist) {
            blacklist = await loadBlacklist();
            console.log('list loaded: ' + blacklist.length);
        } else {
            console.log('already loaded');
        }

        let badExtensionFound = isBlacklisted(tab, blacklist);
        if (badExtensionFound) {
            injectContentScript(tabId, badExtensionFound);
        }
    }
});