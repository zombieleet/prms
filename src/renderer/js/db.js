const path = require("path");
const { remote: { app, dialog }  } = require("electron");


const DataStore = require("nedb");

            
const cellCollection = new(require("nedb"))({
    filename: path.join(app.getPath("userData"), "cell.db"),
    autoload: true
});

cellCollection.count({}, ( err, count ) => {
    if ( err ) {
        dialog.showErrorBox("unexpected error", "cannot initiaize database");
        return ;
    }
    if ( count !== 0 )
        return ;
    for ( let i = 0; i < 300 ; i++ ) {
        cellCollection.insert( { cellNumber: i, filledUp: false, maxCellMate: 4 } , ( err, doc ) => {
            if ( err ) {
                dialog.showErrorBox("unexpected error", "cannot initiaize database");
                return ;
            }
        });
    }
});


module.exports = class DB {
    constructor(collection) {
        
        this.db = new DataStore({
            filename: path.join(app.getPath("userData"), collection)
        });
        
        this.DataStore = DataStore;
        this.err = err => err ? dialog.showErrorBox("unexpected error", "cannot load database") : "";
        
        this.db.loadDatabase( this.err );
    }

    add(prisonerCred) {
        return new Promise(( resolve, reject ) => {
            this.db.insert(prisonerCred, ( err, docs ) => {
                if ( err )
                    return reject(err);
                return resolve(docs);
            });
        });
    }

    view(query = {}) {
        return new Promise((resolve,reject) => {
            this.db.find(query, ( err, docs ) => {
                if ( err )
                    return reject(err);
                return resolve(docs);
            });
        });
    }

    delete(query = {} , options = {}  ) {
        return new Promise((resolve,reject) => {
            this.db.remove(query, options, ( err, nums ) => {
                if ( err )
                    return reject(err);
                return resolve(nums);
            });
        });
    }

    update( query = {}, options = {} ) {
        return new Promise( (resolve,reject) => {
            this.db.update(query, options, ( err, nums ) => {
                if ( err )
                    return reject(err);
                return resolve(nums);
            });
        });
    }
}

