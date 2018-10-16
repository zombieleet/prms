; ( () => {

    "use strict";

    require("../js/util.js").colorMode();

    const { remote: { app, dialog, getCurrentWindow } } = require("electron");
    
    const visitor = require("../js/Visitor.js");
    const prisoner = require("../js/Prisoner.js");
    
    const visitorsEl = document.querySelector(".visitors");

    const noVisitor = () => {
        const p = document.createElement("p");
        p.setAttribute("class", "visitor-noexists");
        p.textContent = "There are no currently no Visitors";
        visitorsEl.appendChild(p);
    };

    const renderToDom = res => {
        console.log(res);
        const ul = document.createElement("ul");

        ul.setAttribute("class", "view-visitor-list");

        res.forEach( _visitor_ => {

            const li = document.createElement("li");

            const name = document.createElement("p");
            const occupation = document.createElement("p");
            const telnumber = document.createElement("p");
            const gender = document.createElement("p");
            const toVisit = document.createElement("p");
            const rtoVisit = document.createElement("p");
            const timeVisit = document.createElement("p");
            const dateVisit = document.createElement("p");

            const button = document.createElement("button");

            name.textContent = `Name: ${_visitor_.fName} ${_visitor_.lName}`;
            occupation.textContent = `Occupation: ${_visitor_.occupation}`;
            telnumber.textContent = `Phone Number: ${_visitor_.pnumber}`;
            gender.textContent = `Gender: ${_visitor_.gender}`;
            toVisit.textContent = `Visting Prisoner Id: ${_visitor_.prisonerToVist}`;
            rtoVisit.textContent = `Reason for Visit: ${_visitor_.rtovisit}`;
            timeVisit.textContent = `Time of Visit: ${_visitor_.time}`;
            dateVisit.textContent = `Date of Visit: ${_visitor_.date}`;

            button.textContent = "Delete";
            
            toVisit.setAttribute("class", "show-prisoner");
            button.setAttribute("class", "delete-visitor");

            li.setAttribute("data-prisoner-id", `${_visitor_.prisonerToVist}`);
            li.setAttribute("data-visitor-id", `${_visitor_._id}`);
            li.setAttribute("class", "view-visitor-item");

            
            li.appendChild(name);
            li.appendChild(occupation);
            li.appendChild(telnumber);
            li.appendChild(gender);
            li.appendChild(toVisit);
            li.appendChild(rtoVisit);
            li.appendChild(timeVisit);
            li.appendChild(dateVisit);

            li.appendChild(button);

            ul.appendChild(li);

        });

        visitorsEl.appendChild(ul);
    };

    window.addEventListener("DOMContentLoaded", async (evt) => {

        let res;

        if ( ! ( res = await visitor.viewRecord() ) ) {
            dialog.showErrorBox("unexpected error", "an unexpected error has occured please contanct the system administrator");
            return;
        }

        if ( ! res.length  ) {
            noVisitor();
            return;
        }

        renderToDom(res);
    });

    visitorsEl.addEventListener("click", async (evt) => {
        
        const { target } = evt;
        
        let res;
        
        if ( target.classList.contains("delete-visitor") ) {
            
            const targetPNode = target.parentNode;
            const pNode = targetPNode.parentNode;
            
            if ( ! ( res = await visitor.deleteRecord({ _id: targetPNode.getAttribute("data-visitor-id") }) ) ) {
                dialog.showErrorBox("unexpected error","an unexpected error has occured, contact the system administrator");
                return;
            }
            
            targetPNode.remove();

            if ( ! pNode.childElementCount ) {
                noVisitor();
                return;
            }
            return;
        }
        
        if ( target.classList.contains("show-prisoner") ) {
            localStorage.setItem("PRISONER_ID", target.parentNode.getAttribute("data-prisoner-id"));
            getCurrentWindow().loadURL(`file://${app.getAppPath()}/src/renderer/html/PrisonerInfo.html`);
            return;
        }
    });
    
    
})();
