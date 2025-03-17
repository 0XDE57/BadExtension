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
            const response = await chrome.tabs.sendMessage(tabId, { 
                data: badExtensionFound 
            });
            console.log(response);
        }
    }
});