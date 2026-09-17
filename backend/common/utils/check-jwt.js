const Keycloak = require("keycloak-connect");
const Jwt = require("jsonwebtoken");
const CONFIG = require("./config-util");
class JwtMiddleware {
  constructor() {
    this.keycloakConfig = {
      clientId: `${CONFIG.get("keycloak:client_id")}`,
      bearerOnly: true,
      serverUrl: `${CONFIG.get("keycloak:url")}`,
      realm: `${CONFIG.get("keycloak:realm")}`,
      credentials: {
        secret: `${CONFIG.get("keycloak:client_secret")}`,
      },
    };
    this.keycloak = new Keycloak({}, this.keycloakConfig);
    this.checkJwt = this.checkJwt.bind(this);
  }

  checkJwt(req, res, next) {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!req.headers.authorization) {
      return res.status(401).json({
        message: "Token is required",
        authentication: "Unauthorized",
      });
    }

    try {
      this.keycloak.grantManager
        .validateAccessToken(token)
        .then((result) => {
          req.tokenInfo = result;
          if (result === false) {
            res.status(401).json({
              message: "Token got expired or invalid",
              authentication: "Unauthorized",
            });
          } else {
            // console.log("req.headers['rbac_role']", req.headers['rbac_role']);
            const decoded = Jwt.decode(result);
            // console.log("decoded", decoded);
            req.role = decoded.role;
            next();
          }
        })
        .catch((err) => {
          console.log("err in checkJwt", err);
          res.status(401).json({ error: "Invalid token", details: err });
        });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = JwtMiddleware;
