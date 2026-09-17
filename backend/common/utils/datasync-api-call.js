const axios = require("axios");
const moment = require("moment");

class DataSyncApiCall {
  constructor(config) {
    this.config = config;
    this.callNiceAPI = this.callNiceAPI.bind(this);
  }

  async callNiceAPI(data, tenant_id, session_id) {
    const apiKey = this.config.get("datasync:api_key");
    const host = this.config.get("datasync:url");
    const customerName = this.config.get("datasync:customer_name");
    const username = this.config.get("datasync:username");
    const password = this.config.get("datasync:password");
    const token = Buffer.from(`${username}:${password}`, "utf8").toString(
      "base64"
    );
    const path = `?apiKey=${apiKey}&sessionId=${data["cx1_contactId"]}&customerName=${customerName}`;
    const url = host + path;
    // console.log("URL", url);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Basic ${token}`,
    };
    // console.log("headers", headers);
    const timestampNow = moment().unix();
    try {
      const sendData = await axios.post(url, data, { headers });
      if (sendData?.status === 200) {
        const timestampUpdate = moment().unix();
        const time_elapsed = timestampUpdate - timestampNow;
        console.log("Data Inserted to NICE successfully!!");
        // console.log("Data Received:", sendData?.data);
        return {
          session_id: session_id,
          tenant_id: tenant_id,
          timestamp: timestampNow,
          time_elapsed: time_elapsed,
          name: "Datasync API",
          request_type: "POST",
          url: url,
          response_code: sendData?.status,
          request_body: data,
          response_body: sendData?.data,
        };
      }
    } catch (err) {
      console.log(
        "Error Occurred -",
        err?.response?.status + " " + err?.response?.statusText
      );

      console.log("Error Happened - ", err);

      const timestampUpdate = moment().unix();
      const time_elapsed = timestampUpdate - timestampNow;

      let responseBody = err?.response?.data;
      if (responseBody === undefined || responseBody === null) {
        responseBody = JSON.stringify(err);
      }
      return {
        session_id: session_id,
        tenant_id: tenant_id,
        timestamp: timestampNow,
        time_elapsed: time_elapsed,
        name: "Datasync API",
        request_type: "POST",
        url: url,
        response_code: err?.response?.status + " " + err?.response?.statusText,
        request_body: data,
        response_body: responseBody,
      };
    }
  }
}

module.exports = DataSyncApiCall;
