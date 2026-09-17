const { check } = require('express-validator')
const CommonUtil = require('../../../../../common/utils/common-util');

class AUTHENTICATIONVALIDATION {
    constructor() {
        this.createUser = this.createUser.bind(this); // done some changes
        this.updateUser = this.updateUser.bind(this); // done some changes
        this.updateUserInfo = this.updateUserInfo.bind(this); // done some changes
        this.createCustomer = this.createCustomer.bind(this);

        this.updatePassword = this.updatePassword.bind(this);
        this.updatePasswordAuth0 = this.updatePasswordAuth0.bind(this);
        this.filterCustomer = this.filterCustomer.bind(this); // done no changes
        this.deleteUser = this.deleteUser.bind(this);
        this.inviteToOrganization = this.inviteToOrganization.bind(this); // api implications not found
        this.filterUserList = this.filterUserList.bind(this); // done no changes
        this.expirationDate = this.expirationDate.bind(this); // done some changes
        this.statusUpdate = this.statusUpdate.bind(this); // done no changes
        this.deleteOrganization = this.deleteOrganization.bind(this); // api implications not found
        this.removeUserFromOrganization = this.removeUserFromOrganization.bind(this); // api implications not found
        this.deleteUserAuth0 = this.deleteUserAuth0.bind(this);
        this.findUserByEmailauth0 = this.findUserByEmailauth0.bind(this);
        this.searchCustomer = this.searchCustomer.bind(this);
        this.sortCustomer = this.sortCustomer.bind(this);
        this.fetchAllCustomers = this.fetchAllCustomers.bind(this);
        this.findUserByEmailForLogin = this.findUserByEmailForLogin.bind(this);
        this.findUserByEmail = this.findUserByEmail.bind(this);
        this.checkOrganizations = this.checkOrganizations.bind(this);
        this.resendVerificationLink = this.resendVerificationLink.bind(this);
        this.findUser = this.findUser.bind(this); // done some changes
        this.SimplefilterUserList = this.SimplefilterUserList.bind(this);
        this.updateAgentLogin = this.updateAgentLogin.bind(this);
    }
    async createUser(req, res, next) {
        await check('user.email')
            .isString()
            .withMessage('Email must be a String')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Please enter a valid email address').run(req);
        await check('user.name')
            .isString()
            .withMessage('name must be a String')
            .notEmpty()
            .withMessage('name is required')
            .isAlpha('en-US', { ignore: ' ' })
            .withMessage('Name should contains only alphabets').run(req);
        await check('user.ip').isString()
            .withMessage('ip must be a String')
            .notEmpty()
            .withMessage('ip is required')
            .custom(value => !/\s/.test(value))
            .withMessage('No spaces are allowed in the ip').run(req);
        await check('user.created_by')
            .notEmpty()
            .withMessage('created by email is required')
            .isEmail()
            .withMessage('Please enter a valid email address').run(req);
        await check('user.password')
            .notEmpty()
            .withMessage('password is required')
            .isString()
            .withMessage('password must be a String')
            .isLength({ min: 5 })
            .withMessage('must be at least 5 chars long').run(req);
        await check('user.role')
            .notEmpty()
            .withMessage('role is required')
            .isString()
            .withMessage('role must be a String')
            .custom(value => !/\s/.test(value))
            .withMessage('role Spaces is not allowed').run(req);
        CommonUtil.errorChecker(req, res, next);
    }
    async createUserWA(req, res, next) {
        await check('user.email')
            .isString()
            .withMessage('Email must be a String')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Please enter a valid email address').run(req);
        await check('user.name')
            .isString()
            .withMessage('name must be a String')
            .notEmpty()
            .withMessage('name is required')
            .isAlpha('en-US', { ignore: ' ' })
            .withMessage('Name should contains only alphabets').run(req);
        await check('user.ip').isString()
            .withMessage('ip must be a String')
            .notEmpty()
            .withMessage('ip is required')
            .custom(value => !/\s/.test(value))
            .withMessage('No spaces are allowed in the ip').run(req);
        await check('user.created_by')
            .notEmpty()
            .withMessage('created by email is required')
            .isEmail()
            .withMessage('Please enter a valid email address').run(req);
        await check('user.password')
            .notEmpty()
            .withMessage('password is required')
            .isString()
            .withMessage('password must be a String')
            .isLength({ min: 5 })
            .withMessage('must be at least 5 chars long').run(req);
        await check('user.role')
            .notEmpty()
            .withMessage('role is required')
            .isString()
            .withMessage('role must be a String')
            .custom(value => !/\s/.test(value))
            .withMessage('role Spaces is not allowed').run(req);
        await check('user.organization')
            .optional({ nullable: true })
            .isString()
            .withMessage('organization must be a String').run(req);
        CommonUtil.errorChecker(req, res, next);
    }

    async updateUser(req, res, next) {
        await check('user.name')
            .isString()
            .withMessage('name must be a String')
            .notEmpty()
            .withMessage('name is required')
            .isAlpha('en-US', { ignore: ' ' })
            .withMessage('Name should contains only alphabets').run(req);
        await check('user.role')
            .notEmpty()
            .withMessage('role is required')
            .isString()
            .withMessage('role must be a String')
            .isAlphanumeric('en-US', { ignore: '_-' })
            .withMessage('role must be alpha-numeric and can contain dash(-) and underscore(_).').run(req);
        await check('user.id')
            .notEmpty()
            .withMessage('User id is required')
            .isString()
            .withMessage('User id must be a String')
            .custom(value => !/\s/.test(value))
            .withMessage('No spaces are allowed in the user id').run(req);
        await check('user.status')
            .notEmpty()
            .withMessage('status is required')
            .isString()
            .withMessage('status must be a String')
            .isIn(['ACTIVE', 'INACTIVE'])
            .withMessage('field is required only ACTIVE and INACTIVE').run(req);
        CommonUtil.errorChecker(req, res, next);
    }
    async updateUserWA(req, res, next) {
        await check('user.name')
            .isString()
            .withMessage('name must be a String')
            .notEmpty()
            .withMessage('name is required')
            .isAlpha('en-US', { ignore: ' ' })
            .withMessage('Name should contains only alphabets').run(req);
        await check('user.role')
            .notEmpty()
            .withMessage('role is required')
            .isString()
            .withMessage('role must be a String')
            .isAlphanumeric('en-US', { ignore: '_-' })
            .withMessage('role must be alpha-numeric and can contain dash(-) and underscore(_).').run(req);
        await check('user.organization')
            .optional({ nullable: true })
            .isString()
            .withMessage('organization must be a String').run(req);
        await check('user.id')
            .notEmpty()
            .withMessage('User id is required')
            .isString()
            .withMessage('User id must be a String')
            .custom(value => !/\s/.test(value))
            .withMessage('No spaces are allowed in the user id').run(req);
        await check('user.status')
            .notEmpty()
            .withMessage('status is required')
            .isString()
            .withMessage('status must be a String')
            .isIn(['ACTIVE', 'INACTIVE'])
            .withMessage('field is required only ACTIVE and INACTIVE').run(req);
        CommonUtil.errorChecker(req, res, next);
    }

    async updateUserInfo(req, res, next) {
CommonUtil.errorChecker(req, res, next);

    }

    async createCustomer(req, res, next) {

        await check('created_by')
            .isString()
            .withMessage('created by  must be a String')
            .notEmpty()
            .withMessage('created by is required')
            .isAlpha('en-US', { ignore: ' ' })
            .withMessage('created by should contains only alphabets').run(req);
        await check('password')
            .isString()
            .withMessage('password must be a String')
            .notEmpty()
            .withMessage('password is required')
            .isLength({ min: 5 })
            .withMessage('must be at least 5 chars long').run(req)
        // .matches('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$')
        // .withMessage('Password should be 8 characters long with a capital letter,small letter,number and special character').run(req);
        await check('email')
            .isString()
            .withMessage('Email must be a String')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Please enter a valid email address').run(req);
        await check('name')
            .isString()
            .withMessage('name must be a String')
            .notEmpty()
            .withMessage('name is required')
            .isAlpha('en-US', { ignore: ' ' })
            .withMessage('Name should contains only alphabets').run(req);
        await check('organization.name')
            .notEmpty()
            .withMessage('organization name is required')
            .isString()
            .withMessage('organization name must be a String')
            .isAlphanumeric('en-US', { ignore: '_-' })
            .withMessage('No spaces are allowed in the organization_name ').run(req);
        await check('organization.display_name')
            .notEmpty()
            .withMessage('organization display_name is required')
            .isString()
            .withMessage('organization display_name must be a String').run(req);
        await check('user_metadata.type').isString()
            .withMessage('type must be a String')
            .isAlpha()
            .withMessage('type should contains only alphabets with not a space').run(req);
        await check('user_metadata.organization_name')
            .notEmpty()
            .withMessage('organization name is required')
            .isString()
            .withMessage('organization name must be a String')
            .isAlphanumeric('en-US', { ignore: '_-' })
            .withMessage('No spaces are allowed in the metadata organization name').run(req);
        await check('user_metadata.organization_display_name')
            .notEmpty()
            .withMessage('organization display name is required')
            .isString()
            .withMessage('organization display name must be a String').run(req);
        await check('user_metadata.password')
            .notEmpty()
            .withMessage('password is required')
            .isString()
            .withMessage('password must be a String')
            .isLength({ min: 5 })
            .withMessage('must be at least 5 chars long').run(req)
        // .matches('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$')
        // .withMessage('Password should be 8 characters long with a capital letter,small letter,number and special character').run(req);
        await check('user_metadata.role')
            .notEmpty()
            .withMessage('role is required').run(req);
        CommonUtil.errorChecker(req, res, next);

    }

    async updatePassword(req, res, next) {

await check('user.email')
            .notEmpty()
            .withMessage('Email is required')
            .isString()
            .withMessage('Email must be a String')
            .isEmail()
            .withMessage('Please enter a valid email address').run(req);
        await check('user.current_password')
            .isString()
            .withMessage('current password must be a String')
            .notEmpty().run(req);
        await check('user.new_password')
            .isString()
            .withMessage('new password must be a String')
            .notEmpty()
            .withMessage('new password is required')
            .isLength({ min: 5 })
            .withMessage('new password must be at least 5 chars long')
            .run(req);
        // .matches('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$')
        // .withMessage('new Password should be 8 characters long with a capital letter,small letter,number and special character')

        await check('user.user_id')
            .notEmpty()
            .withMessage('user id is required')
            .isString()
            .withMessage('user id must be a String')
            .custom(value => !/\s/.test(value))
            .withMessage('No spaces are allowed in the user id').run(req);
        await check('user.base_password_changed')
            .notEmpty()
            .withMessage('base password changed is required')
            .isBoolean()
            .withMessage('base password  must be a Boolean').run(req);
        CommonUtil.errorChecker(req, res, next);

    }

    async updatePasswordAuth0(req, res, next) {

await check('password')
            .isString()
            .withMessage('password must be a String')
            .notEmpty()
            .withMessage('password is required')
            .isLength({ min: 5 })
            .withMessage('password must be at least 5 chars long')
            .run(req);
        // .matches('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$')
        // .withMessage('Password should be 8 characters long with a capital letter,small letter,number and special character')
        await check('user_id')
            .notEmpty()
            .withMessage('user id is required')
            .isString()
            .withMessage('user id must be a String')
            .custom(value => !/\s/.test(value))
            .withMessage('No spaces are allowed in the user id').run(req);
        CommonUtil.errorChecker(req, res, next);

    }

    async filterCustomer(req, res, next) {

        await check('condition.org_name')
            .isString()
            .withMessage('organization name must be a String').run(req);
        await check('condition.tenant_name').isString()
            .isString()
            .withMessage('tenant name must be a String').run(req);
        await check('pageSize')
            .notEmpty()
            .withMessage('Page Size is required')
            .isInt()
            .withMessage('Page Size must be a String').run(req);
        await check('pageIndex')
            .notEmpty()
            .withMessage('Page Index is required')
            .isInt()
            .withMessage('Page Index must be a Integer value').run(req);
        CommonUtil.errorChecker(req, res, next);

    }

    async deleteUser(req, res, next) {

        await check('user.email')
            .isString()
            .withMessage('email must be a String')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Please enter a valid email address').run(req);
        await check('user.ip').isString()
            .withMessage('ip must be a String')
            .notEmpty()
            .withMessage('ip is required')
            .custom(value => !/\s/.test(value))
            .withMessage('ip Spaces is not allowed').run(req);
        await check('user.modified_by')
            .notEmpty()
            .withMessage('modified by email is required')
            .isEmail()
            .withMessage('Please enter a valid modified by email address').run(req);

await check('user.user_id')
            .notEmpty()
            .withMessage('user id is required')
            .isString()
            .withMessage('user id must be a String').run(req);
        CommonUtil.errorChecker(req, res, next);

    }

    async inviteToOrganization(req, res, next) {

        await check('inviter')
            .isString()
            .withMessage('inviter name must be a String')
            .notEmpty()
            .withMessage('inviter name is required')
            .isAlpha('en-US', { ignore: ' ' })
            .withMessage('inviter Name should contains only alphabets').run(req);
        await check('user.invitee')
            .isString()
            .withMessage('invitee email must be a String')
            .notEmpty()
            .withMessage('invitee Email is required')
            .isEmail()
            .withMessage('Please enter a valid invitee email address').run(req);
await check('org_id')
            .notEmpty()
            .withMessage('organization id is required')
            .isString()
            .withMessage('organization id must be a String')
            .custom(value => !/\s/.test(value))
            .withMessage('organization id space is not allowed').run(req);
        CommonUtil.errorChecker(req, res, next);

    }

    async filterUserList(req, res, next) {

        await check('pageSize')
            .notEmpty()
            .withMessage('Page Size is required')
            .isInt()
            .withMessage('Page Size must be a String').run(req);
        await check('pageIndex')
            .notEmpty()
            .withMessage('Page Index is required')
            .isInt()
            .withMessage('Page Index must be a Integer value').run(req);
        await check('name')
            .isString()
            .withMessage('name must be a String').run(req);
        CommonUtil.errorChecker(req, res, next);

    }

    async SimplefilterUserList(req, res, next) {

        await check('pageSize')
            .notEmpty()
            .withMessage('Page Size is required')
            .isInt()
            .withMessage('Page Size must be a String').run(req);
        await check('pageIndex')
            .notEmpty()
            .withMessage('Page Index is required')
            .isInt()
            .withMessage('Page Index must be a Integer value').run(req);
        await check('org_id')
            .notEmpty()
            .withMessage('organization id is required')
            .isString()
            .withMessage('organization id must be a String')
            .custom(value => !/\s/.test(value))
            .withMessage('organization id space is not allowed').run(req);
        await check('status')
            .isArray()
            .withMessage('selected status By User must be a Array').run(req);
        await check('field')
            .notEmpty()
            .withMessage('field id is required')
            .isString()
            .withMessage('field id must be a String').run(req);
        await check('order')
            .notEmpty()
            .withMessage('order id is required')
            .isInt()
            .withMessage('order id must be a Integer').run(req);
        await check('selectedRolebyuser')
            .isArray()
            .withMessage('selected Role By User must be a Array').run(req);
        CommonUtil.errorChecker(req, res, next);

    }

    async updateAgentLogin(req, res, next) {

        // await check('asterisk_id')
        //     .notEmpty()
        //     .withMessage('asterisk_id is required').run(req);
        // await check('login.login_status')
        //     .notEmpty()
        //     .withMessage('login_status is required')
        //     .isBoolean()
        //     .withMessage('login_status must be a Boolean value').run(req);
        CommonUtil.errorChecker(req, res, next);

    }

    async expirationDate(req, res, next) {

await check('data.expirationDate')
            .notEmpty()
            .withMessage('expirationDate is required')
            .isString()
            .withMessage('expirationDate must be a String').run(req);
        CommonUtil.errorChecker(req, res, next);

    }

    async statusUpdate(req, res, next) {

        await check('email')
            .isString()
            .withMessage('Email must be a String')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Please enter a valid email address').run(req);

        await check('ip').isString()
            .withMessage('ip must be a String')
            .notEmpty()
            .withMessage('ip is required')
            .custom(value => !/\s/.test(value))
            .withMessage('ip Spaces is not allowed').run(req);
        await check('modified_by')
            .notEmpty()
            .withMessage('modified by  is required')
            .isEmail()
            .withMessage('modified by should be email').run(req);
await check('user_id')
            .notEmpty()
            .withMessage('user id is required')
            .isString()
            .withMessage('user id must be a String')
            .custom(value => !/\s/.test(value))
            .withMessage('user id is not allowed').run(req);
        await check('status')
            .isBoolean().withMessage('status value should be boolean')
            .notEmpty()
            .withMessage('status is required')
            .isIn([true, false])
            .withMessage('status should be true or false').run(req);
        CommonUtil.errorChecker(req, res, next);

    }

    async deleteOrganization(req, res, next) {

        await check('org_id').isString()
            .withMessage('org id must be a String')
            .notEmpty()
            .withMessage('org id is required')
            .custom(value => !/\s/.test(value))
            .withMessage('organization_id spaces is not allowed').run(req);
        CommonUtil.errorChecker(req, res, next);

    }

    async removeUserFromOrganization(req, res, next) {

        await check('data.org_id').isString()
            .withMessage('org id must be a String')
            .notEmpty()
            .withMessage('org id is required')
            .custom(value => !/\s/.test(value))
            .withMessage('organization_id spaces is not allowed').run(req);
        await check('data.members').isString()
            .withMessage('members must be a String')
            .notEmpty()
            .withMessage('members is required')
            .custom(value => !/\s/.test(value))
            .withMessage('members spaces is not allowed').run(req);
        CommonUtil.errorChecker(req, res, next);

    }

    async deleteUserAuth0(req, res, next) {

        await check('userid').isString()
            .withMessage('userid must be a String')
            .notEmpty()
            .withMessage('userid is required')
            .custom(value => !/\s/.test(value))
            .withMessage('userid spaces is not allowed').run(req);
        CommonUtil.errorChecker(req, res, next);

    }

    async findUserByEmailauth0(req, res, next) {

        await check('email')
            .isString()
            .withMessage('email must be a String')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Please enter a valid email address').run(req);
        CommonUtil.errorChecker(req, res, next);

    }

    async searchCustomer(req, res, next) {

        await check('searchvalue')
            .isString()
            .withMessage('searchvalue must be a String')
            .notEmpty()
            .withMessage('searchvalue is required').run(req);
        CommonUtil.errorChecker(req, res, next);

    }
    async updateKeycloakUserPassword(req, res, next) {

        await check('id')
            .notEmpty()
            .withMessage('Id is required')
            .isString()
            .withMessage('Id must be a String').run(req);

        await check('password')
            .isString()
            .withMessage('password must be a String')
            .notEmpty()
            .withMessage('password is required')
            .isLength({ min: 5 })
            .withMessage('must be at least 5 chars long').run(req)

        CommonUtil.errorChecker(req, res, next);

    }

    async sortCustomer(req, res, next) {

        await check('field')
            .isString()
            .withMessage('field must be a String')
            .notEmpty()
            .withMessage('field is required')
            .isIn(['customerName', 'organizationName', 'createdDate'])
            .withMessage('field is required only customerName AND organizationName AND created_at').run(req);
        await check('order_by')
            .isString()
            .withMessage('order_by must be a String')
            .notEmpty()
            .withMessage('order_by is required')
            .isIn(['1', '-1'])
            .withMessage('order_by is required only 1 AND -1').run(req);
        await check('pageSize')
            .notEmpty()
            .withMessage('Page Size is required')
            .isInt()
            .withMessage('Page Size must be a String').run(req);
        await check('pageIndex')
            .notEmpty()
            .withMessage('Page Index is required')
            .isInt()
            .withMessage('Page Index must be a Integer value').run(req);
        CommonUtil.errorChecker(req, res, next);

    }

    async fetchAllCustomers(req, res, next) {

        await check('pageSize')
            .notEmpty()
            .withMessage('Page Size is required')
            .isInt()
            .withMessage('Page Size must be a Integer value').run(req);
        await check('pageIndex')
            .notEmpty()
            .withMessage('Page Index is required')
            .isInt()
            .withMessage('Page Index must be a Integer value').run(req);
        CommonUtil.errorChecker(req, res, next);

    }

    async findUserByEmailForLogin(req, res, next) {

        await check('email')
            .isString()
            .withMessage('email must be a String')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Please enter a valid email address').run(req);
        CommonUtil.errorChecker(req, res, next);

    }

    async findUserByEmail(req, res, next) {

        await check('email')
            .isString()
            .withMessage('Email must be a String')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Please enter a valid email address').run(req);
        CommonUtil.errorChecker(req, res, next);

    }

    async checkOrganizations(req, res, next) {

        await check('orgName')
            .isString()
            .withMessage('orgName must be a String')
            .notEmpty()
            .withMessage('orgName is required').run(req);
        CommonUtil.errorChecker(req, res, next);

    }

    async resendVerificationLink(req, res, next) {

        await check('auth_id').isString()
            .withMessage('auth_id must be a String')
            .notEmpty()
            .withMessage('auth_id is required')
            .custom(value => !/\s/.test(value))
            .withMessage('auth_id spaces is not allowed').run(req);
        CommonUtil.errorChecker(req, res, next);

    }

    async findUser(req, res, next) {

await check('role')
            .notEmpty()
            .withMessage('role is required')
            .isString()
            .withMessage('role must be a String')
            .isAlpha('en-US', { ignore: '_' })
            .withMessage('role should contains only alphabets and space is not allowed').run(req);
        CommonUtil.errorChecker(req, res, next);

    }
    async keycloakLogin(req, res, next) {
        console.log('keycloakLogin validation called');

        await check('password')
            .isString()
            .withMessage('password must be a String')
            .notEmpty()
            .withMessage('password is required')
            .isLength({ min: 5 })
            .withMessage('must be at least 5 chars long').run(req)

        await check('username')
            .isString()
            .withMessage('Username must be a String')
            .notEmpty()
            .withMessage('Username is required')
            .isEmail()
            .withMessage('Please enter a valid username').run(req);

        CommonUtil.errorChecker(req, res, next);

    }
    async createExternalKeycloakUsers(req, res, next) {
        console.log('createExternalKeycloakUsers validation called');

        // Validate name
        await check('name')
            .isString()
            .withMessage('Name must be a string')
            .notEmpty()
            .withMessage('Name is required')
            .run(req);

        // Validate username as email
        await check('email')
            .isString()
            .withMessage('email must be a string')
            .notEmpty()
            .withMessage('email is required')
            .isEmail()
            .withMessage('Please enter a valid email for email')
            .run(req);

        // Validate password
        await check('password')
            .isString()
            .withMessage('Password must be a string')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 5 })
            .withMessage('Password must be at least 5 characters long')
            .run(req);

        // Validate role
        await check('role')
            .isString()
            .withMessage('Role must be a string')
            .notEmpty()
            .withMessage('Role is required')
            .run(req);

        // Check for errors
        CommonUtil.errorChecker(req, res, next);
    }
    async keycloakForgotPassword(req, res, next) {
        console.log('keycloakForgotPassword validation called');

        // Validate username as email
        await check('email')
            .isString()
            .withMessage('email must be a string')
            .notEmpty()
            .withMessage('email is required')
            .isEmail()
            .withMessage('Please enter a valid email for email')
            .run(req);

        // Check for errors
        CommonUtil.errorChecker(req, res, next);
    }
}

module.exports = AUTHENTICATIONVALIDATION