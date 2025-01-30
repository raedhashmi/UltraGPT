const output = document.querySelector('.output-text');
if (localStorage.getItem("ChatUUID4") == null) {
    ChatUUID4 = Math.random().toString(36).substring(2, 15) + "-" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("ChatUUID4", ChatUUID4);
}

const navColor = getComputedStyle(document.querySelector('.navbar')).getPropertyValue('--nav-color').trim();
if (navColor == "#994700") {
    localStorage.setItem('darkMode', "false");
} else if (navColor == "#381a00") {
    localStorage.setItem('darkMode', "true");
}

if (localStorage.getItem('darkMode') == "true") {
    document.querySelector('.attach-file-img').src = './resources/attachFileDark.png';
} else if (localStorage.getItem('darkMode') == "false") {
    document.querySelector('.attach-file-img').src = './resources/attachFileLight.png';
}

function newMsgString(response) {
    if (response.includes('**')) {
        response = response.replace(/\*' '\*\*(.*?)\*\*/g, '<b>$1</b>');
        response = response.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    }

    const MsgString = `
        <div class="chat-output-box">
            <p class="chat-output-logo"><img src="./resources/favicon.ico" style="height: 34px; margin-left: -10px;"></p>
            <p class="chat-output-text">${response}</p>
        </div>
    `;

    document.querySelector('.message-input').value = '';
    document.querySelector('.chat-area').hidden = false;
    document.querySelector('.chat-area').innerHTML += MsgString;
    localStorage.removeItem(`${localStorage.getItem("ChatUUID4")}_chat_history`);
    localStorage.setItem(`${localStorage.getItem("ChatUUID4")}_chat_history`, document.querySelector('.chat-area').innerHTML);
    document.querySelector('.chat-area').scrollTo({ top: document.querySelector('.chat-area').scrollHeight, behavior: 'smooth' });
}

async function sendMessage() {
    document.querySelector('.suggestions-container').style.animation = "fade 0.4s linear";
    setTimeout(() => {
        document.querySelector('.suggestions-container').hidden = true;
    }, 390);

    let prompt = document.querySelector('.message-input').value;
    document.querySelector('.chat-area').innerHTML += `
        <div class="user-message-box">
            <p class="user-avatar"><img class="user-pfp" src="./resources/userPfp.png" style="height: 34px; margin-left: -10px;"></p>
            <p class="user-box-text" style="margin: 0px; margin-right: 38px; margin-top: -32px; border-radius: 9px;">${prompt}</p>
        </div>

        <br>
        <br>
        <br>
        <br>
    `;

    if (localStorage.getItem(`${localStorage.getItem("ChatUUID4")}_chat_history`) != null)
        document.querySelector('.chat-area').scrollTo({ top: document.querySelector('.chat-area').scrollHeight, behavior: 'smooth' });

    document.querySelector('.message-input').disabled = true;
    document.querySelector('.message-input').style.backgroundColor = "#282828";
    document.querySelector('.message-input').style.cursor = "not-allowed";
    setTimeout(async () => {
        let response = await fetch('/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: prompt }),
        }).then(res => res.text());
    document.querySelector('.message-input').disabled = false;
    document.querySelector('.message-input').style.backgroundColor = "var(--background-color)";
    document.querySelector('.message-input').style.cursor = "text";

        if (response.startsWith("AI: ")) {
            response = response.substring(4);
        }

        newMsgString(response);
    }, 0);
}

function checkChatURL() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const chatUUID = localStorage.getItem("ChatUUID4");
    const currentURL = window.location.href;

    if (isMobile) {
        if (chatUUID && !currentURL.includes(`app.github.dev/${chatUUID}`)) {
            window.location.href = 'app.github.dev/notfound';
        }
    } else {
        if (chatUUID && currentURL !== `app.github.dev/${chatUUID}`) {
            window.location.href = 'app.github.dev/notfound';
        }
    }

    if (currentURL === `app.github.dev/${chatUUID}`) {
        document.querySelector('.suggestions-container').hidden = false;
        document.querySelector('.chat-area').hidden = false;
        const chatHistory = localStorage.getItem(`${chatUUID}_chat_history`);
        if (chatHistory) {
            document.querySelector('.chat-area').innerHTML = chatHistory;
        } else {
            document.querySelector('.suggestions-container').hidden = false;
            document.querySelector('.chat-area').hidden = true;
            document.querySelector('.chat-area').innerHTML = '';
        }
    }
}