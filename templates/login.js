const loginform = document.querySelector('.login-form');
const loginbox = document.querySelector('.login-box');
const errorbox = document.querySelector('.error-box');
const errorboxtext = document.querySelector('.error-box-text');
const username = document.querySelector('.login-box-username-input');
const password = document.querySelector('.login-box-password-input');
const loginButton = document.querySelector('.login-button');

function login() {
    event.preventDefault();
    
    // Get latest users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const loginUsername = username.value;
    const loginPassword = password.value;

    // Check for empty fields
    if (!loginUsername || !loginPassword) {
        errorbox.hidden = false;
        errorboxtext.innerText = 'Please enter both username and password';
        loginbox.style.height = '55%';
        localStorage.setItem('loggedIn', 'false');
        return;
    }

    const user = users.find(user => user.username === loginUsername && user.password === loginPassword);
    
    if (user) {
        // Store user's ChatUUID (note the capitalization matches signup.js)
        localStorage.setItem('ChatUUID4', user.ChatUUID);
        
        // Redirect to chat page
        window.location.href = `/${user.ChatUUID}`;
        localStorage.setItem('loggedIn', 'true');
    } else {
        errorbox.hidden = false;
        errorboxtext.innerText = 'Invalid username or password';
        loginbox.style.height = '55%';
        localStorage.setItem('loggedIn', 'false');
    }
}

function checkChatURL() {
    if (window.location.pathname != `/${localStorage.getItem("ChatUUID4")}` && window.location.pathname != `/login` && window.location.pathname != `/signUp`) {
        window.location.href = `/notfound`;
    }
}