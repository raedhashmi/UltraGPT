const output = document.querySelector('.output-text');
if (localStorage.getItem("ChatUUID4") == null) {
    ChatUUID4 = Math.random().toString(36).substring(2, 15) + "-" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("ChatUUID4", ChatUUID4);
}

async function fetchGoogleKey() {
    const res = await fetch('/resources/GOOGLE_API_KEY.txt').then(res => res.text()).then(res => res.trim());
    const apiKey = res;
    localStorage.setItem("GOOGLE_API_KEY", apiKey);
    return apiKey.trim();
};

async function fetchOpenAiKey() {
    const res = await fetch('/resources/OPENAI_API_KEY.txt').then(res => res.text()).then(res => res.trim());
    const apiKey = res;
    localStorage.setItem("OPENAI_API_KEY", apiKey);
    return apiKey.trim();
};

fetchGoogleKey();
fetchOpenAiKey();

const GOOGLE_API_KEY = localStorage.getItem("GOOGLE_API_KEY");
const OPENAI_API_KEY = localStorage.getItem("OPENAI_API_KEY");

if (GOOGLE_API_KEY == 'MISSING_KEY' || GOOGLE_API_KEY == '' || !GOOGLE_API_KEY.startsWith('AIzaSy')) {
    document.querySelector('.message-input').value = '';
    document.querySelector('.message-input').focus = false;
    document.querySelector('.missing-google-api-key-error').hidden = false;
    console.error("GOOGLE_API_KEY is incorrect");
} else if (OPENAI_API_KEY == 'MISSING_KEY' || OPENAI_API_KEY == '' || !OPENAI_API_KEY.startsWith('sk-')) {
    document.querySelector('.message-input').value = '';
    document.querySelector('.message-input').focus = false;
    document.querySelector('.missing-openai-api-key-error').hidden = false;
    console.error("OPENAI_API_KEY is incorrect");
}

const foregroundColor = getComputedStyle(document.querySelector('html')).getPropertyValue('--foreground-color').trim();
const backgroundColor = getComputedStyle(document.querySelector('html')).getPropertyValue('--background-color').trim();
const shadedColor = getComputedStyle(document.querySelector('html')).getPropertyValue('--shaded-color').trim();
const darkShadedColor = getComputedStyle(document.querySelector('html')).getPropertyValue('--dark-shaded-color').trim();
const lightShadedColor = getComputedStyle(document.querySelector('html')).getPropertyValue('--light-shaded-color').trim();
const navStartColor = getComputedStyle(document.querySelector('html')).getPropertyValue('--nav-color').trim().replace('linear-gradient(to right, ', '').replace(')', '').split(',')[0].trim();
const navEndColor = getComputedStyle(document.querySelector('html')).getPropertyValue('--nav-color').trim().replace('linear-gradient(to right, ', '').replace(')', '').split(',')[1].trim();

if (localStorage.getItem('theme') == "light") {
    document.querySelector('.attach-file-img').src = './resources/attachFileLight.png';
} else if (localStorage.getItem('theme') == "dark") {
    document.querySelector('.attach-file-img').src = './resources/attachFileDark.png';
}

if (localStorage.getItem('loggedIn') == 'true') {
    document.querySelector('.model-warning').hidden = true;
    document.querySelector('.sign-up-btn').hidden = true;
    document.querySelector('.login-btn').hidden = true;
    document.querySelector('.account-button').hidden = false;
} else if (localStorage.getItem('loggedIn') == 'false' || localStorage.getItem('loggedIn') == null) {
    localStorage.setItem('theme', 'system');
    document.querySelector('.model-warning').hidden = false;
    document.querySelector('.sign-up-btn').hidden = false;
    document.querySelector('.login-btn').hidden = false;
    document.querySelector('.account-button').hidden = true;
}

if (localStorage.getItem('ai-model') == 'gpt-4o') {
    document.querySelector('#gpt-4o').checked = true;
} else if (localStorage.getItem('ai-model') == 'gpt-4o-mini') {
    document.querySelector('#gpt-4o-mini').checked = true;
} else if (localStorage.getItem('ai-model') == 'gpt-3.5-turbo') {
    document.querySelector('#gpt-3.5-turbo').checked = true;
}

document.querySelector('.account-settings-account-panel-username-input').value = localStorage.getItem('currentUsername');
document.querySelector('.account-settings-account-panel-password-input').value = localStorage.getItem('currentPassword');

if (localStorage.getItem('theme') == 'light') {
    document.getElementById('light').checked = true;
} else if (localStorage.getItem('theme') == 'dark') {
    document.getElementById('dark').checked = true;
} else if (localStorage.getItem('theme') == 'system') {
    document.getElementById('system').checked = true;
}

if (localStorage.getItem('theme') != 'system') {
    const cssVariables = {
        '--nav-color': `linear-gradient(to right, ${localStorage.getItem('nav-start-color')}, ${localStorage.getItem('nav-end-color')})`,
        '--shaded-color': localStorage.getItem('shaded-color'),
        '--dark-shaded-color': localStorage.getItem('dark-shaded-color'),
        '--light-shaded-color': localStorage.getItem('light-shaded-color'),
        '--foreground-color': localStorage.getItem('foreground-color'),
        '--background-color': localStorage.getItem('background-color')
    };

    Object.entries(cssVariables).forEach(([property, value]) => {
        document.documentElement.style.setProperty(property, value);
    });
}

if (localStorage.getItem('theme') == 'system') {
    document.getElementById('navbar-color-start').value = navStartColor;
    document.getElementById('navbar-color-end').value = navEndColor;
    document.getElementById('foreground-color').value = foregroundColor;
    document.getElementById('background-color').value = backgroundColor;
    document.getElementById('shaded-color').value = shadedColor;
    document.getElementById('dark-shaded-color').value = darkShadedColor;
    document.getElementById('light-shaded-color').value = lightShadedColor;
} else {
    document.getElementById('navbar-color-start').value = localStorage.getItem('nav-start-color');
    document.getElementById('navbar-color-end').value = localStorage.getItem('nav-end-color');
    document.getElementById('shaded-color').value = localStorage.getItem('shaded-color');
    document.getElementById('dark-shaded-color').value = localStorage.getItem('dark-shaded-color');
    document.getElementById('light-shaded-color').value = localStorage.getItem('light-shaded-color');
    document.getElementById('foreground-color').value = localStorage.getItem('foreground-color');
    document.getElementById('background-color').value = localStorage.getItem('background-color');
    
}

function createTheme() {
    localStorage.setItem('nav-start-color', document.getElementById('navbar-color-start').value);
    localStorage.setItem('nav-end-color', document.getElementById('navbar-color-end').value);
    localStorage.setItem('shaded-color', document.getElementById('shaded-color').value);
    localStorage.setItem('dark-shaded-color', document.getElementById('dark-shaded-color').value);
    localStorage.setItem('light-shaded-color', document.getElementById('light-shaded-color').value);
    localStorage.setItem('foreground-color', document.getElementById('foreground-color').value);
    localStorage.setItem('background-color', document.getElementById('background-color').value);

    const navStartColorInput = document.getElementById('navbar-color-start').value;
    const navEndColorInput = document.getElementById('navbar-color-end').value;
    const shadedColorInput = document.getElementById('shaded-color').value;
    const darkShadedColorInput = document.getElementById('dark-shaded-color').value;
    const lightShadedColorInput = document.getElementById('light-shaded-color').value;
    const foregroundColorInput = document.getElementById('foreground-color').value;
    const backgroundColorInput = document.getElementById('background-color').value;

    const cssVariables = {
        '--nav-color': `linear-gradient(to right, ${navStartColorInput}, ${navEndColorInput})`,
        '--shaded-color': shadedColorInput,
        '--dark-shaded-color': darkShadedColorInput, 
        '--light-shaded-color': lightShadedColorInput,
        '--foreground-color': foregroundColorInput,
        '--background-color': backgroundColorInput,
    };

    Object.entries(cssVariables).forEach(([property, value]) => {
        document.documentElement.style.setProperty(property, value);
    });
}

function applyTheme() {
    if (document.getElementById('light').checked) {
        // Light theme preset values
        localStorage.setItem('nav-start-color', '#994700');
        localStorage.setItem('nav-end-color', '#3a1b00');
        localStorage.setItem('shaded-color', '#cecece');
        localStorage.setItem('dark-shaded-color', '#6a6a6a');
        localStorage.setItem('light-shaded-color', '#dfdfdf');
        localStorage.setItem('foreground-color', '#000000');
        localStorage.setItem('background-color', '#ffffff');
        localStorage.setItem('theme', 'light');
    } else if (document.getElementById('dark').checked) {
        // Dark theme preset values
        localStorage.setItem('nav-start-color', '#8f4300');
        localStorage.setItem('nav-end-color', '#381a00');
        localStorage.setItem('shaded-color', '#0c0c0c');
        localStorage.setItem('dark-shaded-color', '#080808');
        localStorage.setItem('light-shaded-color', '#2f2f2f');
        localStorage.setItem('foreground-color', '#ffffff');
        localStorage.setItem('background-color', '#000000');
        localStorage.setItem('theme', 'dark');
    } else if (document.getElementById('system').checked) {
        // System theme preset values
        localStorage.setItem('nav-start-color', navStartColor);
        localStorage.setItem('nav-end-color', navEndColor);
        localStorage.setItem('shaded-color', shadedColor);
        localStorage.setItem('dark-shaded-color', darkShadedColor);
        localStorage.setItem('light-shaded-color', lightShadedColor);
        localStorage.setItem('foreground-color', foregroundColor);
        localStorage.setItem('background-color', backgroundColor);
        localStorage.setItem('theme', 'system');
    }

    if (localStorage.getItem('theme') != 'system') {
        const cssVariables = {
            '--nav-color': `linear-gradient(to right, ${localStorage.getItem('nav-start-color')}, ${localStorage.getItem('nav-end-color')})`,
            '--shaded-color': localStorage.getItem('shaded-color'),
            '--dark-shaded-color': localStorage.getItem('dark-shaded-color'),
            '--light-shaded-color': localStorage.getItem('light-shaded-color'),
            '--foreground-color': localStorage.getItem('foreground-color'),
            '--background-color': localStorage.getItem('background-color')
        };
    
        Object.entries(cssVariables).forEach(([property, value]) => {
            document.documentElement.style.setProperty(property, value);
        });
    } else {
        if (getComputedStyle(document.querySelector('html')).getPropertyValue('--nav-color') == 'linear-gradient(to right, #994700, #3a1b00)') {
            localStorage.removeItem('nav-start-color');
            localStorage.removeItem('nav-end-color');
        } else if (getComputedStyle(document.querySelector('html')).getPropertyValue('--nav-color') == 'linear-gradient(to right, #8f4300, #381a00)') {
            localStorage.removeItem('nav-start-color');
            localStorage.removeItem('nav-end-color');
        }
        localStorage.removeItem('shaded-color');
        localStorage.removeItem('dark-shaded-color');
        localStorage.removeItem('light-shaded-color');
        localStorage.removeItem('foreground-color');
        localStorage.removeItem('background-color');
    }
}

function updateModel() {
    let gpt4oRadio = document.getElementById('gpt-4o');
    let gpt4oMiniRadio = document.getElementById('gpt-4o-mini');
    let gpt35TurboRadio = document.getElementById('gpt-3.5-turbo');

    if (gpt4oRadio.checked) { 
        localStorage.setItem('ai-model', 'gpt-4o');
    } else if (gpt4oMiniRadio.checked) {
        localStorage.setItem('ai-model', 'gpt-4o-mini');
    } else if (gpt35TurboRadio.checked) {
        localStorage.setItem('ai-model', 'gpt-3.5-turbo');
    }
}

function updateAccountSettings() {
    const oldUsername = localStorage.getItem('currentUsername');
    const oldPassword = localStorage.getItem('currentPassword');

    const newUsername = document.querySelector('.account-settings-account-panel-username-input').value;
    const newPassword = document.querySelector('.account-settings-account-panel-password-input').value;

    if (!newUsername || !newPassword) {
        console.error('New username or password is empty');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if new username already exists for a different user
    const usernameExists = users.some(user => 
        user.username === newUsername && 
        user.username !== oldUsername
    );

    if (usernameExists) {
        console.error('Username already taken');
        return;
    }

    const userIndex = users.findIndex(user => 
        user.username === oldUsername && 
        user.password === oldPassword
    );

    if (userIndex !== -1) {
        users[userIndex].username = newUsername;
        users[userIndex].password = newPassword;
        
        localStorage.setItem('currentUsername', newUsername);
        localStorage.setItem('currentPassword', newPassword);
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Account settings updated successfully');
    } else {
        console.error('Current user not found');
    }
}

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'r') {
        event.preventDefault(); // Prevent the default action
        location.reload(); // Reload the page
    }
});

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'q') {
        blackScreen = document.createElement('div');
        blackScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: black;
            z-index: 100;
            animation: fadeIn 0.6s ease-in-out;
        `;
        document.body.appendChild(blackScreen);
        setTimeout(() => {
                fetch('/closeApp', {
                method: 'POST'
            }).then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('Application closed successfully.');
                } else {
                    console.error('Failed to close the application.');
                }
            })
            .catch(error => console.error('Error closing the application:', error));
            setTimeout(() => {
                window.location.reload();
            }, 1500)
        }, 600)
    }
});

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
    const chatArea = document.querySelector('.chat-area');
    chatArea.innerHTML += `
        <div class="user-message-box">
            <p class="user-avatar"><img class="user-pfp" src="./resources/userPfp.png" style="height: 34px; margin-left: -10px;"></p>
            <p class="user-box-text" style="margin: 0px; margin-right: 38px; margin-top: -32px; border-radius: 9px;">${prompt}</p>
        </div>
        <br><br><br><br>
    `;
    chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: 'smooth' });
    chatArea.hidden = false;

    // Add placeholder for AI response and keep a reference
    const aiDiv = document.createElement('div');
    aiDiv.className = 'chat-output-box';
    aiDiv.innerHTML = `
        <p class="chat-output-logo"><img src="./resources/favicon.ico" style="height: 34px; margin-left: -10px;"></p>
        <p class="chat-output-text">⬤</p>
    `;
    chatArea.appendChild(aiDiv);
    const outputText = aiDiv.querySelector('.chat-output-text');
    chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: 'smooth' });

    // Disable input while waiting
    const input = document.querySelector('.message-input');
    input.disabled = true;
    input.style.backgroundColor = "#282828";
    input.style.cursor = "not-allowed";
    outputText.style.animation = 'showHide 1s infinite ease-in-out';
    outputText.innerHTML = '⬤'; // Show blinking cursor while waiting for first chunk

    let response = '';
    try {
        // Choose model based on login status
        const loggedIn = localStorage.getItem('loggedIn') == 'true' ? 'true' : 'false';
        const ai_model = localStorage.getItem('ai-model') || 'gpt-4o-mini';

        const fetchResponse = await fetch('/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, loggedIn, ai_model }),
        });

        
        // Use streaming instead:
        outputText.style.animation = 'none';
        if (!fetchResponse.body || !window.ReadableStream) {
            // Fallback: not a stream, just get text
            let text = await fetchResponse.text();
            response += text;
            let formatted = response.replace(/\*' '\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
            outputText.innerHTML = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
            chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: 'smooth' });
        } else {
            let firstChunk = true;
            const reader = fetchResponse.body.getReader();
            const decoder = new TextDecoder();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                let text = decoder.decode(value, { stream: true });
                if (text.startsWith('AI: ')) text = text.slice(4);
                response += text;
                if (text && text.trim()) {
                    console.log('[AI Streamed chunk]', text);
                }
                let formatted = response.replace(/\*' '\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
                // Add blinking cursor (⬤) at the end, keep animation during streaming
                outputText.innerHTML = formatted.replace(/`([^`]+)`/g, '<code>$1</code>') + '<span class="blinking-cursor" style="animation: showHide 1s infinite ease-in-out;">⬤</span>';
                if (firstChunk) {
                    outputText.style.animation = 'none'; // Remove old animation from the p
                    firstChunk = false;
                }
                chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: 'smooth' });
            }
            // Remove blinking cursor after streaming is done
            outputText.innerHTML = outputText.innerHTML.replace(/<span class="blinking-cursor"[^>]*>⬤<\/span>$/, '');
        }
        // Save chat history
        localStorage.setItem(`${localStorage.getItem("ChatUUID4")}_chat_history`, chatArea.innerHTML);
    } catch (error) {
        outputText.innerHTML = `<span style=\"color:red;\">Error: Failed to get response. Error ${error}</span>`;
        console.error('AI chat error:', error);
    } finally {
        input.disabled = false;
        input.style.backgroundColor = "var(--background-color)";
        input.style.cursor = "text";
        input.value = '';
    }
}

function replaceGoogleApiKey() {
    const apiKey = document.querySelector('.missing-google-api-key-error-input-box').value;
    if (apiKey.startsWith("AIzaSy") && !apiKey.includes(" ") && apiKey.length >= 39) {
        localStorage.setItem('GOOGLE_API_KEY', apiKey)
        setTimeout(async () => {
            await fetch('/setGoogleApiKey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ apiKey: apiKey }),
            }).then(res => {
                if (res.ok) {
                    document.querySelector('.missing-google-api-key-error').hidden = true;
                    document.querySelector('.missing-google-api-key-error-input-box').value = '';
                    alert('Sucessfully set Google API Key');
                    window.location.reload()
                } else {
                    document.querySelector('.missing-google-api-key-error-box').innerHTML = `
                        <div class="missing-google-api-key-error-box">
                            <h1 class="missing-google-api-key-error-heading">There is an error in your code</h1>
                            <p class="missing-google-api-key-error-text">The GOOGLE_API_KEY is undefined go to <a href="https://aistudio.google.com/u/1/apikey" ,="" target="_blank">Google AI Studio</a>, Sign Up and login then create your GOOGLE_API_KEY and insert it below: </p>
                            <p style="color: red; font-size: 10px; transform: translate(4.5%, 150%); position: relative; left: -13px; margin-top: -20px;">Sorry, could not set key. Try again later</p>
                            <input type="text" class="missing-google-api-key-error-input-box" placeholder="Your GOOGLE_API_KEY">
                            <button class="missing-google-api-key-error-button" onclick="replaceGoogleApiKey();">Submit key</button>
                        </div>`
                }
            });
            
            document.querySelector('.missing-google-api-key-error').hidden = true;
            document.querySelector('.missing-google-api-key-error-input-box').value = '';
        }, 0);
    } else {
        document.querySelector('.missing-google-api-key-error-box').innerHTML = `
            <div class="missing-google-api-key-error-box">
                <h1 class="missing-google-api-key-error-heading">There is an error in your code</h1>
                <p class="missing-google-api-key-error-text">The GOOGLE_API_KEY is undefined go to <a href="https://aistudio.google.com/u/1/apikey" ,="" target="_blank">Google AI Studio</a>, Sign Up and login then create your GOOGLE_API_KEY and insert it below: </p>
                <p style="color: red; font-size: 10px; transform: translate(4.5%, 150%); position: relative; left: -13px; margin-top: -20px;">Invalid API Key</p>
                <input type="text" class="missing-google-api-key-error-input-box" placeholder="Your GOOGLE_API_KEY">
                <button class="missing-google-api-key-error-button" onclick="replaceGoogleApiKey();">Submit key</button>
            </div>`
    }
}

function replaceOpenAiApiKey() {
    const apiKey = document.querySelector('.missing-openai-api-key-error-input-box').value;
    if (apiKey.startsWith("sk-") && !apiKey.includes(" ")) {
        localStorage.setItem('OPENAI_API_KEY', apiKey)
        setTimeout(async () => {
            await fetch('/setOpenAiApiKey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ apiKey: apiKey }),
            }).then(res => {
                if (res.ok) {
                    document.querySelector('.missing-openai-api-key-error').hidden = true;
                    document.querySelector('.missing-openai-api-key-error-input-box').value = '';
                    alert('Sucessfully set OpenAI API Key');
                    window.location.reload()
                } else {
                    document.querySelector('.missing-openai-api-key-error-box').innerHTML = `
                        <div class="missing-openai-api-key-error-box">
                            <h1 class="missing-openai-api-key-error-heading">There is an error in your code</h1>
                            <p class="missing-openai-api-key-error-text">The OPENAI_API_KEY is undefined go to <a href="https://platform.openai.com/api-keys" ,="" target="_blank">OpenAI</a>, Sign Up and login then create your OPENAI_API_KEY and insert it below: </p>
                            <p style="color: red; font-size: 10px; transform: translate(4.5%, 150%); position: relative; left: -13px; margin-top: -20px;">Sorry, could not set key. Try again later</p>
                            <input type="text" class="missing-openai-api-key-error-input-box" placeholder="Your OPENAI_API_KEY">
                            <button class="missing-openai-api-key-error-button" onclick="replaceOpenAiApiKey();">Submit key</button>
                        </div>`
                }
            });
            
            document.querySelector('.missing-openai-api-key-error').hidden = true;
            document.querySelector('.missing-openai-api-key-error-input-box').value = '';
        }, 0);
    } else {
        document.querySelector('.missing-openai-api-key-error-box').innerHTML = `
            <div class="missing-openai-api-key-error-box">
                <h1 class="missing-openai-api-key-error-heading">There is an error in your code</h1>
                <p class="missing-openai-api-key-error-text">The OPENAI_API_KEY is undefined go to <a href="https://platform.openai.com/api-keys" ,="" target="_blank">OpenAI</a>, Sign Up and login then create your OPENAI_API_KEY and insert it below: </p>
                <p style="color: red; font-size: 10px; transform: translate(4.5%, 150%); position: relative; left: -13px; margin-top: -20px;">Invalid API Key</p>
                <input type="text" class="missing-openai-api-key-error-input-box" placeholder="Your OPENAI_API_KEY">
                <button class="missing-openai-api-key-error-button" onclick="replaceOpenAiApiKey();">Submit key</button>
            </div>`
    }
}

function checkChatURL() {
    if (!window.location.href.includes(`/index?chat=${localStorage.getItem('ChatUUID4')}`)) {
        window.location.href = `/notfound`;
        console.log('Invalid ChatUUID4, redirecting to notfound');
    } else if (window.location.href.includes(`/index?chat=${localStorage.getItem('ChatUUID4')}`))
        console.log('Valid ChatUUID4, proceeding with chat history loading');
        if (localStorage.getItem(`${localStorage.getItem("ChatUUID4")}_chat_history`) != null) {
            document.querySelector('.chat-area').innerHTML = localStorage.getItem(`${localStorage.getItem("ChatUUID4")}_chat_history`);
            document.querySelector('.suggestions-container').hidden = true;
            if (localStorage.getItem('loggedIn') == 'true') {
                document.querySelector('.model-warning').hidden = true;
            } else if (localStorage.getItem('loggedIn') == 'false') {
                document.querySelector('.model-warning').hidden = false;
            }
            document.querySelector('.chat-area').scrollTo({ top: document.querySelector('.chat-area').scrollHeight, behavior: 'smooth' });
        } else {
            document.querySelector('.chat-area').hidden = true;
            document.querySelector('.suggestions-container').hidden = false;
        }
}