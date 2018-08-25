;( () => {

    "use strict";
    
    require("../js/util.js").colorMode();
    
    const { remote: { dialog, getCurrentWindow } } = require("electron");
    const prisoner = require("../js/Prisoner.js");

    const { reverseString } = require("../js/util.js");

    const infoContainer = document.querySelector(".info");

    const win = getCurrentWindow();


    const setState = evt => {

        const { target } = evt;

        async function update(state) {
            const _id = document.querySelector("[data-user_id]").getAttribute("data-user_id");
            console.log(_id);
            let res;
            if ( ! ( res = await prisoner.updateRecord({ _id }, { "$set": { status: state } })) ) {
                dialog.showErrorBox("unexpected error", "this operation cannot be carried out, contact the administrator");
                return false;
            }
            return true;
        }

        ; ( async () => {
            const state = target.getAttribute("data-set-state");
            switch(state) {
            case "misconvicted":
                if ( ! (await update(state)) )
                    return;
                Array.from(target.parentNode.children, el => {
                    if ( el.getAttribute("data-set-state") !== "discharge" )
                        el.disabled = true;
                });
                break;
            case "transfer":
                if ( ! (await update(state)) )
                    return;
                break;
            case "discharge":
                if ( ! (await update(state)) )
                    return;
                Array.from(target.parentNode.children, el => {
                    el.disabled = true;
                });
                break;
            default:
                console.log("this should never execute");
            }
        })();

    };

    const dischargeCurrentState = info => {

        const dischargeBtn = document.querySelector("[data-set-state=discharge]");
        const misconvBtn = document.querySelector("[data-set-state=misconvicted]");
        const transBtn = document.querySelector("[data-set-state=transfer]");

        if ( info.status === "discharged" ) {

            transBtn.disabled = misconvBtn.disabled = true;

            if ( localStorage.getItem("DONT_SHOW_DISCHARGE") )
                return ;

            dialog.showMessageBox({
                type: "info",
                title: "discharged prisoner",
                message: "This Prisoner has been discharged",
                checkboxLabel: "don't show this message again",
                buttons: [ "Ok", "Cancel" ]
            }, ( btn , state ) => {
                if ( btn === 1 || ! state )
                    return ;

                localStorage.setItem("DONT_SHOW_DISCHARGE", "true");
                return ;
            });

            return; 
        }

        let [ , date, month ] = reverseString(info.dateOfConviction).match(/([0-9]{2})-([0-9]{2})/);
        const year = info.dischargeDate;

        const CURRENT = new Date();
        const CURRENT_MONTH = CURRENT.getMonth() + 1;
        const CURRENT_DATE = CURRENT.getDate();
        const CURRENT_YEAR = CURRENT.getFullYear();

        date = Number(date.replace(/^0/,""));
        month = Number(month.replace(/^0/, ""));
        
        if ( date === CURRENT_DATE && month === CURRENT_MONTH && info.dischargeDate === CURRENT_YEAR ) {
            dischargeBtn.disabled = false;
            return ;
        }

        dischargeBtn.disabled = true;

    };

    const misconvCurrentState = info => {

        const dischargeBtn = document.querySelector("[data-set-state=discharge]");
        const misconvBtn = document.querySelector("[data-set-state=misconvicted]");
        const transBtn = document.querySelector("[data-set-state=transfer]");

        if ( info.status === "misconvicted" ) {

            transBtn.disabled = true;
            misconvBtn.disabled = true;
            dischargeBtn.disabled = false;

            const btn = dialog.showMessageBox({
                type: "info",
                title: "Discharge Misconvicted Prisoner",
                message: "Misconvicted Prisoner should be discharged and deleted from database",
                buttons: [ "Ok", "Cancel" ],
                checkboxLabel: "Discharge and Delete Prisoner from database"
            }, async ( btn , state ) => {

                if ( btn === 1 || ! state )
                    return ;

                dischargeBtn.click();

                const _id = document.querySelector("[data-user_id]").getAttribute("data-user_id");

                let res;

                if ( ! ( res = await prisoner.deletePrisoner({ _id }) ) ) {
                    dialog.showErrorBox("unexpected error","cannot delete prisoner, contact administrator");
                    return;
                }

                if ( win.webContents.canGoBack() )
                    win.webContents.goBack();

            });
        }

    };

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

        statusContainer.addEventListener("click", setState);

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
            if ( ! (res = await prisoner.viewRecord({ _id: prisonerId }) ) ) {
                dialog.showErrorBox("unexpected error","cannot read info of prisoner with id " + prisonerId);
                if ( win.webContents.canGoBack() )
                    win.webContents.goBack();
                return;
            }
            ( [ res ] = res );

            win.setTitle(`${res.lastName} ${res.firstName}`);
            console.log(res);
            infoContainer.setAttribute("data-user_id", res._id);
            infoContainer.appendChild(buildImages(res));
            infoContainer.appendChild(buildStatus(res));
            infoContainer.appendChild(contentPrisonerInfo(res));
            infoContainer.appendChild(contentFamilyInfo(res));
            infoContainer.appendChild(contentPrisonInfo(res));

            dischargeCurrentState(res);
            misconvCurrentState(res);
        })();
    };

    window.addEventListener("DOMContentLoaded", loadPrisonerProfile);

})();
