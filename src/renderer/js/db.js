const path = require("path");
const { remote: { app }  } = require("electron");

module.exports = class DB {
    constructor(collection) {
        this.db = new(require("nedb"))({
            filename: path.join(app.getPath("userData"), collection),
            autoload: true
        });
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

