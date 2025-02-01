const output = document.querySelector('.output-text');
if (localStorage.getItem("ChatUUID4") == null) {
    ChatUUID4 = Math.random().toString(36).substring(2, 15) + "-" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("ChatUUID4", ChatUUID4);
}

async function fetchKey() {
    const res = await fetch('/resources/GOOGLE_API_KEY.txt').then(res => res.text()).then(res => res.trim());
    const apiKey = res;
    localStorage.setItem("GOOGLE_API_KEY", apiKey);
    return apiKey.trim();
};

const FETCHED_GOOGLE_API_KEY = fetchKey();
const GOOGLE_API_KEY = localStorage.getItem("GOOGLE_API_KEY");
if (GOOGLE_API_KEY == 'MISSING_KEY' || GOOGLE_API_KEY == '' || !GOOGLE_API_KEY.startsWith('AIzaSy')) {
    document.querySelector('.message-input').value = '';
    document.querySelector('.message-input').focus = false;
    document.querySelector('.missing-api-key-error').hidden = false;
    console.error("GOOGLE_API_KEY is incorrect");
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

    if (GOOGLE_API_KEY == 'MISSING_KEY' || GOOGLE_API_KEY == '' || !GOOGLE_API_KEY.startsWith('AIzaSy')) {
        document.querySelector('.message-input').value = '';
        document.querySelector('.message-input').focus = false;
        document.querySelector('.missing-api-key-error').hidden = false;
        console.error("GOOGLE_API_KEY is incorrect");
    } else if (GOOGLE_API_KEY != 'MISSING_KEY' && GOOGLE_API_KEY != '' && GOOGLE_API_KEY.startsWith('AIzaSy')) {
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
}

function replaceApiKey() {
    const apiKey = document.querySelector('.missing-api-key-error-input-box').value;
    if (apiKey.startsWith("AIzaSy") && !apiKey.includes(" ")) {
        localStorage.setItem('GOOGLE_API_KEY', apiKey)
        setTimeout(async () => {
            await fetch('/setApiKey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ apiKey: apiKey}),
            }).then(res => {
                if (res.ok) {
                    document.querySelector('.missing-api-key-error').hidden = true;
                    document.querySelector('.missing-api-key-error-input-box').value = '';
                    alert('Sucessfully set API Key');
                    window.location.reload()
                    window.location.reload()
                } else {
                    document.querySelector('.missing-api-key-error-box').innerHTML = `
                        <div class="missing-api-key-error-box">
                            <h1 class="missing-api-key-error-heading">There is an error in your code</h1>
                            <p class="missing-api-key-error-text">The GOOGLE_API_KEY is undefined go to <a href="https://aistudio.google.com/u/1/apikey" ,="" target="_blank">Google AI Studio</a>, Sign Up and login then create your GOOGLE_API_KEY and insert it below: </p>
                            <p style="color: red; font-size: 10px; transform: translate(4.5%, 150%); position: relative; left: -13px; margin-top: -20px;">Sorry, could not set key. Try again later</p>
                            <input type="text" class="missing-api-key-error-input-box" placeholder="Your GOOGLE_API_KEY">
                            <button class="missing-api-key-error-button" onclick="replaceApiKey();">Submit key</button>
                        </div>`
                }
            });
            
            document.querySelector('.missing-api-key-error').hidden = true;
            document.querySelector('.missing-api-key-error-input-box').value = '';
        }, 0);
    } else {
        document.querySelector('.missing-api-key-error-box').innerHTML = `
            <div class="missing-api-key-error-box">
                <h1 class="missing-api-key-error-heading">There is an error in your code</h1>
                <p class="missing-api-key-error-text">The GOOGLE_API_KEY is undefined go to <a href="https://aistudio.google.com/u/1/apikey" ,="" target="_blank">Google AI Studio</a>, Sign Up and login then create your GOOGLE_API_KEY and insert it below: </p>
                <p style="color: red; font-size: 10px; transform: translate(4.5%, 150%); position: relative; left: -13px; margin-top: -20px;">Invalid API Key</p>
                <input type="text" class="missing-api-key-error-input-box" placeholder="Your GOOGLE_API_KEY">
                <button class="missing-api-key-error-button" onclick="replaceApiKey();">Submit key</button>
            </div>`
    }
    
}

function checkChatURL() {
    if (window.location.pathname != `/${localStorage.getItem("ChatUUID4")}`) {
        window.location.href = `/notfound`;
    } else if (window.location.pathname == `/${localStorage.getItem("ChatUUID4")}`)
        if (localStorage.getItem(`${localStorage.getItem("ChatUUID4")}_chat_history`) != null) {
            document.querySelector('.chat-area').innerHTML = localStorage.getItem(`${localStorage.getItem("ChatUUID4")}_chat_history`);
            document.querySelector('.suggestions-container').hidden = true;
            document.querySelector('.chat-area').scrollTo({ top: document.querySelector('.chat-area').scrollHeight, behavior: 'smooth' });
        } else {
            document.querySelector('.chat-area').hidden = true;
            document.querySelector('.suggestions-container').hidden = false;
        }
}