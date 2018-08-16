; ( () => {

    require("../js/util.js").colorMode();

    const { remote: { dialog } } = require("electron");

    const warder = require("../js/Warder.js");
    const save = document.querySelector(".save");
    const form = document.forms[0];

    const warderPicPrev = document.querySelector(".add-warder-picture-preview");
    const takePicture = warderPicPrev.querySelector("p");

    const uploadPics = document.querySelector(".__picture__trigger");

    const stateInput = document.querySelector("[list=stateList]");
    const employmentDate = document.querySelector("[name=empdate]");

    const util = require("../js/util.js");


    const fileReader = new FileReader();


    const rmPicture = evt => {

        const img = warderPicPrev.querySelector("img");
        const xx = warderPicPrev.querySelector(".close-preview");
        const p = warderPicPrev.querySelector("p");
        const container = document.querySelector(".__picture__preview__container");

        container.value = img.src = "";

        img.classList.add("hide");
        img.classList.remove("preview-warder-picture");

        p.classList.remove("hide");

        
        if ( xx )
            xx.remove();
    };

    const addPicture = () => {
        const xx = document.createElement("i");

        xx.classList.add("fa");
        xx.classList.add("fa-times-circle");
        xx.classList.add("close-preview");

        xx.addEventListener("click", rmPicture);

        return xx;
    };


    save.addEventListener("click", async (evt) => {

        if ( ! form.checkValidity() ) {
            dialog.showErrorBox("incomplete form","fill all required fields");
            return ;
        }

        const ADD_WARDER = {};

        let res;

        Array.from(form.children, el => {
            if ( ! el.hasAttribute("data-db") )
                return ;
            Object.assign(ADD_WARDER, {
                [el.getAttribute("data-db")]: el.value
            });
        });




        if ( ! ( res = await warder.save(ADD_WARDER) ) ) {
            dialog.showErrorBox(`unexpected error`,`cannot save this information, contact the administrator`);
            return ;
        }

        res.viewWarder();
    });

    window.addEventListener("DOMContentLoaded", async (evt) => {
        util.initStates();
    });

    takePicture.addEventListener("click", evt =>  uploadPics.click() );

    uploadPics.addEventListener("change", evt => {
        const file = evt.target.files[0];
        fileReader.readAsDataURL(file);
    });

    fileReader.addEventListener("loadend", evt => {

        const img = warderPicPrev.querySelector("img");
        const container = document.querySelector(".__picture__preview__container");

        const { target: { result } } = evt;

        takePicture.classList.add("hide");

        container.value = img.src = result;

        img.classList.remove("hide");
        img.classList.add("preview-warder-picture");

        warderPicPrev.appendChild(addPicture());

    });


    employmentDate.addEventListener("change", evt => {
        const retirementDateEl = document.querySelector("[name=rtrdate]");
        const date = evt.target.valueAsDate;
        const retirementYear = date.getFullYear() + 32;

        retirementDateEl.valueAsDate = new Date(`${date.getMonth() + 1}/${date.getDate()}/${retirementYear}`);

    });


    form.addEventListener("reset", rmPicture);

    stateInput.addEventListener("input", util.lgaOfState);
    util.preventDataListDefault();
})();
