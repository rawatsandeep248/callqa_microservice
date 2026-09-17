const MONGOOSE = require('mongoose');
class Transaction {
    static getSchema() {
        const TRANSACTION_SCHEMA = new MONGOOSE.Schema({
            session_id: {
                type: String,
                required: true
            },
            time_elapsed:{
                type: String,
                required: true
            },
            name:{
                type: String,
                required: true
            },
            request_type:{
                type: String,
                required: true
            },
            url:{
                type:String
            },
            response_code:{
                type: String,
                required: true
            },
            request_body:{
                type: Object,
                required: true
            },
            response_body:{
                type: Object,
                required: true
            },
            // timestamp:{
            //     type: Date,
            //     required: true
            // },         
         },
         {
            timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
        })
        return TRANSACTION_SCHEMA;
    }
}

module.exports = Transaction;

