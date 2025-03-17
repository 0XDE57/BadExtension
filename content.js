
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

function addReasons(div, reason) {
    let warningDiv = document.createElement('div');
    for (let r of reason.reasons) {
        const warningSpan = document.createElement('span');
        warningSpan.textContent = r;
        warningSpan.style.color = 'red';
        warningSpan.style.fontWeight = 'bold';
        warningDiv.appendChild(warningSpan);
    }
    div.appendChild(warningDiv);
}

function disable() {
    let button = findButton();
    if (button) {
        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.attributeName === 'disabled') {
                    if (button.disabled) {
                        console.log('Button is disabled');
                    } else {
                        console.log('Button is enabled');
                    }
                }
            }
        });
        //observer.observe(button, { attributes: true });

        button.disabled = true;
        button.style.outlineColor = 'red';
        button.style.outlineStyle = 'solid';
        button.style.outlineWidth = '2px';

        let div = getExtensionDiv(button);
        div.style.outlineColor = 'red';
        div.style.outlineStyle = 'solid';
        div.style.outlineWidth = '2px';

        //addReasons(div, reason);

        console.log('disabled');
    } else {
        console.log('could not find button element');
    }
}

disable();