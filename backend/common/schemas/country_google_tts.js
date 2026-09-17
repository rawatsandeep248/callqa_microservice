const MONGOOSE = require('mongoose');

class CountryGoogleTtsSchema {
    static getSchema() {
        const COUNTRY_GOOGLE_TTS = new MONGOOSE.Schema({
            country_list: {
                type: Array
            }
        }, 
        {
            timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
        })
        return COUNTRY_GOOGLE_TTS;
    }
}

module.exports = CountryGoogleTtsSchema;