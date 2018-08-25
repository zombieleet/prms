; ( () => {

    "use strict";
    
    require("../js/util.js").colorMode();
    
    const { remote: { dialog } } = require("electron");
    const warder = require("../js/Warder.js");

    const { reverseString } = require("../js/util.js");
    
    const renderWarders = ([warder]) => {
        
        const infoDiv = document.createElement("div");
        
        const warderInfo = document.querySelector(".warder-info");
        const pic = document.createElement("img");
        
        const name = document.createElement("p");

        const address = document.createElement("p");
        const stateOfOrigin = document.createElement("p");
        const lga = document.createElement("p");

        const gender = document.createElement("p");
        const dob = document.createElement("p");

        const empDate = document.createElement("p");
        const retDate = document.createElement("p");

        pic.src = warder.picture;

        name.setAttribute("class", "warder-name");
        
        name.textContent = `${warder.firstName} ${warder.lastName}`;

        address.setAttribute("class", "warder-address");
        stateOfOrigin.setAttribute("class", "warder-sog");
        lga.setAttribute("class", "warder-lga");
        
        gender.setAttribute("class", "warder-gender");
        dob.setAttribute("class", "warder-dob");
        
        empDate.setAttribute("class", "warder-emp-date");
        retDate.setAttribute("class", "warder-ret-date");

        address.textContent = warder.address;
        stateOfOrigin.textContent = warder.stateOfOrigin;
        lga.textContent = warder.lga;

        gender.textContent = warder.gender.replace(/./,warder.gender.charAt(0).toUpperCase());
        dob.textContent = reverseString(warder.dob);
        
        empDate.textContent = reverseString(warder["employment-date"]);
        retDate.textContent = reverseString(warder["retirement-date"]);
        

        infoDiv.setAttribute("class", "info-div");
        
        infoDiv.appendChild(name);
        infoDiv.appendChild(stateOfOrigin);
        infoDiv.appendChild(lga);
        infoDiv.appendChild(address);
        infoDiv.appendChild(gender);
        infoDiv.appendChild(dob);
        infoDiv.appendChild(empDate);
        infoDiv.appendChild(retDate);

        
        warderInfo.appendChild(pic);
        warderInfo.appendChild(infoDiv);
    };

    window.addEventListener("DOMContentLoaded", async (evt) => {
        let res;
        if ( ! ( res = await warder.viewRecord({ _id: localStorage.getItem("WARDER_ID")}) ) ) {
            console.log(res);
            dialog.showErrorBox("unexpected error","an unexpected error has occured, contact the system administrator");
            return;
        }
        renderWarders(res);
    });
    
})();
