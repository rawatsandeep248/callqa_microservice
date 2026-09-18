const AUTHENTICATIONSERVICE = require("../service/authentication-service.js");
const MESSAGEUTIL = require("../../../common/utils/message-util.js");
const RestUtil = require("../../../common/utils/rest-util.js");
const spawn = require("child_process").spawn;
const CryptoJS = require("crypto-js");
const OauthUtil = require("../../../common/utils/Oauth-util.js");
const CommonUtil = require("../../../common/utils/common-util.js");
const MessageUtil = require("../../../common/utils/message-util.js");
const {
  PsAors,
  PsAuths,
  PsEndpoints,
  CallaiCustomerBots,
} = require("../../../common/database/models/index.js");
const DATEUTIL = require("../../../common/utils/date-util.js");
const { unlink, stat } = require("fs");
const REDISSERVICE = require("../../../common/database/test-redis.js");
const axios = require("axios");
const qs = require("qs");
const AdminUserService = require("../../admin/service/admin-user-service");

class AuthenticationController {
  constructor(config) {
    this.config = config;
    this.authService = new AUTHENTICATIONSERVICE(config);
    this.adminUserService = new AdminUserService(config);
    this.restUtil = new RestUtil();
    this.OauthUtil = new OauthUtil(config);
    this.CommonUtil = new CommonUtil(config);
    this.createUser = this.createUser.bind(this);
      this.updateUser = this.updateUser.bind(this);
    this.updateUserInfo = this.updateUserInfo.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.updatePasswordAuth0 = this.updatePasswordAuth0.bind(this);
    this.updateKeycloakUserPassword = this.updateKeycloakUserPassword.bind(this);
    this.updatePasswordMongodb = this.updatePasswordMongodb.bind(this);
    this.findUserByEmail = this.findUserByEmail.bind(this);
    this.getUserByID = this.getUserByID.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.inviteToOrganization = this.inviteToOrganization.bind(this);
    this.createOrganizationAndAsssignUser = this.createOrganizationAndAsssignUser.bind(this);
    this.fetchOrganizations = this.fetchOrganizations.bind(this);
    this.checkOrganizations = this.checkOrganizations.bind(this);
    this.deleteOrganization = this.deleteOrganization.bind(this);
    this.assignUserToOrganization = this.assignUserToOrganization.bind(this);
    this.removeUserFromOrganization =
      this.removeUserFromOrganization.bind(this);
    this.createCustomerWithDatabase =
      this.createCustomerWithDatabase.bind(this);
    this.createCustomer = this.createCustomer.bind(this);
    this.deleteCustomer = this.deleteCustomer.bind(this);
    this.fetchAllCustomers = this.fetchAllCustomers.bind(this);
    this.deleteUserAuth0 = this.deleteUserAuth0.bind(this);
    this.resendVerificationLink = this.resendVerificationLink.bind(this);
    this.findUserByEmailauth0 = this.findUserByEmailauth0.bind(this);
    this.findUserByEmailMongodb = this.findUserByEmailMongodb.bind(this);
    this.filterUserList = this.filterUserList.bind(this);
    this.searchCustomer = this.searchCustomer.bind(this);
    this.filterCustomer = this.filterCustomer.bind(this);
    this.sortCustomer = this.sortCustomer.bind(this);
    this.expirationDate = this.expirationDate.bind(this);
    this.statusUpdate = this.statusUpdate.bind(this);
    this.sendVerificationLink = this.sendVerificationLink.bind(this);
    this.customerDetailUpdate = this.customerDetailUpdate.bind(this);
    this.mongorestore = this.mongorestore.bind(this);
    this.findUser = this.findUser.bind(this);
    this.getAuthenticationTokenForAPIM =
      this.getAuthenticationTokenForAPIM.bind(this);
    this.updateUserTimeZone = this.updateUserTimeZone.bind(this);
    this.PsAors = PsAors;
    this.PsAuths = PsAuths;
    this.PsEndpoints = PsEndpoints;
    this.CallaiCustomerBots = CallaiCustomerBots;
    this.testMysqlConnection = this.testMysqlConnection.bind(this);
    this.testMongoConnection = this.testMongoConnection.bind(this);
    this.testRedisConnection = this.testRedisConnection.bind(this);
    this.createCustomerForFirstRunSignUp =
      this.createCustomerForFirstRunSignUp.bind(this);
    this.signUp = this.signUp.bind(this);
    this.keycloakLogin = this.keycloakLogin.bind(this);
    this.restoreMysqlDbTable = this.restoreMysqlDbTable.bind(this);
    this.executeIvaToAvaSqlFile = this.executeIvaToAvaSqlFile.bind(this);
    this.getFirstRunStatusInMysql = this.getFirstRunStatusInMysql.bind(this);
    this.updateFirstRunStatusInMysql = this.updateFirstRunStatusInMysql.bind(this);
    this.createExternalKeycloakUsers = this.createExternalKeycloakUsers.bind(this);
    this.getConfigValueThoughKeyName = this.getConfigValueThoughKeyName.bind(this);
    this.createconfigValue = this.createconfigValue.bind(this);
    this.forgotPasswordController = this.forgotPasswordController.bind(this);
    this.getUserTenantMapping = this.getUserTenantMapping.bind(this);
    this.uploadLogo = this.uploadLogo.bind(this);
    this.fetchLogo = this.fetchLogo.bind(this);
  }

  async transactionOperation(type, connection) {
    if (type === MESSAGEUTIL.info().transaction_type.commit) {
      for (let i = 0; i < connection.length; i++) {
        await connection[i].session.commitTransaction();
        connection[i].session.endSession();
      }
    } else {
      for (let i = 0; i < connection.length; i++) {
        await connection[i].session.abortTransaction();
        await connection[i].session.endSession();
        // connection[i].reqFor !== MESSAGEUTIL.info().database_req_type.master ? connection[i].connection.close() : "";
      }
    }
    return;
  }

  async transactionOperationSQL(type, connection) {
    if (type === MESSAGEUTIL.info().transaction_type.commit) {
      for (let i = 0; i < connection.length; i++) {
        connection[i].commit();
      }
    } else {
      for (let i = 0; i < connection.length; i++) {
        connection[i].rollback();
      }
    }
    return;
  }

  _extractKeycloakUserIdFromCreateResponse(response) {
    const location =
      response?.headers?.location ||
      response?.headers?.Location ||
      response?.header?.location;
    if (!location) {
      return null;
    }
    const parts = String(location).split("/");
    return parts[parts.length - 1] || null;
  }

  async _deleteKeycloakUserById(accessToken, keycloakUserId) {
    if (!keycloakUserId) {
      return;
    }
    const options = {
      headers: {
        "content-type": "application/json",
        authorization: "Bearer " + accessToken,
      },
    };
    const url = `${this.config.get("keycloak:url")}/admin/realms/${this.config.get("keycloak:realm")}/users/${keycloakUserId}`;
    await this.restUtil.deleteRequest(url, options);
  }

  async createUser(req, res, next) {
    let user = req.body.user
    try {
      let token = await this.OauthUtil.getKeycoakAccessToken();
      if (token && token.access_token) {
        const role = user.role;
        const needsTenantRow = this.adminUserService.requiresTenantDbRecord([role]);
        if (needsTenantRow && !user.tenant_id) {
          return res.status(400).json({
            response: "FAILED",
            error: { message: "tenant_id is required for this role", code: 400 },
          });
        }

        const attributes = {
          role: [String(role)],
          type: ["user"],
        };
        let data = {
          username: user.email,
          email: user.email,
          enabled: true,
          firstName: user.name.split(' ')[0],
          lastName: user.name.split(' ')?.[1] || '',
          attributes,
          credentials: [
            {
              type: "password",
              value: user.password,
              temporary: false
            }
          ]
        }
        let options = {
          headers: {
            "content-type": "application/json",
            authorization: "Bearer " + token.access_token,
          },
        };
        let url = `${this.config.get("keycloak:url")}/admin/realms/${this.config.get('keycloak:realm')}/users`;
        const response = await this.restUtil.postRequest(url, data, options);
        if (response.status == 201) {
          const keycloakUserId = this._extractKeycloakUserIdFromCreateResponse(response);
          if (needsTenantRow) {
            try {
              await this.adminUserService.linkUserToTenant({
                email: user.email,
                tenantId: user.tenant_id,
                role,
                keycloakUserId,
              });
            } catch (linkErr) {
              try {
                await this._deleteKeycloakUserById(token.access_token, keycloakUserId);
              } catch (rollbackErr) {
                console.error("[createUser] Keycloak rollback failed:", rollbackErr.message);
              }
              return res.status(500).json({
                response: "FAILED",
                error: {
                  message: linkErr.message || "Failed to link user to tenant in common database",
                  code: 500,
                },
              });
            }
          }
          res.created({}, MESSAGEUTIL.response().SUCCESSFULLY_CREATED);
        } else {
          res.forbidden(MESSAGEUTIL.response().FAILED_USER_CREATION)

        }
      } else {
        res.forbidden(MESSAGEUTIL.response().FAILED_USER_CREATION)
      }
    } catch (error) {
      console.log("error captured", error)
      next(error)
    }
  }

  async createIndex(req, res, next) {
    try {
      const tenant_id = req.params.tenant_id;
      let dummy_api_logs = {
        session_id: "dummy",
        tenant_id: req.params.tenant_id,
        timestamp: new Date(),
        time_eclapsed: "0.254707",
        name: "get_ani",
        request_type: "GET",
        url: "dummy",
        response_code: "200",
        request_body: "{}",
        time_elapsed: "0.11",
        response_body: {
          status: "false",
          externalHouseholdCaseId: null,
          brokerMetadata: null,
          partnerMetadata: null,
          partnerType: null,
          primaryApplicantFirstname: null,
          hhType: null,
          email: null,
          dmiCount: null,
          sviCount: null,
          returnedMail: null,
          communicationPreference: null,
        },
      };
      let dummy_extracted_entities = {
        session_id: "dummy",
        tenant_id: req.params.tenant_id,
        createdAt: "2024-03-12T06:21:54+00:00",
        entities: {
          skills: ["skill_open_dmi", "skill_broker"],
          normal: "nnnn",
          phone_number: "9090878908",
          data: {
            data: "vv",
          },
        },
        skill: "skill_welcome",
        timestamp: new Date(),
      };
      let dummy_milestones = {
        node: "dummy",
        session_id: "dummy",
        skill: "userAuth",
        tenant_id: req.params.tenant_id,
        text: "userAuth: start",
        timestamp: new Date(),
      };

      await this.authService.createIndexing(
        req.params.tenant_id,
        "api_logs",
        dummy_api_logs
      );
      await this.authService.createIndexing(
        req.params.tenant_id,
        "extracted_entities",
        dummy_extracted_entities
      );
      await this.authService.createIndexing(
        req.params.tenant_id,
        "milestones",
        dummy_milestones
      );
      res.json({ "Updated schema": "SUCCESS" });
    } catch (err) {
      throw err;
    }
  }

  async updateUser(req, res, next) {
    try {
      let token = await this.OauthUtil.getKeycoakAccessToken();
      let user = req.body.user;
      if (token && token.access_token) {
        const role = user.role;
        const needsTenantRow = this.adminUserService.requiresTenantDbRecord([role]);
        if (needsTenantRow && !user.tenant_id) {
          return res.status(400).json({
            response: "FAILED",
            error: { message: "tenant_id is required for this role", code: 400 },
          });
        }

        let data = {
          email: user.email,
          enabled: user.status == 'ACTIVE' ? true : false,
          firstName: user.name.split(' ')[0],
          lastName: user.name.split(' ')?.[1] || '',
          attributes: {
            role: [String(role)],
            type: ["user"],
          },
        };
        let options = {
          headers: {
            "content-type": "application/json",
            authorization: "Bearer " + token.access_token,
          },
        };

        let url = `${this.config.get("keycloak:url")}/admin/realms/${this.config.get('keycloak:realm')}/users/` + user.id;
        await this.restUtil.putRequest(url, data, options);
        if (needsTenantRow && user.tenant_id) {
          try {
            await this.adminUserService.linkUserToTenant({
              email: user.email,
              tenantId: user.tenant_id,
              role,
              keycloakUserId: user.id,
            });
          } catch (linkErr) {
            return res.status(500).json({
              response: "FAILED",
              error: {
                message: linkErr.message || "Failed to link user to tenant in common database",
                code: 500,
              },
            });
          }
        }
        res.success({}, MESSAGEUTIL.response().SUCCESSFULLY_UPDATED);
      }
      else {
        res.forbidden(MESSAGEUTIL.response().USER_UPDATED_FAILED)
      }
    } catch (error) {
      next(error)
    }
  }

  async getUserTenantMapping(req, res, next) {
    try {
      const email = (req.params.email || "").trim().toLowerCase();
      if (!email) {
        return res.status(400).json({
          response: "FAILED",
          error: { message: "email is required", code: 400 },
        });
      }
      const mapping = await this.adminUserService.getTenantMappingByEmail(email);
      res.success(
        {
          tenant_id: mapping?.tenant_id || null,
          role: mapping?.role || null,
        },
        MESSAGEUTIL.response().SUCCESSFULLY_FETCHED
      );
    } catch (error) {
      next(error);
    }
  }

   async updateUserWA(req, res, next) {
    try {
      let token = await this.OauthUtil.getKeycoakAccessToken();
      let user = req.body.user;
      if (token && token.access_token) {
        let data = {
          email: user.email,
          enabled: user.status == 'ACTIVE' ? true : false,
          firstName: user.name.split(' ')[0],
          lastName: user.name.split(' ')?.[1] || '',
          attributes: {
            role: user.role,
            type: "user"
          },
        };
        if (!user.skipOrganization && user.organization !== undefined && user.organization !== null) {
          data.attributes.organization = user.organization;
        } else {
          const existingUrl = `${this.config.get("keycloak:url")}/admin/realms/${this.config.get('keycloak:realm')}/users/` + user.id;
          const existingOptions = {
            headers: {
              "content-type": "application/json",
              authorization: "Bearer " + token.access_token,
            },
          };
          const existingUser = await this.restUtil.getRequest(existingUrl, existingOptions);
          if (existingUser?.attributes?.organization) {
            data.attributes.organization = existingUser.attributes.organization;
          }
        }
        let options = {
          headers: {
            "content-type": "application/json",
            authorization: "Bearer " + token.access_token,
          },
        };
        let url = `${this.config.get("keycloak:url")}/admin/realms/${this.config.get('keycloak:realm')}/users/` + user.id;
        await this.restUtil.putRequest(url, data, options);
        res.success({}, MESSAGEUTIL.response().SUCCESSFULLY_UPDATED);
      }
      else {
        res.forbidden(MESSAGEUTIL.response().USER_UPDATED_FAILED)
      }
    } catch (error) {
      next(error)
    }
  }

  async updateUserInfo(req, res, next) {
    try {
      let token = await this.OauthUtil.getAccessToken();
      let asterisk_user_id = req.body.userID;

      if (token && token.access_token) {
        let data = {
          phone: req.body.phone,
        };
        await this.authService.updateUserInfo(
          req.customer_config.database,
          MESSAGEUTIL.info().database_collections.users,
          asterisk_user_id,
          data
        );
        res.success({}, MESSAGEUTIL.response().SUCCESSFULLY_UPDATED);
      } else {
        res.forbidden(MESSAGEUTIL.error().TOKEN_NOT_AVAILABLE);
      }
    } catch (error) {
      next(error);
    }
  }

  async updatePassword(req, res, next) {
    let level = 0;
    let mongoConnection = [];

    try {
      let token = await this.OauthUtil.getAccessToken();
      let user = req.body.user;
      if (token && token.access_token) {
        let data = {
          password: user.new_password,
          connection: "",
        };
        let options = {
          headers: {
            "content-type": "application/json",
            authorization: "Bearer " + token.access_token,
          },
        };

        let updateUserPass = {
          password: user.new_password,
          email: user.email,
          base_password_changed: user.base_password_changed,
        };

        let updateUser = await this.authService.update_base_password_changed(
          req.customer_config.database,
          MESSAGEUTIL.info().database_collections.users,
          updateUserPass
        );

        mongoConnection.push(updateUser);

        if (updateUser.result && updateUser.result.modifiedCount === 1) {
          level = 1;
          // let url = `${this.config.get("audience_management_api")}users/` + user.user_id;
          let url = "";
          const response = await this.restUtil.patchRequest(url, data, options);

          if (response && response.status == 200) {
            await this.transactionOperation(
              MESSAGEUTIL.info().transaction_type.commit,
              mongoConnection
            );
            res.success({}, MESSAGEUTIL.response().SUCCESSFULLY_UPDATED);
          } else {
            throw MESSAGEUTIL.error().USER_UPDATE_PASSWORD_FAILED;
          }
        } else {
          res.serverError(MESSAGEUTIL.error().USER_UPDATE_PASSWORD_FAILED);
        }
      } else {
        res.forbidden(MESSAGEUTIL.error().USER_UPDATE_PASSWORD_FAILED);
      }
    } catch (error) {
      if (error && error.originatedFrom) {
        mongoConnection.push(error);
      }
      switch (level) {
        case 1:
          await this.transactionOperation(
            MESSAGEUTIL.info().transaction_type.abort,
            mongoConnection
          );
      }
      next(error);
    }
  }

  async updatePasswordAuth0(req, res, next) {
    try {
      let token = await this.OauthUtil.getAccessToken();
      let user = req.body;
      if (token && token.access_token) {
        let data = {
          password: user.password,
          // connection: this.config.get("oauth:connection_name"),
          connection: "",
        };
        let options = {
          headers: {
            "content-type": "application/json",
            authorization: "Bearer " + token.access_token,
          },
        };
        // let url = `${this.config.get("audience_management_api")}users/` + user.user_id;
        let url = "";
        // console.log("url", url, data);
        const response = await this.restUtil.patchRequest(url, data, options);
        if (response && response.status == 200) {
          res.success({}, MESSAGEUTIL.response().SUCCESSFULLY_UPDATED);
        } else {
          throw MESSAGEUTIL.error().FAILED_WHILE_UPDATING_PASSWORD;
        }
      } else {
        res.forbidden(MESSAGEUTIL.error().TOKEN_NOT_AVAILABLE);
      }
    } catch (error) {
      next(error);
    }
  }

  async updateKeycloakUserPassword(req, res, next) {
    try {
      let token = await this.OauthUtil.getKeycoakAccessToken();
      if (token && token.access_token) {
        let options = {
          headers: {
            "content-type": "application/json",
            authorization: "Bearer " + token.access_token,
          },
        };
        const { id, password } = req.body;
        let data = {
          "type": "password",
          "value": password,
          "temporary": false
        }
        const updatePassword = await this.restUtil.putRequest(`${this.config.get("keycloak:admin_realm_url")}/${this.config.get("keycloak:realm")}/users/${id}/reset-password`, data, options);
        if (updatePassword?.status === 204) {
          console.log("Password Changed Successfully!!")
          res.success(updatePassword?.data, MESSAGEUTIL.response().SUCCESS);
        }
      } else {
        res.forbidden(MESSAGEUTIL.error().TOKEN_NOT_AVAILABLE);
      }

    } catch (error) {
      next(error)
    }
  }

  async updatePasswordMongodb(req, res, next) {
    try {
      let user = req.body;
      let password = await this.CommonUtil.createEncryptedPassword(
        user.password
      );

      let updateUser = await this.authService.updateMongodbUserObj(
        req.customer_config.database,
        MESSAGEUTIL.info().database_collections.users,
        { email: user.email },
        { password: password }
      );
      if (updateUser.result && updateUser.result.modifiedCount === 1) {
        res.success({}, MESSAGEUTIL.response().SUCCESSFULLY_UPDATED);
      } else {
        throw MESSAGEUTIL.error().USER_UPDATE_PASSWORD_FAILED;
      }
    } catch (error) {
      next(error);
    }
  }

  async findUserByEmailauth0(req, res, next) {
    let json = {};
    try {
      let token = await this.OauthUtil.getAccessToken();
      if (token && token.access_token) {
        let options = {
          headers: {
            "content-type": "application/json",
            authorization: "Bearer " + token.access_token,
          },
        };
        // let url = `${this.config.get("audience_management_api")}users-by-email?email=${req.params.email}&fields=created_at&include_fields=true`;

        let url = "";
        const response = await this.restUtil.getRequest(url, options);
        if (response.length > 0) {
          json = {
            user: response,
          };
        } else {
          json = {
            user: [],
          };
        }
        res.success(json, MESSAGEUTIL.response().SUCCESSFULLY_FETCHED);
      } else {
        json = {
          response: MESSAGEUTIL.error().TOKEN_NOT_AVAILABLE,
        };
        res.forbidden(json);
      }
      return json;
    } catch (error) {
      next(error);
      return error;
    }
  }

  async findUserByEmailMongodb(req, res, next) {
    let json = {};
    try {
      let response = await this.authService.findUserByEmailFromDB(
        req.customer_config.database,
        MESSAGEUTIL.info().database_collections.users,
        req.params.email,
        this.config.get("database:name")
      );
      if (response.length > 0) {
        json = {
          user: response,
        };
      } else {
        json = {
          user: [],
        };
      }
      res.success(json, MESSAGEUTIL.response().SUCCESSFULLY_FETCHED);
      return true;
    } catch (error) {
      next(error);
      return error;
    }
  }


  async updateAgentLogin(req, res, next) {
    try {
      await this.authService.updateAgentLogin(
        req.body.agent,
        req.body.endpoint
      );
      res.success({}, MESSAGEUTIL.response().SUCCESSFULLY_UPDATED);
    } catch (err) {
      next(err);
    }
  }

  async findUserByEmail(req, res, next) {
    try {
      let fetch_user_from_db = await this.authService.findUserByEmailFromDB(
        req.customer_config.database,
        MESSAGEUTIL.info().database_collections.users,
        req.params.email,
        req.params.tenant_id
      );
      res.success(
        fetch_user_from_db,
        MESSAGEUTIL.response().SUCCESSFULLY_FETCHED
      );
    } catch (error) {
      next(error);
    }
  }
  async keycloakLogin(req, res, next) {
    let response;
    let tokenSucceeded = false;

    try {
      const { username, password } = req.body;
      const data = qs.stringify({
        grant_type: "password",
        client_id: this.config.get("keycloak:client_id"),
        client_secret: this.config.get("keycloak:client_secret"),
        username: username,
        password: password,
        scope: "openid profile email",
      });

      const tokenConfig = {
        url: `${this.config.get("keycloak:url")}/realms/${this.config.get("keycloak:realm")}/protocol/openid-connect/token`,
        obj: data,
        options: {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        },
      };

      // TRY: get token (password grant)
      response = await this.restUtil.postRequest(tokenConfig.url, tokenConfig.obj, tokenConfig.options);
      tokenSucceeded = true;
      console.log("token request succeeded");

      // If token succeeded — continue original flow
      const tokenData = response && response.data ? response.data : response;
      const accessToken = tokenData.access_token;
      let userInfoConfig = {
        url: `${this.config.get("keycloak:url")}/realms/${this.config.get("keycloak:realm")}/protocol/openid-connect/userinfo`,
        options: {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      };

      const userInfoResponseRaw = await this.restUtil.getRequest(userInfoConfig.url, userInfoConfig.options);
      const userInfoResponse = userInfoResponseRaw && userInfoResponseRaw.data ? userInfoResponseRaw.data : userInfoResponseRaw;

      req.return = true;
      req.params['id'] = userInfoResponse.sub || userInfoResponse.id;
      let userMetaInfo = await this.getUserByID(req, res, next);

      const keycloakRoles =
        userMetaInfo && userMetaInfo.attributes ? userMetaInfo.attributes.role : undefined;

      let loginContext = { is_super_admin: false, role: keycloakRoles };
      try {
        loginContext = await this.adminUserService.resolveLoginContext(
          (userInfoResponse.email || username || "").trim().toLowerCase(),
          keycloakRoles
        );
      } catch (contextErr) {
        if (
          contextErr.code === "TENANT_NOT_PROVISIONED" ||
          contextErr.code === "TENANT_INACTIVE"
        ) {
          return res.status(403).json({
            response: "FAILED",
            error: {
              message: contextErr.message,
              code: contextErr.code,
            },
          });
        }
        console.warn("[keycloakLogin] tenant context lookup failed:", contextErr.message);
      }

      const userWithRoles = {
        ...userInfoResponse,
        ...userMetaInfo,
        ...loginContext,
        role: loginContext.role || keycloakRoles,
      };

      return res.success(
        {
          token: tokenData,
          user: userWithRoles,
        },
        MESSAGEUTIL.response().SUCCESSFULLY_FETCHED
      );
    } catch (error) {
      // FINAL CATCH: if token failed, run attack-detection check and pass crafted error to global handler;
      // otherwise, forward the original error.
      console.error("Error during Keycloak login (caught):", error);

      // Helper builders for errors your global error handler expects
      const makeInvalidCredentialsError = () => {
        const err = new Error("Invalid credentials");
        err.status = 401;
        err.response = {
          data: { error: "INVALID_CREDENTIALS", message: "Invalid credentials" },
          status: 401,
        };
        return err;
      };

      const makeUserBlockedError = () => {
        const err = new Error("User is blocked");
        err.status = 403;
        err.response = {
          data: { error: "USER_BLOCKED", message: "Your account has been temporarily locked due to multiple failed login attempts.Please try again after some time.", error_description: "User is blocked" },
          status: 403,
        };
        return err;
      };

      // If token did NOT succeed, check attack-detection to differentiate "blocked" vs "invalid credentials"
      if (!tokenSucceeded) {
        try {

          // get admin token
          const adminTokenResp = await this.OauthUtil.getKeycoakAccessToken();
          const adminAccessToken = adminTokenResp && (adminTokenResp.access_token || (adminTokenResp.data && adminTokenResp.data.access_token))
            ? (adminTokenResp.access_token || adminTokenResp.data.access_token)
            : null;

          if (!adminAccessToken) {
            console.warn("No admin token available for attack-detection check; throwing invalid credentials error");
            return next(makeInvalidCredentialsError());
          }

          const base = this.config.get("keycloak:url");
          const realm = this.config.get("keycloak:realm");
          const username = req.body && req.body.username;

          // Find userId by username (fallback to email)    
          console.log("searching user by username for attack-detection:", username);
          let searchResp = await this.restUtil.getRequest(
            `${base}/admin/realms/${realm}/users?username=${encodeURIComponent(username)}&exact=true`,
            { headers: { Authorization: `Bearer ${adminAccessToken}` } }
          );
          searchResp = (searchResp && searchResp.data) ? searchResp.data : searchResp;

          if (!Array.isArray(searchResp) || searchResp.length === 0) {
            console.log("username search empty; trying email search");
            let emailResp = await this.restUtil.getRequest(
              `${base}/admin/realms/${realm}/users?email=${encodeURIComponent(username)}&exact=true`,
              { headers: { Authorization: `Bearer ${adminAccessToken}` } }
            );
            searchResp = (emailResp && emailResp.data) ? emailResp.data : emailResp;
          }

          const foundUser = Array.isArray(searchResp) && searchResp.length > 0 ? searchResp[0] : null;
          if (!foundUser || !foundUser.id) {
            console.log("could not resolve userId for attack-detection; throwing invalid credentials error");
            return next(makeInvalidCredentialsError());
          }

          const userId = foundUser.id;
          console.log("calling attack-detection for userId:", userId);
          const attackRespRaw = await this.restUtil.getRequest(
            `${base}/admin/realms/${realm}/attack-detection/brute-force/users/${userId}`,
            { headers: { Authorization: `Bearer ${adminAccessToken}` } }
          );
          const attack = (attackRespRaw && attackRespRaw.data) ? attackRespRaw.data : attackRespRaw;
          console.log("attack-detection response:", attack);

          if (attack && attack.disabled === true) {
            console.log("user is disabled by attack-detection -> forwarding blocked error to global handler");
            return next(makeUserBlockedError());
          } else {
            console.log("attack-detection did not mark user disabled -> forwarding invalid credentials to global handler");
            return next(makeInvalidCredentialsError());
          }
        } catch (adminFlowErr) {
          // If attack-detection flow itself fails, log and fallback to invalid credentials
          // console.error("Error while performing attack-detection check:", adminFlowErr);
          return next(makeInvalidCredentialsError());
        }
      }

      // If token succeeded (so error happened later in flow), forward original error to global handler
      return next(error);
    }
  }

  async getUserByID(req, res, next) {
    try {
      let token = await this.OauthUtil.getKeycoakAccessToken();
      if (token && token.access_token) {
        let options = {
          headers: {
            "content-type": "application/json",
            authorization: "Bearer " + token.access_token,
          },
        };
        let url = `${this.config.get("keycloak:url")}/admin/realms/${this.config.get("keycloak:realm")}/users/${req.params.id}`;
        const response = await this.restUtil.getRequest(url, options);
        // we are also using this method internally during login the user. For this we are returning the response to parent function
        if (req.return) {
          return response;
        }
        res.success(response, MESSAGEUTIL.response().SUCCESSFULLY_FETCHED);
      } else {
        res.forbidden(MESSAGEUTIL.response().NOT_FOUND)
      }
    } catch (err) {
      if (req.return) {
        throw err;
      } else {
        next(err);
      }
    }
  }

  //find user list
  async findUser(req, res, next) {
    try {
      let fetch_user_from_db = await this.authService.findUserRole(
        req.customer_config.database,
        MESSAGEUTIL.info().database_collections.users,
        req.params.role
      );
      let returnObj = {
        userFromDB: fetch_user_from_db,
      };
      res.success(returnObj, MESSAGEUTIL.response().SUCCESSFULLY_FETCHED);
    } catch (error) {
      next(error);
    }
  }

  // Removed findUserByUserIdFromDB on 15 June 2022

  async deleteUser(req, res, next) {
    try {
      let token = await this.OauthUtil.getKeycoakAccessToken();
      let user = req.body.user;
      if (token && token.access_token) {
        let options = {
          headers: {
            "content-type": "application/json",
            authorization: "Bearer " + token.access_token,
          },
        };
        let url = `${this.config.get("keycloak:url")}/admin/realms/${this.config.get('keycloak:realm')}/users/${user.user_id}`;
        const response = await this.restUtil.deleteRequest(url, options);
        console.log("response delete api", response.status)
        if (response && response.status == 204) {
          res.success({}, MESSAGEUTIL.response().SUCCESSFULLY_DELETED);
        } else {
          throw MESSAGEUTIL.error().DELETE_USER_FAILED;
        }
      }
      else {
        res.forbidden(MESSAGEUTIL.error().USER_DELETED_FAILED)
      }
    }
    catch (error) {
      next(error)
    }
  }

  // Remove createOrganization on 15 june 2022

  async inviteToOrganization(req, res, next) {
    try {
      let token = await this.OauthUtil.getAccessToken();
      if (token && token.access_token) {
        let options = {
          headers: {
            "content-type": "application/json",
            authorization: "Bearer " + token.access_token,
          },
        };
        let data = {
          inviter: {
            name: req.body.user.inviter, //name
          },
          invitee: {
            email: req.body.user.invitee, //emailid
          },
          // client_id: this.config.get("call_ai:client_id"),
          client_id: "",
          send_invitation_email: true,
        };
        // let url = `${this.config.get("audience_management_api")}organizations/${req.body.org_id
        //   }/invitations`;
        let url = "";
        const response = await this.restUtil.postRequest(url, data, options);
        if ((response && response.status == 200) || response.status == 201) {
          res.success({}, MESSAGEUTIL.response().SUCCESSFULLY_INVITED);
        } else {
          res.serverError(MESSAGEUTIL.error().INVITE_ORGANIZATION_ERROR);
        }
      } else {
        res.forbidden(MESSAGEUTIL.error().TOKEN_NOT_AVAILABLE);
      }
    } catch (error) {
      next(error);
    }
  }

  async fetchOrganizations(req, res, next) {
    try {
      let token = await this.OauthUtil.getAccessToken();
      if (token && token.access_token) {
        let options = {
          headers: {
            "content-type": "application/json",
            authorization: "Bearer " + token.access_token,
          },
        };
        // let url = `${this.config.get("audience_management_api")}organizations`;
        let url = "";

        const response = await this.restUtil.getRequest(url, options);
        if (response && response.length > 0) {
          res.success(
            {
              organizations: response,
            },
            MESSAGEUTIL.response().SUCCESSFULLY_FETCHED
          );
        } else {
          res.notFound();
        }
      } else {
        res.forbidden(MESSAGEUTIL.error().TOKEN_NOT_AVAILABLE);
      }
    } catch (error) {
      next(error);
    }
  }

  async checkOrganizations(req, res, next) {
    try {
      const { orgName } = req.params;
      let token = await this.OauthUtil.getAccessToken();
      if (token && token.access_token) {
        let options = {
          headers: {
            "content-type": "application/json",
            authorization: "Bearer " + token.access_token,
          },
        };
        // let url = `${this.config.get("audience_management_api")}organizations`;
        let url = "";

        const response = await this.restUtil.getRequest(url, options);
        let array = [];
        for (let i = 0; i < response.length; i++) {
          array.push(response[i].name);
        }
        if (array.includes(orgName)) {
          res.success(
            {
              response: MESSAGEUTIL.error().ORGANIZATION_ALREADY_EXIST,
            },
            MESSAGEUTIL.error().ORGANIZATION_ALREADY_EXIST
          );
        } else {
          res.success(
            {
              response: MESSAGEUTIL.response().SUCCESS,
            },
            MESSAGEUTIL.error().ORGANIZATION_NOT_EXIST
          );
        }
      } else {
        res.forbidden(MESSAGEUTIL.error().TOKEN_NOT_AVAILABLE);
      }
    } catch (error) {
      next(error);
    }
  }

  async deleteOrganization(req, res, next) {
    try {
      let token = await this.OauthUtil.getAccessToken();
      if (token && token.access_token) {
        let options = {
          headers: {
            "content-type": "application/json",
            authorization: "Bearer " + token.access_token,
          },
        };
        // let url = `${this.config.get("audience_management_api")}organizations/${req.body.org_id}`;
        let url = "";

        const response = await this.restUtil.deleteRequest(url, options);
        if (response && response.status == 204) {
          res.success(
            {},
            MESSAGEUTIL.response().SUCCESSFULLY_DELETED_ORGANIZATION
          );
        } else {
          res.serverError(MESSAGEUTIL.error().DELETE_ORGANIZATION_FAILED);
        }
      } else {
        res.forbidden(MESSAGEUTIL.error().TOKEN_NOT_AVAILABLE);
      }
    } catch (error) {
      next(error);
    }
  }

  async assignUserToOrganization(access_token, org_id, member) {
    try {
      let token = access_token;
      if (token && token.access_token) {
        let options = {
          headers: {
            "content-type": "application/json",
            authorization: "Bearer " + token.access_token,
          },
        };
        let data = {
          members: [`${member}`],
        };
        // let url = `${this.config.get("audience_management_api")}organizations/${org_id}/members`;
        let url = "";

        const response = await this.restUtil.postRequest(url, data, options);
        if (response && response.status == 204) {
          await this.sendVerificationLink(options, member);
          return response;
        } else {
          throw new Error(
            MESSAGEUTIL.error().USER_NOT_ASSIGN_WITH_ORGANIZATION
          );
        }
      } else {
        throw new Error(MESSAGEUTIL.error().TOKEN_NOT_AVAILABLE);
      }
    } catch (error) {
      throw error;
    }
  }

  async removeUserFromOrganization(req, res, next) {
    try {
      let token = await this.OauthUtil.getAccessToken();
      if (token && token.access_token) {
        let options = {
          headers: {
            "content-type": "application/json",
            authorization: "Bearer " + token.access_token,
          },
          data: {
            members: req.body.data.members,
          },
        };
        // let url = `${this.config.get("audience_management_api")}organizations/${req.body.data.org_id}/members`;
        let url = "";

        const response = await this.restUtil.deleteRequest(url, options);
        if (response && response.status === 204) {
          res.success(
            {},
            MESSAGEUTIL.response().SUCCESSFULLY_REMOVED_USERS_ORGANIZATION
          );
        } else {
          res.serverError(
            MESSAGEUTIL.error().FAILED_REMOVED_USERS_ORGANIZATION
          );
        }
      } else {
        res.forbidden(MESSAGEUTIL.error().TOKEN_NOT_AVAILABLE);
      }
    } catch (error) {
      next(error);
    }
  }

  async deleteCustomer(req, res, next) {
    let level = 0;
    // let path; // disabled — only used by the MongoDB Atlas digest-auth call below
    try {
      let data = req.body;
      if (!data || Object.keys(data).length === 0) {
        res.serverError(MESSAGEUTIL.error().VALID_DATA);
      }
      let token = await this.OauthUtil.getAccessToken();
      if (token && token.access_token) {
        let options = {
          headers: {
            "content-type": "application/json",
            authorization: "Bearer " + token.access_token,
          },
        };
        /*
         * MongoDB Atlas user deletion via HTTP Digest Auth — DISABLED.
         * The frontend no longer triggers this path, and the `request-digest`
         * npm package (which pulled the deprecated `request` package with
         * moderate SSRF/qs advisories) has been removed. The corresponding
         * helper `restUtil.deleteAxioDigestRequest` is also commented out.
         * Block preserved for reference only.
         */
        // let publickey = this.config.get("agentic:mongodb:prod:publickey");
        // let privatekey = this.config.get("agentic:mongodb:prod:privatekey");
        //
        // let groupId = this.config.get("agentic:mongodb:prod:groupId");
        // let config = {
        //   username: publickey,
        //   password: privatekey,
        // };
        // // path = this.config.get("agentic:mongodb:deleteUser:path").replace("$groupId", groupId),
        // (path = ""),
        //   (path = path.replace("$databaseName", "admin")),
        //   (path = path.replace("$username", req.body.tenant_id.split("_")[1])); // for trial customer
        //
        // let url1 = {
        //   host: "https://cloud.mongodb.com",
        //   path: path,
        // };
        // await this.restUtil.deleteAxioDigestRequest(url1, config);
        level = 1;

        // delete the create bot from bot collection of bot url
        await this.authService.deleteBotByTenant(
          MESSAGEUTIL.info().database_collections.bots,
          req.body.tenant_id
        );
        level = 2;

        // delete the bot from callai customer_bot mysql table
        await this.authService.deleteBotInMysql(req.body.tenant_id);
        level = 3;
        //drop customer database
        let url = "";

        // let url = `${this.config.get("audience_management_api")}organizations/${req.body.org_id}/members`;
        await this.authService.deleteCustomerDB(req.body.tenant_id);

        level = 4;
        // delete data from psaors,psauth and psendpoints
        await this.authService.deleteFromMySqlByTenant(req.body.tenant_id);
        level = 5;
        //delete user from auth 0
        const response = await this.restUtil.getRequest(url, options);
        if (response && response.length > 0) {
          for (let i = 0; i < response.length; i++) {
            // let url = `${this.config.get("audience_management_api")}users/${response[i].user_id}`;
            let url = "";

            await this.restUtil.deleteRequest(url, options);
          }
        }
        level = 6;

        // delete organization from auth0
        // let url2 = `${this.config.get("audience_management_api")}organizations/${req.body.org_id}`;
        let url2 = "";

        const response2 = await this.restUtil.deleteRequest(url2, options);
        level = 7;
        if (response2 && response2.status == 204) {
          let response3 = await this.authService.deleteCustomerdetails(
            MESSAGEUTIL.info().database_collections.customers,
            req.body.tenant_id
          );
          if (response3 && response3.result.deletedCount == 1) {
            level = 8;
            res.success({}, MESSAGEUTIL.response().SUCCESSFULLY_DELETED);
          }
        } else {
          res.serverError(MESSAGEUTIL.error().DELETE_ORGANIZATION_FAILED);
        }
      }
    } catch (error) {
      // let to = this.config.get("mail:to")
      let to = "";
      let subject = "Customer Deletion Failed";
      let tenant_id = req.body.tenant_id;
      let tenant_name = req.body.name;
      let code;
      switch (level) {
        case 0:
          code = `Customer having tenant_id ${tenant_id} and tenant name ${tenant_name} deletion is not initialized`;
          break;
        case 1:
          code = `Data of customer having tenant_id ${tenant_id} and tenant name ${tenant_name} is deleted from mongodb Atlas and rest is not deleted.`;
          break;
        case 2:
          code = `Bot of customer having tenant_id ${tenant_id} and tenant name ${tenant_name} is deleted from bot collection and rest data of customer is not deleted`;
          break;
        case 3:
          code = `Bot of customer having tenant_id ${tenant_id} and tenant name ${tenant_name} is deleted from callai Customer Bot table and rest data of customer is not deleted`;
          break;
        case 4:
          code = `Database of customer having tenant_id ${tenant_id} and tenant name ${tenant_name} is deleted `;
          break;
        case 5:
          code = `users of customer having tenant_id ${tenant_id} and tenant name ${tenant_name} is deleted from auth0`;
          break;
        case 6:
          code = `organization of customer having tenant_id ${tenant_id} and tenant name ${tenant_name} is deleted from auth0`;
          return;
        case 7:
          code = `Organization of customer having tenant_id ${tenant_id} and tenant name ${tenant_name} is successfully deleted`;
          break;
        case 8:
          code = `Customer having tenant_id ${tenant_id} is Successfully Deleted`;
          break;
      }
      // await this.MAILUTIL.sendMail(subject, { code, error }, to)
      next(error);
    }
  }

  // BELOW METHOD ARE ONLY FOR CREATING CUSTOMERS ON TRIAL AND MASTER DB
  //***************************** START ********************************/
  async createCustomer(req, res, next) {
    let level = 0;
    let response;
    let preparedData;
    try {
      let data = req.body;
      //TODO: need to create an express validator instead of validating here
      if (!data && Object.keys(data).length === 0) {
        res.serverError(MESSAGEUTIL.error().VALID_DATA);
      }
      preparedData = await this.createUserOnAuth0(data);
      response = await this.restUtil.postRequest(
        preparedData.url,
        preparedData.obj,
        preparedData.options
      );
      if (response && response.status == 201) {
        level = 1;
        req.body.tenant_id = preparedData.obj.user_metadata.tenant_id;
        // Create user on our db and organization on Auth0
        await this.createOrganizationAndAsssignUser(req, response.data);
        this.authService.initializeMysqlTables(req.body.tenant_id);
        res.created({}, MESSAGEUTIL.response().SUCCESSFULLY_CREATED);
      } else {
        const err = response.response.data;
        res.serverError({
          code: err.statusCode,
          message: err.message,
          response: err.error,
        });
      }
    } catch (error) {
      // let to = this.config.get("mail:to")
      let to = "";
      let code = "customer creation failed";
      let subject = "Customer creation failed";
      switch (level) {
        case 1:
          // let url = `${this.config.get("audience_management_api")}users/${response.data.user_id}`
          let url = "";

          this.restUtil.deleteRequest(url, preparedData.options);
          setTimeout(async () => {
            //send creation failed email
            // await this.MAILUTIL.sendMail(subject, { code, error }, to)
          }, 20000);
      }
      next(error);
    }
  }

  async createOrganizationAndAsssignUser(req, idp_user) {
    let t;
    try {
      let reqData = req.body;
      let userID = CommonUtil.userID();
      let endpointListData = EndpointList.extensionList();
      endpointListData.aors = userID;
      endpointListData.auth = userID;
      endpointListData.id = userID;

      let login_data = {
        name: reqData.name,
        endpoint: userID,
        login_status: 0,
        aux_code: 0,
        asterisk_status: 0,
        tenant_id: reqData.tenant_id,
        role: MESSAGEUTIL.customerInfo().role.customerAdmin,
        is_active: 1,
      };
      let insertInMysql = await this.authService.insertInMysql(
        userID,
        reqData.tenant_id,
        endpointListData,
        login_data
      );
      t = insertInMysql;
      let create_user_data = {
        email: reqData.email,
        blocked: false,
        email_verified: false,
        name: reqData.name,
        user_id: idp_user.user_id, // TODO: put the unique id of user from auth0/keycloak here
        asterisk_user_id: userID,
        tenant_id: reqData.tenant_id,
        password: reqData.user_metadata.password,
        user_metadata: {
          organization_name: reqData.organization.name,
          organization_display_name: reqData.organization.name,
        },
        status: MESSAGEUTIL.info().status.active,
        isDeleted: false,
        type: MESSAGEUTIL.info().type.customer,
        role: [MESSAGEUTIL.customerInfo().role.customerAdmin],
        modified_by: reqData.modified_by,
        created_by: reqData.created_by,
      };
      req.body.create_user_data = create_user_data;
      await this.createCustomerWithDatabase(req);
      await t.commit();
      // TODO: update below method for sinding verificatio link
      // await this.sendVerificationLink(options, idp_user.user_id);
    } catch (error) {
      t.rollback();
      throw error;
    }
  }

  async createCustomerWithDatabase(req) {
    console.log("====================inside create customer with database");
    let level = 0;
    let mongoConnection = [];
    let customer;
    try {
      let reqData = req.body;
      customer = {
        tenant_id: this.config.get("database:name"),
        database: {
          user: this.config.get("database:user"),
          host: this.config.get("database:host"),
          password: this.config.get("database:password"),
          name: this.config.get("database:name"),
        },
      };
      // user create on tenant db collection
      let createUserOnCustomerDB =
        await this.authService.createUserOnTrialCluster(
          customer.database,
          MESSAGEUTIL.info().database_collections.users,
          reqData.create_user_data
        );
      mongoConnection.push(createUserOnCustomerDB);
      level = 1;

      customer.database.user = CryptoJS.AES.encrypt(
        customer.database.user,
        MESSAGEUTIL.info().cryptoSecret
      ).toString();
      customer.database.password = CryptoJS.AES.encrypt(
        customer.database.password,
        MESSAGEUTIL.info().cryptoSecret
      ).toString();
      customer.database.host = CryptoJS.AES.encrypt(
        customer.database.host,
        MESSAGEUTIL.info().cryptoSecret
      ).toString();
      customer.database.name = CryptoJS.AES.encrypt(
        customer.database.name,
        MESSAGEUTIL.info().cryptoSecret
      ).toString();
      let apiKey = await this.authService.createRandomToken(16);
      let customerConfig = {
        apiKey: CryptoJS.AES.encrypt(
          apiKey,
          MESSAGEUTIL.info().cryptoSecret
        ).toString(),
        tenant_id: customer.tenant_id,
        database: customer.database,
        status: MESSAGEUTIL.info().status.active,
        created_by: reqData.created_by,
        modified_by: reqData.created_by,
        tenant_name: reqData.name,
        user_metadata: reqData.create_user_data.user_metadata,
      };

      delete reqData.create_user_data;
      // Cutomer data insert on master db
      let insertCustomeDBDetails = await this.authService.insertCustomerdetails(
        MESSAGEUTIL.info().database_collections.customers,
        customerConfig
      );

      mongoConnection.push(insertCustomeDBDetails);
      if (insertCustomeDBDetails && insertCustomeDBDetails.result[0]._id) {
        await this.transactionOperation(
          MESSAGEUTIL.info().transaction_type.commit,
          mongoConnection
        );
        return insertCustomeDBDetails;
      }
    } catch (error) {
      if (error && error.originatedFrom) {
        mongoConnection.push(error);
      }
      switch (level) {
        case 1:
          // this.authService.deleteCustomerDB(this.config.get("database:name"));
          await this.transactionOperation(
            MESSAGEUTIL.info().transaction_type.abort,
            mongoConnection
          );
      }
      throw error;
    }
  }

  async createUserOnAuth0(data) {
    try {
      let token = await this.OauthUtil.getAccessToken();
      if (token && token.access_token) {
        let options = {
          headers: {
            "content-type": "application/json",
            authorization: "Bearer " + token.access_token,
          },
        };
        let tenant_id = CommonUtil.userID();
        data.user_metadata.tenant_id = `tenant_${tenant_id}`;
        let obj = {
          email: data.email,
          blocked: false,
          email_verified: false,
          name: data.name,
          password: data.password,
          verify_email: false,
          // connection: this.config.get("oauth:connection_name"),
          connection: "",
          user_metadata: data.user_metadata,
        };
        // Creating user on Auth0
        // let url = `${this.config.get("audience_management_api")}users`;
        let url = "";

        return { url, obj, options };
      } else {
        throw new Error(MESSAGEUTIL.error().TOKEN_NOT_AVAILABLE);
      }
    } catch (error) {
      throw error;
    }
  }

  async fetchAllCustomers(req, res, next) {
    try {
      let data = {
        limit: req.params.pageSize,
        skip: req.params.pageIndex,
      };
      const response = await this.authService.fetchAllCustomers(
        MESSAGEUTIL.info().database_collections.customers,
        data
      );
      res.success(
        {
          customers: response,
        },
        MESSAGEUTIL.response().SUCCESSFULLY_FETCHED
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteUserAuth0(req, res, next) {
    try {
      const data = req.body;
      if (!data || Object.keys(data).length === 0) {
        res.serverError(MESSAGEUTIL.error().VALID_DATA);
      }
      let token = await this.OauthUtil.getAccessToken();
      if (token && token.access_token) {
        let options = {
          headers: {
            "content-type": "application/json",
            authorization: "Bearer " + token.access_token,
          },
        };
        // let url = `${this.config.get("audience_management_api")}users/${req.body.userid}`;
        let url = "";
        const response = await this.restUtil.deleteRequest(url, options);
        if (response && response.status == 204) {
          res.success({}, MESSAGEUTIL.response().SUCCESSFULLY_DELETED);
        } else {
          res.serverError(MESSAGEUTIL.error().DELETE_USER_FAILED);
        }
      } else {
        res.forbidden(MESSAGEUTIL.error().TOKEN_NOT_AVAILABLE);
      }
    } catch (error) {
      next(error);
    }
  }

  async resendVerificationLink(req, res) {
    try {
      let token = await this.OauthUtil.getAccessToken();
      if (token && token.access_token) {
        let options = {
          headers: {
            "content-type": "application/json",
            authorization: "Bearer " + token.access_token,
          },
        };
        let auth_id = req.params.auth_id;
        let user_id = auth_id.split("|")[1];
        let data = {
          user_id: auth_id,
          identity: {
            user_id: user_id,
            provider: "auth0",
          },
        };
        // let url = `${this.config.get("audience_management_api")}jobs/verification-email`;
        let url = "";
        const response = await this.restUtil.postRequest(url, data, options);
        if (response && response.data.id) {
          res.success({}, MESSAGEUTIL.response().USER_RESEND_VERIFICATION);
        } else {
          res.serverError(
            MESSAGEUTIL.error().USER_RESEND_VERIFICATION_LINK_FAILED
          );
        }
      } else {
        res.forbidden(MESSAGEUTIL.error().USER_RESEND_VERIFICATION_LINK_FAILED);
      }
    } catch (error) {
      res.serverError({ error: error.message });
    }
  }

  async searchCustomer(req, res, next) {
    try {
      const search = req.params.searchvalue;
      const result = await this.authService.searchCustomer(
        MESSAGEUTIL.info().database_collections.customers,
        search
      );
      res.success(result, MESSAGEUTIL.response().SUCCESSFULLY_FETCHED);
    } catch (error) {
      next(error);
    }
  }

  async filterCustomer(req, res, next) {
    try {
      const { condition } = req.body;
      let filteredCondition;
      if (condition.org_name) {
        filteredCondition = {
          "user_metadata.organization_name": {
            $regex: `${condition.org_name}`,
          },
          ...filteredCondition,
        };
      }
      if (condition.tenant_name) {
        filteredCondition = {
          tenant_name: { $regex: `${condition.tenant_name}` },
          ...filteredCondition,
        };
      }
      let data = {
        limit: req.body.pageSize,
        skip: req.body.pageIndex,
      };

      const result = await this.authService.filterCustomer(
        MESSAGEUTIL.info().database_collections.customers,
        filteredCondition,
        data
      );
      res.success(result, MESSAGEUTIL.response().SUCCESSFULLY_FETCHED);
    } catch (error) {
      next(error);
    }
  }

  async sortCustomer(req, res, next) {
    try {
      const { field, order_by } = req.params;
      let data = {
        limit: req.params.pageSize,
        skip: req.params.pageIndex,
      };
      let sortingCondition;
      if (field === "customerName") {
        sortingCondition = { tenant_name: order_by };
      }
      if (field === "organizationName") {
        sortingCondition = { "user_metadata.organization_name": order_by };
      }
      if (field === "createdDate") {
        sortingCondition = { created_at: order_by };
      }
      const result = await this.authService.sortCustomer(
        MESSAGEUTIL.info().database_collections.customers,
        sortingCondition,
        data
      );
      res.success(result, MESSAGEUTIL.response().SUCCESSFULLY_FETCHED);
    } catch (error) {
      next(error);
    }
  }

  async expirationDate(req, res, next) {
    try {
      const expirationDate = req.body.data.expirationDate;
      const tenant_id = req.body.data.tenant_id;
      const response = await this.authService.expirationDate(
        MESSAGEUTIL.info().database_collections.customers,
        tenant_id,
        expirationDate
      );
      res.success(response.result);
    } catch (error) {
      next(error);
    }
  }

  async statusUpdate(req, res, next) {
    try {
      console.log("In console status update try")
      let token = await this.OauthUtil.getKeycoakAccessToken();
      let user = req.body;
      if (token && token.access_token) {
        let data = {
          enabled: user.status
        };
        let options = {
          headers: {
            "content-type": "application/json",
            authorization: "Bearer " + token.access_token,
          },
        };
        let url = `${this.config.get("keycloak:url")}/admin/realms/${this.config.get('keycloak:realm')}/users/` + user.user_id;
        await this.restUtil.putRequest(url, data, options);
        res.success({}, MESSAGEUTIL.response().SUCCESSFULLY_UPDATED);
      }
      else {
        res.forbidden(MESSAGEUTIL.error().USER_UPDATED_FAILED)
      }
    } catch (error) {
      next(error);
    }
  }

  async filterUserList(req, res, next) {
    try {
      let token = await this.OauthUtil.getKeycoakAccessToken();
      if (token && token.access_token) {
        let options = {
          headers: {
            "content-type": "application/json",
            authorization: "Bearer " + token.access_token,
          },
        };
        let offset = req.body.pageIndex * req.body.pageSize;
        let baseUrl = `${this.config.get("keycloak:url")}/admin/realms/${this.config.get('keycloak:realm')}/users`;
        let queryParams = [];
        let queryParamsCount = [];
        if (req.body.status === true || req.body.status === false) {
          queryParams.push(`enabled=${req.body.status}`);
          queryParamsCount.push(`enabled=${req.body.status}`);
        }

        queryParams.push(`first=${offset}`);
        queryParams.push(`max=${req.body.pageSize}`);

        if (req.body.name) {
          queryParams.push(`search=${req.body.name}`);
          queryParamsCount.push(`search=${req.body.name}`);
        }

        // Here we are adding the type as user (as a query) to filter out service accounts as they are not considered as users in the context of this API.
        // as keycloak does not allow to filter service accounts by type, so we have to filter them out.
        queryParams.push("q=type:user");
        queryParamsCount.push("q=type:user");
        let url = `${baseUrl}?${queryParams.join('&')}`;
        let countBaseUrl = `${this.config.get("keycloak:url")}/admin/realms/${this.config.get('keycloak:realm')}/users/count`;
        let url_count = `${countBaseUrl}?${queryParamsCount.join('&')}`;
        const response = await this.restUtil.getRequest(url, options);
        const count_response = await this.restUtil.getRequest(url_count, options);
        let sys_users = 0;
        let final_response = [];
        console.log("response length initial", response.length, "count_response", count_response);
        if (response && response.length > 0) {
          final_response = response.filter(user => {
            const isServiceAccount = user.username.toLowerCase().includes("service-account");
            if (isServiceAccount) sys_users++;
            return !isServiceAccount;
          });
        }
        res.accepted({
          users: final_response,
          total: count_response - sys_users
        }, MESSAGEUTIL.response().SUCCESSFULLY_FETCHED);
      }
      else {
        res.forbidden(MESSAGEUTIL.error().USER_UPDATE_PASSWORD_FAILED)
      }
    } catch (error) {
      next(error)
    }
  }

  
  async filterWaUserList(req, res, next) {
    try {
      let token = await this.OauthUtil.getKeycoakAccessToken();
  
      if (!token || !token.access_token) {
        return res.accepted({ users: [], total: 0 }, "Token not found");
      }
  
      const options = {
        headers: {
          "content-type": "application/json",
          authorization: "Bearer " + token.access_token,
        },
      };
  
      const { pageIndex = 0, pageSize = 10, name, status } = req.body;
      const offset = pageIndex * pageSize;
  
      const baseUrl = `${this.config.get("keycloak:url")}/admin/realms/${this.config.get("keycloak:realm")}/users`;
  
      let allUsers = [];
      let first = 0;
      const batchSize = 1000; // Keycloak max per request
  
      while (true) {
        const params = [`first=${first}`, `max=${batchSize}`];
  
        // 🔍 Name search
        if (name) params.push(`search=${encodeURIComponent(name.trim())}`);
  
        // ✅ Status filter
        if (status === true || status === false) params.push(`enabled=${status}`);
  
        const url = `${baseUrl}?${params.join("&")}`;
  
        const resBatch = await axios.get(url, options);
        const batch = resBatch.data || [];
  
        if (batch.length === 0) break;
  
        allUsers = allUsers.concat(batch);
  
        if (batch.length < batchSize) break; // last batch
        first += batchSize;
      }
  
      const allowedRoles = new Set(
        Array.isArray(req.body.allowedRoles) && req.body.allowedRoles.length
          ? req.body.allowedRoles.map((role) => String(role).toLowerCase())
          : ["wa_sme", "wa_admin", "wa_user"]
      );
      const filteredUsers = [];
  
      for (const u of allUsers) {
        const roles = u?.attributes?.role;
        if (!roles) continue;
  
        for (const r of roles) {
          if (allowedRoles.has(String(r).toLowerCase())) {
            filteredUsers.push(u);
            break;
          }
        }
      }
  
      const finalUsers = filteredUsers.slice(offset, offset + pageSize);
  
      return res.accepted(
        {
          users: finalUsers,
          total: filteredUsers.length,
        },
        MESSAGEUTIL.response().SUCCESSFULLY_FETCHED
      );
  
    } catch (error) {
      // console.error("Error filtering users:", error);
      return res.accepted({ users: [], total: 0 }, "Error occurred");
    }
  }
  
  
  async getUserListInWorker(req, res, next) {
    try {
      const token = await this.OauthUtil.getKeycoakAccessToken();
      if (!token || !token.access_token) {
        return res.forbidden(MESSAGEUTIL.error().USER_UPDATE_PASSWORD_FAILED);
      }
      const max = req.body.pageSize || 1000;
      const first = req.body.pageIndex || 0;

      const options = {
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token.access_token}`,
        },
      };
      const url = `${this.config.get("keycloak:url")}/admin/realms/${this.config.get('keycloak:realm')}/users?first=${first}&max=${max}`;

      const users = await this.restUtil.getRequest(url, options);

      if (!users || !Array.isArray(users) || users.length === 0) {
        return res.accepted({ usernames: [] }, MESSAGEUTIL.response().SUCCESSFULLY_FETCHED);
      }
      const usernames = users.filter(user => user.username && !user.username.toLowerCase().includes("service-account"))
        .map(user => user.username);

      return res.accepted(
        { usernames },
        MESSAGEUTIL.response().SUCCESSFULLY_FETCHED
      );

    } catch (error) {
      next(error);
    }
  }



  async sendVerificationLink(options, auth_id) {
    try {
      let user_id = auth_id.split("|")[1];
      let data = {
        user_id: auth_id,
        identity: {
          user_id: user_id,
          provider: "auth0",
        },
      };
      // let url = `${this.config.get("audience_management_api")}jobs/verification-email`;
      let url = "";
      const response = await this.restUtil.postRequest(url, data, options);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateUserRole(req, res, next) {
    try {
      let token = await this.OauthUtil.getAccessToken();
      if (token && token.access_token) {
        let data = {
          role: req.body.role,
        };

        await this.authService.updateUserInfo(
          req.customer_config.database,
          MESSAGEUTIL.info().database_collections.users,
          asterisk_user_id,
          data
        );
        res.success({}, MESSAGEUTIL.response().SUCCESSFULLY_UPDATED);
      } else {
        res.forbidden(MESSAGEUTIL.error().TOKEN_NOT_AVAILABLE);
      }
    } catch (error) {
      next(error);
    }
  }

  async customerDetailUpdate(customer, res, next) {
    try {
      customer.database.user = CryptoJS.AES.encrypt(
        customer.database.user,
        MESSAGEUTIL.info().cryptoSecret
      ).toString();

      customer.database.password = CryptoJS.AES.encrypt(
        customer.database.password,
        MESSAGEUTIL.info().cryptoSecret
      ).toString();

      customer.database.host = CryptoJS.AES.encrypt(
        customer.database.host,
        MESSAGEUTIL.info().cryptoSecret
      ).toString();

      customer.database.name = CryptoJS.AES.encrypt(
        customer.database.name,
        MESSAGEUTIL.info().cryptoSecret
      ).toString();

      let updateCustomer_Billing_Info = {
        database: customer.database,
        environment: MESSAGEUTIL.info().customer_environment.prod,
      };
      let updateCustomerBillingInfo =
        await this.authService.updateCustomerDatabase(
          customer.tenant_id,
          MESSAGEUTIL.info().database_collections.customers,
          updateCustomer_Billing_Info
        );

      if (updateCustomerBillingInfo.result.modifiedCount === 1) {
        // method to delete the backup file
        unlink(`${customer.archive_path}`, (err) => {
          if (err) throw err;
          res.success(
            { message: MESSAGEUTIL.response().CUSTOMER_TRIAL_TO_PRODUCTION },
            MESSAGEUTIL.response().CUSTOMER_TRIAL_TO_PRODUCTION
          );
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async mongorestore(customer, res) {
    try {
      let url1 = customer.database.host;
      url1 = url1.replace("$username", customer.database.user);
      url1 = url1.replace("$password", customer.database.password);
      url1 = url1.replace("$database", customer.database.name);

      let restoreProcess = spawn("mongorestore", [
        `--authenticationDatabase=admin`,
        `--uri=${url1}`,
        `${customer.archive_path}`,
        `--archive=${customer.archive_path}`,
        "--gzip",
      ]);
      restoreProcess.stdout.on("data", (data) => {
      });
      restoreProcess.stderr.on("data", (data) => {
      });
      restoreProcess.on("close", (data) => {
        this.customerDetailUpdate(customer, res); //updating the customer Detail on master db in customer collection
      });
      restoreProcess.on("error", (error) => {
        console.log("error:\n", error);
        throw error;
      });
    } catch (error) {
      throw error;
    }
  }

  async fetchSidebar(req, res, next) {
    try {
      const response = await this.authService.fetchSidebar(
        MESSAGEUTIL.info().database_collections.sidebar
      );
      res.success(
        {
          sidebar: response.data,
          response: MESSAGEUTIL.response().SUCCESS,
        },
        MESSAGEUTIL.response().SUCCESSFULLY_FETCHED
      );
    } catch (error) {
      next(error);
      return error;
    }
  }

  async getAuthenticationTokenForAPIM(req, res, next) {
    try {
      let data = {
        // client_id: this.config.get("auth_api_token_apim:client_id"),
        client_id: "",
        // client_secret: this.config.get("auth_api_token_apim:client_secret"),
        client_secret: "",
        audience: "",
        // audience: this.config.get("audience"),
        grant_type: "client_credentials",
      };
      // let url = this.config.get("oauth:token_url");
      let url = "";
      const response = await this.restUtil.postRequest(url, data, {});
      if (response && response.statusText == "OK") {
        res.success(response.data, MESSAGEUTIL.response().SUCCESSFULLY_FETCHED);
      } else {
        res.serviceUnavailable();
      }
    } catch (error) {
      throw error;
    }
  }

  //update timezone
  async updateUserTimeZone(req, res, next) {
    try {
      let user = req.body;
      let data_for_processing = {
        timeZone: user.timeZone,
        email: user.email,
      };
      let updateUser = this.authService.updateUserTimeZone(
        req.customer_config.database,
        MESSAGEUTIL.info().database_collections.users,
        data_for_processing
      );
      if (updateUser) {
        res.success({}, {}, MESSAGEUTIL.response().SUCCESSFULLY_UPDATED);
      } else {
      }
    } catch (error) {
      next(error);
    }
  }

  async SimplefilterUserList(req, res, next) {
    try {
      let token = await this.OauthUtil.getAccessToken();
      if (token && token.access_token) {
        let VerificationPending = req.body?.status.includes(
          "VerificationPending"
        );
        let Inactive = req.body?.status.includes("Inactive");
        let Active = req.body?.status.includes("Active");
        let req_obj = req.body;
        let options = {
          headers: {
            "content-type": "application/json",
            authorization: "Bearer " + token.access_token,
          },
        };
        let query;
        switch (true) {
          case VerificationPending && Active && !Inactive:
            if (req_obj.selectedRolebyuser.length > 0) {
              query = `blocked:${Inactive} AND user_metadata.organization_id:${req_obj.org_id} AND (`;
            } else {
              query = `blocked:${Inactive} AND user_metadata.organization_id:${req_obj.org_id}`;
            }
            break;

          case VerificationPending && Inactive && !Active:
            if (req_obj.selectedRolebyuser.length > 0) {
              query = `(blocked:${!Inactive} AND user_metadata.organization_id:${req_obj.org_id
                } AND email_verified:${!VerificationPending} || blocked:${Inactive} AND user_metadata.organization_id:${req_obj.org_id
                } AND email_verified:${VerificationPending}) AND (`;
            } else {
              query = `(blocked:${!Inactive} AND user_metadata.organization_id:${req_obj.org_id
                } AND email_verified:${!VerificationPending} || blocked:${Inactive} AND user_metadata.organization_id:${req_obj.org_id
                } AND email_verified:${VerificationPending}) `;
            }
            break;

          case !VerificationPending && Active && Inactive:
            if (req_obj.selectedRolebyuser.length > 0) {
              query = `user_metadata.organization_id:${req_obj.org_id
                } AND email_verified:${!VerificationPending} AND (`;
            } else {
              query = `user_metadata.organization_id:${req_obj.org_id
                } AND email_verified:${!VerificationPending}`;
            }
            break;

          case VerificationPending && !Active && !Inactive:
            if (req_obj.selectedRolebyuser.length > 0) {
              query = `email_verified:${!VerificationPending} AND user_metadata.organization_id:${req_obj.org_id
                } AND (`;
            } else {
              query = `email_verified:${!VerificationPending} AND user_metadata.organization_id:${req_obj.org_id
                }`;
            }
            break;

          case Active && !VerificationPending && !Inactive:
            if (req_obj.selectedRolebyuser.length > 0) {
              query = `blocked:${!Active} AND email_verified:${!VerificationPending} AND user_metadata.organization_id:${req_obj.org_id
                } AND (`;
            } else {
              query = `blocked:${!Active} AND email_verified:${!VerificationPending} AND user_metadata.organization_id:${req_obj.org_id
                }`;
            }
            break;

          case Inactive && !Active && !VerificationPending:
            if (req_obj.selectedRolebyuser.length > 0) {
              query = `blocked:${Inactive} AND user_metadata.organization_id:${req_obj.org_id} AND (`;
            } else {
              query = `blocked:${Inactive} AND user_metadata.organization_id:${req_obj.org_id}`;
            }
            break;

          case !Inactive && !Active && !VerificationPending:
            if (req_obj.selectedRolebyuser.length > 0) {
              query = `user_metadata.organization_id: ${req_obj.org_id} AND (`;
            } else {
              query = `user_metadata.organization_id: ${req_obj.org_id}`;
            }
            break;

          case Inactive && Active && VerificationPending:
            if (req_obj.selectedRolebyuser.length > 0) {
              query = `user_metadata.organization_id: ${req_obj.org_id} AND (`;
            } else {
              query = `user_metadata.organization_id: ${req_obj.org_id}`;
            }
            break;
        }
        for (let i = 0; i < req_obj.selectedRolebyuser.length; i++) {
          if (req_obj.selectedRolebyuser.length == 1) {
            query =
              query + `user_metadata.role:${req_obj.selectedRolebyuser[i]})`;
          } else {
            if (i == req_obj.selectedRolebyuser.length - 1) {
              query =
                query +
                `user_metadata.role:${req_obj.selectedRolebyuser[i]}` +
                ")";
            } else {
              query =
                query +
                `user_metadata.role:${req_obj.selectedRolebyuser[i]} OR `;
            }
          }
        }

        options.params = {
          q: query,
          sort: `${req_obj.field ? req_obj.field : "name"}:${req_obj.order ? req_obj.order : "1"
            }`,
        };
        options.fields = [
          "created_at",
          "email",
          "last_login",
          "name",
          "user_metadata.employee_id",
          "user_metadata.role",
          "blocked",
          "email_verified",
          "user_id",
        ];

        // let url = `${this.config.get("audience_management_api")}users?page=${req_obj.pageIndex
        //   }&per_page=${req_obj.pageSize}&include_totals=true&fields=${options.fields}`;
        let url = "";

        const response = await this.restUtil.getRequest(url, options);
        res.success(
          {
            users: response.users,
          },
          MESSAGEUTIL.response().SUCCESSFULLY_FETCHED
        );
      } else {
        res.forbidden(MESSAGEUTIL.error().USER_FETCH_FAILED);
      }
    } catch (error) {
      next(error);
    }
  }

  async fetchContacts(req, res, next) {
    try {
      const response = await this.authService.fetchContacts(
        req.customer_config.database,
        MESSAGEUTIL.info().database_collections.users,
        req.params.tenant_id
      );
      res.success(response, MESSAGEUTIL.response().SUCCESS);
    } catch (error) {
      next(error);
      return error;
    }
  }

  async findAgentCounts(tenant_id) {
    let data_to_emit;
    if (tenant_id) {
      data_to_emit = await this.authService.fetchAgents(tenant_id);
    }
    return data_to_emit;
  }

  async uploadLogo(req, res, next) {
    try {
      if (!req.files) {
        res.notFound(MESSAGEUTIL.response().NOT_UPLOAD_FILE);
      }
      const logoData = {
        tenant_id: req.body.tenant_id,
        tag: req.body.tag,
        updated_at: DATEUTIL.getTimeStringFromTimezone(),
      };
      if (req.files.header && req.files.header[0]) {
        logoData.header = {
          data: req.files.header[0].buffer,
          contentType: req.files.header[0].mimetype,
        };
      }
      if (req.files.login && req.files.login[0]) {
        logoData.login = {
          data: req.files.login[0].buffer,
          contentType: req.files.login[0].mimetype,
        };
      }
      const response = await this.authService.uploadLogo(
        MESSAGEUTIL.info().database_collections.logo,
        logoData,
        req.customer_config.database
      );
      if (response) {
        res.success(response, MESSAGEUTIL.response().SUCCESSFULLY_UPLOADED);
      } else {
        res.notFound(MESSAGEUTIL.response().NOT_UPLOAD_FILE);
      }
    } catch (error) {
      console.log("ERROR", error);
      next(error);
    }
  }

  async fetchLogo(req, res, next) {
    try {
      const response = await this.authService.fetchLogo(
        MESSAGEUTIL.info().database_collections.logo,
        req.customer_config.database
      );
      if (response && response.header && response.header && response.login) {
        console.log("CHECK________:::::::::", response.tag);
        res.imgSuccess(
          response.header.data,
          response.header.contentType,
          response.tag,
          MESSAGEUTIL.response().SUCCESSFULLY_IMG_FETCHED
        );
      } else {
        console.log("senidng emtpy res");
        res.imgSuccess(
          {},
          "application/json",
          "",
          MESSAGEUTIL.response().NO_IMG_FETCHED
        );
      }
    } catch (error) {
      next(error);
    }
  }
  async testMysqlConnection(req, res, next) {
    try {
      const response = await this.authService.testMysqlConnection();
      res.success({}, MESSAGEUTIL.response().SUCCESS);
    } catch (error) {
      console.log("error::::::::::: in testMysqlConnection controller layer::: ", error);
      next(error);
    }
  }
  async testMongoConnection(req, res, next) {
    try {
      const response = await this.authService.testMongoConnection();
      res.success(response, MESSAGEUTIL.response().SUCCESS);
    } catch (error) {
      console.log("error::::::::::: in testMongoConnection controller layer::: ", error);
      next(error);
    }
  }
  async testRedisConnection(req, res, next) {
    try {
      // const redisservice = new REDISSERVICE(this.config)
      const response = await this.authService.testRedisConnection();
      res.success(response, MESSAGEUTIL.response().SUCCESS);
    } catch (error) {
      console.log("error::::::::::: in testRedisConnection controller layer::: ", error);
      next(error);
    }
  }

  async signUp(req, res, next) {
    let mongoConnections;
    try {
      console.log("ReqBody for signUp:::::", req.body);
      // fetch tenant_id from config
      req.body['tenant_id'] = this.config.get('database:name');
      // Generate a unique user ID
      let userID = CommonUtil.userID();
      req.body['userID'] = userID;
      // Start MongoDB transaction
      mongoConnections = await this.createCustomerForFirstRunSignUp(req.body);
      // Start Mysql transaction
      this.authService.initializeMysqlTables(req.body.tenant_id);
      res.success({ tenant_id: req.body.tenant_id }, MESSAGEUTIL.response().SUCCESSFULLY_UPDATED);
    } catch (error) {
      console.log("error in signup controller:::::::::controller layer::", error, "error:msg:::::::", error.message)
      next(error);
    }
  }
  // Function to create customer and user in Keycloak and restore LLM and Global Config Collection in Tenant DB
  async createCustomerForFirstRunSignUp(data) {
    console.log("::::::::::::::::::::::inside create createCustomerForFirstRunSignUp")
    let connection = []
    try {
      // Create a new user in Keycloak;
      let createUserInKeycloak = await this.authService.createKeycloakUser(data);
      connection.push(createUserInKeycloak);
      // Restore LLM and Global Config Collection in Tenant DB;
      let restoreTenantDbCollection = await this.authService.restoreMongoDBCollection({ domain: data.domain, signupRestore: true });
      connection.push(restoreTenantDbCollection);
      console.log("create user in keycloak ::::", createUserInKeycloak);
      console.log("restore tenant db collection:::", restoreTenantDbCollection);
      return connection;
    } catch (error) {
      console.log("error in createCustomerForFirstRunSignUp controller layer:::::", error, "error:msg:::::::::", error.message)
      throw error;
    }
  }

  async restoreMysqlDbTable(req, res, next) {
    console.log("::::::::::::::::::::::inside restoreMysqlDbTable");
    let mysqlConnections;
    try {
      mysqlConnections = await this.authService.restoreMysqlTable();
      console.log("mysqlConnections:::::::::::controller layer", mysqlConnections);
      res.success(mysqlConnections, MESSAGEUTIL.response().SUCCESSFULLY_UPDATED);
    } catch (error) {
      console.log("error in restoreMysqlDbTable controller layer:::::", error, "error:msg:::::::::", error.message);
      next(error);
    }
  }

  async executeIvaToAvaSqlFile(req, res, next) {
    console.log("::::::::::::::::::::::inside executeIvaToAvaSqlFile");
    try {
      const continueOnError =
        req?.query?.continue_on_error === '1' ||
        req?.query?.continue_on_error === 'true' ||
        req?.query?.continue_on_error === 'yes';
      const result = await this.authService.executeIvaToAvaSqlFile({ continueOnError });
      res.success(result, MESSAGEUTIL.response().SUCCESSFULLY_UPDATED);
    } catch (error) {
      console.log("error in executeIvaToAvaSqlFile controller layer:::::", error, "error:msg:::::::::", error.message);
      next(error);
    }
  }

  async getFirstRunStatusInMysql(req, res, next) {
    console.log("::::::::::::::::::::::inside getFirstRunStatusInMysql");
    try {
      let domain = req.params.domain;
      console.log("domain::::::: in controller", domain);
      let response = await this.authService.getFirstRunStatusInMysql(domain);
      let responseforCreate = false;
      if (!response) {
        const status = {
          dbIntialization: false,
          stepper: "dbIntialization",
          mysqldb: false,
          mongodb: false,
          redis: false,
          domain: domain,
          builderdb_restore: false,
          inserted_collection: [],
          mysqldb_restore: false,
          inserted_tables: [],
          sign_up: false,
          user_config: {
            email: "",
            password: "",
            username: ""
          },
          created_by: "devops@vimo.com",
          modified_by: "devops@vimo.com"
        };
        responseforCreate = await this.authService.createFirstRunStatusInMysql(status);
        console.log("responseforCreate::::::::::::controller layer", responseforCreate);
        await responseforCreate.transaction.commit();
      }
      response = responseforCreate == false ? response : responseforCreate.result;
      console.log("reposne for get first run sattus::::controller layer", response);
      res.success(response, MESSAGEUTIL.response().SUCCESS);
    } catch (error) {
      console.log("error in getFirstRunStatusInMysql controller layer:::::", error, "error:msg:::::::::", error.message);
      //Note: Handle specific error for missing table(first run status)
      if (error.name === 'SequelizeDatabaseError' && error.original.code === 'ER_NO_SUCH_TABLE') {
        return res.success({
          success: false,
          tableMissing: true
        }, MESSAGEUTIL.response().TABLE_MISSING);
      }
      next(error);
    }
  }

  async updateFirstRunStatusInMysql(req, res, next) {
    try {
      console.log("Request Body:::::::updateFirstRunStatusInMysql::::", req.body);
      const response = await this.authService.updateFirstRunStatusInMysql(req.body);
      res.success(response, MESSAGEUTIL.response().SUCCESSFULLY_UPDATED);
    } catch (error) {
      console.log("error in updateFirstRunStatusInMysql controller layer:::::", error, "error:msg:::::::::", error.message);
      next(error);
    }
  }

  async createExternalKeycloakUsers(req, res, next) {
    try {
      //Proceed only if admin credentials match
      if (req.body.id == 'keycloak-admin' && req.body.pass == 'X9$kL#7v@2!qTzP4*R8w') {
        let data = {
          email: req.body.email,
          name: req.body.name,
          password: req.body.password,
          role: req.body.role,
        };
        let createUserInKeycloak = await this.authService.createKeycloakUser(data);
        res.success(
          {
            status: createUserInKeycloak.status,
            statusText: createUserInKeycloak.statusText,
            data: createUserInKeycloak.data || createUserInKeycloak.config?.data
          },
          MESSAGEUTIL.response().SUCCESSFULLY_CREATED
        );
      } else {
        return res.status(401).json({ error: 'Unauthorized: Invalid admin credentials to access Keycloak externally.' });
      }
    } catch (error) {
      console.log("error in createExternalKeycloakUsers controller layer:::::", error, "error:msg:::::::::", error.message);
      next(error);
    }
  }

  async getConfigValueThoughKeyName(req, res, next) {
    try {
      let result = await this.authService.getConfigValueThoughKeyName(req.params.config_key_name);
      res.success({ result }, MESSAGEUTIL.response().SUCCESSFULLY_FETCHED);
    } catch (err) {
      next(err);
    }
  }

  async createconfigValue(req, res, next) {
    try {
      let data = {
        config_value: req.body.config_value,
        config_key: req.body.config_key,
      }
      await this.authService.createconfigValue(
        data
      );
      res.success({}, MESSAGEUTIL.response().SUCCESSFULLY_UPDATED);
    } catch (err) {
      next(err);
    }
  }
  
  async forgotPasswordController(req, res, next) {
    try {
      const { email } = req.body;
  
      const result = await this.authService.forgotPassword(email);
  
      res.success({
        message: result.triggered
          ? MESSAGEUTIL.response().PASSWORD_RESET_EMAIL_SENT
          : "User does not exist",
        triggered: result.triggered
      }, MESSAGEUTIL.response().SUCCESSFULLY_FETCHED);
  
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthenticationController;
