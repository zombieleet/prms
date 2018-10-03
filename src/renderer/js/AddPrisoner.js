; ( () => {

    require("../js/util.js").colorMode();

    const { remote: { app, dialog } } = require("electron");

    const prisoner = require("../js/Prisoner.js");
    const { initWebViewListener, initStates, loadingDocument } = require("../js/util.js");
    const prisonerPicture = document.querySelector(".prisoner-picture");

    const emitter = new(require("events").EventEmitter)();
    const webview = document.querySelector("webview");

    webview.addEventListener("dom-ready", evt => {
        initWebViewListener();
        if ( process.env.NODE_ENV === "development" )
            webview.openDevTools( { mode: "bottom" } );
    });

    document.addEventListener("readystatechange", loadingDocument );

    webview.addEventListener("did-stop-loading", evt => {
        console.log("loading stop");
    });

    webview.src=`file://${app.getAppPath()}/src/renderer/html/PrisonerCred.html`;

    document.addEventListener("DOMContentLoaded", async () => {

        const button = document.createElement("button");

        button.type = "submit";
        button.textContent = "Generate";
        button.setAttribute("class", "generate-room-number");

        button.addEventListener("click", () => {
            emitter.emit("get-cell-mate", button);
        });

        emitter.emit("get-cell-mate", button);
    });

    emitter.on("get-cell-mate", async (button) => {

        const cellMateEl = document.querySelector(".cell-mates");

        let inMate, cellNumber ;

        try {
            ( { inMate, cellNumber } = await prisoner.getCellMate() );
        } catch(ex) {
            inMate = [];
            cellNumber = Math.floor(Math.random(300) * 300);
        }

        if ( cellMateEl.childElementCount >= 1 ) {
            Array.from(cellMateEl.children, el => el.remove());
        }

        localStorage.setItem("CELL_NUMBER", cellNumber);

        if ( inMate.length === 0 ) {
            const p = document.createElement("p");
            p.setAttribute("class", "no-cell-mate");
            p.textContent = `No one has been assigned to prison room number ${cellNumber}`;
            cellMateEl.appendChild(p);
            cellMateEl.appendChild(button);
            return ;
        }

        const ul = document.createElement("ul");


        inMate.forEach ( mate => {

            const li = document.createElement("li");
            const p = document.createElement("p");

            const imgContainer = document.createElement("div");
            const img = document.createElement("img");

            p.textContent = mate.prisonerId;

            li.setAttribute("class", "new-cell-mates");

            imgContainer.appendChild(img);

            li.appendChild(imgContainer);
            li.appendChild(p);

            ul.appendChild(li);

        });

        cellMateEl.appendChild(ul);
        cellMateEl.appendChild(button);
    });

})();
