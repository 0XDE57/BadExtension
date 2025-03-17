document.addEventListener('DOMContentLoaded', async () => {
    const status = document.getElementById('status');
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length > 0) {
        const tab = tabs[0];
        const blacklist = await loadBlacklist();
        if (isBlacklisted(tab, blacklist)) {
            status.textContent = 'This tab is blacklisted!';
        } else {
            status.textContent = 'This tab is not blacklisted.';
        }
    }
});