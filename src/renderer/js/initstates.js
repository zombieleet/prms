const path = require("path");
const { xhrRequest } = require("../js/util.js");

function cb(t) {
    for ( let states of t ) {
        const { state: { name, id } } = states;
        postMessage({ name , id});
    }
}

self.addEventListener("message", async ({data}) => {
    cb(await xhrRequest(data));
});
