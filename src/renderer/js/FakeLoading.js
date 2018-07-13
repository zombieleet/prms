; ( () => {
    "use strict";
    console.log("hi");
    document.addEventListener("DOMContentLoaded", () => {
        const title = document.querySelector("title");
        
        const dotOne = setInterval( () => {
            if ( title.textContent === "Loading" ) {
                title.textContent = "Loading.";
            }
        }, 500);

        const dotTwo = setInterval( () => {
            if ( title.textContent === "Loading." ) {
                title.textContent = "Loading..";
            }
        }, 1000);

        const dotThree = setInterval( () => {
            if ( title.textContent === "Loading.." ) {
                title.textContent = "Loading...";
            }
        }, 1500);
    });
})();
