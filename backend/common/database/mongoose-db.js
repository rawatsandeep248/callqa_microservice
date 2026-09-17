const MONGOOSE = require('mongoose');

global.dbConnObj = {};

async function connectToDB(url) {
    try {
        if(!global.dbConnObj[url]) {
            global.dbConnObj[url] = await MONGOOSE.connect(url, { autoIndex: false, bufferCommands: true, family: 4, maxPoolSize: 10, maxIdleTimeMS: 1000 });
        }
        return global.dbConnObj[url];
    } catch(err) {
        global.dbConnObj[url] ? delete global.dbConnObj[url]: "";
        return err;
    }
}

function createNewDBConnection(url) {
    try {
        return MONGOOSE.createConnection(url, { autoIndex: false, bufferCommands: true, family: 4, maxPoolSize: 5, maxIdleTimeMS: 1000 });
    } catch(err) {
        return err;
    }
}

function createSeparateConnection(url, database_name) {
    try {
        return MONGOOSE.createConnection(url, { dbName: database_name, bufferCommands: true, family: 4, maxPoolSize: 5, maxIdleTimeMS: 1000 });
    } catch(err) {
        return err;
    }
}

module.exports = { connectToDB, createNewDBConnection, createSeparateConnection }

