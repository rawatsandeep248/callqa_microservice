const MONGOOSEDB = require("../../../common/database/mongoose-query");
const MESSAGEUTIL = require("../../../common/utils/message-util");
const COMMONUTIL = require("../../../common/utils/common-util");
const mongoose = require("mongoose");

class PlatformDropdownConfigsService {
    constructor(config) {
        this.config = config;
        this.mongoose = new MONGOOSEDB();
    }

    getCustomerDbUrl() {
        const database = this.config.get("database");
        let url = database.host;
        url = url.replace("$username", database.user);
        url = url.replace("$password", database.password);
        url = url.replace("$database", database.name);
        return url;
    }

    async createPlatformDropdownConfig(data) {
        const url = this.getCustomerDbUrl();
        const collectionModel = COMMONUTIL.getCustomerMongooseCollection(
            MESSAGEUTIL.info().database_collections.customer_db.platform_dropdown_configs
        );
        try {
            const result = await this.mongoose.create_record(
                MESSAGEUTIL.info().database_collections.customer_db.platform_dropdown_configs,
                url,
                collectionModel,
                MESSAGEUTIL.info().database_req_type.customer,
                data
            );
            // create_record wraps model.create([document]) — result.result comes
            // back as a one-element array. Callers (including the Angular
            // clients that read response.data.result._id) expect a single
            // document, so normalize it here rather than at every call site.
            if (Array.isArray(result.result)) {
                result.result = result.result[0];
            }
            return result;
        } catch (error) {
            // module_name is unique. Two callers can race to create the first
            // document for a module (e.g. two browser tabs both bootstrapping
            // defaults, or two "add value" clicks before either response has
            // come back) — the loser hits E11000. Treat that as "already
            // exists" and merge its dropdown values into the existing
            // document instead of failing the request outright.
            const isDuplicateKey = error?.code === 11000
                || error?.originalError?.code === 11000
                || /E11000/.test(error?.message || error?.errmsg || '');
            if (!isDuplicateKey) throw error;
            return await this._mergeDropdownsIntoExisting(url, collectionModel, data);
        }
    }

    // Merges { module_name, dropdowns } into whichever document actually won
    // the create race, adding any new dropdown_name entries and only the
    // dropdown_values not already present (so retrying an identical seed call
    // is a safe no-op rather than introducing duplicate values).
    async _mergeDropdownsIntoExisting(url, collectionModel, data) {
        const existing = await this.mongoose.find_single_record(
            MESSAGEUTIL.info().database_collections.customer_db.platform_dropdown_configs,
            url, collectionModel, MESSAGEUTIL.info().database_req_type.customer,
            { module_name: data.module_name }, null, null
        );
        const doc = existing.result;
        if (!doc) throw new Error(`platform_dropdown_configs for module_name "${data.module_name}" reported a duplicate key but could not be re-read.`);

        for (const d of data.dropdowns || []) {
            const existingDropdown = (doc.dropdowns || []).find((x) => x.dropdown_name === d.dropdown_name);
            if (existingDropdown) {
                const newValues = (d.dropdown_values || []).filter((v) => !existingDropdown.dropdown_values.includes(v));
                if (newValues.length) {
                    await this.mongoose.update_record(
                        MESSAGEUTIL.info().database_collections.customer_db.platform_dropdown_configs,
                        url, collectionModel, MESSAGEUTIL.info().database_req_type.customer,
                        { _id: doc._id, "dropdowns.dropdown_name": d.dropdown_name },
                        { $addToSet: { "dropdowns.$.dropdown_values": { $each: newValues } } }
                    );
                }
            } else {
                await this.mongoose.update_record(
                    MESSAGEUTIL.info().database_collections.customer_db.platform_dropdown_configs,
                    url, collectionModel, MESSAGEUTIL.info().database_req_type.customer,
                    { _id: doc._id },
                    { $push: { dropdowns: { dropdown_name: d.dropdown_name, dropdown_values: d.dropdown_values } } }
                );
            }
        }

        return await this.mongoose.find_single_record(
            MESSAGEUTIL.info().database_collections.customer_db.platform_dropdown_configs,
            url, collectionModel, MESSAGEUTIL.info().database_req_type.customer,
            { module_name: data.module_name }, null, null
        );
    }

    async getAllPlatformDropdownConfigs() {
        try {
            const url = this.getCustomerDbUrl();
            const collectionModel = COMMONUTIL.getCustomerMongooseCollection(
                MESSAGEUTIL.info().database_collections.customer_db.platform_dropdown_configs
            );
            const result = await this.mongoose.find_sorted_record(
                MESSAGEUTIL.info().database_collections.customer_db.platform_dropdown_configs,
                url,
                collectionModel,
                MESSAGEUTIL.info().database_req_type.customer,
                {},
                { created_at: -1 }
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getPlatformDropdownConfigById(id) {
        try {
            const url = this.getCustomerDbUrl();
            const collectionModel = COMMONUTIL.getCustomerMongooseCollection(
                MESSAGEUTIL.info().database_collections.customer_db.platform_dropdown_configs
            );
            const query = { _id: new mongoose.Types.ObjectId(id) };
            const result = await this.mongoose.find_single_record(
                MESSAGEUTIL.info().database_collections.customer_db.platform_dropdown_configs,
                url,
                collectionModel,
                MESSAGEUTIL.info().database_req_type.customer,
                query,
                null,
                null
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    async updatePlatformDropdownConfigValue(id, dropdown_name, action, value) {
        try {
            const url = this.getCustomerDbUrl();
            const collectionModel = COMMONUTIL.getCustomerMongooseCollection(
                MESSAGEUTIL.info().database_collections.customer_db.platform_dropdown_configs
            );

            // Try updating value inside an existing dropdown entry
            const queryExisting = {
                _id: new mongoose.Types.ObjectId(id),
                "dropdowns.dropdown_name": dropdown_name
            };
            const operator = action === "add" ? "$push" : "$pull";
            // const operator = action === "add" ? "$addToSet" : "$pull";
            const valuesExisting = {
                [operator]: { "dropdowns.$.dropdown_values": value }
            };
            const result = await this.mongoose.update_record(
                MESSAGEUTIL.info().database_collections.customer_db.platform_dropdown_configs,
                url,
                collectionModel,
                MESSAGEUTIL.info().database_req_type.customer,
                queryExisting,
                valuesExisting
            );

            // If dropdown_name didn't exist in the array yet, add it as a new entry
            if (result.result && result.result.matchedCount === 0 && action === "add") {
                const queryRecord = { _id: new mongoose.Types.ObjectId(id) };
                const valuesNew = {
                    $push: { dropdowns: { dropdown_name, dropdown_values: [value] } }
                };
                return await this.mongoose.update_record(
                    MESSAGEUTIL.info().database_collections.customer_db.platform_dropdown_configs,
                    url,
                    collectionModel,
                    MESSAGEUTIL.info().database_req_type.customer,
                    queryRecord,
                    valuesNew
                );
            }

            return result;
        } catch (error) {
            throw error;
        }
    }

    async deletePlatformDropdownConfig(id) {
        try {
            const url = this.getCustomerDbUrl();
            const collectionModel = COMMONUTIL.getCustomerMongooseCollection(
                MESSAGEUTIL.info().database_collections.customer_db.platform_dropdown_configs
            );
            const query = { _id: new mongoose.Types.ObjectId(id) };
            const result = await this.mongoose.delete_record(
                MESSAGEUTIL.info().database_collections.customer_db.platform_dropdown_configs,
                url,
                collectionModel,
                MESSAGEUTIL.info().database_req_type.customer,
                query
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = PlatformDropdownConfigsService;
