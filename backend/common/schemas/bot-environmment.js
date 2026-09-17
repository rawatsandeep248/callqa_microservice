const MONGOOSE = require("mongoose");
// MONGOOSE.pluralize(null);
 
class BOTENVIRONMENTS_SCHEMA {
    static getSchema() {
        const BOTENVIRONMENTS = new MONGOOSE.Schema(
            {
                tenant_id: {
                    type: String,
                    required: true,
                },              
                environments:{
                    dev : {
                    type : String,
                    required : true,
                   },
                   qa : {
                    type : String,
                    required : true,
                   },
                   prod : {
                    type : String,
                    required : true,
                   },
                }
            }
        );
        return BOTENVIRONMENTS;
    }
}
 
module.exports = BOTENVIRONMENTS_SCHEMA;