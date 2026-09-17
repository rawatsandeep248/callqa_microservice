const MONGOOSE = require("mongoose");

class BOTAUDITLOGS_SCHEMA {
    static getSchema() {
        const BOTAUDITLOGS = new MONGOOSE.Schema(
            {
                ip: {
                    type: String,
                    required: true,
                },
                updated_by: {
                    type: String,
                    required: true
                },
                type: {
                    type: String,
                    required: true
                },
                language: {
                    type: String,
                    required: true
                },
                skill: {
                    type: String,
                    required: false
                },
                additonalInfo: [
                    {
                        mode:{
                       type: String
                     },
                       text : {
                        type: String,
                       }

                    }
                ],
                mode: {
                    type: [String],
                    required: true
                },
                value: {
                    type: String,
                    required: false
                },
                key: {
                    type: String
                }
            },
            {
                timestamps: { updatedAt: "updated_at" },
            }
        );
        return BOTAUDITLOGS;
    }
}

module.exports = BOTAUDITLOGS_SCHEMA;
