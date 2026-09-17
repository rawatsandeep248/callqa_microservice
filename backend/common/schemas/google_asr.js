const MONGOOSE = require('mongoose');

class GoogleAsrSchema {
    static getSchema() {
        const GOOGLE_ASR = new MONGOOSE.Schema({
            region : {
                type: String
            },
            language_code : {
                type: String
            },
            model :  {
                type: String
            },
            automatic_punctuation : {
                type: Boolean
            },
            boost :  {
                type: Boolean
            },
        }, 
        {
            timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
        })
        return GOOGLE_ASR;
    }
}

module.exports = GoogleAsrSchema;