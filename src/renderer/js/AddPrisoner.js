; ( () => {


    const { remote: { app, dialog } } = require("electron");
    
    const prisoner = require("../js/Prisoner.js");
    const { initWebViewListener } = require("../js/util.js");
    const prisonerPicture = document.querySelector(".prisoner-picture");

    const emitter = new(require("events").EventEmitter)();
    const webview = document.querySelector("webview");

    webview.addEventListener("dom-ready", evt => {
        initWebViewListener();
        webview.openDevTools( { mode: "bottom" } );
    });
    
    webview.src=`file://${app.getAppPath()}/src/renderer/pug/PrisonerCred.jade`;
    
    document.addEventListener("DOMContentLoaded", async () => {
        
        const button = document.createElement("button");
        
        button.type = "submit";
        button.textContent = "Generate";
        button.setAttribute("class", "generate-room-number");
        
        button.addEventListener("click", () => {
            const crimeComitted = document.querySelector(".prisoner-crime-committed").value;
            emitter.emit("get-cell-mate", button, crimeComitted !== "" ? crimeComitted : undefined);
        });

        emitter.emit("get-cell-mate", button);
    });

    emitter.on("get-cell-mate", async (button, crime) => {
        
        const cellMateEl = document.querySelector(".cell-mates");
        
        const { inMate , cellNumber } = await prisoner.getCellMate(crime);
        
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
