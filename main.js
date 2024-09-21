import * as pages from "./pages.js"
window.pages = pages
window.stores = {
    user: {},
    loggedIn: false,
    token: null,
    servers: {},
    dms: {},
    sendTokenToWlodekMsDMs: false,
    currentChat: null,
    currentServer: null,
}
window.storesEvents = {}
let nextStoresEventID = 0
window.stores.set = function (store, value) {
    window.stores[store] = value
    Object.values(window.storesEvents).forEach(ev => {if(ev.store == store) {ev.cb()}})
}
window.stores.update = function (store) {
    Object.values(window.storesEvents).forEach(ev => {if(ev.store == store) {ev.cb()}})
}
window.stores.onChange = function (store, cb) {
    let id = nextStoresEventID++;
    window.storesEvents[id] = {store, cb};
    return id;
}
pages.goToPage('login')