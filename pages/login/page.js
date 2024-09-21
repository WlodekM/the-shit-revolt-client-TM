async function fetchJSON(url, opts) {
    let resp = await fetch(url, opts);
    return await resp.json()
}

export function onload() {
    document.getElementById("loginForm").addEventListener("submit", async function (ev) {
        ev.preventDefault();
        // console.log(document.getElementById("token").value)
        stores.set("token", document.getElementById("token").value)
        let me = await fetchJSON('https://api.revolt.chat/users/@me', {
            headers: {
                "x-session-token": stores.token
            }
        })
        stores.set("user", me)
        stores.set("ws", new WebSocket("wss://ws.revolt.chat/"))
        stores.ws.onopen = function () {
            stores.ws.send(JSON.stringify({type: "Authenticate", token: stores.token}))
        }
        stores.ws.onmessage = function (ev) {
            let data = JSON.parse(ev.data)
            console.log(data)
            switch (data.type) {
                case "Ready":
                    stores.set("servers", data.servers)
                    stores.set("channels", data.channels)
                    break;
            
                default:
                    break;
            }
        }
        stores.set("loggedIn", true)
        pages.goToPage("main")
    })
}