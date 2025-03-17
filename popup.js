document.addEventListener('DOMContentLoaded', () => {
    // Open settings page when the gear icon is clicked
    document.getElementById('settingsButton').addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
    });

    chrome.storage.sync.get(['bad'], function (data) {
        if (!data.bad) {
            //reset?
            document.getElementById("message").textContent = "No Problems found!";
            document.getElementById("name").textContent = data.bad.name;
            document.getElementById("id").textContent = data.bad.id;

            var prevReasons = document.getElementById("reasons");
            while (prevReasons.firstChild) {
                prevReasons.removeChild(prevReasons.firstChild);
            }
            return;
        }
        //debugger;//why can't we breakpoint here?
        console.log(data.bad);//why is there no logging from popup?
        document.getElementById("message").textContent = 'Warning. This extension is on the naughty list...';
        document.getElementById("name").textContent = data.bad.name;
        document.getElementById("id").textContent = data.bad.id;

        let reasons = document.getElementById("reasons");
        for (let r of data.bad.reasons) {
            const warningSpan = document.createElement('li');
            warningSpan.textContent = r;
            warningSpan.style.color = 'red';
            warningSpan.style.fontWeight = 'bold';
            reasons.appendChild(warningSpan);
        }
    });
});

console.log('hello from popup.js'); //why is there no logging from popup?

/* 
// popup.js <-> background.js
// https://stackoverflow.com/questions/12265403/passing-message-from-background-js-to-popup-js
// fails with: Unchecked runtime.lastError: The message port closed before a response was received.
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log("request: " + request.data);
        if (request.msg === "something_completed") {
            console.log(request.data.subject)
            console.log(request.data.content)
        }
    }
);
chrome.runtime.sendMessage({ data: "Handshake" }, function (response) { });
*/

/*
// popup.js <-> background.js
// try with Long-lived connections
// https://developer.chrome.com/docs/extensions/develop/concepts/messaging#connect
var port = chrome.extension.connect({
    name: "Sample Communication"
});
port.postMessage("Hi BackGround");
port.onMessage.addListener(function(msg) {
    console.log("message recieved" + msg);
});*/