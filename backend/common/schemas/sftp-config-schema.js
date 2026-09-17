const MONGOOSE = require("mongoose");

class SFTPCONFIGSCHEMA {
  static getSchema() {
    const SFTPCONFIG = new MONGOOSE.Schema(
      {
        hostname: { type: String, required: true },
        name: { type: String, required: true },
        port: { type: Number, required: true, },
        username: { type: String, required: true },
        // authenticationMethod: { type: String, enum: ["password", "key"], required: true },
        // password: { type: String, required: function() { return this.authenticationMethod === "password";}},
        // privateKey: { type: String, required: function() { return this.authenticationMethod === "key"; }},
        password: { type: String, required: true},
        directoryPath: { type: String,  },
        fileFormat: { type: String, enum: ["CSV", "JSON", "XML"],  },
        compression: { type: String, enum: ["ZIP", "GZIP", "NONE"], },
        schedule: { type: String, enum: ["hourly", "daily", "weekly","montly"]},
        created_by: {
          type: String,
          required: true,
        },
        updated_by: {
          type: String,
          required: true,
        },
      },
      { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
    );

    return SFTPCONFIG;
  }
}
module.exports = SFTPCONFIGSCHEMA;