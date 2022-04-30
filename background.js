chrome.action.onClicked.addListener(buttonClicked);
let isOn = false;

function buttonClicked(tab) {
    isOn = !isOn;

    if (isOn) {
        let message = {
            text: "button clicked"
        };
        chrome.tabs.sendMessage(tab.id, message);
        // setInterval(function() {
        //     console.log(tab.id + ", " + message.text);
        //     
        // }, 5000)
    } else {
        console.log("turned off");
    }
}

//TODO: how to stop??