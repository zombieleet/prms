; ( () => {

    require("../js/util.js").colorMode();

    const { remote: { app, dialog, getCurrentWindow } } = require("electron");
    const prisoner = require("../js/Prisoner.js");
    const prisonerSection = document.querySelector(".prisoners-section");
    const prisonerList = document.querySelector(".prisoner-list");
    const search = document.querySelector(".prisoner-search");


    let QUERY;

    const showPrisonerInfo = evt => {
        const { target } = evt;
        const prisonerId = target.parentNode.getAttribute("data-prisoner-id");
        localStorage.setItem("PRISONER_ID", prisonerId);
        getCurrentWindow().loadURL(`file://${app.getAppPath()}/src/renderer/pug/PrisonerInfo.jade`);
    };

    const setActiveClicked = target => {
        const parentNodeLi = target.parentNode;
        const activeNode = document.querySelector(".active");
        if ( activeNode )
            activeNode.classList.remove("active");
        parentNodeLi.classList.add("active");
    };

    const renderPrisoners = prisoner => {

        let p, ul;

        if ( ( p = document.querySelector("[data-not-available]") ) )
            p.remove();

        if ( ( ul = document.querySelector(".prisoner-list-item") ) )
            ul.remove();

        if ( prisoner.length === 0 ) {
            p = document.createElement("p");
            p.textContent = "No Information Avaiable";
            p.setAttribute("data-not-available", "true");
            prisonerList.appendChild(p);
            return ;
        }

        const prsionerList = document.querySelector("prisoner-list");

        ul = document.createElement("ul");

        ul.setAttribute("class", "prisoner-list-item");

        prisonerList.appendChild(ul);

        prisoner.forEach( data => {

            const li = document.createElement("li");

            const img = new Image();
            const a = document.createElement("a");
            const button = document.createElement("button");

            img.setAttribute("class", "prisoner-front-view-image");
            img.src = data.picture.frontView;

            a.setAttribute("class", "prisoner-view-full");
            a.textContent = `${data.lastName} ${data.firstName}`;

            a.addEventListener("click", showPrisonerInfo);
            button.setAttribute("class", "prisoner-delete");
            button.textContent = "Delete";

            li.setAttribute("data-prisoner-id", data._id);
            li.setAttribute("class", "prisoner-item");
            li.appendChild(img);
            li.appendChild(a);
            li.appendChild(button);

            ul.appendChild(li);
        });
    };

    const requestPrisoner = async (query = {}) => {
        let res ;
        if ( ! ( res = await prisoner.viewRecord(query) ) ) {
            dialog.showErrorBox("unexpected error","unexpected error while communicating with database to get prisoners info "  + res);
            return ;
        }

        renderPrisoners(res);
    };

    window.addEventListener("DOMContentLoaded", async () => {
        await requestPrisoner({});
    });

    prisonerSection.addEventListener("click", async (evt) => {

        let { target } = evt;

        if ( ! HTMLLIElement[Symbol.hasInstance](target) && ! HTMLAnchorElement[Symbol.hasInstance](target) )
            return;

        target = HTMLLIElement[Symbol.hasInstance](target) ? target.querySelector("[data-type]") : target;

        let dataType = target.getAttribute("data-type");


        switch(dataType) {
        case "{}":
            QUERY = {};
            await requestPrisoner({});
            break;
        case "male":
        case "female":
            QUERY = { gender: dataType };
            await requestPrisoner({ gender: dataType });
            break;
        case "transfered":
        case "discharged":
        case "misconvicted":
        case "inview":
            QUERY = { status: dataType };
            await requestPrisoner({ status: dataType });
            break;
        case "lethal":
        case "nonlethal":
            QUERY = { lethal: dataType };
            await requestPrisoner({ lethal: dataType });
            break;
        default:
            ;
        }

        setActiveClicked(target);

    });

    prisonerList.addEventListener("click", async (evt) => {

        const { target } = evt;

        if ( target.classList.contains("prisoner-delete" ) ) {

            const prisonerId = target.parentNode.getAttribute("data-prisoner-id");
            let res;

            if ( ! ( res = await prisoner.deleteRecord({ _id: prisonerId}) ) ) {
                dialog.showErrorBox("unexpected error","error deleting prisoner");
                return;
            }

            requestPrisoner(QUERY);
            return ;
        }

    });

    search.addEventListener("input", async (evt) => {
        
        const { target } = evt;
        
        const cellNumber = target.valueAsNumber;
        const activeType = document.querySelector(".active");

        if ( activeType )
            activeType.classList.remove("active");
        
        if ( isNaN(cellNumber) && target.value.length > 0 ) {
            dialog.showErrorBox("unexpected error", "Contact the system administrator if you see this error box");
            return ;
        }
        
        requestPrisoner({ cellNumber });
    });
    
})();
