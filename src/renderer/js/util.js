"use strict";

const { ipcRenderer: ipc, remote: { app, dialog } } = require("electron");

module.exports.navigateWebView = evt => {
    
    evt.preventDefault();

    const [ form ] = document.forms;
    const { target } = evt;
    const view = target.getAttribute("data-src-next")
          || target.getAttribute("data-src-prev");
    
    if ( ! form.checkValidity() ) {
        dialog.showMessageBox({
            type: "info",
            title: "incomplete information",
            message: "All information is required",
            buttons: [ "Ok" ]
        });
        return ;
    }
    
    ipc.sendToHost("webview-navigate-src", target.hasAttribute("data-src-next") ? "next" : "prev" , view);
};

module.exports.initWebViewListener = () => {
    const webview = document.querySelector("webview");
    if ( ! webview )
        return;
    webview.addEventListener("ipc-message", event => {
        const { channel } = event;
        console.log(event);
        if ( channel === "webview-navigate-src" ) {
            const { args: [ moveTo, view ] } = event;
            if ( moveTo === "next" ) {
                if ( webview.canGoForward() )
                    webview.goForward();
                else
                    webview.loadURL(`file://${app.getAppPath()}/src/renderer/pug/${view}`);
                return ;
            }
            if ( moveTo === "prev" ) {
                if ( webview.canGoBack() )
                    webview.goBack();
                else
                    webview.loadURL(`file://${app.getAppPath()}/src/renderer/pug/${view}`);
                return;
            }
        }
    });
};

module.exports.preventDataListDefault = () => {
    
    const form = document.forms[0];
    
    form.addEventListener("click", evt => {
        const { target } = evt;
        if ( ! HTMLInputElement[Symbol.hasInstance](target) )
            return ;
        if ( ! HTMLDataListElement[Symbol.hasInstance](target.nextElementSibling) )
            return ;
        target.value = "";
    });
    
};
