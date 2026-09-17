const nconf = require("nconf");
const replaceall = require("replaceall");
const fs = require("fs");
const path = require("path");
const emoji = require("node-emoji");

function Config() {
  try {
    nconf.argv().env();

    process.chdir(path.join(__dirname, "../config/"));
    const relativePath = process.cwd();

    const environment = nconf.get("NODE_ENV");
    const sampleFile = relativePath + "/sample.json";

   if (environment === "production") {
      //Read production.json file.
      console.log("PRODUCTION VERSION LOADING FROM ENVIRONMENT VARIABLES")
      const prodFile = relativePath + "/production.json";
      let prodData = fs.readFileSync(prodFile, "utf8");


      const requiredEnvVars = [
        "AVA_SERVER_PORT",
        "ENVIRONMENT_NAME",
        "MONGO_HOST",
        "MONGO_USER",
        "MONGO_PASSWORD",
        "MONGO_NAME",
        "MYSQL_READ_HOST",
        "MYSQL_WRITE_HOST",
        "MYSQL_DATABASE",
        "MYSQL_USER",
        "MYSQL_PASSWORD",
        // "AWS_ACCESS_KEY_ID", removed for IRSA
        // "AWS_SECRET_ACCESS_KEY",
        "AWS_REGION",
        "AWS_BUCKET_NAME",
        "KEYCLOAK_URL",
        "KEYCLOAK_REALM_URL",
        "KEYCLOAK_REALM",
        "KEYCLOAK_SECRET",
        "KEYCLOAK_CLIENT_ID"
      ]
      // checking and throw error if required environment variables are not available
      const missingVars = requiredEnvVars.filter(key => nconf.get(key) === undefined);
      if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: \n${missingVars.join("\n")}`);
      }
      prodData = replaceall("$AVA_SERVER_PORT", nconf.get("AVA_SERVER_PORT"), prodData);
      prodData = replaceall("$ENVIRONMENT_NAME", nconf.get("ENVIRONMENT_NAME"), prodData);
      prodData = replaceall("$REDIS_HOST", nconf.get("REDIS_HOST") || "localhost", prodData); //dependency startup: redis adaptor for socket & optional
      prodData = replaceall("$REDIS_PORT", nconf.get("REDIS_PORT") || "6379", prodData); //dependency startup: redis adaptor for socket  & optional
      prodData = replaceall("$REDIS_MASTER_NAME", nconf.get("REDIS_MASTER_NAME") || "redismaster", prodData); //optional
      prodData = replaceall("$MONGO_HOST", nconf.get("MONGO_HOST"), prodData);
      prodData = replaceall("$MONGO_USER", nconf.get("MONGO_USER"), prodData);
      prodData = replaceall("$MONGO_PASSWORD", nconf.get("MONGO_PASSWORD"), prodData);
      prodData = replaceall("$MONGO_NAME", nconf.get("MONGO_NAME"), prodData);
      prodData = replaceall("$MYSQL_READ_HOST", nconf.get("MYSQL_READ_HOST"), prodData);
      prodData = replaceall("$MYSQL_WRITE_HOST", nconf.get("MYSQL_WRITE_HOST"), prodData);
      prodData = replaceall("$MYSQL_DATABASE", nconf.get("MYSQL_DATABASE"), prodData);
      prodData = replaceall("$MYSQL_USER", nconf.get("MYSQL_USER"), prodData);
      prodData = replaceall("$MYSQL_PASSWORD", nconf.get("MYSQL_PASSWORD"), prodData);
      prodData = replaceall("$AWS_ACCESS_KEY_ID", nconf.get("AWS_ACCESS_KEY_ID") || 'NA', prodData);
      prodData = replaceall("$AWS_SECRET_ACCESS_KEY", nconf.get("AWS_SECRET_ACCESS_KEY") || 'NA', prodData);
      prodData = replaceall("$AWS_REGION", nconf.get("AWS_REGION"), prodData);
      prodData = replaceall("$AWS_BUCKET_NAME", nconf.get("AWS_BUCKET_NAME"), prodData);

      prodData = replaceall("$GOOGLE_TTS_CREDS_PATH", nconf.get("GOOGLE_TTS_CREDS_PATH"), prodData);
      prodData = replaceall("$AZURE_KEY", nconf.get("AZURE_KEY") || "", prodData); //optional
      prodData = replaceall("$AZURE_REGION", nconf.get("AZURE_REGION") || "eastus", prodData); //optional

      // prodData = replaceall("$OPENTELEMETRY_ENABLED", nconf.get("OPENTELEMETRY_ENABLED") || false, prodData);//optional
      // prodData = replaceall("$OPENTELEMETRY_LOGEXPORTER", nconf.get("OPENTELEMETRY_LOGEXPORTER") || "", prodData); //optional
      // prodData = replaceall("$OPENTELEMETRY_TRACEEXPORTER", nconf.get("OPENTELEMETRY_TRACEEXPORTER") || "", prodData); //optional
      // prodData = replaceall("$OPENTELEMETRY_METRICSEXPORTER", nconf.get("OPENTELEMETRY_METRICSEXPORTER") || "", prodData); //optional

      prodData = replaceall("$KEYCLOAK_URL", nconf.get("KEYCLOAK_URL"), prodData);
      prodData = replaceall("$KEYCLOAK_REALM_URL", nconf.get("KEYCLOAK_REALM_URL"), prodData);
      prodData = replaceall("$KEYCLOAK_REALM", nconf.get("KEYCLOAK_REALM"), prodData);
      prodData = replaceall("$KEYCLOAK_SECRET", nconf.get("KEYCLOAK_SECRET"), prodData);
      prodData = replaceall("$KEYCLOAK_CLIENT_ID", nconf.get("KEYCLOAK_CLIENT_ID"), prodData);

      prodData = replaceall("$ELEVENLABS_API_KEY", nconf.get("ELEVENLABS_API_KEY") || "", prodData);//optional
      prodData = replaceall("$DEEPGRAM_API_KEY", nconf.get("DEEPGRAM_API_KEY") || "", prodData); //optional
      prodData = replaceall("$REDIS_STANDALONE_HOST", nconf.get("REDIS_STANDALONE_HOST") || '', prodData);
      prodData = replaceall("$REDIS_STANDALONE_PORT", nconf.get("REDIS_STANDALONE_PORT") || '6379', prodData);

      prodData = replaceall("$DATASYNC_URL", nconf.get("DATASYNC_URL") || "", prodData);
      prodData = replaceall("$DATASYNC_API_KEY", nconf.get("DATASYNC_API_KEY") || "", prodData);
      prodData = replaceall("$DATASYNC_USERNAME", nconf.get("DATASYNC_USERNAME") || "", prodData);
      prodData = replaceall("$DATASYNC_PASSWORD", nconf.get("DATASYNC_PASSWORD") || "", prodData);
      prodData = replaceall("$DATASYNC_CUSTOMER_NAME", nconf.get("DATASYNC_CUSTOMER_NAME") || "", prodData)
      
      prodData = replaceall("$CARTESIA_API_KEY", nconf.get("CARTESIA_API_KEY") || "", prodData);
      prodData = replaceall("$OPENAI_API_KEY", nconf.get("OPENAI_API_KEY") || "", prodData);
      prodData = replaceall("$OPENAI_BASE_URL", nconf.get("OPENAI_BASE_URL") || "https://us.api.openai.com/v1/", prodData);
      prodData = replaceall("$AVA_ANALYTICS_ENGINE_URL", nconf.get("AVA_ANALYTICS_ENGINE_URL") || "notconfigured/api/v1", prodData);

      //Write config data to sample file
      fs.writeFileSync(sampleFile, prodData);
    } else {
      console.log("LOCAL/ENV configuring")
      //Read development.json file.
      const devFile = relativePath + "/development.json";
      const devData = fs.readFileSync(devFile, "utf8");

      //Write config data to sample file
      fs.writeFileSync(sampleFile, devData);
    }

    nconf.file(environment, relativePath + "/sample.json");
  } catch (error) {
    console.error(emoji.get('exploding_head'), emoji.get('negative_squared_cross_mark'), emoji.get('exploding_head'), emoji.get('negative_squared_cross_mark'), "==========:Error While loading ENV configuration:=============", emoji.get('exploding_head'), emoji.get('negative_squared_cross_mark'), emoji.get('exploding_head'), emoji.get('negative_squared_cross_mark'), error);
    throw new Error("Environment Configuration loading Failed");
  }
}

Config.prototype.get = function (key) {
  return nconf.get(key);
};

module.exports = new Config();
