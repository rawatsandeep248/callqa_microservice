const MONGOOSE = require("mongoose");
class DsConnectionSchema {
    static getSchema() {
        const DSCONNECTIONS = new MONGOOSE.Schema({
            db_credentials: {
                host: {
                    type: String,
                    required: true,
                },
                port: {
                    type: String,
                    required: true,
                },
                username: {
                    type: String,
                    required: true,
                },
                password: {
                    type: String,
                    required: true,
                },
                database_name: {
                    type: String,
                    required: true,
                },
                dbType: {
                    type: String,
                    required: true,
                },
                tenant_id: {
                    type: String,
                    required: true,
                },
                connection_name: {
                    type: String,
                    required: true,
                },
                isSrvString : {
                    type: Boolean,
                },
                haveSSL : {
                    type: Boolean,
                },
                ssl_credentials: {
                    actual_cert_filename: {
                        type: String,
                    },
                    actual_ca_filename: {
                        type: String,
                    },
                    actual_key_filename: {
                        type: String,
                    },
                    given_cert_filename: {
                        type: String,
                    },
                    given_ca_filename: {
                        type: String,
                    },
                    given_key_filename: {
                        type: String,
                    },
                },
                modified_by: {
                    type: String,
                },
                created_by: {
                    type: String,
                    required: true,
                },
            }
        },
            {
                timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
            }
        );
        const CSVUPLOADS = new MONGOOSE.Schema({
            csv_data: {
                collection_name: {
                    type: String,
                    required: true,
                },
                description: {
                    type: String,
                    required: true,
                },
                tenant_id: {
                    type: String,
                    required: true,
                },
                modified_by: {
                    type: String,
                },
                created_by: {
                    type: String,
                    required: true,
                },
                data_type: {
                    type: String,
                    required: true,
                }
            },
        },
            {
                timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
            }
        );
        return { DSCONNECTIONS: DSCONNECTIONS, CSVUPLOADS: CSVUPLOADS };
    }
}
module.exports = DsConnectionSchema;