const { check, body } = require('express-validator');
const CommonUtil = require('../../../../../common/utils/common-util');

class DISPOSITIONVALIDATION {
    constructor() {
        this.createDisposition = this.createDisposition.bind(this);
        this.fetchDispositions = this.fetchDispositions.bind(this);
        this.fetchDispositionById = this.fetchDispositionById.bind(this);
        this.updateDisposition = this.updateDisposition.bind(this);
        this.deleteDisposition = this.deleteDisposition.bind(this);
    }

    async createDisposition(req, res, next) {
await check('uid').isString()
            .withMessage('Uid is required')
            .isString()
            .withMessage('Uid must be a String').run(req);

        await body('name')
            .notEmpty()
            .withMessage('name is required')
            .isString()
            .withMessage('name must be a string').run(req);

        await body('disposition')
            .notEmpty()
            .withMessage('disposition is required')
            .isString()
            .withMessage('disposition must be a string').run(req);

        await body('label_correctness')
            .notEmpty()
            .withMessage('label correctness is required')
            .isBoolean()
            .withMessage('label correctness must be a boolean').run(req);

        await body('created_by')
            .notEmpty()
            .withMessage('created by is required')
            .isString()
            .withMessage('created by must be a string').run(req);

        CommonUtil.errorChecker(req, res, next);
    }

    async fetchDispositions(req, res, next) {
CommonUtil.errorChecker(req, res, next);
    }

    async fetchDispositionById(req, res, next) {
await check('uid').isString()
            .notEmpty()
            .withMessage('Uid is required')
            .isString()
            .withMessage('Uid must be a String').run(req);

        CommonUtil.errorChecker(req, res, next);
    }

    async updateDisposition(req, res, next) {
await check('uid').isString()
            .notEmpty()
            .withMessage('Uid is required')
            .isString()
            .withMessage('Uid must be a String').run(req);

        await body('id')
            .notEmpty()
            .withMessage('id is required')
            .isString()
            .withMessage('id must be a string').run(req);

        await body('name')
            .notEmpty()
            .withMessage('name is required')
            .isString()
            .withMessage('name must be a string').run(req);

        await body('disposition')
            .notEmpty()
            .withMessage('disposition is required')
            .isString()
            .withMessage('disposition must be a string').run(req);

        await body('label_correctness')
            .notEmpty()
            .withMessage('label correctness is required')
            .isBoolean()
            .withMessage('label correctness must be a boolean').run(req);

        await body('updated_by')
            .notEmpty()
            .withMessage('updated by is required')
            .isString()
            .withMessage('updated by must be a string').run(req);

        CommonUtil.errorChecker(req, res, next);
    }

    async deleteDisposition(req, res, next) {
await check('uid').isString()
            .notEmpty()
            .withMessage('Uid is required')
            .isString()
            .withMessage('Uid must be a String')
            .isNumeric()
            .withMessage('Uid is numeric value').run(req);

        await check('id')
            .notEmpty()
            .withMessage('id is required')
            .isString()
            .withMessage('id must be a string').run(req);

        CommonUtil.errorChecker(req, res, next);
    }
}

module.exports = DISPOSITIONVALIDATION;