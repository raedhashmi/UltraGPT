const signupform = document.querySelector('.signup-form');
const signupbox = document.querySelector('.signup-box');
const errorbox = document.querySelector('.error-box');
const errorboxtext = document.querySelector('.error-box-text')
const signupButton = document.querySelector('.signup-button');
const username = document.querySelector('.signup-box-username-input');
const password = document.querySelector('.signup-box-password-input');
if (localStorage.getItem('users') == null || localStorage.getItem('users') == "[object Object]")
    localStorage.setItem('users', '[]')

let users = JSON.parse(localStorage.getItem('users'));

function signUp() {    
    if (username.value == '' || password.value == '') {
        errorbox.hidden = false;
        signupbox.style.height = '55%';
        console.error('Username or password is empty');
    } else if (username.value != '' && password.value != '') {
        users = [...users, { username: username.value, password: password.value, ChatUUID: Math.random().toString(36).substring(2, 15) + "-" + Math.random().toString(36).substring(2, 15) }];
        localStorage.setItem('users', JSON.stringify(users));
    } 
    
    for (i = 0; i < i+1; i++) {
        setTimeout(() => {
            for (j = 0; j < users.length; j++) {
                if (users[j].username.includes(username.value)) {
                    localStorage.setItem('usernameTaken', 'true');
                } else if (!users[j].username.includes(username.value)) {
                    localStorage.setItem('usernameTaken', 'false');
                }
            }
            console.log(i)
        }, 1000);`                                                                                                                                                                                                                                                                                          `
    }
    

    if (localStorage.getItem('usernameTaken') == 'true') {
        errorbox.hidden = false;
        signupbox.style.height = '55%';
        errorboxtext.innerText = 'Username already taken';
        console.error('Username already taken');
    } else {
        errorbox.hidden = false;
        signupButton.innerText = '';
        signupButton.style.animation = "expand 0.8s linear";
        setTimeout(() => {
            window.location.href = '/login';
        }, 700);
    }
}

function checkChatURL() {
    if (window.location.pathname != `/${localStorage.getItem("ChatUUID4")}` && window.location.pathname != `/login` && window.location.pathname != `/signUp`) {
        window.location.href = `/notfound`;
    }
}