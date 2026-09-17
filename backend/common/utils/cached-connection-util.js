const AUTHENTICATIONSERVICE = require("../../microservice/campaign/service/auth-service");
const MESSAGEUTIL = require("../utils/message-util");
const CryptoJS = require("crypto-js");

class CheckCachedConnection {
  constructor(config) {
    this.authService = new AUTHENTICATIONSERVICE(config);
    this.config = config;
  }

  async fetchDBConection(tenant_id) {
    console.log("Fetching DB Connection for Tenant ID:", tenant_id);
    let customer_config = {};
    const getDBDetailsFromConfig = this.config.get("database");
      console.log("Config Picked From Config");
      customer_config.database = getDBDetailsFromConfig;
    return customer_config;
  }
}

module.exports = CheckCachedConnection;
