
const { app } = require("electron");

const cp = require("child_process");
const path = require("path");


module.exports.handleSquirrel = () => {

    if ( process.argv.length === 1 ) return false;

    const appFolder = path.resolve(process.execPath, "..");
    const rootAtomFolder = path.resolve(appFolder, "..");
    const updateDotExe = path.resolve(path.join(rootAtomFolder, "Update.exe"));
    const extName = path.basename(process.execPath);
    
    const spawn = ( command, args ) => {
        
        let spProc , error;

        try {
            spProc = cp.spawn(command,args, { detached: true } );
        } catch (error) {}

	    return spProc;
    }

    const spUpdate = args => spawn(updateDotExe, args);
    
    const sqEvent = process.argv[1];
    
    switch ( sqEvent ) {
        case "--squirrel-install":
        case "--squirrel-updated":
            spUpdate(["--createShortcut", extName]);
            setTimeout( app.quit, 1000 );
            return true;
        case "--squirrel-uninstall":
            spUpdate(["--removeShortcut", extName]);
            setTimeout( app.quit, 1000 );
	        return true;
        case "--squirrel-obsolete":
	        app.quit();
            return true;
    }

}