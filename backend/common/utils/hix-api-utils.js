const axios = require("axios");
const qs = require("qs");

class HIXAPIUtil {
  constructor(config) {
    this.config = config;
    this.generateToken = this.generateToken.bind(this);
    this.validateANI = this.validateANI.bind(this);
  }

  async generateToken() {
    try {
      let data = qs.stringify({
        username: this.config.get("hix_details:username"),
        password: this.config.get("hix_details:password"),
        client_id: this.config.get("hix_details:client_id"),
        client_secret: this.config.get("hix_details:client_secret"),
        grant_type: this.config.get("hix_details:grant_type"),
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: this.config.get("hix_details:token_url"),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data,
      };

      // Await the response from axios request
      const response = await axios.request(config);

      return response.data.access_token;
    } catch (error) {
      // Handle any errors
      console.error("Error generating token:", error);
    }
  }

  async validateANI(phone_number, token) {
    try {
      const axios = require("axios");

      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `https://${this.config.get(
          "hix_details:server"
        )}/ms-ivr/api/validateANI?ANI=${phone_number}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      //Await the response from axios request
      const response = await axios.request(config);

      if (response.data.status === "false") {
        return "";
      }
      return response.data.primaryApplicantFirstname;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = HIXAPIUtil;
