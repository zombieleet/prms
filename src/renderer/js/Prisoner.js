
const DB = require("./db.js");
const path = require("path");

const { remote: { app, dialog, getCurrentWindow } } = require("electron");
const { webContents } = getCurrentWindow();

// const {
//     firstName,
//     lastName,
//     dob,
//     crimeCommitted,
//     chargedYears,
//     picture,
//     address,
//     assignedJailNo
// } = prisonerCred;

module.exports = new(class Prisoner extends DB {
    
    constructor(collection) {
        super(collection);
    }
    addPrisoner() {
        webContents.loadURL(`file://${app.getAppPath()}/src/renderer/pug/AddPrisoner.jade`);
    }
    getCellMate(crimeCommitted = undefined) {
        
        const cellMate = new this.DataStore({
            filename: path.join(app.getPath("userData"), "cell")
        });
        
        cellMate.loadDatabase( this.err );
        
        return new Promise( ( resolve, reject ) => {

            cellMate.find( { filledUp: false }, ( err, { cellNumber } ) => {
                if ( err ) {
                    reject(err);
                    return ;
                }
                this.db.find( { cellNumber, crimeCommitted: { $nin: crimeCommitted } } , ( err , doc ) => {
                    if ( err )
                        return reject(err);
                    return resolve(doc);
                });
            });
        });

    }
})("prisoner");
