const MESSAGEUTIL = require("../utils/message-util");
const MONGOOSE = require("mongoose");

class Modules {
  static getSchema() {
    const MODULES = new MONGOOSE.Schema(
      {
        title: { type: String, required: true },
        module_name: { type: String, required: true },
        sub_modules: [{
          title: { type: String, required: true},
          module_name: { type: String, required: true},
          status: {
            type: String,
            required: true,
            default: MESSAGEUTIL.info().status.active,
            enum: [
              MESSAGEUTIL.info().status.active,
              MESSAGEUTIL.info().status.in_active,
            ],
          },
          fields: [
            {
              field_name: { type: String, required: true },
              status: {
                type: String,
                required: true,
                default: MESSAGEUTIL.info().status.active,
                enum: [
                  MESSAGEUTIL.info().status.active,
                  MESSAGEUTIL.info().status.in_active,
                ],
              },
              read_only:{
                type:Boolean,
                default:false
              },
              write:{
                  type:Boolean,
                  default:false
              },
            },
          ],
          transactions: [
            {
              transaction_name: { 
                type: String,
                required: true 
              },
              is_enabled_for: [
                {
                  type: String,
                  required: true,
                  enum: [MESSAGEUTIL.customerInfo().role.user, MESSAGEUTIL.customerInfo().role.customerAdmin, MESSAGEUTIL.customerInfo().role.opsManager, MESSAGEUTIL.customerInfo().role.sales, MESSAGEUTIL.customerInfo().role.teamlead,MESSAGEUTIL.customerInfo().role.reporting]
                }
              ],
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
          ],
        }],
        status: {
          type: String,
          required: true,
          default: MESSAGEUTIL.info().status.active,
          enum: [
            MESSAGEUTIL.info().status.active,
            MESSAGEUTIL.info().status.in_active,
          ],
        },
        fields: [
          {
            field_name: { type: String, required: true },
            status: {
              type: String,
              required: true,
              default: MESSAGEUTIL.info().status.active,
              enum: [
                MESSAGEUTIL.info().status.active,
                MESSAGEUTIL.info().status.in_active,
              ],
            },
            read_only:{
              type:Boolean,
              default:false
            },
            write:{
                type:Boolean,
                default:false
            },
          },
        ],
        transactions: [
          {
            transaction_name: { 
              type: String,
              required: true 
            },
            is_enabled_for: [
              {
                type: String,
                required: true,
                enum: [MESSAGEUTIL.customerInfo().role.user, MESSAGEUTIL.customerInfo().role.customerAdmin, MESSAGEUTIL.customerInfo().role.opsManager, MESSAGEUTIL.customerInfo().role.sales, MESSAGEUTIL.customerInfo().role.teamlead,MESSAGEUTIL.customerInfo().role.reporting]
              }
            ],
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
        ],
      },
      { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
    );
    MODULES.index({ module_name: 1 }, { unique: true, name: "IDX_MODULE_NAME" });
    return MODULES;
  }
}
module.exports = Modules;
