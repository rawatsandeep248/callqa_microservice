const MONGOOSE = require('mongoose');

class SidebarSchema {
    static getSchema() {
        const SIDEBAR = new MONGOOSE.Schema({
            path: {
                type: String,
            },
            title: {
                type: String,
            },
            module_name: {
                type: String,
            },
            icon_type: {
                type: String
            },
            icon: {
                type: String,
            },
            class: {
                type: String,
            },
            group_title: {
                type: Boolean,
                default: false
            },
            badge: {
                type: String,
            },
            badge_class: {
                type: String
            },
            role: [],
            submenu: [
                {
                    path: {
                        type: String,
                    },
                    title: {
                        type: String,
                    },
                    module_name: {
                        type: String,
                    },
                    icon_type: {
                        type: String
                    },
                    icon: {
                        type: String,
                    },
                    class: {
                        type: String,
                    },
                    group_title: {
                        type: Boolean,
                        default: false
                    },
                    badge: {
                        type: String,
                    },
                    badge_class: {
                        type: String
                    },
                    role: [],
                    submenu: []
                }
            ],
            p: {
                type: Number,
                require: true
            }
        },
        {
            timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        })

        return SIDEBAR
    }
}
module.exports = SidebarSchema;