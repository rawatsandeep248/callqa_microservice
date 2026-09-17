const MESSAGEUTIL = require("../utils/message-util");
const MONGOOSE = require("mongoose");
class Permissions {
  static getSchema() {
    const PERMISSIONS = new MONGOOSE.Schema(
      {
        name: { type: String, required: true },
        is_enabled:{
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

    PERMISSIONS.index(
      { name: 1 },
      { unique: true, name: "IDX_PERMISSION_NAME" }
    );
    return PERMISSIONS;
  }
}
module.exports = Permissions;
