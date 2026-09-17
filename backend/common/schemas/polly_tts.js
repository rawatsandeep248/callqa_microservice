const MONGOOSE = require('mongoose');

class PollyTtsSchema {
    static getSchema() {
        const POLLY_TTS = new MONGOOSE.Schema({
            language : {
                type: String
            },
            name_gender : [
                {
                    name : {
                        type: String
                    },
                    gender : {
                        type: String
                    }
                }
            ],
            neural_voice : {
                type: Array
            },
            standard_voice :  {
                type: Array
            }
        }, 
        {
            timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
        })
        return POLLY_TTS;
    }
}

module.exports = PollyTtsSchema;