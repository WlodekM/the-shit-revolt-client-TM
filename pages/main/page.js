async function fetchJSON(url, opts) {
    let resp = await fetch(url, opts);
    return await resp.json()
}

let evIDs = []
export function onload() {
    evIDs.push(stores.onChange("servers", function () {
        let sidebar = document.getElementById("serverSidebar");
        sidebar.innerHTML = ""
        stores.servers.forEach(server => {
            let elem = document.createElement('div');
            elem.classList.add("server");
            if(server.icon) {
                elem.innerHTML = `<img src="https://autumn.revolt.chat/icons/${server.icon._id}?max_side=256" title="${server.name.replaceAll("\"", "&quot;")}" alt="${server.name.replaceAll("\"", "&quot;")}" onclick="window.stores.set('currentServer', '${server._id}')">`
            } else {
                elem.innerHTML = `<div title="${server.name}" alt="${server.name} class="serverIcon">${server.name}</div>`
            }
            sidebar.appendChild(elem)
        });
    }))
    evIDs.push(stores.onChange("currentServer", function () {
        let sidebar = document.getElementById("channels");
        sidebar.innerHTML = "";
        stores.servers.find(a => a._id == stores.currentServer).categories.forEach(category => {
            let elem = document.createElement('details');
            elem.classList.add("category");
            elem.setAttribute("open", "true")
            elem.innerHTML = `<summary>${category.title}</summary>`
            category.channels.forEach(channelID => {
                const channel = stores.channels.find(a => a._id == channelID);
                if(!channel) return; // no access
                let channelElem = document.createElement("div");
                channelElem.classList.add("channelSelectOption");
                channelElem.addEventListener("click", function () {
                    stores.set("currentChannel", channelID)
                })
                channelElem.innerText = "#" + channel.name;
                elem.appendChild(channelElem)
            })
            sidebar.appendChild(elem)
        });
    }))
    evIDs.push(stores.onChange("currentChannel", async function () {
        document.getElementById("messageForm").classList.remove('disabled')
        let msgs = await fetchJSON(`https://api.revolt.chat/channels/${stores.currentChannel}/messages?include_users=true&sort=latest`, {
            headers: {
                "x-session-token": stores.token
            }
        })
        let msgArea = document.getElementById("messages");
        msgArea.innerHTML = "";
        // :+1:
        msgs.messages.reverse().forEach(msg => {
            let elem = document.createElement('div');
            elem.classList.add("message");
            let user = msgs.users.find(a => a._id == msg.author);
            elem.innerText = (user.display_name ?? user.username) + ": " + msg.content
            msgArea.appendChild(elem)
        });
    }))
}