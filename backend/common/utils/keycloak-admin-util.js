const qs = require("qs");
const RestUtil = require("./rest-util");

class KeycloakAdminUtil {
    constructor(config) {
        this.config = config;
        this.restUtil = new RestUtil(config);
    }

    async getAdminToken() {
        const tokenResp = await this.restUtil.postRequest(
            `${this.config.get("keycloak:url")}/realms/${this.config.get("keycloak:realm")}/protocol/openid-connect/token`,
            qs.stringify({
                grant_type: "client_credentials",
                client_id: this.config.get("keycloak:client_id"),
                client_secret: this.config.get("keycloak:client_secret"),
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        const accessToken =
            tokenResp?.data?.access_token ||
            tokenResp?.access_token ||
            tokenResp?.body?.access_token;

        if (!accessToken) {
            throw new Error("Failed to obtain Keycloak admin token");
        }
        return accessToken;
    }

    async createUser({ email, name, password, role, tenantId }) {
        const token = await this.getAdminToken();
        const payload = {
            username: email,
            email,
            enabled: true,
            emailVerified: true,
            firstName: name || email.split("@")[0],
            attributes: {
                tenant_id: [tenantId],
            },
            credentials: [
                {
                    type: "password",
                    value: password,
                    temporary: false,
                },
            ],
        };

        if (role) {
            payload.attributes.role = [role];
        }

        const url = `${this.config.get("keycloak:url")}/admin/realms/${this.config.get("keycloak:realm")}/users`;
        const response = await this.restUtil.postRequest(url, payload, {
            headers: {
                "content-type": "application/json",
                authorization: `Bearer ${token}`,
            },
        });

        const status = response?.status || response?.statusCode;
        if (status !== 201 && status !== 200) {
            throw new Error("Keycloak user creation failed");
        }

        const users = await this.findUserByEmail(email, token);
        if (!users.length) {
            throw new Error("Keycloak user created but could not be resolved by email");
        }
        return users[0];
    }

    async findUserByEmail(email, tokenOptional) {
        const token = tokenOptional || (await this.getAdminToken());
        const normalizedEmail = email.trim().toLowerCase();
        const url = `${this.config.get("keycloak:url")}/admin/realms/${this.config.get("keycloak:realm")}/users?email=${encodeURIComponent(normalizedEmail)}&exact=true`;
        const usersResp = await this.restUtil.getRequest(url, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return Array.isArray(usersResp) ? usersResp : usersResp?.data || [];
    }
}

module.exports = KeycloakAdminUtil;
