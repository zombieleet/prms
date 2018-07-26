
const { xhrRequest } = require("../js/util.js");

const cb = (data,stateId) =>  {
    const lgas = data.find( ( { state: { id } } ) => id === stateId).state.locals.map( locals => locals.name);
    for ( let lga of lgas )
        postMessage(lga);
};

self.addEventListener("message", async (evt) => {
    const { data: { appPath, stateId } } = evt;
    cb(await xhrRequest(appPath), Number(stateId));
});
