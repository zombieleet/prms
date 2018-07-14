; ( () => {
    const { remote: { getCurrentWindow }  } = require("electron");
    const prisoner = require("../js/Prisoner.js");

    const prisFunc = document.querySelector(".prison-functions");

    prisFunc.addEventListener("click", evt => {
        
        let { target } = evt;

        target = HTMLParagraphElement[Symbol.hasInstance](target)
            ? target.parentNode
            : ( () => {
                if ( HTMLLIElement[Symbol.hasInstance](target) )
                    return target;
                return undefined;
            })();
        
        if ( ! target )
            return;

        const type = target.parentNode.getAttribute("data-sect");
        const execType = target.getAttribute("data-execute");

        switch(type) {
        case "prisoner":
            prisoner[execType]();
            break;
        case "warder":
            break;
        default:
            ;
        }
    });
})();
