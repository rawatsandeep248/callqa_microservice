const MONGOOSE = require('mongoose');
class Conversations {
    static getSchema() {
        const CONVERSATIONS_SCHEMA = new MONGOOSE.Schema({
            unique_id: {
                type: String,
                required: true
            },
            summary:{
                type: String,
                required: true
            },
            key_concerns:{
                type: String,
                required: true
            },
            unique_id:{
                type: String,
                required: true
            },
            patient_id:{
                type:String
            },
            created_date:{
                type: Date,
                required: true
            }
         })
        return CONVERSATIONS_SCHEMA;
    }
}

module.exports = Conversations;
