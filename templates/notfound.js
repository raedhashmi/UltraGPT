document.querySelector('.existing-chat-button').addEventListener('click', () => {
    document.querySelector('.existing-chat-button').innerText = '';
    document.querySelector('.existing-chat-button').style.animation = "expand 0.8s linear";
    setTimeout(() => {
        if (localStorage.getItem('ChatUUID4') != null) {
            window.location.href = `/${localStorage.getItem('ChatUUID4')}`;
        } else {
            ChatUUID4 = Math.random().toString(36).substring(2, 15) + "-" + Math.random().toString(36).substring(2, 15);
            localStorage.setItem("ChatUUID4", ChatUUID4);
        }
    }, 700);
});
