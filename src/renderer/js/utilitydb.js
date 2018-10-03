
const { remote: { getCurrentWindow, app } } = require("electron");

const { webContents } = getCurrentWindow();

module.exports = {

    addRecordView(filename) {
        webContents.loadURL(`file://${app.getAppPath()}/src/renderer/html/${filename}.html`);
    },
    
    viewRecordView(filename) {
        webContents.loadURL(`file://${app.getAppPath()}/src/renderer/html/${filename}.html`);
    },
    
    deleteRecordView(filename) {
        webContents.loadURL(`file://${app.getAppPath()}/src/renderer/html/${filename}.html`);
    },
    
    async saveRecord(data) {
        
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
    },

    async updateRecord( query = {}, options = {} ) {
        
        let result;
        
        try {
            result = await this.update(query, options);
        } catch(ex) {
            result = ex;
        }
        if ( Error[Symbol.hasInstance](result) ) {
            return false;
        }

        if ( result !== 0 )
            return true;
        return false;
    },

    async viewRecord(query = {}) {
        
        let result ;
        
        try {
            result = await this.view(query);
        } catch(ex) {
            result = ex;
        }
        if ( Error[Symbol.hasInstance](result) )
            return false;
        return result;
    },

    async deleteRecord(query = {}, options = {} ) {
        
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
};
