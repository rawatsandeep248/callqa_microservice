const MONGOOSE = require('mongoose');

class GoogleTtsSchema {
    static getSchema() {
        const GOOGLE_TTS = new MONGOOSE.Schema({
            language : {
                type: String
            },
            voice_type :  {
                type: String
            },
            language_code : {
                type: String
            },
            voice_name : {
                type: String
            },
            SSML_gender :  {
                type: String
            },
        }, 
        {
            timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
        })
        return GOOGLE_TTS;
    }
}

module.exports = GoogleTtsSchema;