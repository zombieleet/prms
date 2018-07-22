; ( () => {
    
    const util = require("../js/util.js");
    const bview = document.querySelector(".prev-view");


    bview.addEventListener("click", util.navigateWebView);
    
    util.preventDataListDefault();
})();
