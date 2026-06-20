let button = document.querySelector("button");

const clientId = "475216737217-nv9trlpu0q8qliqnp29kbjne3iupulva.apps.googleusercontent.com";
const redirectUrl = "http://127.0.0.1:5500/callback.html";

button.addEventListener("click", (event) => {
    window.open(
        `https://accounts.google.com/o/oauth2/v2/auth?response_type=id_token&nonce=123devin&client_id=${clientId}&scope=openid email profile&redirect_uri=${redirectUrl}`,
        "loginPopup",
        "width=500 height=500",
    );
});

window.addEventListener("message", async (e) => {
    let { isLogin } = e.data
    console.log(isLogin);
    if (isLogin) {
        console.log('profile pay jao');
        window.location = '/profile'
    }
    else {
        console.log('Home pay jao')
        let p = document.createElement('p')
        p.innerText = 'Something Went Wrong'
        document.body.appendChild(p);
        setTimeout(() => {
            p.remove()
        }, 2000)
    }
});
