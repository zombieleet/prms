; ( () => {


    const { remote: { app, dialog } } = require("electron");
    
    const prisoner = require("../js/Prisoner.js");
    const { initWebViewListener } = require("../js/util.js");
    const prisonerPicture = document.querySelector(".prisoner-picture");
    
    const webview = document.querySelector("webview");

    webview.addEventListener("dom-ready", evt => {
        initWebViewListener();
        webview.openDevTools( { mode: "bottom" } );
    });
    
    webview.src=`file://${app.getAppPath()}/src/renderer/pug/PrisonerCred.jade`;
    
    document.addEventListener("DOMContentLoaded", async () => {
        
        const cellMateEl = document.querySelector(".cell-mates");
        const cellMates = await prisoner.getCellMate();


        if ( cellMates.length === 0 ) {
            const p = document.createElement("p");
            p.setAttribute("class", "no-cell-mate");
            p.textContent = "No one has been assigned to this prison room";
            cellMateEl.appendChild(p);
        }
        
        const ul = document.createElement("ul");

        cellMates.forEach ( mate => {
            
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
    });
    
})();
