const AUTHENTICATIONSERVICE = require('../service/auth-service');
const CryptoJS = require('crypto-js');
const MESSAGEUTIL = require("../utils/message-util");

class ConfigHandler {
    constructor(config) {
        this.config = config;
        this.authService = new AUTHENTICATIONSERVICE(config);
        this.fetchCustomerConfig = this.fetchCustomerConfig.bind(this);
    }

    async fetchCustomerConfig(req, res, next) {
        console.log("fetchCustomerConfig called");
        try {
            let customer_config = {};
            // let tenant_id = req.body?.tenant_id || req.params?.tenant_id || req.query?.tenant_id || req.body?.tts?.tenant_id || req.body?.asr?.tenant_id;;
            // if (!tenant_id) {
            //     res.notFound({ message: MESSAGEUTIL.error().TENANT_ID_NOT_PROVIDED })
            // }
            // else {
                let host_from_config = this.config.get('database:host');
                    let user_from_config = this.config.get('database:user');
                    let password_from_config = this.config.get('database:password');
                    let name_from_config = this.config.get('database:name');
                    customer_config = {
                        database: {
                            host: host_from_config,
                            user: user_from_config,
                            password: password_from_config,
                            name: name_from_config
                        }
                    }
                    req.customer_config = customer_config;
                    next();
            // }
        } catch (err) {
            console.log("err", err);
            next(err)
        }
    }

}

module.exports = ConfigHandler;
