const MONGOOSE = require('mongoose');

class CallaiAsrSchema {
    static getSchema() {
        const CALLAI_ASR = new MONGOOSE.Schema({
            region : {
                type: String
            },
            language_code : {
                type: String
            },
            model :  {
                type: Array
            }
        })
        return CALLAI_ASR;
    }
}

module.exports = CallaiAsrSchema;

