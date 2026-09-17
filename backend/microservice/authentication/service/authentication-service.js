const MONGOOSEDB = require("../../../common/database/mongoose-query");
const COMMONUTIL = require("../../../common/utils/common-util");
const randToken = require("rand-token");
const bcrypt = require("bcryptjs");
const MESSAGEUTIL = require("../../../common/utils/message-util");
const { ...MODELS } = require('../../../common/database/models');
const DATEUTIL = require("../../../common/utils/date-util");
const { createSeparateConnection } = require('../../../common/database/mongoose-db')
const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');
const util = require("util");
const OauthUtil = require("../../../common/utils/Oauth-util");
const RestUtil = require("../../../common/utils/rest-util");
const Redis = require("ioredis");
const { createCluster, createClient } = require("redis");
const { EJSON } = require('bson');   // ← NEW
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const mysql = require('mysql2/promise');
const qs = require("qs");



class AuthenticationService {
  constructor(config) {
    this.config = config;
    this.mongoose = new MONGOOSEDB();
    this.OauthUtil = new OauthUtil(config);
    this.restUtil = new RestUtil();
    this.psAors = MODELS[MESSAGEUTIL.info().database_tables.ps_aors];
    this.psAuths = MODELS[MESSAGEUTIL.info().database_tables.ps_auths];
    this.psEndpoints = MODELS[MESSAGEUTIL.info().database_tables.ps_endpoints];
    this.callai_customer_bots = MODELS[MESSAGEUTIL.info().database_tables.callai_customer_bots];
    this.first_run_status = MODELS[MESSAGEUTIL.info().database_tables.first_run_status];
    this.createCustomerDB = this.createCustomerDB.bind(this);
    this.createUser = this.createUser.bind(this);
    this.createRandomToken = this.createRandomToken.bind(this);
    this.createEncryptedPassword = this.createEncryptedPassword.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.update_base_password_changed = this.update_base_password_changed.bind(this);
    this.updateUserStatusLogs = this.updateUserStatusLogs.bind(this);
    this.findUserByUserIdFromDB = this.findUserByUserIdFromDB.bind(this);
    this.findUserByEmailFromDB = this.findUserByEmailFromDB.bind(this);
    this.fetchAllCustomers = this.fetchAllCustomers.bind(this);
    this.sortCustomer = this.sortCustomer.bind(this);
    this.saveAuditLog = this.saveAuditLog.bind(this);
    this.searchCustomer = this.searchCustomer.bind(this);
    this.findCustomerConfig = this.findCustomerConfig.bind(this)
    this.deleteFromMySql = this.deleteFromMySql.bind(this);
    this.deleteCustomerProdDB = this.deleteCustomerProdDB.bind(this);
    this.findUserRole = this.findUserRole.bind(this);
    this.updateUserTimeZone = this.updateUserTimeZone.bind(this);
    this.deleteDataFromQueueInMySQL = this.deleteDataFromQueueInMySQL.bind(this);
    this.fetchAgents = this.fetchAgents.bind(this);
    this.initializeMysqlTables = this.initializeMysqlTables.bind(this);
    this.updateUserLastLogin = this.updateUserLastLogin.bind(this);
    this.uploadLogo = this.uploadLogo.bind(this);
    this.createFirstRunStatusInMysql = this.createFirstRunStatusInMysql.bind(this);
  }

  async createCustomerDB(database) {
    try {
      let database = this.config.get("database");
      let customerBaseUrl = database.host;
      customerBaseUrl = customerBaseUrl.replace("$username", database.user);
      customerBaseUrl = customerBaseUrl.replace("$password", database.password);
      customerBaseUrl = customerBaseUrl.replace("$database", database.name);
      customerBaseUrl = customerBaseUrl.replace('$database', database.name);
      // console.log("URL FRO DB CREATE", customerBaseUrl)
      await this.mongoose.create_database(customerBaseUrl, MESSAGEUTIL.info().database_req_type.customer);
    } catch (err) {
      console.log("ERrror ", err)
      throw err
    }
  }

  async createFirstRunDB(database) {
    try {
      let database = this.config.get("database");
      let customerBaseUrl = database.host;
      customerBaseUrl = customerBaseUrl.replace("$username", database.user);
      customerBaseUrl = customerBaseUrl.replace("$password", database.password);
      customerBaseUrl = customerBaseUrl.replace("$database", database.name);
      customerBaseUrl = customerBaseUrl.replace('$database', database.name);
      // console.log("URL FRO DB CREATE",customerBaseUrl)
      await this.mongoose.create_database(customerBaseUrl, MESSAGEUTIL.info().database_req_type.customer);
      return true;
    } catch (err) {
      throw err;
      console.log(err)
    }
  }

  async createIndexing(tenant_id, collectionName, document) {
    try {
      let database = this.config.get("database");
      let customerBaseUrl = database.host;
      customerBaseUrl = customerBaseUrl.replace("$username", database.user);
      customerBaseUrl = customerBaseUrl.replace("$password", database.password);
      customerBaseUrl = customerBaseUrl.replace("$database", database.name);
      let db = await createSeparateConnection(customerBaseUrl, tenant_id);
      console.log("CONNECTED TO DB")
      try {
        let collectionModel = COMMONUTIL.getCustomerMongooseCollection(MESSAGEUTIL.info().database_collections[collectionName])
        const model = db.model(collectionName, collectionModel)
        await model.create([document])
        // console.log(`Index created successfully for ${collectionName}`)
        await db.close();
      } catch (err) {
        console.log("ERROR while creating index")
        throw err;
      }
    } catch (err) {
      console.error("Error connecting to the database or fetching collections:");
      throw err;
    }
  }

  async createCustomerProdDB(database) {
    try {
      let customerBaseUrl = database.host;
      customerBaseUrl = customerBaseUrl.replace("$username", database.user);
      customerBaseUrl = customerBaseUrl.replace("$password", database.password);
      customerBaseUrl = customerBaseUrl.replace("$database", database.name);
      customerBaseUrl = customerBaseUrl.replace('$database', database.name);
      await this.mongoose.create_database(customerBaseUrl, MESSAGEUTIL.info().database_req_type.customer);
    } catch (err) {
      throw err
    }
  }

  async deleteCustomerDB(databaseName) {
    try {
      let customerBaseUrl = database.host;
      customerBaseUrl = customerBaseUrl.replace("$username", database.user);
      customerBaseUrl = customerBaseUrl.replace("$password", database.password);
      customerBaseUrl = customerBaseUrl.replace("$database", database.name);
      customerBaseUrl = customerBaseUrl.replace('$database', databaseName);
      return await this.mongoose.drop_database(customerBaseUrl);
    } catch (err) {
      throw err
    }
  }

  async deleteCustomerProdDB(database) {
    try {
      let customerBaseUrl = database.host;
      customerBaseUrl = customerBaseUrl.replace("$username", database.user);
      customerBaseUrl = customerBaseUrl.replace("$password", database.password);
      customerBaseUrl = customerBaseUrl.replace("$database", database.name);
      customerBaseUrl = customerBaseUrl.replace('$database', database);
      await this.mongoose.drop_database(customerBaseUrl);
      return
    } catch (err) {
      throw err
    }
  }

  async createUserOnTrialCluster(database, collection, userData) {
    try {
      // Here we are using master creds to insert document as new creds need time to get activate
      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      url = url.replace('$database', database.name);

      let collectionModel = COMMONUTIL.getCustomerMongooseCollection(collection);
      let result = await this.mongoose.create_record_ws(collection, url, collectionModel, MESSAGEUTIL.info().database_req_type.customer, userData);
      let obj = { ...result };
      return obj;
    } catch (err) {
      throw err
    }
  }

  async createUser(database, collection, userData) {
    try {
      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      let collectionModel = COMMONUTIL.getCustomerMongooseCollection(
        collection
      );

      let result = await this.mongoose.create_record_ws(collection, url, collectionModel, MESSAGEUTIL.info().database_req_type.customer, userData);
      let obj = { ...result }
      return obj;
    } catch (err) {
      throw err;
    }
  }

  async update_base_password_changed(database, collection, user) {
    try {
      let query = { email: user.email };
      let updatedUser = {
        base_password_changed: user.base_password_changed,
      };
      let values = { $set: updatedUser };

      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);

      let collectionModel = COMMONUTIL.getCustomerMongooseCollection(
        collection
      );
      let opts = {}
      let result = await this.mongoose.update_record_ws(
        collection,
        url,
        collectionModel,
        MESSAGEUTIL.info().database_req_type.customer,
        query,
        values
      );
      let obj = { ...result }
      return obj;
    } catch (err) {
      throw err;
    }
  }


  async updateMongodbUserObj(database, collection, db_query, values) {
    try {
      let query = db_query;
      let updatedUser = { ...values };
      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      // console.log("qery", query)
      console.log("values", updatedUser)
      let collectionModel = COMMONUTIL.getCustomerMongooseCollection(
        collection
      );
      let result = await this.mongoose.update_record(
        collection,
        url,
        collectionModel,
        MESSAGEUTIL.info().database_req_type.customer,
        query,
        updatedUser
      );
      let obj = { ...result }
      return obj;
    } catch (err) {
      throw err;
    }
  }

  async createRandomToken(bit) {
    return new Promise((resolve, reject) => {
      let bits = bit ? bit : 32;
      let token = randToken.generate(bits);
      resolve(token);
    });
  }

  async insertInMysql(login_data) {
    let t;
    try {
      let login_model = await new MODELS[MESSAGEUTIL.info().database_tables.callai_agent_logins](MESSAGEUTIL.info().database.operation.write, MESSAGEUTIL.info().database_tables.callai_agent_logins);
      t = await login_model.SEQUELIZE.transaction();
      await login_model.CALLAIAGENTLOGIN.create({ ...login_data }, { transaction: t });
      return t;
    }
    catch (err) {
      throw err
    }
  }

  async updateAgentLogin(data, endpoint) {
    try {
      let login_model = await new MODELS[MESSAGEUTIL.info().database_tables.callai_agent_logins](MESSAGEUTIL.info().database.operation.write, MESSAGEUTIL.info().database_tables.callai_agent_logins);
      login_model.CALLAIAGENTLOGIN.update(
        { ...data }, { where: { endpoint: endpoint } }
      );
    } catch (err) {
      throw err
    }
  }
  async createEncryptedPassword(password) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, function (err, hash) {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  }

  async updateUser(database, collection, user) {
    try {
      let query = { email: user.email };
      let updatedUser = {
        blocked: user.status && user.status === MESSAGEUTIL.info().status.active ? false : true,
        phone: user.phone,
        status: user.status,
        name: user.name,
        nickname: user.name,
        reporting_manager: user.reporting_manager,
        role: user.role,
        modified_by: user.modified_by,
        position: user.position,
        employee_id: user.employee_id,
        action: user.action,
        ip: user.ip,
        timeZone: user.timeZone,
        "user_metadata.role": user.role
      };

      let values = {
        $set: updatedUser,
      };

      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      let collectionModel = COMMONUTIL.getCustomerMongooseCollection(
        collection
      );

      let result = await this.mongoose.update_record_ws(
        collection,
        url,
        collectionModel,
        MESSAGEUTIL.info().database_req_type.customer,
        query,
        values,
      );
      let obj = { ...result }
      console.log("update user::::::::::weokring::::::",)
      return obj;
    } catch (err) {
      console.log("error in the update user, ", err)
      throw err;
    }
  }

  async updateUserLastLogin(database, collection, user) {
    try {
      let query = { email: user.email };
      let updatedUser = {
        last_login: DATEUTIL.getTimeStringFromTimezone(),
      };
      let values = {
        $set: updatedUser,
      };
      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      let collectionModel = COMMONUTIL.getCustomerMongooseCollection(
        collection
      );
      let result = await this.mongoose.update_record(
        collection,
        url,
        collectionModel,
        MESSAGEUTIL.info().database_req_type.customer,
        query,
        values,
      );
      let obj = { ...result }
      return obj;
    } catch (err) {
      throw err;
    }
  }

  async updateUserInfo(database, collection, asterisk_user_id, values) {
    try {
      let query = { asterisk_user_id: asterisk_user_id };
      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      let collectionModel = COMMONUTIL.getCustomerMongooseCollection(
        collection
      );

      let result = await this.mongoose.update_record(
        collection,
        url,
        collectionModel,
        MESSAGEUTIL.info().database_req_type.customer,
        query,
        values,
      );
      let obj = { ...result }
      return obj;
    } catch (err) {
      throw err;
    }
  }

  async saveAuditLog(database, collection, user) {
    try {
      let query = { user_email: user.email };
      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      let collectionModel = COMMONUTIL.getCustomerMongooseCollection(
        collection
      );

      let audit_data = {
        user_id: user.user_id,
        activity: user.activity,
        user_email: user.email,
        created_by: user.created_by,
        created_by_id: user.created_by_id,
        created_on: user.created_on,
        tenant_id: user.tenant_id,
        action: user.action,
        ip: user.ip,
      };

      let audit_data_insert = {
        user_id: user.user_id,
        user_email: user.email,
        audit_log: [audit_data]
      };

      let values = {
        $push: { audit_log: audit_data },
      };

      const isRecordExists = await this.mongoose.check_records_exists(
        collection,
        url,
        collectionModel,
        MESSAGEUTIL.info().database_req_type.customer,
        query
      );
      // console.log("check_records_exists:::", isRecordExists);
      if (!isRecordExists.result) {
        const response = await this.mongoose.create_record_ws(
          collection,
          url,
          collectionModel,
          MESSAGEUTIL.info().database_req_type.customer,
          audit_data_insert,
        );
        let obj = { ...response } //return result along with transaction session
        console.log("update_records_not exits:::")
        return obj;

      } else {
        const response = await this.mongoose.update_record_ws(
          collection,
          url,
          collectionModel,
          MESSAGEUTIL.info().database_req_type.customer,
          query,
          values,
        );
        let obj = { ...response }
        return obj;
      }
    } catch (err) {
      console.log("error in the update user service, ", err)
      throw err;
    }
  }

  async updateCustomerDatabase(tenant_id, collection, user) {
    try {
      let database = this.config.get("database");
      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      let query = { tenant_id: tenant_id };
      let updatedUser = {
        ...user
      };
      let values = {
        $set: updatedUser,
      };
      let collectionModel = COMMONUTIL.getMongooseCollection(collection);
      let result = await this.mongoose.update_record_ws(
        collection,
        url,
        collectionModel,
        MESSAGEUTIL.info().database_req_type.customer,
        query,
        values
      );
      let obj = { ...result }
      return obj;
    } catch (err) {
      throw err;
    }
  }

  async deleteUser(database, collection, email) {
    try {
      let query = { email: email };
      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      let collectionModel = COMMONUTIL.getCustomerMongooseCollection(collection);

      let result = await this.mongoose.delete_record_ws(collection, url, collectionModel, MESSAGEUTIL.info().database_req_type.customer, query);
      let obj = { ...result }
      return obj;
    } catch (err) {
      throw err;
    }
  }

  async updateUserStatusLogs(database, collection, user) {
    try {
      let query = { user_email: user.email };
      let updatedUser = {
        status: user.status,
        modified_on: new Date(),
      };
      let values = { $push: { status_logs: updatedUser } };

      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      let collectionModel = COMMONUTIL.getCustomerMongooseCollection(
        collection
      );
      let result = await this.mongoose.update_record_ws(
        collection,
        url,
        collectionModel,
        MESSAGEUTIL.info().database_req_type.customer,
        query,
        values,
      );
      let obj = { result }
      return obj;
    } catch (err) {
      throw err;
    };
  }

  async insertCustomerdetails(collection, data) {
    try {
      let database = this.config.get("database");
      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      let collectionModel = COMMONUTIL.getMongooseCollection(collection);
      let result = await this.mongoose.create_record_ws(collection, url, collectionModel, MESSAGEUTIL.info().database_req_type.customer, data);
      let obj = { ...result }
      return obj;
    } catch (err) {
      throw err;
    }
  }

  async deleteCustomerdetails(collection, tenant_id) {
    try {
      let database = this.config.get("database");
      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      let query = {
        tenant_id: tenant_id
      }
      let collectionModel = COMMONUTIL.getMongooseCollection(collection);
      let result = await this.mongoose.delete_record(collection, url, collectionModel, MESSAGEUTIL.info().database_req_type.customer, query);
      let obj = { ...result }
      return obj;
    } catch (err) {
      throw err;
    }
  }

  async findUserByUserIdFromDB(collection, user_id) {
    try {
      let database = this.config.get("database");
      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      let query = { user_id: user_id };
      let collectionModel = COMMONUTIL.getMongooseCollection(collection);
      let response = await this.mongoose.find_record(collection, url, collectionModel, MESSAGEUTIL.info().database_req_type.customer, query, {
        apiKey: 0,
        database: 0,
        created_at: 0,
        email: 0,
        email_verified: 0,
      });
      return response.result;
    } catch (err) {
      throw err;
    }
  }

  async findCustomerInfoFromDB(collection, tenant_id) {
    try {
      let database = this.config.get("database");
      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      let query = { tenant_id: tenant_id };
      let collectionModel = COMMONUTIL.getMongooseCollection(collection);
      let response = await this.mongoose.find_record(collection, url, collectionModel, MESSAGEUTIL.info().database_req_type.customer, query, {
        phone: 1,
      });
      let obj = { ...response }
      return obj.result;
    } catch (err) {
      throw err;
    }
  }

  async findUserByEmailFromDB(database, collection, email, tenant_id) {
    try {
      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      let query = { email: email, tenant_id: tenant_id };
      let collectionModel = COMMONUTIL.getCustomerMongooseCollection(
        collection
      );
      let response = await this.mongoose.find_record(collection, url, collectionModel, MESSAGEUTIL.info().database_req_type.customer, query, {
        _id: false, isDeleted: false, __v: false
      });
      let obj = { ...response }
      return obj.result;
    } catch (err) {
      throw err;
    }
  }

  async findUserRole(database, collection, role) {
    try {
      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      let query = { role: { "$in": [role] } };
      let collectionModel = COMMONUTIL.getCustomerMongooseCollection(
        collection
      );
      let response = await this.mongoose.find_record(collection, url, collectionModel, MESSAGEUTIL.info().database_req_type.customer, query,
        { name: true, asterisk_user_id: true, role: true });
      let obj = { ...response }
      return obj.result;
    } catch (err) {
      throw err;
    }
  }

  async findUserDetails(database, collection, asterisk_user_id) {
    try {
      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      let query = { asterisk_user_id: asterisk_user_id };
      let collectionModel = COMMONUTIL.getCustomerMongooseCollection(
        url,
        collection
      );
      let response = await this.mongoose.find_record(collectionModel, query, {});
      return response.result;
    } catch (err) {
      throw err;
    }
  }

  async findCustomerConfig(collection, databaseUrl, tenant_id) {
    try {
      let query = { tenant_id: tenant_id };
      let collectionModel = COMMONUTIL.getMongooseCollection(collection);
      let response = await this.mongoose.find_record(collection, databaseUrl, collectionModel, MESSAGEUTIL.info().database_req_type.master, query, {
        database: 1
      });
      let obj = { ...response }
      return obj.result;
    } catch (err) {
      throw err;
    }
  }

  async fetchAllCustomers(collection, data) {
    try {
      let skip;
      let limit;
      if (data.skip == undefined && data.limit == undefined) {
        skip = 0;
        limit = 10;
      } else if (data.skip == "" || data.skip == undefined) {
        skip = 0;
        limit = parseInt(data.limit);
      } else if (data.limit == "" || data.limit == undefined) {
        limit = 10;
        skip = parseInt(data.skip);
      } else {
        skip = parseInt(data.skip);
        limit = parseInt(data.limit);
      }
      let database = this.config.get("database");
      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      let collectionModel = COMMONUTIL.getMongooseCollection(collection);
      let response = await this.mongoose.find_record_pager(
        collection,
        url,
        collectionModel,
        MESSAGEUTIL.info().database_req_type.master,
        {},
        skip,
        limit,
        { template_id: false, webhook: false, database: false, __v: false, vonage_details: false, _id: false, apiKey: false }
      );
      let result_count = await this.mongoose.count_record(
        collection,
        url,
        collectionModel,
        MESSAGEUTIL.info().database_req_type.customer,
        {}
      );
      let result = {
        data: response.result,
        count: result_count.result
      }
      return result;
    } catch (err) {
      throw err;
    }
  }

  async searchCustomer(collection, search) {
    try {
      let database = this.config.get("database");
      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      let collectionModel = COMMONUTIL.getMongooseCollection(collection);
      const query = {
        tenant_name: { '$regex': `${search}` }
      }
      const field = { template_id: false, webhook: false, database: false, __v: false, vonage_details: false, _id: false, apiKey: false }

      let response = await this.mongoose.find_record(
        collection,
        url,
        collectionModel,
        MESSAGEUTIL.info().database_req_type.customer,
        query,
        field,
      )
      return response.result;
    } catch (err) {
      throw err;
    }
  }

  async filterCustomer(collection, query, data) {
    try {
      let skip;
      let limit;
      if (data.skip == undefined && data.limit == undefined) {
        skip = 0;
        limit = 10;
      } else if (data.skip == "" || data.skip == undefined) {
        skip = 0;
        limit = parseInt(data.limit);
      } else if (data.limit == "" || data.limit == undefined) {
        limit = 10;
        skip = parseInt(data.skip);
      } else {
        skip = parseInt(data.skip);
        limit = parseInt(data.limit);
      }
      let database = this.config.get("database");
      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      let collectionModel = COMMONUTIL.getMongooseCollection(collection);
      const field = { template_id: false, webhook: false, database: false, __v: false, vonage_details: false, _id: false, apiKey: false }
      let response = await this.mongoose.filter_record_pager(
        collection,
        url,
        collectionModel,
        MESSAGEUTIL.info().database_req_type.customer,
        query,
        field,
        skip, limit
      )
      let result_count = await this.mongoose.count_record(
        collection,
        url,
        collectionModel,
        MESSAGEUTIL.info().database_req_type.customer,
        query
      );
      let result = {
        result: response.result,
        count: result_count.result
      }
      return result;
    } catch (err) {
      throw err;
    }
  }

  async sortCustomer(collection, sortOrder, data) {
    try {
      let skip;
      let limit;
      if (data.skip == undefined && data.limit == undefined) {
        skip = 0;
        limit = 10;
      } else if (data.skip == "" || data.skip == undefined) {
        skip = 0;
        limit = parseInt(data.limit);
      } else if (data.limit == "" || data.limit == undefined) {
        limit = 10;
        skip = parseInt(data.skip);
      } else {
        skip = parseInt(data.skip);
        limit = parseInt(data.limit);
      }
      let database = this.config.get("database");
      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      let collectionModel = COMMONUTIL.getMongooseCollection(collection);
      let response = await this.mongoose.sort_record(
        collection,
        url,
        collectionModel,
        MESSAGEUTIL.info().database_req_type.customer,
        sortOrder,
        skip,
        limit,
        { template_id: false, webhook: false, database: false, __v: false, vonage_details: false, _id: false, apiKey: false }
      )
      return response.result;
    } catch (err) {
      throw err;
    }
  }

  async expirationDate(collection, tenant_id, date) {
    try {
      let database = this.config.get("database");
      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      let collectionModel = COMMONUTIL.getMongooseCollection(collection);
      const query = {
        tenant_id: tenant_id
      }
      const value = {
        $set: {
          "user_metadata.trial_expiration_date": date
        }
      }
      let result = await this.mongoose.update_record(
        collection,
        url,
        collectionModel,
        MESSAGEUTIL.info().database_req_type.customer,
        query,
        value,
        {}
      )

      let obj = { ...result };
      return obj;
    } catch (err) {
      throw err;
    }
  }

  async statusUpdate(database, collection, email_id, status) {
    try {
      let query = { email: email_id };
      let updatedUser = {
        blocked: status,
        status: status == true ? "INACTIVE" : "ACTIVE"
      };
      let values = { $set: updatedUser };

      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);

      let collectionModel = COMMONUTIL.getCustomerMongooseCollection(
        collection
      );

      let result = await this.mongoose.update_record_ws(
        collection,
        url,
        collectionModel,
        MESSAGEUTIL.info().database_req_type.customer,
        query,
        values
      );
      return result;
    } catch (err) {
      throw err;
    }
  }

  async fetchBotTemplate(collection) {
    try {
      let database = this.config.get("database");
      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      let collectionModel = COMMONUTIL.getMongooseCollection(collection);
      let response = await this.mongoose.find_record(collection, url, collectionModel, MESSAGEUTIL.info().database_req_type.customer, {}, {});
      let obj = { ...response }
      return obj;
    } catch (err) {
      throw err;
    }
  }
  async saveBotInMysql(bot, tenant_id) {
    let t;
    try {
      let CallaiCustomerBots_model = await new MODELS[MESSAGEUTIL.info().database_tables.callai_customer_bots](MESSAGEUTIL.info().database.operation.write, MESSAGEUTIL.info().database_tables.callai_customer_bots);
      t = await CallaiCustomerBots_model.SEQUELIZE.transaction();
      await CallaiCustomerBots_model.CALLAICUSTOMERBOTS.create({
        id: bot.bot_id,
        bot_name: bot.bot_name,
        tenant_id,
        webhook: bot.webhook
      }, { transaction: t })
      return t;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  async deleteBotInMysql(tenant_id) {
    try {
      let CallaiCustomerBots_model = await new this.callai_customer_bots(MESSAGEUTIL.info().database.operation.write, MESSAGEUTIL.info().database_tables.callai_customer_bots);
      const response = await CallaiCustomerBots_model.CALLAICUSTOMERBOTS.destroy(
        {
          where: {
            tenant_id: tenant_id
          }
        })
      return response;
    } catch (err) {
      throw err;
    }
  }

  async createBot(collection, bot) {
    try {
      let database = this.config.get("database");
      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      let collectionModel = COMMONUTIL.getCustomerMongooseCollection(collection);
      let result = await this.mongoose.create_record_ws(collection, url, collectionModel, MESSAGEUTIL.info().database_req_type.customer, bot);
      let obj = { ...result }
      return obj;
    } catch (err) {
      throw err;
    }
  }

  async deleteBotByTenant(collection, tenant_id) {
    try {
      let query = { tenant_id: tenant_id }
      let database = this.config.get("database");
      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      let collectionModel = COMMONUTIL.getCustomerMongooseCollection(collection);
      let result = await this.mongoose.delete_record(collection, url, collectionModel, MESSAGEUTIL.info().database_req_type.customer, query);
      let obj = { ...result }
      return obj;
    } catch (err) {
      throw err;
    }
  }

  async deleteFromMySql(asterisk_user_id) {
    try {
      let aors_model = await new this.psAors(MESSAGEUTIL.info().database.operation.write, MESSAGEUTIL.info().database_tables.ps_aors);
      let auths_model = await new this.psAuths(MESSAGEUTIL.info().database.operation.write, MESSAGEUTIL.info().database_tables.ps_auths);
      let endpoint_model = await new this.psEndpoints(MESSAGEUTIL.info().database.operation.write, MESSAGEUTIL.info().database_tables.ps_endpoints);

      const t = await aors_model.SEQUELIZE.transaction();
      let aors = aors_model.AORS.destroy({ where: { id: asterisk_user_id }, transaction: t });
      let auth = auths_model.AUTHS.destroy({ where: { id: asterisk_user_id }, transaction: t });
      let endpoint = endpoint_model.ENDPOINTS.destroy({ where: { id: asterisk_user_id }, transaction: t });
      await Promise.allSettled([aors, auth, endpoint]).then((results) => {
        results.forEach((result) => {
          if (result.status === 'rejected') {
            t.rollback();
            throw result.reason;
          }
        })
      })
      return t;
    }
    catch (err) {
      throw err
    }
  }

  async deleteFromMySqlByTenant(tenant_id) {
    try {
      let aors_model = await new this.psAors(MESSAGEUTIL.info().database.operation.write, MESSAGEUTIL.info().database_tables.ps_aors);
      let auths_model = await new this.psAuths(MESSAGEUTIL.info().database.operation.write, MESSAGEUTIL.info().database_tables.ps_auths);
      let endpoint_model = await new this.psEndpoints(MESSAGEUTIL.info().database.operation.write, MESSAGEUTIL.info().database_tables.ps_endpoints);

      const t = await aors_model.SEQUELIZE.transaction();
      let aors = aors_model.AORS.destroy({ where: { tenant_id: tenant_id } });
      let auth = auths_model.AUTHS.destroy({ where: { tenant_id: tenant_id } });
      let endpoint = endpoint_model.ENDPOINTS.destroy({ where: { tenant_id: tenant_id } });
      await Promise.allSettled([aors, auth, endpoint]).then((results) => {
        results.forEach((result) => {
          if (result.status === 'rejected') {
            t.rollback();
          }
        })
        return results;
      })
    }
    catch (err) {
      throw err
    }
  }

  async fetchSidebar(collection) {
    try {
      let database = this.config.get("database");
      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      let query = {};
      let collectionModel = COMMONUTIL.getMongooseCollection(collection);
      let response = await this.mongoose.find_record(
        collection,
        url,
        collectionModel,
        MESSAGEUTIL.info().database_req_type.customer,
        query,
        {}
      );
      let result = {
        data: response.result
      }

      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateUserTimeZone(database, collection, user) {
    try {
      let query = { email: user.email };
      let updatedUser = {
        timeZone: user.timeZone
      };
      let values = {
        $set: updatedUser,
      };

      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      let collectionModel = COMMONUTIL.getCustomerMongooseCollection(
        collection
      );
      let result = await this.mongoose.update_record(
        collection,
        url,
        collectionModel,
        MESSAGEUTIL.info().database_req_type.customer,
        query,
        values,
      );
      let obj = { ...result }
      return obj;
    } catch (err) {
      throw err;
    }
  }

  async deleteDataFromQueueInMySQL(queueMemberId, t) {
    let queueMembersModel = await new MODELS[MESSAGEUTIL.info().database_tables.teams_members](MESSAGEUTIL.info().database.operation.write, MESSAGEUTIL.info().database_tables.teams_members);
    try {
      let FinalqueueMemberId = "PJSIP/" + queueMemberId;
      let resultFromQueueMember = await queueMembersModel.TEAMSMEMBER.findAndCountAll({
        where: { interface: FinalqueueMemberId }
      })


      let queue_names = [];
      if (resultFromQueueMember.rows.length > 0) {
        for (let i = 0; i < resultFromQueueMember.rows.length; i++) {
          queue_names.push(resultFromQueueMember.rows[i].dataValues.queue_name);
        }
        let resultFromQueueMemberDestroy = await queueMembersModel.TEAMSMEMBER.destroy({
          where: { interface: FinalqueueMemberId }, transaction: t
        }
        )
        let queueModel = await new MODELS[MESSAGEUTIL.info().database_tables.teams](MESSAGEUTIL.info().database.operation.write, MESSAGEUTIL.info().database_tables.teams);
        for (let i = 0; i < queue_names.length; i++) {
          let resultFromQueue = await queueModel.TEAMS.decrement(
            'total_members', { by: 1, where: { name: queue_names[i] }, transaction: t }
          );
        }
      }
      else {
        return;
      }
    }
    catch (err) {
      throw err;
    }
  }

  async fetchContacts(database, collection, tenant_id) {
    try {
      let query = { tenant_id: tenant_id };
      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      let collectionModel = COMMONUTIL.getCustomerMongooseCollection(
        collection
      );
      let response = await this.mongoose.find_record(collection, url, collectionModel, MESSAGEUTIL.info().database_req_type.customer, query, {
        asterisk_user_id: 1,
        name: 1,
      });

      let obj = { ...response }
      return obj;
    } catch (err) {
      throw err;
    }
  }


  async fetchAgents(tenant_id) {
    try {
      let agent_login_model = await new MODELS[MESSAGEUTIL.info().database_tables.callai_agent_logins](MESSAGEUTIL.info().database.operation.read, MESSAGEUTIL.info().database_tables.callai_agent_logins);
      let RESULT = await agent_login_model.CALLAIAGENTLOGIN.findAll({
        where: {
          tenant_id: tenant_id
        }
      })
      return RESULT;
    } catch (err) {
      throw err;
    }
  }

  async initializeMysqlTables(tenant_id) {
    try {
      const custom_tables = {
        contact: `callai_contact_${tenant_id}`,
        Groups: `callai_groups_${tenant_id}`,
        contactGroups: `callai_grp_contact_${tenant_id}`,
      };
      const CONTACT = await new MODELS[MESSAGEUTIL.info().database_collections.CommonTableName.contacts](MESSAGEUTIL.info().database.operation.write, custom_tables.contact, true);
      const GROUPS = await new MODELS[MESSAGEUTIL.info().database_collections.CommonTableName.groupsContacts](MESSAGEUTIL.info().database.operation.write, custom_tables.Groups, true);
      const CONTACTGROUPS = await new MODELS[MESSAGEUTIL.info().database_collections.CommonTableName.Groups](MESSAGEUTIL.info().database.operation.write, custom_tables.contactGroups, true);
      return CONTACT;
    }
    catch (err) {
      throw err;
    }
  }

  async filterUsers(collection, database, data, query, sort_data) {
    try {
      let skip;
      let limit;
      // console.log("data", data)
      if (data.pageIndex == undefined && data.pageSize == undefined) {
        skip = 0;
        limit = 10;
      } else if (data.pageIndex == "" || data.pageIndex == undefined) {
        skip = 0;
        limit = parseInt(data.pageSize);
      } else if (data.pageSize == "" || data.pageSize == undefined) {
        limit = 10;
        skip = parseInt(data.pageIndex);
      } else {
        skip = parseInt(data.pageIndex);
        limit = parseInt(data.pageSize);
      }
      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      let collectionModel = COMMONUTIL.getCustomerMongooseCollection(
        collection
      );
      const fields = { employee_id: 1, status: 1, role: 1, created_at: 1, email: 1, last_login: 1, name: 1, user_metadata: 1, blocked: 1, email_verified: 1, user_id: 1, last_login: 1 }
      let response = await this.mongoose.find_record_sorted(
        collection,
        url,
        collectionModel,
        MESSAGEUTIL.info().database_req_type.customer,
        query,
        sort_data,
        skip, limit,
        fields
      )
      let result_count = await this.mongoose.count_record(
        collection,
        url,
        collectionModel,
        MESSAGEUTIL.info().database_req_type.customer,
        query
      );
      let result = {
        result: response?.result,
        count: result_count?.result
      }
      return result;
    } catch (err) {
      throw err;
    }
  }

  async uploadLogo(collection, logoData, database) {
    try {
      let response;
      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      // console.log("URL::::::::::::::", url)
      const collectionModel = COMMONUTIL.getCustomerMongooseCollection(collection);
      let query = { tenant_id: logoData.tenant_id };
      let responseLogo = await this.mongoose.check_records_exists(collection, url, collectionModel, MESSAGEUTIL.info().database_req_type.customer, query);
      // console.log("CHECK::::::::::::::::::::::::LOGORESPONSE", responseLogo)
      if (responseLogo.result) {
        response = await this.mongoose.find_and_update(
          collection,
          url,
          collectionModel,
          MESSAGEUTIL.info().database_req_type.customer,
          query,
          { $set: logoData }
        );
      } else {
        response = await this.mongoose.create_record(collection, url, collectionModel, MESSAGEUTIL.info().database_req_type.customer, logoData);
      }
      return response.result;
    } catch (error) {
      console.log("ERRROR CAPTURED", error)
      throw error.message;
    }
  }

  async fetchLogo(collection, database) {
    try {
      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      // console.log("URL::::::::::::::", url)
      let collectionModel = COMMONUTIL.getCustomerMongooseCollection(
        collection
      );
      let query = {};
      let response = await this.mongoose.find_record(collection, url, collectionModel, MESSAGEUTIL.info().database_req_type.customer, query);
      // console.log("RESULT:::::::::::::::::::::::::::::::", response.result[0])
      return response.result[0];
    } catch (error) {
      console.log("ERRROR CAPTURED", error)
      throw error.message;
    }
  }

  async testMysqlConnection() {
    let sequelize;
    try {
      const writeHost = this.config.get('mysql:write:host');
      const username = this.config.get('mysql:user');
      const password = this.config.get('mysql:password');
      const database = this.config.get('mysql:database');

      sequelize = new Sequelize(database, username, password, {
        host: writeHost,
        dialect: 'mysql',
        logging: false,
      });

      // Test the connection
      await sequelize.authenticate();
      console.log('Connection to MySQL database established successfully.');
    } catch (err) {
      console.error("Error connecting to the MySQL", err);
      console.error('Error connecting to the MySQL database:', err.message);
      throw err;
    } finally {
      if (sequelize) {
        await sequelize.close();
        console.log('Connection to MySQL database closed.');
      }
    }
  }

  async testMongoConnection() {
    try {
      let database = this.config.get("database");
      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      const mongoURL = url;

      await mongoose.connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB successfully.');
    } catch (error) {
      console.log("full error ::::::", error);
      console.error('Error connecting to MongoDB::::', error.message);
      throw error;
    } finally {
      console.log("Disconnected from MongoDB successfully::::")
      await mongoose.connection.close();
    }
  }

  // Test Redis connection
  async testRedisConnection() {
    let redisClient;
    try {
      let connectionString = `redis://${this.config.get("bot_redis:host")}:${this.config.get("bot_redis:port")}`;
      if (this.config.get('bot_redis:host').includes("sentinel")) {
        console.log("sentinel redis is initializing");
        redisClient = new Redis({
          sentinels: [
            { host: this.config.get('bot_redis:host'), port: this.config.get('bot_redis:port') }
          ],
          name: this.config.get('bot_redis:name'),
        });
      }
      else if (this.config.get('bot_redis:host').includes("cluster")) {
        console.log("cluster redis is initializing for ping ");
        redisClient = createCluster({
          rootNodes: [
            {
              url: connectionString
            }
          ]
        });
      }
      else {
        console.log("standalone redis is initializing");
        redisClient = createClient({
          url: connectionString
        });
      }
      redisClient.isOpen ? console.log("connection is already open") : await redisClient.connect();
      // const result = await redisClient.ping();
      await redisClient.set('test_key', 'test_value');
      const value = await redisClient.get('test_key');
      console.log('Redis Connection Successful. Test value retrieved:', value);
    }
    catch (error) {
      console.error("Error connecting to Redis", error);
      console.error("Error connecting to Redis", error.message);
      throw error;
    }
    finally {
      if (redisClient) {
        redisClient.disconnect();
      }
    }
  }



  // async restoreMongoDBCollection(data) {
  //   console.log("data in the restoreMongoDBCollection function", data);
  //   // const domainPrefix = data.domain;
  //   let signupRestore = data.signupRestore;
  //   const mongoBuilderCollection = path.resolve(__dirname, '../../../../database-schema/mongo-database-collections');
  //   console.log('mongCollectionPath ::::::::::::::::', mongoBuilderCollection);
  //   const inserted_collection = [];
  //   try {
  //     // Connect to MongoDB
  //     let database = this.config.get("database");
  //     let url = database.host;
  //     url = url.replace("$username", database.user);
  //     url = url.replace("$password", database.password);
  //     url = url.replace("$database", database.name);
  //     let mongoURL = url;
  //     //if signupRestore is true, replace builder with tenantDB database for restoring LLM and Global Config collections in it otherwise it will connect to builder DB and restore the other collection.
  //     // Note: For Production deployment, Uncomment the below line and comment the next line
  //     // mongoURL = signupRestore ? mongoURL.replace("builder", this.config.get('database:name')) : mongoURL;
  //     // Note: For Development and Testing, Uncomment the below line and comment the above line
  //     mongoURL = signupRestore ? mongoURL.replace("builder", this.config.get('database:name')) : mongoURL.replace("builder", "gi1dev_builder");
  //     console.log('dbToProcess ::::::::::::::::', mongoURL);
  //     if (mongoose.connection.readyState !== 0) {
  //       console.log('MongoDB connection already exists. Disconnecting...');
  //       await mongoose.disconnect();
  //     }
  //     await mongoose.connect(mongoURL, {
  //       useNewUrlParser: true,
  //       useUnifiedTopology: true,
  //     });
  //     console.log('Connected to MongoDB successfully.');
  //     // Get existing collections
  //     const existingCollection = await mongoose.connection.db.listCollections().toArray();
  //     const existingCollectionNames = existingCollection.map(c => c.name);
  //     console.log('existing collections::::::::::::', existingCollectionNames);
  //     // Read all *.json files in mongoBuilderCollection
  //     // If signupRestore is true, filter for domain.json and _domain.json files for TenantDB restoration
  //     const filesToProcess = signupRestore
  //       ? fs.readdirSync(mongoBuilderCollection).filter(file => file.endsWith('.json') || file === '.json')
  //       : fs.readdirSync(mongoBuilderCollection).filter(f => f.endsWith('.json') && !f.endsWith('_domain.json') && f !== 'domain.json');
  //     if (filesToProcess.length === 0) {
  //       console.warn(`No JSON files found in::: ${mongoBuilderCollection}`);
  //       return;
  //     }
  //     console.log('filesToProcess ::::::::::::', filesToProcess);
  //     // Restore missing collections
  //     for (const file of filesToProcess) {
  //       const collectionName = path.basename(file, '.json');
  //       /* Read + EJSON‑parse (handles $oid, $date, $numberLong, etc.) */
  //       console.log('collectionName ::::::::::::', collectionName);
  //       let docs;
  //       try {
  //         const raw = fs.readFileSync(path.join(mongoBuilderCollection, file), 'utf8');
  //         docs = EJSON.parse(raw, { relaxed: false });   // strict → proper types
  //       } catch (err) {
  //         console.error(`Could not parse ${file}: ${err.message}`);
  //       }
  //       // check if docs is an empty array
  //       if (!Array.isArray(docs) || docs.length === 0) {
  //         console.warn(`${file} contains no array data — skipping.`);
  //         continue;
  //       }
  //       // Dynamically compute collection name
  //       // If signupRestore is true, replace domain or base with the domain prefix for TenantDB restoration;
  //       // let collectionToProcess = collectionName;
  //       /* If the collection already exists, delete its contents */
  //       const collectionHandle = mongoose.connection.collection(collectionName);
  //       const exists = existingCollectionNames.includes(collectionName);
  //       if (exists) {
  //         await collectionHandle.drop();         // Clear existing collection and data
  //         console.log(`Cleared old collection and its data:::::'${collectionName}'`);
  //       }
  //       /* Insert */
  //       try {
  //         await mongoose.connection.collection(collectionName).insertMany(docs);
  //         inserted_collection.push(collectionName);
  //         console.log(`Restored '${collectionName}' with ${docs.length} documents.`);
  //       } catch (insertErr) {
  //         console.error(`Failed to insert into:::: '${collectionName}': ${insertErr.message}`);
  //         throw insertErr.message; // rethrow to stop the process
  //       }
  //     }
  //     console.log(`Restoration complete. Inserted: ${inserted_collection.length}`);
  //     return {
  //       inserted_collection: inserted_collection,
  //     }
  //   } catch (error) {
  //     console.log("full error ::::::", error);
  //     console.error('Error restoring the BuilderDB Collection in MongoDB::::', error.message);
  //     throw error;
  //   } finally {
  //     console.log("Disconnected from MongoDB successfully::::")
  //     await mongoose.connection.close();
  //   }
  // }
  async restoreMongoDBCollection(data) {
    console.log("data in the restoreMongoDBCollection function", data);
    // const domainPrefix = data.domain;
    let signupRestore = data.signupRestore;
    const mongoBuilderCollection = path.resolve(__dirname, '../../../../database-schema/mongo-database-collections');
    console.log('mongCollectionPath ::::::::::::::::', mongoBuilderCollection);
    const inserted_collection = [];
    let dbConnection;
    try {
      // Connect to MongoDB
      let database = this.config.get("database");
      let url = database.host;
      url = url.replace("$username", database.user);
      url = url.replace("$password", database.password);
      url = url.replace("$database", database.name);
      let mongoURL = url;
      //if signupRestore is true, replace builder with tenantDB database for restoring LLM and Global Config collections in it otherwise it will connect to builder DB and restore the other collection.
      // Note: For Production deployment, Uncomment the below line and comment the next line
      // mongoURL = signupRestore ? mongoURL.replace("builder", this.config.get('database:name')) : mongoURL;
      // Note: For Development and Testing, Uncomment the below line and comment the above line
      mongoURL = signupRestore ? mongoURL.replace("builder", this.config.get('database:name')) : mongoURL.replace("builder", "gi1dev_builder");
      // if (mongoose.connection.readyState !== 0) {
      //   console.log('MongoDB connection already exists. Disconnecting...');
      //   await mongoose.disconnect();
      // }
      dbConnection = await mongoose.createConnection(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      // console.log('Connected to MongoDB successfully.');
      await new Promise((resolve, reject) => {
        dbConnection.once('open', resolve);
        dbConnection.on('error', reject);
      });
      console.log('Connected to MongoDB successfully.');
      const nativeDb = dbConnection.db;
      // Get existing collections
      const existingCollection = await nativeDb.listCollections().toArray();
      const existingCollectionNames = existingCollection.map(c => c.name);
      console.log('existing collections::::::::::::', existingCollectionNames);
      // Read all *.json files in mongoBuilderCollection
      // If signupRestore is true, filter for domain.json and _domain.json files for TenantDB restoration
      const filesToProcess = signupRestore
        ? fs.readdirSync(mongoBuilderCollection).filter(file => file.endsWith('.json') || file === '.json')
        : fs.readdirSync(mongoBuilderCollection).filter(f => f.endsWith('.json') && !f.endsWith('_domain.json') && f !== 'domain.json');
      if (filesToProcess.length === 0) {
        console.warn(`No JSON files found in::: ${mongoBuilderCollection}`);
        return;
      }
      console.log('filesToProcess ::::::::::::', filesToProcess);
      // Restore missing collections
      for (const file of filesToProcess) {
        const collectionName = path.basename(file, '.json');
        /* Read + EJSON‑parse (handles $oid, $date, $numberLong, etc.) */
        console.log('collectionName ::::::::::::', collectionName);
        let docs;
        try {
          const raw = fs.readFileSync(path.join(mongoBuilderCollection, file), 'utf8');
          docs = EJSON.parse(raw, { relaxed: false });   // strict → proper types
        } catch (err) {
          console.error(`Could not parse ${file}: ${err.message}`);
        }
        // check if docs is an empty array
        if (!Array.isArray(docs) || docs.length === 0) {
          console.warn(`${file} contains no array data — skipping.`);
          continue;
        }
        // Dynamically compute collection name
        // If signupRestore is true, replace domain or base with the domain prefix for TenantDB restoration;
        // let collectionToProcess = collectionName;
        /* If the collection already exists, delete its contents */
        const collectionHandle = dbConnection.collection(collectionName);
        const exists = existingCollectionNames.includes(collectionName);
        if (exists) {
          await collectionHandle.drop();         // Clear existing collection and data
          console.log(`Cleared old collection and its data:::::'${collectionName}'`);
        }
        /* Insert */
        try {
          await dbConnection.collection(collectionName).insertMany(docs);
          inserted_collection.push(collectionName);
          console.log(`Restored '${collectionName}' with ${docs.length} documents.`);
        } catch (insertErr) {
          console.error(`Failed to insert into:::: '${collectionName}': ${insertErr.message}`);
          throw insertErr.message; // rethrow to stop the process
        }
      }
      console.log(`Restoration complete. Inserted: ${inserted_collection.length}`);
      return {
        inserted_collection: inserted_collection,
      }
    } catch (error) {
      console.log("full error ::::::", error);
      console.error('Error restoring the BuilderDB Collection in MongoDB::::', error.message);
      throw error;
    } finally {
      console.log("Disconnected from MongoDB successfully::::")
      await dbConnection.close();
    }
  }

  async restoreMysqlTable() {
    let createdTables = [];
    let conn;
    try {
      // Connect to MySQL
      const host = this.config.get('mysql:write:host');
      const user = this.config.get('mysql:user');
      const password = this.config.get('mysql:password');
      const database = this.config.get('mysql:database');
      conn = await mysql.createConnection({
        host,
        user,
        password,
        database,
        charset: 'utf8mb4_unicode_ci',
        multipleStatements: true
      });
      console.log('Connected to MySQL successfully!!!');
      // await conn.beginTransaction();
      // Read the SQL dump file
      const mysqlDbTables = path.resolve(
        __dirname,
        '../../../../database-schema/mysql-database-schema/gi1dev.sql'
      );
      const rl = readline.createInterface({
        input: fs.createReadStream(mysqlDbTables, { encoding: 'utf8' }),
        crlfDelay: Infinity
      });
      let buffer = '', stmts = 0, bytes = 0;
      let delimiter = ';';
      for await (const line of rl) {
        const trimmed = line.trim();
        // Skip SQL comments
        if (/^(--|\/\*)/.test(trimmed)) continue;
        // Handle delimiter changes (e.g. DELIMITER ;; or DELIMITER $$)
        if (trimmed.startsWith('DELIMITER')) {
          delimiter = trimmed.split(' ')[1];
          continue;
        }
        buffer += line + '\n';
        if (buffer.trim().endsWith(delimiter)) {
          const statement = buffer.trim().slice(0, -delimiter.length).trim(); // remove trailing delimiter
          // Skip statements that involve _tenant_ tables
          if (/_tenant_/.test(statement)) {
            console.log('Skipped _tenant_ table:', statement.split('\n')[0]);
            buffer = '';
            continue;
          }
          if (statement) {
            if (statement.toUpperCase().startsWith('CREATE TABLE')) {
              const match = statement.match(/CREATE TABLE\s+[`"]?([^`"\s(]+)/i);
              if (match && match[1]) {
                createdTables.push(match[1]);
              }
            }
            try {
              await conn.query(statement);
            } catch (e) {
              console.error('Failed statement:', statement);
              throw e;
            } stmts++;
            bytes += Buffer.byteLength(statement, 'utf8');
          }
          buffer = '';
        }
      }
      // Final push if there's any remaining buffer
      if (buffer.trim()) {
        await conn.query(buffer.trim());
        stmts++;
        bytes += Buffer.byteLength(buffer, 'utf8');
      }
      // await conn.commit();
      console.log(`Restore complete: ${stmts} statements, ${(bytes / 1_048_576).toFixed(1)} MB`);
      return {
        inserted_tables: createdTables, // Return the list of created tables
      };
    } catch (err) {
      // await conn.rollback();
      console.log("Error in restoreMysqlTable service layer:", err);
      throw err;
    } finally {
      if (conn) {
        await conn.end();
        console.log('🔌  MySQL connection closed');
      }
    }
  }

  async executeIvaToAvaSqlFile(options = {}) {
    let conn;
    try {
      const continueOnError = options.continueOnError === true;
      const host = this.config.get('mysql:write:host');
      const user = this.config.get('mysql:user');
      const password = this.config.get('mysql:password');
      const database = this.config.get('mysql:database');

      conn = await mysql.createConnection({
        host,
        user,
        password,
        database,
        charset: 'utf8mb4_unicode_ci',
        multipleStatements: true
      });
      console.log('Connected to MySQL successfully!!!');
      const shouldSkipStatement = (sql) => /^(drop|delete|truncate)\b/i.test(String(sql || '').trim());
      const sqlFilePath = path.resolve(
        __dirname,
        '../../../sql/iva-to-ava.sql'
      );

      if (!fs.existsSync(sqlFilePath)) {
        throw new Error(`SQL file not found: ${sqlFilePath}`);
      }

      const rl = readline.createInterface({
        input: fs.createReadStream(sqlFilePath, { encoding: 'utf8' }),
        crlfDelay: Infinity
      });

      let buffer = '', stmts = 0, bytes = 0;
      const errors = [];
      let delimiter = ';';
      for await (const line of rl) {
        const trimmed = line.trim();
        // Skip SQL comments
        if (/^(--|\/\*)/.test(trimmed)) continue;
        // Handle delimiter changes (e.g. DELIMITER ;; or DELIMITER $$)
        if (trimmed.startsWith('DELIMITER')) {
          delimiter = trimmed.split(' ')[1];
          continue;
        }
        buffer += line + '\n';
        if (buffer.trim().endsWith(delimiter)) {
          const statement = buffer.trim().slice(0, -delimiter.length).trim();
          if (statement) {
            if (shouldSkipStatement(statement)) {
              console.warn('Skipping unsafe SQL statement (DROP/DELETE/TRUNCATE):', statement.length > 250 ? statement.slice(0, 250) + '…' : statement);
              buffer = '';
              continue;
            }
            try {
              await conn.query(statement);
            } catch (e) {
              console.error('Failed statement:', statement);
              console.error('SQL error:', e?.sqlMessage || e?.message, 'code:', e?.code);
              errors.push({
                code: e?.code,
                errno: e?.errno,
                message: e?.sqlMessage || e?.message,
                statement_preview: statement.length > 250 ? statement.slice(0, 250) + '…' : statement
              });
              if (!continueOnError) throw e;
            }
            stmts++;
            bytes += Buffer.byteLength(statement, 'utf8');
          }
          buffer = '';
        }
      }

      if (buffer.trim()) {
        if (shouldSkipStatement(buffer.trim())) {
          console.warn('Skipping unsafe SQL statement (DROP/DELETE/TRUNCATE):', buffer.trim().length > 250 ? buffer.trim().slice(0, 250) + '…' : buffer.trim());
          buffer = '';
        } else {
          try {
            await conn.query(buffer.trim());
          } catch (e) {
            console.error('Failed statement:', buffer.trim());
            console.error('SQL error:', e?.sqlMessage || e?.message, 'code:', e?.code);
            errors.push({
              code: e?.code,
              errno: e?.errno,
              message: e?.sqlMessage || e?.message,
              statement_preview: buffer.trim().length > 250 ? buffer.trim().slice(0, 250) + '…' : buffer.trim()
            });
            if (!continueOnError) throw e;
          }
          stmts++;
          bytes += Buffer.byteLength(buffer.trim(), 'utf8');
        }
      }

      console.log(`SQL execution complete: ${stmts} statements, ${(bytes / 1_048_576).toFixed(1)} MB`);
      return {
        sql_file: sqlFilePath,
        executed_statements: stmts,
        executed_mb: Number((bytes / 1_048_576).toFixed(2)),
        continue_on_error: continueOnError,
        errors
      };
    } catch (err) {
      console.log("Error in executeIvaToAvaSqlFile service layer:", err);
      throw err;
    } finally {
      if (conn) {
        await conn.end();
        console.log('🔌  MySQL connection closed');
      }
    }
  }

  async createKeycloakUser(user) {
    try {
      let token = await this.OauthUtil.getKeycoakAccessToken();
      // console.log("user::::::", user)
      if (token && token.access_token) {
        let data = {
          username: user.email,
          email: user.email,
          enabled: true,
          firstName: user.name.split(' ')[0],
          lastName: user.name.split(' ')?.[1] || '',
          attributes: {
            role: user.role.toString(),
            type: "user"
          },
          credentials: [
            {
              type: "password",
              value: user.password,
              temporary: false
            }
          ]
        };
        let options = {
          headers: {
            "content-type": "application/json",
            authorization: "Bearer " + token.access_token,
          },
        };
        let url = `${this.config.get("keycloak:url")}/admin/realms/${this.config.get('keycloak:realm')}/users`;
        const response = await this.restUtil.postRequest(url, data, options);
        return response; // return full response
      } else {
        throw new Error("Access token not found");
      }
    } catch (err) {
      console.log("Error in createKeycloakUser service layer:", err);
      throw err;
    }
  }

  // Save first run status and customers in MySQL
  async createFirstRunStatusInMysql(firstRunData) {
    let t;
    try {
      let FirstRunStatusModel = await new this.first_run_status(MESSAGEUTIL.info().database.operation.write, MESSAGEUTIL.info().database_tables.first_run_status);
      t = await FirstRunStatusModel.SEQUELIZE.transaction();
      let result = await FirstRunStatusModel.FIRSTRUNSTATUS.create({
        dbIntialization: firstRunData.dbIntialization,
        stepper: firstRunData.stepper,
        mysqldb: firstRunData.mysqldb,
        mongodb: firstRunData.mongodb,
        redis: firstRunData.redis,
        domain: firstRunData.domain,
        builderdb_restore: firstRunData.builderdb_restore,
        inserted_collection: firstRunData.inserted_collection,
        mysqldb_restore: firstRunData.mysqldb_restore,
        inserted_tables: firstRunData.inserted_tables,         // array will be stored as JSON
        sign_up: firstRunData.sign_up,
        created_by: firstRunData.created_by,
        modified_by: firstRunData.modified_by,
        created_at: firstRunData.created_at ? new Date(firstRunData.created_at) : new Date(),
        updated_at: firstRunData.updated_at ? new Date(firstRunData.updated_at) : new Date(),
        email: firstRunData.user_config?.email || null,
        password: firstRunData.user_config?.password || null,
        username: firstRunData.user_config?.username || null
      }, { transaction: t });
      return { result: result, transaction: t };
    } catch (err) {
      console.log("Error in createFirstRunStatusInMysql service layer:", err);
      if (t) await t.rollback();
      throw err;
    }
  }

  async getFirstRunStatusInMysql(domain) {
    try {
      const FirstRunStatusModel = await new this.first_run_status(
        MESSAGEUTIL.info().database.operation.read,
        MESSAGEUTIL.info().database_tables.first_run_status
      );
      const record = await FirstRunStatusModel.FIRSTRUNSTATUS.findOne({
        where: { domain },
      });
      return record; // will be null if not found
    } catch (err) {
      throw err;
    }
  }

  async updateFirstRunStatusInMysql(data) {
    let t;
    try {
      console.log("Data to update First Run Status in Service MySQL:", data);
      const domain = data.domain;
      const values = data.values;
      const FirstRunStatusModel = await new this.first_run_status(
        MESSAGEUTIL.info().database.operation.write,
        MESSAGEUTIL.info().database_tables.first_run_status
      );
      t = await FirstRunStatusModel.SEQUELIZE.transaction();
      const rowsUpdated = await FirstRunStatusModel.FIRSTRUNSTATUS.update(
        values,
        {
          where: { domain },
          t,
        }
      );
      await t.commit();
      return rowsUpdated;
    } catch (error) {
      console.log("Error in updateFirstRunStatusInMysql service layer:", error);
      if (t) await t.rollback();
      throw error;
    }
  }

  async getConfigValueThoughKeyName(config_key) {
    try {
      let platform_config = await new MODELS[MESSAGEUTIL.info().database_tables.callai_platform_config](MESSAGEUTIL.info().database.operation.write, MESSAGEUTIL.info().database_tables.callai_platform_config);
      const response = await platform_config.PLATFORMCONFIG.findOne({ where: { config_key: config_key } });
      return response;
    } catch (err) {
      throw err
    }
  }

  async createconfigValue(data) {
    try {
      let platform_config = await new MODELS[MESSAGEUTIL.info().database_tables.callai_platform_config](MESSAGEUTIL.info().database.operation.write, MESSAGEUTIL.info().database_tables.callai_platform_config);
      // Upsert, not update: config_key is unique, and a plain update on an
      // unseeded key matches zero rows while still reporting success.
      // value_type is NOT NULL with no DB default, so it must be supplied on
      // the insert path — '' matches what the existing rows carry.
      await platform_config.PLATFORMCONFIG.upsert({
        config_key: data.config_key,
        config_value: data.config_value,
        value_type: '',
      });
    } catch (err) {
      throw err
    }
  }


  async forgotPassword(email) {
    try {
      const normalizedEmail = email.trim().toLowerCase();
  
      // 1) Get admin access token
      const tokenResp = await this.restUtil.postRequest(
        `${this.config.get("keycloak:url")}/realms/${this.config.get("keycloak:realm")}/protocol/openid-connect/token`,
        qs.stringify({
          grant_type: "client_credentials",
          client_id: this.config.get("keycloak:client_id"),
          client_secret: this.config.get("keycloak:client_secret"),
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
  
      const adminAccessToken =
        tokenResp?.data?.access_token ||
        tokenResp?.access_token ||
        tokenResp?.body?.access_token;
  
      if (!adminAccessToken) {
        throw { type: "SERVER_ERROR", message: "Failed to obtain admin token" };
      }
  
      // 2) Find user by email
      const usersResp = await this.restUtil.getRequest(
        `${this.config.get("keycloak:url")}/admin/realms/${this.config.get("keycloak:realm")}/users?email=${encodeURIComponent(normalizedEmail)}`,
        { headers: { Authorization: `Bearer ${adminAccessToken}` } }
      );
  
      const users = Array.isArray(usersResp)
        ? usersResp
        : usersResp?.data || [];
  
      // 🔐 Do not expose whether user exists
      if (!users.length) {
        return { triggered: false };
      }
  
      const userId = users[0].id;
  
      // 3) Trigger password reset email
      await this.restUtil.putRequest(
        `${this.config.get("keycloak:url")}/admin/realms/${encodeURIComponent(this.config.get("keycloak:realm"))}/users/${encodeURIComponent(userId)}/execute-actions-email?lifespan=3600`,
        JSON.stringify(["UPDATE_PASSWORD"]),
        {
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      return { triggered: true, email: normalizedEmail };
    } catch (err) {
      throw {
        type: err?.type || "SERVER_ERROR",
        message: err?.message || "Forgot password failed",
        details: err?.details || err?.response?.data || err,
      };
    }
  }
  

  
}

module.exports = AuthenticationService;
