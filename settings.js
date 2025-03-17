document.addEventListener('DOMContentLoaded', () => {
    //NOTE: storage.sync requires `storage` permissions
    chrome.storage.sync.get(['enableNotifications', 'enablePopup'], (items) => {
        document.getElementById('enableNotifications').checked = items.enableNotifications || false;
        document.getElementById('enablePopup').checked = items.enablePopup || true;
    });

    const saveSettings = () => {
        chrome.storage.sync.set({
            enableNotifications: document.getElementById('enableNotifications').checked,
            enablePopup: document.getElementById('enablePopup').checked
        });
    };

    document.getElementById('enableNotifications').addEventListener('change', saveSettings);
    document.getElementById('enablePopup').addEventListener('change', saveSettings);
});