const MONGOOSE = require("mongoose");

class IVA_AUDITLOGS_SCHEMA {
    static getSchema() {
        const IVAAUDITLOGS = new MONGOOSE.Schema(
            {
                global_config: {
                    type: Object,
                    key: {
                        type: String,
                        required: false
                    },
                    previous_value: {
                        en: {
                            type: String,
                            required: false
                        },
                        es: {
                            type: String,
                            required: false
                        }
                    },
                    updated_value: {
                        en: {
                            type: String,
                            required: false
                        },
                        es: {
                            type: String,
                            required: false
                        }
                    }
                },
                script: {
                    type: Object,
                    skill: {
                        type: String,
                        required: false
                    },
                    node: {
                        type: String,
                        required: false
                    },
                    language: {
                        type: String,
                        required: false
                    },
                    utterances: {
                        previous_value: [{ type: String }],
                        updated_value: [{ type: String }],
                    },
                },
                updatedBy: {
                    type: String,
                    required: true
                }
            },
            {
                timestamps: { updatedAt: "updated_at" }
            }
        );
        return IVAAUDITLOGS;
    }
}

module.exports = IVA_AUDITLOGS_SCHEMA;