const MONGOOSEDB = require("../database/mongoose-query");
const COMMONUTIL = require("../utils/common-util");
const MessageUtil = require("../utils/message-util");
class AuthService {
    constructor(config) {
        this.config=config;
        this.mongoose = new MONGOOSEDB();
        this.findCustomerConfig=this.findCustomerConfig.bind(this);
    }


  async findCustomerConfig(collection, databaseUrl, tenant_id) {
    try {
      let query = { tenant_id: tenant_id };
      let collectionModel = COMMONUTIL.getMongooseCollection(collection);
      let response = await this.mongoose.find_record(collection, databaseUrl, collectionModel, MessageUtil.info().database_req_type.master , query, {
        database: 1,
      });
      return response;
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = AuthService;
