const MONGOOSE = require("mongoose");
class DsMapperSchema {
    static getSchema() {
        const DSMAPPER = new MONGOOSE.Schema(
            {
                mongo: [
                    {
                        collection_name: {
                            type: String,
                            required: true,
                        },
                        process_name: {
                            type: String,
                            required: true,
                        },
                        source_schema: {
                            type: [String],
                            required: true,
                        },
                        target_schema: {
                            type: [String],
                            required: true,
                        },
                        db_connection_name : {
                            type: String,
                            required: true,
                        },
                        dsSource : {
                            type : String,
                            required : true,
                        }
                    }
                ],
                mysql: [
                    {
                        collection_name: {
                            type: String,
                            required: true,
                        },
                        process_name: {
                            type: String,
                            required: true,
                        },
                        source_schema: {
                            type: [String],
                            required: true,
                        },
                        target_schema: {
                            type: [String],
                            required: true,
                        },
                        db_connection_name : {
                            type: String,
                            required: true,
                        },
                        dsSource : {
                            type : String,
                            required : true,
                        }
                    }
                ],
                xls: [
                    {
                        collection_name: {
                            type: String,
                            required: true,
                        },
                        process_name: {
                            type: String,
                            required: true,
                        },
                        source_schema: {
                            type: [String],
                            required: true,
                        },
                        target_schema: {
                            type: [String],
                            required: true,
                        },
                        db_connection_name : {
                            type: String,
                            required: true,
                        },
                        dsSource : {
                            type : String,
                            required : true,
                        }
                    }
                ],
                created_by: {
                    type: String,
                    required: true
                },
                modified_by: {
                    type: String,
                    required: false
                }
            }
        );
        return DSMAPPER;
    }
}
module.exports = DsMapperSchema;