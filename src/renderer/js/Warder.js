const DB = require("./db.js");
const path = require("path");
const { remote: { getCurrentWindow, app } } = require("electron");
const { webContents } = getCurrentWindow();

module.exports = new(class Warder extends DB {
    
    constructor(collection) {
        super(collection);
    }
    
    addWarder() {
        webContents.loadURL(`file://${app.getAppPath()}/src/renderer/pug/AddWarder.jade`);
    }
    
    viewWarder() {
        webContents.loadURL(`file://${app.getAppPath()}/src/renderer/pug/ViewWarders.jade`);
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
    async __viewWarder( query = {} ) {
        let result ;
        try {
            result = await  this.view(query);
        } catch(ex) {
            result = ex;
        }
        if ( Error[Symbol.hasInstance](result) )
            return false;
        return result;
    }
    async deleteWarder(query = {}, options = {} ) {
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
})("warder.db");
