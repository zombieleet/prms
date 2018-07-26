; ( () => {

    const { remote: { app, dialog } } = require("electron");
    const prisoner = require("../js/Prisoner.js");
    const prisonerSection = document.querySelector(".prisoners-section");
    const prisonerList = document.querySelector(".prisoner-list");

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
        if ( ! ( res = await prisoner.__viewPrisoner(query) ) ) {
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
            await requestPrisoner({});
            break;
        case "male":
        case "female":
            await requestPrisoner({ gender: dataType });
            break;
        case "transfered":
        case "discharged":
        case "misconvicted":
        case "inview":
            await requestPrisoner({ status: dataType });
            break;
        case "lethal":
        case "nonlethal":
            await requestPrisoner({ lethal: dataType });
            break;
        default:
            ;
        }

        setActiveClicked(target);

    });
})();
