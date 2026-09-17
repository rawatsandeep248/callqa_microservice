const MONGOOSE = require('mongoose');
class  Feedback_skills{
    static getSchema() {
        const FEEDBACK_SKILLS_SCHEMA = new MONGOOSE.Schema({
            skills: [
                {
                    skill_name: {
                        type: String,
                      },
                      skill_for: {
                        type: String,
                      },
                      added_by: {
                        type: String,
                      },
                }
            ]
        },
            {
                timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
            })
        return FEEDBACK_SKILLS_SCHEMA;
    }
}


module.exports = Feedback_skills;
