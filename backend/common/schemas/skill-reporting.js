const MONGOOSE = require("mongoose");
const { Schema } = MONGOOSE;
class SkillReportingSchema {
    static getSchema() {
        const SKILLREPORTING = new MONGOOSE.Schema({
        date : {
            type : String,
            required : true
        },
        skill_name : {
            type : String,
            required : true
        },
        count : {
            type : Number,
            required : true
        },
        bot_id : {
            type : String,
            required : true
        }
    },
            {
                timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
            }
        );
        return SKILLREPORTING;

    }
}
module.exports = SkillReportingSchema;