const wholeTxt = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, td, span, a');
let text = getText();
let word_count = [];

const punctuation = /[^\w\s]/g;

function analyzeWords() {
    // let removePunct = text.replaceAll(punctuation, "\xa0");
    let words = RiTa.tokenize(text);
    for (let i = words.length - 1; i >= 0; i--) {

        if (RiTa.isPunct(words[i]) || words[i] === "\n") {
            continue;
        } else {
            if (word_count.length > 1) {
                let currentWord = words[i];
                let isFound = false;

                for (let j = 0; j < word_count.length; j++) { //repetition check
                    if (currentWord === word_count[j].word) {
                        word_count[j].count++;
                        isFound = true;
                        break;
                    }
                }

                if (!isFound) {
                    word_count.push({ word: words[i], count: 1 });
                }

            } else {
                word_count.push({ word: words[i], count: 1 });
            }
        }

    }
}

function sortArraybyCount() { //ascending
    word_count.sort((a, b) => (a.count > b.count) ? 1 : -1)
        // console.log(word_count);

    // while (document.body.innerHTML.match(regex)) {
    //     document.body.innerHTML = document.body.innerHTML.replace(regex, " ");
    // }
}

function rearrangeArray() {
    for (let i = 0; i < word_count.length; i++) {
        let thisword = word_count[i].word;
        if (RiTa.isStopWord(thisword)) {
            word_count[i].count = 0.9;
        }
    }

}
let isRunning = false;
let punctRemoved = false;
let index = 0;
analyzeWords();
rearrangeArray();
sortArraybyCount();

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse) {
    console.log(message.text);
    if (message.text === "button clicked") {
        isRunning = true;
        wipe();
    }
}

function wipe() {
    if (isRunning) {
        setInterval(function() {
            if (isRunning) {
                // if (!punctRemoved) {
                //     punc();
                // } else {
                changeOpacity();
                // deleteWord(word_count[index].word);
                // }
                console.log(word_count[index].word + ", " + word_count[index].count);
                index++;
                if (index >= word_count.length) {
                    isRunning = false;
                }
            }
        }, 800);
    }
}

// console.log(document.body.innerHTML);

function deleteWord(word) {
    for (let i = 0; i < wholeTxt.length; i++) {
        // console.log(wholeTxt[i].innerHTML);
        if (wholeTxt[i].innerText.includes(" " + word + " ")) {
            let placehoder = "";
            for (let j = 0; j < word.length; j++) {
                placehoder += "\xa0";
            }
            wholeTxt[i].innerText = wholeTxt[i].innerText.replace(word, placehoder);
        }
    }
}

function redden(word) {
    console.log(word);
    for (let i = 0; i < wholeTxt.length; i++) {
        // console.log(wholeTxt[i].innerHTML);
        if (wholeTxt[i].innerText.includes(" " + word + " ")) {
            let html = wholeTxt[i].innerHTML;
            wholeTxt[i].innerHTML = html.replaceAll(word, '<span style="color:red">' + word + '</span>');
        }
    }
}
const re = /(?<=\\s|^|\\b)(?:[-'.%$#&/]\\b|\\b[-'.%$#&/]|[A-Za-z0-9]|\\([A-Za-z0-9]+\\))+(?=\\s|$|\\b)/g;

function punc() {
    if (document.body.innerText.includes(",") || document.body.innerText.includes(".") ||
        document.body.innerText.includes(";") || document.body.innerText.includes("'") ||
        document.body.innerText.includes('"') || document.body.innerText.includes("!") ||
        document.body.innerText.includes("?") || document.body.innerText.includes("-") ||
        document.body.innerText.includes("“") || document.body.innerText.includes("”")
    ) {
        document.body.innerText = document.body.innerText.replace(punctuation, "\xa0");
    } else {
        punctRemoved = true;
    }
}

function changeOpacity() {
    let word = word_count[index].word;

    let opac = (word_count[index].count - 1) / 5;
    if (opac > 1) {
        opac = 1;
    }
    document.body.innerHTML = document.body.innerHTML.replaceAll(" " + word + " ", " " + '<span style="opacity:' + opac + ';">' + word + '</span>' + " ");
    // document.body.innerHTML = document.body.innerHTML.replaceAll(re, '<span style="opacity:' + opac + ';">' + re + '</span>');
    // document.body.innerHTML = document.body.innerHTML.replace(".", " ");
}

function getText() {
    return document.body.innerText;
}

function getHTML() {
    return document.body.outerHTML;
}