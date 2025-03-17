
function findButton() {
    const buttonSpans = document.querySelectorAll('button > span');
    const addToChrome = Array.from(buttonSpans).filter(span => {
        return span.textContent.trim() === 'Add to Chrome';
    });

    if (addToChrome.length === 0) {
        return null;
    }

    return addToChrome[0].parentElement;
}

function getExtensionDiv(button) {
    return button.parentElement.parentElement.parentElement;
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function addReasons(div, reason) {
    let warningDiv = document.createElement('div');
    warningDiv.style.outlineColor = 'red';
    warningDiv.style.outlineStyle = 'solid';
    warningDiv.style.outlineWidth = '2px';
    warningDiv.style.padding = '10px';
    for (let r of reason.reasons) {
        const warningSpan = document.createElement('li');
        warningSpan.textContent = r;
        warningSpan.style.color = 'red';
        warningSpan.style.fontWeight = 'bold';
        warningDiv.appendChild(warningSpan);
    }

    insertAfter(warningDiv, div);
}

function disable(reason) {
    let button = findButton();
    if (!button) {
        return 'could not find button element';
    }

    button.disabled = true;
    button.style.outlineColor = 'red';
    button.style.outlineStyle = 'solid';
    button.style.outlineWidth = '2px';

    let div = getExtensionDiv(button);
    div.style.outlineColor = 'red';
    div.style.outlineStyle = 'solid';
    div.style.outlineWidth = '2px';

    addReasons(div, reason);

    return 'disabled';
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        let response = disable(request.data);

        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");

        sendResponse({ data: response });
    }
);
