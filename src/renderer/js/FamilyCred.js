; ( () => {

    require("../js/util.js").colorMode();

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

        Object.assign(storage, {
            family: [],
            status: "inview",
            cellNumber: parseInt(localStorage.getItem("CELL_NUMBER"))
        });

        localStorage.removeItem("PRISONER_STORAGE");
        localStorage.removeItem("CELL_NUMBER");

        Array.from(formSections, section => {
            const buildFamily = {};
            util.processPairs(section, (input,key,value) => {
                buildFamily[key] = value;
            });
            storage.family.push(buildFamily);
        });

        let res;

        if ( ! ( res = await prisoner.save(storage) ) ) {
            dialog.showErrorBox("Cannot save data", "error while saving prisoner information " + res);
            return;
        }

        res.viewPrisoner();

    });

    bview.addEventListener("click", util.navigateWebView);
    util.preventDataListDefault();

})();
