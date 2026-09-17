const axios = require("axios");

/*
 * HTTP Digest-Auth helpers below have been disabled.
 * They used to back `deleteAxioDigestRequest` (MongoDB Atlas user deletion),
 * which is no longer used on the frontend. The `request-digest` npm package
 * has been uninstalled. Code is preserved (commented) for reference only.
 */
// const crypto = require("crypto");
//
// const md5 = (input) =>
//   crypto.createHash("md5").update(input).digest("hex");
//
// function parseDigestChallenge(headerValue) {
//   const fields = {};
//   if (!headerValue) return fields;
//   const re = /(\w+)\s*=\s*(?:"([^"]*)"|([^,\s]+))/g;
//   let m;
//   while ((m = re.exec(headerValue)) !== null) {
//     fields[m[1]] = m[2] !== undefined ? m[2] : m[3];
//   }
//   return fields;
// }
//
// function buildDigestAuthHeader(challenge, { method, uri, username, password }) {
//   const realm = challenge.realm || "";
//   const nonce = challenge.nonce || "";
//   const qop = (challenge.qop || "auth").split(",")[0].trim();
//   const algorithm = (challenge.algorithm || "MD5").toUpperCase();
//   const nc = "00000001";
//   const cnonce = crypto.randomBytes(8).toString("hex");
//   const ha1 = md5(`${username}:${realm}:${password}`);
//   const ha2 = md5(`${method}:${uri}`);
//   const response = md5(`${ha1}:${nonce}:${nc}:${cnonce}:${qop}:${ha2}`);
//   let header =
//     `Digest username="${username}", realm="${realm}", nonce="${nonce}", ` +
//     `uri="${uri}", qop=${qop}, nc=${nc}, cnonce="${cnonce}", ` +
//     `response="${response}", algorithm=${algorithm}`;
//   if (challenge.opaque) header += `, opaque="${challenge.opaque}"`;
//   return header;
// }
//
// async function digestRequest(axiosInstance, { method, host, path, port, data, username, password, headers }) {
//   const hasProtocol = /^https?:\/\//i.test(host);
//   const protocol = port === 80 ? "http" : "https";
//   const base = host.replace(/^https?:\/\//i, "").replace(/\/$/, "");
//   const portSuffix = !port || port === 80 || port === 443 ? "" : `:${port}`;
//   const finalProtocol = hasProtocol ? host.match(/^https?/i)[0].toLowerCase() : protocol;
//   const url = `${finalProtocol}://${base}${portSuffix}${path}`;
//
//   const baseConfig = {
//     url,
//     method,
//     headers: headers || {},
//     validateStatus: (s) => s === 401 || (s >= 200 && s < 300),
//   };
//   if (data !== undefined && method !== "GET" && method !== "DELETE") {
//     baseConfig.data = data;
//   }
//
//   const first = await axiosInstance.request(baseConfig);
//   if (first.status !== 401) return first;
//
//   const challenge = parseDigestChallenge(first.headers["www-authenticate"] || "");
//   const authHeader = buildDigestAuthHeader(challenge, {
//     method,
//     uri: path,
//     username,
//     password,
//   });
//
//   return axiosInstance.request({
//     url,
//     method,
//     headers: { ...(headers || {}), Authorization: authHeader },
//     ...(data !== undefined && method !== "GET" && method !== "DELETE" ? { data } : {}),
//     validateStatus: (s) => s >= 200 && s < 300,
//   });
// }

class RestUtil {
  constructor(timeout = 60000) {
    this.instance = axios.create({
      timeout: timeout,
    });
    this.postRequest = this.postRequest.bind(this);
    this.getRequest = this.getRequest.bind(this);
    this.deleteRequest = this.deleteRequest.bind(this);
    this.putRequest = this.putRequest.bind(this);
    this.patchRequest = this.patchRequest.bind(this);
    // this.deleteAxioDigestRequest = this.deleteAxioDigestRequest.bind(this); // disabled — feature unused on frontend
  }

  async getRequest(path, options) {
    try {
      const response = await this.instance.get(path, options);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async postRequest(path, data, options) {
    try {
      const response = await this.instance.post(path, data, options);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async putRequest(path, data, options) {
    try {
      const response = await this.instance.put(path, data, options);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async patchRequest(path, data, options) {
    try {
      const response = await this.instance.patch(path, data, options);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteRequest(path, options) {
    try {
      const response = await this.instance.delete(path, options);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // async deleteAxioDigestRequest(url, config) {
  //   // Disabled — feature unused on frontend; `request-digest` npm package removed.
  //   try {
  //     const response = await digestRequest(this.instance, {
  //       method: "DELETE",
  //       host: url.host,
  //       path: url.path,
  //       port: 443,
  //       username: config.username,
  //       password: config.password,
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     return response;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}

module.exports = RestUtil;
