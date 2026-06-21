
window.onload = function () {
    google.accounts.id.initialize({
        client_id: "475216737217-nv9trlpu0q8qliqnp29kbjne3iupulva.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        { theme: "outline", size: "large", text: "signin_with" }
    )

    google.accounts.id.prompt();
};

function handleCredentialResponse(response) {
    console.log(response);

    // fetch('http://localhost:5000/api/auth/google', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ token: response.credential })
    // })
    //     .then(res => res.json())
    //     .then(data => {
    //         console.log("Backend se response aaya:", data);
    //         alert(`Hello ${data.user.name}, Login Successful!`);
    //     })
    //     .catch(err => console.error("Error:", err));
}