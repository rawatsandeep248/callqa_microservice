const { connectToDB, createNewDBConnection } = require("./mongoose-db");
const MESSAGEUTIL = require("../utils/message-util");

/** Connections use autoIndex:false; track which collections already ran createIndexes. */
const mongooseIndexesEnsured = new WeakMap();

async function ensureCollectionIndexes(db, model, collectionName) {
  let ensured = mongooseIndexesEnsured.get(db);
  if (!ensured) {
    ensured = new Set();
    mongooseIndexesEnsured.set(db, ensured);
  }
  if (ensured.has(collectionName)) {
    return;
  }
  await model.createIndexes();
  ensured.add(collectionName);
}

/**
 * ws: with session
 */

class MongoDB {
  constructor() { 
    this.getDbConnection = this.getDbConnection.bind(this)
    this.closeCustomerDBConnection = this.closeCustomerDBConnection.bind(this)
  }

  async getDbConnection(reqFor, databaseUrl) {
    try {
      let db;
      if (reqFor !== MESSAGEUTIL.info().database_req_type.master) {
        let tenant_id = databaseUrl.split("/")[3].split("?")[0];
        if (
          global?.mongoObject[`${tenant_id}`] !== undefined &&
          global?.mongoObject[`${tenant_id}`] !== null && global?.mongoObject[`${tenant_id}`]._readyState == 1
        ) {
          db = global?.mongoObject[`${tenant_id}`];
          console.log("when db is in the global object::::")
        } else {
          db = await createNewDBConnection(databaseUrl);
          global.mongoObject[`${tenant_id}`] = db;
          console.log("when db is not in the global object::::")
        }
      }
      else {
        console.log("in the master db connection::::")
        db = await connectToDB(databaseUrl);
      }
      if (db instanceof Error) {
        throw db;
      }

      return db;
    }
    catch (err) {
      throw err;
    }
  }

  async closeCustomerDBConnection(db, databaseUrl) {
    try{
    db?.close();
    let tenant_id = databaseUrl.split("/")[3].split("?")[0];
    if (
      global?.mongoObject[`${tenant_id}`] !== undefined &&
      global?.mongoObject[`${tenant_id}`] !== null
    ) {
      global.mongoObject[`${tenant_id}`] = null;
    }
  }
  catch(err){
    throw err ;
  }
  }
  async create_database(databaseUrl, reqFor) {
    let response = {};
    let level = 0;
    let db;
    try {
       db = createNewDBConnection(databaseUrl);
      if (db instanceof Error) {
        throw db;
      }

      level = 1;

      let response = {
        reqFor,
      }

      let doc = { message: "New database created" };
      let res = await db.collection('README').insertOne(doc);
      db.close();
      response['result'] = res;
      return response;
    } catch (error) {
      switch (level) {
        case 0:
          throw error;
        case 1:
          response['error'] = error;
          response['originatedFrom'] = "database";
          throw response;
      }
    }
  }

  // TODO: Need to test below code
  async drop_database(databaseUrl) {
    let response = {};
    let level = 0;
    let db;
    try {
       db = await createNewDBConnection(databaseUrl);
      if (db instanceof Error) {
        throw { error: db };
      }
      level = 1;

      const res = await db.dropDatabase();
      // console.log("ff", res)
      let response = {
        reqFor: "",
      }
      db.close();

      response['result'] = res;
      return response
    } catch (error) {
      switch (level) {
        case 0:
          throw error;
        case 1:
          response['error'] = error;
          response['originatedFrom'] = "database";
          throw response;
      }
    }
  }

  async create_record_ws(collectionName, databaseUrl, collectionModel, reqFor, document) {
    let session;
    let response = {};
    let level = 0;
    let db;
    try {
      db = await this.getDbConnection(reqFor, databaseUrl);

      level = 1;
      const model = db.models[collectionName] || db.model(collectionName, collectionModel);
      session = await model.startSession();
      session.startTransaction();

      response = {
        connection: db,
        session: session,
        reqFor,
      }
      const res = await model.create([document], { session })
      response['result'] = res;
      return response;
    } catch (error) {
      switch (level) {
        case 0:
          throw error;
        case 1:
          response['error'] = error;
          response['originatedFrom'] = "database";
          throw response;
      }
    }
  }

  async update_record_ws(collectionName, databaseUrl, collectionModel, reqFor, query, values) {
    let session;
    let response = {};
    let level = 0;
    let db;
    try {
      db = await this.getDbConnection(reqFor, databaseUrl);

      level = 1;
      const model = db.models[collectionName] || db.model(collectionName, collectionModel);

      session = await model.startSession();
      session.startTransaction();
      response = {
        connection: db,
        session: session,
        reqFor,
      }
      const res = await model.updateOne(query, values, { session: session });
      response['result'] = res;
      return response;
    } catch (error) {
      switch (level) {
        case 0:
          throw error;
        case 1:
          response['error'] = error;
          response['originatedFrom'] = "database";
          throw response;
      }
    }
  }

  async find_and_update_ws(collectionName, databaseUrl, collectionModel, reqFor, query, values) {
    let session;
    let response = {};
    let level = 0;
    let db;
    try {
    
      db = await this.getDbConnection(reqFor, databaseUrl);

      level = 1;
      const model = db.models[collectionName] || db.model(collectionName, collectionModel);
      session = await model.startSession();
      session.startTransaction();

      response = {
        connection: db,
        session: session,
        reqFor,
      }
      const res = await session.findAndUpdate(query, values, { session: session });
      response['result'] = res;
      return response;
    } catch (error) {
      switch (level) {
        case 0:
          throw error;
        case 1:
          response['error'] = error;
          response['originatedFrom'] = "database";
          throw response;
      }
    }
  }

  async update_many_records_ws(collectionName, databaseUrl, collectionModel, reqFor, query, values) {
    let session;
    let response = {};
    let level = 0;
    let db;
    try {
    
      db = await this.getDbConnection(reqFor, databaseUrl);


      level = 1;
      const model = db.models[collectionName] || db.model(collectionName, collectionModel);
      session = await model.startSession();
      session.startTransaction();

      response = {
        connection: db,
        session: session,
        reqFor,
      }

      const res = await session.updateMany(query, values, { session: session });
      response['result'] = res;
      return response;
    } catch (error) {
      switch (level) {
        case 0:
          throw error;
        case 1:
          response['error'] = error;
          response['originatedFrom'] = "database";
          throw response;
      }
    }
  }

  async update_many_records(collectionName, databaseUrl, collectionModel, reqFor, query, values) {
    let response = {};
    let level = 0;
    try {
      let db = await this.getDbConnection(reqFor, databaseUrl);
      level = 1;
      const model = db.models[collectionName] || db.model(collectionName, collectionModel);
      const res = await model.updateMany(query, values);
      response['result'] = res;
      return response;
    } catch (error) {
      switch (level) {
        case 0:
          throw error;
        case 1:
          response['error'] = error;
          response['originatedFrom'] = "database";
          throw response;
      }
    }
  }

  async update_record_with_upsert_ws(collectionName, databaseUrl, collectionModel, reqFor, query, values) {
    let session;
    let response = {};
    let level = 0;
    let db;
    try {
      db = await this.getDbConnection(reqFor, databaseUrl);
      level = 1;
      const model = db.models[collectionName] || db.model(collectionName, collectionModel);

      session = await model.startSession();
      session.startTransaction();

      const res = await session.updateOne(query, values, { upsert: true }, { session: session });
      response['result'] = res;
      return response;
    } catch (error) {
      switch (level) {
        case 0:
          throw error;
        case 1:
          response['error'] = error;
          response['originatedFrom'] = "database";
          throw response;
      }
    }
  }

  async insert_many_record_ws(collectionName, databaseUrl, collectionModel, reqFor, documents) {
    let session;
    let response = {};
    let level = 0;
    let db;
    try {
    
      db = await this.getDbConnection(reqFor, databaseUrl);


      level = 1;
      let model;
      if (Object.keys(collectionModel).includes("RBAC_ROLES")) {
          db.models["MODULES"] || db.models["modules"] ? "" : db.model("modules", collectionModel.MODULES);
        model = db.models[collectionName] || db.model(collectionName, collectionModel.RBAC_ROLES);
      } else {
        model = db.models[collectionName] || db.model(collectionName, collectionModel);
      }

      session = await model.startSession();
      session.startTransaction();

      response = {
        connection: db,
        session: session,
        reqFor,
      }
      // console.log("DOCUMENT", documents)
      const res = await model.insertMany(documents, { session: session });
      response['result'] = res;
      return response;
    } catch (error) {
      switch (level) {
        case 0:
          throw error;
        case 1:
          response['error'] = error;
          response['originatedFrom'] = "database";
          throw response;
      }
    }
  }

  async delete_record_ws(collectionName, databaseUrl, collectionModel, reqFor, query) {
    let session;
    let response = {};
    let level = 0;
    let db;
    try {
    
      db = await this.getDbConnection(reqFor, databaseUrl);


      level = 1;
      const model = db.models[collectionName] || db.model(collectionName, collectionModel);
      session = await model.startSession();
      session.startTransaction();

      response = {
        connection: db,
        session: session,
        reqFor,
      }

      const res = await model.deleteOne(query, { session: session });
      response['result'] = res;
      return response;
    } catch (error) {
      switch (level) {
        case 0:
          throw error;
        case 1:
          response['error'] = error;
          response['originatedFrom'] = "database";
          throw response;
      }
    }
  }

  async delete_many_record_ws(collectionName, databaseUrl, collectionModel, reqFor, query) {
    let session;
    let response = {};
    let db;
    let level = 0;
    try {
    
      db = await this.getDbConnection(reqFor, databaseUrl);

      level = 1;
      const model = db.models[collectionName] || db.model(collectionName, collectionModel);
      session = await model.startSession();
      session.startTransaction();

      response = {
        connection: db,
        session: session,
        reqFor,
      }

      const res = await model.deleteMany(query, { session: session })
      response['result'] = res;
      return response;
    } catch (error) {
      switch (level) {
        case 0:
          throw error;
        case 1:
          response['error'] = error;
          response['originatedFrom'] = "database";
          throw response;
      }
    }
  }

  async create_record(collectionName, databaseUrl, collectionModel, reqFor, document) {
    let db;
    try {
      let response = {};
    
      db = await this.getDbConnection(reqFor, databaseUrl);

      const model = db.models[collectionName] || db.model(collectionName, collectionModel);
      await ensureCollectionIndexes(db, model, collectionName);
      const res = await model.create([document])
      response['result'] = res;
      // reqFor !== MESSAGEUTIL.info().database_req_type.master ? db.close() : "";
      return response;
    } catch (error) {
    
      if (!db instanceof Error && reqFor !== MESSAGEUTIL.info().database_req_type.master) {
        this.closeCustomerDBConnection(db, databaseUrl)
      }
      throw error;
    }
  }

  async insert_many_record(collectionName, databaseUrl, collectionModel, reqFor, documents) {
    let response = {};
    let level = 0;
    try {
      let db = await this.getDbConnection(reqFor, databaseUrl);
      level = 1;

      const model = db.models[collectionName] || db.model(collectionName, collectionModel);
      await ensureCollectionIndexes(db, model, collectionName);
      const res = await model.insertMany(documents,{});
      let response = {
        'result' : res
      }
      return response;
    } catch (error) {
      switch (level) {
        case 0:
          throw error;
        case 1:
          response['error'] = error;
          response['originatedFrom'] = "database";
          throw response;
      }
    }
  }

  async update_record(collectionName, databaseUrl, collectionModel, reqFor, query, values) {
    let db;
    try {
      let response = {};
    
      db = await this.getDbConnection(reqFor, databaseUrl);

      const model = db.models[collectionName] || db.model(collectionName, collectionModel);
      const res = await model.updateOne(query, values);
      response['result'] = res;
      // reqFor !== MESSAGEUTIL.info().database_req_type.master ? db.close() : "";
      return response;
    } catch (error) {
    
      if (!db instanceof Error && reqFor !== MESSAGEUTIL.info().database_req_type.master) {
        this.closeCustomerDBConnection(db, databaseUrl)
      }
      throw error;
    }
  }

  async update_record_with_upsert(collectionName, databaseUrl, collectionModel, reqFor, query, values) {
    let db;
    try {
      let response = {};
      db = await this.getDbConnection(reqFor, databaseUrl);
      const model = db.models[collectionName] || db.model(collectionName, collectionModel);
      const res = await model.updateOne(query, values, { upsert: true });
      response['result'] = res;
      return response;
    } catch (error) {
      console.log("ERRRRRRRRRRRRrrrr", error)
      if (!db instanceof Error && reqFor !== MESSAGEUTIL.info().database_req_type.master) {
        this.closeCustomerDBConnection(db, databaseUrl)
      }
      throw error;
    }
  }

  async find_and_update(collectionName, databaseUrl, collectionModel, reqFor, query, values) {
    let db;
    try {
      let response = {};

    
      db = await this.getDbConnection(reqFor, databaseUrl);

      const model = db.models[collectionName] || db.model(collectionName, collectionModel);
      const res = await model.findOneAndUpdate(query, values);
      response['result'] = res;
      // reqFor !== MESSAGEUTIL.info().database_req_type.master ? db.close() : "";
      return response;
    } catch (error) {
      
      if (!db instanceof Error && reqFor !== MESSAGEUTIL.info().database_req_type.master) {
        this.closeCustomerDBConnection(db, databaseUrl)
      }
      throw error;
    }
  }

  async delete_record(collectionName, databaseUrl, collectionModel, reqFor, query) {
    let db;
    try {
      let response = {};
    
      db = await this.getDbConnection(reqFor, databaseUrl);

      const model = db.models[collectionName] || db.model(collectionName, collectionModel);
      const res = await model.deleteOne(query);
      response['result'] = res;
      // reqFor !== MESSAGEUTIL.info().database_req_type.master ? db.close() : "";
      return response;
    } catch (error) {
   
      if (!db instanceof Error && reqFor !== MESSAGEUTIL.info().database_req_type.master) {
        this.closeCustomerDBConnection(db, databaseUrl)
      }
      throw error;
    }
  }

  async delete_many(collectionName, databaseUrl, collectionModel, reqFor, query) {
    let db;
    try {
      let response = {};
      db = await this.getDbConnection(reqFor, databaseUrl);
      const model = db.models[collectionName] || db.model(collectionName, collectionModel);
      const res = await model.deleteMany(query);
      response['result'] = res;
      return response;
    } catch (error) {
      if (!db instanceof Error && reqFor !== MESSAGEUTIL.info().database_req_type.master) {
        this.closeCustomerDBConnection(db, databaseUrl)
      }
      throw error;
    }
  }

  async count_record(collectionName, databaseUrl, collectionModel, reqFor, query) {
    let db;
    let response = {};
    try {
    
      db = await this.getDbConnection(reqFor, databaseUrl);

      const model = db.models[collectionName] || db.model(collectionName, collectionModel);
      const res = await model.count(query);
      response['result'] = res;
      // reqFor !== MESSAGEUTIL.info().database_req_type.master ? db.close() : "";
      return response;
    } catch (reason) {
    
      if (!db instanceof Error && reqFor !== MESSAGEUTIL.info().database_req_type.master) {
        this.closeCustomerDBConnection(db, databaseUrl)
      }
      throw reason;
    }
  }

  async find_record(collectionName, databaseUrl, collectionModel, reqFor, query, fields, populate) {
    let db;
    let response = {};
    try {
    
      db = await this.getDbConnection(reqFor, databaseUrl);

      // TODO: Need to find alternate for below statement
      let model;
      //console.log(Object.keys(collectionModel));
      if (Object.keys(collectionModel).includes("RBAC_ROLES")) {
        // console.log("Object.keys(collectionModel)", Object.keys(collectionModel), "[][][][][", db.models, "test", populate)
        // console.log("**********", collectionName);
          db.models["MODULES"] || db.models["modules"] ? "" : db.model("modules", collectionModel.MODULES);
        model = db.models[collectionName] || db.model(collectionName, collectionModel.RBAC_ROLES);
      } else {
        model = db.models[collectionName] || db.model(collectionName, collectionModel);
      }
      const res = populate ? await model.find(query).select(fields).populate(populate.collection) : await model.find(query).select(fields);
      response['result'] = res;
      // reqFor !== MESSAGEUTIL.info().database_req_type.master ? db.close() : "";
      return response;
    } catch (reason) {
    
      if (!db instanceof Error && reqFor !== MESSAGEUTIL.info().database_req_type.master) {
        this.closeCustomerDBConnection(db, databaseUrl)
      }
      throw reason;
    }
  }

  async filter_record_pager(collectionName, databaseUrl, collectionModel, reqFor, query, fields, skip, limit) {
    let db;
    let response = {};
    try {
   
      db = await this.getDbConnection(reqFor, databaseUrl);


      const model = db.models[collectionName] || db.model(collectionName, collectionModel);
      const res = await model.find(query).select(fields).skip(skip * limit).limit(limit);
      response['result'] = res;
      // reqFor !== MESSAGEUTIL.info().database_req_type.master ? db.close() : "";
      return response;
    } catch (reason) {
    
      if (!db instanceof Error && reqFor !== MESSAGEUTIL.info().database_req_type.master) {
        this.closeCustomerDBConnection(db, databaseUrl)
      }
      throw reason;
    }
  }

  async find_many_record(collectionName, databaseUrl, collectionModel, reqFor, populate, query = {}) {
    let db;
    let response = {};
    try {
   
      db = await this.getDbConnection(reqFor, databaseUrl);

      // TODO: Need to find alternate for below statement
      let model;
      if (Object.keys(collectionModel).includes("RBAC_ROLES")) {
        model = db.models[collectionName] || db.model(collectionName, collectionModel.RBAC_ROLES);
        if(! Object.keys(db.models).includes("modules")){
          db.model("modules", collectionModel.MODULES)
        }
      } else {
        model = db.models[collectionName] || db.model(collectionName, collectionModel);
      }
      const res = populate ? await model.find(query).populate(populate.collection) : await model.find();
      response['result'] = res;
      return response;
    } catch (reason) {
    
      if (!db instanceof Error && reqFor !== MESSAGEUTIL.info().database_req_type.master) {
        this.closeCustomerDBConnection(db, databaseUrl)
      }
      console.log("reasons:", reason)
      throw reason;
    }
  }

  async check_records_exists(collectionName, databaseUrl, collectionModel, reqFor, query) {
    let db;
    let response = {};
    try {
      db = await this.getDbConnection(reqFor, databaseUrl);

      const model = db.models[collectionName] || db.model(collectionName, collectionModel);
      const res = await model.exists(query)

      response['result'] = res;
      // reqFor !== MESSAGEUTIL.info().database_req_type.master ? db.close() : "";
      return response;
    } catch (reason) {
      if (!db instanceof Error && reqFor !== MESSAGEUTIL.info().database_req_type.master) {
        this.closeCustomerDBConnection(db, databaseUrl)
      }
      throw reason;
    }
  }

  async find_record_pager(collectionName, databaseUrl, collectionModel, reqFor, query, skip, limit, fields) {
    let db;
    let response = {};
    try {
      db = await this.getDbConnection(reqFor, databaseUrl);

      const model = db.models[collectionName] || db.model(collectionName, collectionModel);
      const res = await model.find(query).skip(skip * limit).limit(limit).select(fields);


      response['result'] = res;
      // reqFor !== MESSAGEUTIL.info().database_req_type.master ? db.close() : "";
      return response;
    } catch (error) {
      console.log("ERRRRRR", error)
      if (!db instanceof Error && reqFor !== MESSAGEUTIL.info().database_req_type.master) {
        this.closeCustomerDBConnection(db, databaseUrl)
      }
      throw error;
    }
  }

  async find_sorted_record(collectionName, databaseUrl, collectionModel, reqFor, query, fields) {
    console.log("cll name ", collectionName)
    let db;
    let response = {};
    try {
      db = await this.getDbConnection(reqFor, databaseUrl);
      const model = db.models[collectionName] || db.model(collectionName, collectionModel);
      const res = await model.find(query).sort(fields);
      response['result'] = res;
      return response;
    } catch (reason) {
      if (!db instanceof Error && reqFor !== MESSAGEUTIL.info().database_req_type.master) {
        this.closeCustomerDBConnection(db, databaseUrl)
      }
      throw reason;
    }
  }

  async find_record_sorting_pager(collectionName, databaseUrl, collectionModel, reqFor, query, skip, limit, fields) {
    let db;
    let response = {};
    try {
      db = await this.getDbConnection(reqFor, databaseUrl);

      const model = db.models[collectionName] || db.model(collectionName, collectionModel);
      const res = await model.find(query).sort({ "fhir_specs.fhir_resource_name": 1 }).skip(skip * limit).limit(limit).select(fields);

      // console.log("res", res)

      response['result'] = res;
      // reqFor !== MESSAGEUTIL.info().database_req_type.master ? db.close() : "";
      return response;
    } catch (error) {
      console.log("ERRRRRR", error)
      if (!db instanceof Error && reqFor !== MESSAGEUTIL.info().database_req_type.master) {
        this.closeCustomerDBConnection(db, databaseUrl)
      }
      throw error;
    }
  }
  async sort_record(collectionName, databaseUrl, collectionModel, reqFor, sortOrder, skip, limit, fields) {
    let db;
    let response = {};
    try {
      db = await this.getDbConnection(reqFor, databaseUrl);

      const model = db.models[collectionName] || db.model(collectionName, collectionModel);
      const res = await model.find().sort(sortOrder).skip(skip * limit).limit(limit).select(fields);

      response['result'] = res;
      // reqFor !== MESSAGEUTIL.info().database_req_type.master ? db.close() : "";
      return response;
    } catch (error) {
      console.log("ERRRRRR", error)
      if (!db instanceof Error && reqFor !== MESSAGEUTIL.info().database_req_type.master) {
        this.closeCustomerDBConnection(db, databaseUrl)
      }
      throw error;
    }
  }

  async find_and_update_with_upsert_and_transaction(collectionName, databaseUrl, collectionModel, reqFor, query, values) {
    let db;
    try {
      let response = {};
      db = await this.getDbConnection(reqFor, databaseUrl);
      const model = db.models[collectionName] || db.model(collectionName, collectionModel);
      const session = await model.startSession();
      session.startTransaction();
      let res = {}
      try {
        res = await model.findOneAndUpdate(query, values, { new: true, upsert: true }).session(session);
        await session.commitTransaction();
      } catch (error) {
        console.log("catch with Transaction");
        console.log(error)
        await session.abortTransaction();
      }
      await session.endSession();
      response['result'] = res;
      return response;
    } catch (error) {
      if (!db instanceof Error && reqFor !== MESSAGEUTIL.info().database_req_type.master) {
        this.closeCustomerDBConnection(db, databaseUrl)
      }
      throw error;
    }
  }
  async aggregate_record(collectionName, databaseUrl, collectionModel, reqFor, query) {
    let db;
    let response = {};
    try {
    
      db = await this.getDbConnection(reqFor, databaseUrl);

      const model = db.models[collectionName] || db.model(collectionName, collectionModel);
      const res = await model.aggregate(query);
      response['result'] = res;
      // reqFor !== MESSAGEUTIL.info().database_req_type.master ? db.close() : "";
      return response;
    }
    catch (reason) {
     
      if (!db instanceof Error && reqFor !== MESSAGEUTIL.info().database_req_type.master) {
        this.closeCustomerDBConnection(db, databaseUrl)
      }
      throw reason;
    }
  }

  async aggregate_sort_record(collectionName, databaseUrl, collectionModel, reqFor, query,fields) {
    let db;
    let response = {};
    try {
     
      db = await this.getDbConnection(reqFor, databaseUrl);

      const model = db.models[collectionName] || db.model(collectionName, collectionModel);
      const res = await model.aggregate(query).sort(fields);
      response['result'] = res;
      // reqFor !== MESSAGEUTIL.info().database_req_type.master ? db.close() : "";
      return response;
    }
    catch (reason) {
      if (!db instanceof Error && reqFor !== MESSAGEUTIL.info().database_req_type.master) {
        this.closeCustomerDBConnection(db, databaseUrl)
      }
      throw reason;
    }
  }

  async find_latest_record(collectionName, databaseUrl, collectionModel, reqFor, query, fields, limit) {
    // console.log("cll name ", collectionName, query)
    let db;
    let response = {};
    try {
      db = await this.getDbConnection(reqFor, databaseUrl);
      const model = db.models[collectionName] || db.model(collectionName, collectionModel);
      const res = await model.find(query).select(fields).sort({ _id: -1 }).limit(limit);
      response['result'] = res;
      return response;
    } catch (reason) {
      if (!db instanceof Error && reqFor !== MESSAGEUTIL.info().database_req_type.master) {
        this.closeCustomerDBConnection(db, databaseUrl)
      }
      throw reason;
    }
  }

  async find_single_record(collectionName, databaseUrl, collectionModel, reqFor, query, fields, populate) {
    let db;
    let response = {};
    try {
      
      db = await this.getDbConnection(reqFor, databaseUrl);

      // TODO: Need to find alternate for below statement
      let model;
      //console.log(Object.keys(collectionModel));
      if (Object.keys(collectionModel).includes("RBAC_ROLES")) {
        // console.log("Object.keys(collectionModel)", Object.keys(collectionModel), "[][][][][", db.models, "test", populate)
        // console.log("**********", collectionName);
          db.models["MODULES"] || db.models["modules"] ? "" : db.model("modules", collectionModel.MODULES);
        model = db.models[collectionName] || db.model(collectionName, collectionModel.RBAC_ROLES);
      } else {
        model = db.models[collectionName] || db.model(collectionName, collectionModel);
      }
      const res = populate ? await model.findOne(query).select(fields).populate(populate.collection) : await model.findOne(query).select(fields);
      response['result'] = res;
      // reqFor !== MESSAGEUTIL.info().database_req_type.master ? db.close() : "";
      return response;
    } catch (reason) {
     
      if (!db instanceof Error && reqFor !== MESSAGEUTIL.info().database_req_type.master) {
        this.closeCustomerDBConnection(db, databaseUrl)
      }
      throw reason;
    }
  }

  async find_record_sorted(collectionName, databaseUrl, collectionModel, reqFor,query,  sortOrder, skip, limit, fields) {
    let db;
    let response = {};
    try {
      db = await this.getDbConnection(reqFor, databaseUrl);

      const model = db.models[collectionName] || db.model(collectionName, collectionModel);
      const res = await model.find(query).sort(sortOrder).skip(skip * limit).limit(limit).select(fields);

      response['result'] = res;
      // reqFor !== MESSAGEUTIL.info().database_req_type.master ? db.close() : "";
      return response;
    } catch (error) {
      console.log("ERRRRRR", error)
      if (!db instanceof Error && reqFor !== MESSAGEUTIL.info().database_req_type.master) {
        this.closeCustomerDBConnection(db, databaseUrl)
      }
      throw error;
    }
  }

  async bulk_write(collectionName, databaseUrl, collectionModel, reqFor, operations) {
    let db;
    try {
      let response = {};
      db = await this.getDbConnection(reqFor, databaseUrl);
      const model = db.models[collectionName] || db.model(collectionName, collectionModel);
      const res = await model.bulkWrite(operations);
      response['result'] = res;
      return response;
    } catch (error) {
      console.log("ERRRRRRRRRRRRrrrr", error)
      if (!db instanceof Error && reqFor !== MESSAGEUTIL.info().database_req_type.master) {
        this.closeCustomerDBConnection(db, databaseUrl)
      }
      throw error;
    }
  }
  
  async listCollections(databaseUrl, reqFor) {
    let db;
    try {
      let response = {};
      db = (reqFor !== MESSAGEUTIL.info().database_req_type.master) ? await createNewDBConnection(databaseUrl) : await connectToDB(databaseUrl);
      if (db instanceof Error) {
        throw { error: db };
      }
      await new Promise((resolve, reject) => {
        db.once('open', () => {
          resolve();
        });
      });
      const collections = [];
      const tdata = await db.db.listCollections().toArray();
      for (let i = 0; i < tdata.length; i++) {
        collections.push(tdata[i].name);
      }
      response['collections'] = collections;
      return response;
    } catch (error) {
      console.log("ERRRRRRRRRRRRrrrr", error)
      if (!(db instanceof Error)) {
        reqFor !== MESSAGEUTIL.info().database_req_type.master ? db.close() : "";
      }
      throw error;
    }
  }

  async find_record_sorting_pager(collectionName, databaseUrl, collectionModel, reqFor, sortOrder, skip, limit, query, fields) {
    let response = {}
    let db;
    try {
      console.log('skip * limit', skip, limit, skip * limit)
      db = await this.getDbConnection(reqFor, databaseUrl);
      const model = db.models[collectionName] || db.model(collectionName, collectionModel);
      const res = await model.find().sort(sortOrder).skip(skip * limit).limit(limit).find(query).select(fields);
      response['result'] = res;
      return response;
    } catch (error) {
      console.log("ERRRRRR", error)
      if (!db instanceof Error && reqFor !== MESSAGEUTIL.info().database_req_type.master) {
        this.closeCustomerDBConnection(db, databaseUrl)
      }
      throw error;
    }
  }

  async find_record_with_sort(
    collectionName,
    databaseUrl,
    collectionModel,
    reqFor,
    query,
    fields,
    sort,
    limit
  ) {
    let db;
    let response = {};
    try {
      db = await this.getDbConnection(reqFor, databaseUrl);
      const model =
        db.models[collectionName] || db.model(collectionName, collectionModel);
      let res;
      if(limit) {
        res = await model.find(query).select(fields).sort(sort).limit(limit)
      }else{
        res = await model.find(query).select(fields).sort(sort);
      }
      response["result"] = res;
      return response;
    } catch (reason) {
      if (!db instanceof Error) {
        reqFor !== MESSAGEUTIL.db_info().database_req_type.master
          ? this.closeCustomerDBConnection(db, databaseUrl)
          : "";
      }
      throw reason;
    }
  }
  async createCollection(collectionName, databaseUrl, collectionModel, reqFor) {
    let db;
    let response = {};
    try {
      db = await this.getDbConnection(reqFor, databaseUrl);
      const model =
        db.models[collectionName] || db.model(collectionName, collectionModel);
      const res = await model.createCollection();
      response["result"] = res;
      return response;
    } catch (error) {
      if (
        !db instanceof Error &&
        reqFor !== MESSAGEUTIL.info().database_req_type.master
      ) {
        this.closeCustomerDBConnection(db, databaseUrl);
      }
      throw error;
    }
  }

  async drop_collection(collectionName, databaseUrl, collectionModel, reqFor) {
    let db;
    try {
      db = await this.getDbConnection(reqFor, databaseUrl);
      const model = db.models[collectionName] || db.model(collectionName, collectionModel);
      return model.collection.drop();
    } catch (error) {
      console.log("ERRRRRRRRRRRRrrrr", error)
      if (!(db instanceof Error)) {
        reqFor !== MESSAGEUTIL.info().database_req_type.master ? db.close() : "";
      }
      throw error;
    }
  }
 
}

module.exports = MongoDB; 
