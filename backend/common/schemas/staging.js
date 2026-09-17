const MONGOOSE = require('mongoose');
class Statinga{
    static getSchema() {
        const STAGING_SCHEMA = new MONGOOSE.Schema({
            environments :[
                {
                    name : {
                        type : String
                    },
                    collection : {
                        type : String
                    }
                }
            ],
            state : {
                type : String,
                required : true
            },
            stateCode : {
                type : String,
                required : true
            }
        },           
         {
            timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
        })
        return STAGING_SCHEMA;
    }
}

module.exports = Statinga;

