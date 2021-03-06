; ( () => {

    "use strict";

    require("../js/util.js").colorMode();
    
    const { remote: { getCurrentWindow, app } } = require("electron");
    const emitStopInterval = new(require("events"));

    document.addEventListener("DOMContentLoaded", () => {
        const title = document.querySelector("title");

        const dotOne = setInterval( () => {
            // if ( title.textContent === "Loading" ) {
            //     title.textContent = "Loading.";
            // }
        }, 500 / 2);

        const dotTwo = setInterval( () => {
            // if ( title.textContent === "Loading." ) {
            //     title.textContent = "Loading..";
            // }
        }, 1000 / 2);

        const dotThree = setInterval( () => {
            // if ( title.textContent === "Loading.." ) {
            //     title.textContent = "Loading...";
            // }
        }, 1500 / 2);

        const dotFour = setInterval( () => {
            // if ( title.textContent === "Loading..." ) {
            //     title.textContent = "Loading";
            // }
        }, 2000 / 2);

        emitStopInterval.on("prison:interval:stop", () => {

            clearInterval(dotOne);
            clearInterval(dotTwo);
            clearInterval(dotThree);
            clearInterval(dotFour);

            const { webContents } = getCurrentWindow();
            webContents.clearHistory();
            webContents.loadURL(`file://${app.getAppPath()}/src/renderer/html/index.html`);
        });


    });

    setTimeout( () => {
        emitStopInterval.emit("prison:interval:stop");
    }, 10000);

})();
