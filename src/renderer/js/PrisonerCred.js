; ( () => {

    const { remote: { app, dialog, Menu, MenuItem, getCurrentWindow } } = require("electron");
    const picture = document.querySelector(".picture");
    const nView = document.querySelector(".next-view");
    const capture = document.querySelector(".picture-capture");
    //const lga = document.querySelector("[list=lgalist]");
    const stateInput = document.querySelector("[list=stateList]");
    const form = document.forms[0];
    const emitter = new(require("events").EventEmitter)();
    const util = require("../js/util.js");


    const takePicture = evt => {

        const video = evt.target.parentNode.querySelector("video:not(.hide)");

        if ( ! video )
            return ;

        const captureDirection = document.querySelector(`[data-type=${video.parentNode.getAttribute("data-direction")}]`);
        const canvas = document.querySelector("canvas");
        const context = canvas.getContext("2d");
        const img = new Image();
        console.log(video.parentNode.getAttribute("data-direction"));
        context.drawImage(video, 0, 0, 199, 148);

        captureDirection.value = img.src = canvas.toDataURL("image/png");

        video.classList.add("hide");
        video.parentNode.appendChild(img);
    };

    const videoMenu = (evt) => {
        const menu = new Menu();
        return (() => {
            menu.append(new MenuItem({
                label: "capture",
                accelerator: "cmd+c",
                click() {
                }
            }));
            menu.popup(getCurrentWindow(), { async: true });
        })();
    };

    picture.addEventListener("click", evt => {

        const { target } = evt;

        if ( ! HTMLParagraphElement[Symbol.hasInstance](target) )
            return ;

        const pictureViews = Array.from(picture.children);
        const view = target.parentNode;

        for ( let pics of pictureViews ) {

            const viewVideo = pics.querySelector("video");
            const viewCapture = pics.querySelector("button");
            const viewP = pics.querySelector("p");

            if ( viewVideo && ! viewVideo.classList.contains("hide") ) {
                viewP.classList.remove("hide");
                viewVideo.remove();
                break;
            }

        }

        const video = document.createElement("video");

        target.classList.add("hide");

        video.setAttribute("class", "picture-video");
        view.appendChild(video);

        capture.disabled = false;

        emitter.emit("start-taking-picture", video);

        video.addEventListener("loadedmetadata", () => video.play());
        video.addEventListener("contextmenu", videoMenu );
    });

    emitter.on("start-taking-picture", async (video) => {

        let stream ;

        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
        } catch(ex) {
            stream = ex;
        }

        if ( Error[Symbol.hasInstance](stream) ) {
            dialog.showErrorBox("Error Taking Picture", "Contact the Developer, if this box happens to show up");
            return ;
        }

        video.srcObject = stream;

    });

    nView.addEventListener("click", util.navigateWebView );
    capture.addEventListener("click", takePicture);
    util.preventDataListDefault();


    stateInput.addEventListener("input", evt => {

        const dtListOption = Array.from(document.querySelector(`#${stateInput.getAttribute("list")}`).children);

        let state;

        for ( let child of dtListOption ) {

            const childValue = child.getAttribute("value");

            if ( childValue === stateInput.value ) {
                state = child;
                break;
            }
        }
        if ( ! state )
            return ;
        util.initLGA(state.getAttribute("data-value-id"));
    });

    window.addEventListener("DOMContentLoaded", () => {
        util.initStates();
    });
})();
