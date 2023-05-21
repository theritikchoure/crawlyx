let cookieModal = document.getElementById('cookie-modal');
let cookieBtn = document.getElementById('cookie-accept');

window.onload = () => {
    let cookieConsent = localStorage.getItem('cookie-accept');
    if(JSON.parse(cookieConsent)) {
        cookieModal.classList.add('hidden');
    }
}

cookieBtn.onclick = function() {
    localStorage.setItem('cookie-accept', true);
    cookieModal.classList.add('hidden');
}