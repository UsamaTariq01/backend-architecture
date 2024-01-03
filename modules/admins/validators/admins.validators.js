const GlobalLib = require('../../utils'),
    Logger = require('../../../configurations/logger.winston'),
    { check, param, body, query } = require('express-validator');

const validateEmail = async (req, res, next) => {

    try {

        await body('email').notEmpty().trim().escape().isString().isEmail()
            .normalizeEmail({ all_lowercase: true })
            .withMessage(104).run(req);
        return GlobalLib.ValidateResponse('email validation', req, res, next);

    } catch (err) {

        Logger.error(err);
        return next({ code: 2 });

    }

};
const validatePassword = async (req, res, next) => {

    try {

        await body('password').notEmpty().trim().escape()
            .isString()
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            })
            .withMessage(115).run(req);
        return GlobalLib.ValidateResponse('password validation', req, res, next);

    } catch (err) {

        Logger.error(err);
        return next({ code: 2 });

    }

};

const validateListing = async (req, res, next) => {

    try {

        await query('limit').optional().trim().escape().isInt({ min: 1 }).withMessage(1004).run(req);
        await query('offset').optional().trim().escape().isInt({ min: 0 }).withMessage(1005).run(req);
        await query('searchText').optional().trim().escape().isString().withMessage(1006).run(req);
        await query('sort').optional().trim().escape().isString().isIn(['DESC', 'ASC']).withMessage(1007).run(req);


        return GlobalLib.ValidateResponse('validate user listings', req, res, next);

    } catch (err) {

        Logger.error(err);
        return next({ code: 2 });

    }

};

module.exports = {
    validateEmail,
    validatePassword,
    validateListing
};