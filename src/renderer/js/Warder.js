const DB = require("./db.js");
const path = require("path");
const { remote: { getCurrentWindow, app } } = require("electron");
const { webContents } = getCurrentWindow();

module.exports = new(class Warder  extends DB {
    constructor(collection) {
        super(collection);
    }
    addWarder() {
        webContents.loadURL(`file://${app.getAppPath()}/src/renderer/pug/AddWarder.jade`);
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
    viewWarder() {
        webContents.loadURL(`file://${app.getAppPath()}/src/renderer/pug/ViewWarders.jade`);
    }
})("warder.db");
