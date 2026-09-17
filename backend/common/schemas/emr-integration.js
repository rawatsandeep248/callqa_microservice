const MONGOOSE = require("mongoose");
const Schema = MONGOOSE.Schema;

class EMRIntegration {
  static getSchema() {
    const EMR = new MONGOOSE.Schema(
      {
        ecw_specs: {
          ecw_tenant_id: {
            type: String,
            required: true,
          },
          ecw_client_id: {
            type: String,
            required: true,
          },
          ecw_token_url: {
            type: String,
            required: true,
          },
          ecw_scope: {
            type: String,
            required: true,
          },
          ecw_base_url: {
            type: String,
            required: true,
          },
          ecw_group_id: [
            {
              type: String,
              required: true,
            },
          ],
          storage_container_name: {
            type: String,
            required: true,
          },
          status: {
            type: String,
          },
          sync_time: {
            type: String,
            required: true,
          },
          sync_date: {
            type: String,
            required: true,
          },
          fhir_url: {
            type: String,
            required: true,
          },
        },
        athena_configs:{
          clientId:{
            type:String
          },
          clientSecret:{
            type:String
          },
          scope:{
            type:String
          },
          practitionerInfo:[
            {
              practitionerId:{
                type:String
              },
              status:{
                type:String,
                enum:["ACTIVE","INACTIVE"],
                default:["INACTIVE"]
              },
              practitionerInfo:{
                type:Schema.Types.Mixed
              }
            }
          ],
          status:{
            type:String,
            enum:["ACTIVE","INACTIVE"],
            default:"ACTIVE"
          }
        },
        tenant_id: {
          type: String,
        },
        created_by: {
          type: String,
          required: true,
        },
        modified_by: {
          type: String,
          required: true,
        },
      },
      {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
      }
    );
    return EMR;
  }
}
module.exports = EMRIntegration;
