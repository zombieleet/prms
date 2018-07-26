; ( () => {

    const { remote: { dialog } } = require("electron");
    
    const util = require("../js/util.js");
    const bview = document.querySelector(".prev-view");
    const save = document.querySelector(".save");
    const form = document.querySelector("form");

    const prisoner = require("../js/Prisoner.js");

    save.addEventListener("click", async (evt) => {
        
        evt.preventDefault();
        
        const formSections = form.querySelectorAll(".fam-info");
        const storage = JSON.parse(localStorage.getItem("PRISONER_STORAGE"));

        localStorage.removeItem("PRISONER_STORAGE");
        
        storage.family = [];
        
        Array.from(formSections, section => {
            const buildFamily = {};
            util.processPairs(section, (key,value) => {
                buildFamily[key] = value;
            });
            storage.family.push(buildFamily);
        });

        let res;
        
        if ( ! ( res = await prisoner.save(storage) ) ) {
            dialog.showErrorBox("Cannot save data", "error while saving prisoner information " + res);
            return;
        }

        console.log("done");
        
    });
    
    bview.addEventListener("click", util.navigateWebView);
    util.preventDataListDefault();
    
})();
