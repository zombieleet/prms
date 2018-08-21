; ( () => {
    "use strict";

    const { remote: { app, dialog, getCurrentWindow } } = require("electron");

    const warderParentEl = document.querySelector(".warders");
    const warder = require("../js/Warder.js");


    const noWarder = () => {
        const p = document.createElement("p");
        p.setAttribute("class", "warder-noexist");
        p.textContent = `No Warder has been added to the database`;
        warderParentEl.appendChild(p);
    };

    // const renderWarders = warders => {

    //     const ul = document.createElement("ul");

    //     ul.setAttribute("class", "warder-list");

    //     warders.forEach( warder => {

    //         const li = document.createElement("li");

    //         const pic = document.createElement("img");

    //         const fName = document.createElement("span");
    //         const lName = document.createElement("span");

    //         const address = document.createElement("p");
    //         const stateOfOrigin = document.createElement("p");
    //         const lga = document.createElement("p");

    //         const gender = document.createElement("p");
    //         const dob = document.createElement("p");

    //         const empDate = document.createElement("p");
    //         const retDate = document.createElement("p");


    //         pic.setAttribute("class", "warder-picture");
    //         pic.src = warder.picture;


    //         fName.setAttribute("class", "warder-fname");
    //         lName.setAttribute("class", "warder-lname");

    //         fName.textContent = warder.firstName;
    //         lName.textContent = warder.lastName;

    //         address.setAttribute("class", "warder-address");
    //         stateOfOrigin.setAttribute("class", "warder-sog");
    //         lga.setAttribute("class", "warder-lga");

    //         address.textContent = warder.address;
    //         stateOfOrigin.textContent = warder.stateOfOrigin;
    //         lga.textContent = warder.lga;

    //         li.setAttribute("class", "warder-item");

    //         li.appendChild(pic);

    //         li.appendChild(fName);
    //         li.appendChild(lName);

    //         li.appendChild(stateOfOrigin);
    //         li.appendChild(lga);

    //         li.appendChild(gender);
    //         li.appendChild(dob);

    //         li.appendChild(empDate);
    //         li.appendChild(retDate);

    //         ul.appendChild(li);
    //     });

    //     warderParentEl.appendChild(ul);
    // };


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

            if ( ! ( res = warder.deleteWarder( { _id: targetPNode.getAttribute("data-warder-id") } ) ) ) {
                dialog.showErrorBox("unexpected error", "an unexpected error has occured, please contact the system administrator");
                return ;
            }

            targetPNode.remove();

            if ( targetParentPnode.childElementCount === 0 ) {
                noWarder();
                return;
            }
        }

        if ( attrib === "view" ) {
            getCurrentWindow().loadURL(`file://${app.getAppPath()}/src/renderer/pug/WarderInfo.jade`);
            return ;
        }

    });

    window.addEventListener("DOMContentLoaded", async () => {

        let res;

        if ( ! ( res = await warder.__viewWarder() ) ) {
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
