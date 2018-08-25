
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

    getCellMate() {

        const cellMate = new this.DataStore({
            filename: path.join(app.getPath("userData"), "cell.db")
        });

        cellMate.loadDatabase( this.err );

        return new Promise( ( resolve, reject ) => {

            cellMate.findOne( { filledUp: false, cellNumber: Math.floor(Math.random(300) * 300) }, ( err , { cellNumber } ) => {

                if ( err ) {
                    reject(err);
                    return ;
                }

                this.db.find( { cellNumber } , ( err , doc ) => {
                    if ( err )
                        return reject(err);

                    return resolve({ inMate: doc , cellNumber });
                });
            });
        });

    }

})("prisoner.db");
