const DB = require("./db.js");

module.exports = new(class Warder extends DB {
    constructor(collection) {
        super(collection);
    }
})("warder.db");
