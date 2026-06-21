
let name = document.querySelector('.name')
let email = document.querySelector('.email')
let picture = document.querySelector('.picture')
let logout = document.querySelector('.logout')
let response = await fetch("http://localhost:3000/profile", {
    method: "GET",
    credentials: "include",

});
let { data, isLogin } = await response.json()

if (!isLogin) {
    window.location = '/'
}
else {
    name.innerText = data.name
    email.innerText = data.email
    picture.childNodes[0].src = data.picture
}


logout.addEventListener('click', async (event) => {
    let res = await fetch("http://localhost:3000/logout", {
        method: "post",
        credentials: "include",
    });
    let { msg, isLogin } = await res.json()
    if (!isLogin) {
        window.location = '/'
    }

})