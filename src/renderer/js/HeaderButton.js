; ( () => {
    "use strict";

    const { remote: { getCurrentWindow } } = require("electron");
    const { webContents } = getCurrentWindow();

    const goBack = document.querySelector("[data-history-dir=go-back]");
    const goFront = document.querySelector("[data-history-dir=go-front]");
    const changeColor = document.querySelector("[data-color-mode]");


    const isHistory = el => el.getAttribute("data-no-history");

    document.addEventListener("DOMContentLoaded", () => {
        const { webContents } = getCurrentWindow();
        if ( webContents.history.length === 1 ) {
            goBack.setAttribute("data-no-history", "yes");
            goFront.setAttribute("data-no-history", "yes");
        }
    });

    changeColor.addEventListener("click", () => {
        if ( localStorage.getItem("color-mode") === "dark" ) {
            changeColor.classList.remove("fa-toggle-on");
            changeColor.classList.add("fa-toggle-off");
            document.body.setAttribute("data-color-mode", "white");
            return localStorage.setItem("color-mode", "white");
        }
        
        document.body.removeAttribute("data-color-mode");

        changeColor.classList.remove("fa-toggle-off");
        changeColor.classList.add("fa-toggle-on");
        
        return localStorage.setItem("color-mode","dark");
    });
    
    goBack.addEventListener("click", () => isHistory(goBack) === "yes" ? webContents.goBack() : "" );
    goFront.addEventListener("click", () => isHistory(goFront) === "yes" ? webContents.goFoward() : "");

})();
