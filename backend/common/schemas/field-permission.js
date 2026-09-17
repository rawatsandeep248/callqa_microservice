const CONFIG = require("../utils/config-util");
const MESSAGEUTIL = require("../utils/message-util");
const MONGOOSE = require("mongoose");
const MONGOOSEDB = require("../database/mongoose-db");

class FieldPermissions {
  static getSchema(url) {
    this.CONNECTION = new MONGOOSEDB(url).connectToDB();
    const FIELD_PERMISSIONS = new MONGOOSE.Schema(
      {
        name: { type: String, required: true },
        read_only:{
            type:Boolean,
            default:false
        },
        write:{
            type:Boolean,
            default:false
        },
        status: {
          type: String,
          required: true,
          default: MESSAGEUTIL.info().status.active,
          enum: [
            MESSAGEUTIL.info().status.active,
            MESSAGEUTIL.info().status.in_active,
          ],
        },
      },
      { timestamps: true }
    );

    FIELD_PERMISSIONS.index(
      { name: 1 },
      { unique: true, name: "IDX_FIELD_PERMISSION_NAME" }
    );

    const FIELD_PERMISSIONS_SCHEMA = this.CONNECTION.model(
      MESSAGEUTIL.info().database_collections.customer_db.field_permissions,
      FIELD_PERMISSIONS
    );
    return FIELD_PERMISSIONS_SCHEMA;
  }
}
module.exports = FieldPermissions;
