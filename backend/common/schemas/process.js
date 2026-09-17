const MONGOOSE = require("mongoose");
class ProcessSchema {
    static getSchema() {
        const PROCESS = new MONGOOSE.Schema(
            {
              name : {
                type: String,
                required: true,
              },
              schema : {
                type : [String],
                required : true,
              }
            }
        );
        return PROCESS;
    }
}
module.exports = ProcessSchema;