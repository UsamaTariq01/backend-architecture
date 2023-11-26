const GlobalLib = require('../../utils'),
    Logger = require('../../../configurations/logger.winston'),
    { check, param } = require('express-validator');

const validateUserSignUp = async (req, res, next) => {

    try {

        await check('phoneNumber').notEmpty().trim().isMobilePhone().withMessage(100).run(req);
        await check('email').notEmpty().trim().isString().isEmail().withMessage(104).run(req);
        await check('name').notEmpty().trim().isString().withMessage(105).run(req);
        return GlobalLib.ValidateResponse('Initial Registration', req, res, next);

    } catch (err) {

        Logger.error(err);
        return next({ code: 2 });

    }

};
const validatePhoneNumber = async (req, res, next) => {

    try {

        await check('phoneNumber').notEmpty().trim().isMobilePhone().withMessage(100).run(req);
        return GlobalLib.ValidateResponse('resend', req, res, next);

    } catch (err) {

        Logger.error(err);
        return next({ code: 2 });

    }

};
const validateEmail = async (req, res, next) => {

    try {

        await check('email').notEmpty().trim().isString().isEmail().withMessage(104).run(req);
        return GlobalLib.ValidateResponse('resend', req, res, next);

    } catch (err) {

        Logger.error(err);
        return next({ code: 2 });

    }

};
const validatephoneVerificationCode = async (req, res, next) => {

    try {

        await check('phoneVerificationCode').notEmpty().isString().trim().withMessage(100).run(req);
        return GlobalLib.ValidateResponse('resend', req, res, next);

    } catch (err) {

        Logger.error(err);
        return next({ code: 2 });

    }

};
const validatePassword = async (req, res, next) => {

    try {

        await check('password').notEmpty().trim()
            .isString()
            .withMessage(115)
            .isLength({ min: 8 })
            .withMessage(115)
            .matches(/\d/)
            .withMessage(115)
            .matches(/[a-zA-Z]/)
            .withMessage(115)
            .matches(/[!@#$%^&*(),.?":{}|<>]/)
            .withMessage(115).run(req);
        return GlobalLib.ValidateResponse('resend', req, res, next);

    } catch (err) {

        Logger.error(err);
        return next({ code: 2 });

    }

};

module.exports = {
    validateUserSignUp,
    validatePhoneNumber,
    validatephoneVerificationCode,
    validatePassword,
    validateEmail

};
