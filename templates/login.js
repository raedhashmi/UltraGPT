const loginform = document.querySelector('.login-form');
const loginbox = document.querySelector('.login-box');
const errorbox = document.querySelector('.error-box');
const username = document.querySelector('.login-box-username-input');
const password = document.querySelector('.login-box-password-input');
const loginButton = document.querySelector('.login-button');
const users = JSON.parse(localStorage.getItem('users'));

function login() {
    event.preventDefault();
    errorbox.hidden = true;
    const loginUsername = username.value;
    const loginPassword = password.value;
    const user = users.find(user => user.username === loginUsername && user.password === loginPassword);
    if (user) {
        localStorage.setItem('ChatUUID4', user.chatUUID);
        localStorage.setItem(`${user.chatUUID}_chat_history`, JSON.stringify([]));
        window.location.href = `/${user.chatUUID}`;
    } else {
        errorbox.hidden = false;
        loginbox.style.height = '55%';
    }
}