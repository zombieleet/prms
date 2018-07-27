const path = require("path");
const { remote: { app, dialog }  } = require("electron");


const DataStore = require("nedb");


module.exports = class DB {

    constructor(collection) {

        this.db = new DataStore({
            filename: path.join(app.getPath("userData"), collection)
        });

        this.DataStore = DataStore;
        this.err = err => err ? dialog.showErrorBox("unexpected error", "cannot load database " + err): "";

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
};
