; ( () => {
    
    "use strict";

    require("../js/util.js").colorMode();

    const { remote: { app, dialog, getCurrentWindow } } = require("electron");

    const warderParentEl = document.querySelector(".warders");
    const warder = require("../js/Warder.js");


    const noWarder = () => {
        const p = document.createElement("p");
        p.setAttribute("class", "warder-noexist");
        p.textContent = `No Warder has been added to the database`;
        warderParentEl.appendChild(p);
    };

    const renderWarders = warders => {

        const ul = document.createElement("ul");

        ul.setAttribute("class", "warder-list");

        warders.forEach(warder => {

            const li = document.createElement("li");

            const pic = new Image();
            const name = document.createElement("a");
            const deleteBtn = document.createElement("button");

            pic.src = warder.picture;

            name.textContent = `${warder.firstName} ${warder.lastName}`;
            name.setAttribute("data-warder", "view");

            deleteBtn.textContent = "Delete";
            deleteBtn.setAttribute("data-warder", "delete");

            li.setAttribute("class", "warder-item");
            li.setAttribute("data-warder-id", warder._id);


            li.appendChild(pic);
            li.appendChild(name);
            li.appendChild(deleteBtn);

            ul.appendChild(li);
        });

        warderParentEl.appendChild(ul);
    };

    warderParentEl.addEventListener("click", evt => {

        const { target } = evt;
        const attrib = target.getAttribute("data-warder");
        const targetPNode = target.parentNode;
        const targetParentPnode = targetPNode.parentNode;
        let res;
        
        if ( attrib === "delete" ) {

            if ( ! ( res = warder.deleteRecord( { _id: targetPNode.getAttribute("data-warder-id") } ) ) ) {
                dialog.showErrorBox("unexpected error", "an unexpected error has occured, please contact the system administrator");
                return ;
            }

            targetPNode.remove();

            if ( targetParentPnode.childElementCount === 0 ) {
                targetParentPnode.remove();
                noWarder();
                return;
            }
        }

        if ( attrib === "view" ) {
            localStorage.setItem("WARDER_ID", targetPNode.getAttribute("data-warder-id") );
            getCurrentWindow().loadURL(`file://${app.getAppPath()}/src/renderer/html/WarderInfo.html`);
            return ;
        }

    });

    window.addEventListener("DOMContentLoaded", async () => {

        let res;
        
        if ( ! ( res = await warder.viewRecord() ) ) {
            console.log(res);
            dialog.showErrorBox("unexpected error", "an unexpected error has occurred, contact the system administrator");
            return ;
        }

        if ( res.length === 0 ) {
            noWarder();
            return ;
        };

        renderWarders(res);
    });
})();
