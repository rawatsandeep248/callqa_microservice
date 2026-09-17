const MONGOOSE = require('mongoose');

class AZURE_TTS_SCHEMA {
    static getSchema() {
        const AZURE_TTS = new MONGOOSE.Schema(
            {
                code: {
                    type: String,
                },
                language: {
                    type: String,
                },
                style: [
                    {
                        style_name : {
                            type: String,
                        },
                        voices : {
                            male : [{
                                type : String,
                            }],
                            female : [{
                                type : String,
                            }]
                        }
                    }
                ]
            }
        );
        return AZURE_TTS;
    }
}

module.exports = AZURE_TTS_SCHEMA;