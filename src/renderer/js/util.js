"use strict";

const path = require("path");
const isWorker = self.global.location.constructor.name;
let ipc, app, dialog;

if ( isWorker !== "WorkerLocation" ) {
    ({ ipcRenderer: ipc, remote: { app, dialog } } = require("electron"));
}

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
        
        storage.picture = {};

        processPairs(form, (input,key,value) => {
            const dataDataType = input.getAttribute("data-data-type");
            switch(dataDataType) {
            case "float":
                value = parseFloat(value);
                storage[key] = value;
                break;
            case "picture":
                Object.assign(storage.picture,{
                    [key]: value
                });
                break;
            default:
                storage[key] = value;
            }
        });

        const convictionDate = Number(storage.dateOfConviction.match(/[0-9]{4}/)[0]);
        const yearsCharged = storage.chargedYears;

        storage.dischargeDate = convictionDate + yearsCharged;

        localStorage.setItem("PRISONER_STORAGE", JSON.stringify(storage));
    }

    ipc.sendToHost("webview-navigate-src", target.hasAttribute("data-src-next") ? "next" : "prev" , view);
};

const processPairs = (form,cb) => {
    const inputs = form.querySelectorAll("input");
    Array.from(inputs, input => {
        const dataDbKey = input.getAttribute("data-db");
        const dataDbValue = input.value;
        cb(input, dataDbKey, dataDbValue);
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


module.exports.initStates = () => {
    const worker = new Worker("../js/initstates.js");
    const stateDataList = document.querySelector("#stateList");
    worker.postMessage(app.getAppPath());
    worker.addEventListener("message", evt => {
        const dtListOption = document.createElement("option");
        const { data: { name, id } } = evt;
        dtListOption.setAttribute("value", name);
        dtListOption.setAttribute("data-value-id", id);
        stateDataList.appendChild(dtListOption);
    });
};

const initLGA = id => {
    const worker = new Worker("../js/initlga.js");
    const lgaDataList = document.querySelector("#lgalist");
    worker.addEventListener("message", evt => {
        const option = document.createElement("option");
        const { data } = evt;
        option.setAttribute("value", data);
        lgaDataList.appendChild(option);
    });
    worker.postMessage({ appPath: app.getAppPath(), stateId: id});
};

module.exports.initLGA = initLGA;

module.exports.lgaOfState = evt => {
    
    const { target } = evt;
    
    const dtListOption = Array.from(document.querySelector(`#${target.getAttribute("list")}`).children);

    let state;

    for ( let child of dtListOption ) {

        const childValue = child.getAttribute("value");

        if ( childValue === target.value ) {
            state = child;
            break;
        }
    }
    if ( ! state )
        return ;
    
    initLGA(state.getAttribute("data-value-id"));
};

module.exports.xhrRequest = data => {

    const xhr = new XMLHttpRequest();

    xhr.open("GET", path.join(data, "src", "renderer", "libs", "stateandcapital.json") , true);

    return new Promise((resolve,reject) => {
        xhr.addEventListener("readystatechange", () => {
            if ( xhr.readyState === 4 && xhr.status === 200 ) {
                resolve(JSON.parse(xhr.responseText));
            }
        });

        xhr.send();
    });
};

module.exports.colorMode = () => {
    if ( ! localStorage.getItem("color-mode") || localStorage.getItem("color-mode") === "dark" )
        return localStorage.setItem("color-mode", "dark");
    if ( localStorage.getItem("color-mode") === "white")
        return document.body.setAttribute("data-color-mode", "white");
};

module.exports.loadingDocument = evt => {
    console.log(evt);
    const loader = document.querySelector(".document-loading") || document.createElement("div");
    
    if ( evt.target.readyState === "complete" ) {
        loader.remove();
        return ;
    }
    
    if ( document.querySelector(".document-loading") )
        return ;
    
    const loadingIcon = document.createElement("loadingIcon");
    
    loadingIcon.setAttribute("class", "fa fa-gear");
    
    loader.setAttribute("class", "document-loading");
    loader.appendChild(loadingIcon);
    
    document.body.appendChild(loader);
    
};

module.exports.reverseString = str => str.split("-").reverse().join("-");
