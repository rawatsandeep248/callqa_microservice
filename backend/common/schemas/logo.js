const mongoose = require('mongoose');

class LogoSchema {
    static getSchema() {
        const LOGO = new mongoose.Schema({
            tenant_id: {
                type: String,
                required: true
            },
            header: {
                data: {
                    type: Buffer, // Store the image as binary data
                    required: false
                },
                contentType: {
                    type: String, // MIME type of the image (e.g., image/png)
                    required: false
                }
            },
            login: {
                data: {
                    type: Buffer, // Store the image as binary data
                    required: false
                },
                contentType: {
                    type: String, // MIME type of the image (e.g., image/png)
                    required: false
                }
            },
            tag: {
                type: String,
            },
            created_at: {
                type: Date,
                default: Date.now
            },
            updated_at: {
                type: Date,
                // default: Date.now
            }
        });

        return LOGO;
    }
}

module.exports = LogoSchema;
