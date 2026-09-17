const MONGOOSE = require('mongoose');

class CountryGoogleASRSchema {
    static getSchema() {
        const COUNTRY_GOOGLE_ASR = new MONGOOSE.Schema({
            language_code: {
                type: String
            },
            region: {
                type: String
            }
        })
        return COUNTRY_GOOGLE_ASR;
    }    
}

module.exports = CountryGoogleASRSchema;