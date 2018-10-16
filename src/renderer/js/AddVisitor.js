; ( () => {

    "use strict";


    require("../js/util.js").colorMode();

    const { remote: { dialog } } = require("electron");

    const visitor = require("../js/Visitor.js");
    const prisoner = require("../js/Prisoner.js");

    const submit = document.querySelector(".submit");
    const form = document.forms[0];

    const pfname = document.querySelector("[data-db=pfname]");
    const plname = document.querySelector("[data-db=plname]");

    const renderResultToDom = res => {

        let div = document.querySelector(".prisoner-suggestions"),
            ul ;

        if ( div ) {
            ul = div.querySelector("ul");
            ul.remove();
        } else {
            div = document.createElement("div");
        }

        ul = document.createElement("ul");

        res.forEach( prisoner => {
            console.log(res);
            const li = document.createElement("li");
            const name = document.createElement("p");
            const img = new Image();

            name.setAttribute("class", "data-prisoner-searched");

            name.setAttribute("data-firstname", prisoner.firstName);
            name.setAttribute("data-lastname", prisoner.lastName);

            img.src = prisoner.picture.frontView;
            name.textContent = `${prisoner.lastName} ${prisoner.firstName}`;

            li.setAttribute("data-prisoner-id", prisoner._id);

            li.appendChild(img);
            li.appendChild(name);

            ul.appendChild(li);
        });

        div.setAttribute("class", "prisoner-suggestions");
        div.appendChild(ul);
        form.insertBefore(div, document.querySelector(".visitor-relate"));
    };

    const removeFromDom = () => {
        const suggestions = document.querySelector(".prisoner-suggestions");
        if ( suggestions )
            suggestions.remove();
    };

    const retrievePrisoner = async (evt) => {

        const { target } = evt;

        if ( /[^a-z]/i.test(evt.target.value) || ! target.value.length ) {
            console.log("hi");
            removeFromDom();
            return;
        }

        const fNameReg = new RegExp(`${pfname.value}`, "i");
        const lNameReg = new RegExp(`${plname.value}`, "i");

        let res = await prisoner.viewRecord({
            firstName: fNameReg ,
            lastName: lNameReg
        });

        if ( ! res ) {
            dialog.showErrorBox("unexpected error","an unexpected error has occured, please contact the system administrator");
            return ;
        }

        if ( ! res.length ) {
            removeFromDom();
            return ;
        }

        renderResultToDom(res);
    };

    pfname.addEventListener("input", retrievePrisoner);
    plname.addEventListener("input", retrievePrisoner);


    submit.addEventListener("click", async (evt) => {
        
        let prisonerID = localStorage.getItem("PRISONER_TO_VISIT_ID");
        
        if ( ! form.checkValidity() ) {
            dialog.showErrorBox("incomplete from","please fill all form fields");
            return ;
        }

        if ( ! prisonerID  ) {
            dialog.showErrorBox("no prisoner id","cannot determine prisoner id, add a prisoner and associate the prisoner with a visitor");
            return;
        }
            

        const DATA_TO_STORE = {
            prisonerToVist: prisonerID
        };

        Array.from(form.elements, el => {
            if ( ! HTMLInputElement[Symbol.hasInstance](el) )
                return ;
            Object.assign(DATA_TO_STORE, {
                [el.getAttribute("data-db")]: el.value
            });
        });

        let res;

        if ( ! ( res = await visitor.saveRecord(DATA_TO_STORE) ) ) {
            dialog.showErrorBox("unexpected error","unexpected error, please contact the system administrator");
            return ;
        }
        res.viewRecordView("ViewVisitor");
    });

    form.addEventListener("click", evt => {

        const { target } = evt;

        if ( ! target.classList.contains("data-prisoner-searched") )
            return ;

        pfname.value = target.getAttribute("data-firstname");
        plname.value = target.getAttribute("data-lastname");

        localStorage.setItem("PRISONER_TO_VISIT_ID",target.parentNode.getAttribute("data-prisoner-id"));

        document.querySelector(".prisoner-suggestions").remove();

    });

    window.addEventListener("DOMContentLoaded", () => {
        const timeValue = document.querySelector("[data-db=time]");
        const dateValue = document.querySelector("[data-db=date]");

        timeValue.value = (new Date()).toLocaleTimeString();
        dateValue.value = (new Date()).toLocaleDateString();
    });

})();
