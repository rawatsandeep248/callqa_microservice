const MONGOOSE = require('mongoose');
const MESSAGEUTIL = require('../utils/message-util')

class AuthTokenSchema {
    static getSchema() {
        const AUTH_TOKEN = new MONGOOSE.Schema({
            token: {
                type: Object
            },
            type:{
                type: String,
                enum: [
                    MESSAGEUTIL.info().oauth_token.management,
                    MESSAGEUTIL.info().oauth_token.authorization,
                    MESSAGEUTIL.info().oauth_token.keycloak
                  ],
            }
        }, 
        {
            timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
        })
        
        // const AUTH_TOKEN_SCHEMA = CONNECTION.model(MESSAGEUTIL.info().database_collections.auth_token, AUTH_TOKEN);
        return AUTH_TOKEN;
    }    
}
module.exports = AuthTokenSchema;
