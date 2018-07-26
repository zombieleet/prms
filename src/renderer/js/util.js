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

    if ( ! form.classList.contains("family-info") ) {

        const inputs = form.querySelectorAll("input");
        const storage = {};
        
        processPairs(form, (key,value) => {
            storage[key] = value;
        });
        
        localStorage.setItem("PRISONER_STORAGE", JSON.stringify(storage));
    }
    
    ipc.sendToHost("webview-navigate-src", target.hasAttribute("data-src-next") ? "next" : "prev" , view);
};

const processPairs = (form,cb) => {
    const inputs = form.querySelectorAll("input");
    Array.from(inputs, input => {
        const dataDbKey = input.getAttribute("data-db");
        const dataDbValue = input.value;
        cb(dataDbKey, dataDbValue);
    });
};

module.exports.processPairs = processPairs;

module.exports.initWebViewListener = () => {
    const webview = document.querySelector("webview");
    if ( ! webview )
        return;
    
    webview.addEventListener("ipc-message", event => {
        
        const { channel } = event;

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

const isDataListItem = (target) => {
    if ( ! HTMLInputElement[Symbol.hasInstance](target) )
        return false;
    if ( ! HTMLDataListElement[Symbol.hasInstance](target.nextElementSibling) )
        return false;
    return true;
};

module.exports.preventDataListDefault = () => {
    
    const form = document.forms[0];
    
    form.addEventListener("click", evt => {
        const { target } = evt;
        if ( isDataListItem(target) )
            target.value = "";
    });

    const inputLists = form.querySelectorAll("input[list]");
    const dataListOptions = Array.prototype.slice.call(inputLists);
    
    dataListOptions.forEach(el => {
        
        el.addEventListener("blur", evt => {
            
            const { target } = evt;
            
            const dataList = Array.prototype.slice.call(target.nextElementSibling.querySelectorAll("option"));

            let isMatch = false;

            for ( let option of dataList ) {
                if ( option.value === target.value ) {
                    isMatch = true;
                    break;
                }
            }
            
            if ( isMatch )
                return ;
            
            target.value = "";
        });
    });
};
