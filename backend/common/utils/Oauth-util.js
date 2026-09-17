const RestUtil = require('./rest-util');
const MONGOOSEDB = require('../database/mongoose-query');
const COMMONUTIL = require('./common-util');
const MESSAGEUTIL = require('./message-util');
const qs = require('querystring');
class OauthUtil {

    constructor(config) {
        this.config = config;
        this.restUtil = new RestUtil();
        this.mongoose = new MONGOOSEDB();
        this.getAccessToken = this.getAccessToken.bind(this);
        this.createAccessToken = this.createAccessToken.bind(this);
        this.getAuthorizationAccessToken = this.getAuthorizationAccessToken.bind(this);
        this.createAuthorizationAccessToken = this.createAuthorizationAccessToken.bind(this);
        this.getKeycoakAccessToken = this.getKeycoakAccessToken.bind(this);
        this.createKeycloakAccessToken = this.createKeycloakAccessToken.bind(this);
    }


    async getAccessToken() {
        try {
            let collectionModel = COMMONUTIL.getMongooseCollection(MESSAGEUTIL.info().database_collections.auth_token);
            let {url, customer_config} = await this.getCustomerConfig();
            let response = await this.mongoose.find_record(MESSAGEUTIL.info().database_collections.auth_token, url, collectionModel, MESSAGEUTIL.info().database_req_type.master, {type:'management'}, {});
            let token;
            if (response.result && response.result[0] && response.result[0].token) {
                let hours_diff = Math.abs(new Date() - new Date(response.result[0].updated_at)) // 36e5;
                //console.log("====check", hours_diff)
                if (hours_diff < 24) {
                    return response.result[0].token;
                } else {
                    token = await this.createAccessToken("update", response.result[0].updated_at);
                    //console.log("tokennnnnnnnnnnnnnnnn", token);
                    return token;
                }
            } else {
                token = await this.createAccessToken("insert", "");
                return token;
            }
        } catch (err) {
            throw new Error(err)
        }
    }

    async createAccessToken(type, update_time) {
        try {
            let data = {
                // "client_id": this.config.get('client_id'),
                // "client_secret": this.config.get('client_secret'),
                // "audience": `${this.config.get('audience_management_api')}`,
                // "grant_type": "client_credentials"

                "client_id": "",
                "client_secret": "",
                "audience": "",
                "grant_type": ""
            };
            let options = {
                headers: { 'content-type': 'application/json' },
            }
            // let url = this.config.get('oauth:token_url');
      let url = '';

            let response = await this.restUtil.postRequest(url, data, options);
            this.storeAccessToken(type, response.data, update_time, MESSAGEUTIL.info().oauth_token.management)
            return response.data;
        } catch (err) {
            throw new Error(err);
        }
    }

    async storeAccessToken(type, token, update_time, token_type) {
        try {
            let data = {
                token: token,
                type: token_type
            }
            let {url, customer_config} = await this.getCustomerConfig();
            let collectionModel = COMMONUTIL.getMongooseCollection(MESSAGEUTIL.info().database_collections.auth_token);
            if (type == "insert") {
                console.log("=========inserting")
                this.mongoose.create_record(MESSAGEUTIL.info().database_collections.auth_token, url, collectionModel, MESSAGEUTIL.info().database_req_type.customer, data);
            } else {
                //console.log("=========updating")
                let query = { updated_at: update_time };
                this.mongoose.find_and_update(MESSAGEUTIL.info().database_collections.auth_token, url, collectionModel, MESSAGEUTIL.info().database_req_type.customer, query, data)
            }
            return token;
        } catch (err) {
            throw new Error(err)
        }
    }

    async getAuthorizationAccessToken() {
        try {
            let collectionModel = COMMONUTIL.getMongooseCollection(MESSAGEUTIL.info().database_collections.auth_token);
            let {url, customer_config} = await this.getCustomerConfig();
 
            // console.log("collectionModel",collectionModel)
            let response = await this.mongoose.find_record(MESSAGEUTIL.info().database_collections.auth_token, url, collectionModel, MESSAGEUTIL.info().database_req_type.customer, {type: 'authorization'}, {});
            let token;
            if (response.result && response.result[0] && response.result[0].token) {
                let hours_diff = Math.abs(new Date() - new Date(response.result[0].updated_at)) // 36e5;
                console.log("====check", hours_diff)
                if (hours_diff < 24) {
                    return response.result[0].token;
                } else {
                    token = await this.createAuthorizationAccessToken("update", response.result[0].updated_at);
                    return token;
                }
            } else {
                token = await this.createAuthorizationAccessToken("insert", "");
                return token;
            }
        } catch (err) {
            throw new Error(err)
        }
    }

    async createAuthorizationAccessToken(type, update_time) {
        try {
            let data = {
                // "client_id": this.config.get('authentication_extention_auth0:client_id'),
                // "client_secret": this.config.get('authentication_extention_auth0:client_secret'),
                // "audience": `${this.config.get('authentication_extention_auth0:audience')}`,
                // "grant_type": "client_credentials"

                "client_id": "",
                "client_secret": "", 
                "audience": "",
                "grant_type": ""
            };
            let options = {
                headers: { 'content-type': 'application/json' },
            }
            // let url = this.config.get('authentication_extention_auth0:token_url');
            let url = "";
            const response = await this.restUtil.postRequest(url, data, options);
            this.storeAccessToken(type, response.data, update_time, MESSAGEUTIL.info().oauth_token.authorization)
            return response.data;
        } catch (err) {
            throw new Error(err);
        }
    }

    async randomArray(size) {
        let arr = [];
        for (let count = 0; count < size; count++) {
            arr.push((Math.random() * 500).toFixed(0))
        }
        return arr;
    }

    async getKeycoakAccessToken() {
        try {
            let {url, customer_config} = await this.getCustomerConfig();
            // console.log("customer_config",customer_config)
            let collectionModel = COMMONUTIL.getMongooseCollection(MESSAGEUTIL.info().database_collections.auth_token);
            let response = await this.mongoose.find_record(MESSAGEUTIL.info().database_collections.auth_token, url, collectionModel, MESSAGEUTIL.info().database_req_type.customer, {type: MESSAGEUTIL.info().oauth_token.keycloak}, {});
            let token;
            if (response.result && response.result[0] && response.result[0].token) {
                let hours_diff = Math.abs(new Date() - new Date(response.result[0].updated_at)) // 36e5;
                console.log("====check", hours_diff)
                if (hours_diff < 24) {
                    return response.result[0].token;
                } else {
                    token = await this.createKeycloakAccessToken("update", response.result[0].updated_at);
                    return token;
                }
            } else {
                token = await this.createKeycloakAccessToken("insert", "");
                return token;
            }
        } catch (err) {
            throw new Error(err)
        }
    }

    async createKeycloakAccessToken(type, update_time) {
        try {
            let data = {
                "client_id": this.config.get('keycloak:client_id'),
                "client_secret": this.config.get('keycloak:client_secret'),
                "grant_type": "client_credentials"
            };
            let options = {
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
            }
            // Encode the data
            const encodedData = qs.stringify(data);
            let url = this.config.get('keycloak:url') + '/realms/'+this.config.get('keycloak:realm')+'/protocol/openid-connect/token';
            // console.log("req data",data, url)
            const response = await this.restUtil.postRequest(url, encodedData, options);
            this.storeAccessToken(type, response.data, update_time, MESSAGEUTIL.info().oauth_token.keycloak)
            return response.data;
        } catch (err) {
            console.log("error in createKeycloakAccessToken",err)
            throw new Error(err);
        }
    }

    async getCustomerConfig(req, res, next) {
        try {
            let host_from_config = this.config.get('database:host');
                    let user_from_config = this.config.get('database:user');
                    let password_from_config = this.config.get('database:password');
                    let name_from_config = this.config.get('database:name');
                    let customer_config = {
                        database: {
                            host: host_from_config,
                            user: user_from_config,
                            password: password_from_config,
                            name: name_from_config
                        }
                    }
                    let url = host_from_config;
                    url = url.replace("$username", user_from_config);
                    url = url.replace("$password", password_from_config);
                    url = url.replace("$database", name_from_config);
                    return {url: url, customer_config: customer_config};
        } catch (err) {
            throw new Error(err);
        }
    }
}

module.exports = OauthUtil;       
