
let id_token = new URLSearchParams(location.hash).get('id_token')

if (id_token) {
    let res = await fetch(`http://127.0.0.1:3000/get-id-token`, {
        method: "post",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id_token })
    })

    let { msg, isLogin } = await res.json()
    window.opener.postMessage({ isLogin })
    window.close()

}
