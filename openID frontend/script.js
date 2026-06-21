const clientId = "475216737217-nv9trlpu0q8qliqnp29kbjne3iupulva.apps.googleusercontent.com";

window.onload = function () {
    google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,

    });

    google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        { theme: "outline", size: "large", text: "signin_with" }
    )
    google.accounts.id.prompt();
};




async function handleCredentialResponse(response) {

    let id_token = response.credential
    let res = await fetch(`http://localhost:3000/get-id-token`, {
        method: "post",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id_token })
    })

    let { msg, isLogin } = await res.json()
    console.log(isLogin)
    if (isLogin) {
        window.location = '/profile'
    }
    else {
        let p = document.createElement('p')
        p.innerText = 'Something Went Wrong'
        document.body.appendChild(p);
        setTimeout(() => {
            p.remove()
        }, 2000)
    }

}

