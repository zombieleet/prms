
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

    async save(data) {
        let result;
        try {
            result = await this.add(data);
        } catch(ex) {
            result = ex;
        }
        if ( Error[Symbol.hasInstance](result) ) {
            return false;
        }
        return this;
    }

    async __viewPrisoner(query = {}) {
        let result ;
        try {
            result = await this.view(query);
        } catch(ex) {
            result = ex;
        }
        if ( Error[Symbol.hasInstance](result) )
            return false;
        return result;
    }

    viewPrisoner() {
        webContents.loadURL(`file://${app.getAppPath()}/src/renderer/pug/ViewPrisoner.jade`);
    }

    async deletePrisoner(query = {}, options = {} ) {
        let result;
        try {
            result = await this.delete(query, options);
        } catch(ex) {
            result = ex;
        }
        if ( Error[Symbol.hasInstance](result) )
            return false;
        return true;
    }

})("prisoner.db");
