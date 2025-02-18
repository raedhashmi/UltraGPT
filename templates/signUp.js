const signupform = document.querySelector('.signup-form');
const signupbox = document.querySelector('.signup-box');
const errorbox = document.querySelector('.error-box');
const errorboxtext = document.querySelector('.error-box-text')
const signupButton = document.querySelector('.signup-button');
const username = document.querySelector('.signup-box-username-input');
const password = document.querySelector('.signup-box-password-input');
if (localStorage.getItem('users') == null || localStorage.getItem('users') == "[object Object]")
    localStorage.setItem('users', '[]')

let users = JSON.parse(localStorage.getItem('users') || '[]');

function signUp() {    
    if (username.value === '' || password.value === '') {
        errorbox.hidden = false;
        signupbox.style.height = '55%';
        errorboxtext.innerText = 'Username or password is empty';
        console.error('Username or password is empty');
        return;
    }

    // Get latest users array from localStorage
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if username already exists
    const userExists = users.some(user => user.username === username.value);
    
    if (userExists) {
        errorbox.hidden = false;
        signupbox.style.height = '55%';
        errorboxtext.innerText = 'Username already taken';
        console.error('Username already taken');
        return;
    }

    // Add new user
    const newUser = {
        username: username.value,
        password: password.value,
        ChatUUID: Math.random().toString(36).substring(2, 15) + "-" + Math.random().toString(36).substring(2, 15)
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    localStorage.setItem('currentUsername', username.value);
    localStorage.setItem('currentPassword', password.value);

    // Show success animation and redirect
    errorbox.hidden = true;
    console.log("User created successfully");
    signupButton.innerText = '';
    signupButton.style.animation = "expand 0.8s linear";
    setTimeout(() => {
        window.location.href = '/login';
    }, 700);
}

function checkChatURL() {
    if (window.location.pathname != `/${localStorage.getItem("ChatUUID4")}` && window.location.pathname != `/login` && window.location.pathname != `/signUp`) {
        window.location.href = `/notfound`;
    }
}