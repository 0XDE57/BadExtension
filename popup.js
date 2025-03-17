document.addEventListener('DOMContentLoaded', () => {
    // Open settings page when the gear icon is clicked
    document.getElementById('settingsButton').addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("message: " + message);
    if (message.type === 'BadExtension') {
        const messageElement = document.getElementById('message');
        messageElement.textContent = `${message.extension} is bad!`;
    }
});

console.log('hello from popup.js');
