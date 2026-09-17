const OauthUtil = require("../utils/Oauth-util")
const CONFIG = require('../utils/config-util');
const RestUtil = require("../utils/rest-util");

class Auth0RoleAcess {

    constructor() {
        this.config = CONFIG;
        this.restUtil = new RestUtil();
        this.OauthUtil = new OauthUtil(CONFIG);
        this.auth0RolesById = this.auth0RolesById.bind(this);
    }

    async auth0RolesById(user) {
        try {
            let auth0RolesNames = []
            let auth0RolesIds = []
            let auth0RoleFinal = [];
            let auth0RoleFinalToRemove = [];
            let roleArray = user.role ? user.role : user.user_metadata.role
            let token = await this.OauthUtil.getAuthorizationAccessToken();
            // console.log("token ", token)
            if (token && token.access_token) {
                let options = {
                    headers: {
                        "content-type": "application/json",
                        authorization: "Bearer " + token.access_token,
                    },
                };
                console.log("options ", options)
                // let url = this.config.get('authentication_extention_auth0:api_url') + 'roles';
                let url = '';
                const response = await this.restUtil.getRequest(url, options);
                response.roles.forEach(element => {
                    auth0RolesNames.push(element.name)
                    auth0RolesIds.push(element._id)
                });

                roleArray.forEach((ele) => {
                    console.log(ele, auth0RolesNames.indexOf(ele.split('_').join(' ')));
                    let index = auth0RolesNames.indexOf(ele.split('_').join(' '));
                    if (index >= 0) {
                        auth0RoleFinal.push(auth0RolesIds[index])
                    }
                })
                auth0RolesIds.forEach((ele) => {
                    let index = auth0RoleFinal.indexOf(ele);
                    console.log("index", index, ele)
                    if (index < 0) {
                        auth0RoleFinalToRemove.push(ele)
                    }
                })
                console.log("FINEAL RESULT OF ROLE TO REMOVE AUTH0", auth0RoleFinalToRemove)
                return { auth0RoleFinalToRemove, auth0RoleFinal }
            }
            else {
                next("Error Occurred. Please check your request and try again")
            }
        }
        catch (error) {
            next(error)
        }

    }


}

module.exports = Auth0RoleAcess;       