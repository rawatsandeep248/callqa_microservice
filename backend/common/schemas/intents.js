const MONGOOSE = require('mongoose');
class  Intents{
    static getSchema() {
        const INTENTS_SCHEMA = new MONGOOSE.Schema({
            response_data: {
                type: Object,
            },
            request_data:{
                type: Object,
            },
            request_url:{
                type: String,
            },
            tested_by: {
                type: String,
            },
            feedback: {
                type: Boolean
            },
            updated_by: {
                type: String
            }
        },
            {
                timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
            })
        return INTENTS_SCHEMA;
    }
}


module.exports = Intents;
