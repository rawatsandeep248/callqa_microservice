const MONGOOSE = require('mongoose');

class PlatformDropdownConfigs {
    static getSchema() {
        const PLATFORM_DROPDOWN_CONFIGS_SCHEMA = new MONGOOSE.Schema(
            {
                module_name: {
                    type: String,
                    required: true,
                    unique: true,
                    index: true
                },
                dropdowns: [
                    {
                        dropdown_name: { type: String, required: true },
                        dropdown_values: { type: [String], required: true },
                        _id: false
                    }
                ]
            },
            {
                timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
            }
        );

        return PLATFORM_DROPDOWN_CONFIGS_SCHEMA;
    }
}

module.exports = PlatformDropdownConfigs;
