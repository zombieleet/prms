; ( () => {
    "use strict";
    
    const { remote: { getCurrentWindow, session } } = require("electron");
    const { webContents } = getCurrentWindow();

    const goBack = document.querySelector("[data-history-dir=go-back]");
    const goFront = document.querySelector("[data-history-dir=go-front]");
    // const changeColor = document.querySelector("[data-color-mode]");


    const isHistory = el => el.getAttribute("data-no-history");


    // const changeMode = () => {
        
    //     const itemValue = localStorage.getItem("color-mode");
        
    //     if ( ! itemValue || itemValue === "dark" ) {
    //         changeColor.classList.remove("fa-toggle-on");
    //         changeColor.classList.add("fa-toggle-off");
    //         document.body.setAttribute("data-color-mode", "white");
    //         return localStorage.setItem("color-mode", "white");
    //     }

    //     document.body.removeAttribute("data-color-mode");

    //     changeColor.classList.remove("fa-toggle-off");
    //     changeColor.classList.add("fa-toggle-on");

    //     return localStorage.setItem("color-mode","dark");
    // };

    document.addEventListener("DOMContentLoaded", () => {

        const { webContents } = getCurrentWindow();

        if ( ! webContents.canGoBack() )
            goBack.setAttribute("data-no-history", "yes");
        else
            goBack.setAttribute("data-no-history", "no");

        if ( ! webContents.canGoForward() )
            goFront.setAttribute("data-no-history", "yes");
        else
            goFront.setAttribute("data-no-history","no");
        
        // if ( localStorage.getItem("data-color-mode") === "white" ) {
        //     changeColor.classList.remove("fa-toggle-off");
        //     changeColor.classList.add("fa-toggle-on");
        // } else {
        //     changeColor.classList.remove("fa-toggle-on");
        //     changeColor.classList.add("fa-toggle-off");
        // }
        
    });

    // changeColor.addEventListener("click", changeMode);

    goBack.addEventListener("click", () => isHistory(goBack) === "no" ? webContents.goBack() : "" );
    goFront.addEventListener("click", () => isHistory(goFront) === "no" ? webContents.goForward() : "");

})();
