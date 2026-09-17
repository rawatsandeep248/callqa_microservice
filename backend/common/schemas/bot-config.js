const MONGOOSE = require("mongoose");
// MONGOOSE.pluralize(null);
class BOTCONFIG_SCHEMA {
    static getSchema() {
        const BOTCONFIG = new MONGOOSE.Schema(
            {
                isUpdated: {
                    type: Boolean,
                    required: true,
                },
                lastSyncedInRedis: {
                    type: Date,
                    required: false
                },
                lastSyncedStatus : {
                    type  : Boolean,
                    default : false
                },
                updatedBy: {
                    type: String,
                    required: true
                },
                active_version :{
                    type:Boolean,
                    required:true
                },
                description :{
                    type:String,
                    required:false
                },
                version_id :{
                    type:String,
                    required:true
                },
                version_name :{
                    type:String,
                    required:true
                },
                imported :{
                    type:Boolean,
                    default : false
                },
                importedThroughJson :{
                    type:Boolean,
                    default : false
                },
                data : {
                   slots : {
                    type : Object,
                    required : true,
                   },
                   responses : {
                    type : Object,
                    required : true,
                   },
                   dataTypes:{
                    type : Object,
                    required : true,
                   }
                }
            },
            {
                timestamps: { createdAt: 'created_at', updatedAt: 'lastUpdated' },
            }
        );
        return BOTCONFIG;
    }
}

module.exports = BOTCONFIG_SCHEMA;
