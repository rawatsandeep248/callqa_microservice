// const {MongoClient} = require('mongodb');
const mongoClient = require('mongodb').MongoClient

class MongoDB {
    constructor(url) {
        this.url = url;
    }

    async connect() {
        try {
            this.client = new mongoClient(this.url);
            return await this.client.connect();
        } catch (err) {
            console.log("Error while creating db connection:", err)
        }
    }

    async findManyRecord(collection, query, fields) {
        try {
            let client = await this.connect();
            let response = await client.db().collection(collection).find(query, fields).toArray();
            client.close();
            return response;
        } catch (err) {
            throw err;
        }
    };

    async findRecord(collection, query, fields) {
        try {
            let client = await this.connect();
            let response = await client.db().collection(collection).findOne(query,fields) ;
            client.close();
            return response;
        } catch (err) {
            throw err;
        }
    };


    async insertRecord(collection, data) {
        try {
            let client = await this.connect();
            let response = await client.db().collection(collection).insertOne(data);
            client.close();
            return response;
        } catch (err) {
            throw err;
        }
    };

    async insertManyRecord(collection, data) {
        try {
            let client = await this.connect();
            let response = await client.db().collection(collection).insertMany(data);
            client.close();
            return response;
        } catch (err) {
            throw err;
        }
    };

    async testMongoConnection(url){
        try{
            let tesClient = new mongoClient(url);
            const result =  await tesClient.connect();
            await tesClient.close() ;
            return  { msg : "connection tested successfully", result} ;
        }catch(err){
            throw { msg: "error while creating connection", err} ;
        }
    }
    async getAllCollections() {
        try {
            // let testClient = new mongoClient(url);
            // await testClient.connect();
            let client = await this.connect();
            const db = client.db();
            // console.log("results_Client:::::::;;;", client)
            const dbCollections = await db.listCollections().toArray();
            console.log("db collecrtions:::::::;;;", dbCollections);
            await client.close();
            return dbCollections ;
        }
        catch (err) {
            throw err ;
        }
    }

}

module.exports = MongoDB;
