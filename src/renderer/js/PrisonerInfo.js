; ( () => {

    const { remote: { dialog, getCurrentWindow } } = require("electron");
    const prisoner = require("../js/Prisoner.js");

    const infoContainer = document.querySelector(".info");
    
    const win = getCurrentWindow();

    const reverseString = str => str.split("-").reverse().join("-");

    const buildImages = info => {

        const imageContainer = document.createElement("div");

        const frontView = document.createElement("img");
        const rightView = document.createElement("img");
        const leftView = document.createElement("img");
        
        frontView.src = info.picture.frontView;
        rightView.src = info.picture.rightView;
        leftView.src = info.picture.leftView;


        imageContainer.setAttribute("class", "prisoner-images");
        
        imageContainer.appendChild(frontView);
        imageContainer.appendChild(rightView);
        imageContainer.appendChild(leftView);

        return imageContainer;
    };

    const buildStatus = info => {
        
        const statusContainer = document.createElement("div");

        const discharge = document.createElement("button");
        const transfer = document.createElement("button");
        const misconvicted = document.createElement("button");

        discharge.type = transfer.type = misconvicted.type = "button";
        
        statusContainer.addEventListener("click", () => {});

        discharge.setAttribute("data-set-state", "discharge");
        transfer.setAttribute("data-set-state", "transfer");
        misconvicted.setAttribute("data-set-state", "misconvicted");

        discharge.textContent = "discharge";
        transfer.textContent = "transfer";
        misconvicted.textContent = "misconvicted";

        statusContainer.setAttribute("class","btn-states");
        statusContainer.appendChild(discharge);
        statusContainer.appendChild(transfer);
        statusContainer.appendChild(misconvicted);
        
        return statusContainer;
    };

    
    const contentPrisonerInfo = info => {

        const userInfo = document.createElement("div");

        const name = document.createElement("p");
        const dob = document.createElement("p");
        const address = document.createElement("p");
        const gender = document.createElement("p");
        const height = document.createElement("p");
        const weight = document.createElement("p");
        const state = document.createElement("p");
        const lga = document.createElement("p");
        const skin = document.createElement("p");
        const maritalStatus = document.createElement("p");

        name.textContent = `Prisoner Name: ${info.firstName} ${info.lastName}`;

        dob.textContent = `Date of Birth: ${reverseString(info.dob)}`;
        address.textContent = `Prisoner Address: ${info.address}`;
        gender.textContent = `Prisoner Gender: ${info.gender}`;
        height.textContent = `Prisoner Height: ${info.height}`;
        weight.textContent = `Prisoner Weight: ${info.weight}`;
        state.textContent = `State of Origin: ${info.state}`;
        lga.textContent = `Local Government Area: ${info.lga}`;
        skin.textContent = `Skin Color: ${info.skin}`;
        maritalStatus.textContent = `Marital Status: ${info.maritalStatus}`;
        
        userInfo.appendChild(name);
        userInfo.appendChild(dob);

        userInfo.appendChild(address);
        userInfo.appendChild(gender);
        userInfo.appendChild(height);
        userInfo.appendChild(weight);
        userInfo.appendChild(state);
        userInfo.appendChild(lga);
        userInfo.appendChild(skin);
        userInfo.appendChild(maritalStatus);

        userInfo.setAttribute("class", "prisoner-user-info");
        
        return userInfo;

    };

    const contentFamilyInfo = info => {

        const famInfo = document.createElement("div");

        info.family.forEach( fam => {
            
            const famDiv = document.createElement("div");
            
            const name = document.createElement("p");
            const relationship = document.createElement("p");
            const address = document.createElement("p");
            
            name.textContent = `Name: ${fam.fName} ${fam.lName}`;
            relationship.textContent = `Relationship: ${fam.relationship}`;
            address.textContent = `Address: ${fam.address}`;

            famDiv.appendChild(name);
            famDiv.appendChild(relationship);
            famDiv.appendChild(address);

            famInfo.appendChild(famDiv);
        });

        famInfo.setAttribute("class", "prisoner-family-info");
        
        return famInfo;
    };

    const contentPrisonInfo = info => {
        
        const prisonInfo = document.createElement("div");

        const prisonName = document.createElement("p");
        const cellNumber = document.createElement("p");
        
        const crimeCommitted = document.createElement("p");
        const dateOfConviction = document.createElement("p");
        const chargedYears = document.createElement("p");
        const dischargeDate = document.createElement("p");
        
        prisonName.textContent = `Prison Name: ${info.prisonName}`;
        cellNumber.textContent = `Cell Number: ${info.cellNumber}`;
        
        crimeCommitted.textContent = `Crime Committed: ${info.crimeCommitted}`;
        dateOfConviction.textContent = `Conviction Date: ${info.dateOfConviction}`;
        chargedYears.textContent = `Charged Years: ${info.chargedYears}`;
        dischargeDate.textContent = `Date of Discharge: ${info.dischargeDate}`;

        prisonInfo.appendChild(prisonName);
        prisonInfo.appendChild(cellNumber);
        prisonInfo.appendChild(crimeCommitted);
        prisonInfo.appendChild(dateOfConviction);
        prisonInfo.appendChild(chargedYears);
        prisonInfo.appendChild(dischargeDate);

        prisonInfo.setAttribute("class", "prisoner-prison-info");

        return prisonInfo;
    };
    
    const loadPrisonerProfile = () => {
        const prisonerId = localStorage.getItem("PRISONER_ID");
        let res;
        ; ( async () => {
            if ( ! (res = await prisoner.__viewPrisoner({ _id: prisonerId }) ) ) {
                dialog.showErrorBox("unexpected error","cannot read info of prisoner with id " + prisonerId);
                if ( win.webContents.canGoBack() )
                    win.webContents.goBack();
                return;
            }
            ( [ res ] = res );
            win.setTitle(`${res.lastName} ${res.firstName}`);
            infoContainer.appendChild(buildImages(res));
            infoContainer.appendChild(buildStatus(res));
            infoContainer.appendChild(contentPrisonerInfo(res));
            infoContainer.appendChild(contentFamilyInfo(res));
            infoContainer.appendChild(contentPrisonInfo(res));
        })();
    };

    window.addEventListener("DOMContentLoaded", loadPrisonerProfile);
    
})();
