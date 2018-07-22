; ( () => {
    
    const { remote: { app, dialog } } = require("electron");
    const prisonerPicture = document.querySelector(".preview-picture p");
    const nView = document.querySelector(".next-view");

    const form = document.forms[0];
    
    const util = require("../js/util.js");
    
    prisonerPicture.addEventListener("click", evt => {
        evt.preventDefault();
        dialog.showOpenDialog({
            defaultPath: app.getPath("pictures"),
            property: [ "openFile" ],
            filters: [ { name: "Image" , extensions: [ "jpg", "png", "jpeg"] } ]
        }, path => {
            console.log(path || "no path");
        });
    });

    nView.addEventListener("click", util.navigateWebView );
    
    util.preventDataListDefault();
})();
