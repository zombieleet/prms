
; ( () => {
    
    require("../js/util.js").colorMode();
    
    const { remote: { getCurrentWindow }  } = require("electron");
    
    const prisoner = require("../js/Prisoner.js");
    const warder = require("../js/Warder.js");
    const visitor = require("../js/Visitor.js");

    console.log(prisoner);
    
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

        const arg = target.getAttribute("data-arg");
        
        switch(type) {
        case "prisoner":
            prisoner[execType](arg);
            break;
        case "warder":
            warder[execType](arg);
            break;
        case "visitor":
            visitor[execType](arg);
        default:
            ;
        }
    });
})();
