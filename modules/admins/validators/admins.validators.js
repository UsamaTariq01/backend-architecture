const GlobalLib = require('../../utils'),
    Logger = require('../../../configurations/logger.winston'),
    { check, param, body } = require('express-validator');

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

module.exports = {
    validateEmail,
    validatePassword
};