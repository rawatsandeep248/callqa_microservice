const axios = require("axios");

class CallQaApiCall {
  constructor(config) {
    this.config = config;
    this.processCallQaSingle = this.processCallQaSingle.bind(this);
    this.processCallQaBulk = this.processCallQaBulk.bind(this);
  }

  async processCallQaSingle({ unique_id, bot_id, bot_name, tenant_id }) {
    const baseUrl = this.config.get("callqa:url");
    console.log("base url of call qa service:",baseUrl)
    const url = `${baseUrl}api/v1/callqa`;
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(
        url,
        { unique_id, bot_id, bot_name, tenant_id },
        { headers }
      );
      return response;
    } catch (err) {
      console.log(
        "CallQA API Error -",
        err?.response?.status,
        err?.response?.statusText,
        url
      );
      return err;
    }
  }

  async processCallQaBulk({ unique_ids, bot_id, bot_name, tenant_id }) {
    const baseUrl = this.config.get("callqa:url");
    console.log("base url of call qa service:",baseUrl)
    const url = `${baseUrl}api/v1/callqa_manual`;
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(
        url,
        { unique_ids, bot_id, bot_name, tenant_id },
        { headers }
      );
      return response;
    } catch (err) {
      console.log(
        "CallQA API Error -",
        err
      );
      return err;
    }
  }

  async reprocessCallQaSingle({ unique_id, bot_id, bot_name, tenant_id }) {
    const baseUrl = this.config.get("callqa:url");
    console.log("base url of call qa service:",baseUrl)
    const url = `${baseUrl}api/v1/reprocess`;
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(
        url,
        { unique_id, bot_id, bot_name, tenant_id },
        { headers }
      );
      return response;
    } catch (err) {
      console.log(
        "CallQA API Error -",
        err
      );
      return err;
    }
  }
}

module.exports = CallQaApiCall;
