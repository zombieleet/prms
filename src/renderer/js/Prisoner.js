
const DB = require("./db.js");
const { remote: { app, getCurrentWindow } } = require("electron");
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
    
})("prisoner");
